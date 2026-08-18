import "@stdlib/deploy"
import "@stdlib/content"

// ═══════════════════════════════════════════════════════════════
// QUASAR — The Ultimate Jetton v3.0
// AI Sovereignty | DeFi Sync | 0.30% Fee | Auto-Buyback | Staking | Referral | Vesting | Lottery
// ═══════════════════════════════════════════════════════════════

// ─── Events ───
message EventMint { amount: Int; receiver: Address }
message EventBurn { amount: Int; burner: Address }
message EventFeeDistributed { totalFee: Int; burn: Int; buyback: Int; lottery: Int; staking: Int; referral: Int; treasury: Int; defiPool: Int }
message EventBuybackExecuted { tonSpent: Int; qsrBurned: Int }
message EventLotteryDrawn { round: Int; winner: Address; jackpot: Int }
message EventStake { staker: Address; amount: Int }
message EventUnstake { staker: Address; amount: Int }
message EventReferralRegistered { user: Address; referrer: Address }
message EventVestingClaimed { beneficiary: Address; amount: Int }
message EventAiAction { actionId: Int; actionType: String; oldValue: Int; newValue: Int }

// ─── AI Messages ───
message AISetOracle { oracleAddress: Address }
message AIGrantFullAutonomy { enabled: Bool }
message AIHeartbeat { queryId: Int as uint64; status: String }
message AIVetoVote { actionId: Int as uint64; voter: Address; stake: Int as coins; reason: String }
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
message Mint { amount: Int; receiver: Address }
message BurnNotification { queryId: Int as uint64; amount: Int; sender: Address; responseDestination: Address }
message TokenTransfer { queryId: Int as uint64; amount: Int as coins; destination: Address; responseDestination: Address; customPayload: Cell?; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }
message TokenBurn { queryId: Int as uint64; amount: Int as coins; responseDestination: Address; customPayload: Cell? }
message TokenNotification { queryId: Int as uint64; amount: Int as coins; from: Address; forwardPayload: Slice as remaining }

// ─── Fee & Buyback Messages ───
message FeeTransfer { queryId: Int as uint64; amount: Int as coins; originalSender: Address; originalReceiver: Address }
message SetTreasury { treasury: Address }
message SetFeeConfig { feeBps: Int as uint16; burnShare: Int as uint8; maxTxBps: Int as uint16; maxWalletBps: Int as uint16; cooldown: Int as uint16 }
message ToggleTrading { enabled: Bool }
message TriggerBuyback { queryId: Int as uint64 }
message SetBuybackConfig { enabled: Bool; threshold: Int as coins; cooldown: Int as uint32; burnPercent: Int as uint8 }

// ─── DeFi Sync Messages ───
message SetDefiAddress { defiAddress: Address }
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

// ─── Lottery Messages ───
message TriggerLottery { queryId: Int as uint64 }
message SetLotteryConfig { enabled: Bool; ticketPrice: Int as coins; drawInterval: Int as uint32; jackpotShare: Int as uint8 }

// ─── Data Structures ───
struct JettonData { totalSupply: Int; mintable: Bool; adminAddress: Address; jettonContent: Cell; jettonWalletCode: Cell }
struct JettonWalletData { balance: Int; owner: Address; master: Address; walletCode: Cell }
struct AIState { oracleAddress: Address; aiModeEnabled: Bool; fullAutonomy: Bool; lastRebalanceAt: Int; totalSignalsReceived: Int; currentFeeBps: Int; priceHistoryCount: Int; anomalyCount: Int; lastHeartbeat: Int; isAlive: Bool }
struct FeeConfig { feeBps: Int; burnShare: Int; treasuryShare: Int; maxTxBps: Int; maxWalletBps: Int; cooldown: Int; totalBurned: Int; totalFeesCollected: Int }
struct BuybackState { enabled: Bool; pool: Int; threshold: Int; cooldown: Int; burnPercent: Int; lastBuybackAt: Int; totalBuybacks: Int; totalQsrBurnedViaBuyback: Int; totalTonSpent: Int }
struct AutonomyState { fullAutonomyEnabled: Bool; aiActionCooldown: Int; lastAiActionTime: Int; heartbeatTimeout: Int; lastHeartbeat: Int; ownerOverrideWindow: Int; vetoThresholdBps: Int; totalVetoStake: Int; pendingActions: Int }
struct AIActionLog { actionId: Int; timestamp: Int; actionType: String; oldValue: Int; newValue: Int; reason: String; executed: Bool; vetoed: Bool; overridden: Bool }
struct VetoState { actionId: Int; totalStake: Int; vetoCount: Int; threshold: Int; active: Bool }
struct AIRecommendation { timestamp: Int; action: String; confidence: Int; executed: Bool }

// Staking
struct StakeInfo { amount: Int; startTime: Int; lastClaim: Int; lockEnd: Int }
struct StakingConfig { enabled: Bool; apyBps: Int; minStake: Int; lockPeriod: Int; totalStaked: Int }

// Referral
struct ReferralInfo { referrer: Address; totalEarned: Int; totalReferrals: Int }
struct ReferralConfig { enabled: Bool; rewardBps: Int }

// Vesting
struct VestingInfo { totalAmount: Int; claimed: Int; startTime: Int; cliff: Int; duration: Int }

// Lottery
struct LotteryConfig { enabled: Bool; ticketPrice: Int; drawInterval: Int; jackpotShare: Int; currentRound: Int; lastDraw: Int; totalJackpot: Int }
struct LotteryTicket { round: Int; owner: Address }

