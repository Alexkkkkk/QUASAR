import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@contracts/QuasarCommon"
import "@contracts/QuasarMaster"
import "@contracts/QuasarMasterRecords"
import "@gen/QuasarWallet.code"
import "@wrappers/QuasarMaster.gen"

fun setupMintMaster(): (QuasarMaster, Treasury) {
    val owner = testing.treasury("master-mint-owner");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    val master = QuasarMaster.fromStorage(
        newQuasarMasterStorage(owner.address, content, quasarWalletCompiledCode()),
    );
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
    return (master, owner);
}

fun deployMasterFromStorage(owner: Treasury, storage: QuasarMasterStorage): QuasarMaster {
    val master = QuasarMaster.fromStorage(storage);
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
    return master;
}

fun mintRequest(master: QuasarMaster, amount: coins, receiver: address): OutMessage {
    return createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.2"),
        dest: master.address,
        body: Mint { amount, receiver },
    });
}

// Acton's .bounced() sets the bounced flag; this body supplies the TON 0xffffffff
// prefix and the 224 original body bits retained in a 256-bit bounce. This
// exercises bounced-message dispatch, not the network provenance of a bounce.
fun protocolBounce(master: QuasarMaster, originalBody: cell): OutMessage {
    var original = originalBody.beginParse();
    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(original.loadBits(224))
        .endCell();
    return createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.02"),
        dest: master.address,
        body: bouncedBody,
    }).bounced();
}

fun bouncedInternalTransfer(
    master: QuasarMaster,
    queryId: uint64,
    amount: coins,
    forwardPayload: slice,
): OutMessage {
    return protocolBounce(
        master,
        InternalTransfer {
            queryId,
            amount,
            from: master.address,
            responseDestination: master.address,
            forwardTonAmount: 0,
            forwardPayload,
        }.toCell(),
    );
}

fun bouncedPoolPayout(
    master: QuasarMaster,
    queryId: uint64,
    amount: coins,
    destination: address,
): OutMessage {
    return protocolBounce(
        master,
        PoolPayout {
            queryId,
            amount,
            destination,
            responseDestination: master.address,
        }.toCell(),
    );
}

get fun `test master mint: only owner can issue and a bounced mint restores supply`() {
    testing.setNow(100);
    val (master, owner) = setupMintMaster();
    val outsider = testing.treasury("master-mint-outsider");
    val recipient = testing.treasury("master-mint-recipient");
    val amount: coins = 1000;

    val unauthorized = net.send(outsider.address, mintRequest(master, amount, recipient.address));
    expect(unauthorized).toHaveFailedTx<Mint>({
        from: outsider.address,
        to: master.address,
        exitCode: 1000,
    });
    expect(master.getJettonData().totalSupply).toEqual(0);

    val cursor = testing.createTraceIterationCursor(
        owner.address,
        mintRequest(master, amount, recipient.address),
    );
    val root = cursor.executeN(1);
    expect(root).toHaveSuccessfulTx<Mint>({ from: owner.address, to: master.address });
    cursor.close();
    expect(master.getJettonData().totalSupply).toEqual(amount);

    val recipientWallet = master.getWalletAddress(recipient.address);
    val mintMarker = beginCell().storeUint(QUASAR_MINT_TRANSFER_MARKER, 32).endCell().beginParse();
    val bounced = bouncedInternalTransfer(master, 18446744073709551615, amount, mintMarker);
    val bouncedTrace = net.send(recipientWallet, bounced);

    expect(bouncedTrace).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getJettonData().totalSupply).toEqual(0);
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getCustodyBalance()).toEqual(0);

    // The same mint bounce cannot burn supply a second time.
    val replayed = net.send(recipientWallet, bounced);
    expect(replayed).toHaveFailedTx({ to: master.address, exitCode: 1300 });
    expect(master.getJettonData().totalSupply).toEqual(0);
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getCustodyBalance()).toEqual(0);
}

