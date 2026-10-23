# QUASAR — изолированный Ollama-агент для issue (draft)

**Статус в этой ветке:** Ollama workflow сохранён как шаблон `docs/ai/OLLAMA_ISSUE_WORKFLOW.yml`. Действующий модуль `.github/workflows/_ai-fix.yml` остаётся Groq workflow до установки шаблона владельцем репозитория. Синхронизация TON Docs хранится в `docs/ai/TON_DOCS_SYNC_WORKFLOW.yml` и также требует установки в `.github/workflows/`. Это draft-механизм, не production-сервис.

## Модель работы

1. Запуск — только по ручной метке `ai-fix`, которую применил владелец репозитория.
2. Job генерации работает на временной GitHub-hosted Ubuntu runner, запускает Ollama и скачивает `qwen2.5-coder:3b`. API-ключ внешней модели не нужен; модель и issue обрабатываются внутри процесса Ollama в изолированной среде job.
3. Ollama получает ограниченные отрывки из кода, тестов, локального TON Docs snapshot и текст issue. У модели нет shell-, GitHub-, файловых или сетевых tools; она возвращает только unified diff. Issue и Markdown считаются недоверенными данными.
4. Python preflight отклоняет traversal, symlink, binary diff, rename и изменения workflow/policy, package manifests, деплойных/security-скриптов, env-файлов, TON Docs snapshot, build/deployment артефактов и wallet credentials.
5. Отдельный job на чистом checkout применяет патч и запускает те же проверки, что и CI, на версии Node из `.nvmrc`: `npm run lint`, `npm test`, `npm run abi:verify`, `npm run abi:dapp`, `npm run deployment:check`, `npm run hashes:build`, `npx tsc --noEmit`, `npm audit --audit-level=high`. В этом job нет ключа модели и write-доступа.
6. Только после успешной проверки отдельный job получает write-права на contents и pull requests и создаёт или обновляет draft PR в `ai/<issue>-agent`.

Событие метки маршрутизируется оркестратором `.github/workflows/quasar.yml` (эпик #145): чистый роутер `scripts/router.mjs` решает, какой reusable-модуль запускать, а сами модули (`_ai-fix`, `_ai-review`, `_close-issues`, `_ai-merge`, `_pr-polish`, `_hub-audit`, `_stale`, `_dms`) объявляют только `workflow_call`. Merge возможен без approving review только после `SUCCESS` всех шести обязательных status contexts; `ai-merge-ok` — необязательный fast-path, а не approval.

Workflow сам не делает merge: draft PR проверяет GitHub CI, после чего отдельная automerge automation автоматически переводит его в ready/очередь только при зелёных обязательных checks. Approving review не требуется. Deploy, wallet-операции и on-chain действия запрещены. Синхронизация документации также создаёт draft PR и проходит тот же CI gate.

## Настройка

- После установки шаблона используйте GitHub-hosted `ubuntu-latest`; workflow устанавливает Ollama на время job и скачивает модель при каждом запуске.
- Убедитесь, что настройки Actions позволяют workflow создавать pull requests.
- Для запуска владелец репозитория вручную добавляет `ai-fix` к issue.
- После установки шаблона TON Docs snapshot обновляется по расписанию workflow `Sync official TON Docs context` и через `workflow_dispatch`. Команда локального обновления: `npm run ton:docs:sync`; проверка актуальности: `npm run ton:docs:check`.

## Данные и ограничения

На GitHub-hosted runner модель скачивается из реестра Ollama при каждом запуске; локального дискового кэша между запусками нет. Текст issue и отрывки репозитория не отправляются во внешний inference API, но обрабатываются в инфраструктуре GitHub Actions. Не используйте агент для конфиденциальных задач.

Синхронизируются только выбранные первичные страницы TON Docs из `docs/ton/index.json`, а не весь сайт. Это retrieval-augmented generation (RAG), не fine-tuning/обучение модели. QUASAR contracts are implemented in Tolk under `tolk/contracts/` and built with Acton. Archived Tact files under `docs/historical/tact-reference/` are historical evidence, not active source code.

Автоматические проверки не являются независимым аудитом и не подтверждают готовность контрактов к testnet/mainnet. Контрактные изменения допускаются только по прямому запросу владельца и после обязательных контрактных checks; approving review не является gate. Независимый аудит по-прежнему обязателен до заявлений о безопасности или готовности к mainnet.
