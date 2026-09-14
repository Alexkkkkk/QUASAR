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

export type AddLiquidity = {
    $$type: 'AddLiquidity';
    tonAmount: bigint;
    qsrAmount: bigint;
}

export function storeAddLiquidity(src: AddLiquidity) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(146776957, 32);
        b_0.storeCoins(src.tonAmount);
        b_0.storeCoins(src.qsrAmount);
    };
}

export function loadAddLiquidity(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 146776957) { throw Error('Invalid prefix'); }
    const _tonAmount = sc_0.loadCoins();
    const _qsrAmount = sc_0.loadCoins();
    return { $$type: 'AddLiquidity' as const, tonAmount: _tonAmount, qsrAmount: _qsrAmount };
}

export function loadTupleAddLiquidity(source: TupleReader) {
    const _tonAmount = source.readBigNumber();
    const _qsrAmount = source.readBigNumber();
    return { $$type: 'AddLiquidity' as const, tonAmount: _tonAmount, qsrAmount: _qsrAmount };
}

export function loadGetterTupleAddLiquidity(source: TupleReader) {
    const _tonAmount = source.readBigNumber();
    const _qsrAmount = source.readBigNumber();
    return { $$type: 'AddLiquidity' as const, tonAmount: _tonAmount, qsrAmount: _qsrAmount };
}

export function storeTupleAddLiquidity(source: AddLiquidity) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.tonAmount);
    builder.writeNumber(source.qsrAmount);
    return builder.build();
}

export function dictValueParserAddLiquidity(): DictionaryValue<AddLiquidity> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeAddLiquidity(src)).endCell());
        },
        parse: (src) => {
            return loadAddLiquidity(src.loadRef().beginParse());
        }
    }
}

export type RemoveLiquidity = {
    $$type: 'RemoveLiquidity';
    lpAmount: bigint;
}

export function storeRemoveLiquidity(src: RemoveLiquidity) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3287568056, 32);
        b_0.storeCoins(src.lpAmount);
    };
}

export function loadRemoveLiquidity(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3287568056) { throw Error('Invalid prefix'); }
    const _lpAmount = sc_0.loadCoins();
    return { $$type: 'RemoveLiquidity' as const, lpAmount: _lpAmount };
}

export function loadTupleRemoveLiquidity(source: TupleReader) {
    const _lpAmount = source.readBigNumber();
    return { $$type: 'RemoveLiquidity' as const, lpAmount: _lpAmount };
}

export function loadGetterTupleRemoveLiquidity(source: TupleReader) {
    const _lpAmount = source.readBigNumber();
    return { $$type: 'RemoveLiquidity' as const, lpAmount: _lpAmount };
}

export function storeTupleRemoveLiquidity(source: RemoveLiquidity) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.lpAmount);
    return builder.build();
}

export function dictValueParserRemoveLiquidity(): DictionaryValue<RemoveLiquidity> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRemoveLiquidity(src)).endCell());
        },
        parse: (src) => {
            return loadRemoveLiquidity(src.loadRef().beginParse());
        }
    }
}

export type SwapToTON = {
    $$type: 'SwapToTON';
    qsrAmount: bigint;
    minTonOut: bigint;
}

export function storeSwapToTON(src: SwapToTON) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1118291020, 32);
        b_0.storeCoins(src.qsrAmount);
        b_0.storeCoins(src.minTonOut);
    };
}

export function loadSwapToTON(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1118291020) { throw Error('Invalid prefix'); }
    const _qsrAmount = sc_0.loadCoins();
    const _minTonOut = sc_0.loadCoins();
    return { $$type: 'SwapToTON' as const, qsrAmount: _qsrAmount, minTonOut: _minTonOut };
}

export function loadTupleSwapToTON(source: TupleReader) {
    const _qsrAmount = source.readBigNumber();
    const _minTonOut = source.readBigNumber();
    return { $$type: 'SwapToTON' as const, qsrAmount: _qsrAmount, minTonOut: _minTonOut };
}

export function loadGetterTupleSwapToTON(source: TupleReader) {
    const _qsrAmount = source.readBigNumber();
    const _minTonOut = source.readBigNumber();
    return { $$type: 'SwapToTON' as const, qsrAmount: _qsrAmount, minTonOut: _minTonOut };
}

export function storeTupleSwapToTON(source: SwapToTON) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.qsrAmount);
    builder.writeNumber(source.minTonOut);
    return builder.build();
}

export function dictValueParserSwapToTON(): DictionaryValue<SwapToTON> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSwapToTON(src)).endCell());
        },
        parse: (src) => {
            return loadSwapToTON(src.loadRef().beginParse());
        }
    }
}

export type SwapToQSR = {
    $$type: 'SwapToQSR';
    tonAmount: bigint;
    minQsrOut: bigint;
}

export function storeSwapToQSR(src: SwapToQSR) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3020093557, 32);
        b_0.storeCoins(src.tonAmount);
        b_0.storeCoins(src.minQsrOut);
    };
}

export function loadSwapToQSR(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3020093557) { throw Error('Invalid prefix'); }
    const _tonAmount = sc_0.loadCoins();
    const _minQsrOut = sc_0.loadCoins();
    return { $$type: 'SwapToQSR' as const, tonAmount: _tonAmount, minQsrOut: _minQsrOut };
}

export function loadTupleSwapToQSR(source: TupleReader) {
    const _tonAmount = source.readBigNumber();
    const _minQsrOut = source.readBigNumber();
    return { $$type: 'SwapToQSR' as const, tonAmount: _tonAmount, minQsrOut: _minQsrOut };
}

export function loadGetterTupleSwapToQSR(source: TupleReader) {
    const _tonAmount = source.readBigNumber();
    const _minQsrOut = source.readBigNumber();
    return { $$type: 'SwapToQSR' as const, tonAmount: _tonAmount, minQsrOut: _minQsrOut };
}

export function storeTupleSwapToQSR(source: SwapToQSR) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.tonAmount);
    builder.writeNumber(source.minQsrOut);
    return builder.build();
}

export function dictValueParserSwapToQSR(): DictionaryValue<SwapToQSR> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSwapToQSR(src)).endCell());
        },
        parse: (src) => {
            return loadSwapToQSR(src.loadRef().beginParse());
        }
    }
}

export type ClaimFarmRewards = {
    $$type: 'ClaimFarmRewards';
}

export function storeClaimFarmRewards(src: ClaimFarmRewards) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1360209904, 32);
    };
}

export function loadClaimFarmRewards(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1360209904) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimFarmRewards' as const };
}

export function loadTupleClaimFarmRewards(source: TupleReader) {
    return { $$type: 'ClaimFarmRewards' as const };
}

export function loadGetterTupleClaimFarmRewards(source: TupleReader) {
    return { $$type: 'ClaimFarmRewards' as const };
}

export function storeTupleClaimFarmRewards(source: ClaimFarmRewards) {
    const builder = new TupleBuilder();
    return builder.build();
}

export function dictValueParserClaimFarmRewards(): DictionaryValue<ClaimFarmRewards> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeClaimFarmRewards(src)).endCell());
        },
        parse: (src) => {
            return loadClaimFarmRewards(src.loadRef().beginParse());
        }
    }
}

export type SetFarmConfig = {
    $$type: 'SetFarmConfig';
    rewardPerSecond: bigint;
    startTime: bigint;
    endTime: bigint;
}

export function storeSetFarmConfig(src: SetFarmConfig) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3889098110, 32);
        b_0.storeCoins(src.rewardPerSecond);
        b_0.storeUint(src.startTime, 32);
        b_0.storeUint(src.endTime, 32);
    };
}

