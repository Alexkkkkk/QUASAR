// Learning engine v3: aggregate lessons -> promote proven rules.
// Additions: reputation-weighted confidence, human override wins,
// wording-clustering, adversarial pre-promotion check, onboarding gen,
// multi-backend LLM (Ollama local -> Groq -> OpenAI -> none).
import path from 'node:path';
import {
  PROMOTION, DECAY_DAYS, KNOWLEDGE_DIR,
  PATTERNS_FILE, PITFALLS_FILE,
} from './config.mjs';
import { normalizeError } from './schema.mjs';
import {
  readLessons, readMarkdown, writeDraft, writeState, readState, writeMarkdown,
} from './knowledge.mjs';

const DAY = 24 * 3600 * 1000;

// Backend chain: OLLAMA_URL (local) -> GROQ_API_KEY -> OPENAI_API_KEY -> none.
// Exported for tests; pure env inspection, no network.
export function llmConfig() {
  if (process.env.OLLAMA_URL) return { type: 'ollama', base: process.env.OLLAMA_URL };
  const key = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (key) {
    return {
      type: 'openai', key,
      base: process.env.GROQ_API_KEY
        ? 'https://api.groq.com/openai/v1'
        : 'https://api.openai.com/v1',
    };
  }
  return null;
}

export async function llm(system, user, maxTokens = 400) {
  const ep = llmConfig();
  if (!ep) return null;
  try {
    if (ep.type === 'ollama') {
      const res = await fetch(ep.base.replace(/\/$/, '') + '/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'qwen2.5-coder:1.5b',
          system, prompt: user, stream: false,
          options: { num_predict: maxTokens, temperature: 0 },
        }),
        signal: AbortSignal.timeout(120_000), // CPU inference is slow; be patient
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data.response || '').trim() || null;
    }
    const res = await fetch(ep.base + '/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${ep.key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.SWARM_MODEL || 'llama-3.1-8b-instant',
        temperature: 0,
        max_tokens: maxTokens,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

async function maybePolish(text) {
  return (await llm(
    'You compress agent lessons into concise coding rules. '
      + 'Output: a rule title, one-sentence rule, and why. '
      + 'Plain text only, no markdown headers.',
    text,
  )) ?? text;
}

// Adversarial gate: attack the rule before promotion. If a concrete
// counterexample is found, the rule is held for human review instead
// of entering the draft.
async function adversarialAttack(rule) {
  const out = await llm(
    'You are a hostile senior auditor. Attack the coding rule below. '
      + 'If you can construct ONE concrete, realistic scenario where following '
      + 'this rule causes a bug, security hole or gas exhaustion, reply exactly '
      + 'with "COUNTEREXAMPLE: <one line>". Otherwise reply exactly "SOLID".',
    `Rule: ${rule.title}\n${rule.rule}\nContext: ${rule.why}`,
    120,
  );
  if (!out) return { held: false };            // no LLM -> don't hold
  if (out.toUpperCase().startsWith('COUNTEREXAMPLE')) {
    return { held: true, note: out.slice(0, 300) };
  }
  return { held: false };
}

// ---------- text utils ----------

function tokenize(text) {
  return String(text).toLowerCase().match(/[a-z0-9_]{3,}/g) ?? [];
}

// ---------- reputation + confidence ----------

function agentWeights(lessons) {
  const stats = new Map();
  for (const l of lessons) {
    if (!stats.has(l.agent)) stats.set(l.agent, { p: 0, f: 0 });
    const s = stats.get(l.agent);
    l.evidence?.tests ? s.p++ : s.f++;
  }
  const weights = new Map();
  for (const [agent, s] of stats) {
    weights.set(agent, 0.5 + 0.5 * (s.p / (s.p + s.f || 1)));
  }
  // Human teaching outweighs everything.
  weights.set('human', Math.max(1, weights.get('human') ?? 1));
  return weights;
}

// Confidence = reputation of teachers × decay by age of last reinforcement.
function confidenceFor(group, weights, now = Date.now()) {
  const avg = group.reduce((s, l) => s + (weights.get(l.agent) ?? 0.75), 0) / group.length;
  const last = Math.max(...group.map((l) => Date.parse(l.ts)));
  const ageDays = Math.max(0, (now - last) / DAY);
  const decay = Math.max(0.3, 1 - (ageDays / DECAY_DAYS) * 0.7);
  return Number(Math.min(1, avg * decay).toFixed(2));
}

// ---------- clustering: merge same root cause in different words ----------

function clusterSignatures(groups, threshold = 0.75) {
  const entries = [...groups.entries()];
  if (entries.length < 2) return groups;
  const vecs = entries.map(([, g]) => {
    const m = new Map();
    for (const t of tokenize(normalizeError(g[0].error.message))) m.set(t, (m.get(t) ?? 0) + 1);
    return m;
  });
  const cos = (a, b) => {
    let dot = 0, na = 0, nb = 0;
    for (const [k, v] of a) { na += v * v; if (b.has(k)) dot += v * b.get(k); }
    for (const v of b.values()) nb += v * v;
    return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
  };
  const parent = entries.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (cos(vecs[i], vecs[j]) >= threshold) parent[find(i)] = find(j);
    }
  }
  const out = new Map();
  entries.forEach(([, g], i) => {
    const key = entries[find(i)][0];
    if (!out.has(key)) out.set(key, []);
    out.get(key).push(...g);
  });
  return out;
}

