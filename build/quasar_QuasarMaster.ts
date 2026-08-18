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

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadGetterTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
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
        let b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(8);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleStdAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleStdAddress(source: StdAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
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
        let b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    let sc_0 = slice;
    let _workchain = sc_0.loadIntBig(32);
    let _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function loadGetterTupleVarAddress(source: TupleReader) {
    let _workchain = source.readBigNumber();
    let _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

function storeTupleVarAddress(source: VarAddress) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadGetterTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
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
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadGetterTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadGetterTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
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
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadGetterTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
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
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadGetterTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type AISetOracle = {
    $$type: 'AISetOracle';
    oracleAddress: Address;
}

export function storeAISetOracle(src: AISetOracle) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(707361075, 32);
        b_0.storeAddress(src.oracleAddress);
    };
}

export function loadAISetOracle(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 707361075) { throw Error('Invalid prefix'); }
    let _oracleAddress = sc_0.loadAddress();
    return { $$type: 'AISetOracle' as const, oracleAddress: _oracleAddress };
}

function loadTupleAISetOracle(source: TupleReader) {
    let _oracleAddress = source.readAddress();
    return { $$type: 'AISetOracle' as const, oracleAddress: _oracleAddress };
}

function loadGetterTupleAISetOracle(source: TupleReader) {
    let _oracleAddress = source.readAddress();
    return { $$type: 'AISetOracle' as const, oracleAddress: _oracleAddress };
}

function storeTupleAISetOracle(source: AISetOracle) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.oracleAddress);
    return builder.build();
}

function dictValueParserAISetOracle(): DictionaryValue<AISetOracle> {
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
        let b_0 = builder;
        b_0.storeUint(3323893351, 32);
        b_0.storeBit(src.enabled);
    };
}

export function loadAIGrantFullAutonomy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3323893351) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    return { $$type: 'AIGrantFullAutonomy' as const, enabled: _enabled };
}

function loadTupleAIGrantFullAutonomy(source: TupleReader) {
    let _enabled = source.readBoolean();
    return { $$type: 'AIGrantFullAutonomy' as const, enabled: _enabled };
}

function loadGetterTupleAIGrantFullAutonomy(source: TupleReader) {
    let _enabled = source.readBoolean();
    return { $$type: 'AIGrantFullAutonomy' as const, enabled: _enabled };
}

function storeTupleAIGrantFullAutonomy(source: AIGrantFullAutonomy) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    return builder.build();
}

function dictValueParserAIGrantFullAutonomy(): DictionaryValue<AIGrantFullAutonomy> {
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
        let b_0 = builder;
        b_0.storeUint(2409132733, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeStringRefTail(src.status);
    };
}

export function loadAIHeartbeat(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2409132733) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _status = sc_0.loadStringRefTail();
    return { $$type: 'AIHeartbeat' as const, queryId: _queryId, status: _status };
}

function loadTupleAIHeartbeat(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _status = source.readString();
    return { $$type: 'AIHeartbeat' as const, queryId: _queryId, status: _status };
}

function loadGetterTupleAIHeartbeat(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _status = source.readString();
    return { $$type: 'AIHeartbeat' as const, queryId: _queryId, status: _status };
}

function storeTupleAIHeartbeat(source: AIHeartbeat) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeString(source.status);
    return builder.build();
}

function dictValueParserAIHeartbeat(): DictionaryValue<AIHeartbeat> {
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
        let b_0 = builder;
        b_0.storeUint(2637925553, 32);
        b_0.storeUint(src.actionId, 64);
        b_0.storeAddress(src.voter);
        b_0.storeCoins(src.stake);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIVetoVote(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2637925553) { throw Error('Invalid prefix'); }
    let _actionId = sc_0.loadUintBig(64);
    let _voter = sc_0.loadAddress();
    let _stake = sc_0.loadCoins();
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIVetoVote' as const, actionId: _actionId, voter: _voter, stake: _stake, reason: _reason };
}

function loadTupleAIVetoVote(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _voter = source.readAddress();
    let _stake = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AIVetoVote' as const, actionId: _actionId, voter: _voter, stake: _stake, reason: _reason };
}

function loadGetterTupleAIVetoVote(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _voter = source.readAddress();
    let _stake = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AIVetoVote' as const, actionId: _actionId, voter: _voter, stake: _stake, reason: _reason };
}

function storeTupleAIVetoVote(source: AIVetoVote) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeAddress(source.voter);
    builder.writeNumber(source.stake);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAIVetoVote(): DictionaryValue<AIVetoVote> {
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
        let b_0 = builder;
        b_0.storeUint(164764433, 32);
        b_0.storeUint(src.actionId, 64);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadOwnerOverride(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 164764433) { throw Error('Invalid prefix'); }
    let _actionId = sc_0.loadUintBig(64);
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'OwnerOverride' as const, actionId: _actionId, reason: _reason };
}

function loadTupleOwnerOverride(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'OwnerOverride' as const, actionId: _actionId, reason: _reason };
}

function loadGetterTupleOwnerOverride(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'OwnerOverride' as const, actionId: _actionId, reason: _reason };
}

function storeTupleOwnerOverride(source: OwnerOverride) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserOwnerOverride(): DictionaryValue<OwnerOverride> {
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
        let b_0 = builder;
        b_0.storeUint(679670248, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.targetFeeBps, 16);
        b_0.storeUint(src.targetBurnShare, 8);
        b_0.storeStringRefTail(src.recommendation);
    };
}

export function loadAIRebalance(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 679670248) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _targetFeeBps = sc_0.loadUintBig(16);
    let _targetBurnShare = sc_0.loadUintBig(8);
    let _recommendation = sc_0.loadStringRefTail();
    return { $$type: 'AIRebalance' as const, queryId: _queryId, targetFeeBps: _targetFeeBps, targetBurnShare: _targetBurnShare, recommendation: _recommendation };
}

function loadTupleAIRebalance(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _targetFeeBps = source.readBigNumber();
    let _targetBurnShare = source.readBigNumber();
    let _recommendation = source.readString();
    return { $$type: 'AIRebalance' as const, queryId: _queryId, targetFeeBps: _targetFeeBps, targetBurnShare: _targetBurnShare, recommendation: _recommendation };
}

function loadGetterTupleAIRebalance(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _targetFeeBps = source.readBigNumber();
    let _targetBurnShare = source.readBigNumber();
    let _recommendation = source.readString();
    return { $$type: 'AIRebalance' as const, queryId: _queryId, targetFeeBps: _targetFeeBps, targetBurnShare: _targetBurnShare, recommendation: _recommendation };
}

function storeTupleAIRebalance(source: AIRebalance) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.targetFeeBps);
    builder.writeNumber(source.targetBurnShare);
    builder.writeString(source.recommendation);
    return builder.build();
}

function dictValueParserAIRebalance(): DictionaryValue<AIRebalance> {
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
        let b_0 = builder;
        b_0.storeUint(1763742623, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.priceTon);
        b_0.storeUint(src.volatility, 32);
        b_0.storeInt(src.sentiment, 8);
        b_0.storeUint(src.action, 8);
    };
}

export function loadAIPriceSignal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1763742623) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _priceTon = sc_0.loadCoins();
    let _volatility = sc_0.loadUintBig(32);
    let _sentiment = sc_0.loadIntBig(8);
    let _action = sc_0.loadUintBig(8);
    return { $$type: 'AIPriceSignal' as const, queryId: _queryId, priceTon: _priceTon, volatility: _volatility, sentiment: _sentiment, action: _action };
}

function loadTupleAIPriceSignal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _priceTon = source.readBigNumber();
    let _volatility = source.readBigNumber();
    let _sentiment = source.readBigNumber();
    let _action = source.readBigNumber();
    return { $$type: 'AIPriceSignal' as const, queryId: _queryId, priceTon: _priceTon, volatility: _volatility, sentiment: _sentiment, action: _action };
}

function loadGetterTupleAIPriceSignal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _priceTon = source.readBigNumber();
    let _volatility = source.readBigNumber();
    let _sentiment = source.readBigNumber();
    let _action = source.readBigNumber();
    return { $$type: 'AIPriceSignal' as const, queryId: _queryId, priceTon: _priceTon, volatility: _volatility, sentiment: _sentiment, action: _action };
}

function storeTupleAIPriceSignal(source: AIPriceSignal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.priceTon);
    builder.writeNumber(source.volatility);
    builder.writeNumber(source.sentiment);
    builder.writeNumber(source.action);
    return builder.build();
}

function dictValueParserAIPriceSignal(): DictionaryValue<AIPriceSignal> {
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
        let b_0 = builder;
        b_0.storeUint(3697509643, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.severity, 8);
        b_0.storeUint(src.anomalyType, 8);
        b_0.storeUint(src.affectedWallets, 32);
        b_0.storeStringRefTail(src.recommendedAction);
    };
}

export function loadAIAnomalyAlert(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3697509643) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _severity = sc_0.loadUintBig(8);
    let _anomalyType = sc_0.loadUintBig(8);
    let _affectedWallets = sc_0.loadUintBig(32);
    let _recommendedAction = sc_0.loadStringRefTail();
    return { $$type: 'AIAnomalyAlert' as const, queryId: _queryId, severity: _severity, anomalyType: _anomalyType, affectedWallets: _affectedWallets, recommendedAction: _recommendedAction };
}

function loadTupleAIAnomalyAlert(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _severity = source.readBigNumber();
    let _anomalyType = source.readBigNumber();
    let _affectedWallets = source.readBigNumber();
    let _recommendedAction = source.readString();
    return { $$type: 'AIAnomalyAlert' as const, queryId: _queryId, severity: _severity, anomalyType: _anomalyType, affectedWallets: _affectedWallets, recommendedAction: _recommendedAction };
}

function loadGetterTupleAIAnomalyAlert(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _severity = source.readBigNumber();
    let _anomalyType = source.readBigNumber();
    let _affectedWallets = source.readBigNumber();
    let _recommendedAction = source.readString();
    return { $$type: 'AIAnomalyAlert' as const, queryId: _queryId, severity: _severity, anomalyType: _anomalyType, affectedWallets: _affectedWallets, recommendedAction: _recommendedAction };
}

function storeTupleAIAnomalyAlert(source: AIAnomalyAlert) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.severity);
    builder.writeNumber(source.anomalyType);
    builder.writeNumber(source.affectedWallets);
    builder.writeString(source.recommendedAction);
    return builder.build();
}

function dictValueParserAIAnomalyAlert(): DictionaryValue<AIAnomalyAlert> {
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
        let b_0 = builder;
        b_0.storeUint(3633360959, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.proposalType, 8);
        b_0.storeInt(src.newValue, 257);
        b_0.storeStringRefTail(src.description);
        b_0.storeUint(src.confidence, 8);
    };
}

export function loadAIGovernanceProposal(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3633360959) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _proposalType = sc_0.loadUintBig(8);
    let _newValue = sc_0.loadIntBig(257);
    let _description = sc_0.loadStringRefTail();
    let _confidence = sc_0.loadUintBig(8);
    return { $$type: 'AIGovernanceProposal' as const, queryId: _queryId, proposalType: _proposalType, newValue: _newValue, description: _description, confidence: _confidence };
}

function loadTupleAIGovernanceProposal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _proposalType = source.readBigNumber();
    let _newValue = source.readBigNumber();
    let _description = source.readString();
    let _confidence = source.readBigNumber();
    return { $$type: 'AIGovernanceProposal' as const, queryId: _queryId, proposalType: _proposalType, newValue: _newValue, description: _description, confidence: _confidence };
}

function loadGetterTupleAIGovernanceProposal(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _proposalType = source.readBigNumber();
    let _newValue = source.readBigNumber();
    let _description = source.readString();
    let _confidence = source.readBigNumber();
    return { $$type: 'AIGovernanceProposal' as const, queryId: _queryId, proposalType: _proposalType, newValue: _newValue, description: _description, confidence: _confidence };
}

function storeTupleAIGovernanceProposal(source: AIGovernanceProposal) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.proposalType);
    builder.writeNumber(source.newValue);
    builder.writeString(source.description);
    builder.writeNumber(source.confidence);
    return builder.build();
}

function dictValueParserAIGovernanceProposal(): DictionaryValue<AIGovernanceProposal> {
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
        let b_0 = builder;
        b_0.storeUint(400520088, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetFee(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 400520088) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _feeBps = sc_0.loadUintBig(16);
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetFee' as const, queryId: _queryId, feeBps: _feeBps, reason: _reason };
}

function loadTupleAISetFee(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _feeBps = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AISetFee' as const, queryId: _queryId, feeBps: _feeBps, reason: _reason };
}

function loadGetterTupleAISetFee(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _feeBps = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AISetFee' as const, queryId: _queryId, feeBps: _feeBps, reason: _reason };
}

function storeTupleAISetFee(source: AISetFee) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.feeBps);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAISetFee(): DictionaryValue<AISetFee> {
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
        let b_0 = builder;
        b_0.storeUint(2042225859, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.treasury);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetTreasuryDirect(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2042225859) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _treasury = sc_0.loadAddress();
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetTreasuryDirect' as const, queryId: _queryId, treasury: _treasury, reason: _reason };
}

function loadTupleAISetTreasuryDirect(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _treasury = source.readAddress();
    let _reason = source.readString();
    return { $$type: 'AISetTreasuryDirect' as const, queryId: _queryId, treasury: _treasury, reason: _reason };
}

function loadGetterTupleAISetTreasuryDirect(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _treasury = source.readAddress();
    let _reason = source.readString();
    return { $$type: 'AISetTreasuryDirect' as const, queryId: _queryId, treasury: _treasury, reason: _reason };
}

function storeTupleAISetTreasuryDirect(source: AISetTreasuryDirect) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.treasury);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAISetTreasuryDirect(): DictionaryValue<AISetTreasuryDirect> {
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
        let b_0 = builder;
        b_0.storeUint(284672247, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.maxTxBps, 16);
        b_0.storeUint(src.maxWalletBps, 16);
        b_0.storeUint(src.cooldown, 16);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAISetAntiWhale(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 284672247) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _maxTxBps = sc_0.loadUintBig(16);
    let _maxWalletBps = sc_0.loadUintBig(16);
    let _cooldown = sc_0.loadUintBig(16);
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetAntiWhale' as const, queryId: _queryId, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, reason: _reason };
}

function loadTupleAISetAntiWhale(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AISetAntiWhale' as const, queryId: _queryId, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, reason: _reason };
}

function loadGetterTupleAISetAntiWhale(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AISetAntiWhale' as const, queryId: _queryId, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, reason: _reason };
}

function storeTupleAISetAntiWhale(source: AISetAntiWhale) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.maxTxBps);
    builder.writeNumber(source.maxWalletBps);
    builder.writeNumber(source.cooldown);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAISetAntiWhale(): DictionaryValue<AISetAntiWhale> {
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
        let b_0 = builder;
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
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 156406141) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _enabled = sc_0.loadBit();
    let _threshold = sc_0.loadCoins();
    let _cooldown = sc_0.loadUintBig(32);
    let _burnPercent = sc_0.loadUintBig(8);
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AISetBuybackDirect' as const, queryId: _queryId, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, reason: _reason };
}

function loadTupleAISetBuybackDirect(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _enabled = source.readBoolean();
    let _threshold = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _burnPercent = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AISetBuybackDirect' as const, queryId: _queryId, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, reason: _reason };
}

function loadGetterTupleAISetBuybackDirect(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _enabled = source.readBoolean();
    let _threshold = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _burnPercent = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AISetBuybackDirect' as const, queryId: _queryId, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, reason: _reason };
}

function storeTupleAISetBuybackDirect(source: AISetBuybackDirect) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.threshold);
    builder.writeNumber(source.cooldown);
    builder.writeNumber(source.burnPercent);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAISetBuybackDirect(): DictionaryValue<AISetBuybackDirect> {
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
        let b_0 = builder;
        b_0.storeUint(76600837, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeBit(src.enabled);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIToggleTrading(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 76600837) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _enabled = sc_0.loadBit();
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIToggleTrading' as const, queryId: _queryId, enabled: _enabled, reason: _reason };
}

function loadTupleAIToggleTrading(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _enabled = source.readBoolean();
    let _reason = source.readString();
    return { $$type: 'AIToggleTrading' as const, queryId: _queryId, enabled: _enabled, reason: _reason };
}

function loadGetterTupleAIToggleTrading(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _enabled = source.readBoolean();
    let _reason = source.readString();
    return { $$type: 'AIToggleTrading' as const, queryId: _queryId, enabled: _enabled, reason: _reason };
}

function storeTupleAIToggleTrading(source: AIToggleTrading) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.enabled);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAIToggleTrading(): DictionaryValue<AIToggleTrading> {
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
        let b_0 = builder;
        b_0.storeUint(4117793461, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeBit(src.pause);
        b_0.storeUint(src.severity, 8);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIEmergencyPause(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4117793461) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _pause = sc_0.loadBit();
    let _severity = sc_0.loadUintBig(8);
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIEmergencyPause' as const, queryId: _queryId, pause: _pause, severity: _severity, reason: _reason };
}

function loadTupleAIEmergencyPause(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _pause = source.readBoolean();
    let _severity = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AIEmergencyPause' as const, queryId: _queryId, pause: _pause, severity: _severity, reason: _reason };
}

function loadGetterTupleAIEmergencyPause(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _pause = source.readBoolean();
    let _severity = source.readBigNumber();
    let _reason = source.readString();
    return { $$type: 'AIEmergencyPause' as const, queryId: _queryId, pause: _pause, severity: _severity, reason: _reason };
}

function storeTupleAIEmergencyPause(source: AIEmergencyPause) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeBoolean(source.pause);
    builder.writeNumber(source.severity);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAIEmergencyPause(): DictionaryValue<AIEmergencyPause> {
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
        let b_0 = builder;
        b_0.storeUint(800136214, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOracle);
        b_0.storeStringRefTail(src.reason);
    };
}

export function loadAIRotateOracle(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 800136214) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOracle = sc_0.loadAddress();
    let _reason = sc_0.loadStringRefTail();
    return { $$type: 'AIRotateOracle' as const, queryId: _queryId, newOracle: _newOracle, reason: _reason };
}

function loadTupleAIRotateOracle(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOracle = source.readAddress();
    let _reason = source.readString();
    return { $$type: 'AIRotateOracle' as const, queryId: _queryId, newOracle: _newOracle, reason: _reason };
}

function loadGetterTupleAIRotateOracle(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOracle = source.readAddress();
    let _reason = source.readString();
    return { $$type: 'AIRotateOracle' as const, queryId: _queryId, newOracle: _newOracle, reason: _reason };
}

function storeTupleAIRotateOracle(source: AIRotateOracle) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOracle);
    builder.writeString(source.reason);
    return builder.build();
}

function dictValueParserAIRotateOracle(): DictionaryValue<AIRotateOracle> {
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
        let b_0 = builder;
        b_0.storeUint(4235234258, 32);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.receiver);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4235234258) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadIntBig(257);
    let _receiver = sc_0.loadAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadTupleMint(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function loadGetterTupleMint(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _receiver = source.readAddress();
    return { $$type: 'Mint' as const, amount: _amount, receiver: _receiver };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeAddress(source.receiver);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
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
        let b_0 = builder;
        b_0.storeUint(3675779274, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeInt(src.amount, 257);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.responseDestination);
    };
}

export function loadBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3675779274) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadIntBig(257);
    let _sender = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    return { $$type: 'BurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

function loadTupleBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _responseDestination = source.readAddress();
    return { $$type: 'BurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

function loadGetterTupleBurnNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _responseDestination = source.readAddress();
    return { $$type: 'BurnNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, responseDestination: _responseDestination };
}

function storeTupleBurnNotification(source: BurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeAddress(source.responseDestination);
    return builder.build();
}

function dictValueParserBurnNotification(): DictionaryValue<BurnNotification> {
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
        let b_0 = builder;
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
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2477503806) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _responseDestination = sc_0.loadAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forwardTonAmount = sc_0.loadCoins();
    let _forwardPayload = sc_0;
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

function loadTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    let _forwardTonAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

function loadGetterTupleTokenTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    let _forwardTonAmount = source.readBigNumber();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenTransfer' as const, queryId: _queryId, amount: _amount, destination: _destination, responseDestination: _responseDestination, customPayload: _customPayload, forwardTonAmount: _forwardTonAmount, forwardPayload: _forwardPayload };
}

function storeTupleTokenTransfer(source: TokenTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    builder.writeNumber(source.forwardTonAmount);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

function dictValueParserTokenTransfer(): DictionaryValue<TokenTransfer> {
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
        let b_0 = builder;
        b_0.storeUint(3884065811, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.responseDestination);
        if (src.customPayload !== null && src.customPayload !== undefined) { b_0.storeBit(true).storeRef(src.customPayload); } else { b_0.storeBit(false); }
    };
}

export function loadTokenBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3884065811) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _responseDestination = sc_0.loadAddress();
    let _customPayload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

function loadTupleTokenBurn(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

function loadGetterTupleTokenBurn(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _responseDestination = source.readAddress();
    let _customPayload = source.readCellOpt();
    return { $$type: 'TokenBurn' as const, queryId: _queryId, amount: _amount, responseDestination: _responseDestination, customPayload: _customPayload };
}

function storeTupleTokenBurn(source: TokenBurn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.responseDestination);
    builder.writeCell(source.customPayload);
    return builder.build();
}

function dictValueParserTokenBurn(): DictionaryValue<TokenBurn> {
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
        let b_0 = builder;
        b_0.storeUint(78460803, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadTokenNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 78460803) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _forwardPayload = sc_0;
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

function loadTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

function loadGetterTupleTokenNotification(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _forwardPayload = source.readCell().asSlice();
    return { $$type: 'TokenNotification' as const, queryId: _queryId, amount: _amount, from: _from, forwardPayload: _forwardPayload };
}

function storeTupleTokenNotification(source: TokenNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

function dictValueParserTokenNotification(): DictionaryValue<TokenNotification> {
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
        let b_0 = builder;
        b_0.storeUint(3948052191, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.originalSender);
        b_0.storeAddress(src.originalReceiver);
    };
}

export function loadFeeTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3948052191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _originalSender = sc_0.loadAddress();
    let _originalReceiver = sc_0.loadAddress();
    return { $$type: 'FeeTransfer' as const, queryId: _queryId, amount: _amount, originalSender: _originalSender, originalReceiver: _originalReceiver };
}

function loadTupleFeeTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _originalSender = source.readAddress();
    let _originalReceiver = source.readAddress();
    return { $$type: 'FeeTransfer' as const, queryId: _queryId, amount: _amount, originalSender: _originalSender, originalReceiver: _originalReceiver };
}

function loadGetterTupleFeeTransfer(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _originalSender = source.readAddress();
    let _originalReceiver = source.readAddress();
    return { $$type: 'FeeTransfer' as const, queryId: _queryId, amount: _amount, originalSender: _originalSender, originalReceiver: _originalReceiver };
}

function storeTupleFeeTransfer(source: FeeTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.originalSender);
    builder.writeAddress(source.originalReceiver);
    return builder.build();
}

function dictValueParserFeeTransfer(): DictionaryValue<FeeTransfer> {
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
        let b_0 = builder;
        b_0.storeUint(3485887677, 32);
        b_0.storeAddress(src.treasury);
    };
}

export function loadSetTreasury(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3485887677) { throw Error('Invalid prefix'); }
    let _treasury = sc_0.loadAddress();
    return { $$type: 'SetTreasury' as const, treasury: _treasury };
}

function loadTupleSetTreasury(source: TupleReader) {
    let _treasury = source.readAddress();
    return { $$type: 'SetTreasury' as const, treasury: _treasury };
}

function loadGetterTupleSetTreasury(source: TupleReader) {
    let _treasury = source.readAddress();
    return { $$type: 'SetTreasury' as const, treasury: _treasury };
}

function storeTupleSetTreasury(source: SetTreasury) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.treasury);
    return builder.build();
}

function dictValueParserSetTreasury(): DictionaryValue<SetTreasury> {
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
        let b_0 = builder;
        b_0.storeUint(1007896360, 32);
        b_0.storeUint(src.feeBps, 16);
        b_0.storeUint(src.burnShare, 8);
        b_0.storeUint(src.maxTxBps, 16);
        b_0.storeUint(src.maxWalletBps, 16);
        b_0.storeUint(src.cooldown, 16);
    };
}

export function loadSetFeeConfig(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1007896360) { throw Error('Invalid prefix'); }
    let _feeBps = sc_0.loadUintBig(16);
    let _burnShare = sc_0.loadUintBig(8);
    let _maxTxBps = sc_0.loadUintBig(16);
    let _maxWalletBps = sc_0.loadUintBig(16);
    let _cooldown = sc_0.loadUintBig(16);
    return { $$type: 'SetFeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown };
}

function loadTupleSetFeeConfig(source: TupleReader) {
    let _feeBps = source.readBigNumber();
    let _burnShare = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    return { $$type: 'SetFeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown };
}

function loadGetterTupleSetFeeConfig(source: TupleReader) {
    let _feeBps = source.readBigNumber();
    let _burnShare = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    return { $$type: 'SetFeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown };
}

function storeTupleSetFeeConfig(source: SetFeeConfig) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.feeBps);
    builder.writeNumber(source.burnShare);
    builder.writeNumber(source.maxTxBps);
    builder.writeNumber(source.maxWalletBps);
    builder.writeNumber(source.cooldown);
    return builder.build();
}

function dictValueParserSetFeeConfig(): DictionaryValue<SetFeeConfig> {
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
        let b_0 = builder;
        b_0.storeUint(4051840417, 32);
        b_0.storeBit(src.enabled);
    };
}

export function loadToggleTrading(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4051840417) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

function loadTupleToggleTrading(source: TupleReader) {
    let _enabled = source.readBoolean();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

function loadGetterTupleToggleTrading(source: TupleReader) {
    let _enabled = source.readBoolean();
    return { $$type: 'ToggleTrading' as const, enabled: _enabled };
}

function storeTupleToggleTrading(source: ToggleTrading) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    return builder.build();
}

function dictValueParserToggleTrading(): DictionaryValue<ToggleTrading> {
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
        let b_0 = builder;
        b_0.storeUint(3487694140, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadTriggerBuyback(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3487694140) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'TriggerBuyback' as const, queryId: _queryId };
}

function loadTupleTriggerBuyback(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'TriggerBuyback' as const, queryId: _queryId };
}

function loadGetterTupleTriggerBuyback(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'TriggerBuyback' as const, queryId: _queryId };
}

function storeTupleTriggerBuyback(source: TriggerBuyback) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserTriggerBuyback(): DictionaryValue<TriggerBuyback> {
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
        let b_0 = builder;
        b_0.storeUint(2209879114, 32);
        b_0.storeBit(src.enabled);
        b_0.storeCoins(src.threshold);
        b_0.storeUint(src.cooldown, 32);
        b_0.storeUint(src.burnPercent, 8);
    };
}

export function loadSetBuybackConfig(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2209879114) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    let _threshold = sc_0.loadCoins();
    let _cooldown = sc_0.loadUintBig(32);
    let _burnPercent = sc_0.loadUintBig(8);
    return { $$type: 'SetBuybackConfig' as const, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent };
}

function loadTupleSetBuybackConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _threshold = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _burnPercent = source.readBigNumber();
    return { $$type: 'SetBuybackConfig' as const, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent };
}

function loadGetterTupleSetBuybackConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _threshold = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _burnPercent = source.readBigNumber();
    return { $$type: 'SetBuybackConfig' as const, enabled: _enabled, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent };
}

function storeTupleSetBuybackConfig(source: SetBuybackConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.threshold);
    builder.writeNumber(source.cooldown);
    builder.writeNumber(source.burnPercent);
    return builder.build();
}

function dictValueParserSetBuybackConfig(): DictionaryValue<SetBuybackConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetBuybackConfig(src)).endCell());
        },
        parse: (src) => {
            return loadSetBuybackConfig(src.loadRef().beginParse());
        }
    }
}

export type Stake = {
    $$type: 'Stake';
    amount: bigint;
}

export function storeStake(src: Stake) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3203459332, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadStake(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3203459332) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    return { $$type: 'Stake' as const, amount: _amount };
}

