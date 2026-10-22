import "QuasarCommon"
import "@gen/QuasarWallet.code"

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
struct (0x94e82670) SwapToTON {
    qsrAmount: coins
    minTonOut: coins
    deadline: uint32
}
struct (0x6cf24972) SwapToQSR {
    tonAmount: coins
    minQsrOut: coins
    deadline: uint32
}
struct (0x511327f0) ClaimFarmRewards {}
struct (0x66866ad9) EmergencyWithdrawFarm {}
struct (0x6482e5b4) SetFarmEnabled { enabled: bool }
struct (0x27895d7c) FundFarm { amount: coins }
struct (0xe7ceed7e) SetFarmConfig {
    rewardPerSecond: coins
    startTime: uint32
    endTime: uint32
}
struct (0x17000fb2) SetFeeBps { feeBps: uint16 }
struct (0x096819ff) SetPaused { paused: bool }
struct (0xdcff684f) SetMaxTradeBps { maxTradeBps: uint16 }
struct (0x17614302) ProposePoolOwner { newOwner: address }
struct (0x3b837993) AcceptPoolOwner {}
struct (0x42943fa8) CancelPoolOwner {}
struct (0x871208ba) SweepTON { amount: coins }
struct (0x41348115) RefundPendingQsr {}
struct (0x946a98b6) Deploy { queryId: uint64 }
struct (0xaff90f57) DeployOk { queryId: uint64 }

struct (0x746f6e70) TonPayout {
    queryId: uint64
    amount: coins
}
struct (0x2c7e91a4) BuybackTon {
    queryId: uint64
    tonAmount: coins
    qsrSwapped: coins
}

struct (0x1323cbef) EventLiquidityAdded {
    provider: address
    tonAmount: int257
    qsrAmount: int257
    lpMinted: int257
}
struct (0x5b4f24a9) EventLiquidityRemoved {
    provider: address
    tonOut: int257
    qsrOut: int257
    lpBurned: int257
}
struct (0xc02a5493) EventSwap {
    trader: address
    tonIn: int257
    qsrIn: int257
    tonOut: int257
    qsrOut: int257
    fee: int257
}
struct (0xca3de6d5) EventFarmReward { farmer: address; amount: int257 }
struct (0x60d4a4da) EventFeeCollected { amount: int257 }
struct (0xd6ee9362) EventBuybackBounceUnknown { queryId: uint64 }

struct LPInfo {
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
}
struct SwapQuote {
    tonIn: int257
    qsrIn: int257
    tonOut: int257
    qsrOut: int257
    fee: int257
    priceImpactBps: int257
}

// Field order and widths match QuasarDeFi's persistent Tact storage. Map values
// use int257 because Tact's Int dictionary values are signed 257-bit integers.
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
    farmStakes: map<address, UserFarmInfo>
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
    pendingPayouts: map<int257, PendingPayout>
    pendingTonPayouts: map<int257, PendingTonPayout>
    tonPayoutSeq: uint64
    pendingBuybackActive: bool
    pendingBuybackQueryId: uint64
    pendingBuybackTonOut: coins
    pendingBuybackFee: coins
    prevBuybackActive: bool
    prevBuybackQueryId: uint64
    prevBuybackTonOut: coins
    prevBuybackFee: coins
}

fun QuasarDeFiStorage.load(): QuasarDeFiStorage {
    return QuasarDeFiStorage.fromCell(contract.getData())
}
fun QuasarDeFiStorage.save(self) {
    contract.setData(self.toCell())
}

// Constructor-equivalent defaults. The deployment wrapper must serialize this
// value using the owner and QSR master supplied to the Tact init(owner, master).
fun newQuasarDeFiStorage(owner: address, qsrMaster: address): QuasarDeFiStorage {
    val now = blockchain.now()
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
    }
}

type AllowedMessageToQuasarDeFi =
    | AddLiquidity | RemoveLiquidity | SwapToTON | SwapToQSR
    | ClaimFarmRewards | EmergencyWithdrawFarm | SetFarmEnabled | FundFarm
    | SetFarmConfig | SetFeeBps | SetPaused | SetMaxTradeBps
    | ProposePoolOwner | AcceptPoolOwner | CancelPoolOwner | SweepTON
    | RefundPendingQsr | TokenNotification | TokenExcesses | PayoutFailed | Deploy

type DeFiBounceMessage = TonPayout | BuybackTon

contract QuasarDeFi {
    author: "QUASAR"
    version: "2.0.0"
    description: "QUASAR CPMM liquidity pool and yield farm"
    storage: QuasarDeFiStorage
    incomingMessages: AllowedMessageToQuasarDeFi
    emittedEvents: EventLiquidityAdded | EventLiquidityRemoved | EventSwap | EventFarmReward | EventFeeCollected | EventBuybackBounceUnknown
}

const DEFI_SCALE: int257 = 1000000000
const QSR_BUYBACK_MARKER = 0x5f4a3b21
const ZERO_ADDRESS: address = address("0:0000000000000000000000000000000000000000000000000000000000000000")
const DAY_YEAR = 31536000

fun minimum(a: int257, b: int257): int257 {
    return a < b ? a : b
}

