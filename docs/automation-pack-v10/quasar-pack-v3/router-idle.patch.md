# Правки для включения idle-режима

## 1. quasar.yml — добавить триггер и job

В `on:` добавить расписание (тихие часы + дневной лёгкий полл):

```yaml
  schedule:
    # Каждые 90 минут = два interleaved cron'а (16 будильников/сутки):
    - cron: "0 0-21/3 * * *"    # 00:00, 03:00, 06:00 ... 21:00 (480/мес)
    - cron: "30 1-22/3 * * *"   # 01:30, 04:30, 07:30 ... 22:30
    - cron: "12,42 * * * *"     # scout: 2 раза в час (1440/мес)
```

В `jobs:` добавить:

```yaml
  idle-agent:
    needs: route
    if: needs.route.outputs.idle-agent == 'true'
    uses: ./.github/workflows/_idle-agent.yml
    secrets:
      gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
```

## 2. scripts/router.mjs — добавить ветки

```js
// Idle-режим: два 90-минутных cron'а (шаг /3 через 0 и 30 минут).
if (ev === "schedule" && (cron.includes("0-21/3") || cron.includes("1-22/3")))
  out["idle-agent"] = "true";

// Scout: свой cron "12,42 * * * *" — мониторинг + поиск решений 2 раза в час.
if (ev === "schedule" && cron.includes("12,42")) out["scout"] = "true";
```

## 2а. quasar.yml — job scout

```yaml
  scout:
    needs: route
    if: needs.route.outputs.scout == 'true'
    uses: ./.github/workflows/_scout.yml
    secrets:
      gemini_api_key: ${{ secrets.GEMINI_API_KEY }}
```

И триггер в `on.schedule` (рядом с idle-cron):

```yaml
    - cron: "12,42 * * * *"             # scout: мониторинг 2 раза в час
```

Разделение ролей: idle-agent (*/15) — работа руками в простое;
scout (2×/час) — глаза и мозг: скан здоровья репо, гипотезы причин,
планы решений. Scout НЕ правит код — только открывает ai-fix-задачи
с готовым контекстом.

Расходы защищены самим _idle-agent.yml: если репо не в простое
(человеческие PR'ы активны, другие run'ы идут) — job завершается за
5 секунд ничего не делая.

## 3. Лимиты

- 1 idle-pass за окно простоя (concurrency group — один за раз).
- Ветка `idle/<module>-<date>`; если такая уже открыта — idle_check
  пропускает модуль (проверка open_branches).
- Бюджет Gemini: night-окно не более 8 explore-вызовов (под счётчик
  GEMINI_DAILY_CALLS из Части 19; счётчик проверяется в idle_check.py
  при желании — добавить туда gh variable get).
