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

`promidas-utils/utils` は、PROMIDAS / ProtoPedia を使った開発を補助する汎用ユーティリティ群です。

## API

エントリーポイント: `promidas-utils/utils`

- 関数: `parseUsername`
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

- `displayName` - ProtoPedia の表示名 (`fullNm`)。可変の自由入力で、`@` / `|` / `/` / 空白を含みうるほか、空文字列にもなりえます (**実データでは約 20% の作者が空**)。空白は保持されます (トリムしません)。
- `profileId` - `https://protopedia.net/prototyper/{profileId}` で使われる安定した登録ハンドルです。

## 関数

### `parseUsername(username: string): ParsedUsername`

::: info 制約
best-effort の分割処理です。**元の `profileId` を確実に復元することを保証しません。復元できないケースがあります**（実際の `profileId` が `@` を含むデータは正しく復元できません）。詳細は下記「制限事項」。
:::

**PROMIDAS における `NormalizedPrototype.users: string[]` の要素から `profileId` を決定し、残りの `displayName` とともに返すユーティリティ関数です。**

主たる出力は `profileId`(`/prototyper/{profileId}` の安定キー) で、`displayName` は最後の `@` より前の残余です。`displayName@profileId` 形式のユーザー名を、**最後の** `@` で分割します。

各要素は `displayName + "@" + profileId` で符号化されます。**大前提として `profileId` は `@` を含みえます**(実データで 7 件確認)。`displayName` も `@` を含みえます。両側が `@` を含みうるため、真の区切り位置は**文字列だけからは論理的に判断できません**。

`parseUsername` は一律 **最後の `@` で分割**する固定仕様 (best-effort) です。`@@` などの特別扱いはしません。displayName が `@` を含む/末尾が `@` のケース (例: `name@@id` = displayName `name@`) は last-`@` で正しく扱えます。

トリムは行いません。例えば `displayName` が `' Alice '` の場合は、そのまま `' Alice '` を返します。

**パラメータ:**

- `username: string` - 1 件のユーザー名文字列。

**戻り値:**

- `ParsedUsername` - 分解結果

::: tip displayName が空のときの表示
`displayName` は空文字列になりえます (実データで約20%、5人に1人)。UI に作者名を出すときは、空なら `@` + `profileId` へフォールバックすると、`displayName` が空でも文字列を表示できます。

```tsx
import { parseUsername } from 'promidas-utils/utils';

function AuthorName({ username }: { username: string }) {
    const { displayName, profileId } = parseUsername(username);
    // displayName が空でも表示できるよう '@' + profileId を代替出力
    return <span>{displayName || `@${profileId}`}</span>;
}
```

:::

**制限事項 (重要):実際の `profileId` が `@` を含むデータは正しく復元出来ません**

`displayName` と `profileId` はどちらも `@` を含みえます。両側が `@` を含みうるため、真の区切り位置は**文字列だけからは論理的に判断できず**、どんな固定規則も万能にはなりません。`profileId` 自体が `@` を含むユーザーでは、last-`@` 分割は誤った `profileId` を返します (実データにも該当ユーザーが存在します)。

検知可能性:

- **silent**: 多くは **非空だが誤った** `profileId` を返し、正しい結果と文字列上は区別できません。
- **detectable**: 末尾が `@` の場合は `profileId === ''` となり、下流で検知できます。

補足:

- `@@` を特別扱いして first-`@` で切る実装はしません。`a@@b` は `("a@", "b")` (display 末尾 `@`) と `("a", "@b")` (id 先頭 `@`) が同じ文字列になり区別不能で、特別扱いはエラーを別ケースに移すだけだからです。
- 不正入力 (`@` が無い / 末尾が `@`) でも `profileId === ''` になります。

**使用例:**

```typescript
import { parseUsername } from 'promidas-utils/utils';

// 以下の文字列は架空ですが、いずれのパターンも実データに存在します。
parseUsername('Alice@alice'); // 通常 (実データの大多数)
// { displayName: 'Alice', profileId: 'alice' }

parseUsername('@alice'); // 表示名が空 (実データに 798 件)
// { displayName: '', profileId: 'alice' }

parseUsername('Alice@Example@alice'); // 表示名に @ を含む (実データに 21 件)
// { displayName: 'Alice@Example', profileId: 'alice' }
```
