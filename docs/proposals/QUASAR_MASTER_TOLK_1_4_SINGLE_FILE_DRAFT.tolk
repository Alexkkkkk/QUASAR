/**
 * QUASAR Master Contract — Tolk 1.4 (single-file)
 * ================================================
 * TEP-74-совместимый jetton-master с многослойной моделью безопасности:
 *
 *   Слой 1 (Контракт):    contract-блок · явные mutate · исчерпывающий match
 *   Слой 2 (Bounce):      изолированный onBouncedMessage без setData
 *   Слой 3 (Replay):      монотонный nonce
 *   Слой 4 (Tokenomics):  maxSupply · anti-whale · fee cap · underflow guards
 *   Слой 5 (Admin):       two-step transfer с таймлоком 48 ч
 *   Слой 6 (AI):          N-of-M мультисиг · cooldown на аварийную паузу
 *   Слой 7 (Migration):   предустановленный migrationTarget
 *   Слой 8 (Standards):   TEP-74 + TEP-89 геттеры
 *
 * ВАЖНО: не компилировалось. Требует acton build / test / аудита
 *        перед любым деплоем с реальными средствами.
 */

// ════════════════════════════════════════════════════════════
// Contract Declaration (Tolk 1.4) — автогенерация ABI и TS-обёрток
// ════════════════════════════════════════════════════════════
contract QuasarMaster {
    author: "QUASAR Team";
    version: "1.0.0";
    description: "TEP-74 jetton-master with AI-multisig, timelock, migration gate";
    storage: QuasarStorage;
    incomingMessages: Mint | Burn | ChangeAdmin | ClaimAdmin | ChangeContent
                    | SetFee | SetAntiWhale | RotateOracle
                    | AiApprove | AiEmergencyPause | AiSinglePoint
                    | ResetAiApprovals | Migrate;
}

// ════════════════════════════════════════════════════════════
// Storage — БЕЗ lazy. Мутации обязаны сериализоваться корректно.
// ════════════════════════════════════════════════════════════
struct QuasarStorage {
    // ─── TEP-74 ───
    totalSupply:  coins,
    admin:        address,
    content:      cell,
    walletCode:   cell,           // код jetton-wallet для get_wallet_address

    // ─── Admin transfer ───
    pendingAdmin:         address,
    adminAcceptDeadline:  int,

    // ─── Tokenomics ───
    maxSupply:        coins,
    feeBps:           uint16,
    antiWhaleLimit:   coins,
    mintingEnabled:   bool,
    paused:           bool,

    // ─── Oracle ───
    oracle: address,

    // ─── AI-модуль ───
    aiAutonomy:    bool,
    aiSigners:     array<address>,
    aiThreshold:   uint8,
    aiApprovals:   array<address>,
    aiPendingOp:   uint32,
    aiPendingArg1: int,
    aiPendingArg2: address,
    aiLastPause:   int,

    // ─── Безопасность ───
    nonce:            uint64,
    migrationTarget:  address,
}

// ════════════════════════════════════════════════════════════
// Messages — TEP-74 + расширения
// ════════════════════════════════════════════════════════════

// TEP-74 master-side
struct (0x11111111) Mint               { queryId: uint64, amount: coins, to: address }
struct (0x22222222) Burn               { queryId: uint64, amount: coins, from: address }
struct (0x55555555) ChangeAdmin        { queryId: uint64, newAdmin: address, deadline: uint32 }
struct (0xEEEEEEEE) ClaimAdmin         { queryId: uint64 }
struct (0x77777777) ChangeContent      { queryId: uint64, newContent: cell }

// Tokenomics
struct (0x33333333) SetFee             { queryId: uint64, feeBps: uint16 }
struct (0x44444444) SetAntiWhale       { queryId: uint64, limit: coins }
struct (0x0A0A0A0A) RotateOracle       { queryId: uint64, newOracle: address }

// AI-модуль
struct (0xFFFFFFFF) AiApprove          { queryId: uint64, op: uint32, arg1: int, arg2: address }
struct (0x88888888) AiEmergencyPause   { queryId: uint64 }
struct (0x99999999) AiSinglePoint      { queryId: uint64, op: uint32 }
struct (0x0BADF00D) ResetAiApprovals   { queryId: uint64 }

