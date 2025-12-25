/**
 * @fileoverview Central export point for all type definitions.
 * @module types
 *
 * @remarks
 * This module provides a unified interface for importing all type definitions
 * used throughout the application. Import types from this module rather than
 * from individual files to maintain better encapsulation.
 *
 * @example
 * ```typescript
 * import type { StoreState } from './types';
 * ```
 */

/**
 * Re-exports configuration-related type definitions.
 * @see {@link ReadOnlyConfigStorage} for read-only configuration storage interface
 * @see {@link ConfigStorage} for configuration storage interface
 */
export type { ConfigStorage, ReadOnlyConfigStorage } from './config.js';

/**
 * Re-exports store-related type definitions.
 * @see {@link StoreState} for store state types
 */
export type { StoreState } from './store.js';

/**
 * Re-exports token-related type definitions.
 * @see {@link ReadOnlyTokenStorage} for read-only token storage interface
 * @see {@link TokenIdentifier} for token identifier types
 * @see {@link TokenStorage} for token storage interface
 */
export { TOKEN_ENV_KEYS, TOKEN_STORAGE_KEYS } from '../lib/token/constants.js';
export {
  type ReadOnlyTokenStorage,
  type TokenIdentifier,
  type TokenStorage,
} from './token.js';
