#!/usr/bin/env python3
"""Validate scout solutions and route them: ai-fix issue or plan comment.

Stdin: сырой ответ модели. Выход: план (для логов). Действия:
  auto_fixable && confidence >= 0.7 -> issue с label ai-fix (dedup по title)
  иначе если target_issue -> комментарий с планом
  иначе -> молча пропустить.
"""
import json, re, subprocess, sys

def gh(*args):
    return subprocess.run(["gh", *args], capture_output=True, text=True)

def main() -> int:
    raw = sys.stdin.read()
    m = re.search(r"\{.*\}", raw, re.S)
    if not m:
        return 0
    try:
        data = json.loads(m.group(0))
    except json.JSONDecodeError:
        return 0
    sols = data.get("solutions")
    if not isinstance(sols, list):
        return 0

    opened = 0
    for s in sols:
        try:
            auto = bool(s.get("auto_fixable"))
            conf = float(s.get("confidence", 0))
            plan = [str(x)[:200] for x in s.get("fix_plan", [])][:5]
            cause = str(s.get("root_cause", ""))[:400]
            target = s.get("target_issue")
        except (TypeError, ValueError):
            continue

        body = (f"🔍 **Scout solution**\n\nRoot cause (hypothesis): {cause}\n\n"
                f"Plan:\n" + "".join(f"- {p}\n" for p in plan) +
                f"\nConfidence: {conf:.2f}")

        if auto and conf >= 0.7:
            title = f"Scout: {cause[:80]}"
            dup = gh("issue", "list", "--label", "ai-fix", "--state", "open",
                     "--json", "title", "--jq",
                     f".[] | select(.title == \"{title}\") | .title")
            if dup.stdout.strip():
                continue                       # уже есть такая задача
            r = gh("issue", "create", "--title", title,
                   "--label", "ai-fix,scout", "--body", body)
            opened += 1
        elif target:
            gh("issue", "comment", str(target), "--body", body)

    print(json.dumps({"created": opened}, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    sys.exit(main())
