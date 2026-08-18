# QUASAR

> The Ultimate AI-Powered Jetton on TON. 0.30% fee. Auto-burn. Anti-whale. Unstoppable.

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![Tact](https://img.shields.io/badge/Language-Tact-purple)](https://tact-lang.org)
[![AI](https://img.shields.io/badge/AI-Integrated-red)](https://github.com/Alexkkkkk/QUASAR)
[![Fee](https://img.shields.io/badge/Fee-0.30%25-green)](https://github.com/Alexkkkkk/QUASAR)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**QUASAR** is the most advanced Jetton on TON. Every transaction fuels the ecosystem through a **0.30% fee** that auto-burns and funds the treasury. AI Oracle monitors the market 24/7, adjusting parameters in real-time to protect holders and maximize value.

## Why QUASAR is the Best

| Feature | QUASAR | Other Tokens |
|---------|--------|-------------|
| **Transaction Fee** | 0.30% auto-distributed | 0% or manual |
| **Auto-Burn** | 50% of fee burned forever | Rare |
| **Auto-Buyback** | Contract buys & burns QSR automatically | None |
| **AI Oracle** | Real-time fee adjustment | None |
| **Anti-Whale** | Max tx 1%, max wallet 3% | Rare |
| **Anti-Bot** | 15s cooldown | Rare |
| **Emergency Pause** | AI + Owner controlled | Manual only |
| **Type Safety** | Tact compiled | FunC mostly |

## Fee Mechanics

```
Every Transfer: 0.30% fee
├─ 50% Burned forever (deflationary)
├─ 30% Treasury (development & marketing)
└─ 20% Buyback Pool (auto-buyback & burn)
```

**Example:** Send 1000 QSR → Recipient gets 997 QSR, 3 QSR fee (1.5 burned, 0.9 treasury, 0.6 buyback pool)

## Auto-Buyback & Burn

QUASAR automatically accumulates fees in a **Buyback Pool**. When the pool reaches the threshold (10 TON), the contract executes an automatic buyback:

1. **Accumulation**: 20% of every fee goes to the buyback pool
2. **Trigger**: Anyone can trigger buyback when pool ≥ 10 TON (1h cooldown)
3. **Execution**: Contract "buys" QSR from the market and burns it
4. **Deflation**: Total supply decreases → price pressure increases

### Buyback Stats (on-chain)
- Total buybacks executed
- Total QSR burned via buyback
- Total TON spent on buybacks
- Current pool balance

### AI-Triggered Buyback
AI Oracle automatically triggers buyback during price dips (sentiment < -30), creating automatic price support.

## AI Capabilities

| Signal | AI Response |
|--------|-------------|
| High volatility | Fee → 0.50%, burn → 70% |
| Bull market | Fee → 0.20%, burn → 40% |
| Bear market | Mint paused, burn → 80% |
| Critical anomaly | Emergency pause, fee → 1.00% |
| Whale detected | Auto-adjust max wallet limits |

## Security Features

- **Anti-Whale**: Max 1% of supply per transaction, 3% per wallet
- **Anti-Bot**: 15-second cooldown between transactions
- **Trading Toggle**: Owner can pause trading in emergencies
- **Emergency Pause**: AI can instantly freeze all operations
- **Fee Cap**: Maximum fee 1.00%, adjustable only by AI/Owner

## Smart Contracts

| Contract | File | Description |
|----------|------|-------------|
| QuasarMaster | `contracts/quasar.tact` | AI-powered minter with fee distribution |
| QuasarWallet | `contracts/quasar.tact` | Smart wallet with auto-fee deduction |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/Alexkkkkk/QUASAR.git
cd QUASAR
npm install
```

### Build

```bash
npm run build
```

### Deploy

```bash
cp .env.example .env
# Edit .env with your wallet mnemonic

npm run deploy
```

### Configure Fee & AI

```bash
# Set treasury address
# Message: SetTreasury { treasury: Address }

# Configure fee (0.30% default)
# Message: SetFeeConfig { feeBps: 30, burnShare: 50, ... }

# Enable AI Oracle
# Message: AISetOracle { oracleAddress: Address }
```

## Project Structure

```
QUASAR/
├── contracts/
│   └── quasar.tact          # Tact contracts with fee + AI
├── scripts/
│   ├── build.sh             # Build script
│   └── deploy.ts            # Deployment script
├── build/                   # Compiled contracts
├── website/                 # Cosmic landing page
├── assets/
│   └── logo.png             # 256x256 token logo
├── docs/                    # Documentation
├── tact.config.json         # Tact compiler config
└── package.json             # Dependencies
```

## Tokenomics

| Parameter | Value |
|-----------|-------|
| Total Supply | 1,000,000,000 QSR |
| Decimals | 9 |
| Symbol | QSR |
| Blockchain | TON |
| Standard | Jetton (TEP-74) |
| Transaction Fee | 0.30% |
| Burn Rate | 50% of fees |
| Treasury | 30% of fees |
| Buyback Pool | 20% of fees |
| Buyback Threshold | 10 TON |
| Buyback Cooldown | 1 hour |
| Max Transaction | 1% of supply |
| Max Wallet | 3% of supply |
| Cooldown | 15 seconds |

## Fee Distribution Flow

```
User sends 1000 QSR
        │
        ▼
┌─────────────────┐
│  Fee: 3 QSR     │  ← 0.30%
│  Send: 997 QSR  │
└─────────────────┘
        │
   ┌────┴────┐
   ▼         ▼
Burn: 1.5  Treasury: 1.5
(deflation)  (development)
```

## AI Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  AI Agent   │────▶│  AI Oracle   │────▶│   QUASAR    │
│  (Off-chain)│     │  (Contract)  │     │  (Master)   │
│  ML Models  │     │  Validates   │     │  Executes   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  Price Feeds │     │   Wallets   │
                    │  Analytics   │     │   Holders   │
                    │  Sentiment   │     │   Burn/Tax  │
                    └──────────────┘     └─────────────┘
```

## Roadmap

- [x] Smart contracts (Tact + AI + Fee + Buyback)
- [x] Website launch
- [ ] AI Oracle testnet deployment
- [ ] Security audit
- [ ] Mainnet launch
- [ ] DEX integration (DeDust, STON.fi)
- [ ] AI governance DAO
- [ ] Cross-chain bridges

## Contributing

Read our [Contributing Guide](docs/CONTRIBUTING.md).

## License

[MIT](LICENSE) © QUASAR Team

## Links

- Website: [quasar-ton.netlify.app](https://quasar-ton.netlify.app)
- Telegram: [@quasar_ton](https://t.me/quasar_ton)
- Twitter: [@quasar_ton](https://twitter.com/quasar_ton)
- Tact Docs: [tact-lang.org](https://tact-lang.org)

---

*Powered by TON Blockchain, Tact Language, and AI. Every transaction makes QSR scarcer.*
