// Regression guards for the public project page and its release-sensitive automation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path: string) => readFileSync(join(root, path), 'utf8');

test('README exposes live automation and pre-launch risk status', () => {
    const readme = read('README.md');
    assert.ok(readme.includes('actions/workflows/ci.yml'));
    assert.match(readme, /Pre-launch and not independently audited/i);
    assert.match(readme, /TON_NETWORK=testnet/);
    assert.match(readme, /no APY is guaranteed/i);
});

test('public website does not promise live yield or autonomous fund movement', () => {
    const page = read('website/index.html');
    assert.match(page, /PRE-LAUNCH/i);
    assert.match(page, /not audited/i);
    assert.doesNotMatch(page, /The brightest Jetton|Self-governing AI oracle adjusts fees|Auto-buyback makes|20% APY paid directly|Auto-compound enabled/i);
    assert.match(page, /Buybacks require an owner-authenticated trigger/i);
    const metadata = JSON.parse(read('website/metadata.json')) as { description?: string };
    assert.match(metadata.description ?? '', /pre-launch/i);
    assert.match(metadata.description ?? '', /not independently audited/i);
});

test('wallet and transaction controls fail closed unless testnet contracts are configured', () => {
    const page = read('website/index.html');
    const start = page.indexOf('<section class="defi-section"');
    const end = page.indexOf('<!-- Footer -->', start);
    assert.ok(start >= 0 && end > start, 'the testnet workspace must exist');
    const controls = [...page.slice(start, end).matchAll(/<(input|select|button)\b[^>]*>/gi)];
    assert.ok(controls.length > 0, 'the testnet workspace must have interactive controls');
    for (const [tag] of controls) assert.match(tag, /\sdisabled(?:\s|=|>)/i, 'controls must start disabled');
    assert.match(page, /config\.network === 'testnet'/);
    assert.match(page, /const ready = hasAddresses && isTestnet/);
    assert.match(page, /if \(ready && typeof window\.initTonConnect === 'function'\)/);
    assert.match(page, /connectRoot\.hidden = !ready/);
});


test('merged-PR issue closer only acts on explicit references', () => {
    const workflow = read('.github/workflows/_close-issues.yml');
    assert.match(workflow, /github\.event\.pull_request\.merged == true/);
    assert.ok(workflow.includes('--json title,body,mergeCommit'));
    assert.ok(workflow.includes("grep -oiE '(closes?|closed|fix|fixes|fixed|resolves?|resolved) #[0-9]+'"));
    assert.ok(workflow.includes('gh issue close "$n" --reason completed'));
});
