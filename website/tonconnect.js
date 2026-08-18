// ═══════════════════════════════════════════════════════════════
// QUASAR Web3 Provider v2.0 — TON Connect 2.0 + @ton/core
// Synchronized with QuasarMaster & QuasarDeFi contracts
// ═══════════════════════════════════════════════════════════════

let tonConnectUI = null;
let isInitialized = false;

// ─── Operation Codes (must match contract op codes) ───
const OP = {
    STAKE_QSR: 0x12345678,
    UNSTAKE_QSR: 0x12345679,
    CLAIM_STAKE: 0x1234567a,
    ADD_LIQUIDITY: 0xabcdef01,
    REMOVE_LIQUIDITY: 0xabcdef02,
    SWAP_TO_TON: 0xabcdef03,
    SWAP_TO_QSR: 0xabcdef04,
    CLAIM_FARM: 0xabcdef05,
};

// ─── Gas amounts (nanoTON) ───
const GAS = {
    STAKE: '50000000',      // 0.05 TON
    SWAP: '100000000',      // 0.1 TON
    LIQUIDITY: '100000000', // 0.1 TON base
    CLAIM: '50000000',      // 0.05 TON
};

// ─── Initialize TON Connect ───
export function initTonConnect() {
    if (typeof window === 'undefined') return;
    if (isInitialized) return;
    
    if (!window.TON_CONNECT_UI) {
        console.error('[QUASAR] TON Connect UI not loaded');
        setTimeout(initTonConnect, 1000);
        return;
    }
    
    const config = window.QUASAR_CONFIG || {};
    
    tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
        manifestUrl: config.manifestUrl || 'https://quasar-ton.netlify.app/tonconnect-manifest.json',
        buttonRootId: config.buttonRootId || 'ton-connect',
    });
    
    tonConnectUI.onStatusChange(wallet => {
        updateWalletUI(wallet);
    });
    
    isInitialized = true;
    console.log('[QUASAR] TON Connect initialized');
}

// ─── UI Updates ───
function updateWalletUI(wallet) {
    const addrEl = document.getElementById('wallet-address');
    const appSec = document.getElementById('defi');
    
    if (!wallet) {
        if (addrEl) addrEl.textContent = 'Not connected';
        if (appSec) appSec.classList.remove('active');
        return;
    }
    
    const addr = wallet.account.address;
    const short = addr.slice(0, 6) + '...' + addr.slice(-4);
    
    if (addrEl) addrEl.textContent = short;
    if (appSec) appSec.classList.add('active');
    
    loadBalances(addr);
    loadPoolStats();
}

// ─── Balance Loader ───
async function loadBalances(address) {
    try {
        const config = window.QUASAR_CONFIG || {};
        const endpoint = config.toncenter?.testnet || 'https://testnet.toncenter.com/api/v2/jsonRPC';
        
        const res = await fetch(`${endpoint}/getAddressBalance?address=${address}`);
        const data = await res.json();
        const balEl = document.getElementById('ton-balance');
        if (balEl && data.result) {
            balEl.textContent = (parseInt(data.result) / 1e9).toFixed(4) + ' TON';
        }
    } catch (e) {
        console.error('[QUASAR] Balance load error:', e);
    }
}

// ─── Pool Stats (placeholder until contract getters) ───
async function loadPoolStats() {
    // TODO: implement contract getter calls via toncenter
    // For now, show placeholders
}

// ─── BOC Builder ───
function buildPayload(op, ...args) {
    // Try to use @ton/core if available
    if (typeof window !== 'undefined' && window.toncore) {
        try {
            const { beginCell, storeUint, storeCoins } = window.toncore;
            let cell = beginCell();
            cell = storeUint(cell, op, 32);
            for (const arg of args) {
                if (typeof arg === 'bigint') {
                    cell = storeCoins(cell, arg);
                } else if (typeof arg === 'number') {
                    cell = storeUint(cell, arg, 32);
                }
            }
            return cell.endCell().toBoc().toString('base64');
        } catch (e) {
            console.warn('[QUASAR] @ton/core cell build failed, using fallback:', e);
        }
    }
    
    // Fallback: raw hex payload (won't work on-chain but allows UI testing)
    const hex = op.toString(16).padStart(8, '0') +
        args.map(a => (typeof a === 'bigint' ? a : BigInt(a)).toString(16).padStart(16, '0')).join('');
    return btoa(hex.match(/\w{2}/g).map(b => String.fromCharCode(parseInt(b, 16))).join(''));
}

