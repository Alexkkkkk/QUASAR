# QUASAR — hardening pass 2026-09-25

Проверка контрактов `contracts/quasar.tact` (QuasarMaster + QuasarWallet) и
`contracts/quasar_defi.tact` (QuasarDeFi + копия QuasarWallet) по документации
TON, с исправлениями и тестами на каждый пункт.

Источники, по которым проводилась проверка:

- TEP-74, Jetton standard — https://github.com/ton-blockchain/TEPs/blob/master/text/0074-jettons-standard.md
  (обзор: https://docs.ton.org/v3/documentation/smart-contracts/contracts-specs/jetton-standard)
- Message modes cookbook — https://docs.ton.org/v3/documentation/smart-contracts/message-management/message-modes-cookbook
- Secure programming — https://docs.ton.org/v3/guidelines/smart-contracts/security/secure-programming
- Jetton processing — https://docs.ton.org/v3/guidelines/dapps/asset-processing/jettons

## F-21 🔴 High — кошелёк не возвращал `excesses` (несоответствие TEP-74)

**Проблема.** `QuasarWallet.receive(InternalTransfer)` зачислял баланс, но не
возвращал остаток присланного TON. По стандарту кошелёк получателя обязан
отправить все излишки на `response_destination` сообщением
`excesses#d53276db query_id:uint64`. Дополнительно рефанд излишка при burn
(`QuasarMaster.receive(BurnNotification)`) отправлялся телом-комментарием
`"Excess returned"`, поэтому интеграции не могли сопоставить рефанд с
`query_id` запроса.

**Цитата (TEP-74).** «Receiver's wallet should send all excesses of incoming
message coins to `response_destination` with the following layout: TL-B schema:
`excesses#d53276db query_id:uint64 = InternalMsgBody;`».

**Исправление.**

- Добавлено сообщение `message(0xd53276db) TokenExcesses { queryId: Int as uint64 }`.
- `QuasarWallet.receive(InternalTransfer)` отправляет `TokenExcesses` на
  `responseDestination` (`value: 0`, `SendRemainingValue | SendIgnoreErrors`,
  `bounce: false`), чтобы неудачный рефанд не откатывал уже зачисленный баланс.
- `QuasarMaster.receive(BurnNotification)` использует тот же layout вместо
  комментария.
- В `QuasarMaster`, `QuasarDeFi` и `QuasarWallet` добавлены no-op приёмники
  `TokenExcesses`: рефанд приходит и самому мастеру (все его переводы содержат
  `responseDestination = master`), и раньше это было неизвестное сообщение.

**Тесты.** `tests/hardening_2026_09_25.test.ts`:
`F-21 TEP-74: a transfer returns the unused message value to response_destination`,
`F-21 TEP-74: the master refunds a burn with the excesses layout`.

## F-22 🔴 Critical — два `SendRemainingValue` в одной транзакции рвали action phase

**Проблема.** Комиссия с включённым авто-байбэком обрабатывалась так:
`FeeTransfer` → `_executeBuyback` отправлял `EventBuybackExecuted` режимом
`SendRemainingValue`, а затем тот же обработчик отправлял `EventFeeDistributed`
тем же режимом. После первого mode-64 действия `msg_balance_remaining`
обнуляется, у второго `final_value` становится отрицательным → ошибка 37 →
action phase транзакции падает целиком. Итог: вся бухгалтерия комиссии
откатывалась, хотя кошелёк пользователя уже списал комиссию.

**Цитаты (message modes cookbook).** «`msg_balance_remaining` … it is zero if
there was the previous sending message action with modes
`SEND_MODE_CARRY_ALL_BALANCE` or `SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE`»;
«If `final_value` after step 7 is negative, then an error with 37 exit code is
thrown»; «if sending fails, the transaction is rolled back and a bounce message
is not sent» (без флага `+2`).

**Исправление.** Квитанция байбэка платится из баланса контракта:
`value: ton("0.01")`, `mode: SendPayGasSeparately | SendIgnoreErrors`,
`bounce: false`. Единственный `SendRemainingValue` остаётся за финальным
событием обработчика. Инвариант добавлен в `scripts/security_check.ts`.

**Тест.** `F-22: a fee that triggers a buyback still commits the fee accounting` —
проверяет, что ни одна транзакция дерева не падает в action phase и что
`totalFeesCollected` и `totalBuybacks` фиксируются.

## F-23 🔴 High — пустой пул наград блокировал вывод стейка

**Проблема.** `Unstake` рассчитывал награду и требовал
`stakingRewardsPool >= pending`. Начисление APY ничем не ограничено пулом,
поэтому при отсутствии комиссий награда > 0 при пуле 0 — и вся транзакция
вывода ревертилась: «Rewards pool empty». Основная сумма стейка оставалась
заблокированной навсегда, пока протокол не получит комиссии.

**Исправление.** `_calculateRewards` ограничивает начисление балансом пула:
`return accrued > self.stakingRewardsPool ? self.stakingRewardsPool : accrued;`.
APY остаётся целевой ставкой, обеспеченной пулом комиссий, а вывод принципала
больше не зависит от пула. Ограничение снимает и реверт в `Stake`
(докапитализация с невыплаченной наградой).

**Тест.** `F-23: the principal can always be withdrawn, even with an empty reward pool`.

## Остаточные замечания (не исправлены в этом PR)

- **F-24 Low.** `QuasarMaster.bounced(bounced<InternalTransfer>)` безусловно
  восстанавливает `reserveBalance`. Для mint-переводов резерв не расходовался,
  поэтому гипотетический отскок минта завысил бы резерв. Путь на практике
  недостижим (получательский кошелёк не может упасть на этом обработчике), но
  корректнее разделять минт и выплаты из резерва отдельным `queryId`-маркером.
- **F-25 Low.** При отскоке перевода комиссия 0.30% остаётся у мастера:
  кошелёк возвращает себе только `sendAmount`, а комиссия восстанавливается
  лишь если отскочило и `FeeTransfer`.
- **Заявленное отклонение от TEP-74.** Комиссия 0.30% удерживается из
  переводимой суммы (`amount - fee`), то есть получатель зачисляется меньше,
  чем указано в `transfer`. Это осознанное deflationary-поведение, раскрытое в
  README/WHITEPAPER; интеграциям следует опираться на `transfer_notification`,
  а не на равенство `amount`.
- **Ограничения передачи имущества.** `maxTxBps`/`maxWalletBps` в этом релизе не
  применяются в коде кошелька (зафиксировано в README и тестах).

## Проверка

```
npm ci
npm test        # сборка + security:check + весь набор @ton/sandbox
npx tsc --noEmit
```
