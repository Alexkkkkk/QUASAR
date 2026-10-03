# QUASAR — TON Docs conformance matrix

Проверено на ветке main после CI commit 414e15915e1a81ab7b02b6284b04f541e8e6be6c. Матрица фиксирует только обязанности, которые принадлежат on-chain контрактам. TON Docs также описывает SDK, API, TON Connect, indexers, Pages и toolchain; они намеренно вынесены в #77 и не добавляются в Jetton/DeFi-код.

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
| TEP-64 metadata | jetton_content accepts only 0x00 on-chain/semi-chain or 0x01 off-chain URI; updates are proposed and timelocked | Unknown prefixes are rejected; metadata changes require owner + 48h confirmation | tep64_content.test.ts, security_check.ts |
| TEP-89 wallet discovery | provide_wallet_address#2c76b973 → take_wallet_address#d1735400 from both master and wallet | Caller must fund the response; wrong workchain returns addr_none; optional owner is a ref | conformance_2026_09_26.test.ts, tep89_wallet_discovery.test.ts |
| TON gas / bounce guidance | Explicit storage reserve, remaining-value response only where intended, typed bounce rollback and sender checks | Reserve/custody liabilities cannot be swept as free TON/QSR; payout bounces restore user state | security_check.ts, security/property suite |

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