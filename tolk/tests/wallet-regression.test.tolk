import "@acton/build"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@contracts/QuasarCommon"

struct RegressionWalletFixture {
    address: address
    owner: Treasury
    master: Treasury
}

fun regressionWalletDeployment(owner: address, master: address): AutoDeployAddress {
    return {
        workchain: BASECHAIN,
        stateInit: { code: build("QuasarWallet"), data: quasarWalletInitData(owner, master) },
    };
}

fun setupRegressionWallet(
    initialBalance: coins,
    ownerName: string = "wallet-regression-owner",
    masterName: string = "wallet-regression-master",
): RegressionWalletFixture {
    val owner = testing.treasury(ownerName);
    val master = testing.treasury(masterName);
    val deployment = regressionWalletDeployment(owner.address, master.address);
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
    expect(deployed).toHaveSuccessfulTx<InternalTransfer>({ to: walletAddress });
    return {
        address: walletAddress,
        owner,
        master,
    };
}

fun RegressionWalletFixture.walletData(self): JettonWalletData {
    return net.runGetMethod(self.address, "get_wallet_data");
}

get fun `test wallet: empty internal message is a harmless top-up`() {
    val wallet = setupRegressionWallet(grams("1"));
    val result = net.send(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: beginCell().endCell(),
        }),
    );
    expect(result).toHaveSuccessfulTx({ from: wallet.owner.address, to: wallet.address });
}

fun regressionTransfer(
    wallet: RegressionWalletFixture,
    queryId: uint64,
    amount: coins,
    destination: address,
): OutMessage {
    return createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.2"),
        dest: wallet.address,
        body: TokenTransfer {
            queryId,
            amount,
            destination,
            responseDestination: null,
            customPayload: null,
            forwardTonAmount: 0,
            forwardPayload: createEmptySlice(),
        },
    });
}

get fun `test wallet TEP-74: pending transfer query cannot be replayed after cooldown`() {
    testing.setNow(100);
    val wallet = setupRegressionWallet(1000000);
    val recipient = testing.treasury("wallet-regression-recipient");
    val amount: coins = 1000;

    val cursor = testing.createTraceIterationCursor(
        wallet.owner.address,
        regressionTransfer(wallet, 77, amount, recipient.address),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<TokenTransfer>({ to: wallet.address });
    cursor.close();
    expect(wallet.walletData().balance).toEqual(1000000 - amount - 3);

    testing.setNow(105);
    val replay = net.send(
        wallet.owner.address,
        regressionTransfer(wallet, 77, amount, recipient.address),
    );
    expect(replay).toHaveFailedTx<TokenTransfer>({
        from: wallet.owner.address,
        to: wallet.address,
        exitCode: 112,
    });
    expect(wallet.walletData().balance).toEqual(1000000 - amount - 3);
}

get fun `test wallet TEP-89: deployed wallet replies only when discovery value meets minimum`() {
    testing.setNow(100);
    val wallet = setupRegressionWallet(1000000);
    val requester = testing.treasury("wallet-regression-discovery-requester");

    val underfunded = net.send(
        requester.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.006"),
            dest: wallet.address,
            body: ProvideWalletAddress {
                queryId: 88,
                ownerAddress: requester.address as any_address,
                includeAddress: true,
            },
        }),
    );
    expect(underfunded).toHaveFailedTx<ProvideWalletAddress>({
        from: requester.address,
        to: wallet.address,
        exitCode: 116,
    });

    val discovery = net.send(
        requester.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.01"),
            dest: wallet.address,
            body: ProvideWalletAddress {
                queryId: 89,
                ownerAddress: requester.address as any_address,
                includeAddress: true,
            },
        }),
    );
    expect(discovery).toHaveSuccessfulTx<ProvideWalletAddress>({
        from: requester.address,
        to: wallet.address,
    });
    val expectedWallet = quasarWalletAddress(
        requester.address,
        wallet.master.address,
        build("QuasarWallet"),
    );
    val expectedOwnerRef = (requester.address as any_address).toCell();
    val expectedTakeWalletAddress = TakeWalletAddress {
        queryId: 89,
        walletAddress: expectedWallet as any_address,
        ownerAddress: expectedOwnerRef,
    }.toCell();
    expect(discovery).toHaveSuccessfulTx<TakeWalletAddress>({
        from: wallet.address,
        to: requester.address,
        body: expectedTakeWalletAddress,
    });

    val omitted = net.send(
        requester.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.01"),
            dest: wallet.address,
            body: ProvideWalletAddress {
                queryId: 90,
                ownerAddress: requester.address as any_address,
                includeAddress: false,
            },
        }),
    );
    expect(omitted).toHaveSuccessfulTx<TakeWalletAddress>({
        to: requester.address,
        body: TakeWalletAddress {
            queryId: 90,
            walletAddress: expectedWallet as any_address,
            ownerAddress: null,
        }.toCell(),
    });
}

