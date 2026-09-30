/**
 * QUASAR — read-only Toncenter API v3 (TON Index) adapter.
 *
 * API v3 is the indexed access layer of TON Center: REST paths under `/api/v3`,
 * `X-API-Key` authentication and `limit`/`offset` pagination
 * (https://docs.ton.org/api/v3/overview).
 *
 * This module extends, and does not replace, `scripts/lib/ton_api.ts`: the v2
 * JSON-RPC client stays the default for get-method calls, while this adapter
 * adds indexed reads (jetton wallets, jetton transfers, transactions, account
 * and wallet states, messages, actions) and cross-validates a wallet derived
 * on-chain against the indexer.
 *
 * Every path, parameter and response field below was taken from the published
 * TON Index specification (`/api/v3/doc.json`, version 1.2.6). Fields the
 * specification does not describe are typed as `unknown` instead of being
 * guessed. The adapter only reads: it does not sign, send or broadcast.
 */
import { Address } from '@ton/core';
import { addressSliceStack, addressFromStack, type StackItem } from './ton_api.js';

export type ToncenterFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export type ToncenterV3Network = 'mainnet' | 'testnet';

/** Base URLs documented in the TON Center API v3 overview. */
export const TONCENTER_V3_BASE_URLS: Record<ToncenterV3Network, string> = {
    mainnet: 'https://toncenter.com/api/v3',
    testnet: 'https://testnet.toncenter.com/api/v3'
};

export type ToncenterV3Options = {
    /** Explicit base URL; when set it overrides `network`. */
    endpoint?: string;
    network?: ToncenterV3Network;
    apiKey?: string;
    fetchImpl?: ToncenterFetch;
};

/**
 * One bounded page plus the offset that continues it. API v3 paginates with
 * `limit`/`offset` rather than the v2 `lt`/`hash` cursor.
 */
export type V3Page<T> = {
    items: T[];
    limit: number;
    offset: number;
    nextOffset?: number;
};

/** `GET /jetton/wallets` record, per the TON Index schema. */
export type JettonWalletRecord = {
    address: string;
    balance: string;
    owner: string;
    jetton: string;
    code_hash?: string;
    data_hash?: string;
    last_transaction_lt?: string;
};

/** `GET /jetton/transfers` record, per the TON Index schema. */
export type JettonTransferRecord = {
    amount: string;
    destination: string;
    source: string;
    jetton_master: string;
    source_wallet?: string;
    query_id?: string;
    response_destination?: string;
    forward_ton_amount?: string;
    forward_payload?: string;
    transaction_hash?: string;
    transaction_lt?: string;
    transaction_now?: number;
    transaction_aborted?: boolean;
    trace_id?: string;
};

