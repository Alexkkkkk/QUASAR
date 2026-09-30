import assert from 'node:assert/strict';
import test from 'node:test';
import { Address } from '@ton/core';
import { addressSliceStack } from '../scripts/lib/ton_api.js';
import { TONCENTER_V3_BASE_URLS, ToncenterV3Client } from '../scripts/lib/ton_api_v3.js';

const MASTER = new Address(0, Buffer.alloc(32, 0x11));
const OWNER = new Address(0, Buffer.alloc(32, 0x22));
const WALLET = new Address(0, Buffer.alloc(32, 0x33));

type Call = {
    url: string;
    method: string;
    headers: Record<string, string>;
    body?: string;
};

function recorder(respond: (call: Call) => unknown, status = 200) {
    const calls: Call[] = [];
    const fetchImpl = async (input: string | URL, init?: RequestInit) => {
        const call: Call = {
            url: String(input),
            method: init?.method ?? 'GET',
            headers: (init?.headers ?? {}) as Record<string, string>,
            body: init?.body as string | undefined
        };
        calls.push(call);
        return new Response(JSON.stringify(respond(call)), {
            status,
            headers: { 'content-type': 'application/json' }
        });
    };
    return { calls, fetchImpl };
}

function query(call: Call): URLSearchParams {
    return new URL(call.url).searchParams;
}

test('v3 adapter targets the documented mainnet and testnet base URLs', () => {
    assert.equal(TONCENTER_V3_BASE_URLS.mainnet, 'https://toncenter.com/api/v3');
    assert.equal(TONCENTER_V3_BASE_URLS.testnet, 'https://testnet.toncenter.com/api/v3');

    assert.equal(new ToncenterV3Client().baseUrl, TONCENTER_V3_BASE_URLS.mainnet);
    assert.equal(
        new ToncenterV3Client({ network: 'testnet' }).baseUrl,
        TONCENTER_V3_BASE_URLS.testnet
    );
    assert.equal(
        new ToncenterV3Client({ network: 'testnet', endpoint: 'https://example.test/api/v3/' }).baseUrl,
        'https://example.test/api/v3'
    );
});

test('v3 adapter sends the API key header and omits undefined parameters', async () => {
    const { calls, fetchImpl } = recorder(() => ({ first: { workchain: 0 }, last: { workchain: 0 } }));
    const client = new ToncenterV3Client({ apiKey: 'test-key', fetchImpl });

    await client.getMasterchainInfo();

    const call = calls[0];
    assert.equal(call.method, 'GET');
    assert.equal(call.headers['X-API-Key'], 'test-key');
    assert.equal(call.url, 'https://toncenter.com/api/v3/masterchainInfo');
    assert.equal(query(call).toString(), '');
});

test('v3 adapter maps camelCase query options to the documented snake_case parameters', async () => {
    const { calls, fetchImpl } = recorder(() => ({ jetton_wallets: [] }));
    const client = new ToncenterV3Client({ fetchImpl });

    await client.getJettonWallets({
        ownerAddress: OWNER.toString(),
        jettonAddress: MASTER.toString(),
        excludeZeroBalance: true,
        limit: 10,
        offset: 20,
        sort: 'desc'
    });

    const params = query(calls[0]);
    assert.equal(calls[0].url.split('?')[0], 'https://toncenter.com/api/v3/jetton/wallets');
    assert.equal(params.get('owner_address'), OWNER.toString());
    assert.equal(params.get('jetton_address'), MASTER.toString());
    assert.equal(params.get('exclude_zero_balance'), 'true');
    assert.equal(params.get('limit'), '10');
    assert.equal(params.get('offset'), '20');
    assert.equal(params.get('sort'), 'desc');
    assert.equal(params.has('address'), false);
});

test('v3 adapter bounds limit to the documented page size and never sends a negative offset', async () => {
    const { calls, fetchImpl } = recorder(() => ({ transactions: [] }));
    const client = new ToncenterV3Client({ fetchImpl });

    await client.getTransactions({ limit: 5000, offset: -7 });
    assert.equal(query(calls[0]).get('limit'), '100');
    // A negative offset is clamped to zero: the adapter never sends a
    // negative offset, and zero is a valid documented value.
    assert.equal(query(calls[0]).get('offset'), '0');

    await client.getTransactions({ limit: 0 });
    assert.equal(query(calls[1]).get('limit'), '1');
});

