/**
 * TEP-89 wallet-side discovery (T-01).
 *
 * The master already answered `provide_wallet_address` (verified on-chain by
 * tests/conformance_2026_09_26.test.ts, F-24). The Jetton WALLET did not, so it
 * was not discoverable. Per TEP-89 the wallet must answer
 * `take_wallet_address#d1735400 query_id:uint64 wallet_address:MsgAddress
 *  owner_address:(Maybe ^MsgAddress)` sent with mode 64, where the owner address
 * is a *ref*.
 *
 * This test asserts the shipped source and the compiled artifacts, the same
 * convention the other conformance invariants in this repository use. The
 * end-to-end sandbox activation of a fresh wallet is tracked as T-13 in
 * docs/TASKS.md.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const common = readFileSync(join(root, 'contracts', 'quasar_common.tact'), 'utf8');
const master = readFileSync(join(root, 'contracts', 'quasar.tact'), 'utf8');
const walletBinding = readFileSync(join(root, 'build', 'quasar_QuasarWallet.ts'), 'utf8');
const walletAbi = readFileSync(join(root, 'build', 'quasar_QuasarWallet.abi'), 'utf8');

test('T-01 TEP-89: the jetton WALLET declares the discovery pair with the standard opcodes', () => {
    assert.match(common, /message\(0x2c76b973\) ProvideWalletAddress \{/, 'provide_wallet_address opcode 0x2c76b973');
    assert.match(common, /message\(0xd1735400\) TakeWalletAddress \{/, 'take_wallet_address opcode 0xd1735400');
    // The owner address is transported as a ref, exactly as the TEP-89 TL-B
    // `owner_address:(Maybe ^MsgAddress)` requires.
    assert.match(common, /ownerAddress: Cell\?/, 'owner_address must be a Cell? (ref), not an Address?');
});

test('T-01 TEP-89: the wallet answers provide_wallet_address with its own address via mode 64', () => {
    assert.match(common, /receive\(msg: ProvideWalletAddress\) \{/, 'wallet must handle provide_wallet_address');
    assert.match(common, /walletAddress: myAddress\(\)/, 'the wallet must report its own address');
    assert.match(common, /storeAddress\(self\.owner\)/, 'include_address must echo the owner');
    assert.match(common, /mode: SendRemainingValue/, 'the response must use mode 64 (carry remaining value)');
    assert.match(common, /require\(context\(\)\.value >= ton\("0\.0061"\)/, 'the 0.0061 TON discovery floor must be enforced');
});

test('T-01 TEP-89: the master keeps its role and the definitions are not duplicated', () => {
    assert.match(master, /receive\(msg: ProvideWalletAddress\)/, 'the master still answers discovery');
    assert.doesNotMatch(master, /message\(0x2c76b973\) ProvideWalletAddress \{/, 'the master must reuse the shared definition');
});

test('T-01 TEP-89: the compiled wallet artifact exposes the discovery handler', () => {
    assert.match(walletBinding, /ProvideWalletAddress/, 'the binding must know the request message');
    assert.match(walletBinding, /TakeWalletAddress/, 'the binding must know the response message');
    assert.match(walletAbi, /ProvideWalletAddress/, 'the ABI must list the discovery handler');
    assert.match(walletAbi, /TakeWalletAddress/, 'the ABI must list the discovery response');
});
