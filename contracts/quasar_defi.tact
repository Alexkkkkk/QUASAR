import "@stdlib/deploy";
import "@stdlib/content";

// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi Module v2.0 — DEX | Liquidity Pool | Yield Farming
// Synchronized with QuasarMaster Jetton contract
// Features: CPMM AMM with 0.3% fee, auto-compound farming,
//           Jetton-native QSR transfers, reentrancy guard
// ═══════════════════════════════════════════════════════════════

// ─── Messages ───
message AddLiquidity { tonAmount: Int as coins; qsrAmount: Int as coins }
message RemoveLiquidity { lpAmount: Int as coins }
message SwapToTON { qsrAmount: Int as coins; minTonOut: Int as coins }
message SwapToQSR { tonAmount: Int as coins; minQsrOut: Int as coins }
message ClaimFarmRewards { }
message SetFarmEnabled { enabled: Bool }
message FundFarm { amount: Int as coins }
message SetFarmConfig { rewardPerSecond: Int as coins; startTime: Int as uint32; endTime: Int as uint32 }
message SetFeeBps { feeBps: Int as uint16 }
message SetPaused { paused: Bool }
message SetMaxTradeBps { maxTradeBps: Int as uint16 }
message DefiPayout { queryId: Int as uint64; amount: Int as coins; destination: Address }
message SweepTON { amount: Int as coins }
message RefundPendingQsr { }

// ─── Jetton Integration Messages ───
message(0x7bdd97de) BurnNotification { queryId: Int as uint64; amount: Int as coins; sender: Address; responseDestination: Address }
message(0x0f8a7ea5) TokenTransfer { queryId: Int as uint64; amount: Int as coins; destination: Address; responseDestination: Address; customPayload: Cell?; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }
message(0x595f07bc) TokenBurn { queryId: Int as uint64; amount: Int as coins; responseDestination: Address; customPayload: Cell? }
message(0x7362d09c) TokenNotification { queryId: Int as uint64; amount: Int as coins; from: Address; forwardPayload: Slice as remaining }
message(0x178d4519) InternalTransfer { queryId: Int as uint64; amount: Int as coins; from: Address; responseDestination: Address; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }
message(0x51a5c3d1) PoolPayout { queryId: Int as uint64; amount: Int as coins; destination: Address }
message(0x2c7e91a4) BuybackTon { queryId: Int as uint64; tonAmount: Int as coins; qsrSwapped: Int as coins }
message FeeTransfer { queryId: Int as uint64; amount: Int as coins; originalSender: Address; originalReceiver: Address }

// ─── Events ───
message EventLiquidityAdded { provider: Address; tonAmount: Int; qsrAmount: Int; lpMinted: Int }
message EventLiquidityRemoved { provider: Address; tonOut: Int; qsrOut: Int; lpBurned: Int }
message EventSwap { trader: Address; tonIn: Int; qsrIn: Int; tonOut: Int; qsrOut: Int; fee: Int }
message EventFarmReward { farmer: Address; amount: Int }
message EventFeeCollected { amount: Int }

// ─── Data Structures ───
struct LPInfo { totalSupply: Int; tonReserve: Int; qsrReserve: Int; }
struct FarmInfo { staked: Int; rewardPerSecond: Int; lastUpdate: Int; accRewardPerShare: Int; startTime: Int; endTime: Int }
struct UserFarmInfo { staked: Int; debt: Int; pending: Int }
struct SwapQuote { tonIn: Int; qsrIn: Int; tonOut: Int; qsrOut: Int; fee: Int; priceImpactBps: Int }
struct JettonWalletData { balance: Int; owner: Address; master: Address; walletCode: Cell }

// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi CONTRACT
// ═══════════════════════════════════════════════════════════════

