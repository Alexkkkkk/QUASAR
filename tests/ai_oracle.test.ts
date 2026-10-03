import assert from 'node:assert/strict';
import test from 'node:test';
import {
    DEFAULT_GROK_MODEL,
    GrokProvider,
    GROK_API_KEY_ENV_VARS,
    MAX_RATIONALE_LENGTH,
    ORACLE_ACTIONS,
    OracleAuthError,
    OracleConfigError,
    OracleError,
    OracleResponseError,
    OracleTimeoutError,
    XAI_CHAT_COMPLETIONS_URL,
    createGrokProvider,
    main,
    oracleDecisionSystemPrompt,
    parseOracleDecision,
    requestOracleDecision,
    resolveGrokApiKey,
    type FetchLike,
    type OracleProvider
} from '../scripts/ai_oracle.js';

const KEY = 'xai-test-key-not-a-real-secret';

type CapturedRequest = {
    url: string;
    headers: Record<string, string>;
    body: Record<string, unknown>;
    hasSignal: boolean;
};

type FetchHandler = (captured: CapturedRequest, callIndex: number) => Response | Promise<Response>;

function mockFetch(handler: FetchHandler): { fetchImpl: FetchLike; calls: CapturedRequest[] } {
    const calls: CapturedRequest[] = [];
    const fetchImpl: FetchLike = async (input, init) => {
        const captured: CapturedRequest = {
            url: String(input),
            headers: (init?.headers ?? {}) as Record<string, string>,
            body: JSON.parse(String(init?.body)) as Record<string, unknown>,
            hasSignal: init?.signal != null
        };
        calls.push(captured);
        return handler(captured, calls.length - 1);
    };
    return { fetchImpl, calls };
}

/** A well-formed OpenAI-compatible completion payload. */
function completionPayload(content: string, withUsage = true): string {
    return JSON.stringify({
        id: 'chatcmpl-test',
        object: 'chat.completion',
        model: DEFAULT_GROK_MODEL,
        choices: [{ index: 0, finish_reason: 'stop', message: { role: 'assistant', content } }],
        usage: withUsage ? { prompt_tokens: 11, completion_tokens: 7, total_tokens: 18 } : undefined
    });
}

function rawResponse(text: string, status = 200, contentType = 'application/json'): Response {
    return new Response(text, { status, headers: { 'content-type': contentType } });
}

/** A provider whose transport never touches the network and never sleeps. */
function providerWith(handler: FetchHandler): { provider: GrokProvider; calls: CapturedRequest[] } {
    const { fetchImpl, calls } = mockFetch(handler);
    const provider = new GrokProvider({ apiKey: KEY, fetchImpl, sleep: async () => {} });
    return { provider, calls };
}

/** Await a call that must reject and hand back the thrown error, without any unsafe cast. */
async function catchError(call: () => Promise<unknown>): Promise<Error> {
    try {
        await call();
    } catch (error) {
        return error as Error;
    }
    throw new Error('expected the call to reject');
}

const VALID_DECISION = '{"action":"hold","riskScore":20,"confidence":0.7,"rationale":"insufficient market data"}';

/* -------------------------------------------------------------------------- */
/* Key resolution and construction                                            */
/* -------------------------------------------------------------------------- */

test('oracle resolves the xAI key from the documented environment variables', () => {
    assert.equal(resolveGrokApiKey({ XAI_API_KEY: 'from-xai' }), 'from-xai');
    assert.equal(resolveGrokApiKey({ GROK_API_KEY: 'from-grok' }), 'from-grok');
    // XAI_API_KEY wins when both are set; blank values never count as a key.
    assert.equal(resolveGrokApiKey({ XAI_API_KEY: 'primary', GROK_API_KEY: 'fallback' }), 'primary');
    assert.equal(resolveGrokApiKey({ XAI_API_KEY: '   ' }), undefined);
    assert.equal(resolveGrokApiKey({}), undefined);
    assert.deepEqual([...GROK_API_KEY_ENV_VARS], ['XAI_API_KEY', 'GROK_API_KEY']);
});

