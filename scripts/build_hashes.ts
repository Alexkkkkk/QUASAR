import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'tolk', 'build', 'synchronized');
const docsDir = join(root, 'docs');
const outputPath = join(docsDir, 'build-hashes.json');
const toolchainPath = join(root, 'tolk', 'Acton.toml');
const note = 'Hashes identify reproducible fresh-deployment Tolk artifacts. They do not establish state or address compatibility with legacy Tact deployments.';

type Artifact = { file: string; sha256: string };
type HashManifest = {
    schemaVersion: number;
    toolchain: { project: string; acton: string };
    generatedAt: string;
    note: string;
    artifacts: Artifact[];
};

async function collect(directory: string, extension: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await collect(path, extension));
        else if (entry.isFile() && entry.name.endsWith(extension)) files.push(path);
    }
    return files;
}

async function sha256(path: string): Promise<string> {
    return createHash('sha256').update(await readFile(path)).digest('hex');
}

async function actonPin(): Promise<string> {
    const manifest = await readFile(toolchainPath, 'utf8');
    const match = manifest.match(/^\s*acton\s*=\s*"([^"\r\n]+)"\s*$/m);
    if (!match) throw new Error('tolk/Acton.toml does not declare toolchain.acton');
    return match[1];
}

async function payload(): Promise<Omit<HashManifest, 'generatedAt'>> {
    const [abis, bocs] = await Promise.all([
        collect(join(buildDir, 'abi'), '.json'),
        collect(join(buildDir, 'boc'), '.boc'),
    ]);
    const artifacts: Artifact[] = [];
    for (const file of [...abis, ...bocs].sort()) {
        artifacts.push({ file: relative(root, file).replaceAll('\\', '/'), sha256: await sha256(file) });
    }
    return {
        schemaVersion: 2,
        toolchain: { project: 'Tolk/Acton', acton: await actonPin() },
        note,
        artifacts,
    };
}

async function checkManifest(expected: Omit<HashManifest, 'generatedAt'>): Promise<void> {
    const actual = JSON.parse(await readFile(outputPath, 'utf8')) as Partial<HashManifest>;
    if (Number.isNaN(Date.parse(actual.generatedAt ?? ''))) {
        throw new Error('docs/build-hashes.json has no valid generatedAt timestamp');
    }
    if (actual.schemaVersion !== expected.schemaVersion
        || actual.toolchain?.project !== expected.toolchain.project
        || actual.toolchain?.acton !== expected.toolchain.acton
        || actual.note !== expected.note
        || JSON.stringify(actual.artifacts) !== JSON.stringify(expected.artifacts)) {
        throw new Error('docs/build-hashes.json is stale or does not exactly match the current ABI/BoC artifacts; run npm run hashes:build and review the diff');
    }
}

async function main(): Promise<void> {
    const shouldWrite = process.argv.includes('--write');
    const shouldCheck = process.argv.includes('--check');
    if (shouldWrite && shouldCheck) throw new Error('use either --write or --check, not both');
    const current = await payload();
    if (shouldCheck) {
        await checkManifest(current);
        console.log('Verified docs/build-hashes.json against current ABI/BoC artifacts');
        return;
    }
    const rendered: HashManifest = { ...current, generatedAt: new Date().toISOString() };
    if (process.argv.includes('--write')) {
        await mkdir(docsDir, { recursive: true });
        await writeFile(outputPath, `${JSON.stringify(rendered, null, 2)}\n`);
        console.log(`Wrote ${relative(root, outputPath).replaceAll('\\', '/')}`);
        return;
    }
    console.log(JSON.stringify(rendered, null, 2));
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
