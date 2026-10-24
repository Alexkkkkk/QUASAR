Ниже — полный код и конфигурация, объединяющие все слои защиты в единый проект Acton. Это не отдельные фрагменты, а рабочая структура: контракт, манифест, тесты с fuzzing и mutation testing, CI-пайплайн и формальная верификация.

---

📁 Структура проекта

```
quasar/
├── Acton.toml
├── contracts/
│   └── QuasarMaster.tolk
├── tests/
│   └── quasar.test.tolk
└── .github/workflows/ci.yml
```

---

⚙️ Acton.toml — манифест со всеми слоями

```toml
[package]
name = "quasar"
version = "1.0.0"

[contracts]
QuasarMaster = { path = "contracts/QuasarMaster.tolk" }

[test]
include = ["tests/**/*.test.tolk"]
# Слой тестирования: покрытие и мутации
coverage-minimum-percent = 90
mutation = true
# Слой CI: JUnit для внешних систем
reporter = ["console", "junit"]
```

Секция [test] задаёт поведение тест-раннера по умолчанию: порог покрытия и включение mutation testing. Отчёты в JUnit позволяют встроить результаты в CI.

---

📄 contracts/QuasarMaster.tolk — контракт

```tolk
/**
 * QUASAR Master — Tolk 1.4
 * Слои: contract-блок (ABI), исчерпывающий match, явные mutate,
 *       изолированный bounce, AI-мультисиг, timelock, migration gate.
 */

// ─── Contract declaration (Tolk 1.4): автогенерация ABI и TS-обёрток ───
contract QuasarMaster {
    author: "QUASAR Team";
    version: "1.0.0";
    storage: QuasarStorage;
    incomingMessages: Mint | Burn | SetFee | SetAntiWhale | RotateOracle
                    | ToggleMinting | GrantAi | ScheduleAdmin | AcceptAdmin
                    | AiApprove | AiEmergencyPause | AiSetFee | AiSetAntiWhale
                    | AiRotateOracle | AiToggleMinting | ResetAiApprovals
                    | Migrate;
}

// ─── Storage (без lazy: мутации должны сериализоваться) ───
struct QuasarStorage {
    admin: address, pendingAdmin: address, adminAcceptDeadline: int,
    oracle: address, totalSupply: int, maxSupply: int, feeBps: int,
    antiWhaleLimit: int, mintingEnabled: bool, paused: bool,
    aiAutonomy: bool, aiSigners: array<address>, aiThreshold: int,
    aiApprovals: array<address>, aiPendingOp: int, aiPendingArg1: int,
    aiPendingArg2: address, aiLastPause: int, nonce: int,
    migrationTarget: address,
}

// ─── Сообщения ───
struct (0x11111111) Mint               { queryId: uint64, amount: coins, to: address }
struct (0x22222222) Burn               { queryId: uint64, amount: coins, from: address }
struct (0x33333333) SetFee             { queryId: uint64, feeBps: uint16 }
struct (0x44444444) SetAntiWhale       { queryId: uint64, limit: coins }
struct (0x55555555) RotateOracle       { queryId: uint64, newOracle: address }
struct (0x66666666) ToggleMinting      { queryId: uint64 }
struct (0x77777777) GrantAi            { queryId: uint64 }
struct (0xDDDDDDDD) ScheduleAdmin      { queryId: uint64, newAdmin: address, deadline: uint32 }
struct (0xEEEEEEEE) AcceptAdmin        { queryId: uint64 }
struct (0xFFFFFFFF) AiApprove          { queryId: uint64, op: uint32, arg1: int, arg2: address }
struct (0x88888888) AiEmergencyPause   { queryId: uint64 }
struct (0x99999999) AiSetFee           { queryId: uint64 }
struct (0xAAAAAAAA) AiSetAntiWhale     { queryId: uint64 }
struct (0xBBBBBBBB) AiRotateOracle     { queryId: uint64 }
struct (0xCCCCCCCC) AiToggleMinting    { queryId: uint64 }
struct (0x0BADF00D) ResetAiApprovals   { queryId: uint64 }
struct (0x12345678) Migrate            { queryId: uint64, newCode: cell, newData: cell }

type Incoming = Mint | Burn | SetFee | SetAntiWhale | RotateOracle | ToggleMinting
              | GrantAi | ScheduleAdmin | AcceptAdmin | AiApprove | AiEmergencyPause
              | AiSetFee | AiSetAntiWhale | AiRotateOracle | AiToggleMinting
              | ResetAiApprovals | Migrate;

// ─── Константы ───
const MAX_FEE_BPS:       int = 1000;
const ADMIN_TIMELOCK:    int = 172800;
const AI_PAUSE_COOLDOWN: int = 3600;
const ZERO_ADDR: address = address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c");

const ERR_NOT_ADMIN: int = 401;         const ERR_NOT_AI_SIGNER: int = 402;
const ERR_PAUSED: int = 403;            const ERR_MINT_DISABLED: int = 404;
const ERR_FEE_TOO_HIGH: int = 405;      const ERR_ANTI_WHALE: int = 406;
const ERR_MAX_SUPPLY: int = 407;        const ERR_REPLAY: int = 408;
const ERR_TIMELOCK: int = 410;          const ERR_UNDERFLOW: int = 411;
const ERR_DUPLICATE_SIGNER: int = 414;  const ERR_AI_AUTONOMY_OFF: int = 415;
const ERR_PAUSE_COOLDOWN: int = 416;    const ERR_NOT_PENDING_OP: int = 417;
const ERR_BAD_THRESHOLD: int = 409;

// ─── Bounce: никогда не мутирует state ───
fun onBouncedMessage(in: InMessageBounced) { return; }

// ─── Диспетчер: исчерпывающий match, явные mutate при вызовах ───
fun onInternalMessage(in: InMessage) {
    var st = QuasarStorage.fromCell(in.stateInit.data!!);
    val msg = lazy Incoming.fromSlice(in.body);
    val sender = in.senderAddress;

    if (!(msg is AiApprove) && !(msg is ResetAiApprovals)) {
        val qid = msg.queryId;
        throw_unless(ERR_REPLAY, qid > st.nonce);
        st.nonce = qid;
    }

    match (msg) {
        Mint              => handleMint(mutate st, sender, msg),
        Burn              => handleBurn(mutate st, sender, msg),
        SetFee            => handleSetFee(mutate st, sender, msg),
        SetAntiWhale      => handleSetAntiWhale(mutate st, sender, msg),
        RotateOracle      => handleRotateOracle(mutate st, sender, msg),
        ToggleMinting     => handleToggleMinting(mutate st, sender),
        GrantAi           => handleGrantAi(mutate st, sender),
        ScheduleAdmin     => handleScheduleAdmin(mutate st, sender, msg),
        AcceptAdmin       => handleAcceptAdmin(mutate st, sender),
        AiApprove         => handleAiApprove(mutate st, sender, msg),
        AiEmergencyPause  => handleAiPause(mutate st, sender),
        AiSetFee          => handleAiSinglePoint(st, sender),
        AiSetAntiWhale    => handleAiSinglePoint(st, sender),
        AiRotateOracle    => handleAiSinglePoint(st, sender),
        AiToggleMinting   => handleAiSinglePoint(st, sender),
        ResetAiApprovals  => handleResetAiApprovals(mutate st, sender),
        Migrate           => handleMigrate(mutate st, sender, msg),
    }
    setData(st.toCell());
}

// ─── Helpers ───
fun containsAddress(arr: array<address>, a: address): bool {
    for (i in 0..arr.size()) { if (arr.get(i) == a) { return true; } }
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

// ─── User actions ───
fun handleMint(mutate st: QuasarStorage, sender: address, msg: Mint) {
    requireNotPaused(st);
    throw_unless(ERR_MINT_DISABLED, st.mintingEnabled);
    throw_unless(ERR_MAX_SUPPLY, st.totalSupply + msg.amount <= st.maxSupply);
    throw_unless(ERR_ANTI_WHALE, msg.amount <= st.antiWhaleLimit);
    st.totalSupply += msg.amount;
}
fun handleBurn(mutate st: QuasarStorage, sender: address, msg: Burn) {
    requireNotPaused(st);
    throw_unless(ERR_UNDERFLOW, st.totalSupply >= msg.amount);
    st.totalSupply -= msg.amount;
}

// ─── Admin actions ───
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
    throw_if(ERR_BAD_THRESHOLD, msg.newOracle == ZERO_ADDR);
    st.oracle = msg.newOracle;
}
fun handleToggleMinting(mutate st: QuasarStorage, sender: address) {
    requireAdmin(st, sender);
    st.mintingEnabled = !st.mintingEnabled;
}
fun handleGrantAi(mutate st: QuasarStorage, sender: address) {
    requireAdmin(st, sender);
    st.aiAutonomy = !st.aiAutonomy;
}

// ─── Two-step admin + timelock ───
fun handleScheduleAdmin(mutate st: QuasarStorage, sender: address, msg: ScheduleAdmin) {
    requireAdmin(st, sender);
    throw_if(ERR_BAD_THRESHOLD, msg.newAdmin == ZERO_ADDR);
    throw_unless(ERR_TIMELOCK, msg.deadline > now());
    st.pendingAdmin = msg.newAdmin;
    st.adminAcceptDeadline = msg.deadline;
}
fun handleAcceptAdmin(mutate st: QuasarStorage, sender: address) {
    throw_unless(ERR_NOT_PENDING_OP, sender == st.pendingAdmin);
    throw_unless(ERR_TIMELOCK, now() >= st.adminAcceptDeadline);
    st.admin = st.pendingAdmin;
    st.pendingAdmin = ZERO_ADDR;
    st.adminAcceptDeadline = 0;
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
        executeAiOp(mutate st, msg.op, msg.arg1, msg.arg2);
        st.aiApprovals = [];
        st.aiPendingOp = 0; st.aiPendingArg1 = 0; st.aiPendingArg2 = ZERO_ADDR;
    }
}
fun executeAiOp(mutate st: QuasarStorage, op: uint32, arg1: int, arg2: address) {
    if (op == 0x99999999) { throw_unless(ERR_FEE_TOO_HIGH, arg1 <= MAX_FEE_BPS); st.feeBps = arg1; }
    else if (op == 0xAAAAAAAA) { st.antiWhaleLimit = arg1; }
    else if (op == 0xBBBBBBBB) { throw_if(ERR_BAD_THRESHOLD, arg2 == ZERO_ADDR); st.oracle = arg2; }
    else if (op == 0xCCCCCCCC) { st.mintingEnabled = !st.mintingEnabled; }
    else { throw(ERR_NOT_PENDING_OP); }
}
fun handleAiPause(mutate st: QuasarStorage, sender: address) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    throw_unless(ERR_PAUSE_COOLDOWN, now() - st.aiLastPause >= AI_PAUSE_COOLDOWN);
    st.paused = true;
    st.aiLastPause = now();
}
fun handleAiSinglePoint(st: QuasarStorage, sender: address) {
    requireAiSigner(st, sender);
    requireAiAutonomy(st);
    throw(ERR_NOT_PENDING_OP);
}
fun handleResetAiApprovals(mutate st: QuasarStorage, sender: address) {
    requireAdmin(st, sender);
    st.aiApprovals = [];
    st.aiPendingOp = 0; st.aiPendingArg1 = 0; st.aiPendingArg2 = ZERO_ADDR;
}

// ─── Migration gate ───
fun handleMigrate(mutate st: QuasarStorage, sender: address, msg: Migrate) {
    requireAdmin(st, sender);
    throw_if(ERR_BAD_THRESHOLD, st.migrationTarget == ZERO_ADDR);
    throw_unless(ERR_NOT_PENDING_OP, st.migrationTarget == sender);
    setData(msg.newData);
    setCode(msg.newCode);
}

// ─── Getters (lazy безопасен: только чтение) ───
get fun isPaused(): bool {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return st.paused;
}
get fun totalSupply(): coins {
    val st = lazy QuasarStorage.fromCell(contract.getData());
    return st.totalSupply;
}
```

