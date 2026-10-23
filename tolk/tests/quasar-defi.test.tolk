import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
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
