# QUASAR

> The Ultimate Jetton. AI Sovereignty | Staking | Referral | Vesting | Lottery | Auto-Buyback.

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![Tact](https://img.shields.io/badge/Language-Tact-purple)](https://tact-lang.org)
[![AI](https://img.shields.io/badge/AI-Sovereign-red)](https://github.com/Alexkkkkk/QUASAR)
[![Fee](https://img.shields.io/badge/Fee-0.30%25-green)](https://github.com/Alexkkkkk/QUASAR)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**QUASAR** is the most advanced Jetton ever built. A self-governing AI entity manages the token economy while holders earn through staking, referrals, and lotteries. Every transaction makes QSR scarcer through auto-burn and buyback mechanisms.

## Feature Matrix

| Feature | QUASAR | Others |
|---------|--------|--------|
| **AI Sovereignty** | Full autonomous control | None |
| **Auto-Buyback & Burn** | Contract buys & burns automatically | None |
| **Staking Vault** | Earn APY from transaction fees | Rare |
| **Referral System** | 1% lifetime earnings per referral | None |
| **Team Vesting** | Linear 2-year unlock | Rare |
| **Transaction Lottery** | Every tx = lottery ticket | None |
| **Community Veto** | Holders reject AI decisions | None |
| **Anti-Whale** | Max tx 1%, max wallet 3% | Rare |
| **0.30% Fee** | Auto-distributed to ecosystem | Manual |

## Fee Distribution

```
Every Transfer: 0.30% fee
├─ 50% Burned forever (deflationary)
├─ 15% Buyback Pool (auto market buy + burn)
├─ 15% Lottery Jackpot (daily draw)
├─ 10% Staking Rewards (paid to stakers)
├─ 1% Referral Rewards (to referrer)
└─ 9% Treasury (development)
```

## Staking Vault

Stake QSR and earn **20% APY** paid from transaction fees.

```bash
# Stake minimum 100 QSR for 30 days
Stake { amount: 100000000000 }

# Claim rewards anytime
ClaimRewards {}

# Unstake after lock period
Unstake { amount: 50000000000 }
```

- **Min Stake**: 100 QSR
- **Lock Period**: 30 days
- **APY**: 20% (adjustable by AI)
- **Rewards**: Paid instantly from fee pool

## Referral System

Invite friends and earn **1%** of every transaction they make — forever.

```bash
# Register with a referrer
RegisterReferral { referrer: EQ... }

# Claim accumulated rewards
ClaimReferralRewards {}
```

## Team Vesting

Team tokens unlock linearly over 2 years with a cliff.

```bash
# Owner adds vesting schedule
AddVesting { beneficiary: EQ..., totalAmount: 100000000000, cliff: 7776000, duration: 63072000 }

# Beneficiary claims unlocked tokens
ClaimVested {}
```

## Transaction Lottery

Every transaction is a lottery ticket. Daily draw sends jackpot to a random holder.

```bash
# Anyone can trigger draw after interval
TriggerLottery { queryId: 0 }
```

- **Ticket Price**: 1 QSR minimum tx
- **Draw Interval**: 24 hours
- **Jackpot**: 50% of accumulated pool
- **Winner**: Randomly selected from all transactions

## AI Sovereignty

The AI Oracle has sovereign control with democratic safeguards:

| Control | Cooldown | Veto |
|---------|----------|------|
| Fee adjustment | 6h | Yes |
| Treasury change | 6h | Yes |
| Anti-whale limits | 6h | Yes |
| Buyback settings | 6h | Yes |
| Trading toggle | 6h | Yes |
| Emergency pause | Instant | No |
| Oracle rotation | 6h | Yes |

### Safeguards
- **Community Veto**: 10% supply stake to cancel AI decision
- **Owner Override**: 24h window to reverse
- **Dead Man's Switch**: Owner reclaims control if AI silent 7 days

## Quick Start

```bash
git clone https://github.com/Alexkkkkk/QUASAR.git
cd QUASAR
npm install
npm run build
npm run deploy
```

## Tokenomics

| Parameter | Value |
|-----------|-------|
| Total Supply | 1,000,000,000 QSR |
| Decimals | 9 |
| Symbol | QSR |
| Fee | 0.30% |
| Burn | 50% of fees |
| Staking APY | 20% |
| Referral | 1% lifetime |
| Lottery | Daily |
| Buyback Threshold | 10 TON |

## Smart Contracts

| Contract | Description |
|----------|-------------|
| `QuasarMaster` | Minter, fee distributor, staking, lottery, AI oracle |
| `QuasarWallet` | Individual wallet with fee deduction |

## Roadmap

- [x] All smart contracts
- [x] Website
- [ ] Testnet deployment
- [ ] Security audit
- [ ] Mainnet launch
- [ ] DEX listings
- [ ] AI agent deployment

## License

[MIT](LICENSE) © QUASAR Team

## Links

- Website: [quasar-ton.netlify.app](https://quasar-ton.netlify.app)
- Telegram: [@quasar_ton](https://t.me/quasar_ton)
- Twitter: [@quasar_ton](https://twitter.com/quasar_ton)

---

*The future of tokens is autonomous.*
