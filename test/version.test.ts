import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { VERSION } from '../lib/version.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8'),
);

describe('VERSION', () => {
  it('should be a string', () => {
    expect(typeof VERSION).toBe('string');
  });

  it('should match semantic versioning format', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should match the version in package.json', () => {
    expect(VERSION).toBe(packageJson.version);
  });
});
