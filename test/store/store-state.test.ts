import { describe, expect, it } from 'vitest';

import { getStoreState } from '../../lib/store/store-state.js';
import { createPrototypeInMemoryStats } from '../helpers/create-prototype-In-memory-stats.js';

describe('getStoreState', () => {
  it('should return "not-stored" when stats is null', () => {
    const result = getStoreState(null);
    expect(result).toBe('not-stored');
  });

  it('should return "not-stored" when stats.cachedAt is null', () => {
    const stats = createPrototypeInMemoryStats({
      cachedAt: null,
      isExpired: false,
    });
    const result = getStoreState(stats);
    expect(result).toBe('not-stored');
  });

  it('should return "expired" when stats.isExpired is true', () => {
    const stats = createPrototypeInMemoryStats({
      cachedAt: new Date('2025-12-25T00:00:00Z'),
      isExpired: true,
    });
    const result = getStoreState(stats);
    expect(result).toBe('expired');
  });

  it('should return "stored" when stats is valid and not expired', () => {
    const stats = createPrototypeInMemoryStats({
      cachedAt: new Date('2025-12-25T09:00:00Z'),
      isExpired: false,
    });
    const result = getStoreState(stats);
    expect(result).toBe('stored');
  });
});
