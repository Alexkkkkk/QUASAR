/**
 * Router decision-table tests (issue #147): every branch plus negative cases.
 * Run via `npm run hub:test`.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import { route } from "../scripts/router.mjs";

const OWNER_ENV = { EVENT: "issues", ISSUE_ACTION: "labeled", ACTOR: "Alexkkkkk", OWNER: "Alexkkkkk" };

test("router: push and workflow_dispatch run checks only", () => {
  for (const event of ["push", "workflow_dispatch"]) {
    const r = route({ EVENT: event });
    assert.equal(r.checks, "true");
    for (const [k, v] of Object.entries(r)) {
      if (k !== "checks") assert.equal(v, "false", `${event}: ${k} must stay off`);
    }
  }
});

test("router: ai-fix label from the owner triggers ai-fix without the checks job", () => {
  const r = route({ ...OWNER_ENV, LABEL: "ai-fix" });
  assert.equal(r["ai-fix"], "true");
  assert.equal(r.checks, "false");
});

test("router: ai-fix label from a non-owner is ignored", () => {
  const r = route({ EVENT: "issues", ISSUE_ACTION: "labeled", ACTOR: "someone-else", OWNER: "Alexkkkkk", LABEL: "ai-fix" });
  assert.equal(r["ai-fix"], "false");
});

test("router: unknown label from the owner is ignored", () => {
  const r = route({ ...OWNER_ENV, LABEL: "ai-fix-ollama" });
  assert.equal(r["ai-fix"], "false");
  assert.equal(r["ai-merge"], "false");
});

test("router: issues event with a non-labeled action is ignored", () => {
  const r = route({ ...OWNER_ENV, ISSUE_ACTION: "opened", LABEL: "ai-fix" });
  assert.equal(r["ai-fix"], "false");
});

test("router: ai-merge-ok label from the owner sets ai-merge", () => {
  const r = route({ ...OWNER_ENV, LABEL: "ai-merge-ok" });
  assert.equal(r["ai-merge"], "true");
});

test("router: ai-merge-ok label from a non-owner is ignored", () => {
  const r = route({ EVENT: "issues", ISSUE_ACTION: "labeled", ACTOR: "bot-user", OWNER: "Alexkkkkk", LABEL: "ai-merge-ok" });
  assert.equal(r["ai-merge"], "false");
});

test("router: PR opened/synchronize/reopened trigger ai-review", () => {
  for (const action of ["opened", "synchronize", "reopened"]) {
    const r = route({ EVENT: "pull_request", PR_ACTION: action, HEAD_REF: "feature/x" });
    assert.equal(r["ai-review"], "true", action);
    assert.equal(r["close-issues"], "false");
  }
});

test("router: PR closed without merge does not close issues", () => {
  const r = route({ EVENT: "pull_request", PR_ACTION: "closed", MERGED: "false" });
  assert.equal(r["close-issues"], "false");
});

test("router: merged PR closes issues", () => {
  const r = route({ EVENT: "pull_request", PR_ACTION: "closed", MERGED: "true" });
  assert.equal(r["close-issues"], "true");
});

test("router: copilot/* branches get a second-opinion ai-review (issue #157)", () => {
  const r = route({ EVENT: "pull_request", PR_ACTION: "synchronize", HEAD_REF: "copilot/fix-157" });
  assert.equal(r["ai-review"], "true");
  const closed = route({ EVENT: "pull_request", PR_ACTION: "closed", MERGED: "true", HEAD_REF: "copilot/fix-157" });
  assert.equal(closed["ai-review"], "false");
  assert.equal(closed["close-issues"], "true");
});

test("router: hub-audit cron only on the Monday 06:00 slot", () => {
  assert.equal(route({ EVENT: "schedule", CRON: "0 6 * * 1" })["hub-audit"], "true");
  assert.equal(route({ EVENT: "schedule", CRON: "0 3 * * *" })["hub-audit"], "false");
});

test("router: stale cron `0 3 * * *`", () => {
  const r = route({ EVENT: "schedule", CRON: "0 3 * * *" });
  assert.equal(r.stale, "true");
  assert.equal(r["hub-audit"], "false");
});

test("router: dead man's switch cron `0 9 * * *` (issue #156)", () => {
  const r = route({ EVENT: "schedule", CRON: "0 9 * * *" });
  assert.equal(r.dms, "true");
  assert.equal(r.stale, "false");
});

test("router: unknown schedule slot selects nothing", () => {
  const r = route({ EVENT: "schedule", CRON: "42 2 * * 5" });
  for (const v of Object.values(r)) assert.equal(v, "false");
});

test("router: unknown event selects nothing", () => {
  const r = route({ EVENT: "fork" });
  for (const v of Object.values(r)) assert.equal(v, "false");
});
