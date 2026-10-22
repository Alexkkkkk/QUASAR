// Bounded custom serializers for wide QuasarMaster records.
//
// Storage records are deliberately ref-wrapped at their outer boundary. A record
// may be serialized into a dictionary leaf, where the key label consumes bits in
// the same cell. Keeping the leaf value to one reference prevents otherwise
// valid record payloads from overflowing that cell.
//
// Event serializers retain the Tact wire layout. Tolk does not automatically
// write or consume a struct prefix when packToBuilder/unpackFromSlice is custom,
// therefore each prefixed event handles its 32-bit header explicitly.
import "@contracts/QuasarMaster"

fun AIActionLog.unpackFromSlice(mutate root: slice): AIActionLog {
    var actionHead = root.loadRef().beginParse();
    val actionId = actionHead.loadInt(257) as int257;
    val timestamp = actionHead.loadInt(257) as int257;
    val actionType = actionHead.loadString();
    val oldValue = actionHead.loadInt(257) as int257;

    var statusTail = actionHead.loadRef().beginParse();
    val newValue = statusTail.loadInt(257) as int257;
    val reason = statusTail.loadString();
    val executed = statusTail.loadBool();
    val vetoed = statusTail.loadBool();
    val overridden = statusTail.loadBool();
    statusTail.assertEnd();
    actionHead.assertEnd();
    root.assertEnd();
    return { actionId, timestamp, actionType, oldValue, newValue, reason, executed, vetoed, overridden };
}

fun AIActionLog.packToBuilder(self, mutate root: builder) {
    var statusTail = beginCell();
    statusTail.storeInt(self.newValue, 257);
    statusTail.storeString(self.reason);
    statusTail.storeBool(self.executed);
    statusTail.storeBool(self.vetoed);
    statusTail.storeBool(self.overridden);

    var actionHead = beginCell();
    actionHead.storeInt(self.actionId, 257);
    actionHead.storeInt(self.timestamp, 257);
    actionHead.storeString(self.actionType);
    actionHead.storeInt(self.oldValue, 257);
    actionHead.storeRef(statusTail.endCell());
    root.storeRef(actionHead.endCell());
}

fun StakeInfo.unpackFromSlice(mutate root: slice): StakeInfo {
    var stakeHead = root.loadRef().beginParse();
    val amount = stakeHead.loadInt(257) as int257;
    val startTime = stakeHead.loadInt(257) as int257;
    val lastClaim = stakeHead.loadInt(257) as int257;

    var lockTail = stakeHead.loadRef().beginParse();
    val lockEnd = lockTail.loadInt(257) as int257;
    lockTail.assertEnd();
    stakeHead.assertEnd();
    root.assertEnd();
    return { amount, startTime, lastClaim, lockEnd };
}

fun StakeInfo.packToBuilder(self, mutate root: builder) {
    val lockTail = beginCell().storeInt(self.lockEnd, 257).endCell();
    var stakeHead = beginCell();
    stakeHead.storeInt(self.amount, 257);
    stakeHead.storeInt(self.startTime, 257);
    stakeHead.storeInt(self.lastClaim, 257);
    stakeHead.storeRef(lockTail);
    root.storeRef(stakeHead.endCell());
}

fun VestingInfo.unpackFromSlice(mutate root: slice): VestingInfo {
    var vestingHead = root.loadRef().beginParse();
    val totalAmount = vestingHead.loadInt(257) as int257;
    val claimed = vestingHead.loadInt(257) as int257;
    val startTime = vestingHead.loadInt(257) as int257;

    var scheduleTail = vestingHead.loadRef().beginParse();
    val cliff = scheduleTail.loadInt(257) as int257;
    val duration = scheduleTail.loadInt(257) as int257;
    scheduleTail.assertEnd();
    vestingHead.assertEnd();
    root.assertEnd();
    return { totalAmount, claimed, startTime, cliff, duration };
}

fun VestingInfo.packToBuilder(self, mutate root: builder) {
    var scheduleTail = beginCell();
    scheduleTail.storeInt(self.cliff, 257);
    scheduleTail.storeInt(self.duration, 257);

    var vestingHead = beginCell();
    vestingHead.storeInt(self.totalAmount, 257);
    vestingHead.storeInt(self.claimed, 257);
    vestingHead.storeInt(self.startTime, 257);
    vestingHead.storeRef(scheduleTail.endCell());
    root.storeRef(vestingHead.endCell());
}

fun ReferralInfo.unpackFromSlice(mutate root: slice): ReferralInfo {
    var referral = root.loadRef().beginParse();
    val referrer = referral.loadAddress();
    val totalEarned = referral.loadInt(257) as int257;
    val totalReferrals = referral.loadInt(257) as int257;
    referral.assertEnd();
    root.assertEnd();
    return { referrer, totalEarned, totalReferrals };
}