test('v3 adapter reads jetton wallets and returns the documented record fields', async () => {
    const record = {
        address: WALLET.toString(),
        balance: '1000000000',
        owner: OWNER.toString(),
        jetton: MASTER.toString(),
        code_hash: 'aa',
        data_hash: 'bb',
        last_transaction_lt: '42'
    };
    const { fetchImpl } = recorder(() => ({ jetton_wallets: [record], metadata: {} }));
    const client = new ToncenterV3Client({ fetchImpl });

    const response = await client.getJettonWallets({ ownerAddress: OWNER.toString() });
    assert.equal(response.jetton_wallets.length, 1);
    assert.equal(response.jetton_wallets[0].balance, '1000000000');
    assert.equal(response.jetton_wallets[0].owner, OWNER.toString());
});

test('v3 adapter paginates jetton transfers by offset and stops on an incomplete page', async () => {
    const transfer = (n: number) => ({
        amount: String(n),
        destination: OWNER.toString(),
        source: WALLET.toString(),
        jetton_master: MASTER.toString()
    });
    const { calls, fetchImpl } = recorder((call) => {
        const offset = Number(query(call).get('offset') ?? '0');
        const limit = Number(query(call).get('limit') ?? '2');
        const all = [transfer(1), transfer(2), transfer(3)];
        return { jetton_transfers: all.slice(offset, offset + limit) };
    });
    const client = new ToncenterV3Client({ fetchImpl });

    const pages: number[] = [];
    for await (const page of client.iterateJettonTransfers(
        { ownerAddress: OWNER.toString(), limit: 2 },
        { maxPages: 5 }
    )) {
        pages.push(page.items.length);
        if (page.nextOffset !== undefined) {
            assert.equal(page.nextOffset, page.offset + page.items.length);
        }
    }

    assert.deepEqual(pages, [2, 1]);
    assert.equal(query(calls[0]).get('offset'), '0');
    assert.equal(query(calls[1]).get('offset'), '2');
});

test('v3 adapter posts runGetMethod with the documented body and returns the stack', async () => {
    const { calls, fetchImpl } = recorder(() => ({ stack: [addressSliceStack(WALLET)] }));
    const client = new ToncenterV3Client({ fetchImpl });

    const stack = await client.runGetMethod(MASTER, 'get_wallet_address', [addressSliceStack(OWNER)]);

    const call = calls[0];
    assert.equal(calls[0].url, 'https://toncenter.com/api/v3/runGetMethod');
    assert.equal(call.method, 'POST');
    const body = JSON.parse(String(call.body)) as { address: string; method: string; stack: unknown[] };
    assert.equal(body.address, MASTER.toString());
    assert.equal(body.method, 'get_wallet_address');
    assert.deepEqual(body.stack[0], addressSliceStack(OWNER));
    assert.equal(stack.length, 1);
});

test('v3 adapter verifies a wallet against indexed state when the indexer confirms it', async () => {
    const { calls, fetchImpl } = recorder((call) => {
        if (call.url.includes('/runGetMethod')) return { stack: [addressSliceStack(WALLET)] };
        return {
            jetton_wallets: [
                {
                    address: WALLET.toString(),
                    balance: '2500000000',
                    owner: OWNER.toString(),
                    jetton: MASTER.toString()
                }
            ]
        };
    });
    const client = new ToncenterV3Client({ fetchImpl });

    const result = await client.verifyJettonWallet(MASTER, OWNER);

    assert.equal(result.wallet.toRawString(), WALLET.toRawString());
    assert.equal(result.owner.toRawString(), OWNER.toRawString());
    assert.equal(result.master.toRawString(), MASTER.toRawString());
    assert.equal(result.balance, 2500000000n);
    assert.equal(result.source, 'indexed');
    assert.equal(calls.length, 2);
});

