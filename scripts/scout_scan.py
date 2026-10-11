#!/usr/bin/env python3
"""QUASAR scout scan: собрать проблемы репозитория в один JSON.

Выход: список проблем на stdout. Без модели — только детерминированные
сигналы: упавшие прогоны, issues без меток, зависшие PR, hotspots.
"""
import json, os, subprocess, sys, time

def gh(*args):
    return subprocess.run(["gh", *args], capture_output=True, text=True).stdout

def problems():
    out = []
    # 1. Последние упавшие прогоны (не более 5, без autopilot-веток-хвоста)
    runs = json.loads(gh("run", "list", "--limit", "30", "--json",
                          "workflowName,conclusion,createdAt,headBranch,displayTitle"))
    seen = set()
    for r in runs:
        if r["conclusion"] != "failure":
            continue
        key = r["workflowName"]
        if key in seen:
            continue
        seen.add(key)
        out.append({
            "kind": "failing_run",
            "what": f"workflow '{r['workflowName']}' failed on branch "
                    f"{r['headBranch']}: {r['displayTitle'][:120]}",
            "ref": f"run:{r['workflowName']}:{r['headBranch']}",
        })
        if len(seen) >= 5:
            break

    # 2. Issues без меток (кроме тестовых/эскалаций)
    issues = json.loads(gh("issue", "list", "--state", "open", "--limit", "50",
                           "--json", "number,title,labels,createdAt"))
    now = time.time()
    for i in issues:
        if i["labels"]:
            continue
        age_h = (now - time.mktime(time.strptime(i["createdAt"][:19],
                                                 "%Y-%m-%dT%H:%M:%S"))) / 3600
        if age_h < 1:        # свежие — дадим человеку/labeler'у время
            continue
        out.append({"kind": "unlabeled_issue",
                    "what": f"issue #{i['number']} without labels: {i['title'][:120]}",
                    "ref": f"issue:{i['number']}"})

    # 3. Зависшие draft-PR'ы агента (нет активности >24ч)
    prs = json.loads(gh("pr", "list", "--state", "open", "--limit", "50",
                        "--json", "number,title,isDraft,updatedAt,headRefName"))
    for p in prs:
        if not p["isDraft"]:
            continue
        if not p["headRefName"].startswith(("ai/", "copilot/", "idle/")):
            continue
        age_h = (now - time.mktime(time.strptime(p["updatedAt"][:19],
                                                 "%Y-%m-%dT%H:%M:%S"))) / 3600
        if age_h > 24:
            out.append({"kind": "stale_draft",
                        "what": f"draft PR #{p['number']} idle {int(age_h)}h: {p['title'][:120]}",
                        "ref": f"pr:{p['number']}"})

    # 4. Hotspots: файлы с TODO/FIXME (топ-5)
    grep = subprocess.run(
        ["grep", "-rl", "--include=*.ts", "--include=*.js",
         "-E", "TODO|FIXME", "scripts", "tests", "integrations", "website"],
        capture_output=True, text=True)
    for path in grep.stdout.splitlines()[:5]:
        out.append({"kind": "todo_hotspot",
                    "what": f"TODO/FIXME debt in {path}",
                    "ref": f"file:{path}"})
    return out

if __name__ == "__main__":
    json.dump(problems(), sys.stdout, ensure_ascii=False, indent=1)
