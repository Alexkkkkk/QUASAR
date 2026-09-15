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
        b_0.storeCoins(src.reserveBalance);
        b_0.storeCoins(src.custodyBalance);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeUint(src.feeBurnShare, 8);
        b_0.storeAddress(src.treasury);
        const b_1 = new Builder();
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
        b_1.storeInt(src.lastBuybackTime, 257);
        const b_2 = new Builder();
        b_2.storeInt(src.totalBuybacks, 257);
        b_2.storeCoins(src.totalQsrBurnedViaBuyback);
        b_2.storeCoins(src.totalTonSpentOnBuyback);
        b_2.storeAddress(src.aiOracle);
        b_2.storeBit(src.aiEnabled);
        b_2.storeBit(src.aiFullAutonomy);
        const b_3 = new Builder();
        b_3.storeInt(src.lastRebalanceTime, 257);
        b_3.storeInt(src.signalCount, 257);
        b_3.storeDict(src.priceHistory, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_3.storeDict(src.anomalyLog, Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation());
        b_3.storeInt(src.anomalyIndex, 257);
        b_3.storeUint(src.minConfidence, 8);
        b_3.storeBit(src.emergencyPause);
        b_3.storeUint(src.aiActionCooldown, 32);
        const b_4 = new Builder();
        b_4.storeInt(src.lastAiActionTime, 257);
        b_4.storeUint(src.heartbeatTimeout, 32);
        b_4.storeInt(src.lastHeartbeat, 257);
        b_4.storeUint(src.ownerOverrideWindow, 32);
        b_4.storeUint(src.vetoThresholdBps, 16);
        b_4.storeDict(src.aiActionLog, Dictionary.Keys.BigInt(257), dictValueParserAIActionLog());
        b_4.storeInt(src.aiActionIndex, 257);
        b_4.storeDict(src.pendingAiActions, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_4.storeDict(src.vetoLog, Dictionary.Keys.BigInt(257), dictValueParserVetoState());
        b_4.storeCoins(src.totalVetoStake);
        b_4.storeBit(src.stakingEnabled);
        b_4.storeUint(src.stakingApyBps, 16);
        const b_5 = new Builder();
        b_5.storeCoins(src.stakingMinStake);
        b_5.storeUint(src.stakingLockPeriod, 32);
        b_5.storeDict(src.stakers, Dictionary.Keys.Address(), dictValueParserStakeInfo());
        b_5.storeCoins(src.totalStaked);
        b_5.storeCoins(src.stakingRewardsPool);
        b_5.storeDict(src.pendingQsrDeposits, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_5.storeBit(src.referralEnabled);
        b_5.storeUint(src.referralRewardBps, 16);
        b_5.storeDict(src.referrals, Dictionary.Keys.Address(), dictValueParserReferralInfo());
        b_5.storeBit(src.vestingEnabled);
        b_5.storeCoins(src.teamAllocation);
        b_5.storeCoins(src.teamClaimed);
        const b_6 = new Builder();
        b_6.storeDict(src.vestingSchedules, Dictionary.Keys.Address(), dictValueParserVestingInfo());
        b_6.storeBit(src.lotteryEnabled);
        b_6.storeCoins(src.lotteryTicketPrice);
        b_6.storeUint(src.lotteryDrawInterval, 32);
        b_6.storeUint(src.lotteryJackpotShare, 8);
        b_6.storeInt(src.lotteryRound, 257);
        b_6.storeInt(src.lotteryLastDraw, 257);
        b_6.storeCoins(src.lotteryJackpot);
        b_6.storeDict(src.lotteryTickets, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        const b_7 = new Builder();
        b_7.storeInt(src.lotteryTicketCount, 257);
        b_7.storeDict(src.lotteryWinners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_7.storeAddress(src.defiAddress);
        b_7.storeUint(src.defiFeeShareBps, 16);
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
    const _mintable = sc_0.loadBit();
    const _owner = sc_0.loadAddress();
    const _content = sc_0.loadRef();
    const _walletCode = sc_0.loadRef();
    const _reserveBalance = sc_0.loadCoins();
    const _custodyBalance = sc_0.loadCoins();
    const _feeBps = sc_0.loadUintBig(16);
    const _feeBurnShare = sc_0.loadUintBig(8);
    const _treasury = sc_0.loadAddress();
    const sc_1 = sc_0.loadRef().beginParse();
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
    const _lastBuybackTime = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _totalBuybacks = sc_2.loadIntBig(257);
    const _totalQsrBurnedViaBuyback = sc_2.loadCoins();
    const _totalTonSpentOnBuyback = sc_2.loadCoins();
    const _aiOracle = sc_2.loadAddress();
    const _aiEnabled = sc_2.loadBit();
    const _aiFullAutonomy = sc_2.loadBit();
    const sc_3 = sc_2.loadRef().beginParse();
    const _lastRebalanceTime = sc_3.loadIntBig(257);
    const _signalCount = sc_3.loadIntBig(257);
    const _priceHistory = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_3);
    const _anomalyLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), sc_3);
    const _anomalyIndex = sc_3.loadIntBig(257);
    const _minConfidence = sc_3.loadUintBig(8);
    const _emergencyPause = sc_3.loadBit();
    const _aiActionCooldown = sc_3.loadUintBig(32);
    const sc_4 = sc_3.loadRef().beginParse();
    const _lastAiActionTime = sc_4.loadIntBig(257);
    const _heartbeatTimeout = sc_4.loadUintBig(32);
    const _lastHeartbeat = sc_4.loadIntBig(257);
    const _ownerOverrideWindow = sc_4.loadUintBig(32);
    const _vetoThresholdBps = sc_4.loadUintBig(16);
    const _aiActionLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), sc_4);
    const _aiActionIndex = sc_4.loadIntBig(257);
    const _pendingAiActions = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_4);
    const _vetoLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), sc_4);
    const _totalVetoStake = sc_4.loadCoins();
    const _stakingEnabled = sc_4.loadBit();
    const _stakingApyBps = sc_4.loadUintBig(16);
    const sc_5 = sc_4.loadRef().beginParse();
    const _stakingMinStake = sc_5.loadCoins();
    const _stakingLockPeriod = sc_5.loadUintBig(32);
    const _stakers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserStakeInfo(), sc_5);
    const _totalStaked = sc_5.loadCoins();
    const _stakingRewardsPool = sc_5.loadCoins();
    const _pendingQsrDeposits = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_5);
    const _referralEnabled = sc_5.loadBit();
    const _referralRewardBps = sc_5.loadUintBig(16);
    const _referrals = Dictionary.load(Dictionary.Keys.Address(), dictValueParserReferralInfo(), sc_5);
    const _vestingEnabled = sc_5.loadBit();
    const _teamAllocation = sc_5.loadCoins();
    const _teamClaimed = sc_5.loadCoins();
    const sc_6 = sc_5.loadRef().beginParse();
    const _vestingSchedules = Dictionary.load(Dictionary.Keys.Address(), dictValueParserVestingInfo(), sc_6);
    const _lotteryEnabled = sc_6.loadBit();
    const _lotteryTicketPrice = sc_6.loadCoins();
    const _lotteryDrawInterval = sc_6.loadUintBig(32);
    const _lotteryJackpotShare = sc_6.loadUintBig(8);
    const _lotteryRound = sc_6.loadIntBig(257);
    const _lotteryLastDraw = sc_6.loadIntBig(257);
    const _lotteryJackpot = sc_6.loadCoins();
    const _lotteryTickets = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_6);
    const sc_7 = sc_6.loadRef().beginParse();
    const _lotteryTicketCount = sc_7.loadIntBig(257);
    const _lotteryWinners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_7);
    const _defiAddress = sc_7.loadAddress();
    const _defiFeeShareBps = sc_7.loadUintBig(16);
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, custodyBalance: _custodyBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
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
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
    const _lotteryWinners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    const _defiAddress = source.readAddress();
    const _defiFeeShareBps = source.readBigNumber();
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, custodyBalance: _custodyBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadGetterTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
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
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, custodyBalance: _custodyBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function storeTupleQuasarMaster$Data(source: QuasarMaster$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
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
    const __code = Cell.fromHex('b5ee9c724202020200010000c8b80000022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d90001006c020271000200330201200003001a0201200004000e0201200005000a03fbb2d93b513434800063a2fe903535154800f45636cf38c34452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e20006d0071000601fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123000702fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f00080009009481010156210259f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e2004857105f0f57105f0f57105f0f6c91206e92306d99206ef2d0806f296f09e2206e92306dde03fbb3f5fb513434800063a2fe903535154800f45636cf38c34452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e20006d0071000b01fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123000c02fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f000d004a002e81010120562d50334133f40c6fa19401d70030925b6de2020158000f001602012000100012034aa964ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6ce76ce76ce76ce76ce76c37006d00710011000e547ba9547ba92b03faa90aed44d0d200018e8bfa40d4d4552003d158db3ce30d114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138006d0071001301fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123001402fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f00150052007c81010b2e0259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e203fbac8676a268690000c745fd206a6a2a9001e8ac6d9e718688a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c40006d0071001701fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123001802fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f0019004a004881010b5615028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e2020120001b0025020148001c0021020120001d001f0356abeded44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6c91006d0071001e000456390352ab06ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6c996c996c996c996c996c996c996ca9006d007100200024562d5626562656265626562656265622562603fbaf4e76a268690000c745fd206a6a2a9001e8ac6d9e718688a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c40006d0071002201fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123002302fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f0024004a001c810101240259f40c6fa192306ddf0201200026002e020120002700290357ad75f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e36443644364436443644364436443644364c40006d00710028002a80645641a1564201564201563f563f563f5644564403fbadc176a268690000c745fd206a6a2a9001e8ac6d9e718688a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c40006d0071002a01fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123002b02fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f002c002d005481010b56120259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2004857105f0f57105f0f57105f0f6c91206e92306d99206ef2d0806f236f03e2206e92306dde020162002f00310355a665da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed923006d00710030000456430355a6f5da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed923006d0071003200045626020120003400440201200035003f0201580036003d020166003700390355a30fb513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db246006d0071003800022003f9a1e7b513434800063a2fe903535154800f45636cf38c34452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e2006d0071003a01fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123003b02fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f003c004a0162f828db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d001b40347af16f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab66ac0006d0071003e00145648564856485648564802016a004000420356a9d9ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6c91006d00710041000456420356ab14ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6c91006d007100430104db3c01f1020120004500530201200046004b03fbb206fb513434800063a2fe903535154800f45636cf38c34452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e20006d0071004701fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123004802fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f0049004a0104db3c01a1001c57105f0f57105f0f57105f0f6c91020120004c004e0353afdcf6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e364cb64cb64cb64cb64cb64cb64cb654c0006d0071004d002456385638563856385638563856385638563803fbaebc76a268690000c745fd206a6a2a9001e8ac6d9e718688a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c40006d0071004f01fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123005002fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f005100520078810101561e0259f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e2004857105f0f57105f0f57105f0f6c91206e92306d99206ef2d0806f256f05e2206e92306dde0201200054005b020120005500570357aff376a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e2b882f87ab882f87ab882f87ab882f87b648c0006d0071005600022103fbac67f6a268690000c745fd206a6a2a9001e8ac6d9e718688a408a488a408a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c40006d0071005801fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123005902fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f005a0069005c810101562b0259f40d6fa192306ddf206e92306d8e17d0810101d700d401d001810101d700d20055306c146f04e2020120005c006a020166005d00650351a3cbb513434800063a2fe903535154800f45636cf38c376cf1b2a9b2a9b2a9b2a9b2a9b2a9b2a9b0ea006d0071005e01f0562f562f562f562f562f56465631562f562a1148115111481147115011471146114f11461145114e11451144114d11441143114c11431142114b11421141114a1141114011491140113f1151113f113e1150113e113d114f113d113c114e113c113b114d113b113a114c113a1139114b11391138114a1138005f01fc1137114911371136115111361135115011351134114f11341133114e11331132114d11321131114c11311130114b1130112f114a112f112e1149112e112d1151112d112c1150112c112b114f112b112a114e112a1129114d11291128114c11281127114b11271126114a1126112511491125112411511124112311501123006001fc1122114f11221121114e11211120114d1120111f114c111f111e114b111e111d114a111d111c1149111c111b1151111b111a1150111a1119114f11191118114e11181117114d11171116114c11161115114b11151114114a11141113114911131112115111121111115011111110114f11100f114e0f0e114d0e0d114c0d006102f80c114b0c0b114a0b0a11490a091151090811500807114f0706114e0605114d0504114c0403114b0302114a02011149011151db3c091151090811500807114f0706114e0605114d0504114c0403114b0302114a02011152011149115211491148115111481147115011471146114f11461145114e11451144114d114401f1006201fc1143114c11431142114b11421141114a1141114011491140113f1148113f113e1147113e113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f006301fc112e1137112e112d1136112d112c1135112c112b1134112b112a1133112a1129113211291128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a006400a81119112211191118112111181117112011171116111f11161115111e11151114111d11141113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a03f9a10fb513434800063a2fe903535154800f45636cf38c34452045244520451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e2006d0071006601fc113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123006702fc112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f00680069006e81010b56180259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2004857105f0f57105f0f57105f0f6c91206e92306d99206ef2d0806f246f04e2206e92306dde0347adbff6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab66ac0006d0071006b0014561a561a561a561a561904c0eda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e8bfa40d4d4552003d158db3ce30d114a8ea511488020d7217021d749c21f9430d31f01de821051a5c3d1bae3025f0f5f0f5f0f5f0f5f0ee05648d749c21f006d00710076007902f46d6d6d6d6d6d6d6d6d6d6d707f547f11801e803256145333806481012c757f7f258212540be400810e1054772253007070547222804b70815460238208093a80f823820151808103e853447f8107d08218174876e8008208278d0053447f561a7f53337f82103b9aca005610562d71f8235366891139114711390083006e01fc1138114611381137114511371138114411381137114311371136114211361135114111351134114011341133113f11331132113e11321131113d11311130113c1130112f113b112f112e113a112e112d1139112d112c1138112c112b1137112b112a1136112a112911351129112811341128112711331127112611321126006f01fc1125113111251124113011241123112f1123112d112e112d1122112d11221121112c11211120112b1120111f112a111f112111291121112011281120111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a1119112211191118112111181117112011171116111f11161116111e11161115111d1115007000be1118111c11181117111b11171114111a11141113111911131112111811121111111711111110111611101110111511100f11140f0e11130e1110111211100d11110d0c11100c10cf10be10ad5e29108a1079106810571046103541408101f402f8db3c5749114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a11391138113911381137113811371136113711361135113611351134113511340072007401f6fa00d200fa40d4d401d0d4fa00fa00d30fd307fa40fa00fa00d30fd30fd30fd200d200fa00d430d0fa00d31fd307810101d700810101d700fa00fa00d430d0fa40d200d200810101d700810101d700f404f404d430d0810101d700d307d200d31f810101d700d31f810101d700d31fd30ff404d430d0810101d700007300c8f404f404fa00d200d30ffa00d31ff404fa00fa00d430d0f404d200d30ff404d200fa00fa00f404d200fa00d31fd307810101d700810101d700d430d0fa00f404810101d700f404fa40d30f3011451149114511451148114511451147114511451146114501fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f007500c0111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e01f4d33ffa00596c2101114101a01146114811461145114711451144114611441143114511431142114411421141114311411142113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134007701fc113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f007801f8111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430db3c01fd04ece3001148f9012082f07f309c3a7adc967de7844945367788045b18adf5557c5bf60508ec7c231da6debae3022082f0939b8f50a89494d7788bca14d37ccb5365057f81e805b401d1ab446c0d80a3fabae3022082f040391f4eaad79adb418bdfd49edad3b17b5e392ce4fafbbf82f21f2055ee0f7dba007a01e801eb01f504541148d31f218210642b7d07bae3022182107bdd97debae3022182107362d09cbae302218210eb527edfba007b0082008a008f04f231fa00fa403001114901114adb3c8142a6564ac200f2f481540c8d0860000000000000000000000000000000000000000000000000000000000000000004564c01c705b3f2f4db3cdb3c8134a65648f2f45648563da8812710a9045649c2009a564a82009db402bbf2f49130e211485649a01148564a564a7000e8007c01fc007d00108200dfcc563af2f402f6db3cf84270114b8040114dc85982103345ab925003cb1f810101cf00cec91302114b0201114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611481146114511471145114411461144114311451143114211441142007e007f0108f828db3c01b301fc114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d008001fc112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118008101801117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3cdb3101fd04e431d33f31fa00fa40fa40308142a623c200f2f482009d8623564bbbf2f4f8285220db3c81287bf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4114922a189564a01c705b3925749e30df8427003804003c801b40083008400860043800000000000000000000000000000000000000000000000000000000000000000100180707080408804114d04146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0000850026000000004578636573732072657475726e656401f4598210d28b2faf5003cb1f810101cf00cec943305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f008701fc113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a008801fc1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115008901581114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3cdb3101fd02fa31d33f31fa00fa40308142a622c200f2f4f828f828db3c8130cdf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4561381010b228101014133f40a6fa19401d70030925b6de281010b216e9231229801206ef2d08023a0e2031115031201b4008b01fc810101216e955b59f4593098c801cf004133f441e2011141011112a01146114811461145114711451144114611441143114511431142114411421141114311411142113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136008c01fc113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121008d01fc112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068008e01181057104610354430db3cdb3101fd043ce302218210cfe1fd3cbae302218210bef0e904bae302218210ff633be1ba009000b300b700c502fe31d33ffa00fa40308142a622c200f2f4f8285210db3c812e3cf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4113e21a0114421a0215642a88064a9045320a15121a122a70f8064a90423a70f8064a90424a70a8064a904255651a881271001b4009104f2a9045163a122a121a126a125c2009c114f25a1114525a01145114fde23c20092563f9170e294113e23a09923c2009223a0de113ee222c2009256129170e29351c2a09c22c20096113e22a0113ede0ce221c2009256219170e294111b21a09d21c20096113e21a0113ede111be226c2009170e30de30f705613009200930098009b00548d0860000000000000000000000000000000000000000000000000000000000000000004565101c705b301f81148114f11481147114e11471146114d11461145114c11451144114b1144041143041142114911421141114f11411140114e1140113f114d113f113e114c113e113d114a113d04113c04113b1149113b113a114f113a1139114e11391138114d11380c11370c1136114a1136041135041134114911341133114f1133009401fc1132114e11321131114d11310c11300c112f114a112f04112e04112d1149112d112c114f112c112b114e112b112a114d112a0c11290c1128114a1128041127041126114911261125114f11251124114e11241123114d11230c11220c1121114a112104112004111f1149111f111e114f111e111d114e111d111c114d111c009501ec0c111b0c111a114a111a041119041118114911181117114f11171116114e11161115114d111511141113114a1113041112041111114911111110114f11100f114e0f0e114d0e0d0c114a0c104b0a11490a09114f0908114e0807114d070605114a050311490302114f020111500111515651564fdb3c009602f48200edef22c200f2f482008ec98d08600000000000000000000000000000000000000000000000000000000000000000045250c705b3f2f48200e184564623bef2f4114521a1f8285240db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d001b4009700e88209312d007f71f828f82882089896808b0805114f05104bc855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec9465004114a04401301114a011036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001fa26c20096113e26a0113ede061151060111500102114f0208114e0807114d07113e114c113e1144114b114405114a0503114903021148020811470807114607113e1145113e0411430403114203021141020811400807113f0705113d0504113c0403113b0302113a0208113908071138070c11370c0511360504113504009901f8031134030211330208113208071131070c11300c05112f0504112e0403112d0302112c0208112b0807112a070c11290c0511280504112704031126030211250208112408071123070c11220c051121050411200403111f0302111e0208111d0807111c070c111b0c05111a0504111904031118030211170208111608009a004607111507111405111305041112040311110302111002108f107e0d105c104b103a491604c48ecc561181010b564e59f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e99564f5614a8812710a90420c20094564f21be9170e2915be30d9130e2de564dc2009170e30de3002c94564e2cbe9170e2009c00a400a500aa02f63221114f22a101206ef2d0806f235b561381010b2259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e35206ef2d0806f2381010b5126a04300c855205023ce810101cf00810101cf00c902111502561501206e953059f45930944133f413e2e30e114a114b114a009d009e00a03081010b8d08600000000000000000000000000000000000000000000000000000000000000000042470c855205023ce810101cf00810101cf00c902111502561501206e953059f45930944133f413e201fc1149114b11491148114b11481147114b11471146114b11461145114b11451144114b11441143114b11431142114b11421141114b11411140114b1140113f114b113f113e114b113e113d114b113d113c114b113c113b114b113b113a114b113a1139114b11391138114b11381137114b11371136114b11361135114b1135009f01fc1134114b11341133114b11331132114b11321131114b11311130114b1130112f114b112f112e114b112e112d114b112d112c114b112c112b114b112b112a114b112a1129114b11291128114b11281127114b11271126114b11261125114b11251124114b11241123114b11231122114b11221121114b11211120114b112000a002fc111f114b111f111e114b111e111d114b111d111c114b111c111b114b111b111a114b111a1119114b11191118114b11181117114b11171116114b11161115114b11151114114b11141113114b11131112111111100f0e0d0c0b0a090807060504431301114b015651564fdb3c1149114d114911481149114811471148114701b200a101fc114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113200a201fc113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d00a300a8111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e00548d0860000000000000000000000000000000000000000000000000000000000000000004564101c705b301fc11481149114811471149114711461149114611451149114511441149114411431149114311421149114211411149114111401149114056491140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e00a602f8111d111c111b111a111911181117111611151114111311121111111055e0114a564e5651564fdb3c114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b01b200a701fc113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112600a801fc112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111511141115111411131114111311121113111211111112111100a900181110111111100f11100f550e03ea8e1a158101015252114e206e953059f45a30944133f414e203a4030492574ce256389556375637be9170e298f8235634a15636be9170e28e84564edb3cde2b96f82327a12abe9170e29323c2009170e292574ee30df84205114d0504114a040311490302114f0201115001114b70114d80401153c8017800ab00af01fc114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113400ac01fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f00ad02fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e114edb3c114d114811471146114511441143114211411140113f113e113d010a00ae00b8113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e001fe55708210c47b97305009cb1f17810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc9031146030211470201114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f40000b001f8c901fb00113f1148113f113e1147113e113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f112e1137112e112d1136112d112c1135112c00b101fc112b1134112b112a1133112a1129113211291128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a11191122111911181121111811171120111700b201c41116111f11161115111e11151114111d11141113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a091112090811110807111007106f105e104d103c4ba9103810474436db3cdb3101fd01fa31d33f3081632e5638f2f4817c2a56375637bef2f48200da29f8235634a15636bef2f4114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b113900b401fc1138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112400b501f8112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f00b602440e11100e10df10ce10bd10ac109b108a107910681057104610354430db3cdb3cdb31017801fd01f831fa0030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113400b801fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f00b902f8111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c00e800ba01b68200aac7561bf2f48142a6564ac200f2f481662c564a561abef2f481010bf8425615598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d080564cbe9170e2f2f4f842561881010b2259f40b6fa192306ddf00bb01f8206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e270f823561ca0226eb38e165b20206ef2d0806f245f0301206ef2d0806f246c31019132e21148114c11481147114b11471146114a11461145114911451144114c11441143114b11431142114a114211411149114100bc01fc1140114c1140113f114b113f113e114a113e113d1149113d113c114c113c113b114b113b113a114a113a1139114911391138114c11381137114b11371136114a11361135114911351134114c11341133114b11331132114a11321131114911311130114c1130112f114b112f112e114a112e112d1149112d112c114c112c00bd01fc112b114b112b112a114a112a1129114911291128114c11281127114b11271126114a11261125114911251124114c11241123114b11231122114a11221121114911211120114c1120111f114b111f111e114a111e111d1149111d111c114c111c111b114b111b111a114a111a1119114911191118114c11181117114b111700be03fc1116114a11161115114911151114114c11141113114b11131112114a11121111114911111110114c11100f114b0f0e114a0e0d11490d0c114c0c0b114b0b0a114a0a0911490908114c0807114b0706114a060511490504114c0403114b0302114a0201114901114c564adb3c20c20094561521be9170e29130e30d81010b00d800bf00c0012411155615a170f82802111702564d5520db3c01b201fe114d564ea0f823f8235502114cc855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211160201114c01564a01206e953059f45930944133f413e21113564ba081010b114a206ef2d080564ca10211120201114a01564901810101216e955b59f4593098c801cf004133f441e2f8427011498040114dc800c101f6598210acd731a75003cb1fce810101cf00c9130211490201114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114311481143114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d00c201fc113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d112800c301fc1127112c11271126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a111511141119111411131118111300c401761112111711121110111611101114111511140f11140f0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384755060403db3cdb3101fd02fe8efc31fa0030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134e000c600d401fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f00c702fe111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c8142a600e800c801fa564ac200f2f4f842561781010b2259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2816dd3216eb3f2f48152fd21206ef2d0806f245f03564dbef2f4816283f82322206ef2d0806f246c31bef2f41148114a11481147114911471146114a114600c901fc1145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a11361135114911351134114a11341133114911331132114a113211311149113100ca01fc1130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a11221121114911211120114a1120111f1149111f111e114a111e111d1149111d111c114a111c00cb01f8111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a0911490908114a080711490706114a060511490504114a040311490300cc038202114a0201114901114a5649db3c20c20094561521be9170e28e9211155615a170f82802111702564c5520db3c9130e2564a206ef2d0806f245f03564ca120c20000d801b200cd02fc8e4b30574a81010b6dc8216e925b6d8e2601206ef2d0806f24550355305034810101cf00810101cf00810101cf0001c8810101cf00cdc9e202111702564a01206e953059f45930944133f413e2e30d1114564aa111471148114711461147114611451146114511441145114411431144114311421143114211411142114100ce00cf00b081010b564c206ef2d0806f2410235f03f823114e206ef2d0806f246c311201114e01c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211170201114b01564a01206e953059f45930944133f413e201fc114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c00d001fc112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111700d103fe11161117111611141116111411151113111411131112111311121111111211111110111111100f11100f550e11495649564b70db3cf84270114b8040114dc85982108445bc055003cb1fce810101cf00c91302114b0201114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400010000d200d3001a58cf8680cf8480f400f400cf8101f8c901fb00114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133016d044c218210094a1f7cbae30221821013bd6b32bae302218210d3b50b23bae3022182101ab0a142ba00d500de00e500ef01f65bf842114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113400d601fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f00d702fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610451034114941305649db3c00d800d900de81010b56180259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206e923070e0f82321206ef2d0806f24135f03a101206ef2d0806f245f03561ba8812710a90401a88209e13380a904205616bc93305614de02fc8200e1b821c200f2f482009c88561622bef2f411155615a1561781010b564c59f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206eb39130e30d70f828114b114c114b114a114b114a1149114a114911481149114811471148114711461147114600da00db00b881010b21206ef2d0806f245f0322206ef2d0806f2410235f03f82304206ef2d0806f246c31413014c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc902111902564c01206e953059f45930944133f413e2111701fc114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113211311132113100dc01fc113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c00dd02d4111b111c111b111a111b111a1119111a1119111811191118021118021116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510341023db3cdb3cdb3101b201fd01f831d200d30ffa00d31f301148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a113600df01fc1135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a112211211149112100e001fc1120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a00e102fc0911490908114a080711490706114a060511490504114a040311490302114a0201114b01114cdb3c571757175717571781646d562ab3f2f48200e1415647812710bb945648c2009170e2945649c2009170e2f2f4114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e01fc00e201fc113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d112900e301fc1128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171119111a111911171118111711121116111200e401481111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf553adb3cdb3101fd01f831fa4030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113400e601fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f00e702f8111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c00e800e900128200e8415627b3f2f401f68200abfb5613f2f481104df842564b01c705b3f2f481010bf84256125959f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e281526d016ef2f481010bf8427020564d59c855205023ce810101cf00810101cf00c903111303206e953059f45930944133f413e22081010b564b00ea01f859f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e4581010b21206ef2d0806f235b22206ef2d0806f23303103206ef2d0806f236c21a44130c855205023ce810101cf00810101cf00c9564b01206e953059f45930944133f413e29130e2f842708040f84201114dc800eb01f459821028db358b5003cb1fcecec9413001114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0011471148114711461147114611451146114511441145114411431144114311421143114211411142114111401141114000ec01fc113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b00ed01fc112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111600ee0154111511161115111411151114111311141113111211131112111111121111111011111110550edb3cdb3101fd03fc8f7a31d200d30f3001114901114adb3c5711571181646d562cb3f2f48200ba975649812710bbf2f4114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b1139e02101fc00f000f301fc1138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112400f101fc112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111111111211110e11100e10df00f2010c551cdb3cdb3101fd044a8210ea3f3bddbae302218210f789340abae302218210ab78b3cfbae3022182101ba0fefaba00f400fd0106011301f831fa40fa00d31fd31f301148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a113600f501fc1135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a112211211149112100f601fc1120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a00f702ac0911490908114a080711490706114a060511490504114a040311490302114a0201114b01114cdb3c8200b0f0564bc20094564dc2009170e295564c564ebb9170e2f2f48200a0862d81010b564c59f40b6fa192306ddf01fc00f801e6206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e26ef2f481010bf8425615598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d080564dbe9170e2f2f481010b70f823564e4134011150011151c800f901f855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc9103d02114c0201114a01206e953059f45930944133f413e20c5648a081010bf842114c206ef2d08001114aa1031112030211490201114b01810101216e955b59f4593098c801cf004133f441e211441148114411431147114300fa01fc114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e00fb01fc112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d111900fc01b81118111c11181117111b11171116111a111611151119111511141118111411131117111311121116111211111115111111101114111011130e11120e0d11110d0c11100c5e3b5e39107b106a105910481037465010344300db3cdb3101fd01f45bf8422b81010b2259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e2817625216eb3f2f48200cd11f82322206ef2d0806f2510245f0423206ef2d0806f25145f04a0bef2f4f82321206ef2d0806f2510245f04a12100fe01f4206ef2d0806f256c415210bc9b3020206ef2d0806f256c41de21206ef2d0806f255f0401a821206ef2d0806f256c41a90421206ef2d0806f2510345f04a18200aeff21c200f2f481010b22206ef2d0806f255f0423206ef2d0806f2510345f0423a024206ef2d0806f2510245f0425206ef2d0806f25145f040600ff02f6206ef2d0806f256c411034413016c855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc94ee05230206e953059f45930944133f413e251dca00d0c01114901114a5649564b70db3cf84270114b8040114dc85982103764fe765003cb1fce810101cf00c91302114b0201114c010100010202f48200f9b222c200f2f4813bf9564623bef2f4114521a1f828f828db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d07011497f06804008c85520821051a5c3d15004cb1f12cb3f01fa02cec91605114905041149045a1036453304c8cf858001b401010058ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001fc5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b010301fc113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126010401fc112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311110105012c1110111211100f11110f0e11100e10df551cdb3cdb3101fd01fa31d33f308200b2252bf2f422c200f2e5918200a564f82327a12abef2f4114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138010701fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123010801fc112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce0109023410bd10ac109b108a107910681057104610354430db3cdb3cdb31010a01fd02dc249130e1f8446e97f825f8157ff864def81025a908810101270259f40c6fa192306ddf206e915be0537aa88064a9045188a128c20095103937355be30d81010123206ef2d08028103401206e953059f45a30944133f414e206a4f8236d70f84221804026a509206ef2d080490bc8010b011201f421206ef2d080f828114b114d114b114a114c114a1149114d11491148114c11481147114d11471146114c11461145114d11451144114c11441143114d11431142114c11421141114d11411140114c1140113f114d113f113e114c113e113d114d113d113c114c113c113b114d113b113a114c113a1139114d1139010c01fc1138114c11381137114d11371136114c11361135114d11351134114c11341133114d11331132114c11321131114d11311130114c1130112f114d112f112e114c112e112d114d112d112c114c112c112b114d112b112a114c112a1129114d11291128114c11281127114d11271126114c11261125114d11251124114c1124010d01f81123114d11231122114c11221121114d11211120114c1120111f114d111f111e114c111e111d114d111d111c114c111c111b114d111b111a114c111a1119114d11191118114c11181117114d11171116114c11161115114d11151114114c11141113114d11131112114c11121111114d11111110114c11100f114d0f010e02f60e114c0e0d114d0d0c114c0c0b114d0b0a114c0a09114d09102807114d07102605114d05102403114d0312564c59db3c333334114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a01b2010f01fc1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125011001fc112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114111311151113111211141112111111131111111011121110011100400f11110f0e11100e10df10ce10bd10ac109b108a10791068105710464515503300ae5520821056bbaafa5004cb1f12810101cf00ce810101cf00c94730195a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00507610451202fe8efc31d200fa00d31fd307301148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a1136e00114011a01fc1135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a1122112111491121011501fc1120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a011602f40911490908114a080711490706114a060511490504114a040311490302114a0201114b01114cdb3c3838383881646d562ab3f2f482008d7e5647c200945648c2009170e2945649c2009170e2945649c1659170e2f2f4114411481144114311471143114211461142114111451141114011441140113f1143113f01fc011701fc113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a011801fc1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a1116111511191115011901781114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d5e385533db3cdb3101fd044c218210c61e9667bae3022182108f9872bdbae302218210f5708ab5bae30221821017df7398ba011b01200124012f01f831d20030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134011c01fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f011d02fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c572d01fc011e01fe5648937f572ede114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134011f01fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e012e01f85b57208109def842562ec705f2f4f823114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135012101f4113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a11281127112911271126112811261125112711251124112611241123112511231122112411221121112311211122012201fc111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610350123010c4430db3cdb3101fd01fa31d33f31d200d307d430d0114811491148114711491147114611491146114511491145114411491144114311491143114211491142114111491141114011491140113f1149113f113e1149113e113d1149113d113c1149113c113b1149113b113a1149113a113911491139113811491138113711491137113611491136012501fc113511491135113411491134113311491133113211491132113111491131113011491130112f1149112f112e1149112e112d1149112d112c1149112c112b1149112b112a1149112a112911491129112811491128112711491127112611491126112511491125112411491124112311491123112211491122112111491121012601fc112011491120111f1149111f111e1149111e111d1149111d111c1149111c111b1149111b111a1149111a1119114911191118114911181117114911171116114911161115114911151114114911141113114911131112114911121111114911111110114911100f11490f0e11490e0d11490d0c11490c0b11490b0a11490a012702f8091149090811490807114907061149060511490504114904031149030211490201114a01114bdb3c5726573856478e177f70114ac0039f573f573f7057458064113f805a113fde9f57488200cf12562bf2f4707f114901e28be456d657267656e63795061757365870564a91719120e2114a114c114a1149114b11490189012801fc1148114a1148114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113c113d113c113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134012901f8113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b112903112a03112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f012a02fe111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710465502114ddb3cf84270016a012b01fc80408be456d657267656e63795061757365822114f91719122e210351201114f01c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00012c01fc114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133012d01fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e012e01bc111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101fd043ce30221821079b9e4c3bae30221821010f7c0f7bae3022182100952917dba01300136013a014104fc31d33f31d30fd430d001114901114adb3cdb3c817020564ac01ef2f456498b6536574466565801114320564c01114edb3cf8427080408b6536574466565810340201114f01114ec8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91302114b0201114c015a6d6d40037fc8cf8580ca000189018a016a013102fc89cf16ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11390132013300011001fc1138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124013401f8112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f013501180e11100e10df551cdb3cdb3101fd03f831d33f31fa40d430d001114901114adb3cdb3c573f8200e20f8d0860000000000000000000000000000000000000000000000000000000000000000004564a01c705b3f2f48bb536574547265617375727981148114a11481147114911471146114811461145114711451144114611441143114511431142114411420189018a013701fc114111431141114011421140113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c013801fc112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117013902d01116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544037050037101db3cf8427080408bb5365745472656173757279854140271c8016a015a01fe31d33f31d30fd30fd30fd430d01148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a1136013b01fc1135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a1122112111491121013c01fc1120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a013d03fe0911490908114a080711490706114a060511490504114a040311490302114a0201114b01114cdb3cdb3c573a573a573a81691c5647c06496564881012cba9170e2945649c0059170e2f2f456468bc536574416e74695768616c6581147114a11471146114911461145114811451144114711441143114611431142114511420189018a013e01f4114111441141114011431140113f1142113f113e1141113e113d1140113d113c113f113c01113e0101113c011138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f112e1131112e112d1130112d112c112f112c013f01fc112b112e112b112a112d112a1129112c11291128112b11281127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111c111f111c111b111e111b111a111d111a1119111c11191118111b11181117111a1117014002e21116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a1069105810471036102510244300705110114ddb3cf8427080408bc536574416e74695768616c65822103558114fc8016a015202fe8efb31d33f31d200fa00d31fd307d430d01148114b11481147114a11471146114911461145114b11451144114a11441143114911431142114b11421141114a1141114011491140113f114b113f113e114a113e113d1149113d113c114b113c113b114a113b113a1149113a1139114b11391138114a1138113711491137e0210142014d01fc1136114b11361135114a11351134114911341133114b11331132114a11321131114911311130114b1130112f114a112f112e1149112e112d114b112d112c114a112c112b1149112b112a114b112a1129114a11291128114911281127114b11271126114a11261125114911251124114b11241123114a1123112211491122014301f81121114b11211120114a1120111f1149111f111e114b111e111d114a111d111c1149111c111b114b111b111a114a111a1119114911191118114b11181117114a11171116114911161115114b11151114114a11141113114911131112114b11121111114a11111110114911100f114b0f0e114a0e0d11490d0c114b0c014403fa0b114a0b0a11490a09114b0908114a080711490706114b0605114a050411490403114b0302114a0201114c01114ddb3cdb3c5734573457345735814b505648c200945647c2009170e2945649c2009170e2945649c1659170e2f2f456458ba5365744275796261636b870564891719120e21148114c11481147114b11470189018a014501f41146114a1146114511491145114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d113903113c031137113b11371137113a113711371139113703113803113311371133113211361132014601fc113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d014703fe111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c107b106a1059104810375502114ddb3cf8427080408922114f016a0148014900145365744275796261636b01f691719122e210351201114f01c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114711481147114611471146114511461145014a01fc114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130014b01fc112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b014c0198111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101fd044a82100490d605bae3022182102fb11c16bae3022182102a297933bae3022182102882f1e8ba014e0156015b016203f831d33f31d200d430d001114901114adb3cdb3c573956488bd546f67676c6554726164696e67870564b91719120e2114b114c114b114a114b114a1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f0189018a014f01f8113e113f113e113d113e113d03113d03113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a015001fc1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115015102c41114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610455502114ddb3cf8427080408bd546f67676c6554726164696e67822114f91719122e210351201114f01c8016a015201f4553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114711481147114611471146114511461145114411451144114311441143015301fc114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e015401fc112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119015501801118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101fd03f831d33f31fa40d430d001114901114adb3cdb3c572f8200cf12562df2f48d0860000000000000000000000000000000000000000000000000000000000000000004564901c705b3f2e4cc8bc526f746174654f7261636c6581148114a11481147114911471146114811461145114711451144114611441143114511430189018a015701fc114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112e1130112e112d112f112d015801fc112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118015902de1117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544037050037101db3cf8427080408bc526f746174654f7261636c65854140271c8016a015a01ba553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00db3cdb3101fd01f831fa4030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134015c01fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f015d02fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c572e01fc015e01fa572e8d0860000000000000000000000000000000000000000000000000000000000000000004564801c705b3f2e4cc114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a015f01f61139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e7f112e112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125016001fc112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112111111121111111011111110016101140f11100f550edb3cdb3101fd02fe8efd31d33f31d30fd307d430d0114811491148114711491147114611491146114511491145114411491144114311491143114211491142114111491141114011491140113f1149113f113e1149113e113d1149113d113c1149113c113b1149113b113a1149113a1139114911391138114911381137114911371136114911360163016f01fc113511491135113411491134113311491133113211491132113111491131113011491130112f1149112f112e1149112e112d1149112d112c1149112c112b1149112b112a1149112a112911491129112811491128112711491127112611491126112511491125112411491124112311491123112211491122112111491121016401fc112011491120111f1149111f111e1149111e111d1149111d111c1149111c111b1149111b111a1149111a1119114911191118114911181117114911171116114911161115114911151114114911141113114911131112114911121111114911111110114911100f11490f0e11490e0d11490d0c11490c0b11490b0a11490a016503ee091149090811490807114907061149060511490504114904031149030211490201114a01114bdb3cdb3c572c57408200e8415625b3f2f48200f2195648c01e945649c1659170e2f2f45648f823112ba4810101f823564d80647fc855305034810101cf0001c8cecd810101cf00ca00c902112b02562a010189018a016601f4206e953059f45a30944133f415e21128a48b9526562616c616e636581149114a114911481149114811471148114711461147114611451146114511441145114411431144114302114202114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139016701f8113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112c112e112c112a112d112a112b112c112b1129112b112901112a01112811291128112711281127112611271126112511261125112411251124016801fe112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e20016902fe564c01114edb3cf8427080408b9526562616c616e6365810340201114f01114ec8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91302114b0201114c015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901016a016c01f65728810101f8235623055521112a7f7070c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90211200201112501561f01206e953059f45a30944133f415e2810101f8232103111f03562059216e955b59f45a3098c801cf004133f442e2016b002c561da4f8231125111e1120111e01111f0102111e020101f4fb00114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133016d01fc113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e016e01c8111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3cdb3101fd044ee02182106920939fbae302218210dc63850bbae302218210d890b03fbae3022182109d3b8cb1ba017001800185019001fc31d33ffa00d31fd207d307301148114b11481147114a11471146114911461145114b11451144114a11441143114911431142114b11421141114a1141114011491140113f114b113f113e114a113e113d1149113d113c114b113c113b114a113b113a1149113a1139114b11391138114a11381137114911371136114b1136017101fc1135114a11351134114911341133114b11331132114a11321131114911311130114b1130112f114a112f112e1149112e112d114b112d112c114a112c112b1149112b112a114b112a1129114a11291128114911281127114b11271126114a11261125114911251124114b11241123114a11231122114911221121114b1121017201fc1120114a1120111f1149111f111e114b111e111d114a111d111c1149111c111b114b111b111a114a111a1119114911191118114b11181117114a11171116114911161115114b11151114114a11141113114911131112114b11121111114a11111110114911100f114b0f0e114a0e0d11490d0c114b0c0b114a0b0a11490a017303fe09114b0908114a080711490706114b0605114a050411490403114b0302114a0201114c01114ddb3cdb3c5724f823112ba4810101f8232104112d04413001114e01216e955b59f45a3098c801cf004133f442e2564cc002961149811388bc93574970e2948046573fde564bc00394564ac2509170e2948028573fde564bc0010189018a017402fa94564ac1ce9170e299573e7057458050113ede114bc001941149c1e293574970e29256349170e29556335633be9170e298f8235630a15632be9170e2925745e30d114311481143114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a0175017d01fc114411491144114311481143114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130017601fc112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281129112c11291128112b11281125112a1125112411291124112311281123112211271122112111261121112211251122111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b017702f6111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384715552006db3c0211480203114703112b1146112b0178017b01f630573356365634a88064a904205649bc93305647de205644bc93305642de11375637a15637c2008e2011485637a1113e5637a011315637a011435637a1113e1148113e11431131113ede1132a4f8237070218040113cc859821070acb7bb5003cb1f810101cf00810101cf00c9564a04113c01146d50436d5033c80179016a89cf16ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00113211371133017a00016001fc112a1145112a041144040211430203114203112b1141112b112a1140112a04113f0402113e0203113d03112b113c112b112a113b112a04113a040211390203113803112b1137112b112a1136112a041135040211340203113303112b1132112b112a1131112a0411300402112f0203112e03112b112d112b112a112c112a017c00fc04112b0402112a02031129030411280402112702112411261124011125010311240304112304021122020311210301112001111f04111e0402111d0203111c0301111b01111a041119040211180203111703011116011115041114040211130203111203011111011110104f102e103d50cb104a1029103850761045410401fc1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c11271128112b11281127112a1127017e01fc112411291124112311281123112211271122112111261121112011251120112111241121111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a1115111411191114111311181113111211171112111111161111111011151110017f015a0f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384715444406db3cdb3101fd04fe31d33f31d307d30731d31f31d430d001114901114adb3cdb3c5724f823810101f82301114c806470c855305034810101cf0001c8cecd810101cf00ca00c902112a0201114b01562901206e953059f45a30944133f415e21127a45648c0038e1357255737573d573d574257437f70708064805ae30e114611481146021147020189018a0181018200441148c00294803c573fde041147040311450302113f0201113e01113704112404552001f8114411461144114311451143114211441142114111431141114011421140011141011140113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113803113903113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f018301fc112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112611291126112411281124112511271125041126041123112511231124112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b1119018401b01118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105746134454db3cdb3101fd01fc31d33f31d307810101d700d401d001d307301148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a1138113711491137018601fc1136114a11361135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a1122018701f81121114911211120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c018804da0b11490b0a114a0a0911490908114a080711490706114a060511490504114a040311490302114a0201114b01114cdb3cdb3c5724f8238200d120564d5629bef2f4112ba45649c0018e13574157488170201149c01e01114901f2f4801ee30e810101f8230201114b01114c7fc80189018a018b018c00268200ccd0f8425631c705f2f48151d0562ff2f40024562d9e8200dfe4f8235626a15627bef2f4de00ae5649c0028e15574057488131b45649c2ff945649c1659170e2f2f48e331149c0049c57358200c5825649c200f2f49e57498200f8d9f2f0113411481134e2113e1148113e1134114711341134113e1134e21148113e113f01fe55305034810101cf0001c8cecd810101cf00ca00c90211270201114901562601206e953059f45a30944133f415e21124a4114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e114011411140113c1140113c113b113f113b113a113e113a1139113d11391138113c1138018d01f41137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281129112b11291126112a11261124112911241128112311271123018e01fc112211261122112111251121112311241123111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d018f013a0c11100c10bf10ae109d108c107b106a105910481037460504db3cdb3101fd043ce30221821009d21b11bae30221821023019716bae302218210bb8d8491ba0191019a01a701ae01fc31d33ffa4031fa00308130a1f2f0561f8101012359f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f481188621206ef2d0806f29185f08b39b21206ef2d0806f296c81b39170e2019201f4f2f4114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a113911491139113811481138113711491137113611481136113511491135113411481134019301fc113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a112911491129112811481128112711491127112611481126112511491125112411481124112311491123112211481122112111491121112011481120111f1149111f019401fc111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a091149090811480807114907019503fe061148060511490504114804031149030211480201114901114a8122d4114c5649db3c01114d01f2f4561b810101564a59f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e27053016eb39132e30d564ba056495622a8812710a90481010101a10196019700345b20206ef2d0806f2510345f0401206ef2d0806f2510245f040102fa03a45321b9564d5444305240c855405045810101cf0012810101cf00810101cf0001c8810101cf0012ca00cdc902111f0213564c01206e953059f45a30944133f415e2111d01be9902114a025748574830e30d114411481144114311471143114211461142114111451141114011441140113f1143113f113e1142113e0198019900fa114a206ef2d0806f295b105610461036102681010147777f70c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc903111f031201114901206e953059f45a30944133f415e2011118011147a0111b1147111b114511461145111b1145111b111701fc113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d112901e101f831d33f30114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134019b01fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f019c02fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c561f01fc019d01f6810101564b59f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f4114711491147114611481146114511491145114411481144114311491143114211481142114111491141019e01fc114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a113911491139113811481138113711491137113611481136113511491135113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c019f01fc112b1149112b112a1148112a112911491129112811481128112711491127112611481126112511491125112411481124112311491123112211481122112111491121112011481120111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a11191149111911181148111811171149111701a002f81116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a09114909081148080711490706114806051149050411480403114903021148020111490111488122d4114a564bdb3c01114b01f2f48159c5564901a101a2005281010120562050334133f40c6fa19401d70030925b6de2206e923070e0f82301206ef2d080a15622b901f2206ef2d0806f296c81b3f2f41148206ef2d0806f2930104710368101017f27515a05104a5a1ac855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90311210301114d01206e953059f45a30944133f415e28b65365744665658564b0101a301f401f90101f901ba94574057498e358bd546f67676c6554726164696e67801114b0101f90101f901ba9a5737111cc3001136111c92571de2111c1148111c111c113e111ce2114511481145114411471144114311461143114211451142114111441141114011431140113f1142113f111c1141111c113d1140113d01a401fc113c113f113c113b113e113b113a113d113a1139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1129112c11291128112b112801a501fc1127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111d111f111d111b111e111b111a111d111a1119111c11191118111b11181117111a111711161119111611151118111511141117111411131116111301a601481112111511121111111411111110111311100f11120f0e11110e0d11100d552cdb3cdb3101fd01f831fa4030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113401a801fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f01a902fa111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c3101fc01aa01fc820083588d0860000000000000000000000000000000000000000000000000000000000000000004564a01c705b3f2f4114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b01ab01fc113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112601ac01fc112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111511141115111411131114111311121113111211111112111101ad01501110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510344130db3cdb3101fd02fe8efc31d33ffa00fa40308200dd3bf842564cc705f2f48142a622c200f2f48109228d08600000000000000000000000000000000000000000000000000000000000000000045220c705b3f2f4f828114a114c114a1149114b11491148114a1148114711491147114611481146114511471145114411461144114311451143e001af01c701fc114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e01b001fc112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b111901b102b21118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104613db3cdb3cdb3101b201fd013682009d4923c200f2f48200e184564824bef2f4114722a11147db3c01b302f482009d4923c200f2f4f82814db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040f828238b081059104a103bc855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec91610455a1036453304c8cf8580ca00cf8440ce0101b401c6011688c87001ca005a02cecec901b5022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d901b601b80157a65ec0bb513434800067fe803e903e9020404075c0154c1b05273e903e901640b4405c150488b8b6cf1b112001b701145321db3c30546440524001c204c201d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ffa00fa40fa40810101d70055306c149cfa40fa405902d10170541222e205e30203d70d1ff2e082218210178d4519bae3022182100f8a7ea5bae30221821051a5c3d1ba01b901ba01bd01c100f6038020d7217021d749c21f9430d31f01de208210178d4519ba8e2a30d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e082107bdd97deba8e29d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e05f0503d431d33ffa00fa40fa4031fa005327db3c8200c241f8422bc705936c217f8e32f8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705e2f2f48142a624c200f2f45163a021c20093365f04e30d400301c201bb01bc00b0147f50437308c8553082107362d09c5005cb1f13cb3f01fa02cecec92404035066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00002cc87f01ca0055305043fa02ce12ce810101cf00c9ed5401fe31d33ffa00fa40fa40f40431fa008142a625c200f2f48138c6f84228c705f2f48109228d08600000000000000000000000000000000000000000000000000000000000000000045250c705b3f2f48121d45385bef2f48200da29f823500ba1c2041af2f4f82324a71e812710a90420c101923071de5350a18200b67621c20001be02fef2f45096a15349db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f80402c514e104d4b1311121ac855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec910561058104d1038591036453304c8cf8580ca00cf8440ce01fa028069cf4001c201bf0180025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0024c20093303330e30d4003c87f01ca0055305043fa02ce12ce810101cf00c9ed5401c000b270705414657304c855308210eb527edf5005cb1f13cb3f01fa02cecec92604034666146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0003f28f6731d33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a15145db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040228b082a104a1039544b30c8e0018210595f07bcbae3025f05f2c08201c201c301c40018f82ac87001ca005a02cecec900da55508210178d45195007cb1f15cb3f5003fa02cece01fa02cec94016504405031036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004003c87f01ca0055305043fa02ce12ce810101cf00c9ed5401fed33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a1707f541435804008c8553082107bdd97de5005cb1f13cb3f01fa02cecec9260443135066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001c500304003c87f01ca0055305043fa02ce12ce810101cf00c9ed54004afa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00044c218210cfc66cbdbae3022182103c134728bae302218210f1822da1bae30221821083b8144aba01c801cf01d601dc01f831fa4030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113401c901fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f01ca02fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c573f01fc01cb01fe81646d562db3f2f481244b8d0860000000000000000000000000000000000000000000000000000000000000000004564a01c705b3f2f4114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113d113e113d113c113d113c113b113c113b01cc01fc113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112911281129112811271128112711261127112601cd01fc112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111511141115111411131114111311121113111211111112111101ce01201110111111100f11100f550edb3cdb3101fd01fc31d30fd307d30fd30fd30f301148114b11481147114a11471146114911461145114b11451144114a11441143114911431142114b11421141114a1141114011491140113f114b113f113e114a113e113d1149113d113c114b113c113b114a113b113a1149113a1139114b11391138114a11381137114911371136114b113601d001fc1135114a11351134114911341133114b11331132114a11321131114911311130114b1130112f114a112f112e1149112e112d114b112d112c114a112c112b1149112b112a114b112a1129114a11291128114911281127114b11271126114a11261125114911251124114b11241123114a11231122114911221121114b112101d101fc1120114a1120111f1149111f111e114b111e111d114a111d111c1149111c111b114b111b111a114a111a1119114911191118114b11181117114a11171116114911161115114b11151114114a11141113114911131112114b11121111114a11111110114911100f114b0f0e114a0e0d11490d0c114b0c0b114a0b0a11490a01d202fa09114b0908114a080711490706114b0605114a050411490403114b0302114a0201114c01114ddb3c573a573a573a573d573d81646d5629b3f2f4811f4c5645c01e945647c1659170e2945646c0649170e296564881012cba9170e2945649c0059170e2f2f411431148114311421147114211411146114111401145114001fc01d301fc113f1144113f113e1143113e113d1142113d113f1141113f113f1140113f113a113f113a1139113e11391138113d1138113a113c113a1138113b11381139113a1139113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b01d401fc112a112f112a1129112e11291128112d11281127112c11271126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b111601d501881115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d5547db3cdb3101fd01f831d20030114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113401d701fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f01d802fc111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411494130db3c573901fc01d901f481646d562db3f2f4114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911371138113711361137113611351136113511341135113401da01fc113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f01db01c8111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101fd02fe8efc31d200fa00d31fd307301148114a11481147114911471146114a11461145114911451144114a11441143114911431142114a11421141114911411140114a1140113f1149113f113e114a113e113d1149113d113c114a113c113b1149113b113a114a113a1139114911391138114a11381137114911371136114a1136e001dd01e301fc1135114911351134114a11341133114911331132114a11321131114911311130114a1130112f1149112f112e114a112e112d1149112d112c114a112c112b1149112b112a114a112a1129114911291128114a11281127114911271126114a11261125114911251124114a11241123114911231122114a112211211149112101de01fc1120114a1120111f1149111f111e114a111e111d1149111d111c114a111c111b1149111b111a114a111a1119114911191118114a11181117114911171116114a11161115114911151114114a11141113114911131112114a11121111114911111110114a11100f11490f0e114a0e0d11490d0c114a0c0b11490b0a114a0a01df02fa0911490908114a080711490706114a060511490504114a040311490302114a0201114b01114cdb3c573457345734573581646d562ab3f2f4814b505647c200945648c2009170e2945649c2009170e2945649c1659170e2f2f4114411481144114311471143114211461142114111451141114011441140113f1143113f01fc01e001fc113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113511381135113311371133113311351133113311341133112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d112901e101fc1128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a111611151119111511141118111401e2015c1113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c553bdb3cdb3101fd0118018210946a98b6bae302114801e401fad33f30c8018210aff90f5758cb1fcb3fc9114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113601e501fc113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112311221124112211211123112101e601fc112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106801e7015e1057104610354430f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00db3cdb3101fd01fe30114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113201e901fc113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d01ea02be111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c705748db3c01fc01fd01fe30114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113201ec01fc113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d01ed02fc111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c11471148114711461148114611451148114511441148114411431148114311421148114201fc01ee01fc114111481141114011481140113f1148113f113e1148113e113d1148113d113c1148113c113b1148113b113a1148113a113911481139113811481138113711481137113611481136113511481135113411481134113311481133113211481132113111481131113011481130112f1148112f112e1148112e112d1148112d01ef01fc112c1148112c112b1148112b112a1148112a112911481129112811481128112711481127112611481126112511481125112411481124112311481123112211481122112111481121112011481120111f1148111f111e1148111e111d1148111d111c1148111c111b1148111b111a1148111a11191148111911181148111801f002f61117114811171116114811161115114811151114114811141113114811131112114811121111114811111110114811100f11480f0e11480e0d11480d0c11480c0b11480b0a11480a09114809114808070655408168f41149db3c5727572d572d572d1123b301114601f2f47070564311461147114611451146114501f101f20010f8235623a15624bb01fc114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113211311132113111301131113001f301f6112f1130112f112e112f02112d0201112c01112a112b112a1129112a1129112811291128112711281127112611271126112511261125701126112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a01f401b41119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105614154330db3c01fd0268e30282f0228aefdc558b3d1b9bb87fc33d71a2e40504be5a8d6acc8d737ee0215d75d86cbae3025f0f5f0f5f0f5f0f5f0df2c08201f601f901fe30114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113201f701fc113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d01f802ce111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c57265738707f1139011126db3c01fc01fd01fc114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113201fa01fc113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d01fb02d4111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3c8200ae97562eb3f2f4112eb3112edb3c01fc01fd001882008aabf8425648c705f2f401f6c87f01ca001149114811471146114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e001fe010adb3cc9ed5401ff01f4011149011148fa0201114601ca0001114401ce01114201cc1140c8cc01113ffa0201113dfa0201113b01cb0f01113901cb0701113701ce011135fa02011133fa0201113101cb0f01112f01cb0f01112d01cb0f01112b01ca0001112901ca00011127fa02c8011126fa0201112401cb1f01112201cb0701112001020001fe810101cf0001111e01810101cf0001111cfa0201111afa021118c8ce01111701ca0001111501ca0001111301810101cf0001111101810101cf001ff4001df4000bc8810101cf001acb0718ca0016cb1f14810101cf0012cb1f810101cf00cb1fcb0ff40001c8810101cf0013f40013f4005003fa0213ca0013cb0f5003fa02020100c614cb1f14f4005004fa025004fa0204c8f40015ca0016cb0f16f40016ca005006fa025006fa0216f40016ca005006fa0216cb1f16cb0716810101cf0016810101cf00c85007fa0218f40018810101cf0018f40019ce17cb0fcd12cd14cdcd13cd12cdcd1eb91570');
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
    {"name":"QuasarMaster$Data","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}},{"name":"reserveBalance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"custodyBalance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeBurnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalBurned","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalFeesCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldownSeconds","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"tradingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackThreshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"buybackBurnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lastBuybackTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBuybacks","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalQsrBurnedViaBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalTonSpentOnBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"aiOracle","type":{"kind":"simple","type":"address","optional":false}},{"name":"aiEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiFullAutonomy","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lastRebalanceTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"signalCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceHistory","type":{"kind":"dict","key":"int","value":"int"}},{"name":"anomalyLog","type":{"kind":"dict","key":"int","value":"AIRecommendation","valueFormat":"ref"}},{"name":"anomalyIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"minConfidence","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"emergencyPause","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiActionCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastAiActionTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"heartbeatTimeout","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ownerOverrideWindow","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"vetoThresholdBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"aiActionLog","type":{"kind":"dict","key":"int","value":"AIActionLog","valueFormat":"ref"}},{"name":"aiActionIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pendingAiActions","type":{"kind":"dict","key":"int","value":"int"}},{"name":"vetoLog","type":{"kind":"dict","key":"int","value":"VetoState","valueFormat":"ref"}},{"name":"totalVetoStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"stakingApyBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stakingMinStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingLockPeriod","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"stakers","type":{"kind":"dict","key":"address","value":"StakeInfo","valueFormat":"ref"}},{"name":"totalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingRewardsPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"pendingQsrDeposits","type":{"kind":"dict","key":"address","value":"int"}},{"name":"referralEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"referralRewardBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referrals","type":{"kind":"dict","key":"address","value":"ReferralInfo","valueFormat":"ref"}},{"name":"vestingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"teamAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"teamClaimed","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"vestingSchedules","type":{"kind":"dict","key":"address","value":"VestingInfo","valueFormat":"ref"}},{"name":"lotteryEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lotteryTicketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryDrawInterval","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lotteryJackpotShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lotteryRound","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryLastDraw","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryJackpot","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryTickets","type":{"kind":"dict","key":"int","value":"address"}},{"name":"lotteryTicketCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryWinners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"defiAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"defiFeeShareBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Mint | BurnNotification | "Stop Minting" | TokenNotification | FeeTransfer | TriggerBuyback | Stake | Unstake | ClaimRewards | SetStakingConfig | RegisterReferral | SetReferralConfig | AddVesting | ClaimVested | TriggerLottery | SetLotteryConfig | AIGrantFullAutonomy | AIHeartbeat | AIEmergencyPause | AISetFee | AISetTreasuryDirect | AISetAntiWhale | AISetBuybackDirect | AIToggleTrading | AIRotateOracle | AISetOracle | AIRebalance | AIPriceSignal | AIAnomalyAlert | AIGovernanceProposal | AIVetoVote | OwnerOverride | "Claim AI Control" | SetDefiAddress | DefiPayout | SetTreasury | SetFeeConfig | ToggleTrading | SetBuybackConfig | "Resume" | "Toggle AI" | Deploy) {
        
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