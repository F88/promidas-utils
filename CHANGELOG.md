<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.0] - 2026-11-09

この版は promidas 5.x 向けです。

### BREAKING CHANGES

- **Peer dependency**: `promidas` の要件を `^5.0.0` に変更しました (以前は `^4.0.0`)
    - `promidas` 4.x を使う場合は `promidas-utils` 4.x を使ってください
- **リポジトリ**: promidas 5 の失敗の変更に対応しました
    - `CORS_BLOCKED` の文言は `BROWSER_FETCH_FAILED` に表示されます
    - `[参考情報]` の `通信エラーコード` は `details.causeCode` を表示します。promidas が作った値 (`TIMEOUT` など) は届かなくなりました

## [4.0.0] - 2026-11-09

この版は promidas 4.x 向けです。

### BREAKING CHANGES

- **Peer dependency**: `promidas` の要件を `^4.0.0` に変更しました (以前は `>=3.0.0`)
    - `promidas` 3.x を使う場合は `promidas-utils` 3.x を使ってください
    - 上限を設けたので、今後の `promidas` のメジャー版は確認してから対応します
- **リポジトリ**: `parseFetcherSnapshotFailure()` の文言を変更しました。文言の文字列に依存しているコードは確認してください
    - `CORS_BLOCKED`: CORS と断定せず、原因を特定できないことを案内します。ブラウザでは、CORS のブロックと接続の失敗を区別できないためです
    - `NETWORK_ERROR`: 原因に「通信が途中で切断された」を追加しました
    - `TIMEOUT`: `limit` と `timeoutMs` も案内します。`timeoutMs` が本文の受信完了までを含むようになったためです。`ETIMEDOUT` は変わりません
    - `[参考情報]`: `レスポンスコード` を `通信エラーコード` に変更し、`エラーコード` と同じ値なら表示しません。応答のコードではないためです。store と repository に合わせて、`エラーコード`、`分類` の順に表示します

### Fixed

- **ビルダー**: `toErrorMessage()` で API トークンの未設定を判定できない問題を修正
    - `protopedia-api-v2-client` 4.0.0 でエラーメッセージが変わり、`不明なエラーが発生しました: Missing API token. ...` と表示されていました
    - `createPromidasForServer()` のトークン未設定も判定できるようにしました
- **リポジトリ**: 正常なステータスで応答を処理できない場合に、`HTTPエラーが発生しました (HTTP 200)` と表示される問題を修正

### Changed

- **CI**: Node.js 22、24、26 でテストするようにしました
- **開発**: Vitest 5 など、開発用の依存を更新しました
- **セキュリティ**: GitHub Actions のロックファイル (`.github/workflows/actions.lock`) を導入しました。直接と間接のすべての Action を確認済みのコミットに固定し、`verify-lockfile` ワークフローが PR と `main` への push で検証します
- **CI**: 無効にしていた `publish-package-to-github-packages.yml` を削除しました

## [3.2.1] - 2026-07-07

### Fixed

