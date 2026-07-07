/**
 * @file Subpath exports integration test.
 *
 * Verifies that every `package.json` subpath export resolves against the built
 * `dist/` (via self-reference by package name) and exposes its documented
 * runtime symbols. Run via `npm run test:exports`, which builds first.
 *
 * Update this test when changing the `exports` map or a subpath's public API.
 * Only runtime values are asserted (types are erased at build time).
 *
 * @see ../package.json — `exports` field
 */
import { describe, expect, it } from 'vitest';

describe('subpath exports', () => {
  it('promidas-utils/config exposes ConfigManager, EnvironmentUnavailableError', async () => {
    const m = await import('promidas-utils/config');
    expect(typeof m.ConfigManager).toBe('function');
    expect(typeof m.EnvironmentUnavailableError).toBe('function');
  });

  it('promidas-utils/token exposes TokenManager, TOKEN_KEYS, EnvironmentUnavailableError', async () => {
    const m = await import('promidas-utils/token');
    expect(typeof m.TokenManager).toBe('function');
    expect(m.TOKEN_KEYS).toBeDefined();
    expect(typeof m.EnvironmentUnavailableError).toBe('function');
  });

  it('promidas-utils/store exposes getStoreState', async () => {
    const m = await import('promidas-utils/store');
    expect(typeof m.getStoreState).toBe('function');
  });

  it('promidas-utils/builder exposes toErrorMessage', async () => {
    const m = await import('promidas-utils/builder');
    expect(typeof m.toErrorMessage).toBe('function');
  });

  it('promidas-utils/repository exposes its snapshot helpers', async () => {
    const m = await import('promidas-utils/repository');
    expect(typeof m.parseSnapshotOperationFailure).toBe('function');
    expect(typeof m.toLocalizedMessage).toBe('function');
    expect(typeof m.exportSnapshotToFile).toBe('function');
    expect(typeof m.importSnapshotFromFile).toBe('function');
  });

  it('promidas-utils/utils exposes parseUsername', async () => {
    const m = await import('promidas-utils/utils');
    expect(typeof m.parseUsername).toBe('function');
  });
});
