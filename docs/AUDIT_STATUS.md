# Audit status

Consolidated status board for the open hardening / conformance items tracked from
issue #57 onward. This file is a repository status view, not an independent
security audit.

| ID | Description | File(s) / scope | Status | Issue |
|----|-------------|-----------------|--------|-------|
| A-58 | TEP-64 managed metadata with two-step timelock and on-chain/off-chain preflight | `contracts/quasar.tact`, `scripts/lib/tep64.ts`, `tests/tep64_content.test.ts` | fixed | #58 |
| A-59 | TEP-74 getter conformance and wallet/master address derivation checks | `tests/core_functions.test.ts`, `tests/tep89_wallet_discovery.test.ts`, `docs/SECURITY_TECHNICAL_SPECIFICATION.md` | fixed | #59 |
| A-60 | TEP-89 `addr_none` branch and `wallet-discovery` content compatibility | `contracts/quasar.tact`, `scripts/lib/tep64.ts`, `tests/tep89_wallet_discovery.test.ts` | fixed | #60 |
| A-61 | dApp opcode map must be checked against compiled ABI in CI | `scripts/check_dapp_abi.ts`, `website/tonconnect.js`, `.github/workflows/ci.yml` | fixed | #61 |
| A-67 | AI-oracle authority moved from sender-address checks to Ed25519 signed decisions with domain separation, strictly increasing nonce and expiry; key is owner-installed/revocable and signed actions stay reversible via `OwnerOverride` | `contracts/quasar.tact`, `scripts/ai_oracle.ts`, `tests/ai_oracle_signed.test.ts` | fixed | A-67 |
| A-62.1 | Independent third-party audit before real-funds launch | external audit report, `docs/` | open — requires external auditor | #62 |
| A-62.2 | Publish reproducible build hashes for compiled artifacts | `scripts/build_hashes.ts`, `docs/build-hashes.json`, `.github/workflows/ci.yml` | fixed (CI publication; refreshed in #102) | #62 |
| A-62.3 | Publish deployed testnet/mainnet addresses | release/deployment records | open — no canonical deployment published; only post-#102 deployment addresses are valid | #62 |
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
| F-33 | `AISetFee` and `AISetAntiWhale` cannot change any state (their fields are pinned to compile-time constants) yet each logs two dictionary entries, consumes the 6h cooldown and burns a query id | `contracts/quasar.tact:1231-1240`, `contracts/quasar.tact:1255-1271` | open — #102 did not change either handler; design decision required, see `docs/NOTES-WIP.md` | this pass |
| F-34 | `priceHistory` and `anomalyLog` grow without bound while the contract reserves only 0.05 TON, so rent can exceed the reserve | `contracts/quasar.tact:1352-1353`, `contracts/quasar.tact:1384-1385`, `contracts/quasar.tact:1437-1438` | fixed in review — bounded retention caps plus observable dropped counters (issue #139) | #139 |
| F-35 | A governance `proposalId` is not single-use: the tally resets to 0 after quorum, so the same id can be executed again with a different `kind` from a later voter's message | `contracts/quasar.tact:1532-1580` | fixed in review — `govProposalExecuted` makes a proposalId single-use (issue #139) | #139 |
| F-36 | `FeeTransfer` divides the fee split without an explicit `burnAmount <= totalSupply` guard; the varint range check catches it, but the abort is implicit | `contracts/quasar.tact:833-836` | fixed in review — explicit `burnAmount <= totalSupply` guard in `FeeTransfer` (issue #139) | #139 |
| F-37 | AI authorisation is a single external address; `checkSignature` / `checkDataSignature` are unused, so the whole AI surface trusts one relayer key | `contracts/quasar.tact:387` | documented trust boundary — #102 did not change AI authorization | this pass |
| F-38 | Comment in `_executeBuyback` claims the pool is "always fully consumed", but the `reserveBalance` cap can leave a remainder | `contracts/quasar.tact:930-936` | fixed in review — comment now states the reserve-cap remainder kept in `buybackPool` (issue #139) | #139 |


### Manual cross-check: PR #102 (merged 2026-10-05)

The merged diff and regression tests were checked against F-33–F-38. **None of these six findings is closed by #102.** #102 addresses adjacent buyback callback/refund handling, RemoveLiquidity settlement, initial LP quoting, and emergency-pause/trading synchronization; those changes do not resolve the findings above. F-35 and F-38 have nearby code changes, but the proposal-id replay path and the reserve-cap/comment mismatch remain.

## Still intentionally open

- **Issue #62** is open again (reopened 2026-10-07) until an external audit report
  exists and real deployment addresses are published. It had been closed as
  `completed`, which contradicted this document and the issue's own conditions;
  the tracker and this file are now aligned.
- **Issue #139** tracks the contract hardening of F-34/F-35/F-36/F-38; when that
  PR merges, the four rows above move from `fixed in review` to `fixed`. PR #102 changes contract storage/layout, so
  all pre-#102 addresses are invalid; A-62.3 must use addresses from a deployment
  of the post-#102 build. No canonical deployment addresses are published yet.
- **Issue #107** remains open for the AI development cycle; it is a separate
  workflow task, not an audit finding.
- Build hashes alone do **not** certify safety or readiness; they only make a
  reviewed build reproducible.
