#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const DOMAIN = 'QUASAR-MIGRATION-V1';
const SCHEMA_VERSION = 1;

type AssetClass = 'qsr' | 'custody-ton' | 'lp' | 'farm-lp' | 'stake' | 'vesting' | 'referral' | 'pending-payout';
type RecordStatus = 'eligible' | 'excluded';

type SnapshotRecord = {
  id: string;
  assetClass: AssetClass;
  beneficiary: string;
  amount: string;
  status: RecordStatus;
  source: string;
  metadata?: Record<string, string>;
  exclusionReason?: string;
};

type InputDocument = {
  network: string;
  oldMaster: string;
  snapshotBlock: string;
  snapshotTimestamp: string;
  records: SnapshotRecord[];
  declaredTotals?: Record<string, string>;
};

type OutputDocument = InputDocument & {
  schemaVersion: number;
  domain: string;
  snapshotHash: string;
  merkleRoot: string;
  totals: Record<string, { eligible: string; excluded: string; records: number }>;
  leaves: Array<{ id: string; hash: string }>;
};

function fail(message: string): never {
  throw new Error(`migration snapshot: ${message}`);
}

function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) fail(`${field} must be a non-empty string`);
}

function amount(value: unknown, field: string): bigint {
  assertString(value, field);
  if (!/^(0|[1-9][0-9]*)$/.test(value)) fail(`${field} must be an unsigned base-unit integer`);
  return BigInt(value);
}

function canonical(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value)) fail('floating point or unsafe numbers are forbidden in canonical data');
    return String(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`).join(',')}}`;
  }
  fail('unsupported value in canonical data');
}

function sha256(input: string): string {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function validate(input: InputDocument): void {
  assertString(input.network, 'network');
  assertString(input.oldMaster, 'oldMaster');
  assertString(input.snapshotBlock, 'snapshotBlock');
  assertString(input.snapshotTimestamp, 'snapshotTimestamp');
  if (!Array.isArray(input.records) || input.records.length === 0) fail('records must be a non-empty array');

  const ids = new Set<string>();
  for (const [index, record] of input.records.entries()) {
    assertString(record.id, `records[${index}].id`);
    if (ids.has(record.id)) fail(`duplicate record id: ${record.id}`);
    ids.add(record.id);
    if (!['qsr', 'custody-ton', 'lp', 'farm-lp', 'stake', 'vesting', 'referral', 'pending-payout'].includes(record.assetClass)) {
      fail(`records[${index}].assetClass is unsupported`);
    }
    if (record.status !== 'eligible' && record.status !== 'excluded') fail(`records[${index}].status is invalid`);
    assertString(record.beneficiary, `records[${index}].beneficiary`);
    assertString(record.source, `records[${index}].source`);
    amount(record.amount, `records[${index}].amount`);
    if (record.status === 'excluded') assertString(record.exclusionReason, `records[${index}].exclusionReason`);
  }
}

function totals(records: SnapshotRecord[]): Record<string, { eligible: string; excluded: string; records: number }> {
  const result: Record<string, { eligible: bigint; excluded: bigint; records: number }> = {};
  for (const record of records) {
    const current = result[record.assetClass] ?? { eligible: 0n, excluded: 0n, records: 0 };
    current[record.status] += amount(record.amount, `${record.id}.amount`);
    current.records += 1;
    result[record.assetClass] = current;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, {
    eligible: value.eligible.toString(),
    excluded: value.excluded.toString(),
    records: value.records,
  }]));
}

function leaf(record: SnapshotRecord): string {
  const normalized = {
    domain: DOMAIN,
    schemaVersion: SCHEMA_VERSION,
    id: record.id,
    assetClass: record.assetClass,
    beneficiary: record.beneficiary,
    amount: record.amount,
    status: record.status,
    source: record.source,
    metadata: record.metadata ?? {},
    exclusionReason: record.exclusionReason ?? null,
  };
  return sha256(canonical(normalized));
}

function merkleRoot(leaves: string[]): string {
  if (leaves.length === 0) fail('cannot build a Merkle root from zero leaves');
  let level = [...leaves].sort();
  while (level.length > 1) {
    const next: string[] = [];
    for (let index = 0; index < level.length; index += 2) {
      const left = level[index];
      const right = level[index + 1] ?? left;
      next.push(sha256(`${DOMAIN}:node:${left}:${right}`));
    }
    level = next.sort();
  }
  return level[0];
}

function build(input: InputDocument): OutputDocument {
  validate(input);
  const recordTotals = totals(input.records);
  for (const [assetClass, declared] of Object.entries(input.declaredTotals ?? {})) {
    const expected = amount(declared, `declaredTotals.${assetClass}`);
    const actual = BigInt(recordTotals[assetClass]?.eligible ?? '0');
    if (actual !== expected) fail(`eligible total mismatch for ${assetClass}: expected ${expected}, got ${actual}`);
  }
  const leaves = input.records.map((record) => ({ id: record.id, hash: leaf(record) })).sort((a, b) => a.id.localeCompare(b.id));
  const payload = { domain: DOMAIN, schemaVersion: SCHEMA_VERSION, network: input.network, oldMaster: input.oldMaster, snapshotBlock: input.snapshotBlock, snapshotTimestamp: input.snapshotTimestamp, records: input.records, declaredTotals: input.declaredTotals ?? {} };
  return {
    ...input,
    schemaVersion: SCHEMA_VERSION,
    domain: DOMAIN,
    snapshotHash: sha256(canonical(payload)),
    merkleRoot: merkleRoot(leaves.map(({ hash }) => hash)),
    totals: recordTotals,
    leaves,
  };
}

function main(): void {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) fail('usage: tsx scripts/migration_snapshot.ts <input.json> <output.json>');
  const input = JSON.parse(readFileSync(inputPath, 'utf8')) as InputDocument;
  const output = build(input);
  writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ snapshotHash: output.snapshotHash, merkleRoot: output.merkleRoot, totals: output.totals }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) main();

export { build, canonical, merkleRoot, sha256 };
