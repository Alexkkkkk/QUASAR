/// Shared source of truth for Jetton message types and QuasarWallet.
/// Both quasar.tact (Master) and quasar_defi.tact (DeFi pool) import this file,
/// so the wallet code stays byte-identical across projects (issue #35, Wave 0).
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

message(0x51a5c3d1) PoolPayout { queryId: Int as uint64; amount: Int as coins; destination: Address }

message PayoutFailed { queryId: Int as uint64; amount: Int as coins; destination: Address }

contract QuasarWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;
    lastTxTime: Int;
    // Bounced message bodies are limited to 224 bits, so the original
    // response destination cannot always be read from bounced<T>. Retain it
    // while an outbound operation is in flight to complete TEP-74 refunds.
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
        // The hard cap is 1B QSR with 9 decimals. Master-owned distributions
        // (mint, treasury, custody, and DeFi accounting) are exempt because
        // those paths already enforce their own reserve/supply rules. User
        // wallet-to-wallet transfers must respect the documented 3% wallet
        // ceiling at the receiving wallet.
        if (msg.from != self.master) {
            require(self.balance + msg.amount <= 30_000_000_000_000_000, "Max wallet exceeded");
        }
        self.balance = self.balance + msg.amount;

        // Successful user/pool transfers must release the source wallet's pending
        // response state. Master-owned distributions have no debited source wallet,
        // so they do not receive a confirmation.
        if (msg.from != self.master) {
            let sourceInit: StateInit = initOf QuasarWallet(msg.from, self.master);
            send(SendParameters{
                to: contractAddress(sourceInit),
                value: 0,
                bounce: false,
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: TransferConfirmed{ queryId: msg.queryId }.toCell()
            });
        }

        // A Jetton wallet notifies the owner contract only when the sender
        // supplied forward TON. This is the standard deposit hook used by
        // QuasarMaster and QuasarDeFi.
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

        // TEP-74: whatever is left of the incoming message value after the
        // notification must go back to `response_destination` as an `excesses`
        // message. Ignoring errors and disabling bounce keeps a failed refund
        // from reverting the balance credit accounted above.
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
        require(receiver != null, "Unknown transfer");
        let receiverInit: StateInit = initOf QuasarWallet(receiver!!, self.master);
        require(sender() == contractAddress(receiverInit), "Unauthorized confirmation");
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

    // Restore tokens when a bounce rejects an outgoing transfer. This is
    // required by the TON Jetton wallet standard; without it, a failed
    // recipient transaction permanently burns the sender's wallet balance.
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
    }
    
    receive(msg: TokenTransfer) {
        require(msg.amount > 0, "Invalid amount");
        require(sender() == self.owner, "Not owner");
        require(msg.destination != newAddress(0, 0), "Invalid destination");
        require(self.balance >= msg.amount, "Insufficient");
        require(now() - self.lastTxTime >= 5, "Cooldown");
        // User transfers are capped at 1% of the 1B QSR hard cap. The
        // master-owned wallet is exempt because reserve payouts and DeFi
        // settlement are not ordinary user transfers.
        if (self.owner != self.master) {
            require(msg.amount <= 10_000_000_000_000_000, "Max tx exceeded");
        }
        self.lastTxTime = now();
        require(self.pendingResponseFees.get(msg.queryId) == null, "Query ID already used");
        
        let fee: Int = msg.amount * 30 / 10000;
        if (fee < 1) { fee = 1 }
        let sendAmount: Int = msg.amount - fee;
        require(sendAmount > 0, "Amount too small");
        self.balance = self.balance - msg.amount;
        self.pendingResponseFees.set(msg.queryId, fee);
        self.pendingResponseReceivers.set(msg.queryId, msg.destination);
        self.pendingResponses.set(msg.queryId, msg.responseDestination);
        
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
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
        send(SendParameters{ to: self.master, value: ton("0.05"), bounce: true, mode: SendPayGasSeparately, body: FeeTransfer{ queryId: msg.queryId, amount: fee, originalSender: self.owner, originalReceiver: msg.destination }.toCell() });
    }

    // Pool payouts are initiated by a contract that owns this wallet. They
    // bypass the user transfer fee because the pool already applies its AMM
    // fee and must deliver the quoted amount exactly.
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
                responseDestination: myAddress(),
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
    
    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{ balance: self.balance, owner: self.owner, master: self.master, walletCode: (initOf QuasarWallet(self.owner, self.master)).code }
    }
}
