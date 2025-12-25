/**
 * @fileoverview Token-related type definitions local to the token module.
 * @module lib/token/types
 */

import type { TokenIdentifier } from './constants.js';

/**
 * Read-only token storage interface.
 *
 * @description
 * Base interface for token storage implementations that only support read operations.
 * Provides methods to retrieve and check for the existence of tokens without
 * the ability to modify them.
 */
export interface ReadOnlyTokenStorage {
  /**
   * Checks if a token exists in storage.
   *
   * @returns A promise that resolves to `true` if a token exists, `false` otherwise
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  has(): Promise<boolean>;

  /**
   * Retrieves the token from storage.
   *
   * @returns A promise that resolves to the stored token, or `null` if not found
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  get(): Promise<string | null>;
}

/**
 * Token storage interface with read and write capabilities.
 */
export interface TokenStorage extends ReadOnlyTokenStorage {
  /**
   * Saves a token to storage.
   *
   * @param token - The token string to save
   * @returns A promise that resolves when the token is saved
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  save(token: string): Promise<void>;

  /**
   * Removes the token from storage.
   *
   * @returns A promise that resolves when the token is removed
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  remove(): Promise<void>;
}

export type { TokenIdentifier };
