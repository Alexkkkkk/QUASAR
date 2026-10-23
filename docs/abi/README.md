# ABI snapshots Tolk

JSON-файлы в этом каталоге — канонические snapshots публичного интерфейса,
полученные из ABI компилятора Acton/Tolk. Схема `3` фиксирует incoming messages,
32-битные opcodes, порядок и типы полей, аргументы и результаты getters и method
IDs. Раздел `types` содержит поля всех структур, достижимых из публичного
интерфейса, включая nullable результаты getters и вложенные typed cells/maps.

Изменение поля или порядка полей getter-структуры теперь обнаруживается даже
при неизменном имени структуры. `any_address` отличим от internal `address`;
ключ и значение map, а также содержимое `Cell<T>` не теряют параметры типа.
Неподдерживаемый новый вид типа отклоняется, а не принимается как неполный shape.
Наличие custom pack/unpack отражено в snapshot, но реализация ручного
сериализатора требует отдельных wire-тестов: JSON ABI не описывает его тело.

Snapshots не зависят от исторических Tact-артефактов. Успешная проверка означает
согласованность описанного публичного интерфейса текущего Tolk-проекта. Она не
доказывает совместимость storage, code hash, адресов, gas или action traces с
предыдущим Tact-поколением и не заменяет независимый аудит.

После намеренного изменения публичного ABI обновите snapshots и проверьте diff:

```sh
npm run abi:update
npm run abi:verify
npm run abi:dapp
npm run build
```

Синхронизированная сборка содержит общий `QuasarWallet.boc`, используемый Master
и DeFi. CI проверяет generated Tolk/TypeScript wrappers и вручную заданные
opcodes сайта относительно этих snapshots. Offline-регрессии snapshot codec
запускаются вместе с `npm test` или отдельно:

```sh
python3 -m unittest discover -s tests -p 'test_acton_abi.py'
```

Формат ABI и роль contract declaration описаны в
[официальной документации TON](https://docs.ton.org/tolk/features/contract-abi).
