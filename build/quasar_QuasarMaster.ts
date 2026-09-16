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
        b_0.storeUint(1680571655, 32);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.receiver);
    };
}

export function loadMint(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1680571655) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
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
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.responseDestination);
    };
}

export function loadBurnNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
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
        b_0.storeUint(260734629, 32);
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
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
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
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
    };
}

export function loadTokenBurn(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
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
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
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

export type InternalTransfer = {
    $$type: 'InternalTransfer';
    queryId: bigint;
    amount: bigint;
    from: Address;
    responseDestination: Address;
    forwardTonAmount: bigint;
    forwardPayload: Slice;
}

export function storeInternalTransfer(src: InternalTransfer) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.responseDestination);
        b_0.storeCoins(src.forwardTonAmount);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadInternalTransfer(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _from = sc_0.loadAddress();
    const _responseDestination = sc_0.loadAddress();
    const _forwardTonAmount = sc_0.loadCoins();
    const _forwardPayload = sc_0;
    return { $$type: 'InternalTransfer' as const, queryId: _queryId, amount: _amount, from: _from, responseDestination: _responseDestination, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadTupleInternalTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _from = source.readAddress();
    const _responseDestination = source.readAddress();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'InternalTransfer' as const, queryId: _queryId, amount: _amount, from: _from, responseDestination: _responseDestination, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function loadGetterTupleInternalTransfer(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _from = source.readAddress();
    const _responseDestination = source.readAddress();
    const _forwardTonAmount = source.readBigNumber();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'InternalTransfer' as const, queryId: _queryId, amount: _amount, from: _from, responseDestination: _responseDestination, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

export function storeTupleInternalTransfer(source: InternalTransfer) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.responseDestination);
    builder.writeNumber(source.forwardTonAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserInternalTransfer(): DictionaryValue<InternalTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeInternalTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadInternalTransfer(src.loadRef().beginParse());
        }
    }
}

export type PoolPayout = {
    $$type: 'PoolPayout';
    queryId: bigint;
    amount: bigint;
    destination: Address;
}

export function storePoolPayout(src: PoolPayout) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1369818065, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
    };
}

export function loadPoolPayout(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1369818065) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    return { $$type: 'PoolPayout' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function loadTuplePoolPayout(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'PoolPayout' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function loadGetterTuplePoolPayout(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'PoolPayout' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function storeTuplePoolPayout(source: PoolPayout) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserPoolPayout(): DictionaryValue<PoolPayout> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePoolPayout(src)).endCell());
        },
        parse: (src) => {
            return loadPoolPayout(src.loadRef().beginParse());
        }
    }
}

export type DefiPayout = {
    $$type: 'DefiPayout';
    queryId: bigint;
    amount: bigint;
    destination: Address;
}

export function storeDefiPayout(src: DefiPayout) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3146613905, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
    };
}

