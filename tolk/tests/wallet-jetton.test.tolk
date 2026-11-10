import "@acton/build"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@contracts/QuasarCommon"
import "@contracts/QuasarMaster"
import "@gen/QuasarWallet.code"
import "@wrappers/QuasarMaster.gen"

struct WalletFixture {
    address: address
    owner: Treasury
    master: Treasury
}

fun walletDeployment(
    owner: address,
    master: address,
    workchain: int8 = BASECHAIN,
): AutoDeployAddress {
    return {
        workchain,
        stateInit: { code: build("QuasarWallet"), data: quasarWalletInitData(owner, master) },
    };
}

fun setupWallet(initialBalance: coins, workchain: int8 = BASECHAIN): WalletFixture {
    val owner = testing.treasury("wallet-owner", workchain);
    val master = testing.treasury("wallet-master", BASECHAIN);
    val deployment = walletDeployment(owner.address, master.address, workchain);
    val walletAddress = deployment.calculateAddress();
    val deployed = net.send(
        master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("1"),
            dest: deployment,
            body: InternalTransfer {
                queryId: 1,
                amount: initialBalance,
                from: master.address,
                responseDestination: null,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(deployed).toHaveSuccessfulTx<InternalTransfer>({
        from: master.address,
        to: walletAddress,
    });
    expect(testing.isDeployed(walletAddress)).toEqual(true);
    return {
        address: walletAddress,
        owner,
        master,
    };
}

fun WalletFixture.walletData(self): JettonWalletData {
    return net.runGetMethod(self.address, "get_wallet_data");
}

fun transferMessage(
    wallet: WalletFixture,
    queryId: uint64,
    amount: coins,
    destination: address,
    responseDestination: address?,
    forwardTonAmount: coins = 0,
    attachedValue: coins = grams("0.2"),
): OutMessage {
    return createMessage({
        bounce: BounceMode.NoBounce,
        value: attachedValue,
        dest: wallet.address,
        body: TokenTransfer {
            queryId,
            amount,
            destination,
            responseDestination,
            customPayload: null,
            forwardTonAmount,
            forwardPayload: beginCell()
                .storeUint(0, 32)
                .storeString("wallet test")
                .endCell()
                .beginParse(),
        },
    });
}

get fun `test wallet TEP-74: transfer delivers amount and charges 30bps additionally`() {
    testing.setNow(100);
    val wallet = setupWallet(1000000);
    val recipient = testing.treasury("wallet-transfer-recipient");
    val response = testing.treasury("wallet-transfer-response");
    val amount: coins = 1000;
    val fee: coins = 3;
    val recipientWallet = quasarWalletAddress(
        recipient.address,
        wallet.master.address,
        build("QuasarWallet"),
    );

    val txs = net.send(
        wallet.owner.address,
        transferMessage(
            wallet,
            10,
            amount,
            recipient.address,
            response.address,
            grams("0.01"),
        ),
    );

    expect(txs).toHaveSuccessfulTx<TokenTransfer>({ from: wallet
            .owner
            .address, to: wallet.address });
    expect(txs).toHaveSuccessfulTx<FeeTransfer>({ from: wallet.address, to: wallet
            .master
            .address });
    expect(txs).toHaveSuccessfulTx<InternalTransfer>({ from: wallet.address, to: recipientWallet });
    expect(
        txs,
    ).toHaveSuccessfulTx<TokenNotification>({ from: recipientWallet, to: recipient.address });
    expect(txs).toHaveSuccessfulTx<TokenExcesses>({ to: response.address });
    expect(wallet.walletData().balance).toEqual(1000000 - amount - fee);
    expect(net.runGetMethod<JettonWalletData>(recipientWallet, "get_wallet_data").balance).toEqual(
        amount,
    );
}

get fun `test wallet TEP-74: returns every TON remaining after required transfer budgets`() {
    testing.setNow(100);
    val wallet = setupWallet(1000000);
    val recipient = testing.treasury("wallet-residual-recipient");
    val response = testing.treasury("wallet-residual-response");
    val amount: coins = 1000;
    val txs = net.send(
        wallet.owner.address,
        transferMessage(
            wallet,
            14,
            amount,
            recipient.address,
            response.address,
            0,
            grams("0.08"),
        ),
    );

    expect(txs).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    expect(txs).toHaveSuccessfulTx<TokenExcesses>({
        from: wallet.address,
        to: response.address,
        value: grams("0.01"),
    });
    expect(wallet.walletData().balance).toEqual(1000000 - amount - 3);
}

get fun `test wallet TEP-74: owner and excesses authorization are enforced`() {
    testing.setNow(100);
    val wallet = setupWallet(1000000);
    val outsider = testing.treasury("wallet-outsider");
    val recipient = testing.treasury("wallet-auth-recipient");
    val response = testing.treasury("wallet-auth-response");

    val unauthorized = net.send(
        outsider.address,
        transferMessage(wallet, 11, 1000, recipient.address, response.address),
    );
    expect(unauthorized).toHaveFailedTx<TokenTransfer>({
        from: outsider.address,
        to: wallet.address,
        exitCode: 107,
    });

    val cursor = testing.createTraceIterationCursor(
        wallet.owner.address,
        transferMessage(wallet, 12, 1000, recipient.address, response.address),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    cursor.close();

    val forgedExcess = net.send(
        outsider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.02"),
            dest: wallet.address,
            body: TokenExcesses { queryId: 12 },
        }),
    );
    expect(forgedExcess).toHaveFailedTx<TokenExcesses>({
        from: outsider.address,
        to: wallet.address,
        exitCode: 106,
    });
}

get fun `test wallet TEP-74: recipient bounce restores principal without double-crediting master fee`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val amount: coins = 1000;
    val wallet = setupWallet(initial);
    val recipient = testing.treasury("wallet-bounce-recipient");
    val response = testing.treasury("wallet-bounce-response");
    val cursor = testing.createTraceIterationCursor(
        wallet.owner.address,
        transferMessage(wallet, 13, amount, recipient.address, response.address),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    cursor.close();
    expect(wallet.walletData().balance).toEqual(initial - amount - 3);

    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(
            InternalTransfer {
                queryId: 13,
                amount,
                from: wallet.owner.address,
                responseDestination: response.address,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            }
            .toCell()
            .beginParse(),
        )
        .endCell();
    val bounced = createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.02"),
        dest: wallet.address,
        body: bouncedBody,
    }).bounced();
    val bounceTrace = net.send(recipient.address, bounced);

    expect(bounceTrace).toHaveSuccessfulTx({ to: wallet.address, bounced: true });
    expect(bounceTrace).toHaveSuccessfulTx<TokenExcesses>({ to: response.address });
    expect(wallet.walletData().balance).toEqual(initial - 3);
}

