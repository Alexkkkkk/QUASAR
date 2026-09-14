import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type EventMint = {
    $$type: 'EventMint';
    amount: bigint;
    receiver: Address;
}

export function storeEventMint(src: EventMint) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(860203922, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadEventMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 860203922) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadIntBig(257);
    const _receiver = sc_0.loadAddress();
    return { $$type: 'EventMint' as const, amount: _amount, receiver: _receiver };
}

export function loadTupleEventMint(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'EventMint' as const, amount: _amount, receiver: _receiver };
}

export function loadGetterTupleEventMint(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'EventMint' as const, amount: _amount, receiver: _receiver };
}

export function storeTupleEventMint(source: EventMint) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

export function dictValueParserEventMint(): DictionaryValue<EventMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventMint(src)).endCell());
        },
        parse: (src) => {
            return loadEventMint(src.loadRef().beginParse());
        }
    }
}

export type EventBurn = {
    $$type: 'EventBurn';
    amount: bigint;
    burner: Address;
}

export function storeEventBurn(src: EventBurn) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3532337071, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.burner);
    };
}

export function loadEventBurn(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3532337071) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadIntBig(257);
    const _burner = sc_0.loadAddress();
    return { $$type: 'EventBurn' as const, amount: _amount, burner: _burner };
}

export function loadTupleEventBurn(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _burner = source.readAddress();
    return { $$type: 'EventBurn' as const, amount: _amount, burner: _burner };
}

export function loadGetterTupleEventBurn(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _burner = source.readAddress();
    return { $$type: 'EventBurn' as const, amount: _amount, burner: _burner };
}

export function storeTupleEventBurn(source: EventBurn) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.burner);
    return builder.build();
}

export function dictValueParserEventBurn(): DictionaryValue<EventBurn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventBurn(src)).endCell());
        },
        parse: (src) => {
            return loadEventBurn(src.loadRef().beginParse());
        }
    }
}

export type EventFeeDistributed = {
    $$type: 'EventFeeDistributed';
    totalFee: bigint;
    burn: bigint;
    buyback: bigint;
    lottery: bigint;
    staking: bigint;
    referral: bigint;
    treasury: bigint;
    defiPool: bigint;
}

export function storeEventFeeDistributed(src: EventFeeDistributed) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3296433968, 32);
        b_0.storeInt(src.totalFee, 257);
        b_0.storeInt(src.burn, 257);
        b_0.storeInt(src.buyback, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.lottery, 257);
        b_1.storeInt(src.staking, 257);
        b_1.storeInt(src.referral, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.treasury, 257);
        b_2.storeInt(src.defiPool, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadEventFeeDistributed(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3296433968) { throw Error('Invalid prefix'); }
    const _totalFee = sc_0.loadIntBig(257);
    const _burn = sc_0.loadIntBig(257);
    const _buyback = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _lottery = sc_1.loadIntBig(257);
    const _staking = sc_1.loadIntBig(257);
    const _referral = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _treasury = sc_2.loadIntBig(257);
    const _defiPool = sc_2.loadIntBig(257);
    return { $$type: 'EventFeeDistributed' as const, totalFee: _totalFee, burn: _burn, buyback: _buyback, lottery: _lottery, staking: _staking, referral: _referral, treasury: _treasury, defiPool: _defiPool };
}

export function loadTupleEventFeeDistributed(source: TupleReader) {
    const _totalFee = source.readBigNumber();
    const _burn = source.readBigNumber();
    const _buyback = source.readBigNumber();
    const _lottery = source.readBigNumber();
    const _staking = source.readBigNumber();
    const _referral = source.readBigNumber();
    const _treasury = source.readBigNumber();
    const _defiPool = source.readBigNumber();
    return { $$type: 'EventFeeDistributed' as const, totalFee: _totalFee, burn: _burn, buyback: _buyback, lottery: _lottery, staking: _staking, referral: _referral, treasury: _treasury, defiPool: _defiPool };
}

export function loadGetterTupleEventFeeDistributed(source: TupleReader) {
    const _totalFee = source.readBigNumber();
    const _burn = source.readBigNumber();
    const _buyback = source.readBigNumber();
    const _lottery = source.readBigNumber();
    const _staking = source.readBigNumber();
    const _referral = source.readBigNumber();
    const _treasury = source.readBigNumber();
    const _defiPool = source.readBigNumber();
    return { $$type: 'EventFeeDistributed' as const, totalFee: _totalFee, burn: _burn, buyback: _buyback, lottery: _lottery, staking: _staking, referral: _referral, treasury: _treasury, defiPool: _defiPool };
}

export function storeTupleEventFeeDistributed(source: EventFeeDistributed) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalFee);
    builder.writeNumber(source.burn);
    builder.writeNumber(source.buyback);
    builder.writeNumber(source.lottery);
    builder.writeNumber(source.staking);
    builder.writeNumber(source.referral);
    builder.writeNumber(source.treasury);
    builder.writeNumber(source.defiPool);
    return builder.build();
}

export function dictValueParserEventFeeDistributed(): DictionaryValue<EventFeeDistributed> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventFeeDistributed(src)).endCell());
        },
        parse: (src) => {
            return loadEventFeeDistributed(src.loadRef().beginParse());
        }
    }
}

export type EventBuybackExecuted = {
    $$type: 'EventBuybackExecuted';
    tonSpent: bigint;
    qsrBurned: bigint;
}

export function storeEventBuybackExecuted(src: EventBuybackExecuted) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1890367419, 32);
        b_0.storeInt(src.tonSpent, 257);
        b_0.storeInt(src.qsrBurned, 257);
    };
}

export function loadEventBuybackExecuted(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1890367419) { throw Error('Invalid prefix'); }
    const _tonSpent = sc_0.loadIntBig(257);
    const _qsrBurned = sc_0.loadIntBig(257);
    return { $$type: 'EventBuybackExecuted' as const, tonSpent: _tonSpent, qsrBurned: _qsrBurned };
}

export function loadTupleEventBuybackExecuted(source: TupleReader) {
    const _tonSpent = source.readBigNumber();
    const _qsrBurned = source.readBigNumber();
    return { $$type: 'EventBuybackExecuted' as const, tonSpent: _tonSpent, qsrBurned: _qsrBurned };
}

export function loadGetterTupleEventBuybackExecuted(source: TupleReader) {
    const _tonSpent = source.readBigNumber();
    const _qsrBurned = source.readBigNumber();
    return { $$type: 'EventBuybackExecuted' as const, tonSpent: _tonSpent, qsrBurned: _qsrBurned };
}

export function storeTupleEventBuybackExecuted(source: EventBuybackExecuted) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.tonSpent);
    builder.writeNumber(source.qsrBurned);
    return builder.build();
}

export function dictValueParserEventBuybackExecuted(): DictionaryValue<EventBuybackExecuted> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventBuybackExecuted(src)).endCell());
        },
        parse: (src) => {
            return loadEventBuybackExecuted(src.loadRef().beginParse());
        }
    }
}

export type EventLotteryDrawn = {
    $$type: 'EventLotteryDrawn';
    round: bigint;
    winner: Address;
    jackpot: bigint;
}

export function storeEventLotteryDrawn(src: EventLotteryDrawn) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1455139578, 32);
        b_0.storeInt(src.round, 257);
        b_0.storeAddress(src.winner);
        b_0.storeInt(src.jackpot, 257);
    };
}

export function loadEventLotteryDrawn(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1455139578) { throw Error('Invalid prefix'); }
    const _round = sc_0.loadIntBig(257);
    const _winner = sc_0.loadAddress();
    const _jackpot = sc_0.loadIntBig(257);
    return { $$type: 'EventLotteryDrawn' as const, round: _round, winner: _winner, jackpot: _jackpot };
}

export function loadTupleEventLotteryDrawn(source: TupleReader) {
    const _round = source.readBigNumber();
    const _winner = source.readAddress();
    const _jackpot = source.readBigNumber();
    return { $$type: 'EventLotteryDrawn' as const, round: _round, winner: _winner, jackpot: _jackpot };
}

export function loadGetterTupleEventLotteryDrawn(source: TupleReader) {
    const _round = source.readBigNumber();
    const _winner = source.readAddress();
    const _jackpot = source.readBigNumber();
    return { $$type: 'EventLotteryDrawn' as const, round: _round, winner: _winner, jackpot: _jackpot };
}

export function storeTupleEventLotteryDrawn(source: EventLotteryDrawn) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.round);
    builder.writeAddress(source.winner);
    builder.writeNumber(source.jackpot);
    return builder.build();
}

export function dictValueParserEventLotteryDrawn(): DictionaryValue<EventLotteryDrawn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventLotteryDrawn(src)).endCell());
        },
        parse: (src) => {
            return loadEventLotteryDrawn(src.loadRef().beginParse());
        }
    }
}

export type EventStake = {
    $$type: 'EventStake';
    staker: Address;
    amount: bigint;
}

export function storeEventStake(src: EventStake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2899784103, 32);
        b_0.storeAddress(src.staker);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadEventStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2899784103) { throw Error('Invalid prefix'); }
    const _staker = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'EventStake' as const, staker: _staker, amount: _amount };
}

export function loadTupleEventStake(source: TupleReader) {
    const _staker = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventStake' as const, staker: _staker, amount: _amount };
}

export function loadGetterTupleEventStake(source: TupleReader) {
    const _staker = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventStake' as const, staker: _staker, amount: _amount };
}

export function storeTupleEventStake(source: EventStake) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.staker);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserEventStake(): DictionaryValue<EventStake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventStake(src)).endCell());
        },
        parse: (src) => {
            return loadEventStake(src.loadRef().beginParse());
        }
    }
}

export type EventUnstake = {
    $$type: 'EventUnstake';
    staker: Address;
    amount: bigint;
}

export function storeEventUnstake(src: EventUnstake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2219162629, 32);
        b_0.storeAddress(src.staker);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadEventUnstake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2219162629) { throw Error('Invalid prefix'); }
    const _staker = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'EventUnstake' as const, staker: _staker, amount: _amount };
}

export function loadTupleEventUnstake(source: TupleReader) {
    const _staker = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventUnstake' as const, staker: _staker, amount: _amount };
}

export function loadGetterTupleEventUnstake(source: TupleReader) {
    const _staker = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventUnstake' as const, staker: _staker, amount: _amount };
}

export function storeTupleEventUnstake(source: EventUnstake) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.staker);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserEventUnstake(): DictionaryValue<EventUnstake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventUnstake(src)).endCell());
        },
        parse: (src) => {
            return loadEventUnstake(src.loadRef().beginParse());
        }
    }
}

export type EventReferralRegistered = {
    $$type: 'EventReferralRegistered';
    user: Address;
    referrer: Address;
}

export function storeEventReferralRegistered(src: EventReferralRegistered) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(685454731, 32);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.referrer);
    };
}

export function loadEventReferralRegistered(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 685454731) { throw Error('Invalid prefix'); }
    const _user = sc_0.loadAddress();
    const _referrer = sc_0.loadAddress();
    return { $$type: 'EventReferralRegistered' as const, user: _user, referrer: _referrer };
}

export function loadTupleEventReferralRegistered(source: TupleReader) {
    const _user = source.readAddress();
    const _referrer = source.readAddress();
    return { $$type: 'EventReferralRegistered' as const, user: _user, referrer: _referrer };
}

export function loadGetterTupleEventReferralRegistered(source: TupleReader) {
    const _user = source.readAddress();
    const _referrer = source.readAddress();
    return { $$type: 'EventReferralRegistered' as const, user: _user, referrer: _referrer };
}

export function storeTupleEventReferralRegistered(source: EventReferralRegistered) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.user);
    builder.writeAddress(source.referrer);
    return builder.build();
}

export function dictValueParserEventReferralRegistered(): DictionaryValue<EventReferralRegistered> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventReferralRegistered(src)).endCell());
        },
        parse: (src) => {
            return loadEventReferralRegistered(src.loadRef().beginParse());
        }
    }
}

export type EventVestingClaimed = {
    $$type: 'EventVestingClaimed';
    beneficiary: Address;
    amount: bigint;
}

export function storeEventVestingClaimed(src: EventVestingClaimed) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(929365622, 32);
        b_0.storeAddress(src.beneficiary);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadEventVestingClaimed(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 929365622) { throw Error('Invalid prefix'); }
    const _beneficiary = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'EventVestingClaimed' as const, beneficiary: _beneficiary, amount: _amount };
}

export function loadTupleEventVestingClaimed(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventVestingClaimed' as const, beneficiary: _beneficiary, amount: _amount };
}

export function loadGetterTupleEventVestingClaimed(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventVestingClaimed' as const, beneficiary: _beneficiary, amount: _amount };
}

export function storeTupleEventVestingClaimed(source: EventVestingClaimed) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserEventVestingClaimed(): DictionaryValue<EventVestingClaimed> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventVestingClaimed(src)).endCell());
        },
        parse: (src) => {
            return loadEventVestingClaimed(src.loadRef().beginParse());
        }
    }
}

export type EventAiAction = {
    $$type: 'EventAiAction';
    actionId: bigint;
    actionType: string;
    oldValue: bigint;
    newValue: bigint;
}

export function storeEventAiAction(src: EventAiAction) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1580835377, 32);
        b_0.storeInt(src.actionId, 257);
        b_0.storeStringRefTail(src.actionType);
        b_0.storeInt(src.oldValue, 257);
        b_0.storeInt(src.newValue, 257);
    };
}

export function loadEventAiAction(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1580835377) { throw Error('Invalid prefix'); }
    const _actionId = sc_0.loadIntBig(257);
    const _actionType = sc_0.loadStringRefTail();
    const _oldValue = sc_0.loadIntBig(257);
    const _newValue = sc_0.loadIntBig(257);
    return { $$type: 'EventAiAction' as const, actionId: _actionId, actionType: _actionType, oldValue: _oldValue, newValue: _newValue };
}

export function loadTupleEventAiAction(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _actionType = source.readString();
    const _oldValue = source.readBigNumber();
    const _newValue = source.readBigNumber();
    return { $$type: 'EventAiAction' as const, actionId: _actionId, actionType: _actionType, oldValue: _oldValue, newValue: _newValue };
}

export function loadGetterTupleEventAiAction(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _actionType = source.readString();
    const _oldValue = source.readBigNumber();
    const _newValue = source.readBigNumber();
    return { $$type: 'EventAiAction' as const, actionId: _actionId, actionType: _actionType, oldValue: _oldValue, newValue: _newValue };
}

export function storeTupleEventAiAction(source: EventAiAction) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeString(source.actionType);
    builder.writeNumber(source.oldValue);
    builder.writeNumber(source.newValue);
    return builder.build();
}

export function dictValueParserEventAiAction(): DictionaryValue<EventAiAction> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventAiAction(src)).endCell());
        },
        parse: (src) => {
            return loadEventAiAction(src.loadRef().beginParse());
        }
    }
}

export type AISetOracle = {
    $$type: 'AISetOracle';
    oracleAddress: Address;
}

export function storeAISetOracle(src: AISetOracle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(707361075, 32);
        b_0.storeAddress(src.oracleAddress);
    };
}

export function loadAISetOracle(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 707361075) { throw Error('Invalid prefix'); }
    const _oracleAddress = sc_0.loadAddress();
    return { $$type: 'AISetOracle' as const, oracleAddress: _oracleAddress };
}

export function loadTupleAISetOracle(source: TupleReader) {
    const _oracleAddress = source.readAddress();
    return { $$type: 'AISetOracle' as const, oracleAddress: _oracleAddress };
}

export function loadGetterTupleAISetOracle(source: TupleReader) {
    const _oracleAddress = source.readAddress();
    return { $$type: 'AISetOracle' as const, oracleAddress: _oracleAddress };
}

export function storeTupleAISetOracle(source: AISetOracle) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.oracleAddress);
    return builder.build();
}

export function dictValueParserAISetOracle(): DictionaryValue<AISetOracle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAISetOracle(src)).endCell());
        },
        parse: (src) => {
            return loadAISetOracle(src.loadRef().beginParse());
        }
    }
}

export type AIGrantFullAutonomy = {
    $$type: 'AIGrantFullAutonomy';
    enabled: boolean;
}

export function storeAIGrantFullAutonomy(src: AIGrantFullAutonomy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3323893351, 32);
        b_0.storeBit(src.enabled);
    };
}

export function loadAIGrantFullAutonomy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3323893351) { throw Error('Invalid prefix'); }
    const _enabled = sc_0.loadBit();
    return { $$type: 'AIGrantFullAutonomy' as const, enabled: _enabled };
}

export function loadTupleAIGrantFullAutonomy(source: TupleReader) {
    const _enabled = source.readBoolean();
    return { $$type: 'AIGrantFullAutonomy' as const, enabled: _enabled };
}

export function loadGetterTupleAIGrantFullAutonomy(source: TupleReader) {
    const _enabled = source.readBoolean();
    return { $$type: 'AIGrantFullAutonomy' as const, enabled: _enabled };
}

export function storeTupleAIGrantFullAutonomy(source: AIGrantFullAutonomy) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    return builder.build();
}

export function dictValueParserAIGrantFullAutonomy(): DictionaryValue<AIGrantFullAutonomy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIGrantFullAutonomy(src)).endCell());
        },
        parse: (src) => {
            return loadAIGrantFullAutonomy(src.loadRef().beginParse());
        }
    }
}

export type AIHeartbeat = {
    $$type: 'AIHeartbeat';
    queryId: bigint;
    status: string;
}

export function storeAIHeartbeat(src: AIHeartbeat) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2409132733, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeStringRefTail(src.status);
    };
}

export function loadAIHeartbeat(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2409132733) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _status = sc_0.loadStringRefTail();
    return { $$type: 'AIHeartbeat' as const, queryId: _queryId, status: _status };
}

export function loadTupleAIHeartbeat(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _status = source.readString();
    return { $$type: 'AIHeartbeat' as const, queryId: _queryId, status: _status };
}

export function loadGetterTupleAIHeartbeat(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _status = source.readString();
    return { $$type: 'AIHeartbeat' as const, queryId: _queryId, status: _status };
}

export function storeTupleAIHeartbeat(source: AIHeartbeat) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeString(source.status);
    return builder.build();
}

export function dictValueParserAIHeartbeat(): DictionaryValue<AIHeartbeat> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIHeartbeat(src)).endCell());
        },
        parse: (src) => {
            return loadAIHeartbeat(src.loadRef().beginParse());
        }
    }
}

export type AIVetoVote = {
    $$type: 'AIVetoVote';
    actionId: bigint;
    voter: Address;
    stake: bigint;
    reason: string;
}

export function storeAIVetoVote(src: AIVetoVote) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2637925553, 32);
        b_0.storeUint(src.actionId, 64);
        b_0.storeAddress(src.voter);
        b_0.storeCoins(src.stake);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIVetoVote(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2637925553) { throw Error('Invalid prefix'); }
    const _actionId = sc_0.loadUintBig(64);
    const _voter = sc_0.loadAddress();
    const _stake = sc_0.loadCoins();
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIVetoVote' as const, actionId: _actionId, voter: _voter, stake: _stake, reason: _reason };
}

export function loadTupleAIVetoVote(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _voter = source.readAddress();
    const _stake = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AIVetoVote' as const, actionId: _actionId, voter: _voter, stake: _stake, reason: _reason };
}

export function loadGetterTupleAIVetoVote(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _voter = source.readAddress();
    const _stake = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AIVetoVote' as const, actionId: _actionId, voter: _voter, stake: _stake, reason: _reason };
}

export function storeTupleAIVetoVote(source: AIVetoVote) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeAddress(source.voter);
    builder.writeNumber(source.stake);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAIVetoVote(): DictionaryValue<AIVetoVote> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIVetoVote(src)).endCell());
        },
        parse: (src) => {
            return loadAIVetoVote(src.loadRef().beginParse());
        }
    }
}

export type OwnerOverride = {
    $$type: 'OwnerOverride';
    actionId: bigint;
    reason: string;
}

export function storeOwnerOverride(src: OwnerOverride) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(164764433, 32);
        b_0.storeUint(src.actionId, 64);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadOwnerOverride(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 164764433) { throw Error('Invalid prefix'); }
    const _actionId = sc_0.loadUintBig(64);
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'OwnerOverride' as const, actionId: _actionId, reason: _reason };
}

export function loadTupleOwnerOverride(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'OwnerOverride' as const, actionId: _actionId, reason: _reason };
}

export function loadGetterTupleOwnerOverride(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'OwnerOverride' as const, actionId: _actionId, reason: _reason };
}

export function storeTupleOwnerOverride(source: OwnerOverride) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserOwnerOverride(): DictionaryValue<OwnerOverride> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnerOverride(src)).endCell());
        },
        parse: (src) => {
            return loadOwnerOverride(src.loadRef().beginParse());
        }
    }
}

export type AIRebalance = {
    $$type: 'AIRebalance';
    queryId: bigint;
    targetFeeBps: bigint;
    targetBurnShare: bigint;
    recommendation: string;
}

export function storeAIRebalance(src: AIRebalance) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(679670248, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.targetFeeBps, 16);
        b_0.storeUint(src.targetBurnShare, 8);
        b_0.storeStringRefTail(src.recommendation);
    };
}

export function loadAIRebalance(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 679670248) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _targetFeeBps = sc_0.loadUintBig(16);
    const _targetBurnShare = sc_0.loadUintBig(8);
    const _recommendation = sc_0.loadStringRefTail();
    return { $$type: 'AIRebalance' as const, queryId: _queryId, targetFeeBps: _targetFeeBps, targetBurnShare: _targetBurnShare, recommendation: _recommendation };
}

export function loadTupleAIRebalance(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _targetFeeBps = source.readBigNumber();
    const _targetBurnShare = source.readBigNumber();
    const _recommendation = source.readString();
    return { $$type: 'AIRebalance' as const, queryId: _queryId, targetFeeBps: _targetFeeBps, targetBurnShare: _targetBurnShare, recommendation: _recommendation };
}

export function loadGetterTupleAIRebalance(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _targetFeeBps = source.readBigNumber();
    const _targetBurnShare = source.readBigNumber();
    const _recommendation = source.readString();
    return { $$type: 'AIRebalance' as const, queryId: _queryId, targetFeeBps: _targetFeeBps, targetBurnShare: _targetBurnShare, recommendation: _recommendation };
}

export function storeTupleAIRebalance(source: AIRebalance) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.targetFeeBps);
    builder.writeNumber(source.targetBurnShare);
    builder.writeString(source.recommendation);
    return builder.build();
}

export function dictValueParserAIRebalance(): DictionaryValue<AIRebalance> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIRebalance(src)).endCell());
        },
        parse: (src) => {
            return loadAIRebalance(src.loadRef().beginParse());
        }
    }
}

export type AIPriceSignal = {
    $$type: 'AIPriceSignal';
    queryId: bigint;
    priceTon: bigint;
    volatility: bigint;
    sentiment: bigint;
    action: bigint;
}

export function storeAIPriceSignal(src: AIPriceSignal) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1763742623, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.priceTon);
        b_0.storeUint(src.volatility, 32);
        b_0.storeInt(src.sentiment, 8);
        b_0.storeUint(src.action, 8);
    };
}

export function loadAIPriceSignal(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1763742623) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _priceTon = sc_0.loadCoins();
    const _volatility = sc_0.loadUintBig(32);
    const _sentiment = sc_0.loadIntBig(8);
    const _action = sc_0.loadUintBig(8);
    return { $$type: 'AIPriceSignal' as const, queryId: _queryId, priceTon: _priceTon, volatility: _volatility, sentiment: _sentiment, action: _action };
}

export function loadTupleAIPriceSignal(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _priceTon = source.readBigNumber();
    const _volatility = source.readBigNumber();
    const _sentiment = source.readBigNumber();
    const _action = source.readBigNumber();
    return { $$type: 'AIPriceSignal' as const, queryId: _queryId, priceTon: _priceTon, volatility: _volatility, sentiment: _sentiment, action: _action };
}

export function loadGetterTupleAIPriceSignal(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _priceTon = source.readBigNumber();
    const _volatility = source.readBigNumber();
    const _sentiment = source.readBigNumber();
    const _action = source.readBigNumber();
    return { $$type: 'AIPriceSignal' as const, queryId: _queryId, priceTon: _priceTon, volatility: _volatility, sentiment: _sentiment, action: _action };
}

