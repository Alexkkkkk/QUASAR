import "@gen/QuasarWallet.code"
// QUASAR Jetton Master. Historical Tact evidence is retained under docs/historical/.
// The external ABI is pinned to docs/abi/quasar-master.json.  This is a
// versioned Tolk layout: deployed Tact state data is not decoded by this code.
import "QuasarCommon"
import "QuasarMasterRecords"

const BUYBACK_CALLBACK_TIMEOUT = 3600
const MASTER_TRANSFER_QUERY_PREFIX: uint64 = 9223372036854775808
const MINT_QUERY_ID: uint64 = 18446744073709551615
const AI_DECISION_DOMAIN: uint32 = 0x51a5c3d2
const QUASAR_AI_PRICE_HISTORY_CAP = 2048
const QUASAR_AI_ANOMALY_CAP = 1024
const DAY_YEAR = 31536000
const ZERO_ADDRESS: address = address("0:0000000000000000000000000000000000000000000000000000000000000000")

// ABI messages.  Explicit headers must remain byte-for-byte compatible with
// the Tact ABI snapshot.  TEP-74 and TEP-89 messages live in QuasarCommon.
struct (0xb712ccbb) AcceptOwner {}

struct (0xea3f3bdd) AddVesting {
    beneficiary: address
    totalAmount: coins
    cliff: uint32
    duration: uint32
}

struct (0xdc63850b) AiAnomalyAlert {
    queryId: uint64
    severity: uint8
    anomalyType: uint8
    affectedWallets: uint32
    recommendedAction: string
}

struct (0xf5708ab5) AiEmergencyPause {
    queryId: uint64
    pause: bool
    severity: uint8
    reason: string
}

struct (0xd890b03f) AiGovernanceProposal {
    queryId: uint64
    proposalType: uint8
    newValue: int257
    description: string
    confidence: uint8
}

struct (0xc61e9667) AiGrantFullAutonomy {
    enabled: bool
}

struct (0x8f9872bd) AiHeartbeat {
    queryId: uint64
    status: string
}

struct (0x6920939f) AiPriceSignal {
    queryId: uint64
    priceTon: coins
    volatility: uint32
    sentiment: int8
    action: uint8
}

struct (0x2882f1e8) AiRebalance {
    queryId: uint64
    targetFeeBps: uint16
    targetBurnShare: uint8
    recommendation: string
}

struct (0x2fb11c16) AiRotateOracle {
    queryId: uint64
    newOracle: address
    reason: string
}

struct (0x10f7c0f7) AiSetAntiWhale {
    queryId: uint64
    maxTxBps: uint16
    maxWalletBps: uint16
    cooldown: uint16
    reason: string
}

struct (0x0952917d) AiSetBuybackDirect {
    queryId: uint64
    enabled: bool
    threshold: coins
    cooldown: uint32
    burnPercent: uint8
    reason: string
}

struct (0x17df7398) AiSetFee {
    queryId: uint64
    feeBps: uint16
    reason: string
}

struct (0x2a297933) AiSetOracle {
    oracleAddress: address
}

struct (0x79b9e4c3) AiSetTreasuryDirect {
    queryId: uint64
    treasury: address
    reason: string
}

struct (0x7a1e5c01) AiSignedDecision {
    queryId: uint64
    nonce: uint64
    validUntil: uint32
    action: uint8
    value: uint16
    payloadHash: uint256
    signature: bits512
}

struct (0x0490d605) AiToggleMinting {
    queryId: uint64
    enabled: bool
    reason: string
}

struct (0x2c7e91a4) BuybackTon {
    queryId: uint64
    tonAmount: coins
    qsrSwapped: coins
}

struct (0x2bbbd37d) CancelBuybackSwap {
    queryId: uint64
}

struct (0xb80506f0) CancelOwnerTransfer {}

struct (0xbe1052b1) ClaimReferralRewards {}

struct (0x094a1f7c) ClaimRewards {}

struct (0xf789340a) ClaimVested {}

struct (0x7a1e5c03) ClearAiOracleKey {}

struct (0x946a98b6) Deploy {
    queryId: uint64
}

struct (0xaff90f57) DeployOk {
    queryId: uint64
}

struct (0x3ca953c4) GovernanceVote {
    proposalId: uint64
    kind: uint8
    flag: bool
    feeBps: uint16
    deadline: uint32
    reason: string
}

struct (0xb95497db) GuardianPause {
    reason: string
}

struct (0x09d21b11) OwnerOverride {
    actionId: uint64
    reason: string
}

struct (0x73cff78b) ProposeContent {
    newContent: cell
}

struct (0x80bb6173) ProposeOwner {
    newOwner: address
}

struct (0xef2d3719) ProposeWalletCode {
    newWalletCode: cell
}

struct (0xd1e47502) RefundPendingDeposit {}

struct (0xd3b50b23) RegisterReferral {
    referrer: address
}

struct (0x7d820191) ReleaseVeto {
    actionId: uint64
}

struct (0x7a1e5c02) SetAiOracleKey {
    publicKey: uint256
}

struct (0x83b8144a) SetBuybackConfig {
    enabled: bool
    threshold: coins
    cooldown: uint32
    burnPercent: uint8
}

struct (0x23019716) SetDefiAddress {
    defiAddress: address
}

struct (0xca8647d3) SetEmergencyGuardian {
    guardian: address
}

struct (0x3c134728) SetFeeConfig {
    feeBps: uint16
    burnShare: uint8
    maxTxBps: uint16
    maxWalletBps: uint16
    cooldown: uint16
}

struct (0x1ab0a142) SetReferralConfig {
    enabled: bool
    rewardBps: uint16
}

struct (0x13bd6b32) SetStakingConfig {
    enabled: bool
    apyBps: uint16
    minStake: coins
    lockPeriod: uint32
}

struct (0xcfc66cbd) SetTreasury {
    treasury: address
}

struct (0xbef0e904) Stake {
    amount: coins
}

struct (0x871208ba) SweepTon {
    amount: coins
}

struct (0xf1822da1) ToggleMinting {
    enabled: bool
}

struct (0xcfe1fd3c) TriggerBuyback {
    queryId: uint64
}

struct (0xff633be1) Unstake {
    amount: coins
}

struct (0xd2715d2c) VetoAiAction {
    actionId: uint64
    amount: coins
}

// Event bodies are external logs.  They retain the Tact name-derived headers.
struct (0x557e2fb5) EventMint {
    amount: int257
    receiver: address
}

struct (0xdd8529b9) EventBurn {
    amount: int257
    burner: address
}

struct (0x7cd3411d) EventBuybackExecuted {
    tonSpent: int257
    qsrBurned: int257
}

struct (0xdca2c249) EventBuybackSwapped {
    queryId: uint64
    qsrIn: int257
    tonOut: int257
}

struct (0xd7d8437c) EventStake {
    staker: address
    amount: int257
}

struct (0x2558c2bd) EventUnstake {
    staker: address
    amount: int257
}

struct (0x5fd0c66d) EventReferralRegistered {
    user: address
    referrer: address
}

struct (0x74c2e9f4) EventVestingClaimed {
    beneficiary: address
    amount: int257
}

struct (0x557457e9) EventAiAction {
    actionId: int257
    actionType: string
    oldValue: int257
    newValue: int257
}

struct (0xfaf5a7b7) EventAdminConfig {
    action: string
    actor: address
    valueA: int257
    valueB: int257
}

struct (0x42c965c8) EventEmergencyPause {
    guardian: address
    paused: bool
    reason: string
}

struct (0xe4b28f1a) EventGovernanceVote {
    voter: address
    proposalId: int257
    weight: int257
}

struct (0x13767d9e) EventGovernanceExecuted {
    proposalId: int257
    actionId: int257
}

struct (0x76d41019) EventAiVetoReleased {
    actionId: int257
    voter: address
    amount: int257
}

struct JettonData {
    totalSupply: int257
    mintable: bool
    adminAddress: address
    jettonContent: cell
    jettonWalletCode: cell
}

struct AiState {
    oracleAddress: address
    aiModeEnabled: bool
    fullAutonomy: bool
    lastRebalanceAt: int257
    totalSignalsReceived: int257
    currentFeeBps: int257
    priceHistoryCount: int257
    anomalyCount: int257
    lastHeartbeat: int257
    isAlive: bool
    lastQueryId: int257
}

struct FeeConfig {
    feeBps: int257
    burnShare: int257
    treasuryShare: int257
    maxTxBps: int257
    maxWalletBps: int257
    cooldown: int257
    totalBurned: int257
    totalFeesCollected: int257
}

struct BuybackState {
    enabled: bool
    pool: int257
    threshold: int257
    cooldown: int257
    burnPercent: int257
    buybackSwapPending: int257
    buybackSwapQueryId: int257
    lastBuybackAt: int257
    totalBuybacks: int257
    totalQsrBurnedViaBuyback: int257
    totalTonSpent: int257
}

struct AutonomyState {
    fullAutonomyEnabled: bool
    aiActionCooldown: int257
    lastAiActionTime: int257
    heartbeatTimeout: int257
    lastHeartbeat: int257
    ownerOverrideWindow: int257
    vetoThresholdBps: int257
    totalVetoStake: int257
    pendingActions: int257
}

struct AiRecommendation {
    timestamp: int257
    action: string
    confidence: int257
    executed: bool
}

struct StakingConfig {
    enabled: bool
    apyBps: int257
    minStake: int257
    lockPeriod: int257
    totalStaked: int257
}

struct ReferralConfig {
    enabled: bool
    rewardBps: int257
}

struct ReserveSnapshot {
    reserveBalance: int257
    freeReserve: int257
    buybackPool: int257
    stakingRewardsPool: int257
    referralLiability: int257
    custodyBalance: int257
    totalStaked: int257
    totalSupply: int257
}

struct UserLiabilitySnapshot {
    pendingQsrDeposit: int257
    stakedPrincipal: int257
    pendingReferralReward: int257
    vestedUnclaimed: int257
}

struct GovernanceState {
    quorumBps: int257
    totalStaked: int257
    proposals: int257
}

// This is intentionally a separate, versioned state layout.  The previous WIP
// claimed equivalence but could not deserialize or execute; a live Tact cell
// must be migrated off-chain/through a dedicated migration contract, not fed to
// this code under the false assumption of an equal StateInit hash.
// The top-level layout uses four cells-of-state groups.  It is deliberately
// versioned (rather than claiming byte compatibility with a Tact StateInit).
@overflow1023_policy("suppress")
struct MasterCore {
    totalSupply: coins
    maxSupply: coins
    mintable: bool
    owner: address
    pendingOwner: address
    ownerTransferAt: int257
    ownerTransferDelay: uint32
    content: cell
    walletCode: cell
    reserveBalance: coins
    custodyBalance: coins
    custodyPayoutSeq: uint64
    feeBps: uint16
    feeBurnShare: uint8
    treasury: address
    totalBurned: coins
    totalFeesCollected: coins
    maxTxBps: uint16
    maxWalletBps: uint16
    cooldownSeconds: uint16
    tradingEnabled: bool
    buybackEnabled: bool
    buybackPool: coins
    buybackThreshold: coins
    buybackCooldown: uint32
    buybackBurnPercent: uint8
    buybackSwapPending: coins
    buybackSwapQueryId: uint64
    buybackSwapDefiAddress: address
    buybackQueries: map<int257, bool>
    lastBuybackTime: int257
    totalBuybacks: int257
    totalQsrBurnedViaBuyback: coins
    totalTonSpentOnBuyback: coins
    emergencyGuardian: address
    defiAddress: address
    defiFeeShareBps: uint16
}

// MasterCore contains more data than one TVM cell can hold. Keep its declared
// field order, but make every reference boundary explicit instead of relying on
// @overflow1023_policy("suppress"), which merely defers overflow to runtime.
fun MasterCore.unpackFromSlice(mutate root: slice): MasterCore {
    val totalSupply = root.loadCoins();
    val maxSupply = root.loadCoins();
    val mintable = root.loadBool();
    val owner = root.loadAddress();

    var ownerTail = root.loadRef().beginParse();
    val pendingOwner = ownerTail.loadAddress();
    val ownerTransferAt = ownerTail.loadInt(257) as int257;
    val ownerTransferDelay = ownerTail.loadUint(32) as uint32;
    val content = ownerTail.loadRef();
    val walletCode = ownerTail.loadRef();

    var reserveTail = ownerTail.loadRef().beginParse();
    val reserveBalance = reserveTail.loadCoins();
    val custodyBalance = reserveTail.loadCoins();
    val custodyPayoutSeq = reserveTail.loadUint(64) as uint64;
    val feeBps = reserveTail.loadUint(16) as uint16;
    val feeBurnShare = reserveTail.loadUint(8) as uint8;
    val treasury = reserveTail.loadAddress();
    val totalBurned = reserveTail.loadCoins();
    val totalFeesCollected = reserveTail.loadCoins();
    val maxTxBps = reserveTail.loadUint(16) as uint16;
    val maxWalletBps = reserveTail.loadUint(16) as uint16;
    val cooldownSeconds = reserveTail.loadUint(16) as uint16;
    val tradingEnabled = reserveTail.loadBool();

    var buybackTail = reserveTail.loadRef().beginParse();
    val buybackEnabled = buybackTail.loadBool();
    val buybackPool = buybackTail.loadCoins();
    val buybackThreshold = buybackTail.loadCoins();
    val buybackCooldown = buybackTail.loadUint(32) as uint32;
    val buybackBurnPercent = buybackTail.loadUint(8) as uint8;
    val buybackSwapPending = buybackTail.loadCoins();
    val buybackSwapQueryId = buybackTail.loadUint(64) as uint64;
    val buybackSwapDefiAddress = buybackTail.loadAddress();
    val buybackQueries = createMapFromLowLevelDict<int257, bool>(buybackTail.loadDict());

    var statsTail = buybackTail.loadRef().beginParse();
    val lastBuybackTime = statsTail.loadInt(257) as int257;
    val totalBuybacks = statsTail.loadInt(257) as int257;
    val totalQsrBurnedViaBuyback = statsTail.loadCoins();
    val totalTonSpentOnBuyback = statsTail.loadCoins();

    var endpointTail = statsTail.loadRef().beginParse();
    val emergencyGuardian = endpointTail.loadAddress();
    val defiAddress = endpointTail.loadAddress();
    val defiFeeShareBps = endpointTail.loadUint(16) as uint16;
    endpointTail.assertEnd();
    statsTail.assertEnd();
    buybackTail.assertEnd();
    reserveTail.assertEnd();
    ownerTail.assertEnd();
    root.assertEnd();
    return {
        totalSupply,
        maxSupply,
        mintable,
        owner,
        pendingOwner,
        ownerTransferAt,
        ownerTransferDelay,
        content,
        walletCode,
        reserveBalance,
        custodyBalance,
        custodyPayoutSeq,
        feeBps,
        feeBurnShare,
        treasury,
        totalBurned,
        totalFeesCollected,
        maxTxBps,
        maxWalletBps,
        cooldownSeconds,
        tradingEnabled,
        buybackEnabled,
        buybackPool,
        buybackThreshold,
        buybackCooldown,
        buybackBurnPercent,
        buybackSwapPending,
        buybackSwapQueryId,
        buybackSwapDefiAddress,
        buybackQueries,
        lastBuybackTime,
        totalBuybacks,
        totalQsrBurnedViaBuyback,
        totalTonSpentOnBuyback,
        emergencyGuardian,
        defiAddress,
        defiFeeShareBps,
    };
}

