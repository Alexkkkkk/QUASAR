"""Unit tests for the merged-PR issue closer extraction logic."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from issue_closer import extract_closing_references  # noqa: E402


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


if __name__ == "__main__":
    unittest.main()
