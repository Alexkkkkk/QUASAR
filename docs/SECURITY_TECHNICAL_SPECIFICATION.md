# QUASAR security technical specification

This document records the security contract that must be true before testnet or mainnet deployment. It describes the current source behavior; it is not an audit certificate.

## Components and trust boundaries

- **QuasarMaster** is the Jetton master, fee distributor, staking/vesting custody, and owner-controlled buyback coordinator.
- **QuasarWallet** is the TEP-74 wallet. Only its owner may request a transfer; the wallet derives recipient wallets from the master address and restores token balance on bounced token legs.
- **QuasarDeFi** is a CPMM pool. QSR enters through the pool's own Jetton wallet and remains a refundable pending deposit until an explicit pool operation consumes it.
- **AI oracle** is untrusted input. It may apply only the bounded controls exposed in the message surface; it cannot mint, stop minting, withdraw custody, or move reserve funds.

## Mandatory invariants

1. `totalSupply` never exceeds `maxSupply`, and only owner-authenticated minting can increase it.
2. A bounced mint, transfer, pool payout, or burn notification restores the token balance that was committed to the outgoing leg.
3. Fee, referral, staking, buyback, DeFi, custody, and pending-deposit accounting must not spend the same QSR twice. A payout is allowed only when its corresponding reserve/encumbrance is available.
4. A user deposit remains refundable until `Stake`, `AddVesting`, `FundFarm`, `AddLiquidity`, or `SwapToTON` consumes it. Pausing must not remove the refund path.
5. Jetton transfers emit the TEP-74 notification/excesses messages with the original `query_id`; wallet discovery uses the TEP-89 `provide_wallet_address` / `take_wallet_address` pair.
6. Every logged AI action has a bounded owner override window and stores enough pre-action state to restore every field that action can mutate. Emergency severity changes therefore snapshot both fee and burn-share state; anti-whale changes snapshot all three configured limits.
7. Price and anomaly messages are telemetry/risk controls only. They do not initiate buybacks or route TON/QSR. Buybacks require the owner-authenticated `TriggerBuyback` message and are protected by threshold and cooldown checks.
8. AMM withdrawals and swaps update reserves before payout, enforce caller balance/slippage/size checks, and never let `SweepTON` spend TON backing LP positions.

## Required verification gates

- Type-check and compile both Tact contracts.
- Run all contract tests, including TEP-74 conformance, mint-bounce, DeFi reserve, farm, staking, and AI rollback regressions.
- Run the static security checker and inspect the generated artifact hashes.
- Execute the full testnet scenario with real Jetton wallet discovery, bounced transfers, excesses, buyback success and buyback bounce, pool refund, farm claim, and owner timelock.
- Do not call the system mainnet-ready until an independent TON/Tact audit covers message authorization, action-phase value modes, bounce paths, and reserve reconciliation.

## Explicit non-goals

The current source does not claim multisig ownership, a community veto, audited yield, or an enforced wallet-size limit. These must not be advertised as live guarantees without a separate implementation and regression suite.
