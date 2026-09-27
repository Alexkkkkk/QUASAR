/**
 * Independent-audit remediation (issue #44): H-02, M-01, L-01.
 *
 *   H-02 🔴 bounced Master payouts only restored the aggregate custody/reserve
 *           counter, not the originating stake / vesting-claim / reward /
 *           referral entitlement.
 *   M-01 🟠 bounced DeFi TON payouts (RemoveLiquidity / SwapToTON) were not
 *           reconciled: tonReserve and the user's LP / deposit state were lost.
 *   L-01 🟡 govVotes was keyed only by voter, so one staker could vote once for
 *           the whole life of the contract instead of once per proposal.
 *
 * Source invariants fail if a fix is reverted; the on-chain test drives the
 * real contract through the sandbox.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beginCell, Cell, toNano } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarWallet } from '../build/quasar_QuasarWallet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
const defiSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar_defi.tact'), 'utf8');

function section(src: string, from: string, to?: string): string {
    const i = src.indexOf(from);
    assert.ok(i >= 0, `anchor not found: ${from}`);
    const j = to ? src.indexOf(to, i) : src.length;
    return src.slice(i, j > 0 ? j : src.length);
}
const anyComputeFailed = (res: any): boolean =>
    res.transactions.some((t: any) => t.description?.computePhase?.success === false);

// ═══════════════ H-02 ═══════════════

test('H-02 source: master registers typed pending payouts and restores them on bounce', () => {
    assert.ok(masterSrc.includes('struct PendingMasterPayout'), 'a typed pending-payout record must exist');
    assert.ok(masterSrc.includes('pendingMasterPayouts: map<Int, PendingMasterPayout>;'), 'the master must keep a pending-payout ledger');
    assert.ok(masterSrc.includes('self.pendingMasterPayouts.set(id, PendingMasterPayout{'), 'a payout id must be registered before dispatch');

    const restore = section(masterSrc, 'fun _restoreMasterPayout', '// Custodied deposits must leave');
    for (const k of ['kind == 1', 'kind == 2', 'kind == 3', 'kind == 4']) {
        assert.ok(restore.includes(k), `restore must cover payout kind ${k}`);
    }
    assert.ok(restore.includes('self.totalStaked = self.totalStaked + op!!.amount;'), 'a bounced unstake must restore the staked total');
    assert.ok(restore.includes('self.teamClaimed = self.teamClaimed - op!!.amount;'), 'a bounced vesting claim must revert teamClaimed');
    assert.ok(restore.includes('self.stakingRewardsPool = self.stakingRewardsPool + op!!.amount;'), 'a bounced reward must return to the staking pool');

    const pp = section(masterSrc, 'bounced(msg: bounced<PoolPayout>)', 'receive(msg: PayoutFailed)');
    assert.ok(pp.includes('self._restoreMasterPayout(msg.queryId);'), 'a PoolPayout bounce must restore user state');
    const pf = section(masterSrc, 'receive(msg: PayoutFailed)', '// OWNER ADMIN');
    assert.ok(pf.includes('self._restoreMasterPayout(msg.queryId);'), 'PayoutFailed must restore user state');
    assert.ok(
        masterSrc.includes('self._restoreMasterPayout(msg.queryId);\n            self.reserveBalance = self.reserveBalance + msg.amount;'),
        'a bounced reserve payout must restore the entitlement before the aggregate'
    );
});

test('H-02 source: unstake/vesting/reward/referral dispatch through the ledger', () => {
    const unstake = section(masterSrc, 'receive(msg: Unstake)', 'receive(msg: ClaimRewards)');
    assert.ok(/self\._sendCustodiedTokens\(staker, msg\.amount, 1,/.test(unstake), 'unstake must register a kind-1 payout');
    const vested = section(masterSrc, 'receive(msg: ClaimVested)', '// AI SOVEREIGNTY');
    assert.ok(/self\._sendCustodiedTokens\(beneficiary, claimable, 2,/.test(vested), 'vesting claim must register a kind-2 payout');
    assert.ok(masterSrc.includes('self._sendReservePayout(staker, pending, 3, priorClaim);'), 'staking reward must register a kind-3 payout');
    assert.ok(masterSrc.includes('self._sendReservePayout(claimant, pending!!, 4, 0);'), 'referral reward must register a kind-4 payout');
});

// ═══════════════ M-01 ═══════════════

test('M-01 source: DeFi tracks TON payouts and rolls them back on bounce', () => {
    assert.ok(defiSrc.includes('message(0x746f6e70) TonPayout'), 'a typed TonPayout message must exist');
    assert.ok(defiSrc.includes('struct PendingTonPayout'), 'a pending TON payout record must exist');
    assert.ok(defiSrc.includes('pendingTonPayouts: map<Int, PendingTonPayout>;'), 'DeFi must keep a pending TON payout ledger');

    const b = section(defiSrc, 'bounced(msg: bounced<TonPayout>)', 'receive(msg: SweepTON)');
    assert.ok(b.includes('self.tonReserve += p!!.tonOut;'), 'a bounced TON payout must restore tonReserve');
    assert.ok(b.includes('self.qsrReserve += qsrLeg!!.amount;'), 'the remove-liquidity bounce must restore qsrReserve');
    assert.ok(b.includes('self.lpTotalSupply += p!!.lpAmount;'), 'the remove-liquidity bounce must restore LP entitlement');
    assert.ok(b.includes('pendingQsrDeposits.set'), 'the swap bounce must restore the consumed QSR deposit');

    const rl = section(defiSrc, 'receive(msg: RemoveLiquidity)', 'receive(msg: SwapToTON)');
    assert.ok(rl.includes('PendingTonPayout{ kind: 1'), 'remove-liquidity must track its TON leg');
    assert.ok(rl.includes('self._sendQsr(sender(), qsrOut, 1, payoutId);'), 'the QSR leg must share the payout id');
    const st = section(defiSrc, 'receive(msg: SwapToTON)', 'receive(msg: SwapToQSR)');
    assert.ok(st.includes('PendingTonPayout{ kind: 2'), 'swap-to-TON must track its TON leg');
});

// ═══════════════ L-01 ═══════════════

test('L-01 source: votes are unique per (voter, proposal)', () => {
    assert.ok(masterSrc.includes('govVotes: map<Int, Bool>;'), 'the vote map must be keyed by a composite key');
    assert.ok(masterSrc.includes('fun _voteKey(voter: Address, proposalId: Int): Int'), 'a (voter, proposal) key helper must exist');
    const gv = section(masterSrc, 'receive(msg: GovernanceVote)', '// DeFi SYNC');
    assert.ok(gv.includes('self.govVotes.get(voteKey)'), 'dedup must use the composite key');
    assert.ok(gv.includes('self.govVotes.set(voteKey, true);'), 'the vote must be recorded under the composite key');
});

async function deployEco() {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const alice = await bc.treasury('alice');
    const content = beginCell().storeUint(1, 8)
        .storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json')
        .endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const masterC = bc.openContract(masterRaw);
    await masterC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });
    return { bc, owner, alice, master: masterC, masterAddr: masterRaw.address };
}

async function stake(eco: any, user: any, amount: bigint) {
    const masterWallet = await QuasarWallet.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(masterWallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user.address, forwardPayload: beginCell().endCell().asSlice()
    });
    await eco.master.send(user.getSender(), { value: toNano('0.1') }, { $$type: 'Stake', amount });
}

const vote = (proposalId: bigint) => ({
    $$type: 'GovernanceVote', proposalId, kind: 1n, flag: true, feeBps: 30n, deadline: 2_000_000_000n, reason: 'audit regression'
});

test('L-01 on-chain: one staker may vote on two different proposals', async () => {
    const eco = await deployEco();
    await stake(eco, eco.alice, 1000n * 10n ** 9n);
    const r1 = await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, vote(1n));
    assert.ok(!anyComputeFailed(r1), 'the first proposal vote must succeed');
    const r2 = await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, vote(2n));
    assert.ok(!anyComputeFailed(r2), 'the same staker must be able to vote on a second proposal');
});

test('L-01 on-chain: the same proposal cannot be voted twice by one staker', async () => {
    const eco = await deployEco();
    await stake(eco, eco.alice, 1000n * 10n ** 9n);
    await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, vote(1n));
    const dup = await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, vote(1n));
    assert.ok(anyComputeFailed(dup), 'a duplicate vote on the same proposal must revert');
});