get fun `test master bounce: unknown InternalTransfer query ID preserves supply and reserve`() {
    testing.setNow(100);
    val (master, _) = setupMintMaster();
    val receiver = testing.treasury("master-unknown-bounce-receiver");
    val receiverWallet = master.getWalletAddress(receiver.address);
    val unknownQueryId: uint64 = 0x12345678;
    val bounced = bouncedInternalTransfer(master, unknownQueryId, 37, createEmptySlice());

    val firstBounce = net.send(receiverWallet, bounced);
    expect(firstBounce).toHaveSuccessfulTx({ to: master.address, bounced: true });

    // A replay with no matching payout must not create a second reserve credit.
    val replayed = net.send(receiverWallet, bounced);
    expect(replayed).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getJettonData().totalSupply).toEqual(0);
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getCustodyBalance()).toEqual(0);
}

get fun `test master bounce: unknown PoolPayout query ID preserves payout custody`() {
    testing.setNow(100);
    val (master, _) = setupMintMaster();
    val destination = testing.treasury("master-unknown-pool-bounce-destination");
    val bounceSource = master.getWalletAddress(master.address);
    val bounced = bouncedPoolPayout(master, 0x87654321, 41, destination.address);

    val outsider = testing.treasury("master-unknown-pool-bounce-outsider");
    val forged = net.send(master.getWalletAddress(outsider.address), bounced);
    expect(forged).toHaveFailedTx({ to: master.address, bounced: true, exitCode: 1301 });
    expect(master.getCustodyBalance()).toEqual(0);

    val firstBounce = net.send(bounceSource, bounced);
    expect(firstBounce).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getJettonData().totalSupply).toEqual(0);
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getCustodyBalance()).toEqual(0);

    val replayed = net.send(bounceSource, bounced);
    expect(replayed).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getJettonData().totalSupply).toEqual(0);
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getCustodyBalance()).toEqual(0);
}

get fun `test master bounce: known PoolPayout restores custody deposit exactly once`() {
    testing.setNow(100);
    val owner = testing.treasury("master-known-pool-bounce-owner");
    val destination = testing.treasury("master-known-pool-bounce-destination");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    var storage = newQuasarMasterStorage(owner.address, content, quasarWalletCompiledCode());
    storage
        .gov
        .pendingMasterPayouts
        .set(
            9,
            PendingMasterPayout {
                kind: 6,
                beneficiary: destination.address,
                amount: 41,
                d1: 0,
                d2: 0,
                d3: 0,
            },
        );
    val master = deployMasterFromStorage(owner, storage);
    val masterWallet = master.getWalletAddress(master.address);
    val bounced = bouncedPoolPayout(master, 9, 41, destination.address);

    val wrongSender = testing.treasury("master-known-pool-bounce-wrong-sender");
    val forged = net.send(master.getWalletAddress(wrongSender.address), bounced);
    expect(forged).toHaveFailedTx({ to: master.address, bounced: true, exitCode: 1301 });
    expect(master.getCustodyBalance()).toEqual(0);
    expect(master.getPendingQsrDeposit(destination.address)).toEqual(0);

    val wrongAmount = bouncedPoolPayout(master, 9, 42, destination.address);
    val mismatched = net.send(masterWallet, wrongAmount);
    expect(mismatched).toHaveFailedTx({ to: master.address, bounced: true, exitCode: 1301 });
    expect(master.getCustodyBalance()).toEqual(0);
    expect(master.getPendingQsrDeposit(destination.address)).toEqual(0);

    val bounce = net.send(masterWallet, bounced);
    expect(bounce).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getCustodyBalance()).toEqual(41);
    expect(master.getPendingQsrDeposit(destination.address)).toEqual(41);

    val replayed = net.send(masterWallet, bounced);
    expect(replayed).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getCustodyBalance()).toEqual(41);
    expect(master.getPendingQsrDeposit(destination.address)).toEqual(41);
}

