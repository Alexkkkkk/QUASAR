## What changed

<!-- Describe the behavior change, not only the files changed. -->

## Contract / security impact

- [ ] No contract behavior changed
- [ ] Contract behavior changed and regression coverage is included
- [ ] Deployment or configuration behavior changed
- [ ] Security-sensitive change reviewed against `docs/SECURITY_AUDIT.md`

## TON conformance (required for any `contracts/**` change)

- [ ] TEP-74 / TEP-64 / TEP-89 reference link added to this description
- [ ] `docs/TON_CONFORMANCE_MATRIX.md` updated
- [ ] `npm run abi:update` and `npm run hashes:build` re-run (addresses and code hash move)

## Validation

- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run abi:verify`
- [ ] `npm run abi:dapp`
- [ ] `npm run pins:check`
- [ ] `npm run hub:audit`
- [ ] Testnet smoke check (when deployment behavior changed)

## Checklist

- [ ] No secrets, wallet material, or deployment state committed
- [ ] Documentation matches the implementation
- [ ] No claim of audit, yield, or production safety was added without evidence
