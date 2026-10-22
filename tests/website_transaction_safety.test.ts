import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { Address, beginCell, Cell } from '@ton/core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const amountsSource = readFileSync(join(root, 'website', 'amounts.js'), 'utf8');
const tonconnectSource = readFileSync(join(root, 'website', 'tonconnect.js'), 'utf8');
const TESTNET_CHAIN = '-3';

function loadAmounts() {
    const sandbox: Record<string, unknown> = {};
    sandbox.window = sandbox;
    vm.runInNewContext(amountsSource, sandbox, { filename: 'website/amounts.js' });
    return sandbox.QUASARAmounts as {
        MAX_COINS: bigint;
        assertCoinRange(value: bigint): bigint;
        parsePositiveNanoAmount(value: string, decimals?: number): bigint;
    };
}

test('website amounts preserve every nanotoken and reject invalid decimal or Coins values', () => {
    const amounts = loadAmounts();
    assert.equal(amounts.parsePositiveNanoAmount('9007199.254740993'), 9007199254740993n);
    assert.equal(amounts.parsePositiveNanoAmount('1000000000000000.000000001'), 1000000000000000000000001n);
    assert.equal(amounts.parsePositiveNanoAmount('42.123456789'), 42123456789n);

    const maxInput = `${amounts.MAX_COINS / 1000000000n}.${(amounts.MAX_COINS % 1000000000n).toString().padStart(9, '0')}`;
    assert.equal(amounts.parsePositiveNanoAmount(maxInput), amounts.MAX_COINS);
    assert.throws(() => amounts.parsePositiveNanoAmount('1.1234567890'), /at most 9/);
    assert.throws(() => amounts.parsePositiveNanoAmount('0'), /greater than zero/);
    assert.throws(() => amounts.parsePositiveNanoAmount('-1'), /decimal amount/);
    assert.throws(() => amounts.parsePositiveNanoAmount('1e3'), /decimal amount/);
    assert.throws(() => amounts.parsePositiveNanoAmount((amounts.MAX_COINS / 1000000000n + 1n).toString()), /Coins range/);
});

interface Deferred<T> {
    promise: Promise<T>;
    resolve(value: T): void;
    reject(reason?: unknown): void;
}

function deferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((onResolve, onReject) => {
        resolve = onResolve;
        reject = onReject;
    });
    return { promise, resolve, reject };
}

function testnetAddress(fill: string) {
    return Address.parseRaw(`0:${fill.repeat(64)}`).toString({ testOnly: true });
}

function rawAddress(fill: string) {
    return Address.parseRaw(`0:${fill.repeat(64)}`).toRawString();
}

interface Runtime {
    hooks: {
        initTonConnect(): void;
        stakeQsr(amount: bigint): Promise<unknown>;
        depositQsr(target: 'master' | 'defi', amount: bigint): Promise<unknown>;
        isQuasarTestnetConfigReady(config: unknown): boolean;
    };
    ui: {
        account?: { address: string; chain: string };
        emit(wallet: { account: { address: string; chain: string } } | null): void;
        sendTransaction(request: unknown): Promise<unknown>;
    };
    requests: Array<Record<string, unknown>>;
    controls: Array<{ disabled: boolean }>;
    config: { network: string; addresses: { master: string; defi: string } };
    setFetch(fetchImpl: (url: string, init?: unknown) => Promise<unknown>): void;
}

