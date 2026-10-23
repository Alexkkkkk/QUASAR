// QUASAR administrative timelock message ABI.
struct (0x4b204782) QueueAdminCall {
    callId: uint64
    target: address
    value: coins
    body: cell
}

struct (0x966c9266) ExecuteAdminCall {
    callId: uint64
}

struct (0x9278deba) CancelAdminCall {
    callId: uint64
}

struct (0x0f626919) ProposeAdmin {
    newAdmin: address
}

struct (0x5fd2daef) AcceptAdmin {}

struct (0x1e7799cf) CancelAdminTransfer {}

// Deploy is emitted by the standard Deployable flow and is part of the input ABI.
struct (0x946a98b6) Deploy {
    queryId: uint64
}

// Deployable acknowledges a deployment with this standard response.
struct (0xaff90f57) DeployOk {
    queryId: uint64
}

// Versioned Tolk state, not a decoder for deployed Tact storage.
// Pending calls use an int257-keyed dictionary of referenced cells.
struct PendingAdminCall {
    target: address
    value: coins
    body: cell
    executeAt: uint32
}

@overflow1023_policy("suppress")
struct QuasarAdminTimelockStorage {
    admin: address
    pendingAdmin: address
    adminTransferAt: uint32
    adminTransferDelay: uint32
    minDelay: uint32
    lastQueuedCallId: uint64
    master: address
    defi: address
    pendingCalls: map<int257, Cell<PendingAdminCall>>
}

fun QuasarAdminTimelockStorage.packToBuilder(self, mutate root: builder) {
    // Four addresses plus scalar fields cannot fit in a single 1023-bit cell.
    val targets = beginCell()
        .storeAddress(self.master)
        .storeAddress(self.defi)
        .storeDict(self.pendingCalls.toLowLevelDict())
        .endCell();
    root.storeAddress(self.admin);
    root.storeAddress(self.pendingAdmin);
    root.storeUint(self.adminTransferAt, 32);
    root.storeUint(self.adminTransferDelay, 32);
    root.storeUint(self.minDelay, 32);
    root.storeUint(self.lastQueuedCallId, 64);
    root.storeRef(targets);
}

fun QuasarAdminTimelockStorage.unpackFromSlice(mutate root: slice): QuasarAdminTimelockStorage {
    val admin = root.loadAddress();
    val pendingAdmin = root.loadAddress();
    val adminTransferAt = root.loadUint(32) as uint32;
    val adminTransferDelay = root.loadUint(32) as uint32;
    val minDelay = root.loadUint(32) as uint32;
    val lastQueuedCallId = root.loadUint(64) as uint64;
    var targets = root.loadRef().beginParse();
    val master = targets.loadAddress();
    val defi = targets.loadAddress();
    val pendingCalls = createMapFromLowLevelDict<int257, Cell<PendingAdminCall>>(
        targets.loadDict(),
    );
    targets.assertEnd();
    root.assertEnd();
    return {
        admin,
        pendingAdmin,
        adminTransferAt,
        adminTransferDelay,
        minDelay,
        lastQueuedCallId,
        master,
        defi,
        pendingCalls,
    };
}

fun QuasarAdminTimelockStorage.load(): QuasarAdminTimelockStorage {
    return QuasarAdminTimelockStorage.fromCell(contract.getData());
}

fun QuasarAdminTimelockStorage.save(self) {
    contract.setData(self.toCell());
}

type AllowedMessageToQuasarAdminTimelock =
    | QueueAdminCall
    | ExecuteAdminCall
    | CancelAdminCall
    | ProposeAdmin
    | CancelAdminTransfer
    | AcceptAdmin
    | Deploy

const ZERO_ADDRESS: address = address("0:0000000000000000000000000000000000000000000000000000000000000000")
const QUASAR_STORAGE_RESERVE: coins = grams("0.05")
const ADMIN_TRANSFER_DELAY: uint32 = 172800

fun zeroAddress(): address {
    return address.fromWorkchainAndHash(BASECHAIN, 0);
}

fun validateTimelockStorage(storage: QuasarAdminTimelockStorage) {
    // These are constructor invariants in the former implementation. Keep them
    // in executable code because Tolk StateInit data is built explicitly.
    assert (storage.admin != zeroAddress()) throw 45350;
    assert (storage.master != zeroAddress()) throw 45351;
    assert (storage.minDelay >= 86400) throw 45353;
}

fun newQuasarAdminTimelockStorage(
    admin: address,
    master: address,
    defi: address,
    minDelay: uint32,
): QuasarAdminTimelockStorage {
    val storage = QuasarAdminTimelockStorage {
        admin,
        pendingAdmin: zeroAddress(),
        adminTransferAt: 0,
        adminTransferDelay: ADMIN_TRANSFER_DELAY,
        minDelay,
        lastQueuedCallId: 0,
        master,
        defi,
        pendingCalls: [],
    };
    validateTimelockStorage(storage);
    return storage;
}

fun requireAdmin(storage: QuasarAdminTimelockStorage, senderAddress: address) {
    assert (senderAddress == storage.admin) throw 45352;
}

fun requireManagedTarget(storage: QuasarAdminTimelockStorage, target: address) {
    assert (
        target == storage.master || (storage.defi != zeroAddress() && target == storage.defi)
    ) throw 42797;
}

fun lookupPendingCall(
    pendingCalls: map<int257, Cell<PendingAdminCall>>,
    callId: int,
): PendingAdminCall? {
    val pendingCell = pendingCalls.get(callId as int257);
    if (!pendingCell.isFound) {
        return null;
    }
    return PendingAdminCall.fromCell(pendingCell.loadValue());
}

