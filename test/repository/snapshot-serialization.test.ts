import type { NormalizedPrototype } from 'promidas/types';
import type { SerializableSnapshot } from 'promidas/repository/types';
import { describe, expect, it } from 'vitest';

import {
  parseSnapshotJson,
  serializeSnapshotToJson,
} from '../../lib/repository/snapshot-serialization.js';
import { createNormalizedPrototype } from '../helpers/create-normalized-prototype.js';

function makeSnapshot(
  prototypes: readonly NormalizedPrototype[],
): SerializableSnapshot {
  return {
    version: '1.0.0',
    serializedAt: '2026-01-01T00:00:00.000Z',
    prototypes,
  };
}

describe('serializeSnapshotToJson', () => {
  it('produces compact JSON by default', () => {
    const snapshot = makeSnapshot([createNormalizedPrototype({ id: 1 })]);
    const json = serializeSnapshotToJson(snapshot);
    expect(json).not.toContain('\n');
    expect(JSON.parse(json)).toEqual(snapshot);
  });

  it('produces pretty JSON when requested', () => {
    const snapshot = makeSnapshot([createNormalizedPrototype({ id: 1 })]);
    const json = serializeSnapshotToJson(snapshot, { pretty: true });
    expect(json).toContain('\n');
    expect(json).toContain('  ');
    expect(JSON.parse(json)).toEqual(snapshot);
  });
});

describe('parseSnapshotJson', () => {
  it('round-trips a serialized snapshot', () => {
    const snapshot = makeSnapshot([
      createNormalizedPrototype({ id: 1 }),
      createNormalizedPrototype({ id: 2 }),
    ]);
    expect(parseSnapshotJson(serializeSnapshotToJson(snapshot))).toEqual(
      snapshot,
    );
  });

  it('throws on invalid JSON', () => {
    expect(() => parseSnapshotJson('{ not json')).toThrow();
  });
});
