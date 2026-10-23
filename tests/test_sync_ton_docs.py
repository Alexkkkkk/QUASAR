"""Offline tests for the TON and Acton documentation snapshot synchronizer."""

from __future__ import annotations

import hashlib
import importlib.util
import io
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock
from urllib.error import HTTPError
from urllib.request import Request


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_PATH = REPOSITORY_ROOT / "scripts" / "sync_ton_docs.py"
SPEC = importlib.util.spec_from_file_location("sync_ton_docs_under_test", SCRIPT_PATH)
assert SPEC is not None and SPEC.loader is not None
sync_ton_docs = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = sync_ton_docs
SPEC.loader.exec_module(sync_ton_docs)


class FakeHeaders:
    def __init__(self, content_type: str = "text/plain") -> None:
        self.content_type = content_type

    def get_content_type(self) -> str:
        return self.content_type


class FakeResponse:
    def __init__(
        self,
        payload: bytes,
        *,
        final_url: str,
        content_type: str = "text/plain",
        status: int = 200,
    ) -> None:
        self.payload = payload
        self.final_url = final_url
        self.headers = FakeHeaders(content_type)
        self.status = status

    def __enter__(self) -> "FakeResponse":
        return self

    def __exit__(self, *unused: object) -> None:
        return None

    def geturl(self) -> str:
        return self.final_url

    def read(self, size: int = -1) -> bytes:
        return self.payload if size == -1 else self.payload[:size]


