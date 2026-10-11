# QUASAR failure patterns — память агентов (Gemini + Groq)

Агенты читают этот файл перед генерацией. Правило: если issue совпадает
с Signature — сначала применить known-good Fix; если Fix = unknown,
воспроизвести падение по Signature, прежде чем предлагать изменения.

Формат записи:
  ## Pattern: <имя>
  Signature: <признаки в логе>
  Root cause: <что было>
  Fix (known-good): <известное решение | unknown>
  Status: <OPEN | ESCALATED | RESOLVED>
  Seen: <дата>, run <id>, issue #N

=====================================================================

## Pattern: tests-red-after-docs-pack
Signature:
  - CI fails at step "Build and run contract and tooling tests" (~2 min)
  - steps before green: YAML lint, actionlint, tact lint, npm ci
  - "QUASAR Tests" workflow also failing on same commit
Root cause: docs-тесты ссылались на команду покрытия, которой не было
  в package.json на момент прогона (уточнено в PR #173, коммит
  "docs: clarify pending coverage command")
Fix (known-good): в docs-черновиках, ссылающихся на команды npm,
  проверять существование команды через `npm run` перед мержем;
  day-sweep при docs-PR проверяет все npm-команды из текста
Status: RESOLVED
Seen: 2026-10-10, run 38054572594, PR #173

## Pattern: heal-exhausted-tests-red
Signature:
  - autofix job heal: deterministic fixes applied, re-run of full
    check suite still fails, patch production skipped
  - repeats on schedule (every cron tick a new failed heal run)
Root cause: детерминированные фиксы покрывают только известные классы;
  неизвестное падение тестов требует модельного анализа
Fix (known-good): escalate job (autofix.yml) -> issue с label
  autofix-escalation -> label ai-fix -> ensemble-агент -> draft PR
Status: OPEN
Seen: 2026-10-10, runs 38052654156 / 38052723477 / 38054726119

## Pattern: refs-not-closing
Signature:
  - PR body contains "Refs #N" for issues that should close on merge
  - after merge issue stays open
Root cause: "Refs" — не closing keyword; только closes/fixes/resolves
Fix (known-good): в PR, закрывающем issue, писать "Closes #N";
  при review проверять closing keywords
Status: OPEN
Seen: 2026-10-10, PR #170 (Refs #167, #168)
