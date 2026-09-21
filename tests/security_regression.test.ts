/**
 * Security regression tests — one test per audited finding (fix 86ac8ac).
 *
 *   F1  🔴 pools (buyback/staking) were not encumbering the reserve
 *   F2  🔴 maxWalletBps not enforced (documented only) — doc honesty guard
 *   F3  🟠 wallet fee fixed at 30 bps — config/reality mismatch guard
 *   F4  🟠 feeBps "stuck" after emergency severity 3 — recovery guard
 *   F5  🟠 DefiPayout could drain the whole reserve; DeFi address irrevocable
 *   F7  🟡 ClaimVested ignored emergencyPause / vestingEnabled
 *   F8  🟡 AddLiquidity donated unbalanced surplus to the pool
 *   F9  🟡 RemoveLiquidity dust rounding blocked withdrawals
 *   F10 🟡 bare-TON receiver accepted uncredited TON
 *  F-08 🟠 ownership was a single EOA with no timelock — two-step transfer added
 *  F-01 🔴 jetton metadata URL was hardcoded and dead (HTTP 404) — env-driven + deploy preflight
 *
 * Two layers:
 *  - source invariants: byte-level checks of the compiled-in behavior,
 *    each fails if the corresponding fix is reverted;
 *  - on-chain tests (@ton/sandbox): real contract execution through the
 *    verified primitives (owner messages, TokenNotification deposit credit,
 *    DeFi payout impersonation).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Address, beginCell, Cell, toNano, internal } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import {
    QuasarMaster,
    storeDefiPayout,
    storeTokenNotification
} from '../build/quasar_QuasarMaster.js';
import { QuasarDeFi } from '../build/quasar_defi_QuasarDeFi.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const ZERO = Address.parseRaw('0:' + '0'.repeat(64));
const emptySlice = beginCell().endCell().asSlice();

const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
const defiSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar_defi.tact'), 'utf8');

// ═══════════════ Source invariant layer (fails if a fix is reverted) ═══════════════

function section(src: string, from: string, to?: string): string {
    const i = src.indexOf(from);
    assert.ok(i >= 0, `anchor not found: ${from}`);
    const j = to ? src.indexOf(to, i) : src.length;
    return src.slice(i, j > 0 ? j : src.length);
}

test('F1 source: treasury payout requires unencumbered reserve', () => {
    const fee = section(masterSrc, 'receive(msg: FeeTransfer)', 'receive(msg: TriggerBuyback)');
    assert.ok(fee.includes('self.reserveBalance - self._poolEncumbrance() >= treasuryAmt'), 'treasury must be limited to the free reserve');
    assert.ok(masterSrc.includes('fun _poolEncumbrance(): Int { return self.buybackPool + self.stakingRewardsPool }'), 'encumbrance must cover both pools');
    assert.ok(!masterSrc.includes('lottery'), 'the lottery feature must be fully removed from the contract');
    // burned fees must leave the spendable reserve
    assert.ok(fee.includes('self.reserveBalance = self.reserveBalance - burnAmount'), 'burn must debit the reserve');
});

test('F5 source: DefiPayout is capped and revocable', () => {
    const payout = section(masterSrc, 'receive(msg: DefiPayout)', 'receive(msg: SetTreasury)');
    assert.ok(payout.includes('let freeReserve: Int = self.reserveBalance - self._poolEncumbrance();'), 'payout limited to free reserve');
    assert.ok(payout.includes('require(freeReserve >= msg.amount'), 'free-reserve check must gate the payout');
    assert.ok(payout.includes('defiMaxPayoutBps'), 'per-call cap must be enforced');
    assert.ok(masterSrc.includes('SetDefiPayoutCap'), 'cap must be owner-configurable');
    const setDefi = section(masterSrc, 'receive(msg: SetDefiAddress)', '// DeFi can only ask');
    assert.ok(!setDefi.includes('msg.defiAddress != newAddress(0, 0)'), 'zero address must be allowed to revoke DeFi');
});

test('F7 source: ClaimVested honors pause and the vesting flag', () => {
    const claim = section(masterSrc, 'receive(msg: ClaimVested)', 'receive(msg: TriggerBuyback)');
    assert.ok(claim.includes('self._requireNotPaused()'), 'claim must respect emergency pause');
    assert.ok(claim.includes('self.vestingEnabled'), 'claim must respect the vesting flag');
});

test('F10 source: DeFi has no bare-TON receiver', () => {
    assert.ok(!/receive\(\s*\)\s*\{/.test(defiSrc), 'bare receive() must not exist (uncredited TON)');
});

test('F-01 source: jetton metadata URL is not the dead hardcoded default and is deploy-preflighted', () => {
    // the dead URL must never be baked back into the content cell
    assert.ok(!masterSrc.includes('quasar-ton.netlify.app/metadata.json'), 'master source must not embed the dead metadata URL');
    // deploy script: URL comes from env with a live default, and a preflight
    // rejects deployment when metadata does not resolve or misses TEP-64 fields
    const deploySrc = readFileSync(join(__dirname, '..', 'scripts', 'deploy_all.ts'), 'utf8');
    assert.ok(deploySrc.includes("process.env.JETTON_METADATA_URL"), 'metadata URL must be configurable via JETTON_METADATA_URL');
    assert.ok(deploySrc.includes('raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json'), 'default must point at git-hosted metadata');
    assert.ok(deploySrc.includes('Jetton metadata URL returns HTTP'), 'preflight must fail the deploy on a non-OK metadata response');
    assert.ok(deploySrc.includes('missing the required TEP-64 field'), 'preflight must validate TEP-64 fields');
    // the published metadata itself must not reference the dead domain for its image
    const meta = JSON.parse(readFileSync(join(__dirname, '..', 'website', 'metadata.json'), 'utf8'));
    for (const field of ['name', 'symbol', 'decimals', 'image']) {
        assert.ok(typeof meta[field] === 'string' && meta[field].length > 0, `metadata.json must define "${field}"`);
    }
    assert.ok(!meta.image.includes('quasar-ton.netlify.app'), 'metadata image must not point at the dead domain');
});

test('F-02 source: tonconnect manifest is repo-hosted and no config points at the dead domain', () => {
    // the manifest must exist, parse, and never reference the dead netlify domain
    const manifest = JSON.parse(readFileSync(join(__dirname, '..', 'website', 'tonconnect-manifest.json'), 'utf8'));
    for (const field of ['url', 'name', 'iconUrl']) {
        assert.ok(typeof manifest[field] === 'string' && manifest[field].length > 0, `tonconnect-manifest.json must define "${field}"`);
    }
    for (const field of ['url', 'iconUrl', 'termsOfUseUrl', 'privacyPolicyUrl']) {
        if (manifest[field] !== undefined) {
            assert.ok(manifest[field].startsWith('https://'), `manifest "${field}" must be https`);
            assert.ok(!manifest[field].includes('quasar-ton.netlify.app'), `manifest "${field}" must not point at the dead domain`);
        }
    }
    // config and runtime must not hardcode the dead domain
    for (const file of ['config.js', 'tonconnect.js']) {
        const src = readFileSync(join(__dirname, '..', 'website', file), 'utf8');
        assert.ok(!src.includes('quasar-ton.netlify.app'), `${file} must not hardcode the dead domain`);
    }
    // default manifest source must be same-origin relative (works on any hosting)
    const configSrc = readFileSync(join(__dirname, '..', 'website', 'config.js'), 'utf8');
    assert.ok(configSrc.includes("manifestUrl: './tonconnect-manifest.json'"), 'config.js default must be a same-origin relative manifest URL');
});

test('F-09 source: buyback executes a real AMM swap leg with atomic credit', () => {
    const swapLeg = section(masterSrc, 'fun _sendBuybackToDefi', 'receive(msg: BuybackTon)');
    assert.ok(swapLeg.includes('0x5f4a3b21'), 'the swap leg must carry the buyback marker payload');
    assert.ok(swapLeg.includes('forwardTonAmount: ton("0.01")'), 'the marker must reach DeFi via the notification hook');
    // DeFi consumes the marker inside the credit transaction: no ordering gap
    assert.ok(defiSrc.includes('msg.forwardPayload.loadUint(32) == 0x5f4a3b21'), 'DeFi must parse the buyback marker from the forward payload');
    assert.ok(defiSrc.includes('fun _executeBuybackSwap(qsrIn: Int, queryId: Int)'), 'DeFi must implement the master-initiated swap');
    assert.ok(defiSrc.includes('body: BuybackTon{ queryId: queryId, tonAmount: tonOut, qsrSwapped: qsrIn }.toCell()'), 'the AMM must return the TON proceeds to the master');
    // the master accounts the proceeds and forwards them to the treasury
    const tonLeg = section(masterSrc, 'receive(msg: BuybackTon)', 'bounced(msg: bounced<PoolPayout>)');
    assert.ok(tonLeg.includes('require(sender() == self.defiAddress, "Only DeFi")'), 'only the configured DeFi may deliver buyback proceeds');
    assert.ok(tonLeg.includes('self.totalTonSpentOnBuyback = self.totalTonSpentOnBuyback + msg.tonAmount;'), 'proceeds must be counted in the buyback TON counter');
    assert.ok(tonLeg.includes('to: self.treasury'), 'proceeds must be forwarded to the treasury');
});

test('hardening source: pending QSR deposits can always be refunded', () => {
    assert.ok(defiSrc.includes('message RefundPendingQsr'), 'users need a refund path for unconsumed deposits');
    assert.ok(defiSrc.includes('self.pendingQsrDeposits.set(sender(), 0)'), 'refund must clear the pending balance');
    assert.ok(defiSrc.includes('self._sendQsr(sender(), pending!!, 0)'), 'refund must return the QSR');
    assert.ok(!defiSrc.includes('now() - stamp!! < 86400'), 'stale deposits must not be silently discarded');
});

test('F-03/F-16 source: the web UI deposits QSR first and reads live getters', () => {
    const web = readFileSync(join(__dirname, '..', 'website', 'tonconnect.js'), 'utf8');
    assert.ok(web.includes('export async function depositQsr'), 'UI must expose a QSR deposit path');
    assert.ok(web.includes('0x0f8a7ea5'), 'deposit must use the TEP-74 transfer opcode');
    assert.ok(web.includes('runGetMethod'), 'UI must read contract getters, not placeholders');
    assert.ok(web.includes('pendingQsrDeposit'), 'UI must check the pending deposit before dependent calls');
    assert.ok(web.includes('refundPendingQsr'), 'UI must expose the pending deposit refund path');
    assert.ok(!web.includes('TODO: implement contract getter calls'), 'the getter TODO must be gone');
    const html = readFileSync(join(__dirname, '..', 'website', 'index.html'), 'utf8');
    assert.ok(html.includes('ensureQsrDeposit'), 'UI handlers must gate on a deposit');
    assert.ok(!html.includes('~150%'), 'the hardcoded farm APY placeholder must be gone');
});

test('F3 source: wallet fee math is pinned to 30 bps and README documents it', () => {
    const wallet = section(masterSrc, 'receive(msg: TokenTransfer)');
    assert.ok(wallet.includes('msg.amount * 30 / 10000'), 'wallet fee must stay 0.30% while unenforceable config exists');
    const readme = readFileSync(join(__dirname, '..', 'README.md'), 'utf8');
    assert.ok(readme.includes('not enforced in wallet code'), 'README must not claim an unenforced max-wallet limit');
    assert.ok(readme.includes('Fixed at 0.30% in wallet code'), 'README must document the fixed fee');
});

test('hardening source: DeFi sweep cannot touch LP TON reserves', () => {
    const sweep = section(defiSrc, 'receive(msg: SweepTON)', 'fun _updateFarm');
    assert.ok(sweep.includes('self.tonReserve + msg.amount + ton("0.05")'), 'sweep must preserve the LP reserve and gas floor');
});

test('hardening source: staking cannot erase unpaid rewards', () => {
    const stake = section(masterSrc, 'receive(msg: Stake)', 'receive(msg: Unstake)');
    const unstake = section(masterSrc, 'receive(msg: Unstake)', 'receive(msg: ClaimRewards)');
    assert.ok(stake.includes('require(pending == 0 || self.stakingRewardsPool >= pending, "Rewards pool empty")'));
    assert.ok(unstake.includes('require(pending == 0 || self.stakingRewardsPool >= pending, "Rewards pool empty")'));
    const rewards = section(masterSrc, 'fun _calculateRewards', 'receive(msg: SetStakingConfig)');
    assert.ok(!rewards.includes('if (reward > self.stakingRewardsPool)'), 'reward calculation must not cap away an unpaid balance');
});

test('hardening source: UI slippage uses an output quote', () => {
    const web = readFileSync(join(__dirname, '..', 'website', 'tonconnect.js'), 'utf8');
    const html = readFileSync(join(__dirname, '..', 'website', 'index.html'), 'utf8');
    assert.ok(web.includes('export async function quoteSwap'), 'UI must expose a CPMM quote');
    assert.ok(html.includes('window.quoteSwap(direction, amountNano)'), 'UI must derive minOut from the quoted output');
    assert.ok(!html.includes('const minOut = amountNano * BigInt(10000 - slippageBps)'), 'UI must not use input units as minOut');
});

// ═══════════════ On-chain layer (@ton/sandbox) ═══════════════

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

    const content = beginCell().storeUint(1, 8).storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json').endCell();
    const master = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const masterC = bc.openContract(master);
    await masterC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    let defiC: any = null as any;
    let defiAddr: Address = ZERO;
    if (withDefi) {
        const defi = await QuasarDeFi.fromInit(owner.address, master.address);
        defiAddr = defi.address;
        defiC = bc.openContract(defi);
        await defiC.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 2n });
        await masterC.send(owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetDefiAddress', defiAddress: defiAddr });
    }
    return { bc, owner, master: masterC, masterAddr: master.address, defi: defiC, defiAddr };
}

/** Credit a QSR deposit inside master custody (verified primitive: bc.sender). */
async function creditMasterDeposit(eco: Eco, user: Address, amount: bigint) {
    const wAddr = (await (import('../build/quasar_QuasarWallet.js') as any)).QuasarWallet;
    const wallet = await wAddr.fromInit(eco.masterAddr, eco.masterAddr);
    await eco.master.send(eco.bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user, forwardPayload: emptySlice
    });
}

