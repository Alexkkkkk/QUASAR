import "@stdlib/deploy";
import "@stdlib/content";
import "./quasar_common";

// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi Module v2.0 — DEX | Liquidity Pool | Yield Farming
// Synchronized with QuasarMaster Jetton contract
// Features: CPMM AMM with 0.3% fee, auto-compound farming,
//           Jetton-native QSR transfers, reentrancy guard
// ═══════════════════════════════════════════════════════════════

// ─── Messages ───
message AddLiquidity { tonAmount: Int as coins; qsrAmount: Int as coins; minLpOut: Int as coins; deadline: Int as uint32 }
message RemoveLiquidity { lpAmount: Int as coins; minTonOut: Int as coins; minQsrOut: Int as coins; deadline: Int as uint32 }
message SwapToTON { qsrAmount: Int as coins; minTonOut: Int as coins; deadline: Int as uint32 }
message SwapToQSR { tonAmount: Int as coins; minQsrOut: Int as coins; deadline: Int as uint32 }
message ClaimFarmRewards { }
message EmergencyWithdrawFarm { }
message SetFarmEnabled { enabled: Bool }
message FundFarm { amount: Int as coins }
message SetFarmConfig { rewardPerSecond: Int as coins; startTime: Int as uint32; endTime: Int as uint32 }
message SetFeeBps { feeBps: Int as uint16 }
message SetPaused { paused: Bool }
message SetMaxTradeBps { maxTradeBps: Int as uint16 }
message ProposePoolOwner { newOwner: Address }
message AcceptPoolOwner { }
message CancelPoolOwner { }
message SweepTON { amount: Int as coins }
message RefundPendingQsr { }

// ─── Jetton Integration Messages ───
// TEP-74 `excesses` message: a receiving wallet returns the unused part of an
// incoming message value with it (opcode 0xd53276db).
// M-01: typed TON payout so a bounce can be matched and rolled back.
message(0x746f6e70) TonPayout { queryId: Int as uint64; amount: Int as coins }
message(0x2c7e91a4) BuybackTon { queryId: Int as uint64; tonAmount: Int as coins; qsrSwapped: Int as coins }

// ─── Events ───
message EventLiquidityAdded { provider: Address; tonAmount: Int; qsrAmount: Int; lpMinted: Int }
message EventLiquidityRemoved { provider: Address; tonOut: Int; qsrOut: Int; lpBurned: Int }
message EventSwap { trader: Address; tonIn: Int; qsrIn: Int; tonOut: Int; qsrOut: Int; fee: Int }
message EventFarmReward { farmer: Address; amount: Int }
message EventFeeCollected { amount: Int }

// ─── Data Structures ───
struct LPInfo { totalSupply: Int; tonReserve: Int; qsrReserve: Int; }
struct DeFiReserveSnapshot {
    lpTotalSupply: Int;
    tonReserve: Int;
    qsrReserve: Int;
    feeAccumulatedTon: Int;
    feeAccumulatedQsr: Int;
    farmRewardReserve: Int;
    farmTotalStaked: Int;
}
struct FarmInfo { staked: Int; rewardPerSecond: Int; lastUpdate: Int; accRewardPerShare: Int; startTime: Int; endTime: Int }
struct UserFarmInfo { staked: Int; debt: Int; pending: Int }
struct PendingPayout { amount: Int; kind: Int; beneficiary: Address }
struct PendingTonPayout { kind: Int; beneficiary: Address; tonOut: Int; qsrAmount: Int; lpAmount: Int }
struct SwapQuote { tonIn: Int; qsrIn: Int; tonOut: Int; qsrOut: Int; fee: Int; priceImpactBps: Int }

// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi CONTRACT
// ═══════════════════════════════════════════════════════════════

