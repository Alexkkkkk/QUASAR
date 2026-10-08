import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeOracleSignals, type OracleObservation } from '../scripts/oracle_signals.js';

function stableObservations(nowMs: number, count = 24): OracleObservation[] {
    return Array.from({ length: count }, (_, index) => ({
        timestampMs: nowMs - (count - index - 1) * 1_000,
        priceUsd: 1,
        liquidityUsd: 100_000,
        outflowUsd: 0
    }));
}

test('stable fresh telemetry produces a bounded low-risk analysis', () => {
    const nowMs = 1_800_000_000_000;
    const input = stableObservations(nowMs);
    const before = structuredClone(input);

    const result = analyzeOracleSignals(input, { nowMs });

    assert.equal(result.status, 'ready');
    assert.equal(result.sampleCount, 24);
    assert.equal(result.modelAllowed, true);
    assert.equal(result.riskScore, 0);
    assert.equal(result.confidence, 1);
    assert.equal(result.anomalyCount, 0);
    assert.deepEqual(input, before, 'analysis must not mutate caller data');
});

test('a price/liquidity drawdown and large outflow close the model gate', () => {
    const nowMs = 1_800_000_000_000;
    const input = stableObservations(nowMs);
    input[23] = {
        ...input[23]!,
        priceUsd: 0.65,
        liquidityUsd: 60_000,
        outflowUsd: 25_000
    };

    const result = analyzeOracleSignals(input, { nowMs });

    assert.equal(result.status, 'ready');
    assert.equal(result.riskScore, 100);
    assert.equal(result.modelAllowed, false);
    assert.ok(result.blockers.some((blocker) => blocker.includes('risk score')));
    assert.ok((result.anomalyCount ?? 0) > 0);
});

test('insufficient and stale windows never pass the model gate', () => {
    const nowMs = 1_800_000_000_000;
    const short = analyzeOracleSignals(stableObservations(nowMs, 8), { nowMs });
    const staleInput = stableObservations(nowMs - 600_000);
    const stale = analyzeOracleSignals(staleInput, { nowMs });

    assert.equal(short.status, 'insufficient');
    assert.equal(short.modelAllowed, false);
    assert.equal(short.confidence, 0);
    assert.equal(stale.status, 'stale');
    assert.equal(stale.modelAllowed, false);
    assert.equal(stale.confidence, 0);
});

test('invalid, unordered, and oversized observations are rejected', () => {
    const nowMs = 1_800_000_000_000;
    const valid = stableObservations(nowMs);

    assert.throws(() => analyzeOracleSignals([{ ...valid[0]!, priceUsd: 0 }], { nowMs }), /priceUsd/);
    assert.throws(
        () => analyzeOracleSignals([valid[1]!, valid[0]!], { nowMs }),
        /strictly increasing/
    );
    assert.throws(
        () => analyzeOracleSignals(stableObservations(nowMs, 513), { nowMs }),
        /more than 512/
    );
});
