#!/usr/bin/env tsx
/**
 * QUASAR automation-hub auditor.
 *
 * Verifies, in one pass, that the repository's automation surface is still in
 * the hardened shape this project expects:
 *
 *   1. every required automation config file is present;
 *   2. every `uses:` in `.github/workflows` is pinned to a full 40-character
 *      commit SHA (the repository enforces `sha_pinning_required`);
 *   3. every workflow declares an explicit top-level `permissions:` block;
 *   4. when a token is available, the live repository settings match the
 *      documented baseline (rulesets, security features, merge policy).
 *
 * Local checks are blocking. Live checks degrade to warnings when the token
 * lacks the Administration scope, so the audit never fails for a permission
 * it cannot possibly hold.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const WORKFLOW_DIR = join(ROOT, ".github", "workflows");

const REQUIRED_FILES = [
  ".github/workflows/ci.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/stale.yml",
  ".github/workflows/release.yml",
  ".github/workflows/ai-ollama-agent.yml",
  ".github/workflows/hub-audit.yml",
  ".github/dependabot.yml",
  ".github/CODEOWNERS",
  ".github/labeler.yml",
];

const failures: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];

function ok(message: string): void {
  console.log(`  ok    ${message}`);
}

function fail(message: string): void {
  failures.push(message);
  console.log(`  FAIL  ${message}`);
}

function warn(message: string): void {
  warnings.push(message);
  console.log(`  warn  ${message}`);
}

/**
 * Blanks out YAML block-scalar bodies so `run:` scripts cannot be mistaken for
 * workflow keys.
 */
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

function checkLocalSurface(): void {
  console.log("\n[1] Required automation files");
  for (const rel of REQUIRED_FILES) {
    if (existsSync(join(ROOT, rel))) ok(rel);
    else fail(`missing automation config: ${rel}`);
  }

  console.log("\n[2] Action pinning (40-char commit SHA)");
  const workflows = readdirSync(WORKFLOW_DIR).filter((f) => /\.ya?ml$/.test(f));
  if (workflows.length === 0) fail("no workflow files found");
  for (const file of workflows) {
    const body = stripBlockScalars(readFileSync(join(WORKFLOW_DIR, file), "utf8"));
    const refs = [...body.matchAll(/^\s*(?:-\s+)?uses:\s*([^\s#]+)/gm)].map((m) => m[1]);
    if (refs.length === 0) {
      warn(`${file}: no action references`);
      continue;
    }
    const unpinned = refs.filter((ref) => {
      if (ref.startsWith("./") || ref.startsWith("docker://")) return false;
      return !/@[0-9a-f]{40}$/.test(ref);
    });
    if (unpinned.length > 0) fail(`${file}: unpinned action(s): ${unpinned.join(", ")}`);
    else ok(`${file}: ${refs.length} reference(s) pinned`);
  }

  console.log("\n[3] Explicit workflow permissions");
  for (const file of workflows) {
    const body = readFileSync(join(WORKFLOW_DIR, file), "utf8");
    if (/^permissions:/m.test(body)) ok(`${file}: permissions declared`);
    else fail(`${file}: no top-level permissions block`);
  }
}

async function api(token: string, repo: string, path: string): Promise<unknown | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "quasar-hub-audit",
      },
    });
    if (!response.ok) {
      warn(`GET ${path} -> HTTP ${response.status} (token scope?)`);
      return null;
    }
    return await response.json();
  } catch (error) {
    warn(`GET ${path} failed: ${(error as Error).message}`);
    return null;
  }
}

async function checkLiveSettings(): Promise<void> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? "";
  const repo = process.env.GITHUB_REPOSITORY ?? "Alexkkkkk/QUASAR";
  console.log(`\n[4] Live settings for ${repo}`);
  if (!token) {
    warn("no token in GITHUB_TOKEN/GH_TOKEN — live settings not audited");
    return;
  }

  const repoInfo = (await api(token, repo, "")) as Record<string, any> | null;
  if (repoInfo) {
    const expected: Array<[string, unknown]> = [
      ["allow_auto_merge", true],
      ["delete_branch_on_merge", true],
      ["allow_merge_commit", false],
    ];
    for (const [key, want] of expected) {
      if (repoInfo[key] === want) ok(`${key} = ${String(want)}`);
      else warn(`${key} = ${String(repoInfo[key])} (expected ${String(want)})`);
    }
    const analysis = repoInfo.security_and_analysis ?? {};
    for (const key of ["secret_scanning", "secret_scanning_push_protection"]) {
      const status = analysis[key]?.status;
      if (status === "enabled") ok(`${key} enabled`);
      else warn(`${key} = ${String(status)} (expected enabled)`);
    }
  }

  const rulesets = (await api(token, repo, "/rulesets")) as Array<Record<string, any>> | null;
  if (Array.isArray(rulesets)) {
    if (rulesets.length === 0) fail("no rulesets configured");
    for (const ruleset of rulesets) {
      const types = (ruleset.rules ?? []).map((rule: { type: string }) => rule.type);
      notes.push(`ruleset "${ruleset.name}" (${ruleset.target}, ${ruleset.enforcement}): ${types.join(", ")}`);
      ok(`ruleset "${ruleset.name}" active`);
    }
  }

  const actions = (await api(token, repo, "/actions/permissions")) as Record<string, any> | null;
  if (actions) {
    if (actions.sha_pinning_required === true) ok("Actions: SHA pinning required");
    else warn("Actions: SHA pinning is not required");
  }

  const labels = (await api(token, repo, "/labels?per_page=100")) as Array<{ name: string }> | null;
  if (Array.isArray(labels)) {
    const names = new Set(labels.map((label) => label.name));
    for (const wanted of ["stale", "dependencies", "ai-fix-ollama", "pinned"]) {
      if (names.has(wanted)) ok(`label "${wanted}" exists`);
      else warn(`label "${wanted}" is missing`);
    }
  }
}

async function main(): Promise<void> {
  console.log("QUASAR automation-hub audit");
  checkLocalSurface();
  await checkLiveSettings();

  if (notes.length > 0) {
    console.log("\nRulesets in force");
    for (const note of notes) console.log(`  - ${note}`);
  }

  console.log(
    `\nResult: ${failures.length} failure(s), ${warnings.length} warning(s)`,
  );
  if (failures.length > 0) {
    console.log("\nBlocking failures:");
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exitCode = 1;
  }
}

void main();
