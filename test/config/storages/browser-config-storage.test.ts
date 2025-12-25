import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BrowserConfigStorage } from '../../../lib/config/storages/browser-config-storage.js';
import { EnvironmentUnavailableError } from '../../../lib/errors.js';

describe('BrowserConfigStorage', () => {
  let mockStorage: Storage;

  beforeEach(() => {
    const store: Record<string, string> = {};
    mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      key: vi.fn((index: number) => Object.keys(store)[index] || null),
      get length() {
        return Object.keys(store).length;
      },
    };
  });

  describe('has()', () => {
    it('should return true when config exists in storage', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');
      await storage.save('test-value');

      const result = await storage.has();

      expect(result).toBe(true);
    });

    it('should return false when config does not exist in storage', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      const result = await storage.has();

      expect(result).toBe(false);
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserConfigStorage(
        undefined as unknown as Storage,
        'TEST_CONFIG',
      );

      await expect(storage.has()).rejects.toThrow(EnvironmentUnavailableError);
      await expect(storage.has()).rejects.toThrow(
        'Web Storage API is not available',
      );
    });

    it('should propagate error when storage.getItem throws', async () => {
      const error = new Error('SecurityError');
      mockStorage.getItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      await expect(storage.has()).rejects.toThrow('SecurityError');
    });
  });

  describe('get()', () => {
    it('should return config value when it exists in storage', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');
      const value = 'my-test-value';
      await storage.save(value);

      const result = await storage.get();

      expect(result).toBe(value);
    });

    it('should return null when config does not exist', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      const result = await storage.get();

      expect(result).toBeNull();
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserConfigStorage(
        undefined as unknown as Storage,
        'TEST_CONFIG',
      );

      await expect(storage.get()).rejects.toThrow(EnvironmentUnavailableError);
      await expect(storage.get()).rejects.toThrow(
        'Web Storage API is not available',
      );
    });

    it('should propagate error when storage.getItem throws', async () => {
      const error = new Error('SecurityError');
      mockStorage.getItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      await expect(storage.get()).rejects.toThrow('SecurityError');
    });

    it('should return empty string if stored value is empty string', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');
      await storage.save('');

      const result = await storage.get();

      expect(result).toBe('');
    });
  });

  describe('save()', () => {
    it('should save config value to storage', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');
      const value = 'new-value';

      await storage.save(value);

      expect(mockStorage.setItem).toHaveBeenCalledWith('TEST_CONFIG', value);
      const result = await storage.get();
      expect(result).toBe(value);
    });

    it('should overwrite existing config value', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');
      await storage.save('old-value');

      await storage.save('new-value');

      const result = await storage.get();
      expect(result).toBe('new-value');
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserConfigStorage(
        undefined as unknown as Storage,
        'TEST_CONFIG',
      );

      await expect(storage.save('value')).rejects.toThrow(
        EnvironmentUnavailableError,
      );
      await expect(storage.save('value')).rejects.toThrow(
        'Web Storage API is not available',
      );
    });

    it('should propagate error when storage.setItem throws', async () => {
      const error = new Error('QuotaExceededError');
      mockStorage.setItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      await expect(storage.save('value')).rejects.toThrow('QuotaExceededError');
    });
  });

  describe('remove()', () => {
    it('should remove config value from storage', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');
      await storage.save('value-to-remove');

      await storage.remove();

      expect(mockStorage.removeItem).toHaveBeenCalledWith('TEST_CONFIG');
      const result = await storage.get();
      expect(result).toBeNull();
    });

    it('should not throw error when removing non-existent config value', async () => {
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      await expect(storage.remove()).resolves.not.toThrow();
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserConfigStorage(
        undefined as unknown as Storage,
        'TEST_CONFIG',
      );

      await expect(storage.remove()).rejects.toThrow(
        EnvironmentUnavailableError,
      );
      await expect(storage.remove()).rejects.toThrow(
        'Web Storage API is not available',
      );
    });

    it('should propagate error when storage.removeItem throws', async () => {
      const error = new Error('SecurityError');
      mockStorage.removeItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserConfigStorage(mockStorage, 'TEST_CONFIG');

      await expect(storage.remove()).rejects.toThrow('SecurityError');
    });
  });
});
