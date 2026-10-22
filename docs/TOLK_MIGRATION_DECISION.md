# Решение о миграции Tact → Tolk

Обновлено: 2026-10-22, PR #280. Разрешены параллельная Tolk-реализация, локальные build/test/script и проверка совместимости. Переключение production/testnet bytecode, deployment и перенос состояния не разрешены этим изменением.

В `tolk/` теперь есть отдельный проект Acton 1.2.1: Master, Wallet, DeFi и AdminTimelock. Корневые `contracts/*.tact`, npm/Tact build и действующее dApp остаются эталонным поддерживаемым путём. Историческое решение от 2026-09-29 «не добавлять Tolk в тот change set» не описывает текущее дерево PR.

`scripts/sync_acton.py` строит свежий Tact baseline и изолированное поколение Tolk-артефактов. Проверяются сообщения и getter signatures, включая поля возвращаемых структур; сгенерированные TypeScript serializers сравниваются с Tact на одинаковых fixtures побайтово. Затем выполняются Acton-тесты и самостоятельные локальные Tolk-сценарии. Публикация ABI, BoC и wrappers атомарна; offline `--check` проверяет исходники и артефакты по SHA-256. Инструкция — [tolk/README.md](../tolk/README.md).

Сериализация Tolk storage является отдельной версией и не должна загружать данные действующего Tact-контракта. Крупные состояния разделяются на ref-chain cells с явными pack/unpack; успешная компиляция сама по себе не проверяет отсутствие runtime cell overflow. Регрессии должны проверять создание, изменение и round-trip состояния, включая ненулевые словари и крайние значения.

Совпадение message cells и getter ABI не является доказательством полной экономической, gas/trace или bounce/replay-эквивалентности. Смена языка и компилятора меняет code hashes и адреса. Tolk/TypeScript wrappers с custom storage serialization требуют явных custom hooks для `fromStorage`; генерация bindings не разрешает автоматический init или deployment из dApp. В рамках этого PR используются Tolk factory/pack/unpack и локальный эмулятор.

До release требуются полное поведенческое сравнение с Tact, проверка storage/init, gas и action traces успешных и отклонённых операций, независимый аудит и отдельный согласованный план смены адресов/состояния. Никакие deploy-секреты, реальные транзакции или канонические адреса этим изменением не публикуются.

Источники: [Tolk overview](https://docs.ton.org/tolk/overview), [Acton scripting](https://ton-blockchain.github.io/acton/docs/scripting/overview), [Acton blockchain interaction](https://ton-blockchain.github.io/acton/docs/scripting/blockchain-interaction).
