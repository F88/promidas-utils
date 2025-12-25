/**
 * @fileoverview Config manager factory for creating config storage instances.
 * @module lib/config/config-manager
 */

import { EnvironmentUnavailableError } from '../token/errors.js';

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
   * @throws {EnvironmentUnavailableError} When environment variables are not available
   */
  static forEnv(key: ConfigIdentifier): ReadOnlyConfigStorage {
    if (typeof process === 'undefined' || !process.env) {
      throw new EnvironmentUnavailableError();
    }
    return new EnvironmentConfigStorage(key);
  }
}
