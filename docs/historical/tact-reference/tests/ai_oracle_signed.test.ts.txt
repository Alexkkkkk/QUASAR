/**
 * A-67 — signed AI oracle decisions, verified on-chain.
 *
 * These tests run the real compiled `QuasarMaster` in `@ton/sandbox` and prove
 * the three properties the signature scheme exists for:
 *
 *   1. a decision signed by the installed oracle key is accepted,
 *   2. the same decision cannot be replayed (nonce / expiry),
 *   3. a decision signed by anybody else, or for the wrong payload, is rejected.
 *
 * The signing side is `scripts/ai_oracle.ts`, so both halves of the wire format
 * are exercised against each other — a field reordering on either side fails
 * here instead of in production.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { keyPairFromSeed, sign } from '@ton/crypto';
import { Blockchain, internal } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import {
    AI_DECISION_DOMAIN,
    SIGNED_DECISION_OPCODE,
    buildSignedDecisionCell,
    keyPairFromHex,
    publicKeyToUint256,
    signOracleDecision
} from '../scripts/ai_oracle.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const QSR = 1_000_000_000n;

/** Deterministic key pairs so a failure is always reproducible. */
const ORACLE_KEY = keyPairFromSeed(Buffer.alloc(32, 0x42));
const ATTACKER_KEY = keyPairFromSeed(Buffer.alloc(32, 0x99));

const ORACLE_PUBKEY = publicKeyToUint256(ORACLE_KEY);

type Eco = { bc: Blockchain; owner: any; master: any; masterAddr: Address; relayer: any };

async function deployEco(withOracleKey = true): Promise<Eco> {
    const bc = await Blockchain.create();
    bc.now = 1_000_000;
    const owner = await bc.treasury('owner');
    const relayer = await bc.treasury('relayer');

    const content = beginCell()
        .storeUint(1, 8)
        .storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json')
        .endCell();
    const masterRaw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(masterRaw);
    await master.send(owner.getSender(), { value: toNano('0.5') }, { $$type: 'Deploy', queryId: 1n });

    if (withOracleKey) {
        await master.send(owner.getSender(), { value: toNano('0.1') }, {
            $$type: 'SetAiOracleKey',
            publicKey: ORACLE_PUBKEY
        });
    }
    return { bc, owner, master, masterAddr: masterRaw.address, relayer };
}

/** True when at least one transaction in the tree reverted in the compute phase. */
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

/**
 * Send a signed decision from an arbitrary relayer address.
 *
 * A raw cell is used on purpose (not the generated `$$type` object) so the test
 * exercises the exact body `signOracleDecision()` produces — that is the whole
 * point of pinning the opcode and the field order.
 */
async function relay(eco: Eco, body: Cell, from?: any) {
    const src = (from ?? eco.relayer).address as Address;
    return eco.bc.sendMessage(internal({
        from: src,
        to: eco.masterAddr,
        value: toNano('0.1'),
        bounce: true,
        body
    }));
}

// ═══════════════ Key management ═══════════════

test('oracle key is unset at deployment and owner-controlled', async () => {
    const eco = await deployEco(false);
    assert.equal(await eco.master.getGetAiOracleKey(), 0n, 'no oracle key must exist before it is installed');
    assert.equal(await eco.master.getGetAiSignedDecisionCount(), 0n);

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'SetAiOracleKey',
        publicKey: ORACLE_PUBKEY
    });
    assert.equal(await eco.master.getGetAiOracleKey(), ORACLE_PUBKEY);

    // A stranger cannot install a key, i.e. cannot become the oracle.
    await expectBlocked(
        eco.master.send(eco.relayer.getSender(), { value: toNano('0.1') }, {
            $$type: 'SetAiOracleKey',
            publicKey: publicKeyToUint256(ATTACKER_KEY)
        }),
        'a non-owner must not install an oracle key'
    );
    assert.equal(await eco.master.getGetAiOracleKey(), ORACLE_PUBKEY, 'the attacker key must not be installed');

    // Revocation is owner-only too.
    await expectBlocked(
        eco.master.send(eco.relayer.getSender(), { value: toNano('0.1') }, { $$type: 'ClearAiOracleKey' }),
        'a non-owner must not revoke the oracle key'
    );
    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, { $$type: 'ClearAiOracleKey' });
    assert.equal(await eco.master.getGetAiOracleKey(), 0n);
});

