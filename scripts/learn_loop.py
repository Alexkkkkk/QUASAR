#!/usr/bin/env python3
"""QUASAR learn loop: update docs/ai/failure_patterns.md from run history.

Purely deterministic (no model calls): закрытие уроков по факту мержа PR,
эскалации по повторным падениям. Модельный анализ добавляется отдельно.
"""
import argparse, json, re, sys
from datetime import datetime, timezone

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def section(patterns: str, name: str) -> str | None:
    m = re.search(rf"^## Pattern: {re.escape(name)}\n(.*?)(?=^## |\Z)",
                  patterns, re.S | re.M)
    return m.group(1) if m else None

def close_lesson(patterns: str, run_name: str, evidence: str) -> str:
    """Отметить самый старый незакрытый урок, если зелёные прогоны идут."""
    def repl(m):
        body = m.group(0)
        if "Fix (known-good): unknown" in body and "Status: OPEN" in body:
            body = body.replace("Fix (known-good): unknown",
                                f"Fix (known-good): {evidence}")
            body = body.replace("Status: OPEN", "Status: RESOLVED")
        return body
    return re.sub(r"^## Pattern: .*?(?=^## |\Z)", repl, patterns,
                  flags=re.S | re.M)

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--runs", required=True)
    ap.add_argument("--prs", required=True)
    ap.add_argument("--issues", required=True)
    ap.add_argument("--patterns", required=True)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    runs = load(a.runs)
    prs = load(a.prs)
    issues = load(a.issues)
    patterns = open(a.patterns, encoding="utf-8").read()

    # 1. Последние 10 прогонов CI — все ли зелёные?
    ci = [r for r in runs if r.get("workflowName") == "QUASAR CI"][:10]
    ci_green = all(r.get("conclusion") == "success" for r in ci) and len(ci) >= 3

    # 2. Недавний merge PR с меткой ai-fix / autofix — урок закрыт.
    merged_agent = [p for p in prs
                    if p.get("mergedAt")
                    and any(l["name"] in ("ai-fix", "autofix")
                            for l in p.get("labels", []))]

    new = patterns
    if ci_green and merged_agent:
        evidence = (f"PR #{merged_agent[0]['number']} merged "
                    f"{merged_agent[0]['mergedAt'][:10]}")
        new = close_lesson(new, "", evidence)

    # 3. Повторяющиеся падения одного workflow без открытой эскалации ->
    #    добавить/обновить OPEN-урок (только если такого ещё нет).
    failed = [r for r in runs if r.get("conclusion") == "failure"]
    by_name = {}
    for r in failed:
        by_name[r.get("workflowName", "?")] = by_name.get(r.get("workflowName", "?"), 0) + 1
    for name, cnt in by_name.items():
        if cnt >= 2 and f"## Pattern: recurring-{name}" not in new:
            esc = [i for i in issues
                   if any(l["name"] == "autofix-escalation" for l in i.get("labels", []))
                   and i.get("state") == "open"]
            status = "ESCALATED" if esc else "OPEN"
            new += (f"\n## Pattern: recurring-{name}\n"
                    f"Signature:\n  - workflow '{name}' failed {cnt}x in last 200 runs\n"
                    f"Root cause: unknown\nFix (known-good): unknown\n"
                    f"Status: {status}\nSeen: {datetime.now(timezone.utc):%Y-%m-%d}\n")

    if new == patterns:
        print("no pattern updates")
        return 0
    if a.dry_run:
        print("--- diff would be written ---")
        return 0
    with open(a.patterns, "w", encoding="utf-8") as f:
        f.write(new)
    print("failure_patterns.md updated")
    return 0

if __name__ == "__main__":
    sys.exit(main())
