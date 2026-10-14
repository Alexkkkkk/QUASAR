import assert from "node:assert/strict";
import { test } from "node:test";
import { boundedLimit, remainingMergeBudget, resolveMode, groupDependabotAlerts, groupCodeScanAlerts, isMergeableCandidate, touchesProtectedPaths } from "../scripts/ai/autopilot/cli.mjs";

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
  const base = { isDraft: false, mergeable: "MERGEABLE", labels: [{ name: "automerge" }], reviewDecision: "APPROVED", statusCheckRollup: [{ conclusion: "SUCCESS" }], author: { login: "contributor" } };
  assert.equal(isMergeableCandidate(base).ok, true);
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [] }).why, "no-status-checks");
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [{ state: "PENDING" }] }).why, "checks-pending:1");
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [{ conclusion: "FAILURE" }] }).why, "checks-failed:1");
  assert.equal(isMergeableCandidate({ ...base, statusCheckRollup: [{ conclusion: "SKIPPED" }] }).why, "no-successful-checks");
  assert.equal(isMergeableCandidate({ ...base, labels: [{ name: "automerge" }, { name: "do-not-merge" }] }).why, "do-not-merge");
  // Fully autonomous mode: a missing human approval and a missing automerge
  // label no longer block the queue — green required checks are the only gate.
  assert.equal(isMergeableCandidate({ ...base, reviewDecision: "REVIEW_REQUIRED" }).ok, true);
  assert.equal(isMergeableCandidate({ ...base, labels: [] }).ok, true);
});

test("fully autonomous queue: unlabeled unreviewed PRs merge on green checks", () => {
  const pr = { isDraft: false, mergeable: "MERGEABLE", labels: [], reviewDecision: "REVIEW_REQUIRED", author: { login: "contributor" }, statusCheckRollup: [{ conclusion: "SUCCESS" }] };
  assert.equal(isMergeableCandidate(pr).ok, true);
  assert.equal(isMergeableCandidate({ ...pr, isDraft: true }).why, "draft");
});

test("protected path detection includes scripts and workflow files", () => {
  assert.equal(touchesProtectedPaths([{ path: "scripts/ai/autopilot/cli.mjs" }]), true);
  assert.equal(touchesProtectedPaths([{ path: ".github/workflows/ci.yml" }]), true);
  assert.equal(touchesProtectedPaths([{ path: "src/app.js" }]), false);
});