// ═══════════════ Wire format ═══════════════

test('signed payload cell layout is pinned on both sides', () => {
    const cell = buildSignedDecisionCell({
        queryId: 7n,
        nonce: 3n,
        validUntil: 2_000_000,
        action: 'setBurnShare',
        value: 55,
        payloadHash: 0n
    });
    const s = cell.beginParse();
    assert.equal(s.loadUint(32), AI_DECISION_DOMAIN);
    // @ton/core returns a number for narrow fields and a bigint for wide ones,
    // so every wide read is normalised before comparing.
    assert.equal(BigInt(s.loadUint(64)), 7n);
    assert.equal(BigInt(s.loadUint(64)), 3n);
    assert.equal(s.loadUint(32), 2_000_000);
    assert.equal(s.loadUint(8), 1, 'setBurnShare is action id 1');
    assert.equal(s.loadUint(16), 55);
    assert.equal(BigInt(s.loadUint(256)), 0n);
    assert.equal(SIGNED_DECISION_OPCODE, 0x7a1e5c01);
});

test('signed body carries the pinned opcode, the fields and a 64-byte signature', () => {
    const signed = signOracleDecision(
        { queryId: 1n, nonce: 1n, validUntil: 2_000_000, action: 'heartbeat', value: 0 },
        ORACLE_KEY
    );
    const s = signed.body.beginParse();
    assert.equal(s.loadUint(32), SIGNED_DECISION_OPCODE);
    assert.equal(BigInt(s.loadUint(64)), 1n);
    assert.equal(BigInt(s.loadUint(64)), 1n);
    assert.equal(s.loadUint(32), 2_000_000);
    assert.equal(s.loadUint(8), 0);
    assert.equal(s.loadUint(16), 0);
    assert.equal(BigInt(s.loadUint(256)), 0n);
    const sig = s.loadBuffer(64);
    assert.equal(sig.length, 64);
    assert.equal(sig.toString('hex'), signed.signatureHex);
    assert.equal(s.remainingBits, 0, 'the body must be consumed exactly');
});

test('signatures verify against the payload hash and key derivation is stable', () => {
    const args = { queryId: 1n, nonce: 5n, validUntil: 2_000_000, action: 'pause' as const, value: 1 };
    const signed = signOracleDecision(args, ORACLE_KEY);
    assert.equal(signed.payloadHashHex, signed.payload.hash().toString('hex'));
    // Ed25519 over the cell hash — the same primitive the contract uses (CHKSIGNU).
    assert.equal(sign(signed.payload.hash(), ORACLE_KEY.secretKey).toString('hex'), signed.signatureHex);
    assert.equal(keyPairFromHex(ORACLE_KEY.secretKey.toString('hex'), 'secret').publicKey.toString('hex'),
        ORACLE_KEY.publicKey.toString('hex'));
});

// ═══════════════ On-chain acceptance ═══════════════

test('a signed decision is accepted from an untrusted relayer and advances the nonce', async () => {
    const eco = await deployEco();
    assert.equal(await eco.master.getGetAiNonce(), 0n);

    const signed = signOracleDecision(
        { queryId: 11n, nonce: 1n, validUntil: Number(eco.bc.now) + 600, action: 'heartbeat', value: 0 },
        ORACLE_KEY
    );
    const res = await relay(eco, signed.body);
    assert.ok(!anyComputeFailed(res), 'a correctly signed decision must be accepted');
    assert.equal(await eco.master.getGetAiNonce(), 1n);
    assert.equal(await eco.master.getGetAiSignedDecisionCount(), 1n);
});

