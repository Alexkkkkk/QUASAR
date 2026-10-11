# QUASAR security fix pack v2 — full remediation (без внешнего аудита)

Пакет закрывает ВСЕ открытые находки аудита по контрактам (блоки 0–3 плана),
внешний аудит (#62) из скоупа исключён по решению заказчика — в пакет входят
только код, тесты и документация. Всё, что меняет семантику, помечено
decision и требует подтверждения перед деплоем.

## Состав

```
contracts/
  quasar_master_fixes.tact    — H-1, M-1, M-2b, M-4, L-3, L-4, L-5
  quasar_defi_fixes.tact      — M-3, L-1, L-7
  quasar_wallet_fixes.tact    — L-2, L-3 (кошелёк), L-8 (docs)
docs/
  AUDIT_STATUS_update.md      — готовая замена трекера (F-31/F-33/F-37 + закрытие H-1..)
issues/
  ISSUE-H1-*.md, ISSUE-M1-*.md, ISSUE-M3-*.md, ISSUE-M4-*.md   — из пака v1
  ISSUE-M2b-governance-binding.md, ISSUE-low-batch.md          — новые
tests/
  audit_master_fixes.test.ts  — H-1, M-1, M-2b, M-4
  audit_defi_fixes.test.ts    — M-3, L-1, L-7
  audit_wallet_fixes.test.ts  — L-2, L-3
```

## Порядок применения

1. Прочитать каждый файл контрактов: блоки помечены `FIX H-1`, `FIX M-2b` и т.д.
2. Применить в порядке: master → defi → wallet (wallet зависит от решения L-2).
3. `npm run abi:update && npm run hashes:build` — адреса изменятся (ожидаемо).
4. Тесты: подключить TODO-хелперы из вашего набора, `npm test`.
5. Заменить `docs/AUDIT_STATUS.md` содержимым `docs/AUDIT_STATUS_update.md`.
6. PR — строго human review (конституция: contracts/** защищён).

## Решения (decisions), зафиксированные в пакете

- **M-4a:** пауза НЕ глушит `FeeTransfer` целиком (сломает все переводы —
  кошельки ждут TransferConfirmed), но глушит исходящие ноги: treasury-платёж
  и автобайбэк. Burn-нога продолжает работать.
- **M-4b:** при паузе разрешены `Unstake` (принципал + начисленное) и
  `ClaimVested` — зеркалит `RemoveLiquidity` в DeFi. `Stake`/`ClaimRewards`/
  `ClaimReferralRewards` остаются заблокированы.
- **M-4c:** `ToggleTrading` переименован в `ToggleMinting`, опкод прежний
  (интеграции не ломаются) — название теперь отражает, что гейтит только Mint.
- **M-2b:** вес голоса привязан к `(proposalId, kind, flag, feeBps)` —
  голос за чужие параметры попадает в другую корзину и не может исполнить
  неподписанное действие.
- **L-5:** bounce restore наград стейкинга больше не перематывает `lastClaim`
  на прошлое (устранена дорисовка начислений на топ-ап).

## Исключено

- Внешний аудит (#62 / A-62.1), канонические адреса (A-62.3) — вне скоупа.
- F-37 (single AI key) — отдельная задача по их трекеру, сознательно не трогаем.
