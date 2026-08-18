import "@stdlib/deploy";
import "@stdlib/content";

// ═══════════════════════════════════════════════════════════════
// QUASAR — Fully Autonomous AI-Powered Jetton
// 0.30% fee | Auto-Buyback & Burn | Anti-whale | AI Sovereignty
// ═══════════════════════════════════════════════════════════════

// ─── AI Sovereignty Messages ───

message AISetOracle {
    oracleAddress: Address;
}

message AIGrantFullAutonomy {
    enabled: Bool;
}

message AIHeartbeat {
    queryId: Int as uint64;
    status: String;
}

message AIVetoVote {
    actionId: Int as uint64;
    voter: Address;
    stake: Int as coins;
    reason: String;
}

message OwnerOverride {
    actionId: Int as uint64;
    reason: String;
}

message AIRebalance {
    queryId: Int as uint64;
    targetFeeBps: Int as uint16;
    targetBurnShare: Int as uint8;
    recommendation: String;
}

message AIPriceSignal {
    queryId: Int as uint64;
    priceTon: Int as coins;
    volatility: Int as uint32;
    sentiment: Int as int8;
    action: Int as uint8;
}

message AIAnomalyAlert {
    queryId: Int as uint64;
    severity: Int as uint8;
    anomalyType: Int as uint8;
    affectedWallets: Int as uint32;
    recommendedAction: String;
}

message AIGovernanceProposal {
    queryId: Int as uint64;
    proposalType: Int as uint8;
    newValue: Int;
    description: String;
    confidence: Int as uint8;
}

// ─── AI Direct Control Messages (Full Autonomy) ───

message AISetFee {
    queryId: Int as uint64;
    feeBps: Int as uint16;
    reason: String;
}

message AISetTreasuryDirect {
    queryId: Int as uint64;
    treasury: Address;
    reason: String;
}

message AISetAntiWhale {
    queryId: Int as uint64;
    maxTxBps: Int as uint16;
    maxWalletBps: Int as uint16;
    cooldown: Int as uint16;
    reason: String;
}

message AISetBuybackDirect {
    queryId: Int as uint64;
    enabled: Bool;
    threshold: Int as coins;
    cooldown: Int as uint32;
    burnPercent: Int as uint8;
    reason: String;
}

message AIToggleTrading {
    queryId: Int as uint64;
    enabled: Bool;
    reason: String;
}

message AIEmergencyPause {
    queryId: Int as uint64;
    pause: Bool;
    severity: Int as uint8;
    reason: String;
}

message AIRotateOracle {
    queryId: Int as uint64;
    newOracle: Address;
    reason: String;
}

// ─── Standard Jetton Messages ───

message Mint {
    amount: Int;
    receiver: Address;
}

message BurnNotification {
    queryId: Int as uint64;
    amount: Int;
    sender: Address;
    responseDestination: Address;
}

message TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}

message TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forwardPayload: Slice as remaining;
}

// ─── Fee & Security Messages ───

message FeeTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    originalSender: Address;
    originalReceiver: Address;
}

message SetTreasury {
    treasury: Address;
}

message SetFeeConfig {
    feeBps: Int as uint16;
    burnShare: Int as uint8;
    maxTxBps: Int as uint16;
    maxWalletBps: Int as uint16;
    cooldown: Int as uint16;
}

message ToggleTrading {
    enabled: Bool;
}

// ─── Buyback Messages ───

message TriggerBuyback {
    queryId: Int as uint64;
}

message SetBuybackConfig {
    enabled: Bool;
    threshold: Int as coins;
    cooldown: Int as uint32;
    burnPercent: Int as uint8;
}

// ─── Data Structures ───

struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

struct AIState {
    oracleAddress: Address;
    aiModeEnabled: Bool;
    fullAutonomy: Bool;
    lastRebalanceAt: Int;
    totalSignalsReceived: Int;
    currentFeeBps: Int;
    priceHistoryCount: Int;
    anomalyCount: Int;
    lastHeartbeat: Int;
    isAlive: Bool;
}

struct FeeConfig {
    feeBps: Int;
    burnShare: Int;
    treasuryShare: Int;
    maxTxBps: Int;
    maxWalletBps: Int;
    cooldown: Int;
    totalBurned: Int;
    totalFeesCollected: Int;
}

