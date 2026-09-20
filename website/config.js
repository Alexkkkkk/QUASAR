// ═══════════════════════════════════════════════════════════════
// QUASAR Web3 Config — Contract Addresses & Settings
// Auto-loads from deployment.json generated beside the website.
// ═══════════════════════════════════════════════════════════════

const QUASAR_CONFIG = {
    // F-02: same-origin relative URL. TON Connect requires the manifest to be
    // fetched from the same origin as the dApp, and its internal "url" field
    // must match the hosting origin. A relative default works on ANY hosting.
    manifestUrl: './tonconnect-manifest.json',
    buttonRootId: 'ton-connect',
    toncenter: {
        mainnet: 'https://toncenter.com/api/v2/jsonRPC',
        testnet: 'https://testnet.toncenter.com/api/v2/jsonRPC'
    },
    decimals: 9,
    symbol: 'QSR',
    addresses: {
        master: null,
        defi: null
    }
};

async function loadDeploymentConfig() {
    try {
        const res = await fetch('./deployment.json', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            QUASAR_CONFIG.addresses.master = data.contracts?.master?.address || null;
            QUASAR_CONFIG.addresses.defi = data.contracts?.defi?.address || null;
            QUASAR_CONFIG.network = data.network || 'mainnet';
            console.log('[QUASAR] Config loaded:', QUASAR_CONFIG.addresses);
        }
    } catch (e) {
        console.warn('[QUASAR] No deployment.json found; transactions are disabled');
    }
}

window.QUASAR_CONFIG = QUASAR_CONFIG;
window.loadDeploymentConfig = loadDeploymentConfig;