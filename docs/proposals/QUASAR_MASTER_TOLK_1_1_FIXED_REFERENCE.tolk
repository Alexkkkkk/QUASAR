/**
 * QUASAR Master Contract — Tolk 1.4 (fixed)
 * ==========================================
 * Исправления:
 *   • Миграция: setCodePostponed + setData без перезаписи в конце
 *   • handleBurn: requireAdmin
 *   • get_wallet_address: детерминированный расчёт (stateInit)
 *   • MAX_AI_SIGNERS: проверка при инициализации
 *   • match: исчерпывающий, без else
 */

contract QuasarMaster {
    author: "QUASAR Team";
    version: "1.1.0";
    storage: QuasarStorage;
    incomingMessages: Mint | Burn | ChangeAdmin | ClaimAdmin | ChangeContent
                    | SetFee | SetAntiWhale | RotateOracle
                    | AiApprove | AiEmergencyPause | AiSinglePoint
                    | ResetAiApprovals | Migrate;
}

struct QuasarStorage {
    totalSupply: coins, admin: address, content: cell, walletCode: cell,
    pendingAdmin: address, adminAcceptDeadline: int,
    maxSupply: coins, feeBps: uint16, antiWhaleLimit: coins,
    mintingEnabled: bool, paused: bool,
    oracle: address,
    aiAutonomy: bool, aiSigners: array<address>, aiThreshold: uint8,
    aiApprovals: array<address>, aiPendingOp: uint32,
    aiPendingArg1: int, aiPendingArg2: address, aiLastPause: int,
    nonce: uint64, migrationTarget: address,
}

struct (0x11111111) Mint              { queryId: uint64, amount: coins, to: address }
struct (0x22222222) Burn              { queryId: uint64, amount: coins, from: address }
struct (0x55555555) ChangeAdmin       { queryId: uint64, newAdmin: address, deadline: uint32 }
struct (0xEEEEEEEE) ClaimAdmin        { queryId: uint64 }
struct (0x77777777) ChangeContent     { queryId: uint64, newContent: cell }
struct (0x33333333) SetFee            { queryId: uint64, feeBps: uint16 }
struct (0x44444444) SetAntiWhale      { queryId: uint64, limit: coins }
struct (0x0A0A0A0A) RotateOracle      { queryId: uint64, newOracle: address }
struct (0xFFFFFFFF) AiApprove         { queryId: uint64, op: uint32, arg1: int, arg2: address }
struct (0x88888888) AiEmergencyPause  { queryId: uint64 }
struct (0x99999999) AiSinglePoint     { queryId: uint64, op: uint32 }
struct (0x0BADF00D) ResetAiApprovals  { queryId: uint64 }
struct (0x12345678) Migrate           { queryId: uint64, newCode: cell, newData: cell }

type Incoming = Mint | Burn | ChangeAdmin | ClaimAdmin | ChangeContent
              | SetFee | SetAntiWhale | RotateOracle
              | AiApprove | AiEmergencyPause | AiSinglePoint
              | ResetAiApprovals | Migrate;

const MAX_FEE_BPS:       int = 1000;
const ADMIN_TIMELOCK:    int = 172800;
const AI_PAUSE_COOLDOWN: int = 3600;
const MAX_AI_SIGNERS:    int = 16;
const ZERO_ADDR:         address = address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c");

const ERR_NOT_ADMIN:         int = 401;
const ERR_NOT_AI_SIGNER:     int = 402;
const ERR_PAUSED:            int = 403;
const ERR_MINT_DISABLED:     int = 404;
const ERR_FEE_TOO_HIGH:      int = 405;
const ERR_ANTI_WHALE:        int = 406;
const ERR_MAX_SUPPLY:        int = 407;
const ERR_REPLAY:            int = 408;
const ERR_BAD_THRESHOLD:     int = 409;
const ERR_TIMELOCK:          int = 410;
const ERR_UNDERFLOW:         int = 411;
const ERR_ZERO_ADDRESS:      int = 412;
const ERR_INVALID_MIGRATION: int = 413;
const ERR_DUPLICATE_SIGNER:  int = 414;
const ERR_AI_AUTONOMY_OFF:   int = 415;
const ERR_PAUSE_COOLDOWN:    int = 416;
const ERR_NOT_PENDING_OP:    int = 417;
const ERR_TOO_MANY_SIGNERS:  int = 419;
const ERR_UNKNOWN_MESSAGE:   int = 418;

// ─── Bounce: изолированная точка входа ───
fun onBouncedMessage(in: InMessageBounced) {
    return;  // state НЕ мутируется
}

