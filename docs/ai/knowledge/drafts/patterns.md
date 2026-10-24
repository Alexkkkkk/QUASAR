# Pattern Drafts (auto-generated — human review required)

## HELD (adversarial counterexample) StaticCheck: Review swap deadline enforcement in QuasarDeFi
- Proposed: Revert when now > deadline at the top of every swap and liquidity entry point.
- Attack: Test the asynchronous boundary: a swap passes its initial deadline check, then a token callback or payout is delayed until after that deadline. Verify that pending state records the deadline and that settlement/retry paths enforce it. This is a review hypothesis, not a confirmed vulnerability.
- Human must judge before this rule can be promoted.

## HELD (adversarial counterexample) BounceBug: Review bounced payout liability restore in QuasarMaster
- Proposed: On bounce, restore the exact stake/vesting/referral liability recorded at send time; never touch only the aggregate counter.
- Attack: Test a stale, mismatched, or repeated bounce for one payout ID. Verify that the handler restores only the recorded beneficiary liability, exactly once, without altering another payout's aggregate accounting. This is a review hypothesis, not a confirmed defect.
- Human must judge before this rule can be promoted.
