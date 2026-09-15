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
        b_0.storeUint(src.feeBps, 16);
        b_0.storeUint(src.feeBurnShare, 8);
        b_0.storeAddress(src.treasury);
        b_0.storeCoins(src.totalBurned);
        const b_1 = new Builder();
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
        b_1.storeInt(src.totalBuybacks, 257);
        const b_2 = new Builder();
        b_2.storeCoins(src.totalQsrBurnedViaBuyback);
        b_2.storeCoins(src.totalTonSpentOnBuyback);
        b_2.storeAddress(src.aiOracle);
        b_2.storeBit(src.aiEnabled);
        b_2.storeBit(src.aiFullAutonomy);
        b_2.storeInt(src.lastRebalanceTime, 257);
        const b_3 = new Builder();
        b_3.storeInt(src.signalCount, 257);
        b_3.storeDict(src.priceHistory, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_3.storeDict(src.anomalyLog, Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation());
        b_3.storeInt(src.anomalyIndex, 257);
        b_3.storeUint(src.minConfidence, 8);
        b_3.storeBit(src.emergencyPause);
        b_3.storeUint(src.aiActionCooldown, 32);
        b_3.storeInt(src.lastAiActionTime, 257);
        b_3.storeUint(src.heartbeatTimeout, 32);
        const b_4 = new Builder();
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
        b_4.storeCoins(src.stakingMinStake);
        b_4.storeUint(src.stakingLockPeriod, 32);
        const b_5 = new Builder();
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
    const _feeBps = sc_0.loadUintBig(16);
    const _feeBurnShare = sc_0.loadUintBig(8);
    const _treasury = sc_0.loadAddress();
    const _totalBurned = sc_0.loadCoins();
    const sc_1 = sc_0.loadRef().beginParse();
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
    const _totalBuybacks = sc_1.loadIntBig(257);
    const sc_2 = sc_1.loadRef().beginParse();
    const _totalQsrBurnedViaBuyback = sc_2.loadCoins();
    const _totalTonSpentOnBuyback = sc_2.loadCoins();
    const _aiOracle = sc_2.loadAddress();
    const _aiEnabled = sc_2.loadBit();
    const _aiFullAutonomy = sc_2.loadBit();
    const _lastRebalanceTime = sc_2.loadIntBig(257);
    const sc_3 = sc_2.loadRef().beginParse();
    const _signalCount = sc_3.loadIntBig(257);
    const _priceHistory = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_3);
    const _anomalyLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), sc_3);
    const _anomalyIndex = sc_3.loadIntBig(257);
    const _minConfidence = sc_3.loadUintBig(8);
    const _emergencyPause = sc_3.loadBit();
    const _aiActionCooldown = sc_3.loadUintBig(32);
    const _lastAiActionTime = sc_3.loadIntBig(257);
    const _heartbeatTimeout = sc_3.loadUintBig(32);
    const sc_4 = sc_3.loadRef().beginParse();
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
    const _stakingMinStake = sc_4.loadCoins();
    const _stakingLockPeriod = sc_4.loadUintBig(32);
    const sc_5 = sc_4.loadRef().beginParse();
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
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _owner = source.readAddress();
    const _content = source.readCell();
    const _walletCode = source.readCell();
    const _reserveBalance = source.readBigNumber();
    const _feeBps = source.readBigNumber();
    const _feeBurnShare = source.readBigNumber();
    const _treasury = source.readAddress();
    const _totalBurned = source.readBigNumber();
    const _totalFeesCollected = source.readBigNumber();
    const _maxTxBps = source.readBigNumber();
    const _maxWalletBps = source.readBigNumber();
    const _cooldownSeconds = source.readBigNumber();
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
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
    source = source.readTuple();
    const _defiAddress = source.readAddress();
    const _defiFeeShareBps = source.readBigNumber();
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function loadGetterTupleQuasarMaster$Data(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _mintable = source.readBoolean();
    const _owner = source.readAddress();
    const _content = source.readCell();
    const _walletCode = source.readCell();
    const _reserveBalance = source.readBigNumber();
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
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, reserveBalance: _reserveBalance, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, pendingQsrDeposits: _pendingQsrDeposits, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners, defiAddress: _defiAddress, defiFeeShareBps: _defiFeeShareBps };
}

