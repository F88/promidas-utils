/**
 * Node.js file I/O for PROMIDAS repository snapshots.
 *
 * These helpers use Node.js APIs (`node:fs`, `node:path`, `node:crypto`) and
 * therefore cannot run in a browser. They live in this dedicated **Node-only**
 * `promidas-utils/file-io` subpath, kept physically separate from the
 * browser-safe `promidas-utils/repository` barrel so that Node built-ins are
 * never pulled into a browser bundle.
 *
 * Browser code should instead obtain the serialized snapshot on its own (fetch,
 * `<input type="file">`, IndexedDB, …) and call PROMIDAS' platform-agnostic
 * `repository.setupSnapshotFromSerializedData(data)` directly.
 *
 * @module
 */

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
