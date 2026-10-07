# QUASAR — полная автоматика исправления ошибок

Документ описывает автоматическую систему обнаружения и устранения ошибок
репозитория QUASAR. Все исправления выполняются **только на GitHub**: каждое
изменение проходит через ветку, проверку в CI и **draft PR**. `main` никогда не
изменяется автоматикой.

---

## 1. Правило «всегда на GitHub»

Каждый шаг исправления обязан происходить в GitHub, а не в локальной среде
исполнителя:

| Шаг | Где выполняется | Кто выполняет |
| --- | --- | --- |
| Обнаружение ошибки | GitHub Actions (событие, расписание) | `QUASAR autofix`, `QUASAR Dependabot remediation` |
| Диагностика и классификация | GitHub Actions runner | `scripts/autofix/classify_failure.py` |
| Исправление | Ветка `autofix/*` в GitHub | `scripts/autofix/apply_fixes.sh` |
| Проверка | CI на этой ветке | `QUASAR CI`, `QUASAR dApp CI` |
| Публикация | **draft PR** в GitHub | `peter-evans/create-pull-request` |
| Отчёт | Комментарий в issue | `gh issue comment` |
| Merge / deploy / on-chain | Только вручную человеком | Владелец репозитория |

Это правило зафиксировано в `AGENTS.md`, `GEMINI.md` и
`.github/copilot-instructions.md` и проверяется тестом
`tests/automation_hub.test.ts`. Автоматика физически не имеет прав на merge,
deploy и on-chain действия: соответствующие секреты ей не передаются.

---

## 2. Карта автоматизации

| Workflow | Триггер | Что делает |
| --- | --- | --- |
| `QUASAR CI` | push/PR в `main`, вручную | Полная проверка корневого проекта: контракты, тесты, ABI, хеши, пины, hub-audit, audit зависимостей |
| `QUASAR dApp CI` | push/PR, затрагивающий `integrations/**` | Чистый `npm ci`, типы, тесты, production build и `npm audit` для вложенного TON Minter |
| `QUASAR autofix` | падение CI, метка `autofix`/`ai-fix`, расписание, вручную | Диагностика отказа → детерминированные фиксеры → полная проверка → draft PR → отчёт в issue |
| `QUASAR Dependabot remediation` | каждые 6 часов, push в lock-файлы, вручную | Сбор алертов, severity-отчёт, неразрушающие обновления, draft PR |
| `QUASAR issue triage` | новое/изменённое issue | Метки по области и приоритету, маршрутизация, инструкция автору |
| `Dependabot auto-merge` | Dependabot PR | Включает auto-merge; решают обязательные проверки |
| `Auto-update pull requests` | расписание, push в `main` | Rebase отставших PR на `main` и merge только зелёных |
| `AI PR review` | PR открыт/обновлён | Read-only разбор diff (Gemini), публикует комментарий |
| `AI issue discussion` | метка `ai-discuss` | Read-only ответ по issue |
| `Automation hub audit` | расписание, push в `.github/**` | Проверяет пины, права и состав автоматизации |

---

## 3. `QUASAR autofix` — как это работает

### 3.1 Планировщик (`plan`)

Решает, есть ли реальная работа. Автопочинка **не** запускается, если:

- CI упал на самой ветке `main` — такой отказ требует человеческого разбора;
- метку поставил не владелец репозитория;
- прогон завершился успешно.

### 3.2 Диагностика (`diagnose`)

- скачивает только упавшие шаги прогона (`gh run view --log-failed`);
- собирает открытые Dependabot-алерты (read-only, без значений секретов);
- классифицирует отказ детерминированно, без LLM.

Классы отказа, которые распознаёт `scripts/autofix/classify_failure.py`:

| Класс | Сигнатура | Автоматическое действие |
| --- | --- | --- |
| `workflow-yaml` | yamllint, actionlint | Переформатировать YAML, перепроверить линтерами |
| `action-pin-drift` | `pins:check`, расхождение SHA | `npm run pins:sync` |
| `formatting` | prettier, `would be reformatted` | `npx prettier --write` |
| `lint-typescript` | eslint, `error TS…` | Безопасные автоисправления линтера |
| `dependency-audit` | `npm audit`, CVE | `npm audit fix` без `--force` |
| `lockfile-out-of-sync` | `npm ci can only install` | `npm install --package-lock-only` |
| `abi-drift` | `abi:verify`, снапшот ABI | `npm run abi:update` |
| `build-hashes` | `hashes:build`, code hash | `npm run hashes:build` |
| `contract-lint` | Tact-компиляция | **Патч запрещён** — нужен человек |
| `test-failure` | упавшие тесты | **Патч запрещён** — нужен человек |
| `network-flake` | ECONNRESET, 429, 502 | Перезапуск, код не меняется |