fun ReferralInfo.packToBuilder(self, mutate root: builder) {
    var referral = beginCell();
    referral.storeAddress(self.referrer);
    referral.storeInt(self.totalEarned, 257);
    referral.storeInt(self.totalReferrals, 257);
    root.storeRef(referral.endCell());
}

fun PendingMasterPayout.unpackFromSlice(mutate root: slice): PendingMasterPayout {
    var payoutHead = root.loadRef().beginParse();
    val kind = payoutHead.loadInt(257) as int257;
    val beneficiary = payoutHead.loadAddress();
    val amount = payoutHead.loadCoins();

    var dataTail = payoutHead.loadRef().beginParse();
    val d1 = dataTail.loadInt(257) as int257;
    val d2 = dataTail.loadInt(257) as int257;
    val d3 = dataTail.loadInt(257) as int257;
    dataTail.assertEnd();
    payoutHead.assertEnd();
    root.assertEnd();
    return { kind, beneficiary, amount, d1, d2, d3 };
}

fun PendingMasterPayout.packToBuilder(self, mutate root: builder) {
    var dataTail = beginCell();
    dataTail.storeInt(self.d1, 257);
    dataTail.storeInt(self.d2, 257);
    dataTail.storeInt(self.d3, 257);

    var payoutHead = beginCell();
    payoutHead.storeInt(self.kind, 257);
    payoutHead.storeAddress(self.beneficiary);
    payoutHead.storeCoins(self.amount);
    payoutHead.storeRef(dataTail.endCell());
    root.storeRef(payoutHead.endCell());
}

fun EventFeeDistributed.unpackFromSlice(mutate root: slice): EventFeeDistributed {
    assert (root.loadUint(32) == 0xa8f1237b) throw 710;
    val totalFee = root.loadInt(257) as int257;
    val burn = root.loadInt(257) as int257;
    val buyback = root.loadInt(257) as int257;

    var feeTail = root.loadRef().beginParse();
    val staking = feeTail.loadInt(257) as int257;
    val referral = feeTail.loadInt(257) as int257;
    val treasury = feeTail.loadInt(257) as int257;

    var defiTail = feeTail.loadRef().beginParse();
    val defiPool = defiTail.loadInt(257) as int257;
    defiTail.assertEnd();
    feeTail.assertEnd();
    root.assertEnd();
    return { totalFee, burn, buyback, staking, referral, treasury, defiPool };
}

fun EventFeeDistributed.packToBuilder(self, mutate root: builder) {
    val defiTail = beginCell().storeInt(self.defiPool, 257).endCell();
    var feeTail = beginCell();
    feeTail.storeInt(self.staking, 257);
    feeTail.storeInt(self.referral, 257);
    feeTail.storeInt(self.treasury, 257);
    feeTail.storeRef(defiTail);

    root.storeUint(0xa8f1237b, 32);
    root.storeInt(self.totalFee, 257);
    root.storeInt(self.burn, 257);
    root.storeInt(self.buyback, 257);
    root.storeRef(feeTail.endCell());
}

fun EventAiVeto.unpackFromSlice(mutate root: slice): EventAiVeto {
    assert (root.loadUint(32) == 0x081fb0a9) throw 711;
    val actionId = root.loadInt(257) as int257;
    val voter = root.loadAddress();
    val amount = root.loadInt(257) as int257;

    var vetoTail = root.loadRef().beginParse();
    val actionStake = vetoTail.loadInt(257) as int257;
    val vetoed = vetoTail.loadBool();
    vetoTail.assertEnd();
    root.assertEnd();
    return { actionId, voter, amount, actionStake, vetoed };
}

fun EventAiVeto.packToBuilder(self, mutate root: builder) {
    val vetoTail = beginCell().storeInt(self.actionStake, 257).storeBool(self.vetoed).endCell();
    root.storeUint(0x081fb0a9, 32);
    root.storeInt(self.actionId, 257);
    root.storeAddress(self.voter);
    root.storeInt(self.amount, 257);
    root.storeRef(vetoTail);
}

fun EventAiSignedDecision.unpackFromSlice(mutate root: slice): EventAiSignedDecision {
    assert (root.loadUint(32) == 0x9e7176a7) throw 712;
    val queryId = root.loadInt(257) as int257;
    val nonce = root.loadInt(257) as int257;
    val action = root.loadInt(257) as int257;

    var valueTail = root.loadRef().beginParse();
    val value = valueTail.loadInt(257) as int257;
    valueTail.assertEnd();
    root.assertEnd();
    return { queryId, nonce, action, value };
}

fun EventAiSignedDecision.packToBuilder(self, mutate root: builder) {
    val valueTail = beginCell().storeInt(self.value, 257).endCell();
    root.storeUint(0x9e7176a7, 32);
    root.storeInt(self.queryId, 257);
    root.storeInt(self.nonce, 257);
    root.storeInt(self.action, 257);
    root.storeRef(valueTail);
}