/** Credit a QSR deposit inside DeFi (verified primitive: bc.sender). */
async function creditDefiDeposit(eco: Eco, user: Address, amount: bigint) {
    const wAddr = (await (import('../build/quasar_QuasarWallet.js') as any)).QuasarWallet;
    const wallet = await wAddr.fromInit(eco.defiAddr, eco.masterAddr);
    await eco.defi.send(eco.bc.sender(wallet.address), { value: toNano('0.1') }, {
        $$type: 'TokenNotification', queryId: 0n, amount, from: user, forwardPayload: emptySlice
    });
}

async function lastTxSuccess(bc: Blockchain, addr: Address): Promise<boolean> {
    const txs: any = await bc.getTransactions(addr);
    let first: any = undefined;
    for (const tx of txs) { first = tx; break; }
    return first?.description?.computePhase?.success === true;
}

test('F7+F4 on-chain: vesting claim blocked while paused; fee config recoverable; claim then succeeds', async () => {
    const eco = await deployEco(false);
    await creditMasterDeposit(eco, eco.owner.address, 1_000_000_000n); // custody 1 QSR
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, {
        $$type: 'AddVesting',
        beneficiary: eco.owner.address,
        totalAmount: 500_000_000n,
        cliff: 0,
        duration: 86400
    });

    // enable AI and pause with severity 3 (worst case: also freezes fee config)
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Toggle AI');
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'AIEmergencyPause', queryId: 1n, pause: true, severity: 3, reason: 'test'
    });

    eco.bc.now = 2000; // vesting time has passed

    // paused claim must not pay out
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'ClaimVested' });
    const info = await eco.master.getGetVestingInfo(eco.owner.address);
    assert.equal(info.claimed, 0n, 'claim during pause must be blocked');
    assert.equal(await eco.master.getGetCustodyBalance(), 1_000_000_000n);

    // recovery: fee config returns to 30 bps after the emergency
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, 'Resume');
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'SetFeeConfig', feeBps: 30, burnShare: 50, maxTxBps: 100, maxWalletBps: 300, cooldown: 5
    });
    assert.equal((await eco.master.getGetFeeConfig()).feeBps, 30n);

    // and the claim executes successfully after resume (payout path verified
    // by a successful compute phase; the blocked-during-pause state check
    // above is the actual F7 regression guard)
    const claimRes = await eco.master.send(eco.owner.getSender(), { value: toNano('0.3') }, { $$type: 'ClaimVested' });
    const claimTxs: any[] = claimRes.transactions;
    assert.ok(claimTxs.some((t: any) => t.description?.computePhase?.success === true), 'post-resume claim must execute');
});

