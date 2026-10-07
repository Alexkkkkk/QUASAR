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
  ".github/workflows/labeler.yml",
  ".github/workflows/stale.yml",
  ".github/workflows/release.yml",
  ".github/workflows/ai-fix-agent.yml",
  ".github/workflows/ai-ollama-agent.yml",
  ".github/workflows/hub-audit.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/dependabot-auto-merge.yml",
  ".github/workflows/auto-update-prs.yml",
  ".github/workflows/pin-refresh.yml",
  ".github/workflows/dapp-ci.yml",
  ".github/workflows/autofix.yml",
  ".github/workflows/dependabot-remediation.yml",
  ".github/workflows/issue-triage.yml",
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
  "docs/AUTOFIX.md",
  "AGENTS.md",
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