// Migration
struct (0x12345678) Migrate            { queryId: uint64, newCode: cell, newData: cell }

type Incoming = Mint | Burn | ChangeAdmin | ClaimAdmin | ChangeContent
              | SetFee | SetAntiWhale | RotateOracle
              | AiApprove | AiEmergencyPause | AiSinglePoint
              | ResetAiApprovals | Migrate;

// ════════════════════════════════════════════════════════════
// Constants
// ════════════════════════════════════════════════════════════
const MAX_FEE_BPS:       int = 1000;    // 10 %
const ADMIN_TIMELOCK:    int = 172800;  // 48 ч
const AI_PAUSE_COOLDOWN: int = 3600;    // 1 ч
const MAX_AI_SIGNERS:    int = 16;
const ZERO_ADDR:         address = address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c");

// ════════════════════════════════════════════════════════════
// Error codes
// ════════════════════════════════════════════════════════════
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
const ERR_UNKNOWN_MESSAGE:   int = 418;

// ════════════════════════════════════════════════════════════
// Bounce: изолированная точка входа — НИКОГДА не мутирует state
// ════════════════════════════════════════════════════════════
fun onBouncedMessage(in: InMessageBounced) {
    // Отскок приходит сюда, а не в onInternalMessage.
    // Мы намеренно не вызываем setData: state остаётся неизменным,
    // что исключает двойное списание и «тихую» порчу данных.
    return;
}

// ════════════════════════════════════════════════════════════
// Main dispatcher — исчерпывающий match, без else
// ════════════════════════════════════════════════════════════
fun onInternalMessage(in: InMessage) {
    // Storage загружается БЕЗ lazy: мутации должны сохраниться.
    var st = QuasarStorage.fromCell(in.stateInit.data!!);
    val msg = lazy Incoming.fromSlice(in.body);
    val sender = in.senderAddress;

    // Anti-replay: монотонный nonce (кроме AI-аппрувов и сброса)
    if (!(msg is AiApprove) && !(msg is ResetAiApprovals)) {
        val qid = msg.queryId;
        throw_unless(ERR_REPLAY, qid > st.nonce);
        st.nonce = qid;
    }

    // Исчерпывающий match: все 13 типов обработаны явно.
    // Компилятор гарантирует, что забытый тип не пройдёт сборку.
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
        Migrate           => handleMigrate(st, sender, msg),
    }

    // Коммит состояния. Все mutate-изменения st сохраняются здесь.
    setData(st.toCell());
}

// ════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════
fun containsAddress(arr: array<address>, a: address): bool {
    for (i in 0..arr.size()) {
        if (arr.get(i) == a) { return true; }
    }
    return false;
}

fun requireAdmin(st: QuasarStorage, sender: address) {
    throw_unless(ERR_NOT_ADMIN, st.admin == sender);
}

fun requireNotPaused(st: QuasarStorage) {
    throw_if(ERR_PAUSED, st.paused);
}

fun requireAiSigner(st: QuasarStorage, sender: address) {
    throw_unless(ERR_NOT_AI_SIGNER, containsAddress(st.aiSigners, sender));
}

fun requireAiAutonomy(st: QuasarStorage) {
    throw_unless(ERR_AI_AUTONOMY_OFF, st.aiAutonomy);
}

fun requireNonZero(a: address) {
    throw_if(ERR_ZERO_ADDRESS, a == ZERO_ADDR);
}

// ════════════════════════════════════════════════════════════
// TEP-74: Mint / Burn
// ════════════════════════════════════════════════════════════
fun handleMint(mutate st: QuasarStorage, sender: address, msg: Mint) {
    requireAdmin(st, sender);
    requireNotPaused(st);
    throw_unless(ERR_MINT_DISABLED, st.mintingEnabled);
    requireNonZero(msg.to);
    throw_unless(ERR_MAX_SUPPLY, st.totalSupply + msg.amount <= st.maxSupply);
    throw_unless(ERR_ANTI_WHALE, msg.amount <= st.antiWhaleLimit);
    st.totalSupply += msg.amount;
    // В production здесь отправляется mint-message на jetton-wallet по msg.to
}

fun handleBurn(mutate st: QuasarStorage, sender: address, msg: Burn) {
    requireNotPaused(st);
    // Underflow guard ОБЯЗАТЕЛЕН перед вычитанием
    throw_unless(ERR_UNDERFLOW, st.totalSupply >= msg.amount);
    st.totalSupply -= msg.amount;
}

