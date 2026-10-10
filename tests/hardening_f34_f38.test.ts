/**
 * Contract hardening for the findings inherited from the 2026-10-01 audit pass
 * and tracked in issue #139:
 *   F-34 unbounded AI market-data growth, F-35 replayable governance
 *   proposalId, F-36 implicit fee-burn supply guard, F-38 buyback comment vs
 *   reserve-cap arithmetic.
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
const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const QSR = 1_000_000_000n;
const DEADLINE = 2_000_000_000n;

function anyComputeFailed(res: any): boolean {
    return res.transactions.some((t: any) => t.description?.computePhase?.success === false);
}

test('F-38: the buyback comment no longer claims the pool is always fully consumed', () => {
    assert.ok(!masterSrc.includes('fully consumed (burn + swap = pool)'), 'the stale full-consumption claim must be gone');
    assert.ok(masterSrc.includes('remains in buybackPool'), 'the comment must state the reserve-cap remainder');
});

test('F-36: FeeTransfer rejects a burn larger than the circulating supply', () => {
    const fee = masterSrc.slice(masterSrc.indexOf('receive(msg: FeeTransfer)'), masterSrc.indexOf('receive(msg: TriggerBuyback)'));
    assert.ok(fee.includes('require(burnAmount <= self.totalSupply, "Burn exceeds supply");'), 'the explicit supply guard must be present in FeeTransfer');
});

test('F-35: a governance proposal id is single-use at the source level', () => {
    assert.ok(masterSrc.includes('govProposalExecuted: map<Int, Bool>;'), 'the executed-proposal map must be stored');
    assert.ok(masterSrc.includes('self.govProposalExecuted = emptyMap();'), 'the map must be initialised');
    assert.ok(masterSrc.includes('require(self.govProposalExecuted.get(msg.proposalId) == null, "Proposal already executed");'), 'a replayed id must revert');
    assert.ok(masterSrc.includes('self.govProposalExecuted.set(msg.proposalId, true);'), 'execution must mark the id consumed');
});

test('F-34: AI market-data storage is bounded and the drops are observable', () => {
    assert.ok(masterSrc.includes('const QUASAR_AI_PRICE_HISTORY_CAP'), 'the price-history cap must exist');
    assert.ok(masterSrc.includes('const QUASAR_AI_ANOMALY_CAP'), 'the anomaly-log cap must exist');
    assert.ok(masterSrc.includes('priceHistoryDropped') && masterSrc.includes('anomalyDropped'), 'dropped records must be counted');
    assert.ok(masterSrc.includes('fun _logAnomaly('), 'anomaly writes must go through one bounded writer');
});

async function deployEco() {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const alice = await bc.treasury('alice');
    const bob = await bc.treasury('bob');

    const content = beginCell().storeUint(1, 8)
        .storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json')
        .endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(masterRaw);
    await master.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    return { bc, owner, alice, bob, master, masterAddr: masterRaw.address };
}

async function stake(eco: any, user: any, amount: bigint) {
    const masterWallet = await QuasarWallet.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(masterWallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user.address, forwardPayload: beginCell().endCell().asSlice()
    });
    await eco.master.send(user.getSender(), { value: toNano('0.1') }, { $$type: 'Stake', amount });
}

test('F-35 behaviour: after quorum the same proposalId cannot be executed again by a later voter', async () => {
    const eco = await deployEco();
    await stake(eco, eco.owner, 100n * QSR);

    // H-1: the quorum execution runs on the owner's message
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 42n, kind: 2n, flag: false, feeBps: 30n, deadline: DEADLINE, reason: 'halt trading'
    });
    assert.equal(await eco.master.getIsTradingEnabled(), false, 'the first quorum must execute the proposal');
    assert.equal(await eco.master.getGetProposalStake(42n), 0n, 'the quorum tally must be consumed');

    // Re-enable trading through the owner so an illegal replay would be visible.
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'ToggleTrading', enabled: true });
    assert.equal(await eco.master.getIsTradingEnabled(), true, 'the owner can re-enable trading');

    // A second staker pushes totalStaked to 200 QSR; 100/200 is still above the
    // 10% quorum, so before F-35 this vote re-executed proposal 42.
    await stake(eco, eco.bob, 100n * QSR);
    const replay = await eco.master.send(eco.bob.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 42n, kind: 2n, flag: false, feeBps: 30n, deadline: DEADLINE, reason: 'replay'
    }).catch(() => null);
    const failed = replay === null || anyComputeFailed(replay);
    assert.ok(failed, 'a vote on an already executed proposal id must revert');
    assert.equal(await eco.master.getIsTradingEnabled(), true, 'the rejected replay must not change state');
});
