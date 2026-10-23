// Shared QUASAR wire types and wallet policy.
// Keep these declarations in one file so Master and DeFi can import the same
// TEP-74, TEP-89, fee, burn, and pool-payout layouts.

const QUASAR_STORAGE_RESERVE: coins = 50000000
const QUASAR_MAX_SUPPLY: coins = 1000000000000000000
const QUASAR_WALLET_FEE_BPS = 30
const QUASAR_MAX_TX_BPS = 100
const QUASAR_MAX_WALLET_BPS = 300
const QUASAR_TRANSFER_COOLDOWN = 5
const QUASAR_MINT_TRANSFER_MARKER = 0x4d494e54
const QUASAR_MAX_TX_AMOUNT: coins = 10000000000000000
const QUASAR_MAX_WALLET_AMOUNT: coins = 30000000000000000
// The high bit separates pool-payout transfers from user query IDs. It must be
// checked before consulting any pool ledger, otherwise a colliding user ID can
// be misclassified after a bounce.
const QUASAR_POOL_PAYOUT_MARKER = 9223372036854775808

// TEP-74 transfer from a wallet owner. forwardPayload is the exact remaining
// slice after the fixed fields; it is not wrapped in an extra Either here.
struct (0x0f8a7ea5) TokenTransfer {
    queryId: uint64
    amount: coins
    destination: address
    // TEP-74 declares this as MsgAddress. `address?` encodes an internal
    // address or addr_none without accepting an external destination.
    responseDestination: address?
    customPayload: cell?
    forwardTonAmount: coins
    forwardPayload: RemainingBitsAndRefs
}

struct (0x7362d09c) TokenNotification {
    queryId: uint64
    amount: coins
    from: address
    forwardPayload: RemainingBitsAndRefs
}

struct (0x595f07bc) TokenBurn {
    queryId: uint64
    amount: coins
    responseDestination: address?
    customPayload: cell?
}

struct (0xd53276db) TokenExcesses {
    queryId: uint64
}

struct (0x7bdd97de) BurnNotification {
    queryId: uint64
    amount: coins
    sender: address
    responseDestination: address?
}

// These opcodes are explicit because the Tact ABI is the wire-level source of
// truth; do not let a compiler-generated name hash change them.
struct (0x934f3602) BurnConfirmed {
    queryId: uint64
}

struct (0x0b1cc4aa) TransferConfirmed {
    queryId: uint64
}

struct (0xeb527edf) FeeTransfer {
    queryId: uint64
    amount: coins
    originalSender: address
    originalReceiver: address
}

struct (0x178d4519) InternalTransfer {
    queryId: uint64
    amount: coins
    from: address
    responseDestination: address?
    forwardTonAmount: coins
    forwardPayload: RemainingBitsAndRefs
}

// PoolPayout carries an explicit response destination. Its bounced body is
// intentionally read only through the first 224 bits (opcode, queryId, and
// amount); the trailing addresses are outside TON's standard bounce prefix.
struct (0x51a5c3d1) PoolPayout {
    queryId: uint64
    amount: coins
    destination: address
    responseDestination: address?
}

struct (0x2945917f) PayoutFailed {
    queryId: uint64
    amount: coins
    destination: address
}

// TEP-89 discovery uses the full MsgAddress union. `any_address` is necessary
// for the standard addr_none result when no wallet can be derived. The optional
// owner is a Maybe reference to MsgAddress, not an inline address? field.
struct (0x2c76b973) ProvideWalletAddress {
    queryId: uint64
    ownerAddress: any_address
    includeAddress: bool
}

struct (0xd1735400) TakeWalletAddress {
    queryId: uint64
    walletAddress: any_address
    ownerAddress: Cell<any_address>?
}

// Shared Master/DeFi messages which are useful to later migration modules.
struct (0x642b7d07) Mint {
    amount: coins
    receiver: address
}

struct JettonWalletData {
    balance: coins
    owner: address
    master: address
    walletCode: cell
}

// This struct is an in-memory view. Persistent bytes are packed manually below
// to preserve Tact's loaded flag and nested dictionary references exactly.
@overflow1023_policy("suppress")
struct QuasarWalletStorage {
    balance: coins
    owner: address
    master: address
    lastTxTime: int257
    pendingResponses: map<int257, address?>
    pendingResponseFees: map<int257, int257>
    pendingResponseReceivers: map<int257, address>
    pendingBurnResponses: map<int257, address?>
    pendingPoolPayouts: map<int257, int257>
    pendingPoolPayoutReceivers: map<int257, address>
}

