import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@acton/testing/fuzz"
import "@contracts/QuasarCommon"
import "@contracts/QuasarDeFi"
import "@gen/QuasarWallet.code"
import "@wrappers/QuasarDeFi.gen"

struct DeFiFixture {
    defi: QuasarDeFi
    owner: Treasury
    qsrMaster: Treasury
}

fun setupDeFi(): DeFiFixture {
    testing.setNow(100);
    val owner = testing.treasury("quasar-defi-owner");
    val qsrMaster = testing.treasury("quasar-defi-qsr-master");
    val defi = QuasarDeFi.fromStorage(newQuasarDeFiStorage(owner.address, qsrMaster.address));
    val deployed = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("5"),
            dest: { workchain: defi.address.getWorkchain(), stateInit: defi.stateInit! },
            body: Deploy { queryId: 0 },
        }),
    );
    expect(deployed).toHaveSuccessfulDeploy<Deploy>({
        from: owner.address,
        to: defi.address,
    });
    return {
        defi,
        owner,
        qsrMaster,
    };
}

@test.fuzz(
    {
        runs: 64,
        max_test_rejects: 256,
        seed: 20261024,
    },
)
get fun `test DeFi estimateLpOut is nonnegative and symmetric before liquidity`(
    rawTonAmount: int,
    rawQsrAmount: int,
) {
    val tonAmount = fuzz.bound(rawTonAmount, 0, 1_000_000_000);
    val qsrAmount = fuzz.bound(rawQsrAmount, 0, 1_000_000_000);
    val fixture = setupDeFi();
    val forward = fixture.defi.estimateLpOut(tonAmount, qsrAmount);
    val reverse = fixture.defi.estimateLpOut(qsrAmount, tonAmount);
    expect(forward >= 0).toBeTrue();
    expect(forward).toEqual(reverse);
}

get fun `test quasar defi: empty internal message is a harmless top-up`() {
    val fixture = setupDeFi();
    val result = fixture
        .defi
        .sendAny(
            fixture.owner.address,
            beginCell().endCell(),
            { bounce: false, value: grams("0.2") },
        );
    expect(result).toHaveSuccessfulTx({ from: fixture.owner.address, to: fixture.defi.address });
}

fun addInitialLiquidity(fixture: DeFiFixture, provider: Treasury): void {
    val qsrAmount: coins = grams("100");
    val tonAmount: coins = grams("1");
    val poolWallet = quasarWalletDeployment(
        fixture.defi.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    val poolWalletAddress = poolWallet.calculateAddress();

    val deposit = net.send(
        fixture.qsrMaster.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("1"),
            dest: poolWallet,
            body: InternalTransfer {
                queryId: 1,
                amount: qsrAmount,
                from: provider.address,
                responseDestination: null,
                forwardTonAmount: grams("0.01"),
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(deposit).toHaveSuccessfulTx<InternalTransfer>({
        from: fixture.qsrMaster.address,
        to: poolWalletAddress,
    });
    expect(deposit).toHaveSuccessfulTx<TokenNotification>({
        from: poolWalletAddress,
        to: fixture.defi.address,
    });
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(qsrAmount);

    val expectedLp = fixture.defi.estimateLpOut(tonAmount, qsrAmount);
    val added = fixture
        .defi
        .sendAddLiquidity(
            provider.address,
            tonAmount,
            qsrAmount,
            expectedLp as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonAmount },
        );
    expect(added).toHaveSuccessfulTx<AddLiquidity>({
        from: provider.address,
        to: fixture.defi.address,
    });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(tonAmount);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(qsrAmount);
    expect(fixture.defi.poolInfo().totalSupply).toEqual(
        expectedLp + fixture.defi.minimumLiquidity(),
    );
    expect(fixture.defi.lpBalance(provider.address)).toEqual(expectedLp);
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(0);
}

fun defiPoolWalletAddress(fixture: DeFiFixture): address {
    val poolWallet = quasarWalletDeployment(
        fixture.defi.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    return poolWallet.calculateAddress();
}

// This constructs a bounced dispatch vector for handler tests; sender provenance
// is supplied separately by net.send and is not validated by the emulator.
fun bouncedDeFiCallback(
    defi: QuasarDeFi,
    originalBody: cell,
    value: coins,
): OutMessage {
    var original = originalBody.beginParse();
    var bouncedBody = beginCell().storeUint(0xffffffff, 32);
    if (original.remainingBitsCount() > 224) {
        bouncedBody.storeSlice(original.loadBits(224));
    } else {
        bouncedBody.storeSlice(original);
    }
    return createMessage({
        bounce: BounceMode.NoBounce,
        value,
        dest: defi.address,
        body: bouncedBody.endCell(),
    }).bounced();
}

fun depositQsrToDeFi(
    fixture: DeFiFixture,
    beneficiary: Treasury,
    amount: coins,
    queryId: uint64,
): void {
    val poolWallet = quasarWalletDeployment(
        fixture.defi.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    val walletAddress = poolWallet.calculateAddress();
    val deposit = net.send(
        fixture.qsrMaster.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("1"),
            dest: poolWallet,
            body: InternalTransfer {
                queryId,
                amount,
                from: beneficiary.address,
                responseDestination: null,
                forwardTonAmount: grams("0.01"),
                forwardPayload: createEmptySlice(),
            },
        }),
    );
    expect(deposit).toHaveSuccessfulTx<InternalTransfer>({ to: walletAddress });
    expect(deposit).toHaveSuccessfulTx<TokenNotification>({
        from: walletAddress,
        to: fixture.defi.address,
    });
    expect(fixture.defi.pendingQsrDeposit(beneficiary.address)).toEqual(amount);
}

get fun `test quasar defi: initialization retains owner, QSR master, and pool defaults`() {
    val fixture = setupDeFi();
    val pool = fixture.defi.poolInfo();
    expect(fixture.defi.owner()).toEqual(fixture.owner.address);
    expect(fixture.defi.qsrMaster()).toEqual(fixture.qsrMaster.address);
    expect(pool.totalSupply).toEqual(0);
    expect(pool.tonReserve).toEqual(0);
    expect(pool.qsrReserve).toEqual(0);
    expect(fixture.defi.feeConfig()).toEqual(30);
    expect(fixture.defi.minimumLiquidity()).toEqual(1000);
}

get fun `test quasar defi: unauthorized admin pause change is rejected`() {
    val fixture = setupDeFi();
    val outsider = testing.treasury("quasar-defi-admin-outsider");
    val result = fixture
        .defi
        .sendSetPaused(
            outsider.address,
            true,
            { bounce: false, value: grams("0.1") },
        );
    expect(result).toHaveFailedTx<SetPaused>({
        from: outsider.address,
        to: fixture.defi.address,
        exitCode: 1202,
    });
}

get fun `test quasar defi: forged token notification cannot create a pending deposit`() {
    val fixture = setupDeFi();
    val outsider = testing.treasury("quasar-defi-notification-outsider");
    val provider = testing.treasury("quasar-defi-notification-provider");
    val forged = fixture
        .defi
        .sendTokenNotification(
            outsider.address,
            1,
            grams("1"),
            provider.address,
            createEmptySlice(),
            { bounce: false, value: grams("0.1") },
        );
    expect(forged).toHaveFailedTx<TokenNotification>({
        from: outsider.address,
        to: fixture.defi.address,
        exitCode: 1100,
    });
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(0);
}

get fun `test quasar defi: authenticated token deposit funds the first liquidity position`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-liquidity-provider");
    addInitialLiquidity(fixture, provider);
}

get fun `test quasar defi: expired and insufficient-minimum swap requests preserve reserves`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-swap-provider");
    addInitialLiquidity(fixture, provider);
    val before = fixture.defi.poolInfo();

    val expired = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            grams("0.1"),
            0,
            testing.getNow(),
            { bounce: false, value: grams("0.1") },
        );
    expect(expired).toHaveFailedTx<SwapToQsr>({
        from: provider.address,
        to: fixture.defi.address,
        exitCode: 1003,
    });

    val minOut = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            grams("0.1"),
            grams("200"),
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.1") },
        );
    expect(minOut).toHaveFailedTx<SwapToQsr>({
        from: provider.address,
        to: fixture.defi.address,
        exitCode: 1153,
    });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);
}

