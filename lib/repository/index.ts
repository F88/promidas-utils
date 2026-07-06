/**
 * Repository utilities for PROMIDAS.
 *
 * This module provides utilities for working with PROMIDAS repositories,
 * including snapshot operation result handling.
 *
 * @module
 */

export {
  parseSnapshotOperationFailure,
  toLocalizedMessage,
  type ParsedSnapshotOperationFailure,
} from './snapshot-operation-failure-utils.js';

export {
  exportSnapshotToFile,
  importSnapshotFromFile,
} from './snapshot-file-io.js';

export type {
  ExportSnapshotOptions,
  FileExportFailure,
  FileExportResult,
  FileExportSuccess,
  FileImportFailure,
  FileImportResult,
  FileImportSuccess,
  FileIoError,
  FileIoErrorKind,
} from './types.js';