fun MasterCore.packToBuilder(self, mutate root: builder) {
    var endpointTail = beginCell();
    endpointTail.storeAddress(self.emergencyGuardian);
    endpointTail.storeAddress(self.defiAddress);
    endpointTail.storeUint(self.defiFeeShareBps, 16);

    var statsTail = beginCell();
    statsTail.storeInt(self.lastBuybackTime, 257);
    statsTail.storeInt(self.totalBuybacks, 257);
    statsTail.storeCoins(self.totalQsrBurnedViaBuyback);
    statsTail.storeCoins(self.totalTonSpentOnBuyback);
    statsTail.storeRef(endpointTail.endCell());

    var buybackTail = beginCell();
    buybackTail.storeBool(self.buybackEnabled);
    buybackTail.storeCoins(self.buybackPool);
    buybackTail.storeCoins(self.buybackThreshold);
    buybackTail.storeUint(self.buybackCooldown, 32);
    buybackTail.storeUint(self.buybackBurnPercent, 8);
    buybackTail.storeCoins(self.buybackSwapPending);
    buybackTail.storeUint(self.buybackSwapQueryId, 64);
    buybackTail.storeAddress(self.buybackSwapDefiAddress);
    buybackTail.storeDict(self.buybackQueries.toLowLevelDict());
    buybackTail.storeRef(statsTail.endCell());

    var reserveTail = beginCell();
    reserveTail.storeCoins(self.reserveBalance);
    reserveTail.storeCoins(self.custodyBalance);
    reserveTail.storeUint(self.custodyPayoutSeq, 64);
    reserveTail.storeUint(self.feeBps, 16);
    reserveTail.storeUint(self.feeBurnShare, 8);
    reserveTail.storeAddress(self.treasury);
    reserveTail.storeCoins(self.totalBurned);
    reserveTail.storeCoins(self.totalFeesCollected);
    reserveTail.storeUint(self.maxTxBps, 16);
    reserveTail.storeUint(self.maxWalletBps, 16);
    reserveTail.storeUint(self.cooldownSeconds, 16);
    reserveTail.storeBool(self.tradingEnabled);
    reserveTail.storeRef(buybackTail.endCell());

    var ownerTail = beginCell();
    ownerTail.storeAddress(self.pendingOwner);
    ownerTail.storeInt(self.ownerTransferAt, 257);
    ownerTail.storeUint(self.ownerTransferDelay, 32);
    ownerTail.storeRef(self.content);
    ownerTail.storeRef(self.walletCode);
    ownerTail.storeRef(reserveTail.endCell());

    root.storeCoins(self.totalSupply);
    root.storeCoins(self.maxSupply);
    root.storeBool(self.mintable);
    root.storeAddress(self.owner);
    root.storeRef(ownerTail.endCell());
}

@overflow1023_policy("suppress")
struct MasterAi {
    aiOracle: address
    aiEnabled: bool
    aiFullAutonomy: bool
    lastRebalanceTime: int257
    signalCount: int257
    priceHistoryCount: int257
    priceHistory: map<int257, int257>
    anomalyLog: map<int257, AiRecommendation>
    anomalyIndex: int257
    priceHistoryDropped: int257
    anomalyDropped: int257
    minConfidence: uint8
    emergencyPause: bool
    aiActionCooldown: uint32
    lastAiActionTime: int257
    lastAiQueryId: uint64
    heartbeatTimeout: uint32
    lastHeartbeat: int257
    ownerOverrideWindow: uint32
    vetoThresholdBps: uint16
    aiActionLog: map<int257, AiActionLog>
    aiActionKind: map<int257, int257>
    pendingAiActions: map<int257, int257>
    aiActionOldAddress: map<int257, address>
    aiActionOldFeeBps: map<int257, int257>
    aiActionOldMintable: map<int257, int257>
    aiActionOldEmergencyPause: map<int257, int257>
    aiActionOldTrading: map<int257, int257>
    aiActionOldBurnShare: map<int257, int257>
    aiActionOldMaxTxBps: map<int257, int257>
    aiActionOldMaxWalletBps: map<int257, int257>
    aiActionOldCooldownSeconds: map<int257, int257>
    aiActionOldBuybackThreshold: map<int257, int257>
    aiActionOldBuybackCooldown: map<int257, int257>
    aiActionOldBuybackBurnPercent: map<int257, int257>
    totalVetoStake: coins
    vetoEscrows: map<int257, int257>
    vetoActionStake: map<int257, int257>
    aiOraclePubKey: uint256
    aiNonce: uint64
    aiSignedDecisionCount: int257
    aiActionIndex: int257
}

// Keep the AI ledgers in five bounded map cells. Each of the first five cells
// contains no more than three dictionary references plus the next link.
fun MasterAi.unpackFromSlice(mutate root: slice): MasterAi {
    val aiOracle = root.loadAddress();
    val aiEnabled = root.loadBool();
    val aiFullAutonomy = root.loadBool();

    var historyTail = root.loadRef().beginParse();
    val lastRebalanceTime = historyTail.loadInt(257) as int257;
    val signalCount = historyTail.loadInt(257) as int257;
    val priceHistoryCount = historyTail.loadInt(257) as int257;
    val priceHistory = createMapFromLowLevelDict<int257, int257>(historyTail.loadDict());
    val anomalyLog = createMapFromLowLevelDict<int257, AiRecommendation>(historyTail.loadDict());

    var counterTail = historyTail.loadRef().beginParse();
    val anomalyIndex = counterTail.loadInt(257) as int257;
    val priceHistoryDropped = counterTail.loadInt(257) as int257;
    val anomalyDropped = counterTail.loadInt(257) as int257;
    val minConfidence = counterTail.loadUint(8) as uint8;
    val emergencyPause = counterTail.loadBool();
    val aiActionCooldown = counterTail.loadUint(32) as uint32;

    var heartbeatTail = counterTail.loadRef().beginParse();
    val lastAiActionTime = heartbeatTail.loadInt(257) as int257;
    val lastAiQueryId = heartbeatTail.loadUint(64) as uint64;
    val heartbeatTimeout = heartbeatTail.loadUint(32) as uint32;
    val lastHeartbeat = heartbeatTail.loadInt(257) as int257;
    val ownerOverrideWindow = heartbeatTail.loadUint(32) as uint32;
    val vetoThresholdBps = heartbeatTail.loadUint(16) as uint16;

    var actionTail1 = heartbeatTail.loadRef().beginParse();
    val aiActionLog = createMapFromLowLevelDict<int257, AiActionLog>(actionTail1.loadDict());
    val aiActionKind = createMapFromLowLevelDict<int257, int257>(actionTail1.loadDict());
    val pendingAiActions = createMapFromLowLevelDict<int257, int257>(actionTail1.loadDict());

    var actionTail2 = actionTail1.loadRef().beginParse();
    val aiActionOldAddress = createMapFromLowLevelDict<int257, address>(actionTail2.loadDict());
    val aiActionOldFeeBps = createMapFromLowLevelDict<int257, int257>(actionTail2.loadDict());
    val aiActionOldMintable = createMapFromLowLevelDict<int257, int257>(actionTail2.loadDict());

    var actionTail3 = actionTail2.loadRef().beginParse();
    val aiActionOldEmergencyPause = createMapFromLowLevelDict<int257, int257>(
        actionTail3.loadDict(),
    );
    val aiActionOldTrading = createMapFromLowLevelDict<int257, int257>(actionTail3.loadDict());
    val aiActionOldBurnShare = createMapFromLowLevelDict<int257, int257>(actionTail3.loadDict());

    var actionTail4 = actionTail3.loadRef().beginParse();
    val aiActionOldMaxTxBps = createMapFromLowLevelDict<int257, int257>(actionTail4.loadDict());
    val aiActionOldMaxWalletBps = createMapFromLowLevelDict<int257, int257>(actionTail4.loadDict());
    val aiActionOldCooldownSeconds = createMapFromLowLevelDict<int257, int257>(
        actionTail4.loadDict(),
    );

    var actionTail5 = actionTail4.loadRef().beginParse();
    val aiActionOldBuybackThreshold = createMapFromLowLevelDict<int257, int257>(
        actionTail5.loadDict(),
    );
    val aiActionOldBuybackCooldown = createMapFromLowLevelDict<int257, int257>(
        actionTail5.loadDict(),
    );
    val aiActionOldBuybackBurnPercent = createMapFromLowLevelDict<int257, int257>(
        actionTail5.loadDict(),
    );

    var vetoTail = actionTail5.loadRef().beginParse();
    val totalVetoStake = vetoTail.loadCoins();
    val vetoEscrows = createMapFromLowLevelDict<int257, int257>(vetoTail.loadDict());
    val vetoActionStake = createMapFromLowLevelDict<int257, int257>(vetoTail.loadDict());
    val aiOraclePubKey = vetoTail.loadUint(256) as uint256;
    val aiNonce = vetoTail.loadUint(64) as uint64;
    val aiSignedDecisionCount = vetoTail.loadInt(257) as int257;
    val aiActionIndex = vetoTail.loadInt(257) as int257;
    vetoTail.assertEnd();
    actionTail5.assertEnd();
    actionTail4.assertEnd();
    actionTail3.assertEnd();
    actionTail2.assertEnd();
    actionTail1.assertEnd();
    heartbeatTail.assertEnd();
    counterTail.assertEnd();
    historyTail.assertEnd();
    root.assertEnd();
    return {
        aiOracle,
        aiEnabled,
        aiFullAutonomy,
        lastRebalanceTime,
        signalCount,
        priceHistoryCount,
        priceHistory,
        anomalyLog,
        anomalyIndex,
        priceHistoryDropped,
        anomalyDropped,
        minConfidence,
        emergencyPause,
        aiActionCooldown,
        lastAiActionTime,
        lastAiQueryId,
        heartbeatTimeout,
        lastHeartbeat,
        ownerOverrideWindow,
        vetoThresholdBps,
        aiActionLog,
        aiActionKind,
        pendingAiActions,
        aiActionOldAddress,
        aiActionOldFeeBps,
        aiActionOldMintable,
        aiActionOldEmergencyPause,
        aiActionOldTrading,
        aiActionOldBurnShare,
        aiActionOldMaxTxBps,
        aiActionOldMaxWalletBps,
        aiActionOldCooldownSeconds,
        aiActionOldBuybackThreshold,
        aiActionOldBuybackCooldown,
        aiActionOldBuybackBurnPercent,
        totalVetoStake,
        vetoEscrows,
        vetoActionStake,
        aiOraclePubKey,
        aiNonce,
        aiSignedDecisionCount,
        aiActionIndex,
    };
}

fun MasterAi.packToBuilder(self, mutate root: builder) {
    var vetoTail = beginCell();
    vetoTail.storeCoins(self.totalVetoStake);
    vetoTail.storeDict(self.vetoEscrows.toLowLevelDict());
    vetoTail.storeDict(self.vetoActionStake.toLowLevelDict());
    vetoTail.storeUint(self.aiOraclePubKey, 256);
    vetoTail.storeUint(self.aiNonce, 64);
    vetoTail.storeInt(self.aiSignedDecisionCount, 257);
    vetoTail.storeInt(self.aiActionIndex, 257);

    var actionTail5 = beginCell();
    actionTail5.storeDict(self.aiActionOldBuybackThreshold.toLowLevelDict());
    actionTail5.storeDict(self.aiActionOldBuybackCooldown.toLowLevelDict());
    actionTail5.storeDict(self.aiActionOldBuybackBurnPercent.toLowLevelDict());
    actionTail5.storeRef(vetoTail.endCell());

    var actionTail4 = beginCell();
    actionTail4.storeDict(self.aiActionOldMaxTxBps.toLowLevelDict());
    actionTail4.storeDict(self.aiActionOldMaxWalletBps.toLowLevelDict());
    actionTail4.storeDict(self.aiActionOldCooldownSeconds.toLowLevelDict());
    actionTail4.storeRef(actionTail5.endCell());

    var actionTail3 = beginCell();
    actionTail3.storeDict(self.aiActionOldEmergencyPause.toLowLevelDict());
    actionTail3.storeDict(self.aiActionOldTrading.toLowLevelDict());
    actionTail3.storeDict(self.aiActionOldBurnShare.toLowLevelDict());
    actionTail3.storeRef(actionTail4.endCell());

    var actionTail2 = beginCell();
    actionTail2.storeDict(self.aiActionOldAddress.toLowLevelDict());
    actionTail2.storeDict(self.aiActionOldFeeBps.toLowLevelDict());
    actionTail2.storeDict(self.aiActionOldMintable.toLowLevelDict());
    actionTail2.storeRef(actionTail3.endCell());

    var actionTail1 = beginCell();
    actionTail1.storeDict(self.aiActionLog.toLowLevelDict());
    actionTail1.storeDict(self.aiActionKind.toLowLevelDict());
    actionTail1.storeDict(self.pendingAiActions.toLowLevelDict());
    actionTail1.storeRef(actionTail2.endCell());

    var heartbeatTail = beginCell();
    heartbeatTail.storeInt(self.lastAiActionTime, 257);
    heartbeatTail.storeUint(self.lastAiQueryId, 64);
    heartbeatTail.storeUint(self.heartbeatTimeout, 32);
    heartbeatTail.storeInt(self.lastHeartbeat, 257);
    heartbeatTail.storeUint(self.ownerOverrideWindow, 32);
    heartbeatTail.storeUint(self.vetoThresholdBps, 16);
    heartbeatTail.storeRef(actionTail1.endCell());

    var counterTail = beginCell();
    counterTail.storeInt(self.anomalyIndex, 257);
    counterTail.storeInt(self.priceHistoryDropped, 257);
    counterTail.storeInt(self.anomalyDropped, 257);
    counterTail.storeUint(self.minConfidence, 8);
    counterTail.storeBool(self.emergencyPause);
    counterTail.storeUint(self.aiActionCooldown, 32);
    counterTail.storeRef(heartbeatTail.endCell());

    var historyTail = beginCell();
    historyTail.storeInt(self.lastRebalanceTime, 257);
    historyTail.storeInt(self.signalCount, 257);
    historyTail.storeInt(self.priceHistoryCount, 257);
    historyTail.storeDict(self.priceHistory.toLowLevelDict());
    historyTail.storeDict(self.anomalyLog.toLowLevelDict());
    historyTail.storeRef(counterTail.endCell());

    root.storeAddress(self.aiOracle);
    root.storeBool(self.aiEnabled);
    root.storeBool(self.aiFullAutonomy);
    root.storeRef(historyTail.endCell());
}

@overflow1023_policy("suppress")
struct MasterUser {
    stakingEnabled: bool
    stakingApyBps: uint16
    stakingMinStake: coins
    stakingLockPeriod: uint32
    stakers: map<address, StakeInfo>
    totalStaked: coins
    stakingRewardsPool: coins
    pendingQsrDeposits: map<address, int257>
    referralEnabled: bool
    referralRewardBps: uint16
    referrals: map<address, ReferralInfo>
    pendingReferralRewards: map<address, int257>
    pendingReferralTotal: coins
    vestingEnabled: bool
    teamAllocation: coins
    teamClaimed: coins
    vestingSchedules: map<address, VestingInfo>
}

fun MasterUser.packToBuilder(self, mutate root: builder) {
    val referrals = beginCell()
        .storeBool(self.referralEnabled)
        .storeUint(self.referralRewardBps, 16)
        .storeDict(self.referrals.toLowLevelDict())
        .storeDict(self.pendingReferralRewards.toLowLevelDict())
        .storeCoins(self.pendingReferralTotal)
        .endCell();
    val vesting = beginCell()
        .storeBool(self.vestingEnabled)
        .storeCoins(self.teamAllocation)
        .storeCoins(self.teamClaimed)
        .storeDict(self.vestingSchedules.toLowLevelDict())
        .endCell();
    root.storeBool(self.stakingEnabled);
    root.storeUint(self.stakingApyBps, 16);
    root.storeCoins(self.stakingMinStake);
    root.storeUint(self.stakingLockPeriod, 32);
    root.storeDict(self.stakers.toLowLevelDict());
    root.storeCoins(self.totalStaked);
    root.storeCoins(self.stakingRewardsPool);
    root.storeDict(self.pendingQsrDeposits.toLowLevelDict());
    root.storeRef(referrals);
    root.storeRef(vesting);
}

