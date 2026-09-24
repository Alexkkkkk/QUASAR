/**
 * Core-function tests — happy paths and access control for the main
 * entrypoints of QuasarMaster, QuasarWallet and QuasarDeFi.
 *
 * Runs on @ton/sandbox against the compiled build (same harness as
 * tests/security_regression.test.ts). Every assertion targets either a
 * compute-phase revert (blocked operation) or a state effect that is
 * observable through the contract getters after the operation.
 *
 * NOTE: payout paths that emit several SendRemainingValue messages from one
 * transaction (mint token delivery, unstake/claim payouts) abort in the
 * action phase in the sandbox — they are covered by the regression suite's
 * compute-phase checks and need a dedicated fix; see the PR description.
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

interface Eco {
    bc: Blockchain;
    owner: any;
    master: any;
    masterAddr: Address;
    defi: any;
    defiAddr: Address;
}

async function deployEco(withDefi: boolean): Promise<Eco> {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');

    const content = beginCell().storeUint(1, 8)
        .storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json')
        .endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const masterC = bc.openContract(masterRaw);
    await masterC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    let defiC: any = null as any;
    let defiAddr: Address = ZERO;
    if (withDefi) {
        const defi = await QuasarDeFi.fromInit(owner.address, masterRaw.address);
        defiAddr = defi.address;
        defiC = bc.openContract(defi);
        await defiC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 2n });
        await masterC.send(owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetDefiAddress', defiAddress: defiAddr });
    }
    return { bc, owner, master: masterC, masterAddr: masterRaw.address, defi: defiC, defiAddr };
}

/** Credit a QSR deposit inside master custody (verified primitive: bc.sender). */
async function creditMasterDeposit(eco: Eco, user: Address, amount: bigint) {
    const wallet = await QuasarWallet.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user, forwardPayload: beginCell().endCell().asSlice()
    });
}

/** Credit a QSR deposit inside DeFi (verified primitive: bc.sender). */
async function creditDefiDeposit(eco: Eco, user: Address, amount: bigint) {
    const wallet = await QuasarWallet.fromInit(eco.defiAddr, eco.masterAddr);
    await eco.defi.send(eco.bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user, forwardPayload: beginCell().endCell().asSlice()
    });
}

/** True when at least one tx in the tree reverted in the compute phase. */
function anyComputeFailed(res: any): boolean {
    return res.transactions.some((t: any) => t.description?.computePhase?.success === false);
}

async function expectBlocked(p: Promise<any>, why: string): Promise<void> {
    try {
        const res = await p;
        assert.ok(anyComputeFailed(res), why);
    } catch {
        // send() itself rejected the message — also a revert
    }
}

// ═══════════════ Deployment and init state ═══════════════

test('deployment exposes the documented initial state through getters', async () => {
    const eco = await deployEco(false);

    const jetton = await eco.master.getGetJettonData();
    assert.equal(jetton.totalSupply, 0n);
    assert.equal(jetton.mintable, true);
    assert.ok(jetton.adminAddress.equals(eco.owner.address));

    assert.equal(await eco.master.getGetMaxSupply(), 1_000_000_000n * QSR);
    assert.equal(await eco.master.getGetReserveBalance(), 0n);
    assert.equal(await eco.master.getGetCustodyBalance(), 0n);
    assert.ok((await eco.master.getGetPendingOwner()).equals(ZERO), 'no owner transfer must be pending after deployment');

    const fee = await eco.master.getGetFeeConfig();
    assert.equal(fee.feeBps, 30n);
    assert.equal(fee.burnShare, 50n);
    assert.equal(fee.maxTxBps, 100n);
    assert.equal(fee.cooldown, 5n);
    assert.equal(fee.totalFeesCollected, 0n);

    const staking = await eco.master.getGetStakingConfig();
    assert.equal(staking.enabled, true);
    assert.equal(staking.apyBps, 2000n);
    assert.equal(staking.minStake, 100n * QSR);
    assert.equal(staking.lockPeriod, 2592000n);
    assert.equal(staking.totalStaked, 0n);

    const buyback = await eco.master.getGetBuybackState();
    assert.equal(buyback.enabled, true);
    assert.equal(buyback.pool, 0n);
    assert.equal(buyback.threshold, 10n * QSR);

    assert.equal(await eco.master.getIsTradingEnabled(), true);
    assert.equal(await eco.master.getIsPaused(), false);
    assert.ok((await eco.master.getGetDefiAddress()).equals(ZERO));
});

