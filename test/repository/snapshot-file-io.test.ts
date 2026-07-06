import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createPromidasForLocal } from 'promidas';
import type {
  RepositorySnapshotFailure,
  SerializableSnapshot,
  SnapshotOperationResult,
} from 'promidas/repository/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  exportSnapshotToFile,
  importSnapshotFromFile,
} from '../../lib/repository/snapshot-file-io.js';
import { toLocalizedMessage } from '../../lib/repository/snapshot-operation-failure-utils.js';
import { createNormalizedPrototype } from '../helpers/create-normalized-prototype.js';
import { createPrototypeInMemoryStats } from '../helpers/create-prototype-In-memory-stats.js';

/** Builds a schema-valid snapshot with `count` distinct prototypes. */
function makeValidSnapshot(count: number): SerializableSnapshot {
  return {
    version: '1.0.0',
    serializedAt: '2026-01-01T00:00:00.000Z',
    prototypes: Array.from({ length: count }, (_, index) =>
      createNormalizedPrototype({
        id: index + 1,
        prototypeNm: `Prototype ${index + 1}`,
      }),
    ),
  };
}

/**
 * Builds a minimal SerializableSnapshot with `count` placeholder prototypes.
 * The prototype shape is irrelevant here: export only reads `prototypes.length`
 * and serializes to JSON, and the import stub does not validate structure.
 */
function makeSnapshot(count: number): SerializableSnapshot {
  const prototypes = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
  }));
  return {
    version: '1.0.0',
    serializedAt: '2026-01-01T00:00:00.000Z',
    prototypes,
  } as unknown as SerializableSnapshot;
}

/** Stub repository exposing only `getSerializableSnapshot`. */
function exportStub(snapshot: SerializableSnapshot) {
  return { getSerializableSnapshot: vi.fn(() => snapshot) };
}

/** Stub repository exposing only `setupSnapshotFromSerializedData`. */
function importStub(result: SnapshotOperationResult) {
  return {
    setupSnapshotFromSerializedData: vi.fn(
      (_data: SerializableSnapshot) => result,
    ),
  };
}

