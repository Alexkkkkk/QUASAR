# QUASAR v3.0

> A pre-launch TON Jetton and DeFi engineering project with explicit on-chain risk boundaries.

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![Tact](https://img.shields.io/badge/Language-Tact-purple)](https://tact-lang.org)
[![AI](https://img.shields.io/badge/AI-Sovereign-red)](https://github.com/Alexkkkkk/QUASAR)
[![Fee](https://img.shields.io/badge/Fee-0.30%25-green)](https://github.com/Alexkkkkk/QUASAR)
[![DeFi](https://img.shields.io/badge/DeFi-DEX%20%7C%20Farm-orange)](https://github.com/Alexkkkkk/QUASAR)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**QUASAR** is a TON Jetton and DeFi prototype. It includes a CPMM pool, LP farming, staking, vesting, referrals, and an optional AI oracle. The contracts are pre-testnet and must not be treated as audited, production-ready, or a promise of yield.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   QuasarMaster  │◄────│   QuasarDeFi    │     │   QuasarWallet  │
│   (Jetton +    │     │   (DEX + Farm)  │     │   (User Token   │
│    AI Oracle)   │     │                 │     │    Storage)     │
└────────┬────────┘     └────────┬────────┘     └─────────────────┘
         │                       │
         │  5% of remainder ────┘
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
| **AI Oracle** | Optional, bounded controls; disabled by default | N/A |
| **Built-in DEX** | CPMM AMM with 0.3% fee | External only |
| **Yield Farming** | LP auto-stake; rewards claimed explicitly | N/A |
| **Buyback accounting** | Fee bucket (QSR-denominated): a share is burned, the rest is swapped for TON through the DeFi AMM and the proceeds go to the treasury | N/A |
| **Staking Vault** | Earn APY from transaction fees | Rare |
| **Referral System** | 1% lifetime earnings per referral | None |
| **Team Vesting** | Linear 2-year unlock | Rare |
| **Community Veto** | Escrow is not enabled in the current contract | N/A |
| **Owner Control** | Two-step transfer with a 48h timelock (`ProposeOwner` → `AcceptOwner`); no multisig yet | Rare |
| **Anti-Whale** | Max tx 1% applies only to owner `Mint` (minting is stopped after deployment); max-wallet 3% is stored but not enforced in wallet code; the wallet adds a 5s per-wallet transfer cooldown | Rare |
| **0.30% Fee** | Fixed at 0.30% in wallet code; auto-distributed to ecosystem | Manual |

---

## DeFi Integration

### DEX (QuasarDeFi)

Built-in **Constant Product Market Maker (CPMM)** AMM. No external DEX needed.

| Parameter | Value |
|-----------|-------|
| Model | CPMM (x * y = k) |
| Fee | 0.30% per swap (owner-configurable only downwards) |
| Slippage protection | Configurable min output |
| Reentrancy guard | Yes |

#### Swap QSR → TON
```bash
# 1. Send QSR from the user's Jetton wallet to QuasarDeFi.
# 2. Submit the swap using the deposited amount.
SwapToTON { qsrAmount: 1000000000, minTonOut: 50000000 }
```

#### Swap TON → QSR
```bash
# Buy QSR with TON (send TON with message)
SwapToQSR { tonAmount: 50000000, minQsrOut: 900000000 }
```

#### Add Liquidity
```bash
# 1. Deposit QSR to QuasarDeFi from the user's Jetton wallet.
# 2. Send TON with this message; the QSR deposit is consumed atomically.
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
| Reward handling | Claim explicitly; no auto-compound |
| Lock | None for farm |
| APY | ~150% (dynamic) |

```bash
# Claim farm rewards (LP auto-staked on add liquidity)
ClaimFarmRewards {}
```

Unconsumed QSR deposits sent to the DeFi contract can be returned with
`RefundPendingQsr {}`. The refund path remains available while the pool is
paused so a failed or abandoned two-step operation does not strand user funds.

### Fee Distribution (Updated)

```
Every Transfer: 0.30% fee (30 bps, enforced in QuasarWallet)
├─ 50% of the fee is burned immediately (feeBurnShare = 50)
└─ the remaining 50% is split in QuasarMaster.FeeTransfer:
   ├─ 15% of the remainder → Buyback bucket (burns QSR from the reserve; the non-burned share is swapped for TON through the DeFi AMM when configured)
   ├─ 10% of the remainder → Staking Rewards
   ├─ 5% of the remainder → DeFi Pool (defiFeeShareBps = 500, i.e. 2.5% of the fee)
   ├─ up to 1% of the original fee → escrowed referral reward (paid out of the treasury share)
   └─ remainder Treasury (includes the former 15% lottery share, retired with the lottery feature)
```

---

## Staking Vault

Stake QSR and earn **20% APY** paid from transaction fees.

```bash
# 1. Deposit QSR to QuasarMaster from the user's Jetton wallet.
# 2. Consume that deposit with this message.
Stake { amount: 100000000000 }

# Claim rewards anytime
ClaimRewards {}

# Unstake after lock period
Unstake { amount: 50000000000 }
```

- **Min Stake**: 100 QSR
- **Lock Period**: 30 days; a top-up restarts the lock, it never shortens it
- **APY**: 20% (adjustable by AI)
- **Rewards**: Paid instantly from fee pool

The master does not accept a bare `Stake` message as a deposit. QSR must be
sent to the master wallet first; this prevents staking unowned tokens.

---

## Referral System

Invite friends and accrue **up to 1% of the eligible fee** generated by referred users.

```bash
# Register with a referrer
RegisterReferral { referrer: EQ... }

# Claim accumulated rewards
ClaimReferralRewards {}

Rewards are escrowed in the master contract and must be claimed explicitly.
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

### Safeguards (as implemented)
- **Community Veto**: removed from the deployed interface (F-25); no dead receiver or misleading governance path remains
- **Owner Override**: 24h window for every logged AI action; the current implementation restores the full pre-action snapshot for reversible AI controls
- **Dead Man's Switch**: `Claim AI Control` lets the owner reclaim control if the AI is silent 7 days
- **AI cooldown**: `aiActionCooldown` (6h) gates every administrative AI action in every mode; market signals are logged but not rate-limited

---

## Web3 UI

Connect any TON wallet via **TON Connect 2.0**:

- Swap QSR ↔ TON with slippage protection
- Add/remove liquidity
- Stake/unstake QSR
- Claim farming rewards
- Real-time balance display

### Contract Addresses (auto-loaded)

The UI loads addresses from `website/deployment.json` after deployment:

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

Create `.env` and choose the network explicitly:

```bash
WALLET_MNEMONIC=word1 word2 ... word24
TON_NETWORK=mainnet          # or testnet
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

The unified deployment mints the configured initial allocation and immediately
locks minting. Any alternative allocation must be reviewed against the hard
1,000,000,000 QSR cap before deployment.

### 4. Serve Website

```bash
npm run website      # Serves website/ on localhost
```

---

## Smart Contracts

| Contract | File | Description |
|----------|------|-------------|
| `QuasarMaster` | `contracts/quasar.tact` | Jetton minter, fee distributor, staking, AI oracle |
| `QuasarDeFi` | `contracts/quasar_defi.tact` | CPMM DEX, liquidity pool, yield farming |
| `QuasarWallet` | `contracts/quasar.tact` | Individual wallet with fee deduction |

---

## Tokenomics

| Parameter | Value |
|-----------|-------|
| Maximum Supply | 1,000,000,000 QSR |
| Decimals | 9 |
| Symbol | QSR |
| Fee | 0.30% |
| Burn | 50% of fees |
| DeFi Pool | 5% of fees |
| Staking APY | 20% |
| Farm APY | ~150% |
| Referral | 1% lifetime |
| Buyback Threshold | 10 QSR (QSR-denominated pool) |

---

## Roadmap

> Checked against the current repository. A checked item means the source implementation exists; it does not mean the feature has been audited, deployed to mainnet, or approved for production funds.

- [x] Tact smart contracts (Master + DeFi) implemented
- [x] Web3 UI with TON Connect implemented
- [x] CPMM DEX and LP farming implemented in source
- [x] Enforce the 1,000,000,000 QSR maximum supply in the master contract
- [x] Reconcile core tokenomics documentation with the on-chain implementation
- [ ] TON testnet deployment and public scenario testing
- [ ] Independent security audit and remediation
- [ ] Production-ready buyback swap
- [ ] Mainnet launch with published addresses and build hashes
- [ ] Cross-chain bridges (future)
- [ ] Production AI agent deployment (future)

---

## License

[MIT](LICENSE) © QUASAR Team

## Links

- Whitepaper: [WHITEPAPER.md](WHITEPAPER.md)
- Website: [quasar-ton.netlify.app](https://quasar-ton.netlify.app)
- Telegram: [@quasar_ton](https://t.me/quasar_ton)
- Twitter: [@quasar_ton](https://twitter.com/quasar_ton)

---

*The future of tokens is autonomous. The future of DeFi is built-in.*
