import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set([
    '.git',
    '.acton',
    'build',
    'node_modules',
    '__pycache__',
]);
const historicalPrefix = 'docs/historical/tact-reference/';

function findLegacyContractInputs(directory: string, found: string[] = []): string[] {
    for (const entry of readdirSync(directory)) {
        if (ignoredDirectories.has(entry)) continue;
        const fullPath = join(directory, entry);
        if (statSync(fullPath).isDirectory()) {
            findLegacyContractInputs(fullPath, found);
            continue;
        }

        const relativePath = relative(root, fullPath).replaceAll('\\', '/');
        if (relativePath.startsWith(historicalPrefix)) continue;
        if (entry.endsWith('.tact') || entry === 'tact.config.json') found.push(relativePath);
    }
    return found;
}

test('Tolk/Acton is the only active contract compiler and source tree', () => {
    const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
    };
    const manifest = readFileSync(join(root, 'tolk', 'Acton.toml'), 'utf8');

    assert.equal(packageJson.dependencies?.['@tact-lang/compiler'], undefined);
    assert.equal(packageJson.devDependencies?.['@tact-lang/compiler'], undefined);
    assert.match(manifest, /^\[toolchain\]\s*\nacton\s*=\s*"1\.2\.1"/m);
    assert.ok(existsSync(join(root, 'tolk', 'contracts', 'QuasarMaster.tolk')));
    assert.ok(existsSync(join(root, 'tolk', 'contracts', 'QuasarDeFi.tolk')));

    assert.deepEqual(
        findLegacyContractInputs(root),
        [],
        'legacy contract files/config must remain only in docs/historical/tact-reference/',
    );
});
