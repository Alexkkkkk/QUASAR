# [Security][Medium-High] Нет пути возврата pendingQsrDeposits на QuasarMaster — депозиты застревают навсегда

## Описание

`receive(msg: TokenNotification)` на мастере зачисляет пользовательский депозит
в `pendingQsrDeposits` и `custodyBalance`. Потребить депозит можно только
через `Stake`, `AddVesting` или `VetoAIAction` (последний — с возвратом
через `ReleaseVeto`). **Общего refund-пути нет.**

Пользователь, отправивший QSR на мастер и не сделавший стейк/вестинг
(упавший фронтенд, ошибка в payload, забытый follow-up), теряет средства
навсегда. `get_user_liabilities` показывает депозит как liability, но
расходовать его некому.

В QuasarDeFi аналогичный refund существует (`RefundPendingQsr`) — на
мастере его забыли.

## Ключевой факт (упрощает фикс)

Bounce-проводка для refund'а **уже реализована**: обработчик `PayoutFailed`
в `quasar.tact` для `payoutKind == 5` восстанавливает и `pendingQsrDeposits`,
и `custodyBalance` — словно refund-путь был спроектирован (kind 5
зарезервирован), но входной receiver не дописан. Достаточно добавить receiver.

## Влияние

- Прямая потеря пользовательских средств (permanent lock).
- `custodyBalance` раздувается «мёртвыми» депозитами, искажая liability-вью.

## Предлагаемый фикк

`contracts/quasar_m1_refix.tact` (в пакете) — receiver `RefundPendingDeposit`:

```tact
receive(msg: RefundPendingDeposit) {
    let pending: Int? = self.pendingQsrDeposits.get(sender());
    require(pending != null && msg.amount > 0 && msg.amount <= pending!!, ...);
    self.pendingQsrDeposits.set(sender(), pending!! - msg.amount);
    self.custodyBalance -= msg.amount;
    // регистрация payout kind 5 — существующая проводка сделает остальное
    self.payoutSeq += 1;
    self.pendingMasterPayouts.set(self.payoutSeq, PendingPayout{
        user: sender(), amount: msg.amount, kind: 5, d1: 0, d2: 0, d3: 0 });
    self._sendCustodiedTokens(sender(), msg.amount, 5, self.payoutSeq);
    ...
}
```

Осознанные решения:
- Refund разрешён **и при паузе** — путь двигает средства только владельцу
  депозита (как `RefundPendingQsr` в DeFi);
- частичный refund (`amount < pending`) — позволяет отзывать остаток,
  оставив часть под будущий стейк;
- событие `EventPendingDepositRefund` для индексаторов.

## Тесты

`tests/audit_m1_deposit_refund.test.ts` (в пакете):
- депозит → refund полной суммы → балансы кошелька и ledger чисты;
- частичный refund → остаток в `pendingQsrDeposits` сохранён;
- refund сверх депозита → revert;
- refund работает при `emergencyPause == true`.

## Критерии приёмки

- [ ] Receiver добавлен, опкоды не пересекаются с ABI
- [ ] Bounce payout'а восстанавливает депозит (kind 5 проводка задействована)
- [ ] Тесты проходят; ABI/hashes обновлены
