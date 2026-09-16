# Contributing to QUASAR

## Before opening a pull request

Install the locked dependencies and run the same checks as CI:

```bash
npm ci
npm run lint
npm test
npm run build
```

Do not commit `.env`, wallet material, deployment state, or generated local
artifacts. Never use a real wallet mnemonic or a mainnet key in tests.

Contract changes should include a regression test for the affected message
serialization or state transition. Deployment scripts must fail closed when
the network or required secrets are missing.

Changes to supply, fees, permissions, randomness, custody, or bounce handling
require an explicit security note in the pull request and an update to
`docs/SECURITY_AUDIT.md`.

Thank you for your interest in contributing to QUASAR! We welcome contributions from the community.

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

```bash
git clone https://github.com/Alexkkkkk/QUASAR.git
cd QUASAR
npm install
```

## Code Style

- Follow FunC best practices for smart contracts
- Use meaningful variable names
- Comment complex logic
- Write tests for new features

## Security

If you discover a security vulnerability, please email security@quasar-ton.dev instead of opening a public issue.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
