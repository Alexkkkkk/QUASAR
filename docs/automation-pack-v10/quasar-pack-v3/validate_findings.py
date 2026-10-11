#!/usr/bin/env python3
"""Validate explore-agent findings against schema (stdin -> validated JSON)."""
import json, re, sys

KINDS = {"bug", "dead", "test", "doc", "sec"}

def main() -> int:
    schema_path = sys.argv[1]
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
    if not isinstance(findings, list) or not (1 <= len(findings) <= 10):
        print("findings must be a list of 1..10", file=sys.stderr)
        return 1
    clean = []
    for f in findings:
        if not isinstance(f, dict):
            return 1
        if f.get("kind") not in KINDS:
            return 1
        sev = f.get("severity")
        if not isinstance(sev, int) or not (1 <= sev <= 3):
            return 1
        file = str(f.get("file", ""))
        if file.startswith(("/..", "..")) or "/../" in file:
            return 1  # traversal
        if file.startswith((".github/workflows", "contracts",
                            "scripts/deploy", "scripts/security_check",
                            "scripts/hub_audit")):
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
