import assert from 'node:assert/strict';
import test from 'node:test';
import { GrokOracle, GrokOracleError } from '../scripts/ai_oracle.js';

function completionResponse(
    content: string,
    finishReason = 'stop'
): Response {
    return new Response(JSON.stringify({
        choices: [{
            finish_reason: finishReason,
            message: { role: 'assistant', content }
        }]
    }), { status: 200, headers: { 'content-type': 'application/json' } });
}

test('Grok adapter sends one bounded text-only request and returns assistant text', async () => {
    let requestUrl = '';
    let request: RequestInit | undefined;
    const oracle = new GrokOracle({
        apiKey: 'test-secret',
        model: 'grok-test-model',
        maxCompletionTokens: 123,
        fetchImpl: async (input, init) => {
            requestUrl = String(input);
            request = init;
            return completionResponse('  Reviewed summary.  ');
        }
    });

    assert.equal(await oracle.complete('Summarize this for review'), 'Reviewed summary.');
    assert.equal(requestUrl, 'https://api.x.ai/v1/chat/completions');
    assert.equal(request?.method, 'POST');
    assert.equal(new Headers(request?.headers).get('authorization'), 'Bearer test-secret');
    assert.equal(new Headers(request?.headers).get('content-type'), 'application/json');

    const body = JSON.parse(String(request?.body)) as {
        model: string;
        messages: Array<{ role: string; content: string }>;
        max_completion_tokens: number;
        n: number;
        stream: boolean;
        temperature: number;
        tools?: unknown[];
    };
    assert.equal(body.model, 'grok-test-model');
    assert.deepEqual(body.messages.map(({ role }) => role), ['system', 'user']);
    assert.match(body.messages[0]?.content ?? '', /cannot authorize, sign, or send blockchain transactions/);
    assert.equal(body.messages[1]?.content, 'Summarize this for review');
    assert.equal(body.max_completion_tokens, 123);
    assert.equal(body.n, 1);
    assert.equal(body.stream, false);
    assert.equal(body.temperature, 0);
    assert.equal(body.tools, undefined);
    assert.ok(request?.signal instanceof AbortSignal);
});

test('Grok adapter rejects empty prompts and oversized prompts before network access', async () => {
    let calls = 0;
    const oracle = new GrokOracle({
        apiKey: 'test-secret',
        maxPromptChars: 4,
        fetchImpl: async () => {
            calls += 1;
            return completionResponse('unreachable');
        }
    });

    await assert.rejects(oracle.complete('  '), (error: unknown) =>
        error instanceof GrokOracleError && error.code === 'invalid_prompt'
    );
    await assert.rejects(oracle.complete('12345'), (error: unknown) =>
        error instanceof GrokOracleError && error.code === 'prompt_too_long'
    );
    assert.equal(calls, 0);
});

test('Grok adapter requires a key without exposing it in errors', async () => {
    const oracle = new GrokOracle({ apiKey: '' });
    await assert.rejects(oracle.complete('review'), (error: unknown) => {
        assert.ok(error instanceof GrokOracleError);
        assert.equal(error.code, 'missing_api_key');
        assert.equal(error.message.includes('test-secret'), false);
        return true;
    });
});

test('Grok adapter reports HTTP errors without echoing provider response bodies', async () => {
    const oracle = new GrokOracle({
        apiKey: 'test-secret',
        fetchImpl: async () => new Response('test-secret was rejected', { status: 429 })
    });

    await assert.rejects(oracle.complete('review'), (error: unknown) => {
        assert.ok(error instanceof GrokOracleError);
        assert.equal(error.code, 'http_error');
        assert.match(error.message, /HTTP 429/);
        assert.equal(error.message.includes('test-secret'), false);
        assert.equal(error.message.includes('rejected'), false);
        return true;
    });
});

test('Grok adapter rejects truncated, refused, tool-call, and empty responses', async (t) => {
    const cases = [
        {
            name: 'truncated response',
            response: new Response(JSON.stringify({
                choices: [{ finish_reason: 'length', message: { content: 'partial' } }]
            }), { status: 200 }),
            code: 'truncated_response'
        },
        {
            name: 'refusal',
            response: new Response(JSON.stringify({
                choices: [{ message: { content: null, refusal: 'refused' } }]
            }), { status: 200 }),
            code: 'provider_refusal'
        },
        {
            name: 'unexpected tool call',
            response: new Response(JSON.stringify({
                choices: [{ message: { content: 'text', tool_calls: [{ id: 'unexpected' }] } }]
            }), { status: 200 }),
            code: 'unexpected_tool_call'
        },
        {
            name: 'empty assistant text',
            response: new Response(JSON.stringify({
                choices: [{ message: { content: '   ' } }]
            }), { status: 200 }),
            code: 'empty_response'
        },
        {
            name: 'invalid JSON',
            response: new Response('not json', { status: 200 }),
            code: 'invalid_response'
        }
    ];

    for (const item of cases) {
        await t.test(item.name, async () => {
            const oracle = new GrokOracle({
                apiKey: 'test-secret',
                fetchImpl: async () => item.response
            });
            await assert.rejects(oracle.complete('review'), (error: unknown) =>
                error instanceof GrokOracleError && error.code === item.code
            );
        });
    }
});

test('Grok adapter aborts requests at the configured timeout', async () => {
    const oracle = new GrokOracle({
        apiKey: 'test-secret',
        timeoutMs: 10,
        fetchImpl: async (_input, init) => new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
        })
    });

    await assert.rejects(oracle.complete('review'), (error: unknown) =>
        error instanceof GrokOracleError && error.code === 'timeout'
    );
});