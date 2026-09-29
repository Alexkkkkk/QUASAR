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
| A-62.1 | Independent third-party audit before real-funds launch | external audit report, `docs/` | open — requires external auditor | #62 |
| A-62.2 | Publish reproducible build hashes for compiled artifacts | `scripts/build_hashes.ts`, `docs/build-hashes.json`, `.github/workflows/ci.yml` | fixed (CI publication) | #62 |
| A-62.3 | Publish deployed testnet/mainnet addresses | release/deployment records | open — no canonical deployment published in repo | #62 |
| A-63 | Deterministic invariant/property coverage for swaps, LP, and staking accounting | `tests/property_invariants.test.ts` | fixed | #63 |
| A-64 | ABI snapshot verification and shared wallet-code identity gate | `scripts/check_abi.ts`, `docs/abi/*.json`, `.github/workflows/ci.yml` | fixed | #64 |
| A-65.1 | TON Connect result handling: success vs user cancel vs error | `website/tonconnect.js` | open | #65 |
| A-65.2 | UI must surface min output and deadline guardrails | `website/index.html`, `website/tonconnect.js` | open | #65 |
| A-65.3 | Manifest icon / REST-vs-jsonRPC contract reads | `website/tonconnect-manifest.json`, `website/tonconnect.js` | fixed | #65 |
| A-66.1 | Consolidated dated audit report | `docs/AUDIT_2026-09-29.md` | fixed | #66 |
| A-66.2 | Change log with issue / PR references | `CHANGELOG.md` | fixed | #66 |
| A-66.3 | README / whitepaper aligned with active code paths and open tracker | `README.md`, `WHITEPAPER.md`, `docs/AUDIT_STATUS.md` | fixed | #66 |

## Still intentionally open

- **Issue #62** remains open until an external audit report exists and real
  deployment addresses are published.
- Build hashes alone do **not** certify safety or readiness; they only make a
  reviewed build reproducible.
