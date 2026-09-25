/**
 * Hardening pass — branch fix/tep74-excesses-and-send-modes-2026-09-25.
 *
 *   F-21 TEP-74: the Jetton wallet must return the unused part of the incoming
 *        message value to `response_destination` as an `excesses#d53276db`
 *        message; the master's burn refund must use the same layout.
 *        The wire opcode is pinned by the source invariant at the bottom; the
 *        on-chain tests assert the observable effect: the receiving Jetton
 *        wallet / the master emits an extra internal message to
 *        `response_destination`, and the transaction commits both phases.
 *   F-22 Send modes: two `SendRemainingValue` actions in one transaction make
 *        the second one fail (exit code 37) and roll the whole action phase
 *        back, so the fee accounting was lost whenever a fee triggered a
 *        buyback.
 *   F-23 Liveness: `Unstake` settled the reward in the same call, so an empty
 *        reward pool reverted the withdrawal and locked the principal.
 *
 * Every test drives the compiled contracts inside @ton/sandbox and asserts
 * either a transaction-tree outcome (no failed compute/action phase) or a state
 * effect observable through the getters.
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
const QSR = 1_000_000_000n;
const DAY = 86_400;
const METADATA_URL = 'https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json';

interface OutMsg { to: string; value: bigint }

/** Address comparison that tolerates friendly vs raw string forms. */
function sameAddress(candidate: string, expected: Address): boolean {
    try {
        return Address.parse(candidate).equals(expected);
    } catch {
        // not a friendly form — fall through
    }
    try {
        return Address.parseRaw(candidate).equals(expected);
    } catch {
        return candidate === expected.toString();
    }
}

/** Destination and value of every outgoing internal message of one transaction. */
function outMessagesOf(tx: any): OutMsg[] {
    const raw: any = tx?.outMessages;
    if (!raw) return [];
    let list: any[] = [];
    if (Array.isArray(raw)) list = raw;
    else if (typeof raw.values === 'function') list = Array.from(raw.values());
    else if (typeof raw === 'object') list = Object.values(raw);
    const found: OutMsg[] = [];
    for (const message of list as any[]) {
        const info: any = message?.info;
        if (info?.type !== 'internal') continue;
        found.push({ to: String(info.dest), value: info.value?.coins ?? 0n });
    }
    return found;
}

function txTo(res: any, dest: Address): any | undefined {
    const txs: any[] = Array.isArray(res?.transactions) ? res.transactions : [];
    return txs.find((tx) => sameAddress(String(tx?.inMessage?.info?.dest ?? ''), dest));
}

function describe(res: any): string {
    const txs: any[] = Array.isArray(res?.transactions) ? res.transactions : [];
    return txs
        .map((tx, i) => {
            const compute = tx?.description?.computePhase;
            const action = tx?.description?.actionPhase;
            const outs = outMessagesOf(tx).map((m) => `${m.to.slice(0, 14)}=${m.value}`).join(',');
            return `tx${i} dest=${String(tx?.inMessage?.info?.dest ?? '').slice(0, 14)} ` +
                `compute=${compute ? (compute.success ? 'ok' : 'FAIL/' + compute.exitCode) : '-'} ` +
                `action=${action ? (action.success ? 'ok' : 'FAIL/' + action.resultCode) + '/sent=' + action.totalActions : '-'} out=[${outs}]`;
        })
        .join(' ; ');
}

function failedPhases(res: any): string[] {
    const bad: string[] = [];
    for (const tx of res?.transactions ?? []) {
        const d = tx?.description;
        if (d?.computePhase && d.computePhase.success === false) bad.push('compute exit=' + String(d.computePhase.exitCode));
        if (d?.actionPhase && d.actionPhase.success === false) bad.push('action result=' + String(d.actionPhase.resultCode));
    }
    return bad;
}

function expectCommitted(res: any, label: string) {
    assert.deepEqual(failedPhases(res), [], `${label}: failed phases — ${describe(res)}`);
}

