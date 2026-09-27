# TON documentation conformance pass — 2026-09-26

Scope: `contracts/quasar.tact`, `contracts/quasar_defi.tact`, the test suite, and a
review of **every** branch and pull request in `Alexkkkkk/QUASAR`.

Toolchain: Tact `1.6.x` compiled through `tact.config.json` (`npm run build`),
contract tests executed inside `@ton/sandbox` (`npm test`).

---

## 1. Conformance findings that were fixed

### F-24 — TEP-89 `provide_wallet_address` was missing (master non-discoverable)

TEP-89 (*Discoverable Jettons Wallets*) makes the on-chain discovery handler
**mandatory** for a Jetton master:

```
provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
take_wallet_address#d1735400   query_id:uint64 wallet_address:MsgAddress owner_address:(Maybe ^MsgAddress) = InternalMsgBody;
```

Requirements taken from the standard, and how the contract now satisfies them:

| Requirement (TEP-89) | Implementation |
| --- | --- |
| Master must handle `provide_wallet_address#2c76b973` | `receive(msg: ProvideWalletAddress)` |
| Respond with `take_wallet_address#d1735400` | `TakeWalletAddress{...}` |
| Response sent with **mode 64** | `mode: SendRemainingValue` |
| Caller must attach ≥ `5000 gas-units + lump + cell` = 0.0061 TON | `require(context().value >= ton("0.0061"), "Not enough TON for discovery")` |
| `owner_address:(Maybe ^MsgAddress)` is a **ref** | field declared as `ownerAddress: Cell?` (Tact serialises `Address?` inline, which would break the TL-B layout) |
| `include_address = true` echoes the request owner | `if (msg.includeAddress) { owner = beginCell().storeAddress(msg.ownerAddress).endCell() }` |
| Unresolvable owner ⇒ `wallet_address = addr_none` | not reachable here: the wallet address is derived from a fixed `StateInit`, so a valid workchain address always exists |

`get_wallet_address(slice owner_address)` (TEP-74) already existed and is asserted
to agree with the `StateInit`-derived address in the new test, so the discovery
answer is verifiable rather than trusted.

### F-25 — dead AI-veto receiver removed

`receive(msg: AIVetoVote)` opened with
`require(false, "Veto voting disabled until stake escrow is implemented")`, so
every message to it aborted after paying gas: the contract advertised a
governance feature it does not implement, and the branch executed on-chain was
unreachable-by-construction. The handler, its `VetoState` struct, the `vetoLog`
map and the `get_veto_state` getter were removed. `OwnerOverride` remains the
single exercised reversal path for AI actions, and the override-window logic
(`_isOwnerOverrideWindow`, `ownerOverrideWindow`) is unchanged.

### F-26 — bounce recovery verified reachable (no code change)

TON truncates a bounced body to the first 256 bits after the `0xFFFFFFFF`
prefix, so a `bounced<InternalTransfer>` handler can only ever see the leading
fields of the original body. `tests/conformance_2026_09_26.test.ts` therefore
drives a **real** bounce — a peer Jetton wallet rejects an unexpected credit —
and asserts the observed effect instead of trusting the source text:

```
[F-25 evidence] bounce tree: tx0 dest=EQAD2vmnVD5baFCZ bounced=false compute=FAIL/49729 action=- out=1 ; tx1 dest=EQBFVzpBYrqed5yD bounced=true compute=ok action=ok out=0
[F-25 evidence] bounced inbound messages: 1
[F-25 evidence] alice wallet balance after the bounce: 1100000000000
```

The rejected credit bounces (`bounced=true`) and the sending wallet's balance
rises from `1000 QSR` to `1100 QSR`, i.e. the `queryId` and `amount` that Tact
loads from the truncated body are sufficient and the handler really executes.
The `pendingResponses` / `pendingBurnResponses` maps and the extra refund logic
added on the `wip/swap-to-ton-debug` branch are therefore unnecessary.

### F-29 — mint bounce must roll back supply, not create reserve

The master used the same `bounced<InternalTransfer>` accounting branch for
minting and reserve-funded payouts. A bounced mint therefore added the amount to
`reserveBalance` even though no reserve had been debited, leaving
`totalSupply` inflated and manufacturing spendable liquidity.

The corrected implementation:

- serialises every mint with the reserved `uint64` query id
  `18446744073709551615`;
- subtracts the bounced amount from `totalSupply` when that id returns;
- restores `reserveBalance` only for non-mint internal-transfer bounces;
- rejects the reserved id from reserve payout paths so an external query cannot
  impersonate a mint bounce;
