import test from 'node:test';
import assert from 'node:assert/strict';
import { Address, beginCell } from '@ton/core';
import {
    QuasarMaster,
    loadDeploy,
    loadMint,
    loadTokenNotification,
    storeDeploy,
    storeMint,
    storeTokenNotification
} from '../build/quasar_QuasarMaster.js';
import {
    QuasarDeFi,
    loadAddLiquidity,
    loadSwapToTON,
    loadSetPaused,
    loadSetMaxTradeBps,
    loadDefiPayout,
    storeAddLiquidity,
    storeSwapToTON,
    storeSetPaused,
    storeSetMaxTradeBps,
    storeDefiPayout
} from '../build/quasar_defi_QuasarDeFi.js';

const owner = Address.parseRaw(`0:${'00'.repeat(32)}`);
const content = beginCell()
    .storeUint(1, 8)
    .storeStringTail('https://quasar-ton.netlify.app/metadata.json')
    .endCell();
const walletCode = beginCell().storeUint(0, 1).endCell();

test('master and DeFi init data produce deterministic addresses', async () => {
    const masterA = await QuasarMaster.fromInit(owner, content, walletCode);
    const masterB = await QuasarMaster.fromInit(owner, content, walletCode);
    const defi = await QuasarDeFi.fromInit(owner, masterA.address);

    assert.equal(masterA.address.toRawString(), masterB.address.toRawString());
    assert.notEqual(masterA.address.toRawString(), defi.address.toRawString());
    assert.ok(masterA.init);
    assert.ok(defi.init);
});

test('master deployment and mint messages round-trip through their BOCs', () => {
    const deploy = beginCell()
        .store(storeDeploy({ $$type: 'Deploy', queryId: 42n }))
        .endCell();
    const mint = beginCell()
        .store(storeMint({ $$type: 'Mint', amount: 1_000_000_000n, receiver: owner }))
        .endCell();

    assert.deepEqual(loadDeploy(deploy.beginParse()), {
        $$type: 'Deploy',
        queryId: 42n
    });
    const parsedMint = loadMint(mint.beginParse());
    assert.equal(parsedMint.amount, 1_000_000_000n);
    assert.equal(parsedMint.receiver.toRawString(), owner.toRawString());
});

test('DeFi liquidity and swap messages preserve coin amounts', () => {
    const liquidity = beginCell()
        .store(storeAddLiquidity({
            $$type: 'AddLiquidity',
            tonAmount: 2_000_000_000n,
            qsrAmount: 5_000_000_000n
        }))
        .endCell();
    const swap = beginCell()
        .store(storeSwapToTON({
            $$type: 'SwapToTON',
            qsrAmount: 250_000_000n,
            minTonOut: 100_000_000n
        }))
        .endCell();

    assert.deepEqual(loadAddLiquidity(liquidity.beginParse()), {
        $$type: 'AddLiquidity',
        tonAmount: 2_000_000_000n,
        qsrAmount: 5_000_000_000n
    });
    assert.deepEqual(loadSwapToTON(swap.beginParse()), {
        $$type: 'SwapToTON',
        qsrAmount: 250_000_000n,
        minTonOut: 100_000_000n
    });
});

test('DeFi risk controls preserve pause and trade-limit settings', () => {
    const pause = beginCell()
        .store(storeSetPaused({ $$type: 'SetPaused', paused: true }))
        .endCell();
    const tradeLimit = beginCell()
        .store(storeSetMaxTradeBps({ $$type: 'SetMaxTradeBps', maxTradeBps: 3000n }))
        .endCell();

    assert.deepEqual(loadSetPaused(pause.beginParse()), {
        $$type: 'SetPaused',
        paused: true
    });
    assert.deepEqual(loadSetMaxTradeBps(tradeLimit.beginParse()), {
        $$type: 'SetMaxTradeBps',
        maxTradeBps: 3000n
    });
});

test('QSR deposit and payout messages preserve their ownership fields', () => {
    const notification = beginCell()
        .store(storeTokenNotification({
            $$type: 'TokenNotification',
            queryId: 7n,
            amount: 5_000_000_000n,
            from: owner,
            forwardPayload: beginCell().endCell().beginParse()
        }))
        .endCell();
    const payout = beginCell()
        .store(storeDefiPayout({
            $$type: 'DefiPayout',
            queryId: 8n,
            amount: 2_000_000_000n,
            destination: owner
        }))
        .endCell();

    const parsedNotification = loadTokenNotification(notification.beginParse());
    assert.equal(parsedNotification.amount, 5_000_000_000n);
    assert.equal(parsedNotification.from.toRawString(), owner.toRawString());
    assert.equal(loadDefiPayout(payout.beginParse()).destination.toRawString(), owner.toRawString());
});