# Tact → Tolk migration parity record (archived baseline)

Дата baseline: 2026-10-23. Исторический source baseline — parent commit `ef1f1ed7deaa4b95603a8114f775d615ded001bb` (непосредственно перед Tolk cutover в `4afa5434105f42237915f8db61469ff0f1ba45ec`). Старые ABI собраны из этого checkout официальным `@tact-lang/compiler 1.6.13`; исходники Tact не участвуют в активной сборке. Baseline snapshots находятся в `docs/historical/tact-reference/abi/`.

## Проверенное машинно

Запуск `python3 scripts/check_migration_parity.py` сопоставляет compiler ABI Tact с актуальными Acton/Tolk ABI snapshots и входит в Python test suite/`npm test`:

| Контракт | Tact typed internal receivers | Tolk messages | Tact getters | Tolk getters |
|---|---:|---:|---:|---:|
| Master | 55 | 55 | 43 | 43 |
| DeFi | 21 | 21 | 27 | 27 |
| Wallet | 8 | 8 | 1 | 1 |
| Admin timelock | 7 | 7 | 8 | 8 |

Проверяются имена сообщений без учёта регистра, все opcodes, порядок/имена/типы/optional-поля каждого сообщения, getter names/IDs/arguments/return types, все общие numeric constants и точные UTF-8 payload bytes всех legacy text receivers. Текущий результат: **нет потерянных/лишних typed receivers, opcode mismatches, getter ID mismatches, необъяснённых field mismatches или изменённых общих numeric constants**; проверены 15 constants и 13 text payloads.

### Явные ABI-отличия

- Пять полей ответа (`responseDestination` у Master `BurnNotification`, а также Wallet `TokenTransfer`, `TokenBurn`, `InternalTransfer`, `PoolPayout`) в Tolk принимают nullable address/`addr_none`. Tact-версия принимала только internal address. Для обычного внутреннего адреса поле остаётся в том же `MsgAddress` wire формате; Tolk расширяет вход для стандартного none-сценария. Gate держит этот список allowlisted; любое новое расширение провалит проверку.
- Tolk нормализует регистр имён AI/TON messages и использует явные `coins`, fixed-width integer и `bits512` типы. ABI verifier сопоставляет их с соответствующими Tact wire widths.
- `get_ai_oracle_key` в прежнем ABI возвращал TVM `Int`, новый ABI документирует домен как `uint256`; getter ID и стековое значение сохраняются. Это единственное явно допущенное уточнение signedness в getter API.
- Tolk документирует два исторических Tact `Int` wire-поля (`AIGovernanceProposal.newValue`, `AIPriceSignal.sentiment`) как signed fixed-width types; ширина остаётся ровно 257/8 бит и payload сохраняет bit-exact encoding.
- Одиннадцать прежних text receivers Master и два DeFi text receivers сохранены как legacy text dispatch; `Apply Wallet Code` по-прежнему намеренно отвергается в обеих реализациях, так как атомарное обновление wallet code не поддержано.

## Параметры и состояние

Числовые protocol constants, которые можно прямо сравнить по исходникам, совпадают: 0.05 TON rent reserve, supply cap `1e18` nanotokens, wallet fee 30 bps, tx/wallet caps 100/300 bps и их derived limits, 5-second transfer cooldown, mint/payout markers, high-bit query namespace, buyback callback timeout 3600s, AI price/anomaly caps 2048/1024 и AI signature domain `0x51a5c3d2`. Тест `wallet policy` дополнительно проверяет cap/cooldown runtime behavior.

Storage намеренно **не является upgrade-compatible**. Tolk использует отдельные versioned layouts; существующие Tact Master/DeFi/Admin state cells, StateInit, code hashes и адреса нельзя считать принимаемыми новыми контрактами. Это fresh-deployment boundary, а не доказательство data/state migration. Никакие адреса, ключи или активы этим переключением не переносились.

## Граница отчёта после полного Tolk cutover

ABI parity подтверждает интерфейс, но не равенство каждой ветки выполнения. Этот
файл теперь используется только как проверяемый compatibility gate между
историческим Tact ABI и каноническим Tolk ABI; Tact не является compiler или
source input. Поведенческие, storage-migration, testnet и независимые security
проверки остаются отдельными release gates:

1. **Master:** burn/fee accounting; staking/referral/vesting; governance replay/quorum; buyback/DeFi payout bounce; AI signature success/bad-signature/replay/expiry; veto/override; owner/content/config timelocks; reserve/custody accounting.
2. **DeFi:** QSR payout failure/excess sequencing; TON payout bounce при liquidity removal и swap; возврат pending deposit; farm funding/claim/emergency withdrawal; delayed fee/max-trade changes; quote rounding и event/getter result checks.
3. **Wallet:** `PoolPayout` success and query-ID collision; `FeeTransfer` bounce; TEP-89 wallet reply thresholds/include-address path; заполненные persistent dictionaries/layout round-trip.
4. **Admin:** pending call boundary timestamps/overflow semantics and all getter states across propose/cancel/execute; persisted Tolk storage round-trip.

Это перечисление — backlog проверки, а не утверждение, что перечисленные реализации неверны. Перед любым реальным deploy нужны differential execution traces (success/reject/bounce), заполненные storage-dictionary fixtures, состояние/активов migration plan, testnet rehearsal и независимый security audit. См. также `docs/TOLK_MIGRATION_DECISION.md`.
