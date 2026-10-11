// ═══════════════════════════════════════════════════════════════
// QUASAR Wallet (quasar_common.tact) — fix pack v2 (L-2, L-3, L-8)
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// FIX L-2 — разделение пространств queryId пользовательских трансферов
// и пуловых выплат. Сейчас bounced<InternalTransfer> сначала проверяет
// pendingPoolPayouts: пользовательский трансфер с queryId, совпавшим с
// seq пуловой выплаты (окно ~1 транзакция), при bounce обрабатывался бы
// как пуловый — пользователь терял fee и residual.
//
// Решение: пуловая выплата получает marker-бит; bounce маршрутизируется
// по биту, коллизия исключена конструктивно.
// ─────────────────────────────────────────────────────────────

const QUASAR_POOL_PAYOUT_MARKER: Int = 1 << 63;   // uint64, высший бит

// В receive(msg: PoolPayout) заменить формирование InternalTransfer:
//   let transferQueryId: Int = msg.queryId + QUASAR_POOL_PAYOUT_MARKER;  // FIX L-2
// и передать transferQueryId в InternalTransfer (вместо msg.queryId).

// bounced<InternalTransfer> — маршрутизация по marker:
bounced(msg: bounced<InternalTransfer>) {
    if (msg.queryId >= QUASAR_POOL_PAYOUT_MARKER) {
        // Пуловая выплата (kind из pendingPoolPayouts).
        let localId: Int = msg.queryId - QUASAR_POOL_PAYOUT_MARKER;
        let pool: PendingPoolPayout? = self.pendingPoolPayouts.get(localId);
        require(pool != null, "Unknown pool payout");
        self.balance = self.balance + pool!!.amount;
        self.pendingPoolPayouts.set(localId, null);
        send(SendParameters{ /* PayoutFailed owner'у как раньше */ });
    } else {
        // Пользовательский трансфер: обязан существовать в pendingResponseFees.
        let fee: Int? = self.pendingResponseFees.get(msg.queryId);
        require(fee != null, "Unknown transfer");
        self.balance = self.balance + msg.amount + fee!!;
        self.pendingResponseFees.set(msg.queryId, null);
        self.pendingResponseReceivers.set(msg.queryId, null);
        send(SendParameters{ /* excesses на responseDestination как раньше */ });
    }
}

// ─────────────────────────────────────────────────────────────
// FIX L-3 — residual не уходит на нулевой адрес: при
// msg.responseDestination == addr_none излишек остаётся в кошельке
// (расходуется на gas будущих транзакций владельца).
// В receive(msg: TokenTransfer), блок residual:
// ─────────────────────────────────────────────────────────────
        if (msg.responseDestination != newAddress(0, 0)) {   // FIX L-3
            send(SendParameters{
                to: msg.responseDestination,
                value: residual,
                mode: SendRemainingValue | SendIgnoreErrors,
                body: TokenExcesses{ queryId: msg.queryId }.toCell()
            });
        }
        // else: излишек остаётся в кошельке — не сжигаем TON.

// ─────────────────────────────────────────────────────────────
// FIX L-8 — документация (код не меняется): требование
// myBalance() >= 0.075 TON для TokenTransfer зафиксировать в
// minter-dapp UI: при балансе кошелька ниже порога вывод невозможен
// даже с приложенным газом — показывать предупреждение и top-up.
// ─────────────────────────────────────────────────────────────
