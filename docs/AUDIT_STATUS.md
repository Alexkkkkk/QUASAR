> Historical audit register: code paths below refer to the implementation at the time of each finding. Legacy contract evidence is archived under `legacy Tact artifacts`; current source of truth is `tolk/contracts/`.

# Audit status

Consolidated status board for the open hardening / conformance items tracked from
issue #57 onward. This file is a repository status view, not an independent
security audit.

**База сверки:** `main` at `e87b56178f2c226c222b86958cc2defcbc96a68e`.
Статус `fixed` ниже означает только, что указанное изменение и/или его
регрессионное покрытие присутствуют в этой ревизии; он не заменяет независимый
аудит, проверку развёртывания или релизный гейт #62.

| ID | Description | File(s) / scope | Status | Issue |
|----|-------------|-----------------|--------|-------|
| A-58 | TEP-64 managed metadata with two-step timelock and on-chain/off-chain preflight | `contracts/quasar.tact`, `scripts/lib/tep64.ts`, `tests/tep64_content.test.ts` | fixed | #58 |
| A-59 | TEP-74 getter conformance and wallet/master address derivation checks | `tests/core_functions.test.ts`, `tests/tep89_wallet_discovery.test.ts`, `docs/SECURITY_TECHNICAL_SPECIFICATION.md` | fixed | #59 |
| A-60 | TEP-89 `addr_none` branch and `wallet-discovery` content compatibility | `contracts/quasar.tact`, `scripts/lib/tep64.ts`, `tests/tep89_wallet_discovery.test.ts` | fixed | #60 |
| A-61 | dApp opcode map must be checked against compiled ABI in CI | `scripts/check_dapp_abi.ts`, `website/tonconnect.js`, `.github/workflows/ci.yml` | fixed | #61 |
| A-67 | AI-oracle authority moved from sender-address checks to Ed25519 signed decisions with domain separation, strictly increasing nonce and expiry; key is owner-installed/revocable and signed actions stay reversible via `OwnerOverride` | `contracts/quasar.tact`, `scripts/ai_oracle.ts`, `tests/ai_oracle_signed.test.ts` | fixed | A-67 |
| A-62.1 | Independent third-party audit before real-funds launch | external audit report, `docs/` | open — requires external auditor | #62 |
| A-62.2 | Publish reproducible build hashes for compiled artifacts | `scripts/build_hashes.ts`, `docs/build-hashes.json`, `.github/workflows/ci.yml` | fixed (CI publication; refreshed in #102) | #62 |
| A-62.3 | Publish deployed testnet/mainnet addresses | release/deployment records | open — no canonical deployment published; any future record must be derived from the then-current verified build, not merely post-#102 code | #62 |
| A-63 | Deterministic invariant/property coverage for swaps, LP, and staking accounting | `tests/property_invariants.test.ts` | fixed | #63 |
| A-64 | ABI snapshot verification and shared wallet-code identity gate | `scripts/check_abi.ts`, `docs/abi/*.json`, `.github/workflows/ci.yml` | fixed | #64 |
| A-65.1 | TON Connect result handling: success vs user cancel vs error | `website/tonconnect.js`, `tests/tonconnect_feedback.test.ts` | fixed | #65 |
| A-65.2 | UI must surface min output and deadline guardrails | `website/index.html`, `website/tonconnect.js`, `tests/tonconnect_feedback.test.ts` | fixed | #65 |
| A-65.3 | Manifest icon / REST-vs-jsonRPC contract reads | `website/tonconnect-manifest.json`, `website/tonconnect.js`, `tests/tonconnect_feedback.test.ts` | fixed | #65 |
| A-66.1 | Consolidated dated audit report | `docs/AUDIT_2026-09-29.md` | fixed | #66 |
| A-66.2 | Change log with issue / PR references | `CHANGELOG.md` | fixed | #66 |
| A-66.3 | README / whitepaper aligned with active code paths and open tracker | `README.md`, `WHITEPAPER.md`, `docs/AUDIT_STATUS.md` | fixed | #66 |

### Audit pass 2026-10-01 — contracts/**, oracle wiring

Every `contracts/*.tact` file was read in full (`quasar.tact` 2059 lines,
`quasar_defi.tact` 887, `quasar_common.tact` 401, `quasar_admin.tact` 136) and
checked with the Tact compiler, the security-invariant script and the sandbox
suite. Findings are listed with the file/line range that carries them.

| ID | Finding | File(s) / scope | Status | Where |
|----|---------|-----------------|--------|-------|
| F-31 | `ExecuteAdminCall` had no sender check, so anyone could fire a queued call once the delay expired while `CancelAdminCall` stayed admin-only | `contracts/quasar_admin.tact:83-98`, `tests/audit_f31_f32.test.ts` | fixed | this pass |
| F-32 | `AISetOracle`, `AIRotateOracle` and "Claim AI Control" moved the oracle without clearing `lastAiQueryId`, so a new oracle was rejected as "Stale AI query" | `contracts/quasar.tact:1303-1321`, `contracts/quasar.tact:1514-1521`, `tests/audit_f31_f32.test.ts` | fixed | this pass |
| F-33 | `AISetFee` and `AISetAntiWhale` cannot change the compiled wallet-policy constants; historically they still logged state, consumed cooldown and advanced the query watermark. | `contracts/quasar.tact` (`AISetFee` / `AISetAntiWhale`, lines 1340–1375) | **fixed in code:** commit `09e547d` makes both receivers validating, event-emitting no-ops; they consume neither cooldown, action-log entry nor replay watermark. The compiled-policy design itself remains intentional. | historical pass; `09e547d` |
| F-34 | `priceHistory` and `anomalyLog` grow without bound while the contract reserves only 0.05 TON, so rent can exceed the reserve | `contracts/quasar.tact:1352-1353`, `contracts/quasar.tact:1384-1385`, `contracts/quasar.tact:1437-1438` | fixed — bounded retention caps plus observable dropped counters (PR #140, merged 2026-10-08) | #139 |
| F-35 | A governance `proposalId` is not single-use: the tally resets to 0 after quorum, so the same id can be executed again with a different `kind` from a later voter's message | `contracts/quasar.tact:1532-1580` | fixed — `govProposalExecuted` makes a proposalId single-use (PR #140, merged 2026-10-08) | #139 |
| F-36 | `FeeTransfer` divides the fee split without an explicit `burnAmount <= totalSupply` guard; the varint range check catches it, but the abort is implicit | `contracts/quasar.tact:833-836` | fixed — explicit `burnAmount <= totalSupply` guard in `FeeTransfer` (PR #140, merged 2026-10-08) | #139 |
| F-37 | **Historical finding (2026-10-01):** AI authorisation then relied only on an external address and did not use `checkSignature` / `checkDataSignature`. | `contracts/quasar.tact` — legacy `_requireAiAccess()` at line 421; signed receiver `AISignedDecision` at lines 2108–2123; `tests/ai_oracle_signed.test.ts` | **Partially remediated / trust boundary retained.** The signed route now verifies Ed25519 with `checkSignature`, an owner-set `aiOraclePubKey`, a strictly increasing nonce and expiry (A-67). It may be relayed by an untrusted sender. The legacy direct AI receivers still use `_requireAiAccess()` and therefore trust `aiOracle` by sender address; this is a remaining, explicitly documented legacy boundary rather than evidence that the whole AI surface is signature-only. | this pass; A-67 |
| F-38 | Comment in `_executeBuyback` claims the pool is "always fully consumed", but the `reserveBalance` cap can leave a remainder | `contracts/quasar.tact:930-936` | fixed — comment now states the reserve-cap remainder kept in `buybackPool` (PR #140, merged 2026-10-08) | #139 |

### External-audit findings H-1 / M-1 / M-3 / M-4 — historical registration and current code state

The phrases **“fix in review”** and **“awaiting formulation”** described the
2026-10-10 registration snapshot only. They are not the status of `main` at the
baseline above. Audit pack v2 supplies the subsequent M-3/M-4 formulations;
the still-open #169 remains a tracking/formulation issue and must not be read as
evidence that those definitions are absent from the repository.

| ID | Finding / subsequent formulation | File(s) / scope | Status on `main` e87b561 | Issue |
|----|----------------------------------|-----------------|---------------------------|-------|
| H-1 | `receive(msg: GovernanceVote)` could execute economic proposals on quorum without sender authorization. | `contracts/quasar.tact` (`receive(msg: GovernanceVote)`); `tests/audit_h1_m1_governance_refund.test.ts` | **fixed in code:** `_requireOwner()` gates the receiver. PR #170 merged 2026-10-11; #167 is closed. Audit pack v2 additionally moved the `TriggerBuyback` owner check ahead of state checks (PR #183). | #167 |
| M-1 | The master lacked `RefundPendingDeposit`, leaving unused `pendingQsrDeposits` without a master-side recovery path. | `contracts/quasar.tact` (`RefundPendingDeposit`; kind-6 restore); `tests/audit_h1_m1_governance_refund.test.ts` | **fixed in code:** receiver and bounce restore are present. PR #170 merged 2026-10-11; #168 is closed. | #168 |
| M-3 | v2 formulation: a failed farm payout must re-credit the specific farmer's pending reward, not only `farmRewardReserve`. | `contracts/quasar_defi.tact` (`PayoutFailed`, kind 2); `tests/audit_pack_v2_application.test.ts` | **applied in code:** PR #183 merged 2026-10-12. #169 is still open as the external-findings tracker. | #169 |
| M-4 | v2 formulations: **M-4a** pauses treasury/auto-buyback outgoing fee legs while preserving inbound accounting/burn; **M-4b** keeps `Unstake`/`ClaimVested` live while paused; **M-4c** names the mint-only switch accurately. | `contracts/quasar.tact`; `tests/audit_pack_v2_application.test.ts`; `docs/abi/quasar-master.json` | **applied in code:** M-4a/M-4b in PR #183 (merged 2026-10-12); M-4c in PR #206 (merged 2026-10-13). The current ABI contains `ToggleMinting` / `AIToggleMinting`, not the old names, with preserved opcodes `0xf1822da1` / `0x0490d605`. #169 and #179 remain open trackers. | #169, #179 |



### Manual cross-check: PR #102 (merged 2026-10-05)

The merged diff and regression tests were checked against F-33–F-38. **None of these six findings is closed by #102.** #102 addresses adjacent buyback callback/refund handling, RemoveLiquidity settlement, initial LP quoting, and emergency-pause/trading synchronization; those changes do not resolve the findings above. F-35 and F-38 have nearby code changes, but the proposal-id replay path and the reserve-cap/comment mismatch remain.

## Still intentionally open

- **Issue #62** is open again (reopened 2026-10-07) until an external audit report
  exists and real deployment addresses are published. It had been closed as
  `completed`, which contradicted this document and the issue's own conditions;
  the tracker and this file are now aligned.
- **Issue #139** tracked the contract hardening of F-34/F-35/F-36/F-38; PR #140
  merged on 2026-10-08, so those four rows are `fixed`. The statement about
  pre-#102 addresses was historical: later contract changes in PRs #140, #170,
  #183 and #206 also require any future deployment records to be derived from
  the then-current verified build. No canonical deployment addresses are
  published yet. H-1/M-1 are merged (#170); the audit-pack M-3/M-4 code changes
  are merged (#183/#206); #169 remains open for tracking/formulation.
- **Issue #107** remains open for the AI development cycle; it is a separate
  workflow task, not an audit finding.
- Build hashes alone do **not** certify safety or readiness; they only make a
  reviewed build reproducible.

### Audit pack v2 — application record (2026-10-11)

Source: audit pack v2 (`legacy Tact artifactsaudit-pack-v2/`, staged verbatim as review material in
PR #182). Applied to the real contracts in dedicated PRs. In this table,
“applied” means the cited source/test is present in the reconciliation baseline;
it is not an independent-audit conclusion.

| ID | Status | Where |
|----|--------|-------|
| H-1 | applied (reordered) | `contracts/quasar.tact` — `receive(TriggerBuyback)`: `_requireOwner()` moved ahead of every state check, so an unauthenticated call always aborts with "Only owner". Main already had the gate, but behind the pause/pool checks. |
| M-1 | already in main | `RefundPendingDeposit` receiver + kind-6 bounce restore (PR #170). The pack's partial-refund variant was NOT adopted; the single-key shape is kept. |
| M-2b | applied, owner gate kept | `receive(GovernanceVote)`: tally and per-voter record are now keyed on the hash of `(proposalId, kind, flag, feeBps)`. The pack removed the owner gate; this branch keeps it, so the message stays an owner action. |
| M-3 | applied | `contracts/quasar_defi.tact` — `receive(PayoutFailed)` kind 2: the failed payout record re-credits the farmer's `pending` in addition to `farmRewardReserve`. |
| M-4a | applied | `receive(FeeTransfer)`: treasury transfer and auto-buyback sit behind `if (!self.emergencyPause)`. Inbound accounting, the burn leg and referral liabilities are unaffected, so wallets still receive their `TransferConfirmed`. |
| M-4b | applied | `Unstake` and `ClaimVested` no longer call `_requireNotPaused`; `Stake` / `ClaimRewards` / `ClaimReferralRewards` remain gated. |
| M-4c | applied | `contracts/quasar.tact` renames `ToggleTrading` -> `ToggleMinting` (`AIToggleTrading` -> `AIToggleMinting`) and explicitly pins the prior opcodes (`0xf1822da1`, `0x0490d605`). The current ABI records the new names and those opcodes. The flag still gates minting only (`_requireTrading` is called from `receive(Mint)` alone); the AI action log records `ToggleMinting`. The ABI/build-hash artifacts were regenerated in the rename commit. Stable opcodes do not by themselves certify every external integration. |
| L-1 | applied | DeFi buyback tombstone keeps a one-slot history (`prevBuyback*`) and the bounce handler routes pending / previous / unknown legs instead of reverting. |
| L-2 | applied | `QUASAR_POOL_PAYOUT_MARKER` added to the shared wallet; pool payouts mark the downstream `InternalTransfer` query id and `bounced<InternalTransfer>` routes on the bit. Additionally (not in the pack) the `TokenExcesses` lookup normalises the marked id, otherwise a successful payout would never clear its pool record. |
| L-3 | applied | The transfer residual is only sent when `responseDestination != addr_none`; otherwise it stays in the wallet. |
| L-4 | NOT applied | The pack version returns compile-time constants from a runtime getter. `get_fee_config` reports the live fields today; returning constants would under-report `feeBps`/`feeBurnShare` after an AI rebalance or a governance vote. Suggest changing the *getter shape* (versioned or renamed) instead. |
| L-5 | applied | `_restoreMasterPayout` kind 3 anchors `lastClaim` at `now()` instead of rewinding to `d1`. |
| L-7 | applied | `estimateLpOut` returns 0 when either reserve is zero instead of dividing by zero. |
| L-8 | not applicable to code | Documentation-only item; belongs to the minter dApp UI (wallet balance >= 0.075 TON pre-check). |

Release gates after this change: contract code hashes changed, so
`docs/abi/*.json` and `docs/build-hashes.json` were regenerated in the same commit and
the published testnet addresses must be re-derived before any deployment.

### Historical PR #182 test note and current narrow check

The preceding “pre-existing failures” text was an observation recorded in the
PR #182 body at that time; it is **historical**, not a claim about the test
state of `e87b561`. For this reconciliation, the narrow command
`node --import tsx --test tests/ai_oracle_signed.test.ts tests/audit_h1_m1_governance_refund.test.ts tests/audit_pack_v2_application.test.ts`
reported 32 passing tests (signed-decision, H-1/M-1 and pack-source coverage).
It was not a full-suite run and does not establish production readiness or an
independent audit.

### M-4c — historical snapshot and current `ToggleMinting` state

The claim that the rename was intentionally not applied was true only for the
historical snapshot at `0f8ba6cd` on 2026-10-12, before PR #206. It is retained
here as provenance, not as the current ABI description.

- **Current names and ABI.** At `e87b561`, the source declares
  `ToggleMinting` and `AIToggleMinting`; `docs/abi/quasar-master.json` contains
  those names and the explicitly preserved opcodes `0xf1822da1` and
  `0x0490d605`. The old `ToggleTrading` / `AIToggleTrading` names are absent
  from that ABI. PR #206 merged this change on 2026-10-13. The retained
  `tradingEnabled` storage-field name and “Trading off” error string are not
  evidence that the old message ABI remains.
- **Actual flag semantics.** `_requireTrading()` is the master-contract guard
  for this flag and is invoked by `receive(msg: Mint)`; it is not consulted by
  autonomous jetton-wallet transfers. Thus the current message name describes
  the observed mint gate; it does not make a claim about deployment or external
  integration readiness.
- **Pause coverage.** `tests/audit_pack_v2_application.test.ts` pins M-4a
  (outgoing fee legs suppressed during pause) and M-4b (exit paths remain
  available while entries are gated). The ABI/source checks above establish the
  M-4c name/opcode record.

Refs: issue #179 (open); PR #206 (merged).