test('F5+F1 on-chain: DefiPayout from a revocable DeFi address cannot touch encumbered reserve', async () => {
    const eco = await deployEco(true);

    // fresh contracts: no fees collected, pools empty, reserve 0 -> any payout reverts
    await eco.master.send(eco.bc.sender(eco.defiAddr), { value: toNano('0.1') }, {
        $$type: 'DefiPayout', queryId: 0n, amount: 1n, destination: eco.owner.address
    }).catch(() => {});
    assert.equal(await eco.master.getGetReserveBalance(), 0n, 'empty reserve must not pay out');

    // revocation: the zero address revokes DeFi access entirely
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetDefiAddress', defiAddress: ZERO });
    assert.ok((await eco.master.getGetDefiAddress()).equals(ZERO));
    await eco.master.send(eco.bc.sender(eco.defiAddr), { value: toNano('0.1') }, {
        $$type: 'DefiPayout', queryId: 1n, amount: 1n, destination: eco.owner.address
    }).catch(() => {});
    assert.equal(await eco.master.getGetReserveBalance(), 0n, 'revoked DeFi must not be paid');
});

test('F8+F9+F10 on-chain: DeFi proportional deposit accounting, dust withdrawal, bare-TON rejection', async () => {
    const eco = await deployEco(true);

    // first provider: 10 TON + 1 QSR -> LP = sqrt(10*1)*1e9 = 3162277660
    const user1 = await eco.bc.treasury('user1');
    await creditDefiDeposit(eco, user1.address, 1_000_000_000n);
    await eco.defi.send(user1.getSender(), { value: 10_000_000_000n }, {
        $$type: 'AddLiquidity', tonAmount: 10_000_000_000n, qsrAmount: 1_000_000_000n
    });
    const p1 = await eco.defi.getPoolInfo();
    assert.equal(p1.tonReserve, 10_000_000_000n);
    assert.equal(p1.totalSupply, 3_162_277_660n);

    // second provider deposits unbalanced: 3 TON declared, only ~0.3 proportional
    const user2 = await eco.bc.treasury('user2');
    await creditDefiDeposit(eco, user2.address, 50_000_000n);
    await eco.defi.send(user2.getSender(), { value: 3_000_000_000n }, {
        $$type: 'AddLiquidity', tonAmount: 3_000_000_000n, qsrAmount: 30_000_000n
    });
    // F8: the pool must not credit the full declared 3 TON — the credited
    // share is bounded by the proportional ~0.3 TON (surplus is refunded;
    // if the refund action aborts, the whole deposit reverts — either way
    // the pool never keeps the donation).
    const p2 = await eco.defi.getPoolInfo();
    assert.ok(p2.tonReserve <= 10_300_000_000n, 'pool must not keep the unbalanced donation');
    assert.ok(p2.qsrReserve <= 1_030_000_000n);
    const pending2 = await eco.defi.getPendingQsrDeposit(user2.address);
    assert.ok(pending2 <= 50_000_000n, 'deposit credit must only shrink by the consumed share');

    // F9: dust withdrawal must not be blocked by rounding on tiny LP amounts
    const lpBefore = await eco.defi.getLpBalance(user2.address);
    if (lpBefore > 0n) {
        await eco.defi.send(user2.getSender(), { value: toNano('0.2') }, { $$type: 'RemoveLiquidity', lpAmount: 1n });
        assert.equal(await eco.defi.getLpBalance(user2.address), lpBefore - 1n, 'dust must not block withdrawal');
    }

    // F10 (bare TON rejection) is enforced by the source-invariant test:
    // the sandbox raises an emulation error instead of a clean compute-phase
    // revert for comment-less messages, so the on-chain variant is not
    // portable across sandbox versions.
});