function loadTupleStake(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'Stake' as const, amount: _amount };
}

function loadGetterTupleStake(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'Stake' as const, amount: _amount };
}

function storeTupleStake(source: Stake) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserStake(): DictionaryValue<Stake> {
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
        let b_0 = builder;
        b_0.storeUint(4284693473, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadUnstake(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4284693473) { throw Error('Invalid prefix'); }
    let _amount = sc_0.loadCoins();
    return { $$type: 'Unstake' as const, amount: _amount };
}

function loadTupleUnstake(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'Unstake' as const, amount: _amount };
}

function loadGetterTupleUnstake(source: TupleReader) {
    let _amount = source.readBigNumber();
    return { $$type: 'Unstake' as const, amount: _amount };
}

function storeTupleUnstake(source: Unstake) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

function dictValueParserUnstake(): DictionaryValue<Unstake> {
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
        let b_0 = builder;
        b_0.storeUint(155852668, 32);
    };
}

export function loadClaimRewards(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 155852668) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimRewards' as const };
}

function loadTupleClaimRewards(source: TupleReader) {
    return { $$type: 'ClaimRewards' as const };
}

function loadGetterTupleClaimRewards(source: TupleReader) {
    return { $$type: 'ClaimRewards' as const };
}

function storeTupleClaimRewards(source: ClaimRewards) {
    let builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserClaimRewards(): DictionaryValue<ClaimRewards> {
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
        let b_0 = builder;
        b_0.storeUint(331180850, 32);
        b_0.storeBit(src.enabled);
        b_0.storeUint(src.apyBps, 16);
        b_0.storeCoins(src.minStake);
        b_0.storeUint(src.lockPeriod, 32);
    };
}

export function loadSetStakingConfig(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 331180850) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    let _apyBps = sc_0.loadUintBig(16);
    let _minStake = sc_0.loadCoins();
    let _lockPeriod = sc_0.loadUintBig(32);
    return { $$type: 'SetStakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod };
}

function loadTupleSetStakingConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _apyBps = source.readBigNumber();
    let _minStake = source.readBigNumber();
    let _lockPeriod = source.readBigNumber();
    return { $$type: 'SetStakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod };
}

function loadGetterTupleSetStakingConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _apyBps = source.readBigNumber();
    let _minStake = source.readBigNumber();
    let _lockPeriod = source.readBigNumber();
    return { $$type: 'SetStakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod };
}

function storeTupleSetStakingConfig(source: SetStakingConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.apyBps);
    builder.writeNumber(source.minStake);
    builder.writeNumber(source.lockPeriod);
    return builder.build();
}

function dictValueParserSetStakingConfig(): DictionaryValue<SetStakingConfig> {
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
        let b_0 = builder;
        b_0.storeUint(3551857443, 32);
        b_0.storeAddress(src.referrer);
    };
}

export function loadRegisterReferral(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3551857443) { throw Error('Invalid prefix'); }
    let _referrer = sc_0.loadAddress();
    return { $$type: 'RegisterReferral' as const, referrer: _referrer };
}

function loadTupleRegisterReferral(source: TupleReader) {
    let _referrer = source.readAddress();
    return { $$type: 'RegisterReferral' as const, referrer: _referrer };
}

function loadGetterTupleRegisterReferral(source: TupleReader) {
    let _referrer = source.readAddress();
    return { $$type: 'RegisterReferral' as const, referrer: _referrer };
}

function storeTupleRegisterReferral(source: RegisterReferral) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.referrer);
    return builder.build();
}

function dictValueParserRegisterReferral(): DictionaryValue<RegisterReferral> {
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
        let b_0 = builder;
        b_0.storeUint(3188740785, 32);
    };
}

export function loadClaimReferralRewards(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3188740785) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimReferralRewards' as const };
}

function loadTupleClaimReferralRewards(source: TupleReader) {
    return { $$type: 'ClaimReferralRewards' as const };
}

function loadGetterTupleClaimReferralRewards(source: TupleReader) {
    return { $$type: 'ClaimReferralRewards' as const };
}

function storeTupleClaimReferralRewards(source: ClaimReferralRewards) {
    let builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserClaimReferralRewards(): DictionaryValue<ClaimReferralRewards> {
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
        let b_0 = builder;
        b_0.storeUint(447783234, 32);
        b_0.storeBit(src.enabled);
        b_0.storeUint(src.rewardBps, 16);
    };
}

export function loadSetReferralConfig(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 447783234) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    let _rewardBps = sc_0.loadUintBig(16);
    return { $$type: 'SetReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

function loadTupleSetReferralConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _rewardBps = source.readBigNumber();
    return { $$type: 'SetReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

function loadGetterTupleSetReferralConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _rewardBps = source.readBigNumber();
    return { $$type: 'SetReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

function storeTupleSetReferralConfig(source: SetReferralConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.rewardBps);
    return builder.build();
}

function dictValueParserSetReferralConfig(): DictionaryValue<SetReferralConfig> {
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
        let b_0 = builder;
        b_0.storeUint(3930012637, 32);
        b_0.storeAddress(src.beneficiary);
        b_0.storeCoins(src.totalAmount);
        b_0.storeUint(src.cliff, 32);
        b_0.storeUint(src.duration, 32);
    };
}

export function loadAddVesting(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3930012637) { throw Error('Invalid prefix'); }
    let _beneficiary = sc_0.loadAddress();
    let _totalAmount = sc_0.loadCoins();
    let _cliff = sc_0.loadUintBig(32);
    let _duration = sc_0.loadUintBig(32);
    return { $$type: 'AddVesting' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, cliff: _cliff, duration: _duration };
}

function loadTupleAddVesting(source: TupleReader) {
    let _beneficiary = source.readAddress();
    let _totalAmount = source.readBigNumber();
    let _cliff = source.readBigNumber();
    let _duration = source.readBigNumber();
    return { $$type: 'AddVesting' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, cliff: _cliff, duration: _duration };
}

function loadGetterTupleAddVesting(source: TupleReader) {
    let _beneficiary = source.readAddress();
    let _totalAmount = source.readBigNumber();
    let _cliff = source.readBigNumber();
    let _duration = source.readBigNumber();
    return { $$type: 'AddVesting' as const, beneficiary: _beneficiary, totalAmount: _totalAmount, cliff: _cliff, duration: _duration };
}

function storeTupleAddVesting(source: AddVesting) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.beneficiary);
    builder.writeNumber(source.totalAmount);
    builder.writeNumber(source.cliff);
    builder.writeNumber(source.duration);
    return builder.build();
}

function dictValueParserAddVesting(): DictionaryValue<AddVesting> {
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
        let b_0 = builder;
        b_0.storeUint(4152964106, 32);
    };
}

export function loadClaimVested(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4152964106) { throw Error('Invalid prefix'); }
    return { $$type: 'ClaimVested' as const };
}

function loadTupleClaimVested(source: TupleReader) {
    return { $$type: 'ClaimVested' as const };
}

function loadGetterTupleClaimVested(source: TupleReader) {
    return { $$type: 'ClaimVested' as const };
}

function storeTupleClaimVested(source: ClaimVested) {
    let builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserClaimVested(): DictionaryValue<ClaimVested> {
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
        let b_0 = builder;
        b_0.storeUint(2876814287, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadTriggerLottery(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2876814287) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'TriggerLottery' as const, queryId: _queryId };
}

function loadTupleTriggerLottery(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'TriggerLottery' as const, queryId: _queryId };
}

function loadGetterTupleTriggerLottery(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'TriggerLottery' as const, queryId: _queryId };
}

function storeTupleTriggerLottery(source: TriggerLottery) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserTriggerLottery(): DictionaryValue<TriggerLottery> {
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
        let b_0 = builder;
        b_0.storeUint(463535866, 32);
        b_0.storeBit(src.enabled);
        b_0.storeCoins(src.ticketPrice);
        b_0.storeUint(src.drawInterval, 32);
        b_0.storeUint(src.jackpotShare, 8);
    };
}

export function loadSetLotteryConfig(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 463535866) { throw Error('Invalid prefix'); }
    let _enabled = sc_0.loadBit();
    let _ticketPrice = sc_0.loadCoins();
    let _drawInterval = sc_0.loadUintBig(32);
    let _jackpotShare = sc_0.loadUintBig(8);
    return { $$type: 'SetLotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare };
}

function loadTupleSetLotteryConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _ticketPrice = source.readBigNumber();
    let _drawInterval = source.readBigNumber();
    let _jackpotShare = source.readBigNumber();
    return { $$type: 'SetLotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare };
}

function loadGetterTupleSetLotteryConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _ticketPrice = source.readBigNumber();
    let _drawInterval = source.readBigNumber();
    let _jackpotShare = source.readBigNumber();
    return { $$type: 'SetLotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare };
}

function storeTupleSetLotteryConfig(source: SetLotteryConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.drawInterval);
    builder.writeNumber(source.jackpotShare);
    return builder.build();
}

function dictValueParserSetLotteryConfig(): DictionaryValue<SetLotteryConfig> {
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
        let b_0 = builder;
        b_0.storeInt(src.totalSupply, 257);
        b_0.storeBit(src.mintable);
        b_0.storeAddress(src.adminAddress);
        b_0.storeRef(src.jettonContent);
        b_0.storeRef(src.jettonWalletCode);
    };
}

export function loadJettonData(slice: Slice) {
    let sc_0 = slice;
    let _totalSupply = sc_0.loadIntBig(257);
    let _mintable = sc_0.loadBit();
    let _adminAddress = sc_0.loadAddress();
    let _jettonContent = sc_0.loadRef();
    let _jettonWalletCode = sc_0.loadRef();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, adminAddress: _adminAddress, jettonContent: _jettonContent, jettonWalletCode: _jettonWalletCode };
}

function loadTupleJettonData(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _adminAddress = source.readAddress();
    let _jettonContent = source.readCell();
    let _jettonWalletCode = source.readCell();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, adminAddress: _adminAddress, jettonContent: _jettonContent, jettonWalletCode: _jettonWalletCode };
}

function loadGetterTupleJettonData(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _adminAddress = source.readAddress();
    let _jettonContent = source.readCell();
    let _jettonWalletCode = source.readCell();
    return { $$type: 'JettonData' as const, totalSupply: _totalSupply, mintable: _mintable, adminAddress: _adminAddress, jettonContent: _jettonContent, jettonWalletCode: _jettonWalletCode };
}

function storeTupleJettonData(source: JettonData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.totalSupply);
    builder.writeBoolean(source.mintable);
    builder.writeAddress(source.adminAddress);
    builder.writeCell(source.jettonContent);
    builder.writeCell(source.jettonWalletCode);
    return builder.build();
}

function dictValueParserJettonData(): DictionaryValue<JettonData> {
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
        let b_0 = builder;
        b_0.storeInt(src.balance, 257);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeRef(src.walletCode);
    };
}

export function loadJettonWalletData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    let _master = sc_0.loadAddress();
    let _walletCode = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function loadTupleJettonWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function loadGetterTupleJettonWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _walletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, owner: _owner, master: _master, walletCode: _walletCode };
}

function storeTupleJettonWalletData(source: JettonWalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeCell(source.walletCode);
    return builder.build();
}

function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
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
        let b_0 = builder;
        b_0.storeAddress(src.oracleAddress);
        b_0.storeBit(src.aiModeEnabled);
        b_0.storeBit(src.fullAutonomy);
        b_0.storeInt(src.lastRebalanceAt, 257);
        b_0.storeInt(src.totalSignalsReceived, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.currentFeeBps, 257);
        b_1.storeInt(src.priceHistoryCount, 257);
        b_1.storeInt(src.anomalyCount, 257);
        let b_2 = new Builder();
        b_2.storeInt(src.lastHeartbeat, 257);
        b_2.storeBit(src.isAlive);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAIState(slice: Slice) {
    let sc_0 = slice;
    let _oracleAddress = sc_0.loadAddress();
    let _aiModeEnabled = sc_0.loadBit();
    let _fullAutonomy = sc_0.loadBit();
    let _lastRebalanceAt = sc_0.loadIntBig(257);
    let _totalSignalsReceived = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _currentFeeBps = sc_1.loadIntBig(257);
    let _priceHistoryCount = sc_1.loadIntBig(257);
    let _anomalyCount = sc_1.loadIntBig(257);
    let sc_2 = sc_1.loadRef().beginParse();
    let _lastHeartbeat = sc_2.loadIntBig(257);
    let _isAlive = sc_2.loadBit();
    return { $$type: 'AIState' as const, oracleAddress: _oracleAddress, aiModeEnabled: _aiModeEnabled, fullAutonomy: _fullAutonomy, lastRebalanceAt: _lastRebalanceAt, totalSignalsReceived: _totalSignalsReceived, currentFeeBps: _currentFeeBps, priceHistoryCount: _priceHistoryCount, anomalyCount: _anomalyCount, lastHeartbeat: _lastHeartbeat, isAlive: _isAlive };
}

function loadTupleAIState(source: TupleReader) {
    let _oracleAddress = source.readAddress();
    let _aiModeEnabled = source.readBoolean();
    let _fullAutonomy = source.readBoolean();
    let _lastRebalanceAt = source.readBigNumber();
    let _totalSignalsReceived = source.readBigNumber();
    let _currentFeeBps = source.readBigNumber();
    let _priceHistoryCount = source.readBigNumber();
    let _anomalyCount = source.readBigNumber();
    let _lastHeartbeat = source.readBigNumber();
    let _isAlive = source.readBoolean();
    return { $$type: 'AIState' as const, oracleAddress: _oracleAddress, aiModeEnabled: _aiModeEnabled, fullAutonomy: _fullAutonomy, lastRebalanceAt: _lastRebalanceAt, totalSignalsReceived: _totalSignalsReceived, currentFeeBps: _currentFeeBps, priceHistoryCount: _priceHistoryCount, anomalyCount: _anomalyCount, lastHeartbeat: _lastHeartbeat, isAlive: _isAlive };
}

function loadGetterTupleAIState(source: TupleReader) {
    let _oracleAddress = source.readAddress();
    let _aiModeEnabled = source.readBoolean();
    let _fullAutonomy = source.readBoolean();
    let _lastRebalanceAt = source.readBigNumber();
    let _totalSignalsReceived = source.readBigNumber();
    let _currentFeeBps = source.readBigNumber();
    let _priceHistoryCount = source.readBigNumber();
    let _anomalyCount = source.readBigNumber();
    let _lastHeartbeat = source.readBigNumber();
    let _isAlive = source.readBoolean();
    return { $$type: 'AIState' as const, oracleAddress: _oracleAddress, aiModeEnabled: _aiModeEnabled, fullAutonomy: _fullAutonomy, lastRebalanceAt: _lastRebalanceAt, totalSignalsReceived: _totalSignalsReceived, currentFeeBps: _currentFeeBps, priceHistoryCount: _priceHistoryCount, anomalyCount: _anomalyCount, lastHeartbeat: _lastHeartbeat, isAlive: _isAlive };
}

