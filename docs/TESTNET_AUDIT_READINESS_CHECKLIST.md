# QUASAR testnet & audit readiness checklist

This is the gate checklist **before deploying to testnet** and **before
commissioning the independent audit**. It is not a claim that QUASAR is
audited or production-safe. Every unchecked item blocks the next stage.

Scope source: [ТЗ v4.0 — issue #35](https://github.com/Alexkkkkk/QUASAR/issues/35).
Status baseline: `main` @ `43e5ff3` (2026-09-28), CI `validate` green,
full local suite 87/87.

Companion documents:

- `docs/TESTNET_SMOKE_RUNBOOK.md` — how to run the operational smoke flow.
- `docs/MAINNET_READINESS_CHECKLIST.md` — the later mainnet release gate.
- `docs/SECURITY_TECHNICAL_SPECIFICATION.md`, `docs/SECURITY_AUDIT.md` —
  security model and finding history.

## 1. Wave 0 — baseline and reconciliation

- [x] Stale PR content (#34, #37) selectively rebased onto current `main` and
      merged through reviewed PRs (#40, #41, #42) instead of merging stale
      branches with conflicts.
- [x] TEP-74 excess/refund semantics preserved: no pending-state removal
      without a refund path.
- [x] CI is green on the current reconciled `main`.
- [x] Single source of truth for the two `QuasarWallet` copies
      is live through `contracts/quasar_common.tact`, imported by both
      `quasar.tact` and `quasar_defi.tact`.
- [x] README, security specification and companion checklists re-verified
      against the current pre-testnet commit (docs describe actual behavior).

## 2. Monetary invariants and payout lifecycle (P0.1/P0.2)

- [x] `PoolPayout` lifecycle: pending, success, bounced, insufficient-gas and
      failed callback with exactly-once reserve restoration
      (`PayoutFailed`, reason-coded, consume-once).
- [x] `QuasarDeFi` restores `qsrReserve` / `farmRewardReserve` / pending
      deposit on failed payouts.
- [x] Master keeps `custodyBalance` consistent on bounced/failed vesting,
      unstake and referral payouts.
- [x] A failed token leg does not retain the fee; excesses go through the
      internal response proxy with pending-state cleanup
      (`TransferConfirmed` / `BurnConfirmed`).
- [x] User query ids and internal operation ids are separated; a duplicate
      user query id cannot break cleanup or enable replay.
- [x] Mint bounce rolls back supply (regression covered).
- [x] Hard supply cap is enforced on every mint path; AI/oracle/admin paths
      cannot bypass it.

## 3. Reserves and liabilities (P0.3)

- [x] Reserve encumbrance covers buyback pool + staking pool + aggregate
      referral liabilities (`_poolEncumbrance`).
- [x] `SweepTON` cannot touch LP-backed TON or any liability reserve.
- [x] Buyback failure lifecycle: swap-leg size capped by `maxTradeBps`,
      bounced legs return the amount to the pool, replay-protected query ids.
- [ ] Production-grade getter set for reserves and liabilities (user
      principal, reward reserve, referral liabilities, staking reserve,
      DeFi reserves, LP reserve, free reserve) documented as one stable
      getter surface for indexers.
- [ ] Legacy `DefiPayout` path: remove it, or bind it to a concrete
      obligation with its own replay/recovery model (currently unused by any
      sender; decision must be recorded before testnet).

## 4. Anti-whale semantics (P0.4)

- [x] Transfer limits are Master state (`maxTxBps=100`, `maxWalletBps=300`,
      cooldown `5s`), applied to user transfer/receive paths, with explicit
      protocol exemptions for master-owned settlement.
- [x] `SetFeeConfig` / `AISetAntiWhale` only accept the implemented values —
      no undocumented divergence between config and behavior.
- [x] Limits are revertible through `OwnerOverride` within the override
      window.
- [ ] Boundary test matrix: ordinary user, DEX/pool wallet, protocol wallet,
      mint path, boundary amounts (0, 1, exactly at limit, limit+1).
- [ ] README documents the final anti-whale specification (values,
      exemptions, override semantics).

## 5. Admin model and emergency regimes (P1)

- [x] Two-step owner transfer with a 48h timelock (Master and DeFi).
- [x] Wallet-code migration: two-step + timelock, mirrors ownership.
- [x] Fee-config timelock: staged `SetFeeConfig` → time-delayed confirm.
- [x] External multisig admin via `QuasarAdminTimelock` (≥24h delay, target
      allow-list, replay protection, cancellation path).
- [x] Emergency pause is instant; withdrawals/refunds/claims keep liveness
      during pause.
- [x] On-chain governance is gated: stake-weighted voting, quorum
      (`govQuorumBps`), proposal expiry; execution flows through the
      reversible AI action log.
- [ ] Granular pause: separate switches (or a documented single-pause
      decision) for swap, liquidity, farm, buyback, transfer fee and AI.
- [ ] Role separation documented and enforced: protocol admin, emergency
      guardian, treasury, oracle/operator.
- [ ] Audit-trail event coverage enumerated for every config
      proposal/apply/cancel/expire (not only AI actions and governance).

## 6. Jetton compatibility (P1)

- [x] TEP-74 transfer/burn/excesses on both contract files; TEP-89 wallet
      discovery (`provide_wallet_address` / `take_wallet_address`).
- [x] Bounce handlers for `InternalTransfer`, `FeeTransfer`,
      `BurnNotification` and pool payouts.
- [ ] Master/Wallet compared against the current TON Jetton 2.0 reference
      with recorded deltas.
- [ ] Dynamic gas budgeting vs hardcoded TON amounts: decision recorded.
- [ ] Tact vs Tolk/Acton decision recorded before the final testnet; if
      migration is chosen, a versioned master/wallet with verified code
      hashes and addresses is required.
- [ ] Event schema, query-id schema, wallet discovery and indexer
      expectations documented.

## 7. Testing and quality gates

- [x] `npm ci` with the committed lockfile; `npm run lint`; `npm test`
      (build + security check + full suite) green on the baseline commit.
- [x] Regression suites for audit findings F-01…F-26 (`audit_fixes`,
      `security_regression`, `conformance_2026_09_26`, `hardening_2026_09_25`,
      `mint_bounce_regression`, `v5_governance`).
- [x] Deterministic AMM property test (fixed seed, alternating directions,
      fee-adjusted constant-product invariant).
- [x] Static invariant check (`npm run security:check`) wired into `npm test`.
- [ ] Property/invariant tests: actual jetton balance ≥ total encumbrances;
      one QSR never spent twice; supply/liability cross-checks on every
      transfer path.
- [ ] Fuzz tests: amounts, rounding, zero/maximum values, query ids,
      timestamps, addresses.
- [ ] Mutation tests: authorization, bounce handlers, fee paths, reserve
      decrements, pause branches.
- [ ] Gas snapshots: transfer, burn, swap, liquidity, claim, payout, admin
      timelock.
- [ ] Testnet smoke CI job: the current PAT lacks the `workflow` scope, so
      the Actions workflow must be added by an authorized token or via repo
      settings.

## 8. Pre-deployment checklist (before testnet)

- [ ] Disposable deployer and owner wallets funded on testnet; no mainnet
      keys on testnet machines.
- [ ] `JETTON_METADATA_URL` reachable and TEP-64 valid (deploy preflight
      passes; content cell is immutable after deployment).
- [ ] `tonconnect-manifest.json` served from the deployment origin.
- [ ] Deployment recorded in `build/deployment.json` (addresses, tx hashes).
- [ ] `QuasarAdminTimelock` deployment plan: multisig signer policy, chosen
      `minDelay` (≥24h), initial admin, managed-target list.
- [ ] Monitoring ready: indexer watching `EventPayoutFailed`, buyback and
      governance events, and bounced messages on the deployed addresses.

## 9. Testnet acceptance

- [ ] `npm run testnet:smoke` passes against the recorded deployment.
- [ ] Manual disposable-wallet flow completed per
      `docs/TESTNET_SMOKE_RUNBOOK.md`: wallet discovery, excesses, bounce,
      buyback success/failure, pool refund, farm claim, unstake, vesting,
      owner rotation.
- [ ] Soak period (≥48h): no stuck pending states, no drift between on-chain
      jetton balances and contract accounting.
- [ ] Findings triaged; fixes merged with green CI; deployed code identical
      to the final reviewed commit.

## 10. Independent audit gate

- [ ] Audit scope frozen: final commit hash recorded; no contract, binding,
      deployment-script or tokenomics change during the audit.
- [ ] Qualified independent TON/Tact auditor engaged (not the dev team).
- [ ] Audit scope includes: monetary invariants, bounce paths, authorization
      matrix, admin timelock, governance quorum, TEP-74/TEP-89 conformance.
- [ ] All critical/high findings fixed and re-reviewed before any
      testnet→mainnet promotion.
- [ ] Audit report stored in `docs/` with the audited commit hash reference.

## 11. Forbidden claims until the gates close

Per ТЗ #35, until the corresponding implementation and verification are in
`main`, the project must not claim: "audited", "mainnet-ready", guaranteed
APY, full multisig governance, or enforced wallet limits.

## Status map (ТЗ #35 → evidence)

| ТЗ #35 item | Status | Evidence |
| --- | --- | --- |
| Wave 0: PR #34/#37 reconciliation | Done | #40, #41, #42 merged, CI green |
| P0.1 payout lifecycle | Done | #40, #41 (`PayoutFailed`, pending maps) |
| P0.2 fee atomicity / excesses proxy | Done | #41, TEP-74 excesses |
| P0.3 reserves & liabilities | Partial | encumbrance done; getter set + legacy `DefiPayout` decision open |
| P0.4 anti-whale semantics | Mostly done | #42; boundary matrix + README spec open |
| P1 admin/timelock/multisig | Done | #39, #42 (`QuasarAdminTimelock`) |
| P1 granular pause / roles | Open | this checklist §5 |
| P1 Jetton 2.0 / Tolk decision | Open | this checklist §6 |
| P2 DeFi extensions | Post-testnet | ТЗ #35 P2 |
| Testing gates 7.x | Partial | 77/77 green; fuzz/mutation/gas snapshots open |
| Real testnet smoke | Open | runbook + §8–§9 |
| Independent audit | Open | §10 |
