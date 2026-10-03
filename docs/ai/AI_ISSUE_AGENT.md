# QUASAR — изолированный Ollama-агент для issue

**Статус:** активный workflow находится в `.github/workflows/ollama-issue-agent.yml`; он запускается только когда владелец репозитория вручную ставит метку `ollama-fix`. Gemini продолжает работать по `ai-fix`. Ollama использует отдельную concurrency group и ветку `ai/ollama-<issue>-agent`, чтобы результаты агентов не пересекались. Синхронизация TON Docs активна в `.github/workflows/ton-docs-sync.yml`. Оба процесса создают только draft PR; автоматического слияния и деплоя нет.

## Модель работы

1. Запуск — только по ручной метке `ollama-fix`, которую применил владелец репозитория. Gemini остаётся на отдельной метке `ai-fix`.
2. Job генерации работает на временной GitHub-hosted Ubuntu runner, запускает Ollama и скачивает `qwen2.5-coder:3b`. API-ключ внешней модели не нужен; модель и issue обрабатываются внутри процесса Ollama в изолированной среде job.
3. Ollama получает ограниченные отрывки из кода, тестов, локального TON Docs snapshot и текст issue. У модели нет shell-, GitHub-, файловых или сетевых tools; она возвращает только unified diff. Issue и Markdown считаются недоверенными данными.
4. Python preflight отклоняет traversal, symlink, binary diff, rename и изменения workflow/policy, package manifests, деплойных/security-скриптов, env-файлов, TON Docs snapshot, build/deployment артефактов и wallet credentials.
5. Отдельный job на чистом checkout применяет патч и запускает те же проверки, что и CI, на версии Node из `.nvmrc`: `npm run lint`, `npm test`, `npm run abi:verify`, `npm run abi:dapp`, `npm run deployment:check`, `npm run hashes:build`, `npx tsc --noEmit`, `npm audit --audit-level=high`. В этом job нет ключа модели и write-доступа.
6. Только после успешной проверки отдельный job получает write-права на contents и pull requests и создаёт или обновляет draft PR в `ai/ollama-<issue>-agent`.

Workflow не делает auto-merge, deploy, wallet-операций или on-chain действий. Человек проверяет каждый diff и сам принимает решение о merge. Синхронизация документации также создаёт только draft PR; автоматически обновлённые страницы не попадают в `main` без review.

## Настройка

- Ollama workflow использует временный GitHub-hosted `ubuntu-latest` runner и скачивает `qwen2.5-coder:3b` при каждом запуске.
- Для запуска владелец репозитория вручную добавляет `ollama-fix` к issue; workflow создаёт отдельный draft PR после проверок.
- GitHub Actions должен иметь разрешение создавать pull requests.
- TON Docs workflow синхронизирует snapshot по расписанию и через `workflow_dispatch`. Локально: `npm run ton:docs:sync`; проверка: `npm run ton:docs:check`.

## Данные и ограничения

На GitHub-hosted runner модель скачивается из реестра Ollama при каждом запуске; локального дискового кэша между запусками нет. Текст issue и отрывки репозитория не отправляются во внешний inference API, но обрабатываются в инфраструктуре GitHub Actions. Не используйте агент для конфиденциальных задач.

Синхронизируются только выбранные первичные страницы TON Docs из `docs/ton/index.json`, а не весь сайт. Это retrieval-augmented generation (RAG), не fine-tuning/обучение модели. TON Docs рекомендует Tolk; текущие контракты QUASAR написаны на Tact. Агент не переводит их на другой язык без прямого требования и отдельного человеческого решения.

Автоматические проверки не являются независимым аудитом и не подтверждают готовность контрактов к testnet/mainnet. Контрактные изменения требуют отдельного человеческого review по правилам из `GEMINI.md`.