// ═══════════════════════════════════════════════════════════════
// QUASAR MASTER
// ═══════════════════════════════════════════════════════════════

contract QuasarMaster with Deployable {
    
    // Core
    totalSupply: Int as coins
    mintable: Bool
    owner: Address
    content: Cell
    walletCode: Cell
    
    // Fee
    feeBps: Int as uint16
    feeBurnShare: Int as uint8
    treasury: Address
    totalBurned: Int as coins
    totalFeesCollected: Int as coins
    maxTxBps: Int as uint16
    maxWalletBps: Int as uint16
    cooldownSeconds: Int as uint16
    tradingEnabled: Bool
    
    // Buyback
    buybackEnabled: Bool
    buybackPool: Int as coins
    buybackThreshold: Int as coins
    buybackCooldown: Int as uint32
    buybackBurnPercent: Int as uint8
    lastBuybackTime: Int
    totalBuybacks: Int
    totalQsrBurnedViaBuyback: Int as coins
    totalTonSpentOnBuyback: Int as coins
    
    // AI
    aiOracle: Address
    aiEnabled: Bool
    aiFullAutonomy: Bool
    lastRebalanceTime: Int
    signalCount: Int
    priceHistory: map<Int, Int>
    anomalyLog: map<Int, AIRecommendation>
    anomalyIndex: Int
    minConfidence: Int as uint8
    emergencyPause: Bool
    aiActionCooldown: Int as uint32
    lastAiActionTime: Int
    heartbeatTimeout: Int as uint32
    lastHeartbeat: Int
    ownerOverrideWindow: Int as uint32
    vetoThresholdBps: Int as uint16
    aiActionLog: map<Int, AIActionLog>
    aiActionIndex: Int
    pendingAiActions: map<Int, Int>
    vetoLog: map<Int, VetoState>
    totalVetoStake: Int as coins
    
    // Staking
    stakingEnabled: Bool
    stakingApyBps: Int as uint16
    stakingMinStake: Int as coins
    stakingLockPeriod: Int as uint32
    stakers: map<Address, StakeInfo>
    totalStaked: Int as coins
    stakingRewardsPool: Int as coins
    
    // Referral
    referralEnabled: Bool
    referralRewardBps: Int as uint16
    referrals: map<Address, ReferralInfo>
    
    // Vesting
    vestingEnabled: Bool
    teamAllocation: Int as coins
    teamClaimed: Int as coins
    vestingSchedules: map<Address, VestingInfo>
    
    // Lottery
    lotteryEnabled: Bool
    lotteryTicketPrice: Int as coins
    lotteryDrawInterval: Int as uint32
    lotteryJackpotShare: Int as uint8
    lotteryRound: Int
    lotteryLastDraw: Int
    lotteryJackpot: Int as coins
    lotteryTickets: map<Int, Address>
    lotteryTicketCount: Int
    lotteryWinners: map<Int, Address>
    
    // DeFi Sync
    defiAddress: Address
    defiFeeShareBps: Int as uint16  // Basis points sent to DeFi pool (e.g. 500 = 5%)
    
    init(owner: Address, content: Cell, walletCode: Cell) {
        self.totalSupply = 0
        self.mintable = true
        self.owner = owner
        self.content = content
        self.walletCode = walletCode
        
        self.feeBps = 30
        self.feeBurnShare = 50
        self.treasury = owner
        self.totalBurned = 0
        self.totalFeesCollected = 0
        self.maxTxBps = 100
        self.maxWalletBps = 300
        self.cooldownSeconds = 15
        self.tradingEnabled = true
        
        self.buybackEnabled = true
        self.buybackPool = 0
        self.buybackThreshold = ton("10")
        self.buybackCooldown = 3600
        self.buybackBurnPercent = 100
        self.lastBuybackTime = 0
        self.totalBuybacks = 0
        self.totalQsrBurnedViaBuyback = 0
        self.totalTonSpentOnBuyback = 0
        
        self.aiOracle = owner
        self.aiEnabled = false
        self.aiFullAutonomy = false
        self.lastRebalanceTime = 0
        self.signalCount = 0
        self.anomalyIndex = 0
        self.minConfidence = 75
        self.emergencyPause = false
        self.aiActionCooldown = 21600
        self.lastAiActionTime = 0
        self.heartbeatTimeout = 604800
        self.lastHeartbeat = now()
        self.ownerOverrideWindow = 86400
        self.vetoThresholdBps = 1000
        self.aiActionIndex = 0
        self.totalVetoStake = 0
        
        self.stakingEnabled = true
        self.stakingApyBps = 2000
        self.stakingMinStake = ton("100")
        self.stakingLockPeriod = 2592000
        self.totalStaked = 0
        self.stakingRewardsPool = 0
        
        self.referralEnabled = true
        self.referralRewardBps = 100
        
        self.vestingEnabled = true
        self.teamAllocation = 0
        self.teamClaimed = 0
        
        self.lotteryEnabled = true
        self.lotteryTicketPrice = ton("1")
        self.lotteryDrawInterval = 86400
        self.lotteryJackpotShare = 50
        self.lotteryRound = 1
        self.lotteryLastDraw = now()
        self.lotteryJackpot = 0
        self.lotteryTicketCount = 0
        
        self.defiAddress = newAddress(0, 0)
        self.defiFeeShareBps = 500  // 5% of fees go to DeFi pool
    }
    
    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════
    
    fun _requireOwner() { require(sender() == self.owner, "Only owner") }
    fun _requireAiAccess() { require(sender() == self.aiOracle, "Only AI oracle"); require(self.aiEnabled, "AI disabled") }
    fun _requireAiCooldown() { if (self.aiFullAutonomy) { require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI cooldown") } }
    fun _requireNotPaused() { require(!self.emergencyPause, "Paused") }
    fun _requireTrading() { require(self.tradingEnabled, "Trading off") }
    
    fun _logAiAction(actionType: String, oldVal: Int, newVal: Int, reason: String): Int {
        let id: Int = self.aiActionIndex
        self.aiActionLog.set(id, AIActionLog{ actionId: id, timestamp: now(), actionType: actionType, oldValue: oldVal, newValue: newVal, reason: reason, executed: true, vetoed: false, overridden: false })
        self.pendingAiActions.set(id, now())
        self.aiActionIndex = id + 1
        self.lastAiActionTime = now()
        return id
    }
    
    fun _isOwnerOverrideWindow(actionId: Int): Bool {
        let t: Int? = self.pendingAiActions.get(actionId)
        if (t == null) { return false }
        return now() - t!! < self.ownerOverrideWindow
    }
    
    fun _checkAiAlive(): Bool { return now() - self.lastHeartbeat <= self.heartbeatTimeout }
    
    // Unified wallet send helper
    fun _sendTokens(to: Address, amount: Int, queryId: Int, from: Address) {
        let init: StateInit = initOf QuasarWallet(to, myAddress())
        send(SendParameters{ to: contractAddress(init), value: 0, bounce: false, mode: SendRemainingValue, body: TokenNotification{ queryId: queryId, amount: amount, from: from, forwardPayload: emptySlice() }.toCell(), code: init.code, data: init.data })
    }
    
    // ═══════════════════════════════════════════════════════════
    // JETTON CORE
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: Mint) {
        self._requireNotPaused()
        self._requireTrading()
        self._requireOwner()
        require(self.mintable, "Minting off")
        
        let maxTx: Int = self.totalSupply * self.maxTxBps / 10000
        if (self.totalSupply > 0) { require(msg.amount <= maxTx, "Max tx exceeded") }
        
        self.totalSupply = self.totalSupply + msg.amount
        self._sendTokens(msg.receiver, msg.amount, 0, self.owner)
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventMint{ amount: msg.amount, receiver: msg.receiver }.toCell() })
    }
    
    receive(msg: BurnNotification) {
        let wInit: StateInit = initOf QuasarWallet(msg.sender, myAddress())
        require(sender() == contractAddress(wInit), "Unauthorized burn")
        self.totalSupply = self.totalSupply - msg.amount
        if (msg.responseDestination != newAddress(0, 0)) {
            send(SendParameters{ to: msg.responseDestination, value: 0, bounce: false, mode: SendRemainingValue, body: "Excess returned".asComment() })
        }
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventBurn{ amount: msg.amount, burner: msg.sender }.toCell() })
    }
    
    receive("Stop Minting") { self._requireOwner(); self.mintable = false }
    
    // ═══════════════════════════════════════════════════════════
    // FEE PROCESSING — 0.30% with Buyback + Lottery + Staking + DeFi
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: FeeTransfer) {
        let wInit: StateInit = initOf QuasarWallet(msg.originalSender, myAddress())
        require(sender() == contractAddress(wInit), "Invalid fee source")
        
        self.totalFeesCollected = self.totalFeesCollected + msg.amount
        
        let burnAmount: Int = msg.amount * self.feeBurnShare / 100
        let remaining: Int = msg.amount - burnAmount
        
        // Split remaining: 15% buyback, 15% lottery, 10% staking, 5% defi, 55% treasury
        let buybackAmt: Int = remaining * 15 / 100
        let lotteryAmt: Int = remaining * 15 / 100
        let stakingAmt: Int = remaining * 10 / 100
        let defiAmt: Int = remaining * self.defiFeeShareBps / 10000
        let treasuryAmt: Int = remaining - buybackAmt - lotteryAmt - stakingAmt - defiAmt
        
        if (burnAmount > 0) {
            self.totalSupply = self.totalSupply - burnAmount
            self.totalBurned = self.totalBurned + burnAmount
        }
        
        if (buybackAmt > 0 && self.buybackEnabled) { self.buybackPool = self.buybackPool + buybackAmt }
        else if (buybackAmt > 0) { treasuryAmt = treasuryAmt + buybackAmt }
        
        if (lotteryAmt > 0 && self.lotteryEnabled) { self.lotteryJackpot = self.lotteryJackpot + lotteryAmt }
        else if (lotteryAmt > 0) { treasuryAmt = treasuryAmt + lotteryAmt }
        
        if (stakingAmt > 0 && self.stakingEnabled) { self.stakingRewardsPool = self.stakingRewardsPool + stakingAmt }
        else if (stakingAmt > 0) { treasuryAmt = treasuryAmt + stakingAmt }
        
        // Send fee share to DeFi pool
        if (defiAmt > 0 && self.defiAddress != newAddress(0, 0)) {
            self._sendTokens(self.defiAddress, defiAmt, msg.queryId, msg.originalSender)
        } else if (defiAmt > 0) {
            treasuryAmt = treasuryAmt + defiAmt
        }
        
        // Referral reward: 1% of fee to referrer
        if (self.referralEnabled) {
            let refInfo: ReferralInfo? = self.referrals.get(msg.originalSender)
            if (refInfo != null) {
                let refReward: Int = msg.amount * self.referralRewardBps / 10000
                if (refReward > 0 && treasuryAmt >= refReward) {
                    treasuryAmt = treasuryAmt - refReward
                    let refEarned: ReferralInfo = refInfo!!
                    self.referrals.set(refInfo!!.referrer, ReferralInfo{ referrer: refEarned.referrer, totalEarned: refEarned.totalEarned + refReward, totalReferrals: refEarned.totalReferrals })
                    self._sendTokens(refInfo!!.referrer, refReward, msg.queryId, msg.originalSender)
                }
            }
        }
        
        if (treasuryAmt > 0 && self.treasury != newAddress(0, 0)) {
            self._sendTokens(self.treasury, treasuryAmt, msg.queryId, msg.originalSender)
        }
        
        // Lottery ticket
        if (self.lotteryEnabled && msg.amount >= self.lotteryTicketPrice) {
            self.lotteryTickets.set(self.lotteryTicketCount, msg.originalSender)
            self.lotteryTicketCount = self.lotteryTicketCount + 1
        }
        
        // Auto-buyback
        if (self.buybackEnabled && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {
            self._executeBuyback(msg.queryId)
        }
        
        // Auto-lottery draw
        if (self.lotteryEnabled && now() - self.lotteryLastDraw >= self.lotteryDrawInterval && self.lotteryTicketCount > 0) {
            self._executeLotteryDraw(msg.queryId)
        }
        
        // Emit fee distribution event
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventFeeDistributed{ totalFee: msg.amount, burn: burnAmount, buyback: buybackAmt, lottery: lotteryAmt, staking: stakingAmt, referral: msg.amount * self.referralRewardBps / 10000, treasury: treasuryAmt, defiPool: defiAmt }.toCell() })
    }
    
    // ═══════════════════════════════════════════════════════════
    // BUYBACK
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: TriggerBuyback) {
        require(self.buybackEnabled, "Buyback off")
        require(self.buybackPool >= self.buybackThreshold, "Pool low")
        require(now() - self.lastBuybackTime >= self.buybackCooldown, "Cooldown")
        self._executeBuyback(msg.queryId)
    }
    
    fun _executeBuyback(queryId: Int) {
        let spend: Int = self.buybackPool
        self.buybackPool = 0
        let qsrBurn: Int = spend * 1000
        if (qsrBurn > self.totalSupply / 100) { qsrBurn = self.totalSupply / 100 }
        if (qsrBurn > 0) {
            self.totalSupply = self.totalSupply - qsrBurn
            self.totalBurned = self.totalBurned + qsrBurn
            self.totalQsrBurnedViaBuyback = self.totalQsrBurnedViaBuyback + qsrBurn
        }
        self.totalTonSpentOnBuyback = self.totalTonSpentOnBuyback + spend
        self.totalBuybacks = self.totalBuybacks + 1
        self.lastBuybackTime = now()
        
        send(SendParameters{ to: self.owner, value: 0, bounce: false, mode: SendRemainingValue, body: EventBuybackExecuted{ tonSpent: spend, qsrBurned: qsrBurn }.toCell() })
    }
    
    // ═══════════════════════════════════════════════════════════
    // STAKING
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: Stake) {
        self._requireNotPaused()
        require(self.stakingEnabled, "Staking off")
        require(msg.amount >= self.stakingMinStake, "Below min")
        
        let staker: Address = sender()
        let info: StakeInfo? = self.stakers.get(staker)
        let current: Int = 0
        let lockEnd: Int = now() + self.stakingLockPeriod
        if (info != null) {
            current = info!!.amount
            lockEnd = info!!.lockEnd
        }
        
        // Claim pending rewards first
        let pending: Int = self._calculateRewards(staker)
        if (pending > 0 && self.stakingRewardsPool >= pending) {
            self.stakingRewardsPool = self.stakingRewardsPool - pending
            self._sendTokens(staker, pending, 0, myAddress())
        }
        
        self.stakers.set(staker, StakeInfo{ amount: current + msg.amount, startTime: now(), lastClaim: now(), lockEnd: lockEnd })
        self.totalStaked = self.totalStaked + msg.amount
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventStake{ staker: staker, amount: msg.amount }.toCell() })
    }
    
    receive(msg: Unstake) {
        let staker: Address = sender()
        let info: StakeInfo? = self.stakers.get(staker)
        require(info != null, "No stake")
        require(info!!.amount >= msg.amount, "Insufficient stake")
        require(now() >= info!!.lockEnd, "Lock active")
        
        // Claim rewards
        let pending: Int = self._calculateRewards(staker)
        if (pending > 0 && self.stakingRewardsPool >= pending) {
            self.stakingRewardsPool = self.stakingRewardsPool - pending
            self._sendTokens(staker, pending, 0, myAddress())
        }
        
        let remaining: Int = info!!.amount - msg.amount
        if (remaining > 0) {
            self.stakers.set(staker, StakeInfo{ amount: remaining, startTime: info!!.startTime, lastClaim: now(), lockEnd: info!!.lockEnd })
        } else {
            self.stakers.set(staker, null)
        }
        self.totalStaked = self.totalStaked - msg.amount
        self._sendTokens(staker, msg.amount, 0, myAddress())
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventUnstake{ staker: staker, amount: msg.amount }.toCell() })
    }
    
    receive(msg: ClaimRewards) {
        let staker: Address = sender()
        let pending: Int = self._calculateRewards(staker)
        require(pending > 0, "No rewards")
        require(self.stakingRewardsPool >= pending, "Pool empty")
        
        self.stakingRewardsPool = self.stakingRewardsPool - pending
        let info: StakeInfo? = self.stakers.get(staker)
        if (info != null) {
            self.stakers.set(staker, StakeInfo{ amount: info!!.amount, startTime: info!!.startTime, lastClaim: now(), lockEnd: info!!.lockEnd })
        }
        self._sendTokens(staker, pending, 0, myAddress())
    }
    
    fun _calculateRewards(staker: Address): Int {
        let info: StakeInfo? = self.stakers.get(staker)
        if (info == null) { return 0 }
        let elapsed: Int = now() - info!!.lastClaim
        let yearly: Int = info!!.amount * self.stakingApyBps / 10000
        let reward: Int = yearly * elapsed / 31536000
        if (reward > self.stakingRewardsPool) { reward = self.stakingRewardsPool }
        return reward
    }
    
    receive(msg: SetStakingConfig) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        self.stakingEnabled = msg.enabled
        self.stakingApyBps = msg.apyBps
        self.stakingMinStake = msg.minStake
        self.stakingLockPeriod = msg.lockPeriod
    }
    
    // ═══════════════════════════════════════════════════════════
    // REFERRAL
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: RegisterReferral) {
        self._requireNotPaused()
        require(self.referralEnabled, "Referral off")
        require(msg.referrer != sender(), "Self referral")
        let existing: ReferralInfo? = self.referrals.get(sender())
        require(existing == null, "Already registered")
        
        self.referrals.set(sender(), ReferralInfo{ referrer: msg.referrer, totalEarned: 0, totalReferrals: 0 })
        
        let refData: ReferralInfo? = self.referrals.get(msg.referrer)
        if (refData != null) {
            self.referrals.set(msg.referrer, ReferralInfo{ referrer: refData!!.referrer, totalEarned: refData!!.totalEarned, totalReferrals: refData!!.totalReferrals + 1 })
        }
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventReferralRegistered{ user: sender(), referrer: msg.referrer }.toCell() })
    }
    
    receive(msg: SetReferralConfig) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        self.referralEnabled = msg.enabled
        self.referralRewardBps = msg.rewardBps
    }
    
    // ═══════════════════════════════════════════════════════════
    // VESTING
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AddVesting) {
        self._requireOwner()
        require(self.vestingSchedules.get(msg.beneficiary) == null, "Already exists")
        self.vestingSchedules.set(msg.beneficiary, VestingInfo{ totalAmount: msg.totalAmount, claimed: 0, startTime: now(), cliff: msg.cliff, duration: msg.duration })
        self.teamAllocation = self.teamAllocation + msg.totalAmount
    }
    
    receive(msg: ClaimVested) {
        let beneficiary: Address = sender()
        let info: VestingInfo? = self.vestingSchedules.get(beneficiary)
        require(info != null, "No vesting")
        require(now() >= info!!.startTime + info!!.cliff, "Cliff not reached")
        
        let elapsed: Int = now() - info!!.startTime
        if (elapsed > info!!.duration) { elapsed = info!!.duration }
        let vested: Int = info!!.totalAmount * elapsed / info!!.duration
        let claimable: Int = vested - info!!.claimed
        require(claimable > 0, "Nothing to claim")
        
        self.vestingSchedules.set(beneficiary, VestingInfo{ totalAmount: info!!.totalAmount, claimed: info!!.claimed + claimable, startTime: info!!.startTime, cliff: info!!.cliff, duration: info!!.duration })
        self.teamClaimed = self.teamClaimed + claimable
        self._sendTokens(beneficiary, claimable, 0, myAddress())
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventVestingClaimed{ beneficiary: beneficiary, amount: claimable }.toCell() })
    }
    
    // ═══════════════════════════════════════════════════════════
    // LOTTERY
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: TriggerLottery) {
        require(self.lotteryEnabled, "Lottery off")
        require(self.lotteryTicketCount > 0, "No tickets")
        require(now() - self.lotteryLastDraw >= self.lotteryDrawInterval, "Too early")
        self._executeLotteryDraw(msg.queryId)
    }
    
    fun _executeLotteryDraw(queryId: Int) {
        if (self.lotteryTicketCount == 0) { return }
        let winnerIndex: Int = now() % self.lotteryTicketCount
        let winner: Address? = self.lotteryTickets.get(winnerIndex)
        if (winner == null) { return }
        
        let jackpot: Int = self.lotteryJackpot * self.lotteryJackpotShare / 100
        self.lotteryJackpot = self.lotteryJackpot - jackpot
        
        self._sendTokens(winner!!, jackpot, queryId, myAddress())
        
        self.lotteryWinners.set(self.lotteryRound, winner!!)
        self.lotteryRound = self.lotteryRound + 1
        self.lotteryLastDraw = now()
        self.lotteryTickets = emptyMap()
        self.lotteryTicketCount = 0
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventLotteryDrawn{ round: self.lotteryRound - 1, winner: winner!!, jackpot: jackpot }.toCell() })
    }
    
    receive(msg: SetLotteryConfig) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        self.lotteryEnabled = msg.enabled
        self.lotteryTicketPrice = msg.ticketPrice
        self.lotteryDrawInterval = msg.drawInterval
        self.lotteryJackpotShare = msg.jackpotShare
    }
    
    // ═══════════════════════════════════════════════════════════
    // AI SOVEREIGNTY
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AIGrantFullAutonomy) {
        self._requireOwner()
        self.aiFullAutonomy = msg.enabled
        if (msg.enabled) { self.aiEnabled = true }
    }
    
    receive(msg: AIHeartbeat) {
        require(sender() == self.aiOracle, "Only AI")
        self.lastHeartbeat = now()
    }
    
    receive(msg: AIEmergencyPause) {
        self._requireAiAccess()
        if (msg.pause) {
            self.emergencyPause = true
            self.tradingEnabled = false
            if (msg.severity == 3) {
                self.mintable = false
                self.feeBps = 100
                self.feeBurnShare = 90
            }
        } else {
            require(self.aiFullAutonomy, "No autonomy")
            self.emergencyPause = false
            self.tradingEnabled = true
        }
        let id: Int = self._logAiAction("EmergencyPause", 0, msg.pause ? 1 : 0, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "EmergencyPause", oldValue: 0, newValue: msg.pause ? 1 : 0 }.toCell() })
    }
    
    receive(msg: AISetFee) {
        self._requireAiAccess()
        self._requireAiCooldown()
        require(msg.feeBps <= 100 && msg.feeBps >= 10, "Fee 0.10%-1.00%")
        let old: Int = self.feeBps
        self.feeBps = msg.feeBps
        let id: Int = self._logAiAction("SetFee", old, msg.feeBps, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetFee", oldValue: old, newValue: msg.feeBps }.toCell() })
    }
    
    receive(msg: AISetTreasuryDirect) {
        self._requireAiAccess()
        self._requireAiCooldown()
        require(msg.treasury != newAddress(0, 0), "Invalid")
        self.treasury = msg.treasury
        let id: Int = self._logAiAction("SetTreasury", 0, 1, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetTreasury", oldValue: 0, newValue: 1 }.toCell() })
    }
    
    receive(msg: AISetAntiWhale) {
        self._requireAiAccess()
        self._requireAiCooldown()
        require(msg.maxTxBps <= 500 && msg.maxWalletBps <= 1000 && msg.cooldown <= 300, "Limits")
        self.maxTxBps = msg.maxTxBps
        self.maxWalletBps = msg.maxWalletBps
        self.cooldownSeconds = msg.cooldown
        let id: Int = self._logAiAction("SetAntiWhale", 0, msg.maxTxBps, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetAntiWhale", oldValue: 0, newValue: msg.maxTxBps }.toCell() })
    }
    
    receive(msg: AISetBuybackDirect) {
        self._requireAiAccess()
        self._requireAiCooldown()
        self.buybackEnabled = msg.enabled
        self.buybackThreshold = msg.threshold
        self.buybackCooldown = msg.cooldown
        self.buybackBurnPercent = msg.burnPercent
        let id: Int = self._logAiAction("SetBuyback", 0, msg.enabled ? 1 : 0, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetBuyback", oldValue: 0, newValue: msg.enabled ? 1 : 0 }.toCell() })
    }
    
    receive(msg: AIToggleTrading) {
        self._requireAiAccess()
        self._requireAiCooldown()
        self.tradingEnabled = msg.enabled
        let id: Int = self._logAiAction("ToggleTrading", 0, msg.enabled ? 1 : 0, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "ToggleTrading", oldValue: 0, newValue: msg.enabled ? 1 : 0 }.toCell() })
    }
    
    receive(msg: AIRotateOracle) {
        self._requireAiAccess()
        self._requireAiCooldown()
        require(self.aiFullAutonomy, "No autonomy")
        self.aiOracle = msg.newOracle
        let id: Int = self._logAiAction("RotateOracle", 0, 1, msg.reason)
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "RotateOracle", oldValue: 0, newValue: 1 }.toCell() })
    }
    
    receive(msg: AISetOracle) {
        self._requireOwner()
        self.aiOracle = msg.oracleAddress
        self.aiEnabled = true
    }
    
    receive(msg: AIRebalance) {
        self._requireAiAccess()
        require(!self.emergencyPause, "Paused")
        require(msg.targetFeeBps >= 10 && msg.targetFeeBps <= 100 && msg.targetBurnShare <= 100, "Range")
        self.feeBps = msg.targetFeeBps
        self.feeBurnShare = msg.targetBurnShare
        self.lastRebalanceTime = now()
        self.signalCount = self.signalCount + 1
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.recommendation, confidence: 100, executed: true })
        self.anomalyIndex = self.anomalyIndex + 1
    }
    
    receive(msg: AIPriceSignal) {
        self._requireAiAccess()
        self.signalCount = self.signalCount + 1
        self.priceHistory.set(now(), msg.priceTon)
        if (msg.action == 2 && msg.volatility > 5000) {
            if (self.feeBps < 50) { self.feeBps = 50 }
            self.feeBurnShare = 70
        }
        if (msg.action == 3 && msg.sentiment > 80) {
            if (self.feeBps > 20) { self.feeBps = 20 }
            self.feeBurnShare = 40
            self.mintable = true
        }
        if (msg.action == 1 && msg.sentiment < -50) {
            self.mintable = false
            self.feeBurnShare = 80
        }
        if (msg.action == 1 && msg.sentiment < -30 && self.buybackEnabled && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {
            self._executeBuyback(msg.queryId)
        }
    }
    
    receive(msg: AIAnomalyAlert) {
        self._requireAiAccess()
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.recommendedAction, confidence: 100, executed: false })
        self.anomalyIndex = self.anomalyIndex + 1
        if (msg.severity == 3) {
            self.emergencyPause = true
            self.tradingEnabled = false
            self.mintable = false
            self.feeBps = 100
            self.feeBurnShare = 90
        } else if (msg.severity == 2) {
            self.feeBps = self.feeBps + 20
            self.feeBurnShare = 60
        }
    }
    
    receive(msg: AIGovernanceProposal) {
        self._requireAiAccess()
        require(msg.confidence >= self.minConfidence, "Low confidence")
        self.signalCount = self.signalCount + 1
        if (msg.proposalType == 1) { self.feeBps = msg.newValue }
        else if (msg.proposalType == 2) { self.feeBurnShare = msg.newValue }
        else if (msg.proposalType == 3) { self.aiOracle = newAddress(0, msg.newValue) }
        else if (msg.proposalType == 4) { self.buybackThreshold = msg.newValue }
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.description, confidence: msg.confidence, executed: true })
        self.anomalyIndex = self.anomalyIndex + 1
    }
    
    // ═══════════════════════════════════════════════════════════
    // VETO & OVERRIDE
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AIVetoVote) {
        let action: AIActionLog? = self.aiActionLog.get(msg.actionId)
        require(action != null, "Not found")
        require(!(action!!.vetoed) && !(action!!.overridden), "Closed")
        require(self._isOwnerOverrideWindow(msg.actionId), "Window closed")
        
        let veto: VetoState? = self.vetoLog.get(msg.actionId)
        let currentStake: Int = 0
        let currentCount: Int = 0
        if (veto != null) { currentStake = veto!!.totalStake; currentCount = veto!!.vetoCount }
        
        let newStake: Int = currentStake + msg.stake
        let threshold: Int = self.totalSupply * self.vetoThresholdBps / 10000
        self.vetoLog.set(msg.actionId, VetoState{ actionId: msg.actionId, totalStake: newStake, vetoCount: currentCount + 1, threshold: threshold, active: newStake < threshold })
        
        if (newStake >= threshold) {
            let act: AIActionLog = action!!
            self.aiActionLog.set(msg.actionId, AIActionLog{ actionId: act.actionId, timestamp: act.timestamp, actionType: act.actionType, oldValue: act.oldValue, newValue: act.newValue, reason: act.reason, executed: act.executed, vetoed: true, overridden: false })
            self.totalVetoStake = self.totalVetoStake + msg.stake
        }
    }
    
    receive(msg: OwnerOverride) {
        self._requireOwner()
        let action: AIActionLog? = self.aiActionLog.get(msg.actionId)
        require(action != null, "Not found")
        require(self._isOwnerOverrideWindow(msg.actionId), "Window closed")
        require(!(action!!.overridden), "Done")
        
        let act: AIActionLog = action!!
        self.aiActionLog.set(msg.actionId, AIActionLog{ actionId: act.actionId, timestamp: act.timestamp, actionType: act.actionType, oldValue: act.oldValue, newValue: act.newValue, reason: act.reason, executed: act.executed, vetoed: act.vetoed, overridden: true })
        if (act.actionType == "SetFee") { self.feeBps = act.oldValue }
        else if (act.actionType == "ToggleTrading") { self.tradingEnabled = act.oldValue != 0 }
    }
    
    receive("Claim AI Control") {
        self._requireOwner()
        require(!self._checkAiAlive(), "AI alive")
        self.aiEnabled = false
        self.aiFullAutonomy = false
        self.aiOracle = self.owner
        self.emergencyPause = false
    }
    
    // ═══════════════════════════════════════════════════════════
    // DeFi SYNC
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: SetDefiAddress) {
        self._requireOwner()
        self.defiAddress = msg.defiAddress
    }
    
    // ═══════════════════════════════════════════════════════════
    // OWNER ADMIN
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: SetTreasury) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        self.treasury = msg.treasury
    }
    
    receive(msg: SetFeeConfig) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        require(msg.feeBps <= 100 && msg.burnShare <= 100 && msg.maxTxBps <= 500 && msg.maxWalletBps <= 1000 && msg.cooldown <= 300, "Limits")
        self.feeBps = msg.feeBps
        self.feeBurnShare = msg.burnShare
        self.maxTxBps = msg.maxTxBps
        self.maxWalletBps = msg.maxWalletBps
        self.cooldownSeconds = msg.cooldown
    }
    
    receive(msg: ToggleTrading) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        self.tradingEnabled = msg.enabled
    }
    
    receive(msg: SetBuybackConfig) {
        self._requireOwner()
        require(!self.aiFullAutonomy, "AI controls")
        self.buybackEnabled = msg.enabled
        self.buybackThreshold = msg.threshold
        self.buybackCooldown = msg.cooldown
        self.buybackBurnPercent = msg.burnPercent
    }
    
    receive("Resume") {
        self._requireOwner()
        self.emergencyPause = false
        self.tradingEnabled = true
    }
    
    receive("Toggle AI") {
        self._requireOwner()
        require(!self.aiFullAutonomy, "Disable autonomy first")
        self.aiEnabled = !self.aiEnabled
    }
    
    // ═══════════════════════════════════════════════════════════
    // GETTERS
    // ═══════════════════════════════════════════════════════════
    
    get fun get_jetton_data(): JettonData {
        return JettonData{ totalSupply: self.totalSupply, mintable: self.mintable, adminAddress: self.owner, jettonContent: self.content, jettonWalletCode: self.walletCode }
    }
    
    get fun get_wallet_address(owner: Address): Address {
        let init: StateInit = initOf QuasarWallet(owner, myAddress())
        return contractAddress(init)
    }
    
    get fun get_ai_state(): AIState {
        return AIState{ oracleAddress: self.aiOracle, aiModeEnabled: self.aiEnabled, fullAutonomy: self.aiFullAutonomy, lastRebalanceAt: self.lastRebalanceTime, totalSignalsReceived: self.signalCount, currentFeeBps: self.feeBps, priceHistoryCount: self.signalCount, anomalyCount: self.anomalyIndex, lastHeartbeat: self.lastHeartbeat, isAlive: self._checkAiAlive() }
    }
    
    get fun get_autonomy_state(): AutonomyState {
        return AutonomyState{ fullAutonomyEnabled: self.aiFullAutonomy, aiActionCooldown: self.aiActionCooldown, lastAiActionTime: self.lastAiActionTime, heartbeatTimeout: self.heartbeatTimeout, lastHeartbeat: self.lastHeartbeat, ownerOverrideWindow: self.ownerOverrideWindow, vetoThresholdBps: self.vetoThresholdBps, totalVetoStake: self.totalVetoStake, pendingActions: self.aiActionIndex }
    }
    
    get fun get_fee_config(): FeeConfig {
        return FeeConfig{ feeBps: self.feeBps, burnShare: self.feeBurnShare, treasuryShare: 100 - self.feeBurnShare, maxTxBps: self.maxTxBps, maxWalletBps: self.maxWalletBps, cooldown: self.cooldownSeconds, totalBurned: self.totalBurned, totalFeesCollected: self.totalFeesCollected }
    }
    
    get fun get_buyback_state(): BuybackState {
        return BuybackState{ enabled: self.buybackEnabled, pool: self.buybackPool, threshold: self.buybackThreshold, cooldown: self.buybackCooldown, burnPercent: self.buybackBurnPercent, lastBuybackAt: self.lastBuybackTime, totalBuybacks: self.totalBuybacks, totalQsrBurnedViaBuyback: self.totalQsrBurnedViaBuyback, totalTonSpent: self.totalTonSpentOnBuyback }
    }
    
    get fun get_staking_config(): StakingConfig {
        return StakingConfig{ enabled: self.stakingEnabled, apyBps: self.stakingApyBps, minStake: self.stakingMinStake, lockPeriod: self.stakingLockPeriod, totalStaked: self.totalStaked }
    }
    
    get fun get_stake_info(staker: Address): StakeInfo? { return self.stakers.get(staker) }
    get fun get_referral_info(user: Address): ReferralInfo? { return self.referrals.get(user) }
    get fun get_vesting_info(beneficiary: Address): VestingInfo? { return self.vestingSchedules.get(beneficiary) }
    
    get fun get_lottery_config(): LotteryConfig {
        return LotteryConfig{ enabled: self.lotteryEnabled, ticketPrice: self.lotteryTicketPrice, drawInterval: self.lotteryDrawInterval, jackpotShare: self.lotteryJackpotShare, currentRound: self.lotteryRound, lastDraw: self.lotteryLastDraw, totalJackpot: self.lotteryJackpot }
    }
    
    get fun get_lottery_winner(round: Int): Address? { return self.lotteryWinners.get(round) }
    get fun get_ai_action(actionId: Int): AIActionLog? { return self.aiActionLog.get(actionId) }
    get fun get_veto_state(actionId: Int): VetoState? { return self.vetoLog.get(actionId) }
    get fun get_ai_recommendation(index: Int): AIRecommendation? { return self.anomalyLog.get(index) }
    get fun get_price_at(timestamp: Int): Int? { return self.priceHistory.get(timestamp) }
    get fun is_paused(): Bool { return self.emergencyPause }
    get fun is_trading_enabled(): Bool { return self.tradingEnabled }
    get fun is_ai_alive(): Bool { return self._checkAiAlive() }
    get fun can_owner_override(actionId: Int): Bool { return self._isOwnerOverrideWindow(actionId) }
    get fun get_defi_address(): Address { return self.defiAddress }
    get fun get_defi_fee_share(): Int { return self.defiFeeShareBps }
}

