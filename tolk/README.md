# QUASAR на Tolk через Acton

`tolk/` — канонический исходный проект QUASAR. Все активные контрактные
исходники, эмуляционные тесты, ABI, BoC и generated wrappers строятся только
из Tolk через закреплённый Acton `1.2.1`.

## Предварительные требования

- Node.js 22 или 24 и npm.
- Python 3.11+ с `pip`: `scripts/sync_acton.py` использует встроенный в Python
  3.11 модуль `tomllib`; для Python-части `npm test` нужен `numpy` из
  `requirements.txt`.
- Заранее установленный Acton CLI **1.2.1**. Установите начальный бинарный файл
  по [официальной инструкции Acton](https://ton-blockchain.github.io/acton/docs/installation),
  затем выполните `acton up 1.2.1`. `npm ci` не устанавливает Acton.

Перед локальной проверкой убедитесь, что используются именно эти инструменты:

```sh
acton --version             # должен вывести acton 1.2.1
python3 --version           # Python 3.11 или новее
python3 -m pip install -r requirements.txt
```

## Локальная проверка

Из корня репозитория выполните:

```sh
npm ci
npm run acton:init
npm run lint
npm run build
npm test
npm run abi:verify
npm run abi:dapp
python3 scripts/sync_acton.py --check
```

`npm run build` запускает `scripts/sync_acton.py`. Скрипт собирает изолированную
копию Tolk-проекта, проверяет форматирование, ABI snapshots, generated Tolk и
TypeScript wrappers, Acton linter/tests и локальные сценарии. Лишь затем он
атомарно публикует артефакты в `tolk/build/synchronized/`. Команда `--check`
не использует сеть и проверяет hashes исходников и каждого опубликованного
артефакта.

TypeScript wrappers генерируются закреплённым
`@ton/tolk-abi-to-typescript@0.5.0` через file-based adapter. Это избегает
ограничения размера аргумента при генерации большого `QuasarMaster`.

## Границы нового поколения

Tolk contracts являются новым generation deployment. Они имеют новый code hash,
StateInit, storage schema и детерминированные адреса, включая адреса Jetton
wallet. Это **не** in-place upgrade и не декодер состояния существующих
Tact-контрактов. Существующий Tact исходник и старые sandbox suites сохранены
только в [`../docs/historical/tact-reference/`](../docs/historical/tact-reference/)
как доказательство миграции; они не участвуют в CI и release builds.

Деплой, broadcast, использование ключей и публикация адресов не входят в этот
cutover. До нового deployment необходимы отдельный audited migration plan,
полная testnet rehearsal и независимый security audit.
