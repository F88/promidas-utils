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

  it('promidas-utils/repository exposes the browser-safe failure helpers', async () => {
    const m = await import('promidas-utils/repository');
    expect(typeof m.parseSnapshotOperationFailure).toBe('function');
    expect(typeof m.toLocalizedMessage).toBe('function');
    // Node-only file I/O must NOT leak into the browser-safe barrel (issue #48).
    expect('exportSnapshotToFile' in m).toBe(false);
    expect('importSnapshotFromFile' in m).toBe(false);
  });

  it('promidas-utils/file-io exposes the Node file I/O', async () => {
    const m = await import('promidas-utils/file-io');
    expect(typeof m.exportSnapshotToFile).toBe('function');
    expect(typeof m.importSnapshotFromFile).toBe('function');
  });

  it('promidas-utils/utils exposes parseUsername', async () => {
    const m = await import('promidas-utils/utils');
    expect(typeof m.parseUsername).toBe('function');
  });
});

describe('browser-safety', () => {
  // Regression guard for issue #48: nothing reachable from the browser-safe
  // /repository barrel may statically import a Node built-in, or browser
  // bundlers (Vite/rollup) fail even when only the browser-safe exports are
  // used. The original bug lived one level below the barrel (in
  // snapshot-file-io.js), so scan the WHOLE built /repository tree, not just
  // index.js.
  it('the built /repository tree has no static `node:` import', async () => {
    const { readdirSync, readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { join } = await import('node:path');
    const dir = fileURLToPath(
      new URL('../dist/lib/repository/', import.meta.url),
    );
    const files = readdirSync(dir, { recursive: true })
      .map(String)
      .filter((file) => file.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) {
      const source = readFileSync(join(dir, file), 'utf8');
      expect(
        source,
        `${file} must not statically import a node: builtin`,
      ).not.toMatch(/(?:from|import)\s*['"]node:/);
    }
  });
});
