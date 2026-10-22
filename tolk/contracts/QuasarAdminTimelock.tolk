import "@stdlib/gas-payments"
import "@stdlib/tvm-dicts"

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

// This layout intentionally mirrors QuasarAdminTimelock in quasar_admin.tact.
// `value` and `executeAt` are int257, while the explicitly sized fields retain
// their uint32/uint64 widths. The pending-call dictionary is an int257-keyed
// dictionary whose values are references to PendingAdminCall cells.
struct PendingAdminCall {
    target: address
    value: int
    body: cell
    executeAt: int
}

struct QuasarAdminTimelockStorage {
    admin: address
    pendingAdmin: address
    adminTransferAt: uint32
    adminTransferDelay: uint32
    minDelay: uint32
    lastQueuedCallId: uint64
    master: address
    defi: address
    pendingCalls: dict
}

fun QuasarAdminTimelockStorage.load(): QuasarAdminTimelockStorage {
    return QuasarAdminTimelockStorage.fromCell(contract.getData())
}

fun QuasarAdminTimelockStorage.save(self) {
    contract.setData(self.toCell())
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
const PENDING_CALL_KEY_BITS = 257

fun zeroAddress(): address {
    return address.fromWorkchainAndHash(BASECHAIN, 0)
}

fun requireAdmin(storage: QuasarAdminTimelockStorage, senderAddress: address) {
    assert (senderAddress == storage.admin) throw 45352
}

fun requireManagedTarget(storage: QuasarAdminTimelockStorage, target: address) {
    assert (
        target == storage.master ||
        (storage.defi != zeroAddress() && target == storage.defi)
    ) throw 42797
}

fun lookupPendingCall(pendingCalls: dict, callId: int): PendingAdminCall? {
    val pendingCell = pendingCalls.iDictGetRefOrNull(PENDING_CALL_KEY_BITS, callId)
    if (pendingCell == null) {
        return null
    }
    return PendingAdminCall.fromCell(pendingCell!!)
}

fun sendDeployOk(in: InMessage, queryId: uint64) {
    val body = DeployOk { queryId }
    val balanceBeforeMessage = contract.getOriginalBalance() - in.valueCoins
    if (balanceBeforeMessage < QUASAR_STORAGE_RESERVE) {
        // Keep the 0.05 TON rent reserve before carrying the remaining balance.
        reserveGramsOnBalance(QUASAR_STORAGE_RESERVE, RESERVE_MODE_EXACT_AMOUNT)
        val reply = createMessage({
            bounce: BounceMode.NoBounce,
            dest: in.senderAddress,
            value: 0,
            body,
        })
        reply.send(SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_IGNORE_ERRORS)
        return
    }

    val reply = createMessage({
        bounce: BounceMode.NoBounce,
        dest: in.senderAddress,
        value: 0,
        body,
    })
    reply.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS)
}

contract QuasarAdminTimelock {
    author: "QUASAR"
    version: "1.0.0"
    description: "QUASAR administrative timelock"
    storage: QuasarAdminTimelockStorage
    incomingMessages: AllowedMessageToQuasarAdminTimelock
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessageToQuasarAdminTimelock.fromSlice(in.body)
    match (msg) {
        QueueAdminCall => {
            var storage = lazy QuasarAdminTimelockStorage.load()
            requireAdmin(storage, in.senderAddress)
            requireManagedTarget(storage, msg.target)
            assert (msg.callId > storage.lastQueuedCallId) throw 36252

            storage.lastQueuedCallId = msg.callId
            storage.pendingCalls.iDictSetRef(
                PENDING_CALL_KEY_BITS,
                msg.callId,
                PendingAdminCall {
                    target: msg.target,
                    value: msg.value,
                    body: msg.body,
                    executeAt: blockchain.now() + storage.minDelay,
                }.toCell(),
            )
            storage.save()
        }

        ExecuteAdminCall => {
            var storage = lazy QuasarAdminTimelockStorage.load()
            val pending = lookupPendingCall(storage.pendingCalls, msg.callId)
            assert (pending != null) throw 45026
            assert (blockchain.now() >= pending!!.executeAt) throw 28248

            // Delete and persist before creating the outbound action. A bounce or
            // re-entrant path therefore cannot execute the same call twice.
            storage.pendingCalls.iDictDelete(PENDING_CALL_KEY_BITS, msg.callId)
            storage.save()

            val call = pending!!
            val outbound = createMessage({
                to: call.target,
                value: call.value,
                bounce: BounceMode.Only256BitsOfBody,
                body: call.body,
            })
            outbound.send(SEND_MODE_PAY_FEES_SEPARATELY)
        }

        CancelAdminCall => {
            var storage = lazy QuasarAdminTimelockStorage.load()
            requireAdmin(storage, in.senderAddress)
            assert (lookupPendingCall(storage.pendingCalls, msg.callId) != null) throw 45026
            storage.pendingCalls.iDictDelete(PENDING_CALL_KEY_BITS, msg.callId)
            storage.save()
        }

        ProposeAdmin => {
            var storage = lazy QuasarAdminTimelockStorage.load()
            requireAdmin(storage, in.senderAddress)
            assert (msg.newAdmin != zeroAddress()) throw 29685
            storage.pendingAdmin = msg.newAdmin
            storage.adminTransferAt = (blockchain.now() + storage.adminTransferDelay) as uint32
            storage.save()
        }

        CancelAdminTransfer => {
            var storage = lazy QuasarAdminTimelockStorage.load()
            requireAdmin(storage, in.senderAddress)
            storage.pendingAdmin = zeroAddress()
            storage.adminTransferAt = 0
            storage.save()
        }

        AcceptAdmin => {
            var storage = lazy QuasarAdminTimelockStorage.load()
            assert (in.senderAddress == storage.pendingAdmin) throw 54840
            assert (blockchain.now() >= storage.adminTransferAt) throw 51627
            storage.admin = storage.pendingAdmin
            storage.pendingAdmin = zeroAddress()
            storage.adminTransferAt = 0
            storage.save()
        }

        Deploy => {
            sendDeployOk(in, msg.queryId)
        }

        else => throw 130
    }
}

get fun get_master(): address {
    return QuasarAdminTimelockStorage.load().master
}

get fun get_defi(): address {
    return QuasarAdminTimelockStorage.load().defi
}

get fun get_admin(): address {
    return QuasarAdminTimelockStorage.load().admin
}

get fun get_pending_admin(): address {
    return QuasarAdminTimelockStorage.load().pendingAdmin
}

get fun get_admin_transfer_at(): int {
    return QuasarAdminTimelockStorage.load().adminTransferAt
}

get fun get_min_delay(): int {
    return QuasarAdminTimelockStorage.load().minDelay
}

get fun get_last_queued_call_id(): int {
    return QuasarAdminTimelockStorage.load().lastQueuedCallId
}

get fun get_pending_call(callId: int): PendingAdminCall? {
    return lookupPendingCall(QuasarAdminTimelockStorage.load().pendingCalls, callId)
}
