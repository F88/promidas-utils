---
lang: ja
title: Utilities for Snapshot Operation Result
title-en: Utilities for Snapshot Operation Result
title-ja: スナップショット操作結果ユーティリティ
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Utilities for Snapshot Operation Result

エントリーポイント: `@f88/promidas-utils/repository`

公開 API:

- 型: `ParsedSnapshotOperationFailure`
- 関数: `parseSnapshotOperationFailure`, `toLocalizedMessage`

> ルートパス `@f88/promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

## 型

### `ParsedSnapshotOperationFailure`

ローカライズされたメッセージを持つスナップショット操作エラー。

元の `SnapshotOperationFailure` 型に `localizedMessage` プロパティを追加した型です。

```typescript
type ParsedSnapshotOperationFailure = SnapshotOperationFailure & {
    localizedMessage: string;
};
```

## 関数

### `parseSnapshotOperationFailure(failure: SnapshotOperationFailure | null): ParsedSnapshotOperationFailure | null`

スナップショット操作エラーを解析し、ローカライズされたメッセージを追加します。

- `failure` が `null` の場合は `null` を返します
- エラーの発生元 (fetcher, store, unknown) に応じて適切な日本語メッセージを生成します
- 元のエラーオブジェクトの全てのプロパティを保持します

#### 使用例

```typescript
import { parseSnapshotOperationFailure } from '@f88/promidas-utils/repository';

const result = await repository.getSnapshot(prototypeId);

if (!result.ok) {
    const parsed = parseSnapshotOperationFailure(result.failure);
    if (parsed) {
        console.error(parsed.localizedMessage);
        // 例: "リクエストが失敗しました (404 Not Found)"
    }
}
```

### `toLocalizedMessage(failure: SnapshotOperationFailure | null): string`

スナップショット操作エラーを日本語メッセージに変換します。

- `failure` が `null` の場合は `"不明なエラーが発生しました"` を返します
- エラーの発生元に応じて適切な日本語メッセージを生成します
- オブジェクトの作成を避け、メッセージのみが必要な場合に効率的です

#### 使用例

```typescript
import { toLocalizedMessage } from '@f88/promidas-utils/repository';

const result = await repository.getSnapshot(prototypeId);

if (!result.ok) {
    const message = toLocalizedMessage(result.failure);
    alert(message);
}
```

## エラーメッセージの種類

### Fetcher エラー

APIリクエストの失敗時に生成されるメッセージ。以下の情報を含みます:

- HTTPステータスコード (400, 404, 500など)
- エラーコード (CLIENT_ERROR, SERVER_ERROR など)
- ネットワークエラー (NETWORK_ERROR, TIMEOUT など)
- リクエスト情報 (メソッド、URL)
- レスポンス情報 (ステータステキスト、コード)

例:

- `"リクエストが失敗しました (404 Not Found)"`
- `"サーバーエラーが発生しました (500)"`
- `"ネットワークエラーが発生しました"`
- `"リクエストがタイムアウトしました"`

### Store エラー

ローカルストレージへの保存失敗時に生成されるメッセージ:

- `storage_limit`: `"ストレージ容量が不足しています"`
- `serialization`: `"データのシリアライズに失敗しました"`
- `unknown`: `"ストレージへの保存に失敗しました"`

### Unknown エラー

発生元が不明なエラーの場合、元のエラーメッセージをそのまま返します。
