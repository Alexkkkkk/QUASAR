/**
 * TEP-64 token metadata (issue #58).
 *
 * https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md
 *
 * Asserts, against a real deployment inside @ton/sandbox:
 *   1. all three documented layouts build and parse back (round trip);
 *   2. the master reports the exact content cell that was baked into its init data;
 *   3. `ProposeContent` / "Apply Content" is a two-step flow behind the 48h
 *      timelock, so metadata can no longer be rewritten in a single transaction;
 *   4. `decimals` is consistent with the 10**decimals mint multiplier.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beginCell, toNano } from '@ton/core';
import { createHash } from 'node:crypto';
import { Blockchain } from '@ton/sandbox';

import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import {
    buildOffchainContent,
    buildOnchainContent,
    buildSemiChainContent,
    parseContent,
    contentLayout,
    assertRequiredFields,
    assertDecimalsConsistent,
    fieldKeyHash,
    toSnakeCell,
    fromSnakeCell,
    CONTENT_OFFCHAIN_PREFIX,
    CONTENT_ONCHAIN_PREFIX
} from '../scripts/lib/tep64.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const METADATA_URL = 'https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json';
const DECIMALS = 9;
const ATTRIBUTES: Record<string, string> = {
    name: 'QUASAR',
    symbol: 'QSR',
    decimals: String(DECIMALS),
    image: 'https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/assets/logo.png',
    description: 'QUASAR — the brightest Jetton in the TON universe.'
};

const T0 = 1_800_000_000; // pinned chain clock, as in the other suites
const TIMELOCK = 172_800; // ownerTransferDelay = 48h
const walletCode = beginCell().storeUint(0, 1).endCell();

async function deploy(content = buildOffchainContent(METADATA_URL)) {
    const bc = await Blockchain.create();
    bc.now = T0;
    const owner = await bc.treasury('owner');
    const raw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(raw);
    await master.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Deploy', queryId: 1n });
    return { bc, owner, master, content };
}

// ═══════════════════════ layout round trips ═══════════════════════

test('TEP-64 off-chain content is 0x01 ++ ASCII URI', () => {
    const cell = buildOffchainContent(METADATA_URL);
    const s = cell.beginParse();
    assert.equal(s.loadUint(8), CONTENT_OFFCHAIN_PREFIX, 'off-chain content must start with 0x01');
    assert.equal(s.loadStringTail(), METADATA_URL);
    assert.equal(contentLayout(cell), 'offchain');
    const parsed = parseContent(cell);
    assert.equal(parsed.layout, 'offchain');
    assert.equal(parsed.uri, METADATA_URL);
});

test('TEP-64 on-chain content is 0x00 ++ sha256-keyed dictionary and round-trips', () => {
    const cell = buildOnchainContent(ATTRIBUTES);
    const s = cell.beginParse();
    assert.equal(s.loadUint(8), CONTENT_ONCHAIN_PREFIX, 'on-chain content must start with 0x00');

    const parsed = parseContent(cell);
    assert.equal(parsed.layout, 'onchain');
    assert.deepEqual(parsed.fields, ATTRIBUTES);

    // The key really is sha256 of the attribute name, as the standard requires.
    assert.equal(fieldKeyHash('name'), BigInt('0x' + createHash('sha256').update('name').digest('hex')));
});

test('TEP-64 semi-chain content carries the mandatory `uri` attribute', () => {
    const parsed = parseContent(buildSemiChainContent(ATTRIBUTES, METADATA_URL));
    assert.equal(parsed.layout, 'onchain');
    assert.equal(parsed.fields?.uri, METADATA_URL, 'semi-chain content must include `uri`');
    assert.equal(parsed.fields?.name, 'QUASAR');
});

test('TEP-64 snake encoding survives values larger than one cell', () => {
    const long = 'Q'.repeat(2500); // 2500 bytes => three 1023-bit chunks
    const cell = toSnakeCell(long);
    assert.ok(cell.refs.length > 0, 'a 2500-byte value must chain into child cells');
    assert.equal(fromSnakeCell(cell), long);
});

test('TEP-64 parser rejects an unknown prefix instead of guessing', () => {
    const parsed = parseContent(beginCell().storeUint(0x05, 8).storeUint(0, 8).endCell());
    assert.equal(parsed.layout, 'unknown');
});

test('TEP-64 preflight rejects a decimals / mint-multiplier mismatch', () => {
    assert.doesNotThrow(() => assertDecimalsConsistent(ATTRIBUTES, DECIMALS));
    assert.throws(() => assertDecimalsConsistent({ ...ATTRIBUTES, decimals: '6' }, DECIMALS), /disagrees with the mint multiplier/);
    assert.throws(() => assertRequiredFields({ name: 'QUASAR', symbol: 'QSR' }), /missing the required attribute "decimals"/);
});

// ═══════════════════════ deployed master ═══════════════════════

test('the deployed master reports the exact init-data content cell (F-58)', async () => {
    const content = buildOnchainContent(ATTRIBUTES);
    const { master } = await deploy(content);
    const data = await master.getGetJettonData();
    assert.equal(
        data.jettonContent.hash().toString('hex'),
        content.hash().toString('hex'),
        'get_jetton_data().jetton_content must equal the content cell used at deploy'
    );
    assert.deepEqual(parseContent(data.jettonContent).fields, ATTRIBUTES);
});

test('metadata can no longer be rewritten in one transaction (two-step + timelock)', async () => {
    const { bc, owner, master } = await deploy();
    const replacement = buildSemiChainContent(ATTRIBUTES, METADATA_URL);

    await master.send(owner.getSender(), { value: toNano('0.05') }, {
        $$type: 'ProposeContent',
        newContent: replacement
    });

    const pending = await master.getGetPendingContent();
    assert.ok(pending, 'the proposal must be staged, not applied');
    assert.equal(pending!.hash().toString('hex'), replacement.hash().toString('hex'));
    assert.equal((await master.getGetContentAt()).toString(), String(T0 + TIMELOCK), 'the delay must be 48h');

    // No change before the delay elapses.
    const before = await master.getGetJettonData();
    assert.equal(before.jettonContent.hash().toString('hex'), buildOffchainContent(METADATA_URL).hash().toString('hex'));

    // Confirming early must fail and leave the staged proposal untouched.
    let earlyFailed = false;
    try {
        await master.send(owner.getSender(), { value: toNano('0.05') }, 'Apply Content');
    } catch {
        earlyFailed = true;
    }
    const stillPending = await master.getGetPendingContent();
    assert.ok(stillPending, 'an early confirmation must not consume the proposal');
    if (!earlyFailed) {
        const unchanged = await master.getGetJettonData();
        assert.equal(
            unchanged.jettonContent.hash().toString('hex'),
            buildOffchainContent(METADATA_URL).hash().toString('hex'),
            'metadata must be unchanged while the timelock is active'
        );
    }

    // After the delay the same message applies the staged content.
    bc.now = T0 + TIMELOCK + 1;
    await master.send(owner.getSender(), { value: toNano('0.05') }, 'Apply Content');

    const after = await master.getGetJettonData();
    assert.equal(after.jettonContent.hash().toString('hex'), replacement.hash().toString('hex'));
    assert.equal(await master.getGetPendingContent(), null, 'the proposal must be cleared once applied');
    assert.equal((await master.getGetContentAt()).toString(), '0');
});

test('content updates are gated on the owner and reversible before confirmation', async () => {
    const { owner, master } = await deploy();
    const stranger = (await (await Blockchain.create()).treasury('stranger')).address;
    const replacement = buildSemiChainContent(ATTRIBUTES, METADATA_URL);

    await master.send(owner.getSender(), { value: toNano('0.05') }, {
        $$type: 'ProposeContent',
        newContent: replacement
    });
    await master.send(owner.getSender(), { value: toNano('0.05') }, 'Cancel Content');
    assert.equal(await master.getGetPendingContent(), null, 'Cancel Content must clear the proposal');
    assert.equal((await master.getGetContentAt()).toString(), '0');

    // A non-owner proposal must not even be staged.
    let rejected = false;
    try {
        await master.send(
            (await (await Blockchain.create()).treasury('nobody')).getSender(),
            { value: toNano('0.05') },
            { $$type: 'ProposeContent', newContent: replacement }
        );
    } catch {
        rejected = true;
    }
    assert.ok(rejected || (await master.getGetPendingContent()) === null, 'a non-owner must not stage metadata');
    void stranger;
});

test('F-58 source: the metadata message and the timelocked confirmation exist', () => {
    const master = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');
    assert.ok(master.includes('message ProposeContent { newContent: Cell }'), 'ProposeContent must be declared');
    assert.ok(master.includes('receive(msg: ProposeContent)'), 'the master must handle ProposeContent');
    assert.ok(master.includes('receive("Apply Content")'), 'a separate confirmation receiver is required');
    assert.ok(
        master.includes('require(self.contentAt > 0 && now() >= self.contentAt, "Content timelock active");'),
        'the confirmation must enforce the timelock'
    );
    assert.ok(master.includes('get fun get_pending_content(): Cell?'), 'the staged content must be readable');

    // The serialization helper used by the deploy script must exist too.
    const helper = readFileSync(join(__dirname, '..', 'scripts', 'lib', 'tep64.ts'), 'utf8');
    for (const fn of ['buildOffchainContent', 'buildOnchainContent', 'buildSemiChainContent', 'parseContent']) {
        assert.ok(helper.includes(fn), `scripts/lib/tep64.ts must export ${fn}`);
    }
    void helper;
});