function loadTonConnectRuntime(): Runtime {
    const master = testnetAddress('1');
    const defi = testnetAddress('2');
    const requests: Array<Record<string, unknown>> = [];
    const controls = [{ disabled: false }, { disabled: true }];
    const walletAddress = { textContent: '' };
    const appSection = { classList: { add() {}, remove() {} } };
    const toasts: string[] = [];
    let ui: Runtime['ui'] | null = null;
    let fetchImpl: (url: string, init?: unknown) => Promise<unknown> = async () => {
        throw new Error('network is not mocked for this test');
    };
    const browserBeginCell = () => {
        const builder = beginCell() as any;
        const endCell = builder.endCell.bind(builder);
        builder.endCell = () => {
            const cell = endCell();
            // Model the toB64 interface used by the browser source while this
            // vm supplies the installed Node primitive for BOC construction.
            return {
                toB64: () => Buffer.from(cell.toBoc()).toString('base64'),
                toBoc: (...args: unknown[]) => cell.toBoc(...args),
            };
        };
        return builder;
    };

    class TonConnectUI {
        account?: { address: string; chain: string };
        private statusCallback: ((wallet: { account: { address: string; chain: string } } | null) => void) | null = null;

        constructor(_: unknown) {
            ui = this as unknown as Runtime['ui'];
        }

        onStatusChange(callback: (wallet: { account: { address: string; chain: string } } | null) => void) {
            this.statusCallback = callback;
        }

        emit(wallet: { account: { address: string; chain: string } } | null) {
            this.account = wallet?.account;
            this.statusCallback?.(wallet);
        }

        async sendTransaction(request: unknown) {
            requests.push(request as Record<string, unknown>);
            return { boc: 'submitted' };
        }
    }

    // Run the browser module as a script with real TON primitives and a mocked
    // TonConnect UI. Production exports are exposed only inside this vm context.
    const transformed = tonconnectSource
        .replace(
            "import { beginCell, Cell, Address } from 'https://esm.sh/@ton/core@0.63.1?bundle';",
            'const { beginCell, Cell, Address } = globalThis.__tonCore;',
        )
        .replace(/\bexport\s+(?=(async\s+function|function|const|let|class)\b)/g, '')
        + '\nglobalThis.__websiteTestHooks = { initTonConnect, stakeQsr, depositQsr, isQuasarTestnetConfigReady };';

    const sandbox: Record<string, any> = {
        __tonCore: { beginCell: browserBeginCell, Cell, Address },
        console: { error() {}, warn() {}, log() {} },
        Date,
        BigInt,
        WeakMap,
        Promise,
        setTimeout() { return 0; },
        clearTimeout() {},
        btoa(value: string) { return Buffer.from(value, 'binary').toString('base64'); },
        atob(value: string) { return Buffer.from(value, 'base64').toString('binary'); },
        document: {
            getElementById(id: string) {
                if (id === 'wallet-address') return walletAddress;
                if (id === 'defi') return appSection;
                return null;
            },
            querySelectorAll() { return controls; },
        },
        fetch(url: string, init?: unknown) { return fetchImpl(url, init); },
        TON_CONNECT_UI: { TonConnectUI },
        QUASAR_CONFIG: { network: 'testnet', addresses: { master, defi } },
        showToast(message: string) { toasts.push(message); },
    };
    sandbox.window = sandbox;
    vm.runInNewContext(transformed, sandbox, { filename: 'website/tonconnect.js' });
    const hooks = sandbox.__websiteTestHooks as Runtime['hooks'];
    hooks.initTonConnect();
    assert.ok(ui, 'TonConnect UI must initialize for valid testnet-friendly addresses');

    return {
        hooks,
        ui: ui!,
        requests,
        controls,
        config: sandbox.QUASAR_CONFIG,
        setFetch(implementation) { fetchImpl = implementation; },
    };
}

test('website rejects non-testnet and stale wallet accounts before TonConnect sendTransaction', async () => {
    const runtime = loadTonConnectRuntime();
    const owner = rawAddress('3');

    assert.equal(runtime.hooks.isQuasarTestnetConfigReady(runtime.config), true);
    assert.equal(runtime.hooks.isQuasarTestnetConfigReady({ ...runtime.config, addresses: { ...runtime.config.addresses, master: rawAddress('1') } }), true);
    assert.equal(runtime.hooks.isQuasarTestnetConfigReady({ ...runtime.config, network: 'mainnet' }), false);
    assert.equal(runtime.hooks.isQuasarTestnetConfigReady({ ...runtime.config, addresses: { ...runtime.config.addresses, master: 'invalid' } }), false);

    runtime.ui.emit({ account: { address: owner, chain: '-239' } });
    await runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 0, 'a mainnet wallet must be stopped before sendTransaction');

    runtime.ui.emit({ account: { address: owner, chain: TESTNET_CHAIN } });
    await runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 1);
    const request = runtime.requests[0];
    assert.equal(request.network, TESTNET_CHAIN);
    assert.equal(request.from, owner);
    assert.equal((request.messages as Array<Record<string, unknown>>)[0].address, runtime.config.addresses.master);
    assert.ok(typeof request.validUntil === 'number' && request.validUntil > Math.floor(Date.now() / 1000));

    runtime.ui.account = { address: rawAddress('4'), chain: TESTNET_CHAIN };
    await runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 1, 'a changed account must be stopped before sendTransaction');

    runtime.ui.account = { address: owner, chain: '-239' };
    await runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 1, 'a changed network must be stopped before sendTransaction');
});

