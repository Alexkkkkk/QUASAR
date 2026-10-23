# Pattern Drafts (auto-generated — human review required)

## HELD (adversarial counterexample) StaticCheck: Review swap deadline enforcement in QuasarDeFi
- Proposed: Revert when now > deadline at the top of every swap and liquidity entry point.
- Attack: COUNTEREXAMPLE: In a scenario where the deadline is set to a very short time (e.g., 1 minute), the swap function might be called multiple times within that time frame. If the deadline is enforced at the top of every swap, it could cause the swap to fail if the deadline has already passed when the sw
- Human must judge before this rule can be promoted.

## HELD (adversarial counterexample) BounceBug: Review bounced payout liability restore in QuasarMaster
- Proposed: On bounce, restore the exact stake/vesting/referral liability recorded at send time; never touch only the aggregate counter.
- Attack: COUNTEREXAMPLE: In a scenario where the QuasarMaster contract is designed to restore the exact stake/vesting/referral liability recorded at the time of a send, but the contract does not properly handle the case where the user's balance is insufficient to cover the liability, the contract could be vu
- Human must judge before this rule can be promoted.