class SyncTonDocsTest(unittest.TestCase):
    def _snapshot(self) -> tuple[dict[str, str], dict[str, object]]:
        pages: dict[str, str] = {}
        entries: list[dict[str, str]] = []
        for source_id, url in sync_ton_docs.SOURCES:
            path = f"{source_id}.md"
            content = f"# Offline fixture for {source_id}\n"
            pages[path] = content
            entries.append(
                {
                    "id": source_id,
                    "path": path,
                    "url": url,
                    "sha256": hashlib.sha256(content.encode("utf-8")).hexdigest(),
                }
            )
        return pages, {"schemaVersion": 1, "sources": entries}

    def _patched_paths(self, root: Path) -> mock._patch:
        docs_dir = root / "docs" / "ton"
        docs_dir.mkdir(parents=True)
        return mock.patch.multiple(
            sync_ton_docs,
            ROOT=root,
            DOCS_DIR=docs_dir,
            INDEX_PATH=docs_dir / "index.json",
        )

    def test_sources_include_three_official_acton_scripting_pages(self) -> None:
        sources = dict(sync_ton_docs.SOURCES)
        self.assertEqual(
            sources["acton-scripting-overview"],
            "https://raw.githubusercontent.com/ton-blockchain/acton/master/"
            "docs/content/docs/scripting/overview.mdx",
        )
        self.assertEqual(
            sources["acton-scripting-passing-arguments"],
            "https://raw.githubusercontent.com/ton-blockchain/acton/master/"
            "docs/content/docs/scripting/passing-arguments.mdx",
        )
        self.assertEqual(
            sources["acton-scripting-blockchain-interaction"],
            "https://raw.githubusercontent.com/ton-blockchain/acton/master/"
            "docs/content/docs/scripting/blockchain-interaction.mdx",
        )
        sync_ton_docs.validate_sources()

    def test_fetch_retries_transient_http_error_then_accepts_acton_mdx(self) -> None:
        source_id = "acton-scripting-overview"
        url = dict(sync_ton_docs.SOURCES)[source_id]
        unavailable = HTTPError(url, 503, "service unavailable", FakeHeaders(), None)
        response = FakeResponse(b"---\ntitle: Offline\n---\n\nActon content\n", final_url=url)
        with (
            mock.patch.object(sync_ton_docs.DOCS_OPENER, "open", side_effect=[unavailable, response]) as opener,
            mock.patch.object(sync_ton_docs.time, "sleep") as sleep,
        ):
            actual = sync_ton_docs.fetch_page(source_id, url)

        self.assertEqual(actual, "---\ntitle: Offline\n---\n\nActon content\n")
        self.assertEqual(opener.call_count, 2)
        sleep.assert_called_once_with(sync_ton_docs.FETCH_RETRY_DELAY_SECONDS)

    def test_fetch_does_not_retry_non_transient_http_error(self) -> None:
        url = dict(sync_ton_docs.SOURCES)["acton-scripting-overview"]
        missing = HTTPError(url, 404, "missing", FakeHeaders(), None)
        with (
            mock.patch.object(sync_ton_docs.DOCS_OPENER, "open", side_effect=missing) as opener,
            mock.patch.object(sync_ton_docs.time, "sleep") as sleep,
        ):
            with self.assertRaises(sync_ton_docs.DocsSyncError):
                sync_ton_docs.fetch_page("acton-scripting-overview", url)

        self.assertEqual(opener.call_count, 1)
        sleep.assert_not_called()

    def test_redirect_handler_rejects_destination_before_following_it(self) -> None:
        source_url = dict(sync_ton_docs.SOURCES)["jetton-overview"]
        handler = sync_ton_docs.RejectRedirectHandler()
        with self.assertRaisesRegex(sync_ton_docs.DocsSyncError, "refusing HTTP redirects"):
            handler.redirect_request(
                Request(source_url),
                None,
                302,
                "Found",
                {},
                "https://attacker.invalid/collect",
            )

    def test_build_snapshot_generates_index_with_hashes_for_every_page(self) -> None:
        def offline_fetch(source_id: str, unused_url: str) -> str:
            return f"# Offline page: {source_id}\n"

        with mock.patch.object(sync_ton_docs, "fetch_page", side_effect=offline_fetch):
            pages, index = sync_ton_docs.build_snapshot()

        sync_ton_docs.validate_snapshot(pages, index)
        entries = index["sources"]
        self.assertEqual(len(entries), len(sync_ton_docs.SOURCES))
        for entry in entries:
            self.assertEqual(
                entry["sha256"],
                hashlib.sha256(pages[entry["path"]].encode("utf-8")).hexdigest(),
            )

    def test_check_detects_corruption_and_stale_pages_without_writing(self) -> None:
        pages, index = self._snapshot()
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self._patched_paths(root):
                files = sync_ton_docs.desired_files(pages, index)
                for path, content in files.items():
                    path.write_text(content, encoding="utf-8")
                corrupt_path = sync_ton_docs.DOCS_DIR / "acton-scripting-overview.md"
                corrupt_path.write_text("# Tampered\n", encoding="utf-8")
                stale_path = sync_ton_docs.DOCS_DIR / "removed-source.md"
                stale_path.write_text("# Stale\n", encoding="utf-8")
                before = {
                    path: path.read_bytes()
                    for path in sync_ton_docs.DOCS_DIR.iterdir()
                    if path.is_file()
                }
                output = io.StringIO()
                with (
                    mock.patch.object(sync_ton_docs, "build_snapshot", return_value=(pages, index)),
                    redirect_stdout(output),
                ):
                    result = sync_ton_docs.sync(check_only=True)
                after = {
                    path: path.read_bytes()
                    for path in sync_ton_docs.DOCS_DIR.iterdir()
                    if path.is_file()
                }

        self.assertEqual(result, 1)
        self.assertEqual(before, after)
        self.assertIn("Out of date or corrupt", output.getvalue())
        self.assertIn("Unmanaged stale page", output.getvalue())

    def test_sync_prunes_stale_page_as_part_of_publication(self) -> None:
        pages, index = self._snapshot()
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self._patched_paths(root):
                files = sync_ton_docs.desired_files(pages, index)
                for path, content in files.items():
                    path.write_text(content, encoding="utf-8")
                stale_path = sync_ton_docs.DOCS_DIR / "removed-source.md"
                stale_path.write_text("# Stale\n", encoding="utf-8")
                with mock.patch.object(
                    sync_ton_docs, "build_snapshot", return_value=(pages, index)
                ):
                    result = sync_ton_docs.sync()

                self.assertEqual(result, 0)
                self.assertFalse(stale_path.exists())
                self.assertEqual(sync_ton_docs.snapshot_problems(files), [])

    def test_failed_index_install_restores_pruned_stale_page(self) -> None:
        pages, index = self._snapshot()
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self._patched_paths(root):
                new_files = sync_ton_docs.desired_files(pages, index)
                old_files = {
                    path: f"# Previous content for {path.name}\n"
                    for path in new_files
                }
                for path, content in old_files.items():
                    path.write_text(content, encoding="utf-8")
                stale_path = sync_ton_docs.DOCS_DIR / "removed-source.md"
                stale_content = "# Existing stale content\n"
                stale_path.write_text(stale_content, encoding="utf-8")

                def fail_index_install(source: Path, target: Path) -> None:
                    if source.suffix == ".tmp" and target == sync_ton_docs.INDEX_PATH:
                        raise OSError("injected index commit failure")
                    os.replace(source, target)

                with self.assertRaisesRegex(OSError, "injected index commit failure"):
                    sync_ton_docs.atomic_write_files(
                        new_files,
                        fail_index_install,
                        remove_files=(stale_path,),
                    )

                restored_files = {
                    path: path.read_text(encoding="utf-8")
                    for path in old_files
                }
                restored_stale_content = stale_path.read_text(encoding="utf-8")
                leftovers = list(sync_ton_docs.DOCS_DIR.glob(".*.tmp")) + list(
                    sync_ton_docs.DOCS_DIR.glob(".*.bak")
                )

        self.assertEqual(restored_files, old_files)
        self.assertEqual(restored_stale_content, stale_content)
        self.assertEqual(leftovers, [])

    def test_failed_publication_restores_the_entire_old_snapshot(self) -> None:
        pages, index = self._snapshot()
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self._patched_paths(root):
                new_files = sync_ton_docs.desired_files(pages, index)
                old_files = {
                    path: f"# Previous content for {path.name}\n"
                    for path in new_files
                }
                for path, content in old_files.items():
                    path.write_text(content, encoding="utf-8")
                failed_target = sorted(
                    path for path in new_files if path != sync_ton_docs.INDEX_PATH
                )[1]

                def fail_during_second_install(source: Path, target: Path) -> None:
                    if source.suffix == ".tmp" and target == failed_target:
                        raise OSError("injected replacement failure")
                    os.replace(source, target)

                with self.assertRaises(OSError):
                    sync_ton_docs.atomic_write_files(new_files, fail_during_second_install)

                actual_files = {
                    path: path.read_text(encoding="utf-8")
                    for path in old_files
                }
                leftovers = list(sync_ton_docs.DOCS_DIR.glob(".*.tmp")) + list(
                    sync_ton_docs.DOCS_DIR.glob(".*.bak")
                )

        self.assertEqual(actual_files, old_files)
        self.assertEqual(leftovers, [])

    def test_published_files_keep_owner_only_temporary_permissions(self) -> None:
        pages, index = self._snapshot()
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self._patched_paths(root):
                files = sync_ton_docs.desired_files(pages, index)
                # Existing permissive modes must not propagate to replacement files.
                for path in files:
                    path.write_text("# Old\n", encoding="utf-8")
                    path.chmod(0o700)
                sync_ton_docs.atomic_write_files(files)
                for path in files:
                    self.assertEqual(path.stat().st_mode & 0o777, 0o600)

    def test_failed_fetch_does_not_begin_publication(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            with self._patched_paths(root):
                original = sync_ton_docs.DOCS_DIR / "jetton-overview.md"
                original.write_text("# Existing snapshot\n", encoding="utf-8")
                with mock.patch.object(
                    sync_ton_docs,
                    "build_snapshot",
                    side_effect=sync_ton_docs.DocsSyncError("offline"),
                ):
                    with self.assertRaises(sync_ton_docs.DocsSyncError):
                        sync_ton_docs.sync()

                self.assertEqual(original.read_text(encoding="utf-8"), "# Existing snapshot\n")


if __name__ == "__main__":
    unittest.main()
