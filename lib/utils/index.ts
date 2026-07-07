/**
 * General-purpose utilities for PROMIDAS.
 *
 * This module provides the username decoder: it takes one element of PROMIDAS'
 * `NormalizedPrototype.users` (a `displayName@profileId` string) and determines
 * its `profileId`, returning the remaining `displayName` alongside it.
 *
 * @module
 */

export { parseUsername, type ParsedUsername } from './parse-username.js';
