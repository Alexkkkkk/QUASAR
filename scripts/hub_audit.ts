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
  ".github/workflows/ton-docs-sync.yml",
  ".github/workflows/issue-triage.yml",
  ".github/workflows/_learn.yml",
  ".github/workflows/_idle-agent.yml",
  ".github/workflows/_scout.yml",
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
  "docs/ai/ruleset-l3.json",
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
  "tests/automation_hub.test.ts",
  "tests/router.test.mjs",
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

  console.log("\n[4a] Website deployment and on-chain workflows remain disabled");
  if (existsSync(join(WORKFLOW_DIR, "pages.yml"))) {
    fail("pages.yml exists: automatic GitHub Pages deployment is forbidden");
  } else ok("pages.yml absent: website is not automatically published");
  for (const path of workflowFiles()) {
    const rel = path.slice(ROOT.length + 1);
    const raw = readFileSync(path, "utf8");
    const body = stripBlockScalars(raw);
    if (/actions\/deploy-pages@|^\s*pages:\s*write\s*$|^\s*name:\s*github-pages\s*$/m.test(body)) {
      fail(`${rel}: contains a GitHub Pages deployment capability`);
    }
    if (/\$\{\{\s*secrets\.(?:WALLET_MNEMONIC|ORACLE_SIGNING_KEY|TONCENTER_API_KEY)\s*\}\}/i.test(raw)) {
      fail(`${rel}: on-chain wallet/API secrets are forbidden in workflows`);
    }
    if (/\b(?:npm\s+run\s+deploy(?::defi)?|npx\s+tsx\s+scripts\/deploy_(?:all|defi)\.ts)\b/i.test(raw)) {
      fail(`${rel}: contract deployment commands are forbidden in workflows`);
    }
  }

  for (const file of ["_ai-fix.yml", "ai-ollama-agent.yml"]) {
    const path = join(WORKFLOW_DIR, file);
    if (!existsSync(path)) {
      fail(`${file}: the AI issue agent is required`);
      continue;
    }
    const body = readFileSync(path, "utf8");
    const before = failures.length;
    if (file === "ai-ollama-agent.yml" && /secrets\.(?!GITHUB_TOKEN)[A-Z_]+/.test(body)) {
      fail(`${file}: the local-model agent must only use the ephemeral GITHUB_TOKEN`);
    }
    if (!/draft:\s*(true|always-true)/.test(body)) fail(`${file}: the agent must open draft pull requests only`);
    if (/scripts\/deploy/.test(body)) fail(`${file}: the agent must not invoke deploy scripts`);
    if (!/github\.actor == github\.repository_owner/.test(body)) fail(`${file}: the agent must stay owner-gated`);
    if (failures.length === before) ok(`${file}: draft-only, owner-gated, no deploy scripts`);
  }

  console.log("\n[5] Required status checks exist as real jobs");
  const known = new Set<string>();
  for (const path of workflowFiles()) {
    for (const name of jobNames(readFileSync(path, "utf8"))) known.add(name);
  }
  const ciWorkflow = readFileSync(join(WORKFLOW_DIR, "ci.yml"), "utf8");
  const checksWorkflow = readFileSync(join(WORKFLOW_DIR, "_checks.yml"), "utf8");
  if (/validate:\s*\n\s+uses:\s+\.\/\.github\/workflows\/_checks\.yml/.test(ciWorkflow) &&
      /verify:\s*\n/.test(checksWorkflow)) {
    known.add("validate / verify");
  }
  const setupScript = readFileSync(join(ROOT, "setup-repo.sh"), "utf8");
  if (setupScript.includes("docs/ai/ruleset-l3.json")) ok("setup-repo.sh applies the canonical main ruleset JSON");
  else fail("setup-repo.sh must apply docs/ai/ruleset-l3.json");
  if (/repos\/\$REPO\/pages|build_type=workflow/.test(setupScript)) {
    fail("setup-repo.sh must not enable or configure GitHub Pages deployment");
  } else ok("setup-repo.sh does not enable GitHub Pages");
  if (setupScript.includes("branches/main/protection/required_pull_request_reviews") &&
      /gh api --method PATCH "\$review_endpoint"/.test(setupScript) &&
      /required_approving_review_count=0/.test(setupScript)) {
    ok("setup-repo.sh sets classic branch-protection approvals to zero");
  } else fail("setup-repo.sh must set classic branch-protection approvals to zero");
  if (/code-scanning\/default-setup/.test(setupScript)) known.add("CodeQL");
  const testWorkflow = readFileSync(join(WORKFLOW_DIR, "tests.yml"), "utf8");
  const testPackages = /package:\s*\[([^\]]+)\]/.exec(testWorkflow)?.[1]
    .split(",").map((item) => item.trim()) ?? [];
  if (/name:\s*Tests \(\$\{\{ matrix\.package \}\}\)/.test(testWorkflow)) {
    for (const packageName of testPackages) known.add(`Tests (${packageName})`);
  }
  const reviewWorkflow = readFileSync(join(WORKFLOW_DIR, "dependency-review.yml"), "utf8");
  if (jobNames(reviewWorkflow).includes("review")) known.add("review");
  const requiredContexts = ["validate / verify", "CodeQL", "Tests (contracts)", "Tests (dapp)", "Tests (python)", "review"];
  for (const context of requiredContexts) {
    if (known.has(context)) ok(`required check '${context}' has a workflow source`);
    else fail(`required check '${context}' is not produced by a workflow`);
  }
  const desiredRuleset = JSON.parse(readFileSync(join(ROOT, "docs/ai/ruleset-l3.json"), "utf8")) as Record<string, any>;
  if (!(desiredRuleset.rules ?? []).some((rule: { type: string }) => rule.type === "update")) {
    ok("desired main ruleset does not lock out CI auto-merge updates");
  } else fail("desired main ruleset must not restrict updates when bypass_actors is empty");
  const desiredPullRule = desiredRuleset.rules?.find((rule: { type: string }) => rule.type === "pull_request");
  const desiredChecksRule = desiredRuleset.rules?.find((rule: { type: string }) => rule.type === "required_status_checks");
  const desiredContexts: string[] = (desiredChecksRule?.parameters?.required_status_checks ?? [])
    .map((entry: { context: string }) => entry.context).sort();
  if (desiredRuleset.bypass_actors?.length === 0) ok("desired main ruleset has no bypass actors");
  else fail("desired main ruleset must have an empty bypass_actors list");
  if (desiredPullRule?.parameters?.required_approving_review_count === 0 &&
      desiredPullRule?.parameters?.required_reviewers?.length === 0 &&
      desiredPullRule?.parameters?.require_code_owner_review !== true &&
      desiredPullRule?.parameters?.require_last_push_approval !== true &&
      desiredPullRule?.parameters?.required_review_thread_resolution !== true &&
      desiredPullRule?.parameters?.require_extra_approval_for_unattributed_changes !== true) {
    ok("desired main ruleset requires zero approving reviews");
  } else fail("desired main ruleset must not require approving reviews");
  if (desiredChecksRule?.parameters?.strict_required_status_checks_policy === true &&
      JSON.stringify(desiredContexts) === JSON.stringify([...requiredContexts].sort())) {
    ok("desired main ruleset requires exactly the six strict CI contexts");
  } else fail(`desired main ruleset check contexts or strict policy mismatch: ${desiredContexts.join(", ")}`);
  notes.push(`jobs discovered: ${[...known].sort().join(", ")}`);

  console.log("\n[7] Workflow-level permissions stay read-only (write belongs to jobs)");
  for (const path of workflowFiles()) {
    const rel = path.slice(ROOT.length + 1);
    const body = readFileSync(path, "utf8");
    const top = /^permissions:[^\n]*\n([\s\S]*?)(?=^\S)/m.exec(body);
    if (top && /:\s*write\b/.test(top[1])) {
      fail(`${rel}: grants write at the workflow level; keep write on the job level`);
    } else if (top) {
      ok(`${rel}: workflow-level permissions are read-only`);
    }
  }

  console.log("\n[8] Reusable modules are workflow_call-only");
  const eventWorkflows = new Set([
    "ci.yml",
    "quasar.yml",
    "ai-issue-discuss.yml",
    "ai-ollama-agent.yml",
    "auto-update-prs.yml",
    "dependabot-auto-merge.yml",
    "dependency-review.yml",
    "labeler.yml",
    "pin-refresh.yml",
    "release.yml",
  ]);
  for (const path of workflowFiles()) {
    const name = basename(path);
    const header = readFileSync(path, "utf8").split(/^jobs:/m)[0];
    if (name.startsWith("_")) {
      const onBlock = /^on:\s*\n((?:[ \t].*\n|\n)*)/m.exec(header);
      const firstLine = onBlock
        ? (onBlock[1].split("\n").find((line) => line.trim() !== "") ?? "").trim()
        : "";
      if (firstLine !== "workflow_call:") {
        fail(`${name}: a reusable module must open its \`on:\` with workflow_call (found "${firstLine || "no on:"}")`);
      } else if (/^\s{2}(push|pull_request|pull_request_target|issues|schedule|workflow_dispatch):\s*$/m.test(onBlock![1])) {
        fail(`${name}: a module must not declare its own event triggers`);
      } else ok(`${name}: workflow_call only`);
    } else if (!eventWorkflows.has(name)) {
      warn(`${name}: not in the known event-workflow list`);
    }
  }

  console.log("\n[9] Migrated event surface has no orphan triggers");
  for (const legacy of [
    "ai-fix-agent.yml",
    "ai-review.yml",
    "autopilot-issues.yml",
    "hub-audit.yml",
    "stale.yml",
  ]) {
    if (existsSync(join(WORKFLOW_DIR, legacy))) {
      fail(`${legacy}: still present after the hub migration (orphan trigger)`);
    } else ok(`${legacy}: removed (routed through quasar.yml)`);
  }
  for (const path of workflowFiles()) {
    const name = basename(path);
    if (name === "quasar.yml") continue;
    const body = readFileSync(path, "utf8");
    for (const cron of ["0 6 * * 1", "0 3 * * *", "0 9 * * *"]) {
      if (body.includes(cron)) fail(`${name}: duplicates a hub schedule (${cron}) outside the orchestrator`);
    }
  }
  for (const rel of [".github/workflows/quasar.yml", "scripts/router.mjs", "tests/router.test.mjs"]) {
    if (existsSync(join(ROOT, rel))) ok(`${rel} present`);
    else fail(`missing hub entry point: ${rel}`);
  }

  console.log("\n[10] Secrets are passed explicitly, never inherited");
  let inherited = false;
  for (const path of workflowFiles()) {
    const rel = path.slice(ROOT.length + 1);
    // Strip block scalars and comment lines first: a prose mention of the
    // forbidden key inside a comment or a run-script must not trip the rule.
    const effective = stripBlockScalars(readFileSync(path, "utf8"))
      .split("\n")
      .filter((line) => !/^\s*#/.test(line))
      .join("\n");
    if (/^\s*secrets:\s*inherit\s*$/m.test(effective)) {
      fail(`${rel}: secrets: inherit is forbidden`);
      inherited = true;
    }
  }
  if (!inherited) ok("no workflow uses secrets: inherit");
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
        if (detail.enforcement !== "active") fail(`ruleset "${detail.name}": branch protection is not active`);
        if ((detail.bypass_actors ?? []).length > 0) fail(`ruleset "${detail.name}": bypass actors are forbidden`);
        else ok(`ruleset "${detail.name}": no bypass actors`);
        if (!types.includes("update")) ok(`ruleset "${detail.name}": no update restriction blocking PR auto-merge`);
        else fail(`ruleset "${detail.name}": update restriction blocks ref updates with no bypass actors`);
        if (!types.includes("required_linear_history")) warn(`ruleset "${detail.name}": linear history not required`);
        if (!types.includes("required_signatures")) warn(`ruleset "${detail.name}": commit signatures not required`);
        const pr = (detail.rules ?? []).find((rule: { type: string }) => rule.type === "pull_request");
        const approvals = pr?.parameters?.required_approving_review_count;
        if (approvals === 0 && pr?.parameters?.required_reviewers?.length === 0 &&
            pr?.parameters?.require_code_owner_review !== true &&
            pr?.parameters?.require_last_push_approval !== true &&
            pr?.parameters?.required_review_thread_resolution !== true &&
            pr?.parameters?.require_extra_approval_for_unattributed_changes !== true) {
          ok(`ruleset "${detail.name}": approving reviews disabled`);
        } else fail(`ruleset "${detail.name}": human approving review gate is enabled or unspecified`);
        const checks = (detail.rules ?? []).find(
          (rule: { type: string }) => rule.type === "required_status_checks",
        );
        const contexts: string[] = (checks?.parameters?.required_status_checks ?? []).map(
          (entry: { context: string }) => entry.context,
        );
        const expectedRuleset = JSON.parse(readFileSync(join(ROOT, "docs/ai/ruleset-l3.json"), "utf8")) as Record<string, any>;
        const expectedChecks = expectedRuleset.rules?.find((rule: { type: string }) => rule.type === "required_status_checks");
        const expectedContexts: string[] = (expectedChecks?.parameters?.required_status_checks ?? [])
          .map((entry: { context: string }) => entry.context).sort();
        if (contexts.length > 0 && JSON.stringify([...contexts].sort()) === JSON.stringify(expectedContexts) &&
            checks?.parameters?.strict_required_status_checks_policy === true) {
          ok(`ruleset "${detail.name}": exact required checks are strict`);
        } else fail(`ruleset "${detail.name}": required checks are missing, mismatched, or not strict`);
        notes.push(`required checks: ${contexts.join(", ") || "none"}`);
      }
    }
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/branches/main/protection/required_pull_request_reviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "quasar-hub-audit",
      },
    });
    if (response.status === 404) {
      ok("classic branch protection has no required-review rule");
    } else if (!response.ok) {
      fail(`classic branch-protection review gate could not be verified: HTTP ${response.status}`);
    } else {
      const classic = await response.json() as Record<string, any>;
      const bypass = classic.bypass_pull_request_allowances ?? {};
      const noBypass = ["users", "teams", "apps"].every((key) => (bypass[key] ?? []).length === 0);
      if (classic.required_approving_review_count === 0 &&
          classic.require_code_owner_reviews !== true &&
          classic.require_last_push_approval !== true && noBypass) {
        ok("classic branch protection: no approving reviews or review bypasses");
      } else {
        fail("classic branch protection still requires approval or allows review bypass");
      }
    }
  } catch (error) {
    fail(`classic branch-protection review gate audit failed: ${(error as Error).message}`);
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