export function storeTupleAIPriceSignal(source: AIPriceSignal) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.priceTon);
    builder.writeNumber(source.volatility);
    builder.writeNumber(source.sentiment);
    builder.writeNumber(source.action);
    return builder.build();
}

export function dictValueParserAIPriceSignal(): DictionaryValue<AIPriceSignal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIPriceSignal(src)).endCell());
        },
        parse: (src) => {
            return loadAIPriceSignal(src.loadRef().beginParse());
        }
    }
}

export type AIAnomalyAlert = {
    $$type: 'AIAnomalyAlert';
    queryId: bigint;
    severity: bigint;
    anomalyType: bigint;
    affectedWallets: bigint;
    recommendedAction: string;
}

export function storeAIAnomalyAlert(src: AIAnomalyAlert) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3697509643, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.severity, 8);
        b_0.storeUint(src.anomalyType, 8);
        b_0.storeUint(src.affectedWallets, 32);
        b_0.storeStringRefTail(src.recommendedAction);
    };
}

export function loadAIAnomalyAlert(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3697509643) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _severity = sc_0.loadUintBig(8);
    const _anomalyType = sc_0.loadUintBig(8);
    const _affectedWallets = sc_0.loadUintBig(32);
    const _recommendedAction = sc_0.loadStringRefTail();
    return { $$type: 'AIAnomalyAlert' as const, queryId: _queryId, severity: _severity, anomalyType: _anomalyType, affectedWallets: _affectedWallets, recommendedAction: _recommendedAction };
}

export function loadTupleAIAnomalyAlert(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _severity = source.readBigNumber();
    const _anomalyType = source.readBigNumber();
    const _affectedWallets = source.readBigNumber();
    const _recommendedAction = source.readString();
    return { $$type: 'AIAnomalyAlert' as const, queryId: _queryId, severity: _severity, anomalyType: _anomalyType, affectedWallets: _affectedWallets, recommendedAction: _recommendedAction };
}

export function loadGetterTupleAIAnomalyAlert(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _severity = source.readBigNumber();
    const _anomalyType = source.readBigNumber();
    const _affectedWallets = source.readBigNumber();
    const _recommendedAction = source.readString();
    return { $$type: 'AIAnomalyAlert' as const, queryId: _queryId, severity: _severity, anomalyType: _anomalyType, affectedWallets: _affectedWallets, recommendedAction: _recommendedAction };
}

export function storeTupleAIAnomalyAlert(source: AIAnomalyAlert) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.severity);
    builder.writeNumber(source.anomalyType);
    builder.writeNumber(source.affectedWallets);
    builder.writeString(source.recommendedAction);
    return builder.build();
}

export function dictValueParserAIAnomalyAlert(): DictionaryValue<AIAnomalyAlert> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIAnomalyAlert(src)).endCell());
        },
        parse: (src) => {
            return loadAIAnomalyAlert(src.loadRef().beginParse());
        }
    }
}

export type AIGovernanceProposal = {
    $$type: 'AIGovernanceProposal';
    queryId: bigint;
    proposalType: bigint;
    newValue: bigint;
    description: string;
    confidence: bigint;
}

export function storeAIGovernanceProposal(src: AIGovernanceProposal) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3633360959, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.proposalType, 8);
        b_0.storeInt(src.newValue, 257);
        b_0.storeStringRefTail(src.description);
        b_0.storeUint(src.confidence, 8);
    };
}

export function loadAIGovernanceProposal(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3633360959) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _proposalType = sc_0.loadUintBig(8);
    const _newValue = sc_0.loadIntBig(257);
    const _description = sc_0.loadStringRefTail();
    const _confidence = sc_0.loadUintBig(8);
    return { $$type: 'AIGovernanceProposal' as const, queryId: _queryId, proposalType: _proposalType, newValue: _newValue, description: _description, confidence: _confidence };
}

export function loadTupleAIGovernanceProposal(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _proposalType = source.readBigNumber();
    const _newValue = source.readBigNumber();
    const _description = source.readString();
    const _confidence = source.readBigNumber();
    return { $$type: 'AIGovernanceProposal' as const, queryId: _queryId, proposalType: _proposalType, newValue: _newValue, description: _description, confidence: _confidence };
}

export function loadGetterTupleAIGovernanceProposal(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _proposalType = source.readBigNumber();
    const _newValue = source.readBigNumber();
    const _description = source.readString();
    const _confidence = source.readBigNumber();
    return { $$type: 'AIGovernanceProposal' as const, queryId: _queryId, proposalType: _proposalType, newValue: _newValue, description: _description, confidence: _confidence };
}

export function storeTupleAIGovernanceProposal(source: AIGovernanceProposal) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.proposalType);
    builder.writeNumber(source.newValue);
    builder.writeString(source.description);
    builder.writeNumber(source.confidence);
    return builder.build();
}

export function dictValueParserAIGovernanceProposal(): DictionaryValue<AIGovernanceProposal> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIGovernanceProposal(src)).endCell());
        },
        parse: (src) => {
            return loadAIGovernanceProposal(src.loadRef().beginParse());
        }
    }
}

export type AISetFee = {
    $$type: 'AISetFee';
    queryId: bigint;
    feeBps: bigint;
    reason: string;
}

export function storeAISetFee(src: AISetFee) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(400520088, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetFee(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 400520088) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _feeBps = sc_0.loadUintBig(16);
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetFee' as const, queryId: _queryId, feeBps: _feeBps, reason: _reason };
}

export function loadTupleAISetFee(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _feeBps = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AISetFee' as const, queryId: _queryId, feeBps: _feeBps, reason: _reason };
}

export function loadGetterTupleAISetFee(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _feeBps = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AISetFee' as const, queryId: _queryId, feeBps: _feeBps, reason: _reason };
}

export function storeTupleAISetFee(source: AISetFee) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.feeBps);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAISetFee(): DictionaryValue<AISetFee> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAISetFee(src)).endCell());
        },
        parse: (src) => {
            return loadAISetFee(src.loadRef().beginParse());
        }
    }
}

export type AISetTreasuryDirect = {
    $$type: 'AISetTreasuryDirect';
    queryId: bigint;
    treasury: Address;
    reason: string;
}

export function storeAISetTreasuryDirect(src: AISetTreasuryDirect) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2042225859, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.treasury);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetTreasuryDirect(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2042225859) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _treasury = sc_0.loadAddress();
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetTreasuryDirect' as const, queryId: _queryId, treasury: _treasury, reason: _reason };
}

export function loadTupleAISetTreasuryDirect(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _treasury = source.readAddress();
    const _reason = source.readString();
    return { $$type: 'AISetTreasuryDirect' as const, queryId: _queryId, treasury: _treasury, reason: _reason };
}

export function loadGetterTupleAISetTreasuryDirect(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _treasury = source.readAddress();
    const _reason = source.readString();
    return { $$type: 'AISetTreasuryDirect' as const, queryId: _queryId, treasury: _treasury, reason: _reason };
}

export function storeTupleAISetTreasuryDirect(source: AISetTreasuryDirect) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.treasury);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAISetTreasuryDirect(): DictionaryValue<AISetTreasuryDirect> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAISetTreasuryDirect(src)).endCell());
        },
        parse: (src) => {
            return loadAISetTreasuryDirect(src.loadRef().beginParse());
        }
    }
}

export type AISetAntiWhale = {
    $$type: 'AISetAntiWhale';
    queryId: bigint;
    maxTxBps: bigint;
    maxWalletBps: bigint;
    cooldown: bigint;
    reason: string;
}

export function storeAISetAntiWhale(src: AISetAntiWhale) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(284672247, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.maxTxBps, 16);
        b_0.storeUint(src.maxWalletBps, 16);
        b_0.storeUint(src.cooldown, 16);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetAntiWhale(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 284672247) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _maxTxBps = sc_0.loadUintBig(16);
    const _maxWalletBps = sc_0.loadUintBig(16);
    const _cooldown = sc_0.loadUintBig(16);
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetAntiWhale' as const, queryId: _queryId, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, reason: _reason };
}

export function loadTupleAISetAntiWhale(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AISetAntiWhale' as const, queryId: _queryId, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, reason: _reason };
}

export function loadGetterTupleAISetAntiWhale(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AISetAntiWhale' as const, queryId: _queryId, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, reason: _reason };
}

export function storeTupleAISetAntiWhale(source: AISetAntiWhale) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.maxTxBps);
    builder.writeNumber(source.maxWalletBps);
    builder.writeNumber(source.cooldown);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAISetAntiWhale(): DictionaryValue<AISetAntiWhale> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAISetAntiWhale(src)).endCell());
        },
        parse: (src) => {
            return loadAISetAntiWhale(src.loadRef().beginParse());
        }
    }
}

export type AISetBuybackDirect = {
    $$type: 'AISetBuybackDirect';
    queryId: bigint;
    enabled: boolean;
    threshold: bigint;
    cooldown: bigint;
    burnPercent: bigint;
    reason: string;
}

export function storeAISetBuybackDirect(src: AISetBuybackDirect) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(156406141, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeBit(src.enabled);
        b_0.storeCoins(src.threshold);
        b_0.storeUint(src.cooldown, 32);
        b_0.storeUint(src.burnPercent, 8);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetBuybackDirect(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 156406141) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _enabled = sc_0.loadBit();
    const _threshold = sc_0.loadCoins();
    const _cooldown = sc_0.loadUintBig(32);
    const _burnPercent = sc_0.loadUintBig(8);
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetBuybackDirect' as const, queryId: _queryId, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, reason: _reason };
}

export function loadTupleAISetBuybackDirect(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _enabled = source.readBoolean();
    const _threshold = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _burnPercent = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AISetBuybackDirect' as const, queryId: _queryId, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, reason: _reason };
}

export function loadGetterTupleAISetBuybackDirect(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _enabled = source.readBoolean();
    const _threshold = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _burnPercent = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AISetBuybackDirect' as const, queryId: _queryId, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, reason: _reason };
}

export function storeTupleAISetBuybackDirect(source: AISetBuybackDirect) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.threshold);
    builder.writeNumber(source.cooldown);
    builder.writeNumber(source.burnPercent);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAISetBuybackDirect(): DictionaryValue<AISetBuybackDirect> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAISetBuybackDirect(src)).endCell());
        },
        parse: (src) => {
            return loadAISetBuybackDirect(src.loadRef().beginParse());
        }
    }
}

export type AIToggleTrading = {
    $$type: 'AIToggleTrading';
    queryId: bigint;
    enabled: boolean;
    reason: string;
}

export function storeAIToggleTrading(src: AIToggleTrading) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(76600837, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeBit(src.enabled);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIToggleTrading(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 76600837) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _enabled = sc_0.loadBit();
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIToggleTrading' as const, queryId: _queryId, enabled: _enabled, reason: _reason };
}

export function loadTupleAIToggleTrading(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _enabled = source.readBoolean();
    const _reason = source.readString();
    return { $$type: 'AIToggleTrading' as const, queryId: _queryId, enabled: _enabled, reason: _reason };
}

export function loadGetterTupleAIToggleTrading(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _enabled = source.readBoolean();
    const _reason = source.readString();
    return { $$type: 'AIToggleTrading' as const, queryId: _queryId, enabled: _enabled, reason: _reason };
}

export function storeTupleAIToggleTrading(source: AIToggleTrading) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.enabled);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAIToggleTrading(): DictionaryValue<AIToggleTrading> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIToggleTrading(src)).endCell());
        },
        parse: (src) => {
            return loadAIToggleTrading(src.loadRef().beginParse());
        }
    }
}

export type AIEmergencyPause = {
    $$type: 'AIEmergencyPause';
    queryId: bigint;
    pause: boolean;
    severity: bigint;
    reason: string;
}

export function storeAIEmergencyPause(src: AIEmergencyPause) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4117793461, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeBit(src.pause);
        b_0.storeUint(src.severity, 8);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIEmergencyPause(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4117793461) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _pause = sc_0.loadBit();
    const _severity = sc_0.loadUintBig(8);
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIEmergencyPause' as const, queryId: _queryId, pause: _pause, severity: _severity, reason: _reason };
}

export function loadTupleAIEmergencyPause(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _pause = source.readBoolean();
    const _severity = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AIEmergencyPause' as const, queryId: _queryId, pause: _pause, severity: _severity, reason: _reason };
}

export function loadGetterTupleAIEmergencyPause(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _pause = source.readBoolean();
    const _severity = source.readBigNumber();
    const _reason = source.readString();
    return { $$type: 'AIEmergencyPause' as const, queryId: _queryId, pause: _pause, severity: _severity, reason: _reason };
}

export function storeTupleAIEmergencyPause(source: AIEmergencyPause) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.pause);
    builder.writeNumber(source.severity);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAIEmergencyPause(): DictionaryValue<AIEmergencyPause> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIEmergencyPause(src)).endCell());
        },
        parse: (src) => {
            return loadAIEmergencyPause(src.loadRef().beginParse());
        }
    }
}

export type AIRotateOracle = {
    $$type: 'AIRotateOracle';
    queryId: bigint;
    newOracle: Address;
    reason: string;
}

export function storeAIRotateOracle(src: AIRotateOracle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(800136214, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOracle);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIRotateOracle(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 800136214) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOracle = sc_0.loadAddress();
    const _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIRotateOracle' as const, queryId: _queryId, newOracle: _newOracle, reason: _reason };
}

export function loadTupleAIRotateOracle(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOracle = source.readAddress();
    const _reason = source.readString();
    return { $$type: 'AIRotateOracle' as const, queryId: _queryId, newOracle: _newOracle, reason: _reason };
}

export function loadGetterTupleAIRotateOracle(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOracle = source.readAddress();
    const _reason = source.readString();
    return { $$type: 'AIRotateOracle' as const, queryId: _queryId, newOracle: _newOracle, reason: _reason };
}

export function storeTupleAIRotateOracle(source: AIRotateOracle) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOracle);
    builder.writeString(source.reason);
    return builder.build();
}

export function dictValueParserAIRotateOracle(): DictionaryValue<AIRotateOracle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIRotateOracle(src)).endCell());
        },
        parse: (src) => {
            return loadAIRotateOracle(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    amount: bigint;
    receiver: Address;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4235234258, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4235234258) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadIntBig(257);
    const _receiver = sc_0.loadAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

export function loadTupleMint(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

export function loadGetterTupleMint(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

export function storeTupleMint(source: Mint) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

export function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type BurnNotification = {
    $$type: 'BurnNotification';
    queryId: bigint;
    amount: bigint;
    sender: Address;
    responseDestination: Address;
}

export function storeBurnNotification(src: BurnNotification) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3675779274, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.responseDestination);
    };
}

export function loadBurnNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3675779274) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadIntBig(257);
    const _sender = sc_0.loadAddress();
    const _responseDestination = sc_0.loadAddress();
    return { $$type: 'BurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

export function loadTupleBurnNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _responseDestination = source.readAddress();
    return { $$type: 'BurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

export function loadGetterTupleBurnNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _responseDestination = source.readAddress();
    return { $$type: 'BurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

export function storeTupleBurnNotification(source: BurnNotification) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeAddress(source.responseDestination);
    return builder.build();
}

export function dictValueParserBurnNotification(): DictionaryValue<BurnNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type TokenTransfer = {
    $$type: 'TokenTransfer';
    queryId: bigint;
    amount: bigint;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell | null;
    forwardTonAmount: bigint;
    forwardPayload: Slice;
}

export function storeTokenTransfer(src: TokenTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2477503806, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forwardTonAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTokenTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2477503806) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    const _responseDestination = sc_0.loadAddress();
    const _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _forwardTonAmount = sc_0.loadCoins();
    const _forwardPayload = sc_0;
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadTupleTokenTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadGetterTupleTokenTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function storeTupleTokenTransfer(source: TokenTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardTonAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTokenTransfer(src.loadRef().beginParse());
        }
    }
}

export type TokenBurn = {
    $$type: 'TokenBurn';
    queryId: bigint;
    amount: bigint;
    responseDestination: Address;
    customPayload: Cell | null;
}

export function storeTokenBurn(src: TokenBurn) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3884065811, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
    };
}

export function loadTokenBurn(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3884065811) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _responseDestination = sc_0.loadAddress();
    const _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

export function loadTupleTokenBurn(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

export function loadGetterTupleTokenBurn(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _responseDestination = source.readAddress();
    const _customPayload = source.readCellOpt();
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

export function storeTupleTokenBurn(source: TokenBurn) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    return builder.build();
}

export function dictValueParserTokenBurn(): DictionaryValue<TokenBurn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenBurn(src)).endCell());
        },
        parse: (src) => {
            return loadTokenBurn(src.loadRef().beginParse());
        }
    }
}

export type TokenNotification = {
    $$type: 'TokenNotification';
    queryId: bigint;
    amount: bigint;
    from: Address;
    forwardPayload: Slice;
}

export function storeTokenNotification(src: TokenNotification) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(78460803, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 78460803) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _from = sc_0.loadAddress();
    const _forwardPayload = sc_0;
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

export function loadTupleTokenNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _from = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

export function loadGetterTupleTokenNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _from = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

export function storeTupleTokenNotification(source: TokenNotification) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTokenNotification(src)).endCell());
        },
        parse: (src) => {
            return loadTokenNotification(src.loadRef().beginParse());
        }
    }
}

export type FeeTransfer = {
    $$type: 'FeeTransfer';
    queryId: bigint;
    amount: bigint;
    originalSender: Address;
    originalReceiver: Address;
}

export function storeFeeTransfer(src: FeeTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3948052191, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.originalSender);
        b_0.storeAddress(src.originalReceiver);
    };
}

export function loadFeeTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3948052191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _originalSender = sc_0.loadAddress();
    const _originalReceiver = sc_0.loadAddress();
    return { $$type: 'FeeTransfer' as const, queryId: _queryId, amount: _amount, originalSender: _originalSender, originalReceiver: _originalReceiver };
}

export function loadTupleFeeTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _originalSender = source.readAddress();
    const _originalReceiver = source.readAddress();
    return { $$type: 'FeeTransfer' as const, queryId: _queryId, amount: _amount, originalSender: _originalSender, originalReceiver: _originalReceiver };
}

export function loadGetterTupleFeeTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _originalSender = source.readAddress();
    const _originalReceiver = source.readAddress();
    return { $$type: 'FeeTransfer' as const, queryId: _queryId, amount: _amount, originalSender: _originalSender, originalReceiver: _originalReceiver };
}

export function storeTupleFeeTransfer(source: FeeTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.originalSender);
    builder.writeAddress(source.originalReceiver);
    return builder.build();
}

export function dictValueParserFeeTransfer(): DictionaryValue<FeeTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFeeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadFeeTransfer(src.loadRef().beginParse());
        }
    }
}

export type SetTreasury = {
    $$type: 'SetTreasury';
    treasury: Address;
}

export function storeSetTreasury(src: SetTreasury) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3485887677, 32);
        b_0.storeAddress(src.treasury);
    };
}

export function loadSetTreasury(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3485887677) { throw Error('Invalid prefix'); }
    const _treasury = sc_0.loadAddress();
    return { $$type: 'SetTreasury' as const, treasury: _treasury };
}

export function loadTupleSetTreasury(source: TupleReader) {
    const _treasury = source.readAddress();
    return { $$type: 'SetTreasury' as const, treasury: _treasury };
}

export function loadGetterTupleSetTreasury(source: TupleReader) {
    const _treasury = source.readAddress();
    return { $$type: 'SetTreasury' as const, treasury: _treasury };
}

export function storeTupleSetTreasury(source: SetTreasury) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.treasury);
    return builder.build();
}

export function dictValueParserSetTreasury(): DictionaryValue<SetTreasury> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetTreasury(src)).endCell());
        },
        parse: (src) => {
            return loadSetTreasury(src.loadRef().beginParse());
        }
    }
}

export type SetFeeConfig = {
    $$type: 'SetFeeConfig';
    feeBps: bigint;
    burnShare: bigint;
    maxTxBps: bigint;
    maxWalletBps: bigint;
    cooldown: bigint;
}

export function storeSetFeeConfig(src: SetFeeConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1007896360, 32);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeUint(src.burnShare, 8);
        b_0.storeUint(src.maxTxBps, 16);
        b_0.storeUint(src.maxWalletBps, 16);
        b_0.storeUint(src.cooldown, 16);
    };
}

export function loadSetFeeConfig(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1007896360) { throw Error('Invalid prefix'); }
    const _feeBps = sc_0.loadUintBig(16);
    const _burnShare = sc_0.loadUintBig(8);
    const _maxTxBps = sc_0.loadUintBig(16);
    const _maxWalletBps = sc_0.loadUintBig(16);
    const _cooldown = sc_0.loadUintBig(16);
    return { $$type: 'SetFeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown };
}

export function loadTupleSetFeeConfig(source: TupleReader) {
    const _feeBps = source.readBigNumber();
    const _burnShare = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    return { $$type: 'SetFeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown };
}

export function loadGetterTupleSetFeeConfig(source: TupleReader) {
    const _feeBps = source.readBigNumber();
    const _burnShare = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    return { $$type: 'SetFeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown };
}

export function storeTupleSetFeeConfig(source: SetFeeConfig) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.feeBps);
    builder.writeNumber(source.burnShare);
    builder.writeNumber(source.maxTxBps);
    builder.writeNumber(source.maxWalletBps);
    builder.writeNumber(source.cooldown);
    return builder.build();
}

export function dictValueParserSetFeeConfig(): DictionaryValue<SetFeeConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetFeeConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetFeeConfig(src.loadRef().beginParse());
        }
    }
}

export type ToggleTrading = {
    $$type: 'ToggleTrading';
    enabled: boolean;
}

export function storeToggleTrading(src: ToggleTrading) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4051840417, 32);
        b_0.storeBit(src.enabled);
    };
}

export function loadToggleTrading(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4051840417) { throw Error('Invalid prefix'); }
    const _enabled = sc_0.loadBit();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

export function loadTupleToggleTrading(source: TupleReader) {
    const _enabled = source.readBoolean();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

export function loadGetterTupleToggleTrading(source: TupleReader) {
    const _enabled = source.readBoolean();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

export function storeTupleToggleTrading(source: ToggleTrading) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    return builder.build();
}

export function dictValueParserToggleTrading(): DictionaryValue<ToggleTrading> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeToggleTrading(src)).endCell());
        },
        parse: (src) => {
            return loadToggleTrading(src.loadRef().beginParse());
        }
    }
}

export type TriggerBuyback = {
    $$type: 'TriggerBuyback';
    queryId: bigint;
}

export function storeTriggerBuyback(src: TriggerBuyback) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3487694140, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadTriggerBuyback(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3487694140) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'TriggerBuyback' as const, queryId: _queryId };
}

export function loadTupleTriggerBuyback(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'TriggerBuyback' as const, queryId: _queryId };
}

export function loadGetterTupleTriggerBuyback(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'TriggerBuyback' as const, queryId: _queryId };
}

export function storeTupleTriggerBuyback(source: TriggerBuyback) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserTriggerBuyback(): DictionaryValue<TriggerBuyback> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTriggerBuyback(src)).endCell());
        },
        parse: (src) => {
            return loadTriggerBuyback(src.loadRef().beginParse());
        }
    }
}

export type SetBuybackConfig = {
    $$type: 'SetBuybackConfig';
    enabled: boolean;
    threshold: bigint;
    cooldown: bigint;
    burnPercent: bigint;
}

export function storeSetBuybackConfig(src: SetBuybackConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2209879114, 32);
        b_0.storeBit(src.enabled);
        b_0.storeCoins(src.threshold);
        b_0.storeUint(src.cooldown, 32);
        b_0.storeUint(src.burnPercent, 8);
    };
}

export function loadSetBuybackConfig(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2209879114) { throw Error('Invalid prefix'); }
    const _enabled = sc_0.loadBit();
    const _threshold = sc_0.loadCoins();
    const _cooldown = sc_0.loadUintBig(32);
    const _burnPercent = sc_0.loadUintBig(8);
    return { $$type: 'SetBuybackConfig' as const, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent };
}

export function loadTupleSetBuybackConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _threshold = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _burnPercent = source.readBigNumber();
    return { $$type: 'SetBuybackConfig' as const, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent };
}

export function loadGetterTupleSetBuybackConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _threshold = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _burnPercent = source.readBigNumber();
    return { $$type: 'SetBuybackConfig' as const, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent };
}

