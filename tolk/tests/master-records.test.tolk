import "@acton/testing/expect"
import "@contracts/QuasarMaster"
import "@contracts/QuasarMasterRecords"

fun recordsTestOwner(): address {
    return address("0:1111111111111111111111111111111111111111111111111111111111111111");
}

fun recordsTestPeer(): address {
    return address("-1:2222222222222222222222222222222222222222222222222222222222222222");
}

get fun `test master records: wide storage records round trip through bounded map leaves`() {
    val owner = recordsTestOwner();
    val peer = recordsTestPeer();
    val action = AIActionLog {
        actionId: -101,
        timestamp: 20261022,
        actionType: "rebalance",
        oldValue: -303,
        newValue: 404,
        reason: "bounded dictionary value",
        executed: true,
        vetoed: false,
        overridden: true,
    };
    val stake = StakeInfo { amount: 1000, startTime: 2000, lastClaim: 3000, lockEnd: 4000 };
    val vesting = VestingInfo {
        totalAmount: 5000,
        claimed: 600,
        startTime: 7000,
        cliff: 8000,
        duration: 9000,
    };
    val referral = ReferralInfo { referrer: peer, totalEarned: 111, totalReferrals: 222 };
    val payout = PendingMasterPayout {
        kind: -7,
        beneficiary: peer,
        amount: grams("123.456"),
        d1: -8,
        d2: 9,
        d3: 10,
    };

    var actions: map<int257, AIActionLog> = [];
    actions.set(-1, action);
    val actionResult = actions.get(-1);
    expect(actionResult.isFound).toEqual(true);
    val decodedAction = actionResult.loadValue();
    expect(decodedAction.actionId).toEqual(action.actionId);
    expect(decodedAction.timestamp).toEqual(action.timestamp);
    expect(decodedAction.actionType).toEqual(action.actionType);
    expect(decodedAction.oldValue).toEqual(action.oldValue);
    expect(decodedAction.newValue).toEqual(action.newValue);
    expect(decodedAction.reason).toEqual(action.reason);
    expect(decodedAction.executed).toEqual(action.executed);
    expect(decodedAction.vetoed).toEqual(action.vetoed);
    expect(decodedAction.overridden).toEqual(action.overridden);

    var stakes: map<address, StakeInfo> = [];
    stakes.set(owner, stake);
    val stakeResult = stakes.get(owner);
    expect(stakeResult.isFound).toEqual(true);
    val decodedStake = stakeResult.loadValue();
    expect(decodedStake.amount).toEqual(stake.amount);
    expect(decodedStake.startTime).toEqual(stake.startTime);
    expect(decodedStake.lastClaim).toEqual(stake.lastClaim);
    expect(decodedStake.lockEnd).toEqual(stake.lockEnd);

    var vestings: map<address, VestingInfo> = [];
    vestings.set(owner, vesting);
    val vestingResult = vestings.get(owner);
    expect(vestingResult.isFound).toEqual(true);
    val decodedVesting = vestingResult.loadValue();
    expect(decodedVesting.totalAmount).toEqual(vesting.totalAmount);
    expect(decodedVesting.claimed).toEqual(vesting.claimed);
    expect(decodedVesting.startTime).toEqual(vesting.startTime);
    expect(decodedVesting.cliff).toEqual(vesting.cliff);
    expect(decodedVesting.duration).toEqual(vesting.duration);

    var referrals: map<address, ReferralInfo> = [];
    referrals.set(owner, referral);
    val referralResult = referrals.get(owner);
    expect(referralResult.isFound).toEqual(true);
    val decodedReferral = referralResult.loadValue();
    expect(decodedReferral.referrer).toEqual(referral.referrer);
    expect(decodedReferral.totalEarned).toEqual(referral.totalEarned);
    expect(decodedReferral.totalReferrals).toEqual(referral.totalReferrals);

    var payouts: map<int257, PendingMasterPayout> = [];
    payouts.set(-2, payout);
    val payoutResult = payouts.get(-2);
    expect(payoutResult.isFound).toEqual(true);
    val decodedPayout = payoutResult.loadValue();
    expect(decodedPayout.kind).toEqual(payout.kind);
    expect(decodedPayout.beneficiary).toEqual(payout.beneficiary);
    expect(decodedPayout.amount).toEqual(payout.amount);
    expect(decodedPayout.d1).toEqual(payout.d1);
    expect(decodedPayout.d2).toEqual(payout.d2);
    expect(decodedPayout.d3).toEqual(payout.d3);
}