struct QuasarWalletInitData {
    initialized: bool
    owner: address
    master: address
}

fun quasarWalletInitData(owner: address, master: address): cell {
    // Tact's init StateInit data is `false` followed by the two constructor addresses.
    return QuasarWalletInitData {
        initialized: false,
        owner,
        master,
    }.toCell();
}

fun emptyQuasarWalletStorage(owner: address, master: address): QuasarWalletStorage {
    return {
        balance: 0,
        owner,
        master,
        lastTxTime: 0,
        pendingResponses: [],
        pendingResponseFees: [],
        pendingResponseReceivers: [],
        pendingBurnResponses: [],
        pendingPoolPayouts: [],
        pendingPoolPayoutReceivers: [],
    };
}

fun QuasarWalletStorage.load(): QuasarWalletStorage {
    var root = contract.getData().beginParse();
    val initialized = root.loadBool();
    if (!initialized) {
        val owner = root.loadAddress();
        val master = root.loadAddress();
        root.assertEnd();
        return emptyQuasarWalletStorage(owner, master);
    }

    val balance = root.loadCoins();
    val owner = root.loadAddress();
    val master = root.loadAddress();
    val lastTxTime = root.loadInt(257);
    val pendingResponses = createMapFromLowLevelDict<int257, address?>(root.loadDict());

    var tail = root.loadRef().beginParse();
    val pendingResponseFees = createMapFromLowLevelDict<int257, int257>(tail.loadDict());
    val pendingResponseReceivers = createMapFromLowLevelDict<int257, address>(tail.loadDict());
    val pendingBurnResponses = createMapFromLowLevelDict<int257, address?>(tail.loadDict());

    var payoutTail = tail.loadRef().beginParse();
    val pendingPoolPayouts = createMapFromLowLevelDict<int257, int257>(payoutTail.loadDict());
    val pendingPoolPayoutReceivers = createMapFromLowLevelDict<int257, address>(
        payoutTail.loadDict(),
    );
    payoutTail.assertEnd();
    tail.assertEnd();
    root.assertEnd();

    return {
        balance,
        owner,
        master,
        lastTxTime,
        pendingResponses,
        pendingResponseFees,
        pendingResponseReceivers,
        pendingBurnResponses,
        pendingPoolPayouts,
        pendingPoolPayoutReceivers,
    };
}

fun QuasarWalletStorage.save(self) {
    // Tact groups dictionaries into two referenced cells to respect TON's
    // four-reference limit. Preserve that exact order and grouping.
    var payoutTail = beginCell();
    payoutTail.storeDict(self.pendingPoolPayouts.toLowLevelDict());
    payoutTail.storeDict(self.pendingPoolPayoutReceivers.toLowLevelDict());

    var responseTail = beginCell();
    responseTail.storeDict(self.pendingResponseFees.toLowLevelDict());
    responseTail.storeDict(self.pendingResponseReceivers.toLowLevelDict());
    responseTail.storeDict(self.pendingBurnResponses.toLowLevelDict());
    responseTail.storeRef(payoutTail.endCell());

    var root = beginCell();
    root.storeBool(true);
    root.storeCoins(self.balance);
    root.storeAddress(self.owner);
    root.storeAddress(self.master);
    root.storeInt(self.lastTxTime, 257);
    root.storeDict(self.pendingResponses.toLowLevelDict());
    root.storeRef(responseTail.endCell());
    contract.setData(root.endCell());
}

// QUASAR's Tact reference derives the wallet address directly from StateInit;
// no shard-closing hint is added here because that would change the address.
fun quasarWalletDeployment(owner: address, master: address, walletCode: cell): AutoDeployAddress {
    return {
        workchain: BASECHAIN,
        stateInit: { code: walletCode, data: quasarWalletInitData(owner, master) },
    };
}

fun quasarWalletAddress(owner: address, master: address, walletCode: cell): address {
    return quasarWalletDeployment(owner, master, walletCode).calculateAddress();
}

fun isZeroAddress(value: address): bool {
    val (workchain, hash) = value.getWorkchainAndHash();
    return workchain == BASECHAIN && hash == 0;
}

// QUASAR's Tact reference used the all-zero basechain address as a legacy
// no-response sentinel. Preserve that compatibility while also accepting the
// standard TEP-74 addr_none encoding represented by a nullable address.
fun isNoResponseAddress(value: address?): bool {
    return value == null || isZeroAddress(value);
}

fun isMintMarkedPayload(payload: slice): bool {
    return payload.remainingBitsCount() >= 32 &&
        payload.preloadUint(32) == QUASAR_MINT_TRANSFER_MARKER;
}
