# QUASAR testnet smoke runbook

The automated smoke check is intentionally read-only. It verifies deployment
identity and state; it does not prove that swaps, claims, bounces, or admin
flows work end to end.

## Preconditions

1. Build the final audited commit:

   ```bash
   npm ci
   npm run build
   ```

2. Deploy to TON testnet using a disposable deployer wallet and the normal
   deployment flow.
3. Confirm `build/deployment.json` contains:
   - `"network": "testnet"`;
   - `contracts.master.address`;
   - `contracts.defi.address`;
   - `totalSupply` in whole QSR, before the 9-decimal conversion.
4. Set `TONCENTER_ENDPOINT` and, when required, `TONCENTER_API_KEY`.

## Automated read-only check

```bash
npm run testnet:smoke
```

The command checks:

- both contracts are deployed at the recorded addresses;
- Master points to DeFi and DeFi points back to Master;
- supply is non-zero and matches the deployment file at 9 decimals;
- the hard supply cap is present and greater than the current supply;
- reserve, custody, and pool values are non-negative;
- the DeFi fee stays within the documented 30 bps ceiling;
- the buyback configuration is non-zero and readable.

## Manual disposable-wallet flow

Run these in order with minimal testnet amounts and record the transaction
hashes:

1. Read Master and DeFi getters before activity.
2. Mint a small amount to the disposable user wallet.
3. Transfer QSR to a second disposable wallet and verify the 30 bps fee path.
4. Burn a small amount and verify total supply decreases.
5. Register a non-zero referral, generate a fee, and claim the referral reward.
6. Deposit QSR, stake, wait past the lock in the sandbox/testnet plan, and
   unstake; verify custody and staking totals.
7. Create a short vesting schedule, claim after the cliff, and verify the
   custody balance.
8. Add proportional TON/QSR liquidity, test both swap directions with a
   strict `minOut`, then remove liquidity.
9. Fund and enable farming, accrue a small reward, disable the farm, and
   confirm an already-earned reward remains claimable.
10. Exercise owner-only controls from a non-owner account and verify every
    unauthorized message fails.
11. Test the 48-hour ownership timelock on testnet.
12. Re-run `npm run testnet:smoke` and archive the output with the deployment
    addresses and commit hash.

Do not reuse the deployer wallet, keys, or liquidity amounts for mainnet.