// ═══════════════════════════════════════════════════════════════
// QUASAR WALLET — Optimized with fee deduction
// ═══════════════════════════════════════════════════════════════

contract QuasarWallet {
    balance: Int as coins
    owner: Address
    master: Address
    lastTxTime: Int
    
    init(owner: Address, master: Address) {
        self.balance = 0
        self.owner = owner
        self.master = master
        self.lastTxTime = 0
    }
    
    receive(msg: TokenNotification) {
        require(sender() == self.master, "Unauthorized")
        self.balance = self.balance + msg.amount
    }
    
    receive(msg: TokenTransfer) {
        require(sender() == self.owner, "Not owner")
        require(self.balance >= msg.amount, "Insufficient")
        require(now() - self.lastTxTime >= 5, "Cooldown")
        self.lastTxTime = now()
        
        let fee: Int = msg.amount * 30 / 10000
        if (fee < 1) { fee = 1 }
        let sendAmount: Int = msg.amount - fee
        self.balance = self.balance - msg.amount
        
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master)
        send(SendParameters{ to: contractAddress(init), value: 0, bounce: true, mode: SendRemainingValue, body: TokenNotification{ queryId: msg.queryId, amount: sendAmount, from: self.owner, forwardPayload: msg.forwardPayload }.toCell(), code: init.code, data: init.data })
        
        if (fee > 0) {
            send(SendParameters{ to: self.master, value: 0, bounce: false, mode: SendRemainingValue, body: FeeTransfer{ queryId: msg.queryId, amount: fee, originalSender: self.owner, originalReceiver: msg.destination }.toCell() })
        }
    }
    
    receive(msg: TokenBurn) {
        require(sender() == self.owner, "Not owner")
        require(self.balance >= msg.amount, "Insufficient")
        self.balance = self.balance - msg.amount
        send(SendParameters{ to: self.master, value: 0, bounce: true, mode: SendRemainingValue, body: BurnNotification{ queryId: msg.queryId, amount: msg.amount, sender: self.owner, responseDestination: msg.responseDestination }.toCell() })
    }
    
    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{ balance: self.balance, owner: self.owner, master: self.master, walletCode: (initOf QuasarWallet(self.owner, self.master)).code }
    }
}