test('oracle refuses to construct without a key and never echoes one', () => {
    assert.throws(() => createGrokProvider({ env: {} }), OracleConfigError);
    assert.throws(() => new GrokProvider({ apiKey: '  ' }), OracleConfigError);
    assert.throws(
        () => createGrokProvider({ env: {} }),
        (error: unknown) =>
            error instanceof OracleConfigError &&
            /missing xAI API key/.test(error.message) &&
            /XAI_API_KEY \/ GROK_API_KEY/.test(error.message)
    );
});

test('oracle builds a provider from the environment and defaults to the documented model', () => {
    const provider = createGrokProvider({ env: { XAI_API_KEY: KEY } });
    assert.equal(provider.name, 'grok');
    assert.equal(provider.model, DEFAULT_GROK_MODEL);
    assert.equal(DEFAULT_GROK_MODEL, 'grok-4.7');
});

/* -------------------------------------------------------------------------- */
/* Transport contract                                                         */
/* -------------------------------------------------------------------------- */

test('oracle calls the documented xAI endpoint with Bearer auth and an OpenAI-compatible body', async () => {
    const { provider, calls } = providerWith(() => rawResponse(completionPayload('ok')));
    const response = await provider.complete({ prompt: 'assess risk', system: 'be terse', temperature: 0, maxTokens: 64 });

    assert.equal(calls.length, 1);
    const call = calls[0]!;
    assert.equal(call.url, XAI_CHAT_COMPLETIONS_URL);
    assert.equal(XAI_CHAT_COMPLETIONS_URL, 'https://api.x.ai/v1/chat/completions');
    assert.equal(call.headers.authorization, `Bearer ${KEY}`);
    assert.equal(call.headers['content-type'], 'application/json');
    assert.equal(call.body.model, 'grok-4.7');
    assert.equal(call.body.stream, false);
    assert.equal(call.body.temperature, 0);
    assert.equal(call.body.max_tokens, 64);
    assert.deepEqual(call.body.messages, [
        { role: 'system', content: 'be terse' },
        { role: 'user', content: 'assess risk' }
    ]);
    // A timeout must always be armed on the outbound request.
    assert.equal(call.hasSignal, true);

    assert.equal(response.text, 'ok');
    assert.equal(response.provider, 'grok');
    assert.equal(response.model, 'grok-4.7');
    assert.deepEqual(response.usage, { promptTokens: 11, completionTokens: 7, totalTokens: 18 });
});

test('oracle omits the system message when none is supplied and accepts a custom model', async () => {
    const { fetchImpl, calls } = mockFetch(() => rawResponse(completionPayload('ok')));
    const provider = new GrokProvider({ apiKey: KEY, model: 'grok-4.7-latest', fetchImpl, sleep: async () => {} });
    await provider.complete({ prompt: 'ping' });
    assert.equal(calls[0]!.body.model, 'grok-4.7-latest');
    assert.deepEqual(calls[0]!.body.messages, [{ role: 'user', content: 'ping' }]);
    assert.equal('max_tokens' in calls[0]!.body, false);
});

test('oracle tolerates a completion without usage accounting', async () => {
    const { provider } = providerWith(() => rawResponse(completionPayload('ok', false)));
    const response = await provider.complete({ prompt: 'ping' });
    assert.equal(response.usage, undefined);
});

test('oracle rejects an empty prompt before spending a request', async () => {
    const { provider, calls } = providerWith(() => rawResponse(completionPayload('ok')));
    await assert.rejects(provider.complete({ prompt: '   ' }), OracleConfigError);
    assert.equal(calls.length, 0);
});

/* -------------------------------------------------------------------------- */
/* Failure handling                                                           */
/* -------------------------------------------------------------------------- */

test('oracle treats an auth failure as terminal and does not retry it', async () => {
    const { provider, calls } = providerWith(() => rawResponse('{"error":"invalid api key"}', 401));
    const error = await catchError(() => provider.complete({ prompt: 'ping' }));
    assert.ok(error instanceof OracleAuthError, `expected OracleAuthError, received ${error.name}: ${error.message}`);
    assert.ok(!error.message.includes(KEY), 'the API key must never appear in an error message');
    assert.equal(calls.length, 1);
});

