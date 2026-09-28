# QUASAR testnet deployment checklist

This checklist is the practical companion to the read-only smoke runbook. Use it
when you are about to create a disposable TON testnet deployment and want one
place to tick off the required prep, deploy, validation, and archival steps.

Companion documents:

- `docs/TESTNET_SMOKE_RUNBOOK.md` — the automated + manual post-deploy smoke flow.
- `docs/MAINNET_READINESS_CHECKLIST.md` — the later mainnet release gate.
- `docs/TESTNET_AUDIT_READINESS_CHECKLIST.md` — broader engineering/audit gate.

## 0. Scope and safety rules

- [ ] This deployment uses **testnet only** (`TON_NETWORK=testnet`).
- [ ] The deployer wallet is **disposable** and funded only with testnet TON.
- [ ] No mainnet seed phrase, private key, or treasury wallet is present on the machine.
- [ ] `.env` stays local and uncommitted (`.gitignore` covers `.env` / `.env.local`).
- [ ] The current commit is recorded before deployment (`git rev-parse --short HEAD`).

## 1. Local prerequisites

- [ ] `npm ci` succeeds.
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] `npm test` succeeds.
- [ ] `build/quasar_QuasarWallet.code.boc` exists after build.

Recommended command set:

```bash
npm ci
npm run build
npm run lint
npm test
```

## 2. Environment configuration

Create a local `.env` from the tracked template:

```bash
cp .env.example .env
```

Checklist:

- [ ] `WALLET_MNEMONIC` contains exactly 24 words.
- [ ] `TON_NETWORK=testnet`.
- [ ] `TONCENTER_API_KEY` is filled if your toncenter usage requires it.
- [ ] `JETTON_METADATA_URL` resolves over anonymous HTTPS.
- [ ] `TIMELOCK_MIN_DELAY` is left at `86400` or higher.
- [ ] `TIMELOCK_ADMIN` is either a testnet multisig/admin address or intentionally left empty so the deployer becomes the admin.
- [ ] `AI_ORACLE_ADDRESS` is empty unless you intentionally want to wire the oracle during deploy.

## 3. Metadata preflight

Before deploying, confirm the metadata URL serves the expected TEP-64 fields:

- [ ] `name`
- [ ] `symbol`
- [ ] `decimals`
- [ ] `image`

The deploy script already performs a preflight and must be allowed to fail hard if
metadata is dead or malformed.

## 4. Funding and network prep

- [ ] The disposable deployer wallet has enough **testnet TON** for Master + DeFi + Timelock deployment.
- [ ] Faucet source and refill path are recorded.
- [ ] You know which endpoint you are using (`testnet.toncenter.com` by default).

## 5. Deployment

Full deploy:

```bash
npm run deploy
```

DeFi-only deploy over an existing `build/deployment.json`:

```bash
npm run deploy:defi
```

Post-command checks:

- [ ] `build/deployment.json` was created/updated.
- [ ] `website/deployment.json` was created/updated.
- [ ] `build/deployment.json` contains `"network": "testnet"`.
- [ ] `build/deployment.json` contains addresses for `master`, `defi`, and `timelock`.
- [ ] The recorded `totalSupply` is in **whole QSR** (before 9-decimal conversion).

## 6. Immediate post-deploy validation

Run the automated read-only check:

```bash
npm run testnet:smoke
```

- [ ] Smoke passes against the just-created `build/deployment.json`.
- [ ] Master points to the deployed DeFi address.
- [ ] DeFi points back to the deployed Master address.
- [ ] Timelock is deployed, non-zero, and manages both contracts.
- [ ] The on-chain total supply matches the deployment file at 9 decimals.
- [ ] The hard cap equals `1_000_000_000 * 10^9` and is above current supply.
- [ ] Reserves, custody, and pool getters are non-negative.
- [ ] DeFi fee is positive and does not exceed the documented 30 bps ceiling.
- [ ] Buyback is enabled and its threshold is non-zero.

## 7. Manual disposable-wallet smoke flow

Record transaction hashes and observed balances for each step.

- [ ] Read Master and DeFi getters before activity.
- [ ] Mint a small amount to a disposable user wallet.
- [ ] Transfer QSR to a second disposable wallet and verify the 30 bps fee path.
- [ ] Burn a small amount and verify total supply decreases.
- [ ] Register a referral, generate a fee, and claim the referral reward.
- [ ] Deposit QSR, stake, wait past the lock in the test plan, and unstake.
- [ ] Create a short vesting schedule and claim after the cliff.
- [ ] Add proportional TON/QSR liquidity.
- [ ] Execute both swap directions with strict `minOut` values.
- [ ] Remove liquidity and verify reserves update coherently.
- [ ] Fund and enable farming, accrue a small reward, disable farming, and confirm already-earned rewards stay claimable.
- [ ] Exercise owner-only calls from a non-owner account and confirm rejection.
- [ ] Exercise the ownership timelock path on testnet.
- [ ] Exercise adversarial bounce scenarios with disposable recipients and low TON balances.
- [ ] Re-run `npm run testnet:smoke` after the manual flow.

## 8. Archival package

- [ ] Archive the final `build/deployment.json`.
- [ ] Archive the final smoke output.
- [ ] Archive the commit hash, deployment date, and testnet addresses.
- [ ] Archive the tx hashes for mint / transfer / burn / stake / vesting / LP / swaps / farm / timelock.
- [ ] Archive any deviations, retries, or manual interventions.

## 9. Exit criteria

Do **not** treat the deployment as mainnet-ready unless all of the following are true:

- [ ] Automated smoke is green.
- [ ] Manual disposable-wallet flow is green.
- [ ] Bounce/error paths were exercised without losing liabilities.
- [ ] The testnet deployment can be reproduced from the recorded commit and `.env` schema.
- [ ] Findings and follow-up issues from the testnet run are recorded before any mainnet decision.
