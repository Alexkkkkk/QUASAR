#!/usr/bin/env node
// QUASAR Autopilot — the conductor. Watches everything, fixes what it can,
// merges what is green. Zero human involvement by design, with hard brakes.
//
//   node scripts/ai/autopilot/cli.mjs scan-dependabot
//   node scripts/ai/autopilot/cli.mjs scan-codescan
//   node scripts/ai/autopilot/cli.mjs scan-reverts
//   node scripts/ai/autopilot/cli.mjs merge-queue
//   node scripts/ai/autopilot/cli.mjs knowledge-merge
//   node scripts/ai/autopilot/cli.mjs status
//
// Modes (repo variable AUTOPILOT):
//   off    — do nothing (jobs exit immediately)
//   guard  — scan + label + open tracking issues, NEVER merge (default)
//   full   — everything, including squash-merges (rate-limited)
//
// Brakes (hard-coded, cannot be disabled below minimums):
//   - stops entirely while an issue labeled `autopilot-stopped` is open
//   - max merges/day and max new PRs/day
//   - never merges PRs touching .github/workflows/** or contracts/**
//   - knowledge PRs self-merge ONLY if every file is under docs/ai/knowledge/

import { spawnSync } from 'node:child_process';
import { appendLesson, readState, writeState } from '../swarm/knowledge.mjs';

const MODE = process.env.AUTOPILOT || 'guard';
const DRY = MODE !== 'full';
const REPO = process.env.GITHUB_REPOSITORY || '';
const MAX_MERGES = Math.max(1, Number(process.env.AUTOPILOT_MAX_MERGES || 5));
const MAX_PRS = Math.max(1, Number(process.env.AUTOPILOT_MAX_PRS || 3));
const STOP_LABEL = 'autopilot-stopped';
const DEP_LABEL = 'autopilot-dep';
const SCAN_LABEL = 'autopilot-scan';
const AUTOMERGE_LABELS = ['automerge', 'dependencies', 'ai-sync'];
const KNOWLEDGE_PREFIX = 'docs/ai/knowledge/';

// ---------- pure helpers (unit-tested) ----------

const SEVERITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

export function groupDependabotAlerts(alerts) {
  const groups = new Map();
  for (const a of alerts) {
    const dep = a.dependency?.package?.name || 'unknown';
    const key = `${a.dependency?.manifest_path || '?'} :: ${dep}`;
    if (!groups.has(key)) {
      groups.set(key, {
        dep, manifest: a.dependency?.manifest_path || '?',
        severity: 'low', ghsa: [], fixed: null, count: 0,
        advisories: new Set(),
      });
    }
    const g = groups.get(key);
    g.count++;
    const sev = a.security_advisory?.severity || 'low';
    if ((SEVERITY_ORDER[sev] || 0) > (SEVERITY_ORDER[g.severity] || 0)) g.severity = sev;
    if (a.security_advisory?.ghsa_id) g.ghsa.push(a.security_advisory.ghsa_id);
    const fixed = a.security_vulnerability?.first_patched_version?.identifier;
    if (fixed) g.fixed = g.fixed === null ? fixed : g.fixed;
    if (a.security_advisory?.summary) g.advisories.add(a.security_advisory.summary);
  }
  return [...groups.values()].sort((a, b) => (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0));
}

export function groupCodeScanAlerts(alerts) {
  const groups = new Map();
  for (const a of alerts) {
    const rule = a.rule?.id || 'unknown-rule';
    if (!groups.has(rule)) {
      groups.set(rule, {
        rule,
        severity: a.rule?.security_severity_level || 'unknown',
        description: a.rule?.description || a.rule?.id || '',
        locations: [],
      });
    }
    const g = groups.get(rule);
    g.locations.push(`${a.most_recent_instance?.ref?.split('/').pop() || '?'}:${a.most_recent_instance?.location?.start_line || '?'} ${a.most_recent_instance?.location?.path || ''}`);
  }
  return [...groups.values()].sort((a, b) => b.locations.length - a.locations.length);
}

const OK_CONCLUSIONS = new Set(['SUCCESS', 'SKIPPED', 'NEUTRAL']);

export function isMergeableCandidate(pr) {
  if (pr.isDraft) return { ok: false, why: 'draft' };
  if (pr.mergeable !== 'MERGEABLE') return { ok: false, why: `mergeable=${pr.mergeable}` };
  if (pr.reviewDecision === 'CHANGES_REQUESTED') return { ok: false, why: 'changes-requested' };
  const bot = pr.author?.login?.startsWith('dependabot') || pr.author?.login === 'github-actions[bot]';
  const labeled = (pr.labels || []).some((l) => AUTOMERGE_LABELS.includes(l.name));
  if (!bot && !labeled) return { ok: false, why: 'not-flagged-for-automerge' };
  const rollup = pr.statusCheckRollup || [];
  const pending = rollup.filter((c) => c.conclusion === null);
  if (pending.length > 0) return { ok: false, why: `checks-pending:${pending.length}` };
  const failed = rollup.filter((c) => c.conclusion != null && !OK_CONCLUSIONS.has(c.conclusion));
  if (failed.length > 0) return { ok: false, why: `checks-failed:${failed.length}` };
  return { ok: true, why: 'green' };
}

