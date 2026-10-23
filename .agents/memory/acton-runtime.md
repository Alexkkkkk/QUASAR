---
name: Среда Tolk/Acton
description: Требования к среде и установке активного Tolk-проекта QUASAR.
---

Активные контракты QUASAR собираются только из Tolk через Acton `1.2.1`.

- Используйте Node.js 22 или 24 и npm, как объявлено в корневом `package.json`.
- Используйте Python 3.11+ с `pip`: `scripts/sync_acton.py` импортирует
  стандартный `tomllib`, доступный с Python 3.11. Контрактная синхронизация не
  требует сторонних Python-пакетов, но полный `npm test` запускает
  `tests/test_neural.py` и поэтому требует `python3 -m pip install -r requirements.txt`.
- До `npm run build`, `npm run lint` или `npm run acton:init` предварительно
  установите Acton CLI 1.2.1. `npm ci` его не устанавливает. После bootstrap по
  [официальной инструкции Acton](https://ton-blockchain.github.io/acton/docs/installation)
  закрепите выпуск командой `acton up 1.2.1` и подтвердите его через
  `acton --version`.

Исторические Tact-материалы находятся только в
`docs/historical/tact-reference/`; они не являются инструкцией для активной
сборки, CI или зависимостей.