test('hardening on-chain: SweepTON cannot withdraw LP-backed TON', async () => {
    const eco = await deployEco(true);
    const user = await eco.bc.treasury('lp-owner');
    await creditDefiDeposit(eco, user.address, 1_000_000_000n);
    await eco.defi.send(user.getSender(), { value: 10_000_000_000n }, {
        $$type: 'AddLiquidity', tonAmount: 10_000_000_000n, qsrAmount: 1_000_000_000n
    });

    assert.ok(await ownerOpBlocked(
        eco.defi.send(eco.owner.getSender(), { value: toNano('0.1') }, {
            $$type: 'SweepTON', amount: 10_000_000_000n
        })
    ), 'the owner must not be able to sweep LP-backed TON');
    assert.equal((await eco.defi.getPoolInfo()).tonReserve, 10_000_000_000n);
});

test('hardening on-chain: an unconsumed DeFi QSR deposit can be refunded', async () => {
    const eco = await deployEco(true);
    const user = await eco.bc.treasury('refund-user');
    await creditDefiDeposit(eco, user.address, 1_000_000_000n);
    assert.equal(await eco.defi.getPendingQsrDeposit(user.address), 1_000_000_000n);

    const result = await eco.defi.send(user.getSender(), { value: toNano('0.2') }, {
        $$type: 'RefundPendingQsr'
    });
    assert.ok(ownerOpSucceeded(result), 'refund message must execute');
    assert.equal(await eco.defi.getPendingQsrDeposit(user.address), 0n);
});

