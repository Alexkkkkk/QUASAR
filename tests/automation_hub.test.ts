/**
 * Guards the repository automation hub: every workflow stays pinned to a
 * commit SHA with a matching tag comment, declares explicit permissions, and
 * the required config files stay in place.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const WORKFLOWS = join(ROOT, ".github", "workflows");

const REQUIRED = [
  ".github/workflows/ci.yml",
  ".github/workflows/_checks.yml",
  ".github/workflows/quasar.yml",
  ".github/workflows/_ai-fix.yml",
  ".github/workflows/_ai-review.yml",
  ".github/workflows/_close-issues.yml",
  ".github/workflows/_hub-audit.yml",
  ".github/workflows/_stale.yml",
  ".github/workflows/_ai-merge.yml",
  ".github/workflows/_pr-polish.yml",
  ".github/workflows/_dms.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/release.yml",
  ".github/workflows/ai-ollama-agent.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/dependabot-auto-merge.yml",
  ".github/workflows/auto-update-prs.yml",
  ".github/workflows/pin-refresh.yml",
  ".github/workflows/dapp-ci.yml",
  ".github/workflows/autofix.yml",
  ".github/workflows/dependabot-remediation.yml",
  ".github/workflows/issue-triage.yml",
  ".github/workflows/_learn.yml",
  ".github/workflows/_idle-agent.yml",
  ".github/workflows/_scout.yml",
  ".github/dependabot.yml",
  ".github/CODEOWNERS",
  ".github/labeler.yml",
  ".yamllint.yml",
  "setup-repo.sh",
  "scripts/action_pins.json",
  "scripts/sync_action_pins.ts",
  "scripts/hub_audit.ts",
  "scripts/autofix/classify_failure.py",
  "scripts/autofix/apply_fixes.sh",
  "scripts/learn_loop.py",
  "scripts/idle_check.py",
  "scripts/validate_findings.py",
  "scripts/scout_scan.py",
  "scripts/scout_route.py",
  "scripts/explore.schema.json",
  "scripts/scout.schema.json",
  "docs/ai/failure_patterns.md",
  "docs/AUTOFIX.md",
  "AGENTS.md",
  "scripts/router.mjs",
  "tests/router.test.mjs",
];

function stripBlockScalars(text: string): string {
  const out: string[] = [];
  let blockIndent = -1;
  for (const line of text.split("\n")) {
    const indent = line.length - line.trimStart().length;
    if (blockIndent >= 0) {
      if (line.trim() === "" || indent > blockIndent) {
        out.push("");
        continue;
      }
      blockIndent = -1;
    }
    out.push(line);
    if (/:\s*[|>][-+]?\s*$/.test(line)) blockIndent = indent;
  }
  return out.join("\n");
}

function workflowFiles(): string[] {
  return readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f));
}

test("hub: every required automation config file exists", () => {
  for (const rel of REQUIRED) {
    assert.ok(existsSync(join(ROOT, rel)), `missing automation config: ${rel}`);
  }
});

test("hub: every external action is pinned to a 40-char SHA and carries a tag comment", () => {
  const files = workflowFiles();
  assert.ok(files.length >= 8, `expected at least 8 workflows, found ${files.length}`);
  const offenders: string[] = [];
  for (const file of files) {
    const body = stripBlockScalars(readFileSync(join(WORKFLOWS, file), "utf8"));
    for (const match of body.matchAll(/^\s*(?:-\s+)?uses:\s*([^\s#]+)\s*(?:#\s*(.*))?$/gm)) {
      const ref = match[1];
      const comment = String(match[2] ?? "").trim();
      if (ref.startsWith("./") || ref.startsWith("docker://")) continue;
      const at = ref.lastIndexOf("@");
      const sha = at >= 0 ? ref.slice(at + 1) : "";
      if (!/^[0-9a-f]{40}$/.test(sha)) offenders.push(`${file}: ${ref} is not a 40-char SHA`);
      else if (!comment) offenders.push(`${file}: ${ref} has no "# <tag>" comment`);
    }
  }
  assert.deepEqual(offenders, [], `unpinned actions:\n${offenders.join("\n")}`);
});

test("hub: every workflow declares explicit top-level permissions", () => {
  for (const file of workflowFiles()) {
    const body = readFileSync(join(WORKFLOWS, file), "utf8");
    assert.match(body, /^permissions:/m, `${file}: no top-level permissions block`);
  }
});

test("hub: pull_request_target is confined to the guarded Dependabot job", () => {
  for (const file of workflowFiles()) {
    const body = readFileSync(join(WORKFLOWS, file), "utf8");
    if (!body.includes("pull_request_target")) continue;
    assert.equal(file, "dependabot-auto-merge.yml", `${file}: pull_request_target is not allowed here`);
    assert.match(body, /github\.actor == 'dependabot\[bot\]'/, "missing the Dependabot actor guard");
    assert.ok(!/actions\/checkout@/.test(body), "the pull_request_target job must not check out code");
  }
});

test("hub: the Ollama agent runs a local model and opens draft PRs only", () => {
  const body = readFileSync(join(WORKFLOWS, "ai-ollama-agent.yml"), "utf8");
  assert.match(body, /ollama serve/, "expected a local Ollama server");
  assert.match(body, /draft: always-true/, "expected draft-only pull requests");
  assert.ok(!/scripts\/deploy/.test(body), "the agent must not invoke deploy scripts");
  assert.ok(!/secrets\.(?!GITHUB_TOKEN)/.test(body), "the agent must only use the ephemeral GITHUB_TOKEN");
});

test("hub: dependabot covers npm, the dApp, GitHub Actions and pip", () => {
  const body = readFileSync(join(ROOT, ".github", "dependabot.yml"), "utf8");
  assert.match(body, /package-ecosystem: npm/);
  assert.match(body, /package-ecosystem: github-actions/);
  assert.match(body, /package-ecosystem: pip/);
  assert.match(body, /directory: "\/integrations\/minter-tasks"/);
});

test("hub: the required `validate` check still exists in ci.yml", () => {
  const body = readFileSync(join(WORKFLOWS, "ci.yml"), "utf8");
  assert.match(body, /^ {2}validate:\s*$/m, "ci.yml must keep a job named validate");
});

test("hub: CI and AI-agent share checks, with generated patches applied before validation", () => {
  const checks = readFileSync(join(WORKFLOWS, "_checks.yml"), "utf8");
  const ci = readFileSync(join(WORKFLOWS, "ci.yml"), "utf8");
  const aiFix = readFileSync(join(WORKFLOWS, "_ai-fix.yml"), "utf8");

  assert.match(checks, /workflow_call:/, "the shared checks must be callable");
  assert.match(ci, /validate:\s*\n\s+uses:\s+\.\/\.github\/workflows\/_checks\.yml/);
  assert.match(aiFix, /validate:\s*\n\s+needs:\s+generate\s*\n\s+uses:\s+\.\/\.github\/workflows\/_checks\.yml/);
  assert.match(aiFix, /patch_artifact:\s+ai-fix-patch/);

  const applyIndex = checks.indexOf("Apply generated patch");
  const setupNodeIndex = checks.indexOf("Set up Node.js");
  assert.ok(applyIndex >= 0, "the shared checks must apply the optional patch");
  assert.ok(setupNodeIndex >= 0, "the shared checks must run the existing validations");
  assert.ok(applyIndex < setupNodeIndex, "the generated patch must be applied before validation");
});

test("hub: release dispatch input is passed safely and validated before use", () => {
  const body = readFileSync(join(WORKFLOWS, "release.yml"), "utf8");
  assert.doesNotMatch(body, /tag="\$\{\{[^}]*inputs\.tag/);
  assert.match(body, /RELEASE_TAG:\s+\$\{\{.*inputs\.tag/);
  assert.match(body, /tag="\$RELEASE_TAG"/);
  assert.match(body, /tag" =~ \^v\[0-9A-Za-z\]/);
});

test("hub: repository setup uses an action allowlist and verifies SHA pinning", () => {
  const body = readFileSync(join(ROOT, "setup-repo.sh"), "utf8");
  assert.match(body, /allowed_actions=selected/);
  assert.match(body, /patterns_allowed\[\]=github\/codeql-action@\*/);
  assert.match(body, /sha_pinning_required/);
  assert.doesNotMatch(body, /allowed_actions=all/);
});

