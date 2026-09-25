import test from 'node:test';
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

function dump(label: string, res: any) {
    for (const t of res.transactions) {
        const d = t.description || {};
        const c = d.computePhase || {};
        const a = d.actionPhase || {};
        let op = 'nobody';
        try { if (t.inMessage?.body) op = 'op:' + t.inMessage.body.beginParse().loadUint(32).toString(); } catch { op = 'bounce'; }
        console.log(`  [${label}] to:${t.inMessage?.info?.dest?.toString?.().slice(0, 10)} ${op} compute:${c.success} exit:${c.exitCode} action:${a.success} rc:${a.resultCode} aborted:${d.aborted}`);
    }
}

test('debug: seeded loop per-case trace', async () => {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const content = beginCell().storeUint(1, 8).storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json').endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const masterC = bc.openContract(masterRaw);
    await masterC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });
    const defi = await QuasarDeFi.fromInit(owner.address, masterRaw.address);
    const defiC = bc.openContract(defi);
    await defiC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 2n });
    await masterC.send(owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetDefiAddress', defiAddress: defi.address });

    const lp = await bc.treasury('property-lp');
    const initialTon = 10n * toNano('1');
    const initialQsr = 100n * QSR;
    const wallet = await QuasarWallet.fromInit(defi.address, masterRaw.address);
    const walletC = bc.openContract(wallet);

    // bootstrap + fund (harness logic)
    const sink = await bc.treasury('defi-bootstrap-sink');
    await masterC.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Mint', amount: 1_000_000n * QSR, receiver: sink.address });
    await masterC.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Mint', amount: initialQsr, receiver: defi.address });
    await defiC.send(bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount: initialQsr, from: lp.address, forwardPayload: beginCell().endCell().asSlice()
    });
    const add = await defiC.send(lp.getSender(), { value: initialTon + toNano('1') }, {
        $$type: 'AddLiquidity', tonAmount: initialTon, qsrAmount: initialQsr
    });
    console.log('ADD aborted:', add.transactions.some((t: any) => t.description?.aborted));

    let seed = 0x5eed1234;
    const nextTradeBps = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return 100 + (seed % 2400);
    };
    const feeBps = await defiC.getFeeConfig();

    for (let i = 0; i < 16; i++) {
        const before = await defiC.getPoolInfo();
        const tradeBps = BigInt(nextTradeBps());
        const tonToQsr = i % 2 === 0;
        const inputReserve = tonToQsr ? before.tonReserve : before.qsrReserve;
        const input = inputReserve * tradeBps / 10000n;

        if (tonToQsr) {
            const gross = input * before.qsrReserve / (before.tonReserve + input);
            const fee = gross * feeBps / 10000n;
            const expectedOut = gross - fee;
            const swap = await defiC.send(lp.getSender(), { value: input + toNano('0.5') }, {
                $$type: 'SwapToQSR', tonAmount: input, minQsrOut: expectedOut
            });
            const failed = swap.transactions.some((t: any) => t.description?.computePhase?.success === false);
            const after = await defiC.getPoolInfo();
            const okR = after.tonReserve === before.tonReserve + input && after.qsrReserve === before.qsrReserve - expectedOut;
            console.log(`case ${i} T2Q input=${input} exp=${expectedOut} failed=${failed} reserves_ok=${okR} dTon=${after.tonReserve - before.tonReserve} dQsr=${after.qsrReserve - before.qsrReserve}`);
            if (failed || !okR) dump(`case${i}`, swap);
        } else {
            const gross = input * before.tonReserve / (before.qsrReserve + input);
            const fee = gross * feeBps / 10000n;
            const expectedOut = gross - fee;
            await masterC.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Mint', amount: input, receiver: defi.address });
            await defiC.send(bc.sender(wallet.address), { value: toNano('0.1') }, {
                $$type: 'TokenNotification', queryId: 0n, amount: input, from: lp.address, forwardPayload: beginCell().endCell().asSlice()
            });
            const swap = await defiC.send(lp.getSender(), { value: toNano('0.5') }, {
                $$type: 'SwapToTON', qsrAmount: input, minTonOut: expectedOut
            });
            const failed = swap.transactions.some((t: any) => t.description?.computePhase?.success === false);
            const after = await defiC.getPoolInfo();
            const okR = after.qsrReserve === before.qsrReserve + input && after.tonReserve === before.tonReserve - expectedOut;
            console.log(`case ${i} Q2T input=${input} exp=${expectedOut} failed=${failed} reserves_ok=${okR} dQsr=${after.qsrReserve - before.qsrReserve} dTon=${after.tonReserve - before.tonReserve}`);
            if (failed || !okR) dump(`case${i}`, swap);
        }
    }
});
