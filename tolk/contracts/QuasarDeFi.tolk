import "@gen/QuasarWallet.code"
import "QuasarCommon"

// QUASAR DeFi message ABI. Prefixes and field widths are pinned to the Tact
// reference ABI; do not replace these with compiler-generated name hashes.
struct (0xb857497a) AddLiquidity {
    tonAmount: coins
    qsrAmount: coins
    minLpOut: coins
    deadline: uint32
}

struct (0x509b0d6a) RemoveLiquidity {
    lpAmount: coins
    minTonOut: coins
    minQsrOut: coins
    deadline: uint32
}

struct (0x94e82670) SwapToTon {
    qsrAmount: coins
    minTonOut: coins
    deadline: uint32
}

struct (0x6cf24972) SwapToQsr {
    tonAmount: coins
    minQsrOut: coins
    deadline: uint32
}

struct (0x511327f0) ClaimFarmRewards {}

struct (0x66866ad9) EmergencyWithdrawFarm {}

struct (0x6482e5b4) SetFarmEnabled {
    enabled: bool
}

struct (0x27895d7c) FundFarm {
    amount: coins
}

struct (0xe7ceed7e) SetFarmConfig {
    rewardPerSecond: coins
    startTime: uint32
    endTime: uint32
}

struct (0x17000fb2) SetFeeBps {
    feeBps: uint16
}

struct (0x096819ff) SetPaused {
    paused: bool
}

struct (0xdcff684f) SetMaxTradeBps {
    maxTradeBps: uint16
}

struct (0x17614302) ProposePoolOwner {
    newOwner: address
}

struct (0x3b837993) AcceptPoolOwner {}

struct (0x42943fa8) CancelPoolOwner {}

struct (0x871208ba) SweepTon {
    amount: coins
}

struct (0x41348115) RefundPendingQsr {}

struct (0x04ee321c) RetrySwapQsr {
    swapId: uint64
    destination: address
}

struct (0xda903644) ClaimSwapTonRefund {
    swapId: uint64
}

struct (0xc1e15710) ClaimTonPayout {
    claimId: uint64
    destination: address
}

struct (0x946a98b6) Deploy {
    queryId: uint64
}

struct (0xaff90f57) DeployOk {
    queryId: uint64
}

struct (0x746f6e70) TonPayout {
    queryId: uint64
    amount: coins
}

struct (0x2c7e91a4) BuybackTon {
    queryId: uint64
    tonAmount: coins
    qsrSwapped: coins
}

@overflow1023_policy("suppress")
struct (0x1323cbef) EventLiquidityAdded {
    provider: address
    tonAmount: int257
    qsrAmount: int257
    lpMinted: int257
}

@overflow1023_policy("suppress")
struct (0x5b4f24a9) EventLiquidityRemoved {
    provider: address
    tonOut: int257
    qsrOut: int257
    lpBurned: int257
}

@overflow1023_policy("suppress")
struct (0xc02a5493) EventSwap {
    trader: address
    tonIn: int257
    qsrIn: int257
    tonOut: int257
    qsrOut: int257
    fee: int257
}

struct (0xca3de6d5) EventFarmReward {
    farmer: address
    amount: int257
}

struct (0x60d4a4da) EventFeeCollected {
    amount: int257
}

struct (0xd6ee9362) EventBuybackBounceUnknown {
    queryId: uint64
}

// The Tact reference packs fields that would exceed a cell into a tail ref
// while keeping the ABI field order unchanged. Default Tolk struct packing is
// flat, which overflows when these events are emitted.
fun EventLiquidityAdded.packToBuilder(self, mutate root: builder) {
    var tail = beginCell();
    tail.storeInt(self.lpMinted, 257);
    root.storeUint(0x1323cbef, 32);
    root.storeAddress(self.provider);
    root.storeInt(self.tonAmount, 257);
    root.storeInt(self.qsrAmount, 257);
    root.storeRef(tail.endCell());
}

fun EventLiquidityAdded.unpackFromSlice(mutate root: slice): EventLiquidityAdded {
    assert (root.loadUint(32) == 0x1323cbef) throw 63;
    val provider = root.loadAddress();
    val tonAmount = root.loadInt(257) as int257;
    val qsrAmount = root.loadInt(257) as int257;
    var tail = root.loadRef().beginParse();
    val lpMinted = tail.loadInt(257) as int257;
    tail.assertEnd();
    root.assertEnd();
    return {
        provider,
        tonAmount,
        qsrAmount,
        lpMinted,
    };
}

fun EventLiquidityRemoved.packToBuilder(self, mutate root: builder) {
    var tail = beginCell();
    tail.storeInt(self.lpBurned, 257);
    root.storeUint(0x5b4f24a9, 32);
    root.storeAddress(self.provider);
    root.storeInt(self.tonOut, 257);
    root.storeInt(self.qsrOut, 257);
    root.storeRef(tail.endCell());
}

fun EventLiquidityRemoved.unpackFromSlice(mutate root: slice): EventLiquidityRemoved {
    assert (root.loadUint(32) == 0x5b4f24a9) throw 63;
    val provider = root.loadAddress();
    val tonOut = root.loadInt(257) as int257;
    val qsrOut = root.loadInt(257) as int257;
    var tail = root.loadRef().beginParse();
    val lpBurned = tail.loadInt(257) as int257;
    tail.assertEnd();
    root.assertEnd();
    return {
        provider,
        tonOut,
        qsrOut,
        lpBurned,
    };
}

fun EventSwap.packToBuilder(self, mutate root: builder) {
    var tail = beginCell();
    tail.storeInt(self.tonOut, 257);
    tail.storeInt(self.qsrOut, 257);
    tail.storeInt(self.fee, 257);
    root.storeUint(0xc02a5493, 32);
    root.storeAddress(self.trader);
    root.storeInt(self.tonIn, 257);
    root.storeInt(self.qsrIn, 257);
    root.storeRef(tail.endCell());
}

fun EventSwap.unpackFromSlice(mutate root: slice): EventSwap {
    assert (root.loadUint(32) == 0xc02a5493) throw 63;
    val trader = root.loadAddress();
    val tonIn = root.loadInt(257) as int257;
    val qsrIn = root.loadInt(257) as int257;
    var tail = root.loadRef().beginParse();
    val tonOut = tail.loadInt(257) as int257;
    val qsrOut = tail.loadInt(257) as int257;
    val fee = tail.loadInt(257) as int257;
    tail.assertEnd();
    root.assertEnd();
    return {
        trader,
        tonIn,
        qsrIn,
        tonOut,
        qsrOut,
        fee,
    };
}

struct LpInfo {
    totalSupply: int257
    tonReserve: int257
    qsrReserve: int257
}

struct DeFiReserveSnapshot {
    lpTotalSupply: int257
    tonReserve: int257
    qsrReserve: int257
    feeAccumulatedTon: int257
    feeAccumulatedQsr: int257
    farmRewardReserve: int257
    farmTotalStaked: int257
}

struct FarmInfo {
    staked: int257
    rewardPerSecond: int257
    lastUpdate: int257
    accRewardPerShare: int257
    startTime: int257
    endTime: int257
}

struct UserFarmInfo {
    staked: int257
    debt: int257
    pending: int257
}

struct PendingPayout {
    amount: int257
    kind: int257
    beneficiary: address
}

struct PendingTonPayout {
    kind: int257
    beneficiary: address
    tonOut: int257
    qsrAmount: int257
    lpAmount: int257
    qsrSettled: bool
    // LP stake to restore for kind 1, or the TON fee to restore for kind 2.
    rollbackAmount: int257
    claimId: uint64
    activeAttemptId: uint64
    // 0 = primary transfer pending, 1 = TON is claimable, 2 = retry pending.
    stage: uint8
}

// The Tact source expresses map values as ^PendingTonPayout. Keep the original
// field order, accept its legacy three-field tail, and append recovery metadata.
struct PendingTonPayoutTail {
    qsrAmount: int257
    lpAmount: int257
    qsrSettled: bool
    rollbackAmount: int257
    claimId: uint64
    activeAttemptId: uint64
    stage: uint8
}

struct PendingTonPayoutWire {
    kind: int257
    beneficiary: address
    tonOut: int257
    tail: Cell<PendingTonPayoutTail>
}

struct PendingQsrSwap {
    status: uint8
    swapId: uint64
    payoutId: uint64
    beneficiary: address
    destination: address
    tonIn: coins
    qsrOut: coins
    feeQsr: coins
}

struct PendingQsrSwapTail {
    qsrOut: coins
    feeQsr: coins
}

struct PendingQsrSwapWire {
    status: uint8
    swapId: uint64
    payoutId: uint64
    beneficiary: address
    destination: address
    tonIn: coins
    tail: Cell<PendingQsrSwapTail>
}

struct DeferredBuyback {
    active: bool
    queryId: uint64
    qsrAmount: coins
}

struct TonPayoutClaimInfo {
    beneficiary: address
    amount: int257
    status: uint8
    activeAttemptId: uint64
}

struct SwapQuote {
    tonIn: int257
    qsrIn: int257
    tonOut: int257
    qsrOut: int257
    fee: int257
    priceImpactBps: int257
}

