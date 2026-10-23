import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const master = readFileSync(join(root, 'tolk', 'contracts', 'QuasarMaster.tolk'), 'utf8');
const defi = readFileSync(join(root, 'tolk', 'contracts', 'QuasarDeFi.tolk'), 'utf8');
const common = readFileSync(join(root, 'tolk', 'contracts', 'QuasarCommon.tolk'), 'utf8');
const wallet = readFileSync(join(root, 'tolk', 'contracts', 'QuasarWallet.tolk'), 'utf8');
const admin = readFileSync(join(root, 'tolk', 'contracts', 'QuasarAdminTimelock.tolk'), 'utf8');
const website = readFileSync(join(root, 'website', 'tonconnect.js'), 'utf8');
const manifest = JSON.parse(readFileSync(join(root, 'website', 'tonconnect-manifest.json'), 'utf8')) as Record<string, string>;

function requireSource(source: string, needle: string, label: string): void {
    if (!source.includes(needle)) throw new Error(`Missing Tolk security invariant: ${label}`);
}

requireSource(common, 'const QUASAR_STORAGE_RESERVE: coins = 50000000', 'explicit 0.05 TON rent reserve');
requireSource(common, 'const QUASAR_MAX_TX_BPS = 100', 'fixed maximum transfer policy');
requireSource(common, 'const QUASAR_MAX_WALLET_BPS = 300', 'fixed maximum wallet policy');
requireSource(common, 'struct (0x0f8a7ea5) TokenTransfer', 'TEP-74 transfer opcode');
requireSource(common, 'struct (0x178d4519) InternalTransfer', 'TEP-74 internal transfer opcode');
requireSource(common, 'struct (0x2c76b973) ProvideWalletAddress', 'TEP-89 wallet discovery opcode');
requireSource(wallet, 'storage.balance + message.amount <= QUASAR_MAX_WALLET_AMOUNT', 'wallet holder cap');
requireSource(wallet, 'message.amount <= QUASAR_MAX_TX_AMOUNT', 'wallet transaction cap');
requireSource(wallet, 'contract.getOriginalBalance() >= 75000000', 'wallet fee reserve guard');
requireSource(wallet, 'queryKey >= QUASAR_POOL_PAYOUT_MARKER', 'pool payout bounce namespace');
requireSource(master, 's.core.totalSupply + msg.amount <= s.core.maxSupply', 'hard maximum supply');
requireSource(master, 's.core.totalSupply -= msg.amount', 'burn debits total supply');
requireSource(master, 's.core.buybackPool + s.user.stakingRewardsPool + s.user.pendingReferralTotal', 'reserve encumbers liabilities');
requireSource(master, 's.core.buybackSwapPending == 0', 'buyback overlap guard');
requireSource(master, 'reserveGramsOnBalance(QUASAR_STORAGE_RESERVE, RESERVE_MODE_EXACT_AMOUNT)', 'master deploy reserve guard');
requireSource(defi, 'assert (msg.feeBps > 0 && msg.feeBps <= 30)', 'DeFi fee ceiling');
requireSource(defi, 'requireDeadline(msg.deadline)', 'DeFi deadline guard');
requireSource(defi, 's.tonReserve + msg.amount + QUASAR_STORAGE_RESERVE', 'DeFi sweep reserve guard');
requireSource(defi, 'reserveGramsOnBalance(QUASAR_STORAGE_RESERVE, RESERVE_MODE_EXACT_AMOUNT)', 'DeFi deploy reserve guard');
requireSource(admin, 'validateTimelockStorage', 'timelock storage validation');
requireSource(admin, 'assert (storage.minDelay >= 86400)', 'timelock minimum delay');
requireSource(admin, 'storage.pendingCalls.delete', 'timelock delete-before-send');

for (const key of ['url', 'name', 'iconUrl']) {
    if (!manifest[key]) throw new Error(`TON Connect manifest field missing: ${key}`);
}
if (!manifest.iconUrl.endsWith('.png')) throw new Error('TON Connect icon must be a PNG');
requireSource(website, 'JETTON_TRANSFER_OP = 0x0f8a7ea5', 'dApp TEP-74 transfer opcode');
requireSource(website, 'DEPOSIT_FORWARD_TON', 'dApp forwards TON for TEP-74 notifications');
requireSource(website, 'runGetMethod', 'dApp reads on-chain getters');

console.log('Tolk security invariants passed: wallet caps, ABI opcodes, rent reserves, supply cap, AMM limits, timelock validation, and dApp safety checks');
