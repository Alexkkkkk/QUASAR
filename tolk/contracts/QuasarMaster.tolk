// QUASAR Master Tolk migration.
// Storage order, message field order, and getters are intentionally aligned with
// contracts/quasar.tact and docs/abi/quasar-master.json.
import "QuasarCommon";
import "@gen/QuasarWallet.code";

const BUYBACK_CALLBACK_TIMEOUT: int = 3600;
const MASTER_TRANSFER_QUERY_PREFIX: int = 1 << 63;
const AI_DECISION_DOMAIN: int = 0x51a5c3d2;
const QUASAR_AI_PRICE_HISTORY_CAP: int = 2048;
const QUASAR_AI_ANOMALY_CAP: int = 1024;
const MINT_QUERY_ID: int = 18446744073709551615;
const MASTER_MINT_MARKER: int = 0x4d494e54;

struct JettonData { totalSupply: int; mintable: bool; adminAddress: address; jettonContent: cell; jettonWalletCode: cell; }
struct AIState { oracleAddress: address; aiModeEnabled: bool; fullAutonomy: bool; lastRebalanceAt: int; totalSignalsReceived: int; currentFeeBps: int; priceHistoryCount: int; anomalyCount: int; lastHeartbeat: int; isAlive: bool; lastQueryId: int; }
struct FeeConfig { feeBps: int; burnShare: int; treasuryShare: int; maxTxBps: int; maxWalletBps: int; cooldown: int; totalBurned: int; totalFeesCollected: int; }
struct BuybackState { enabled: bool; pool: int; threshold: int; cooldown: int; burnPercent: int; buybackSwapPending: int; buybackSwapQueryId: int; lastBuybackAt: int; totalBuybacks: int; totalQsrBurnedViaBuyback: int; totalTonSpent: int; }
struct AutonomyState { fullAutonomyEnabled: bool; aiActionCooldown: int; lastAiActionTime: int; heartbeatTimeout: int; lastHeartbeat: int; ownerOverrideWindow: int; vetoThresholdBps: int; totalVetoStake: int; pendingActions: int; }
struct AIActionLog { actionId: int; timestamp: int; actionType: string; oldValue: int; newValue: int; reason: string; executed: bool; vetoed: bool; overridden: bool; }
struct AIRecommendation { timestamp: int; action: string; confidence: int; executed: bool; }
struct StakeInfo { amount: int; startTime: int; lastClaim: int; lockEnd: int; }
struct StakingConfig { enabled: bool; apyBps: int; minStake: int; lockPeriod: int; totalStaked: int; }
struct ReferralInfo { referrer: address; totalEarned: int; totalReferrals: int; }
struct ReferralConfig { enabled: bool; rewardBps: int; }
struct VestingInfo { totalAmount: int; claimed: int; startTime: int; cliff: int; duration: int; }
struct ReserveSnapshot { reserveBalance: int; freeReserve: int; buybackPool: int; stakingRewardsPool: int; referralLiability: int; custodyBalance: int; totalStaked: int; totalSupply: int; }
struct UserLiabilitySnapshot { pendingQsrDeposit: int; stakedPrincipal: int; pendingReferralReward: int; vestedUnclaimed: int; }
struct PendingMasterPayout { kind: int; beneficiary: address; amount: int; d1: int; d2: int; d3: int; }
struct GovernanceState { quorumBps: int; totalStaked: int; proposals: int; }