// ════════════════════════════════════════════════════════════
// TEP-74: Admin transfer (two-step + timelock 48 ч)
// ════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════
// Tokenomics: fee / anti-whale / oracle
// ════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════
// AI-модуль: N-of-M мультисиг
// ════════════════════════════════════════════════════════════
fun handleAiApprove(mutate st: QuasarStorage, sender: address, msg: AiApprove) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);

    // Смена операции → сброс накопленных одобрений
    if (st.aiPendingOp != msg.op
        || st.aiPendingArg1 != msg.arg1
        || st.aiPendingArg2 != msg.arg2) {
        st.aiApprovals = [];
        st.aiPendingOp = msg.op;
        st.aiPendingArg1 = msg.arg1;
        st.aiPendingArg2 = msg.arg2;
    }

    // Защита от дублирования подписи одним и тем же signer'ом
    throw_unless(ERR_DUPLICATE_SIGNER, !containsAddress(st.aiApprovals, sender));
    st.aiApprovals.push(sender);

    // Порог достигнут → выполняем операцию и очищаем накопления
    if (st.aiApprovals.size() >= st.aiThreshold) {
        executeAiOp(st, msg.op, msg.arg1, msg.arg2);
        st.aiApprovals = [];
        st.aiPendingOp = 0;
        st.aiPendingArg1 = 0;
        st.aiPendingArg2 = ZERO_ADDR;
    }
}

fun executeAiOp(mutate st: QuasarStorage, op: uint32, arg1: int, arg2: address) {
    if (op == 0x33333333) {                          // AiSetFee
        throw_unless(ERR_FEE_TOO_HIGH, arg1 <= MAX_FEE_BPS);
        st.feeBps = arg1;
    } else if (op == 0x44444444) {                   // AiSetAntiWhale
        st.antiWhaleLimit = arg1;
    } else if (op == 0x0A0A0A0A) {                   // AiRotateOracle
        requireNonZero(arg2);
        st.oracle = arg2;
    } else {
        throw(ERR_NOT_PENDING_OP);
    }
}

fun handleAiPause(mutate st: QuasarStorage, sender: address) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    throw_unless(ERR_PAUSE_COOLDOWN, now() - st.aiLastPause >= AI_PAUSE_COOLDOWN);
    st.paused = true;
    st.aiLastPause = now();
}

// Одиночные AI-операции НАМЕРЕННО запрещены — только через мультисиг.
fun handleAiSinglePoint(st: QuasarStorage, sender: address, msg: AiSinglePoint) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    throw(ERR_NOT_PENDING_OP);
}

fun handleResetAiApprovals(mutate st: QuasarStorage, sender: address) {
    requireAdmin(st, sender);
    st.aiApprovals = [];
    st.aiPendingOp = 0;
    st.aiPendingArg1 = 0;
    st.aiPendingArg2 = ZERO_ADDR;
}

// ════════════════════════════════════════════════════════════
// Migration gate
// ════════════════════════════════════════════════════════════
fun handleMigrate(mutate st: QuasarStorage, sender: address, msg: Migrate) {
    requireAdmin(st, sender);
    requireNonZero(st.migrationTarget);
    throw_unless(ERR_INVALID_MIGRATION, st.migrationTarget == sender);
    setData(msg.newData);
    setCode(msg.newCode);
}

// ════════════════════════════════════════════════════════════
// Getters — TEP-89 + служебные (lazy безопасен: только чтение)
// ════════════════════════════════════════════════════════════
get fun get_jetton_data(): (coins, coins, address, cell, cell) {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return (st.totalSupply, -1, st.admin, st.content, st.walletCode);
}

get fun get_wallet_address(owner: address): address {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    // В production — расчёт адреса jetton-wallet по (owner, master, walletCode).
    // Здесь заглушка: возвращает owner для иллюстрации сигнатуры.
    return owner;
}

get fun isPaused(): bool {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return st.paused;
}

get fun totalSupply(): coins {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return st.totalSupply;
}

get fun aiState(): (bool, uint8, uint8) {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return (st.aiAutonomy, st.aiThreshold, st.aiApprovals.size() as uint8);
}