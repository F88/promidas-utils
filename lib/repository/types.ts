/**
 * @fileoverview Type definitions for repository snapshot file I/O.
 * @module lib/repository/types
 */

import type { SnapshotOperationFailure } from 'promidas/repository/types';

/**
 * Discriminates the stage at which a file I/O operation failed.
 *
 * @remarks
 * Node.js filesystem errors cannot be reliably distinguished across platforms,
 * so specific causes (permission denied, disk full, etc.) are not enumerated as
 * separate kinds. Inspect {@link FileIoError.code} for the underlying Node error
 * code (e.g. `'EACCES'`, `'ENOSPC'`) when finer classification is required.
 *
 * - `'SERIALIZE_FAILED'`: `getSerializableSnapshot()` or `JSON.stringify()` threw.
 * - `'WRITE_FAILED'`: `mkdir`/`writeFile`/`rename` threw during export.
 * - `'READ_FAILED'`: `readFile` threw during import (includes `ENOENT`).
 * - `'PARSE_FAILED'`: `JSON.parse()` threw during import.
 * - `'SETUP_FAILED'`: `setupSnapshotFromSerializedData()` returned `{ ok: false }`.
 */
export type FileIoErrorKind =
  | 'SERIALIZE_FAILED'
  | 'WRITE_FAILED'
  | 'READ_FAILED'
  | 'PARSE_FAILED'
  | 'SETUP_FAILED';

/**
 * Describes why a snapshot file I/O operation failed.
 *
 * @remarks
 * When `kind` is `'SETUP_FAILED'`, {@link FileIoError.snapshotFailure} holds the
 * original PROMIDAS failure, which can be passed to `toLocalizedMessage()` from
 * {@link module:lib/repository/snapshot-operation-failure-utils} for a localized
 * (Japanese) message.
 */
export type FileIoError = {
  /** Stage at which the operation failed. */
  readonly kind: FileIoErrorKind;
  /** Human-readable description of the failure. */
  readonly message: string;
  /** Node.js filesystem error code when available (e.g. `'ENOENT'`, `'EACCES'`). */
  readonly code?: string;
  /** The original thrown value, preserved for debugging. */
  readonly cause?: unknown;
  /** The underlying PROMIDAS failure. Present only when `kind` is `'SETUP_FAILED'`. */
  readonly snapshotFailure?: SnapshotOperationFailure;
};

/**
 * Result of a successful {@link module:lib/repository/snapshot-file-io.exportSnapshotToFile}.
 */
export type FileExportSuccess = {
  readonly ok: true;
  /** The path the snapshot was written to. */
  readonly filePath: string;
  /** Number of bytes written (UTF-8 byte length of the JSON). */
  readonly bytesWritten: number;
  /** Number of prototypes contained in the exported snapshot. */
  readonly prototypesExported: number;
};

/**
 * Result of a failed {@link module:lib/repository/snapshot-file-io.exportSnapshotToFile}.
 */
export type FileExportFailure = {
  readonly ok: false;
  /** The target path of the export attempt. */
  readonly filePath: string;
  /** Details of the failure. */
  readonly error: FileIoError;
};

/**
 * Discriminated union result of `exportSnapshotToFile`.
 */
export type FileExportResult = FileExportSuccess | FileExportFailure;

/**
 * Result of a successful {@link module:lib/repository/snapshot-file-io.importSnapshotFromFile}.
 */
export type FileImportSuccess = {
  readonly ok: true;
  /** The path the snapshot was read from. */
  readonly filePath: string;
  /** Number of bytes read (UTF-8 byte length of the file contents). */
  readonly bytesRead: number;
  /** Number of prototypes loaded into the repository. */
  readonly prototypesLoaded: number;
};

/**
 * Result of a failed {@link module:lib/repository/snapshot-file-io.importSnapshotFromFile}.
 */
export type FileImportFailure = {
  readonly ok: false;
  /** The source path of the import attempt. */
  readonly filePath: string;
  /** Details of the failure. */
  readonly error: FileIoError;
};

/**
 * Discriminated union result of `importSnapshotFromFile`.
 */
export type FileImportResult = FileImportSuccess | FileImportFailure;

/**
 * Options for {@link module:lib/repository/snapshot-file-io.exportSnapshotToFile}.
 */
export type ExportSnapshotOptions = {
  /** Pretty-print the JSON with 2-space indentation. Defaults to `false` (compact). */
  readonly pretty?: boolean;
};
