/**
 * QUASAR off-chain AI oracle provider (xAI / Grok).
 *
 * Why this file exists
 * --------------------
 * The on-chain contracts never call a language model. `QuasarMaster` only keeps
 * an oracle address and consumes a decision an operator relays to it as an
 * ordinary TON message (`AI Sovereignty` / risk-boundary section of the README).
 * This module is the off-chain half of that design: it is the single place that
 * talks to an external model, and it stays read-only with respect to the chain.
 * It never signs, sends or broadcasts a transaction — see
 * `docs/OFFCHAIN_INTEGRATIONS.md`.
 *
 * Endpoint, auth header and model id are taken from the published xAI reference,
 * not from memory:
 *
 *   base URL  https://api.x.ai/v1
 *   path      /chat/completions            (OpenAI-compatible, stateless)
 *   auth      Authorization: Bearer <XAI_API_KEY>
 *   models    grok-4.7                     (flagship, 500k context window)
 *
 * Docs: https://docs.x.ai/developers/rest-api-reference/inference/chat-completions
 * Models: https://docs.x.ai/docs/models
 *
 * The provider sits behind `OracleProvider`, the API key is read from the
 * environment, the HTTP call has a hard timeout, and `fetch` is injectable so
 * the test suite can run with no network access.
 */

import { pathToFileURL } from 'node:url';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type OracleRole = 'system' | 'user' | 'assistant';

export type OracleMessage = {
    role: OracleRole;
    content: string;
};

export type OracleUsage = {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
};

export type OracleResponse = {
    provider: string;
    model: string;
    text: string;
    usage?: OracleUsage;
};

export type OracleRequest = {
    /** The user prompt. */
    prompt: string;
    /** Optional system instruction (policy / role for the model). */
    system?: string;
    temperature?: number;
    maxTokens?: number;
    /** Overrides the provider default for this single call. */
    timeoutMs?: number;
};

/**
 * Every oracle implementation (Grok today, anything else tomorrow) satisfies
 * this interface. Callers depend on the interface, never on the transport.
 */
export interface OracleProvider {
    readonly name: string;
    readonly model: string;
    complete(request: OracleRequest): Promise<OracleResponse>;
}

/* -------------------------------------------------------------------------- */
/* Errors                                                                      */
/* -------------------------------------------------------------------------- */

export class OracleError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = new.target.name;
    }
}

/** Bad or missing local configuration (e.g. no API key). */
export class OracleConfigError extends OracleError {}

/** 401/403 from the provider. Never retried. */
export class OracleAuthError extends OracleError {}

/** The request exceeded its timeout. Never retried. */
export class OracleTimeoutError extends OracleError {}

/** The provider answered, but the payload is not a usable completion. */
export class OracleResponseError extends OracleError {}

/* -------------------------------------------------------------------------- */
/* Grok (xAI) provider                                                         */
/* -------------------------------------------------------------------------- */

export const XAI_CHAT_COMPLETIONS_URL = 'https://api.x.ai/v1/chat/completions';
export const DEFAULT_GROK_MODEL = 'grok-4.7';
export const DEFAULT_TIMEOUT_MS = 30_000;
export const DEFAULT_RETRIES = 2;

export type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

export type GrokProviderOptions = {
    /** xAI API key. Never logged; redacted from every error message. */
    apiKey: string;
    model?: string;
    endpoint?: string;
    timeoutMs?: number;
    /** Extra attempts after the first one for 429 / 5xx / network faults. */
    retries?: number;
    /** Injectable for tests. Defaults to global `fetch`. */
    fetchImpl?: FetchLike;
    /** Injectable for tests so backoff does not slow the suite down. */
    sleep?: (ms: number) => Promise<void>;
};

const defaultSleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Env vars accepted for the xAI key, in priority order. */
export const GROK_API_KEY_ENV_VARS = ['XAI_API_KEY', 'GROK_API_KEY'] as const;

export function resolveGrokApiKey(env: NodeJS.ProcessEnv = process.env): string | undefined {
    for (const name of GROK_API_KEY_ENV_VARS) {
        const value = env[name];
        if (typeof value === 'string' && value.trim() !== '') return value.trim();
    }
    return undefined;
}

function isRetryableStatus(status: number): boolean {
    return status === 429 || status === 408 || status >= 500;
}

function describeError(error: unknown): string {
    if (error instanceof Error) return `${error.name}: ${error.message}`;
    return String(error);
}