function storeTupleAIState(source: AIState) {
    let builder = new TupleBuilder();
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

function dictValueParserAIState(): DictionaryValue<AIState> {
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
        let b_0 = builder;
        b_0.storeInt(src.feeBps, 257);
        b_0.storeInt(src.burnShare, 257);
        b_0.storeInt(src.treasuryShare, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.maxTxBps, 257);
        b_1.storeInt(src.maxWalletBps, 257);
        b_1.storeInt(src.cooldown, 257);
        let b_2 = new Builder();
        b_2.storeInt(src.totalBurned, 257);
        b_2.storeInt(src.totalFeesCollected, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadFeeConfig(slice: Slice) {
    let sc_0 = slice;
    let _feeBps = sc_0.loadIntBig(257);
    let _burnShare = sc_0.loadIntBig(257);
    let _treasuryShare = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _maxTxBps = sc_1.loadIntBig(257);
    let _maxWalletBps = sc_1.loadIntBig(257);
    let _cooldown = sc_1.loadIntBig(257);
    let sc_2 = sc_1.loadRef().beginParse();
    let _totalBurned = sc_2.loadIntBig(257);
    let _totalFeesCollected = sc_2.loadIntBig(257);
    return { $$type: 'FeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, treasuryShare: _treasuryShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected };
}

function loadTupleFeeConfig(source: TupleReader) {
    let _feeBps = source.readBigNumber();
    let _burnShare = source.readBigNumber();
    let _treasuryShare = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _totalBurned = source.readBigNumber();
    let _totalFeesCollected = source.readBigNumber();
    return { $$type: 'FeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, treasuryShare: _treasuryShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected };
}

function loadGetterTupleFeeConfig(source: TupleReader) {
    let _feeBps = source.readBigNumber();
    let _burnShare = source.readBigNumber();
    let _treasuryShare = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _totalBurned = source.readBigNumber();
    let _totalFeesCollected = source.readBigNumber();
    return { $$type: 'FeeConfig' as const, feeBps: _feeBps, burnShare: _burnShare, treasuryShare: _treasuryShare, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldown: _cooldown, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected };
}

function storeTupleFeeConfig(source: FeeConfig) {
    let builder = new TupleBuilder();
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

function dictValueParserFeeConfig(): DictionaryValue<FeeConfig> {
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
        let b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.pool, 257);
        b_0.storeInt(src.threshold, 257);
        b_0.storeInt(src.cooldown, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.burnPercent, 257);
        b_1.storeInt(src.lastBuybackAt, 257);
        b_1.storeInt(src.totalBuybacks, 257);
        let b_2 = new Builder();
        b_2.storeInt(src.totalQsrBurnedViaBuyback, 257);
        b_2.storeInt(src.totalTonSpent, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadBuybackState(slice: Slice) {
    let sc_0 = slice;
    let _enabled = sc_0.loadBit();
    let _pool = sc_0.loadIntBig(257);
    let _threshold = sc_0.loadIntBig(257);
    let _cooldown = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _burnPercent = sc_1.loadIntBig(257);
    let _lastBuybackAt = sc_1.loadIntBig(257);
    let _totalBuybacks = sc_1.loadIntBig(257);
    let sc_2 = sc_1.loadRef().beginParse();
    let _totalQsrBurnedViaBuyback = sc_2.loadIntBig(257);
    let _totalTonSpent = sc_2.loadIntBig(257);
    return { $$type: 'BuybackState' as const, enabled: _enabled, pool: _pool, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, lastBuybackAt: _lastBuybackAt, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpent: _totalTonSpent };
}

function loadTupleBuybackState(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _pool = source.readBigNumber();
    let _threshold = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _burnPercent = source.readBigNumber();
    let _lastBuybackAt = source.readBigNumber();
    let _totalBuybacks = source.readBigNumber();
    let _totalQsrBurnedViaBuyback = source.readBigNumber();
    let _totalTonSpent = source.readBigNumber();
    return { $$type: 'BuybackState' as const, enabled: _enabled, pool: _pool, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, lastBuybackAt: _lastBuybackAt, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpent: _totalTonSpent };
}

function loadGetterTupleBuybackState(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _pool = source.readBigNumber();
    let _threshold = source.readBigNumber();
    let _cooldown = source.readBigNumber();
    let _burnPercent = source.readBigNumber();
    let _lastBuybackAt = source.readBigNumber();
    let _totalBuybacks = source.readBigNumber();
    let _totalQsrBurnedViaBuyback = source.readBigNumber();
    let _totalTonSpent = source.readBigNumber();
    return { $$type: 'BuybackState' as const, enabled: _enabled, pool: _pool, threshold: _threshold, cooldown: _cooldown, burnPercent: _burnPercent, lastBuybackAt: _lastBuybackAt, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpent: _totalTonSpent };
}

function storeTupleBuybackState(source: BuybackState) {
    let builder = new TupleBuilder();
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

function dictValueParserBuybackState(): DictionaryValue<BuybackState> {
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
        let b_0 = builder;
        b_0.storeBit(src.fullAutonomyEnabled);
        b_0.storeInt(src.aiActionCooldown, 257);
        b_0.storeInt(src.lastAiActionTime, 257);
        b_0.storeInt(src.heartbeatTimeout, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.lastHeartbeat, 257);
        b_1.storeInt(src.ownerOverrideWindow, 257);
        b_1.storeInt(src.vetoThresholdBps, 257);
        let b_2 = new Builder();
        b_2.storeInt(src.totalVetoStake, 257);
        b_2.storeInt(src.pendingActions, 257);
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAutonomyState(slice: Slice) {
    let sc_0 = slice;
    let _fullAutonomyEnabled = sc_0.loadBit();
    let _aiActionCooldown = sc_0.loadIntBig(257);
    let _lastAiActionTime = sc_0.loadIntBig(257);
    let _heartbeatTimeout = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _lastHeartbeat = sc_1.loadIntBig(257);
    let _ownerOverrideWindow = sc_1.loadIntBig(257);
    let _vetoThresholdBps = sc_1.loadIntBig(257);
    let sc_2 = sc_1.loadRef().beginParse();
    let _totalVetoStake = sc_2.loadIntBig(257);
    let _pendingActions = sc_2.loadIntBig(257);
    return { $$type: 'AutonomyState' as const, fullAutonomyEnabled: _fullAutonomyEnabled, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, totalVetoStake: _totalVetoStake, pendingActions: _pendingActions };
}

function loadTupleAutonomyState(source: TupleReader) {
    let _fullAutonomyEnabled = source.readBoolean();
    let _aiActionCooldown = source.readBigNumber();
    let _lastAiActionTime = source.readBigNumber();
    let _heartbeatTimeout = source.readBigNumber();
    let _lastHeartbeat = source.readBigNumber();
    let _ownerOverrideWindow = source.readBigNumber();
    let _vetoThresholdBps = source.readBigNumber();
    let _totalVetoStake = source.readBigNumber();
    let _pendingActions = source.readBigNumber();
    return { $$type: 'AutonomyState' as const, fullAutonomyEnabled: _fullAutonomyEnabled, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, totalVetoStake: _totalVetoStake, pendingActions: _pendingActions };
}

function loadGetterTupleAutonomyState(source: TupleReader) {
    let _fullAutonomyEnabled = source.readBoolean();
    let _aiActionCooldown = source.readBigNumber();
    let _lastAiActionTime = source.readBigNumber();
    let _heartbeatTimeout = source.readBigNumber();
    let _lastHeartbeat = source.readBigNumber();
    let _ownerOverrideWindow = source.readBigNumber();
    let _vetoThresholdBps = source.readBigNumber();
    let _totalVetoStake = source.readBigNumber();
    let _pendingActions = source.readBigNumber();
    return { $$type: 'AutonomyState' as const, fullAutonomyEnabled: _fullAutonomyEnabled, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, totalVetoStake: _totalVetoStake, pendingActions: _pendingActions };
}

function storeTupleAutonomyState(source: AutonomyState) {
    let builder = new TupleBuilder();
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

function dictValueParserAutonomyState(): DictionaryValue<AutonomyState> {
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
        let b_0 = builder;
        b_0.storeInt(src.actionId, 257);
        b_0.storeInt(src.timestamp, 257);
        b_0.storeStringRefTail(src.actionType);
        b_0.storeInt(src.oldValue, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.newValue, 257);
        b_1.storeStringRefTail(src.reason);
        b_1.storeBit(src.executed);
        b_1.storeBit(src.vetoed);
        b_1.storeBit(src.overridden);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadAIActionLog(slice: Slice) {
    let sc_0 = slice;
    let _actionId = sc_0.loadIntBig(257);
    let _timestamp = sc_0.loadIntBig(257);
    let _actionType = sc_0.loadStringRefTail();
    let _oldValue = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _newValue = sc_1.loadIntBig(257);
    let _reason = sc_1.loadStringRefTail();
    let _executed = sc_1.loadBit();
    let _vetoed = sc_1.loadBit();
    let _overridden = sc_1.loadBit();
    return { $$type: 'AIActionLog' as const, actionId: _actionId, timestamp: _timestamp, actionType: _actionType, oldValue: _oldValue, newValue: _newValue, reason: _reason, executed: _executed, vetoed: _vetoed, overridden: _overridden };
}

function loadTupleAIActionLog(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _timestamp = source.readBigNumber();
    let _actionType = source.readString();
    let _oldValue = source.readBigNumber();
    let _newValue = source.readBigNumber();
    let _reason = source.readString();
    let _executed = source.readBoolean();
    let _vetoed = source.readBoolean();
    let _overridden = source.readBoolean();
    return { $$type: 'AIActionLog' as const, actionId: _actionId, timestamp: _timestamp, actionType: _actionType, oldValue: _oldValue, newValue: _newValue, reason: _reason, executed: _executed, vetoed: _vetoed, overridden: _overridden };
}

function loadGetterTupleAIActionLog(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _timestamp = source.readBigNumber();
    let _actionType = source.readString();
    let _oldValue = source.readBigNumber();
    let _newValue = source.readBigNumber();
    let _reason = source.readString();
    let _executed = source.readBoolean();
    let _vetoed = source.readBoolean();
    let _overridden = source.readBoolean();
    return { $$type: 'AIActionLog' as const, actionId: _actionId, timestamp: _timestamp, actionType: _actionType, oldValue: _oldValue, newValue: _newValue, reason: _reason, executed: _executed, vetoed: _vetoed, overridden: _overridden };
}

function storeTupleAIActionLog(source: AIActionLog) {
    let builder = new TupleBuilder();
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

function dictValueParserAIActionLog(): DictionaryValue<AIActionLog> {
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
        let b_0 = builder;
        b_0.storeInt(src.actionId, 257);
        b_0.storeInt(src.totalStake, 257);
        b_0.storeInt(src.vetoCount, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.threshold, 257);
        b_1.storeBit(src.active);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVetoState(slice: Slice) {
    let sc_0 = slice;
    let _actionId = sc_0.loadIntBig(257);
    let _totalStake = sc_0.loadIntBig(257);
    let _vetoCount = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _threshold = sc_1.loadIntBig(257);
    let _active = sc_1.loadBit();
    return { $$type: 'VetoState' as const, actionId: _actionId, totalStake: _totalStake, vetoCount: _vetoCount, threshold: _threshold, active: _active };
}

function loadTupleVetoState(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _totalStake = source.readBigNumber();
    let _vetoCount = source.readBigNumber();
    let _threshold = source.readBigNumber();
    let _active = source.readBoolean();
    return { $$type: 'VetoState' as const, actionId: _actionId, totalStake: _totalStake, vetoCount: _vetoCount, threshold: _threshold, active: _active };
}

function loadGetterTupleVetoState(source: TupleReader) {
    let _actionId = source.readBigNumber();
    let _totalStake = source.readBigNumber();
    let _vetoCount = source.readBigNumber();
    let _threshold = source.readBigNumber();
    let _active = source.readBoolean();
    return { $$type: 'VetoState' as const, actionId: _actionId, totalStake: _totalStake, vetoCount: _vetoCount, threshold: _threshold, active: _active };
}

function storeTupleVetoState(source: VetoState) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.actionId);
    builder.writeNumber(source.totalStake);
    builder.writeNumber(source.vetoCount);
    builder.writeNumber(source.threshold);
    builder.writeBoolean(source.active);
    return builder.build();
}

function dictValueParserVetoState(): DictionaryValue<VetoState> {
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
        let b_0 = builder;
        b_0.storeInt(src.timestamp, 257);
        b_0.storeStringRefTail(src.action);
        b_0.storeInt(src.confidence, 257);
        b_0.storeBit(src.executed);
    };
}

export function loadAIRecommendation(slice: Slice) {
    let sc_0 = slice;
    let _timestamp = sc_0.loadIntBig(257);
    let _action = sc_0.loadStringRefTail();
    let _confidence = sc_0.loadIntBig(257);
    let _executed = sc_0.loadBit();
    return { $$type: 'AIRecommendation' as const, timestamp: _timestamp, action: _action, confidence: _confidence, executed: _executed };
}

function loadTupleAIRecommendation(source: TupleReader) {
    let _timestamp = source.readBigNumber();
    let _action = source.readString();
    let _confidence = source.readBigNumber();
    let _executed = source.readBoolean();
    return { $$type: 'AIRecommendation' as const, timestamp: _timestamp, action: _action, confidence: _confidence, executed: _executed };
}

function loadGetterTupleAIRecommendation(source: TupleReader) {
    let _timestamp = source.readBigNumber();
    let _action = source.readString();
    let _confidence = source.readBigNumber();
    let _executed = source.readBoolean();
    return { $$type: 'AIRecommendation' as const, timestamp: _timestamp, action: _action, confidence: _confidence, executed: _executed };
}

function storeTupleAIRecommendation(source: AIRecommendation) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.timestamp);
    builder.writeString(source.action);
    builder.writeNumber(source.confidence);
    builder.writeBoolean(source.executed);
    return builder.build();
}

function dictValueParserAIRecommendation(): DictionaryValue<AIRecommendation> {
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
        let b_0 = builder;
        b_0.storeInt(src.amount, 257);
        b_0.storeInt(src.startTime, 257);
        b_0.storeInt(src.lastClaim, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.lockEnd, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadStakeInfo(slice: Slice) {
    let sc_0 = slice;
    let _amount = sc_0.loadIntBig(257);
    let _startTime = sc_0.loadIntBig(257);
    let _lastClaim = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _lockEnd = sc_1.loadIntBig(257);
    return { $$type: 'StakeInfo' as const, amount: _amount, startTime: _startTime, lastClaim: _lastClaim, lockEnd: _lockEnd };
}

function loadTupleStakeInfo(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _lastClaim = source.readBigNumber();
    let _lockEnd = source.readBigNumber();
    return { $$type: 'StakeInfo' as const, amount: _amount, startTime: _startTime, lastClaim: _lastClaim, lockEnd: _lockEnd };
}

function loadGetterTupleStakeInfo(source: TupleReader) {
    let _amount = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _lastClaim = source.readBigNumber();
    let _lockEnd = source.readBigNumber();
    return { $$type: 'StakeInfo' as const, amount: _amount, startTime: _startTime, lastClaim: _lastClaim, lockEnd: _lockEnd };
}

function storeTupleStakeInfo(source: StakeInfo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.lastClaim);
    builder.writeNumber(source.lockEnd);
    return builder.build();
}

function dictValueParserStakeInfo(): DictionaryValue<StakeInfo> {
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
        let b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.apyBps, 257);
        b_0.storeInt(src.minStake, 257);
        b_0.storeInt(src.lockPeriod, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.totalStaked, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadStakingConfig(slice: Slice) {
    let sc_0 = slice;
    let _enabled = sc_0.loadBit();
    let _apyBps = sc_0.loadIntBig(257);
    let _minStake = sc_0.loadIntBig(257);
    let _lockPeriod = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _totalStaked = sc_1.loadIntBig(257);
    return { $$type: 'StakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod, totalStaked: _totalStaked };
}

function loadTupleStakingConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _apyBps = source.readBigNumber();
    let _minStake = source.readBigNumber();
    let _lockPeriod = source.readBigNumber();
    let _totalStaked = source.readBigNumber();
    return { $$type: 'StakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod, totalStaked: _totalStaked };
}

function loadGetterTupleStakingConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _apyBps = source.readBigNumber();
    let _minStake = source.readBigNumber();
    let _lockPeriod = source.readBigNumber();
    let _totalStaked = source.readBigNumber();
    return { $$type: 'StakingConfig' as const, enabled: _enabled, apyBps: _apyBps, minStake: _minStake, lockPeriod: _lockPeriod, totalStaked: _totalStaked };
}

function storeTupleStakingConfig(source: StakingConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.apyBps);
    builder.writeNumber(source.minStake);
    builder.writeNumber(source.lockPeriod);
    builder.writeNumber(source.totalStaked);
    return builder.build();
}

function dictValueParserStakingConfig(): DictionaryValue<StakingConfig> {
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
        let b_0 = builder;
        b_0.storeAddress(src.referrer);
        b_0.storeInt(src.totalEarned, 257);
        b_0.storeInt(src.totalReferrals, 257);
    };
}

export function loadReferralInfo(slice: Slice) {
    let sc_0 = slice;
    let _referrer = sc_0.loadAddress();
    let _totalEarned = sc_0.loadIntBig(257);
    let _totalReferrals = sc_0.loadIntBig(257);
    return { $$type: 'ReferralInfo' as const, referrer: _referrer, totalEarned: _totalEarned, totalReferrals: _totalReferrals };
}

function loadTupleReferralInfo(source: TupleReader) {
    let _referrer = source.readAddress();
    let _totalEarned = source.readBigNumber();
    let _totalReferrals = source.readBigNumber();
    return { $$type: 'ReferralInfo' as const, referrer: _referrer, totalEarned: _totalEarned, totalReferrals: _totalReferrals };
}

function loadGetterTupleReferralInfo(source: TupleReader) {
    let _referrer = source.readAddress();
    let _totalEarned = source.readBigNumber();
    let _totalReferrals = source.readBigNumber();
    return { $$type: 'ReferralInfo' as const, referrer: _referrer, totalEarned: _totalEarned, totalReferrals: _totalReferrals };
}

function storeTupleReferralInfo(source: ReferralInfo) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.referrer);
    builder.writeNumber(source.totalEarned);
    builder.writeNumber(source.totalReferrals);
    return builder.build();
}

function dictValueParserReferralInfo(): DictionaryValue<ReferralInfo> {
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
        let b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.rewardBps, 257);
    };
}

export function loadReferralConfig(slice: Slice) {
    let sc_0 = slice;
    let _enabled = sc_0.loadBit();
    let _rewardBps = sc_0.loadIntBig(257);
    return { $$type: 'ReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

function loadTupleReferralConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _rewardBps = source.readBigNumber();
    return { $$type: 'ReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

function loadGetterTupleReferralConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _rewardBps = source.readBigNumber();
    return { $$type: 'ReferralConfig' as const, enabled: _enabled, rewardBps: _rewardBps };
}

function storeTupleReferralConfig(source: ReferralConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.rewardBps);
    return builder.build();
}

function dictValueParserReferralConfig(): DictionaryValue<ReferralConfig> {
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
        let b_0 = builder;
        b_0.storeInt(src.totalAmount, 257);
        b_0.storeInt(src.claimed, 257);
        b_0.storeInt(src.startTime, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.cliff, 257);
        b_1.storeInt(src.duration, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVestingInfo(slice: Slice) {
    let sc_0 = slice;
    let _totalAmount = sc_0.loadIntBig(257);
    let _claimed = sc_0.loadIntBig(257);
    let _startTime = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _cliff = sc_1.loadIntBig(257);
    let _duration = sc_1.loadIntBig(257);
    return { $$type: 'VestingInfo' as const, totalAmount: _totalAmount, claimed: _claimed, startTime: _startTime, cliff: _cliff, duration: _duration };
}

function loadTupleVestingInfo(source: TupleReader) {
    let _totalAmount = source.readBigNumber();
    let _claimed = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _cliff = source.readBigNumber();
    let _duration = source.readBigNumber();
    return { $$type: 'VestingInfo' as const, totalAmount: _totalAmount, claimed: _claimed, startTime: _startTime, cliff: _cliff, duration: _duration };
}

function loadGetterTupleVestingInfo(source: TupleReader) {
    let _totalAmount = source.readBigNumber();
    let _claimed = source.readBigNumber();
    let _startTime = source.readBigNumber();
    let _cliff = source.readBigNumber();
    let _duration = source.readBigNumber();
    return { $$type: 'VestingInfo' as const, totalAmount: _totalAmount, claimed: _claimed, startTime: _startTime, cliff: _cliff, duration: _duration };
}

function storeTupleVestingInfo(source: VestingInfo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.totalAmount);
    builder.writeNumber(source.claimed);
    builder.writeNumber(source.startTime);
    builder.writeNumber(source.cliff);
    builder.writeNumber(source.duration);
    return builder.build();
}

function dictValueParserVestingInfo(): DictionaryValue<VestingInfo> {
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
        let b_0 = builder;
        b_0.storeBit(src.enabled);
        b_0.storeInt(src.ticketPrice, 257);
        b_0.storeInt(src.drawInterval, 257);
        b_0.storeInt(src.jackpotShare, 257);
        let b_1 = new Builder();
        b_1.storeInt(src.currentRound, 257);
        b_1.storeInt(src.lastDraw, 257);
        b_1.storeInt(src.totalJackpot, 257);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadLotteryConfig(slice: Slice) {
    let sc_0 = slice;
    let _enabled = sc_0.loadBit();
    let _ticketPrice = sc_0.loadIntBig(257);
    let _drawInterval = sc_0.loadIntBig(257);
    let _jackpotShare = sc_0.loadIntBig(257);
    let sc_1 = sc_0.loadRef().beginParse();
    let _currentRound = sc_1.loadIntBig(257);
    let _lastDraw = sc_1.loadIntBig(257);
    let _totalJackpot = sc_1.loadIntBig(257);
    return { $$type: 'LotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare, currentRound: _currentRound, lastDraw: _lastDraw, totalJackpot: _totalJackpot };
}

function loadTupleLotteryConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _ticketPrice = source.readBigNumber();
    let _drawInterval = source.readBigNumber();
    let _jackpotShare = source.readBigNumber();
    let _currentRound = source.readBigNumber();
    let _lastDraw = source.readBigNumber();
    let _totalJackpot = source.readBigNumber();
    return { $$type: 'LotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare, currentRound: _currentRound, lastDraw: _lastDraw, totalJackpot: _totalJackpot };
}

function loadGetterTupleLotteryConfig(source: TupleReader) {
    let _enabled = source.readBoolean();
    let _ticketPrice = source.readBigNumber();
    let _drawInterval = source.readBigNumber();
    let _jackpotShare = source.readBigNumber();
    let _currentRound = source.readBigNumber();
    let _lastDraw = source.readBigNumber();
    let _totalJackpot = source.readBigNumber();
    return { $$type: 'LotteryConfig' as const, enabled: _enabled, ticketPrice: _ticketPrice, drawInterval: _drawInterval, jackpotShare: _jackpotShare, currentRound: _currentRound, lastDraw: _lastDraw, totalJackpot: _totalJackpot };
}

function storeTupleLotteryConfig(source: LotteryConfig) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.enabled);
    builder.writeNumber(source.ticketPrice);
    builder.writeNumber(source.drawInterval);
    builder.writeNumber(source.jackpotShare);
    builder.writeNumber(source.currentRound);
    builder.writeNumber(source.lastDraw);
    builder.writeNumber(source.totalJackpot);
    return builder.build();
}

function dictValueParserLotteryConfig(): DictionaryValue<LotteryConfig> {
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
        let b_0 = builder;
        b_0.storeInt(src.round, 257);
        b_0.storeAddress(src.owner);
    };
}

export function loadLotteryTicket(slice: Slice) {
    let sc_0 = slice;
    let _round = sc_0.loadIntBig(257);
    let _owner = sc_0.loadAddress();
    return { $$type: 'LotteryTicket' as const, round: _round, owner: _owner };
}

function loadTupleLotteryTicket(source: TupleReader) {
    let _round = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'LotteryTicket' as const, round: _round, owner: _owner };
}

function loadGetterTupleLotteryTicket(source: TupleReader) {
    let _round = source.readBigNumber();
    let _owner = source.readAddress();
    return { $$type: 'LotteryTicket' as const, round: _round, owner: _owner };
}

function storeTupleLotteryTicket(source: LotteryTicket) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.round);
    builder.writeAddress(source.owner);
    return builder.build();
}

function dictValueParserLotteryTicket(): DictionaryValue<LotteryTicket> {
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
}

export function storeQuasarMaster$Data(src: QuasarMaster$Data) {
    return (builder: Builder) => {
        let b_0 = builder;
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
        let b_1 = new Builder();
        b_1.storeCoins(src.buybackPool);
        b_1.storeCoins(src.buybackThreshold);
        b_1.storeUint(src.buybackCooldown, 32);
        b_1.storeUint(src.buybackBurnPercent, 8);
        b_1.storeInt(src.lastBuybackTime, 257);
        b_1.storeInt(src.totalBuybacks, 257);
        b_1.storeCoins(src.totalQsrBurnedViaBuyback);
        let b_2 = new Builder();
        b_2.storeCoins(src.totalTonSpentOnBuyback);
        b_2.storeAddress(src.aiOracle);
        b_2.storeBit(src.aiEnabled);
        b_2.storeBit(src.aiFullAutonomy);
        b_2.storeInt(src.lastRebalanceTime, 257);
        b_2.storeInt(src.signalCount, 257);
        b_2.storeDict(src.priceHistory, Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257));
        b_2.storeDict(src.anomalyLog, Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation());
        let b_3 = new Builder();
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
        let b_4 = new Builder();
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
        let b_5 = new Builder();
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
        let b_6 = new Builder();
        b_6.storeCoins(src.lotteryJackpot);
        b_6.storeDict(src.lotteryTickets, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_6.storeInt(src.lotteryTicketCount, 257);
        b_6.storeDict(src.lotteryWinners, Dictionary.Keys.BigInt(257), Dictionary.Values.Address());
        b_5.storeRef(b_6.endCell());
        b_4.storeRef(b_5.endCell());
        b_3.storeRef(b_4.endCell());
        b_2.storeRef(b_3.endCell());
        b_1.storeRef(b_2.endCell());
        b_0.storeRef(b_1.endCell());
    };
}

export function loadQuasarMaster$Data(slice: Slice) {
    let sc_0 = slice;
    let _totalSupply = sc_0.loadCoins();
    let _mintable = sc_0.loadBit();
    let _owner = sc_0.loadAddress();
    let _content = sc_0.loadRef();
    let _walletCode = sc_0.loadRef();
    let _feeBps = sc_0.loadUintBig(16);
    let _feeBurnShare = sc_0.loadUintBig(8);
    let _treasury = sc_0.loadAddress();
    let _totalBurned = sc_0.loadCoins();
    let _totalFeesCollected = sc_0.loadCoins();
    let _maxTxBps = sc_0.loadUintBig(16);
    let _maxWalletBps = sc_0.loadUintBig(16);
    let _cooldownSeconds = sc_0.loadUintBig(16);
    let _tradingEnabled = sc_0.loadBit();
    let _buybackEnabled = sc_0.loadBit();
    let sc_1 = sc_0.loadRef().beginParse();
    let _buybackPool = sc_1.loadCoins();
    let _buybackThreshold = sc_1.loadCoins();
    let _buybackCooldown = sc_1.loadUintBig(32);
    let _buybackBurnPercent = sc_1.loadUintBig(8);
    let _lastBuybackTime = sc_1.loadIntBig(257);
    let _totalBuybacks = sc_1.loadIntBig(257);
    let _totalQsrBurnedViaBuyback = sc_1.loadCoins();
    let sc_2 = sc_1.loadRef().beginParse();
    let _totalTonSpentOnBuyback = sc_2.loadCoins();
    let _aiOracle = sc_2.loadAddress();
    let _aiEnabled = sc_2.loadBit();
    let _aiFullAutonomy = sc_2.loadBit();
    let _lastRebalanceTime = sc_2.loadIntBig(257);
    let _signalCount = sc_2.loadIntBig(257);
    let _priceHistory = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_2);
    let _anomalyLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), sc_2);
    let sc_3 = sc_2.loadRef().beginParse();
    let _anomalyIndex = sc_3.loadIntBig(257);
    let _minConfidence = sc_3.loadUintBig(8);
    let _emergencyPause = sc_3.loadBit();
    let _aiActionCooldown = sc_3.loadUintBig(32);
    let _lastAiActionTime = sc_3.loadIntBig(257);
    let _heartbeatTimeout = sc_3.loadUintBig(32);
    let _lastHeartbeat = sc_3.loadIntBig(257);
    let _ownerOverrideWindow = sc_3.loadUintBig(32);
    let _vetoThresholdBps = sc_3.loadUintBig(16);
    let _aiActionLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), sc_3);
    let sc_4 = sc_3.loadRef().beginParse();
    let _aiActionIndex = sc_4.loadIntBig(257);
    let _pendingAiActions = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), sc_4);
    let _vetoLog = Dictionary.load(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), sc_4);
    let _totalVetoStake = sc_4.loadCoins();
    let _stakingEnabled = sc_4.loadBit();
    let _stakingApyBps = sc_4.loadUintBig(16);
    let _stakingMinStake = sc_4.loadCoins();
    let _stakingLockPeriod = sc_4.loadUintBig(32);
    let _stakers = Dictionary.load(Dictionary.Keys.Address(), dictValueParserStakeInfo(), sc_4);
    let _totalStaked = sc_4.loadCoins();
    let _stakingRewardsPool = sc_4.loadCoins();
    let _referralEnabled = sc_4.loadBit();
    let _referralRewardBps = sc_4.loadUintBig(16);
    let sc_5 = sc_4.loadRef().beginParse();
    let _referrals = Dictionary.load(Dictionary.Keys.Address(), dictValueParserReferralInfo(), sc_5);
    let _vestingEnabled = sc_5.loadBit();
    let _teamAllocation = sc_5.loadCoins();
    let _teamClaimed = sc_5.loadCoins();
    let _vestingSchedules = Dictionary.load(Dictionary.Keys.Address(), dictValueParserVestingInfo(), sc_5);
    let _lotteryEnabled = sc_5.loadBit();
    let _lotteryTicketPrice = sc_5.loadCoins();
    let _lotteryDrawInterval = sc_5.loadUintBig(32);
    let _lotteryJackpotShare = sc_5.loadUintBig(8);
    let _lotteryRound = sc_5.loadIntBig(257);
    let _lotteryLastDraw = sc_5.loadIntBig(257);
    let sc_6 = sc_5.loadRef().beginParse();
    let _lotteryJackpot = sc_6.loadCoins();
    let _lotteryTickets = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_6);
    let _lotteryTicketCount = sc_6.loadIntBig(257);
    let _lotteryWinners = Dictionary.load(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), sc_6);
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners };
}

function loadTupleQuasarMaster$Data(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _walletCode = source.readCell();
    let _feeBps = source.readBigNumber();
    let _feeBurnShare = source.readBigNumber();
    let _treasury = source.readAddress();
    let _totalBurned = source.readBigNumber();
    let _totalFeesCollected = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldownSeconds = source.readBigNumber();
    let _tradingEnabled = source.readBoolean();
    source = source.readTuple();
    let _buybackEnabled = source.readBoolean();
    let _buybackPool = source.readBigNumber();
    let _buybackThreshold = source.readBigNumber();
    let _buybackCooldown = source.readBigNumber();
    let _buybackBurnPercent = source.readBigNumber();
    let _lastBuybackTime = source.readBigNumber();
    let _totalBuybacks = source.readBigNumber();
    let _totalQsrBurnedViaBuyback = source.readBigNumber();
    let _totalTonSpentOnBuyback = source.readBigNumber();
    let _aiOracle = source.readAddress();
    let _aiEnabled = source.readBoolean();
    let _aiFullAutonomy = source.readBoolean();
    let _lastRebalanceTime = source.readBigNumber();
    let _signalCount = source.readBigNumber();
    source = source.readTuple();
    let _priceHistory = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _anomalyLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), source.readCellOpt());
    let _anomalyIndex = source.readBigNumber();
    let _minConfidence = source.readBigNumber();
    let _emergencyPause = source.readBoolean();
    let _aiActionCooldown = source.readBigNumber();
    let _lastAiActionTime = source.readBigNumber();
    let _heartbeatTimeout = source.readBigNumber();
    let _lastHeartbeat = source.readBigNumber();
    let _ownerOverrideWindow = source.readBigNumber();
    let _vetoThresholdBps = source.readBigNumber();
    let _aiActionLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), source.readCellOpt());
    let _aiActionIndex = source.readBigNumber();
    let _pendingAiActions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    source = source.readTuple();
    let _vetoLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), source.readCellOpt());
    let _totalVetoStake = source.readBigNumber();
    let _stakingEnabled = source.readBoolean();
    let _stakingApyBps = source.readBigNumber();
    let _stakingMinStake = source.readBigNumber();
    let _stakingLockPeriod = source.readBigNumber();
    let _stakers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserStakeInfo(), source.readCellOpt());
    let _totalStaked = source.readBigNumber();
    let _stakingRewardsPool = source.readBigNumber();
    let _referralEnabled = source.readBoolean();
    let _referralRewardBps = source.readBigNumber();
    let _referrals = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferralInfo(), source.readCellOpt());
    let _vestingEnabled = source.readBoolean();
    let _teamAllocation = source.readBigNumber();
    source = source.readTuple();
    let _teamClaimed = source.readBigNumber();
    let _vestingSchedules = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserVestingInfo(), source.readCellOpt());
    let _lotteryEnabled = source.readBoolean();
    let _lotteryTicketPrice = source.readBigNumber();
    let _lotteryDrawInterval = source.readBigNumber();
    let _lotteryJackpotShare = source.readBigNumber();
    let _lotteryRound = source.readBigNumber();
    let _lotteryLastDraw = source.readBigNumber();
    let _lotteryJackpot = source.readBigNumber();
    let _lotteryTickets = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    let _lotteryTicketCount = source.readBigNumber();
    let _lotteryWinners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners };
}

function loadGetterTupleQuasarMaster$Data(source: TupleReader) {
    let _totalSupply = source.readBigNumber();
    let _mintable = source.readBoolean();
    let _owner = source.readAddress();
    let _content = source.readCell();
    let _walletCode = source.readCell();
    let _feeBps = source.readBigNumber();
    let _feeBurnShare = source.readBigNumber();
    let _treasury = source.readAddress();
    let _totalBurned = source.readBigNumber();
    let _totalFeesCollected = source.readBigNumber();
    let _maxTxBps = source.readBigNumber();
    let _maxWalletBps = source.readBigNumber();
    let _cooldownSeconds = source.readBigNumber();
    let _tradingEnabled = source.readBoolean();
    let _buybackEnabled = source.readBoolean();
    let _buybackPool = source.readBigNumber();
    let _buybackThreshold = source.readBigNumber();
    let _buybackCooldown = source.readBigNumber();
    let _buybackBurnPercent = source.readBigNumber();
    let _lastBuybackTime = source.readBigNumber();
    let _totalBuybacks = source.readBigNumber();
    let _totalQsrBurnedViaBuyback = source.readBigNumber();
    let _totalTonSpentOnBuyback = source.readBigNumber();
    let _aiOracle = source.readAddress();
    let _aiEnabled = source.readBoolean();
    let _aiFullAutonomy = source.readBoolean();
    let _lastRebalanceTime = source.readBigNumber();
    let _signalCount = source.readBigNumber();
    let _priceHistory = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _anomalyLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIRecommendation(), source.readCellOpt());
    let _anomalyIndex = source.readBigNumber();
    let _minConfidence = source.readBigNumber();
    let _emergencyPause = source.readBoolean();
    let _aiActionCooldown = source.readBigNumber();
    let _lastAiActionTime = source.readBigNumber();
    let _heartbeatTimeout = source.readBigNumber();
    let _lastHeartbeat = source.readBigNumber();
    let _ownerOverrideWindow = source.readBigNumber();
    let _vetoThresholdBps = source.readBigNumber();
    let _aiActionLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserAIActionLog(), source.readCellOpt());
    let _aiActionIndex = source.readBigNumber();
    let _pendingAiActions = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.BigInt(257), source.readCellOpt());
    let _vetoLog = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), dictValueParserVetoState(), source.readCellOpt());
    let _totalVetoStake = source.readBigNumber();
    let _stakingEnabled = source.readBoolean();
    let _stakingApyBps = source.readBigNumber();
    let _stakingMinStake = source.readBigNumber();
    let _stakingLockPeriod = source.readBigNumber();
    let _stakers = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserStakeInfo(), source.readCellOpt());
    let _totalStaked = source.readBigNumber();
    let _stakingRewardsPool = source.readBigNumber();
    let _referralEnabled = source.readBoolean();
    let _referralRewardBps = source.readBigNumber();
    let _referrals = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserReferralInfo(), source.readCellOpt());
    let _vestingEnabled = source.readBoolean();
    let _teamAllocation = source.readBigNumber();
    let _teamClaimed = source.readBigNumber();
    let _vestingSchedules = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserVestingInfo(), source.readCellOpt());
    let _lotteryEnabled = source.readBoolean();
    let _lotteryTicketPrice = source.readBigNumber();
    let _lotteryDrawInterval = source.readBigNumber();
    let _lotteryJackpotShare = source.readBigNumber();
    let _lotteryRound = source.readBigNumber();
    let _lotteryLastDraw = source.readBigNumber();
    let _lotteryJackpot = source.readBigNumber();
    let _lotteryTickets = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    let _lotteryTicketCount = source.readBigNumber();
    let _lotteryWinners = Dictionary.loadDirect(Dictionary.Keys.BigInt(257), Dictionary.Values.Address(), source.readCellOpt());
    return { $$type: 'QuasarMaster$Data' as const, totalSupply: _totalSupply, mintable: _mintable, owner: _owner, content: _content, walletCode: _walletCode, feeBps: _feeBps, feeBurnShare: _feeBurnShare, treasury: _treasury, totalBurned: _totalBurned, totalFeesCollected: _totalFeesCollected, maxTxBps: _maxTxBps, maxWalletBps: _maxWalletBps, cooldownSeconds: _cooldownSeconds, tradingEnabled: _tradingEnabled, buybackEnabled: _buybackEnabled, buybackPool: _buybackPool, buybackThreshold: _buybackThreshold, buybackCooldown: _buybackCooldown, buybackBurnPercent: _buybackBurnPercent, lastBuybackTime: _lastBuybackTime, totalBuybacks: _totalBuybacks, totalQsrBurnedViaBuyback: _totalQsrBurnedViaBuyback, totalTonSpentOnBuyback: _totalTonSpentOnBuyback, aiOracle: _aiOracle, aiEnabled: _aiEnabled, aiFullAutonomy: _aiFullAutonomy, lastRebalanceTime: _lastRebalanceTime, signalCount: _signalCount, priceHistory: _priceHistory, anomalyLog: _anomalyLog, anomalyIndex: _anomalyIndex, minConfidence: _minConfidence, emergencyPause: _emergencyPause, aiActionCooldown: _aiActionCooldown, lastAiActionTime: _lastAiActionTime, heartbeatTimeout: _heartbeatTimeout, lastHeartbeat: _lastHeartbeat, ownerOverrideWindow: _ownerOverrideWindow, vetoThresholdBps: _vetoThresholdBps, aiActionLog: _aiActionLog, aiActionIndex: _aiActionIndex, pendingAiActions: _pendingAiActions, vetoLog: _vetoLog, totalVetoStake: _totalVetoStake, stakingEnabled: _stakingEnabled, stakingApyBps: _stakingApyBps, stakingMinStake: _stakingMinStake, stakingLockPeriod: _stakingLockPeriod, stakers: _stakers, totalStaked: _totalStaked, stakingRewardsPool: _stakingRewardsPool, referralEnabled: _referralEnabled, referralRewardBps: _referralRewardBps, referrals: _referrals, vestingEnabled: _vestingEnabled, teamAllocation: _teamAllocation, teamClaimed: _teamClaimed, vestingSchedules: _vestingSchedules, lotteryEnabled: _lotteryEnabled, lotteryTicketPrice: _lotteryTicketPrice, lotteryDrawInterval: _lotteryDrawInterval, lotteryJackpotShare: _lotteryJackpotShare, lotteryRound: _lotteryRound, lotteryLastDraw: _lotteryLastDraw, lotteryJackpot: _lotteryJackpot, lotteryTickets: _lotteryTickets, lotteryTicketCount: _lotteryTicketCount, lotteryWinners: _lotteryWinners };
}

function storeTupleQuasarMaster$Data(source: QuasarMaster$Data) {
    let builder = new TupleBuilder();
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
    return builder.build();
}

function dictValueParserQuasarMaster$Data(): DictionaryValue<QuasarMaster$Data> {
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
        let b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
        b_0.storeInt(src.lastTxTime, 257);
    };
}

export function loadQuasarWallet$Data(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _master = sc_0.loadAddress();
    let _lastTxTime = sc_0.loadIntBig(257);
    return { $$type: 'QuasarWallet$Data' as const, balance: _balance, owner: _owner, master: _master, lastTxTime: _lastTxTime };
}

function loadTupleQuasarWallet$Data(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _lastTxTime = source.readBigNumber();
    return { $$type: 'QuasarWallet$Data' as const, balance: _balance, owner: _owner, master: _master, lastTxTime: _lastTxTime };
}