export function loadSetFarmConfig(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3889098110) { throw Error('Invalid prefix'); }
    const _rewardPerSecond = sc_0.loadCoins();
    const _startTime = sc_0.loadUintBig(32);
    const _endTime = sc_0.loadUintBig(32);
    return { $$type: 'SetFarmConfig' as const, rewardPerSecond: _rewardPerSecond, startTime: _startTime, endTime: _endTime };
}

export function loadTupleSetFarmConfig(source: TupleReader) {
    const _rewardPerSecond = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _endTime = source.readBigNumber();
    return { $$type: 'SetFarmConfig' as const, rewardPerSecond: _rewardPerSecond, startTime: _startTime, endTime: _endTime };
}

export function loadGetterTupleSetFarmConfig(source: TupleReader) {
    const _rewardPerSecond = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _endTime = source.readBigNumber();
    return { $$type: 'SetFarmConfig' as const, rewardPerSecond: _rewardPerSecond, startTime: _startTime, endTime: _endTime };
}

export function storeTupleSetFarmConfig(source: SetFarmConfig) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.rewardPerSecond);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    return builder.build();
}

export function dictValueParserSetFarmConfig(): DictionaryValue<SetFarmConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetFarmConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetFarmConfig(src.loadRef().beginParse());
        }
    }
}

export type SetFeeBps = {
    $$type: 'SetFeeBps';
    feeBps: bigint;
}

export function storeSetFeeBps(src: SetFeeBps) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(385879986, 32);
        b_0.storeUint(src.feeBps, 16);
    };
}

export function loadSetFeeBps(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 385879986) { throw Error('Invalid prefix'); }
    const _feeBps = sc_0.loadUintBig(16);
    return { $$type: 'SetFeeBps' as const, feeBps: _feeBps };
}

export function loadTupleSetFeeBps(source: TupleReader) {
    const _feeBps = source.readBigNumber();
    return { $$type: 'SetFeeBps' as const, feeBps: _feeBps };
}

export function loadGetterTupleSetFeeBps(source: TupleReader) {
    const _feeBps = source.readBigNumber();
    return { $$type: 'SetFeeBps' as const, feeBps: _feeBps };
}

export function storeTupleSetFeeBps(source: SetFeeBps) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.feeBps);
    return builder.build();
}

export function dictValueParserSetFeeBps(): DictionaryValue<SetFeeBps> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetFeeBps(src)).endCell());
        },
        parse: (src) => {
            return loadSetFeeBps(src.loadRef().beginParse());
        }
    }
}

export type SetPaused = {
    $$type: 'SetPaused';
    paused: boolean;
}

export function storeSetPaused(src: SetPaused) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(157817343, 32);
        b_0.storeBit(src.paused);
    };
}

export function loadSetPaused(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 157817343) { throw Error('Invalid prefix'); }
    const _paused = sc_0.loadBit();
    return { $$type: 'SetPaused' as const, paused: _paused };
}

export function loadTupleSetPaused(source: TupleReader) {
    const _paused = source.readBoolean();
    return { $$type: 'SetPaused' as const, paused: _paused };
}

export function loadGetterTupleSetPaused(source: TupleReader) {
    const _paused = source.readBoolean();
    return { $$type: 'SetPaused' as const, paused: _paused };
}

export function storeTupleSetPaused(source: SetPaused) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.paused);
    return builder.build();
}

export function dictValueParserSetPaused(): DictionaryValue<SetPaused> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetPaused(src)).endCell());
        },
        parse: (src) => {
            return loadSetPaused(src.loadRef().beginParse());
        }
    }
}

export type SetMaxTradeBps = {
    $$type: 'SetMaxTradeBps';
    maxTradeBps: bigint;
}

export function storeSetMaxTradeBps(src: SetMaxTradeBps) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3707725903, 32);
        b_0.storeUint(src.maxTradeBps, 16);
    };
}

export function loadSetMaxTradeBps(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3707725903) { throw Error('Invalid prefix'); }
    const _maxTradeBps = sc_0.loadUintBig(16);
    return { $$type: 'SetMaxTradeBps' as const, maxTradeBps: _maxTradeBps };
}

export function loadTupleSetMaxTradeBps(source: TupleReader) {
    const _maxTradeBps = source.readBigNumber();
    return { $$type: 'SetMaxTradeBps' as const, maxTradeBps: _maxTradeBps };
}

export function loadGetterTupleSetMaxTradeBps(source: TupleReader) {
    const _maxTradeBps = source.readBigNumber();
    return { $$type: 'SetMaxTradeBps' as const, maxTradeBps: _maxTradeBps };
}

export function storeTupleSetMaxTradeBps(source: SetMaxTradeBps) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.maxTradeBps);
    return builder.build();
}

export function dictValueParserSetMaxTradeBps(): DictionaryValue<SetMaxTradeBps> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetMaxTradeBps(src)).endCell());
        },
        parse: (src) => {
            return loadSetMaxTradeBps(src.loadRef().beginParse());
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

export type EventLiquidityAdded = {
    $$type: 'EventLiquidityAdded';
    provider: Address;
    tonAmount: bigint;
    qsrAmount: bigint;
    lpMinted: bigint;
}

export function storeEventLiquidityAdded(src: EventLiquidityAdded) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(321113071, 32);
        b_0.storeAddress(src.provider);
        b_0.storeInt(src.tonAmount, 257);
        b_0.storeInt(src.qsrAmount, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.lpMinted, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadEventLiquidityAdded(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 321113071) { throw Error('Invalid prefix'); }
    const _provider = sc_0.loadAddress();
    const _tonAmount = sc_0.loadIntBig(257);
    const _qsrAmount = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _lpMinted = sc_1.loadIntBig(257);
    return { $$type: 'EventLiquidityAdded' as const, provider: _provider, tonAmount: _tonAmount, qsrAmount: _qsrAmount, lpMinted: _lpMinted };
}

export function loadTupleEventLiquidityAdded(source: TupleReader) {
    const _provider = source.readAddress();
    const _tonAmount = source.readBigNumber();
    const _qsrAmount = source.readBigNumber();
    const _lpMinted = source.readBigNumber();
    return { $$type: 'EventLiquidityAdded' as const, provider: _provider, tonAmount: _tonAmount, qsrAmount: _qsrAmount, lpMinted: _lpMinted };
}

export function loadGetterTupleEventLiquidityAdded(source: TupleReader) {
    const _provider = source.readAddress();
    const _tonAmount = source.readBigNumber();
    const _qsrAmount = source.readBigNumber();
    const _lpMinted = source.readBigNumber();
    return { $$type: 'EventLiquidityAdded' as const, provider: _provider, tonAmount: _tonAmount, qsrAmount: _qsrAmount, lpMinted: _lpMinted };
}

export function storeTupleEventLiquidityAdded(source: EventLiquidityAdded) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.provider);
    builder.writeNumber(source.tonAmount);
    builder.writeNumber(source.qsrAmount);
    builder.writeNumber(source.lpMinted);
    return builder.build();
}

export function dictValueParserEventLiquidityAdded(): DictionaryValue<EventLiquidityAdded> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventLiquidityAdded(src)).endCell());
        },
        parse: (src) => {
            return loadEventLiquidityAdded(src.loadRef().beginParse());
        }
    }
}

export type EventLiquidityRemoved = {
    $$type: 'EventLiquidityRemoved';
    provider: Address;
    tonOut: bigint;
    qsrOut: bigint;
    lpBurned: bigint;
}

