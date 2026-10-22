import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@acton/types/transaction"
import "@gen/QuasarWallet.code"
import "@contracts/QuasarMaster"
import "@wrappers/QuasarMaster.gen"
import "@contracts/QuasarCommon"

fun setupMaster(): (QuasarMaster, Treasury) {
    val owner = testing.treasury("quasar-master-owner");
    val content = beginCell().storeUint(1, 8).storeString("https://example.invalid/qsr.json").endCell();
    val master = QuasarMaster.fromStorage(newQuasarMasterStorage(
        owner.address,
        content,
        quasarWalletCompiledCode(),
    ));
    val deployment = net.send(owner.address, createMessage({
        bounce: BounceMode.NoBounce,
        value: grams("5"),
        dest: { workchain: master.address.getWorkchain(), stateInit: master.stateInit!! },
        body: Deploy { queryId: 0 },
    }));
    expect(deployment).toHaveSuccessfulDeploy({
        to: master.address,
    });
    return (master, owner);
}

get fun `test quasar master: initialization retains supply, fee, pool and pause defaults`() {
    val (master, owner) = setupMaster();
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
