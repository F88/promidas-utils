/**
 * @fileoverview Common errors for the library.
 * @module lib/errors
 */

/**
 * Error thrown when a required environment (storage API, process.env, etc.) is not available.
 *
 * @description
 * This error is thrown by factory methods in TokenManager and ConfigManager
 * when the required storage backend is not available in the current environment.
 *
 * @example
 * ```typescript
 * // Throws when localStorage is not available (e.g., in Node.js)
 * TokenManager.forLocalStorage(key);
 *
 * // Throws when process.env is not available (e.g., in browser)
 * ConfigManager.forEnv(key);
 * ```
 */
export class EnvironmentUnavailableError extends Error {
  constructor(message = 'Required environment is not available') {
    super(message);
    this.name = 'EnvironmentUnavailableError';
  }
}