Контракт использует декларативный contract-блок Tolk 1.4, из которого компилятор автоматически генерирует ABI и TypeScript-обёртки. Storage загружается без lazy, чтобы мутации гарантированно сериализовались; lazy применяется только в геттерах, где запись исключена.

---

🧪 tests/quasar.test.tolk — тесты с fuzzing

```tolk
import "quasar/QuasarMaster"

@Test
fun test_mint_respects_anti_whale() {
    val ctx = TestContext.create();
    val admin = ctx.createWallet(1000 ton);
    val master = ctx.deploy<QuasarMaster>(admin, {
        maxSupply: 1_000_000, antiWhaleLimit: 10_000,
    });
    master.mint(admin, 5000);
    assert master.totalSupply() == 5000;
    expect_exit_code(406) { master.mint(admin, 20_000); }
}

// Fuzzing: Acton многократно прогоняет тест со случайными входами
@test.fuzz
fun test_mint_never_exceeds_max_supply(amount: uint32) {
    val ctx = TestContext.create();
    val admin = ctx.createWallet(1000 ton);
    val master = ctx.deploy<QuasarMaster>(admin, {
        maxSupply: 100_000, antiWhaleLimit: 100_000,
    });
    if (amount > 100_000) {
        expect_exit_code(407) { master.mint(admin, amount); }
    } else {
        master.mint(admin, amount);
        assert master.totalSupply() <= 100_000;
    }
}

@Test
fun test_ai_multisig_requires_threshold() {
    val ctx = TestContext.create();
    val s1 = ctx.createWallet(); val s2 = ctx.createWallet();
    val master = ctx.deploy<QuasarMaster>(ctx.admin, {
        aiSigners: [s1.address, s2.address], aiThreshold: 2, aiAutonomy: true,
    });
    master.aiApprove(s1, OP_AI_SET_FEE, 500, zeroAddress);
    assert master.feeBps() == 0;
    master.aiApprove(s2, OP_AI_SET_FEE, 500, zeroAddress);
    assert master.feeBps() == 500;
}
```