export function storeEventLiquidityRemoved(src: EventLiquidityRemoved) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1531913385, 32);
        b_0.storeAddress(src.provider);
        b_0.storeInt(src.tonOut, 257);
        b_0.storeInt(src.qsrOut, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.lpBurned, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadEventLiquidityRemoved(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1531913385) { throw Error('Invalid prefix'); }
    const _provider = sc_0.loadAddress();
    const _tonOut = sc_0.loadIntBig(257);
    const _qsrOut = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _lpBurned = sc_1.loadIntBig(257);
    return { $$type: 'EventLiquidityRemoved' as const, provider: _provider, tonOut: _tonOut, qsrOut: _qsrOut, lpBurned: _lpBurned };
}

export function loadTupleEventLiquidityRemoved(source: TupleReader) {
    const _provider = source.readAddress();
    const _tonOut = source.readBigNumber();
    const _qsrOut = source.readBigNumber();
    const _lpBurned = source.readBigNumber();
    return { $$type: 'EventLiquidityRemoved' as const, provider: _provider, tonOut: _tonOut, qsrOut: _qsrOut, lpBurned: _lpBurned };
}

export function loadGetterTupleEventLiquidityRemoved(source: TupleReader) {
    const _provider = source.readAddress();
    const _tonOut = source.readBigNumber();
    const _qsrOut = source.readBigNumber();
    const _lpBurned = source.readBigNumber();
    return { $$type: 'EventLiquidityRemoved' as const, provider: _provider, tonOut: _tonOut, qsrOut: _qsrOut, lpBurned: _lpBurned };
}

export function storeTupleEventLiquidityRemoved(source: EventLiquidityRemoved) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.provider);
    builder.writeNumber(source.tonOut);
    builder.writeNumber(source.qsrOut);
    builder.writeNumber(source.lpBurned);
    return builder.build();
}

export function dictValueParserEventLiquidityRemoved(): DictionaryValue<EventLiquidityRemoved> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventLiquidityRemoved(src)).endCell());
        },
        parse: (src) => {
            return loadEventLiquidityRemoved(src.loadRef().beginParse());
        }
    }
}

export type EventSwap = {
    $$type: 'EventSwap';
    trader: Address;
    tonIn: bigint;
    qsrIn: bigint;
    tonOut: bigint;
    qsrOut: bigint;
    fee: bigint;
}

export function storeEventSwap(src: EventSwap) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3223999635, 32);
        b_0.storeAddress(src.trader);
        b_0.storeInt(src.tonIn, 257);
        b_0.storeInt(src.qsrIn, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.tonOut, 257);
        b_1.storeInt(src.qsrOut, 257);
        b_1.storeInt(src.fee, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadEventSwap(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3223999635) { throw Error('Invalid prefix'); }
    const _trader = sc_0.loadAddress();
    const _tonIn = sc_0.loadIntBig(257);
    const _qsrIn = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _tonOut = sc_1.loadIntBig(257);
    const _qsrOut = sc_1.loadIntBig(257);
    const _fee = sc_1.loadIntBig(257);
    return { $$type: 'EventSwap' as const, trader: _trader, tonIn: _tonIn, qsrIn: _qsrIn, tonOut: _tonOut, qsrOut: _qsrOut, fee: _fee };
}

export function loadTupleEventSwap(source: TupleReader) {
    const _trader = source.readAddress();
    const _tonIn = source.readBigNumber();
    const _qsrIn = source.readBigNumber();
    const _tonOut = source.readBigNumber();
    const _qsrOut = source.readBigNumber();
    const _fee = source.readBigNumber();
    return { $$type: 'EventSwap' as const, trader: _trader, tonIn: _tonIn, qsrIn: _qsrIn, tonOut: _tonOut, qsrOut: _qsrOut, fee: _fee };
}

export function loadGetterTupleEventSwap(source: TupleReader) {
    const _trader = source.readAddress();
    const _tonIn = source.readBigNumber();
    const _qsrIn = source.readBigNumber();
    const _tonOut = source.readBigNumber();
    const _qsrOut = source.readBigNumber();
    const _fee = source.readBigNumber();
    return { $$type: 'EventSwap' as const, trader: _trader, tonIn: _tonIn, qsrIn: _qsrIn, tonOut: _tonOut, qsrOut: _qsrOut, fee: _fee };
}

export function storeTupleEventSwap(source: EventSwap) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.trader);
    builder.writeNumber(source.tonIn);
    builder.writeNumber(source.qsrIn);
    builder.writeNumber(source.tonOut);
    builder.writeNumber(source.qsrOut);
    builder.writeNumber(source.fee);
    return builder.build();
}

export function dictValueParserEventSwap(): DictionaryValue<EventSwap> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventSwap(src)).endCell());
        },
        parse: (src) => {
            return loadEventSwap(src.loadRef().beginParse());
        }
    }
}

export type EventFarmReward = {
    $$type: 'EventFarmReward';
    farmer: Address;
    amount: bigint;
}

export function storeEventFarmReward(src: EventFarmReward) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3393054421, 32);
        b_0.storeAddress(src.farmer);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadEventFarmReward(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3393054421) { throw Error('Invalid prefix'); }
    const _farmer = sc_0.loadAddress();
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'EventFarmReward' as const, farmer: _farmer, amount: _amount };
}

export function loadTupleEventFarmReward(source: TupleReader) {
    const _farmer = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventFarmReward' as const, farmer: _farmer, amount: _amount };
}

export function loadGetterTupleEventFarmReward(source: TupleReader) {
    const _farmer = source.readAddress();
    const _amount = source.readBigNumber();
    return { $$type: 'EventFarmReward' as const, farmer: _farmer, amount: _amount };
}

export function storeTupleEventFarmReward(source: EventFarmReward) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.farmer);
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserEventFarmReward(): DictionaryValue<EventFarmReward> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventFarmReward(src)).endCell());
        },
        parse: (src) => {
            return loadEventFarmReward(src.loadRef().beginParse());
        }
    }
}

export type EventFeeCollected = {
    $$type: 'EventFeeCollected';
    amount: bigint;
}

export function storeEventFeeCollected(src: EventFeeCollected) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1624548570, 32);
        b_0.storeInt(src.amount, 257);
    };
}

export function loadEventFeeCollected(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1624548570) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadIntBig(257);
    return { $$type: 'EventFeeCollected' as const, amount: _amount };
}

export function loadTupleEventFeeCollected(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'EventFeeCollected' as const, amount: _amount };
}

export function loadGetterTupleEventFeeCollected(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'EventFeeCollected' as const, amount: _amount };
}

export function storeTupleEventFeeCollected(source: EventFeeCollected) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserEventFeeCollected(): DictionaryValue<EventFeeCollected> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEventFeeCollected(src)).endCell());
        },
        parse: (src) => {
            return loadEventFeeCollected(src.loadRef().beginParse());
        }
    }
}

export type LPInfo = {
    $$type: 'LPInfo';
    totalSupply: bigint;
    tonReserve: bigint;
    qsrReserve: bigint;
}

export function storeLPInfo(src: LPInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.totalSupply, 257);
        b_0.storeInt(src.tonReserve, 257);
        b_0.storeInt(src.qsrReserve, 257);
    };
}

export function loadLPInfo(slice: Slice) {
    const sc_0 = slice;
    const _totalSupply = sc_0.loadIntBig(257);
    const _tonReserve = sc_0.loadIntBig(257);
    const _qsrReserve = sc_0.loadIntBig(257);
    return { $$type: 'LPInfo' as const, totalSupply: _totalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve };
}

export function loadTupleLPInfo(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _tonReserve = source.readBigNumber();
    const _qsrReserve = source.readBigNumber();
    return { $$type: 'LPInfo' as const, totalSupply: _totalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve };
}

export function loadGetterTupleLPInfo(source: TupleReader) {
    const _totalSupply = source.readBigNumber();
    const _tonReserve = source.readBigNumber();
    const _qsrReserve = source.readBigNumber();
    return { $$type: 'LPInfo' as const, totalSupply: _totalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve };
}

