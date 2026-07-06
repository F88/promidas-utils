import type { NormalizedPrototype } from 'promidas/types';

/**
 * Creates a minimal, schema-valid NormalizedPrototype for tests.
 *
 * Only the fields required by PROMIDAS' normalizedPrototypeSchema are populated;
 * optional fields are omitted. Pass `overrides` to customize specific fields.
 */
export function createNormalizedPrototype(
  overrides: Partial<NormalizedPrototype> = {},
): NormalizedPrototype {
  return {
    id: 1,
    createDate: '2026-01-01T00:00:00.000Z',
    releaseFlg: 2,
    status: 3,
    prototypeNm: 'Test Prototype',
    summary: '',
    freeComment: '',
    systemDescription: '',
    users: [],
    teamNm: '',
    tags: [],
    materials: [],
    events: [],
    awards: [],
    mainUrl: '',
    viewCount: 0,
    goodCount: 0,
    commentCount: 0,
    ...overrides,
  };
}
