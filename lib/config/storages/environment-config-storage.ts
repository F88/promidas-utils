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
  constructor(private readonly key: ConfigIdentifier) {}

  async has(): Promise<boolean> {
    const value = await this.get();
    return value !== null;
  }

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
