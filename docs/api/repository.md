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
- スナップショットファイル I/O (Node.js):
    - 関数: `exportSnapshotToFile`, `importSnapshotFromFile`
    - 型: `FileExportResult`, `FileExportSuccess`, `FileExportFailure`, `FileImportResult`, `FileImportSuccess`, `FileImportFailure`, `FileIoError`, `FileIoErrorKind`, `ExportSnapshotOptions`

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

#### 使用例: parseSnapshotOperationFailure

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

#### 使用例: toLocalizedMessage

```typescript
import { toLocalizedMessage } from 'promidas-utils/repository';

const result = await repository.getSnapshot(prototypeId);

if (!result.ok) {
    const message = toLocalizedMessage(result.failure);
    alert(message);
}
```

## スナップショットファイル I/O (Node.js)

`promidas` の `getSerializableSnapshot()` / `setupSnapshotFromSerializedData()` を利用し、スナップショットを JSON ファイルとして永続化・復元する Node.js 向けユーティリティです。ディレクトリの自動作成、一時ファイルを介したアトミックな書き込み、判別可能なエラー分類を提供します。

いずれの関数も例外を送出せず、結果は必ず判別可能ユニオン (`ok: true | false`) で返します。

以降の使用例に登場する `repository` は、`promidas` のファクトリで生成した `ProtopediaInMemoryRepository` です。生成方法の詳細は [promidas のファクトリ](https://f88.github.io/promidas/features/factory.html) を参照してください。

```typescript
import { createPromidasForLocal } from 'promidas';

const repository = createPromidasForLocal({
    protopediaApiToken: 'your-api-token',
});
```

> `exportSnapshotToFile` はスナップショットが読み込み済みのリポジトリを前提とします (例: 先に `repository.setupSnapshot()` で ProtoPedia API から取得しておく)。一方 `importSnapshotFromFile` はファイルから復元するため、事前の API アクセスは不要です (トークンの値も利用されません)。

### `exportSnapshotToFile(repository, filePath, options?): Promise<FileExportResult>`

リポジトリのスナップショットを JSON ファイルへ書き出します。

- `repository`: `getSerializableSnapshot()` を持つオブジェクト (`Pick` で受けるため完全な `ProtopediaInMemoryRepository` も渡せます)
- `filePath`: 出力先パス。存在しない親ディレクトリは自動作成されます
- `options.pretty`: `true` で 2 スペース整形。既定は `false` (コンパクト)
- 書き込みは一意な一時ファイル (`<filePath>.<uuid>.tmp`) へ行い、成功時に `rename` で確定します

#### 使用例: exportSnapshotToFile

```typescript
import { exportSnapshotToFile } from 'promidas-utils/repository';

// repository には取得済みのスナップショットがある前提 (例: await repository.setupSnapshot())
const result = await exportSnapshotToFile(repository, './data/snapshot.json', {
    pretty: true,
});

if (result.ok) {
    console.log(
        `Exported ${result.prototypesExported} prototypes (${result.bytesWritten} bytes)`,
    );
} else {
    console.error(`${result.error.kind}: ${result.error.message}`);
}
```

### `importSnapshotFromFile(repository, filePath): Promise<FileImportResult>`

JSON ファイルからスナップショットを読み込み、リポジトリへ復元します。

- `repository`: `setupSnapshotFromSerializedData()` を持つオブジェクト
- `filePath`: 読み込むファイルパス
- データ構造の検証は `promidas` 側が担います。検証に失敗した場合は `error.snapshotFailure` に元の `SnapshotOperationFailure` を保持するため、`toLocalizedMessage(error.snapshotFailure)` で日本語化できます

#### 使用例: importSnapshotFromFile

```typescript
import {
    importSnapshotFromFile,
    toLocalizedMessage,
} from 'promidas-utils/repository';

// ファイルから復元するため API アクセスは不要
const result = await importSnapshotFromFile(repository, './data/snapshot.json');

if (result.ok) {
    console.log(`Loaded ${result.prototypesLoaded} prototypes`);
} else if (result.error.kind === 'SETUP_FAILED') {
    console.error(toLocalizedMessage(result.error.snapshotFailure ?? null));
} else {
    console.error(`${result.error.kind}: ${result.error.message}`);
}
```

### エラー種別 (`FileIoErrorKind`)

`FileIoError.kind` は失敗した段階を表します。`FileIoError.code` には Node.js のファイルシステムエラーコード (`ENOENT`, `EACCES`, `ENOSPC` など) が入る場合があり、`FileIoError.cause` に元の例外を保持します。

- `SERIALIZE_FAILED`: `getSerializableSnapshot()` または `JSON.stringify()` が失敗
- `WRITE_FAILED`: `mkdir` / `writeFile` / `rename` が失敗
- `READ_FAILED`: `readFile` が失敗 (`ENOENT` を含む)
- `PARSE_FAILED`: `JSON.parse()` が失敗
- `SETUP_FAILED`: `setupSnapshotFromSerializedData()` が `{ ok: false }` を返した

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
