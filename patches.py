#!/usr/bin/env python3
"""Deterministically apply the audit fixes on top of HEAD."""
import subprocess, sys, pathlib

R = pathlib.Path('/home/user/quasar_repo')

def head(p):
    return subprocess.run(['git', 'show', f'HEAD:{p}'], capture_output=True, text=True, check=True, cwd=R).stdout

def rep(s, old, new, n=1):
    c = s.count(old)
    assert c == n, f'anchor x{c} (want {n}): {old[:70]!r}'
    return s.replace(old, new)

mode = sys.argv[1]  # 'final' or 'step1'

# ---------- contracts/quasar.tact ----------
master = head('contracts/quasar.tact')
master = rep(master,
    "        self.pendingFee = 0;\n        self.pendingFee = 0;\n",
    "        self.pendingFee = 0;\n")
master = rep(master,
"""        // Auto-buyback
        if (self.buybackEnabled && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {""",
"""        // Auto-buyback. A pending swap leg owns buybackSwapPending/QueryId;
        // starting another swap here would overwrite the tracking record and
        // desync the reserve accounting when the first proceeds arrive (M-03).
        if (self.buybackEnabled && self.buybackSwapPending == 0 && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {""")

if mode == 'final':
    master = rep(master,
        '        require(sender() == contractAddress(wInit), "Invalid fee source");',
        '''        require(sender() == contractAddress(wInit), "Invalid fee source");

        // P0.2: the fee transfer proves the sending wallet's outbound operation
        // reached the accounting stage, so the source wallet can drop its
        // pending fee/receiver/response records for this query id. The master
        // dispatches the confirmation because the receiving wallet must keep
        // the TEP-74 `excesses` refund as its only extra message and a freshly
        // derived wallet has no spare balance for a cleanup send. The fee
        // source is authenticated above, so the cleanup is trusted.
        send(SendParameters{
            to: contractAddress(wInit),
            value: ton("0.005"),
            bounce: false,
            mode: SendPayGasSeparately | SendIgnoreErrors,
            body: TransferConfirmed{ queryId: msg.queryId }.toCell()
        });''')
(R / 'contracts' / 'quasar.tact').write_text(master)

# ---------- contracts/quasar_common.tact ----------
if mode == 'final':
    common = head('contracts/quasar_common.tact')
    common = rep(common,
"""    receive(msg: TransferConfirmed) {
        let receiver: Address? = self.pendingResponseReceivers.get(msg.queryId);
        require(receiver != null, "Unknown transfer");
        let receiverInit: StateInit = initOf QuasarWallet(receiver!!, self.master);
        require(sender() == contractAddress(receiverInit), "Unauthorized confirmation");""",
"""    receive(msg: TransferConfirmed) {
        let receiver: Address? = self.pendingResponseReceivers.get(msg.queryId);
        // A confirmation for an unknown or already-cleaned query id is a no-op:
        // duplicates and late messages must not fail or double-clean.
        if (receiver == null) { return }
        // The cleanup is dispatched by the master, which authenticates the fee
        // source wallet before forwarding the confirmation; anything else must
        // not be able to erase pending refund state (F-20).
        require(sender() == self.master, "Unauthorized confirmation");""")
    common = rep(common,
        "            });\n        }\n    }\n\n    receive(msg: TransferConfirmed) {",
        """            });
        }

        // NOTE (P0.2): this receiver must not send anything else. A freshly
        // derived wallet has no spare balance, so a balance-funded cleanup
        // message would be skipped for lack of funds, and a second
        // value-carrying action would break the TEP-74 refund. Source-wallet
        // pending cleanup is dispatched by the master when the FeeTransfer
        // arrives (see quasar.tact).
    }

    receive(msg: TransferConfirmed) {""")
    (R / 'contracts' / 'quasar_common.tact').write_text(common)

# ---------- scripts/security_check.ts ----------
scheck = head('scripts/security_check.ts')
scheck = rep(scheck,
    "assertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');",
    "assertContains(master, 'self.buybackSwapPending == 0 && self.buybackPool >= self.buybackThreshold', 'a pending buyback swap cannot be overwritten by the fee path (M-03)');\n\nassertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');")
scheck = rep(scheck,
    "    'AMM price observations'\n].join(', '));",
    "    'AMM price observations',\n    'buyback swap overlap guard'\n].join(', '));")
if mode == 'final':
    scheck = rep(scheck,
        "assertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');",
        "assertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');\nassertContains(master, 'body: TransferConfirmed{ queryId: msg.queryId }.toCell()', 'the master dispatches source-wallet cleanup from the authenticated FeeTransfer path (P0.2)');\nassertContains(common, 'if (receiver == null) { return }', 'stale transfer confirmations are a no-op, not a revert (P0.2)');")
    scheck = rep(scheck,
        "    'AMM price observations',\n    'buyback swap overlap guard'\n].join(', '));",
        "    'AMM price observations',\n    'buyback swap overlap guard',\n    'authenticated transfer confirmations'\n].join(', '));")
(R / 'scripts' / 'security_check.ts').write_text(scheck)

