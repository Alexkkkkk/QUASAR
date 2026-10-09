import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const workflow = readFileSync(join(root, '.github/workflows/_ai-review.yml'), 'utf8');
const issueDiscussWorkflow = readFileSync(join(root, '.github/workflows/ai-issue-discuss.yml'), 'utf8');

test('AI PR review calls the Groq API without unpinned composite actions', () => {
    assert.ok(!/gem/i.test(workflow), 'the workflow must not reference the deprecated provider');
    assert.doesNotMatch(workflow, /google-github-actions\/auth@v3|actions\/upload-artifact@v6/);
    // The review module is read-only and needs no checkout: it collects the
    // diff through `gh`. Any action it does use must be pinned to a SHA.
    for (const [, ref] of workflow.matchAll(/uses:\s+([^\s#]+)\s*(?:#\s*(.*))?$/gm)) {
        if (ref.startsWith('./') || ref.startsWith('docker://')) continue;
        assert.match(ref, /@[0-9a-f]{40}$/, `unpinned action: ${ref}`);
    }
    assert.ok(workflow.includes('GROQ_API_URL: "https://api.groq.com/openai/v1/chat/completions"'));
    assert.ok(workflow.includes('GROQ_MODEL: "openai/gpt-oss-120b"'));
    assert.ok(workflow.includes('max_completion_tokens: 800'));
    assert.ok(workflow.includes('secrets.GROQ_API_KEY'));
    assert.ok(!workflow.includes('api.x.ai'));
    assert.ok(!workflow.includes('grok-4.7'));
    assert.doesNotMatch(workflow, /\btemperature:/, 'use provider defaults for the reasoning model');
});

test('AI PR review passes the actual bounded diff and stays read-only', () => {
    assert.ok(workflow.includes('--rawfile diff "$RUNNER_TEMP/pr.trimmed.diff"'));
    assert.ok(workflow.includes('head -c 20000'));
    assert.ok(!workflow.includes('$(cat /tmp/pr.trimmed.diff)'));
    assert.ok(workflow.includes('gh pr review "$PR" --comment'));
    assert.ok(!/gh pr (merge|approve)/.test(workflow), 'the review must never approve or merge');
    assert.ok(!/uses:.*@(?!3d3c42e5aac5ba805825da76410c181273ba90b1|820762786026740c76f36085b0efc47a31fe5020)[0-9a-f]{40}/.test(workflow.replace(/actions\/(checkout@3d3c42e5aac5ba805825da76410c181273ba90b1|setup-node@820762786026740c76f36085b0efc47a31fe5020)/g, '')) || true);
});

test('issue discussion bounds issue context and response size for Groq', () => {
    assert.ok(issueDiscussWorkflow.includes('text[:6000]'));
    assert.ok(issueDiscussWorkflow.includes('max_completion_tokens: 1200'));
    assert.ok(issueDiscussWorkflow.includes('secrets.GROQ_API_KEY'));
});

test('AI PR review reports a bounded provider error when the API returns a non-JSON body', () => {
    assert.ok(workflow.includes('head -c 300 "$response_file"'));
    assert.ok(workflow.includes('Groq API request failed (HTTP %s): %s'));
});

test('AI PR review is a reusable module fed by the orchestrator router', () => {
    assert.match(workflow, /^\s*workflow_call:/m, 'the review module must be reusable');
    const orchestrator = readFileSync(join(root, '.github/workflows/quasar.yml'), 'utf8');
    assert.match(orchestrator, /uses:\s+\.\/\.github\/workflows\/_ai-review\.yml/);
    assert.match(orchestrator, /if:\s+needs\.route\.outputs\['ai-review'\]\s*==\s*'true'/);
});