// Field order, widths, and the four-cell ref chain below are copied from the
// isolated historical compiler output retained under docs/historical/. In particular,
// Tact's struct-valued maps are dictionary values behind a reference.
@overflow1023_policy("suppress")
struct QuasarDeFiStorage {
    owner: address
    qsrMaster: address
    lpTotalSupply: coins
    tonReserve: coins
    qsrReserve: coins
    lpBalances: map<address, int257>
    pendingQsrDeposits: map<address, int257>
    pendingQsrDepositsAt: map<address, int257>
    feeBps: uint16
    feeAccumulatedTon: coins
    feeAccumulatedQsr: coins
    farmEnabled: bool
    farmRewardPerSecond: coins
    farmStartTime: uint32
    farmEndTime: uint32
    farmLastUpdate: int257
    farmAccRewardPerShare: int257
    farmTotalStaked: coins
    farmRewardReserve: coins
    farmStakes: map<address, Cell<UserFarmInfo>>
    locked: bool
    paused: bool
    maxTradeBps: uint16
    minimumLiquidity: coins
    priceCumulativeQsrPerTon: int257
    priceCumulativeTonPerQsr: int257
    lastPriceObservation: uint32
    pendingFeeBps: uint16
    pendingFeeAt: uint32
    pendingMaxTradeBps: uint16
    pendingMaxTradeAt: uint32
    pendingOwner: address
    ownerTransferAt: uint32
    ownerTransferDelay: uint32
    payoutSeq: uint64
    pendingPayouts: map<int257, Cell<PendingPayout>>
    pendingTonPayouts: map<int257, Cell<PendingTonPayoutWire>>
    tonPayoutSeq: uint64
    pendingBuybackActive: bool
    pendingBuybackQueryId: uint64
    pendingBuybackTonOut: coins
    pendingBuybackFee: coins
    prevBuybackActive: bool
    prevBuybackQueryId: uint64
    prevBuybackTonOut: coins
    prevBuybackFee: coins
    pendingQsrSwap: PendingQsrSwap
    tonClaimsHeld: coins
    deferredBuyback: DeferredBuyback
}

fun PendingTonPayout.toWireCell(self): Cell<PendingTonPayoutWire> {
    var tail = beginCell();
    tail.storeInt(self.qsrAmount, 257);
    tail.storeInt(self.lpAmount, 257);
    tail.storeBool(self.qsrSettled);
    tail.storeInt(self.rollbackAmount, 257);
    tail.storeUint(self.claimId, 64);
    tail.storeUint(self.activeAttemptId, 64);
    tail.storeUint(self.stage, 8);
    return PendingTonPayoutWire {
        kind: self.kind,
        beneficiary: self.beneficiary,
        tonOut: self.tonOut,
        tail: tail.endCell() as Cell<PendingTonPayoutTail>,
    }.toCell();
}

fun PendingTonPayoutWire.toPendingTonPayout(self): PendingTonPayout {
    var tail = self.tail.beginParse();
    val qsrAmount = tail.loadInt(257) as int257;
    val lpAmount = tail.loadInt(257) as int257;
    val qsrSettled = tail.loadBool();
    var rollbackAmount: int257 = 0;
    var claimId: uint64 = 0;
    var activeAttemptId: uint64 = 0;
    var stage: uint8 = 0;
    // Existing dictionaries contain only qsrAmount, lpAmount and qsrSettled.
    if (tail.remainingBitsCount() == 393) {
        rollbackAmount = tail.loadInt(257) as int257;
        claimId = tail.loadUint(64) as uint64;
        activeAttemptId = tail.loadUint(64) as uint64;
        stage = tail.loadUint(8) as uint8;
    } else {
        assert (tail.remainingBitsCount() == 0 && tail.remainingRefsCount() == 0) throw 1240;
    }
    tail.assertEnd();
    return PendingTonPayout {
        kind: self.kind,
        beneficiary: self.beneficiary,
        tonOut: self.tonOut,
        qsrAmount,
        lpAmount,
        qsrSettled,
        rollbackAmount,
        claimId,
        activeAttemptId,
        stage,
    };
}

fun PendingQsrSwap.toWireCell(self): Cell<PendingQsrSwapWire> {
    val tail = PendingQsrSwapTail {
        qsrOut: self.qsrOut,
        feeQsr: self.feeQsr,
    }.toCell();
    return PendingQsrSwapWire {
        status: self.status,
        swapId: self.swapId,
        payoutId: self.payoutId,
        beneficiary: self.beneficiary,
        destination: self.destination,
        tonIn: self.tonIn,
        tail,
    }.toCell();
}

fun PendingQsrSwapWire.toPendingQsrSwap(self): PendingQsrSwap {
    val tail = self.tail.load();
    return PendingQsrSwap {
        status: self.status,
        swapId: self.swapId,
        payoutId: self.payoutId,
        beneficiary: self.beneficiary,
        destination: self.destination,
        tonIn: self.tonIn,
        qsrOut: tail.qsrOut,
        feeQsr: tail.feeQsr,
    };
}

fun QuasarDeFiStorage.unpackFromSlice(mutate root: slice): QuasarDeFiStorage {
    val owner = root.loadAddress();
    val qsrMaster = root.loadAddress();
    val lpTotalSupply = root.loadCoins();
    val tonReserve = root.loadCoins();
    val qsrReserve = root.loadCoins();
    val lpBalances = createMapFromLowLevelDict<address, int257>(root.loadDict());

    var cell1 = root.loadRef().beginParse();
    val pendingQsrDeposits = createMapFromLowLevelDict<address, int257>(cell1.loadDict());
    val pendingQsrDepositsAt = createMapFromLowLevelDict<address, int257>(cell1.loadDict());
    val feeBps = cell1.loadUint(16) as uint16;
    val feeAccumulatedTon = cell1.loadCoins();
    val feeAccumulatedQsr = cell1.loadCoins();
    val farmEnabled = cell1.loadBool();
    val farmRewardPerSecond = cell1.loadCoins();
    val farmStartTime = cell1.loadUint(32) as uint32;
    val farmEndTime = cell1.loadUint(32) as uint32;
    val farmLastUpdate = cell1.loadInt(257) as int257;
    val farmAccRewardPerShare = cell1.loadInt(257) as int257;

    var cell2 = cell1.loadRef().beginParse();
    val farmTotalStaked = cell2.loadCoins();
    val farmRewardReserve = cell2.loadCoins();
    val farmStakes = createMapFromLowLevelDict<address, Cell<UserFarmInfo>>(cell2.loadDict());
    val locked = cell2.loadBool();
    val paused = cell2.loadBool();
    val maxTradeBps = cell2.loadUint(16) as uint16;
    val minimumLiquidity = cell2.loadCoins();
    val priceCumulativeQsrPerTon = cell2.loadInt(257) as int257;
    val priceCumulativeTonPerQsr = cell2.loadInt(257) as int257;
    val lastPriceObservation = cell2.loadUint(32) as uint32;
    val pendingFeeBps = cell2.loadUint(16) as uint16;
    val pendingFeeAt = cell2.loadUint(32) as uint32;
    val pendingMaxTradeBps = cell2.loadUint(16) as uint16;

    var cell3 = cell2.loadRef().beginParse();
    val pendingMaxTradeAt = cell3.loadUint(32) as uint32;
    val pendingOwner = cell3.loadAddress();
    val ownerTransferAt = cell3.loadUint(32) as uint32;
    val ownerTransferDelay = cell3.loadUint(32) as uint32;
    val payoutSeq = cell3.loadUint(64) as uint64;
    val pendingPayouts = createMapFromLowLevelDict<int257, Cell<PendingPayout>>(cell3.loadDict());
    val pendingTonPayouts = createMapFromLowLevelDict<int257, Cell<PendingTonPayoutWire>>(
        cell3.loadDict(),
    );
    val tonPayoutSeq = cell3.loadUint(64) as uint64;
    val pendingBuybackActive = cell3.loadBool();
    val pendingBuybackQueryId = cell3.loadUint(64) as uint64;
    val pendingBuybackTonOut = cell3.loadCoins();
    val pendingBuybackFee = cell3.loadCoins();
    val prevBuybackActive = cell3.loadBool();
    val prevBuybackQueryId = cell3.loadUint(64) as uint64;
    val prevBuybackTonOut = cell3.loadCoins();

    var cell4 = cell3.loadRef().beginParse();
    val prevBuybackFee = cell4.loadCoins();
    var tonClaimsHeld: coins = 0;
    var deferredBuyback = DeferredBuyback {
        active: false,
        queryId: 0,
        qsrAmount: 0,
    };
    var pendingQsrSwap = PendingQsrSwap {
        status: 0,
        swapId: 0,
        payoutId: 0,
        beneficiary: owner,
        destination: owner,
        tonIn: 0,
        qsrOut: 0,
        feeQsr: 0,
    };
    if (cell4.remainingRefsCount() == 1) {
        var recovery = cell4.loadRef().beginParse();
        val recoveryVersion = recovery.loadUint(8);
        assert (recoveryVersion == 1 || recoveryVersion == 2) throw 1241;
        tonClaimsHeld = recovery.loadCoins();
        var swapWire = recovery.loadRef().beginParse();
        val swapStatus = swapWire.loadUint(8) as uint8;
        val swapId = swapWire.loadUint(64) as uint64;
        val payoutId = swapWire.loadUint(64) as uint64;
        val swapBeneficiary = swapWire.loadAddress();
        val swapDestination = swapWire.loadAddress();
        val tonIn = swapWire.loadCoins();
        var swapTail = swapWire.loadRef().beginParse();
        val qsrOut = swapTail.loadCoins();
        val feeQsr = swapTail.loadCoins();
        swapTail.assertEnd();
        swapWire.assertEnd();
        pendingQsrSwap = PendingQsrSwap {
            status: swapStatus,
            swapId,
            payoutId,
            beneficiary: swapBeneficiary,
            destination: swapDestination,
            tonIn,
            qsrOut,
            feeQsr,
        };
        if (recoveryVersion == 2) {
            deferredBuyback = DeferredBuyback {
                active: recovery.loadBool(),
                queryId: recovery.loadUint(64) as uint64,
                qsrAmount: recovery.loadCoins(),
            };
        }
        recovery.assertEnd();
    } else {
        assert (cell4.remainingRefsCount() == 0) throw 1242;
    }
    cell4.assertEnd();
    cell3.assertEnd();
    cell2.assertEnd();
    cell1.assertEnd();
    root.assertEnd();
    return {
        owner,
        qsrMaster,
        lpTotalSupply,
        tonReserve,
        qsrReserve,
        lpBalances,
        pendingQsrDeposits,
        pendingQsrDepositsAt,
        feeBps,
        feeAccumulatedTon,
        feeAccumulatedQsr,
        farmEnabled,
        farmRewardPerSecond,
        farmStartTime,
        farmEndTime,
        farmLastUpdate,
        farmAccRewardPerShare,
        farmTotalStaked,
        farmRewardReserve,
        farmStakes,
        locked,
        paused,
        maxTradeBps,
        minimumLiquidity,
        priceCumulativeQsrPerTon,
        priceCumulativeTonPerQsr,
        lastPriceObservation,
        pendingFeeBps,
        pendingFeeAt,
        pendingMaxTradeBps,
        pendingMaxTradeAt,
        pendingOwner,
        ownerTransferAt,
        ownerTransferDelay,
        payoutSeq,
        pendingPayouts,
        pendingTonPayouts,
        tonPayoutSeq,
        pendingBuybackActive,
        pendingBuybackQueryId,
        pendingBuybackTonOut,
        pendingBuybackFee,
        prevBuybackActive,
        prevBuybackQueryId,
        prevBuybackTonOut,
        prevBuybackFee,
        pendingQsrSwap,
        tonClaimsHeld,
        deferredBuyback,
    };
}

