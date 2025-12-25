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
   */
  has(): Promise<boolean>;

  /**
   * Retrieves the token from storage.
   *
   * @returns A promise that resolves to the stored token, or `null` if not found
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
   */
  save(token: string): Promise<void>;

  /**
   * Removes the token from storage.
   *
   * @returns A promise that resolves when the token is removed
   */
  remove(): Promise<void>;
}

export type { TokenIdentifier };
