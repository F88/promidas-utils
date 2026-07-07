import { defineConfig } from 'vitest/config';

// Runs the subpath-export integration tests in `__tests__/` against the built
// `dist/`. Kept separate from the main config (which only includes `test/`) so
// these run only via `npm run test:exports`, which builds first.
export default defineConfig({
  test: {
    include: ['__tests__/**/*.test.ts'],
    environment: 'node',
  },
});