test('a signed setBurnShare decision changes the fee split', async () => {
    const eco = await deployEco();
    const before = await eco.master.getGetFeeConfig();
    assert.equal(before.burnShare, 50n, 'deployment default is 50% burn');

    const signed = signOracleDecision(
        { queryId: 12n, nonce: 1n, validUntil: Number(eco.bc.now) + 600, action: 'setBurnShare', value: 70 },
        ORACLE_KEY
    );
    const res = await relay(eco, signed.body);
    assert.ok(!anyComputeFailed(res), 'a signed burn-share change must be accepted');
    assert.equal((await eco.master.getGetFeeConfig()).burnShare, 70n);
    assert.equal(await eco.master.getGetAiNonce(), 1n, 'the nonce advances exactly once');
});

test('a signed pause decision blocks trading and is reversible by the owner override', async () => {
    const eco = await deployEco();
    assert.equal(await eco.master.getIsTradingEnabled(), true);

    const signed = signOracleDecision(
        { queryId: 13n, nonce: 1n, validUntil: Number(eco.bc.now) + 600, action: 'pause', value: 1 },
        ORACLE_KEY
    );
    const res = await relay(eco, signed.body);
    assert.ok(!anyComputeFailed(res), 'a signed pause must be accepted');
    assert.equal(await eco.master.getIsPaused(), true);
    assert.equal(await eco.master.getIsTradingEnabled(), false);

    // The pause is recorded in the same reversible log as the address-authenticated
    // actions, so the owner safety window still covers it.
    const actionId = (await eco.master.getGetAiSignedDecisionCount()) - 1n;
    const logged = await eco.master.getGetAiAction(actionId);
    assert.equal(logged.actionType, 'SignedPause');
    assert.equal(await eco.master.getCanOwnerOverride(actionId), true, 'the signed pause must stay reversible');

    await eco.master.send(eco.owner.getSender(), { value: toNano('0.1') }, {
        $$type: 'OwnerOverride',
        actionId,
        reason: 'operator reverted the signed pause'
    });
    assert.equal(await eco.master.getIsTradingEnabled(), true, 'the owner override must restore trading');
});

// ═══════════════ Rejection paths ═══════════════

test('the same signed decision cannot be replayed', async () => {
    const eco = await deployEco();
    const signed = signOracleDecision(
        { queryId: 14n, nonce: 1n, validUntil: Number(eco.bc.now) + 600, action: 'heartbeat', value: 0 },
        ORACLE_KEY
    );
    const first = await relay(eco, signed.body);
    assert.ok(!anyComputeFailed(first), 'the first submission must succeed');

    const replay = await relay(eco, signed.body);
    assert.ok(anyComputeFailed(replay), 'replaying the identical body must fail');
    assert.equal(await eco.master.getGetAiNonce(), 1n, 'the nonce must not move on a replay');
    assert.equal(await eco.master.getGetAiSignedDecisionCount(), 1n);
});

test('an out-of-order (lower) nonce is rejected', async () => {
    const eco = await deployEco();
    const ttl = Number(eco.bc.now) + 600;
    await relay(eco, signOracleDecision({ queryId: 20n, nonce: 5n, validUntil: ttl, action: 'heartbeat', value: 0 }, ORACLE_KEY).body);

    const lower = await relay(eco, signOracleDecision({ queryId: 21n, nonce: 4n, validUntil: ttl, action: 'heartbeat', value: 0 }, ORACLE_KEY).body);
    assert.ok(anyComputeFailed(lower), 'a lower nonce must be rejected as stale');
    assert.equal(await eco.master.getGetAiNonce(), 5n);
});

test('a decision signed by another key is rejected', async () => {
    const eco = await deployEco();
    const forged = signOracleDecision(
        { queryId: 15n, nonce: 1n, validUntil: Number(eco.bc.now) + 600, action: 'heartbeat', value: 0 },
        ATTACKER_KEY
    );
    const res = await relay(eco, forged.body);
    assert.ok(anyComputeFailed(res), 'a signature from an unknown key must be rejected');
    assert.equal(await eco.master.getGetAiNonce(), 0n, 'a rejected decision must not consume the nonce');
    assert.equal(await eco.master.getGetAiSignedDecisionCount(), 0n);
});

