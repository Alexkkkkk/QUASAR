// Learning engine: aggregate lessons -> promote proven rules into
// pattern/pitfall drafts. Deterministic; optional LLM polish when a
// provider key is present. Promotions NEVER auto-merge — human reviews
// the draft PR, always.
import { PROMOTION, PATTERNS_FILE, PITFALLS_FILE } from './config.mjs';
import { readLessons, readMarkdown, writeDraft, writeState, readState } from './knowledge.mjs';

async function maybePolish(text) {
  const usingGroq = Boolean(process.env.GROQ_API_KEY);
  const key = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) return text;
  const base = usingGroq
    ? 'https://api.groq.com/openai/v1'
    : 'https://api.openai.com/v1';
  try {
    const res = await fetch(base + '/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.SWARM_MODEL || (usingGroq ? 'llama-3.1-8b-instant' : 'gpt-4o-mini'),
        temperature: 0,
        max_tokens: 400,
        messages: [
          {
            role: 'system',
            content: 'You compress agent lessons into concise coding rules. '
              + 'Output: a rule title, one-sentence rule, and why. '
              + 'Plain text only, no markdown headers.',
          },
          { role: 'user', content: text },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || text;
  } catch {
    return text; // network down -> never block learning on the LLM
  }
}

function groupBySig(lessons) {
  const groups = new Map();
  for (const l of lessons) {
    if (!groups.has(l._sig)) groups.set(l._sig, []);
    groups.get(l._sig).push(l);
  }
  return groups;
}

function assess(group) {
  const n = group.length;
  const passes = group.filter((l) => l.evidence?.tests).length;
  const passRate = passes / n;
  const solutions = new Set(group.map((l) => l.solution.trim()));
  const agents = [...new Set(group.map((l) => l.agent))].sort();
  const last = group.reduce((a, b) => (a.ts > b.ts ? a : b));
  return {
    n, passes, passRate, solutions: solutions.size, agents,
    lastTs: last.ts, kind: last.kind, task: last.task,
    sample: last,
  };
}

function ruleFor(a) {
  const s = a.sample;
  return {
    title: `${s.error.type}: ${s.task}`,
    rule: s.solution.trim(),
    why: `Proven ${a.passes}/${a.n} runs green by ${a.agents.join(', ')}.`,
  };
}

export async function learn({ dryRun = false } = {}) {
  const { lessons, quarantine, structural } = readLessons();
  const groups = groupBySig(lessons);

  const promoted = [];
  const contradictions = [];
  const pending = [];

  for (const [sig, group] of groups) {
    const a = assess(group);
    if (a.solutions > 1 && a.n >= PROMOTION.minOccurrences) {
      contradictions.push({
        sig, agents: a.agents, n: a.n,
        competing: [...new Set(group.map((l) => l.solution.trim()))].slice(0, 4),
      });
      continue;
    }
    if (a.n >= PROMOTION.minOccurrences
      && a.passRate >= PROMOTION.minPassRate
      && a.solutions <= PROMOTION.maxSolutions) {
      promoted.push({ sig, ...ruleFor(a), n: a.n, agents: a.agents });
    } else {
      pending.push({ sig, n: a.n, passRate: Number(a.passRate.toFixed(2)), agents: a.agents });
    }
  }

  const patternDraft = [
    '# Pattern Drafts (auto-generated — human review required)', '',
    ...promoted.filter((p) => p.kind !== 'pitfall').flatMap((p) => [
      `## ${p.title}`, `- Rule: ${p.rule}`, `- Why: ${p.why}`,
      `- Signature: \`${p.sig}\`  |  evidence: ${p.n} runs`, '',
    ]),
  ].join('\n');

  const pitfallDraft = [
    '# Pitfall Drafts (auto-generated — human review required)', '',
    ...promoted.filter((p) => p.kind === 'pitfall').flatMap((p) => [
      `## ${p.title}`, `- Rule: ${p.rule}`, `- Why: ${p.why}`, '',
    ]),
    ...contradictions.flatMap((c) => [
      `## CONFLICT ${c.sig}`,
      `- Agents ${c.agents.join(', ')} propose different fixes (${c.n} lessons).`,
      '- Human must pick one before promotion.', '',
    ]),
  ].join('\n');

  let polishedPatterns = patternDraft;
  if (!dryRun && promoted.length > 0) {
    polishedPatterns = await maybePolish(patternDraft);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      lessons: lessons.length, signatures: groups.size,
      promoted: promoted.length, contradictions: contradictions.length,
      pending: pending.length, quarantined: quarantine.length,
      structuralErrors: structural.length,
    },
    promoted: promoted.map((p) => ({ sig: p.sig, title: p.title, n: p.n })),
    contradictions,
    pendingTop: pending.sort((x, y) => y.n - x.n).slice(0, 10),
    quarantine, structural,
  };

  if (!dryRun) {
    writeDraft('patterns.md', polishedPatterns);
    writeDraft('pitfalls.md', pitfallDraft);
    writeState('learn-report.json', report);
  }
  return report;
}

// Idle-mode gate: is there material newer than the last completed cycle?
export async function hasPendingWork() {
  const { lessons, quarantine, structural } = readLessons();
  if (quarantine.length > 0 || structural.length > 0) return true;
  const last = readState('learn-report.json');
  if (!last?.generatedAt) return lessons.length > 0;
  const since = Date.parse(last.generatedAt);
  if (!Number.isFinite(since)) return true;
  return lessons.some((l) => Date.parse(l.ts) > since);
}
