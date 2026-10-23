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

fun setupRegressionWallet(initialBalance: coins): RegressionWalletFixture {
    val owner = testing.treasury("wallet-regression-owner");
    val master = testing.treasury("wallet-regression-master");
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
    expect(discovery).toHaveSuccessfulTx<TakeWalletAddress>({
        from: wallet.address,
        to: requester.address,
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
