import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const master = readFileSync(join(root, 'contracts', 'quasar.tact'), 'utf8');
const defi = readFileSync(join(root, 'contracts', 'quasar_defi.tact'), 'utf8');
const common = readFileSync(join(root, 'contracts', 'quasar_common.tact'), 'utf8');
const admin = readFileSync(join(root, 'contracts', 'quasar_admin.tact'), 'utf8');

function assertContains(source: string, needle: string, label: string) {
    if (!source.includes(needle)) throw new Error('Missing security invariant: ' + label);
}

assertContains(common, 'const QUASAR_STORAGE_RESERVE: Int = ton("0.05");', 'shared storage reserve is explicit');
assertContains(common, 'const QUASAR_MAX_TX_BPS: Int = 100;', 'wallet transfer policy is explicit');
assertContains(common, 'const QUASAR_MAX_WALLET_BPS: Int = 300;', 'wallet balance policy is explicit');
assertContains(common, 'const QUASAR_MAX_TX_AMOUNT: Int = QUASAR_MAX_SUPPLY * QUASAR_MAX_TX_BPS / 10000;', 'wallet transfer cap derives from the shared policy');
assertContains(common, 'const QUASAR_MAX_WALLET_AMOUNT: Int = QUASAR_MAX_SUPPLY * QUASAR_MAX_WALLET_BPS / 10000;', 'wallet balance cap derives from the shared policy');
assertContains(common, 'require(self.balance + msg.amount <= QUASAR_MAX_WALLET_AMOUNT, "Max wallet exceeded");', 'wallet enforces the shared balance cap');
assertContains(common, 'require(msg.amount <= QUASAR_MAX_TX_AMOUNT, "Max tx exceeded");', 'wallet enforces the shared transfer cap');
assertContains(master, 'require(msg.maxTxBps == QUASAR_MAX_TX_BPS && msg.maxWalletBps == QUASAR_MAX_WALLET_BPS && msg.cooldown == QUASAR_TRANSFER_COOLDOWN, "Transfer limits are fixed");', 'AI cannot advertise an unsupported wallet policy');
assertContains(master, 'require(msg.feeBps == QUASAR_WALLET_FEE_BPS && msg.burnShare <= 100 && msg.maxTxBps == QUASAR_MAX_TX_BPS && msg.maxWalletBps == QUASAR_MAX_WALLET_BPS && msg.cooldown == QUASAR_TRANSFER_COOLDOWN, "Only implemented limits are allowed");', 'owner cannot store a policy that differs from wallet code');
assertContains(master, 'override const storageReserve: Int = QUASAR_STORAGE_RESERVE;', 'master retains storage reserve');
assertContains(defi, 'override const storageReserve: Int = QUASAR_STORAGE_RESERVE;', 'DeFi retains storage reserve');
assertContains(admin, 'override const storageReserve: Int = QUASAR_STORAGE_RESERVE;', 'admin timelock retains storage reserve');
assertContains(master, 'myBalance() - QUASAR_STORAGE_RESERVE', 'master sweep preserves storage reserve');
assertContains(defi, 'self.tonReserve + msg.amount + QUASAR_STORAGE_RESERVE', 'DeFi sweep preserves storage reserve');

assertContains(master, 'require(msg.amount <= self.totalSupply, "Supply underflow");', 'burn cannot underflow totalSupply');
assertContains(master, 'require(self.totalSupply + msg.amount <= self.maxSupply, "Max supply exceeded");', 'mint cannot exceed the hard supply cap');
assertContains(master, 'fun _mintQueryId(): Int', 'mint bounces use a reserved query id');
assertContains(master, 'queryId: self._mintQueryId(),', 'mint uses the reserved query id');
assertContains(master, 'self.totalSupply = self.totalSupply - msg.amount;', 'mint bounces roll back total supply');
assertContains(master, 'fun _requireNonMintQueryId(queryId: Int)', 'reserve payouts cannot impersonate mint bounces');
assertContains(master, 'fun _sendTokensToDefi(amount: Int, queryId: Int)', 'dedicated DeFi fee transfer path');
assertContains(master, 'forwardTonAmount: ton("0.01")', 'DeFi fee transfer emits accounting notification');
assertContains(master, 'self._sendTokensToDefi(defiAmt, msg.queryId);', 'fee split uses the accounting path');
assertContains(master, 'receive(msg: ClaimReferralRewards)', 'referral rewards have a claim path');
assertContains(master, 'self.pendingReferralRewards.set(referrer', 'referral rewards are escrowed before claim');
assertContains(master, 'pendingReferralTotal: Int as coins;', 'referral liabilities have an aggregate reserve counter');
assertContains(master, 'self.buybackPool + self.stakingRewardsPool + self.pendingReferralTotal', 'all referral liabilities encumber the reserve');
assertContains(master, 'require(msg.referrer != newAddress(0, 0), "Invalid referrer");', 'referrals cannot be assigned to the zero address');
assertContains(defi, 'if (msg.from == self.qsrMaster)', 'master-funded DeFi notification is distinguished');
assertContains(defi, 'message RefundPendingQsr', 'pending QSR deposits have a refund path');
assertContains(defi, 'self._sendQsr(sender(), pending!!, 3, self._nextPayoutId())', 'pending QSR refunds return the deposited tokens');
assertContains(defi, 'self.tonReserve + msg.amount + QUASAR_STORAGE_RESERVE', 'TON sweep preserves LP reserves');
assertContains(master, 'require(pending == 0 || self.stakingRewardsPool >= pending, "Rewards pool empty")', 'staking cannot erase unpaid rewards');
assertContains(defi, 'self.qsrReserve = self.qsrReserve + msg.amount;', 'master-funded DeFi fees enter qsrReserve');
assertContains(defi, 'let farmAmount: Int = self._min(msg.lpAmount, farmStake!!.staked);', 'partial LP exit only unstakes farmed LP');
assertContains(master, 'receive(msg: ProposeOwner)', 'ownership transfer requires an explicit proposal');
assertContains(master, 'require(sender() == self.pendingOwner, "Not pending owner");', 'only the pending owner may accept ownership');
assertContains(master, 'require(now() >= self.ownerTransferAt, "Timelock active");', 'ownership acceptance honors the timelock');

