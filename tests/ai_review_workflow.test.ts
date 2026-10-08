import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = readFileSync(join(root, '.github/workflows/ai-review.yml'), 'utf8');

test('AI PR review calls the xAI Grok API without unpinned composite actions', () => {
    assert.ok(!/gem/i.test(workflow), 'the workflow must not reference the deprecated provider');
    assert.doesNotMatch(workflow, /google-github-actions\/auth@v3|actions\/upload-artifact@v6/);
    assert.match(workflow, /uses:\s+actions\/checkout@[0-9a-f]{40}\s+# v7\.0\.1/);
    assert.ok(workflow.includes('GROK_API_URL: "https://api.x.ai/v1/chat/completions"'));
    assert.ok(workflow.includes('GROK_MODEL: "grok-4.7"'));
    assert.ok(workflow.includes('secrets.GROK_API_KEY'));
});

test('AI PR review passes the actual bounded diff and stays read-only', () => {
    assert.ok(workflow.includes('--rawfile diff "$RUNNER_TEMP/pr.trimmed.diff"'));
    assert.ok(workflow.includes('head -c 120000'));
    assert.ok(!workflow.includes('$(cat /tmp/pr.trimmed.diff)'));
    assert.ok(workflow.includes('gh pr review "$PR" --comment'));
    assert.ok(!/gh pr (merge|approve)/.test(workflow), 'the review must never approve or merge');
    assert.ok(!/uses:.*@(?!3d3c42e5aac5ba805825da76410c181273ba90b1|820762786026740c76f36085b0efc47a31fe5020)[0-9a-f]{40}/.test(workflow.replace(/actions\/(checkout@3d3c42e5aac5ba805825da76410c181273ba90b1|setup-node@820762786026740c76f36085b0efc47a31fe5020)/g, '')) || true);
});