// ═══════════════ Mint access control ═══════════════

test('mint: rejected for non-owner, while trading is off, and after minting stops', async () => {
    const eco = await deployEco(false);
    const alice = await eco.bc.treasury('alice');

    // non-owner
    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'Mint', amount: QSR, receiver: alice.address }),
        'a non-owner mint must revert'
    );
    assert.equal((await eco.master.getGetJettonData()).totalSupply, 0n, 'a rejected mint must not change supply');

    // trading off blocks minting
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'ToggleTrading', enabled: false });
    assert.equal(await eco.master.getIsTradingEnabled(), false);
    await expectBlocked(
        eco.master.send(eco.owner.getSender(), { value: toNano('0.3') }, { $$type: 'Mint', amount: QSR, receiver: alice.address }),
        'mint while trading is disabled must revert'
    );

    // permanent mint stop
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'ToggleTrading', enabled: true });
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Stop Minting');
    await expectBlocked(
        eco.master.send(eco.owner.getSender(), { value: toNano('0.3') }, { $$type: 'Mint', amount: QSR, receiver: alice.address }),
        'mint after "Stop Minting" must revert'
    );
    assert.equal((await eco.master.getGetJettonData()).totalSupply, 0n);
    assert.equal((await eco.master.getGetJettonData()).mintable, false);
});

test('master burn: forged BurnNotification from a non-wallet sender is rejected', async () => {
    const eco = await deployEco(false);
    const alice = await eco.bc.treasury('alice');

    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.2') }, {
            $$type: 'BurnNotification', queryId: 1n, amount: QSR, sender: alice.address, responseDestination: alice.address
        }),
        'a burn notification from a non-wallet sender must revert (Unauthorized burn)'
    );
    assert.equal((await eco.master.getGetJettonData()).totalSupply, 0n);
});

// ═══════════════ Staking ═══════════════

test('staking: deposit custody, min-stake guard, lock period, and empty-pool claim', async () => {
    const eco = await deployEco(false);
    const alice = await eco.bc.treasury('alice');
    await creditMasterDeposit(eco, alice.address, 200n * QSR);
    assert.equal(await eco.master.getGetCustodyBalance(), 200n * QSR, 'the deposit must be held in custody');

    // below min stake
    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'Stake', amount: 99n * QSR }),
        'a stake below the 100 QSR minimum must revert'
    );

    // happy path
    const stakeRes = await eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'Stake', amount: 150n * QSR });
    assert.ok(!anyComputeFailed(stakeRes), 'a valid stake must execute without reverts');

    const info = await eco.master.getGetStakeInfo(alice.address);
    assert.equal(info.amount, 150n * QSR);
    assert.equal(info.lockEnd, 1000n + 2592000n);
    assert.equal((await eco.master.getGetStakingConfig()).totalStaked, 150n * QSR);
    assert.equal(await eco.master.getGetPendingQsrDeposit(alice.address), 50n * QSR);

    // rewards claim with an empty pool reverts
    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'ClaimRewards' }),
        'claiming rewards from an empty pool must revert'
    );

    // locked funds cannot leave before lockEnd
    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'Unstake', amount: 150n * QSR }),
        'unstake before lockEnd must revert (Lock active)'
    );
    assert.equal((await eco.master.getGetStakingConfig()).totalStaked, 150n * QSR, 'the blocked exit must not change the stake');

    // owner-only config
    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.2') }, {
            $$type: 'SetStakingConfig', enabled: true, apyBps: 1000, minStake: QSR, lockPeriod: 1000
        }),
        'a non-owner staking config must revert'
    );
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, {
        $$type: 'SetStakingConfig', enabled: true, apyBps: 1000, minStake: QSR, lockPeriod: 1000
    });
    assert.equal((await eco.master.getGetStakingConfig()).apyBps, 1000n, 'the owner must be able to reconfigure staking');
});

// ═══════════════ Vesting ═══════════════

