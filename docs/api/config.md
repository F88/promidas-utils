---
lang: ja
title: Utilities for Config Management
title-en: Utilities for Config Management
title-ja: 設定値管理ユーティリティ
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# Utilities for Config Management

エントリーポイント: `@f88/promidas-utils/config`

公開 API:

- 型: `ConfigIdentifier`, `ReadOnlyConfigStorage`, `ConfigStorage`
- クラス: `ConfigManager`
- エラー: `EnvironmentUnavailableError`

> ルートパス `@f88/promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

## 型

### `ConfigIdentifier`

設定値を識別するキー(文字列型)。

### `ReadOnlyConfigStorage`

- `has(): Promise<boolean>`
- `get(): Promise<string | null>`

### `ConfigStorage` (`ReadOnlyConfigStorage` を拡張)

- `save(value: string): Promise<void>`
- `remove(): Promise<void>`

## クラス

### `ConfigManager`

設定値ストレージのファクトリ。

- `static forLocalStorage(key: ConfigIdentifier): ConfigStorage`
    - `localStorage` を使用。永続保存。
    - 非ブラウザなど Web Storage が無い環境では呼び出し時に `EnvironmentUnavailableError` が発生します。
- `static forEnv(key: ConfigIdentifier): ReadOnlyConfigStorage`
    - `process.env` から読み取る読み取り専用ストレージ。
    - `process.env` が無い環境では呼び出し時に `EnvironmentUnavailableError` が発生します。

### 使用例

```typescript
import { ConfigManager } from '@f88/promidas-utils/config';

const storage = ConfigManager.forLocalStorage('API_BASE_URL');
await storage.save('https://api.example.com');
const url = await storage.get();
```