contract QuasarDeFi with Deployable {
    
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
    }
    
    // ─── Reentrancy Guard ───
    fun _lock() { require(!self.locked, "Reentrant call"); self.locked = true }
    fun _unlock() { self.locked = false; }

    fun _requireActive() { require(!self.paused, "DeFi paused") }

    fun _sendQsr(to: Address, amount: Int, queryId: Int) {
        require(amount > 0, "Invalid QSR amount");
        let init: StateInit = initOf QuasarWallet(myAddress(), self.qsrMaster);
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: PoolPayout{
                queryId: queryId,
                amount: amount,
                destination: to,
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
        require(self.tonReserve > 0, "Empty TON reserve");
        let grossTonOut: Int = (qsrIn * self.tonReserve) / (self.qsrReserve);
        let fee: Int = (grossTonOut * self.feeBps) / 10000;
        let tonOut: Int = grossTonOut - fee;
        // CPMM math guarantees 0 < tonOut < tonReserve, so the swap always
        // succeeds whenever the pool holds any TON.
        self.qsrReserve = self.qsrReserve - qsrIn;
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
        self._sendQsr(sender(), pending!!, 0);
        self._unlock();
    }
    
    // ─── ADD LIQUIDITY ───
    receive(msg: AddLiquidity) {
        self._requireActive();
        self._lock();
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
            // First deposit: LP = sqrt(ton * qsr)
            lpToMint = self._sqrt(msg.tonAmount * msg.qsrAmount);
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
        
        // Update reserves
        self.tonReserve += tonUsed;
        self.qsrReserve += qsrUsed;
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
        
        // Emit event
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: EventLiquidityAdded{
                provider: sender(),
                tonAmount: tonUsed,
                qsrAmount: qsrUsed,
                lpMinted: lpToMint
            }.toCell(),
        });
        
        self._unlock();
    }
    
    // ─── REMOVE LIQUIDITY ───
    receive(msg: RemoveLiquidity) {
        self._requireActive();
        self._lock();
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
        self.lpBalances.set(sender(), current!! - msg.lpAmount);
        self.lpTotalSupply -= msg.lpAmount;
        self.tonReserve -= tonOut;
        self.qsrReserve -= qsrOut;
        
        // Send TON back
        if (tonOut > 0) {
            send(SendParameters{
                to: sender(),
                value: tonOut,
                mode: SendPayGasSeparately,
                body: emptyCell()
            });
        }
        
        if (qsrOut > 0) {
            self._sendQsr(sender(), qsrOut, 0);
        }
        
        // Emit event
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: EventLiquidityRemoved{
                provider: sender(),
                tonOut: tonOut,
                qsrOut: qsrOut,
                lpBurned: msg.lpAmount
            }.toCell(),
        });
        
        self._unlock();
    }
    
    // ─── SWAP QSR → TON (sell QSR) ───
    receive(msg: SwapToTON) {
        self._requireActive();
        self._lock();
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
        self.qsrReserve += msg.qsrAmount;
        self.tonReserve -= tonOut;
        self.feeAccumulatedTon += fee;
        self.pendingQsrDeposits.set(sender(), deposited!! - msg.qsrAmount);
        
        // Payout and event must be separate messages: with
        // SendRemainingValue the explicit value field is ignored, so the
        // trader could receive an unpredictable amount.
        send(SendParameters{
            to: sender(),
            value: tonOut,
            mode: SendPayGasSeparately,
            body: emptyCell()
        });

        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: EventSwap{
                trader: sender(),
                tonIn: 0,
                qsrIn: msg.qsrAmount,
                tonOut: tonOut,
                qsrOut: 0,
                fee: fee
            }.toCell(),
        });
        
        self._unlock();
    }
    
    // ─── SWAP TON → QSR (buy QSR) ───
    receive(msg: SwapToQSR) {
        self._requireActive();
        self._lock();
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
        self.tonReserve += msg.tonAmount;
        self.qsrReserve -= qsrOut;
        self.feeAccumulatedQsr += fee;
        
        // Refund any TON overpayment above the declared amount.
        let excess: Int = context().value - msg.tonAmount;
        if (excess > 0) {
            send(SendParameters{ to: sender(), value: excess, bounce: false, mode: SendPayGasSeparately, body: emptyCell() });
        }
        
        self._sendQsr(sender(), qsrOut, 0);
        
        // Emit event
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: EventSwap{
                trader: sender(),
                tonIn: msg.tonAmount,
                qsrIn: 0,
                tonOut: 0,
                qsrOut: qsrOut,
                fee: fee
            }.toCell(),
        });
        
        self._unlock();
    }
    
    // ─── CLAIM FARM REWARDS ───
    receive(msg: ClaimFarmRewards) {
        self._requireActive();
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
        self._sendQsr(sender(), totalReward, 0);
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendPayGasSeparately,
            body: EventFarmReward{ farmer: sender(), amount: totalReward }.toCell()
        });
    }
    
    // ─── ADMIN ───
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
        self.feeBps = msg.feeBps;
    }

    receive(msg: SetPaused) {
        require(sender() == self.owner, "Only owner");
        self.paused = msg.paused;
    }

    receive(msg: SetMaxTradeBps) {
        require(sender() == self.owner, "Only owner");
        require(msg.maxTradeBps >= 100 && msg.maxTradeBps <= 5000, "Trade limit 1%-50%");
        self.maxTradeBps = msg.maxTradeBps;
    }
    
    // Recover only TON that is not backing LP positions. The previous check
    // used the whole contract balance and allowed the owner to sweep
    // tonReserve, draining liquidity-provider funds.
    receive(msg: SweepTON) {
        require(sender() == self.owner, "Only owner");
        require(msg.amount > 0 && myBalance() >= self.tonReserve + msg.amount + ton("0.05"), "Invalid sweep");
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
}

// This is intentionally identical to the wallet in quasar.tact. Keeping the
// definition here lets the DeFi contract derive its own Jetton-wallet address
// with the same StateInit as the master and user wallets.
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

    // Restore tokens when a bounce rejects an outgoing transfer. This keeps
    // the wallet balance consistent with the Jetton ledger.
    bounced(msg: bounced<InternalTransfer>) {
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;
    }

    bounced(msg: bounced<FeeTransfer>) {
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
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: InternalTransfer{
                queryId: msg.queryId,
                amount: sendAmount,
                from: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: init.code,
            data: init.data
        });

        if (fee > 0) {
            // The fee message must carry gas: the master pays out referral and
            // treasury shares with SendRemainingValue, which would fail on an
            // empty incoming value.
            send(SendParameters{ to: self.master, value: ton("0.05"), bounce: true, mode: SendPayGasSeparately, body: FeeTransfer{ queryId: msg.queryId, amount: fee, originalSender: self.owner, originalReceiver: msg.destination }.toCell() });
        }
    }

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

    bounced(msg: bounced<BurnNotification>) {
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: (initOf QuasarWallet(self.owner, self.master)).code
        }
    }
}
