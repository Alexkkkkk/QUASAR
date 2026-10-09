/**
 * Deterministic, off-chain signal preflight for the QUASAR AI oracle.
 *
 * Inputs must already be normalized by a trusted data adapter. This module
 * never fetches market data, signs a decision, or performs an on-chain action.
 */

export type OracleObservation = {
    timestampMs: number;
    priceUsd: number;
    liquidityUsd: number;
    outflowUsd: number;
};

export type OracleSignalOptions = {
    nowMs?: number;
    minSamples?: number;
    maxAgeMs?: number;
    maxRiskScore?: number;
    minConfidence?: number;
    maxVolatilityPct?: number;
    maxDrawdownPct?: number;
    maxOutflowRatioPct?: number;
    maxAnomalyRatePct?: number;
};

export type OracleSignalAnalysis = {
    status: 'ready' | 'insufficient' | 'stale';
    sampleCount: number;
    latestTimestampMs: number | null;
    priceVolatilityPct: number | null;
    maxPriceDrawdownPct: number | null;
    maxLiquidityDrawdownPct: number | null;
    outflowToLiquidityPct: number | null;
    anomalyCount: number | null;
    anomalyRatePct: number | null;
    riskScore: number | null;
    confidence: number;
    modelAllowed: boolean;
    blockers: string[];
};

export const ORACLE_SIGNAL_DEFAULTS = {
    minSamples: 24,
    maxAgeMs: 5 * 60_000,
    maxRiskScore: 70,
    minConfidence: 0.7,
    maxVolatilityPct: 5,
    maxDrawdownPct: 25,
    maxOutflowRatioPct: 10,
    maxAnomalyRatePct: 10,
    ewmaLambda: 0.94,
    modifiedZScoreLimit: 3.5,
    maxSamples: 512,
    futureClockSkewMs: 30_000
} as const;

function requirePositive(name: string, value: number): void {
    if (!Number.isFinite(value) || value <= 0) {
        throw new RangeError(`${name} must be a finite positive number`);
    }
}

function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[middle - 1]! + sorted[middle]!) / 2
        : sorted[middle]!;
}

function maximumDrawdown(values: number[]): number {
    let peak = values[0]!;
    let drawdown = 0;
    for (const value of values) {
        peak = Math.max(peak, value);
        drawdown = Math.max(drawdown, ((peak - value) / peak) * 100);
    }
    return drawdown;
}

function clampScore(value: number): number {
    return Math.max(0, Math.min(100, value));
}

function round(value: number, digits = 4): number {
    const scale = 10 ** digits;
    return Math.round(value * scale) / scale;
}

/**
 * Analyze a bounded window of normalized price, liquidity, and outflow data.
 * Risk is the maximum of four independently normalized stress signals; this
 * avoids averaging away one severe drawdown or outflow spike.
 */
