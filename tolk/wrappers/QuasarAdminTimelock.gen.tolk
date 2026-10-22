/// Wrapper for contract 'QuasarAdminTimelock'.
///
/// This file follows the official Acton generated-wrapper API so the focused
/// tests can construct state init, send every ABI receiver, and call getters.

import "@acton/build"
import "@acton/emulation/network"
import "@acton/testing/assert"
import "@stdlib/tvm-dicts"

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

struct (0x946a98b6) Deploy {
    queryId: uint64
}

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

struct QuasarAdminTimelock {
    address: address
    stateInit: ContractState? = null
    toShard: AddressShardingOptions? = null
}

fun QuasarAdminTimelock.fromStorage(
    storage: QuasarAdminTimelockStorage,
    toShard: AddressShardingOptions? = null,
    workchain: int8 = BASECHAIN,
): QuasarAdminTimelock {
    val stateInit = ContractState {
        code: build("QuasarAdminTimelock"),
        data: storage.toCell(),
    }
    val address = AutoDeployAddress { workchain, stateInit, toShard }.calculateAddress()
    return QuasarAdminTimelock { address, stateInit, toShard }
}

fun QuasarAdminTimelock.fromAddress(address: address): QuasarAdminTimelock {
    return QuasarAdminTimelock { address }
}

fun QuasarAdminTimelock.deploy(
    self,
    from: address,
    queryId: uint64 = 0,
    config: SendParams = {},
): SendResultList {
    if (self.stateInit == null) {
        Assert.fail("Cannot deploy a contract created with 'fromAddress' because it lacks state init for deployment")
    }
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: {
            workchain: self.address.getWorkchain(),
            stateInit: self.stateInit,
            toShard: self.toShard,
        },
        body: Deploy { queryId },
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendDeploy(
    self,
    from: address,
    queryId: uint64,
    config: SendParams = {},
): SendResultList {
    return self.deploy(from, queryId, config)
}

fun QuasarAdminTimelock.sendQueueAdminCall(
    self,
    from: address,
    callId: uint64,
    target: address,
    value: coins,
    body: cell,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body: QueueAdminCall { callId, target, value, body },
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendExecuteAdminCall(
    self,
    from: address,
    callId: uint64,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body: ExecuteAdminCall { callId },
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendCancelAdminCall(
    self,
    from: address,
    callId: uint64,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body: CancelAdminCall { callId },
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendProposeAdmin(
    self,
    from: address,
    newAdmin: address,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body: ProposeAdmin { newAdmin },
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendAcceptAdmin(
    self,
    from: address,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body: AcceptAdmin {},
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendCancelAdminTransfer(
    self,
    from: address,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body: CancelAdminTransfer {},
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.sendAny(
    self,
    from: address,
    body: cell,
    config: SendParams = {},
): SendResultList {
    val genericMsg = createMessage({
        bounce: config.bounce,
        value: config.value,
        dest: self.address,
        body,
    })
    return net.send(from, genericMsg)
}

fun QuasarAdminTimelock.getMaster(self): address {
    return net.runGetMethod(self.address, "get_master")
}

fun QuasarAdminTimelock.getDefi(self): address {
    return net.runGetMethod(self.address, "get_defi")
}

fun QuasarAdminTimelock.getAdmin(self): address {
    return net.runGetMethod(self.address, "get_admin")
}

fun QuasarAdminTimelock.getPendingAdmin(self): address {
    return net.runGetMethod(self.address, "get_pending_admin")
}

fun QuasarAdminTimelock.getAdminTransferAt(self): int {
    return net.runGetMethod(self.address, "get_admin_transfer_at")
}

fun QuasarAdminTimelock.getMinDelay(self): int {
    return net.runGetMethod(self.address, "get_min_delay")
}

fun QuasarAdminTimelock.getLastQueuedCallId(self): int {
    return net.runGetMethod(self.address, "get_last_queued_call_id")
}

fun QuasarAdminTimelock.getPendingCall(self, callId: int): PendingAdminCall? {
    return net.runGetMethod(self.address, "get_pending_call", [callId])
}
