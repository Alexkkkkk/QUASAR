# QUASAR — Whitepaper

**Version:** 1.0  
**Status:** Technical description of the current implementation  
**Network:** TON  
**Token:** QSR  
**Repository:** https://github.com/Alexkkkkk/QUASAR

> This document describes the QUASAR design and the state of its source code at the time of publication. It is not investment advice, a promise of returns, or a security audit. Parameters controlled by the owner or AI Oracle may change within the permissions of the smart contracts.

## 1. Executive Summary

QUASAR is a Jetton and DeFi ecosystem built on the TON blockchain. The project combines the QSR token, an embedded TON/QSR constant-product market maker, LP farming, staking, referrals, vesting, lottery mechanics, and a configurable AI Oracle governance layer.

The architecture is intended to keep core QSR operations in transparent on-chain contracts and expose system state through getters and events. The user interface connects to TON wallets through TON Connect.

## 2. Vision and Principles

QUASAR is built around five principles:

1. **On-chain accounting.** Balances, fees, reserves, staking, and governance actions should be represented in contract state.
2. **Modularity.** Jetton logic, the DeFi pool, and the web interface are separated into distinct components.
3. **Controlled automation.** The AI Oracle can process signals and propose actions, while its authority is constrained by operating modes, cooldowns, veto, and emergency mechanisms.
4. **Protection against extreme operations.** The code includes slippage protection, a reentrancy guard, transaction limits, and wallet limits.
5. **Public verifiability.** Before mainnet, the project needs an independent audit, testnet deployment, published contract addresses, and verification that the documentation matches the implementation.

## 3. Architecture

### 3.1 QuasarMaster

The main QUASAR contract is responsible for:

- the Jetton master and QSR issuance;
- user Jetton wallets;
- fee processing;
- burn and buyback accounting;
- staking and rewards;
- referrals;
- vesting;
- lottery operations;
- AI Oracle controls, cooldowns, veto, and emergency pause;
- configuration of the DeFi pool address.

### 3.2 QuasarWallet

Each user wallet stores a QSR balance and communicates with the master contract. During transfers, the wallet sends the master contract the fee information, original sender, and receiver. Fee processing and limits are enforced by the master contract logic.

### 3.3 QuasarDeFi

The DeFi contract implements a TON/QSR constant-product market maker with:

- TON and QSR reserves;
- proportional LP tokens;
- QSR-to-TON swaps;
- TON-to-QSR swaps;
- liquidity deposits and withdrawals;
- LP staking and farm rewards;
- swap, LP-output, and price-impact estimates.

Swaps accept minimum-output parameters, minTonOut and minQsrOut. The transaction is rejected if the calculated output is below the user-defined minimum. The contract also includes a reentrancy guard.

### 3.4 Web Interface

The website package provides a TON Connect interface for wallet connection and interaction with the deployed contracts. Contract addresses are expected to be loaded from deployment configuration after deployment.

## 4. QSR Token

QSR is the Jetton of the QUASAR ecosystem with a base precision of 9 decimals. The token is intended for:

- transfers and internal fee processing;
- staking;
- referral activity;
- farming rewards;
- lottery tickets;
- liquidity provision in the TON/QSR pool.

### Important Supply Note

The README describes a target total supply of 1,000,000,000 QSR. However, the current QuasarMaster initializer sets totalSupply to 0 and mintable to true. Therefore, the 1 billion figure must not be treated as a hard on-chain cap until it is enforced by the issuance logic, deployment configuration, and tests. This issue must be resolved before mainnet.

## 5. Fees and Distribution

The master contract initializer sets the base fee to 30 basis points, or 0.30%. The initial burn share is 50% of the collected fee.

After the burn, the remaining amount is routed by default as follows:

- 15% of the remainder to the buyback pool;
- 15% of the remainder to the lottery jackpot;
- 10% of the remainder to the staking rewards pool;
- 5% of the remainder to the DeFi pool when a DeFi address is configured;
- the balance to the treasury;
- up to 1% of the original fee to a referrer when a valid referral record exists.

When a feature is disabled or the DeFi address is not configured, the relevant amount is returned to the treasury according to the current contract logic. Final values should be verified through the configuration getter and the EventFeeDistributed event.

### Initial protection parameters

| Parameter | Value at initialization |
|---|---:|
| Transfer fee | 0.30% |
| Burn share | 50% of the fee |
| Maximum transaction | 1% of supply |
| Maximum wallet | 3% of supply |
| Transfer cooldown | 15 seconds |
| Buyback threshold | 10 TON |
| Buyback cooldown | 1 hour |
| Buyback burn percentage | 100% |

These are initialized values, not immutable promises. Some may be changed by the owner or AI Oracle in the permitted operating mode.

## 6. DeFi and Liquidity

### 6.1 Constant-Product Market Maker

The pool uses a constant-product reserve model. For the first liquidity deposit, LP supply is calculated from the square root of the deposited TON and QSR amounts. Subsequent LP minting is proportional to the existing reserves.

A user supplies a minimum acceptable swap output. If the calculated result is below that value, the operation is rejected. This reduces execution surprises but does not remove market risk or impermanent loss.

### 6.2 Yield Farming

LP tokens can be staked in the farm. The initial DeFi configuration sets the reward rate to 0.1 QSR per second and the farm end time to one year after initialization. The owner can update the farm configuration within the current contract permissions.

