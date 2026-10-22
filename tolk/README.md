# QUASAR на Tolk через Acton

Каталог содержит отдельную реализацию QUASAR на Tolk. `../contracts/*.tact` остаются поведенческим эталоном; корневые npm/Tact build, ABI snapshots и dApp не переключаются на новый bytecode автоматически. Это не независимый аудит и не разрешение mainnet-запуска.

## Единая синхронизация

Проект фиксирует Acton `1.2.1` в `Acton.toml`. Установите эту версию из [официального релиза](https://github.com/ton-blockchain/acton/releases/tag/v1.2.1), выбрав архитектуру своей системы и проверив SHA-256 архива. Для npm-проверок нужен Node.js 22 или 24 и корневой `npm ci`.

Из корня репозитория:

```sh
python3 scripts/sync_acton.py
python3 scripts/sync_acton.py --check
```

Если бинарник не находится в PATH, передайте `--acton /полный/путь/acton`. Первая команда сверяет версию, собирает отдельную временную копию проекта, проверяет ABI, генерирует все Tolk/TypeScript wrappers, запускает Acton-тесты и оба локальных сценария. Только полностью проверенное поколение публикуется одним атомарным переключением `tolk/build/synchronized`. Неудачный build, wrapper, тест или сценарий оставляет предыдущее поколение доступным. Одновременные запуски блокируются; изменение исходников во время сборки отменяет публикацию.

`--check` работает без сети, без компилятора и без записи файлов. Проверяется SHA-256 исходников, эталонных ABI и каждого опубликованного артефакта. Удалённый, подменённый, лишний или устаревший файл приводит к ненулевому exit code. Manifest находится в `tolk/build/synchronized/sync-manifest.json`, а старые поколения сохраняются в `tolk/build/generations/`. Эти файлы и `.acton/` исключены из Git. Для полной очистки локальных артефактов можно удалить только `tolk/build/` и повторить синхронизацию.

Pipeline сначала строит свежий Tact baseline и проверяет его ABI-снапшоты. ABI gate сравнивает все входящие сообщения с `docs/abi/quasar-*.json`: имена, 32-битные opcodes, порядок и wire-типы полей. У getters сверяются имена, method IDs, аргументы, типы результатов и поля именованных структур из полного Tact ABI. Wire-типы и TVM stack-типы нормализуются отдельно. Дополнительно `scripts/check_acton_wrappers.ts` побайтово сравнивает все публичные сообщения обоих генераторов: nullable cells, payload refs, signed integers и длинные UTF-8 строки. Ручного второго wrapper больше нет: весь код привязок генерируется compiler ABI.

TypeScript-привязки находятся в `tolk/build/synchronized/wrappers-ts/`. Для них используется ровно официальный генератор `@ton/tolk-abi-to-typescript@0.5.0`, закреплённый в Acton 1.2.1. File-based adapter `scripts/acton_typescript.mjs` передаёт ABI и BoC через файлы и вызывает тот же CLI в процессе Node: большой Master больше не упирается в системный лимит одного аргумента `execve`. Генерация не переписывает действующее dApp и не публикует адреса.

Custom storage serializers Tolk не превращаются в TypeScript-реализацию автоматически. Для TypeScript `fromStorage` нужны явно зарегистрированные custom hooks; без них генератор отклоняет операцию. Эти bindings проверяются как message/getter-интерфейс, не как разрешение или готовый механизм deployment.

## Самостоятельные Tolk-сценарии

Сценарии следуют [Acton scripting overview](https://ton-blockchain.github.io/acton/docs/scripting/overview): точка входа — `main()`, аргументы разбираются по её ABI, локальное состояние не сохраняется между запусками.

После синхронизации:

```sh
cd tolk
acton script scripts/local-smoke.tolk
acton script scripts/storage-fee.tolk 3600
```

`local-smoke.tolk` открывает только эмулированные кошельки, создаёт Master и выполняет локальный mint. Он проверяет подтверждение первой транзакции и полного trace, supply, баланс получателя, владельца и код Wallet. Адреса и ключи не выводятся. Проверка `net.isBroadcasting()` выполняется до `scripts.wallet()`; broadcast-режим завершается ошибкой, а не отключается молча.

`storage-fee.tolk` принимает позиционный `duration: int`, проверяет диапазон 1–315360000 секунд и рассчитывает storage fee кода Wallet. Отдельно показывается оценка gas для вычисления размера. Это расчёт по конфигурации локального эмулятора, не обещание будущей сетевой стоимости. Некорректные аргументы и ошибки дают ненулевой exit code.

Реальный deploy, подпись, отправка транзакций, mint/burn/переводы в публичной сети и публикация deployment-адресов запрещены в рамках этой миграции согласно `AGENTS.md`. Pipeline не принимает `--net`, `--fork-net`, mnemonic или wallet configuration и не использует deploy-секреты. Документация Acton о broadcast сохранена для изучения, но не является разрешением этих операций.

## Точечная разработка

Для ручной диагностики, без атомарной гарантии полного pipeline:

```sh
cd tolk
acton build
acton wrapper --all --output-dir build/synchronized/wrappers
acton test
cd ..
python3 scripts/acton_abi.py
python3 -m unittest discover -s tests -p 'test_acton_sync.py'
```

Ручной `acton build` или wrapper может изменить опубликованные артефакты. После таких команд integrity check вправе отказать: повторите полный `sync_acton.py`. Все outputs изолированы от корневого `build/`, используемого Tact.

## Границы миграции

ABI gate не доказывает эквивалентность storage и всех экономических/авторизационных сценариев. Tolk использует отдельный versioned storage; данные уже развёрнутого Tact-контракта не предназначены для загрузки этим bytecode. Язык и компилятор меняют code hashes и детерминированные адреса даже при совпадении wire ABI. Расширение регрессионного покрытия, независимый аудит и отдельное человеческое решение о release остаются обязательными.

Официальные источники: [передача аргументов](https://ton-blockchain.github.io/acton/docs/scripting/passing-arguments), [blockchain interaction и wait helpers](https://ton-blockchain.github.io/acton/docs/scripting/blockchain-interaction), [wrapper command](https://ton-blockchain.github.io/acton/docs/commands/wrapper), [Acton.toml](https://ton-blockchain.github.io/acton/docs/acton-toml), [Tolk overview](https://docs.ton.org/tolk/overview). Локальный reviewed corpus обновляется отдельной командой `npm run ton:docs:sync`; описание — `../docs/TON_DOCS_SYNC.md`.