get fun `test wallet TEP-74: burn sends notification and master excesses clear pending response`() {
    testing.setNow(100);
    val wallet = setupWallet(1000000);
    val response = testing.treasury("wallet-burn-response");
    val burn = net.send(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: TokenBurn {
                queryId: 20,
                amount: 400,
                responseDestination: response.address,
                customPayload: null,
            },
        }),
    );
    expect(burn).toHaveSuccessfulTx<TokenBurn>({ from: wallet.owner.address, to: wallet.address });
    expect(burn).toHaveSuccessfulTx<BurnNotification>({ from: wallet.address, to: wallet
            .master
            .address });
    expect(wallet.walletData().balance).toEqual(999600);

    val masterExcess = net.send(
        wallet.master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.02"),
            dest: wallet.address,
            body: TokenExcesses { queryId: 20 },
        }),
    );
    expect(masterExcess).toHaveSuccessfulTx<TokenExcesses>({
        from: wallet.master.address,
        to: wallet.address,
    });
    expect(masterExcess).toHaveSuccessfulTx<TokenExcesses>({ to: response.address });
}

get fun `test wallet policy: tx cap, holder cap and cooldown match Tact constants`() {
    testing.setNow(100);
    val wallet = setupWallet(QUASAR_MAX_TX_AMOUNT + 2);
    val recipient = testing.treasury("wallet-policy-recipient");
    val response = testing.treasury("wallet-policy-response");

    val tooLarge = net.send(
        wallet.owner.address,
        transferMessage(wallet, 30, QUASAR_MAX_TX_AMOUNT + 1, recipient.address, response.address),
    );
    expect(tooLarge).toHaveFailedTx<TokenTransfer>({ to: wallet.address, exitCode: 111 });

    val first = net.send(
        wallet.owner.address,
        transferMessage(wallet, 31, 1000, recipient.address, response.address),
    );
    expect(first).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    val cooldown = net.send(
        wallet.owner.address,
        transferMessage(wallet, 32, 1000, recipient.address, response.address),
    );
    expect(cooldown).toHaveFailedTx<TokenTransfer>({ to: wallet.address, exitCode: 110 });

    val target = setupWallet(QUASAR_MAX_WALLET_AMOUNT - 1);
    val sourceOwner = testing.treasury("wallet-holder-source");
    val sourceWallet = quasarWalletAddress(
        sourceOwner.address,
        target.master.address,
        build("QuasarWallet"),
    );
    val holderCap = net.send(
        sourceWallet,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.02"),
            dest: target.address,
            body: InternalTransfer {
                queryId: 33,
                amount: 2,
                from: sourceOwner.address,
                responseDestination: null,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(holderCap).toHaveFailedTx<InternalTransfer>({ to: target.address, exitCode: 102 });
}

get fun `test wallet TEP-74: burn bounce restores balance and returns excesses`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val wallet = setupWallet(initial);
    val response = testing.treasury("wallet-burn-bounce-response");
    val cursor = testing.createTraceIterationCursor(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: TokenBurn {
                queryId: 40,
                amount: 400,
                responseDestination: response.address,
                customPayload: null,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<TokenBurn>({ to: wallet.address });
    cursor.close();
    expect(wallet.walletData().balance).toEqual(initial - 400);

    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(
            BurnNotification {
                queryId: 40,
                amount: 400,
                sender: wallet.owner.address,
                responseDestination: response.address,
            }
            .toCell()
            .beginParse(),
        )
        .endCell();
    val bounced = createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.1"),
        dest: wallet.address,
        body: bouncedBody,
    }).bounced();
    val bounceTrace = net.send(wallet.master.address, bounced);

    expect(bounceTrace).toHaveSuccessfulTx({ to: wallet.address, bounced: true });
    expect(bounceTrace).toHaveSuccessfulTx<TokenExcesses>({ to: response.address });
    expect(wallet.walletData().balance).toEqual(initial);
}

get fun `test wallet pool payout: rejected recipient bounces amount back and signals owner`() {
    testing.setNow(100);
    val wallet = setupWallet(1000);
    val recipient = testing.treasury("wallet-pool-payout-rejected-recipient");
    val recipientDeployment = walletDeployment(
        recipient.address,
        wallet.master.address,
    );

    // The destination is already at the holder cap. A 2-unit pool payout must
    // fail in the recipient wallet, bounce through the 256-bit TON prefix, and
    // restore the source wallet's amount exactly once.
    val fundRecipient = net.send(
        wallet.master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("1"),
            dest: recipientDeployment,
            body: InternalTransfer {
                queryId: 50,
                amount: QUASAR_MAX_WALLET_AMOUNT - 1,
                from: recipient.address,
                responseDestination: null,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(fundRecipient).toHaveSuccessfulTx<InternalTransfer>({
        from: wallet.master.address,
        to: recipientDeployment.calculateAddress(),
    });

    val before = wallet.walletData().balance;
    val payout = net.send(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: PoolPayout {
                queryId: 50,
                amount: 2,
                destination: recipient.address,
                responseDestination: wallet.owner.address,
            },
        }),
    );
    expect(payout).toHaveSuccessfulTx<PoolPayout>({ to: wallet.address });
    expect(payout).toHaveSuccessfulTx<PayoutFailed>({
        from: wallet.address,
        to: wallet.owner.address,
    });
    expect(wallet.walletData().balance).toEqual(before);
}

struct MasterBackedWalletFixture {
    address: address
    owner: Treasury
    master: QuasarMaster
}

fun setupMasterBackedWallet(initialBalance: coins): MasterBackedWalletFixture {
    val owner = testing.treasury("wallet-master-backed-owner");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/wallet-test.json")
        .endCell();
    var masterStorage = newQuasarMasterStorage(owner.address, content, quasarWalletCompiledCode());
    masterStorage.core.totalSupply = initialBalance;
    val master = QuasarMaster.fromStorage(masterStorage);
    val deployed = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("5"),
            dest: { workchain: master.address.getWorkchain(), stateInit: master.stateInit! },
            body: Deploy { queryId: 0 },
        }),
    );
    expect(deployed).toHaveSuccessfulDeploy({ to: master.address });

    val deployment = walletDeployment(owner.address, master.address);
    val funded = net.send(
        master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("1"),
            dest: deployment,
            body: InternalTransfer {
                queryId: 1,
                amount: initialBalance,
                from: master.address,
                responseDestination: null,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(funded).toHaveSuccessfulTx<InternalTransfer>({ to: walletDeployment(
            owner.address,
            master.address,
        ).calculateAddress() });

    val walletAddress = quasarWalletAddress(
        owner.address,
        master.address,
        quasarWalletCompiledCode(),
    );
    expect(net.runGetMethod<JettonWalletData>(walletAddress, "get_wallet_data").balance).toEqual(
        initialBalance,
    );
    return {
        address: walletAddress,
        owner,
        master,
    };
}

fun MasterBackedWalletFixture.walletData(self): JettonWalletData {
    return net.runGetMethod(self.address, "get_wallet_data");
}

fun protocolBounce(destination: address, originalBody: cell): OutMessage {
    var original = originalBody.beginParse();
    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(original.loadBits(224))
        .endCell();
    return createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.02"),
        dest: destination,
        body: bouncedBody,
    }).bounced();
}