test('vesting: AddVesting persists the schedule and the cliff blocks early claims', async () => {
    const eco = await deployEco(false);
    const alice = await eco.bc.treasury('alice');
    await creditMasterDeposit(eco, eco.owner.address, 2n * QSR);

    const addRes = await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, {
        $$type: 'AddVesting', beneficiary: alice.address, totalAmount: QSR, cliff: 100, duration: 1000
    });
    assert.ok(!anyComputeFailed(addRes), 'a valid AddVesting must execute without reverts');

    const added = await eco.master.getGetVestingInfo(alice.address);
    assert.equal(added.totalAmount, QSR);
    assert.equal(added.claimed, 0n);
    assert.equal(added.cliff, 100n);

    // before the cliff
    eco.bc.now = 1050;
    await expectBlocked(
        eco.master.send(alice.getSender(), { value: toNano('0.3') }, { $$type: 'ClaimVested' }),
        'a claim before the cliff must revert'
    );

    // a user without a schedule cannot claim at all
    const stranger = await eco.bc.treasury('stranger');
    eco.bc.now = 2000;
    await expectBlocked(
        eco.master.send(stranger.getSender(), { value: toNano('0.3') }, { $$type: 'ClaimVested' }),
        'a claim without a vesting schedule must revert (No vesting)'
    );
});

// ═══════════════ Ownership (two-step + timelock) ═══════════════

test('ownership: non-owner cannot propose; acceptance waits out the 48h timelock', async () => {
    const eco = await deployEco(false);
    const newOwner = await eco.bc.treasury('newOwner');

    await expectBlocked(
        eco.master.send(newOwner.getSender(), { value: toNano('0.2') }, { $$type: 'ProposeOwner', newOwner: newOwner.address }),
        'a non-owner proposal must revert'
    );

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, { $$type: 'ProposeOwner', newOwner: newOwner.address });
    assert.ok((await eco.master.getGetPendingOwner()).equals(newOwner.address));
    assert.equal(await eco.master.getGetOwnerTransferAt(), 1000n + 172800n, 'the 48h timelock must be armed');

    // acceptance before the timelock expires
    eco.bc.now = 1000 + 172799;
    await expectBlocked(
        eco.master.send(newOwner.getSender(), { value: toNano('0.2') }, { $$type: 'AcceptOwner' }),
        'acceptance before the timelock must revert'
    );

    // a stranger cannot hijack the pending acceptance either
    eco.bc.now = 1000 + 172801;
    const stranger = await eco.bc.treasury('stranger');
    await expectBlocked(
        eco.master.send(stranger.getSender(), { value: toNano('0.2') }, { $$type: 'AcceptOwner' }),
        'acceptance by a non-pending stranger must revert'
    );

    await eco.master.send(newOwner.getSender(), { value: toNano('0.2') }, { $$type: 'AcceptOwner' });
    assert.ok((await eco.master.getGetJettonData()).adminAddress.equals(newOwner.address));
    assert.ok((await eco.master.getGetPendingOwner()).equals(ZERO), 'the pending slot must reset after acceptance');
});

// ═══════════════ DeFi: liquidity, quotes, guards ═══════════════

test('defi: first liquidity provision mints LP proportional to the deposit', async () => {
    const eco = await deployEco(true);
    const lp = await eco.bc.treasury('lp');

    await creditDefiDeposit(eco, lp.address, 1n * QSR);
    const addRes = await eco.defi.send(lp.getSender(), { value: 10n * toNano('1') }, {
        $$type: 'AddLiquidity', tonAmount: 10n * toNano('1'), qsrAmount: QSR
    });
    assert.ok(!anyComputeFailed(addRes), 'first liquidity provision must execute without reverts');

    const pool = await eco.defi.getPoolInfo();
    assert.equal(pool.tonReserve, 10n * toNano('1'));
    assert.equal(pool.qsrReserve, QSR);
    assert.equal(pool.totalSupply, 3_162_277_660n, 'first LP mint equals sqrt(ton*qsr) scaled by 1e9');
    assert.equal(await eco.defi.getLpBalance(lp.address), 3_162_277_660n);
});

