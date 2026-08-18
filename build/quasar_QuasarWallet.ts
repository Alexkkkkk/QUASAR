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

 type QuasarWallet_init_args = {
    $$type: 'QuasarWallet_init_args';
    owner: Address;
    master: Address;
}

function initQuasarWallet_init_args(src: QuasarWallet_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.master);
    };
}

async function QuasarWallet_init(owner: Address, master: Address) {
    const __code = Cell.fromBase64('te6ccgECFwEABbsAART/APSkE/S88sgLAQIBYgIDA3rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVE9s88uCCEgQFAgEgEBED9gGSMH/gcCHXScIflTAg1wsf3iCCEAStN4O6jkww0x8BghAErTeDuvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIVBMDECNsFBAjXwOCAMJB+EJSQMcF8vQUoAN/4CCCEJOrtT66jwgw2zxsF9s8fwYHCACqyPhDAcx/AcoAVTBQQ/oCASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlgg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxaBAQHPAMntVADG0x8BghCTq7U+uvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHi+gBRZhYVFEMwAoJsMYE4xvhCUoDHBfL0gSHUU4O+8vSCANop+CNQBqHCBBXy9PgjIqcegScQqQQgwQGSMHHeUzChUJSh+ENTN9s8XBYJAZzgghDngiQTuo7B0x8BghDngiQTuvLggdM/+gD6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdIAAZHUkm0B4lUwbBTbPH/gMHAMAZRwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiHB/gEBUSqBS7QoCnshVMIIQBK03g1AFyx8Tyz8B+gIBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WAc8WyUZQEEoQOECoEEYQRds8MCbCAJMwNTDjDQMOCwHQcHBUFIeAQATIVTCCEOtSft9QBcsfE8s/AfoCASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJJQQDSIgQJBAjbW3bPDAOAfIwgTjG+EJScMcF8vSBIdRTcr7y9FFhoXB/VBQ3gEAKyFUwghDbF/DKUAXLHxPLP4EBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJJQRDE1CIDQESECQQI21t2zwwDgHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wgPAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAhG/2BbZ5tnjYiQSEwARvhX3aiaGkAAMAcbtRNDUAfhj0gABjkv6APpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAFUwbBTg+CjXCwqDCbry4IkUARb4Q13bPDBUZEBSQBYBivpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBIC0QHbPBUACHBUEiIA1gLQ9AQwbQGBbqMBgBD0D2+h8uCHAYFuoyICgBD0F8gByPQAyQHMcAHKAEADWSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbJ');
    const __system = Cell.fromBase64('te6cckECGQEABcUAAQHAAQEFoN1HAgEU/wD0pBP0vPLICwMCAWIEEQN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRPbPPLgghMFEAP2AZIwf+BwIddJwh+VMCDXCx/eIIIQBK03g7qOTDDTHwGCEAStN4O68uCB0z/6APpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUEwMQI2wUECNfA4IAwkH4QlJAxwXy9BSgA3/gIIIQk6u1PrqPCDDbPGwX2zx/BgcLAMbTHwGCEJOrtT668uCB0z/6APpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAHSAAGR1JJtAeL6AFFmFhUUQzACgmwxgTjG+EJSgMcF8vSBIdRTg77y9IIA2in4I1AGocIEFfL0+CMipx6BJxCpBCDBAZIwcd5TMKFQlKH4Q1M32zxcFwgBlHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcH+AQFRKoFLtCQKeyFUwghAErTeDUAXLHxPLPwH6AgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBzxbJRlAQShA4QKgQRhBF2zwwJsIAkzA1MOMNAw4KAdBwcFQUh4BABMhVMIIQ61J+31AFyx8Tyz8B+gIBINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsklBANIiBAkECNtbds8MA4BnOCCEOeCJBO6jsHTHwGCEOeCJBO68uCB0z/6APpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB0gABkdSSbQHiVTBsFNs8f+AwcAwB8jCBOMb4QlJwxwXy9IEh1FNyvvL0UWGhcH9UFDeAQArIVTCCENsX8MpQBcsfE8s/gQEBzwABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsklBEMTUIgNARIQJBAjbW3bPDAOAcrIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WUAP6AnABymgjbrORf5MkbrPilzMzAXABygDjDSFus5x/AcoAASBu8tCAAcyVMXABygDiyQH7CA8AmH8BygDIcAHKAHABygAkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDiJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4nABygACfwHKAALJWMwAqsj4QwHMfwHKAFUwUEP6AgEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxZYINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WgQEBzwDJ7VQCASASGAIRv9gW2ebZ42IkExYBxu1E0NQB+GPSAAGOS/oA+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcAVTBsFOD4KNcLCoMJuvLgiRQBivpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiBIC0QHbPBUACHBUEiIBFvhDXds8MFRkQFJAFwDWAtD0BDBtAYFuowGAEPQPb6Hy4IcBgW6jIgKAEPQXyAHI9ADJAcxwAcoAQANZINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskAEb4V92omhpAADIvPbwY=');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initQuasarWallet_init_args({ $$type: 'QuasarWallet_init_args', owner, master })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const QuasarWallet_errors: { [key: number]: { message: string } } = {
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

const QuasarWallet_types: ABIType[] = [
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

const QuasarWallet_getters: ABIGetter[] = [
    {"name":"get_wallet_data","arguments":[],"returnType":{"kind":"simple","type":"JettonWalletData","optional":false}},
]

export const QuasarWallet_getterMapping: { [key: string]: string } = {
    'get_wallet_data': 'getGetWalletData',
}

const QuasarWallet_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"TokenNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenTransfer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"TokenBurn"}},
]

export class QuasarWallet implements Contract {
    
    static async init(owner: Address, master: Address) {
        return await QuasarWallet_init(owner, master);
    }
    
    static async fromInit(owner: Address, master: Address) {
        const init = await QuasarWallet_init(owner, master);
        const address = contractAddress(0, init);
        return new QuasarWallet(address, init);
    }
    
    static fromAddress(address: Address) {
        return new QuasarWallet(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  QuasarWallet_types,
        getters: QuasarWallet_getters,
        receivers: QuasarWallet_receivers,
        errors: QuasarWallet_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: TokenNotification | TokenTransfer | TokenBurn) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenNotification') {
            body = beginCell().store(storeTokenNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenTransfer') {
            body = beginCell().store(storeTokenTransfer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TokenBurn') {
            body = beginCell().store(storeTokenBurn(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetWalletData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_wallet_data', builder.build())).stack;
        const result = loadGetterTupleJettonWalletData(source);
        return result;
    }
    
}