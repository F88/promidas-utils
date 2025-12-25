/**
 * @fileoverview Browser storage implementation for token management.
 * @module lib/token/storages/browser-storage
 */

import type { TokenStorage } from '../../../types/token.js';
import type { TokenIdentifier } from '../constants.js';

/**
 * Browser storage implementation using Web Storage API.
 *
 * @description
 * Provides token storage using `sessionStorage` or `localStorage`.
 * All operations are asynchronous for API consistency.
 *
 * @example
 * ```typescript
 * import { TOKEN_KEYS } from '../constants.js';
 *
 * const storage = new BrowserStorage(localStorage, TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * await storage.save('my-token');
 * const token = await storage.get();
 * ```
 */
export class BrowserStorage implements TokenStorage {
  /**
   * Creates a new BrowserStorage instance.
   *
   * @param storage - The storage object (`sessionStorage` or `localStorage`)
   * @param key - The token identifier key
   */
  constructor(
    private readonly storage: Storage,
    private readonly key: TokenIdentifier,
  ) {}

  /**
   * Checks if a token exists in storage.
   *
   * @returns A promise that resolves to `true` if a token exists, `false` otherwise
   *
   * @throws {Error} If storage is not available
   */
  async has(): Promise<boolean> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    return this.storage.getItem(this.key) !== null;
  }

  /**
   * Retrieves the token from storage.
   *
   * @returns A promise that resolves to the stored token, or `null` if not found
   *
   * @throws {Error} If storage is not available
   */
  async get(): Promise<string | null> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    return this.storage.getItem(this.key);
  }

  /**
   * Saves a token to storage.
   *
   * @param token - The token string to save
   * @returns A promise that resolves when the token is saved
   *
   * @throws {Error} If storage is not available
   */
  async save(token: string): Promise<void> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    this.storage.setItem(this.key, token);
  }

  /**
   * Removes the token from storage.
   *
   * @returns A promise that resolves when the token is removed
   *
   * @throws {Error} If storage is not available
   */
  async remove(): Promise<void> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    this.storage.removeItem(this.key);
  }
}