export function storeTupleSetBuybackConfig(source: SetBuybackConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.threshold);
    builder.writeNumber(source.cooldown);
    builder.writeNumber(source.burnPercent);
    return builder.build();
}

export function dictValueParserSetBuybackConfig(): DictionaryValue<SetBuybackConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetBuybackConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetBuybackConfig(src.loadRef().beginParse());
        }
    }
}

export type SetDefiAddress = {
    $$type: 'SetDefiAddress';
    defiAddress: Address;
}

export function storeSetDefiAddress(src: SetDefiAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(587306774, 32);
        b_0.storeAddress(src.defiAddress);
    };
}

export function loadSetDefiAddress(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 587306774) { throw Error('Invalid prefix'); }
    const _defiAddress = sc_0.loadAddress();
    return { $$type: 'SetDefiAddress' as const, defiAddress: _defiAddress };
}

export function loadTupleSetDefiAddress(source: TupleReader) {
    const _defiAddress = source.readAddress();
    return { $$type: 'SetDefiAddress' as const, defiAddress: _defiAddress };
}

export function loadGetterTupleSetDefiAddress(source: TupleReader) {
    const _defiAddress = source.readAddress();
    return { $$type: 'SetDefiAddress' as const, defiAddress: _defiAddress };
}

export function storeTupleSetDefiAddress(source: SetDefiAddress) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.defiAddress);
    return builder.build();
}

export function dictValueParserSetDefiAddress(): DictionaryValue<SetDefiAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetDefiAddress(src)).endCell());
        },
        parse: (src) => {
            return loadSetDefiAddress(src.loadRef().beginParse());
        }
    }
}

export type SyncFeeToDefi = {
    $$type: 'SyncFeeToDefi';
    amount: bigint;
}

export function storeSyncFeeToDefi(src: SyncFeeToDefi) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(94992733, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadSyncFeeToDefi(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 94992733) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'SyncFeeToDefi' as const, amount: _amount };
}

export function loadTupleSyncFeeToDefi(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'SyncFeeToDefi' as const, amount: _amount };
}

export function loadGetterTupleSyncFeeToDefi(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'SyncFeeToDefi' as const, amount: _amount };
}

export function storeTupleSyncFeeToDefi(source: SyncFeeToDefi) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserSyncFeeToDefi(): DictionaryValue<SyncFeeToDefi> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSyncFeeToDefi(src)).endCell());
        },
        parse: (src) => {
            return loadSyncFeeToDefi(src.loadRef().beginParse());
        }
    }
}

export type Stake = {
    $$type: 'Stake';
    amount: bigint;
}

export function storeStake(src: Stake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3203459332, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadStake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3203459332) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'Stake' as const, amount: _amount };
}

export function loadTupleStake(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Stake' as const, amount: _amount };
}

export function loadGetterTupleStake(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Stake' as const, amount: _amount };
}

export function storeTupleStake(source: Stake) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserStake(): DictionaryValue<Stake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStake(src)).endCell());
        },
        parse: (src) => {
            return loadStake(src.loadRef().beginParse());
        }
    }
}

export type Unstake = {
    $$type: 'Unstake';
    amount: bigint;
}

export function storeUnstake(src: Unstake) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4284693473, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadUnstake(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4284693473) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'Unstake' as const, amount: _amount };
}

export function loadTupleUnstake(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Unstake' as const, amount: _amount };
}

export function loadGetterTupleUnstake(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Unstake' as const, amount: _amount };
}

export function storeTupleUnstake(source: Unstake) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserUnstake(): DictionaryValue<Unstake> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUnstake(src)).endCell());
        },
        parse: (src) => {
            return loadUnstake(src.loadRef().beginParse());
        }
    }
}

export type ClaimRewards = {
    $$type: 'ClaimRewards';
}

export function storeClaimRewards(src: ClaimRewards) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(155852668, 32);
    };
}

export function loadClaimRewards(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 155852668) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimRewards' as const };
}

export function loadTupleClaimRewards(source: TupleReader) {
    return { $$type: 'ClaimRewards' as const };
}

export function loadGetterTupleClaimRewards(source: TupleReader) {
    return { $$type: 'ClaimRewards' as const };
}

export function storeTupleClaimRewards(source: ClaimRewards) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserClaimRewards(): DictionaryValue<ClaimRewards> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimRewards(src)).endCell());
        },
        parse: (src) => {
            return loadClaimRewards(src.loadRef().beginParse());
        }
    }
}

export type SetStakingConfig = {
    $$type: 'SetStakingConfig';
    enabled: boolean;
    apyBps: bigint;
    minStake: bigint;
    lockPeriod: bigint;
}

export function storeSetStakingConfig(src: SetStakingConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(331180850, 32);
        b_0.storeBit(src.enabled);
        b_0.storeUint(src.apyBps, 16);
        b_0.storeCoins(src.minStake);
        b_0.storeUint(src.lockPeriod, 32);
    };
}

export function loadSetStakingConfig(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 331180850) { throw Error('Invalid prefix'); }
    const _enabled = sc_0.loadBit();
    const _apyBps = sc_0.loadUintBig(16);
    const _minStake = sc_0.loadCoins();
    const _lockPeriod = sc_0.loadUintBig(32);
    return { $$type: 'SetStakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod };
}

export function loadTupleSetStakingConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _apyBps = source.readBigNumber();
    const _minStake = source.readBigNumber();
    const _lockPeriod = source.readBigNumber();
    return { $$type: 'SetStakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod };
}

export function loadGetterTupleSetStakingConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _apyBps = source.readBigNumber();
    const _minStake = source.readBigNumber();
    const _lockPeriod = source.readBigNumber();
    return { $$type: 'SetStakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod };
}

export function storeTupleSetStakingConfig(source: SetStakingConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.apyBps);
    builder.writeNumber(source.minStake);
    builder.writeNumber(source.lockPeriod);
    return builder.build();
}

export function dictValueParserSetStakingConfig(): DictionaryValue<SetStakingConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetStakingConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetStakingConfig(src.loadRef().beginParse());
        }
    }
}

export type RegisterReferral = {
    $$type: 'RegisterReferral';
    referrer: Address;
}

export function storeRegisterReferral(src: RegisterReferral) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3551857443, 32);
        b_0.storeAddress(src.referrer);
    };
}

export function loadRegisterReferral(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3551857443) { throw Error('Invalid prefix'); }
    const _referrer = sc_0.loadAddress();
    return { $$type: 'RegisterReferral' as const, referrer: _referrer };
}

export function loadTupleRegisterReferral(source: TupleReader) {
    const _referrer = source.readAddress();
    return { $$type: 'RegisterReferral' as const, referrer: _referrer };
}

export function loadGetterTupleRegisterReferral(source: TupleReader) {
    const _referrer = source.readAddress();
    return { $$type: 'RegisterReferral' as const, referrer: _referrer };
}

export function storeTupleRegisterReferral(source: RegisterReferral) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.referrer);
    return builder.build();
}

export function dictValueParserRegisterReferral(): DictionaryValue<RegisterReferral> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRegisterReferral(src)).endCell());
        },
        parse: (src) => {
            return loadRegisterReferral(src.loadRef().beginParse());
        }
    }
}

export type ClaimReferralRewards = {
    $$type: 'ClaimReferralRewards';
}

export function storeClaimReferralRewards(src: ClaimReferralRewards) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3188740785, 32);
    };
}

export function loadClaimReferralRewards(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3188740785) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimReferralRewards' as const };
}

export function loadTupleClaimReferralRewards(source: TupleReader) {
    return { $$type: 'ClaimReferralRewards' as const };
}

export function loadGetterTupleClaimReferralRewards(source: TupleReader) {
    return { $$type: 'ClaimReferralRewards' as const };
}

export function storeTupleClaimReferralRewards(source: ClaimReferralRewards) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserClaimReferralRewards(): DictionaryValue<ClaimReferralRewards> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimReferralRewards(src)).endCell());
        },
        parse: (src) => {
            return loadClaimReferralRewards(src.loadRef().beginParse());
        }
    }
}

export type SetReferralConfig = {
    $$type: 'SetReferralConfig';
    enabled: boolean;
    rewardBps: bigint;
}

export function storeSetReferralConfig(src: SetReferralConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(447783234, 32);
        b_0.storeBit(src.enabled);
        b_0.storeUint(src.rewardBps, 16);
    };
}

export function loadSetReferralConfig(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 447783234) { throw Error('Invalid prefix'); }
    const _enabled = sc_0.loadBit();
    const _rewardBps = sc_0.loadUintBig(16);
    return { $$type: 'SetReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

export function loadTupleSetReferralConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _rewardBps = source.readBigNumber();
    return { $$type: 'SetReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

export function loadGetterTupleSetReferralConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _rewardBps = source.readBigNumber();
    return { $$type: 'SetReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

export function storeTupleSetReferralConfig(source: SetReferralConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.rewardBps);
    return builder.build();
}

export function dictValueParserSetReferralConfig(): DictionaryValue<SetReferralConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetReferralConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetReferralConfig(src.loadRef().beginParse());
        }
    }
}

export type AddVesting = {
    $$type: 'AddVesting';
    beneficiary: Address;
    totalAmount: bigint;
    cliff: bigint;
    duration: bigint;
}

export function storeAddVesting(src: AddVesting) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3930012637, 32);
        b_0.storeAddress(src.beneficiary);
        b_0.storeCoins(src.totalAmount);
        b_0.storeUint(src.cliff, 32);
        b_0.storeUint(src.duration, 32);
    };
}

export function loadAddVesting(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3930012637) { throw Error('Invalid prefix'); }
    const _beneficiary = sc_0.loadAddress();
    const _totalAmount = sc_0.loadCoins();
    const _cliff = sc_0.loadUintBig(32);
    const _duration = sc_0.loadUintBig(32);
    return { $$type: 'AddVesting' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, cliff: _cliff, duration: _duration };
}

export function loadTupleAddVesting(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _totalAmount = source.readBigNumber();
    const _cliff = source.readBigNumber();
    const _duration = source.readBigNumber();
    return { $$type: 'AddVesting' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, cliff: _cliff, duration: _duration };
}

export function loadGetterTupleAddVesting(source: TupleReader) {
    const _beneficiary = source.readAddress();
    const _totalAmount = source.readBigNumber();
    const _cliff = source.readBigNumber();
    const _duration = source.readBigNumber();
    return { $$type: 'AddVesting' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, cliff: _cliff, duration: _duration };
}

export function storeTupleAddVesting(source: AddVesting) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    builder.writeNumber(source.totalAmount);
    builder.writeNumber(source.cliff);
    builder.writeNumber(source.duration);
    return builder.build();
}

export function dictValueParserAddVesting(): DictionaryValue<AddVesting> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddVesting(src)).endCell());
        },
        parse: (src) => {
            return loadAddVesting(src.loadRef().beginParse());
        }
    }
}

export type ClaimVested = {
    $$type: 'ClaimVested';
}

export function storeClaimVested(src: ClaimVested) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(4152964106, 32);
    };
}

export function loadClaimVested(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 4152964106) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimVested' as const };
}

export function loadTupleClaimVested(source: TupleReader) {
    return { $$type: 'ClaimVested' as const };
}

export function loadGetterTupleClaimVested(source: TupleReader) {
    return { $$type: 'ClaimVested' as const };
}

export function storeTupleClaimVested(source: ClaimVested) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserClaimVested(): DictionaryValue<ClaimVested> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimVested(src)).endCell());
        },
        parse: (src) => {
            return loadClaimVested(src.loadRef().beginParse());
        }
    }
}

export type TriggerLottery = {
    $$type: 'TriggerLottery';
    queryId: bigint;
}

export function storeTriggerLottery(src: TriggerLottery) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2876814287, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadTriggerLottery(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2876814287) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'TriggerLottery' as const, queryId: _queryId };
}

export function loadTupleTriggerLottery(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'TriggerLottery' as const, queryId: _queryId };
}

export function loadGetterTupleTriggerLottery(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'TriggerLottery' as const, queryId: _queryId };
}

export function storeTupleTriggerLottery(source: TriggerLottery) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserTriggerLottery(): DictionaryValue<TriggerLottery> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTriggerLottery(src)).endCell());
        },
        parse: (src) => {
            return loadTriggerLottery(src.loadRef().beginParse());
        }
    }
}

export type SetLotteryConfig = {
    $$type: 'SetLotteryConfig';
    enabled: boolean;
    ticketPrice: bigint;
    drawInterval: bigint;
    jackpotShare: bigint;
}

export function storeSetLotteryConfig(src: SetLotteryConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(463535866, 32);
        b_0.storeBit(src.enabled);
        b_0.storeCoins(src.ticketPrice);
        b_0.storeUint(src.drawInterval, 32);
        b_0.storeUint(src.jackpotShare, 8);
    };
}

export function loadSetLotteryConfig(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 463535866) { throw Error('Invalid prefix'); }
    const _enabled = sc_0.loadBit();
    const _ticketPrice = sc_0.loadCoins();
    const _drawInterval = sc_0.loadUintBig(32);
    const _jackpotShare = sc_0.loadUintBig(8);
    return { $$type: 'SetLotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare };
}

export function loadTupleSetLotteryConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _ticketPrice = source.readBigNumber();
    const _drawInterval = source.readBigNumber();
    const _jackpotShare = source.readBigNumber();
    return { $$type: 'SetLotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare };
}

export function loadGetterTupleSetLotteryConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _ticketPrice = source.readBigNumber();
    const _drawInterval = source.readBigNumber();
    const _jackpotShare = source.readBigNumber();
    return { $$type: 'SetLotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare };
}

export function storeTupleSetLotteryConfig(source: SetLotteryConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.drawInterval);
    builder.writeNumber(source.jackpotShare);
    return builder.build();
}

export function dictValueParserSetLotteryConfig(): DictionaryValue<SetLotteryConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetLotteryConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetLotteryConfig(src.loadRef().beginParse());
        }
    }
}

export type JettonData = {
    $$type: 'JettonData';
    totalSupply: bigint;
    mintable: boolean;
    adminAddress: Address;
    jettonContent: Cell;
    jettonWalletCode: Cell;
}

export function storeJettonData(src: JettonData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.totalSupply, 257);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.adminAddress);
        b_0.storeRef(src.jettonContent);
        b_0.storeRef(src.jettonWalletCode);
    };
}

export function loadJettonData(slice: Slice) {
    const sc_0 = slice;
    const _totalSupply = sc_0.loadIntBig(257);
    const _mintable = sc_0.loadBit();
    const _adminAddress = sc_0.loadAddress();
    const _jettonContent = sc_0.loadRef();
    const _jettonWalletCode = sc_0.loadRef();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, adminAddress: _adminAddress, jettonContent: _jettonContent, jettonWalletCode: _jettonWalletCode };
}

export function loadTupleJettonData(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _adminAddress = source.readAddress();
    const _jettonContent = source.readCell();
    const _jettonWalletCode = source.readCell();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, adminAddress: _adminAddress, jettonContent: _jettonContent, jettonWalletCode: _jettonWalletCode };
}

export function loadGetterTupleJettonData(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _adminAddress = source.readAddress();
    const _jettonContent = source.readCell();
    const _jettonWalletCode = source.readCell();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, adminAddress: _adminAddress, jettonContent: _jettonContent, jettonWalletCode: _jettonWalletCode };
}

export function storeTupleJettonData(source: JettonData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.adminAddress);
    builder.writeCell(source.jettonContent);
    builder.writeCell(source.jettonWalletCode);
    return builder.build();
}

export function dictValueParserJettonData(): DictionaryValue<JettonData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonData(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    balance: bigint;
    owner: Address;
    master: Address;
    walletCode: Cell;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeRef(src.walletCode);
    };
}

export function loadJettonWalletData(slice: Slice) {
    const sc_0 = slice;
    const _balance = sc_0.loadIntBig(257);
    const _owner = sc_0.loadAddress();
    const _master = sc_0.loadAddress();
    const _walletCode = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

export function loadTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _master = source.readAddress();
    const _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

export function loadGetterTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _master = source.readAddress();
    const _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

export function storeTupleJettonWalletData(source: JettonWalletData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeCell(source.walletCode);
    return builder.build();
}

export function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type AIState = {
    $$type: 'AIState';
    oracleAddress: Address;
    aiModeEnabled: boolean;
    fullAutonomy: boolean;
    lastRebalanceAt: bigint;
    totalSignalsReceived: bigint;
    currentFeeBps: bigint;
    priceHistoryCount: bigint;
    anomalyCount: bigint;
    lastHeartbeat: bigint;
    isAlive: boolean;
}

export function storeAIState(src: AIState) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.oracleAddress);
        b_0.storeBit(src.aiModeEnabled);
        b_0.storeBit(src.fullAutonomy);
        b_0.storeInt(src.lastRebalanceAt, 257);
        b_0.storeInt(src.totalSignalsReceived, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.currentFeeBps, 257);
        b_1.storeInt(src.priceHistoryCount, 257);
        b_1.storeInt(src.anomalyCount, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.lastHeartbeat, 257);
        b_2.storeBit(src.isAlive);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAIState(slice: Slice) {
    const sc_0 = slice;
    const _oracleAddress = sc_0.loadAddress();
    const _aiModeEnabled = sc_0.loadBit();
    const _fullAutonomy = sc_0.loadBit();
    const _lastRebalanceAt = sc_0.loadIntBig(257);
    const _totalSignalsReceived = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _currentFeeBps = sc_1.loadIntBig(257);
    const _priceHistoryCount = sc_1.loadIntBig(257);
    const _anomalyCount = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _lastHeartbeat = sc_2.loadIntBig(257);
    const _isAlive = sc_2.loadBit();
    return { $$type: 'AIState' as const, oracleAddress: _oracleAddress, aiModeEnabled: _aiModeEnabled, fullAutonomy: _fullAutonomy, lastRebalanceAt: _lastRebalanceAt, totalSignalsReceived: _totalSignalsReceived, currentFeeBps: _currentFeeBps, priceHistoryCount: _priceHistoryCount, anomalyCount: _anomalyCount, lastHeartbeat: _lastHeartbeat, isAlive: _isAlive };
}

export function loadTupleAIState(source: TupleReader) {
    const _oracleAddress = source.readAddress();
    const _aiModeEnabled = source.readBoolean();
    const _fullAutonomy = source.readBoolean();
    const _lastRebalanceAt = source.readBigNumber();
    const _totalSignalsReceived = source.readBigNumber();
    const _currentFeeBps = source.readBigNumber();
    const _priceHistoryCount = source.readBigNumber();
    const _anomalyCount = source.readBigNumber();
    const _lastHeartbeat = source.readBigNumber();
    const _isAlive = source.readBoolean();
    return { $$type: 'AIState' as const, oracleAddress: _oracleAddress, aiModeEnabled: _aiModeEnabled, fullAutonomy: _fullAutonomy, lastRebalanceAt: _lastRebalanceAt, totalSignalsReceived: _totalSignalsReceived, currentFeeBps: _currentFeeBps, priceHistoryCount: _priceHistoryCount, anomalyCount: _anomalyCount, lastHeartbeat: _lastHeartbeat, isAlive: _isAlive };
}

export function loadGetterTupleAIState(source: TupleReader) {
    const _oracleAddress = source.readAddress();
    const _aiModeEnabled = source.readBoolean();
    const _fullAutonomy = source.readBoolean();
    const _lastRebalanceAt = source.readBigNumber();
    const _totalSignalsReceived = source.readBigNumber();
    const _currentFeeBps = source.readBigNumber();
    const _priceHistoryCount = source.readBigNumber();
    const _anomalyCount = source.readBigNumber();
    const _lastHeartbeat = source.readBigNumber();
    const _isAlive = source.readBoolean();
    return { $$type: 'AIState' as const, oracleAddress: _oracleAddress, aiModeEnabled: _aiModeEnabled, fullAutonomy: _fullAutonomy, lastRebalanceAt: _lastRebalanceAt, totalSignalsReceived: _totalSignalsReceived, currentFeeBps: _currentFeeBps, priceHistoryCount: _priceHistoryCount, anomalyCount: _anomalyCount, lastHeartbeat: _lastHeartbeat, isAlive: _isAlive };
}

export function storeTupleAIState(source: AIState) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.oracleAddress);
    builder.writeBoolean(source.aiModeEnabled);
    builder.writeBoolean(source.fullAutonomy);
    builder.writeNumber(source.lastRebalanceAt);
    builder.writeNumber(source.totalSignalsReceived);
    builder.writeNumber(source.currentFeeBps);
    builder.writeNumber(source.priceHistoryCount);
    builder.writeNumber(source.anomalyCount);
    builder.writeNumber(source.lastHeartbeat);
    builder.writeBoolean(source.isAlive);
    return builder.build();
}

export function dictValueParserAIState(): DictionaryValue<AIState> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIState(src)).endCell());
        },
        parse: (src) => {
            return loadAIState(src.loadRef().beginParse());
        }
    }
}

export type FeeConfig = {
    $$type: 'FeeConfig';
    feeBps: bigint;
    burnShare: bigint;
    treasuryShare: bigint;
    maxTxBps: bigint;
    maxWalletBps: bigint;
    cooldown: bigint;
    totalBurned: bigint;
    totalFeesCollected: bigint;
}

export function storeFeeConfig(src: FeeConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.feeBps, 257);
        b_0.storeInt(src.burnShare, 257);
        b_0.storeInt(src.treasuryShare, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.maxTxBps, 257);
        b_1.storeInt(src.maxWalletBps, 257);
        b_1.storeInt(src.cooldown, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.totalBurned, 257);
        b_2.storeInt(src.totalFeesCollected, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadFeeConfig(slice: Slice) {
    const sc_0 = slice;
    const _feeBps = sc_0.loadIntBig(257);
    const _burnShare = sc_0.loadIntBig(257);
    const _treasuryShare = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _maxTxBps = sc_1.loadIntBig(257);
    const _maxWalletBps = sc_1.loadIntBig(257);
    const _cooldown = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _totalBurned = sc_2.loadIntBig(257);
    const _totalFeesCollected = sc_2.loadIntBig(257);
    return { $$type: 'FeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, treasuryShare: _treasuryShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected };
}

export function loadTupleFeeConfig(source: TupleReader) {
    const _feeBps = source.readBigNumber();
    const _burnShare = source.readBigNumber();
    const _treasuryShare = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _totalBurned = source.readBigNumber();
    const _totalFeesCollected = source.readBigNumber();
    return { $$type: 'FeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, treasuryShare: _treasuryShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected };
}

export function loadGetterTupleFeeConfig(source: TupleReader) {
    const _feeBps = source.readBigNumber();
    const _burnShare = source.readBigNumber();
    const _treasuryShare = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _totalBurned = source.readBigNumber();
    const _totalFeesCollected = source.readBigNumber();
    return { $$type: 'FeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, treasuryShare: _treasuryShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected };
}

export function storeTupleFeeConfig(source: FeeConfig) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.feeBps);
    builder.writeNumber(source.burnShare);
    builder.writeNumber(source.treasuryShare);
    builder.writeNumber(source.maxTxBps);
    builder.writeNumber(source.maxWalletBps);
    builder.writeNumber(source.cooldown);
    builder.writeNumber(source.totalBurned);
    builder.writeNumber(source.totalFeesCollected);
    return builder.build();
}

export function dictValueParserFeeConfig(): DictionaryValue<FeeConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFeeConfig(src)).endCell());
        },
        parse: (src) => {
            return loadFeeConfig(src.loadRef().beginParse());
        }
    }
}

export type BuybackState = {
    $$type: 'BuybackState';
    enabled: boolean;
    pool: bigint;
    threshold: bigint;
    cooldown: bigint;
    burnPercent: bigint;
    lastBuybackAt: bigint;
    totalBuybacks: bigint;
    totalQsrBurnedViaBuyback: bigint;
    totalTonSpent: bigint;
}

