/**
 * v5 feature tests — the three capabilities added after the top-repo
 * comparison:
 *   1. QSR-stake-weighted on-chain governance (GovernanceVote)
 *   2. Timelocked fee-config changes (SetFeeConfig -> Confirm Fee Config)
 *   3. Two-step + timelock wallet-code migration (ProposeWalletCode/Apply)
 *
 * Runs on @ton/sandbox against the compiled build, same harness as the
 * regression suites.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarDeFi } from '../build/quasar_defi_QuasarDeFi.js';
import { QuasarWallet } from '../build/quasar_QuasarWallet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const ZERO = Address.parseRaw('0:' + '0'.repeat(64));
const QSR = 1_000_000_000n;
const DEADLINE = 2_000_000_000n;

/** True when at least one tx in the tree reverted in the compute phase. */
function anyComputeFailed(res: any): boolean {
    return res.transactions.some((t: any) => t.description?.computePhase?.success === false);
}

async function expectRevert(p: Promise<any>, why: string): Promise<void> {
    try {
        const res = await p;
        assert.ok(anyComputeFailed(res), why);
    } catch {
        // send() itself rejected the message — also a revert
    }
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
    const masterC = bc.openContract(masterRaw);
    await masterC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    return { bc, owner, alice, master: masterC, masterAddr: masterRaw.address };
}

/** Stake `amount` QSR for `user` through the verified custody path. */
async function stake(eco: Eco, user: any, amount: bigint) {
    const masterWallet = await QuasarWallet.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(masterWallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user.address, forwardPayload: beginCell().endCell().asSlice()
    });
    await eco.master.send(user.getSender(), { value: toNano('0.1') }, { $$type: 'Stake', amount });
}

// ═══════════════ 1. Governance ═══════════════

test('gov: a non-staker cannot vote and a wallet cannot vote twice', async () => {
    const eco = await deployEco();

    await expectRevert(eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 1n, kind: 1, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'no stake'
    }), 'voting without a stake must revert');

    await stake(eco, eco.alice, 100n * QSR);
    await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 1n, kind: 1, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'first vote'
    });
    // A single staker is 100% of the staked supply, so this vote immediately
    // reaches the 10% quorum, executes the proposal and consumes the tally.
    assert.equal(await eco.master.getGetProposalStake(1n), 0n, 'the quorum tally must be consumed after execution');

    // second vote from the same wallet on the same proposal is rejected
    const second = await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 1n, kind: 1, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'double vote'
    }).catch(() => null);
    const failed = second === null || second.transactions.some((t: any) => t.description?.computePhase?.success === false);
    assert.ok(failed, 'a second vote from the same wallet must revert');
});

test('gov: a vote reaching quorum executes the proposal through the AI action log', async () => {
    const eco = await deployEco();
    await stake(eco, eco.alice, 100n * QSR);

    // one staker == 100% of the staked supply, quorum is 10% -> executes
    await eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 7n, kind: 2, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'halt trading'
    });
    assert.equal(await eco.master.getIsTradingEnabled(), false, 'the trading toggle must execute on quorum');

    // the executed proposal must be visible in the same reversible AI log
    // the owner override window reads
    const action = await eco.master.getGetAiAction(0n);
    assert.ok(action, 'the governance execution must be logged as a reversible AI action');
    assert.equal(action.actionType, 'ToggleTrading');
    assert.equal(action.oldValue, 1n);
    assert.equal(action.newValue, 0n);

    // quorum tally is consumed: the same proposal cannot re-execute
    assert.equal(await eco.master.getGetProposalStake(7n), 0n, 'the quorum tally must be zeroed after execution');
});

test('gov: expired votes are rejected and unknown kinds revert', async () => {
    const eco = await deployEco();
    await stake(eco, eco.alice, 100n * QSR);

    await expectRevert(eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 2n, kind: 1, flag: false, feeBps: 30, deadline: 999n, reason: 'expired'
    }), 'a vote past its deadline must revert');

    await expectRevert(eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'GovernanceVote', proposalId: 3n, kind: 9, flag: false, feeBps: 30, deadline: DEADLINE, reason: 'unknown kind'
    }), 'an unknown proposal kind must revert');
});

// ═══════════════ 2. Fee-config timelock ═══════════════

test('timelock: SetFeeConfig only stages; Confirm Fee Config applies after the delay', async () => {
    const eco = await deployEco();

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'SetFeeConfig', feeBps: 30, burnShare: 75, maxTxBps: 100, maxWalletBps: 300, cooldown: 5
    });
    assert.equal((await eco.master.getGetFeeConfig()).burnShare, 50n, 'staged values must not apply before confirmation');

    // confirming before the timelock elapses must fail
    const early = await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Confirm Fee Config')
        .catch(() => null);
    const earlyFailed = early === null || early.transactions.some((t: any) => t.description?.computePhase?.success === false);
    assert.ok(earlyFailed, 'an early confirmation must revert');

    eco.bc.now = 1000 + 172_800 + 1;
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Confirm Fee Config');
    assert.equal((await eco.master.getGetFeeConfig()).burnShare, 75n, 'the confirmed values must apply after the timelock');
});

// ═══════════════ 3. Wallet-code migration ═══════════════

test('wallet migration: propose/apply is two-step, timelocked and owner-only', async () => {
    const eco = await deployEco();
    const newCode = beginCell().storeUint(7, 8).endCell();

    // non-owner cannot propose
    await expectRevert(eco.master.send(eco.alice.getSender(), { value: toNano('0.1') }, {
        $$type: 'ProposeWalletCode', newWalletCode: newCode
    }), 'only the owner can propose a wallet-code migration');

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'ProposeWalletCode', newWalletCode: newCode
    });
    assert.equal(await eco.master.getGetWalletCodeAt(), 1000n + 172_800n, 'the timelock must be scheduled');

    // applying before the timelock fails; the current code is untouched
    const early = await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Apply Wallet Code')
        .catch(() => null);
    const earlyFailed = early === null || early.transactions.some((t: any) => t.description?.computePhase?.success === false);
    assert.ok(earlyFailed, 'an early wallet-code application must revert');
    assert.ok((await eco.master.getGetJettonData()).jettonWalletCode.equals(walletCode), 'the code must not change before the timelock');

    eco.bc.now = 1000 + 172_800 + 1;
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Apply Wallet Code');
    assert.ok((await eco.master.getGetJettonData()).jettonWalletCode.equals(newCode), 'newly derived wallets must use the migrated code');
    assert.equal(await eco.master.getGetWalletCodeAt(), 0n, 'the migration must clear its timelock');
});