get fun `test master bounce: known reserve payout restores exactly once`() {
    testing.setNow(100);
    val owner = testing.treasury("master-known-payout-owner");
    val beneficiary = testing.treasury("master-known-payout-beneficiary");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    var storage = newQuasarMasterStorage(owner.address, content, quasarWalletCompiledCode());
    storage
        .gov
        .pendingMasterPayouts
        .set(
            7,
            PendingMasterPayout {
                kind: 1,
                beneficiary: beneficiary.address,
                amount: 37,
                d1: 300,
                d2: 100,
                d3: 100,
            },
        );
    val master = deployMasterFromStorage(owner, storage);
    val payoutQueryId: uint64 = 9223372036854775815;
    val beneficiaryWallet = master.getWalletAddress(beneficiary.address);
    val bounced = bouncedInternalTransfer(master, payoutQueryId, 37, createEmptySlice());

    val rejectedSender = testing.treasury("master-known-payout-forged-sender");
    val forged = net.send(
        master.getWalletAddress(rejectedSender.address),
        bounced,
    );
    expect(forged).toHaveFailedTx({
        to: master.address,
        bounced: true,
        exitCode: 1301,
    });
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getStakingConfig().totalStaked).toEqual(0);
    expect(master.getStakeInfo(beneficiary.address)).toBeNull();

    val wrongAmount = bouncedInternalTransfer(
        master,
        payoutQueryId,
        38,
        createEmptySlice(),
    );
    val mismatched = net.send(beneficiaryWallet, wrongAmount);
    expect(mismatched).toHaveFailedTx({ to: master.address, bounced: true, exitCode: 1301 });
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getStakingConfig().totalStaked).toEqual(0);
    expect(master.getStakeInfo(beneficiary.address)).toBeNull();

    val bounce = net.send(beneficiaryWallet, bounced);
    expect(bounce).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getReserveBalance()).toEqual(37);
    expect(master.getStakingConfig().totalStaked).toEqual(37);
    val restoredStake = master.getStakeInfo(beneficiary.address);
    expect(restoredStake).toBeNotNull();
    if (restoredStake != null) {
        expect(restoredStake.amount).toEqual(37);
        expect(restoredStake.lockEnd).toEqual(300);
    }

    val replayed = net.send(beneficiaryWallet, bounced);
    expect(replayed).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getReserveBalance()).toEqual(37);
    expect(master.getStakingConfig().totalStaked).toEqual(37);
    val replayedStake = master.getStakeInfo(beneficiary.address);
    expect(replayedStake).toBeNotNull();
    if (replayedStake != null) {
        expect(replayedStake.amount).toEqual(37);
    }
}

get fun `test master bounce: matching buyback bounce restores reserves once`() {
    testing.setNow(100);
    val owner = testing.treasury("master-buyback-bounce-owner");
    val defi = testing.treasury("master-buyback-bounce-defi");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    var storage = newQuasarMasterStorage(owner.address, content, quasarWalletCompiledCode());
    storage.core.buybackPool = 20;
    storage.core.buybackSwapPending = 80;
    storage.core.buybackSwapQueryId = 9223372036854775817;
    storage.core.buybackSwapDefiAddress = defi.address;
    storage.core.defiAddress = defi.address;
    val master = deployMasterFromStorage(owner, storage);
    val queryId: uint64 = 9223372036854775817;
    val defiWallet = master.getWalletAddress(defi.address);
    val bounced = bouncedInternalTransfer(master, queryId, 80, createEmptySlice());

    val wrongSender = testing.treasury("master-buyback-bounce-wrong-sender");
    val rejected = net.send(master.getWalletAddress(wrongSender.address), bounced);
    expect(rejected).toHaveFailedTx({ to: master.address, bounced: true, exitCode: 1301 });
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getBuybackState().pool).toEqual(20);
    expect(master.getBuybackState().buybackSwapPending).toEqual(80);

    val bounce = net.send(defiWallet, bounced);
    expect(bounce).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getReserveBalance()).toEqual(80);
    expect(master.getBuybackState().pool).toEqual(100);
    expect(master.getBuybackState().buybackSwapPending).toEqual(0);
    expect(master.getBuybackState().buybackSwapQueryId).toEqual(0);

    val replayed = net.send(defiWallet, bounced);
    expect(replayed).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getReserveBalance()).toEqual(80);
    expect(master.getBuybackState().pool).toEqual(100);
}