test('website accepts deployment address formats but always signs a testnet-tagged target', async () => {
    const runtime = loadTonConnectRuntime();
    runtime.ui.emit({ account: { address: rawAddress('3'), chain: TESTNET_CHAIN } });
    for (const master of [rawAddress('1'), Address.parseRaw(rawAddress('1')).toString()]) {
        runtime.config.addresses.master = master;
        assert.equal(runtime.hooks.isQuasarTestnetConfigReady(runtime.config), true);
        await runtime.hooks.stakeQsr(1n);
        const request = runtime.requests[runtime.requests.length - 1];
        const target = (request.messages as Array<{ address: string }>)[0].address;
        assert.equal(Address.parseFriendly(target).isTestOnly, true);
        assert.ok(Address.parse(target).equals(Address.parse(master)));
        assert.equal(request.network, TESTNET_CHAIN);
    }
    assert.equal(runtime.requests.length, 2);
});

test('website signature mutex disables controls and recovers after resolve and rejection', async () => {
    const runtime = loadTonConnectRuntime();
    const owner = rawAddress('5');
    runtime.ui.emit({ account: { address: owner, chain: TESTNET_CHAIN } });

    const first = deferred<{ boc: string }>();
    runtime.ui.sendTransaction = async request => {
        runtime.requests.push(request as Record<string, unknown>);
        return first.promise;
    };
    const firstCall = runtime.hooks.stakeQsr(1n);
    const duplicate = runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 1, 'a pending signature must suppress a second wallet request');
    assert.deepEqual(runtime.controls.map(control => control.disabled), [true, true]);
    first.resolve({ boc: 'first' });
    await Promise.all([firstCall, duplicate]);
    assert.deepEqual(runtime.controls.map(control => control.disabled), [false, true], 'original disabled state must be restored');

    const rejected = deferred<{ boc: string }>();
    runtime.ui.sendTransaction = async request => {
        runtime.requests.push(request as Record<string, unknown>);
        return rejected.promise;
    };
    const rejectedCall = runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 2);
    rejected.reject(new Error('wallet rejected'));
    await rejectedCall;
    assert.deepEqual(runtime.controls.map(control => control.disabled), [false, true], 'controls must recover after rejection');

    runtime.ui.sendTransaction = async request => {
        runtime.requests.push(request as Record<string, unknown>);
        return { boc: 'recovered' };
    };
    await runtime.hooks.stakeQsr(1n);
    assert.equal(runtime.requests.length, 3, 'a new signature must be allowed after rejection cleanup');
});

test('website deposit keeps its account snapshot and rejects an account changed during getter', async () => {
    const runtime = loadTonConnectRuntime();
    const owner = rawAddress('6');
    runtime.ui.emit({ account: { address: owner, chain: TESTNET_CHAIN } });

    const getter = deferred<{ json(): Promise<unknown> }>();
    runtime.setFetch(async () => getter.promise);
    const deposit = runtime.hooks.depositQsr('defi', 1n);

    runtime.ui.account = { address: rawAddress('7'), chain: TESTNET_CHAIN };
    const jettonWallet = rawAddress('8');
    const responseAddress = Buffer.from(beginCell().storeAddress(Address.parse(jettonWallet)).endCell().toBoc()).toString('base64');
    getter.resolve({ json: async () => ({ result: { stack: [['slice', { bytes: responseAddress }]] } }) });

    await deposit;
    assert.equal(runtime.requests.length, 0, 'deposit must not sign a payload whose response destination uses a stale account');
});