assertContains(master, 'let extended: Int = now() + self.stakingLockPeriod;', 'staking top-up extends the lock (F-05)');
assertContains(master, 'fun _requireAiCooldown() { require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI cooldown") }', 'AI cooldown is unconditional (F-07)');
assertContains(master, 'self.buybackThreshold = 10_000_000_000;', 'buyback threshold is QSR-denominated (F-09)');
assertContains(master, 'fun _sendBuybackToDefi', 'buyback swap leg is routed through the DeFi AMM (F-09)');
assertContains(master, 'storeUint(0x5f4a3b21, 32)', 'buyback marker payload identifies the swap leg (F-09)');
assertContains(master, 'receive(msg: BuybackTon)', 'master accounts the AMM buyback TON proceeds (F-09)');
assertContains(master, 'require(self.buybackSwapPending == 0, "Buyback pending");', 'buybacks cannot overlap while a swap is pending');
assertContains(master, 'buybackQueries: map<Int, Bool>;', 'buyback query ids are replay-protected');
assertContains(master, 'require(self.buybackQueries.get(msg.queryId) == null, "Query already used");', 'buyback trigger query ids are unique');
assertContains(defi, 'fun _executeBuybackSwap', 'DeFi executes the master-initiated buyback swap (F-09)');
assertContains(defi, 'self._executeBuybackSwap(msg.amount, msg.queryId);', 'the buyback swap runs atomically inside the credit transaction (F-09)');
assertContains(defi, 'message(0x2c7e91a4) BuybackTon', 'buyback TON return uses a dedicated opcode (F-09)');
assertContains(master, 'aiActionOldAddress: map<Int, Address>;', 'AI address actions are reversible (F-07)');
assertContains(master, 'receive(msg: ProposeContent)', 'jetton metadata changes require an explicit proposal (TEP-64, #58)');
assertContains(master, 'require(prefix == 0x00 || prefix == 0x01, "Invalid TEP-64 content prefix");', 'only documented TEP-64 layouts may be staged (#58)');
assertContains(master, 'require(self.contentAt > 0 && now() >= self.contentAt, "Content timelock active");', 'metadata updates honor the 48h timelock (TEP-64, #58)');
assertContains(master, 'self.content = self.pendingContent!!;', 'metadata is only written by the timelocked confirmation (TEP-64, #58)');
assertContains(master, 'fun _workchainOf(a: Address): Int?', 'TEP-89 discovery parses the owner workchain (#60)');
assertContains(master, 'storeUint(0, 2)             // wallet_address: addr_none$00', 'TEP-89 wrong-workchain answers carry addr_none (#60)');
assertContains(common, 'receive(msg: ProvideWalletAddress) {', 'the jetton wallet answers TEP-89 discovery itself (#56)');
assertContains(defi, 'require(msg.feeBps > 0 && msg.feeBps <= 30, "Fee must not exceed 0.30%");', 'DeFi fee ceiling matches the docs (F-13)');
assertContains(defi, 'fun _requireDeadline(deadline: Int)', 'DeFi operations have an explicit expiry guard');
assertContains(defi, 'require(deadline > now(), "Operation expired");', 'expired swaps and liquidity operations are rejected');
assertContains(defi, 'minimumLiquidity: Int as coins;', 'the first LP has permanently locked minimum liquidity');
assertContains(defi, 'require(rootLp > self.minimumLiquidity, "Initial liquidity too small");', 'initial liquidity cannot bypass the locked minimum');
assertContains(defi, 'require(lpToMint >= msg.minLpOut, "LP slippage exceeded");', 'LP minting has user-controlled minimum output');
assertContains(defi, 'require(tonOut >= msg.minTonOut, "TON slippage exceeded");', 'liquidity removal has a TON minimum output');
assertContains(defi, 'require(qsrOut >= msg.minQsrOut, "QSR slippage exceeded");', 'liquidity removal has a QSR minimum output');
assertContains(defi, 'receive(msg: EmergencyWithdrawFarm)', 'farm principal has an emergency withdrawal path');
assertContains(defi, 'receive(msg: ProposePoolOwner)', 'DeFi ownership transfer requires an explicit proposal');
assertContains(defi, 'require(now() >= self.ownerTransferAt, "Timelock active");', 'DeFi ownership acceptance honors the timelock');
assertContains(defi, 'self.pendingFeeAt = now() + self.ownerTransferDelay;', 'DeFi fee changes are staged behind a timelock');
assertContains(defi, 'self.pendingMaxTradeAt = now() + self.ownerTransferDelay;', 'DeFi trade-limit changes are staged behind a timelock');
assertContains(defi, 'priceCumulativeQsrPerTon: Int;', 'DeFi exposes cumulative price observations for TWAP consumers');

