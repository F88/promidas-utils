import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfigManager } from '../../lib/config/config-manager.js';
import { BrowserConfigStorage } from '../../lib/config/storages/browser-config-storage.js';
import { EnvironmentConfigStorage } from '../../lib/config/storages/environment-config-storage.js';
import { EnvironmentUnavailableError } from '../../lib/token/errors.js';

// Mock the storage classes
vi.mock('../../lib/config/storages/browser-config-storage.js');
vi.mock('../../lib/config/storages/environment-config-storage.js');

describe('ConfigManager', () => {
  let mockLocalStorage: Storage;

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    // Create mock storage object
    const createMockStorage = (): Storage => ({
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    });

    mockLocalStorage = createMockStorage();

    // Mock global storage object
    vi.stubGlobal('localStorage', mockLocalStorage);
  });

  describe('constructor', () => {
    it('should throw error when attempting to instantiate', () => {
      expect(() => {
        // @ts-expect-error - Ignore type error for private constructor, testing runtime error
        new ConfigManager();
      }).toThrow('ConfigManager is a static class and cannot be instantiated');
    });
  });

  describe('Factory Methods', () => {
    describe('forLocalStorage()', () => {
      it('should create BrowserConfigStorage instance with localStorage', () => {
        const key = 'TEST_CONFIG';

        const storage = ConfigManager.forLocalStorage(key);

        expect(BrowserConfigStorage).toHaveBeenCalledWith(
          mockLocalStorage,
          key,
        );
        expect(storage).toBeInstanceOf(BrowserConfigStorage);
      });

      it('should pass the provided key to BrowserConfigStorage', () => {
        const customKey = 'CUSTOM_CONFIG';

        ConfigManager.forLocalStorage(customKey);

        expect(BrowserConfigStorage).toHaveBeenCalledWith(
          mockLocalStorage,
          customKey,
        );
      });

      it('should throw EnvironmentUnavailableError when localStorage is undefined', () => {
        vi.stubGlobal('localStorage', undefined);

        expect(() => ConfigManager.forLocalStorage('TEST_CONFIG')).toThrow(
          EnvironmentUnavailableError,
        );
        expect(() => ConfigManager.forLocalStorage('TEST_CONFIG')).toThrow(
          'Web Storage API is not available',
        );
      });
    });

    describe('forEnv()', () => {
      it('should create EnvironmentConfigStorage instance', () => {
        const key = 'TEST_CONFIG';

        const storage = ConfigManager.forEnv(key);

        expect(EnvironmentConfigStorage).toHaveBeenCalledWith(key);
        expect(storage).toBeInstanceOf(EnvironmentConfigStorage);
      });

      it('should pass the provided key to EnvironmentConfigStorage', () => {
        const customKey = 'CUSTOM_CONFIG';

        ConfigManager.forEnv(customKey);

        expect(EnvironmentConfigStorage).toHaveBeenCalledWith(customKey);
      });

      it('should throw EnvironmentUnavailableError when process is undefined', () => {
        vi.stubGlobal('process', undefined);

        expect(() => ConfigManager.forEnv('TEST_CONFIG')).toThrow(
          EnvironmentUnavailableError,
        );
      });

      it('should throw EnvironmentUnavailableError when process.env is undefined', () => {
        vi.stubGlobal('process', {});

        expect(() => ConfigManager.forEnv('TEST_CONFIG')).toThrow(
          EnvironmentUnavailableError,
        );
      });
    });
  });
});
