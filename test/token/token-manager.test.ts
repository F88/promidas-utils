import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TOKEN_KEYS, type TokenIdentifier } from '../../lib/token/constants.js';
import { EnvironmentUnavailableError } from '../../lib/token/errors.js';
import { BrowserTokenStorage } from '../../lib/token/storages/browser-token-storage.js';
import { EnvironmentTokenStorage } from '../../lib/token/storages/environment-token-storage.js';
import { TokenManager } from '../../lib/token/token-manager.js';

// Mock the storage classes
vi.mock('../../lib/token/storages/browser-token-storage.js');
vi.mock('../../lib/token/storages/environment-token-storage.js');

describe('TokenManager', () => {
  let mockSessionStorage: Storage;
  let mockLocalStorage: Storage;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

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
        // @ts-expect-error - Ignore type error for private constructor, testing runtime error
        new TokenManager();
      }).toThrow('TokenManager is a static class and cannot be instantiated');
    });
  });

  describe('Factory Methods', () => {
    describe('forSessionStorage()', () => {
      it('should create BrowserTokenStorage instance with sessionStorage', () => {
        const storage = TokenManager.forSessionStorage(
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );

        expect(BrowserTokenStorage).toHaveBeenCalledWith(
          mockSessionStorage,
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );
        expect(storage).toBeInstanceOf(BrowserTokenStorage);
      });

      it('should pass the provided key to BrowserTokenStorage', () => {
        const customKey = 'CUSTOM_TOKEN' as TokenIdentifier;

        TokenManager.forSessionStorage(customKey);

        expect(BrowserTokenStorage).toHaveBeenCalledWith(
          mockSessionStorage,
          customKey,
        );
      });

      it('should throw EnvironmentUnavailableError when sessionStorage is undefined', () => {
        vi.stubGlobal('sessionStorage', undefined);

        expect(() =>
          TokenManager.forSessionStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN),
        ).toThrow(EnvironmentUnavailableError);
        expect(() =>
          TokenManager.forSessionStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN),
        ).toThrow('Web Storage API is not available');
      });
    });

    describe('forLocalStorage()', () => {
      it('should create BrowserTokenStorage instance with localStorage', () => {
        const storage = TokenManager.forLocalStorage(
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );

        expect(BrowserTokenStorage).toHaveBeenCalledWith(
          mockLocalStorage,
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );
        expect(storage).toBeInstanceOf(BrowserTokenStorage);
      });

      it('should pass the provided key to BrowserTokenStorage', () => {
        const customKey = 'CUSTOM_TOKEN' as TokenIdentifier;

        TokenManager.forLocalStorage(customKey);

        expect(BrowserTokenStorage).toHaveBeenCalledWith(
          mockLocalStorage,
          customKey,
        );
      });

      it('should throw EnvironmentUnavailableError when localStorage is undefined', () => {
        vi.stubGlobal('localStorage', undefined);

        expect(() =>
          TokenManager.forLocalStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN),
        ).toThrow(EnvironmentUnavailableError);
        expect(() =>
          TokenManager.forLocalStorage(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN),
        ).toThrow('Web Storage API is not available');
      });
    });

    describe('forEnv()', () => {
      it('should create EnvironmentTokenStorage instance', () => {
        const storage = TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN);

        expect(EnvironmentTokenStorage).toHaveBeenCalledWith(
          TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
        );
        expect(storage).toBeInstanceOf(EnvironmentTokenStorage);
      });

      it('should pass the provided key to EnvironmentTokenStorage', () => {
        const customKey = 'CUSTOM_TOKEN' as TokenIdentifier;

        TokenManager.forEnv(customKey);

        expect(EnvironmentTokenStorage).toHaveBeenCalledWith(customKey);
      });

      it('should throw EnvironmentUnavailableError when process is undefined', () => {
        vi.stubGlobal('process', undefined);

        expect(() =>
          TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN),
        ).toThrow(EnvironmentUnavailableError);
      });

      it('should throw EnvironmentUnavailableError when process.env is undefined', () => {
        vi.stubGlobal('process', {});

        expect(() =>
          TokenManager.forEnv(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN),
        ).toThrow(EnvironmentUnavailableError);
      });
    });
  });
});
