// ═══════════════════════════════════════════════════════════════
// QUASAR Master — fix pack v2 (H-1, M-1, M-2b, M-4, L-3, L-4, L-5)
// Применять к contracts/quasar.tact. Каждый блок помечен FIX <ID>.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// FIX H-1 — TriggerBuyback owner-auth
// Auth ПЕРЕД проверками состояния: неаутентифицированный вызов
// обязан падать с "Only owner" при любом состоянии пула.
// ─────────────────────────────────────────────────────────────
receive(msg: TriggerBuyback) {
    self._requireOwner();            // FIX H-1
    self._requireNotPaused();
    require(self.buybackEnabled, "Buyback off");
    require(self.buybackPool >= self.buybackThreshold, "Pool low");
    require(self.buybackSwapPending == 0, "Buyback pending");
    require(now() - self.lastBuybackTime >= self.buybackCooldown, "Cooldown");
    self._requireNonMintQueryId(msg.queryId);
    self.buybackQueries.set(msg.queryId, true);
    self._executeBuyback(msg.queryId);
}

// ─────────────────────────────────────────────────────────────
// FIX M-1 — refund необостребованных депозитов.
// Проводка kind 5 в PayoutFailed УЖЕ существует — этот receiver
// только открывает вход. Разрешён при паузе (деньги возвращаются
// владельцу депозита, как RefundPendingQsr в DeFi).
// Проверить отсутствие коллизий опкодов в docs/abi/*.json.
// ─────────────────────────────────────────────────────────────
message(0x51a5e001) RefundPendingDeposit { amount: Int as coins }
message(0x51a5e002) EventPendingDepositRefund { user: Address; amount: Int as coins; payoutId: Int as uint64 }

receive(msg: RefundPendingDeposit) {
    let pending: Int? = self.pendingQsrDeposits.get(sender());
    require(pending != null && pending!! > 0, "No pending deposit");
    require(msg.amount > 0 && msg.amount <= pending!!, "Amount exceeds pending deposit");
    self.pendingQsrDeposits.set(sender(), pending!! - msg.amount);
    self.custodyBalance = self.custodyBalance - msg.amount;
    self.payoutSeq = self.payoutSeq + 1;
    self.pendingMasterPayouts.set(self.payoutSeq, PendingPayout{
        user: sender(), amount: msg.amount, kind: 5, d1: 0, d2: 0, d3: 0
    });
    self._sendCustodiedTokens(sender(), msg.amount, 5, self.payoutSeq);
    emit(EventPendingDepositRefund{ user: sender(), amount: msg.amount, payoutId: self.payoutSeq }.toCell());
}

// ─────────────────────────────────────────────────────────────
// FIX M-2b — governance: вес голоса привязан к содержанию предложения.
// Заменить receive(msg: GovernanceVote) целиком.
// F-35 (govProposalExecuted) остаётся — replay proposalId закрыт,
// теперь закрыт и bait-and-switch: tally ведётся на хэше
// (proposalId, kind, flag, feeBps), голос — на хэше того же + voter.
// ─────────────────────────────────────────────────────────────
receive(msg: GovernanceVote) {
    require(now() <= msg.deadline, "Voting ended");
    require(msg.deadline >= now() + self.govMinVotingWindow, "Invalid deadline");
    require(self.govProposalExecuted.get(msg.proposalId) == null, "Proposal already executed");
    let staker: StakeInfo? = self.stakers.get(sender());
    require(staker != null && staker!!.amount >= self.govMinStake, "Below min stake");

    let content: Cell = beginCell()
        .storeUint(msg.proposalId, 32)
        .storeUint(msg.kind, 8)
        .storeUint(msg.flag ? 1 : 0, 1)
        .storeUint(msg.feeBps, 16)
        .endCell();
    let tallyHash: Int = content.hash();

    let voteKey: Cell = beginCell()
        .storeUint(msg.proposalId, 32)
        .storeUint(msg.kind, 8)
        .storeUint(msg.flag ? 1 : 0, 1)
        .storeUint(msg.feeBps, 16)
        .storeAddress(sender())
        .endCell();
    require(self.govVotes.get(voteKey) == null, "Already voted");
    self.govVotes.set(voteKey, true);

    let prevStake: Int = 0;
    let prevCell: Int? = self.govProposalStake.get(tallyHash);
    if (prevCell != null) { prevStake = prevCell!!; }
    let newStake: Int = prevStake + staker!!.amount;
    self.govProposalStake.set(tallyHash, newStake);

    if (newStake * 10000 >= self.totalStaked * self.govQuorumBps) {
        // Tally consumed per CONTENT key, so other content variants of the
        // same proposalId stay voteable but start from zero.
        self.govProposalStake.set(tallyHash, 0);
        self.govProposalExecuted.set(msg.proposalId, true);
        if (msg.kind == 1) {
            require(msg.feeBps == QUASAR_FEE_BPS, "Fee locked");
            self._logAiActionSilent("GovernanceFee", self.feeBps, msg.feeBps, msg.reason);
            self.feeBps = msg.feeBps;
        } else if (msg.kind == 2) {
            self.tradingEnabled = msg.flag;
            self._logAiActionSilent("GovernanceTrading", self.tradingEnabled ? 1 : 0, msg.flag ? 1 : 0, msg.reason);
        } else if (msg.kind == 3) {
            self.emergencyPause = msg.flag;
            self.tradingEnabled = !msg.flag;
            let id: Int = self._logAiAction("GovernancePause", self.emergencyPause ? 1 : 0, msg.flag ? 1 : 0, msg.reason);
            self.aiActionOldEmergencyPause.set(id, self.emergencyPause ? 1 : 0);
            self.aiActionOldTrading.set(id, self.tradingEnabled ? 1 : 0);
        }
        emit(EventGovernanceExecuted{ proposalId: msg.proposalId, kind: msg.kind, flag: msg.flag, stakeWeight: newStake }.toCell());
    }
}

