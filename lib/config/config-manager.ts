/**
 * @fileoverview Config manager factory for creating config storage instances.
 * @module lib/config/config-manager
 */

import { EnvironmentUnavailableError } from '../errors.js';

import { BrowserConfigStorage } from './storages/browser-config-storage.js';
import { EnvironmentConfigStorage } from './storages/environment-config-storage.js';
import type {
  ConfigIdentifier,
  ConfigStorage,
  ReadOnlyConfigStorage,
} from './types.js';

/**
 * Config manager factory.
 *
 * @description
 * Provides static factory methods for creating config storage instances across
 * supported backends. Environment variables are treated as read-only while
 * browser storage supports read-write operations.
 */
export class ConfigManager {
  private constructor() {
    throw new Error(
      'ConfigManager is a static class and cannot be instantiated',
    );
  }

  /**
   * Creates a config storage using local storage.
   *
   * @param key - The config identifier key
   * @returns A config storage instance using local storage
   *
   * @remarks
   * Configuration values persist even after the browser is closed.
   * They must be explicitly removed using the `remove()` method.
   * Throws EnvironmentUnavailableError when the Web Storage API is unavailable (for example, in non-browser environments).
   *
   * @throws {EnvironmentUnavailableError} When the Web Storage API is unavailable
   */
  static forLocalStorage(key: ConfigIdentifier): ConfigStorage {
    if (typeof localStorage === 'undefined') {
      throw new EnvironmentUnavailableError('Web Storage API is not available');
    }
    return new BrowserConfigStorage(localStorage, key);
  }

  /**
   * Creates a read-only config storage using environment variables.
   *
   * @param key - The config identifier key
   * @returns A read-only config storage instance using environment variables
   *
   * @remarks
   * Provides read-only access to configuration values stored in `process.env`.
   * Only `get()` and `has()` methods are available.
   * Throws EnvironmentUnavailableError when `process.env` is unavailable (for example, in browser environments).
   *
   * @throws {EnvironmentUnavailableError} When environment variables are not available
   */
  static forEnv(key: ConfigIdentifier): ReadOnlyConfigStorage {
    if (typeof process === 'undefined' || !process.env) {
      throw new EnvironmentUnavailableError(
        'Environment variables are not available',
      );
    }
    return new EnvironmentConfigStorage(key);
  }
}
