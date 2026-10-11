# [Security][High] TriggerBuyback не требует аутентификации — любой может форсировать байбэк

## Описание

`receive(msg: TriggerBuyback)` в `contracts/quasar.tact` не выполняет
`_requireOwner()` и не проверяет подпись. Единственные проверки —
`_requireNotPaused()`, `buybackEnabled`, `buybackPool >= buybackThreshold`,
`buybackSwapPending == 0`, кулдаун, queryId.

Это противоречит заявленному поведению: README и `docs/AUDIT_STATUS.md`
(AI fund-flow boundary) описывают байбэк как «owner-authenticated trigger».

## Влияние

- Любой адрес запускает байбэк: сжигание supply из `buybackPool` и своп
  QSR→TON через QuasarDeFi с отправкой TON в treasury.
- Прямой кражи нет (средства идут в burn/treasury), но: посторонний
  управляет монетарной политикой (тайминг сжиганий, накопление TON в
  treasury), тратит пул и кулдаун (грифинг легитимных триггеров).
- Аналогичные админ-сообщения (`CancelBuybackSwap`, `SetBuybackConfig`)
  аутентификацию имеют — асимметрия явно непреднамеренна.

## Воспроизведение

Отправить `TriggerBuyback { queryId }` на адрес мастера с любого адреса
при `buybackPool >= buybackThreshold` и истёкшем кулдауне — байбэк исполнится.

## Предлагаемый фикс

Минимальный (в пакете `quasar_h1_fix.patch`):

```tact
receive(msg: TriggerBuyback) {
    self._requireOwner();        // <-- добавить первой проверкой
    self._requireNotPaused();
    ...
}
```

Owner мастера — `QuasarAdminTimelock`, поэтому ручной триггер пройдёт через
таймлок (≥24h). Автоматический путь (байбэк из `FeeTransfer` при
переполнении пула) не затрагивается — он и есть штатный «горячий» механизм.

Альтернатива (если нужен оперативный ручной триггер без таймлока):
allow-list keeper-адресов, устанавливаемый owner'ом, проверка
`require(self.buybackKeepers.get(sender()) != null)`. Не рекомендуется как
первый шаг — расширяет поверхность привилегий.

## Тесты

`tests/audit_h1_triggerbuyback.test.ts` (в пакете):
- чужой адрес → revert с ошибкой авторизации **даже при пустом пуле**
  (порядок проверок: auth до проверок состояния);
- state diff пуст после неудачной попытки.

## Критерии приёмки

- [ ] `TriggerBuyback` от не-owner revert'ится
- [ ] Автобайбэк из `FeeTransfer` работает как раньше (регрессионный тест)
- [ ] `npm run abi:update` + `npm run hashes:build` обновлены
- [ ] README/AUDIT_STATUS boundary-описание синхронизировано с кодом
