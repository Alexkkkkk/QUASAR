# QUASAR mainnet-readiness checklist

This is a release gate, not a claim that the contracts are audited or
production-safe. Every unchecked item blocks a mainnet launch.

## 1. Code and review

- [ ] The latest contract changes are merged to `main` only after CI is green.
- [ ] `npm ci` completes with the committed lockfile.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes, including `tests/audit_fixes.test.ts`.
- [ ] A qualified independent TON/Tact auditor has reviewed the final commit.
- [ ] No contract, generated binding, deployment script, or tokenomics parameter
      changes after the audit without a new review.

## 2. Testnet acceptance

- [ ] A disposable testnet deploy has been funded and recorded in
      `build/deployment.json`.
- [ ] `npm run testnet:smoke` passes against that deployment.
- [ ] Master and DeFi point to each other and the expected Jetton wallet code.
- [ ] The configured supply matches the on-chain supply at 9 decimals.
- [ ] Mint, transfer, fee split, burn, referral claim, staking, vesting, and
      ownership timelock have each been exercised with small amounts.
- [ ] DeFi add/remove liquidity, both swap directions, farm funding/rewards,
      buyback, slippage, and trade-size limits have been exercised.
- [ ] Bounce paths have been tested with adversarial recipients and low TON
      balances; no QSR or reserve liability is lost.
- [ ] AMM/farming tests cover zero-liquidity transitions, integer rounding,
      extreme values, and exhausted reward reserves.

## 3. Operations and key custody

- [ ] The owner is controlled by a multisig or equivalent protected signer.
- [ ] The AI oracle is a separate, monitored key with a documented rotation
      and emergency-reclaim procedure.
- [ ] Full AI autonomy is disabled until its access-control and recovery model
      has received a separate review.
- [ ] Treasury, DeFi address, payout cap, fee, buyback, staking, and farming
      parameters are final and documented.
- [ ] TON gas balances for Master, DeFi, and operational wallets have a
      replenishment policy.
- [ ] Monitoring and alerts cover supply, reserve/custody balances, pool
      reserves, failed/bounced transactions, buybacks, and admin messages.
- [ ] An incident runbook defines who can pause, rotate keys, revoke DeFi,
      and communicate an incident.

## 4. Deployment and public launch

- [ ] Mainnet metadata is immutable, reachable over HTTPS, and matches the
      published symbol, decimals, name, and image.
- [ ] Mainnet TonConnect manifest and frontend addresses have been reviewed.
- [ ] The final deployment commit, code hashes, addresses, and owner address
      are recorded in a release note.
- [ ] The contracts are deployed first; getters and links are verified before
      liquidity or public transfers are opened.
- [ ] A small-amount mainnet smoke transaction succeeds before public launch.
- [ ] Liquidity, farm funding, treasury funding, and initial limits are
      explicitly approved and recorded.
- [ ] Public documentation states that this is not a promise of yield and
      describes admin powers, risks, fees, and emergency behavior.
- [ ] Legal/regulatory review has been completed for the intended launch
      jurisdictions.

## Required commands

```bash
npm ci
npm run lint
npm test
npm run testnet:smoke
```

The smoke command is read-only. It does not deploy contracts, send TON/QSR,
open liquidity, or alter admin settings.
