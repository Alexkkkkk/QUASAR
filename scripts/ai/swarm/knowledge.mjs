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
  const lines = raw.split('\n').filter((l) => l.trim().length > 0);
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
  if (typeof name !== 'string' || path.basename(name) !== name || !/^[a-z0-9][a-z0-9._-]*\.md$/i.test(name)) {
    throw new Error('invalid draft filename');
  }
  if (typeof content !== 'string') throw new TypeError('draft content must be a string');
  if (Buffer.byteLength(content, 'utf8') > CAPS.maxKnowledgeKiB * 1024) {
    throw new Error('draft exceeds size limit');
  }
  const sec = scanMarkdown(content);
  if (!sec.safe) throw new Error(`content rejected: ${sec.violations.join(', ')}`);
  const file = path.join(DRAFTS_DIR, name);
  fs.writeFileSync(file, content);
  return file;
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
