/**
 * @fileoverview Browser storage implementation for token management.
 * @module lib/token/storages/browser-token-storage
 */

import { EnvironmentUnavailableError } from '../../errors.js';
import type { TokenIdentifier, TokenStorage } from '../types.js';

/**
 * Browser token storage implementation using Web Storage API.
 *
 * @description
 * Provides token storage using `sessionStorage` or `localStorage`.
 * All operations are asynchronous for API consistency.
 *
 * @example
 * ```typescript
 * import { TOKEN_KEYS } from '../constants.js';
 *
 * const storage = new BrowserTokenStorage(localStorage, TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * await storage.save('my-token');
 * const token = await storage.get();
 * ```
 */
export class BrowserTokenStorage implements TokenStorage {
  /**
   * Creates a new BrowserTokenStorage instance.
   *
   * @param storage - The storage object (`sessionStorage` or `localStorage`)
   * @param key - The token identifier key
   */
  constructor(
    private readonly storage: Storage,
    private readonly key: TokenIdentifier,
  ) {}

  private ensureStorageAvailable(): void {
    if (typeof this.storage === 'undefined') {
      throw new EnvironmentUnavailableError('Web Storage API is not available');
    }
  }

  /**
   * Checks if a token exists in storage.
   *
   * @returns A promise that resolves to `true` if a token exists, `false` otherwise
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   * @throws {DOMException} When storage operations fail (e.g., quota exceeded, security errors)
   * @throws {Error} When other unexpected errors occur
   */
  async has(): Promise<boolean> {
    this.ensureStorageAvailable();
    return this.storage.getItem(this.key) !== null;
  }

  /**
   * Retrieves the token from storage.
   *
   * @returns A promise that resolves to the stored token, or `null` if not found
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   * @throws {DOMException} When storage operations fail (e.g., quota exceeded, security errors)
   * @throws {Error} When other unexpected errors occur
   */
  async get(): Promise<string | null> {
    this.ensureStorageAvailable();
    return this.storage.getItem(this.key);
  }

  /**
   * Saves a token to storage.
   *
   * @param token - The token string to save
   * @returns A promise that resolves when the token is saved
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   * @throws {DOMException} When storage operations fail (e.g., quota exceeded, security errors)
   * @throws {Error} When other unexpected errors occur
   */
  async save(token: string): Promise<void> {
    this.ensureStorageAvailable();
    this.storage.setItem(this.key, token);
  }

  /**
   * Removes the token from storage.
   *
   * @returns A promise that resolves when the token is removed
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   * @throws {DOMException} When storage operations fail (e.g., quota exceeded, security errors)
   * @throws {Error} When other unexpected errors occur
   */
  async remove(): Promise<void> {
    this.ensureStorageAvailable();
    this.storage.removeItem(this.key);
  }
}