test("hub: the pin lock matches the declared tag map", () => {
  const pins = JSON.parse(readFileSync(join(ROOT, "scripts", "action_pins.json"), "utf8")) as {
    actions: Record<string, string>;
  };
  const lockPath = join(ROOT, "scripts", "action_pins.lock.json");
  if (!existsSync(lockPath)) return;
  const lock = JSON.parse(readFileSync(lockPath, "utf8")) as {
    actions: Record<string, { tag: string; sha: string }>;
  };
  for (const [repo, tag] of Object.entries(pins.actions)) {
    assert.ok(lock.actions[repo], `lock is missing ${repo}`);
    assert.equal(lock.actions[repo].tag, tag, `lock tag drift for ${repo}`);
    assert.match(lock.actions[repo].sha, /^[0-9a-f]{40}$/, `lock sha for ${repo} is not a commit SHA`);
  }
});

test("hub: the pull-request updater rebases onto main and merges without approvals", () => {
  const body = readFileSync(join(WORKFLOWS, "auto-update-prs.yml"), "utf8");
  assert.match(body, /^permissions:/m, "the updater must declare top-level permissions");
  assert.match(body, /gh pr update-branch/, "expected an automatic rebase onto main");
  assert.match(body, /--rebase/, "the rebase must preserve linear history");
  assert.match(body, /gh pr merge/, "expected an automatic merge of green pull requests");
  assert.match(body, /do-not-merge/, "the do-not-merge label must be respected");
  assert.ok(!/actions\/checkout@/.test(body), "the updater must not check out pull-request code");
});

