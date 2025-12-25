/**
 * @fileoverview Environment variable storage implementation for config management.
 * @module lib/config/storages/environment-config-storage
 */

import type { ReadOnlyConfigStorage, ConfigIdentifier } from '../types.js';

/**
 * Environment variable storage implementation.
 *
 * @description
 * Provides read-only config storage using environment variables (process.env).
 * All operations are asynchronous for API consistency.
 */
export class EnvironmentConfigStorage implements ReadOnlyConfigStorage {
  /**
   * Creates a new environment-based config storage.
   *
   * @param key - Identifier of the environment variable to read the config value from
   */
  constructor(private readonly key: ConfigIdentifier) {}

  /**
   * Checks if a config value exists in environment variables.
   *
   * @returns A promise that resolves to `true` if the environment variable exists, `false` otherwise
   */
  async has(): Promise<boolean> {
    const value = await this.get();
    return value !== null;
  }

  /**
   * Retrieves a config value from environment variables.
   *
   * @returns A promise that resolves to the environment variable value, or `null` if not found
   */
  async get(): Promise<string | null> {
    if (typeof process === 'undefined' || !process.env) {
      return null;
    }
    const value = process.env[this.key];
    if (typeof value === 'undefined') {
      return null;
    }
    return value;
  }
}
