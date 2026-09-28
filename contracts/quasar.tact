import "@stdlib/deploy";
import "@stdlib/content";
import "./quasar_common";

// ═══════════════════════════════════════════════════════════════
// QUASAR — The Ultimate Jetton v3.0
// AI Sovereignty | DeFi Sync | 0.30% Fee | Auto-Buyback | Staking | Referral | Vesting
// ═══════════════════════════════════════════════════════════════

// ─── Events ───
message EventMint { amount: Int; receiver: Address }
message EventBurn { amount: Int; burner: Address }
message EventFeeDistributed { totalFee: Int; burn: Int; buyback: Int; staking: Int; referral: Int; treasury: Int; defiPool: Int }
message EventBuybackExecuted { tonSpent: Int; qsrBurned: Int }
message EventBuybackSwapped { queryId: Int as uint64; qsrIn: Int; tonOut: Int }
message(0x2c7e91a4) BuybackTon { queryId: Int as uint64; tonAmount: Int as coins; qsrSwapped: Int as coins }
message EventStake { staker: Address; amount: Int }
message EventUnstake { staker: Address; amount: Int }
message EventReferralRegistered { user: Address; referrer: Address }
message EventVestingClaimed { beneficiary: Address; amount: Int }
message EventAiAction { actionId: Int; actionType: String; oldValue: Int; newValue: Int }
message EventAdminConfig { action: String; actor: Address; valueA: Int; valueB: Int }
message EventEmergencyPause { guardian: Address; paused: Bool; reason: String }

// ─── AI Messages ───
message AISetOracle { oracleAddress: Address }
message AIGrantFullAutonomy { enabled: Bool }
message AIHeartbeat { queryId: Int as uint64; status: String }
message OwnerOverride { actionId: Int as uint64; reason: String }
message AIRebalance { queryId: Int as uint64; targetFeeBps: Int as uint16; targetBurnShare: Int as uint8; recommendation: String }
message AIPriceSignal { queryId: Int as uint64; priceTon: Int as coins; volatility: Int as uint32; sentiment: Int as int8; action: Int as uint8 }
message AIAnomalyAlert { queryId: Int as uint64; severity: Int as uint8; anomalyType: Int as uint8; affectedWallets: Int as uint32; recommendedAction: String }
message AIGovernanceProposal { queryId: Int as uint64; proposalType: Int as uint8; newValue: Int; description: String; confidence: Int as uint8 }
message AISetFee { queryId: Int as uint64; feeBps: Int as uint16; reason: String }
message AISetTreasuryDirect { queryId: Int as uint64; treasury: Address; reason: String }
message AISetAntiWhale { queryId: Int as uint64; maxTxBps: Int as uint16; maxWalletBps: Int as uint16; cooldown: Int as uint16; reason: String }
message AISetBuybackDirect { queryId: Int as uint64; enabled: Bool; threshold: Int as coins; cooldown: Int as uint32; burnPercent: Int as uint8; reason: String }
message AIToggleTrading { queryId: Int as uint64; enabled: Bool; reason: String }
message AIEmergencyPause { queryId: Int as uint64; pause: Bool; severity: Int as uint8; reason: String }
message AIRotateOracle { queryId: Int as uint64; newOracle: Address; reason: String }

// ─── Jetton Messages ───
message(0x642b7d07) Mint { amount: Int as coins; receiver: Address }
// TEP-74 `excesses` message: a receiving wallet returns the unused part of an
// incoming message value with it (opcode 0xd53276db).

// ─── TEP-89 discoverable Jetton wallets ───
// `provide_wallet_address` / `take_wallet_address` are the on-chain discovery
// pair defined by TEP-89. The response keeps the owner address in a ref
// (`owner_address:(Maybe ^MsgAddress)`) exactly as the standard's TL-B schema
// specifies, which is why the field is a `Cell?` rather than an `Address?`
// (Tact would serialise the latter inline, not as a ref).
message(0x2c76b973) ProvideWalletAddress { queryId: Int as uint64; ownerAddress: Address; includeAddress: Bool }
message(0xd1735400) TakeWalletAddress { queryId: Int as uint64; walletAddress: Address; ownerAddress: Cell? }

// ─── Fee & Buyback Messages ───
message SetTreasury { treasury: Address }
message SetFeeConfig { feeBps: Int as uint16; burnShare: Int as uint8; maxTxBps: Int as uint16; maxWalletBps: Int as uint16; cooldown: Int as uint16 }
message ToggleTrading { enabled: Bool }
message TriggerBuyback { queryId: Int as uint64 }
message SetBuybackConfig { enabled: Bool; threshold: Int as coins; cooldown: Int as uint32; burnPercent: Int as uint8 }

// ─── DeFi Sync Messages ───
message SetDefiAddress { defiAddress: Address }
message SetEmergencyGuardian { guardian: Address }
message GuardianPause { reason: String }
message SyncFeeToDefi { amount: Int as coins }

// ─── Staking Messages ───
message Stake { amount: Int as coins }
message Unstake { amount: Int as coins }
message ClaimRewards { }
message SetStakingConfig { enabled: Bool; apyBps: Int as uint16; minStake: Int as coins; lockPeriod: Int as uint32 }

// ─── Referral Messages ───
message RegisterReferral { referrer: Address }
message ClaimReferralRewards { }
message SetReferralConfig { enabled: Bool; rewardBps: Int as uint16 }

// ─── Vesting Messages ───
message AddVesting { beneficiary: Address; totalAmount: Int as coins; cliff: Int as uint32; duration: Int as uint32 }
message ClaimVested { }

// ─── Data Structures ───
struct JettonData { totalSupply: Int; mintable: Bool; adminAddress: Address; jettonContent: Cell; jettonWalletCode: Cell }
struct AIState { oracleAddress: Address; aiModeEnabled: Bool; fullAutonomy: Bool; lastRebalanceAt: Int; totalSignalsReceived: Int; currentFeeBps: Int; priceHistoryCount: Int; anomalyCount: Int; lastHeartbeat: Int; isAlive: Bool; lastQueryId: Int }
struct FeeConfig { feeBps: Int; burnShare: Int; treasuryShare: Int; maxTxBps: Int; maxWalletBps: Int; cooldown: Int; totalBurned: Int; totalFeesCollected: Int }
struct BuybackState { enabled: Bool; pool: Int; threshold: Int; cooldown: Int; burnPercent: Int; buybackSwapPending: Int; buybackSwapQueryId: Int; lastBuybackAt: Int; totalBuybacks: Int; totalQsrBurnedViaBuyback: Int; totalTonSpent: Int }
struct AutonomyState { fullAutonomyEnabled: Bool; aiActionCooldown: Int; lastAiActionTime: Int; heartbeatTimeout: Int; lastHeartbeat: Int; ownerOverrideWindow: Int; vetoThresholdBps: Int; totalVetoStake: Int; pendingActions: Int }
struct AIActionLog { actionId: Int; timestamp: Int; actionType: String; oldValue: Int; newValue: Int; reason: String; executed: Bool; vetoed: Bool; overridden: Bool }
struct AIRecommendation { timestamp: Int; action: String; confidence: Int; executed: Bool }

// Staking
struct StakeInfo { amount: Int; startTime: Int; lastClaim: Int; lockEnd: Int }
struct StakingConfig { enabled: Bool; apyBps: Int; minStake: Int; lockPeriod: Int; totalStaked: Int }

// Referral
struct ReferralInfo { referrer: Address; totalEarned: Int; totalReferrals: Int }
struct ReferralConfig { enabled: Bool; rewardBps: Int }

// Vesting
struct VestingInfo { totalAmount: Int; claimed: Int; startTime: Int; cliff: Int; duration: Int }
struct ReserveSnapshot { reserveBalance: Int; freeReserve: Int; buybackPool: Int; stakingRewardsPool: Int; referralLiability: Int; custodyBalance: Int; totalStaked: Int; totalSupply: Int }
struct UserLiabilitySnapshot { pendingQsrDeposit: Int; stakedPrincipal: Int; pendingReferralReward: Int; vestedUnclaimed: Int }
// H-02: a bounced user payout must restore the exact pre-operation state.
struct PendingMasterPayout { kind: Int; beneficiary: Address; amount: Int; d1: Int; d2: Int; d3: Int }

// ═══════════════════════════════════════════════════════════════
// QUASAR MASTER
// ═══════════════════════════════════════════════════════════════