export function storeBuybackState(src: BuybackState) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.pool, 257);
        b_0.storeInt(src.threshold, 257);
        b_0.storeInt(src.cooldown, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.burnPercent, 257);
        b_1.storeInt(src.lastBuybackAt, 257);
        b_1.storeInt(src.totalBuybacks, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.totalQsrBurnedViaBuyback, 257);
        b_2.storeInt(src.totalTonSpent, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadBuybackState(slice: Slice) {
    const sc_0 = slice;
    const _enabled = sc_0.loadBit();
    const _pool = sc_0.loadIntBig(257);
    const _threshold = sc_0.loadIntBig(257);
    const _cooldown = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _burnPercent = sc_1.loadIntBig(257);
    const _lastBuybackAt = sc_1.loadIntBig(257);
    const _totalBuybacks = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _totalQsrBurnedViaBuyback = sc_2.loadIntBig(257);
    const _totalTonSpent = sc_2.loadIntBig(257);
    return { $$type: 'BuybackState' as const, enabled: _enabled, pool: _pool, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, lastBuybackAt: _lastBuybackAt, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpent: _totalTonSpent };
}

export function loadTupleBuybackState(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _pool = source.readBigNumber();
    const _threshold = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _burnPercent = source.readBigNumber();
    const _lastBuybackAt = source.readBigNumber();
    const _totalBuybacks = source.readBigNumber();
    const _totalQsrBurnedViaBuyback = source.readBigNumber();
    const _totalTonSpent = source.readBigNumber();
    return { $$type: 'BuybackState' as const, enabled: _enabled, pool: _pool, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, lastBuybackAt: _lastBuybackAt, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpent: _totalTonSpent };
}

export function loadGetterTupleBuybackState(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _pool = source.readBigNumber();
    const _threshold = source.readBigNumber();
    const _cooldown = source.readBigNumber();
    const _burnPercent = source.readBigNumber();
    const _lastBuybackAt = source.readBigNumber();
    const _totalBuybacks = source.readBigNumber();
    const _totalQsrBurnedViaBuyback = source.readBigNumber();
    const _totalTonSpent = source.readBigNumber();
    return { $$type: 'BuybackState' as const, enabled: _enabled, pool: _pool, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, lastBuybackAt: _lastBuybackAt, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpent: _totalTonSpent };
}

export function storeTupleBuybackState(source: BuybackState) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.pool);
    builder.writeNumber(source.threshold);
    builder.writeNumber(source.cooldown);
    builder.writeNumber(source.burnPercent);
    builder.writeNumber(source.lastBuybackAt);
    builder.writeNumber(source.totalBuybacks);
    builder.writeNumber(source.totalQsrBurnedViaBuyback);
    builder.writeNumber(source.totalTonSpent);
    return builder.build();
}

export function dictValueParserBuybackState(): DictionaryValue<BuybackState> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuybackState(src)).endCell());
        },
        parse: (src) => {
            return loadBuybackState(src.loadRef().beginParse());
        }
    }
}

export type AutonomyState = {
    $$type: 'AutonomyState';
    fullAutonomyEnabled: boolean;
    aiActionCooldown: bigint;
    lastAiActionTime: bigint;
    heartbeatTimeout: bigint;
    lastHeartbeat: bigint;
    ownerOverrideWindow: bigint;
    vetoThresholdBps: bigint;
    totalVetoStake: bigint;
    pendingActions: bigint;
}

export function storeAutonomyState(src: AutonomyState) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.fullAutonomyEnabled);
        b_0.storeInt(src.aiActionCooldown, 257);
        b_0.storeInt(src.lastAiActionTime, 257);
        b_0.storeInt(src.heartbeatTimeout, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.lastHeartbeat, 257);
        b_1.storeInt(src.ownerOverrideWindow, 257);
        b_1.storeInt(src.vetoThresholdBps, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.totalVetoStake, 257);
        b_2.storeInt(src.pendingActions, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAutonomyState(slice: Slice) {
    const sc_0 = slice;
    const _fullAutonomyEnabled = sc_0.loadBit();
    const _aiActionCooldown = sc_0.loadIntBig(257);
    const _lastAiActionTime = sc_0.loadIntBig(257);
    const _heartbeatTimeout = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _lastHeartbeat = sc_1.loadIntBig(257);
    const _ownerOverrideWindow = sc_1.loadIntBig(257);
    const _vetoThresholdBps = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _totalVetoStake = sc_2.loadIntBig(257);
    const _pendingActions = sc_2.loadIntBig(257);
    return { $$type: 'AutonomyState' as const, fullAutonomyEnabled: _fullAutonomyEnabled, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, totalVetoStake: _totalVetoStake, pendingActions: _pendingActions };
}

export function loadTupleAutonomyState(source: TupleReader) {
    const _fullAutonomyEnabled = source.readBoolean();
    const _aiActionCooldown = source.readBigNumber();
    const _lastAiActionTime = source.readBigNumber();
    const _heartbeatTimeout = source.readBigNumber();
    const _lastHeartbeat = source.readBigNumber();
    const _ownerOverrideWindow = source.readBigNumber();
    const _vetoThresholdBps = source.readBigNumber();
    const _totalVetoStake = source.readBigNumber();
    const _pendingActions = source.readBigNumber();
    return { $$type: 'AutonomyState' as const, fullAutonomyEnabled: _fullAutonomyEnabled, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, totalVetoStake: _totalVetoStake, pendingActions: _pendingActions };
}

export function loadGetterTupleAutonomyState(source: TupleReader) {
    const _fullAutonomyEnabled = source.readBoolean();
    const _aiActionCooldown = source.readBigNumber();
    const _lastAiActionTime = source.readBigNumber();
    const _heartbeatTimeout = source.readBigNumber();
    const _lastHeartbeat = source.readBigNumber();
    const _ownerOverrideWindow = source.readBigNumber();
    const _vetoThresholdBps = source.readBigNumber();
    const _totalVetoStake = source.readBigNumber();
    const _pendingActions = source.readBigNumber();
    return { $$type: 'AutonomyState' as const, fullAutonomyEnabled: _fullAutonomyEnabled, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, totalVetoStake: _totalVetoStake, pendingActions: _pendingActions };
}

export function storeTupleAutonomyState(source: AutonomyState) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.fullAutonomyEnabled);
    builder.writeNumber(source.aiActionCooldown);
    builder.writeNumber(source.lastAiActionTime);
    builder.writeNumber(source.heartbeatTimeout);
    builder.writeNumber(source.lastHeartbeat);
    builder.writeNumber(source.ownerOverrideWindow);
    builder.writeNumber(source.vetoThresholdBps);
    builder.writeNumber(source.totalVetoStake);
    builder.writeNumber(source.pendingActions);
    return builder.build();
}

export function dictValueParserAutonomyState(): DictionaryValue<AutonomyState> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAutonomyState(src)).endCell());
        },
        parse: (src) => {
            return loadAutonomyState(src.loadRef().beginParse());
        }
    }
}

export type AIActionLog = {
    $$type: 'AIActionLog';
    actionId: bigint;
    timestamp: bigint;
    actionType: string;
    oldValue: bigint;
    newValue: bigint;
    reason: string;
    executed: boolean;
    vetoed: boolean;
    overridden: boolean;
}

export function storeAIActionLog(src: AIActionLog) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.actionId, 257);
        b_0.storeInt(src.timestamp, 257);
        b_0.storeStringRefTail(src.actionType);
        b_0.storeInt(src.oldValue, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.newValue, 257);
        b_1.storeStringRefTail(src.reason);
        b_1.storeBit(src.executed);
        b_1.storeBit(src.vetoed);
        b_1.storeBit(src.overridden);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAIActionLog(slice: Slice) {
    const sc_0 = slice;
    const _actionId = sc_0.loadIntBig(257);
    const _timestamp = sc_0.loadIntBig(257);
    const _actionType = sc_0.loadStringRefTail();
    const _oldValue = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _newValue = sc_1.loadIntBig(257);
    const _reason = sc_1.loadStringRefTail();
    const _executed = sc_1.loadBit();
    const _vetoed = sc_1.loadBit();
    const _overridden = sc_1.loadBit();
    return { $$type: 'AIActionLog' as const, actionId: _actionId, timestamp: _timestamp, actionType: _actionType, oldValue: _oldValue, newValue: _newValue, reason: _reason, executed: _executed, vetoed: _vetoed, overridden: _overridden };
}

export function loadTupleAIActionLog(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _timestamp = source.readBigNumber();
    const _actionType = source.readString();
    const _oldValue = source.readBigNumber();
    const _newValue = source.readBigNumber();
    const _reason = source.readString();
    const _executed = source.readBoolean();
    const _vetoed = source.readBoolean();
    const _overridden = source.readBoolean();
    return { $$type: 'AIActionLog' as const, actionId: _actionId, timestamp: _timestamp, actionType: _actionType, oldValue: _oldValue, newValue: _newValue, reason: _reason, executed: _executed, vetoed: _vetoed, overridden: _overridden };
}

export function loadGetterTupleAIActionLog(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _timestamp = source.readBigNumber();
    const _actionType = source.readString();
    const _oldValue = source.readBigNumber();
    const _newValue = source.readBigNumber();
    const _reason = source.readString();
    const _executed = source.readBoolean();
    const _vetoed = source.readBoolean();
    const _overridden = source.readBoolean();
    return { $$type: 'AIActionLog' as const, actionId: _actionId, timestamp: _timestamp, actionType: _actionType, oldValue: _oldValue, newValue: _newValue, reason: _reason, executed: _executed, vetoed: _vetoed, overridden: _overridden };
}

export function storeTupleAIActionLog(source: AIActionLog) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeNumber(source.timestamp);
    builder.writeString(source.actionType);
    builder.writeNumber(source.oldValue);
    builder.writeNumber(source.newValue);
    builder.writeString(source.reason);
    builder.writeBoolean(source.executed);
    builder.writeBoolean(source.vetoed);
    builder.writeBoolean(source.overridden);
    return builder.build();
}

export function dictValueParserAIActionLog(): DictionaryValue<AIActionLog> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIActionLog(src)).endCell());
        },
        parse: (src) => {
            return loadAIActionLog(src.loadRef().beginParse());
        }
    }
}

export type VetoState = {
    $$type: 'VetoState';
    actionId: bigint;
    totalStake: bigint;
    vetoCount: bigint;
    threshold: bigint;
    active: boolean;
}

export function storeVetoState(src: VetoState) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.actionId, 257);
        b_0.storeInt(src.totalStake, 257);
        b_0.storeInt(src.vetoCount, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.threshold, 257);
        b_1.storeBit(src.active);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVetoState(slice: Slice) {
    const sc_0 = slice;
    const _actionId = sc_0.loadIntBig(257);
    const _totalStake = sc_0.loadIntBig(257);
    const _vetoCount = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _threshold = sc_1.loadIntBig(257);
    const _active = sc_1.loadBit();
    return { $$type: 'VetoState' as const, actionId: _actionId, totalStake: _totalStake, vetoCount: _vetoCount, threshold: _threshold, active: _active };
}

export function loadTupleVetoState(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _totalStake = source.readBigNumber();
    const _vetoCount = source.readBigNumber();
    const _threshold = source.readBigNumber();
    const _active = source.readBoolean();
    return { $$type: 'VetoState' as const, actionId: _actionId, totalStake: _totalStake, vetoCount: _vetoCount, threshold: _threshold, active: _active };
}

export function loadGetterTupleVetoState(source: TupleReader) {
    const _actionId = source.readBigNumber();
    const _totalStake = source.readBigNumber();
    const _vetoCount = source.readBigNumber();
    const _threshold = source.readBigNumber();
    const _active = source.readBoolean();
    return { $$type: 'VetoState' as const, actionId: _actionId, totalStake: _totalStake, vetoCount: _vetoCount, threshold: _threshold, active: _active };
}

export function storeTupleVetoState(source: VetoState) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeNumber(source.totalStake);
    builder.writeNumber(source.vetoCount);
    builder.writeNumber(source.threshold);
    builder.writeBoolean(source.active);
    return builder.build();
}

export function dictValueParserVetoState(): DictionaryValue<VetoState> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVetoState(src)).endCell());
        },
        parse: (src) => {
            return loadVetoState(src.loadRef().beginParse());
        }
    }
}

export type AIRecommendation = {
    $$type: 'AIRecommendation';
    timestamp: bigint;
    action: string;
    confidence: bigint;
    executed: boolean;
}

export function storeAIRecommendation(src: AIRecommendation) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.timestamp, 257);
        b_0.storeStringRefTail(src.action);
        b_0.storeInt(src.confidence, 257);
        b_0.storeBit(src.executed);
    };
}

export function loadAIRecommendation(slice: Slice) {
    const sc_0 = slice;
    const _timestamp = sc_0.loadIntBig(257);
    const _action = sc_0.loadStringRefTail();
    const _confidence = sc_0.loadIntBig(257);
    const _executed = sc_0.loadBit();
    return { $$type: 'AIRecommendation' as const, timestamp: _timestamp, action: _action, confidence: _confidence, executed: _executed };
}

export function loadTupleAIRecommendation(source: TupleReader) {
    const _timestamp = source.readBigNumber();
    const _action = source.readString();
    const _confidence = source.readBigNumber();
    const _executed = source.readBoolean();
    return { $$type: 'AIRecommendation' as const, timestamp: _timestamp, action: _action, confidence: _confidence, executed: _executed };
}

export function loadGetterTupleAIRecommendation(source: TupleReader) {
    const _timestamp = source.readBigNumber();
    const _action = source.readString();
    const _confidence = source.readBigNumber();
    const _executed = source.readBoolean();
    return { $$type: 'AIRecommendation' as const, timestamp: _timestamp, action: _action, confidence: _confidence, executed: _executed };
}

export function storeTupleAIRecommendation(source: AIRecommendation) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.timestamp);
    builder.writeString(source.action);
    builder.writeNumber(source.confidence);
    builder.writeBoolean(source.executed);
    return builder.build();
}

export function dictValueParserAIRecommendation(): DictionaryValue<AIRecommendation> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAIRecommendation(src)).endCell());
        },
        parse: (src) => {
            return loadAIRecommendation(src.loadRef().beginParse());
        }
    }
}

export type StakeInfo = {
    $$type: 'StakeInfo';
    amount: bigint;
    startTime: bigint;
    lastClaim: bigint;
    lockEnd: bigint;
}

export function storeStakeInfo(src: StakeInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.amount, 257);
        b_0.storeInt(src.startTime, 257);
        b_0.storeInt(src.lastClaim, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.lockEnd, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadStakeInfo(slice: Slice) {
    const sc_0 = slice;
    const _amount = sc_0.loadIntBig(257);
    const _startTime = sc_0.loadIntBig(257);
    const _lastClaim = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _lockEnd = sc_1.loadIntBig(257);
    return { $$type: 'StakeInfo' as const, amount: _amount, startTime: _startTime, lastClaim: _lastClaim, lockEnd: _lockEnd };
}

export function loadTupleStakeInfo(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _lastClaim = source.readBigNumber();
    const _lockEnd = source.readBigNumber();
    return { $$type: 'StakeInfo' as const, amount: _amount, startTime: _startTime, lastClaim: _lastClaim, lockEnd: _lockEnd };
}

export function loadGetterTupleStakeInfo(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _lastClaim = source.readBigNumber();
    const _lockEnd = source.readBigNumber();
    return { $$type: 'StakeInfo' as const, amount: _amount, startTime: _startTime, lastClaim: _lastClaim, lockEnd: _lockEnd };
}

export function storeTupleStakeInfo(source: StakeInfo) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.lastClaim);
    builder.writeNumber(source.lockEnd);
    return builder.build();
}

export function dictValueParserStakeInfo(): DictionaryValue<StakeInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStakeInfo(src)).endCell());
        },
        parse: (src) => {
            return loadStakeInfo(src.loadRef().beginParse());
        }
    }
}

export type StakingConfig = {
    $$type: 'StakingConfig';
    enabled: boolean;
    apyBps: bigint;
    minStake: bigint;
    lockPeriod: bigint;
    totalStaked: bigint;
}

export function storeStakingConfig(src: StakingConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.apyBps, 257);
        b_0.storeInt(src.minStake, 257);
        b_0.storeInt(src.lockPeriod, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.totalStaked, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadStakingConfig(slice: Slice) {
    const sc_0 = slice;
    const _enabled = sc_0.loadBit();
    const _apyBps = sc_0.loadIntBig(257);
    const _minStake = sc_0.loadIntBig(257);
    const _lockPeriod = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _totalStaked = sc_1.loadIntBig(257);
    return { $$type: 'StakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod, totalStaked: _totalStaked };
}

export function loadTupleStakingConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _apyBps = source.readBigNumber();
    const _minStake = source.readBigNumber();
    const _lockPeriod = source.readBigNumber();
    const _totalStaked = source.readBigNumber();
    return { $$type: 'StakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod, totalStaked: _totalStaked };
}

export function loadGetterTupleStakingConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _apyBps = source.readBigNumber();
    const _minStake = source.readBigNumber();
    const _lockPeriod = source.readBigNumber();
    const _totalStaked = source.readBigNumber();
    return { $$type: 'StakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod, totalStaked: _totalStaked };
}

export function storeTupleStakingConfig(source: StakingConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.apyBps);
    builder.writeNumber(source.minStake);
    builder.writeNumber(source.lockPeriod);
    builder.writeNumber(source.totalStaked);
    return builder.build();
}

export function dictValueParserStakingConfig(): DictionaryValue<StakingConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStakingConfig(src)).endCell());
        },
        parse: (src) => {
            return loadStakingConfig(src.loadRef().beginParse());
        }
    }
}

export type ReferralInfo = {
    $$type: 'ReferralInfo';
    referrer: Address;
    totalEarned: bigint;
    totalReferrals: bigint;
}

export function storeReferralInfo(src: ReferralInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.referrer);
        b_0.storeInt(src.totalEarned, 257);
        b_0.storeInt(src.totalReferrals, 257);
    };
}

export function loadReferralInfo(slice: Slice) {
    const sc_0 = slice;
    const _referrer = sc_0.loadAddress();
    const _totalEarned = sc_0.loadIntBig(257);
    const _totalReferrals = sc_0.loadIntBig(257);
    return { $$type: 'ReferralInfo' as const, referrer: _referrer, totalEarned: _totalEarned, totalReferrals: _totalReferrals };
}

export function loadTupleReferralInfo(source: TupleReader) {
    const _referrer = source.readAddress();
    const _totalEarned = source.readBigNumber();
    const _totalReferrals = source.readBigNumber();
    return { $$type: 'ReferralInfo' as const, referrer: _referrer, totalEarned: _totalEarned, totalReferrals: _totalReferrals };
}

export function loadGetterTupleReferralInfo(source: TupleReader) {
    const _referrer = source.readAddress();
    const _totalEarned = source.readBigNumber();
    const _totalReferrals = source.readBigNumber();
    return { $$type: 'ReferralInfo' as const, referrer: _referrer, totalEarned: _totalEarned, totalReferrals: _totalReferrals };
}

export function storeTupleReferralInfo(source: ReferralInfo) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.referrer);
    builder.writeNumber(source.totalEarned);
    builder.writeNumber(source.totalReferrals);
    return builder.build();
}

export function dictValueParserReferralInfo(): DictionaryValue<ReferralInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReferralInfo(src)).endCell());
        },
        parse: (src) => {
            return loadReferralInfo(src.loadRef().beginParse());
        }
    }
}

export type ReferralConfig = {
    $$type: 'ReferralConfig';
    enabled: boolean;
    rewardBps: bigint;
}

export function storeReferralConfig(src: ReferralConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.rewardBps, 257);
    };
}

export function loadReferralConfig(slice: Slice) {
    const sc_0 = slice;
    const _enabled = sc_0.loadBit();
    const _rewardBps = sc_0.loadIntBig(257);
    return { $$type: 'ReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

export function loadTupleReferralConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _rewardBps = source.readBigNumber();
    return { $$type: 'ReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

export function loadGetterTupleReferralConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _rewardBps = source.readBigNumber();
    return { $$type: 'ReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

export function storeTupleReferralConfig(source: ReferralConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.rewardBps);
    return builder.build();
}

export function dictValueParserReferralConfig(): DictionaryValue<ReferralConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReferralConfig(src)).endCell());
        },
        parse: (src) => {
            return loadReferralConfig(src.loadRef().beginParse());
        }
    }
}

export type VestingInfo = {
    $$type: 'VestingInfo';
    totalAmount: bigint;
    claimed: bigint;
    startTime: bigint;
    cliff: bigint;
    duration: bigint;
}

export function storeVestingInfo(src: VestingInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.totalAmount, 257);
        b_0.storeInt(src.claimed, 257);
        b_0.storeInt(src.startTime, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.cliff, 257);
        b_1.storeInt(src.duration, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVestingInfo(slice: Slice) {
    const sc_0 = slice;
    const _totalAmount = sc_0.loadIntBig(257);
    const _claimed = sc_0.loadIntBig(257);
    const _startTime = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _cliff = sc_1.loadIntBig(257);
    const _duration = sc_1.loadIntBig(257);
    return { $$type: 'VestingInfo' as const, totalAmount: _totalAmount, claimed: _claimed, startTime: _startTime, cliff: _cliff, duration: _duration };
}

export function loadTupleVestingInfo(source: TupleReader) {
    const _totalAmount = source.readBigNumber();
    const _claimed = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _cliff = source.readBigNumber();
    const _duration = source.readBigNumber();
    return { $$type: 'VestingInfo' as const, totalAmount: _totalAmount, claimed: _claimed, startTime: _startTime, cliff: _cliff, duration: _duration };
}

export function loadGetterTupleVestingInfo(source: TupleReader) {
    const _totalAmount = source.readBigNumber();
    const _claimed = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _cliff = source.readBigNumber();
    const _duration = source.readBigNumber();
    return { $$type: 'VestingInfo' as const, totalAmount: _totalAmount, claimed: _claimed, startTime: _startTime, cliff: _cliff, duration: _duration };
}

export function storeTupleVestingInfo(source: VestingInfo) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalAmount);
    builder.writeNumber(source.claimed);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.cliff);
    builder.writeNumber(source.duration);
    return builder.build();
}

export function dictValueParserVestingInfo(): DictionaryValue<VestingInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVestingInfo(src)).endCell());
        },
        parse: (src) => {
            return loadVestingInfo(src.loadRef().beginParse());
        }
    }
}

export type LotteryConfig = {
    $$type: 'LotteryConfig';
    enabled: boolean;
    ticketPrice: bigint;
    drawInterval: bigint;
    jackpotShare: bigint;
    currentRound: bigint;
    lastDraw: bigint;
    totalJackpot: bigint;
}

export function storeLotteryConfig(src: LotteryConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.ticketPrice, 257);
        b_0.storeInt(src.drawInterval, 257);
        b_0.storeInt(src.jackpotShare, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.currentRound, 257);
        b_1.storeInt(src.lastDraw, 257);
        b_1.storeInt(src.totalJackpot, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadLotteryConfig(slice: Slice) {
    const sc_0 = slice;
    const _enabled = sc_0.loadBit();
    const _ticketPrice = sc_0.loadIntBig(257);
    const _drawInterval = sc_0.loadIntBig(257);
    const _jackpotShare = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _currentRound = sc_1.loadIntBig(257);
    const _lastDraw = sc_1.loadIntBig(257);
    const _totalJackpot = sc_1.loadIntBig(257);
    return { $$type: 'LotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare, currentRound: _currentRound, lastDraw: _lastDraw, totalJackpot: _totalJackpot };
}

export function loadTupleLotteryConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _ticketPrice = source.readBigNumber();
    const _drawInterval = source.readBigNumber();
    const _jackpotShare = source.readBigNumber();
    const _currentRound = source.readBigNumber();
    const _lastDraw = source.readBigNumber();
    const _totalJackpot = source.readBigNumber();
    return { $$type: 'LotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare, currentRound: _currentRound, lastDraw: _lastDraw, totalJackpot: _totalJackpot };
}

export function loadGetterTupleLotteryConfig(source: TupleReader) {
    const _enabled = source.readBoolean();
    const _ticketPrice = source.readBigNumber();
    const _drawInterval = source.readBigNumber();
    const _jackpotShare = source.readBigNumber();
    const _currentRound = source.readBigNumber();
    const _lastDraw = source.readBigNumber();
    const _totalJackpot = source.readBigNumber();
    return { $$type: 'LotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare, currentRound: _currentRound, lastDraw: _lastDraw, totalJackpot: _totalJackpot };
}

export function storeTupleLotteryConfig(source: LotteryConfig) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.drawInterval);
    builder.writeNumber(source.jackpotShare);
    builder.writeNumber(source.currentRound);
    builder.writeNumber(source.lastDraw);
    builder.writeNumber(source.totalJackpot);
    return builder.build();
}

export function dictValueParserLotteryConfig(): DictionaryValue<LotteryConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLotteryConfig(src)).endCell());
        },
        parse: (src) => {
            return loadLotteryConfig(src.loadRef().beginParse());
        }
    }
}

