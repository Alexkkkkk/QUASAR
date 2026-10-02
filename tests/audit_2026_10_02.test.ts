// Regression guard for the 2026-10-02 audit (issues #74, #77, #86, #94).
// The fixes in that audit are mostly configuration / documentation / tooling,
// so this suite asserts the invariants that would otherwise silently regress:
// TEP-64 off-chain metadata hosting, CI toolchain sync, the protected AI-agent
// workflow, and the multisig handoff runbook.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

test('TEP-64 off-chain metadata is hosted on a JSON-capable origin (issue #77)', () => {
    const metadata = JSON.parse(read('website/metadata.json')) as Record<string, string>;
    assert.equal(metadata.symbol, 'QSR');
    assert.equal(metadata.decimals, '9');
    assert.ok(metadata.image.length > 0, 'metadata.image is required');
    // raw.githubusercontent.com serves every file as text/plain, which wallets
    // and indexers reject for TEP-64 off-chain content. The image must come from
    // the Pages origin, which returns image/png.
    assert.ok(
        metadata.image.startsWith('https://alexkkkkk.github.io/QUASAR/'),
        `metadata.image must be hosted on the Pages origin, got ${metadata.image}`
    );
    assert.ok(
        !metadata.image.includes('raw.githubusercontent.com'),
        'metadata.image must not be served from raw.githubusercontent.com'
    );
});

test('deploy preflight rejects non-JSON metadata hosting (issue #77)', () => {
    const deploy = read('scripts/deploy_all.ts');
    assert.match(deploy, /application\/json/, 'deploy_all.ts must check the metadata content type');
    assert.ok(
        !deploy.includes("'https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json'"),
        'the default metadata URL must not point at raw.githubusercontent.com'
    );
    const env = read('.env.example');
    assert.ok(
        !/JETTON_METADATA_URL=.*raw\.githubusercontent\.com/.test(env),
        '.env.example must default JETTON_METADATA_URL to a JSON-capable origin'
    );
});

test('CI Node version matches .nvmrc (toolchain sync)', () => {
    const nvmrc = read('.nvmrc').trim();
    const ci = read('.github/workflows/ci.yml');
    if (/node-version-file:\s*\.nvmrc/.test(ci)) return; // pinned to the file itself
    const match = ci.match(/node-version:\s*([0-9]+)/);
    assert.ok(match, 'ci.yml must pin a node-version or node-version-file');
    assert.equal(match![1], nvmrc, `ci.yml node-version (${match![1]}) must equal .nvmrc (${nvmrc})`);
});

test('AI agent is manual-label-only, branch-scoped and cannot merge or deploy (issue #94)', () => {
    const wf = read('.github/workflows/ai-fix.yml');
    assert.match(wf, /issues:\s*\n\s*types:\s*\[labeled\]/, 'ai-fix must trigger on the ai-fix label');
    assert.ok(wf.includes('ai-fix'), 'ai-fix label gate is missing');
    assert.ok(wf.includes('collaborators/'), 'ai-fix must check the triggering actor permission');
    assert.ok(wf.includes('gh pr create') && wf.includes('--draft'), 'ai-fix must open a draft PR');
    assert.ok(!/gh pr merge/.test(wf), 'ai-fix must never merge PRs');
    assert.ok(!/npm run deploy/.test(wf), 'ai-fix must never run the deploy script');
    assert.ok(!/WALLET_MNEMONIC|ORACLE_SIGNING_KEY|TONCENTER_API_KEY/.test(wf), 'ai-fix must not reference deploy secrets');

    assert.ok(existsSync(join(root, 'GEMINI.md')), 'GEMINI.md rules are required for the agent');
    const gemini = read('GEMINI.md');
    assert.ok(/аудит/i.test(gemini), 'GEMINI.md must forbid audit claims');
    assert.ok(/mainnet/i.test(gemini), 'GEMINI.md must forbid mainnet-readiness claims');
});

test('the blanket auto-merge autopilot is removed (issue #94)', () => {
    assert.ok(
        !existsSync(join(root, '.github/workflows/autopilot-automerge.yml')),
        'the auto-merge-everything workflow must not exist'
    );
});

test('multisig handoff runbook documents the timelocked two-step (issue #86)', () => {
    const runbook = read('docs/MULTISIG_HANDOFF_RUNBOOK.md');
    for (const needle of [
        'ProposeOwner',
        'AcceptOwner',
        'ProposePoolOwner',
        'AcceptPoolOwner',
        'get_owner_transfer_delay',
        'ownerTransferDelay'
    ]) {
        assert.ok(runbook.includes(needle), `runbook must mention ${needle}`);
    }
    assert.ok(/2-of-N/.test(runbook), 'runbook must fix the 2-of-N threshold model');
});
