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
## Off-chain AI oracle (xAI / Grok)

`scripts/ai_oracle.ts` is the only module that talks to an external language
model. It is read-only with respect to the chain: it never signs, sends or
broadcasts. The contracts keep an oracle address and consume a decision an
operator relays as an ordinary message.

| Item | Value |
| --- | --- |
| Endpoint | `https://api.x.ai/v1/chat/completions` |
| Auth | `Authorization: Bearer <XAI_API_KEY>` |
| Default model | `grok-4.7` |
| Key env vars | `XAI_API_KEY`, then `GROK_API_KEY` |
| Timeout | 30s default, overridable per call |
| Retries | 2 extra attempts on 408 / 429 / 5xx / network faults; never on 401 / 403 or timeout |

The decision contract is bounded: `action` must be one of `hold`, `buyback`,
`distribute`, `pause`; `riskScore` an integer 0..100; `confidence` a number
0..1; `rationale` a non-empty string of at most 500 characters. The reply is
validated in `parseOracleDecision()` before it reaches any operator script, so
an out-of-range model answer is rejected instead of relayed.

```bash
npm run oracle:smoke -- "reserve ratio is 4%, 24h outflow 12%"
```

The tests never touch the network because `fetch` is injectable:

```bash
npm run oracle:test
```
