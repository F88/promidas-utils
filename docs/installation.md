---
lang: ja
title: Installation and Update
title-en: Installation and Updated
title-ja: インストールと更新
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

## インストール

このパッケージは GitHub リポジトリから直接インストールできます。

### 最新版のインストール

```bash
npm install github:F88/promidas-utils
```

### 特定バージョンのインストール

```bash
npm install github:F88/promidas-utils#v0.1.0
```

## 更新

最新バージョンへの更新:

```bash
npm update @f88/promidas-utils
```

または、再インストール:

```bash
npm install github:F88/promidas-utils
```

## 使用例

インストール後、公開パスから必要な機能をインポートできます:

```typescript
import { TokenManager, TOKEN_KEYS } from '@f88/promidas-utils/token';
import { getStoreState } from '@f88/promidas-utils/store';

const storage = TokenManager.forLocalStorage(
    TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);
```

詳細は [API リファレンス](/api) を参照してください。