contract QuasarMaster with Deployable {
    
    // Core
    totalSupply: Int as coins;
    // Hard cap: 1,000,000,000 QSR with 9 decimals.
    maxSupply: Int as coins;
    mintable: Bool;
    owner: Address;
    // Two-step ownership transfer with a timelock (F-08): a proposed owner
    // must wait before accepting, so a single compromised key cannot rotate
    // control instantly.
    pendingOwner: Address;
    ownerTransferAt: Int;
    ownerTransferDelay: Int as uint32;
    content: Cell;
    walletCode: Cell;
    reserveBalance: Int as coins;
    // QSR deposited into the master wallet for staking/vesting custody.
    custodyBalance: Int as coins;
    custodyPayoutSeq: Int as uint64;
    
    // Fee
    feeBps: Int as uint16;
    feeBurnShare: Int as uint8;
    treasury: Address;
    totalBurned: Int as coins;
    totalFeesCollected: Int as coins;
    maxTxBps: Int as uint16;
    maxWalletBps: Int as uint16;
    cooldownSeconds: Int as uint16;
    tradingEnabled: Bool;
    
    // Buyback
    buybackEnabled: Bool;
    buybackPool: Int as coins;
    buybackThreshold: Int as coins;
    buybackCooldown: Int as uint32;
    buybackBurnPercent: Int as uint8;
    buybackSwapPending: Int as coins;
    buybackSwapQueryId: Int as uint64;
    buybackQueries: map<Int, Bool>;
    lastBuybackTime: Int;
    totalBuybacks: Int;
    totalQsrBurnedViaBuyback: Int as coins;
    totalTonSpentOnBuyback: Int as coins;
    
    // AI
    aiOracle: Address;
    aiEnabled: Bool;
    aiFullAutonomy: Bool;
    lastRebalanceTime: Int;
    signalCount: Int;
    // Number of price samples, kept separate from the aggregate AI signal count.
    priceHistoryCount: Int;
    priceHistory: map<Int, Int>;
    anomalyLog: map<Int, AIRecommendation>;
    anomalyIndex: Int;
    minConfidence: Int as uint8;
    emergencyPause: Bool;
    aiActionCooldown: Int as uint32;
    lastAiActionTime: Int;
    lastAiQueryId: Int as uint64;
    heartbeatTimeout: Int as uint32;
    lastHeartbeat: Int;
    ownerOverrideWindow: Int as uint32;
    vetoThresholdBps: Int as uint16;
    aiActionLog: map<Int, AIActionLog>;
    aiActionIndex: Int;
    pendingAiActions: map<Int, Int>;
    // Previous address for AI actions that move a privileged address, so
    // OwnerOverride can restore it (F-07).
    aiActionOldAddress: map<Int, Address>;
    // Snapshots for reversible AI actions. OwnerOverride must restore the
    // complete pre-action state, not only the field used in the event log.
    aiActionOldFeeBps: map<Int, Int>;
    aiActionOldMintable: map<Int, Int>;
    aiActionOldEmergencyPause: map<Int, Int>;
    aiActionOldTrading: map<Int, Int>;
    aiActionOldBurnShare: map<Int, Int>;
    aiActionOldMaxTxBps: map<Int, Int>;
    aiActionOldMaxWalletBps: map<Int, Int>;
    aiActionOldCooldownSeconds: map<Int, Int>;
    aiActionOldBuybackThreshold: map<Int, Int>;
    aiActionOldBuybackCooldown: map<Int, Int>;
    aiActionOldBuybackBurnPercent: map<Int, Int>;
    totalVetoStake: Int as coins;
    emergencyGuardian: Address;
    
    // Staking
    stakingEnabled: Bool;
    stakingApyBps: Int as uint16;
    stakingMinStake: Int as coins;
    stakingLockPeriod: Int as uint32;
    stakers: map<Address, StakeInfo>;
    totalStaked: Int as coins;
    stakingRewardsPool: Int as coins;
    // QSR sent to the master is held as an unassigned deposit until a
    // staking or vesting operation consumes it.
    pendingQsrDeposits: map<Address, Int>;
    
    // Referral
    referralEnabled: Bool;
    referralRewardBps: Int as uint16;
    referrals: map<Address, ReferralInfo>;
    pendingReferralRewards: map<Address, Int>;
    // Total referral liability must stay reserved across all claimants.
    // Without an aggregate counter, one claimant or a DeFi payout could
    // consume the free reserve backing somebody else's reward.
    pendingReferralTotal: Int as coins;
    
    // Vesting
    vestingEnabled: Bool;
    teamAllocation: Int as coins;
    teamClaimed: Int as coins;
    vestingSchedules: map<Address, VestingInfo>;
    
    // DeFi Sync
    defiAddress: Address;
    defiFeeShareBps: Int as uint16; // Basis points sent to DeFi pool (e.g. 500 = 5%);
    
    // Governance (v5): QSR-stake-weighted voting on AI-oracle settings.
    govQuorumBps: Int as uint16;
    govVotes: map<Int, Bool>;
    govProposalStake: map<Int, Int>;
    govProposalCount: Int;
    // Fee-config timelock (v5): owner changes apply only after an on-chain confirm.
    pendingFee: Int as uint16;
    pendingFeeBurnShare: Int;
    pendingMaxTx: Int as uint16;
    pendingMaxWallet: Int as uint16;
    pendingCooldown: Int as uint16;
    pendingFeeConfigAt: Int;
    // Wallet-code migration (v5): two-step + timelock, mirrors F-08 ownership.
    pendingWalletCode: Cell?;
    walletCodeAt: Int;
    // Jetton metadata (TEP-64): the content cell is part of the init data, so
    // without an explicit setter a typo in the metadata URI would be permanent.
    // Updates mirror the wallet-code migration: propose, wait, then confirm.
    pendingContent: Cell?;
    contentAt: Int;
    // H-02: typed pending-payout ledger so a bounce restores stake, vesting
    // claim, staking reward or referral liability - not only the aggregate
    // custody/reserve counter.
    pendingMasterPayouts: map<Int, PendingMasterPayout>;
    masterPayoutSeq: Int as uint64;
    
    init(owner: Address, content: Cell, walletCode: Cell) {
        self.totalSupply = 0;
        self.maxSupply = ton("1000000000");
        self.mintable = true;
        self.owner = owner;
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
        // 48h timelock before a proposed owner may take control.
        self.ownerTransferDelay = 172800;
        self.content = content;
        self.walletCode = walletCode;
        self.reserveBalance = 0;
        self.custodyBalance = 0;
        self.custodyPayoutSeq = 0;
        
        self.feeBps = 30;
        self.feeBurnShare = 50;
        self.treasury = owner;
        self.totalBurned = 0;
        self.totalFeesCollected = 0;
        self.maxTxBps = 100;
        self.maxWalletBps = 300;
        // The wallet enforces a five-second transfer cooldown. Keep the
        // master configuration aligned with that deployed wallet behavior.
        self.cooldownSeconds = 5;
        self.tradingEnabled = true;
        
        self.buybackEnabled = true;
        self.buybackPool = 0;
        // The buyback pool is accounted in QSR, so the threshold must be
        // QSR-denominated: comparing it against ton("10") mixed units (F-09).
        self.buybackThreshold = 10_000_000_000; // 10 QSR
        self.buybackCooldown = 3600;
        self.buybackBurnPercent = 100;
        self.buybackSwapPending = 0;
        self.buybackSwapQueryId = 0;
        self.buybackQueries = emptyMap();
        self.lastBuybackTime = 0;
        self.totalBuybacks = 0;
        self.totalQsrBurnedViaBuyback = 0;
        self.totalTonSpentOnBuyback = 0;
        
        self.aiOracle = owner;
        self.aiEnabled = false;
        self.aiFullAutonomy = false;
        self.lastRebalanceTime = 0;
        self.signalCount = 0;
        self.priceHistoryCount = 0;
        self.anomalyIndex = 0;
        self.minConfidence = 75;
        self.emergencyPause = false;
        self.aiActionCooldown = 21600;
        // Start the cooldown window at deployment so the first AI action is
        // not blocked by a zero timestamp.
        self.lastAiActionTime = 0;
        self.lastAiQueryId = 0;
        self.heartbeatTimeout = 604800;
        self.lastHeartbeat = now();
        self.ownerOverrideWindow = 86400;
        self.vetoThresholdBps = 1000;
        self.aiActionIndex = 0;
        self.totalVetoStake = 0;
        // The deployer is the initial guardian. The owner can replace it with
        // a separate emergency key before public deployment.
        self.emergencyGuardian = owner;
        
        self.stakingEnabled = true;
        self.stakingApyBps = 2000;
        self.stakingMinStake = ton("100");
        self.stakingLockPeriod = 2592000;
        self.totalStaked = 0;
        self.stakingRewardsPool = 0;
        
        self.referralEnabled = true;
        self.referralRewardBps = 100;
        self.pendingReferralTotal = 0;
        
        self.vestingEnabled = true;
        self.teamAllocation = 0;
        self.teamClaimed = 0;
        
        self.defiAddress = newAddress(0, 0);
        self.defiFeeShareBps = 500; // 5% of fees go to DeFi pool;
        
        // v5 state
        self.govQuorumBps = 1000; // 10% of the staked supply reaches quorum;
        self.govVotes = emptyMap();
        self.govProposalStake = emptyMap();
        self.pendingMasterPayouts = emptyMap();
        self.masterPayoutSeq = 0;
        self.govProposalCount = 0;
        self.pendingFee = 0;
        self.pendingFeeBurnShare = 0;
        self.pendingMaxTx = 0;
        self.pendingMaxWallet = 0;
        self.pendingCooldown = 0;
        self.pendingFeeConfigAt = 0;
        self.pendingWalletCode = null;
        self.walletCodeAt = 0;
        self.pendingContent = null;
        self.contentAt = 0;
    }
    
    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════
    
    fun _requireOwner() { require(sender() == self.owner, "Only owner") }
    // AI messages carry a caller-supplied query id. It must be strictly
    // increasing so a captured AI message can never be replayed twice.
    fun _requireFreshAiQuery(queryId: Int) {
        require(queryId > self.lastAiQueryId, "Stale AI query");
        self.lastAiQueryId = queryId;
    }

    fun _requireAiAccess() { require(sender() == self.aiOracle, "Only AI oracle"); require(self.aiEnabled, "AI disabled") }
    // The administrative cooldown applies in every mode. Tying it to
    // aiFullAutonomy made the documented 6h safeguard inert (F-07).
    fun _requireAiCooldown() { require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI cooldown") }
    fun _requireNotPaused() { require(!self.emergencyPause, "Paused") }
    fun _requireTrading() { require(self.tradingEnabled, "Trading off") }

    // Mint transfers need a distinct query id because a bounced mint has a
    // different accounting consequence from a bounced reserve payout:
    // minting must roll back totalSupply, while a reserve payout must restore
    // reserveBalance. Keep the value outside the normal application-owned
    // query-id space and reject it from every non-mint payout path.
    fun _mintQueryId(): Int { return 18446744073709551615 }
    fun _requireNonMintQueryId(queryId: Int) {
        require(queryId != self._mintQueryId(), "Reserved mint query id")
    }

    // Buyback and staking pools are sub-accounts inside the fee reserve.
    // Treasury and DeFi payouts may only spend the part of the reserve that
    // is not encumbered by these pools.
    fun _poolEncumbrance(): Int {
        return self.buybackPool + self.stakingRewardsPool + self.pendingReferralTotal
    }
    
    fun _logAiAction(actionType: String, oldVal: Int, newVal: Int, reason: String): Int {
        let id: Int = self.aiActionIndex;
        self.aiActionLog.set(id, AIActionLog{ actionId: id, timestamp: now(), actionType: actionType, oldValue: oldVal, newValue: newVal, reason: reason, executed: true, vetoed: false, overridden: false });
        self.pendingAiActions.set(id, now());
        self.aiActionIndex = id + 1;
        self.lastAiActionTime = now();
        return id;
    }
    
    // Market signals change state too, so they must be recorded in the action
    // log (and therefore be vetoable/overridable) without consuming or
    // resetting the administrative cooldown window (F-07).
    fun _logAiActionSilent(actionType: String, oldVal: Int, newVal: Int, reason: String): Int {
        let id: Int = self.aiActionIndex;
        self.aiActionLog.set(id, AIActionLog{ actionId: id, timestamp: now(), actionType: actionType, oldValue: oldVal, newValue: newVal, reason: reason, executed: true, vetoed: false, overridden: false });
        self.pendingAiActions.set(id, now());
        self.aiActionIndex = id + 1;
        return id;
    }
    
    fun _isOwnerOverrideWindow(actionId: Int): Bool {
        let t: Int? = self.pendingAiActions.get(actionId);
        if (t == null) { return false }
        return now() - t!! < self.ownerOverrideWindow;
    }
    
    fun _checkAiAlive(): Bool { return now() - self.lastHeartbeat <= self.heartbeatTimeout }
    
    // Send a standard TEP-74 internal transfer. Minting and reserve payouts
    // use the same wire format, while reserve accounting stays explicit.
    fun _sendInternalTransfer(to: Address, amount: Int, queryId: Int, from: Address) {
        require(amount > 0, "Invalid transfer amount");
        let init: StateInit = initOf QuasarWallet(to, myAddress());
        // Keep token payouts independent from later event messages. A
        // SendRemainingValue payout consumes the whole action balance, so any
        // subsequent send in the same receiver can abort the transaction and
        // roll back the accounting.
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: InternalTransfer{
                queryId: queryId,
                amount: amount,
                from: from,
                responseDestination: myAddress(),
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    fun _mintTokens(to: Address, amount: Int) {
        require(amount > 0, "Invalid transfer amount");
        let init: StateInit = initOf QuasarWallet(to, myAddress());
        // Keep the mint namespace visible at the serialization site: a
        // bounced mint must be distinguishable from every reserve payout.
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: InternalTransfer{
                queryId: self._mintQueryId(),
                amount: amount,
                from: myAddress(),
                responseDestination: myAddress(),
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    fun _sendTokens(to: Address, amount: Int, queryId: Int, from: Address) {
        require(amount > 0, "Invalid transfer amount");
        self._requireNonMintQueryId(queryId);
        require(self.reserveBalance >= amount, "Insufficient QSR reserve");
        self.reserveBalance = self.reserveBalance - amount;
        self._sendInternalTransfer(to, amount, queryId, from);
    }

    // Fee-funded DeFi liquidity is delivered with a notification so the pool
    // can account for the tokens in qsrReserve.
    fun _sendTokensToDefi(amount: Int, queryId: Int) {
        require(amount > 0, "Invalid DeFi transfer amount");
        self._requireNonMintQueryId(queryId);
        require(self.defiAddress != newAddress(0, 0), "DeFi not configured");
        require(self.reserveBalance >= amount, "Insufficient QSR reserve");
        self.reserveBalance = self.reserveBalance - amount;
        let init: StateInit = initOf QuasarWallet(self.defiAddress, myAddress());
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: InternalTransfer{
                queryId: queryId,
                amount: amount,
                from: myAddress(),
                responseDestination: myAddress(),
                forwardTonAmount: ton("0.01"),
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    // L-01: a vote is unique per (voter, proposal). Keying the map only by the
    // voter blocked a staker from ever voting again after their first proposal.
    fun _voteKey(voter: Address, proposalId: Int): Int {
        // Composite 250-bit key: the proposal id occupies the high bits, so two
        // different proposals can never collapse onto one key, while the voter
        // identity fills the low bits.
        return beginCell().storeUint(proposalId, 32).storeAddress(voter).endCell().asSlice().loadUint(250);
    }

    // H-02: register a typed pending payout before dispatch.
    fun _newMasterPayout(kind: Int, beneficiary: Address, amount: Int, d1: Int, d2: Int, d3: Int): Int {
        let id: Int = self.masterPayoutSeq + 1;
        self.masterPayoutSeq = id;
        self.pendingMasterPayouts.set(id, PendingMasterPayout{ kind: kind, beneficiary: beneficiary, amount: amount, d1: d1, d2: d2, d3: d3 });
        return id;
    }

    // H-02: restore the exact pre-operation state for one bounced payout.
    // Idempotent: the record is consumed, so a duplicate failure report cannot
    // double-credit. Returns false when the id is not a tracked payout.
    fun _restoreMasterPayout(payoutId: Int): Bool {
        let op: PendingMasterPayout? = self.pendingMasterPayouts.get(payoutId);
        if (op == null) { return false }
        self.pendingMasterPayouts.set(payoutId, null);
        if (op!!.kind == 1) {
            // Unstake principal: re-credit the stake and the staked total.
            let s: StakeInfo? = self.stakers.get(op!!.beneficiary);
            let base: Int = s == null ? 0 : s!!.amount;
            self.stakers.set(op!!.beneficiary, StakeInfo{ amount: base + op!!.amount, startTime: op!!.d2, lastClaim: op!!.d3, lockEnd: op!!.d1 });
            self.totalStaked = self.totalStaked + op!!.amount;
        } else if (op!!.kind == 2) {
            // Vesting claim: revert the claimed counter and the team total.
            let v: VestingInfo? = self.vestingSchedules.get(op!!.beneficiary);
            if (v != null) {
                self.vestingSchedules.set(op!!.beneficiary, VestingInfo{ totalAmount: v!!.totalAmount, claimed: op!!.d1, startTime: v!!.startTime, cliff: v!!.cliff, duration: v!!.duration });
            }
            self.teamClaimed = self.teamClaimed - op!!.amount;
        } else if (op!!.kind == 3) {
            // Staking reward: return the reward to the pool, rewind lastClaim.
            self.stakingRewardsPool = self.stakingRewardsPool + op!!.amount;
            let s: StakeInfo? = self.stakers.get(op!!.beneficiary);
            if (s != null) {
                self.stakers.set(op!!.beneficiary, StakeInfo{ amount: s!!.amount, startTime: s!!.startTime, lastClaim: op!!.d1, lockEnd: s!!.lockEnd });
            }
        } else if (op!!.kind == 4) {
            // Referral reward: restore the user and aggregate liabilities.
            let r: Int? = self.pendingReferralRewards.get(op!!.beneficiary);
            self.pendingReferralRewards.set(op!!.beneficiary, (r == null ? 0 : r!!) + op!!.amount);
            self.pendingReferralTotal = self.pendingReferralTotal + op!!.amount;
        } else {
            require(false, "Unknown payout kind")
        }
        return true;
    }

    // Custodied deposits must leave the master-owned Jetton wallet. The payout
    // id is registered before dispatch so a bounce restores user state (H-02).
    fun _sendCustodiedTokens(to: Address, amount: Int, kind: Int, d1: Int, d2: Int, d3: Int) {
        require(amount > 0, "Invalid custody transfer amount");
        require(self.custodyBalance >= amount, "Insufficient custody balance");
        self.custodyBalance = self.custodyBalance - amount;
        let payoutId: Int = self._newMasterPayout(kind, to, amount, d1, d2, d3);
        let init: StateInit = initOf QuasarWallet(myAddress(), myAddress());
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: PoolPayout{ queryId: payoutId, amount: amount, destination: to }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    // Reserve-backed user payout (staking reward / referral). Registered so the
    // user entitlement survives a bounce instead of only the aggregate reserve.
    fun _sendReservePayout(to: Address, amount: Int, kind: Int, d1: Int) {
        require(amount > 0, "Invalid transfer amount");
        require(self.reserveBalance >= amount, "Insufficient QSR reserve");
        self.reserveBalance = self.reserveBalance - amount;
        let payoutId: Int = self._newMasterPayout(kind, to, amount, d1, 0, 0);
        self._sendInternalTransfer(to, amount, payoutId, myAddress());
    }
    
    // ═══════════════════════════════════════════════════════════
    // JETTON CORE
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: Mint) {
        self._requireNotPaused();
        require(msg.amount > 0, "Invalid amount");
        require(msg.receiver != newAddress(0, 0), "Invalid receiver");
        self._requireTrading();
        self._requireOwner();
        require(self.mintable, "Minting off");
        
        let maxTx: Int = self.totalSupply * self.maxTxBps / 10000;
        if (self.totalSupply > 0) { require(msg.amount <= maxTx, "Max tx exceeded") }
        
        require(self.totalSupply + msg.amount <= self.maxSupply, "Max supply exceeded");
        self.totalSupply = self.totalSupply + msg.amount;
        self._mintTokens(msg.receiver, msg.amount);
        
        // The token transfer already consumes the remaining value. Do not
        // queue a second SendRemainingValue action here: that makes the
        // action phase fail with no funds and rolls back the mint.
        emit(EventMint{ amount: msg.amount, receiver: msg.receiver }.toCell());
    }
    
    receive(msg: BurnNotification) {
        require(msg.amount > 0, "Invalid amount");
        require(msg.amount <= self.totalSupply, "Supply underflow");
        let wInit: StateInit = initOf QuasarWallet(msg.sender, myAddress());
        require(sender() == contractAddress(wInit), "Unauthorized burn");
        self.totalSupply = self.totalSupply - msg.amount;
        // The event must not consume the remaining inbound value before the
        // excess refund; the refund is the final action in this receiver.
        emit(EventBurn{ amount: msg.amount, burner: msg.sender }.toCell());
        send(SendParameters{
            to: contractAddress(wInit),
            value: 0,
            bounce: false,
            mode: SendIgnoreErrors,
            body: BurnConfirmed{ queryId: msg.queryId }.toCell()
        });
        if (msg.responseDestination != newAddress(0, 0)) {
            // TEP-74: the burn refund must use the standard `excesses` layout so an
        // integrating wallet can match the refund to the request query id instead of
        // seeing an opaque comment body.
        send(SendParameters{ to: msg.responseDestination, value: 0, bounce: false, mode: SendRemainingValue | SendIgnoreErrors, body: TokenExcesses{ queryId: msg.queryId }.toCell() });
        }
    }

    // When the wallet rejects an internal transfer, the tokens return to the
    // wallet via its own bounce handler. The master must restore the reserve
    // accounting to stay consistent with the jetton ledger.
    bounced(msg: bounced<InternalTransfer>) {
        if (msg.queryId == self._mintQueryId()) {
            // Minting increased supply before dispatch. A failed wallet credit
            // must undo issuance; it must never manufacture reserve liquidity.
            require(self.totalSupply >= msg.amount, "Mint supply underflow");
            self.totalSupply = self.totalSupply - msg.amount;
        } else {
            // H-02: a bounced reserve payout restores the user entitlement
            // (staking reward pool / referral liability) before the aggregate.
            self._restoreMasterPayout(msg.queryId);
            self.reserveBalance = self.reserveBalance + msg.amount;
            // A bounced buyback swap leg returns its amount to the buyback
            // pool, not to the free reserve.
            if (self.buybackSwapPending > 0 && msg.queryId == self.buybackSwapQueryId) {
                self.buybackPool = self.buybackPool + self.buybackSwapPending;
                self.buybackSwapPending = 0;
            }
        }
    }
    
    // TEP-74: a receiving wallet returns the unused part of the message value as
    // an `excesses` message. Everything this master sends carries
    // responseDestination = master, so the refund arrives here; accept it instead
    // of aborting the transaction as an unmatched message.
    receive(msg: TokenExcesses) {
    }

    // Issuance authority is owner-confirmed: AI risk signals can pause trading
    // and adjust fees, but only this owner-authenticated path can set mintable=false.
    receive("Stop Minting") { self._requireOwner(); self.mintable = false }

    // F-18: issuance is owner-confirmed. AI controls may pause trading and
    // change bounded risk parameters, but cannot mutate `mintable`.
    // Recovery remains owner-only and is refused while AI has full autonomy.
    receive("Resume Minting") {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        self.mintable = true;
    }
    
    // A user funds staking by sending QSR to the master wallet. The
    // subsequent Stake message can only consume a deposit from that wallet.
    receive(msg: TokenNotification) {
        require(msg.amount > 0, "Invalid amount");
        let walletInit: StateInit = initOf QuasarWallet(myAddress(), myAddress());
        require(sender() == contractAddress(walletInit), "Invalid token wallet");

        let pending: Int? = self.pendingQsrDeposits.get(msg.from);
        self.pendingQsrDeposits.set(msg.from, pending == null ? msg.amount : pending!! + msg.amount);
        self.custodyBalance = self.custodyBalance + msg.amount;
    }

    // ═══════════════════════════════════════════════════════════
    // FEE PROCESSING — 0.30% with Buyback + Staking + DeFi
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: FeeTransfer) {
        require(msg.amount > 0, "Invalid amount");
        let wInit: StateInit = initOf QuasarWallet(msg.originalSender, myAddress());
        require(sender() == contractAddress(wInit), "Invalid fee source");

        // P0.2: the fee transfer proves the sending wallet's outbound operation
        // reached the accounting stage, so the source wallet can drop its
        // pending fee/receiver/response records for this query id. The master
        // dispatches a redundant confirmation: the receiving wallet also sends
        // one after a successful credit (quasar_common.tact), and whichever
        // arrives second is a no-op (receiver == null -> return), so the
        // pending state always ends up cleaned. The fee source is
        // authenticated above, so the cleanup is trusted.
        send(SendParameters{
            to: contractAddress(wInit),
            value: ton("0.005"),
            bounce: false,
            mode: SendPayGasSeparately | SendIgnoreErrors,
            body: TransferConfirmed{ queryId: msg.queryId }.toCell()
        });
        
        self.totalFeesCollected = self.totalFeesCollected + msg.amount;
        self.reserveBalance = self.reserveBalance + msg.amount;
        
        let burnAmount: Int = msg.amount * self.feeBurnShare / 100;
        let remaining: Int = msg.amount - burnAmount;
        // Burned fees cannot remain spendable in the fee-backed reserve.
        self.reserveBalance = self.reserveBalance - burnAmount;
        
        // Split remaining: 15% buyback, 10% staking, 5% defi, 70% treasury.
        let buybackAmt: Int = remaining * 15 / 100;
        let stakingAmt: Int = remaining * 10 / 100;
        let defiAmt: Int = remaining * self.defiFeeShareBps / 10000;
        let treasuryAmt: Int = remaining - buybackAmt - stakingAmt - defiAmt;
        
        if (burnAmount > 0) {
            self.totalSupply = self.totalSupply - burnAmount;
            self.totalBurned = self.totalBurned + burnAmount;
        }
        
        if (buybackAmt > 0 && self.buybackEnabled) { self.buybackPool = self.buybackPool + buybackAmt }
        else if (buybackAmt > 0) { treasuryAmt = treasuryAmt + buybackAmt }
        
        if (stakingAmt > 0 && self.stakingEnabled) { self.stakingRewardsPool = self.stakingRewardsPool + stakingAmt }
        else if (stakingAmt > 0) { treasuryAmt = treasuryAmt + stakingAmt }
        
        // Send fee share to DeFi pool
        if (defiAmt > 0 && self.defiAddress != newAddress(0, 0)) {
            self._sendTokensToDefi(defiAmt, msg.queryId);
        } else if (defiAmt > 0) {
            treasuryAmt = treasuryAmt + defiAmt;
        }
        
        // Referral reward: 1% of fee to referrer
        let referralDistributed: Int = 0;
        if (self.referralEnabled) {
            let refInfo: ReferralInfo? = self.referrals.get(msg.originalSender);
            if (refInfo != null) {
                let refReward: Int = msg.amount * self.referralRewardBps / 10000;
                if (refReward > 0 && treasuryAmt >= refReward) {
                    referralDistributed = refReward;
                    treasuryAmt = treasuryAmt - refReward;
                    let referrer: Address = refInfo!!.referrer;
                    let referrerInfo: ReferralInfo? = self.referrals.get(referrer);
                    if (referrerInfo != null) {
                        let existingReferrer: ReferralInfo = referrerInfo!!;
                        self.referrals.set(referrer, ReferralInfo{ referrer: existingReferrer.referrer, totalEarned: existingReferrer.totalEarned + refReward, totalReferrals: existingReferrer.totalReferrals });
                    } else {
                        self.referrals.set(referrer, ReferralInfo{ referrer: newAddress(0, 0), totalEarned: refReward, totalReferrals: 0 });
                    }
                    let pendingReward: Int? = self.pendingReferralRewards.get(referrer);
                    self.pendingReferralRewards.set(referrer, pendingReward == null ? refReward : pendingReward!! + refReward);
                    self.pendingReferralTotal = self.pendingReferralTotal + refReward;
                }
            }
        }
        
        if (treasuryAmt > 0 && self.treasury != newAddress(0, 0)) {
            // Treasury may only spend the unencumbered part of the reserve:
            // pool allocations (buyback/staking) stay fully backed.
            require(self.reserveBalance - self._poolEncumbrance() >= treasuryAmt, "Reserve encumbered");
            self._sendTokens(self.treasury, treasuryAmt, msg.queryId, msg.originalSender);
        }
        
        // Auto-buyback. A pending swap leg owns buybackSwapPending/QueryId;
        // starting another swap here would overwrite the tracking record and
        // desync the reserve accounting when the first proceeds arrive (M-03).
        if (self.buybackEnabled && self.buybackSwapPending == 0 && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {
            self._executeBuyback(msg.queryId);
        }
        
        // Emit fee distribution event
        // FeeTransfer is sent by the sender's Jetton wallet. Emitting the
        // event back to that wallet makes the wallet reject the unknown
        // message (exit 130); send the informational event to the original
        // account instead.
        send(SendParameters{
            to: msg.originalSender,
            value: 0,
            mode: SendRemainingValue | SendIgnoreErrors,
            body: EventFeeDistributed{
                totalFee: msg.amount,
                burn: burnAmount,
                buyback: buybackAmt,
                staking: stakingAmt,
                referral: referralDistributed,
                treasury: treasuryAmt,
                defiPool: defiAmt
            }.toCell()
        });
    }
    
    // ═══════════════════════════════════════════════════════════
    // BUYBACK
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: TriggerBuyback) {
        self._requireNotPaused();
        require(self.buybackEnabled, "Buyback off");
        require(self.buybackPool >= self.buybackThreshold, "Pool low");
        require(now() - self.lastBuybackTime >= self.buybackCooldown, "Cooldown");
        require(self.buybackSwapPending == 0, "Buyback pending");
        require(self.buybackQueries.get(msg.queryId) == null, "Query already used");
        self.buybackQueries.set(msg.queryId, true);
        self._executeBuyback(msg.queryId);
    }
    
    fun _executeBuyback(queryId: Int) {
        let pool: Int = self.buybackPool;
        let burnPart: Int = pool * self.buybackBurnPercent / 100;
        if (burnPart > self.totalSupply) { burnPart = self.totalSupply }
        if (burnPart > self.reserveBalance) { burnPart = self.reserveBalance }
        // F-09: with an AMM configured, the non-burned share is swapped for
        // TON through the real DeFi pool; without one, the whole pool burns.
        // swapPart is derived from the CAPPED burn part so the pool is always
        // fully consumed (burn + swap = pool).
        let swapPart: Int = self.defiAddress == newAddress(0, 0) ? 0 : pool - burnPart;
        if (swapPart > self.reserveBalance - burnPart) { swapPart = self.reserveBalance - burnPart }
        self.buybackPool = pool - burnPart - swapPart;
        if (burnPart > 0) {
            self.totalSupply = self.totalSupply - burnPart;
            self.totalBurned = self.totalBurned + burnPart;
            self.totalQsrBurnedViaBuyback = self.totalQsrBurnedViaBuyback + burnPart;
            self.reserveBalance = self.reserveBalance - burnPart;
        }
        if (swapPart > 0) {
            self._sendBuybackToDefi(swapPart, queryId);
        }
        // This event must be the final SendRemainingValue action. Sending it
        // before the DeFi leg can drain the action balance and abort the swap.
        if (burnPart > 0) {
            // Two SendRemainingValue actions in one transaction zero the remaining
            // inbound value after the first one, so the fee-distribution event that
            // follows a triggered buyback failed with exit code 37 and rolled the
            // whole action phase back. Fund this receipt from the contract balance
            // and leave the single remaining-value slot to the final event of the
            // receiver.
            emit(EventBuybackExecuted{ tonSpent: 0, qsrBurned: burnPart }.toCell());
        }
        self.totalBuybacks = self.totalBuybacks + 1;
        self.lastBuybackTime = now();
    }

    // Swap leg (F-09): the non-burned buyback share is delivered to the DeFi
    // pool as master liquidity carrying the buyback marker in the forward
    // payload. The pool credits the liquidity and executes a real CPMM swap
    // atomically in the same transaction, then returns the TON proceeds via
    // BuybackTon.
    fun _sendBuybackToDefi(amount: Int, queryId: Int) {
        require(amount > 0, "Invalid buyback swap amount");
        require(self.defiAddress != newAddress(0, 0), "DeFi not configured");
        require(self.reserveBalance >= amount, "Insufficient QSR reserve");
        self.reserveBalance = self.reserveBalance - amount;
        self.buybackSwapPending = amount;
        self.buybackSwapQueryId = queryId;
        let markerPayload: Slice = beginCell().storeUint(0x5f4a3b21, 32).endCell().asSlice();
        let init: StateInit = initOf QuasarWallet(self.defiAddress, myAddress());
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.05"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: InternalTransfer{
                queryId: queryId,
                amount: amount,
                from: myAddress(),
                responseDestination: myAddress(),
                forwardTonAmount: ton("0.01"),
                forwardPayload: markerPayload
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }
    
    // ═══════════════════════════════════════════════════════════
    // STAKING
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: Stake) {
        self._requireNotPaused();
        require(self.stakingEnabled, "Staking off");
        require(msg.amount > 0, "Invalid amount");
        require(msg.amount >= self.stakingMinStake, "Below min");
        let depositPending: Int? = self.pendingQsrDeposits.get(sender());
        require(depositPending != null && depositPending!! >= msg.amount, "Deposit QSR first");
        
        let staker: Address = sender();
        let info: StakeInfo? = self.stakers.get(staker);
        let current: Int = 0;
        let priorClaim: Int = info == null ? now() : info!!.lastClaim;
        let lockEnd: Int = now() + self.stakingLockPeriod;
        if (info != null) {
            current = info!!.amount;
            // A top-up must never shorten the existing lock. Inheriting the old
            // lockEnd let a staker top up a tiny amount and then immediately
            // withdraw the whole balance (F-05).
            let extended: Int = now() + self.stakingLockPeriod;
            lockEnd = info!!.lockEnd > extended ? info!!.lockEnd : extended;
        }
        
        // Claim pending rewards first
        let pending: Int = self._calculateRewards(staker);
        require(pending == 0 || self.stakingRewardsPool >= pending, "Rewards pool empty");
        if (pending > 0) {
            self.stakingRewardsPool = self.stakingRewardsPool - pending;
            self._sendReservePayout(staker, pending, 3, priorClaim);
        }
        
        self.stakers.set(staker, StakeInfo{ amount: current + msg.amount, startTime: now(), lastClaim: now(), lockEnd: lockEnd });
        self.totalStaked = self.totalStaked + msg.amount;
        self.pendingQsrDeposits.set(staker, depositPending!! - msg.amount);
        
        emit(EventStake{ staker: staker, amount: msg.amount }.toCell());
    }
    
    receive(msg: Unstake) {
        self._requireNotPaused();
        require(msg.amount > 0, "Invalid amount");
        let staker: Address = sender();
        let info: StakeInfo? = self.stakers.get(staker);
        require(info != null, "No stake");
        let priorClaim: Int = info!!.lastClaim;
        require(info!!.amount >= msg.amount, "Insufficient stake");
        require(now() >= info!!.lockEnd, "Lock active");
        
        // Claim rewards
        let pending: Int = self._calculateRewards(staker);
        require(pending == 0 || self.stakingRewardsPool >= pending, "Rewards pool empty");
        if (pending > 0) {
            self.stakingRewardsPool = self.stakingRewardsPool - pending;
            self._sendReservePayout(staker, pending, 3, priorClaim);
        }
        
        let oldInfo: StakeInfo = info!!;
        let remaining: Int = oldInfo.amount - msg.amount;
        if (remaining > 0) {
            self.stakers.set(staker, StakeInfo{ amount: remaining, startTime: oldInfo.startTime, lastClaim: now(), lockEnd: oldInfo.lockEnd });
        } else {
            self.stakers.set(staker, null);
        }
        self.totalStaked = self.totalStaked - msg.amount;
        self._sendCustodiedTokens(staker, msg.amount, 1, oldInfo.lockEnd, oldInfo.startTime, oldInfo.lastClaim);
        
        emit(EventUnstake{ staker: staker, amount: msg.amount }.toCell());
    }
    
    receive(msg: ClaimRewards) {
        self._requireNotPaused();
        let staker: Address = sender();
        let pending: Int = self._calculateRewards(staker);
        require(pending > 0, "No rewards");
        require(self.stakingRewardsPool >= pending, "Pool empty");
        
        let info: StakeInfo? = self.stakers.get(staker);
        let priorClaim: Int = info == null ? now() : info!!.lastClaim;
        self.stakingRewardsPool = self.stakingRewardsPool - pending;
        if (info != null) {
            self.stakers.set(staker, StakeInfo{ amount: info!!.amount, startTime: info!!.startTime, lastClaim: now(), lockEnd: info!!.lockEnd });
        }
        self._sendReservePayout(staker, pending, 3, priorClaim);
    }
    
    fun _calculateRewards(staker: Address): Int {
        let info: StakeInfo? = self.stakers.get(staker);
        if (info == null) { return 0 }
        let elapsed: Int = now() - info!!.lastClaim;
        let yearly: Int = info!!.amount * self.stakingApyBps / 10000;
        let accrued: Int = yearly * elapsed / 31536000;
        // The advertised APY is a target rate funded by the fee pool, so a claim
        // is capped by what the pool actually holds. With an uncapped accrual a
        // reward could exceed the pool, and Unstake — which settles the reward in
        // the same call — reverted with "Rewards pool empty", locking the
        // principal behind a payout that could never succeed.
        return accrued > self.stakingRewardsPool ? self.stakingRewardsPool : accrued;
    }
    
    receive(msg: SetStakingConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.apyBps <= 10000 && msg.minStake > 0 && msg.lockPeriod > 0, "Invalid staking config");
        self.stakingEnabled = msg.enabled;
        self.stakingApyBps = msg.apyBps;
        self.stakingMinStake = msg.minStake;
        self.stakingLockPeriod = msg.lockPeriod;
    }
    
    // ═══════════════════════════════════════════════════════════
    // REFERRAL
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: RegisterReferral) {
        self._requireNotPaused();
        require(self.referralEnabled, "Referral off");
        require(msg.referrer != newAddress(0, 0), "Invalid referrer");
        require(msg.referrer != sender(), "Self referral");
        let existing: ReferralInfo? = self.referrals.get(sender());
        require(existing == null, "Already registered");
        
        self.referrals.set(sender(), ReferralInfo{ referrer: msg.referrer, totalEarned: 0, totalReferrals: 0 });
        
        let refData: ReferralInfo? = self.referrals.get(msg.referrer);
        if (refData != null) {
            self.referrals.set(msg.referrer, ReferralInfo{ referrer: refData!!.referrer, totalEarned: refData!!.totalEarned, totalReferrals: refData!!.totalReferrals + 1 });
        }
        
        emit(EventReferralRegistered{ user: sender(), referrer: msg.referrer }.toCell());
    }
    
    receive(msg: SetReferralConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.rewardBps <= 10000, "Invalid referral reward");
        self.referralEnabled = msg.enabled;
        self.referralRewardBps = msg.rewardBps;
    }

    receive(msg: ClaimReferralRewards) {
        self._requireNotPaused();
        let claimant: Address = sender();
        let pending: Int? = self.pendingReferralRewards.get(claimant);
        require(pending != null && pending!! > 0, "No referral rewards");
        // F-17: referral rewards are paid out of the fee reserve, which also
        // backs the buyback and staking pools. Without the same
        // free-reserve guard the treasury path uses, a claim could spend
        // encumbered pool backing.
        require(self.reserveBalance - self._poolEncumbrance() >= pending!!, "Reserve encumbered");
        self.pendingReferralRewards.set(claimant, 0);
        self.pendingReferralTotal = self.pendingReferralTotal - pending!!;
        self._sendReservePayout(claimant, pending!!, 4, 0);
    }
    
    // ═══════════════════════════════════════════════════════════
    // VESTING
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AddVesting) {
        self._requireOwner();
        self._requireNotPaused();
        require(msg.totalAmount > 0 && msg.duration > 0 && msg.cliff <= msg.duration, "Invalid vesting");
        require(self.vestingSchedules.get(msg.beneficiary) == null, "Already exists");
        let depositPending: Int? = self.pendingQsrDeposits.get(sender());
        require(depositPending != null && depositPending!! >= msg.totalAmount, "Deposit QSR first");
        self.vestingSchedules.set(msg.beneficiary, VestingInfo{ totalAmount: msg.totalAmount, claimed: 0, startTime: now(), cliff: msg.cliff, duration: msg.duration });
        self.teamAllocation = self.teamAllocation + msg.totalAmount;
        self.pendingQsrDeposits.set(sender(), depositPending!! - msg.totalAmount);
    }
    
    receive(msg: ClaimVested) {
        self._requireNotPaused();
        require(self.vestingEnabled, "Vesting off");
        let beneficiary: Address = sender();
        let info: VestingInfo? = self.vestingSchedules.get(beneficiary);
        require(info != null, "No vesting");
        require(now() >= info!!.startTime + info!!.cliff, "Cliff not reached");
        
        let elapsed: Int = now() - info!!.startTime;
        if (elapsed > info!!.duration) { elapsed = info!!.duration }
        let vested: Int = info!!.totalAmount * elapsed / info!!.duration;
        let claimable: Int = vested - info!!.claimed;
        require(claimable > 0, "Nothing to claim");
        
        let priorClaimed: Int = info!!.claimed;
        self.vestingSchedules.set(beneficiary, VestingInfo{ totalAmount: info!!.totalAmount, claimed: priorClaimed + claimable, startTime: info!!.startTime, cliff: info!!.cliff, duration: info!!.duration });
        self.teamClaimed = self.teamClaimed + claimable;
        self._sendCustodiedTokens(beneficiary, claimable, 2, priorClaimed, 0, 0);
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventVestingClaimed{ beneficiary: beneficiary, amount: claimable }.toCell() });
    }
    
    // ═══════════════════════════════════════════════════════════
    // AI SOVEREIGNTY
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AIGrantFullAutonomy) {
        self._requireOwner();
        self.aiFullAutonomy = msg.enabled;
        if (msg.enabled) { self.aiEnabled = true }
    }
    
    receive(msg: AIHeartbeat) {
        require(sender() == self.aiOracle, "Only AI");
        self._requireFreshAiQuery(msg.queryId);
        self.lastHeartbeat = now();
    }
    
    receive(msg: AIEmergencyPause) {
        self._requireAiAccess();
        self._requireFreshAiQuery(msg.queryId);
        let oldTrading: Bool = self.tradingEnabled;
        let oldPause: Bool = self.emergencyPause;
        let oldFeeBps: Int = self.feeBps;
        let oldBurnShare: Int = self.feeBurnShare;
        if (msg.pause) {
            self.emergencyPause = true;
            self.tradingEnabled = false;
            if (msg.severity == 3) {
                self.feeBps = 100;
                self.feeBurnShare = 90;
            }
        } else {
            require(self.aiFullAutonomy, "No autonomy");
            self.emergencyPause = false;
            self.tradingEnabled = true;
        }
        let id: Int = self._logAiAction("EmergencyPause", oldTrading ? 1 : 0, msg.pause ? 1 : 0, msg.reason);
        self.aiActionOldFeeBps.set(id, oldFeeBps);
        self.aiActionOldBurnShare.set(id, oldBurnShare);
        self.aiActionOldEmergencyPause.set(id, oldPause ? 1 : 0);
        self.aiActionOldTrading.set(id, oldTrading ? 1 : 0);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "EmergencyPause", oldValue: oldTrading ? 1 : 0, newValue: msg.pause ? 1 : 0 }.toCell() });
    }
    
    receive(msg: AISetFee) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        require(msg.feeBps == 30, "Wallet fee is fixed at 30 bps");
        let old: Int = self.feeBps;
        self.feeBps = msg.feeBps;
        let id: Int = self._logAiAction("SetFee", old, msg.feeBps, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "SetFee", oldValue: old, newValue: msg.feeBps }.toCell() });
    }
    
    receive(msg: AISetTreasuryDirect) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        require(msg.treasury != newAddress(0, 0), "Invalid");
        let oldTreasury: Address = self.treasury;
        self.treasury = msg.treasury;
        let id: Int = self._logAiAction("SetTreasury", 0, 1, msg.reason);
        // Keep the previous address so the owner can actually reverse it (F-07).
        self.aiActionOldAddress.set(id, oldTreasury);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "SetTreasury", oldValue: 0, newValue: 1 }.toCell() });
    }
    
    receive(msg: AISetAntiWhale) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        require(msg.maxTxBps == 100 && msg.maxWalletBps == 300 && msg.cooldown == 5, "Transfer limits are fixed");
        let oldMaxTxBps: Int = self.maxTxBps;
        let oldMaxWalletBps: Int = self.maxWalletBps;
        let oldCooldownSeconds: Int = self.cooldownSeconds;
        self.maxTxBps = msg.maxTxBps;
        self.maxWalletBps = msg.maxWalletBps;
        self.cooldownSeconds = msg.cooldown;
        let id: Int = self._logAiAction("SetAntiWhale", oldMaxTxBps, msg.maxTxBps, msg.reason);
        self.aiActionOldMaxTxBps.set(id, oldMaxTxBps);
        self.aiActionOldMaxWalletBps.set(id, oldMaxWalletBps);
        self.aiActionOldCooldownSeconds.set(id, oldCooldownSeconds);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "SetAntiWhale", oldValue: oldMaxTxBps, newValue: msg.maxTxBps }.toCell() });
    }
    
    receive(msg: AISetBuybackDirect) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        require(msg.threshold > 0 && msg.cooldown > 0 && msg.burnPercent > 0 && msg.burnPercent <= 100, "Invalid buyback config");
        let oldEnabled: Bool = self.buybackEnabled;
        let oldThreshold: Int = self.buybackThreshold;
        let oldCooldown: Int = self.buybackCooldown;
        let oldBurnPercent: Int = self.buybackBurnPercent;
        self.buybackEnabled = msg.enabled;
        self.buybackThreshold = msg.threshold;
        self.buybackCooldown = msg.cooldown;
        self.buybackBurnPercent = msg.burnPercent;
        let id: Int = self._logAiAction("SetBuyback", oldEnabled ? 1 : 0, msg.enabled ? 1 : 0, msg.reason);
        self.aiActionOldBuybackThreshold.set(id, oldThreshold);
        self.aiActionOldBuybackCooldown.set(id, oldCooldown);
        self.aiActionOldBuybackBurnPercent.set(id, oldBurnPercent);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "SetBuyback", oldValue: oldEnabled ? 1 : 0, newValue: msg.enabled ? 1 : 0 }.toCell() });
    }
    
    receive(msg: AIToggleTrading) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        let oldTrading: Bool = self.tradingEnabled;
        self.tradingEnabled = msg.enabled;
        let id: Int = self._logAiAction("ToggleTrading", oldTrading ? 1 : 0, msg.enabled ? 1 : 0, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "ToggleTrading", oldValue: oldTrading ? 1 : 0, newValue: msg.enabled ? 1 : 0 }.toCell() });
    }
    
    receive(msg: AIRotateOracle) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        require(self.aiFullAutonomy, "No autonomy");
        require(msg.newOracle != newAddress(0, 0), "Invalid oracle");
        let oldOracle: Address = self.aiOracle;
        self.aiOracle = msg.newOracle;
        let id: Int = self._logAiAction("RotateOracle", 0, 1, msg.reason);
        self.aiActionOldAddress.set(id, oldOracle);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "RotateOracle", oldValue: 0, newValue: 1 }.toCell() });
    }
    
    receive(msg: AISetOracle) {
        self._requireOwner();
        require(msg.oracleAddress != newAddress(0, 0), "Invalid oracle");
        self.aiOracle = msg.oracleAddress;
        self.aiEnabled = true;
    }
    
    receive(msg: AIRebalance) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        require(!self.emergencyPause, "Paused");
        require(msg.targetFeeBps == 30 && msg.targetBurnShare <= 100, "Range");
        let oldBurnShare: Int = self.feeBurnShare;
        let oldFeeBps: Int = self.feeBps;
        self.feeBps = msg.targetFeeBps;
        self.feeBurnShare = msg.targetBurnShare;
        self.lastRebalanceTime = now();
        self.signalCount = self.signalCount + 1;
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.recommendation, confidence: 100, executed: true });
        self.anomalyIndex = self.anomalyIndex + 1;
        let id: Int = self._logAiAction("Rebalance", oldBurnShare, msg.targetBurnShare, msg.recommendation);
        self.aiActionOldFeeBps.set(id, oldFeeBps);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: "Rebalance", oldValue: oldBurnShare, newValue: msg.targetBurnShare }.toCell() });
    }
    
    receive(msg: AIPriceSignal) {
        self._requireAiAccess();
        self._requireFreshAiQuery(msg.queryId);
        // Market data must not consume or reset the administrative cooldown,
        // but every state change it causes has to be logged (F-07).
        let oldBurnShare: Int = self.feeBurnShare;
        let oldFeeBps: Int = self.feeBps;
        let oldPause: Bool = self.emergencyPause;
        let oldTrading: Bool = self.tradingEnabled;
        self.signalCount = self.signalCount + 1;
        self.priceHistory.set(now(), msg.priceTon);
        self.priceHistoryCount = self.priceHistoryCount + 1;
        if (msg.action == 2 && msg.volatility > 5000) {
            self.feeBurnShare = 70;
        }
        if (msg.action == 3 && msg.sentiment > 80) {
            self.feeBurnShare = 40;
            // AI may not re-enable minting after the owner stopped it.
        }
        if (msg.action == 1 && msg.sentiment < -50) {
            // The oracle may recommend a freeze and raise burn pressure, but
            // issuance remains an explicit owner decision.
            self.feeBurnShare = 80;
        }
        // Market data never moves reserve funds. Buybacks remain behind the
        // owner-authenticated TriggerBuyback path so an oracle message cannot
        // spend QSR or route TON without an explicit operator decision.
        if (self.feeBurnShare != oldBurnShare) {
            let id: Int = self._logAiActionSilent("PriceSignal", oldBurnShare, self.feeBurnShare, "price-signal");
            self.aiActionOldFeeBps.set(id, oldFeeBps);
            self.aiActionOldEmergencyPause.set(id, oldPause ? 1 : 0);
            self.aiActionOldTrading.set(id, oldTrading ? 1 : 0);
        }
    }
    
    receive(msg: AIAnomalyAlert) {
        self._requireAiAccess();
        self._requireFreshAiQuery(msg.queryId);
        let oldBurnShare: Int = self.feeBurnShare;
        let oldFeeBps: Int = self.feeBps;
        let oldPause: Bool = self.emergencyPause;
        let oldTrading: Bool = self.tradingEnabled;
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.recommendedAction, confidence: 100, executed: false });
        self.anomalyIndex = self.anomalyIndex + 1;
        if (msg.severity == 3) {
            self.emergencyPause = true;
            self.tradingEnabled = false;
            // Emergency AI handling pauses mint execution through
            // emergencyPause; it does not change the owner-controlled flag.
            self.feeBps = 100;
            self.feeBurnShare = 90;
        } else if (msg.severity == 2) {
            self.feeBurnShare = 60;
        }
        if (self.feeBurnShare != oldBurnShare || self.feeBps != oldFeeBps || self.emergencyPause != oldPause || self.tradingEnabled != oldTrading) {
            let id: Int = self._logAiActionSilent("AnomalyAlert", oldBurnShare, self.feeBurnShare, "anomaly-alert");
            self.aiActionOldFeeBps.set(id, oldFeeBps);
            self.aiActionOldEmergencyPause.set(id, oldPause ? 1 : 0);
            self.aiActionOldTrading.set(id, oldTrading ? 1 : 0);
        }
    }
    
    receive(msg: AIGovernanceProposal) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self._requireFreshAiQuery(msg.queryId);
        self.lastAiActionTime = now();
        require(msg.confidence >= self.minConfidence, "Low confidence");
        self.signalCount = self.signalCount + 1;
        let oldValue: Int = 0;
        let actionType: String = "";
        if (msg.proposalType == 1) {
            require(msg.newValue == 30, "Wallet fee is fixed at 30 bps");
            oldValue = self.feeBps;
            self.feeBps = 30;
            actionType = "GovernanceFee";
        } else if (msg.proposalType == 2) {
            require(msg.newValue >= 0 && msg.newValue <= 100, "Invalid burn share");
            oldValue = self.feeBurnShare;
            self.feeBurnShare = msg.newValue;
            actionType = "GovernanceBurn";
        } else if (msg.proposalType == 4) {
            require(msg.newValue > 0, "Invalid buyback threshold");
            oldValue = self.buybackThreshold;
            self.buybackThreshold = msg.newValue;
            actionType = "GovernanceBuybackThreshold";
        } else {
            require(false, "Unsupported governance proposal");
        }
        let id: Int = self._logAiAction(actionType, oldValue, msg.newValue, msg.description);
        if (msg.proposalType == 1) {
            self.aiActionOldFeeBps.set(id, oldValue);
        } else if (msg.proposalType == 4) {
            self.aiActionOldBuybackThreshold.set(id, oldValue);
        }
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.description, confidence: msg.confidence, executed: true });
        self.anomalyIndex = self.anomalyIndex + 1;
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue | SendIgnoreErrors, body: EventAiAction{ actionId: id, actionType: actionType, oldValue: oldValue, newValue: msg.newValue }.toCell() });
    }
    
    // ═══════════════════════════════════════════════════════════
    // VETO & OVERRIDE
    // ═══════════════════════════════════════════════════════════
    
    // The stake-escrow veto receiver that used to sit here opened with
    // `require(false, "Veto voting disabled...")`, so it could never succeed: it
    // only burned gas and advertised a governance feature this contract does not
    // implement. Vote accounting is therefore removed rather than left as dead
    // code; `OwnerOverride` below is the single, exercised reversal path.

    receive(msg: OwnerOverride) {
        self._requireOwner();
        let action: AIActionLog? = self.aiActionLog.get(msg.actionId);
        require(action != null, "Not found");
        require(self._isOwnerOverrideWindow(msg.actionId), "Window closed");
        require(!(action!!.overridden), "Done");
        
        let act: AIActionLog = action!!;
        self.aiActionLog.set(msg.actionId, AIActionLog{ actionId: act.actionId, timestamp: act.timestamp, actionType: act.actionType, oldValue: act.oldValue, newValue: act.newValue, reason: act.reason, executed: act.executed, vetoed: act.vetoed, overridden: true });
        // Every action type that _logAiAction/_logAiActionSilent can record
        // must be reversible here, otherwise the documented 24h owner window
        // is inert for most AI powers (F-07).
        if (act.actionType == "SetFee") { self.feeBps = act.oldValue }
        else if (act.actionType == "ToggleTrading") { self.tradingEnabled = act.oldValue != 0 }
        else if (act.actionType == "EmergencyPause") {
            let oldBurnShare: Int? = self.aiActionOldBurnShare.get(msg.actionId);
            let oldPause: Int? = self.aiActionOldEmergencyPause.get(msg.actionId);
            let oldTrading: Int? = self.aiActionOldTrading.get(msg.actionId);
            let oldFeeBps: Int? = self.aiActionOldFeeBps.get(msg.actionId);
            self.emergencyPause = oldPause != null && oldPause!! != 0;
            self.tradingEnabled = oldTrading == null ? act.oldValue != 0 : oldTrading!! != 0;
            if (oldFeeBps != null) { self.feeBps = oldFeeBps!! }
            if (oldBurnShare != null) { self.feeBurnShare = oldBurnShare!! }
        }
        else if (act.actionType == "SetAntiWhale") {
            let oldMaxTxBps: Int? = self.aiActionOldMaxTxBps.get(msg.actionId);
            let oldMaxWalletBps: Int? = self.aiActionOldMaxWalletBps.get(msg.actionId);
            let oldCooldownSeconds: Int? = self.aiActionOldCooldownSeconds.get(msg.actionId);
            if (oldMaxTxBps != null) { self.maxTxBps = oldMaxTxBps!! }
            if (oldMaxWalletBps != null) { self.maxWalletBps = oldMaxWalletBps!! }
            if (oldCooldownSeconds != null) { self.cooldownSeconds = oldCooldownSeconds!! }
        }
        else if (act.actionType == "SetTreasury") {
            let prevTreasury: Address? = self.aiActionOldAddress.get(msg.actionId);
            if (prevTreasury != null) { self.treasury = prevTreasury!! }
        }
        else if (act.actionType == "RotateOracle") {
            let prevOracle: Address? = self.aiActionOldAddress.get(msg.actionId);
            if (prevOracle != null) { self.aiOracle = prevOracle!! }
        }
        else if (act.actionType == "SetBuyback") {
            self.buybackEnabled = act.oldValue != 0;
            let oldThreshold: Int? = self.aiActionOldBuybackThreshold.get(msg.actionId);
            let oldCooldown: Int? = self.aiActionOldBuybackCooldown.get(msg.actionId);
            let oldBurnPercent: Int? = self.aiActionOldBuybackBurnPercent.get(msg.actionId);
            if (oldThreshold != null) { self.buybackThreshold = oldThreshold!! }
            if (oldCooldown != null) { self.buybackCooldown = oldCooldown!! }
            if (oldBurnPercent != null) { self.buybackBurnPercent = oldBurnPercent!! }
        }
        else if (act.actionType == "Rebalance") {
            self.feeBurnShare = act.oldValue;
            let oldFeeBps: Int? = self.aiActionOldFeeBps.get(msg.actionId);
            if (oldFeeBps != null) { self.feeBps = oldFeeBps!! }
        }
        else if (act.actionType == "GovernanceFee") {
            self.feeBps = act.oldValue;
        }
        else if (act.actionType == "GovernanceBurn") {
            self.feeBurnShare = act.oldValue;
        }
        else if (act.actionType == "GovernanceBuybackThreshold") {
            let oldThreshold: Int? = self.aiActionOldBuybackThreshold.get(msg.actionId);
            if (oldThreshold != null) { self.buybackThreshold = oldThreshold!! }
        }
        else if (act.actionType == "PriceSignal" || act.actionType == "AnomalyAlert") {
            self.feeBurnShare = act.oldValue;
            let oldFeeBps: Int? = self.aiActionOldFeeBps.get(msg.actionId);
            let oldPause: Int? = self.aiActionOldEmergencyPause.get(msg.actionId);
            let oldTrading: Int? = self.aiActionOldTrading.get(msg.actionId);
            if (oldFeeBps != null) { self.feeBps = oldFeeBps!! }
            if (oldPause != null) { self.emergencyPause = oldPause!! != 0 }
            if (oldTrading != null) { self.tradingEnabled = oldTrading!! != 0 }
        }
    }
    
    receive("Claim AI Control") {
        self._requireOwner();
        require(!self._checkAiAlive(), "AI alive");
        self.aiEnabled = false;
        self.aiFullAutonomy = false;
        self.aiOracle = self.owner;
        self.emergencyPause = false;
    }
    
    // ═══════════════════════════════════════════════════════════
    // GOVERNANCE (v5) — QSR-stake-weighted voting
    // ═══════════════════════════════════════════════════════════
    
    // One wallet votes once per proposal with its currently staked QSR.
    // When the supporting stake reaches govQuorumBps of totalStaked, the
    // proposal executes immediately through the same validated paths and
    // the same reversible action log the AI oracle uses, so OwnerOverride
    // can reverse a governance decision within the usual window.
    receive(msg: GovernanceVote) {
        self._requireNotPaused();
        require(now() <= msg.deadline, "Vote expired");
        let voteKey: Int = self._voteKey(sender(), msg.proposalId);
        require(self.govVotes.get(voteKey) == null, "Already voted");
        let staker: StakeInfo? = self.stakers.get(sender());
        require(staker != null && staker!!.amount > 0, "Stake first");
        
        self.govVotes.set(voteKey, true);
        let prev: Int? = self.govProposalStake.get(msg.proposalId);
        let prevStake: Int = prev == null ? 0 : prev!!;
        if (prev == null) {
            self.govProposalCount = self.govProposalCount + 1;
        }
        let newStake: Int = prevStake + staker!!.amount;
        self.govProposalStake.set(msg.proposalId, newStake);
        
        emit(EventGovernanceVote{ voter: sender(), proposalId: msg.proposalId, weight: staker!!.amount }.toCell());
        
        if (newStake * 10000 >= self.totalStaked * self.govQuorumBps) {
            let id: Int = 0;
            if (msg.kind == 1) {
                require(msg.feeBps == 30, "Range");
                let oldFee: Int = self.feeBps;
                self.feeBps = msg.feeBps;
                id = self._logAiActionSilent("SetFee", oldFee, msg.feeBps, msg.reason);
            } else if (msg.kind == 2) {
                let oldTrading: Int = self.tradingEnabled == true ? 1 : 0;
                self.tradingEnabled = msg.flag;
                id = self._logAiActionSilent("ToggleTrading", oldTrading, msg.flag == true ? 1 : 0, msg.reason);
            } else if (msg.kind == 3) {
                let oldPause: Int = self.emergencyPause == true ? 1 : 0;
                let oldTrading: Int = self.tradingEnabled == true ? 1 : 0;
                let oldFee: Int = self.feeBps;
                self.emergencyPause = msg.flag;
                id = self._logAiActionSilent("EmergencyPause", oldPause, msg.flag == true ? 1 : 0, msg.reason);
                // EmergencyPause overrides read the full snapshot maps (F-07).
                self.aiActionOldEmergencyPause.set(id, oldPause);
                self.aiActionOldTrading.set(id, oldTrading);
                self.aiActionOldFeeBps.set(id, oldFee);
            } else {
                require(false, "Unknown proposal");
            }
            // Quorum satisfied: the tally is consumed so the same proposal
            // cannot re-execute on late votes.
            self.govProposalStake.set(msg.proposalId, 0);
            emit(EventGovernanceExecuted{ proposalId: msg.proposalId, actionId: id }.toCell());
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // DeFi SYNC
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: SetDefiAddress) {
        self._requireOwner();
        // The zero address revokes DeFi access entirely.
        self.defiAddress = msg.defiAddress;
        emit(EventAdminConfig{ action: "SetDefiAddress", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    receive(msg: SetEmergencyGuardian) {
        self._requireOwner();
        require(msg.guardian != newAddress(0, 0), "Invalid guardian");
        self.emergencyGuardian = msg.guardian;
        emit(EventAdminConfig{ action: "SetEmergencyGuardian", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    // The guardian can only enter the emergency state. Recovery and every
    // economic/admin change remain owner-controlled, so a compromised guardian
    // cannot resume trading or redirect funds.
    receive(msg: GuardianPause) {
        require(sender() == self.emergencyGuardian, "Only emergency guardian");
        self.emergencyPause = true;
        self.tradingEnabled = false;
        emit(EventEmergencyPause{ guardian: sender(), paused: true, reason: msg.reason }.toCell());
    }

    // F-09: TON proceeds of the AMM buyback swap. The master forwards the
    // realized value to the treasury and reports the swap. The historical
    // totalTonSpentOnBuyback counter accumulates the TON moved through the
    // buyback swap legs.
    receive(msg: BuybackTon) {
        require(sender() == self.defiAddress, "Only DeFi");
        require(msg.tonAmount > 0, "Invalid amount");
        require(context().value >= msg.tonAmount, "TON not attached");
        require(self.buybackSwapPending > 0, "No buyback pending");
        require(msg.queryId == self.buybackSwapQueryId, "Unexpected buyback");
        require(msg.qsrSwapped == self.buybackSwapPending, "Buyback amount mismatch");
        self.buybackSwapPending = 0;
        self.totalTonSpentOnBuyback = self.totalTonSpentOnBuyback + msg.tonAmount;
        if (self.treasury != newAddress(0, 0)) {
            send(SendParameters{ to: self.treasury, value: msg.tonAmount, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
        }
        emit(EventBuybackSwapped{ queryId: msg.queryId, qsrIn: msg.qsrSwapped, tonOut: msg.tonAmount }.toCell());
    }

    // H-02: a bounced custody payout restores both the custody counter and the
    // originating user state (stake / vesting claim).
    bounced(msg: bounced<PoolPayout>) {
        self.custodyBalance = self.custodyBalance + msg.amount;
        self._restoreMasterPayout(msg.queryId);
    }

    // The source wallet accepted PoolPayout, but its downstream InternalTransfer
    // was rejected. The wallet restores its Jetton balance and reports the
    // logical failure so custody accounting can be restored exactly once.
    receive(msg: PayoutFailed) {
        let wInit: StateInit = initOf QuasarWallet(myAddress(), myAddress());
        require(sender() == contractAddress(wInit), "Invalid payout source");
        require(msg.amount > 0, "Invalid payout amount");
        // H-02: restore the originating user state alongside the custody counter.
        self._restoreMasterPayout(msg.queryId);
        self.custodyBalance = self.custodyBalance + msg.amount;
    }
    
    // ═══════════════════════════════════════════════════════════
    // OWNER ADMIN
    // ═══════════════════════════════════════════════════════════
    
    // ─── OWNERSHIP (two-step + timelock, F-08) ───
    receive(msg: ProposeOwner) {
        self._requireOwner();
        require(msg.newOwner != newAddress(0, 0), "Invalid owner");
        self.pendingOwner = msg.newOwner;
        self.ownerTransferAt = now() + self.ownerTransferDelay;
        emit(EventAdminConfig{ action: "ProposeOwner", actor: sender(), valueA: self.ownerTransferAt, valueB: 0 }.toCell());
    }

    receive(msg: CancelOwnerTransfer) {
        self._requireOwner();
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
        emit(EventAdminConfig{ action: "CancelOwnerTransfer", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    receive(msg: AcceptOwner) {
        require(self.pendingOwner != newAddress(0, 0), "No pending owner");
        require(sender() == self.pendingOwner, "Not pending owner");
        require(now() >= self.ownerTransferAt, "Timelock active");
        self.owner = self.pendingOwner;
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
        emit(EventAdminConfig{ action: "AcceptOwner", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }
    
    // ─── WALLET CODE MIGRATION (v5): two-step + timelock ───
    receive(msg: ProposeWalletCode) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        self.pendingWalletCode = msg.newWalletCode;
        self.walletCodeAt = now() + self.ownerTransferDelay;
        emit(EventAdminConfig{ action: "ProposeWalletCode", actor: sender(), valueA: self.walletCodeAt, valueB: 0 }.toCell());
    }

    receive("Cancel Wallet Code") {
        self._requireOwner();
        self.pendingWalletCode = null;
        self.walletCodeAt = 0;
        emit(EventAdminConfig{ action: "CancelWalletCode", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    // Jetton wallets already derived keep their deployed code; after this
    // confirmation every newly derived wallet uses the migrated code. Existing
    // wallets are reached through TEP-89 discovery plus a migration broadcast.
    receive("Apply Wallet Code") {
        self._requireOwner();
        require(self.pendingWalletCode != null, "Nothing pending");
        require(self.walletCodeAt > 0 && now() >= self.walletCodeAt, "Wallet code timelock active");
        self.walletCode = self.pendingWalletCode!!;
        self.pendingWalletCode = null;
        self.walletCodeAt = 0;
        emit(EventAdminConfig{ action: "ApplyWalletCode", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    // ─── JETTON METADATA (TEP-64): two-step + timelock ───
    // The content cell must keep one of the TEP-64 layouts:
    //   0x01 ++ URI          off-chain content
    //   0x00 ++ dictionary   on-chain content (semi-chain adds a mandatory `uri`)
    // Only the prefix is validated on-chain: an owner-supplied dictionary is
    // intentionally opaque, and decoding it inside the receiver would put an
    // unbounded loop in the message path. scripts/lib/tep64.ts preflights the
    // exact attribute set (name/symbol/decimals/image) before a proposal is
    // broadcast, and tests/tep64_content.test.ts asserts the on-chain round trip.
    receive(msg: ProposeContent) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        self.pendingContent = msg.newContent;
        self.contentAt = now() + self.ownerTransferDelay;
        emit(EventAdminConfig{ action: "ProposeContent", actor: sender(), valueA: self.contentAt, valueB: 0 }.toCell());
    }

    receive("Cancel Content") {
        self._requireOwner();
        require(self.pendingContent != null, "Nothing pending");
        self.pendingContent = null;
        self.contentAt = 0;
        emit(EventAdminConfig{ action: "CancelContent", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    // Applies the staged metadata only after the same 48h delay as the wallet
    // code migration, so a compromised owner key cannot rewrite the jetton
    // metadata in a single transaction.
    receive("Apply Content") {
        self._requireOwner();
        require(self.pendingContent != null, "Nothing pending");
        require(self.contentAt > 0 && now() >= self.contentAt, "Content timelock active");
        self.content = self.pendingContent!!;
        self.pendingContent = null;
        self.contentAt = 0;
        emit(EventAdminConfig{ action: "ApplyContent", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }

    receive(msg: SetTreasury) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.treasury != newAddress(0, 0), "Invalid treasury");
        self.treasury = msg.treasury;
        emit(EventAdminConfig{ action: "SetTreasury", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }
    
    // v5: config changes are staged and apply only after the timelocked
    // "Confirm Fee Config", so a compromised owner key cannot retune the
    // economy in a single transaction.
    receive(msg: SetFeeConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.feeBps == 30 && msg.burnShare <= 100 && msg.maxTxBps == 100 && msg.maxWalletBps == 300 && msg.cooldown == 5, "Only implemented limits are allowed");
        self.pendingFee = msg.feeBps;
        self.pendingFeeBurnShare = msg.burnShare;
        self.pendingMaxTx = msg.maxTxBps;
        self.pendingMaxWallet = msg.maxWalletBps;
        self.pendingCooldown = msg.cooldown;
        self.pendingFeeConfigAt = now() + self.ownerTransferDelay;
        emit(EventAdminConfig{ action: "ProposeFeeConfig", actor: sender(), valueA: msg.feeBps, valueB: msg.burnShare }.toCell());
    }

    receive("Confirm Fee Config") {
        self._requireOwner();
        require(self.pendingFeeConfigAt > 0 && now() >= self.pendingFeeConfigAt, "Fee config timelock active");
        self.feeBps = self.pendingFee;
        self.feeBurnShare = self.pendingFeeBurnShare;
        self.maxTxBps = self.pendingMaxTx;
        self.maxWalletBps = self.pendingMaxWallet;
        self.cooldownSeconds = self.pendingCooldown;
        self.pendingFee = 0;
        self.pendingFeeBurnShare = 0;
        self.pendingMaxTx = 0;
        self.pendingMaxWallet = 0;
        self.pendingCooldown = 0;
        self.pendingFeeConfigAt = 0;
        emit(EventAdminConfig{ action: "ApplyFeeConfig", actor: sender(), valueA: self.feeBps, valueB: self.feeBurnShare }.toCell());
    }

    receive("Cancel Fee Config") {
        self._requireOwner();
        require(self.pendingFeeConfigAt > 0, "Nothing pending");
        self.pendingFee = 0;
        self.pendingFeeBurnShare = 0;
        self.pendingMaxTx = 0;
        self.pendingMaxWallet = 0;
        self.pendingCooldown = 0;
        self.pendingFeeConfigAt = 0;
        emit(EventAdminConfig{ action: "CancelFeeConfig", actor: sender(), valueA: 0, valueB: 0 }.toCell());
    }
    
    receive(msg: ToggleTrading) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        self.tradingEnabled = msg.enabled;
        emit(EventAdminConfig{ action: "ToggleTrading", actor: sender(), valueA: msg.enabled ? 1 : 0, valueB: 0 }.toCell());
    }
    
    receive(msg: SetBuybackConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.threshold > 0 && msg.cooldown > 0 && msg.burnPercent > 0 && msg.burnPercent <= 100, "Invalid buyback config");
        self.buybackEnabled = msg.enabled;
        self.buybackThreshold = msg.threshold;
        self.buybackCooldown = msg.cooldown;
        self.buybackBurnPercent = msg.burnPercent;
        emit(EventAdminConfig{ action: "SetBuybackConfig", actor: sender(), valueA: msg.threshold, valueB: msg.burnPercent }.toCell());
    }
    
    receive("Resume") {
        self._requireOwner();
        self.emergencyPause = false;
        self.tradingEnabled = true;
    }
    
    receive("Toggle AI") {
        self._requireOwner();
        require(!self.aiFullAutonomy, "Disable autonomy first");
        self.aiEnabled = !self.aiEnabled;
    }
    
    // Recover stray TON (overpaid gas etc). QSR funds stay governed by the
    // reserve/custody accounting and can never be swept.
    receive(msg: SweepTON) {
        self._requireOwner();
        require(msg.amount > 0 && msg.amount <= myBalance() - ton("0.05"), "Invalid sweep");
        send(SendParameters{ to: self.owner, value: msg.amount, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
    }
    
    // ═══════════════════════════════════════════════════════════
    // TEP-89 — DISCOVERABLE JETTON WALLETS
    // ═══════════════════════════════════════════════════════════

    receive(msg: ProvideWalletAddress) {
        // TEP-89 requires the caller to attach at least 5,000 gas units plus the
        // forward lump and cell prices (0.0061 TON at the current basechain
        // settings); below that the response cannot be funded at all.
        require(context().value >= ton("0.0061"), "Not enough TON for discovery");
        let init: StateInit = initOf QuasarWallet(msg.ownerAddress, myAddress());
        // `include_address = true` asks the response to echo the owner so the
        // caller can verify the pairing without a second query.
        let owner: Cell? = null;
        if (msg.includeAddress) { owner = beginCell().storeAddress(msg.ownerAddress).endCell() }
        // Mode 64 (carry the remaining inbound value) is the mode the TEP-89
        // reference implementation uses for this response.
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TakeWalletAddress{ queryId: msg.queryId, walletAddress: contractAddress(init), ownerAddress: owner }.toCell()
        });
    }

    // ═══════════════════════════════════════════════════════════
    // GETTERS
    // ═══════════════════════════════════════════════════════════
    
    get fun get_pending_owner(): Address { return self.pendingOwner }
    get fun get_owner_transfer_at(): Int { return self.ownerTransferAt }
    get fun get_owner_transfer_delay(): Int { return self.ownerTransferDelay }
    get fun get_jetton_data(): JettonData {
        return JettonData{ totalSupply: self.totalSupply, mintable: self.mintable, adminAddress: self.owner, jettonContent: self.content, jettonWalletCode: self.walletCode }
    }

    get fun get_max_supply(): Int { return self.maxSupply }
    get fun get_reserve_balance(): Int { return self.reserveBalance }
    get fun get_custody_balance(): Int { return self.custodyBalance }
    get fun get_reserve_snapshot(): ReserveSnapshot {
        return ReserveSnapshot{
            reserveBalance: self.reserveBalance,
            freeReserve: self.reserveBalance - self._poolEncumbrance(),
            buybackPool: self.buybackPool,
            stakingRewardsPool: self.stakingRewardsPool,
            referralLiability: self.pendingReferralTotal,
            custodyBalance: self.custodyBalance,
            totalStaked: self.totalStaked,
            totalSupply: self.totalSupply
        }
    }
    get fun get_user_liabilities(user: Address): UserLiabilitySnapshot {
        let deposit: Int? = self.pendingQsrDeposits.get(user);
        let referral: Int? = self.pendingReferralRewards.get(user);
        let stake: StakeInfo? = self.stakers.get(user);
        let vesting: VestingInfo? = self.vestingSchedules.get(user);
        let unclaimed: Int = vesting == null ? 0 : vesting!!.totalAmount - vesting!!.claimed;
        return UserLiabilitySnapshot{
            pendingQsrDeposit: deposit == null ? 0 : deposit!!,
            stakedPrincipal: stake == null ? 0 : stake!!.amount,
            pendingReferralReward: referral == null ? 0 : referral!!,
            vestedUnclaimed: unclaimed
        }
    }
    get fun get_emergency_guardian(): Address { return self.emergencyGuardian }
    
    get fun get_wallet_address(owner: Address): Address {
        let init: StateInit = initOf QuasarWallet(owner, myAddress());
        return contractAddress(init);
    }
    
    get fun get_ai_state(): AIState {
        return AIState{ oracleAddress: self.aiOracle, aiModeEnabled: self.aiEnabled, fullAutonomy: self.aiFullAutonomy, lastRebalanceAt: self.lastRebalanceTime, totalSignalsReceived: self.signalCount, currentFeeBps: self.feeBps, priceHistoryCount: self.priceHistoryCount, anomalyCount: self.anomalyIndex, lastHeartbeat: self.lastHeartbeat, isAlive: self._checkAiAlive(), lastQueryId: self.lastAiQueryId }
    }
    
    get fun get_autonomy_state(): AutonomyState {
        return AutonomyState{ fullAutonomyEnabled: self.aiFullAutonomy, aiActionCooldown: self.aiActionCooldown, lastAiActionTime: self.lastAiActionTime, heartbeatTimeout: self.heartbeatTimeout, lastHeartbeat: self.lastHeartbeat, ownerOverrideWindow: self.ownerOverrideWindow, vetoThresholdBps: self.vetoThresholdBps, totalVetoStake: self.totalVetoStake, pendingActions: self.aiActionIndex }
    }
    
    get fun get_fee_config(): FeeConfig {
        return FeeConfig{ feeBps: self.feeBps, burnShare: self.feeBurnShare, treasuryShare: 100 - self.feeBurnShare, maxTxBps: self.maxTxBps, maxWalletBps: self.maxWalletBps, cooldown: self.cooldownSeconds, totalBurned: self.totalBurned, totalFeesCollected: self.totalFeesCollected }
    }
    
    get fun get_buyback_state(): BuybackState {
        return BuybackState{ enabled: self.buybackEnabled, pool: self.buybackPool, threshold: self.buybackThreshold, cooldown: self.buybackCooldown, burnPercent: self.buybackBurnPercent, buybackSwapPending: self.buybackSwapPending, buybackSwapQueryId: self.buybackSwapQueryId, lastBuybackAt: self.lastBuybackTime, totalBuybacks: self.totalBuybacks, totalQsrBurnedViaBuyback: self.totalQsrBurnedViaBuyback, totalTonSpent: self.totalTonSpentOnBuyback }
    }
    
    get fun get_staking_config(): StakingConfig {
        return StakingConfig{ enabled: self.stakingEnabled, apyBps: self.stakingApyBps, minStake: self.stakingMinStake, lockPeriod: self.stakingLockPeriod, totalStaked: self.totalStaked }
    }
    
    get fun get_stake_info(staker: Address): StakeInfo? { return self.stakers.get(staker) }
    get fun get_pending_qsr_deposit(depositor: Address): Int {
        let pending: Int? = self.pendingQsrDeposits.get(depositor);
        return pending == null ? 0 : pending!!
    }
    get fun get_referral_info(user: Address): ReferralInfo? { return self.referrals.get(user) }
    get fun get_pending_referral_reward(user: Address): Int {
        let pending: Int? = self.pendingReferralRewards.get(user);
        return pending == null ? 0 : pending!!
    }
    get fun get_vesting_info(beneficiary: Address): VestingInfo? { return self.vestingSchedules.get(beneficiary) }
    
    get fun get_ai_action(actionId: Int): AIActionLog? { return self.aiActionLog.get(actionId) }
    get fun get_ai_recommendation(index: Int): AIRecommendation? { return self.anomalyLog.get(index) }
    get fun get_price_at(timestamp: Int): Int? { return self.priceHistory.get(timestamp) }
    get fun is_paused(): Bool { return self.emergencyPause }
    get fun is_trading_enabled(): Bool { return self.tradingEnabled }
    get fun is_ai_alive(): Bool { return self._checkAiAlive() }
    get fun can_owner_override(actionId: Int): Bool { return self._isOwnerOverrideWindow(actionId) }
    get fun get_defi_address(): Address { return self.defiAddress }
    get fun get_defi_fee_share(): Int { return self.defiFeeShareBps }
    get fun get_governance_state(): GovernanceState {
        return GovernanceState{ quorumBps: self.govQuorumBps, totalStaked: self.totalStaked, proposals: self.govProposalCount }
    }
    get fun get_proposal_stake(proposalId: Int): Int {
        let v: Int? = self.govProposalStake.get(proposalId);
        return v == null ? 0 : v!!;
    }
    get fun get_pending_fee_config_at(): Int { return self.pendingFeeConfigAt }
    get fun get_pending_wallet_code(): Cell? { return self.pendingWalletCode }
    get fun get_wallet_code_at(): Int { return self.walletCodeAt }
    get fun get_pending_content(): Cell? { return self.pendingContent }
    get fun get_content_at(): Int { return self.contentAt }
}

message SweepTON { amount: Int as coins }

// ─── Ownership (two-step + timelock, F-08) ───
message ProposeOwner { newOwner: Address }
message AcceptOwner { }
message CancelOwnerTransfer { }

// ─── Governance (v5): stake-weighted voting on AI-oracle settings ───
message GovernanceVote { proposalId: Int as uint64; kind: Int as uint8; flag: Bool; feeBps: Int as uint16; deadline: Int as uint32; reason: String }
message EventGovernanceVote { voter: Address; proposalId: Int; weight: Int }
message EventGovernanceExecuted { proposalId: Int; actionId: Int }
struct GovernanceState { quorumBps: Int; totalStaked: Int; proposals: Int }

// ─── Wallet-code migration (v5): two-step + timelock ───
message ProposeWalletCode { newWalletCode: Cell }

// ─── Jetton metadata (TEP-64): two-step + timelock ───
message ProposeContent { newContent: Cell }

// ═══════════════════════════════════════════════════════════════
// QUASAR WALLET — Optimized with fee deduction
// ═══════════════════════════════════════════════════════════════