fun QuasarDeFiStorage.packToBuilder(self, mutate root: builder) {
    var recovery = beginCell();
    recovery.storeUint(2, 8);
    recovery.storeCoins(self.tonClaimsHeld);
    recovery.storeRef(self.pendingQsrSwap.toWireCell());
    recovery.storeBool(self.deferredBuyback.active);
    recovery.storeUint(self.deferredBuyback.queryId, 64);
    recovery.storeCoins(self.deferredBuyback.qsrAmount);

    var cell4 = beginCell();
    cell4.storeCoins(self.prevBuybackFee);
    cell4.storeRef(recovery.endCell());

    var cell3 = beginCell();
    cell3.storeUint(self.pendingMaxTradeAt, 32);
    cell3.storeAddress(self.pendingOwner);
    cell3.storeUint(self.ownerTransferAt, 32);
    cell3.storeUint(self.ownerTransferDelay, 32);
    cell3.storeUint(self.payoutSeq, 64);
    cell3.storeDict(self.pendingPayouts.toLowLevelDict());
    cell3.storeDict(self.pendingTonPayouts.toLowLevelDict());
    cell3.storeUint(self.tonPayoutSeq, 64);
    cell3.storeBool(self.pendingBuybackActive);
    cell3.storeUint(self.pendingBuybackQueryId, 64);
    cell3.storeCoins(self.pendingBuybackTonOut);
    cell3.storeCoins(self.pendingBuybackFee);
    cell3.storeBool(self.prevBuybackActive);
    cell3.storeUint(self.prevBuybackQueryId, 64);
    cell3.storeCoins(self.prevBuybackTonOut);
    cell3.storeRef(cell4.endCell());

    var cell2 = beginCell();
    cell2.storeCoins(self.farmTotalStaked);
    cell2.storeCoins(self.farmRewardReserve);
    cell2.storeDict(self.farmStakes.toLowLevelDict());
    cell2.storeBool(self.locked);
    cell2.storeBool(self.paused);
    cell2.storeUint(self.maxTradeBps, 16);
    cell2.storeCoins(self.minimumLiquidity);
    cell2.storeInt(self.priceCumulativeQsrPerTon, 257);
    cell2.storeInt(self.priceCumulativeTonPerQsr, 257);
    cell2.storeUint(self.lastPriceObservation, 32);
    cell2.storeUint(self.pendingFeeBps, 16);
    cell2.storeUint(self.pendingFeeAt, 32);
    cell2.storeUint(self.pendingMaxTradeBps, 16);
    cell2.storeRef(cell3.endCell());

    var cell1 = beginCell();
    cell1.storeDict(self.pendingQsrDeposits.toLowLevelDict());
    cell1.storeDict(self.pendingQsrDepositsAt.toLowLevelDict());
    cell1.storeUint(self.feeBps, 16);
    cell1.storeCoins(self.feeAccumulatedTon);
    cell1.storeCoins(self.feeAccumulatedQsr);
    cell1.storeBool(self.farmEnabled);
    cell1.storeCoins(self.farmRewardPerSecond);
    cell1.storeUint(self.farmStartTime, 32);
    cell1.storeUint(self.farmEndTime, 32);
    cell1.storeInt(self.farmLastUpdate, 257);
    cell1.storeInt(self.farmAccRewardPerShare, 257);
    cell1.storeRef(cell2.endCell());

    root.storeAddress(self.owner);
    root.storeAddress(self.qsrMaster);
    root.storeCoins(self.lpTotalSupply);
    root.storeCoins(self.tonReserve);
    root.storeCoins(self.qsrReserve);
    root.storeDict(self.lpBalances.toLowLevelDict());
    root.storeRef(cell1.endCell());
}

fun QuasarDeFiStorage.load(): QuasarDeFiStorage {
    return QuasarDeFiStorage.fromCell(contract.getData());
}

fun QuasarDeFiStorage.save(self) {
    contract.setData(self.toCell());
}

// Constructor-equivalent defaults. The deployment wrapper must serialize this
// value using the owner and QSR master supplied to the Tact init(owner, master).
fun newQuasarDeFiStorage(owner: address, qsrMaster: address): QuasarDeFiStorage {
    val now = blockchain.now();
    return {
        owner,
        qsrMaster,
        lpTotalSupply: 0,
        tonReserve: 0,
        qsrReserve: 0,
        lpBalances: [],
        pendingQsrDeposits: [],
        pendingQsrDepositsAt: [],
        feeBps: 30,
        feeAccumulatedTon: 0,
        feeAccumulatedQsr: 0,
        farmEnabled: false,
        farmRewardPerSecond: 100000000,
        farmStartTime: now as uint32,
        farmEndTime: (now + 31536000) as uint32,
        farmLastUpdate: now,
        farmAccRewardPerShare: 0,
        farmTotalStaked: 0,
        farmRewardReserve: 0,
        farmStakes: [],
        locked: false,
        paused: false,
        maxTradeBps: 3000,
        minimumLiquidity: 1000,
        priceCumulativeQsrPerTon: 0,
        priceCumulativeTonPerQsr: 0,
        lastPriceObservation: now as uint32,
        pendingFeeBps: 0,
        pendingFeeAt: 0,
        pendingMaxTradeBps: 0,
        pendingMaxTradeAt: 0,
        pendingOwner: address("0:0000000000000000000000000000000000000000000000000000000000000000"),
        ownerTransferAt: 0,
        ownerTransferDelay: 172800,
        payoutSeq: 0,
        pendingPayouts: [],
        pendingTonPayouts: [],
        tonPayoutSeq: 0,
        pendingBuybackActive: false,
        pendingBuybackQueryId: 0,
        pendingBuybackTonOut: 0,
        pendingBuybackFee: 0,
        prevBuybackActive: false,
        prevBuybackQueryId: 0,
        prevBuybackTonOut: 0,
        prevBuybackFee: 0,
        pendingQsrSwap: PendingQsrSwap {
            status: 0,
            swapId: 0,
            payoutId: 0,
            beneficiary: owner,
            destination: owner,
            tonIn: 0,
            qsrOut: 0,
            feeQsr: 0,
        },
        tonClaimsHeld: 0,
        deferredBuyback: DeferredBuyback {
            active: false,
            queryId: 0,
            qsrAmount: 0,
        },
    };
}

type AllowedMessageToQuasarDeFi =
    | AddLiquidity
    | RemoveLiquidity
    | SwapToTon
    | SwapToQsr
    | ClaimFarmRewards
    | EmergencyWithdrawFarm
    | SetFarmEnabled
    | FundFarm
    | SetFarmConfig
    | SetFeeBps
    | SetPaused
    | SetMaxTradeBps
    | ProposePoolOwner
    | AcceptPoolOwner
    | CancelPoolOwner
    | SweepTon
    | RefundPendingQsr
    | RetrySwapQsr
    | ClaimSwapTonRefund
    | ClaimTonPayout
    | TokenNotification
    | TokenExcesses
    | PayoutFailed
    | Deploy

type DeFiBounceMessage = TonPayout | BuybackTon

contract QuasarDeFi {
    author: "QUASAR"
    version: "2.0.0"
    description: "QUASAR CPMM liquidity pool and yield farm"
    storage: QuasarDeFiStorage
    incomingMessages: AllowedMessageToQuasarDeFi
}

const DEFI_SCALE: int257 = 1000000000
const QSR_BUYBACK_MARKER = 0x5f4a3b21
const ZERO_ADDRESS: address = address("0:0000000000000000000000000000000000000000000000000000000000000000")
const DAY_YEAR = 31536000
const TON_CLAIM_CALL_MIN_VALUE: coins = 50000000
const TON_CLAIM_FEE_RESERVE: coins = 10000000
// Retry attempts must never collide with stable payout/claim IDs allocated by
// nextPayoutId. The high bit is internal and does not alter any public message
// layout; bounced callbacks carry the exact uint64 attempt ID.
const TON_ATTEMPT_ID_BASE: uint64 = 9223372036854775808

fun minimum(a: int257, b: int257): int257 {
    return a < b ? a : b;
}

fun integerSqrt(value: int257): int257 {
    if (value <= 0) {
        return 0;
    }
    var x = value;
    var y = (x + 1) / 2;
    while (y < x) {
        x = y;
        y = (x + value / x) / 2;
    }
    return x;
}

fun pendingInt(m: map<address, int257>, user: address): int257? {
    val result = m.get(user);
    if (!result.isFound) {
        return null;
    }
    return result.loadValue();
}

fun lpBalanceOf(m: map<address, int257>, user: address): int257 {
    val result = m.get(user);
    return result.isFound ? result.loadValue() : 0;
}

fun farmInfoOf(m: map<address, Cell<UserFarmInfo>>, user: address): UserFarmInfo? {
    val result = m.get(user);
    if (!result.isFound) {
        return null;
    }
    return result.loadValue().load();
}

fun payoutOf(m: map<int257, Cell<PendingPayout>>, id: int257): PendingPayout? {
    val result = m.get(id);
    if (!result.isFound) {
        return null;
    }
    return result.loadValue().load();
}

fun tonPayoutOf(m: map<int257, Cell<PendingTonPayoutWire>>, id: int257): PendingTonPayout? {
    val result = m.get(id);
    if (!result.isFound) {
        return null;
    }
    var payout = result.loadValue().load().toPendingTonPayout();
    // Legacy cells predate claim/attempt metadata. The map key is the only
    // authenticated identity available for an in-flight legacy payout, so
    // normalize only stage-0 records and never invent a new claim ID.
    if (payout.stage == 0 && payout.claimId == 0 && payout.activeAttemptId == 0) {
        payout.claimId = id as uint64;
        payout.activeAttemptId = id as uint64;
    }
    return payout;
}

