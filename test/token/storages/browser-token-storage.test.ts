import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TOKEN_KEYS } from '../../../lib/token/constants.js';
import { BrowserTokenStorage } from '../../../lib/token/storages/browser-token-storage.js';

describe('BrowserTokenStorage', () => {
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
    it('should return true when token exists in storage', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      await storage.save('test-token');

      const result = await storage.has();

      expect(result).toBe(true);
    });

    it('should return false when token does not exist in storage', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      const result = await storage.has();

      expect(result).toBe(false);
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserTokenStorage(
        undefined as unknown as Storage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.has()).rejects.toThrow('Storage is not available');
    });

    it('should propagate error when storage.getItem throws', async () => {
      const error = new Error('SecurityError');
      mockStorage.getItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.has()).rejects.toThrow('SecurityError');
    });
  });

  describe('get()', () => {
    it('should return token when it exists in storage', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      const token = 'my-test-token';
      await storage.save(token);

      const result = await storage.get();

      expect(result).toBe(token);
    });

    it('should return null when token does not exist', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      const result = await storage.get();

      expect(result).toBeNull();
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserTokenStorage(
        undefined as unknown as Storage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.get()).rejects.toThrow('Storage is not available');
    });

    it('should propagate error when storage.getItem throws', async () => {
      const error = new Error('SecurityError');
      mockStorage.getItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.get()).rejects.toThrow('SecurityError');
    });

    it('should return empty string if stored value is empty string', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      await storage.save('');

      const result = await storage.get();

      expect(result).toBe('');
    });
  });

  describe('save()', () => {
    it('should save token to storage', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      const token = 'new-token';

      await storage.save(token);

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        token,
      );
      const result = await storage.get();
      expect(result).toBe(token);
    });

    it('should overwrite existing token', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      await storage.save('old-token');

      await storage.save('new-token');

      const result = await storage.get();
      expect(result).toBe('new-token');
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserTokenStorage(
        undefined as unknown as Storage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.save('token')).rejects.toThrow(
        'Storage is not available',
      );
    });

    it('should propagate error when storage.setItem throws', async () => {
      const error = new Error('QuotaExceededError');
      mockStorage.setItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.save('token')).rejects.toThrow('QuotaExceededError');
    });
  });

  describe('remove()', () => {
    it('should remove token from storage', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      await storage.save('token-to-remove');

      await storage.remove();

      expect(mockStorage.removeItem).toHaveBeenCalledWith(
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );
      const result = await storage.get();
      expect(result).toBeNull();
    });

    it('should not throw error when removing non-existent token', async () => {
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.remove()).resolves.not.toThrow();
    });

    it('should throw error when storage is not available', async () => {
      const storage = new BrowserTokenStorage(
        undefined as unknown as Storage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.remove()).rejects.toThrow(
        'Storage is not available',
      );
    });

    it('should propagate error when storage.removeItem throws', async () => {
      const error = new Error('SecurityError');
      mockStorage.removeItem = vi.fn(() => {
        throw error;
      });
      const storage = new BrowserTokenStorage(
        mockStorage,
        TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
      );

      await expect(storage.remove()).rejects.toThrow('SecurityError');
    });
  });
});