test('v3 adapter rejects a wallet the indexer does not confirm', async () => {
    const { fetchImpl } = recorder((call) => {
        if (call.url.includes('/runGetMethod')) return { stack: [addressSliceStack(WALLET)] };
        return { jetton_wallets: [] };
    });
    const client = new ToncenterV3Client({ fetchImpl });

    await assert.rejects(
        client.verifyJettonWallet(MASTER, OWNER),
        /does not report exactly one jetton wallet/
    );
});

test('v3 adapter rejects a record whose indexed owner is not the requested owner', async () => {
    const { fetchImpl } = recorder((call) => {
        if (call.url.includes('/runGetMethod')) return { stack: [addressSliceStack(WALLET)] };
        return {
            jetton_wallets: [
                {
                    address: WALLET.toString(),
                    balance: '1',
                    owner: MASTER.toString(),
                    jetton: MASTER.toString()
                }
            ]
        };
    });
    const client = new ToncenterV3Client({ fetchImpl });

    await assert.rejects(
        client.verifyJettonWallet(MASTER, OWNER),
        /owner does not match the requested owner/
    );
});

test('v3 adapter rejects a wallet that is not derived by the allowlisted master', async () => {
    const { fetchImpl } = recorder(() => ({ stack: [addressSliceStack(WALLET)] }));
    const client = new ToncenterV3Client({ fetchImpl });

    await assert.rejects(
        client.verifyJettonWallet(MASTER, OWNER, MASTER),
        /not the address derived/
    );
});

test('v3 adapter rejects a non-integer indexed balance instead of rounding it', async () => {
    const { fetchImpl } = recorder((call) => {
        if (call.url.includes('/runGetMethod')) return { stack: [addressSliceStack(WALLET)] };
        return {
            jetton_wallets: [
                {
                    address: WALLET.toString(),
                    balance: '1.5',
                    owner: OWNER.toString(),
                    jetton: MASTER.toString()
                }
            ]
        };
    });
    const client = new ToncenterV3Client({ fetchImpl });

    await assert.rejects(
        client.verifyJettonWallet(MASTER, OWNER),
        /not an unsigned integer string/
    );
});

test('v3 adapter reads the documented account and action endpoints', async () => {
    const { calls, fetchImpl } = recorder((call) => {
        if (call.url.includes('/accountStates')) return { accounts: [], address_book: {}, metadata: {} };
        if (call.url.includes('/walletStates')) return { wallets: [], address_book: {}, metadata: {} };
        if (call.url.includes('/actions')) return { actions: [], next_cursor: 'cursor-1' };
        if (call.url.includes('/messages')) return { messages: [], address_book: {}, metadata: {} };
        return {
            balance: '123',
            status: 'active',
            last_transaction_lt: '9'
        };
    });
    const client = new ToncenterV3Client({ fetchImpl });

    const accounts = await client.getAccountStates(MASTER, { includeBoc: true });
    assert.deepEqual(accounts.accounts, []);
    assert.equal(query(calls[0]).get('address'), MASTER.toString());
    assert.equal(query(calls[0]).get('include_boc'), 'true');

    const wallets = await client.getWalletStates(OWNER);
    assert.deepEqual(wallets.wallets, []);
    assert.equal(query(calls[1]).get('address'), OWNER.toString());

    const actions = await client.getActions({ account: MASTER.toString(), limit: 5 });
    assert.equal(actions.next_cursor, 'cursor-1');
    assert.equal(query(calls[2]).get('account'), MASTER.toString());

    const messages = await client.getMessages({ destination: MASTER.toString(), onlyExternals: false });
    assert.deepEqual(messages.messages, []);
    assert.equal(query(calls[3]).get('only_externals'), 'false');

    const info = await client.getAddressInformation(MASTER);
    assert.equal(info.balance, '123');
    assert.equal(info.status, 'active');
    assert.equal(calls[4].url, `https://toncenter.com/api/v3/addressInformation?address=${encodeURIComponent(MASTER.toString())}`);
});

test('v3 adapter surfaces an HTTP failure with the endpoint path', async () => {
    const { fetchImpl } = recorder(() => ({ error: 'rate limited' }), 429);
    const client = new ToncenterV3Client({ fetchImpl });

    await assert.rejects(client.getJettonTransfers(), /\/jetton\/transfers returned HTTP 429/);
});