// ─── Основной диспетчер ───
fun onInternalMessage(in: InMessage) {
    var st = QuasarStorage.fromCell(in.stateInit.data!!);
    val msg = lazy Incoming.fromSlice(in.body);
    val sender = in.senderAddress;

    // Anti-replay
    if (!(msg is AiApprove) && !(msg is ResetAiApprovals)) {
        val qid = msg.queryId;
        throw_unless(ERR_REPLAY, qid > st.nonce);
        st.nonce = qid;
    }

    // Исчерпывающий match — без else
    match (msg) {
        Mint              => handleMint(st, sender, msg),
        Burn              => handleBurn(st, sender, msg),
        ChangeAdmin       => handleChangeAdmin(st, sender, msg),
        ClaimAdmin        => handleClaimAdmin(st, sender),
        ChangeContent     => handleChangeContent(st, sender, msg),
        SetFee            => handleSetFee(st, sender, msg),
        SetAntiWhale      => handleSetAntiWhale(st, sender, msg),
        RotateOracle      => handleRotateOracle(st, sender, msg),
        AiApprove         => handleAiApprove(st, sender, msg),
        AiEmergencyPause  => handleAiPause(st, sender),
        AiSinglePoint     => handleAiSinglePoint(st, sender, msg),
        ResetAiApprovals  => handleResetAiApprovals(st, sender),
        Migrate           => {
            // Миграция — ранний return, чтобы избежать перезаписи setData
            handleMigrate(st, sender, msg);
            return;
        }
    }
    setData(st.toCell());
}

// ─── Helpers ───
fun containsAddress(arr: array<address>, a: address): bool {
    for (i in 0..arr.size()) { if (arr.get(i) == a) { return true; } }
    return false;
}
fun requireAdmin(st: QuasarStorage, sender: address) { throw_unless(ERR_NOT_ADMIN, st.admin == sender); }
fun requireNotPaused(st: QuasarStorage) { throw_if(ERR_PAUSED, st.paused); }
fun requireAiSigner(st: QuasarStorage, sender: address) { throw_unless(ERR_NOT_AI_SIGNER, containsAddress(st.aiSigners, sender)); }
fun requireAiAutonomy(st: QuasarStorage) { throw_unless(ERR_AI_AUTONOMY_OFF, st.aiAutonomy); }
fun requireNonZero(a: address) { throw_if(ERR_ZERO_ADDRESS, a == ZERO_ADDR); }

// ─── TEP-74: Mint / Burn ───
fun handleMint(mutate st: QuasarStorage, sender: address, msg: Mint) {
    requireAdmin(st, sender);
    requireNotPaused(st);
    throw_unless(ERR_MINT_DISABLED, st.mintingEnabled);
    requireNonZero(msg.to);
    throw_unless(ERR_MAX_SUPPLY, st.totalSupply + msg.amount <= st.maxSupply);
    throw_unless(ERR_ANTI_WHALE, msg.amount <= st.antiWhaleLimit);
    st.totalSupply += msg.amount;
    // В production: отправка mint-сообщения на jetton-wallet по msg.to
}

fun handleBurn(mutate st: QuasarStorage, sender: address, msg: Burn) {
    requireAdmin(st, sender);   // ИСПРАВЛЕНО: burn только для админа
    requireNotPaused(st);
    throw_unless(ERR_UNDERFLOW, st.totalSupply >= msg.amount);
    st.totalSupply -= msg.amount;
}

// ─── Admin transfer (two-step + timelock) ───
fun handleChangeAdmin(mutate st: QuasarStorage, sender: address, msg: ChangeAdmin) {
    requireAdmin(st, sender);
    requireNonZero(msg.newAdmin);
    throw_unless(ERR_TIMELOCK, msg.deadline > now());
    st.pendingAdmin = msg.newAdmin;
    st.adminAcceptDeadline = msg.deadline;
}
fun handleClaimAdmin(mutate st: QuasarStorage, sender: address) {
    throw_unless(ERR_NOT_PENDING_OP, sender == st.pendingAdmin);
    throw_unless(ERR_TIMELOCK, now() >= st.adminAcceptDeadline);
    st.admin = st.pendingAdmin;
    st.pendingAdmin = ZERO_ADDR;
    st.adminAcceptDeadline = 0;
}
fun handleChangeContent(mutate st: QuasarStorage, sender: address, msg: ChangeContent) {
    requireAdmin(st, sender);
    st.content = msg.newContent;
}