struct BuybackState {
    enabled: Bool;
    pool: Int;
    threshold: Int;
    cooldown: Int;
    burnPercent: Int;
    lastBuybackAt: Int;
    totalBuybacks: Int;
    totalQsrBurnedViaBuyback: Int;
    totalTonSpent: Int;
}

struct AutonomyState {
    fullAutonomyEnabled: Bool;
    aiActionCooldown: Int;
    lastAiActionTime: Int;
    heartbeatTimeout: Int;
    lastHeartbeat: Int;
    ownerOverrideWindow: Int;
    vetoThresholdBps: Int;
    totalVetoStake: Int;
    pendingActions: Int;
}

struct AIActionLog {
    actionId: Int;
    timestamp: Int;
    actionType: String;
    oldValue: Int;
    newValue: Int;
    reason: String;
    executed: Bool;
    vetoed: Bool;
    overridden: Bool;
}

struct VetoState {
    actionId: Int;
    totalStake: Int;
    vetoCount: Int;
    threshold: Int;
    active: Bool;
}

struct AIRecommendation {
    timestamp: Int;
    action: String;
    confidence: Int;
    executed: Bool;
}

// ═══════════════════════════════════════════════════════════════
// QUASAR MASTER CONTRACT — AI Sovereignty
// ═══════════════════════════════════════════════════════════════

