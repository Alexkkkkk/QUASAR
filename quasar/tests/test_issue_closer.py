"""Unit tests for the merged-PR issue closer extraction logic."""

from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

import issue_closer  # noqa: E402
from issue_closer import (  # noqa: E402
    GitHubApiError,
    collect_commit_messages,
    close_issue,
    extract_closing_references,
    issue_state,
    main,
)


class ExtractClosingReferencesTest(unittest.TestCase):
    def test_explicit_keywords(self):
        text = "Closes #1\nfixes #2\nRESOLVED: #3\nfixed #4\nresolve #5"
        self.assertEqual(extract_closing_references(text), {1, 2, 3, 4, 5})

    def test_duplicate_references_deduplicated(self):
        text = "Closes #7, closes #7 again, Fixes #7"
        self.assertEqual(extract_closing_references(text), {7})

    def test_plain_reference_does_not_close(self):
        self.assertEqual(extract_closing_references("see #5 and refs #6"), set())

    def test_non_closing_before_closing(self):
        text = "see #5, fixes #5"
        self.assertEqual(extract_closing_references(text), {5})

    def test_no_keyword_no_close(self):
        self.assertEqual(extract_closing_references("related to #10"), set())

    def test_multi_digit_numbers(self):
        self.assertEqual(extract_closing_references("Fixes #1234"), {1234})

    def test_keyword_with_colon(self):
        self.assertEqual(extract_closing_references("Closes: #42"), {42})

    def test_case_insensitive_and_mixed(self):
        text = "ClOsEs #9\nno issue here\nfixed #9"
        self.assertEqual(extract_closing_references(text), {9})

    def test_numbers_inside_words_ignored(self):
        self.assertEqual(extract_closing_references("issue #abc #12version"), set())


class GitHubApiBehaviorTest(unittest.TestCase):
    def test_collects_commit_messages_across_pages(self):
        with patch(
            "issue_closer.api_request",
            side_effect=[
                (
                    [{"commit": {"message": "Fixes #12"}}],
                    {"Link": '<https://api.github.com/repos/o/r/pulls/3/commits?page=2>; rel="next"'},
                ),
                (
                    [{"commit": {"message": "Closes #13"}}],
                    {},
                ),
            ],
        ) as request:
            self.assertEqual(
                collect_commit_messages("o/r", 3, "token"),
                ["Fixes #12", "Closes #13"],
            )

        self.assertIn("page=1", request.call_args_list[0].args[0])
        self.assertIn("page=2", request.call_args_list[1].args[0])

    def test_issue_state_reports_closed_issue(self):
        with patch("issue_closer.api_request", return_value=({"state": "closed"}, {})):
            self.assertEqual(issue_state("o/r", 12, "token"), "closed")

    def test_issue_state_maps_only_404_to_missing(self):
        with patch(
            "issue_closer.api_request",
            side_effect=GitHubApiError(404, "https://api.github.com/repos/o/r/issues/12"),
        ):
            self.assertEqual(issue_state("o/r", 12, "token"), "missing")

    def test_issue_state_does_not_hide_other_api_errors_as_missing(self):
        with patch(
            "issue_closer.api_request",
            side_effect=GitHubApiError(500, "https://api.github.com/repos/o/r/issues/12"),
        ):
            with self.assertRaises(GitHubApiError):
                issue_state("o/r", 12, "token")

    def test_main_skips_closed_and_missing_issues(self):
        with (
            patch.object(sys, "argv", ["issue_closer.py", "--repo", "o/r", "--pr", "3", "--token", "token"]),
            patch("issue_closer.collect_pr_text", return_value="Closes #12 and fixes #13"),
            patch("issue_closer.collect_commit_messages", return_value=[]),
            patch("issue_closer.issue_state", side_effect=["closed", "missing"]),
            patch("issue_closer.close_issue") as close,
        ):
            self.assertEqual(main(), 0)
        close.assert_not_called()

    def test_close_does_not_clear_issue_body_and_closes_before_comment(self):
        response = MagicMock()
        with patch("issue_closer.urlopen") as open_url:
            open_url.return_value.__enter__.return_value = response
            self.assertTrue(close_issue("o/r", 12, "token", 3))

        close_request = open_url.call_args_list[0].args[0]
        comment_request = open_url.call_args_list[1].args[0]
        self.assertEqual(close_request.method, "PATCH")
        self.assertEqual(close_request.full_url, "https://api.github.com/repos/o/r/issues/12")
        self.assertEqual(
            json.loads(close_request.data),
            {"state": "closed", "state_reason": "completed"},
        )
        self.assertEqual(comment_request.method, "POST")
        self.assertTrue(comment_request.full_url.endswith("/issues/12/comments"))


if __name__ == "__main__":
    unittest.main()
