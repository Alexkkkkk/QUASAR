import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'tolk', 'build', 'synchronized');
const docsDir = join(root, 'docs');
const outputPath = join(docsDir, 'build-hashes.json');

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

async function main(): Promise<void> {
    const [abis, bocs] = await Promise.all([
        collect(join(buildDir, 'abi'), '.json'),
        collect(join(buildDir, 'boc'), '.boc'),
    ]);
    const artifacts = [] as Array<{ file: string; sha256: string }>;
    for (const file of [...abis, ...bocs].sort()) {
        artifacts.push({ file: relative(root, file).replaceAll('\\', '/'), sha256: await sha256(file) });
    }
    const payload = {
        schemaVersion: 2,
        toolchain: { project: 'Tolk/Acton', acton: '1.2.1' },
        generatedAt: new Date().toISOString(),
        note: 'Hashes identify reproducible fresh-deployment Tolk artifacts. They do not establish state or address compatibility with legacy Tact deployments.',
        artifacts,
    };
    if (process.argv.includes('--write')) {
        await mkdir(docsDir, { recursive: true });
        await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
        console.log(`Wrote ${relative(root, outputPath).replaceAll('\\', '/')}`);
        return;
    }
    console.log(JSON.stringify(payload, null, 2));
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