if mode == 'final':
    # ---------- tests/audit_fixes.test.ts ----------
    afix = head('tests/audit_fixes.test.ts')
    afix = rep(afix,
        "import { QuasarMaster } from '../build/quasar_QuasarMaster.js';",
        "import { QuasarMaster } from '../build/quasar_QuasarMaster.js';\nimport { QuasarWallet } from '../build/quasar_QuasarWallet.js';")
    p02 = """test('P0.2 source: the master confirms transfers for source-wallet cleanup', () => {
    const fee = section(masterSrc, 'receive(msg: FeeTransfer)', 'receive(msg: TriggerBuyback)');
    assert.ok(
        fee.includes('body: TransferConfirmed{ queryId: msg.queryId }.toCell()'),
        'the master must dispatch TransferConfirmed once the fee source is authenticated'
    );
    assert.ok(
        fee.includes('"Invalid fee source"'),
        'the cleanup dispatch must sit behind fee-source authentication'
    );
    const wallet = section(commonSrc, 'receive(msg: InternalTransfer)', 'receive(msg: TransferConfirmed)');
    assert.ok(
        !wallet.includes('TransferConfirmed{'),
        'the receiving wallet must keep the TEP-74 excess refund as its only extra message'
    );
    const confirm = section(commonSrc, 'receive(msg: TransferConfirmed)', 'receive(msg: BurnConfirmed)');
    assert.ok(
        confirm.includes('if (receiver == null) { return }'),
        'stale confirmations must be a no-op instead of reverting'
    );
    assert.ok(
        confirm.includes('sender() == self.master'),
        'confirmations must be authenticated against the master'
    );
});

test('P0.2 on-chain: a query id is reusable after a successful transfer', async () => {
    const QSR = 1_000_000_000n;
    const { bc, owner, m } = await deployMaster();
    const alice = await bc.treasury('alice');
    const bob = await bc.treasury('bob');

    await m.send(owner.getSender(), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address });

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, m.address));
    const mkTransfer = (queryId: bigint) => aliceC.send(bc.sender(alice.address), { value: toNano('0.1') }, {
        $$type: 'TokenTransfer',
        queryId,
        amount: 100n * QSR,
        destination: bob.address,
        responseDestination: alice.address,
        customPayload: null,
        forwardTonAmount: 0n,
        forwardPayload: beginCell().endCell().asSlice()
    });

    const first = await mkTransfer(7n);
    assert.ok(
        !first.transactions.some((t: any) => t.description?.computePhase?.success === false),
        'the first transfer must fully commit'
    );

    // Clear the 5s wallet cooldown, then reuse the same query id. Before the
    // master-confirmed cleanup this reverted with "Query ID already used"
    // because the pending maps kept the id forever.
    bc.now = 2000;
    const second = await mkTransfer(7n);
    assert.ok(
        !second.transactions.some((t: any) => t.description?.computePhase?.success === false),
        'reusing the query id after confirmation must not revert - pending state must be cleaned'
    );
});

"""
    afix = rep(afix,
        "test('F-19 source: rejected fee messages restore the deducted fee', () => {",
        p02 + "test('F-19 source: rejected fee messages restore the deducted fee', () => {")
    (R / 'tests' / 'audit_fixes.test.ts').write_text(afix)

    # ---------- tests/security_regression.test.ts ----------
    sreg = head('tests/security_regression.test.ts')
    sreg = rep(sreg,
        "    assert.ok(readme.includes('not enforced in wallet code'), 'README must not claim an unenforced max-wallet limit');",
        """    // The audited wording mirrors the contract: the 3% wallet ceiling IS enforced
    // in QuasarWallet (InternalTransfer), so the README must claim exactly that.
    assert.ok(readme.includes('receiving wallets at 3%'), 'README must document the enforced max-wallet limit');
    assert.ok(!readme.includes('not enforced in wallet code'), 'README must not claim an unenforced max-wallet limit');""")
    (R / 'tests' / 'security_regression.test.ts').write_text(sreg)

    # ---------- docs/TESTNET_AUDIT_READINESS_CHECKLIST.md ----------
    cl = head('docs/TESTNET_AUDIT_READINESS_CHECKLIST.md')
    cl = rep(cl,
        "- [ ] A successful user transfer does not currently emit `TransferConfirmed` from the receiving wallet; pending response maps are cleaned on bounce/excess paths, while `BurnConfirmed` is wired. Add an authenticated confirmation path without changing TEP-74 response semantics before testnet.",
        "- [x] A successful user transfer retires the source wallet's pending records: the master dispatches an authenticated `TransferConfirmed` from the `FeeTransfer` path (`quasar.tact`), stale confirmations are a no-op, and the receiving wallet keeps the TEP-74 `excesses` refund as its only extra message. Regression: `tests/audit_fixes.test.ts` (P0.2 on-chain query-id reuse).")
    cl = rep(cl,
        "| P0.2 fee atomicity / excesses proxy | Partial | fee bounce/excess paths are covered; successful-transfer pending cleanup needs a TEP-74-compatible design |",
        "| P0.2 fee atomicity / excesses proxy | Done | fee bounce/excess paths covered; successful-transfer cleanup dispatched by the master via authenticated `TransferConfirmed` |")
    (R / 'docs' / 'TESTNET_AUDIT_READINESS_CHECKLIST.md').write_text(cl)

print(f'OK mode={mode}')
