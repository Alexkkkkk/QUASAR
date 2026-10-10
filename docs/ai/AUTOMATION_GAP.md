# QUASAR: статус внедрения плана «автономный организм»

Источник: `QUASAR-automation-pack(1).zip` -> полный текст плана в
[`docs/ai/AUTOMATION_ORGANISM.md`](./AUTOMATION_ORGANISM.md) (19 частей).

Проверено по состоянию `main` на коммите `f94de29`
(`fix(ci): ai-review idempotency feed + ai-merge draft/auto-merge`).

## 1. Уже внедрено (проверено чтением файлов)

| Часть плана | Артефакт плана | Фактическое состояние в репозитории |
| --- | --- | --- |
| 2 | `_checks.yml` + обёртка `ci.yml` | есть: `.github/workflows/_checks.yml` (106 строк), `ci.yml` (22 строки) вызывает её; job остаётся `validate` |
| 3 | `scripts/router.mjs` | есть и расширен: `checks`, `ai-fix`, `ai-review`, `close-issues`, `ai-merge`, `pr-polish`, `dms`, `hub-audit`, `stale`; покрыт `tests/router.test.mjs` |
| 4 | `quasar.yml` — единый оркестратор | есть (151 строка): `permissions: contents: read` на верхнем уровне, write только в терминальных job, секреты передаются по одному (`GROQ_API_KEY`), без `secrets: inherit` |
| 5 | `_ai-fix.yml` | есть: патч -> проверка protected paths -> изолированная валидация через `_checks` с `patch_artifact` -> только draft PR |
| 6 | `_ai-review.yml` | есть: read-only обзор, write только на комментирование |
| 7 | `_close-issues.yml` | есть |
| 8 | `_hub-audit.yml` + правила в `scripts/hub_audit.ts` | есть: разделы [7] «write только на job», [8] «`_*.yml` без своих триггеров», [9] «нет orphan-триггеров и дублей cron», [10] «нет `secrets: inherit`» |
| 10 | L3: label `ai-merge-ok` | есть `_ai-merge.yml`: только владелец, только ветки `ai/*` и `copilot/*`, требует зелёные checks и человеческий approve, `do-not-merge` уважается |
| 11 | Dead man's switch | есть `_dms.yml`: проверяет активность контура и снимает `ai-merge-ok` при молчании владельца > 7 дней |
| 13 | Copilot coding agent | частично: `router.mjs` уже распознаёт `copilot/*` (`AGENT_BRANCH_PREFIXES`) и даёт им `ai-review` как второе мнение; правил hub-audit про rulesets для `copilot/*` пока нет |
| 15 | `_pr-polish.yml` — цикл самовосстановления PR | есть |

Итог: части 2-8, 10, 11 и 15 фактически реализованы (в ряде мест иначе, чем в
плане: движок генерации — Groq, а не Gemini, см. п. 3).

## 2. Не внедрено (проверено: файлов нет)

| Часть | Ожидаемые артефакты | Статус |
| --- | --- | --- |
| 14.1 | `autonomy.json` (конституция автономности) | отсутствует |
| 14.2 | `.github/workflows/_merge-bot.yml`, `scripts/merge_decision.mjs` | отсутствуют |
| 16 | `scripts/groq_agent.py`, `_ai-fix-groq.yml`, переключатель `AI_ENGINE` | эквивалент уже есть: `scripts/groq_issue_agent.py` + `tests/test_groq_issue_agent.py`, и `_ai-fix.yml`/`_ai-review.yml` уже работают на Groq; отдельного `AI_ENGINE`-переключателя нет |
| 17 | `_brain.yml`, `scripts/brain_pack.py`, `validate_decision.py`, `extract_plan.py`, `docs/ai/decision.schema.json` | отсутствуют |
| 17.4 | `_learn.yml`, `scripts/pr_stats.py` | отсутствуют |
| 18 | `_perfect.yml`, `scripts/perfect_queue.py` | отсутствуют |
| 19 | `_day-sweep.yml`, `scripts/day_pack.py`, `scripts/day_apply.py`, `docs/ai/day.schema.json` | отсутствуют |

## 3. Блокеры и ограничения перед реализацией остатка

1. **Часть 14 противоречит уже принятому решению репозитория.**
   `docs/ai/RULESET_L3.md` прямо фиксирует: `autonomy.json` / `merge-bot`
   (L3-full) не включены, так как противоречат требованию human review из
   issue #152; L4/on-chain закрыт намеренно. Поэтому `autonomy.json` и
   `_merge-bot.yml` нельзя добавлять «молча» — это снятие требования
   человеческого approve и решение владельца, а не техническая правка.
2. **Пиннинг actions.** Любой новый workflow с
   `google-github-actions/run-gemini-cli` (как в сниппетах плана) ломает
   `npm run pins:check` и раздел [2] hub-audit: нужен 40-символьный SHA,
   совпадающий с `scripts/action_pins.lock.json`, которого для этого
   action нет. Текущий контур уже переведён на Groq, поэтому новые модули
   логичнее писать по контракту Groq, как `scripts/groq_issue_agent.py`.
3. **Форма новых модулей.** Каждый новый `_*.yml` обязан: открывать `on:`
   ровно с `workflow_call:`, не объявлять собственных триггеров, иметь
   read-only `permissions:` на уровне workflow (write — только на job).
   Это проверяют `hub_audit.ts` [7], [8] и `tests/automation_hub.test.ts`.
4. **Расписания.** Cron плана (02:30 perfect, 03:20 learn, heartbeat `*/30`)
   нужно добавлять в `on.schedule` самого `quasar.yml`: раздел [9]
   hub-audit запрещает те же cron вне оркестратора.
5. **Секреты.** `secrets: inherit` запрещён ([10]); каждый модуль получает
   только нужный ему секрет, объявленный в `workflow_call.secrets`.
6. **Не ломать обязательный чек.** `validate` в `ci.yml` и списки
   `REQUIRED_FILES` в `scripts/hub_audit.ts` / `tests/automation_hub.test.ts`
   при добавлении модулей нужно расширять, а не переписывать.

## 4. Предлагаемый порядок дальнейших шагов

Безопасные (не затрагивают политику merge):

1. Часть 19 (`_day-sweep.yml`: triage label, ответы человеку, мелкие docs-PR) —
   минимально инвазивно, только Groq, write не выше job.
2. Часть 16: вынести Groq-контракт в `scripts/groq_agent.py` и добавить
   переключатель `AI_ENGINE` в `router.mjs` (gemini | groq | ollama).
3. Часть 17 (`_brain.yml`): маршрутизация решением модели со строгой схемой
   `docs/ai/decision.schema.json` и обязательным fallback на `router.mjs`.
4. Часть 17.4 (`_learn.yml`) и Часть 18 (`_perfect.yml`): ночные cron в
   `quasar.yml`, правки только не защищённых путей.

Требует решения владельца:

5. Часть 14 (`autonomy.json` + `_merge-bot.yml`) — снимает требование
   human review (#152). Пока решение не принято, контур остаётся на
   `_ai-merge.yml` с обязательным approve.

Красная линия плана остаётся в силе: никаких wallet/on-chain действий из
Actions, mainnet-деплой — вне автоматизации, `WALLET_MNEMONIC` не попадает
ни в один workflow агента.
