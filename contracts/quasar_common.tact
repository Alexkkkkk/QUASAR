/// Shared source of truth for Jetton message types and QuasarWallet.
/// Both quasar.tact (Master) and quasar_defi.tact (DeFi pool) import this file,
/// so the wallet code stays byte-identical across projects (issue #35, Wave 0).
const QUASAR_STORAGE_RESERVE: Int = ton("0.05");
// Anti-whale policy is compiled into the wallet code. A Jetton wallet cannot
// read the current data cell of its master, so allowing the master to store
// arbitrary values here would create a false configuration surface. Any policy
// change must therefore ship through the timelocked wallet-code migration.
const QUASAR_MAX_SUPPLY: Int = ton("1000000000");
const QUASAR_WALLET_FEE_BPS: Int = 30;
const QUASAR_MAX_TX_BPS: Int = 100;
const QUASAR_MAX_WALLET_BPS: Int = 300;
const QUASAR_TRANSFER_COOLDOWN: Int = 5;
const QUASAR_MAX_TX_AMOUNT: Int = QUASAR_MAX_SUPPLY * QUASAR_MAX_TX_BPS / 10000;
const QUASAR_MAX_WALLET_AMOUNT: Int = QUASAR_MAX_SUPPLY * QUASAR_MAX_WALLET_BPS / 10000;

struct JettonWalletData { balance: Int; owner: Address; master: Address; walletCode: Cell }

message(0x0f8a7ea5) TokenTransfer { queryId: Int as uint64; amount: Int as coins; destination: Address; responseDestination: Address; customPayload: Cell?; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }

message(0x7362d09c) TokenNotification { queryId: Int as uint64; amount: Int as coins; from: Address; forwardPayload: Slice as remaining }

message(0x595f07bc) TokenBurn { queryId: Int as uint64; amount: Int as coins; responseDestination: Address; customPayload: Cell? }

message(0xd53276db) TokenExcesses { queryId: Int as uint64 }

message(0x7bdd97de) BurnNotification { queryId: Int as uint64; amount: Int as coins; sender: Address; responseDestination: Address }

message BurnConfirmed { queryId: Int as uint64 }

message TransferConfirmed { queryId: Int as uint64 }

message FeeTransfer { queryId: Int as uint64; amount: Int as coins; originalSender: Address; originalReceiver: Address }

message(0x178d4519) InternalTransfer { queryId: Int as uint64; amount: Int as coins; from: Address; responseDestination: Address; forwardTonAmount: Int as coins; forwardPayload: Slice as remaining }

// Pool payout dispatched by an owner contract of this wallet. The explicit
// `responseDestination` replaces the previous hardcoded `myAddress()` so the
// dispatcher (QuasarMaster / QuasarDeFi) can decide where TEP-74 `excesses`
// go: the master keeps routing them to its own wallet, while QuasarDeFi
// routes them to the DeFi contract to track per-leg payout settlement.
// Layout note: opcode(32) + queryId(64) + amount(coins, <=124) fit into the
// 224-bit bounced-body prefix, so bounced<PoolPayout> handlers can still read
// queryId and amount; the two trailing addresses are beyond the bounce cut
// and must not be accessed in a bounce handler.
message(0x51a5c3d1) PoolPayout { queryId: Int as uint64; amount: Int as coins; destination: Address; responseDestination: Address }

message PayoutFailed { queryId: Int as uint64; amount: Int as coins; destination: Address }

// ─── TEP-89 discoverable Jetton wallets ───
message(0x2c76b973) ProvideWalletAddress { queryId: Int as uint64; ownerAddress: Address; includeAddress: Bool }
message(0xd1735400) TakeWalletAddress { queryId: Int as uint64; walletAddress: Address; ownerAddress: Cell? }

