# QUASAR — рабочие заметки (WIP, 2026-09-20)

Ветка: `fix/security-audit-2026-09-20`. База: `main` @ `120656e`.

## Что уже сделано и запушено

- **F-17 🔴** — `ClaimReferralRewards` списывал из `reserveBalance` без проверки
  `_poolEncumbrance()`: реферальный клейм мог забрать резерв, обеспечивающий пулы
  buyback / lottery / staking. Добавлен guard свободного резерва
  (`require(self.reserveBalance - self._poolEncumbrance() >= pending!!, "Reserve encumbered");`).
- **F-18 🔴** — флаг `mintable` гасился владельцем, AI-аварийной паузой (severity 3)
  и сигналами `AIPriceSignal`/`AIAnomalyAlert`, но вернуть его было нечем — одна
  аварийная пауза навсегда блокировала эмиссию. Добавлено owner-only сообщение
  `receive("Resume Minting")` с запретом при `aiFullAutonomy`.
- Покрытие: `tests/audit_fixes.test.ts` (2 source-инварианта + on-chain прогон в `@ton/sandbox`).

Фактически проверено на момент коммита: `npm run build` OK, `npm run security:check`
OK (14 инвариантов), `npx tsc --noEmit` exit 0, `node --test tests/*.ts` **37/37 pass**.

## Где остановился: fee-путь, exit code 5

**Симптом.** `FeeTransfer`, отправленный мастеру от Jetton-кошелька, падает в
compute phase с `exitCode = 5` (integer out of expected range) **до** распределения
комиссий; `reserveBalance` остаётся `0`, состояние не меняется. При этом первый
вызов `mint` от того же кошелька-отправителя проходит (exit 0), т.е. дело не в
исходящем `InternalTransfer`.

**Что уже исключено / проверено:**
- Диагностика в `@ton/sandbox`: `Mint` = exit 0, `FeeTransfer` = exit 5 всегда,
  независимо от суммы и от владельца кошелька (и user-wallet, и master-wallet).
- Debug-сборка (`"debug": true` в `tact.config.json`) не дала `vmLogs`/`debugLogs`
  для транзакции мастера — трассировку получить не удалось, нужен другой подход
  (например, `@ton/tasm` эмуляция или пошаговый разбор `actionPhase`).
- Бисекция обработчика `receive(msg: FeeTransfer)` (тело ~строки 494–583
  `contracts/quasar.tact`) запускалась, но **была прервана пользователем** и
  результат не зафиксирован. Файл восстановлен из `/tmp/orig.tact`; рабочее
  дерево чистое относительно коммита, бисекция не оставила следов.

**Рабочая гипотеза (не подтверждена).** `exit=5` до распределения указывает на
одну из числовых операций над `msg.amount` / `reserveBalance` / `totalFeesCollected`.
Кандидаты-строки в теле обработчика: деление `msg.amount * self.feeBurnShare / 100`
и цепочка сплита `remaining * 15 / 100`; запись `self.totalFeesCollected + msg.amount`
и `self.reserveBalance + msg.amount`; затем `self.reserveBalance - burnAmount`.
Ни одну из них бисекция ещё не подтвердила.

**Следующий шаг (для возобновления).** Разрезать тело `FeeTransfer` по якорям и
для каждого варианта собирать контракт и запускать единственный негативный кейс
(`FeeTransfer` от кошелька мастера), фиксируя `exitCode` транзакции мастера.
Полный список якорей — в истории задачи; стартовая точка — отсечение тела после
первой строки `self.totalFeesCollected = ...`.

## Осознанно НЕ трогали (требует решения владельца проекта)

- **Случайность лотереи**: `randomInt()` (стр. ~853 `contracts/quasar.tact`) для
  денежного приза — TVM-случайность не безопасна, смещается валидатором/пользователем.
  Нужна commit-reveal схема.
- **`maxWalletBps`**: хранится и валидируется, но нигде не применяется в коде кошелька.
  `maxTxBps` работает только в `Mint`, а минтинг после деплоя остановлен.
- **Мультисиг владельца**: есть двухшаговый перевод с таймлоком 48 ч
  (`ProposeOwner` → `AcceptOwner`), мультисига нет.
- **Тестнет-деплой** и **независимый аудит** не выполнялись.

Это рабочая заметка инженера, а не отчёт аудита и не обещание безопасности.
