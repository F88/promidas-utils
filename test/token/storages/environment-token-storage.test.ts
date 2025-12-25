import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnvironmentTokenStorage } from '../../../lib/token/storages/environment-token-storage.js';

describe('EnvironmentTokenStorage', () => {
  const TEST_KEY = 'TEST_TOKEN_KEY';
  let storage: EnvironmentTokenStorage;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    storage = new EnvironmentTokenStorage(TEST_KEY);
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  describe('get()', () => {
    it('should return token value from environment variable', async () => {
      process.env[TEST_KEY] = 'test-token-value';
      const result = await storage.get();
      expect(result).toBe('test-token-value');
    });

    it('should return null when environment variable is not set', async () => {
      delete process.env[TEST_KEY];
      const result = await storage.get();
      expect(result).toBeNull();
    });

    it('should return null when environment variable is empty string', async () => {
      process.env[TEST_KEY] = '';
      const result = await storage.get();
      expect(result).toBeNull();
    });

    it('should return null when environment variable is placeholder value', async () => {
      process.env[TEST_KEY] = 'your_token_here';
      const result = await storage.get();
      expect(result).toBeNull();
    });

    it('should return actual token even if it contains "your_token_here" as substring', async () => {
      process.env[TEST_KEY] = 'prefix_your_token_here_suffix';
      const result = await storage.get();
      expect(result).toBe('prefix_your_token_here_suffix');
    });

    it('should return null when process.env is not available', async () => {
      vi.stubGlobal('process', undefined);

      const result = await storage.get();

      expect(result).toBeNull();
    });
  });

  describe('has()', () => {
    it('should return true when token exists', async () => {
      process.env[TEST_KEY] = 'test-token-value';
      const result = await storage.has();
      expect(result).toBe(true);
    });

    it('should return false when token does not exist', async () => {
      delete process.env[TEST_KEY];
      const result = await storage.has();
      expect(result).toBe(false);
    });

    it('should return false when token is empty string', async () => {
      process.env[TEST_KEY] = '';
      const result = await storage.has();
      expect(result).toBe(false);
    });

    it('should return false when token is placeholder value', async () => {
      process.env[TEST_KEY] = 'your_token_here';
      const result = await storage.has();
      expect(result).toBe(false);
    });

    it('should return false when process.env is not available', async () => {
      vi.stubGlobal('process', undefined);

      const result = await storage.has();

      expect(result).toBe(false);
    });
  });
});
