import {
  closeSync,
  existsSync,
  fsyncSync,
  openSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";

export type FileUpdate = { path: string; content: string };
export type RenameFile = (from: string, to: string) => void;

type StagedUpdate = FileUpdate & {
  tempPath: string;
  backupPath: string | null;
  backedUp: boolean;
  installed: boolean;
};

/**
 * Stage every replacement before touching originals, then replace the batch.
 * If a filesystem operation fails, restore every original file before throwing.
 * Each staged file and backup is kept beside its target so rename stays on one filesystem.
 */
export function atomicReplaceFiles(updates: FileUpdate[], renameFile: RenameFile = renameSync): void {
  if (updates.length === 0) return;
  const seen = new Set<string>();
  const staged: StagedUpdate[] = [];

  try {
    for (const update of updates) {
      if (seen.has(update.path)) throw new Error(`duplicate atomic update target: ${update.path}`);
      seen.add(update.path);
      const suffix = `${process.pid}-${randomUUID()}`;
      const tempPath = `${update.path}.tmp-${suffix}`;
      const mode = existsSync(update.path) ? statSync(update.path).mode & 0o777 : 0o644;
      const fd = openSync(tempPath, "wx", mode);
      try {
        writeFileSync(fd, update.content, "utf8");
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
      staged.push({
        ...update,
        tempPath,
        backupPath: existsSync(update.path) ? `${update.path}.bak-${suffix}` : null,
        backedUp: false,
        installed: false,
      });
    }

    for (const update of staged) {
      if (update.backupPath) {
        renameFile(update.path, update.backupPath);
        update.backedUp = true;
      }
      renameFile(update.tempPath, update.path);
      update.installed = true;
    }
  } catch (error) {
    const rollbackErrors: unknown[] = [];
    for (const update of [...staged].reverse()) {
      try {
        if (update.installed && existsSync(update.path)) unlinkSync(update.path);
        if (update.backedUp && update.backupPath && existsSync(update.backupPath)) {
          renameFile(update.backupPath, update.path);
        }
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError);
      }
    }
    for (const update of staged) {
      try {
        if (existsSync(update.tempPath)) unlinkSync(update.tempPath);
        if (rollbackErrors.length === 0 && update.backupPath && existsSync(update.backupPath)) {
          unlinkSync(update.backupPath);
        }
      } catch (cleanupError) {
        rollbackErrors.push(cleanupError);
      }
    }
    if (rollbackErrors.length > 0) {
      throw new AggregateError([error, ...rollbackErrors], `atomic file update failed and rollback was incomplete (directory: ${dirname(staged[0].path)})`);
    }
    throw error;
  }

  for (const update of staged) {
    if (update.backupPath && existsSync(update.backupPath)) unlinkSync(update.backupPath);
  }
}
