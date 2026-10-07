#!/usr/bin/env tsx
/**
 * Resolve every declared action tag to its commit SHA and rewrite the
 * `uses:` lines in the workflows.
 *
 *   tsx scripts/sync_action_pins.ts            # rewrite in place
 *   tsx scripts/sync_action_pins.ts --check    # fail if a file is out of date
 *
 * This exists because a hand-written pin can silently drift from the tag its
 * comment claims: `.github/workflows/ai-ollama-agent.yml` pinned
 * peter-evans/create-pull-request@5f6978fa... and annotated it `# v7`, while
 * the v7 tag points at 22a90890.... Resolving the tag with `git ls-remote` and
 * writing the SHA and the tag comment together makes that class of defect
 * impossible to reintroduce.
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, readdirSync, renameSync } from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

type PinFile = {
  schemaVersion: number;
  actions: Record<string, string>;
  workflowGlobs: string[];
};

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(HERE, "..");

function root(): string {
  const index = process.argv.indexOf("--root");
  return index >= 0 && process.argv[index + 1] ? resolve(process.argv[index + 1]) : DEFAULT_ROOT;
}

function resolveTag(repo: string, tag: string): string {
  const out = execFileSync("git", ["ls-remote", "--tags", `https://github.com/${repo}`], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  let peeled = "";
  let plain = "";
  for (const line of out.split("\n")) {
    const [sha, ref] = line.trim().split(/\s+/);
    if (!sha || !ref) continue;
    if (ref === `refs/tags/${tag}^{}`) peeled = sha;
    else if (ref === `refs/tags/${tag}`) plain = sha;
  }
  const sha = peeled || plain;
  if (!/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`could not resolve ${repo}@${tag}`);
  }
  return sha;
}

function listWorkflows(base: string, globs: string[]): string[] {
  const files = new Set<string>();
  for (const glob of globs) {
    const segments = glob.split("/");
    let dirs: string[] = [base];
    for (let i = 0; i < segments.length; i += 1) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      const next: string[] = [];
      for (const dir of dirs) {
        if (!existsSync(dir)) continue;
        if (segment === "*") {
          for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (isLast ? entry.isFile() : entry.isDirectory()) next.push(join(dir, entry.name));
          }
        } else if (segment.includes("*")) {
          const escaped = segment.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
          const pattern = escaped.replace(/\\\*/g, ".*");
          const re = new RegExp("^" + pattern + "$");
          for (const entry of readdirSync(dir, { withFileTypes: true })) {
            if (!re.test(entry.name)) continue;
            if (isLast ? entry.isFile() : entry.isDirectory()) next.push(join(dir, entry.name));
          }
        } else {
          const candidate = join(dir, segment);
          if (existsSync(candidate)) next.push(candidate);
        }
      }
      dirs = next;
    }
    for (const file of dirs) files.add(file);
  }
  return [...files].sort();
}

const USE_RE =
  /^(\s*(?:-\s+)?uses:\s*)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)@([^\s#]+)(\s*#\s*(.*))?$/gm;

function main(): void {
  const checkOnly = process.argv.includes("--check");
  const base = root();
  const pinsPath = join(base, "scripts", "action_pins.json");
  const pins = JSON.parse(readFileSync(pinsPath, "utf8")) as PinFile;

  const resolved: Record<string, { tag: string; sha: string }> = {};
  for (const [repo, tag] of Object.entries(pins.actions)) {
    const sha = resolveTag(repo, tag);
    resolved[repo] = { tag, sha };
    console.log(`resolved ${repo}@${tag} -> ${sha}`);
  }

  const lockBody =
    JSON.stringify(
      { schemaVersion: 1, generatedBy: "scripts/sync_action_pins.ts", actions: resolved },
      null,
      2,
    ) + "\n";
  const lockPath = join(base, "scripts", "action_pins.lock.json");

  const drift: string[] = [];
  const stale: string[] = [];

  if (existsSync(lockPath) && readFileSync(lockPath, "utf8") !== lockBody) {
    stale.push("scripts/action_pins.lock.json");
  }

  const files = listWorkflows(base, pins.workflowGlobs);
  if (files.length === 0) {
    console.error("no workflow files matched scripts/action_pins.json workflowGlobs");
    process.exitCode = 1;
    return;
  }

  for (const file of files) {
    const original = readFileSync(file, "utf8");
    const rewritten = original.replace(USE_RE, (full, prefix, repo, ref, _c, comment) => {
      const pin = resolved[repo];
      if (!pin) {
        drift.push(`${file}: ${repo} is not declared in scripts/action_pins.json`);
        return full;
      }
      const trimmed = String(comment ?? "").trim();
      if (trimmed && trimmed !== pin.tag) {
        drift.push(`${file}: ${repo} comment said "${trimmed}", now ${pin.tag}`);
      }
      if (!trimmed && !checkOnly) {
        drift.push(`${file}: ${repo} had no tag comment, now ${pin.tag}`);
      }
      return `${prefix}${repo}@${pin.sha} # ${pin.tag}`;
    });
    if (rewritten !== original) {
      if (checkOnly) stale.push(file.slice(base.length + 1));
      else writeFileSync(file, rewritten);
    }
  }

  if (checkOnly) {
    if (stale.length > 0) {
      console.error("\nOut-of-date action pins:");
      for (const file of stale) console.error(`  - ${file}`);
      console.error("\nRun `npm run pins:sync` and commit the result.");
      process.exitCode = 1;
      return;
    }
    console.log(`\nAll ${files.length} workflow files match scripts/action_pins.json.`);
    return;
  }

  // Write atomically via a temporary file + rename: the lock file was read
  // earlier in this run, so writing to the same path directly would race with
  // any concurrent modification (CodeQL js/file-system-race).
  const lockTmp = `${lockPath}.tmp-${process.pid}`;
  writeFileSync(lockTmp, lockBody);
  renameSync(lockTmp, lockPath);
  console.log(`\nRewrote ${files.length} workflow file(s); wrote ${Object.keys(resolved).length} pins to scripts/action_pins.lock.json`);
  if (drift.length > 0) {
    console.log("\nPins that were corrected:");
    for (const item of drift) console.log(`  - ${item}`);
  }
}

main();
