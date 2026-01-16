/**
 * @fileoverview Token management utilities for browser storage and environment variables.
 * @module lib/token
 *
 * @description
 * This module provides the TokenManager factory for creating token storage instances
 * with support for multiple storage backends.
 *
 * Use static factory methods to create instances:
 * - `TokenManager.forSessionStorage()` - Tokens cleared when browser tab/window closes (sync)
 * - `TokenManager.forLocalStorage()` - Tokens persist after browser closes (sync)
 * - `TokenManager.forEnv()` - Read from environment variables (sync, read-only)
 *
 * @example
 * Using session storage:
 * ```typescript
 * import { TokenManager, TOKEN_KEYS } from 'promidas-utils/token';
 *
 * const tokenStorage = TokenManager.forSessionStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * await tokenStorage.save('my-secret-token');
 *
 * if (await tokenStorage.has()) {
 *   const token = await tokenStorage.get();
 *   // Use the token
 * }
 *
 * await tokenStorage.remove();
 * ```
 *
 * @example
 * Using local storage:
 * ```typescript
 * import { TokenManager, TOKEN_KEYS } from 'promidas-utils/token';
 *
 * const tokenStorage = TokenManager.forLocalStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * await tokenStorage.save('persistent-token');
 * const token = await tokenStorage.get();
 * ```
 *
 * @example
 * Using environment variables:
 * ```typescript
 * import { TokenManager, TOKEN_KEYS } from 'promidas-utils/token';
 *
 * const tokenStorage = TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * const token = await tokenStorage.get();
 * ```
 */

export { TOKEN_KEYS, type TokenIdentifier } from './constants.js';
export { TokenManager } from './token-manager.js';
export { EnvironmentUnavailableError } from '../errors.js';
export type { ReadOnlyTokenStorage, TokenStorage } from './types.js';
