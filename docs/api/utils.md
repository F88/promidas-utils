---
title: ユーティリティ
instructions-for-ais:
    - This document should be written in Japanese.
    - Use half-width characters for numbers, letters, and symbols.
    - Prohibit updating this front-matter.
    - Prohibit updating title line (1st line) in this document.
---

# ユーティリティ

## 概要

ProtoPedia のユーザー名文字列を扱う汎用ユーティリティです。

ProtoPedia API v2 の `users` フィールドは `usernames.join("|")` の形式で、各ユーザー名は `displayName + "@" + profileId` として符号化されています。promidas 側の axis-1 (`splitPipeSeparatedUsers`) がパイプ区切りの `users` を個々のユーザー名文字列へ分割するのに対し、本モジュールは axis-2 として、1 件のユーザー名文字列を `displayName` と `profileId` に分解します。

## API

エントリーポイント: `promidas-utils/utils`

- 関数: `parseUsername`
- 関数: `parseUsers`
- 型: `ParsedUsername`

> ルートパス `promidas-utils` からの再エクスポートはありません。必ず上記パスを利用してください。

## 型

### `ParsedUsername`

分解済みのユーザー名を表します。

```typescript
export interface ParsedUsername {
    displayName: string; // 表示名。空文字列になりうる
    profileId: string; // 登録ハンドル (/prototyper/{profileId})
}
```

- `displayName` - ProtoPedia の表示名 (`fullNm`)。可変の自由入力で、`@` / `|` / `/` / 空白を含みうるほか、空文字列にもなりえます。空白は保持されます (トリムしません)。
- `profileId` - `https://protopedia.net/prototyper/{profileId}` で使われる安定した登録ハンドルです。

## 関数

### `parseUsername(username: string): ParsedUsername`

**PROMIDAS における `NormalizedPrototype.users: string[]` の要素を、`displayName` と `profileId` に分解するためのユーティリティ関数です。**

`displayName@profileId` 形式のユーザー名を、**最後の** `@` で分割します。

API v2 の `users` フィールドは、`displayName + "@" + profileId` で符号化されます。
実際のデータから判断出来る事実として、 `displayName` には `@` を含むデータが多数存在します。また `profileId` は通常 `@` を含みません。
そこで `parseUsername` では `name@foo-bar@baz` を `name@foo-bar` と `baz` に分割します。
現時点では、約 6.3k 件の実データに対し 4,036 / 4,037 件で正しく分割できます。

トリムは行いません。ProtoPedia が先頭の空白をそのまま表示する (例: `<h1> displayName</h1>`) ことから、空白は情報として保持します。本関数は例外を投げず、区切りの `@` 1 個を除いて入力をそのまま保持します。

**パラメータ:**

- `username: string` - 1 件のユーザー名文字列。

**戻り値:**

- `ParsedUsername` - 分解結果

**完全には判定できないパターンと、その処理結果:**

生の文字列は非可逆で、`displayName` と `profileId` の両方が `@` を含みうるため、区切り位置を一意に決められないケースが存在します。本関数はこれらに対しても **例外を投げず、決定的な結果を返します**。復元不能であることを利用者が検知できるよう、各ケースの結果を以下に明記します。

| パターン概要                                                              | 入力例                              | 本関数の処理結果                            | 正しい値                                  | 出現数    |
| ------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------- | ----------------------------------------- | --------- |
| `@` が 1 つも無い (不正入力)                                              | `xxx`                               | `{ displayName: 'xxx', profileId: '' }`     | — (不定)                                  | 0         |
| `profileId` が `@` を含む (縮退ケース)                                    | `name@@_@`                          | `{ displayName: 'name', profileId: '@_@' }` | `{ displayName: '', profileId: '@._.@' }` | 1 / 4,037 |
| `displayName` が `@` と `\|` の両方を含む (axis-1 が過分割済み。"Case B") | (axis-1 で複数要素に分断されて渡る) | 分断された各要素をそのまま分解 (誤った結果) | 一意に復元不能                            | 0         |

補足:

- `profileId` が `@` を含む縮退ケースは、本来の区切りが _最初_ の `@` ですが、複数 `@` を持つ通常の表示名 (例: `げんろく@Karakuri-Musha@genroku`) は _最後_ の `@` を要求するため、両者が矛盾します。正しい id `@._.@` は `/prototyper/{profileId}` の URL という外部情報からしか判別できません。
- いずれの結果も **`profileId` が空文字列 (`''`)** になるため、下流は「`profileId === ''` = 復元不能な異常ユーザー」として検知できます。
- `displayName` が `@` と `\|` の両方を含むケースは、パイプ分割 (axis-1 / promidas 側) の段階で既に壊れて渡ってくるため、axis-2 では原理的に修復できません。

**使用例:**

```typescript
import { parseUsername } from 'promidas-utils/utils';

parseUsername('ばんの@tomoki_banno');
// { displayName: 'ばんの', profileId: 'tomoki_banno' }

parseUsername('@yuukankin'); // 表示名が空
// { displayName: '', profileId: 'yuukankin' }

parseUsername('げんろく@Karakuri-Musha@genroku'); // 表示名に @ を含む
// { displayName: 'げんろく@Karakuri-Musha', profileId: 'genroku' }
```

### `parseUsers(users: readonly string[]): ParsedUsername[]`

`NormalizedPrototype.users` 配列全体を `parseUsername` で分解します。順序と要素数を保持する 1:1 の補助関数です (`users[i]` が戻り値の `ParsedUsername[i]` に対応します)。

**パラメータ:**

- `users: readonly string[]` - 分解対象のユーザー名文字列 (例: `NormalizedPrototype.users`)

**戻り値:**

- `ParsedUsername[]` - 入力と同じ順序・要素数の分解結果

**使用例:**

```typescript
import { parseUsers } from 'promidas-utils/utils';

parseUsers(['ばんの@tomoki_banno', '@yuukankin']);
// [
//   { displayName: 'ばんの', profileId: 'tomoki_banno' },
//   { displayName: '', profileId: 'yuukankin' },
// ]
```

## 注意事項

- 本モジュールは axis-2 (ユーザー名文字列 → `displayName` / `profileId`) のみを担当します。パイプ区切り `users` フィールドの分割 (axis-1) は promidas 側の責務です。
- 表示名が `@` と `|` の両方を含む場合、axis-1 が過分割するため本関数でも正しく分解できません (現状の実データには存在しません)。これは axis-1 / 上流の符号化に起因する制約です。