fun markTonPayoutClaimable(
    mutate s: QuasarDeFiStorage,
    id: uint64,
    payout: PendingTonPayout,
    amount: coins,
) {
    s
        .pendingTonPayouts
        .set(
            id as int257,
            PendingTonPayout {
                kind: payout.kind,
                beneficiary: payout.beneficiary,
                tonOut: amount as int257,
                qsrAmount: payout.qsrAmount,
                lpAmount: payout.lpAmount,
                qsrSettled: payout.qsrSettled,
                rollbackAmount: payout.rollbackAmount,
                claimId: payout.claimId,
                activeAttemptId: 0,
                stage: 1,
            }.toWireCell(),
        );
    s.tonClaimsHeld += amount;
}

fun lock(mutate s: QuasarDeFiStorage) {
    assert (!s.locked) throw 1001;
    s.locked = true;
}

fun unlock(mutate s: QuasarDeFiStorage) {
    s.locked = false;
}

fun requireActive(s: QuasarDeFiStorage) {
    assert (!s.paused) throw 1002;
}

fun requireNoPendingQsrSwap(s: QuasarDeFiStorage) {
    assert (s.pendingQsrSwap.status == 0) throw 1243;
}

fun requireDeadline(deadline: uint32) {
    assert (deadline > blockchain.now()) throw 1003;
}

fun nextPayoutId(mutate s: QuasarDeFiStorage): uint64 {
    s.payoutSeq = (s.payoutSeq + 1) as uint64;
    return s.payoutSeq;
}

fun nextTonPayoutId(mutate s: QuasarDeFiStorage): uint64 {
    s.tonPayoutSeq = (s.tonPayoutSeq + 1) as uint64;
    return TON_ATTEMPT_ID_BASE + s.tonPayoutSeq;
}

fun recordPriceObservation(mutate s: QuasarDeFiStorage) {
    val now = blockchain.now();
    if (s.lastPriceObservation == 0 || s.tonReserve == 0 || s.qsrReserve == 0) {
        s.lastPriceObservation = now as uint32;
        return;
    }
    val elapsed = now - s.lastPriceObservation;
    if (elapsed > 0) {
        s.priceCumulativeQsrPerTon += (s.qsrReserve * elapsed) / s.tonReserve;
        s.priceCumulativeTonPerQsr += (s.tonReserve * elapsed) / s.qsrReserve;
        s.lastPriceObservation = now as uint32;
    }
}

fun updateFarm(mutate s: QuasarDeFiStorage) {
    val now = blockchain.now();
    if (now <= s.farmLastUpdate) {
        return;
    }
    val end = minimum(now, s.farmEndTime as int257);
    if (end <= s.farmLastUpdate) {
        return;
    }
    if (s.farmTotalStaked == 0 || !s.farmEnabled) {
        s.farmLastUpdate = end;
        return;
    }
    var reward = (end - s.farmLastUpdate) * s.farmRewardPerSecond;
    if (reward > s.farmRewardReserve) {
        reward = s.farmRewardReserve;
    }
    if (reward > 0) {
        s.farmRewardReserve -= reward;
        s.farmAccRewardPerShare += (reward * DEFI_SCALE) / s.farmTotalStaked;
    }
    s.farmLastUpdate = end;
}

fun stakeLp(mutate s: QuasarDeFiStorage, user: address, amount: int257) {
    val old = farmInfoOf(s.farmStakes, user);
    if (old == null) {
        s
            .farmStakes
            .set(
                user,
                UserFarmInfo {
                    staked: amount,
                    debt: s.farmAccRewardPerShare,
                    pending: 0,
                }.toCell(),
            );
    } else {
        val accrued = (old.staked * (s.farmAccRewardPerShare - old.debt)) / DEFI_SCALE;
        s
            .farmStakes
            .set(
                user,
                UserFarmInfo {
                    staked: old.staked + amount,
                    debt: s.farmAccRewardPerShare,
                    pending: old.pending + accrued,
                }.toCell(),
            );
    }
    s.farmTotalStaked += amount;
}

fun unstakeLp(mutate s: QuasarDeFiStorage, user: address, amount: int257) {
    val old = farmInfoOf(s.farmStakes, user);
    assert (old != null && old.staked >= amount) throw 1004;
    val accrued = (old.staked * (s.farmAccRewardPerShare - old.debt)) / DEFI_SCALE;
    s
        .farmStakes
        .set(
            user,
            UserFarmInfo {
                staked: old.staked - amount,
                debt: s.farmAccRewardPerShare,
                pending: old.pending + accrued,
            }.toCell(),
        );
    s.farmTotalStaked -= amount;
}

fun restoreFarmStake(mutate s: QuasarDeFiStorage, user: address, amount: int257) {
    if (amount <= 0) {
        return;
    }
    updateFarm(mutate s);
    val old = farmInfoOf(s.farmStakes, user);
    if (old == null) {
        s
            .farmStakes
            .set(
                user,
                UserFarmInfo {
                    staked: amount,
                    debt: s.farmAccRewardPerShare,
                    pending: 0,
                }.toCell(),
            );
    } else {
        val accrued = (old.staked * (s.farmAccRewardPerShare - old.debt)) / DEFI_SCALE;
        s
            .farmStakes
            .set(
                user,
                UserFarmInfo {
                    staked: old.staked + amount,
                    debt: s.farmAccRewardPerShare,
                    pending: old.pending + accrued,
                }.toCell(),
            );
    }
    s.farmTotalStaked += amount;
}

fun sendTonPayout(to: address, amount: coins, id: uint64) {
    val tonPayoutMessage = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: to,
        value: amount,
        body: TonPayout {
            queryId: id,
            amount,
        },
    });
    tonPayoutMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
}

fun sendQsrPayout(
    mutate s: QuasarDeFiStorage,
    to: address,
    amount: coins,
    kind: int257,
    id: uint64,
) {
    assert (amount > 0) throw 1005;
    s
        .pendingPayouts
        .set(
            id as int257,
            PendingPayout {
                amount: amount as int257,
                kind,
                beneficiary: to,
            }.toCell(),
        );
    s.save();
    val wallet = quasarWalletDeployment(
        contract.getAddress(),
        s.qsrMaster,
        quasarWalletCompiledCode(),
    );
    val qsrPayoutMessage = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: wallet,
        value: 20000000,
        body: PoolPayout {
            queryId: id,
            amount,
            destination: to,
            responseDestination: contract.getAddress(),
        },
    });
    qsrPayoutMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
}

fun failQsrPayout(
    mutate s: QuasarDeFiStorage,
    id: uint64,
    amount: coins,
    beneficiary: address,
) {
    val payout = payoutOf(s.pendingPayouts, id as int257);
    assert (
        payout != null && payout.amount == amount && payout.beneficiary == beneficiary
    ) throw 1106;
    s.pendingPayouts.delete(id as int257);
    if (payout.kind == 1) {
        s.qsrReserve += amount;
        val removal = tonPayoutOf(s.pendingTonPayouts, id as int257);
        assert (
            removal != null && removal.kind == 1 && !removal.qsrSettled && removal.stage == 0 &&
            removal.qsrAmount == amount &&
            removal.beneficiary == payout.beneficiary &&
            removal.activeAttemptId == id
        ) throw 1107;
        s.tonReserve += removal.tonOut;
        s
            .lpBalances
            .set(
                removal.beneficiary,
                lpBalanceOf(s.lpBalances, removal.beneficiary) + removal.lpAmount,
            );
        s.lpTotalSupply += removal.lpAmount;
        restoreFarmStake(mutate s, removal.beneficiary, removal.rollbackAmount);
        s.pendingTonPayouts.delete(id as int257);
    } else if (payout.kind == 4) {
        val swap = s.pendingQsrSwap;
        assert (
            swap.status == 1 && swap.payoutId == id && swap.destination == payout.beneficiary &&
            swap.qsrOut == amount
        ) throw 1108;
        s.qsrReserve += amount;
        s.feeAccumulatedQsr -= swap.feeQsr;
        s.pendingQsrSwap.status = 2;
        s.pendingQsrSwap.payoutId = 0;
    } else if (payout.kind == 2) {
        s.farmRewardReserve += amount;
        val farmer = farmInfoOf(s.farmStakes, payout.beneficiary);
        if (farmer != null) {
            s
                .farmStakes
                .set(
                    payout.beneficiary,
                    UserFarmInfo {
                        staked: farmer.staked,
                        debt: farmer.debt,
                        pending: farmer.pending + amount,
                    }.toCell(),
                );
        }
    } else if (payout.kind == 3) {
        val old = pendingInt(s.pendingQsrDeposits, payout.beneficiary);
        var refunded: int257 = amount as int257;
        if (old != null) {
            refunded += old;
        }
        s.pendingQsrDeposits.set(payout.beneficiary, refunded);
        s.pendingQsrDepositsAt.set(payout.beneficiary, blockchain.now());
    } else {
        assert (false) throw 1108;
    }
}

fun emitLiquidityAdded(provider: address, tonAmount: int257, qsrAmount: int257, lpMinted: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventLiquidityAdded { provider, tonAmount, qsrAmount, lpMinted },
    });
    event.send(SEND_MODE_IGNORE_ERRORS);
}

fun emitLiquidityRemoved(provider: address, tonOut: int257, qsrOut: int257, lpBurned: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventLiquidityRemoved { provider, tonOut, qsrOut, lpBurned },
    });
    event.send(SEND_MODE_IGNORE_ERRORS);
}

fun emitSwap(
    trader: address,
    tonIn: int257,
    qsrIn: int257,
    tonOut: int257,
    qsrOut: int257,
    fee: int257,
) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventSwap { trader, tonIn, qsrIn, tonOut, qsrOut, fee },
    });
    event.send(SEND_MODE_IGNORE_ERRORS);
}

