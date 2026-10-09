#!/usr/bin/env python3
"""Детерминированный классификатор отказов CI для workflow `QUASAR autofix`.

Задача: превратить сырой лог упавшего прогона и перечень Dependabot-алертов в
машиночитаемый план (`plan.json`) с классами отказа и списком допустимых
действий. Классификатор не вызывает LLM и не исполняет ничего из лога: лог —
недоверенные данные, из него читаются только сигнатуры.

Запуск:
    python3 scripts/autofix/classify_failure.py \
        --log evidence/ci.tail.log \
        --alerts evidence/alerts.json \
        --out evidence/plan.json \
        --summary "$GITHUB_STEP_SUMMARY"
"""

from __future__ import annotations

import argparse
import collections
import json
import os
import re
import sys
from typing import Any

# Каждый класс: (имя, шаблон-сигнатура, детерминированное действие, уверенность).
# Порядок важен: первое совпадение выигрывает, более специфичные идут раньше.
CLASS_RULES: list[tuple[str, str, str, str]] = [
    (
        "workflow-yaml",
        r"yamllint|actionlint|syntax error in workflow|invalid workflow file",
        "Переформатировать YAML и перепроверить actionlint/yamllint.",
        "high",
    ),
    (
        "action-pin-drift",
        r"pins:check|action pin|action_pins\.lock|out-of-date action pins",
        "Переразрешить SHA пинов: `npm run pins:sync`.",
        "high",
    ),
    (
        "formatting",
        r"prettier|code style issues|would be reformatted|format:check",
        "Применить форматтер: `npx prettier --write`.",
        "high",
    ),
    (
        "lint-typescript",
        r"eslint|error\s+TS\d+|tsc --noEmit|type error",
        "Применить безопасные автоисправления линтера и разобрать типовые ошибки типов.",
        "medium",
    ),
    (
        "dependency-audit",
        r"npm audit|vulnerabilit|audit-level|found \d+ vulnerabilit",
        "Обновить зависимости: `npm audit fix` без ломающих major-версий, затем overrides.",
        "high",
    ),
    (
        "lockfile-out-of-sync",
        r"npm ci can only install|lock file|package-lock\.json.*out of sync|EUSAGE",
        "Пересобрать lock-файл npm-ом: `npm install --package-lock-only`.",
        "high",
    ),
    (
        "contract-lint",
        r"tact --config|Tact compilation|contracts/.*\.tact:\d+",
        "Проверить Tact-контракты; автоматический патч контрактов запрещён — нужен человек.",
        "low",
    ),
    (
        "abi-drift",
        r"abi:verify|ABI snapshot|abi:dapp|opcode map",
        "Пересобрать ABI-снапшоты: `npm run abi:update`.",
        "medium",
    ),
    (
        "build-hashes",
        r"build-hashes|hashes:build|code hash",
        "Пересчитать build-hashes: `npm run hashes:build`.",
        "medium",
    ),
    (
        "test-failure",
        r"failing tests|✖|AssertionError|not ok \d+|FAILED \(",
        "Тесты упали: нужен человеческий разбор; автопатч не применяется к логике.",
        "low",
    ),
    (
        "network-flake",
        r"ECONNRESET|ETIMEDOUT|socket hang up|429 Too Many Requests|502 Bad Gateway",
        "Похоже на сетевой флейк: перезапустить прогон, код не менять.",
        "medium",
    ),
]

SEVERITY_ORDER = ["critical", "high", "moderate", "low", "unknown"]


def load_alerts(path: str | None) -> list[dict[str, Any]]:
    """Прочитать Dependabot-алерты; отсутствие файла — не ошибка."""
    if not path or not os.path.exists(path):
        return []
    try:
        with open(path, encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return []
    if isinstance(data, dict):
        data = data.get("alerts", [])
    return [item for item in data if isinstance(item, dict)]


def classify(log_text: str) -> list[dict[str, str]]:
    """Сопоставить лог с сигнатурами классов отказа."""
    found: list[dict[str, str]] = []
    seen: set[str] = set()
    for name, pattern, action, confidence in CLASS_RULES:
        if name in seen:
            continue
        match = re.search(pattern, log_text, re.IGNORECASE)
        if not match:
            continue
        seen.add(name)
        line = next(
            (ln.strip() for ln in log_text.splitlines() if re.search(pattern, ln, re.IGNORECASE)),
            "",
        )
        found.append(
            {
                "name": name,
                "detail": f"сигнатура `{match.group(0)[:80]}`",
                "action": action,
                "confidence": confidence,
                "evidence": line[:300],
            }
        )
    return found


def summarize_alerts(alerts: list[dict[str, Any]]) -> dict[str, Any]:
    """Сгруппировать алерты по severity и пакету."""
    by_severity: collections.Counter[str] = collections.Counter()
    by_package: collections.Counter[str] = collections.Counter()
    for alert in alerts:
        severity = ((alert.get("security_advisory") or {}).get("severity") or "unknown").lower()
        package = ((alert.get("dependency") or {}).get("package") or {}).get("name") or "?"
        by_severity[severity] += 1
        by_package[package] += 1
    ordered = {sev: by_severity.get(sev, 0) for sev in SEVERITY_ORDER if by_severity.get(sev)}
    for sev in sorted(by_severity):
        ordered.setdefault(sev, by_severity[sev])
    return {
        "total": len(alerts),
        "by_severity": ordered,
        "top_packages": by_package.most_common(15),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Классификатор отказов CI для QUASAR autofix")
    parser.add_argument("--log", help="Файл с хвостом лога упавшего прогона")
    parser.add_argument("--alerts", help="JSON с открытыми Dependabot-алертами")
    parser.add_argument("--out", required=True, help="Куда записать plan.json")
    parser.add_argument("--summary", help="Файл GITHUB_STEP_SUMMARY для отчёта")
    args = parser.parse_args()

    log_text = ""
    if args.log and os.path.exists(args.log):
        with open(args.log, encoding="utf-8", errors="replace") as handle:
            log_text = handle.read()

    alerts = load_alerts(args.alerts)
    classes = classify(log_text)
    alert_summary = summarize_alerts(alerts)

    actions = [c["action"] for c in classes]
    blocking = [c for c in classes if c["confidence"] == "high"]
    if blocking:
        actions.append("Проверить и применить только высоконадёжные исправления.")
    if alert_summary["total"]:
        actions.append(
            f"Разобрать {alert_summary['total']} открытых Dependabot-алертов "
            "в порядке severity (critical → high → moderate → low)."
        )
    if not classes and not alert_summary["total"]:
        actions.append("Применить общий набор безопасных фиксеров (формат, пины, lock-файл).")

    plan = {
        "schemaVersion": 1,
        "classes": classes,
        "actions": actions,
        "alert_count": alert_summary["total"],
        "alerts_by_severity": alert_summary["by_severity"],
        "alert_top_packages": alert_summary["top_packages"],
        "log_bytes": len(log_text),
    }

    out_dir = os.path.dirname(os.path.abspath(args.out))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(plan, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    if args.summary:
        with open(args.summary, "a", encoding="utf-8") as handle:
            handle.write("\n### Классификация отказа\n\n")
            if classes:
                for c in classes:
                    handle.write(f"- **{c['name']}** ({c['confidence']}): {c['action']}\n")
            else:
                handle.write("- Сигнатуры отказа не найдены.\n")
            handle.write("\n### План действий\n\n")
            for action in actions:
                handle.write(f"- {action}\n")

    print(f"classified {len(classes)} class(es); {alert_summary['total']} open alert(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
