# QUASAR — State Migration Plan

> Статус: **проект release-документа, deployment не выполнялся**.
>
> Этот документ определяет безопасный переход от исторического deployment/поколения контрактов к новому Tolk/Acton deployment. Он не является разрешением на mainnet, не содержит адресов или секретов и не выполняет on-chain операции.

## 1. Решение и главный принцип

QUASAR не выполняет in-place upgrade старого Tact-контракта до нового Tolk-контракта. У активного Tolk-поколения другие code hash, `StateInit`, storage layout и адреса. Старые storage cells нельзя безопасно передать в новый bytecode без отдельного доказанного decoder/encoder, а совпадение wire ABI не доказывает совместимость состояния.

Принятая стратегия:

1. Зафиксировать старую сеть и состояние на объявленном migration block/time.
2. Заморозить экономические операции старого deployment.
3. Получить независимый, детерминированный snapshot всех обязательств.
4. Развернуть новый Tolk deployment с новым набором адресов.
5. Перенести права и обязательства через claim/migration registry, а не через прямое копирование старого storage.
6. Сверить total supply, user balances, custody, LP/farm, staking, vesting, referral и pending payouts до открытия claim window.
7. Открывать claim постепенно, с replay protection, idempotency и публичной reconciliation report.

До реализации claim registry, snapshot tooling и testnet rehearsal миграция **не готова к выполнению**.

## 2. Область миграции

В snapshot должны попасть не только текущие балансы, но и все экономические обязательства, которые могут быть предъявлены после cutover.

| Объект | Источник | Что фиксируется | Критический инвариант |
| --- | --- | --- | --- |
| QSR total supply | `QuasarMaster.get_jetton_data()` | `totalSupply`, mintable flag, master identity | Новый выпуск не создаёт активы вне approved supply plan. |
| Holder balances | Enumerated Jetton wallets / indexed transfers | owner, old wallet, balance, frozen/eligible status | Сумма eligible balances + explicit exclusions = approved snapshot supply. |
| Master reserve/custody | `get_reserve_snapshot()`, `get_reserve_balance()`, `get_custody_balance()` | reserves, custody, pending payout totals | On-chain physical balance reconciles with liabilities and reserved claims. |
| User liabilities | `get_user_liabilities(user)` | vesting, rewards, referral, pending claims | Каждая liability имеет один destination и один migration class. |
| Stakes | `get_stake_info(user)`, DeFi farm getters | amount, lock end, accrued rewards, status | Stake is not silently converted to liquid balance. |
| Vesting | `get_vesting_info(user)` | beneficiary, total, claimed, cliff, end, remaining | Claimed amount is never claimable again. |
| Referral | `get_referral_info(user)`, pending reward getter | referrer, reward, paid/pending state | Referral edges and liabilities remain deterministic. |
| DeFi pool | `get_reserve_snapshot()`, `poolInfo()` | TON/QSR reserves, LP supply, fee accumulators | Constant-product and reserve accounting reconcile at cutover. |
| LP positions | `lpBalance(user)` | LP amount, owner, locked/eligible status | Sum of positions equals LP supply less protocol-owned LP. |
| Farm positions | `userFarm(user)`, `farmInfo()` | staked LP, accrued reward, lock/cooldown | Farm stake and LP position migrate together. |
| Pending deposits | Master/DeFi pending deposit getters | depositor, amount, created time, state | Every pending deposit is paid, refunded or explicitly excluded. |
| Pending payouts/bounces | payout/claim getters and transaction trace | query/claim id, amount, destination, attempt | No callback or bounce can be replayed after cutover. |
| Governance/admin | owner, pending owner, timelock, guardian, oracle | role, pending transfer, deadline, signer policy | Roles are handed off only through approved multisig procedures. |

## 3. Migration modes

### 3.1 Preferred mode: snapshot + claim

The old deployment remains the source of truth until the snapshot is finalized. The new deployment exposes a claim path or a dedicated migration registry that accepts a Merkle root or equivalent reviewed commitment.

A claim record must bind at least:

```text
migrationVersion
oldNetwork
oldMasterAddress
snapshotBlock
oldWalletOrPositionId
beneficiary
assetClass
amount
positionMetadataHash
leafHash
claimed/consumed status
```

