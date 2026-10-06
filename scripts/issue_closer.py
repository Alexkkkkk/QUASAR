#!/usr/bin/env python3
"""Close issues referenced with explicit closing keywords in a merged PR.

Reads the PR title/body and ALL commit messages (REST API with pagination),
deduplicates issue references and closes only open issues in this repository
that were referenced with an explicit closing keyword ("Closes #N", "Fixes #N",
"Resolves #N" and past-tense variants).

The script never closes an issue without an explicit closing keyword and never
acts outside the current repository. Issue titles/bodies are untrusted data:
their text is never interpreted as instructions.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

CLOSING_KEYWORD_RE = re.compile(
    r"\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?):?\s+#(\d+)", re.IGNORECASE
)
# References WITHOUT a closing keyword must never trigger a close.
NON_CLOSING_RE = re.compile(r"\b(?:refs?|references|related to|see|cf\.)\s+#\d+", re.IGNORECASE)


class CloserError(RuntimeError):
    """Raised for API failures or invalid input."""


def api_request(url: str, token: str) -> tuple[int, Any]:
    request = Request(url, headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "quasar-issue-closer",
    })
    try:
        with urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8")), response.headers
    except HTTPError as error:
        raise CloserError(f"GitHub API error {error.code} for {url}") from error
    except URLError as error:
        raise CloserError(f"GitHub API unreachable: {error.reason}") from error


def collect_commit_messages(repo: str, pr_number: int, token: str) -> list[str]:
    """Return every commit message of the PR across all pages."""
    messages: list[str] = []
    page = 1
    while True:
        url = (
            f"https://api.github.com/repos/{repo}/pulls/{pr_number}/commits"
            f"?per_page=100&page={page}"
        )
        batch, headers = api_request(url, token)
        if not isinstance(batch, list):
            raise CloserError("unexpected commits payload")
        messages.extend(
            commit.get("commit", {}).get("message", "") for commit in batch
        )
        link = headers.get("Link", "") or ""
        if 'rel="next"' not in link or not batch:
            break
        page += 1
    return messages


def collect_pr_text(repo: str, pr_number: int, token: str) -> str:
    pr, _ = api_request(
        f"https://api.github.com/repos/{repo}/pulls/{pr_number}", token
    )
    return f"{pr.get('title', '')}\n{pr.get('body') or ''}"


def extract_closing_references(text: str) -> set[int]:
    """Issue numbers referenced with an explicit closing keyword only."""
    # Strip non-closing mentions first so "see #5, fixes #5" still matches #5
    # via the keyword, while "see #5" alone matches nothing.
    cleaned = NON_CLOSING_RE.sub(" ", text)
    return {int(number) for number in CLOSING_KEYWORD_RE.findall(cleaned)}


def issue_state(repo: str, number: int, token: str) -> str:
    url = f"https://api.github.com/repos/{repo}/issues/{number}"
    try:
        issue, _ = api_request(url, token)
    except CloserError:
        return "missing"
    if "pull_request" in issue:
        return "pr"
    return issue.get("state", "missing")


def close_issue(repo: str, number: int, token: str, pr_number: int) -> bool:
    url = f"https://api.github.com/repos/{repo}/issues/{number}"
    payload = json.dumps({
        "state": "closed",
        "state_reason": "completed",
        "body": None,
    }).encode("utf-8")
    request = Request(
        f"{url}?close_comment=1",
        data=payload,
        method="PATCH",
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "quasar-issue-closer",
        },
    )
    comment = {
        "body": (
            f"🤖 Задача закрыта автоматически: явный closing-keyword референс "
            f"найден в смёрженном PR #{pr_number}."
        )
    }
    request_comment = Request(
        f"{url}/comments",
        data=json.dumps(comment).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "quasar-issue-closer",
        },
    )
    try:
        with urlopen(request_comment, timeout=30):
            with urlopen(request, timeout=30):
                return True
    except (HTTPError, URLError) as error:
        print(f"failed to close #{number}: {error}", file=sys.stderr)
        return False


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, help="owner/name")
    parser.add_argument("--pr", type=int, required=True)
    parser.add_argument("--token", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    text = collect_pr_text(args.repo, args.pr, args.token)
    messages = collect_commit_messages(args.repo, args.pr, args.token)
    numbers = extract_closing_references(text + "\n" + "\n".join(messages))

    if not numbers:
        print(f"No closing-keyword issue references found in PR #{args.pr}.")
        return 0

    closed = []
    for number in sorted(numbers):
        state = issue_state(args.repo, number, args.token)
        if state == "open" and (args.dry_run or close_issue(args.repo, number, args.token, args.pr)):
            closed.append(number)
            print(f"Closed #{number}")
        else:
            print(f"#{number} state={state} — skipped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