get fun `test wallet bounce: FeeTransfer bounce restores only fee and clears pending query`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val amount: coins = 1000;
    val fee: coins = 3;
    val wallet = setupMasterBackedWallet(initial);
    val recipient = testing.treasury("wallet-fee-bounce-recipient");
    val response = testing.treasury("wallet-fee-bounce-response");
    val transfer = createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.2"),
        dest: wallet.address,
        body: TokenTransfer {
            queryId: 60,
            amount,
            destination: recipient.address,
            responseDestination: response.address,
            customPayload: null,
            forwardTonAmount: 0,
            forwardPayload: createEmptySlice(),
        },
    });
    val cursor = testing.createTraceIterationCursor(wallet.owner.address, transfer);
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    cursor.close();
    expect(wallet.walletData().balance).toEqual(initial - amount - fee);
    expect(net.runGetMethod<int>(wallet.master.address, "get_reserve_balance")).toEqual(0);

    val bouncedFee = protocolBounce(
        wallet.address,
        FeeTransfer {
            queryId: 60,
            amount: fee,
            originalSender: wallet.owner.address,
            originalReceiver: recipient.address,
        }.toCell(),
    );
    val bounceTrace = net.send(wallet.master.address, bouncedFee);
    expect(bounceTrace).toHaveSuccessfulTx({ to: wallet.address, bounced: true });
    expect(wallet.walletData().balance).toEqual(initial - amount);
    expect(net.runGetMethod<int>(wallet.master.address, "get_reserve_balance")).toEqual(0);

    testing.setNow(105);
    val reusedQuery = net.send(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: TokenTransfer {
                queryId: 60,
                amount: 2000,
                destination: recipient.address,
                responseDestination: response.address,
                customPayload: null,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(reusedQuery).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
}

get fun `test wallet T-24: accepted master fee is not credited again after recipient bounce`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val amount: coins = 1000;
    val fee: coins = 3;
    val retainedMasterFee: coins = fee - (fee * 50 / 100);
    val wallet = setupMasterBackedWallet(initial);
    val recipient = testing.treasury("wallet-t24-recipient");
    val response = testing.treasury("wallet-t24-response");
    val transfer = createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.2"),
        dest: wallet.address,
        body: TokenTransfer {
            queryId: 61,
            amount,
            destination: recipient.address,
            responseDestination: response.address,
            customPayload: null,
            forwardTonAmount: 0,
            forwardPayload: createEmptySlice(),
        },
    });
    val cursor = testing.createTraceIterationCursor(wallet.owner.address, transfer);
    val feeLeg = cursor.executeTill<FeeTransfer>({ to: wallet.master.address });
    expect(feeLeg).toHaveSuccessfulTx<FeeTransfer>({
        from: wallet.address,
        to: wallet.master.address,
    });
    cursor.close();
    expect(wallet.walletData().balance).toEqual(initial - amount - fee);
    expect(net.runGetMethod<int>(wallet.master.address, "get_reserve_balance")).toEqual(
        retainedMasterFee,
    );

    val confirmation = net.send(
        wallet.master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.005"),
            dest: wallet.address,
            body: TransferConfirmed { queryId: 61 },
        }),
    );
    expect(confirmation).toHaveSuccessfulTx<TransferConfirmed>({
        from: wallet.master.address,
        to: wallet.address,
    });
    expect(wallet.walletData().balance).toEqual(initial - amount - fee);

    val recipientWallet = quasarWalletAddress(
        recipient.address,
        wallet.master.address,
        quasarWalletCompiledCode(),
    );
    val bouncedRecipientLeg = protocolBounce(
        wallet.address,
        InternalTransfer {
            queryId: 61,
            amount,
            from: wallet.owner.address,
            responseDestination: response.address,
            forwardTonAmount: 0,
            forwardPayload: createEmptySlice(),
        }.toCell(),
    );
    val bounceTrace = net.send(recipientWallet, bouncedRecipientLeg);
    expect(bounceTrace).toHaveSuccessfulTx({ to: wallet.address, bounced: true });
    expect(wallet.walletData().balance).toEqual(initial - fee);
    expect(net.runGetMethod<int>(wallet.master.address, "get_reserve_balance")).toEqual(
        retainedMasterFee,
    );

    val delayedConfirmation = net.send(
        wallet.master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.005"),
            dest: wallet.address,
            body: TransferConfirmed { queryId: 61 },
        }),
    );
    expect(delayedConfirmation).toHaveSuccessfulTx<TransferConfirmed>({ to: wallet.address });
    expect(wallet.walletData().balance).toEqual(initial - fee);

    testing.setNow(105);
    val reusedQuery = net.send(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: TokenTransfer {
                queryId: 61,
                amount: 2000,
                destination: recipient.address,
                responseDestination: response.address,
                customPayload: null,
                forwardTonAmount: 0,
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(reusedQuery).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
}

get fun `test wallet T-24: recipient bounce before fee acceptance keeps principal and fee ledgers consistent`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val amount: coins = 1000;
    val fee: coins = 3;
    val retainedMasterFee: coins = fee - (fee * 50 / 100);
    val wallet = setupMasterBackedWallet(initial);
    val recipient = testing.treasury("wallet-t24-reverse-recipient");
    val response = testing.treasury("wallet-t24-reverse-response");
    val transfer = createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.2"),
        dest: wallet.address,
        body: TokenTransfer {
            queryId: 63,
            amount,
            destination: recipient.address,
            responseDestination: response.address,
            customPayload: null,
            forwardTonAmount: 0,
            forwardPayload: createEmptySlice(),
        },
    });
    val cursor = testing.createTraceIterationCursor(wallet.owner.address, transfer);
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    cursor.close();

    val recipientWallet = quasarWalletAddress(
        recipient.address,
        wallet.master.address,
        quasarWalletCompiledCode(),
    );
    val bouncedRecipientLeg = protocolBounce(
        wallet.address,
        InternalTransfer {
            queryId: 63,
            amount,
            from: wallet.owner.address,
            responseDestination: response.address,
            forwardTonAmount: 0,
            forwardPayload: createEmptySlice(),
        }.toCell(),
    );
    val bounceTrace = net.send(recipientWallet, bouncedRecipientLeg);
    expect(bounceTrace).toHaveSuccessfulTx({ to: wallet.address, bounced: true });
    expect(wallet.walletData().balance).toEqual(initial - fee);
    expect(net.runGetMethod<int>(wallet.master.address, "get_reserve_balance")).toEqual(0);

    val feeCursor = testing.createTraceIterationCursor(
        wallet.address,
        createMessage({
            bounce: BounceMode.Only256BitsOfBody,
            value: grams("0.05"),
            dest: wallet.master.address,
            body: FeeTransfer {
                queryId: 63,
                amount: fee,
                originalSender: wallet.owner.address,
                originalReceiver: recipient.address,
            },
        }),
    );
    val acceptedFee = feeCursor.executeTill<FeeTransfer>({ to: wallet.master.address });
    expect(acceptedFee).toHaveSuccessfulTx<FeeTransfer>({
        from: wallet.address,
        to: wallet.master.address,
    });
    expect(wallet.walletData().balance).toEqual(initial - fee);
    expect(net.runGetMethod<int>(wallet.master.address, "get_reserve_balance")).toEqual(
        retainedMasterFee,
    );
    feeCursor.close();

    val confirmation = net.send(
        wallet.master.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.005"),
            dest: wallet.address,
            body: TransferConfirmed { queryId: 63 },
        }),
    );
    expect(confirmation).toHaveSuccessfulTx<TransferConfirmed>({
        from: wallet.master.address,
        to: wallet.address,
    });
    expect(wallet.walletData().balance).toEqual(initial - fee);
}

