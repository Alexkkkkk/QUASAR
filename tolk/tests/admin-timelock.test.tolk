import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@acton/types/transaction"
import "@stdlib/tvm-dicts"
import "@contracts/QuasarAdminTimelock"
import "@wrappers/QuasarAdminTimelock.gen"

const MIN_DELAY: uint32 = 86400

fun setupTimelock(): (QuasarAdminTimelock, Treasury, Treasury, Treasury) {
    val admin = testing.treasury("admin-timelock-admin");
    val master = testing.treasury("admin-timelock-master");
    val defi = testing.treasury("admin-timelock-defi");

    val timelock = QuasarAdminTimelock.fromStorage(
        QuasarAdminTimelockStorage {
            admin: admin.address,
            pendingAdmin: zeroAddress(),
            adminTransferAt: 0,
            adminTransferDelay: ADMIN_TRANSFER_DELAY,
            minDelay: MIN_DELAY,
            lastQueuedCallId: 0,
            master: master.address,
            defi: defi.address,
            pendingCalls: createEmptyDict(),
        }
    );

    val deployResult = timelock.sendDeploy(
        admin.address,
        0,
        { bounce: false, value: grams("10") },
    );
    expect(deployResult).toHaveSuccessfulDeploy<Deploy>({
        from: admin.address,
        to: timelock.address,
    });
    expect(deployResult).toNotHaveTx({
        from: timelock.address,
        to: admin.address,
        bounced: true,
    });

    return (timelock, admin, master, defi)
}

fun callBody(): cell {
    return beginCell().storeUint(0x12345678, 32).endCell()
}

get fun `test admin timelock: deploy initializes the contract`() {
    val (timelock, admin, master, defi) = setupTimelock();
    expect(timelock.getAdmin()).toEqual(admin.address);
    expect(timelock.getMaster()).toEqual(master.address);
    expect(timelock.getDefi()).toEqual(defi.address);
    expect(timelock.getPendingAdmin()).toEqual(zeroAddress());
    expect(timelock.getMinDelay()).toEqual(MIN_DELAY);
    expect(timelock.getLastQueuedCallId()).toEqual(0)
}

