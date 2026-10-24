enum Errors {
    NotOwner = 100
    NotAgent = 101
    ZeroAddress = 102
    InvalidAmount = 103
    InvalidSeqno = 104
    InvalidMessage = 0xFFFF
}

fun zeroAddress(): address {
    return address.fromWorkchainAndHash(BASECHAIN, 0);
}

struct Storage {
    owner: address
    agent: address
    seqno: uint64
}

fun Storage.load(): Storage {
    return Storage.fromCell(contract.getData());
}

fun Storage.save(self) {
    contract.setData(self.toCell());
}

struct (0x2d4c3e11) SetAgent {
    newAgent: address
}

struct (0x1d3b9a77) RevokeAgent {}

struct (0x5a6c8e22) AgentTransfer {
    seqno: uint64
    destination: address
    amount: coins
}