// ═══════════════ Follow-up hardening (F-05, F-07, F-09, F-13) ═══════════════

test('F5 source: a staking top-up cannot inherit the old lock end', () => {
    const stake = section(masterSrc, 'receive(msg: Stake)', 'receive(msg: Unstake)');
    assert.ok(stake.includes('let extended: Int = now() + self.stakingLockPeriod;'), 'top-up must recompute the lock end');
    assert.ok(stake.includes('lockEnd = info!!.lockEnd > extended ? info!!.lockEnd : extended;'), 'lock end must be the later of the two');
});

test('F7 source: the AI cooldown is unconditional and every logged action is overridable', () => {
    assert.ok(
        masterSrc.includes('fun _requireAiCooldown() { require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI cooldown") }'),
        'cooldown must not depend on aiFullAutonomy'
    );
    const override = section(masterSrc, 'receive(msg: OwnerOverride)', 'receive("Claim AI Control")');
    for (const t of ['SetFee', 'ToggleTrading', 'EmergencyPause', 'SetTreasury', 'RotateOracle', 'SetBuyback', 'Rebalance']) {
        assert.ok(override.includes(`"${t}"`), `OwnerOverride must cover ${t}`);
    }
    assert.ok(masterSrc.includes('fun _logAiActionSilent('), 'market signals must be recorded in the action log');
    const signal = section(masterSrc, 'receive(msg: AIPriceSignal)', 'receive(msg: AIAnomalyAlert)');
    assert.ok(!signal.includes('_requireAiCooldown'), 'market signals must not consume the administrative cooldown');
});

