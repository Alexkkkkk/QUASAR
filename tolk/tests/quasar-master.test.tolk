import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@contracts/QuasarCommon"
import "@contracts/QuasarMaster"
import "@gen/QuasarWallet.code"
import "@wrappers/QuasarMaster.gen"

fun setupMaster(): (QuasarMaster, Treasury) {
    val owner = testing.treasury("quasar-master-owner");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    val master = QuasarMaster.fromStorage(
        newQuasarMasterStorage(
            owner.address,
            content,
            quasarWalletCompiledCode(),
        ),
    );
    val deployment = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("5"),
            dest: { workchain: master.address.getWorkchain(), stateInit: master.stateInit! },
            body: Deploy { queryId: 0 },
        }),
    );
    expect(deployment).toHaveSuccessfulDeploy({
        to: master.address,
    });
    return (master, owner);
}

get fun `test quasar master: initialization retains supply, fee, pool and pause defaults`() {
    val (master, _owner) = setupMaster();
    expect(master.getMaxSupply()).toEqual(QUASAR_MAX_SUPPLY);
    expect(master.getReserveBalance()).toEqual(0);
    expect(master.getCustodyBalance()).toEqual(0);
    expect(master.getFeeConfig().feeBps).toEqual(QUASAR_WALLET_FEE_BPS);
    expect(master.getFeeConfig().burnShare).toEqual(50);
    expect(master.getFeeConfig().maxTxBps).toEqual(QUASAR_MAX_TX_BPS);
    expect(master.getFeeConfig().maxWalletBps).toEqual(QUASAR_MAX_WALLET_BPS);
    expect(master.getFeeConfig().cooldown).toEqual(QUASAR_TRANSFER_COOLDOWN);
    expect(master.getBuybackState().threshold).toEqual(10000000000);
    expect(master.isPaused()).toEqual(false);
    expect(master.isTradingEnabled()).toEqual(true);
}

get fun `test quasar master: empty internal message is a harmless top-up`() {
    val (master, owner) = setupMaster();
    val result = master.sendAny(
        owner.address,
        beginCell().endCell(),
        { bounce: false, value: grams("0.2") },
    );
    expect(result).toHaveSuccessfulTx({ from: owner.address, to: master.address });
}

get fun `test quasar master: wallet getter uses compiled wallet code and exact owner master pair`() {
    val (master, owner) = setupMaster();
    val walletOwner = testing.treasury("quasar-master-wallet-owner");
    val expected = quasarWalletAddress(
        walletOwner.address,
        master.address,
        quasarWalletCompiledCode(),
    );
    val expectedContent = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    val jettonData = master.getJettonData();
    expect(master.getWalletAddress(walletOwner.address)).toEqual(expected);
    expect(jettonData.totalSupply).toEqual(0);
    expect(jettonData.mintable).toEqual(true);
    expect(jettonData.adminAddress).toEqual(owner.address);
    expect(jettonData.jettonContent).toEqual(expectedContent);
    expect(jettonData.jettonWalletCode).toEqual(quasarWalletCompiledCode());
}

get fun `test quasar master: signed AI authority begins disabled and uninitialized`() {
    val (master, _) = setupMaster();
    expect(master.getAiOracleKey()).toEqual(0);
    expect(master.getAiNonce()).toEqual(0);
    expect(master.getAiSignedDecisionCount()).toEqual(0);
    expect(master.getAiSignedDomain()).toEqual(0x51a5c3d2);
}

get fun `test quasar master TEP-89: addr_none owner receives addr_none wallet response`() {
    val (master, _) = setupMaster();
    val requester = testing.treasury("quasar-master-discovery-requester");
    val result = net.send(
        requester.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.01"),
            dest: master.address,
            body: ProvideWalletAddress {
                queryId: 17,
                ownerAddress: createAddressNone(),
                includeAddress: true,
            },
        }),
    );
    expect(result).toHaveSuccessfulTx<ProvideWalletAddress>({
        from: requester.address,
        to: master.address,
    });
    expect(result).toHaveSuccessfulTx<TakeWalletAddress>({
        to: requester.address,
    });
}