The claim operation must:

- verify the proof against the approved root;
- reject a different beneficiary unless an explicitly approved custody transfer exists;
- consume the leaf exactly once;
- use a domain-separated migration version and old contract address;
- emit an auditable claim event;
- never derive entitlement from an untrusted user-supplied amount;
- preserve a claimable liability if delivery bounces.

### 3.2 Custodial conversion mode

If the project cannot implement an audited on-chain claim registry before launch, it must not pretend that a token-for-token migration exists. A controlled off-chain process may distribute new assets only if governance approves it, every distribution is backed by the signed snapshot, and the process has independent reconciliation and a public CSV/hash commitment.

This mode has a larger trust surface and is not the preferred design. Private keys, seed phrases and signing material remain outside the repository.

### 3.3 Prohibited mode: direct storage replacement

Do not:

- call `setData(oldData)` on the new contract;
- decode historical Tact storage with an unreviewed Tolk struct;
- reuse old wallet addresses with a different wallet code or StateInit;
- infer balances from only `totalSupply`;
- deploy a migration target that can arbitrarily overwrite state;
- allow a callback, bounce or user-supplied amount to mint a claim twice.

## 4. Roles and separation of duties

| Role | Responsibility | Must not do |
| --- | --- | --- |
| Migration owner | Owns schedule, scope and go/no-go decision | Change snapshot data unilaterally after approval. |
| Snapshot operator | Runs deterministic indexer/export | Sign deployment or claim transactions. |
| Independent reconciler | Rebuilds balances and liabilities from raw chain data | Use the operator's database as its only source. |
| Contract/security reviewers | Review source, StateInit, claim proof and traces | Approve based only on README or ABI compatibility. |
| Multisig signers | Approve freeze, deployment, root, roles and emergency actions | Share keys or bypass timelock. |
| Incident commander | Coordinates abort/rollback communications | Alter claim root during an active window. |
| Monitoring operator | Watches supply, claims, bounces and reserves | Hold unilateral upgrade authority. |

At least two independent parties must reproduce the snapshot and compare the result before root publication.

## 5. Pre-migration gates

Migration is **NO-GO** until every item below is complete:

- [ ] Governance approves this new-deployment/claim strategy.
- [ ] Old and new contract addresses are explicitly identified per network.
- [ ] New Tolk code, BOCs, StateInit builders, ABI snapshots and wrappers are frozen by release commit.
- [ ] `npm ci`, `npm run acton:init`, `npm run lint`, `npm test`, `npm run abi:verify`, `npm run abi:dapp` and `python3 scripts/sync_acton.py --check` pass on that commit.
- [ ] A claim registry or equivalent reviewed distribution mechanism exists; this repository currently does not provide a generic migration registry.
- [ ] Snapshot schema and canonical serialization are versioned.
- [ ] Independent snapshot reproduction matches the primary export byte-for-byte or by approved normalized hash.
- [ ] Supply, reserves, LP, farm, vesting, staking, referral and pending payout reconciliation all balance.
- [ ] Migration replay protection and claim idempotency tests pass.
- [ ] Bounce, timeout, stale callback, double claim and wrong-beneficiary tests pass.
- [ ] Testnet rehearsal completes with disposable keys and a full evidence bundle.
- [ ] Qualified independent TON/Tolk security audit covers final contracts and this plan.
- [ ] Mainnet signer policy, timelocks, emergency guardian and monitoring are approved.

## 6. Freeze protocol

Freeze is a coordinated state machine, not a single message.

### F-1: announce

Publish the migration version, planned snapshot block/time, claim window, supported networks, old/new contract identities and emergency channels. Do not publish private keys or unverified addresses.

### F-2: close new economic actions

Disable or reject new mint, burn, swaps, LP changes, farming, staking, vesting changes, referral registration and administrative parameter changes. The exact freeze mechanism must be tested on testnet first. If a contract cannot safely pause a particular action, the migration window must wait until its pending-state model is reconciled.

### F-3: drain or classify asynchronous work

Before the snapshot, settle or classify every pending operation:

- successful payout;
- retryable payout;
- user refund;
- explicit excluded/expired record with governance decision.

No pending callback may remain ambiguous at the snapshot boundary.