test("hub: the orchestrator routes events into the reusable modules only", () => {
  const wf = readFileSync(join(WORKFLOWS, "quasar.yml"), "utf8");
  assert.match(wf, /^ {2}route:\s*$/m, "the orchestrator must expose a route job");
  assert.match(wf, /node scripts\/router\.mjs/, "the route job runs the pure router");
  for (const mod of ["_ai-fix.yml", "_ai-review.yml", "_close-issues.yml", "_ai-merge.yml", "_pr-polish.yml", "_hub-audit.yml", "_stale.yml", "_dms.yml"]) {
    assert.ok(wf.includes(`./.github/workflows/${mod}`), `quasar.yml must route into ${mod}`);
  }
  assert.ok(!wf.includes("secrets: inherit"), "the orchestrator must pass secrets explicitly");
});

test("hub: reusable modules are workflow_call only, with write on the terminal job", () => {
  const modules = readdirSync(WORKFLOWS).filter((f) => f.startsWith("_") && /\.ya?ml$/.test(f));
  assert.ok(modules.length >= 8, `expected the module set, found ${modules.length}`);
  for (const file of modules) {
    const body = stripBlockScalars(readFileSync(join(WORKFLOWS, file), "utf8"));
    const onBlock = /^on:\s*\n((?:[ \t].*\n|\n)*)/m.exec(body);
    assert.ok(onBlock, `${file}: missing an on: block`);
    const first = onBlock![1].split("\n").find((l) => l.trim() !== "");
    assert.equal((first ?? "").trim(), "workflow_call:", `${file}: a module must open on: with workflow_call`);
  }
});

test("hub: no workflow grants write at the workflow level", () => {
  for (const file of workflowFiles()) {
    const body = readFileSync(join(WORKFLOWS, file), "utf8");
    const top = /^permissions:[^\n]*\n([\s\S]*?)(?=^\S)/m.exec(body);
    if (!top) continue;
    assert.ok(!/:\s*write\b/.test(top[1]), `${file}: write must live on the job, not the workflow`);
  }
});

test("hub: the migrated event workflows are gone (no orphan triggers)", () => {
  for (const legacy of ["ai-fix-agent.yml", "ai-review.yml", "autopilot-issues.yml", "hub-audit.yml", "stale.yml"]) {
    assert.ok(!existsSync(join(WORKFLOWS, legacy)), `${legacy} must be removed after the hub migration`);
  }
});

test("hub: ai-review idempotency scans the review feed, not only issue comments (issue #156)", () => {
  const body = readFileSync(join(WORKFLOWS, "_ai-review.yml"), "utf8");
  assert.match(body, /pulls\/\$\{PR\}\/reviews/, "the guard must scan the pull-request reviews feed");
  assert.match(body, /issues\/\$\{PR\}\/comments/, "the guard must still scan issue comments");
});

test("hub: ai-merge readies drafts and queues auto-merge without bypassing protection (issue #155)", () => {
  const body = readFileSync(join(WORKFLOWS, "_ai-merge.yml"), "utf8");
  assert.match(body, /gh pr ready "\$TARGET" --repo "\$GITHUB_REPOSITORY"/, "a draft agent PR must be marked ready before merge");
  const draftBlock = /if \[\[ "\$\(jq -r '\.isDraft' <<< "\$pr"\)" == "true" \]\]; then([\s\S]*?)\n\s+fi/.exec(body);
  assert.ok(draftBlock, "the draft handling block must be present");
  assert.match(draftBlock[1], /remove and re-add the ai-merge-ok label/, "the owner must be told how to rerun after human approval");
  assert.match(draftBlock[1], /exit 0/, "the workflow must stop after readying a draft instead of using stale review data");
  assert.match(body, /gh pr merge "\$TARGET" --repo "\$GITHUB_REPOSITORY" --squash --auto --delete-branch/, "the merge must queue with --auto");
  assert.match(body, /Auto-merge enabled for agent pull request/, "the notice must not claim that an asynchronous auto-merge has completed");
  assert.doesNotMatch(body, /::notice::Merged agent pull request/, "the merge notice must not report success before GitHub completes the merge");
  assert.match(body, /reviewDecision/, "a human approving review must still be required");
});