fun emitFarmReward(farmer: address, amount: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventFarmReward { farmer, amount },
    });
    event.send(SEND_MODE_IGNORE_ERRORS);
}

fun emitUnknownBuybackBounce(queryId: uint64) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventBuybackBounceUnknown { queryId },
    });
    event.send(SEND_MODE_IGNORE_ERRORS);
}

fun executeBuybackSwap(mutate s: QuasarDeFiStorage, qsrIn: coins, queryId: uint64) {
    requireNoPendingQsrSwap(s);
    assert (qsrIn > 0) throw 1010;
    assert (s.tonReserve > 0) throw 1011;
    val qsrBefore = s.qsrReserve - qsrIn;
    assert (qsrBefore > 0) throw 1012;
    assert (qsrIn * 10000 <= qsrBefore * s.maxTradeBps) throw 1013;
    val grossTonOut = (qsrIn * s.tonReserve) / s.qsrReserve;
    // Fees apply to the integer gross payout so the executed amount and quote
    // use the same floor-first rounding policy.
    // check-disable-next-line divide-before-multiply
    val fee = (grossTonOut * s.feeBps) / 10000;
    val tonOut = grossTonOut - fee;
    assert (tonOut > 0 && tonOut < s.tonReserve) throw 1014;
    s.tonReserve -= tonOut;
    s.feeAccumulatedTon += fee;

    // Keep the prior tombstone: the Master callback has no success response,
    // and a late bounce of the previous BuybackTon must still be recoverable.
    s.prevBuybackActive = s.pendingBuybackActive;
    s.prevBuybackQueryId = s.pendingBuybackQueryId;
    s.prevBuybackTonOut = s.pendingBuybackTonOut;
    s.prevBuybackFee = s.pendingBuybackFee;
    s.pendingBuybackActive = true;
    s.pendingBuybackQueryId = queryId;
    s.pendingBuybackTonOut = tonOut;
    s.pendingBuybackFee = fee;
    s.save();

    val buybackMessage = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: s.qsrMaster,
        value: tonOut,
        body: BuybackTon {
            queryId,
            tonAmount: tonOut,
            qsrSwapped: qsrIn,
        },
    });
    buybackMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
}