### F-4: final observation period

Wait for the protocol-specific finality policy after the last accepted operation. Record the last accepted transaction, logical time, block ID, timestamp and indexer cursor. Re-run the export after the observation period and prove that no eligible state changed.

## 7. Snapshot specification

### 7.1 Canonical inputs

The exporter must use raw chain data plus independently verified getter results. Indexer APIs are an acceleration layer, not the only source of truth.

For every record, store:

- network and master/DeFi address;
- account address and wallet address;
- source transaction or block reference;
- raw amount in base units;
- normalized decimal representation only for display;
- status and exclusion reason;
- schema version;
- hash of canonical serialized record.

### 7.2 Canonicalization

Use deterministic UTF-8 JSON or a formally specified binary format with:

- sorted keys;
- decimal strings for integers;
- no floating point;
- normalized internal addresses;
- explicit `null` versus absent fields;
- explicit asset class and version;
- no timestamps generated during hashing;
- a domain prefix such as `QUASAR-MIGRATION-V1`.

Publish the root and the exact exporter commit. Keep the full raw export in restricted evidence storage; publish only the approved public subset and hashes.

### 7.3 Reconciliation equations

At minimum, independently calculate:

```text
old_total_supply
  = sum(holder_balances)
  + sum(protocol_owned_balances)
  + sum(explicitly_approved_liabilities)
  + sum(explicit_exclusions)
```

For the pool:

```text
pool_ton_reserve
  = user claims + protocol claims + fees + held payout claims
    + documented non-user reserve
```

```text
pool_qsr_reserve
  = LP-backed QSR + pending QSR payouts + documented protocol reserve
```

For farming:

```text
farm_total_staked = sum(user_staked_lp) + protocol_staked_lp
```

Any non-zero residual requires a written explanation, independent approval and a decision whether the residual is claimable, reserved or excluded. No “rounding tolerance” may hide a financial discrepancy; tolerances must be asset-specific, bounded and documented.

## 8. New deployment and claim architecture

### 8.1 New contracts

Deploy the reviewed Tolk Master, Wallet, DeFi and Timelock as a new address set. Derive every wallet address from the exact reviewed wallet code and StateInit. Archive:

- code hash;
- data hash;
- full StateInit hash;
- compiler/toolchain version;
- ABI snapshot hash;
- wrapper hash;
- deployment transaction and resulting address.

### 8.2 Migration registry requirements

A production registry must support:

- immutable approved root per migration version;
- owner/multisig-controlled activation after timelock;
- claim deadline and emergency pause;
- per-leaf consumed marker or equivalent nullifier;
- domain-separated claim IDs;
- proof verification;
- beneficiary change only through an explicit signed recovery process;
- event emission for root activation, claim, refund and emergency pause;
- held-balance accounting for bounced payouts;
- no arbitrary `setData` or unrestricted code/data replacement.

The registry must not rely on a user sending an amount in the message body as proof of entitlement.

### 8.3 Asset handling

Prefer a single approved migration asset with a documented decimal/metadata policy. If old and new Jettons have different addresses, publish the mapping and prevent the UI/indexer from presenting them as the same asset until the claim is complete.

LP, farm, vesting and staking positions must not be silently flattened into liquid QSR unless governance explicitly approves the economic conversion and the snapshot records the original position metadata.

## 9. Claim window

1. Activate the root only after multisig approval and an independent root/hash comparison.
2. Open a short testnet-style canary tranche first.
3. Monitor claim count, claimed amount, failed delivery, bounce and reserve delta.
4. Open the full window only if canary invariants hold.
5. Keep a public claimed/unclaimed aggregate without leaking private operational data.
6. Support retry with a fresh attempt ID, never by replaying the original claim.
7. Close the window only after the deadline and a final reconciliation.
8. Route unclaimed balances to a separately approved dormant-claims policy; never sweep them silently.

## 10. Rollback and abort rules

### Abort before root activation

Abort if any code hash, StateInit, ABI, snapshot hash, signer, address mapping or reconciliation result differs from the approved release evidence. Delete/disable the unpublished root and keep the old system frozen only according to the emergency plan.

### Abort after root activation but before claims

Pause the registry. Do not change the root in place. Publish an incident notice, preserve all events and decide whether to deploy a new migration version with a new domain/root.

