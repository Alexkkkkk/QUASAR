#!/usr/bin/env node
/**
 * QUASAR event router — pure decision function of the automation hub.
 *
 * Input:  environment variables only (EVENT, ISSUE_ACTION, LABEL, ACTOR,
 *         OWNER, PR_ACTION, MERGED, HEAD_REF, CRON).
 * Output: key=value lines on GITHUB_OUTPUT (or stdout when GITHUB_OUTPUT is
 *         unset, which is what the tests use).
 *
 * Routing table (epic #145, Части 3/10/11/13):
 *   push / pull_request / workflow_dispatch            -> checks=true
 *   issues + labeled `ai-fix` by the owner             -> ai-fix=true (checks=false)
 *   issues + labeled `ai-merge-ok` by the owner        -> ai-merge=true
 *   pull_request opened/synchronize/reopened           -> ai-review=true
 *   copilot/* head branch PRs                          -> ai-review=true (second opinion)
 *   pull_request synchronize on ai/* or copilot/*      -> pr-polish=true
 *   pull_request closed && merged                      -> close-issues=true
 *   schedule `0 6 * * 1` (Monday 06:00 UTC)            -> hub-audit=true
 *   schedule `0 3 * * *`                               -> stale=true
 *   schedule `0 9 * * *`                               -> dms=true (dead man's switch)
 *   everything else                                    -> nothing
 */

import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const OUTPUTS = [
  "checks",
  "ai-fix",
  "ai-review",
  "close-issues",
  "ai-merge",
  "pr-polish",
  "dms",
  "hub-audit",
  "stale",
];

/** Branch prefixes owned by an automated coding agent (issues #155, #156, #157). */
export const AGENT_BRANCH_PREFIXES = ["ai/", "copilot/"];

export function isAgentBranch(headRef) {
  return AGENT_BRANCH_PREFIXES.some((prefix) => String(headRef ?? "").startsWith(prefix));
}

export function route(env) {
  const result = {
    checks: "false",
    "ai-fix": "false",
    "ai-review": "false",
    "close-issues": "false",
    "ai-merge": "false",
    "pr-polish": "false",
    dms: "false",
    "hub-audit": "false",
    stale: "false",
  };

  const event = env.EVENT ?? "";
  const isOwner = Boolean(env.ACTOR) && env.ACTOR === env.OWNER;

  switch (event) {
    case "push":
    case "workflow_dispatch":
      result.checks = "true";
      break;

    case "pull_request": {
      const action = env.PR_ACTION ?? "";
      const headRef = env.HEAD_REF ?? "";
      if (action === "opened" || action === "synchronize" || action === "reopened") {
        result["ai-review"] = "true";
      } else if (action === "closed" && env.MERGED === "true") {
        result["close-issues"] = "true";
      }
      // Copilot coding agent branches always get the platform checks plus a
      // second-opinion ai-review, never the legacy ai-fix path (issue #157).
      if (headRef.startsWith("copilot/") && action !== "closed") {
        result["ai-review"] = "true";
      }
      // The polish loop only ever starts from a new commit on an agent branch;
      // the module itself still requires a failing check before it edits
      // anything, so a bare `synchronize` cannot start an infinite loop
      // (issues #149, #156).
      if (action === "synchronize" && isAgentBranch(headRef)) {
        result["pr-polish"] = "true";
      }
      break;
    }

    case "issues": {
      if ((env.ISSUE_ACTION ?? "") === "labeled" && isOwner) {
        if (env.LABEL === "ai-fix") {
          result["ai-fix"] = "true";
          result.checks = "false";
        } else if (env.LABEL === "ai-merge-ok") {
          result["ai-merge"] = "true";
        }
      }
      break;
    }

    case "schedule": {
      const cron = env.CRON ?? "";
      if (cron === "0 6 * * 1") result["hub-audit"] = "true";
      else if (cron === "0 3 * * *") result.stale = "true";
      else if (cron === "0 9 * * *") result.dms = "true";
      break;
    }

    default:
      break;
  }

  return result;
}

export function emit(result, target) {
  const lines = OUTPUTS.filter((key) => result[key] === "true").map((key) => `${key}=true`);
  const text = lines.length > 0 ? `${lines.join("\n")}\n` : "";
  if (target) {
    // GITHUB_OUTPUT may legitimately stay empty when nothing is selected.
    if (text.length > 0) appendFileSync(target, text);
  } else if (text.length > 0) {
    process.stdout.write(text);
  }
  return lines;
}

function main() {
  const target = process.env.GITHUB_OUTPUT;
  const selected = emit(route(process.env), target);
  console.error(`router: selected -> ${selected.length > 0 ? selected.join(", ") : "(nothing)"}`);
}

const invoked = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invoked) {
  main();
}
