# QUASAR Acton automation matrix

This document maps the official Acton toolchain to the QUASAR repository. It distinguishes deterministic, repository-safe automation from operations that require a human, a funded wallet, Docker, or a live TON network.

## Automated in GitHub Actions

The reusable `QUASAR CI` checks now include:

- pinned Acton 1.2.1 setup through `ton-blockchain/setup-acton`;
- `acton init --stdlib-only` and `acton doctor`;
- `acton fmt --check`;
- `acton build` and generated Tolk wrappers;
- `acton check --output-format github` annotations;
- `acton check --output-format sarif` uploaded as an artifact;
- native Acton tests and the existing Node/Python gates;
- ABI, dApp, deployment-artifact, TypeScript and action-pin checks.

The scheduled/manual [`acton-quality.yml`](../.github/workflows/acton-quality.yml) workflow additionally exports full LCOV coverage, creates a gas snapshot, and runs diagnostic critical/major mutation testing. Mutation is currently non-blocking because Acton 1.2.1 exits with `Argument list too long (os error 7)` in this repository even with one worker; the workflow preserves its session/report artifact instead of claiming a score.

## Automatic code correction

`acton-autofix.yml` is manual-only. It runs:

```sh
acton fmt
acton check --fix
```

It creates a binary Git patch artifact for human review. It has read-only repository permissions and never pushes, opens a PR, merges, deploys, or changes a wallet. Local equivalents are:

```sh
npm run acton:fmt       # format sources
npm run acton:fix       # format and apply available plain-output lint fixes
npm run acton:check:github
npm run acton:check:sarif
```

SARIF/GitHub output is intentionally separate from `--fix`: Acton only permits automatic fixes with plain lint output.

## Local deterministic engineering commands

| Capability | Command | Policy |
| --- | --- | --- |
| Project resolution | `npm run acton:doctor` | Safe, read-only diagnostics |
| Build | `npm run lint` or `acton build` in `tolk/` | Required before release review |
| Formatting | `npm run acton:fmt:check` | Required CI gate |
| Auto-fix | `npm run acton:fix` | Local/manual review only |
| Machine-readable lint | `npm run acton:check:json` / `npm run acton:check:sarif` | Editor/CI reports |
| Native tests | `npm run test:tolk` | Required deterministic gate |
| Fuzz replay | `ACTON_FUZZ_SEED=42 npm run acton:fuzz:replay` | Reproduce a reported seed |
| Wallet coverage | `npm run coverage:wallet` | 75% blended-score gate |
| Full coverage | `npm run coverage:tolk` | Report-only; current baseline is 45.5% |
| Gas baseline | `npm run acton:gas:snapshot` | Explicitly regenerate and review |
| Gas comparison | `npm run acton:gas:check` | Use only with a reviewed baseline |
| Gas profile | `npm run acton:gas:profile` | Local investigation artifact |
| Mutation | `npm run mutation:changed` | Diagnostic until Acton ARG_MAX blocker is fixed |
| Wrapper generation | `npm run acton:wrappers` | Generated output; never hand-edit |

## Acton capabilities kept manual or opt-in

### Fuzz testing

Acton supports explicit `@test.fuzz` tests, `fuzz.bound`, `fuzz.assume`, reproducible seeds, and `[test.fuzz]` defaults. QUASAR does not add a meaningless fuzz test over storage cells or message structs. New fuzz tests should target scalar economic parameters with documented invariants, bounds, and a fixed reproduction seed after the property is specified.

### Gas profiling and snapshots

The quality workflow creates an uncommitted gas snapshot artifact. A baseline should be committed only after deterministic test selection and a human review of opcode/trace metrics. Use `acton test --baseline-snapshot ... --fail-on-diff` only after that baseline exists.

### Fork testing

Fork tests are supported but are not default CI. Use a pinned historical block and operator-provided `TONCENTER_MAINNET_API_KEY` or `TONCENTER_TESTNET_API_KEY`; never put keys in GitHub files. Fork tests run in the local emulator and do not broadcast, but they depend on remote state and API availability.

### Scripting and local smoke

`tolk/scripts/local-smoke.tolk` and `storage-fee.tolk` are registered under `[scripts]` and must remain emulator-only. The scripts assert `!net.isBroadcasting()`. `--net testnet`, `--net mainnet`, wallet faucet operations, and broadcast are never part of automated CI.

### Localnet, simulator and Studio

Acton localnet requires Docker and is intentionally operator-started. The simulator remains the preferred deterministic environment for contract tests. Studio is an interactive developer tool and is not a headless CI dependency. Runtime state, tokens, `.acton/`, `build/`, and localnet data are ignored.

### Deployment, verification and libraries

Acton deployment is performed through a Tolk script rather than a generic `acton deploy` command. Testnet/mainnet deployment, faucet claims, wallet import/export, verification payments, library publication, and library top-ups require explicit human authorization and are not automated here.

## Reproducibility and safety

Acton is pinned to 1.2.1 in `tolk/Acton.toml` and in GitHub setup steps. Generated artifacts are recreated by commands and are not treated as source. Contract modifications change code hashes and deterministic addresses; this automation does not deploy or publish those addresses.

Official references: [Acton](https://ton-blockchain.github.io/acton/), [CI integration](https://ton-blockchain.github.io/acton/docs/ci-setup), [Acton.toml](https://ton-blockchain.github.io/acton/docs/acton-toml), [testing](https://ton-blockchain.github.io/acton/docs/testing/overview), [coverage](https://ton-blockchain.github.io/acton/docs/testing/code-coverage), [mutation testing](https://ton-blockchain.github.io/acton/docs/testing/mutation-testing/overview), [fuzz testing](https://ton-blockchain.github.io/acton/docs/testing/fuzz-testing), [gas snapshots](https://ton-blockchain.github.io/acton/docs/testing/gas-profiling-with-snapshots), [fork testing](https://ton-blockchain.github.io/acton/docs/testing/fork-testing), [scripting](https://ton-blockchain.github.io/acton/docs/scripting/overview), [deployment](https://ton-blockchain.github.io/acton/docs/deploy), [verification](https://ton-blockchain.github.io/acton/docs/verify), and [libraries](https://ton-blockchain.github.io/acton/docs/libraries).