// Master-only messages. Shared Jetton/TEP-89 messages are imported from the
// common module, so Master and Wallet serialize the standard bodies identically.
message EventMint { amount: int; receiver: address; }
message EventBurn { amount: int; burner: address; }
message EventFeeDistributed { totalFee: int; burn: int; buyback: int; staking: int; referral: int; treasury: int; defiPool: int; }
message EventBuybackExecuted { tonSpent: int; qsrBurned: int; }
message EventBuybackSwapped { queryId: int as uint64; qsrIn: int; tonOut: int; }
message(0x2c7e91a4) BuybackTon { queryId: int as uint64; tonAmount: int as coins; qsrSwapped: int as coins; }
message EventStake { staker: address; amount: int; }
message EventUnstake { staker: address; amount: int; }
message EventReferralRegistered { user: address; referrer: address; }
message EventVestingClaimed { beneficiary: address; amount: int; }
message EventAiAction { actionId: int; actionType: string; oldValue: int; newValue: int; }
message EventAdminConfig { action: string; actor: address; valueA: int; valueB: int; }
message EventEmergencyPause { guardian: address; paused: bool; reason: string; }
message EventGovernanceVote { voter: address; proposalId: int; weight: int; }
message EventGovernanceExecuted { proposalId: int; actionId: int; }
message EventAiVeto { actionId: int; voter: address; amount: int; actionStake: int; vetoed: bool; }
message EventAiVetoReleased { actionId: int; voter: address; amount: int; }
message EventAiSignedDecision { queryId: int; nonce: int; action: int; value: int; }
message AISetOracle { oracleAddress: address; }
message AIGrantFullAutonomy { enabled: bool; }
message AIHeartbeat { queryId: int as uint64; status: string; }
message OwnerOverride { actionId: int as uint64; reason: string; }
message VetoAIAction { actionId: int as uint64; amount: int as coins; }
message ReleaseVeto { actionId: int as uint64; }
message AIRebalance { queryId: int as uint64; targetFeeBps: int as uint16; targetBurnShare: int as uint8; recommendation: string; }
message AIPriceSignal { queryId: int as uint64; priceTon: int as coins; volatility: int as uint32; sentiment: int as int8; action: int as uint8; }
message AIAnomalyAlert { queryId: int as uint64; severity: int as uint8; anomalyType: int as uint8; affectedWallets: int as uint32; recommendedAction: string; }
message AIGovernanceProposal { queryId: int as uint64; proposalType: int as uint8; newValue: int; description: string; confidence: int as uint8; }
message AISetFee { queryId: int as uint64; feeBps: int as uint16; reason: string; }
message AISetTreasuryDirect { queryId: int as uint64; treasury: address; reason: string; }
message AISetAntiWhale { queryId: int as uint64; maxTxBps: int as uint16; maxWalletBps: int as uint16; cooldown: int as uint16; reason: string; }
message AISetBuybackDirect { queryId: int as uint64; enabled: bool; threshold: int as coins; cooldown: int as uint32; burnPercent: int as uint8; reason: string; }
message(0x0490d605) AIToggleMinting { queryId: int as uint64; enabled: bool; reason: string; }
message AIEmergencyPause { queryId: int as uint64; pause: bool; severity: int as uint8; reason: string; }
message AIRotateOracle { queryId: int as uint64; newOracle: address; reason: string; }
message(0x642b7d07) Mint { amount: int as coins; receiver: address; }
message SetTreasury { treasury: address; }
message SetFeeConfig { feeBps: int as uint16; burnShare: int as uint8; maxTxBps: int as uint16; maxWalletBps: int as uint16; cooldown: int as uint16; }
message(0xf1822da1) ToggleMinting { enabled: bool; }
message TriggerBuyback { queryId: int as uint64; }
message CancelBuybackSwap { queryId: int as uint64; }
message SetBuybackConfig { enabled: bool; threshold: int as coins; cooldown: int as uint32; burnPercent: int as uint8; }
message SetDefiAddress { defiAddress: address; }
message SetEmergencyGuardian { guardian: address; }
message GuardianPause { reason: string; }
message SyncFeeToDefi { amount: int as coins; }
message Stake { amount: int as coins; }
message Unstake { amount: int as coins; }
message ClaimRewards { }
message SetStakingConfig { enabled: bool; apyBps: int as uint16; minStake: int as coins; lockPeriod: int as uint32; }
message RegisterReferral { referrer: address; }
message ClaimReferralRewards { }
message SetReferralConfig { enabled: bool; rewardBps: int as uint16; }
message AddVesting { beneficiary: address; totalAmount: int as coins; cliff: int as uint32; duration: int as uint32; }
message ClaimVested { }
message SweepTON { amount: int as coins; }
message ProposeOwner { newOwner: address; }
message AcceptOwner { }
message CancelOwnerTransfer { }
message GovernanceVote { proposalId: int as uint64; kind: int as uint8; flag: bool; feeBps: int as uint16; deadline: int as uint32; reason: string; }
message RefundPendingDeposit { }
message ProposeWalletCode { newWalletCode: cell; }
message ProposeContent { newContent: cell; }
message(0x7a1e5c02) SetAiOracleKey { publicKey: int as uint256; }
message(0x7a1e5c03) ClearAiOracleKey { }
message(0x7a1e5c01) AISignedDecision { queryId: int as uint64; nonce: int as uint64; validUntil: int as uint32; action: int as uint8; value: int as uint16; payloadHash: int as uint256; signature: slice as bytes64; }