fun MasterUser.unpackFromSlice(mutate root: slice): MasterUser {
    val stakingEnabled = root.loadBool();
    val stakingApyBps = root.loadUint(16) as uint16;
    val stakingMinStake = root.loadCoins();
    val stakingLockPeriod = root.loadUint(32) as uint32;
    val stakers = createMapFromLowLevelDict<address, StakeInfo>(root.loadDict());
    val totalStaked = root.loadCoins();
    val stakingRewardsPool = root.loadCoins();
    val pendingQsrDeposits = createMapFromLowLevelDict<address, int257>(root.loadDict());
    var referralsTail = root.loadRef().beginParse();
    val referralEnabled = referralsTail.loadBool();
    val referralRewardBps = referralsTail.loadUint(16) as uint16;
    val referrals = createMapFromLowLevelDict<address, ReferralInfo>(referralsTail.loadDict());
    val pendingReferralRewards = createMapFromLowLevelDict<address, int257>(
        referralsTail.loadDict(),
    );
    val pendingReferralTotal = referralsTail.loadCoins();
    var vestingTail = root.loadRef().beginParse();
    val vestingEnabled = vestingTail.loadBool();
    val teamAllocation = vestingTail.loadCoins();
    val teamClaimed = vestingTail.loadCoins();
    val vestingSchedules = createMapFromLowLevelDict<address, VestingInfo>(vestingTail.loadDict());
    root.assertEnd();
    referralsTail.assertEnd();
    vestingTail.assertEnd();
    return {
        stakingEnabled,
        stakingApyBps,
        stakingMinStake,
        stakingLockPeriod,
        stakers,
        totalStaked,
        stakingRewardsPool,
        pendingQsrDeposits,
        referralEnabled,
        referralRewardBps,
        referrals,
        pendingReferralRewards,
        pendingReferralTotal,
        vestingEnabled,
        teamAllocation,
        teamClaimed,
        vestingSchedules,
    };
}

@overflow1023_policy("suppress")
struct MasterGov {
    govQuorumBps: uint16
    govVotes: map<int257, bool>
    govProposalStake: map<int257, int257>
    govProposalCount: int257
    govProposalExecuted: map<int257, bool>
    pendingFee: uint16
    pendingFeeBurnShare: int257
    pendingMaxTx: uint16
    pendingMaxWallet: uint16
    pendingCooldown: uint16
    pendingFeeConfigAt: int257
    pendingWalletCode: cell?
    walletCodeAt: int257
    pendingContent: cell?
    contentAt: int257
    pendingMasterPayouts: map<int257, PendingMasterPayout>
    masterPayoutSeq: uint64
    govProposalContentHash: map<int257, int257>
}

fun MasterGov.unpackFromSlice(mutate root: slice): MasterGov {
    val govQuorumBps = root.loadUint(16) as uint16;
    val govVotes = createMapFromLowLevelDict<int257, bool>(root.loadDict());
    val govProposalStake = createMapFromLowLevelDict<int257, int257>(root.loadDict());
    val govProposalCount = root.loadInt(257) as int257;
    val govProposalExecuted = createMapFromLowLevelDict<int257, bool>(root.loadDict());

    var feeTail = root.loadRef().beginParse();
    val pendingFee = feeTail.loadUint(16) as uint16;
    val pendingFeeBurnShare = feeTail.loadInt(257) as int257;
    val pendingMaxTx = feeTail.loadUint(16) as uint16;
    val pendingMaxWallet = feeTail.loadUint(16) as uint16;
    val pendingCooldown = feeTail.loadUint(16) as uint16;
    val pendingFeeConfigAt = feeTail.loadInt(257) as int257;
    val pendingWalletCode = feeTail.loadMaybeRef();
    val walletCodeAt = feeTail.loadInt(257) as int257;

    var contentTail = feeTail.loadRef().beginParse();
    val pendingContent = contentTail.loadMaybeRef();
    val contentAt = contentTail.loadInt(257) as int257;
    val pendingMasterPayouts = createMapFromLowLevelDict<int257, PendingMasterPayout>(
        contentTail.loadDict(),
    );
    val masterPayoutSeq = contentTail.loadUint(64) as uint64;
    val govProposalContentHash = createMapFromLowLevelDict<int257, int257>(contentTail.loadDict());
    contentTail.assertEnd();
    feeTail.assertEnd();
    root.assertEnd();
    return {
        govQuorumBps,
        govVotes,
        govProposalStake,
        govProposalCount,
        govProposalExecuted,
        pendingFee,
        pendingFeeBurnShare,
        pendingMaxTx,
        pendingMaxWallet,
        pendingCooldown,
        pendingFeeConfigAt,
        pendingWalletCode,
        walletCodeAt,
        pendingContent,
        contentAt,
        pendingMasterPayouts,
        masterPayoutSeq,
        govProposalContentHash,
    };
}

fun MasterGov.packToBuilder(self, mutate root: builder) {
    var contentTail = beginCell();
    contentTail.storeMaybeRef(self.pendingContent);
    contentTail.storeInt(self.contentAt, 257);
    contentTail.storeDict(self.pendingMasterPayouts.toLowLevelDict());
    contentTail.storeUint(self.masterPayoutSeq, 64);
    contentTail.storeDict(self.govProposalContentHash.toLowLevelDict());

    var feeTail = beginCell();
    feeTail.storeUint(self.pendingFee, 16);
    feeTail.storeInt(self.pendingFeeBurnShare, 257);
    feeTail.storeUint(self.pendingMaxTx, 16);
    feeTail.storeUint(self.pendingMaxWallet, 16);
    feeTail.storeUint(self.pendingCooldown, 16);
    feeTail.storeInt(self.pendingFeeConfigAt, 257);
    feeTail.storeMaybeRef(self.pendingWalletCode);
    feeTail.storeInt(self.walletCodeAt, 257);
    feeTail.storeRef(contentTail.endCell());

    root.storeUint(self.govQuorumBps, 16);
    root.storeDict(self.govVotes.toLowLevelDict());
    root.storeDict(self.govProposalStake.toLowLevelDict());
    root.storeInt(self.govProposalCount, 257);
    root.storeDict(self.govProposalExecuted.toLowLevelDict());
    root.storeRef(feeTail.endCell());
}

@overflow1023_policy("suppress")
struct QuasarMasterStorage {
    core: MasterCore
    ai: MasterAi
    user: MasterUser
    gov: MasterGov
}

fun QuasarMasterStorage.unpackFromSlice(mutate root: slice): QuasarMasterStorage {
    val core = MasterCore.fromCell(root.loadRef());
    val ai = MasterAi.fromCell(root.loadRef());
    val user = MasterUser.fromCell(root.loadRef());
    val gov = MasterGov.fromCell(root.loadRef());
    root.assertEnd();
    return {
        core,
        ai,
        user,
        gov,
    };
}

fun QuasarMasterStorage.packToBuilder(self, mutate root: builder) {
    root.storeRef(self.core.toCell());
    root.storeRef(self.ai.toCell());
    root.storeRef(self.user.toCell());
    root.storeRef(self.gov.toCell());
}

fun QuasarMasterStorage.load(): QuasarMasterStorage {
    return QuasarMasterStorage.fromCell(contract.getData());
}

fun QuasarMasterStorage.save(self) {
    contract.setData(self.toCell());
}

fun newQuasarMasterStorage(owner: address, content: cell, walletCode: cell): QuasarMasterStorage {
    val now = blockchain.now();
    return {
        core: MasterCore {
            totalSupply: 0,
            maxSupply: QUASAR_MAX_SUPPLY,
            mintable: true,
            owner,
            pendingOwner: ZERO_ADDRESS,
            ownerTransferAt: 0,
            ownerTransferDelay: 172800,
            content,
            walletCode,
            reserveBalance: 0,
            custodyBalance: 0,
            custodyPayoutSeq: 0,
            feeBps: QUASAR_WALLET_FEE_BPS,
            feeBurnShare: 50,
            treasury: owner,
            totalBurned: 0,
            totalFeesCollected: 0,
            maxTxBps: QUASAR_MAX_TX_BPS,
            maxWalletBps: QUASAR_MAX_WALLET_BPS,
            cooldownSeconds: QUASAR_TRANSFER_COOLDOWN,
            tradingEnabled: true,
            buybackEnabled: true,
            buybackPool: 0,
            buybackThreshold: 10000000000,
            buybackCooldown: 3600,
            buybackBurnPercent: 100,
            buybackSwapPending: 0,
            buybackSwapQueryId: 0,
            buybackSwapDefiAddress: ZERO_ADDRESS,
            buybackQueries: [],
            lastBuybackTime: 0,
            totalBuybacks: 0,
            totalQsrBurnedViaBuyback: 0,
            totalTonSpentOnBuyback: 0,
            emergencyGuardian: owner,
            defiAddress: ZERO_ADDRESS,
            defiFeeShareBps: 500,
        },
        ai: MasterAi {
            aiOracle: owner,
            aiEnabled: false,
            aiFullAutonomy: false,
            lastRebalanceTime: 0,
            signalCount: 0,
            priceHistoryCount: 0,
            priceHistory: [],
            anomalyLog: [],
            anomalyIndex: 0,
            priceHistoryDropped: 0,
            anomalyDropped: 0,
            minConfidence: 75,
            emergencyPause: false,
            aiActionCooldown: 21600,
            lastAiActionTime: 0,
            lastAiQueryId: 0,
            heartbeatTimeout: 604800,
            lastHeartbeat: now,
            ownerOverrideWindow: 86400,
            vetoThresholdBps: 1000,
            aiActionLog: [],
            aiActionKind: [],
            pendingAiActions: [],
            aiActionOldAddress: [],
            aiActionOldFeeBps: [],
            aiActionOldMintable: [],
            aiActionOldEmergencyPause: [],
            aiActionOldTrading: [],
            aiActionOldBurnShare: [],
            aiActionOldMaxTxBps: [],
            aiActionOldMaxWalletBps: [],
            aiActionOldCooldownSeconds: [],
            aiActionOldBuybackThreshold: [],
            aiActionOldBuybackCooldown: [],
            aiActionOldBuybackBurnPercent: [],
            totalVetoStake: 0,
            vetoEscrows: [],
            vetoActionStake: [],
            aiOraclePubKey: 0,
            aiNonce: 0,
            aiSignedDecisionCount: 0,
            aiActionIndex: 0,
        },
        user: MasterUser {
            stakingEnabled: true,
            stakingApyBps: 2000,
            stakingMinStake: grams("100"),
            stakingLockPeriod: 2592000,
            stakers: [],
            totalStaked: 0,
            stakingRewardsPool: 0,
            pendingQsrDeposits: [],
            referralEnabled: true,
            referralRewardBps: 100,
            referrals: [],
            pendingReferralRewards: [],
            pendingReferralTotal: 0,
            vestingEnabled: true,
            teamAllocation: 0,
            teamClaimed: 0,
            vestingSchedules: [],
        },
        gov: MasterGov {
            govQuorumBps: 1000,
            govVotes: [],
            govProposalStake: [],
            govProposalCount: 0,
            govProposalExecuted: [],
            pendingFee: 0,
            pendingFeeBurnShare: 0,
            pendingMaxTx: 0,
            pendingMaxWallet: 0,
            pendingCooldown: 0,
            pendingFeeConfigAt: 0,
            pendingWalletCode: null,
            walletCodeAt: 0,
            pendingContent: null,
            contentAt: 0,
            pendingMasterPayouts: [],
            masterPayoutSeq: 0,
            govProposalContentHash: [],
        },
    };
}

type AllowedMessageToQuasarMaster =
    | Mint
    | BurnNotification
    | TokenNotification
    | TokenExcesses
    | FeeTransfer
    | PayoutFailed
    | ProvideWalletAddress
    | AcceptOwner
    | AddVesting
    | AiAnomalyAlert
    | AiEmergencyPause
    | AiGovernanceProposal
    | AiGrantFullAutonomy
    | AiHeartbeat
    | AiPriceSignal
    | AiRebalance
    | AiRotateOracle
    | AiSetAntiWhale
    | AiSetBuybackDirect
    | AiSetFee
    | AiSetOracle
    | AiSetTreasuryDirect
    | AiSignedDecision
    | AiToggleMinting
    | BuybackTon
    | CancelBuybackSwap
    | CancelOwnerTransfer
    | ClaimReferralRewards
    | ClaimRewards
    | ClaimVested
    | ClearAiOracleKey
    | Deploy
    | GovernanceVote
    | GuardianPause
    | OwnerOverride
    | ProposeContent
    | ProposeOwner
    | ProposeWalletCode
    | RefundPendingDeposit
    | RegisterReferral
    | ReleaseVeto
    | SetAiOracleKey
    | SetBuybackConfig
    | SetDefiAddress
    | SetEmergencyGuardian
    | SetFeeConfig
    | SetReferralConfig
    | SetStakingConfig
    | SetTreasury
    | Stake
    | SweepTon
    | ToggleMinting
    | TriggerBuyback
    | Unstake
    | VetoAiAction

contract QuasarMaster {
    author: "QUASAR"
    version: "3.0.0-tolk"
    description: "QUASAR Jetton Master: fee, buyback, staking, vesting, AI and governance"
    storage: QuasarMasterStorage
    incomingMessages: AllowedMessageToQuasarMaster
}

fun intOf(m: map<address, int257>, key: address): int257? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun actionOf(m: map<int257, AiActionLog>, key: int257): AiActionLog? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun recommendationOf(m: map<int257, AiRecommendation>, key: int257): AiRecommendation? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun stakeOf(m: map<address, StakeInfo>, key: address): StakeInfo? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun referralOf(m: map<address, ReferralInfo>, key: address): ReferralInfo? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun vestingOf(m: map<address, VestingInfo>, key: address): VestingInfo? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun payoutOf(m: map<int257, PendingMasterPayout>, key: int257): PendingMasterPayout? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun mapIntOf(m: map<int257, int257>, key: int257): int257? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun mapBoolOf(m: map<int257, bool>, key: int257): bool? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun addressOf(m: map<int257, address>, key: int257): address? {
    val v = m.get(key);
    return v.isFound ? v.loadValue() : null;
}

fun requireOwner(s: QuasarMasterStorage, sender: address) {
    assert (sender == s.core.owner) throw 1000;
}

fun requireAi(s: QuasarMasterStorage, sender: address) {
    assert (sender == s.ai.aiOracle && s.ai.aiEnabled) throw 1001;
}

fun requireNotPaused(s: QuasarMasterStorage) {
    assert (!s.ai.emergencyPause) throw 1002;
}

fun requireTrading(s: QuasarMasterStorage) {
    assert (s.core.tradingEnabled) throw 1003;
}

fun freshAiQuery(mutate s: QuasarMasterStorage, id: uint64) {
    assert (id > s.ai.lastAiQueryId) throw 1004;
    s.ai.lastAiQueryId = id;
}

fun requireAiCooldown(s: QuasarMasterStorage) {
    assert (blockchain.now() - s.ai.lastAiActionTime >= s.ai.aiActionCooldown) throw 1005;
}

fun poolEncumbrance(s: QuasarMasterStorage): coins {
    return s.core.buybackPool + s.user.stakingRewardsPool + s.user.pendingReferralTotal;
}

fun isAiAlive(s: QuasarMasterStorage): bool {
    return blockchain.now() - s.ai.lastHeartbeat <= s.ai.heartbeatTimeout;
}

fun voteKey(voter: address, proposalId: uint64): int257 {
    return beginCell().storeUint(proposalId, 64).storeAddress(voter).endCell().hash() as int257;
}

fun overrideOpen(s: QuasarMasterStorage, id: uint64): bool {
    val t = mapIntOf(s.ai.pendingAiActions, id as int257);
    return t != null && blockchain.now() - t < s.ai.ownerOverrideWindow;
}