get fun `test quasar defi: rejected removal QSR payout restores LP and farm stake`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-removal-bounce-provider");
    val farmFunding = grams("10");
    depositQsrToDeFi(fixture, fixture.owner, farmFunding, 700);
    val funded = fixture
        .defi
        .sendFundFarm(fixture.owner.address, farmFunding, { bounce: false, value: grams("0.1") });
    expect(funded).toHaveSuccessfulTx<FundFarm>({ to: fixture.defi.address });
    val enabled = fixture
        .defi
        .sendSetFarmEnabled(fixture.owner.address, true, { bounce: false, value: grams("0.1") });
    expect(enabled).toHaveSuccessfulTx<SetFarmEnabled>({ to: fixture.defi.address });
    addInitialLiquidity(fixture, provider);

    val beforePool = fixture.defi.poolInfo();
    val beforeLp = fixture.defi.lpBalance(provider.address);
    val beforeFarm = fixture.defi.userFarm(provider.address).staked;
    val removeLp = (beforeLp / 2) as coins;
    val quote = fixture.defi.estimateRemoveLiquidity(removeLp as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: RemoveLiquidity {
                lpAmount: removeLp,
                minTonOut: 0,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<RemoveLiquidity>({ to: fixture.defi.address });
    cursor.close();
    expect(fixture.defi.lpBalance(provider.address)).toEqual(beforeLp - removeLp);
    expect(fixture.defi.userFarm(provider.address).staked).toEqual(beforeFarm - removeLp);

    val payoutFailure = net.send(
        defiPoolWalletAddress(fixture),
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: PayoutFailed {
                queryId: 1,
                amount: quote.qsrReserve as coins,
                destination: provider.address,
            },
        }),
    );
    expect(payoutFailure).toHaveSuccessfulTx<PayoutFailed>({
        from: defiPoolWalletAddress(fixture),
        to: fixture.defi.address,
    });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(beforePool.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(beforePool.qsrReserve);
    expect(fixture.defi.poolInfo().totalSupply).toEqual(beforePool.totalSupply);
    expect(fixture.defi.lpBalance(provider.address)).toEqual(beforeLp);
    expect(fixture.defi.userFarm(provider.address).staked).toEqual(beforeFarm);
    expect(fixture.defi.farmInfo().staked).toEqual(beforeFarm);
}

get fun `test quasar defi: failed QSR swap can be refunded in TON and unlock the pool`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-qsr-refund-provider");
    addInitialLiquidity(fixture, provider);
    val before = fixture.defi.poolInfo();
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val payoutFailure = net.send(
        defiPoolWalletAddress(fixture),
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: PayoutFailed {
                queryId: 1,
                amount: quote.qsrOut as coins,
                destination: provider.address,
            },
        }),
    );
    expect(payoutFailure).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve + tonIn);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(0);

    val blocked = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            tonIn,
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonIn },
        );
    expect(blocked).toHaveFailedTx<SwapToQsr>({ to: fixture.defi.address, exitCode: 1243 });

    val refund = net.send(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimSwapTonRefund { swapId: 1 },
        }),
    );
    expect(refund).toHaveSuccessfulTx<ClaimSwapTonRefund>({ to: fixture.defi.address });
    expect(refund).toHaveSuccessfulTx<TonPayout>({ from: fixture
            .defi
            .address, to: provider.address });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);
    expect(fixture.defi.tonClaimsHeld()).toEqual(0);
}

get fun `test quasar defi: bounced PoolPayout restores swap and unlocks TON refund`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-pool-payout-bounce-provider");
    addInitialLiquidity(fixture, provider);
    val before = fixture.defi.poolInfo();
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(
            PoolPayout {
                queryId: 1,
                amount: quote.qsrOut as coins,
                destination: provider.address,
                responseDestination: fixture.defi.address,
            }
            .toCell()
            .beginParse(),
        )
        .endCell();
    val bounced = createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.1"),
        dest: fixture.defi.address,
        body: bouncedBody,
    }).bounced();
    val bounceTrace = net.send(defiPoolWalletAddress(fixture), bounced);
    expect(bounceTrace).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve + tonIn);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);

    val refund = net.send(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimSwapTonRefund { swapId: 1 },
        }),
    );
    expect(refund).toHaveSuccessfulTx<ClaimSwapTonRefund>({ to: fixture.defi.address });
    expect(refund).toHaveSuccessfulTx<TonPayout>({ to: provider.address });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);
}

