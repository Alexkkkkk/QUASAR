# Pitfalls

Known failure modes. Every agent checks this list before shipping a patch.

## First-depositor price manipulation
- Rule: Permanently lock minimum first-liquidity so the initial price cannot be set arbitrarily.
- Why: Unlocked initial LP lets the first depositor set any spot price.
- Applies to: QuasarDeFi AddLiquidity.

## Unauthenticated wallet cleanup
- Rule: Wallet-internal messages must be authenticated as coming from their parent contract.
- Why: Unauthenticated cleanup lets anyone burn/redirect another user's wallet state (audit H-01 class).
- Applies to: QuasarWallet internal messages.

## Double-counting rewards on bounce
- Rule: Never credit rewards twice when a payout bounces and is re-sent.
- Why: Bounce-recovery ledgers exist precisely because naive re-send double-pays.
- Applies to: staking rewards, farm rewards, referral claims.