fun emitMint(amount: coins, receiver: address) {
    createExternalLogMessage({ dest: createAddressNone(), body: EventMint {
            amount: amount as int257,
            receiver,
        } }).send(SEND_MODE_IGNORE_ERRORS);
}

fun emitBurn(amount: coins, burner: address) {
    createExternalLogMessage({ dest: createAddressNone(), body: EventBurn {
            amount: amount as int257,
            burner,
        } }).send(SEND_MODE_IGNORE_ERRORS);
}

fun emitAi(id: int257, kind: string, oldValue: int257, newValue: int257) {
    createExternalLogMessage({ dest: createAddressNone(), body: EventAiAction {
            actionId: id,
            actionType: kind,
            oldValue,
            newValue,
        } }).send(SEND_MODE_IGNORE_ERRORS);
}

fun emitAdmin(action: string, actor: address, valueA: int257, valueB: int257) {
    createExternalLogMessage({ dest: createAddressNone(), body: EventAdminConfig {
            action,
            actor,
            valueA,
            valueB,
        } }).send(SEND_MODE_IGNORE_ERRORS);
}

fun logAiAction(
    mutate s: QuasarMasterStorage,
    code: int257,
    kind: string,
    oldValue: int257,
    newValue: int257,
    reason: string,
    administrative: bool,
): int257 {
    val id = s.ai.aiActionIndex;
    s
        .ai
        .aiActionLog
        .set(
            id,
            AiActionLog {
                actionId: id,
                timestamp: blockchain.now(),
                actionType: kind,
                oldValue,
                newValue,
                reason,
                executed: true,
                vetoed: false,
                overridden: false,
            },
        );
    s.ai.aiActionKind.set(id, code);
    s.ai.pendingAiActions.set(id, blockchain.now());
    s.ai.aiActionIndex = id + 1;
    if (administrative) {
        s.ai.lastAiActionTime = blockchain.now();
    }
    return id;
}

fun logAnomaly(mutate s: QuasarMasterStorage, action: string, confidence: int257, executed: bool) {
    if (s.ai.anomalyIndex < QUASAR_AI_ANOMALY_CAP) {
        s
            .ai
            .anomalyLog
            .set(
                s.ai.anomalyIndex,
                AiRecommendation {
                    timestamp: blockchain.now(),
                    action,
                    confidence,
                    executed,
                },
            );
        s.ai.anomalyIndex += 1;
    } else {
        s.ai.anomalyDropped += 1;
    }
}

fun sendInternal(
    to: address,
    amount: coins,
    queryId: uint64,
    from: address,
    forwardTonAmount: coins,
    forwardPayload: slice,
) {
    assert (amount > 0) throw 1010;
    val internalTransferMessage = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: quasarWalletDeployment(to, contract.getAddress(), quasarWalletCompiledCode()),
        value: grams("0.02"),
        // The auto-deploy envelope plus StateInit leaves insufficient inline
        // capacity for this body; an explicit reference prevents cell overflow.
        // check-disable-next-line create-message-body-to-cell
        body: InternalTransfer {
            queryId,
            amount,
            from,
            responseDestination: contract.getAddress(),
            forwardTonAmount,
            forwardPayload,
        }.toCell(),
    });
    internalTransferMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
}

fun sendMint(to: address, amount: coins) {
    val marker = beginCell().storeUint(QUASAR_MINT_TRANSFER_MARKER, 32).endCell().beginParse();
    sendInternal(
        to,
        amount,
        MINT_QUERY_ID,
        contract.getAddress(),
        0,
        marker,
    );
}

fun nextPayoutId(mutate s: QuasarMasterStorage): uint64 {
    assert (s.gov.masterPayoutSeq < MASTER_TRANSFER_QUERY_PREFIX - 1) throw 1011;
    s.gov.masterPayoutSeq += 1;
    return s.gov.masterPayoutSeq;
}

fun registerPayout(
    mutate s: QuasarMasterStorage,
    kind: int257,
    beneficiary: address,
    amount: coins,
    d1: int257,
    d2: int257,
    d3: int257,
): uint64 {
    val id = nextPayoutId(mutate s);
    s
        .gov
        .pendingMasterPayouts
        .set(id as int257, PendingMasterPayout { kind, beneficiary, amount, d1, d2, d3 });
    return id;
}

fun sendReservePayout(
    mutate s: QuasarMasterStorage,
    to: address,
    amount: coins,
    kind: int257,
    d1: int257,
) {
    assert (amount > 0 && s.core.reserveBalance >= amount) throw 1012;
    s.core.reserveBalance -= amount;
    val id = registerPayout(
        mutate s,
        kind,
        to,
        amount,
        d1,
        0,
        0,
    );
    sendInternal(
        to,
        amount,
        MASTER_TRANSFER_QUERY_PREFIX + id,
        contract.getAddress(),
        0,
        beginCell().endCell().beginParse(),
    );
}

fun sendCustodyPayout(
    mutate s: QuasarMasterStorage,
    to: address,
    amount: coins,
    kind: int257,
    d1: int257,
    d2: int257,
    d3: int257,
) {
    assert (amount > 0 && s.core.custodyBalance >= amount) throw 1013;
    s.core.custodyBalance -= amount;
    val id = registerPayout(
        mutate s,
        kind,
        to,
        amount,
        d1,
        d2,
        d3,
    );
    val custodyPayoutMessage = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: quasarWalletDeployment(
            contract.getAddress(),
            contract.getAddress(),
            quasarWalletCompiledCode(),
        ),
        value: grams("0.02"),
        body: PoolPayout {
            queryId: id,
            amount,
            destination: to,
            responseDestination: contract.getAddress(),
        },
    });
    custodyPayoutMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
}

fun restorePayout(mutate s: QuasarMasterStorage, queryId: uint64): bool {
    var id: uint64 = queryId;
    if (queryId >= MASTER_TRANSFER_QUERY_PREFIX) {
        id = (queryId - MASTER_TRANSFER_QUERY_PREFIX) as uint64;
    }
    val pending = payoutOf(s.gov.pendingMasterPayouts, id as int257);
    if (pending == null) {
        return false;
    }
    val p = pending;
    s.gov.pendingMasterPayouts.delete(id as int257);
    if (p.kind == 1) {
        val previous = stakeOf(s.user.stakers, p.beneficiary);
        val base = previous == null ? (0 as int257) : previous.amount;
        s
            .user
            .stakers
            .set(
                p.beneficiary,
                StakeInfo {
                    amount: base + p.amount,
                    startTime: p.d2,
                    lastClaim: p.d3,
                    lockEnd: p.d1,
                },
            );
        s.user.totalStaked += p.amount;
    } else if (p.kind == 2) {
        val previous = vestingOf(s.user.vestingSchedules, p.beneficiary);
        if (previous != null) {
            val v = previous;
            s
                .user
                .vestingSchedules
                .set(
                    p.beneficiary,
                    VestingInfo {
                        totalAmount: v.totalAmount,
                        claimed: p.d1,
                        startTime: v.startTime,
                        cliff: v.cliff,
                        duration: v.duration,
                    },
                );
        }
        s.user.teamClaimed -= p.amount;
    } else if (p.kind == 3) {
        s.user.stakingRewardsPool += p.amount;
        val previous = stakeOf(s.user.stakers, p.beneficiary);
        if (previous != null) {
            val st = previous;
            s
                .user
                .stakers
                .set(
                    p.beneficiary,
                    StakeInfo {
                        amount: st.amount,
                        startTime: st.startTime,
                        lastClaim: blockchain.now(),
                        lockEnd: st.lockEnd,
                    },
                );
        }
    } else if (p.kind == 4) {
        val previous = intOf(s.user.pendingReferralRewards, p.beneficiary);
        s
            .user
            .pendingReferralRewards
            .set(p.beneficiary, (previous == null ? (0 as int257) : previous) + p.amount);
        s.user.pendingReferralTotal += p.amount;
    } else if (p.kind == 5) {
        val escrow = mapIntOf(s.ai.vetoEscrows, p.d1);
        val action = mapIntOf(s.ai.vetoActionStake, p.d2);
        s.ai.vetoEscrows.set(p.d1, (escrow == null ? (0 as int257) : escrow) + p.amount);
        s.ai.vetoActionStake.set(p.d2, (action == null ? (0 as int257) : action) + p.amount);
        s.ai.totalVetoStake += p.amount;
    } else if (p.kind == 6) {
        val previous = intOf(s.user.pendingQsrDeposits, p.beneficiary);
        s
            .user
            .pendingQsrDeposits
            .set(p.beneficiary, (previous == null ? (0 as int257) : previous) + p.amount);
    } else {
        throw 1014;
    }
    return true;
}

fun calculateRewards(s: QuasarMasterStorage, user: address): coins {
    val info = stakeOf(s.user.stakers, user);
    if (info == null) {
        return 0;
    }
    val st = info;
    val accrued = st.amount * s.user.stakingApyBps * (blockchain.now() - st.lastClaim) / 10000 /
        DAY_YEAR;
    return accrued > s.user.stakingRewardsPool ? s.user.stakingRewardsPool : accrued;
}

fun sendTokensToDefi(mutate s: QuasarMasterStorage, amount: coins, buyback: bool): uint64 {
    assert (
        amount > 0 && !isZeroAddress(s.core.defiAddress) && s.core.reserveBalance >= amount
    ) throw 1015;
    s.core.reserveBalance -= amount;
    val id = nextPayoutId(mutate s);
    val payload = buyback
        ? beginCell().storeUint(0x5f4a3b21, 32).endCell().beginParse()
        : beginCell().endCell().beginParse();
    if (buyback) {
        s.core.buybackSwapPending = amount;
        s.core.buybackSwapQueryId = MASTER_TRANSFER_QUERY_PREFIX + id;
        s.core.buybackSwapDefiAddress = s.core.defiAddress;
    }
    sendInternal(
        s.core.defiAddress,
        amount,
        MASTER_TRANSFER_QUERY_PREFIX + id,
        contract.getAddress(),
        grams("0.01"),
        payload,
    );
    return MASTER_TRANSFER_QUERY_PREFIX + id;
}

fun executeBuyback(mutate s: QuasarMasterStorage) {
    val pool = s.core.buybackPool;
    var burn = pool * s.core.buybackBurnPercent / 100;
    if (burn > s.core.totalSupply) {
        burn = s.core.totalSupply;
    }
    if (burn > s.core.reserveBalance) {
        burn = s.core.reserveBalance;
    }
    var swap: coins = isZeroAddress(s.core.defiAddress) ? (0 as coins) : (pool - burn) as coins;
    if (swap > s.core.reserveBalance - burn) {
        swap = s.core.reserveBalance - burn;
    }
    s.core.buybackPool = pool - burn - swap;
    if (burn > 0) {
        s.core.totalSupply -= burn;
        s.core.totalBurned += burn;
        s.core.totalQsrBurnedViaBuyback += burn;
        s.core.reserveBalance -= burn;
    }
    if (swap > 0) {
        sendTokensToDefi(mutate s, swap, true);
    }
    s.core.totalBuybacks += 1;
    s.core.lastBuybackTime = blockchain.now();
    if (burn > 0) {
        createExternalLogMessage({ dest: createAddressNone(), body: EventBuybackExecuted {
                tonSpent: 0,
                qsrBurned: burn as int257,
            } }).send(SEND_MODE_IGNORE_ERRORS);
    }
}

fun onFeeTransfer(mutate s: QuasarMasterStorage, senderAddress: address, msg: FeeTransfer) {
    assert (msg.amount > 0) throw 1020;
    val sourceWallet = quasarWalletAddress(
        msg.originalSender,
        contract.getAddress(),
        quasarWalletCompiledCode(),
    );
    assert (senderAddress == sourceWallet) throw 1021;
    val confirmationMessage = createMessage({
        bounce: BounceMode.NoBounce,
        dest: sourceWallet,
        value: grams("0.005"),
        body: TransferConfirmed { queryId: msg.queryId },
    });
    confirmationMessage.send(SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS);
    s.core.totalFeesCollected += msg.amount;
    s.core.reserveBalance += msg.amount;
    val burn = msg.amount * s.core.feeBurnShare / 100;
    assert (burn <= s.core.totalSupply) throw 1022;
    s.core.reserveBalance -= burn;
    var treasuryAmount = msg.amount - burn;
    // Fee buckets intentionally floor independently so retained amounts stay
    // deterministic even for the smallest jetton denominations.
    // check-disable-next-line divide-before-multiply
    val buyback = treasuryAmount * 15 / 100;
    // check-disable-next-line divide-before-multiply
    val staking = treasuryAmount * 10 / 100;
    // check-disable-next-line divide-before-multiply
    val defi = treasuryAmount * s.core.defiFeeShareBps / 10000;
    treasuryAmount -= buyback + staking + defi;
    if (burn > 0) {
        s.core.totalSupply -= burn;
        s.core.totalBurned += burn;
    }
    if (buyback > 0 && s.core.buybackEnabled) {
        s.core.buybackPool += buyback;
    } else {
        treasuryAmount += buyback;
    }
    if (staking > 0 && s.user.stakingEnabled) {
        s.user.stakingRewardsPool += staking;
    } else {
        treasuryAmount += staking;
    }
    if (defi > 0 && !isZeroAddress(s.core.defiAddress)) {
        sendTokensToDefi(mutate s, defi, false);
    } else {
        treasuryAmount += defi;
    }
    var referral: coins = 0;
    if (s.user.referralEnabled) {
        val registration = referralOf(s.user.referrals, msg.originalSender);
        if (registration != null) {
            // check-disable-next-line divide-before-multiply
            val reward = msg.amount * s.user.referralRewardBps / 10000;
            if (reward > 0 && treasuryAmount >= reward) {
                referral = reward;
                treasuryAmount -= reward;
                val referrer = registration.referrer;
                val known = referralOf(s.user.referrals, referrer);
                if (known != null) {
                    val ri = known;
                    s
                        .user
                        .referrals
                        .set(
                            referrer,
                            ReferralInfo {
                                referrer: ri.referrer,
                                totalEarned: ri.totalEarned + reward,
                                totalReferrals: ri.totalReferrals,
                            },
                        );
                } else {
                    s
                        .user
                        .referrals
                        .set(
                            referrer,
                            ReferralInfo {
                                referrer: ZERO_ADDRESS,
                                totalEarned: reward,
                                totalReferrals: 0,
                            },
                        );
                }
                val prior = intOf(s.user.pendingReferralRewards, referrer);
                s
                    .user
                    .pendingReferralRewards
                    .set(referrer, (prior == null ? (0 as int257) : prior) + reward);
                s.user.pendingReferralTotal += reward;
            }
        }
    }
    if (!s.ai.emergencyPause && treasuryAmount > 0 && !isZeroAddress(s.core.treasury)) {
        assert (s.core.reserveBalance - poolEncumbrance(s) >= treasuryAmount) throw 1023;
        val tid = nextPayoutId(mutate s);
        sendInternal(
            s.core.treasury,
            treasuryAmount,
            MASTER_TRANSFER_QUERY_PREFIX + tid,
            msg.originalSender,
            0,
            beginCell().endCell().beginParse(),
        );
    }
    if (
        !s.ai.emergencyPause && s.core.buybackEnabled && s.core.buybackSwapPending == 0 &&
        s.core.buybackPool >= s.core.buybackThreshold &&
        blockchain.now() - s.core.lastBuybackTime >= s.core.buybackCooldown
    ) {
        executeBuyback(mutate s);
    }
    createExternalLogMessage({ dest: createAddressNone(), body: EventFeeDistributed {
            totalFee: msg.amount as int257,
            burn: burn as int257,
            buyback: buyback as int257,
            staking: staking as int257,
            referral: referral as int257,
            treasury: treasuryAmount as int257,
            defiPool: defi as int257,
        } }).send(SEND_MODE_IGNORE_ERRORS);
}