export function storeTupleLPInfo(source: LPInfo) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeNumber(source.tonReserve);
    builder.writeNumber(source.qsrReserve);
    return builder.build();
}

export function dictValueParserLPInfo(): DictionaryValue<LPInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLPInfo(src)).endCell());
        },
        parse: (src) => {
            return loadLPInfo(src.loadRef().beginParse());
        }
    }
}

export type FarmInfo = {
    $$type: 'FarmInfo';
    staked: bigint;
    rewardPerSecond: bigint;
    lastUpdate: bigint;
    accRewardPerShare: bigint;
    startTime: bigint;
    endTime: bigint;
}

export function storeFarmInfo(src: FarmInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.staked, 257);
        b_0.storeInt(src.rewardPerSecond, 257);
        b_0.storeInt(src.lastUpdate, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.accRewardPerShare, 257);
        b_1.storeInt(src.startTime, 257);
        b_1.storeInt(src.endTime, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadFarmInfo(slice: Slice) {
    const sc_0 = slice;
    const _staked = sc_0.loadIntBig(257);
    const _rewardPerSecond = sc_0.loadIntBig(257);
    const _lastUpdate = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _accRewardPerShare = sc_1.loadIntBig(257);
    const _startTime = sc_1.loadIntBig(257);
    const _endTime = sc_1.loadIntBig(257);
    return { $$type: 'FarmInfo' as const, staked: _staked, rewardPerSecond: _rewardPerSecond, lastUpdate: _lastUpdate, accRewardPerShare: _accRewardPerShare, startTime: _startTime, endTime: _endTime };
}

export function loadTupleFarmInfo(source: TupleReader) {
    const _staked = source.readBigNumber();
    const _rewardPerSecond = source.readBigNumber();
    const _lastUpdate = source.readBigNumber();
    const _accRewardPerShare = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _endTime = source.readBigNumber();
    return { $$type: 'FarmInfo' as const, staked: _staked, rewardPerSecond: _rewardPerSecond, lastUpdate: _lastUpdate, accRewardPerShare: _accRewardPerShare, startTime: _startTime, endTime: _endTime };
}

export function loadGetterTupleFarmInfo(source: TupleReader) {
    const _staked = source.readBigNumber();
    const _rewardPerSecond = source.readBigNumber();
    const _lastUpdate = source.readBigNumber();
    const _accRewardPerShare = source.readBigNumber();
    const _startTime = source.readBigNumber();
    const _endTime = source.readBigNumber();
    return { $$type: 'FarmInfo' as const, staked: _staked, rewardPerSecond: _rewardPerSecond, lastUpdate: _lastUpdate, accRewardPerShare: _accRewardPerShare, startTime: _startTime, endTime: _endTime };
}

export function storeTupleFarmInfo(source: FarmInfo) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.staked);
    builder.writeNumber(source.rewardPerSecond);
    builder.writeNumber(source.lastUpdate);
    builder.writeNumber(source.accRewardPerShare);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.endTime);
    return builder.build();
}

export function dictValueParserFarmInfo(): DictionaryValue<FarmInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFarmInfo(src)).endCell());
        },
        parse: (src) => {
            return loadFarmInfo(src.loadRef().beginParse());
        }
    }
}

export type UserFarmInfo = {
    $$type: 'UserFarmInfo';
    staked: bigint;
    debt: bigint;
    pending: bigint;
}

export function storeUserFarmInfo(src: UserFarmInfo) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.staked, 257);
        b_0.storeInt(src.debt, 257);
        b_0.storeInt(src.pending, 257);
    };
}

export function loadUserFarmInfo(slice: Slice) {
    const sc_0 = slice;
    const _staked = sc_0.loadIntBig(257);
    const _debt = sc_0.loadIntBig(257);
    const _pending = sc_0.loadIntBig(257);
    return { $$type: 'UserFarmInfo' as const, staked: _staked, debt: _debt, pending: _pending };
}

export function loadTupleUserFarmInfo(source: TupleReader) {
    const _staked = source.readBigNumber();
    const _debt = source.readBigNumber();
    const _pending = source.readBigNumber();
    return { $$type: 'UserFarmInfo' as const, staked: _staked, debt: _debt, pending: _pending };
}

export function loadGetterTupleUserFarmInfo(source: TupleReader) {
    const _staked = source.readBigNumber();
    const _debt = source.readBigNumber();
    const _pending = source.readBigNumber();
    return { $$type: 'UserFarmInfo' as const, staked: _staked, debt: _debt, pending: _pending };
}

export function storeTupleUserFarmInfo(source: UserFarmInfo) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.staked);
    builder.writeNumber(source.debt);
    builder.writeNumber(source.pending);
    return builder.build();
}

export function dictValueParserUserFarmInfo(): DictionaryValue<UserFarmInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeUserFarmInfo(src)).endCell());
        },
        parse: (src) => {
            return loadUserFarmInfo(src.loadRef().beginParse());
        }
    }
}

export type SwapQuote = {
    $$type: 'SwapQuote';
    tonIn: bigint;
    qsrIn: bigint;
    tonOut: bigint;
    qsrOut: bigint;
    fee: bigint;
    priceImpactBps: bigint;
}

export function storeSwapQuote(src: SwapQuote) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.tonIn, 257);
        b_0.storeInt(src.qsrIn, 257);
        b_0.storeInt(src.tonOut, 257);
        const b_1 = new Builder();
        b_1.storeInt(src.qsrOut, 257);
        b_1.storeInt(src.fee, 257);
        b_1.storeInt(src.priceImpactBps, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadSwapQuote(slice: Slice) {
    const sc_0 = slice;
    const _tonIn = sc_0.loadIntBig(257);
    const _qsrIn = sc_0.loadIntBig(257);
    const _tonOut = sc_0.loadIntBig(257);
    const sc_1 = sc_0.loadRef().beginParse();
    const _qsrOut = sc_1.loadIntBig(257);
    const _fee = sc_1.loadIntBig(257);
    const _priceImpactBps = sc_1.loadIntBig(257);
    return { $$type: 'SwapQuote' as const, tonIn: _tonIn, qsrIn: _qsrIn, tonOut: _tonOut, qsrOut: _qsrOut, fee: _fee, priceImpactBps: _priceImpactBps };
}

export function loadTupleSwapQuote(source: TupleReader) {
    const _tonIn = source.readBigNumber();
    const _qsrIn = source.readBigNumber();
    const _tonOut = source.readBigNumber();
    const _qsrOut = source.readBigNumber();
    const _fee = source.readBigNumber();
    const _priceImpactBps = source.readBigNumber();
    return { $$type: 'SwapQuote' as const, tonIn: _tonIn, qsrIn: _qsrIn, tonOut: _tonOut, qsrOut: _qsrOut, fee: _fee, priceImpactBps: _priceImpactBps };
}

export function loadGetterTupleSwapQuote(source: TupleReader) {
    const _tonIn = source.readBigNumber();
    const _qsrIn = source.readBigNumber();
    const _tonOut = source.readBigNumber();
    const _qsrOut = source.readBigNumber();
    const _fee = source.readBigNumber();
    const _priceImpactBps = source.readBigNumber();
    return { $$type: 'SwapQuote' as const, tonIn: _tonIn, qsrIn: _qsrIn, tonOut: _tonOut, qsrOut: _qsrOut, fee: _fee, priceImpactBps: _priceImpactBps };
}

export function storeTupleSwapQuote(source: SwapQuote) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.tonIn);
    builder.writeNumber(source.qsrIn);
    builder.writeNumber(source.tonOut);
    builder.writeNumber(source.qsrOut);
    builder.writeNumber(source.fee);
    builder.writeNumber(source.priceImpactBps);
    return builder.build();
}

