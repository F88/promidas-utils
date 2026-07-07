/**
 * Node.js file I/O utilities for PROMIDAS repository snapshots.
 *
 * PROMIDAS provides platform-agnostic serialization
 * (`getSerializableSnapshot()` / `setupSnapshotFromSerializedData()`) but leaves
 * the actual file I/O to the caller. This module supplies thin Node.js wrappers
 * that add error classification, atomic writes, and automatic directory creation.
 *
 * @packageDocumentation
 */

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import type { ProtopediaInMemoryRepository } from 'promidas/repository';
import type {
  SerializableSnapshot,
  SnapshotOperationResult,
} from 'promidas/repository/types';

import {
  parseSnapshotJson,
  serializeSnapshotToJson,
} from '../repository/snapshot-serialization.js';

import type {
  ExportSnapshotOptions,
  FileExportResult,
  FileImportResult,
} from './types.js';

/**
 * Normalizes an unknown thrown value into a human-readable message.
 *
 * @param error - The value thrown by a `try` block.
 * @returns The error's message, or its `String()` form when it is not an `Error`.
 */
function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Builds a `{ code }` fragment from a filesystem error, omitting the property
 * entirely when no code is available (required by `exactOptionalPropertyTypes`).
 *
 * @param error - The value thrown by a filesystem operation.
 * @returns An object with `code` when present, otherwise an empty object.
 */
function errorCodeFragment(error: unknown): { code?: string } {
  const code = (error as NodeJS.ErrnoException | null)?.code;
  /* c8 ignore start -- filesystem errors always carry a code; defensive guard */
  if (code === undefined) {
    return {};
  }
  /* c8 ignore stop */
  return { code };
}

/**
 * Exports a repository's snapshot to a JSON file.
 *
 * The snapshot is obtained via `repository.getSerializableSnapshot()`, serialized
 * to JSON, and written atomically: it is first written to a unique temporary file
 * in the same directory and then renamed onto {@link filePath}. Missing parent
 * directories are created automatically. This function never throws; all failures
 * are returned as a {@link FileExportResult} with `ok: false`.
 *
 * @param repository - A repository exposing `getSerializableSnapshot()`.
 * @param filePath - Destination path for the JSON file.
 * @param options - Optional serialization options (e.g. `pretty`).
 * @returns The export result, discriminated by `ok`.
 *
 * @example
 * ```typescript
 * const result = await exportSnapshotToFile(repository, './data/snapshot.json', {
 *   pretty: true,
 * });
 * if (result.ok) {
 *   console.log(`Wrote ${result.prototypesExported} prototypes`);
 * }
 * ```
 */
export async function exportSnapshotToFile(
  repository: Pick<ProtopediaInMemoryRepository, 'getSerializableSnapshot'>,
  filePath: string,
  options?: ExportSnapshotOptions,
): Promise<FileExportResult> {
  let json: string;
  let prototypesExported: number;
  try {
    const snapshot = repository.getSerializableSnapshot();
    prototypesExported = snapshot.prototypes.length;
    json = serializeSnapshotToJson(snapshot, {
      ...(options?.pretty !== undefined && { pretty: options.pretty }),
    });
  } catch (error) {
    return {
      ok: false,
      filePath,
      error: {
        kind: 'SERIALIZE_FAILED',
        message: toMessage(error),
        cause: error,
      },
    };
  }

  const bytesWritten = Buffer.byteLength(json, 'utf8');
  const tempPath = `${filePath}.${randomUUID()}.tmp`;
  try {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(tempPath, json, 'utf8');
    await rename(tempPath, filePath);
  } catch (error) {
    // Best-effort cleanup of the temporary file; ignore removal errors.
    await rm(tempPath, { force: true }).catch(() => {});
    return {
      ok: false,
      filePath,
      error: {
        kind: 'WRITE_FAILED',
        message: toMessage(error),
        ...errorCodeFragment(error),
        cause: error,
      },
    };
  }

  return { ok: true, filePath, bytesWritten, prototypesExported };
}

/**
 * Imports a snapshot from a JSON file into a repository.
 *
 * The file is read, parsed as JSON, and passed to
 * `repository.setupSnapshotFromSerializedData()`, which validates the data. This
 * function never throws; all failures are returned as a {@link FileImportResult}
 * with `ok: false`. When PROMIDAS rejects the data, the original failure is
 * preserved in `error.snapshotFailure` so callers may localize it via
 * `toLocalizedMessage()`.
 *
 * @param repository - A repository exposing `setupSnapshotFromSerializedData()`.
 * @param filePath - Path of the JSON file to import.
 * @returns The import result, discriminated by `ok`.
 *
 * @example
 * ```typescript
 * const result = await importSnapshotFromFile(repository, './data/snapshot.json');
 * if (result.ok) {
 *   console.log(`Loaded ${result.prototypesLoaded} prototypes`);
 * }
 * ```
 */
export async function importSnapshotFromFile(
  repository: Pick<
    ProtopediaInMemoryRepository,
    'setupSnapshotFromSerializedData'
  >,
  filePath: string,
): Promise<FileImportResult> {
  let content: string;
  try {
    content = await readFile(filePath, 'utf8');
  } catch (error) {
    return {
      ok: false,
      filePath,
      error: {
        kind: 'READ_FAILED',
        message: toMessage(error),
        ...errorCodeFragment(error),
        cause: error,
      },
    };
  }

  const bytesRead = Buffer.byteLength(content, 'utf8');

  let data: SerializableSnapshot;
  try {
    // Structural validation is delegated to PROMIDAS' validateSerializableSnapshot.
    data = parseSnapshotJson(content);
  } catch (error) {
    return {
      ok: false,
      filePath,
      error: {
        kind: 'PARSE_FAILED',
        message: toMessage(error),
        cause: error,
      },
    };
  }

  // `repository` may be any object satisfying the Pick type, so guard the call
  // to uphold this function's "never throws" contract even if a custom
  // implementation throws. PROMIDAS' own repository is documented never to throw.
  let result: SnapshotOperationResult;
  try {
    result = repository.setupSnapshotFromSerializedData(data);
  } catch (error) {
    return {
      ok: false,
      filePath,
      error: {
        kind: 'SETUP_FAILED',
        message: toMessage(error),
        cause: error,
      },
    };
  }

  if (!result.ok) {
    return {
      ok: false,
      filePath,
      error: {
        kind: 'SETUP_FAILED',
        message: result.message,
        snapshotFailure: result,
      },
    };
  }

  return {
    ok: true,
    filePath,
    bytesRead,
    prototypesLoaded: result.stats.size,
  };
}
