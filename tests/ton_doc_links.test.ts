// Offline guard for the TON Docs links cited by the repository.
//
// The 2026-10-06 pass found three cited source URLs that return HTTP 404 on
// docs.ton.org, so the "documentation source" they point at cannot be opened by
// a reviewer. This test pins the retired paths so a copy/paste regression is
// caught without network access; live reachability is a separate manual check.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'build', 'node_modules', '__pycache__', 'tests']);
const SCAN_EXT = new Set(['.md', '.json', '.ts', '.yml', '.yaml']);

// Assembled from fragments so this file does not match its own scan.
const RETIRED = [
    'https://docs.ton.org/contracts/standard/tokens/jettons/' + 'get-jetton-wallet',
    'https://docs.ton.org/blockchain-basics/' + 'languages/tact',
    'https://docs.ton.org/v3/documentation/smart-contracts/contracts-specs/' + 'jetton-standard',
    'https://docs.ton.org/v3/guidelines/ton-connect/guidelines/' + 'creating-manifest',
];

function collectFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collectFiles(full, out);
        else if (SCAN_EXT.has(extname(entry))) out.push(full);
    }
    return out;
}

test('no repository document cites a retired TON Docs path', () => {
    const offenders: string[] = [];
    for (const file of collectFiles(root)) {
        const text = readFileSync(file, 'utf8');
        for (const url of RETIRED) {
            if (text.includes(url)) offenders.push(`${relative(root, file).replaceAll('\\', '/')}: ${url}`);
        }
    }
    assert.deepEqual(offenders, [], `retired TON Docs paths still cited:\n${offenders.join('\n')}`);
});

test('the conformance matrix cites the reachable replacement sources', () => {
    const matrix = readFileSync(join(root, 'docs', 'TON_CONFORMANCE_MATRIX.md'), 'utf8');
    assert.match(matrix, /https:\/\/docs\.ton\.org\/contracts\/standard\/tokens\/jettons\/find/);
    assert.match(matrix, /https:\/\/docs\.ton\.org\/tolk\/overview/);
});

test('the TON Connect audit notes cite the reachable replacement page', () => {
    const docs = ['docs/AUDIT_2026-10-02.md', 'docs/AUDIT_2026-10-06.md', 'docs/CONFORMANCE_FIX_2026-09-28.md'];
    for (const doc of docs) {
        const text = readFileSync(join(root, doc), 'utf8');
        assert.match(text, /(?:^|\s)https:\/\/docs\.ton\.org\/applications\/ton-connect\/core-concepts(?:\/)?(?=\s|$|[)\].,;:!?`'"])/m,
            `${doc} must cite the live TON Connect core-concepts page`);
    }
});