fun processDeferredBuyback(mutate s: QuasarDeFiStorage) {
    if (!s.deferredBuyback.active || s.pendingQsrSwap.status != 0) {
        return;
    }
    val amount = s.deferredBuyback.qsrAmount;
    val queryId = s.deferredBuyback.queryId;
    if (amount <= 0 || s.qsrReserve <= amount || s.tonReserve <= 0) {
        return;
    }
    if (amount * 10000 > (s.qsrReserve - amount) * s.maxTradeBps) {
        return;
    }
    val grossTonOut = (amount * s.tonReserve) / s.qsrReserve;
    // The executed buyback uses the integer gross output as its fee base.
    // check-disable-next-line divide-before-multiply
    val fee = (grossTonOut * s.feeBps) / 10000;
    if (grossTonOut <= fee || grossTonOut - fee <= 0) {
        return;
    }
    s.deferredBuyback.active = false;
    s.deferredBuyback.queryId = 0;
    s.deferredBuyback.qsrAmount = 0;
    s.qsrReserve += amount;
    executeBuybackSwap(mutate s, amount, queryId);
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessageToQuasarDeFi.fromSlice(in.body);
    match (msg) {
        TokenNotification => {
            var s = QuasarDeFiStorage.load();
            assert (
                in.senderAddress ==
                quasarWalletAddress(contract.getAddress(), s.qsrMaster, quasarWalletCompiledCode())
            ) throw 1100;
            assert (msg.amount > 0) throw 1101;
            assert (!isZeroAddress(msg.from)) throw 1102;
            if (msg.from == s.qsrMaster) {
                val isBuyback = msg.forwardPayload.remainingBitsCount() >= 32 &&
                    msg.forwardPayload.preloadUint(32) == QSR_BUYBACK_MARKER;
                if (isBuyback && s.pendingQsrSwap.status != 0) {
                    if (s.deferredBuyback.active) {
                        assert (
                            s.deferredBuyback.queryId == msg.queryId &&
                            s.deferredBuyback.qsrAmount == msg.amount
                        ) throw 1240;
                    }
                    s.deferredBuyback.active = true;
                    s.deferredBuyback.queryId = msg.queryId;
                    s.deferredBuyback.qsrAmount = msg.amount;
                    s.save();
                } else {
                    s.qsrReserve += msg.amount;
                    if (isBuyback) {
                        executeBuybackSwap(mutate s, msg.amount, msg.queryId);
                    } else {
                        s.save();
                    }
                }
            } else {
                val current = pendingInt(s.pendingQsrDeposits, msg.from);
                var credited: int257 = msg.amount as int257;
                if (current != null) {
                    credited += current;
                }
                s.pendingQsrDeposits.set(msg.from, credited);
                s.pendingQsrDepositsAt.set(msg.from, blockchain.now());
                s.save();
            }
        }

        TokenExcesses => {
            var s = QuasarDeFiStorage.load();
            val payoutMarker: uint64 = QUASAR_POOL_PAYOUT_MARKER as uint64;
            val id: uint64 = msg.queryId >= payoutMarker ? msg.queryId - payoutMarker : msg.queryId;
            val payout = payoutOf(s.pendingPayouts, id as int257);
            if (payout == null) {
                return;
            }
            assert (
                in.senderAddress ==
                quasarWalletAddress(payout.beneficiary, s.qsrMaster, quasarWalletCompiledCode())
            ) throw 1103;
            s.pendingPayouts.delete(id as int257);
            if (payout.kind == 1) {
                val remove = tonPayoutOf(s.pendingTonPayouts, id as int257);
                assert (
                    remove != null && remove.kind == 1 && !remove.qsrSettled && remove.stage == 0 &&
                    remove.activeAttemptId == id &&
                    remove.beneficiary == payout.beneficiary &&
                    remove.qsrAmount == payout.amount
                ) throw 1104;
                if (remove.tonOut > 0) {
                    s
                        .pendingTonPayouts
                        .set(
                            id as int257,
                            PendingTonPayout {
                                kind: remove.kind,
                                beneficiary: remove.beneficiary,
                                tonOut: remove.tonOut,
                                qsrAmount: remove.qsrAmount,
                                lpAmount: remove.lpAmount,
                                qsrSettled: true,
                                rollbackAmount: remove.rollbackAmount,
                                claimId: remove.claimId,
                                activeAttemptId: id,
                                stage: 0,
                            }.toWireCell(),
                        );
                    s.save();
                    sendTonPayout(remove.beneficiary, remove.tonOut as coins, id);
                } else {
                    s.pendingTonPayouts.delete(id as int257);
                    s.save();
                }
            } else if (payout.kind == 4) {
                val swap = s.pendingQsrSwap;
                assert (
                    swap.status == 1 && swap.payoutId == id &&
                    swap.destination == payout.beneficiary &&
                    swap.qsrOut == payout.amount
                ) throw 1109;
                s.pendingQsrSwap.status = 0;
                s.pendingQsrSwap.swapId = 0;
                s.pendingQsrSwap.payoutId = 0;
                s.pendingQsrSwap.beneficiary = s.owner;
                s.pendingQsrSwap.destination = s.owner;
                s.pendingQsrSwap.tonIn = 0;
                s.pendingQsrSwap.qsrOut = 0;
                s.pendingQsrSwap.feeQsr = 0;
                processDeferredBuyback(mutate s);
                s.save();
            } else {
                s.save();
            }
        }

        PayoutFailed => {
            var s = QuasarDeFiStorage.load();
            assert (
                in.senderAddress ==
                quasarWalletAddress(contract.getAddress(), s.qsrMaster, quasarWalletCompiledCode())
            ) throw 1105;
            failQsrPayout(mutate s, msg.queryId, msg.amount, msg.destination);
            s.save();
        }

        RefundPendingQsr => {
            var s = QuasarDeFiStorage.load();
            val pending = pendingInt(s.pendingQsrDeposits, in.senderAddress);
            assert (pending != null && pending > 0) throw 1110;
            lock(mutate s);
            s.pendingQsrDeposits.set(in.senderAddress, 0);
            s.pendingQsrDepositsAt.set(in.senderAddress, 0);
            val id = nextPayoutId(mutate s);
            unlock(mutate s);
            sendQsrPayout(mutate s, in.senderAddress, pending as coins, 3, id);
        }

        RetrySwapQsr => {
            var s = QuasarDeFiStorage.load();
            val swap = s.pendingQsrSwap;
            assert (
                swap.status == 2 && swap.swapId == msg.swapId &&
                swap.beneficiary == in.senderAddress
            ) throw 1244;
            assert (!isZeroAddress(msg.destination) && swap.qsrOut > 0) throw 1245;
            lock(mutate s);
            val id = nextPayoutId(mutate s);
            s.qsrReserve -= swap.qsrOut;
            s.feeAccumulatedQsr += swap.feeQsr;
            s.pendingQsrSwap.status = 1;
            s.pendingQsrSwap.payoutId = id;
            s.pendingQsrSwap.destination = msg.destination;
            unlock(mutate s);
            s.save();
            sendQsrPayout(mutate s, msg.destination, swap.qsrOut, 4, id);
        }

        ClaimSwapTonRefund => {
            var s = QuasarDeFiStorage.load();
            val swap = s.pendingQsrSwap;
            assert (
                swap.status == 2 && swap.swapId == msg.swapId &&
                swap.beneficiary == in.senderAddress
            ) throw 1246;
            assert (swap.tonIn > 0 && s.tonReserve >= swap.tonIn) throw 1247;
            assert (tonPayoutOf(s.pendingTonPayouts, msg.swapId as int257) == null) throw 1248;
            assert (in.valueCoins >= TON_CLAIM_CALL_MIN_VALUE) throw 1249;
            assert (
                contract.getOriginalBalance() + in.valueCoins >=
                s.tonReserve + QUASAR_STORAGE_RESERVE + TON_CLAIM_FEE_RESERVE
            ) throw 1250;
            lock(mutate s);
            s.tonReserve -= swap.tonIn;
            s
                .pendingTonPayouts
                .set(
                    msg.swapId as int257,
                    PendingTonPayout {
                        kind: 3,
                        beneficiary: in.senderAddress,
                        tonOut: swap.tonIn as int257,
                        qsrAmount: 0,
                        lpAmount: 0,
                        qsrSettled: true,
                        rollbackAmount: 0,
                        claimId: msg.swapId,
                        activeAttemptId: msg.swapId,
                        stage: 0,
                    }.toWireCell(),
                );
            s.pendingQsrSwap.status = 0;
            s.pendingQsrSwap.swapId = 0;
            s.pendingQsrSwap.payoutId = 0;
            s.pendingQsrSwap.beneficiary = s.owner;
            s.pendingQsrSwap.destination = s.owner;
            s.pendingQsrSwap.tonIn = 0;
            s.pendingQsrSwap.qsrOut = 0;
            s.pendingQsrSwap.feeQsr = 0;
            unlock(mutate s);
            processDeferredBuyback(mutate s);
            s.save();
            sendTonPayout(in.senderAddress, swap.tonIn, msg.swapId);
        }

        ClaimTonPayout => {
            var s = QuasarDeFiStorage.load();
            val claim = tonPayoutOf(s.pendingTonPayouts, msg.claimId as int257);
            assert (
                claim != null && claim.stage == 1 && claim.activeAttemptId == 0 &&
                claim.claimId == msg.claimId &&
                claim.beneficiary == in.senderAddress
            ) throw 1251;
            assert (!isZeroAddress(msg.destination) && claim.tonOut > 0) throw 1252;
            assert (s.tonClaimsHeld >= claim.tonOut) throw 1253;
            assert (in.valueCoins >= TON_CLAIM_CALL_MIN_VALUE) throw 1254;
            assert (
                contract.getOriginalBalance() + in.valueCoins >=
                s.tonReserve + s.tonClaimsHeld + QUASAR_STORAGE_RESERVE + TON_CLAIM_FEE_RESERVE
            ) throw 1255;
            lock(mutate s);
            // Stable claim IDs remain keyed by msg.claimId; only the outbound
            // retry attempt uses the dedicated high-bit TON namespace.
            val id = nextTonPayoutId(mutate s);
            s
                .pendingTonPayouts
                .set(
                    msg.claimId as int257,
                    PendingTonPayout {
                        kind: claim.kind,
                        beneficiary: claim.beneficiary,
                        tonOut: claim.tonOut,
                        qsrAmount: claim.qsrAmount,
                        lpAmount: claim.lpAmount,
                        qsrSettled: claim.qsrSettled,
                        rollbackAmount: claim.rollbackAmount,
                        claimId: claim.claimId,
                        activeAttemptId: id,
                        stage: 2,
                    }.toWireCell(),
                );
            s
                .pendingTonPayouts
                .set(
                    id as int257,
                    PendingTonPayout {
                        kind: 4,
                        beneficiary: msg.destination,
                        tonOut: claim.tonOut,
                        qsrAmount: 0,
                        lpAmount: 0,
                        qsrSettled: true,
                        rollbackAmount: 0,
                        claimId: msg.claimId,
                        activeAttemptId: id,
                        stage: 0,
                    }.toWireCell(),
                );
            s.tonClaimsHeld -= claim.tonOut;
            unlock(mutate s);
            s.save();
            sendTonPayout(msg.destination, claim.tonOut as coins, id);
        }

        AddLiquidity => {
            var s = QuasarDeFiStorage.load();
            requireActive(s);
            requireNoPendingQsrSwap(s);
            lock(mutate s);
            requireDeadline(msg.deadline);
            assert (msg.tonAmount > 0 && msg.qsrAmount > 0) throw 1120;
            assert (in.valueCoins >= msg.tonAmount) throw 1121;
            val deposit = pendingInt(s.pendingQsrDeposits, in.senderAddress);
            assert (deposit != null && deposit >= msg.qsrAmount) throw 1122;
            if (s.lpTotalSupply > 0) {
                assert (msg.tonAmount * 10000 <= s.tonReserve * s.maxTradeBps) throw 1123;
                assert (msg.qsrAmount * 10000 <= s.qsrReserve * s.maxTradeBps) throw 1124;
            }
            var lpMinted: int257 = 0;
            var tonUsed: coins = msg.tonAmount;
            var qsrUsed: coins = msg.qsrAmount;
            if (s.lpTotalSupply == 0) {
                val root = integerSqrt(msg.tonAmount * msg.qsrAmount);
                assert (root > s.minimumLiquidity) throw 1125;
                lpMinted = root - s.minimumLiquidity;
            } else {
                lpMinted = minimum(
                    (msg.tonAmount * s.lpTotalSupply) / s.tonReserve,
                    (msg.qsrAmount * s.lpTotalSupply) / s.qsrReserve,
                );
                tonUsed = (lpMinted * s.tonReserve) / s.lpTotalSupply;
                qsrUsed = (lpMinted * s.qsrReserve) / s.lpTotalSupply;
            }
            assert (lpMinted > 0) throw 1126;
            assert (lpMinted >= msg.minLpOut) throw 1127;
            recordPriceObservation(mutate s);
            s.tonReserve += tonUsed;
            s.qsrReserve += qsrUsed;
            if (s.lpTotalSupply == 0) {
                s.lpTotalSupply = s.minimumLiquidity;
            }
            s.lpTotalSupply += lpMinted;
            s.pendingQsrDeposits.set(in.senderAddress, deposit - qsrUsed);
            s
                .lpBalances
                .set(in.senderAddress, lpBalanceOf(s.lpBalances, in.senderAddress) + lpMinted);
            updateFarm(mutate s);
            if (s.farmEnabled) {
                stakeLp(mutate s, in.senderAddress, lpMinted);
            }
            unlock(mutate s);
            val refund = in.valueCoins - tonUsed;
            s.save();
            if (refund > 0) {
                val refundMessage = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: refund,
                });
                refundMessage.send(SEND_MODE_PAY_FEES_SEPARATELY);
            }
            emitLiquidityAdded(in.senderAddress, tonUsed as int257, qsrUsed as int257, lpMinted);
        }

        RemoveLiquidity => {
            var s = QuasarDeFiStorage.load();
            requireNoPendingQsrSwap(s);
            lock(mutate s);
            requireDeadline(msg.deadline);
            val current = lpBalanceOf(s.lpBalances, in.senderAddress);
            assert (msg.lpAmount > 0 && current >= msg.lpAmount) throw 1130;
            val tonOut = (msg.lpAmount * s.tonReserve) / s.lpTotalSupply;
            val qsrOut = (msg.lpAmount * s.qsrReserve) / s.lpTotalSupply;
            assert (tonOut > 0 || qsrOut > 0) throw 1131;
            assert (tonOut >= msg.minTonOut && qsrOut >= msg.minQsrOut) throw 1132;
            updateFarm(mutate s);
            var farmAmount: int257 = 0;
            val farmStake = farmInfoOf(s.farmStakes, in.senderAddress);
            if (farmStake != null && farmStake.staked > 0) {
                farmAmount = minimum(msg.lpAmount as int257, farmStake.staked);
                if (farmAmount > 0) {
                    unstakeLp(mutate s, in.senderAddress, farmAmount);
                }
            }
            recordPriceObservation(mutate s);
            s.lpBalances.set(in.senderAddress, current - msg.lpAmount);
            s.lpTotalSupply -= msg.lpAmount;
            s.tonReserve -= tonOut;
            s.qsrReserve -= qsrOut;
            val id = nextPayoutId(mutate s);
            s
                .pendingTonPayouts
                .set(
                    id as int257,
                    PendingTonPayout {
                        kind: 1,
                        beneficiary: in.senderAddress,
                        tonOut,
                        qsrAmount: qsrOut,
                        lpAmount: msg.lpAmount as int257,
                        qsrSettled: false,
                        rollbackAmount: farmAmount,
                        claimId: id,
                        activeAttemptId: id,
                        stage: 0,
                    }.toWireCell(),
                );
            unlock(mutate s);
            s.save();
            if (qsrOut > 0) {
                sendQsrPayout(mutate s, in.senderAddress, qsrOut, 1, id);
            } else if (tonOut > 0) {
                sendTonPayout(in.senderAddress, tonOut, id);
            }
            emitLiquidityRemoved(in.senderAddress, tonOut, qsrOut, msg.lpAmount as int257);
        }

        SwapToTon => {
            var s = QuasarDeFiStorage.load();
            requireActive(s);
            requireNoPendingQsrSwap(s);
            lock(mutate s);
            requireDeadline(msg.deadline);
            assert (msg.qsrAmount > 0 && s.qsrReserve > 0) throw 1140;
            assert (msg.qsrAmount * 10000 <= s.qsrReserve * s.maxTradeBps) throw 1141;
            val deposit = pendingInt(s.pendingQsrDeposits, in.senderAddress);
            assert (deposit != null && deposit >= msg.qsrAmount) throw 1142;
            val grossTonOut = (msg.qsrAmount * s.tonReserve) / (s.qsrReserve + msg.qsrAmount);
            // check-disable-next-line divide-before-multiply
            val fee = (grossTonOut * s.feeBps) / 10000;
            val tonOut = grossTonOut - fee;
            assert (tonOut >= msg.minTonOut) throw 1143;
            assert (tonOut > 0 && tonOut < s.tonReserve) throw 1144;
            recordPriceObservation(mutate s);
            s.qsrReserve += msg.qsrAmount;
            s.tonReserve -= tonOut;
            s.feeAccumulatedTon += fee;
            s.pendingQsrDeposits.set(in.senderAddress, deposit - msg.qsrAmount);
            val id = nextPayoutId(mutate s);
            s
                .pendingTonPayouts
                .set(
                    id as int257,
                    PendingTonPayout {
                        kind: 2,
                        beneficiary: in.senderAddress,
                        tonOut,
                        qsrAmount: msg.qsrAmount as int257,
                        lpAmount: 0,
                        qsrSettled: false,
                        rollbackAmount: fee as int257,
                        claimId: id,
                        activeAttemptId: id,
                        stage: 0,
                    }.toWireCell(),
                );
            unlock(mutate s);
            s.save();
            sendTonPayout(in.senderAddress, tonOut, id);
            emitSwap(
                in.senderAddress,
                0,
                msg.qsrAmount as int257,
                tonOut as int257,
                0,
                fee as int257,
            );
        }

        SwapToQsr => {
            var s = QuasarDeFiStorage.load();
            requireActive(s);
            requireNoPendingQsrSwap(s);
            lock(mutate s);
            requireDeadline(msg.deadline);
            assert (msg.tonAmount > 0 && s.tonReserve > 0) throw 1150;
            assert (in.valueCoins >= msg.tonAmount) throw 1151;
            assert (msg.tonAmount * 10000 <= s.tonReserve * s.maxTradeBps) throw 1152;
            val grossQsrOut = (msg.tonAmount * s.qsrReserve) / (s.tonReserve + msg.tonAmount);
            // check-disable-next-line divide-before-multiply
            val fee = (grossQsrOut * s.feeBps) / 10000;
            val qsrOut = grossQsrOut - fee;
            assert (qsrOut >= msg.minQsrOut) throw 1153;
            assert (qsrOut > 0 && qsrOut < s.qsrReserve) throw 1154;
            recordPriceObservation(mutate s);
            s.tonReserve += msg.tonAmount;
            s.qsrReserve -= qsrOut;
            s.feeAccumulatedQsr += fee;
            val id = nextPayoutId(mutate s);
            s.pendingQsrSwap = PendingQsrSwap {
                status: 1,
                swapId: id,
                payoutId: id,
                beneficiary: in.senderAddress,
                destination: in.senderAddress,
                tonIn: msg.tonAmount,
                qsrOut,
                feeQsr: fee,
            };
            unlock(mutate s);
            val excess = in.valueCoins - msg.tonAmount;
            s.save();
            if (excess > 0) {
                val refund = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: excess,
                });
                refund.send(SEND_MODE_PAY_FEES_SEPARATELY);
            }
            sendQsrPayout(mutate s, in.senderAddress, qsrOut, 4, id);
            emitSwap(
                in.senderAddress,
                msg.tonAmount as int257,
                0,
                0,
                qsrOut as int257,
                fee as int257,
            );
        }

        ClaimFarmRewards => {
            var s = QuasarDeFiStorage.load();
            updateFarm(mutate s);
            val existing = farmInfoOf(s.farmStakes, in.senderAddress);
            assert (existing != null) throw 1160;
            val accrued = (existing.staked * (s.farmAccRewardPerShare - existing.debt)) /
                DEFI_SCALE;
            val reward = existing.pending + accrued;
            assert (reward > 0) throw 1161;
            s
                .farmStakes
                .set(
                    in.senderAddress,
                    UserFarmInfo {
                        staked: existing.staked,
                        debt: s.farmAccRewardPerShare,
                        pending: 0,
                    }.toCell(),
                );
            val id = nextPayoutId(mutate s);
            s.save();
            sendQsrPayout(mutate s, in.senderAddress, reward, 2, id);
            emitFarmReward(in.senderAddress, reward);
        }

        EmergencyWithdrawFarm => {
            var s = QuasarDeFiStorage.load();
            lock(mutate s);
            val existing = farmInfoOf(s.farmStakes, in.senderAddress);
            assert (existing != null && existing.staked > 0) throw 1170;
            updateFarm(mutate s);
            val amount = existing.staked;
            s
                .farmStakes
                .set(
                    in.senderAddress,
                    UserFarmInfo {
                        staked: 0,
                        debt: s.farmAccRewardPerShare,
                        pending: 0,
                    }.toCell(),
                );
            s.farmTotalStaked -= amount;
            unlock(mutate s);
            s.save();
        }

        ProposePoolOwner => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1180;
            assert (!isZeroAddress(msg.newOwner)) throw 1181;
            s.pendingOwner = msg.newOwner;
            s.ownerTransferAt = (blockchain.now() + s.ownerTransferDelay) as uint32;
            s.save();
        }
        CancelPoolOwner => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1182;
            s.pendingOwner = ZERO_ADDRESS;
            s.ownerTransferAt = 0;
            s.save();
        }
        AcceptPoolOwner => {
            var s = QuasarDeFiStorage.load();
            assert (
                s.pendingOwner != ZERO_ADDRESS && in.senderAddress == s.pendingOwner
            ) throw 1183;
            assert (blockchain.now() >= s.ownerTransferAt) throw 1184;
            s.owner = s.pendingOwner;
            s.pendingOwner = ZERO_ADDRESS;
            s.ownerTransferAt = 0;
            s.save();
        }
        SetFarmConfig => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1190;
            assert (
                msg.rewardPerSecond > 0 && msg.endTime > msg.startTime &&
                msg.endTime >= blockchain.now()
            ) throw 1191;
            updateFarm(mutate s);
            s.farmRewardPerSecond = msg.rewardPerSecond;
            s.farmStartTime = msg.startTime;
            s.farmEndTime = msg.endTime;
            if (s.farmLastUpdate < msg.startTime) {
                s.farmLastUpdate = msg.startTime as int257;
            }
            s.save();
        }
        SetFarmEnabled => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1192;
            updateFarm(mutate s);
            if (msg.enabled) {
                assert (s.farmRewardReserve > 0) throw 1193;
            }
            s.farmEnabled = msg.enabled;
            s.save();
        }
        FundFarm => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1194;
            assert (msg.amount > 0) throw 1195;
            val pending = pendingInt(s.pendingQsrDeposits, in.senderAddress);
            assert (pending != null && pending >= msg.amount) throw 1196;
            s.pendingQsrDeposits.set(in.senderAddress, pending - msg.amount);
            s.farmRewardReserve += msg.amount;
            s.save();
        }
        SetFeeBps => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1200;
            assert (msg.feeBps > 0 && msg.feeBps <= 30) throw 1201;
            s.pendingFeeBps = msg.feeBps;
            s.pendingFeeAt = (blockchain.now() + s.ownerTransferDelay) as uint32;
            s.save();
        }
        SetPaused => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1202;
            s.paused = msg.paused;
            s.save();
        }
        SetMaxTradeBps => {
            var s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1203;
            assert (msg.maxTradeBps >= 100 && msg.maxTradeBps <= 5000) throw 1204;
            s.pendingMaxTradeBps = msg.maxTradeBps;
            s.pendingMaxTradeAt = (blockchain.now() + s.ownerTransferDelay) as uint32;
            s.save();
        }
        SweepTon => {
            val s = QuasarDeFiStorage.load();
            assert (in.senderAddress == s.owner) throw 1210;
            assert (msg.amount > 0) throw 1211;
            assert (
                contract.getOriginalBalance() + in.valueCoins >=
                s.tonReserve + s.tonClaimsHeld + msg.amount + QUASAR_STORAGE_RESERVE
            ) throw 1212;
            val sweep = createMessage({
                bounce: BounceMode.NoBounce,
                dest: s.owner,
                value: msg.amount,
            });
            sweep.send(SEND_MODE_PAY_FEES_SEPARATELY);
        }
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
            val response = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: 0,
                body,
            });
            response.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS);
        }
        else => {
            // The two legacy Tact text receivers remain supported. Tact text
            // bodies have a zero 32-bit prefix followed by the exact ASCII bytes.
            var body = in.body;
            if (body.remainingBitsCount() >= 32 && body.preloadUint(32) == 0) {
                body.loadUint(32);
                if (
                    body.remainingBitsCount() == 104 &&
                    body.loadUint(104) == 0x4170706c792046656520427073
                ) {
                    var s = QuasarDeFiStorage.load();
                    assert (in.senderAddress == s.owner) throw 1220;
                    assert (s.pendingFeeBps > 0 && blockchain.now() >= s.pendingFeeAt) throw 1221;
                    s.feeBps = s.pendingFeeBps;
                    s.pendingFeeBps = 0;
                    s.pendingFeeAt = 0;
                    s.save();
                    return;
                }
                if (
                    body.remainingBitsCount() == 152 &&
                    body.loadUint(152) == 0x4170706c79204d617820547261646520427073
                ) {
                    var s = QuasarDeFiStorage.load();
                    assert (in.senderAddress == s.owner) throw 1222;
                    assert (
                        s.pendingMaxTradeBps > 0 && blockchain.now() >= s.pendingMaxTradeAt
                    ) throw 1223;
                    s.maxTradeBps = s.pendingMaxTradeBps;
                    s.pendingMaxTradeBps = 0;
                    s.pendingMaxTradeAt = 0;
                    s.save();
                    return;
                }
            }
            throw 130;
        }
    }
}