async function deploy(now: number) {
    const bc = await Blockchain.create();
    bc.now = now;
    const owner = await bc.treasury('owner');
    const alice = await bc.treasury('alice');
    const bob = await bc.treasury('bob');
    const content = beginCell().storeUint(1, 8).storeStringTail(METADATA_URL).endCell();
    const raw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(raw);
    expectCommitted(await master.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Deploy', queryId: 1n }), 'deployment');
    return { bc, owner, alice, bob, master, masterAddr: raw.address };
}

// ═══════════════ F-21 — TEP-74 excesses ═══════════════

test('F-21 TEP-74: a transfer returns the unused message value to response_destination', async () => {
    const { bc, owner, alice, bob, master, masterAddr } = await deploy(1000);

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, masterAddr));
    const bobC = bc.openContract(await QuasarWallet.fromInit(bob.address, masterAddr));
    const bobWalletAddr = (await QuasarWallet.fromInit(bob.address, masterAddr)).address;

    expectCommitted(
        await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address }),
        'minting'
    );
    assert.equal((await aliceC.getGetWalletData()).balance, 1_000n * QSR, 'the minted amount must reach the wallet');

    const transferRes = await aliceC.send(bc.sender(alice.address), { value: toNano('0.1') }, {
        $$type: 'TokenTransfer',
        queryId: 7n,
        amount: 100n * QSR,
        destination: bob.address,
        responseDestination: alice.address,
        customPayload: null,
        forwardTonAmount: 0n,
        forwardPayload: beginCell().endCell().asSlice()
    });
    expectCommitted(transferRes, 'the transfer');

    const fee = (100n * QSR * 30n) / 10_000n;
    assert.equal((await bobC.getGetWalletData()).balance, 100n * QSR - fee, 'the recipient wallet is credited with the amount minus the 0.30% fee');
    assert.equal((await aliceC.getGetWalletData()).balance, 900n * QSR, 'the sender wallet is debited by the full amount');

    // The receiving Jetton wallet is the contract that must return the leftover
    // message value to `response_destination` (TEP-74, step 3).
    const receivingWallet = txTo(transferRes, bobWalletAddr);
    assert.ok(receivingWallet, 'the receiving Jetton wallet must be part of the tree — ' + describe(transferRes));
    const returned = outMessagesOf(receivingWallet!).filter((m) => sameAddress(m.to, alice.address));
    console.log('[F-21 evidence] receiving wallet out-messages: ' +
        JSON.stringify(outMessagesOf(receivingWallet!).map((m) => ({ to: m.to, value: m.value.toString() }))));
    assert.equal(returned.length, 1, 'the receiving wallet must return exactly one excess message to responseDestination — ' + describe(transferRes));
    assert.ok(returned[0].value > 0n, 'the excess message must carry the leftover value — ' + describe(transferRes));
});

test('F-21 TEP-74: the master refunds a burn to response_destination', async () => {
    const { bc, owner, alice, master, masterAddr } = await deploy(1000);

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, masterAddr));
    expectCommitted(
        await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address }),
        'minting'
    );

    const burnRes = await aliceC.send(bc.sender(alice.address), { value: toNano('0.1') }, {
        $$type: 'TokenBurn',
        queryId: 9n,
        amount: 100n * QSR,
        responseDestination: alice.address,
        customPayload: null
    });
    // The informational `EventBurn` message is addressed to the sender Jetton
    // wallet, which ignores unknown messages (the recipient aborts with exit 130).
    // A failed *recipient* transaction never rolls back the master's committed
    // state, so the assertion targets the master's own transaction phases.
    const masterTxForBurn = txTo(burnRes, masterAddr);
    assert.ok(masterTxForBurn, 'the master must receive the burn notification — ' + describe(burnRes));
    const masterFailed = [
        masterTxForBurn!.description.computePhase?.success === false ? 'compute' : null,
        masterTxForBurn!.description.actionPhase?.success === false ? 'action' : null
    ].filter((phase) => phase !== null);
    assert.deepEqual(masterFailed, [], 'the master must commit the burn in both phases — ' + describe(burnRes));
    assert.equal((await master.getGetJettonData()).totalSupply, 900n * QSR, 'the master must reduce the total supply');
    assert.equal((await aliceC.getGetWalletData()).balance, 900n * QSR, 'the wallet must be debited by the burned amount');

    const masterTx = txTo(burnRes, masterAddr);
    assert.ok(masterTx, 'the master must receive the burn notification — ' + describe(burnRes));
    const refunds = outMessagesOf(masterTx!).filter((m) => sameAddress(m.to, alice.address));
    console.log('[F-21 evidence] master out-messages on burn: ' +
        JSON.stringify(outMessagesOf(masterTx!).map((m) => ({ to: m.to, value: m.value.toString() }))));
    assert.equal(refunds.length, 1, 'the master must refund exactly once to responseDestination — ' + describe(burnRes));
});

