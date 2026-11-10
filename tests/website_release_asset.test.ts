import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const website = join(root, 'website');
const html = readFileSync(join(website, 'index.html'), 'utf8');
const bundle = readFileSync(join(website, 'vendor', 'tonconnect.bundle.js'), 'utf8');
const bundleManifest = JSON.parse(readFileSync(join(website, 'vendor', 'tonconnect.bundle.manifest.json'), 'utf8')) as Record<string, unknown>;
const tonConnectManifest = JSON.parse(readFileSync(join(website, 'tonconnect-manifest.json'), 'utf8')) as Record<string, unknown>;
const metadata = JSON.parse(readFileSync(join(website, 'metadata.json'), 'utf8')) as Record<string, unknown>;

function localAsset(url: unknown, expectedSuffix: string): string {
    if (typeof url !== 'string') throw new TypeError(`expected URL string ending in ${expectedSuffix}`);
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://alexkkkkk.github.io');
    assert.ok(parsed.pathname.startsWith('/QUASAR/'));
    assert.ok(parsed.pathname.endsWith(expectedSuffix));
    return join(website, parsed.pathname.slice('/QUASAR/'.length));
}

test('self-hosted TON Connect bundle is a reproducible release asset', () => {
    assert.equal(bundleManifest.schemaVersion, 1);
    assert.deepEqual(bundleManifest.generator, {
        name: 'esbuild',
        version: '0.25.12',
        arguments: ['--bundle', '--format=esm', '--platform=browser', '--target=es2022', '--minify', '--legal-comments=none'],
    });
    assert.deepEqual(bundleManifest.dependencies, { '@ton/core': '0.63.1' });
    assert.match(bundle, /window\.ensureQsrDeposit/);
    assert.match(bundle, /window\.isQuasarTestnetConfigReady/);
    assert.match(bundle, /quasar:qsr-deposit:v1:/);

    execFileSync('bash', ['website/scripts/build-tonconnect-bundle.sh', '--check'], {
        cwd: root,
        stdio: 'pipe',
    });
});

test('static dApp asset graph, manifest and metadata resolve to tracked release assets', () => {
    assert.match(html, /<script type="module" src="\.\/vendor\/tonconnect\.bundle\.js"><\/script>/);
    assert.doesNotMatch(html, /unpkg\.com\/@tonconnect/i);
    assert.match(html, /window\.ensureQsrDeposit/);
    assert.match(html, /control\.disabled = !ready/);

    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(match => match[1]);
    for (const source of scripts) {
        assert.ok(!/^https?:\/\//.test(source), `wallet runtime must be self-hosted: ${source}`);
        assert.ok(existsSync(join(website, source.replace(/^\.\//, ''))), `missing static script asset: ${source}`);
    }

    const icon = localAsset(tonConnectManifest.iconUrl, '/assets/icon-180.png');
    const image = localAsset(metadata.image, '/assets/logo.png');
    assert.ok(statSync(icon).size > 0, 'TON Connect icon must be a non-empty tracked asset');
    assert.ok(statSync(image).size > 0, 'Jetton metadata image must be a non-empty tracked asset');
    assert.equal(metadata.symbol, 'QSR');
    assert.equal(metadata.decimals, '9');
});
