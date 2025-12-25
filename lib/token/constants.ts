/**
 * @fileoverview Token storage and environment variable key constants.
 * @module lib/token/constants
 */

/**
 * Predefined keys for token storage across different backends.
 *
 * @description
 * This object provides standard key names for token storage to ensure consistency
 * across the application. The same keys are used for:
 * - Browser storage (sessionStorage, localStorage)
 * - Environment variables (process.env)
 *
 * Key names follow UPPER_SNAKE_CASE convention, which is standard for environment
 * variables and works perfectly fine for browser storage as well.
 *
 * @remarks
 * Browser storage (localStorage/sessionStorage) has no restrictions on key naming
 * conventions, so we use UPPER_SNAKE_CASE to maintain consistency with environment
 * variables.
 *
 * @example
 * ```typescript
 * import { TOKEN_KEYS } from '@f88/promidas-utils/token';
 *
 * // Use with browser storage
 * localStorage.setItem(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN, token);
 *
 * // Use with environment variables
 * const token = process.env[TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN];
 * ```
 */
export const TOKEN_KEYS = {
  /**
   * Key for ProtoPedia API Version 2.0 bearer token.
   *
   * @remarks
   * Used across browser storage and environment variables.
   */
  PROTOPEDIA_API_V2_TOKEN: 'PROTOPEDIA_API_V2_TOKEN',
} as const;

/**
 * Type representing valid token identifiers.
 *
 * @remarks
 * This type is derived from the TOKEN_KEYS constant to ensure type safety when
 * working with token identifiers across different storage methods. Token identifiers
 * are the actual key values used in storage (e.g., 'PROTOPEDIA_API_V2_TOKEN').
 *
 * @example
 * ```typescript
 * import type { TokenIdentifier } from '@f88/promidas-utils/token';
 * import { TokenManager, TOKEN_KEYS } from '@f88/promidas-utils/token';
 *
 * const storage = TokenManager.forSessionStorage(
 *   TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN
 * );
 * ```
 */
export type TokenIdentifier = (typeof TOKEN_KEYS)[keyof typeof TOKEN_KEYS];