export function dictValueParserSwapQuote(): DictionaryValue<SwapQuote> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSwapQuote(src)).endCell());
        },
        parse: (src) => {
            return loadSwapQuote(src.loadRef().beginParse());
        }
    }
}

export type QuasarDeFi$Data = {
    $$type: 'QuasarDeFi$Data';
    owner: Address;
    qsrMaster: Address;
    lpTotalSupply: bigint;
    tonReserve: bigint;
    qsrReserve: bigint;
    lpBalances: Dictionary<Address, bigint>;
    feeBps: bigint;
    feeAccumulated: bigint;
    farmEnabled: boolean;
    farmRewardPerSecond: bigint;
    farmStartTime: bigint;
    farmEndTime: bigint;
    farmLastUpdate: bigint;
    farmAccRewardPerShare: bigint;
    farmTotalStaked: bigint;
    farmStakes: Dictionary<Address, UserFarmInfo>;
    locked: boolean;
    paused: boolean;
    maxTradeBps: bigint;
}

export function storeQuasarDeFi$Data(src: QuasarDeFi$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.qsrMaster);
        b_0.storeCoins(src.lpTotalSupply);
        b_0.storeCoins(src.tonReserve);
        b_0.storeCoins(src.qsrReserve);
        b_0.storeDict(src.lpBalances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_0.storeUint(src.feeBps, 16);
        const b_1 = new Builder();
        b_1.storeCoins(src.feeAccumulated);
        b_1.storeBit(src.farmEnabled);
        b_1.storeCoins(src.farmRewardPerSecond);
        b_1.storeUint(src.farmStartTime, 32);
        b_1.storeUint(src.farmEndTime, 32);
        b_1.storeInt(src.farmLastUpdate, 257);
        b_1.storeInt(src.farmAccRewardPerShare, 257);
        b_1.storeCoins(src.farmTotalStaked);
        b_1.storeDict(src.farmStakes, Dictionary.Keys.Address(), dictValueParserUserFarmInfo());
        b_1.storeBit(src.locked);
        b_1.storeBit(src.paused);
        b_1.storeUint(src.maxTradeBps, 16);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadQuasarDeFi$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _qsrMaster = sc_0.loadAddress();
    const _lpTotalSupply = sc_0.loadCoins();
    const _tonReserve = sc_0.loadCoins();
    const _qsrReserve = sc_0.loadCoins();
    const _lpBalances = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_0);
    const _feeBps = sc_0.loadUintBig(16);
    const sc_1 = sc_0.loadRef().beginParse();
    const _feeAccumulated = sc_1.loadCoins();
    const _farmEnabled = sc_1.loadBit();
    const _farmRewardPerSecond = sc_1.loadCoins();
    const _farmStartTime = sc_1.loadUintBig(32);
    const _farmEndTime = sc_1.loadUintBig(32);
    const _farmLastUpdate = sc_1.loadIntBig(257);
    const _farmAccRewardPerShare = sc_1.loadIntBig(257);
    const _farmTotalStaked = sc_1.loadCoins();
    const _farmStakes = Dictionary.load(Dictionary.Keys.Address(), dictValueParserUserFarmInfo(), sc_1);
    const _locked = sc_1.loadBit();
    const _paused = sc_1.loadBit();
    const _maxTradeBps = sc_1.loadUintBig(16);
    return { $$type: 'QuasarDeFi$Data' as const, owner: _owner, qsrMaster: _qsrMaster, lpTotalSupply: _lpTotalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve, lpBalances: _lpBalances, feeBps: _feeBps, feeAccumulated: _feeAccumulated, farmEnabled: _farmEnabled, farmRewardPerSecond: _farmRewardPerSecond, farmStartTime: _farmStartTime, farmEndTime: _farmEndTime, farmLastUpdate: _farmLastUpdate, farmAccRewardPerShare: _farmAccRewardPerShare, farmTotalStaked: _farmTotalStaked, farmStakes: _farmStakes, locked: _locked, paused: _paused, maxTradeBps: _maxTradeBps };
}

export function loadTupleQuasarDeFi$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _qsrMaster = source.readAddress();
    const _lpTotalSupply = source.readBigNumber();
    const _tonReserve = source.readBigNumber();
    const _qsrReserve = source.readBigNumber();
    const _lpBalances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _feeBps = source.readBigNumber();
    const _feeAccumulated = source.readBigNumber();
    const _farmEnabled = source.readBoolean();
    const _farmRewardPerSecond = source.readBigNumber();
    const _farmStartTime = source.readBigNumber();
    const _farmEndTime = source.readBigNumber();
    const _farmLastUpdate = source.readBigNumber();
    const _farmAccRewardPerShare = source.readBigNumber();
    source = source.readTuple();
    const _farmTotalStaked = source.readBigNumber();
    const _farmStakes = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserUserFarmInfo(), source.readCellOpt());
    const _locked = source.readBoolean();
    const _paused = source.readBoolean();
    const _maxTradeBps = source.readBigNumber();
    return { $$type: 'QuasarDeFi$Data' as const, owner: _owner, qsrMaster: _qsrMaster, lpTotalSupply: _lpTotalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve, lpBalances: _lpBalances, feeBps: _feeBps, feeAccumulated: _feeAccumulated, farmEnabled: _farmEnabled, farmRewardPerSecond: _farmRewardPerSecond, farmStartTime: _farmStartTime, farmEndTime: _farmEndTime, farmLastUpdate: _farmLastUpdate, farmAccRewardPerShare: _farmAccRewardPerShare, farmTotalStaked: _farmTotalStaked, farmStakes: _farmStakes, locked: _locked, paused: _paused, maxTradeBps: _maxTradeBps };
}

export function loadGetterTupleQuasarDeFi$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _qsrMaster = source.readAddress();
    const _lpTotalSupply = source.readBigNumber();
    const _tonReserve = source.readBigNumber();
    const _qsrReserve = source.readBigNumber();
    const _lpBalances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _feeBps = source.readBigNumber();
    const _feeAccumulated = source.readBigNumber();
    const _farmEnabled = source.readBoolean();
    const _farmRewardPerSecond = source.readBigNumber();
    const _farmStartTime = source.readBigNumber();
    const _farmEndTime = source.readBigNumber();
    const _farmLastUpdate = source.readBigNumber();
    const _farmAccRewardPerShare = source.readBigNumber();
    const _farmTotalStaked = source.readBigNumber();
    const _farmStakes = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserUserFarmInfo(), source.readCellOpt());
    const _locked = source.readBoolean();
    const _paused = source.readBoolean();
    const _maxTradeBps = source.readBigNumber();
    return { $$type: 'QuasarDeFi$Data' as const, owner: _owner, qsrMaster: _qsrMaster, lpTotalSupply: _lpTotalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve, lpBalances: _lpBalances, feeBps: _feeBps, feeAccumulated: _feeAccumulated, farmEnabled: _farmEnabled, farmRewardPerSecond: _farmRewardPerSecond, farmStartTime: _farmStartTime, farmEndTime: _farmEndTime, farmLastUpdate: _farmLastUpdate, farmAccRewardPerShare: _farmAccRewardPerShare, farmTotalStaked: _farmTotalStaked, farmStakes: _farmStakes, locked: _locked, paused: _paused, maxTradeBps: _maxTradeBps };
}

