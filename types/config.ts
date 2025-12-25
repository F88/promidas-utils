/**
 * @fileoverview Core type definitions for configuration storage abstraction.
 * @module types/config
 *
 * @description
 * This module defines the core interfaces for configuration storage implementations.
 * It provides two main interfaces:
 * - `ReadOnlyConfigStorage`: For read-only storage backends
 * - `ConfigStorage`: For full read-write storage backends (extends ReadOnlyConfigStorage)
 *
 * Configuration storage differs from token storage in that it handles structured
 * objects with support for partial updates, while token storage handles simple strings.
 *
 * All operations are asynchronous to provide a consistent API across different
 * storage mechanisms (file systems, databases, browser storage, remote APIs, etc.).
 */

/**
 * Read-only configuration storage interface.
 *
 * @description
 * Base interface for configuration storage implementations that only support read operations.
 * Provides methods to retrieve and check for the existence of configurations without
 * the ability to modify them.
 *
 * @remarks
 * This interface is designed for storage backends that are inherently read-only
 * at runtime, such as:
 * - Configuration files loaded at startup
 * - Environment-based configurations
 * - Immutable settings from remote configuration services
 *
 * All methods are asynchronous for API consistency, even if the underlying
 * storage mechanism is synchronous.
 *
 * @template T - The configuration object type. Must be an object type.
 *
 * @example
 * ```typescript
 * interface AppConfig {
 *   theme: 'light' | 'dark';
 *   language: string;
 *   notifications: boolean;
 * }
 *
 * const storage: ReadOnlyConfigStorage<AppConfig> = new FileConfigStorage();
 * const config = await storage.get();
 * if (config) {
 *   console.log(config.theme);
 * }
 * ```
 */
export interface ReadOnlyConfigStorage<T extends object> {
  /**
   * Checks if a configuration exists.
   *
   * @returns A promise that resolves to true if configuration exists, false otherwise.
   */
  has(): Promise<boolean>;

  /**
   * Retrieves the configuration object.
   *
   * @returns A promise that resolves to the configuration object, or null if not found.
   */
  get(): Promise<T | null>;
}

/**
 * Configuration storage interface with read and write capabilities.
 *
 * @description
 * Full-featured interface for configuration storage implementations that support both
 * read and write operations. Extends ReadOnlyConfigStorage with save, update, and remove
 * capabilities.
 *
 * @remarks
 * This interface is implemented by storage backends that can persist and modify configurations:
 * - File systems (JSON, YAML, TOML files)
 * - Browser storage (localStorage with JSON serialization)
 * - Database systems
 * - Remote configuration services
 *
 * Inherits `get()` and `has()` methods from ReadOnlyConfigStorage and adds
 * `save()`, `update()`, and `remove()` for write operations.
 *
 * The key distinction from TokenStorage is the `update()` method, which allows
 * partial updates of the configuration object without needing to read, modify,
 * and save the entire object.
 *
 * All methods are asynchronous for consistency, even when the underlying
 * storage mechanism is synchronous.
 *
 * @template T - The configuration object type. Must be an object type.
 *
 * @example
 * ```typescript
 * interface AppConfig {
 *   theme: 'light' | 'dark';
 *   language: string;
 *   notifications: boolean;
 * }
 *
 * const storage: ConfigStorage<AppConfig> = new FileConfigStorage();
 *
 * // Save complete configuration
 * await storage.save({
 *   theme: 'dark',
 *   language: 'en',
 *   notifications: true
 * });
 *
 * // Partial update
 * await storage.update({ theme: 'light' });
 *
 * // Remove configuration
 * await storage.remove();
 * ```
 */
export interface ConfigStorage<
  T extends object,
> extends ReadOnlyConfigStorage<T> {
  /**
   * Saves the complete configuration object.
   * Overwrites the existing configuration.
   *
   * @param config - The configuration object to save.
   * @returns A promise that resolves when the configuration is saved.
   */
  save(config: T): Promise<void>;

  /**
   * Updates the configuration with partial data.
   * Merges the provided partial configuration with the existing one.
   *
   * @param partial - Partial configuration object with properties to update.
   * @returns A promise that resolves when the configuration is updated.
   *
   * @example
   * ```typescript
   * // Only update theme, leave other properties unchanged
   * await storage.update({ theme: 'dark' });
   * ```
   */
  update(partial: Partial<T>): Promise<void>;

  /**
   * Removes the configuration.
   *
   * @returns A promise that resolves when the configuration is removed.
   */
  remove(): Promise<void>;
}
