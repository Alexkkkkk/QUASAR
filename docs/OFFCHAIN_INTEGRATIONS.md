# QUASAR off-chain TON integrations

The TON documentation covers both on-chain contracts and the software that
operates around them. QUASAR keeps those responsibilities separate:

- `scripts/lib/ton_api.ts` is a read-only Toncenter v2 adapter.
- `ToncenterClient.getJettonWalletAddress()` always derives a wallet through
  the configured Jetton master.
- `ToncenterClient.verifyJettonWallet()` rejects a wallet unless its derived
  address, `owner` and `master` from `get_wallet_data` all match the requested
  values.
- `getTransactionsPage()` returns one bounded page and a cursor.
- `iterateTransactions()` follows that cursor for an explicitly bounded number
  of pages.

Example:

```ts
import { ToncenterClient } from './scripts/lib/ton_api.js';

const ton = new ToncenterClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: process.env.TONCENTER_API_KEY
});

const wallet = await ton.verifyJettonWallet(
  process.env.QSR_MASTER!,
  process.env.USER_ADDRESS!
);
console.log(wallet.balance.toString());

for await (const page of ton.iterateTransactions(wallet.wallet, { maxPages: 3 })) {
  console.log(page.length);
}
```

The adapter does not send transactions, hold credentials, or replace an
independent indexer. It is deliberately suitable for pre-testnet reads and
verification. API v3/indexer integration can be added behind the same
interface when a provider and retention requirements are selected.

## Deployment and TON Connect

`deploy_all.ts` and `deploy_defi.ts` generate `build/deployment.json` and
`website/deployment.json`. The latter is ignored by git so an address cannot
silently become a production claim. Run `npm run deployment:check` with
`DEPLOYMENT_FILE=website/deployment.json` before publishing it to Pages.

After Pages has deployed, run:

```bash
npm run tonconnect:smoke
```

The live smoke checks the manifest's JSON MIME type, exact dApp origin, icon,
terms and privacy URLs. It does not claim that a wallet is connected or that a
contract has been deployed.