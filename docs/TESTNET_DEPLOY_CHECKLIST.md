# QUASAR Tolk testnet readiness checklist

> **No deployment command is currently provided.** The active contracts are a
> fresh Tolk generation with new StateInit, storage schemas, code hashes and
> addresses. Do not reuse a legacy Tact deployment record, wallet address,
> mnemonic or deployment script.

This checklist records only the prerequisites for a separately approved testnet
rehearsal. It neither authorizes a transaction nor supplies signing material.

## Reproducible contract generation

- [ ] A clean checkout has Node dependencies installed with `npm ci`.
- [ ] Acton `1.2.1` is installed and `npm run acton:init` succeeds; it only refreshes the standard library and preserves `tolk/Acton.toml`.
- [ ] `npm run lint` succeeds.
- [ ] `npm test` succeeds, including Acton emulation tests.
- [ ] `npm run abi:verify` and `npm run abi:dapp` succeed.
- [ ] `python3 scripts/sync_acton.py --check` verifies the published generation.
- [ ] `npm run hashes:build` produces reviewed Tolk ABI/BoC hashes.

## Required migration and deployment design

- [ ] An independent audit has reviewed the exact Tolk commit and generated BOCs.
- [ ] The governance decision explicitly states that this is a new deployment,
  not an in-place Tact upgrade.
- [ ] A state-transition plan reconciles supply, balances, liabilities, LP/farm
  positions, stakes, vesting, pending payouts and bounce ledgers.
- [ ] The plan maps every legacy master/DeFi/wallet address to a new destination
  and includes replay protection, a claims window and independent reconciliation.
- [ ] Testnet StateInit constructors, code hashes, getter decoders, send encoders
  and address derivation have been independently reviewed.
- [ ] A disposable testnet wallet and no real-fund credentials are used.

## Before publishing any address

- [ ] Complete a full disposable testnet rehearsal, including failure and bounce
  paths.
- [ ] Publish the reviewed code hashes, Tolk ABI snapshots and migration scope.
- [ ] Update `website/deployment.json` only after the governance/audit gates
  approve the exact network and addresses.

Historical Tact deploy and smoke procedures are preserved only as audit evidence
under `docs/historical/tact-reference/`; they must not be executed.