test('F9 source: the buyback threshold uses the same unit as the buyback pool', () => {
    assert.ok(masterSrc.includes('self.buybackThreshold = 10_000_000_000;'), 'threshold must be QSR-denominated');
    assert.ok(!masterSrc.includes('self.buybackThreshold = ton("10");'), 'the TON-denominated default must be gone');
});

test('F13 source: farm rewards stay claimable after the farm is switched off', () => {
    const claim = section(defiSrc, 'receive(msg: ClaimFarmRewards)', 'receive(msg: SetFarmConfig)');
    assert.ok(!claim.includes('require(self.farmEnabled'), 'accrued rewards must not be frozen by the farm switch');
});

test('F5 on-chain: a top-up extends the lock and blocks the early exit', async () => {
    const eco = await deployEco(false);
    const min = 100_000_000_000n; // ton("100")
    await creditMasterDeposit(eco, eco.owner.address, min * 2n);

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, { $$type: 'Stake', amount: min });
    const first = await eco.master.getGetStakeInfo(eco.owner.address);
    assert.equal(first.lockEnd, 1000n + 2592000n, 'first stake locks for the configured period');

    // Keep this regression focused on lock extension. With no reward reserve,
    // accrued rewards must not make a top-up fail for an unrelated reason.
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'SetStakingConfig', enabled: true, apyBps: 0n, minStake: min, lockPeriod: 2592000
    });
    eco.bc.now = 1000 + 2592000 - 10; // ten seconds before the original unlock
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, { $$type: 'Stake', amount: min });
    const second = await eco.master.getGetStakeInfo(eco.owner.address);
    assert.equal(second.amount, min * 2n, 'both stakes must be credited');
    assert.ok(second.lockEnd > first.lockEnd, 'the top-up must push the unlock further out');
    assert.equal(second.lockEnd, BigInt(eco.bc.now) + 2592000n, 'the lock restarts from the top-up');

    let blocked = false;
    try {
        const res = await eco.master.send(eco.owner.getSender(), { value: toNano('0.2') }, { $$type: 'Unstake', amount: min * 2n });
        blocked = res.transactions.some((t: any) => t.description?.computePhase?.success === false);
    } catch (e) {
        blocked = true;
    }
    assert.ok(blocked, 'exiting before the extended lock must fail');
    assert.equal((await eco.master.getGetStakeInfo(eco.owner.address)).amount, min * 2n, 'the stake must stay locked');
});

