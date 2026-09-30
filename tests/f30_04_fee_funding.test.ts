/**
 * F-30-04 regression — fee legs must be funded the way the TON reference
 * implementation funds them.
 *
 * docs/AUDIT_2026-09-30.md: "Fee legs are funded by the wallet, not by the
 * inbound value (open). The residual of the inbound message stays on the
 * sender wallet instead of being forwarded with mode 64 and refunded by the
 * receiver."
 *
 * Reference behaviour (TEP-74 jetton wallet): the wallet forwards the inbound
 * message value with the internal_transfer leg (mode 64 = SendRemainingValue)
 * and the RECEIVING wallet refunds whatever the transfer did not spend back
 * to response_destination as an excesses message. The Quasar fee leg
 * (FeeTransfer, 0.05 TON to the master) stays a balance-funded
 * SendPayGasSeparately send — see tests/audit_fixes.test.ts (F-19).
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
const root = join(__dirname, '..');
const walletCode = Cell.fromBoc(readFileSync(join(root, 'build', 'quasar_QuasarWallet.code.boc')))[0];
const METADATA_URL = 'https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json';
const QSR = 1_000_000_000n;

interface OutMsg { to: string; value: bigint }

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

async function deploy() {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const alice = await bc.treasury('alice');
    const bob = await bc.treasury('bob');
    const content = beginCell().storeUint(1, 8).storeStringTail(METADATA_URL).endCell();
    const raw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(raw);
    expectCommitted(await master.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Deploy', queryId: 1n }), 'deployment');
    return { bc, owner, alice, bob, master, masterAddr: raw.address };
}

test('F-30-04 on-chain: the internal_transfer leg forwards the inbound value (mode 64), the receiver refunds the excess', async () => {
    const { bc, owner, alice, bob, master, masterAddr } = await deploy();

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, masterAddr));
    const bobC = bc.openContract(await QuasarWallet.fromInit(bob.address, masterAddr));
    const bobWalletAddr = (await QuasarWallet.fromInit(bob.address, masterAddr)).address;

    expectCommitted(
        await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address }),
        'minting'
    );
    assert.equal((await aliceC.getGetWalletData()).balance, 1_000n * QSR, 'precondition: alice holds 1,000 QSR');

    // A generous gas attachment: the sender must not be able to strand it.
    const attach = toNano('0.5');
    const transferRes = await aliceC.send(bc.sender(alice.address), { value: attach }, {
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

    // 1. The sender wallet's internal_transfer leg must carry the forwarded
    // inbound value (mode 64), not the fixed 0.02 TON balance-funded amount.
    const senderTx = txTo(transferRes, aliceC.address);
    assert.ok(senderTx, 'the sender wallet transaction must exist — ' + describe(transferRes));
    const toBobWallet = outMessagesOf(senderTx!).filter((m) => sameAddress(m.to, bobWalletAddr));
    assert.equal(toBobWallet.length, 1, 'the sender wallet must send exactly one internal_transfer to the destination wallet — ' + describe(transferRes));
    assert.ok(
        toBobWallet[0].value > toNano('0.05'),
        `the internal_transfer leg must forward the inbound value (mode 64), not the fixed 0.02 TON balance-funded amount — got ${toBobWallet[0].value} — ` + describe(transferRes)
    );

    // 2. The receiving wallet must refund the unspent excess to
    // response_destination (TEP-74 step 3), so nothing is stranded.
    const receiverTx = txTo(transferRes, bobWalletAddr);
    assert.ok(receiverTx, 'the receiving wallet transaction must exist — ' + describe(transferRes));
    const refunded = outMessagesOf(receiverTx!).filter((m) => sameAddress(m.to, alice.address));
    assert.equal(refunded.length, 1, 'the receiving wallet must return exactly one excess message to response_destination — ' + describe(transferRes));
    assert.ok(refunded[0].value > 0n, 'the excess refund must carry value — ' + describe(transferRes));

    // 3. Balances: the tokens moved minus the 0.30% fee; the sender wallet
    // must not keep the attached TON residual.
    const fee = (100n * QSR * 30n) / 10_000n;
    assert.equal((await bobC.getGetWalletData()).balance, 100n * QSR - fee, 'the recipient is credited amount minus fee');
    assert.equal((await aliceC.getGetWalletData()).balance, 900n * QSR, 'the sender is debited the full amount');
});

test('F-30-04 source: the TokenTransfer internal_transfer leg uses SendRemainingValue and the fee leg stays balance-funded', () => {
    const commonSrc = readFileSync(join(root, 'contracts', 'quasar_common.tact'), 'utf8');
    const start = commonSrc.indexOf('receive(msg: TokenTransfer)');
    const end = commonSrc.indexOf('receive(msg: PoolPayout)');
    const transfer = commonSrc.slice(start, end);

    assert.match(
        transfer,
        /mode: SendRemainingValue,/,
        'the internal_transfer leg must forward the inbound value with mode 64 (SendRemainingValue)'
    );
    assert.match(
        transfer,
        /bounce: true, mode: SendPayGasSeparately, body: FeeTransfer/,
        'the fee leg must stay bounceable and balance-funded (F-19 invariant)'
    );
    assert.ok(
        transfer.indexOf('body: FeeTransfer') < transfer.indexOf('SendRemainingValue'),
        'the balance-funded fee leg must be dispatched before the remaining-value leg'
    );
});
