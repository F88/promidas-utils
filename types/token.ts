/**
 * @fileoverview Core type definitions for token storage abstraction.
 * @module types/token
 *
 * @description
 * This module defines the core interfaces for token storage implementations.
 * It provides two main interfaces:
 * - `ReadOnlyTokenStorage`: For read-only storage backends (e.g., environment variables)
 * - `TokenStorage`: For full read-write storage backends (extends ReadOnlyTokenStorage)
 *
 * All operations are asynchronous to provide a consistent API across different
 * storage mechanisms (browser storage, environment variables, Credential Management API,
 * databases, file systems, etc.).
 */

export type { TokenIdentifier } from '../lib/token/constants.js';

/**
 * Read-only token storage interface.
 *
 * @description
 * Base interface for token storage implementations that only support read operations.
 * Provides methods to retrieve and check for the existence of tokens without
 * the ability to modify them.
 *
 * @remarks
 * This interface is designed for storage backends that are inherently read-only
 * at runtime, such as:
 * - Environment variables (process.env)
 * - Configuration files loaded at startup
 * - Immutable secrets from secret management services
 *
 * All methods are asynchronous for API consistency, even if the underlying
 * storage mechanism is synchronous.
 *
 * @example
 * Reading from environment variables:
 * ```typescript
 * import { TokenManager, TOKEN_ENV_KEYS } from '@f88/promidas-utils/token';
 *
 * const storage = TokenManager.forEnv(TOKEN_ENV_KEYS.PROTOPEDIA_API_V2_TOKEN);
 * const token = await storage.get();
 *
 * if (await storage.has()) {
 *   console.log('Token is available');
 * } else {
 *   console.log('Token not found or is a placeholder value');
 * }
 * ```
 */
export interface ReadOnlyTokenStorage {
  /**
   * Retrieves the token from storage.
   *
   * @returns A promise that resolves to the stored token, or null if not found
   *
   * @remarks
   * Returns null if the token does not exist or is not accessible.
   * Some implementations may also filter out placeholder values.
   */
  get(): Promise<string | null>;

  /**
   * Checks if a token exists in storage.
   *
   * @returns A promise that resolves to true if a token exists, false otherwise
   *
   * @remarks
   * This is typically implemented by calling get() and checking for null,
   * but storage backends may provide optimized implementations.
   */
  has(): Promise<boolean>;
}

/**
 * Token storage interface with read and write capabilities.
 *
 * @description
 * Full-featured interface for token storage implementations that support both
 * read and write operations. Extends ReadOnlyTokenStorage with save and remove
 * capabilities.
 *
 * @remarks
 * This interface is implemented by storage backends that can persist and modify tokens:
 * - Browser storage (sessionStorage, localStorage)
 * - Credential Management API
 * - Database systems
 * - File systems
 * - Remote secret storage services
 *
 * Inherits `get()` and `has()` methods from ReadOnlyTokenStorage and adds
 * `save()` and `remove()` for write operations.
 *
 * All methods are asynchronous for consistency, even when the underlying
 * storage mechanism is synchronous.
 *
 * @example
 * Using with browser storage:
 * ```typescript
 * import { TokenManager, TOKEN_STORAGE_KEYS } from '@f88/promidas-utils/token';
 *
 * const storage = TokenManager.forSessionStorage(
 *   TOKEN_STORAGE_KEYS.PROTOPEDIA_API_V2_TOKEN
 * );
 *
 * // Save a token
 * await storage.save('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *
 * // Check and retrieve
 * if (await storage.has()) {
 *   const token = await storage.get();
 *   console.log('Token retrieved:', token);
 * }
 *
 * // Remove when done
 * await storage.remove();
 * ```
 *
 * @example
 * Implementing a custom database storage:
 * ```typescript
 * class DatabaseTokenStorage implements TokenStorage {
 *   constructor(private db: Database) {}
 *
 *   async get(): Promise<string | null> {
 *     const result = await this.db.query(
 *       'SELECT token FROM tokens WHERE id = ?',
 *       [1]
 *     );
 *     return result.rows[0]?.token ?? null;
 *   }
 *
 *   async save(token: string): Promise<void> {
 *     await this.db.query(
 *       'INSERT INTO tokens (id, token) VALUES (?, ?) ' +
 *       'ON CONFLICT (id) DO UPDATE SET token = ?',
 *       [1, token, token]
 *     );
 *   }
 *
 *   async remove(): Promise<void> {
 *     await this.db.query('DELETE FROM tokens WHERE id = ?', [1]);
 *   }
 *
 *   async has(): Promise<boolean> {
 *     const token = await this.get();
 *     return token !== null;
 *   }
 * }
 * ```
 */
export interface TokenStorage extends ReadOnlyTokenStorage {
  /**
   * Saves a token to storage.
   *
   * @param token - The token string to save
   * @returns A promise that resolves when the token is saved
   *
   * @remarks
   * If a token already exists, it will be overwritten.
   * The token should be a valid string; empty strings may be rejected
   * by some implementations.
   */
  save(token: string): Promise<void>;

  /**
   * Removes the token from storage.
   *
   * @returns A promise that resolves when the token is removed
   *
   * @remarks
   * After removal, get() should return null and has() should return false.
   * Calling remove() when no token exists should complete successfully
   * without throwing an error.
   */
  remove(): Promise<void>;
}