export type LotteryTicket = {
    $$type: 'LotteryTicket';
    round: bigint;
    owner: Address;
}

export function storeLotteryTicket(src: LotteryTicket) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.round, 257);
        b_0.storeAddress(src.owner);
    };
}

export function loadLotteryTicket(slice: Slice) {
    const sc_0 = slice;
    const _round = sc_0.loadIntBig(257);
    const _owner = sc_0.loadAddress();
    return { $$type: 'LotteryTicket' as const, round: _round, owner: _owner };
}

export function loadTupleLotteryTicket(source: TupleReader) {
    const _round = source.readBigNumber();
    const _owner = source.readAddress();
    return { $$type: 'LotteryTicket' as const, round: _round, owner: _owner };
}

export function loadGetterTupleLotteryTicket(source: TupleReader) {
    const _round = source.readBigNumber();
    const _owner = source.readAddress();
    return { $$type: 'LotteryTicket' as const, round: _round, owner: _owner };
}

export function storeTupleLotteryTicket(source: LotteryTicket) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.round);
    builder.writeAddress(source.owner);
    return builder.build();
}

export function dictValueParserLotteryTicket(): DictionaryValue<LotteryTicket> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLotteryTicket(src)).endCell());
        },
        parse: (src) => {
            return loadLotteryTicket(src.loadRef().beginParse());
        }
    }
}

export type QuasarMaster$Data = {
    $$type: 'QuasarMaster$Data';
    totalSupply: bigint;
    mintable: boolean;
    owner: Address;
    content: Cell;
    walletCode: Cell;
    feeBps: bigint;
    feeBurnShare: bigint;
    treasury: Address;
    totalBurned: bigint;
    totalFeesCollected: bigint;
    maxTxBps: bigint;
    maxWalletBps: bigint;
    cooldownSeconds: bigint;
    tradingEnabled: boolean;
    buybackEnabled: boolean;
    buybackPool: bigint;
    buybackThreshold: bigint;
    buybackCooldown: bigint;
    buybackBurnPercent: bigint;
    lastBuybackTime: bigint;
    totalBuybacks: bigint;
    totalQsrBurnedViaBuyback: bigint;
    totalTonSpentOnBuyback: bigint;
    aiOracle: Address;
    aiEnabled: boolean;
    aiFullAutonomy: boolean;
    lastRebalanceTime: bigint;
    signalCount: bigint;
    priceHistory: Dictionary<bigint, bigint>;
    anomalyLog: Dictionary<bigint, AIRecommendation>;
    anomalyIndex: bigint;
    minConfidence: bigint;
    emergencyPause: boolean;
    aiActionCooldown: bigint;
    lastAiActionTime: bigint;
    heartbeatTimeout: bigint;
    lastHeartbeat: bigint;
    ownerOverrideWindow: bigint;
    vetoThresholdBps: bigint;
    aiActionLog: Dictionary<bigint, AIActionLog>;
    aiActionIndex: bigint;
    pendingAiActions: Dictionary<bigint, bigint>;
    vetoLog: Dictionary<bigint, VetoState>;
    totalVetoStake: bigint;
    stakingEnabled: boolean;
    stakingApyBps: bigint;
    stakingMinStake: bigint;
    stakingLockPeriod: bigint;
    stakers: Dictionary<Address, StakeInfo>;
    totalStaked: bigint;
    stakingRewardsPool: bigint;
    referralEnabled: boolean;
    referralRewardBps: bigint;
    referrals: Dictionary<Address, ReferralInfo>;
    vestingEnabled: boolean;
    teamAllocation: bigint;
    teamClaimed: bigint;
    vestingSchedules: Dictionary<Address, VestingInfo>;
    lotteryEnabled: boolean;
    lotteryTicketPrice: bigint;
    lotteryDrawInterval: bigint;
    lotteryJackpotShare: bigint;
    lotteryRound: bigint;
    lotteryLastDraw: bigint;
    lotteryJackpot: bigint;
    lotteryTickets: Dictionary<bigint, Address>;
    lotteryTicketCount: bigint;
    lotteryWinners: Dictionary<bigint, Address>;
    defiAddress: Address;
    defiFeeShareBps: bigint;
}

export function storeQuasarMaster$Data(src: QuasarMaster$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeCoins(src.totalSupply);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.walletCode);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeUint(src.feeBurnShare, 8);
        b_0.storeAddress(src.treasury);
        b_0.storeCoins(src.totalBurned);
        b_0.storeCoins(src.totalFeesCollected);
        b_0.storeUint(src.maxTxBps, 16);
        b_0.storeUint(src.maxWalletBps, 16);
        b_0.storeUint(src.cooldownSeconds, 16);
        b_0.storeBit(src.tradingEnabled);
        b_0.storeBit(src.buybackEnabled);
        const b_1 = new Builder();
        b_1.storeCoins(src.buybackPool);
        b_1.storeCoins(src.buybackThreshold);
        b_1.storeUint(src.buybackCooldown, 32);
        b_1.storeUint(src.buybackBurnPercent, 8);
        b_1.storeInt(src.lastBuybackTime, 257);
        b_1.storeInt(src.totalBuybacks, 257);
        b_1.storeCoins(src.totalQsrBurnedViaBuyback);
        const b_2 = new Builder();
        b_2.storeCoins(src.totalTonSpentOnBuyback);
        b_2.storeAddress(src.aiOracle);
        b_2.storeBit(src.aiEnabled);
        b_2.storeBit(src.aiFullAutonomy);
        b_2.storeInt(src.lastRebalanceTime, 257);
        b_2.storeInt(src.signalCount, 257);
        b_2.storeDict(src.priceHistory, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_2.storeDict(src.anomalyLog, Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation());
        const b_3 = new Builder();
        b_3.storeInt(src.anomalyIndex, 257);
        b_3.storeUint(src.minConfidence, 8);
        b_3.storeBit(src.emergencyPause);
        b_3.storeUint(src.aiActionCooldown, 32);
        b_3.storeInt(src.lastAiActionTime, 257);
        b_3.storeUint(src.heartbeatTimeout, 32);
        b_3.storeInt(src.lastHeartbeat, 257);
        b_3.storeUint(src.ownerOverrideWindow, 32);
        b_3.storeUint(src.vetoThresholdBps, 16);
        b_3.storeDict(src.aiActionLog, Dictionary.Keys.BigInt(257), dictValueParserAIActionLog());
        const b_4 = new Builder();
        b_4.storeInt(src.aiActionIndex, 257);
        b_4.storeDict(src.pendingAiActions, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_4.storeDict(src.vetoLog, Dictionary.Keys.BigInt(257), dictValueParserVetoState());
        b_4.storeCoins(src.totalVetoStake);
        b_4.storeBit(src.stakingEnabled);
        b_4.storeUint(src.stakingApyBps, 16);
        b_4.storeCoins(src.stakingMinStake);
        b_4.storeUint(src.stakingLockPeriod, 32);
        b_4.storeDict(src.stakers, Dictionary.Keys.Address(), dictValueParserStakeInfo());
        b_4.storeCoins(src.totalStaked);
        b_4.storeCoins(src.stakingRewardsPool);
        b_4.storeBit(src.referralEnabled);
        b_4.storeUint(src.referralRewardBps, 16);
        const b_5 = new Builder();
        b_5.storeDict(src.referrals, Dictionary.Keys.Address(), dictValueParserReferralInfo());
        b_5.storeBit(src.vestingEnabled);
        b_5.storeCoins(src.teamAllocation);
        b_5.storeCoins(src.teamClaimed);
        b_5.storeDict(src.vestingSchedules, Dictionary.Keys.Address(), dictValueParserVestingInfo());
        b_5.storeBit(src.lotteryEnabled);
        b_5.storeCoins(src.lotteryTicketPrice);
        b_5.storeUint(src.lotteryDrawInterval, 32);
        b_5.storeUint(src.lotteryJackpotShare, 8);
        b_5.storeInt(src.lotteryRound, 257);
        b_5.storeInt(src.lotteryLastDraw, 257);
        const b_6 = new Builder();
        b_6.storeCoins(src.lotteryJackpot);
        b_6.storeDict(src.lotteryTickets, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_6.storeInt(src.lotteryTicketCount, 257);
        b_6.storeDict(src.lotteryWinners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_6.storeAddress(src.defiAddress);
        b_6.storeUint(src.defiFeeShareBps, 16);
        b_5.storeRef(b_6.endCell());
        b_4.storeRef(b_5.endCell());
        b_3.storeRef(b_4.endCell());
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadQuasarMaster$Data(slice: Slice) {
    const sc_0 = slice;
    const _totalSupply = sc_0.loadCoins();
    const _mintable = sc_0.loadBit();
    const _owner = sc_0.loadAddress();
    const _content = sc_0.loadRef();
    const _walletCode = sc_0.loadRef();
    const _feeBps = sc_0.loadUintBig(16);
    const _feeBurnShare = sc_0.loadUintBig(8);
    const _treasury = sc_0.loadAddress();
    const _totalBurned = sc_0.loadCoins();
    const _totalFeesCollected = sc_0.loadCoins();
    const _maxTxBps = sc_0.loadUintBig(16);
    const _maxWalletBps = sc_0.loadUintBig(16);
    const _cooldownSeconds = sc_0.loadUintBig(16);
    const _tradingEnabled = sc_0.loadBit();
    const _buybackEnabled = sc_0.loadBit();
    const sc_1 = sc_0.loadRef().beginParse();
    const _buybackPool = sc_1.loadCoins();
    const _buybackThreshold = sc_1.loadCoins();
    const _buybackCooldown = sc_1.loadUintBig(32);
    const _buybackBurnPercent = sc_1.loadUintBig(8);
    const _lastBuybackTime = sc_1.loadIntBig(257);
    const _totalBuybacks = sc_1.loadIntBig(257);
    const _totalQsrBurnedViaBuyback = sc_1.loadCoins();
    const sc_2 = sc_1.loadRef().beginParse();
    const _totalTonSpentOnBuyback = sc_2.loadCoins();
    const _aiOracle = sc_2.loadAddress();
    const _aiEnabled = sc_2.loadBit();
    const _aiFullAutonomy = sc_2.loadBit();
    const _lastRebalanceTime = sc_2.loadIntBig(257);
    const _signalCount = sc_2.loadIntBig(257);
    const _priceHistory = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_2);
    const _anomalyLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), sc_2);
    const sc_3 = sc_2.loadRef().beginParse();
    const _anomalyIndex = sc_3.loadIntBig(257);
    const _minConfidence = sc_3.loadUintBig(8);
    const _emergencyPause = sc_3.loadBit();
    const _aiActionCooldown = sc_3.loadUintBig(32);
    const _lastAiActionTime = sc_3.loadIntBig(257);
    const _heartbeatTimeout = sc_3.loadUintBig(32);
    const _lastHeartbeat = sc_3.loadIntBig(257);
    const _ownerOverrideWindow = sc_3.loadUintBig(32);
    const _vetoThresholdBps = sc_3.loadUintBig(16);
    const _aiActionLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), sc_3);
    const sc_4 = sc_3.loadRef().beginParse();
    const _aiActionIndex = sc_4.loadIntBig(257);
    const _pendingAiActions = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_4);
    const _vetoLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), sc_4);
    const _totalVetoStake = sc_4.loadCoins();
    const _stakingEnabled = sc_4.loadBit();
    const _stakingApyBps = sc_4.loadUintBig(16);
    const _stakingMinStake = sc_4.loadCoins();
    const _stakingLockPeriod = sc_4.loadUintBig(32);
    const _stakers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserStakeInfo(), sc_4);
    const _totalStaked = sc_4.loadCoins();
    const _stakingRewardsPool = sc_4.loadCoins();
    const _referralEnabled = sc_4.loadBit();
    const _referralRewardBps = sc_4.loadUintBig(16);
    const sc_5 = sc_4.loadRef().beginParse();
    const _referrals = Dictionary.load(Dictionary.Keys.Address(), dictValueParserReferralInfo(), sc_5);
    const _vestingEnabled = sc_5.loadBit();
    const _teamAllocation = sc_5.loadCoins();
    const _teamClaimed = sc_5.loadCoins();
    const _vestingSchedules = Dictionary.load(Dictionary.Keys.Address(), dictValueParserVestingInfo(), sc_5);
    const _lotteryEnabled = sc_5.loadBit();
    const _lotteryTicketPrice = sc_5.loadCoins();
    const _lotteryDrawInterval = sc_5.loadUintBig(32);
    const _lotteryJackpotShare = sc_5.loadUintBig(8);
    const _lotteryRound = sc_5.loadIntBig(257);
    const _lotteryLastDraw = sc_5.loadIntBig(257);
    const sc_6 = sc_5.loadRef().beginParse();
    const _lotteryJackpot = sc_6.loadCoins();
    const _lotteryTickets = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_6);
    const _lotteryTicketCount = sc_6.loadIntBig(257);
    const _lotteryWinners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_6);
    const _defiAddress = sc_6.loadAddress();
    const _defiFeeShareBps = sc_6.loadUintBig(16);
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _owner = source.readAddress();
    const _content = source.readCell();
    const _walletCode = source.readCell();
    const _feeBps = source.readBigNumber();
    const _feeBurnShare = source.readBigNumber();
    const _treasury = source.readAddress();
    const _totalBurned = source.readBigNumber();
    const _totalFeesCollected = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldownSeconds = source.readBigNumber();
    const _tradingEnabled = source.readBoolean();
    source = source.readTuple();
    const _buybackEnabled = source.readBoolean();
    const _buybackPool = source.readBigNumber();
    const _buybackThreshold = source.readBigNumber();
    const _buybackCooldown = source.readBigNumber();
    const _buybackBurnPercent = source.readBigNumber();
    const _lastBuybackTime = source.readBigNumber();
    const _totalBuybacks = source.readBigNumber();
    const _totalQsrBurnedViaBuyback = source.readBigNumber();
    const _totalTonSpentOnBuyback = source.readBigNumber();
    const _aiOracle = source.readAddress();
    const _aiEnabled = source.readBoolean();
    const _aiFullAutonomy = source.readBoolean();
    const _lastRebalanceTime = source.readBigNumber();
    const _signalCount = source.readBigNumber();
    source = source.readTuple();
    const _priceHistory = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _anomalyLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), source.readCellOpt());
    const _anomalyIndex = source.readBigNumber();
    const _minConfidence = source.readBigNumber();
    const _emergencyPause = source.readBoolean();
    const _aiActionCooldown = source.readBigNumber();
    const _lastAiActionTime = source.readBigNumber();
    const _heartbeatTimeout = source.readBigNumber();
    const _lastHeartbeat = source.readBigNumber();
    const _ownerOverrideWindow = source.readBigNumber();
    const _vetoThresholdBps = source.readBigNumber();
    const _aiActionLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), source.readCellOpt());
    const _aiActionIndex = source.readBigNumber();
    const _pendingAiActions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    source = source.readTuple();
    const _vetoLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), source.readCellOpt());
    const _totalVetoStake = source.readBigNumber();
    const _stakingEnabled = source.readBoolean();
    const _stakingApyBps = source.readBigNumber();
    const _stakingMinStake = source.readBigNumber();
    const _stakingLockPeriod = source.readBigNumber();
    const _stakers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserStakeInfo(), source.readCellOpt());
    const _totalStaked = source.readBigNumber();
    const _stakingRewardsPool = source.readBigNumber();
    const _referralEnabled = source.readBoolean();
    const _referralRewardBps = source.readBigNumber();
    const _referrals = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferralInfo(), source.readCellOpt());
    const _vestingEnabled = source.readBoolean();
    const _teamAllocation = source.readBigNumber();
    source = source.readTuple();
    const _teamClaimed = source.readBigNumber();
    const _vestingSchedules = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserVestingInfo(), source.readCellOpt());
    const _lotteryEnabled = source.readBoolean();
    const _lotteryTicketPrice = source.readBigNumber();
    const _lotteryDrawInterval = source.readBigNumber();
    const _lotteryJackpotShare = source.readBigNumber();
    const _lotteryRound = source.readBigNumber();
    const _lotteryLastDraw = source.readBigNumber();
    const _lotteryJackpot = source.readBigNumber();
    const _lotteryTickets = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _lotteryTicketCount = source.readBigNumber();
    const _lotteryWinners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _defiAddress = source.readAddress();
    const _defiFeeShareBps = source.readBigNumber();
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadGetterTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _owner = source.readAddress();
    const _content = source.readCell();
    const _walletCode = source.readCell();
    const _feeBps = source.readBigNumber();
    const _feeBurnShare = source.readBigNumber();
    const _treasury = source.readAddress();
    const _totalBurned = source.readBigNumber();
    const _totalFeesCollected = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldownSeconds = source.readBigNumber();
    const _tradingEnabled = source.readBoolean();
    const _buybackEnabled = source.readBoolean();
    const _buybackPool = source.readBigNumber();
    const _buybackThreshold = source.readBigNumber();
    const _buybackCooldown = source.readBigNumber();
    const _buybackBurnPercent = source.readBigNumber();
    const _lastBuybackTime = source.readBigNumber();
    const _totalBuybacks = source.readBigNumber();
    const _totalQsrBurnedViaBuyback = source.readBigNumber();
    const _totalTonSpentOnBuyback = source.readBigNumber();
    const _aiOracle = source.readAddress();
    const _aiEnabled = source.readBoolean();
    const _aiFullAutonomy = source.readBoolean();
    const _lastRebalanceTime = source.readBigNumber();
    const _signalCount = source.readBigNumber();
    const _priceHistory = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _anomalyLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), source.readCellOpt());
    const _anomalyIndex = source.readBigNumber();
    const _minConfidence = source.readBigNumber();
    const _emergencyPause = source.readBoolean();
    const _aiActionCooldown = source.readBigNumber();
    const _lastAiActionTime = source.readBigNumber();
    const _heartbeatTimeout = source.readBigNumber();
    const _lastHeartbeat = source.readBigNumber();
    const _ownerOverrideWindow = source.readBigNumber();
    const _vetoThresholdBps = source.readBigNumber();
    const _aiActionLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), source.readCellOpt());
    const _aiActionIndex = source.readBigNumber();
    const _pendingAiActions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _vetoLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), source.readCellOpt());
    const _totalVetoStake = source.readBigNumber();
    const _stakingEnabled = source.readBoolean();
    const _stakingApyBps = source.readBigNumber();
    const _stakingMinStake = source.readBigNumber();
    const _stakingLockPeriod = source.readBigNumber();
    const _stakers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserStakeInfo(), source.readCellOpt());
    const _totalStaked = source.readBigNumber();
    const _stakingRewardsPool = source.readBigNumber();
    const _referralEnabled = source.readBoolean();
    const _referralRewardBps = source.readBigNumber();
    const _referrals = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferralInfo(), source.readCellOpt());
    const _vestingEnabled = source.readBoolean();
    const _teamAllocation = source.readBigNumber();
    const _teamClaimed = source.readBigNumber();
    const _vestingSchedules = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserVestingInfo(), source.readCellOpt());
    const _lotteryEnabled = source.readBoolean();
    const _lotteryTicketPrice = source.readBigNumber();
    const _lotteryDrawInterval = source.readBigNumber();
    const _lotteryJackpotShare = source.readBigNumber();
    const _lotteryRound = source.readBigNumber();
    const _lotteryLastDraw = source.readBigNumber();
    const _lotteryJackpot = source.readBigNumber();
    const _lotteryTickets = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _lotteryTicketCount = source.readBigNumber();
    const _lotteryWinners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _defiAddress = source.readAddress();
    const _defiFeeShareBps = source.readBigNumber();
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function storeTupleQuasarMaster$Data(source: QuasarMaster$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeCell(source.walletCode);
    builder.writeNumber(source.feeBps);
    builder.writeNumber(source.feeBurnShare);
    builder.writeAddress(source.treasury);
    builder.writeNumber(source.totalBurned);
    builder.writeNumber(source.totalFeesCollected);
    builder.writeNumber(source.maxTxBps);
    builder.writeNumber(source.maxWalletBps);
    builder.writeNumber(source.cooldownSeconds);
    builder.writeBoolean(source.tradingEnabled);
    builder.writeBoolean(source.buybackEnabled);
    builder.writeNumber(source.buybackPool);
    builder.writeNumber(source.buybackThreshold);
    builder.writeNumber(source.buybackCooldown);
    builder.writeNumber(source.buybackBurnPercent);
    builder.writeNumber(source.lastBuybackTime);
    builder.writeNumber(source.totalBuybacks);
    builder.writeNumber(source.totalQsrBurnedViaBuyback);
    builder.writeNumber(source.totalTonSpentOnBuyback);
    builder.writeAddress(source.aiOracle);
    builder.writeBoolean(source.aiEnabled);
    builder.writeBoolean(source.aiFullAutonomy);
    builder.writeNumber(source.lastRebalanceTime);
    builder.writeNumber(source.signalCount);
    builder.writeCell(source.priceHistory.size > 0 ? beginCell().storeDictDirect(source.priceHistory, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.anomalyLog.size > 0 ? beginCell().storeDictDirect(source.anomalyLog, Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation()).endCell() : null);
    builder.writeNumber(source.anomalyIndex);
    builder.writeNumber(source.minConfidence);
    builder.writeBoolean(source.emergencyPause);
    builder.writeNumber(source.aiActionCooldown);
    builder.writeNumber(source.lastAiActionTime);
    builder.writeNumber(source.heartbeatTimeout);
    builder.writeNumber(source.lastHeartbeat);
    builder.writeNumber(source.ownerOverrideWindow);
    builder.writeNumber(source.vetoThresholdBps);
    builder.writeCell(source.aiActionLog.size > 0 ? beginCell().storeDictDirect(source.aiActionLog, Dictionary.Keys.BigInt(257), dictValueParserAIActionLog()).endCell() : null);
    builder.writeNumber(source.aiActionIndex);
    builder.writeCell(source.pendingAiActions.size > 0 ? beginCell().storeDictDirect(source.pendingAiActions, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.vetoLog.size > 0 ? beginCell().storeDictDirect(source.vetoLog, Dictionary.Keys.BigInt(257), dictValueParserVetoState()).endCell() : null);
    builder.writeNumber(source.totalVetoStake);
    builder.writeBoolean(source.stakingEnabled);
    builder.writeNumber(source.stakingApyBps);
    builder.writeNumber(source.stakingMinStake);
    builder.writeNumber(source.stakingLockPeriod);
    builder.writeCell(source.stakers.size > 0 ? beginCell().storeDictDirect(source.stakers, Dictionary.Keys.Address(), dictValueParserStakeInfo()).endCell() : null);
    builder.writeNumber(source.totalStaked);
    builder.writeNumber(source.stakingRewardsPool);
    builder.writeBoolean(source.referralEnabled);
    builder.writeNumber(source.referralRewardBps);
    builder.writeCell(source.referrals.size > 0 ? beginCell().storeDictDirect(source.referrals, Dictionary.Keys.Address(), dictValueParserReferralInfo()).endCell() : null);
    builder.writeBoolean(source.vestingEnabled);
    builder.writeNumber(source.teamAllocation);
    builder.writeNumber(source.teamClaimed);
    builder.writeCell(source.vestingSchedules.size > 0 ? beginCell().storeDictDirect(source.vestingSchedules, Dictionary.Keys.Address(), dictValueParserVestingInfo()).endCell() : null);
    builder.writeBoolean(source.lotteryEnabled);
    builder.writeNumber(source.lotteryTicketPrice);
    builder.writeNumber(source.lotteryDrawInterval);
    builder.writeNumber(source.lotteryJackpotShare);
    builder.writeNumber(source.lotteryRound);
    builder.writeNumber(source.lotteryLastDraw);
    builder.writeNumber(source.lotteryJackpot);
    builder.writeCell(source.lotteryTickets.size > 0 ? beginCell().storeDictDirect(source.lotteryTickets, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    builder.writeNumber(source.lotteryTicketCount);
    builder.writeCell(source.lotteryWinners.size > 0 ? beginCell().storeDictDirect(source.lotteryWinners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address()).endCell() : null);
    builder.writeAddress(source.defiAddress);
    builder.writeNumber(source.defiFeeShareBps);
    return builder.build();
}

export function dictValueParserQuasarMaster$Data(): DictionaryValue<QuasarMaster$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeQuasarMaster$Data(src)).endCell());
        },
        parse: (src) => {
            return loadQuasarMaster$Data(src.loadRef().beginParse());
        }
    }
}

