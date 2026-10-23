# QUASAR: завершение адаптации Tolk — 2026-10-23

Исходная база: `9794f3c232a4264d8f556a9a556da9c8a124a445`. Задача:
[#293](https://github.com/Alexkkkkk/QUASAR/issues/293). Активный toolchain:
Tolk через Acton `1.2.1`. Cutover контрактов и CI уже выполнен в PR #290/#291;
это изменение закрывает оставшиеся пробелы tooling, документации и регрессий,
а не повторяет переписывание контрактов.

Во время работы в `main` добавлен parity gate #292. Ветка перенесена на
`40e78a9`; новый checker согласован со schema 3 через явный allowlist ровно двух
TEP-89 `ProvideWalletAddress.ownerAddress` fields (Master и Wallet). Прочие
переходы `address` → `any_address`, переименования и изменение optionality
по-прежнему отклоняются; добавлены две негативные regression-проверки.

## ABI и совместимость клиентов

`scripts/acton_abi.py` и четыре snapshots в `docs/abi/` переведены на schema `3`.
Прежняя схема фиксировала имя возвращаемой getter-структуры, но не её поля.
Теперь section `types` фиксирует поля всех структур, достижимых из сообщений,
аргументов и результатов getters. Изменения порядка, имён и типов полей
обнаруживаются при неизменном имени структуры.

Typed cells/maps сохраняют вложенные типы, ключ и значение; `any_address`
отличим от internal `address`. Неизвестные виды типов и неверные индексы
отклоняются. Named references позволяют описать рекурсивные cell records без
бесконечного разворачивания. Наличие custom pack/unpack фиксируется, но тело
ручного сериализатора по-прежнему проверяется отдельными wire-тестами.

Добавлены 12 offline-тестов `tests/test_acton_abi.py`. Формат и назначение ABI
соответствуют [официальной документации TON](https://docs.ton.org/tolk/features/contract-abi).
Смена версии snapshot не меняет on-chain wire ABI.

## Публикация сборки

В `scripts/sync_acton.py` исправлен воспроизводимый отказ: если первый symlink
commit падает после переноса существующего реального каталога, прежний каталог
теперь восстанавливается. Подтверждение — тест с внедрённой ошибкой, который
падал до исправления и проходит после него.

Добавлены 11 offline-тестов `tests/test_sync_acton.py`: read-only integrity,
изменения исходников/артефактов, неподдерживаемый manifest, конкурентная
блокировка, неправильная версия Acton, отказ validation stages, copy failure
и сохранность прежнего поколения при ошибке публикации.

## Контрактные регрессии и Tolk-only policy

Добавлены четыре Tolk-теста в двух новых файлах:
`tolk/tests/master-mint-bounce.test.tolk` и
`tolk/tests/wallet-regression.test.tolk`. Проверяются owner-only mint и откат
supply при mint bounce, повторный pending queryId после cooldown, wallet-side
TEP-89 discovery с проверкой бюджета ответа и marked pool-payout bounce с
возвратом баланса и `PayoutFailed`.

Policy запрещает активные Tact/FunC исходники, прямые legacy compiler packages
и импорты архивных wrappers из активного TS/JS. Историческое evidence сохранено
в `docs/historical/tact-reference/` и не становится build input. Quick Start,
whitepaper, agent memory, attributes и Dependabot согласованы с Tolk/Acton;
инструкции явно требуют Acton 1.2.1, Node 22/24, Python 3.11+ и requirements.

## Результаты полного локального прогона

Успешно выполнены `npm ci`, `npm run acton:init`, `npm run lint`,
`npm run security:check`, `npm test`, `npx tsc --noEmit`, `npm run abi:verify`,
`npm run abi:migration:check`, `npm run abi:dapp`, `npm run deployment:check`, `npm run pins:check`,
`npm run hub:audit`, `npm audit --audit-level=high`,
`python3 scripts/sync_acton.py --check`, `yamllint`, `actionlint 1.7.12` и
`git diff --check`.

Tolk: **36 passed** в восьми файлах. Node: **129 passed**. Python unittest:
**69 passed**, включая 23 новых offline-теста codec/publication и две новые
регрессии узкого parity allowlist. Дополнительный запуск Python через pytest,
как в GitHub CI: **81 passed, 86 subtests passed**. Root dependency audit:
**0 уязвимостей**. Hub audit: **0 ошибок**, 17 предупреждений существующего
automation inventory. Deployment check не подтверждает live deployment:
deployment artifact не опубликован и эта проверка штатно пропущена.

Compiler ABI и BoC SHA-256 совпадают с `docs/build-hashes.json`: контрактное
поколение не изменено. Файлы `tolk/contracts/**`, `tolk/Acton.toml`,
`package.json`, `package-lock.json` и `.github/workflows/**` не менялись.
GitHub CI выполняется отдельно на опубликованном PR; этот раздел отражает
локальные результаты, а не утверждает завершение удалённых проверок.

## Ограничения выпуска

Изменение не доказывает полную поведенческую эквивалентность историческим
Tact-тестам и не является независимым аудитом. Tolk остаётся отдельным
поколением со своей storage schema и адресами; старое Tact-состояние нельзя
считать пригодным для загрузки в новый bytecode. Testnet rehearsal,
state-transition plan и независимый аудит остаются отдельными release gates.

Секреты не читались. Merge, deployment, broadcast, mint/burn/переводы в реальной
сети и публикация адресов не выполнялись. Проверки контрактов запускались только
в локальном эмуляторе.
