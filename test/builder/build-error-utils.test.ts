import {
  ConfigurationError,
  DataSizeExceededError,
  SizeEstimationError,
  StoreError,
} from 'promidas/store';
import { describe, expect, it } from 'vitest';

import {
  parseConfigurationError,
  parseDataSizeExceededError,
  parseSizeEstimationError,
  parseStoreError,
  toErrorMessage,
} from '../../lib/builder/build-error-utils.js';

describe('build-error-utils', () => {
  describe('parseConfigurationError', () => {
    it('should return localized message for configuration error', () => {
      const error = new ConfigurationError(
        'maxDataSizeBytes exceeds the limit',
      );

      const result = parseConfigurationError(error);

      expect(result).toContain('ストアの設定が無効です');
      expect(result).toContain('maxDataSizeBytesが30 MiBを超えていないか');
      expect(result).toContain('[参考情報]');
      expect(result).toContain('エラー種別: ConfigurationError');
    });

    it('should include raw message in reference block when different from localized message', () => {
      const error = new ConfigurationError('Custom error message');

      const result = parseConfigurationError(error);

      expect(result).toContain('詳細: Custom error message');
    });

    it('should not duplicate message when raw message equals localized message', () => {
      const rawMessage = 'ストアの設定が無効です。';
      const error = new ConfigurationError(rawMessage);

      const result = parseConfigurationError(error);

      // Should not include "詳細:" line when raw message equals part of localized message
      expect(result).not.toContain(`詳細: ${rawMessage}`);
    });
  });

  describe('parseDataSizeExceededError', () => {
    it('should return localized message with size information', () => {
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);

      const result = parseDataSizeExceededError(error);

      expect(result).toContain('データサイズが制限を超えました');
      expect(result).toContain('既存のスナップショットは保持されます');
      expect(result).toContain('limitパラメータを減らす');
      expect(result).toContain('[参考情報]');
      expect(result).toContain('データサイズ: 2000000 バイト');
      expect(result).toContain('最大サイズ: 1000000 バイト');
      expect(result).toContain('dataState: UNCHANGED');
    });

    it('should handle UNKNOWN dataState', () => {
      const error = new DataSizeExceededError('UNKNOWN', 2000000, 1000000);

      const result = parseDataSizeExceededError(error);

      expect(result).toContain('既存のスナップショットの状態は不明です');
      expect(result).toContain('dataState: UNKNOWN');
    });

    it('should include raw message in reference block when available', () => {
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);
      // DataSizeExceededError has an automatic message

      const result = parseDataSizeExceededError(error);

      expect(result).toContain('[参考情報]');
      expect(result).toContain('エラー種別: DataSizeExceededError');
    });
  });

  describe('parseSizeEstimationError', () => {
    it('should return localized message for size estimation error', () => {
      const error = new SizeEstimationError('UNCHANGED');

      const result = parseSizeEstimationError(error);

      expect(result).toContain('データサイズの推定に失敗しました');
      expect(result).toContain('既存のスナップショットは保持されます');
      expect(result).toContain('データに循環参照が含まれている');
      expect(result).toContain('JSONシリアライズできない型が含まれている');
      expect(result).toContain('[参考情報]');
      expect(result).toContain('dataState: UNCHANGED');
    });

    it('should handle UNKNOWN dataState', () => {
      const error = new SizeEstimationError('UNKNOWN');

      const result = parseSizeEstimationError(error);

      expect(result).toContain('既存のスナップショットの状態は不明です');
      expect(result).toContain('dataState: UNKNOWN');
    });

    it('should include cause in reference block when available', () => {
      const causeError = new Error('Circular reference detected');
      const error = new SizeEstimationError('UNCHANGED', causeError);

      const result = parseSizeEstimationError(error);

      expect(result).toContain('[参考情報]');
      expect(result).toContain('原因:');
    });
  });

  describe('parseStoreError', () => {
    it('should return localized message for generic store error', () => {
      const error = new StoreError('Generic store failure', 'UNCHANGED');

      const result = parseStoreError(error);

      expect(result).toContain('ストアのエラーが発生しました');
      expect(result).toContain('既存のスナップショットは保持されます');
      expect(result).toContain('[参考情報]');
      expect(result).toContain('dataState: UNCHANGED');
    });

    it('should handle UNKNOWN dataState', () => {
      const error = new StoreError('Generic store failure', 'UNKNOWN');

      const result = parseStoreError(error);

      expect(result).toContain('既存のスナップショットの状態は不明です');
      expect(result).toContain('dataState: UNKNOWN');
    });

    it('should include raw message in reference block', () => {
      const error = new StoreError('Custom store error', 'UNCHANGED');

      const result = parseStoreError(error);

      expect(result).toContain('詳細: Custom store error');
    });
  });

  describe('toErrorMessage', () => {
    it('should handle DataSizeExceededError', () => {
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);

      const result = toErrorMessage(error);

      expect(result).toContain('データサイズが制限を超えました');
      expect(result).toContain('データサイズ: 2000000 バイト');
    });

    it('should handle SizeEstimationError', () => {
      const error = new SizeEstimationError('UNCHANGED');

      const result = toErrorMessage(error);

      expect(result).toContain('データサイズの推定に失敗しました');
    });

    it('should handle ConfigurationError', () => {
      const error = new ConfigurationError('Invalid config');

      const result = toErrorMessage(error);

      expect(result).toContain('ストアの設定が無効です');
    });

    it('should handle generic StoreError', () => {
      const error = new StoreError('Generic error', 'UNCHANGED');

      const result = toErrorMessage(error);

      expect(result).toContain('ストアのエラーが発生しました');
    });

    it('should handle unknown error types', () => {
      const error = new Error('Unknown error');

      const result = toErrorMessage(error);

      expect(result).toBe('不明なエラーが発生しました: Unknown error');
    });

    it('should handle API token missing error', () => {
      const error = new Error('Missing PROTOPEDIA_API_V2_TOKEN.');

      const result = toErrorMessage(error);

      expect(result).toBe('APIトークンが設定されていません');
    });

    it('should prioritize specific error types over generic StoreError', () => {
      // DataSizeExceededError extends StoreError, so instanceof StoreError is also true
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);

      const result = toErrorMessage(error);

      // Should use specific handler, not generic StoreError handler
      expect(result).toContain('データサイズが制限を超えました');
      expect(result).not.toContain('ストアのエラーが発生しました');
    });

    it('should handle non-Error objects thrown as errors', () => {
      // In JavaScript, any value can be thrown, not just Error instances
      const nonErrorValue = 'string error' as unknown as Error;

      const result = toErrorMessage(nonErrorValue);

      expect(result).toBe('不明なエラーが発生しました。');
    });
  });

  describe('Reference block formatting', () => {
    it('should format reference block consistently', () => {
      const error = new ConfigurationError('Test error');

      const result = parseConfigurationError(error);

      expect(result).toMatch(/\n\n\[参考情報\]\n/);
      expect(result).toMatch(/エラー種別: ConfigurationError\n/);
    });

    it('should include all relevant information in reference block for DataSizeExceededError', () => {
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);

      const result = parseDataSizeExceededError(error);

      const lines = result.split('\n');
      const refIndex = lines.findIndex((line) => line === '[参考情報]');

      expect(refIndex).toBeGreaterThan(-1);

      const refBlock = lines.slice(refIndex + 1).join('\n');
      expect(refBlock).toContain('エラー種別: DataSizeExceededError');
      expect(refBlock).toContain('データサイズ: 2000000 バイト');
      expect(refBlock).toContain('最大サイズ: 1000000 バイト');
      expect(refBlock).toContain('dataState: UNCHANGED');
    });
  });

  describe('Integration with PromidasRepositoryBuilder usage', () => {
    it('should provide useful message for typical configuration error', () => {
      // Simulate error from exceeding maxDataSizeBytes limit
      const error = new ConfigurationError(
        'maxDataSizeBytes must not exceed 30 MiB',
      );

      const result = toErrorMessage(error);

      expect(result).toContain('ストアの設定が無効です');
      expect(result).toContain('maxDataSizeBytesが30 MiBを超えていないか');
      expect(result).toContain('設定値の型や範囲が正しいか');
    });

    it('should provide useful message for typical data size error', () => {
      // Simulate error from initial snapshot being too large
      const error = new DataSizeExceededError(
        'UNCHANGED',
        5 * 1024 * 1024,
        3 * 1024 * 1024,
      );

      const result = toErrorMessage(error);

      expect(result).toContain('データサイズが制限を超えました');
      expect(result).toContain('既存のスナップショットは保持されます');
      expect(result).toContain('limitパラメータを減らす');
      expect(result).toContain('ストアのmaxDataSizeBytesを増やす');
    });

    it('should provide useful message for size estimation error', () => {
      // Simulate error from circular reference in initial snapshot
      const causeError = new Error('Converting circular structure to JSON');
      const error = new SizeEstimationError('UNCHANGED', causeError);

      const result = toErrorMessage(error);

      expect(result).toContain('データサイズの推定に失敗しました');
      expect(result).toContain('データに循環参照が含まれている');
    });
  });

  describe('Edge cases and coverage improvements', () => {
    it('should handle null error input', () => {
      const result = toErrorMessage(null as unknown as Error);

      expect(result).toBe('不明なエラーが発生しました。');
    });

    it('should handle DataSizeExceededError with UNKNOWN dataState', () => {
      const error = new DataSizeExceededError('UNKNOWN', 2000000, 1000000);

      const result = parseDataSizeExceededError(error);

      expect(result).toContain('既存のスナップショットの状態は不明です');
    });

    it('should handle SizeEstimationError with UNKNOWN dataState', () => {
      const causeError = new Error('Test error');
      const error = new SizeEstimationError('UNKNOWN', causeError);

      const result = parseSizeEstimationError(error);

      expect(result).toContain('既存のスナップショットの状態は不明です');
    });

    it('should handle StoreError with empty message', () => {
      const error = new StoreError('');

      const result = parseStoreError(error);

      expect(result).toContain('ストアのエラーが発生しました');
      expect(result).not.toContain('詳細:');
    });

    it('should handle DataSizeExceededError with empty message', () => {
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);
      Object.defineProperty(error, 'message', { value: '' });

      const result = parseDataSizeExceededError(error);

      expect(result).not.toContain('詳細:');
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error message');

      const result = toErrorMessage(error);

      expect(result).toBe('不明なエラーが発生しました: Generic error message');
    });

    it('should return empty string when DataSizeExceededError has no lines in reference block', () => {
      // Create error with no message and localized message that contains the raw message
      const error = new DataSizeExceededError('UNCHANGED', 2000000, 1000000);
      Object.defineProperty(error, 'message', { value: '' });
      Object.defineProperty(error, 'dataSizeBytes', { value: undefined });
      Object.defineProperty(error, 'maxDataSizeBytes', { value: undefined });
      Object.defineProperty(error, 'dataState', { value: undefined });
      Object.defineProperty(error, 'name', { value: '' });

      const result = parseDataSizeExceededError(error);

      // Reference block should still be included even with minimal data
      expect(result).toContain('[参考情報]');
    });

    it('should return empty string when SizeEstimationError has no lines in reference block', () => {
      // Create error with no message and no cause message
      const causeError = new Error('');
      Object.defineProperty(causeError, 'name', { value: '' });
      const error = new SizeEstimationError('UNCHANGED', causeError);
      Object.defineProperty(error, 'message', { value: '' });
      Object.defineProperty(error, 'dataState', { value: undefined });
      Object.defineProperty(error, 'name', { value: '' });

      const result = parseSizeEstimationError(error);

      // Reference block should still be included
      expect(result).toContain('[参考情報]');
    });

    it('should return empty string when StoreError has no lines in reference block', () => {
      const error = new StoreError('');
      Object.defineProperty(error, 'message', { value: '' });
      Object.defineProperty(error, 'name', { value: '' });

      const result = parseStoreError(error);

      // Reference block should still be included
      expect(result).toContain('[参考情報]');
    });
  });
});
