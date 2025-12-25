---
title: token API
lang: ja
title-en: token api
---

# token API

エントリーポイント: `@f88/promidas-utils/token`

公開 API:

- 定数: `TOKEN_KEYS`
- 型: `TokenIdentifier`, `ReadOnlyTokenStorage`, `TokenStorage`
- クラス: `TokenManager`

> ルートパス `@f88/promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

## 定数

### `TOKEN_KEYS`

ProtoPedia API v2 用トークンキー定数。ブラウザストレージと環境変数で共通利用します。

## 型

### `TokenIdentifier`

`TOKEN_KEYS` の値型。`TokenManager` のキー引数で利用します。

### `ReadOnlyTokenStorage`

- `has(): Promise<boolean>`
- `get(): Promise<string | null>`

### `TokenStorage` (`ReadOnlyTokenStorage` を拡張)

- `save(token: string): Promise<void>`
- `remove(): Promise<void>`

## クラス

### `TokenManager`

トークンストレージのファクトリ。

- `static forSessionStorage(key: TokenIdentifier): TokenStorage`
    - `sessionStorage` を使用。タブ/ウィンドウ終了で破棄。
- `static forLocalStorage(key: TokenIdentifier): TokenStorage`
    - `localStorage` を使用。永続保存。
- `static forEnv(key: TokenIdentifier): ReadOnlyTokenStorage`
    - `process.env` から読み取る読み取り専用ストレージ。`your_token_here` は無効として `null` を返す。

### 使用例

```typescript
import { TokenManager, TOKEN_KEYS } from '@f88/promidas-utils/token';

const storage = TokenManager.forLocalStorage(
    TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN,
);
await storage.save('my-token');
const token = await storage.get();
```
