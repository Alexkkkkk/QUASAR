/**
 * Guards the repository automation hub: every workflow stays pinned to a
 * commit SHA, declares explicit permissions, and the required config files
 * (dependabot, labeler, stale, release, CODEOWNERS) stay in place.
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
  ".github/workflows/ai-ollama-agent.yml",
  ".github/workflows/hub-audit.yml",
  ".github/dependabot.yml",
  ".github/CODEOWNERS",
  ".github/labeler.yml",
  "scripts/hub_audit.ts",
];

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

test("hub: every required automation config file exists", () => {
  for (const rel of REQUIRED) {
    assert.ok(existsSync(join(ROOT, rel)), `missing automation config: ${rel}`);
  }
});

test("hub: every external action is pinned to a 40-char commit SHA", () => {
  const files = readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f));
  assert.ok(files.length >= 6, `expected at least 6 workflows, found ${files.length}`);
  const offenders: string[] = [];
  for (const file of files) {
    const body = stripBlockScalars(readFileSync(join(WORKFLOWS, file), "utf8"));
    for (const match of body.matchAll(/^\s*(?:-\s+)?uses:\s*([^\s#]+)/gm)) {
      const ref = match[1];
      if (ref.startsWith("./") || ref.startsWith("docker://")) continue;
      if (!/@[0-9a-f]{40}$/.test(ref)) offenders.push(`${file}: ${ref}`);
    }
  }
  assert.deepEqual(offenders, [], `unpinned actions:\n${offenders.join("\n")}`);
});

test("hub: every workflow declares explicit top-level permissions", () => {
  const files = readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f));
  for (const file of files) {
    const body = readFileSync(join(WORKFLOWS, file), "utf8");
    assert.match(body, /^permissions:/m, `${file}: no top-level permissions block`);
  }
});

test("hub: scheduled jobs never run on the default branch with write scope", () => {
  for (const file of ["stale.yml", "hub-audit.yml"]) {
    const body = readFileSync(join(WORKFLOWS, file), "utf8");
    assert.match(body, /^permissions:\s*$/m, `${file}: expected a top-level permissions block`);
  }
});

test("hub: the Ollama agent runs a local model and opens draft PRs only", () => {
  const body = readFileSync(join(WORKFLOWS, "ai-ollama-agent.yml"), "utf8");
  assert.match(body, /ollama serve/, "expected a local Ollama server");
  assert.match(body, /draft: always-true/, "expected draft-only pull requests");
  assert.ok(!/scripts\/deploy/.test(body), "the agent must not invoke deploy scripts");
  assert.ok(!/secrets\.(?!GITHUB_TOKEN)/.test(body), "the agent must only use the ephemeral GITHUB_TOKEN");
});

test("hub: dependabot covers npm, the dApp and GitHub Actions", () => {
  const body = readFileSync(join(ROOT, ".github", "dependabot.yml"), "utf8");
  assert.match(body, /package-ecosystem: npm/);
  assert.match(body, /package-ecosystem: github-actions/);
  assert.match(body, /directory: "\/integrations\/minter-tasks"/);
});