- keeps the hard supply-cap and standard wallet-credit checks intact.

`tests/mint_bounce_regression.test.ts` pins the wire-level query id and the
source accounting split, while the full suite verifies that ordinary minting
still credits the recipient exactly once.

### Verified as already conformant (no change needed)

| Item | Status |
| --- | --- |
| TEP-74 opcodes `0xf8a7ea5`, `0x595f07bc`, `0x178d4519`, `0x7362d09c`, `0xd53276db`, `0x7bdd97de` | present and pinned by a test |
| `excesses#d53276db` returned to `response_destination` | wallet and master, query id preserved |
| `get_jetton_data` / `get_wallet_data` / `get_wallet_address` | TEP-74 return order |
| Bounce recovery of a failed internal transfer | verified reachable by test, see F-26 |
| One `SendRemainingValue` action per transaction | every multi-send flow funds earlier messages with `SendPayGasSeparately` and keeps the remaining-value action last |
| Sender/authorisation checks | `Mint` → owner; `FeeTransfer`, `TokenNotification`, `BurnNotification` → derived wallet `StateInit`; `DefiPayout`, `BuybackTon` → configured DeFi address |
| Storage/gas reserve | master `SweepTON` keeps a 0.05 TON floor; DeFi sweep refuses to touch `tonReserve` |
| Ownership rotation | two-step + 48 h timelock |
| `TokenExcesses` accepted by both contracts | unmatched excess messages no longer abort the transaction |

---

## 2. Branch and pull-request review

The repository currently has four branches: `main`,
`fix/mint-bounce-accounting-2026-09-26`, `fix/quasar-testnet-blockers`, and
`wip/swap-to-ton-debug`. All 30 pull requests returned by the repository API
were reviewed; only #32 is open at this pass.

| PR | Branch | Verdict | Reason |
| --- | --- | --- | --- |
| #21 | `agent-amm-properties-testnet-smoke-20260924` | superseded | adds 74 lines of deterministic AMM property tests on top of `main`; `main` already carries the F-22/F-23 behaviour those properties describe, and the branch does not touch the contracts |
| #23 | `fix/quasar-testnet-blockers` | **do not merge** | conflicts with `main` (`mergeable_state: dirty`) and **regresses** four already-landed fixes: it reverts `mode: SendRemainingValue | SendIgnoreErrors` back to plain `SendRemainingValue` in every event send, reverts the F-23 staking-reward cap (`accrued > self.stakingRewardsPool ? …`) so `Unstake` can revert with *Rewards pool empty* again and lock the principal, and deletes the master's `receive(msg: TokenExcesses)` |
| #24 | `wip/swap-to-ton-debug` | **do not merge** | same regressions as #23 plus an unfinished debug harness (`tests/debug_loop.test.ts`); the `pendingResponses`/`pendingBurnResponses` maps it adds to the wallet solve a problem that does not exist — Tact's `bounced<T>` loader already reads `queryId`/`amount` from the truncated bounce body (see F-25 evidence below) |
| #32 | `fix/mint-bounce-accounting-2026-09-26` | **ready after F-29 fix** | the regression test correctly exposed the mint-bounce accounting bug; the contract now reserves a dedicated mint query id, rolls back `totalSupply` on that bounce, and blocks the id in reserve payout paths |
| #19, #18 | `fix/ai-owner-override-2026-09-22`, `fix/contract-audit-2026-09-22` | stale | both are strictly *older* than `main` (they delete `tests/hardening_2026_09_25.test.ts`, `run_pipeline.sh` and the hardening docs); nothing in them is missing from `main` |
| #16 and earlier | `replit/security-hardening`, `feature/*`, `fix/*` | merged/superseded | their content is already in `main` |

---

## 3. Verification

- `npm run build` — Tact compilation of both projects: clean.
- `npm run security:check` — source invariants: pass.
- `npm test` — full suite including the new `tests/conformance_2026_09_26.test.ts`
  and F-29 regression: 69 tests pass.
- `npm run lint` — Tact syntax/type checks pass for both contracts.
- `npx tsc --noEmit` — scripts and tests type-check.

`tests/conformance_2026_09_26.test.ts` asserts the observable behaviour, not the
source text: it parses the real `take_wallet_address` body out of the transaction
tree (opcode, query id, wallet address, owner ref, exact body length) and drives a
genuine bounce against a deployed peer wallet to observe the re-credit.

---

## 4. Security note

The GitHub personal access token pasted into the chat request is exposed and must
be revoked or rotated. It is not stored in this repository, any commit, or any
documentation file.