const PROTECTED_PREFIXES = ['.github/workflows/', 'contracts/', 'script/', '.github/dependabot.yml'];

export function touchesProtectedPaths(files) {
  return (files || []).some((f) => PROTECTED_PREFIXES.some((p) => f.path.startsWith(p)));
}

// Autonomous knowledge ingestion: a PR may merge itself only if EVERY
// file lives under the knowledge base. One foreign file -> human required.
export function filesWithinKnowledge(files) {
  const list = files || [];
  return list.length > 0 && list.every((f) => f.path.startsWith(KNOWLEDGE_PREFIX));
}

// Parse `git log --grep=^Revert --format=%h %s` output.
export function parseRevertLog(log) {
  return String(log || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([0-9a-f]{7,40})\s+Revert\s+["“](.+?)["”](\s+\(#(\d+)\))?/i);
      if (!m) return null;
      return { sha: m[1], subject: m[2], pr: m[4] || null };
    })
    .filter(Boolean);
}

// ---------- gh wrapper ----------

function gh(args, { json = true } = {}) {
  const r = spawnSync('gh', args, {
    encoding: 'utf8',
    env: { ...process.env, GH_PROMPT: 'disabled' },
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    throw new Error(`gh ${args.join(' ')} → ${(r.stderr || r.stdout || '').slice(0, 400)}`);
  }
  return json ? JSON.parse(r.stdout) : r.stdout;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- brakes ----------

function stoppedByHuman() {
  const q = encodeURIComponent(`repo:${REPO} label:${STOP_LABEL} state:open`);
  const found = gh(['api', `search/issues?q=${q}&per_page=1`]);
  return found.total_count > 0;
}

function mergesToday() {
  const q = encodeURIComponent(`repo:${REPO} is:pr is:merged merged:>=${todayISO()}`);
  return gh(['api', `search/issues?q=${q}&per_page=100`]).items?.length ?? 0;
}

function guard(action) {
  if (MODE === 'off') { console.log(`autopilot: mode=off, skipping ${action}`); return false; }
  if (stoppedByHuman()) { console.log(`autopilot: BRAKE — open issue with label '${STOP_LABEL}'. Human stop.`); return false; }
  return true;
}

function safe(fn) { try { return fn(); } catch (e) { return `err: ${e.message.slice(0, 80)}`; } }

function cmdStatus() {
  console.log(JSON.stringify({
    repo: REPO, mode: MODE, dryRun: DRY,
    maxMergesPerDay: MAX_MERGES, maxOpenPRs: MAX_PRS,
    mergesToday: safe(() => mergesToday()),
    stopped: safe(() => stoppedByHuman()),
  }, null, 2));
}

// ---------- commands ----------

function cmdScanDependabot() {
  if (!guard('scan-dependabot')) return;
  let alerts;
  try {
    alerts = gh(['api', `repos/${REPO}/dependabot/alerts?state=open&per_page=100`]);
  } catch (e) {
    console.log(`autopilot: dependabot API unavailable (${e.message.slice(0, 120)}).`);
    console.log('autopilot: if 403 — add a PAT with `security_events` scope as AUTOPILOT_TOKEN secret.');
    return;
  }
  const groups = groupDependabotAlerts(alerts);
  const existing = gh(['api', `search/issues?q=${encodeURIComponent(`repo:${REPO} label:${DEP_LABEL} state:open`)}&per_page=100`]);
  const existingText = (existing.items || []).map((i) => `${i.title} ${i.body || ''}`).join('\n');
  const depbotPRs = gh(['pr', 'list', '--limit', '100', '--author', 'app/dependabot', '--json', 'number,title,labels']);

  let created = 0, linked = 0;
  for (const g of groups) {
    const marker = g.ghsa[0] || g.dep;
    if (existingText.includes(marker)) continue;
    if (created >= MAX_PRS) { console.log(`autopilot: PR/issue cap (${MAX_PRS}) reached`); break; }

    const body = [
      `**Dependency:** \`${g.dep}\` (${g.manifest})`,
      `**Severity:** ${g.severity} · ${g.count} alert(s)`,
      `**Fixed in:** ${g.fixed || 'unknown — manual research needed'}`,
      `**Advisories:** ${g.ghsa.join(', ') || 'n/a'}`,
      ...[...g.advisories].slice(0, 3).map((s) => `- ${s}`),
      '',
      `GHSA marker: ${marker}`,
      '_Opened by autopilot. Closes when alerts for this dependency disappear._',
    ].join('\n');

    if (!DRY) {
      gh(['issue', 'create', '--title', `[autopilot] ${g.severity}: ${g.dep} — ${g.count} alert(s)`,
        '--body', body, '--label', `bug,${DEP_LABEL}`]);
    }
    created++;
    console.log(`autopilot: ${DRY ? 'would open' : 'opened'} issue for ${g.dep} (${g.severity})`);

    const match = depbotPRs.find((p) => p.title.toLowerCase().includes(g.dep.toLowerCase()));
    if (match && !(match.labels || []).some((l) => l.name === 'automerge')) {
      if (!DRY) gh(['pr', 'edit', String(match.number), '--add-label', 'automerge']);
      linked++;
      console.log(`autopilot: flagged dependabot PR #${match.number} (${g.dep}) for auto-merge`);
    }
  }
  console.log(`autopilot: dependabot scan done — groups=${groups.length} newIssues=${created} prsFlagged=${linked}`);
}

function cmdScanCodescan() {
  if (!guard('scan-codescan')) return;
  let alerts;
  try {
    alerts = gh(['api', `repos/${REPO}/code-scanning/alerts?state=open&per_page=100`]);
  } catch (e) {
    console.log(`autopilot: code-scanning API unavailable (${e.message.slice(0, 120)}).`);
    return;
  }
  const groups = groupCodeScanAlerts(alerts);
  const existing = gh(['api', `search/issues?q=${encodeURIComponent(`repo:${REPO} label:${SCAN_LABEL} state:open`)}&per_page=100`]);
  const existingText = (existing.items || []).map((i) => `${i.title}`).join('\n');

  let created = 0;
  for (const g of groups) {
    if (existingText.includes(g.rule)) continue;
    if (created >= MAX_PRS) break;
    const body = [
      `**Rule:** \`${g.rule}\``,
      `**Severity:** ${g.severity}`,
      `**Description:** ${g.description}`,
      `**Occurrences:** ${g.locations.length}`,
      '',
      'Most recent locations:',
      ...g.locations.slice(0, 10).map((l) => `- ${l}`),
      '',
      '_Opened by autopilot. Fix or dismiss the alert to close._',
    ].join('\n');
    if (!DRY) {
      gh(['issue', 'create', '--title', `[autopilot] code-scanning ${g.severity}: ${g.rule} (${g.locations.length}x)`,
        '--body', body, '--label', `bug,${SCAN_LABEL}`]);
    }
    created++;
    console.log(`autopilot: ${DRY ? 'would open' : 'opened'} issue for rule ${g.rule} (${g.locations.length}x)`);
  }
  console.log(`autopilot: code-scanning scan done — rules=${groups.length} newIssues=${created}`);
}

// ---------- revert scanner ----------

function cmdScanReverts() {
  if (!guard('scan-reverts')) return;
  const prev = readState('revert-scan.json', { since: null, seen: [] });
  const since = prev.since || new Date(Date.now() - 30 * 86400_000).toISOString();
  const r = spawnSync('git', ['log', `--since=${since}`, '--grep=^Revert', '--format=%h %s'], { encoding: 'utf8' });
  if (r.status !== 0) { console.log('autopilot: git log unavailable — skipping'); return; }

  const entries = parseRevertLog(r.stdout).filter((e) => !prev.seen.includes(e.sha));
  if (!entries.length) {
    console.log('autopilot: no new reverts');
    writeState('revert-scan.json', { since: new Date().toISOString(), seen: prev.seen });
    return;
  }
  let recorded = 0;
  for (const e of entries) {
    try {
      appendLesson({
        agent: 'human',
        kind: 'pitfall',
        task: `reverted: ${e.subject}`,
        error: { type: 'RevertedChange', message: `commit ${e.sha} reverted "${e.subject}"` },
        solution: `Never reintroduce "${e.subject}" without understanding why it was reverted (PR ${e.pr || 'n/a'}).`,
        evidence: { tests: true, ...(e.pr ? { pr: `#${e.pr}` } : {}) },
      });
      recorded++;
      console.log(`autopilot: revert lesson recorded (${e.sha})`);
    } catch (err) {
      console.log(`autopilot: revert ${e.sha} rejected: ${err.message}`);
    }
  }
  writeState('revert-scan.json', {
    since: new Date().toISOString(),
    seen: [...prev.seen, ...entries.map((e) => e.sha)].slice(-500),
  });
  console.log(`autopilot: scan-reverts done — new=${entries.length} recorded=${recorded}`);
}

// ---------- merge queues ----------

function cmdMergeQueue() {
  if (MODE !== 'full') { console.log(`autopilot: merge-queue needs mode=full (now ${MODE})`); return; }
  if (!guard('merge-queue')) return;
  const merged = mergesToday();
  if (merged >= MAX_MERGES) { console.log(`autopilot: daily merge cap (${MAX_MERGES}) reached`); return; }

  const prs = gh(['pr', 'list', '--limit', '50', '--json',
    'number,title,labels,isDraft,mergeable,reviewDecision,statusCheckRollup,author']);
  let budget = MAX_MERGES - merged;
  let mergedNow = 0, skipped = 0;

  for (const pr of prs) {
    if (budget <= 0) break;
    const verdict = isMergeableCandidate(pr);
    if (!verdict.ok) { skipped++; continue; }
    const files = gh(['pr', 'view', String(pr.number), '--json', 'files']);
    if (touchesProtectedPaths(files.files)) {
      console.log(`autopilot: #${pr.number} skipped — touches protected paths (needs human)`);
      skipped++;
      continue;
    }
    if (DRY) { console.log(`autopilot: would squash-merge #${pr.number} (${pr.title})`); budget--; mergedNow++; continue; }
    gh(['pr', 'merge', String(pr.number), '--squash', '--auto', '--delete-branch']);
    console.log(`autopilot: merged #${pr.number} (${pr.title})`);
    budget--; mergedNow++;
  }
  console.log(`autopilot: merge-queue done — merged=${mergedNow} skipped=${skipped} mergesToday=${merged + mergedNow}`);
}

function cmdKnowledgeMerge() {
  if (MODE !== 'full') { console.log(`autopilot: knowledge-merge needs mode=full (now ${MODE})`); return; }
  if (!guard('knowledge-merge')) return;
  const merged = mergesToday();
  if (merged >= MAX_MERGES) { console.log(`autopilot: daily merge cap (${MAX_MERGES}) reached`); return; }

  const prs = gh(['pr', 'list', '--limit', '50', '--json',
    'number,title,labels,isDraft,mergeable,reviewDecision,statusCheckRollup,author']);
  let budget = MAX_MERGES - merged;
  let done = 0, skipped = 0;

  for (const pr of prs) {
    if (budget <= 0) break;
    const isKnowledge = (pr.labels || []).some((l) => l.name === 'ai-sync');
    if (!isKnowledge) { skipped++; continue; }
    if (pr.reviewDecision === 'CHANGES_REQUESTED') { skipped++; continue; }
    if (pr.mergeable !== 'MERGEABLE') { skipped++; continue; }
    const files = gh(['pr', 'view', String(pr.number), '--json', 'files']);
    if (!filesWithinKnowledge(files.files)) {
      console.log(`autopilot: #${pr.number} skipped — touches files outside ${KNOWLEDGE_PREFIX} (needs human)`);
      skipped++;
      continue;
    }
    const rollup = pr.statusCheckRollup || [];
    const failed = rollup.filter((c) => c.conclusion != null && !OK_CONCLUSIONS.has(c.conclusion));
    if (failed.length > 0) { skipped++; continue; }
    // draft PRs become ready once their checks are green — autonomy means
    // no human clicks "Ready for review" on knowledge sync PRs either.
    if (pr.isDraft && !DRY) gh(['pr', 'ready', String(pr.number)]);
    if (DRY) { console.log(`autopilot: would merge knowledge PR #${pr.number} (${pr.title})`); budget--; done++; continue; }
    gh(['pr', 'merge', String(pr.number), '--squash', '--auto', '--delete-branch']);
    console.log(`autopilot: merged knowledge PR #${pr.number} (${pr.title})`);
    budget--; done++;
  }
  console.log(`autopilot: knowledge-merge done — merged=${done} skipped=${skipped}`);
}

// ---------- entry ----------

const [, , cmd] = process.argv;
try {
  switch (cmd) {
    case 'scan-dependabot': cmdScanDependabot(); break;
    case 'scan-codescan': cmdScanCodescan(); break;
    case 'scan-reverts': cmdScanReverts(); break;
    case 'merge-queue': cmdMergeQueue(); break;
    case 'knowledge-merge': cmdKnowledgeMerge(); break;
    case 'status': cmdStatus(); break;
    default:
      console.log('usage: cli.mjs [scan-dependabot|scan-codescan|scan-reverts|merge-queue|knowledge-merge|status]');
      process.exitCode = cmd ? 1 : 0;
  }
} catch (e) {
  console.error(`autopilot: FATAL ${e.message}`);
  process.exit(1);
}