// ═══════════════════════════════════════════════════════════════
// QUASAR Web3 Config — Contract Addresses & Settings
// Auto-loads from build/deployment.json.
// ═══════════════════════════════════════════════════════════════

const QUASAR_CONFIG = {
    manifestUrl: 'https://quasar-ton.netlify.app/tonconnect-manifest.json',
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
        const res = await fetch('./build/deployment.json');
        if (res.ok) {
            const data = await res.json();
            QUASAR_CONFIG.addresses.master = data.contracts?.master?.address || null;
            QUASAR_CONFIG.addresses.defi = data.contracts?.defi?.address || null;
            QUASAR_CONFIG.network = data.network || 'testnet';
            console.log('[QUASAR] Config loaded:', QUASAR_CONFIG.addresses);
        }
    } catch (e) {
        console.warn('[QUASAR] No deployment.json found; transactions are disabled');
    }
}

window.QUASAR_CONFIG = QUASAR_CONFIG;
window.loadDeploymentConfig = loadDeploymentConfig;