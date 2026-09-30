# Tact → Tolk migration decision

Date: 2026-09-29  
Decision: **NO-GO for production/testnet migration in this change set**

TON Docs now recommends Tolk for new smart-contract projects and marks the
Tact page as deprecated. QUASAR is already implemented and tested in Tact, so a
mechanical syntax conversion would be unsafe: the migration must preserve
TEP-74/64/89 wire messages, generated ABI, storage layout, code hash, gas
profile and bounce behavior.

The current repository keeps the existing Tact path reproducible:

- `.nvmrc` pins Node 22; CI validates Node 24, and `package.json` supports both LTS lines.
- `package-lock.json` pins the resolved compiler/toolchain graph.
- ABI snapshots, dApp opcode checks, security checks and the sandbox test suite are
  release gates.

No Tolk compiler is added and no contract source is rewritten here. That is
intentional: there is no independent equivalence proof or migration artifact
that would justify changing deployed addresses. A future migration must build
Tolk variants beside the Tact reference and compare:

1. all TEP-74/64/89 messages and getters at the BOC level;
2. storage serialization and initialization data;
3. code hash and deterministic addresses;
4. gas and action traces for success, bounce and rejection paths;
5. the complete existing test and security suite.

Until every comparison is green and a migration plan records the address/code
hash consequences, Tact remains the supported compiler path for this
pre-testnet repository. This is a tooling decision, not an independent audit
or a mainnet-readiness claim.