test('oracle retries a server fault and then reports it with a redacted key', async () => {
    const { provider, calls } = providerWith(() => rawResponse(`boom ${KEY}`, 500));
    const error = await catchError(() => provider.complete({ prompt: 'ping' }));
    assert.ok(error instanceof OracleResponseError, `expected OracleResponseError, received ${error.name}: ${error.message}`);
    assert.equal(calls.length, 3, 'two retries on top of the first attempt');
    assert.match(error.message, /HTTP 500/);
    assert.ok(!error.message.includes(KEY), 'the API key must never appear in an error message');
    assert.match(error.message, /\[redacted\]/);
});

test('oracle recovers when a throttled request succeeds on retry', async () => {
    const { provider, calls } = providerWith((_call, index) =>
        index === 0 ? rawResponse('slow down', 429) : rawResponse(completionPayload('recovered'))
    );
    const response = await provider.complete({ prompt: 'ping' });
    assert.equal(response.text, 'recovered');
    assert.equal(calls.length, 2);
});

test('oracle enforces its timeout and never retries a hung request', async () => {
    let attempts = 0;
    // A transport that never settles on its own: it can only end via the abort signal.
    const fetchImpl: FetchLike = (_input, init) => {
        attempts += 1;
        const signal = init?.signal;
        return new Promise<Response>((_resolve, reject) => {
            if (!signal) return;
            const abort = (): void => {
                const error = new Error('This operation was aborted');
                error.name = 'AbortError';
                reject(error);
            };
            if (signal.aborted) abort();
            else signal.addEventListener('abort', abort);
        });
    };
    const provider = new GrokProvider({ apiKey: KEY, fetchImpl, sleep: async () => {}, timeoutMs: 20, retries: 3 });

    const error = await catchError(() => provider.complete({ prompt: 'ping' }));
    assert.ok(error instanceof OracleTimeoutError, `expected OracleTimeoutError, received ${error.name}: ${error.message}`);
    assert.equal(attempts, 1, 'a timeout must not be retried');
});

test('oracle retries a transport fault and surfaces it without leaking the key', async () => {
    let attempts = 0;
    const fetchImpl: FetchLike = () => {
        attempts += 1;
        throw new TypeError(`network down (${KEY})`);
    };
    const provider = new GrokProvider({ apiKey: KEY, fetchImpl, sleep: async () => {}, retries: 1 });
    const error = await catchError(() => provider.complete({ prompt: 'ping' }));
    assert.ok(error instanceof OracleError, `expected OracleError, received ${error.name}: ${error.message}`);
    assert.equal(attempts, 2);
    assert.ok(!error.message.includes(KEY));
    assert.match(error.message, /\[redacted\]/);
});

test('oracle rejects a body that is not JSON and a payload without a completion', async () => {
    const { provider: brokenBody } = providerWith(() => rawResponse('<html>gateway</html>', 200, 'text/html'));
    await assert.rejects(brokenBody.complete({ prompt: 'ping' }), OracleResponseError);

    const { provider: noChoices } = providerWith(() => rawResponse(JSON.stringify({ choices: [] })));
    await assert.rejects(noChoices.complete({ prompt: 'ping' }), OracleResponseError);

    const { provider: emptyContent } = providerWith(() => rawResponse(JSON.stringify({ choices: [{ message: { content: '  ' } }] })));
    await assert.rejects(emptyContent.complete({ prompt: 'ping' }), OracleResponseError);
});

/* -------------------------------------------------------------------------- */
/* Decision contract                                                          */
/* -------------------------------------------------------------------------- */

test('oracle decision parser accepts a well-formed decision', () => {
    const decision = parseOracleDecision(VALID_DECISION);
    assert.deepEqual(decision, {
        action: 'hold',
        riskScore: 20,
        confidence: 0.7,
        rationale: 'insufficient market data'
    });
    assert.deepEqual([...ORACLE_ACTIONS], ['hold', 'buyback', 'distribute', 'pause']);
});

test('oracle decision parser unwraps a fenced code block and surrounding prose', () => {
    const fenced = `Here is my assessment:\n\`\`\`json\n${VALID_DECISION}\n\`\`\`\n`;
    assert.equal(parseOracleDecision(fenced).action, 'hold');
});

