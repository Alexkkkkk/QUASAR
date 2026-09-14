import test from 'node:test';
import assert from 'node:assert/strict';
import { Address, beginCell } from '@ton/core';
import {
    QuasarMaster,
    loadDeploy,
    loadMint,
    storeDeploy,
    storeMint
} from '../build/quasar_QuasarMaster.js';
import {
    QuasarDeFi,
    loadAddLiquidity,
    loadSwapToTON,
    storeAddLiquidity,
    storeSwapToTON
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