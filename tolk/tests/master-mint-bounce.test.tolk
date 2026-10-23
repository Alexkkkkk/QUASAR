import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@contracts/QuasarCommon"
import "@contracts/QuasarMaster"
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

fun mintRequest(master: QuasarMaster, amount: coins, receiver: address): OutMessage {
    return createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("0.2"),
        dest: master.address,
        body: Mint { amount, receiver },
    });
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
    val bouncedBody = beginCell()
        .storeUint(0xffffffff, 32)
        .storeSlice(
            InternalTransfer {
                queryId: 18446744073709551615,
                amount,
                from: master.address,
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
        dest: master.address,
        body: bouncedBody,
    }).bounced();
    val bouncedTrace = net.send(recipientWallet, bounced);

    expect(bouncedTrace).toHaveSuccessfulTx({ to: master.address, bounced: true });
    expect(master.getJettonData().totalSupply).toEqual(0);
}