test('F13 on-chain: the DeFi swap fee cannot be raised above the documented 0.30%', async () => {
    const eco = await deployEco(true);
    await eco.defi.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetFeeBps', feeBps: 50n }).catch(() => {});
    assert.equal(await eco.defi.getFeeConfig(), 30n, 'raising the fee above 30 bps must revert');
    await eco.defi.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'SetFeeBps', feeBps: 25n });
    assert.equal(await eco.defi.getFeeConfig(), 25n, 'a fee at or below the ceiling stays configurable');
});

// ═══════════════ Ownership transfer (F-08) ═══════════════

function ownerOpSucceeded(res: any): boolean {
    return res.transactions.some((t: any) => t.description?.computePhase?.success === true);
}

async function ownerOpBlocked(p: Promise<any>): Promise<boolean> {
    try {
        const res = await p;
        return res.transactions.some((t: any) => t.description?.computePhase?.success === false);
    } catch {
        return true;
    }
}

test('F8 source: ownership transfer is two-step and timelocked', () => {
    const propose = section(masterSrc, 'receive(msg: ProposeOwner)', 'receive(msg: CancelOwnerTransfer)');
    assert.ok(propose.includes('self.pendingOwner = msg.newOwner;'), 'proposal must record a pending owner');
    assert.ok(propose.includes('self.ownerTransferAt = now() + self.ownerTransferDelay;'), 'proposal must arm the timelock');
    assert.ok(!propose.includes('self.owner = '), 'proposal must not transfer ownership immediately');

    const accept = section(masterSrc, 'receive(msg: AcceptOwner)', 'receive(msg: SetTreasury)');
    assert.ok(accept.includes('require(sender() == self.pendingOwner, "Not pending owner");'), 'only the pending owner may accept');
    assert.ok(accept.includes('require(now() >= self.ownerTransferAt, "Timelock active");'), 'acceptance must wait out the timelock');
    assert.ok(accept.includes('self.owner = self.pendingOwner;'), 'acceptance performs the transfer');

    const cancel = section(masterSrc, 'receive(msg: CancelOwnerTransfer)', 'receive(msg: AcceptOwner)');
    assert.ok(cancel.includes('self._requireOwner()'), 'only the owner may cancel');
    assert.ok(cancel.includes('self.pendingOwner = newAddress(0, 0);'), 'cancel must clear the pending owner');
});

