"""Offline unit tests for the Ollama issue agent and TON Docs sync tooling."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.ollama_issue_agent import (  # noqa: E402
    AgentError,
    collect_ton_docs_context,
    tokenize,
    validate_patch,
)
from scripts.sync_ton_docs import DocsSyncError, validate_source_url  # noqa: E402


class OllamaAgentTests(unittest.TestCase):
    def test_accepts_a_small_text_diff(self) -> None:
        patch = (
            "diff --git a/tests/example.test.ts b/tests/example.test.ts\n"
            "index 1111111..2222222 100644\n"
            "--- a/tests/example.test.ts\n"
            "+++ b/tests/example.test.ts\n"
            "@@ -1 +1 @@\n"
            "-const before = true;\n"
            "+const after = true;\n"
        )
        self.assertEqual(validate_patch(patch), patch)

    def test_rejects_workflow_and_agent_policy_changes(self) -> None:
        for path in (".github/workflows/ci.yml", "GROQ.md", "package.json"):
            with self.subTest(path=path):
                patch = (
                    f"diff --git a/{path} b/{path}\n"
                    f"--- a/{path}\n+++ b/{path}\n@@ -1 +1 @@\n-a\n+b\n"
                )
                with self.assertRaises(AgentError):
                    validate_patch(patch)

    def test_rejects_path_traversal_and_symlinks(self) -> None:
        traversal = (
            "diff --git a/../../tmp/pwned b/../../tmp/pwned\n"
            "--- a/../../tmp/pwned\n+++ b/../../tmp/pwned\n@@ -1 +1 @@\n-a\n+b\n"
        )
        symlink = (
            "diff --git a/src/file b/src/file\nnew file mode 120000\n"
            "--- /dev/null\n+++ b/src/file\n@@ -0,0 +1 @@\n+../../secrets\n"
        )
        with self.assertRaises(AgentError):
            validate_patch(traversal)
        with self.assertRaises(AgentError):
            validate_patch(symlink)

    def test_rag_tokenization_ignores_common_words(self) -> None:
        self.assertEqual(tokenize("Fix the Jetton transfer handler"), {"jetton", "transfer", "handler"})

    def test_ton_docs_context_uses_matching_checked_in_pages(self) -> None:
        docs = ROOT / "docs" / "ton"
        context = collect_ton_docs_context(docs, "Jetton transfer message layout")
        self.assertIn("jetton-transfer", context)
        self.assertIn("docs.ton.org", context)


class TonDocsSyncTests(unittest.TestCase):
    def test_allows_only_official_markdown_routes(self) -> None:
        validate_source_url(
            "https://docs.ton.org/llms/contracts/standard/tokens/metadata/content.md"
        )
        for url in (
            "http://docs.ton.org/llms/page/content.md",
            "https://evil.example/llms/page/content.md",
            "https://docs.ton.org/anything/page/content.md",
            "https://docs.ton.org/llms/page/content.md?redirect=https://evil.example",
        ):
            with self.subTest(url=url), self.assertRaises(DocsSyncError):
                validate_source_url(url)


if __name__ == "__main__":
    unittest.main()