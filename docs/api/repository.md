---
title: リポジトリ管理
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# リポジトリ管理

## 概要

リポジトリ操作を使いやすくするユーティリティです。

## API

エントリーポイント: `promidas-utils/repository`

- 型: `ParsedSnapshotOperationFailure`
- 関数: `parseSnapshotOperationFailure`, `toLocalizedMessage`

> ルートパス `promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

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
- エラーの発生元 (fetcher, store, repository, unknown) に応じて適切な日本語メッセージを生成します
- 元のエラーオブジェクトの全てのプロパティを保持します

#### 使用例

```typescript
import { parseSnapshotOperationFailure } from 'promidas-utils/repository';

const result = await repository.getSnapshot(prototypeId);

if (!result.ok) {
    const parsed = parseSnapshotOperationFailure(result.failure);
    if (parsed) {
        console.error(parsed.localizedMessage);
        // 例: "データが見つかりません。" (404エラーの場合)
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
import { toLocalizedMessage } from 'promidas-utils/repository';

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

- `"APIトークンが無効です。設定を確認してください。"` (401)
- `"データが見つかりません。"` (404)
- `"サーバーエラーが発生しました。"` (500)
- `"クライアントエラーが発生しました (HTTP 418)。リクエスト内容を確認してください。"` (特定のハンドリングがないステータスコード)
- `"ネットワークエラーが発生しました。\n次のような原因が考えられます:\n- ネットワークがオフライン\n- サーバーが一時的に利用できない\n- ファイアウォールやプロキシの設定"`
- `"リクエストがタイムアウトしました。ネットワーク接続を確認してください。"`

### Store エラー

ローカルストレージへの保存失敗時に生成されるメッセージ:

- `STORE_CAPACITY_EXCEEDED`: データサイズが制限を超えた場合。既存のスナップショットの状態とトラブルシューティング提案を含む
- `STORE_SERIALIZATION_FAILED`: データのシリアライズに失敗した場合。データ形式に問題がある可能性を示唆
- `STORE_UNKNOWN`: 原因不明のストレージエラー。既存のスナップショットの状態を含む

例:

- `"データサイズが制限を超えました。\n既存のスナップショットは保持されます。\n次を試してください:\n- limitパラメータを減らす\n- ストアのmaxDataSizeBytesを増やす(設定可能な場合)"`
- `"データのシリアライズに失敗しました。\n既存のスナップショットは保持されます。\nデータ形式に問題がある可能性があります。"`
- `"ストレージエラーが発生しました。\n既存のスナップショットは保持されます。"`

### Repository エラー

リポジトリ層での検証やデータ処理の失敗時に生成されるメッセージ (`@f88/promidas` v1.1.0以降 / `promidas` v2.0.0以降):

- `REPOSITORY_VALIDATION_ERROR`: スナップショットデータの検証に失敗した場合 (Zodバリデーションエラー)
- `REPOSITORY_INVALID_STATE`: リポジトリの状態が不正な場合 (例: `setupSnapshot()` 実行前に `refreshSnapshot()` を呼び出し)
- `REPOSITORY_SIZE_ESTIMATION_ERROR`: データサイズの推定に失敗した場合
- `REPOSITORY_UNKNOWN`: 原因不明のリポジトリエラー

すべてのリポジトリエラーには以下の参照情報が含まれます:

- エラーコード
- 分類 (kind)
- 詳細メッセージ (localizedMessageと異なる場合のみ)

例:

- `"データの検証に失敗しました。データ形式が正しくありません。\n\n[参考情報]\nエラーコード: REPOSITORY_VALIDATION_ERROR\n分類: validation\n詳細: Invalid prototype data"`
- `"リポジトリの状態が不正です。先にsetupSnapshot()を実行してください。\n\n[参考情報]\nエラーコード: REPOSITORY_INVALID_STATE\n分類: invalid_state"`
- `"データサイズの推定に失敗しました。\n\n[参考情報]\nエラーコード: REPOSITORY_SIZE_ESTIMATION_ERROR\n分類: size_estimation"`
- `"リポジトリエラーが発生しました。\n\n[参考情報]\nエラーコード: REPOSITORY_UNKNOWN\n分類: unknown"`

### Unknown エラー

発生元が不明なエラーの場合、元のエラーメッセージをそのまま返します。
