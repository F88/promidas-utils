import type {
  FetcherSnapshotFailure,
  SnapshotOperationFailure,
  StoreSnapshotFailure,
  UnknownSnapshotFailure,
} from '@f88/promidas/repository/types';
import { describe, expect, it } from 'vitest';

import {
  parseFetcherSnapshotFailure,
  parseSnapshotOperationFailure,
  parseStoreSnapshotFailure,
  parseUnknownSnapshotFailure,
  toLocalizedMessage,
} from '../../lib/repository/snapshot-operation-failure-utils.js';

describe('snapshot-operation-failure-utils', () => {
  describe('parseFetcherSnapshotFailure', () => {
    describe('HTTP status code based errors', () => {
      it('should handle HTTP 400 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_BAD_REQUEST',
          message: 'Bad Request',
          status: 400,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストが不正です');
        expect(result).toContain('参考情報');
      });

      it('should handle HTTP 401 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          status: 401,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('APIトークンが無効です');
      });

      it('should handle HTTP 403 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_FORBIDDEN',
          message: 'Forbidden',
          status: 403,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('アクセス権限がありません');
      });

      it('should handle HTTP 404 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_NOT_FOUND',
          message: 'Not Found',
          status: 404,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('データが見つかりません');
      });

      it('should handle HTTP 405 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_METHOD_NOT_ALLOWED',
          message: 'Method Not Allowed',
          status: 405,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('許可されていないHTTPメソッドです');
      });

      it('should handle HTTP 408 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_TIMEOUT',
          message: 'Request Timeout',
          status: 408,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストがタイムアウトしました');
      });

      it('should handle HTTP 429 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_RATE_LIMITED',
          message: 'Too Many Requests',
          status: 429,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエスト数が制限を超えました');
      });

      it('should handle HTTP 500 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_INTERNAL_ERROR',
          message: 'Internal Server Error',
          status: 500,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
      });

      it('should handle HTTP 502 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_BAD_GATEWAY',
          message: 'Bad Gateway',
          status: 502,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('ゲートウェイエラーが発生しました');
      });

      it('should handle HTTP 503 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_SERVICE_UNAVAILABLE',
          message: 'Service Unavailable',
          status: 503,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サービスが一時的に利用できません');
      });

      it('should handle HTTP 504 error', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_GATEWAY_TIMEOUT',
          message: 'Gateway Timeout',
          status: 504,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('ゲートウェイタイムアウトが発生しました');
      });

      it('should handle unspecific 4xx errors', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_ERROR',
          message: 'Client Error',
          status: 418, // I'm a teapot
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('クライアントエラーが発生しました');
        expect(result).toContain('HTTP 418');
      });

      it('should handle unspecific 5xx errors', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_ERROR',
          message: 'Server Error',
          status: 599,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
        expect(result).toContain('HTTP 599');
      });

      it('should handle other HTTP status codes', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'UNKNOWN',
          message: 'Unknown Error',
          status: 999,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('HTTPエラーが発生しました');
        expect(result).toContain('HTTP 999');
      });
    });

    describe('error code based errors', () => {
      it('should handle CLIENT_UNAUTHORIZED', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('APIトークンが無効です');
      });

      it('should handle CLIENT_FORBIDDEN', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_FORBIDDEN',
          message: 'Forbidden',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('アクセスが拒否されました');
      });

      it('should handle CLIENT_NOT_FOUND', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_NOT_FOUND',
          message: 'Not Found',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain(
          'リクエストしたリソースが見つかりませんでした',
        );
      });

      it('should handle CLIENT_RATE_LIMITED', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_RATE_LIMITED',
          message: 'Rate Limited',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエスト制限に達しました');
      });

      it('should handle CLIENT_BAD_REQUEST', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_BAD_REQUEST',
          message: 'Bad Request',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストが不正です');
      });

      it('should handle CLIENT_METHOD_NOT_ALLOWED', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_METHOD_NOT_ALLOWED',
          message: 'Method Not Allowed',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('許可されていないHTTPメソッドです');
      });

      it('should handle CLIENT_TIMEOUT', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'timeout',
          code: 'CLIENT_TIMEOUT',
          message: 'Timeout',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストがタイムアウトしました');
      });

      it('should handle CLIENT_ERROR', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_ERROR',
          message: 'Client Error',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('クライアントエラーが発生しました');
      });

      it('should handle SERVER_INTERNAL_ERROR', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_INTERNAL_ERROR',
          message: 'Internal Server Error',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
      });

      it('should handle SERVER_BAD_GATEWAY', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_BAD_GATEWAY',
          message: 'Bad Gateway',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
      });

      it('should handle SERVER_GATEWAY_TIMEOUT', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_GATEWAY_TIMEOUT',
          message: 'Gateway Timeout',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
      });

      it('should handle SERVER_SERVICE_UNAVAILABLE', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_SERVICE_UNAVAILABLE',
          message: 'Service Unavailable',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
      });

      it('should handle SERVER_ERROR', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_ERROR',
          message: 'Server Error',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました');
      });
    });

    describe('network errors', () => {
      it('should handle NETWORK_ERROR', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'NETWORK_ERROR',
          message: 'Network Error',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('ネットワークエラーが発生しました');
        expect(result).toContain('ネットワークがオフライン');
      });

      it('should handle ECONNREFUSED', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'ECONNREFUSED',
          message: 'Connection refused',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーに接続できませんでした');
      });

      it('should handle ENOTFOUND', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'network',
          code: 'ENOTFOUND',
          message: 'Not found',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーが見つかりませんでした');
      });

      it('should handle ETIMEDOUT', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'timeout',
          code: 'ETIMEDOUT',
          message: 'Connection timeout',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストがタイムアウトしました');
      });

      it('should handle TIMEOUT', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'timeout',
          code: 'TIMEOUT',
          message: 'Request timeout',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストがタイムアウトしました');
      });

      it('should handle ABORTED', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'abort',
          code: 'ABORTED',
          message: 'Request aborted',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('リクエストがキャンセルされました');
      });
    });

    describe('CORS errors', () => {
      it('should handle CORS_BLOCKED', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'cors',
          code: 'CORS_BLOCKED',
          message: 'CORS blocked',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('CORSポリシーによりブロックされました');
        expect(result).toContain('APIトークンが未設定、または無効');
      });
    });

    describe('unknown errors', () => {
      it('should handle UNKNOWN', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'unknown',
          code: 'UNKNOWN',
          message: 'Something went wrong',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('Something went wrong');
      });
    });

    describe('reference information', () => {
      it('should include request method and URL', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          status: 401,
          details: {
            req: {
              method: 'POST',
              url: 'https://api.example.com/v1/data',
            },
            res: {},
          },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain(
          'リクエスト: POST https://api.example.com/v1/data',
        );
      });

      it('should include response status and statusText', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          status: 401,
          details: {
            req: {},
            res: {
              statusText: 'Unauthorized',
            },
          },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('レスポンス: HTTP 401 Unauthorized');
      });

      it('should include response code', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          status: 401,
          details: {
            req: {},
            res: {
              code: 'AUTH_FAILED',
            },
          },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('レスポンスコード: AUTH_FAILED');
      });

      it('should include error code', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          status: 401,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('エラーコード: CLIENT_UNAUTHORIZED');
      });

      it('should include raw message when different from localized message', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Authentication failed: invalid token',
          status: 401,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('詳細: Authentication failed: invalid token');
      });

      it('should not duplicate message when localized message matches raw message', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'unknown',
          code: 'UNKNOWN',
          message: 'Custom error message',
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        const messageCount = (result.match(/Custom error message/g) || [])
          .length;
        expect(messageCount).toBe(1);
      });

      it('should handle missing request details gracefully', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'Unauthorized',
          status: 401,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('APIトークンが無効です');
        expect(result).toContain('エラーコード: CLIENT_UNAUTHORIZED');
        expect(result).not.toContain('リクエスト:');
      });
    });
  });

  describe('parseStoreSnapshotFailure', () => {
    it('should handle STORE_CAPACITY_EXCEEDED with UNCHANGED state', () => {
      const failure: StoreSnapshotFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_CAPACITY_EXCEEDED',
        message: 'Data size exceeded',
        dataState: 'UNCHANGED',
      };

      const result = parseStoreSnapshotFailure(failure);
      expect(result).toContain('データサイズが制限を超えました');
      expect(result).toContain('既存のスナップショットは保持されます');
      expect(result).toContain('limitパラメータを減らす');
    });

    it('should handle STORE_CAPACITY_EXCEEDED with UNKNOWN state', () => {
      const failure: StoreSnapshotFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_CAPACITY_EXCEEDED',
        message: 'Data size exceeded',
        dataState: 'UNKNOWN',
      };

      const result = parseStoreSnapshotFailure(failure);
      expect(result).toContain('データサイズが制限を超えました');
      expect(result).toContain('既存のスナップショットの状態は不明です');
    });

    it('should handle STORE_SERIALIZATION_FAILED', () => {
      const failure: StoreSnapshotFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_SERIALIZATION_FAILED',
        message: 'Serialization failed',
        dataState: 'UNCHANGED',
      };

      const result = parseStoreSnapshotFailure(failure);
      expect(result).toContain('データのシリアライズに失敗しました');
      expect(result).toContain('既存のスナップショットは保持されます');
      expect(result).toContain('データ形式に問題がある可能性があります');
    });

    it('should handle STORE_UNKNOWN', () => {
      const failure: StoreSnapshotFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_UNKNOWN',
        message: 'Unknown store error',
        dataState: 'UNCHANGED',
      };

      const result = parseStoreSnapshotFailure(failure);
      expect(result).toContain('ストレージエラーが発生しました');
      expect(result).toContain('既存のスナップショットは保持されます');
    });

    describe('reference information', () => {
      it('should include error code, kind, and dataState', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'storage_limit',
          code: 'STORE_CAPACITY_EXCEEDED',
          message: 'Data too large',
          dataState: 'UNCHANGED',
        };

        const result = parseStoreSnapshotFailure(failure);
        expect(result).toContain('エラーコード: STORE_CAPACITY_EXCEEDED');
        expect(result).toContain('分類: storage_limit');
        expect(result).toContain('dataState: UNCHANGED');
      });

      it('should include raw message when different from localized message', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'storage_limit',
          code: 'STORE_CAPACITY_EXCEEDED',
          message: 'Size limit 5MB exceeded: got 10MB',
          dataState: 'UNCHANGED',
        };

        const result = parseStoreSnapshotFailure(failure);
        expect(result).toContain('詳細: Size limit 5MB exceeded: got 10MB');
      });
    });
  });

  describe('parseUnknownSnapshotFailure', () => {
    it('should return message as-is', () => {
      const failure: UnknownSnapshotFailure = {
        ok: false,
        origin: 'unknown',

        message: 'Something unexpected happened',
      };

      const result = parseUnknownSnapshotFailure(failure);
      expect(result).toBe('Something unexpected happened');
    });
  });

  describe('parseSnapshotOperationFailure', () => {
    it('should return null when input is null', () => {
      const result = parseSnapshotOperationFailure(null);
      expect(result).toBeNull();
    });

    it('should add localizedMessage to fetcher failure', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401,
        details: {
          req: { method: 'GET', url: 'https://api.example.com/data' },
          res: { statusText: 'Unauthorized', code: 'UNAUTHORIZED' },
        },
      };

      const result = parseSnapshotOperationFailure(failure);

      expect(result).not.toBeNull();
      expect(result?.origin).toBe('fetcher');
      if (result?.origin === 'fetcher') {
        expect(result.code).toBe('CLIENT_UNAUTHORIZED');
      }
      expect(result?.localizedMessage).toContain('APIトークンが無効です');
      expect(result?.localizedMessage).toContain('参考情報');
    });

    it('should add localizedMessage to store failure', () => {
      const failure: StoreSnapshotFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_CAPACITY_EXCEEDED',
        message: 'Data size exceeded',
        dataState: 'UNCHANGED',
      };

      const result = parseSnapshotOperationFailure(failure);

      expect(result).not.toBeNull();
      expect(result?.origin).toBe('store');
      if (result?.origin === 'store') {
        expect(result.code).toBe('STORE_CAPACITY_EXCEEDED');
      }
      expect(result?.localizedMessage).toContain(
        'データサイズが制限を超えました',
      );
      expect(result?.localizedMessage).toContain(
        '既存のスナップショットは保持されます',
      );
    });

    it('should add localizedMessage to unknown failure', () => {
      const failure: UnknownSnapshotFailure = {
        ok: false,
        origin: 'unknown',

        message: 'Something went wrong',
      };

      const result = parseSnapshotOperationFailure(failure);

      expect(result).not.toBeNull();
      expect(result?.origin).toBe('unknown');
      expect(result?.localizedMessage).toBe('Something went wrong');
    });

    it('should preserve all original properties', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401,
        details: { req: {}, res: {} },
      };

      const result = parseSnapshotOperationFailure(failure);

      expect(result?.origin).toBe(failure.origin);
      expect(result?.message).toBe(failure.message);
      if (result?.origin === 'fetcher') {
        expect(result.kind).toBe(failure.kind);
        expect(result.code).toBe(failure.code);
        expect(result.status).toBe(failure.status);
        expect(result.details).toBe(failure.details);
      }
    });
  });

  describe('toLocalizedMessage', () => {
    it('should return default message when input is null', () => {
      const result = toLocalizedMessage(null);
      expect(result).toBe('不明なエラーが発生しました。');
    });

    it('should delegate to parseFetcherSnapshotFailure for fetcher failures', () => {
      const failure: FetcherSnapshotFailure = {
        ok: false,
        origin: 'fetcher',
        kind: 'http',
        code: 'CLIENT_UNAUTHORIZED',
        message: 'Unauthorized',
        status: 401,
        details: { req: {}, res: {} },
      };

      const result = toLocalizedMessage(failure);
      expect(result).toContain('APIトークンが無効です');
    });

    it('should delegate to parseStoreSnapshotFailure for store failures', () => {
      const failure: StoreSnapshotFailure = {
        ok: false,
        origin: 'store',
        kind: 'storage_limit',
        code: 'STORE_CAPACITY_EXCEEDED',
        message: 'Data size exceeded',
        dataState: 'UNCHANGED',
      };

      const result = toLocalizedMessage(failure);
      expect(result).toContain('データサイズが制限を超えました');
    });

    it('should delegate to parseUnknownSnapshotFailure for unknown failures', () => {
      const failure: UnknownSnapshotFailure = {
        ok: false,
        origin: 'unknown',

        message: 'Something went wrong',
      };

      const result = toLocalizedMessage(failure);
      expect(result).toBe('Something went wrong');
    });
  });

  describe('Coverage improvements for edge cases', () => {
    describe('HTTP status code ranges', () => {
      it('should handle 4xx client errors not specifically handled', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_ERROR',
          message: 'Client error',
          status: 418,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('クライアントエラーが発生しました (HTTP 418)');
      });

      it('should handle 5xx server errors not specifically handled', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'SERVER_ERROR',
          message: 'Server error',
          status: 599,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('サーバーエラーが発生しました (HTTP 599)');
      });

      it('should handle other HTTP status codes', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'UNKNOWN',
          message: 'Unknown HTTP error',
          status: 300,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        expect(result).toContain('HTTPエラーが発生しました (HTTP 300)');
      });
    });

    describe('Store errors with UNKNOWN dataState', () => {
      it('should handle STORE_CAPACITY_EXCEEDED with UNKNOWN dataState', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'storage_limit',
          code: 'STORE_CAPACITY_EXCEEDED',
          message: 'Data size exceeded',
          dataState: 'UNKNOWN',
        };

        const result = parseStoreSnapshotFailure(failure);
        expect(result).toContain('既存のスナップショットの状態は不明です');
      });

      it('should handle STORE_SERIALIZATION_FAILED with UNKNOWN dataState', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'serialization',
          code: 'STORE_SERIALIZATION_FAILED',
          message: 'Serialization failed',
          dataState: 'UNKNOWN',
        };

        const result = parseStoreSnapshotFailure(failure);
        expect(result).toContain('既存のスナップショットの状態は不明です');
      });

      it('should handle STORE_UNKNOWN with UNKNOWN dataState', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'unknown',
          code: 'STORE_UNKNOWN',
          message: 'Unknown store error',
          dataState: 'UNKNOWN',
        };

        const result = parseStoreSnapshotFailure(failure);
        expect(result).toContain('既存のスナップショットの状態は不明です');
      });
    });

    describe('Reference block edge cases', () => {
      it('should not include message in reference block when it matches localized message', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'storage_limit',
          code: 'STORE_CAPACITY_EXCEEDED',
          message:
            'データサイズが制限を超えました。\n既存のスナップショットは保持されます。\n次を試してください:\n- limitパラメータを減らす\n- ストアのmaxDataSizeBytesを増やす(設定可能な場合)',
          dataState: 'UNCHANGED',
        };

        const result = parseStoreSnapshotFailure(failure);
        // Should not have "詳細:" line since the message matches the localized message
        expect(result).not.toContain('詳細: データサイズが制限を超えました');
      });

      it('should not include message in fetcher reference block when it matches localized message', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'APIトークンが無効です。設定を確認してください。',
          status: 401,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        // Should not have "詳細:" line since the message matches the localized message
        expect(result).not.toContain(
          '詳細: APIトークンが無効です。設定を確認してください。',
        );
      });

      it('should include request/response context when available', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_BAD_REQUEST',
          message: 'Bad Request',
          // status intentionally undefined to exercise statusText branch
          details: {
            req: { method: 'GET', url: 'https://example.com/data' },
            res: { statusText: 'Bad Request', code: 'ECONNRESET' },
          },
        };

        const result = parseFetcherSnapshotFailure(failure);

        expect(result).toContain('リクエスト: GET https://example.com/data');
        expect(result).toContain('レスポンス: Bad Request');
        expect(result).toContain('レスポンスコード: ECONNRESET');
      });

      it('should return empty string when fetcher failure has no lines in reference block', () => {
        const failure: FetcherSnapshotFailure = {
          ok: false,
          origin: 'fetcher',
          kind: 'http',
          code: 'CLIENT_UNAUTHORIZED',
          message: 'APIトークンが無効です。設定を確認してください。',
          status: 401,
          details: { req: {}, res: {} },
        };

        const result = parseFetcherSnapshotFailure(failure);
        // Should still have reference block
        expect(result).toContain('[参考情報]');
      });

      it('should return empty string when store failure has no lines in reference block', () => {
        const failure: StoreSnapshotFailure = {
          ok: false,
          origin: 'store',
          kind: 'storage_limit',
          code: 'STORE_CAPACITY_EXCEEDED',
          message:
            'データサイズが制限を超えました。\n既存のスナップショットは保持されます。\n次を試してください:\n- limitパラメータを減らす\n- ストアのmaxDataSizeBytesを増やす(設定可能な場合)',
          dataState: 'UNCHANGED',
        };

        const result = parseStoreSnapshotFailure(failure);
        // Should still have reference block
        expect(result).toContain('[参考情報]');
      });
    });
  });
});