fun integerSqrt(value: int257): int257 {
    if (value <= 0) {
        return 0
    }
    var x = value
    var y = (x + 1) / 2
    while (y < x) {
        x = y
        y = (x + value / x) / 2
    }
    return x
}

fun pendingInt(m: map<address, int257>, user: address): int257? {
    val result = m.get(user)
    if (!result.isFound) {
        return null
    }
    return result.loadValue()
}
fun lpBalanceOf(m: map<address, int257>, user: address): int257 {
    val result = m.get(user)
    return result.isFound ? result.loadValue() : 0
}
fun farmInfoOf(m: map<address, UserFarmInfo>, user: address): UserFarmInfo? {
    val result = m.get(user)
    if (!result.isFound) {
        return null
    }
    return result.loadValue()
}
fun payoutOf(m: map<int257, PendingPayout>, id: int257): PendingPayout? {
    val result = m.get(id)
    if (!result.isFound) {
        return null
    }
    return result.loadValue()
}
fun tonPayoutOf(m: map<int257, PendingTonPayout>, id: int257): PendingTonPayout? {
    val result = m.get(id)
    if (!result.isFound) {
        return null
    }
    return result.loadValue()
}

fun lock(mutate s: QuasarDeFiStorage) {
    assert (!s.locked) throw 1001
    s.locked = true
}
fun unlock(mutate s: QuasarDeFiStorage) {
    s.locked = false
}
fun requireActive(s: QuasarDeFiStorage) {
    assert (!s.paused) throw 1002
}
fun requireDeadline(deadline: uint32) {
    assert (deadline > blockchain.now()) throw 1003
}
fun nextPayoutId(mutate s: QuasarDeFiStorage): uint64 {
    s.payoutSeq = (s.payoutSeq + 1) as uint64
    return s.payoutSeq
}
fun nextTonPayoutId(mutate s: QuasarDeFiStorage): uint64 {
    s.tonPayoutSeq = (s.tonPayoutSeq + 1) as uint64
    return s.tonPayoutSeq
}

fun recordPriceObservation(mutate s: QuasarDeFiStorage) {
    val now = blockchain.now()
    if (s.lastPriceObservation == 0 || s.tonReserve == 0 || s.qsrReserve == 0) {
        s.lastPriceObservation = now as uint32
        return
    }
    val elapsed = now - s.lastPriceObservation
    if (elapsed > 0) {
        s.priceCumulativeQsrPerTon += (s.qsrReserve * elapsed) / s.tonReserve
        s.priceCumulativeTonPerQsr += (s.tonReserve * elapsed) / s.qsrReserve
        s.lastPriceObservation = now as uint32
    }
}

fun updateFarm(mutate s: QuasarDeFiStorage) {
    val now = blockchain.now()
    if (now <= s.farmLastUpdate) {
        return
    }
    val end = minimum(now, s.farmEndTime)
    if (end <= s.farmLastUpdate) {
        return
    }
    if (s.farmTotalStaked == 0 || !s.farmEnabled) {
        s.farmLastUpdate = end
        return
    }
    var reward = (end - s.farmLastUpdate) * s.farmRewardPerSecond
    if (reward > s.farmRewardReserve) {
        reward = s.farmRewardReserve
    }
    if (reward > 0) {
        s.farmRewardReserve -= reward
        s.farmAccRewardPerShare += (reward * DEFI_SCALE) / s.farmTotalStaked
    }
    s.farmLastUpdate = end
}

fun stakeLp(mutate s: QuasarDeFiStorage, user: address, amount: int257) {
    val old = farmInfoOf(s.farmStakes, user)
    if (old == null) {
        s.farmStakes.set(user, UserFarmInfo {
            staked: amount,
            debt: s.farmAccRewardPerShare,
            pending: 0,
        })
    } else {
        val accrued = (old!!.staked * (s.farmAccRewardPerShare - old!!.debt)) / DEFI_SCALE
        s.farmStakes.set(user, UserFarmInfo {
            staked: old!!.staked + amount,
            debt: s.farmAccRewardPerShare,
            pending: old!!.pending + accrued,
        })
    }
    s.farmTotalStaked += amount
}

fun unstakeLp(mutate s: QuasarDeFiStorage, user: address, amount: int257) {
    val old = farmInfoOf(s.farmStakes, user)
    assert (old != null && old!!.staked >= amount) throw 1004
    val accrued = (old!!.staked * (s.farmAccRewardPerShare - old!!.debt)) / DEFI_SCALE
    s.farmStakes.set(user, UserFarmInfo {
        staked: old!!.staked - amount,
        debt: s.farmAccRewardPerShare,
        pending: old!!.pending + accrued,
    })
    s.farmTotalStaked -= amount
}

fun sendTonPayout(to: address, amount: coins, id: uint64) {
    val message = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: to,
        value: amount,
        body: TonPayout { queryId: id, amount },
    })
    message.send(SEND_MODE_PAY_FEES_SEPARATELY)
}

fun sendQsrPayout(
    mutate s: QuasarDeFiStorage,
    to: address,
    amount: coins,
    kind: int257,
    id: uint64,
) {
    assert (amount > 0) throw 1005
    s.pendingPayouts.set(id as int257, PendingPayout { amount, kind, beneficiary: to })
    s.save()
    val wallet = quasarWalletDeployment(contract.getAddress(), s.qsrMaster, quasarWalletCompiledCode())
    val message = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: wallet,
        value: 20000000,
        body: PoolPayout {
            queryId: id,
            amount,
            destination: to,
            responseDestination: contract.getAddress(),
        },
    })
    message.send(SEND_MODE_PAY_FEES_SEPARATELY)
}

