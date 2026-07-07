import { describe, expect, it } from 'vitest';

import {
  parseUsername,
  type ParsedUsername,
} from '../../lib/utils/parse-username.js';

describe('parseUsername', () => {
  describe('single `@` (unambiguous, decodes correctly)', () => {
    it('splits `displayName@profileId` at the `@`', () => {
      expect(parseUsername('Alice@alice')).toEqual({
        displayName: 'Alice',
        profileId: 'alice',
      });
    });

    it('returns an empty displayName for the `@profileId` pattern', () => {
      expect(parseUsername('@alice')).toEqual({
        displayName: '',
        profileId: 'alice',
      });
    });

    it('handles displayName equal to profileId', () => {
      expect(parseUsername('bob@bob')).toEqual({
        displayName: 'bob',
        profileId: 'bob',
      });
    });

    it('preserves case (displayName vs profileId differ only by case)', () => {
      expect(parseUsername('Bob@bob')).toEqual({
        displayName: 'Bob',
        profileId: 'bob',
      });
    });

    it('accepts the observed profileId charset [A-Za-z0-9_.-]', () => {
      expect(parseUsername('name@a_b.c-d')).toEqual({
        displayName: 'name',
        profileId: 'a_b.c-d',
      });
    });

    it('keeps non-ASCII characters in the displayName', () => {
      expect(parseUsername('日本語 表示名@id')).toEqual({
        displayName: '日本語 表示名',
        profileId: 'id',
      });
    });
  });

  describe('multiple `@` (split at the LAST `@`)', () => {
    it('keeps earlier `@`s in the displayName', () => {
      expect(parseUsername('a@b@id')).toEqual({
        displayName: 'a@b',
        profileId: 'id',
      });
    });

    it('handles a displayName that ends with `@` (`name@` + `@` + `id`)', () => {
      // The last `@` is the true separator here, so this decodes correctly.
      expect(parseUsername('name@@id')).toEqual({
        displayName: 'name@',
        profileId: 'id',
      });
    });

    it('keeps a `/` in the displayName', () => {
      expect(parseUsername('foo/bar@id')).toEqual({
        displayName: 'foo/bar',
        profileId: 'id',
      });
    });

    it('keeps a `|` in the displayName', () => {
      expect(parseUsername('foo | bar@id')).toEqual({
        displayName: 'foo | bar',
        profileId: 'id',
      });
    });
  });

  describe('whitespace is significant (never trimmed)', () => {
    it('preserves a leading space in the displayName', () => {
      expect(parseUsername(' Alice@alice')).toEqual({
        displayName: ' Alice',
        profileId: 'alice',
      });
    });

    it('preserves a space right before the separator `@`', () => {
      expect(parseUsername('Alice @alice')).toEqual({
        displayName: 'Alice ',
        profileId: 'alice',
      });
    });

    it('preserves a trailing space after the profileId (not trimmed)', () => {
      expect(parseUsername('Alice@alice ')).toEqual({
        displayName: 'Alice',
        profileId: 'alice ',
      });
    });
  });

  describe('malformed input -> empty profileId (detectable via `profileId === ""`)', () => {
    it('treats an empty string as empty / empty', () => {
      expect(parseUsername('')).toEqual({ displayName: '', profileId: '' });
    });

    it('treats a no-`@` string as displayName with empty profileId', () => {
      expect(parseUsername('Alice')).toEqual({
        displayName: 'Alice',
        profileId: '',
      });
    });

    it('yields an empty profileId when the input ends with `@`', () => {
      expect(parseUsername('Alice@')).toEqual({
        displayName: 'Alice',
        profileId: '',
      });
    });

    it('handles `@` alone as empty / empty', () => {
      expect(parseUsername('@')).toEqual({ displayName: '', profileId: '' });
    });
  });

  describe('limitation: real profileId contains `@` (cannot decode correctly)', () => {
    // These assert parseUsername's DETERMINISTIC output — the last-`@` result,
    // which is the KNOWN-WRONG value for these inputs. The true profileId is only
    // knowable from an external source. See lib/utils/parse-username.ts @remarks.

    it('silently returns a wrong non-empty profileId (`@@id` shape)', () => {
      // true: { displayName: '', profileId: '@foo' }; last-`@` yields 'foo'
      expect(parseUsername('@@foo')).toEqual({
        displayName: '@',
        profileId: 'foo',
      });
    });

    it('silently returns a wrong non-empty profileId (`@a@b` shape)', () => {
      // true: { displayName: '', profileId: 'bar@baz' }; last-`@` yields 'baz'
      expect(parseUsername('@bar@baz')).toEqual({
        displayName: '@bar',
        profileId: 'baz',
      });
    });

    it('returns an empty profileId (detectable) when the real id ends with `@`', () => {
      // true: { displayName: '', profileId: 'x@' }; last-`@` yields '' (detectable)
      expect(parseUsername('@x@')).toEqual({
        displayName: '@x',
        profileId: '',
      });
    });
  });

  describe('non-string input (type-guard fallback -> "unknown")', () => {
    // parseUsername is typed `(username: string)`. For a non-string passed at
    // runtime (untyped JS / raw API data), the type guard returns a sentinel
    // instead of throwing or leaking a non-string field. Note an array has its
    // own `lastIndexOf` / `slice`, so without the guard it would NOT throw but
    // return array-typed fields — these tests lock that hole shut.
    const nonStrings: unknown[] = [
      null,
      undefined,
      123,
      true,
      {},
      [],
      ['a', '@', 'b'],
      Symbol('x'),
    ];

    it('returns the "unknown" sentinel for every non-string input', () => {
      for (const input of nonStrings) {
        expect(parseUsername(input as unknown as string)).toEqual({
          displayName: 'unknown',
          profileId: 'unknown',
        });
      }
    });

    it('never throws on non-string inputs', () => {
      for (const input of nonStrings) {
        expect(() => parseUsername(input as unknown as string)).not.toThrow();
      }
    });

    it('always returns string-typed fields (no array/object leakage)', () => {
      for (const input of nonStrings) {
        const { displayName, profileId } = parseUsername(
          input as unknown as string,
        );
        expect(typeof displayName).toBe('string');
        expect(typeof profileId).toBe('string');
      }
    });
  });

  describe('contract: total, deterministic, no trimming', () => {
    const inputs = [
      '',
      '@',
      '@@',
      'Alice',
      'Alice@alice',
      '@alice',
      'Alice@',
      'a@b@c',
      ' spaced @ id ',
      '@@foo',
      '日本語@id',
    ];

    it('never throws', () => {
      for (const input of inputs) {
        expect(() => parseUsername(input)).not.toThrow();
      }
    });

    it('is deterministic (same input -> equal output)', () => {
      for (const input of inputs) {
        expect(parseUsername(input)).toEqual(parseUsername(input));
      }
    });

    it('removes exactly one `@` (the separator): `displayName@profileId` reconstructs the input', () => {
      for (const input of inputs.filter((s) => s.includes('@'))) {
        const { displayName, profileId } = parseUsername(input);
        expect(`${displayName}@${profileId}`).toBe(input);
      }
    });

    it('returns exactly the two documented string fields', () => {
      const result: ParsedUsername = parseUsername('Alice@alice');
      expect(Object.keys(result).sort()).toEqual(['displayName', 'profileId']);
      expect(typeof result.displayName).toBe('string');
      expect(typeof result.profileId).toBe('string');
    });
  });
});
