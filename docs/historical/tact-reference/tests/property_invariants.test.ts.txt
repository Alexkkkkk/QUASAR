/**
 * Deterministic invariant/property coverage for issue #63.
 *
 * These tests use a fixed-seed sequence against @ton/sandbox so CI stays
 * reproducible while still exercising multiple trade / LP / farm trajectories.
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
const QSR = 1_000_000_000n;
const DEADLINE = 2_000_000_000n;

interface Eco {
    bc: Blockchain;
    owner: any;
    master: any;
    masterAddr: Address;
    defi: any;
    defiAddr: Address;
}

async function deployEco(): Promise<Eco> {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const content = beginCell().storeUint(1, 8)
        .storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json')
        .endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(masterRaw);
    await master.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    const defiRaw = await QuasarDeFi.fromInit(owner.address, masterRaw.address);
    const defi = bc.openContract(defiRaw);
    await defi.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 2n });
    await master.send(owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetDefiAddress', defiAddress: defiRaw.address });

    return { bc, owner, master, masterAddr: masterRaw.address, defi, defiAddr: defiRaw.address };
}

async function creditDefiDeposit(eco: Eco, user: Address, amount: bigint) {
    const wallet = await QuasarWallet.fromInit(eco.defiAddr, eco.masterAddr);
    await eco.defi.send(eco.bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user, forwardPayload: beginCell().endCell().asSlice()
    });
}

async function creditMasterDeposit(eco: Eco, user: Address, amount: bigint) {
    const wallet = await QuasarWallet.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user, forwardPayload: beginCell().endCell().asSlice()
    });
}

function anyComputeFailed(res: any): boolean {
    return res.transactions.some((t: any) => t.description?.computePhase?.success === false);
}

function makePrng(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (state * 1664525 + 1013904223) >>> 0;
        return state;
    };
}

test('property: CPMM k is non-decreasing across a deterministic alternating swap path', async () => {
    const eco = await deployEco();
    const lp = await eco.bc.treasury('lp-seed');
    const trader = await eco.bc.treasury('trader-seed');

    await creditDefiDeposit(eco, lp.address, 40n * QSR);
    await eco.defi.send(lp.getSender(), { value: 40n * toNano('1') }, {
        $$type: 'AddLiquidity', tonAmount: 40n * toNano('1'), qsrAmount: 40n * QSR, minLpOut: 1n, deadline: DEADLINE
    });

    const rnd = makePrng(63);
    for (let step = 0; step < 10; step++) {
        const before = await eco.defi.getPoolInfo();
        const kBefore = before.tonReserve * before.qsrReserve;

        if (step % 2 === 0) {
            const qsrIn = BigInt((rnd() % 3) + 1) * QSR;
            await creditDefiDeposit(eco, trader.address, qsrIn);
            const quote = await eco.defi.getEstimateSwapToTon(qsrIn);
            await eco.defi.send(trader.getSender(), { value: toNano('0.5') }, {
                $$type: 'SwapToTON', qsrAmount: qsrIn, minTonOut: quote.tonOut, deadline: DEADLINE
            });
            const after = await eco.defi.getPoolInfo();
            assert.equal(after.qsrReserve - before.qsrReserve, qsrIn, 'QSR reserve must increase by the sold amount');
            assert.equal(before.tonReserve - after.tonReserve, quote.tonOut, 'TON reserve delta must match the quoted net output');
            assert.ok(after.tonReserve * after.qsrReserve >= kBefore, 'k must not decrease after a QSR→TON swap');
        } else {
            const tonIn = BigInt((rnd() % 2) + 1) * toNano('1');
            const quote = await eco.defi.getEstimateSwapToQsr(tonIn);
            await eco.defi.send(trader.getSender(), { value: tonIn + toNano('0.5') }, {
                $$type: 'SwapToQSR', tonAmount: tonIn, minQsrOut: quote.qsrOut, deadline: DEADLINE
            });
            const after = await eco.defi.getPoolInfo();
            assert.equal(after.tonReserve - before.tonReserve, tonIn, 'TON reserve must increase by the bought-in amount');
            assert.equal(before.qsrReserve - after.qsrReserve, quote.qsrOut, 'QSR reserve delta must match the quoted net output');
            assert.ok(after.tonReserve * after.qsrReserve >= kBefore, 'k must not decrease after a TON→QSR swap');
        }
    }
});

test('property: LP mint and burn quotes match actual reserve deltas', async () => {
    const eco = await deployEco();
    const lpA = await eco.bc.treasury('lp-a');
    const lpB = await eco.bc.treasury('lp-b');

    await creditDefiDeposit(eco, lpA.address, 20n * QSR);
    await eco.defi.send(lpA.getSender(), { value: 20n * toNano('1') }, {
        $$type: 'AddLiquidity', tonAmount: 20n * toNano('1'), qsrAmount: 20n * QSR, minLpOut: 1n, deadline: DEADLINE
    });

    const tonIn = 6n * toNano('1');
    const qsrIn = 6n * QSR;
    const estimatedLp = await eco.defi.getEstimateLpOut(tonIn, qsrIn);
    await creditDefiDeposit(eco, lpB.address, qsrIn);
    const beforeMint = await eco.defi.getLpBalance(lpB.address);
    const addRes = await eco.defi.send(lpB.getSender(), { value: tonIn }, {
        $$type: 'AddLiquidity', tonAmount: tonIn, qsrAmount: qsrIn, minLpOut: estimatedLp, deadline: DEADLINE
    });
    assert.ok(!anyComputeFailed(addRes), 'balanced LP add must execute');
    const afterMint = await eco.defi.getLpBalance(lpB.address);
    assert.equal(afterMint - beforeMint, estimatedLp, 'estimateLpOut must equal the minted LP on a balanced add');

    const burn = estimatedLp / 2n;
    const poolBefore = await eco.defi.getPoolInfo();
    const removeQuote = await eco.defi.getEstimateRemoveLiquidity(burn);
    await eco.defi.send(lpB.getSender(), { value: toNano('1') }, {
        $$type: 'RemoveLiquidity', lpAmount: burn, minTonOut: removeQuote.tonReserve, minQsrOut: removeQuote.qsrReserve, deadline: DEADLINE
    });
    const poolAfter = await eco.defi.getPoolInfo();
    assert.equal(poolBefore.tonReserve - poolAfter.tonReserve, removeQuote.tonReserve, 'estimated TON-out must match the actual reserve delta');
    assert.equal(poolBefore.qsrReserve - poolAfter.qsrReserve, removeQuote.qsrReserve, 'estimated QSR-out must match the actual reserve delta');
});

test('property: staking getters stay internally consistent across deterministic deposits', async () => {
    const eco = await deployEco();
    const alice = await eco.bc.treasury('alice-liability');
    const bob = await eco.bc.treasury('bob-liability');

    await creditMasterDeposit(eco, alice.address, 500n * QSR);
    await creditMasterDeposit(eco, bob.address, 500n * QSR);

    await eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'Stake', amount: 200n * QSR });
    await eco.master.send(bob.getSender(), { value: toNano('0.3') }, { $$type: 'Stake', amount: 300n * QSR });

    const reserve = await eco.master.getGetReserveBalance();
    const pendingAlice = await eco.master.getGetPendingQsrDeposit(alice.address);
    const pendingBob = await eco.master.getGetPendingQsrDeposit(bob.address);
    const stakeAlice = await eco.master.getGetStakeInfo(alice.address);
    const stakeBob = await eco.master.getGetStakeInfo(bob.address);
    const cfg = await eco.master.getGetStakingConfig();

    assert.equal(cfg.totalStaked, stakeAlice.amount + stakeBob.amount, 'the staking getter must equal the sum of user stakes');
    assert.equal(pendingAlice + pendingBob + stakeAlice.amount + stakeBob.amount, 1_000n * QSR, 'stake + pending deposit accounting must stay conserved');
    assert.ok(reserve >= 0n, 'reserve getter must stay readable after deterministic stake updates');
});
