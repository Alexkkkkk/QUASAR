# Pattern Drafts (auto-generated — human review required)

## StaticCheck: Review swap deadline enforcement in QuasarDeFi
- Rule: Revert when now > deadline at the top of every swap and liquidity entry point.
- Why: Proven 2/2 runs green by ai-fix, ai-review.
- Signature: `sig:d77eeda0123692ea`  |  evidence: 2 runs

## BounceBug: Review bounced payout liability restore in QuasarMaster
- Rule: On bounce, restore the exact stake/vesting/referral liability recorded at send time; never touch only the aggregate counter.
- Why: Proven 2/2 runs green by ai-fix, ai-review.
- Signature: `sig:5f2469b2bf290400`  |  evidence: 2 runs