test('a valid signature re-pointed at different values is rejected', async () => {
    const eco = await deployEco();
    const ttl = Number(eco.bc.now) + 600;
    const signed = signOracleDecision(
        { queryId: 16n, nonce: 1n, validUntil: ttl, action: 'setBurnShare', value: 20 },
        ORACLE_KEY
    );
    // Take the genuine signature but claim a different burn share: the signed
    // cell no longer matches, so the hash differs and the check fails.
    const tampered = beginCell()
        .storeUint(SIGNED_DECISION_OPCODE, 32)
        .storeUint(16n, 64)
        .storeUint(1n, 64)
        .storeUint(ttl, 32)
        .storeUint(1, 8)
        .storeUint(99, 16)
        .storeUint(0n, 256)
        .storeSlice(beginCell().storeBuffer(Buffer.from(signed.signatureHex, 'hex')).endCell().asSlice())
        .endCell();
    const res = await relay(eco, tampered);
    assert.ok(anyComputeFailed(res), 'a tampered value must invalidate the signature');
    assert.equal((await eco.master.getGetFeeConfig()).burnShare, 50n, 'the burn share must not change');
});

test('an expired signed decision is rejected', async () => {
    const eco = await deployEco();
    const expired = signOracleDecision(
        { queryId: 17n, nonce: 1n, validUntil: Number(eco.bc.now) - 1, action: 'heartbeat', value: 0 },
        ORACLE_KEY
    );
    const res = await relay(eco, expired.body);
    assert.ok(anyComputeFailed(res), 'an expired decision must be rejected even with a valid signature');
    assert.equal(await eco.master.getGetAiNonce(), 0n);
});

test('signed decisions are inert until the owner installs a key', async () => {
    const eco = await deployEco(false);
    const signed = signOracleDecision(
        { queryId: 18n, nonce: 1n, validUntil: Number(eco.bc.now) + 600, action: 'heartbeat', value: 0 },
        ORACLE_KEY
    );
    const res = await relay(eco, signed.body);
    assert.ok(anyComputeFailed(res), 'a decision must be rejected while no key is installed');
    assert.equal(await eco.master.getGetAiSignedDecisionCount(), 0n);
});

test('an unsupported signed action is rejected and does not consume the nonce', async () => {
    const eco = await deployEco();
    const ttl = Number(eco.bc.now) + 600;
    const unsupported = signOracleDecision(
        { queryId: 19n, nonce: 1n, validUntil: ttl, action: 2, value: 0 },
        ORACLE_KEY
    );
    // action 2 with value 0 asks to resume, which requires full autonomy.
    const res = await relay(eco, unsupported.body);
    assert.ok(anyComputeFailed(res), 'resuming without full autonomy must be rejected');
    // Every state change of the reverted transaction rolls back together, so the
    // nonce is NOT consumed and the operator can retry the same signature.
    assert.equal(await eco.master.getGetAiNonce(), 0n, 'a reverted decision must not burn the nonce');
    assert.equal(await eco.master.getGetAiSignedDecisionCount(), 0n);
});

test('the signed-decision domain and opcode are recorded in the contract source', () => {
    const src = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
    assert.ok(src.includes('const AI_DECISION_DOMAIN: Int = 0x51a5c3d2;'), 'the domain tag must stay pinned');
    assert.ok(src.includes('message(0x7a1e5c01) AISignedDecision'), 'the message opcode must stay pinned');
    assert.ok(src.includes('checkSignature(signed.hash(), msg.signature, self.aiOraclePubKey)'),
        'the contract must verify the signature against the stored key');
    assert.ok(src.includes('require(msg.nonce > self.aiNonce, "Stale oracle nonce");'),
        'the contract must enforce a strictly increasing nonce');
    assert.ok(src.includes('require(msg.validUntil >= now(), "Signed decision expired");'),
        'the contract must enforce the expiry');
});
