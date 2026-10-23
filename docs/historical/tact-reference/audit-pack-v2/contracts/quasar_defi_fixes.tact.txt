// ═══════════════════════════════════════════════════════════════
// QUASAR DeFi — fix pack v2 (M-3, L-1, L-7)
// Применять к contracts/quasar_defi.tact. Блоки помечены FIX <ID>.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// FIX M-3 — bounce-safe ClaimFarmRewards.
// Проблема: долг фермера обнулялся до подтверждения доставки; bounce
// возвращал токены только в farmRewardReserve, пользователь терял награду.
// Решение: pending-запись выплаты, которая снимается подтверждением
// (TokenExcesses от нашего кошелька) и восстанавливает долг при bounce.
//
// State: добавить
//   pendingFarmPayouts: map<Int, FarmPayout>;   // payoutSeq -> {user, amount}
// struct FarmPayout { user: Address; amount: Int as coins; }
// ─────────────────────────────────────────────────────────────

struct FarmPayout { user: Address; amount: Int as coins }
message EventFarmRewardPayout { user: Address; amount: Int as coins; payoutId: Int as uint64 }

receive(msg: ClaimFarmRewards) {
    require(self.farmRewardPerSecond > 0, "Farm empty");
    self._updateFarm();
    let s: UserFarmInfo? = self.farmStakes.get(sender());
    require(s != null && s!!.staked > 0, "No farm stake");

    let newReward: Int = s!!.staked * (self.farmAccRewardPerShare - s!!.debt) / DECIMALS;
    let totalReward: Int = s!!.pending + newReward;
    require(totalReward > 0, "No rewards");

    // Долг НЕ трогаем до подтверждения доставки — только отмечаем точку отсчёта.
    self.farmStakes.set(sender(), UserFarmInfo{
        staked: s!!.staked,
        debt: self.farmAccRewardPerShare,
        pending: 0
    });

    self.payoutSeq = self.payoutSeq + 1;
    self.pendingFarmPayouts.set(self.payoutSeq, FarmPayout{ user: sender(), amount: totalReward });
    self._sendQsr(sender(), totalReward, 2, self.payoutSeq);   // kind 2
    emit(EventFarmRewardPayout{ user: sender(), amount: totalReward, payoutId: self.payoutSeq }.toCell());
}

// В обработчике подтверждения выплаты нашего кошелька (TokenExcesses /
// excesses-путь, откуда уже чистится pendingTonPayouts) добавить:
//   let farm: FarmPayout? = self.pendingFarmPayouts.get(msg.payoutId);
//   if (farm != null) { self.pendingFarmPayouts.set(msg.payoutId, null); }

// В receive(msg: PayoutFailed) ветка kind == 2 теперь:
if (msg.kind == 2) {
    self.farmRewardReserve = self.farmRewardReserve + msg.amount;
    let farm: FarmPayout? = self.pendingFarmPayouts.get(msg.payoutId);
    if (farm != null) {
        // FIX M-3: вернуть долг конкретному фермеру, а не только в резерв.
        self.pendingFarmPayouts.set(msg.payoutId, null);
        let s: UserFarmInfo? = self.farmStakes.get(farm!!.user);
        if (s != null) {
            self.farmStakes.set(farm!!.user, UserFarmInfo{
                staked: s!!.staked, debt: s!!.debt, pending: s!!.pending + farm!!.amount
            });
        }
    }
}

// ─────────────────────────────────────────────────────────────
// FIX L-1 — байбэк tombstone: помним ДВЕ последние ноги, чтобы bounce
// старой ноги после подмены tombstone не сжигал восстановление.
// State: добавить
//   prevBuybackQueryId: Int as uint64;
//   prevBuybackTonRestore: Int as coins;
//   prevBuybackFeeRestore: Int as coins;
//   prevBuybackActive: Bool;
// ─────────────────────────────────────────────────────────────

// В receive TokenNotification, ветка байбэк-маркера (перед перезаписью):
self.prevBuybackQueryId = self.pendingBuybackQueryId;
self.prevBuybackTonRestore = self.pendingBuybackTonRestore;
self.prevBuybackFeeRestore = self.pendingBuybackFeeRestore;
self.prevBuybackActive = self.pendingBuybackActive;
// ... затем штатная перезапись pendingBuyback* новой ногой ...

// bounced<BuybackTon>: вместо require на совпадение queryId — маршрутизация:
bounced(msg: bounced<BuybackTon>) {
    if (msg.queryId == self.pendingBuybackQueryId && self.pendingBuybackActive) {
        self.tonReserve = self.tonReserve + self.pendingBuybackTonRestore;
        self.feeAccumulatedTon = self.feeAccumulatedTon + self.pendingBuybackFeeRestore;
        self.pendingBuybackActive = false;
    } else if (msg.queryId == self.prevBuybackQueryId && self.prevBuybackActive) {
        // FIX L-1: bounce предыдущей ноги, прилетевший после подмены tombstone.
        self.tonReserve = self.tonReserve + self.prevBuybackTonRestore;
        self.feeAccumulatedTon = self.feeAccumulatedTon + self.prevBuybackFeeRestore;
        self.prevBuybackActive = false;
    } else {
        // Неизвестная нога: не revert'им (иначе теряется value и десинхрон),
        // фиксируем в событии для разбора.
        emit(EventBuybackBounceUnknown{ queryId: msg.queryId }.toCell());
    }
}
message EventBuybackBounceUnknown { queryId: Int as uint64 }

// ─────────────────────────────────────────────────────────────
// FIX L-7 — getter не падает при нулевых резервах:
// ─────────────────────────────────────────────────────────────
get fun estimateLpOut(tonAmount: Int, qsrAmount: Int): Int {
    if (self.lpTotalSupply == 0) { return 0 }
    if (self.tonReserve == 0 || self.qsrReserve == 0) { return 0 }   // FIX L-7
    let lpByTon: Int = tonAmount * self.lpTotalSupply / self.tonReserve;
    let lpByQsr: Int = qsrAmount * self.lpTotalSupply / self.qsrReserve;
    return lpByTon < lpByQsr ? lpByTon : lpByQsr;
}
