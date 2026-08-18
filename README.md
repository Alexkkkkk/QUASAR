# QUASAR

> The brightest Jetton in the TON universe.

[![TON](https://img.shields.io/badge/Blockchain-TON-blue)](https://ton.org)
[![Tact](https://img.shields.io/badge/Language-Tact-purple)](https://tact-lang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**QUASAR** is a next-generation Jetton (token standard on TON) inspired by the brightest objects in the universe. Built on The Open Network (TON) using **Tact** — a modern, type-safe smart contract language.

## Why Tact?

- **Type Safety**: Static typing prevents runtime errors
- **Modern Syntax**: Familiar to TypeScript/JavaScript developers
- **Built-in Security**: Protected arithmetic, message validation
- **Developer Experience**: Clear error messages, IDE support
- **Gas Efficiency**: Optimized compilation to FunC

## Features

- **Cosmic Tokenomics**: Deflationary mechanics with burn protocols
- **High-Speed Transactions**: Leveraging TON's sub-second finality
- **Low Fees**: Ultra-low transaction costs on TON
- **Community Driven**: Decentralized governance ready
- **Secure**: Type-safe Tact smart contracts

## Smart Contracts

| Contract | File | Description |
|----------|------|-------------|
| QuasarMaster | `contracts/quasar.tact` | Jetton Minter (token issuance) |
| QuasarWallet | `contracts/quasar.tact` | Jetton Wallet (token storage) |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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
# Configure .env file first
cp .env.example .env
# Edit .env with your wallet mnemonic

npm run deploy
```

## Project Structure

```
QUASAR/
├── contracts/
│   └── quasar.tact          # Tact smart contracts
├── scripts/
│   ├── build.sh             # Build script
│   └── deploy.ts            # Deployment script
├── build/                   # Compiled contracts
├── website/                 # Landing page
├── assets/                  # Logo and media
├── docs/                    # Documentation
├── tact.config.json         # Tact compiler config
├── tsconfig.json            # TypeScript config
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

## Roadmap

- [x] Smart contract development (Tact)
- [x] Website launch
- [ ] Testnet deployment
- [ ] Security audit
- [ ] Mainnet launch
- [ ] DEX listings (DeDust, STON.fi)
- [ ] Community governance

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) first.

## License

[MIT](LICENSE) © QUASAR Team

## Links

- Website: [quasar-ton.netlify.app](https://quasar-ton.netlify.app)
- Telegram: [@quasar_ton](https://t.me/quasar_ton)
- Twitter: [@quasar_ton](https://twitter.com/quasar_ton)
- Tact Docs: [tact-lang.org](https://tact-lang.org)

---

*Powered by TON Blockchain & Tact Language*