get fun `test quasar defi: buyback notification is deferred across pending QSR settlement`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-deferred-buyback-provider");
    addInitialLiquidity(fixture, provider);
    val before = fixture.defi.poolInfo();
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val poolWallet = defiPoolWalletAddress(fixture);
    val marker = beginCell().storeUint(0x5f4a3b21, 32).endCell().beginParse();
    val deferred = fixture
        .defi
        .sendTokenNotification(
            poolWallet,
            9001,
            grams("1"),
            fixture.qsrMaster.address,
            marker,
            { bounce: false, value: grams("0.1") },
        );
    expect(deferred).toHaveSuccessfulTx<TokenNotification>({ to: fixture.defi.address });
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve - quote.qsrOut);

    val providerWallet = quasarWalletAddress(
        provider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    val settled = fixture
        .defi
        .sendTokenExcesses(
            providerWallet,
            (QUASAR_POOL_PAYOUT_MARKER + 1) as uint64,
            { bounce: false, value: grams("0.1") },
        );
    expect(settled).toHaveSuccessfulTx<TokenExcesses>({ to: fixture.defi.address });
    expect(settled).toHaveSuccessfulTx<BuybackTon>({
        from: fixture.defi.address,
        to: fixture.qsrMaster.address,
    });
}

get fun `test quasar defi: deferred buyback survives failed QSR payout until refund`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-deferred-refund-provider");
    addInitialLiquidity(fixture, provider);
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val poolWallet = defiPoolWalletAddress(fixture);
    val marker = beginCell().storeUint(0x5f4a3b21, 32).endCell().beginParse();
    val deferred = fixture
        .defi
        .sendTokenNotification(
            poolWallet,
            9101,
            grams("1"),
            fixture.qsrMaster.address,
            marker,
            { bounce: false, value: grams("0.1") },
        );
    expect(deferred).toHaveSuccessfulTx<TokenNotification>({ to: fixture.defi.address });

    val failed = fixture
        .defi
        .sendPayoutFailed(
            poolWallet,
            1,
            quote.qsrOut as coins,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(failed).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });

    val refund = fixture
        .defi
        .sendClaimSwapTonRefund(
            provider.address,
            1,
            { bounce: false, value: grams("0.1") },
        );
    expect(refund).toHaveSuccessfulTx<ClaimSwapTonRefund>({ to: fixture.defi.address });
    expect(refund).toHaveSuccessfulTx<TonPayout>({ to: provider.address });
    expect(refund).toHaveSuccessfulTx<BuybackTon>({
        from: fixture.defi.address,
        to: fixture.qsrMaster.address,
    });
}

get fun `test quasar defi: failed QSR payout can be retried and settles before trading resumes`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-qsr-retry-provider");
    addInitialLiquidity(fixture, provider);
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val payoutFailure = net.send(
        defiPoolWalletAddress(fixture),
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: PayoutFailed {
                queryId: 1,
                amount: quote.qsrOut as coins,
                destination: provider.address,
            },
        }),
    );
    expect(payoutFailure).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });

    val retried = net.send(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: fixture.defi.address,
            body: RetrySwapQsr {
                swapId: 1,
                destination: provider.address,
            },
        }),
    );
    expect(retried).toHaveSuccessfulTx<RetrySwapQsr>({ to: fixture.defi.address });
    val providerWallet = quasarWalletAddress(
        provider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    expect(retried).toHaveSuccessfulTx<TokenExcesses>({
        from: providerWallet,
        to: fixture.defi.address,
    });
    expect(net.runGetMethod<JettonWalletData>(providerWallet, "get_wallet_data").balance).toEqual(
        quote.qsrOut,
    );

    val nextSwap = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            tonIn,
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonIn },
        );
    expect(nextSwap).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
}

get fun `test quasar defi: bounced TON payout is claimable and retry destination is user controlled`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-ton-claim-provider");
    val destination = testing.treasury("quasar-defi-ton-claim-destination");
    addInitialLiquidity(fixture, provider);
    val qsrIn = grams("1");
    depositQsrToDeFi(fixture, provider, qsrIn, 701);
    val quote = fixture.defi.estimateSwapToTon(qsrIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: SwapToTon {
                qsrAmount: qsrIn,
                minTonOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToTon>({ to: fixture.defi.address });
    cursor.close();

    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(
            TonPayout {
                queryId: 1,
                amount: quote.tonOut as coins,
            }
            .toCell()
            .beginParse(),
        )
        .endCell();
    val bounced = createMessage({
        bounce: BounceMode.NoBounce,
        value: quote.tonOut as coins,
        dest: fixture.defi.address,
        body: bouncedBody,
    }).bounced();
    val bounceTrace = net.send(provider.address, bounced);
    expect(bounceTrace).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });

    val claim = fixture.defi.tonPayoutClaim(1);
    expect(claim.beneficiary).toEqual(provider.address);
    expect(claim.status).toEqual(1);
    expect(claim.amount > 0).toEqual(true);
    expect(fixture.defi.tonClaimsHeld()).toEqual(claim.amount);

    // Replaying the same protocol bounce is a no-op: it must not mint a
    // second claim or increase the physically-held liability.
    val replayedBounce = net.send(provider.address, bounced);
    expect(replayedBounce).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });
    expect(fixture.defi.tonPayoutClaim(1).amount).toEqual(claim.amount);
    expect(fixture.defi.tonClaimsHeld()).toEqual(claim.amount);

    val unauthorized = net.send(
        fixture.owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimTonPayout {
                claimId: 1,
                destination: fixture.owner.address,
            },
        }),
    );
    expect(unauthorized).toHaveFailedTx<ClaimTonPayout>({ to: fixture
            .defi
            .address, exitCode: 1251 });

    val retry = net.send(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimTonPayout {
                claimId: 1,
                destination: destination.address,
            },
        }),
    );
    expect(retry).toHaveSuccessfulTx<ClaimTonPayout>({ to: fixture.defi.address });
    expect(retry).toHaveSuccessfulTx<TonPayout>({
        from: fixture.defi.address,
        to: destination.address,
    });
    expect(fixture.defi.tonPayoutClaim(1).status).toEqual(2);
    expect(fixture.defi.tonClaimsHeld()).toEqual(0);
}