APY is not a fixed promise. Actual returns depend on reward rate, total LP staked, participation duration, liquidity, and the available reward balance.

## 7. Staking

The initial master-contract staking configuration is:

- minimum stake: 100 QSR;
- nominal APY: 20% in basis-point format;
- lock period: 30 days;
- rewards paid from the staking rewards pool.

A nominal APY does not guarantee a sufficient rewards balance or a particular market value for QSR. Users should evaluate both the contract state and the market risks before staking.

## 8. Referral Program

When enabled, a user can register a referrer. The initial reward is 100 basis points, or 1% of the fee associated with eligible activity by the referred user. Rewards are recorded by the contract and can be claimed through ClaimReferralRewards.

Referral rewards are not guaranteed income. They depend on actual fee-generating activity, the contract state, and the availability of rewards.

## 9. Vesting

The contract supports vesting records with:

- a total allocation;
- a cliff;
- a vesting duration;
- the amount already claimed;
- a start time.

Tokens become claimable progressively after the cliff according to the current implementation. Each vesting schedule and beneficiary entitlement should be published separately before mainnet.

## 10. Lottery

When enabled, a transaction that reaches the ticket price adds the sender to the ticket list. The initial lottery configuration is:

- ticket price: 1 QSR;
- draw interval: 24 hours;
- jackpot share: 50% of the accumulated jackpot.

### Current implementation limitation

The current winner-selection logic uses the timestamp modulo the number of tickets: now() % lotteryTicketCount. This is not cryptographically secure randomness and may be predictable or influenceable. The lottery must not be considered suitable for meaningful monetary prizes until a secure randomness mechanism and an independent audit are in place.

## 11. AI Oracle and Governance

The AI Oracle has a separate oracle address and can receive signals about price, volatility, sentiment, and anomalies. Supported action types include changes to the fee, treasury, anti-whale limits, buyback settings, trading status, emergency pause, and oracle rotation.

Initial governance parameters include:

- AI disabled at initialization;
- full autonomy disabled at initialization;
- AI action cooldown: 6 hours;
- heartbeat timeout: 7 days;
- owner override window: 24 hours;
- veto threshold: 10% of supply in the current configuration.

This does not mean that the contract independently reasons without external infrastructure. The AI Oracle requires a trusted external service or agent that signs and sends messages. Before autonomy is enabled, the project should define the trust model, data sources, monitoring, key rotation, and shutdown procedures.

## 12. Buyback and Burn

The buyback pool accumulates its configured share of fees. When the threshold is reached and the cooldown has elapsed, the master contract executes the current buyback path and updates burn and spending counters.

### Current implementation limitation

In the current QuasarMaster source, the buyback path does not perform an actual swap through QuasarDeFi. It calculates a QSR burn amount using the contract formula, updates accounting, and sends the remaining TON value to the owner. Therefore, claims about a fully automated market buyback should be treated as a target design until an on-chain swap path, tests, and audit confirmation are implemented.

## 13. Security and Risk Disclosure

QUASAR is at a pre-testnet/mainnet stage and should not be used with significant funds until the following work is complete:

- independent audit of the Tact contracts;
- unit, integration, and property-based tests for fees, mint, burn, swaps, staking, claims, and vesting;
- review of owner and AI Oracle permissions;
- review of coins, basis-point arithmetic, and rounding;
- review of TON bounce and reentrancy scenarios;
- secure randomness for the lottery;
- corrected and tested buyback semantics;
- confirmed supply cap and final token allocation;
- published contract addresses and build hashes;
- emergency response procedures and event monitoring.

Key user risks include:

- loss of funds from smart-contract defects;
- QSR and TON price volatility;
- impermanent loss for liquidity providers;
- parameter changes by the owner or AI Oracle;
- an insufficient rewards pool;
- predictable lottery randomness;
- deployment errors or incorrect contract addresses;
- legal and tax restrictions in the user's jurisdiction.

## 14. Roadmap

### Phase 1 — Hardening

- resolve discrepancies between the README and the implementation;
- define and enforce the supply model and token allocation;
- add comprehensive contract tests;
- complete internal and independent security review.

### Phase 2 — Testnet

- deploy the master and DeFi contracts on TON testnet;
- validate TON Connect and deployment configuration;
- run public swap, liquidity, staking, and claim scenarios;
- publish addresses and reproducible build instructions.

### Phase 3 — Audit and Launch

- resolve all critical and high-severity audit findings;
- define owner and oracle governance procedures;
- conduct a controlled launch with limits;
- consider mainnet only after the preceding steps are complete.

### Phase 4 — Further Development

- secure randomness;
- full buyback integration with the DEX;
- expanded analytics and governance;
- possible cross-chain functionality after a separate security review.

## 15. Legal Status and Disclaimer

QSR should not be described as a guaranteed investment product or as a promise of returns. Each user is responsible for evaluating technical, market, legal, and tax risks. Publishing the source code under the MIT License does not guarantee security, returns, network availability, or preservation of funds.

## 16. Conclusion

QUASAR proposes a modular TON DeFi architecture combining QSR, a constant-product pool, farming, staking, referrals, vesting, lottery, and a configurable AI Oracle. Its strength is the breadth of the on-chain model and the availability of an open technical foundation. Its most important pre-launch task is to bring the product claims, token economics, and actual implementation into one verifiable standard, then validate the result through independent security review.
