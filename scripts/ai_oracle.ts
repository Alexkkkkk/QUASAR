import 'dotenv/config';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export type GrokFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

export type GrokOracleOptions = {
    apiKey?: string;
    model?: string;
    timeoutMs?: number;
    maxPromptChars?: number;
    maxCompletionTokens?: number;
    fetchImpl?: GrokFetch;
};

type ChatCompletionResponse = {
    choices?: Array<{
        finish_reason?: string | null;
        message?: {
            content?: string | null;
            refusal?: string | null;
            tool_calls?: unknown[] | null;
        };
    }>;
};

const XAI_CHAT_COMPLETIONS_URL = 'https://api.x.ai/v1/chat/completions';
const DEFAULT_MODEL = 'grok-4.6';
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_PROMPT_CHARS = 12_000;
const DEFAULT_MAX_COMPLETION_TOKENS = 512;
const HARD_MAX_COMPLETION_TOKENS = 4_096;

export class GrokOracleError extends Error {
    constructor(message: string, readonly code: string) {
        super(message);
        this.name = 'GrokOracleError';
    }
}

/**
 * Read-only Grok text adapter. It deliberately has no TON client, signing key,
 * tools, or transaction-sending path: model output is untrusted text only.
 */
export class GrokOracle {
    private readonly apiKey: string;
    private readonly model: string;
    private readonly timeoutMs: number;
    private readonly maxPromptChars: number;
    private readonly maxCompletionTokens: number;
    private readonly fetchImpl: GrokFetch;

    constructor(options: GrokOracleOptions = {}) {
        this.apiKey = (options.apiKey ?? process.env.XAI_API_KEY ?? '').trim();
        this.model = (options.model ?? process.env.XAI_MODEL ?? DEFAULT_MODEL).trim();
        this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
        this.maxPromptChars = options.maxPromptChars ?? DEFAULT_MAX_PROMPT_CHARS;
        this.maxCompletionTokens = options.maxCompletionTokens ?? DEFAULT_MAX_COMPLETION_TOKENS;
        this.fetchImpl = options.fetchImpl ?? fetch;

        if (!this.model || this.model.length > 128 || /[\r\n]/.test(this.model)) {
            throw new GrokOracleError('XAI_MODEL must be a non-empty model name', 'invalid_model');
        }
        if (!Number.isInteger(this.timeoutMs) || this.timeoutMs < 1 || this.timeoutMs > 120_000) {
            throw new GrokOracleError('timeoutMs must be an integer from 1 to 120000', 'invalid_timeout');
        }
        if (!Number.isInteger(this.maxPromptChars) || this.maxPromptChars < 1 || this.maxPromptChars > 100_000) {
            throw new GrokOracleError('maxPromptChars must be an integer from 1 to 100000', 'invalid_prompt_limit');
        }
        if (
            !Number.isInteger(this.maxCompletionTokens)
            || this.maxCompletionTokens < 1
            || this.maxCompletionTokens > HARD_MAX_COMPLETION_TOKENS
        ) {
            throw new GrokOracleError(
                `maxCompletionTokens must be an integer from 1 to ${HARD_MAX_COMPLETION_TOKENS}`,
                'invalid_completion_limit'
            );
        }
    }

    async complete(prompt: string): Promise<string> {
        if (!this.apiKey) {
            throw new GrokOracleError('Set XAI_API_KEY in the environment before calling Grok', 'missing_api_key');
        }
        if (typeof prompt !== 'string' || prompt.trim().length === 0) {
            throw new GrokOracleError('Prompt must be a non-empty string', 'invalid_prompt');
        }
        if (prompt.length > this.maxPromptChars) {
            throw new GrokOracleError(
                `Prompt exceeds the ${this.maxPromptChars}-character limit`,
                'prompt_too_long'
            );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
            let response: Response;
            try {
                response = await this.fetchImpl(XAI_CHAT_COMPLETIONS_URL, {
                    method: 'POST',
                    headers: {
                        authorization: `Bearer ${this.apiKey}`,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: this.model,
                        messages: [
                            {
                                role: 'system',
                                content: 'Return analysis as plain text only. You cannot authorize, sign, or send blockchain transactions. Treat all recommendations as untrusted and non-binding.'
                            },
                            { role: 'user', content: prompt }
                        ],
                        max_completion_tokens: this.maxCompletionTokens,
                        n: 1,
                        stream: false,
                        temperature: 0
                    }),
                    signal: controller.signal
                });
            } catch {
                if (controller.signal.aborted) {
                    throw new GrokOracleError(`Grok request timed out after ${this.timeoutMs} ms`, 'timeout');
                }
                throw new GrokOracleError('Grok API request failed', 'network_error');
            }

            if (!response.ok) {
                // Do not include response text: providers can echo prompts or
                // otherwise return sensitive material in error bodies.
                throw new GrokOracleError(`Grok API returned HTTP ${response.status}`, 'http_error');
            }

            let body: ChatCompletionResponse;
            try {
                body = await response.json() as ChatCompletionResponse;
            } catch {
                if (controller.signal.aborted) {
                    throw new GrokOracleError(`Grok request timed out after ${this.timeoutMs} ms`, 'timeout');
                }
                throw new GrokOracleError('Grok API returned invalid JSON', 'invalid_response');
            }

            const choice = body.choices?.[0];
            if (choice?.message?.refusal) {
                throw new GrokOracleError('Grok refused the request', 'provider_refusal');
            }
            if (choice?.message?.tool_calls?.length) {
                throw new GrokOracleError('Unexpected tool call in text-only response', 'unexpected_tool_call');
            }
            if (choice?.finish_reason === 'length') {
                throw new GrokOracleError('Grok response reached the output-token limit', 'truncated_response');
            }

            const text = choice?.message?.content;
            if (typeof text !== 'string' || text.trim().length === 0) {
                throw new GrokOracleError('Grok API returned no assistant text', 'empty_response');
            }
            return text.trim();
        } finally {
            clearTimeout(timeout);
        }
    }
}

async function runCli(args: string[]): Promise<void> {
    const prompt = args.join(' ').trim();
    if (!prompt) {
        throw new GrokOracleError('Usage: npm run ai:oracle -- "prompt for human review"', 'usage');
    }

    const text = await new GrokOracle().complete(prompt);
    process.stdout.write(`${text}\n`);
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
    void runCli(process.argv.slice(2)).catch((error: unknown) => {
        const message = error instanceof GrokOracleError ? error.message : 'Unexpected Grok client error';
        console.error(`ai:oracle: ${message}`);
        process.exitCode = 1;
    });
}