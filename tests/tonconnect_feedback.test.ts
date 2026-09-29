/**
 * UI/docs conformance for issue #65.
 *
 * The dApp must surface the same guardrails the contracts enforce and distinguish
 * a user-cancelled wallet action from a transport/runtime failure.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const web = readFileSync(join(root, 'website', 'tonconnect.js'), 'utf8');
const html = readFileSync(join(root, 'website', 'index.html'), 'utf8');
const manifest = readFileSync(join(root, 'website', 'tonconnect-manifest.json'), 'utf8');

function mustContain(src: string, needle: string, why: string) {
    assert.ok(src.includes(needle), why + ` (missing: ${needle})`);
}

test('issue #65: TON Connect distinguishes cancellation from other failures', () => {
    mustContain(web, 'function describeTonConnectError(error)', 'the dApp must classify TON Connect failures');
    mustContain(web, "kind: 'cancel'", 'user cancellation must map to a dedicated branch');
    mustContain(web, 'Transaction cancelled in wallet', 'the cancel branch must be surfaced to the user');
    mustContain(web, 'return { ok: true, tx };', 'successful requests must return an explicit ok result');
    mustContain(web, "return { ok: false, cancelled: status.kind === 'cancel', error: e };", 'failed requests must preserve cancel/error state');
});

test('issue #65: swaps and liquidity actions surface min-output and deadline guardrails', () => {
    mustContain(web, 'formatGuardDeadline(until)', 'transaction summaries must include a human-readable deadline');
    mustContain(web, 'Min out ${fmtTon(minTonOut)} · deadline ${formatGuardDeadline(until)}', 'QSR->TON swaps must surface min-out and deadline');
    mustContain(web, 'Min out ${fmtQsr(minQsrOut)} · deadline ${formatGuardDeadline(until)}', 'TON->QSR swaps must surface min-out and deadline');
    mustContain(web, 'Min LP ${minLpOut.toString()} · deadline ${formatGuardDeadline(until)}', 'LP adds must surface min-out and deadline');
    mustContain(web, 'Min ${fmtTon(minTonOut)} / ${fmtQsr(minQsrOut)} · deadline ${formatGuardDeadline(until)}', 'LP removals must surface both min-out values and deadline');
    mustContain(html, 'Swap guardrails: min out', 'the page must show swap guardrails before submission');
    mustContain(html, 'Liquidity guardrails: min LP 1 · deadline 5 min', 'the page must show add-liquidity guardrails before submission');
    mustContain(html, 'Liquidity guardrails: min TON/QSR outputs default to 1 nanotoken · deadline 5 min', 'the page must show remove-liquidity guardrails before submission');
});

test('issue #65: manifest icon and REST-vs-jsonRPC comments stay pinned', () => {
    mustContain(manifest, 'assets/icon-180.png', 'the manifest must keep the PNG icon required by TON Connect');
    mustContain(web, 'Strip the jsonRPC suffix so REST reads do not', 'the REST/jsonRPC split must remain documented in source');
    mustContain(web, 'runGetMethod', 'getter calls must still use jsonRPC');
});
