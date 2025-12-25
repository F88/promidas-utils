import { describe, expect, it } from 'vitest';

import { TOKEN_KEYS } from '../../lib/token/constants.js';

describe('TOKEN_KEYS', () => {
  it('should have PROTOPEDIA_API_V2_TOKEN constant', () => {
    expect(TOKEN_KEYS.PROTOPEDIA_API_V2_TOKEN).toBe('PROTOPEDIA_API_V2_TOKEN');
  });

  it('should be a readonly object', () => {
    expect(Object.isFrozen(TOKEN_KEYS)).toBe(true);
  });

  it('should have exactly one key', () => {
    expect(Object.keys(TOKEN_KEYS)).toHaveLength(1);
  });
});
