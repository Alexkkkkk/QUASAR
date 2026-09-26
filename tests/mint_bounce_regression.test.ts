import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { QuasarMaster } from '../build/quasar_QuasarMaster.js';
import { QuasarWallet } from '../build/quasar_QuasarWallet.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const walletCode = Cell.fromBoc(readFileSync(join(__dirname, '..', 'build', 'quasar_QuasarWallet.code.boc')))[0];
const QSR = 1_000_000_000n;
const ZERO = Address.parseRaw('0:' + '0'.repeat(64));
const masterSrc = readFileSync(join(__dirname, '..', 'contracts', 'quasar.tact'), 'utf8');

function section(src: string, from: string, to?: string): string {
    const i = src.indexOf(from);
    assert.ok(i >= 0, 'anchor not found: ' + from);
    const j = to ? src.indexOf(to, i) : src.length;
    return src.slice(i, j >= 0 ? j : src.length);
}

test('F-29 source: mint bounce rolls back supply instead of reserve', () => {
    assert.ok(masterSrc.includes('fun _mintQueryId(): Int'), 'mint query namespace must exist');
    assert.ok(masterSrc.includes('queryId: self._mintQueryId()'), 'mint must use the reserved query id');
    const bounce = section(masterSrc, 'bounced(msg: bounced<InternalTransfer>)', 'receive(msg: TokenExcesses)');
    assert.ok(bounce.includes('if (msg.queryId == self._mintQueryId())'), 'mint bounce must be distinguished');
    assert.ok(bounce.includes('self.totalSupply = self.totalSupply - msg.amount;'), 'mint bounce must roll back supply');
    const mintBranch = bounce.slice(bounce.indexOf('if (msg.queryId == self._mintQueryId())'), bounce.indexOf('} else {'));
    assert.ok(!mintBranch.includes('self.reserveBalance = self.reserveBalance + msg.amount'), 'mint bounce must not create reserve');
    assert.ok(masterSrc.includes('fun _requireNonMintQueryId(queryId: Int)'), 'reserve query ids need a mint collision guard');
    assert.ok(masterSrc.includes('self._requireNonMintQueryId(queryId);'), 'reserve payouts must reject the reserved mint query id');
});

test('F-29 on-chain: standard mint still credits the wallet and supply once', async () => {
    const bc = await Blockchain.create();
    bc.now = 1000;
    const owner = await bc.treasury('owner');
    const receiver = await bc.treasury('receiver');
    const content = beginCell().storeUint(1, 8).storeStringTail('https://raw.githubusercontent.com/Alexkkkkk/QUASAR/main/website/metadata.json').endCell();
    const raw = await QuasarMaster.fromInit(owner.address, content, walletCode);
    const master = bc.openContract(raw);
    await master.send(owner.getSender(), { value: toNano('1') }, { $$type: 'Deploy', queryId: 1n });
    const amount = 123n * QSR;
    const res = await master.send(owner.getSender(), { value: toNano('0.1') }, { $$type: 'Mint', amount, receiver: receiver.address });
    assert.ok(res.transactions.every((tx: any) => tx.description?.computePhase?.success !== false), 'mint transaction tree must not fail');
    assert.equal((await master.getGetJettonData()).totalSupply, amount);
    const wallet = bc.openContract(await QuasarWallet.fromInit(receiver.address, raw.address));
    assert.equal((await wallet.getGetWalletData()).balance, amount);
    assert.notEqual(receiver.address.toRawString(), ZERO.toRawString());
});