fun restoreAiAction(mutate s: QuasarMasterStorage, id: int257, act: AiActionLog) {
    val code = mapIntOf(s.ai.aiActionKind, id);
    assert (code != null) throw 1030;
    if (code == 1) {
        s.core.feeBps = act.oldValue as uint16;
    } else if (code == 2) {
        s.core.tradingEnabled = act.oldValue != 0;
    } else if (code == 3 || code == 10 || code == 11 || code == 12) {
        val pause = mapIntOf(s.ai.aiActionOldEmergencyPause, id);
        val trading = mapIntOf(s.ai.aiActionOldTrading, id);
        val fee = mapIntOf(s.ai.aiActionOldFeeBps, id);
        val burn = mapIntOf(s.ai.aiActionOldBurnShare, id);
        if (pause != null) {
            s.ai.emergencyPause = pause != 0;
        }
        if (trading != null) {
            s.core.tradingEnabled = trading != 0;
        }
        if (fee != null) {
            s.core.feeBps = fee as uint16;
        }
        if (burn != null) {
            s.core.feeBurnShare = burn as uint8;
        }
    } else if (code == 4 || code == 5) {
        val prior = addressOf(s.ai.aiActionOldAddress, id);
        if (prior != null) {
            if (code == 4) {
                s.core.treasury = prior;
            } else {
                s.ai.aiOracle = prior;
            }
        }
    } else if (code == 6) {
        s.core.buybackEnabled = act.oldValue != 0;
        val t = mapIntOf(s.ai.aiActionOldBuybackThreshold, id);
        val c = mapIntOf(s.ai.aiActionOldBuybackCooldown, id);
        val b = mapIntOf(s.ai.aiActionOldBuybackBurnPercent, id);
        if (t != null) {
            s.core.buybackThreshold = t as coins;
        }
        if (c != null) {
            s.core.buybackCooldown = c as uint32;
        }
        if (b != null) {
            s.core.buybackBurnPercent = b as uint8;
        }
    } else if (code == 7 || code == 8 || code == 9) {
        s.core.feeBurnShare = act.oldValue as uint8;
        val fee = mapIntOf(s.ai.aiActionOldFeeBps, id);
        if (fee != null) {
            s.core.feeBps = fee as uint16;
        }
    } else if (code == 13) {
        s.core.buybackThreshold = act.oldValue as coins;
    }
}

fun markActionClosed(
    mutate s: QuasarMasterStorage,
    id: int257,
    action: AiActionLog,
    vetoed: bool,
    overridden: bool,
) {
    s
        .ai
        .aiActionLog
        .set(
            id,
            AiActionLog {
                actionId: action.actionId,
                timestamp: action.timestamp,
                actionType: action.actionType,
                oldValue: action.oldValue,
                newValue: action.newValue,
                reason: action.reason,
                executed: action.executed,
                vetoed,
                overridden,
            },
        );
}

