/**
 * Doc-conformance regression tests — 2026-09-30 TON-documentation pass.
 *
 *  Q-01 TEP-64 (source + compiled-artifact assertions; the sandbox emulator
 *        could not drive this receiver in this environment): `ProposeContent` accepted a `0x01` off-chain content cell that
 *       carried no URI at all. TEP-64 defines that layout as `0x01 ++ ASCII URI`,
 *       so the staged value is unusable by every wallet and explorer, yet the
 *       receiver reported success and the cell would only surface 48h later in
 *       `Apply Content`. The receiver must reject an empty URI.
 *  Q-02 TEP-89: `_workchainOf` skipped the two TL-B tag bits and then read a
 *       1-bit anycast flag plus an 8-bit workchain — a valid reading only for
 *       `addr_std$10`. For `addr_none$00` (and `addr_var$11`) it reported
 *       workchain 0, so `provide_wallet_address` about an owner that cannot be
 *       addressed was answered with a derived wallet address instead of the
 *       `addr_none` the TEP-89 schema requires.
 *  Q-03 Message modes: a zero-value send with base mode 0 and no
 *       `SendPayGasSeparately` has a negative final value and fails with exit
 *       code 37; `SendIgnoreErrors` (+2) then hides the failure entirely. The
 *       `BurnConfirmed` leg used exactly that combination.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const masterSrc = readFileSync(join(root, 'contracts', 'quasar.tact'), 'utf8');



/** Compute-phase result of the transaction that reached the master. */



test('Q-01 TEP-64: the content receiver validates the layout before staging', () => {
    const abi = readFileSync(join(root, 'build', 'quasar_QuasarMaster.abi'), 'utf8');
    // The staged cell must be read from a length-checked slice, an off-chain
    // 0x01 payload must carry a URI, and the prefix must still be 0x00/0x01.
    assert.match(masterSrc, /let contentSlice: Slice = msg\.newContent\.asSlice\(\);/, 'prefix must be read from a named slice');
    assert.match(masterSrc, /require\(contentSlice\.bits\(\) >= 8, "TEP-64 content too short"\);/, 'a cell without a full prefix byte must be rejected');
    assert.match(masterSrc, /require\(prefix == 0x00 \|\| prefix == 0x01, "Invalid TEP-64 content prefix"\);/, 'only the two documented layouts are allowed');
    assert.match(masterSrc, /if \(prefix == 0x01\) \{ require\(contentSlice\.bits\(\) > 0, "TEP-64 off-chain content needs a URI"\) \}/, '0x01 without a URI must be rejected');
    assert.match(abi, /ProposeContent/, 'the staged-metadata receiver must still be in the ABI');
});

test('Q-02 TEP-89: the workchain reader only accepts addr_std and otherwise answers addr_none', () => {
    const slice = masterSrc.slice(masterSrc.indexOf('fun _workchainOf'), masterSrc.indexOf('receive(msg: ProvideWalletAddress)'));
    assert.match(slice, /if \(s\.bits\(\) < 3\) \{ return null \}/, 'the tag must be bounds-checked');
    assert.match(slice, /let tag: Int = s\.loadUint\(2\);/, 'the TL-B tag must be read, not skipped');
    assert.match(slice, /if \(tag != 2\) \{ return null \}/, 'only addr_std$10 has a single-byte workchain');
    assert.match(slice, /if \(s\.loadUint\(1\) != 0\) \{ return null \}/, 'anycast must be absent');
    assert.ok(slice.indexOf('loadUint(2)') < slice.indexOf('loadInt(8)'), 'the tag is read before the workchain');
    assert.match(masterSrc, /storeUint\(0, 2\)/, 'the addr_none reply path must remain in the master');
});

test('Q-03 message modes: a zero-value send never relies on base mode 0', () => {
    const sources = ['contracts/quasar.tact', 'contracts/quasar_common.tact', 'contracts/quasar_defi.tact', 'contracts/quasar_admin.tact']
        .map((f) => [f, readFileSync(join(root, f), 'utf8')] as const);

    // A bare `mode: SendIgnoreErrors` (mode 2 alone) can only ever mask the
    // exit-37 failure of a zero-value action, so it must not appear at all.
    for (const [file, src] of sources) {
        assert.doesNotMatch(src, /mode:\s*SendIgnoreErrors\s*,/, `${file}: mode 2 alone silently drops a failing action`);
    }

    // The burn confirmation specifically regressed: it must pay its own fee.
    assert.match(
        masterSrc,
        /mode: SendPayGasSeparately \| SendIgnoreErrors,\s*\n\s*body: BurnConfirmed\{ queryId: msg\.queryId \}/,
        'the master burn confirmation must pay the forward fee separately'
    );
});
