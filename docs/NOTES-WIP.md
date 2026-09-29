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

## Закрыто: fee-путь и старое наблюдение `exit code 5`

Старое наблюдение больше не воспроизводится на текущем `main`. Текущий
регрессионный сценарий F-22 отправляет `FeeTransfer`, который запускает buyback,
и подтверждает commit accounting без отката fee state.

**Evidence:** `tests/hardening_2026_09_25.test.ts` (`F-22`), full suite
`109/109 pass`, `npm run security:check`.

## Осознанно НЕ трогали (требует решения владельца проекта)

- **Случайность лотереи**: `randomInt()` (стр. ~853 `contracts/quasar.tact`) для
  денежного приза — TVM-случайность не безопасна, смещается валидатором/пользователем.
  Нужна commit-reveal схема.
- **`maxWalletBps`**: закрыто в T-06. Лимиты кошелька используют общие
  compile-time constants; Master/AI отклоняют значения, отличающиеся от
  скомпилированной политики. Изменение требует двухшаговой миграции wallet
  code с таймлоком 48 часов, а существующие кошельки не обновляются задним
  числом.
- **Мультисиг владельца**: есть двухшаговый перевод с таймлоком 48 ч
  (`ProposeOwner` → `AcceptOwner`), мультисига нет.
- **Тестнет-деплой** и **независимый аудит** не выполнялись.

Это рабочая заметка инженера, а не отчёт аудита и не обещание безопасности.