fun applyTextMessage(mutate s: QuasarMasterStorage, senderAddress: address, body: slice): bool {
    var text = body;
    if (text.remainingBitsCount() < 32 || text.loadUint(32) != 0) {
        return false;
    }
    if (text.remainingBitsCount() == 96 && text.loadUint(96) == 0x53746f70204d696e74696e67) {
        requireOwner(s, senderAddress);
        s.core.mintable = false;
        return true;
    }
    if (text.remainingBitsCount() == 112 && text.loadUint(112) == 0x526573756d65204d696e74696e67) {
        requireOwner(s, senderAddress);
        assert (!s.ai.aiFullAutonomy) throw 1040;
        s.core.mintable = true;
        return true;
    }
    if (text.remainingBitsCount() == 48 && text.loadUint(48) == 0x526573756d65) {
        requireOwner(s, senderAddress);
        s.ai.emergencyPause = false;
        s.core.tradingEnabled = true;
        return true;
    }
    if (text.remainingBitsCount() == 72 && text.loadUint(72) == 0x546f67676c65204149) {
        requireOwner(s, senderAddress);
        assert (!s.ai.aiFullAutonomy) throw 1041;
        s.ai.aiEnabled = !s.ai.aiEnabled;
        return true;
    }
    if (
        text.remainingBitsCount() == 128 && text.loadUint(128) == 0x436c61696d20414920436f6e74726f6c
    ) {
        requireOwner(s, senderAddress);
        assert (!isAiAlive(s)) throw 1042;
        s.ai.aiEnabled = false;
        s.ai.aiFullAutonomy = false;
        if (s.ai.aiOracle != s.core.owner) {
            s.ai.lastAiQueryId = 0;
        }
        s.ai.aiOracle = s.core.owner;
        s.ai.emergencyPause = false;
        return true;
    }
    if (
        text.remainingBitsCount() == 144 &&
        text.loadUint(144) == 0x436f6e6669726d2046656520436f6e666967
    ) {
        requireOwner(s, senderAddress);
        assert (
            s.gov.pendingFeeConfigAt > 0 && blockchain.now() >= s.gov.pendingFeeConfigAt
        ) throw 1043;
        s.core.feeBps = s.gov.pendingFee;
        s.core.feeBurnShare = s.gov.pendingFeeBurnShare as uint8;
        s.core.maxTxBps = s.gov.pendingMaxTx;
        s.core.maxWalletBps = s.gov.pendingMaxWallet;
        s.core.cooldownSeconds = s.gov.pendingCooldown;
        s.gov.pendingFee = 0;
        s.gov.pendingFeeBurnShare = 0;
        s.gov.pendingMaxTx = 0;
        s.gov.pendingMaxWallet = 0;
        s.gov.pendingCooldown = 0;
        s.gov.pendingFeeConfigAt = 0;
        emitAdmin(
            "ApplyFeeConfig",
            senderAddress,
            s.core.feeBps as int257,
            s.core.feeBurnShare as int257,
        );
        return true;
    }
    if (
        text.remainingBitsCount() == 136 &&
        text.loadUint(136) == 0x43616e63656c2046656520436f6e666967
    ) {
        requireOwner(s, senderAddress);
        assert (s.gov.pendingFeeConfigAt > 0) throw 1044;
        s.gov.pendingFee = 0;
        s.gov.pendingFeeBurnShare = 0;
        s.gov.pendingMaxTx = 0;
        s.gov.pendingMaxWallet = 0;
        s.gov.pendingCooldown = 0;
        s.gov.pendingFeeConfigAt = 0;
        emitAdmin("CancelFeeConfig", senderAddress, 0, 0);
        return true;
    }
    if (
        text.remainingBitsCount() == 144 &&
        text.loadUint(144) == 0x43616e63656c2057616c6c657420436f6465
    ) {
        requireOwner(s, senderAddress);
        s.gov.pendingWalletCode = null;
        s.gov.walletCodeAt = 0;
        emitAdmin("CancelWalletCode", senderAddress, 0, 0);
        return true;
    }
    if (
        text.remainingBitsCount() == 136 &&
        text.loadUint(136) == 0x4170706c792057616c6c657420436f6465
    ) {
        requireOwner(s, senderAddress);
        throw 1045;
    }
    if (text.remainingBitsCount() == 112 && text.loadUint(112) == 0x43616e63656c20436f6e74656e74) {
        requireOwner(s, senderAddress);
        assert (s.gov.pendingContent != null) throw 1046;
        s.gov.pendingContent = null;
        s.gov.contentAt = 0;
        emitAdmin("CancelContent", senderAddress, 0, 0);
        return true;
    }
    if (text.remainingBitsCount() == 104 && text.loadUint(104) == 0x4170706c7920436f6e74656e74) {
        requireOwner(s, senderAddress);
        assert (
            s.gov.pendingContent != null && s.gov.contentAt > 0 &&
            blockchain.now() >= s.gov.contentAt
        ) throw 1047;
        s.core.content = s.gov.pendingContent;
        s.gov.pendingContent = null;
        s.gov.contentAt = 0;
        emitAdmin("ApplyContent", senderAddress, 0, 0);
        return true;
    }
    return false;
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessageToQuasarMaster.fromSlice(in.body);
    match (msg) {
        Deploy => {
            val body = DeployOk { queryId: msg.queryId };
            val balanceBeforeMessage = contract.getOriginalBalance() - in.valueCoins;
            if (balanceBeforeMessage < QUASAR_STORAGE_RESERVE) {
                // Preserve the declared rent reserve before returning deployment value.
                reserveGramsOnBalance(QUASAR_STORAGE_RESERVE, RESERVE_MODE_EXACT_AMOUNT);
                val reserveReply = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: 0,
                    body,
                });
                // SAFETY: the exact rent reserve is locked before this Deploy-only reply.
                reserveReply.send(SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_IGNORE_ERRORS);
                return;
            }
            val deployOkMessage = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: 0,
                body,
            });
            deployOkMessage.send(
                SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
            );
        }
        Mint => {
            var s = QuasarMasterStorage.load();
            requireNotPaused(s);
            requireTrading(s);
            requireOwner(s, in.senderAddress);
            assert (msg.amount > 0 && !isZeroAddress(msg.receiver)) throw 1100;
            assert (
                s.core.mintable && msg.amount <= s.core.maxSupply * s.core.maxTxBps / 10000 &&
                s.core.totalSupply + msg.amount <= s.core.maxSupply
            ) throw 1101;
            s.core.totalSupply += msg.amount;
            s.save();
            sendMint(msg.receiver, msg.amount);
            emitMint(msg.amount, msg.receiver);
        }
        BurnNotification => {
            var s = QuasarMasterStorage.load();
            assert (msg.amount > 0 && msg.amount <= s.core.totalSupply) throw 1102;
            val wallet = quasarWalletAddress(
                msg.sender,
                contract.getAddress(),
                quasarWalletCompiledCode(),
            );
            assert (in.senderAddress == wallet) throw 1103;
            s.core.totalSupply -= msg.amount;
            s.save();
            emitBurn(msg.amount, msg.sender);
            val burnConfirmationMessage = createMessage({
                bounce: BounceMode.NoBounce,
                dest: wallet,
                value: 0,
                body: BurnConfirmed { queryId: msg.queryId },
            });
            burnConfirmationMessage.send(SEND_MODE_PAY_FEES_SEPARATELY | SEND_MODE_IGNORE_ERRORS);
            if (msg.responseDestination != null) {
                val response = msg.responseDestination;
                if (!isZeroAddress(response)) {
                    val excessesMessage = createMessage({
                        bounce: BounceMode.NoBounce,
                        dest: response,
                        value: 0,
                        body: TokenExcesses { queryId: msg.queryId },
                    });
                    excessesMessage.send(
                        SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                    );
                }
            }
        }
        TokenNotification => {
            var s = QuasarMasterStorage.load();
            assert (
                msg.amount > 0 &&
                in.senderAddress ==
                quasarWalletAddress(
                    contract.getAddress(),
                    contract.getAddress(),
                    quasarWalletCompiledCode(),
                )
            ) throw 1104;
            val previous = intOf(s.user.pendingQsrDeposits, msg.from);
            s
                .user
                .pendingQsrDeposits
                .set(msg.from, (previous == null ? (0 as int257) : previous) + msg.amount);
            s.core.custodyBalance += msg.amount;
            s.save();
        }
        TokenExcesses => {}
        FeeTransfer => {
            var s = QuasarMasterStorage.load();
            onFeeTransfer(mutate s, in.senderAddress, msg);
            s.save();
        }
        TriggerBuyback => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            requireNotPaused(s);
            assert (
                s.core.buybackEnabled && s.core.buybackPool >= s.core.buybackThreshold &&
                blockchain.now() - s.core.lastBuybackTime >= s.core.buybackCooldown &&
                s.core.buybackSwapPending == 0
            ) throw 1105;
            assert (mapBoolOf(s.core.buybackQueries, msg.queryId as int257) == null) throw 1106;
            s.core.buybackQueries.set(msg.queryId as int257, true);
            executeBuyback(mutate s);
            s.save();
        }
        CancelBuybackSwap => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (
                s.core.buybackSwapPending > 0 && msg.queryId == s.core.buybackSwapQueryId &&
                blockchain.now() - s.core.lastBuybackTime >= BUYBACK_CALLBACK_TIMEOUT
            ) throw 1107;
            val amount = s.core.buybackSwapPending;
            s.core.buybackSwapPending = 0;
            s.core.buybackSwapQueryId = 0;
            s.core.buybackSwapDefiAddress = ZERO_ADDRESS;
            s.save();
            emitAdmin(
                "CancelBuybackSwap",
                in.senderAddress,
                msg.queryId as int257,
                amount as int257,
            );
        }
        Stake => {
            var s = QuasarMasterStorage.load();
            requireNotPaused(s);
            assert (
                s.user.stakingEnabled && msg.amount > 0 && msg.amount >= s.user.stakingMinStake
            ) throw 1110;
            val deposit = intOf(s.user.pendingQsrDeposits, in.senderAddress);
            assert (deposit != null && deposit >= msg.amount) throw 1111;
            val existing = stakeOf(s.user.stakers, in.senderAddress);
            val priorClaim: int257 = existing == null ? blockchain.now() : existing.lastClaim;
            var lockEnd = blockchain.now() + s.user.stakingLockPeriod;
            if (existing != null && existing.lockEnd > lockEnd) {
                lockEnd = existing.lockEnd;
            }
            val reward = calculateRewards(s, in.senderAddress);
            assert (reward == 0 || s.user.stakingRewardsPool >= reward) throw 1112;
            if (reward > 0) {
                s.user.stakingRewardsPool -= reward;
                sendReservePayout(mutate s, in.senderAddress, reward, 3, priorClaim);
            }
            val principal = existing == null ? (0 as int257) : existing.amount;
            s
                .user
                .stakers
                .set(
                    in.senderAddress,
                    StakeInfo {
                        amount: principal + (msg.amount as int257),
                        startTime: blockchain.now(),
                        lastClaim: blockchain.now(),
                        lockEnd,
                    },
                );
            s.user.totalStaked += msg.amount;
            s.user.pendingQsrDeposits.set(in.senderAddress, deposit - msg.amount);
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventStake {
                    staker: in.senderAddress,
                    amount: msg.amount as int257,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        Unstake => {
            var s = QuasarMasterStorage.load();
            assert (msg.amount > 0) throw 1120;
            val existing = stakeOf(s.user.stakers, in.senderAddress);
            assert (
                existing != null && existing.amount >= msg.amount &&
                blockchain.now() >= existing.lockEnd
            ) throw 1121;
            val st = existing;
            val reward = calculateRewards(s, in.senderAddress);
            assert (reward == 0 || s.user.stakingRewardsPool >= reward) throw 1122;
            if (reward > 0) {
                s.user.stakingRewardsPool -= reward;
                sendReservePayout(mutate s, in.senderAddress, reward, 3, st.lastClaim);
            }
            val remain = st.amount - msg.amount;
            if (remain > 0) {
                s
                    .user
                    .stakers
                    .set(
                        in.senderAddress,
                        StakeInfo {
                            amount: remain,
                            startTime: st.startTime,
                            lastClaim: blockchain.now(),
                            lockEnd: st.lockEnd,
                        },
                    );
            } else {
                s.user.stakers.delete(in.senderAddress);
            }
            s.user.totalStaked -= msg.amount;
            sendCustodyPayout(
                mutate s,
                in.senderAddress,
                msg.amount,
                1,
                st.lockEnd,
                st.startTime,
                st.lastClaim,
            );
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventUnstake {
                    staker: in.senderAddress,
                    amount: msg.amount as int257,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        ClaimRewards => {
            var s = QuasarMasterStorage.load();
            requireNotPaused(s);
            val reward = calculateRewards(s, in.senderAddress);
            assert (reward > 0) throw 1130;
            val st = stakeOf(s.user.stakers, in.senderAddress);
            assert (st != null) throw 1131;
            s.user.stakingRewardsPool -= reward;
            val old = st;
            s
                .user
                .stakers
                .set(
                    in.senderAddress,
                    StakeInfo {
                        amount: old.amount,
                        startTime: old.startTime,
                        lastClaim: blockchain.now(),
                        lockEnd: old.lockEnd,
                    },
                );
            sendReservePayout(mutate s, in.senderAddress, reward, 3, old.lastClaim);
            s.save();
        }
        RegisterReferral => {
            var s = QuasarMasterStorage.load();
            requireNotPaused(s);
            assert (
                s.user.referralEnabled && !isZeroAddress(msg.referrer) &&
                msg.referrer != in.senderAddress &&
                referralOf(s.user.referrals, in.senderAddress) == null
            ) throw 1140;
            s
                .user
                .referrals
                .set(
                    in.senderAddress,
                    ReferralInfo {
                        referrer: msg.referrer,
                        totalEarned: 0,
                        totalReferrals: 0,
                    },
                );
            val existing = referralOf(s.user.referrals, msg.referrer);
            if (existing != null) {
                val r = existing;
                s
                    .user
                    .referrals
                    .set(
                        msg.referrer,
                        ReferralInfo {
                            referrer: r.referrer,
                            totalEarned: r.totalEarned,
                            totalReferrals: r.totalReferrals + 1,
                        },
                    );
            }
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventReferralRegistered {
                    user: in.senderAddress,
                    referrer: msg.referrer,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        ClaimReferralRewards => {
            var s = QuasarMasterStorage.load();
            requireNotPaused(s);
            val reward = intOf(s.user.pendingReferralRewards, in.senderAddress);
            assert (
                reward != null && reward > 0 && s.core.reserveBalance - poolEncumbrance(s) >= reward
            ) throw 1141;
            s.user.pendingReferralRewards.delete(in.senderAddress);
            s.user.pendingReferralTotal -= reward;
            sendReservePayout(mutate s, in.senderAddress, reward as coins, 4, 0);
            s.save();
        }
        AddVesting => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            requireNotPaused(s);
            assert (
                msg.totalAmount > 0 && msg.duration > 0 && msg.cliff <= msg.duration &&
                vestingOf(s.user.vestingSchedules, msg.beneficiary) == null
            ) throw 1150;
            val deposit = intOf(s.user.pendingQsrDeposits, in.senderAddress);
            assert (deposit != null && deposit >= msg.totalAmount) throw 1151;
            s
                .user
                .vestingSchedules
                .set(
                    msg.beneficiary,
                    VestingInfo {
                        totalAmount: msg.totalAmount as int257,
                        claimed: 0,
                        startTime: blockchain.now(),
                        cliff: msg.cliff as int257,
                        duration: msg.duration as int257,
                    },
                );
            s.user.teamAllocation += msg.totalAmount;
            s.user.pendingQsrDeposits.set(in.senderAddress, deposit - msg.totalAmount);
            s.save();
        }
        ClaimVested => {
            var s = QuasarMasterStorage.load();
            assert (s.user.vestingEnabled) throw 1152;
            val existing = vestingOf(s.user.vestingSchedules, in.senderAddress);
            assert (existing != null) throw 1153;
            val v = existing;
            assert (blockchain.now() >= v.startTime + v.cliff) throw 1154;
            var elapsed = blockchain.now() - v.startTime;
            if (elapsed > v.duration) {
                elapsed = v.duration;
            }
            val claim = v.totalAmount * elapsed / v.duration - v.claimed;
            assert (claim > 0) throw 1155;
            s
                .user
                .vestingSchedules
                .set(
                    in.senderAddress,
                    VestingInfo {
                        totalAmount: v.totalAmount,
                        claimed: v.claimed + claim,
                        startTime: v.startTime,
                        cliff: v.cliff,
                        duration: v.duration,
                    },
                );
            s.user.teamClaimed += claim;
            sendCustodyPayout(
                mutate s,
                in.senderAddress,
                claim,
                2,
                v.claimed,
                0,
                0,
            );
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventVestingClaimed {
                    beneficiary: in.senderAddress,
                    amount: claim as int257,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        SetStakingConfig => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (
                !s.ai.aiFullAutonomy && msg.apyBps <= 10000 && msg.minStake > 0 &&
                msg.lockPeriod > 0
            ) throw 1160;
            s.user.stakingEnabled = msg.enabled;
            s.user.stakingApyBps = msg.apyBps;
            s.user.stakingMinStake = msg.minStake;
            s.user.stakingLockPeriod = msg.lockPeriod;
            s.save();
        }
        SetReferralConfig => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!s.ai.aiFullAutonomy && msg.rewardBps <= 10000) throw 1161;
            s.user.referralEnabled = msg.enabled;
            s.user.referralRewardBps = msg.rewardBps;
            s.save();
        }
        SetTreasury => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!s.ai.aiFullAutonomy && !isZeroAddress(msg.treasury)) throw 1162;
            s.core.treasury = msg.treasury;
            s.save();
            emitAdmin("SetTreasury", in.senderAddress, 0, 0);
        }
        SetFeeConfig => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (
                !s.ai.aiFullAutonomy && msg.feeBps == QUASAR_WALLET_FEE_BPS &&
                msg.burnShare <= 100 &&
                msg.maxTxBps == QUASAR_MAX_TX_BPS &&
                msg.maxWalletBps == QUASAR_MAX_WALLET_BPS &&
                msg.cooldown == QUASAR_TRANSFER_COOLDOWN
            ) throw 1163;
            s.gov.pendingFee = msg.feeBps;
            s.gov.pendingFeeBurnShare = msg.burnShare as int257;
            s.gov.pendingMaxTx = msg.maxTxBps;
            s.gov.pendingMaxWallet = msg.maxWalletBps;
            s.gov.pendingCooldown = msg.cooldown;
            s.gov.pendingFeeConfigAt = blockchain.now() + s.core.ownerTransferDelay;
            s.save();
            emitAdmin(
                "ProposeFeeConfig",
                in.senderAddress,
                msg.feeBps as int257,
                msg.burnShare as int257,
            );
        }
        ToggleMinting => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!s.ai.aiFullAutonomy) throw 1164;
            s.core.mintable = msg.enabled;
            s.save();
            emitAdmin(
                "ToggleMinting",
                in.senderAddress,
                msg.enabled ? (1 as int257) : (0 as int257),
                0,
            );
        }
        SetBuybackConfig => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (
                !s.ai.aiFullAutonomy && msg.threshold > 0 && msg.cooldown > 0 &&
                msg.burnPercent > 0 &&
                msg.burnPercent <= 100
            ) throw 1165;
            s.core.buybackEnabled = msg.enabled;
            s.core.buybackThreshold = msg.threshold;
            s.core.buybackCooldown = msg.cooldown;
            s.core.buybackBurnPercent = msg.burnPercent;
            s.save();
            emitAdmin(
                "SetBuybackConfig",
                in.senderAddress,
                msg.threshold as int257,
                msg.burnPercent as int257,
            );
        }
        SetDefiAddress => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            s.core.defiAddress = msg.defiAddress;
            s.save();
            emitAdmin("SetDefiAddress", in.senderAddress, 0, 0);
        }
        SetEmergencyGuardian => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!isZeroAddress(msg.guardian)) throw 1166;
            s.core.emergencyGuardian = msg.guardian;
            s.save();
            emitAdmin("SetEmergencyGuardian", in.senderAddress, 0, 0);
        }
        GuardianPause => {
            var s = QuasarMasterStorage.load();
            assert (in.senderAddress == s.core.emergencyGuardian) throw 1167;
            s.ai.emergencyPause = true;
            s.core.tradingEnabled = false;
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventEmergencyPause {
                    guardian: in.senderAddress,
                    paused: true,
                    reason: msg.reason,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        ProposeOwner => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!isZeroAddress(msg.newOwner)) throw 1170;
            s.core.pendingOwner = msg.newOwner;
            s.core.ownerTransferAt = blockchain.now() + s.core.ownerTransferDelay;
            s.save();
            emitAdmin("ProposeOwner", in.senderAddress, s.core.ownerTransferAt, 0);
        }
        CancelOwnerTransfer => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            s.core.pendingOwner = ZERO_ADDRESS;
            s.core.ownerTransferAt = 0;
            s.save();
            emitAdmin("CancelOwnerTransfer", in.senderAddress, 0, 0);
        }
        AcceptOwner => {
            var s = QuasarMasterStorage.load();
            assert (
                !isZeroAddress(s.core.pendingOwner) && in.senderAddress == s.core.pendingOwner &&
                blockchain.now() >= s.core.ownerTransferAt
            ) throw 1171;
            s.core.owner = s.core.pendingOwner;
            s.core.pendingOwner = ZERO_ADDRESS;
            s.core.ownerTransferAt = 0;
            s.save();
            emitAdmin("AcceptOwner", in.senderAddress, 0, 0);
        }
        ProposeWalletCode => {
            val s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            throw 1172;
        }
        ProposeContent => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!s.ai.aiFullAutonomy) throw 1173;
            var content = msg.newContent.beginParse();
            assert (content.remainingBitsCount() >= 8) throw 1174;
            val prefix = content.loadUint(8);
            assert (prefix == 0 || prefix == 1) throw 1175;
            if (prefix == 1) {
                assert (
                    content.remainingBitsCount() > 0 || content.remainingRefsCount() > 0
                ) throw 1176;
            }
            s.gov.pendingContent = msg.newContent;
            s.gov.contentAt = blockchain.now() + s.core.ownerTransferDelay;
            s.save();
            emitAdmin("ProposeContent", in.senderAddress, s.gov.contentAt, 0);
        }
        SetAiOracleKey => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!s.ai.aiFullAutonomy && msg.publicKey != 0) throw 1180;
            s.ai.aiOraclePubKey = msg.publicKey;
            s.save();
            emitAdmin("SetAiOracleKey", in.senderAddress, 0, 0);
        }
        ClearAiOracleKey => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            s.ai.aiOraclePubKey = 0;
            s.save();
            emitAdmin("ClearAiOracleKey", in.senderAddress, 0, 0);
        }
        AiGrantFullAutonomy => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            s.ai.aiFullAutonomy = msg.enabled;
            if (msg.enabled) {
                s.ai.aiEnabled = true;
            }
            s.save();
        }
        AiSetOracle => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (!isZeroAddress(msg.oracleAddress)) throw 1181;
            if (msg.oracleAddress != s.ai.aiOracle) {
                s.ai.lastAiQueryId = 0;
            }
            s.ai.aiOracle = msg.oracleAddress;
            s.ai.aiEnabled = true;
            s.save();
        }
        AiHeartbeat => {
            var s = QuasarMasterStorage.load();
            assert (in.senderAddress == s.ai.aiOracle) throw 1182;
            freshAiQuery(mutate s, msg.queryId);
            s.ai.lastHeartbeat = blockchain.now();
            s.save();
        }
        AiSetFee => {
            val s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            assert (msg.feeBps == QUASAR_WALLET_FEE_BPS) throw 1183;
            s.save();
            emitAi(0, "SetFee", s.core.feeBps as int257, msg.feeBps as int257);
        }
        AiSetAntiWhale => {
            val s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            assert (
                msg.maxTxBps == QUASAR_MAX_TX_BPS && msg.maxWalletBps == QUASAR_MAX_WALLET_BPS &&
                msg.cooldown == QUASAR_TRANSFER_COOLDOWN
            ) throw 1184;
            s.save();
            emitAi(0, "SetAntiWhale", s.core.maxTxBps as int257, msg.maxTxBps as int257);
        }
        AiSetTreasuryDirect => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            requireAiCooldown(s);
            freshAiQuery(mutate s, msg.queryId);
            assert (!isZeroAddress(msg.treasury)) throw 1185;
            val old = s.core.treasury;
            s.core.treasury = msg.treasury;
            val id = logAiAction(
                mutate s,
                4,
                "SetTreasury",
                0,
                1,
                msg.reason,
                true,
            );
            s.ai.aiActionOldAddress.set(id, old);
            s.save();
            emitAi(id, "SetTreasury", 0, 1);
        }
        AiSetBuybackDirect => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            requireAiCooldown(s);
            freshAiQuery(mutate s, msg.queryId);
            assert (
                msg.threshold > 0 && msg.cooldown > 0 && msg.burnPercent > 0 &&
                msg.burnPercent <= 100
            ) throw 1186;
            val oldEnabled = s.core.buybackEnabled;
            val oldT = s.core.buybackThreshold;
            val oldC = s.core.buybackCooldown;
            val oldB = s.core.buybackBurnPercent;
            s.core.buybackEnabled = msg.enabled;
            s.core.buybackThreshold = msg.threshold;
            s.core.buybackCooldown = msg.cooldown;
            s.core.buybackBurnPercent = msg.burnPercent;
            val id = logAiAction(
                mutate s,
                6,
                "SetBuyback",
                oldEnabled ? (1 as int257) : (0 as int257),
                msg.enabled ? (1 as int257) : (0 as int257),
                msg.reason,
                true,
            );
            s.ai.aiActionOldBuybackThreshold.set(id, oldT as int257);
            s.ai.aiActionOldBuybackCooldown.set(id, oldC as int257);
            s.ai.aiActionOldBuybackBurnPercent.set(id, oldB as int257);
            s.save();
            emitAi(
                id,
                "SetBuyback",
                oldEnabled ? (1 as int257) : (0 as int257),
                msg.enabled ? (1 as int257) : (0 as int257),
            );
        }
        AiToggleMinting => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            requireAiCooldown(s);
            freshAiQuery(mutate s, msg.queryId);
            val old = s.core.mintable;
            s.core.mintable = msg.enabled;
            val id = logAiAction(
                mutate s,
                2,
                "ToggleMinting",
                old ? (1 as int257) : (0 as int257),
                msg.enabled ? (1 as int257) : (0 as int257),
                msg.reason,
                true,
            );
            s.save();
            emitAi(
                id,
                "ToggleMinting",
                old ? (1 as int257) : (0 as int257),
                msg.enabled ? (1 as int257) : (0 as int257),
            );
        }
        AiRotateOracle => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            requireAiCooldown(s);
            freshAiQuery(mutate s, msg.queryId);
            assert (s.ai.aiFullAutonomy && !isZeroAddress(msg.newOracle)) throw 1187;
            val old = s.ai.aiOracle;
            if (old != msg.newOracle) {
                s.ai.lastAiQueryId = 0;
            }
            s.ai.aiOracle = msg.newOracle;
            val id = logAiAction(
                mutate s,
                5,
                "RotateOracle",
                0,
                1,
                msg.reason,
                true,
            );
            s.ai.aiActionOldAddress.set(id, old);
            s.save();
            emitAi(id, "RotateOracle", 0, 1);
        }
        AiRebalance => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            requireAiCooldown(s);
            freshAiQuery(mutate s, msg.queryId);
            requireNotPaused(s);
            assert (
                msg.targetFeeBps == QUASAR_WALLET_FEE_BPS && msg.targetBurnShare <= 100
            ) throw 1188;
            val oldB = s.core.feeBurnShare;
            val oldF = s.core.feeBps;
            s.core.feeBps = msg.targetFeeBps;
            s.core.feeBurnShare = msg.targetBurnShare;
            s.ai.lastRebalanceTime = blockchain.now();
            s.ai.signalCount += 1;
            logAnomaly(mutate s, msg.recommendation, 100, true);
            val id = logAiAction(
                mutate s,
                7,
                "Rebalance",
                oldB as int257,
                msg.targetBurnShare as int257,
                msg.recommendation,
                true,
            );
            s.ai.aiActionOldFeeBps.set(id, oldF as int257);
            s.save();
            emitAi(id, "Rebalance", oldB as int257, msg.targetBurnShare as int257);
        }
        AiPriceSignal => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            freshAiQuery(mutate s, msg.queryId);
            val oldB = s.core.feeBurnShare;
            val oldF = s.core.feeBps;
            val oldP = s.ai.emergencyPause;
            val oldT = s.core.tradingEnabled;
            s.ai.signalCount += 1;
            if (s.ai.priceHistoryCount < QUASAR_AI_PRICE_HISTORY_CAP) {
                s.ai.priceHistory.set(blockchain.now(), msg.priceTon as int257);
                s.ai.priceHistoryCount += 1;
            } else {
                s.ai.priceHistoryDropped += 1;
            }
            if (msg.action == 2 && msg.volatility > 5000) {
                s.core.feeBurnShare = 70;
            }
            if (msg.action == 3 && msg.sentiment > 80) {
                s.core.feeBurnShare = 40;
            }
            if (msg.action == 1 && msg.sentiment < -50) {
                s.core.feeBurnShare = 80;
            }
            if (s.core.feeBurnShare != oldB) {
                val id = logAiAction(
                    mutate s,
                    11,
                    "PriceSignal",
                    oldB as int257,
                    s.core.feeBurnShare as int257,
                    "price-signal",
                    false,
                );
                s.ai.aiActionOldFeeBps.set(id, oldF as int257);
                s.ai.aiActionOldEmergencyPause.set(id, oldP ? (1 as int257) : (0 as int257));
                s.ai.aiActionOldTrading.set(id, oldT ? (1 as int257) : (0 as int257));
            }
            s.save();
        }
        AiAnomalyAlert => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            freshAiQuery(mutate s, msg.queryId);
            val oldB = s.core.feeBurnShare;
            val oldF = s.core.feeBps;
            val oldP = s.ai.emergencyPause;
            val oldT = s.core.tradingEnabled;
            logAnomaly(mutate s, msg.recommendedAction, 100, false);
            if (msg.severity == 3) {
                s.ai.emergencyPause = true;
                s.core.tradingEnabled = false;
                s.core.feeBps = 100;
                s.core.feeBurnShare = 90;
            } else if (msg.severity == 2) {
                s.core.feeBurnShare = 60;
            }
            if (
                s.core.feeBurnShare != oldB || s.core.feeBps != oldF ||
                s.ai.emergencyPause != oldP ||
                s.core.tradingEnabled != oldT
            ) {
                val id = logAiAction(
                    mutate s,
                    12,
                    "AnomalyAlert",
                    oldB as int257,
                    s.core.feeBurnShare as int257,
                    "anomaly-alert",
                    false,
                );
                s.ai.aiActionOldFeeBps.set(id, oldF as int257);
                s.ai.aiActionOldEmergencyPause.set(id, oldP ? (1 as int257) : (0 as int257));
                s.ai.aiActionOldTrading.set(id, oldT ? (1 as int257) : (0 as int257));
            }
            s.save();
        }
        AiEmergencyPause => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            freshAiQuery(mutate s, msg.queryId);
            val oldT = s.core.tradingEnabled;
            val oldP = s.ai.emergencyPause;
            val oldF = s.core.feeBps;
            val oldB = s.core.feeBurnShare;
            if (msg.pause) {
                s.ai.emergencyPause = true;
                s.core.tradingEnabled = false;
                if (msg.severity == 3) {
                    s.core.feeBps = 100;
                    s.core.feeBurnShare = 90;
                }
            } else {
                assert (s.ai.aiFullAutonomy) throw 1189;
                s.ai.emergencyPause = false;
                s.core.tradingEnabled = true;
            }
            val id = logAiAction(
                mutate s,
                3,
                "EmergencyPause",
                oldT ? (1 as int257) : (0 as int257),
                msg.pause ? (1 as int257) : (0 as int257),
                msg.reason,
                true,
            );
            s.ai.aiActionOldFeeBps.set(id, oldF as int257);
            s.ai.aiActionOldBurnShare.set(id, oldB as int257);
            s.ai.aiActionOldEmergencyPause.set(id, oldP ? (1 as int257) : (0 as int257));
            s.ai.aiActionOldTrading.set(id, oldT ? (1 as int257) : (0 as int257));
            s.save();
            emitAi(
                id,
                "EmergencyPause",
                oldT ? (1 as int257) : (0 as int257),
                msg.pause ? (1 as int257) : (0 as int257),
            );
        }
        AiGovernanceProposal => {
            var s = QuasarMasterStorage.load();
            requireAi(s, in.senderAddress);
            requireAiCooldown(s);
            freshAiQuery(mutate s, msg.queryId);
            assert (msg.confidence >= s.ai.minConfidence) throw 1190;
            s.ai.signalCount += 1;
            var old: int257 = 0;
            var kind = "";
            if (msg.proposalType == 1) {
                assert (msg.newValue == QUASAR_WALLET_FEE_BPS) throw 1191;
                old = s.core.feeBps as int257;
                s.core.feeBps = msg.newValue as uint16;
                kind = "GovernanceFee";
            } else if (msg.proposalType == 2) {
                assert (msg.newValue >= 0 && msg.newValue <= 100) throw 1192;
                old = s.core.feeBurnShare as int257;
                s.core.feeBurnShare = msg.newValue as uint8;
                kind = "GovernanceBurn";
            } else if (msg.proposalType == 4) {
                assert (msg.newValue > 0) throw 1193;
                old = s.core.buybackThreshold as int257;
                s.core.buybackThreshold = msg.newValue as coins;
                kind = "GovernanceBuybackThreshold";
            } else {
                throw 1194;
            }
            val id = logAiAction(
                mutate s,
                (msg.proposalType == 1 ? 1 : (msg.proposalType == 2 ? 8 : 13)),
                kind,
                old,
                msg.newValue,
                msg.description,
                true,
            );
            if (msg.proposalType == 1) {
                s.ai.aiActionOldFeeBps.set(id, old as int257);
            }
            if (msg.proposalType == 4) {
                s.ai.aiActionOldBuybackThreshold.set(id, old as int257);
            }
            logAnomaly(mutate s, msg.description, msg.confidence as int257, true);
            s.save();
            emitAi(id, kind, old, msg.newValue);
        }
        OwnerOverride => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            val action = actionOf(s.ai.aiActionLog, msg.actionId as int257);
            assert (
                action != null && overrideOpen(s, msg.actionId) && !action.overridden &&
                !action.vetoed
            ) throw 1200;
            val act = action;
            restoreAiAction(mutate s, msg.actionId as int257, act);
            markActionClosed(mutate s, msg.actionId as int257, act, false, true);
            s.save();
        }
        VetoAiAction => {
            var s = QuasarMasterStorage.load();
            val action = actionOf(s.ai.aiActionLog, msg.actionId as int257);
            assert (
                action != null && !action.vetoed && !action.overridden &&
                overrideOpen(s, msg.actionId) &&
                msg.amount > 0
            ) throw 1201;
            val stake = stakeOf(s.user.stakers, in.senderAddress);
            val deposit = intOf(s.user.pendingQsrDeposits, in.senderAddress);
            assert (
                stake != null && stake.amount > 0 && deposit != null && deposit >= msg.amount
            ) throw 1202;
            val key = voteKey(in.senderAddress, msg.actionId);
            assert (mapIntOf(s.ai.vetoEscrows, key) == null) throw 1203;
            s.user.pendingQsrDeposits.set(in.senderAddress, deposit - msg.amount);
            s.ai.vetoEscrows.set(key, msg.amount as int257);
            val prior = mapIntOf(s.ai.vetoActionStake, msg.actionId as int257);
            val total = (prior == null ? (0 as int257) : prior) + msg.amount;
            s.ai.vetoActionStake.set(msg.actionId as int257, total);
            s.ai.totalVetoStake += msg.amount;
            var vetoed = false;
            if (
                s.user.totalStaked > 0 &&
                total * 10000 >= s.user.totalStaked * s.ai.vetoThresholdBps
            ) {
                val act = action;
                restoreAiAction(mutate s, msg.actionId as int257, act);
                markActionClosed(mutate s, msg.actionId as int257, act, true, false);
                s.ai.pendingAiActions.delete(msg.actionId as int257);
                vetoed = true;
            }
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventAiVeto {
                    actionId: msg.actionId as int257,
                    voter: in.senderAddress,
                    amount: msg.amount as int257,
                    actionStake: total,
                    vetoed,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        ReleaseVeto => {
            var s = QuasarMasterStorage.load();
            val action = actionOf(s.ai.aiActionLog, msg.actionId as int257);
            assert (action != null && (action.vetoed || !overrideOpen(s, msg.actionId))) throw 1204;
            val key = voteKey(in.senderAddress, msg.actionId);
            val escrow = mapIntOf(s.ai.vetoEscrows, key);
            val total = mapIntOf(s.ai.vetoActionStake, msg.actionId as int257);
            assert (escrow != null && escrow > 0 && total != null && total >= escrow) throw 1205;
            s.ai.vetoEscrows.delete(key);
            s.ai.vetoActionStake.set(msg.actionId as int257, total - escrow);
            s.ai.totalVetoStake -= escrow;
            sendCustodyPayout(
                mutate s,
                in.senderAddress,
                escrow as coins,
                5,
                key,
                msg.actionId as int257,
                0,
            );
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventAiVetoReleased {
                    actionId: msg.actionId as int257,
                    voter: in.senderAddress,
                    amount: escrow,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        RefundPendingDeposit => {
            var s = QuasarMasterStorage.load();
            val deposit = intOf(s.user.pendingQsrDeposits, in.senderAddress);
            assert (deposit != null && deposit > 0) throw 1206;
            s.user.pendingQsrDeposits.delete(in.senderAddress);
            sendCustodyPayout(
                mutate s,
                in.senderAddress,
                deposit as coins,
                6,
                0,
                0,
                0,
            );
            s.save();
        }
        GovernanceVote => {
            var s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            requireNotPaused(s);
            assert (
                blockchain.now() <= msg.deadline &&
                mapBoolOf(s.gov.govProposalExecuted, msg.proposalId as int257) == null
            ) throw 1210;
            val payloadHash = beginCell()
                .storeUint(msg.proposalId, 64)
                .storeUint(msg.kind, 8)
                .storeBool(msg.flag)
                .storeUint(msg.feeBps, 32)
                .endCell()
                .hash();
            val bound = mapIntOf(s.gov.govProposalContentHash, msg.proposalId as int257);
            assert (bound == null || bound == payloadHash) throw 1211;
            val key = voteKey(in.senderAddress, msg.proposalId);
            assert (mapBoolOf(s.gov.govVotes, key) == null) throw 1212;
            val stake = stakeOf(s.user.stakers, in.senderAddress);
            assert (stake != null && stake.amount > 0) throw 1213;
            s.gov.govProposalContentHash.set(msg.proposalId as int257, payloadHash as int257);
            s.gov.govVotes.set(key, true);
            val previous = mapIntOf(s.gov.govProposalStake, msg.proposalId as int257);
            if (previous == null) {
                s.gov.govProposalCount += 1;
            }
            val total = (previous == null ? (0 as int257) : previous) + stake.amount;
            s.gov.govProposalStake.set(msg.proposalId as int257, total);
            var actionId: int257 = 0;
            if (total * 10000 >= s.user.totalStaked * s.gov.govQuorumBps) {
                if (msg.kind == 1) {
                    assert (msg.feeBps == QUASAR_WALLET_FEE_BPS) throw 1214;
                    val old = s.core.feeBps as int257;
                    s.core.feeBps = msg.feeBps;
                    actionId = logAiAction(
                        mutate s,
                        1,
                        "SetFee",
                        old as int257,
                        msg.feeBps as int257,
                        msg.reason,
                        false,
                    );
                } else if (msg.kind == 2) {
                    val old = s.core.tradingEnabled;
                    s.core.tradingEnabled = msg.flag;
                    actionId = logAiAction(
                        mutate s,
                        2,
                        "ToggleMinting",
                        old ? (1 as int257) : (0 as int257),
                        msg.flag ? (1 as int257) : (0 as int257),
                        msg.reason,
                        false,
                    );
                } else if (msg.kind == 3) {
                    val oldP = s.ai.emergencyPause;
                    val oldT = s.core.tradingEnabled;
                    val oldF = s.core.feeBps;
                    s.ai.emergencyPause = msg.flag;
                    s.core.tradingEnabled = !msg.flag;
                    actionId = logAiAction(
                        mutate s,
                        3,
                        "EmergencyPause",
                        oldP ? (1 as int257) : (0 as int257),
                        msg.flag ? (1 as int257) : (0 as int257),
                        msg.reason,
                        false,
                    );
                    s
                        .ai
                        .aiActionOldEmergencyPause
                        .set(actionId, oldP ? (1 as int257) : (0 as int257));
                    s.ai.aiActionOldTrading.set(actionId, oldT ? (1 as int257) : (0 as int257));
                    s.ai.aiActionOldFeeBps.set(actionId, oldF as int257);
                } else {
                    throw 1215;
                }
                s.gov.govProposalStake.set(msg.proposalId as int257, 0);
                s.gov.govProposalExecuted.set(msg.proposalId as int257, true);
            }
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventGovernanceVote {
                    voter: in.senderAddress,
                    proposalId: msg.proposalId as int257,
                    weight: stake.amount,
                } }).send(SEND_MODE_IGNORE_ERRORS);
            if (actionId != 0) {
                createExternalLogMessage({ dest: createAddressNone(), body: EventGovernanceExecuted {
                        proposalId: msg.proposalId as int257,
                        actionId,
                    } }).send(SEND_MODE_IGNORE_ERRORS);
            }
        }
        BuybackTon => {
            var s = QuasarMasterStorage.load();
            assert (
                !isZeroAddress(s.core.buybackSwapDefiAddress) &&
                in.senderAddress == s.core.buybackSwapDefiAddress &&
                msg.tonAmount > 0 &&
                in.valueCoins >= msg.tonAmount - grams("0.02") &&
                s.core.buybackSwapPending > 0 &&
                msg.queryId == s.core.buybackSwapQueryId &&
                msg.qsrSwapped == s.core.buybackSwapPending
            ) throw 1220;
            s.core.buybackSwapPending = 0;
            s.core.buybackSwapQueryId = 0;
            s.core.buybackSwapDefiAddress = ZERO_ADDRESS;
            s.core.totalTonSpentOnBuyback += msg.tonAmount;
            s.save();
            if (!isZeroAddress(s.core.treasury)) {
                val treasuryPayoutMessage = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: s.core.treasury,
                    value: msg.tonAmount,
                });
                treasuryPayoutMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
            }
            createExternalLogMessage({ dest: createAddressNone(), body: EventBuybackSwapped {
                    queryId: msg.queryId,
                    qsrIn: msg.qsrSwapped as int257,
                    tonOut: msg.tonAmount as int257,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        PayoutFailed => {
            var s = QuasarMasterStorage.load();
            assert (
                in.senderAddress ==
                quasarWalletAddress(
                    contract.getAddress(),
                    contract.getAddress(),
                    quasarWalletCompiledCode(),
                ) &&
                msg.amount > 0
            ) throw 1221;
            if (restorePayout(mutate s, msg.queryId)) {
                s.core.custodyBalance += msg.amount;
            }
            s.save();
        }
        ProvideWalletAddress => {
            var _s = QuasarMasterStorage.load();
            assert (in.valueCoins >= grams("0.0061")) throw 1222;
            val ownerRef: Cell<any_address>? = msg.includeAddress
                ? msg.ownerAddress.toCell()
                : null;
            // TEP-89 requires an addr_none response when a wallet cannot be
            // derived, including addr_none and external owner addresses.
            if (!msg.ownerAddress.isInternal()) {
                val body = TakeWalletAddress {
                    queryId: msg.queryId,
                    walletAddress: createAddressNone(),
                    ownerAddress: ownerRef,
                };
                val noWalletResponse = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: 0,
                    body,
                });
                noWalletResponse.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
                return;
            }
            val ownerAddress = msg.ownerAddress.castToInternal();
            val wallet = quasarWalletAddress(
                ownerAddress,
                contract.getAddress(),
                quasarWalletCompiledCode(),
            );
            val ownerAny = msg.ownerAddress;
            val walletAny = wallet as any_address;
            val (ownerWc, _) = ownerAny.getWorkchainAndHash();
            val (walletWc, _) = walletAny.getWorkchainAndHash();
            if (ownerWc == walletWc) {
                val walletResponse = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: 0,
                    body: TakeWalletAddress {
                        queryId: msg.queryId,
                        walletAddress: walletAny,
                        ownerAddress: ownerRef,
                    },
                });
                walletResponse.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
            } else {
                val body = TakeWalletAddress {
                    queryId: msg.queryId,
                    walletAddress: createAddressNone(),
                    ownerAddress: ownerRef,
                };
                val noWalletResponse = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: 0,
                    body,
                });
                noWalletResponse.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
            }
        }
        SweepTon => {
            val s = QuasarMasterStorage.load();
            requireOwner(s, in.senderAddress);
            assert (
                msg.amount > 0 &&
                msg.amount <= contract.getOriginalBalance() + in.valueCoins - QUASAR_STORAGE_RESERVE
            ) throw 1223;
            s.save();
            val sweepMessage = createMessage({
                bounce: BounceMode.NoBounce,
                dest: s.core.owner,
                value: msg.amount,
            });
            sweepMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
        }
        AiSignedDecision => {
            var s = QuasarMasterStorage.load();
            assert (
                s.ai.aiOraclePubKey != 0 && msg.validUntil >= blockchain.now() &&
                msg.nonce > s.ai.aiNonce
            ) throw 1230;
            val signed = beginCell()
                .storeUint(AI_DECISION_DOMAIN, 32)
                .storeUint(msg.queryId, 64)
                .storeUint(msg.nonce, 64)
                .storeUint(msg.validUntil, 32)
                .storeUint(msg.action, 8)
                .storeUint(msg.value, 16)
                .storeUint(msg.payloadHash, 256)
                .endCell();
            assert (
                isSignatureValid(
                    signed.hash() as uint256,
                    msg.signature as slice,
                    s.ai.aiOraclePubKey,
                )
            ) throw 1231;
            s.ai.aiNonce = msg.nonce;
            s.ai.aiSignedDecisionCount += 1;
            if (msg.action == 0) {
                s.ai.lastHeartbeat = blockchain.now();
            } else if (msg.action == 1) {
                requireAiCooldown(s);
                assert (msg.value <= 100) throw 1232;
                val old = s.core.feeBurnShare as int257;
                s.core.feeBurnShare = msg.value as uint8;
                val id = logAiAction(
                    mutate s,
                    9,
                    "SignedBurnShare",
                    old as int257,
                    msg.value as int257,
                    "signed-decision",
                    true,
                );
                s.ai.aiActionOldBurnShare.set(id, old);
            } else if (msg.action == 2) {
                val oldP = s.ai.emergencyPause;
                val oldT = s.core.tradingEnabled;
                val oldF = s.core.feeBps;
                val oldB = s.core.feeBurnShare;
                if (msg.value != 0) {
                    s.ai.emergencyPause = true;
                    s.core.tradingEnabled = false;
                } else {
                    assert (s.ai.aiFullAutonomy) throw 1233;
                    s.ai.emergencyPause = false;
                    s.core.tradingEnabled = true;
                }
                val id = logAiAction(
                    mutate s,
                    10,
                    "SignedPause",
                    oldP ? (1 as int257) : (0 as int257),
                    msg.value != 0 ? (1 as int257) : (0 as int257),
                    "signed-decision",
                    true,
                );
                s.ai.aiActionOldEmergencyPause.set(id, oldP ? (1 as int257) : (0 as int257));
                s.ai.aiActionOldTrading.set(id, oldT ? (1 as int257) : (0 as int257));
                s.ai.aiActionOldFeeBps.set(id, oldF as int257);
                s.ai.aiActionOldBurnShare.set(id, oldB as int257);
            } else {
                throw 1234;
            }
            s.save();
            createExternalLogMessage({ dest: createAddressNone(), body: EventAiSignedDecision {
                    queryId: msg.queryId as int257,
                    nonce: msg.nonce as int257,
                    action: msg.action as int257,
                    value: msg.value as int257,
                } }).send(SEND_MODE_IGNORE_ERRORS);
        }
        else => {
            var s = QuasarMasterStorage.load();
            if (!applyTextMessage(mutate s, in.senderAddress, in.body)) {
                throw 130;
            }
            s.save();
        }
    }
}

