/**
 * @fileoverview Browser storage implementation for config management.
 * @module lib/config/storages/browser-config-storage
 */

import { EnvironmentUnavailableError } from '../../errors.js';
import type { ConfigIdentifier, ConfigStorage } from '../types.js';

/**
 * Browser storage implementation using Web Storage API.
 *
 * @description
 * Provides config storage using `localStorage`.
 * All operations are asynchronous for API consistency.
 */
export class BrowserConfigStorage implements ConfigStorage {
  /**
   * Creates a new BrowserConfigStorage instance.
   *
   * @param storage - The storage object (`localStorage`)
   * @param key - The config identifier key
   */
  constructor(
    private readonly storage: Storage,
    private readonly key: ConfigIdentifier,
  ) {}

  private ensureStorageAvailable(): void {
    if (typeof this.storage === 'undefined') {
      throw new EnvironmentUnavailableError('Web Storage API is not available');
    }
  }

  /**
   * Checks if a configuration value exists in storage.
   *
   * @returns A promise that resolves to `true` if a value exists, `false` otherwise
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   */
  async has(): Promise<boolean> {
    this.ensureStorageAvailable();
    return this.storage.getItem(this.key) !== null;
  }

  /**
   * Retrieves the configuration value from storage.
   *
   * @returns A promise that resolves to the stored value, or `null` if not found
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   */
  async get(): Promise<string | null> {
    this.ensureStorageAvailable();
    return this.storage.getItem(this.key);
  }

  /**
   * Saves a configuration value to storage.
   *
   * @param value - The configuration value to save
   * @returns A promise that resolves when the value is saved
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   */
  async save(value: string): Promise<void> {
    this.ensureStorageAvailable();
    this.storage.setItem(this.key, value);
  }

  /**
   * Removes the configuration value from storage.
   *
   * @returns A promise that resolves when the value is removed
   *
   * @throws {EnvironmentUnavailableError} If storage is not available
   */
  async remove(): Promise<void> {
    this.ensureStorageAvailable();
    this.storage.removeItem(this.key);
  }
}