// ═══════════════ F-22 — one remaining-value action per transaction ═══════════════

test('F-22: a fee that triggers a buyback still commits the fee accounting', async () => {
    const { bc, owner, alice, bob, master, masterAddr } = await deploy(100_000);

    expectCommitted(
        await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 10_000n * QSR, receiver: alice.address }),
        'minting'
    );

    const aliceWallet = await QuasarWallet.fromInit(alice.address, masterAddr);
    const amount = 500n * QSR;
    // A second SendRemainingValue action used to abort the whole action phase
    // here (exit code 37), silently discarding the fee accounting.
    const feeRes = await master.send(bc.sender(aliceWallet.address), { value: toNano('0.1') }, {
        $$type: 'FeeTransfer',
        queryId: 3n,
        amount,
        originalSender: alice.address,
        originalReceiver: bob.address
    });
    console.log('[F-22 evidence] fee tree: ' + describe(feeRes));
    expectCommitted(feeRes, 'the fee transaction');

    assert.equal((await master.getGetFeeConfig()).totalFeesCollected, amount, 'the collected fee must be committed');
    assert.equal((await master.getGetBuybackState()).totalBuybacks, 1n, 'the buyback must be committed too');
});

// ═══════════════ F-23 — the principal is never locked by the reward pool ═══════════════

test('F-23: the principal can always be withdrawn, even with an empty reward pool', async () => {
    const { bc, owner, alice, master, masterAddr } = await deploy(1000);

    expectCommitted(
        await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 5_000n * QSR, receiver: masterAddr }),
        'minting into custody'
    );

    const custody = await QuasarWallet.fromInit(masterAddr, masterAddr);
    expectCommitted(
        await master.send(bc.sender(custody.address), { value: toNano('0.1') }, {
            $$type: 'TokenNotification',
            queryId: 0n,
            amount: 1_000n * QSR,
            from: alice.address,
            forwardPayload: beginCell().endCell().asSlice()
        }),
        'the deposit notification'
    );
    assert.equal(await master.getGetPendingQsrDeposit(alice.address), 1_000n * QSR, 'the deposit must be credited to the staker');

    expectCommitted(await master.send(bc.sender(alice.address), { value: toNano('0.1') }, { $$type: 'Stake', amount: 1_000n * QSR }), 'staking');
    assert.equal((await master.getGetStakingConfig()).totalStaked, 1_000n * QSR, 'the stake must be accounted');
    assert.equal(await master.getGetReserveBalance(), 0n, 'no fee revenue means an empty reward pool');

    bc.now = (bc.now ?? 0) + 31 * DAY;

    const unstakeRes = await master.send(bc.sender(alice.address), { value: toNano('0.1') }, { $$type: 'Unstake', amount: 1_000n * QSR });
    console.log('[F-23 evidence] unstake tree: ' + describe(unstakeRes));
    expectCommitted(unstakeRes, 'the withdrawal with an empty reward pool');
    assert.equal(await master.getGetCustodyBalance(), 0n, 'the custody balance must be released');
    assert.equal(await master.getGetStakeInfo(alice.address), null, 'the stake record must be closed');

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, masterAddr));
    assert.equal((await aliceC.getGetWalletData()).balance, 1_000n * QSR, 'the principal must come back to the staker');
});

// ═══════════════ Source invariants ═══════════════

test('hardening source invariants (F-21/F-22/F-23)', () => {
    const master = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
    const defi = readFileSync(join(__dirname, '..', 'contracts', 'quasar_defi.tact'), 'utf8');

    assert.ok(master.includes('message(0xd53276db) TokenExcesses'), 'excesses must use the TEP-74 opcode');
    assert.ok(defi.includes('message(0xd53276db) TokenExcesses'), 'the DeFi file must declare the same message');
    assert.ok(master.includes('body: TokenExcesses{ queryId: msg.queryId }.toCell()'), 'excesses bodies must carry the request query id');
    assert.ok(!master.includes('"Excess returned"'), 'the burn refund must not be an opaque comment body');
    assert.ok(
        master.includes('return accrued > self.stakingRewardsPool ? self.stakingRewardsPool : accrued;'),
        'staking rewards must be capped by the fee-funded pool (F-23)'
    );
    assert.ok(
        master.includes('mode: SendPayGasSeparately | SendIgnoreErrors, body: EventBuybackExecuted'),
        'the buyback receipt must not consume the remaining-value slot (F-22)'
    );
});
