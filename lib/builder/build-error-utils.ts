/**
 * Utilities for parsing and localizing PROMIDAS build errors.
 *
 * This module provides functions to convert PROMIDAS store errors
 * (thrown during PromidasRepositoryBuilder.build()) into user-friendly
 * Japanese error messages.
 *
 * @packageDocumentation
 */

import {
  ConfigurationError,
  DataSizeExceededError,
  SizeEstimationError,
  StoreError,
} from '@f88/promidas/store';

/**
 * Parses ConfigurationError to localized Japanese message.
 *
 * Converts configuration validation errors into user-friendly messages
 * with troubleshooting guidance.
 *
 * @param error - The configuration error to parse
 * @returns Localized error message in Japanese with reference information
 * @internal Exported primarily for testing purposes
 */
export function parseConfigurationError(error: ConfigurationError): string {
  const buildReferenceBlock = (currentLocalizedMessage: string): string => {
    const lines: string[] = [];

    lines.push(`エラー種別: ${error.name}`);

    // Keep raw message as-is for stability (no parsing).
    // Avoid duplicating it when the localized message includes the raw message.
    if (error.message && !currentLocalizedMessage.includes(error.message)) {
      lines.push(`詳細: ${error.message}`);
    }

    if (lines.length === 0) {
      return '';
    }

    return `\n\n[参考情報]\n${lines.join('\n')}`;
  };

  const localizedMessage = [
    'ストアの設定が無効です。',
    '次を確認してください:',
    '- maxDataSizeBytesが30 MiBを超えていないか',
    '- 設定値の型や範囲が正しいか',
  ].join('\n');

  return `${localizedMessage}${buildReferenceBlock(localizedMessage)}`;
}

/**
 * Parses DataSizeExceededError to localized Japanese message.
 *
 * Converts data size limit errors into user-friendly messages with
 * specific size information and troubleshooting guidance.
 *
 * @param error - The data size exceeded error to parse
 * @returns Localized error message in Japanese with reference information
 * @internal Exported primarily for testing purposes
 */
export function parseDataSizeExceededError(
  error: DataSizeExceededError,
): string {
  const localizeDataState = (
    dataState: DataSizeExceededError['dataState'],
  ): string => {
    switch (dataState) {
      case 'UNCHANGED':
        return '既存のスナップショットは保持されます。';
      case 'UNKNOWN':
        return '既存のスナップショットの状態は不明です。';
      /* c8 ignore next */
      default: {
        const _exhaustiveCheck: never = dataState;
        return _exhaustiveCheck;
      }
    }
  };

  const buildReferenceBlock = (currentLocalizedMessage: string): string => {
    const lines: string[] = [];

    lines.push(`エラー種別: ${error.name}`);
    lines.push(`データサイズ: ${error.dataSizeBytes} バイト`);
    lines.push(`最大サイズ: ${error.maxDataSizeBytes} バイト`);
    lines.push(`dataState: ${error.dataState}`);

    // Keep raw message as-is for stability (no parsing).
    // Avoid duplicating it when the localized message includes the raw message.
    if (error.message && !currentLocalizedMessage.includes(error.message)) {
      lines.push(`詳細: ${error.message}`);
    }

    if (lines.length === 0) {
      return '';
    }

    return `\n\n[参考情報]\n${lines.join('\n')}`;
  };

  const localizedMessage = [
    'データサイズが制限を超えました。',
    localizeDataState(error.dataState),
    '次を試してください:',
    '- limitパラメータを減らす',
    '- ストアのmaxDataSizeBytesを増やす',
  ].join('\n');

  return `${localizedMessage}${buildReferenceBlock(localizedMessage)}`;
}

/**
 * Parses SizeEstimationError to localized Japanese message.
 *
 * Converts size estimation errors (e.g., circular references, serialization failures)
 * into user-friendly messages with troubleshooting guidance.
 *
 * @param error - The size estimation error to parse
 * @returns Localized error message in Japanese with reference information
 * @internal Exported primarily for testing purposes
 */