fun emitLiquidityAdded(provider: address, tonAmount: int257, qsrAmount: int257, lpMinted: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventLiquidityAdded { provider, tonAmount, qsrAmount, lpMinted },
    })
    event.send(SEND_MODE_IGNORE_ERRORS)
}
fun emitLiquidityRemoved(provider: address, tonOut: int257, qsrOut: int257, lpBurned: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventLiquidityRemoved { provider, tonOut, qsrOut, lpBurned },
    })
    event.send(SEND_MODE_IGNORE_ERRORS)
}
fun emitSwap(trader: address, tonIn: int257, qsrIn: int257, tonOut: int257, qsrOut: int257, fee: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventSwap { trader, tonIn, qsrIn, tonOut, qsrOut, fee },
    })
    event.send(SEND_MODE_IGNORE_ERRORS)
}
fun emitFarmReward(farmer: address, amount: int257) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventFarmReward { farmer, amount },
    })
    event.send(SEND_MODE_IGNORE_ERRORS)
}
fun emitUnknownBuybackBounce(queryId: uint64) {
    val event = createExternalLogMessage({
        dest: createAddressNone(),
        body: EventBuybackBounceUnknown { queryId },
    })
    event.send(SEND_MODE_IGNORE_ERRORS)
}

fun executeBuybackSwap(mutate s: QuasarDeFiStorage, qsrIn: coins, queryId: uint64) {
    assert (qsrIn > 0) throw 1010
    assert (s.tonReserve > 0) throw 1011
    val qsrBefore = s.qsrReserve - qsrIn
    assert (qsrBefore > 0) throw 1012
    assert (qsrIn * 10000 <= qsrBefore * s.maxTradeBps) throw 1013
    val grossTonOut = (qsrIn * s.tonReserve) / s.qsrReserve
    val fee = (grossTonOut * s.feeBps) / 10000
    val tonOut = grossTonOut - fee
    assert (tonOut > 0 && tonOut < s.tonReserve) throw 1014
    s.tonReserve -= tonOut
    s.feeAccumulatedTon += fee

    // Keep the prior tombstone: the Master callback has no success response,
    // and a late bounce of the previous BuybackTon must still be recoverable.
    s.prevBuybackActive = s.pendingBuybackActive
    s.prevBuybackQueryId = s.pendingBuybackQueryId
    s.prevBuybackTonOut = s.pendingBuybackTonOut
    s.prevBuybackFee = s.pendingBuybackFee
    s.pendingBuybackActive = true
    s.pendingBuybackQueryId = queryId
    s.pendingBuybackTonOut = tonOut
    s.pendingBuybackFee = fee
    s.save()

    val message = createMessage({
        bounce: BounceMode.Only256BitsOfBody,
        dest: s.qsrMaster,
        value: tonOut,
        body: BuybackTon { queryId, tonAmount: tonOut, qsrSwapped: qsrIn },
    })
    message.send(SEND_MODE_PAY_FEES_SEPARATELY)
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessageToQuasarDeFi.fromSlice(in.body)
    match (msg) {
        TokenNotification => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == quasarWalletAddress(contract.getAddress(), s.qsrMaster, quasarWalletCompiledCode())) throw 1100
            assert (msg.amount > 0) throw 1101
            assert (!isZeroAddress(msg.from)) throw 1102
            if (msg.from == s.qsrMaster) {
                s.qsrReserve += msg.amount
                if (msg.forwardPayload.remainingBitsCount() >= 32 && msg.forwardPayload.preloadUint(32) == QSR_BUYBACK_MARKER) {
                    executeBuybackSwap(mutate s, msg.amount, msg.queryId)
                } else {
                    s.save()
                }
            } else {
                val current = pendingInt(s.pendingQsrDeposits, msg.from)
                s.pendingQsrDeposits.set(msg.from, (current == null ? 0 : current!!) + msg.amount)
                s.pendingQsrDepositsAt.set(msg.from, blockchain.now())
                s.save()
            }
        }

        TokenExcesses => {
            var s = lazy QuasarDeFiStorage.load()
            val id = msg.queryId >= QUASAR_POOL_PAYOUT_MARKER
                ? msg.queryId - QUASAR_POOL_PAYOUT_MARKER
                : msg.queryId
            val payout = payoutOf(s.pendingPayouts, id as int257)
            if (payout == null) {
                return
            }
            assert (in.senderAddress == quasarWalletAddress(payout!!.beneficiary, s.qsrMaster, quasarWalletCompiledCode())) throw 1103
            s.pendingPayouts.delete(id as int257)
            if (payout!!.kind == 1) {
                val remove = tonPayoutOf(s.pendingTonPayouts, id as int257)
                assert (remove != null && remove!!.kind == 1 && !remove!!.qsrSettled) throw 1104
                if (remove!!.tonOut > 0) {
                    s.pendingTonPayouts.set(id as int257, PendingTonPayout {
                        kind: remove!!.kind,
                        beneficiary: remove!!.beneficiary,
                        tonOut: remove!!.tonOut,
                        qsrAmount: remove!!.qsrAmount,
                        lpAmount: remove!!.lpAmount,
                        qsrSettled: true,
                    })
                    s.save()
                    sendTonPayout(remove!!.beneficiary, remove!!.tonOut, id as uint64)
                } else {
                    s.pendingTonPayouts.delete(id as int257)
                    s.save()
                }
            } else {
                s.save()
            }
        }

        PayoutFailed => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == quasarWalletAddress(contract.getAddress(), s.qsrMaster, quasarWalletCompiledCode())) throw 1105
            val payout = payoutOf(s.pendingPayouts, msg.queryId as int257)
            assert (payout != null && payout!!.amount == msg.amount) throw 1106
            s.pendingPayouts.delete(msg.queryId as int257)
            if (payout!!.kind == 1 || payout!!.kind == 4) {
                s.qsrReserve += msg.amount
                if (payout!!.kind == 1) {
                    val removal = tonPayoutOf(s.pendingTonPayouts, msg.queryId as int257)
                    if (removal != null && removal!!.kind == 1) {
                        assert (!removal!!.qsrSettled) throw 1107
                        s.tonReserve += removal!!.tonOut
                        s.lpBalances.set(removal!!.beneficiary,
                            lpBalanceOf(s.lpBalances, removal!!.beneficiary) + removal!!.lpAmount)
                        s.lpTotalSupply += removal!!.lpAmount
                        s.pendingTonPayouts.delete(msg.queryId as int257)
                    }
                }
            } else if (payout!!.kind == 2) {
                s.farmRewardReserve += msg.amount
                val farmer = farmInfoOf(s.farmStakes, payout!!.beneficiary)
                if (farmer != null) {
                    s.farmStakes.set(payout!!.beneficiary, UserFarmInfo {
                        staked: farmer!!.staked,
                        debt: farmer!!.debt,
                        pending: farmer!!.pending + msg.amount,
                    })
                }
            } else if (payout!!.kind == 3) {
                val old = pendingInt(s.pendingQsrDeposits, payout!!.beneficiary)
                s.pendingQsrDeposits.set(payout!!.beneficiary, (old == null ? 0 : old!!) + msg.amount)
                s.pendingQsrDepositsAt.set(payout!!.beneficiary, blockchain.now())
            } else {
                assert (false) throw 1108
            }
            s.save()
        }

        RefundPendingQsr => {
            var s = lazy QuasarDeFiStorage.load()
            val pending = pendingInt(s.pendingQsrDeposits, in.senderAddress)
            assert (pending != null && pending!! > 0) throw 1110
            lock(mutate s)
            s.pendingQsrDeposits.set(in.senderAddress, 0)
            s.pendingQsrDepositsAt.set(in.senderAddress, 0)
            val id = nextPayoutId(mutate s)
            unlock(mutate s)
            sendQsrPayout(mutate s, in.senderAddress, pending!!, 3, id)
        }

        AddLiquidity => {
            var s = lazy QuasarDeFiStorage.load()
            requireActive(s)
            lock(mutate s)
            requireDeadline(msg.deadline)
            assert (msg.tonAmount > 0 && msg.qsrAmount > 0) throw 1120
            assert (in.valueCoins >= msg.tonAmount) throw 1121
            val deposit = pendingInt(s.pendingQsrDeposits, in.senderAddress)
            assert (deposit != null && deposit!! >= msg.qsrAmount) throw 1122
            if (s.lpTotalSupply > 0) {
                assert (msg.tonAmount * 10000 <= s.tonReserve * s.maxTradeBps) throw 1123
                assert (msg.qsrAmount * 10000 <= s.qsrReserve * s.maxTradeBps) throw 1124
            }
            var lpMinted: int257 = 0
            var tonUsed: int257 = msg.tonAmount
            var qsrUsed: int257 = msg.qsrAmount
            if (s.lpTotalSupply == 0) {
                val root = integerSqrt(msg.tonAmount * msg.qsrAmount)
                assert (root > s.minimumLiquidity) throw 1125
                lpMinted = root - s.minimumLiquidity
            } else {
                lpMinted = minimum((msg.tonAmount * s.lpTotalSupply) / s.tonReserve,
                    (msg.qsrAmount * s.lpTotalSupply) / s.qsrReserve)
                tonUsed = (lpMinted * s.tonReserve) / s.lpTotalSupply
                qsrUsed = (lpMinted * s.qsrReserve) / s.lpTotalSupply
            }
            assert (lpMinted > 0) throw 1126
            assert (lpMinted >= msg.minLpOut) throw 1127
            recordPriceObservation(mutate s)
            s.tonReserve += tonUsed
            s.qsrReserve += qsrUsed
            if (s.lpTotalSupply == 0) {
                s.lpTotalSupply = s.minimumLiquidity
            }
            s.lpTotalSupply += lpMinted
            s.pendingQsrDeposits.set(in.senderAddress, deposit!! - qsrUsed)
            s.lpBalances.set(in.senderAddress, lpBalanceOf(s.lpBalances, in.senderAddress) + lpMinted)
            updateFarm(mutate s)
            if (s.farmEnabled) {
                stakeLp(mutate s, in.senderAddress, lpMinted)
            }
            unlock(mutate s)
            val refund = in.valueCoins - tonUsed
            s.save()
            if (refund > 0) {
                val refundMessage = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: refund,
                })
                refundMessage.send(SEND_MODE_PAY_FEES_SEPARATELY)
            }
            emitLiquidityAdded(in.senderAddress, tonUsed, qsrUsed, lpMinted)
        }

        RemoveLiquidity => {
            var s = lazy QuasarDeFiStorage.load()
            lock(mutate s)
            requireDeadline(msg.deadline)
            val current = lpBalanceOf(s.lpBalances, in.senderAddress)
            assert (msg.lpAmount > 0 && current >= msg.lpAmount) throw 1130
            val tonOut = (msg.lpAmount * s.tonReserve) / s.lpTotalSupply
            val qsrOut = (msg.lpAmount * s.qsrReserve) / s.lpTotalSupply
            assert (tonOut > 0 || qsrOut > 0) throw 1131
            assert (tonOut >= msg.minTonOut && qsrOut >= msg.minQsrOut) throw 1132
            updateFarm(mutate s)
            val farmStake = farmInfoOf(s.farmStakes, in.senderAddress)
            if (farmStake != null && farmStake!!.staked > 0) {
                val farmAmount = minimum(msg.lpAmount, farmStake!!.staked)
                if (farmAmount > 0) {
                    unstakeLp(mutate s, in.senderAddress, farmAmount)
                }
            }
            recordPriceObservation(mutate s)
            s.lpBalances.set(in.senderAddress, current - msg.lpAmount)
            s.lpTotalSupply -= msg.lpAmount
            s.tonReserve -= tonOut
            s.qsrReserve -= qsrOut
            val id = nextPayoutId(mutate s)
            s.pendingTonPayouts.set(id as int257, PendingTonPayout {
                kind: 1,
                beneficiary: in.senderAddress,
                tonOut,
                qsrAmount: qsrOut,
                lpAmount: msg.lpAmount,
                qsrSettled: false,
            })
            unlock(mutate s)
            s.save()
            if (qsrOut > 0) {
                sendQsrPayout(mutate s, in.senderAddress, qsrOut, 1, id)
            } else if (tonOut > 0) {
                sendTonPayout(in.senderAddress, tonOut, id)
            }
            emitLiquidityRemoved(in.senderAddress, tonOut, qsrOut, msg.lpAmount)
        }

        SwapToTON => {
            var s = lazy QuasarDeFiStorage.load()
            requireActive(s)
            lock(mutate s)
            requireDeadline(msg.deadline)
            assert (msg.qsrAmount > 0 && s.qsrReserve > 0) throw 1140
            assert (msg.qsrAmount * 10000 <= s.qsrReserve * s.maxTradeBps) throw 1141
            val deposit = pendingInt(s.pendingQsrDeposits, in.senderAddress)
            assert (deposit != null && deposit!! >= msg.qsrAmount) throw 1142
            val grossTonOut = (msg.qsrAmount * s.tonReserve) / (s.qsrReserve + msg.qsrAmount)
            val fee = (grossTonOut * s.feeBps) / 10000
            val tonOut = grossTonOut - fee
            assert (tonOut >= msg.minTonOut) throw 1143
            assert (tonOut > 0 && tonOut < s.tonReserve) throw 1144
            recordPriceObservation(mutate s)
            s.qsrReserve += msg.qsrAmount
            s.tonReserve -= tonOut
            s.feeAccumulatedTon += fee
            s.pendingQsrDeposits.set(in.senderAddress, deposit!! - msg.qsrAmount)
            val id = nextPayoutId(mutate s)
            s.pendingTonPayouts.set(id as int257, PendingTonPayout {
                kind: 2,
                beneficiary: in.senderAddress,
                tonOut,
                qsrAmount: msg.qsrAmount,
                lpAmount: 0,
                qsrSettled: false,
            })
            unlock(mutate s)
            s.save()
            sendTonPayout(in.senderAddress, tonOut, id)
            emitSwap(in.senderAddress, 0, msg.qsrAmount, tonOut, 0, fee)
        }

        SwapToQSR => {
            var s = lazy QuasarDeFiStorage.load()
            requireActive(s)
            lock(mutate s)
            requireDeadline(msg.deadline)
            assert (msg.tonAmount > 0 && s.tonReserve > 0) throw 1150
            assert (in.valueCoins >= msg.tonAmount) throw 1151
            assert (msg.tonAmount * 10000 <= s.tonReserve * s.maxTradeBps) throw 1152
            val grossQsrOut = (msg.tonAmount * s.qsrReserve) / (s.tonReserve + msg.tonAmount)
            val fee = (grossQsrOut * s.feeBps) / 10000
            val qsrOut = grossQsrOut - fee
            assert (qsrOut >= msg.minQsrOut) throw 1153
            assert (qsrOut > 0 && qsrOut < s.qsrReserve) throw 1154
            recordPriceObservation(mutate s)
            s.tonReserve += msg.tonAmount
            s.qsrReserve -= qsrOut
            s.feeAccumulatedQsr += fee
            val id = nextPayoutId(mutate s)
            unlock(mutate s)
            val excess = in.valueCoins - msg.tonAmount
            s.save()
            if (excess > 0) {
                val refund = createMessage({
                    bounce: BounceMode.NoBounce,
                    dest: in.senderAddress,
                    value: excess,
                })
                refund.send(SEND_MODE_PAY_FEES_SEPARATELY)
            }
            sendQsrPayout(mutate s, in.senderAddress, qsrOut, 4, id)
            emitSwap(in.senderAddress, msg.tonAmount, 0, 0, qsrOut, fee)
        }

        ClaimFarmRewards => {
            var s = lazy QuasarDeFiStorage.load()
            updateFarm(mutate s)
            val existing = farmInfoOf(s.farmStakes, in.senderAddress)
            assert (existing != null) throw 1160
            val accrued = (existing!!.staked * (s.farmAccRewardPerShare - existing!!.debt)) / DEFI_SCALE
            val reward = existing!!.pending + accrued
            assert (reward > 0) throw 1161
            s.farmStakes.set(in.senderAddress, UserFarmInfo {
                staked: existing!!.staked,
                debt: s.farmAccRewardPerShare,
                pending: 0,
            })
            val id = nextPayoutId(mutate s)
            s.save()
            sendQsrPayout(mutate s, in.senderAddress, reward, 2, id)
            emitFarmReward(in.senderAddress, reward)
        }

        EmergencyWithdrawFarm => {
            var s = lazy QuasarDeFiStorage.load()
            lock(mutate s)
            val existing = farmInfoOf(s.farmStakes, in.senderAddress)
            assert (existing != null && existing!!.staked > 0) throw 1170
            updateFarm(mutate s)
            val amount = existing!!.staked
            s.farmStakes.set(in.senderAddress, UserFarmInfo {
                staked: 0,
                debt: s.farmAccRewardPerShare,
                pending: 0,
            })
            s.farmTotalStaked -= amount
            unlock(mutate s)
            s.save()
        }

        ProposePoolOwner => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1180
            assert (!isZeroAddress(msg.newOwner)) throw 1181
            s.pendingOwner = msg.newOwner
            s.ownerTransferAt = (blockchain.now() + s.ownerTransferDelay) as uint32
            s.save()
        }
        CancelPoolOwner => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1182
            s.pendingOwner = ZERO_ADDRESS
            s.ownerTransferAt = 0
            s.save()
        }
        AcceptPoolOwner => {
            var s = lazy QuasarDeFiStorage.load()
            assert (s.pendingOwner != ZERO_ADDRESS && in.senderAddress == s.pendingOwner) throw 1183
            assert (blockchain.now() >= s.ownerTransferAt) throw 1184
            s.owner = s.pendingOwner
            s.pendingOwner = ZERO_ADDRESS
            s.ownerTransferAt = 0
            s.save()
        }
        SetFarmConfig => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1190
            assert (msg.rewardPerSecond > 0 && msg.endTime > msg.startTime && msg.endTime >= blockchain.now()) throw 1191
            updateFarm(mutate s)
            s.farmRewardPerSecond = msg.rewardPerSecond
            s.farmStartTime = msg.startTime
            s.farmEndTime = msg.endTime
            if (s.farmLastUpdate < msg.startTime) {
                s.farmLastUpdate = msg.startTime
            }
            s.save()
        }
        SetFarmEnabled => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1192
            updateFarm(mutate s)
            if (msg.enabled) {
                assert (s.farmRewardReserve > 0) throw 1193
            }
            s.farmEnabled = msg.enabled
            s.save()
        }
        FundFarm => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1194
            assert (msg.amount > 0) throw 1195
            val pending = pendingInt(s.pendingQsrDeposits, in.senderAddress)
            assert (pending != null && pending!! >= msg.amount) throw 1196
            s.pendingQsrDeposits.set(in.senderAddress, pending!! - msg.amount)
            s.farmRewardReserve += msg.amount
            s.save()
        }
        SetFeeBps => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1200
            assert (msg.feeBps > 0 && msg.feeBps <= 30) throw 1201
            s.pendingFeeBps = msg.feeBps
            s.pendingFeeAt = (blockchain.now() + s.ownerTransferDelay) as uint32
            s.save()
        }
        SetPaused => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1202
            s.paused = msg.paused
            s.save()
        }
        SetMaxTradeBps => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1203
            assert (msg.maxTradeBps >= 100 && msg.maxTradeBps <= 5000) throw 1204
            s.pendingMaxTradeBps = msg.maxTradeBps
            s.pendingMaxTradeAt = (blockchain.now() + s.ownerTransferDelay) as uint32
            s.save()
        }
        SweepTON => {
            var s = lazy QuasarDeFiStorage.load()
            assert (in.senderAddress == s.owner) throw 1210
            assert (msg.amount > 0) throw 1211
            assert (contract.getOriginalBalance() + in.valueCoins >= s.tonReserve + msg.amount + QUASAR_STORAGE_RESERVE) throw 1212
            val sweep = createMessage({
                bounce: BounceMode.NoBounce,
                dest: s.owner,
                value: msg.amount,
            })
            sweep.send(SEND_MODE_PAY_FEES_SEPARATELY)
        }
        Deploy => {
            val response = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: 0,
                body: DeployOk { queryId: msg.queryId },
            })
            response.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS)
        }
        else => {
            // The two legacy Tact text receivers remain supported. Tact text
            // bodies have a zero 32-bit prefix followed by the exact ASCII bytes.
            var body = in.body
            if (body.remainingBitsCount() >= 32 && body.preloadUint(32) == 0) {
                body.loadUint(32)
                if (body.remainingBitsCount() == 104 && body.loadUint(104) == 0x4170706c792046656520427073) {
                    var s = lazy QuasarDeFiStorage.load()
                    assert (in.senderAddress == s.owner) throw 1220
                    assert (s.pendingFeeBps > 0 && blockchain.now() >= s.pendingFeeAt) throw 1221
                    s.feeBps = s.pendingFeeBps
                    s.pendingFeeBps = 0
                    s.pendingFeeAt = 0
                    s.save()
                    return
                }
                if (body.remainingBitsCount() == 152 && body.loadUint(152) == 0x4170706c79204d617820547261646520427073) {
                    var s = lazy QuasarDeFiStorage.load()
                    assert (in.senderAddress == s.owner) throw 1222
                    assert (s.pendingMaxTradeBps > 0 && blockchain.now() >= s.pendingMaxTradeAt) throw 1223
                    s.maxTradeBps = s.pendingMaxTradeBps
                    s.pendingMaxTradeBps = 0
                    s.pendingMaxTradeAt = 0
                    s.save()
                    return
                }
            }
            throw 130
        }
    }
}

