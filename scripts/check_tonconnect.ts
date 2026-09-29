import 'dotenv/config';

type Manifest = {
    url?: string;
    name?: string;
    iconUrl?: string;
    termsOfUseUrl?: string;
    privacyPolicyUrl?: string;
};

const origin = (process.env.TON_CONNECT_ORIGIN || 'https://alexkkkkk.github.io/QUASAR').replace(/\/+$/, '');
const manifestUrl = process.env.TON_CONNECT_MANIFEST_URL || `${origin}/tonconnect-manifest.json`;

function fail(message: string): never {
    throw new Error(`[tonconnect smoke] ${message}`);
}

async function fetchRequired(url: string, label: string): Promise<Response> {
    const response = await fetch(url, { redirect: 'follow' });
    if (!response.ok) fail(`${label} returned HTTP ${response.status}: ${url}`);
    return response;
}

const manifestResponse = await fetchRequired(manifestUrl, 'manifest');
const contentType = manifestResponse.headers.get('content-type') || '';
if (!contentType.toLowerCase().includes('application/json')) {
    fail(`manifest must be served as JSON, got "${contentType}"`);
}

const manifest = await manifestResponse.json() as Manifest;
for (const key of ['url', 'name', 'iconUrl'] as const) {
    if (typeof manifest[key] !== 'string' || manifest[key].length === 0) {
        fail(`manifest.${key} is required`);
    }
}
if (manifest.url !== origin) fail(`manifest.url must equal ${origin}`);

for (const key of ['iconUrl', 'termsOfUseUrl', 'privacyPolicyUrl'] as const) {
    const url = manifest[key];
    if (!url) continue;
    if (!url.startsWith('https://')) fail(`manifest.${key} must use HTTPS`);
    await fetchRequired(url, key);
}

console.log(JSON.stringify({
    status: 'ok',
    origin,
    manifestUrl,
    name: manifest.name,
    iconUrl: manifest.iconUrl
}, null, 2));