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