get fun `test admin timelock: authorized queue stores managed call`() {
    val (timelock, admin, master, _) = setupTimelock();
    val queuedAt = testing.getNow();
    val result = timelock.sendQueueAdminCall(
        admin.address,
        7,
        master.address,
        grams("0.1"),
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(result).toHaveSuccessfulTx<QueueAdminCall>({
        from: admin.address,
        to: timelock.address,
    });
    expect(timelock.getLastQueuedCallId()).toEqual(7);

    val pending = timelock.getPendingCall(7);
    expect(pending).toBeNotNull();
    if (pending == null) {
        return
    }
    expect(pending!!.target).toEqual(master.address);
    expect(pending!!.value).toEqual(grams("0.1"));
    expect(pending!!.executeAt).toEqual((queuedAt + MIN_DELAY) as int)
}

get fun `test admin timelock: unauthorized queue cancel and propose are rejected`() {
    val (timelock, admin, master, _) = setupTimelock();
    val outsider = testing.treasury("admin-timelock-outsider");

    val queueResult = timelock.sendQueueAdminCall(
        outsider.address,
        1,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(queueResult).toHaveFailedTx<QueueAdminCall>({
        from: outsider.address,
        to: timelock.address,
        exitCode: 45352,
    });

    val cancelResult = timelock.sendCancelAdminCall(
        outsider.address,
        1,
        { bounce: false, value: grams("0.2") },
    );
    expect(cancelResult).toHaveFailedTx<CancelAdminCall>({
        from: outsider.address,
        to: timelock.address,
        exitCode: 45352,
    });

    val proposeResult = timelock.sendProposeAdmin(
        outsider.address,
        admin.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(proposeResult).toHaveFailedTx<ProposeAdmin>({
        from: outsider.address,
        to: timelock.address,
        exitCode: 45352,
    })
}

get fun `test admin timelock: only master and nonzero defi are managed targets`() {
    val (timelock, admin, master, defi) = setupTimelock();
    val unmanaged = testing.treasury("admin-timelock-unmanaged");

    val masterResult = timelock.sendQueueAdminCall(
        admin.address,
        1,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(masterResult).toHaveSuccessfulTx<QueueAdminCall>({ to: timelock.address });

    val defiResult = timelock.sendQueueAdminCall(
        admin.address,
        2,
        defi.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(defiResult).toHaveSuccessfulTx<QueueAdminCall>({ to: timelock.address });

    val unmanagedResult = timelock.sendQueueAdminCall(
        admin.address,
        3,
        unmanaged.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(unmanagedResult).toHaveFailedTx<QueueAdminCall>({
        from: admin.address,
        to: timelock.address,
        exitCode: 42797,
    })
}

get fun `test admin timelock: queue ids must strictly increase`() {
    val (timelock, admin, master, _) = setupTimelock();

    val first = timelock.sendQueueAdminCall(
        admin.address,
        10,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(first).toHaveSuccessfulTx<QueueAdminCall>({ to: timelock.address });

    val duplicate = timelock.sendQueueAdminCall(
        admin.address,
        10,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(duplicate).toHaveFailedTx<QueueAdminCall>({
        from: admin.address,
        to: timelock.address,
        exitCode: 36252,
    });

    val lower = timelock.sendQueueAdminCall(
        admin.address,
        9,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(lower).toHaveFailedTx<QueueAdminCall>({
        from: admin.address,
        to: timelock.address,
        exitCode: 36252,
    });

    val higher = timelock.sendQueueAdminCall(
        admin.address,
        11,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(higher).toHaveSuccessfulTx<QueueAdminCall>({ to: timelock.address });
    expect(timelock.getLastQueuedCallId()).toEqual(11)
}

get fun `test admin timelock: execution is delayed, permissionless, and deletes first`() {
    val (timelock, admin, master, _) = setupTimelock();
    val outsider = testing.treasury("admin-timelock-executor");

    val queueResult = timelock.sendQueueAdminCall(
        admin.address,
        1,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(queueResult).toHaveSuccessfulTx<QueueAdminCall>({ to: timelock.address });

    val early = timelock.sendExecuteAdminCall(
        outsider.address,
        1,
        { bounce: false, value: grams("0.2") },
    );
    expect(early).toHaveFailedTx<ExecuteAdminCall>({
        from: outsider.address,
        to: timelock.address,
        exitCode: 28248,
    });
    expect(timelock.getPendingCall(1)).toBeNotNull();

    val pending = timelock.getPendingCall(1);
    expect(pending).toBeNotNull();
    if (pending == null) {
        return
    }
    testing.setNow(pending!!.executeAt as uint32);

    val ready = timelock.sendExecuteAdminCall(
        outsider.address,
        1,
        { bounce: false, value: grams("0.2") },
    );
    expect(ready).toHaveSuccessfulTx<ExecuteAdminCall>({
        from: outsider.address,
        to: timelock.address,
    });
    expect(timelock.getPendingCall(1)).toBeNull()
}

get fun `test admin timelock: admin can cancel a call and cancellation is authorized`() {
    val (timelock, admin, master, _) = setupTimelock();
    val outsider = testing.treasury("admin-timelock-cancel-outsider");

    val queueResult = timelock.sendQueueAdminCall(
        admin.address,
        1,
        master.address,
        0,
        callBody(),
        { bounce: false, value: grams("0.2") },
    );
    expect(queueResult).toHaveSuccessfulTx<QueueAdminCall>({ to: timelock.address });

    val unauthorized = timelock.sendCancelAdminCall(
        outsider.address,
        1,
        { bounce: false, value: grams("0.2") },
    );
    expect(unauthorized).toHaveFailedTx<CancelAdminCall>({
        from: outsider.address,
        to: timelock.address,
        exitCode: 45352,
    });

    val cancelled = timelock.sendCancelAdminCall(
        admin.address,
        1,
        { bounce: false, value: grams("0.2") },
    );
    expect(cancelled).toHaveSuccessfulTx<CancelAdminCall>({ to: timelock.address });
    expect(timelock.getPendingCall(1)).toBeNull()
}

get fun `test admin timelock: admin transfer is cancellable and delayed`() {
    val (timelock, admin, master, _) = setupTimelock();
    val newAdmin = testing.treasury("admin-timelock-new-admin");
    val outsider = testing.treasury("admin-timelock-transfer-outsider");

    val propose = timelock.sendProposeAdmin(
        admin.address,
        newAdmin.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(propose).toHaveSuccessfulTx<ProposeAdmin>({ to: timelock.address });
    expect(timelock.getPendingAdmin()).toEqual(newAdmin.address);

    val unauthorizedCancel = timelock.sendCancelAdminTransfer(
        outsider.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(unauthorizedCancel).toHaveFailedTx<CancelAdminTransfer>({
        from: outsider.address,
        to: timelock.address,
        exitCode: 45352,
    });

    val cancelled = timelock.sendCancelAdminTransfer(
        admin.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(cancelled).toHaveSuccessfulTx<CancelAdminTransfer>({ to: timelock.address });
    expect(timelock.getPendingAdmin()).toEqual(zeroAddress());

    val proposeAgain = timelock.sendProposeAdmin(
        admin.address,
        newAdmin.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(proposeAgain).toHaveSuccessfulTx<ProposeAdmin>({ to: timelock.address });
    val transferAt = timelock.getAdminTransferAt();
    expect(transferAt).toBeGreaterOrEqual(testing.getNow());

    val earlyAccept = timelock.sendAcceptAdmin(
        newAdmin.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(earlyAccept).toHaveFailedTx<AcceptAdmin>({
        from: newAdmin.address,
        to: timelock.address,
        exitCode: 51627,
    });

    testing.setNow(transferAt as uint32);
    val accepted = timelock.sendAcceptAdmin(
        newAdmin.address,
        { bounce: false, value: grams("0.2") },
    );
    expect(accepted).toHaveSuccessfulTx<AcceptAdmin>({
        from: newAdmin.address,
        to: timelock.address,
    });
    expect(timelock.getAdmin()).toEqual(newAdmin.address);
    expect(timelock.getPendingAdmin()).toEqual(zeroAddress())
}
