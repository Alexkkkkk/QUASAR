# Pattern Drafts (auto-generated — human review required)

## HELD (adversarial counterexample) StaticCheck: Review swap deadline enforcement in QuasarDeFi
- Proposed: Revert when now > deadline at the top of every swap and liquidity entry point.
- Attack: COUNTEREXAMPLE: In a scenario where the deadline enforcement rule is not followed, the swap function in QuasarDeFi could be called before the deadline has passed. This would result in the swap being executed with an invalid deadline, leading to a gas exhaustion error.
- Human must judge before this rule can be promoted.

## HELD (adversarial counterexample) BounceBug: Review bounced payout liability restore in QuasarMaster
- Proposed: On bounce, restore the exact stake/vesting/referral liability recorded at send time; never touch only the aggregate counter.
- Attack: COUNTEREXAMPLE: In a scenario where the QuasarMaster contract is designed to restore the exact stake/vesting/referral liability recorded at send time, but fails to do so correctly, it could lead to a bug where the restored liability is not accurately reflected in the contract's state. This could res
- Human must judge before this rule can be promoted.