get fun `test wallet TEP-74: forwardPayload forwards the maximum four refs unchanged`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val amount: coins = 1000;
    val wallet = setupWallet(initial);
    val recipient = testing.treasury("wallet-four-ref-recipient");
    val response = testing.treasury("wallet-four-ref-response");
    val recipientWallet = quasarWalletAddress(
        recipient.address,
        wallet.master.address,
        build("QuasarWallet"),
    );
    val forwardPayload = beginCell()
        .storeUint(0xdecafbad, 32)
        .storeRef(beginCell().storeUint(1, 8).endCell())
        .storeRef(beginCell().storeUint(2, 8).endCell())
        .storeRef(beginCell().storeUint(3, 8).endCell())
        .storeRef(beginCell().storeUint(4, 8).endCell())
        .endCell();
    val txs = net.send(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: TokenTransfer {
                queryId: 62,
                amount,
                destination: recipient.address,
                responseDestination: response.address,
                customPayload: null,
                forwardTonAmount: grams("0.01"),
                forwardPayload: forwardPayload.beginParse(),
            },
        }),
    );
    val expectedNotification = TokenNotification {
        queryId: 62,
        amount,
        from: wallet.owner.address,
        forwardPayload: forwardPayload.beginParse(),
    }.toCell();
    expect(txs).toHaveSuccessfulTx<TokenNotification>({
        from: recipientWallet,
        to: recipient.address,
        body: expectedNotification,
    });
    expect(wallet.walletData().balance).toEqual(initial - amount - 3);
    expect(net.runGetMethod<JettonWalletData>(recipientWallet, "get_wallet_data").balance).toEqual(
        amount,
    );
}