export type QuasarWallet$Data = {
    $$type: 'QuasarWallet$Data';
    balance: bigint;
    owner: Address;
    master: Address;
    lastTxTime: bigint;
}

export function storeQuasarWallet$Data(src: QuasarWallet$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeInt(src.lastTxTime, 257);
    };
}

export function loadQuasarWallet$Data(slice: Slice) {
    const sc_0 = slice;
    const _balance = sc_0.loadCoins();
    const _owner = sc_0.loadAddress();
    const _master = sc_0.loadAddress();
    const _lastTxTime = sc_0.loadIntBig(257);
    return { $$type: 'QuasarWallet$Data' as const, balance: _balance, owner: _owner, master: _master, lastTxTime: _lastTxTime };
}

export function loadTupleQuasarWallet$Data(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _master = source.readAddress();
    const _lastTxTime = source.readBigNumber();
    return { $$type: 'QuasarWallet$Data' as const, balance: _balance, owner: _owner, master: _master, lastTxTime: _lastTxTime };
}

export function loadGetterTupleQuasarWallet$Data(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _owner = source.readAddress();
    const _master = source.readAddress();
    const _lastTxTime = source.readBigNumber();
    return { $$type: 'QuasarWallet$Data' as const, balance: _balance, owner: _owner, master: _master, lastTxTime: _lastTxTime };
}

export function storeTupleQuasarWallet$Data(source: QuasarWallet$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeNumber(source.lastTxTime);
    return builder.build();
}

export function dictValueParserQuasarWallet$Data(): DictionaryValue<QuasarWallet$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeQuasarWallet$Data(src)).endCell());
        },
        parse: (src) => {
            return loadQuasarWallet$Data(src.loadRef().beginParse());
        }
    }
}

 type QuasarMaster_init_args = {
    $$type: 'QuasarMaster_init_args';
    owner: Address;
    content: Cell;
    walletCode: Cell;
}

function initQuasarMaster_init_args(src: QuasarMaster_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.walletCode);
    };
}

