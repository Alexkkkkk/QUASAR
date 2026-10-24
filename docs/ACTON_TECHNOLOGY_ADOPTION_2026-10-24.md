# Acton technology adoption — 2026-10-24

QUASAR uses Acton 1.2.1 as the pinned Tolk toolchain in `tolk/Acton.toml`. This change adopts the applicable local, deterministic parts of the official Acton workflow without enabling an accidental live-network broadcast.

## Enabled in the repository

- Reproducible fuzz defaults are configured in `[test.fuzz]` with 64 accepted cases, a bounded rejection budget, and seed `20261024`.
- `tolk/tests/quasar-defi.test.tolk` contains an annotated fuzz/property test for the real `estimateLpOut` getter. It bounds generated TON/QSR amounts and checks non-negative, symmetric empty-pool behavior.
- TypeScript wrapper output is configured at `build/synchronized/wrappers-ts`; `npm run wrappers:ts` regenerates wrappers from the Tolk ABI.
- `npm run test:tolk:coverage` produces an LCOV report.
- `npm run test:tolk:gas` writes a gas snapshot; `npm run test:tolk:gas:check` compares against that baseline with `--fail-on-diff`.
- `npm run test:tolk:traces` saves transaction traces for Acton Test UI and offline inspection.
- The existing deployment preflight continues to validate build artifacts, ABI, BOC, source hashes, generated wrappers, dApp ABI and broadcast guards.

## Commands

```bash
export PATH=/tmp/acton-1.2.1:$PATH
npm run test:tolk
npm run test:tolk:fuzz
npm run test:tolk:coverage
npm run test:tolk:gas
npm run test:tolk:gas:check
npm run test:tolk:traces
npm run wrappers:ts
npm run deployment:preflight
```

The fuzz, coverage, gas, trace and wrapper commands are local/offline by default. Real network operations require an explicit Acton `--net` invocation and configured wallet credentials; no such credentials or broadcast path is added by this change.

## Deliberately not automated

Fork testing requires a selected and pinned network block plus API credentials, so it remains an operator-invoked release rehearsal. Deployment and verification require an approved testnet address and explicit human authorization. Mainnet actions are not part of CI. Mutation testing is available through Acton, but the runner must be invoked per contract and its reports must be triaged rather than converted into a false pass.

## References

[1]: https://ton-blockchain.github.io/acton/ "Acton unified TON toolchain"
[2]: https://ton-blockchain.github.io/acton/docs/acton-toml "Acton.toml reference"
[3]: https://ton-blockchain.github.io/acton/docs/testing/overview "Acton testing overview"
[4]: https://ton-blockchain.github.io/acton/docs/testing/fuzz-testing "Acton fuzz testing"
[5]: https://ton-blockchain.github.io/acton/docs/dapps "Acton dApp development and TypeScript wrappers"
[6]: https://ton-blockchain.github.io/acton/docs/scripting/blockchain-interaction "Acton blockchain scripting and broadcast modes"