get fun `test quasar defi: forged TON payout bounce from an unrelated sender preserves claim and reserves`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-forged-ton-bounce-provider");
    val outsider = testing.treasury("quasar-defi-forged-ton-bounce-outsider");
    addInitialLiquidity(fixture, provider);
    val qsrIn = grams("1");
    depositQsrToDeFi(fixture, provider, qsrIn, 1201);
    val quote = fixture.defi.estimateSwapToTon(qsrIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: SwapToTon {
                qsrAmount: qsrIn,
                minTonOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToTon>({ to: fixture.defi.address });
    cursor.close();

    val beforePool = fixture.defi.poolInfo();
    val beforeClaim = fixture.defi.tonPayoutClaim(1);
    val beforeHeld = fixture.defi.tonClaimsHeld();
    val forged = bouncedDeFiCallback(
        fixture.defi,
        TonPayout {
            queryId: 1,
            amount: quote.tonOut as coins,
        }.toCell(),
        quote.tonOut as coins,
    );
    val rejected = net.send(outsider.address, forged);

    expect(rejected).toHaveFailedTx({
        from: outsider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 1230,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);
}

get fun `test quasar defi: forged PoolPayout bounce from an unrelated sender preserves pending settlement`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-forged-pool-bounce-provider");
    val outsider = testing.treasury("quasar-defi-forged-pool-bounce-outsider");
    addInitialLiquidity(fixture, provider);
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val beforePool = fixture.defi.poolInfo();
    val beforeFee = fixture.defi.feeAccumulatedQsr();
    val beforeClaim = fixture.defi.tonPayoutClaim(1);
    val beforeHeld = fixture.defi.tonClaimsHeld();
    val forged = bouncedDeFiCallback(
        fixture.defi,
        PoolPayout {
            queryId: 1,
            amount: quote.qsrOut as coins,
            destination: provider.address,
            responseDestination: fixture.defi.address,
        }.toCell(),
        grams("0.02"),
    );
    val rejected = net.send(outsider.address, forged);

    expect(rejected).toHaveFailedTx({
        from: outsider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 1235,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(beforeFee);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val blocked = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            tonIn,
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonIn },
        );
    expect(blocked).toHaveFailedTx<SwapToQsr>({ to: fixture.defi.address, exitCode: 1243 });
}

get fun `test quasar defi: truncated TON payout bounce payloads preserve claim and reserves`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-truncated-ton-bounce-provider");
    addInitialLiquidity(fixture, provider);
    val qsrIn = grams("1");
    depositQsrToDeFi(fixture, provider, qsrIn, 1202);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: SwapToTon {
                qsrAmount: qsrIn,
                minTonOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToTon>({ to: fixture.defi.address });
    cursor.close();

    val beforePool = fixture.defi.poolInfo();
    val beforeClaim = fixture.defi.tonPayoutClaim(1);
    val beforeHeld = fixture.defi.tonClaimsHeld();
    val noOpcode = bouncedDeFiCallback(fixture.defi, beginCell().endCell(), grams("0.02"));
    val partialOpcode = bouncedDeFiCallback(
        fixture.defi,
        beginCell().storeUint(0x746f, 16).endCell(),
        grams("0.02"),
    );
    val partialQuery = bouncedDeFiCallback(
        fixture.defi,
        beginCell().storeUint(0x746f6e70, 32).storeUint(1, 32).endCell(),
        grams("0.02"),
    );
    val partialCoins = bouncedDeFiCallback(
        fixture.defi,
        beginCell().storeUint(0x746f6e70, 32).storeUint(1, 64).storeUint(1, 3).endCell(),
        grams("0.02"),
    );

    val noOpcodeResult = net.send(provider.address, noOpcode);
    expect(noOpcodeResult).toHaveFailedTx({
        from: provider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val partialOpcodeResult = net.send(provider.address, partialOpcode);
    expect(partialOpcodeResult).toHaveFailedTx({
        from: provider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val partialQueryResult = net.send(provider.address, partialQuery);
    expect(partialQueryResult).toHaveFailedTx({
        from: provider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val partialCoinsResult = net.send(provider.address, partialCoins);
    expect(partialCoinsResult).toHaveFailedTx({
        from: provider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);
}

get fun `test quasar defi: normal SwapToTon consumes deposit and settles TON payout`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-normal-swap-ton-provider");
    addInitialLiquidity(fixture, provider);
    val qsrIn = grams("1");
    depositQsrToDeFi(fixture, provider, qsrIn, 9201);
    val before = fixture.defi.poolInfo();
    val beforeFee = fixture.defi.feeAccumulatedTon();
    val quote = fixture.defi.estimateSwapToTon(qsrIn as int);

    val swap = fixture
        .defi
        .sendSwapToTon(
            provider.address,
            qsrIn,
            quote.tonOut as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.1") },
        );
    expect(swap).toHaveSuccessfulTx<SwapToTon>({ to: fixture.defi.address });
    expect(swap).toHaveSuccessfulTx<TonPayout>({
        from: fixture.defi.address,
        to: provider.address,
    });
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve + qsrIn);
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve - quote.tonOut);
    expect(fixture.defi.feeAccumulatedTon()).toEqual(beforeFee + quote.fee);
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(0);
}

get fun `test quasar defi: normal SwapToQsr settles QSR excess and clears pending lock`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-normal-swap-qsr-provider");
    addInitialLiquidity(fixture, provider);
    val before = fixture.defi.poolInfo();
    val beforeFee = fixture.defi.feeAccumulatedQsr();
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);
    val providerWallet = quasarWalletAddress(
        provider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );

    val swap = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            tonIn,
            quote.qsrOut as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonIn },
        );
    expect(swap).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    expect(swap).toHaveSuccessfulTx<TokenExcesses>({
        from: providerWallet,
        to: fixture.defi.address,
    });
    expect(net.runGetMethod<JettonWalletData>(providerWallet, "get_wallet_data").balance).toEqual(
        quote.qsrOut,
    );
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve + tonIn);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve - quote.qsrOut);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(beforeFee + quote.fee);
    val nextSwap = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            tonIn,
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonIn },
        );
    expect(nextSwap).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
}