async function QuasarMaster_init(owner: Address, content: Cell, walletCode: Cell) {
    const __code = Cell.fromHex('b5ee9c72420201c400010000b0cb0000022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d9000100600202710002002b020120000300150201200004000e0201200005000a03fbb2d93b513434800063a2fe903535154800f45636cf38c34451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044dc44d844dc44d844d444d844d6000610065000601fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120000702f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c6100080009009481010156200259f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e2002c206e92306d99206ef2d0806f296f09e2206e92306dde03fbb3f5fb513434800063a2fe903535154800f45636cf38c34451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044dc44d844dc44d844d444d844d6000610065000b01fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120000c01f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c61000d002e81010120562c50334133f40c6fa19401d70030925b6de202016a000f00110346a964ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6ce76ce76ce76ce76ce7006100650010000e547ba9547ba92b03faa90aed44d0d200018e8bfa40d4d4552003d158db3ce30d114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113500610065001201fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120001302f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c6100140046007c81010b2e0259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e2020120001600200201480017001c0201200018001a0356abeded44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6c61006100650019000456380352ab06ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6c996c996c996c996c996c996c996c7900610065001b0024562c5625562556255625562556255621562503fbaf4e76a268690000c745fd206a6a2a9001e8ac6d9e718688a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089b889b089b889b089a889b089ac000610065001d01fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120001e01f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c61001f001c810101240259f40c6fa192306ddf02012000210029020120002200240353ad75f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e3644364436443644364436443644367440006100650023002a80645640a1564101564101563e563e563e5643564303fbadc176a268690000c745fd206a6a2a9001e8ac6d9e718688a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089b889b089b889b089a889b089ac000610065002501fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120002602f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c6100270028005481010b56120259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2002c206e92306d99206ef2d0806f236f03e2206e92306dde0357b0debb513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db186000610065002a00045625020120002c0039020120002d0037020158002e0035020166002f00310355a30fb513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db18600610065003000022003f9a1e7b513434800063a2fe903535154800f45636cf38c34451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044dc44d844dc44d844d444d844d600610065003201fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120003301f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c6100340162f828db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d000e70347af16f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab652c00061006500360014564556455645564556450357b6e29da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed8c300061006500380104db3c01b4020120003a0047020120003b003f03fbb206fb513434800063a2fe903535154800f45636cf38c34451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044dc44d844dc44d844d444d844d6000610065003c01fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120003d01f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c61003e0104db3c017f020120004000420353afdcf6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e364cb64cb64cb64cb64cb64cb64cb63cc0006100650041002456375637563756375637563756375637563703fbaebc76a268690000c745fd206a6a2a9001e8ac6d9e718688a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089b889b089b889b089a889b089ac000610065004301fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120004402f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c61004500460078810101561d0259f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e2002c206e92306d99206ef2d0806f256f05e2206e92306dde0201200048004f0201200049004b0357aff376a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e2b882f87ab882f87ab882f87ab882f87b630c000610065004a00022103fbac67f6a268690000c745fd206a6a2a9001e8ac6d9e718688a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089b889b089b889b089a889b089ac000610065004c01fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120004d02f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c61004e005d005c810101562a0259f40d6fa192306ddf206e92306d8e17d0810101d700d401d001810101d700d20055306c146f04e20201200050005e02016600510059034da3cbb513434800063a2fe903535154800f45636cf38c376cf1b2a9b2a9b2a9b2a9b2a9b2a9b2aa00610065005201f0562e562e562e562e562e56455630562e56291145114e11451144114d11441143114c11431142114b11421141114a1141114011491140113f1148113f113e1147113e113d1146113d113c114e113c113b114d113b113a114c113a1139114b11391138114a1138113711491137113611481136113511471135005301fc1134114611341133114e11331132114d11321131114c11311130114b1130112f114a112f112e1149112e112d1148112d112c1147112c112b1146112b112a114e112a1129114d11291128114c11281127114b11271126114a11261125114911251124114811241123114711231122114611221121114e11211120114d1120005401f8111f114c111f111e114b111e111d114a111d111c1149111c111b1148111b111a1147111a1119114611191118114e11181117114d11171116114c11161115114b11151114114a11141113114911131112114811121111114711111110114611100f114e0f0e114d0e0d114c0d0c114b0c0b114a0b0a11490a09114809005502fc081147080711460706114e0605114d0504114c0403114b0302114a02011149011148db3c091148090811470807114f0706114e0605114d0504114c0403114b0302114a02011149011146114f11461145114e11451144114d11441143114c11431142114b11421141114a1141114011491140113f1148113f113e1147113e01b4005601fc113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f112e1137112e112d1136112d112c1135112c112b1134112b112a1133112a112911321129005701fc1128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a1119112211191118112111181117112011171116111f11161115111e11151114111d1114005800601113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a03f9a10fb513434800063a2fe903535154800f45636cf38c34451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044dc44d844dc44d844d444d844d600610065005a01fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120005b02f4111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6c61005c005d006e81010b56170259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2002c206e92306d99206ef2d0806f246f04e2206e92306dde0347adbff6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab652c000610065005f00145619561956195619561804dceda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e8bfa40d4d4552003d158db3ce30d11479a5f0f5f0f5f0f5f0f5f0be05645d749c21fe3001145f9012082f07f309c3a7adc967de7844945367788045b18adf5557c5bf60508ec7c231da6deba00610065006a01aa02f06d6d6d6d6d6d6d6d6d6d707f2e801e803256115355806481012c800f7f7f258212540be400810e1054772253007070547222804b70815460238208093a80f823820151808103e853447f8107d08218174876e8008208278d0053447f561a7f53337f82103b9aca005610562d71f8235366891137114411370188006201fc1136114311361135114211351136114111361135114011351134113f11341133113e11331132113d11321131113c11311130113b1130112f113a112f112e1139112e112d1138112d112c1137112c112b1136112b112a1135112a1129113411291128113311281127113211271126113111261125113011251124112f1124006301fc1123112e1123112c112d112c1122112c11221121112b11211120112a1120111f1129111f112111281121112011271120111e1126111e111d1125111d111c1124111c111b1123111b111a1122111a1119112111191118112011181117111f11171116111e11161117111d11171115111c11151119111b11191118111a1118006400a01114111911141113111811131112111711121111111611111110111511101111111411110f11130f0e11120e0d11110d0c11100c10ef10be10ad109c109b108a107910681057104610354140138101f402f8db3c5746114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a11391138113911381137113811371136113711361135113611351134113511341133113411331132113311321131113211310066006801f6fa00d200fa40d4d401d0d4d30fd307fa40fa00fa00d30fd30fd30fd200d200fa00fa00d31fd307d430d0810101d700810101d700fa00fa00d430d0fa40d200d200810101d700810101d700f404f404d430d0810101d700d307d200d31f810101d700d31f810101d700d31fd30ff404d430d0810101d700f404f404006700bcfa00d200d30ffa00d31ff404fa00fa00d200d30fd430d0f404d200fa00fa00f404d200fa00d31fd307810101d700810101d700d430d0fa00f404810101d700f404fa40d30f3011421146114211421145114211421144114211421143114201fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c0069009c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e04541145d31f218210fc708bd2bae302218210db17f0cabae302218210eb527edfbae302218210cfe1fd3cba006b00710077009204fe31810101d700fa4030011146011147db3c8142a65647c200f2f481540c8d0860000000000000000000000000000000000000000000000000000000000000000004564901c705b3f2f4db3cdb3c8134a65645f2f45645563ca8812710a9045646c2009a564782009db402bbf2f49130e211455646a01145705644564902564900c4006c01bf006d00108200dfcc5639f2f402f802db3cf8427011488040114ac85982103345ab925003cb1f810101cf00cec91302114802011149015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114311451143114211441142114111431141114011421140113f1141113f00e6006e01fc113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a006f01fc1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115007001501114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551d01a802fc31d33f31810101d700fa40fa40308142a623c200f2f4f8285220db3c81287bf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4114622a18d086000000000000000000000000000000000000000000000000000000000000000000456470100e7007202fec705b38ec0707080408804114a04146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00925746e2f8427003804003c8598210d28b2faf5003cb1f810101cf00cec943305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e007300740026000000004578636573732072657475726e656401f8016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134007501fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f007601cc111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551c01a802fe31d33ffa00fa40308142a622c200f2f4f8285210db3c812e3cf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4113d21a0215641a88064a9045320a120a70f8064a90421a70f8064a90422a70a8064a90423564ea8812710a9045143a122a100e7007804e221a124a125c2009c114c25a1114425a01144114cde23c20092563e9170e294113d23a09923c2009223a0de113de222c2009256129170e29351c2a09c22c20096113d22a0113dde0ce221c2009256209170e294111a21a09d21c20096113d21a0113dde111ae224c2009170e30de30f56120079007a007d008000548d0860000000000000000000000000000000000000000000000000000000000000000004564e01c705b301fc1145114c11451144114b11441143114a1143114211491142114111481141114011471140113f1146113f113e114c113e113d114b113d06113c06113b1149113b113a1148113a1139114711391138114611381137114c11370c11360c061135061134114911341133114811331132114711321131114611311130114c1130007b01f40c112f0c06112e06112d1149112d112c1148112c112b1147112b112a1146112a1129114c11290c11280c061127061126114911261125114811251124114711241123114611231122114c11220c11210c06112006111f1149111f111e1148111e111d1147111d111c1146111c111b114c111b0c111a0c06111906007c01e21118114911181117114811171116114711161115114611151114114c11141113061112061111114911111110114811100f11470f0e11460e0d114c0d0c106b0a11490a09114809081147080711460706114c060504114c040311490302114802564d0201114f01114e564d5649564ddb3c00e601fa24c20096113d24a0113dde05114e0501114d0104114c04113d114b113d1143114a11430311490302114802081147080711460704114504113d1144113d03114203021141020811400807113f0704113e0406113c0603113b0302113a020811390807113807041137040c11360c06113506031134030211330208113208007e01fc07113107041130040c112f0c06112e0603112d0302112c0208112b0807112a07041129040c11280c0611270603112603021125020811240807112307041122040c11210c0611200603111f0302111e0208111d0807111c0704111b040c111a0c061119060311180302111702081116080711150704111404111306111206007f00300311110302111002108f107e104d0c106b103a102910460504da8ecc561081010b564c59f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e9956475613a8812710a90420c20094564d21be9170e2915be30d9130e2de564bc2009170e30d8e8a563e564c5649564ddb3cde2b9456462bbe9170e20081008400e6008502fc114d564da101206ef2d0806f235b561281010b2259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e36206ef2d0806f2381010b025651a04300c855205023ce810101cf00810101cf00c902111402561401206e953059f45930944133f413e2e30e111201114d5649564d0082008300a23081010b8d0860000000000000000000000000000000000000000000000000000000000000000004564f70c855205023ce810101cf00810101cf00c902111402561401206e953059f45930944133f413e20104db3c00e600548d0860000000000000000000000000000000000000000000000000000000000000000004563f01c705b303f68e1a148101015242114c206e953059f45a30944133f414e202a4401392574ae256369556355635be9170e298f8235632a15634be9170e2e3002a96f82326a129be9170e29322c2009170e2925746e30df84270804056475613a8812710a904071148070611500605114b0504114a0403114f030201114d01114ec80086008a008e01fc114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130008701fc112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b008802fc111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e11495646db3c1149114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f015900890080112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e001fc114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130008b01fc112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b008c02fc111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551d01114901db3c114801114501114401114301114201114101114001113f01113e01113d01113c01113b01113a01113901113800e2008d00f401113701113601113501113401113301113201113101113001112f01112e01112d01112c01112b01112a01112901112801112701112601112501112401112301112201112101112001111f01111e01111d01111c01111b01111a01111901111801111701111601111501111401111301111201111101111055d101fe55708210c47b97305009cb1f17810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc90311480302114702011146015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400008f01f8c901fb00113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f112e1137112e112d1136112d112c1135112c112b1134112b112a1133112a112911321129009001fc1128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a1119112211191118112111181117112011171116111f11161115111e11151114111d11140091019c1113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a091112090811110807111007106f105e104d103c4ba9105810475e235a1401a802fe8efd31d33f3081632e5637f2f4817c2a56365636bef2f48200da29f8235633a15635bef2f4114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a11381137113911371136113811360093009601fc113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121009401fc112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106800950216105710461035443012db3c015901a8044ee0218210bef0e904bae302218210ff633be1bae302218210094a1f7cbae30221821013bd6b32ba009700a300b000b901f831fa0030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131009801fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c009902fc111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c8200aac7561af2f48142a65647c200f2f481662c00c4009a01f856475619bef2f4f842561681010b2259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e270f823561aa0226eb38e165b20206ef2d0806f245f0301206ef2d0806f246c31019132e2114511481145114411471144114311461143114211481142009b01fc114111471141114011461140113f1148113f113e1147113e113d1146113d113c1148113c113b1147113b113a1146113a113911481139113811471138113711461137113611481136113511471135113411461134113311481133113211471132113111461131113011481130112f1147112f112e1146112e112d1148112d009c01fc112c1147112c112b1146112b112a1148112a112911471129112811461128112711481127112611471126112511461125112411481124112311471123112211461122112111481121112011471120111f1146111f111e1148111e111d1147111d111c1146111c111b1148111b111a1147111a111911461119111811481118009d02fa1117114711171116114611161115114811151114114711141113114611131112114811121111114711111110114611100f11480f0e11470e0d11460d0c11480c0b11470b0a11460a09114809081147080711460706114806051147050411460403114803021147020111460111485647db3c20c20094561421be9170e200b3009e02fe8e9211145614a170f82802111602564a5520db3c9130e281010b1149564aa0f823f82355021149c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211150201114801564701206e953059f45930944133f413e211125647a0f8427011478040114ac8598210acd731a75003cb1fce810101cf00c91300e6009f01f402114702011149015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c113800a001fc1137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a112611251129112511241128112411231127112300a101fc112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121110111511101113111411130f11130f0e11120e0d11110d00a201380c11100c10bf10ae109d108c107b106a10591048103746145033451501a801f831fa0030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113211311132113100a401fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c00a502f6111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c8142a65647c200f2f4f842561681010b2200c400a601f659f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2816dd3216eb3f2f48152fd21206ef2d0806f245f03564abef2f4816283f82322206ef2d0806f246c31bef2f411451147114511441146114411431147114311421146114211411147114100a701fc114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a113911471139113811461138113711471137113611461136113511471135113411461134113311471133113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c00a801fc112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f111e1146111e111d1147111d111c1146111c111b1147111b111a1146111a11191147111911181146111811171147111700a903fa1116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a09114709081146080711470706114606051147050411460403114703021146020111470111465647db3c20c20094561421be9170e29130e30d564600b300aa00ab012411145614a170f82802111602564a5520db3c00e602fc206ef2d0806f245f035649a120c2008e4b30574681010b6dc8216e925b6d8e2601206ef2d0806f24550355305034810101cf00810101cf00810101cf0001c8810101cf00cdc9e202111602564801206e953059f45930944133f413e2e30d11135647a170f82811461147114611451146114511441145114411431144114300ac00ad00b081010b5648206ef2d0806f2410235f03f823114a206ef2d0806f246c311201114a01c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211160201114701564801206e953059f45930944133f413e201fc114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e00ae01fc112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111900af02fe111811191118111711181117111511171115021116021114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510341023564802564a02db3cf8427011488040114ac85982108445bc055003cb1fce810101cf00c913021148020111490100e6011501f65bf842114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113211311132113100b101fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c00b202fe111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610451034114641305646db3c8200e1b821c200f2f482009c88561522bef2f400b300b400de81010b56170259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206e923070e0f82321206ef2d0806f24135f03a101206ef2d0806f245f03561aa8812710a90401a88209e13380a904205615bc93305613de02fa11145614a1561681010b564959f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206eb39130e30d70f82811481149114811471148114711461147114611451146114511441145114411431144114311421143114211411142114111401141114000b500b600b881010b21206ef2d0806f245f0322206ef2d0806f2410235f03f82304206ef2d0806f246c31413014c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc902111802564901206e953059f45930944133f413e2111601fc113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b00b701f8112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811170211170200b802881115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510341023db3c00e601a802fe8efc31d200d30ffa00d31f30114511471145114411461144114311471143114211461142114111471141114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a113911471139113811461138113711471137113611461136113511471135113411461134113311471133e000ba00c001fc113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f111e1146111e00bb01f8111d1147111d111c1146111c111b1147111b111a1146111a1119114711191118114611181117114711171116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a0911470908114608071147070611460600bc02f405114705041146040311470302114602011148011149db3c571657165716571681646d5629b3f2f48200e1415643812710bb945645c2009170e2945646c2009170e2f2f4114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d113901bf00bd01fc1138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a112611251129112511241128112400be01fc112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161117111911171116111811161116111711161111111511111110111411100f11130f0e11120e0d11110d00bf01140c11100c10bf10ae553901a8044c218210d3b50b23bae3022182101ab0a142bae302218210ea3f3bddbae302218210f789340aba00c100cb00ce00d601f831fa4030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113211311132113100c201fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c00c302fe111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c8200abfb5613f2f481104df842564801c705b3f2f400c400c500128200e8415626b3f2f401de81010bf84256125959f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e281526d016ef2f481010bf8427020564a59c855205023ce810101cf00810101cf00c903111303206e953059f45930944133f413e22081010b564859f40b6fa192306ddf00c601e6206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e4581010b21206ef2d0806f235b22206ef2d0806f23303103206ef2d0806f236c21a44130c855205023ce810101cf00810101cf00c9564801206e953059f45930944133f413e29130e2f842708040f84201114ac800c701f459821028db358b5003cb1fcecec94130011149015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d00c801fc113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112800c901fc112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111511141115111411131114111300ca0128111211131112111111121111111011111110550e01a802f431d200d30f30011146011147db3c5711571181646d562bb3f2f48200ba975646812710bbf2f4114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113601bf00cc01fc113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112311221124112211211123112100cd01d0112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311110e11100e10df551c01a801f831fa40fa00d31fd31f30114511471145114411461144114311471143114211461142114111471141114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a11391147113911381146113811371147113711361146113611351147113511341146113411331147113300cf01fc113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f111e1146111e00d001f8111d1147111d111c1146111c111b1147111b111a1146111a1119114711191118114611181117114711171116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a0911470908114608071147070611460600d102fe05114705041146040311470302114602011148011149db3c8200b0f05647c20094564ac2009170e2955649564bbb9170e2f2f48200a0862d81010b564a59f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e26ef2f481010b70f82301bf00d201f45649413401114c01114dc855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc9103c0211480201114701206e953059f45930944133f413e211431ba0114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a00d301fc1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a112611251129112500d401fc112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a111611151119111511141118111411131117111311121116111211111115111111101114111000d5014c0f11130f0e11120e0d11110d0c11100c10bf0e109d0c107b106a10591048103740160450330501a802fc8efa5bf8422b81010b2259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e2817625216eb3f2f48200cd11f82322206ef2d0806f2510245f0423206ef2d0806f25145f04a0bef2f4f82321206ef2d0806f2510245f04a121e02100d700dd01f4206ef2d0806f256c415210bc9b3020206ef2d0806f256c41de21206ef2d0806f255f0401a821206ef2d0806f256c41a90421206ef2d0806f2510345f04a18200aeff21c200f2f481010b22206ef2d0806f255f0423206ef2d0806f2510345f0423a024206ef2d0806f2510245f0425206ef2d0806f25145f040600d802fe206ef2d0806f256c411034413016c855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc94ee05230206e953059f45930944133f413e251dca070f828102f102e0311480302114902564802564a02db3cf8427011488040114ac85982103764fe765003cb1fce810101cf00c9130211480200e600d901f8011149015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b113900da01fc1138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112400db01f8112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f00dc010c0e11100e551d01a8044a8210ab78b3cfbae3022182101ba0fefabae302218210c61e9667bae3022182108f9872bdba00de00f90100010501fa31d33f308200b2252bf2f422c200f2e5918200a564f82327a12abef2f4114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113500df01fc113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112311221124112211211123112111201122112000e001fc111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103500e103fe443012db3cc87f01ca001146114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e0db3cc9ed5400e201c100f801ec249130e1f82325a908810101270259f40c6fa192306ddf206e915be0537aa88064a9045188a121206ef2d080f8281148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d00e301fc113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a11361135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a112800e401fc1127114911271126114a11261125114911251124114a11241123114911231122114a11221121114911211120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a111411131149111300e502fc1112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a0911490910280711490710260511490510240311490312564a59db3c3333348101015644206ef2d08026103601206e953059f45a30944133f414e204a4f8236d70f84221804026a5114a206ef2d08002114a020100e600f403f6f82814db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707080408b0810374890c85530821004ad37835005cb1f13cb3f01fa02cecec91610455a1036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f40000e7014000f3011688c87001ca005a02cecec900e80228ff008e88f4a413f4bcf2c80bed5320e303ed43d900e900eb0157a65ec0bb513434800067fe803e903e9020404075c0154c1b05273e903e901640b4405c150488b8b6cf1b112000ea01145321db3c30546440524000ee03d63001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ffa00fa40fa40810101d70055306c149cfa40fa405902d10170541222e205925f05e003d70d1ff2e08221821004ad3783bae30221821093abb53ebae302018210e7822413bae3025f05f2c08200ec00ed00f1005831d33f31fa00308200c241f84225c705f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed5402a831d33ffa00fa40fa4031f40431fa00318142a623c200f2f48138c6f84226c705f2f48121d45363bef2f48200da29f8235009a1c20418f2f4f82322a71e812710a90420c101923071de5330a15074a15327db3c5c00ee00ef0018f82ac87001ca005a02cecec902fe705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040544aa052c01110c85530821004ad37835005cb1f13cb3f01fa02cecec94650104d103840d81036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb0024014000f000f4c2008e5a7070541465804004c855308210eb527edf5005cb1f13cb3f01fa02cecec92604034666146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0093303330e259c87f01ca0055305043fa02ce12ce810101cf00c9ed5401fed33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a1707f541435804008c855308210db17f0ca5005cb1f13cb3f810101cf00cecec9260443135066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c90100f20034fb004003c87f01ca0055305043fa02ce12ce810101cf00c9ed540008c901fb0001fe114bc85520821056bbaafa5004cb1f12810101cf00ce810101cf00c91302114802011149015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114311451143114211441142114111431141114011421140113f1141113f113e1140113e00f501fc113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b112900f601fc1128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a111811171119111711161118111611151117111511141116111400f7006a1113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079060803455507040004db3101f831d200fa00d31fd30730114511471145114411461144114311471143114211461142114111471141114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a11391147113911381146113811371147113711361146113611351147113511341146113411331147113300fa01fc113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f111e1146111e00fb01f8111d1147111d111c1146111c111b1147111b111a1146111a1119114711191118114611181117114711171116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a0911470908114608071147070611460600fc02f805114705041146040311470302114602011148011149db3c3838383881646d5629b3f2f482008d7e5643c200945645c2009170e2945646c2009170e2945646c1659170e2f2f4114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d113901bf00fd01fc1138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a112611251129112511241128112400fe01f8112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f00ff01300e11120e0d11110d0c11100c10bf10ae109d108c1089553301a801f831d20030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131010101fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c010202fe111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c572c5645937f572dde11441145114411431144114301bf010301fc114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e010401fc112d112e112d112c112d112c112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118014602fe8efc5b571f8109def842562dc705f2f4f823114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132e00106010801f4113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a11281127112911271126112811261125112711251124112611241123112511231122112411221121112311211120112211201121111e1120111e111d111f111d010701de111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544301201a8044c218210f5708ab5bae30221821017df7398bae30221821079b9e4c3bae30221821010f7c0f7ba010901140118011d01fa31d33f31d200d307d430d0114511461145114411461144114311461143114211461142114111461141114011461140113f1146113f113e1146113e113d1146113d113c1146113c113b1146113b113a1146113a113911461139113811461138113711461137113611461136113511461135113411461134113311461133010a01fc113211461132113111461131113011461130112f1146112f112e1146112e112d1146112d112c1146112c112b1146112b112a1146112a112911461129112811461128112711461127112611461126112511461125112411461124112311461123112211461122112111461121112011461120111f1146111f111e1146111e010b01f8111d1146111d111c1146111c111b1146111b111a1146111a1119114611191118114611181117114611171116114611161115114611151114114611141113114611131112114611121111114611111110114611100f11460f0e11460e0d11460d0c11460c0b11460b0a11460a09114609081146080711460706114606010c02fc05114605041146040311460302114602011147011148db3c5725573756448e177f701147c0039f573e573e7057428064113e805a113ede9f57458200cf12562af2f4707f114601e28be456d657267656e63795061757365870564791719120e21147114911471146114811461145114711451144114611441143114511430168010d01fc114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113b113c113b1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e010e01f8112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112803112903112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b1119010f02fe1118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610455502114adb3cf8427080408be456d657267656e63795061757365822114c91719122e210351201114c01c8013e011001f4553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c913011149015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114411451144114311441143114211431142114111421141114011411140011101fc113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b011201fc112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116011301541115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01a804f631d33f31d30fd430d0011146011147db3cdb3c820095535647c165945647c2099170e2f2f456468b6536574466565801114220564901114bdb3cf8427080408b6536574466565810340201114c01114bc8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91302114802011149010168013a013e011501fc5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138011601fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123011701f8112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551d01a803f831d33f31fa40d430d0011146011147db3cdb3c573e8200e20f8d0860000000000000000000000000000000000000000000000000000000000000000004564701c705b3f2f48bb53657454726561737572798114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f0168013a011901fc113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b1129011a01fc1128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114011b02fe1113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544007050047101db3cf8427080408bb5365745472656173757279854140271c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037f013e011c0160c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001a8043ce3022182100952917dbae3022182100490d605bae3022182102fb11c16ba011e01260130013801fe31d33f31d30fd30fd30fd430d0114511471145114411461144114311471143114211461142114111471141114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a113911471139113811461138113711471137113611461136113511471135113411461134113311471133011f01fc113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f111e1146111e012001f8111d1147111d111c1146111c111b1147111b111a1146111a1119114711191118114611181117114711171116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a09114709081146080711470706114606012103f405114705041146040311470302114602011148011149db3cdb3c573957395739820086dc56458101f4bb9656448103e8bb9170e296564681012cbb9170e2f2f456448bc536574416e74695768616c658114411471144114311461143114211451142114111441141114011431140113f1142113f113e1141113e0168013a012201f8113d1140113d113c113f113c113b113e113b01113d011137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1129112c11291128112b11281127112a1127012301fc112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111c111f111c111b111e111b111a111d111a1119111c11191118111b11181117111a1117111611191116111511181115111411171114111311161113111211151112012402fe1111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a10691058104710364500705110114adb3cf8427080408bc536574416e74695768616c65822103558114cc8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c913011149015a6d6d40037fc8cf8580013e012501f4ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138013601f631d33f31d200fa00d31fd307d430d0114511481145114411471144114311461143114211481142114111471141114011461140113f1148113f113e1147113e113d1146113d113c1148113c113b1147113b113a1146113a113911481139113811471138113711461137113611481136113511471135113411461134012701fc113311481133113211471132113111461131113011481130112f1147112f112e1146112e112d1148112d112c1147112c112b1146112b112a1148112a112911471129112811461128112711481127112611471126112511461125112411481124112311471123112211461122112111481121112011471120111f1146111f012801fc111e1148111e111d1147111d111c1146111c111b1148111b111a1147111a1119114611191118114811181117114711171116114611161115114811151114114711141113114611131112114811121111114711111110114611100f11480f0e11470e0d11460d0c11480c0b11470b0a11460a091148090811470807114607012903fc061148060511470504114604031148030211470201114901114adb3cdb3c573357335733573456428ba5365744275796261636b870564591719120e2114511491145114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b0168013a012a01fc113a113e113a1139113d11391138113c113803113b031136113a11361138113911380311380303113703113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125012b01fc112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a1116111511191115111411181114111311171113111211161112111111151111111011141110012c02fe0f11130f0e11120e0d11110d0c11100c10bf10ae109d108c107b106a1059104810375505114adb3cf8427080408ba5365744275796261636b822114c91719122e210351201114c01c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c913011149015a6d6d40037fc8cf8580ca00cf8440ce013e012d01f401fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137012e01fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122012f01e4112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01a803f831d33f31d200d430d0011146011147db3cdb3c573856458bd546f67676c6554726164696e67870564891719120e2114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c0168013a013101f803113c03113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127013201fc112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112013303fc1111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610455502114adb3cf8427080408bd546f67676c6554726164696e67822114c91719122e210351201114c01c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c913011149015a6d6d40037fc889013e0134013500016001f8cf16ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138013601fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123013701f0112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01a8043ce3022182102a297933bae3022182102882f1e8bae3022182106920939fba013901410147014e03fe31d33f31fa40d430d0011146011147db3cdb3c572e8200cf12562cf2f48bc526f746174654f7261636c658114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a11380168013a013b0024562c9e8200dfe4f8235625a15626bef2f4de01fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122013c01fc112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b013d03f2108a1079106810571046103544007050047101db3cf8427080408bc526f746174654f7261636c65854140271c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c901fb00013e014001a801f65727810101f823562205552111297f7070c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc902111f0201112401561e01206e953059f45a30944133f415e2810101f8232103111e03561f59216e955b59f45a3098c801cf004133f442e2013f002c561ca4f8231124111d111f111d01111e0102111d0201001a58cf8680cf8480f400f400cf8101f831fa4030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131014201fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c014302f4111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c572d572d11431144114311421143114201bf014401fe114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d7f014501f4112d112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911180146016c1117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01a801fa31d33f31d30fd307d430d0114511461145114411461144114311461143114211461142114111461141114011461140113f1146113f113e1146113e113d1146113d113c1146113c113b1146113b113a1146113a113911461139113811461138113711461137113611461136113511461135113411461134113311461133014801fc113211461132113111461131113011461130112f1146112f112e1146112e112d1146112d112c1146112c112b1146112b112a1146112a112911461129112811461128112711461127112611461126112511461125112411461124112311461123112211461122112111461121112011461120111f1146111f111e1146111e014901f8111d1146111d111c1146111c111b1146111b111a1146111a1119114611191118114611181117114611171116114611161115114611151114114611141113114611131112114611121111114611111110114611100f11460f0e11460e0d11460d0c11460c0b11460b0a11460a09114609081146080711460706114606014a02e405114605041146040311460302114602011147011148db3c572b573e573e8200e8415623b3f2f48200f2195644c209945644c1659170e2945645c1659170e2f2f4f8231128a4810101f82301114880647fc855305034810101cf0001c8cecd810101cf00ca00c902112702011147015626010168014b01fa206e953059f45a30944133f415e21124a4114211451142114111441141114011431140113f1142113f113e1141113e113e113f113e113b113e113b113a113d113a1139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130014c01f4112f1132112f112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1129112c11291127112b11271129112a11291126112911261124112811241127112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111c111f111c111b111e111b014d01cc111a111d111a1119111c11191118111b11181117111a11171116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a10691058104710364055040301a8043ce302218210dc63850bbae302218210d890b03fbae3022182109d3b8cb1ba014f015f0164016d01fc31d33ffa00d31fd207d30730114511481145114411471144114311461143114211481142114111471141114011461140113f1148113f113e1147113e113d1146113d113c1148113c113b1147113b113a1146113a113911481139113811471138113711461137113611481136113511471135113411461134113311481133015001fc113211471132113111461131113011481130112f1147112f112e1146112e112d1148112d112c1147112c112b1146112b112a1148112a112911471129112811461128112711481127112611471126112511461125112411481124112311471123112211461122112111481121112011471120111f1146111f111e1148111e015101f8111d1147111d111c1146111c111b1148111b111a1147111a1119114611191118114811181117114711171116114611161115114811151114114711141113114611131112114811121111114711111110114611100f11480f0e11470e0d11460d0c11480c0b11470b0a11460a09114809081147080711460706114806015204fc0511470504114604031148030211470201114901114adb3c112aa4810101f8232104112c04413001114b01216e955b59f45a3098c801cf004133f442e25649c002961146811388bc93574670e28e10573d563dc132948032573ede8046113dde5648c003945647c2509170e2e3005648c001945647c1ce9170e2e30011480168015301540155002c573d5741563cc214948014573dde80287f114201113d0012573d7057428050113d02f4c001941146c1e293574670e29256339170e29556325632be9170e298f823562fa15631be9170e2925742e30d114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a11351134113911340156015d01fc114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d015701fc112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c1127112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b1116015802fe1115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384715503306db3c0211450203114403112a1143112a112911421129041141040211400203113f03112a113e112a1129113d112904113c040159015b01f63057327056365634a88064a904205647bc93305645de20c2008e1911465646a1113e5646a011315646a0113e1146113e1131113ede11305637a01132a4f8232270113a80401134c859821070acb7bb5003cb1f810101cf00810101cf00c95647431402113b02113401146d50436d5033c8cf8580ca00cf8440ce01015a005efa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0011361132112f1131112f01f802113b0203113a03112a1139112a112911381129041137040211360203113503112a1134112a112911331129041132040211310203113003112a112f112a1129112e112904112d0402112c0203112b03041128040211270203112603112501112401041123040211220203112103112001111f0104111e0402111d02015c008403111c03111b01111a01041119040211180203111703111601111501041114040211130203111203111101111001104f102e103d50bc104a1029103850671045401401fc113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c11271126112b1126112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d015e01ec111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384715446401a803fe31d33f31d307d30731d31f31d430d0011146011147db3c810101f823011149806470c855305034810101cf0001c8cecd810101cf00ca00c90211290201114801562801206e953059f45a30944133f415e21126a45645c0038e1357245736573c573c573f57407f70708064805ae30e1143114511430211440211411143114101680160016100541145c0029c573d113da614113d803c113dde041144040311420302113e0201113d01113604112304552001f8114011421140113f1141113f01114001113f113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113703113803113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b016201f8112a112c112a1129112b11291128112a112811271129112711251128112511231127112311241126112404112504112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116016301861115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057465013444001a801fc31d33f31d307810101d700d401d001d30730114511471145114411461144114311471143114211461142114111471141114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a113911471139113811461138113711471137113611461136113511471135113411461134016501fc113311471133113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f016601fc111e1146111e111d1147111d111c1146111c111b1147111b111a1146111a1119114711191118114611181117114711171116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a091147090811460807114707016703f40611460605114705041146040311470302114602011148011149db3c8200d120564a5628bef2f4112aa45647c0019457405746e30e810101f823020111480111497fc855305034810101cf0001c8cecd810101cf00ca00c90211260201114601562501206e953059f45a30944133f415e21123a411411145114101680169016a00268200ccd0f8425630c705f2f48151d0562ef2f400ac5647c00294573f57468e3e5647c0038e14572e574670011145c87401cb0212ca07cbffc9d08e171147c004985734113311441133925745e211441145112ce2113d1144113d112c113de2113e1144113e113d113e113d01fc114011441140113f1143113f113e1142113e113d1141113d113e1140113e113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c016b01f4112b112f112b112a112e112a1129112d11291128112c11281127112b11271128112a11281125112911251123112811231127112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b1117016c019e1116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c107b106a10591048103746050201a802fe8efb31d33ffa4031fa0030561e8101012359f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f481188621206ef2d0806f29185f08b39b21206ef2d0806f296c81b39170e2f2f4e021016e017701fc114411461144114311451143114211461142114111451141114011461140113f1145113f113e1146113e113d1145113d113c1146113c113b1145113b113a1146113a113911451139113811461138113711451137113611461136113511451135113411461134113311451133113211461132113111451131113011461130016f01fc112f1145112f112e1146112e112d1145112d112c1146112c112b1145112b112a1146112a112911451129112811461128112711451127112611461126112511451125112411461124112311451123112211461122112111451121112011461120111f1145111f111e1146111e111d1145111d111c1146111c111b1145111b017001fc111a1146111a1119114511191118114611181117114511171116114611161115114511151114114611141113114511131112114611121111114511111110114611100f11450f0e11460e0d11450d0c11460c0b11450b0a11460a091145090811460807114507061146060511450504114604031145030211460201114501017102fe11478122d411495647db3c01114a01f2f4561a810101564859f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e27053016eb38e1a5b20206ef2d0806f2510345f0401206ef2d0806f2510245f04019132e25647a056465621a8812710a904017f017202f481010103a45321b9564b5444305240c855405045810101cf0012810101cf00810101cf0001c8810101cf0012ca00cdc902111e0213564a01206e953059f45a30944133f415e2111c01be99021147025745574530e30d114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c0173017400ee1147206ef2d0806f295b105610461036102681010147777f70c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc903111e031201114701206e953059f45a30944133f415e2011117011143a0111a1144111a111a1142111a111601fc113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b1127017501fc1126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a1116111511191115111411181114111311171113111211161112017601481111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d553801a8044a821009d21b11bae30221821023019716bae302218210cfc66cbdbae3022182103c134728ba01780185018c019001f831d33f30114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131017901fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c017a02f4111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c561e810101564859f40d6fa192306ddf01bf017b01fe206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f4114411461144114311451143114211461142114111451141114011461140113f1145113f113e1146113e113d1145113d113c1146113c113b1145113b017c01fc113a1146113a113911451139113811461138113711451137113611461136113511451135113411461134113311451133113211461132113111451131113011461130112f1145112f112e1146112e112d1145112d112c1146112c112b1145112b112a1146112a112911451129112811461128112711451127112611461126017d01fc112511451125112411461124112311451123112211461122112111451121112011461120111f1145111f111e1146111e111d1145111d111c1146111c111b1145111b111a1146111a111911451119111811461118111711451117111611461116111511451115111411461114111311451113111211461112111111451111017e02fe1110114611100f11450f0e11460e0d11450d0c11460c0b11450b0a11460a09114509081146080711450706114606051145050411460403114503021146020111450111468122d411465648db3c01114701f2f48159c55647206ef2d0806f296c81b3f2f41146206ef2d0806f2930104710368101017f27515a05104a5a1ac8017f0180005281010120561f50334133f40c6fa19401d70030925b6de2206e923070e0f82301206ef2d080a15621b902fc55805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90311200301114a01206e953059f45a30944133f415e28b6536574466565856480101f90101f901ba94573f5746e30e114211451142114111441141114011431140113f1142113f113e1141113e01810182006a8bd546f67676c6554726164696e6780111480101f90101f901ba9a5736111bc3001135111b92571ce2111b1145111b111b113d111b01fc111b1140111b113c113f113c113b113e113b113a113d113a1139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1129112c1129018301fc1128112b11281127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111c111f111c111c111e111c111a111d111a1119111c11191118111b11181117111a1117111611191116111511181115111411171114018401521113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf552b1201a801f831fa4030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131018601fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c018703fc111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c318200835889564701c705b3f2f411441145114401bf0188018900438000000000000000000000000000000000000000000000000000000000000000001001fc114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f018a01fc112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a018b01b41119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610451034413001a801f831fa4030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131018d01fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c018e02f4111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c573e81646d562cb3f2f411441145114401bf018f01fc114311441143114211431142114111421141114011411140113f1140113f113e113f113e113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e019c043ce302218210f1822da1bae30221821083b8144abae302018210946a98b6ba01910198019e01a401fc31d30fd307d30fd30fd30f30114511481145114411471144114311461143114211481142114111471141114011461140113f1148113f113e1147113e113d1146113d113c1148113c113b1147113b113a1146113a113911481139113811471138113711461137113611481136113511471135113411461134113311481133019201fc113211471132113111461131113011481130112f1147112f112e1146112e112d1148112d112c1147112c112b1146112b112a1148112a112911471129112811461128112711481127112611471126112511461125112411481124112311471123112211461122112111481121112011471120111f1146111f111e1148111e019301f8111d1147111d111c1146111c111b1148111b111a1147111a1119114611191118114811181117114711171116114611161115114811151114114711141113114611131112114811121111114711111110114611100f11480f0e11470e0d11460d0c11480c0b11470b0a11460a09114809081147080711460706114806019402fc0511470504114604031148030211470201114901114adb3c573957395739573c573c81646d5628b3f2f4820086dc5642c200945642c1659170e2945644c1659170e2945643c2009170e29656438101f4bb9170e2945645c2009170e29656458103e8bb9170e296564681012cbb9170e2f2f4114011451140113f1144113f01bf019501fc113e1143113e113d1142113d113c1141113c113c1140113c113e113f113e1139113e11391138113d11381137113c11371138113b11381139113a1139113711391137113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a019601fc1129112e11291128112d11281127112c11271126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a1115019701781114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c554601a801f831d20030114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131019901fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c019a02f4111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411464130db3c573881646d562cb3f2f411441145114401bf019b01fc114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e019c01fc112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119019d01781118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01a801f831d200fa00d31fd30730114511471145114411461144114311471143114211461142114111471141114011461140113f1147113f113e1146113e113d1147113d113c1146113c113b1147113b113a1146113a113911471139113811461138113711471137113611461136113511471135113411461134113311471133019f01fc113211461132113111471131113011461130112f1147112f112e1146112e112d1147112d112c1146112c112b1147112b112a1146112a112911471129112811461128112711471127112611461126112511471125112411461124112311471123112211461122112111471121112011461120111f1147111f111e1146111e01a001f8111d1147111d111c1146111c111b1147111b111a1146111a1119114711191118114611181117114711171116114611161115114711151114114611141113114711131112114611121111114711111110114611100f11470f0e11460e0d11470d0c11460c0b11470b0a11460a0911470908114608071147070611460601a102f805114705041146040311470302114602011148011149db3c573357335733573481646d5629b3f2f4114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a113611351139113511341138113401bf01a201fc113211361132113211351132113211331132112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d01a301c4111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf553a01a802fe8efdd33f30c8018210aff90f5758cb1fcb3fc9114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113301a501a901fc113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e01a601ea111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544301201a70146f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb0001a801f8c87f01ca001146114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e0db3cc9ed54db3101c10006e0114504e2e3022082f0939b8f50a89494d7788bca14d37ccb5365057f81e805b401d1ab446c0d80a3fabae3022082f040391f4eaad79adb418bdfd49edad3b17b5e392ce4fafbbf82f21f2055ee0f7dbae30282f0228aefdc558b3d1b9bb87fc33d71a2e40504be5a8d6acc8d737ee0215d75d86cba01ab01ae01b801bb01fe30114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f01ac01fc112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a01ad029a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c70574501bf01c001fe30114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f01af01fc112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a01b002f41119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c114411451144114311451143114211451142114111451141114011451140113f1145113f113e1145113e113d1145113d01bf01b101fc113c1145113c113b1145113b113a1145113a113911451139113811451138113711451137113611451136113511451135113411451134113311451133113211451132113111451131113011451130112f1145112f112e1145112e112d1145112d112c1145112c112b1145112b112a1145112a11291145112911281145112801b201fc112711451127112611451126112511451125112411451124112311451123112211451122112111451121112011451120111f1145111f111e1145111e111d1145111d111c1145111c111b1145111b111a1145111a11191145111911181145111811171145111711161145111611151145111511141145111411131145111301b302f61112114511121111114511111110114511100f11450f0e11450e0d11450d0c11450c0b11450b0a11450a09114509114508070655408168f41146db3c5726572c572c572c1122b301114301f2f470705640114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d01b401b50010f8235622a15623bb01fc113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e02112c0201112b011129112a112911281129112811271128112711261127112601b601f6112511261125112411251124701125112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111511141115111411131114111311121113111201b701501111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561415433001c001fe30114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f01b901fc112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a01ba02aa1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c57255737707f113801112501bf01c0011ee3025f0f5f0f5f0f5f0f5f0af2c08201bc01fc114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f01bd01fc112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a01be02b01119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c8200ae97562db3f2f4112db3112d01bf01c0001882008aabf8425645c705f2f401f4c87f01ca001146114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e0db3cc9ed5401c101f4011146011145fa0201114301ca0001114101ce01113f01cc113dc8cc01113c01cb0f01113a01cb0701113801ce011136fa02011134fa0201113201cb0f01113001cb0f01112e01cb0f01112c01ca0001112a01ca00011128fa02011126fa0201112401cb1f01112201cb071120c8810101cf0001111f0181010101c201fccf0001111dfa0201111bfa021119c8ce01111801ca0001111601ca0001111401810101cf0001111201810101cf0001111001f4001ef4000cc8810101cf001bcb0719ca0017cb1f15810101cf0013cb1f810101cf00cb1fcb0ff40001c8810101cf0012f40013f4005003fa0213ca0013cb0f5003fa0213cb1f14f400500401c300b0fa025004fa0215ca0015cb0f05c8f40016ca005006fa025006fa0216f40016ca005006fa0216cb1f16cb0716810101cf0016810101cf00c85007fa0218f40018810101cf0018f40019ce17cb0fcd15cd13cd14cdcd12cdcd615f96a8');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initQuasarMaster_init_args({ $$type: 'QuasarMaster_init_args', owner, content, walletCode })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const QuasarMaster_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    1425: { message: "No tickets" },
    2526: { message: "Only AI" },
    4173: { message: "Self referral" },
    6278: { message: "Closed" },
    8660: { message: "Insufficient" },
    8916: { message: "Window closed" },
    10363: { message: "Unauthorized burn" },
    11836: { message: "Invalid fee source" },
    13478: { message: "Minting off" },
    14534: { message: "Not owner" },
    17062: { message: "Invalid amount" },
    20944: { message: "AI disabled" },
    21101: { message: "Already registered" },
    21245: { message: "Insufficient stake" },
    21516: { message: "Invalid receiver" },
    22981: { message: "Done" },
    25219: { message: "Lock active" },
    25390: { message: "Buyback off" },
    25534: { message: "Not found" },
    25709: { message: "AI controls" },
    26156: { message: "Below min" },
    26868: { message: "AI alive" },
    28115: { message: "No stake" },
    30245: { message: "No vesting" },
    31786: { message: "Pool low" },
    33624: { message: "Invalid DeFi address" },
    34524: { message: "Limits" },
    35499: { message: "Only owner" },
    36222: { message: "Invalid lottery config" },
    38227: { message: "Fee 0.10%-1.00%" },
    40072: { message: "Pool empty" },
    40372: { message: "Max tx exceeded" },
    41094: { message: "Already exists" },
    42340: { message: "Too early" },
    43719: { message: "Staking off" },
    44027: { message: "Referral off" },
    44695: { message: "Disable autonomy first" },
    44799: { message: "Nothing to claim" },
    45296: { message: "Invalid vesting" },
    45605: { message: "Lottery off" },
    47767: { message: "Invalid referral reward" },
    49729: { message: "Unauthorized" },
    52432: { message: "Only AI oracle" },
    52497: { message: "Cliff not reached" },
    53010: { message: "No autonomy" },
    53536: { message: "Low confidence" },
    55849: { message: "Cooldown" },
    57292: { message: "Trading off" },
    57316: { message: "AI cooldown" },
    57665: { message: "Invalid staking config" },
    57784: { message: "No rewards" },
    57871: { message: "Invalid" },
    59457: { message: "Paused" },
    61977: { message: "Range" },
} as const