// ---------- aggregation ----------

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
  return { n, passes, passRate, solutions: solutions.size, agents, lastTs: last.ts, kind: last.kind, sample: last };
}

function ruleFor(a, human) {
  const s = human ?? a.sample;
  return {
    title: `${s.error.type}: ${s.task}`,
    rule: s.solution.trim(),
    why: human
      ? `Human override — maintainer solution chosen over ${a.solutions - 1} agent variant(s). Proven ${a.passes}/${a.n} runs.`
      : `Proven ${a.passes}/${a.n} runs green by ${a.agents.join(', ')}.`,
  };
}

export async function learn({ dryRun = false } = {}) {
  const { lessons, quarantine, structural } = readLessons();
  const weights = agentWeights(lessons);
  const groups = clusterSignatures(groupBySig(lessons));

  let promoted = [];
  const contradictions = [];
  const pending = [];

  for (const [sig, group] of groups) {
    const a = assess(group);
    const human = group.find((l) => l.agent === 'human');
    if (a.solutions > 1 && !human) {
      contradictions.push({
        sig, agents: a.agents, n: a.n,
        competing: [...new Set(group.map((l) => l.solution.trim()))].slice(0, 4),
      });
      continue; // competing agent solutions must be resolved by a human
    }
    if (a.n >= PROMOTION.minOccurrences && a.passRate >= PROMOTION.minPassRate) {
      promoted.push({
        sig, ...ruleFor(a, human ?? null),
        n: a.n, agents: a.agents,
        confidence: confidenceFor(group, weights),
      });
    } else {
      pending.push({ sig, n: a.n, passRate: Number(a.passRate.toFixed(2)), agents: a.agents });
    }
  }

  // Adversarial gate: attacked rules are held, never promoted.
  const held = [];
  if (!dryRun && promoted.length > 0) {
    const kept = [];
    for (const p of promoted) {
      const atk = await adversarialAttack(p);
      if (atk.held) held.push({ ...p, attack: atk.note });
      else kept.push(p);
    }
    promoted = kept;
  }

  const patternDraft = [
    '# Pattern Drafts (auto-generated — human review required)', '',
    ...promoted.filter((p) => p.kind !== 'pitfall').flatMap((p) => [
      `## ${p.title}`, `- Rule: ${p.rule}`, `- Why: ${p.why}`,
      `- Confidence: ${p.confidence} · signature: \`${p.sig}\` · evidence: ${p.n} runs`, '',
    ]),
    ...held.flatMap((p) => [
      `## HELD (adversarial counterexample) ${p.title}`,
      `- Proposed: ${p.rule}`, `- Attack: ${p.attack}`,
      '- Human must judge before this rule can be promoted.', '',
    ]),
  ].join('\n');

  const pitfallDraft = [
    '# Pitfall Drafts (auto-generated — human review required)', '',
    ...promoted.filter((p) => p.kind === 'pitfall').flatMap((p) => [
      `## ${p.title}`, `- Rule: ${p.rule}`, `- Why: ${p.why}`,
      `- Confidence: ${p.confidence}`, '',
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
      promoted: promoted.length, held: held.length,
      contradictions: contradictions.length,
      pending: pending.length, quarantined: quarantine.length,
      structuralErrors: structural.length,
    },
    promoted: promoted.map((p) => ({ sig: p.sig, title: p.title, rule: p.rule, why: p.why, n: p.n, confidence: p.confidence })),
    held, contradictions,
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
  return lessons.some((l) => Date.parse(l.ts) > since);
}

// New-agent curriculum: one file distilled from everything the swarm knows.
// Lives inside the knowledge base so autonomous merge (filesWithinKnowledge)
// can ingest it together with the rest.
export async function generateOnboarding({ outFile } = {}) {
  const { lessons } = readLessons();
  const patterns = readMarkdown(PATTERNS_FILE).replace(/^#[^\n]*\n/, '').trim();
  const pitfalls = readMarkdown(PITFALLS_FILE).replace(/^#[^\n]*\n/, '').trim();
  const counts = new Map();
  for (const l of lessons) counts.set(l.task, (counts.get(l.task) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);

  const md = [
    '# AI Onboarding — generated from swarm knowledge', '',
    'New agents start here. Everything below was learned by the swarm;',
    're-verify against current code before relying on it.', '',
    '## Hard-won patterns', '', patterns, '',
    '## Known pitfalls', '', pitfalls, '',
    '## Hottest topics (by lesson count)', '',
    ...(top.length ? top.map(([t, n]) => `- ${t} (${n} lessons)`) : ['- (no lessons yet)']), '',
    '_Regenerate: `node scripts/ai/swarm/cli.mjs onboard`_', '',
  ].join('\n');

  const file = outFile ?? path.join(KNOWLEDGE_DIR, 'ONBOARDING.md');
  writeMarkdown(file, md);
  return file;
}
