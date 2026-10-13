#!/usr/bin/env node
// QUASAR Autopilot — tracks security findings and queues eligible changes.
// Human PRs require an approving review; protections and hard limits stay enabled.
//
//   node scripts/ai/autopilot/cli.mjs all
//   node scripts/ai/autopilot/cli.mjs scan-dependabot
//   node scripts/ai/autopilot/cli.mjs scan-codescan
//   node scripts/ai/autopilot/cli.mjs merge-queue
//   node scripts/ai/autopilot/cli.mjs status
//
// Modes (repo variable AUTOPILOT):
//   off    — do nothing (jobs exit immediately)
//   guard  — scan + label + open tracking issues, NEVER merge (default)
//   full   — scans plus a guarded, rate-limited merge queue
//
// Brakes (hard-coded, cannot be disabled below minimums):
//   - stops entirely while an issue labeled `autopilot-stopped` is open
//   - max 5 merges/day and max 3 new tracking issues per scan
//   - never merges PRs touching .github/workflows/**, contracts/**, or scripts/**

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_MODES = new Set(['off', 'guard', 'full']);

export function resolveMode(value) {
  if (value == null || value === '') return 'guard';
  return VALID_MODES.has(value) ? value : 'off';
}

export function boundedLimit(value, fallback, max) {
  const raw = value == null || String(value).trim() === '' ? fallback : Number(value);
  if (!Number.isSafeInteger(raw)) return fallback;
  return Math.min(max, Math.max(1, raw));
}

export function remainingMergeBudget(max, merged, queued) {
  return Math.max(0, max - merged - queued);
}

const MODE = resolveMode(process.env.AUTOPILOT);
const REPO = process.env.GITHUB_REPOSITORY || '';
const MAX_MERGES = boundedLimit(process.env.AUTOPILOT_MAX_MERGES, 5, 5);
const MAX_ISSUES = boundedLimit(process.env.AUTOPILOT_MAX_ISSUES, 3, 3);
const STOP_LABEL = 'autopilot-stopped';
const DEP_LABEL = 'autopilot-dep';
const SCAN_LABEL = 'autopilot-scan';
const AUTOMERGE_LABELS = ['automerge', 'dependencies'];

// ---------- pure helpers (unit-tested) ----------

const SEVERITY_ORDER = { critical: 4, high: 3, moderate: 2, medium: 2, low: 1 };

