#!/usr/bin/env python3
"""Fetch a small, reviewed TON and Acton documentation corpus for QUASAR.

The script syncs only the pages in :data:`SOURCES`.  It never executes
downloaded content.  ``index.json`` is a manifest: each listed page has a
SHA-256 digest, and the manifest is installed last after all page files.
"""

from __future__ import annotations

import argparse
import fcntl
import hashlib
import json
import os
import re
import sys
import tempfile
import time
import uuid
from collections.abc import Callable, Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import (
    HTTPErrorProcessor,
    HTTPRedirectHandler,
    HTTPSHandler,
    OpenerDirector,
    Request,
)

try:
    from scripts.url_safety import assert_https
except ModuleNotFoundError:  # direct `python3 scripts/<name>.py` execution
    from url_safety import assert_https


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "ton"
INDEX_PATH = DOCS_DIR / "index.json"
MAX_PAGE_BYTES = 1_000_000
FETCH_TIMEOUT_SECONDS = 30
FETCH_ATTEMPTS = 3
FETCH_RETRY_DELAY_SECONDS = 0.5
RETRYABLE_HTTP_STATUSES = frozenset({429, 500, 502, 503, 504})
SOURCE_ID_PATTERN = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
SHA256_PATTERN = re.compile(r"[0-9a-f]{64}")
ACTON_RAW_PREFIX = "/ton-blockchain/acton/master/docs/content/docs/scripting/"


SOURCES: tuple[tuple[str, str], ...] = (
    (
        "jetton-overview",
        "https://docs.ton.org/llms/contracts/standard/tokens/jettons/overview/content.md",
    ),
    (
        "jetton-transfer",
        "https://docs.ton.org/llms/contracts/standard/tokens/jettons/transfer/content.md",
    ),
    (
        "jetton-api",
        "https://docs.ton.org/llms/contracts/standard/tokens/jettons/api/content.md",
    ),
    (
        "jetton-find-wallet",
        "https://docs.ton.org/llms/contracts/standard/tokens/jettons/find/content.md",
    ),
    (
        "token-metadata",
        "https://docs.ton.org/llms/contracts/standard/tokens/metadata/content.md",
    ),
    (
        "security-best-practices",
        "https://docs.ton.org/llms/contracts/techniques/security/content.md",
    ),
    ("tolk-language", "https://docs.ton.org/llms/tolk/overview/content.md"),
    (
        "acton-scripting-overview",
        "https://raw.githubusercontent.com/ton-blockchain/acton/master/"
        "docs/content/docs/scripting/overview.mdx",
    ),
    (
        "acton-scripting-passing-arguments",
        "https://raw.githubusercontent.com/ton-blockchain/acton/master/"
        "docs/content/docs/scripting/passing-arguments.mdx",
    ),
    (
        "acton-scripting-blockchain-interaction",
        "https://raw.githubusercontent.com/ton-blockchain/acton/master/"
        "docs/content/docs/scripting/blockchain-interaction.mdx",
    ),
)


class DocsSyncError(RuntimeError):
    """Raised when a configured source or a local snapshot is invalid."""


@dataclass
class StagedFile:
    """A staged replacement and the state needed to restore its original file."""

    target: Path
    temporary: Path | None
    backup: Path | None
    backed_up: bool = False
    installed: bool = False


class RejectRedirectHandler(HTTPRedirectHandler):
    """Reject redirects before opening any URL outside the reviewed source."""

    def redirect_request(
        self,
        req: Request,
        fp: object,
        code: int,
        msg: str,
        headers: object,
        newurl: str,
    ) -> None:
        raise DocsSyncError(
            "refusing HTTP redirects; update the reviewed documentation source URL"
        )


DOCS_OPENER = OpenerDirector()
DOCS_OPENER.add_handler(HTTPSHandler())
DOCS_OPENER.add_handler(RejectRedirectHandler())
DOCS_OPENER.add_handler(HTTPErrorProcessor())


def validate_source_url(url: str) -> None:
    """Allow only exact official TON Docs and Acton Markdown source routes."""
    parsed = urlparse(url)
    try:
        has_port = parsed.port is not None
    except ValueError as error:
        raise DocsSyncError(f"Refusing malformed source URL: {url}") from error

    canonical_authority = (
        parsed.scheme == "https"
        and parsed.username is None
        and parsed.password is None
        and not has_port
        and not parsed.query
        and not parsed.fragment
    )
    ton_docs_page = (
        parsed.hostname == "docs.ton.org"
        and parsed.path.startswith("/llms/")
        and parsed.path.endswith("/content.md")
    )
    acton_scripting_page = (
        parsed.hostname == "raw.githubusercontent.com"
        and parsed.path.startswith(ACTON_RAW_PREFIX)
        and parsed.path.endswith(".mdx")
    )
    if not canonical_authority or not (ton_docs_page or acton_scripting_page):
        raise DocsSyncError(f"Refusing non-canonical documentation source: {url}")