function loadGetterTupleQuasarWallet$Data(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _master = source.readAddress();
    let _lastTxTime = source.readBigNumber();
    return { $$type: 'QuasarWallet$Data' as const, balance: _balance, owner: _owner, master: _master, lastTxTime: _lastTxTime };
}

function storeTupleQuasarWallet$Data(source: QuasarWallet$Data) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.master);
    builder.writeNumber(source.lastTxTime);
    return builder.build();
}

function dictValueParserQuasarWallet$Data(): DictionaryValue<QuasarWallet$Data> {
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
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeRef(src.content);
        b_0.storeRef(src.walletCode);
    };
}

async function QuasarMaster_init(owner: Address, content: Cell, walletCode: Cell) {
    const __code = Cell.fromBase64('te6ccgICAUgAAQAAdtUAAAEU/wD0pBP0vPLICwABAgFiAAIAAwLw0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8EUMRRRFDEUIRRBFCEUERQxFBEUARQhFAET8RQRE/ET4RQBE+ET0RPxE9ETwRPhE8ETsRPRE7EToRPBE6ETkROxE5ATwAEwIBIAAEAAUCASAABgAHAgEgAAoACwIBIADvAPACASAACAAJAgFIAQEBAgIBIAEKAQsCASABFAEVAgEgAAwADQIBIAEeAR8CASAADgAPAvmyM/bPBFDEUQRQxFCEUMRQhFBEUIRQRFAEUERQBE/EUARPxE+ET8RPhE9ET4RPRE8ET0RPBE7ETwROxE6ETsROhE5EToRORE4ETkROBE3ETgRNxE2ETcRNhE1ETYRNRE0ETURNBEzETQRMxEyETMRMhExETIRMREwETERMIAE8ABACASABLAEtAfwRLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsAEQHkERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEgbpIwbZkgbvLQgG8kbwTiIG6SMG3eABIAXIEBAVYoAln0DW+hkjBt3yBukjBtjhfQgQEB1wDUAdABgQEB1wDSAFUwbBRvBOIB/BE4EToROBE3ETkRNxE2ETgRNhE1ETcRNRE0ETYRNBEzETURMxEyETQRMhExETMRMREwETIRMBEvETERLxEuETARLhEtES8RLREsES4RLBErES0RKxEqESwRKhEpESsRKREoESoRKBEnESkRJxEmESgRJhElEScRJREkESYRJAAUAfgRIxElESMRIhEkESIRIREjESERIBEiESARHxEhER8RHhEgER4RHREfER0RHBEeERwRGxEdERsRGhEcERoRGREbERkRGBEaERgRFxEZERcRFhEYERYRFREXERURFBEW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HhFEER4RHRFEER0RHBFEERwRGxFEERsRGhFEERoAMwL2ERkRRBEZERgRRBEYERcRRBEXERYRRBEWERURRBEVERQRRBEUERMRRBETERIRRBESERERRBERERARRBEQDxFEDw4RRA4NEUQNDBFEDAsRRAsKEUQKCRFECRFECAcGVUBWRNs8EUMRRBFDEUIRQxFCEUERQhFBEUARQRFAALkANAH8ET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErADUB/BEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIBEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGxEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFgA2AFQRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ4B9IIAqsdWGfL0gWYsIVYYvvL0+EJWFYEBCyJZ9AtvoZIwbd8gbpIwbY4g0IEBAdcAgQEB1wCBAQHXANQB0IEBAdcAMBRDMGwUbwTicPgjVhmgIm6zjhZbICBu8tCAbyRfAwEgbvLQgG8kbDEBkTLiEUMRRxFDEUIRRhFCADoB7PhCVhWBAQsiWfQLb6GSMG3fIG6SMG2OINCBAQHXAIEBAdcAgQEB1wDUAdCBAQHXADAUQzBsFG8E4oFt0yFus/L0gVL9ISBu8tCAbyRfAyS+8vSBYoP4IyIgbvLQgG8kbDG+8vQRQxFGEUMRQhFFEUIRQRFEEUEAQgTqjpMw0x8BghAJSh98uvLggW0x2zx/4CCCEBO9azK6jjgw0x8BghATvWsyuvLggdIA0w/6ANMfVTBsFFcYVxhXGFcYggCKq/hCVkMBxwXy9IFkbVYrs/L0f+AgghDTtQsjuuMCIIIQGrChQrrjAiCCEOo/O926AE4ATwBQAFEB/BFBEUURQRFAEUQRQBE/EUcRPxE+EUYRPhE9EUURPRE8EUQRPBE7EUcROxE6EUYROhE5EUURORE4EUQROBE3EUcRNxE2EUYRNhE1EUURNRE0EUQRNBEzEUcRMxEyEUYRMhExEUURMREwEUQRMBEvEUcRLxEuEUYRLhEtEUURLQA7AfwRLBFEESwRKxFHESsRKhFGESoRKRFFESkRKBFEESgRJxFHEScRJhFGESYRJRFFESURJBFEESQRIxFHESMRIhFGESIRIRFFESERIBFEESARHxFHER8RHhFGER4RHRFFER0RHBFEERwRGxFHERsRGhFGERoRGRFFERkRGBFEERgAPAL6ERcRRxEXERYRRhEWERURRREVERQRRBEUERMRRxETERIRRhESERERRRERERARRBEQDxFHDw4RRg4NEUUNDBFEDAsRRwsKEUYKCRFFCQgRRAgHEUcHBhFGBgURRQUEEUQEAxFHAwIRRgIBEUUBEURWRts8IMIAlFYSIb6RcOIAVAA9A+qPYBESVhKh+EP4KFZJAds8XHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcHCAQCL4KMjJ0BAjAhEbApEw4oEBCxFFVkig+CNY+CMBEUgBGwBHAD4B/shVMFA0gQEBzwCBAQHPAIEBAc8AAciBAQHPAMkBzMkDERMDAhFEAgERRgEgbpUwWfRZMJRBM/QT4hFEH6ARPxFDET8RPhFCET4RPRFBET0RPBFAETwROxE/ETsROhE+EToRORE9ETkROBE8ETgRNxE7ETcRNhE6ETYRNRE5ETUAPwH8ETQROBE0ETMRNxEzETIRNhEyETERNRExETARNBEwES8RMxEvES4RMhEuES0RMREtESwRMBEsESsRLxErESoRLhEqESkRLREpESgRLBEoEScRKxEnESYRKhEmESURKRElESQRKBEkESMRJxEjESIRJhEiESERJREhESARJBEgAEAB/BEfESMRHxEeESIRHhEdESERHREcESARHBEbER8RGxEaER4RGhEZER0RGREYERwRGBEXERsRFxEWERoRFhEVERkRFREUERgRFBETERcRExESERYREhERERUREREQERQREBESDRERDQwREAwQvxCuEJ0QjBB7EGoQWRBIEDdGUABBAAREAAH8EUARRhFAET8RRRE/ET4RRBE+ET0RRhE9ETwRRRE8ETsRRBE7EToRRhE6ETkRRRE5ETgRRBE4ETcRRhE3ETYRRRE2ETURRBE1ETQRRhE0ETMRRREzETIRRBEyETERRhExETARRREwES8RRBEvES4RRhEuES0RRREtESwRRBEsAEMB/BErEUYRKxEqEUURKhEpEUQRKREoEUYRKBEnEUURJxEmEUQRJhElEUYRJREkEUURJBEjEUQRIxEiEUYRIhEhEUURIREgEUQRIBEfEUYRHxEeEUURHhEdEUQRHREcEUYRHBEbEUURGxEaEUQRGhEZEUYRGREYEUURGBEXEUQRFwBEA/oRFhFGERYRFRFFERURFBFEERQRExFGERMREhFFERIRERFEEREREBFGERAPEUUPDhFEDg0RRg0MEUUMCxFECwoRRgoJEUUJCBFECAcRRgcGEUUGBRFEBQQRRgQDEUUDAhFEAgERRgERRVZG2zwgwgCUVhIhvpFw4pEw4w1WRQBUAEUARgLAERJWEqH4Q/goVkkB2zxccFnIcAHLAXMBywFwAcsAEszMyfkAyHIBywFwAcsAEsoHy//J0CDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhwcIBAIvgoyMnQECMCERsCARsARwPcIG7y0IBvJF8DVkWhIMIAjkowV0WBAQttIG6SMG2OJiBu8tCAbyTIVTBQNIEBAc8AgQEBzwCBAQHPAAHIgQEBzwDJAczJ4gIRFAJWRwEgbpUwWfRZMJRBM/QT4uMNERFWQ6H4Q/goEgERRwHbPFwASAEbAEkBjMhVMIIQBK03g1AFyx8Tyz8B+gIBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WAc8WyRA2RUADERgDWRBGEEXbPDAA5QC0gQELVkcgbvLQgG8kECNfA/gjEUkgbvLQgG8kbDESARFJAchVMFA0gQEBzwCBAQHPAIEBAc8AAciBAQHPAMkBzMkCERQCARFGAVZHASBulTBZ9FkwlEEz9BPiAaJwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiHBwgEAi+CjIydAQIwIRSwIASgL4yFUwghAErTeDUAXLHxPLPwH6AgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBzxbJEDZFQAMRSANZEEYQRds8MBFAEUMRQBE/EUIRPxE+EUERPhE9EUARPRE8ET8RPBE7ET4ROxE6ET0ROhE5ETwRORE4ETsROADlAEsB/BE3EToRNxE2ETkRNhE1ETgRNRE0ETcRNBEzETYRMxEyETURMhExETQRMREwETMRMBEvETIRLxEuETERLhEtETARLREsES8RLBErES4RKxEqES0RKhEpESwRKREoESsRKBEnESoRJxEmESkRJhElESgRJREkEScRJBEjESYRIwBMAfwRIhElESIRIREkESERIBEjESARHxEiER8RHhEhER4RHREgER0RHBEfERwRGxEeERsRGhEdERoRGREcERkRGBEbERgRFxEaERcRFhEZERYRFREYERURFBEXERQRExEWERMREhEVERIREREUEREPERMPDxESDw4REQ4NERANEM8ATQAEVSsB9jD4QhFDEUQRQxFCEUQRQhFBEUQRQRFAEUQRQBE/EUQRPxE+EUQRPhE9EUQRPRE8EUQRPBE7EUQROxE6EUQROhE5EUQRORE4EUQROBE3EUQRNxE2EUQRNhE1EUQRNRE0EUQRNBEzEUQRMxEyEUQRMhExEUQRMREwEUQRMABSAWIw0x8BghDTtQsjuvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4Igx2zx/AFsAXjDTHwGCEBqwoUK68uCB0gDTD1lsElcRVxGCAIqr+EJWQwHHBfL0gWRtViuz8vR/BNyOuzDTHwGCEOo/O9268uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6ANMf0x9VMGwU2zx/4CCCEPeJNAq6jpMw0x8BghD3iTQKuvLggW0x2zx/4CCCEKt4s8+64wIgghAboP76ugBfAGAAYQBiAfwRLxFEES8RLhFEES4RLRFEES0RLBFEESwRKxFEESsRKhFEESoRKRFEESkRKBFEESgRJxFEEScRJhFEESYRJRFEESURJBFEESQRIxFEESMRIhFEESIRIRFEESERIBFEESARHxFEER8RHhFEER4RHRFEER0RHBFEERwRGxFEERsAUwL8ERoRRBEaERkRRBEZERgRRBEYERcRRBEXERYRRBEWERURRBEVERQRRBEUERMRRBETERIRRBESERERRBERERARRBEQDxFEDw4RRA4NEUQNDBFEDAsRRAsKEUQKCRFECRFECAcGVUBWRNs8ggDhuCHC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HRFEER0RHBFGERwRGxFFERsAbwH8ERoRRBEaERkRRhEZERgRRREYERcRRBEXERYRRhEWERURRREVERQRRBEUERMRRhETERIRRRESERERRBERERARRhEQDxFFDw4RRA4NEUYNDBFFDAsRRAsKEUYKCRFFCQgRRAgHEUYHBhFFBgURRAUEEUYEAxFFAwIRRAIBEUYBAHAC+hFF2zxXI1c1VkSOF39wEUXAA59XPFc8cFdAgGQRPIBaETzen1dDggDPElYo8vRwfxFEAeKL5FbWVyZ2VuY3lQYXVzZYcBFHkXGSVkbiEUQRRxFEEUMRRhFDEUIRRRFCEUERRBFBEUARQxFAET8RQhE/ET4RQRE+ET0RQBE9AMgAcQH8ETwRPxE8ETsRPhE7EToRPRE6ETkRPBE5ETgROxE4ETYRORE2ETUROBE1ETQRNxE0ETMRNhEzETIRNREyETERNBExETARMxEwES8RMhEvES4RMREuES0RMBEtESwRLxEsESsRLhErESoRLREqESkRLBEpESgRKxEoEScRKhEnAHIB+BEmESkRJhElESgRJQIRJwIRIxEmESMRIhElESIRIREkESERIBEjESARHxEiER8RHhEhER4RHREgER0RHBEfERwRGxEeERsRGhEdERoRGREcERkRGBEbERgRFxEaERcRFhEZERYRFREYERURFBEXERQRExEWERMREhEVERIAcwFmERERFBERERARExEQDxESDw4REQ4NERANEM8QvhCtEJwQixB6EGkQWBBHXiNQA0QU2zwwAKUB8jIRQxFFEUMRQhFEEUIRQRFFEUERQBFEEUARPxFFET8RPhFEET4RPRFFET0RPBFEETwROxFFETsROhFEEToRORFFETkROBFEETgRNxFFETcRNhFEETYRNRFFETURNBFEETQRMxFFETMRMhFEETIRMRFFETERMBFEETAAeAHyMhFDEUURQxFCEUQRQhFBEUURQRFAEUQRQBE/EUURPxE+EUQRPhE9EUURPRE8EUQRPBE7EUUROxE6EUQROhE5EUURORE4EUQROBE3EUURNxE2EUQRNhE1EUURNRE0EUQRNBEzEUURMxEyEUQRMhExEUURMREwEUQRMAB+AUQw0x8BghAQ98D3uvLggdM/0w/TD9MP1AHQFRRDMGwV2zx/AIQEdI8IMNs8bBbbPH/gIIIQBJDWBbqOnDDTHwGCEASQ1gW68uCB0z/SANQB0EMwbBPbPH/gIIIQL7EcFroAiwCMAI0AjgH8ES8RRREvES4RRBEuES0RRREtESwRRBEsESsRRRErESoRRBEqESkRRREpESgRRBEoEScRRREnESYRRBEmESURRRElESQRRBEkESMRRREjESIRRBEiESERRREhESARRBEgER8RRREfER4RRBEeER0RRREdERwRRBEcERsRRREbAHkB/BEaEUQRGhEZEUURGREYEUQRGBEXEUURFxEWEUQRFhEVEUURFREUEUQRFBETEUURExESEUQREhEREUUREREQEUQREA8RRQ8OEUQODRFFDQwRRAwLEUULChFECgkRRQkIEUQIBxFFBwYRRAYFEUUFBBFEBAMRRQMCEUQCARFFAQB6A/QRRNs82zyCAJVTVkXBZZRWRcIJkXDi8vRWRItlNldEZlZYEUURRxFFEUQRRhFEEUMRRRFDEUIRRBFCEUERQxFBARFCARE/EUERPxE+EUARPhE9ET8RPRE8ET4RPBE7ET0ROxE6ETwROhE5ETsRORE4EToROBE3ETkRNwDIAKIAewH8ETYROBE2ETURNxE1ETQRNhE0ETMRNREzETIRNBEyETERMxExETARMhEwES8RMREvES4RMBEuES0RLxEtESwRLhEsESsRLRErESoRLBEqESkRKxEpESgRKhEoEScRKREnESYRKBEmESURJxElESQRJhEkESMRJREjESIRJBEiAHwB/BEhESMRIREgESIRIBEfESERHxEeESARHhEdER8RHREcER4RHBEbER0RGxEaERwRGhEZERsRGREYERoRGBEXERkRFxEWERgRFhEVERcRFREUERYRFBETERURExESERQREhERERMREREQERIREA8REQ8OERAOEN8QzhC9EKwQmwB9ASIQihB5EGgQVxBGEDVEE9s8MAClAfwRLxFFES8RLhFEES4RLRFFES0RLBFEESwRKxFFESsRKhFEESoRKRFFESkRKBFEESgRJxFFEScRJhFEESYRJRFFESURJBFEESQRIxFFESMRIhFEESIRIRFFESERIBFEESARHxFFER8RHhFEER4RHRFFER0RHBFEERwRGxFFERsAfwH8ERoRRBEaERkRRREZERgRRBEYERcRRREXERYRRBEWERURRREVERQRRBEUERMRRRETERIRRBESERERRRERERARRBEQDxFFDw4RRA4NEUUNDBFEDAsRRQsKEUQKCRFFCQgRRAgHEUUHBhFEBgURRQUEEUQEAxFFAwIRRAIBEUUBAIAD9BFE2zzbPFc8ggDiD40IYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFZFxwWz8vSLtTZXRUcmVhc3VyeYEUMRRRFDEUIRRBFCEUERQxFBEUARQhFAET8RQRE/ET4RQBE+ET0RPxE9ETsRPRE7EToRPBE6AMgAogCBAfwRORE7ETkROBE6ETgRNxE5ETcRNhE4ETYRNRE3ETURNBE2ETQRMxE1ETMRMhE0ETIRMREzETERMBEyETARLxExES8RLhEwES4RLREvES0RLBEuESwRKxEtESsRKhEsESoRKRErESkRKBEqESgRJxEpEScRJhEoESYRJREnESUAggH8ESQRJhEkESMRJREjESIRJBEiESERIxEhESARIhEgER8RIREfER4RIBEeER0RHxEdERwRHhEcERsRHREbERoRHBEaERkRGxEZERgRGhEYERcRGREXERYRGBEWERURFxEVERQRFhEUERMRFRETERIRFBESERERExERERAREhEQAIMBUA8REQ8OERAOEN8QzhC9EKwQmxCKEHkQaBBXEEYQNUQAcFAEcQHbPDAApQHyNBFDEUcRQxFCEUYRQhFBEUURQRFAEUQRQBE/EUcRPxE+EUYRPhE9EUURPRE8EUQRPBE7EUcROxE6EUYROhE5EUURORE4EUQROBE3EUcRNxE2EUYRNhE1EUURNRE0EUQRNBEzEUcRMxEyEUYRMhExEUURMREwEUQRMACFAfwRLxFHES8RLhFGES4RLRFFES0RLBFEESwRKxFHESsRKhFGESoRKRFFESkRKBFEESgRJxFHEScRJhFGESYRJRFFESURJBFEESQRIxFHESMRIhFGESIRIRFFESERIBFEESARHxFHER8RHhFGER4RHRFFER0RHBFEERwRGxFHERsAhgH8ERoRRhEaERkRRREZERgRRBEYERcRRxEXERYRRhEWERURRREVERQRRBEUERMRRxETERIRRhESERERRRERERARRBEQDxFHDw4RRg4NEUUNDBFEDAsRRwsKEUYKCRFFCQgRRAgHEUcHBhFGBgURRQUEEUQEAxFHAwIRRgIBEUUBAIcD+BFE2zzbPFc3VzdXN4IAhtxWRIEB9LuWVkOBA+i7kXDillZCgQEsu5Fw4vL0VkOLxTZXRBbnRpV2hhbGWBFCEUYRQhFBEUURQRFAEUQRQBE/EUMRPxE+EUIRPhE9EUERPRE8EUARPBE7ET8ROxE6ET4ROhE5ET0ROQERPAEAyACiAIgB9AEROwEBEToBETURORE1ETQROBE0ETMRNxEzETIRNhEyETERNRExETARNBEwES8RMxEvES4RMhEuES0RMREtESwRMBEsESsRLxErESoRLhEqESkRLREpESgRLBEoEScRKxEnESYRKhEmESURKRElESQRKBEkESMRJxEjAIkB/BEiESYRIhEhESURIREgESQRIBEfESMRHxEeESIRHhEdESERHREcESARHBEbER8RGxEaER4RGhEZER0RGREYERwRGBEXERsRFxEWERoRFhEVERkRFREUERgRFBETERcRExESERYREhERERUREREQERQREA8REw8OERIODRERDQCKAUYMERAMEL8QrhCdEIwQexBqEFkQSBA3ECYQRRA0QBNwAts8MAClAD7THwGCEAlSkX268uCB0z/SAPoA0x/TB9QB0BYVFEMwAfI1EUMRSBFDEUIRRxFCEUERRhFBEUARRRFAET8RRBE/ET4RSBE+ET0RRxE9ETwRRhE8ETsRRRE7EToRRBE6ETkRSBE5ETgRRxE4ETcRRhE3ETYRRRE2ETURRBE1ETQRSBE0ETMRRxEzETIRRhEyETERRRExETARRBEwAI8B8jIRQxFFEUMRQhFEEUIRQRFFEUERQBFEEUARPxFFET8RPhFEET4RPRFFET0RPBFEETwROxFFETsROhFEEToRORFFETkROBFEETgRNxFFETcRNhFEETYRNRFFETURNBFEETQRMxFFETMRMhFEETIRMRFFETERMBFEETAAlQTyjrow0x8BghAvsRwWuvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHUAdBDMGwT2zx/4CCCECopeTO64wIgghAogvHouo6fMNMfAYIQKILx6Lry4IHTP9MP0wfUAdAUQzBsFNs8f+AgghBpIJOfugCbAJwAnQCeAfwRLxFIES8RLhFHES4RLRFGES0RLBFFESwRKxFEESsRKhFIESoRKRFHESkRKBFGESgRJxFFEScRJhFEESYRJRFIESURJBFHESQRIxFGESMRIhFFESIRIRFEESERIBFIESARHxFHER8RHhFGER4RHRFFER0RHBFEERwRGxFIERsAkAH8ERoRRxEaERkRRhEZERgRRREYERcRRBEXERYRSBEWERURRxEVERQRRhEUERMRRRETERIRRBESERERSBERERARRxEQDxFGDw4RRQ4NEUQNDBFIDAsRRwsKEUYKCRFFCQgRRAgHEUgHBhFHBgURRgUEEUUEAxFEAwIRSAIBEUcBAJED+hFG2zzbPFcxVzFXMVcyVkCLpTZXRCdXliYWNrhwEUORcZJWQuIRQhFHEUIRQRFGEUERQBFFEUARPxFEET8RPhFDET4RPRFCET0RPBFBETwROxFAETsROhE/EToRORE+ETkROBE9ETgRNxE8ETcRNhE7ETYRNRE6ETUCETkCAMgAogCSAfwRMxE4ETMRMxE3ETMRMxE2ETMRMxE1ETMRLxE0ES8RLhEzES4RLREyES0RLBExESwRKxEwESsRKhEvESoRKREuESkRKBEtESgRJxEsEScRJhErESYRJREqESURJBEpESQRIxEoESMRIhEnESIRIREmESERIBElESARHxEkER8AkwH8ER4RIxEeER0RIhEdERwRIREcERsRIBEbERoRHxEaERkRHhEZERgRHREYERcRHBEXERYRGxEWERURGhEVERQRGREUERMRGBETERIRFxESERERFhERERARFREQDxEUDw4REw4NERINDBERDAsREAsQrxCeEI0QfBBrEFoQSRA4AJQBFBBWEEVQAwTbPDAApQH8ES8RRREvES4RRBEuES0RRREtESwRRBEsESsRRRErESoRRBEqESkRRREpESgRRBEoEScRRREnESYRRBEmESURRRElESQRRBEkESMRRREjESIRRBEiESERRREhESARRBEgER8RRREfER4RRBEeER0RRREdERwRRBEcERsRRREbAJYB/BEaEUQRGhEZEUURGREYEUQRGBEXEUURFxEWEUQRFhEVEUURFREUEUQRFBETEUURExESEUQREhEREUUREREQEUQREA8RRQ8OEUQODRFFDQwRRAwLEUULChFECgkRRQkIEUQIBxFFBwYRRAYFEUUFBBFEBAMRRQMCEUQCARFFAQCXA/QRRNs82zxXNlZDi9VG9nZ2xlVHJhZGluZ4cBFGkXGSVkXiEUURRxFFEUQRRhFEEUMRRRFDEUIRRBFCEUERQxFBEUARQhFAET8RQRE/ET4RQBE+ET0RPxE9ETwRPhE8ETsRPRE7EToRPBE6ETkROxE5AhE6AhE3ETkRNwDIAKIAmAH8ETYROBE2ETURNxE1ETQRNhE0ETMRNREzETIRNBEyETERMxExETARMhEwES8RMREvES4RMBEuES0RLxEtESwRLhEsESsRLRErESoRLBEqESkRKxEpESgRKhEoEScRKREnESYRKBEmESURJxElESQRJhEkESMRJREjESIRJBEiAJkB/BEhESMRIREgESIRIBEfESERHxEeESARHhEdER8RHREcER4RHBEbER0RGxEaERwRGhEZERsRGREYERoRGBEXERkRFxEWERgRFhEVERcRFREUERYRFBETERURExESERQREhERERMREREQERIREA8REQ8OERAOEN8QzhC9EKwQmwCaASAQihB5EGgQVxBGUAMF2zwwAKUB8jIRQxFFEUMRQhFEEUIRQRFFEUERQBFEEUARPxFFET8RPhFEET4RPRFFET0RPBFEETwROxFFETsROhFEEToRORFFETkROBFEETgRNxFFETcRNhFEETYRNRFFETURNBFEETQRMxFFETMRMhFEETIRMRFFETERMBFEETAAnwCSMNMfAYIQKil5M7ry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMVcsVyyCAIqr+EJWQgHHBfL0ESoRKxEqfxErfwHyMxFDEUYRQxFCEUURQhFBEUQRQRFAEUYRQBE/EUURPxE+EUQRPhE9EUYRPRE8EUURPBE7EUQROxE6EUYROhE5EUURORE4EUQROBE3EUYRNxE2EUURNhE1EUQRNRE0EUYRNBEzEUURMxEyEUQRMhExEUYRMREwEUURMACmBP6OnzDTHwGCEGkgk5+68uCB0z/6ANMf0gfTB1VAbBXbPH/gIIIQ3GOFC7qOojDTHwGCENxjhQu68uCB0z/TB9MH0x/UAdAVFEMwbBXbPH/gIIIQ2JCwP7qOpDDTHwGCENiQsD+68uCB0z/TB4EBAdcA1AHQAdMHVUBsFds8f+AgAKwArQCuAK8B/BEvEUURLxEuEUQRLhEtEUURLREsEUQRLBErEUURKxEqEUQRKhEpEUURKREoEUQRKBEnEUURJxEmEUQRJhElEUURJREkEUQRJBEjEUURIxEiEUQRIhEhEUURIREgEUQRIBEfEUURHxEeEUQRHhEdEUURHREcEUQRHBEbEUURGwCgAfwRGhFEERoRGRFFERkRGBFEERgRFxFFERcRFhFEERYRFRFFERURFBFEERQRExFFERMREhFEERIRERFFEREREBFEERAPEUUPDhFEDg0RRQ0MEUQMCxFFCwoRRAoJEUUJCBFECAcRRQcGEUQGBRFFBQQRRAQDEUUDAhFEAgERRQEAoQP8EUTbPNs8VyyCAM8SViry9IvFJvdGF0ZU9yYWNsZYEUMRRRFDEUIRRBFCEUERQxFBEUARQhFAET8RQRE/ET4RQBE+ET0RPxE9ETwRPhE8ETsRPRE7EToRPBE6ETkROxE5ETgROhE4ETcRORE3ETYROBE2ETURNxE1ETQRNhE0AMgAogCjACRWKp6CAN/k+CNWI6FWJL7y9N4B/BEzETURMxEyETQRMhExETMRMREwETIRMBEvETERLxEuETARLhEtES8RLRErES0RKxEqESwRKhEpESsRKREoESoRKBEnESkRJxEmESgRJhElEScRJREkESYRJBEjESURIxEiESQRIhEhESMRIREgESIRIBEfESERHxEeESARHgCkAfgRHREfER0RHBEeERwRGxEdERsRGhEcERoRGREbERkRGBEaERgRFxEZERcRFhEYERYRFREXERURFBEWERQRExEVERMREhEUERIRERETEREREBESERAPEREPDhEQDhDfEM4QvRCsEJsQihB5EGgQVxBGEDVEAHBQBHEB2zwwAKUBzFclgQEBVh9EFPgjRBQRJ39wcMhVgNs8yQIRHQIBESIBVhwBIG6VMFn0WjCUQTP0FeKBAQH4IyEDERwDVh1ZIW6VW1n0WjCYyAHPAEEz9ELiVhqk+CMRIhEbER0RGwERHAECERsCAQDcAfwRLxFEES8RLhFGES4RLRFFES0RLBFEESwRKxFGESsRKhFFESoRKRFEESkRKBFGESgRJxFFEScRJhFEESYRJRFGESURJBFFESQRIxFEESMRIhFGESIRIRFFESERIBFEESARHxFGER8RHhFFER4RHRFEER0RHBFGERwRGxFFERsApwH8ERoRRBEaERkRRhEZERgRRREYERcRRBEXERYRRhEWERURRREVERQRRBEUERMRRhETERIRRRESERERRBERERARRhEQDxFFDw4RRA4NEUYNDBFFDAsRRAsKEUYKCRFFCQgRRAgHEUYHBhFFBgURRAUEEUYEAxFFAwIRRAIBEUYBAKgC/BFF2zxXKVc8VzyCAOhBViGz8vSCAPIZVkTCCZRWRMFlkXDilFZDwWWRcOLy9PgjESakgQEB+CMBEUSAZH/IVTBQNIEBAc8AyFjPFskBzIEBAc8AygDJAhElAgERQwFWJAEgbpUwWfRaMJRBM/QV4hEipBFAEUMRQBE/EUIRPwDIAKkB/BE+EUERPhE9EUARPRE8ET8RPBE9ET4RPRE8ET0RPBE5ETwRORE4ETsROBE3EToRNxE2ETkRNhE1ETgRNRE0ETcRNBEzETYRMxEyETURMhExETQRMREwETMRMBEvETIRLxEuETERLhEtETARLREsES8RLBErES4RKxEqES0RKgCqAfQRKREsESkRKBErESgRJxEqEScRJREpESURJxEoEScRJBEnESQRIhEmESIRJREhESQRIREgESMRIBEfESIRHxEeESERHhEdESARHREcER8RHBEbER4RGxEaER0RGhEZERwRGREYERsRGBEXERoRFxEWERkRFhEVERgRFQCrAIYRFBEXERQRExEWERMREhEVERIREREUEREREBETERAPERIPDhERDg0REA0QzxC+EK0QnBCLEHoQaRBYEEcQNkAVUDMEAfARQxFIEUMRQhFHEUIRQRFGEUERQBFFEUARPxFEET8RPhFIET4RPRFHET0RPBFGETwROxFFETsROhFEEToRORFIETkROBFHETgRNxFGETcRNhFFETYRNRFEETURNBFIETQRMxFHETMRMhFGETIRMRFFETERMBFEETAAsAH0NFsRQxFFEUMRQhFEEUIRQRFFEUERQBFEEUARPxFFET8RPhFEET4RPRFFET0RPBFEETwROxFFETsROhFEEToRORFFETkROBFEETgRNxFFETcRNhFEETYRNRFFETURNBFEETQRMxFFETMRMhFEETIRMRFFETERMBFEETAAvgHyNBFDEUcRQxFCEUYRQhFBEUURQRFAEUQRQBE/EUcRPxE+EUYRPhE9EUURPRE8EUQRPBE7EUcROxE6EUYROhE5EUURORE4EUQROBE3EUcRNxE2EUYRNhE1EUURNRE0EUQRNBEzEUcRMxEyEUYRMhExEUURMREwEUQRMADFBPqCEJ07jLG6jr0w0x8BghCdO4yxuvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6ANQB0BRDMGwU2zx/4CCCEAnSGxG6jpkw0x8BghAJ0hsRuvLggdM/1AHQEmwS2zx/4CCCEM/GbL264wIgghA8E0cougDNAM4AzwDQAfwRLxFIES8RLhFHES4RLRFGES0RLBFFESwRKxFEESsRKhFIESoRKRFHESkRKBFGESgRJxFFEScRJhFEESYRJRFIESURJBFHESQRIxFGESMRIhFFESIRIRFEESERIBFIESARHxFHER8RHhFGER4RHRFFER0RHBFEERwRGxFIERsAsQH8ERoRRxEaERkRRhEZERgRRREYERcRRBEXERYRSBEWERURRxEVERQRRhEUERMRRRETERIRRBESERERSBERERARRxEQDxFGDw4RRQ4NEUQNDBFIDAsRRwsKEUYKCRFFCQgRRAgHEUgHBhFHBgURRgUEEUUEAxFEAwIRSAIBEUcBALID/hFG2zwRKKSBAQH4IyEEESoEQTABEUcBIW6VW1n0WjCYyAHPAEEz9ELiVkXAApYRR4ETiLyTV0dw4o4QVztWO8EylIAyVzzegEYRO95WRMADlFZFwlCRcOKOFlc7Vz9WOsIUlIAUVzvegCh/EUABETveVkTAAZRWRcHOkXDi4wAAyACzALQAElc7cFdAgFAROwL4EUTAAZQRRMHik1dEcOKSVjGRcOKVVjBWML6RcOKY+CNWLaFWL76RcOKSV0HjDRE+EUMRPhE9EUIRPRE8EUERPBE7EUAROxE6ET8ROhE5ET4RORE4ET0ROBE3ETwRNxE2ETsRNhE1EToRNRE0ETkRNBEzETgRMxEyETcRMgC1ALYB/BE/EUQRPxE+EUMRPhE9EUIRPRE8EUERPBE7EUAROxE6ET8ROhE5ET4RORE4ET0ROBE3ETwRNxE2ETsRNhE1EToRNRE0ETkRNBEzETgRMxEyETcRMhExETYRMREwETURMBEvETQRLxEuETMRLhEtETIRLREsETERLBErETARKwC3AfwRMRE2ETERMBE1ETARLxE0ES8RLhEzES4RLREyES0RLBExESwRKxEwESsRKhEvESoRKREuESkRKBEtESgRJxEsEScRJhErESYRJREqESURJBEpESQRJhEoESYRJREnESURIREmESERIBElESARHxEkER8RHhEjER4RHREiER0AvQH8ESoRLxEqESkRLhEpESgRLREoEScRLBEnESYRKxEmESURKhElEScRKREnESYRKBEmESIRJxEiESERJhEhESARJREgER8RJBEfER4RIxEeER0RIhEdERwRIREcERsRIBEbERoRHxEaERkRHhEZERgRHREYERcRHBEXERYRGxEWALgC9BEVERoRFREUERkRFBETERgRExESERcREhERERYREREQERUREA8RFA8OERMODRESDQwREQwLERALEK8QnhCNEHwQaxBaEEkQOEcVQBRQY9s8EScRQxEnAxFCAwIRQQIEEUAEESgRPxEoEScRPhEnAxE9AwIRPAIEETsEALkAugL0VzFwVjWBA+ioVkWAZKkEUhC8lzBWRIBkqQTeIMIAjhkRRVZFoRE9VkWgETBWRaARPRFFET0RMBE93hEvVjagETGk+CMicIBAyIIQmZmZmQHLHwERNwHLPwEROvoCAREy+gLJVkUEAxEyAwIROQIRNQEQJBAjbW3bPDAA5QC7AfwRKBE6ESgRJxE5EScDETgDAhE3AgQRNgQRKBE1ESgRJxE0EScDETMDAhEyAgQRMQQRKBEwESgRJxEvEScDES4DAhEtAgQRLAQRKBErESgRJxEqEScDESkDAhEoAgQRJwQCESYCBBElBAMRJAMRIwERIgECESECBBEgBAMRHwMAvAAYETARNBEwES0RLxEtAIoRHgERHQECERwCBBEbBAMRGgMRGQERGAECERcCBBEWBAMRFQMRFAEREwECERICBBERBAMREANN7xBMEDtImhBHEDZERRMA0hEcESERHBEbESARGxEaER8RGhEZER4RGREYER0RGBEXERwRFxEWERsRFhEVERoRFREUERkRFBETERgRExESERcREhERERYREREQERUREA8RFA8OERMODRESDQwREQwLERALEK9VSUQwEgH8ES8RRREvES4RRBEuES0RRREtESwRRBEsESsRRRErESoRRBEqESkRRREpESgRRBEoEScRRREnESYRRBEmESURRRElESQRRBEkESMRRREjESIRRBEiESERRREhESARRBEgER8RRREfER4RRBEeER0RRREdERwRRBEcERsRRREbAL8B/BEaEUQRGhEZEUURGREYEUQRGBEXEUURFxEWEUQRFhEVEUURFREUEUQRFBETEUURExESEUQREhEREUUREREQEUQREA8RRQ8OEUQODRFFDQwRRAwLEUULChFECgkRRQkIEUQIBxFFBwYRRAYFEUUFBBFEBAMRRQMCEUQCARFFAQDAA/gRRNs8gQEB+CMBEUeAZHDIVTBQNIEBAc8AyFjPFskBzIEBAc8AygDJAhEnAgERRgFWJgEgbpUwWfRaMJRBM/QV4hEkpFZDwAOOKhFDwAKcVzsRO6YUETuAPBE73gQRQgQDEUADAhE8AgEROwERNAQRIQRVIOMNEUERQxFBAMgAwQDCACZXIlc0VzpXOlc9Vz5/cHCAZIBaAfQCEUICET8RQRE/ET4RQBE+ET0RPxE9ARE+ARE9EToRPBE6ETkROxE5ETgROhE4ETcRORE3ETYROBE2ETURNxE1AxE2AxEzETURMxEyETQRMhExETMRMREwETIRMBEvETERLxEuETARLhEtES8RLREsES4RLBErES0RKwDDAfgRKhEsESoRKRErESkRKBEqESgRJxEpEScRJhEoESYRJREnESURIxEmESMRIRElESERIhEkESIEESMEESARIhEgER8RIREfER4RIBEeER0RHxEdERwRHhEcERsRHREbERoRHBEaERkRGxEZERgRGhEYERcRGREXERYRGBEWAMQAhhEVERcRFREUERYRFBETERURExESERQREhERERMREREQERIREA8REQ8OERAOEN8QzhC9EKwQmxCKEHkQaBBXRlATREAB/BEvEUcRLxEuEUYRLhEtEUURLREsEUQRLBErEUcRKxEqEUYRKhEpEUURKREoEUQRKBEnEUcRJxEmEUYRJhElEUURJREkEUQRJBEjEUcRIxEiEUYRIhEhEUURIREgEUQRIBEfEUcRHxEeEUYRHhEdEUURHREcEUQRHBEbEUcRGwDGAfwRGhFGERoRGRFFERkRGBFEERgRFxFHERcRFhFGERYRFRFFERURFBFEERQRExFHERMREhFGERIRERFFEREREBFEERAPEUcPDhFGDg0RRQ0MEUQMCxFHCwoRRgoJEUUJCBFECAcRRwcGEUYGBRFFBQQRRAQDEUcDAhFGAgERRQEAxwP6EUTbPIIA0SBWSFYmvvL0ESikVkbAAZRXPldF4w6BAQH4IwIBEUQBEUd/yFUwUDSBAQHPAMhYzxbJAcyBAQHPAMoAyQIRJAIBEUIBViMBIG6VMFn0WjCUQTP0FeIRIaQRPxFDET8RPhFCET4RPRFBET0RPBFAETwROxE/ETsAyADJAMoAKIIAzND4QlYuAccF8vSBUdBWLPL0AOxWRsAClFc9V0WOXlZGwAOONFcsV0VwARFEyHIBywFwAcsAEsoHy//J0CDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IiOFxFGwASYVzIRMRFDETGSV0TiEUMRRBEq4hE7EUMROxEqETviETwRQxE8ETsRPBE7AfwRPRE+ET0RORE9ETkROBE8ETgRNxE7ETcRNhE6ETYRNRE5ETURNBE4ETQRMxE3ETMRMhE2ETIRMRE1ETERMBE0ETARLxEzES8RLhEyES4RLRExES0RLBEwESwRKxEvESsRKhEuESoRKREtESkRKBEsESgRJxErEScRJhEqESYAywH0ESURKRElESYRKBEmESMRJxEjESERJhEhESURIBEkESARHxEjER8RHhEiER4RHREhER0RHBEgERwRGxEfERsRGhEeERoRGREdERkRGBEcERgRFxEbERcRFhEaERYRFREZERURFBEYERQRExEXERMREhEWERIREREVEREAzABaERARFBEQDxETDw4REg4NERENDBEQDBC/EK4QnRCMEHsQahBZEEgQN0ZQRAMCAvAwMVYegQEBI1n0DW+hkjBt3yBukjBtjofQ2zxsGW8J4oFjviFus/L0gRiGISBu8tCAbykYXwizmyEgbvLQgG8pbIGzkXDi8vQRQhFGEUIRQRFFEUERQBFEEUARPxFDET8RPhFGET4RPRFFET0RPBFEETwROxFDETsA9gDRAuwwggCKq/hCVkQBxwXy9FYdgQEBIln0DW+hkjBt3yBukjBtjofQ2zxsGW8J4oFjviFus/L0EUIRRRFCEUERRBFBEUARQxFAET8RRRE/ET4RRBE+ET0RQxE9ETwRRRE8ETsRRBE7EToRQxE6ETkRRRE5ETgRRBE4APYA2QCMMNMfAYIQz8Zsvbry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMVc9ggCKq/hCVkMBxwXy9IFkbVYrs/L0fwL0jmww0x8BghA8E0couvLggdMP0wfTD9MP0w9VQGwVVzxXPFc8Vz9XP4IAiqv4QlZDAccF8vSBZG1WK7Py9IIAhtxWP8FllFY+wWWRcOKWVjqBAfS7kXDillY5gQPou5Fw4pZWOIEBLLuRcOLy9H/gIIIQ8YItobrjAiAA4QDiAfwROhFGEToRORFFETkROBFEETgRNxFDETcRNhFGETYRNRFFETURNBFEETQRMxFDETMRMhFGETIRMRFFETERMBFEETARLxFDES8RLhFGES4RLRFFES0RLBFEESwRKxFDESsRKhFGESoRKRFFESkRKBFEESgRJxFDEScRJhFGESYA0gH8ESURRRElESQRRBEkESMRQxEjESIRRhEiESERRREhESARRBEgER8RQxEfER4RRhEeER0RRREdERwRRBEcERsRQxEbERoRRhEaERkRRREZERgRRBEYERcRQxEXERYRRhEWERURRREVERQRRBEUERMRQxETERIRRhESERERRRERANMCxhEQEUQREA8RQw8OEUYODRFFDQwRRAwLEUMLChFGCgkRRQkIEUQIBxFDBwYRRgYFEUUFBBFEBAMRQwMCEUYCARFFARFEgSLUEURWR9s8ARFFAfL0VhiBAQFWSFn0DW+hkjBt3wElANQB2iBukjBtjiXQgQEB1wCBAQHXAIEBAdcA1AHQgQEB1wDSADAQJRAkECNsFW8F4nBTAW6zjhpbICBu8tCAbyUQNF8EASBu8tCAbyUQJF8EAZEy4lZHoFZEVh+ogScQqQSBAQEDpFMhuVZLVEQwUkAA1QL+yFVAUEWBAQHPABKBAQHPAIEBAc8AAciBAQHPABLKAMkBzMkCERwCE1ZKASBulTBZ9FowlEEz9BXiERoBvpkCEUYCV0RXRDDjDRE/EUMRPxE+EUIRPhE9EUERPRE8EUARPBE7ET8ROxE6ET4ROhE5ET0RORE4ETwROBE3ETsRNwDWANcBlhFEIG7y0IBvKVsQVhBGEDYQJoEBAUd3f3DIVYDbPMkDERwDEgERRwEgbpUwWfRaMJRBM/QV4gERFQERQ6ARGBFDERgRGBFCERgRFADcAfwRNhE6ETYRNRE5ETURNBE4ETQRMxE3ETMRMhE2ETIRMRE1ETERMBE0ETARLxEzES8RLhEyES4RLRExES0RLBEwESwRKxEvESsRKhEuESoRKREtESkRKBEsESgRJxErEScRJhEqESYRJREpESURJBEoESQRIxEnESMRIhEmESIA2AD8ESERJREhESARJBEgER8RIxEfER4RIhEeER0RIREdERwRIBEcERsRHxEbERoRHhEaERkRHREZERgRHBEYERcRGxEXERYRGhEWERURGREVERQRGBEUERMRFxETERIRFhESERERFRERERARFBEQDxETDw4REg4NERENDBEQDFU7AfwRNxFDETcRNhFFETYRNRFEETURNBFDETQRMxFFETMRMhFEETIRMRFDETERMBFFETARLxFEES8RLhFDES4RLRFFES0RLBFEESwRKxFDESsRKhFFESoRKRFEESkRKBFDESgRJxFFEScRJhFEESYRJRFDESURJBFFESQRIxFEESMA2gH8ESIRQxEiESERRREhESARRBEgER8RQxEfER4RRREeER0RRBEdERwRQxEcERsRRREbERoRRBEaERkRQxEZERgRRREYERcRRBEXERYRQxEWERURRREVERQRRBEUERMRQxETERIRRRESERERRBERERARQxEQDxFFDw4RRA4NEUMNANsD9AwRRQwLEUQLChFDCgkRRQkIEUQIBxFDBwYRRQYFEUQFBBFDBAMRRQMCEUQCARFDARFFgSLUEUVWRNs8ARFGAfL0gVnFVkYgbvLQgG8pbIGz8vQRRSBu8tCAbykwEEcQNoEBAX8nUVoFEEpaGshVgNs8yQMRHgMBEUYBASUA3ADdAG5QiYEBAc8AFoEBAc8AyFAFzxbJUATMEoEBAc8AAciBAQHPAMhQA88WyVjMEsoAEsoAEsoAyQHMAf4gbpUwWfRaMJRBM/QV4otlNldEZlZYVkQB+QEB+QG6lFc9V0KONIvVRvZ2dsZVRyYWRpbmeAERRAH5AQH5AbqaVzQRGcMAETMRGZJXGuIRGRFBERkRGRE7ERniEUARQxFAET8RQhE/ET4RQRE+ET0RQBE9ETwRPxE8ERkRPhEZAN4B/BE6ET0ROhE5ETwRORE4ETsROBE3EToRNxE2ETkRNhE1ETgRNRE0ETcRNBEzETYRMxEyETURMhExETQRMREwETMRMBEvETIRLxEuETERLhEtETARLREsES8RLBErES4RKxEqES0RKhEpESwRKREoESsRKBEnESoRJxEmESkRJgDfAfwRJREoESURJBEnESQRIxEmESMRIhElESIRIREkESERIBEjESARHxEiER8RHhEhER4RHREgER0RHBEfERwRGxEeERsRGhEdERoRGhEcERoRGBEbERgRFxEaERcRFhEZERYRFREYERURFBEXERQRExEWERMREhEVERIREREUEREA4AAuERARExEQDxESDw4REQ4NERANEM9VKxIAVDDTHwGCEPGCLaG68uCB0gABMVc3ggCKq/hCVkMBxwXy9IFkbVYrs/L0fwL4ghCDuBRKuo44MNMfAYIQg7gUSrry4IHSAPoA0x/TB1UwbBRXNVc1VzVXNoIAiqv4QlZDAccF8vSBZG1WK7Py9H/gIIIQlGqYtrqOqDDTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gwACRMOMNcADjAOQBPG1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8MADlAtj5ASCC8OW19yQgrYUDCHOhxBPzJTZZGJ4yUwluvY2XRGULQom9uo4VMFdCgTjG+EJWQgHHBfL0cBFCf9sx4CCC8IeCQDfwAVaPHrE28h5doQLQ7DOcOKeYgt3M/8xzi7Jiuo6GMNs8f9sx4CAA5wDoAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CADmAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAfKCAIqr+EJWQwHHBfL0EUIRQxFCEUERQxFBEUARQxFAET8RQxE/ET4RQxE+ET0RQxE9ETwRQxE8ETsRQxE7EToRQxE6ETkRQxE5ETgRQxE4ETcRQxE3ETYRQxE2ETURQxE1ETQRQxE0ETMRQxEzETIRQxEyETERQxExAOkBzoLwbI9E9F/ttM3+1N6NsUqlsTrVXUMPdZ0GaSELdMSP49+6jhwwVyNXNYIAiqv4QlZBAccF8vRwfxE2AREjf9sx4ILwbI/r7ZDhY52eM9RJ5gmNtY8RAYBI5Y7JIcylHimy+ue64wIA7gH8ETARQxEwES8RQxEvES4RQxEuES0RQxEtESwRQxEsESsRQxErESoRQxEqESkRQxEpESgRQxEoEScRQxEnESYRQxEmESURQxElESQRQxEkESMRQxEjESIRQxEiESERQxEhESARQxEgER8RQxEfER4RQxEeER0RQxEdERwRQxEcAOoC+hEbEUMRGxEaEUMRGhEZEUMRGREYEUMRGBEXEUMRFxEWEUMRFhEVEUMRFREUEUMRFBETEUMRExESEUMREhEREUMREREQEUMREA8RQw8OEUMODRFDDQwRQwwLEUMLChFDCgkRQwkRQwgHBlVAgWj0EUTbPFckVypXKlcqESCzATQA6wH4ARFBAfL0cHBWPhFBEUIRQRFAEUERQBE/EUARPxE+ET8RPhE9ET4RPRE8ET0RPBE7ETwROxE6ETsROhE5EToRORE4ETkROBE3ETgRNxE2ETcRNhE1ETYRNRE0ETURNBEzETQRMxEyETMRMhExETIRMREwETERMBEvETARLwDsAfYRLhEvES4RLREuES0RLBEtESwRKxEsAhEqAgERKQERJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESJwESMRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsRGhEbERoRGREaERkA7QCkERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQDxDvEN4QzRC8EKsQmhCJEHgQZxBWFBVDMAA8ggCKq/hCVkMBxwXy9IIArpdWK7Py9BErsxErf9sxAgEgAPEA8gIBagD6APsC+bLZNs8EUMRRBFDEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwgATwA8wL5s/X2zwRQxFEEUMRQhFDEUIRQRFCEUERQBFBEUARPxFAET8RPhE/ET4RPRE+ET0RPBE9ETwROxE8ETsROhE7EToRORE6ETkROBE5ETgRNxE4ETcRNhE3ETYRNRE2ETURNBE1ETQRMxE0ETMRMhEzETIRMREyETERMBExETCABPAD3AfwRLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsA9AHkERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEgbpIwbZkgbvLQgG8pbwniIG6SMG3eAPUBPIEBAVYeAln0DW+hkjBt3yBukjBtjofQ2zxsGW8J4gD2AFyBAQHXAIEBAdcA1AHQAYEBAdcA1AHQgQEB1wDUAdAB0gDSANIAMBBZEFgQVxBWAfwRLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsA+AG4ERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEA+QAugQEBIFYqUDNBM/QMb6GUAdcAMJJbbeICIKlk2zzbPGznbOds52znbMcBPAD8AvSpCiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjbPBFDEUQRQxFCEUMRQhFBEUIRQRFAEUERQBE/EUARPxE+ET8RPhE9ET4RPRE8ET0RPBE7ETwROxE6ETsROhE5EToRORE4ETkROBE3ETgRNxE2ETcRNhE1ETYRNQE8AP0ADlR5h1R5hykB/BE0ETURNBEzETQRMxEyETMRMhExETIRMREwETERMBEvETARLxEuES8RLhEtES4RLREsES0RLBErESwRKxEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIAD+AvQRHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsRGhEbERoRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ7bPFcQXw9XEF8PVxBfD1cQXw9sQQD/AQAAfIEBCywCWfQLb6GSMG3fIG6SMG2OKNCBAQHXAIEBAdcAgQEB1wDUAdCBAQHXAIEBAdcAMBAlECQQI2wVbwXiACwgbpIwbZkgbvLQgG8lbwXiIG6SMG3eAgEgAQMBBAL5r05tngihiKIIoYihCKGIoQigiKEIoIigCKCIoAifiKAIn4ifCJ+InwieiJ8InoieCJ6IngidiJ4InYidCJ2InQiciJ0InIicCJyInAibiJwIm4ibCJuImwiaiJsImoiaCJqImgiZiJoImYiZCJmImQiYiJkImIiYCJiImEABPAEHAjCr7ds82zxXEF8PVxBfD1cQXw9XEF8PbEEBPAEFAiyrBts82zxsmWyZbJlsmWyZbJlsmWxZATwBBgAEVjYAJFYqViNWI1YjViNWI1YjVh9WIwH8ES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbAQgBuBEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBAQkAHIEBASICWfQMb6GSMG3fAgEgAQwBDQIxsN62zzbPFcQXw9XEF8PVxBfD1cQXw9sQYAE8ARMCLa117Z5tnjZENkQ2RDZENkQ2RDZENmRAATwBDgL1rcEQa6TAgIXdeXBEEGuFhRBAgn/deWhEwYTdeXBEbZ4IoYiiCKGIoQihiKEIoIihCKCIoAigiKAIn4igCJ+InwifiJ8InoifCJ6IngieiJ4InYieCJ2InQidiJ0InIidCJyInAiciJwIm4icCJuImwibiJsImoibCJrAATwBDwAqgGRWPqFWPwFWPwFWPFY8VjxWQVZBAfwRNBE1ETQRMxE0ETMRMhEzETIRMREyETERMBExETARLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESABEAL0ER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEBEQESAJCBAQtWEAJZ9AtvoZIwbd8gbpIwbY4x0PpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wCBAQHXAFUgbBNvA+IALCBukjBtmSBu8tCAbyNvA+IgbpIwbd4ABFYjAgFYARYBFwIxtuKbZ5tniuIL4eriC+Hq4gvh6uIL4e2IMAE8AR0C9a28kGukwICF3XlwRBBrhYUQQIJ/3XloRMGE3XlwRG2eCKGIogihiKEIoYihCKCIoQigiKAIoIigCJ+IoAifiJ8In4ifCJ6InwieiJ4InoieCJ2IngidiJ0InYidCJyInQiciJwInIicCJuInAibiJsIm4ibCJqImwiawAE8ARgCIa8W7Z5tnjZ6tnq2erZ6tkLAATwBHAH8ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgARkB9BEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGxEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBARoBkPhD+CgS2zxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAEbANYC0PQEMG0BgW6jAYAQ9A9vofLghwGBbqMiAoAQ9BfIAcj0AMkBzHABygBAA1kg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyQAUVkNWQ1ZDVkNWQwEE2zwBNAIBIAEgASECASABJgEnABGtX3aiaGkAAMAC+awN7Z4IoYiiCKGIoQihiKEIoIihCKCIoAigiKAIn4igCJ+InwifiJ8InoifCJ6IngieiJ4InYieCJ2InQidiJ0InIidCJyInAiciJwIm4icCJuImwibiJsImoibCJqImgiaiJoImYiaCJmImQiZiJkImIiZCJiImAiYiJhAATwBIgH8ES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbASMBuBEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBASQBBNs8ASUAUoEBASBWHVAzQTP0DG+hlAHXADCSW23iIG6SMHDg+CMBIG7y0IChVh+5Ai2v3O2ebZ42TLZMtky2TLZMtky2TLYswAE8ASgC+a68bZ4IoYiiCKGIoQihiKEIoIihCKCIoAigiKAIn4igCJ+InwifiJ8InoifCJ6IngieiJ4InYieCJ2InQidiJ0InIidCJyInAiciJwIm4icCJuImwibiJsImoibCJqImgiaiJoImYiaCJmImQiZiJkImIiZCJiImAiYiJhAATwBKQAkVjVWNVY1VjVWNVY1VjVWNVY1AfwRLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsBKgHkERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEgbpIwbZkgbvLQgG8lbwXiIG6SMG3eASsAeIEBAVYbAln0DW+hkjBt3yBukjBtjiXQgQEB1wCBAQHXAIEBAdcA1AHQgQEB1wDSADAQJRAkECNsFW8F4gIBZgEuAS8CIa2/7Z5tnjZ6tnq2erZ6tkLAATwBPQIno8ts82zxsqmyqbKpsqmyqbKpsioBPAEwAvOhDINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiNs8EUMRRBFDEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1gE8ATgB8FYsVixWLFYsVixWQ1YuVixWJxFDEUwRQxFCEUsRQhFBEUoRQRFAEUkRQBE/EUgRPxE+EUcRPhE9EUYRPRE8EUURPBE7EUQROxE6EUwROhE5EUsRORE4EUoROBE3EUkRNxE2EUgRNhE1EUcRNRE0EUYRNBEzEUURMwExAfwRMhFEETIRMRFMETERMBFLETARLxFKES8RLhFJES4RLRFIES0RLBFHESwRKxFGESsRKhFFESoRKRFEESkRKBFMESgRJxFLEScRJhFKESYRJRFJESURJBFIESQRIxFHESMRIhFGESIRIRFFESERIBFEESARHxFMER8RHhFLER4BMgH4ER0RShEdERwRSREcERsRSBEbERoRRxEaERkRRhEZERgRRREYERcRRBEXERYRTBEWERURSxEVERQRShEUERMRSRETERIRSBESERERRxERERARRhEQDxFFDw4RRA4NEUwNDBFLDAsRSgsKEUkKCRFICQgRRwgHEUYHBhFFBgEzAvwFEUQFBBFMBAMRSwMCEUoCARFJARFI2zwJEUgJCBFHCAcRRgcGEUUGBRFNBQQRTAQDEUsDAhFKAgERSQERRBFNEUQRQxFMEUMRQhFLEUIRQRFKEUERQBFJEUARPxFIET8RPhFHET4RPRFGET0RPBFFETwROxFEETsROhFDEToBNAE1ABD4I1YgoVYhuwH8ETkRQhE5ETgRQRE4ETcRQBE3ETYRPxE2ETURPhE1ETQRPRE0ETMRPBEzETIROxEyETEROhExETAROREwES8ROBEvES4RNxEuES0RNhEtESwRNREsESsRNBErESoRMxEqESkRMhEpESgRMREoEScRMBEnESYRLxEmESURLhElATYB/BEkES0RJBEjESwRIxEiESsRIhEhESoRIREgESkRIBEfESgRHxEeEScRHhEdESYRHREcESURHBEbESQRGxEaESMRGhEZESIRGREYESERGBEXESARFxEWER8RFhEVER4RFREUER0RFBETERwRExESERsREhERERoREREQERkREAE3ADAPERgPDhEXDg0RFg0MERUMCxEUCwoREwoB/BE0ETURNBEzETQRMxEyETMRMhExETIRMREwETERMBEvETARLxEuES8RLhEtES4RLREsES0RLBErESwRKxEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIAE5AvQRHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsRGhEbERoRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ7bPFcQXw9XEF8PVxBfD1cQXw9sQQE6ATsAboEBC1YVAln0C2+hkjBt3yBukjBtjiDQgQEB1wCBAQHXAIEBAdcA1AHQgQEB1wAwFEMwbBRvBOIALCBukjBtmSBu8tCAbyRvBOIgbpIwbd4CgO1E0NQB+GPSAAHjAvgo1wsKgwm68uCJ+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHU1FUgA9FY2zwBPgE/ABRWF1YXVhdWF1YWAvjbPFdEEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwES8RMBEvAUABQQHubW1tbW1tbW1tbXB/LoAegDJWEVNVgGSBASyAD39/JYISVAvkAIEOEFR3IlMAcHBUciKAS3CBVGAjgggJOoD4I4IBUYCBA+hTRH+BB9CCGBdIdugAgggnjQBTRH9WGn9TM3+CEDuaygBWEFYtcfgjU2YRNhFDETYBRQHu+gDSAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1NQB0NTTD9MH+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6APoA0w/TD9MP0gDSAPoA+gDTH9MH1DDQgQEB1wCBAQHXAPoA+gDUMNABQgH8ES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbERoRGxEaAUQB/vpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gDSAIEBAdcAgQEB1wD0BPQE1DDQgQEB1wDTB9IA0x+BAQHXANMfgQEB1wDTH9MP9ATUMNCBAQHXAPQE9AT6ANIA0w/6ANMf9AT6APoA0gDTD9Qw0PQE0gD6APoA9AQBQwBy0gD6ANMf0weBAQHXAIEBAdcA1DDQ+gD0BIEBAdcA9AQwEUARRBFAEUARQxFAEUARQhFAEUARQRFAAIQRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ4B/BE1EUIRNRE0EUERNBE1EUARNRE0ET8RNBEzET4RMxEyET0RMhExETwRMREwETsRMBEvEToRLxEuETkRLhEtETgRLREsETcRLBErETYRKxEqETURKhEpETQRKREoETMRKBEnETIRJxEmETERJhElETARJREkES8RJBEjES4RIwFGAfwRIhEtESIRKxEsESsRIRErESERIBEqESARHxEpER8RHhEoER4RIBEnESARHxEmER8RHRElER0RHBEkERwRGxEjERsRGhEiERoRGREhERkRGBEgERgRFxEfERcRFhEeERYRFREdERURFhEcERYRFBEbERQRGBEaERgRFxEZERcBRwCOERMRGBETERIRFxESERERFhERERARFREQDxEUDxEQERMREA4REg4NERENDBEQDBC/EN4QrRCcEIsQihB5EGgQVxBGEDVEAwI=');
    const __system = Cell.fromBase64('te6cckICAWAAAQAAe6AAAAEBwAABAgEgAAIAFwEFv3UcAAMBFP8A9KQT9LzyyAsABAIBYgAFABADetAB0NMDAXGwowH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIVFBTA28E+GEC+GLbPFUT2zzy4IIAEgAGAA8D9gGSMH/gcCHXScIflTAg1wsf3iCCEAStN4O6jkww0x8BghAErTeDuvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIVBMDECNsFBAjXwOCAMJB+EJSQMcF8vQUoAN/4CCCEJOrtT66jwgw2zxsF9s8fwAHAAgADADG0x8BghCTq7U+uvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHi+gBRZhYVFEMwAoJsMYE4xvhCUoDHBfL0gSHUU4O+8vSCANop+CNQBqHCBBXy9PgjIqcegScQqQQgwQGSMHHeUzChUJSh+ENTN9s8XAEpAAkBlHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcH+AQFRKoFLtAAoCnshVMIIQBK03g1AFyx8Tyz8B+gIBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WAc8WyUZQEEoQOECoEEYQRds8MCbCAJMwNTDjDQMA5wALAdBwcFQUh4BABMhVMIIQ61J+31AFyx8Tyz8B+gIBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsklBANIiBAkECNtbds8MADnAZzgghDngiQTuo7B0x8BghDngiQTuvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdIAAZHUkm0B4lUwbBTbPH/gMHAADQHyMIE4xvhCUnDHBfL0gSHUU3K+8vRRYaFwf1QUN4BACshVMIIQ2xfwylAFyx8Tyz+BAQHPAAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WySUEQxNQiAAOARIQJBAjbW3bPDAA5wCqyPhDAcx/AcoAVTBQQ/oCASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlgg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxaBAQHPAMntVAIBIAARABYCEb/YFtnm2eNiJAASABUBxu1E0NQB+GPSAAGOS/oA+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcAVTBsFOD4KNcLCoMJuvLgiQATAYr6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgSAtEB2zwAFAAIcFQSIgEW+ENd2zwwVGRAUkABKQARvhX3aiaGkAAMAQW9u0QAGAEU/wD0pBP0vPLICwAZAgFiABoA9wLw0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8EUMRRRFDEUIRRBFCEUERQxFBEUARQhFAET8RQRE/ET4RQBE+ET0RPxE9ETwRPhE8ETsRPRE7EToRPBE6ETkROxE5AVQAGwH8ETgROhE4ETcRORE3ETYROBE2ETURNxE1ETQRNhE0ETMRNREzETIRNBEyETERMxExETARMhEwES8RMREvES4RMBEuES0RLxEtESwRLhEsESsRLRErESoRLBEqESkRKxEpESgRKhEoEScRKREnESYRKBEmESURJxElESQRJhEkABwB+BEjESURIxEiESQRIhEhESMRIREgESIRIBEfESERHxEeESARHhEdER8RHREcER4RHBEbER0RGxEaERwRGhEZERsRGREYERoRGBEXERkRFxEWERgRFhEVERcRFREUERYRFBETERURExESERQREhERERMREREQERIREA8REQ8AHQIWDhEQDlUd2zzy4IIAHgDyBOrtou37AZIwf+BwIddJwh+VMCDXCx/eIIIQ/HCL0rqOuDDTHwGCEPxwi9K68uCBgQEB1wD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIEmwS2zx/4CCCENsX8Mq64wIgghDrUn7fuuMCIIIQz+H9PLoAHwAiACcAOQKeggDoQVYm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EUQRHBEbEUQRGxEaEUQRGgAzAvYRGRFEERkRGBFEERgRFxFEERcRFhFEERYRFRFEERURFBFEERQRExFEERMREhFEERIRERFEEREREBFEERAPEUQPDhFEDg0RRA0MEUQMCxFECwoRRAoJEUQJEUQIBwZVQFZE2zwRQxFEEUMRQhFDEUIRQRFCEUERQBFBEUAAuAA0AfwRPxFAET8RPhE/ET4RPRE+ET0RPBE9ETwROxE8ETsROhE7EToRORE6ETkROBE5ETgRNxE4ETcRNhE3ETYRNRE2ETURNBE1ETQRMxE0ETMRMhEzETIRMREyETERMBExETARLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsANQH8ESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWADYAVBEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDgAM+CMmoSm+ARyTIsIAkXDijoLbPJEw4gBqBP6OtDDTHwGCEM/h/Ty68uCB0z8BMYFjLlY38vSBfCpWNlY2vvL0ggDaKfgjVjOhVjW+8vTbPH/gIIIQvvDpBLqOlTDTHwGCEL7w6QS68uCB+gABMds8f+AgghD/Yzvhuo6VMNMfAYIQ/2M74bry4IH6AAEx2zx/4CCCEAlKH3y6ALgAOgBDAFAB9IIAqsdWGfL0gWYsIVYYvvL0+EJWFYEBCyJZ9AtvoZIwbd8gbpIwbY4g0IEBAdcAgQEB1wCBAQHXANQB0IEBAdcAMBRDMGwUbwTicPgjVhmgIm6zjhZbICBu8tCAbyRfAwEgbvLQgG8kbDEBkTLiEUMRRxFDEUIRRhFCADsB/BFBEUURQRFAEUQRQBE/EUcRPxE+EUYRPhE9EUURPRE8EUQRPBE7EUcROxE6EUYROhE5EUURORE4EUQROBE3EUcRNxE2EUYRNhE1EUURNRE0EUQRNBEzEUcRMxEyEUYRMhExEUURMREwEUQRMBEvEUcRLxEuEUYRLhEtEUURLQA8AfwRLBFEESwRKxFHESsRKhFGESoRKRFFESkRKBFEESgRJxFHEScRJhFGESYRJRFFESURJBFEESQRIxFHESMRIhFGESIRIRFFESERIBFEESARHxFHER8RHhFGER4RHRFFER0RHBFEERwRGxFHERsRGhFGERoRGRFFERkRGBFEERgAPQL6ERcRRxEXERYRRhEWERURRREVERQRRBEUERMRRxETERIRRhESERERRRERERARRBEQDxFHDw4RRg4NEUUNDBFEDAsRRwsKEUYKCRFFCQgRRAgHEUcHBhFGBgURRQUEEUQEAxFHAwIRRgIBEUUBEURWRts8IMIAlFYSIb6RcOIAVAA+A+qPYBESVhKh+EP4KFZJAds8XHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcHCAQCL4KMjJ0BAjAhEbApEw4oEBCxFFVkig+CNY+CMBEUgBKQBIAD8B/shVMFA0gQEBzwCBAQHPAIEBAc8AAciBAQHPAMkBzMkDERMDAhFEAgERRgEgbpUwWfRZMJRBM/QT4hFEH6ARPxFDET8RPhFCET4RPRFBET0RPBFAETwROxE/ETsROhE+EToRORE9ETkROBE8ETgRNxE7ETcRNhE6ETYRNRE5ETUAQAH8ETQROBE0ETMRNxEzETIRNhEyETERNRExETARNBEwES8RMxEvES4RMhEuES0RMREtESwRMBEsESsRLxErESoRLhEqESkRLREpESgRLBEoEScRKxEnESYRKhEmESURKRElESQRKBEkESMRJxEjESIRJhEiESERJREhESARJBEgAEEB/BEfESMRHxEeESIRHhEdESERHREcESARHBEbER8RGxEaER4RGhEZER0RGREYERwRGBEXERsRFxEWERoRFhEVERkRFREUERgRFBETERcRExESERYREhERERUREREQERQREBESDRERDQwREAwQvxCuEJ0QjBB7EGoQWRBIEDdGUABCAAREAAHs+EJWFYEBCyJZ9AtvoZIwbd8gbpIwbY4g0IEBAdcAgQEB1wCBAQHXANQB0IEBAdcAMBRDMGwUbwTigW3TIW6z8vSBUv0hIG7y0IBvJF8DJL7y9IFig/gjIiBu8tCAbyRsMb7y9BFDEUYRQxFCEUURQhFBEUQRQQBEAfwRQBFGEUARPxFFET8RPhFEET4RPRFGET0RPBFFETwROxFEETsROhFGEToRORFFETkROBFEETgRNxFGETcRNhFFETYRNRFEETURNBFGETQRMxFFETMRMhFEETIRMRFGETERMBFFETARLxFEES8RLhFGES4RLRFFES0RLBFEESwARQH8ESsRRhErESoRRREqESkRRBEpESgRRhEoEScRRREnESYRRBEmESURRhElESQRRREkESMRRBEjESIRRhEiESERRREhESARRBEgER8RRhEfER4RRREeER0RRBEdERwRRhEcERsRRREbERoRRBEaERkRRhEZERgRRREYERcRRBEXAEYD+hEWEUYRFhEVEUURFREUEUQRFBETEUYRExESEUUREhEREUQREREQEUYREA8RRQ8OEUQODRFGDQwRRQwLEUQLChFGCgkRRQkIEUQIBxFGBwYRRQYFEUQFBBFGBAMRRQMCEUQCARFGARFFVkbbPCDCAJRWEiG+kXDikTDjDVZFAFQARwBJAsARElYSofhD+ChWSQHbPFxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiHBwgEAi+CjIydAQIwIRGwIBKQBIAYzIVTCCEAStN4NQBcsfE8s/AfoCASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgHPFskQNkVAAxEYA1kQRhBF2zwwAOcD3CBu8tCAbyRfA1ZFoSDCAI5KMFdFgQELbSBukjBtjiYgbvLQgG8kyFUwUDSBAQHPAIEBAc8AgQEBzwAByIEBAc8AyQHMyeICERQCVkcBIG6VMFn0WTCUQTP0E+LjDRERVkOh+EP4KBIBEUcB2zxcAEoBKQBLALSBAQtWRyBu8tCAbyQQI18D+CMRSSBu8tCAbyRsMRIBEUkByFUwUDSBAQHPAIEBAc8AgQEBzwAByIEBAc8AyQHMyQIRFAIBEUYBVkcBIG6VMFn0WTCUQTP0E+IBonBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcHCAQCL4KMjJ0BAjAhFLAgBMAvjIVTCCEAStN4NQBcsfE8s/AfoCASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgHPFskQNkVAAxFIA1kQRhBF2zwwEUARQxFAET8RQhE/ET4RQRE+ET0RQBE9ETwRPxE8ETsRPhE7EToRPRE6ETkRPBE5ETgROxE4AOcATQH8ETcROhE3ETYRORE2ETUROBE1ETQRNxE0ETMRNhEzETIRNREyETERNBExETARMxEwES8RMhEvES4RMREuES0RMBEtESwRLxEsESsRLhErESoRLREqESkRLBEpESgRKxEoEScRKhEnESYRKREmESURKBElESQRJxEkESMRJhEjAE4B/BEiESURIhEhESQRIREgESMRIBEfESIRHxEeESERHhEdESARHREcER8RHBEbER4RGxEaER0RGhEZERwRGREYERsRGBEXERoRFxEWERkRFhEVERgRFREUERcRFBETERYRExESERUREhERERQREQ8REw8PERIPDhERDg0REA0QzwBPAARVKwTqjpMw0x8BghAJSh98uvLggW0x2zx/4CCCEBO9azK6jjgw0x8BghATvWsyuvLggdIA0w/6ANMfVTBsFFcYVxhXGFcYggCKq/hCVkMBxwXy9IFkbVYrs/L0f+AgghDTtQsjuuMCIIIQGrChQrrjAiCCEOo/O926AFEAWwBgAGEB9jD4QhFDEUQRQxFCEUQRQhFBEUQRQRFAEUQRQBE/EUQRPxE+EUQRPhE9EUQRPRE8EUQRPBE7EUQROxE6EUQROhE5EUQRORE4EUQROBE3EUQRNxE2EUQRNhE1EUQRNRE0EUQRNBEzEUQRMxEyEUQRMhExEUQRMREwEUQRMABSAfwRLxFEES8RLhFEES4RLRFEES0RLBFEESwRKxFEESsRKhFEESoRKRFEESkRKBFEESgRJxFEEScRJhFEESYRJRFEESURJBFEESQRIxFEESMRIhFEESIRIRFEESERIBFEESARHxFEER8RHhFEER4RHRFEER0RHBFEERwRGxFEERsAUwL8ERoRRBEaERkRRBEZERgRRBEYERcRRBEXERYRRBEWERURRBEVERQRRBEUERMRRBETERIRRBESERERRBERERARRBEQDxFEDw4RRA4NEUQNDBFEDAsRRAsKEUQKCRFECRFECAcGVUBWRNs8ggDhuCHCAPL0ggCciFYTIr7y9BESAFQAVQDegQELVhUCWfQLb6GSMG3fIG6SMG2OINCBAQHXAIEBAdcAgQEB1wDUAdCBAQHXADAUQzBs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IBEfEUYRHxEeEUURHhEdEUQRHREcEUYRHBEbEUURGwBxAfwRGhFEERoRGRFGERkRGBFFERgRFxFEERcRFhFGERYRFRFFERURFBFEERQRExFGERMREhFFERIRERFEEREREBFGERAPEUUPDhFEDg0RRg0MEUUMCxFECwoRRgoJEUUJCBFECAcRRgcGEUUGBRFEBQQRRgQDEUUDAhFEAgERRgEAcgL6EUXbPFcjVzVWRI4Xf3ARRcADn1c8VzxwV0CAZBE8gFoRPN6fV0OCAM8SVijy9HB/EUQB4ovkVtZXJnZW5jeVBhdXNlhwEUeRcZJWRuIRRBFHEUQRQxFGEUMRQhFFEUIRQRFEEUERQBFDEUARPxFCET8RPhFBET4RPRFAET0AygBzAfwRPBE/ETwROxE+ETsROhE9EToRORE8ETkROBE7ETgRNhE5ETYRNRE4ETURNBE3ETQRMxE2ETMRMhE1ETIRMRE0ETERMBEzETARLxEyES8RLhExES4RLREwES0RLBEvESwRKxEuESsRKhEtESoRKREsESkRKBErESgRJxEqEScAdAH4ESYRKREmESURKBElAhEnAhEjESYRIxEiESURIhEhESQRIREgESMRIBEfESIRHxEeESERHhEdESARHREcER8RHBEbER4RGxEaER0RGhEZERwRGREYERsRGBEXERoRFxEWERkRFhEVERgRFREUERcRFBETERYRExESERUREgB1AWYREREUEREREBETERAPERIPDhERDg0REA0QzxC+EK0QnBCLEHoQaRBYEEdeI1ADRBTbPDAApQT8IIIQF99zmLqOnDDTHwGCEBffc5i68uCB0z/TD9QB0EMwbBPbPH/gIIIQebnkw7qOujDTHwGCEHm55MO68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdQB0EMwbBPbPH/gIIIQEPfA97rjAiCCEAlSkX26AHcAfgCFAI0B8jIRQxFFEUMRQhFEEUIRQRFFEUERQBFEEUARPxFFET8RPhFEET4RPRFFET0RPBFEETwROxFFETsROhFEEToRORFFETkROBFEETgRNxFFETcRNhFEETYRNRFFETURNBFEETQRMxFFETMRMhFEETIRMRFFETERMBFEETAAeAH8ES8RRREvES4RRBEuES0RRREtESwRRBEsESsRRRErESoRRBEqESkRRREpESgRRBEoEScRRREnESYRRBEmESURRRElESQRRBEkESMRRREjESIRRBEiESERRREhESARRBEgER8RRREfER4RRBEeER0RRREdERwRRBEcERsRRREbAHkB/BEaEUQRGhEZEUURGREYEUQRGBEXEUURFxEWEUQRFhEVEUURFREUEUQRFBETEUURExESEUQREhEREUUREREQEUQREA8RRQ8OEUQODRFFDQwRRAwLEUULChFECgkRRQkIEUQIBxFFBwYRRAYFEUUFBBFEBAMRRQMCEUQCARFFAQB6A/QRRNs82zyCAJVTVkXBZZRWRcIJkXDi8vRWRItlNldEZlZYEUURRxFFEUQRRhFEEUMRRRFDEUIRRBFCEUERQxFBARFCARE/EUERPxE+EUARPhE9ET8RPRE8ET4RPBE7ET0ROxE6ETwROhE5ETsRORE4EToROBE3ETkRNwDKAKIAewH8ETYROBE2ETURNxE1ETQRNhE0ETMRNREzETIRNBEyETERMxExETARMhEwES8RMREvES4RMBEuES0RLxEtESwRLhEsESsRLRErESoRLBEqESkRKxEpESgRKhEoEScRKREnESYRKBEmESURJxElESQRJhEkESMRJREjESIRJBEiAHwB/BEhESMRIREgESIRIBEfESERHxEeESARHhEdER8RHREcER4RHBEbER0RGxEaERwRGhEZERsRGREYERoRGBEXERkRFxEWERgRFhEVERcRFREUERYRFBETERURExESERQREhERERMREREQERIREA8REQ8OERAOEN8QzhC9EKwQmwB9ASIQihB5EGgQVxBGEDVEE9s8MAClAfIyEUMRRRFDEUIRRBFCEUERRRFBEUARRBFAET8RRRE/ET4RRBE+ET0RRRE9ETwRRBE8ETsRRRE7EToRRBE6ETkRRRE5ETgRRBE4ETcRRRE3ETYRRBE2ETURRRE1ETQRRBE0ETMRRREzETIRRBEyETERRRExETARRBEwAH8B/BEvEUURLxEuEUQRLhEtEUURLREsEUQRLBErEUURKxEqEUQRKhEpEUURKREoEUQRKBEnEUURJxEmEUQRJhElEUURJREkEUQRJBEjEUURIxEiEUQRIhEhEUURIREgEUQRIBEfEUURHxEeEUQRHhEdEUURHREcEUQRHBEbEUURGwCAAfwRGhFEERoRGRFFERkRGBFEERgRFxFFERcRFhFEERYRFRFFERURFBFEERQRExFFERMREhFEERIRERFFEREREBFEERAPEUUPDhFEDg0RRQ0MEUQMCxFFCwoRRAoJEUUJCBFECAcRRQcGEUQGBRFFBQQRRAQDEUUDAhFEAgERRQEAgQP0EUTbPNs8VzyCAOIPjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEVkXHBbPy9Iu1NldFRyZWFzdXJ5gRQxFFEUMRQhFEEUIRQRFDEUERQBFCEUARPxFBET8RPhFAET4RPRE/ET0ROxE9ETsROhE8EToAygCiAIIB/BE5ETsRORE4EToROBE3ETkRNxE2ETgRNhE1ETcRNRE0ETYRNBEzETURMxEyETQRMhExETMRMREwETIRMBEvETERLxEuETARLhEtES8RLREsES4RLBErES0RKxEqESwRKhEpESsRKREoESoRKBEnESkRJxEmESgRJhElEScRJQCDAfwRJBEmESQRIxElESMRIhEkESIRIREjESERIBEiESARHxEhER8RHhEgER4RHREfER0RHBEeERwRGxEdERsRGhEcERoRGREbERkRGBEaERgRFxEZERcRFhEYERYRFREXERURFBEWERQRExEVERMREhEUERIRERETEREREBESERAAhAFQDxERDw4REA4Q3xDOEL0QrBCbEIoQeRBoEFcQRhA1RABwUARxAds8MAClAUQw0x8BghAQ98D3uvLggdM/0w/TD9MP1AHQFRRDMGwV2zx/AIYB8jQRQxFHEUMRQhFGEUIRQRFFEUERQBFEEUARPxFHET8RPhFGET4RPRFFET0RPBFEETwROxFHETsROhFGEToRORFFETkROBFEETgRNxFHETcRNhFGETYRNRFFETURNBFEETQRMxFHETMRMhFGETIRMRFFETERMBFEETAAhwH8ES8RRxEvES4RRhEuES0RRREtESwRRBEsESsRRxErESoRRhEqESkRRREpESgRRBEoEScRRxEnESYRRhEmESURRRElESQRRBEkESMRRxEjESIRRhEiESERRREhESARRBEgER8RRxEfER4RRhEeER0RRREdERwRRBEcERsRRxEbAIgB/BEaEUYRGhEZEUURGREYEUQRGBEXEUcRFxEWEUYRFhEVEUURFREUEUQRFBETEUcRExESEUYREhEREUUREREQEUQREA8RRw8OEUYODRFFDQwRRAwLEUcLChFGCgkRRQkIEUQIBxFHBwYRRgYFEUUFBBFEBAMRRwMCEUYCARFFAQCJA/gRRNs82zxXN1c3VzeCAIbcVkSBAfS7llZDgQPou5Fw4pZWQoEBLLuRcOLy9FZDi8U2V0QW50aVdoYWxlgRQhFGEUIRQRFFEUERQBFEEUARPxFDET8RPhFCET4RPRFBET0RPBFAETwROxE/ETsROhE+EToRORE9ETkBETwBAMoAogCKAfQBETsBARE6ARE1ETkRNRE0ETgRNBEzETcRMxEyETYRMhExETURMREwETQRMBEvETMRLxEuETIRLhEtETERLREsETARLBErES8RKxEqES4RKhEpES0RKREoESwRKBEnESsRJxEmESoRJhElESkRJREkESgRJBEjEScRIwCLAfwRIhEmESIRIRElESERIBEkESARHxEjER8RHhEiER4RHREhER0RHBEgERwRGxEfERsRGhEeERoRGREdERkRGBEcERgRFxEbERcRFhEaERYRFREZERURFBEYERQRExEXERMREhEWERIREREVEREREBEUERAPERMPDhESDg0REQ0AjAFGDBEQDBC/EK4QnRCMEHsQahBZEEgQNxAmEEUQNEATcALbPDAApQR0jwgw2zxsFts8f+AgghAEkNYFuo6cMNMfAYIQBJDWBbry4IHTP9IA1AHQQzBsE9s8f+AgghAvsRwWugCOAI8AlgCdAD7THwGCEAlSkX268uCB0z/SAPoA0x/TB9QB0BYVFEMwAfI1EUMRSBFDEUIRRxFCEUERRhFBEUARRRFAET8RRBE/ET4RSBE+ET0RRxE9ETwRRhE8ETsRRRE7EToRRBE6ETkRSBE5ETgRRxE4ETcRRhE3ETYRRRE2ETURRBE1ETQRSBE0ETMRRxEzETIRRhEyETERRRExETARRBEwAJAB/BEvEUgRLxEuEUcRLhEtEUYRLREsEUURLBErEUQRKxEqEUgRKhEpEUcRKREoEUYRKBEnEUURJxEmEUQRJhElEUgRJREkEUcRJBEjEUYRIxEiEUURIhEhEUQRIREgEUgRIBEfEUcRHxEeEUYRHhEdEUURHREcEUQRHBEbEUgRGwCRAfwRGhFHERoRGRFGERkRGBFFERgRFxFEERcRFhFIERYRFRFHERURFBFGERQRExFFERMREhFEERIRERFIEREREBFHERAPEUYPDhFFDg0RRA0MEUgMCxFHCwoRRgoJEUUJCBFECAcRSAcGEUcGBRFGBQQRRQQDEUQDAhFIAgERRwEAkgP6EUbbPNs8VzFXMVcxVzJWQIulNldEJ1eWJhY2uHARQ5FxklZC4hFCEUcRQhFBEUYRQRFAEUURQBE/EUQRPxE+EUMRPhE9EUIRPRE8EUERPBE7EUAROxE6ET8ROhE5ET4RORE4ET0ROBE3ETwRNxE2ETsRNhE1EToRNQIROQIAygCiAJMB/BEzETgRMxEzETcRMxEzETYRMxEzETURMxEvETQRLxEuETMRLhEtETIRLREsETERLBErETARKxEqES8RKhEpES4RKREoES0RKBEnESwRJxEmESsRJhElESoRJREkESkRJBEjESgRIxEiEScRIhEhESYRIREgESURIBEfESQRHwCUAfwRHhEjER4RHREiER0RHBEhERwRGxEgERsRGhEfERoRGREeERkRGBEdERgRFxEcERcRFhEbERYRFREaERURFBEZERQRExEYERMREhEXERIREREWEREREBEVERAPERQPDhETDg0REg0MEREMCxEQCxCvEJ4QjRB8EGsQWhBJEDgAlQEUEFYQRVADBNs8MAClAfIyEUMRRRFDEUIRRBFCEUERRRFBEUARRBFAET8RRRE/ET4RRBE+ET0RRRE9ETwRRBE8ETsRRRE7EToRRBE6ETkRRRE5ETgRRBE4ETcRRRE3ETYRRBE2ETURRRE1ETQRRBE0ETMRRREzETIRRBEyETERRRExETARRBEwAJcB/BEvEUURLxEuEUQRLhEtEUURLREsEUQRLBErEUURKxEqEUQRKhEpEUURKREoEUQRKBEnEUURJxEmEUQRJhElEUURJREkEUQRJBEjEUURIxEiEUQRIhEhEUURIREgEUQRIBEfEUURHxEeEUQRHhEdEUURHREcEUQRHBEbEUURGwCYAfwRGhFEERoRGRFFERkRGBFEERgRFxFFERcRFhFEERYRFRFFERURFBFEERQRExFFERMREhFEERIRERFFEREREBFEERAPEUUPDhFEDg0RRQ0MEUQMCxFFCwoRRAoJEUUJCBFECAcRRQcGEUQGBRFFBQQRRAQDEUUDAhFEAgERRQEAmQP0EUTbPNs8VzZWQ4vVRvZ2dsZVRyYWRpbmeHARRpFxklZF4hFFEUcRRRFEEUYRRBFDEUURQxFCEUQRQhFBEUMRQRFAEUIRQBE/EUERPxE+EUARPhE9ET8RPRE8ET4RPBE7ET0ROxE6ETwROhE5ETsROQIROgIRNxE5ETcAygCiAJoB/BE2ETgRNhE1ETcRNRE0ETYRNBEzETURMxEyETQRMhExETMRMREwETIRMBEvETERLxEuETARLhEtES8RLREsES4RLBErES0RKxEqESwRKhEpESsRKREoESoRKBEnESkRJxEmESgRJhElEScRJREkESYRJBEjESURIxEiESQRIgCbAfwRIREjESERIBEiESARHxEhER8RHhEgER4RHREfER0RHBEeERwRGxEdERsRGhEcERoRGREbERkRGBEaERgRFxEZERcRFhEYERYRFREXERURFBEWERQRExEVERMREhEUERIRERETEREREBESERAPEREPDhEQDhDfEM4QvRCsEJsAnAEgEIoQeRBoEFcQRlADBds8MAClBPKOujDTHwGCEC+xHBa68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdQB0EMwbBPbPH/gIIIQKil5M7rjAiCCECiC8ei6jp8w0x8BghAogvHouvLggdM/0w/TB9QB0BRDMGwU2zx/4CCCEGkgk5+6AJ4ApgCnAK4B8jIRQxFFEUMRQhFEEUIRQRFFEUERQBFEEUARPxFFET8RPhFEET4RPRFFET0RPBFEETwROxFFETsROhFEEToRORFFETkROBFEETgRNxFFETcRNhFEETYRNRFFETURNBFEETQRMxFFETMRMhFEETIRMRFFETERMBFEETAAnwH8ES8RRREvES4RRBEuES0RRREtESwRRBEsESsRRRErESoRRBEqESkRRREpESgRRBEoEScRRREnESYRRBEmESURRRElESQRRBEkESMRRREjESIRRBEiESERRREhESARRBEgER8RRREfER4RRBEeER0RRREdERwRRBEcERsRRREbAKAB/BEaEUQRGhEZEUURGREYEUQRGBEXEUURFxEWEUQRFhEVEUURFREUEUQRFBETEUURExESEUQREhEREUUREREQEUQREA8RRQ8OEUQODRFFDQwRRAwLEUULChFECgkRRQkIEUQIBxFFBwYRRAYFEUUFBBFEBAMRRQMCEUQCARFFAQChA/wRRNs82zxXLIIAzxJWKvL0i8Um90YXRlT3JhY2xlgRQxFFEUMRQhFEEUIRQRFDEUERQBFCEUARPxFBET8RPhFAET4RPRE/ET0RPBE+ETwROxE9ETsROhE8EToRORE7ETkROBE6ETgRNxE5ETcRNhE4ETYRNRE3ETURNBE2ETQAygCiAKMAJFYqnoIA3+T4I1YjoVYkvvL03gH8ETMRNREzETIRNBEyETERMxExETARMhEwES8RMREvES4RMBEuES0RLxEtESsRLRErESoRLBEqESkRKxEpESgRKhEoEScRKREnESYRKBEmESURJxElESQRJhEkESMRJREjESIRJBEiESERIxEhESARIhEgER8RIREfER4RIBEeAKQB+BEdER8RHREcER4RHBEbER0RGxEaERwRGhEZERsRGREYERoRGBEXERkRFxEWERgRFhEVERcRFREUERYRFBETERURExESERQREhERERMREREQERIREA8REQ8OERAOEN8QzhC9EKwQmxCKEHkQaBBXEEYQNUQAcFAEcQHbPDAApQHMVyWBAQFWH0QU+CNEFBEnf3BwyFWA2zzJAhEdAgERIgFWHAEgbpUwWfRaMJRBM/QV4oEBAfgjIQMRHANWHVkhbpVbWfRaMJjIAc8AQTP0QuJWGqT4IxEiERsRHREbAREcAQIRGwIBAN0AkjDTHwGCECopeTO68uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDFXLFcsggCKq/hCVkIBxwXy9BEqESsRKn8RK38B8jMRQxFGEUMRQhFFEUIRQRFEEUERQBFGEUARPxFFET8RPhFEET4RPRFGET0RPBFFETwROxFEETsROhFGEToRORFFETkROBFEETgRNxFGETcRNhFFETYRNRFEETURNBFGETQRMxFFETMRMhFEETIRMRFGETERMBFFETAAqAH8ES8RRBEvES4RRhEuES0RRREtESwRRBEsESsRRhErESoRRREqESkRRBEpESgRRhEoEScRRREnESYRRBEmESURRhElESQRRREkESMRRBEjESIRRhEiESERRREhESARRBEgER8RRhEfER4RRREeER0RRBEdERwRRhEcERsRRREbAKkB/BEaEUQRGhEZEUYRGREYEUURGBEXEUQRFxEWEUYRFhEVEUURFREUEUQRFBETEUYRExESEUUREhEREUQREREQEUYREA8RRQ8OEUQODRFGDQwRRQwLEUQLChFGCgkRRQkIEUQIBxFGBwYRRQYFEUQFBBFGBAMRRQMCEUQCARFGAQCqAvwRRds8VylXPFc8ggDoQVYhs/L0ggDyGVZEwgmUVkTBZZFw4pRWQ8FlkXDi8vT4IxEmpIEBAfgjARFEgGR/yFUwUDSBAQHPAMhYzxbJAcyBAQHPAMoAyQIRJQIBEUMBViQBIG6VMFn0WjCUQTP0FeIRIqQRQBFDEUARPxFCET8AygCrAfwRPhFBET4RPRFAET0RPBE/ETwRPRE+ET0RPBE9ETwRORE8ETkROBE7ETgRNxE6ETcRNhE5ETYRNRE4ETURNBE3ETQRMxE2ETMRMhE1ETIRMRE0ETERMBEzETARLxEyES8RLhExES4RLREwES0RLBEvESwRKxEuESsRKhEtESoArAH0ESkRLBEpESgRKxEoEScRKhEnESURKRElEScRKBEnESQRJxEkESIRJhEiESURIREkESERIBEjESARHxEiER8RHhEhER4RHREgER0RHBEfERwRGxEeERsRGhEdERoRGREcERkRGBEbERgRFxEaERcRFhEZERYRFREYERUArQCGERQRFxEUERMRFhETERIRFRESERERFBERERARExEQDxESDw4REQ4NERANEM8QvhCtEJwQixB6EGkQWBBHEDZAFVAzBAT+jp8w0x8BghBpIJOfuvLggdM/+gDTH9IH0wdVQGwV2zx/4CCCENxjhQu6jqIw0x8BghDcY4ULuvLggdM/0wfTB9Mf1AHQFRRDMGwV2zx/4CCCENiQsD+6jqQw0x8BghDYkLA/uvLggdM/0weBAQHXANQB0AHTB1VAbBXbPH/gIACvAL4AxgDPAfARQxFIEUMRQhFHEUIRQRFGEUERQBFFEUARPxFEET8RPhFIET4RPRFHET0RPBFGETwROxFFETsROhFEEToRORFIETkROBFHETgRNxFGETcRNhFFETYRNRFEETURNBFIETQRMxFHETMRMhFGETIRMRFFETERMBFEETAAsAH8ES8RSBEvES4RRxEuES0RRhEtESwRRREsESsRRBErESoRSBEqESkRRxEpESgRRhEoEScRRREnESYRRBEmESURSBElESQRRxEkESMRRhEjESIRRREiESERRBEhESARSBEgER8RRxEfER4RRhEeER0RRREdERwRRBEcERsRSBEbALEB/BEaEUcRGhEZEUYRGREYEUURGBEXEUQRFxEWEUgRFhEVEUcRFREUEUYRFBETEUURExESEUQREhEREUgREREQEUcREA8RRg8OEUUODRFEDQwRSAwLEUcLChFGCgkRRQkIEUQIBxFIBwYRRwYFEUYFBBFFBAMRRAMCEUgCARFHAQCyA/4RRts8ESikgQEB+CMhBBEqBEEwARFHASFulVtZ9FowmMgBzwBBM/RC4lZFwAKWEUeBE4i8k1dHcOKOEFc7VjvBMpSAMlc83oBGETveVkTAA5RWRcJQkXDijhZXO1c/VjrCFJSAFFc73oAofxFAARE73lZEwAGUVkXBzpFw4uMAAMoAswC0ABJXO3BXQIBQETsC+BFEwAGUEUTB4pNXRHDiklYxkXDilVYwVjC+kXDimPgjVi2hVi++kXDikldB4w0RPhFDET4RPRFCET0RPBFBETwROxFAETsROhE/EToRORE+ETkROBE9ETgRNxE8ETcRNhE7ETYRNRE6ETURNBE5ETQRMxE4ETMRMhE3ETIAtQC8AfwRPxFEET8RPhFDET4RPRFCET0RPBFBETwROxFAETsROhE/EToRORE+ETkROBE9ETgRNxE8ETcRNhE7ETYRNRE6ETURNBE5ETQRMxE4ETMRMhE3ETIRMRE2ETERMBE1ETARLxE0ES8RLhEzES4RLREyES0RLBExESwRKxEwESsAtgH8ESoRLxEqESkRLhEpESgRLREoEScRLBEnESYRKxEmESURKhElEScRKREnESYRKBEmESIRJxEiESERJhEhESARJREgER8RJBEfER4RIxEeER0RIhEdERwRIREcERsRIBEbERoRHxEaERkRHhEZERgRHREYERcRHBEXERYRGxEWALcC9BEVERoRFREUERkRFBETERgRExESERcREhERERYREREQERUREA8RFA8OERMODRESDQwREQwLERALEK8QnhCNEHwQaxBaEEkQOEcVQBRQY9s8EScRQxEnAxFCAwIRQQIEEUAEESgRPxEoEScRPhEnAxE9AwIRPAIEETsEALgAugL0VzFwVjWBA+ioVkWAZKkEUhC8lzBWRIBkqQTeIMIAjhkRRVZFoRE9VkWgETBWRaARPRFFET0RMBE93hEvVjagETGk+CMicIBAyIIQmZmZmQHLHwERNwHLPwEROvoCAREy+gLJVkUEAxEyAwIROQIRNQEQJBAjbW3bPDAA5wC5ABgRMBE0ETARLREvES0B/BEoEToRKBEnETkRJwMROAMCETcCBBE2BBEoETURKBEnETQRJwMRMwMCETICBBExBBEoETARKBEnES8RJwMRLgMCES0CBBEsBBEoESsRKBEnESoRJwMRKQMCESgCBBEnBAIRJgIEESUEAxEkAxEjAREiAQIRIQIEESAEAxEfAwC7AIoRHgERHQECERwCBBEbBAMRGgMRGQERGAECERcCBBEWBAMRFQMRFAEREwECERICBBERBAMREANN7xBMEDtImhBHEDZERRMB/BExETYRMREwETURMBEvETQRLxEuETMRLhEtETIRLREsETERLBErETARKxEqES8RKhEpES4RKREoES0RKBEnESwRJxEmESsRJhElESoRJREkESkRJBEmESgRJhElEScRJREhESYRIREgESURIBEfESQRHxEeESMRHhEdESIRHQC9ANIRHBEhERwRGxEgERsRGhEfERoRGREeERkRGBEdERgRFxEcERcRFhEbERYRFREaERURFBEZERQRExEYERMREhEXERIREREWEREREBEVERAPERQPDhETDg0REg0MEREMCxEQCxCvVUlEMBIB9DRbEUMRRRFDEUIRRBFCEUERRRFBEUARRBFAET8RRRE/ET4RRBE+ET0RRRE9ETwRRBE8ETsRRRE7EToRRBE6ETkRRRE5ETgRRBE4ETcRRRE3ETYRRBE2ETURRRE1ETQRRBE0ETMRRREzETIRRBEyETERRRExETARRBEwAL8B/BEvEUURLxEuEUQRLhEtEUURLREsEUQRLBErEUURKxEqEUQRKhEpEUURKREoEUQRKBEnEUURJxEmEUQRJhElEUURJREkEUQRJBEjEUURIxEiEUQRIhEhEUURIREgEUQRIBEfEUURHxEeEUQRHhEdEUURHREcEUQRHBEbEUURGwDAAfwRGhFEERoRGRFFERkRGBFEERgRFxFFERcRFhFEERYRFRFFERURFBFEERQRExFFERMREhFEERIRERFFEREREBFEERAPEUUPDhFEDg0RRQ0MEUQMCxFFCwoRRAoJEUUJCBFECAcRRQcGEUQGBRFFBQQRRAQDEUUDAhFEAgERRQEAwQP4EUTbPIEBAfgjARFHgGRwyFUwUDSBAQHPAMhYzxbJAcyBAQHPAMoAyQIRJwIBEUYBViYBIG6VMFn0WjCUQTP0FeIRJKRWQ8ADjioRQ8ACnFc7ETumFBE7gDwRO94EEUIEAxFAAwIRPAIBETsBETQEESEEVSDjDRFBEUMRQQDKAMIAwwAmVyJXNFc6VzpXPVc+f3BwgGSAWgH0AhFCAhE/EUERPxE+EUARPhE9ET8RPQERPgERPRE6ETwROhE5ETsRORE4EToROBE3ETkRNxE2ETgRNhE1ETcRNQMRNgMRMxE1ETMRMhE0ETIRMREzETERMBEyETARLxExES8RLhEwES4RLREvES0RLBEuESwRKxEtESsAxAH4ESoRLBEqESkRKxEpESgRKhEoEScRKREnESYRKBEmESURJxElESMRJhEjESERJREhESIRJBEiBBEjBBEgESIRIBEfESERHxEeESARHhEdER8RHREcER4RHBEbER0RGxEaERwRGhEZERsRGREYERoRGBEXERkRFxEWERgRFgDFAIYRFREXERURFBEWERQRExEVERMREhEUERIRERETEREREBESERAPEREPDhEQDhDfEM4QvRCsEJsQihB5EGgQV0ZQE0RAAfI0EUMRRxFDEUIRRhFCEUERRRFBEUARRBFAET8RRxE/ET4RRhE+ET0RRRE9ETwRRBE8ETsRRxE7EToRRhE6ETkRRRE5ETgRRBE4ETcRRxE3ETYRRhE2ETURRRE1ETQRRBE0ETMRRxEzETIRRhEyETERRRExETARRBEwAMcB/BEvEUcRLxEuEUYRLhEtEUURLREsEUQRLBErEUcRKxEqEUYRKhEpEUURKREoEUQRKBEnEUcRJxEmEUYRJhElEUURJREkEUQRJBEjEUcRIxEiEUYRIhEhEUURIREgEUQRIBEfEUcRHxEeEUYRHhEdEUURHREcEUQRHBEbEUcRGwDIAfwRGhFGERoRGRFFERkRGBFEERgRFxFHERcRFhFGERYRFRFFERURFBFEERQRExFHERMREhFGERIRERFFEREREBFEERAPEUcPDhFGDg0RRQ0MEUQMCxFHCwoRRgoJEUUJCBFECAcRRwcGEUYGBRFFBQQRRAQDEUcDAhFGAgERRQEAyQP6EUTbPIIA0SBWSFYmvvL0ESikVkbAAZRXPldF4w6BAQH4IwIBEUQBEUd/yFUwUDSBAQHPAMhYzxbJAcyBAQHPAMoAyQIRJAIBEUIBViMBIG6VMFn0WjCUQTP0FeIRIaQRPxFDET8RPhFCET4RPRFBET0RPBFAETwROxE/ETsAygDLAMwAKIIAzND4QlYuAccF8vSBUdBWLPL0AOxWRsAClFc9V0WOXlZGwAOONFcsV0VwARFEyHIBywFwAcsAEsoHy//J0CDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IiOFxFGwASYVzIRMRFDETGSV0TiEUMRRBEq4hE7EUMROxEqETviETwRQxE8ETsRPBE7AfwRPRE+ET0RORE9ETkROBE8ETgRNxE7ETcRNhE6ETYRNRE5ETURNBE4ETQRMxE3ETMRMhE2ETIRMRE1ETERMBE0ETARLxEzES8RLhEyES4RLRExES0RLBEwESwRKxEvESsRKhEuESoRKREtESkRKBEsESgRJxErEScRJhEqESYAzQH0ESURKRElESYRKBEmESMRJxEjESERJhEhESURIBEkESARHxEjER8RHhEiER4RHREhER0RHBEgERwRGxEfERsRGhEeERoRGREdERkRGBEcERgRFxEbERcRFhEaERYRFREZERURFBEYERQRExEXERMREhEWERIREREVEREAzgBaERARFBEQDxETDw4REg4NERENDBEQDBC/EK4QnRCMEHsQahBZEEgQN0ZQRAMCBPqCEJ07jLG6jr0w0x8BghCdO4yxuvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6ANQB0BRDMGwU2zx/4CCCEAnSGxG6jpkw0x8BghAJ0hsRuvLggdM/1AHQEmwS2zx/4CCCEM/GbL264wIgghA8E0cougDQANkA4gDjAvAwMVYegQEBI1n0DW+hkjBt3yBukjBtjofQ2zxsGW8J4oFjviFus/L0gRiGISBu8tCAbykYXwizmyEgbvLQgG8pbIGzkXDi8vQRQhFGEUIRQRFFEUERQBFEEUARPxFDET8RPhFGET4RPRFFET0RPBFEETwROxFDETsA/wDRAfwROhFGEToRORFFETkROBFEETgRNxFDETcRNhFGETYRNRFFETURNBFEETQRMxFDETMRMhFGETIRMRFFETERMBFEETARLxFDES8RLhFGES4RLRFFES0RLBFEESwRKxFDESsRKhFGESoRKRFFESkRKBFEESgRJxFDEScRJhFGESYA0gH8ESURRRElESQRRBEkESMRQxEjESIRRhEiESERRREhESARRBEgER8RQxEfER4RRhEeER0RRREdERwRRBEcERsRQxEbERoRRhEaERkRRREZERgRRBEYERcRQxEXERYRRhEWERURRREVERQRRBEUERMRQxETERIRRhESERERRRERANMCxhEQEUQREA8RQw8OEUYODRFFDQwRRAwLEUMLChFGCgkRRQkIEUQIBxFDBwYRRgYFEUUFBBFEBAMRQwMCEUYCARFFARFEgSLUEURWR9s8ARFFAfL0VhiBAQFWSFn0DW+hkjBt3wE2ANQB2iBukjBtjiXQgQEB1wCBAQHXAIEBAdcA1AHQgQEB1wDSADAQJRAkECNsFW8F4nBTAW6zjhpbICBu8tCAbyUQNF8EASBu8tCAbyUQJF8EAZEy4lZHoFZEVh+ogScQqQSBAQEDpFMhuVZLVEQwUkAA1QL+yFVAUEWBAQHPABKBAQHPAIEBAc8AAciBAQHPABLKAMkBzMkCERwCE1ZKASBulTBZ9FowlEEz9BXiERoBvpkCEUYCV0RXRDDjDRE/EUMRPxE+EUIRPhE9EUERPRE8EUARPBE7ET8ROxE6ET4ROhE5ET0RORE4ETwROBE3ETsRNwDWANcBlhFEIG7y0IBvKVsQVhBGEDYQJoEBAUd3f3DIVYDbPMkDERwDEgERRwEgbpUwWfRaMJRBM/QV4gERFQERQ6ARGBFDERgRGBFCERgRFADdAfwRNhE6ETYRNRE5ETURNBE4ETQRMxE3ETMRMhE2ETIRMRE1ETERMBE0ETARLxEzES8RLhEyES4RLRExES0RLBEwESwRKxEvESsRKhEuESoRKREtESkRKBEsESgRJxErEScRJhEqESYRJREpESURJBEoESQRIxEnESMRIhEmESIA2AD8ESERJREhESARJBEgER8RIxEfER4RIhEeER0RIREdERwRIBEcERsRHxEbERoRHhEaERkRHREZERgRHBEYERcRGxEXERYRGhEWERURGREVERQRGBEUERMRFxETERIRFhESERERFRERERARFBEQDxETDw4REg4NERENDBEQDFU7AuwwggCKq/hCVkQBxwXy9FYdgQEBIln0DW+hkjBt3yBukjBtjofQ2zxsGW8J4oFjviFus/L0EUIRRRFCEUERRBFBEUARQxFAET8RRRE/ET4RRBE+ET0RQxE9ETwRRRE8ETsRRBE7EToRQxE6ETkRRRE5ETgRRBE4AP8A2gH8ETcRQxE3ETYRRRE2ETURRBE1ETQRQxE0ETMRRREzETIRRBEyETERQxExETARRREwES8RRBEvES4RQxEuES0RRREtESwRRBEsESsRQxErESoRRREqESkRRBEpESgRQxEoEScRRREnESYRRBEmESURQxElESQRRREkESMRRBEjANsB/BEiEUMRIhEhEUURIREgEUQRIBEfEUMRHxEeEUURHhEdEUQRHREcEUMRHBEbEUURGxEaEUQRGhEZEUMRGREYEUURGBEXEUQRFxEWEUMRFhEVEUURFREUEUQRFBETEUMRExESEUUREhEREUQREREQEUMREA8RRQ8OEUQODRFDDQDcA/QMEUUMCxFECwoRQwoJEUUJCBFECAcRQwcGEUUGBRFEBQQRQwQDEUUDAhFEAgERQwERRYEi1BFFVkTbPAERRgHy9IFZxVZGIG7y0IBvKWyBs/L0EUUgbvLQgG8pMBBHEDaBAQF/J1FaBRBKWhrIVYDbPMkDER4DARFGAQE2AN0A3gBuUImBAQHPABaBAQHPAMhQBc8WyVAEzBKBAQHPAAHIgQEBzwDIUAPPFslYzBLKABLKABLKAMkBzAH+IG6VMFn0WjCUQTP0FeKLZTZXRGZWWFZEAfkBAfkBupRXPVdCjjSL1Ub2dnbGVUcmFkaW5ngBEUQB+QEB+QG6mlc0ERnDABEzERmSVxriERkRQREZERkROxEZ4hFAEUMRQBE/EUIRPxE+EUERPhE9EUARPRE8ET8RPBEZET4RGQDfAfwROhE9EToRORE8ETkROBE7ETgRNxE6ETcRNhE5ETYRNRE4ETURNBE3ETQRMxE2ETMRMhE1ETIRMRE0ETERMBEzETARLxEyES8RLhExES4RLREwES0RLBEvESwRKxEuESsRKhEtESoRKREsESkRKBErESgRJxEqEScRJhEpESYA4AH8ESURKBElESQRJxEkESMRJhEjESIRJREiESERJBEhESARIxEgER8RIhEfER4RIREeER0RIBEdERwRHxEcERsRHhEbERoRHREaERoRHBEaERgRGxEYERcRGhEXERYRGREWERURGBEVERQRFxEUERMRFhETERIRFRESERERFBERAOEALhEQERMREA8REg8OEREODREQDRDPVSsSAIww0x8BghDPxmy9uvLggfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgxVz2CAIqr+EJWQwHHBfL0gWRtViuz8vR/AvSObDDTHwGCEDwTRyi68uCB0w/TB9MP0w/TD1VAbBVXPFc8VzxXP1c/ggCKq/hCVkMBxwXy9IFkbVYrs/L0ggCG3FY/wWWUVj7BZZFw4pZWOoEB9LuRcOKWVjmBA+i7kXDillY4gQEsu5Fw4vL0f+AgghDxgi2huuMCIADkAOUAVDDTHwGCEPGCLaG68uCB0gABMVc3ggCKq/hCVkMBxwXy9IFkbVYrs/L0fwL4ghCDuBRKuo44MNMfAYIQg7gUSrry4IHSAPoA0x/TB1UwbBRXNVc1VzVXNoIAiqv4QlZDAccF8vSBZG1WK7Py9H/gIIIQlGqYtrqOqDDTHwGCEJRqmLa68uCB0z8BMcgBghCv+Q9XWMsfyz/J+EIBcG3bPH/gwACRMOMNcADmAOkBPG1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8MADnAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CADoAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAtj5ASCC8OW19yQgrYUDCHOhxBPzJTZZGJ4yUwluvY2XRGULQom9uo4VMFdCgTjG+EJWQgHHBfL0cBFCf9sx4CCC8IeCQDfwAVaPHrE28h5doQLQ7DOcOKeYgt3M/8xzi7Jiuo6GMNs8f9sx4CAA6gDwAfKCAIqr+EJWQwHHBfL0EUIRQxFCEUERQxFBEUARQxFAET8RQxE/ET4RQxE+ET0RQxE9ETwRQxE8ETsRQxE7EToRQxE6ETkRQxE5ETgRQxE4ETcRQxE3ETYRQxE2ETURQxE1ETQRQxE0ETMRQxEzETIRQxEyETERQxExAOsB/BEwEUMRMBEvEUMRLxEuEUMRLhEtEUMRLREsEUMRLBErEUMRKxEqEUMRKhEpEUMRKREoEUMRKBEnEUMRJxEmEUMRJhElEUMRJREkEUMRJBEjEUMRIxEiEUMRIhEhEUMRIREgEUMRIBEfEUMRHxEeEUMRHhEdEUMRHREcEUMRHADsAvoRGxFDERsRGhFDERoRGRFDERkRGBFDERgRFxFDERcRFhFDERYRFRFDERURFBFDERQRExFDERMREhFDERIRERFDEREREBFDERAPEUMPDhFDDg0RQw0MEUMMCxFDCwoRQwoJEUMJEUMIBwZVQIFo9BFE2zxXJFcqVypXKhEgswFKAO0B+AERQQHy9HBwVj4RQRFCEUERQBFBEUARPxFAET8RPhE/ET4RPRE+ET0RPBE9ETwROxE8ETsROhE7EToRORE6ETkROBE5ETgRNxE4ETcRNhE3ETYRNRE2ETURNBE1ETQRMxE0ETMRMhEzETIRMREyETERMBExETARLxEwES8A7gH2ES4RLxEuES0RLhEtESwRLREsESsRLAIRKgIBESkBEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEicBEjESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbERoRGxEaERkRGhEZAO8ApBEYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA8Q7xDeEM0QvBCrEJoQiRB4EGcQVhQVQzABzoLwbI9E9F/ttM3+1N6NsUqlsTrVXUMPdZ0GaSELdMSP49+6jhwwVyNXNYIAiqv4QlZBAccF8vRwfxE2AREjf9sx4ILwbI/r7ZDhY52eM9RJ5gmNtY8RAYBI5Y7JIcylHimy+ue64wIA8QA8ggCKq/hCVkMBxwXy9IIArpdWK7Py9BErsxErf9sxAfTI+EMBzH8BygARRBFDEUIRQRFAET8RPhE9ETwROxE6ETkROBE3ETYRNRE0ETMRMhExETARLxEuES0RLBErESoRKREoEScRJhElESQRIxEiESERIBEfER4RHREcERsRGhEZERgRFxEWERURFBETERIREREQVeDbPMntVADzAfYBEUQBEUP6AgERQQHKAAERPyDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgERPQHMETvIzAEROgHLDwEROAHLBwERNiDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgERNPoCAREy+gIBETAByw8BES4Byw8A9AH8AREsAcsPAREqAcoAAREoAcoAAREm+gIBEST6AgERIgHLHwERIAHLBxEeyIEBAc8AAREdAYEBAc8AAREb+gIBERn6AsgBERgg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBERYBygABERQBygABERIBgQEBzwABERABAPUB+oEBAc8AHvQAHPQACsiBAQHPABnLBxfKABXLHxOBAQHPAMsfgQEBzwDLH8sP9AACyIEBAc8AE/QAE/QAUAP6AhPKABPLD1AE+gIUyx8U9ABQBfoCUAX6AhXKABXLDwXI9AAWygBQBvoCUAb6Ahb0ABbKAFAG+gIWyx8WywcWAPYAaIEBAc8AF4EBAc8AyFAI+gIY9AAZgQEBzwAX9ADJUATMyVjMyVADzMlQBMzJWMzJWMzJAcwCASAA+AEiAgEgAPkBDAIBIAD6AQQCASAA+wEAAvmy2TbPBFDEUQRQxFCEUMRQhFBEUIRQRFAEUERQBE/EUARPxE+ET8RPhE9ET4RPRE8ET0RPBE7ETwROxE6ETsROhE5EToRORE4ETkROBE3ETgRNxE2ETcRNhE1ETYRNRE0ETURNBEzETQRMxEyETMRMhExETIRMREwETERMIAFUAPwB/BEvETARLxEuES8RLhEtES4RLREsES0RLBErESwRKxEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIBEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGwD9AeQRGhEbERoRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ7bPFcQXw9XEF8PVxBfD1cQXw9sQSBukjBtmSBu8tCAbylvCeIgbpIwbd4A/gE8gQEBVh4CWfQNb6GSMG3fIG6SMG2Oh9DbPGwZbwniAP8AXIEBAdcAgQEB1wDUAdABgQEB1wDUAdCBAQHXANQB0AHSANIA0gAwEFkQWBBXEFYC+bP19s8EUMRRBFDEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwgAVQBAQH8ES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbAQIBuBEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBAQMALoEBASBWKlAzQTP0DG+hlAHXADCSW23iAgFqAQUBBwIgqWTbPNs8bOds52znbOdsxwFUAQYADlR5h1R5hykC9KkKINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiNs8EUMRRBFDEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1AVQBCAH8ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgAQkC9BEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGxEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBAQoBCwB8gQELLAJZ9AtvoZIwbd8gbpIwbY4o0IEBAdcAgQEB1wCBAQHXANQB0IEBAdcAgQEB1wAwECUQJBAjbBVvBeIALCBukjBtmSBu8tCAbyVvBeIgbpIwbd4CASABDQEXAgFIAQ4BEwIBIAEPARECMKvt2zzbPFcQXw9XEF8PVxBfD1cQXw9sQQFUARAABFY2AiyrBts82zxsmWyZbJlsmWyZbJlsmWxZAVQBEgAkVipWI1YjViNWI1YjViNWH1YjAvmvTm2eCKGIogihiKEIoYihCKCIoQigiKAIoIigCJ+IoAifiJ8In4ifCJ6InwieiJ4InoieCJ2IngidiJ0InYidCJyInQiciJwInIicCJuInAibiJsIm4ibCJqImwiaiJoImoiaCJmImgiZiJkImYiZCJiImQiYiJgImIiYQAFUARQB/BEvETARLxEuES8RLhEtES4RLREsES0RLBErESwRKxEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIBEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGwEVAbgRGhEbERoRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ7bPFcQXw9XEF8PVxBfD1cQXw9sQQEWAByBAQEiAln0DG+hkjBt3wIBIAEYASACASABGQEbAi2tde2ebZ42RDZENkQ2RDZENkQ2RDZkQAFUARoAKoBkVj6hVj8BVj8BVjxWPFY8VkFWQQL1rcEQa6TAgIXdeXBEEGuFhRBAgn/deWhEwYTdeXBEbZ4IoYiiCKGIoQihiKEIoIihCKCIoAigiKAIn4igCJ+InwifiJ8InoifCJ6IngieiJ4InYieCJ2InQidiJ0InIidCJyInAiciJwIm4icCJuImwibiJsImoibCJrAAVQBHAH8ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgAR0C9BEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGxEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBAR4BHwCQgQELVhACWfQLb6GSMG3fIG6SMG2OMdD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcAgQEB1wBVIGwTbwPiACwgbpIwbZkgbvLQgG8jbwPiIG6SMG3eAjGw3rbPNs8VxBfD1cQXw9XEF8PVxBfD2xBgAVQBIQAEViMCASABIwEuAgEgASQBLAIBWAElASoC9a28kGukwICF3XlwRBBrhYUQQIJ/3XloRMGE3XlwRG2eCKGIogihiKEIoYihCKCIoQigiKAIoIigCJ+IoAifiJ8In4ifCJ6InwieiJ4InoieCJ2IngidiJ0InYidCJyInQiciJwInIicCJuInAibiJsIm4ibCJqImwiawAFUASYB/BE0ETURNBEzETQRMxEyETMRMhExETIRMREwETERMBEvETARLxEuES8RLhEtES4RLREsES0RLBErESwRKxEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIAEnAfQRHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsRGhEbERoRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ7bPFcQXw9XEF8PVxBfD1cQXw9sQQEoAZD4Q/goEts8cFnIcAHLAXMBywFwAcsAEszMyfkAyHIBywFwAcsAEsoHy//J0CDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBKQDWAtD0BDBtAYFuowGAEPQPb6Hy4IcBgW6jIgKAEPQXyAHI9ADJAcxwAcoAQANZINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskCIa8W7Z5tnjZ6tnq2erZ6tkLAAVQBKwAUVkNWQ1ZDVkNWQwIxtuKbZ5tniuIL4eriC+Hq4gvh6uIL4e2IMAFUAS0BBNs8AUoCASABLwE+AgEgATABNwIBIAExATIAEa1fdqJoaQAAwAL5rA3tngihiKIIoYihCKGIoQigiKEIoIigCKCIoAifiKAIn4ifCJ+InwieiJ8InoieCJ6IngidiJ4InYidCJ2InQiciJ0InIicCJyInAibiJwIm4ibCJuImwiaiJsImoiaCJqImgiZiJoImYiZCJmImQiYiJkImIiYCJiImEABVAEzAfwRLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsBNAG4ERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEBNQEE2zwBNgBSgQEBIFYdUDNBM/QMb6GUAdcAMJJbbeIgbpIwcOD4IwEgbvLQgKFWH7kCASABOAE6Ai2v3O2ebZ42TLZMtky2TLZMtky2TLYswAFUATkAJFY1VjVWNVY1VjVWNVY1VjVWNQL5rrxtngihiKIIoYihCKGIoQigiKEIoIigCKCIoAifiKAIn4ifCJ+InwieiJ8InoieCJ6IngidiJ4InYidCJ2InQiciJ0InIicCJyInAibiJwIm4ibCJuImwiaiJsImoiaCJqImgiZiJoImYiZCJmImQiYiJkImIiYCJiImEABVAE7AfwRLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESARHxEgER8RHhEfER4RHREeER0RHBEdERwRGxEcERsBPAHkERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEgbpIwbZkgbvLQgG8lbwXiIG6SMG3eAT0AeIEBAVYbAln0DW+hkjBt3yBukjBtjiXQgQEB1wCBAQHXAIEBAdcA1AHQgQEB1wDSADAQJRAkECNsFW8F4gIBIAE/AUMC+bIz9s8EUMRRBFDEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwgAVQBQAH8ES8RMBEvES4RLxEuES0RLhEtESwRLREsESsRLBErESoRKxEqESkRKhEpESgRKREoEScRKBEnESYRJxEmESURJhElESQRJREkESMRJBEjESIRIxEiESERIhEhESARIREgER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbAUEB5BEaERsRGhEZERoRGREYERkRGBEXERgRFxEWERcRFhEVERYRFREUERURFBETERQRExESERMREhERERIREREQEREREA8REA9VDts8VxBfD1cQXw9XEF8PVxBfD2xBIG6SMG2ZIG7y0IBvJG8E4iBukjBt3gFCAFyBAQFWKAJZ9A1voZIwbd8gbpIwbY4X0IEBAdcA1AHQAYEBAdcA0gBVMGwUbwTiAgEgAUQBUwIBZgFFAU4CJ6PLbPNs8bKpsqmyqbKpsqmyqbIqAVQBRgHwVixWLFYsVixWLFZDVi5WLFYnEUMRTBFDEUIRSxFCEUERShFBEUARSRFAET8RSBE/ET4RRxE+ET0RRhE9ETwRRRE8ETsRRBE7EToRTBE6ETkRSxE5ETgRShE4ETcRSRE3ETYRSBE2ETURRxE1ETQRRhE0ETMRRREzAUcB/BEyEUQRMhExEUwRMREwEUsRMBEvEUoRLxEuEUkRLhEtEUgRLREsEUcRLBErEUYRKxEqEUURKhEpEUQRKREoEUwRKBEnEUsRJxEmEUoRJhElEUkRJREkEUgRJBEjEUcRIxEiEUYRIhEhEUURIREgEUQRIBEfEUwRHxEeEUsRHgFIAfgRHRFKER0RHBFJERwRGxFIERsRGhFHERoRGRFGERkRGBFFERgRFxFEERcRFhFMERYRFRFLERURFBFKERQRExFJERMREhFIERIRERFHEREREBFGERAPEUUPDhFEDg0RTA0MEUsMCxFKCwoRSQoJEUgJCBFHCAcRRgcGEUUGAUkC/AURRAUEEUwEAxFLAwIRSgIBEUkBEUjbPAkRSAkIEUcIBxFGBwYRRQYFEU0FBBFMBAMRSwMCEUoCARFJARFEEU0RRBFDEUwRQxFCEUsRQhFBEUoRQRFAEUkRQBE/EUgRPxE+EUcRPhE9EUYRPRE8EUURPBE7EUQROxE6EUMROgFKAUsAEPgjViChViG7AfwRORFCETkROBFBETgRNxFAETcRNhE/ETYRNRE+ETURNBE9ETQRMxE8ETMRMhE7ETIRMRE6ETERMBE5ETARLxE4ES8RLhE3ES4RLRE2ES0RLBE1ESwRKxE0ESsRKhEzESoRKREyESkRKBExESgRJxEwEScRJhEvESYRJREuESUBTAH8ESQRLREkESMRLBEjESIRKxEiESERKhEhESARKREgER8RKBEfER4RJxEeER0RJhEdERwRJREcERsRJBEbERoRIxEaERkRIhEZERgRIREYERcRIBEXERYRHxEWERURHhEVERQRHREUERMRHBETERIRGxESERERGhERERARGREQAU0AMA8RGA8OERcODREWDQwRFQwLERQLChETCgLzoQyDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjbPBFDEUQRQxFCEUMRQhFBEUIRQRFAEUERQBE/EUARPxE+ET8RPhE9ET4RPRE8ET0RPBE7ETwROxE6ETsROhE5EToRORE4ETkROBE3ETgRNxE2ETcRNhE1ETYRNYBVAFPAfwRNBE1ETQRMxE0ETMRMhEzETIRMREyETERMBExETARLxEwES8RLhEvES4RLREuES0RLBEtESwRKxEsESsRKhErESoRKREqESkRKBEpESgRJxEoEScRJhEnESYRJREmESURJBElESQRIxEkESMRIhEjESIRIREiESERIBEhESABUAL0ER8RIBEfER4RHxEeER0RHhEdERwRHREcERsRHBEbERoRGxEaERkRGhEZERgRGREYERcRGBEXERYRFxEWERURFhEVERQRFREUERMRFBETERIRExESEREREhERERAREREQDxEQD1UO2zxXEF8PVxBfD1cQXw9XEF8PbEEBUQFSAG6BAQtWFQJZ9AtvoZIwbd8gbpIwbY4g0IEBAdcAgQEB1wCBAQHXANQB0IEBAdcAMBRDMGwUbwTiACwgbpIwbZkgbvLQgG8kbwTiIG6SMG3eAiGtv+2ebZ42erZ6tnq2erZCwAFUAV8CgO1E0NQB+GPSAAHjAvgo1wsKgwm68uCJ+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHU1FUgA9FY2zwBVQFbAvjbPFdEEUIRQxFCEUERQhFBEUARQRFAET8RQBE/ET4RPxE+ET0RPhE9ETwRPRE8ETsRPBE7EToROxE6ETkROhE5ETgRORE4ETcROBE3ETYRNxE2ETURNhE1ETQRNRE0ETMRNBEzETIRMxEyETERMhExETARMREwES8RMBEvAVYBWQHu+gDSAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1NQB0NTTD9MH+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6APoA0w/TD9MP0gDSAPoA+gDTH9MH1DDQgQEB1wCBAQHXAPoA+gDUMNABVwH++kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHSANIAgQEB1wCBAQHXAPQE9ATUMNCBAQHXANMH0gDTH4EBAdcA0x+BAQHXANMf0w/0BNQw0IEBAdcA9AT0BPoA0gDTD/oA0x/0BPoA+gDSANMP1DDQ9ATSAPoA+gD0BAFYAHLSAPoA0x/TB4EBAdcAgQEB1wDUMND6APQEgQEB1wD0BDARQBFEEUARQBFDEUARQBFCEUARQBFBEUAB/BEuES8RLhEtES4RLREsES0RLBErESwRKxEqESsRKhEpESoRKREoESkRKBEnESgRJxEmEScRJhElESYRJREkESURJBEjESQRIxEiESMRIhEhESIRIREgESERIBEfESARHxEeER8RHhEdER4RHREcER0RHBEbERwRGxEaERsRGgFaAIQRGREaERkRGBEZERgRFxEYERcRFhEXERYRFREWERURFBEVERQRExEUERMREhETERIRERESEREREBERERAPERAPVQ4B7m1tbW1tbW1tbW1wfy6AHoAyVhFTVYBkgQEsgA9/fyWCElQL5ACBDhBUdyJTAHBwVHIigEtwgVRgI4IICTqA+COCAVGAgQPoU0R/gQfQghgXSHboAIIIJ40AU0R/Vhp/UzN/ghA7msoAVhBWLXH4I1NmETYRQxE2AVwB/BE1EUIRNRE0EUERNBE1EUARNRE0ET8RNBEzET4RMxEyET0RMhExETwRMREwETsRMBEvEToRLxEuETkRLhEtETgRLREsETcRLBErETYRKxEqETURKhEpETQRKREoETMRKBEnETIRJxEmETERJhElETARJREkES8RJBEjES4RIwFdAfwRIhEtESIRKxEsESsRIRErESERIBEqESARHxEpER8RHhEoER4RIBEnESARHxEmER8RHRElER0RHBEkERwRGxEjERsRGhEiERoRGREhERkRGBEgERgRFxEfERcRFhEeERYRFREdERURFhEcERYRFBEbERQRGBEaERgRFxEZERcBXgCOERMRGBETERIRFxESERERFhERERARFREQDxEUDxEQERMREA4REg4NERENDBEQDBC/EN4QrRCcEIsQihB5EGgQVxBGEDVEAwIAFFYXVhdWF1YXVhacltd1');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initQuasarMaster_init_args({ $$type: 'QuasarMaster_init_args', owner, content, walletCode })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const QuasarMaster_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    11: { message: `'Unknown' error` },
    12: { message: `Fatal error` },
    13: { message: `Out of gas error` },
    14: { message: `Virtualization error` },
    32: { message: `Action list is invalid` },
    33: { message: `Action list is too long` },
    34: { message: `Action is invalid or not supported` },
    35: { message: `Invalid source address in outbound message` },
    36: { message: `Invalid destination address in outbound message` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    39: { message: `Outbound message does not fit into a cell after rewriting` },
    40: { message: `Cannot process a message` },
    41: { message: `Library reference is null` },
    42: { message: `Library change action error` },
    43: { message: `Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree` },
    50: { message: `Account state size exceeded limits` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    1425: { message: `No tickets` },
    2526: { message: `Only AI` },
    4173: { message: `Self referral` },
    6278: { message: `Closed` },
    8660: { message: `Insufficient` },
    8916: { message: `Window closed` },
    10363: { message: `Unauthorized burn` },
    11836: { message: `Invalid fee source` },
    13478: { message: `Minting off` },
    14534: { message: `Not owner` },
    20944: { message: `AI disabled` },
    21101: { message: `Already registered` },
    21245: { message: `Insufficient stake` },
    22981: { message: `Done` },
    25219: { message: `Lock active` },
    25390: { message: `Buyback off` },
    25534: { message: `Not found` },
    25709: { message: `AI controls` },
    26156: { message: `Below min` },
    26868: { message: `AI alive` },
    28115: { message: `No stake` },
    30245: { message: `No vesting` },
    31786: { message: `Pool low` },
    34524: { message: `Limits` },
    35499: { message: `Only owner` },
    38227: { message: `Fee 0.10%-1.00%` },
    40072: { message: `Pool empty` },
    40372: { message: `Max tx exceeded` },
    41094: { message: `Already exists` },
    42340: { message: `Too early` },
    43719: { message: `Staking off` },
    44027: { message: `Referral off` },
    44695: { message: `Disable autonomy first` },
    44799: { message: `Nothing to claim` },
    45605: { message: `Lottery off` },
    49729: { message: `Unauthorized` },
    52432: { message: `Only AI oracle` },
    52497: { message: `Cliff not reached` },
    53010: { message: `No autonomy` },
    53536: { message: `Low confidence` },
    55849: { message: `Cooldown` },
    57292: { message: `Trading off` },
    57316: { message: `AI cooldown` },
    57784: { message: `No rewards` },
    57871: { message: `Invalid` },
    59457: { message: `Paused` },
    61977: { message: `Range` },
}

const QuasarMaster_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
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
    {"name":"QuasarMaster$Data","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"mintable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeBurnShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"treasury","type":{"kind":"simple","type":"address","optional":false}},{"name":"totalBurned","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalFeesCollected","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"maxTxBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"maxWalletBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"cooldownSeconds","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"tradingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"buybackPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackThreshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"buybackCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"buybackBurnPercent","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lastBuybackTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalBuybacks","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"totalQsrBurnedViaBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalTonSpentOnBuyback","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"aiOracle","type":{"kind":"simple","type":"address","optional":false}},{"name":"aiEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiFullAutonomy","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lastRebalanceTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"signalCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceHistory","type":{"kind":"dict","key":"int","value":"int"}},{"name":"anomalyLog","type":{"kind":"dict","key":"int","value":"AIRecommendation","valueFormat":"ref"}},{"name":"anomalyIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"minConfidence","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"emergencyPause","type":{"kind":"simple","type":"bool","optional":false}},{"name":"aiActionCooldown","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastAiActionTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"heartbeatTimeout","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastHeartbeat","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"ownerOverrideWindow","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"vetoThresholdBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"aiActionLog","type":{"kind":"dict","key":"int","value":"AIActionLog","valueFormat":"ref"}},{"name":"aiActionIndex","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pendingAiActions","type":{"kind":"dict","key":"int","value":"int"}},{"name":"vetoLog","type":{"kind":"dict","key":"int","value":"VetoState","valueFormat":"ref"}},{"name":"totalVetoStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"stakingApyBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"stakingMinStake","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingLockPeriod","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"stakers","type":{"kind":"dict","key":"address","value":"StakeInfo","valueFormat":"ref"}},{"name":"totalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"stakingRewardsPool","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"referralEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"referralRewardBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"referrals","type":{"kind":"dict","key":"address","value":"ReferralInfo","valueFormat":"ref"}},{"name":"vestingEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"teamAllocation","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"teamClaimed","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"vestingSchedules","type":{"kind":"dict","key":"address","value":"VestingInfo","valueFormat":"ref"}},{"name":"lotteryEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"lotteryTicketPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryDrawInterval","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lotteryJackpotShare","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"lotteryRound","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryLastDraw","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryJackpot","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lotteryTickets","type":{"kind":"dict","key":"int","value":"address"}},{"name":"lotteryTicketCount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lotteryWinners","type":{"kind":"dict","key":"int","value":"address"}}]},
    {"name":"QuasarWallet$Data","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"lastTxTime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
]