get fun `test wallet pool marker cannot collide with pending high-bit TEP-74 query IDs`() {
    testing.setNow(100);
    val collidingId: uint64 = (QUASAR_POOL_PAYOUT_MARKER + 42) as uint64;
    val recipient = testing.treasury("wallet-regression-collision-recipient");

    val poolFirst = setupRegressionWallet(1000000);
    val poolCursor = testing.createTraceIterationCursor(
        poolFirst.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: poolFirst.address,
            body: PoolPayout {
                queryId: 42,
                amount: 1000,
                destination: recipient.address,
                responseDestination: null,
            },
        }),
    );
    val poolRoot = poolCursor.executeN(1);
    expect(poolRoot).toHaveSuccessfulTx<PoolPayout>({ to: poolFirst.address });
    poolCursor.close();
    val transferCollision = net.send(
        poolFirst.owner.address,
        regressionTransfer(poolFirst, collidingId, 1000, recipient.address),
    );
    expect(transferCollision).toHaveFailedTx<TokenTransfer>({
        from: poolFirst.owner.address,
        to: poolFirst.address,
        exitCode: 112,
    });

    val transferFirst = setupRegressionWallet(
        1000000,
        "wallet-regression-transfer-owner",
        "wallet-regression-transfer-master",
    );
    val transferCursor = testing.createTraceIterationCursor(
        transferFirst.owner.address,
        regressionTransfer(transferFirst, collidingId, 1000, recipient.address),
    );
    val transferRoot = transferCursor.executeN(1);
    expect(transferRoot).toHaveSuccessfulTx<TokenTransfer>({ to: transferFirst.address });
    transferCursor.close();
    val poolCollision = net.send(
        transferFirst.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: transferFirst.address,
            body: PoolPayout {
                queryId: 42,
                amount: 1000,
                destination: recipient.address,
                responseDestination: null,
            },
        }),
    );
    expect(poolCollision).toHaveFailedTx<PoolPayout>({
        from: transferFirst.owner.address,
        to: transferFirst.address,
        exitCode: 112,
    });
}

get fun `test wallet pool payout: marked bounce restores only the pool ledger and emits failure`() {
    testing.setNow(100);
    val initial: coins = 1000000;
    val amount: coins = 1000;
    val queryId: uint64 = 42;
    val wallet = setupRegressionWallet(initial);
    val recipient = testing.treasury("wallet-regression-pool-recipient");

    val cursor = testing.createTraceIterationCursor(
        wallet.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: wallet.address,
            body: PoolPayout {
                queryId,
                amount,
                destination: recipient.address,
                responseDestination: null,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<PoolPayout>({ to: wallet.address });
    cursor.close();
    expect(wallet.walletData().balance).toEqual(initial - amount);

    val markedQueryId: uint64 = queryId + QUASAR_POOL_PAYOUT_MARKER;
    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(
            InternalTransfer {
                queryId: markedQueryId,
                amount,
                from: wallet.owner.address,
                responseDestination: null,
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
    expect(bounceTrace).toHaveSuccessfulTx<PayoutFailed>({
        from: wallet.address,
        to: wallet.owner.address,
    });
    expect(wallet.walletData().balance).toEqual(initial);
}