def validate_sources() -> None:
    """Reject ambiguous IDs, paths, and URLs before making network requests."""
    source_ids: set[str] = set()
    urls: set[str] = set()
    for source_id, url in SOURCES:
        if not SOURCE_ID_PATTERN.fullmatch(source_id):
            raise DocsSyncError(f"Invalid source ID: {source_id}")
        if source_id in source_ids:
            raise DocsSyncError(f"Duplicate source ID: {source_id}")
        if url in urls:
            raise DocsSyncError(f"Duplicate source URL: {url}")
        validate_source_url(url)
        source_ids.add(source_id)
        urls.add(url)


def _response_content_type(response: object) -> str:
    headers = getattr(response, "headers", None)
    get_content_type = getattr(headers, "get_content_type", None)
    if not callable(get_content_type):
        raise DocsSyncError("source response did not include a parseable Content-Type")
    return get_content_type()


def _response_status(response: object) -> int | None:
    status = getattr(response, "status", None)
    if status is None:
        status = getattr(response, "code", None)
    return status if isinstance(status, int) else None


def _looks_like_markdown(markdown: str) -> bool:
    first_line = markdown.split("\n", 1)[0]
    return first_line == "---" or markdown.startswith("# ")


def _fetch_page_once(source_id: str, url: str) -> str:
    request = Request(  # noqa: S310 - URL is validated by assert_https
        assert_https(url),
        headers={
            "Accept": "text/markdown, text/plain;q=0.9",
            "User-Agent": "QUASAR-TON-Docs-Sync/1.1",
        },
    )
    with DOCS_OPENER.open(request, timeout=FETCH_TIMEOUT_SECONDS) as response:
        status = _response_status(response)
        if status is not None and status >= 400:
            raise HTTPError(url, status, "unexpected HTTP status", response.headers, None)
        validate_source_url(response.geturl())
        content_type = _response_content_type(response)
        if content_type not in {"text/markdown", "text/plain"}:
            raise DocsSyncError(
                f"{source_id}: expected Markdown, received {content_type}"
            )
        raw = response.read(MAX_PAGE_BYTES + 1)

    if len(raw) > MAX_PAGE_BYTES:
        raise DocsSyncError(f"{source_id}: page exceeded {MAX_PAGE_BYTES} bytes")
    try:
        markdown = raw.decode("utf-8").strip()
    except UnicodeDecodeError as error:
        raise DocsSyncError(f"{source_id}: response was not UTF-8") from error
    if not _looks_like_markdown(markdown) or "<html" in markdown[:2048].lower():
        raise DocsSyncError(f"{source_id}: response does not look like a Markdown page")
    return markdown + "\n"


def _is_retryable_fetch_error(error: BaseException) -> bool:
    if isinstance(error, HTTPError):
        return error.code in RETRYABLE_HTTP_STATUSES
    return isinstance(error, (URLError, TimeoutError, ConnectionError, OSError))


def fetch_page(source_id: str, url: str) -> str:
    """Fetch one page, retrying only transient network and server failures."""
    validate_source_url(url)
    for attempt in range(FETCH_ATTEMPTS):
        try:
            return _fetch_page_once(source_id, url)
        except (HTTPError, URLError, TimeoutError, ConnectionError, OSError) as error:
            if not _is_retryable_fetch_error(error) or attempt == FETCH_ATTEMPTS - 1:
                raise DocsSyncError(f"{source_id}: could not fetch documentation") from error
            time.sleep(FETCH_RETRY_DELAY_SECONDS * (2**attempt))
    raise AssertionError("fetch retry loop unexpectedly completed")


def _expected_entries() -> list[dict[str, str]]:
    return [
        {"id": source_id, "path": f"{source_id}.md", "url": url}
        for source_id, url in SOURCES
    ]


