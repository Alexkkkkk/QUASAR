import test from 'node:test';
import assert from 'node:assert/strict';
import { build, canonical, merkleRoot } from '../scripts/migration_snapshot.js';

type Input = Parameters<typeof build>[0];

const input: Input = {
  network: 'testnet',
  oldMaster: '0:test-master',
  snapshotBlock: '123456',
  snapshotTimestamp: '2026-10-25T00:00:00Z',
  records: [
    {
      id: 'holder:alice',
      assetClass: 'qsr',
      beneficiary: '0:alice',
      amount: '100',
      status: 'eligible',
      source: 'tx:1',
      metadata: { wallet: '0:wallet-alice' },
    },
    {
      id: 'holder:bob',
      assetClass: 'qsr',
      beneficiary: '0:bob',
      amount: '25',
      status: 'excluded',
      source: 'tx:2',
      exclusionReason: 'disputed record',
    },
    {
      id: 'stake:alice',
      assetClass: 'stake',
      beneficiary: '0:alice',
      amount: '7',
      status: 'eligible',
      source: 'getter:get_stake_info',
    },
  ],
  declaredTotals: { qsr: '100', stake: '7' },
};

test('migration snapshot is deterministic despite object key order', () => {
  const first = build(input);
  const reordered = build({
    ...input,
    records: input.records.map((record) => record.metadata
      ? { ...record, metadata: { ...record.metadata } }
      : { ...record }),
  });
  assert.equal(first.snapshotHash, reordered.snapshotHash);
  assert.equal(first.merkleRoot, reordered.merkleRoot);
  assert.deepEqual(first.totals, {
    qsr: { eligible: '100', excluded: '25', records: 2 },
    stake: { eligible: '7', excluded: '0', records: 1 },
  });
});

test('canonical form sorts object keys and forbids floating point values', () => {
  assert.equal(canonical({ b: 2, a: 1 }), '{"a":1,"b":2}');
  assert.throws(() => canonical({ amount: 1.5 }), /floating point or unsafe numbers/);
});

test('declared total mismatch fails closed', () => {
  assert.throws(() => build({ ...input, declaredTotals: { qsr: '101' } }), /eligible total mismatch for qsr/);
});

test('duplicate IDs and excluded records without reasons fail closed', () => {
  assert.throws(() => build({ ...input, records: [{ ...input.records[0], id: 'holder:bob' }, ...input.records] }), /duplicate record id/);
  assert.throws(() => build({ ...input, records: [{ ...input.records[0], status: 'excluded', exclusionReason: undefined }] }), /exclusionReason/);
});

test('Merkle root duplicates an odd leaf deterministically', () => {
  const two = merkleRoot(['a', 'b']);
  const three = merkleRoot(['a', 'b', 'c']);
  assert.notEqual(two, three);
  assert.equal(merkleRoot(['c', 'a', 'b']), three);
});