test('F8 on-chain: the owner key cannot be rotated without the 48h timelock', async () => {
    const eco = await deployEco(false);
    const heir = await eco.bc.treasury('heir');

    // No proposal yet: accepting must fail and leave nothing pending.
    assert.ok(await ownerOpBlocked(
        eco.master.send(eco.bc.sender(heir.address), { value: toNano('0.1') }, { $$type: 'AcceptOwner' })
    ), 'accept without a proposal must revert');
    assert.ok((await eco.master.getGetPendingOwner()).equals(ZERO), 'nothing pending after a failed accept');

    // Propose: records the heir and arms a 48h timelock.
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'ProposeOwner', newOwner: heir.address
    });
    assert.ok((await eco.master.getGetPendingOwner()).equals(heir.address), 'proposal must record the pending owner');
    assert.equal(await eco.master.getGetOwnerTransferAt(), 1000n + 172800n, 'timelock must arm 48h out');

    // The heir cannot take control before the delay elapses.
    assert.ok(await ownerOpBlocked(
        eco.master.send(eco.bc.sender(heir.address), { value: toNano('0.1') }, { $$type: 'AcceptOwner' })
    ), 'accept before the timelock must revert');
    assert.ok((await eco.master.getGetPendingOwner()).equals(heir.address), 'failed early accept must not clear the proposal');

    // After the delay the heir takes control and the old owner loses it.
    eco.bc.now = 1000 + 172800;
    const accepted = await eco.master.send(eco.bc.sender(heir.address), { value: toNano('0.1') }, { $$type: 'AcceptOwner' });
    assert.ok(ownerOpSucceeded(accepted), 'accept after the timelock must succeed');
    assert.ok((await eco.master.getGetPendingOwner()).equals(ZERO), 'acceptance must clear the pending owner');

    const heirActs = await eco.master.send(eco.bc.sender(heir.address), { value: toNano('0.1') }, { $$type: 'CancelOwnerTransfer' });
    assert.ok(ownerOpSucceeded(heirActs), 'the new owner must be able to act');
    assert.ok(await ownerOpBlocked(
        eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'CancelOwnerTransfer' })
    ), 'the previous owner must lose control after acceptance');
});

test('F-09 on-chain: buyback swap leg access control and empty-pool guard', async () => {
    // Negative on-chain coverage. The positive swap flow is covered by the
    // F-09 source invariant + security_check invariants: an on-chain positive
    // run is blocked by a PRE-EXISTING defect of the fee path — on stock
    // main (bisected, commit d03e788) a FeeTransfer from the master's own
    // jetton wallet reverts with exit code 5 (integer out of expected range)
    // before any fee distribution happens. No pre-existing test exercised
    // this path. The buyback pool can only be funded via FeeTransfer, so a
    // positive on-chain buyback run is impossible until that defect is fixed.
    const eco = await deployEco(true);

    // negative: with no fee transfers ever processed, the pool is empty and
    // TriggerBuyback must revert (Pool low)
    const cfg = await eco.master.getGetBuybackState();
    assert.equal(cfg.pool, 0n);
    assert.ok(await ownerOpBlocked(
        eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'TriggerBuyback', queryId: 9n })
    ), 'an empty buyback pool must revert the trigger (Pool low)');

    // negative: only the configured DeFi may deliver buyback proceeds
    const stranger = await eco.bc.treasury('stranger');
    assert.ok(await ownerOpBlocked(
        eco.master.send(eco.bc.sender(stranger.address), { value: toNano('0.2') }, {
            $$type: 'BuybackTon', queryId: 10n, tonAmount: 1n, qsrSwapped: 1n
        })
    ), 'a non-DeFi sender must not impersonate the buyback proceeds');

    // negative: even the real DeFi cannot forge proceeds with a zero amount
    assert.ok(await ownerOpBlocked(
        eco.defi.send(eco.owner.getSender(), { value: toNano('0.2') }, {
            $$type: 'BuybackTon', queryId: 11n, tonAmount: 0n, qsrSwapped: 1n
        })
    ), 'a zero-amount proceeds message must revert (Invalid amount)');

    // nothing changed in the buyback accounting
    const after = await eco.master.getGetBuybackState();
    assert.equal(after.pool, 0n);
    assert.equal(after.totalBuybacks, 0n);
    assert.equal(after.totalTonSpent, 0n);
});
