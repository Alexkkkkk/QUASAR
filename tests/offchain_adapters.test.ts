import assert from 'node:assert/strict';
import test from 'node:test';
import { Address } from '@ton/core';
import { addressSliceStack, ToncenterClient } from '../scripts/lib/ton_api.js';

const MASTER = new Address(0, Buffer.alloc(32, 0x11)).toString();
const OWNER = new Address(0, Buffer.alloc(32, 0x22)).toString();
const WALLET = new Address(0, Buffer.alloc(32, 0x33)).toString();

function addressStack(address: string): [string, { bytes: string }] {
    return addressSliceStack(address);
}

test('TON adapter derives wallet addresses through get_wallet_address', async () => {
    const calls: Array<{ method: string; params: Record<string, unknown> }> = [];
    const client = new ToncenterClient({
        fetchImpl: async (_input, init) => {
            const request = JSON.parse(String(init?.body)) as { method: string; params: Record<string, unknown> };
            calls.push(request);
            return new Response(JSON.stringify({
                ok: true,
                result: { stack: [addressStack(WALLET)] }
            }), { status: 200, headers: { 'content-type': 'application/json' } });
        }
    });

    const result = await client.getJettonWalletAddress(MASTER, OWNER);
    assert.equal(result.toRawString(), Address.parse(WALLET).toRawString());
    const firstCall = calls[0];
    assert.ok(firstCall);
    assert.equal(firstCall.method, 'runGetMethod');
    assert.deepEqual((firstCall.params.stack as unknown[])[0], addressSliceStack(OWNER));
});

test('TON adapter rejects a wallet that is not derived by the allowlisted master', async () => {
    const client = new ToncenterClient({
        fetchImpl: async (_input, init) => {
            const request = JSON.parse(String(init?.body)) as { method: string };
            const stack = request.method === 'runGetMethod'
                ? [addressStack(WALLET)]
                : [];
            return new Response(JSON.stringify({ ok: true, result: { stack } }), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            });
        }
    });

    await assert.rejects(
        client.verifyJettonWallet(MASTER, OWNER, MASTER),
        /not the address derived/
    );
});