export const QuasarMaster_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "No tickets": 1425,
    "Only AI": 2526,
    "Self referral": 4173,
    "Closed": 6278,
    "Insufficient": 8660,
    "Window closed": 8916,
    "Unauthorized burn": 10363,
    "Invalid fee source": 11836,
    "Minting off": 13478,
    "Not owner": 14534,
    "Invalid amount": 17062,
    "AI disabled": 20944,
    "Already registered": 21101,
    "Insufficient stake": 21245,
    "Invalid receiver": 21516,
    "Done": 22981,
    "Lock active": 25219,
    "Buyback off": 25390,
    "Not found": 25534,
    "AI controls": 25709,
    "Below min": 26156,
    "AI alive": 26868,
    "No stake": 28115,
    "No vesting": 30245,
    "Pool low": 31786,
    "Invalid DeFi address": 33624,
    "Limits": 34524,
    "Only owner": 35499,
    "Invalid lottery config": 36222,
    "Fee 0.10%-1.00%": 38227,
    "Pool empty": 40072,
    "Max tx exceeded": 40372,
    "Already exists": 41094,
    "Too early": 42340,
    "Staking off": 43719,
    "Referral off": 44027,
    "Disable autonomy first": 44695,
    "Nothing to claim": 44799,
    "Invalid vesting": 45296,
    "Lottery off": 45605,
    "Invalid referral reward": 47767,
    "Unauthorized": 49729,
    "Only AI oracle": 52432,
    "Cliff not reached": 52497,
    "No autonomy": 53010,
    "Low confidence": 53536,
    "Cooldown": 55849,
    "Trading off": 57292,
    "AI cooldown": 57316,
    "Invalid staking config": 57665,
    "No rewards": 57784,
    "Invalid": 57871,
    "Paused": 59457,
    "Range": 61977,
} as const

const QuasarMaster_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"EventMint","header":860203922,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"EventBurn","header":3532337071,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"burner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"EventFeeDistributed","header":3296433968,"fields":[{"name":"totalFee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"burn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"buyback","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lottery","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"staking","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"referral","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"treasury","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"defiPool","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventBuybackExecuted","header":1890367419,"fields":[{"name":"tonSpent","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrBurned","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventLotteryDrawn","header":1455139578,"fields":[{"name":"round","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"winner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jackpot","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventStake","header":2899784103,"fields":[{"name":"staker","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventUnstake","header":2219162629,"fields":[{"name":"staker","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventReferralRegistered","header":685454731,"fields":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"referrer","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"EventVestingClaimed","header":929365622,"fields":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventAiAction","header":1580835377,"fields":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"actionType","type":{"kind":"simple","type":"string","optional":false}},{"name":"oldValue","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"newValue","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"AISetOracle","header":707361075,"fields":[{"name":"oracleAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"AIGrantFullAutonomy","header":3323893351,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AIHeartbeat","header":2409132733,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"status","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIVetoVote","header":2637925553,"fields":[{"name":"actionId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"voter","type":{"kind":"simple","type":"address","optional":false}},{"name":"stake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"OwnerOverride","header":164764433,"fields":[{"name":"actionId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIRebalance","header":679670248,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"targetFeeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"targetBurnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"recommendation","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIPriceSignal","header":1763742623,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"priceTon","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"volatility","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"sentiment","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"action","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"AIAnomalyAlert","header":3697509643,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"severity","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"anomalyType","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"affectedWallets","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"recommendedAction","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIGovernanceProposal","header":3633360959,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"proposalType","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"newValue","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"description","type":{"kind":"simple","type":"string","optional":false}},{"name":"confidence","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"AISetFee","header":400520088,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AISetTreasuryDirect","header":2042225859,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AISetAntiWhale","header":284672247,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldown","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AISetBuybackDirect","header":156406141,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"threshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"cooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"burnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIToggleTrading","header":76600837,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIEmergencyPause","header":4117793461,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"pause","type":{"kind":"simple","type":"bool","optional":false}},{"name":"severity","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"AIRotateOracle","header":800136214,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOracle","type":{"kind":"simple","type":"address","optional":false}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Mint","header":4235234258,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BurnNotification","header":3675779274,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenTransfer","header":2477503806,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardTonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenBurn","header":3884065811,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenNotification","header":78460803,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"FeeTransfer","header":3948052191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"originalSender","type":{"kind":"simple","type":"address","optional":false}},{"name":"originalReceiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SetTreasury","header":3485887677,"fields":[{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SetFeeConfig","header":1007896360,"fields":[{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"burnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldown","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"ToggleTrading","header":4051840417,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"TriggerBuyback","header":3487694140,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SetBuybackConfig","header":2209879114,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"threshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"cooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"burnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"SetDefiAddress","header":587306774,"fields":[{"name":"defiAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"SyncFeeToDefi","header":94992733,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Stake","header":3203459332,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Unstake","header":4284693473,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"ClaimRewards","header":155852668,"fields":[]},
    {"name":"SetStakingConfig","header":331180850,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"apyBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"minStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lockPeriod","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"RegisterReferral","header":3551857443,"fields":[{"name":"referrer","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ClaimReferralRewards","header":3188740785,"fields":[]},
    {"name":"SetReferralConfig","header":447783234,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"rewardBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"AddVesting","header":3930012637,"fields":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"cliff","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"duration","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"ClaimVested","header":4152964106,"fields":[]},
    {"name":"TriggerLottery","header":2876814287,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"SetLotteryConfig","header":463535866,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"ticketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"drawInterval","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"jackpotShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}}]},
    {"name":"JettonData","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"adminAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonContent","type":{"kind":"simple","type":"cell","optional":false}},{"name":"jettonWalletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"AIState","header":null,"fields":[{"name":"oracleAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"aiModeEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"fullAutonomy","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lastRebalanceAt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalSignalsReceived","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"currentFeeBps","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceHistoryCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"anomalyCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"isAlive","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"FeeConfig","header":null,"fields":[{"name":"feeBps","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"burnShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"treasuryShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"maxTxBps","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"maxWalletBps","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"cooldown","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBurned","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalFeesCollected","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"BuybackState","header":null,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"pool","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"threshold","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"cooldown","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"burnPercent","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastBuybackAt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBuybacks","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalQsrBurnedViaBuyback","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalTonSpent","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"AutonomyState","header":null,"fields":[{"name":"fullAutonomyEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiActionCooldown","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastAiActionTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"heartbeatTimeout","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ownerOverrideWindow","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"vetoThresholdBps","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalVetoStake","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pendingActions","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"AIActionLog","header":null,"fields":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"timestamp","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"actionType","type":{"kind":"simple","type":"string","optional":false}},{"name":"oldValue","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"newValue","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"reason","type":{"kind":"simple","type":"string","optional":false}},{"name":"executed","type":{"kind":"simple","type":"bool","optional":false}},{"name":"vetoed","type":{"kind":"simple","type":"bool","optional":false}},{"name":"overridden","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"VetoState","header":null,"fields":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalStake","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"vetoCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"threshold","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"active","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"AIRecommendation","header":null,"fields":[{"name":"timestamp","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"action","type":{"kind":"simple","type":"string","optional":false}},{"name":"confidence","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"executed","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"StakeInfo","header":null,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"startTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastClaim","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lockEnd","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"StakingConfig","header":null,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"apyBps","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"minStake","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lockPeriod","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalStaked","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ReferralInfo","header":null,"fields":[{"name":"referrer","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalEarned","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalReferrals","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"ReferralConfig","header":null,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"rewardBps","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"VestingInfo","header":null,"fields":[{"name":"totalAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"claimed","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"startTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"cliff","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"duration","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"LotteryConfig","header":null,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"ticketPrice","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"drawInterval","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"jackpotShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"currentRound","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastDraw","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalJackpot","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"LotteryTicket","header":null,"fields":[{"name":"round","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"QuasarMaster$Data","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeBurnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalBurned","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalFeesCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldownSeconds","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"tradingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackThreshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"buybackBurnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lastBuybackTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBuybacks","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalQsrBurnedViaBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalTonSpentOnBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"aiOracle","type":{"kind":"simple","type":"address","optional":false}},{"name":"aiEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiFullAutonomy","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lastRebalanceTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"signalCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceHistory","type":{"kind":"dict","key":"int","value":"int"}},{"name":"anomalyLog","type":{"kind":"dict","key":"int","value":"AIRecommendation","valueFormat":"ref"}},{"name":"anomalyIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"minConfidence","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"emergencyPause","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiActionCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastAiActionTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"heartbeatTimeout","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ownerOverrideWindow","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"vetoThresholdBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"aiActionLog","type":{"kind":"dict","key":"int","value":"AIActionLog","valueFormat":"ref"}},{"name":"aiActionIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pendingAiActions","type":{"kind":"dict","key":"int","value":"int"}},{"name":"vetoLog","type":{"kind":"dict","key":"int","value":"VetoState","valueFormat":"ref"}},{"name":"totalVetoStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"stakingApyBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stakingMinStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingLockPeriod","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"stakers","type":{"kind":"dict","key":"address","value":"StakeInfo","valueFormat":"ref"}},{"name":"totalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingRewardsPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"referralEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"referralRewardBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referrals","type":{"kind":"dict","key":"address","value":"ReferralInfo","valueFormat":"ref"}},{"name":"vestingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"teamAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"teamClaimed","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"vestingSchedules","type":{"kind":"dict","key":"address","value":"VestingInfo","valueFormat":"ref"}},{"name":"lotteryEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lotteryTicketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryDrawInterval","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lotteryJackpotShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lotteryRound","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryLastDraw","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryJackpot","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryTickets","type":{"kind":"dict","key":"int","value":"address"}},{"name":"lotteryTicketCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryWinners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"defiAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"defiFeeShareBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"QuasarWallet$Data","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"lastTxTime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const QuasarMaster_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "EventMint": 860203922,
    "EventBurn": 3532337071,
    "EventFeeDistributed": 3296433968,
    "EventBuybackExecuted": 1890367419,
    "EventLotteryDrawn": 1455139578,
    "EventStake": 2899784103,
    "EventUnstake": 2219162629,
    "EventReferralRegistered": 685454731,
    "EventVestingClaimed": 929365622,
    "EventAiAction": 1580835377,
    "AISetOracle": 707361075,
    "AIGrantFullAutonomy": 3323893351,
    "AIHeartbeat": 2409132733,
    "AIVetoVote": 2637925553,
    "OwnerOverride": 164764433,
    "AIRebalance": 679670248,
    "AIPriceSignal": 1763742623,
    "AIAnomalyAlert": 3697509643,
    "AIGovernanceProposal": 3633360959,
    "AISetFee": 400520088,
    "AISetTreasuryDirect": 2042225859,
    "AISetAntiWhale": 284672247,
    "AISetBuybackDirect": 156406141,
    "AIToggleTrading": 76600837,
    "AIEmergencyPause": 4117793461,
    "AIRotateOracle": 800136214,
    "Mint": 4235234258,
    "BurnNotification": 3675779274,
    "TokenTransfer": 2477503806,
    "TokenBurn": 3884065811,
    "TokenNotification": 78460803,
    "FeeTransfer": 3948052191,
    "SetTreasury": 3485887677,
    "SetFeeConfig": 1007896360,
    "ToggleTrading": 4051840417,
    "TriggerBuyback": 3487694140,
    "SetBuybackConfig": 2209879114,
    "SetDefiAddress": 587306774,
    "SyncFeeToDefi": 94992733,
    "Stake": 3203459332,
    "Unstake": 4284693473,
    "ClaimRewards": 155852668,
    "SetStakingConfig": 331180850,
    "RegisterReferral": 3551857443,
    "ClaimReferralRewards": 3188740785,
    "SetReferralConfig": 447783234,
    "AddVesting": 3930012637,
    "ClaimVested": 4152964106,
    "TriggerLottery": 2876814287,
    "SetLotteryConfig": 463535866,
}

const QuasarMaster_getters: ABIGetter[] = [
    {"name":"get_jetton_data","methodId":106029,"arguments":[],"returnType":{"kind":"simple","type":"JettonData","optional":false}},
    {"name":"get_wallet_address","methodId":103289,"arguments":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"get_ai_state","methodId":127730,"arguments":[],"returnType":{"kind":"simple","type":"AIState","optional":false}},
    {"name":"get_autonomy_state","methodId":83718,"arguments":[],"returnType":{"kind":"simple","type":"AutonomyState","optional":false}},
    {"name":"get_fee_config","methodId":90859,"arguments":[],"returnType":{"kind":"simple","type":"FeeConfig","optional":false}},
    {"name":"get_buyback_state","methodId":120761,"arguments":[],"returnType":{"kind":"simple","type":"BuybackState","optional":false}},
    {"name":"get_staking_config","methodId":129919,"arguments":[],"returnType":{"kind":"simple","type":"StakingConfig","optional":false}},
    {"name":"get_stake_info","methodId":127811,"arguments":[{"name":"staker","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"StakeInfo","optional":true}},
    {"name":"get_referral_info","methodId":93058,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"ReferralInfo","optional":true}},
    {"name":"get_vesting_info","methodId":79114,"arguments":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"VestingInfo","optional":true}},
    {"name":"get_lottery_config","methodId":78180,"arguments":[],"returnType":{"kind":"simple","type":"LotteryConfig","optional":false}},
    {"name":"get_lottery_winner","methodId":85660,"arguments":[{"name":"round","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"get_ai_action","methodId":68452,"arguments":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"AIActionLog","optional":true}},
    {"name":"get_veto_state","methodId":122232,"arguments":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"VetoState","optional":true}},
    {"name":"get_ai_recommendation","methodId":125135,"arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"AIRecommendation","optional":true}},
    {"name":"get_price_at","methodId":73687,"arguments":[{"name":"timestamp","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"is_paused","methodId":95098,"arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"is_trading_enabled","methodId":82925,"arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"is_ai_alive","methodId":112404,"arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"can_owner_override","methodId":116763,"arguments":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"get_defi_address","methodId":124902,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"get_defi_fee_share","methodId":103107,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const QuasarMaster_getterMapping: { [key: string]: string } = {
    'get_jetton_data': 'getGetJettonData',
    'get_wallet_address': 'getGetWalletAddress',
    'get_ai_state': 'getGetAiState',
    'get_autonomy_state': 'getGetAutonomyState',
    'get_fee_config': 'getGetFeeConfig',
    'get_buyback_state': 'getGetBuybackState',
    'get_staking_config': 'getGetStakingConfig',
    'get_stake_info': 'getGetStakeInfo',
    'get_referral_info': 'getGetReferralInfo',
    'get_vesting_info': 'getGetVestingInfo',
    'get_lottery_config': 'getGetLotteryConfig',
    'get_lottery_winner': 'getGetLotteryWinner',
    'get_ai_action': 'getGetAiAction',
    'get_veto_state': 'getGetVetoState',
    'get_ai_recommendation': 'getGetAiRecommendation',
    'get_price_at': 'getGetPriceAt',
    'is_paused': 'getIsPaused',
    'is_trading_enabled': 'getIsTradingEnabled',
    'is_ai_alive': 'getIsAiAlive',
    'can_owner_override': 'getCanOwnerOverride',
    'get_defi_address': 'getGetDefiAddress',
    'get_defi_fee_share': 'getGetDefiFeeShare',
}

const QuasarMaster_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Mint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"BurnNotification"}},
    {"receiver":"internal","message":{"kind":"text","text":"Stop Minting"}},
    {"receiver":"internal","message":{"kind":"typed","type":"FeeTransfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TriggerBuyback"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Stake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Unstake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClaimRewards"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetStakingConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RegisterReferral"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetReferralConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AddVesting"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClaimVested"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TriggerLottery"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetLotteryConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIGrantFullAutonomy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIHeartbeat"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIEmergencyPause"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AISetFee"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AISetTreasuryDirect"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AISetAntiWhale"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AISetBuybackDirect"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIToggleTrading"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIRotateOracle"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AISetOracle"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIRebalance"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIPriceSignal"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIAnomalyAlert"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIGovernanceProposal"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AIVetoVote"}},
    {"receiver":"internal","message":{"kind":"typed","type":"OwnerOverride"}},
    {"receiver":"internal","message":{"kind":"text","text":"Claim AI Control"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetDefiAddress"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetTreasury"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetFeeConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ToggleTrading"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetBuybackConfig"}},
    {"receiver":"internal","message":{"kind":"text","text":"Resume"}},
    {"receiver":"internal","message":{"kind":"text","text":"Toggle AI"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class QuasarMaster implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = QuasarMaster_errors_backward;
    public static readonly opcodes = QuasarMaster_opcodes;
    
    static async init(owner: Address, content: Cell, walletCode: Cell) {
        return await QuasarMaster_init(owner, content, walletCode);
    }
    
    static async fromInit(owner: Address, content: Cell, walletCode: Cell) {
        const __gen_init = await QuasarMaster_init(owner, content, walletCode);
        const address = contractAddress(0, __gen_init);
        return new QuasarMaster(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new QuasarMaster(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  QuasarMaster_types,
        getters: QuasarMaster_getters,
        receivers: QuasarMaster_receivers,
        errors: QuasarMaster_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Mint | BurnNotification | "Stop Minting" | FeeTransfer | TriggerBuyback | Stake | Unstake | ClaimRewards | SetStakingConfig | RegisterReferral | SetReferralConfig | AddVesting | ClaimVested | TriggerLottery | SetLotteryConfig | AIGrantFullAutonomy | AIHeartbeat | AIEmergencyPause | AISetFee | AISetTreasuryDirect | AISetAntiWhale | AISetBuybackDirect | AIToggleTrading | AIRotateOracle | AISetOracle | AIRebalance | AIPriceSignal | AIAnomalyAlert | AIGovernanceProposal | AIVetoVote | OwnerOverride | "Claim AI Control" | SetDefiAddress | SetTreasury | SetFeeConfig | ToggleTrading | SetBuybackConfig | "Resume" | "Toggle AI" | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BurnNotification') {
            body = beginCell().store(storeBurnNotification(message)).endCell();
        }
        if (message === "Stop Minting") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'FeeTransfer') {
            body = beginCell().store(storeFeeTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TriggerBuyback') {
            body = beginCell().store(storeTriggerBuyback(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Stake') {
            body = beginCell().store(storeStake(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Unstake') {
            body = beginCell().store(storeUnstake(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClaimRewards') {
            body = beginCell().store(storeClaimRewards(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetStakingConfig') {
            body = beginCell().store(storeSetStakingConfig(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RegisterReferral') {
            body = beginCell().store(storeRegisterReferral(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetReferralConfig') {
            body = beginCell().store(storeSetReferralConfig(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddVesting') {
            body = beginCell().store(storeAddVesting(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClaimVested') {
            body = beginCell().store(storeClaimVested(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TriggerLottery') {
            body = beginCell().store(storeTriggerLottery(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetLotteryConfig') {
            body = beginCell().store(storeSetLotteryConfig(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIGrantFullAutonomy') {
            body = beginCell().store(storeAIGrantFullAutonomy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIHeartbeat') {
            body = beginCell().store(storeAIHeartbeat(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIEmergencyPause') {
            body = beginCell().store(storeAIEmergencyPause(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AISetFee') {
            body = beginCell().store(storeAISetFee(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AISetTreasuryDirect') {
            body = beginCell().store(storeAISetTreasuryDirect(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AISetAntiWhale') {
            body = beginCell().store(storeAISetAntiWhale(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AISetBuybackDirect') {
            body = beginCell().store(storeAISetBuybackDirect(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIToggleTrading') {
            body = beginCell().store(storeAIToggleTrading(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIRotateOracle') {
            body = beginCell().store(storeAIRotateOracle(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AISetOracle') {
            body = beginCell().store(storeAISetOracle(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIRebalance') {
            body = beginCell().store(storeAIRebalance(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIPriceSignal') {
            body = beginCell().store(storeAIPriceSignal(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIAnomalyAlert') {
            body = beginCell().store(storeAIAnomalyAlert(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIGovernanceProposal') {
            body = beginCell().store(storeAIGovernanceProposal(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AIVetoVote') {
            body = beginCell().store(storeAIVetoVote(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'OwnerOverride') {
            body = beginCell().store(storeOwnerOverride(message)).endCell();
        }
        if (message === "Claim AI Control") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetDefiAddress') {
            body = beginCell().store(storeSetDefiAddress(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetTreasury') {
            body = beginCell().store(storeSetTreasury(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetFeeConfig') {
            body = beginCell().store(storeSetFeeConfig(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ToggleTrading') {
            body = beginCell().store(storeToggleTrading(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetBuybackConfig') {
            body = beginCell().store(storeSetBuybackConfig(message)).endCell();
        }
        if (message === "Resume") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === "Toggle AI") {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetJettonData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_jetton_data', builder.build())).stack;
        const result = loadGetterTupleJettonData(source);
        return result;
    }
    
    async getGetWalletAddress(provider: ContractProvider, owner: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(owner);
        const source = (await provider.get('get_wallet_address', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getGetAiState(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_ai_state', builder.build())).stack;
        const result = loadGetterTupleAIState(source);
        return result;
    }
    
    async getGetAutonomyState(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_autonomy_state', builder.build())).stack;
        const result = loadGetterTupleAutonomyState(source);
        return result;
    }
    
    async getGetFeeConfig(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_fee_config', builder.build())).stack;
        const result = loadGetterTupleFeeConfig(source);
        return result;
    }
    
    async getGetBuybackState(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_buyback_state', builder.build())).stack;
        const result = loadGetterTupleBuybackState(source);
        return result;
    }
    
    async getGetStakingConfig(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_staking_config', builder.build())).stack;
        const result = loadGetterTupleStakingConfig(source);
        return result;
    }
    
    async getGetStakeInfo(provider: ContractProvider, staker: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(staker);
        const source = (await provider.get('get_stake_info', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleStakeInfo(result_p) : null;
        return result;
    }
    
    async getGetReferralInfo(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('get_referral_info', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleReferralInfo(result_p) : null;
        return result;
    }
    
    async getGetVestingInfo(provider: ContractProvider, beneficiary: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(beneficiary);
        const source = (await provider.get('get_vesting_info', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleVestingInfo(result_p) : null;
        return result;
    }
    
    async getGetLotteryConfig(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_lottery_config', builder.build())).stack;
        const result = loadGetterTupleLotteryConfig(source);
        return result;
    }
    
    async getGetLotteryWinner(provider: ContractProvider, round: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(round);
        const source = (await provider.get('get_lottery_winner', builder.build())).stack;
        const result = source.readAddressOpt();
        return result;
    }
    
    async getGetAiAction(provider: ContractProvider, actionId: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(actionId);
        const source = (await provider.get('get_ai_action', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAIActionLog(result_p) : null;
        return result;
    }
    
    async getGetVetoState(provider: ContractProvider, actionId: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(actionId);
        const source = (await provider.get('get_veto_state', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleVetoState(result_p) : null;
        return result;
    }
    
    async getGetAiRecommendation(provider: ContractProvider, index: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(index);
        const source = (await provider.get('get_ai_recommendation', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAIRecommendation(result_p) : null;
        return result;
    }
    
    async getGetPriceAt(provider: ContractProvider, timestamp: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(timestamp);
        const source = (await provider.get('get_price_at', builder.build())).stack;
        const result = source.readBigNumberOpt();
        return result;
    }
    
    async getIsPaused(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('is_paused', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getIsTradingEnabled(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('is_trading_enabled', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getIsAiAlive(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('is_ai_alive', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getCanOwnerOverride(provider: ContractProvider, actionId: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(actionId);
        const source = (await provider.get('can_owner_override', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getGetDefiAddress(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_defi_address', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getGetDefiFeeShare(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_defi_fee_share', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}