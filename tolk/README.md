# Миграция QUASAR на Tolk через Acton

Здесь ведётся отдельная реализация QUASAR на Tolk. Исходники `../contracts/*.tact` сохраняются как поведенческий и wire-level эталон до завершения миграции; корневые npm/Tact build, ABI snapshots и CI пока не перенаправляются на незавершённую реализацию.

Acton — единый CLI toolchain для TON smart contracts, построенный вокруг Tolk: создание проекта, сборка, тестирование, отладка, dApp-интеграция, деплой и верификация. В этой миграции разрешены только build/test/ABI/wrapper проверки; deploy и on-chain операции запрещены согласно `AGENTS.md`.

Установка официальным инсталлятором TON/Acton:

```sh
curl -LsSf https://github.com/ton-blockchain/acton/releases/latest/download/acton-installer.sh | sh
acton --version
```

Для воспроизводимой CI-сборки проект фиксирует Acton в `Acton.toml` на версии `1.2.1`. Его кэш, стандартная библиотека и артефакты сборки находятся только внутри каталога `tolk/`, отдельно от корневого `build/`, который используется Tact. Проверки выполняются командами:

```sh
cd tolk
acton build
acton test
```

Для отдельной проверки контракта и генерации ABI/wrapper:

```sh
acton build QuasarWallet
acton wrapper QuasarWallet --output-dir build/wrappers
```

Миграция должна сохранить сериализацию TEP-74/64/89 и прочих QUASAR сообщений, порядок/ширины persistent storage, init-данные и детерминированные адреса там, где требуется совместимость, ABI/getter IDs, wallet derivation, authorization, accounting, bounce/replay protection, а также тестовые сценарии. Изменение языка и компилятора неизбежно меняет code hashes; соответствующие адреса должны быть пересчитаны и опубликованы только после отдельного человеческого release review.

Деплой, публикация адресов, создание/подписание/отправка транзакций и любые on-chain действия в этой миграции запрещены согласно `AGENTS.md`.

Официальные руководства: [Tolk overview](https://docs.ton.org/tolk/overview), [storage](https://docs.ton.org/tolk/features/contract-storage), [message handling](https://docs.ton.org/tolk/features/message-handling), [contract ABI](https://docs.ton.org/tolk/features/contract-abi), [message sending](https://docs.ton.org/tolk/features/message-sending), [Acton Welcome](https://ton-blockchain.github.io/acton/docs/welcome), [Acton installation](https://ton-blockchain.github.io/acton/docs/installation), [Acton quickstart](https://ton-blockchain.github.io/acton/docs/quickstart), [Acton.toml](https://ton-blockchain.github.io/acton/docs/acton-toml).
