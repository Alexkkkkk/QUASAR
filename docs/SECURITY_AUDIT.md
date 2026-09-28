# QUASAR Contract Security Review

Date: 2026-09-15
Scope: contracts/quasar.tact, contracts/quasar_defi.tact, generated bindings, deployment flow, and CI validation.

## Remediated findings

### DeFi fee reserve desynchronization — fixed
Master fee distribution transferred the DeFi share to the DeFi wallet without a forward notification. The token balance changed, but qsrReserve did not, leaving those tokens outside AMM accounting. The dedicated fee transfer path now sends a notification and DeFi credits the amount directly to qsrReserve.

### Partial LP exit with mixed farm state — fixed
A provider could hold unstaked LP alongside farmed LP, while removal attempted to unstake the entire withdrawal amount. Removal now unstakes only the smaller of the requested LP and the farmed LP balance.

### Supply underflow on burn — fixed
Burn notifications now reject amounts greater than totalSupply before subtraction.

### Mint-stop bypass through AI signal — fixed
A bullish AI price signal could set mintable back to true after the owner stopped minting. That assignment was removed.

### Unbounded issuance — fixed

The master now rejects a mint when `totalSupply + amount` would exceed the
hard 1,000,000,000 QSR cap. The deployment script and smoke check use the same
9-decimal supply model.

### Referral claim mismatch — fixed

Referral rewards are now escrowed in the master and released only through
`ClaimReferralRewards`; the public message and documentation no longer promise
an unimplemented claim path.

### AI mint-stop authority — fixed (2026-09-26)

`AIPriceSignal`, `AIAnomalyAlert`, and `AIEmergencyPause` no longer mutate `mintable`. AI may still pause trading and adjust risk parameters, while the owner must explicitly send `Stop Minting` to disable issuance. Regression coverage protects both the source invariant and the sandbox behavior.

## Test coverage added

- npm run security:check validates the source-level invariants above.
- npm run testnet:smoke performs read-only testnet checks: deployment presence, Master/DeFi linkage, non-zero supply, reserve sanity, and configured supply.
- Generated TypeScript bindings, ABI, and BOC artifacts are regenerated from the patched contracts.

## Residual risks requiring independent review

1. Outgoing Jetton payout bounce paths should be exercised against a live TON sandbox with adversarial recipients and low TON balances.
2. Lottery randomness and the administrative/AI control model need an independent economic and access-control review.
3. AMM and farming need property-based invariant tests over extreme integer sizes, zero-liquidity transitions, and reward-reserve exhaustion.
4. A testnet deployment must be funded and exercised with a dedicated disposable wallet before any mainnet deployment.

This document is an engineering review, not a formal third-party audit or a promise of production safety.

---

## Independent-audit remediation (issue #44 — commit af83516)

An independent engineering audit (issue #44) returned **NO-GO** for real-funds
testnet and mainnet. The findings and their in-`main` status after the
remediation series:

| ID | Severity | Status | Evidence |
| --- | --- | --- | --- |
| H-01 | High | Fixed (PR #45) | wallet cleanup messages authenticate their expected sender |
| H-02 | High | Fixed | typed `PendingMasterPayout` ledger + `_restoreMasterPayout`; `Unstake`/`ClaimVested`/`ClaimRewards`/`ClaimReferralRewards` register the operation id and restore stake, vesting claim, reward pool and referral liability on bounce |
| M-01 | Medium | Fixed | DeFi `TonPayout`/`PendingTonPayout`; `RemoveLiquidity` and `SwapToTON` register the TON leg and roll back `tonReserve` plus the LP / QSR-deposit entitlement on bounce |
| M-02 | Medium | Fixed | `QuasarAdminTimelock` is deployed by `deploy_all.ts` and served as owner of Master and DeFi via the two-step transfer; smoke run asserts the wiring |
| L-01 | Low | Fixed | `govVotes` keyed by `(voter, proposalId)` so a staker votes once per proposal |

Regression coverage: `tests/audit_h02_m01_l01.test.ts`,
`tests/audit_m02_timelock.test.ts`.

The audit's remaining pre-launch gates are unchanged and still open: live
testnet smoke and adversarial bounce tests must be executed against a
disposable deployment before any real-funds launch.
