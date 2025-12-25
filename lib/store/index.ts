/**
 * @fileoverview Store utilities for managing store state.
 * @module lib/store
 *
 * @description
 * This module provides utility functions for determining the state of a store
 * based on prototype in-memory statistics. It helps identify whether data is
 * stored, not stored, or expired.
 *
 * @example
 * ```typescript
 * import { getStoreState } from '@f88/promidas-utils/store';
 *
 * const state = getStoreState(stats);
 * if (state === 'expired') {
 *   // Refresh the data
 * } else if (state === 'stored') {
 *   // Use cached data
 * }
 * ```
 */

/**
 * Determines the current state of the store based on the provided statistics.
 *
 * @see {@link getStoreState} for detailed documentation
 */
export { getStoreState } from './store-state.js';
