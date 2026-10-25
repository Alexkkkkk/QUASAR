# Migration snapshot tool

The repository includes a deterministic offline canonicalizer for reviewed migration exports:

```bash
npm run migration:snapshot -- docs/migration/snapshot.example.json /tmp/quasar-migration.snapshot.json
npm run migration:test
```

The tool is intentionally limited. It does not query TON, deploy a contract, publish a claim root, or sign transactions. Its input must come from a separately reviewed raw-chain/indexer export and independently checked getters.

It fail-closes on:

- duplicate record IDs;
- floating-point amounts;
- malformed unsigned base-unit amounts;
- missing exclusion reasons;
- unsupported asset classes;
- declared eligible-total mismatches.

It produces a canonical snapshot hash, per-asset eligible/excluded totals, deterministic leaf hashes and a domain-separated Merkle root. Preserve the input export, output snapshot, tool commit, raw-chain evidence and an independent reconciliation report together. A successful local run is not a claim registry and is not a deployment approval.
