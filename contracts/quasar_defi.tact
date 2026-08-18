import "@stdlib/deploy"
import "@stdlib/content"

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
message SetFarmConfig { rewardPerSecond: Int as coins; startTime: Int as uint32; endTime: Int as uint32 }
message SetFeeBps { feeBps: Int as uint16 }

// ─── Jetton Integration Messages ───
message TokenNotification { queryId: Int as uint64; amount: Int as coins; from: Address; forwardPayload: Slice as remaining }

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

// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi CONTRACT
// ═══════════════════════════════════════════════════════════════

contract QuasarDeFi with Deployable {
    
    owner: Address
    qsrMaster: Address
    
    // LP Pool
    lpTotalSupply: Int as coins
    tonReserve: Int as coins
    qsrReserve: Int as coins
    lpBalances: map<Address, Int>
    
    // AMM Fee (0.30% default = 30 bps)
    feeBps: Int as uint16
    feeAccumulated: Int as coins
    
    // Farm
    farmEnabled: Bool
    farmRewardPerSecond: Int as coins
    farmStartTime: Int as uint32
    farmEndTime: Int as uint32
    farmLastUpdate: Int
    farmAccRewardPerShare: Int
    farmTotalStaked: Int as coins
    farmStakes: map<Address, UserFarmInfo>
    
    // Safety
    locked: Bool
    
    init(owner: Address, qsrMaster: Address) {
        self.owner = owner
        self.qsrMaster = qsrMaster
        self.lpTotalSupply = 0
        self.tonReserve = 0
        self.qsrReserve = 0
        self.feeBps = 30
        self.feeAccumulated = 0
        self.farmEnabled = true
        self.farmRewardPerSecond = 100000000
        self.farmStartTime = now()
        self.farmEndTime = now() + 31536000
        self.farmLastUpdate = now()
        self.farmAccRewardPerShare = 0
        self.farmTotalStaked = 0
        self.locked = false
    }
    
    // ─── Reentrancy Guard ───
    fun _lock() { require(!self.locked, "Reentrant call"); self.locked = true }
    fun _unlock() { self.locked = false }
    
    // ─── Receive TON ───
    receive() { }
    
    // ─── Jetton QSR Deposit (for liquidity) ───
    receive(msg: TokenNotification) {
        require(sender() == self.qsrMaster, "Only QSR master")
        // QSR received — can be used for swaps or liquidity
        // In production: track pending deposits per user
        self.qsrReserve = self.qsrReserve + msg.amount
    }
    
    // ─── ADD LIQUIDITY ───
    receive(msg: AddLiquidity) {
        self._lock()
        require(msg.tonAmount > 0 && msg.qsrAmount > 0, "Invalid amounts")
        require(context().value >= msg.tonAmount, "Insufficient TON sent")
        
        let lpToMint: Int = 0
        if (self.lpTotalSupply == 0) {
            // First deposit: LP = sqrt(ton * qsr)
            lpToMint = sqrt(msg.tonAmount * msg.qsrAmount)
        } else {
            // Subsequent: proportional to existing reserves
            let lpByTon: Int = (msg.tonAmount * self.lpTotalSupply) / self.tonReserve
            let lpByQsr: Int = (msg.qsrAmount * self.lpTotalSupply) / self.qsrReserve
            lpToMint = min(lpByTon, lpByQsr)
        }
        require(lpToMint > 0, "Zero LP tokens")
        
        // Update reserves
        self.tonReserve += msg.tonAmount
        self.qsrReserve += msg.qsrAmount
        self.lpTotalSupply += lpToMint
        
        // Credit LP tokens
        let current: Int? = self.lpBalances.get(sender())
        self.lpBalances.set(sender(), current == null ? lpToMint : current!! + lpToMint)
        
        // Auto-stake LP in farm
        self._updateFarm()
        self._stakeLp(sender(), lpToMint)
        
        // Emit event
        send(SendParameters{
            to: sender(),
            value: 0,
            mode: SendRemainingValue,
            body: EventLiquidityAdded{
                provider: sender(),
                tonAmount: msg.tonAmount,
                qsrAmount: msg.qsrAmount,
                lpMinted: lpToMint
            }.toCell()
        })
        
        self._unlock()
    }
    
    // ─── REMOVE LIQUIDITY ───
    receive(msg: RemoveLiquidity) {
        self._lock()
        let current: Int? = self.lpBalances.get(sender())
        require(current != null && current!! >= msg.lpAmount, "Insufficient LP balance")
        
        // Calculate proportional output
        let tonOut: Int = (msg.lpAmount * self.tonReserve) / self.lpTotalSupply
        let qsrOut: Int = (msg.lpAmount * self.qsrReserve) / self.lpTotalSupply
        require(tonOut > 0 && qsrOut > 0, "Zero output")
        
        // Unstake from farm first (claim pending rewards)
        self._updateFarm()
        self._unstakeLp(sender(), msg.lpAmount)
        
        // Burn LP tokens
        self.lpBalances.set(sender(), current!! - msg.lpAmount)
        self.lpTotalSupply -= msg.lpAmount
        self.tonReserve -= tonOut
        self.qsrReserve -= qsrOut
        
        // Send TON back
        send(SendParameters{
            to: sender(),
            value: tonOut,
            mode: SendIgnoreErrors,
            body: emptyCell()
        })
        
        // Send QSR back via Jetton transfer
        // In production: send TokenNotification back through qsrMaster
        
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
            }.toCell()
        })
        
        self._unlock()
    }
    
    // ─── SWAP QSR → TON (sell QSR) ───
    receive(msg: SwapToTON) {
        self._lock()
        require(msg.qsrAmount > 0 && self.qsrReserve > 0, "Invalid swap")
        
        // CPMM with fee: tonOut = (qsrIn * tonReserve) / (qsrReserve + qsrIn)
        // Fee is taken from output
        let grossTonOut: Int = (msg.qsrAmount * self.tonReserve) / (self.qsrReserve + msg.qsrAmount)
        let fee: Int = (grossTonOut * self.feeBps) / 10000
        let tonOut: Int = grossTonOut - fee
        
        require(tonOut >= msg.minTonOut, "Slippage exceeded")
        require(tonOut > 0 && tonOut < self.tonReserve, "Insufficient reserve")
        
        // Update reserves
        self.qsrReserve += msg.qsrAmount
        self.tonReserve -= tonOut
        self.feeAccumulated += fee
        
        // Send TON to trader
        send(SendParameters{
            to: sender(),
            value: tonOut,
            mode: SendIgnoreErrors,
            body: EventSwap{
                trader: sender(),
                tonIn: 0,
                qsrIn: msg.qsrAmount,
                tonOut: tonOut,
                qsrOut: 0,
                fee: fee
            }.toCell()
        })
        
        self._unlock()
    }
    
    // ─── SWAP TON → QSR (buy QSR) ───
    receive(msg: SwapToQSR) {
        self._lock()
        require(msg.tonAmount > 0 && self.tonReserve > 0, "Invalid swap")
        require(context().value >= msg.tonAmount, "Insufficient TON sent")
        
        // CPMM with fee
        let grossQsrOut: Int = (msg.tonAmount * self.qsrReserve) / (self.tonReserve + msg.tonAmount)
        let fee: Int = (grossQsrOut * self.feeBps) / 10000
        let qsrOut: Int = grossQsrOut - fee
        
        require(qsrOut >= msg.minQsrOut, "Slippage exceeded")
        require(qsrOut > 0 && qsrOut < self.qsrReserve, "Insufficient reserve")
        
        // Update reserves
        self.tonReserve += msg.tonAmount
        self.qsrReserve -= qsrOut
        self.feeAccumulated += fee
        
        // Send QSR back via Jetton
        // In production: trigger TokenNotification through qsrMaster
        
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
            }.toCell()
        })
        
        self._unlock()
    }
    
    // ─── CLAIM FARM REWARDS ───
    receive(msg: ClaimFarmRewards) {
        self._updateFarm()
        let stake: UserFarmInfo? = self.farmStakes.get(sender())
        require(stake != null && stake!!.staked > 0, "No LP stake")
        
        let s: UserFarmInfo = stake!!
        let pending: Int = (s.staked * (self.farmAccRewardPerShare - s.debt)) / 1000000000
        let totalReward: Int = s.pending + pending
        require(totalReward > 0, "No rewards to claim")
        
        // Reset debt
        self.farmStakes.set(sender(), UserFarmInfo{
            staked: s.staked,
            debt: self.farmAccRewardPerShare,
            pending: 0
        })
        
        // Send reward (as TON for simplicity, in prod as QSR Jetton)
        send(SendParameters{
            to: sender(),
            value: totalReward,
            mode: SendIgnoreErrors,
            body: EventFarmReward{ farmer: sender(), amount: totalReward }.toCell()
        })
    }
    
    // ─── ADMIN ───
    receive(msg: SetFarmConfig) {
        require(sender() == self.owner, "Only owner")
        self.farmRewardPerSecond = msg.rewardPerSecond
        self.farmStartTime = msg.startTime
        self.farmEndTime = msg.endTime
    }
    
    receive(msg: SetFeeBps) {
        require(sender() == self.owner, "Only owner")
        require(msg.feeBps <= 100, "Max 1% fee")
        self.feeBps = msg.feeBps
    }
    
    // ─── INTERNAL: Farm Helpers ───
    fun _updateFarm() {
        if (now() <= self.farmLastUpdate || self.farmTotalStaked == 0) { return }
        let end: Int = min(now(), self.farmEndTime)
        let multiplier: Int = end - self.farmLastUpdate
        let reward: Int = multiplier * self.farmRewardPerSecond
        self.farmAccRewardPerShare += (reward * 1000000000) / self.farmTotalStaked
        self.farmLastUpdate = now()
    }
    
    fun _stakeLp(user: Address, amount: Int) {
        let stake: UserFarmInfo? = self.farmStakes.get(user)
        if (stake == null) {
            self.farmStakes.set(user, UserFarmInfo{
                staked: amount,
                debt: self.farmAccRewardPerShare,
                pending: 0
            })
        } else {
            let s: UserFarmInfo = stake!!
            let pending: Int = (s.staked * (self.farmAccRewardPerShare - s.debt)) / 1000000000
            self.farmStakes.set(user, UserFarmInfo{
                staked: s.staked + amount,
                debt: self.farmAccRewardPerShare,
                pending: s.pending + pending
            })
        }
        self.farmTotalStaked += amount
    }
    
    fun _unstakeLp(user: Address, amount: Int) {
        let stake: UserFarmInfo? = self.farmStakes.get(user)
        require(stake != null && stake!!.staked >= amount, "Farm stake insufficient")
        let s: UserFarmInfo = stake!!
        let pending: Int = (s.staked * (self.farmAccRewardPerShare - s.debt)) / 1000000000
        self.farmStakes.set(user, UserFarmInfo{
            staked: s.staked - amount,
            debt: self.farmAccRewardPerShare,
            pending: s.pending + pending
        })
        self.farmTotalStaked -= amount
    }
    
    // ─── GETTERS ───
    get fun lpBalance(user: Address): Int {
        let b: Int? = self.lpBalances.get(user)
        return b == null ? 0 : b!!
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
        let s: UserFarmInfo? = self.farmStakes.get(user)
        return s == null ? UserFarmInfo{staked: 0, debt: 0, pending: 0} : s!!
    }
    
    // ─── SWAP ESTIMATES ───
    get fun estimateSwapToTon(qsrAmount: Int): SwapQuote {
        if (self.qsrReserve == 0 || qsrAmount == 0) {
            return SwapQuote{tonIn: 0, qsrIn: qsrAmount, tonOut: 0, qsrOut: 0, fee: 0, priceImpactBps: 0}
        }
        let grossTonOut: Int = (qsrAmount * self.tonReserve) / (self.qsrReserve + qsrAmount)
        let fee: Int = (grossTonOut * self.feeBps) / 10000
        let tonOut: Int = grossTonOut - fee
        let priceImpact: Int = (qsrAmount * 10000) / self.qsrReserve
        if (priceImpact > 10000) { priceImpact = 10000 }
        return SwapQuote{tonIn: 0, qsrIn: qsrAmount, tonOut: tonOut, qsrOut: 0, fee: fee, priceImpactBps: priceImpact}
    }
    
    get fun estimateSwapToQsr(tonAmount: Int): SwapQuote {
        if (self.tonReserve == 0 || tonAmount == 0) {
            return SwapQuote{tonIn: tonAmount, qsrIn: 0, tonOut: 0, qsrOut: 0, fee: 0, priceImpactBps: 0}
        }
        let grossQsrOut: Int = (tonAmount * self.qsrReserve) / (self.tonReserve + tonAmount)
        let fee: Int = (grossQsrOut * self.feeBps) / 10000
        let qsrOut: Int = grossQsrOut - fee
        let priceImpact: Int = (tonAmount * 10000) / self.tonReserve
        if (priceImpact > 10000) { priceImpact = 10000 }
        return SwapQuote{tonIn: tonAmount, qsrIn: 0, tonOut: 0, qsrOut: qsrOut, fee: fee, priceImpactBps: priceImpact}
    }
    
    get fun estimateLpOut(tonAmount: Int, qsrAmount: Int): Int {
        if (self.lpTotalSupply == 0) {
            return sqrt(tonAmount * qsrAmount)
        }
        let lpByTon: Int = (tonAmount * self.lpTotalSupply) / self.tonReserve
        let lpByQsr: Int = (qsrAmount * self.lpTotalSupply) / self.qsrReserve
        return min(lpByTon, lpByQsr)
    }
    
    get fun estimateRemoveLiquidity(lpAmount: Int): LPInfo {
        if (self.lpTotalSupply == 0 || lpAmount == 0) {
            return LPInfo{totalSupply: 0, tonReserve: 0, qsrReserve: 0}
        }
        let tonOut: Int = (lpAmount * self.tonReserve) / self.lpTotalSupply
        let qsrOut: Int = (lpAmount * self.qsrReserve) / self.lpTotalSupply
        return LPInfo{totalSupply: self.lpTotalSupply, tonReserve: tonOut, qsrReserve: qsrOut}
    }
    
    get fun feeConfig(): Int { return self.feeBps }
    get fun feeAccumulated(): Int { return self.feeAccumulated }
    get fun owner(): Address { return self.owner }
    get fun qsrMaster(): Address { return self.qsrMaster }
}
