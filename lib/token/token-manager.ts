/**
 * @fileoverview Token manager factory for creating token storage instances.
 * @module lib/token/token-manager
 */


import { TOKEN_KEYS, type TokenIdentifier } from './constants.js';
import { BrowserStorage } from './storages/browser-storage.js';
import { EnvironmentStorage } from './storages/environment-storage.js';
import type { ReadOnlyTokenStorage, TokenStorage } from './types.js';

/**
 * Token manager factory.
 *
 * @description
 * Provides static factory methods for creating token storage instances.
 * Supports multiple storage backends including browser storage (session/local)
 * and environment variables.
 *
 * @example
 * Using session storage:
 * ```typescript
 * const sessionToken = TokenManager.forSessionStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * await sessionToken.save('my-token');
 * const token = await sessionToken.get();
 * ```
 *
 * @example
 * Using local storage:
 * ```typescript
 * const localToken = TokenManager.forLocalStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * await localToken.save('persistent-token');
 * ```
 *
 * @example
 * Using environment variables (read-only):
 * ```typescript
 * const envToken = TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * const token = await envToken.get();
 * ```
 */
export class TokenManager {
  /**
   * Private constructor to prevent instantiation.
   * Use static factory methods instead.
   */
  private constructor() {
    throw new Error(
      'TokenManager is a static class and cannot be instantiated',
    );
  }

  /**
   * Creates a token storage using session storage.
   *
   * @param key - The token identifier key
   * @returns A token storage instance using session storage
   *
   * @remarks
   * Tokens are automatically cleared when the browser tab or window is closed.
   *
   * @example
   * ```typescript
   * const storage = TokenManager.forSessionStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
   * await storage.save('my-secret-token');
   * const token = await storage.get();
   * ```
   */
  static forSessionStorage(key: TokenIdentifier): TokenStorage {
    return new BrowserStorage(sessionStorage, key);
  }

  /**
   * Creates a token storage using local storage.
   *
   * @param key - The token identifier key
   * @returns A token storage instance using local storage
   *
   * @remarks
   * Tokens persist even after the browser is closed.
   * They must be explicitly removed using the `remove()` method.
   *
   * @example
   * ```typescript
   * const storage = TokenManager.forLocalStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
   * await storage.save('persistent-token');
   * const token = await storage.get();
   * ```
   */
  static forLocalStorage(key: TokenIdentifier): TokenStorage {
    return new BrowserStorage(localStorage, key);
  }

  /**
   * Creates a read-only token storage using environment variables.
   *
   * @param key - The token identifier key
   * @returns A read-only token storage instance using environment variables
   *
   * @remarks
   * Provides read-only access to tokens stored in `process.env`.
   * Only `get()` and `has()` methods are available.
   * Returns `null` for placeholder values like `'your_token_here'`.
   *
   * @example
   * ```typescript
   * const storage = TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
   * const token = await storage.get();
   * if (token) {
   *   // Use the token
   * }
   * ```
   */
  static forEnv(key: TokenIdentifier): ReadOnlyTokenStorage {
    return new EnvironmentStorage(key);
  }
}