export type JettonMastersResponse = {
    jetton_masters: unknown[];
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

export type JettonWalletsResponse = {
    jetton_wallets: JettonWalletRecord[];
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

export type JettonTransfersResponse = {
    jetton_transfers: JettonTransferRecord[];
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

export type TransactionsResponse = {
    transactions: unknown[];
    address_book?: Record<string, unknown>;
};

export type ActionsResponse = {
    actions: unknown[];
    next_cursor?: string;
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

export type MessagesResponse = {
    messages: unknown[];
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

export type WalletStatesResponse = {
    wallets: unknown[];
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

export type AccountStatesResponse = {
    accounts: unknown[];
    address_book?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};

/** `GET /addressInformation` (the documented v2-compatible path of API v3). */
export type AddressInformation = {
    balance: string;
    status: string;
    code?: string;
    data?: string;
    frozen_hash?: string;
    last_transaction_hash?: string;
    last_transaction_lt?: string;
    suspended?: boolean;
};

export type BlockRef = {
    workchain: number;
    shard: string;
    seqno: number;
    file_hash?: string;
    root_hash?: string;
};

export type MasterchainInfo = { first: BlockRef; last: BlockRef };

export type JettonWalletsQuery = {
    address?: string;
    ownerAddress?: string;
    jettonAddress?: string;
    excludeZeroBalance?: boolean;
    limit?: number;
    offset?: number;
    /** The specification lists `sort` without enumerating its values. */
    sort?: string;
};

export type JettonTransfersQuery = {
    ownerAddress?: string;
    jettonWallet?: string;
    jettonMaster?: string;
    direction?: string;
    startUtime?: number;
    endUtime?: number;
    startLt?: string;
    endLt?: string;
    limit?: number;
    offset?: number;
    sort?: string;
};

export type JettonMastersQuery = {
    address?: string;
    adminAddress?: string;
    limit?: number;
    offset?: number;
};

export type TransactionsQuery = {
    account?: string;
    excludeAccount?: string;
    hash?: string;
    lt?: string;
    workchain?: number;
    shard?: string;
    seqno?: number;
    mcSeqno?: number;
    startUtime?: number;
    endUtime?: number;
    startLt?: string;
    endLt?: string;
    limit?: number;
    offset?: number;
    sort?: string;
};

export type MessagesQuery = {
    msgHash?: string;
    bodyHash?: string;
    source?: string;
    destination?: string;
    opcode?: string;
    startUtime?: number;
    endUtime?: number;
    startLt?: string;
    endLt?: string;
    direction?: string;
    excludeExternals?: boolean;
    onlyExternals?: boolean;
    limit?: number;
    offset?: number;
    sort?: string;
};

export type ActionsQuery = {
    account?: string;
    txHash?: string;
    msgHash?: string;
    actionId?: string;
    traceId?: string;
    mcSeqno?: number;
    startUtime?: number;
    endUtime?: number;
    startLt?: string;
    endLt?: string;
    actionType?: string;
    excludeActionType?: string;
    supportedActionTypes?: string;
    includeAccounts?: boolean;
    includeTransactions?: boolean;
    limit?: number;
    offset?: number;
    cursor?: string;
    sort?: string;
};

/** Default page size for v3 reads; the specification caps a page at 100. */
export const TONCENTER_V3_MAX_PAGE = 100;
const TONCENTER_V3_DEFAULT_PAGE = 20;

function pageOf<T>(items: T[], limit: number, offset: number): V3Page<T> {
    const nextOffset = items.length === limit ? offset + items.length : undefined;
    return { items, limit, offset, nextOffset };
}

function addressText(value: string | Address): string {
    return typeof value === 'string' ? value : value.toString();
}

export class ToncenterV3Client {
    private readonly endpoint: string;
    private readonly apiKey?: string;
    private readonly fetchImpl: ToncenterFetch;

    constructor(options: ToncenterV3Options = {}) {
        const network = options.network ?? 'mainnet';
        this.endpoint = (options.endpoint || TONCENTER_V3_BASE_URLS[network]).replace(/\/+$/, '');
        this.apiKey = options.apiKey;
        this.fetchImpl = options.fetchImpl || fetch;
    }

    /** The resolved base URL, so a caller can log which network it talks to. */
    get baseUrl(): string {
        return this.endpoint;
    }

    private headers(): Record<string, string> {
        const headers: Record<string, string> = { accept: 'application/json' };
        if (this.apiKey) headers['X-API-Key'] = this.apiKey;
        return headers;
    }

    private buildQuery(params: Record<string, unknown>): string {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null || value === '') continue;
            search.append(key, String(value));
        }
        const query = search.toString();
        return query ? `?${query}` : '';
    }

    private async read<T>(response: Response, label: string): Promise<T> {
        if (!response.ok) {
            throw new Error(`TON API v3 ${label} returned HTTP ${response.status}`);
        }
        const body = await response.json() as unknown;
        if (body && typeof body === 'object') {
            const envelope = body as { ok?: boolean; error?: string; result?: unknown };
            if (envelope.ok === false) {
                throw new Error(`TON API v3 ${label} failed: ${envelope.error || 'unknown error'}`);
            }
            // TON Index answers with a plain JSON object. A self-hosted build
            // that wraps the payload in the JSON-RPC envelope is unwrapped here.
            if ('result' in envelope) return envelope.result as T;
        }
        return body as T;
    }

    private validateAddress(value: string, field: string): string {
        Address.parse(value);
        return value;
    }

    private async get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
        const response = await this.fetchImpl(`${this.endpoint}${path}${this.buildQuery(params)}`, {
            method: 'GET',
            headers: this.headers()
        });
        return this.read<T>(response, path);
    }

    private async post<T>(path: string, payload: Record<string, unknown>): Promise<T> {
        const response = await this.fetchImpl(`${this.endpoint}${path}`, {
            method: 'POST',
            headers: { ...this.headers(), 'content-type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return this.read<T>(response, path);
    }

    private bound(limit?: number, offset?: number): { limit: number; offset: number } {
        const rawLimit = Number.isFinite(limit) ? Math.trunc(limit as number) : TONCENTER_V3_DEFAULT_PAGE;
        const rawOffset = Number.isFinite(offset) ? Math.trunc(offset as number) : 0;
        return {
            limit: Math.min(Math.max(rawLimit, 1), TONCENTER_V3_MAX_PAGE),
            offset: Math.max(rawOffset, 0)
        };
    }

    // ── blockchain data ────────────────────────────────────────────────────

    async getMasterchainInfo(): Promise<MasterchainInfo> {
        return this.get<MasterchainInfo>('/masterchainInfo');
    }

    async getAddressInformation(
        address: string | Address,
        options: { useV2?: boolean } = {}
    ): Promise<AddressInformation> {
        return this.get<AddressInformation>('/addressInformation', {
            address: addressText(address),
            use_v2: options.useV2
        });
    }

    async getAccountStates(
        address: string | Address,
        options: { includeBoc?: boolean } = {}
    ): Promise<AccountStatesResponse> {
        return this.get<AccountStatesResponse>('/accountStates', {
            address: this.validateAddress(addressText(address), 'address'),
            include_boc: options.includeBoc
        });
    }

    async getWalletStates(address: string | Address): Promise<WalletStatesResponse> {
        return this.get<WalletStatesResponse>('/walletStates', {
            address: this.validateAddress(addressText(address), 'address')
        });
    }

    async getTransactions(query: TransactionsQuery = {}): Promise<TransactionsResponse> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        return this.get<TransactionsResponse>('/transactions', {
            account: query.account,
            exclude_account: query.excludeAccount,
            hash: query.hash,
            lt: query.lt,
            workchain: query.workchain,
            shard: query.shard,
            seqno: query.seqno,
            mc_seqno: query.mcSeqno,
            start_utime: query.startUtime,
            end_utime: query.endUtime,
            start_lt: query.startLt,
            end_lt: query.endLt,
            limit,
            offset,
            sort: query.sort
        });
    }

    async getMessages(query: MessagesQuery = {}): Promise<MessagesResponse> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        return this.get<MessagesResponse>('/messages', {
            msg_hash: query.msgHash,
            body_hash: query.bodyHash,
            source: query.source,
            destination: query.destination,
            opcode: query.opcode,
            start_utime: query.startUtime,
            end_utime: query.endUtime,
            start_lt: query.startLt,
            end_lt: query.endLt,
            direction: query.direction,
            exclude_externals: query.excludeExternals,
            only_externals: query.onlyExternals,
            limit,
            offset,
            sort: query.sort
        });
    }

    async getActions(query: ActionsQuery = {}): Promise<ActionsResponse> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        return this.get<ActionsResponse>('/actions', {
            account: query.account,
            tx_hash: query.txHash,
            msg_hash: query.msgHash,
            action_id: query.actionId,
            trace_id: query.traceId,
            mc_seqno: query.mcSeqno,
            start_utime: query.startUtime,
            end_utime: query.endUtime,
            start_lt: query.startLt,
            end_lt: query.endLt,
            action_type: query.actionType,
            exclude_action_type: query.excludeActionType,
            supported_action_types: query.supportedActionTypes,
            include_accounts: query.includeAccounts,
            include_transactions: query.includeTransactions,
            limit,
            offset,
            cursor: query.cursor,
            sort: query.sort
        });
    }

    // ── jettons ───────────────────────────────────────────────────────────

    async getJettonMasters(query: JettonMastersQuery = {}): Promise<JettonMastersResponse> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        return this.get<JettonMastersResponse>('/jetton/masters', {
            address: query.address,
            admin_address: query.adminAddress,
            limit,
            offset
        });
    }

    async getJettonWallets(query: JettonWalletsQuery = {}): Promise<JettonWalletsResponse> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        return this.get<JettonWalletsResponse>('/jetton/wallets', {
            address: query.address,
            owner_address: query.ownerAddress,
            jetton_address: query.jettonAddress,
            exclude_zero_balance: query.excludeZeroBalance,
            limit,
            offset,
            sort: query.sort
        });
    }

    async getJettonTransfers(query: JettonTransfersQuery = {}): Promise<JettonTransfersResponse> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        return this.get<JettonTransfersResponse>('/jetton/transfers', {
            owner_address: query.ownerAddress,
            jetton_wallet: query.jettonWallet,
            jetton_master: query.jettonMaster,
            direction: query.direction,
            start_utime: query.startUtime,
            end_utime: query.endUtime,
            start_lt: query.startLt,
            end_lt: query.endLt,
            limit,
            offset,
            sort: query.sort
        });
    }

    /** One bounded page of jetton transfers plus the offset that continues it. */
    async jettonTransfersPage(query: JettonTransfersQuery = {}): Promise<V3Page<JettonTransferRecord>> {
        const { limit, offset } = this.bound(query.limit, query.offset);
        const response = await this.getJettonTransfers({ ...query, limit, offset });
        return pageOf(response.jetton_transfers, limit, offset);
    }

    async *iterateJettonTransfers(
        query: JettonTransfersQuery = {},
        options: { maxPages?: number } = {}
    ): AsyncGenerator<V3Page<JettonTransferRecord>, void, undefined> {
        const maxPages = Math.max(
            Number.isFinite(options.maxPages) ? Math.trunc(options.maxPages as number) : 1,
            1
        );
        let cursor = query.offset;
        for (let page = 0; page < maxPages; page += 1) {
            const result = await this.jettonTransfersPage({ ...query, offset: cursor });
            if (result.items.length === 0) return;
            yield result;
            if (result.nextOffset === undefined) return;
            cursor = result.nextOffset;
        }
    }

    // ── verification (the v2-compatible guarantees, against indexed state) ──

    async runGetMethod(
        address: string | Address,
        method: string,
        stack: unknown[] = []
    ): Promise<unknown[]> {
        const result = await this.post<{ stack?: unknown[] }>('/runGetMethod', {
            address: addressText(address),
            method,
            stack
        });
        if (!result || !Array.isArray(result.stack)) {
            throw new Error(`getter ${method} returned no stack`);
        }
        return result.stack;
    }

    async getJettonWalletAddress(master: string | Address, owner: string | Address): Promise<Address> {
        const stack = await this.runGetMethod(master, 'get_wallet_address', [addressSliceStack(owner)]);
        return addressFromStack(stack[0] as StackItem | undefined);
    }

    /**
     * Derives the wallet through the allowlisted master and then requires the
     * indexer to report exactly one matching `jetton/wallets` record whose
     * `owner` and `jetton` both match the request. A derived address that the
     * indexer does not confirm is rejected rather than trusted.
     */
    async verifyJettonWallet(
        master: string | Address,
        owner: string | Address,
        wallet?: string | Address
    ): Promise<{ wallet: Address; owner: Address; master: Address; balance: bigint; source: 'indexed' }> {
        const expectedMaster = typeof master === 'string' ? Address.parse(master) : master;
        const expectedOwner = typeof owner === 'string' ? Address.parse(owner) : owner;

        const derived = await this.getJettonWalletAddress(expectedMaster, expectedOwner);
        const requested = wallet === undefined
            ? derived
            : (typeof wallet === 'string' ? Address.parse(wallet) : wallet);
        if (requested.toRawString() !== derived.toRawString()) {
            throw new Error('jetton wallet is not the address derived by the allowlisted master');
        }

        const response = await this.getJettonWallets({
            ownerAddress: expectedOwner.toString(),
            jettonAddress: expectedMaster.toString(),
            limit: TONCENTER_V3_MAX_PAGE,
            offset: 0
        });
        const matches = response.jetton_wallets.filter((record) =>
            Address.parse(record.address).toRawString() === derived.toRawString()
        );
        if (matches.length !== 1) {
            throw new Error('the indexer does not report exactly one jetton wallet for this owner and master');
        }
        const record = matches[0];
        if (Address.parse(record.owner).toRawString() !== expectedOwner.toRawString()) {
            throw new Error('indexed jetton wallet owner does not match the requested owner');
        }
        if (Address.parse(record.jetton).toRawString() !== expectedMaster.toRawString()) {
            throw new Error('indexed jetton wallet master is not allowlisted');
        }
        if (!/^\d+$/.test(record.balance)) {
            throw new Error('indexed jetton wallet balance is not an unsigned integer string');
        }

        return {
            wallet: derived,
            owner: expectedOwner,
            master: expectedMaster,
            balance: BigInt(record.balance),
            source: 'indexed'
        };
    }
}
