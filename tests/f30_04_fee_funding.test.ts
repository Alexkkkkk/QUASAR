/**
 * F-30-04 regression — fee legs must be funded the way the TON reference
 * implementation funds them.
 *
 * docs/AUDIT_2026-09-30.md: "Fee legs are funded by the wallet, not by the
 * inbound value (open). The residual of the inbound message stays on the
 * sender wallet instead of being forwarded with mode 64 and refunded by the
 * receiver."
 *
 * Final design (after the WIP experiment proved TON allows only ONE
 * remaining-value action per transaction — forwarding the whole inbound value
 * with the internal_transfer leg while also paying the 0.05 TON FeeTransfer
 * leg fails with action exit code 37):
 *   - both contract legs stay balance-funded (F-19 invariant),
 *   - the residual of the inbound message is returned to
 *     `response_destination` by the FINAL excesses action — the explicit
 *     explicit residual (inbound minus legs minus gas headroom), sent with
 *     SendPayGasSeparately | SendIgnoreErrors — the refund flow of the TEP-74
 *     reference implementation, so no residual is stranded on the sender wallet,
 *   - the receiving wallet keeps refunding its own excess (F-21).
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

interface OutMsg { to: string; value: bigint; bodyOp?: bigint }

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
        let op: bigint | undefined;
        try {
            const body: any = message?.body;
            if (body?.beginParse) {
                const cs = body.beginParse();
                if (cs.bits >= 32) op = cs.loadUint(32);
            }
        } catch { /* not decodable — ignore */ }
        found.push({ to: String(info.dest), value: info.value?.coins ?? 0n, bodyOp: op });
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
            const outs = outMessagesOf(tx).map((m) => `${m.to.slice(0, 14)}=${m.value}@0x${m.bodyOp?.toString(16) ?? '?'}`).join(',');
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

test('F-30-04 on-chain: the inbound residual is refunded to response_destination, not stranded on the sender wallet', async () => {
    const { bc, owner, alice, bob, master, masterAddr } = await deploy();

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, masterAddr));
    const bobC = bc.openContract(await QuasarWallet.fromInit(bob.address, masterAddr));
    const bobWalletAddr = (await QuasarWallet.fromInit(bob.address, masterAddr)).address;

    expectCommitted(
        await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address }),
        'minting'
    );
    assert.equal((await aliceC.getGetWalletData()).balance, 1_000n * QSR, 'precondition: alice holds 1,000 QSR');

    // A generous gas attachment: before the fix the unspent residual simply
    // stayed on the sender wallet balance.
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

    // 1. The sender wallet must return the unspent residual to
    // response_destination as its final outgoing message (the two balance-
    // funded legs go first; the excesses body carries op 0xd53276db). The
    // residual is identified by destination and amount: before the fix no
    // such message existed at all.
    const senderTx = txTo(transferRes, aliceC.address);
    assert.ok(senderTx, 'the sender wallet transaction must exist — ' + describe(transferRes));
    const residual = outMessagesOf(senderTx!).filter((m) => sameAddress(m.to, alice.address) && m.value > toNano('0.3'));
    assert.equal(residual.length, 1, 'the sender wallet must return exactly one residual refund to response_destination — ' + describe(transferRes));
    assert.ok(
        residual[0].value > 0n && residual[0].value < toNano('0.5'),
        `the residual refund must carry the unspent residual (attach 0.5 minus the 0.09 TON legs and gas) — got ${residual[0].value} — ` + describe(transferRes)
    );
    assert.ok(
        residual[0].bodyOp === undefined || residual[0].bodyOp === 0xd53276dbn,
        'the residual refund must be an excesses#d53276db message — ' + describe(transferRes)
    );

    // 2. The receiving wallet keeps refunding its own excess (F-21).
    const receiverTx = txTo(transferRes, bobWalletAddr);
    assert.ok(receiverTx, 'the receiving wallet transaction must exist — ' + describe(transferRes));
    const refunded = outMessagesOf(receiverTx!).filter((m) => sameAddress(m.to, alice.address) && m.value > 0n);
    assert.equal(refunded.length, 1, 'the receiving wallet must still return its excess to response_destination (F-21) — ' + describe(transferRes));
    assert.ok(refunded[0].value > 0n, 'the receiver excess refund must carry value — ' + describe(transferRes));

    // 3. Jetton accounting is unchanged.
    const fee = (100n * QSR * 30n) / 10_000n;
    assert.equal((await bobC.getGetWalletData()).balance, 100n * QSR - fee, 'the recipient is credited amount minus fee');
    assert.equal((await aliceC.getGetWalletData()).balance, 900n * QSR, 'the sender is debited the full amount');
});

test('F-30-04 source: both legs stay balance-funded and the residual is refunded as the final excesses action', () => {
    const commonSrc = readFileSync(join(root, 'contracts', 'quasar_common.tact'), 'utf8');
    const start = commonSrc.indexOf('receive(msg: TokenTransfer)');
    const end = commonSrc.indexOf('receive(msg: PoolPayout)');
    const transfer = commonSrc.slice(start, end);

    assert.match(
        transfer,
        /bounce: true, mode: SendPayGasSeparately, body: FeeTransfer/,
        'the fee leg must stay bounceable and balance-funded (F-19 invariant)'
    );
    assert.match(
        transfer,
        /value: ton\("0\.02"\),\s*bounce: true,\s*mode: SendPayGasSeparately,/,
        'the internal_transfer leg must stay balance-funded at 0.02 TON'
    );
    assert.match(
        transfer,
        /let residual: Int = context\(\)\.value - ton\("0\.07"\) - ton\("0\.02"\);/,
        'the inbound residual must be computed explicitly (legs + gas headroom), not left on the wallet'
    );
    assert.match(
        transfer,
        /send\(SendParameters\{ to: msg\.responseDestination, value: residual, bounce: false, mode: SendPayGasSeparately \| SendIgnoreErrors, body: TokenExcesses\{ queryId: msg\.queryId \}\.toCell\(\) \}\);/,
        'the residual must be refunded to response_destination as the final excesses action'
    );
    assert.ok(
        transfer.indexOf('body: InternalTransfer') < transfer.indexOf('let residual: Int'),
        'the residual refund must be the last action (F-20 invariant)'
    );
});