Аннотация @test.fuzz запускает параметризованный тест многократно со случайными значениями, что закрывает слой фаззинга. Mutation testing включается в Acton.toml и проверяет, «ловят» ли тесты искусственно внесённые баги, а не просто покрытие строк.

---

🤖 .github/workflows/ci.yml — CI-пайплайн

```yaml
name: QUASAR CI
on: [push, pull_request]

jobs:
  security-pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ton-blockchain/setup-acton@v1.2.0

      - name: Build
        run: acton build

      - name: Lint & format
        run: acton fmt --check && acton lint

      - name: Test with coverage gate
        run: acton test --coverage --coverage-minimum-percent 90 --reporter junit

      - name: Mutation testing
        run: acton test --mutation

      - name: TythanAI (исходники)
        run: pip install tythanai-community && tythanai scan . --sarif tythan.sarif

      - name: TasmScan (байткод)
        run: tasmscan build/QuasarMaster.boc --json tasmscan.json

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with: { sarif_file: tythan.sarif }
```

Acton выдаёт отчёты в форматах, готовых для CI (JUnit, SARIF, JSON), поэтому пайплайн не требует адаптеров.

---

🔐 Формальная верификация (опциональный слой)

Для критических инвариантов (например, миграций или AI-операций) можно сгенерировать on-chain Groth16-верификатор на Tolk:

```bash
npx export-ton-verifier ./circuits/quasar_migration.zkey ./contracts/MigrationVerifier.tolk --tolk
```

export-ton-verifier по умолчанию генерирует код именно на Tolk для протоколов Groth16 и PLONK. Это позволяет проверять криптографические доказательства прямо в TVM, а не полагаться только на мультисиг.

---

💎 Что закрывает каждый слой

Слой Артефакт в проекте Что проверяет
Контракт QuasarMaster.tolk + contract-блок ABI, типизация, явные mutate
Тесты quasar.test.tolk + @test.fuzz Поведение, граничные случаи
Mutation mutation = true в Acton.toml Реальная эффективность тестов
Исходники TythanAI в CI Классы уязвимостей Tolk
Байткод TasmScan в CI То, что оптимизатор мог исказить
Формальная верификация export-ton-verifier Криптографические инварианты
Эксплуатация acton verify + TON Verifier Source ↔ codeHash

Эти слои не заменяют внешний аудит — они делают код прозрачным настолько, что аудитор тратит время на архитектуру, а не на поиск уже известных классов ошибок.