### Incident during claims

Pause new claims if any of these occur:

- supply or reserve delta exceeds the approved bound;
- duplicate/nullifier violation;
- wrong beneficiary or proof accepted;
- unexpected callback/bounce path;
- claim delivery cannot be reconciled;
- signer compromise or unauthorized admin action;
- indexer and raw-chain totals diverge.

Already consumed claims remain consumed. A rollback must not re-enable old claims or create a second entitlement. Recovery uses a new audited version and explicit incident reconciliation.

## 11. Testnet rehearsal

Run the complete rehearsal on a disposable testnet deployment with disposable keys:

- snapshot generation from raw chain and getter data;
- independent snapshot reproduction;
- root activation through the intended multisig;
- canary claims and full claims;
- wrong proof, wrong beneficiary and duplicate claim;
- expired claim and paused registry;
- bounced payout and retry with a new attempt ID;
- wallet discovery and deterministic address checks;
- mint, burn, transfer, excesses and TEP-74 notifications;
- LP add/remove, swap success/failure and payout bounce;
- farm stake/unstake and reward claim;
- vesting and referral claims;
- owner/timelock handoff;
- stale callback, replayed query and malformed message;
- final reserve/supply reconciliation.

Archive transaction traces, getter snapshots, code hashes, root, exporter commit, signer approvals and before/after balances. A successful deployment alone is not a successful rehearsal; reconciliation must pass.

## 12. Monitoring after cutover

For the full claim window, monitor at least:

- old/new total supply;
- claimed and unclaimed amounts by asset class;
- new wallet balances and claim registry nullifiers;
- master reserve/custody and DeFi TON/QSR reserves;
- LP supply, farm stake and reward liabilities;
- pending payout and bounce ledgers;
- claim failures, retries and timeouts;
- admin/timelock/guardian/oracle messages;
- unexpected code/data changes;
- indexer versus raw-chain reconciliation.

Alerts must have a documented owner, threshold, escalation path and pause procedure. Dashboards are not a substitute for raw-chain evidence.

## 13. Evidence bundle

The release evidence directory must contain, at minimum:

```text
release-commit.txt
acton-version.txt
contracts-code-hashes.json
state-init-hashes.json
abi-snapshots.sha256
wrapper-hashes.sha256
old-deployment-identities.json
new-deployment-identities.json
snapshot-schema-version.txt
snapshot-root.txt
snapshot-export.sha256
snapshot-reconciliation.json
excluded-records.json
claim-registry-config.json
multisig-approvals/
testnet-traces/
incident-and-rollback-runbook.md
independent-audit-report.pdf
final-go-no-go-signoff.md
```

Do not put seed phrases, private keys, `.env` files or unrestricted deployment credentials in this bundle or repository.

## 14. Current QUASAR status

The repository currently provides the Tolk contracts, ABI/build checks, testnet/release checklists and multisig handoff guidance. It does **not** currently provide a generic production migration registry, a finalized snapshot exporter for all DeFi liabilities, or live deployment evidence. Therefore this plan is an implementation and governance gate, not a claim that migration is ready.

Current blockers remain:

- [ ] design and audit the migration registry/claim path;
- [ ] implement deterministic snapshot/export/reconciliation tooling;
- [ ] define exact old deployment identities and migration block;
- [ ] cover every pending payout/bounce state;
- [ ] complete testnet rehearsal;
- [ ] complete independent TON/Tolk audit;
- [ ] obtain multisig go/no-go approval.

## 15. Go/no-go sign-off

Migration may proceed only when every signer can answer **yes** to all of the following:

- Is this a new deployment with a new address map, not a disguised storage overwrite?
- Can two independent parties reproduce the snapshot and root?
- Does every old economic obligation have exactly one destination or written exclusion?
- Can every claim be consumed exactly once and retried without duplication?
- Are bounce, stale callback, timeout and emergency pause paths tested?
- Do final code hashes, ABI, StateInit and wrappers match the signed release evidence?
- Has an independent auditor reviewed the final source, registry, snapshot and traces?
- Is there a tested abort/incident plan that does not create or destroy entitlements?

If any answer is **no**, the correct decision is **NO-GO**.
