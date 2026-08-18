# QUASAR

> The brightest AI-powered Jetton in the TON universe.

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![Tact](https://img.shields.io/badge/Language-Tact-purple)](https://tact-lang.org)
[![AI](https://img.shields.io/badge/AI-Integrated-red)](https://github.com/Alexkkkkk/QUASAR)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**QUASAR** is the first AI-integrated Jetton on TON. Built with **Tact** and powered by an on-chain AI Oracle, QUASAR autonomously manages tokenomics, responds to market conditions, and protects holders from anomalies.

## Why QUASAR?

- **AI-Driven Tokenomics**: Autonomous burn, rebalance, and supply management
- **Anomaly Detection**: AI monitors blockchain activity and triggers emergency protocols
- **Predictive Governance**: AI proposals auto-execute above confidence threshold
- **Type-Safe**: Built with Tact for maximum security
- **Lightning Fast**: Sub-second finality on TON

## AI Capabilities

| Feature | Description |
|---------|-------------|
| `AIRebalance` | AI adjusts burn rate and supply cap based on market data |
| `AIPriceSignal` | Reacts to price volatility, sentiment, and momentum |
| `AIAnomalyAlert` | Emergency pause on critical threats (whales, dumps, hacks) |
| `AIGovernanceProposal` | Auto-executes high-confidence AI recommendations |
| `Price History` | On-chain storage for ML model training |

## Smart Contracts

| Contract | File | Description |
|----------|------|-------------|
| QuasarMaster | `contracts/quasar.tact` | AI-powered Jetton Minter |
| QuasarWallet | `contracts/quasar.tact` | Jetton Wallet with AI notifications |

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
# Edit .env with your wallet mnemonic and optional AI oracle

npm run deploy
```

### Setup AI Oracle

```bash
# Set AI oracle address in .env
AI_ORACLE_ADDRESS=EQAiOracleAddress...

# Or send manually after deploy
# Message: AISetOracle { oracleAddress: Address }
```

## Project Structure

```
QUASAR/
├── contracts/
│   └── quasar.tact          # Tact smart contracts with AI logic
├── scripts/
│   ├── build.sh             # Build script
│   └── deploy.ts            # Deployment with AI setup
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
| Default Burn | 1% |
| AI Mode | Configurable |

## AI Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  AI Agent   │────▶│  AI Oracle   │────▶│   QUASAR    │
│  (Off-chain)│     │  (Contract)  │     │  (Master)   │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  Price Feeds │     │   Wallets   │
                    │  Analytics   │     │   Holders   │
                    └──────────────┘     └─────────────┘
```

## Roadmap

- [x] Smart contract development (Tact + AI)
- [x] Website launch
- [ ] AI Oracle testnet deployment
- [ ] Security audit
- [ ] Mainnet launch
- [ ] DEX listings (DeDust, STON.fi)
- [ ] AI governance DAO
- [ ] Cross-chain bridges

## Contributing

Contributions are welcome! Read our [Contributing Guide](docs/CONTRIBUTING.md).

## License

[MIT](LICENSE) © QUASAR Team

## Links

- Website: [quasar-ton.netlify.app](https://quasar-ton.netlify.app)
- Telegram: [@quasar_ton](https://t.me/quasar_ton)
- Twitter: [@quasar_ton](https://twitter.com/quasar_ton)
- Tact Docs: [tact-lang.org](https://tact-lang.org)

---

*Powered by TON Blockchain, Tact Language, and AI*