export function analyzeOracleSignals(
    observations: OracleObservation[],
    options: OracleSignalOptions = {}
): OracleSignalAnalysis {
    if (!Array.isArray(observations)) {
        throw new TypeError('observations must be an array');
    }

    const nowMs = options.nowMs ?? Date.now();
    const minSamples = options.minSamples ?? ORACLE_SIGNAL_DEFAULTS.minSamples;
    const maxAgeMs = options.maxAgeMs ?? ORACLE_SIGNAL_DEFAULTS.maxAgeMs;
    const maxRiskScore = options.maxRiskScore ?? ORACLE_SIGNAL_DEFAULTS.maxRiskScore;
    const minConfidence = options.minConfidence ?? ORACLE_SIGNAL_DEFAULTS.minConfidence;
    const maxVolatilityPct = options.maxVolatilityPct ?? ORACLE_SIGNAL_DEFAULTS.maxVolatilityPct;
    const maxDrawdownPct = options.maxDrawdownPct ?? ORACLE_SIGNAL_DEFAULTS.maxDrawdownPct;
    const maxOutflowRatioPct = options.maxOutflowRatioPct ?? ORACLE_SIGNAL_DEFAULTS.maxOutflowRatioPct;
    const maxAnomalyRatePct = options.maxAnomalyRatePct ?? ORACLE_SIGNAL_DEFAULTS.maxAnomalyRatePct;

    if (!Number.isFinite(nowMs)) throw new RangeError('nowMs must be finite');
    if (!Number.isInteger(minSamples) || minSamples < 2 || minSamples > ORACLE_SIGNAL_DEFAULTS.maxSamples) {
        throw new RangeError(`minSamples must be an integer from 2 to ${ORACLE_SIGNAL_DEFAULTS.maxSamples}`);
    }
    requirePositive('maxAgeMs', maxAgeMs);
    requirePositive('maxVolatilityPct', maxVolatilityPct);
    requirePositive('maxDrawdownPct', maxDrawdownPct);
    requirePositive('maxOutflowRatioPct', maxOutflowRatioPct);
    requirePositive('maxAnomalyRatePct', maxAnomalyRatePct);
    if (!Number.isFinite(maxRiskScore) || maxRiskScore < 0 || maxRiskScore > 100) {
        throw new RangeError('maxRiskScore must be between 0 and 100');
    }
    if (!Number.isFinite(minConfidence) || minConfidence < 0 || minConfidence > 1) {
        throw new RangeError('minConfidence must be between 0 and 1');
    }
    if (observations.length > ORACLE_SIGNAL_DEFAULTS.maxSamples) {
        throw new RangeError(`observations cannot contain more than ${ORACLE_SIGNAL_DEFAULTS.maxSamples} samples`);
    }

    let previousTimestamp = -Infinity;
    for (let index = 0; index < observations.length; index += 1) {
        const sample = observations[index];
        if (!sample || typeof sample !== 'object') {
            throw new TypeError(`observation ${index} must be an object`);
        }
        if (!Number.isFinite(sample.timestampMs) || sample.timestampMs <= previousTimestamp) {
            throw new RangeError(`observation ${index} timestampMs must be finite and strictly increasing`);
        }
        if (sample.timestampMs > nowMs + ORACLE_SIGNAL_DEFAULTS.futureClockSkewMs) {
            throw new RangeError(`observation ${index} timestampMs is too far in the future`);
        }
        if (!Number.isFinite(sample.priceUsd) || sample.priceUsd <= 0) {
            throw new RangeError(`observation ${index} priceUsd must be finite and positive`);
        }
        if (!Number.isFinite(sample.liquidityUsd) || sample.liquidityUsd <= 0) {
            throw new RangeError(`observation ${index} liquidityUsd must be finite and positive`);
        }
        if (!Number.isFinite(sample.outflowUsd) || sample.outflowUsd < 0) {
            throw new RangeError(`observation ${index} outflowUsd must be finite and non-negative`);
        }
        previousTimestamp = sample.timestampMs;
    }

    const latestTimestampMs = observations.at(-1)?.timestampMs ?? null;
    const latestAgeMs = latestTimestampMs === null ? Infinity : Math.max(0, nowMs - latestTimestampMs);
    const stale = latestTimestampMs !== null && latestAgeMs > maxAgeMs;
    const insufficient = observations.length < minSamples;
    const status = insufficient ? 'insufficient' : stale ? 'stale' : 'ready';

    let priceVolatilityPct: number | null = null;
    let maxPriceDrawdownPct: number | null = null;
    let maxLiquidityDrawdownPct: number | null = null;
    let outflowToLiquidityPct: number | null = null;
    let anomalyCount: number | null = null;
    let anomalyRatePct: number | null = null;
    let riskScore: number | null = null;

    if (observations.length >= 2) {
        const returns = observations.slice(1).map((sample, index) =>
            Math.log(sample.priceUsd / observations[index]!.priceUsd) * 100
        );

        // EWMA variance gives recent returns more weight without discarding the
        // longer window; the fixed lambda keeps runs deterministic.
        let ewmaMean = returns[0]!;
        let ewmaVariance = 0;
        for (let index = 1; index < returns.length; index += 1) {
            const value = returns[index]!;
            const delta = value - ewmaMean;
            ewmaMean =
                ORACLE_SIGNAL_DEFAULTS.ewmaLambda * ewmaMean +
                (1 - ORACLE_SIGNAL_DEFAULTS.ewmaLambda) * value;
            ewmaVariance =
                ORACLE_SIGNAL_DEFAULTS.ewmaLambda * ewmaVariance +
                (1 - ORACLE_SIGNAL_DEFAULTS.ewmaLambda) * delta * delta;
        }
        priceVolatilityPct = Math.sqrt(Math.max(0, ewmaVariance));

        const returnMedian = median(returns);
        const mad = median(returns.map((value) => Math.abs(value - returnMedian)));
        anomalyCount = returns.filter((value) => {
            if (mad <= 1e-12) {
                return Math.abs(value - returnMedian) > Math.max(1e-8, Math.abs(returnMedian) * 1e-6);
            }
            const modifiedZ = (0.6745 * Math.abs(value - returnMedian)) / mad;
            return modifiedZ > ORACLE_SIGNAL_DEFAULTS.modifiedZScoreLimit;
        }).length;
        anomalyRatePct = (anomalyCount / returns.length) * 100;

        const prices = observations.map((sample) => sample.priceUsd);
        const liquidity = observations.map((sample) => sample.liquidityUsd);
        maxPriceDrawdownPct = maximumDrawdown(prices);
        maxLiquidityDrawdownPct = maximumDrawdown(liquidity);
        const totalOutflowUsd = observations.reduce((sum, sample) => sum + sample.outflowUsd, 0);
        outflowToLiquidityPct = (totalOutflowUsd / observations[0]!.liquidityUsd) * 100;

        riskScore = Math.ceil(
            Math.max(
                clampScore((priceVolatilityPct / maxVolatilityPct) * 100),
                clampScore((Math.max(maxPriceDrawdownPct, maxLiquidityDrawdownPct) / maxDrawdownPct) * 100),
                clampScore((outflowToLiquidityPct / maxOutflowRatioPct) * 100),
                clampScore((anomalyRatePct / maxAnomalyRatePct) * 100)
            )
        );
    }

    const blockers: string[] = [];
    if (insufficient) blockers.push(`only ${observations.length} of ${minSamples} required samples`);
    if (stale) blockers.push(`latest sample is ${Math.round(latestAgeMs / 1000)}s old`);
    if (riskScore !== null && riskScore >= maxRiskScore) {
        blockers.push(`deterministic risk score ${riskScore} meets or exceeds the ${maxRiskScore} gate`);
    }

    const confidence =
        status === 'ready'
            ? round(Math.min(1, observations.length / minSamples) * Math.max(0, 1 - latestAgeMs / maxAgeMs), 3)
            : 0;
    if (status === 'ready' && confidence < minConfidence) {
        blockers.push(`signal confidence ${confidence} is below the ${minConfidence} minimum`);
    }

    const modelAllowed =
        status === 'ready' &&
        riskScore !== null &&
        riskScore < maxRiskScore &&
        confidence >= minConfidence;

    return {
        status,
        sampleCount: observations.length,
        latestTimestampMs,
        priceVolatilityPct: priceVolatilityPct === null ? null : round(priceVolatilityPct),
        maxPriceDrawdownPct: maxPriceDrawdownPct === null ? null : round(maxPriceDrawdownPct),
        maxLiquidityDrawdownPct: maxLiquidityDrawdownPct === null ? null : round(maxLiquidityDrawdownPct),
        outflowToLiquidityPct: outflowToLiquidityPct === null ? null : round(outflowToLiquidityPct),
        anomalyCount,
        anomalyRatePct: anomalyRatePct === null ? null : round(anomalyRatePct),
        riskScore,
        confidence,
        modelAllowed,
        blockers
    };
}
