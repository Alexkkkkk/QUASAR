# ABI snapshots

The JSON files in this directory record the public ABI that the CI pipeline
expects from each compiled contract:

- typed receiver message names, opcodes, and serialized fields;
- text receiver names;
- getter names, method IDs, arguments, and return types.

The snapshots are generated from the compiler's `.abi` artifacts. They are
intentionally limited to the contract-facing ABI rather than the compiler's
full set of imported type definitions.

After an intentional contract ABI change, rebuild and review the resulting
diff:

```sh
npm run abi:update
npm run abi:verify
```

CI runs `npm run abi:verify` after the contract tests. It also compares the
`QuasarWallet` BOC emitted by the `quasar` and `quasar_defi` builds, so a
change to the shared wallet implementation cannot silently diverge between
the two projects.