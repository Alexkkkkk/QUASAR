# QUASAR Tolk 1.1 quality-gate reference

This directory preserves user-supplied Tolk 1.4/Acton quality-gate material for review only.

It is intentionally **not** wired into the active build. The canonical repository currently uses Acton 1.2.1, `tolk/Acton.toml`, the existing multi-contract manifest, and the tested `@acton/emulation/*`/`@acton/testing/expect` API. The supplied files use a different single-contract manifest, a different package version, and test helpers that have not been compiled against the pinned toolchain.

The proposed 95% coverage threshold is also not enabled here. The current measured coverage is materially below that threshold and must be raised with targeted tests before it can become a release gate. Mutation testing must produce a meaningful killed/survived result; compile-error mutants alone are not evidence of mutation adequacy.

Before any part of this reference becomes active, require:

1. a reviewed port to the current contract/storage architecture;
2. Acton 1.2.1 compilation and wrapper generation;
3. ABI diff review for every changed message/getter/StateInit;
4. tests for migration, TEP-74, bounce, replay, authorization and max-signer invariants;
5. coverage and mutation reports with explicit, non-zero meaningful thresholds;
6. testnet rehearsal and independent TON/Tolk audit.