get fun `test quasar defi: proportional liquidity add and successful remove settle both legs`() {
    val fixture = setupDeFi();
    val firstProvider = testing.treasury("quasar-defi-balanced-first-provider");
    val secondProvider = testing.treasury("quasar-defi-balanced-second-provider");
    addInitialLiquidity(fixture, firstProvider);
    val tonAdded = grams("0.1");
    val qsrAdded = grams("10");
    depositQsrToDeFi(fixture, secondProvider, qsrAdded, 9202);
    val beforeAdd = fixture.defi.poolInfo();
    val lpOut = fixture.defi.estimateLpOut(tonAdded as int, qsrAdded as int);

    val added = fixture
        .defi
        .sendAddLiquidity(
            secondProvider.address,
            tonAdded,
            qsrAdded,
            lpOut as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonAdded },
        );
    expect(added).toHaveSuccessfulTx<AddLiquidity>({ to: fixture.defi.address });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(beforeAdd.tonReserve + tonAdded);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(beforeAdd.qsrReserve + qsrAdded);
    expect(fixture.defi.poolInfo().totalSupply).toEqual(beforeAdd.totalSupply + lpOut);
    expect(fixture.defi.lpBalance(secondProvider.address)).toEqual(lpOut);
    expect(fixture.defi.pendingQsrDeposit(secondProvider.address)).toEqual(0);

    val removeLp = (lpOut / 2) as coins;
    val beforeRemove = fixture.defi.poolInfo();
    val removal = fixture.defi.estimateRemoveLiquidity(removeLp as int);
    val providerWallet = quasarWalletAddress(
        secondProvider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    val removed = fixture
        .defi
        .sendRemoveLiquidity(
            secondProvider.address,
            removeLp,
            removal.tonReserve as coins,
            removal.qsrReserve as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.1") },
        );
    expect(removed).toHaveSuccessfulTx<RemoveLiquidity>({ to: fixture.defi.address });
    expect(removed).toHaveSuccessfulTx<TokenExcesses>({
        from: providerWallet,
        to: fixture.defi.address,
    });
    expect(removed).toHaveSuccessfulTx<TonPayout>({
        from: fixture.defi.address,
        to: secondProvider.address,
    });
    expect(net.runGetMethod<JettonWalletData>(providerWallet, "get_wallet_data").balance).toEqual(
        removal.qsrReserve,
    );
    expect(fixture.defi.poolInfo().tonReserve).toEqual(
        beforeRemove.tonReserve - removal.tonReserve,
    );
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(
        beforeRemove.qsrReserve - removal.qsrReserve,
    );
    expect(fixture.defi.poolInfo().totalSupply).toEqual(beforeRemove.totalSupply - removeLp);
    expect(fixture.defi.lpBalance(secondProvider.address)).toEqual(lpOut - removeLp);
}

get fun `test quasar defi: add liquidity trade and slippage limits preserve state`() {
    val fixture = setupDeFi();
    val initialProvider = testing.treasury("quasar-defi-limits-initial-provider");
    val provider = testing.treasury("quasar-defi-limits-provider");
    addInitialLiquidity(fixture, initialProvider);
    val before = fixture.defi.poolInfo();
    val qsrDeposit = grams("45");
    depositQsrToDeFi(fixture, provider, qsrDeposit, 9203);

    val qsrCap = fixture
        .defi
        .sendAddLiquidity(
            provider.address,
            grams("0.05"),
            grams("40"),
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.05") },
        );
    expect(qsrCap).toHaveFailedTx<AddLiquidity>({ to: fixture.defi.address, exitCode: 1124 });

    val tonCap = fixture
        .defi
        .sendAddLiquidity(
            provider.address,
            grams("0.5"),
            grams("5"),
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.5") },
        );
    expect(tonCap).toHaveFailedTx<AddLiquidity>({ to: fixture.defi.address, exitCode: 1123 });

    val lpOut = fixture.defi.estimateLpOut(grams("0.05") as int, grams("5") as int);
    val slippage = fixture
        .defi
        .sendAddLiquidity(
            provider.address,
            grams("0.05"),
            grams("5"),
            (lpOut + 1) as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.05") },
        );
    expect(slippage).toHaveFailedTx<AddLiquidity>({ to: fixture.defi.address, exitCode: 1127 });

    expect(fixture.defi.poolInfo()).toEqual(before);
    expect(fixture.defi.lpBalance(provider.address)).toEqual(0);
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(qsrDeposit);
}