contract QuasarDeFi with Deployable {
    // Keep enough TON reserved for rent and long-lived LP/farm dictionaries.
    // This changes the code hash and must be applied before public deployment.
    override const storageReserve: Int = QUASAR_STORAGE_RESERVE;
    
    owner: Address;
    qsrMaster: Address;
    
    // LP Pool
    lpTotalSupply: Int as coins;
    tonReserve: Int as coins;
    qsrReserve: Int as coins;
    lpBalances: map<Address, Int>;
    pendingQsrDeposits: map<Address, Int>;
    pendingQsrDepositsAt: map<Address, Int>;
    
    // AMM Fee (0.30% default = 30 bps)
    feeBps: Int as uint16;
    feeAccumulatedTon: Int as coins;
    feeAccumulatedQsr: Int as coins;
    
    // Farm
    farmEnabled: Bool;
    farmRewardPerSecond: Int as coins;
    farmStartTime: Int as uint32;
    farmEndTime: Int as uint32;
    farmLastUpdate: Int;
    farmAccRewardPerShare: Int;
    farmTotalStaked: Int as coins;
    farmRewardReserve: Int as coins;
    farmStakes: map<Address, UserFarmInfo>;
    
    // Safety
    locked: Bool;
    paused: Bool;
    maxTradeBps: Int as uint16;
    minimumLiquidity: Int as coins;
    priceCumulativeQsrPerTon: Int;
    priceCumulativeTonPerQsr: Int;
    lastPriceObservation: Int as uint32;
    pendingFeeBps: Int as uint16;
    pendingFeeAt: Int as uint32;
    pendingMaxTradeBps: Int as uint16;
    pendingMaxTradeAt: Int as uint32;
    pendingOwner: Address;
    ownerTransferAt: Int as uint32;
    ownerTransferDelay: Int as uint32;
    // Every pool payout gets a fresh ID. A single fixed query ID makes
    // downstream wallets unable to distinguish concurrent payouts.
    payoutSeq: Int as uint64;
    pendingPayouts: map<Int, PendingPayout>;
    // M-01: tracked TON payouts. A bounce restores tonReserve and the user's LP
    // or QSR-deposit entitlement instead of silently losing them.
    pendingTonPayouts: map<Int, PendingTonPayout>;
    tonPayoutSeq: Int as uint64;
    
    init(owner: Address, qsrMaster: Address) {
        self.owner = owner;
        self.qsrMaster = qsrMaster;
        self.lpTotalSupply = 0;
        self.tonReserve = 0;
        self.qsrReserve = 0;
        self.feeBps = 30;
        self.feeAccumulatedTon = 0;
        self.feeAccumulatedQsr = 0;
        self.farmEnabled = false;
        self.farmRewardPerSecond = 100000000;
        self.farmStartTime = now();
        self.farmEndTime = now() + 31536000;
        self.farmLastUpdate = now();
        self.farmAccRewardPerShare = 0;
        self.farmTotalStaked = 0;
        self.farmRewardReserve = 0;
        self.locked = false;
        self.paused = false;
        self.maxTradeBps = 3000;
        self.minimumLiquidity = 1000;
        self.priceCumulativeQsrPerTon = 0;
        self.priceCumulativeTonPerQsr = 0;
        self.lastPriceObservation = now();
        self.pendingFeeBps = 0;
        self.pendingFeeAt = 0;
        self.pendingMaxTradeBps = 0;
        self.pendingMaxTradeAt = 0;
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
        self.ownerTransferDelay = 172800;
        self.payoutSeq = 0;
        self.pendingTonPayouts = emptyMap();
        self.tonPayoutSeq = 0;
    }
    
    // ─── Reentrancy Guard ───
    fun _lock() { require(!self.locked, "Reentrant call"); self.locked = true }
    fun _unlock() { self.locked = false; }

    fun _requireActive() { require(!self.paused, "DeFi paused") }

    fun _requireDeadline(deadline: Int) {
        require(deadline > now(), "Operation expired");
    }

    // Record the time-weighted spot price before each reserve mutation. The
    // cumulative values are exposed through a getter so an indexer or a future
    // router can build a TWAP without trusting a single transaction price.
    fun _recordPriceObservation() {
        if (self.lastPriceObservation == 0 || self.tonReserve == 0 || self.qsrReserve == 0) {
            self.lastPriceObservation = now();
            return;
        }
        let elapsed: Int = now() - self.lastPriceObservation;
        if (elapsed > 0) {
            self.priceCumulativeQsrPerTon += (self.qsrReserve * elapsed) / self.tonReserve;
            self.priceCumulativeTonPerQsr += (self.tonReserve * elapsed) / self.qsrReserve;
            self.lastPriceObservation = now();
        }
    }

    fun _nextPayoutId(): Int {
        let id: Int = self.payoutSeq + 1;
        self.payoutSeq = id;
        return id;
    }

    // M-01: dispatch a TON payout with a typed body; the record lets the bounce
    // handler restore tonReserve and the user entitlement exactly once.
    fun _dispatchTon(to: Address, amount: Int, payoutId: Int) {
        send(SendParameters{ to: to, value: amount, bounce: true, mode: SendPayGasSeparately, body: TonPayout{ queryId: payoutId, amount: amount }.toCell() });
    }

    fun _sendQsr(to: Address, amount: Int, kind: Int, payoutId: Int) {
        require(amount > 0, "Invalid QSR amount");
        self.pendingPayouts.set(payoutId, PendingPayout{ amount: amount, kind: kind, beneficiary: to });
        let init: StateInit = initOf QuasarWallet(myAddress(), self.qsrMaster);
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: PoolPayout{
                queryId: payoutId,
                amount: amount,
                destination: to,
                responseDestination: myAddress(),
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    // F-09: master-initiated buyback swap. Runs inside the TokenNotification
    // transaction (the QSR is already credited to qsrReserve above), pays TON
    // out of the pool reserves and returns the proceeds to the master. No
    // slippage or trade-size guard on purpose: the master is the pool's own
    // counterparty, the price is bounded by CPMM math, and a revert here
    // would bounce the jetton credit and desync the reserve accounting.
    fun _executeBuybackSwap(qsrIn: Int, queryId: Int) {
        require(qsrIn > 0, "Invalid swap input");
        require(self.tonReserve > 0, "Empty TON reserve");
        // TokenNotification credits qsrReserve before this hook runs. Compare
        // the buyback against the pre-trade reserve, just like user swaps.
        let qsrReserveBefore: Int = self.qsrReserve - qsrIn;
        require(qsrReserveBefore > 0, "Empty QSR reserve");
        require(qsrIn * 10000 <= qsrReserveBefore * self.maxTradeBps, "Buyback too large");
        // CPMM output with x = pre-trade QSR reserve and dx = qsrIn.
        let grossTonOut: Int = (qsrIn * self.tonReserve) / (self.qsrReserve);
        let fee: Int = (grossTonOut * self.feeBps) / 10000;
        let tonOut: Int = grossTonOut - fee;
        require(tonOut > 0 && tonOut < self.tonReserve, "Insufficient TON reserve");
        // The swap input must stay in the pool, exactly as in SwapToTON.
        // Debiting it here made the pool keep no QSR at all: the tokens sat
        // in the pool's Jetton wallet with no accounting entry (stranded),
        // while tonReserve was paid out, so k was not preserved.
        self.tonReserve = self.tonReserve - tonOut;
        self.feeAccumulatedTon = self.feeAccumulatedTon + fee;
        send(SendParameters{
            to: self.qsrMaster,
            value: tonOut,
            bounce: false,
            mode: SendPayGasSeparately,
            body: BuybackTon{ queryId: queryId, tonAmount: tonOut, qsrSwapped: qsrIn }.toCell()
        });
    }

    fun _min(a: Int, b: Int): Int {
        return a < b ? a : b;
    }

    fun _sqrt(value: Int): Int {
        if (value <= 0) { return 0; }
        let x: Int = value;
        let y: Int = (x + 1) / 2;
        while (y < x) {
            x = y;
            y = (x + value / x) / 2;
        }
        return x;
    }
    
    // ─── Receive TON ───
    // No bare-TON receiver on purpose: plain transfers without a swap or
    // liquidity message would sit in the pool uncredited. Send a
    // SwapToQSR / AddLiquidity message instead.
    
    // ─── Jetton QSR Deposit ───
    receive(msg: TokenNotification) {
        let walletInit: StateInit = initOf QuasarWallet(myAddress(), self.qsrMaster);
        require(sender() == contractAddress(walletInit), "Invalid token wallet");
        require(msg.amount > 0, "Invalid amount");
        require(msg.from != newAddress(0, 0), "Invalid depositor");

        // Master-funded fee liquidity is already owned by the pool and must
        // enter qsrReserve directly, not become a user withdrawal credit.
        if (msg.from == self.qsrMaster) {
            self.qsrReserve = self.qsrReserve + msg.amount;
            // F-09: a buyback marker in the forward payload converts this
            // master liquidity transfer into an atomic AMM swap: the credit
            // and the swap run in one transaction, so message ordering
            // cannot split them and pool accounting stays consistent.
            if (msg.forwardPayload.bits() >= 32) {
                if (msg.forwardPayload.loadUint(32) == 0x5f4a3b21) {
                    self._executeBuybackSwap(msg.amount, msg.queryId);
                }
            }
        } else {
            // Deposits remain refundable until consumed. A previous version
            // discarded balances older than 24 hours while leaving the QSR in
            // this contract's wallet, permanently stranding user funds.
            let prev: Int? = self.pendingQsrDeposits.get(msg.from);
            self.pendingQsrDeposits.set(msg.from, prev == null ? msg.amount : prev!! + msg.amount);
            self.pendingQsrDepositsAt.set(msg.from, now());
        }
    }

    // TEP-74: the pool's own Jetton wallet returns unused message value as an
    // `excesses` message. It is informational; accept it instead of aborting the
    // transaction as an unmatched message.
    receive(msg: TokenExcesses) {
    }

    // The source wallet can accept PoolPayout while the downstream
    // InternalTransfer later bounces. Restore the exact logical reserve that
    // funded this payout and consume the record once.
    receive(msg: PayoutFailed) {
        let wInit: StateInit = initOf QuasarWallet(myAddress(), self.qsrMaster);
        require(sender() == contractAddress(wInit), "Invalid payout source");
        let payout: PendingPayout? = self.pendingPayouts.get(msg.queryId);
        require(payout != null && payout!!.amount == msg.amount, "Unknown payout");
        self.pendingPayouts.set(msg.queryId, null);
        if (payout!!.kind == 1) {
            self.qsrReserve = self.qsrReserve + msg.amount;
            // M-01: if the matching TON leg is still undelivered, restore the
            // whole LP position and cancel that leg too (single rollback).
            let tp: PendingTonPayout? = self.pendingTonPayouts.get(msg.queryId);
            if (tp != null && tp!!.kind == 1) {
                self.pendingTonPayouts.set(msg.queryId, null);
                self.tonReserve += tp!!.tonOut;
                let cur: Int? = self.lpBalances.get(payout!!.beneficiary);
                self.lpBalances.set(payout!!.beneficiary, (cur == null ? 0 : cur!!) + tp!!.lpAmount);
                self.lpTotalSupply += tp!!.lpAmount;
            }
        } else if (payout!!.kind == 2) {
            self.farmRewardReserve = self.farmRewardReserve + msg.amount;
        } else if (payout!!.kind == 3) {
            let pending: Int? = self.pendingQsrDeposits.get(payout!!.beneficiary);
            self.pendingQsrDeposits.set(payout!!.beneficiary, pending == null ? msg.amount : pending!! + msg.amount);
            self.pendingQsrDepositsAt.set(payout!!.beneficiary, now());
        } else {
            require(false, "Invalid payout kind");
        }
    }

    // A user may recover an unconsumed deposit at any time. This is
    // intentionally allowed while paused: it only returns the user's own
    // QSR and prevents a UI failure or an abandoned two-step operation from
    // becoming a permanent loss.
    receive(msg: RefundPendingQsr) {
        let pending: Int? = self.pendingQsrDeposits.get(sender());
        require(pending != null && pending!! > 0, "No pending QSR");
        self._lock();
        self.pendingQsrDeposits.set(sender(), 0);
        self.pendingQsrDepositsAt.set(sender(), 0);
        self._sendQsr(sender(), pending!!, 3, self._nextPayoutId());
        self._unlock();
    }
    
    // ─── ADD LIQUIDITY ───
    receive(msg: AddLiquidity) {
        self._requireActive();
        self._lock();
        self._requireDeadline(msg.deadline);
        require(msg.tonAmount > 0 && msg.qsrAmount > 0, "Invalid amounts");
        require(context().value >= msg.tonAmount, "Insufficient TON sent");
        let deposited: Int? = self.pendingQsrDeposits.get(sender());
        require(deposited != null && deposited!! >= msg.qsrAmount, "Deposit QSR first");
        if (self.lpTotalSupply > 0) {
            require(msg.tonAmount * 10000 <= self.tonReserve * self.maxTradeBps, "TON deposit too large");
            require(msg.qsrAmount * 10000 <= self.qsrReserve * self.maxTradeBps, "QSR deposit too large");
        }
        
        let lpToMint: Int = 0;
        let tonUsed: Int = msg.tonAmount;
        let qsrUsed: Int = msg.qsrAmount;
        if (self.lpTotalSupply == 0) {
            // Lock permanent minimum liquidity so the first provider cannot
            // manipulate the initial price with a later direct donation.
            let rootLp: Int = self._sqrt(msg.tonAmount * msg.qsrAmount);
            require(rootLp > self.minimumLiquidity, "Initial liquidity too small");
            lpToMint = rootLp - self.minimumLiquidity;
        } else {
            // Subsequent: proportional to existing reserves. Only the
            // proportional share is consumed; the unbalanced surplus is
            // refunded instead of being donated to the pool.
            lpToMint = self._min(
                (msg.tonAmount * self.lpTotalSupply) / self.tonReserve,
                (msg.qsrAmount * self.lpTotalSupply) / self.qsrReserve
            );
            tonUsed = (lpToMint * self.tonReserve) / self.lpTotalSupply;
            qsrUsed = (lpToMint * self.qsrReserve) / self.lpTotalSupply;
        }
        require(lpToMint > 0, "Zero LP tokens");
        require(lpToMint >= msg.minLpOut, "LP slippage exceeded");
        
        // Update reserves
        self._recordPriceObservation();
        self.tonReserve += tonUsed;
        self.qsrReserve += qsrUsed;
        if (self.lpTotalSupply == 0) { self.lpTotalSupply = self.minimumLiquidity; }
        self.lpTotalSupply += lpToMint;
        self.pendingQsrDeposits.set(sender(), deposited!! - qsrUsed);
        
        // Refund the unused part of the attached TON (unbalanced surplus
        // plus any overpayment).
        let refund: Int = context().value - tonUsed;
        if (refund > 0) {
            send(SendParameters{ to: sender(), value: refund, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
        }
        
        // Credit LP tokens
        let current: Int? = self.lpBalances.get(sender());
        self.lpBalances.set(sender(), current == null ? lpToMint : current!! + lpToMint);
        
        // Auto-stake only after the farm has been funded and enabled.
        self._updateFarm();
        if (self.farmEnabled) { self._stakeLp(sender(), lpToMint); }
        
        // The refund above already consumes the declared TON amount. Do not
        // add a second SendRemainingValue action: it can drain the action
        // balance and abort the whole transaction with noFunds.
        emit(EventLiquidityAdded{ provider: sender(), tonAmount: tonUsed, qsrAmount: qsrUsed, lpMinted: lpToMint }.toCell());
        
        self._unlock();
    }
    
    // ─── REMOVE LIQUIDITY ───
    receive(msg: RemoveLiquidity) {
        self._lock();
        self._requireDeadline(msg.deadline);
        let current: Int? = self.lpBalances.get(sender());
        require(msg.lpAmount > 0, "Invalid LP amount");
        require(current != null && current!! >= msg.lpAmount, "Insufficient LP balance");
        
        // Calculate proportional output
        let tonOut: Int = (msg.lpAmount * self.tonReserve) / self.lpTotalSupply;
        let qsrOut: Int = (msg.lpAmount * self.qsrReserve) / self.lpTotalSupply;
        // Dust from integer rounding may zero one side on tiny withdrawals;
        // only an all-zero output is rejected, and each side pays out only
        // when non-zero.
        require(tonOut > 0 || qsrOut > 0, "Zero output");
        require(tonOut >= msg.minTonOut, "TON slippage exceeded");
        require(qsrOut >= msg.minQsrOut, "QSR slippage exceeded");
        
        // Unstake from farm first when this LP was auto-staked.
        self._updateFarm();
        let farmStake: UserFarmInfo? = self.farmStakes.get(sender());
        if (farmStake != null && farmStake!!.staked > 0) {
            // A provider can hold LP that was added while farming was off.
            // Unstake only the portion actually locked in the farm.
            let farmAmount: Int = self._min(msg.lpAmount, farmStake!!.staked);
            if (farmAmount > 0) { self._unstakeLp(sender(), farmAmount); }
        }
        
        // Burn LP tokens
        self._recordPriceObservation();
        self.lpBalances.set(sender(), current!! - msg.lpAmount);
        self.lpTotalSupply -= msg.lpAmount;
        self.tonReserve -= tonOut;
        self.qsrReserve -= qsrOut;
        
        // M-01: both payout legs share one payout id so a bounce restores the
        // full pre-removal position and cannot double-credit the reserves.
        let payoutId: Int = self._nextPayoutId();
        if (tonOut > 0) {
            self.pendingTonPayouts.set(payoutId, PendingTonPayout{ kind: 1, beneficiary: sender(), tonOut: tonOut, qsrAmount: qsrOut, lpAmount: msg.lpAmount });
            self._dispatchTon(sender(), tonOut, payoutId);
        }
        if (qsrOut > 0) {
            self._sendQsr(sender(), qsrOut, 1, payoutId);
        }
        
        // Emit event
        emit(EventLiquidityRemoved{ provider: sender(), tonOut: tonOut, qsrOut: qsrOut, lpBurned: msg.lpAmount }.toCell());
        
        self._unlock();
    }
    
    // ─── SWAP QSR → TON (sell QSR) ───
    receive(msg: SwapToTON) {
        self._requireActive();
        self._lock();
        self._requireDeadline(msg.deadline);
        require(msg.qsrAmount > 0 && self.qsrReserve > 0, "Invalid swap");
        require(msg.qsrAmount * 10000 <= self.qsrReserve * self.maxTradeBps, "Trade too large");
        let deposited: Int? = self.pendingQsrDeposits.get(sender());
        require(deposited != null && deposited!! >= msg.qsrAmount, "Deposit QSR first");
        
        // CPMM with fee: tonOut = (qsrIn * tonReserve) / (qsrReserve + qsrIn)
        // Fee is taken from output
        let grossTonOut: Int = (msg.qsrAmount * self.tonReserve) / (self.qsrReserve + msg.qsrAmount);
        let fee: Int = (grossTonOut * self.feeBps) / 10000;
        let tonOut: Int = grossTonOut - fee;
        
        require(tonOut >= msg.minTonOut, "Slippage exceeded");
        require(tonOut > 0 && tonOut < self.tonReserve, "Insufficient reserve");
        
        // Update reserves
        self._recordPriceObservation();
        self.qsrReserve += msg.qsrAmount;
        self.tonReserve -= tonOut;
        self.feeAccumulatedTon += fee;
        self.pendingQsrDeposits.set(sender(), deposited!! - msg.qsrAmount);
        
        // Payout and event must be separate messages: with
        // SendRemainingValue the explicit value field is ignored, so the
        // trader could receive an unpredictable amount.
        // M-01: typed, bounce-tracked TON payout.
        let payoutId: Int = self._nextPayoutId();
        self.pendingTonPayouts.set(payoutId, PendingTonPayout{ kind: 2, beneficiary: sender(), tonOut: tonOut, qsrAmount: msg.qsrAmount, lpAmount: 0 });
        self._dispatchTon(sender(), tonOut, payoutId);

        emit(EventSwap{ trader: sender(), tonIn: 0, qsrIn: msg.qsrAmount, tonOut: tonOut, qsrOut: 0, fee: fee }.toCell());
        
        self._unlock();
    }
    
    // ─── SWAP TON → QSR (buy QSR) ───
    receive(msg: SwapToQSR) {
        self._requireActive();
        self._lock();
        self._requireDeadline(msg.deadline);
        require(msg.tonAmount > 0 && self.tonReserve > 0, "Invalid swap");
        require(context().value >= msg.tonAmount, "Insufficient TON sent");
        require(msg.tonAmount * 10000 <= self.tonReserve * self.maxTradeBps, "Trade too large");
        
        // CPMM with fee
        let grossQsrOut: Int = (msg.tonAmount * self.qsrReserve) / (self.tonReserve + msg.tonAmount);
        let fee: Int = (grossQsrOut * self.feeBps) / 10000;
        let qsrOut: Int = grossQsrOut - fee;
        
        require(qsrOut >= msg.minQsrOut, "Slippage exceeded");
        require(qsrOut > 0 && qsrOut < self.qsrReserve, "Insufficient reserve");
        
        // Update reserves
        self._recordPriceObservation();
        self.tonReserve += msg.tonAmount;
        self.qsrReserve -= qsrOut;
        self.feeAccumulatedQsr += fee;
        
        // Refund any TON overpayment above the declared amount.
        let excess: Int = context().value - msg.tonAmount;
        if (excess > 0) {
            send(SendParameters{ to: sender(), value: excess, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
        }
        
        self._sendQsr(sender(), qsrOut, 1, self._nextPayoutId());
        
        // Emit event
        emit(EventSwap{ trader: sender(), tonIn: msg.tonAmount, qsrIn: 0, tonOut: 0, qsrOut: qsrOut, fee: fee }.toCell());
        
        self._unlock();
    }
    
    // ─── CLAIM FARM REWARDS ───
    receive(msg: ClaimFarmRewards) {
        self._updateFarm();
        let stake: UserFarmInfo? = self.farmStakes.get(sender());
        require(stake != null, "No LP stake");
        
        let s: UserFarmInfo = stake!!;
        let pending: Int = (s.staked * (self.farmAccRewardPerShare - s.debt)) / 1000000000;
        let totalReward: Int = s.pending + pending;
        require(totalReward > 0, "No rewards to claim");
        // Disabling the farm stops new accrual but must not freeze rewards that
        // were already earned (F-13).
        
        // Reset debt
        self.farmStakes.set(sender(), UserFarmInfo{
            staked: s.staked,
            debt: self.farmAccRewardPerShare,
            pending: 0
        });
        
        // Farm rewards are QSR. The pool's own Jetton wallet performs the
        // transfer; the DeFi contract never asks the master to mint tokens.
        self._sendQsr(sender(), totalReward, 2, self._nextPayoutId());
        // Informational: mode +2 (SEND_MODE_IGNORE_ERRORS) keeps a failed
        // event send from rolling back the reward accounting.
        emit(EventFarmReward{ farmer: sender(), amount: totalReward }.toCell());
    }

    // Emergency path: preserve the user's LP principal while discarding only
    // unclaimed farming rewards. This remains live during a pool pause.
    receive(msg: EmergencyWithdrawFarm) {
        self._lock();
        let stake: UserFarmInfo? = self.farmStakes.get(sender());
        require(stake != null && stake!!.staked > 0, "No LP stake");
        self._updateFarm();
        let amount: Int = stake!!.staked;
        self.farmStakes.set(sender(), UserFarmInfo{ staked: 0, debt: self.farmAccRewardPerShare, pending: 0 });
        self.farmTotalStaked -= amount;
        self._unlock();
    }
    
    // ─── ADMIN ───
    receive(msg: ProposePoolOwner) {
        require(sender() == self.owner, "Only owner");
        require(msg.newOwner != newAddress(0, 0), "Invalid owner");
        self.pendingOwner = msg.newOwner;
        self.ownerTransferAt = now() + self.ownerTransferDelay;
    }

    receive(msg: CancelPoolOwner) {
        require(sender() == self.owner, "Only owner");
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
    }

    receive(msg: AcceptPoolOwner) {
        require(self.pendingOwner != newAddress(0, 0), "No pending owner");
        require(sender() == self.pendingOwner, "Not pending owner");
        require(now() >= self.ownerTransferAt, "Timelock active");
        self.owner = self.pendingOwner;
        self.pendingOwner = newAddress(0, 0);
        self.ownerTransferAt = 0;
    }

    receive(msg: SetFarmConfig) {
        require(sender() == self.owner, "Only owner");
        require(msg.rewardPerSecond > 0, "Invalid reward rate");
        require(msg.endTime > msg.startTime, "Invalid farm period");
        require(msg.endTime >= now(), "Farm already ended");
        self._updateFarm();
        self.farmRewardPerSecond = msg.rewardPerSecond;
        self.farmStartTime = msg.startTime;
        self.farmEndTime = msg.endTime;
        if (self.farmLastUpdate < msg.startTime) {
            self.farmLastUpdate = msg.startTime;
        }
    }
    
    receive(msg: SetFarmEnabled) {
        require(sender() == self.owner, "Only owner");
        if (msg.enabled) {
            require(self.farmRewardReserve > 0, "Fund farm before enabling");
        }
        self.farmEnabled = msg.enabled;
    }

    receive(msg: FundFarm) {
        require(sender() == self.owner, "Only owner");
        require(msg.amount > 0, "Invalid farm funding");
        let pending: Int? = self.pendingQsrDeposits.get(sender());
        require(pending != null && pending!! >= msg.amount, "Deposit QSR first");
        self.pendingQsrDeposits.set(sender(), pending!! - msg.amount);
        self.farmRewardReserve = self.farmRewardReserve + msg.amount;
    }

    receive(msg: SetFeeBps) {
        require(sender() == self.owner, "Only owner");
        // The documented swap fee is 0.30%; the previous 1% ceiling let the
        // owner charge more than the protocol advertised (F-13).
        require(msg.feeBps > 0 && msg.feeBps <= 30, "Fee must not exceed 0.30%");
        self.pendingFeeBps = msg.feeBps;
        self.pendingFeeAt = now() + self.ownerTransferDelay;
    }

    receive("Apply Fee Bps") {
        require(sender() == self.owner, "Only owner");
        require(self.pendingFeeBps > 0 && now() >= self.pendingFeeAt, "Fee timelock active");
        self.feeBps = self.pendingFeeBps;
        self.pendingFeeBps = 0;
        self.pendingFeeAt = 0;
    }

    receive(msg: SetPaused) {
        require(sender() == self.owner, "Only owner");
        self.paused = msg.paused;
    }

    receive(msg: SetMaxTradeBps) {
        require(sender() == self.owner, "Only owner");
        require(msg.maxTradeBps >= 100 && msg.maxTradeBps <= 5000, "Trade limit 1%-50%");
        self.pendingMaxTradeBps = msg.maxTradeBps;
        self.pendingMaxTradeAt = now() + self.ownerTransferDelay;
    }

    receive("Apply Max Trade Bps") {
        require(sender() == self.owner, "Only owner");
        require(self.pendingMaxTradeBps > 0 && now() >= self.pendingMaxTradeAt, "Trade limit timelock active");
        self.maxTradeBps = self.pendingMaxTradeBps;
        self.pendingMaxTradeBps = 0;
        self.pendingMaxTradeAt = 0;
    }
    
    // Recover only TON that is not backing LP positions. The previous check
    // used the whole contract balance and allowed the owner to sweep
    // tonReserve, draining liquidity-provider funds.
    // M-01: a bounced TON payout restores tonReserve and the user's LP /
    // QSR-deposit entitlement. Idempotent through the pending record.
    bounced(msg: bounced<TonPayout>) {
        let p: PendingTonPayout? = self.pendingTonPayouts.get(msg.queryId);
        require(p != null, "Unknown TON payout");
        self.pendingTonPayouts.set(msg.queryId, null);
        self.tonReserve += p!!.tonOut;
        if (p!!.kind == 1) {
            let qsrLeg: PendingPayout? = self.pendingPayouts.get(msg.queryId);
            if (qsrLeg != null) {
                self.pendingPayouts.set(msg.queryId, null);
                self.qsrReserve += qsrLeg!!.amount;
                let cur: Int? = self.lpBalances.get(p!!.beneficiary);
                self.lpBalances.set(p!!.beneficiary, (cur == null ? 0 : cur!!) + p!!.lpAmount);
                self.lpTotalSupply += p!!.lpAmount;
            }
        } else if (p!!.kind == 2) {
            self.qsrReserve -= p!!.qsrAmount;
            let dep: Int? = self.pendingQsrDeposits.get(p!!.beneficiary);
            self.pendingQsrDeposits.set(p!!.beneficiary, (dep == null ? 0 : dep!!) + p!!.qsrAmount);
            self.pendingQsrDepositsAt.set(p!!.beneficiary, now());
        } else {
            require(false, "Unknown payout kind")
        }
    }

    receive(msg: SweepTON) {
        require(sender() == self.owner, "Only owner");
        require(msg.amount > 0 && myBalance() >= self.tonReserve + msg.amount + QUASAR_STORAGE_RESERVE, "Invalid sweep");
        send(SendParameters{ to: self.owner, value: msg.amount, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
    }
    
    // ─── INTERNAL: Farm Helpers ───
    fun _updateFarm() {
        if (now() <= self.farmLastUpdate) { return }
        let end: Int = self._min(now(), self.farmEndTime);
        if (end <= self.farmLastUpdate) { return }
        // Never accrue rewards while nobody is staked or the farm is disabled.
        if (self.farmTotalStaked == 0 || !self.farmEnabled) {
            self.farmLastUpdate = end;
            return;
        }
        let multiplier: Int = end - self.farmLastUpdate;
        let reward: Int = multiplier * self.farmRewardPerSecond;
        if (reward > self.farmRewardReserve) { reward = self.farmRewardReserve; }
        if (reward > 0) {
            self.farmRewardReserve = self.farmRewardReserve - reward;
            self.farmAccRewardPerShare += (reward * 1000000000) / self.farmTotalStaked;
        }
        self.farmLastUpdate = end;
    }
    
    fun _stakeLp(user: Address, amount: Int) {
        let stake: UserFarmInfo? = self.farmStakes.get(user);
        if (stake == null) {
            self.farmStakes.set(user, UserFarmInfo{
                staked: amount,
                debt: self.farmAccRewardPerShare,
                pending: 0
            });
        } else {
            let s: UserFarmInfo = stake!!;
            let pending: Int = (s.staked * (self.farmAccRewardPerShare - s.debt)) / 1000000000;
            self.farmStakes.set(user, UserFarmInfo{
                staked: s.staked + amount,
                debt: self.farmAccRewardPerShare,
                pending: s.pending + pending
            });
        }
        self.farmTotalStaked += amount;
    }
    
    fun _unstakeLp(user: Address, amount: Int) {
        let stake: UserFarmInfo? = self.farmStakes.get(user);
        require(stake != null && stake!!.staked >= amount, "Farm stake insufficient");
        let s: UserFarmInfo = stake!!;
        let pending: Int = (s.staked * (self.farmAccRewardPerShare - s.debt)) / 1000000000;
        self.farmStakes.set(user, UserFarmInfo{
            staked: s.staked - amount,
            debt: self.farmAccRewardPerShare,
            pending: s.pending + pending
        });
        self.farmTotalStaked -= amount;
    }
    
    // ─── GETTERS ───
    get fun lpBalance(user: Address): Int {
        let b: Int? = self.lpBalances.get(user);
        return b == null ? 0 : b!!;
    }

    get fun pendingQsrDeposit(user: Address): Int {
        let b: Int? = self.pendingQsrDeposits.get(user);
        return b == null ? 0 : b!!;
    }

    get fun pendingQsrDepositAt(user: Address): Int {
        let b: Int? = self.pendingQsrDepositsAt.get(user);
        return b == null ? 0 : b!!;
    }
    
    get fun poolInfo(): LPInfo {
        return LPInfo{
            totalSupply: self.lpTotalSupply,
            tonReserve: self.tonReserve,
            qsrReserve: self.qsrReserve
        }
    }

    // Stable read-only surface for indexers and operational monitoring. Keep
    // all reserve-backed values in one getter so off-chain consumers do not
    // observe a mixture of blocks while reconstructing pool solvency.
    get fun get_reserve_snapshot(): DeFiReserveSnapshot {
        return DeFiReserveSnapshot{
            lpTotalSupply: self.lpTotalSupply,
            tonReserve: self.tonReserve,
            qsrReserve: self.qsrReserve,
            feeAccumulatedTon: self.feeAccumulatedTon,
            feeAccumulatedQsr: self.feeAccumulatedQsr,
            farmRewardReserve: self.farmRewardReserve,
            farmTotalStaked: self.farmTotalStaked
        }
    }
    
    get fun farmInfo(): FarmInfo {
        return FarmInfo{
            staked: self.farmTotalStaked,
            rewardPerSecond: self.farmRewardPerSecond,
            lastUpdate: self.farmLastUpdate,
            accRewardPerShare: self.farmAccRewardPerShare,
            startTime: self.farmStartTime,
            endTime: self.farmEndTime
        }
    }
    
    get fun userFarm(user: Address): UserFarmInfo {
        let s: UserFarmInfo? = self.farmStakes.get(user);
        return s == null ? UserFarmInfo{staked: 0, debt: 0, pending: 0} : s!!;
    }
    
    // ─── SWAP ESTIMATES ───
    get fun estimateSwapToTon(qsrAmount: Int): SwapQuote {
        if (self.qsrReserve == 0 || qsrAmount == 0) {
            return SwapQuote{tonIn: 0, qsrIn: qsrAmount, tonOut: 0, qsrOut: 0, fee: 0, priceImpactBps: 0}
        }
        let grossTonOut: Int = (qsrAmount * self.tonReserve) / (self.qsrReserve + qsrAmount);
        let fee: Int = (grossTonOut * self.feeBps) / 10000;
        let tonOut: Int = grossTonOut - fee;
        let priceImpact: Int = (qsrAmount * 10000) / self.qsrReserve;
        if (priceImpact > 10000) { priceImpact = 10000 }
        return SwapQuote{tonIn: 0, qsrIn: qsrAmount, tonOut: tonOut, qsrOut: 0, fee: fee, priceImpactBps: priceImpact}
    }
    
    get fun estimateSwapToQsr(tonAmount: Int): SwapQuote {
        if (self.tonReserve == 0 || tonAmount == 0) {
            return SwapQuote{tonIn: tonAmount, qsrIn: 0, tonOut: 0, qsrOut: 0, fee: 0, priceImpactBps: 0}
        }
        let grossQsrOut: Int = (tonAmount * self.qsrReserve) / (self.tonReserve + tonAmount);
        let fee: Int = (grossQsrOut * self.feeBps) / 10000;
        let qsrOut: Int = grossQsrOut - fee;
        let priceImpact: Int = (tonAmount * 10000) / self.tonReserve;
        if (priceImpact > 10000) { priceImpact = 10000 }
        return SwapQuote{tonIn: tonAmount, qsrIn: 0, tonOut: 0, qsrOut: qsrOut, fee: fee, priceImpactBps: priceImpact}
    }
    
    get fun estimateLpOut(tonAmount: Int, qsrAmount: Int): Int {
        if (self.lpTotalSupply == 0) {
            return self._sqrt(tonAmount * qsrAmount);
        }
        let lpByTon: Int = (tonAmount * self.lpTotalSupply) / self.tonReserve;
        let lpByQsr: Int = (qsrAmount * self.lpTotalSupply) / self.qsrReserve;
        return self._min(lpByTon, lpByQsr);
    }
    
    get fun estimateRemoveLiquidity(lpAmount: Int): LPInfo {
        if (self.lpTotalSupply == 0 || lpAmount == 0) {
            return LPInfo{totalSupply: 0, tonReserve: 0, qsrReserve: 0}
        }
        let tonOut: Int = (lpAmount * self.tonReserve) / self.lpTotalSupply;
        let qsrOut: Int = (lpAmount * self.qsrReserve) / self.lpTotalSupply;
        return LPInfo{totalSupply: self.lpTotalSupply, tonReserve: tonOut, qsrReserve: qsrOut}
    }
    
    get fun feeConfig(): Int { return self.feeBps }
    get fun feeAccumulatedTon(): Int { return self.feeAccumulatedTon }
    get fun feeAccumulatedQsr(): Int { return self.feeAccumulatedQsr }
    get fun farmRewardReserve(): Int { return self.farmRewardReserve }
    get fun owner(): Address { return self.owner }
    get fun qsrMaster(): Address { return self.qsrMaster }
    get fun minimumLiquidity(): Int { return self.minimumLiquidity }
    get fun priceCumulativeQsrPerTon(): Int { return self.priceCumulativeQsrPerTon }
    get fun priceCumulativeTonPerQsr(): Int { return self.priceCumulativeTonPerQsr }
    get fun lastPriceObservation(): Int { return self.lastPriceObservation }
    get fun pendingFee(): Int { return self.pendingFeeBps }
    get fun pendingFeeAt(): Int { return self.pendingFeeAt }
    get fun pendingMaxTrade(): Int { return self.pendingMaxTradeBps }
    get fun pendingMaxTradeAt(): Int { return self.pendingMaxTradeAt }
    get fun pendingOwner(): Address { return self.pendingOwner }
    get fun ownerTransferAt(): Int { return self.ownerTransferAt }
}

// This is intentionally identical to the wallet in quasar.tact. Keeping the
// definition here lets the DeFi contract derive its own Jetton-wallet address
// with the same StateInit as the master and user wallets.


