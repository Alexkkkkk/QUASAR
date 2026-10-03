# QUASAR — TON Docs conformance matrix

Базовая матрица зафиксирована на `main` после CI commit 414e15915e1a81ab7b02b6284b04f541e8e6be6c; исправления audit v3.0 ниже выполняются отдельно в `ai/35-ton-audit-fixes`. Матрица фиксирует только обязанности, которые принадлежат on-chain контрактам. TON Docs также описывает SDK, API, TON Connect, indexers, Pages и toolchain; они намеренно вынесены в #77 и не добавляются в Jetton/DeFi-код.

## Sources

- [Jetton standard / TEP-74](https://docs.ton.org/contracts/standard/tokens/jettons/overview)
- [Jetton transfers](https://docs.ton.org/contracts/standard/tokens/jettons/transfer)
- [Token metadata / TEP-64](https://docs.ton.org/contracts/standard/tokens/metadata)
- [Jetton wallet discovery / TEP-89](https://docs.ton.org/contracts/standard/tokens/jettons/get-jetton-wallet)
- [TON security best practices](https://docs.ton.org/contract-dev/techniques/security)
- [Tact](https://docs.ton.org/blockchain-basics/languages/tact) — currently marked deprecated by TON Docs; Tolk migration is tracked separately.

## On-chain conformance

| Standard / requirement | Wire-level implementation | Auth / failure behaviour | Verification |
| --- | --- | --- | --- |
| TEP-74 transfer | TokenTransfer#0f8a7ea5 → InternalTransfer#178d4519 in contracts/quasar_common.tact | Only wallet owner can initiate; query ids are single-use; failed recipient credit is bounced and restored | conformance_2026_09_26.test.ts, security_regression.test.ts |
| TEP-74 notification | TokenNotification#7362d09c with forward_ton_amount and payload | Receiver is the derived wallet address for the configured master; deposits are accounted only after authenticated notification | conformance_2026_09_26.test.ts |
| TEP-74 burn | TokenBurn#595f07bc → BurnNotification#7bdd97de | Master accepts only the derived wallet; supply decreases only after the authenticated notification | conformance_2026_09_26.test.ts |
| TEP-74 excesses | TokenExcesses#d53276db | Response destination and derived-wallet checks prevent arbitrary cleanup; unmatched excesses are harmless | conformance_2026_09_26.test.ts |
| TEP-74 getters | get_jetton_data, get_wallet_data, get_wallet_address | Return order is kept explicit in the generated ABI | conformance_2026_09_26.test.ts, ABI checks |
| TEP-74 pool payout / excesses | PoolPayout#51a5c3d1 carries an explicit response destination; DeFi sends `TokenExcesses` to itself and master payouts route to the master wallet | DeFi authenticates the beneficiary's derived wallet; RemoveLiquidity sends QSR first and dispatches TON only after the same query ID is confirmed | core_functions.test.ts, audit_h02_m01_l01.test.ts |
| TEP-64 metadata | jetton_content accepts only 0x00 on-chain/semi-chain or 0x01 off-chain URI; updates are proposed and timelocked | Unknown prefixes are rejected; metadata changes require owner + 48h confirmation | tep64_content.test.ts, security_check.ts |
| TEP-89 wallet discovery | provide_wallet_address#2c76b973 → take_wallet_address#d1735400 from both master and wallet | Caller must fund the response; wrong workchain returns addr_none; optional owner is a ref | conformance_2026_09_26.test.ts, tep89_wallet_discovery.test.ts |
| TON gas / bounce guidance | Explicit storage reserve, typed bounce rollback, and callback fee tolerance for the buyback TON return | SwapToTON restores its QSR entitlement on TON bounce; a failed QSR payout fully reopens LP, while a TON bounce after QSR success restores TON only; bounced body reads remain within the 224-bit prefix | core_functions.test.ts, security_regression.test.ts, audit_h02_m01_l01.test.ts |

## Audit v3.0 contract fixes (2026-10-02)

The buyback return accepts the documented 0.02 TON inbound-fee variance and
uses bounce handling so a refused callback restores the DeFi TON reserve and
fee accumulator. The positive sandbox path exercises FeeTransfer → DeFi AMM →
master callback; a separate test exercises master refusal.

RemoveLiquidity payouts share one query ID and settle sequentially: the QSR
wallet's authenticated TEP-74 `excesses` confirms delivery before TON is sent.
This removes the race between independent legs. If QSR fails, TON was not sent
and the position is fully restored; if QSR succeeds but TON bounces, only the
TON reserve is restored because the QSR and LP burn are already final. No normal
TON success callback exists, so the pending record remains as a bounce
tombstone; no trailing bounce-body fields are read.

This release deliberately retains successful `pendingTonPayouts` tombstones
indefinitely: there is no safe recipient confirmation or expiry signal that
proves a late bounce is impossible. There is no per-payout storage charge or
compensation path; the contract owner must keep the contract funded for storage.
The storage reserve enforced by `SweepTON` is a minimum balance floor, not a
replenishment mechanism. Do not prune tombstones by age alone; any future
compaction must preserve replay protection and account for late bounces.

The same change restores the consumed QSR deposit when SwapToTON bounces,
corrects the initial LP estimate to exclude permanently locked liquidity, and
keeps emergency-pause governance votes' trading flag and fee snapshot
consistent. See `docs/TASKS.md` T-20 and the sandbox tests listed above.

## Off-chain verification implemented separately

`scripts/lib/ton_api.ts` provides a read-only Toncenter v2 adapter. It derives
Jetton wallets through the allowlisted master `get_wallet_address` getter and
then verifies both the owner and master returned by `get_wallet_data` before a
balance is trusted. `getTransactionsPage` and `iterateTransactions` expose
cursor-based pagination without putting API responsibilities into the
contract. `scripts/check_deployment.ts` validates the generated public artifact
and rejects deployer details; `scripts/check_tonconnect.ts` is the post-Pages
live smoke.

## Off-chain conformance fix (2026-10-02, #77)

TEP-64 off-chain content is a URI to a JSON document, so the hosting origin must
serve it as `application/json`. GitHub's `raw.githubusercontent.com` serves every
file as `text/plain`; the metadata URL and the `image` attribute therefore now
point at the GitHub Pages origin (`application/json` and `image/png`), and the
deploy preflight rejects a metadata URL whose content type is not JSON. This is
an off-chain hosting fix and does not change any contract or code hash.

## Explicitly out of contract scope

These are not missing Jetton features and must not be encoded into QuasarMaster or QuasarWallet:

- TON Connect manifest and wallet UX.
- API v2/v3, indexer reads, pagination and off-chain price adapters.
- GitHub Pages deployment discovery and deployment.json generation.
- Blueprint/SDK integration, reproducible deployment orchestration and testnet smoke operations.
- Tolk migration, multisig signature aggregation and independent third-party audit.
- NFT/SBT contracts: they require separate ownership, metadata and lifecycle specifications.

Tracking: [#74](https://github.com/Alexkkkkk/QUASAR/issues/74), [#77](https://github.com/Alexkkkkk/QUASAR/issues/77), [#62](https://github.com/Alexkkkkk/QUASAR/issues/62).

## Release boundary

This matrix is a source/test conformance record, not an audit or deployment proof. Testnet/mainnet addresses, build hashes, live Pages checks and an independent audit remain release-gate evidence and are not claimed by this document.