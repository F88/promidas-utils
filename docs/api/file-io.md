---
title: ファイル I/O
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# ファイル I/O (Node.js 専用)

## 概要

`promidas` の `getSerializableSnapshot()` / `setupSnapshotFromSerializedData()` を利用し、スナップショットを JSON ファイルとして永続化・復元する Node.js 向けユーティリティです。ディレクトリの自動作成、一時ファイルを介したアトミックな書き込み、判別可能なエラー分類を提供します。

> **Node.js 専用**: これらの関数は `node:fs` / `node:path` / `node:crypto` を使用するため、ブラウザでは動作しません。このパスをブラウザ向けバンドル (Vite/rollup 等) に含めるとビルドに失敗します。ブラウザでスナップショットを復元する場合は、データを自前で用意 (fetch / `<input type="file">` / IndexedDB 等) して promidas の `repository.setupSnapshotFromSerializedData(data)` を直接呼び出してください。

## API

エントリーポイント: `promidas-utils/file-io`

- 関数: `exportSnapshotToFile`, `importSnapshotFromFile`
- 型: `FileExportResult`, `FileExportSuccess`, `FileExportFailure`, `FileImportResult`, `FileImportSuccess`, `FileImportFailure`, `FileIoError`, `FileIoErrorKind`, `ExportSnapshotOptions`

> ルートパス `promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

いずれの関数も例外を送出せず、結果は必ず判別可能ユニオン (`ok: true | false`) で返します。

以降の使用例に登場する `repository` は、`promidas` のファクトリで生成した `ProtopediaInMemoryRepository` です。生成方法の詳細は [promidas のファクトリ](https://f88.github.io/promidas/features/factory.html) を参照してください。

```typescript
import { createPromidasForLocal } from 'promidas';

const repository = createPromidasForLocal({
    protopediaApiToken: 'your-api-token',
});
```

> `exportSnapshotToFile` はスナップショットが読み込み済みのリポジトリを前提とします (例: 先に `repository.setupSnapshot()` で ProtoPedia API から取得しておく)。一方 `importSnapshotFromFile` はファイルから復元するため、事前の API アクセスは不要です (トークンの値も利用されません)。

## 関数

### `exportSnapshotToFile(repository, filePath, options?): Promise<FileExportResult>`

リポジトリのスナップショットを JSON ファイルへ書き出します。

- `repository`: `getSerializableSnapshot()` を持つオブジェクト (`Pick` で受けるため完全な `ProtopediaInMemoryRepository` も渡せます)
- `filePath`: 出力先パス。存在しない親ディレクトリは自動作成されます
- `options.pretty`: `true` で 2 スペース整形。既定は `false` (コンパクト)
- 書き込みは一意な一時ファイル (`<filePath>.<uuid>.tmp`) へ行い、成功時に `rename` で確定します

#### 使用例: exportSnapshotToFile

```typescript
import { exportSnapshotToFile } from 'promidas-utils/file-io';

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
- データ構造の検証は `promidas` 側が担います。検証に失敗した場合は `error.snapshotFailure` に元の `SnapshotOperationFailure` を保持するため、`toLocalizedMessage(error.snapshotFailure)` で日本語化できます (`toLocalizedMessage` は [`promidas-utils/repository`](/api/repository) から import します)

#### 使用例: importSnapshotFromFile

```typescript
import { importSnapshotFromFile } from 'promidas-utils/file-io';
import { toLocalizedMessage } from 'promidas-utils/repository';

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
