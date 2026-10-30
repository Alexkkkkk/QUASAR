import "@acton/testing/expect"
import "@contracts/QuasarCommon"

fun testOwner(): address {
    return address("0:1111111111111111111111111111111111111111111111111111111111111111");
}

fun testMaster(): address {
    return address("-1:2222222222222222222222222222222222222222222222222222222222222222");
}

get fun `test common wire: wallet init keeps exact Tact false-owner-master prefix`() {
    val owner = testOwner();
    val master = testMaster();
    var init = quasarWalletInitData(owner, master).beginParse();

    expect(init.loadBool()).toEqual(false);
    expect(init.loadAddress()).toEqual(owner);
    expect(init.loadAddress()).toEqual(master);
    init.assertEnd();
}

get fun `test common wire: TEP-74 nullable response destination serializes addr_none`() {
    val destination = testOwner();
    val transfer = TokenTransfer {
        queryId: 0x0123456789abcdef,
        amount: 123456789,
        destination,
        responseDestination: null,
        customPayload: null,
        forwardTonAmount: 0,
        forwardPayload: createEmptySlice(),
    };
    var wire = transfer.toCell().beginParse();

    expect(wire.loadUint(32)).toEqual(0x0f8a7ea5);
    expect(wire.loadUint(64)).toEqual(0x0123456789abcdef);
    expect(wire.loadCoins()).toEqual(123456789);
    expect(wire.loadAddress()).toEqual(destination);
    expect(wire.loadAddressOpt()).toBeNull();

    val decoded = TokenTransfer.fromCell(transfer.toCell());
    expect(decoded.responseDestination).toBeNull();
    expect(decoded.destination).toEqual(destination);
}

get fun `test common wire: TEP-74 forwardPayload preserves inline Either selector and content`() {
    val destination = testOwner();
    val inlinePayload = beginCell()
        .storeBool(false)
        .storeUint(0x5aa5, 16)
        .storeRef(beginCell().storeUint(0xcafe, 16).endCell())
        .endCell()
        .beginParse();
    val transfer = TokenTransfer {
        queryId: 91,
        amount: 123,
        destination,
        responseDestination: null,
        customPayload: null,
        forwardTonAmount: 1,
        forwardPayload: inlinePayload,
    };

    val decoded = TokenTransfer.fromCell(transfer.toCell());
    var payload = decoded.forwardPayload;
    expect(payload.loadBool()).toEqual(false);
    expect(payload.loadUint(16)).toEqual(0x5aa5);
    var inlineRef = payload.loadRef().beginParse();
    expect(inlineRef.loadUint(16)).toEqual(0xcafe);
    inlineRef.assertEnd();
    payload.assertEnd();
}

get fun `test common wire: TEP-74 forwardPayload preserves referenced Either selector`() {
    val destination = testOwner();
    val referencedPayload = beginCell().storeUint(0xdecafbad, 32).endCell();
    val refPayload = beginCell().storeBool(true).storeRef(referencedPayload).endCell().beginParse();
    val transfer = TokenTransfer {
        queryId: 92,
        amount: 456,
        destination,
        responseDestination: null,
        customPayload: null,
        forwardTonAmount: 2,
        forwardPayload: refPayload,
    };

    val decoded = TokenTransfer.fromCell(transfer.toCell());
    var payload = decoded.forwardPayload;
    expect(payload.loadBool()).toEqual(true);
    var payloadRef = payload.loadRef().beginParse();
    expect(payloadRef.loadUint(32)).toEqual(0xdecafbad);
    payloadRef.assertEnd();
    payload.assertEnd();
}

get fun `test common wire: TEP-74 query_id preserves the maximum uint64 high-bit boundary`() {
    val queryId: uint64 = 0xffffffffffffffff;
    val transfer = TokenTransfer {
        queryId,
        amount: 1,
        destination: testOwner(),
        responseDestination: null,
        customPayload: null,
        forwardTonAmount: 0,
        forwardPayload: createEmptySlice(),
    };
    var wire = transfer.toCell().beginParse();
    expect(wire.loadUint(32)).toEqual(0x0f8a7ea5);
    expect(wire.loadUint(64)).toEqual(0xffffffffffffffff);
    expect(TokenTransfer.fromCell(transfer.toCell()).queryId).toEqual(queryId);
}

get fun `test common wire: TEP-89 take wallet supports addr_none and Maybe ref`() {
    val owner = testMaster();
    val none = TakeWalletAddress {
        queryId: 77,
        walletAddress: createAddressNone(),
        ownerAddress: null,
    };
    val included = TakeWalletAddress {
        queryId: 78,
        walletAddress: owner as any_address,
        ownerAddress: (owner as any_address).toCell(),
    };

    var noneWire = none.toCell().beginParse();
    expect(noneWire.loadUint(32)).toEqual(0xd1735400);
    expect(noneWire.loadUint(64)).toEqual(77);
    expect(noneWire.loadAddressAny().isNone()).toEqual(true);
    expect(noneWire.loadBool()).toEqual(false);
    noneWire.assertEnd();

    val decoded = TakeWalletAddress.fromCell(included.toCell());
    expect(decoded.walletAddress.castToInternal()).toEqual(owner);
    expect(decoded.ownerAddress).toBeNotNull();
    var ownerWire = decoded.ownerAddress!.beginParse();
    expect(ownerWire.loadAddressAny().castToInternal()).toEqual(owner);
    ownerWire.assertEnd();
}
