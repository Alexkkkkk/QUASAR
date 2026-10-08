import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = readFileSync(join(root, '.github/workflows/ai-review.yml'), 'utf8');

test('AI PR review avoids Gemini composite actions with unpinned transitive actions', () => {
    assert.doesNotMatch(workflow, /google-github-actions\/run-gemini-cli/);
    assert.doesNotMatch(workflow, /google-github-actions\/auth@v3|actions\/upload-artifact@v6/);
    assert.match(workflow, /uses:\s+actions\/setup-node@[0-9a-f]{40}\s+# v7\.0\.0/);
    assert.ok(workflow.includes('"@google/gemini-cli@${GEMINI_CLI_VERSION}"'));
});

test('AI PR review passes the actual bounded diff and keeps Gemini tools disabled', () => {
    assert.ok(workflow.includes('cat "$RUNNER_TEMP/pr.trimmed.diff"'));
    assert.ok(!workflow.includes('$(cat /tmp/pr.trimmed.diff)'));
    assert.ok(workflow.includes('"core": []'));
    assert.ok(workflow.includes('GEMINI_CLI_VERSION: "0.62.0"'));
    assert.ok(workflow.includes('GEMINI_MODEL: "gemini-3.8-flash"'));
});
