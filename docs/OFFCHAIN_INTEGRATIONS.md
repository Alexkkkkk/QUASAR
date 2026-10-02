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
verification.

### Indexed reads — API v3

`scripts/lib/ton_api_v3.ts` adds the indexed layer (`ToncenterV3Client`) beside
the v2 JSON-RPC client, without changing any v2 behaviour:

| Item | Value |
| --- | --- |
| Base URLs | `https://toncenter.com/api/v3` (mainnet), `https://testnet.toncenter.com/api/v3` (testnet) |
| Auth | `X-API-Key` header |
| Pagination | `limit` / `offset`, page size capped at 100 |
| Jettons | `jetton/masters`, `jetton/wallets`, `jetton/transfers` |
| Blockchain data | `masterchainInfo`, `addressInformation`, `accountStates`, `walletStates`, `transactions`, `messages`, `actions` |
| Get-methods | `runGetMethod`, `getJettonWalletAddress` |

`ToncenterV3Client.verifyJettonWallet()` derives the wallet through the
allowlisted master and then requires the indexer to report exactly one
`jetton/wallets` record whose `owner` and `jetton` both match the request. An
address the indexer does not confirm is rejected instead of trusted.

Paths, query parameter names and response fields come from the published TON
Index specification (`/api/v3/doc.json`, version 1.2.6) and the
[API v3 overview](https://docs.ton.org/api/v3/overview). The adapter only
reads: it does not sign, send or broadcast.

```ts
import { ToncenterV3Client } from './scripts/lib/ton_api_v3.js';

const indexed = new ToncenterV3Client({
  network: 'testnet',
  apiKey: process.env.TONCENTER_API_KEY
});

const wallet = await indexed.verifyJettonWallet(
  process.env.QSR_MASTER!,
  process.env.USER_ADDRESS!
);
console.log(wallet.balance.toString(), wallet.source);

for await (const page of indexed.iterateJettonTransfers(
  { ownerAddress: process.env.USER_ADDRESS!, limit: 50 },
  { maxPages: 3 }
)) {
  console.log(page.items.length, page.nextOffset);
}
```

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

## Grok text-analysis adapter

`scripts/ai_oracle.ts` is an optional off-chain text client for xAI's
`POST /v1/chat/completions` endpoint. It sends one user prompt with a bounded
completion size and timeout, and returns plain assistant text. It does not
connect to TON, sign or broadcast messages, call tools, or update the
`QuasarMaster` AI oracle state. Treat its output as untrusted analysis that
requires validation and human review; it is not a price feed or an on-chain
oracle attestation.

Set `XAI_API_KEY` in a local ignored `.env` file or a secrets manager. The
optional `XAI_MODEL` defaults to `grok-4.6`. Run:

```bash
npm run ai:oracle -- "Summarize this input for human review"
```

Automated tests inject a mock `fetch`; they never contact xAI or need an API
key. The request endpoint is fixed to `https://api.x.ai/v1/chat/completions`,
and errors intentionally do not include provider response bodies or the API
key.