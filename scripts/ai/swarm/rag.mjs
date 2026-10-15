// Minimal retrieval layer — zero-dependency TF-IDF over the knowledge
// base + TON Docs snapshot. Gives every agent the same "shared brain"
// without external vector DBs. Agents call `query()` before acting and
// attach top hits to their prompt context.
import fs from 'node:fs';
import path from 'node:path';
import { TON_DOCS_DIR, STATE_DIR, CAPS, PATTERNS_FILE, PITFALLS_FILE } from './config.mjs';
import { readLessons, readMarkdown, writeState } from './knowledge.mjs';
import { validateLesson } from './schema.mjs';
import { scanLessonLine } from './security.mjs';

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

export function query(text, { k = 5, index = null, extraDocs = [] } = {}) {
  const idx = index ?? buildIndex({ persist: false });
  const qm = new Map();
  for (const t of tokenize(text)) qm.set(t, (qm.get(t) ?? 0) + 1);
  const idf = new Map(idx.idf);
  const qv = new Map([...qm].map(([t, c]) => [t, c * (idf.get(t) ?? 0)]));
  const qn = Math.sqrt([...qv.values()].reduce((a, b) => a + b * b, 0)) || 1;
  const remoteQv = new Map([...qm].map(([t, c]) => [t, c * (idf.get(t) ?? 1)]));
  const remoteQn = Math.sqrt([...remoteQv.values()].reduce((a, b) => a + b * b, 0)) || 1;

  const scores = idx.vectors.map((pairs, i) => {
    const v = new Map(pairs);
    let dot = 0;
    for (const [t, c] of qv) if (v.has(t)) dot += c * v.get(t);
    return { i, score: dot / (qn * idx.norms[i]) };
  });
  const remoteHits = (Array.isArray(extraDocs) ? extraDocs : [])
    .filter((d) => d && typeof d.text === 'string')
    .map((d) => {
      const docTokens = tokenize(d.text);
      const counts = new Map();
      for (const t of docTokens) counts.set(t, (counts.get(t) ?? 0) + 1);
      let dot = 0, docNorm = 0;
      for (const [t, c] of counts) {
        const w = c * (idf.get(t) ?? 1);
        docNorm += w * w;
        if (remoteQv.has(t)) dot += remoteQv.get(t) * w;
      }
      const score = dot / (remoteQn * (Math.sqrt(docNorm) || 1));
      return { score, id: d.id || 'remote:knowledge', source: d.source || 'remote lessons', text: d.text.slice(0, 280) };
    });
  const localHits = scores.map((s) => ({
    score: s.score,
    id: idx.entries[s.i].id,
    source: idx.entries[s.i].source,
    text: idx.entries[s.i].text.slice(0, 280),
  }));
  return [...localHits, ...remoteHits]
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((s) => s.score > 0.05)
    .map((s) => ({ ...s, score: Number(s.score.toFixed(3)) }));
}

export function queryContext(text, k = 4, extraDocs = []) {
  const hits = query(text, { k, extraDocs });
  if (hits.length === 0) return '';
  return ['SHARED KNOWLEDGE (from other agents):', ...hits.map((h) => '- [' + h.source + ' | ' + h.id + '] ' + h.text), ''].join('\n');
}

export function riskScore(text) {
  const queryWords = new Set(tokenize(text));
  if (!queryWords.size) return { score: 0, reasons: [] };
  const { lessons } = readLessons();
  const ranked = lessons.map((lesson) => {
    const words = new Set(tokenize([lesson.task, lesson.error.type, lesson.error.message, lesson.solution].join(' ')));
    let overlap = 0;
    for (const word of queryWords) if (words.has(word)) overlap++;
    const score = overlap / (Math.sqrt(queryWords.size * words.size) || 1);
    return { lesson, score };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
  const weight = ranked.reduce((sum, x) => sum + x.score, 0);
  const failedWeight = ranked.reduce((sum, x) => sum + (x.lesson.evidence.tests ? 0 : x.score), 0);
  return {
    score: weight ? Math.round((failedWeight / weight) * 100) : 0,
    reasons: ranked.map((x) => ({
      id: x.lesson.id,
      task: x.lesson.task,
      failed: !x.lesson.evidence.tests,
      similarity: Number(x.score.toFixed(3)),
    })),
  };
}

const MAX_REMOTE_BYTES = CAPS.maxKnowledgeKiB * 1024;

// Fetch only the canonical lesson file from a public GitHub repository URL.
// Restrict the host/path to avoid turning CLI input into an arbitrary fetch.
export async function fetchRemoteLessons(remote) {
  let url;
  try { url = new URL(remote); }
  catch { throw new Error('remote must be a GitHub repository URL'); }
  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.port || url.username || url.password || url.search || url.hash) {
    throw new Error('remote must be an https://github.com/<owner>/<repo> URL');
  }
  const match = url.pathname.match(/^\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/?$/);
  if (!match) throw new Error('remote must point to a GitHub repository root');
  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, '');
  const apiUrl = 'https://api.github.com/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo)
    + '/contents/docs/ai/knowledge/lessons.jsonl';
  const response = await fetch(apiUrl, {
    headers: { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error('remote lessons fetch failed: HTTP ' + response.status);
  const file = await response.json();
  if (file.size > MAX_REMOTE_BYTES || file.encoding !== 'base64' || typeof file.content !== 'string') {
    throw new Error('remote lessons file is missing, too large, or not base64 encoded');
  }
  const raw = Buffer.from(file.content.replace(/\s/g, ''), 'base64').toString('utf8');
  if (Buffer.byteLength(raw, 'utf8') > MAX_REMOTE_BYTES) throw new Error('remote lessons file exceeds the size limit');
  const out = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || Buffer.byteLength(line, 'utf8') > CAPS.maxLessonBytes) continue;
    let lesson;
    try { lesson = JSON.parse(line); } catch { continue; }
    if (!validateLesson(lesson).ok || !scanLessonLine(line).safe) continue;
    out.push({
      id: 'remote-lesson:' + lesson.id,
      source: 'remote ' + owner + '/' + repo + ' (' + lesson.agent + ')',
      text: 'Task: ' + lesson.task + '\n' + lesson.error.type + ': ' + lesson.error.message + '\nFix: ' + lesson.solution,
    });
  }
  return out;
}