test('oracle decision parser enforces every bound instead of trusting the model', () => {
    const cases: Array<[string, RegExp]> = [
        ['{"action":"rug","riskScore":10,"confidence":0.5,"rationale":"moon"}', /action must be one of/],
        ['{"action":"hold","riskScore":101,"confidence":0.5,"rationale":"moon"}', /riskScore must be an integer 0\.\.100/],
        ['{"action":"hold","riskScore":10.5,"confidence":0.5,"rationale":"moon"}', /riskScore must be an integer 0\.\.100/],
        ['{"action":"hold","riskScore":-1,"confidence":0.5,"rationale":"moon"}', /riskScore must be an integer 0\.\.100/],
        ['{"action":"hold","riskScore":10,"confidence":1.5,"rationale":"moon"}', /confidence must be a number 0\.\.1/],
        ['{"action":"hold","riskScore":10,"confidence":0.5,"rationale":""}', /rationale must be a non-empty string/],
        [
            `{"action":"hold","riskScore":10,"confidence":0.5,"rationale":"${'x'.repeat(MAX_RATIONALE_LENGTH + 1)}"}`,
            /rationale must be a non-empty string/
        ],
        ['no json at all', /does not contain a JSON object/],
        // Braces present but the payload is malformed.
        ['{"action":"hold",}', /not valid JSON/],
        ['', /oracle reply is empty/]
    ];
    for (const [raw, pattern] of cases) {
        assert.throws(() => parseOracleDecision(raw), pattern, `expected rejection for ${raw.slice(0, 40)}`);
    }
    assert.equal(MAX_RATIONALE_LENGTH, 500);
});

test('oracle pins the model to the decision schema', () => {
    const system = oracleDecisionSystemPrompt();
    for (const action of ORACLE_ACTIONS) assert.ok(system.includes(`"${action}"`), `system prompt must name ${action}`);
    assert.match(system, /riskScore/);
    assert.match(system, /confidence/);
    assert.match(system, /rationale/);
});

test('oracle end-to-end returns a validated decision from a mocked provider', async () => {
    const { provider, calls } = providerWith(() => rawResponse(completionPayload(VALID_DECISION)));
    const decision = await requestOracleDecision(provider, 'reserve ratio is 4%');
    assert.equal(decision.action, 'hold');
    assert.equal(decision.riskScore, 20);
    assert.equal(calls[0]!.body.temperature, 0);
    assert.equal(calls[0]!.body.max_tokens, 512);
    assert.deepEqual(calls[0]!.body.messages, [
        { role: 'system', content: oracleDecisionSystemPrompt() },
        { role: 'user', content: 'reserve ratio is 4%' }
    ]);
});

test('oracle end-to-end rejects an out-of-contract model reply', async () => {
    const { provider } = providerWith(() => rawResponse(completionPayload('{"action":"hold","riskScore":999,"confidence":2,"rationale":"x"}')));
    await assert.rejects(requestOracleDecision(provider, 'anything'), OracleResponseError);
});

/* -------------------------------------------------------------------------- */
/* CLI                                                                        */
/* -------------------------------------------------------------------------- */

test('oracle CLI reports a missing prompt', async () => {
    const out: string[] = [];
    const err: string[] = [];
    const code = await main([], { env: {}, stdout: (l) => out.push(l), stderr: (l) => err.push(l) });
    assert.equal(code, 2);
    assert.equal(out.length, 0);
    assert.match(err.join('\n'), /usage: npm run oracle:smoke/);
});

test('oracle CLI reports a missing key instead of inventing a result', async () => {
    const err: string[] = [];
    const code = await main(['assess'], { env: {}, stdout: () => {}, stderr: (l) => err.push(l) });
    assert.equal(code, 1);
    assert.match(err.join('\n'), /missing xAI API key/);
});

test('oracle CLI prints one decision as JSON with an injected provider', async () => {
    const provider: OracleProvider = {
        name: 'grok',
        model: 'grok-4.7',
        complete: async () => ({ provider: 'grok', model: 'grok-4.7', text: VALID_DECISION })
    };
    const out: string[] = [];
    const code = await main(['assess', 'the', 'reserve'], {
        env: {},
        provider,
        stdout: (l) => out.push(l),
        stderr: () => {}
    });
    assert.equal(code, 0);
    const parsed = JSON.parse(out.join('\n')) as { model: string; decision: { action: string } };
    assert.equal(parsed.model, 'grok-4.7');
    assert.equal(parsed.decision.action, 'hold');
});
