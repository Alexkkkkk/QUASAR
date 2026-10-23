# Contributing to QUASAR

## Before opening a pull request

Install the pinned Acton `1.2.1` toolchain. Then run the same Tolk checks as CI:

```bash
cd tolk
acton init --stdlib-only
acton doctor
acton fmt --check
acton check --output-format github
acton build
acton wrapper --all --output-dir build/synchronized/wrappers
acton test
```

`npm run build` invokes `scripts/sync_acton.py`. It builds an isolated Tolk
project, generates wrappers, runs the ABI and wrapper gates, Acton tests and
safe local scripts, then atomically publishes `tolk/build/synchronized/`.
`python3 scripts/sync_acton.py --check` verifies a published generation without
rebuilding it.

Do not commit `.env`, wallet material, deployment state, generated local
artifacts or network addresses. Never use a real wallet mnemonic or a mainnet
key in tests. Deployment, signing, broadcast and all on-chain actions remain
outside the automated workflow.

A Tolk contract change must include a regression test for the affected wire
format or state transition. Changes to supply, fees, permissions, custody,
bounce handling or storage layout require a security note in the pull request
and an update to `docs/SECURITY_AUDIT.md`.

## How to contribute

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change with its tests.
4. Run the required checks above.
5. Push the branch and open a pull request in Russian.

## Security

Report a security vulnerability through the repository's private security
channel rather than a public issue. QUASAR is a pre-launch prototype and is not
independently audited.
