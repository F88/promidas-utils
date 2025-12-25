import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EnvironmentConfigStorage } from '../../../lib/config/storages/environment-config-storage.js';

describe('EnvironmentConfigStorage', () => {
  const TEST_KEY = 'TEST_CONFIG_KEY';
  let storage: EnvironmentConfigStorage;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    storage = new EnvironmentConfigStorage(TEST_KEY);
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  describe('get()', () => {
    it('should return config value from environment variable', async () => {
      process.env[TEST_KEY] = 'test-config-value';
      const result = await storage.get();
      expect(result).toBe('test-config-value');
    });

    it('should return null when environment variable is not set', async () => {
      delete process.env[TEST_KEY];
      const result = await storage.get();
      expect(result).toBeNull();
    });

    it('should return empty string when environment variable is empty string', async () => {
      process.env[TEST_KEY] = '';
      const result = await storage.get();
      expect(result).toBe('');
    });

    it('should return null when process.env is not available', async () => {
      vi.stubGlobal('process', undefined);

      const result = await storage.get();

      expect(result).toBeNull();
    });

    it('should return null when process.env is undefined', async () => {
      vi.stubGlobal('process', {});

      const result = await storage.get();

      expect(result).toBeNull();
    });
  });

  describe('has()', () => {
    it('should return true when config value exists', async () => {
      process.env[TEST_KEY] = 'test-config-value';
      const result = await storage.has();
      expect(result).toBe(true);
    });

    it('should return false when config value does not exist', async () => {
      delete process.env[TEST_KEY];
      const result = await storage.has();
      expect(result).toBe(false);
    });

    it('should return true when config value is empty string', async () => {
      process.env[TEST_KEY] = '';
      const result = await storage.has();
      expect(result).toBe(true);
    });

    it('should return false when process.env is not available', async () => {
      vi.stubGlobal('process', undefined);

      const result = await storage.has();

      expect(result).toBe(false);
    });

    it('should return false when process.env is undefined', async () => {
      vi.stubGlobal('process', {});

      const result = await storage.has();

      expect(result).toBe(false);
    });
  });
});
