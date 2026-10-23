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

get fun `test quasar master: wallet getter uses compiled wallet code and exact owner master pair`() {
    val (master, _) = setupMaster();
    val walletOwner = testing.treasury("quasar-master-wallet-owner");
    val expected = quasarWalletAddress(
        walletOwner.address,
        master.address,
        quasarWalletCompiledCode(),
    );
    expect(master.getWalletAddress(walletOwner.address)).toEqual(expected);
    expect(master.getJettonData().jettonWalletCode).toEqual(quasarWalletCompiledCode());
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
