import "types"

contract AgentWallet {
    author: "QUASAR example"
    version: "1.0.0"
    description: "Local-only owner-managed agent wallet example"
    storage: Storage
    incomingMessages: AllowedMessage
}

type AllowedMessage =
    | SetAgent
    | RevokeAgent
    | AgentTransfer

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedMessage.fromSlice(in.body);
    var storage = lazy Storage.load();
    match (msg) {
        SetAgent => {
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            assert (msg.newAgent != zeroAddress()) throw Errors.ZeroAddress;
            storage.agent = msg.newAgent;
            storage.seqno = 0;
            storage.save();
        }
        RevokeAgent => {
            assert (in.senderAddress == storage.owner) throw Errors.NotOwner;
            storage.agent = zeroAddress();
            storage.seqno = 0;
            storage.save();
        }
        AgentTransfer => {
            assert (in.senderAddress == storage.agent) throw Errors.NotAgent;
            assert (storage.agent != zeroAddress()) throw Errors.NotAgent;
            assert (msg.destination != zeroAddress()) throw Errors.ZeroAddress;
            assert (msg.amount > 0) throw Errors.InvalidAmount;
            assert (msg.seqno == storage.seqno) throw Errors.InvalidSeqno;
            storage.seqno += 1;
            storage.save();
            // Bounce failed destination actions; pay fees separately and do not
            // turn a failed recipient action into a silent wallet debit.
            val outbound = createMessage({
                bounce: BounceMode.Only256BitsOfBody,
                dest: msg.destination,
                value: msg.amount,
            });
            outbound.send(SEND_MODE_PAY_FEES_SEPARATELY);
        }
        else => {
            assert (in.body.isEmpty()) throw Errors.InvalidMessage;
        }
    }
}

fun onBouncedMessage(_in: InMessageBounced) {}

get fun owner(): address {
    val storage = lazy Storage.load();
    return storage.owner;
}

get fun agent(): address {
    val storage = lazy Storage.load();
    return storage.agent;
}

get fun seqno(): uint64 {
    val storage = lazy Storage.load();
    return storage.seqno;
}
