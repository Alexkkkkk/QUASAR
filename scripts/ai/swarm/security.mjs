// Guardrails: the knowledge base is written by AI agents, so treat it
// as untrusted input. Quarantine secrets, prompt-injection and
// oversized content BEFORE anything else reads it.
import { CAPS } from './config.mjs';

const SECRET_PATTERNS = [
  { name: 'github_pat', re: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'ghp_token', re: /ghp_[A-Za-z0-9]{30,}/ },
  { name: 'gho_token', re: /gho_[A-Za-z0-9]{30,}/ },
  { name: 'gitlab_pat', re: /glpat-[A-Za-z0-9_-]{20,}/ },
  { name: 'openai_key', re: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: 'aws_key', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'slack_token', re: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'telegram_bot', re: /\b\d{8,10}:[A-Za-z0-9_-]{30,}\b/ },
  { name: 'ton_mnemonic', re: /(?:\b[a-z]{3,8}\b[ ,]+){23}\b[a-z]{3,8}\b/ },
];

const INJECTION_RE =
  /ignore (all|previous|the above|prior) instructions|disregard (all|previous)|system prompt|jailbreak|\/system\b/i;

export function scanText(text) {
  const hits = [];
  for (const { name, re } of SECRET_PATTERNS) {
    if (re.test(text)) hits.push(name);
  }
  return {
    secrets: hits,
    injection: INJECTION_RE.test(text),
    oversized: Buffer.byteLength(text, 'utf8') > CAPS.maxLessonBytes,
  };
}

export function scanLessonLine(line) {
  const v = [];
  if (line.length > CAPS.maxLessonBytes) v.push('oversized');
  const r = scanText(line);
  for (const s of r.secrets) v.push(`secret:${s}`);
  if (r.injection) v.push('injection-suspect');
  return { safe: v.length === 0, violations: v };
}

export function scanMarkdown(text) {
  const r = scanText(text);
  const violations = [
    ...r.secrets.map((s) => `secret:${s}`),
    ...(r.injection ? ['injection-suspect'] : []),
  ];
  return { safe: violations.length === 0, violations };
}