get fun `test quasar master: owner mint updates supply and recipient wallet, while tx cap rejects`() {
    testing.setNow(100);
    val (master, owner) = setupMaster();
    val recipient = testing.treasury("quasar-master-mint-recipient");
    val recipientWallet = master.getWalletAddress(recipient.address);

    val minted = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.5"),
            dest: master.address,
            body: Mint {
                amount: 1000,
                receiver: recipient.address,
            },
        }),
    );
    expect(minted).toHaveSuccessfulTx<Mint>({ from: owner.address, to: master.address });
    expect(minted).toHaveSuccessfulTx<InternalTransfer>({
        from: master.address,
        to: recipientWallet,
    });
    expect(master.getJettonData().totalSupply).toEqual(1000);
    expect(net.runGetMethod<JettonWalletData>(recipientWallet, "get_wallet_data").balance).toEqual(
        1000,
    );

    val rejected = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: Mint {
                amount: QUASAR_MAX_TX_AMOUNT + 1,
                receiver: recipient.address,
            },
        }),
    );
    expect(rejected).toHaveFailedTx<Mint>({
        from: owner.address,
        to: master.address,
        exitCode: 1101,
    });
    expect(master.getJettonData().totalSupply).toEqual(1000);
}

get fun `test quasar master: real wallet burn notification decrements supply once`() {
    testing.setNow(100);
    val (master, owner) = setupMaster();
    val recipient = testing.treasury("quasar-master-burn-recipient");
    val walletAddress = master.getWalletAddress(recipient.address);

    val minted = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.5"),
            dest: master.address,
            body: Mint {
                amount: 100,
                receiver: recipient.address,
            },
        }),
    );
    expect(minted).toHaveSuccessfulTx<Mint>({ to: master.address });
    expect(master.getJettonData().totalSupply).toEqual(100);

    val burned = net.send(
        recipient.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.2"),
            dest: walletAddress,
            body: TokenBurn {
                queryId: 77,
                amount: 40,
                responseDestination: owner.address,
                customPayload: null,
            },
        }),
    );
    expect(burned).toHaveSuccessfulTx<TokenBurn>({ from: recipient.address, to: walletAddress });
    expect(burned).toHaveSuccessfulTx<BurnNotification>({
        from: walletAddress,
        to: master.address,
    });
    expect(master.getJettonData().totalSupply).toEqual(60);
    expect(net.runGetMethod<JettonWalletData>(walletAddress, "get_wallet_data").balance).toEqual(
        60,
    );
}

get fun `test quasar master: forged and invalid BurnNotification preserve supply`() {
    testing.setNow(100);
    val (master, owner) = setupMaster();
    val recipient = testing.treasury("quasar-master-burn-callback-owner");
    val attacker = testing.treasury("quasar-master-burn-callback-attacker");
    val walletAddress = master.getWalletAddress(recipient.address);
    val minted = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.5"),
            dest: master.address,
            body: Mint {
                amount: 100,
                receiver: recipient.address,
            },
        }),
    );
    expect(minted).toHaveSuccessfulTx<Mint>({ to: master.address });

    val forged = net.send(
        attacker.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: BurnNotification {
                queryId: 78,
                amount: 1,
                sender: recipient.address,
                responseDestination: null,
            },
        }),
    );
    expect(forged).toHaveFailedTx<BurnNotification>({ to: master.address, exitCode: 1103 });

    val zeroAmount = net.send(
        walletAddress,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: BurnNotification {
                queryId: 79,
                amount: 0,
                sender: recipient.address,
                responseDestination: null,
            },
        }),
    );
    expect(zeroAmount).toHaveFailedTx<BurnNotification>({ to: master.address, exitCode: 1102 });

    val overSupply = net.send(
        walletAddress,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: BurnNotification {
                queryId: 80,
                amount: 101,
                sender: recipient.address,
                responseDestination: null,
            },
        }),
    );
    expect(overSupply).toHaveFailedTx<BurnNotification>({ to: master.address, exitCode: 1102 });
    expect(master.getJettonData().totalSupply).toEqual(100);
    expect(net.runGetMethod<JettonWalletData>(walletAddress, "get_wallet_data").balance).toEqual(
        100,
    );
}

get fun `test quasar master: mint accepts exact max supply and rejects the next unit`() {
    testing.setNow(100);
    val owner = testing.treasury("quasar-master-max-supply-owner");
    val content = beginCell()
        .storeUint(1, 8)
        .storeString("https://example.invalid/qsr.json")
        .endCell();
    var storage = newQuasarMasterStorage(owner.address, content, quasarWalletCompiledCode());
    storage.core.totalSupply = QUASAR_MAX_SUPPLY - 1;
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
    val recipient = testing.treasury("quasar-master-max-supply-recipient");

    val atLimit = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.5"),
            dest: master.address,
            body: Mint {
                amount: 1,
                receiver: recipient.address,
            },
        }),
    );
    expect(atLimit).toHaveSuccessfulTx<Mint>({ to: master.address });
    expect(master.getJettonData().totalSupply).toEqual(QUASAR_MAX_SUPPLY);

    val overLimit = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: Mint {
                amount: 1,
                receiver: recipient.address,
            },
        }),
    );
    expect(overLimit).toHaveFailedTx<Mint>({ to: master.address, exitCode: 1101 });
    expect(master.getJettonData().totalSupply).toEqual(QUASAR_MAX_SUPPLY);
}

