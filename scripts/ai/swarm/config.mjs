// SwarmSync — shared configuration for the QUASAR AI agent swarm.
// Pure Node >= 20, zero dependencies. Safe to import from CI and tests.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const ROOT = process.env.GITHUB_WORKSPACE
  ?? path.resolve(HERE, '../../../');

export const KNOWLEDGE_DIR = path.join(ROOT, 'docs', 'ai', 'knowledge');
export const LESSONS_FILE = path.join(KNOWLEDGE_DIR, 'lessons.jsonl');
export const PATTERNS_FILE = path.join(KNOWLEDGE_DIR, 'patterns.md');
export const PITFALLS_FILE = path.join(KNOWLEDGE_DIR, 'pitfalls.md');
export const DRAFTS_DIR = path.join(KNOWLEDGE_DIR, 'drafts');
export const STATE_DIR = path.join(KNOWLEDGE_DIR, 'state');
export const TON_DOCS_DIR = path.join(ROOT, 'docs', 'ton');

export const CAPS = Object.freeze({
  maxLessonBytes: 4096,
  maxLessons: 5000,
  maxKnowledgeKiB: 512,
  maxIndexDocs: 8000,
});

export const PROMOTION = Object.freeze({
  minOccurrences: 2,
  minPassRate: 1.0,
  maxSolutions: 1,
});

export const DECAY_DAYS = 90;

export const AGENTS = Object.freeze([
  'ai-fix', 'ai-review', 'pr-polish', 'hub-audit',
  'close-issues', 'ai-merge', 'dms', 'swarm', 'human',
]);

export const KINDS = Object.freeze(['fix', 'review', 'pattern', 'pitfall', 'sync']);
