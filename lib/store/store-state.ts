/**
 * @fileoverview Utility functions for determining store state.
 * @module lib/store/store-state
 */

import type { PrototypeInMemoryStats } from 'promidas';

import type { StoreState } from './types.js';

/**
 * Determines the current state of the store based on the provided statistics.
 *
 * @param stats - The prototype in-memory statistics object, or null if not available
 * @returns The current store state: 'not-stored', 'stored', or 'expired'
 *
 * @remarks
 * The function evaluates the store state based on the following logic:
 * - Returns `'not-stored'` if stats is null or cachedAt is null
 * - Returns `'expired'` if the data is expired
 * - Returns `'stored'` if the data is valid and not expired
 *
 * @example
 * ```typescript
 * const state = getStoreState(stats);
 * if (state === 'expired') {
 *   // Refresh the data
 * }
 * ```
 */
export function getStoreState(
  stats: PrototypeInMemoryStats | null,
): StoreState {
  const notStored = !stats || stats.cachedAt === null;
  if (notStored) {
    return 'not-stored';
  }
  return stats.isExpired ? 'expired' : 'stored';
}