get fun `test master records: EventFeeDistributed keeps manual Tact root and tail layout`() {
    val event = EventFeeDistributed {
        totalFee: 101,
        burn: -202,
        buyback: 303,
        staking: 404,
        referral: 505,
        treasury: -606,
        defiPool: 707,
    };
    var root = event.toCell().beginParse();
    expect(root.loadUint(32)).toEqual(0xa8f1237b);
    expect(root.loadInt(257)).toEqual(event.totalFee);
    expect(root.loadInt(257)).toEqual(event.burn);
    expect(root.loadInt(257)).toEqual(event.buyback);
    var feeTail = root.loadRef().beginParse();
    expect(feeTail.loadInt(257)).toEqual(event.staking);
    expect(feeTail.loadInt(257)).toEqual(event.referral);
    expect(feeTail.loadInt(257)).toEqual(event.treasury);
    var defiTail = feeTail.loadRef().beginParse();
    expect(defiTail.loadInt(257)).toEqual(event.defiPool);
    defiTail.assertEnd();
    feeTail.assertEnd();
    root.assertEnd();

    val decoded = EventFeeDistributed.fromCell(event.toCell());
    expect(decoded.totalFee).toEqual(event.totalFee);
    expect(decoded.defiPool).toEqual(event.defiPool);
}

get fun `test master records: EventAiVeto keeps manual Tact root and tail layout`() {
    val voter = recordsTestOwner();
    val event = EventAiVeto {
        actionId: -808,
        voter,
        amount: 909,
        actionStake: -1001,
        vetoed: true,
    };
    var root = event.toCell().beginParse();
    expect(root.loadUint(32)).toEqual(0x081fb0a9);
    expect(root.loadInt(257)).toEqual(event.actionId);
    expect(root.loadAddress()).toEqual(voter);
    expect(root.loadInt(257)).toEqual(event.amount);
    var vetoTail = root.loadRef().beginParse();
    expect(vetoTail.loadInt(257)).toEqual(event.actionStake);
    expect(vetoTail.loadBool()).toEqual(event.vetoed);
    vetoTail.assertEnd();
    root.assertEnd();

    val decoded = EventAiVeto.fromCell(event.toCell());
    expect(decoded.actionId).toEqual(event.actionId);
    expect(decoded.voter).toEqual(voter);
    expect(decoded.amount).toEqual(event.amount);
    expect(decoded.actionStake).toEqual(event.actionStake);
    expect(decoded.vetoed).toEqual(event.vetoed);
}

get fun `test master records: EventAiSignedDecision keeps manual Tact root and tail layout`() {
    val event = EventAiSignedDecision { queryId: 12, nonce: -13, action: 14, value: -15 };
    var root = event.toCell().beginParse();
    expect(root.loadUint(32)).toEqual(0x9e7176a7);
    expect(root.loadInt(257)).toEqual(event.queryId);
    expect(root.loadInt(257)).toEqual(event.nonce);
    expect(root.loadInt(257)).toEqual(event.action);
    var valueTail = root.loadRef().beginParse();
    expect(valueTail.loadInt(257)).toEqual(event.value);
    valueTail.assertEnd();
    root.assertEnd();

    val decoded = EventAiSignedDecision.fromCell(event.toCell());
    expect(decoded.queryId).toEqual(event.queryId);
    expect(decoded.nonce).toEqual(event.nonce);
    expect(decoded.action).toEqual(event.action);
    expect(decoded.value).toEqual(event.value);
}
