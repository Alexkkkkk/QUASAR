/**
 * Doc-conformance pass — branch fix/ton-doc-conformance-2026-09-26.
 *
 *   F-24 TEP-89: the Jetton master had no `provide_wallet_address` handler, so
 *        it was not a discoverable Jetton master at all. The standard requires
 *        the master to answer `provide_wallet_address#2c76b973` with a
 *        `take_wallet_address#d1735400` message sent with mode 64, where
 *        `owner_address:(Maybe ^MsgAddress)` is a *ref*.
 *   F-25 bounce recovery: the wallet restores the credited amount when its own
 *        outgoing transfer is rejected. TON truncates a bounced body, so the
 *        handler must still be reachable from a real bounce. This test drives a
 *        genuine bounce (a peer wallet rejects the credit) and asserts the
 *        observed effect instead of trusting the source text.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beginCell, Cell, internal, toNano } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarWallet } from '../build/quasar_QuasarWallet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const QSR = 1_000_000_000n;
const METADATA_URL = 'https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json';

function allOutMessages(tx: any): any[] {
    const raw: any = tx?.outMessages;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw.values === 'function') return Array.from(raw.values());
    return Object.values(raw);
}

function describe(res: any): string {
    return (res?.transactions ?? [])
        .map((tx: any, i: number) => {
            const d: any = tx?.description ?? {};
            const cp = d.computePhase;
            const ap = d.actionPhase;
            return `tx${i} dest=${String(tx?.inMessage?.info?.dest ?? '').slice(0, 16)} ` +
                `bounced=${tx?.inMessage?.info?.bounced} ` +
                `compute=${cp ? (cp.success ? 'ok' : 'FAIL/' + cp.exitCode) : '-'} ` +
                `action=${ap ? (ap.success ? 'ok' : 'FAIL/' + ap.resultCode) : '-'} ` +
                `out=${allOutMessages(tx).length}`;
        })
        .join(' ; ');
}

/** Every outgoing body with a 32-bit opcode in the transaction tree. */
function opcodeBodies(res: any): Cell[] {
    const bodies: Cell[] = [];
    for (const tx of res?.transactions ?? []) {
        for (const msg of allOutMessages(tx)) {
            const body = msg?.body;
            if (body && typeof body.beginParse === 'function' && body.bits.length >= 32) bodies.push(body);
        }
    }
    return bodies;
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
    await master.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Deploy', queryId: 1n });
    return { bc, owner, alice, bob, master, masterAddr: raw.address };
}

// ═══════════════════════ F-24 — TEP-89 discovery ═══════════════════════

test('F-24 TEP-89: the master answers provide_wallet_address with take_wallet_address', async () => {
    const { bc, owner, alice, master, masterAddr } = await deploy(1000);
    const expected = (await QuasarWallet.fromInit(alice.address, masterAddr)).address;

    // The on-chain getter and the StateInit-derived address must agree, which is
    // what makes the discovery response trustworthy.
    assert.ok((await master.getGetWalletAddress(alice.address)).equals(expected), 'getter and StateInit must agree');

    const res = await master.send(bc.sender(owner.address), { value: toNano('0.05') }, {
        $$type: 'ProvideWalletAddress',
        queryId: 11n,
        ownerAddress: alice.address,
        includeAddress: true
    } as any);
    console.log('[F-24 evidence] discovery tree: ' + describe(res));

    const take = opcodeBodies(res).map((c) => ({ op: c.beginParse().loadUint(32), cell: c })).filter((x) => x.op === 0xd1735400);
    assert.equal(take.length, 1, 'exactly one take_wallet_address response is expected — ' + describe(res));

    const s = take[0].cell.beginParse();
    console.log('[F-24 evidence] take_wallet_address raw = ' + take[0].cell.toBoc().toString('hex'));
    assert.equal(s.loadUint(32), 0xd1735400, 'opcode must be take_wallet_address#d1735400');
    const qid = s.loadUintBig(64);
    const wallet = s.loadAddress();
    const maybeBit = s.loadBit();
    console.log(`[F-24 evidence] queryId=${qid} wallet=${wallet.toString()} maybeBit=${maybeBit} bitsAfterMaybe=${s.remainingBits}`);
    assert.equal(qid, 11n, 'the response must echo the request query id');
    assert.ok(wallet.equals(expected), 'the response must carry the derived wallet address');
    assert.equal(maybeBit, true, 'include_address=true must honour the Maybe ref');
    const ownerCell = s.loadRef();
    const echoed = ownerCell.beginParse().loadAddress();
    console.log('[F-24 evidence] echoed owner = ' + echoed.toString());
    assert.ok(echoed.equals(alice.address), 'the echoed owner must match the request');
    assert.equal(s.remainingBits, 0, 'the response body must be exactly the standard layout');
});

