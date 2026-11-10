#!/usr/bin/env bash
# Rebuild or verify the browser artifact loaded by website/index.html.
# This is static-asset preparation only: it never reads deployment state,
# credentials, or wallet material and it never sends a network transaction.
set -euo pipefail

mode="${1:---check}"
if [[ "$#" -ne 1 || ( "$mode" != "--check" && "$mode" != "--write" ) ]]; then
    echo "Usage: $0 --check|--write" >&2
    exit 64
fi

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source_path="$root/website/tonconnect.js"
bundle_path="$root/website/vendor/tonconnect.bundle.js"
manifest_path="$root/website/vendor/tonconnect.bundle.manifest.json"
esbuild_version="0.25.12"
ton_core_version="$(cd "$root" && node -p "require('./node_modules/@ton/core/package.json').version")"
temporary="$(mktemp)"
trap 'rm -f "$temporary"' EXIT

npx --yes --package="esbuild@${esbuild_version}" esbuild "$source_path" \
    --bundle \
    --format=esm \
    --platform=browser \
    --target=es2022 \
    --minify \
    --legal-comments=none \
    --outfile="$temporary"

if [[ "$mode" == "--check" ]]; then
    if ! cmp --silent "$temporary" "$bundle_path"; then
        echo "website/vendor/tonconnect.bundle.js is stale; run $0 --write and review the result" >&2
        exit 1
    fi
else
    install -m 0644 "$temporary" "$bundle_path"
fi

python3 - "$source_path" "$bundle_path" "$manifest_path" "$esbuild_version" "$ton_core_version" "$mode" <<'PY'
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

source = Path(sys.argv[1])
bundle = Path(sys.argv[2])
manifest = Path(sys.argv[3])
esbuild, ton_core, mode = sys.argv[4:]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

expected = {
    "schemaVersion": 1,
    "generator": {
        "name": "esbuild",
        "version": esbuild,
        "arguments": [
            "--bundle",
            "--format=esm",
            "--platform=browser",
            "--target=es2022",
            "--minify",
            "--legal-comments=none",
        ],
    },
    "dependencies": {"@ton/core": ton_core},
    "source": {"path": "website/tonconnect.js", "sha256": sha256(source)},
    "bundle": {"path": "website/vendor/tonconnect.bundle.js", "sha256": sha256(bundle)},
}

if mode == "--write":
    manifest.write_text(json.dumps(expected, indent=2, sort_keys=True) + "\n")
    print(f"Wrote {manifest.relative_to(source.parents[1])}")
else:
    actual = json.loads(manifest.read_text())
    if actual != expected:
        raise SystemExit(
            "website/vendor/tonconnect.bundle.manifest.json does not match the verified source, bundle, or toolchain"
        )
    print("Verified self-hosted TON Connect bundle provenance")
PY