/** Shorten a provider body so it can go into an error without dumping a payload. */
function truncate(value: string, max = 300): string {
    const flat = value.replace(/\s+/g, ' ').trim();
    return flat.length <= max ? flat : `${flat.slice(0, max)}…`;
}

function readUsage(payload: unknown): OracleUsage | undefined {
    if (typeof payload !== 'object' || payload === null) return undefined;
    const usage = (payload as { usage?: unknown }).usage;
    if (typeof usage !== 'object' || usage === null) return undefined;
    const record = usage as Record<string, unknown>;
    const pick = (key: string): number => {
        const value = record[key];
        return typeof value === 'number' && Number.isFinite(value) ? value : 0;
    };
    const promptTokens = pick('prompt_tokens');
    const completionTokens = pick('completion_tokens');
    const totalTokens = pick('total_tokens') || promptTokens + completionTokens;
    if (promptTokens === 0 && completionTokens === 0 && totalTokens === 0) return undefined;
    return { promptTokens, completionTokens, totalTokens };
}

/** Pull `choices[0].message.content` out of an OpenAI-compatible payload. */
function readCompletion(payload: unknown): { text: string; usage?: OracleUsage } {
    if (typeof payload !== 'object' || payload === null) {
        throw new OracleResponseError('xAI returned a non-object payload');
    }
    const choices = (payload as { choices?: unknown }).choices;
    if (!Array.isArray(choices) || choices.length === 0) {
        throw new OracleResponseError('xAI returned no choices');
    }
    const first = choices[0] as { message?: { content?: unknown } } | undefined;
    const content = first?.message?.content;
    if (typeof content !== 'string' || content.trim() === '') {
        throw new OracleResponseError('xAI returned an empty completion');
    }
    const usage = readUsage(payload);
    return usage ? { text: content, usage } : { text: content };
}

export class GrokProvider implements OracleProvider {
    readonly name = 'grok';
    readonly model: string;

    private readonly apiKey: string;
    private readonly endpoint: string;
    private readonly timeoutMs: number;
    private readonly retries: number;
    private readonly fetchImpl: FetchLike;
    private readonly sleep: (ms: number) => Promise<void>;

    constructor(options: GrokProviderOptions) {
        const apiKey = typeof options.apiKey === 'string' ? options.apiKey.trim() : '';
        if (apiKey === '') {
            throw new OracleConfigError(
                `missing xAI API key — set one of ${GROK_API_KEY_ENV_VARS.join(' / ')} (the key is never logged)`
            );
        }
        this.apiKey = apiKey;
        this.model = options.model?.trim() || DEFAULT_GROK_MODEL;
        this.endpoint = (options.endpoint || XAI_CHAT_COMPLETIONS_URL).replace(/\/+$/, '');
        this.timeoutMs = options.timeoutMs && options.timeoutMs > 0 ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
        this.retries = options.retries !== undefined && options.retries >= 0 ? options.retries : DEFAULT_RETRIES;
        this.fetchImpl = options.fetchImpl || fetch;
        this.sleep = options.sleep || defaultSleep;
    }

    /** Strip the key from anything that may reach a log or an error message. */
    private redact(message: string): string {
        return message.split(this.apiKey).join('[redacted]');
    }

    private buildBody(request: OracleRequest): string {
        const messages: OracleMessage[] = [];
        if (request.system?.trim()) messages.push({ role: 'system', content: request.system });
        messages.push({ role: 'user', content: request.prompt });
        const body: Record<string, unknown> = {
            model: this.model,
            messages,
            temperature: request.temperature ?? 0.2,
            // xAI accepts `max_tokens`; omitted entirely when not requested.
            stream: false
        };
        if (request.maxTokens !== undefined) body.max_tokens = request.maxTokens;
        return JSON.stringify(body);
    }

