---
lang: ja
title: Utilities for Store Management
title-en: Utilities for Store Management
title-ja: ストア管理ユーティリティ
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Utilities for Store Management

エントリーポイント: `promidas-utils/store`

公開 API:

- 型: `StoreState`
- 関数: `getStoreState`

> ルートパス `promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

## 型

### `StoreState`

キャッシュ状態を表すユニオン型。

- `'not-stored'`
- `'stored'`
- `'expired'`

## 関数

### `getStoreState(stats: PrototypeInMemoryStats | null): StoreState`

ProtoPedia の `PrototypeInMemoryStats` から状態を判定します。

- `stats` が `null` または `cachedAt` が `null` の場合 `'not-stored'`
- `stats.isExpired` が `true` の場合 `'expired'`
- それ以外は `'stored'`

### 使用例

```typescript
import { getStoreState } from 'promidas-utils/store';

const state = getStoreState(stats);
if (state === 'expired') {
    // Refresh data
}
```