fun onBouncedMessage(in: InMessageBounced) {
    // Only the first 224 body bits after the bounce prefix are relied on. The
    // callback parser intentionally reads opcode, query ID and one coin field;
    // it never reads BuybackTon.qsrSwapped or any trailing address.
    var body = in.bouncedBody
    body.skipBouncedPrefix()
    val opcode = body.loadUint(32)
    var s = lazy QuasarDeFiStorage.load()
    if (opcode == 0x746f6e70) {
        val queryId = body.loadUint(64) as uint64
        val amount = body.loadCoins()
        val p = tonPayoutOf(s.pendingTonPayouts, queryId as int257)
        assert (p != null && in.senderAddress == p!!.beneficiary && amount == p!!.tonOut) throw 1230
        s.pendingTonPayouts.delete(queryId as int257)
        s.tonReserve += p!!.tonOut
        if (p!!.kind == 1) {
            if (p!!.qsrAmount == 0) {
                s.lpBalances.set(p!!.beneficiary, lpBalanceOf(s.lpBalances, p!!.beneficiary) + p!!.lpAmount)
                s.lpTotalSupply += p!!.lpAmount
            } else {
                assert (p!!.qsrSettled) throw 1231
                // QSR already settled. Only the TON reserve is restored.
            }
        } else if (p!!.kind == 2) {
            s.qsrReserve -= p!!.qsrAmount
            val deposit = pendingInt(s.pendingQsrDeposits, p!!.beneficiary)
            s.pendingQsrDeposits.set(p!!.beneficiary, (deposit == null ? 0 : deposit!!) + p!!.qsrAmount)
            s.pendingQsrDepositsAt.set(p!!.beneficiary, blockchain.now())
        } else {
            assert (false) throw 1232
        }
        s.save()
        return
    }
    if (opcode == 0x2c7e91a4) {
        assert (in.senderAddress == s.qsrMaster) throw 1233
        val queryId = body.loadUint(64) as uint64
        val tonAmount = body.loadCoins()
        if (queryId == s.pendingBuybackQueryId && s.pendingBuybackActive && tonAmount == s.pendingBuybackTonOut) {
            s.tonReserve += tonAmount
            s.feeAccumulatedTon -= s.pendingBuybackFee
            s.pendingBuybackActive = false
            s.pendingBuybackQueryId = 0
            s.pendingBuybackTonOut = 0
            s.pendingBuybackFee = 0
            s.save()
        } else if (queryId == s.prevBuybackQueryId && s.prevBuybackActive && tonAmount == s.prevBuybackTonOut) {
            s.tonReserve += tonAmount
            s.feeAccumulatedTon -= s.prevBuybackFee
            s.prevBuybackActive = false
            s.prevBuybackQueryId = 0
            s.prevBuybackTonOut = 0
            s.prevBuybackFee = 0
            s.save()
        } else {
            emitUnknownBuybackBounce(queryId)
        }
        return
    }
    throw 1234
}

