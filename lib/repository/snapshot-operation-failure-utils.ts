/**
 * Utilities for parsing and localizing PROMIDAS snapshot operation failures.
 *
 * This module provides functions to convert PROMIDAS snapshot operation failures
 * into user-friendly Japanese error messages.
 *
 * @packageDocumentation
 */

import type {
  SnapshotOperationFailure,
  FetcherSnapshotFailure,
  StoreSnapshotFailure,
  UnknownSnapshotFailure,
} from '@f88/promidas/repository/types';

/**
 * Parsed snapshot operation failure with localized message.
 *
 * Extends the original SnapshotOperationFailure type with a localized message.
 * All original properties (origin, code, kind, status, etc.) are preserved.
 */
export type ParsedSnapshotOperationFailure = SnapshotOperationFailure & {
  /** User-friendly localized error message in Japanese */
  localizedMessage: string;
};

/**
 * Parses fetcher-originated snapshot operation failures to localized message.
 *
 * Converts fetcher errors into user-friendly Japanese messages with contextual information.
 *
 * @param failure - The fetcher snapshot failure to parse
 * @returns Localized error message in Japanese with reference information
 * @internal Exported primarily for testing purposes
 */
export function parseFetcherSnapshotFailure(
  failure: FetcherSnapshotFailure,
): string {
  const buildFetcherFailureContextLines = (
    currentLocalizedMessage: string,
  ): string[] => {
    const lines: string[] = [];

    const { method, url } = failure.details.req ?? {};
    if (method || url) {
      lines.push(`リクエスト: ${[method, url].filter(Boolean).join(' ')}`);
    }

    const { statusText, code: resCode } = failure.details.res ?? {};
    if (failure.status || statusText) {
      if (failure.status) {
        lines.push(
          `レスポンス: HTTP ${failure.status}${statusText ? ` ${statusText}` : ''}`,
        );
      } else if (statusText) {
        lines.push(`レスポンス: ${statusText}`);
      }
    }
    if (resCode) {
      lines.push(`レスポンスコード: ${resCode}`);
    }

    lines.push(`エラーコード: ${failure.code}`);

    // Keep raw message as-is for stability (no parsing).
    // Avoid duplicating it when the localized message is already the raw message.
    if (failure.message && currentLocalizedMessage !== failure.message) {
      lines.push(`詳細: ${failure.message}`);
    }

    return lines;
  };

  const buildFetcherFailureReferenceBlock = (
    currentLocalizedMessage: string,
  ): string => {
    const lines = buildFetcherFailureContextLines(currentLocalizedMessage);
    /* c8 ignore next 2 */
    if (lines.length === 0) {
      return '';
    }
    return `\n\n[参考情報]\n${lines.join('\n')}`;
  };

  const withFetcherReferenceInfo = (localizedMessage: string): string => {
    /* c8 ignore next */
    return `${localizedMessage}${buildFetcherFailureReferenceBlock(localizedMessage)}`;
  };

  // HTTP errors with status code (most specific)
  if (failure.kind === 'http' && failure.status) {
    switch (failure.status) {
      case 400:
        return withFetcherReferenceInfo(
          'リクエストが不正です。パラメータを確認してください。',
        );
      case 401:
        return withFetcherReferenceInfo(
          'APIトークンが無効です。設定を確認してください。',
        );
      case 403:
        return withFetcherReferenceInfo('アクセス権限がありません。');
      case 404:
        return withFetcherReferenceInfo('データが見つかりません。');
      case 405:
        return withFetcherReferenceInfo('許可されていないHTTPメソッドです。');
      case 408:
        return withFetcherReferenceInfo('リクエストがタイムアウトしました。');
      case 429:
        return withFetcherReferenceInfo(
          'リクエスト数が制限を超えました。しばらく待ってから再試行してください。',
        );
      case 500:
        return withFetcherReferenceInfo('サーバーエラーが発生しました。');
      case 502:
        return withFetcherReferenceInfo('ゲートウェイエラーが発生しました。');
      case 503:
        return withFetcherReferenceInfo('サービスが一時的に利用できません。');
      case 504:
        return withFetcherReferenceInfo(
          'ゲートウェイタイムアウトが発生しました。',
        );
      default:
        // Handle other HTTP status codes by range
        if (failure.status >= 400 && failure.status < 500) {
          const message = `クライアントエラーが発生しました (HTTP ${failure.status})。リクエスト内容を確認してください。`;
          return withFetcherReferenceInfo(message);
        }
        if (failure.status >= 500 && failure.status < 600) {
          const message = `サーバーエラーが発生しました (HTTP ${failure.status})。しばらく待ってから再試行してください。`;
          return withFetcherReferenceInfo(message);
        }
        {
          const message = `HTTPエラーが発生しました (HTTP ${failure.status})。`;
          return withFetcherReferenceInfo(message);
        }
    }
  }

  // Exhaustive handling of fetcher error codes.
  // If PROMIDAS adds a new FetcherErrorCode, this switch should fail to compile
  // until we explicitly decide how to present it in the demo site.
  switch (failure.code) {
    // HTTP-derived codes (status may not be observable in some environments)
    case 'CLIENT_UNAUTHORIZED':
      return withFetcherReferenceInfo(
        'APIトークンが無効です。設定を確認してください。',
      );
    case 'CLIENT_FORBIDDEN':
      return withFetcherReferenceInfo(
        'アクセスが拒否されました。APIトークンの権限を確認してください。',
      );
    case 'CLIENT_NOT_FOUND':
      return withFetcherReferenceInfo(
        'リクエストしたリソースが見つかりませんでした。',
      );
    case 'CLIENT_RATE_LIMITED':
      return withFetcherReferenceInfo(
        'リクエスト制限に達しました。しばらく待ってから再試行してください。',
      );
    case 'CLIENT_BAD_REQUEST':
      return withFetcherReferenceInfo(
        'リクエストが不正です。パラメータを確認してください。',
      );
    case 'CLIENT_METHOD_NOT_ALLOWED':
      return withFetcherReferenceInfo('許可されていないHTTPメソッドです。');
    case 'CLIENT_TIMEOUT':
      return withFetcherReferenceInfo(
        'リクエストがタイムアウトしました。再試行してください。',
      );
    case 'CLIENT_ERROR':
      return withFetcherReferenceInfo(
        'クライアントエラーが発生しました。リクエスト内容を確認してください。',
      );
    case 'SERVER_INTERNAL_ERROR':
    case 'SERVER_BAD_GATEWAY':
    case 'SERVER_GATEWAY_TIMEOUT':
    case 'SERVER_SERVICE_UNAVAILABLE':
    case 'SERVER_ERROR':
      return withFetcherReferenceInfo(
        'サーバーエラーが発生しました。しばらく待ってから再試行してください。',
      );

    // Network / control
    case 'NETWORK_ERROR':
      return withFetcherReferenceInfo(
        [
          'ネットワークエラーが発生しました。',
          '次のような原因が考えられます:',
          '- ネットワークがオフライン',
          '- サーバーが一時的に利用できない',
          '- ファイアウォールやプロキシの設定',
        ].join('\n'),
      );
    case 'ECONNREFUSED':
      return withFetcherReferenceInfo(
        'サーバーに接続できませんでした。サーバーが起動しているか確認してください。',
      );
    case 'ENOTFOUND':
      return withFetcherReferenceInfo(
        'サーバーが見つかりませんでした。URLを確認してください。',
      );
    case 'ETIMEDOUT':
    case 'TIMEOUT':
      return withFetcherReferenceInfo(
        'リクエストがタイムアウトしました。ネットワーク接続を確認してください。',
      );
    case 'ABORTED':
      return withFetcherReferenceInfo('リクエストがキャンセルされました。');

    // CORS
    case 'CORS_BLOCKED':
      return withFetcherReferenceInfo(
        [
          'APIサーバーとの通信がCORSポリシーによりブロックされました。',
          '最も可能性が高い原因:',
          '- APIトークンが未設定、または無効',
          '注: ProtoPedia API は Access-Control-Allow-Origin を付与しないため、PROMIDASでは401(認証エラー)を正しく判定出来ません。',
        ].join('\n'),
      );

    // Fallback
    case 'UNKNOWN':
      return withFetcherReferenceInfo(failure.message);
    /* c8 ignore next */
    default: {
      const _exhaustiveCheck: never = failure.code;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Converts store errors into user-friendly Japanese messages with troubleshooting information.
 *
 * @param failure - The store snapshot failure to parse
 * @returns Localized error message in Japanese with troubleshooting information
 * @internal Exported primarily for testing purposes
 */
export function parseStoreSnapshotFailure(
  failure: StoreSnapshotFailure,
): string {
  const localizeStoreDataState = (
    dataState: StoreSnapshotFailure['dataState'],
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

  const buildStoreFailureReferenceBlock = (
    currentLocalizedMessage: string,
  ): string => {
    const lines: string[] = [];

    lines.push(`エラーコード: ${failure.code}`);
    lines.push(`分類: ${failure.kind}`);
    lines.push(`dataState: ${failure.dataState}`);

    // Keep raw message as-is for stability (no parsing).
    // Avoid duplicating it when the localized message is already the raw message.
    if (failure.message && currentLocalizedMessage !== failure.message) {
      lines.push(`詳細: ${failure.message}`);
    }

    /* c8 ignore next 2 */
    if (lines.length === 0) {
      return '';
    }

    return `\n\n[参考情報]\n${lines.join('\n')}`;
  };

  const withStoreReferenceInfo = (localizedMessage: string): string => {
    /* c8 ignore next */
    return `${localizedMessage}${buildStoreFailureReferenceBlock(localizedMessage)}`;
  };

  // Exhaustive handling of store error codes.
  // If PROMIDAS adds a new StoreErrorCode, this switch should fail to compile
  // until we decide how to present it in the demo site.
  switch (failure.code) {
    case 'STORE_CAPACITY_EXCEEDED':
      return withStoreReferenceInfo(
        [
          'データサイズが制限を超えました。',
          localizeStoreDataState(failure.dataState),
          '次を試してください:',
          '- limitパラメータを減らす',
          '- ストアのmaxDataSizeBytesを増やす(設定可能な場合)',
        ].join('\n'),
      );
    case 'STORE_SERIALIZATION_FAILED':
      return withStoreReferenceInfo(
        [
          'データのシリアライズに失敗しました。',
          localizeStoreDataState(failure.dataState),
          'データ形式に問題がある可能性があります。',
        ].join('\n'),
      );
    case 'STORE_UNKNOWN':
      return withStoreReferenceInfo(
        [
          'ストレージエラーが発生しました。',
          localizeStoreDataState(failure.dataState),
        ].join('\n'),
      );
    /* c8 ignore next */
    default: {
      const _exhaustiveCheck: never = failure.code;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Returns the original error message as-is since no additional context is available.
 *
 * @param failure - The unknown snapshot failure to parse
 * @returns Localized error message in Japanese
 * @internal Exported primarily for testing purposes
 */
export function parseUnknownSnapshotFailure(
  failure: UnknownSnapshotFailure,
): string {
  return failure.message;
}

/**
 * Adds a localized message to the snapshot operation failure while preserving all properties.
 * origin (fetcher, store, or unknown) is used to choose the appropriate parser.
 *
 * @param failure - The snapshot operation failure to parse, or null
 * @returns Original error with localized message added, or null if input is null
 */
export function parseSnapshotOperationFailure(
  failure: SnapshotOperationFailure | null,
): ParsedSnapshotOperationFailure | null {
  if (!failure) {
    return null;
  }

  const localizedMessage = toLocalizedMessage(failure);
  return { ...failure, localizedMessage };
}

/**
 * Converts snapshot operation failures to user-friendly Japanese messages.
 * Returns a default message for null input.
 * Directly calls the appropriate parse function based on the error's origin
 * to avoid unnecessary object creation when only the message is needed.
 *
 * @param failure - The snapshot operation failure to convert, or null
 * @returns Localized error message in Japanese
 */
export function toLocalizedMessage(
  failure: SnapshotOperationFailure | null,
): string {
  if (!failure) {
    return '不明なエラーが発生しました。';
  }

  const origin = failure.origin;

  switch (origin) {
    case 'fetcher':
      return parseFetcherSnapshotFailure(failure);
    case 'store':
      return parseStoreSnapshotFailure(failure);
    case 'unknown':
      return parseUnknownSnapshotFailure(failure);
    /* c8 ignore next */
    default: {
      const _exhaustiveCheck: never = origin;
      return _exhaustiveCheck;
    }
  }
}