// Bounces only deserialize the header, query id and amount guaranteed by the
// 224-bit bounce prefix.  No trailing address is trusted from a bounced body.
fun onBouncedMessage(in: InMessageBounced) {
    var body = in.bouncedBody;
    body.skipBouncedPrefix();
    if (body.remainingBitsCount() < 32) {
        throw 130;
    }
    val opcode = body.loadUint(32);
    var s = QuasarMasterStorage.load();
    if (opcode == 0x178d4519) {
        val queryId = body.loadUint(64) as uint64;
        val amount = body.loadCoins();
        if (queryId == MINT_QUERY_ID) {
            assert (s.core.totalSupply >= amount) throw 1300;
            s.core.totalSupply -= amount;
        } else {
            restorePayout(mutate s, queryId);
            s.core.reserveBalance += amount;
            if (s.core.buybackSwapPending > 0 && queryId == s.core.buybackSwapQueryId) {
                s.core.buybackPool += s.core.buybackSwapPending;
                s.core.buybackSwapPending = 0;
                s.core.buybackSwapQueryId = 0;
                s.core.buybackSwapDefiAddress = ZERO_ADDRESS;
            }
        }
        s.save();
        return;
    }
    if (opcode == 0x51a5c3d1) {
        val queryId = body.loadUint(64) as uint64;
        val amount = body.loadCoins();
        if (restorePayout(mutate s, queryId)) {
            s.core.custodyBalance += amount;
        }
        s.save();
        return;
    }
    throw 130;
}

