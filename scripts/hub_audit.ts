#!/usr/bin/env tsx
/**
 * QUASAR automation-hub auditor.
 *
 * Local checks are blocking. Live checks degrade to warnings when the token
 * lacks the Administration scope, so the audit never fails for a permission it
 * cannot hold.
 *
 *   tsx scripts/hub_audit.ts             # local checks only
 *   tsx scripts/hub_audit.ts --online    # local checks + live repository settings
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WORKFLOW_DIR = join(ROOT, ".github", "workflows");
const ONLINE = process.argv.includes("--online");

const REQUIRED_FILES = [
  ".github/workflows/ci.yml",
  ".github/workflows/labeler.yml",
  ".github/workflows/stale.yml",
  ".github/workflows/release.yml",
  ".github/workflows/ai-fix-agent.yml",
  ".github/workflows/ai-ollama-agent.yml",
  ".github/workflows/hub-audit.yml",
  ".github/workflows/dependency-review.yml",
  ".github/workflows/dependabot-auto-merge.yml",
  ".github/workflows/pin-refresh.yml",
  ".github/workflows/pages.yml",
  ".github/dependabot.yml",
  ".github/CODEOWNERS",
  ".github/labeler.yml",
  ".github/pull_request_template.md",
  ".github/ISSUE_TEMPLATE/config.yml",
  ".github/ISSUE_TEMPLATE/bug_report.md",
  ".github/ISSUE_TEMPLATE/feature_request.md",
  ".yamllint.yml",
  "scripts/action_pins.json",
  "scripts/sync_action_pins.ts",
  "scripts/hub_audit.ts",
  "tests/automation_hub.test.ts",
];

/** pull_request_target is tolerated in exactly this file, and only with a guard. */
const PULL_REQUEST_TARGET_ALLOWED = "dependabot-auto-merge.yml";

const failures: string[] = [];
const warnings: string[] = [];
const notes: string[] = [];

const ok = (m: string): void => console.log(`  ok    ${m}`);
const fail = (m: string): void => {
  failures.push(m);
  console.log(`  FAIL  ${m}`);
};
const warn = (m: string): void => {
  warnings.push(m);
  console.log(`  warn  ${m}`);
};

/** Blanks block-scalar bodies so `run:` scripts cannot look like workflow keys. */
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
  if (!existsSync(WORKFLOW_DIR)) return [];
  return readdirSync(WORKFLOW_DIR)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => join(WORKFLOW_DIR, f));
}

/** Workflows that GitHub never executes because they sit outside .github/workflows. */
function dormantWorkflowFiles(): string[] {
  const found: string[] = [];
  const integrations = join(ROOT, "integrations");
  if (!existsSync(integrations)) return found;
  for (const entry of readdirSync(integrations)) {
    const dir = join(integrations, entry, ".github", "workflows");
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (/\.ya?ml$/.test(file)) found.push(join(dir, file));
    }
  }
  return found;
}

function jobNames(body: string): string[] {
  const stripped = stripBlockScalars(body);
  const match = /^jobs:\s*$([\s\S]*)$/m.exec(stripped);
  if (!match) return [];
  const names: string[] = [];
  for (const line of match[1].split("\n")) {
    const m = /^ {2}([A-Za-z0-9_-]+):\s*$/.exec(line);
    if (m) names.push(m[1]);
  }
  return names;
}