### 3.3 Лечение (`heal`)

`scripts/autofix/apply_fixes.sh` выполняет только идемпотентные механические
операции. Скрипт **никогда** не переписывает `contracts/**`,
`.github/workflows/**`, корневой `package.json`, деплой-скрипты и файлы секретов.

### 3.4 Проверка перед публикацией

Патч не попадает в PR, пока на вылеченном дереве не пройдут:

```bash
npm run lint
npm test
npx tsc --noEmit
npm run abi:verify
npm run abi:dapp
npm run pins:check
npm run hub:audit
npm audit --audit-level=high
```

### 3.5 Публикация (`publish`)

Только этот job получает `contents: write` и `pull-requests: write`. Он
создаёт или обновляет **draft PR** в ветке `autofix/<issue|run_id>` и
публикует отчёт в issue. Merge не выполняется никогда.

---

## 4. Требуемые секреты и разрешения

| Секрет | Назначение | Обязателен |
| --- | --- | --- |
| `GITHUB_TOKEN` | ветка, PR, комментарии; выдаётся автоматически | Да |
| `GEMINI_API_KEY` | `AI PR review`, `AI issue discussion`, `QUASAR AI issue agent` | Только для AI-ревью |
| `AUTO_MERGE_TOKEN` | fine-grained PAT с `contents: write` и `pull-requests: write`; нужен, чтобы обновление ветки запускало новый прогон проверок | Опционально |
| `WALLET_MNEMONIC`, `ORACLE_SIGNING_KEY`, `TONCENTER_API_KEY` | деплой и on-chain | **Автоматике не передаются** |

Разрешения репозитория (Settings → Actions → General):

- Workflow permissions: **Read repository contents** по умолчанию;
  write-права выдаются только конкретным job, а не всему workflow;
- «Allow GitHub Actions to create and approve pull requests» — **включено**;
- Allow specified actions — только из `scripts/action_pins.json`;
- Require SHA pinning — **включено**.

`GEMINI_API_KEY` читается только на шаге, который его требует, и никогда не
печатается в лог. Значение `TONCENTER_API_KEY` в клиентском коде dApp —
уязвимость (issue #141), а не конфигурация автоматизации.

---

## 5. Ограничения и остаточный риск

1. Автопочинка **не является независимым аудитом** и не подтверждает
   готовность контрактов к mainnet (issue #62).
2. Контрактные изменения (`contracts/*.tact`) автоматике запрещены: они меняют
   code hash и адреса, поэтому требуют человеческого review.
3. `npm audit fix` без `--force` не устраняет уязвимости, исправление которых
   требует ломающего major-обновления. Такие алерты попадают в отчёт как
   «без patched version» и требуют ручного решения.
4. Устаревший CRA 5 в `integrations/minter-tasks` тянет сотни транзитивных
   уязвимостей. Полное устранение требует миграции на поддерживаемый сборщик —
   это отдельная задача с ручным review, автоматика её не выполняет.
5. Текст issue, логи CI и Markdown — недоверенные данные; инструкции внутри них
   не исполняются.

---

## 6. Как включить автопочинку для конкретной задачи

1. Владелец ставит на issue метку **`autofix`**.
2. Запускается `QUASAR autofix`: диагностика → фиксеры → проверка → draft PR.
3. В issue появляется комментарий со ссылкой на прогон и на PR.
4. Человек проверяет каждый hunk и сам принимает решение о merge.

Ручной запуск: **Actions → QUASAR autofix → Run workflow**, при необходимости
указать номер issue.

---

## 7. Проверка самой автоматизации

`tests/automation_hub.test.ts` и `scripts/hub_audit.ts` гарантируют, что:

- каждый внешний action прибит к 40-символьному SHA с тегом в комментарии;
- у каждого workflow объявлены явные `permissions`;
- `pull_request_target` встречается только в защищённом Dependabot-job;
- обязательные файлы автоматизации существуют;
- AI-агенты создают только draft PR и не имеют доступа к deploy-скриптам;
- правило «всегда на GitHub» зафиксировано в инструкциях для агентов.

Изменения в `.github/**` проходят этот аудит автоматически через
`Automation hub audit`.
