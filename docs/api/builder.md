---
lang: ja
title: Utilities for Builder Error Handling
title-en: Utilities for Builder Error Handling
title-ja: ビルダーエラー処理ユーティリティ
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Utilities for Builder Error Handling

エントリーポイント: `@f88/promidas-utils/builder`

公開 API:

- 関数: `toErrorMessage`

> ルートパス `@f88/promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

## 概要

`PromidasRepositoryBuilder.build()` が投げるエラーを日本語メッセージに変換するユーティリティです。ストア関連エラー (`ConfigurationError`, `DataSizeExceededError`, `SizeEstimationError`, `StoreError`) と汎用エラー (`Error`) に対応します。

## 関数

### `toErrorMessage(error: Error): string`

ビルドエラーをユーザーフレンドリーな日本語メッセージに変換します。

**パラメータ:**

- `error: Error` - 変換対象のエラー

**戻り値:**

- `string` - 日本語のローカライズされたエラーメッセージ

**対応するエラー型:**

1. `DataSizeExceededError` - データサイズが制限を超えた場合
2. `SizeEstimationError` - データサイズの推定に失敗した場合
3. `ConfigurationError` - ストアの設定が無効な場合
4. `StoreError` - その他のストアエラー
5. `Error` - 汎用エラー (APIトークンエラーなど)

**使用例:**

```typescript
import { PromidasRepositoryBuilder } from '@f88/promidas';
import { toErrorMessage } from '@f88/promidas-utils/builder';

try {
    const repo = new PromidasRepositoryBuilder()
        .setStoreConfig({ maxDataSizeBytes: 50 * 1024 * 1024 }) // Invalid: exceeds 30 MiB
        .build();
} catch (error) {
    console.error(toErrorMessage(error));
    // Output:
    // ストアの設定が無効です。
    // 次を確認してください:
    // - maxDataSizeBytesが30 MiBを超えていないか
    // - 設定値の型や範囲が正しいか
    //
    // [参考情報]
    // エラー種別: ConfigurationError
    // 詳細: ...
}
```

**出力形式:**

各エラーメッセージは以下の構造を持ちます:

1. メインメッセージ (日本語)
2. トラブルシューティング提案
3. 参考情報ブロック:
    - エラー種別
    - エラー固有の詳細情報 (データサイズ、dataStateなど)
    - 元のエラーメッセージ (重複しない場合)

**エラー型別の出力例:**

**ConfigurationError:**

```plaintext
ストアの設定が無効です。
次を確認してください:
- maxDataSizeBytesが30 MiBを超えていないか
- 設定値の型や範囲が正しいか

[参考情報]
エラー種別: ConfigurationError
詳細: maxDataSizeBytes must not exceed 30 MiB
```

**DataSizeExceededError:**

```plaintext
データサイズが制限を超えました。
既存のスナップショットは保持されます。
次を試してください:
- limitパラメータを減らす
- ストアのmaxDataSizeBytesを増やす

[参考情報]
エラー種別: DataSizeExceededError
データサイズ: 2000000 バイト
最大サイズ: 1000000 バイト
dataState: UNCHANGED
```

**SizeEstimationError:**

```plaintext
データサイズの推定に失敗しました。
既存のスナップショットは保持されます。
次のような原因が考えられます:
- データに循環参照が含まれている
- JSONシリアライズできない型が含まれている

[参考情報]
エラー種別: SizeEstimationError
dataState: UNCHANGED
原因: Converting circular structure to JSON
```

**汎用Error (APIトークンエラー):**

```plaintext
APIトークンが設定されていません
```

**汎用Error (その他):**

```plaintext
不明なエラーが発生しました: [元のエラーメッセージ]
```

## 注意事項

- 内部関数 (`parseConfigurationError`, `parseDataSizeExceededError`, `parseSizeEstimationError`, `parseStoreError`, `parseError`) は `@internal` タグ付きでテスト目的のみにエクスポートされています。直接使用せず `toErrorMessage` を使用してください。
- エラーメッセージは日本語で出力されます。
- 参考情報ブロックの「詳細」フィールドは、ローカライズメッセージに元のメッセージが含まれていない場合のみ表示されます。