function checkLocalSurface(): void {
  console.log("\n[1] Required automation files");
  for (const rel of REQUIRED_FILES) {
    if (existsSync(join(ROOT, rel))) ok(rel);
    else fail(`missing automation config: ${rel}`);
  }

  console.log("\n[2] Action pinning (40-char commit SHA + matching tag comment)");
  const lockPath = join(ROOT, "scripts", "action_pins.lock.json");
  const lock = existsSync(lockPath)
    ? (JSON.parse(readFileSync(lockPath, "utf8")) as {
        actions: Record<string, { tag: string; sha: string }>;
      })
    : null;
  if (!lock) warn("scripts/action_pins.lock.json is absent - run `npm run pins:sync`");

  const files = [...workflowFiles(), ...dormantWorkflowFiles()];
  if (files.length === 0) fail("no workflow files found");
  for (const path of files) {
    const rel = path.slice(ROOT.length + 1);
    const body = stripBlockScalars(readFileSync(path, "utf8"));
    const refs = [...body.matchAll(/^\s*(?:-\s+)?uses:\s*([^\s#]+)\s*(?:#\s*(.*))?$/gm)];
    if (refs.length === 0) {
      warn(`${rel}: no action references`);
      continue;
    }
    const bad: string[] = [];
    for (const [, ref, comment] of refs) {
      if (ref.startsWith("./") || ref.startsWith("docker://")) continue;
      const at = ref.lastIndexOf("@");
      if (at < 0) {
        bad.push(`${ref} (no ref)`);
        continue;
      }
      const repo = ref.slice(0, at);
      const sha = ref.slice(at + 1);
      if (!/^[0-9a-f]{40}$/.test(sha)) {
        bad.push(`${ref} (not a 40-char SHA)`);
        continue;
      }
      if (lock && lock.actions[repo] && lock.actions[repo].sha !== sha) {
        bad.push(`${ref} (lock says ${lock.actions[repo].sha})`);
        continue;
      }
      const tag = String(comment ?? "").trim();
      if (!tag) bad.push(`${ref} (missing "# <tag>" comment)`);
      else if (lock && lock.actions[repo] && tag !== lock.actions[repo].tag) {
        bad.push(`${ref} # ${tag} (lock says ${lock.actions[repo].tag})`);
      }
    }
    if (bad.length > 0) fail(`${rel}: ${bad.join("; ")}`);
    else ok(`${rel}: ${refs.length} reference(s) pinned and labelled`);
  }

  console.log("\n[3] Explicit top-level permissions");
  for (const path of workflowFiles()) {
    const rel = path.slice(ROOT.length + 1);
    const body = readFileSync(path, "utf8");
    if (/^permissions:/m.test(body)) ok(`${rel}: permissions declared`);
    else fail(`${rel}: no top-level permissions block`);
  }

  console.log("\n[4] Workflow hygiene");
  for (const path of workflowFiles()) {
    const rel = path.slice(ROOT.length + 1);
    const name = basename(path);
    const body = readFileSync(path, "utf8");
    if (body.includes("pull_request_target")) {
      if (name !== PULL_REQUEST_TARGET_ALLOWED) {
        fail(`${rel}: pull_request_target is only allowed in ${PULL_REQUEST_TARGET_ALLOWED}`);
      } else if (!body.includes("github.actor == 'dependabot[bot]'")) {
        fail(`${rel}: pull_request_target without a dependabot actor guard`);
      } else if (/actions\/checkout@/.test(body)) {
        fail(`${rel}: the pull_request_target job must not check out code`);
      } else {
        ok(`${rel}: pull_request_target with the required actor guard and no checkout`);
      }
    }
    if (/actions\/checkout@/.test(body) && !/persist-credentials:\s*false/.test(body)) {
      warn(`${rel}: a checkout step does not set persist-credentials: false`);
    }
    if (/^\s*strategy:/m.test(body) === false && /\$\{\{\s*matrix\./.test(body)) {
      fail(`${rel}: uses matrix.* without a strategy.matrix block`);
    }
  }

  for (const file of ["ai-fix-agent.yml", "ai-ollama-agent.yml"]) {
    const path = join(WORKFLOW_DIR, file);
    if (!existsSync(path)) continue;
    const body = readFileSync(path, "utf8");
    const before = failures.length;
    if (file === "ai-ollama-agent.yml" && /secrets\.(?!GITHUB_TOKEN)[A-Z_]+/.test(body)) {
      fail(`${file}: the local-model agent must only use the ephemeral GITHUB_TOKEN`);
    }
    if (!/draft: always-true/.test(body)) fail(`${file}: the agent must open draft pull requests only`);
    if (/scripts\/deploy/.test(body)) fail(`${file}: the agent must not invoke deploy scripts`);
    if (failures.length === before) ok(`${file}: draft-only, no deploy scripts, no extra secrets`);
  }

  console.log("\n[5] Required status checks exist as real jobs");
  const known = new Set<string>();
  for (const path of workflowFiles()) {
    for (const name of jobNames(readFileSync(path, "utf8"))) known.add(name);
  }
  // Code scanning default setup publishes these two check names dynamically.
  known.add("Analyze (javascript-typescript)");
  known.add("Analyze (python)");
  if (!known.has("validate")) fail("ci.yml must keep a job named `validate`: it is a required check");
  else ok("required check `validate` is produced by ci.yml");
  notes.push(`jobs discovered: ${[...known].sort().join(", ")}`);
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
  console.log(`\n[6] Live settings for ${repo}`);
  if (!ONLINE) {
    warn("live checks skipped (pass --online to enable them)");
    return;
  }
  if (!token) {
    warn("no token in GITHUB_TOKEN/GH_TOKEN - live settings not audited");
    return;
  }

  const repoInfo = (await api(token, repo, "")) as Record<string, any> | null;
  if (repoInfo) {
    const expected: Array<[string, unknown]> = [
      ["allow_auto_merge", true],
      ["allow_squash_merge", true],
      ["delete_branch_on_merge", true],
      ["allow_merge_commit", false],
    ];
    for (const [key, want] of expected) {
      if (repoInfo[key] === want) ok(`${key} = ${String(want)}`);
      else warn(`${key} = ${String(repoInfo[key])} (expected ${String(want)})`);
    }
    const analysis = repoInfo.security_and_analysis ?? {};
    for (const key of ["secret_scanning", "secret_scanning_push_protection", "dependabot_security_updates"]) {
      const status = analysis[key]?.status;
      if (status === "enabled") ok(`${key} enabled`);
      else warn(`${key} = ${String(status)} (expected enabled)`);
    }
    for (const key of ["secret_scanning_non_provider_patterns", "secret_scanning_validity_checks"]) {
      const status = analysis[key]?.status;
      if (status === "enabled") ok(`${key} enabled`);
      else warn(`${key} = ${String(status)} (recommended: enabled - see setup-repo.sh)`);
    }
  }

  const list = (await api(token, repo, "/rulesets")) as Array<{ id: number }> | null;
  if (Array.isArray(list)) {
    if (list.length === 0) fail("no rulesets configured");
    for (const item of list) {
      const detail = (await api(token, repo, `/rulesets/${item.id}`)) as Record<string, any> | null;
      if (!detail) continue;
      const types = (detail.rules ?? []).map((rule: { type: string }) => rule.type);
      ok(`ruleset "${detail.name}" (${detail.target}, ${detail.enforcement})`);
      notes.push(`ruleset "${detail.name}": ${types.join(", ") || "no rules"}`);
      if (detail.target === "branch") {
        if (!types.includes("required_linear_history")) warn(`ruleset "${detail.name}": linear history not required`);
        if (!types.includes("required_signatures")) warn(`ruleset "${detail.name}": commit signatures not required`);
        const pr = (detail.rules ?? []).find((rule: { type: string }) => rule.type === "pull_request");
        if (pr?.parameters?.required_approving_review_count === 0) {
          warn(`ruleset "${detail.name}": a pull request is required but needs 0 approvals`);
        }
        const checks = (detail.rules ?? []).find(
          (rule: { type: string }) => rule.type === "required_status_checks",
        );
        const contexts: string[] = (checks?.parameters?.required_status_checks ?? []).map(
          (entry: { context: string }) => entry.context,
        );
        if (contexts.length === 0) warn(`ruleset "${detail.name}": no required status checks`);
        else notes.push(`required checks: ${contexts.join(", ")}`);
      }
    }
  }

  const actions = (await api(token, repo, "/actions/permissions")) as Record<string, any> | null;
  if (actions) {
    if (actions.sha_pinning_required === true) ok("Actions: SHA pinning required");
    else fail("Actions: SHA pinning is not required");
    if (actions.allowed_actions === "all") {
      warn("Actions: every action is allowed - consider allowlisting GitHub-authored actions");
    }
  }

  const labels = (await api(token, repo, "/labels?per_page=100")) as Array<{ name: string }> | null;
  if (Array.isArray(labels)) {
    const names = new Set(labels.map((label) => label.name));
    for (const wanted of ["stale", "dependencies", "ai-fix", "ai-fix-ollama", "pinned", "ci", "contracts", "dapp", "ton-docs"]) {
      if (names.has(wanted)) ok(`label "${wanted}" exists`);
      else warn(`label "${wanted}" is missing - run setup-repo.sh`);
    }
  }

  const codeScanning = (await api(token, repo, "/code-scanning/default-setup")) as Record<string, any> | null;
  if (codeScanning) {
    if (codeScanning.state === "configured") {
      ok(`code scanning default setup: configured (${(codeScanning.languages ?? []).join(", ")})`);
    } else {
      warn(`code scanning default setup: ${String(codeScanning.state)} - enable it in Settings -> Code security`);
    }
  }
}

async function main(): Promise<void> {
  console.log("QUASAR automation-hub audit");
  checkLocalSurface();
  await checkLiveSettings();

  if (notes.length > 0) {
    console.log("\nNotes");
    for (const note of notes) console.log(`  - ${note}`);
  }

  console.log(`\nResult: ${failures.length} failure(s), ${warnings.length} warning(s)`);
  if (failures.length > 0) {
    console.log("\nBlocking failures:");
    for (const failure of failures) console.log(`  - ${failure}`);
    process.exitCode = 1;
  }
}

void main();
