import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
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
const legacyContractExtensions = new Set(['.fc', '.func', '.tact']);
const activeScriptExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs']);
const legacyCompilerPackages = new Set([
    '@ton-community/func-js',
    '@ton-community/func-js-bin',
    'func-js',
    'func-js-bin',
    'tact',
    'tact-compiler',
]);

type PackageJson = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};

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
        if (legacyContractExtensions.has(extname(entry)) || entry === 'tact.config.json') {
            found.push(relativePath);
        }
    }
    return found;
}

function findArchivedWrapperImports(directory: string, found: string[] = []): string[] {
    for (const entry of readdirSync(directory)) {
        if (ignoredDirectories.has(entry)) continue;
        const fullPath = join(directory, entry);
        if (statSync(fullPath).isDirectory()) {
            findArchivedWrapperImports(fullPath, found);
            continue;
        }

        const relativePath = relative(root, fullPath).replaceAll('\\', '/');
        if (relativePath.startsWith(historicalPrefix) || !activeScriptExtensions.has(extname(entry))) continue;

        const source = readFileSync(fullPath, 'utf8');
        const patterns = [
            /\bfrom\s*["']([^"']+)["']/g,
            /\b(?:import|require)\s*\(\s*["']([^"']+)["']/g,
            /\bimport\s+["']([^"']+)["']/g,
        ];
        for (const pattern of patterns) {
            for (const match of source.matchAll(pattern)) {
                const specifier = match[1];
                const base = specifier.startsWith('.') ? dirname(fullPath) : root;
                const importedPath = relative(root, resolve(base, specifier)).replaceAll('\\', '/');
                if (importedPath.startsWith(historicalPrefix)) {
                    found.push(`${relativePath} -> ${specifier}`);
                }
            }
        }
    }
    return found;
}

function activeLegacyCompilerPackages(packageJson: PackageJson): string[] {
    return Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies }).filter(
        (name) => name.startsWith('@tact-lang/') || legacyCompilerPackages.has(name),
    );
}

test('Tolk/Acton is the only active contract compiler and source tree', () => {
    const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as PackageJson;
    const manifest = readFileSync(join(root, 'tolk', 'Acton.toml'), 'utf8');

    assert.deepEqual(activeLegacyCompilerPackages(packageJson), []);
    assert.match(manifest, /^\[toolchain\]\s*\nacton\s*=\s*"1\.2\.1"/m);
    assert.ok(existsSync(join(root, 'tolk', 'contracts', 'QuasarMaster.tolk')));
    assert.ok(existsSync(join(root, 'tolk', 'contracts', 'QuasarDeFi.tolk')));

    assert.deepEqual(
        findLegacyContractInputs(root),
        [],
        'legacy contract files/config must remain only in docs/historical/tact-reference/',
    );
    assert.deepEqual(
        findArchivedWrapperImports(root),
        [],
        'active TypeScript/JavaScript must not import archived Tact generated wrappers',
    );
});
