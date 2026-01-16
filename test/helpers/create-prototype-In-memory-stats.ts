import type { PrototypeInMemoryStats } from 'promidas/store';

export function createPrototypeInMemoryStats(
  overrides: Partial<PrototypeInMemoryStats> = {},
): PrototypeInMemoryStats {
  return {
    size: 1,
    cachedAt: new Date(),
    isExpired: false,
    remainingTtlMs: 3600000,
    dataSizeBytes: 100,
    refreshInFlight: false,
    ...overrides,
  } satisfies PrototypeInMemoryStats;
}