- **リポジトリ**: `promidas-utils/repository` バレルがブラウザ向けバンドラ (Vite/rollup) でビルド失敗する問題を修正 (#48)
    - バレルが Node 専用の `snapshot-file-io` を re-export していたため、`node:crypto` 等の解決に失敗していた (3.1.0 で発生した回帰)
    - Node 専用の File I/O を `promidas-utils/file-io` サブパスへ分離し、`promidas-utils/repository` は browser-safe に戻しました
    - これに伴い、`exportSnapshotToFile` / `importSnapshotFromFile` および `FileIoError` 等の型の import 元が `promidas-utils/repository` から `promidas-utils/file-io` に変わります (いずれも 3.1.0 で追加された API)

## [3.2.0] - 2026-07-07

### Added

- **ユーティリティ**: ProtoPedia のユーザー名文字列を分解する `parseUsername` を追加 (#42)
    - `parseUsername(username): ParsedUsername` を `promidas-utils/utils` から公開
    - best-effort な処理です。実際の `profileId` が `@` を含むデータは正しく復元できません (制限事項として明記)

## [3.1.0] - 2026-07-06

### Added

- **リポジトリ**: スナップショットの JSON ファイル I/O ユーティリティを追加 (#8)
    - `exportSnapshotToFile()` / `importSnapshotFromFile()` を `promidas-utils/repository` から公開
    - ディレクトリの自動作成、一時ファイルを介したアトミックな書き込み、判別可能なエラー型 (`FileIoError`) を提供
    - import 失敗が promidas の検証由来の場合は `SnapshotOperationFailure` を保持し、既存の `toLocalizedMessage()` で日本語化可能

## [3.0.0] - 2026-01-28

### Breaking

- **依存関係**: `promidas` 3.0.0 以降が必須になりました
    - `peerDependencies` の `promidas` を `>=3.0.0` に変更
    - `promidas` v2.x 系のサポートを終了

### Changed

- **CI/CD**: Trusted Publishers (OIDC) 対応
    - npmjs公開ワークフローから `NODE_AUTH_TOKEN` を削除
    - OIDCトークンを使用した安全な自動公開に移行
- **ドキュメント**: README.md および docs/index.md の改善
    - 日本語表現の明確化と構成の改善
    - プロジェクト概要の更新

## [2.0.0] - 2026-01-16

### Added

- **CI/CD**: npmjsへの自動公開用GitHub Actionsワークフローを追加
    - リリース作成時とmanual dispatchで公開可能
    - ビルド、テスト、リントを実行後に公開
    - provenance対応

### Changed

- **パッケージ名**: `@f88/promidas-utils` から `promidas-utils` に変更 (破壊的変更)
    - スコープなしパッケージとして公開
- **レジストリ**: GitHub Packagesから npm (<https://www.npmjs.com/package/promidas-utils>) に変更
    - `publishConfig` を更新: registry, access, provenance
    - すべてのドキュメントとJSDocコメントでパッケージ名を更新
- **依存関係**: `@f88/promidas` から `promidas` に変更 (v2.0.0)
    - パッケージ名が `@f88/promidas` から `promidas` に改名されました
    - レジストリがGitHub Packagesから npm (<https://www.npmjs.com/package/promidas>) に変更されました
    - peerDependencies と devDependencies を更新
    - すべてのimport文とドキュメントの例を更新

### Deprecated

- **CI/CD**: GitHub Packagesへの公開ワークフローを無効化
    - ファイルは参照用に保持

## [1.0.0] - 2026-01-13

### Breaking

- **ビルド環境**: Node.js 22 以降が必須になりました（Node 20/21 は非対応）

### Changed

- **リポジトリユーティリティ**: `@f88/promidas` v1.1.0に対応するため、スナップショット失敗処理を強化
    - リポジトリ層のエラーを処理する `parseRepositorySnapshotFailure()` 関数を追加
    - 4種類の新しいリポジトリエラーコードに対応:
        - `REPOSITORY_VALIDATION_ERROR` - データ検証の失敗
        - `REPOSITORY_INVALID_STATE` - 不正な状態での操作呼び出し
        - `REPOSITORY_SIZE_ESTIMATION_ERROR` - サイズ計算の失敗
        - `REPOSITORY_UNKNOWN` - 未分類のリポジトリエラー
    - `toLocalizedMessage()` を更新し、リポジトリエラーを新しいパーサーに委譲
    - すべてのリポジトリエラーにデバッグ用の参照情報（エラーコード、分類、詳細）を含める

## [0.3.0] - 2025-12-27

### Added

- Repository utilities (`@f88/promidas-utils/repository`)
    - `toLocalizedMessage(failure)` - スナップショット操作失敗を日本語メッセージに変換
    - `parseSnapshotOperationFailure(failure)` - 失敗オブジェクトにローカライズメッセージを追加
    - `ParsedSnapshotOperationFailure` 型 - ローカライズメッセージ付き失敗型

- Builder utilities (`@f88/promidas-utils/builder`)
    - `toErrorMessage(error)` - ビルドエラーを日本語メッセージに変換

- Builder/Repository APIドキュメント追加

## [0.2.0] - 2025-12-26

### Added

- Config management utilities (`@f88/promidas-utils/config`)
    - `ConfigManager` factory for localStorage/environment variables
    - `BrowserConfigStorage` for localStorage-based config storage
    - `EnvironmentConfigStorage` for read-only environment variable access
    - `ConfigIdentifier`, `ReadOnlyConfigStorage`, and `ConfigStorage` types
    - `EnvironmentUnavailableError` exported from config module
    - Comprehensive test coverage (34 test cases)

- Comprehensive test coverage for token and version modules
    - Test coverage reached 100% for `lib/token` and `lib/version`
    - Added 44 test cases covering all public APIs
    - Edge case tests for storage unavailability and error propagation
    - Environment variable edge cases (undefined process, placeholder values)

- Development and contribution guides
    - Added `DEVELOPMENT.md` for local development workflow
    - Added `CONTRIBUTING.md` describing fork-based contributions and issue guidance

### Changed

- Moved `EnvironmentUnavailableError` from `lib/token/errors.ts` to `lib/errors.ts` for shared use across modules
- Renamed token storage classes for clarity
    - `BrowserStorage` → `BrowserTokenStorage`
    - `EnvironmentStorage` → `EnvironmentTokenStorage`
- Improved test structure with nested `describe` blocks for better organization
- Enhanced mock storage implementation to correctly handle empty strings
- Made `TOKEN_KEYS` runtime-immutable via `Object.freeze()`

## [0.1.0] - 2025-12-25

### Added

- Token management utilities (`@f88/promidas-utils/token`)
    - `TokenManager` factory for sessionStorage/localStorage/environment variables
    - `TOKEN_KEYS` constants for standard token identifiers
    - `ReadOnlyTokenStorage` and `TokenStorage` interfaces
- Store state utilities (`@f88/promidas-utils/store`)
    - `getStoreState` function for determining cache state
    - `StoreState` type (`'not-stored' | 'stored' | 'expired'`)
- API documentation with per-path reference pages
- Release guide and changelog

[Unreleased]: https://github.com/F88/promidas-utils/compare/v5.0.0...HEAD
[5.0.0]: https://github.com/F88/promidas-utils/releases/tag/v5.0.0
[4.0.0]: https://github.com/F88/promidas-utils/releases/tag/v4.0.0
[3.2.1]: https://github.com/F88/promidas-utils/releases/tag/v3.2.1
[3.2.0]: https://github.com/F88/promidas-utils/releases/tag/v3.2.0
[3.1.0]: https://github.com/F88/promidas-utils/releases/tag/v3.1.0
[3.0.0]: https://github.com/F88/promidas-utils/releases/tag/v3.0.0
[2.0.0]: https://github.com/F88/promidas-utils/releases/tag/v2.0.0
[1.0.0]: https://github.com/F88/promidas-utils/releases/tag/v1.0.0
[0.3.0]: https://github.com/F88/promidas-utils/releases/tag/v0.3.0
[0.2.0]: https://github.com/F88/promidas-utils/releases/tag/v0.2.0
[0.1.0]: https://github.com/F88/promidas-utils/releases/tag/v0.1.0
