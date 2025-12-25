import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TOKEN_KEYS, type TokenIdentifier } from '../../lib/token/constants.js';
import { BrowserStorage } from '../../lib/token/storages/browser-storage.js';
import { EnvironmentStorage } from '../../lib/token/storages/environment-storage.js';
import { TokenManager } from '../../lib/token/token-manager.js';

// Mock the storage classes
vi.mock('../../lib/token/storages/browser-storage.js');
vi.mock('../../lib/token/storages/environment-storage.js');

describe('TokenManager', () => {
  let mockSessionStorage: Storage;
  let mockLocalStorage: Storage;

  beforeEach(() => {
    // Create mock storage objects
    const createMockStorage = (): Storage => ({
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    });

    mockSessionStorage = createMockStorage();
    mockLocalStorage = createMockStorage();

    // Mock global storage objects
    vi.stubGlobal('sessionStorage', mockSessionStorage);
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  describe('constructor', () => {
    it('should throw error when attempting to instantiate', () => {
      expect(() => {
        // @ts-expect-error - Testing private constructor
        new TokenManager();
      }).toThrow('TokenManager is a static class and cannot be instantiated');
    });
  });

  describe('Factory Methods', () => {
    describe('forSessionStorage()', () => {
      it('should create BrowserStorage instance with sessionStorage', () => {
        const storage = TokenManager.forSessionStorage(
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );

        expect(BrowserStorage).toHaveBeenCalledWith(
          mockSessionStorage,
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );
        expect(storage).toBeInstanceOf(BrowserStorage);
      });

      it('should pass the provided key to BrowserStorage', () => {
        const customKey = 'CUSTOM_TOKEN' as TokenIdentifier;

        TokenManager.forSessionStorage(customKey);

        expect(BrowserStorage).toHaveBeenCalledWith(
          mockSessionStorage,
          customKey,
        );
      });
    });

    describe('forLocalStorage()', () => {
      it('should create BrowserStorage instance with localStorage', () => {
        const storage = TokenManager.forLocalStorage(
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );

        expect(BrowserStorage).toHaveBeenCalledWith(
          mockLocalStorage,
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );
        expect(storage).toBeInstanceOf(BrowserStorage);
      });

      it('should pass the provided key to BrowserStorage', () => {
        const customKey = 'CUSTOM_TOKEN' as TokenIdentifier;

        TokenManager.forLocalStorage(customKey);

        expect(BrowserStorage).toHaveBeenCalledWith(
          mockLocalStorage,
          customKey,
        );
      });
    });

    describe('forEnv()', () => {
      it('should create EnvironmentStorage instance', () => {
        const storage = TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);

        expect(EnvironmentStorage).toHaveBeenCalledWith(
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );
        expect(storage).toBeInstanceOf(EnvironmentStorage);
      });

      it('should pass the provided key to EnvironmentStorage', () => {
        const customKey = 'CUSTOM_TOKEN' as TokenIdentifier;

        TokenManager.forEnv(customKey);

        expect(EnvironmentStorage).toHaveBeenCalledWith(customKey);
      });
    });
  });
});
