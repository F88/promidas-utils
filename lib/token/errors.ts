/**
 * @fileoverview Custom errors for token management.
 * @module lib/token/errors
 */

/**
 * Error thrown when environment variables are not available.
 */
export class EnvironmentUnavailableError extends Error {
  constructor(message = 'Environment variables are not available') {
    super(message);
    this.name = 'EnvironmentUnavailableError';
  }
}
