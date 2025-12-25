import { describe, expect, it } from 'vitest';

import { VERSION } from '../lib/version.js';

describe('VERSION', () => {
  it('should be a string', () => {
    expect(typeof VERSION).toBe('string');
  });

  it('should match semantic versioning format', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should be the current version', () => {
    expect(VERSION).toBe('0.1.0');
  });
});
