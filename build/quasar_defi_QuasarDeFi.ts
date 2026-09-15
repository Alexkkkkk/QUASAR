c_2.loadBit();
    const _maxTradeBps = sc_2.loadUintBig(16);
    return { $$type: 'QuasarDeFi$Data' as const, owner: _owner, qsrMaster: _qsrMaster, lpTotalSupply: _lpTotalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve, lpBalances: _lpBalances, pendingQsrDeposits: _pendingQsrDeposits, feeBps: _feeBps, feeAccumulated: _feeAccumulated, farmEnabled: _farmEnabled, farmRewardPerSecond: _farmRewardPerSecond, farmStartTime: _farmStartTime, farmEndTime: _farmEndTime, farmLastUpdate: _farmLastUpdate, farmAccRewardPerShare: _farmAccRewardPerShare, farmTotalStaked: _farmTotalStaked, farmRewardReserve: _farmRewardReserve, farmStakes: _farmStakes, locked: _locked, paused: _paused, maxTradeBps: _maxTradeBps };
}

export function loadTupleQuasarDeFi$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _qsrMaster = source.readAddress();
    const _lpTotalSupply = source.readBigNumber();
    const _tonReserve = source.readBigNumber();
    const _qsrReserve = source.readBigNumber();
    const _lpBalances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _pendingQsrDeposits = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _feeBps = source.readBigNumber();
    const _feeAccumulated = source.readBigNumber();
    const _farmEnabled = source.readBoolean();
    const _farmRewardPerSecond = source.readBigNumber();
    const _farmStartTime = source.readBigNumber();
    const _farmEndTime = source.readBigNumber();
    const _farmLastUpdate = source.readBigNumber();
    source = source.readTuple();
    const _farmAccRewardPerShare = source.readBigNumber();
    const _farmTotalStaked = source.readBigNumber();
    const _farmRewardReserve = source.readBigNumber();
    const _farmStakes = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserUserFarmInfo(), source.readCellOpt());
    const _locked = source.readBoolean();
    const _paused = source.readBoolean();
    const _maxTradeBps = source.readBigNumber();
    return { $$type: 'QuasarDeFi$Data' as const, owner: _owner, qsrMaster: _qsrMaster, lpTotalSupply: _lpTotalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve, lpBalances: _lpBalances, pendingQsrDeposits: _pendingQsrDeposits, feeBps: _feeBps, feeAccumulated: _feeAccumulated, farmEnabled: _farmEnabled, farmRewardPerSecond: _farmRewardPerSecond, farmStartTime: _farmStartTime, farmEndTime: _farmEndTime, farmLastUpdate: _farmLastUpdate, farmAccRewardPerShare: _farmAccRewardPerShare, farmTotalStaked: _farmTotalStaked, farmRewardReserve: _farmRewardReserve, farmStakes: _farmStakes, locked: _locked, paused: _paused, maxTradeBps: _maxTradeBps };
}

export function loadGetterTupleQuasarDeFi$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _qsrMaster = source.readAddress();
    const _lpTotalSupply = source.readBigNumber();
    const _tonReserve = source.readBigNumber();
    const _qsrReserve = source.readBigNumber();
    const _lpBalances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _pendingQsrDeposits = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _feeBps = source.readBigNumber();
    const _feeAccumulated = source.readBigNumber();
    const _farmEnabled = source.readBoolean();
    const _farmRewardPerSecond = source.readBigNumber();
    const _farmStartTime = source.readBigNumber();
    const _farmEndTime = source.readBigNumber();
    const _farmLastUpdate = source.readBigNumber();
    const _farmAccRewardPerShare = source.readBigNumber();
    const _farmTotalStaked = source.readBigNumber();
    const _farmRewardReserve = source.readBigNumber();
    const _farmStakes = Dictionary.loadDirect(Dictionary.Keys.Address(), dictValueParserUserFarmInfo(), source.readCellOpt());
    const _locked = source.readBoolean();
    const _paused = source.readBoolean();
    const _maxTradeBps = source.readBigNumber();
    return { $$type: 'QuasarDeFi$Data' as const, owner: _owner, qsrMaster: _qsrMaster, lpTotalSupply: _lpTotalSupply, tonReserve: _tonReserve, qsrReserve: _qsrReserve, lpBalances: _lpBalances, pendingQsrDeposits: _pendingQsrDeposits, feeBps: _feeBps, feeAccumulated: _feeAccumulated, farmEnabled: _farmEnabled, farmRewardPerSecond: _farmRewardPerSecond, farmStartTime: _farmStartTime, farmEndTime: _farmEndTime, farmLastUpdate: _farmLastUpdate, farmAccRewardPerShare: _farmAccRewardPerShare, farmTotalStaked: _farmTotalStaked, farmRewardReserve: _farmRewardReserve, farmStakes: _farmStakes, locked: _locked, paused: _paused, maxTradeBps: _maxTradeBps };
}