// ─────────────────────────────────────────────────────────────
// FIX M-4a — пауза глушит исходящие ноги FeeTransfer, но не сам приём
// (иначе все переводы кошельков встанут: они ждут TransferConfirmed).
// В receive(msg: FeeTransfer) заменить хвост распределения:
// ─────────────────────────────────────────────────────────────
        // ...расчёт burnAmount/buybackPool/treasuryAmt/refReward как раньше...
        if (!self.emergencyPause) {   // FIX M-4a
            if (self.buybackEnabled && self.buybackSwapPending == 0 &&
                self.buybackPool >= self.buybackThreshold &&
                now() - self.lastBuybackTime >= self.buybackCooldown) {
                self._executeBuyback(msg.queryId);
            }
            if (treasuryAmt > 0) {
                self._sendTokens(self.treasuryAddress, treasuryAmt, 0);
            }
        }
        // burn-нога и учёт referral-обязательств работают в любом режиме.

// ─────────────────────────────────────────────────────────────
// FIX M-4b — вывод принципала жив при паузе (зеркало RemoveLiquidity в DeFi).
// В Unstake и ClaimVested УБРАТЬ self._requireNotPaused().
// Stake / ClaimRewards / ClaimReferralRewards остаются gated.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// FIX M-4c — переименование без смены опкода (интеграции не ломаются):
//   message(<прежний opcode>) ToggleMinting { enabled: Bool }
// В receiver'е и везде в тексте заменить ToggleTrading -> ToggleMinting.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// FIX L-4 — getter возвращает РЕАЛЬНЫЕ константы, а не write-only поля:
// ─────────────────────────────────────────────────────────────
get fun get_fee_config(): FeeConfig {
    return FeeConfig{
        feeBps: QUASAR_FEE_BPS,
        burnShare: self.feeBurnShare,
        maxTxBps: QUASAR_MAX_TX_BPS,
        maxWalletBps: QUASAR_MAX_WALLET_BPS,
        cooldownSeconds: QUASAR_TRANSFER_COOLDOWN
    };
}

// ─────────────────────────────────────────────────────────────
// FIX L-5 — в _restoreMasterPayout, ветка payoutKind == 3: НЕ перематывать
// lastClaim на прошлое. Вместо d1 ставим now(): bounce-возврат пула
// не должен заново начислять период, покрытый топ-апом.
// Заменить в ветке kind 3:
//   self.stakers.set(act.user, StakeInfo{
//       amount: info.amount, startTime: info.startTime,
//       lastClaim: now(),            // FIX L-5 (было: lastClaim = d1)
//       lockEnd: info.lockEnd });
// ─────────────────────────────────────────────────────────────
