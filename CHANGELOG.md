# Changelog

All notable changes to this repository are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
`MAJOR.MINOR.PATCH` versions from `package.json`.

Nothing in this file is a claim of audit, yield or production safety. See
`docs/SECURITY_AUDIT.md` and `docs/AUDIT_2026-09-29.md` for the current
verification status.

## [Unreleased]

### Added

- `tests/ton_doc_conformance_fix_2026_09_30.test.ts`: regression coverage for the 2026-09-30 documentation pass — TEP-64 off-chain content without a URI is rejected on-chain, TEP-89 answers `addr_none` for an unaddressable owner, and no zero-value send relies on base mode 0.

### Fixed

- `contracts/quasar.tact`: `ProposeContent` accepted a TEP-64 `0x01` content cell with no URI and now rejects a cell without a prefix byte as well ([TEP-64](https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md)).
- `contracts/quasar.tact`: `_workchainOf` mis-decoded every address that is not `addr_std$10`, so a `provide_wallet_address` query about an unaddressable owner returned a derived wallet address instead of `addr_none` ([TEP-89](https://github.com/ton-blockchain/TEPs/blob/master/text/0089-jetton-wallet-discovery.md)).
- `contracts/quasar.tact`: the `BurnConfirmed` leg used a zero value with base mode 0, which fails with exit code 37 and was swallowed by `SendIgnoreErrors`; it now pays its forward fee separately ([message modes](https://docs.ton.org/v3/documentation/smart-contracts/message-management/message-modes-cookbook)).

- `tests/property_invariants.test.ts`: deterministic invariant coverage for issue #63 (CPMM `k` monotonicity across a seeded swap path, LP quote/burn quote round-trips, and staking-accounting conservation).
- `scripts/build_hashes.ts`, `docs/build-hashes.json`, and the `hashes:build` script: reproducible SHA-256 publication for compiled `.code.boc` and `.abi` artifacts. CI now uploads the hash manifest as an artifact for issue #62.
- `docs/AUDIT_STATUS.md`: single-table status board for the still-open findings and their repository issue links (issue #66).

### Changed

- `README.md` and `WHITEPAPER.md` now point readers to the repository issue tracker and mark the legacy veto fields as inactive compatibility state, not an active governance feature.

### Added

- TEP-64 managed jetton metadata (issue #58): `ProposeContent`,
  `"Cancel Content"` and `"Apply Content"` receivers plus `get_pending_content`
  and `get_content_at` getters. A metadata change is two-step and only applies
  after `ownerTransferDelay` (48h), mirroring the wallet-code migration, so a
  mistake in the metadata URI is no longer permanent.
- `scripts/lib/tep64.ts`: builds and preflights TEP-64 content cells
  (`0x01 ++ uri` off-chain and `0x00 ++ dictionary` on-chain layouts) before a
  proposal is broadcast, and decodes them for review.
- `tests/tep64_content.test.ts`: on-chain round trip, timelock, owner-only and
  prefix-validation coverage.
- `docs/AUDIT_2026-09-29.md`: consolidated audit report for the #57 scope.
- `scripts/check_dapp_abi.ts` and the `abi:dapp` npm script: the dApp opcode map
  in `website/tonconnect.js` is now verified against the compiled ABI in CI
  (issue #61).

### Fixed

- TEP-89 (issue #60): the master now answers `provide_wallet_address` with
  `wallet_address = addr_none` when it cannot derive a wallet address for the
  requested owner (workchain mismatch), as the standard requires, instead of
  returning a computed address that belongs to another workchain.
- TEP-64 (issue #58): a staged content cell whose first byte is neither `0x00`
  nor `0x01` is rejected before it reaches the pending slot.
- TEP-89 (issue #60): `wallet-discovery` is accepted as a decodable TEP-64
  attribute in the off-chain helper.

### Changed

- `scripts/deploy_all.ts` builds the pool metadata cell through
  `scripts/lib/tep64.ts` instead of inline cell construction.
- `scripts/security_check.ts` asserts the metadata proposal path, the TEP-89
  workchain branch and the wallet-side discovery handler.
- `docs/abi/*.json` regenerated for the new message and getters.

### Security

- No secret, wallet material or deployment state is committed. The dApp reads
  addresses from `website/config.js`, which ships empty.

