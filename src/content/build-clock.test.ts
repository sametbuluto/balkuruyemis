// @vitest-environment node
import { afterEach, expect, it, vi } from 'vitest';
import { getBuildInstant } from './build-clock';

afterEach(() => vi.unstubAllEnvs());

it('aynı teknik build anını döndürür; istemci saatine göre yayın kararı vermez', () => {
  vi.stubEnv('SITE_BUILD_AT', '2026-11-01T12:00:00.000Z');
  expect(getBuildInstant().toISOString()).toBe('2026-11-01T12:00:00.000Z');
});

it.each(['', '2026-02-30T00:00:00.000Z', '2026-11-01', 'not-a-date'])(
  'geçersiz build anıyla sessizce devam etmez: %s',
  (value) => {
    vi.stubEnv('SITE_BUILD_AT', value);
    expect(() => getBuildInstant()).toThrow('SITE_BUILD_AT');
  },
);