def validate_snapshot(pages: dict[str, str], index: dict[str, object]) -> None:
    """Validate that an index exactly represents all configured local pages."""
    if index.get("schemaVersion") != 1:
        raise DocsSyncError("snapshot index has an unsupported schema version")
    entries = index.get("sources")
    if not isinstance(entries, list) or len(entries) != len(SOURCES):
        raise DocsSyncError("snapshot index does not list every configured source")

    for expected, entry in zip(_expected_entries(), entries, strict=True):
        if not isinstance(entry, dict):
            raise DocsSyncError("snapshot index contains an invalid source entry")
        if set(entry) != {"id", "path", "url", "sha256"}:
            raise DocsSyncError("snapshot index source entry has unexpected fields")
        if any(entry.get(key) != value for key, value in expected.items()):
            raise DocsSyncError("snapshot index does not match the configured source allowlist")
        digest = entry.get("sha256")
        path = entry["path"]
        if not isinstance(digest, str) or not SHA256_PATTERN.fullmatch(digest):
            raise DocsSyncError(f"snapshot index has an invalid SHA-256 for {path}")
        content = pages.get(path)
        if content is None:
            raise DocsSyncError(f"snapshot index refers to missing page {path}")
        actual_digest = hashlib.sha256(content.encode("utf-8")).hexdigest()
        if digest != actual_digest:
            raise DocsSyncError(f"snapshot checksum does not match {path}")

    expected_paths = {entry["path"] for entry in _expected_entries()}
    if set(pages) != expected_paths:
        raise DocsSyncError("snapshot contains pages outside the configured allowlist")


def build_snapshot() -> tuple[dict[str, str], dict[str, object]]:
    """Fetch and validate every configured source before any file is written."""
    validate_sources()
    pages: dict[str, str] = {}
    entries: list[dict[str, str]] = []
    for source_id, url in SOURCES:
        markdown = fetch_page(source_id, url)
        path = f"{source_id}.md"
        pages[path] = markdown
        entries.append(
            {
                "id": source_id,
                "path": path,
                "url": url,
                "sha256": hashlib.sha256(markdown.encode("utf-8")).hexdigest(),
            }
        )
    index: dict[str, object] = {"schemaVersion": 1, "sources": entries}
    validate_snapshot(pages, index)
    return pages, index


def desired_files(pages: dict[str, str], index: dict[str, object]) -> dict[Path, str]:
    """Return the complete desired snapshot, including its canonical manifest."""
    validate_snapshot(pages, index)
    files = {DOCS_DIR / name: content for name, content in pages.items()}
    files[INDEX_PATH] = json.dumps(index, ensure_ascii=False, indent=2) + "\n"
    return files


def _fsync_directory(directory: Path) -> None:
    """Persist directory entry replacements before old backups are removed."""
    descriptor = os.open(directory, os.O_RDONLY | os.O_DIRECTORY)
    try:
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


@contextmanager
def snapshot_lock() -> Iterator[None]:
    """Serialize sync and check processes without adding a lock file to the tree."""
    try:
        descriptor = os.open(DOCS_DIR, os.O_RDONLY | os.O_DIRECTORY)
    except OSError as error:
        raise DocsSyncError(f"cannot lock TON Docs directory: {DOCS_DIR}") from error
    try:
        fcntl.flock(descriptor, fcntl.LOCK_EX)
        yield
    finally:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_UN)
        finally:
            os.close(descriptor)


def _ordered_files(files: dict[Path, str]) -> list[tuple[Path, str]]:
    """Install all pages before index.json, which is the snapshot commit marker."""
    return sorted(files.items(), key=lambda item: (item[0] == INDEX_PATH, str(item[0])))


def stale_markdown_paths(files: dict[Path, str]) -> list[Path]:
    """Find Markdown files no longer represented by the generated manifest."""
    try:
        local_pages = set(DOCS_DIR.glob("*.md"))
    except OSError:
        return []
    return sorted(local_pages - set(files))


