#!/usr/bin/env python3
"""Fetch a small, reviewed TON Docs corpus for the QUASAR coding agent.

The official docs expose Markdown at /llms/<page>/content.md. This script
syncs only the pages in SOURCES; it does not mirror the whole documentation
site or execute anything from downloaded pages.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs" / "ton"
INDEX_PATH = DOCS_DIR / "index.json"
MAX_PAGE_BYTES = 1_000_000

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
)


class DocsSyncError(RuntimeError):
    """Raised when an official source cannot be fetched or validated."""


def validate_source_url(url: str) -> None:
    """Allow only official TON Docs Markdown routes."""
    parsed = urlparse(url)
    if (
        parsed.scheme != "https"
        or parsed.hostname != "docs.ton.org"
        or not parsed.path.startswith("/llms/")
        or not parsed.path.endswith("/content.md")
        or parsed.query
        or parsed.fragment
    ):
        raise DocsSyncError(f"Refusing non-canonical TON Docs source: {url}")


def fetch_page(source_id: str, url: str) -> str:
    validate_source_url(url)
    request = Request(
        url,
        headers={
            "Accept": "text/markdown",
            "User-Agent": "QUASAR-TON-Docs-Sync/1.0",
        },
    )
    try:
        with urlopen(request, timeout=30) as response:
            final_url = response.geturl()
            validate_source_url(final_url)
            content_type = response.headers.get_content_type()
            if content_type not in {"text/markdown", "text/plain"}:
                raise DocsSyncError(
                    f"{source_id}: expected Markdown, received {content_type}"
                )
            raw = response.read(MAX_PAGE_BYTES + 1)
    except URLError as error:
        raise DocsSyncError(f"{source_id}: could not fetch TON Docs") from error

    if len(raw) > MAX_PAGE_BYTES:
        raise DocsSyncError(f"{source_id}: page exceeded {MAX_PAGE_BYTES} bytes")
    try:
        markdown = raw.decode("utf-8").strip()
    except UnicodeDecodeError as error:
        raise DocsSyncError(f"{source_id}: response was not UTF-8") from error
    if not markdown.startswith("# ") or "<html" in markdown[:500].lower():
        raise DocsSyncError(f"{source_id}: response does not look like a Markdown page")
    return markdown + "\n"


def build_snapshot() -> tuple[dict[str, str], dict[str, object]]:
    """Fetch every configured source before returning any files to write."""
    pages: dict[str, str] = {}
    entries: list[dict[str, str]] = []
    for source_id, url in SOURCES:
        markdown = fetch_page(source_id, url)
        pages[f"{source_id}.md"] = markdown
        entries.append(
            {
                "id": source_id,
                "path": f"{source_id}.md",
                "url": url,
                "sha256": hashlib.sha256(markdown.encode("utf-8")).hexdigest(),
            }
        )
    index: dict[str, object] = {"schemaVersion": 1, "sources": entries}
    return pages, index


def desired_files(pages: dict[str, str], index: dict[str, object]) -> dict[Path, str]:
    files = {DOCS_DIR / name: content for name, content in pages.items()}
    files[INDEX_PATH] = json.dumps(index, ensure_ascii=False, indent=2) + "\n"
    return files


def sync(check_only: bool = False) -> int:
    pages, index = build_snapshot()
    files = desired_files(pages, index)
    changed = [
        path
        for path, content in files.items()
        if not path.exists() or path.read_text(encoding="utf-8") != content
    ]

    if check_only:
        if changed:
            for path in changed:
                print(f"Out of date: {path.relative_to(ROOT)}")
            print("Run `npm run ton:docs:sync` to refresh the reviewed corpus.")
            return 1
        print(f"TON Docs snapshot is current ({len(pages)} pages).")
        return 0

    # Fetch and validate the entire source set before writing any local files,
    # so a partial network failure never leaves a mixed-version corpus.
    for path, content in files.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
    print(
        f"TON Docs sync complete: {len(pages)} official pages, "
        f"{len(changed)} file(s) changed."
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
    except DocsSyncError as error:
        print(f"TON Docs sync failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())