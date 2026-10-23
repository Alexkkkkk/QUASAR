# ABI snapshots

The JSON files in this directory are canonical public-interface snapshots
produced from the Acton/Tolk compiler ABI. They record each contract's typed
incoming messages, explicit 32-bit opcodes, wire field shapes, getters, and
method IDs.

They are deliberately independent of legacy Tact artifacts. Passing this gate
proves interface consistency for the current Tolk source; it does not prove
storage, code-hash, deterministic-address, gas, or action-trace compatibility
with prior Tact deployments.

After an intentional public ABI change, regenerate and review the snapshot:

```sh
npm run abi:update
npm run abi:verify
npm run abi:dapp
```

The synchronized build contains one shared `QuasarWallet.boc` consumed by both
Master and DeFi. CI verifies Tolk wrappers against these snapshots and verifies
the manually serialized website opcodes against the same reviewed interface.