export function parseSizeEstimationError(error: SizeEstimationError): string {
  const localizeDataState = (
    dataState: SizeEstimationError['dataState'],
  ): string => {
    switch (dataState) {
      case 'UNCHANGED':
        return '既存のスナップショットは保持されます。';
      case 'UNKNOWN':
        return '既存のスナップショットの状態は不明です。';
      /* c8 ignore next */
      default: {
        const _exhaustiveCheck: never = dataState;
        return _exhaustiveCheck;
      }
    }
  };

  const buildReferenceBlock = (currentLocalizedMessage: string): string => {
    const lines: string[] = [];

    lines.push(`エラー種別: ${error.name}`);
    lines.push(`dataState: ${error.dataState}`);

    if (error.cause) {
      lines.push(`原因: ${error.cause}`);
    }

    // Keep raw message as-is for stability (no parsing).
    // Avoid duplicating it when the localized message includes the raw message.
    if (error.message && !currentLocalizedMessage.includes(error.message)) {
      lines.push(`詳細: ${error.message}`);
    }

    if (lines.length === 0) {
      return '';
    }

    return `\n\n[参考情報]\n${lines.join('\n')}`;
  };

  const localizedMessage = [
    'データサイズの推定に失敗しました。',
    localizeDataState(error.dataState),
    '次のような原因が考えられます:',
    '- データに循環参照が含まれている',
    '- JSONシリアライズできない型が含まれている',
  ].join('\n');

  return `${localizedMessage}${buildReferenceBlock(localizedMessage)}`;
}

/**
 * Parses generic StoreError to localized Japanese message.
 *
 * Handles StoreError instances that don't match specific error types.
 *
 * @param error - The store error to parse
 * @returns Localized error message in Japanese with reference information
 * @internal Exported primarily for testing purposes
 */
export function parseStoreError(error: StoreError): string {
  const localizeDataState = (dataState: StoreError['dataState']): string => {
    switch (dataState) {
      case 'UNCHANGED':
        return '既存のスナップショットは保持されます。';
      case 'UNKNOWN':
        return '既存のスナップショットの状態は不明です。';
      default: {
        const _exhaustiveCheck: never = dataState;
        return _exhaustiveCheck;
      }
    }
  };

  const buildReferenceBlock = (currentLocalizedMessage: string): string => {
    const lines: string[] = [];

    lines.push(`エラー種別: ${error.name}`);
    lines.push(`dataState: ${error.dataState}`);

    // Keep raw message as-is for stability (no parsing).
    // Avoid duplicating it when the localized message includes the raw message.
    if (error.message && !currentLocalizedMessage.includes(error.message)) {
      lines.push(`詳細: ${error.message}`);
    }

    if (lines.length === 0) {
      return '';
    }

    return `\n\n[参考情報]\n${lines.join('\n')}`;
  };

  const localizedMessage = [
    'ストアのエラーが発生しました。',
    localizeDataState(error.dataState),
  ].join('\n');

  return `${localizedMessage}${buildReferenceBlock(localizedMessage)}`;
}

/**
 * Parses generic Error objects and returns user-friendly Japanese messages.
 *
 * @internal
 * @param error - The error to parse
 * @returns Localized error message in Japanese
 */
export function parseError(error: Error): string {
  // Thrown by ProtoPediaApiClient when API token is missing
  if (error.message?.includes('Missing PROTOPEDIA_API_V2_TOKEN')) {
    return 'APIトークンが設定されていません';
  }

  return `不明なエラーが発生しました: ${error.message}`;
}

/**
 * Converts build errors to user-friendly Japanese messages.
 *
 * This function handles errors thrown by PromidasRepositoryBuilder.build()
 * and converts them into localized messages suitable for display to end users.
 * It supports store-specific errors (ConfigurationError, DataSizeExceededError,
 * SizeEstimationError, StoreError) and generic Error objects.
 *
 * @param error - The error to convert
 * @returns Localized error message in Japanese
 *
 * @example
 * ```typescript
 * import { PromidasRepositoryBuilder } from '@f88/promidas';
 * import { toErrorMessage } from '@f88/promidas-utils/builder';
 *
 * try {
 *   const repo = new PromidasRepositoryBuilder()
 *     .setStoreConfig({ maxDataSizeBytes: 50 * 1024 * 1024 }) // Invalid: exceeds 30 MiB
 *     .build();
 * } catch (error) {
 *   console.error(toErrorMessage(error));
 *   // Output:
 *   // ストアの設定が無効です。
 *   // 次を確認してください:
 *   // - maxDataSizeBytesが30 MiBを超えていないか
 *   // - 設定値の型や範囲が正しいか
 *   //
 *   // [参考情報]
 *   // エラー種別: ConfigurationError
 *   // 詳細: ...
 * }
 * ```
 */
export function toErrorMessage(error: Error): string {
  if (!error) {
    return '不明なエラーが発生しました。';
  }

  // Check for specific error types (most specific first)
  if (error instanceof DataSizeExceededError) {
    return parseDataSizeExceededError(error);
  }

  if (error instanceof SizeEstimationError) {
    return parseSizeEstimationError(error);
  }

  if (error instanceof ConfigurationError) {
    return parseConfigurationError(error);
  }

  if (error instanceof StoreError) {
    return parseStoreError(error);
  }

  if (error instanceof Error) {
    return parseError(error);
  }

  // Unknown
  return '不明なエラーが発生しました。';
}
