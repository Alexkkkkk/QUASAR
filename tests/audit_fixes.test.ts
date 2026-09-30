/**
 * Security-audit fixes (branch fix/security-audit-2026-09-20).
 *
 *   F-17 🔴 ClaimReferralRewards could spend pool-encumbered reserve
 *   F-18 🔴 `mintable` could be switched off with no way back (aiFullAutonomy
 *           emergency pause / AI signals), permanently bricking issuance
 *   F-20 🔴 unauthenticated wallet cleanup messages could erase pending
 *           transfer/payout state before a bounce
 *
 * Source invariants fail if a fix is reverted; the on-chain test drives the
 * real contract through the sandbox.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beginCell, Cell, toNano } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarWallet } from '../build/quasar_QuasarWallet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
const defiSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar_defi.tact'), 'utf8');
const commonSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar_common.tact'), 'utf8');

function section(src: string, from: string, to?: string): string {
    const i = src.indexOf(from);
    assert.ok(i >= 0, `anchor not found: ${from}`);
    const j = to ? src.indexOf(to, i) : src.length;
    return src.slice(i, j > 0 ? j : src.length);
}

test('F-17 source: referral claims cannot touch encumbered pool backing', () => {
    const claim = section(masterSrc, 'receive(msg: ClaimReferralRewards)', 'receive(msg: AddVesting)');
    assert.ok(claim.length > 0, 'ClaimReferralRewards must exist');
    assert.ok(
        claim.includes('require(self.reserveBalance - self._poolEncumbrance() >= pending!!, "Reserve encumbered");'),
        'referral claim must respect the free-reserve guard'
    );
    assert.ok(
        masterSrc.includes('pendingReferralTotal: Int as coins;'),
        'all referral claims must have an aggregate liability counter'
    );
    assert.ok(
        masterSrc.includes('self.buybackPool + self.stakingRewardsPool + self.pendingReferralTotal'),
        'aggregate referral liabilities must encumber the reserve'
    );
    assert.ok(
        masterSrc.includes('self.pendingReferralTotal = self.pendingReferralTotal - pending!!;'),
        'claiming must release the aggregate referral liability'
    );
});

test('referrals reject the zero address', () => {
    const register = section(masterSrc, 'receive(msg: RegisterReferral)', 'receive(msg: SetReferralConfig)');
    assert.ok(
        register.includes('require(msg.referrer != newAddress(0, 0), "Invalid referrer");'),
        'referral rewards must not be assigned to an unclaimable zero address'
    );
});

test('F-18 source: minting can be resumed by the owner', () => {
    assert.ok(masterSrc.includes('receive("Resume Minting")'), 'an owner recovery path for minting must exist');
    const resume = section(masterSrc, 'receive("Resume Minting")', 'receive(msg: TokenNotification)');
    assert.ok(resume.includes('self._requireOwner();'), 'only the owner may resume minting');
    assert.ok(resume.includes('require(!self.aiFullAutonomy, "AI controls");'), 'resume must be blocked while the AI has full autonomy');
    assert.ok(resume.includes('self.mintable = true;'), 'resume must restore the mint flag');
});

async function deployMaster() {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const content = beginCell().storeUint(1, 8).storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json').endCell();
    const master = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const m = bc.openContract(master);
    await m.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Deploy', queryId: 1n });
    return { bc, owner, m };
}

test('F-18 on-chain: only the owner can bring minting back after a full freeze', async () => {
    const { bc, owner, m } = await deployMaster();

    // owner stops minting, then an AI emergency freeze (severity 3) also clears it
    await m.send(owner.getSender(), { value: toNano('0.1') }, 'Stop Minting');
    assert.equal((await m.getGetJettonData()).mintable, false, 'stop minting must clear the flag');

    // a stranger must not be able to resume
    const stranger = await bc.treasury('stranger');
    const bad = await m.send(bc.sender(stranger.address), { value: toNano('0.1') }, 'Resume Minting');
    assert.ok(
        bad.transactions.some((t: any) => t.description?.computePhase?.success === false),
        'a non-owner must not resume minting'
    );
    assert.equal((await m.getGetJettonData()).mintable, false, 'the stranger must not have flipped the flag');

    // the owner restores issuance
    await m.send(owner.getSender(), { value: toNano('0.1') }, 'Resume Minting');
    assert.equal((await m.getGetJettonData()).mintable, true, 'the owner must be able to resume minting');
});

test('F-20 source: wallet cleanup messages authenticate their expected senders', () => {
    for (const [name, src] of [['Master', masterSrc], ['DeFi', defiSrc]] as const) {
        const wallet = section(commonSrc, 'contract QuasarWallet'); // wallet lives in the shared source of truth
        const transferConfirmed = section(wallet, 'receive(msg: TransferConfirmed)', 'receive(msg: BurnConfirmed)');
        assert.ok(
            transferConfirmed.includes('self.pendingResponseReceivers.get(msg.queryId)'),
            `${name} wallet must load the expected transfer receiver`
        );
        assert.ok(
            transferConfirmed.includes('Unauthorized confirmation'),
            `${name} wallet must authenticate transfer confirmations`
        );

        const burnConfirmed = section(wallet, 'receive(msg: BurnConfirmed)', 'receive(msg: TokenExcesses)');
        assert.ok(
            burnConfirmed.includes('sender() == self.master'),
            `${name} wallet must accept burn confirmations only from the master`
        );

        const excesses = section(wallet, 'receive(msg: TokenExcesses)', 'bounced(msg: bounced<InternalTransfer>)');
        assert.ok(
            excesses.includes('pendingResponseReceivers.get(msg.queryId)') &&
                excesses.includes('pendingPoolPayoutReceivers.get(msg.queryId)') &&
                excesses.includes('Unauthorized excess'),
            `${name} wallet must authenticate excesses against the expected destination wallet`
        );
        assert.ok(
            wallet.includes('pendingPoolPayoutReceivers: map<Int, Address>;') &&
                wallet.includes('self.pendingPoolPayoutReceivers.set(msg.queryId, msg.destination);'),
            `${name} wallet must retain the pool payout destination for bounce authentication`
        );
        assert.ok(
            excesses.includes('self.pendingPoolPayoutReceivers.set(msg.queryId, null);'),
            `${name} wallet must consume the pool receiver record with the payout`
        );
    }
});

test('F-07/F-28 source: AI rebalance rollback restores every changed field', () => {
    const rebalance = section(masterSrc, 'receive(msg: AIRebalance)', 'receive(msg: AIPriceSignal)');
    assert.ok(rebalance.includes('let oldFeeBps: Int = self.feeBps;'), 'rebalance must snapshot feeBps');
    assert.ok(rebalance.includes('self.aiActionOldFeeBps.set(id, oldFeeBps);'), 'rebalance must persist the feeBps snapshot');

    const override = section(masterSrc, 'receive(msg: OwnerOverride)', 'receive("Claim AI Control")');
    assert.ok(override.includes('act.actionType == "Rebalance"'), 'rebalance must be owner-overridable');
    assert.ok(override.includes('self.feeBps = oldFeeBps!!'), 'owner override must restore feeBps');
});

test('F-28 source: price history has its own count', () => {
    assert.ok(masterSrc.includes('priceHistoryCount: Int;'), 'price history count must be stored separately');
    assert.ok(masterSrc.includes('self.priceHistoryCount = self.priceHistoryCount + 1;'), 'price samples must increment their own counter');
    assert.ok(masterSrc.includes('priceHistoryCount: self.priceHistoryCount'), 'AI state must expose the price history count');
});

test('owner confirmation: AI paths cannot mutate mintable', () => {
    const price = section(masterSrc, 'receive(msg: AIPriceSignal)', 'receive(msg: AIAnomalyAlert)');
    const anomaly = section(masterSrc, 'receive(msg: AIAnomalyAlert)', 'receive(msg: AIGovernanceProposal)');
    const emergency = section(masterSrc, 'receive(msg: AIEmergencyPause)', 'receive(msg: AISetFee)');
    assert.ok(!price.includes('self.mintable = false;'), 'price signals must not stop minting');
    assert.ok(!anomaly.includes('self.mintable = false;'), 'anomaly alerts must not stop minting');
    assert.ok(!emergency.includes('self.mintable = false;'), 'AI emergency handling must not mutate mintable');
    assert.ok(masterSrc.includes('receive("Stop Minting")'), 'owner must retain the explicit mint-stop path');
});

test('owner confirmation: AI risk paths leave mintable unchanged', async () => {
    const { owner, m } = await deployMaster();
    await m.send(owner.getSender(), { value: toNano('0.1') }, { $$type: 'AISetOracle', oracleAddress: owner.address });

    await m.send(owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'AIPriceSignal', queryId: 1n, priceTon: toNano('1'), volatility: 0n, sentiment: -60n, action: 1n
    });
    assert.equal((await m.getGetJettonData()).mintable, true, 'price signal must not stop minting');

    await m.send(owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'AIAnomalyAlert', queryId: 2n, severity: 3n, anomalyType: 1n, affectedWallets: 0n, recommendedAction: 'pause trading'
    });
    assert.equal((await m.getGetJettonData()).mintable, true, 'anomaly alert must not stop minting');

    await m.send(owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'AIEmergencyPause', queryId: 3n, pause: true, severity: 3n, reason: 'test'
    });
    assert.equal((await m.getGetJettonData()).mintable, true, 'AI emergency pause must not mutate mintable');

    await m.send(owner.getSender(), { value: toNano('0.1') }, 'Stop Minting');
    assert.equal((await m.getGetJettonData()).mintable, false, 'owner must still be able to stop minting explicitly');
});

test('P0.2 source: the master confirms transfers for source-wallet cleanup', () => {
    const fee = section(masterSrc, 'receive(msg: FeeTransfer)', 'receive(msg: TriggerBuyback)');
    assert.ok(
        fee.includes('body: TransferConfirmed{ queryId: msg.queryId }.toCell()'),
        'the master must dispatch TransferConfirmed once the fee source is authenticated'
    );
    assert.ok(
        fee.includes('"Invalid fee source"'),
        'the cleanup dispatch must sit behind fee-source authentication'
    );
    const wallet = section(commonSrc, 'receive(msg: InternalTransfer)', 'receive(msg: TransferConfirmed)');
    assert.ok(
        !wallet.includes('TransferConfirmed{'),
        'the receiving wallet must keep the TEP-74 excess refund as its only extra message'
    );
    const confirm = section(commonSrc, 'receive(msg: TransferConfirmed)', 'receive(msg: BurnConfirmed)');
    assert.ok(
        confirm.includes('if (receiver == null) { return }'),
        'stale confirmations must be a no-op instead of reverting'
    );
    assert.ok(
        confirm.includes('sender() == self.master'),
        'confirmations must be authenticated against the master'
    );
});

test('P0.2 on-chain: a query id is reusable after a successful transfer', async () => {
    const QSR = 1_000_000_000n;
    const { bc, owner, m } = await deployMaster();
    const alice = await bc.treasury('alice');
    const bob = await bc.treasury('bob');

    await m.send(owner.getSender(), { value: toNano('0.3') }, { $$type: 'Mint', amount: 1_000n * QSR, receiver: alice.address });

    const aliceC = bc.openContract(await QuasarWallet.fromInit(alice.address, m.address));
    const mkTransfer = (queryId: bigint) => aliceC.send(bc.sender(alice.address), { value: toNano('0.1') }, {
        $$type: 'TokenTransfer',
        queryId,
        amount: 100n * QSR,
        destination: bob.address,
        responseDestination: alice.address,
        customPayload: null,
        forwardTonAmount: 0n,
        forwardPayload: beginCell().endCell().asSlice()
    });

    const first = await mkTransfer(7n);
    assert.ok(
        !first.transactions.some((t: any) => t.description?.computePhase?.success === false),
        'the first transfer must fully commit'
    );

    // Clear the 5s wallet cooldown, then reuse the same query id. Before the
    // master-confirmed cleanup this reverted with "Query ID already used"
    // because the pending maps kept the id forever.
    bc.now = 2000;
    const second = await mkTransfer(7n);
    assert.ok(
        !second.transactions.some((t: any) => t.description?.computePhase?.success === false),
        'reusing the query id after confirmation must not revert - pending state must be cleaned'
    );
});

test('F-19 source: rejected fee messages restore the deducted fee', () => {
    const wallet = section(commonSrc, 'contract QuasarWallet'); // wallet lives in the shared source of truth
    const transfer = section(wallet, 'receive(msg: TokenTransfer)', 'receive(msg: PoolPayout)');
    assert.ok(
        transfer.includes('bounce: true, mode: SendPayGasSeparately, body: FeeTransfer'),
        'fee transfer must be bounceable and funded'
    );
    // The no-silent-ignore rule protects the FEE leg specifically: a dropped
    // FeeTransfer would leave the pending ledgers dirty (F-20). The residual
    // refund introduced by F-30-04 is a different send — its failure costs
    // nothing but the refund itself, so it may use SendIgnoreErrors (the same
    // combination the Q-03 invariant approves for the BurnConfirmed leg).
    const feeSend = transfer.slice(transfer.indexOf('body: FeeTransfer') - 400, transfer.indexOf('body: FeeTransfer') + 60);
    assert.ok(
        !feeSend.includes('SendIgnoreErrors'),
        'fee transfer must not silently ignore delivery errors'
    );
    assert.ok(
        wallet.includes('bounced(msg: bounced<FeeTransfer>)'),
        'a bounced fee must be restored to the sender wallet'
    );
});

test('F-20 source: remaining-value actions are kept last in multi-send flows', () => {
    const burn = section(masterSrc, 'receive(msg: BurnNotification)', 'receive(msg: TokenNotification)');
    assert.ok(
        burn.indexOf('EventBurn{') < burn.indexOf('TokenExcesses{'),
        'burn event must be emitted before the final excess refund'
    );

    const buyback = section(masterSrc, 'fun _executeBuyback', 'fun _sendBuybackToDefi');
    assert.ok(
        buyback.indexOf('self._sendBuybackToDefi') < buyback.indexOf('EventBuybackExecuted{'),
        'buyback event must not drain value before the DeFi leg'
    );

    const custody = section(masterSrc, 'fun _sendCustodiedTokens', 'receive(msg: Mint)');
    assert.ok(
        custody.includes('value: ton("0.02")') && custody.includes('mode: SendPayGasSeparately'),
        'custodied payouts must leave value for the following event'
    );
});
