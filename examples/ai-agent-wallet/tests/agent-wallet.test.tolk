import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@contracts/types"
import "@wrappers/AgentWallet.gen"

fun setupWallet(): (AgentWallet, Treasury, Treasury, Treasury) {
    val owner = testing.treasury("wallet-owner");
    val agent = testing.treasury("wallet-agent");
    val replacement = testing.treasury("wallet-replacement");
    val wallet = AgentWallet.fromStorage({ owner: owner.address, agent: zeroAddress(), seqno: 0 });
    val deployResult = wallet.deploy(owner.address, { bounce: false, value: grams("5") });
    expect(deployResult).toHaveSuccessfulDeploy({ to: wallet.address });
    return (wallet, owner, agent, replacement);
}

get fun `test owner can assign and rotate agent`() {
    val (wallet, owner, agent, replacement) = setupWallet();
    val outsider = testing.treasury("wallet-outsider");
    expect(wallet.sendSetAgent(outsider.address, agent.address)).toHaveFailedTx({
        from: outsider.address,
        to: wallet.address,
        exitCode: Errors.NotOwner,
    });
    expect(wallet.sendSetAgent(owner.address, agent.address)).toHaveSuccessfulTx<SetAgent>({
        from: owner.address,
        to: wallet.address,
    });
    expect(wallet.agent()).toEqual(agent.address);
    expect(wallet.sendSetAgent(owner.address, replacement.address)).toHaveSuccessfulTx<SetAgent>({
        from: owner.address,
        to: wallet.address,
    });
    expect(wallet.agent()).toEqual(replacement.address);
    expect(wallet.seqno()).toEqual(0);
}

get fun `test agent transfer requires exact seqno and nonzero amount`() {
    val (wallet, owner, agent, _) = setupWallet();
    val recipient = testing.treasury("wallet-recipient");
    wallet.sendSetAgent(owner.address, agent.address);
    expect(
        wallet.sendAgentTransfer(agent.address, 1, recipient.address, grams("1")),
    ).toHaveFailedTx({
        from: agent.address,
        to: wallet.address,
        exitCode: Errors.InvalidSeqno,
    });
    expect(wallet.sendAgentTransfer(agent.address, 0, recipient.address, 0)).toHaveFailedTx({
        from: agent.address,
        to: wallet.address,
        exitCode: Errors.InvalidAmount,
    });
    expect(wallet.seqno()).toEqual(0);
}

get fun `test assigned agent can transfer once and replay is rejected`() {
    val (wallet, owner, agent, _) = setupWallet();
    val recipient = testing.treasury("wallet-recipient-success");
    wallet.sendSetAgent(owner.address, agent.address);
    val result = wallet.sendAgentTransfer(agent.address, 0, recipient.address, grams("1"));
    expect(result).toHaveSuccessfulTx<AgentTransfer>({ from: agent.address, to: wallet.address });
    expect(wallet.seqno()).toEqual(1);
    expect(
        wallet.sendAgentTransfer(agent.address, 0, recipient.address, grams("1")),
    ).toHaveFailedTx({
        from: agent.address,
        to: wallet.address,
        exitCode: Errors.InvalidSeqno,
    });
}

get fun `test revoke blocks agent and zero addresses are rejected`() {
    val (wallet, owner, agent, _) = setupWallet();
    wallet.sendSetAgent(owner.address, agent.address);
    expect(wallet.sendRevokeAgent(owner.address)).toHaveSuccessfulTx<RevokeAgent>({
        from: owner.address,
        to: wallet.address,
    });
    expect(wallet.sendAgentTransfer(agent.address, 0, owner.address, grams("1"))).toHaveFailedTx({
        from: agent.address,
        to: wallet.address,
        exitCode: Errors.NotAgent,
    });
    expect(wallet.sendSetAgent(owner.address, zeroAddress())).toHaveFailedTx({
        from: owner.address,
        to: wallet.address,
        exitCode: Errors.ZeroAddress,
    });
}
