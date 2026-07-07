/**
 * Username decoder for elements of PROMIDAS' `NormalizedPrototype.users`.
 *
 * Each element is a ProtoPedia username encoded as
 * `displayName + "@" + profileId`. Given one such string, this module
 * determines its `profileId` and returns the remaining `displayName` alongside
 * it. How PROMIDAS produces those elements is out of scope here.
 *
 * @see {@link https://github.com/F88/promidas-utils/issues/42}
 * @packageDocumentation
 */

/**
 * A ProtoPedia username decoded into its two constituent parts.
 *
 * @see {@link parseUsername}
 */
export interface ParsedUsername {
  /**
   * The display name (ProtoPedia 表示名 / `fullNm`; the `<h1>` on the profile
   * page). Mutable free text, `maxlength` 50.
   *
   * @remarks
   * May be **empty** (the `@profileId` pattern, fictional `@alice`; **~20% of
   * authors have an empty display name** in real data), and may contain any
   * character including `@`, `|`, `/`, and whitespace. Whitespace is preserved
   * verbatim (never trimmed), because ProtoPedia itself renders leading spaces
   * (e.g. `<h1> Alice</h1>` for a fictional `' Alice@alice'` — real data has
   * such leading-space names).
   */
  displayName: string;

  /**
   * The registration handle: the stable id in the author URL
   * `https://protopedia.net/prototyper/{profileId}`, shown as `@{profileId}`
   * on the public profile page.
   *
   * @remarks
   * Most ids are `[A-Za-z0-9_.-]` (sample-observed, not authoritative), with no
   * `|` and no whitespace. But the handle is free enough that **it may itself
   * contain `@`** — this occurs in real data. The returned value is `''` only
   * for malformed input (no `@`, or a `@`-terminated string); when the true id
   * contains `@`, `parseUsername`'s last-`@` guess is wrong — see there.
   */
  profileId: string;
}

/**
 * **Constraint — best-effort decode; NOT guaranteed correct. This does not
 * guarantee that the original `profileId` is recovered, and some usernames
 * cannot be decoded** (when the real `profileId` itself contains `@`; see the
 * limitation in the remarks below).
 *
 * Determines the `profileId` of one ProtoPedia username — the substring after
 * its **last** `@` — and returns it together with the remaining `displayName`.
 *
 * The primary output is `profileId` (the stable `/prototyper/{profileId}` key);
 * `displayName` is simply whatever precedes that last `@`.
 *
 * **Premise: `profileId` may itself contain `@`** (this occurs in real data),
 * and so may `displayName`. Because *both* sides can contain `@`, the true
 * separator is **not determinable from the string alone**. This function applies
 * one fixed rule — cut at the **last** `@` — and returns a best-effort result.
 * **A username whose real `profileId` contains `@` cannot be decoded correctly**
 * (see the limitation below).
 *
 * No trimming is performed: whitespace is authoritative (ProtoPedia renders
 * leading spaces, e.g. `<h1> Alice</h1>`). The function never throws and
 * preserves the input verbatim minus the single separator `@`.
 *
 * Input patterns and their outputs (`i` = index of the last `@`):
 *
 * | # | `@` count | valid? | pattern | input example | displayName | profileId |
 * | --- | --- | --- | --- | --- | --- | --- |
 * | 1 | 0 | no (malformed) | empty string | `''` | `''` | `''` |
 * | 2 | 0 | no (malformed) | no `@` at all | `Alice` | `Alice` | `''` |
 * | 3 | 1 | yes | `displayName@profileId` | `Alice@alice` | `Alice` | `alice` |
 * | 4 | 1 | yes | leading `@` (empty display name) | `@alice` | `''` | `alice` |
 * | 5 | 1 | no (malformed) | trailing `@` (empty profileId) | `Alice@` | `Alice` | `''` |
 * | 6 | 1 | no (malformed) | `@` only (empty display + empty profileId) | `@` | `''` | `''` |
 * | 7 | >=2 | unverified (silent risk) | multi-`@`, last-`@` guess — silently wrong if the true profileId contains `@` | `Alice@Example@alice` | `Alice@Example` | `alice` |
 * | 8 | >=2 | no (empty) | trailing `@` -> empty profileId (detectable) | `Alice@@_@` | `Alice@@_` | `''` |
 *
 * @param username - One element of PROMIDAS' `NormalizedPrototype.users`
 *   (a `displayName@profileId` string).
 * @returns The decoded {@link ParsedUsername}.
 *
 * @remarks
 * **Limitation — a username whose real `profileId` contains `@` cannot be
 * decoded correctly.** Because both `displayName` and `profileId` can contain
 * `@`, the true separator is *logically undeterminable from the string alone*,
 * so no fixed rule can be universally correct. This case occurs in real data
 * (see {@link https://github.com/F88/promidas-utils/issues/42}); the last-`@`
 * result is then wrong. **No correctness guarantee.**
 *
 * By detectability:
 * - **Silent.** When the true id contains `@` and the string does not end with
 *   `@`, last-`@` returns a *non-empty but wrong* id (fictional: `@a@bob` ->
 *   `bob`, but the real id is `a@bob`), indistinguishable from a correct
 *   multi-`@` split from the string alone.
 * - **Detectable.** When the string ends with `@`, `profileId === ''`; a
 *   consumer can at least flag empty ids.
 *
 * No `@@` special-casing: `a@@b` is genuinely ambiguous — `("a@", "b")` (display
 * ends with `@`) and `("a", "@b")` (id starts with `@`) encode identically — so
 * splitting `@@` at the first `@` would only move the error (breaking the
 * display-ends-with-`@` reading), not remove it. last-`@` keeps the more likely
 * reading (free-text names carry `@`; ids usually do not) and stays simple.
 *
 * @example
 * ```typescript
 * import { parseUsername } from 'promidas-utils/utils';
 *
 * // Strings below are fictional, but each pattern occurs in real data.
 * parseUsername('Alice@alice'); // normal (the majority of real data)
 * // { displayName: 'Alice', profileId: 'alice' }
 *
 * parseUsername('@alice'); // empty display name (798 in real data)
 * // { displayName: '', profileId: 'alice' }
 *
 * parseUsername('Alice@Example@alice'); // display contains '@' (21 in real data)
 * // { displayName: 'Alice@Example', profileId: 'alice' }
 * ```
 */
export function parseUsername(username: string): ParsedUsername {
  const separatorIndex = username.lastIndexOf('@');

  if (separatorIndex < 0) {
    // No `@`: malformed username (no separator); profileId is unrecoverable.
    return { displayName: username, profileId: '' };
  }

  return {
    // Whitespace preserved on both sides; only the separator `@` is removed.
    displayName: username.slice(0, separatorIndex),
    profileId: username.slice(separatorIndex + 1),
  };
}