const QuasarMaster_getters: ABIGetter[] = [
    {"name":"get_jetton_data","arguments":[],"returnType":{"kind":"simple","type":"JettonData","optional":false}},
    {"name":"get_wallet_address","arguments":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"get_ai_state","arguments":[],"returnType":{"kind":"simple","type":"AIState","optional":false}},
    {"name":"get_autonomy_state","arguments":[],"returnType":{"kind":"simple","type":"AutonomyState","optional":false}},
    {"name":"get_fee_config","arguments":[],"returnType":{"kind":"simple","type":"FeeConfig","optional":false}},
    {"name":"get_buyback_state","arguments":[],"returnType":{"kind":"simple","type":"BuybackState","optional":false}},
    {"name":"get_staking_config","arguments":[],"returnType":{"kind":"simple","type":"StakingConfig","optional":false}},
    {"name":"get_stake_info","arguments":[{"name":"staker","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"StakeInfo","optional":true}},
    {"name":"get_referral_info","arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"ReferralInfo","optional":true}},
    {"name":"get_vesting_info","arguments":[{"name":"beneficiary","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"VestingInfo","optional":true}},
    {"name":"get_lottery_config","arguments":[],"returnType":{"kind":"simple","type":"LotteryConfig","optional":false}},
    {"name":"get_lottery_winner","arguments":[{"name":"round","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"get_ai_action","arguments":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"AIActionLog","optional":true}},
    {"name":"get_veto_state","arguments":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"VetoState","optional":true}},
    {"name":"get_ai_recommendation","arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"AIRecommendation","optional":true}},
    {"name":"get_price_at","arguments":[{"name":"timestamp","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":true,"format":257}},
    {"name":"is_paused","arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"is_trading_enabled","arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"is_ai_alive","arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"can_owner_override","arguments":[{"name":"actionId","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
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
    {"receiver":"internal","message":{"kind":"typed","type":"SetTreasury"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetFeeConfig"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ToggleTrading"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetBuybackConfig"}},
    {"receiver":"internal","message":{"kind":"text","text":"Resume"}},
    {"receiver":"internal","message":{"kind":"text","text":"Toggle AI"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class QuasarMaster implements Contract {
    
    static async init(owner: Address, content: Cell, walletCode: Cell) {
        return await QuasarMaster_init(owner, content, walletCode);
    }
    
    static async fromInit(owner: Address, content: Cell, walletCode: Cell) {
        const init = await QuasarMaster_init(owner, content, walletCode);
        const address = contractAddress(0, init);
        return new QuasarMaster(address, init);
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
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Mint | BurnNotification | 'Stop Minting' | FeeTransfer | TriggerBuyback | Stake | Unstake | ClaimRewards | SetStakingConfig | RegisterReferral | SetReferralConfig | AddVesting | ClaimVested | TriggerLottery | SetLotteryConfig | AIGrantFullAutonomy | AIHeartbeat | AIEmergencyPause | AISetFee | AISetTreasuryDirect | AISetAntiWhale | AISetBuybackDirect | AIToggleTrading | AIRotateOracle | AISetOracle | AIRebalance | AIPriceSignal | AIAnomalyAlert | AIGovernanceProposal | AIVetoVote | OwnerOverride | 'Claim AI Control' | SetTreasury | SetFeeConfig | ToggleTrading | SetBuybackConfig | 'Resume' | 'Toggle AI' | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'BurnNotification') {
            body = beginCell().store(storeBurnNotification(message)).endCell();
        }
        if (message === 'Stop Minting') {
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
        if (message === 'Claim AI Control') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
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
        if (message === 'Resume') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message === 'Toggle AI') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetJettonData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_jetton_data', builder.build())).stack;
        const result = loadGetterTupleJettonData(source);
        return result;
    }
    
    async getGetWalletAddress(provider: ContractProvider, owner: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(owner);
        let source = (await provider.get('get_wallet_address', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getGetAiState(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_ai_state', builder.build())).stack;
        const result = loadGetterTupleAIState(source);
        return result;
    }
    
    async getGetAutonomyState(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_autonomy_state', builder.build())).stack;
        const result = loadGetterTupleAutonomyState(source);
        return result;
    }
    
    async getGetFeeConfig(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_fee_config', builder.build())).stack;
        const result = loadGetterTupleFeeConfig(source);
        return result;
    }
    
    async getGetBuybackState(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_buyback_state', builder.build())).stack;
        const result = loadGetterTupleBuybackState(source);
        return result;
    }
    
    async getGetStakingConfig(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_staking_config', builder.build())).stack;
        const result = loadGetterTupleStakingConfig(source);
        return result;
    }
    
    async getGetStakeInfo(provider: ContractProvider, staker: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(staker);
        let source = (await provider.get('get_stake_info', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleStakeInfo(result_p) : null;
        return result;
    }
    
    async getGetReferralInfo(provider: ContractProvider, user: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(user);
        let source = (await provider.get('get_referral_info', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleReferralInfo(result_p) : null;
        return result;
    }
    
    async getGetVestingInfo(provider: ContractProvider, beneficiary: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(beneficiary);
        let source = (await provider.get('get_vesting_info', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleVestingInfo(result_p) : null;
        return result;
    }
    
    async getGetLotteryConfig(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_lottery_config', builder.build())).stack;
        const result = loadGetterTupleLotteryConfig(source);
        return result;
    }
    
    async getGetLotteryWinner(provider: ContractProvider, round: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(round);
        let source = (await provider.get('get_lottery_winner', builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    
    async getGetAiAction(provider: ContractProvider, actionId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(actionId);
        let source = (await provider.get('get_ai_action', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAIActionLog(result_p) : null;
        return result;
    }
    
    async getGetVetoState(provider: ContractProvider, actionId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(actionId);
        let source = (await provider.get('get_veto_state', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleVetoState(result_p) : null;
        return result;
    }
    
    async getGetAiRecommendation(provider: ContractProvider, index: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(index);
        let source = (await provider.get('get_ai_recommendation', builder.build())).stack;
        const result_p = source.readTupleOpt();
        const result = result_p ? loadTupleAIRecommendation(result_p) : null;
        return result;
    }
    
    async getGetPriceAt(provider: ContractProvider, timestamp: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(timestamp);
        let source = (await provider.get('get_price_at', builder.build())).stack;
        let result = source.readBigNumberOpt();
        return result;
    }
    
    async getIsPaused(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('is_paused', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getIsTradingEnabled(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('is_trading_enabled', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getIsAiAlive(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('is_ai_alive', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getCanOwnerOverride(provider: ContractProvider, actionId: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(actionId);
        let source = (await provider.get('can_owner_override', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
}