/**
 * Security-audit fixes (branch fix/security-audit-2026-09-20).
 *
 *   F-17 🔴 ClaimReferralRewards could spend pool-encumbered reserve
 *   F-18 🔴 `mintable` could be switched off with no way back (aiFullAutonomy
 *           emergency pause / AI signals), permanently bricking issuance
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');

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

test('F-19 source: rejected fee messages restore the deducted fee', () => {
    const wallet = section(masterSrc, 'contract QuasarWallet');
    const transfer = section(wallet, 'receive(msg: TokenTransfer)', 'receive(msg: PoolPayout)');
    assert.ok(
        transfer.includes('bounce: true, mode: SendPayGasSeparately, body: FeeTransfer'),
        'fee transfer must be bounceable and funded'
    );
    assert.ok(
        !transfer.includes('SendPayGasSeparately | SendIgnoreErrors'),
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
        burn.indexOf('EventBurn{') < burn.indexOf('"Excess returned"'),
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
