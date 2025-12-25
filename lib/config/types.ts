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
   * @returns A promise that resolves to `true` if the config exists, `false` otherwise
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  has(): Promise<boolean>;

  /**
   * Retrieves a config value from storage.
   *
   * @returns A promise that resolves to the config value, or `null` if not found
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
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
   * @param value - The config value to save
   * @returns A promise that resolves when the value is saved
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  save(value: string): Promise<void>;

  /**
   * Removes a config value from storage.
   *
   * @returns A promise that resolves when the value is removed
   *
   * @throws {EnvironmentUnavailableError} When the underlying storage is unavailable
   * @throws {Error} When storage operations fail
   */
  remove(): Promise<void>;
}
