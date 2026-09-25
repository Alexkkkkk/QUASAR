import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const master = readFileSync(join(root, 'contracts', 'quasar.tact'), 'utf8');
const defi = readFileSync(join(root, 'contracts', 'quasar_defi.tact'), 'utf8');

function assertContains(source: string, needle: string, label: string) {
    if (!source.includes(needle)) throw new Error('Missing security invariant: ' + label);
}

assertContains(master, 'require(msg.amount <= self.totalSupply, "Supply underflow");', 'burn cannot underflow totalSupply');
assertContains(master, 'require(self.totalSupply + msg.amount <= self.maxSupply, "Max supply exceeded");', 'mint cannot exceed the hard supply cap');
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
assertContains(defi, 'self._sendQsr(sender(), pending!!, 0)', 'pending QSR refunds return the deposited tokens');
assertContains(defi, 'self.tonReserve + msg.amount + ton("0.05")', 'TON sweep preserves LP reserves');
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
assertContains(defi, 'fun _executeBuybackSwap', 'DeFi executes the master-initiated buyback swap (F-09)');
assertContains(defi, 'self._executeBuybackSwap(msg.amount, msg.queryId);', 'the buyback swap runs atomically inside the credit transaction (F-09)');
assertContains(defi, 'message(0x2c7e91a4) BuybackTon', 'buyback TON return uses a dedicated opcode (F-09)');
assertContains(master, 'aiActionOldAddress: map<Int, Address>;', 'AI address actions are reversible (F-07)');
assertContains(defi, 'require(msg.feeBps > 0 && msg.feeBps <= 30, "Fee must not exceed 0.30%");', 'DeFi fee ceiling matches the docs (F-13)');

assertContains(master, 'message(0xd53276db) TokenExcesses', 'excesses use the TEP-74 opcode (F-21)');
assertContains(master, 'body: TokenExcesses{ queryId: msg.queryId }.toCell()', 'excesses carry the request query id (F-21)');
assertContains(master, 'return accrued > self.stakingRewardsPool ? self.stakingRewardsPool : accrued;', 'staking rewards are capped by the fee pool (F-23)');
assertContains(master, 'mode: SendPayGasSeparately | SendIgnoreErrors, body: EventBuybackExecuted', 'the buyback receipt keeps the remaining-value slot free (F-22)');

const aiPriceSignal = master.slice(master.indexOf('receive(msg: AIPriceSignal)'), master.indexOf('receive(msg: AIAnomalyAlert)'));
if (aiPriceSignal.includes('self.mintable = true')) throw new Error('AIPriceSignal can re-enable minting');

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
    'DeFi fee ceiling'
].join(', '));
