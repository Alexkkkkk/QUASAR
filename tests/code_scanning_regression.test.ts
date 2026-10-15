// Regression guard for the last open CodeQL alerts (issues #212, #214, #222).
// Each assertion pins the *shape* of the fix, so the alert cannot silently
// return when the surrounding code is refactored.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

test('js/incomplete-url-substring-sanitization (#212): host checks are token-anchored', () => {
    const src = read('tests/audit_2026_10_02.test.ts');
    // The bare substring form can be satisfied by `http://evil-host/raw.githubusercontent.com`.
    assert.ok(
        !src.includes("matrix.includes('raw.githubusercontent.com')"),
        'the conformance-matrix check must not be a bare substring test',
    );
    assert.ok(
        src.includes('raw\\.githubusercontent\\.com'),
        'the text/plain host must be matched as an anchored, boundary-delimited token',
    );
});

test('js/http-to-file-access (#214): the draft sink cannot follow a symlink', () => {
    const src = read('scripts/ai/swarm/knowledge.mjs');
    assert.ok(src.includes('O_NOFOLLOW'), 'writeDraft must open the resolved path with O_NOFOLLOW');
    assert.ok(src.includes('fs.closeSync(fd)'), 'the file descriptor must always be closed');
    assert.ok(src.includes('closeSync(fd)'), 'the descriptor write path must close the handle');
});

test('js/file-system-race (#222): deployment.json is written atomically, never checked-then-written', () => {
    const src = read('scripts/deploy_defi.ts');
    assert.ok(
        !src.includes('fs.existsSync(deploymentPath)'),
        'the check-then-write window on deployment.json must be gone',
    );
    assert.ok(
        src.includes('writeJsonAtomic'),
        'deployment.json must go through the atomic temp-file + rename helper',
    );
    assert.ok(src.includes('fs.renameSync(tmp, file)'), 'the atomic helper must rename the temp file into place');
});