export function groupDependabotAlerts(alerts) {
  const groups = new Map();
  for (const a of alerts || []) {
    const dep = a.dependency?.package?.name || 'unknown';
    const manifest = a.dependency?.manifest_path || '?';
    const key = manifest + ' :: ' + dep;
    if (!groups.has(key)) {
      groups.set(key, { dep, manifest, severity: 'low', ghsa: [], fixed: [], count: 0, advisories: new Set() });
    }
    const g = groups.get(key);
    g.count++;
    const severity = a.security_advisory?.severity || 'low';
    if ((SEVERITY_ORDER[severity] || 0) > (SEVERITY_ORDER[g.severity] || 0)) g.severity = severity;
    const ghsa = a.security_advisory?.ghsa_id;
    if (ghsa && !g.ghsa.includes(ghsa)) g.ghsa.push(ghsa);
    const fixed = a.security_vulnerability?.first_patched_version?.identifier;
    if (fixed && !g.fixed.includes(fixed)) g.fixed.push(fixed);
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
  if (pr.mergeable !== 'MERGEABLE') return { ok: false, why: 'mergeable=' + pr.mergeable };
  const labels = pr.labels || [];
  if (labels.some((label) => label.name === 'do-not-merge')) return { ok: false, why: 'do-not-merge' };
  const bot = pr.author?.login?.startsWith('dependabot') || pr.author?.login === 'github-actions[bot]';
  if (!bot && pr.reviewDecision !== 'APPROVED') return { ok: false, why: 'human-approval-required' };
  if (!labels.some((label) => AUTOMERGE_LABELS.includes(label.name)) && !bot) return { ok: false, why: 'not-flagged-for-automerge' };
  const rollup = Array.isArray(pr.statusCheckRollup) ? pr.statusCheckRollup : [];
  if (rollup.length === 0) return { ok: false, why: 'no-status-checks' };
  const result = (check) => check?.conclusion ?? check?.state ?? null;
  const pending = rollup.filter((check) => !result(check) || ['PENDING', 'EXPECTED', 'QUEUED', 'IN_PROGRESS', 'REQUESTED'].includes(result(check)));
  if (pending.length > 0) return { ok: false, why: 'checks-pending:' + pending.length };
  const failed = rollup.filter((check) => !OK_CONCLUSIONS.has(result(check)));
  if (failed.length > 0) return { ok: false, why: 'checks-failed:' + failed.length };
  if (!rollup.some((check) => result(check) === 'SUCCESS')) return { ok: false, why: 'no-successful-checks' };
  return { ok: true, why: 'green' };
}
const PROTECTED_PREFIXES = ['.github/workflows/', 'contracts/', 'scripts/', '.github/dependabot.yml'];

export function touchesProtectedPaths(files) {
  return (files || []).some((f) => PROTECTED_PREFIXES.some((p) => f.path.startsWith(p)));
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

function queuedMerges() {
  return gh(['pr', 'list', '--limit', '100', '--json', 'autoMergeRequest']).filter((pr) => Boolean(pr.autoMergeRequest)).length;
}

function guard(action) {
  if (MODE === 'off') { console.log(`autopilot: mode=off, skipping ${action}`); return false; }
  if (!REPO) { console.log('autopilot: GITHUB_REPOSITORY is required; failing closed'); return false; }
  if (stoppedByHuman()) { console.log(`autopilot: BRAKE — open issue with label '${STOP_LABEL}'. Human stop.`); return false; }
  return true;
}

function safe(fn) { try { return fn(); } catch (e) { return `err: ${e.message.slice(0, 80)}`; } }

function cmdStatus() {
  console.log(JSON.stringify({
    repo: REPO, mode: MODE, mergeEnabled: MODE === 'full',
    maxMergesPerDay: MAX_MERGES, maxIssuesPerScan: MAX_ISSUES,
    mergesToday: safe(() => mergesToday()),
    queuedAutoMerges: safe(() => queuedMerges()),
    stopped: safe(() => stoppedByHuman()),
  }, null, 2));
}

function issueMarker(issue, kind) {
  const text = String(issue.body || '');
  const prefix = kind === 'dependabot' ? 'GHSA marker: ' : '**Rule:** `';
  const index = text.indexOf(prefix);
  if (index < 0) return null;
  const rest = text.slice(index + prefix.length);
  const marker = rest.split(kind === 'dependabot' ? '\n' : '`')[0].trim();
  return marker || null;
}

function closeResolvedIssues(items, currentMarkers, kind) {
  let closed = 0;
  for (const issue of items || []) {
    const marker = issueMarker(issue, kind);
    if (!marker || currentMarkers.has(marker)) continue;
    gh(['issue', 'close', String(issue.number), '--comment', 'Autopilot closed this tracking issue because the finding was absent from the latest successful scan.'], { json: false });
    closed++;
  }
  return closed;
}
// ---------- commands ----------

function cmdScanDependabot() {
  if (!guard('scan-dependabot')) return;
  let alerts;
  try {
    alerts = gh(['api', 'repos/' + REPO + '/dependabot/alerts?state=open&per_page=100']);
  } catch (e) {
    console.log('autopilot: dependabot API unavailable (' + e.message.slice(0, 120) + ').');
    return;
  }
  const groups = groupDependabotAlerts(alerts);
  const currentMarkers = new Set(groups.map((g) => g.ghsa[0] || g.dep));
  const existing = gh(['api', 'search/issues?q=' + encodeURIComponent('repo:' + REPO + ' label:' + DEP_LABEL + ' state:open') + '&per_page=100']);
  const existingItems = existing.items || [];
  closeResolvedIssues(existingItems, currentMarkers, 'dependabot');
  const existingMarkers = new Set(existingItems.map((issue) => issueMarker(issue, 'dependabot')).filter(Boolean));
  let created = 0;
  for (const g of groups) {
    const marker = g.ghsa[0] || g.dep;
    if (existingMarkers.has(marker)) continue;
    if (created >= MAX_ISSUES) { console.log('autopilot: per-scan issue cap (' + MAX_ISSUES + ') reached'); break; }
    const body = [
      '**Dependency:** `' + g.dep + '` (' + g.manifest + ')',
      '**Severity:** ' + g.severity + ' · ' + g.count + ' alert(s)',
      '**Fixed in:** ' + (g.fixed.length ? g.fixed.join(', ') : 'unknown — manual research needed'),
      '**Advisories:** ' + (g.ghsa.join(', ') || 'n/a'),
      ...[...g.advisories].slice(0, 3).map((summary) => '- ' + summary),
      '',
      'GHSA marker: ' + marker,
      '_Opened by autopilot. Closes when alerts for this dependency disappear._',
    ].join('\n');
    gh(['issue', 'create', '--title', '[autopilot] ' + g.severity + ': ' + g.dep + ' — ' + g.count + ' alert(s)', '--body', body, '--label', 'bug,' + DEP_LABEL], { json: false });
    created++;
    console.log('autopilot: opened issue for ' + g.dep + ' (' + g.severity + ')');
  }
  console.log('autopilot: dependabot scan done — groups=' + groups.length + ' newIssues=' + created);
}
function cmdScanCodescan() {
  if (!guard('scan-codescan')) return;
  let alerts;
  try {
    alerts = gh(['api', 'repos/' + REPO + '/code-scanning/alerts?state=open&per_page=100']);
  } catch (e) {
    console.log('autopilot: code-scanning API unavailable (' + e.message.slice(0, 120) + ').');
    return;
  }
  const groups = groupCodeScanAlerts(alerts);
  const currentMarkers = new Set(groups.map((g) => g.rule));
  const existing = gh(['api', 'search/issues?q=' + encodeURIComponent('repo:' + REPO + ' label:' + SCAN_LABEL + ' state:open') + '&per_page=100']);
  const existingItems = existing.items || [];
  closeResolvedIssues(existingItems, currentMarkers, 'codescan');
  const existingMarkers = new Set(existingItems.map((issue) => issueMarker(issue, 'codescan')).filter(Boolean));
  let created = 0;
  for (const g of groups) {
    if (existingMarkers.has(g.rule)) continue;
    if (created >= MAX_ISSUES) { console.log('autopilot: per-scan issue cap (' + MAX_ISSUES + ') reached'); break; }
    const body = [
      '**Rule:** `' + g.rule + '`',
      '**Severity:** ' + g.severity,
      '**Description:** ' + g.description,
      '**Occurrences:** ' + g.locations.length,
      '',
      'Most recent locations:',
      ...g.locations.slice(0, 10).map((location) => '- ' + location),
      '',
      '_Opened by autopilot. Fix or dismiss the alert to close._',
    ].join('\n');
    gh(['issue', 'create', '--title', '[autopilot] code-scanning ' + g.severity + ': ' + g.rule + ' (' + g.locations.length + 'x)', '--body', body, '--label', 'bug,' + SCAN_LABEL], { json: false });
    created++;
    console.log('autopilot: opened issue for rule ' + g.rule + ' (' + g.locations.length + 'x)');
  }
  console.log('autopilot: code-scanning scan done — rules=' + groups.length + ' newIssues=' + created);
}
function cmdMergeQueue() {
  if (MODE !== 'full') { console.log('autopilot: merge-queue needs mode=full (now ' + MODE + ')'); return; }
  if (!guard('merge-queue')) return;
  const merged = mergesToday();
  if (merged >= MAX_MERGES) { console.log('autopilot: daily merge cap (' + MAX_MERGES + ') reached'); return; }
  const prs = gh(['pr', 'list', '--limit', '100', '--json', 'number,title,labels,isDraft,mergeable,reviewDecision,statusCheckRollup,author,autoMergeRequest']);
  const queuedAlready = prs.filter((pr) => Boolean(pr.autoMergeRequest)).length;
  let budget = remainingMergeBudget(MAX_MERGES, merged, queuedAlready);
  if (budget <= 0) { console.log('autopilot: daily merge cap includes ' + merged + ' completed and ' + queuedAlready + ' already queued'); return; }
  let mergedNow = 0, skipped = 0;
  for (const pr of prs) {
    if (budget <= 0) break;
    if (pr.autoMergeRequest) { skipped++; continue; }
    const verdict = isMergeableCandidate(pr);
    if (!verdict.ok) { skipped++; console.log('autopilot: #' + pr.number + ' skipped — ' + verdict.why); continue; }
    const files = gh(['pr', 'view', String(pr.number), '--json', 'files']);
    if (touchesProtectedPaths(files.files)) {
      console.log('autopilot: #' + pr.number + ' skipped — touches protected paths (needs human)');
      skipped++;
      continue;
    }
    gh(['pr', 'merge', String(pr.number), '--squash', '--auto', '--delete-branch'], { json: false });
    console.log('autopilot: enabled auto-merge for #' + pr.number + ' (' + pr.title + ')');
    budget--;
    mergedNow++;
  }
  console.log('autopilot: merge-queue done — newlyQueued=' + mergedNow + ' completedToday=' + merged + ' alreadyQueued=' + queuedAlready + ' skipped=' + skipped);
}


export function main(command = process.argv[2]) {
  try {
    switch (command) {
      case 'all': cmdScanDependabot(); cmdScanCodescan(); cmdMergeQueue(); break;
      case 'scan-dependabot': cmdScanDependabot(); break;
      case 'scan-codescan': cmdScanCodescan(); break;
      case 'merge-queue': cmdMergeQueue(); break;
      case 'status': cmdStatus(); break;
      default:
        console.log('usage: cli.mjs [all|scan-dependabot|scan-codescan|merge-queue|status]');
        if (command) process.exitCode = 1;
    }
  } catch (e) {
    console.error('autopilot: FATAL ' + e.message);
    process.exitCode = 1;
  }
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) main();