contract QuasarWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    lastTxTime: Int;
    pendingResponses: map<Int, Address>;
    pendingResponseFees: map<Int, Int>;
    pendingResponseReceivers: map<Int, Address>;
    pendingBurnResponses: map<Int, Address>;
    pendingPoolPayouts: map<Int, Int>;
    pendingPoolPayoutReceivers: map<Int, Address>;

    init(owner: Address, master: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
        self.lastTxTime = 0;
    }

    receive(msg: InternalTransfer) {
        let sourceInit: StateInit = initOf QuasarWallet(msg.from, self.master);
        require(sender() == self.master || sender() == contractAddress(sourceInit), "Unauthorized");
        require(msg.amount > 0, "Invalid amount");
        if (msg.from != self.master) {
            require(self.balance + msg.amount <= QUASAR_MAX_WALLET_AMOUNT, "Max wallet exceeded");
        }
        self.balance = self.balance + msg.amount;

        if (msg.forwardTonAmount > 0) {
            send(SendParameters{
                to: self.owner,
                value: msg.forwardTonAmount,
                bounce: true,
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: TokenNotification{
                    queryId: msg.queryId,
                    amount: msg.amount,
                    from: msg.from,
                    forwardPayload: msg.forwardPayload
                }.toCell()
            });
        }

        if (msg.responseDestination != newAddress(0, 0)) {
            send(SendParameters{
                to: msg.responseDestination,
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors,
                body: TokenExcesses{ queryId: msg.queryId }.toCell()
            });
        }
    }

    receive(msg: TransferConfirmed) {
        let receiver: Address? = self.pendingResponseReceivers.get(msg.queryId);
        if (receiver == null) { return }
        require(sender() == self.master, "Unauthorized confirmation");
        self.pendingResponseFees.set(msg.queryId, null);
        self.pendingResponseReceivers.set(msg.queryId, null);
        self.pendingResponses.set(msg.queryId, null);
    }

    receive(msg: BurnConfirmed) {
        require(self.pendingBurnResponses.get(msg.queryId) != null, "Unknown burn");
        require(sender() == self.master, "Unauthorized confirmation");
        self.pendingBurnResponses.set(msg.queryId, null);
    }

    receive(msg: TokenExcesses) {
        let fee: Int? = self.pendingResponseFees.get(msg.queryId);
        if (fee != null) {
            let receiver: Address? = self.pendingResponseReceivers.get(msg.queryId);
            require(receiver != null, "Missing transfer receiver");
            let receiverInit: StateInit = initOf QuasarWallet(receiver!!, self.master);
            require(sender() == contractAddress(receiverInit), "Unauthorized excess");
            self.pendingResponseFees.set(msg.queryId, null);
            self.pendingResponses.set(msg.queryId, null);
            self.pendingResponseReceivers.set(msg.queryId, null);
            return;
        }

        let poolAmount: Int? = self.pendingPoolPayouts.get(msg.queryId);
        if (poolAmount != null) {
            let receiver: Address? = self.pendingPoolPayoutReceivers.get(msg.queryId);
            require(receiver != null, "Missing pool receiver");
            let receiverInit: StateInit = initOf QuasarWallet(receiver!!, self.master);
            require(sender() == contractAddress(receiverInit), "Unauthorized excess");
            self.pendingPoolPayouts.set(msg.queryId, null);
            self.pendingPoolPayoutReceivers.set(msg.queryId, null);
            return;
        }

        let burnResponse: Address? = self.pendingBurnResponses.get(msg.queryId);
        if (burnResponse != null) {
            require(sender() == self.master, "Unauthorized excess");
            self.pendingBurnResponses.set(msg.queryId, null);
            if (burnResponse!! != newAddress(0, 0) && burnResponse!! != myAddress()) {
                send(SendParameters{
                    to: burnResponse!!,
                    value: 0,
                    bounce: false,
                    mode: SendRemainingValue | SendIgnoreErrors,
                    body: TokenExcesses{ queryId: msg.queryId }.toCell()
                });
            }
        }
    }

    bounced(msg: bounced<InternalTransfer>) {
        require(msg.amount > 0, "Invalid amount");
        let poolAmount: Int? = self.pendingPoolPayouts.get(msg.queryId);
        if (poolAmount != null) {
            self.pendingPoolPayouts.set(msg.queryId, null);
            self.pendingPoolPayoutReceivers.set(msg.queryId, null);
            self.balance = self.balance + msg.amount;
            send(SendParameters{
                to: self.owner,
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors,
                body: PayoutFailed{ queryId: msg.queryId, amount: msg.amount, destination: self.owner }.toCell()
            });
            return;
        }

        let fee: Int? = self.pendingResponseFees.get(msg.queryId);
        let response: Address? = self.pendingResponses.get(msg.queryId);
        self.pendingResponseFees.set(msg.queryId, null);
        self.pendingResponses.set(msg.queryId, null);
        self.pendingResponseReceivers.set(msg.queryId, null);
        self.balance = self.balance + msg.amount + (fee == null ? 0 : fee!!);
        if (response != null && response!! != myAddress()) {
            send(SendParameters{
                to: response!!,
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors,
                body: TokenExcesses{ queryId: msg.queryId }.toCell()
            });
        }
    }

    bounced(msg: bounced<FeeTransfer>) {
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;
        self.pendingResponseFees.set(msg.queryId, null);
        self.pendingResponseReceivers.set(msg.queryId, null);
        self.pendingResponses.set(msg.queryId, null);
    }

    receive(msg: TokenTransfer) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(msg.destination != newAddress(0, 0), "Invalid destination");
        require(self.balance >= msg.amount, "Insufficient");
        require(now() - self.lastTxTime >= QUASAR_TRANSFER_COOLDOWN, "Cooldown");
        if (self.owner != self.master) {
            require(msg.amount <= QUASAR_MAX_TX_AMOUNT, "Max tx exceeded");
        }
        self.lastTxTime = now();
        require(self.pendingResponseFees.get(msg.queryId) == null, "Query ID already used");

        let fee: Int = msg.amount * QUASAR_WALLET_FEE_BPS / 10000;
        if (fee < 1) { fee = 1 }
        let sendAmount: Int = msg.amount - fee;
        require(sendAmount > 0, "Amount too small");
        require(myBalance() >= ton("0.075"), "Insufficient TON for transfer");
        require(context().value >= ton("0.07"), "Insufficient TON attached for transfer");
        self.balance = self.balance - msg.amount;
        self.pendingResponseFees.set(msg.queryId, fee);
        self.pendingResponseReceivers.set(msg.queryId, msg.destination);
        self.pendingResponses.set(msg.queryId, msg.responseDestination);

        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
        send(SendParameters{ to: self.master, value: ton("0.05"), bounce: true, mode: SendPayGasSeparately, body: FeeTransfer{ queryId: msg.queryId, amount: fee, originalSender: self.owner, originalReceiver: msg.destination }.toCell() });
        send(SendParameters{
            to: contractAddress(init),
            value: ton("0.02"),
            bounce: true,
            mode: SendPayGasSeparately,
            body: InternalTransfer{
                queryId: msg.queryId,
                amount: sendAmount,
                from: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: msg.forwardTonAmount,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: init.code,
            data: init.data
        });
        let residual: Int = context().value - ton("0.07") - ton("0.02");
        if (residual > 0) {
            send(SendParameters{ to: msg.responseDestination, value: residual, bounce: false, mode: SendPayGasSeparately | SendIgnoreErrors, body: TokenExcesses{ queryId: msg.queryId }.toCell() });
        }
    }

    receive(msg: PoolPayout) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(self.balance >= msg.amount, "Insufficient");
        self.balance = self.balance - msg.amount;
        require(self.pendingPoolPayouts.get(msg.queryId) == null, "Query ID already used");
        self.pendingPoolPayouts.set(msg.queryId, msg.amount);
        self.pendingPoolPayoutReceivers.set(msg.queryId, msg.destination);
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: InternalTransfer{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                responseDestination: msg.responseDestination,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    receive(msg: TokenBurn) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(self.balance >= msg.amount, "Insufficient");
        self.balance = self.balance - msg.amount;
        require(self.pendingBurnResponses.get(msg.queryId) == null, "Query ID already used");
        self.pendingBurnResponses.set(msg.queryId, msg.responseDestination);
        send(SendParameters{ to: self.master, value: 0, bounce: true, mode: SendRemainingValue, body: BurnNotification{ queryId: msg.queryId, amount: msg.amount, sender: self.owner, responseDestination: msg.responseDestination }.toCell() });
    }

    bounced(msg: bounced<BurnNotification>) {
        require(msg.amount > 0, "Invalid amount");
        self.balance = self.balance + msg.amount;
        let response: Address? = self.pendingBurnResponses.get(msg.queryId);
        self.pendingBurnResponses.set(msg.queryId, null);
        if (response != null && response!! != newAddress(0, 0) && response!! != myAddress()) {
            send(SendParameters{
                to: response!!,
                value: 0,
                bounce: false,
                mode: SendRemainingValue | SendIgnoreErrors,
                body: TokenExcesses{ queryId: msg.queryId }.toCell()
            });
        }
    }

    receive(msg: ProvideWalletAddress) {
        require(context().value >= ton("0.0061"), "Not enough TON for discovery");
        let owner: Cell? = null;
        if (msg.includeAddress) { owner = beginCell().storeAddress(self.owner).endCell() }
        send(SendParameters{
            to: sender(),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TakeWalletAddress{ queryId: msg.queryId, walletAddress: myAddress(), ownerAddress: owner }.toCell()
        });
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{ balance: self.balance, owner: self.owner, master: self.master, walletCode: (initOf QuasarWallet(self.owner, self.master)).code }
    }
}
