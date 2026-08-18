# QUASAR v3.0

> The Ultimate Jetton + DeFi Ecosystem. AI Sovereignty | DEX | Yield Farming | Staking | Referral | Vesting | Lottery | Auto-Buyback.

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![Tact](https://img.shields.io/badge/Language-Tact-purple)](https://tact-lang.org)
[![AI](https://img.shields.io/badge/AI-Sovereign-red)](https://github.com/Alexkkkkk/QUASAR)
[![Fee](https://img.shields.io/badge/Fee-0.30%25-green)](https://github.com/Alexkkkkk/QUASAR)
[![DeFi](https://img.shields.io/badge/DeFi-DEX%20%7C%20Farm-orange)](https://github.com/Alexkkkkk/QUASAR)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**QUASAR** is the most advanced Jetton + DeFi ecosystem on TON. A self-governing AI entity manages tokenomics while holders trade on a built-in DEX, farm yields, and earn through staking, referrals, and lotteries. Every transaction makes QSR scarcer through auto-burn and buyback — and now feeds the DeFi liquidity pool.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   QuasarMaster  │◄────│   QuasarDeFi    │     │   QuasarWallet  │
│   (Jetton +    │     │   (DEX + Farm)  │     │   (User Token   │
│    AI Oracle)   │     │                 │     │    Storage)     │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │  5% fees ─────────────┘
         │  Jetton transfers
         │
    ┌────┴────┐
    │  TON    │
    │ Connect │
    │  Web3   │
    └─────────┘
```

## Feature Matrix

| Feature | QUASAR | Others |
|---------|--------|--------|
| **AI Sovereignty** | Full autonomous control | None |
| **Built-in DEX** | CPMM AMM with 0.3% fee | External only |
| **Yield Farming** | Auto-compound LP staking | Rare |
| **Auto-Buyback & Burn** | Contract buys & burns automatically | None |
| **Staking Vault** | Earn APY from transaction fees | Rare |
| **Referral System** | 1% lifetime earnings per referral | None |
| **Team Vesting** | Linear 2-year unlock | Rare |
| **Transaction Lottery** | Every tx = lottery ticket | None |
| **Community Veto** | Holders reject AI decisions | None |
| **Anti-Whale** | Max tx 1%, max wallet 3% | Rare |
| **0.30% Fee** | Auto-distributed to ecosystem | Manual |

---

## DeFi Integration

### DEX (QuasarDeFi)

Built-in **Constant Product Market Maker (CPMM)** AMM. No external DEX needed.

| Parameter | Value |
|-----------|-------|
| Model | CPMM (x * y = k) |
| Fee | 0.30% per swap |
| Slippage protection | Configurable min output |
| Reentrancy guard | Yes |

#### Swap QSR → TON
```bash
# Sell QSR for TON
SwapToTON { qsrAmount: 1000000000, minTonOut: 50000000 }
```

#### Swap TON → QSR
```bash
# Buy QSR with TON (send TON with message)
SwapToQSR { tonAmount: 50000000, minQsrOut: 900000000 }
```

#### Add Liquidity
```bash
# Provide both TON and QSR, receive LP tokens
AddLiquidity { tonAmount: 1000000000, qsrAmount: 100000000000 }
```

#### Remove Liquidity
```bash
# Burn LP tokens, receive proportional TON + QSR
RemoveLiquidity { lpAmount: 50000000000 }
```

### Liquidity Pools

- **LP Token**: Proportional share of TON + QSR reserves
- **First Deposit**: LP = sqrt(ton * qsr)
- **Subsequent**: LP proportional to existing reserves
- **Auto-stake**: LP tokens automatically staked in farm

### Yield Farming

Stake LP tokens and earn **~0.1 QSR/sec** rewards.

| Parameter | Value |
|-----------|-------|
| Reward rate | 0.1 QSR/sec (configurable) |
| Auto-compound | Yes (claim + restake) |
| Lock | None for farm |
| APY | ~150% (dynamic) |

```bash
# Claim farm rewards (LP auto-staked on add liquidity)
ClaimFarmRewards {}
```

### Fee Distribution (Updated)

```
Every Transfer: 0.30% fee
├─ 50% Burned forever (deflationary)
├─ 15% Buyback Pool (auto market buy + burn)
├─ 15% Lottery Jackpot (daily draw)
├─ 10% Staking Rewards (paid to stakers)
├─ 5% DeFi Pool (feeds QuasarDeFi liquidity)
├─ 1% Referral Rewards (to referrer)
└─ 4% Treasury (development)
```

---

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

---

## Referral System

Invite friends and earn **1%** of every transaction they make — forever.

```bash
# Register with a referrer
RegisterReferral { referrer: EQ... }

# Claim accumulated rewards
ClaimReferralRewards {}
```

---

## Team Vesting

Team tokens unlock linearly over 2 years with a cliff.

```bash
# Owner adds vesting schedule
AddVesting { beneficiary: EQ..., totalAmount: 100000000000, cliff: 7776000, duration: 63072000 }

# Beneficiary claims unlocked tokens
ClaimVested {}
```

---

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

---

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

---

## Web3 UI

Connect any TON wallet via **TON Connect 2.0**:

- Swap QSR ↔ TON with slippage protection
- Add/remove liquidity
- Stake/unstake QSR
- Claim farming rewards
- Real-time balance display

### Contract Addresses (auto-loaded)

The UI loads addresses from `build/deployment.json` after deployment:

```json
{
  "contracts": {
    "master": { "address": "EQ..." },
    "defi": { "address": "EQ..." }
  }
}
```

---

## Quick Start

### 1. Install & Build

```bash
git clone https://github.com/Alexkkkkk/QUASAR.git
cd QUASAR
npm install
npm run build        # Builds both quasar + quasar_defi
```

### 2. Configure Environment

Create `.env`:

```bash
WALLET_MNEMONIC=word1 word2 ... word24
TON_NETWORK=testnet          # or mainnet
TONCENTER_API_KEY=your_key   # optional
AI_ORACLE_ADDRESS=EQ...      # optional
```

### 3. Deploy

```bash
# Deploy QuasarMaster + QuasarDeFi + auto-link
npm run deploy

# Or deploy DeFi separately (if master already deployed)
npm run deploy:defi
```

### 4. Serve Website

```bash
npm run website      # Serves website/ on localhost
```

---

## Smart Contracts

| Contract | File | Description |
|----------|------|-------------|
| `QuasarMaster` | `contracts/quasar.tact` | Jetton minter, fee distributor, staking, lottery, AI oracle |
| `QuasarDeFi` | `contracts/quasar_defi.tact` | CPMM DEX, liquidity pool, yield farming |
| `QuasarWallet` | `contracts/quasar.tact` | Individual wallet with fee deduction |

---

## Tokenomics

| Parameter | Value |
|-----------|-------|
| Total Supply | 1,000,000,000 QSR |
| Decimals | 9 |
| Symbol | QSR |
| Fee | 0.30% |
| Burn | 50% of fees |
| DeFi Pool | 5% of fees |
| Staking APY | 20% |
| Farm APY | ~150% |
| Referral | 1% lifetime |
| Lottery | Daily |
| Buyback Threshold | 10 TON |

---

## Roadmap

- [x] All smart contracts (Master + DeFi)
- [x] Web3 UI with TON Connect
- [x] Built-in DEX + Yield Farming
- [ ] Testnet deployment
- [ ] Security audit
- [ ] Mainnet launch
- [ ] Cross-chain bridges
- [ ] AI agent live deployment

---

## License

[MIT](LICENSE) © QUASAR Team

## Links

- Website: [quasar-ton.netlify.app](https://quasar-ton.netlify.app)
- Telegram: [@quasar_ton](https://t.me/quasar_ton)
- Twitter: [@quasar_ton](https://twitter.com/quasar_ton)

---

*The future of tokens is autonomous. The future of DeFi is built-in.*
