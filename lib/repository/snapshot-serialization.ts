/**
 * JSON serialization helpers for PROMIDAS repository snapshots.
 *
 * Thin, environment-agnostic wrappers around `JSON.stringify` / `JSON.parse`,
 * used internally by `promidas-utils/file-io` so that the on-disk format lives
 * in one place. They perform no I/O and use no environment-specific APIs, and
 * are not part of the public API.
 *
 * @module
 */

import type { SerializableSnapshot } from 'promidas/repository/types';

/** Options for {@link serializeSnapshotToJson}. */
export interface SerializeSnapshotJsonOptions {
  /** Pretty-print with 2-space indentation. Defaults to `false` (compact). */
  pretty?: boolean;
}

/**
 * Serializes a snapshot to a JSON string.
 *
 * @param snapshot - The snapshot to serialize.
 * @param options - Formatting options.
 * @returns The JSON string (compact by default, pretty when `options.pretty`).
 */
export function serializeSnapshotToJson(
  snapshot: SerializableSnapshot,
  options: SerializeSnapshotJsonOptions = {},
): string {
  return JSON.stringify(snapshot, null, options.pretty ? 2 : undefined);
}

/**
 * Parses a JSON string into a snapshot.
 *
 * Structural validation is intentionally left to PROMIDAS'
 * `setupSnapshotFromSerializedData()`; this only performs `JSON.parse`.
 *
 * @param text - The JSON string to parse.
 * @returns The parsed snapshot.
 * @throws {SyntaxError} When `text` is not valid JSON.
 */
export function parseSnapshotJson(text: string): SerializableSnapshot {
  return JSON.parse(text) as SerializableSnapshot;
}
