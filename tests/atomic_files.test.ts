import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { atomicReplaceFiles } from "../scripts/atomic_files.js";

test("atomicReplaceFiles stages first and restores every original after a mid-batch rename failure", () => {
  const directory = mkdtempSync(join(tmpdir(), "quasar-atomic-files-"));
  const first = join(directory, "first.txt");
  const second = join(directory, "second.txt");
  const added = join(directory, "added.txt");
  writeFileSync(first, "old first\n");
  writeFileSync(second, "old second\n");
  let injected = false;
  const renameWithFailure = (from: string, to: string): void => {
    if (!injected && to === second && from.includes(".tmp-")) {
      injected = true;
      throw new Error("injected second-file commit failure");
    }
    renameSync(from, to);
  };

  try {
    assert.throws(
      () => atomicReplaceFiles(
        [
          { path: first, content: "new first\n" },
          { path: second, content: "new second\n" },
          { path: added, content: "new file\n" },
        ],
        renameWithFailure,
      ),
      /injected second-file commit failure/,
    );
    assert.equal(readFileSync(first, "utf8"), "old first\n");
    assert.equal(readFileSync(second, "utf8"), "old second\n");
    assert.equal(readdirSync(directory).some((name) => name.startsWith("added.txt")), false);
    assert.deepEqual(readdirSync(directory).sort(), ["first.txt", "second.txt"]);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
