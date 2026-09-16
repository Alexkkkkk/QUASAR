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
assertContains(defi, 'if (msg.from == self.qsrMaster)', 'master-funded DeFi notification is distinguished');
assertContains(defi, 'self.qsrReserve = self.qsrReserve + msg.amount;', 'master-funded DeFi fees enter qsrReserve');
assertContains(defi, 'let farmAmount: Int = self._min(msg.lpAmount, farmStake!!.staked);', 'partial LP exit only unstakes farmed LP');

const aiPriceSignal = master.slice(master.indexOf('receive(msg: AIPriceSignal)'), master.indexOf('receive(msg: AIAnomalyAlert)'));
if (aiPriceSignal.includes('self.mintable = true')) throw new Error('AIPriceSignal can re-enable minting');

console.log('Security invariants passed: ' + [
    'burn supply guard',
    'hard supply cap',
    'DeFi fee reserve reconciliation',
    'partial LP farm exit',
    'mint-stop protection',
    'referral escrow'
].join(', '));
