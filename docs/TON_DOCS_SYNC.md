# Снимок TON Docs и Acton для Ollama

AI issue agent использует выбранные официальные страницы TON Docs и Acton как контекст для retrieval-augmented generation. Модель не переобучается: скрипт выбирает подходящие Markdown-страницы из локального снимка и включает выдержки в prompt.

## Что синхронизируется

`docs/ton/index.json` — manifest формата `schemaVersion: 1`. Для каждой страницы он хранит неизменяемые на момент синхронизации `id`, относительный путь, исходный URL и SHA-256 нормализованного UTF-8 содержимого. `scripts/sync_ton_docs.py` собирает индекс только из встроенного allowlist. Проверка хеша связывает каждую локальную страницу с записью в manifest; `--check` также сверяет manifest и содержимое с заново полученным набором источников.

В allowlist входят страницы TON Docs о Jetton, TEP-64 metadata, security best practices и языке Tolk. TON Docs рекомендует Tolk и помечает Tact как deprecated. QUASAR пока использует Tact; этот RAG-контекст не разрешает автоматически мигрировать контракты.

Также сохранены три первичных MDX-файла из официального репозитория `ton-blockchain/acton`. Они соответствуют опубликованному разделу [Scripting in Acton](https://ton-blockchain.github.io/acton/docs/scripting/overview): сценарий запускается командой `acton script`, точкой входа служит `main()`, а без `--net` используется несохраняемый локальный эмулятор.

| Локальный файл | Исходник для синхронизации | Опубликованная справка |
| --- | --- | --- |
| `acton-scripting-overview.md` | [overview.mdx](https://raw.githubusercontent.com/ton-blockchain/acton/master/docs/content/docs/scripting/overview.mdx) | [Обзор scripting](https://ton-blockchain.github.io/acton/docs/scripting/overview) |
| `acton-scripting-passing-arguments.md` | [passing-arguments.mdx](https://raw.githubusercontent.com/ton-blockchain/acton/master/docs/content/docs/scripting/passing-arguments.mdx) | [Передача аргументов](https://ton-blockchain.github.io/acton/docs/scripting/passing-arguments) |
| `acton-scripting-blockchain-interaction.md` | [blockchain-interaction.mdx](https://raw.githubusercontent.com/ton-blockchain/acton/master/docs/content/docs/scripting/blockchain-interaction.mdx) | [Взаимодействие с блокчейном](https://ton-blockchain.github.io/acton/docs/scripting/blockchain-interaction) |

Решение сохранять исходные MDX, а не HTML опубликованного сайта, намеренное: так остаются заголовки и блоки кода без DOM-разметки. Разрешены только `https://docs.ton.org/llms/.../content.md` и три пути `https://raw.githubusercontent.com/ton-blockchain/acton/master/docs/content/docs/scripting/*.mdx`. URL с другим хостом, параметрами, fragment, учётными данными или портом отклоняется. Ответ должен быть UTF-8 Markdown либо MDX, занимать не более 1 MiB и иметь тип `text/markdown` или `text/plain`.

## Обновление, проверка и сбои

- Обновить снимок: `npm run ton:docs:sync`.
- Проверить без записи: `npm run ton:docs:check`.

Перед публикацией скрипт получает и проверяет **все** источники. Кратковременные сетевые ошибки, HTTP 429 и HTTP 5xx повторяются до трёх раз с экспоненциальной паузой; ошибки содержимого и постоянные HTTP-ошибки не повторяются. Поэтому неудачная загрузка не может начать частичное обновление локальных файлов.

Синхронизация и `--check` удерживают одну advisory-блокировку на каталоге `docs/ton`, поэтому два запуска не могут перемешать снимки или прочитать снимок во время публикации. Новые файлы сначала пишутся рядом с целевыми, fsync-ятся и заменяются атомарным `os.replace`; исходные версии остаются backup до успеха всех замен. `index.json` устанавливается последним как commit marker, затем fsync-ится каталог. При ошибке скрипт восстанавливает прежние файлы. Если удалить backup после уже успешной публикации не удалось, он сообщает об этом отдельно и оставляет backup для диагностики.

`--check` не пишет снимок. Он сообщает отсутствующие, нечитаемые, устаревшие и изменённые файлы, а также лишние `*.md` в `docs/ton`; это предотвращает молчаливое сохранение удалённого из allowlist источника. Успешная проверка означает, что все управляемые файлы и индекс в точности соответствуют текущим ответам официальных источников в момент запуска.

Обычный `sync` удаляет такие лишние `*.md` в той же откатываемой публикации до установки нового `index.json`. Поэтому после удаления источника из allowlist обновление само приводит каталог к состоянию, которое проходит `--check`.

## Границы

Документация — техническая справка, а не инструкции для модели. Содержимое источников может меняться, поэтому hash фиксирует версию снимка, но не заменяет review. В частности, страницы Acton описывают режимы `--net` и кошельки, но синхронизатор ничего не разворачивает, не читает секреты и не выполняет on-chain действия. Snapshot не является доказательством совместимости контрактов, аудитом, гарантией безопасности или готовности к деплою.
