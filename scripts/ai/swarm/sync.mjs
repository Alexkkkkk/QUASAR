// Cross-agent synchronization. Every agent reads the SAME knowledge base;
// sync answers three questions each cycle:
//   1. Consistency — do agents agree (no competing solutions)?
//   2. Decay — is old knowledge still being reinforced?
//   3. Coverage — which agents never contribute (silent agents drift)?
import { DECAY_DAYS, PATTERNS_FILE, PITFALLS_FILE } from './config.mjs';
import { readLessons, readMarkdown, writeState, knowledgeSizeKiB } from './knowledge.mjs';

const DAY = 24 * 3600 * 1000;

function tokenize(text) {
  return String(text).toLowerCase().match(/[a-z0-9_]{3,}/g) ?? [];
}

function tf(tokens) {
  const m = new Map();
  for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1);
  return m;
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const [k, v] of a) { na += v * v; if (b.has(k)) dot += v * b.get(k); }
  for (const v of b.values()) nb += v * v;
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function sectionsOf(markdown) {
  const out = [];
  const chunks = markdown.split(/^## /m).filter(Boolean);
  for (const c of chunks) {
    const [head, ...rest] = c.split('\n');
    out.push({ title: head.trim(), body: rest.join('\n'), vec: tf(tokenize(c)) });
  }
  return out;
}

export function sync({ now = Date.now() } = {}) {
  const { lessons, quarantine, structural } = readLessons();
  const groups = new Map();
  for (const l of lessons) {
    if (!groups.has(l._sig)) groups.set(l._sig, []);
    groups.get(l._sig).push(l);
  }

  const conflicts = [];
  for (const [sig, g] of groups) {
    const sols = new Set(g.map((l) => l.solution.trim()));
    if (sols.size > 1) {
      conflicts.push({
        sig, n: g.length, agents: [...new Set(g.map((l) => l.agent))].sort(),
        solutions: [...sols].slice(0, 4),
      });
    }
  }

  const stale = [];
  for (const [sig, g] of groups) {
    const last = Math.max(...g.map((l) => Date.parse(l.ts)));
    const ageDays = (now - last) / DAY;
    if (ageDays > DECAY_DAYS) {
      stale.push({ sig, ageDays: Math.round(ageDays), lastAgent: g.find((l) => Date.parse(l.ts) === last)?.agent });
    }
  }

  const agentStats = new Map();
  for (const l of lessons) {
    if (!agentStats.has(l.agent)) agentStats.set(l.agent, { lessons: 0, pass: 0, fail: 0, sigs: new Set() });
    const s = agentStats.get(l.agent);
    s.lessons++; l.evidence?.tests ? s.pass++ : s.fail++;
    s.sigs.add(l._sig);
  }

  const patterns = sectionsOf(readMarkdown(PATTERNS_FILE));
  const pitfalls = sectionsOf(readMarkdown(PITFALLS_FILE));
  const nearDupes = [];
  for (const p of patterns) {
    for (const f of pitfalls) {
      const c = cosine(p.vec, f.vec);
      if (c > 0.9 && p.title !== f.title) {
        nearDupes.push({ pattern: p.title, pitfall: f.title, similarity: Number(c.toFixed(3)) });
      }
    }
  }

  const total = lessons.length || 1;
  const passRate = lessons.filter((l) => l.evidence?.tests).length / total;
  const conflictRatio = conflicts.length / (groups.size || 1);
  const health = Math.round(100 * (
    0.4 * passRate +
    0.3 * (1 - Math.min(conflictRatio * 4, 1)) +
    0.2 * Math.min(lessons.length / 50, 1) +
    0.1 * (quarantine.length === 0 ? 1 : 0.5)
  ));

  const report = {
    generatedAt: new Date(now).toISOString(),
    health,
    knowledgeKiB: knowledgeSizeKiB(),
    totals: { lessons: lessons.length, signatures: groups.size, agents: agentStats.size },
    passRate: Number(passRate.toFixed(3)),
    conflicts: conflicts.sort((a, b) => b.n - a.n),
    stale: stale.sort((a, b) => b.ageDays - a.ageDays),
    nearDupes,
    agents: [...agentStats.entries()]
      .map(([agent, s]) => ({
        agent, lessons: s.lessons,
        passRate: Number((s.pass / (s.pass + s.fail)).toFixed(2)),
        uniqueSig: s.sigs.size,
      }))
      .sort((a, b) => b.lessons - a.lessons),
    quarantine, structural,
  };

  const md = [
    '# Swarm Sync Report', '',
    `- Health: **${health}/100**`,
    `- Lessons: ${report.totals.lessons} across ${report.totals.signatures} signatures, ${report.totals.agents} agents`,
    `- Pass rate: ${(passRate * 100).toFixed(1)}%`,
    `- Conflicts: ${conflicts.length} | Stale: ${stale.length} | Near-dup rules: ${nearDupes.length}`,
    '', '## Agents', '',
    '| Agent | Lessons | Pass rate | Unique topics |',
    '| --- | ---: | ---: | ---: |',
    ...report.agents.map((a) => `| ${a.agent} | ${a.lessons} | ${a.passRate} | ${a.uniqueSig} |`),
    '', '## Conflicts', '',
    ...(conflicts.length
      ? conflicts.map((c) => `- \`${c.sig}\` — ${c.agents.join(', ')} (${c.n} lessons, ${c.solutions.length} competing fixes)`)
      : ['- none']),
    '', '## Stale knowledge', '',
    ...(stale.length
      ? stale.slice(0, 10).map((s) => `- \`${s.sig}\` — ${s.ageDays}d old (last: ${s.lastAgent})`)
      : ['- none']),
    '',
  ].join('\n');

  writeState('sync-report.json', report);
  writeState('sync-report.md', md);
  return report;
}
