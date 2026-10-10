#!/usr/bin/env python3
"""QUASAR idle gate: is the repository idle, and what should agents study?

Outputs GITHUB_OUTPUT-style lines:
  idle=true|false
  target=<module path> | none
  reason=<short explanation>

Idle = никто не работает в репо прямо сейчас. Студить можно только
в простое, чтобы агент не мешал человеку и не гонялся за собой.
"""
import json, os, subprocess, sys, time

def gh(*args):
    r = subprocess.run(["gh", *args], capture_output=True, text=True)
    return r.stdout

MAX_ACTIVE = int(os.environ.get("IDLE_MAX_ACTIVE_RUNS", "1"))
HUMAN_PR_HOURS = int(os.environ.get("IDLE_HUMAN_PR_HOURS", "6"))

REDLINES = (".github/workflows", "contracts", "scripts/deploy",
            "scripts/security_check", "scripts/hub_audit",
            "scripts/sync_action_pins")

def is_idle() -> tuple[bool, str]:
    in_progress = json.loads(gh("run", "list", "--status", "in_progress",
                                "--limit", "50", "--json", "databaseId"))
    # Свой собственный run не считаем: idle-agent один (concurrency group)
    if len(in_progress) > MAX_ACTIVE:
        return False, f"{len(in_progress)} runs in progress"
    prs = json.loads(gh("pr", "list", "--state", "open", "--limit", "50",
                        "--json", "number,headRefName,updatedAt,author"))
    cutoff = time.time() - HUMAN_PR_HOURS * 3600
    human = [p for p in prs
             if not p["headRefName"].startswith(("ai/", "copilot/", "idle/",
                                                 "autopilot/", "perfect/"))
             and time.mktime(time.strptime(p["updatedAt"][:19],
                                           "%Y-%m-%dT%H:%M:%S")) > cutoff]
    if human:
        return False, f"human PRs active: {[p['number'] for p in human]}"
    return True, "idle"

def pick_target() -> str:
    """Следующий модуль для изучения: TODO/FIXME-долг + churn, без
    конфликтов с открытыми ветками."""
    open_branches = set()
    for p in json.loads(gh("pr", "list", "--state", "open", "--limit", "50",
                           "--json", "headRefName")):
        open_branches.add(p["headRefName"].split("/")[0])
    # Ищем модули верхнего уровня
    modules = [d for d in os.listdir(".")
               if os.path.isdir(d) and not d.startswith((".", "node_modules", "docs"))
               and d not in ("contracts",)]
    scores = {}
    for m in modules:
        if m in REDLINES or any(m.startswith(r + "/") for r in REDLINES):
            continue
        if m.split("/")[0] in open_branches or m in open_branches:
            continue
        try:
            grep = subprocess.run(
                ["grep", "-rl", "--include=*.ts", "--include=*.js",
                 "-E", "TODO|FIXME|HACK|XXX", m],
                capture_output=True, text=True)
            todos = len(grep.stdout.splitlines())
        except Exception:
            todos = 0
        try:
            churn = int(subprocess.run(
                ["git", "log", "--since=30 days ago", "--oneline", "--", m],
                capture_output=True, text=True).stdout.count("\n"))
        except Exception:
            churn = 0
        scores[m] = todos * 10 + churn
    if not scores:
        return "none"
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "none"

def main() -> int:
    idle, why = is_idle()
    print(f"idle={'true' if idle else 'false'}")
    print(f"reason={why}")
    if idle:
        print(f"target={pick_target()}")
    else:
        print("target=none")
    return 0

if __name__ == "__main__":
    sys.exit(main())