export function storeTupleQuasarDeFi$Data(source: QuasarDeFi$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.qsrMaster);
    builder.writeNumber(source.lpTotalSupply);
    builder.writeNumber(source.tonReserve);
    builder.writeNumber(source.qsrReserve);
    builder.writeCell(source.lpBalances.size > 0 ? beginCell().storeDictDirect(source.lpBalances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.feeBps);
    builder.writeNumber(source.feeAccumulated);
    builder.writeBoolean(source.farmEnabled);
    builder.writeNumber(source.farmRewardPerSecond);
    builder.writeNumber(source.farmStartTime);
    builder.writeNumber(source.farmEndTime);
    builder.writeNumber(source.farmLastUpdate);
    builder.writeNumber(source.farmAccRewardPerShare);
    builder.writeNumber(source.farmTotalStaked);
    builder.writeCell(source.farmStakes.size > 0 ? beginCell().storeDictDirect(source.farmStakes, Dictionary.Keys.Address(), dictValueParserUserFarmInfo()).endCell() : null);
    builder.writeBoolean(source.locked);
    builder.writeBoolean(source.paused);
    builder.writeNumber(source.maxTradeBps);
    return builder.build();
}

export function dictValueParserQuasarDeFi$Data(): DictionaryValue<QuasarDeFi$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeQuasarDeFi$Data(src)).endCell());
        },
        parse: (src) => {
            return loadQuasarDeFi$Data(src.loadRef().beginParse());
        }
    }
}

 type QuasarDeFi_init_args = {
    $$type: 'QuasarDeFi_init_args';
    owner: Address;
    qsrMaster: Address;
}

function initQuasarDeFi_init_args(src: QuasarDeFi_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.qsrMaster);
    };
}

