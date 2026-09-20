import "@stdlib/deploy";
import "@stdlib/content";

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
message(0x642b7d07) Mint { amount: Int as coins; receiver: Address }
message(0x7bdd97de) BurnNotification { queryId: Int as uint64; amount: Int as coins; sender: Address; responseDestination: Address }
message(0x0f8a7ea5) TokenTransfer { queryId: Int as uint64; amount: Int as coins; destination: Address; responseDestination: Address; customPayload: Cell?; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }
message(0x595f07bc) TokenBurn { queryId: Int as uint64; amount: Int as coins; responseDestination: Address; customPayload: Cell? }
message(0x7362d09c) TokenNotification { queryId: Int as uint64; amount: Int as coins; from: Address; forwardPayload: Slice as remaining }
message(0x178d4519) InternalTransfer { queryId: Int as uint64; amount: Int as coins; from: Address; responseDestination: Address; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }
message(0x51a5c3d1) PoolPayout { queryId: Int as uint64; amount: Int as coins; destination: Address }
message DefiPayout { queryId: Int as uint64; amount: Int as coins; destination: Address }

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
    priceHistory: map<Int, Int>;
    anomalyLog: map<Int, AIRecommendation>;
    anomalyIndex: Int;
    minConfidence: Int as uint8;
    emergencyPause: Bool;
    aiActionCooldown: Int as uint32;
    lastAiActionTime: Int;
    heartbeatTimeout: Int as uint32;
    lastHeartbeat: Int;
    ownerOverrideWindow: Int as uint32;
    vetoThresholdBps: Int as uint16;
    aiActionLog: map<Int, AIActionLog>;
    aiActionIndex: Int;
    pendingAiActions: map<Int, Int>;
    vetoLog: map<Int, VetoState>;
    // Previous address for AI actions that move a privileged address, so
    // OwnerOverride can restore it (F-07).
    aiActionOldAddress: map<Int, Address>;
    totalVetoStake: Int as coins;
    
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
    
    // Vesting
    vestingEnabled: Bool;
    teamAllocation: Int as coins;
    teamClaimed: Int as coins;
    vestingSchedules: map<Address, VestingInfo>;
    
    // Lottery
    lotteryEnabled: Bool;
    lotteryTicketPrice: Int as coins;
    lotteryDrawInterval: Int as uint32;
    lotteryJackpotShare: Int as uint8;
    lotteryRound: Int;
    lotteryLastDraw: Int;
    lotteryJackpot: Int as coins;
    lotteryTickets: map<Int, Address>;
    lotteryTicketCount: Int;
    lotteryWinners: map<Int, Address>;
    
    // DeFi Sync
    defiAddress: Address;
    defiFeeShareBps: Int as uint16; // Basis points sent to DeFi pool (e.g. 500 = 5%);
    defiMaxPayoutBps: Int as uint16; // Cap (bps of the free reserve) per single DefiPayout call;
    
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
        self.lastBuybackTime = 0;
        self.totalBuybacks = 0;
        self.totalQsrBurnedViaBuyback = 0;
        self.totalTonSpentOnBuyback = 0;
        
        self.aiOracle = owner;
        self.aiEnabled = false;
        self.aiFullAutonomy = false;
        self.lastRebalanceTime = 0;
        self.signalCount = 0;
        self.anomalyIndex = 0;
        self.minConfidence = 75;
        self.emergencyPause = false;
        self.aiActionCooldown = 21600;
        // Start the cooldown window at deployment so the first AI action is
        // not blocked by a zero timestamp.
        self.lastAiActionTime = now();
        self.heartbeatTimeout = 604800;
        self.lastHeartbeat = now();
        self.ownerOverrideWindow = 86400;
        self.vetoThresholdBps = 1000;
        self.aiActionIndex = 0;
        self.totalVetoStake = 0;
        
        self.stakingEnabled = true;
        self.stakingApyBps = 2000;
        self.stakingMinStake = ton("100");
        self.stakingLockPeriod = 2592000;
        self.totalStaked = 0;
        self.stakingRewardsPool = 0;
        
        self.referralEnabled = true;
        self.referralRewardBps = 100;
        
        self.vestingEnabled = true;
        self.teamAllocation = 0;
        self.teamClaimed = 0;
        
        self.lotteryEnabled = true;
        self.lotteryTicketPrice = ton("1");
        self.lotteryDrawInterval = 86400;
        self.lotteryJackpotShare = 50;
        self.lotteryRound = 1;
        self.lotteryLastDraw = now();
        self.lotteryJackpot = 0;
        self.lotteryTicketCount = 0;
        
        self.defiAddress = newAddress(0, 0);
        self.defiFeeShareBps = 500; // 5% of fees go to DeFi pool;
        self.defiMaxPayoutBps = 5000; // max 50% of the free reserve per payout call;
    }
    
    // ═══════════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════════
    
    fun _requireOwner() { require(sender() == self.owner, "Only owner") }
    fun _requireAiAccess() { require(sender() == self.aiOracle, "Only AI oracle"); require(self.aiEnabled, "AI disabled") }
    // The administrative cooldown applies in every mode. Tying it to
    // aiFullAutonomy made the documented 6h safeguard inert (F-07).
    fun _requireAiCooldown() { require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI cooldown") }
    fun _requireNotPaused() { require(!self.emergencyPause, "Paused") }
    fun _requireTrading() { require(self.tradingEnabled, "Trading off") }

    // Buyback, lottery and staking pools are sub-accounts inside the fee
    // reserve. Treasury and DeFi payouts may only spend the part of the
    // reserve that is not encumbered by these pools.
    fun _poolEncumbrance(): Int { return self.buybackPool + self.lotteryJackpot + self.stakingRewardsPool }
    
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
        send(SendParameters{ to: contractAddress(init), value: 0, bounce: true, mode: SendRemainingValue, body: InternalTransfer{ queryId: queryId, amount: amount, from: from, responseDestination: myAddress(), forwardTonAmount: 0, forwardPayload: emptySlice() }.toCell(), code: init.code, data: init.data });
    }

    fun _mintTokens(to: Address, amount: Int, queryId: Int) {
        self._sendInternalTransfer(to, amount, queryId, myAddress());
    }

    fun _sendTokens(to: Address, amount: Int, queryId: Int, from: Address) {
        require(amount > 0, "Invalid transfer amount");
        require(self.reserveBalance >= amount, "Insufficient QSR reserve");
        self.reserveBalance = self.reserveBalance - amount;
        self._sendInternalTransfer(to, amount, queryId, from);
    }

    // Fee-funded DeFi liquidity is delivered with a notification so the pool
    // can account for the tokens in qsrReserve.
    fun _sendTokensToDefi(amount: Int, queryId: Int) {
        require(amount > 0, "Invalid DeFi transfer amount");
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

    // Custodied deposits must leave the master-owned Jetton wallet.
    fun _sendCustodiedTokens(to: Address, amount: Int, queryId: Int) {
        require(amount > 0, "Invalid custody transfer amount");
        require(self.custodyBalance >= amount, "Insufficient custody balance");
        self.custodyBalance = self.custodyBalance - amount;
        let init: StateInit = initOf QuasarWallet(myAddress(), myAddress());
        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: PoolPayout{ queryId: queryId, amount: amount, destination: to }.toCell(),
            code: init.code,
            data: init.data
        });
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
        self._mintTokens(msg.receiver, msg.amount, 0);
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventMint{ amount: msg.amount, receiver: msg.receiver }.toCell() });
    }
    
    receive(msg: BurnNotification) {
        require(msg.amount > 0, "Invalid amount");
        require(msg.amount <= self.totalSupply, "Supply underflow");
        let wInit: StateInit = initOf QuasarWallet(msg.sender, myAddress());
        require(sender() == contractAddress(wInit), "Unauthorized burn");
        self.totalSupply = self.totalSupply - msg.amount;
        if (msg.responseDestination != newAddress(0, 0)) {
            send(SendParameters{ to: msg.responseDestination, value: 0, bounce: false, mode: SendRemainingValue, body: "Excess returned".asComment() });
        }
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventBurn{ amount: msg.amount, burner: msg.sender }.toCell() });
    }

    // When the wallet rejects an internal transfer, the tokens return to the
    // wallet via its own bounce handler. The master must restore the reserve
    // accounting to stay consistent with the jetton ledger.
    bounced(msg: bounced<InternalTransfer>) {
        self.reserveBalance = self.reserveBalance + msg.amount;
    }
    
    receive("Stop Minting") { self._requireOwner(); self.mintable = false }
    
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
    // FEE PROCESSING — 0.30% with Buyback + Lottery + Staking + DeFi
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: FeeTransfer) {
        require(msg.amount > 0, "Invalid amount");
        let wInit: StateInit = initOf QuasarWallet(msg.originalSender, myAddress());
        require(sender() == contractAddress(wInit), "Invalid fee source");
        
        self.totalFeesCollected = self.totalFeesCollected + msg.amount;
        self.reserveBalance = self.reserveBalance + msg.amount;
        
        let burnAmount: Int = msg.amount * self.feeBurnShare / 100;
        let remaining: Int = msg.amount - burnAmount;
        // Burned fees cannot remain spendable in the fee-backed reserve.
        self.reserveBalance = self.reserveBalance - burnAmount;
        
        // Split remaining: 15% buyback, 15% lottery, 10% staking, 5% defi, 55% treasury
        let buybackAmt: Int = remaining * 15 / 100;
        let lotteryAmt: Int = remaining * 15 / 100;
        let stakingAmt: Int = remaining * 10 / 100;
        let defiAmt: Int = remaining * self.defiFeeShareBps / 10000;
        let treasuryAmt: Int = remaining - buybackAmt - lotteryAmt - stakingAmt - defiAmt;
        
        if (burnAmount > 0) {
            self.totalSupply = self.totalSupply - burnAmount;
            self.totalBurned = self.totalBurned + burnAmount;
        }
        
        if (buybackAmt > 0 && self.buybackEnabled) { self.buybackPool = self.buybackPool + buybackAmt }
        else if (buybackAmt > 0) { treasuryAmt = treasuryAmt + buybackAmt }
        
        if (lotteryAmt > 0 && self.lotteryEnabled) { self.lotteryJackpot = self.lotteryJackpot + lotteryAmt }
        else if (lotteryAmt > 0) { treasuryAmt = treasuryAmt + lotteryAmt }
        
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
                }
            }
        }
        
        if (treasuryAmt > 0 && self.treasury != newAddress(0, 0)) {
            // Treasury may only spend the unencumbered part of the reserve:
            // pool allocations (buyback/lottery/staking) stay fully backed.
            require(self.reserveBalance - self._poolEncumbrance() >= treasuryAmt, "Reserve encumbered");
            self._sendTokens(self.treasury, treasuryAmt, msg.queryId, msg.originalSender);
        }
        
        // Lottery ticket
        if (self.lotteryEnabled && msg.amount >= self.lotteryTicketPrice) {
            self.lotteryTickets.set(self.lotteryTicketCount, msg.originalSender);
            self.lotteryTicketCount = self.lotteryTicketCount + 1;
        }
        
        // Auto-buyback
        if (self.buybackEnabled && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {
            self._executeBuyback(msg.queryId);
        }
        
        // No auto-lottery draw here on purpose: a draw executed inside the
        // fee-transfer transaction would let the validator processing the
        // transfer influence the winner via TVM randomness. Draws run only
        // through an explicit TriggerLottery message.
        
        // Emit fee distribution event
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventFeeDistributed{ totalFee: msg.amount, burn: burnAmount, buyback: buybackAmt, lottery: lotteryAmt, staking: stakingAmt, referral: referralDistributed, treasury: treasuryAmt, defiPool: defiAmt }.toCell() });
    }
    
    // ═══════════════════════════════════════════════════════════
    // BUYBACK
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: TriggerBuyback) {
        self._requireNotPaused();
        require(self.buybackEnabled, "Buyback off");
        require(self.buybackPool >= self.buybackThreshold, "Pool low");
        require(now() - self.lastBuybackTime >= self.buybackCooldown, "Cooldown");
        self._executeBuyback(msg.queryId);
    }
    
    fun _executeBuyback(queryId: Int) {
        // No AMM swap is performed here. Burn the reserve safely and report
        // zero TON spent instead of claiming a buyback happened.
        let qsrBurn: Int = self.buybackPool * self.buybackBurnPercent / 100;
        if (qsrBurn > self.totalSupply) { qsrBurn = self.totalSupply }
        if (qsrBurn > self.reserveBalance) { qsrBurn = self.reserveBalance }
        self.buybackPool = self.buybackPool - qsrBurn;
        if (qsrBurn > 0) {
            self.totalSupply = self.totalSupply - qsrBurn;
            self.totalBurned = self.totalBurned + qsrBurn;
            self.totalQsrBurnedViaBuyback = self.totalQsrBurnedViaBuyback + qsrBurn;
            self.reserveBalance = self.reserveBalance - qsrBurn;
        }
        self.totalBuybacks = self.totalBuybacks + 1;
        self.lastBuybackTime = now();
        send(SendParameters{ to: self.owner, value: 0, bounce: false, mode: SendRemainingValue, body: EventBuybackExecuted{ tonSpent: 0, qsrBurned: qsrBurn }.toCell() });
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
        if (pending > 0 && self.stakingRewardsPool >= pending) {
            self.stakingRewardsPool = self.stakingRewardsPool - pending;
            self._sendTokens(staker, pending, 0, myAddress());
        }
        
        self.stakers.set(staker, StakeInfo{ amount: current + msg.amount, startTime: now(), lastClaim: now(), lockEnd: lockEnd });
        self.totalStaked = self.totalStaked + msg.amount;
        self.pendingQsrDeposits.set(staker, depositPending!! - msg.amount);
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventStake{ staker: staker, amount: msg.amount }.toCell() });
    }
    
    receive(msg: Unstake) {
        self._requireNotPaused();
        require(msg.amount > 0, "Invalid amount");
        let staker: Address = sender();
        let info: StakeInfo? = self.stakers.get(staker);
        require(info != null, "No stake");
        require(info!!.amount >= msg.amount, "Insufficient stake");
        require(now() >= info!!.lockEnd, "Lock active");
        
        // Claim rewards
        let pending: Int = self._calculateRewards(staker);
        if (pending > 0 && self.stakingRewardsPool >= pending) {
            self.stakingRewardsPool = self.stakingRewardsPool - pending;
            self._sendTokens(staker, pending, 0, myAddress());
        }
        
        let remaining: Int = info!!.amount - msg.amount;
        if (remaining > 0) {
            self.stakers.set(staker, StakeInfo{ amount: remaining, startTime: info!!.startTime, lastClaim: now(), lockEnd: info!!.lockEnd });
        } else {
            self.stakers.set(staker, null);
        }
        self.totalStaked = self.totalStaked - msg.amount;
        self._sendCustodiedTokens(staker, msg.amount, 0);
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventUnstake{ staker: staker, amount: msg.amount }.toCell() });
    }
    
    receive(msg: ClaimRewards) {
        self._requireNotPaused();
        let staker: Address = sender();
        let pending: Int = self._calculateRewards(staker);
        require(pending > 0, "No rewards");
        require(self.stakingRewardsPool >= pending, "Pool empty");
        
        self.stakingRewardsPool = self.stakingRewardsPool - pending;
        let info: StakeInfo? = self.stakers.get(staker);
        if (info != null) {
            self.stakers.set(staker, StakeInfo{ amount: info!!.amount, startTime: info!!.startTime, lastClaim: now(), lockEnd: info!!.lockEnd });
        }
        self._sendTokens(staker, pending, 0, myAddress());
    }
    
    fun _calculateRewards(staker: Address): Int {
        let info: StakeInfo? = self.stakers.get(staker);
        if (info == null) { return 0 }
        let elapsed: Int = now() - info!!.lastClaim;
        let yearly: Int = info!!.amount * self.stakingApyBps / 10000;
        let reward: Int = yearly * elapsed / 31536000;
        if (reward > self.stakingRewardsPool) { reward = self.stakingRewardsPool }
        return reward;
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
        require(msg.referrer != sender(), "Self referral");
        let existing: ReferralInfo? = self.referrals.get(sender());
        require(existing == null, "Already registered");
        
        self.referrals.set(sender(), ReferralInfo{ referrer: msg.referrer, totalEarned: 0, totalReferrals: 0 });
        
        let refData: ReferralInfo? = self.referrals.get(msg.referrer);
        if (refData != null) {
            self.referrals.set(msg.referrer, ReferralInfo{ referrer: refData!!.referrer, totalEarned: refData!!.totalEarned, totalReferrals: refData!!.totalReferrals + 1 });
        }
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventReferralRegistered{ user: sender(), referrer: msg.referrer }.toCell() });
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
        self.pendingReferralRewards.set(claimant, 0);
        self._sendTokens(claimant, pending!!, 0, myAddress());
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
        
        self.vestingSchedules.set(beneficiary, VestingInfo{ totalAmount: info!!.totalAmount, claimed: info!!.claimed + claimable, startTime: info!!.startTime, cliff: info!!.cliff, duration: info!!.duration });
        self.teamClaimed = self.teamClaimed + claimable;
        self._sendCustodiedTokens(beneficiary, claimable, 0);
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventVestingClaimed{ beneficiary: beneficiary, amount: claimable }.toCell() });
    }
    
    // ═══════════════════════════════════════════════════════════
    // LOTTERY
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: TriggerLottery) {
        self._requireNotPaused();
        require(self.lotteryEnabled, "Lottery off");
        require(self.lotteryTicketCount > 0, "No tickets");
        require(now() - self.lotteryLastDraw >= self.lotteryDrawInterval, "Too early");
        self._executeLotteryDraw(msg.queryId);
    }
    
    fun _executeLotteryDraw(queryId: Int) {
        if (self.lotteryTicketCount == 0) { return }
        // Use TVM randomness rather than the block timestamp, which is
        // predictable and can be influenced by the draw caller.
        let winnerIndex: Int = randomInt() % self.lotteryTicketCount;
        let winner: Address? = self.lotteryTickets.get(winnerIndex);
        if (winner == null) { return }
        
        let jackpot: Int = self.lotteryJackpot * self.lotteryJackpotShare / 100;
        self.lotteryJackpot = self.lotteryJackpot - jackpot;
        
        // Small transfers can create tickets without producing a whole
        // nano-QSR of jackpot. A draw must still close the round instead of
        // reverting on a zero payout.
        if (jackpot > 0) {
            self._sendTokens(winner!!, jackpot, queryId, myAddress());
        }
        
        self.lotteryWinners.set(self.lotteryRound, winner!!);
        self.lotteryRound = self.lotteryRound + 1;
        self.lotteryLastDraw = now();
        self.lotteryTickets = emptyMap();
        self.lotteryTicketCount = 0;
        
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventLotteryDrawn{ round: self.lotteryRound - 1, winner: winner!!, jackpot: jackpot }.toCell() });
    }
    
    receive(msg: SetLotteryConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.ticketPrice > 0 && msg.drawInterval > 0 && msg.jackpotShare > 0 && msg.jackpotShare <= 100, "Invalid lottery config");
        self.lotteryEnabled = msg.enabled;
        self.lotteryTicketPrice = msg.ticketPrice;
        self.lotteryDrawInterval = msg.drawInterval;
        self.lotteryJackpotShare = msg.jackpotShare;
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
        self.lastHeartbeat = now();
    }
    
    receive(msg: AIEmergencyPause) {
        self._requireAiAccess();
        let oldTrading: Bool = self.tradingEnabled;
        if (msg.pause) {
            self.emergencyPause = true;
            self.tradingEnabled = false;
            if (msg.severity == 3) {
                self.mintable = false;
                self.feeBps = 100;
                self.feeBurnShare = 90;
            }
        } else {
            require(self.aiFullAutonomy, "No autonomy");
            self.emergencyPause = false;
            self.tradingEnabled = true;
        }
        let id: Int = self._logAiAction("EmergencyPause", oldTrading ? 1 : 0, msg.pause ? 1 : 0, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "EmergencyPause", oldValue: oldTrading ? 1 : 0, newValue: msg.pause ? 1 : 0 }.toCell() });
    }
    
    receive(msg: AISetFee) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(msg.feeBps == 30, "Wallet fee is fixed at 30 bps");
        let old: Int = self.feeBps;
        self.feeBps = msg.feeBps;
        let id: Int = self._logAiAction("SetFee", old, msg.feeBps, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetFee", oldValue: old, newValue: msg.feeBps }.toCell() });
    }
    
    receive(msg: AISetTreasuryDirect) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(msg.treasury != newAddress(0, 0), "Invalid");
        let oldTreasury: Address = self.treasury;
        self.treasury = msg.treasury;
        let id: Int = self._logAiAction("SetTreasury", 0, 1, msg.reason);
        // Keep the previous address so the owner can actually reverse it (F-07).
        self.aiActionOldAddress.set(id, oldTreasury);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetTreasury", oldValue: 0, newValue: 1 }.toCell() });
    }
    
    receive(msg: AISetAntiWhale) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(msg.maxTxBps == 100 && msg.maxWalletBps == 300 && msg.cooldown == 5, "Transfer limits are fixed");
        self.maxTxBps = msg.maxTxBps;
        self.maxWalletBps = msg.maxWalletBps;
        self.cooldownSeconds = msg.cooldown;
        let id: Int = self._logAiAction("SetAntiWhale", 0, msg.maxTxBps, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetAntiWhale", oldValue: 0, newValue: msg.maxTxBps }.toCell() });
    }
    
    receive(msg: AISetBuybackDirect) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(msg.threshold > 0 && msg.cooldown > 0 && msg.burnPercent > 0 && msg.burnPercent <= 100, "Invalid buyback config");
        let oldEnabled: Bool = self.buybackEnabled;
        self.buybackEnabled = msg.enabled;
        self.buybackThreshold = msg.threshold;
        self.buybackCooldown = msg.cooldown;
        self.buybackBurnPercent = msg.burnPercent;
        let id: Int = self._logAiAction("SetBuyback", oldEnabled ? 1 : 0, msg.enabled ? 1 : 0, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "SetBuyback", oldValue: oldEnabled ? 1 : 0, newValue: msg.enabled ? 1 : 0 }.toCell() });
    }
    
    receive(msg: AIToggleTrading) {
        self._requireAiAccess();
        self._requireAiCooldown();
        let oldTrading: Bool = self.tradingEnabled;
        self.tradingEnabled = msg.enabled;
        let id: Int = self._logAiAction("ToggleTrading", oldTrading ? 1 : 0, msg.enabled ? 1 : 0, msg.reason);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "ToggleTrading", oldValue: oldTrading ? 1 : 0, newValue: msg.enabled ? 1 : 0 }.toCell() });
    }
    
    receive(msg: AIRotateOracle) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(self.aiFullAutonomy, "No autonomy");
        require(msg.newOracle != newAddress(0, 0), "Invalid oracle");
        let oldOracle: Address = self.aiOracle;
        self.aiOracle = msg.newOracle;
        let id: Int = self._logAiAction("RotateOracle", 0, 1, msg.reason);
        self.aiActionOldAddress.set(id, oldOracle);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "RotateOracle", oldValue: 0, newValue: 1 }.toCell() });
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
        require(!self.emergencyPause, "Paused");
        require(msg.targetFeeBps == 30 && msg.targetBurnShare <= 100, "Range");
        let oldBurnShare: Int = self.feeBurnShare;
        self.feeBps = msg.targetFeeBps;
        self.feeBurnShare = msg.targetBurnShare;
        self.lastRebalanceTime = now();
        self.signalCount = self.signalCount + 1;
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.recommendation, confidence: 100, executed: true });
        self.anomalyIndex = self.anomalyIndex + 1;
        let id: Int = self._logAiAction("Rebalance", oldBurnShare, msg.targetBurnShare, msg.recommendation);
        send(SendParameters{ to: sender(), value: 0, mode: SendRemainingValue, body: EventAiAction{ actionId: id, actionType: "Rebalance", oldValue: oldBurnShare, newValue: msg.targetBurnShare }.toCell() });
    }
    
    receive(msg: AIPriceSignal) {
        self._requireAiAccess();
        // Market data must not consume or reset the administrative cooldown,
        // but every state change it causes has to be logged (F-07).
        let oldBurnShare: Int = self.feeBurnShare;
        let oldMintable: Bool = self.mintable;
        self.signalCount = self.signalCount + 1;
        self.priceHistory.set(now(), msg.priceTon);
        if (msg.action == 2 && msg.volatility > 5000) {
            self.feeBurnShare = 70;
        }
        if (msg.action == 3 && msg.sentiment > 80) {
            self.feeBurnShare = 40;
            // AI may not re-enable minting after the owner stopped it.
        }
        if (msg.action == 1 && msg.sentiment < -50) {
            self.mintable = false;
            self.feeBurnShare = 80;
        }
        if (msg.action == 1 && msg.sentiment < -30 && self.buybackEnabled && self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {
            self._executeBuyback(msg.queryId);
        }
        if (self.feeBurnShare != oldBurnShare || self.mintable != oldMintable) {
            self._logAiActionSilent("PriceSignal", oldBurnShare, self.feeBurnShare, "price-signal");
        }
    }
    
    receive(msg: AIAnomalyAlert) {
        self._requireAiAccess();
        let oldBurnShare: Int = self.feeBurnShare;
        let oldMintable: Bool = self.mintable;
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.recommendedAction, confidence: 100, executed: false });
        self.anomalyIndex = self.anomalyIndex + 1;
        if (msg.severity == 3) {
            self.emergencyPause = true;
            self.tradingEnabled = false;
            self.mintable = false;
            self.feeBps = 100;
            self.feeBurnShare = 90;
        } else if (msg.severity == 2) {
            self.feeBurnShare = 60;
        }
        if (self.feeBurnShare != oldBurnShare || self.mintable != oldMintable) {
            self._logAiActionSilent("AnomalyAlert", oldBurnShare, self.feeBurnShare, "anomaly-alert");
        }
    }
    
    receive(msg: AIGovernanceProposal) {
        self._requireAiAccess();
        self._requireAiCooldown();
        self.lastAiActionTime = now();
        require(msg.confidence >= self.minConfidence, "Low confidence");
        self.signalCount = self.signalCount + 1;
        if (msg.proposalType == 1) {
            require(msg.newValue == 30, "Wallet fee is fixed at 30 bps");
            self.feeBps = 30;
        } else if (msg.proposalType == 2) {
            require(msg.newValue >= 0 && msg.newValue <= 100, "Invalid burn share");
            self.feeBurnShare = msg.newValue;
        } else if (msg.proposalType == 4) {
            require(msg.newValue > 0, "Invalid buyback threshold");
            self.buybackThreshold = msg.newValue;
        } else {
            require(false, "Unsupported governance proposal");
        }
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{ timestamp: now(), action: msg.description, confidence: msg.confidence, executed: true });
        self.anomalyIndex = self.anomalyIndex + 1;
    }
    
    // ═══════════════════════════════════════════════════════════
    // VETO & OVERRIDE
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AIVetoVote) {
        require(false, "Veto voting disabled until stake escrow is implemented");
        let action: AIActionLog? = self.aiActionLog.get(msg.actionId);
        require(action != null, "Not found");
        require(!(action!!.vetoed) && !(action!!.overridden), "Closed");
        require(self._isOwnerOverrideWindow(msg.actionId), "Window closed");
        
        let veto: VetoState? = self.vetoLog.get(msg.actionId);
        let currentStake: Int = 0;
        let currentCount: Int = 0;
        if (veto != null) { currentStake = veto!!.totalStake; currentCount = veto!!.vetoCount }
        
        let newStake: Int = currentStake + msg.stake;
        let threshold: Int = self.totalSupply * self.vetoThresholdBps / 10000;
        self.vetoLog.set(msg.actionId, VetoState{ actionId: msg.actionId, totalStake: newStake, vetoCount: currentCount + 1, threshold: threshold, active: newStake < threshold });
        
        if (newStake >= threshold) {
            let act: AIActionLog = action!!;
            self.aiActionLog.set(msg.actionId, AIActionLog{ actionId: act.actionId, timestamp: act.timestamp, actionType: act.actionType, oldValue: act.oldValue, newValue: act.newValue, reason: act.reason, executed: act.executed, vetoed: true, overridden: false });
            self.totalVetoStake = self.totalVetoStake + msg.stake;
        }
    }
    
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
            self.emergencyPause = false;
            self.tradingEnabled = act.oldValue != 0;
        }
        else if (act.actionType == "SetTreasury") {
            let prevTreasury: Address? = self.aiActionOldAddress.get(msg.actionId);
            if (prevTreasury != null) { self.treasury = prevTreasury!! }
        }
        else if (act.actionType == "RotateOracle") {
            let prevOracle: Address? = self.aiActionOldAddress.get(msg.actionId);
            if (prevOracle != null) { self.aiOracle = prevOracle!! }
        }
        else if (act.actionType == "SetBuyback") { self.buybackEnabled = act.oldValue != 0 }
        else if (act.actionType == "Rebalance") { self.feeBurnShare = act.oldValue }
        else if (act.actionType == "PriceSignal") { self.feeBurnShare = act.oldValue }
        else if (act.actionType == "AnomalyAlert") { self.feeBurnShare = act.oldValue }
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
    // DeFi SYNC
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: SetDefiAddress) {
        self._requireOwner();
        // The zero address revokes DeFi access entirely.
        self.defiAddress = msg.defiAddress;
    }

    // DeFi can only ask the master to release QSR that it has accounted for
    // in its pool reserves. The master remains the only contract allowed to
    // credit a user's Jetton wallet.
    receive(msg: DefiPayout) {
        require(sender() == self.defiAddress, "Only DeFi");
        require(msg.amount > 0, "Invalid amount");
        require(msg.destination != newAddress(0, 0), "Invalid destination");
        let freeReserve: Int = self.reserveBalance - self._poolEncumbrance();
        require(freeReserve >= msg.amount, "Reserve encumbered");
        require(msg.amount * 10000 <= freeReserve * self.defiMaxPayoutBps, "Payout cap");
        self._sendTokens(msg.destination, msg.amount, msg.queryId, myAddress());
    }

    bounced(msg: bounced<PoolPayout>) {
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
    }

    receive(msg: CancelOwnerTransfer) {
        self._requireOwner();
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
    }

    receive(msg: AcceptOwner) {
        require(self.pendingOwner != newAddress(0, 0), "No pending owner");
        require(sender() == self.pendingOwner, "Not pending owner");
        require(now() >= self.ownerTransferAt, "Timelock active");
        self.owner = self.pendingOwner;
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
    }

    receive(msg: SetTreasury) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.treasury != newAddress(0, 0), "Invalid treasury");
        self.treasury = msg.treasury;
    }
    
    receive(msg: SetFeeConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.feeBps == 30 && msg.burnShare <= 100 && msg.maxTxBps == 100 && msg.maxWalletBps == 300 && msg.cooldown == 5, "Only implemented limits are allowed");
        self.feeBps = msg.feeBps;
        self.feeBurnShare = msg.burnShare;
        self.maxTxBps = msg.maxTxBps;
        self.maxWalletBps = msg.maxWalletBps;
        self.cooldownSeconds = msg.cooldown;
    }
    
    receive(msg: ToggleTrading) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        self.tradingEnabled = msg.enabled;
    }
    
    receive(msg: SetBuybackConfig) {
        self._requireOwner();
        require(!self.aiFullAutonomy, "AI controls");
        require(msg.threshold > 0 && msg.cooldown > 0 && msg.burnPercent > 0 && msg.burnPercent <= 100, "Invalid buyback config");
        self.buybackEnabled = msg.enabled;
        self.buybackThreshold = msg.threshold;
        self.buybackCooldown = msg.cooldown;
        self.buybackBurnPercent = msg.burnPercent;
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
    
    receive(msg: SetDefiPayoutCap) {
        self._requireOwner();
        require(msg.maxPayoutBps > 0 && msg.maxPayoutBps <= 10000, "Invalid cap");
        self.defiMaxPayoutBps = msg.maxPayoutBps;
    }
    
    // Recover stray TON (overpaid gas etc). QSR funds stay governed by the
    // reserve/custody accounting and can never be swept.
    receive(msg: SweepTON) {
        self._requireOwner();
        require(msg.amount > 0 && msg.amount <= myBalance() - ton("0.05"), "Invalid sweep");
        send(SendParameters{ to: self.owner, value: msg.amount, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
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
    
    get fun get_wallet_address(owner: Address): Address {
        let init: StateInit = initOf QuasarWallet(owner, myAddress());
        return contractAddress(init);
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

message SetDefiPayoutCap { maxPayoutBps: Int as uint16 }
message SweepTON { amount: Int as coins }

// ─── Ownership (two-step + timelock, F-08) ───
message ProposeOwner { newOwner: Address }
message AcceptOwner { }
message CancelOwnerTransfer { }

// ═══════════════════════════════════════════════════════════════
// QUASAR WALLET — Optimized with fee deduction
// ═══════════════════════════════════════════════════════════════

contract QuasarWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    lastTxTime: Int;
    
    init(owner: Address, master: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
        self.lastTxTime = 0;
    }
    
    receive(msg: InternalTransfer) {
        let sourceInit: StateInit = initOf QuasarWallet(msg.from, self.master);
        require(sender() == self.master || sender() == contractAddress(sourceInit), "Unauthorized");
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;

        // A Jetton wallet notifies the owner contract only when the sender
        // supplied forward TON. This is the standard deposit hook used by
        // QuasarMaster and QuasarDeFi.
        if (msg.forwardTonAmount > 0) {
            send(SendParameters{
                to: self.owner,
                value: msg.forwardTonAmount,
                bounce: true,
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: TokenNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forwardPayload: msg.forwardPayload
                }.toCell()
            });
        }
    }

    // Restore tokens when a bounce rejects an outgoing transfer. This is
    // required by the TON Jetton wallet standard; without it, a failed
    // recipient transaction permanently burns the sender's wallet balance.
    bounced(msg: bounced<InternalTransfer>) {
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;
    }
    
    receive(msg: TokenTransfer) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(msg.destination != newAddress(0, 0), "Invalid destination");
        require(self.balance >= msg.amount, "Insufficient");
        require(now() - self.lastTxTime >= 5, "Cooldown");
        self.lastTxTime = now();
        
        let fee: Int = msg.amount * 30 / 10000;
        if (fee < 1) { fee = 1 }
        let sendAmount: Int = msg.amount - fee;
        require(sendAmount > 0, "Amount too small");
        self.balance = self.balance - msg.amount;
        
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
        send(SendParameters{ to: contractAddress(init), value: 0, bounce: true, mode: SendRemainingValue, body: InternalTransfer{ queryId: msg.queryId, amount: sendAmount, from: self.owner, responseDestination: msg.responseDestination, forwardTonAmount: msg.forwardTonAmount, forwardPayload: msg.forwardPayload }.toCell(), code: init.code, data: init.data });
        
        if (fee > 0) {
            // The fee message must carry gas: the master pays out referral and
            // treasury shares with SendRemainingValue, which would fail on an
            // empty incoming value.
            send(SendParameters{ to: self.master, value: ton("0.05"), bounce: false, mode: SendPayGasSeparately | SendIgnoreErrors, body: FeeTransfer{ queryId: msg.queryId, amount: fee, originalSender: self.owner, originalReceiver: msg.destination }.toCell() });
        }
    }

    // Pool payouts are initiated by a contract that owns this wallet. They
    // bypass the user transfer fee because the pool already applies its AMM
    // fee and must deliver the quoted amount exactly.
    receive(msg: PoolPayout) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(self.balance >= msg.amount, "Insufficient");
        self.balance = self.balance - msg.amount;
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: InternalTransfer{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                responseDestination: self.owner,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }
    
    receive(msg: TokenBurn) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(self.balance >= msg.amount, "Insufficient");
        self.balance = self.balance - msg.amount;
        send(SendParameters{ to: self.master, value: 0, bounce: true, mode: SendRemainingValue, body: BurnNotification{ queryId: msg.queryId, amount: msg.amount, sender: self.owner, responseDestination: msg.responseDestination }.toCell() });
    }

    bounced(msg: bounced<BurnNotification>) {
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;
    }
    
    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{ balance: self.balance, owner: self.owner, master: self.master, walletCode: (initOf QuasarWallet(self.owner, self.master)).code }
    }
}