export function storeTupleQuasarMaster$Data(source: QuasarMaster$Data) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.owner);
    builder.writeCell(source.content);
    builder.writeCell(source.walletCode);
    builder.writeNumber(source.reserveBalance);
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
    const __code = Cell.fromHex('b5ee9c72420201e400010000bd530000022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d900010069020271000200330201200003001a0201200004000e0201200005000a03fbb2d93b513434800063a2fe903535154800f45636cf38c34451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044de0006a006e000601fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122000702fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f571000080009009481010156210259f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e2003c5f0f57105f0f6c81206e92306d99206ef2d0806f296f09e2206e92306dde03fbb3f5fb513434800063a2fe903535154800f45636cf38c34451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044de0006a006e000b01fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122000c02fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f5710000d0047002e81010120562d50334133f40c6fa19401d70030925b6de2020158000f001602012000100012034aa964ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6ce76ce76ce76ce76ce76c27006a006e0011000e547ba9547ba92b03faa90aed44d0d200018e8bfa40d4d4552003d158db3ce30d114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137006a006e001301fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122001402fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f57100015004f007c81010b2e0259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e203fbac8676a268690000c745fd206a6a2a9001e8ac6d9e718688a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089bc0006a006e001701fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122001802fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f571000190047004881010b5615028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e2020120001b0025020148001c0021020120001d001f0356abeded44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c57105f0f57105f0f57105f0f57105f0f6c81006a006e001e000456390352ab06ed44d0d200018e8bfa40d4d4552003d158db3ce30ddb3c6c996c996c996c996c996c996c996c99006a006e00200024562d5626562656265626562656265622562603fbaf4e76a268690000c745fd206a6a2a9001e8ac6d9e718688a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089bc0006a006e002201fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122002302fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f571000240047001c810101240259f40c6fa192306ddf0201200026002e020120002700290357ad75f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e36443644364436443644364436443644364440006a006e0028002a80645641a1564201564201563f563f563f5644564403fbadc176a268690000c745fd206a6a2a9001e8ac6d9e718688a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089bc0006a006e002a01fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122002b02fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f5710002c002d005481010b56120259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2003c5f0f57105f0f6c81206e92306d99206ef2d0806f236f03e2206e92306dde020162002f00310355a665da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed903006a006e0030000456420355a6f5da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed903006a006e003200045626020120003400410201200035003f0201580036003d020166003700390355a30fb513434800063a2fe903535154800f45636cf38c376cf15c417c3d5c417c3d5c417c3d5c417c3db206006a006e003800022003f9a1e7b513434800063a2fe903535154800f45636cf38c34451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044de006a006e003a01fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122003b02fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f5710003c00470162f828db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d001970347af16f6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab662c0006a006e003e0014564756475647564756470357b6e29da89a1a400031d17f481a9a8aa4007a2b1b679c61bb678ae20be1eae20be1eae20be1eae20be1ed9030006a006e00400104db3c01d3020120004200500201200043004803fbb206fb513434800063a2fe903535154800f45636cf38c34451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044de0006a006e004401fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122004502fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f5710004600470104db3c018400105f0f57105f0f6c810201200049004b0353afdcf6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e364cb64cb64cb64cb64cb64cb64cb64cc0006a006e004a002456385638563856385638563856385638563803fbaebc76a268690000c745fd206a6a2a9001e8ac6d9e718688a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089bc0006a006e004c01fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122004d02fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f5710004e004f0078810101561e0259f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e2003c5f0f57105f0f6c81206e92306d99206ef2d0806f256f05e2206e92306dde02012000510058020120005200540357aff376a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e2b882f87ab882f87ab882f87ab882f87b640c0006a006e005300022103fbac67f6a268690000c745fd206a6a2a9001e8ac6d9e718688a388a408a388a308a388a308a288a308a288a208a288a208a188a208a188a108a188a108a088a108a088a008a088a0089f88a0089f889f089f889f089e889f089e889e089e889e089d889e089d889d089d889d089c889d089c889c089c889c089b889c089bc0006a006e005501fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122005602fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f571000570066005c810101562b0259f40d6fa192306ddf206e92306d8e17d0810101d700d401d001810101d700d20055306c146f04e202012000590067020166005a0062034da3cbb513434800063a2fe903535154800f45636cf38c376cf1b2a9b2a9b2a9b2a9b2a9b2a9b32a006a006e005b01f0562f562f562f562f562f56465631562f562a1147115011471146114f11461145114e11451144114d11441143114c11431142114b11421141114a1141114011491140113f1148113f113e1150113e113d114f113d113c114e113c113b114d113b113a114c113a1139114b11391138114a1138113711491137005c01fc1136114811361135115011351134114f11341133114e11331132114d11321131114c11311130114b1130112f114a112f112e1149112e112d1148112d112c1150112c112b114f112b112a114e112a1129114d11291128114c11281127114b11271126114a11261125114911251124114811241123115011231122114f1122005d01f81121114e11211120114d1120111f114c111f111e114b111e111d114a111d111c1149111c111b1148111b111a1150111a1119114f11191118114e11181117114d11171116114c11161115114b11151114114a11141113114911131112114811121111115011111110114f11100f114e0f0e114d0e0d114c0d0c114b0c005e02fc0b114a0b0a11490a091148090811500807114f0706114e0605114d0504114c0403114b0302114a02011149011148db3c091151090811500807114f0706114e0605114d0504114c0403114b0302114a02011149011148115111481147115011471146114f11461145114e11451144114d11441143114c11431142114b114201d3005f01fc1141114a1141114011491140113f1148113f113e1147113e113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f112e1137112e112d1136112d006001fc112c1135112c112b1134112b112a1133112a1129113211291128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a111911221119111811211118006100901117112011171116111f11161115111e11151114111d11141113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a03f9a10fb513434800063a2fe903535154800f45636cf38c34451c4520451c4518451c4518451445184514451045144510450c4510450c4508450c450845044508450445004504450044fc450044fc44f844fc44f844f444f844f444f044f444f044ec44f044ec44e844ec44e844e444e844e444e044e444e044dc44e044de006a006e006301fc113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122006402fc112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3c57105f0f57105f0f571000650066006e81010b56180259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2003c5f0f57105f0f6c81206e92306d99206ef2d0806f246f04e2206e92306dde0347adbff6a268690000c745fd206a6a2a9001e8ac6d9e7186ed9e367ab67ab67ab67ab662c0006a006e00680014561a561a561a561a561904dceda2edfb01d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e8bfa40d4d4552003d158db3ce30d11499a5f0f5f0f5f0f5f0f5f0de05647d749c21fe3001147f9012082f07f309c3a7adc967de7844945367788045b18adf5557c5bf60508ec7c231da6deba006a006e007301c902f46d6d6d6d6d6d6d6d6d6d6d707f53f1801e803256135333806481012c800f7f7f258212540be400810e1054772253007070547222804b70815460238208093a80f823820151808103e853447f8107d08218174876e8008208278d0053447f561a7f53337f82103b9aca005610562d71f823536689113811461138018d006b01fc1137114511371136114411361137114311371136114211361135114111351134114011341133113f11331132113e11321131113d11311130113c1130112f113b112f112e113a112e112d1139112d112c1138112c112b1137112b112a1136112a112911351129112811341128112711331127112611321126112511311125006c01fc1124113011241123112f1123112c112e112c1122112d11221121112c11211120112b1120111f112a111f112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a1119112211191118112111181117112011171116111f11161117111e11171115111d11151116111c1116006d009e1117111b11171114111a11141113111911131112111811121111111711111110111611100f11140f0e11130e1110111211100d11110d5e3c10be10ad5e29108a1079106810571046103541408101f402f8db3c5748114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133006f007101f6fa00d200fa40d4d401d0d4fa00d30fd307fa40fa00fa00d30fd30fd30fd200d200fa00fa00d31fd307d430d0810101d700810101d700fa00fa00d430d0fa40d200d200810101d700810101d700f404f404d430d0810101d700d307d200d31f810101d700d31f810101d700d31fd30ff404d430d0810101d700f404007000c4f404fa00d200d30ffa00d31ff404fa00fa00d430d0f404d200d30ff404d200fa00fa00f404d200fa00d31fd307810101d700810101d700d430d0fa00f404810101d700f404fa40d30f3011441148114411441147114411441146114411441145114401fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e007200b4111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e04541147d31f218210642b7d07bae3022182107bdd97debae3022182107362d09cbae302218210eb527edfba0074007b0081008604f231fa00fa4030011148011149db3c8142a65649c200f2f481540c8d0860000000000000000000000000000000000000000000000000000000000000000004564b01c705b3f2f4db3cdb3c8134a65647f2f45647563da8812710a9045648c2009a564982009db402bbf2f49130e211475648a01147564956497000d8007501de007600108200dfcc563af2f402f6db3cf84270114a8040114cc85982103345ab925003cb1f810101cf00cec91302114a0201114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114511471145114411461144114311451143114211441142114111431141007700780108f828db3c019601fc114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c007901fc112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117007a01701116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3cdb3101df02fc31d33f31fa00fa40fa40308142a623c200f2f4f8285220db3c81287bf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4114822a18d0860000000000000000000000000000000000000000000000000000000000000000004564901c705b30197007c02fe8ec0707080408804114c04146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00925748e2f8427003804003c8598210d28b2faf5003cb1f810101cf00cec943305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0007d007e0026000000004578636573732072657475726e656402f88a9d58cf8680cf8480f400f400cf81e2f400c901fb00114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113501a1007f01fc113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120008001e0111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3cdb3101df02fa31d33f31fa00fa40308142a622c200f2f4f828f828db3c8130cdf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4561381010b228101014133f40a6fa19401d70030925b6de281010b216e9231229801206ef2d08023a0e203111503120197008201fc810101216e955b59f4593098c801cf004133f441e2011141011112a01145114711451144114611441143114511431142114411421141114311411142113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135008301fc113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120008401fc111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610350085010c4403db3cdb3101df043ce302218210cfe1fd3cbae302218210bef0e904bae302218210ff633be1ba008700a300a700b402fc31d33ffa00fa40308142a622c200f2f4f8285210db3c812e3cf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f4113e21a0114321a0215642a88064a9045320a120a70f8064a90421a70f8064a90422a70a8064a904235650a8812710a9040197008804ec5143a122a121a124a125c2009c114e25a1114525a01145114ede23c20092563f9170e294113e23a09923c2009223a0de113ee222c2009256129170e29351c2a09c22c20096113e22a0113ede0ce221c2009256219170e294111b21a09d21c20096113e21a0113ede111be224c2009170e30de30f56120089008a008d009000548d0860000000000000000000000000000000000000000000000000000000000000000004565001c705b301f81147114e11471146114d11461145114c11451144114b11441143114a1143061142061141114811411140114e1140113f114d113f113e114c113e113d1149113d113c114a113c06113b06113a1148113a1139114e11391138114d11380c11370c1136114911361135114a1135061134061133114811331132114e1132008b01f81131114d11310c11300c112f1149112f112e114a112e06112d06112c1148112c112b114e112b112a114d112a0c11290c1128114911281127114a1127061126061125114811251124114e11241123114d11230c11220c1121114911211120114a112006111f06111e1148111e111d114e111d111c114d111c0c111b0c008c01f0111a1149111a1119114a1119061118061117114811171116114e11161115114d111511141113114911131112114a1112061111061110114811100f114e0f0e114d0e0d0c11490c0b114a0b106a0911480908114e0807114d07060511490504114a040302114802564f02011151011150564b5650564edb3c019501fa24c20096113e24a0113ede0311500301114f0108114e0807114d07113e114c113e1144114b114404114a0405114905021148020811470807114607113e1145113e0411430406114206021141020811400807113f0705113d0504113c0406113b0602113a0208113908071138070c11370c051136050411350406113406008e01fc0211330208113208071131070c11300c05112f0504112e0406112d0602112c0208112b0807112a070c11290c0511280504112704061126060211250208112408071123070c11220c051121050411200406111f0602111e0208111d0807111c070c111b0c05111a0504111904061118060211170208111608071115071114008f003c05111305041112040611110602111002108f107e0d105c104b106a49160304da8ecc561081010b564d59f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e99564e5613a8812710a90420c20094564e21be9170e2915be30d9130e2de564cc2009170e30d8e8a563f564d5650564edb3cde2b94564d2bbe9170e2009100940195009502fc114e564ea101206ef2d0806f235b561281010b2259f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e36206ef2d0806f2381010b025652a04300c855205023ce810101cf00810101cf00c902111402561401206e953059f45930944133f413e2e30e111201114e5650564e0092009300a23081010b8d0860000000000000000000000000000000000000000000000000000000000000000004565070c855205023ce810101cf00810101cf00c902111402561401206e953059f45930944133f413e20104db3c019500548d0860000000000000000000000000000000000000000000000000000000000000000004564001c705b303f68e1a148101015242114d206e953059f45a30944133f414e202a4401392574be256379556365636be9170e298f8235633a15635be9170e2e3002a96f82326a129be9170e29322c2009170e292574de30df842708040564e5613a8812710a90407114f0706114b060511520504114a04031151030201114e01114cc80096009a009f01fc114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132009701fc113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d009802fc111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550e114a564ddb3c114a11471146114511441143114211411140113f113e113d113c113b113a113911381137015d009900a01136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e001fc114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132009b01fc113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d009c02fc111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551d01114a01114ddb3c01114c01114901114701114601114501114401114301114201114101114000f7009d01fc01113f01113e01113d01113c01113b01113a01113901113801113701113601113501113401113301113201113101113001112f01112e01112d01112c01112b01112a01112901112801112701112601112501112401112301112201112101112001111f01111e01111d01111c01111b01111a011119011118011117011116009e002801111501111401111301111201111101111055d101fe55708210c47b97305009cb1f17810101cf0015810101cf0013810101cf0001c8810101cf0012810101cf0012810101cf0002c8810101cf0013810101cf00cdcdc903114a0302114502011147015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f40000a001f8c901fb00113e1147113e113d1146113d113c1145113c113b1144113b113a1143113a1139114211391138114111381137114011371136113f11361135113e11351134113d11341133113c11331132113b11321131113a1131113011391130112f1138112f112e1137112e112d1136112d112c1135112c112b1134112b00a101fc112a1133112a1129113211291128113111281127113011271126112f11261125112e11251124112d11241123112c11231122112b11221121112a1121112011291120111f1128111f111e1127111e111d1126111d111c1125111c111b1124111b111a1123111a1119112211191118112111181117112011171116111f111600a201ba1115111e11151114111d11141113111c11131112111b11121111111a11111110111911100f11180f0e11170e0d11160d0c11150c0b11140b0a11130a091112090811110807111007106f105e104d103c4ba910784017504316db3cdb3101df01fa31d33f3081632e5638f2f4817c2a56375637bef2f48200da29f8235634a15636bef2f4114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113800a401fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112300a501fc112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce00a6023610bd10ac109b108a10791068105710461035443012db3cdb3cdb31015d01df01f831fa0030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113300a801fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e00a902fc111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c8200aac7561bf2f400d800aa01fc8142a65649c200f2f481662c5649561abef2f481010bf8425615598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d080564bbe9170e2f2f4f842561881010b2259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e270f82300ab01f6561ca0226eb38e165b20206ef2d0806f245f0301206ef2d0806f246c31019132e21147114b11471146114a11461145114911451144114811441143114b11431142114a1142114111491141114011481140113f114b113f113e114a113e113d1149113d113c1148113c113b114b113b113a114a113a11391149113900ac01fc1138114811381137114b11371136114a11361135114911351134114811341133114b11331132114a1132113111491131113011481130112f114b112f112e114a112e112d1149112d112c1148112c112b114b112b112a114a112a1129114911291128114811281127114b11271126114a112611251149112511241148112400ad01f81123114b11231122114a1122112111491121112011481120111f114b111f111e114a111e111d1149111d111c1148111c111b114b111b111a114a111a1119114911191118114811181117114b11171116114a11161115114911151114114811141113114b11131112114a11121111114911111110114811100f114b0f00ae03e20e114a0e0d11490d0c11480c0b114b0b0a114a0a091149090811480807114b0706114a06051149050411480403114b0302114a02011149011148564adb3c20c20094561521be9170e28e9211155615a170f82802111702564d5520db3c9130e281010b1149564da0f823f8235502114cc800c8019500af01e255305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211160201114801564a01206e953059f45930944133f413e21113564aa081010b114a206ef2d080564ba10211120201114a01564901810101216e955b59f4593098c801cf004133f441e2f8427011498040114cc800b001f6598210acd731a75003cb1fce810101cf00c9130211490201114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c00b101fc113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c112700b201fc1126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a111511141119111411131118111311121117111200b3016a1110111611101114111511140f11140f0d11120d0c11110c0b11100b10af109e108d107c106b105a104910384715045063db3cdb3101df02fe8efc31fa0030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133e000b500c401fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e00b602fe111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c8142a65649c200f2f400d800b701faf842561781010b2259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2816dd3216eb3f2f48152fd21206ef2d0806f245f03564cbef2f4816283f82322206ef2d0806f246c31bef2f411471149114711461148114611451149114511441148114400b801fc114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a113911491139113811481138113711491137113611481136113511491135113411481134113311491133113211481132113111491131113011481130112f1149112f00b901fc112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a112911491129112811481128112711491127112611481126112511491125112411481124112311491123112211481122112111491121112011481120111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a00ba02fe1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a09114909081148080711490706114806051149050411480403114903021148020111490111485649db3c2000c800bb04fcc20094561521be9170e28e9211155615a170f82802111702564c5520db3c9130e25648206ef2d0806f245f03564ba120c200e30f11145649a170f828114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e019500bc00bd00be00b081010b564a206ef2d0806f2410235f03f823114c206ef2d0806f246c311201114c01c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc90211170201114901564a01206e953059f45930944133f413e2009630574881010b6dc8216e925b6d8e2601206ef2d0806f24550355305034810101cf00810101cf00810101cf0001c8810101cf00cdc9e202111702564a01206e953059f45930944133f413e201fc113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a112900bf01f8112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181116111811160211170211151116111511141115111400c002fe1113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510341023564a02564c02db3cf84270114a8040114cc85982108445bc055003cb1fce810101cf00c91302114a0201114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016e019500c101f4b0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113600c201fc113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112311221124112211211123112100c301e8112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e551ddb3cdb3101df044c218210094a1f7cbae30221821013bd6b32bae302218210d3b50b23bae3022182101ab0a142ba00c500ce00d500df01f65bf842114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113300c601fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e00c702fe111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610451034114841305648db3c8200e1b821c20000c800c900de81010b56180259f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206e923070e0f82321206ef2d0806f24135f03a101206ef2d0806f245f03561ba8812710a90401a88209e13380a904205616bc93305614de02faf2f482009c88561622bef2f411155615a1561781010b564b59f40b6fa192306ddf206e92306d8e20d0810101d700810101d700810101d700d401d0810101d700301443306c146f04e2206eb39130e30d70f828114a114b114a1149114a114911481149114811471148114711461147114611451146114511441145114400ca00cb00b881010b21206ef2d0806f245f0322206ef2d0806f2410235f03f82304206ef2d0806f246c31413014c855305034810101cf00810101cf00810101cf0001c8810101cf00cdc902111902564b01206e953059f45930944133f413e2111701fc114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f00cc01fc112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a00cd02bc1119111a1119111811191118021118021116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510341023db3cdb3cdb31019501df01f831d200d30ffa00d31f30114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a11391149113911381148113811371149113711361148113611351149113500cf01fc113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a11291149112911281148112811271149112711261148112611251149112511241148112411231149112311221148112211211149112111201148112000d001f8111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a0911490900d102f40811480807114907061148060511490504114804031149030211480201114a01114bdb3c571757175717571781646d562ab3f2f48200e1415645812710bb945647c2009170e2945648c2009170e2f2f4114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d01de00d201fc113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c112800d301fc1127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171119111a111911181119111811121116111211111115111100d4013c1110111411100f11130f0e11120e0d11110d0c11100c10bf553adb3cdb3101df01f831fa4030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113300d601fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e00d702fc111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c8200abfb5613f2f400d800d900128200e8415627b3f2f401f881104df842564a01c705b3f2f481010bf84256125959f40b6fa192306ddf206e92306d8e13d0fa40810101d700810101d70055206c136f03e281526d016ef2f481010bf8427020564c59c855205023ce810101cf00810101cf00c903111303206e953059f45930944133f413e22081010b564a59f40b6fa192306ddf00da01e6206e92306d8e13d0fa40810101d700810101d70055206c136f03e2206eb38e4581010b21206ef2d0806f235b22206ef2d0806f23303103206ef2d0806f236c21a44130c855205023ce810101cf00810101cf00c9564a01206e953059f45930944133f413e29130e2f842708040f84201114cc800db01f459821028db358b5003cb1fcecec9413001114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f00dc01fc113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a00dd01fc1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111811171118111711161117111611151116111500de0148111411151114111311141113111211131112111111121111111011111110550edb3cdb3101df03fc8f7a31d200d30f30011148011149db3c5711571181646d562cb3f2f48200ba975648812710bbf2f4114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138e02101de00e000e201fc113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112300e101f0112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311110e11100e10df551cdb3cdb3101df044a8210ea3f3bddbae302218210f789340abae302218210ab78b3cfbae3022182101ba0fefaba00e300ec00f300ff01f831fa40fa00d31fd31f30114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a11391149113911381148113811371149113711361148113611351149113500e401fc113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a11291149112911281148112811271149112711261148112611251149112511241148112411231149112311221148112211211149112111201148112000e501f8111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a0911490900e602a40811480807114907061148060511490504114804031149030211480201114a01114bdb3c8200b0f05649c20094564cc2009170e295564b564dbb9170e2f2f48200a0862d81010b564c59f40b6fa192306ddf01de00e701e6206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e26ef2f481010bf8425615598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d080564bbe9170e2f2f481010b70f823564c413401114f011150c800e801f855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc9103d02114b0201114a01206e953059f45930944133f413e20c5646a081010bf842114b206ef2d080011148a1031112030211470201114a01810101216e955b59f4593098c801cf004133f441e211431147114311421146114200e901fc114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d00ea01fc112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c111800eb01ae1117111b11171116111a111611151119111511141118111411131117111311121116111211111115111111101114111011130e11120e0d11110d0c11100c10bf0e5e39107b106a105910481037465010344300db3cdb3101df01f45bf8422b81010b2259f40b6fa192306ddf206e92306d8e28d0810101d700810101d700810101d700d401d0810101d700810101d700301025102410236c156f05e2817625216eb3f2f48200cd11f82322206ef2d0806f2510245f0423206ef2d0806f25145f04a0bef2f4f82321206ef2d0806f2510245f04a12100ed01f4206ef2d0806f256c415210bc9b3020206ef2d0806f256c41de21206ef2d0806f255f0401a821206ef2d0806f256c41a90421206ef2d0806f2510345f04a18200aeff21c200f2f481010b22206ef2d0806f255f0423206ef2d0806f2510345f0423a024206ef2d0806f2510245f0425206ef2d0806f25145f040600ee02fe206ef2d0806f256c411034413016c855405045810101cf0012810101cf00810101cf0001c8810101cf0012810101cf00cdc94ee05230206e953059f45930944133f413e251dca070f828102f102e03114a0302114b02564a02564c02db3cf84270114a8040114cc85982103764fe765003cb1fce810101cf00c91302114a02019500ef01f801114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b00f001fc113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112600f101fc112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a111811171119111711161118111611151117111511141116111411131115111311121114111211111113111100f201281110111211100f11110f0e11100e551ddb3cdb3101df01fa31d33f308200b2252bf2f422c200f2e5918200a564f82327a12abef2f4114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113700f401fc113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112311221124112200f501fc112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b00f6022a108a10791068105710461035443012db3cdb3cdb3100f701df01ec249130e1f82325a908810101270259f40c6fa192306ddf206e915be0537aa88064a9045188a121206ef2d080f828114a114c114a1149114b11491148114c11481147114b11471146114c11461145114b11451144114c11441143114b11431142114c11421141114b11411140114c1140113f114b113f00f801fc113e114c113e113d114b113d113c114c113c113b114b113b113a114c113a1139114b11391138114c11381137114b11371136114c11361135114b11351134114c11341133114b11331132114c11321131114b11311130114c1130112f114b112f112e114c112e112d114b112d112c114c112c112b114b112b112a114c112a00f901fc1129114b11291128114c11281127114b11271126114c11261125114b11251124114c11241123114b11231122114c11221121114b11211120114c1120111f114b111f111e114c111e111d114b111d111c114c111c111b114b111b111a114c111a1119114b11191118114c11181117114b11171116114c11161115114b111500fa02fc1114114c11141113114b11131112114c11121111114b11111110114c11100f114b0f0e114c0e0d114b0d0c114c0c0b114b0b0a114c0a09114b09102807114b07102605114b05102403114b0312564c59db3c3333348101015646206ef2d08026103601206e953059f45a30944133f414e204a4f8236d70f84221804026a5019500fb01fe114c206ef2d08002114c0201114dc85520821056bbaafa5004cb1f12810101cf00ce810101cf00c91302114a0201114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0011451147114511441146114411431145114311421144114200fc01fc114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d00fd01fc112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a111800fe009a1117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10790608034555070402fe8efc31d200fa00d31fd30730114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a113911491139113811481138113711491137113611481136113511491135e00100010601fc113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a112911491129112811481128112711491127112611481126112511491125112411481124112311491123112211481122112111491121112011481120010101f8111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a09114909010202f80811480807114907061148060511490504114804031149030211480201114a01114bdb3c3838383881646d562ab3f2f482008d7e5645c200945647c2009170e2945648c2009170e2945648c1659170e2f2f4114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d01de010301fc113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c1128010401fc1127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a1116111511191115111411181114111311171113010501681112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d5e38108a10895533db3cdb3101df044c218210c61e9667bae3022182108f9872bdbae302218210f5708ab5bae30221821017df7398ba0107010c010f011801f831d20030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133010801fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e010902fe111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c572d5647937f572ede01de010a01fc114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132010b01fc113111321131113011311130112f1130112f112e112f112e112d112e112d112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c014b01f85b57208109def842562ec705f2f4f823114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134010d01f4113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a11281127112911271126112811261125112711251124112611241123112511231122112411221121112311211122111f1121111f010e01fc111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354403db3cdb3101df01fa31d33f31d200d307d430d0114711481147114611481146114511481145114411481144114311481143114211481142114111481141114011481140113f1148113f113e1148113e113d1148113d113c1148113c113b1148113b113a1148113a113911481139113811481138113711481137113611481136113511481135011001fc113411481134113311481133113211481132113111481131113011481130112f1148112f112e1148112e112d1148112d112c1148112c112b1148112b112a1148112a112911481129112811481128112711481127112611481126112511481125112411481124112311481123112211481122112111481121112011481120011101f8111f1148111f111e1148111e111d1148111d111c1148111c111b1148111b111a1148111a1119114811191118114811181117114811171116114811161115114811151114114811141113114811131112114811121111114811111110114811100f11480f0e11480e0d11480d0c11480c0b11480b0a11480a09114809011202fc0811480807114807061148060511480504114804031148030211480201114901114adb3c5726573856468e177f701149c0039f573f573f7057448064113f805a113fde9f57478200cf12562bf2f4707f114801e28be456d657267656e63795061757365870564991719120e21149114b11491148114a1148114711491147016d011301fc114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131011401f8113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b112903112a03112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c011503fe111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710465502114cdb3cf8427080408922114e91719122e210351201114e01014301160117001c456d657267656e6379506175736501f6c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001146114711461145114611451144114511441143114411431142114311420132043ce30221821079b9e4c3bae30221821010f7c0f7bae3022182100952917dba0119011e0123012a04f631d33f31d30fd430d0011148011149db3cdb3c820095535649c165945649c2099170e2f2f456488b6536574466565801114320564b01114ddb3cf8427080408b6536574466565810340201114e01114dc8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91302114a0201114b01016d013f0143011a01fc5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a011b01fc1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125011c01fc112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114111311151113111211141112111111131111111011121110011d011c0f11110f0e11100e551ddb3cdb3101df03f831d33f31fa40d430d0011148011149db3cdb3c573f8200e20f8d0860000000000000000000000000000000000000000000000000000000000000000004564901c705b3f2f48bb53657454726561737572798114711491147114611481146114511471145114411461144114311451143114211441142114111431141016d013f011f01fc114011421140114011411140113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c012001fc112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117012102d01116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544037050037101db3cf8427080408bb5365745472656173757279854140271c80143012201ba553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00db3cdb3101df01fe31d33f31d30fd30fd30fd430d0114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a113911491139113811481138113711491137113611481136113511491135012401fc113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a112911491129112811481128112711491127112611481126112511491125112411481124112311491123112211481122112111491121112011481120012501f8111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a09114909012603f40811480807114907061148060511490504114804031149030211480201114a01114bdb3cdb3c573a573a573a820086dc56478101f4bb9656468103e8bb9170e296564881012cbb9170e2f2f456468bc536574416e74695768616c658114611491146114511481145114411471144114311461143114211451142016d013f012701fc114111441141114011431140113f1142113f113e1141113e113d1140113d113c113f113c01113e0101113d0101113c011138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f112e1131112e112d1130112d112c112f112c012801fc112b112e112b112a112d112a1129112c11291128112b11281127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111c111f111c111b111e111b111a111d111a1119111c11191118111b11181117111a1117012902e21116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a1069105810471036102510244300705110114cdb3cf8427080408bc536574416e74695768616c65822103558114ec80143013102fe8efb31d33f31d200fa00d31fd307d430d01147114a11471146114911461145114811451144114a11441143114911431142114811421141114a1141114011491140113f1148113f113e114a113e113d1149113d113c1148113c113b114a113b113a1149113a1139114811391138114a1138113711491137113611481136e021012b013501fc1135114a11351134114911341133114811331132114a1132113111491131113011481130112f114a112f112e1149112e112d1148112d112c114a112c112b1149112b112a1148112a1129114a11291128114911281127114811271126114a11261125114911251124114811241123114a1123112211491122112111481121012c01fc1120114a1120111f1149111f111e1148111e111d114a111d111c1149111c111b1148111b111a114a111a1119114911191118114811181117114a11171116114911161115114811151114114a11141113114911131112114811121111114a11111110114911100f11480f0e114a0e0d11490d0c11480c0b114a0b0a11490a012d03fc0911480908114a08071149070611480605114a05041149040311480302114a0201114b01114cdb3cdb3c573457345734573556458ba5365744275796261636b870564891719120e21147114b11471146114a1146114511491145114411481144114311471143114211461142114111451141114011441140113f1143113f016d013f012e01fc113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d113903113c031137113b113703113a0303113903113711381137113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d1129012f01fc1128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a1116111511191115111411181114013002be1113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c107b106a105910485502114cdb3cf8427080408ba5365744275796261636b822114e91719122e210351201114e01c80143013101f4553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c91301114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611471146114511461145114411451144114311441143114211431142013201fc114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d013301fc112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118013401741117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101df044a82100490d605bae3022182102fb11c16bae3022182102a297933bae3022182102882f1e8ba0136013e0146014c03f831d33f31d200d430d0011148011149db3cdb3c573956478bd546f67676c6554726164696e67870564a91719120e2114a114b114a1149114a1149114811491148114711481147114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e016d013f013701f8113d113e113d03113d03113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129013801fc112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114013902fc1113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105610455502114cdb3cf8427080408bd546f67676c6554726164696e67822114e91719122e210351201114e01c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c9130143013a01f801114b015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c013b01fc113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127013c01fc112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a1119111811191118111711181117111611171116111511161115111411151114111311141113111211131112013d012c1111111211111110111111100f11100f550edb3cdb3101df03fe31d33f31fa40d430d0011148011149db3cdb3c572f8200cf12562df2f48bc526f746174654f7261636c658114711491147114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a016d013f01400024562d9e8200dfe4f8235626a15627bef2f4de01fc1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130113011311130112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125014101fc112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118111711191117111611181116111511171115111411161114111311151113111211141112111111131111111011121110014202fe0f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103544037050037101db3cf8427080408bc526f746174654f7261636c65854140271c8553082105e39a2315005cb1f13810101cf0001c8cecd810101cf00810101cf00c941305a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb00143014501f65728810101f8235623055521112a7f7070c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90211200201112501561f01206e953059f45a30944133f415e2810101f8232103111f03562059216e955b59f45a3098c801cf004133f442e20144002c561da4f8231125111e1120111e01111f0102111e020102348a9d58cf8680cf8480f400f400cf81e2f400c901fb00db3cdb3101a101df01f831fa4030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133014701fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e014802f4111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c572e572e01de014901fc114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131014a01f6113011311130112f1130112f112e112f112e7f112e112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c014b01a4111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101df02fe8efd31d33f31d30fd307d430d0114711481147114611481146114511481145114411481144114311481143114211481142114111481141114011481140113f1148113f113e1148113e113d1148113d113c1148113c113b1148113b113a1148113a113911481139113811481138113711481137113611481136113511481135014d015301fc113411481134113311481133113211481132113111481131113011481130112f1148112f112e1148112e112d1148112d112c1148112c112b1148112b112a1148112a112911481129112811481128112711481127112611481126112511481125112411481124112311481123112211481122112111481121112011481120014e01f8111f1148111f111e1148111e111d1148111d111c1148111c111b1148111b111a1148111a1119114811191118114811181117114811171116114811161115114811151114114811141113114811131112114811121111114811111110114811100f11480f0e11480e0d11480d0c11480c0b11480b0a11480a09114809014f02fc0811480807114807061148060511480504114804031148030211480201114901114adb3c572c573f573f8200e8415624b3f2f48200f2195646c209945646c1659170e2945647c1659170e2f2f4f8231129a4810101f82301114a80647fc855305034810101cf0001c8cecd810101cf00ca00c90211280201114901562701016d015001fa206e953059f45a30944133f415e21125a4114411471144114311461143114211451142114111441141114011431140113f1142113f113f1141113f113c113f113c113b113e113b113a113d113a1139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132015101f4113111341131113011331130112f1132112f112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1128112c1128112a112b112a1127112a11271125112911251128112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d015201ee111c111f111c111b111e111b111a111d111a1119111c11191118111b11181117111a11171116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a10691058104710364015503304db3cdb3101df044ee02182106920939fbae302218210dc63850bbae302218210d890b03fbae3022182109d3b8cb1ba015401640169017201fc31d33ffa00d31fd207d307301147114a11471146114911461145114811451144114a11441143114911431142114811421141114a1141114011491140113f1148113f113e114a113e113d1149113d113c1148113c113b114a113b113a1149113a1139114811391138114a11381137114911371136114811361135114a1135015501fc1134114911341133114811331132114a1132113111491131113011481130112f114a112f112e1149112e112d1148112d112c114a112c112b1149112b112a1148112a1129114a11291128114911281127114811271126114a11261125114911251124114811241123114a11231122114911221121114811211120114a1120015601f8111f1149111f111e1148111e111d114a111d111c1149111c111b1148111b111a114a111a1119114911191118114811181117114a11171116114911161115114811151114114a11141113114911131112114811121111114a11111110114911100f11480f0e114a0e0d11490d0c11480c0b114a0b0a11490a09114809015703fc08114a08071149070611480605114a05041149040311480302114a0201114b01114cdb3c112ba4810101f8232104112d04413001114b01216e955b59f45a3098c801cf004133f442e2564bc002961149811388bc93574970e28e10573e563ec132948032573fde8046113ede564ac003945649c2509170e2e300564ac001016d01580159002c573e5743563dc214948014573ede80287f114401113e02fa945649c1ce9170e299573e7057448050113ede114ac001941148c1e293574870e29256349170e29556335633be9170e298f8235630a15632be9170e2925745e30d114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e1139015a016101fc114311481143114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113c1141113c113b1140113b113a113f113a1139113e11391138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f015b01fc112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d1128112b112c112b1128112b11281125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a015c02fc1119111e11191118111d11181117111c11171116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af55495e21db3c0211470203114603112a1145112a04114404112b1143112b0211420203114103112a1140112a015d015f01f63057337056375635a88064a904205649bc93305647de20c2008e1911485648a1113f5648a011325648a0113f1148113f1132113fde11315638a01133a4f8232270113b80401135c859821070acb7bb5003cb1f810101cf00810101cf00c95649431402113c02113501146d50436d5033c8cf8580ca00cf8440ce01015e005efa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001137113311301132113001fc04113f04112b113e112b02113d0203113c03112a113b112a04113a04112b1139112b0211380203113703112a1136112a04113504112b1134112b0211330203113203112a1131112a04113004112b112f112b02112e0203112d03112a112c112a04112b0404112a0402112902031128030411270411260111250102112402016000ae031123030411220411210111200102111f0203111e0304111d04111c01111b0102111a02031119030411180411170111160102111502031114030411130411120111110102111002103f104e4bcd103a1049467803502501fc1138113d11381137113c11371136113b11361135113a1135113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c1127112a112b112a1127112a1127112411291124016201f8112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e11191118111d11181117111c11171116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f016301500e11130e0d11120d0c11110c0b11100b10af109e108d107c106b105a1049103847154663db3cdb3101df03fe31d33f31d307d30731d31f31d430d0011148011149db3c810101f82301114b806470c855305034810101cf0001c8cecd810101cf00ca00c902112a0201114a01562901206e953059f45a30944133f415e21127a45647c0038e1357255737573d573d574157427f70708064805ae30e11451147114502114602114311451143016d0165016600541147c0029c573e113ea614113e803c113ede041146040311440302113f0201113e01113704112404552001f8114211441142114111431141114011421140011141011140113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113803113903113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d016701f8112c112e112c112b112d112b112a112c112a1129112b11291128112a112811261129112611241128112411251127112504112604112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118016801a81117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057461510344300db3cdb3101df01fc31d33f31d307810101d700d401d001d30730114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a113911491139113811481138113711491137113611481136016a01fc113511491135113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a112911491129112811481128112711491127112611481126112511491125112411481124112311491123112211481122112111491121016b01fc112011481120111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a016c03fe091149090811480807114907061148060511490504114804031149030211480201114a01114bdb3c8200d120564c5629bef2f4112ba45649c0019457415748e30e810101f8230201114a01114b7fc855305034810101cf0001c8cecd810101cf00ca00c90211270201114801562601206e953059f45a30944133f415e21124016d016e016f00268200ccd0f8425631c705f2f48151d0562ff2f400ac5649c00294574057488e3e5649c0038e14572f574870011147c87401cb0212ca07cbffc9d08e171149c004985735113411461134925747e211461147112de2113e1146113e112d113ee2113f1146113f113e113f113e01fea4114311471143114211461142114111451141114011441140113f1143113f113e1142113e114011411140113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f017001f4112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281129112b11291126112a11261124112911241128112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a017101ce1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf10ae109d108c107b106a1059104810374605441403db3cdb3101df02fe8efb31d33ffa4031fa0030561f8101012359f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f481188621206ef2d0806f29185f08b39b21206ef2d0806f296c81b39170e2f2f4e0210173017c01fc114611481146114511471145114411481144114311471143114211481142114111471141114011481140113f1147113f113e1148113e113d1147113d113c1148113c113b1147113b113a1148113a113911471139113811481138113711471137113611481136113511471135113411481134113311471133113211481132017401fc113111471131113011481130112f1147112f112e1148112e112d1147112d112c1148112c112b1147112b112a1148112a112911471129112811481128112711471127112611481126112511471125112411481124112311471123112211481122112111471121112011481120111f1147111f111e1148111e111d1147111d017501fc111c1148111c111b1147111b111a1148111a1119114711191118114811181117114711171116114811161115114711151114114811141113114711131112114811121111114711111110114811100f11470f0e11480e0d11470d0c11480c0b11470b0a11480a091147090811480807114707061148060511470504114804017602fc03114703021148020111470111498122d4114b5649db3c01114c01f2f4561b810101564a59f40d6fa192306ddf206e92306d8e25d0810101d700810101d700810101d700d401d0810101d700d200301025102410236c156f05e27053016eb38e1a5b20206ef2d0806f2510345f0401206ef2d0806f2510245f04019132e20184017702f65649a056485622a8812710a90481010103a45321b9564d5444305240c855405045810101cf0012810101cf00810101cf0001c8810101cf0012ca00cdc902111f0213564c01206e953059f45a30944133f415e2111d01be99021149025747574730e30d1143114711431142114611421141114511411140114411400178017900ee1149206ef2d0806f295b105610461036102681010147777f70c855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc903111f031201114901206e953059f45a30944133f415e2011118011145a0111b1146111b111b1144111b111701fc113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c11381137113b11371136113a1136113511391135113411381134113311371133113211361132113111351131113011341130112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b017a01fc112a112e112a1129112d11291128112c11281127112b11271126112a1126112511291125112411281124112311271123112211261122112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a1116017b01781115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c10bf553adb3cdb3101df044a821009d21b11bae30221821023019716bae302218210bb8d8491bae302218210cfc66cbdba017d018a019101ab01f831d33f30114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133017e01fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e017f02fa111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c561f810101564a01de018001f859f40d6fa192306ddf206e92306d8e33d0810101d700810101d700d401d001810101d700d401d0810101d700d401d001d200d200d2003010591058105710566c196f09e28163be216eb3f2f4114611481146114511471145114411481144114311471143114211481142114111471141114011481140113f1147113f018101fc113e1148113e113d1147113d113c1148113c113b1147113b113a1148113a113911471139113811481138113711471137113611481136113511471135113411481134113311471133113211481132113111471131113011481130112f1147112f112e1148112e112d1147112d112c1148112c112b1147112b112a1148112a018201fc112911471129112811481128112711471127112611481126112511471125112411481124112311471123112211481122112111471121112011481120111f1147111f111e1148111e111d1147111d111c1148111c111b1147111b111a1148111a111911471119111811481118111711471117111611481116111511471115018302fc1114114811141113114711131112114811121111114711111110114811100f11470f0e11480e0d11470d0c11480c0b11470b0a11480a09114709081148080711470706114806051147050411480403114703021148020111470111488122d41148564adb3c01114901f2f48159c55649206ef2d0806f296c81b3f2f4114801840185005281010120562050334133f40c6fa19401d70030925b6de2206e923070e0f82301206ef2d080a15622b902fe206ef2d0806f2930104710368101017f27515a05104a5a1ac855805089810101cf0016810101cf0004c8ce14cd12810101cf0001c8810101cf0002c8ce12cd12ca0012ca0012ca00cdc90311210301114c01206e953059f45a30944133f415e28b65365744665658564a0101f90101f901ba9457405748e30e11441147114401860187006a8bd546f67676c6554726164696e67801114a0101f90101f901ba9a5737111cc3001136111c92571de2111c1147111c111c113e111c01fc114311461143114211451142114111441141114011431140113f1142113f111c1141111c113d1140113d113c113f113c113b113e113b113a113d113a1139113c11391138113b11381137113a1137113611391136113511381135113411371134113311361133113211351132113111341131113011331130112f1132112f018801fc112e1131112e112d1130112d112c112f112c112b112e112b112a112d112a1129112c11291128112b11281127112a1127112611291126112511281125112411271124112311261123112211251122112111241121112011231120111f1122111f111e1121111e111d1120111d111d111f111d111b111e111b111a111d111a018901a21119111c11191118111b11181117111a11171116111911161115111811151114111711141113111611131112111511121111111411111110111311100f11120f0e11110e0d11100d10cf552b12db3cdb3101df01f831fa4030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133018b01fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e018c03fe111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c31820083588956490101de018d018e00438000000000000000000000000000000000000000000000000000000000000000001001fac705b3f2f4114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133018f01fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e019001ec111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a1089107810671056104510344130db3cdb3101df01f831d33ffa00fa40308200dd3bf842564bc705f2f48142a622c200f2f48109228d08600000000000000000000000000000000000000000000000000000000000000000045220c705b3f2f4f8281149114b11491148114a1148114711491147114611481146114511471145114411461144114311451143114211441142019201fc114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a1138113711391137113611381136113511371135113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d019301fc112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a1118019402aa1117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046104513db3cdb3cdb31019501df013682009d4923c200f2f48200e184564724bef2f4114622a11146db3c019602f482009d4923c200f2f4f82814db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040f828238b081059104a103bc855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec91610455a1036453304c8cf8580ca00cf8440ce01019701aa011688c87001ca005a02cecec90198022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d90199019b0157a65ec0bb513434800067fe803e903e9020404075c0154c1b05273e903e901640b4405c150488b8b6cf1b1120019a01145321db3c30546440524001a604c201d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ffa00fa40fa40810101d70055306c149cfa40fa405902d10170541222e205e30203d70d1ff2e082218210178d4519bae3022182100f8a7ea5bae30221821051a5c3d1ba019c019d019f01a500f6038020d7217021d749c21f9430d31f01de208210178d4519ba8e2a30d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e082107bdd97deba8e29d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e05f0503d431d33ffa00fa40fa4031fa005327db3c8200c241f8422bc705936c217f8e32f8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705e2f2f48142a624c200f2f45163a021c20093365f04e30d400301a6019e01a400b0147f50437308c8553082107362d09c5005cb1f13cb3f01fa02cecec92404035066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002b631d33ffa00fa40fa40f40431fa008142a625c200f2f48138c6f84228c705f2f48121d45385bef2f48200da29f823500ba1c2041af2f4f82324a71e812710a90420c101923071de5350a18200b67621c200f2f45096a15349db3c5c01a601a003fc705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f80402c514e104d4b1311121ac855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec910561058104d1038591036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb08a8ae201a101a201a300065bcf81001a58cf8680cf8480f400f400cf8101d6f400c901fb0024c2008e5970705414657304c855308210eb527edf5005cb1f13cb3f01fa02cecec92604034666146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0093303330e2400301a4002cc87f01ca0055305043fa02ce12ce810101cf00c9ed5403f28f6731d33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a15145db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040228b082a104a1039544b30c8e0018210595f07bcbae3025f05f2c08201a601a701a80018f82ac87001ca005a02cecec900da55508210178d45195007cb1f15cb3f5003fa02cece01fa02cec94016504405031036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004003c87f01ca0055305043fa02ce12ce810101cf00c9ed5401fed33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a1707f541435804008c8553082107bdd97de5005cb1f13cb3f01fa02cecec9260443135066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0001a900304003c87f01ca0055305043fa02ce12ce810101cf00c9ed54004afa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0002fe8efc31fa4030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133e001ac01af01fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e01ad02fc111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c573f81646d562db301de01ae01f4f2f4114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113311321133113201bb044c2182103c134728bae302218210f1822da1bae30221821083b8144abae302018210946a98b6ba01b001b701bd01c401fc31d30fd307d30fd30fd30f301147114a11471146114911461145114811451144114a11441143114911431142114811421141114a1141114011491140113f1148113f113e114a113e113d1149113d113c1148113c113b114a113b113a1149113a1139114811391138114a11381137114911371136114811361135114a113501b101fc1134114911341133114811331132114a1132113111491131113011481130112f114a112f112e1149112e112d1148112d112c114a112c112b1149112b112a1148112a1129114a11291128114911281127114811271126114a11261125114911251124114811241123114a11231122114911221121114811211120114a112001b201f8111f1149111f111e1148111e111d114a111d111c1149111c111b1148111b111a114a111a1119114911191118114811181117114a11171116114911161115114811151114114a11141113114911131112114811121111114a11111110114911100f11480f0e114a0e0d11490d0c11480c0b114a0b0a11490a0911480901b302fc08114a08071149070611480605114a05041149040311480302114a0201114b01114cdb3c573a573a573a573d573d81646d5629b3f2f4820086dc5645c200945645c1659170e2945644c1659170e2945646c2009170e29656468101f4bb9170e2945647c2009170e29656478103e8bb9170e296564881012cbb9170e2f2f401de01b401fc114211471142114111461141114011451140113f1144113f113e1143113e113d1142113d113f1141113f113e1140113e113a113f113a1139113e11391138113d11381139113c1139113a113b113a1138113a1138113411391134113311381133113211371132113111361131113011351130112f1134112f112e1133112e01b501fc112d1132112d112c1131112c112b1130112b112a112f112a1129112e11291128112d11281127112c11271126112b11261125112a1125112411291124112311281123112211271122112111261121112011251120111f1124111f111e1123111e111d1122111d111c1121111c111b1120111b111a111f111a1119111e111901b601ac1118111d11181117111c11171116111b11161115111a11151114111911141113111811131112111711121111111611111110111511100f11140f0e11130e0d11120d0c11110c0b11100b10af109e108d5547db3cdb3101df01f831d20030114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911381139113811371138113711361137113611351136113511341135113411331134113301b801fc113211331132113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e01b902fc111d111e111d111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411484130db3c573981646d562db301de01ba01f4f2f4114611471146114511461145114411451144114311441143114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a113911371138113711361137113611351136113511341135113411331134113311321133113201bb01fc113111321131113011311130112f1130112f112e112f112e112d112e112d112c112d112c112b112c112b112a112b112a1129112a1129112811291128112711281127112611271126112511261125112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d01bc01b0111c111d111c111b111c111b111a111b111a1119111a11191118111911181117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f550edb3cdb3101df01f831d200fa00d31fd30730114711491147114611481146114511491145114411481144114311491143114211481142114111491141114011481140113f1149113f113e1148113e113d1149113d113c1148113c113b1149113b113a1148113a11391149113911381148113811371149113711361148113611351149113501be01fc113411481134113311491133113211481132113111491131113011481130112f1149112f112e1148112e112d1149112d112c1148112c112b1149112b112a1148112a11291149112911281148112811271149112711261148112611251149112511241148112411231149112311221148112211211149112111201148112001bf01f8111f1149111f111e1148111e111d1149111d111c1148111c111b1149111b111a1148111a1119114911191118114811181117114911171116114811161115114911151114114811141113114911131112114811121111114911111110114811100f11490f0e11480e0d11490d0c11480c0b11490b0a11480a0911490901c002f80811480807114907061148060511490504114804031149030211480201114a01114bdb3c573457345734573581646d562ab3f2f4114311471143114211461142114111451141114011441140113f1143113f113e1142113e113d1141113d113c1140113c113b113f113b113a113e113a1139113d11391138113c113801de01c101fc1137113b11371136113a1136113511391135113511381135113311371133113511361135113311341133112f1133112f112e1132112e112d1131112d112c1130112c112b112f112b112a112e112a1129112d11291128112c11281127112b11271126112a112611251129112511241128112411231127112311221126112201c201fc112111251121112011241120111f1123111f111e1122111e111d1121111d111c1120111c111b111f111b111a111e111a1119111d11191118111c11181117111b11171116111a11161115111911151114111811141113111711131112111611121111111511111110111411100f11130f0e11120e0d11110d0c11100c553b01c30108db3cdb3101df02fe8efdd33f30c8018210aff90f5758cb1fcb3fc9114611481146114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113501c501c801fc113411361134113311351133113211341132113111331131113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a112811271129112711261128112611251127112511241126112411231125112311221124112211211123112111201122112001c601fc111f1121111f111e1120111e111d111f111d111c111e111c111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a1079106810571046103501c70154443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00db3cdb3101df0006e0114704e2e3022082f0939b8f50a89494d7788bca14d37ccb5365057f81e805b401d1ab446c0d80a3fabae3022082f040391f4eaad79adb418bdfd49edad3b17b5e392ce4fafbbf82f21f2055ee0f7dbae30282f0228aefdc558b3d1b9bb87fc33d71a2e40504be5a8d6acc8d737ee0215d75d86cba01ca01cd01d701da01fe30114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113211311133113101cb01fc113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c01cc02b6111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c705747db3c01de01df01fe30114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113211311133113101ce01fc113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c01cf02f4111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c11461147114611451147114511441147114411431147114311421147114211411147114101de01d001fc114011471140113f1147113f113e1147113e113d1147113d113c1147113c113b1147113b113a1147113a113911471139113811471138113711471137113611471136113511471135113411471134113311471133113211471132113111471131113011471130112f1147112f112e1147112e112d1147112d112c1147112c01d101fc112b1147112b112a1147112a112911471129112811471128112711471127112611471126112511471125112411471124112311471123112211471122112111471121112011471120111f1147111f111e1147111e111d1147111d111c1147111c111b1147111b111a1147111a11191147111911181147111811171147111701d202fe1116114711161115114711151114114711141113114711131112114711121111114711111110114711100f11470f0e11470e0d11470d0c11470c0b11470b0a11470a0911470908114708114707060555308168f41148db3c5727572d572d572d1123b301114501f2f47070564211451146114511441145114411431144114301d301d40010f8235623a15624bb01f8114211431142114111421141114011411140113f1140113f113e113f113e113d113e113d113c113d113c113b113c113b113a113b113a1139113a1139113811391138113711381137113611371136113511361135113411351134113311341133113211331132113111321131113011311130112f1130112f112e112f01d501fa02112d0201112c01112a112b112a1129112a1129112811291128112711281127112611271126112511261125701126112411251124112311241123112211231122112111221121112011211120111f1120111f111e111f111e111d111e111d111c111d111c111b111c111b111a111b111a1119111a111911181119111801d6019c1117111811171116111711161115111611151114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a108910781067105614154330db3c01df01fe30114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113211311133113101d801fc113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c01d902c6111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c57265738707f1139011126db3c01de01df011ee3025f0f5f0f5f0f5f0f5f0cf2c08201db01fc114511471145114411461144114311451143114211441142114111431141114011421140113f1141113f113e1140113e113d113f113d113c113e113c113b113d113b113a113c113a1139113b11391138113a113811371139113711361138113611351137113511341136113411331135113311321134113211311133113101dc01fc113011321130112f1131112f112e1130112e112d112f112d112c112e112c112b112d112b112a112c112a1129112b11291128112a1128112711291127112611281126112511271125112411261124112311251123112211241122112111231121112011221120111f1121111f111e1120111e111d111f111d111c111e111c01dd02cc111b111d111b111a111c111a1119111b11191118111a11181117111911171116111811161115111711151114111611141113111511131112111411121111111311111110111211100f11110f0e11100e10df551cdb3c8200ae97562eb3f2f4112eb3112edb3c01de01df001882008aabf8425647c705f2f402f6c87f01ca00114811471146114511441143114211411140113f113e113d113c113b113a1139113811371136113511341133113211311130112f112e112d112c112b112a1129112811271126112511241123112211211120111f111e111d111c111b111a111911181117111611151114111311121111111055e0db3c01e001e301f0011148011147fa0201114501ca0001114301ce01114101cc113fc8cc01113efa0201113c01cb0f01113a01cb0701113801ce011136fa02011134fa0201113201cb0f01113001cb0f01112e01cb0f01112c01ca0001112a01ca00011128fa02011126fa0201112401cb1f01112201cb071120c8810101cf0001e101fc01111f01810101cf0001111dfa0201111bfa021119c8ce01111801ca0001111601ca0001111401810101cf0001111201810101cf0001111001f4001ef4000cc8810101cf001bcb0719ca0017cb1f15810101cf0013cb1f810101cf00cb1fcb0ff40001c8810101cf0012f40013f4005003fa0213ca0013cb0f5003fa021301e200c4cb1f14f4005004fa025004fa0205c8f40016ca0016cb0f16f40016ca005006fa025006fa0216f40016ca005006fa0216cb1f16cb0716810101cf0016810101cf00c85007fa0218f40018810101cf0018f40019ce17cb0fcd13cd13cd14cd12cdcdcd0006c9ed54bf4aed75');
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
    2338: { message: "Invalid destination" },
    2526: { message: "Only AI" },
    4173: { message: "Self referral" },
    6278: { message: "Closed" },
    8660: { message: "Insufficient" },
    8916: { message: "Window closed" },
    10363: { message: "Unauthorized burn" },
    11836: { message: "Invalid fee source" },
    12493: { message: "Invalid token wallet" },
    13478: { message: "Minting off" },
    14534: { message: "Not owner" },
    17062: { message: "Invalid amount" },
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
    28115: { message: "No stake" },
    30245: { message: "No vesting" },
    31786: { message: "Pool low" },
    33624: { message: "Invalid DeFi address" },
    34524: { message: "Limits" },
    35499: { message: "Only owner" },
    36222: { message: "Invalid lottery config" },
    38227: { message: "Fee 0.10%-1.00%" },
    40072: { message: "Pool empty" },
    40265: { message: "Invalid transfer amount" },
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
    "Invalid destination": 2338,
    "Only AI": 2526,
    "Self referral": 4173,
    "Closed": 6278,
    "Insufficient": 8660,
    "Window closed": 8916,
    "Unauthorized burn": 10363,
    "Invalid fee source": 11836,
    "Invalid token wallet": 12493,
    "Minting off": 13478,
    "Not owner": 14534,
    "Invalid amount": 17062,
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
    "No stake": 28115,
    "No vesting": 30245,
    "Pool low": 31786,
    "Invalid DeFi address": 33624,
    "Limits": 34524,
    "Only owner": 35499,
    "Invalid lottery config": 36222,
    "Fee 0.10%-1.00%": 38227,
    "Pool empty": 40072,
    "Invalid transfer amount": 40265,
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
    {"name":"QuasarMaster$Data","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}},{"name":"reserveBalance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeBurnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalBurned","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalFeesCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldownSeconds","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"tradingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackThreshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"buybackBurnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lastBuybackTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBuybacks","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalQsrBurnedViaBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalTonSpentOnBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"aiOracle","type":{"kind":"simple","type":"address","optional":false}},{"name":"aiEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiFullAutonomy","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lastRebalanceTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"signalCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceHistory","type":{"kind":"dict","key":"int","value":"int"}},{"name":"anomalyLog","type":{"kind":"dict","key":"int","value":"AIRecommendation","valueFormat":"ref"}},{"name":"anomalyIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"minConfidence","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"emergencyPause","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiActionCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastAiActionTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"heartbeatTimeout","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ownerOverrideWindow","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"vetoThresholdBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"aiActionLog","type":{"kind":"dict","key":"int","value":"AIActionLog","valueFormat":"ref"}},{"name":"aiActionIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pendingAiActions","type":{"kind":"dict","key":"int","value":"int"}},{"name":"vetoLog","type":{"kind":"dict","key":"int","value":"VetoState","valueFormat":"ref"}},{"name":"totalVetoStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"stakingApyBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stakingMinStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingLockPeriod","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"stakers","type":{"kind":"dict","key":"address","value":"StakeInfo","valueFormat":"ref"}},{"name":"totalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingRewardsPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"pendingQsrDeposits","type":{"kind":"dict","key":"address","value":"int"}},{"name":"referralEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"referralRewardBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referrals","type":{"kind":"dict","key":"address","value":"ReferralInfo","valueFormat":"ref"}},{"name":"vestingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"teamAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"teamClaimed","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"vestingSchedules","type":{"kind":"dict","key":"address","value":"VestingInfo","valueFormat":"ref"}},{"name":"lotteryEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lotteryTicketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryDrawInterval","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lotteryJackpotShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lotteryRound","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryLastDraw","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryJackpot","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryTickets","type":{"kind":"dict","key":"int","value":"address"}},{"name":"lotteryTicketCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryWinners","type":{"kind":"dict","key":"int","value":"address"}},{"name":"defiAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"defiFeeShareBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
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