assertContains(master, 'self.buybackSwapPending == 0 && self.buybackPool >= self.buybackThreshold', 'a pending buyback swap cannot be overwritten by the fee path (M-03)');

assertContains(common, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');
assertContains(master, 'body: TransferConfirmed{ queryId: msg.queryId }.toCell()', 'the master dispatches source-wallet cleanup from the authenticated FeeTransfer path (P0.2)');
assertContains(common, 'if (receiver == null) { return }', 'stale transfer confirmations are a no-op, not a revert (P0.2)');
assertContains(common, 'body: TokenExcesses{ queryId: msg.queryId }.toCell()', 'excesses carry the request query id (F-21)');
assertContains(master, 'return accrued > self.stakingRewardsPool ? self.stakingRewardsPool : accrued;', 'staking rewards are capped by the fee pool (F-23)');
assertContains(master, 'emit(EventBuybackExecuted{ tonSpent: 0, qsrBurned: burnPart }.toCell());', 'the buyback receipt keeps the remaining-value slot free (F-22: v5 uses an emit() external message, which cannot consume it)');

const aiPriceSignal = master.slice(master.indexOf('receive(msg: AIPriceSignal)'), master.indexOf('receive(msg: AIAnomalyAlert)'));
if (aiPriceSignal.includes('self.mintable = true')) throw new Error('AIPriceSignal can re-enable minting');

// ─── Website / dApp invariants (documentation-driven) ───
const websiteJs = readFileSync(join(root, 'website', 'tonconnect.js'), 'utf8');
const websiteHtml = readFileSync(join(root, 'website', 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(join(root, 'website', 'tonconnect-manifest.json'), 'utf8'));

// QuasarWallet.receive(TokenTransfer) spends 0.02 + 0.05 TON from the source
// wallet balance. Attaching less makes the second action fail with exit code 37.
const depositGas = Number((websiteJs.match(/DEPOSIT:\s*'(\d+)'/) || [])[1]);
if (!Number.isFinite(depositGas) || depositGas < 70_000_000) {
    throw new Error('dApp deposit gas is below the 0.07 TON the wallet spends: ' + depositGas);
}

// TEP-74 deposit: the transfer must carry a non-zero forward TON amount so the
// receiving wallet emits the TokenNotification that credits the deposit.
if (!websiteJs.includes('DEPOSIT_FORWARD_TON')) throw new Error('missing jetton forward TON');

// TON Connect: url/name/iconUrl are required, iconUrl must be a PNG (no SVG),
// and the CDN bundle must be pinned instead of @latest.
for (const key of ['url', 'name', 'iconUrl']) {
    if (!manifest[key]) throw new Error('manifest field missing: ' + key);
}
if (!manifest.iconUrl.endsWith('.png')) throw new Error('manifest iconUrl must be a PNG');
if (manifest.url.endsWith('/')) throw new Error('manifest url should not end with a slash');
if (websiteHtml.includes('@tonconnect/ui@latest')) throw new Error('TON Connect UI must be pinned');

console.log('Security invariants passed: ' + [
    'burn supply guard',
    'hard supply cap',
    'DeFi fee reserve reconciliation',
    'partial LP farm exit',
    'pending deposit refunds',
    'LP reserve sweep protection',
    'staking reward preservation',
    'mint-stop protection',
    'referral escrow',
    'timelocked ownership transfer',
    'staking lock extension',
    'unconditional AI cooldown',
    'QSR-denominated buyback threshold',
    'buyback AMM swap leg',
    'reversible AI address actions',
    'DeFi fee ceiling',
    'deadline and slippage guards',
    'initial LP minimum liquidity',
    'farm emergency withdrawal',
    'DeFi owner timelock',
    'timelocked DeFi fee controls',
    'AMM price observations',
    'buyback swap overlap guard',
    'authenticated transfer confirmations',
    'dApp deposit gas covers the wallet fee legs',
    'TON Connect manifest and pinned SDK bundle'
].join(', '));