get fun `test quasar defi: truncated PoolPayout bounce payloads preserve pending settlement and claims`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-truncated-pool-bounce-provider");
    addInitialLiquidity(fixture, provider);
    val tonIn = grams("0.1");
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    cursor.close();

    val beforePool = fixture.defi.poolInfo();
    val beforeFee = fixture.defi.feeAccumulatedQsr();
    val beforeClaim = fixture.defi.tonPayoutClaim(1);
    val beforeHeld = fixture.defi.tonClaimsHeld();
    val walletAddress = defiPoolWalletAddress(fixture);
    val noOpcode = bouncedDeFiCallback(fixture.defi, beginCell().endCell(), grams("0.02"));
    val partialOpcode = bouncedDeFiCallback(
        fixture.defi,
        beginCell().storeUint(0x51a5, 16).endCell(),
        grams("0.02"),
    );
    val partialQuery = bouncedDeFiCallback(
        fixture.defi,
        beginCell().storeUint(0x51a5c3d1, 32).storeUint(1, 32).endCell(),
        grams("0.02"),
    );
    val partialCoins = bouncedDeFiCallback(
        fixture.defi,
        beginCell().storeUint(0x51a5c3d1, 32).storeUint(1, 64).storeUint(1, 3).endCell(),
        grams("0.02"),
    );

    val noOpcodeResult = net.send(walletAddress, noOpcode);
    expect(noOpcodeResult).toHaveFailedTx({
        from: walletAddress,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(beforeFee);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val partialOpcodeResult = net.send(walletAddress, partialOpcode);
    expect(partialOpcodeResult).toHaveFailedTx({
        from: walletAddress,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(beforeFee);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val partialQueryResult = net.send(walletAddress, partialQuery);
    expect(partialQueryResult).toHaveFailedTx({
        from: walletAddress,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(beforeFee);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val partialCoinsResult = net.send(walletAddress, partialCoins);
    expect(partialCoinsResult).toHaveFailedTx({
        from: walletAddress,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 9,
    });
    expect(fixture.defi.poolInfo()).toEqual(beforePool);
    expect(fixture.defi.feeAccumulatedQsr()).toEqual(beforeFee);
    expect(fixture.defi.tonPayoutClaim(1)).toEqual(beforeClaim);
    expect(fixture.defi.tonClaimsHeld()).toEqual(beforeHeld);

    val stillPending = fixture
        .defi
        .sendSwapToQsr(
            provider.address,
            tonIn,
            0,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: tonIn },
        );
    expect(stillPending).toHaveFailedTx<SwapToQsr>({ to: fixture.defi.address, exitCode: 1243 });
}

get fun `test quasar defi: farm config accrual and payout bounce restore reward exactly once before retry`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-farm-retry-provider");
    val farmFunding = grams("10");
    val rewardPerSecond = 1_000_000;
    depositQsrToDeFi(fixture, fixture.owner, farmFunding, 9301);

    val funded = fixture
        .defi
        .sendFundFarm(fixture.owner.address, farmFunding, { bounce: false, value: grams("0.1") });
    expect(funded).toHaveSuccessfulTx<FundFarm>({ to: fixture.defi.address });
    val configured = fixture
        .defi
        .sendSetFarmConfig(
            fixture.owner.address,
            rewardPerSecond as coins,
            100,
            200,
            { bounce: false, value: grams("0.1") },
        );
    expect(configured).toHaveSuccessfulTx<SetFarmConfig>({ to: fixture.defi.address });
    expect(fixture.defi.farmInfo().rewardPerSecond).toEqual(rewardPerSecond);
    expect(fixture.defi.farmInfo().startTime).toEqual(100);
    expect(fixture.defi.farmInfo().endTime).toEqual(200);

    val enabled = fixture
        .defi
        .sendSetFarmEnabled(fixture.owner.address, true, { bounce: false, value: grams("0.1") });
    expect(enabled).toHaveSuccessfulTx<SetFarmEnabled>({ to: fixture.defi.address });
    addInitialLiquidity(fixture, provider);
    val staked = fixture.defi.userFarm(provider.address).staked;
    expect(staked).toEqual(fixture.defi.lpBalance(provider.address));
    expect(fixture.defi.farmInfo().staked).toEqual(staked);
    val reserveBeforeClaim = fixture.defi.farmRewardReserve();

    testing.setNow(110);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimFarmRewards {},
        }),
    );
    val claimRoot = cursor.executeN(1);
    expect(claimRoot).toHaveSuccessfulTx<ClaimFarmRewards>({ to: fixture.defi.address });
    cursor.close();
    val reserveAfterClaim = fixture.defi.farmRewardReserve();
    val expectedReward = (staked * fixture.defi.farmInfo().accRewardPerShare) / 1_000_000_000;
    expect(expectedReward > 0).toBeTrue();
    expect(reserveBeforeClaim - reserveAfterClaim >= expectedReward).toBeTrue();

    val providerWallet = quasarWalletAddress(
        provider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    val poolWallet = defiPoolWalletAddress(fixture);
    val failedPayout = fixture
        .defi
        .sendPayoutFailed(
            poolWallet,
            1,
            expectedReward as coins,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(failedPayout).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });
    expect(fixture.defi.userFarm(provider.address).pending).toEqual(expectedReward);
    expect(fixture.defi.userFarm(provider.address).staked).toEqual(staked);
    expect(fixture.defi.farmRewardReserve()).toEqual(reserveAfterClaim);

    val replayedFailure = fixture
        .defi
        .sendPayoutFailed(
            poolWallet,
            1,
            expectedReward as coins,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(replayedFailure).toHaveFailedTx<PayoutFailed>({
        to: fixture.defi.address,
        exitCode: 1106,
    });
    expect(fixture.defi.userFarm(provider.address).pending).toEqual(expectedReward);
    expect(fixture.defi.farmRewardReserve()).toEqual(reserveAfterClaim);

    val retried = fixture
        .defi
        .sendClaimFarmRewards(
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(retried).toHaveSuccessfulTx<ClaimFarmRewards>({ to: fixture.defi.address });
    expect(retried).toHaveSuccessfulTx<TokenExcesses>({
        from: providerWallet,
        to: fixture.defi.address,
    });
    expect(net.runGetMethod<JettonWalletData>(providerWallet, "get_wallet_data").balance).toEqual(
        expectedReward,
    );
    expect(fixture.defi.userFarm(provider.address).pending).toEqual(0);
    expect(fixture.defi.userFarm(provider.address).staked).toEqual(staked);
    expect(fixture.defi.farmRewardReserve()).toEqual(reserveAfterClaim);
}

get fun `test quasar defi: emergency farm withdrawal forfeits rewards but returns the unstaked LP`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-emergency-farm-provider");
    val farmFunding = grams("10");
    val rewardPerSecond = 1_000_000;
    depositQsrToDeFi(fixture, fixture.owner, farmFunding, 9302);
    val funded = fixture
        .defi
        .sendFundFarm(fixture.owner.address, farmFunding, { bounce: false, value: grams("0.1") });
    expect(funded).toHaveSuccessfulTx<FundFarm>({ to: fixture.defi.address });
    val configured = fixture
        .defi
        .sendSetFarmConfig(
            fixture.owner.address,
            rewardPerSecond as coins,
            100,
            200,
            { bounce: false, value: grams("0.1") },
        );
    expect(configured).toHaveSuccessfulTx<SetFarmConfig>({ to: fixture.defi.address });
    val enabled = fixture
        .defi
        .sendSetFarmEnabled(fixture.owner.address, true, { bounce: false, value: grams("0.1") });
    expect(enabled).toHaveSuccessfulTx<SetFarmEnabled>({ to: fixture.defi.address });
    addInitialLiquidity(fixture, provider);
    val lpBefore = fixture.defi.lpBalance(provider.address);
    val poolBefore = fixture.defi.poolInfo();

    testing.setNow(110);
    val cursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimFarmRewards {},
        }),
    );
    val claimRoot = cursor.executeN(1);
    expect(claimRoot).toHaveSuccessfulTx<ClaimFarmRewards>({ to: fixture.defi.address });
    cursor.close();
    val expectedReward = (lpBefore * fixture.defi.farmInfo().accRewardPerShare) / 1_000_000_000;
    expect(expectedReward > 0).toBeTrue();
    val failedPayout = fixture
        .defi
        .sendPayoutFailed(
            defiPoolWalletAddress(fixture),
            1,
            expectedReward as coins,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(failedPayout).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });
    expect(fixture.defi.userFarm(provider.address).pending).toEqual(expectedReward);
    val reserveAfterBounce = fixture.defi.farmRewardReserve();

    val emergency = fixture
        .defi
        .sendEmergencyWithdrawFarm(
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(emergency).toHaveSuccessfulTx<EmergencyWithdrawFarm>({ to: fixture.defi.address });
    expect(fixture.defi.userFarm(provider.address).staked).toEqual(0);
    expect(fixture.defi.userFarm(provider.address).pending).toEqual(0);
    expect(fixture.defi.farmInfo().staked).toEqual(0);
    expect(fixture.defi.lpBalance(provider.address)).toEqual(lpBefore);
    expect(fixture.defi.poolInfo().totalSupply).toEqual(poolBefore.totalSupply);
    expect(fixture.defi.poolInfo().tonReserve).toEqual(poolBefore.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(poolBefore.qsrReserve);
    expect(fixture.defi.farmRewardReserve()).toEqual(reserveAfterBounce);
}

get fun `test quasar defi: bounced pending QSR refund is restored once and retry succeeds`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-refund-pending-provider");
    val qsrAmount = grams("1");
    depositQsrToDeFi(fixture, provider, qsrAmount, 9401);

    val refundCursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: RefundPendingQsr {},
        }),
    );
    val refundRoot = refundCursor.executeN(1);
    expect(refundRoot).toHaveSuccessfulTx<RefundPendingQsr>({ to: fixture.defi.address });
    refundCursor.close();

    val poolWallet = defiPoolWalletAddress(fixture);
    val payoutFailure = fixture
        .defi
        .sendPayoutFailed(
            poolWallet,
            1,
            qsrAmount,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(payoutFailure).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(qsrAmount);

    val replayedFailure = fixture
        .defi
        .sendPayoutFailed(
            poolWallet,
            1,
            qsrAmount,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(replayedFailure).toHaveFailedTx<PayoutFailed>({
        to: fixture.defi.address,
        exitCode: 1106,
    });
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(qsrAmount);

    val providerWallet = quasarWalletAddress(
        provider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );
    val retried = fixture
        .defi
        .sendRefundPendingQsr(
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(retried).toHaveSuccessfulTx<RefundPendingQsr>({ to: fixture.defi.address });
    expect(retried).toHaveSuccessfulTx<TokenExcesses>({
        from: providerWallet,
        to: fixture.defi.address,
    });
    expect(net.runGetMethod<JettonWalletData>(providerWallet, "get_wallet_data").balance).toEqual(
        qsrAmount,
    );
    expect(fixture.defi.pendingQsrDeposit(provider.address)).toEqual(0);
}

get fun `test quasar defi: bounced TON refund after failed QSR swap remains claimable and retryable`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-ton-refund-provider");
    val destination = testing.treasury("quasar-defi-ton-refund-destination");
    addInitialLiquidity(fixture, provider);
    val before = fixture.defi.poolInfo();
    val tonIn = grams("0.1");
    val quote = fixture.defi.estimateSwapToQsr(tonIn as int);

    val swapCursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: tonIn,
            dest: fixture.defi.address,
            body: SwapToQsr {
                tonAmount: tonIn,
                minQsrOut: 0,
                deadline: (testing.getNow() + 3600) as uint32,
            },
        }),
    );
    val swapRoot = swapCursor.executeN(1);
    expect(swapRoot).toHaveSuccessfulTx<SwapToQsr>({ to: fixture.defi.address });
    swapCursor.close();

    val payoutFailure = fixture
        .defi
        .sendPayoutFailed(
            defiPoolWalletAddress(fixture),
            1,
            quote.qsrOut as coins,
            provider.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(payoutFailure).toHaveSuccessfulTx<PayoutFailed>({ to: fixture.defi.address });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve + tonIn);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);

    val refundCursor = testing.createTraceIterationCursor(
        provider.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: ClaimSwapTonRefund { swapId: 1 },
        }),
    );
    val refundRoot = refundCursor.executeN(1);
    expect(refundRoot).toHaveSuccessfulTx<ClaimSwapTonRefund>({ to: fixture.defi.address });
    refundCursor.close();

    val bounced = bouncedDeFiCallback(
        fixture.defi,
        TonPayout {
            queryId: 1,
            amount: tonIn,
        }.toCell(),
        tonIn,
    );
    val bounceTrace = net.send(provider.address, bounced);
    expect(bounceTrace).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });
    val claim = fixture.defi.tonPayoutClaim(1);
    expect(claim.beneficiary).toEqual(provider.address);
    expect(claim.status).toEqual(1);
    expect(claim.amount).toEqual(tonIn);
    expect(fixture.defi.tonClaimsHeld()).toEqual(tonIn);

    val retried = fixture
        .defi
        .sendClaimTonPayout(
            provider.address,
            1,
            destination.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(retried).toHaveSuccessfulTx<ClaimTonPayout>({ to: fixture.defi.address });
    expect(retried).toHaveSuccessfulTx<TonPayout>({
        from: fixture.defi.address,
        to: destination.address,
    });
    expect(fixture.defi.tonPayoutClaim(1).status).toEqual(2);
    expect(fixture.defi.tonClaimsHeld()).toEqual(0);
    expect(fixture.defi.poolInfo().tonReserve).toEqual(before.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(before.qsrReserve);
}

get fun `test quasar defi: successful QSR removal followed by bounced TON leg is claimable once`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-removal-ton-bounce-provider");
    val destination = testing.treasury("quasar-defi-removal-ton-bounce-destination");
    addInitialLiquidity(fixture, provider);
    val lpBefore = fixture.defi.lpBalance(provider.address);
    val removeLp = (lpBefore / 2) as coins;
    val quote = fixture.defi.estimateRemoveLiquidity(removeLp as int);
    val poolBefore = fixture.defi.poolInfo();
    val providerWallet = quasarWalletAddress(
        provider.address,
        fixture.qsrMaster.address,
        quasarWalletCompiledCode(),
    );

    val removed = fixture
        .defi
        .sendRemoveLiquidity(
            provider.address,
            removeLp,
            quote.tonReserve as coins,
            quote.qsrReserve as coins,
            (testing.getNow() + 3600) as uint32,
            { bounce: false, value: grams("0.1") },
        );
    expect(removed).toHaveSuccessfulTx<RemoveLiquidity>({ to: fixture.defi.address });
    expect(removed).toHaveSuccessfulTx<TokenExcesses>({
        from: providerWallet,
        to: fixture.defi.address,
    });
    expect(removed).toHaveSuccessfulTx<TonPayout>({
        from: fixture.defi.address,
        to: provider.address,
    });
    val providerQsrBalance = net
        .runGetMethod<JettonWalletData>(
            providerWallet,
            "get_wallet_data",
        )
        .balance;
    expect(providerQsrBalance).toEqual(quote.qsrReserve);
    val poolAfterRemoval = fixture.defi.poolInfo();
    expect(poolAfterRemoval.tonReserve).toEqual(poolBefore.tonReserve - quote.tonReserve);
    expect(poolAfterRemoval.qsrReserve).toEqual(poolBefore.qsrReserve - quote.qsrReserve);
    expect(fixture.defi.lpBalance(provider.address)).toEqual(lpBefore - removeLp);

    val bounced = bouncedDeFiCallback(
        fixture.defi,
        TonPayout {
            queryId: 1,
            amount: quote.tonReserve as coins,
        }.toCell(),
        quote.tonReserve as coins,
    );
    val bounceTrace = net.send(provider.address, bounced);
    expect(bounceTrace).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });
    val claim = fixture.defi.tonPayoutClaim(1);
    expect(claim.beneficiary).toEqual(provider.address);
    expect(claim.status).toEqual(1);
    expect(claim.amount).toEqual(quote.tonReserve);
    expect(fixture.defi.tonClaimsHeld()).toEqual(quote.tonReserve);

    val retried = fixture
        .defi
        .sendClaimTonPayout(
            provider.address,
            1,
            destination.address,
            { bounce: false, value: grams("0.1") },
        );
    expect(retried).toHaveSuccessfulTx<ClaimTonPayout>({ to: fixture.defi.address });
    expect(retried).toHaveSuccessfulTx<TonPayout>({
        from: fixture.defi.address,
        to: destination.address,
    });
    expect(fixture.defi.tonPayoutClaim(1).status).toEqual(2);
    expect(fixture.defi.tonClaimsHeld()).toEqual(0);
    expect(net.runGetMethod<JettonWalletData>(providerWallet, "get_wallet_data").balance).toEqual(
        providerQsrBalance,
    );
    expect(fixture.defi.poolInfo()).toEqual(poolAfterRemoval);
    expect(fixture.defi.lpBalance(provider.address)).toEqual(lpBefore - removeLp);
}