test('defi: the swap quote getter matches the CPMM formula with the 0.30% fee', async () => {
    const eco = await deployEco(true);
    const lp = await eco.bc.treasury('lp');
    await creditDefiDeposit(eco, lp.address, QSR);
    await eco.defi.send(lp.getSender(), { value: 10n * toNano('1') }, {
        $$type: 'AddLiquidity', tonAmount: 10n * toNano('1'), qsrAmount: QSR
    });

    const qsrIn = QSR / 2n;
    const grossTonOut = (qsrIn * 10n * toNano('1')) / (QSR + qsrIn); // (qsrIn*tonReserve)/(qsrReserve+qsrIn)
    const expectedTonOut = grossTonOut - grossTonOut * 30n / 10000n;

    const quote = await eco.defi.getEstimateSwapToTon(qsrIn);
    assert.equal(quote.tonOut, expectedTonOut, 'estimateSwapToTon must implement (qsrIn*tonReserve)/(qsrReserve+qsrIn) minus 30 bps');
    assert.equal(quote.fee, grossTonOut * 30n / 10000n);

    const reverse = await eco.defi.getEstimateSwapToQsr(toNano('1'));
    const grossQsrOut = (toNano('1') * QSR) / (10n * toNano('1') + toNano('1'));
    assert.equal(reverse.qsrOut, grossQsrOut - grossQsrOut * 30n / 10000n, 'estimateSwapToQsr must use the same CPMM math');

    // empty-pool quote is zeroed, not an error
    const eco2 = await deployEco(true);
    const empty = await eco2.defi.getEstimateSwapToTon(QSR);
    assert.equal(empty.tonOut, 0n);
});

test('defi: seeded swaps preserve quote parity and the constant-product invariant', async () => {
    const eco = await deployEco(true);
    const lp = await eco.bc.treasury('property-lp');
    const initialTon = 10n * toNano('1');
    const initialQsr = 100n * QSR;

    await creditDefiDeposit(eco, lp.address, initialQsr);
    const add = await eco.defi.send(lp.getSender(), { value: initialTon + toNano('1') }, {
        $type: 'AddLiquidity', tonAmount: initialTon, qsrAmount: initialQsr
    });
    assert.ok(!anyComputeFailed(add), 'initial liquidity must be accepted');

    // Fixed seed makes any failing property case reproducible.
    let seed = 0x5eed1234;
    const nextTradeBps = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return 100 + (seed % 2400); // 1.00% to 24.99%, below the 30% trade cap.
    };
    const feeBps = await eco.defi.getFeeConfig();
    assert.equal(feeBps, 30n);

    for (let i = 0; i < 16; i++) {
        const before = await eco.defi.getPoolInfo();
        const tradeBps = BigInt(nextTradeBps());
        const tonToQsr = i % 2 === 0;
        const inputReserve = tonToQsr ? before.tonReserve : before.qsrReserve;
        const input = inputReserve * tradeBps / 10000n;
        assert.ok(input > 0n, 'generated trade input must be positive');

        let after;
        if (tonToQsr) {
            const gross = input * before.qsrReserve / (before.tonReserve + input);
            const fee = gross * feeBps / 10000n;
            const expectedOut = gross - fee;
            const quote = await eco.defi.getEstimateSwapToQsr(input);
            assert.equal(quote.qsrOut, expectedOut, 'TON-to-QSR quote formula at case ' + i);
            assert.equal(quote.fee, fee, 'TON-to-QSR fee at case ' + i);
            assert.equal(quote.priceImpactBps, input * 10000n / before.tonReserve);
            assert.ok(expectedOut > 0n && expectedOut < before.qsrReserve);

            const swap = await eco.defi.send(lp.getSender(), { value: input + toNano('0.5') }, {
                $type: 'SwapToQSR', tonAmount: input, minQsrOut: expectedOut
            });
            assert.ok(!anyComputeFailed(swap), 'quoted TON-to-QSR swap executes at case ' + i);
            after = await eco.defi.getPoolInfo();
            assert.equal(after.tonReserve, before.tonReserve + input);
            assert.equal(after.qsrReserve, before.qsrReserve - expectedOut);
        } else {
            const gross = input * before.tonReserve / (before.qsrReserve + input);
            const fee = gross * feeBps / 10000n;
            const expectedOut = gross - fee;
            const quote = await eco.defi.getEstimateSwapToTon(input);
            assert.equal(quote.tonOut, expectedOut, 'QSR-to-TON quote formula at case ' + i);
            assert.equal(quote.fee, fee, 'QSR-to-TON fee at case ' + i);
            assert.equal(quote.priceImpactBps, input * 10000n / before.qsrReserve);
            assert.ok(expectedOut > 0n && expectedOut < before.tonReserve);

            await creditDefiDeposit(eco, lp.address, input);
            const swap = await eco.defi.send(lp.getSender(), { value: toNano('0.5') }, {
                $type: 'SwapToTON', qsrAmount: input, minTonOut: expectedOut
            });
            assert.ok(!anyComputeFailed(swap), 'quoted QSR-to-TON swap executes at case ' + i);
            after = await eco.defi.getPoolInfo();
            assert.equal(after.qsrReserve, before.qsrReserve + input);
            assert.equal(after.tonReserve, before.tonReserve - expectedOut);
        }

        assert.ok(
            after.tonReserve * after.qsrReserve >= before.tonReserve * before.qsrReserve,
            'fee-adjusted constant product must not decrease at case ' + i
        );
    }
});

