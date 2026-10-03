# QUASAR — изолированный ИИ-агент для issue (draft)

Workflow: `.github/workflows/ai-fix-agent.yml`. Он заменяет прежний `.github/workflows/ai-fix.yml`, чтобы на метку `ai-fix` запускался только изолированный вариант. Это draft-механизм для подготовки изменений к человеческому review, не production-сервис.

## Модель работы

1. Запуск — только по ручной метке `ai-fix`, которую применил владелец репозитория.
2. Job генерации получает read-only права на код и issue, checkout выполняется без сохранения GitHub credentials. Gemini получает `GEMINI_API_KEY` только как repository secret и работает с файловыми инструментами без shell.
3. Заголовок и тело issue считаются недоверенными данными. Перед проверками workflow отклоняет патчи, затрагивающие workflows, agent policy и guide, package manifests, deployment/security скрипты, env-файлы, build/deployment артефакты и wallet credentials.
4. Отдельный job на чистом checkout применяет патч и запускает тот же набор гейтов, что и CI, на той же версии Node из `.nvmrc`: `npm run lint`, `npm test`, `npm run abi:verify`, `npm run abi:dapp`, `npm run deployment:check`, `npm run hashes:build`, `npx tsc --noEmit`, `npm audit --audit-level=high`. В этом job нет Gemini API key и write-доступа.
5. Только после успешной проверки отдельный job получает write-права на contents и pull requests и создаёт или обновляет draft PR в `ai/<issue>-agent`.

Workflow не делает auto-merge, deploy, wallet-операций или on-chain действий. Человек проверяет каждый diff и сам принимает решение о merge.

## Настройка

- Добавьте `GEMINI_API_KEY` в Settings → Secrets and variables → Actions. Не публикуйте ключ в issue, коде, логах или чате.
- Убедитесь, что настройки Actions позволяют workflow создавать pull requests.
- Для запуска владелец репозитория вручную добавляет `ai-fix` к issue.

## Данные и ограничения

Содержимое помеченных issue отправляется в Gemini API. Учитывайте действующие условия хранения и использования данных Gemini; не помечайте конфиденциальные issue.
Автоматические проверки не являются независимым аудитом и не подтверждают готовность контрактов к testnet/mainnet. Контрактные изменения требуют отдельного человеческого review по правилам из `GEMINI.md`.