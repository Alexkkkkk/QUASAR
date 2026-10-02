# QUASAR — runbook: передача владения на внешний multisig (T-08, issue #86)

Документ описывает, как передать владение `QuasarMaster` и `QuasarDeFi`
внешнему TON multisig через уже существующий двухшаговый таймлок. Это
**deployment/integration** операция: никакой новой схемы подписи внутри
`QuasarMaster` не добавляется, поэтому изменения code hash не требуется.

> Статус: runbook + документация. Реальный testnet handoff — внешняя
> операция и требует disposable testnet-кошелька и секретов вне репозитория.
> Пока она не выполнена, T-08 остаётся открытым.

## 1. Что уже есть в коде

- `QuasarMaster.ProposeOwner` → `ownerTransferAt = now() + ownerTransferDelay`
  → `AcceptOwner` (только от `pendingOwner`, после задержки).
- `QuasarDeFi.ProposePoolOwner` → `AcceptPoolOwner` / `CancelPoolOwner`.
- `QuasarAdminTimelock` — отдельный контракт с `minDelay >= 86400`, allow-list
  целей (`master`, `defi`), `QueueAdminCall` → `ExecuteAdminCall`,
  `ProposeAdmin` → `AcceptAdmin` (двухшаговая смена admin).

Ничего из этого менять не нужно: multisig просто становится `pendingOwner`.

## 2. Выбор multisig

- Использовать **поддерживаемый внешний** TON multisig-контракт/версию
  (например, стандартный TON multisig v2 / Safe). **Не писать собственную
  криптографическую реализацию** и не агрегировать подписи внутри
  `QuasarMaster`.
- Зафиксировать в issue #86: сеть (testnet), адрес и версию multisig,
  threshold (например 2-of-3) и список участников (публичные адреса).

## 3. Подготовка (без секретов в репозитории)

1. Развернуть multisig на **disposable testnet** с порогом 2-of-N.
2. Убедиться, что у `QuasarMaster` и `QuasarDeFi` достаточно TON на газ
   для `ProposeOwner` / `AcceptOwner`.
3. Проверить get-методы до начала:
   - `QuasarMaster.get_owner()`, `get_owner_transfer_at()`, `get_owner_transfer_delay()`
   - `QuasarDeFi.get_pool_owner()` (и связанные getter'ы владельца)

## 4. Handoff: QuasarMaster

1. Текущий владелец отправляет `ProposeOwner { newOwner: <multisig address> }`.
2. Проверить: `get_pending_owner() == <multisig address>`,
   `get_owner_transfer_at() > now()`.
3. Дождаться `ownerTransferDelay` (по умолчанию 48 ч). Задержку **нельзя
   сокращать** в рамках этой операции.
4. Multisig отправляет `AcceptOwner {}` — **только** с адреса multisig,
   иначе транзакция отклоняется (`Not pending owner`).
5. Проверить: `get_owner() == <multisig address>`, `get_pending_owner() == addr_none`.
6. Отрицательный тест: попытка `AcceptOwner` с адреса **одного** участника
   (не multisig) должна упасть — подтверждает, что порог нельзя обойти.

## 5. Handoff: QuasarDeFi

Повторить шаги 4.1–4.6 через `ProposePoolOwner` → `AcceptPoolOwner` на
`QuasarDeFi`, с проверкой соответствующих getter'ов владельца.

## 6. Handoff: QuasarAdminTimelock (если используется)

1. Текущий `admin` отправляет `ProposeAdmin { newAdmin: <multisig address> }`.
2. `AcceptAdmin {}` — только от `pendingAdmin` и после `adminTransferDelay`.
3. Проверить `get_admin()`, `get_pending_admin()`, `get_min_delay() >= 86400`.

## 7. Что зафиксировать в issue #86 (evidence)

- Сеть и адрес/версия multisig; threshold и список участников (публичные адреса).
- Адреса `QuasarMaster` / `QuasarDeFi` до и после handoff.
- `tx hash` транзакций `ProposeOwner` / `AcceptOwner` (и DeFi-аналогов).
- Результат отрицательного теста (одиночный участник не может `AcceptOwner`).
- Значение `get_owner_transfer_delay()` / `get_min_delay()` — подтверждение,
  что 48 ч / 24 ч не сокращены.

## 8. Границы

- Секреты, сид-фразы и приватные ключи **не коммитятся** и не публикуются.
- Независимый аудит QUASAR (issue #62) остаётся **отдельным** release-gate.
- Никаких заявлений о mainnet-готовности по итогам этого runbook.
