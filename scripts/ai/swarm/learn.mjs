// Learning engine: aggregate lessons -> promote proven rules into
// pattern/pitfall drafts. Deterministic; no external model calls.
// Promotions NEVER auto-merge — human reviews the draft PR, always.
import { PROMOTION, PATTERNS_FILE, PITFALLS_FILE } from './config.mjs';
import { readLessons, readMarkdown, writeDraft, writeState } from './knowledge.mjs';

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

export function learn({ dryRun = false } = {}) {
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
    writeDraft('patterns.md', patternDraft);
    writeDraft('pitfalls.md', pitfallDraft);
    writeState('learn-report.json', report);
  }
  return report;
}
