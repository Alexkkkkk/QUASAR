#!/usr/bin/env bash
set -euo pipefail

if ! command -v acton >/dev/null 2>&1; then
    echo "Acton 1.2.1 is required. Install it and run: npm run acton:init" >&2
    exit 1
fi

printf '%s\n' 'Building QUASAR contracts with Tolk/Acton...'
python3 scripts/sync_acton.py
printf '%s\n' 'Tolk artifacts are published in tolk/build/synchronized/'
