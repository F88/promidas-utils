/**
 * @fileoverview Type definitions for store state management.
 * @module types/store
 */

/**
 * Represents the current state of stored data.
 *
 * @remarks
 * This type is used to track the lifecycle of cached data in the store.
 *
 * Possible values:
 * - `'not-stored'`: Data has not been stored yet or cache is not available
 * - `'stored'`: Data is currently stored and valid (not expired)
 * - `'expired'`: Data was stored but has expired and needs to be refreshed
 *
 * @example
 * ```typescript
 * const state: StoreState = 'stored';
 * ```
 */
export type StoreState = 'not-stored' | 'stored' | 'expired';
