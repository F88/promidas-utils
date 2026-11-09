---
title: インストールと更新
description: promidas-utilsのインストールと更新方法
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# インストールと更新

## 前提条件

- Node.js 22 以降
- npm 9 以降 (推奨 npm 10 以降)
- `promidas` 5.0.0 以降の 5.x

以前の `promidas` を使う場合は、対応する `promidas-utils` を使ってください。

| `promidas` | `promidas-utils` |
| ---------- | ---------------- |
| 5.x        | 5.x              |
| 4.x        | 4.x              |
| 3.x        | 3.x              |

## インストール

このパッケージは npm から直接インストールできます。

### 最新版のインストール

```bash
npm install promidas-utils
```

### 特定バージョンのインストール

```bash
npm install promidas-utils@5.0.0
```

## 更新

最新バージョンへの更新:

```bash
npm update promidas-utils
```

または、再インストール:

```bash
npm install promidas-utils
```

## 使用例

インストール後、公開パスから必要な機能をインポートできます:

```typescript
import { TokenManager, TOKEN_KEYS } from 'promidas-utils/token';
import { getStoreState } from 'promidas-utils/store';

const storage = TokenManager.forLocalStorage(
    TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);
```

詳細は [API リファレンス](/api) を参照してください。
