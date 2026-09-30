import { Address, beginCell, Cell } from '@ton/core';

export type ToncenterFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export type ToncenterOptions = {
    endpoint?: string;
    apiKey?: string;
    fetchImpl?: ToncenterFetch;
};

export type TransactionPage = {
    transactions: unknown[];
    next?: { lt: string; hash: string };
};

export type StackItem = [string, unknown] | { type?: string; value?: unknown };

function stackValue(item: StackItem | undefined): unknown {
    if (!item) return undefined;
    return Array.isArray(item) ? item[1] : item.value;
}

export function addressFromStack(item: StackItem | undefined): Address {
    const value = stackValue(item);
    const bytes = typeof value === 'object' && value !== null
        ? (value as { bytes?: string }).bytes
        : value;
    if (typeof bytes !== 'string') throw new Error('getter did not return an address slice');
    return Cell.fromBase64(bytes).beginParse().loadAddress();
}

function numberFromStack(item: StackItem | undefined): bigint {
    const value = stackValue(item);
    if (typeof value === 'string') return BigInt(value);
    if (typeof value === 'object' && value !== null && 'bytes' in value) {
        const bytes = (value as { bytes: string }).bytes;
        const raw = Buffer.from(bytes, 'base64');
        return raw.reduce((result, byte) => (result << 8n) | BigInt(byte), 0n);
    }
    throw new Error('getter did not return a numeric stack value');
}

export function addressSliceStack(address: string | Address): [string, { bytes: string }] {
    const parsed = typeof address === 'string' ? Address.parse(address) : address;
    return ['slice', { bytes: beginCell().storeAddress(parsed).endCell().toBoc().toString('base64') }];
}

export class ToncenterClient {
    private readonly endpoint: string;
    private readonly apiKey?: string;
    private readonly fetchImpl: ToncenterFetch;

    constructor(options: ToncenterOptions = {}) {
        this.endpoint = (options.endpoint || 'https://testnet.toncenter.com/api/v2/jsonRPC').replace(/\/+$/, '');
        this.apiKey = options.apiKey;
        this.fetchImpl = options.fetchImpl || fetch;
    }

    private async jsonRpc(method: string, params: Record<string, unknown>): Promise<unknown> {
        const headers: Record<string, string> = { 'content-type': 'application/json' };
        if (this.apiKey) headers['X-API-Key'] = this.apiKey;
        const response = await this.fetchImpl(this.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({ id: Date.now(), jsonrpc: '2.0', method, params })
        });
        if (!response.ok) throw new Error(`TON API ${method} returned HTTP ${response.status}`);
        const body = await response.json() as { ok?: boolean; result?: unknown; error?: { message?: string } };
        if (!body.ok && body.result === undefined) {
            throw new Error(`TON API ${method} failed: ${body.error?.message || 'unknown error'}`);
        }
        return body.result;
    }

    async getAddressBalance(address: string | Address): Promise<bigint> {
        const result = await this.jsonRpc('getAddressBalance', {
            address: typeof address === 'string' ? address : address.toString()
        });
        return BigInt(String(result));
    }

    async runGetMethod(address: string | Address, method: string, stack: unknown[] = []): Promise<unknown[]> {
        const result = await this.jsonRpc('runGetMethod', {
            address: typeof address === 'string' ? address : address.toString(),
            method,
            stack
        }) as { stack?: unknown[] };
        if (!result || !Array.isArray(result.stack)) throw new Error(`getter ${method} returned no stack`);
        return result.stack;
    }

    async getTransactionsPage(
        address: string | Address,
        options: { limit?: number; lt?: string; hash?: string } = {}
    ): Promise<TransactionPage> {
        const result = await this.jsonRpc('getTransactions', {
            address: typeof address === 'string' ? address : address.toString(),
            limit: Math.min(Math.max(options.limit || 20, 1), 100),
            ...(options.lt ? { lt: options.lt } : {}),
            ...(options.hash ? { hash: options.hash } : {})
        }) as unknown[];
        const transactions = Array.isArray(result) ? result : [];
        const last = transactions.at(-1) as { transaction_id?: { lt?: string; hash?: string } } | undefined;
        const lt = last?.transaction_id?.lt;
        const hash = last?.transaction_id?.hash;
        return {
            transactions,
            next: transactions.length > 0 && lt && hash ? { lt, hash } : undefined
        };
    }

    async *iterateTransactions(
        address: string | Address,
        options: { limit?: number; maxPages?: number } = {}
    ): AsyncGenerator<unknown[], void, undefined> {
        let cursor: { lt: string; hash: string } | undefined;
        const maxPages = Math.max(options.maxPages || 1, 1);
        for (let page = 0; page < maxPages; page += 1) {
            const result = await this.getTransactionsPage(address, { ...options, ...cursor });
            if (result.transactions.length === 0) return;
            yield result.transactions;
            if (!result.next) return;
            cursor = result.next;
        }
    }

    async getJettonWalletAddress(master: string | Address, owner: string | Address): Promise<Address> {
        const stack = await this.runGetMethod(master, 'get_wallet_address', [
            addressSliceStack(owner)
        ]);
        return addressFromStack(stack[0] as StackItem | undefined);
    }

    async verifyJettonWallet(
        master: string | Address,
        owner: string | Address,
        wallet?: string | Address
    ): Promise<{ wallet: Address; owner: Address; master: Address; balance: bigint }> {
        const expectedMaster = typeof master === 'string' ? Address.parse(master) : master;
        const expectedOwner = typeof owner === 'string' ? Address.parse(owner) : owner;
        const derivedWallet = await this.getJettonWalletAddress(expectedMaster, expectedOwner);
        const actualWallet = wallet
            ? (typeof wallet === 'string' ? Address.parse(wallet) : wallet)
            : derivedWallet;
        if (actualWallet.toRawString() !== derivedWallet.toRawString()) {
            throw new Error('jetton wallet is not the address derived by the allowlisted master');
        }

        const stack = await this.runGetMethod(actualWallet, 'get_wallet_data');
        const actualOwner = addressFromStack(stack[1] as StackItem | undefined);
        const actualMaster = addressFromStack(stack[2] as StackItem | undefined);
        if (actualOwner.toRawString() !== expectedOwner.toRawString()) {
            throw new Error('jetton wallet owner does not match the requested owner');
        }
        if (actualMaster.toRawString() !== expectedMaster.toRawString()) {
            throw new Error('jetton wallet master is not allowlisted');
        }
        return {
            wallet: actualWallet,
            owner: actualOwner,
            master: actualMaster,
            balance: numberFromStack(stack[0] as StackItem | undefined)
        };
    }
}