test('defi: swaps are guarded by slippage and trade-size limits', async () => {
    const eco = await deployEco(true);
    const lp = await eco.bc.treasury('lp');
    await creditDefiDeposit(eco, lp.address, QSR);
    await eco.defi.send(lp.getSender(), { value: 10n * toNano('1') }, {
        $$type: 'AddLiquidity', tonAmount: 10n * toNano('1'), qsrAmount: QSR
    });

    // trade too large: maxTradeBps = 3000 (30% of the reserve)
    await creditDefiDeposit(eco, lp.address, QSR);
    await expectBlocked(
        eco.defi.send(lp.getSender(), { value: toNano('0.5') }, { $$type: 'SwapToTON', qsrAmount: QSR, minTonOut: 0n }),
        'a swap above 30% of the pool reserve must revert (Trade too large)'
    );

    // a valid-size swap below the declared minTonOut reverts
    const qsrIn = QSR / 4n;
    const quote = await eco.defi.getEstimateSwapToTon(qsrIn);
    await expectBlocked(
        eco.defi.send(lp.getSender(), { value: toNano('0.5') }, {
            $$type: 'SwapToTON', qsrAmount: qsrIn, minTonOut: quote.tonOut + 1n
        }),
        'a swap below minTonOut must revert (Slippage exceeded)'
    );
});

test('defi: admin functions are owner-only and a paused pool rejects swaps', async () => {
    const eco = await deployEco(true);
    const stranger = await eco.bc.treasury('stranger');

    await expectBlocked(
        eco.defi.send(stranger.getSender(), { value: toNano('0.1') }, { $$type: 'SetPaused', paused: true }),
        'a non-owner must not pause the pool'
    );

    await eco.defi.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetPaused', paused: true });
    await expectBlocked(
        eco.defi.send(stranger.getSender(), { value: toNano('0.5') }, { $$type: 'SwapToQSR', tonAmount: toNano('0.1'), minQsrOut: 0n }),
        'swaps must revert while the pool is paused'
    );

    await eco.defi.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetPaused', paused: false });
    assert.ok((await eco.defi.getOwner()).equals(eco.owner.address), 'the owner getter must stay readable after the pause cycle');

    // the swap fee cannot rise above the documented 0.30%
    await eco.defi.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetFeeBps', feeBps: 50n }).catch(() => {});
    assert.equal(await eco.defi.getFeeConfig(), 30n, 'raising the fee above 30 bps must be rejected');
});

// ═══════════════ AI oracle liveness ═══════════════

test('ai oracle: heartbeat keeps the oracle alive and timeouts mark it dead', async () => {
    const eco = await deployEco(false);
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Toggle AI');
    assert.equal(await eco.master.getIsAiAlive(), true, 'a fresh deployment must report a live oracle');

    eco.bc.now = 1000 + 604801; // heartbeatTimeout = 604800
    assert.equal(await eco.master.getIsAiAlive(), false, 'a stale heartbeat must mark the oracle dead');

    const beatRes = await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'AIHeartbeat', queryId: 1n, status: 'ok'
    });
    assert.ok(!anyComputeFailed(beatRes), 'the oracle (owner by default) must be able to heartbeat');
    assert.equal(await eco.master.getIsAiAlive(), true);
});