fun onBouncedMessage(in: InMessageBounced) {
    // Only the first 224 body bits after the bounce prefix are relied on. The
    // callback parser intentionally reads opcode, query ID and one coin field;
    // it never reads BuybackTon.qsrSwapped or any trailing address.
    var body = in.bouncedBody;
    body.skipBouncedPrefix();
    val opcode = body.loadUint(32);
    var s = QuasarDeFiStorage.load();
    if (opcode == 0x746f6e70) {
        val queryId = body.loadUint(64) as uint64;
        val amount = body.loadCoins();
        val p = tonPayoutOf(s.pendingTonPayouts, queryId as int257);
        assert (p != null && in.senderAddress == p.beneficiary) throw 1230;
        if (p.stage != 0) {
            // A repeated protocol bounce must not mint a second claim or alter
            // held-balance accounting. Wrong amount remains a rejected callback.
            assert (amount == p.tonOut) throw 1230;
            return;
        }
        assert (amount == p.tonOut && p.activeAttemptId == queryId) throw 1230;
        if (p.kind == 1) {
            if (p.qsrAmount > 0) {
                assert (p.qsrSettled) throw 1231;
            }
            // LP burn and QSR settlement are final; the bounced TON amount is
            // segregated as a claim instead of mutating reserves after later trades.
            markTonPayoutClaimable(mutate s, queryId, p, in.valueCoins);
        } else if (p.kind == 2 || p.kind == 3) {
            // SwapToTon succeeded economically, or a failed QSR swap is being
            // refunded. In either case only the TON returned by the bounce is owed.
            markTonPayoutClaimable(mutate s, queryId, p, in.valueCoins);
        } else if (p.kind == 4) {
            val claim = tonPayoutOf(s.pendingTonPayouts, p.claimId as int257);
            assert (
                claim != null && claim.stage == 2 && claim.activeAttemptId == queryId &&
                claim.claimId == p.claimId &&
                claim.tonOut == p.tonOut
            ) throw 1232;
            markTonPayoutClaimable(mutate s, p.claimId, claim, in.valueCoins);
            s.pendingTonPayouts.delete(queryId as int257);
        } else {
            assert (false) throw 1233;
        }
        s.save();
        return;
    }
    if (opcode == 0x51a5c3d1) {
        // A bounce of PoolPayout means the pool wallet rejected the command
        // before it could create its own recipient transfer. Only the pool
        // wallet can produce this callback; its short body includes query ID
        // and amount, but not the recipient address.
        val queryId = body.loadUint(64) as uint64;
        val amount = body.loadCoins();
        assert (
            in.senderAddress ==
            quasarWalletAddress(contract.getAddress(), s.qsrMaster, quasarWalletCompiledCode())
        ) throw 1235;
        val payout = payoutOf(s.pendingPayouts, queryId as int257);
        assert (payout != null && payout.amount == amount) throw 1236;
        failQsrPayout(mutate s, queryId, amount, payout.beneficiary);
        s.save();
        return;
    }
    if (opcode == 0x2c7e91a4) {
        assert (in.senderAddress == s.qsrMaster) throw 1234;
        val queryId = body.loadUint(64) as uint64;
        val tonAmount = body.loadCoins();
        if (
            queryId == s.pendingBuybackQueryId && s.pendingBuybackActive &&
            tonAmount == s.pendingBuybackTonOut
        ) {
            s.tonReserve += tonAmount;
            s.feeAccumulatedTon -= s.pendingBuybackFee;
            s.pendingBuybackActive = false;
            s.pendingBuybackQueryId = 0;
            s.pendingBuybackTonOut = 0;
            s.pendingBuybackFee = 0;
            s.save();
        } else if (
            queryId == s.prevBuybackQueryId && s.prevBuybackActive &&
            tonAmount == s.prevBuybackTonOut
        ) {
            s.tonReserve += tonAmount;
            s.feeAccumulatedTon -= s.prevBuybackFee;
            s.prevBuybackActive = false;
            s.prevBuybackQueryId = 0;
            s.prevBuybackTonOut = 0;
            s.prevBuybackFee = 0;
            s.save();
        } else {
            emitUnknownBuybackBounce(queryId);
        }
        return;
    }
    throw 1234;
}

