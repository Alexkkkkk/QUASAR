import test from 'node:test';
import assert from 'node:assert/strict';
import { closeSync, constants, existsSync, fstatSync, mkdtempSync, openSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set([
    '.git',
    '.acton',
    'build',
    'node_modules',
    '__pycache__',
]);
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
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (ignoredDirectories.has(entry.name)) continue;
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            findLegacyContractInputs(fullPath, found);
            continue;
        }

        const relativePath = relative(root, fullPath).replaceAll('\\', '/');
        if (legacyContractExtensions.has(extname(entry.name)) || entry.name === 'tact.config.json') {
            found.push(relativePath);
        }
    }
    return found;
}

function readScriptSource(fullPath: string): string {
    // Validate and read the same open file, never a path checked with stat.
    // O_NOFOLLOW prevents replacing the final path with a symbolic link.
    const descriptor = openSync(fullPath, constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
        assert.ok(fstatSync(descriptor).isFile(), `${fullPath}: expected a regular source file`);
        return readFileSync(descriptor, 'utf8');
    } finally {
        closeSync(descriptor);
    }
}

function findArchivedWrapperImports(directory: string, found: string[] = []): string[] {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (ignoredDirectories.has(entry.name)) continue;
        const fullPath = join(directory, entry.name);
        if (entry.isDirectory()) {
            findArchivedWrapperImports(fullPath, found);
            continue;
        }

        const relativePath = relative(root, fullPath).replaceAll('\\', '/');
        if (!activeScriptExtensions.has(extname(entry.name))) continue;

        const source = readScriptSource(fullPath);
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
                if (legacyContractExtensions.has(extname(importedPath))) {
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
        'legacy contract files/config must not exist in the repository',
    );
    assert.deepEqual(
        findArchivedWrapperImports(root),
        [],
        'active TypeScript/JavaScript must not import legacy contract wrappers',
    );
});

test('policy source reader uses a regular descriptor and refuses symbolic links', () => {
    const directory = mkdtempSync(join(tmpdir(), 'quasar-policy-'));
    try {
        const source = join(directory, 'source.js');
        const link = join(directory, 'link.js');
        writeFileSync(source, 'export const value = 1;\n');
        symlinkSync(source, link);
        assert.equal(readScriptSource(source), 'export const value = 1;\n');
        assert.throws(() => readScriptSource(link), { code: 'ELOOP' });
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
