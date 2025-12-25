/**
 * @fileoverview Browser storage implementation for config management.
 * @module lib/config/storages/browser-config-storage
 */

import type { ConfigIdentifier, ConfigStorage } from '../types.js';

/**
 * Browser storage implementation using Web Storage API.
 *
 * @description
 * Provides config storage using `localStorage`.
 * All operations are asynchronous for API consistency.
 */
export class BrowserConfigStorage implements ConfigStorage {
  constructor(
    private readonly storage: Storage,
    private readonly key: ConfigIdentifier,
  ) {}

  async has(): Promise<boolean> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    return this.storage.getItem(this.key) !== null;
  }

  async get(): Promise<string | null> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    return this.storage.getItem(this.key);
  }

  async save(value: string): Promise<void> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    this.storage.setItem(this.key, value);
  }

  async remove(): Promise<void> {
    if (typeof this.storage === 'undefined') {
      throw new Error('Storage is not available');
    }
    this.storage.removeItem(this.key);
  }
}
