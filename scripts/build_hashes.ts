import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'build');
const docsDir = join(root, 'docs');
const outputPath = join(docsDir, 'build-hashes.json');

function wantsArtifact(name: string): boolean {
    return name.endsWith('.code.boc') || name.endsWith('.abi');
}

async function sha256(path: string): Promise<string> {
    const data = await readFile(path);
    return createHash('sha256').update(data).digest('hex');
}

async function main(): Promise<void> {
    const names = (await readdir(buildDir)).filter(wantsArtifact).sort();
    const artifacts = [] as Array<{ file: string; sha256: string }>;

    for (const name of names) {
        const file = join(buildDir, name);
        artifacts.push({
            file: relative(root, file).replaceAll('\\', '/'),
            sha256: await sha256(file)
        });
    }

    const payload = {
        generatedAt: new Date().toISOString(),
        note: 'Build-artifact hashes only. Mainnet/testnet addresses must be published separately once deployments exist.',
        artifacts
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