export function storeTupleQuasarDeFi$Data(source: QuasarDeFi$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeAddress(source.qsrMaster);
    builder.writeNumber(source.lpTotalSupply);
    builder.writeNumber(source.tonReserve);
    builder.writeNumber(source.qsrReserve);
    builder.writeCell(source.lpBalances.size > 0 ? beginCell().storeDictDirect(source.lpBalances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.pendingQsrDeposits.size > 0 ? beginCell().storeDictDirect(source.pendingQsrDeposits, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.feeBps);
    builder.writeNumber(source.feeAccumulated);
    builder.writeBoolean(source.farmEnabled);
    builder.writeNumber(source.farmRewardPerSecond);
    builder.writeNumber(source.farmStartTime);
    builder.writeNumber(source.farmEndTime);
    builder.writeNumber(source.farmLastUpdate);
    builder.writeNumber(source.farmAccRewardPerShare);
    builder.writeNumber(source.farmTotalStaked);
    builder.writeNumber(source.farmRewardReserve);
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
    const __code = Cell.fromHex('b5ee9c7241027601002009000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9012a02027102190201200311020120040c020148050a02016a060802d3a0abb5134348000638d3e903e901640b4405b5b5b5c14c02007885c2084017d78403e08fe08e082784ce0283e08d51d554433c42f842b55425c1c2042ee38c34445044544450444c4450444c4448444c44484444444844444440444444403c44403d543b6cf1b3cdb18e2b0700485613c000917f9320c000e29430705300e0205613a85614a904015612a85614a90456145902d7a03fb5134348000638d3e903e901640b4405b5b5b5c14c02007885c2084017d78403e08fe08e082784ce0283e08d51d554433c42f842b55425c1c2042ee38c34445044544450444c4450444c4448444c44484444444844444440444444403c44403d543b6cf15c417c3db1462b09004881010b5611028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e20291ad39f6a268690000c71a7d207d202c816880b6b6b6b82980400f10b8410802faf0807c11fc11c104f099c0507c11aa3aaa8867885f0856aa84b8384085dc7186ed9e2b882f87b628c02b0b00022d0201200d0f02e5b1d0fb5134348000638d3e903e901640b4405b5b5b5c14c02007885c2084017d78403e08fe08e082784ce0283e08d51d554433c42f842b55425c1c2042ee38c34445044584450444c4454444c4448445044484444444c44444440444844403c44443c38444038437d54736cf15c417c3db14602b0e023456148e83a8db3ce1015614a85613a904015614a85612a904db3c336c0291b32dbb5134348000638d3e903e901640b4405b5b5b5c14c02007885c2084017d78403e08fe08e082784ce0283e08d51d554433c42f842b55425c1c2042ee38c376cf15c417c3db14602b10000456130201c712140290aa9eed44d0d200018e34fa40fa405902d1016d6d6d705300801e2170821005f5e100f823f8238209e13380a0f82354755510cf10be10ad55097070810bb8e30ddb3c57105f0f6c512b1300022c0201201517028fa63bda89a1a400031c69f481f480b205a202dadadae0a601003c42e104200bebc201f047f0470413c2670141f046a8eaaa219e217c215aaa12e0e1021771c61bb678ae20be1ed8a32b160004561402d7a485da89a1a400031c69f481f480b205a202dadadae0a601003c42e104200bebc201f047f0470413c2670141f046a8eaaa219e217c215aaa12e0e1021771c61a2228222a22282226222822262224222622242222222422222220222222201e22201eaa1db678ae20be1ed8a32b18004881010b5610028101014133f40a6fa19401d70030925b6de2206e92307095206ef2d080e20201201a22020396101b200201201c1e028bbd7ed44d0d200018e34fa40fa405902d1016d6d6d705300801e2170821005f5e100f823f8238209e13380a0f82354755510cf10be10ad55097070810bb8e30ddb3c6cf36c6382b1d000c56125612561202d3ba9ed44d0d200018e34fa40fa405902d1016d6d6d705300801e2170821005f5e100f823f8238209e13380a0f82354755510cf10be10ad55097070810bb8e30d1114111511141113111411131112111311121111111211111110111111100f11100f550edb3c6cc66c9682b1f00825611c000917f9320c000e29770547000201045e0205613a8561222a0a904530fa8812710a90466a122812710a85614a90420812710bc9430812710de7052021514028fa03bb5134348000638d3e903e901640b4405b5b5b5c14c02007885c2084017d78403e08fe08e082784ce0283e08d51d554433c42f842b55425c1c2042ee38c376cf15c417c3db1462b2100022402016623280201202426028ca936ed44d0d200018e34fa40fa405902d1016d6d6d705300801e2170821005f5e100f823f8238209e13380a0f82354755510cf10be10ad55097070810bb8e30ddb3c6cc66c962b25000c5475a75479cb02d4ab23ed44d0d200018e34fa40fa405902d1016d6d6d705300801e2170821005f5e100f823f8238209e13380a0f82354755510cf10be10ad55097070810bb8e30d1114111511141113111411131112111311121111111211111110111111100f11100f550edb3c6cf36c632b27007881010b250259f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2206e943070530097206ef2d0806f23e202d5af7d76a268690000c71a7d207d202c816880b6b6b6b82980400f10b8410802faf0807c11fc11c104f099c0507c11aa3aaa8867885f0856aa84b8384085dc7186888a088a888a0889888a088988890889888908888889088888880888888807888807aa876d9e3663364b402b29007e5612c000917f9320c000e2957054700020e0205612a8561322a0a904530fa8812710a90466a122812710a85615a90420812710bc9430812710de705422031403f43001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e34fa40fa405902d1016d6d6d705300801e2170821005f5e100f823f8238209e13380a0f82354755510cf10be10ad55097070810bb8e30d1116945f0f5f07e0705615d74920c21f97311115d31f1116de2182107362d09cbae302212b2c2f00defa40fa40fa00fa00fa00f404d401d0f404d30ffa00d200fa00d31fd31f810101d700810101d700fa00d430d0fa00f404d200d200d30f300f11150f0f11140f0f11130f0f11120f0f11110f0f11100f57151113111411131112111311121111111211111110111111100f11100f550e02fe5b1114d33f31fa00fa4030f8285614db3c8130cdf8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705f2f48142a622c200f2f48200e64d8d08600000000000000000000000000000000000000000000000000000000000000000045220c705b3f2f4552d01fc205614c70593301fa08e442e81010b228101014133f40a6fa19401d70030925b6de281010b216e91319a01206ef2d0805003a002e2103f02810101216e955b59f4593098c801cf004133f441e20c0ee21112111411121111111311111110111211100f11110f111010df10ce10bd10ac109b108a107910681057104610352e00d64430c87f01ca0011151114111311121111111055e0011114011115ce01111201ce011110fa02500efa02500cfa021af40008c8f40017cb0f5005fa0213ca0001fa02cb1fcb1f810101cf0012810101cf0058fa02c85003fa0213f40013ca0013ca0013cb0f12cdcdc9ed54044a821008bfa37dbae302218210c3f44eb8bae30221821042a7c44cbae302218210b402f875ba303b464a04d45b1114fa00fa0030011115011116db3cdb3c812fab5616c200945617c2009170e2f2f48200bcd5f8416f24135f035617bef2f481010bf8425610598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d0805619be9170e2f2f45613c200e3005613514c31320042810de95617812710a8561424a8bbf2f48200d5df5618812710a8561324a8bbf2f403fc8ee756165618a81115111611151114111611141113111611131112111611121111111611111110111611100f11160f0e11160e0d11160d0c11160c0b11160b0a11160a091116090811160807111607061116060511160504111604031116030211160201111601db3ce30d8200d97e21c200f2f411125617a011115618a0333435003a20c101923070e05300a4ab00935301b999315ca9045210a0ab00e8303101ec56165614a85613a90456185615a85613a9041116111711161115111711151114111711141113111711131112111711121111111711111110111711100f11170f0e11170e0d11170d0c11170c0b11170b0a11170a0911170908111708071117070611170605111705041117040311170302111702db3c6c01f811135612a081010bf8421118206ef2d080561aa1031111031201111801810101216e955b59f4593098c801cf004133f441e281010bf8425611598101014133f40a6fa19401d70030925b6de281010bf842226e933256139902206ef2d0805614a0e20311120312810101216e955b59f4593098c801cf004133f441e23604fc1112111511121110111111101110111511100f0edb3c2b8e86f8425616db3cdef842708040f8420302111a0201111b011119c8553082101323cbef5005cb1f13ce810101cf00810101cf0001c8810101cf00cdc90311160302111702011118015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb08a6b37433a02f62581010b2359f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2206e8e46206ef2d0806f2352b2a15220a882103b9aca00a90481010b5134a059a052b0c855205023810101cf00810101cf00810101cf00c910374170206e953059f45930944133f413e2e30d5064a03839005c3081010b531970c855205023810101cf00810101cf00810101cf00c910374170206e953059f45930944133f413e200020503748ae2f400c901fb001111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a106910581047103645135042db3c444f7503fe5b1114fa00301113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710561045103411154130db3cdb3c81010bf8425611598101014133f40a6fa19401d70030925b6de28200cbbe5617c200f2f481584e216eb39921206ef2d0805618be9170e2f2f456165613514c3c02fea85614a90456175613a85615a9048200a9cb22c2009321c2009170e2f2f41114111711141113111611131112111511121111111711111110111611100f11150f0e11170e0d11160d0c11150c0b11170b0a11160a0911150908111708071116070611150605111705041116040311150302111702011116011115db3c81010b6b3d03eef842255959f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2206eb39b20206ef2d0806f235bc2009170e28f1a206ef2d0806f235b561901db3c20c2008e85f84201db3c9130e29130e281010bf8421119206ef2d080561aa10311110312011119018101016c3e4001f42581010b2359f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e28200c89e216eb39b21206ef2d0806f235b23be9170e2f2f4206ef2d0806f2352b2a15220a882103b9aca00a90481010b5134a159a052b0c855205023810101cf00810101cf00810101cf00c910373f00284170206e953059f45930944133f413e25064a10502fe216e955b59f4593098c801cf004133f441e211115617a111105615a10f5614a1f84271885618595a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00f8421114111511141113111411131111111311111110111211100111110110ef10de4142000004fe10cd10bc10ab109a108910781067105610451034102301111701561770db3cf842708040f842030211190201111a01111bc8553082105b4f24a95005cb1f13ce810101cf00810101cf0001c8810101cf00cdc90311180302111602011117015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb08a8ae25443444500065bcf81001a58cf8680cf8480f400f400cf81026ef400c901fb001111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a1069105810471036453304db3c4f7503fe5b1114fa00fa0030011115011116db3cdb3c8115f75616c200945611c2009170e2f2f4816d195616812710a8561223a8bbf2f481010bf8425610598101014133f40a6fa19401d70030925b6de2814eb1216eb39921206ef2d0805618be9170e2f2f456165613a856125618a0a904530fa8812710a90466a1208200a239111b514c4701cebe01111a01f2f4813fc35619c2009556195615b99170e2f2f411125617a011135618a10e5612a081010bf84203206ef2d0805619a1031112031201111201810101216e955b59f4593098c801cf004133f441e2f8428040f8427054132202111b02561c021117c84801f855508210c02a54935007cb1f15ce13810101cf00810101cf0001c8810101cf0012810101cf0012810101cf00cdc90311170302111802011112015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001112111411121111111311114902301110111211100a11110a0f11100f10df10bd109b5518db3c4f75043ce302218210511327f0bae302218210e7ceed7ebae3022182106482e5b4ba4b50696d03fc5b1114fa00fa0030011115011116db3cdb3c8115f75616c200945612c2009170e2f2f48200bcd5f8416f24135f035617bef2f4816d195616812710a8561323a8bbf2f456155611a856125617a0a904530ea8812710a90466a1208200a239111abe01111901f2f4813fc35618c2009556185613b99170e2f2f411125616a0514c4d00168200a57a03b313f2f47f0202f811115617a10d5612a0f8421115111611151114111611141113111611130e11110e0e11100e10ef1d1c1b1a1918171615144330561870db3cf842708040f84254332204111c045a01111d01111bc855508210c02a54935007cb1f15ce13810101cf00810101cf0001c8810101cf0012810101cf0012810101cf00cdc9544e02e80311160302111702011118015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb001111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c108b107a106910581047103645135042db3c4f750004703303fc5b57141112111411121111111311111110111211100f11110f0e11100e551ddb3cdb3c81010bf842255959f40b6fa192306ddf206e92306d8e16d0810101d700810101d700810101d70055206c136f03e2814159216eb3f2f4206ef2d0806f235292a15220a882103b9aca00a904a08200f7f321c200f2f48130212ef2f4516b52000e81618922b3f2f401fa81010bf842513a70c855205023810101cf00810101cf00810101cf00c910374170206e953059f45930944133f413e2f8421115111611151114111611141113111611131112111611121111111611111110111611100f11160f0e11160e0d11160d0c11160c0b11160b0a11160a091116090811160807111607061116065302f805111605144330561670db3cf8427071f842011119c8598210ca3de6d55003cb1fce810101cf00c94130011118015a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00111311141113111211131112111111121111111011111110546802f68200865822c200f2f4f8285617db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d08209312d007f50567108c85520821051a5c3d15004cb1f12cb3f01fa02cec91610455a1036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016e5567011688c87001ca005a02cecec956022cff008e88f4a413f4bcf2c80bed53208e8130e1ed43d957590157a65ec0bb513434800067fe803e903e9020404075c0154c1b05273e903e901640b4405c150488b8b6cf1b11205801145321db3c3054644052406304c201d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019ffa00fa40fa40810101d70055306c149cfa40fa405902d10170541222e205e30203d70d1ff2e082218210178d4519bae3022182100f8a7ea5bae30221821051a5c3d1ba5a5b5e6200f6038020d7217021d749c21f9430d31f01de208210178d4519ba8e2a30d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e082107bdd97deba8e29d33ffa00596c218142a621c200f2f412a05023c87f01ca0055305043fa02ce12ce810101cf00c9ed54e05f0503d431d33ffa00fa40fa4031fa005327db3c8200c241f8422bc705936c217f8e32f8425a705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0c705e2f2f48142a624c200f2f45163a021c20093365f04e30d4003635c5d00b0147f50437308c8553082107362d09c5005cb1f13cb3f01fa02cecec92404035066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00002cc87f01ca0055305043fa02ce12ce810101cf00c9ed5401fe31d33ffa00fa40fa40f40431fa008142a625c200f2f48138c6f84228c705f2f48109228d08600000000000000000000000000000000000000000000000000000000000000000045250c705b3f2f48121d45385bef2f48200da29f823500ba1c2041af2f4f82324a71e812710a90420c101923071de5350a18200b67621c2005f02fef2f45096a15349db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f80402c514e104d4b1311121ac855508210178d45195007cb1f15cb3f5003fa02cece01fa02cec910561058104d1038591036453304c8cf8580ca00cf8440ce01fa028069cf4063600180025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0024c20093303330e30d4003c87f01ca0055305043fa02ce12ce810101cf00c9ed546100b270705414657304c855308210eb527edf5005cb1f13cb3f01fa02cecec92604034666146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0003f28f6731d33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a15145db3c5c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0707f8040228b082a104a1039544b30c8e0018210595f07bcbae3025f05f2c0826364650018f82ac87001ca005a02cecec900da55508210178d45195007cb1f15cb3f5003fa02cece01fa02cec94016504405031036453304c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb004003c87f01ca0055305043fa02ce12ce810101cf00c9ed5401fed33ffa00fa40308142a622c200f2f48138c6f84225c705f2f48121d45352bef2f45141a1707f541435804008c8553082107bdd97de5005cb1f13cb3f01fa02cecec9260443135066146d50436d5033c8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb006600304003c87f01ca0055305043fa02ce12ce810101cf00c9ed540034b0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0000de0f11100f550ec87f01ca0011151114111311121111111055e0011114011115ce01111201ce011110fa02500efa02500cfa021af40008c8f40017cb0f5005fa0213ca0001fa02cb1fcb1f810101cf0012810101cf0058fa02c85003fa0213f40013ca0013ca0013cb0f12cdcdc9ed5401f85b1114fa00d31fd31f3082008aabf8425617c705f2f482009e4823c200f2f48200ceae5312bcf2f4817b70f8235220bef2f41114111511141113111511131112111511121111111511111110111511100f11150f0e11150e0d11150d0c11150c0b11150b0a11150a09111509081115080711150706111506051115056a0296041115040311150302111502011116011117db3c3838385613255615b9953504111304925714e21111111411111110111311100f11120f0e11110e0d11100d10cf10be10ad109c5e2855246b750182f82328bbdcf82329db3c5308bb9130e026c000917f922cb3e29138e05209a12ba85305bc923024de20c2008e115155a10582103b9aca00a826a90417a0069130e26c000e5cb991309131e204ca8ec65b3a1113d2003082008aabf8425614c705f2f42099820081fe23c200f2f4de1112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac0b108a5517e021821027895d7cbae30221821017000fb2bae302218210096819ffba756e707101fa5b1114fa003082008aabf8425615c705f2f481494d21c200f2f481010bf8422f598101014133f40a6fa19401d70030925b6de2814eb1216eb39821206ef2d08023be9170e2f2f481010bf84202206ef2d08023a10311100312810101216e955b59f4593098c801cf004133f441e2503da01112111411121111111311116f014c1110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035503475018c5b3c1113d30f3082008aabf8425614c705f2f482009ab021c2009321c1659170e2f2f41112111411121111111311111110111211100f11110f0e11100e10df10ce0d10ac55197504d48ec65f031113d2003082008aabf8425614c705f2f41112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a10791068105710461035440302e0218210dcff684fbae302218210946a98b6bae3025716c0001115c12101111501b07572737401b05b57151113d30f3082008aabf8425614c705f2f4814dc321c2639521811388bb9170e2f2f41112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430127501de5b1114d33f30c8018210aff90f5758cb1fcb3fc91113111511131112111411121111111311111110111211100f11110f0e11100e10df10ce10bd10ac109b108a107910681057104610354430f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb0075014c8e9c1112111411121111111311111110111211100f11110f0e11100e551de05f0f5f06f2c0827500d2c87f01ca0011151114111311121111111055e0011114011115ce01111201ce011110fa02500efa02500cfa021af40008c8f40017cb0f5005fa0213ca0001fa02cb1fcb1f810101cf0012810101cf0058fa02c85003fa0213f40013ca0013ca0013cb0f12cdcdc9ed54fe7225fa');
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
    2338: { message: "Invalid destination" },
    3561: { message: "TON deposit too large" },
    5623: { message: "Invalid swap" },
    8660: { message: "Insufficient" },
    12203: { message: "Invalid amounts" },
    12321: { message: "Farm disabled" },
    12493: { message: "Invalid token wallet" },
    14534: { message: "Not owner" },
    16323: { message: "Insufficient reserve" },
    16729: { message: "No LP stake" },
    17062: { message: "Invalid amount" },
    18765: { message: "Invalid farm funding" },
    19907: { message: "Trade limit 1%-50%" },
    20145: { message: "Deposit QSR first" },
    22606: { message: "Insufficient LP balance" },
    24969: { message: "DeFi paused" },
    27929: { message: "Trade too large" },
    31600: { message: "Farm already ended" },
    33278: { message: "Fund farm before enabling" },
    34392: { message: "Invalid QSR amount" },
    35499: { message: "Only owner" },
    39600: { message: "Fee must be 0.01%-1%" },
    40520: { message: "Invalid reward rate" },
    41529: { message: "Slippage exceeded" },
    42362: { message: "Reentrant call" },
    43467: { message: "Zero output" },
    46710: { message: "Amount too small" },
    48341: { message: "Insufficient TON sent" },
    49729: { message: "Unauthorized" },
    51358: { message: "Farm stake insufficient" },
    52158: { message: "Invalid LP amount" },
    52910: { message: "Invalid farm period" },
    54751: { message: "QSR deposit too large" },
    55678: { message: "Zero LP tokens" },
    55849: { message: "Cooldown" },
    58957: { message: "Invalid depositor" },
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
    "Invalid destination": 2338,
    "TON deposit too large": 3561,
    "Invalid swap": 5623,
    "Insufficient": 8660,
    "Invalid amounts": 12203,
    "Farm disabled": 12321,
    "Invalid token wallet": 12493,
    "Not owner": 14534,
    "Insufficient reserve": 16323,
    "No LP stake": 16729,
    "Invalid amount": 17062,
    "Invalid farm funding": 18765,
    "Trade limit 1%-50%": 19907,
    "Deposit QSR first": 20145,
    "Insufficient LP balance": 22606,
    "DeFi paused": 24969,
    "Trade too large": 27929,
    "Farm already ended": 31600,
    "Fund farm before enabling": 33278,
    "Invalid QSR amount": 34392,
    "Only owner": 35499,
    "Fee must be 0.01%-1%": 39600,
    "Invalid reward rate": 40520,
    "Slippage exceeded": 41529,
    "Reentrant call": 42362,
    "Zero output": 43467,
    "Amount too small": 46710,
    "Insufficient TON sent": 48341,
    "Unauthorized": 49729,
    "Farm stake insufficient": 51358,
    "Invalid LP amount": 52158,
    "Invalid farm period": 52910,
    "QSR deposit too large": 54751,
    "Zero LP tokens": 55678,
    "Cooldown": 55849,
    "Invalid depositor": 58957,
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
    {"name":"SetFarmEnabled","header":1686300084,"fields":[{"name":"enabled","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"FundFarm","header":663313788,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"SetFarmConfig","header":3889098110,"fields":[{"name":"rewardPerSecond","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"startTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"SetFeeBps","header":385879986,"fields":[{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"SetPaused","header":157817343,"fields":[{"name":"paused","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SetMaxTradeBps","header":3707725903,"fields":[{"name":"maxTradeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"DefiPayout","header":3146613905,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"BurnNotification","header":2078119902,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TokenTransfer","header":260734629,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forwardTonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"TokenBurn","header":1499400124,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"customPayload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"TokenNotification","header":1935855772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"InternalTransfer","header":395134233,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"responseDestination","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardTonAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"PoolPayout","header":1369818065,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"FeeTransfer","header":3948052191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"originalSender","type":{"kind":"simple","type":"address","optional":false}},{"name":"originalReceiver","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"EventLiquidityAdded","header":321113071,"fields":[{"name":"provider","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lpMinted","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventLiquidityRemoved","header":1531913385,"fields":[{"name":"provider","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lpBurned","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventSwap","header":3223999635,"fields":[{"name":"trader","type":{"kind":"simple","type":"address","optional":false}},{"name":"tonIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"fee","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventFarmReward","header":3393054421,"fields":[{"name":"farmer","type":{"kind":"simple","type":"address","optional":false}},{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"EventFeeCollected","header":1624548570,"fields":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"LPInfo","header":null,"fields":[{"name":"totalSupply","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonReserve","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrReserve","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"FarmInfo","header":null,"fields":[{"name":"staked","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"rewardPerSecond","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"lastUpdate","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"accRewardPerShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"startTime","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"endTime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"UserFarmInfo","header":null,"fields":[{"name":"staked","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"debt","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"pending","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SwapQuote","header":null,"fields":[{"name":"tonIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrIn","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"tonOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrOut","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"fee","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"priceImpactBps","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"walletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"QuasarDeFi$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"qsrMaster","type":{"kind":"simple","type":"address","optional":false}},{"name":"lpTotalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"tonReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"qsrReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"lpBalances","type":{"kind":"dict","key":"address","value":"int"}},{"name":"pendingQsrDeposits","type":{"kind":"dict","key":"address","value":"int"}},{"name":"feeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"feeAccumulated","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmEnabled","type":{"kind":"simple","type":"bool","optional":false}},{"name":"farmRewardPerSecond","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmStartTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"farmEndTime","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"farmLastUpdate","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"farmAccRewardPerShare","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"farmTotalStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmRewardReserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"farmStakes","type":{"kind":"dict","key":"address","value":"UserFarmInfo","valueFormat":"ref"}},{"name":"locked","type":{"kind":"simple","type":"bool","optional":false}},{"name":"paused","type":{"kind":"simple","type":"bool","optional":false}},{"name":"maxTradeBps","type":{"kind":"simple","type":"uint","optional":false,"format":16}}]},
    {"name":"QuasarWallet$Data","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"master","type":{"kind":"simple","type":"address","optional":false}},{"name":"lastTxTime","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
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
    "SetFarmEnabled": 1686300084,
    "FundFarm": 663313788,
    "SetFarmConfig": 3889098110,
    "SetFeeBps": 385879986,
    "SetPaused": 157817343,
    "SetMaxTradeBps": 3707725903,
    "DefiPayout": 3146613905,
    "BurnNotification": 2078119902,
    "TokenTransfer": 260734629,
    "TokenBurn": 1499400124,
    "TokenNotification": 1935855772,
    "InternalTransfer": 395134233,
    "PoolPayout": 1369818065,
    "FeeTransfer": 3948052191,
    "EventLiquidityAdded": 321113071,
    "EventLiquidityRemoved": 1531913385,
    "EventSwap": 3223999635,
    "EventFarmReward": 3393054421,
    "EventFeeCollected": 1624548570,
}

const QuasarDeFi_getters: ABIGetter[] = [
    {"name":"lpBalance","methodId":66831,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"pendingQsrDeposit","methodId":83522,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"poolInfo","methodId":106583,"arguments":[],"returnType":{"kind":"simple","type":"LPInfo","optional":false}},
    {"name":"farmInfo","methodId":119094,"arguments":[],"returnType":{"kind":"simple","type":"FarmInfo","optional":false}},
    {"name":"userFarm","methodId":120611,"arguments":[{"name":"user","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"UserFarmInfo","optional":false}},
    {"name":"estimateSwapToTon","methodId":106665,"arguments":[{"name":"qsrAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"SwapQuote","optional":false}},
    {"name":"estimateSwapToQsr","methodId":122618,"arguments":[{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"SwapQuote","optional":false}},
    {"name":"estimateLpOut","methodId":75587,"arguments":[{"name":"tonAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"qsrAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"estimateRemoveLiquidity","methodId":66602,"arguments":[{"name":"lpAmount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"LPInfo","optional":false}},
    {"name":"feeConfig","methodId":68211,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"feeAccumulated","methodId":82590,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"farmRewardReserve","methodId":106766,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","methodId":83229,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"qsrMaster","methodId":81078,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const QuasarDeFi_getterMapping: { [key: string]: string } = {
    'lpBalance': 'getLpBalance',
    'pendingQsrDeposit': 'getPendingQsrDeposit',
    'poolInfo': 'getPoolInfo',
    'farmInfo': 'getFarmInfo',
    'userFarm': 'getUserFarm',
    'estimateSwapToTon': 'getEstimateSwapToTon',
    'estimateSwapToQsr': 'getEstimateSwapToQsr',
    'estimateLpOut': 'getEstimateLpOut',
    'estimateRemoveLiquidity': 'getEstimateRemoveLiquidity',
    'feeConfig': 'getFeeConfig',
    'feeAccumulated': 'getFeeAccumulated',
    'farmRewardReserve': 'getFarmRewardReserve',
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
    {"receiver":"internal","message":{"kind":"typed","type":"SetFarmEnabled"}},
    {"receiver":"internal","message":{"kind":"typed","type":"FundFarm"}},
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
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: null | TokenNotification | AddLiquidity | RemoveLiquidity | SwapToTON | SwapToQSR | ClaimFarmRewards | SetFarmConfig | SetFarmEnabled | FundFarm | SetFeeBps | SetPaused | SetMaxTradeBps | Deploy) {
        
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
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetFarmEnabled') {
            body = beginCell().store(storeSetFarmEnabled(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'FundFarm') {
            body = beginCell().store(storeFundFarm(message)).endCell();
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
    
    async getPendingQsrDeposit(provider: ContractProvider, user: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(user);
        const source = (await provider.get('pendingQsrDeposit', builder.build())).stack;
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
    
    async getFarmRewardReserve(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('farmRewardReserve', builder.build())).stack;
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