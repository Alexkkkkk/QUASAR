// Schema + canonical signatures for lessons.jsonl entries.
import crypto from 'node:crypto';

export function normalizeError(message) {
  return String(message ?? '')
    .toLowerCase()
    .replace(/0x[a-f0-9]+/g, '<hex>')
    .replace(/\beq[a-z0-9_-]{30,}/g, '<addr>')
    .replace(/[a-f0-9]{48,}/g, '<hash>')
    .replace(/\b\d+(?:\.\d+)?\b/g, '<n>')
    .replace(/\b[a-z0-9_-]+\.(?:tolk|tact|ts|js|mjs|json|md)\b/g, '<file>')
    .replace(/\/[^\s"'`]+/g, '<path>')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, 256);
}

export function signatureOf(error) {
  const base = normalizeError(error?.message ?? error);
  return 'sig:' + crypto.createHash('sha1').update(base).digest('hex').slice(0, 16);
}

export function lessonId(agent, sig, ts) {
  return crypto.createHash('sha1').update(`${agent}|${sig}|${ts}`).digest('hex').slice(0, 12);
}

const isStr = (v, min = 1, max = Infinity) =>
  typeof v === 'string' && v.trim().length >= min && v.length <= max;

export function validateLesson(raw) {
  const errors = [];
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['lesson must be a JSON object'] };
  }
  if (!isStr(raw.id, 8, 64)) errors.push('id: string 8..64 chars');
  if (!isStr(raw.agent, 2, 32) || !/^[a-z0-9-]+$/.test(raw.agent))
    errors.push('agent: lowercase kebab-case string');
  if (!['fix', 'review', 'pattern', 'pitfall', 'sync'].includes(raw.kind))
    errors.push('kind: one of fix|review|pattern|pitfall|sync');
  if (!isStr(raw.task, 4, 512)) errors.push('task: string 4..512 chars');
  if (!raw.error || !isStr(raw.error.type, 2, 64) || !isStr(raw.error.message, 4, 2000))
    errors.push('error: {type, message} required');
  if (!isStr(raw.solution, 10, 2000)) errors.push('solution: string 10..2000 chars');
  if (!raw.evidence || typeof raw.evidence.tests !== 'boolean')
    errors.push('evidence: {tests: boolean} required');
  if (raw.evidence?.pr != null && !/^[a-z0-9./#_-]{1,64}$/i.test(String(raw.evidence.pr)))
    errors.push('evidence.pr: invalid reference');
  if (!Number.isFinite(Date.parse(raw.ts))) errors.push('ts: parseable date required');
  if (raw.confidence != null && !(raw.confidence >= 0 && raw.confidence <= 1))
    errors.push('confidence: number 0..1');
  return { ok: errors.length === 0, errors };
}