export function loadDefiPayout(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3146613905) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _destination = sc_0.loadAddress();
    return { $$type: 'DefiPayout' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function loadTupleDefiPayout(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'DefiPayout' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function loadGetterTupleDefiPayout(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _destination = source.readAddress();
    return { $$type: 'DefiPayout' as const, queryId: _queryId, amount: _amount, destination: _destination };
}

export function storeTupleDefiPayout(source: DefiPayout) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    return builder.build();
}

export function dictValueParserDefiPayout(): DictionaryValue<DefiPayout> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDefiPayout(src)).endCell());
        },
        parse: (src) => {
            return loadDefiPayout(src.loadRef().beginParse());
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
    maxSupply: bigint;
    mintable: boolean;
    owner: Address;
    content: Cell;
    walletCode: Cell;
    reserveBalance: bigint;
    custodyBalance: bigint;
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
    pendingQsrDeposits: Dictionary<Address, bigint>;
    referralEnabled: boolean;
    referralRewardBps: bigint;
    referrals: Dictionary<Address, ReferralInfo>;
    pendingReferralRewards: Dictionary<Address, bigint>;
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
        b_0.storeCoins(src.maxSupply);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.walletCode);
        b_0.storeCoins(src.reserveBalance);
        b_0.storeCoins(src.custodyBalance);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeUint(src.feeBurnShare, 8);
        const b_1 = new Builder();
        b_1.storeAddress(src.treasury);
        b_1.storeCoins(src.totalBurned);
        b_1.storeCoins(src.totalFeesCollected);
        b_1.storeUint(src.maxTxBps, 16);
        b_1.storeUint(src.maxWalletBps, 16);
        b_1.storeUint(src.cooldownSeconds, 16);
        b_1.storeBit(src.tradingEnabled);
        b_1.storeBit(src.buybackEnabled);
        b_1.storeCoins(src.buybackPool);
        b_1.storeCoins(src.buybackThreshold);
        b_1.storeUint(src.buybackCooldown, 32);
        b_1.storeUint(src.buybackBurnPercent, 8);
        const b_2 = new Builder();
        b_2.storeInt(src.lastBuybackTime, 257);
        b_2.storeInt(src.totalBuybacks, 257);
        b_2.storeCoins(src.totalQsrBurnedViaBuyback);
        b_2.storeCoins(src.totalTonSpentOnBuyback);
        const b_3 = new Builder();
        b_3.storeAddress(src.aiOracle);
        b_3.storeBit(src.aiEnabled);
        b_3.storeBit(src.aiFullAutonomy);
        b_3.storeInt(src.lastRebalanceTime, 257);
        b_3.storeInt(src.signalCount, 257);
        b_3.storeDict(src.priceHistory, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_3.storeDict(src.anomalyLog, Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation());
        const b_4 = new Builder();
        b_4.storeInt(src.anomalyIndex, 257);
        b_4.storeUint(src.minConfidence, 8);
        b_4.storeBit(src.emergencyPause);
        b_4.storeUint(src.aiActionCooldown, 32);
        b_4.storeInt(src.lastAiActionTime, 257);
        b_4.storeUint(src.heartbeatTimeout, 32);
        b_4.storeInt(src.lastHeartbeat, 257);
        b_4.storeUint(src.ownerOverrideWindow, 32);
        b_4.storeUint(src.vetoThresholdBps, 16);
        b_4.storeDict(src.aiActionLog, Dictionary.Keys.BigInt(257), dictValueParserAIActionLog());
        const b_5 = new Builder();
        b_5.storeInt(src.aiActionIndex, 257);
        b_5.storeDict(src.pendingAiActions, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_5.storeDict(src.vetoLog, Dictionary.Keys.BigInt(257), dictValueParserVetoState());
        b_5.storeCoins(src.totalVetoStake);
        b_5.storeBit(src.stakingEnabled);
        b_5.storeUint(src.stakingApyBps, 16);
        b_5.storeCoins(src.stakingMinStake);
        b_5.storeUint(src.stakingLockPeriod, 32);
        b_5.storeDict(src.stakers, Dictionary.Keys.Address(), dictValueParserStakeInfo());
        b_5.storeCoins(src.totalStaked);
        b_5.storeCoins(src.stakingRewardsPool);
        const b_6 = new Builder();
        b_6.storeDict(src.pendingQsrDeposits, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_6.storeBit(src.referralEnabled);
        b_6.storeUint(src.referralRewardBps, 16);
        b_6.storeDict(src.referrals, Dictionary.Keys.Address(), dictValueParserReferralInfo());
        b_6.storeDict(src.pendingReferralRewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_6.storeBit(src.vestingEnabled);
        b_6.storeCoins(src.teamAllocation);
        b_6.storeCoins(src.teamClaimed);
        const b_7 = new Builder();
        b_7.storeDict(src.vestingSchedules, Dictionary.Keys.Address(), dictValueParserVestingInfo());
        b_7.storeBit(src.lotteryEnabled);
        b_7.storeCoins(src.lotteryTicketPrice);
        b_7.storeUint(src.lotteryDrawInterval, 32);
        b_7.storeUint(src.lotteryJackpotShare, 8);
        b_7.storeInt(src.lotteryRound, 257);
        b_7.storeInt(src.lotteryLastDraw, 257);
        b_7.storeCoins(src.lotteryJackpot);
        b_7.storeDict(src.lotteryTickets, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        const b_8 = new Builder();
        b_8.storeInt(src.lotteryTicketCount, 257);
        b_8.storeDict(src.lotteryWinners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_8.storeAddress(src.defiAddress);
        b_8.storeUint(src.defiFeeShareBps, 16);
        b_7.storeRef(b_8.endCell());
        b_6.storeRef(b_7.endCell());
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
    const _maxSupply = sc_0.loadCoins();
    const _mintable = sc_0.loadBit();
    const _owner = sc_0.loadAddress();
    const _content = sc_0.loadRef();
    const _walletCode = sc_0.loadRef();
    const _reserveBalance = sc_0.loadCoins();
    const _custodyBalance = sc_0.loadCoins();
    const _feeBps = sc_0.loadUintBig(16);
    const _feeBurnShare = sc_0.loadUintBig(8);
    const sc_1 = sc_0.loadRef().beginParse();
    const _treasury = sc_1.loadAddress();
    const _totalBurned = sc_1.loadCoins();
    const _totalFeesCollected = sc_1.loadCoins();
    const _maxTxBps = sc_1.loadUintBig(16);
    const _maxWalletBps = sc_1.loadUintBig(16);
    const _cooldownSeconds = sc_1.loadUintBig(16);
    const _tradingEnabled = sc_1.loadBit();
    const _buybackEnabled = sc_1.loadBit();
    const _buybackPool = sc_1.loadCoins();
    const _buybackThreshold = sc_1.loadCoins();
    const _buybackCooldown = sc_1.loadUintBig(32);
    const _buybackBurnPercent = sc_1.loadUintBig(8);
    const sc_2 = sc_1.loadRef().beginParse();
    const _lastBuybackTime = sc_2.loadIntBig(257);
    const _totalBuybacks = sc_2.loadIntBig(257);
    const _totalQsrBurnedViaBuyback = sc_2.loadCoins();
    const _totalTonSpentOnBuyback = sc_2.loadCoins();
    const sc_3 = sc_2.loadRef().beginParse();
    const _aiOracle = sc_3.loadAddress();
    const _aiEnabled = sc_3.loadBit();
    const _aiFullAutonomy = sc_3.loadBit();
    const _lastRebalanceTime = sc_3.loadIntBig(257);
    const _signalCount = sc_3.loadIntBig(257);
    const _priceHistory = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_3);
    const _anomalyLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), sc_3);
    const sc_4 = sc_3.loadRef().beginParse();
    const _anomalyIndex = sc_4.loadIntBig(257);
    const _minConfidence = sc_4.loadUintBig(8);
    const _emergencyPause = sc_4.loadBit();
    const _aiActionCooldown = sc_4.loadUintBig(32);
    const _lastAiActionTime = sc_4.loadIntBig(257);
    const _heartbeatTimeout = sc_4.loadUintBig(32);
    const _lastHeartbeat = sc_4.loadIntBig(257);
    const _ownerOverrideWindow = sc_4.loadUintBig(32);
    const _vetoThresholdBps = sc_4.loadUintBig(16);
    const _aiActionLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), sc_4);
    const sc_5 = sc_4.loadRef().beginParse();
    const _aiActionIndex = sc_5.loadIntBig(257);
    const _pendingAiActions = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_5);
    const _vetoLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), sc_5);
    const _totalVetoStake = sc_5.loadCoins();
    const _stakingEnabled = sc_5.loadBit();
    const _stakingApyBps = sc_5.loadUintBig(16);
    const _stakingMinStake = sc_5.loadCoins();
    const _stakingLockPeriod = sc_5.loadUintBig(32);
    const _stakers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserStakeInfo(), sc_5);
    const _totalStaked = sc_5.loadCoins();
    const _stakingRewardsPool = sc_5.loadCoins();
    const sc_6 = sc_5.loadRef().beginParse();
    const _pendingQsrDeposits = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_6);
    const _referralEnabled = sc_6.loadBit();
    const _referralRewardBps = sc_6.loadUintBig(16);
    const _referrals = Dictionary.load(Dictionary.Keys.Address(), dictValueParserReferralInfo(), sc_6);
    const _pendingReferralRewards = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_6);
    const _vestingEnabled = sc_6.loadBit();
    const _teamAllocation = sc_6.loadCoins();
    const _teamClaimed = sc_6.loadCoins();
    const sc_7 = sc_6.loadRef().beginParse();
    const _vestingSchedules = Dictionary.load(Dictionary.Keys.Address(), dictValueParserVestingInfo(), sc_7);
    const _lotteryEnabled = sc_7.loadBit();
    const _lotteryTicketPrice = sc_7.loadCoins();
    const _lotteryDrawInterval = sc_7.loadUintBig(32);
    const _lotteryJackpotShare = sc_7.loadUintBig(8);
    const _lotteryRound = sc_7.loadIntBig(257);
    const _lotteryLastDraw = sc_7.loadIntBig(257);
    const _lotteryJackpot = sc_7.loadCoins();
    const _lotteryTickets = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_7);
    const sc_8 = sc_7.loadRef().beginParse();
    const _lotteryTicketCount = sc_8.loadIntBig(257);
    const _lotteryWinners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_8);
    const _defiAddress = sc_8.loadAddress();
    const _defiFeeShareBps = sc_8.loadUintBig(16);
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, maxSupply: _maxSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, custodyBalance: _custodyBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, pendingReferralRewards: _pendingReferralRewards, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _maxSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _owner = source.readAddress();
    const _content = source.readCell();
    const _walletCode = source.readCell();
    const _reserveBalance = source.readBigNumber();
    const _custodyBalance = source.readBigNumber();
    const _feeBps = source.readBigNumber();
    const _feeBurnShare = source.readBigNumber();
    const _treasury = source.readAddress();
    const _totalBurned = source.readBigNumber();
    const _totalFeesCollected = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
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
    const _pendingQsrDeposits = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _referralEnabled = source.readBoolean();
    source = source.readTuple();
    const _referralRewardBps = source.readBigNumber();
    const _referrals = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferralInfo(), source.readCellOpt());
    const _pendingReferralRewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
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
    source = source.readTuple();
    const _lotteryTickets = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _lotteryTicketCount = source.readBigNumber();
    const _lotteryWinners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _defiAddress = source.readAddress();
    const _defiFeeShareBps = source.readBigNumber();
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, maxSupply: _maxSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, custodyBalance: _custodyBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, pendingReferralRewards: _pendingReferralRewards, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadGetterTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _maxSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _owner = source.readAddress();
    const _content = source.readCell();
    const _walletCode = source.readCell();
    const _reserveBalance = source.readBigNumber();
    const _custodyBalance = source.readBigNumber();
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
    const _pendingQsrDeposits = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _referralEnabled = source.readBoolean();
    const _referralRewardBps = source.readBigNumber();
    const _referrals = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferralInfo(), source.readCellOpt());
    const _pendingReferralRewards = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
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
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, maxSupply: _maxSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, custodyBalance: _custodyBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, pendingReferralRewards: _pendingReferralRewards, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function storeTupleQuasarMaster$Data(source: QuasarMaster$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeNumber(source.maxSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeCell(source.walletCode);
    builder.writeNumber(source.reserveBalance);
    builder.writeNumber(source.custodyBalance);
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
    builder.writeCell(source.pendingQsrDeposits.size > 0 ? beginCell().storeDictDirect(source.pendingQsrDeposits, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeBoolean(source.referralEnabled);
    builder.writeNumber(source.referralRewardBps);
    builder.writeCell(source.referrals.size > 0 ? beginCell().storeDictDirect(source.referrals, Dictionary.Keys.Address(), dictValueParserReferralInfo()).endCell() : null);
    builder.writeCell(source.pendingReferralRewards.size > 0 ? beginCell().storeDictDirect(source.pendingReferralRewards, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
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
    const __code = Cell.fromHex('b5ee9c724202021d00010000d1010000022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d90001007b02027100020040020120000300230201200004000f0201200005000a03fbb2d93b513434800063a2fe903535154800f45636cf38c344528452c4528452445284524452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44ea0007c0081000601fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125000701fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110000801600f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1206e92306d99206ef2d0806f296f09e2206e92306dde0009009481010156220259f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e203fbb3f5fb513434800063a2fe903535154800f45636cf38c344528452c4528452445284524452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44ea0007c0081000b01fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125000c01fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110000d01340f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1000e002e81010120562e50334133f40c6fa19401d70030925b6de20201580010001802012000110013034aa964ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6ce76ce76ce76ce76ce76c57007c00810012000e547ba9547ba92b03faa90aed44d0d200018e8bfa40d4d4552003d158db3ce30d114a114b114a1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a007c0081001401fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125001501fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110001601600f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1206e92306d99206ef2d0806f256f05e2206e92306dde0017007c81010b2e0259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e2020378a00019001e03f9b19da89a1a400031d17f481a9a8aa4007a2b1b679c61a229422962294229222942292229022922290228e2290228e228c228e228c228a228c228a2288228a2288228622882286228422862284228222842282228022822280227e2280227e227c227e227c227a227c227a2278227a22782276227822762274227622750007c0081001a01fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125001b01fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110001c01340f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1001d004881010b5616028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e203f9b0dda89a1a400031d17f481a9a8aa4007a2b1b679c61a229422962294229222942292229022922290228e2290228e228c228e228c228a228c228a2288228a2288228622882286228422862284228222842282228022822280227e2280227e227c227e227c227a227c227a2278227a22782276227822762274227622750007c0081001f01fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125002001fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110002101340f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb10022004881010b5612028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e20201200024002f0201480025002a020120002600280356abeded44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6cb1007c008100270004563a0352ab06ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6c996c996c996c996c996c996c996cc9007c008100290024562e5627562756275627562756275623562703fbaf4e76a268690000c745fd206a6a2a9001e8ac6d9e718688a508a588a508a488a508a488a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d40007c0081002b01fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125002c01fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110002d01340f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1002e001c810101240259f40c6fa192306ddf02012000300038020120003100330357ad75f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e36443644364436443644364436443644365c40007c00810032002a80645642a15643015643015640564056405645564503fbadc176a268690000c745fd206a6a2a9001e8ac6d9e718688a508a588a508a488a508a488a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d40007c0081003401fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125003501fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110003601600f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1206e92306d99206ef2d0806f236f03e2206e92306dde0037005481010b56130259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e20201620039003b0355a665da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed963007c0081003a00045644020120003c003e0355a053b513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db2c6007c0081003d000456490355a1ebb513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db2c6007c0081003f00045627020120004100520201200042004d0201580043004b020166004400460355a30fb513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db2c6007c0081004500022003f9a1e7b513434800063a2fe903535154800f45636cf38c344528452c4528452445284524452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44ea007c0081004701fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125004801fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110004901340f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1004a0162f828db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d001cf0347af16f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab67ac0007c0081004c0014564a564956495649564902016a004e00500356a9d9ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6cb1007c0081004f000456430356ab14ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6cb1007c008100510104db3c020c020120005300610201200054005903fbb206fb513434800063a2fe903535154800f45636cf38c344528452c4528452445284524452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44ea0007c0081005501fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125005601fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110005701340f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb100580104db3c01bd020120005a005c0353afdcf6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e364cb64cb64cb64cb64cb64cb64cb664c0007c0081005b002456395639563956395639563956395639563903fbaebc76a268690000c745fd206a6a2a9001e8ac6d9e718688a508a588a508a488a508a488a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d40007c0081005d01fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125005e01fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110005f01600f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1206e92306d99206ef2d0806f256f05e2206e92306dde00600078810101561f0259f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e20201200062006a020120006300650357aff376a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e2b882f87ab882f87ab882f87ab882f87b658c0007c0081006400022103fbac67f6a268690000c745fd206a6a2a9001e8ac6d9e718688a508a588a508a488a508a488a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d40007c0081006601fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125006701fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110006801600f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1206e92306d99206ef2d0806f246f04e2206e92306dde0069005c810101562c0259f40d6fa192306ddf206e92306d8e17d0810101d700d401d001810101d700d20055306c146f04e2020120006b0079020166006c0074034da3cbb513434800063a2fe903535154800f45636cf38c376cf1b2a9b2a9b2a9b2a9b2a9b2a9b3ea007c0081006d01f056305630563056305630564756325630562b114a1153114a1149115211491148115111481147115011471146114f11461145114e11451144114d11441143114c11431142114b1142114111531141114011521140113f1151113f113e1150113e113d114f113d113c114e113c113b114d113b113a114c113a006e01fc1139114b11391138115311381137115211371136115111361135115011351134114f11341133114e11331132114d11321131114c11311130114b1130112f1153112f112e1152112e112d1151112d112c1150112c112b114f112b112a114e112a1129114d11291128114c11281127114b1127112611531126112511521125006f01fc1124115111241123115011231122114f11221121114e11211120114d1120111f114c111f111e114b111e111d1153111d111c1152111c111b1151111b111a1150111a1119114f11191118114e11181117114d11171116114c11161115114b11151114115311141113115211131112115111121111115011111110114f1110007002f80f114e0f0e114d0e0d114c0d0c114b0c0b11530b0a11520a091151090811500807114f0706114e0605114d0504114c0403114b0302115302011152011151db3c091151090811500807114f0706114e0605114d0504114c04031154030211530201115201114b1154114b114a1153114a114911521149114811511148020c007101fc1147115011471146114f11461145114e11451144114d11441143114c11431142114b11421141114a1141114011491140113f1148113f113e1147113e113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c1133007201fc1132113b11321131113a1131113011391130112f1138112f112e1137112e112d1136112d112c1135112c112b1134112b112a1133112a1129113211291128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e007300d8111d1126111d111c1125111c111b1124111b111a1123111a1119112211191118112111181117112011171116111f11161115111e11151114111d11141113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a03f9a10fb513434800063a2fe903535154800f45636cf38c344528452c4528452445284524452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44ea007c0081007501fc1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125007601fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110007701600f11100f550edb3c57105f0f57105f0f57105f0f57105f0f6cb1206e92306d99206ef2d0806f246f04e2206e92306dde0078006e81010b56190259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e20347adbff6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab67ac0007c0081007a0014561b561b561b561b561a04c2eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e8bfa40d4d4552003d158db3ce30d114c8ea6114a8020d7217021d749c21f9430d31f01de821051a5c3d1bae3025f0f5f0f5f0f5f0f5f0f30e0564ad749c21f007c00810086008a01f66d6d6d6d6d6d6d6d6d6d6d6d7082300de0b6b3a76400007f56115333801e803256165333806481012c757f7f258212540be400810e1054772253007070547222804b70815460238208093a80f823820151808103e853447f8107d08218174876e8008208278d0053447f561a7f53337f82103b9aca005610562d71007d01f8f82353668d0860000000000000000000000000000000000000000000000000000000000000000004113a1149113a1139114811391138114711381137114611371139114511391138114411381136114311361135114211351134114111341133114011331132113f11321131113e11311130113d1130112f113c112f007e01fc112e113b112e112d113a112d112c1139112c112b1138112b112a1137112a112911361129112811351128112711341127112611331126112511321125112411311124112311301123112d112f112d1122112e11221121112d11211120112c1120111f112b111f112011291120111e1128111e111d1127111d111c1126111c007f01fc111b1125111b111a1124111a1119112311191118112211181117112111171116112011161115111e11151116111d11161115111c11151114111b11141113111a11131112111911121111111811111110111711100f11150f0e11140e0f11130f0d11120d0c11110c0e11100e10be10ad5e29108a107910681057104610350080000c4140138101f402f8db3c574b1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a11391138113911381137113811371136113711360082008401f6fa00fa00d200fa40d4d401d0d4fa00fa00d30fd307fa40fa00fa00d30fd30fd30fd200d200fa00d430d0fa00d31fd307810101d700810101d700fa00fa00d430d0fa40d200d200810101d700810101d700f404f404d430d0810101d700d307d200d31f810101d700d31f810101d700d31fd30ff404d430d0810101008300e2d700f404f404fa00d200d30ffa00d31ff404fa00fa00d430d0f404d200d30ff404f404d200fa00fa00d430d0f404d200fa00d31fd307810101d700810101d700fa00f404d430d0810101d700f404fa40d30f301146114b11461146114a114611461149114611461148114611461147114601fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121008500d8112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01f4d33ffa00596c2101114201a01148114a11481147114911471146114811461145114711451144114611441143114511431142114411421143114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136008701fc113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121008801fc112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106800890116105710461035440302db3c021804ece300114af9012082f07f309c3a7adc967de7844945367788045b18adf5557c5bf60508ec7c231da6debae3022082f0939b8f50a89494d7788bca14d37ccb5365057f81e805b401d1ab446c0d80a3fabae3022082f040391f4eaad79adb418bdfd49edad3b17b5e392ce4fafbbf82f21f2055ee0f7dba008b0203020602100454114ad31f218210642b7d07bae3022182107bdd97debae3022182107362d09cbae302218210eb527edfba008c0093009b00a004fe31fa00fa403001114b01114cdb3c8142a6564cc200f2f481540c8d0860000000000000000000000000000000000000000000000000000000000000000004564e01c705b3f2f4db3cdb3c8134a65649f2f4564a563ea8812710a904564bc2009a564c82009db402bbf2f49130e2812fd1564b564da0564bbbf2f4114a564ba00107008d0217008e00108200dfcc563bf2f402f8114a564c564c70db3cf84270114d8040114fc85982103345ab925003cb1f810101cf00cec91302114d0201114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001148114a1148114711491147114611481146114511471145008f00900108f828db3c01ce01fc114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130009101fc112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b009201a4111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3cdb31021804e431d33f31fa00fa40fa40308142a623c200f2f482009d8623564dbbf2f4f8285220db3c81287bf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4114b22a189564c01c705b392574be30df8427003804003c801cf0094009500970043800000000000000000000000000000000000000000000000000000000000000000100180707080408804114f04146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0000960026000000004578636573732072657475726e656401f4598210d28b2faf5003cb1f810101cf00cec943305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141009801fc114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c009901fc112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117009a01701116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3cdb31021802fa31d33f31fa00fa40308142a622c200f2f4f828f828db3c8130cdf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4561481010b228101014133f40a6fa19401d70030925b6de281010b216e9231229801206ef2d08023a0e2031116031201cf009c01fc810101216e955b59f4593098c801cf004133f441e2011142011113a01148114a11481147114911471146114811461145114711451144114611441143114511431142114411421143114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138009d01fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123009e01fc112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce009f013210bd10ac109b108a10791068105710461035440302db3cdb310218043ce302218210cfe1fd3cbae302218210bef0e904bae302218210ff633be1ba00a100c000c400d302fe31d33ffa00fa40308142a622c200f2f4f8285210db3c812e3cf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4113f21a0114521a0215643a88064a9045320a15121a122a70f8064a90423a70f8064a90424a70a8064a904255653a881271001cf00a204f2a9045163a122a121a126a125c2009c115125a1114625a011461151de23c2009256409170e294113f23a09923c2009223a0de113fe222c2009256129170e29351c2a09c22c20096113f22a0113fde0ce221c2009256229170e294111c21a09d21c20096113f21a0113fde111ce226c2009170e30de30f70561400a300a400aa00ad00548d0860000000000000000000000000000000000000000000000000000000000000000004565301c705b301f8114a1151114a1149115011491148114f11481147114e11471146114d11461145114c1145041144041143115111431142115011421141114f11411140114e1140113f114d113f113e114b113e04113d04113c1151113c113b1150113b113a114f113a1139114e11390c11380c1137114b11370411360411351151113500a501fc1134115011341133114f11331132114e11320c11310c1130114b113004112f04112e1151112e112d1150112d112c114f112c112b114e112b0c112a0c1129114b1129041128041127115111271126115011261125114f11251124114e11240c11230c1122114b112204112104112011511120111f1150111f111e114f111e00a601fc111d114e111d0c111c0c111b114b111b04111a041119115111191118115011181117114f11171116114e111611151114114b1114041113041112115111121111115011111110114f11100f114e0f0e0d114b0d104c0b11510b0a11500a09114f0908114e080706114b061045041151040311500302114f0201115201115300a7010c564b564fdb3c00a802f48200edef22c200f2f482008ec98d08600000000000000000000000000000000000000000000000000000000000000000045250c705b3f2f48200e184564723bef2f4114621a1f8285240db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d001cf00a900e88209312d007f71f828f82882089896808b0805115005104bc855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec9465004114b04401301114b011036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001fa26c20096113f26a0113fde0711530701115201051151050311500302114f0208114e08113f114d113f1145114c114506114b0605114a05031149030211480208114708113f1146113f041144040511430503114203021141020811400806113e0604113d0405113c0503113b0302113a02081139080c11380c0611370600ab01f804113604051135050311340302113302081132080c11310c0611300604112f0405112e0503112d0302112c0208112b080c112a0c0611290604112804051127050311260302112502081124080c11230c06112206041121040511200503111f0302111e0208111d080c111c0c06111b0604111a04051119050311180300ac005a021117020811160811150611140604111304051112050311110302111002108f0e106d104c105b103a4917104504c48ecc561281010b564f59f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e9956555615a8812710a90420c20094565021be9170e2915be30d9130e2de564ec2009170e30de3002c9456542cbe9170e200ae00b100b200b702fe3221115022a101206ef2d0806f235b561481010b2259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e35206ef2d0806f2381010b5126a04300c855205023ce810101cf00810101cf00c902111602561601206e953059f45930944133f413e2e30e561381010b561681010100af00b000a03081010b8d08600000000000000000000000000000000000000000000000000000000000000000042470c855205023ce810101cf00810101cf00c902111602561601206e953059f45930944133f413e2008c4133f40a6fa19401d70030925b6de281010b216e91319a01206ef2d0805004a003e20311140302011115011114810101216e955b59f4593098c801cf004133f441e21111114e00548d0860000000000000000000000000000000000000000000000000000000000000000004564201c705b301fc114a114b114a1149114b11491148114b11481147114b11471146114b11461145114b11451144114b11441143114b11431142114b11421141114b1141564b11411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112200b302fc11211120111f111e111d111c111b111a111911181117111611151114111311121111111055e0114c564f56515650db3c114a114b114a1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e01cd00b401fc113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112900b501fc112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111511141115111400b6003c1113111411131112111311121111111211111110111111100f11100f550e03ea8e1a158101015252114f206e953059f45a30944133f414e203a4030492574de256399556385638be9170e298f8235635a15637be9170e28e84564edb3cde2b96f82327a12abe9170e29323c2009170e292574ee30df84205115305041151040311500302114f0201115201114c70114e8040114dc8019000b800bc01fc114a114b114a1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113600b901fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112100ba02fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e114edb3c114d114a11491148114711461145011f00bb00d811441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e001fe55708210c47b97305009cb1f17810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc90311470302114802011146015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f40000bd01f8c901fb001141114a1141114011491140113f1148113f113e1147113e113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f112e1137112e00be01fc112d1136112d112c1135112c112b1134112b112a1133112a1129113211291128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a11191122111900bf01de1118112111181117112011171116111f11161115111e11151114111d11141113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a091112090811110807111007106f105e104d103c4ba95e341036451403db3cdb31021801fa31d33f3081632e5639f2f4817c2a56385638bef2f48200da29f8235635a15637bef2f41149114b11491148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b00c101fc113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112600c201fc112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a111811171119111711161118111611151117111511141116111411131115111311121114111211111113111100c302581110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430db3cdb3cdb310190021801f831fa00301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113600c501fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112100c601fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105600c702ca10451034114b4130db3c8200aac7561cf2f48142a6564cc200f2f481662c564c561bbef2f481010bf8425616598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d080564ebe9170e2f2f4f842561981010b2259f40b6fa192306ddf010700c801f8206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e270f823561da0226eb38e165b20206ef2d0806f245f0301206ef2d0806f246c31019132e2114a114e114a1149114d11491148114c11481147114b11471146114e11461145114d11451144114c11441143114b114300c901fc1142114e11421141114d11411140114c1140113f114b113f113e114e113e113d114d113d113c114c113c113b114b113b113a114e113a1139114d11391138114c11381137114b11371136114e11361135114d11351134114c11341133114b11331132114e11321131114d11311130114c1130112f114b112f112e114e112e00ca01fc112d114d112d112c114c112c112b114b112b112a114e112a1129114d11291128114c11281127114b11271126114e11261125114d11251124114c11241123114b11231122114e11221121114d11211120114c1120111f114b111f111e114e111e111d114d111d111c114c111c111b114b111b111a114e111a1119114d111900cb04fa1118114c11181117114b11171116114e11161115114d11151114114c11141113114b11131112114e11121111114d11111110114c11100f114b0f0e114e0e0d114d0d0c114c0c0b114b0b0a114e0a09114d0908114c0807114b0706114e0605114d0504114c0403114b0302114e0201114d01114c564edb3c20c200e30f00e900cc00cd00ce0008561621be00027002fa8e9211165616a170f8280211180256515520db3c9130e281010b114d5650a0f823f82355021150c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211170201114c01564e01206e953059f45930944133f413e21114564da081010b114a206ef2d080564ea10211130201114a01564d0181010101cd00cf01fe216e955b59f4593098c801cf004133f441e2f84270114d8040114fc8598210acd731a75003cb1fce810101cf00c91302114d0201114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001145114a114511441149114411431148114300d001fc114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e00d101fc112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c11271126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e111900d201c81118111d11181117111c11171116111b11161115111a11151114111911141113111811131111111711111114111611141110111511101111111411110e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a1049103847154363db3cdb31021802fe8efc31fa00301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136e000d400e401fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112100d501fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105600d602fc10451034114b4130db3c8142a6564cc200f2f4f842561881010b2259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2816dd3216eb3f2f48152fd21206ef2d0806f245f03564fbef2f4816283f82322206ef2d0806f246c31bef2f4114a114c114a010700d701fc1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c11381137114b11371136114c11361135114b113500d801fc1134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b11231122114c11221121114b11211120114c112000d901f8111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d0c114c0c0b114b0b0a114c0a09114b0900da03b208114c0807114b0706114c0605114b0504114c0403114b0302114c0201114b01114c564bdb3c20c20094561621be9170e28e9211165616a170f82802111802564e5520db3c9130e2564c206ef2d0806f245f03564ea120c20000e901cd00db02fc8e4b30574c81010b6dc8216e925b6d8e2601206ef2d0806f24550355305034810101cf00810101cf00810101cf0001c8810101cf00cdc9e202111802564c01206e953059f45930944133f413e2e30d1115564ca11149114a114911481149114811471148114711461147114611451146114511441145114411431144114300dc00dd00b081010b564e206ef2d0806f2410235f03f8231150206ef2d0806f246c311201115001c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211180201114d01564c01206e953059f45930944133f413e201fc114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e00de01fc112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111900df02fe11181119111811171118111711151117111511161114111511141113111411131112111311121111111211111110111111100f11100f550e114b564b564d70db3cf84270114d8040114fc85982108445bc055003cb1fce810101cf00c91302114d0201114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c011500e001fa6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b113900e101fc1138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112400e201f8112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f00e301180e11100e10df551cdb3cdb310218044c218210094a1f7cbae30221821013bd6b32bae302218210d3b50b23bae3022182101ab0a142ba00e500ef00f600ff01f65bf8421149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113600e601fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112100e701fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105600e803fc10451034114b4130564bdb3c8200e1b821c200f2f482009c88561722bef2f411165616a1561881010b564e59f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206eb39130e30d70f828114d114e114d114c114d114c114b114c114b114a114b114a00e900ea00eb00de81010b56190259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206e923070e0f82321206ef2d0806f24135f03a101206ef2d0806f245f03561ca8812710a90401a88209e13380a904205617bc93305615de00b881010b21206ef2d0806f245f0322206ef2d0806f2410235f03f82304206ef2d0806f246c31413014c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc902111a02564e01206e953059f45930944133f413e2111801fc1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113500ec01fc113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112111201121112000ed02fc111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119021119021117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510341023db3c01cd00ee0108db3cdb31021801f831d200d30ffa00d31f30114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c113800f001fc1137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b112300f101fc1122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d00f202fc0c114c0c0b114b0b0a114c0a09114b0908114c0807114b0706114c0605114b0504114c0403114b0302114c0201114d01114edb3c571857185718571881646d562bb3f2f48200e1415649812710bb94564ac2009170e294564bc2009170e2f2f41146114a1146114511491145114411481144114311471143114211461142021700f301fc114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d00f401fc112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c111800f501681118111a11181113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c553bdb3cdb31021801f831fa40301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113600f701fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112100f801fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105600f902fe10451034114b4130db3c8200abfb5614f2f481104df842564d01c705b3f2f481010bf84256135959f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e281526d016ef2f481010bf8427020564f59c855205023ce810101cf00810101cf00c903111403206e953059f45930944133f413e2010700fa01fe2081010b564d59f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e4581010b21206ef2d0806f235b22206ef2d0806f23303103206ef2d0806f236c21a44130c855205023ce810101cf00810101cf00c9564d01206e953059f45930944133f413e29130e2f842708040f8420100fb01fa114fc859821028db358b5003cb1fcecec9413001114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001149114a114911481149114811471148114711461147114611451146114511441145114411431144114311421143114200fc01fc114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d00fd01fc112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111800fe01681117111811171116111711161115111611151114111511141113111411131112111311121111111211110f11100f550edb3cdb31021803fc8f7a31d200d30f3001114b01114cdb3c5712571281646d562db3f2f48200ba97564b812710bbf2f41148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113be02102170100010301fc113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126010101f8112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411120f11110f010201140e11100e551ddb3cdb310218044a8210be1052b1bae302218210ea3f3bddbae302218210f789340abae302218210ab78b3cfba010401090112011b01fe5b1148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134010501fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f010602e2111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3cf842561181010b228101010107010800128200e8415628b3f2f402a04133f40a6fa19401d70030925b6de282009aa3216eb39821206ef2d080c2009170e2f2f4111281010b2270810101216e955b59f4593098c801cf004133f441e21112206ef2d08070f828db3cdb3cdb3101cd021801f831fa40fa00d31fd31f30114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c1138010a01fc1137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b1123010b01fc1122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d010c02c40c114c0c0b114b0b0a114c0a09114b0908114c0807114b0706114c0605114b0504114c0403114b0302114c0201114d01114edb3c8200b0f0564dc20094564fc2009170e295564e5650bb9170e2f2f48200a0862d81010b564e59f40b6fa192306ddf0217010d01e6206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e26ef2f481010bf8425616598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d080564fbe9170e2f2f481010b70f82356504134011152011153c8010e01f855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc9103d02114e0201114c01206e953059f45930944133f413e20c564aa081010bf842114e206ef2d08001114ca10311130302114b0201114d01810101216e955b59f4593098c801cf004133f441e21146114a1146114511491145010f01fc114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130011001fc112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b011101c8111a111e111a1119111d11191118111c11181117111b11171116111a111611151119111511141118111411131117111311121116111211111115111111140f11130f0e11120e0d11110d0c11100c10bf5e39107b106a10591048103746504413db3cdb31021801f45bf8422b81010b2259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e2817625216eb3f2f48200cd11f82322206ef2d0806f2510245f0423206ef2d0806f25145f04a0bef2f4f82321206ef2d0806f2510245f04a121011301f4206ef2d0806f256c415210bc9b3020206ef2d0806f256c41de21206ef2d0806f255f0401a821206ef2d0806f256c41a90421206ef2d0806f2510345f04a18200aeff21c200f2f481010b22206ef2d0806f255f0423206ef2d0806f2510345f0423a024206ef2d0806f2510245f0425206ef2d0806f25145f0406011402f6206ef2d0806f256c411034413016c855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc94ee05230206e953059f45930944133f413e251dca00d0c01114b01114c564b564d70db3cf84270114d8040114fc85982103764fe765003cb1fce810101cf00c91302114d0201114e010115011702f48200f9b222c200f2f4813bf9564723bef2f4114621a1f828f828db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d070114a7f06804008c85520821051a5c3d15004cb1f12cb3f01fa02cec91605114a0504114a045a1036453304c8cf858001cf01160058ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001fc5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d011801fc113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128011901fc112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114111311151113011a01441112111411121111111311111110111211100f11110f0e11100e10df551cdb3cdb31021802fe8efd31d33f308200b2252bf2f422c200f2e5918200a564f82327a12abef2f41149114b11491148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a011c012801fc1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125011d01fc112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114111311151113111211141112111111131111111011121110011e024c0f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430db3cdb3cdb31011f021802dc249130e1f8446e97f825f8157ff864def81025a908810101270259f40c6fa192306ddf206e915be0537aa88064a9045188a128c20095103937355be30d81010123206ef2d08028103401206e953059f45a30944133f414e206a4f8236d70f84221804026a509206ef2d080490bc80120012701f421206ef2d080f828114d114f114d114c114e114c114b114f114b114a114e114a1149114f11491148114e11481147114f11471146114e11461145114f11451144114e11441143114f11431142114e11421141114f11411140114e1140113f114f113f113e114e113e113d114f113d113c114e113c113b114f113b012101fc113a114e113a1139114f11391138114e11381137114f11371136114e11361135114f11351134114e11341133114f11331132114e11321131114f11311130114e1130112f114f112f112e114e112e112d114f112d112c114e112c112b114f112b112a114e112a1129114f11291128114e11281127114f11271126114e1126012201fc1125114f11251124114e11241123114f11231122114e11221121114f11211120114e1120111f114f111f111e114e111e111d114f111d111c114e111c111b114f111b111a114e111a1119114f11191118114e11181117114f11171116114e11161115114f11151114114e11141113114f11131112114e11121111114f1111012302fe1110114e11100f114f0f0e114e0e0d114f0d0c114e0c0b114f0b0a114e0a09114f09102807114f07102605114f05102403114f0312564e59db3c333334114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d01cd012401fc113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128012501fc112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114111311151113012600641112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710464515503300ae5520821056bbaafa5004cb1f12810101cf00ce810101cf00c94730195a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb005076104512044ee02182101ba0fefabae302218210c61e9667bae3022182108f9872bdbae302218210f5708ab5ba012901300136013a01f831d200fa00d31fd30730114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c1138012a01fc1137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b1123012b01fc1122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d012c02f40c114c0c0b114b0b0a114c0a09114b0908114c0807114b0706114c0605114b0504114c0403114b0302114c0201114d01114edb3c3838383881646d562bb3f2f482008d7e5649c20094564ac2009170e294564bc2009170e294564bc1659170e2f2f41146114a11461145114911451144114811441143114711430217012d01fc114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e012e01fc112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d1119012f01ac1118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c108a5533db3cdb31021801f831d200301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136013101fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121013201fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056013302fe10451034114b4130db3c572e564a937f572fde1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a11391138113911380217013401fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122013501ec112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb31021801f85b57218109def842562fc705f2f4f8231148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137013701fc113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122013801fc1123112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10790139011e1068105710461035440302db3cdb31021802fe8efd31d33f31d200d307d430d0114a114b114a1149114b11491148114b11481147114b11471146114b11461145114b11451144114b11441143114b11431142114b11421141114b11411140114b1140113f114b113f113e114b113e113d114b113d113c114b113c113b114b113b113a114b113a1139114b11391138114b1138013b014301fc1137114b11371136114b11361135114b11351134114b11341133114b11331132114b11321131114b11311130114b1130112f114b112f112e114b112e112d114b112d112c114b112c112b114b112b112a114b112a1129114b11291128114b11281127114b11271126114b11261125114b11251124114b11241123114b1123013c01fc1122114b11221121114b11211120114b1120111f114b111f111e114b111e111d114b111d111c114b111c111b114b111b111a114b111a1119114b11191118114b11181117114b11171116114b11161115114b11151114114b11141113114b11131112114b11121111114b11111110114b11100f114b0f0e114b0e0d114b0d013d02f80c114b0c0b114b0b0a114b0a09114b0908114b0807114b0706114b0605114b0504114b0403114b0302114b0201114c01114ddb3c5727573956498e177f70114cc0039f5740574070574680641140805a1140de9f574a8200cf12562cf2f4707f114b01e28be456d657267656e63795061757365870564c91719120e201a2013e01fc114c114e114c114b114d114b114a114c114a1149114b11491148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113b113d113b113a113c113a1139113b11391138113a1138113711391137013f01f8113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a03112b031128112a1128112711291127112611281126112511271125112411261124112311251123112211241122014001fc112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b014103fe108a107910681057104610455502114fdb3cf8427080408be456d657267656e63795061757365822115191719122e210351201115101c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818a017f0182014201fee2f400c901fb001149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a11391138113911381137113811371136113711360160044ee021821017df7398bae30221821079b9e4c3bae30221821010f7c0f7bae3022182100952917dba0144014a014f015704fc31d33f31d30fd430d001114b01114cdb3cdb3c817020564cc01ef2f4564b8b6536574466565801114420564e011150db3cf8427080408b65365744665658103402011151011150c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91302114d0201114e015a6d6d40037fc8cf8580ca0001a201a3017f014502fc89cf16ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b0146014700011001fc113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126014801fc112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311110149012c1110111211100f11110f0e11100e10df551cdb3cdb31021803f831d33f31fa40d430d001114b01114cdb3cdb3c57408200e20f8d0860000000000000000000000000000000000000000000000000000000000000000004564c01c705b3f2f48bb53657454726561737572798114a114c114a1149114b11491148114a114811471149114711461148114611451147114511441146114401a201a3014b01fc114311451143114211441142114111431141114111421141113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f014c01fc112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a014d02f41119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544007050047101db3cf8427080408bb5365745472656173757279854140271c8017f014e01ba553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00db3cdb31021801fe31d33f31d30fd30fd30fd430d0114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c1138015001fc1137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b1123015101fc1122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d015203fe0c114c0c0b114b0b0a114c0a09114b0908114c0807114b0706114c0605114b0504114c0403114b0302114c0201114d01114edb3cdb3c573b573b573b81691c5649c06496564a81012cba9170e294564bc0059170e2f2f456488bc536574416e74695768616c6581149114c11491148114b11481147114a114711461149114601a201a3015301f4114511481145114411471144114311461143114211451142114111441141114011431140113f1142113f113e1141113e113d1140113d01113f0101113e011139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130015401fc112f1132112f112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1129112c11291128112b11281127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111c111f111c111b111e111b015503f4111a111d111a1119111c11191118111b11181117111a11171116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a10691058104710365e224300705110114fdb3cf84270804089221035581151c8017f015601670018536574416e74695768616c6502fe8efb31d33f31d200fa00d31fd307d430d0114a114d114a1149114c11491148114b11481147114d11471146114c11461145114b11451144114d11441143114c11431142114b11421141114d11411140114c1140113f114b113f113e114d113e113d114c113d113c114b113c113b114d113b113a114c113a1139114b1139e0210158016201fc1138114d11381137114c11371136114b11361135114d11351134114c11341133114b11331132114d11321131114c11311130114b1130112f114d112f112e114c112e112d114b112d112c114d112c112b114c112b112a114b112a1129114d11291128114c11281127114b11271126114d11261125114c11251124114b1124015901f81123114d11231122114c11221121114b11211120114d1120111f114c111f111e114b111e111d114d111d111c114c111c111b114b111b111a114d111a1119114c11191118114b11181117114d11171116114c11161115114b11151114114d11141113114c11131112114b11121111114d11111110114c11100f114b0f015a03fa0e114d0e0d114c0d0c114b0c0b114d0b0a114c0a09114b0908114d0807114c0706114b0605114d0504114c0403114b0302114d0201114e01114fdb3cdb3c5735573557355736814b505648c20094564ac2009170e294564bc2009170e294564bc1659170e2f2f456488ba5365744275796261636b870564b91719120e201a201a3015b01fc114a114e114a1149114d11491148114c11481147114b11471146114a1146114511491145114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a03113d031138113c113803113a0303113903113411381134015c01fc113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f015d01fc111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c107b106a1059104810371036015e02fe10355503114fdb3cf8427080408ba5365744275796261636b822115191719122e210351201115101c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2017f015f01fcf400c901fb001149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136016001fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121016101e0112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb310218044a82100490d605bae3022182102fb11c16bae3022182102a297933bae3022182102882f1e8ba0163016b0170017703f831d33f31d200d430d001114b01114cdb3cdb3c573a564a8bd546f67676c6554726164696e67870564d91719120e2114d114e114d114c114d114c114b114c114b114a114b114a1149114a114911481149114811471148114711461147114611451146114511441145114411431144114311421143114211411142114101a201a3016401f8114011411140113f1140113f113e113f113e03113e03113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c016501fc112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117016602dc1116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610455502114fdb3cf8427080408bd546f67676c6554726164696e67822115191719122e210351201115101c8017f016701f4553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001149114a1149114811491148114711481147114611471146114511461145016801fc114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130016901fc112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b016a0198111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb31021803f831d33f31fa40d430d001114b01114cdb3cdb3c57308200cf12562ef2f48d0860000000000000000000000000000000000000000000000000000000000000000004564b01c705b3f2e4cc8bc526f746174654f7261636c658114a114c114a1149114b11491148114a114811471149114711461148114611451147114501a201a3016c01fc114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113111321131016d01fc112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b016e02fe111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544007050047101db3cf8427080408bc526f746174654f7261636c658541402017f016f01be71c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00db3cdb31021801f831fa40301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136017101fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121017201fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056017302fa10451034114b4130db3c572f572f8d0860000000000000000000000000000000000000000000000000000000000000000004564a01c705b3f2e4cc114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e0217017401f6113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f7f112f112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129017501fc112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114017601441113111411131112111311121111111211111110111111100f11100f550edb3cdb31021802fe8efd31d33f31d30fd307d430d0114a114b114a1149114b11491148114b11481147114b11471146114b11461145114b11451144114b11441143114b11431142114b11421141114b11411140114b1140113f114b113f113e114b113e113d114b113d113c114b113c113b114b113b113a114b113a1139114b11391138114b11380178018601fc1137114b11371136114b11361135114b11351134114b11341133114b11331132114b11321131114b11311130114b1130112f114b112f112e114b112e112d114b112d112c114b112c112b114b112b112a114b112a1129114b11291128114b11281127114b11271126114b11261125114b11251124114b11241123114b1123017901fc1122114b11221121114b11211120114b1120111f114b111f111e114b111e111d114b111d111c114b111c111b114b111b111a114b111a1119114b11191118114b11181117114b11171116114b11161115114b11151114114b11141113114b11131112114b11121111114b11111110114b11100f114b0f0e114b0e0d114b0d017a03f80c114b0c0b114b0b0a114b0a09114b0908114b0807114b0706114b0605114b0504114b0403114b0302114b0201114c01114ddb3cdb3c572d57418200e8415626b3f2f48200f219564ac01e94564bc1659170e2f2f4564af823112ca4810101f823564f80647fc855305034810101cf0001c8cecd810101cf00ca00c901a201a3017b01f602112c02562b01206e953059f45a30944133f415e21129a48b9526562616c616e63658114b114c114b114a114b114a1149114a114911481149114811471148114711461147114611451146114511441145114402114302114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c017c01f8113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112d112f112d112b112e112b112c112d112c112a112c112a01112b011129112a1129112811291128112711281127017d01fc112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112017e04fc1111111211111110111111100f11100f550e20564e011150db3cf8427080408b9526562616c616e63658103402011151011150c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91302114d0201114e015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb08a8ae2017f01810182018301f65729810101f8235624055521112b7f7070c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90211210201112601562001206e953059f45a30944133f415e2810101f8232103112003562159216e955b59f45a3098c801cf004133f442e20180002c561ea4f8231126111f1121111f0111200102111f020100065bcf81001a58cf8680cf8480f400f400cf8101fcf400c901fb001148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135018401fc113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120018501e0111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3cdb310218044ee02182106920939fbae302218210dc63850bbae302218210d890b03fbae3022182109d3b8cb1ba01870199019e01a901fc31d33ffa00d31fd207d30730114a114d114a1149114c11491148114b11481147114d11471146114c11461145114b11451144114d11441143114c11431142114b11421141114d11411140114c1140113f114b113f113e114d113e113d114c113d113c114b113c113b114d113b113a114c113a1139114b11391138114d1138018801fc1137114c11371136114b11361135114d11351134114c11341133114b11331132114d11321131114c11311130114b1130112f114d112f112e114c112e112d114b112d112c114d112c112b114c112b112a114b112a1129114d11291128114c11281127114b11271126114d11261125114c11251124114b11241123114d1123018901fc1122114c11221121114b11211120114d1120111f114c111f111e114b111e111d114d111d111c114c111c111b114b111b111a114d111a1119114c11191118114b11181117114d11171116114c11161115114b11151114114d11141113114c11131112114b11121111114d11111110114c11100f114b0f0e114d0e0d114c0d018a04fa0c114b0c0b114d0b0a114c0a09114b0908114d0807114c0706114b0605114d0504114c0403114b0302114d0201114e01114fdb3cdb3c5725f823112ca4810101f8232104112e04413001114e01216e955b59f45a3098c801cf004133f442e2564ec00296114c811388bc93574c70e29480465740de564dc0039170e30d01a201a3018b018c0008564cc25002f69480285740de564dc00194564cc1ce9170e299573f7057468050113fde114dc00194114bc1e293574b70e29256359170e29556345634be9170e298f8235631a15633be9170e2925748e30d1145114a1145114411491144114311481143114211471142114111461141114011451140113f1144113f113e1143113e018d019601fc1146114b11461145114a1145114411491144114311481143114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132018e01fc113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291129112d1129112b112c112b1126112b11261125112a1125112411291124112311281123112211271122112311261123112011251120111f1124111f111e1123111e111d1122111d018f02fa111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384715446413db3c02114a020190019301f630573456375635a88064a90420564bbc93305649de205645bc93305643de11385638a15638c2008e20114a5638a1113f5638a011325638a011445638a1113f114a113f11441132113fde1133a4f8237070218040113dc859821070acb7bb5003cb1f810101cf00810101cf00c9564b04113d01146d50436d5033c80191016a89cf16ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00113311381134019200016001f803114903112b1148112b04114704112c1146112c0211450203114403112b1143112b04114204112c1141112c0211400203113f03112b113e112b04113d04112c113c112c02113b0203113a03112b1139112b04113804112c1137112c0211360203113503112b1134112b04113304112c1132112c0211310203113003019401fc112b112f112b04112e04112c112d112c02112c0203112b0303112a030411290402112802112511271125011126010311250304112404021123020311220301112101112004111f0402111e0203111d0301111c01111b04111a0402111902031118030111170111160411150402111402031113030111120111110411100401950026102f103e50dc104b102a10395087104640351401fc113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e1129019701fc1128112d11281128112c1128112a112b112a1125112a1125112411291124112311281123112211271122112111261121112211251122111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a11151114111911140198018c1113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a10491038471550621413db3cdb31021804f631d33f31d307d30731d31f31d430d001114b01114cdb3cdb3c5725f823810101f82301114e806470c855305034810101cf0001c8cecd810101cf00ca00c902112b0201114d01562a01206e953059f45a30944133f415e21128a4564ac0038e1357265738573e573e574357457f70708064805ae30e1148114a114801a201a3019a019b0044114ac00294803c5740de04114904031146030211400201113f01113804112504552001f411471149114702114802114511471145114411461144114311451143114211441142114111431141011142011141113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b113903113a03113711391137113611381136113511371135113411361134113311351133113211341132019c01f4113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291127112a11271125112911251126112811260411270411241126112402112502112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d019d01e4111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057505610344300db3cdb31021801fc31d33f31d307810101d700d401d001d30730114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b1139019f01fc1138114c11381137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c112401a001f81123114b11231122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f01a104f20e114c0e0d114b0d0c114c0c0b114b0b0a114c0a09114b0908114c0807114b0706114c0605114b0504114c0403114b0302114c0201114d01114edb3cdb3c5725f8238200d120564f562abef2f4112ca4564bc0018e135742574a817020114bc01e01114b01f2f4801ee30e810101f8230201114d01114e7fc801a201a301a401a500268200ccd0f8425632c705f2f48151d05630f2f40024562e9e8200dfe4f8235627a15628bef2f4de00ae564bc0028e155741574a8131b4564bc2ff94564bc1659170e2f2f48e33114bc0049c57368200c582564bc200f2f49e574b8200f8d9f2f01135114a1135e2113f114a113f1135114911351135113f1135e2114a113f114001fe55305034810101cf0001c8cecd810101cf00ca00c90211280201114b01562701206e953059f45a30944133f415e21125a41146114a1146114511491145114411481144114311471143114211461142114111451141114011441140113f1143113f113d1141113d113c1140113c113b113f113b113a113e113a1139113d113901a601f41138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d1129112a112c112a1127112b11271125112a1125112911241128112401a701f8112311271123112211261122112411251124112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f01a8014c0e11120e0d11110d0c11100c10bf10ae109d108c107b106a10591048103746504433db3cdb310218043ce30221821009d21b11bae30221821023019716bae302218210bb8d8491ba01aa01b501c201c901fc31d33ffa4031fa00308130a1f2f056208101012359f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f481188621206ef2d0806f29185f08b39b21206ef2d0806f296c81b39170e201ab01f4f2f41149114b11491148114a11481147114b11471146114a11461145114b11451144114a11441143114b11431142114a11421141114b11411140114a1140113f114b113f113e114a113e113d114b113d113c114a113c113b114b113b113a114a113a1139114b11391138114a11381137114b11371136114a113601ac01fc1135114b11351134114a11341133114b11331132114a11321131114b11311130114a1130112f114b112f112e114a112e112d114b112d112c114a112c112b114b112b112a114a112a1129114b11291128114a11281127114b11271126114a11261125114b11251124114a11241123114b11231122114a11221121114b112101ad01fc1120114a1120111f114b111f111e114a111e111d114b111d111c114a111c111b114b111b111a114a111a1119114b11191118114a11181117114b11171116114a11161115114b11151114114a11141113114b11131112114a11121111114b11111110114a11100f114b0f0e114a0e0d114b0d0c114a0c0b114b0b0a114a0a01ae03fc09114b0908114a0807114b0706114a0605114b0504114a0403114b0302114a0201114b01114c8122d4114e564bdb3c01114f01f2f4561c810101564c59f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e27053016eb39132e30d564da001bd01af01b000345b20206ef2d0806f2510345f0401206ef2d0806f2510245f040102fc564b5623a8812710a90481010103a45321b9564f5444305240c855405045810101cf0012810101cf00810101cf0001c8810101cf0012ca00cdc90211200213564e01206e953059f45a30944133f415e2111e01be9902114c02574a574a30e30d1146114a114611451149114511441148114411431147114311421146114201b101b200fa114c206ef2d0806f295b105610461036102681010147777f70c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc9031120031201114b01206e953059f45a30944133f415e2011119011149a0111c1149111c114711481147111c1147111c111801fc114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d01b301fc112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c111801b401941117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae5539db3cdb31021801f831d33f301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113601b601fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112101b701fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105601b802f610451034114b4130db3c5620810101564d59f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f41149114b11491148114a11481147114b11471146114a11461145114b1145021701b901fc1144114a11441143114b11431142114a11421141114b11411140114a1140113f114b113f113e114a113e113d114b113d113c114a113c113b114b113b113a114a113a1139114b11391138114a11381137114b11371136114a11361135114b11351134114a11341133114b11331132114a11321131114b11311130114a113001ba01fc112f114b112f112e114a112e112d114b112d112c114a112c112b114b112b112a114a112a1129114b11291128114a11281127114b11271126114a11261125114b11251124114a11241123114b11231122114a11221121114b11211120114a1120111f114b111f111e114a111e111d114b111d111c114a111c111b114b111b01bb01fc111a114a111a1119114b11191118114a11181117114b11171116114a11161115114b11151114114a11141113114b11131112114a11121111114b11111110114a11100f114b0f0e114a0e0d114b0d0c114a0c0b114b0b0a114a0a09114b0908114a0807114b0706114a0605114b0504114a0403114b0302114a0201114b0101bc02ec114a8122d4114c564ddb3c01114d01f2f48159c5564b206ef2d0806f296c81b3f2f4114a206ef2d0806f2930104710368101017f27515a05104a5a1ac855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90311220301114f0101bd01be005281010120562150334133f40c6fa19401d70030925b6de2206e923070e0f82301206ef2d080a15623b901f6206e953059f45a30944133f415e28b65365744665658564d0101f90101f901ba945741574b8e358bd546f67676c6554726164696e67801114d0101f90101f901ba9a5738111dc3001137111d92571ee2111d114a111d111d113f111de21147114a114711461149114611451148114511441147114411431146114301bf01fc114211451142114111441141114011431140111d1142111d113e1141113e113d1140113d113c113f113c113b113e113b113a113d113a1139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f112e1131112e01c001fc112d1130112d112c112f112c112b112e112b112a112d112a1129112c11291128112b11281127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111e1120111e111c111f111c111b111e111b111a111d111a1119111c111901c101901118111b11181117111a11171116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d552cdb3cdb31021801f831fa40301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113601c301fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112101c401fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105601c502fa10451034114b4130db3c31820083588d0860000000000000000000000000000000000000000000000000000000000000000004564c01c705b3f2f41149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f021701c601fc113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a01c701fc1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111501c801801114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510344130db3cdb31021802fe8efc31d33ffa00fa40308200dd3bf842564ec705f2f48142a622c200f2f48109228d08600000000000000000000000000000000000000000000000000000000000000000045220c705b3f2f4f828114c114e114c114b114d114b114a114c114a1149114b11491148114a1148114711491147114611481146114511471145e001ca01e201fc114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113211311133113111301132113001cb01fc112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b01cc02ca111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104613db3cdb3cdb3101cd0218013682009d4923c200f2f48200e184564924bef2f4114822a11148db3c01ce02f482009d4923c200f2f4f82814db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040f828238b081059104a103bc855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec91610455a1036453304c8cf8580ca00cf8440ce0101cf01e1011688c87001ca005a02cecec901d0022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d901d101d30157a65ec0bb513434800067fe803e903e9020404075c0154c1b05273e903e901640b4405c150488b8b6cf1b112001d201145321db3c30546440524001dd04c201d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ffa00fa40fa40810101d70055306c149cfa40fa405902d10170541222e205e30203d70d1ff2e082218210178d4519bae3022182100f8a7ea5bae30221821051a5c3d1ba01d401d501d801dc00f6038020d7217021d749c21f9430d31f01de208210178d4519ba8e2a30d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e082107bdd97deba8e29d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e05f0503d431d33ffa00fa40fa4031fa005327db3c8200c241f8422bc705936c217f8e32f8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705e2f2f48142a624c200f2f45163a021c20093365f04e30d400301dd01d601d700b0147f50437308c8553082107362d09c5005cb1f13cb3f01fa02cecec92404035066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00002cc87f01ca0055305043fa02ce12ce810101cf00c9ed5401fe31d33ffa00fa40fa40f40431fa008142a625c200f2f48138c6f84228c705f2f48109228d08600000000000000000000000000000000000000000000000000000000000000000045250c705b3f2f48121d45385bef2f48200da29f823500ba1c2041af2f4f82324a71e812710a90420c101923071de5350a18200b67621c20001d902fef2f45096a15349db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f80402c514e104d4b1311121ac855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec910561058104d1038591036453304c8cf8580ca00cf8440ce01fa028069cf4001dd01da0180025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0024c20093303330e30d4003c87f01ca0055305043fa02ce12ce810101cf00c9ed5401db00b270705414657304c855308210eb527edf5005cb1f13cb3f01fa02cecec92604034666146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0003f28f6731d33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a15145db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040228b082a104a1039544b30c8e0018210595f07bcbae3025f05f2c08201dd01de01df0018f82ac87001ca005a02cecec900da55508210178d45195007cb1f15cb3f5003fa02cece01fa02cec94016504405031036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004003c87f01ca0055305043fa02ce12ce810101cf00c9ed5401fed33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a1707f541435804008c8553082107bdd97de5005cb1f13cb3f01fa02cecec9260443135066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001e000304003c87f01ca0055305043fa02ce12ce810101cf00c9ed54004afa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00044c218210cfc66cbdbae3022182103c134728bae302218210f1822da1bae30221821083b8144aba01e301ea01f101f701f831fa40301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113601e401fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112101e501fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105601e602fe10451034114b4130db3c574081646d562eb3f2f481244b8d0860000000000000000000000000000000000000000000000000000000000000000004564c01c705b3f2f41149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140021701e701fc113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a01e801fc1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111501e901501114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb31021801fc31d30fd307d30fd30fd30f30114a114d114a1149114c11491148114b11481147114d11471146114c11461145114b11451144114d11441143114c11431142114b11421141114d11411140114c1140113f114b113f113e114d113e113d114c113d113c114b113c113b114d113b113a114c113a1139114b11391138114d113801eb01fc1137114c11371136114b11361135114d11351134114c11341133114b11331132114d11321131114c11311130114b1130112f114d112f112e114c112e112d114b112d112c114d112c112b114c112b112a114b112a1129114d11291128114c11281127114b11271126114d11261125114c11251124114b11241123114d112301ec01fc1122114c11221121114b11211120114d1120111f114c111f111e114b111e111d114d111d111c114c111c111b114b111b111a114d111a1119114c11191118114b11181117114d11171116114c11161115114b11151114114d11141113114c11131112114b11121111114d11111110114c11100f114b0f0e114d0e0d114c0d01ed02fa0c114b0c0b114d0b0a114c0a09114b0908114d0807114c0706114b0605114d0504114c0403114b0302114d0201114e01114fdb3c573b573b573b573e573e81646d562ab3f2f4811f4c5648c01e945647c1659170e2945649c0649170e296564a81012cba9170e294564bc0059170e2f2f41145114a1145114411491144021701ee01fc114311481143114211471142114111461141114011451140113f1144113f113e1143113e113b1140113b113a113f113a1139113e11391139113d1139113a113c113a1135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c01ef01fc112b1130112b112a112f112a1129112e11291128112d11281127112c11271126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c111701f001ae1116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384755461604db3cdb31021801f831d200301149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113601f201fc113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112311221123112211211122112101f301fc112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105601f402f410451034114b4130db3c573a81646d562eb3f2f41149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a113811391138021701f501fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112611251126112511241125112411231124112301f601f8112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb31021802fe8efc31d200fa00d31fd30730114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c1138e001f801fe01fc1137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b112301f901fc1122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b11151114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d01fa02fa0c114c0c0b114b0b0a114c0a09114b0908114c0807114b0706114c0605114b0504114c0403114b0302114c0201114d01114edb3c573557355735573681646d562bb3f2f4814b505649c20094564ac2009170e294564bc2009170e294564bc1659170e2f2f41146114a1146114511491145114411481144114311471143021701fb01fc114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113711391137113411381134113411371134113411361134113411351134113011341130112f1133112f112e1132112e01fc01fc112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d111901fd01a41118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d5538db3cdb3102180118018210946a98b6bae302114a01ff01fad33f30c8018210aff90f5758cb1fcb3fc91149114b11491148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138020001fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123020101fc112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce0202017610bd10ac109b108a107910681057104610354430f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00db3cdb31021801fe301148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134020401fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f020502d6111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c705749db3c0217021801fe301148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134020701fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f020802fc111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c1149114a11491148114a11481147114a11471146114a11460217020901fc1145114a11451144114a11441143114a11431142114a11421141114a11411140114a1140113f114a113f113e114a113e113d114a113d113c114a113c113b114a113b113a114a113a1139114a11391138114a11381137114a11371136114a11361135114a11351134114a11341133114a11331132114a11321131114a1131020a01fc1130114a1130112f114a112f112e114a112e112d114a112d112c114a112c112b114a112b112a114a112a1129114a11291128114a11281127114a11271126114a11261125114a11251124114a11241123114a11231122114a11221121114a11211120114a1120111f114a111f111e114a111e111d114a111d111c114a111c020b02fa111b114a111b111a114a111a1119114a11191118114a11181117114a11171116114a11161115114a11151114114a11141113114a11131112114a11121111114a11111110114a11100f114a0f0e114a0e0d114a0d0c114a0c0b114a0b0a114a0a09114a09114a08070655408168f4114bdb3c5728572e572e572e1124b3020c020d0010f8235624a15625bb01f801114801f2f470705644114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136020e01f6113511361135113411351134113311341133113211331132113111321131113011311130112f113002112e0201112d01112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126701127112511261125112411251124112311241123112211231122112111221121112011211120020f01fc111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105614154330db3c02180268e30282f0228aefdc558b3d1b9bb87fc33d71a2e40504be5a8d6acc8d737ee0215d75d86cbae3025f0f5f0f5f0f5f0f5f0ff2c0820211021401fe301148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134021201fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f021302e6111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c57275739707f113a011127db3c0217021801fc1148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134021501fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f021602ec111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c8200ae97562fb3f2f4112fb3112fdb3c02170218001882008aabf8425649c705f2f401f6c87f01ca00114b114a1149114811471146114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a11191118111711161115111411131112111102190112111055e0db3cc9ed54021a01f601114b01114afa02011148fa0201114601ca0001114401ce01114201cc1140c8cc01113ffa0201113dfa0201113b01cb0f01113901cb0701113701ce011135fa02011133fa0201113101cb0f01112f01cb0f01112d01cb0f01112b01ca0001112901ca00011127fa02c8011126fa0201112401cb1f01112201cb07021b01fe01112001810101cf0001111e01810101cf0001111cfa0201111afa021118c8ce01111701ca0001111501ca0001111301810101cf0001111101810101cf001ff4001df4000bc8810101cf001acb0718ca0016cb1f14810101cf0012cb1f810101cf00cb1fcb0ff40001c8810101cf0013f40013f4005003fa0213ca0013cb0f021c00dc5003fa0214cb1f14f4005004fa025004fa0204c8f40015ca0016cb0f16f40016f40016ca005006fa025006fa0206c8f40017ca005007fa0217cb1f17cb0717810101cf0017810101cf005008fa0218f40008c8810101cf0019f4001ace18cb0f15cd14cd12cdcd12cd12cd12cdcd434e3eba');
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
    1228: { message: "Invalid oracle" },
    1425: { message: "No tickets" },
    2338: { message: "Invalid destination" },
    2526: { message: "Only AI" },
    4173: { message: "Self referral" },
    6278: { message: "Closed" },
    8012: { message: "Only implemented limits are allowed" },
    8660: { message: "Insufficient" },
    8916: { message: "Window closed" },
    9291: { message: "Invalid treasury" },
    10363: { message: "Unauthorized burn" },
    11836: { message: "Invalid fee source" },
    12241: { message: "Max supply exceeded" },
    12449: { message: "Veto voting disabled until stake escrow is implemented" },
    12493: { message: "Invalid token wallet" },
    12724: { message: "Invalid burn share" },
    13478: { message: "Minting off" },
    14534: { message: "Not owner" },
    15353: { message: "Insufficient custody balance" },
    17062: { message: "Invalid amount" },
    19280: { message: "Invalid buyback config" },
    20145: { message: "Deposit QSR first" },
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
    26908: { message: "Transfer limits are fixed" },
    28115: { message: "No stake" },
    28704: { message: "Wallet fee is fixed at 30 bps" },
    30245: { message: "No vesting" },
    31786: { message: "Pool low" },
    33624: { message: "Invalid DeFi address" },
    35499: { message: "Only owner" },
    36222: { message: "Invalid lottery config" },
    36553: { message: "DeFi not configured" },
    39587: { message: "No referral rewards" },
    40072: { message: "Pool empty" },
    40265: { message: "Invalid transfer amount" },
    40326: { message: "Supply underflow" },
    40372: { message: "Max tx exceeded" },
    41094: { message: "Already exists" },
    42340: { message: "Too early" },
    43719: { message: "Staking off" },
    44027: { message: "Referral off" },
    44695: { message: "Disable autonomy first" },
    44799: { message: "Nothing to claim" },
    45296: { message: "Invalid vesting" },
    45605: { message: "Lottery off" },
    46710: { message: "Amount too small" },
    47767: { message: "Invalid referral reward" },
    49729: { message: "Unauthorized" },
    50562: { message: "Invalid buyback threshold" },
    52432: { message: "Only AI oracle" },
    52497: { message: "Cliff not reached" },
    53010: { message: "No autonomy" },
    53536: { message: "Low confidence" },
    55849: { message: "Cooldown" },
    56635: { message: "Only DeFi" },
    57292: { message: "Trading off" },
    57316: { message: "AI cooldown" },
    57665: { message: "Invalid staking config" },
    57732: { message: "Insufficient QSR reserve" },
    57784: { message: "No rewards" },
    57871: { message: "Invalid" },
    59457: { message: "Paused" },
    60911: { message: "Invalid DeFi transfer amount" },
    61977: { message: "Range" },
    63705: { message: "Unsupported governance proposal" },
    63922: { message: "Invalid custody transfer amount" },
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
    "Invalid oracle": 1228,
    "No tickets": 1425,
    "Invalid destination": 2338,
    "Only AI": 2526,
    "Self referral": 4173,
    "Closed": 6278,
    "Only implemented limits are allowed": 8012,
    "Insufficient": 8660,
    "Window closed": 8916,
    "Invalid treasury": 9291,
    "Unauthorized burn": 10363,
    "Invalid fee source": 11836,
    "Max supply exceeded": 12241,
    "Veto voting disabled until stake escrow is implemented": 12449,
    "Invalid token wallet": 12493,
    "Invalid burn share": 12724,
    "Minting off": 13478,
    "Not owner": 14534,
    "Insufficient custody balance": 15353,
    "Invalid amount": 17062,
    "Invalid buyback config": 19280,
    "Deposit QSR first": 20145,
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
    "Transfer limits are fixed": 26908,
    "No stake": 28115,
    "Wallet fee is fixed at 30 bps": 28704,
    "No vesting": 30245,
    "Pool low": 31786,
    "Invalid DeFi address": 33624,
    "Only owner": 35499,
    "Invalid lottery config": 36222,
    "DeFi not configured": 36553,
    "No referral rewards": 39587,
    "Pool empty": 40072,
    "Invalid transfer amount": 40265,
    "Supply underflow": 40326,
    "Max tx exceeded": 40372,
    "Already exists": 41094,
    "Too early": 42340,
    "Staking off": 43719,
    "Referral off": 44027,
    "Disable autonomy first": 44695,
    "Nothing to claim": 44799,
    "Invalid vesting": 45296,
    "Lottery off": 45605,
    "Amount too small": 46710,
    "Invalid referral reward": 47767,
    "Unauthorized": 49729,
    "Invalid buyback threshold": 50562,
    "Only AI oracle": 52432,
    "Cliff not reached": 52497,
    "No autonomy": 53010,
    "Low confidence": 53536,
    "Cooldown": 55849,
    "Only DeFi": 56635,
    "Trading off": 57292,
    "AI cooldown": 57316,
    "Invalid staking config": 57665,
    "Insufficient QSR reserve": 57732,
    "No rewards": 57784,
    "Invalid": 57871,
    "Paused": 59457,
    "Invalid DeFi transfer amount": 60911,
    "Range": 61977,
    "Unsupported governance proposal": 63705,
    "Invalid custody transfer amount": 63922,
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
    {"name":"Mint","header":1680571655,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"receiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BurnNotification","header":2078119902,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardTonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenBurn","header":1499400124,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenNotification","header":1935855772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"InternalTransfer","header":395134233,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardTonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"PoolPayout","header":1369818065,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DefiPayout","header":3146613905,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
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
    {"name":"QuasarMaster$Data","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"maxSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}},{"name":"reserveBalance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"custodyBalance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeBurnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalBurned","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalFeesCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldownSeconds","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"tradingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackThreshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"buybackBurnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lastBuybackTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBuybacks","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalQsrBurnedViaBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalTonSpentOnBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"aiOracle","type":{"kind":"simple","type":"address","optional":false}},{"name":"aiEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiFullAutonomy","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lastRebalanceTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"signalCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceHistory","type":{"kind":"dict","key":"int","value":"int"}},{"name":"anomalyLog","type":{"kind":"dict","key":"int","value":"AIRecommendation","valueFormat":"ref"}},{"name":"anomalyIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"minConfidence","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"emergencyPause","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiActionCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastAiActionTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"heartbeatTimeout","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ownerOverrideWindow","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"vetoThresholdBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"aiActionLog","type":{"kind":"dict","key":"int","value":"AIActionLog","valueFormat":"ref"}},{"name":"aiActionIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pendingAiActions","type":{"kind":"dict","key":"int","value":"int"}},{"name":"vetoLog","type":{"kind":"dict","key":"int","value":"VetoState","valueFormat":"ref"}},{"name":"totalVetoStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"stakingApyBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stakingMinStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingLockPeriod","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"stakers","type":{"kind":"dict","key":"address","value":"StakeInfo","valueFormat":"ref"}},{"name":"totalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingRewardsPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"pendingQsrDeposits","type":{"kind":"dict","key":"address","value":"int"}},{"name":"referralEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"referralRewardBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referrals","type":{"kind":"dict","key":"address","value":"ReferralInfo","valueFormat":"ref"}},{"name":"pendingReferralRewards","type":{"kind":"dict","key":"address","value":"int"}},{"name":"vestingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"teamAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"teamClaimed","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"vestingSchedules","type":{"kind":"dict","key":"address","value":"VestingInfo","valueFormat":"ref"}},{"name":"lotteryEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lotteryTicketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryDrawInterval","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lotteryJackpotShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lotteryRound","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryLastDraw","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryJackpot","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryTickets","type":{"kind":"dict","key":"int","value":"address"}},{"name":"lotteryTicketCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryWinners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"defiAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"defiFeeShareBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
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
    "Mint": 1680571655,
    "BurnNotification": 2078119902,
    "TokenTransfer": 260734629,
    "TokenBurn": 1499400124,
    "TokenNotification": 1935855772,
    "InternalTransfer": 395134233,
    "PoolPayout": 1369818065,
    "DefiPayout": 3146613905,
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
    {"name":"get_max_supply","methodId":94740,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_reserve_balance","methodId":94514,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_custody_balance","methodId":111065,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_wallet_address","methodId":103289,"arguments":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"get_ai_state","methodId":127730,"arguments":[],"returnType":{"kind":"simple","type":"AIState","optional":false}},
    {"name":"get_autonomy_state","methodId":83718,"arguments":[],"returnType":{"kind":"simple","type":"AutonomyState","optional":false}},
    {"name":"get_fee_config","methodId":90859,"arguments":[],"returnType":{"kind":"simple","type":"FeeConfig","optional":false}},
    {"name":"get_buyback_state","methodId":120761,"arguments":[],"returnType":{"kind":"simple","type":"BuybackState","optional":false}},
    {"name":"get_staking_config","methodId":129919,"arguments":[],"returnType":{"kind":"simple","type":"StakingConfig","optional":false}},
    {"name":"get_stake_info","methodId":127811,"arguments":[{"name":"staker","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"StakeInfo","optional":true}},
    {"name":"get_pending_qsr_deposit","methodId":80140,"arguments":[{"name":"depositor","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"get_referral_info","methodId":93058,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"ReferralInfo","optional":true}},
    {"name":"get_pending_referral_reward","methodId":80198,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
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
    'get_max_supply': 'getGetMaxSupply',
    'get_reserve_balance': 'getGetReserveBalance',
    'get_custody_balance': 'getGetCustodyBalance',
    'get_wallet_address': 'getGetWalletAddress',
    'get_ai_state': 'getGetAiState',
    'get_autonomy_state': 'getGetAutonomyState',
    'get_fee_config': 'getGetFeeConfig',
    'get_buyback_state': 'getGetBuybackState',
    'get_staking_config': 'getGetStakingConfig',
    'get_stake_info': 'getGetStakeInfo',
    'get_pending_qsr_deposit': 'getGetPendingQsrDeposit',
    'get_referral_info': 'getGetReferralInfo',
    'get_pending_referral_reward': 'getGetPendingReferralReward',
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
    {"receiver":"internal","message":{"kind":"typed","type":"TokenNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"FeeTransfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TriggerBuyback"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Stake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Unstake"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClaimRewards"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetStakingConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RegisterReferral"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetReferralConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClaimReferralRewards"}},
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
    {"receiver":"internal","message":{"kind":"typed","type":"DefiPayout"}},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Mint | BurnNotification | "Stop Minting" | TokenNotification | FeeTransfer | TriggerBuyback | Stake | Unstake | ClaimRewards | SetStakingConfig | RegisterReferral | SetReferralConfig | ClaimReferralRewards | AddVesting | ClaimVested | TriggerLottery | SetLotteryConfig | AIGrantFullAutonomy | AIHeartbeat | AIEmergencyPause | AISetFee | AISetTreasuryDirect | AISetAntiWhale | AISetBuybackDirect | AIToggleTrading | AIRotateOracle | AISetOracle | AIRebalance | AIPriceSignal | AIAnomalyAlert | AIGovernanceProposal | AIVetoVote | OwnerOverride | "Claim AI Control" | SetDefiAddress | DefiPayout | SetTreasury | SetFeeConfig | ToggleTrading | SetBuybackConfig | "Resume" | "Toggle AI" | Deploy) {
        
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenNotification') {
            body = beginCell().store(storeTokenNotification(message)).endCell();
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClaimReferralRewards') {
            body = beginCell().store(storeClaimReferralRewards(message)).endCell();
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'DefiPayout') {
            body = beginCell().store(storeDefiPayout(message)).endCell();
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
    
    async getGetMaxSupply(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_max_supply', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetReserveBalance(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_reserve_balance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGetCustodyBalance(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('get_custody_balance', builder.build())).stack;
        const result = source.readBigNumber();
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
    
    async getGetPendingQsrDeposit(provider: ContractProvider, depositor: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(depositor);
        const source = (await provider.get('get_pending_qsr_deposit', builder.build())).stack;
        const result = source.readBigNumber();
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
    
    async getGetPendingReferralReward(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('get_pending_referral_reward', builder.build())).stack;
        const result = source.readBigNumber();
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