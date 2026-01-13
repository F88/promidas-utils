<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/F88/promidas-utils/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/F88/promidas-utils/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/F88/promidas-utils/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/F88/promidas-utils/releases/tag/v0.1.0
