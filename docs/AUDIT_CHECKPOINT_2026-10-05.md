# QUASAR — контрольная точка аудита (2026-10-05)

**Статус:** черновая контрольная точка. Зафиксировано только то, что подтверждено
GitHub API и локальным клоном на коммите `8615d7f6`. Полный аудит кода и сверка
контрактов с docs.ton.org **не завершены** — см. раздел 7.

---

## 1. Объект и доступ

- Репозиторий: [`Alexkkkkk/QUASAR`](https://github.com/Alexkkkkk/QUASAR)
- Видимость: **public**, лицензия **MIT**, основной язык — **Tact**
- Описание: «Pre-launch TON Jetton and DeFi engineering project with explicit on-chain risk boundaries.»
- Доступ подтверждён под аккаунтом `Alexkkkkk` (`GET /user` → 200)

## 2. Состояние веток (подтверждено `git ls-remote` / API)

| Ветка | SHA | Примечание |
|---|---|---|
| `main` | `8615d7f6` | HEAD, «Ai/107 agent coordination (#109)», 2026-10-03 21:14 +0300 |
| `ai/ollama-dev-cycle-20261004` | `8615d7f6` | совпадает с `main` |
| `ai/35-ton-audit-fixes` | `a055c1d9` | голова PR **#102** |
| `ai/110-ton-docs-audit-sync` | `4d2633ed` | голова PR **#111** |

## 3. Открытые pull request'ы

| # | Draft | Заголовок | Head |
|---|---|---|---|
| **102** | **да** | `fix(audit): address QUASAR v3.0 TON/Tact findings` | `ai/35-ton-audit-fixes` |
| **111** | **да** | `fix(ton): TEP-74 master getters + build-hash re-sync (docs.ton.org audit)` | `ai/110-ton-docs-audit-sync` |

Оба PR не смержены и остаются в статусе draft.

## 4. CI (последние прогоны)

| Workflow | Ветка | Итог | Время |
|---|---|---|---|
| QUASAR CI | `ai/110-ton-docs-audit-sync` | success | 2026-10-04T10:09:25Z |
| PR #111 | `refs/pull/111/head` | success | 2026-10-04T10:09:23Z |
| Autopilot issue closer | `ai/107-agent-coordination` | success | 2026-10-03T18:14:41Z |
| QUASAR CI | `main` | success | 2026-10-03T18:14:40Z |
| Push on main | `main` | success | 2026-10-03T18:14:40Z |
| QUASAR CI | `feat/ollama-ton-docs-sync` | **failure** | 2026-10-03T18:12:33Z |

## 5. Защита ветки `main` (сырой ответ API)

```json
{"required_pull_request_reviews":{"url":"https://api.github.com/repos/Alexkkkkk/QUASAR/branches/main/protection/required_pull_request_reviews","dismiss_stale_reviews":false,"require_code_owner_reviews":false,"require_last_push_approval":false,"required_approving_review_count":0},"required_status_checks":{"url":"https://api.github.com/repos/Alexkkkkk/QUASAR/branches/main/protection/required_status_checks","strict":true,"contexts":["validate"],"contexts_url":"https://api.github.com/repos/Alexkkkkk/QUASAR/branches/main/protection/required_status_checks/contexts","checks":[{"context":"validate","app_id":15368}]},"enforce_admins":{"url":"https://api.github.com/repos/Alexkkkkk/QUASAR/branches/main/protection/enforce_admins","enabled":false},"required_conversation_resolution":{"enabled":true},"allow_force_pushes":{"enabled":false},"allow_deletions":{"enabled":false},"block_creations":{"enabled":false}}
```

## 6. Подтверждённое соответствие стандартам TON (docs.ton.org / TEP)

**TEP-74 — Jettons (опкоды, сверено с текстом стандарта):**

| Сообщение | Опкод |
|---|---|
| `transfer` | `0xf8a7ea5` |
| `internal_transfer` | `0x178d4519` |
| `transfer_notification` | `0x7362d09c` |
| `excesses` | `0xd53276db` |
| `burn` | `0x595f07bc` |
| `burn_notification` | `0x7bdd97de` |

Обязательные get-методы: мастер — `get_jetton_data()` → `(int total_supply, int mintable, slice admin_address, cell jetton_content, cell jetton_wallet_code)`, `get_wallet_address(slice owner_address)`; кошелёк — `get_wallet_data()` → `(int balance, slice owner, slice jetton, cell jetton_wallet_code)`.

**TEP-89 — Discoverable Jettons Wallets:**

- `provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool`
- `take_wallet_address#d1735400 query_id:uint64 wallet_address:MsgAddress owner_address:(Maybe ^MsgAddress)`
- Ответ отправляется **режимом 64**; требуется не менее ≈0.0061 TON на входящем сообщении, иначе — throw.

**TEP-64 — Token Data Standard:**

- off-chain: первый байт `0x01` + URI (ASCII, snake-формат)
- on-chain: первый байт `0x00` + словарь `HashmapE 256 ^ContentData`
- semi-chain: `0x00` + обязательно ключ `uri`

**Режимы отправки сообщений (message-modes-cookbook):** базовые `0`, `64` (carry all remaining message value), `128` (carry all balance, с осторожностью), `1024` (только оценка); флаги `+1` (платить комиссию отдельно), `+2` (игнорировать ошибки, без bounce), `+16` (bounce on action fail), `+32` (destroy).

## 7. НЕ подтверждено / открытые пункты

1. Полная построчная сверка `contracts/quasar.tact`, `quasar_defi.tact`, `quasar_common.tact` с TEP-74/64/89 — **не выполнена**.
2. Находки **F-33…F-38** в `main` **не закрыты** — они живут в PR #102 (draft).
3. Внешний аудит, публикация build hash и адресов (issue **#62**) — **не выполнено**.
4. Сборка и тесты (`npm ci`, `tact --config`, `npm test`) в этой сессии **прерваны** и не доведены до результата — статус CI берётся из последних прогонов GitHub Actions (см. §4).
5. Заявления о «0 required approvals» — см. фактический JSON в §5.

## 8. Безопасность

- ⚠️ Personal Access Token был передан в открытом чате. Его необходимо **отозвать и перевыпустить** на https://github.com/settings/tokens — считать скомпрометированным.
- В этом файле секреты отсутствуют.

---

### Приложение A. Тело issue #62
## Контекст
`WHITEPAPER.md` (раздел 13) и `docs/MAINNET_READINESS_CHECKLIST.md` прямо
указывают, что проект pre-testnet и требует: независимого аудита Tact-контрактов,
unit/integration/property-тестов, ревизии прав owner и AI Oracle, ревизии
coin-арифметики и округлений, ревизии bounce/reentrancy, подтверждённого
supply cap и опубликованных адресов + build hash.

## Что сделать
1. Провести независимый аудит и опубликовать отчёт в `docs/`.
2. Опубликовать build hash (`*.code.boc`) и адреса master / DeFi / timelock
   для testnet и mainnet.
3. Добавить в CI шаг, публикующий хеши артефактов сборки.
4. Проверить арифметику `feeBps` / `burnShare` / `defiFeeShareBps` на переполнение
   и округление в пользу пула (инвариант `k` не убывает).
5. Проверить, что единственный путь траты средств без owner-ключа —
   `OwnerOverride` в окне `ownerOverrideWindow`, и что `aiFullAutonomy`
   не открывает неограниченный минт.

Основание: `WHITEPAPER.md` §13, `docs/SECURITY_AUDIT.md`, `docs/MAINNET_READINESS_CHECKLIST.md`.


### Приложение B. Тело PR #102
## Scope
Исправления ограничены переданной спецификацией аудита QUASAR v3.0; более широкий v4.0 roadmap в этот PR не включён. В репозитории отсутствует `quasar_audit/AUDIT_REPORT.md`, поэтому объём работ основан на приложенной спецификации.

## Изменения
- Buyback: допускается inbound fee tolerance 0.02 TON; callback bounceable, при отказе восстанавливаются TON reserve и fee accumulator. Проверены отказ и успешный fee-funded callback.
- RemoveLiquidity: QSR leg подтверждается аутентифицированным TEP-74 `TokenExcesses` до отправки TON. Общий payout ID устраняет гонку: при QSR failure позиция полностью восстанавливается; при TON bounce после подтверждённого QSR возвращается только TON, а QSR/LP settlement остаётся финальным.
- SwapToTON bounce возвращает TON reserve и право на QSR-депозит; initial LP quote вычитает заблокированную ликвидность; governance kind 3 синхронизирует `tradingEnabled` и emergency pause, сохраняя fee snapshot.
- Обновлены ABI и build-hash snapshots.

## Проверки (Node 22.22.0)
- `npm ci` — успешно, 0 vulnerabilities.
- `npm run build`, `npm run lint`, `npm run security:check` — успешно.
- `npm test` — 182 passed, 0 failed.
- `npx tsc --noEmit`, `npm run abi:verify`, `npm run abi:dapp` — успешно.
- `npm run abi:update`, `npm run hashes:build`, `git diff --check` — успешно.

## References
- [TEP-74 transfer/excesses](https://docs.ton.org/contracts/standard/tokens/jettons/transfer)
- [TON security guidance](https://docs.ton.org/contract-dev/techniques/security)
- [#62 — independent audit and pre-mainnet release gate](https://github.com/Alexkkkkk/QUASAR/issues/62) — остаётся открытым; этот PR его не закрывает.

## Release warning
Изменение contract storage/layout меняет code hashes и производные адреса; существующие адреса нельзя переиспользовать. Human security review обязателен. Не выполнялись testnet/mainnet deployment или smoke; этот PR не является независимым аудитом и не подтверждает mainnet readiness.

### Приложение C. Тело PR #111
Audit of 2026-10-04 against docs.ton.org / TEP-74 / TEP-89 / TEP-64.

- Adds the TEP-74 master get-methods `get_jetton_data` and `get_wallet_address`, plus `get_pending_qsr_deposit`, so the dApp reads in website/tonconnect.js (lines 204, 252, 377) resolve against the master.
- Re-syncs docs/build-hashes.json, which had drifted from the committed state.

Wire formats were verified against TEP-74 (opcodes 0xf8a7ea5 / 0x178d4519 / 0x7362d09c / 0x595f07bc / 0x7bdd97de / 0xd53276db), TEP-89 (0x2c76b973 / 0xd1735400 with owner_address:(Maybe ^MsgAddress) and mode 64) and TEP-64 (0x01 / 0x00 layouts). Message modes follow the send-modes cookbook.

### Приложение D. Ревью PR #102 / #111
PR #102:
- Alexkkkkk: COMMENTED @2026-10-02T16:54:22Z
- Alexkkkkk: COMMENTED @2026-10-03T16:12:20Z
PR #111:
