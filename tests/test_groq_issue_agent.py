"""Offline tests for the Groq issue-agent API adapter."""

from __future__ import annotations

import json
import unittest
from unittest.mock import patch

from scripts.groq_issue_agent import (
    DEFAULT_API_URL,
    DEFAULT_MODEL,
    MAX_PROMPT_CHARS,
    MAX_RESPONSE_TOKENS,
    bound_prompt,
    call_groq,
    resolve_groq_api_key,
)


class FakeResponse:
    def __init__(self, payload: dict[str, object]) -> None:
        self.payload = payload

    def __enter__(self) -> "FakeResponse":
        return self

    def __exit__(self, *_: object) -> None:
        return None

    def read(self) -> bytes:
        return json.dumps(self.payload).encode("utf-8")


class GroqIssueAgentTests(unittest.TestCase):
    def test_only_accepts_the_groq_key_name(self) -> None:
        self.assertEqual(
            resolve_groq_api_key({"GROQ_API_KEY": "test-key"}),
            "test-key",
        )
        self.assertIsNone(
            resolve_groq_api_key({"GROK_API_KEY": "xai-test", "XAI_API_KEY": "xai-test"})
        )

    def test_defaults_target_groq_and_a_supported_model(self) -> None:
        self.assertEqual(DEFAULT_API_URL, "https://api.groq.com/openai/v1/chat/completions")
        self.assertEqual(DEFAULT_MODEL, "openai/gpt-oss-120b")
        self.assertEqual(MAX_RESPONSE_TOKENS, 1200)

    def test_prompt_is_bounded_for_the_configured_tpm_budget(self) -> None:
        bounded = bound_prompt("x" * (MAX_PROMPT_CHARS + 100))
        self.assertLessEqual(len(bounded), MAX_PROMPT_CHARS)
        self.assertTrue(bounded.endswith("[Prompt truncated to fit the configured Groq request budget.]\n"))

    def test_call_uses_openai_compatible_payload_without_temperature_override(self) -> None:
        patch_text = "diff --git a/tests/example.test.ts b/tests/example.test.ts\n"
        response = FakeResponse({
            "choices": [{
                "message": {
                    "content": json.dumps({"summary": "test", "patch": patch_text})
                }
            }]
        })
        with patch("scripts.groq_issue_agent.urlopen", return_value=response) as mocked_urlopen:
            answer = call_groq(
                "test-key",
                DEFAULT_API_URL,
                DEFAULT_MODEL,
                "Make a safe test patch.",
            )

        self.assertEqual(answer["patch"], patch_text)
        request = mocked_urlopen.call_args.args[0]
        self.assertEqual(request.full_url, DEFAULT_API_URL)
        self.assertEqual(request.get_header("Authorization"), "Bearer test-key")
        payload = json.loads(request.data.decode("utf-8"))
        self.assertEqual(payload["model"], DEFAULT_MODEL)
        self.assertEqual(payload["max_completion_tokens"], MAX_RESPONSE_TOKENS)
        self.assertLessEqual(len(payload["messages"][1]["content"]), MAX_PROMPT_CHARS)
        self.assertNotIn("temperature", payload)


if __name__ == "__main__":
    unittest.main()