describe('snapshot-file-io', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'promidas-snap-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  describe('exportSnapshotToFile', () => {
    it('writes the snapshot and reports metadata', async () => {
      const filePath = join(dir, 'snapshot.json');
      const result = await exportSnapshotToFile(
        exportStub(makeSnapshot(3)),
        filePath,
      );

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.filePath).toBe(filePath);
      expect(result.prototypesExported).toBe(3);
      expect(result.bytesWritten).toBeGreaterThan(0);

      const written = await readFile(filePath, 'utf8');
      expect(JSON.parse(written).prototypes).toHaveLength(3);
    });

    it('produces compact JSON by default and pretty JSON on request', async () => {
      const compactPath = join(dir, 'compact.json');
      const prettyPath = join(dir, 'pretty.json');

      await exportSnapshotToFile(exportStub(makeSnapshot(1)), compactPath);
      await exportSnapshotToFile(exportStub(makeSnapshot(1)), prettyPath, {
        pretty: true,
      });

      const compact = await readFile(compactPath, 'utf8');
      const pretty = await readFile(prettyPath, 'utf8');
      expect(compact).not.toContain('\n');
      expect(pretty).toContain('\n');
      expect(pretty).toContain('  ');
    });

    it('creates missing parent directories', async () => {
      const filePath = join(dir, 'a', 'b', 'c', 'snapshot.json');
      const result = await exportSnapshotToFile(
        exportStub(makeSnapshot(1)),
        filePath,
      );

      expect(result.ok).toBe(true);
      await expect(readFile(filePath, 'utf8')).resolves.toContain('version');
    });

    it('overwrites an existing file', async () => {
      const filePath = join(dir, 'snapshot.json');
      await exportSnapshotToFile(exportStub(makeSnapshot(1)), filePath);
      await exportSnapshotToFile(exportStub(makeSnapshot(5)), filePath);

      const written = await readFile(filePath, 'utf8');
      expect(JSON.parse(written).prototypes).toHaveLength(5);
    });

    it('leaves no temporary file behind on success', async () => {
      const filePath = join(dir, 'snapshot.json');
      await exportSnapshotToFile(exportStub(makeSnapshot(1)), filePath);

      const entries = await readdir(dir);
      expect(entries).toEqual(['snapshot.json']);
    });

    it('returns SERIALIZE_FAILED when getSerializableSnapshot throws', async () => {
      const repository = {
        getSerializableSnapshot: vi.fn(() => {
          throw new Error('boom');
        }),
      };
      const filePath = join(dir, 'snapshot.json');
      const result = await exportSnapshotToFile(repository, filePath);

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('SERIALIZE_FAILED');
      expect(result.error.message).toBe('boom');
      expect(result.error.cause).toBeInstanceOf(Error);
    });

    it('stringifies non-Error throwables in SERIALIZE_FAILED', async () => {
      const repository = {
        getSerializableSnapshot: vi.fn(() => {
          throw 'plain failure';
        }),
      };
      const result = await exportSnapshotToFile(
        repository,
        join(dir, 's.json'),
      );

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('SERIALIZE_FAILED');
      expect(result.error.message).toBe('plain failure');
    });

    it('returns WRITE_FAILED with a code when the path is unwritable', async () => {
      // Make a regular file, then try to write beneath it so mkdir fails.
      const blocker = join(dir, 'blocker');
      await writeFile(blocker, 'x', 'utf8');
      const filePath = join(blocker, 'snapshot.json');

      const result = await exportSnapshotToFile(
        exportStub(makeSnapshot(1)),
        filePath,
      );

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('WRITE_FAILED');
      expect(result.error.code).toBeDefined();

      const entries = await readdir(dir);
      expect(entries).toEqual(['blocker']);
    });
  });

  describe('importSnapshotFromFile', () => {
    it('loads a snapshot and reports metadata', async () => {
      const filePath = join(dir, 'snapshot.json');
      await writeFile(filePath, JSON.stringify(makeSnapshot(4)), 'utf8');

      const repository = importStub({
        ok: true,
        stats: createPrototypeInMemoryStats({ size: 4 }),
      });
      const result = await importSnapshotFromFile(repository, filePath);

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.filePath).toBe(filePath);
      expect(result.prototypesLoaded).toBe(4);
      expect(result.bytesRead).toBeGreaterThan(0);
      expect(repository.setupSnapshotFromSerializedData).toHaveBeenCalledTimes(
        1,
      );
    });

    it('returns READ_FAILED with ENOENT for a missing file', async () => {
      const result = await importSnapshotFromFile(
        importStub({ ok: true, stats: createPrototypeInMemoryStats() }),
        join(dir, 'missing.json'),
      );

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('READ_FAILED');
      expect(result.error.code).toBe('ENOENT');
    });

    it('returns PARSE_FAILED for malformed JSON', async () => {
      const filePath = join(dir, 'broken.json');
      await writeFile(filePath, '{ not valid json', 'utf8');

      const result = await importSnapshotFromFile(
        importStub({ ok: true, stats: createPrototypeInMemoryStats() }),
        filePath,
      );

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('PARSE_FAILED');
    });

    it('returns SETUP_FAILED and preserves the localizable failure', async () => {
      const filePath = join(dir, 'snapshot.json');
      await writeFile(filePath, JSON.stringify(makeSnapshot(1)), 'utf8');

      const failure: RepositorySnapshotFailure = {
        ok: false,
        origin: 'repository',
        kind: 'validation',
        code: 'REPOSITORY_VALIDATION_ERROR',
        message: 'invalid snapshot',
      };
      const result = await importSnapshotFromFile(
        importStub(failure),
        filePath,
      );

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('SETUP_FAILED');
      expect(result.error.snapshotFailure).toBe(failure);
      expect(
        toLocalizedMessage(result.error.snapshotFailure ?? null),
      ).toContain('データの検証に失敗しました');
    });

    it('returns SETUP_FAILED when the repository method throws', async () => {
      const filePath = join(dir, 'snapshot.json');
      await writeFile(filePath, JSON.stringify(makeSnapshot(1)), 'utf8');

      const repository = {
        setupSnapshotFromSerializedData: vi.fn(() => {
          throw new Error('unexpected repository failure');
        }),
      };
      const result = await importSnapshotFromFile(repository, filePath);

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.error.kind).toBe('SETUP_FAILED');
      expect(result.error.message).toBe('unexpected repository failure');
      expect(result.error.cause).toBeInstanceOf(Error);
      expect(result.error.snapshotFailure).toBeUndefined();
    });
  });

  describe('round-trip', () => {
    it('exports then imports the same JSON file', async () => {
      const filePath = join(dir, 'snapshot.json');
      const snapshot = makeSnapshot(2);

      const exportResult = await exportSnapshotToFile(
        exportStub(snapshot),
        filePath,
      );
      expect(exportResult.ok).toBe(true);

      const repository = importStub({
        ok: true,
        stats: createPrototypeInMemoryStats({ size: 2 }),
      });
      const importResult = await importSnapshotFromFile(repository, filePath);

      expect(importResult.ok).toBe(true);
      expect(repository.setupSnapshotFromSerializedData).toHaveBeenCalledWith(
        snapshot,
      );
    });
  });

  describe('integration with a real repository', () => {
    it('starts empty, then reflects imported data in stats and reads', async () => {
      const repository = createPromidasForLocal({
        protopediaApiToken: 'dummy-token',
        logLevel: 'warn',
      });

      // Before import: a freshly created repository holds no prototypes.
      expect(repository.getStats().size).toBe(0);

      const filePath = join(dir, 'valid.json');
      await writeFile(filePath, JSON.stringify(makeValidSnapshot(3)), 'utf8');

      const result = await importSnapshotFromFile(repository, filePath);
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.prototypesLoaded).toBe(3);

      // After import: the count changes and the data is queryable.
      expect(repository.getStats().size).toBe(3);
      const random = await repository.getRandomPrototypeFromSnapshot();
      expect(random).not.toBeNull();
      expect([1, 2, 3]).toContain(random?.id);
    });

    it('round-trips real data through export and re-import', async () => {
      const source = createPromidasForLocal({
        protopediaApiToken: 'dummy-token',
        logLevel: 'warn',
      });
      const seedPath = join(dir, 'seed.json');
      await writeFile(seedPath, JSON.stringify(makeValidSnapshot(2)), 'utf8');
      await importSnapshotFromFile(source, seedPath);

      const exportPath = join(dir, 'exported.json');
      const exportResult = await exportSnapshotToFile(source, exportPath);
      expect(exportResult.ok).toBe(true);

      const target = createPromidasForLocal({
        protopediaApiToken: 'dummy-token',
        logLevel: 'warn',
      });
      const importResult = await importSnapshotFromFile(target, exportPath);

      expect(importResult.ok).toBe(true);
      if (!importResult.ok) return;
      expect(importResult.prototypesLoaded).toBe(2);
      expect(target.getStats().size).toBe(2);
    });
  });
});
