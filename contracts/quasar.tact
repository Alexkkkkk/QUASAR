import "@stdlib/deploy";
import "@stdlib/content";

// QUASAR Jetton Master Contract
// The brightest token in the TON universe

message Mint {
    amount: Int;
    receiver: Address;
}

message BurnNotification {
    queryId: Int as uint64;
    amount: Int;
    sender: Address;
    responseDestination: Address;
}

struct JettonData {
    totalSupply: Int;
    mintable: Bool;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

contract QuasarMaster with Deployable {
    totalSupply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell;
    walletCode: Cell;

    init(owner: Address, content: Cell, walletCode: Cell) {
        self.totalSupply = 0;
        self.mintable = true;
        self.owner = owner;
        self.content = content;
        self.walletCode = walletCode;
    }

    receive(msg: Mint) {
        require(sender() == self.owner, "Not authorized to mint");
        require(self.mintable, "Minting disabled");
        
        self.totalSupply = self.totalSupply + msg.amount;
        
        let init: StateInit = initOf QuasarWallet(msg.receiver, myAddress());
        send(SendParameters{
            to: contractAddress(init),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenNotification{
                queryId: 0,
                amount: msg.amount,
                from: self.owner,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    receive(msg: BurnNotification) {
        let walletInit: StateInit = initOf QuasarWallet(msg.sender, myAddress());
        let walletAddress: Address = contractAddress(walletInit);
        require(sender() == walletAddress, "Unauthorized burn notification");
        
        self.totalSupply = self.totalSupply - msg.amount;
        
        // Return excess TON to response destination
        if (msg.responseDestination != newAddress(0, 0)) {
            send(SendParameters{
                to: msg.responseDestination,
                value: 0,
                bounce: false,
                mode: SendRemainingValue,
                body: "Excess TON returned".asComment()
            });
        }
    }

    receive("Stop Minting") {
        require(sender() == self.owner, "Not authorized");
        self.mintable = false;
    }

    get fun get_jetton_data(): JettonData {
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            adminAddress: self.owner,
            jettonContent: self.content,
            jettonWalletCode: self.walletCode
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        let init: StateInit = initOf QuasarWallet(owner, myAddress());
        return contractAddress(init);
    }
}

// Token notification message for wallet
message TokenNotification {
    queryId: Int as uint64;
    amount: Int as coins;
    from: Address;
    forwardPayload: Slice as remaining;
}

// QUASAR Jetton Wallet Contract
contract QuasarWallet {
    balance: Int as coins;
    owner: Address;
    master: Address;

    init(owner: Address, master: Address) {
        self.balance = 0;
        self.owner = owner;
        self.master = master;
    }

    receive(msg: TokenNotification) {
        // Only accept from master
        require(sender() == self.master, "Unauthorized token notification");
        self.balance = self.balance + msg.amount;
    }

    receive(msg: TokenTransfer) {
        require(sender() == self.owner, "Not wallet owner");
        require(self.balance >= msg.amount, "Insufficient balance");
        
        self.balance = self.balance - msg.amount;
        
        let init: StateInit = initOf QuasarWallet(msg.destination, self.master);
        let destinationAddress: Address = contractAddress(init);
        
        send(SendParameters{
            to: destinationAddress,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: TokenNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                from: self.owner,
                forwardPayload: msg.forwardPayload
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    receive(msg: TokenBurn) {
        require(sender() == self.owner, "Not wallet owner");
        require(self.balance >= msg.amount, "Insufficient balance");
        
        self.balance = self.balance - msg.amount;
        
        send(SendParameters{
            to: self.master,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: BurnNotification{
                queryId: msg.queryId,
                amount: msg.amount,
                sender: self.owner,
                responseDestination: msg.responseDestination
            }.toCell()
        });
    }

    get fun get_wallet_data(): JettonWalletData {
        return JettonWalletData{
            balance: self.balance,
            owner: self.owner,
            master: self.master,
            walletCode: (initOf QuasarWallet(self.owner, self.master)).code
        };
    }
}

// Messages
message TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message TokenBurn {
    queryId: Int as uint64;
    amount: Int as coins;
    responseDestination: Address;
    customPayload: Cell?;
}

// Data structures
struct JettonWalletData {
    balance: Int;
    owner: Address;
    master: Address;
    walletCode: Cell;
}
