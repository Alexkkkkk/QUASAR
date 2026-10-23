// Emulator-only executable scenario. Never open a configured wallet in broadcast mode.
import "@acton/io"
import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@acton/testing/expect"
import "@contracts/QuasarCommon"
import "@contracts/QuasarMaster"
import "@gen/QuasarWallet.code"
import "@wrappers/QuasarMaster.gen"
import "@wrappers/QuasarWallet.gen"

fun main() {
    assert (!net.isBroadcasting()) throw 200;
    val owner = scripts.wallet("quasar-local-owner");
    val recipient = scripts.wallet("quasar-local-recipient");
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
    assert (deployed.waitForFirstTransaction() != null) throw 202;
    expect(master.getJettonData().totalSupply).toEqual(0);
    expect(master.isPaused()).toEqual(false);
    // Keep the emulator smoke value intentionally small; large mint economics
    // are covered by the Tact suite. Mint uses the normal referenced Either
    // body so the scenario also covers the canonical TEP message shape.
    val amount: coins = 1;
    val minted = net.send(
        owner.address,
        createMessage({
            bounce: BounceMode.NoBounce,
            value: grams("1"),
            dest: master.address,
            // check-disable-next-line create-message-body-to-cell
            body: Mint {
                amount,
                receiver: recipient.address,
            }.toCell(),
        }),
    );
    val trace = minted.waitForTrace();
    assert (trace != null) throw 203;
    expect(minted).toHaveSuccessfulTx<Mint>({ from: owner.address, to: master.address });
    val wallet = QuasarWallet.fromAddress(master.getWalletAddress(recipient.address));
    val data = wallet.getWalletData();
    expect(data.balance).toEqual(amount);
    expect(data.owner).toEqual(recipient.address);
    expect(data.master).toEqual(master.address);
    expect(data.walletCode).toEqual(quasarWalletCompiledCode());
    expect(master.getJettonData().totalSupply).toEqual(amount);
    println("QUASAR local smoke passed: supply={}, recipient balance={}", amount, data.balance);
}
