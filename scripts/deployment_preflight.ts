import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const hashPath = join(root, 'docs', 'build-hashes.json');
const generatedDir = join(root, 'tolk', 'build', 'synchronized');
const requiredArtifacts = [
    'abi/QuasarAdminTimelock.json',
    'abi/QuasarDeFi.json',
    'abi/QuasarMaster.json',
    'abi/QuasarWallet.json',
    'boc/QuasarAdminTimelock.boc',
    'boc/QuasarDeFi.boc',
    'boc/QuasarMaster.boc',
    'boc/QuasarWallet.boc',
    'wrappers-ts/QuasarAdminTimelock.gen.ts',
    'wrappers-ts/QuasarDeFi.gen.ts',
    'wrappers-ts/QuasarMaster.gen.ts',
    'wrappers-ts/QuasarWallet.gen.ts',
] as const;
const contractSources = [
    'QuasarAdminTimelock.tolk',
    'QuasarDeFi.tolk',
    'QuasarMaster.tolk',
    'QuasarWallet.tolk',
] as const;

type HashManifest = {
    schemaVersion: number;
    toolchain?: { project?: string; acton?: string };
    artifacts?: Array<{ file?: string; sha256?: string }>;
};

function fail(message: string): never {
    console.error(`[deployment:preflight] FAIL: ${message}`);
    process.exit(1);
}

function sha256(path: string): string {
    return createHash('sha256').update(readFileSync(path)).digest('hex');
}

if (!existsSync(hashPath)) fail('docs/build-hashes.json is missing; run npm run hashes:build');
const manifest = JSON.parse(readFileSync(hashPath, 'utf8')) as HashManifest;
if (manifest.schemaVersion !== 2) fail('unsupported build-hashes schema');
if (manifest.toolchain?.project !== 'Tolk/Acton' || manifest.toolchain.acton !== '1.2.1') {
    fail('build hash manifest is not pinned to Tolk/Acton 1.2.1');
}

const hashes = new Map<string, string>();
for (const artifact of manifest.artifacts ?? []) {
    if (artifact.file && artifact.sha256) hashes.set(artifact.file, artifact.sha256);
}
for (const relativePath of requiredArtifacts) {
    const path = join(generatedDir, relativePath);
    if (!existsSync(path)) fail(`missing generated artifact: ${relativePath}`);
    if (relativePath.startsWith('abi/') || relativePath.startsWith('boc/')) {
        const repoPath = relative(root, path).replaceAll('\\', '/');
        const expected = hashes.get(repoPath);
        if (!expected) fail(`missing reviewed hash for ${repoPath}`);
        const actual = sha256(path);
        if (actual !== expected) fail(`hash mismatch for ${repoPath}: expected ${expected}, got ${actual}`);
    }
}

for (const sourceName of contractSources) {
    const sourcePath = join(root, 'tolk', 'contracts', sourceName);
    const source = readFileSync(sourcePath, 'utf8');
    if (/\bton\s*\(/.test(source)) {
        fail(`${sourceName} uses ton(); review large coin literals against the pinned compiler before deployment`);
    }
    if (/@pure\b/.test(source)) {
        fail(`${sourceName} uses @pure; prove that the function has no side effects before deployment`);
    }
}

const deploymentPath = resolve(process.env.DEPLOYMENT_FILE || join(root, 'website', 'deployment.json'));
if (existsSync(deploymentPath)) {
    console.log(`[deployment:preflight] deployment metadata found: ${relative(root, deploymentPath)}`);
    console.log('[deployment:preflight] run npm run deployment:check before publishing it');
} else {
    console.log('[deployment:preflight] no deployment metadata is published; network deployment remains disabled');
}

console.log('[deployment:preflight] Tolk/Acton 1.2.1 artifacts, reviewed hashes and wrappers are ready');
console.log('[deployment:preflight] no ton() literals or @pure functions are present in active contracts');
console.log('[deployment:preflight] no keys, signing, network calls or broadcast were performed');