get fun get_pending_owner(): address {
    return QuasarMasterStorage.load().core.pendingOwner;
}

get fun get_owner_transfer_at(): int {
    return QuasarMasterStorage.load().core.ownerTransferAt;
}

get fun get_owner_transfer_delay(): int {
    return QuasarMasterStorage.load().core.ownerTransferDelay;
}

get fun get_jetton_data(): JettonData {
    val s = QuasarMasterStorage.load();
    return JettonData {
        totalSupply: s.core.totalSupply as int257,
        mintable: s.core.mintable,
        adminAddress: s.core.owner,
        jettonContent: s.core.content,
        jettonWalletCode: quasarWalletCompiledCode(),
    };
}

get fun get_max_supply(): int {
    return QuasarMasterStorage.load().core.maxSupply;
}

get fun get_reserve_balance(): int {
    return QuasarMasterStorage.load().core.reserveBalance;
}

get fun get_custody_balance(): int {
    return QuasarMasterStorage.load().core.custodyBalance;
}

get fun get_reserve_snapshot(): ReserveSnapshot {
    val s = QuasarMasterStorage.load();
    return ReserveSnapshot {
        reserveBalance: s.core.reserveBalance as int257,
        freeReserve: (s.core.reserveBalance - poolEncumbrance(s)) as int257,
        buybackPool: s.core.buybackPool as int257 as int257 as int257,
        stakingRewardsPool: s.user.stakingRewardsPool as int257,
        referralLiability: s.user.pendingReferralTotal as int257,
        custodyBalance: s.core.custodyBalance as int257,
        totalStaked: s.user.totalStaked as int257 as int257,
        totalSupply: s.core.totalSupply as int257,
    };
}

get fun get_user_liabilities(user: address): UserLiabilitySnapshot {
    val s = QuasarMasterStorage.load();
    val deposit = intOf(s.user.pendingQsrDeposits, user);
    val referral = intOf(s.user.pendingReferralRewards, user);
    val stake = stakeOf(s.user.stakers, user);
    val vesting = vestingOf(s.user.vestingSchedules, user);
    return UserLiabilitySnapshot {
        pendingQsrDeposit: deposit == null ? (0 as int257) : deposit,
        stakedPrincipal: stake == null ? (0 as int257) : stake.amount,
        pendingReferralReward: referral == null ? (0 as int257) : referral,
        vestedUnclaimed: vesting == null ? (0 as int257) : vesting.totalAmount - vesting.claimed,
    };
}

get fun get_emergency_guardian(): address {
    return QuasarMasterStorage.load().core.emergencyGuardian;
}

get fun get_ai_oracle_key(): uint256 {
    return QuasarMasterStorage.load().ai.aiOraclePubKey;
}

get fun get_ai_nonce(): int {
    return QuasarMasterStorage.load().ai.aiNonce;
}

get fun get_ai_signed_decision_count(): int {
    return QuasarMasterStorage.load().ai.aiSignedDecisionCount;
}

get fun get_ai_signed_domain(): int {
    return AI_DECISION_DOMAIN;
}

get fun get_wallet_address(owner: address): address {
    return quasarWalletAddress(owner, contract.getAddress(), quasarWalletCompiledCode());
}

get fun get_ai_state(): AiState {
    val s = QuasarMasterStorage.load();
    return AiState {
        oracleAddress: s.ai.aiOracle,
        aiModeEnabled: s.ai.aiEnabled,
        fullAutonomy: s.ai.aiFullAutonomy,
        lastRebalanceAt: s.ai.lastRebalanceTime,
        totalSignalsReceived: s.ai.signalCount,
        currentFeeBps: s.core.feeBps as int257,
        priceHistoryCount: s.ai.priceHistoryCount,
        anomalyCount: s.ai.anomalyIndex,
        lastHeartbeat: s.ai.lastHeartbeat,
        isAlive: isAiAlive(s),
        lastQueryId: s.ai.lastAiQueryId as int257,
    };
}

get fun get_autonomy_state(): AutonomyState {
    val s = QuasarMasterStorage.load();
    return AutonomyState {
        fullAutonomyEnabled: s.ai.aiFullAutonomy,
        aiActionCooldown: s.ai.aiActionCooldown as int257,
        lastAiActionTime: s.ai.lastAiActionTime,
        heartbeatTimeout: s.ai.heartbeatTimeout as int257,
        lastHeartbeat: s.ai.lastHeartbeat,
        ownerOverrideWindow: s.ai.ownerOverrideWindow as int257,
        vetoThresholdBps: s.ai.vetoThresholdBps as int257,
        totalVetoStake: s.ai.totalVetoStake as int257,
        pendingActions: s.ai.aiActionIndex,
    };
}

get fun get_fee_config(): FeeConfig {
    val s = QuasarMasterStorage.load();
    return FeeConfig {
        feeBps: s.core.feeBps as int257,
        burnShare: s.core.feeBurnShare as int257,
        treasuryShare: (100 - s.core.feeBurnShare) as int257,
        maxTxBps: s.core.maxTxBps as int257,
        maxWalletBps: s.core.maxWalletBps as int257,
        cooldown: s.core.cooldownSeconds as int257,
        totalBurned: s.core.totalBurned as int257,
        totalFeesCollected: s.core.totalFeesCollected as int257,
    };
}

get fun get_buyback_state(): BuybackState {
    val s = QuasarMasterStorage.load();
    return BuybackState {
        enabled: s.core.buybackEnabled,
        pool: s.core.buybackPool as int257,
        threshold: s.core.buybackThreshold as int257,
        cooldown: s.core.buybackCooldown as int257,
        burnPercent: s.core.buybackBurnPercent as int257,
        buybackSwapPending: s.core.buybackSwapPending as int257,
        buybackSwapQueryId: s.core.buybackSwapQueryId as int257,
        lastBuybackAt: s.core.lastBuybackTime as int257,
        totalBuybacks: s.core.totalBuybacks as int257,
        totalQsrBurnedViaBuyback: s.core.totalQsrBurnedViaBuyback as int257,
        totalTonSpent: s.core.totalTonSpentOnBuyback as int257,
    };
}

get fun get_staking_config(): StakingConfig {
    val s = QuasarMasterStorage.load();
    return StakingConfig {
        enabled: s.user.stakingEnabled,
        apyBps: s.user.stakingApyBps as int257,
        minStake: s.user.stakingMinStake as int257,
        lockPeriod: s.user.stakingLockPeriod as int257,
        totalStaked: s.user.totalStaked as int257,
    };
}

get fun get_stake_info(staker: address): StakeInfo? {
    return stakeOf(QuasarMasterStorage.load().user.stakers, staker);
}

get fun get_pending_qsr_deposit(depositor: address): int {
    val v = intOf(QuasarMasterStorage.load().user.pendingQsrDeposits, depositor);
    return v == null ? (0 as int257) : v;
}

get fun get_referral_info(user: address): ReferralInfo? {
    return referralOf(QuasarMasterStorage.load().user.referrals, user);
}

get fun get_pending_referral_reward(user: address): int {
    val v = intOf(QuasarMasterStorage.load().user.pendingReferralRewards, user);
    return v == null ? (0 as int257) : v;
}

get fun get_vesting_info(beneficiary: address): VestingInfo? {
    return vestingOf(QuasarMasterStorage.load().user.vestingSchedules, beneficiary);
}

get fun get_ai_action(actionId: int): AiActionLog? {
    return actionOf(QuasarMasterStorage.load().ai.aiActionLog, actionId);
}

get fun get_veto_escrow(user: address, actionId: int): int {
    val s = QuasarMasterStorage.load();
    val v = mapIntOf(s.ai.vetoEscrows, voteKey(user, actionId as uint64));
    return v == null ? (0 as int257) : v;
}

get fun get_veto_action_stake(actionId: int): int {
    val v = mapIntOf(QuasarMasterStorage.load().ai.vetoActionStake, actionId);
    return v == null ? (0 as int257) : v;
}

get fun get_ai_recommendation(index: int): AiRecommendation? {
    return recommendationOf(QuasarMasterStorage.load().ai.anomalyLog, index);
}

get fun get_price_at(timestamp: int): int? {
    val v = mapIntOf(QuasarMasterStorage.load().ai.priceHistory, timestamp);
    return v == null ? null : (v as int);
}

get fun is_paused(): bool {
    return QuasarMasterStorage.load().ai.emergencyPause;
}

get fun is_trading_enabled(): bool {
    return QuasarMasterStorage.load().core.tradingEnabled;
}

get fun is_ai_alive(): bool {
    return isAiAlive(QuasarMasterStorage.load());
}

get fun can_owner_override(actionId: int): bool {
    return overrideOpen(QuasarMasterStorage.load(), actionId as uint64);
}

get fun get_defi_address(): address {
    return QuasarMasterStorage.load().core.defiAddress;
}

get fun get_defi_fee_share(): int {
    return QuasarMasterStorage.load().core.defiFeeShareBps;
}

get fun get_governance_state(): GovernanceState {
    val s = QuasarMasterStorage.load();
    return GovernanceState {
        quorumBps: s.gov.govQuorumBps as int257,
        totalStaked: s.user.totalStaked as int257,
        proposals: s.gov.govProposalCount,
    };
}

get fun get_proposal_stake(proposalId: int): int {
    val v = mapIntOf(QuasarMasterStorage.load().gov.govProposalStake, proposalId);
    return v == null ? (0 as int257) : v;
}

get fun get_pending_fee_config_at(): int {
    return QuasarMasterStorage.load().gov.pendingFeeConfigAt;
}

get fun get_pending_wallet_code(): cell? {
    return QuasarMasterStorage.load().gov.pendingWalletCode;
}

get fun get_wallet_code_at(): int {
    return QuasarMasterStorage.load().gov.walletCodeAt;
}

get fun get_pending_content(): cell? {
    return QuasarMasterStorage.load().gov.pendingContent;
}

get fun get_content_at(): int {
    return QuasarMasterStorage.load().gov.contentAt;
}
