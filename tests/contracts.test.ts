import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Address, beginCell } from '@ton/core';
import {
    QuasarMaster,
    loadAIRebalance,
    loadAISetBuybackDirect,
    loadClaimReferralRewards,
    loadDeploy,
    loadInternalTransfer,
    loadMint,
    loadTokenNotification,
    storeDeploy,
    storeAIRebalance,
    storeAISetBuybackDirect,
    storeClaimReferralRewards,
    storeInternalTransfer,
    storeMint,
    storeTokenNotification
} from '../build/quasar_QuasarMaster.js';
import {
    QuasarDeFi,
    loadAddLiquidity,
    loadSwapToTON,
    loadSetPaused,
    loadSetMaxTradeBps,
    loadFundFarm,
    loadSetFarmEnabled,
    loadDefiPayout,
    loadTokenTransfer,
    storeAddLiquidity,
    storeSwapToTON,
    storeSetPaused,
    storeSetMaxTradeBps,
    storeFundFarm,
    storeSetFarmEnabled,
    storeDefiPayout,
    storeTokenTransfer
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

test('Jetton messages use the TON standard opcodes', () => {
    const transfer = beginCell()
        .store(storeTokenTransfer({
            $$type: 'TokenTransfer',
            queryId: 1n,
            amount: 2_000_000_000n,
            destination: owner,
            responseDestination: owner,
            customPayload: null,
            forwardTonAmount: 0n,
            forwardPayload: beginCell().endCell().beginParse()
        }))
        .endCell();
    const internal = beginCell()
        .store(storeInternalTransfer({
            $$type: 'InternalTransfer',
            queryId: 2n,
            amount: 1_000_000_000n,
            from: owner,
            responseDestination: owner,
            forwardTonAmount: 0n,
            forwardPayload: beginCell().endCell().beginParse()
        }))
        .endCell();

    assert.equal(transfer.beginParse().loadUint(32), 0x0f8a7ea5);
    assert.equal(internal.beginParse().loadUint(32), 0x178d4519);
    assert.equal(loadTokenTransfer(transfer.beginParse()).amount, 2_000_000_000n);
    assert.equal(loadInternalTransfer(internal.beginParse()).amount, 1_000_000_000n);
});

test('DeFi derives the same Jetton wallet code as the master', () => {
    assert.deepEqual(
        readFileSync('build/quasar_QuasarWallet.code.boc'),
        readFileSync('build/quasar_defi_QuasarWallet.code.boc')
    );
});

test('funded farm controls round-trip through their BOCs', () => {
    const funding = beginCell()
        .store(storeFundFarm({ $$type: 'FundFarm', amount: 10_000_000_000n }))
        .endCell();
    const enabled = beginCell()
        .store(storeSetFarmEnabled({ $$type: 'SetFarmEnabled', enabled: true }))
        .endCell();

    assert.equal(loadFundFarm(funding.beginParse()).amount, 10_000_000_000n);
    assert.equal(loadSetFarmEnabled(enabled.beginParse()).enabled, true);
});

test('AI risk-control messages preserve hardened parameters', () => {
    const rebalance = beginCell()
        .store(storeAIRebalance({
            $$type: 'AIRebalance',
            queryId: 9n,
            targetFeeBps: 30n,
            targetBurnShare: 50n,
            recommendation: 'hold'
        }))
        .endCell();
    const buyback = beginCell()
        .store(storeAISetBuybackDirect({
            $$type: 'AISetBuybackDirect',
            queryId: 10n,
            enabled: true,
            threshold: 1_000_000_000n,
            cooldown: 3600n,
            burnPercent: 100n,
            reason: 'bounded'
        }))
        .endCell();

    assert.equal(loadAIRebalance(rebalance.beginParse()).targetFeeBps, 30n);
    assert.equal(loadAISetBuybackDirect(buyback.beginParse()).burnPercent, 100n);
});

test('referral rewards expose an explicit claim message', () => {
    const claim = beginCell()
        .store(storeClaimReferralRewards({ $$type: 'ClaimReferralRewards' }))
        .endCell();

    assert.equal(loadClaimReferralRewards(claim.beginParse()).$$type, 'ClaimReferralRewards');
});