get fun `test quasar master: owner transfer is delayed, cancellable and authorized`() {
    testing.setNow(100);
    val (master, owner) = setupMaster();
    val proposed = testing.treasury("quasar-master-proposed-owner");
    val attacker = testing.treasury("quasar-master-owner-attacker");

    val unauthorizedProposal = net.send(
        attacker.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: ProposeOwner { newOwner: proposed.address },
        }),
    );
    expect(unauthorizedProposal).toHaveFailedTx<ProposeOwner>({
        to: master.address,
        exitCode: 1000,
    });

    val unauthorizedCancel = net.send(
        attacker.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: CancelOwnerTransfer {},
        }),
    );
    expect(unauthorizedCancel).toHaveFailedTx<CancelOwnerTransfer>({
        to: master.address,
        exitCode: 1000,
    });

    val proposal = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: ProposeOwner { newOwner: proposed.address },
        }),
    );
    expect(proposal).toHaveSuccessfulTx<ProposeOwner>({ to: master.address });
    expect(master.getPendingOwner()).toEqual(proposed.address);
    expect(master.getOwnerTransferAt()).toEqual(100 + master.getOwnerTransferDelay());

    val prematureAcceptance = net.send(
        proposed.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: AcceptOwner {},
        }),
    );
    expect(prematureAcceptance).toHaveFailedTx<AcceptOwner>({
        to: master.address,
        exitCode: 1171,
    });
    expect(master.getJettonData().adminAddress).toEqual(owner.address);

    val cancellation = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: CancelOwnerTransfer {},
        }),
    );
    expect(cancellation).toHaveSuccessfulTx<CancelOwnerTransfer>({ to: master.address });
    expect(master.getPendingOwner()).toEqual(ZERO_ADDRESS);
    expect(master.getOwnerTransferAt()).toEqual(0);

    val secondProposal = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: ProposeOwner { newOwner: proposed.address },
        }),
    );
    expect(secondProposal).toHaveSuccessfulTx<ProposeOwner>({ to: master.address });
    testing.setNow(master.getOwnerTransferAt());

    val wrongAcceptor = net.send(
        attacker.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: AcceptOwner {},
        }),
    );
    expect(wrongAcceptor).toHaveFailedTx<AcceptOwner>({ to: master.address, exitCode: 1171 });

    val acceptance = net.send(
        proposed.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: AcceptOwner {},
        }),
    );
    expect(acceptance).toHaveSuccessfulTx<AcceptOwner>({ to: master.address });
    expect(master.getJettonData().adminAddress).toEqual(proposed.address);
    expect(master.getPendingOwner()).toEqual(ZERO_ADDRESS);
    expect(master.getOwnerTransferAt()).toEqual(0);

    val staleOwnerProposal = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: ProposeOwner { newOwner: attacker.address },
        }),
    );
    expect(staleOwnerProposal).toHaveFailedTx<ProposeOwner>({
        to: master.address,
        exitCode: 1000,
    });
}

get fun `test quasar master: ToggleMinting changes mintability without changing trading`() {
    testing.setNow(100);
    val (master, owner) = setupMaster();
    val recipient = testing.treasury("quasar-master-mint-toggle-recipient");
    expect(master.getJettonData().mintable).toEqual(true);
    expect(master.isTradingEnabled()).toEqual(true);

    val disabled = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: ToggleMinting { enabled: false },
        }),
    );
    expect(disabled).toHaveSuccessfulTx<ToggleMinting>({ to: master.address });
    expect(master.getJettonData().mintable).toEqual(false);
    expect(master.isTradingEnabled()).toEqual(true);

    val rejected = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: Mint {
                amount: 1,
                receiver: recipient.address,
            },
        }),
    );
    expect(rejected).toHaveFailedTx<Mint>({ to: master.address, exitCode: 1101 });
    expect(master.getJettonData().totalSupply).toEqual(0);

    val enabled = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("0.1"),
            dest: master.address,
            body: ToggleMinting { enabled: true },
        }),
    );
    expect(enabled).toHaveSuccessfulTx<ToggleMinting>({ to: master.address });
    expect(master.getJettonData().mintable).toEqual(true);
    expect(master.isTradingEnabled()).toEqual(true);
}
