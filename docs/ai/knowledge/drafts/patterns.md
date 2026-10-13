# Pattern Drafts (auto-generated — human review required)

## HELD (adversarial counterexample) StaticCheck: Review swap deadline enforcement in QuasarDeFi
- Proposed: Revert when now > deadline at the top of every swap and liquidity entry point.
- Attack: COUNTEREXAMPLE: In the QuasarDeFi smart contract, the swap deadline enforcement rule is implemented in the `swap` function. However, the rule is not correctly enforced at the top of every swap and liquidity entry point. This can lead to a bug where the swap is executed before the deadline, resulting
- Human must judge before this rule can be promoted.

## HELD (adversarial counterexample) BounceBug: Review bounced payout liability restore in QuasarMaster
- Proposed: On bounce, restore the exact stake/vesting/referral liability recorded at send time; never touch only the aggregate counter.
- Attack: COUNTEREXAMPLE: In a scenario where the QuasarMaster contract is designed to restore the exact stake/vesting/referral liability recorded at the time of a send, but the contract does not properly handle the case where the user's balance is insufficient to cover the liability, the contract could be vu
- Human must judge before this rule can be promoted.