get fun lpBalance(user: address): int {
    return lpBalanceOf(QuasarDeFiStorage.load().lpBalances, user);
}

get fun pendingQsrDeposit(user: address): int {
    val found = pendingInt(QuasarDeFiStorage.load().pendingQsrDeposits, user);
    return found == null ? 0 : found;
}

get fun pendingQsrDepositAt(user: address): int {
    val found = pendingInt(QuasarDeFiStorage.load().pendingQsrDepositsAt, user);
    return found == null ? 0 : found;
}

get fun tonPayoutClaim(claimId: uint64): TonPayoutClaimInfo {
    val claim = tonPayoutOf(QuasarDeFiStorage.load().pendingTonPayouts, claimId as int257);
    if (claim == null) {
        return TonPayoutClaimInfo {
            beneficiary: ZERO_ADDRESS,
            amount: 0,
            status: 0,
            activeAttemptId: 0,
        };
    }
    return TonPayoutClaimInfo {
        beneficiary: claim.beneficiary,
        amount: claim.tonOut,
        status: claim.stage,
        activeAttemptId: claim.activeAttemptId,
    };
}

get fun tonClaimsHeld(): int {
    return QuasarDeFiStorage.load().tonClaimsHeld as int257;
}

get fun poolInfo(): LpInfo {
    val s = QuasarDeFiStorage.load();
    return LpInfo {
        totalSupply: s.lpTotalSupply as int257,
        tonReserve: s.tonReserve as int257,
        qsrReserve: s.qsrReserve as int257,
    };
}

get fun get_reserve_snapshot(): DeFiReserveSnapshot {
    val s = QuasarDeFiStorage.load();
    return DeFiReserveSnapshot {
        lpTotalSupply: s.lpTotalSupply as int257,
        tonReserve: s.tonReserve as int257,
        qsrReserve: s.qsrReserve as int257,
        feeAccumulatedTon: s.feeAccumulatedTon as int257,
        feeAccumulatedQsr: s.feeAccumulatedQsr as int257,
        farmRewardReserve: s.farmRewardReserve as int257,
        farmTotalStaked: s.farmTotalStaked as int257,
    };
}

get fun farmInfo(): FarmInfo {
    val s = QuasarDeFiStorage.load();
    return FarmInfo {
        staked: s.farmTotalStaked as int257,
        rewardPerSecond: s.farmRewardPerSecond as int257,
        lastUpdate: s.farmLastUpdate,
        accRewardPerShare: s.farmAccRewardPerShare,
        startTime: s.farmStartTime as int257,
        endTime: s.farmEndTime as int257,
    };
}

get fun userFarm(user: address): UserFarmInfo {
    val info = farmInfoOf(QuasarDeFiStorage.load().farmStakes, user);
    return info == null
        ? UserFarmInfo {
            staked: 0,
            debt: 0,
            pending: 0,
        }
        : info;
}

get fun estimateSwapToTon(qsrAmount: int): SwapQuote {
    val s = QuasarDeFiStorage.load();
    if (s.qsrReserve == 0 || qsrAmount == 0) {
        return SwapQuote {
            tonIn: 0,
            qsrIn: qsrAmount,
            tonOut: 0,
            qsrOut: 0,
            fee: 0,
            priceImpactBps: 0,
        };
    }
    val gross = (qsrAmount * s.tonReserve) / (s.qsrReserve + qsrAmount);
    // check-disable-next-line divide-before-multiply
    val fee = (gross * s.feeBps) / 10000;
    val impact = minimum((qsrAmount * 10000) / s.qsrReserve, 10000);
    return SwapQuote {
        tonIn: 0,
        qsrIn: qsrAmount,
        tonOut: gross - fee,
        qsrOut: 0,
        fee,
        priceImpactBps: impact,
    };
}

get fun estimateSwapToQsr(tonAmount: int): SwapQuote {
    val s = QuasarDeFiStorage.load();
    if (s.tonReserve == 0 || tonAmount == 0) {
        return SwapQuote {
            tonIn: tonAmount,
            qsrIn: 0,
            tonOut: 0,
            qsrOut: 0,
            fee: 0,
            priceImpactBps: 0,
        };
    }
    val gross = (tonAmount * s.qsrReserve) / (s.tonReserve + tonAmount);
    // check-disable-next-line divide-before-multiply
    val fee = (gross * s.feeBps) / 10000;
    val impact = minimum((tonAmount * 10000) / s.tonReserve, 10000);
    return SwapQuote {
        tonIn: tonAmount,
        qsrIn: 0,
        tonOut: 0,
        qsrOut: gross - fee,
        fee,
        priceImpactBps: impact,
    };
}

get fun estimateLpOut(tonAmount: int, qsrAmount: int): int {
    val s = QuasarDeFiStorage.load();
    if (s.lpTotalSupply == 0) {
        val root = integerSqrt(tonAmount * qsrAmount);
        return root <= s.minimumLiquidity ? 0 : root - s.minimumLiquidity;
    }
    if (s.tonReserve == 0 || s.qsrReserve == 0) {
        return 0;
    }
    return minimum(
        (tonAmount * s.lpTotalSupply) / s.tonReserve,
        (qsrAmount * s.lpTotalSupply) / s.qsrReserve,
    );
}

get fun estimateRemoveLiquidity(lpAmount: int): LpInfo {
    val s = QuasarDeFiStorage.load();
    if (s.lpTotalSupply == 0 || lpAmount == 0) {
        return LpInfo {
            totalSupply: 0,
            tonReserve: 0,
            qsrReserve: 0,
        };
    }
    return LpInfo {
        totalSupply: s.lpTotalSupply as int257,
        tonReserve: ((lpAmount * s.tonReserve) / s.lpTotalSupply) as int257,
        qsrReserve: ((lpAmount * s.qsrReserve) / s.lpTotalSupply) as int257,
    };
}

get fun feeConfig(): int {
    return QuasarDeFiStorage.load().feeBps;
}

get fun feeAccumulatedTon(): int {
    return QuasarDeFiStorage.load().feeAccumulatedTon;
}

get fun feeAccumulatedQsr(): int {
    return QuasarDeFiStorage.load().feeAccumulatedQsr;
}

get fun farmRewardReserve(): int {
    return QuasarDeFiStorage.load().farmRewardReserve;
}

get fun owner(): address {
    return QuasarDeFiStorage.load().owner;
}

get fun qsrMaster(): address {
    return QuasarDeFiStorage.load().qsrMaster;
}

get fun minimumLiquidity(): int {
    return QuasarDeFiStorage.load().minimumLiquidity;
}

get fun priceCumulativeQsrPerTon(): int {
    return QuasarDeFiStorage.load().priceCumulativeQsrPerTon;
}

get fun priceCumulativeTonPerQsr(): int {
    return QuasarDeFiStorage.load().priceCumulativeTonPerQsr;
}

get fun lastPriceObservation(): int {
    return QuasarDeFiStorage.load().lastPriceObservation;
}

get fun pendingFee(): int {
    return QuasarDeFiStorage.load().pendingFeeBps;
}

get fun pendingFeeAt(): int {
    return QuasarDeFiStorage.load().pendingFeeAt;
}

get fun pendingMaxTrade(): int {
    return QuasarDeFiStorage.load().pendingMaxTradeBps;
}

get fun pendingMaxTradeAt(): int {
    return QuasarDeFiStorage.load().pendingMaxTradeAt;
}

get fun pendingOwner(): address {
    return QuasarDeFiStorage.load().pendingOwner;
}

get fun ownerTransferAt(): int {
    return QuasarDeFiStorage.load().ownerTransferAt;
}
