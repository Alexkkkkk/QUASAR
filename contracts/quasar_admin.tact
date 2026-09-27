import "@stdlib/deploy";

// QUASAR administrative timelock.
//
// The admin is expected to be an external TON multisig (for example a 2-of-N
// Safe). This contract deliberately does not implement signature aggregation:
// the multisig remains the signer policy, while this contract supplies the
// on-chain delay, target allow-list, replay protection, and cancellation path.
message QueueAdminCall {
    callId: Int as uint64;
    target: Address;
    value: Int as coins;
    body: Cell;
}
message ExecuteAdminCall { callId: Int as uint64 }
message CancelAdminCall { callId: Int as uint64 }
message ProposeAdmin { newAdmin: Address }
message AcceptAdmin { }
message CancelAdminTransfer { }

struct PendingAdminCall {
    target: Address;
    value: Int;
    body: Cell;
    executeAt: Int;
}

contract QuasarAdminTimelock with Deployable {
    admin: Address;
    pendingAdmin: Address;
    adminTransferAt: Int as uint32;
    adminTransferDelay: Int as uint32;
    minDelay: Int as uint32;
    lastQueuedCallId: Int as uint64;
    master: Address;
    defi: Address;
    pendingCalls: map<Int, PendingAdminCall>;

    init(admin: Address, master: Address, defi: Address, minDelay: Int as uint32) {
        require(admin != newAddress(0, 0), "Invalid admin");
        require(master != newAddress(0, 0), "Invalid master");
        require(minDelay >= 86400, "Delay too short");
        self.admin = admin;
        self.pendingAdmin = newAddress(0, 0);
        self.adminTransferAt = 0;
        self.adminTransferDelay = 172800;
        self.minDelay = minDelay;
        self.lastQueuedCallId = 0;
        self.master = master;
        self.defi = defi;
    }

    fun _requireAdmin() {
        require(sender() == self.admin, "Only timelock admin");
    }

    fun _requireManagedTarget(target: Address) {
        require(
            target == self.master ||
            (self.defi != newAddress(0, 0) && target == self.defi),
            "Target not managed"
        );
    }

    receive(msg: QueueAdminCall) {
        self._requireAdmin();
        self._requireManagedTarget(msg.target);
        require(msg.callId > self.lastQueuedCallId, "Call id must increase");
        self.lastQueuedCallId = msg.callId;
        self.pendingCalls.set(msg.callId, PendingAdminCall{
            target: msg.target,
            value: msg.value,
            body: msg.body,
            executeAt: now() + self.minDelay
        });
    }

    receive(msg: ExecuteAdminCall) {
        let pending: PendingAdminCall? = self.pendingCalls.get(msg.callId);
        require(pending != null, "Unknown admin call");
        require(now() >= pending!!.executeAt, "Timelock active");

        // Delete before sending so a bounced or re-entrant execution cannot
        // run the same queued call twice.
        self.pendingCalls.set(msg.callId, null);
        send(SendParameters{
            to: pending!!.target,
            value: pending!!.value,
            bounce: true,
            mode: SendPayGasSeparately,
            body: pending!!.body
        });
    }

    receive(msg: CancelAdminCall) {
        self._requireAdmin();
        require(self.pendingCalls.get(msg.callId) != null, "Unknown admin call");
        self.pendingCalls.set(msg.callId, null);
    }

    receive(msg: ProposeAdmin) {
        self._requireAdmin();
        require(msg.newAdmin != newAddress(0, 0), "Invalid admin");
        self.pendingAdmin = msg.newAdmin;
        self.adminTransferAt = now() + self.adminTransferDelay;
    }

    receive(msg: CancelAdminTransfer) {
        self._requireAdmin();
        self.pendingAdmin = newAddress(0, 0);
        self.adminTransferAt = 0;
    }

    receive(msg: AcceptAdmin) {
        require(sender() == self.pendingAdmin, "Not pending admin");
        require(now() >= self.adminTransferAt, "Admin timelock active");
        self.admin = self.pendingAdmin;
        self.pendingAdmin = newAddress(0, 0);
        self.adminTransferAt = 0;
    }

    get fun get_admin(): Address { return self.admin }
    get fun get_pending_admin(): Address { return self.pendingAdmin }
    get fun get_admin_transfer_at(): Int { return self.adminTransferAt }
    get fun get_min_delay(): Int { return self.minDelay }
    get fun get_last_queued_call_id(): Int { return self.lastQueuedCallId }
    get fun get_pending_call(callId: Int): PendingAdminCall? {
        return self.pendingCalls.get(callId)
    }
}