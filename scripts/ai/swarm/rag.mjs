// Minimal retrieval layer — zero-dependency TF-IDF over the knowledge
// base + TON Docs snapshot. Gives every agent the same "shared brain"
// without external vector DBs. Agents call `query()` before acting and
// attach top hits to their prompt context.
import fs from 'node:fs';
import path from 'node:path';
import { TON_DOCS_DIR, STATE_DIR, CAPS, PATTERNS_FILE, PITFALLS_FILE } from './config.mjs';
import { readLessons, readMarkdown, writeState } from './knowledge.mjs';

function tokenize(text) {
  return String(text).toLowerCase().match(/[a-z0-9_]{3,}/g) ?? [];
}

function chunkText(text, size = 180, step = 120) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < words.length && out.length < 400; i += step) {
    out.push(words.slice(i, i + size).join(' '));
  }
  return out;
}

function walk(dir, acc = [], depth = 0) {
  if (depth > 4 || !fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc, depth + 1);
    else if (e.name.endsWith('.md')) acc.push(p);
  }
  return acc;
}

export function buildIndex({ persist = true } = {}) {
  const docs = [];
  const { lessons } = readLessons();

  for (const l of lessons) {
    docs.push({
      id: `lesson:${l.id}`,
      source: `lessons.jsonl (${l.agent})`,
      text: `Task: ${l.task}\n${l.error.type}: ${l.error.message}\nFix: ${l.solution}`,
    });
  }
  for (const [file, tag] of [[PATTERNS_FILE, 'pattern'], [PITFALLS_FILE, 'pitfall']]) {
    const md = readMarkdown(file);
    for (const c of md.split(/^## /m).filter((s) => s.trim().length > 2)) {
      docs.push({ id: `${tag}:${c.split('\n')[0].trim().slice(0, 60)}`, source: file, text: c });
    }
  }
  for (const f of walk(TON_DOCS_DIR)) {
    const text = fs.readFileSync(f, 'utf8');
    const rel = path.relative(TON_DOCS_DIR, f);
    for (const [i, c] of chunkText(text).entries()) {
      docs.push({ id: `ton:${rel}#${i}`, source: rel, text: c });
    }
  }

  const capped = docs.slice(0, CAPS.maxIndexDocs);
  const df = new Map();
  const tfs = capped.map((d) => {
    const m = new Map();
    for (const t of tokenize(d.text)) m.set(t, (m.get(t) ?? 0) + 1);
    for (const t of m.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return m;
  });
  const idf = new Map([...df].map(([t, n]) => [t, Math.log(1 + capped.length / n)]));

  const vectors = tfs.map((m) => {
    const v = new Map();
    for (const [t, c] of m) v.set(t, c * (idf.get(t) ?? 0));
    return v;
  });
  const norms = vectors.map((v) => Math.sqrt([...v.values()].reduce((a, b) => a + b * b, 0)) || 1);

  const index = {
    builtAt: new Date().toISOString(),
    docs: capped.length,
    idf: [...idf],
    vectors: vectors.map((v) => [...v]),
    norms,
    entries: capped.map((d) => ({ id: d.id, source: d.source, text: d.text.slice(0, 500) })),
  };
  if (persist) writeState('rag-index.json', index);
  return index;
}

export function query(text, { k = 5, index = null } = {}) {
  const idx = index ?? buildIndex({ persist: false });
  const qm = new Map();
  for (const t of tokenize(text)) qm.set(t, (qm.get(t) ?? 0) + 1);
  const idf = new Map(idx.idf);
  const qv = new Map([...qm].map(([t, c]) => [t, c * (idf.get(t) ?? 0)]));
  const qn = Math.sqrt([...qv.values()].reduce((a, b) => a + b * b, 0)) || 1;

  const scores = idx.vectors.map((pairs, i) => {
    const v = new Map(pairs);
    let dot = 0;
    for (const [t, c] of qv) if (v.has(t)) dot += c * v.get(t);
    return { i, score: dot / (qn * idx.norms[i]) };
  });
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((s) => s.score > 0.05)
    .map((s) => ({
      score: Number(s.score.toFixed(3)),
      id: idx.entries[s.i].id,
      source: idx.entries[s.i].source,
      text: idx.entries[s.i].text.slice(0, 280),
    }));
}

export function queryContext(text, k = 4) {
  const hits = query(text, { k });
  if (hits.length === 0) return '';
  return ['SHARED KNOWLEDGE (from other agents):', ...hits.map((h) => `- [${h.source} | ${h.id}] ${h.text}`), ''].join('\n');
}