test('F-24 TEP-89: include_address=false omits the owner ref and a starved caller gets no response', async () => {
    const { bc, owner, alice, master, masterAddr } = await deploy(1000);
    const expected = (await QuasarWallet.fromInit(alice.address, masterAddr)).address;

    const res = await master.send(bc.sender(owner.address), { value: toNano('0.05') }, {
        $$type: 'ProvideWalletAddress',
        queryId: 12n,
        ownerAddress: alice.address,
        includeAddress: false
    } as any);
    const take = opcodeBodies(res).map((c) => ({ op: c.beginParse().loadUint(32), cell: c })).filter((x) => x.op === 0xd1735400);
    assert.equal(take.length, 1, 'the response must still be sent — ' + describe(res));
    const s = take[0].cell.beginParse();
    assert.equal(s.loadUint(32), 0xd1735400);
    assert.equal(s.loadUintBig(64), 12n);
    assert.ok(s.loadAddress().equals(expected));
    assert.equal(s.loadBit(), false, 'include_address=false must omit the owner ref');

    // TEP-89: below 0.0061 TON the master cannot fund the response, so it must
    // not emit one (the standard allows an exception instead).
    const starved = await master.send(bc.sender(owner.address), { value: toNano('0.002') }, {
        $$type: 'ProvideWalletAddress',
        queryId: 13n,
        ownerAddress: alice.address,
        includeAddress: false
    } as any);
    const starvedResponses = opcodeBodies(starved).filter((c) => c.beginParse().loadUint(32) === 0xd1735400);
    assert.equal(
        starvedResponses.length,
        0,
        'an underfunded discovery request must not produce a response — ' + describe(starved)
    );
});

// ═══════════════════ F-25 — bounce recovery is reachable ═══════════════════

test('F-25: a rejected transfer bounces back and re-credits the sending wallet', async () => {
    const { bc, owner, alice, bob, master, masterAddr } = await deploy(1000);

    await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address });
    // Deploy bob's wallet so the rejection comes from the handler, not from an
    // uninitialised account.
    await master.send(bc.sender(owner.address), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1n * QSR, receiver: bob.address });

    const aliceWalletRaw = await QuasarWallet.fromInit(alice.address, masterAddr);
    const bobWalletRaw = await QuasarWallet.fromInit(bob.address, masterAddr);
    const aliceC = bc.openContract(aliceWalletRaw);
    assert.equal((await aliceC.getGetWalletData()).balance, 1_000n * QSR, 'precondition: alice holds 1,000 QSR');

    // A recipient wallet rejects a credit it did not expect: `from` is bob, but
    // the message was sent by alice's wallet, so `sender() != wallet(msg.from)`.
    // TON then bounces back to `src` — alice's wallet.
    const body = beginCell()
        .storeUint(0x178d4519, 32)
        .storeUint(4242n, 64)
        .storeCoins(100n * QSR)
        .storeAddress(bob.address)
        .storeAddress(alice.address)
        .storeCoins(0n)
        .endCell();

    const msg: any = internal({ to: bobWalletRaw.address, value: toNano('0.1'), bounce: true, body });
    // The sandbox helper leaves `src` unset; a bounce can only be routed when the
    // original sender is recorded, so pin it to alice's Jetton wallet.
    msg.info.src = aliceWalletRaw.address;

    const res = await bc.sendMessage(msg);
    console.log('[F-25 evidence] bounce tree: ' + describe(res));

    const bobTx = (res.transactions ?? []).find((tx: any) => {
        const dest = tx?.inMessage?.info?.dest;
        try { return dest && dest.equals(bobWalletRaw.address) } catch { return false }
    });
    assert.ok(bobTx, 'the receiving wallet must be in the tree — ' + describe(res));
    assert.equal((bobTx as any).description.computePhase?.success, false, 'the credit must be rejected — ' + describe(res));

    const bounced = (res.transactions ?? []).filter((t: any) => t?.inMessage?.info?.bounced === true);
    console.log('[F-25 evidence] bounced inbound messages: ' + bounced.length);

    const after = (await aliceC.getGetWalletData()).balance;
    console.log('[F-25 evidence] alice wallet balance after the bounce: ' + after.toString());
    assert.ok(
        bounced.length >= 1,
        'the rejected transfer must produce a bounced message back to src — ' + describe(res)
    );
    assert.ok(
        after > 1_000n * QSR,
        'the bounced amount must be restored to the sending wallet through the bounced<InternalTransfer> handler — ' +
        describe(res)
    );
});