contract QuasarMaster {
    // Persistent fields preserve the Tact declaration order and wire widths.
    storage {
        totalSupply: int as coins; maxSupply: int as coins; mintable: bool; owner: address;
        pendingOwner: address; ownerTransferAt: int; ownerTransferDelay: int as uint32; content: cell; walletCode: cell;
        reserveBalance: int as coins; custodyBalance: int as coins; custodyPayoutSeq: int as uint64;
        feeBps: int as uint16; feeBurnShare: int as uint8; treasury: address; totalBurned: int as coins; totalFeesCollected: int as coins;
        maxTxBps: int as uint16; maxWalletBps: int as uint16; cooldownSeconds: int as uint16; tradingEnabled: bool;
        buybackEnabled: bool; buybackPool: int as coins; buybackThreshold: int as coins; buybackCooldown: int as uint32; buybackBurnPercent: int as uint8;
        buybackSwapPending: int as coins; buybackSwapQueryId: int as uint64; buybackSwapDefiAddress: address; buybackQueries: map<int, bool>;
        lastBuybackTime: int; totalBuybacks: int; totalQsrBurnedViaBuyback: int as coins; totalTonSpentOnBuyback: int as coins;
        aiOracle: address; aiEnabled: bool; aiFullAutonomy: bool; lastRebalanceTime: int; signalCount: int; priceHistoryCount: int;
        priceHistory: map<int, int>; anomalyLog: map<int, AIRecommendation>; anomalyIndex: int; priceHistoryDropped: int; anomalyDropped: int;
        minConfidence: int as uint8; emergencyPause: bool; aiActionCooldown: int as uint32; lastAiActionTime: int; lastAiQueryId: int as uint64;
        heartbeatTimeout: int as uint32; lastHeartbeat: int; ownerOverrideWindow: int as uint32; vetoThresholdBps: int as uint16;
        aiActionLog: map<int, AIActionLog>; aiActionIndex: int; pendingAiActions: map<int, int>; aiActionOldAddress: map<int, address>;
        aiActionOldFeeBps: map<int, int>; aiActionOldMintable: map<int, int>; aiActionOldEmergencyPause: map<int, int>; aiActionOldTrading: map<int, int>;
        aiActionOldBurnShare: map<int, int>; aiActionOldMaxTxBps: map<int, int>; aiActionOldMaxWalletBps: map<int, int>; aiActionOldCooldownSeconds: map<int, int>;
        aiActionOldBuybackThreshold: map<int, int>; aiActionOldBuybackCooldown: map<int, int>; aiActionOldBuybackBurnPercent: map<int, int>;
        totalVetoStake: int as coins; vetoEscrows: map<int, int>; vetoActionStake: map<int, int>; emergencyGuardian: address;
        aiOraclePubKey: int as uint256; aiNonce: int as uint64; aiSignedDecisionCount: int;
        stakingEnabled: bool; stakingApyBps: int as uint16; stakingMinStake: int as coins; stakingLockPeriod: int as uint32;
        stakers: map<address, StakeInfo>; totalStaked: int as coins; stakingRewardsPool: int as coins; pendingQsrDeposits: map<address, int>;
        referralEnabled: bool; referralRewardBps: int as uint16; referrals: map<address, ReferralInfo>; pendingReferralRewards: map<address, int>; pendingReferralTotal: int as coins;
        vestingEnabled: bool; teamAllocation: int as coins; teamClaimed: int as coins; vestingSchedules: map<address, VestingInfo>;
        defiAddress: address; defiFeeShareBps: int as uint16;
        govQuorumBps: int as uint16; govVotes: map<int, bool>; govProposalStake: map<int, int>; govProposalCount: int; govProposalExecuted: map<int, bool>;
        pendingFee: int as uint16; pendingFeeBurnShare: int; pendingMaxTx: int as uint16; pendingMaxWallet: int as uint16; pendingCooldown: int as uint16; pendingFeeConfigAt: int;
        pendingWalletCode: cell?; walletCodeAt: int; pendingContent: cell?; contentAt: int;
        pendingMasterPayouts: map<int, PendingMasterPayout>; masterPayoutSeq: int as uint64; govProposalContentHash: map<int, int>;
    }

    init(owner: address, content: cell, walletCode: cell) {
        self.totalSupply = 0; self.maxSupply = QUASAR_MAX_SUPPLY; self.mintable = true; self.owner = owner;
        self.pendingOwner = newAddress(0, 0); self.ownerTransferAt = 0; self.ownerTransferDelay = 172800;
        self.content = content; self.walletCode = walletCode; self.reserveBalance = 0; self.custodyBalance = 0; self.custodyPayoutSeq = 0;
        self.feeBps = QUASAR_WALLET_FEE_BPS; self.feeBurnShare = 50; self.treasury = owner; self.totalBurned = 0; self.totalFeesCollected = 0;
        self.maxTxBps = QUASAR_MAX_TX_BPS; self.maxWalletBps = QUASAR_MAX_WALLET_BPS; self.cooldownSeconds = QUASAR_TRANSFER_COOLDOWN; self.tradingEnabled = true;
        self.buybackEnabled = true; self.buybackPool = 0; self.buybackThreshold = 10000000000; self.buybackCooldown = 3600; self.buybackBurnPercent = 100;
        self.buybackSwapPending = 0; self.buybackSwapQueryId = 0; self.buybackSwapDefiAddress = newAddress(0, 0); self.buybackQueries = emptyMap();
        self.lastBuybackTime = 0; self.totalBuybacks = 0; self.totalQsrBurnedViaBuyback = 0; self.totalTonSpentOnBuyback = 0;
        self.aiOracle = owner; self.aiEnabled = false; self.aiFullAutonomy = false; self.lastRebalanceTime = 0; self.signalCount = 0; self.priceHistoryCount = 0;
        self.priceHistory = emptyMap(); self.anomalyLog = emptyMap(); self.anomalyIndex = 0; self.priceHistoryDropped = 0; self.anomalyDropped = 0;
        self.minConfidence = 75; self.emergencyPause = false; self.aiActionCooldown = 21600; self.lastAiActionTime = 0; self.lastAiQueryId = 0;
        self.heartbeatTimeout = 604800; self.lastHeartbeat = now(); self.ownerOverrideWindow = 86400; self.vetoThresholdBps = 1000;
        self.aiActionLog = emptyMap(); self.aiActionIndex = 0; self.pendingAiActions = emptyMap(); self.aiActionOldAddress = emptyMap();
        self.aiActionOldFeeBps = emptyMap(); self.aiActionOldMintable = emptyMap(); self.aiActionOldEmergencyPause = emptyMap(); self.aiActionOldTrading = emptyMap();
        self.aiActionOldBurnShare = emptyMap(); self.aiActionOldMaxTxBps = emptyMap(); self.aiActionOldMaxWalletBps = emptyMap(); self.aiActionOldCooldownSeconds = emptyMap();
        self.aiActionOldBuybackThreshold = emptyMap(); self.aiActionOldBuybackCooldown = emptyMap(); self.aiActionOldBuybackBurnPercent = emptyMap();
        self.totalVetoStake = 0; self.vetoEscrows = emptyMap(); self.vetoActionStake = emptyMap(); self.emergencyGuardian = owner;
        self.aiOraclePubKey = 0; self.aiNonce = 0; self.aiSignedDecisionCount = 0;
        self.stakingEnabled = true; self.stakingApyBps = 2000; self.stakingMinStake = ton("100"); self.stakingLockPeriod = 2592000;
        self.stakers = emptyMap(); self.totalStaked = 0; self.stakingRewardsPool = 0; self.pendingQsrDeposits = emptyMap();
        self.referralEnabled = true; self.referralRewardBps = 100; self.referrals = emptyMap(); self.pendingReferralRewards = emptyMap(); self.pendingReferralTotal = 0;
        self.vestingEnabled = true; self.teamAllocation = 0; self.teamClaimed = 0; self.vestingSchedules = emptyMap();
        self.defiAddress = newAddress(0, 0); self.defiFeeShareBps = 500;
        self.govQuorumBps = 1000; self.govVotes = emptyMap(); self.govProposalStake = emptyMap(); self.govProposalCount = 0; self.govProposalExecuted = emptyMap();
        self.pendingFee = 0; self.pendingFeeBurnShare = 0; self.pendingMaxTx = 0; self.pendingMaxWallet = 0; self.pendingCooldown = 0; self.pendingFeeConfigAt = 0;
        self.pendingWalletCode = null; self.walletCodeAt = 0; self.pendingContent = null; self.contentAt = 0;
        self.pendingMasterPayouts = emptyMap(); self.masterPayoutSeq = 0; self.govProposalContentHash = emptyMap();
    }

    fun requireOwner() { require(sender() == self.owner, "Only owner"); }
    fun requireNotPaused() { require(!self.emergencyPause, "Paused"); }
    fun requireTrading() { require(self.tradingEnabled, "Trading off"); }
    fun requireAi() { require(sender() == self.aiOracle, "Only AI oracle"); require(self.aiEnabled, "AI disabled"); }
    fun requireFreshAiQuery(id: int) { require(id > self.lastAiQueryId, "Stale AI query"); self.lastAiQueryId = id; }
    fun requireAiCooldown() { require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI cooldown"); }
    fun poolEncumbrance(): int { return self.buybackPool + self.stakingRewardsPool + self.pendingReferralTotal; }
    fun voteKey(voter: address, proposalId: int): int { return beginCell().storeUint(proposalId, 64).storeAddress(voter).endCell().hash(); }
    fun nextMasterQueryId(): int { let id: int = self.masterPayoutSeq + 1; require(id < MASTER_TRANSFER_QUERY_PREFIX - 1, "Master query ids exhausted"); self.masterPayoutSeq = id; return MASTER_TRANSFER_QUERY_PREFIX + id; }
    fun newPayout(kind: int, beneficiary: address, amount: int, d1: int, d2: int, d3: int): int {
        let id: int = self.masterPayoutSeq + 1; require(id < MASTER_TRANSFER_QUERY_PREFIX - 1, "Master query ids exhausted"); self.masterPayoutSeq = id;
        self.pendingMasterPayouts.set(id, PendingMasterPayout{kind: kind, beneficiary: beneficiary, amount: amount, d1: d1, d2: d2, d3: d3}); return id;
    }
    fun sendInternal(to: address, amount: int, queryId: int, from: address) {
        require(amount > 0, "Invalid transfer amount");
        let init = quasarWalletDeployment(to, myAddress(), quasarWalletCompiledCode());
        send(SendParameters{to: init.calculateAddress(), value: ton("0.02"), bounce: true, mode: SendPayGasSeparately,
            body: InternalTransfer{queryId: queryId, amount: amount, from: from, responseDestination: myAddress(), forwardTonAmount: 0, forwardPayload: emptySlice()}.toCell(), code: init.code, data: init.data});
    }
    fun sendMint(to: address, amount: int) {
        let init = quasarWalletDeployment(to, myAddress(), quasarWalletCompiledCode());
        send(SendParameters{to: init.calculateAddress(), value: ton("0.02"), bounce: true, mode: SendPayGasSeparately,
            body: InternalTransfer{queryId: MINT_QUERY_ID, amount: amount, from: myAddress(), responseDestination: myAddress(), forwardTonAmount: 0,
                forwardPayload: beginCell().storeUint(MASTER_MINT_MARKER, 32).endCell().asSlice()}.toCell(), code: init.code, data: init.data});
    }
    fun sendReserve(to: address, amount: int, kind: int, d1: int) {
        require(amount > 0 && self.reserveBalance >= amount, "Insufficient QSR reserve");
        self.reserveBalance -= amount; let payout: int = self.newPayout(kind, to, amount, d1, 0, 0);
        self.sendInternal(to, amount, MASTER_TRANSFER_QUERY_PREFIX + payout, myAddress());
    }
    fun sendCustody(to: address, amount: int, kind: int, d1: int, d2: int, d3: int) {
        require(amount > 0 && self.custodyBalance >= amount, "Insufficient custody balance");
        self.custodyBalance -= amount; let payout: int = self.newPayout(kind, to, amount, d1, d2, d3);
        let init = quasarWalletDeployment(myAddress(), myAddress(), quasarWalletCompiledCode());
        send(SendParameters{to: init.calculateAddress(), value: ton("0.02"), bounce: true, mode: SendPayGasSeparately,
            body: PoolPayout{queryId: payout, amount: amount, destination: to, responseDestination: myAddress()}.toCell(), code: init.code, data: init.data});
    }
    fun restorePayout(queryId: int): bool {
        let id: int = queryId >= MASTER_TRANSFER_QUERY_PREFIX ? queryId - MASTER_TRANSFER_QUERY_PREFIX : queryId;
        let p: PendingMasterPayout? = self.pendingMasterPayouts.get(id); if (p == null) { return false; }
        self.pendingMasterPayouts.set(id, null);
        if (p!!.kind == 1) { let s: StakeInfo? = self.stakers.get(p!!.beneficiary); let base: int = s == null ? 0 : s!!.amount;
            self.stakers.set(p!!.beneficiary, StakeInfo{amount: base + p!!.amount, startTime: p!!.d2, lastClaim: p!!.d3, lockEnd: p!!.d1}); self.totalStaked += p!!.amount;
        } else if (p!!.kind == 2) { let v: VestingInfo? = self.vestingSchedules.get(p!!.beneficiary); if (v != null) { self.vestingSchedules.set(p!!.beneficiary, VestingInfo{totalAmount: v!!.totalAmount, claimed: p!!.d1, startTime: v!!.startTime, cliff: v!!.cliff, duration: v!!.duration}); } self.teamClaimed -= p!!.amount;
        } else if (p!!.kind == 3) { self.stakingRewardsPool += p!!.amount; let s: StakeInfo? = self.stakers.get(p!!.beneficiary); if (s != null) { self.stakers.set(p!!.beneficiary, StakeInfo{amount: s!!.amount, startTime: s!!.startTime, lastClaim: now(), lockEnd: s!!.lockEnd}); }
        } else if (p!!.kind == 4) { let r: int? = self.pendingReferralRewards.get(p!!.beneficiary); self.pendingReferralRewards.set(p!!.beneficiary, (r == null ? 0 : r!!) + p!!.amount); self.pendingReferralTotal += p!!.amount;
        } else if (p!!.kind == 5) { let v: int? = self.vetoEscrows.get(p!!.d1); self.vetoEscrows.set(p!!.d1, (v == null ? 0 : v!!) + p!!.amount); let a: int? = self.vetoActionStake.get(p!!.d2); self.vetoActionStake.set(p!!.d2, (a == null ? 0 : a!!) + p!!.amount); self.totalVetoStake += p!!.amount;
        } else if (p!!.kind == 6) { let d: int? = self.pendingQsrDeposits.get(p!!.beneficiary); self.pendingQsrDeposits.set(p!!.beneficiary, (d == null ? 0 : d!!) + p!!.amount);
        } else { require(false, "Unknown payout kind"); }
        return true;
    }
    fun calculateRewards(user: address): int {
        let s: StakeInfo? = self.stakers.get(user); if (s == null) { return 0; }
        let accrued: int = s!!.amount * self.stakingApyBps / 10000 * (now() - s!!.lastClaim) / 31536000;
        return accrued > self.stakingRewardsPool ? self.stakingRewardsPool : accrued;
    }
    fun logAction(kind: string, oldValue: int, newValue: int, reason: string, administrative: bool): int {
        let id: int = self.aiActionIndex;
        self.aiActionLog.set(id, AIActionLog{actionId: id, timestamp: now(), actionType: kind, oldValue: oldValue, newValue: newValue, reason: reason, executed: true, vetoed: false, overridden: false});
        self.pendingAiActions.set(id, now()); self.aiActionIndex = id + 1; if (administrative) { self.lastAiActionTime = now(); } return id;
    }
    fun emitAdmin(action: string, a: int, b: int) { emit(EventAdminConfig{action: action, actor: sender(), valueA: a, valueB: b}.toCell()); }

    incomingMessages {
        Mint => { self.requireNotPaused(); self.requireTrading(); self.requireOwner(); require(msg.amount > 0 && msg.receiver != newAddress(0, 0), "Invalid mint"); require(self.mintable, "Minting off"); require(msg.amount <= self.maxSupply * self.maxTxBps / 10000, "Max tx exceeded"); require(self.totalSupply + msg.amount <= self.maxSupply, "Max supply exceeded"); self.totalSupply += msg.amount; self.sendMint(msg.receiver, msg.amount); emit(EventMint{amount: msg.amount, receiver: msg.receiver}.toCell()); }
        BurnNotification => { require(msg.amount > 0 && msg.amount <= self.totalSupply, "Supply underflow"); let wi = quasarWalletDeployment(msg.sender, myAddress(), quasarWalletCompiledCode()); require(sender() == wi.calculateAddress(), "Unauthorized burn"); self.totalSupply -= msg.amount; emit(EventBurn{amount: msg.amount, burner: msg.sender}.toCell()); send(SendParameters{to: wi.calculateAddress(), value: 0, bounce: false, mode: SendPayGasSeparately | SendIgnoreErrors, body: BurnConfirmed{queryId: msg.queryId}.toCell()}); if (msg.responseDestination != newAddress(0,0)) { send(SendParameters{to: msg.responseDestination, value: 0, bounce: false, mode: SendRemainingValue | SendIgnoreErrors, body: TokenExcesses{queryId: msg.queryId}.toCell()}); } }
        TokenNotification => { require(msg.amount > 0, "Invalid amount"); let wi = quasarWalletDeployment(myAddress(), myAddress(), quasarWalletCompiledCode()); require(sender() == wi.calculateAddress(), "Invalid token wallet"); let d: int? = self.pendingQsrDeposits.get(msg.from); self.pendingQsrDeposits.set(msg.from, (d == null ? 0 : d!!) + msg.amount); self.custodyBalance += msg.amount; }
        TokenExcesses => { /* TEP-74 wallet excesses are accepted as a no-op. */ }
        FeeTransfer => { self.onFeeTransfer(msg); }
        TriggerBuyback => { self.requireOwner(); self.requireNotPaused(); require(self.buybackEnabled && self.buybackPool >= self.buybackThreshold, "Buyback unavailable"); require(now()-self.lastBuybackTime >= self.buybackCooldown && self.buybackSwapPending == 0, "Buyback pending/cooldown"); require(self.buybackQueries.get(msg.queryId) == null, "Query already used"); self.buybackQueries.set(msg.queryId, true); self.executeBuyback(msg.queryId); }
        CancelBuybackSwap => { self.requireOwner(); require(self.buybackSwapPending > 0 && msg.queryId == self.buybackSwapQueryId, "Unexpected buyback"); require(now()-self.lastBuybackTime >= BUYBACK_CALLBACK_TIMEOUT, "Buyback callback window active"); let amount: int = self.buybackSwapPending; self.buybackSwapPending = 0; self.buybackSwapQueryId = 0; self.buybackSwapDefiAddress = newAddress(0,0); self.emitAdmin("CancelBuybackSwap", msg.queryId, amount); }
        Stake => { self.stake(msg.amount); }
        Unstake => { self.unstake(msg.amount); }
        ClaimRewards => { self.requireNotPaused(); let user: address = sender(); let amount: int = self.calculateRewards(user); require(amount > 0 && self.stakingRewardsPool >= amount, "No rewards"); let s: StakeInfo? = self.stakers.get(user); let prior: int = s == null ? now() : s!!.lastClaim; self.stakingRewardsPool -= amount; if (s != null) { self.stakers.set(user, StakeInfo{amount: s!!.amount, startTime: s!!.startTime, lastClaim: now(), lockEnd: s!!.lockEnd}); } self.sendReserve(user, amount, 3, prior); }
        RegisterReferral => { self.requireNotPaused(); require(self.referralEnabled && msg.referrer != newAddress(0,0) && msg.referrer != sender(), "Invalid referrer"); require(self.referrals.get(sender()) == null, "Already registered"); self.referrals.set(sender(), ReferralInfo{referrer: msg.referrer, totalEarned: 0, totalReferrals: 0}); let r: ReferralInfo? = self.referrals.get(msg.referrer); if (r != null) { self.referrals.set(msg.referrer, ReferralInfo{referrer: r!!.referrer, totalEarned: r!!.totalEarned, totalReferrals: r!!.totalReferrals + 1}); } emit(EventReferralRegistered{user: sender(), referrer: msg.referrer}.toCell()); }
        ClaimReferralRewards => { self.requireNotPaused(); let n: int? = self.pendingReferralRewards.get(sender()); require(n != null && n!! > 0, "No referral rewards"); require(self.reserveBalance-self.poolEncumbrance() >= n!!, "Reserve encumbered"); self.pendingReferralRewards.set(sender(), 0); self.pendingReferralTotal -= n!!; self.sendReserve(sender(), n!!, 4, 0); }
        AddVesting => { self.addVesting(msg); }
        ClaimVested => { self.claimVested(); }
        SetTreasury => { self.requireOwner(); require(!self.aiFullAutonomy && msg.treasury != newAddress(0,0), "AI controls/invalid treasury"); self.treasury = msg.treasury; self.emitAdmin("SetTreasury", 0, 0); }
        SetFeeConfig => { self.proposeFeeConfig(msg); }
        ToggleMinting => { self.requireOwner(); require(!self.aiFullAutonomy, "AI controls"); self.tradingEnabled = msg.enabled; self.emitAdmin("ToggleMinting", msg.enabled ? 1 : 0, 0); }
        SetBuybackConfig => { self.requireOwner(); require(!self.aiFullAutonomy && msg.threshold > 0 && msg.cooldown > 0 && msg.burnPercent > 0 && msg.burnPercent <= 100, "Invalid buyback config"); self.buybackEnabled = msg.enabled; self.buybackThreshold = msg.threshold; self.buybackCooldown = msg.cooldown; self.buybackBurnPercent = msg.burnPercent; self.emitAdmin("SetBuybackConfig", msg.threshold, msg.burnPercent); }
        SetStakingConfig => { self.requireOwner(); require(!self.aiFullAutonomy && msg.apyBps <= 10000 && msg.minStake > 0 && msg.lockPeriod > 0, "Invalid staking config"); self.stakingEnabled = msg.enabled; self.stakingApyBps = msg.apyBps; self.stakingMinStake = msg.minStake; self.stakingLockPeriod = msg.lockPeriod; }
        SetReferralConfig => { self.requireOwner(); require(!self.aiFullAutonomy && msg.rewardBps <= 10000, "Invalid referral config"); self.referralEnabled = msg.enabled; self.referralRewardBps = msg.rewardBps; }
        SetDefiAddress => { self.requireOwner(); self.defiAddress = msg.defiAddress; self.emitAdmin("SetDefiAddress", 0, 0); }
        SetEmergencyGuardian => { self.requireOwner(); require(msg.guardian != newAddress(0,0), "Invalid guardian"); self.emergencyGuardian = msg.guardian; self.emitAdmin("SetEmergencyGuardian", 0, 0); }
        GuardianPause => { require(sender() == self.emergencyGuardian, "Only emergency guardian"); self.emergencyPause = true; self.tradingEnabled = false; emit(EventEmergencyPause{guardian: sender(), paused: true, reason: msg.reason}.toCell()); }
        AIGrantFullAutonomy => { self.requireOwner(); self.aiFullAutonomy = msg.enabled; if (msg.enabled) { self.aiEnabled = true; } }
        AISetOracle => { self.requireOwner(); require(msg.oracleAddress != newAddress(0,0), "Invalid oracle"); if (msg.oracleAddress != self.aiOracle) { self.lastAiQueryId = 0; } self.aiOracle = msg.oracleAddress; self.aiEnabled = true; }
        AIHeartbeat => { require(sender() == self.aiOracle, "Only AI"); self.requireFreshAiQuery(msg.queryId); self.lastHeartbeat = now(); }
        AISetFee => { self.requireAi(); require(msg.feeBps == QUASAR_WALLET_FEE_BPS, "Wallet fee is fixed at 30 bps"); emit(EventAiAction{actionId: 0, actionType: "SetFee", oldValue: self.feeBps, newValue: msg.feeBps}.toCell()); }
        AISetAntiWhale => { self.requireAi(); require(msg.maxTxBps == QUASAR_MAX_TX_BPS && msg.maxWalletBps == QUASAR_MAX_WALLET_BPS && msg.cooldown == QUASAR_TRANSFER_COOLDOWN, "Transfer limits are fixed"); emit(EventAiAction{actionId: 0, actionType: "SetAntiWhale", oldValue: self.maxTxBps, newValue: msg.maxTxBps}.toCell()); }
        AISetTreasuryDirect => { self.aiSetTreasury(msg); }
        AISetBuybackDirect => { self.aiSetBuyback(msg); }
        AIToggleMinting => { self.requireAi(); self.requireAiCooldown(); self.requireFreshAiQuery(msg.queryId); let old: bool = self.tradingEnabled; self.tradingEnabled = msg.enabled; let id: int = self.logAction("ToggleMinting", old ? 1 : 0, msg.enabled ? 1 : 0, msg.reason, true); emit(EventAiAction{actionId:id, actionType:"ToggleMinting", oldValue:old ? 1 : 0, newValue:msg.enabled ? 1 : 0}.toCell()); }
        AIRotateOracle => { self.aiRotate(msg); }
        AIRebalance => { self.aiRebalance(msg); }
        AIPriceSignal => { self.aiPriceSignal(msg); }
        AIAnomalyAlert => { self.aiAnomaly(msg); }
        AIEmergencyPause => { self.aiPause(msg); }
        AIGovernanceProposal => { self.aiProposal(msg); }
        VetoAIAction => { self.veto(msg); }
        ReleaseVeto => { self.releaseVeto(msg.actionId); }
        RefundPendingDeposit => { let d: int? = self.pendingQsrDeposits.get(sender()); require(d != null && d!! > 0, "No pending deposit"); self.pendingQsrDeposits.set(sender(), 0); self.sendCustody(sender(), d!!, 6, 0, 0, 0); }
        GovernanceVote => { self.governanceVote(msg); }
        ProposeOwner => { self.requireOwner(); require(msg.newOwner != newAddress(0,0), "Invalid owner"); self.pendingOwner = msg.newOwner; self.ownerTransferAt = now()+self.ownerTransferDelay; self.emitAdmin("ProposeOwner", self.ownerTransferAt, 0); }
        CancelOwnerTransfer => { self.requireOwner(); self.pendingOwner = newAddress(0,0); self.ownerTransferAt = 0; self.emitAdmin("CancelOwnerTransfer", 0, 0); }
        AcceptOwner => { require(self.pendingOwner != newAddress(0,0) && sender() == self.pendingOwner && now() >= self.ownerTransferAt, "Owner timelock/authorization"); self.owner = self.pendingOwner; self.pendingOwner = newAddress(0,0); self.ownerTransferAt = 0; self.emitAdmin("AcceptOwner", 0, 0); }
        ProposeWalletCode => { self.requireOwner(); require(false, "Wallet code migration unsupported"); }
        ProposeContent => { self.proposeContent(msg); }
        SetAiOracleKey => { self.requireOwner(); require(!self.aiFullAutonomy && msg.publicKey != 0, "AI controls/invalid key"); self.aiOraclePubKey = msg.publicKey; self.emitAdmin("SetAiOracleKey", 0, 0); }
        ClearAiOracleKey => { self.requireOwner(); self.aiOraclePubKey = 0; self.emitAdmin("ClearAiOracleKey", 0, 0); }
        AISignedDecision => { self.signedDecision(msg); }
        BuybackTon => { self.buybackTon(msg); }
        ProvideWalletAddress => { self.provideWalletAddress(msg); }
        PayoutFailed => { let wi = quasarWalletDeployment(myAddress(), myAddress(), quasarWalletCompiledCode()); require(sender() == wi.calculateAddress() && msg.amount > 0, "Invalid payout source"); self.restorePayout(msg.queryId); self.custodyBalance += msg.amount; }
        SweepTON => { self.requireOwner(); require(msg.amount > 0 && msg.amount <= myBalance()-QUASAR_STORAGE_RESERVE, "Invalid sweep"); send(SendParameters{to:self.owner, value:msg.amount, bounce:false, mode:SendPayGasSeparately, body:emptyCell()}); }
        Text("Stop Minting") => { self.requireOwner(); self.mintable = false; }
        Text("Resume Minting") => { self.requireOwner(); require(!self.aiFullAutonomy, "AI controls"); self.mintable = true; }
        Text("Resume") => { self.requireOwner(); self.emergencyPause = false; self.tradingEnabled = true; }
        Text("Toggle AI") => { self.requireOwner(); require(!self.aiFullAutonomy, "Disable autonomy first"); self.aiEnabled = !self.aiEnabled; }
        Text("Claim AI Control") => { self.requireOwner(); require(now()-self.lastHeartbeat > self.heartbeatTimeout, "AI alive"); self.aiEnabled = false; self.aiFullAutonomy = false; if (self.aiOracle != self.owner) { self.lastAiQueryId = 0; } self.aiOracle = self.owner; self.emergencyPause = false; }
        Text("Confirm Fee Config") => { self.confirmFeeConfig(); }
        Text("Cancel Fee Config") => { self.requireOwner(); require(self.pendingFeeConfigAt > 0, "Nothing pending"); self.clearPendingFee(); self.emitAdmin("CancelFeeConfig",0,0); }
        Text("Cancel Wallet Code") => { self.requireOwner(); self.pendingWalletCode = null; self.walletCodeAt = 0; self.emitAdmin("CancelWalletCode",0,0); }
        Text("Apply Wallet Code") => { self.requireOwner(); require(false, "Wallet code migration unsupported"); }
        Text("Cancel Content") => { self.requireOwner(); require(self.pendingContent != null, "Nothing pending"); self.pendingContent = null; self.contentAt = 0; self.emitAdmin("CancelContent",0,0); }
        Text("Apply Content") => { self.applyContent(); }
        OwnerOverride => { self.ownerOverride(msg); }
    }

    // A bounced mint restores supply; every other master-tagged transfer restores
    // its typed entitlement and reserve. Buyback swap bounces restore pool backing.
    bounced(msg: bounced<InternalTransfer>) {
        if (msg.queryId == MINT_QUERY_ID) { require(self.totalSupply >= msg.amount, "Mint supply underflow"); self.totalSupply -= msg.amount; }
        else { if (msg.queryId >= MASTER_TRANSFER_QUERY_PREFIX) { self.restorePayout(msg.queryId); }
            self.reserveBalance += msg.amount;
            if (self.buybackSwapPending > 0 && msg.queryId == self.buybackSwapQueryId) { self.buybackPool += self.buybackSwapPending; self.buybackSwapPending = 0; self.buybackSwapQueryId = 0; self.buybackSwapDefiAddress = newAddress(0,0); }
        }
    }
    bounced(msg: bounced<PoolPayout>) { self.custodyBalance += msg.amount; self.restorePayout(msg.queryId); }

    // TODO(migration): finish the remaining behavior-preserving Tolk port before
    // treating this module as deployable. The dispatch cases below currently
    // reference the source handlers that still need a typed-storage rewrite:
    // fee split/DeFi notification and buyback callback settlement; full stake
    // top-up/unstake lock handling; vesting claims; all reversible AI actions,
    // veto restoration, and bound governance execution; TEP-89 none/workchain
    // response construction; owner override; and fee/content timelock helpers.
    // In particular, do not remove the typed payout ledger, signed decision
    // domain/nonce/expiry checks, or proposal content-hash binding while porting.

    // Getters retain canonical names and value types from the Master ABI.
    get fun get_pending_owner(): address { return self.pendingOwner; }
    get fun get_owner_transfer_at(): int { return self.ownerTransferAt; }
    get fun get_owner_transfer_delay(): int { return self.ownerTransferDelay; }
    get fun get_jetton_data(): JettonData { let wi = quasarWalletDeployment(self.owner, myAddress(), quasarWalletCompiledCode()); return JettonData{totalSupply:self.totalSupply,mintable:self.mintable,adminAddress:self.owner,jettonContent:self.content,jettonWalletCode:quasarWalletCompiledCode()}; }
    get fun get_max_supply(): int { return self.maxSupply; }
    get fun get_reserve_balance(): int { return self.reserveBalance; }
    get fun get_custody_balance(): int { return self.custodyBalance; }
    get fun get_reserve_snapshot(): ReserveSnapshot { return ReserveSnapshot{reserveBalance:self.reserveBalance,freeReserve:self.reserveBalance-self.poolEncumbrance(),buybackPool:self.buybackPool,stakingRewardsPool:self.stakingRewardsPool,referralLiability:self.pendingReferralTotal,custodyBalance:self.custodyBalance,totalStaked:self.totalStaked,totalSupply:self.totalSupply}; }
    get fun get_user_liabilities(user: address): UserLiabilitySnapshot { let d: int?=self.pendingQsrDeposits.get(user); let r: int?=self.pendingReferralRewards.get(user); let s: StakeInfo?=self.stakers.get(user); let v: VestingInfo?=self.vestingSchedules.get(user); return UserLiabilitySnapshot{pendingQsrDeposit:d==null?0:d!!,stakedPrincipal:s==null?0:s!!.amount,pendingReferralReward:r==null?0:r!!,vestedUnclaimed:v==null?0:v!!.totalAmount-v!!.claimed}; }
    get fun get_emergency_guardian(): address { return self.emergencyGuardian; }
    get fun get_ai_oracle_key(): int { return self.aiOraclePubKey; }
    get fun get_ai_nonce(): int { return self.aiNonce; }
    get fun get_ai_signed_decision_count(): int { return self.aiSignedDecisionCount; }
    get fun get_ai_signed_domain(): int { return AI_DECISION_DOMAIN; }
    get fun get_wallet_address(owner: address): address { let wi=quasarWalletDeployment(owner,myAddress(),quasarWalletCompiledCode()); return wi.calculateAddress(); }
    get fun get_ai_state(): AIState { return AIState{oracleAddress:self.aiOracle,aiModeEnabled:self.aiEnabled,fullAutonomy:self.aiFullAutonomy,lastRebalanceAt:self.lastRebalanceTime,totalSignalsReceived:self.signalCount,currentFeeBps:self.feeBps,priceHistoryCount:self.priceHistoryCount,anomalyCount:self.anomalyIndex,lastHeartbeat:self.lastHeartbeat,isAlive:now()-self.lastHeartbeat<=self.heartbeatTimeout,lastQueryId:self.lastAiQueryId}; }
    get fun get_autonomy_state(): AutonomyState { return AutonomyState{fullAutonomyEnabled:self.aiFullAutonomy,aiActionCooldown:self.aiActionCooldown,lastAiActionTime:self.lastAiActionTime,heartbeatTimeout:self.heartbeatTimeout,lastHeartbeat:self.lastHeartbeat,ownerOverrideWindow:self.ownerOverrideWindow,vetoThresholdBps:self.vetoThresholdBps,totalVetoStake:self.totalVetoStake,pendingActions:self.aiActionIndex}; }
    get fun get_fee_config(): FeeConfig { return FeeConfig{feeBps:self.feeBps,burnShare:self.feeBurnShare,treasuryShare:100-self.feeBurnShare,maxTxBps:self.maxTxBps,maxWalletBps:self.maxWalletBps,cooldown:self.cooldownSeconds,totalBurned:self.totalBurned,totalFeesCollected:self.totalFeesCollected}; }
    get fun get_buyback_state(): BuybackState { return BuybackState{enabled:self.buybackEnabled,pool:self.buybackPool,threshold:self.buybackThreshold,cooldown:self.buybackCooldown,burnPercent:self.buybackBurnPercent,buybackSwapPending:self.buybackSwapPending,buybackSwapQueryId:self.buybackSwapQueryId,lastBuybackAt:self.lastBuybackTime,totalBuybacks:self.totalBuybacks,totalQsrBurnedViaBuyback:self.totalQsrBurnedViaBuyback,totalTonSpent:self.totalTonSpentOnBuyback}; }
    get fun get_staking_config(): StakingConfig { return StakingConfig{enabled:self.stakingEnabled,apyBps:self.stakingApyBps,minStake:self.stakingMinStake,lockPeriod:self.stakingLockPeriod,totalStaked:self.totalStaked}; }
    get fun get_stake_info(staker: address): StakeInfo? { return self.stakers.get(staker); }
    get fun get_pending_qsr_deposit(depositor: address): int { let v: int?=self.pendingQsrDeposits.get(depositor); return v==null?0:v!!; }
    get fun get_referral_info(user: address): ReferralInfo? { return self.referrals.get(user); }
    get fun get_pending_referral_reward(user: address): int { let v: int?=self.pendingReferralRewards.get(user); return v==null?0:v!!; }
    get fun get_vesting_info(beneficiary: address): VestingInfo? { return self.vestingSchedules.get(beneficiary); }
    get fun get_ai_action(actionId: int): AIActionLog? { return self.aiActionLog.get(actionId); }
    get fun get_veto_escrow(user: address, actionId: int): int { let v: int?=self.vetoEscrows.get(self.voteKey(user,actionId)); return v==null?0:v!!; }
    get fun get_veto_action_stake(actionId: int): int { let v: int?=self.vetoActionStake.get(actionId); return v==null?0:v!!; }
    get fun get_ai_recommendation(index: int): AIRecommendation? { return self.anomalyLog.get(index); }
    get fun get_price_at(timestamp: int): int? { return self.priceHistory.get(timestamp); }
    get fun is_paused(): bool { return self.emergencyPause; }
    get fun is_trading_enabled(): bool { return self.tradingEnabled; }
    get fun is_ai_alive(): bool { return now()-self.lastHeartbeat<=self.heartbeatTimeout; }
    get fun can_owner_override(actionId: int): bool { let t: int?=self.pendingAiActions.get(actionId); return t!=null && now()-t!!<self.ownerOverrideWindow; }
    get fun get_defi_address(): address { return self.defiAddress; }
    get fun get_defi_fee_share(): int { return self.defiFeeShareBps; }
    get fun get_governance_state(): GovernanceState { return GovernanceState{quorumBps:self.govQuorumBps,totalStaked:self.totalStaked,proposals:self.govProposalCount}; }
    get fun get_proposal_stake(proposalId: int): int { let v: int?=self.govProposalStake.get(proposalId); return v==null?0:v!!; }
    get fun get_pending_fee_config_at(): int { return self.pendingFeeConfigAt; }
    get fun get_pending_wallet_code(): cell? { return self.pendingWalletCode; }
    get fun get_wallet_code_at(): int { return self.walletCodeAt; }
    get fun get_pending_content(): cell? { return self.pendingContent; }
    get fun get_content_at(): int { return self.contentAt; }
}
