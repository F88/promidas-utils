/**
 * @fileoverview Environment variable storage implementation for token management.
 * @module lib/token/storages/environment-storage
 */

import type { ReadOnlyTokenStorage } from '../types.js';

/**
 * Environment variable storage implementation.
 *
 * @description
 * Provides read-only token storage using environment variables (process.env).
 * All operations are asynchronous for API consistency.
 *
 * @remarks
 * This implementation only supports read operations (get and has).
 * Environment variables cannot be modified at runtime, so save and remove
 * operations are not available.
 * Placeholder values like 'your_token_here' are filtered out and treated as null.
 *
 * @example
 * ```typescript
 * const storage = new EnvironmentStorage('MY_TOKEN_ENV_KEY');
 * const token = await storage.get(); // Reads from process.env
 * ```
 */
export class EnvironmentStorage implements ReadOnlyTokenStorage {
  /**
   * Creates a new EnvironmentStorage instance.
   *
   * @param key - The token identifier key
   */
  constructor(private readonly key: string) {}

  /**
   * Checks if a token exists in environment variables.
   *
   * @returns A promise that resolves to `true` if a token exists, `false` otherwise
   */
  async has(): Promise<boolean> {
    const value = await this.get();
    return value !== null;
  }

  /**
   * Retrieves the token from environment variables.
   *
   * @returns A promise that resolves to the stored token, or `null` if not found or is a placeholder value
   *
   * @remarks
   * Returns `null` if `process.env` is not available, the key is not set,
   * or the value is `'your_token_here'`.
   */
  async get(): Promise<string | null> {
    if (typeof process === 'undefined' || !process.env) {
      return null;
    }
    const value = process.env[this.key];
    if (!value || value === 'your_token_here') {
      return null;
    }
    return value;
  }
}