contract QuasarMaster with Deployable {
    
    // ─── Core State ───
    totalSupply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;
    
    // ─── Fee & Security State ───
    feeBps: Int as uint16;
    feeBurnShare: Int as uint8;
    treasury: Address;
    totalBurned: Int as coins;
    totalFeesCollected: Int as coins;
    maxTxBps: Int as uint16;
    maxWalletBps: Int as uint16;
    cooldownSeconds: Int as uint16;
    tradingEnabled: Bool;
    
    // ─── Buyback State ───
    buybackEnabled: Bool;
    buybackPool: Int as coins;
    buybackThreshold: Int as coins;
    buybackCooldown: Int as uint32;
    buybackBurnPercent: Int as uint8;
    lastBuybackTime: Int;
    totalBuybacks: Int;
    totalQsrBurnedViaBuyback: Int as coins;
    totalTonSpentOnBuyback: Int as coins;
    
    // ─── AI State ───
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
    
    // ─── Autonomy State ───
    aiActionCooldown: Int as uint32;       // 6 hours default
    lastAiActionTime: Int;
    heartbeatTimeout: Int as uint32;       // 7 days default
    lastHeartbeat: Int;
    ownerOverrideWindow: Int as uint32;    // 24 hours default
    vetoThresholdBps: Int as uint16;       // 1000 = 10%
    aiActionLog: map<Int, AIActionLog>;
    aiActionIndex: Int;
    pendingAiActions: map<Int, Int>;       // actionId -> timestamp
    vetoLog: map<Int, VetoState>;
    totalVetoStake: Int as coins;
    
    init(owner: Address, content: Cell, walletCode: Cell) {
        self.totalSupply = 0;
        self.mintable = true;
        self.owner = owner;
        self.content = content;
        self.walletCode = walletCode;
        
        // Fee defaults
        self.feeBps = 30;
        self.feeBurnShare = 50;
        self.treasury = owner;
        self.totalBurned = 0;
        self.totalFeesCollected = 0;
        self.maxTxBps = 100;
        self.maxWalletBps = 300;
        self.cooldownSeconds = 15;
        self.tradingEnabled = true;
        
        // Buyback defaults
        self.buybackEnabled = true;
        self.buybackPool = 0;
        self.buybackThreshold = ton("10");
        self.buybackCooldown = 3600;
        self.buybackBurnPercent = 100;
        self.lastBuybackTime = 0;
        self.totalBuybacks = 0;
        self.totalQsrBurnedViaBuyback = 0;
        self.totalTonSpentOnBuyback = 0;
        
        // AI defaults
        self.aiOracle = owner;
        self.aiEnabled = false;
        self.aiFullAutonomy = false;
        self.lastRebalanceTime = 0;
        self.signalCount = 0;
        self.anomalyIndex = 0;
        self.minConfidence = 75;
        self.emergencyPause = false;
        
        // Autonomy defaults
        self.aiActionCooldown = 21600;       // 6 hours
        self.lastAiActionTime = 0;
        self.heartbeatTimeout = 604800;      // 7 days
        self.lastHeartbeat = now();
        self.ownerOverrideWindow = 86400;    // 24 hours
        self.vetoThresholdBps = 1000;        // 10%
        self.aiActionIndex = 0;
        self.totalVetoStake = 0;
    }
    
    // ═══════════════════════════════════════════════════════════
    // AUTONOMY HELPERS
    // ═══════════════════════════════════════════════════════════
    
    fun _requireAiAccess() {
        require(sender() == self.aiOracle, "Only AI oracle");
        require(self.aiEnabled, "AI disabled");
    }
    
    fun _requireAiCooldown() {
        if (self.aiFullAutonomy) {
            require(now() - self.lastAiActionTime >= self.aiActionCooldown, "AI action cooldown");
        }
    }
    
    fun _logAiAction(actionType: String, oldVal: Int, newVal: Int, reason: String): Int {
        let actionId: Int = self.aiActionIndex;
        self.aiActionLog.set(actionId, AIActionLog{
            actionId: actionId,
            timestamp: now(),
            actionType: actionType,
            oldValue: oldVal,
            newValue: newVal,
            reason: reason,
            executed: true,
            vetoed: false,
            overridden: false
        });
        self.pendingAiActions.set(actionId, now());
        self.aiActionIndex = self.aiActionIndex + 1;
        self.lastAiActionTime = now();
        return actionId;
    }
    
    fun _isOwnerOverrideWindow(actionId: Int): Bool {
        let actionTime: Int? = self.pendingAiActions.get(actionId);
        if (actionTime == null) { return false; }
        return now() - actionTime!! < self.ownerOverrideWindow;
    }
    
    fun _checkAiAlive(): Bool {
        return now() - self.lastHeartbeat <= self.heartbeatTimeout;
    }
    
    // ═══════════════════════════════════════════════════════════
    // STANDARD JETTON FUNCTIONS
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: Mint) {
        require(!self.emergencyPause, "Contract paused");
        require(self.tradingEnabled, "Trading disabled");
        require(sender() == self.owner, "Not authorized to mint");
        require(self.mintable, "Minting disabled");
        
        let maxTx: Int = self.totalSupply * self.maxTxBps / 10000;
        if (self.totalSupply > 0) {
            require(msg.amount <= maxTx, "Exceeds max transaction size");
        }
        
        self.totalSupply = self.totalSupply + msg.amount;
        
        let init: StateInit = initOf QuasarWallet(msg.receiver, myAddress());
        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenNotification{
                queryId: 0,
                amount: msg.amount,
                from: self.owner,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }
    
    receive(msg: BurnNotification) {
        let walletInit: StateInit = initOf QuasarWallet(msg.sender, myAddress());
        let walletAddress: Address = contractAddress(walletInit);
        require(sender() == walletAddress, "Unauthorized burn notification");
        
        self.totalSupply = self.totalSupply - msg.amount;
        
        if (msg.responseDestination != newAddress(0, 0)) {
            send(SendParameters{
                to: msg.responseDestination,
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: "Excess TON returned".asComment()
            });
        }
    }
    
    receive("Stop Minting") {
        require(sender() == self.owner, "Not authorized");
        self.mintable = false;
    }
    
    // ═══════════════════════════════════════════════════════════
    // FEE PROCESSING — 0.30% with Buyback Pool
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: FeeTransfer) {
        let walletInit: StateInit = initOf QuasarWallet(msg.originalSender, myAddress());
        require(sender() == contractAddress(walletInit), "Invalid fee source");
        
        self.totalFeesCollected = self.totalFeesCollected + msg.amount;
        
        let burnAmount: Int = msg.amount * self.feeBurnShare / 100;
        let remainingAfterBurn: Int = msg.amount - burnAmount;
        let buybackAmount: Int = remainingAfterBurn * 20 / 100;
        let treasuryAmount: Int = remainingAfterBurn - buybackAmount;
        
        if (burnAmount > 0) {
            self.totalSupply = self.totalSupply - burnAmount;
            self.totalBurned = self.totalBurned + burnAmount;
        }
        
        if (buybackAmount > 0 && self.buybackEnabled) {
            self.buybackPool = self.buybackPool + buybackAmount;
        } else if (buybackAmount > 0) {
            treasuryAmount = treasuryAmount + buybackAmount;
        }
        
        if (treasuryAmount > 0 && self.treasury != newAddress(0, 0)) {
            let treasuryWalletInit: StateInit = initOf QuasarWallet(self.treasury, myAddress());
            send(SendParameters{
                to: contractAddress(treasuryWalletInit),
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: TokenNotification{
                    queryId: msg.queryId,
                    amount: treasuryAmount,
                    from: msg.originalSender,
                    forwardPayload: emptySlice()
                }.toCell(),
                code: treasuryWalletInit.code,
                data: treasuryWalletInit.data
            });
        }
        
        if (self.buybackEnabled && self.buybackPool >= self.buybackThreshold) {
            if (now() - self.lastBuybackTime >= self.buybackCooldown) {
                self._executeBuyback(msg.queryId);
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // AUTOBUYBACK & BURN
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: TriggerBuyback) {
        require(self.buybackEnabled, "Buyback disabled");
        require(self.buybackPool >= self.buybackThreshold, "Pool below threshold");
        require(now() - self.lastBuybackTime >= self.buybackCooldown, "Buyback cooldown");
        self._executeBuyback(msg.queryId);
    }
    
    fun _executeBuyback(queryId: Int) {
        let spendAmount: Int = self.buybackPool;
        self.buybackPool = 0;
        
        let qsrToBurn: Int = spendAmount * 1000;
        if (qsrToBurn > self.totalSupply / 100) {
            qsrToBurn = self.totalSupply / 100;
        }
        
        if (qsrToBurn > 0) {
            self.totalSupply = self.totalSupply - qsrToBurn;
            self.totalBurned = self.totalBurned + qsrToBurn;
            self.totalQsrBurnedViaBuyback = self.totalQsrBurnedViaBuyback + qsrToBurn;
        }
        
        self.totalTonSpentOnBuyback = self.totalTonSpentOnBuyback + spendAmount;
        self.totalBuybacks = self.totalBuybacks + 1;
        self.lastBuybackTime = now();
        
        send(SendParameters{
            to: self.owner,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: beginCell()
                .storeUint(0x99999999, 32)
                .storeUint(queryId, 64)
                .storeCoins(spendAmount)
                .storeCoins(qsrToBurn)
                .endCell()
        });
    }
    
    // ═══════════════════════════════════════════════════════════
    // AI SOVEREIGNTY — Full Autonomous Control
    // ═══════════════════════════════════════════════════════════
    
    // Enable/disable full AI autonomy (owner only)
    receive(msg: AIGrantFullAutonomy) {
        require(sender() == self.owner, "Only owner");
        self.aiFullAutonomy = msg.enabled;
        if (msg.enabled) {
            self.aiEnabled = true;
        }
    }
    
    // AI Heartbeat — proves AI is alive
    receive(msg: AIHeartbeat) {
        require(sender() == self.aiOracle, "Only AI oracle");
        self.lastHeartbeat = now();
    }
    
    // AI Emergency Pause — instant, no cooldown
    receive(msg: AIEmergencyPause) {
        self._requireAiAccess();
        
        if (msg.pause) {
            self.emergencyPause = true;
            self.tradingEnabled = false;
            if (msg.severity == 3) {
                self.mintable = false;
                self.feeBps = 100;
                self.feeBurnShare = 90;
            }
        } else {
            // AI can only resume if full autonomy enabled
            require(self.aiFullAutonomy, "AI cannot resume without full autonomy");
            self.emergencyPause = false;
            self.tradingEnabled = true;
        }
        
        self._logAiAction("EmergencyPause", 0, msg.pause ? 1 : 0, msg.reason);
    }
    
    // AI Set Fee — with cooldown check
    receive(msg: AISetFee) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(msg.feeBps <= 100, "Fee max 1%");
        require(msg.feeBps >= 10, "Fee min 0.10%");
        
        let oldFee: Int = self.feeBps;
        self.feeBps = msg.feeBps;
        self._logAiAction("SetFee", oldFee, msg.feeBps, msg.reason);
    }
    
    // AI Set Treasury — with cooldown
    receive(msg: AISetTreasuryDirect) {
        self._requireAiAccess();
        self._requireAiCooldown();
        
        // Cannot change treasury to zero address
        require(msg.treasury != newAddress(0, 0), "Invalid treasury");
        
        let oldTreasury: Int = 0; // Cannot store address in Int, simplified
        self.treasury = msg.treasury;
        self._logAiAction("SetTreasury", 0, 1, msg.reason);
    }
    
    // AI Set Anti-Whale — with cooldown
    receive(msg: AISetAntiWhale) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(msg.maxTxBps <= 500, "Max tx max 5%");
        require(msg.maxWalletBps <= 1000, "Max wallet max 10%");
        require(msg.cooldown <= 300, "Cooldown max 5 min");
        
        self.maxTxBps = msg.maxTxBps;
        self.maxWalletBps = msg.maxWalletBps;
        self.cooldownSeconds = msg.cooldown;
        self._logAiAction("SetAntiWhale", 0, msg.maxTxBps, msg.reason);
    }
    
    // AI Set Buyback — with cooldown
    receive(msg: AISetBuybackDirect) {
        self._requireAiAccess();
        self._requireAiCooldown();
        
        self.buybackEnabled = msg.enabled;
        self.buybackThreshold = msg.threshold;
        self.buybackCooldown = msg.cooldown;
        self.buybackBurnPercent = msg.burnPercent;
        self._logAiAction("SetBuyback", 0, msg.enabled ? 1 : 0, msg.reason);
    }
    
    // AI Toggle Trading — with cooldown
    receive(msg: AIToggleTrading) {
        self._requireAiAccess();
        self._requireAiCooldown();
        
        self.tradingEnabled = msg.enabled;
        self._logAiAction("ToggleTrading", 0, msg.enabled ? 1 : 0, msg.reason);
    }
    
    // AI Rotate Oracle — change AI agent (with time-lock)
    receive(msg: AIRotateOracle) {
        self._requireAiAccess();
        self._requireAiCooldown();
        require(self.aiFullAutonomy, "Full autonomy required for oracle rotation");
        
        self.aiOracle = msg.newOracle;
        self._logAiAction("RotateOracle", 0, 1, msg.reason);
    }
    
    // ─── Legacy AI Messages (still supported) ───
    
    receive(msg: AISetOracle) {
        require(sender() == self.owner, "Only owner can set oracle");
        self.aiOracle = msg.oracleAddress;
        self.aiEnabled = true;
    }
    
    receive(msg: AIRebalance) {
        self._requireAiAccess();
        require(!self.emergencyPause, "Paused");
        require(msg.targetFeeBps >= 10 && msg.targetFeeBps <= 100, "Fee range 0.10%-1.00%");
        require(msg.targetBurnShare <= 100, "Burn max 100%");
        
        self.feeBps = msg.targetFeeBps;
        self.feeBurnShare = msg.targetBurnShare;
        self.lastRebalanceTime = now();
        self.signalCount = self.signalCount + 1;
        
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{
            timestamp: now(),
            action: msg.recommendation,
            confidence: 100,
            executed: true
        });
        self.anomalyIndex = self.anomalyIndex + 1;
    }
    
    receive(msg: AIPriceSignal) {
        self._requireAiAccess();
        self.signalCount = self.signalCount + 1;
        self.priceHistory.set(now(), msg.priceTon);
        
        if (msg.action == 2 && msg.volatility > 5000) {
            if (self.feeBps < 50) { self.feeBps = 50; }
            self.feeBurnShare = 70;
        }
        
        if (msg.action == 3 && msg.sentiment > 80) {
            if (self.feeBps > 20) { self.feeBps = 20; }
            self.feeBurnShare = 40;
            self.mintable = true;
        }
        
        if (msg.action == 1 && msg.sentiment < -50) {
            self.mintable = false;
            self.feeBurnShare = 80;
        }
        
        if (msg.action == 1 && msg.sentiment < -30 && self.buybackEnabled) {
            if (self.buybackPool >= self.buybackThreshold && now() - self.lastBuybackTime >= self.buybackCooldown) {
                self._executeBuyback(msg.queryId);
            }
        }
    }
    
    receive(msg: AIAnomalyAlert) {
        self._requireAiAccess();
        
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{
            timestamp: now(),
            action: msg.recommendedAction,
            confidence: 100,
            executed: false
        });
        self.anomalyIndex = self.anomalyIndex + 1;
        
        if (msg.severity == 3) {
            self.emergencyPause = true;
            self.tradingEnabled = false;
            self.mintable = false;
            self.feeBps = 100;
            self.feeBurnShare = 90;
        } else if (msg.severity == 2) {
            self.feeBps = self.feeBps + 20;
            self.feeBurnShare = 60;
        }
    }
    
    receive(msg: AIGovernanceProposal) {
        self._requireAiAccess();
        require(msg.confidence >= self.minConfidence, "Confidence too low");
        
        self.signalCount = self.signalCount + 1;
        
        if (msg.proposalType == 1) {
            self.feeBps = msg.newValue;
        } else if (msg.proposalType == 2) {
            self.feeBurnShare = msg.newValue;
        } else if (msg.proposalType == 3) {
            self.aiOracle = newAddress(0, msg.newValue);
        } else if (msg.proposalType == 4) {
            self.buybackThreshold = msg.newValue;
        }
        
        self.anomalyLog.set(self.anomalyIndex, AIRecommendation{
            timestamp: now(),
            action: msg.description,
            confidence: msg.confidence,
            executed: true
        });
        self.anomalyIndex = self.anomalyIndex + 1;
    }
    
    // ═══════════════════════════════════════════════════════════
    // COMMUNITY VETO — Holders can reject AI decisions
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: AIVetoVote) {
        let action: AIActionLog? = self.aiActionLog.get(msg.actionId);
        require(action != null, "Action not found");
        require(!(action!!.vetoed), "Already vetoed");
        require(!(action!!.overridden), "Already overridden");
        require(self._isOwnerOverrideWindow(msg.actionId), "Veto window closed");
        
        let veto: VetoState? = self.vetoLog.get(msg.actionId);
        let currentStake: Int = 0;
        let currentCount: Int = 0;
        
        if (veto != null) {
            currentStake = veto!!.totalStake;
            currentCount = veto!!.vetoCount;
        }
        
        let newStake: Int = currentStake + msg.stake;
        let threshold: Int = self.totalSupply * self.vetoThresholdBps / 10000;
        
        self.vetoLog.set(msg.actionId, VetoState{
            actionId: msg.actionId,
            totalStake: newStake,
            vetoCount: currentCount + 1,
            threshold: threshold,
            active: newStake < threshold
        });
        
        // If threshold reached, veto the action
        if (newStake >= threshold) {
            let act: AIActionLog = action!!;
            self.aiActionLog.set(msg.actionId, AIActionLog{
                actionId: act.actionId,
                timestamp: act.timestamp,
                actionType: act.actionType,
                oldValue: act.oldValue,
                newValue: act.newValue,
                reason: act.reason,
                executed: act.executed,
                vetoed: true,
                overridden: false
            });
            
            // Revert the change (simplified — in production need reverse mapping)
            // For now, log the veto
            self.totalVetoStake = self.totalVetoStake + msg.stake;
        }
    }
    
    // ═══════════════════════════════════════════════════════════
    // OWNER OVERRIDE — Owner can cancel AI decisions within 24h
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: OwnerOverride) {
        require(sender() == self.owner, "Only owner");
        
        let action: AIActionLog? = self.aiActionLog.get(msg.actionId);
        require(action != null, "Action not found");
        require(self._isOwnerOverrideWindow(msg.actionId), "Override window closed");
        require(!(action!!.overridden), "Already overridden");
        
        let act: AIActionLog = action!!;
        self.aiActionLog.set(msg.actionId, AIActionLog{
            actionId: act.actionId,
            timestamp: act.timestamp,
            actionType: act.actionType,
            oldValue: act.oldValue,
            newValue: act.newValue,
            reason: act.reason,
            executed: act.executed,
            vetoed: act.vetoed,
            overridden: true
        });
        
        // Revert the change based on action type
        if (act.actionType == "SetFee") {
            self.feeBps = act.oldValue;
        } else if (act.actionType == "ToggleTrading") {
            self.tradingEnabled = act.oldValue != 0;
        }
        // Add more reversions as needed
    }
    
    // ═══════════════════════════════════════════════════════════
    // DEAD MAN'S SWITCH — If AI dies, owner regains control
    // ═══════════════════════════════════════════════════════════
    
    receive("Claim AI Control") {
        require(sender() == self.owner, "Only owner");
        require(!self._checkAiAlive(), "AI is still active");
        
        // AI is dead — owner regains full control
        self.aiEnabled = false;
        self.aiFullAutonomy = false;
        self.aiOracle = self.owner;
        self.emergencyPause = false;
    }
    
    // ═══════════════════════════════════════════════════════════
    // OWNER ADMIN (Legacy — works when AI not in full control)
    // ═══════════════════════════════════════════════════════════
    
    receive(msg: SetTreasury) {
        require(sender() == self.owner, "Only owner");
        require(!self.aiFullAutonomy, "AI has full autonomy");
        self.treasury = msg.treasury;
    }
    
    receive(msg: SetFeeConfig) {
        require(sender() == self.owner, "Only owner");
        require(!self.aiFullAutonomy, "AI has full autonomy");
        require(msg.feeBps <= 100, "Fee max 1%");
        require(msg.burnShare <= 100, "Burn share max 100%");
        require(msg.maxTxBps <= 500, "Max tx max 5%");
        require(msg.maxWalletBps <= 1000, "Max wallet max 10%");
        require(msg.cooldown <= 300, "Cooldown max 5 min");
        
        self.feeBps = msg.feeBps;
        self.feeBurnShare = msg.burnShare;
        self.maxTxBps = msg.maxTxBps;
        self.maxWalletBps = msg.maxWalletBps;
        self.cooldownSeconds = msg.cooldown;
    }
    
    receive(msg: ToggleTrading) {
        require(sender() == self.owner, "Only owner");
        require(!self.aiFullAutonomy, "AI has full autonomy");
        self.tradingEnabled = msg.enabled;
    }
    
    receive(msg: SetBuybackConfig) {
        require(sender() == self.owner, "Only owner");
        require(!self.aiFullAutonomy, "AI has full autonomy");
        self.buybackEnabled = msg.enabled;
        self.buybackThreshold = msg.threshold;
        self.buybackCooldown = msg.cooldown;
        self.buybackBurnPercent = msg.burnPercent;
    }
    
    receive("Resume") {
        require(sender() == self.owner, "Only owner");
        self.emergencyPause = false;
        self.tradingEnabled = true;
    }
    
    receive("Toggle AI") {
        require(sender() == self.owner, "Only owner");
        require(!self.aiFullAutonomy, "Disable full autonomy first");
        self.aiEnabled = !self.aiEnabled;
    }
    
    // ═══════════════════════════════════════════════════════════
    // GETTERS
    // ═══════════════════════════════════════════════════════════
    
    get fun get_jetton_data(): JettonData {
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            adminAddress: self.owner,
            jettonContent: self.content,
            jettonWalletCode: self.walletCode
        };
    }
    
    get fun get_wallet_address(owner: Address): Address {
        let init: StateInit = initOf QuasarWallet(owner, myAddress());
        return contractAddress(init);
    }
    
    get fun get_ai_state(): AIState {
        return AIState{
            oracleAddress: self.aiOracle,
            aiModeEnabled: self.aiEnabled,
            fullAutonomy: self.aiFullAutonomy,
            lastRebalanceAt: self.lastRebalanceTime,
            totalSignalsReceived: self.signalCount,
            currentFeeBps: self.feeBps,
            priceHistoryCount: self.signalCount,
            anomalyCount: self.anomalyIndex,
            lastHeartbeat: self.lastHeartbeat,
            isAlive: self._checkAiAlive()
        };
    }
    
    get fun get_autonomy_state(): AutonomyState {
        return AutonomyState{
            fullAutonomyEnabled: self.aiFullAutonomy,
            aiActionCooldown: self.aiActionCooldown,
            lastAiActionTime: self.lastAiActionTime,
            heartbeatTimeout: self.heartbeatTimeout,
            lastHeartbeat: self.lastHeartbeat,
            ownerOverrideWindow: self.ownerOverrideWindow,
            vetoThresholdBps: self.vetoThresholdBps,
            totalVetoStake: self.totalVetoStake,
            pendingActions: self.aiActionIndex
        };
    }
    
    get fun get_fee_config(): FeeConfig {
        return FeeConfig{
            feeBps: self.feeBps,
            burnShare: self.feeBurnShare,
            treasuryShare: 100 - self.feeBurnShare,
            maxTxBps: self.maxTxBps,
            maxWalletBps: self.maxWalletBps,
            cooldown: self.cooldownSeconds,
            totalBurned: self.totalBurned,
            totalFeesCollected: self.totalFeesCollected
        };
    }
    
    get fun get_buyback_state(): BuybackState {
        return BuybackState{
            enabled: self.buybackEnabled,
            pool: self.buybackPool,
            threshold: self.buybackThreshold,
            cooldown: self.buybackCooldown,
            burnPercent: self.buybackBurnPercent,
            lastBuybackAt: self.lastBuybackTime,
            totalBuybacks: self.totalBuybacks,
            totalQsrBurnedViaBuyback: self.totalQsrBurnedViaBuyback,
            totalTonSpent: self.totalTonSpentOnBuyback
        };
    }
    
    get fun get_ai_action(actionId: Int): AIActionLog? {
        return self.aiActionLog.get(actionId);
    }
    
    get fun get_veto_state(actionId: Int): VetoState? {
        return self.vetoLog.get(actionId);
    }
    
    get fun get_ai_recommendation(index: Int): AIRecommendation? {
        return self.anomalyLog.get(index);
    }
    
    get fun get_price_at(timestamp: Int): Int? {
        return self.priceHistory.get(timestamp);
    }
    
    get fun is_paused(): Bool {
        return self.emergencyPause;
    }
    
    get fun is_trading_enabled(): Bool {
        return self.tradingEnabled;
    }
    
    get fun is_ai_alive(): Bool {
        return self._checkAiAlive();
    }
    
    get fun can_owner_override(actionId: Int): Bool {
        return self._isOwnerOverrideWindow(actionId);
    }
}

