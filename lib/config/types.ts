/**
 * @fileoverview Config-related type definitions.
 * @module lib/config/types
 */

/**
 * Identifier used for config entries across storage backends.
 *
 * @remarks
 * Config identifiers correspond to storage keys (e.g., environment variable
 * names or Web Storage keys). They are defined as strings to allow flexible
 * naming without enforcing a fixed key set.
 */
export type ConfigIdentifier = string;

/**
 * Read-only config storage interface.
 */
export interface ReadOnlyConfigStorage {
  /**
   * Checks if a config entry exists in storage.
   *
   * @throws {Error} When the underlying storage is unavailable
   */
  has(): Promise<boolean>;

  /**
   * Retrieves a config value from storage.
   *
   * @throws {Error} When the underlying storage is unavailable
   */
  get(): Promise<string | null>;
}

/**
 * Config storage interface with write capabilities.
 */
export interface ConfigStorage extends ReadOnlyConfigStorage {
  /**
   * Saves a config value to storage.
   *
   * @throws {Error} When the underlying storage is unavailable
   */
  save(value: string): Promise<void>;

  /**
   * Removes a config value from storage.
   *
   * @throws {Error} When the underlying storage is unavailable
   */
  remove(): Promise<void>;
}