def atomic_write_files(
    files: dict[Path, str],
    replace_file: Callable[[Path, Path], None] | None = None,
    remove_files: tuple[Path, ...] = (),
) -> None:
    """Stage a full snapshot and replace it with rollback if publication fails.

    This function must be called while :func:`snapshot_lock` is held.  Every
    temporary and backup file is created next to its target, so ``os.replace``
    never crosses file systems.  Removed stale pages retain a backup until the
    manifest is installed last.
    """
    replace = replace_file or os.replace
    staged: list[StagedFile] = []
    token = f"{os.getpid()}-{uuid.uuid4().hex}"
    removals = tuple(sorted(set(remove_files)))
    if any(
        path.parent != DOCS_DIR or path.suffix != ".md" or path in files
        for path in removals
    ):
        raise DocsSyncError("refusing to remove a path outside the managed Markdown corpus")
    try:
        for target, content in _ordered_files(files):
            target.parent.mkdir(parents=True, exist_ok=True)
            temporary: Path | None = None
            try:
                with tempfile.NamedTemporaryFile(
                    mode="w",
                    encoding="utf-8",
                    dir=target.parent,
                    prefix=f".{target.name}.{token}.",
                    suffix=".tmp",
                    delete=False,
                ) as temporary_file:
                    temporary = Path(temporary_file.name)
                    temporary_file.write(content)
                    temporary_file.flush()
                    os.fsync(temporary_file.fileno())
                # NamedTemporaryFile uses owner-only permissions (0600).
                # Do not broaden them or inherit executable/world-readable bits.
            except BaseException:
                if temporary is not None:
                    temporary.unlink(missing_ok=True)
                raise
            staged.append(
                StagedFile(
                    target=target,
                    temporary=temporary,
                    backup=(
                        target.with_name(f".{target.name}.{token}.bak")
                        if target.exists()
                        else None
                    ),
                )
            )

        for target in removals:
            if target.exists() or target.is_symlink():
                staged.append(
                    StagedFile(
                        target=target,
                        temporary=None,
                        backup=target.with_name(f".{target.name}.{token}.bak"),
                    )
                )

        publication_order = sorted(
            staged,
            key=lambda item: (
                item.target == INDEX_PATH,
                item.temporary is None,
                str(item.target),
            ),
        )
        for item in publication_order:
            if item.backup is not None:
                replace(item.target, item.backup)
                item.backed_up = True
            if item.temporary is not None:
                replace(item.temporary, item.target)
                item.installed = True
        for directory in sorted({item.target.parent for item in staged}):
            _fsync_directory(directory)
    except BaseException as error:
        rollback_errors: list[BaseException] = []
        for item in reversed(staged):
            try:
                if item.installed:
                    item.target.unlink(missing_ok=True)
                if item.backed_up and item.backup is not None and item.backup.exists():
                    replace(item.backup, item.target)
            except BaseException as rollback_error:
                rollback_errors.append(rollback_error)
        for item in staged:
            if item.temporary is not None:
                item.temporary.unlink(missing_ok=True)
        if rollback_errors:
            raise DocsSyncError(
                "snapshot write failed and rollback was incomplete; backup files were retained"
            ) from error
        raise

    cleanup_errors: list[OSError] = []
    for item in staged:
        if item.backup is not None:
            try:
                item.backup.unlink(missing_ok=True)
            except OSError as error:
                cleanup_errors.append(error)
    if cleanup_errors:
        raise DocsSyncError(
            "snapshot was published but obsolete backup files could not be removed"
        ) from cleanup_errors[0]


def snapshot_problems(files: dict[Path, str]) -> list[str]:
    """Compare all managed files and reject stale Markdown left in the corpus."""
    problems: list[str] = []
    for path, expected_content in _ordered_files(files):
        try:
            actual_content = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            problems.append(f"Missing or unreadable: {path.relative_to(ROOT)}")
            continue
        if actual_content != expected_content:
            problems.append(f"Out of date or corrupt: {path.relative_to(ROOT)}")

    for path in stale_markdown_paths(files):
        problems.append(f"Unmanaged stale page: {path.relative_to(ROOT)}")
    return problems


def sync(check_only: bool = False) -> int:
    with snapshot_lock():
        pages, index = build_snapshot()
        files = desired_files(pages, index)
        problems = snapshot_problems(files)

        if check_only:
            if problems:
                for problem in problems:
                    print(problem)
                print("Run `npm run ton:docs:sync` to refresh the reviewed corpus.")
                return 1
            print(f"TON Docs snapshot is current ({len(pages)} pages).")
            return 0

        # All source responses and their manifest are checked before the first
        # rename.  The manifest is the final replacement and rollback restores
        # the prior complete snapshot if any replacement fails.
        atomic_write_files(files, remove_files=tuple(stale_markdown_paths(files)))
        print(
            f"TON Docs sync complete: {len(pages)} official pages, "
            f"{len(problems)} file(s) changed."
        )
        return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="fetch remote sources and fail if the checked-in snapshot is stale",
    )
    args = parser.parse_args(argv)
    try:
        return sync(check_only=args.check)
    except (DocsSyncError, OSError) as error:
        print(f"TON Docs sync failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
