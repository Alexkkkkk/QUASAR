// Guards that every `npm run <script>` command referenced by repository
// documentation, workflows, scripts or the environment template actually exists
// in package.json.
//
// `.env.example` and `docs/OFFCHAIN_INTEGRATIONS.md` instruct the operator to
// run `npm run oracle:keygen`, but package.json defined no such script, so the
// documented command failed with "Missing script". A documented-but-missing
// command is a real defect: it breaks the operator workflow the docs promise.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'build', 'node_modules', '__pycache__']);
const SCAN_EXT = new Set(['.md', '.yml', '.yaml', '.ts', '.js', '.mjs', '.py', '.json']);
const COMMAND_RE = /npm run ([a-z0-9][a-z0-9:_-]*)/g;

function collectFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) collectFiles(full, out);
        else if (SCAN_EXT.has(extname(entry)) || entry === '.env.example') out.push(full);
    }
    return out;
}

function scripts(): Record<string, string> {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as { scripts?: Record<string, string> };
    assert.ok(pkg.scripts && Object.keys(pkg.scripts).length > 0, 'package.json must define scripts');
    return pkg.scripts;
}

test('every documented `npm run` command exists in package.json', () => {
    const defined = new Set(Object.keys(scripts()));
    const missing: string[] = [];
    for (const file of collectFiles(root)) {
        for (const [, name] of readFileSync(file, 'utf8').matchAll(COMMAND_RE)) {
            if (!defined.has(name)) missing.push(`${relative(root, file).replaceAll('\\', '/')}: npm run ${name}`);
        }
    }
    assert.deepEqual(missing, [], `documented commands missing from package.json:\n${missing.join('\n')}`);
});

test('the AI oracle exposes a key generation command', () => {
    assert.ok(scripts()['oracle:keygen'], 'oracle:keygen must be defined');
    const env = readFileSync(join(root, '.env.example'), 'utf8');
    assert.match(env, /npm run oracle:keygen/, 'the env template must point at a real command');
    const oracle = readFileSync(join(root, 'scripts', 'ai_oracle.ts'), 'utf8');
    assert.match(oracle, /argv\[0\] === 'keygen'/, 'the oracle CLI must still implement the keygen subcommand');
});
