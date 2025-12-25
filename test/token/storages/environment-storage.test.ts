import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { EnvironmentStorage } from '../../../lib/token/storages/environment-storage.js';

describe('EnvironmentStorage', () => {
  const TEST_KEY = 'TEST_TOKEN_KEY';
  let storage: EnvironmentStorage;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    storage = new EnvironmentStorage(TEST_KEY);
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('get', () => {
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
      const originalProcess = global.process;
      // @ts-expect-error - Testing process undefined scenario
      global.process = undefined;

      const result = await storage.get();

      expect(result).toBeNull();
      global.process = originalProcess;
    });
  });

  describe('has', () => {
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
  });
});