get fun `test quasar defi: BuybackTon bounce restores TON reserve and fees once`() {
    val fixture = setupDeFi();
    val provider = testing.treasury("quasar-defi-buyback-bounce-liquidity-provider");
    val outsider = testing.treasury("quasar-defi-buyback-bounce-outsider");
    addInitialLiquidity(fixture, provider);
    val beforePool = fixture.defi.poolInfo();
    val beforeFee = fixture.defi.feeAccumulatedTon();
    val qsrIn = grams("1");
    val quote = fixture.defi.estimateSwapToTon(qsrIn as int);
    val poolWallet = defiPoolWalletAddress(fixture);
    val queryId: uint64 = 9501;
    val marker = beginCell().storeUint(0x5f4a3b21, 32).endCell().beginParse();
    val cursor = testing.createTraceIterationCursor(
        poolWallet,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: fixture.defi.address,
            body: TokenNotification {
                queryId,
                amount: qsrIn,
                from: fixture.qsrMaster.address,
                forwardPayload: marker,
            },
        }),
    );
    val buybackRoot = cursor.executeN(1);
    expect(buybackRoot).toHaveSuccessfulTx<TokenNotification>({ to: fixture.defi.address });
    cursor.close();
    expect(fixture.defi.poolInfo().tonReserve).toEqual(beforePool.tonReserve - quote.tonOut);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(beforePool.qsrReserve + qsrIn);
    expect(fixture.defi.feeAccumulatedTon()).toEqual(beforeFee + quote.fee);

    val bounced = bouncedDeFiCallback(
        fixture.defi,
        beginCell()
            .storeUint(0x2c7e91a4, 32)
            .storeUint(queryId, 64)
            .storeCoins(quote.tonOut as coins)
            .storeCoins(qsrIn)
            .endCell(),
        quote.tonOut as coins,
    );
    val bounceTrace = net.send(fixture.qsrMaster.address, bounced);
    expect(bounceTrace).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(beforePool.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(beforePool.qsrReserve + qsrIn);
    expect(fixture.defi.feeAccumulatedTon()).toEqual(beforeFee);

    val replayed = net.send(fixture.qsrMaster.address, bounced);
    expect(replayed).toHaveSuccessfulTx({ to: fixture.defi.address, bounced: true });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(beforePool.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(beforePool.qsrReserve + qsrIn);
    expect(fixture.defi.feeAccumulatedTon()).toEqual(beforeFee);

    val forged = net.send(outsider.address, bounced);
    expect(forged).toHaveFailedTx({
        from: outsider.address,
        to: fixture.defi.address,
        bounced: true,
        exitCode: 1234,
    });
    expect(fixture.defi.poolInfo().tonReserve).toEqual(beforePool.tonReserve);
    expect(fixture.defi.poolInfo().qsrReserve).toEqual(beforePool.qsrReserve + qsrIn);
    expect(fixture.defi.feeAccumulatedTon()).toEqual(beforeFee);
}
