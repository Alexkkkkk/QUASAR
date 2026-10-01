// Guards for the release surface that is NOT contract code.
//
// Three independent drifts are covered here, each of which silently makes a
// green local run meaningless:
//
//  1. `.nvmrc` vs the CI Node version vs `package.json` `engines`. When CI
//     pinned Node 24 while `.nvmrc` said 22, `npm test` passing locally proved
//     nothing about CI. `.nvmrc` is now the single source of truth and CI reads
//     it with `node-version-file`.
//  2. `process.env` variables read by `scripts/**` but missing from
//     `.env.example`. An undocumented switch (`JETTON_CONTENT_LAYOUT`,
//     `TIMELOCK_ADMIN`, ...) is a deployment hazard: the operator cannot know
//     it exists.
//  3. The TEP-64 metadata URL. The content cell is part of the jetton init data
//     and can only be replaced through the 48h ProposeContent -> "Apply
//     Content" timelock, so the URL must be written down together with the MIME
//     type its origin serves.
//
// Run with: node --import tsx --test tests/toolchain_and_docs.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;

function read(relativePath: string): string {
    return readFileSync(join(ROOT, relativePath), 'utf8');
}

test('toolchain: .nvmrc is the single source of truth for the CI Node version', () => {
    const nvmrc = read('.nvmrc').trim();
    assert.match(nvmrc, /^\d+$/, '.nvmrc must contain a single major version');

    const ci = read('.github/workflows/ci.yml');
    assert.ok(
        ci.includes('node-version-file: .nvmrc'),
        'CI must derive the Node version from .nvmrc instead of hardcoding a literal'
    );
    assert.ok(
        !/node-version:\s*\d+/.test(ci),
        'CI must not pin a literal node-version beside node-version-file'
    );

    // The pinned version must be inside the range `engines` advertises.
    const pkg = JSON.parse(read('package.json')) as { engines?: { node?: string } };
    const range = pkg.engines?.node ?? '';
    const majors = [...range.matchAll(/(\d+)/g)].map((m) => m[1]);
    assert.ok(
        majors.includes(nvmrc),
        `engines.node "${range}" must include the .nvmrc major ${nvmrc}`
    );
});

test('toolchain: every environment variable read by scripts is documented', () => {
    const scriptsDir = join(ROOT, 'scripts');

    function scriptFiles(dir: string): string[] {
        const out: string[] = [];
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const full = join(dir, entry.name);
            if (entry.isDirectory()) out.push(...scriptFiles(full));
            else if (entry.name.endsWith('.ts')) out.push(full);
        }
        return out;
    }

    const envExample = read('.env.example');
    const missing: string[] = [];
    for (const file of scriptFiles(scriptsDir)) {
        const source = readFileSync(file, 'utf8');
        for (const [, name] of source.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)) {
            if (!envExample.includes(name)) missing.push(`${name} (${file.slice(ROOT.length)})`);
        }
    }
    assert.deepEqual(
        [...new Set(missing)],
        [],
        'every process.env variable read by scripts/** must appear in .env.example'
    );
});

test('docs: the TEP-64 metadata URL is recorded with the MIME type its origin serves', () => {
    const matrix = read('docs/TON_CONFORMANCE_MATRIX.md');
    assert.ok(
        matrix.includes('application/json'),
        'the conformance matrix must record which origin serves the metadata document as application/json'
    );
    assert.ok(
        matrix.includes('raw.githubusercontent.com'),
        'the conformance matrix must name the text/plain origin it warns about'
    );

    // The deploy script must keep the URL configurable: baking a literal into
    // the init data without an override would make a hosting change permanent.
    const deploy = read('scripts/deploy_all.ts');
    assert.ok(
        deploy.includes('JETTON_METADATA_URL'),
        'the metadata URL must stay overridable through JETTON_METADATA_URL'
    );
    assert.ok(
        deploy.includes('JETTON_CONTENT_LAYOUT'),
        'the TEP-64 layout must stay selectable through JETTON_CONTENT_LAYOUT'
    );
});