// ─── Transaction Sender ───
async function sendTx(address, amount, payload) {
    if (!tonConnectUI) {
        window.showToast?.('Connect wallet first!', 'error');
        return null;
    }
    
    const config = window.QUASAR_CONFIG || {};
    const target = config.addresses?.[address] || address;
    
    try {
        const tx = await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [{ address: target, amount, payload }],
        });
        window.showToast?.('Transaction sent!', 'success');
        return tx;
    } catch (e) {
        console.error('[QUASAR] TX error:', e);
        window.showToast?.('Transaction failed: ' + (e.message || e), 'error');
        throw e;
    }
}

// ─── Contract Operations ───

export async function stakeQsr(amountNano) {
    if (!amountNano || amountNano <= 0n) {
        window.showToast?.('Enter valid QSR amount', 'error'); return;
    }
    const config = window.QUASAR_CONFIG || {};
    return sendTx(config.addresses?.master, GAS.STAKE, buildPayload(OP.STAKE_QSR, amountNano));
}

export async function unstakeQsr(amountNano) {
    if (!amountNano || amountNano <= 0n) {
        window.showToast?.('Enter valid amount', 'error'); return;
    }
    const config = window.QUASAR_CONFIG || {};
    return sendTx(config.addresses?.master, GAS.STAKE, buildPayload(OP.UNSTAKE_QSR, amountNano));
}

export async function claimStakingRewards() {
    const config = window.QUASAR_CONFIG || {};
    return sendTx(config.addresses?.master, GAS.CLAIM, buildPayload(OP.CLAIM_STAKE));
}

export async function addLiquidity(tonAmount, qsrAmount) {
    if (!tonAmount || !qsrAmount || tonAmount <= 0n || qsrAmount <= 0n) {
        window.showToast?.('Enter valid amounts', 'error'); return;
    }
    const config = window.QUASAR_CONFIG || {};
    const totalAmount = (tonAmount + BigInt(GAS.LIQUIDITY)).toString();
    return sendTx(config.addresses?.defi, totalAmount, buildPayload(OP.ADD_LIQUIDITY, tonAmount, qsrAmount));
}

export async function removeLiquidity(lpAmount) {
    if (!lpAmount || lpAmount <= 0n) {
        window.showToast?.('Enter valid LP amount', 'error'); return;
    }
    const config = window.QUASAR_CONFIG || {};
    return sendTx(config.addresses?.defi, GAS.LIQUIDITY, buildPayload(OP.REMOVE_LIQUIDITY, lpAmount));
}

export async function swapToTon(qsrAmount, minTonOut) {
    if (!qsrAmount || qsrAmount <= 0n) {
        window.showToast?.('Enter valid QSR amount', 'error'); return;
    }
    const config = window.QUASAR_CONFIG || {};
    return sendTx(config.addresses?.defi, GAS.SWAP, buildPayload(OP.SWAP_TO_TON, qsrAmount, minTonOut || 1n));
}

export async function swapToQsr(tonAmount, minQsrOut) {
    if (!tonAmount || tonAmount <= 0n) {
        window.showToast?.('Enter valid TON amount', 'error'); return;
    }
    const config = window.QUASAR_CONFIG || {};
    const totalAmount = (tonAmount + BigInt(GAS.SWAP)).toString();
    return sendTx(config.addresses?.defi, totalAmount, buildPayload(OP.SWAP_TO_QSR, tonAmount, minQsrOut || 1n));
}

export async function claimFarmRewards() {
    const config = window.QUASAR_CONFIG || {};
    return sendTx(config.addresses?.defi, GAS.CLAIM, buildPayload(OP.CLAIM_FARM));
}

// ─── Expose to window ───
if (typeof window !== 'undefined') {
    window.stakeQsr = stakeQsr;
    window.unstakeQsr = unstakeQsr;
    window.claimStakingRewards = claimStakingRewards;
    window.addLiquidity = addLiquidity;
    window.removeLiquidity = removeLiquidity;
    window.swapToTon = swapToTon;
    window.swapToQsr = swapToQsr;
    window.claimFarmRewards = claimFarmRewards;
    window.initTonConnect = initTonConnect;
}
