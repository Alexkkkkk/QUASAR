#!/usr/bin/env python3
"""Dependency-free Gemini caller for the automation workflows.

Why this exists: the repository requires every action to be pinned to a
full-length commit SHA (`sha_pinning_required: true`). The upstream composite
action `google-github-actions/run-gemini-cli` internally references
`google-github-actions/auth@v3` and `actions/upload-artifact@v6` without a SHA,
so GitHub refuses to start any job that uses it:

    The actions google-github-actions/auth@v3 and actions/upload-artifact@v6
    are not allowed in this repository because all actions must be pinned to a
    full-length commit SHA.

Calling the REST API directly keeps the pinning policy intact and introduces no
new action references at all. The step is inherently read-only: the model gets
no tool access, so it cannot touch the workspace.

Contract (fail-closed):
    stdin  -> prompt
    stdout -> model answer (plain text)
    exit 0 only when a non-empty answer was received; every other path exits
    non-zero with a `::error::` line, so a broken run is never mistaken for a
    successful one.
"""
import json
import os
import sys
import urllib.error
import urllib.request

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
DEFAULT_MODEL = "gemini-3.8-flash"
TIMEOUT_SECONDS = 600
MAX_TOKENS = 8192


def fail(message: str) -> int:
    print(f"::error::{message}", file=sys.stderr)
    return 1


def main() -> int:
    prompt = sys.stdin.read().strip()
    if not prompt:
        return fail("gemini_rest_agent: no prompt on stdin")

    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not key:
        return fail("gemini_rest_agent: GEMINI_API_KEY is not set; refusing to invent a result")

    model = os.environ.get("GEMINI_MODEL", "").strip() or DEFAULT_MODEL
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": MAX_TOKENS,
    }
    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            body = response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:500]
        return fail(f"gemini_rest_agent: HTTP {exc.code}: {detail}")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return fail(f"gemini_rest_agent: request failed: {exc}")

    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return fail("gemini_rest_agent: provider returned a non-JSON body")

    choices = data.get("choices")
    if not isinstance(choices, list) or not choices:
        return fail("gemini_rest_agent: provider returned no choices")

    message = choices[0].get("message") or {}
    text = (message.get("content") or "").strip()
    if not text:
        return fail("gemini_rest_agent: provider returned an empty completion")

    sys.stdout.write(text + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
