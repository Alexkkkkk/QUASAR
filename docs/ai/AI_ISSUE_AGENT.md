# QUASAR — изолированный Ollama-агент для issue (draft)

**Статус в этой ветке:** Ollama workflow сохранён как шаблон `docs/ai/OLLAMA_ISSUE_WORKFLOW.yml`. Действующий `.github/workflows/ai-fix-agent.yml` остаётся Groq workflow до установки шаблона владельцем репозитория. Синхронизация TON Docs хранится в `docs/ai/TON_DOCS_SYNC_WORKFLOW.yml` и также требует установки в `.github/workflows/`. Это draft-механизм, не production-сервис.

## Модель работы

1. Запуск — только по ручной метке `ai-fix`, которую применил владелец репозитория.
2. Job генерации работает на временной GitHub-hosted Ubuntu runner, запускает Ollama и скачивает `qwen2.5-coder:3b`. API-ключ внешней модели не нужен; модель и issue обрабатываются внутри процесса Ollama в изолированной среде job.
3. Ollama получает ограниченные отрывки из кода, тестов, локального TON Docs snapshot и текст issue. У модели нет shell-, GitHub-, файловых или сетевых tools; она возвращает только unified diff. Issue и Markdown считаются недоверенными данными.
4. Python preflight отклоняет traversal, symlink, binary diff, rename и изменения workflow/policy, package manifests, деплойных/security-скриптов, env-файлов, TON Docs snapshot, build/deployment артефактов и wallet credentials.
5. Отдельный job на чистом checkout применяет патч и запускает те же проверки, что и CI, на версии Node из `.nvmrc`: `npm run lint`, `npm test`, `npm run abi:verify`, `npm run abi:dapp`, `npm run deployment:check`, `npm run hashes:build`, `npx tsc --noEmit`, `npm audit --audit-level=high`. В этом job нет ключа модели и write-доступа.
6. Только после успешной проверки отдельный job получает write-права на contents и pull requests и создаёт или обновляет draft PR в `ai/<issue>-agent`.

Workflow не делает auto-merge, deploy, wallet-операций или on-chain действий. Человек проверяет каждый diff и сам принимает решение о merge. Синхронизация документации также создаёт только draft PR; автоматически обновлённые страницы не попадают в `main` без review.

## Настройка

- После установки шаблона используйте GitHub-hosted `ubuntu-latest`; workflow устанавливает Ollama на время job и скачивает модель при каждом запуске.
- Убедитесь, что настройки Actions позволяют workflow создавать pull requests.
- Для запуска владелец репозитория вручную добавляет `ai-fix` к issue.
- После установки шаблона TON Docs snapshot обновляется по расписанию workflow `Sync official TON Docs context` и через `workflow_dispatch`. Команда локального обновления: `npm run ton:docs:sync`; проверка актуальности: `npm run ton:docs:check`.

## Данные и ограничения

На GitHub-hosted runner модель скачивается из реестра Ollama при каждом запуске; локального дискового кэша между запусками нет. Текст issue и отрывки репозитория не отправляются во внешний inference API, но обрабатываются в инфраструктуре GitHub Actions. Не используйте агент для конфиденциальных задач.

Синхронизируются только выбранные первичные страницы TON Docs из `docs/ton/index.json`, а не весь сайт. Это retrieval-augmented generation (RAG), не fine-tuning/обучение модели. TON Docs рекомендует Tolk; текущие контракты QUASAR написаны на Tact. Агент не переводит их на другой язык без прямого требования и отдельного человеческого решения.

Автоматические проверки не являются независимым аудитом и не подтверждают готовность контрактов к testnet/mainnet. Контрактные изменения требуют отдельного человеческого review по правилам из `GROQ.md`.