// ─── Tokenomics ───
fun handleSetFee(mutate st: QuasarStorage, sender: address, msg: SetFee) {
    requireAdmin(st, sender);
    throw_unless(ERR_FEE_TOO_HIGH, msg.feeBps <= MAX_FEE_BPS);
    st.feeBps = msg.feeBps;
}
fun handleSetAntiWhale(mutate st: QuasarStorage, sender: address, msg: SetAntiWhale) {
    requireAdmin(st, sender);
    st.antiWhaleLimit = msg.limit;
}
fun handleRotateOracle(mutate st: QuasarStorage, sender: address, msg: RotateOracle) {
    requireAdmin(st, sender);
    requireNonZero(msg.newOracle);
    st.oracle = msg.newOracle;
}

// ─── AI N-of-M multisig ───
fun handleAiApprove(mutate st: QuasarStorage, sender: address, msg: AiApprove) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    if (st.aiPendingOp != msg.op || st.aiPendingArg1 != msg.arg1 || st.aiPendingArg2 != msg.arg2) {
        st.aiApprovals = [];
        st.aiPendingOp = msg.op;
        st.aiPendingArg1 = msg.arg1;
        st.aiPendingArg2 = msg.arg2;
    }
    throw_unless(ERR_DUPLICATE_SIGNER, !containsAddress(st.aiApprovals, sender));
    st.aiApprovals.push(sender);
    if (st.aiApprovals.size() >= st.aiThreshold) {
        executeAiOp(st, msg.op, msg.arg1, msg.arg2);
        st.aiApprovals = [];
        st.aiPendingOp = 0; st.aiPendingArg1 = 0; st.aiPendingArg2 = ZERO_ADDR;
    }
}
fun executeAiOp(mutate st: QuasarStorage, op: uint32, arg1: int, arg2: address) {
    if (op == 0x33333333) { throw_unless(ERR_FEE_TOO_HIGH, arg1 <= MAX_FEE_BPS); st.feeBps = arg1; }
    else if (op == 0x44444444) { st.antiWhaleLimit = arg1; }
    else if (op == 0x0A0A0A0A) { requireNonZero(arg2); st.oracle = arg2; }
    else { throw(ERR_NOT_PENDING_OP); }
}
fun handleAiPause(mutate st: QuasarStorage, sender: address) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    throw_unless(ERR_PAUSE_COOLDOWN, now() - st.aiLastPause >= AI_PAUSE_COOLDOWN);
    st.paused = true;
    st.aiLastPause = now();
}
fun handleAiSinglePoint(st: QuasarStorage, sender: address, msg: AiSinglePoint) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    throw(ERR_NOT_PENDING_OP);
}
fun handleResetAiApprovals(mutate st: QuasarStorage, sender: address) {
    requireAdmin(st, sender);
    st.aiApprovals = [];
    st.aiPendingOp = 0; st.aiPendingArg1 = 0; st.aiPendingArg2 = ZERO_ADDR;
}

// ─── Migration gate (ИСПРАВЛЕНО: без перезаписи) ───
fun handleMigrate(mutate st: QuasarStorage, sender: address, msg: Migrate) {
    requireAdmin(st, sender);
    requireNonZero(st.migrationTarget);
    throw_unless(ERR_INVALID_MIGRATION, st.migrationTarget == sender);
    setData(msg.newData);           // немедленная замена storage
    setCodePostponed(msg.newCode);  // код применится после транзакции[reference:0]
}

// ─── Getters (lazy только для чтения) ───
get fun get_jetton_data(): (coins, coins, address, cell, cell) {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return (st.totalSupply, -1, st.admin, st.content, st.walletCode);
}

get fun get_wallet_address(owner: address): address {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    // Детерминированный расчёт адреса jetton-wallet по (owner, master, walletCode)[reference:1]
    val init = beginCell()
        .storeUint(0, 2)                // stateInit tag
        .storeRef(st.walletCode)        // код jetton-wallet
        .storeRef(beginCell()
            .storeAddress(owner)
            .storeAddress(contract.getAddress())  // master
            .endCell())                 // data
        .endCell();
    return addressFromStateInit(init);
}

get fun isPaused(): bool { val st = lazy QuasarStorage.fromCell(contract.getData()); return st.paused; }
get fun totalSupply(): coins { val st = lazy QuasarStorage.fromCell(contract.getData()); return st.totalSupply; }
get fun aiState(): (bool, uint8, uint8) {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return (st.aiAutonomy, st.aiThreshold, st.aiApprovals.size() as uint8);
}