get fun lpBalance(user: address): int {
    return lpBalanceOf(QuasarDeFiStorage.load().lpBalances, user)
}
get fun pendingQsrDeposit(user: address): int {
    val found = pendingInt(QuasarDeFiStorage.load().pendingQsrDeposits, user)
    return found == null ? 0 : found!!
}
get fun pendingQsrDepositAt(user: address): int {
    val found = pendingInt(QuasarDeFiStorage.load().pendingQsrDepositsAt, user)
    return found == null ? 0 : found!!
}
get fun poolInfo(): LPInfo {
    val s = QuasarDeFiStorage.load()
    return LPInfo { totalSupply: s.lpTotalSupply, tonReserve: s.tonReserve, qsrReserve: s.qsrReserve }
}
get fun get_reserve_snapshot(): DeFiReserveSnapshot {
    val s = QuasarDeFiStorage.load()
    return DeFiReserveSnapshot {
        lpTotalSupply: s.lpTotalSupply,
        tonReserve: s.tonReserve,
        qsrReserve: s.qsrReserve,
        feeAccumulatedTon: s.feeAccumulatedTon,
        feeAccumulatedQsr: s.feeAccumulatedQsr,
        farmRewardReserve: s.farmRewardReserve,
        farmTotalStaked: s.farmTotalStaked,
    }
}
get fun farmInfo(): FarmInfo {
    val s = QuasarDeFiStorage.load()
    return FarmInfo {
        staked: s.farmTotalStaked,
        rewardPerSecond: s.farmRewardPerSecond,
        lastUpdate: s.farmLastUpdate,
        accRewardPerShare: s.farmAccRewardPerShare,
        startTime: s.farmStartTime,
        endTime: s.farmEndTime,
    }
}
get fun userFarm(user: address): UserFarmInfo {
    val info = farmInfoOf(QuasarDeFiStorage.load().farmStakes, user)
    return info == null ? UserFarmInfo { staked: 0, debt: 0, pending: 0 } : info!!
}
get fun estimateSwapToTon(qsrAmount: int): SwapQuote {
    val s = QuasarDeFiStorage.load()
    if (s.qsrReserve == 0 || qsrAmount == 0) {
        return SwapQuote { tonIn: 0, qsrIn: qsrAmount, tonOut: 0, qsrOut: 0, fee: 0, priceImpactBps: 0 }
    }
    val gross = (qsrAmount * s.tonReserve) / (s.qsrReserve + qsrAmount)
    val fee = (gross * s.feeBps) / 10000
    val impact = minimum((qsrAmount * 10000) / s.qsrReserve, 10000)
    return SwapQuote { tonIn: 0, qsrIn: qsrAmount, tonOut: gross - fee, qsrOut: 0, fee, priceImpactBps: impact }
}
get fun estimateSwapToQsr(tonAmount: int): SwapQuote {
    val s = QuasarDeFiStorage.load()
    if (s.tonReserve == 0 || tonAmount == 0) {
        return SwapQuote { tonIn: tonAmount, qsrIn: 0, tonOut: 0, qsrOut: 0, fee: 0, priceImpactBps: 0 }
    }
    val gross = (tonAmount * s.qsrReserve) / (s.tonReserve + tonAmount)
    val fee = (gross * s.feeBps) / 10000
    val impact = minimum((tonAmount * 10000) / s.tonReserve, 10000)
    return SwapQuote { tonIn: tonAmount, qsrIn: 0, tonOut: 0, qsrOut: gross - fee, fee, priceImpactBps: impact }
}
get fun estimateLpOut(tonAmount: int, qsrAmount: int): int {
    val s = QuasarDeFiStorage.load()
    if (s.lpTotalSupply == 0) {
        val root = integerSqrt(tonAmount * qsrAmount)
        return root <= s.minimumLiquidity ? 0 : root - s.minimumLiquidity
    }
    if (s.tonReserve == 0 || s.qsrReserve == 0) {
        return 0
    }
    return minimum((tonAmount * s.lpTotalSupply) / s.tonReserve,
        (qsrAmount * s.lpTotalSupply) / s.qsrReserve)
}
get fun estimateRemoveLiquidity(lpAmount: int): LPInfo {
    val s = QuasarDeFiStorage.load()
    if (s.lpTotalSupply == 0 || lpAmount == 0) {
        return LPInfo { totalSupply: 0, tonReserve: 0, qsrReserve: 0 }
    }
    return LPInfo {
        totalSupply: s.lpTotalSupply,
        tonReserve: (lpAmount * s.tonReserve) / s.lpTotalSupply,
        qsrReserve: (lpAmount * s.qsrReserve) / s.lpTotalSupply,
    }
}
get fun feeConfig(): int { return QuasarDeFiStorage.load().feeBps }
get fun feeAccumulatedTon(): int { return QuasarDeFiStorage.load().feeAccumulatedTon }
get fun feeAccumulatedQsr(): int { return QuasarDeFiStorage.load().feeAccumulatedQsr }
get fun farmRewardReserve(): int { return QuasarDeFiStorage.load().farmRewardReserve }
get fun owner(): address { return QuasarDeFiStorage.load().owner }
get fun qsrMaster(): address { return QuasarDeFiStorage.load().qsrMaster }
get fun minimumLiquidity(): int { return QuasarDeFiStorage.load().minimumLiquidity }
get fun priceCumulativeQsrPerTon(): int { return QuasarDeFiStorage.load().priceCumulativeQsrPerTon }
get fun priceCumulativeTonPerQsr(): int { return QuasarDeFiStorage.load().priceCumulativeTonPerQsr }
get fun lastPriceObservation(): int { return QuasarDeFiStorage.load().lastPriceObservation }
get fun pendingFee(): int { return QuasarDeFiStorage.load().pendingFeeBps }
get fun pendingFeeAt(): int { return QuasarDeFiStorage.load().pendingFeeAt }
get fun pendingMaxTrade(): int { return QuasarDeFiStorage.load().pendingMaxTradeBps }
get fun pendingMaxTradeAt(): int { return QuasarDeFiStorage.load().pendingMaxTradeAt }
get fun pendingOwner(): address { return QuasarDeFiStorage.load().pendingOwner }
get fun ownerTransferAt(): int { return QuasarDeFiStorage.load().ownerTransferAt }
