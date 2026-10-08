import assert from 'node:assert/strict';
import test from 'node:test';
import {
    main,
    requestOracleDecision,
    type OracleProvider,
    type OracleRequest
} from '../scripts/ai_oracle.js';
import type { OracleObservation } from '../scripts/oracle_signals.js';

const NOW = 1_800_000_000_000;

function observations(options: { count?: number; lastTimestampMs?: number; drawdown?: boolean } = {}): OracleObservation[] {
    const count = options.count ?? 24;
    return Array.from({ length: count }, (_, index) => ({
        timestampMs:
            (options.lastTimestampMs ?? NOW) - (count - index - 1) * 1_000,
        priceUsd: options.drawdown && index === count - 1 ? 0.6 : 1,
        liquidityUsd: 100_000,
        outflowUsd: options.drawdown && index === count - 1 ? 25_000 : 0
    }));
}

function fakeProvider(text = '{"action":"distribute","riskScore":5,"confidence":0.95,"rationale":"bounded test response"}'): {
    provider: OracleProvider;
    requests: OracleRequest[];
} {
    const requests: OracleRequest[] = [];
    return {
        requests,
        provider: {
            name: 'test',
            model: 'offline-test',
            complete: async (request) => {
                requests.push(request);
                return { provider: 'test', model: 'offline-test', text };
            }
        }
    };
}

test('risk telemetry is included as deterministic context and cannot be understated', async () => {
    const { provider, requests } = fakeProvider();
    const result = await requestOracleDecision(provider, 'review QUASAR risk', {
        observations: observations(),
        nowMs: NOW
    });

    assert.equal(requests.length, 1);
    assert.match(requests[0]!.prompt, /Deterministic signal preflight/);
    assert.equal(result.action, 'distribute');
    assert.ok(result.signalAnalysis);
    assert.ok(result.riskScore >= result.signalAnalysis.riskScore!);
    assert.ok(result.confidence <= result.signalAnalysis.confidence);
});

test('high-risk telemetry returns hold without calling the model', async () => {
    const { provider, requests } = fakeProvider();
    const result = await requestOracleDecision(provider, 'review risk', {
        observations: observations({ drawdown: true }),
        nowMs: NOW
    });

    assert.equal(requests.length, 0);
    assert.equal(result.action, 'hold');
    assert.equal(result.riskScore, 100);
    assert.equal(result.confidence, 0);
    assert.equal(result.signalAnalysis?.modelAllowed, false);
});

test('the CLI fails closed on stale telemetry without requiring an API key', async () => {
    const out: string[] = [];
    const code = await main(['--observations', 'snapshot.json', 'assess risk'], {
        env: {},
        nowMs: NOW,
        readTextFile: async () => JSON.stringify({ observations: observations({ lastTimestampMs: NOW - 600_000 }) }),
        stdout: (line) => out.push(line),
        stderr: () => {}
    });

    assert.equal(code, 0);
    const result = JSON.parse(out.join('\n')) as {
        provider: string;
        decision: { action: string; confidence: number; signalAnalysis?: { status: string } };
    };
    assert.equal(result.provider, 'deterministic-risk-gate');
    assert.equal(result.decision.action, 'hold');
    assert.equal(result.decision.confidence, 0);
    assert.equal(result.decision.signalAnalysis?.status, 'stale');
});

test('the CLI loads a healthy normalized snapshot and passes it to the injected provider', async () => {
    const { provider, requests } = fakeProvider('{"action":"hold","riskScore":10,"confidence":0.8,"rationale":"watch"}');
    const out: string[] = [];
    const code = await main(['--observations', 'snapshot.json', 'assess risk'], {
        env: {},
        nowMs: NOW,
        provider,
        readTextFile: async () => JSON.stringify(observations()),
        stdout: (line) => out.push(line),
        stderr: () => {},
    });

    assert.equal(code, 0);
    assert.equal(requests.length, 1);
    assert.match(requests[0]!.prompt, /Deterministic signal preflight/);
    assert.equal(JSON.parse(out.join('\n')).decision.signalAnalysis.status, 'ready');
});
