/**
 * Audit pack v2 — application guards.
 *
 * The pack ships three replacement .tact files plus TODO-stubbed tests. This
 * file instead pins the fixes where they now live (the real contracts) and
 * records the deviations from the pack that this branch made on purpose:
 *   - the owner gate on GovernanceVote is KEPT (the pack removed it),
 *   - M-4c (ToggleTrading -> ToggleMinting) IS applied with the previous
 *     opcodes pinned, so the wire format and the dApp keep working,
 *   - M-1 keeps the single-key refund shape already in main instead of the
 *     partial-refund receiver from the pack,
 *   - L-4 is NOT applied because the pack version reports compile-time
 *     constants in a runtime getter.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

const masterSrc = read("contracts/quasar.tact");
const defiSrc = read("contracts/quasar_defi.tact");
const commonSrc = read("contracts/quasar_common.tact");

function section(src: string, start: string, end?: string): string {
    const i = src.indexOf(start);
    assert.notEqual(i, -1, `missing source marker: ${start}`);
    if (!end) return src.slice(i);
    const j = src.indexOf(end, i);
    assert.notEqual(j, -1, `missing source marker: ${end}`);
    return src.slice(i, j);
}

test("H-1: TriggerBuyback authenticates the owner before any state check", () => {
    const body = section(masterSrc, "receive(msg: TriggerBuyback)", "receive(msg: CancelBuybackSwap)");
    const auth = body.indexOf("self._requireOwner()");
    const paused = body.indexOf("self._requireNotPaused()");
    assert.notEqual(auth, -1, "owner auth must be present");
    assert.notEqual(paused, -1, "pause check must remain");
    assert.ok(auth < paused, "auth must run before the pause check, so a stranger always sees Only owner");
});

test("M-2b: each proposalId is bound to one immutable payload", () => {
    const body = section(masterSrc, "receive(msg: GovernanceVote)", "receive(msg: SetDefiAddress)");
    assert.ok(body.includes("let contentHash: Int = content.hash();"), "the content hash must be computed");
    assert.ok(body.includes("self.govProposalContentHash.get(msg.proposalId)"), "the first payload is stored per proposalId");
    assert.ok(body.includes("Proposal content mismatch"), "a different payload for the same id is rejected");
    assert.ok(body.includes("self._voteKey(sender(), msg.proposalId)"), "per-voter dedup uses the public proposal id");
    assert.ok(body.includes("self.govProposalStake.set(msg.proposalId, newStake);"), "tally remains readable by proposalId");
    assert.ok(body.includes("self.govProposalStake.set(msg.proposalId, 0);"), "quorum consumes the id tally");
    assert.ok(body.includes("self.govProposalExecuted.set(msg.proposalId, true);"), "proposalId replay lock stays");
    assert.ok(body.includes("self._requireOwner();"), "owner gate on GovernanceVote remains");
});

test("M-4a: a pause silences the outgoing fee legs, never the inbound accounting", () => {
    const body = section(masterSrc, "receive(msg: FeeTransfer)", "fun _executeBuyback");
    const guard = body.indexOf("if (!self.emergencyPause) {");
    assert.notEqual(guard, -1, "the outgoing legs must sit behind the pause guard");
    assert.ok(body.indexOf("self._sendTokens(self.treasury, treasuryAmt") > guard, "treasury leg is gated");
    assert.ok(body.indexOf("self._executeBuyback(msg.queryId);") > guard, "auto-buyback is gated");
    assert.ok(body.indexOf("TransferConfirmed{ queryId: msg.queryId }") < guard, "inbound confirmation is not gated");
});

test("M-4b: exits stay live while paused, entries stay gated", () => {
    const unstake = section(masterSrc, "receive(msg: Unstake)", "receive(msg: ClaimRewards)");
    const vested = section(masterSrc, 'receive(msg: ClaimVested)', 'receive("Claim AI Control")');
    const stake = section(masterSrc, "receive(msg: Stake)", "receive(msg: Unstake)");
    assert.ok(!unstake.includes("_requireNotPaused"), "Unstake must work during a pause");
    assert.ok(!vested.includes("_requireNotPaused"), "ClaimVested must work during a pause");
    assert.ok(stake.includes("_requireNotPaused"), "Stake stays gated");
});

test("L-5: a bounced staking-reward payout anchors lastClaim at now(), never at d1", () => {
    const restore = section(masterSrc, "fun _restoreMasterPayout", "fun _sendCustodiedTokens");
    const kind3 = section(restore, "} else if (op!!.kind == 3) {", "} else if (op!!.kind == 4) {");
    assert.ok(kind3.includes("lastClaim: now()"), "kind 3 must anchor at now()");
    assert.ok(kind3.includes("self.stakingRewardsPool = self.stakingRewardsPool + op!!.amount;"), "the pool still gets the reward back");
    assert.ok(!kind3.includes("lastClaim: op!!.d1"), "the rewound value is gone");
});

test("M-3: a failed farm payout re-credits the farmer, not only the reserve", () => {
    const body = section(defiSrc, "receive(msg: PayoutFailed)", "receive(msg: RefundPendingQsr)");
    const kind2 = section(body, "} else if (payout!!.kind == 2) {", "} else if (payout!!.kind == 3) {");
    assert.ok(kind2.includes("self.farmRewardReserve = self.farmRewardReserve + msg.amount;"), "aggregate reserve restored");
    assert.ok(kind2.includes("self.farmStakes.get(payout!!.beneficiary)"), "the failed record names the farmer");
    assert.ok(kind2.includes("pending: failed!!.pending + msg.amount"), "the farmer's pending is restored");
});

test("L-1: the buyback tombstone keeps one slot of history and routes unknown legs", () => {
    assert.ok(defiSrc.includes("prevBuybackActive: Bool;"), "history slot declared");
    assert.ok(defiSrc.includes("prevBuybackTonOut: Int as coins;"), "history slot declared");
    const shift = defiSrc.indexOf("self.prevBuybackQueryId = self.pendingBuybackQueryId;");
    const overwrite = defiSrc.indexOf("self.pendingBuybackQueryId = queryId;");
    assert.notEqual(shift, -1, "the outgoing leg must be shifted before the tombstone is replaced");
    assert.ok(shift < overwrite, "shift precedes the overwrite");
    const bounce = section(defiSrc, "bounced(msg: bounced<BuybackTon>)", "receive(msg: SweepTON)");
    assert.ok(bounce.includes("msg.queryId == self.prevBuybackQueryId && self.prevBuybackActive"), "late bounce of the previous leg is restored");
    assert.ok(bounce.includes("emit(EventBuybackBounceUnknown{ queryId: msg.queryId }.toCell());"), "unknown leg is reported, not reverted");
    assert.ok(!bounce.includes("Unknown buyback bounce"), "the hard revert is gone");
});

test("L-7: estimateLpOut guards empty reserves instead of aborting", () => {
    const getter = section(defiSrc, "get fun estimateLpOut");
    assert.ok(getter.includes("if (self.tonReserve == 0 || self.qsrReserve == 0) { return 0 }"), "zero reserves return 0");
    const guard = getter.indexOf("self.tonReserve == 0");
    assert.ok(guard < getter.indexOf("let lpByTon"), "the guard precedes both divisions");
});

test("L-2: pool payouts carry the marker bit and bounces route on it", () => {
    assert.ok(commonSrc.includes("const QUASAR_POOL_PAYOUT_MARKER: Int = 1 << 63;"), "marker constant defined");
    const payout = section(commonSrc, "receive(msg: PoolPayout)", "receive(msg: TokenBurn)");
    assert.ok(payout.includes("queryId: msg.queryId + QUASAR_POOL_PAYOUT_MARKER,"), "the wallet marks its downstream transfer");
    assert.ok(payout.includes("self.pendingPoolPayouts.set(msg.queryId, msg.amount);"), "the ledger stays keyed by the unmarked id");
    const bounce = section(commonSrc, "bounced(msg: bounced<InternalTransfer>)", "bounced(msg: bounced<FeeTransfer>)");
    assert.ok(bounce.includes("msg.queryId >= QUASAR_POOL_PAYOUT_MARKER"), "routing decides on the marker bit, not on lookup order");
    assert.ok(bounce.includes("let poolAmount: Int? = isPoolMarked ? self.pendingPoolPayouts.get(localId) : null;"), "an unmarked transfer can never be captured by a pool sequence");
    assert.ok(bounce.includes("body: PayoutFailed{ queryId: localId,"), "the owner-side ledger receives the unmarked id");
});

test("L-3: the transfer residual is never sent to addr_none", () => {
    assert.ok(commonSrc.includes("if (residual > 0 && msg.responseDestination != newAddress(0, 0)) {"), "the residual send is guarded");
});