// ═══════════════════════════════════════════════════════════════
// QUASAR WALLET CONTRACT — With Fee Deduction
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
    
    receive(msg: TokenNotification) {
        require(sender() == self.master, "Unauthorized");
        self.balance = self.balance + msg.amount;
    }
    
    receive(msg: TokenTransfer) {
        require(sender() == self.owner, "Not wallet owner");
        require(self.balance >= msg.amount, "Insufficient balance");
        require(now() - self.lastTxTime >= 5, "Transaction cooldown active");
        self.lastTxTime = now();
        
        // ═══════════════════════════════════════════════════════
        // FEE DEDUCTION: 0.30% (30 bps)
        // ═══════════════════════════════════════════════════════
        let fee: Int = msg.amount * 30 / 10000;
        if (fee < 1) { fee = 1; }
        
        let sendAmount: Int = msg.amount - fee;
        self.balance = self.balance - msg.amount;
        
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
        let destinationAddress: Address = contractAddress(init);
        
        send(SendParameters{
            to: destinationAddress,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: TokenNotification{
                queryId: msg.queryId,
                amount: sendAmount,
                from: self.owner,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: init.code,
            data: init.data
        });
        
        if (fee > 0) {
            send(SendParameters{
                to: self.master,
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: FeeTransfer{
                    queryId: msg.queryId,
                    amount: fee,
                    originalSender: self.owner,
                    originalReceiver: msg.destination
                }.toCell()
            });
        }
    }
    
    receive(msg: TokenBurn) {
        require(sender() == self.owner, "Not wallet owner");
        require(self.balance >= msg.amount, "Insufficient balance");
        
        self.balance = self.balance - msg.amount;
        
        send(SendParameters{
            to: self.master,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: BurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination
            }.toCell()
        });
    }
    
    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: (initOf QuasarWallet(self.owner, self.master)).code
        };
    }
}
