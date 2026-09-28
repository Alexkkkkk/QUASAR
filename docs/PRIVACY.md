# QUASAR — Privacy Policy

QUASAR is a non-custodial TON dApp. It has no backend that stores user data.

- **No accounts, no tracking.** The website is a static bundle; it sets no
  cookies and runs no analytics or advertising scripts.
- **Wallet data stays local.** The only value kept in the browser session is the
  connected address returned by TON Connect, which is used to render balances.
- **Reads go to public infrastructure.** Balances, pool stats and quotes are read
  from the public Toncenter JSON-RPC endpoint over HTTPS; the requests contain the
  public address being queried and nothing else.
- **Writes go through your wallet.** Every state change is a transaction you
  review and sign in your own wallet; QUASAR never holds keys or funds.
- **On-chain data is public forever.** Addresses, amounts and message payloads
  recorded on the TON blockchain are visible to anyone and cannot be deleted.

Questions: open an issue at https://github.com/Alexkkkkk/QUASAR/issues