    async complete(request: OracleRequest): Promise<OracleResponse> {
        if (!request || typeof request.prompt !== 'string' || request.prompt.trim() === '') {
            throw new OracleConfigError('oracle request requires a non-empty prompt');
        }
        const timeoutMs = request.timeoutMs && request.timeoutMs > 0 ? request.timeoutMs : this.timeoutMs;
        const body = this.buildBody(request);
        const attempts = this.retries + 1;
        let lastError: OracleError | undefined;

        for (let attempt = 0; attempt < attempts; attempt += 1) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const response = await this.fetchImpl(this.endpoint, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${this.apiKey}`
                    },
                    body,
                    signal: controller.signal
                });

                if (response.status === 401 || response.status === 403) {
                    throw new OracleAuthError(
                        this.redact(`xAI rejected the API key (HTTP ${response.status}) — check the key and its team scope`)
                    );
                }

                if (!response.ok) {
                    const detail = this.redact(truncate(await response.text().catch(() => '')));
                    const message = `xAI ${this.model} returned HTTP ${response.status}${detail ? `: ${detail}` : ''}`;
                    if (isRetryableStatus(response.status) && attempt + 1 < attempts) {
                        lastError = new OracleResponseError(message);
                        await this.sleep(250 * 2 ** attempt);
                        continue;
                    }
                    if (isRetryableStatus(response.status)) throw new OracleResponseError(message);
                    throw new OracleResponseError(message);
                }

                let payload: unknown;
                try {
                    payload = await response.json();
                } catch (error) {
                    throw new OracleResponseError('xAI returned a body that is not valid JSON', { cause: error });
                }

                const { text, usage } = readCompletion(payload);
                return usage
                    ? { provider: this.name, model: this.model, text, usage }
                    : { provider: this.name, model: this.model, text };
            } catch (error) {
                if (error instanceof OracleError) throw error;

                if (controller.signal.aborted) {
                    throw new OracleTimeoutError(
                        `xAI ${this.model} request timed out after ${timeoutMs}ms`,
                        { cause: error }
                    );
                }

                const message = this.redact(`xAI ${this.model} request failed: ${describeError(error)}`);
                if (attempt + 1 < attempts) {
                    lastError = new OracleError(message, { cause: error });
                    await this.sleep(250 * 2 ** attempt);
                    continue;
                }
                throw new OracleError(message, { cause: error });
            } finally {
                clearTimeout(timer);
            }
        }

        throw lastError ?? new OracleError(`xAI ${this.model} request failed after ${attempts} attempts`);
    }
}

/**
 * Build a provider from the environment. Prefer this over `new GrokProvider`
 * in scripts so the key is resolved in exactly one place.
 */
export function createGrokProvider(
    options: Partial<GrokProviderOptions> & { env?: NodeJS.ProcessEnv } = {}
): GrokProvider {
    const env = options.env ?? process.env;
    const apiKey = options.apiKey ?? resolveGrokApiKey(env);
    if (!apiKey) {
        throw new OracleConfigError(
            `missing xAI API key — set one of ${GROK_API_KEY_ENV_VARS.join(' / ')} in .env (see .env.example)`
        );
    }
    return new GrokProvider({
        apiKey,
        model: options.model,
        endpoint: options.endpoint,
        timeoutMs: options.timeoutMs,
        retries: options.retries,
        fetchImpl: options.fetchImpl,
        sleep: options.sleep
    });
}

/* -------------------------------------------------------------------------- */
/* Risk decision contract                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The bounded vocabulary the on-chain risk controls understand. A model may
 * only ever produce one of these; anything else is a malformed decision.
 */
export const ORACLE_ACTIONS = ['hold', 'buyback', 'distribute', 'pause'] as const;
export type OracleAction = (typeof ORACLE_ACTIONS)[number];

export type OracleDecision = {
    action: OracleAction;
    /** Integer 0..100. Higher means more risk. */
    riskScore: number;
    /** 0..1. */
    confidence: number;
    rationale: string;
};

export const MAX_RATIONALE_LENGTH = 500;

/** System prompt that pins the model to the decision schema. */
export function oracleDecisionSystemPrompt(): string {
    return [
        'You are the QUASAR risk oracle for a TON jetton.',
        'You never execute anything; you only return a bounded risk assessment.',
        'Answer with a single JSON object and nothing else, using exactly these keys:',
        `  "action": one of ${ORACLE_ACTIONS.map((a) => `"${a}"`).join(', ')}`,
        '  "riskScore": integer 0-100 (higher = riskier)',
        '  "confidence": number 0-1',
        `  "rationale": string, at most ${MAX_RATIONALE_LENGTH} characters`,
        'If the data is insufficient, use action "hold", a low confidence, and say what is missing.'
    ].join('\n');
}

/** Accept a bare JSON object, or one wrapped in a ```json fence. */
function extractJsonObject(raw: string): unknown {
    const text = raw.trim();
    const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
    const candidate = (fenced?.[1] ?? text).trim();
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) {
        throw new OracleResponseError('oracle reply does not contain a JSON object');
    }
    try {
        return JSON.parse(candidate.slice(start, end + 1));
    } catch (error) {
        throw new OracleResponseError('oracle reply is not valid JSON', { cause: error });
    }
}

/**
 * Validate a model reply against the decision contract. Bounds are enforced
 * here rather than trusting the model, so a malformed or out-of-range decision
 * can never reach an operator's relaying script.
 */
export function parseOracleDecision(raw: string): OracleDecision {
    if (typeof raw !== 'string' || raw.trim() === '') {
        throw new OracleResponseError('oracle reply is empty');
    }
    const value = extractJsonObject(raw);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new OracleResponseError('oracle reply is not a JSON object');
    }
    const record = value as Record<string, unknown>;

    const action = record.action;
    if (typeof action !== 'string' || !(ORACLE_ACTIONS as readonly string[]).includes(action)) {
        throw new OracleResponseError(
            `oracle action must be one of ${ORACLE_ACTIONS.join(', ')} (received ${JSON.stringify(action)})`
        );
    }

    const riskScore = record.riskScore;
    if (typeof riskScore !== 'number' || !Number.isInteger(riskScore) || riskScore < 0 || riskScore > 100) {
        throw new OracleResponseError(`oracle riskScore must be an integer 0..100 (received ${JSON.stringify(riskScore)})`);
    }

    const confidence = record.confidence;
    if (typeof confidence !== 'number' || !Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
        throw new OracleResponseError(`oracle confidence must be a number 0..1 (received ${JSON.stringify(confidence)})`);
    }

    const rationale = record.rationale;
    if (typeof rationale !== 'string' || rationale.trim() === '' || rationale.length > MAX_RATIONALE_LENGTH) {
        throw new OracleResponseError(`oracle rationale must be a non-empty string of at most ${MAX_RATIONALE_LENGTH} characters`);
    }

    return { action: action as OracleAction, riskScore, confidence, rationale: rationale.trim() };
}

/** Ask the provider for a validated risk decision. */
export async function requestOracleDecision(
    provider: OracleProvider,
    prompt: string,
    options: { timeoutMs?: number; maxTokens?: number } = {}
): Promise<OracleDecision> {
    const response = await provider.complete({
        prompt,
        system: oracleDecisionSystemPrompt(),
        // Deterministic as the transport allows; validation is the real guard.
        temperature: 0,
        maxTokens: options.maxTokens ?? 512,
        timeoutMs: options.timeoutMs
    });
    return parseOracleDecision(response.text);
}

/* -------------------------------------------------------------------------- */
/* CLI                                                                         */
/* -------------------------------------------------------------------------- */

export type OracleCliDeps = {
    env?: NodeJS.ProcessEnv;
    stdout?: (line: string) => void;
    stderr?: (line: string) => void;
    provider?: OracleProvider;
};

/**
 * `npm run oracle:smoke -- "risk snapshot ..."` prints one decision as JSON and
 * exits non-zero on any failure. Missing inputs are reported, never faked.
 */
export async function main(argv: string[] = process.argv.slice(2), deps: OracleCliDeps = {}): Promise<number> {
    const env = deps.env ?? process.env;
    const stdout = deps.stdout ?? ((line: string) => console.log(line));
    const stderr = deps.stderr ?? ((line: string) => console.error(line));

    // Loaded only when the CLI actually runs, so importing this module in tests
    // has no environment side effects.
    try {
        const dotenv = await import('dotenv');
        dotenv.config();
    } catch {
        // dotenv is a dev dependency; a real environment still works without it.
    }

    const prompt = argv.join(' ').trim();
    if (prompt === '') {
        stderr('usage: npm run oracle:smoke -- "<prompt>"');
        return 2;
    }

    try {
        const provider = deps.provider ?? createGrokProvider({ env: deps.env ?? process.env });
        const decision = await requestOracleDecision(provider, prompt);
        stdout(JSON.stringify({ provider: provider.name, model: provider.model, decision }, null, 2));
        return 0;
    } catch (error) {
        stderr(error instanceof OracleError ? `${error.name}: ${error.message}` : describeError(error));
        return 1;
    }
}

function isDirectRun(): boolean {
    const entry = process.argv[1];
    if (!entry) return false;
    try {
        return pathToFileURL(entry).href === import.meta.url;
    } catch {
        return false;
    }
}

if (isDirectRun()) {
    const code = await main();
    process.exitCode = code;
}
