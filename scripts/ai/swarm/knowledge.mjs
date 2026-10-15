// Knowledge base I/O. lessons.jsonl is append-only; every mutation goes
// through here so validation + quarantine can never be bypassed.
import fs from 'node:fs';
import path from 'node:path';
import {
  KNOWLEDGE_DIR, LESSONS_FILE, PATTERNS_FILE, PITFALLS_FILE,
  DRAFTS_DIR, STATE_DIR, CAPS,
} from './config.mjs';
import { validateLesson, signatureOf, lessonId } from './schema.mjs';
import { scanLessonLine, scanMarkdown } from './security.mjs';

function createFileIfMissing(file, initialContent) {
  let fd;
  try {
    fd = fs.openSync(file, 'wx', 0o600);
  } catch (error) {
    if (error?.code === 'EEXIST') return;
    throw error;
  }
  try {
    fs.writeFileSync(fd, initialContent);
  } finally {
    fs.closeSync(fd);
  }
}

export function ensureDirs() {
  for (const d of [KNOWLEDGE_DIR, DRAFTS_DIR, STATE_DIR]) fs.mkdirSync(d, { recursive: true });
  createFileIfMissing(LESSONS_FILE, '');
  createFileIfMissing(PATTERNS_FILE, '# Patterns\n\nPromoted, CI-proven rules all agents must follow.\n');
  createFileIfMissing(PITFALLS_FILE, '# Pitfalls\n\nKnown failure modes. Check before shipping.\n');
}

export function readLessons() {
  ensureDirs();
  const raw = fs.readFileSync(LESSONS_FILE, 'utf8');
  // Comment lines (# ...) and blank lines are human documentation, not data:
  // skip them before JSON parsing instead of counting them as structural errors.
  const lines = raw.split('\n').filter((l) => { const t = l.trim(); return t.length > 0 && !t.startsWith('#'); });
  const lessons = [];
  const quarantine = [];
  const structural = [];
  if (lines.length > CAPS.maxLessons) {
    structural.push(`too many lessons: ${lines.length} > ${CAPS.maxLessons}`);
  }
  lines.forEach((line, i) => {
    let obj;
    try { obj = JSON.parse(line); }
    catch { structural.push(`line ${i + 1}: invalid JSON`); return; }
    const sec = scanLessonLine(line);
    if (!sec.safe) { quarantine.push({ line: i + 1, violations: sec.violations }); return; }
    const val = validateLesson(obj);
    if (!val.ok) { structural.push(`line ${i + 1}: ${val.errors.join('; ')}`); return; }
    lessons.push({ ...obj, _sig: signatureOf(obj.error) });
  });
  return { lessons, quarantine, structural };
}

export function appendLesson({ agent, kind, task, error, solution, evidence, confidence, ts }) {
  ensureDirs();
  const lesson = {
    id: '', agent, kind, task,
    error: { type: error.type, message: error.message },
    solution, evidence, ts: ts ?? new Date().toISOString(),
    ...(confidence != null ? { confidence } : {}),
  };
  lesson.id = lessonId(agent, signatureOf(error), lesson.ts);
  const line = JSON.stringify(lesson);
  const sec = scanLessonLine(line);
  if (!sec.safe) throw new Error(`lesson rejected: ${sec.violations.join(', ')}`);
  const val = validateLesson(lesson);
  if (!val.ok) throw new Error(`lesson invalid: ${val.errors.join('; ')}`);
  fs.appendFileSync(LESSONS_FILE, line + '\n');
  return lesson;
}

export function readMarkdown(file) {
  ensureDirs();
  return fs.readFileSync(file, 'utf8');
}

export function writeMarkdown(file, content) {
  ensureDirs();
  const sec = scanMarkdown(content);
  if (!sec.safe) throw new Error(`content rejected: ${sec.violations.join(', ')}`);
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, content);
  fs.renameSync(tmp, file);
}

export function writeDraft(name, content) {
  ensureDirs();
  // Draft names originate from agent output, i.e. untrusted input: the exact
  // shape is allow-listed BEFORE the name enters any path computation (code
  // scanning js/http-to-file-access, alert #18). Lowercase alphanumerics plus
  // `._-` only, single `.md` extension, no leading dot, no separators — so the
  // name is a plain path token by construction and cannot carry traversal or
  // a URL/protocol suffix past this point.
  if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9._-]*\.md$/.test(name)) {
    throw new Error('invalid draft filename');
  }
  if (typeof content !== 'string') throw new TypeError('draft content must be a string');
  if (Buffer.byteLength(content, 'utf8') > CAPS.maxKnowledgeKiB * 1024) {
    throw new Error('draft exceeds size limit');
  }
  const sec = scanMarkdown(content);
  if (!sec.safe) throw new Error(`content rejected: ${sec.violations.join(', ')}`);
  // Defence in depth for the file-write sink: the destination is re-derived
  // from the validated token, re-checked against DRAFTS_DIR, and then opened
  // with O_NOFOLLOW so a symlink planted inside the drafts directory cannot
  // redirect the write outside it.
  const root = path.resolve(DRAFTS_DIR) + path.sep;
  const resolved = path.resolve(path.join(DRAFTS_DIR, name));
  if (!resolved.startsWith(root)) throw new Error('invalid draft path');
  // O_NOFOLLOW is POSIX-only; on other platforms the allow-list above remains
  // the primary defence (the symlink attack itself needs a name shape that the
  // allow-list already rejects).
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW;
  let fd;
  try {
    fd = fs.openSync(resolved, flags, 0o600);
  } catch (error) {
    if (error?.code === 'ELOOP' || error?.code === 'EMLINK') throw new Error('invalid draft path');
    throw error;
  }
  try {
    fs.writeFileSync(fd, content, { encoding: 'utf8' });
  } finally {
    fs.closeSync(fd);
  }
  return resolved;
}

export function writeState(name, obj) {
  ensureDirs();
  const file = path.join(STATE_DIR, name);
  fs.writeFileSync(file, typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
  return file;
}

export function readState(name, fallback = null) {
  const file = path.join(STATE_DIR, name);
  if (!fs.existsSync(file)) return fallback;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return fallback; }
}

// Test-only: wipe the knowledge base. Not exposed via CLI.
export function resetKnowledge() {
  ensureDirs();
  fs.writeFileSync(LESSONS_FILE, '');
  writeMarkdown(PATTERNS_FILE, '# Patterns\n\n');
  writeMarkdown(PITFALLS_FILE, '# Pitfalls\n\n');
}

export function knowledgeSizeKiB() {
  ensureDirs();
  let total = 0;
  for (const f of fs.readdirSync(KNOWLEDGE_DIR)) {
    const st = fs.statSync(path.join(KNOWLEDGE_DIR, f));
    if (st.isFile()) total += st.size;
  }
  return Math.round(total / 1024);
}