fun sendDeployOk(senderAddress: address, valueCoins: coins, queryId: uint64) {
    val body = DeployOk { queryId };
    val balanceBeforeMessage = contract.getOriginalBalance() - valueCoins;
    if (balanceBeforeMessage < QUASAR_STORAGE_RESERVE) {
        // Keep the 0.05 TON rent reserve before carrying the remaining balance.
        reserveGramsOnBalance(QUASAR_STORAGE_RESERVE, RESERVE_MODE_EXACT_AMOUNT);
        val reply = createMessage({
            bounce: BounceMode.NoBounce,
            dest: senderAddress,
            value: 0,
            body,
        });
        // SAFETY: the exact rent reserve is already locked above; this is the
        // Deployable acknowledgement path and failure cannot alter state.
        reply.send(SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_IGNORE_ERRORS);
        return;
    }

    val reply = createMessage({
        bounce: BounceMode.NoBounce,
        dest: senderAddress,
        value: 0,
        body,
    });
    reply.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS);
}

contract QuasarAdminTimelock {
    author: "QUASAR"
    version: "1.0.0"
    description: "QUASAR administrative timelock"
    storage: QuasarAdminTimelockStorage
    incomingMessages: AllowedMessageToQuasarAdminTimelock
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessageToQuasarAdminTimelock.fromSlice(in.body);
    // A StateInit can be attached to any first internal message, not only Deploy.
    // Validate before dispatch so an invalid zero-admin/short-delay instance is inert.
    validateTimelockStorage(QuasarAdminTimelockStorage.load());
    match (msg) {
        QueueAdminCall => {
            var storage = QuasarAdminTimelockStorage.load();
            requireAdmin(storage, in.senderAddress);
            requireManagedTarget(storage, msg.target);
            assert (msg.callId > storage.lastQueuedCallId) throw 36252;

            storage.lastQueuedCallId = msg.callId;
            storage
                .pendingCalls
                .set(
                    msg.callId as int257,
                    PendingAdminCall {
                        target: msg.target,
                        value: msg.value,
                        body: msg.body,
                        executeAt: blockchain.now() + storage.minDelay,
                    }.toCell(),
                );
            storage.save();
        }

        ExecuteAdminCall => {
            var storage = QuasarAdminTimelockStorage.load();
            val pending = lookupPendingCall(storage.pendingCalls, msg.callId);
            assert (pending != null) throw 45026;
            assert (blockchain.now() >= pending.executeAt) throw 28248;

            // Delete and persist before creating the outbound action. A bounce or
            // re-entrant path therefore cannot execute the same call twice.
            storage.pendingCalls.delete(msg.callId as int257);
            storage.save();

            val call = pending;
            val outbound = createMessage({
                dest: call.target,
                value: call.value,
                bounce: BounceMode.Only256BitsOfBody,
                body: call.body,
            });
            outbound.send(SEND_MODE_PAY_FEES_SEPARATELY);
        }

        CancelAdminCall => {
            var storage = QuasarAdminTimelockStorage.load();
            requireAdmin(storage, in.senderAddress);
            assert (lookupPendingCall(storage.pendingCalls, msg.callId) != null) throw 45026;
            storage.pendingCalls.delete(msg.callId as int257);
            storage.save();
        }

        ProposeAdmin => {
            var storage = QuasarAdminTimelockStorage.load();
            requireAdmin(storage, in.senderAddress);
            assert (msg.newAdmin != zeroAddress()) throw 29685;
            storage.pendingAdmin = msg.newAdmin;
            storage.adminTransferAt = (blockchain.now() + storage.adminTransferDelay) as uint32;
            storage.save();
        }

        CancelAdminTransfer => {
            var storage = QuasarAdminTimelockStorage.load();
            requireAdmin(storage, in.senderAddress);
            storage.pendingAdmin = zeroAddress();
            storage.adminTransferAt = 0;
            storage.save();
        }

        AcceptAdmin => {
            var storage = QuasarAdminTimelockStorage.load();
            assert (in.senderAddress == storage.pendingAdmin) throw 54840;
            assert (blockchain.now() >= storage.adminTransferAt) throw 51627;
            storage.admin = storage.pendingAdmin;
            storage.pendingAdmin = zeroAddress();
            storage.adminTransferAt = 0;
            storage.save();
        }

        Deploy => {
            sendDeployOk(in.senderAddress, in.valueCoins, msg.queryId);
        }

        else => throw 130,
    }
}

get fun get_master(): address {
    return QuasarAdminTimelockStorage.load().master;
}

get fun get_defi(): address {
    return QuasarAdminTimelockStorage.load().defi;
}

get fun get_admin(): address {
    return QuasarAdminTimelockStorage.load().admin;
}

get fun get_pending_admin(): address {
    return QuasarAdminTimelockStorage.load().pendingAdmin;
}

get fun get_admin_transfer_at(): int {
    return QuasarAdminTimelockStorage.load().adminTransferAt;
}

get fun get_min_delay(): int {
    return QuasarAdminTimelockStorage.load().minDelay;
}

get fun get_last_queued_call_id(): int {
    return QuasarAdminTimelockStorage.load().lastQueuedCallId;
}

get fun get_pending_call(callId: int): PendingAdminCall? {
    return lookupPendingCall(QuasarAdminTimelockStorage.load().pendingCalls, callId);
}
