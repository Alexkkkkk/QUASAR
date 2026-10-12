# Patterns

Promoted, CI-proven rules all agents must follow. Entries here are
human-approved (merged from `drafts/` by a maintainer). Agents: query this
file via `cli.mjs query` before proposing fixes — do not duplicate rules.

## Enforce swap deadlines via block timestamp
- Rule: Revert any swap/liquidity call where `now > deadline`.
- Why: Proven across agents and runs; stale transactions drained pools in other Tact projects.
- Applies to: QuasarDeFi swap + liquidity entry points.

## Restore originating liability on bounced payouts
- Rule: On bounced Master/DeFi payouts, restore the exact stake/vesting/referral
  liability, never just the aggregate counter.
- Why: Aggregate-only rollback silently burns user entitlements (audit M-01 class).
- Applies to: QuasarMaster payouts, QuasarDeFi RemoveLiquidity / SwapToTON.
