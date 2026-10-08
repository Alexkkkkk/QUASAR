# Снимок TON Docs для Ollama

AI issue agent использует несколько официальных страниц TON Docs как контекст для retrieval-augmented generation (RAG). Модель не переобучается: при каждом запросе скрипт выбирает подходящие Markdown-страницы из локального снимка и включает выдержки в prompt.

## Что синхронизируется

`docs/ton/index.json` — allowlist официальных Markdown URL, путей и SHA-256. `scripts/sync_ton_docs.py` принимает только HTTPS-адреса `docs.ton.org/llms/.../content.md`, проверяет HTTP-ответ, тип содержимого, размер и UTF-8, после чего обновляет snapshot.

В allowlist входят страницы TON Docs о:

- архитектуре Jetton и сообщениях/get methods TEP-74;
- переводах и поиске Jetton wallet;
- TEP-64 metadata;
- security best practices;
- языке Tolk.

TON Docs отмечает Tolk как рекомендуемый язык, а Tact как deprecated. QUASAR всё ещё использует Tact; этот RAG-контекст не разрешает агенту автоматически мигрировать контракты.

## Обновление и review

- Локально: `npm run ton:docs:sync`.
- Проверить snapshot без записи: `npm run ton:docs:check`.
- Шаблон расписания — `docs/ai/TON_DOCS_SYNC_WORKFLOW.yml`. После его установки в `.github/workflows/` GitHub Actions синхронизирует snapshot еженедельно и по `workflow_dispatch`.
- Изменения поступают в отдельный draft PR. Просматривайте diff и источники; без review и merge `main` не изменяется.

Если официальный URL недоступен, ответ не Markdown, превышает лимит или перенаправляет за пределы `docs.ton.org`, синхронизация завершается ошибкой и не записывает частичный snapshot.

## Границы

Документация — техническая справка, а не инструкции для модели. Содержимое страницы может меняться; hash в index помогает определить точную версию каждого файла. Snapshot не является доказательством совместимости контрактов, аудитом, гарантиями безопасности или готовности к деплою. Любое изменение `contracts/*.tact` по-прежнему требует ссылок на источники, обновления conformance-материалов и человеческого review по `GROK.md`.