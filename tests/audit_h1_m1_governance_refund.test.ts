/**
 * External-audit package fixes (issue gate #62):
 *
 *   H-1 🔴 `GovernanceVote` executed economic proposals (fee / trading /
 *           emergency pause) on quorum with no sender authorization at all —
 *           the only state-changing master receiver without an owner/AI check.
 *           Fix: `self._requireOwner()` gates the whole receiver.
 *   M-1 🟡 the master had no `RefundPendingDeposit` receiver, so QSR deposited
 *           into `pendingQsrDeposits` (TokenNotification) but not consumed by
 *           Stake / AddVesting / veto escrow was locked in custody forever.
 *           Fix: refund receiver mirroring the DeFi `RefundPendingQsr` path,
 *           with a kind-6 bounce branch in `_restoreMasterPayout`.
 *
 * Source invariants fail if a fix is reverted; the on-chain tests drive the
 * real contract through the sandbox.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarWallet } from '../build/quasar_QuasarWallet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');

function section(src: string, from: string, to?: string): string {
    const i = src.indexOf(from);
    assert.ok(i >= 0, `anchor not found: ${from}`);
    const j = to ? src.indexOf(to, i) : src.length;
    return src.slice(i, j > 0 ? j : src.length);
}

// ═══════════════ H-1 source invariants ═══════════════

test('H-1 source: GovernanceVote is owner-gated', () => {
    const gv = section(masterSrc, 'receive(msg: GovernanceVote)', 'receive(msg: SetDefiAddress)');
    const head = section(gv, 'receive(msg: GovernanceVote)', 'self._requireNotPaused();');
    assert.ok(head.includes('self._requireOwner();'), 'the governance vote receiver must require the owner');
});

// ═══════════════ M-1 source invariants ═══════════════

test('M-1 source: the master exposes a pending-deposit refund path with a bounce branch', () => {
    assert.ok(masterSrc.includes('message RefundPendingDeposit { }'), 'the refund message must exist');
    const refund = section(masterSrc, 'receive(msg: RefundPendingDeposit)', 'receive(msg: SetDefiAddress)');
    assert.ok(refund.includes('require(pending != null && pending!! > 0, "No pending deposit");'),
        'a zero balance must revert');
    assert.ok(refund.includes('self.pendingQsrDeposits.set(sender(), 0);'), 'the refund must clear the pending balance');
    assert.ok(refund.includes('self._sendCustodiedTokens(sender(), pending!!, 6, 0, 0, 0);'),
        'the refund must return the QSR through the custodial payout ledger');
    assert.ok(masterSrc.includes('op!!.kind == 6'), 'a bounced refund must re-credit the pending deposit');
});

// ═══════════════ on-chain harness ═══════════════

const ZERO = Address.parseRaw('0:' + '0'.repeat(64));
const QSR = 1_000_000_000n;
const DEADLINE = 2_000_000_000n;

function anyComputeFailed(res: any): boolean {
    return res.transactions.some((t: any) => t.description?.computePhase?.success === false);
}

interface Eco {
    bc: Blockchain;
    owner: any;
    alice: any;
    master: any;
    masterAddr: Address;
}

async function deployEco(): Promise<Eco> {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const alice = await bc.treasury('alice');

    const content = beginCell().storeUint(1, 8)
        .storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json')
        .endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(masterRaw);
    await master.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    return { bc, owner, alice, master, masterAddr: masterRaw.address };
}

async function deposit(eco: Eco, user: any, amount: bigint) {
    const masterWallet = await QuasarWallet.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(masterWallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user.address, forwardPayload: beginCell().endCell().asSlice()
    });
}

// ═══════════════ H-1 on-chain ═══════════════

test('H-1 on-chain: a non-owner GovernanceVote reverts without changing state', async () => {
    const eco = await deployEco();
    await deposit(eco, eco.alice, 100n * QSR);
    await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, { $$type: 'Stake', amount: 100n * QSR });
    const tradingBefore = await eco.master.getIsTradingEnabled();
    assert.equal(tradingBefore, true);

    const res = await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 1n, kind: 2, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'unauthorized'
    });
    assert.ok(anyComputeFailed(res), 'a non-owner governance vote must revert');
    assert.equal(await eco.master.getIsTradingEnabled(), true, 'the rejected vote must not change state');
    assert.equal(await eco.master.getGetProposalStake(1n), 0n, 'the rejected vote must not accumulate stake');
});

test('H-1 on-chain: the owner can still execute a proposal on quorum', async () => {
    const eco = await deployEco();
    await deposit(eco, eco.owner, 100n * QSR);
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'Stake', amount: 100n * QSR });

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 7n, kind: 2, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'halt trading'
    });
    assert.equal(await eco.master.getIsTradingEnabled(), false, 'the owner quorum vote must execute');
    assert.equal(await eco.master.getGetProposalStake(7n), 0n, 'the quorum tally must be consumed');
});

// ═══════════════ M-1 on-chain ═══════════════

test('M-1 on-chain: a user can refund an unconsumed deposit, a zero-balance refund reverts', async () => {
    const eco = await deployEco();

    // Fund the master's jetton wallet so the custodial payout can actually
    // deliver (same seeding as the veto-escrow test).
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.3') }, {
        $$type: 'Mint', amount: 25n * QSR, receiver: eco.masterAddr
    });

    // 1. deposit, then refund: the pending balance is cleared and the payout
    //    leaves through the custodial ledger
    await deposit(eco, eco.alice, 25n * QSR);
    assert.equal(await eco.master.getGetPendingQsrDeposit(eco.alice.address), 25n * QSR);

    await eco.master.send(eco.alice.getSender(), { value: toNano('0.2') }, { $$type: 'RefundPendingDeposit' });
    assert.equal(await eco.master.getGetPendingQsrDeposit(eco.alice.address), 0n, 'the refund must clear the pending balance');

    // 2. a second refund with a zero balance must revert
    const res = await eco.master.send(eco.alice.getSender(), { value: toNano('0.2') }, { $$type: 'RefundPendingDeposit' });
    assert.ok(anyComputeFailed(res), 'a refund with no pending deposit must revert');
});

test('M-1 on-chain: a bounced refund re-credits the pending deposit exactly once', async () => {
    // Without seeding the master jetton wallet the custodial payout bounces;
    // the kind-6 branch of `_restoreMasterPayout` must return the user's
    // pending deposit so the funds stay withdrawable.
    const eco = await deployEco();
    await deposit(eco, eco.alice, 25n * QSR);

    await eco.master.send(eco.alice.getSender(), { value: toNano('0.2') }, { $$type: 'RefundPendingDeposit' });
    assert.equal(await eco.master.getGetPendingQsrDeposit(eco.alice.address), 25n * QSR,
        'a bounced refund must re-credit the pending deposit');
});

test('M-1 on-chain: another user cannot refund someone else deposit', async () => {
    const eco = await deployEco();
    await deposit(eco, eco.alice, 5n * QSR);
    const bob = await eco.bc.treasury('bob');

    const res = await eco.master.send(bob.getSender(), { value: toNano('0.2') }, { $$type: 'RefundPendingDeposit' });
    assert.ok(anyComputeFailed(res), 'a refund against a zero personal balance must revert');
    assert.equal(await eco.master.getGetPendingQsrDeposit(eco.alice.address), 5n * QSR, 'alice deposit must stay intact');
});
