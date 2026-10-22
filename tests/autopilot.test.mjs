import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { boundedLimit, remainingMergeBudget, resolveMode, groupDependabotAlerts, groupCodeScanAlerts, isMergeableCandidate, touchesProtectedPaths } from "../scripts/ai/autopilot/cli.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

test("mode and numeric limits fail closed and stay bounded", () => {
  assert.equal(resolveMode(undefined), "guard");
  assert.equal(resolveMode("full"), "full");
  assert.equal(resolveMode("typo"), "off");
  assert.equal(boundedLimit("99", 3, 5), 5);
  assert.equal(boundedLimit("0", 3, 5), 1);
  assert.equal(boundedLimit("not-a-number", 3, 5), 3);
  assert.equal(remainingMergeBudget(5, 2, 2), 1);
  assert.equal(remainingMergeBudget(5, 2, 4), 0);
});

test("Dependabot alerts group by package and manifest while keeping every fixed version", () => {
  const groups = groupDependabotAlerts([
    { dependency: { package: { name: "pkg-a" }, manifest_path: "package-lock.json" }, security_advisory: { ghsa_id: "GHSA-1", severity: "moderate", summary: "first" }, security_vulnerability: { first_patched_version: { identifier: "2.0.0" } } },
    { dependency: { package: { name: "pkg-a" }, manifest_path: "package-lock.json" }, security_advisory: { ghsa_id: "GHSA-2", severity: "high", summary: "second" }, security_vulnerability: { first_patched_version: { identifier: "3.0.0" } } },
    { dependency: { package: { name: "pkg-a" }, manifest_path: "other-lock.json" }, security_advisory: { ghsa_id: "GHSA-3", severity: "low" } },
  ]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].severity, "high");
  assert.deepEqual(groups[0].fixed, ["2.0.0", "3.0.0"]);
  assert.deepEqual(groups[0].ghsa, ["GHSA-1", "GHSA-2"]);
  assert.equal(groups[0].count, 2);
  assert.equal(groups[1].severity, "low");
});

test("code-scanning alerts group by rule", () => {
  const groups = groupCodeScanAlerts([
    { rule: { id: "js/xss", security_severity_level: "high", description: "XSS" }, most_recent_instance: { ref: "refs/heads/main", location: { path: "src/a.js", start_line: 10 } } },
    { rule: { id: "js/xss", security_severity_level: "high", description: "XSS" }, most_recent_instance: { ref: "refs/heads/main", location: { path: "src/b.js", start_line: 20 } } },
  ]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].locations.length, 2);
});

test("merge queue requires settled green checks and protects manual holds", () => {
  const base = { isDraft: false, mergeable: "MERGEABLE", labels: [{ name: "automerge" }], reviewDecision: "APPROVED", statusCheckRollup: [{ conclusion: "SUCCESS" }], author: { login: "contributor" }, files: [] };
  assert.equal(isMergeableCandidate(base).ok, true);
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [] }).why, "no-status-checks");
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [{ state: "PENDING" }] }).why, "checks-pending:1");
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [{ conclusion: "FAILURE" }] }).why, "checks-failed:1");
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [{ conclusion: "SKIPPED" }] }).why, "no-successful-checks");
  assert.equal(isMergeableCandidate({ ...base, labels: [{ name: "automerge" }, { name: "do-not-merge" }] }).why, "do-not-merge");
  // A missing human approval and automerge label do not block the queue, but
  // protected paths remain a hard brake regardless of CI status.
  assert.equal(isMergeableCandidate({ ...base, reviewDecision: "REVIEW_REQUIRED" }).ok, true);
  assert.equal(isMergeableCandidate({ ...base, labels: [] }).ok, true);
});

test("fully autonomous queue: unlabeled unreviewed PRs merge on green checks", () => {
  const pr = { isDraft: false, mergeable: "MERGEABLE", labels: [], reviewDecision: "REVIEW_REQUIRED", author: { login: "contributor" }, statusCheckRollup: [{ conclusion: "SUCCESS" }], files: [] };
  assert.equal(isMergeableCandidate(pr).ok, true);
  assert.equal(isMergeableCandidate({ ...pr, isDraft: true }).why, "draft");
});

test("protected path detection includes scripts and workflow files", () => {
  assert.equal(touchesProtectedPaths([{ path: "scripts/ai/autopilot/cli.mjs" }]), true);
  assert.equal(touchesProtectedPaths([{ path: ".github/workflows/ci.yml" }]), true);
  assert.equal(touchesProtectedPaths([{ path: "src/app.js" }]), false);
  assert.equal(touchesProtectedPaths([{ path: "package-lock.json" }]), true);
  assert.equal(touchesProtectedPaths([{ path: "integrations/minter-tasks/.env" }]), true);
  assert.equal(touchesProtectedPaths([{ path: "docs/build-hashes.json" }]), true);
  assert.equal(touchesProtectedPaths([{ path: "website/tonconnect.js" }]), false);
});

test("merge queue fails closed when file paths are unavailable or protected", () => {
  const base = { isDraft: false, mergeable: "MERGEABLE", labels: [], statusCheckRollup: [{ conclusion: "SUCCESS" }], files: [] };
  assert.equal(isMergeableCandidate({ ...base, files: undefined }).why, "missing-files");
  assert.equal(isMergeableCandidate({ ...base, files: [{ path: "contracts/quasar.tact" }] }).why, "protected-paths");
  assert.equal(isMergeableCandidate(base).ok, true);
});

test("revert-scan checkpoint is trackable while generated state stays ignored", () => {
  const checkpoint = spawnSync("git", ["check-ignore", "--no-index", "docs/ai/knowledge/state/revert-scan.json"], { cwd: repoRoot, encoding: "utf8" });
  const generated = spawnSync("git", ["check-ignore", "--no-index", "docs/ai/knowledge/state/sync-report.md"], { cwd: repoRoot, encoding: "utf8" });
  assert.equal(checkpoint.status, 1, "workflow checkpoint must not be ignored by Git");
  assert.equal(generated.status, 0, "regenerated report must remain ignored by Git");
});

test("workflow_dispatch command routes only the selected autopilot job", () => {
  const workflow = readFileSync(join(repoRoot, ".github/workflows/autopilot.yml"), "utf8");
  assert.ok(workflow.includes("command: ${{ steps.m.outputs.command }}"), "resolved command must be exposed to dependent jobs");
  assert.ok(workflow.includes("COMMAND: ${{ inputs.command || 'all' }}"), "manual dispatch command must default to all for scheduled runs");
  for (const command of ["scan-dependabot", "scan-codescan", "scan-reverts", "knowledge-merge", "merge-queue"]) {
    assert.ok(workflow.includes(`command == '${command}'`), `${command} must have an explicit dispatch condition`);
  }
  assert.ok(workflow.includes("if: needs.mode.outputs.command == 'status'"), "status choice must run the status job");
  assert.ok(workflow.includes("run: node scripts/ai/autopilot/cli.mjs status"), "status job must execute the CLI status command");
});