async function QuasarDeFi_init(owner: Address, qsrMaster: Address) {
    const __code = Cell.fromHex('b5ee9c7241024e010013c0000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9012402027102160201200311020120040c020148050a02016a060802b7a0abb5134348000638cbe903e901640b4405b5b5c14c02007885fe084017d78403e08fe08e082784ce0283e08d4d5442f442b0426d5425c1c2042ee38c344448444c44484444444844444440444444403c44403d543b6cf1b3cdb10e250700485611c000917f9320c000e29430705300e0205611a85612a904015610a85612a90456125902bba03fb5134348000638cbe903e901640b4405b5b5c14c02007885fe084017d78403e08fe08e082784ce0283e08d4d5442f442b0426d5425c1c2042ee38c344448444c44484444444844444440444444403c44403d543b6cf15c417c3db0c62509004681010b2f028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e2028dad39f6a268690000c7197d207d202c816880b6b6b82980400f10bfc10802faf0807c11fc11c104f099c0507c11a9aa885e8856084daa84b8384085dc7186ed9e2b882f87b618c0250b00022c0201200d0f02c9b1d0fb5134348000638cbe903e901640b4405b5b5c14c02007885fe084017d78403e08fe08e082784ce0283e08d4d5442f442b0426d5425c1c2042ee38c344448445044484444444c44444440444844403c44443c38444038437d54736cf15c417c3db0c60250e023456128e83a8db3ce1015612a85611a904015612a85610a904db3c2948028db32dbb5134348000638cbe903e901640b4405b5b5c14c02007885fe084017d78403e08fe08e082784ce0283e08d4d5442f442b0426d5425c1c2042ee38c376cf15c417c3db0c602510000456110201c71214028caa9eed44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30ddb3c57105f0f6c31251300022b028ca91ded44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30ddb3c57105f0f6c31251500045612020120171c02039a08181a0287bd7ed44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30ddb3c6cf36c4382519000c56105610561002b7ba9ed44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30d1112111311121111111211111110111111100f11100f550edb3c6cc66c768251b00802fc000917f9320c000e29770547000201045e0205611a8561022a0a904530ea8812710a90466a122812710a85612a90420812710bc9430812710de70520215140201661d220201201e200288a936ed44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30ddb3c6cc66c76251f000c5474965478ba02b8ab23ed44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30d1112111311121111111211111110111111100f11100f550edb3c6cf36c432521007881010b250259f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2206e943070530097206ef2d0806f23e202b9af7d76a268690000c7197d207d202c816880b6b6b82980400f10bfc10802faf0807c11fc11c104f099c0507c11a9aa885e8856084daa84b8384085dc718688890889888908888889088888880888888807888807aa876d9e3663363b402523007c5610c000917f9320c000e2957054700020e0530fa8561122a0a904530ea8812710a90466a122812710a85613a90420812710bc9430812710de705422031403f03001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e32fa40fa405902d1016d6d705300801e217f821005f5e100f823f8238209e13380a0f823535510bd10ac109b55097070810bb8e30d1114945f0f5f05e0705613d74920c21f97311113d31f1114de21821004ad3783bae3022125262700b4fa40fa40fa00fa00fa00f404d30fd401d0fa00d200fa00d31fd31f810101d700810101d700fa00f404d200d200d30f300c11130c0c11120c0c11110c0c11100c10cf10ce10cd57131111111211111110111111100f11100f550e01765b1112d33f31fa0030816b90f8425612c705f2f41da01110111211100f11110f0e11100e10df0e10bd10ac109b108a1079106810571046103544304c04de821008bfa37dba8fdd5b1112fa00fa0030011113011114db3cdb3c812fab5614c200945615c2009170e2f2f48200bcd5f8416f24135f035615bef2f45610c2008e21810de95614812710a8561123a8bbf2f48200d5df5615812710a8561023a8bbf2f4de5610e0218210c3f44eb8ba433c282f03de8e9456135611a85610a90456155612a85610a904db3c8e8756135615a8db3ce28200d97e21c200f2f411105614a00f5615a011115610a081010bf8425610598101014133f40a6fa19401d70030925b6de281010bf842226e933256129902206ef2d0805613a0e2031111031281010148292a003a20c101923070e05300a4ab00935301b999315ca9045210a0ab00e8303103fe216e955b59f4593098c801cf004133f441e21112111311121111111311110e11100e0e11130e55c0db3cf8425614db3cf842708040f8420302111802011119011117c8553082101323cbef5005cb1f13ce810101cf00810101cf0001c8810101cf00cdc90311140302111502011116015a6d6d40037fc8cf8580ca00cf8440472b2e02f62581010b2359f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2206e8e46206ef2d0806f2352a2a15220a882103b9aca00a90481010b5134a059a052a0c855205023810101cf00810101cf00810101cf00c910374170206e953059f45930944133f413e2e30d5054a02c2d005c3081010b531870c855205023810101cf00810101cf00810101cf00c910374170206e953059f45930944133f413e20002040274ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000f11120f0e11110e0d11100d10cf552b12db3c404c043ce30221821042a7c44cbae302218210b402f875bae302218210511327f0ba30383b4103fc5b1112fa00301111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411134130db3cdb3c81010bf8422f598101014133f40a6fa19401d70030925b6de28200cbbe5615c200f2f481584e216eb39921206ef2d0805616be9170e2f2f456145611a85612a90456155611a85613433c3103f8a9048200a9cb22c2009321c2009170e2f2f41112111511121111111411111110111311100f11150f0e11140e0d11130d0c11150c0b11140b0a11130a0911150908111408071113070611150605111405041113040311150302111402011113011115db3cf8425617db3c81010bf8421116206ef2d0805618a1103f1247323401f42581010b2359f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e28200c89e216eb39b21206ef2d0806f235b23be9170e2f2f4206ef2d0806f2352a2a15220a882103b9aca00a90481010b5134a159a052a0c855205023810101cf00810101cf00810101cf00c910373300284170206e953059f45930944133f413e25054a10402ea01111601810101216e955b59f4593098c801cf004133f441e20f5615a10e5612a10d5614a1f84272885615595a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00f842708040f8420302111602011118011119c83536000001fe553082105b4f24a95005cb1f13ce810101cf00810101cf0001c8810101cf00cdc90311160302111302011115015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000e11120e0d11110d0b11100b10af10de10cd108c107b106a105910483701c8103746145053db3cc87f01ca00111311121111111055e0011112011113ce01111001ce500efa02500cfa02500afa0218f40016cb0fc85005fa0213ca0001fa02cb1f12cb1f12810101cf0012810101cf0058fa0212f40012ca0012ca0012cb0fcdc9ed544003f85b1112fa00fa0030011113011114db3cdb3c8115f75614c200932fc2009170e2f2f4816d195614812710a8561023a8bbf2f456135610a82f5615a0a904530da8812710a90466a1208200a2391118be01111701f2f4813fc35616c2009556165612b99170e2f2f40f5614a011105615a151cfa0f84272f84270541322433c3901f402111902561a021115c855508210c02a54935007cb1f15ce13810101cf00810101cf0001c8810101cf0012810101cf0012810101cf00cdc90311150302111602011110015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb003a01f41110111211100f11110f0e11100e109f10de10bd10ac10ab108a5517db3cc87f01ca00111311121111111055e0011112011113ce01111001ce500efa02500cfa02500afa0218f40016cb0fc85005fa0213ca0001fa02cb1f12cb1f12810101cf0012810101cf0058fa0212f40012ca0012ca0012cb0fcdc9ed544003fc5b1112fa00fa0030011113011114db3cdb3c8115f75614c200945610c2009170e2f2f48200bcd5f8416f24135f035615bef2f4816d195614812710a8561123a8bbf2f456132fa856105615a0a904530da8812710a90466a1208200a2391118be01111701f2f4813fc35616c2009556165611b99170e2f2f411105614a00f433c3d00168200a57a03b313f2f47f0202fc5615a10c5610a0f842708040f84254332204111a045a01111b011116c855508210c02a54935007cb1f15ce13810101cf00810101cf0001c8810101cf0012810101cf0012810101cf00cdc90311110302111502011116015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf818ae2f400c9013e3f001a58cf8680cf8480f400f400cf8101e8fb001110111211100f11110f0e11100e10cf109e551bdb3cc87f01ca00111311121111111055e0011112011113ce01111001ce500efa02500cfa02500afa0218f40016cb0fc85005fa0213ca0001fa02cb1f12cb1f12810101cf0012810101cf0058fa0212f40012ca0012ca0012cb0fcdc9ed54400004703304d0e302218210e7ceed7ebae30221821017000fb2ba8ec95b3b1111d30f3082008aabf8425612c705f2f482009ab021c2009321c1659170e2f2f41110111211100f11110f0e11100e10df10ce10bd0c109b108a10791068105710461035443012e0218210096819ffba42454c4903fc5b57121110111211100f11110f0e11100e551ddb3cdb3c81010bf842255959f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2814159216eb39b21206ef2d0806f235bc2009170e2f2f4206ef2d0806f235282a15220a882103b9aca00a904a08200f7f321c200f2f481010b434744000e81618922b3f2f401fef842513970c855205023810101cf00810101cf00810101cf00c910374170206e953059f45930944133f413e2f84272f84227c8598210ca3de6d55003cb1fce810101cf00c9102310275a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004c01f85b1112fa00d31fd31f3082008aabf8425615c705f2f482009e4823c200f2f48200ceae5312bcf2f4817b70f8235220bef2f41112111311121111111311111110111311100f11130f0e11130e0d11130d0c11130c0b11130b0a11130a091113090811130807111307061113060511130504111304031113030211130246026e011114011115db3c3737375611245613b9953403111103925712e20f11120f0e11110e0d11100d10cf10be10ad109c108b107a10795523474c0152f82327bb917f9324c000e2dcf82328db3c5307bb9130e05208a12aa882103b9aca00a825a90416a00548000e5cb991309131e204bc8eba5f031111d2003082008aabf8425612c705f2f41110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035440302e0218210dcff684fbae302218210946a98b6bae3025714c0001113c12101111301b04c4a4b4d01985b57131111d30f3082008aabf8425612c705f2f4814dc321c2639521811388bb9170e2f2f41110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430124c01c65b1112d33f30c8018210aff90f5758cb1fcb3fc91111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb004c00b8c87f01ca00111311121111111055e0011112011113ce01111001ce500efa02500cfa02500afa0218f40016cb0fc85005fa0213ca0001fa02cb1f12cb1f12810101cf0012810101cf0058fa0212f40012ca0012ca0012cb0fcdc9ed5400ec8e6c1110111211100f11110f0e11100e551dc87f01ca00111311121111111055e0011112011113ce01111001ce500efa02500cfa02500afa0218f40016cb0fc85005fa0213ca0001fa02cb1f12cb1f12810101cf0012810101cf0058fa0212f40012ca0012ca0012cb0fcdc9ed54e05f0f5f04f2c08204af08c2');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initQuasarDeFi_init_args({ $$type: 'QuasarDeFi_init_args', owner, qsrMaster })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const QuasarDeFi_errors = {
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
    3561: { message: "TON deposit too large" },
    5623: { message: "Invalid swap" },
    12203: { message: "Invalid amounts" },
    16323: { message: "Insufficient reserve" },
    16729: { message: "No LP stake" },
    19907: { message: "Trade limit 1%-50%" },
    22606: { message: "Insufficient LP balance" },
    24969: { message: "DeFi paused" },
    27536: { message: "Only QSR master" },
    27929: { message: "Trade too large" },
    31600: { message: "Farm already ended" },
    35499: { message: "Only owner" },
    39600: { message: "Fee must be 0.01%-1%" },
    40520: { message: "Invalid reward rate" },
    41529: { message: "Slippage exceeded" },
    42362: { message: "Reentrant call" },
    43467: { message: "Zero output" },
    48341: { message: "Insufficient TON sent" },
    51358: { message: "Farm stake insufficient" },
    52158: { message: "Invalid LP amount" },
    52910: { message: "Invalid farm period" },
    54751: { message: "QSR deposit too large" },
    55678: { message: "Zero LP tokens" },
    63475: { message: "No rewards to claim" },
} as const

export const QuasarDeFi_errors_backward = {
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
    "TON deposit too large": 3561,
    "Invalid swap": 5623,
    "Invalid amounts": 12203,
    "Insufficient reserve": 16323,
    "No LP stake": 16729,
    "Trade limit 1%-50%": 19907,
    "Insufficient LP balance": 22606,
    "DeFi paused": 24969,
    "Only QSR master": 27536,
    "Trade too large": 27929,
    "Farm already ended": 31600,
    "Only owner": 35499,
    "Fee must be 0.01%-1%": 39600,
    "Invalid reward rate": 40520,
    "Slippage exceeded": 41529,
    "Reentrant call": 42362,
    "Zero output": 43467,
    "Insufficient TON sent": 48341,
    "Farm stake insufficient": 51358,
    "Invalid LP amount": 52158,
    "Invalid farm period": 52910,
    "QSR deposit too large": 54751,
    "Zero LP tokens": 55678,
    "No rewards to claim": 63475,
} as const

const QuasarDeFi_types: ABIType[] = [
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
    {"name":"AddLiquidity","header":146776957,"fields":[{"name":"tonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"qsrAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"RemoveLiquidity","header":3287568056,"fields":[{"name":"lpAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"SwapToTON","header":1118291020,"fields":[{"name":"qsrAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"minTonOut","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"SwapToQSR","header":3020093557,"fields":[{"name":"tonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"minQsrOut","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"ClaimFarmRewards","header":1360209904,"fields":[]},
    {"name":"SetFarmConfig","header":3889098110,"fields":[{"name":"rewardPerSecond","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"SetFeeBps","header":385879986,"fields":[{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"SetPaused","header":157817343,"fields":[{"name":"paused","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SetMaxTradeBps","header":3707725903,"fields":[{"name":"maxTradeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"TokenNotification","header":78460803,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"EventLiquidityAdded","header":321113071,"fields":[{"name":"provider","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lpMinted","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventLiquidityRemoved","header":1531913385,"fields":[{"name":"provider","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lpBurned","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventSwap","header":3223999635,"fields":[{"name":"trader","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"fee","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventFarmReward","header":3393054421,"fields":[{"name":"farmer","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventFeeCollected","header":1624548570,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"LPInfo","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonReserve","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrReserve","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"FarmInfo","header":null,"fields":[{"name":"staked","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"rewardPerSecond","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastUpdate","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"accRewardPerShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"startTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"endTime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UserFarmInfo","header":null,"fields":[{"name":"staked","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"debt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pending","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SwapQuote","header":null,"fields":[{"name":"tonIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"fee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceImpactBps","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"QuasarDeFi$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"qsrMaster","type":{"kind":"simple","type":"address","optional":false}},{"name":"lpTotalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"tonReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"qsrReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lpBalances","type":{"kind":"dict","key":"address","value":"int"}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeAccumulated","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"farmRewardPerSecond","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmStartTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"farmEndTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"farmLastUpdate","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"farmAccRewardPerShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"farmTotalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmStakes","type":{"kind":"dict","key":"address","value":"UserFarmInfo","valueFormat":"ref"}},{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"paused","type":{"kind":"simple","type":"bool","optional":false}},{"name":"maxTradeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
]

const QuasarDeFi_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "AddLiquidity": 146776957,
    "RemoveLiquidity": 3287568056,
    "SwapToTON": 1118291020,
    "SwapToQSR": 3020093557,
    "ClaimFarmRewards": 1360209904,
    "SetFarmConfig": 3889098110,
    "SetFeeBps": 385879986,
    "SetPaused": 157817343,
    "SetMaxTradeBps": 3707725903,
    "TokenNotification": 78460803,
    "EventLiquidityAdded": 321113071,
    "EventLiquidityRemoved": 1531913385,
    "EventSwap": 3223999635,
    "EventFarmReward": 3393054421,
    "EventFeeCollected": 1624548570,
}

const QuasarDeFi_getters: ABIGetter[] = [
    {"name":"lpBalance","methodId":66831,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"poolInfo","methodId":106583,"arguments":[],"returnType":{"kind":"simple","type":"LPInfo","optional":false}},
    {"name":"farmInfo","methodId":119094,"arguments":[],"returnType":{"kind":"simple","type":"FarmInfo","optional":false}},
    {"name":"userFarm","methodId":120611,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"UserFarmInfo","optional":false}},
    {"name":"estimateSwapToTon","methodId":106665,"arguments":[{"name":"qsrAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"SwapQuote","optional":false}},
    {"name":"estimateSwapToQsr","methodId":122618,"arguments":[{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"SwapQuote","optional":false}},
    {"name":"estimateLpOut","methodId":75587,"arguments":[{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"estimateRemoveLiquidity","methodId":66602,"arguments":[{"name":"lpAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"LPInfo","optional":false}},
    {"name":"feeConfig","methodId":68211,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"feeAccumulated","methodId":82590,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","methodId":83229,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"qsrMaster","methodId":81078,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const QuasarDeFi_getterMapping: { [key: string]: string } = {
    'lpBalance': 'getLpBalance',
    'poolInfo': 'getPoolInfo',
    'farmInfo': 'getFarmInfo',
    'userFarm': 'getUserFarm',
    'estimateSwapToTon': 'getEstimateSwapToTon',
    'estimateSwapToQsr': 'getEstimateSwapToQsr',
    'estimateLpOut': 'getEstimateLpOut',
    'estimateRemoveLiquidity': 'getEstimateRemoveLiquidity',
    'feeConfig': 'getFeeConfig',
    'feeAccumulated': 'getFeeAccumulated',
    'owner': 'getOwner',
    'qsrMaster': 'getQsrMaster',
}

const QuasarDeFi_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"empty"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"AddLiquidity"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RemoveLiquidity"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SwapToTON"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SwapToQSR"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ClaimFarmRewards"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetFarmConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetFeeBps"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetPaused"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetMaxTradeBps"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]


export class QuasarDeFi implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = QuasarDeFi_errors_backward;
    public static readonly opcodes = QuasarDeFi_opcodes;
    
    static async init(owner: Address, qsrMaster: Address) {
        return await QuasarDeFi_init(owner, qsrMaster);
    }
    
    static async fromInit(owner: Address, qsrMaster: Address) {
        const __gen_init = await QuasarDeFi_init(owner, qsrMaster);
        const address = contractAddress(0, __gen_init);
        return new QuasarDeFi(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new QuasarDeFi(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  QuasarDeFi_types,
        getters: QuasarDeFi_getters,
        receivers: QuasarDeFi_receivers,
        errors: QuasarDeFi_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | TokenNotification | AddLiquidity | RemoveLiquidity | SwapToTON | SwapToQSR | ClaimFarmRewards | SetFarmConfig | SetFeeBps | SetPaused | SetMaxTradeBps | Deploy) {
        
        let body: Cell | null = null;
        if (message === null) {
            body = new Cell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenNotification') {
            body = beginCell().store(storeTokenNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'AddLiquidity') {
            body = beginCell().store(storeAddLiquidity(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RemoveLiquidity') {
            body = beginCell().store(storeRemoveLiquidity(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SwapToTON') {
            body = beginCell().store(storeSwapToTON(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SwapToQSR') {
            body = beginCell().store(storeSwapToQSR(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ClaimFarmRewards') {
            body = beginCell().store(storeClaimFarmRewards(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetFarmConfig') {
            body = beginCell().store(storeSetFarmConfig(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetFeeBps') {
            body = beginCell().store(storeSetFeeBps(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetPaused') {
            body = beginCell().store(storeSetPaused(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetMaxTradeBps') {
            body = beginCell().store(storeSetMaxTradeBps(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getLpBalance(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('lpBalance', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getPoolInfo(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('poolInfo', builder.build())).stack;
        const result = loadGetterTupleLPInfo(source);
        return result;
    }
    
    async getFarmInfo(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('farmInfo', builder.build())).stack;
        const result = loadGetterTupleFarmInfo(source);
        return result;
    }
    
    async getUserFarm(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('userFarm', builder.build())).stack;
        const result = loadGetterTupleUserFarmInfo(source);
        return result;
    }
    
    async getEstimateSwapToTon(provider: ContractProvider, qsrAmount: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(qsrAmount);
        const source = (await provider.get('estimateSwapToTon', builder.build())).stack;
        const result = loadGetterTupleSwapQuote(source);
        return result;
    }
    
    async getEstimateSwapToQsr(provider: ContractProvider, tonAmount: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(tonAmount);
        const source = (await provider.get('estimateSwapToQsr', builder.build())).stack;
        const result = loadGetterTupleSwapQuote(source);
        return result;
    }
    
    async getEstimateLpOut(provider: ContractProvider, tonAmount: bigint, qsrAmount: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(tonAmount);
        builder.writeNumber(qsrAmount);
        const source = (await provider.get('estimateLpOut', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getEstimateRemoveLiquidity(provider: ContractProvider, lpAmount: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(lpAmount);
        const source = (await provider.get('estimateRemoveLiquidity', builder.build())).stack;
        const result = loadGetterTupleLPInfo(source);
        return result;
    }
    
    async getFeeConfig(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('feeConfig', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getFeeAccumulated(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('feeAccumulated', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('owner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getQsrMaster(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('qsrMaster', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}