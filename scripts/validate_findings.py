#!/usr/bin/env python3
"""Validate explore-agent findings against schema (stdin -> validated JSON).

Rejects anything the fixer must never touch: path traversal and the
repository's red lines (workflows, contracts, deploy/security/hub scripts).
"""
import json, re, sys
from pathlib import Path

KINDS = {"bug", "dead", "test", "doc", "sec"}

# Пути, которые агент-исследователь не имеет права трогать. Сравнение идёт по
# пути, нормализованному до вида без ведущих "./", поэтому запись вида
# "scripts/hub_audit.ts" и "./scripts/hub_audit.ts" ловится одинаково.
REDLINES = (
    ".github/workflows",
    # Контракты живут в tolk/contracts: без этого префикса red line "contracts"
    # не срабатывал ни на одном реальном пути и агент мог править контракты.
    "tolk/contracts",
    "tolk/Acton.toml",
    "contracts",
    "scripts/deploy",
    "scripts/security_check",
    "scripts/hub_audit",
    "scripts/sync_action_pins",
    "scripts/sync_acton",
    "docs/abi",
    "docs/build-hashes.json",
)


def normalise(path: str) -> str:
    p = path.replace("\\", "/")
    while p.startswith("./"):
        p = p[2:]
    return p


def is_redline(path: str) -> bool:
    p = normalise(path)
    return any(p == r or p.startswith(r + "/") for r in REDLINES)


def load_schema(path: Path) -> tuple[set[str], int]:
    """Return the allowed finding kinds and the item cap declared by the schema."""
    schema = json.loads(path.read_text(encoding="utf-8"))
    findings = schema["properties"]["findings"]
    kinds = set(findings["items"]["properties"]["kind"]["enum"])
    limit = int(findings.get("maxItems", 10))
    return kinds, limit


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: validate_findings.py <schema.json> < agent-reply", file=sys.stderr)
        return 2
    try:
        kinds, limit = load_schema(Path(sys.argv[1]))
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f"cannot use schema {sys.argv[1]}: {error}", file=sys.stderr)
        return 2
    raw = sys.stdin.read()
    m = re.search(r"\{.*\}", raw, re.S)
    if not m:
        print("no JSON object in reply", file=sys.stderr)
        return 1
    try:
        data = json.loads(m.group(0))
    except json.JSONDecodeError as e:
        print(f"invalid JSON: {e}", file=sys.stderr)
        return 1
    findings = data.get("findings")
    if not isinstance(findings, list) or not (1 <= len(findings) <= limit):
        print(f"findings must be a list of 1..{limit}", file=sys.stderr)
        return 1
    clean = []
    for f in findings:
        if not isinstance(f, dict):
            return 1
        if f.get("kind") not in (kinds or KINDS):
            return 1
        sev = f.get("severity")
        if not isinstance(sev, int) or not (1 <= sev <= 3):
            return 1
        file = str(f.get("file", ""))
        path = normalise(file)
        if path.startswith("..") or "/../" in path:
            return 1  # traversal
        if is_redline(path):
            return 1  # red lines
        clean.append({
            "file": file[:200], "kind": f["kind"], "severity": sev,
            "line": int(f.get("line", 0)), "why": str(f.get("why", ""))[:500],
            "fix_hint": str(f.get("fix_hint", ""))[:500],
        })
    json.dump({"findings": clean}, sys.stdout)
    return 0


if __name__ == "__main__":
    sys.exit(main())
