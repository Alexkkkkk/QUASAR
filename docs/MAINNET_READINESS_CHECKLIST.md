# QUASAR Tolk mainnet-readiness checklist

This is a release gate, not a claim that QUASAR is audited, production-safe or
ready for mainnet. Every unchecked item blocks a public launch.

## 1. Reproducible Tolk build

- [ ] A clean checkout passes `npm ci`, stdlib-only `npm run acton:init`, `npm run lint` and
  `npm test` with Acton `1.2.1`.
- [ ] `npm run abi:verify`, `npm run abi:dapp`, `npm run hashes:build` and
  `python3 scripts/sync_acton.py --check` pass for the exact release commit.
- [ ] Reviewed ABI snapshots, BOCs, code hashes and TypeScript wrapper output
  are archived with the release evidence.
- [ ] The website's manual serializers and getter calls are checked against the
  compiler-derived Tolk ABI.

## 2. New-deployment and migration boundary

- [ ] Governance explicitly approves a **new** Tolk deployment rather than an
  in-place upgrade of a Tact contract.
- [ ] A separate audited state-transition or claims plan reconciles supply,
  balances, custody, LP/farm positions, stakes, vesting, referral liabilities,
  pending payouts and bounce ledgers.
- [ ] The plan provides old-to-new address mapping, replay protection, a claim
  window and independent reconciliation.
- [ ] StateInit/data builders, getter decoders, send encoders and derived wallet
  address logic have been independently reviewed.

## 3. Testnet and independent audit

- [ ] A disposable testnet rehearsal exercises deploy reserves, TEP-74/TEP-89,
  ownership, timelock, liquidity, farm, all relevant reject paths and bounces.
- [ ] Generated testnet addresses and code hashes match the reviewed release
  artifacts.
- [ ] A qualified independent TON/Tolk audit covers the final source, generated
  BOCs, action traces and state-transition plan.
- [ ] All critical/high findings are remediated and re-reviewed with the same
  reproducibility gates.

## 4. Operations and public launch

- [ ] Owner/admin, emergency, treasury and oracle roles use documented,
  independently controlled signer policies.
- [ ] Monitoring covers supply, reserves, custody, pool balances, bounces and
  administrative messages.
- [ ] The final release note records exact commit, Acton version, code hashes,
  new addresses and all migration limitations.
- [ ] Public documentation states that no yield is guaranteed and describes
  administration, risks, fees and emergency behavior.

Network deployment, signing and asset migration must be approved separately;
they are not automated by this repository.
