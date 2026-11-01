// @vitest-environment node
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { loadBranches } from './branches.server';
import { selectVisibleBranches, selectPublishedBranches } from './branch-schema';

const actual = loadBranches();
const fixture = {
  ...actual[0]!,
  id: 'location-test',
  name: 'Yalnız test',
  coordinates: null,
  googleMapsUrl: null,
};
let directory: string;
beforeEach(() => {
  directory = mkdtempSync(path.join(tmpdir(), 'bal-branch-unit-'));
});
afterEach(() => {
  rmSync(directory, { recursive: true, force: true });
});
const write = (value: unknown = fixture) =>
  writeFileSync(path.join(directory, 'location-test.json'), JSON.stringify(value));

describe('Şube JSON server/build yükleme', () => {
  it('işletme sahibinin dört özgün koordinatını korur', () => {
    for (const [id, latitude, longitude] of [
      ['location-1', 38.362633, 27.148943],
      ['location-2', 38.374462, 27.183882],
      ['location-3', 38.367344, 27.148973],
      ['location-4', 38.378593, 27.163704],
    ] as const)
      expect(actual.find((entry) => entry.id === id)?.coordinates).toEqual({
        latitude,
        longitude,
      });
  });

  it('yeni kayıt ve draft değişikliklerini güncel okumada doğrular', () => {
    write();
    expect(selectVisibleBranches(loadBranches(directory))).toHaveLength(1);
    expect(selectPublishedBranches(loadBranches(directory))).toEqual([]);
    write({ ...fixture, status: 'draft' });
    expect(selectVisibleBranches(loadBranches(directory))).toEqual([]);
    expect(loadBranches(directory)[0]?.status).toBe('draft');
  });

  it('boş/kayıp dizin, bozuk JSON ve unknown field için fallback kullanmaz', () => {
    expect(() => loadBranches(directory)).toThrow();
    expect(() => loadBranches(path.join(directory, 'missing'))).toThrow();
    for (const source of ['{', JSON.stringify({ ...fixture, hidden: true })]) {
      writeFileSync(path.join(directory, 'location-test.json'), source);
      expect(() => loadBranches(directory)).toThrow('Şube JSON doğrulaması');
    }
  });

  it('symlink, JSON dışı dosya, byte ve UTF-8 hatalarını reddeder', () => {
    const target = path.join(directory, 'source.txt');
    writeFileSync(target, '{}');
    expect(() => loadBranches(directory)).toThrow('normal JSON');
    symlinkSync(target, path.join(directory, 'location-test.json'));
    expect(() => loadBranches(directory)).toThrow('normal JSON');
    // Önce symlink içermeyen ayrı dosyayı tek kaynak olarak yükleyecek dizin.
    const parent = mkdtempSync(path.join(directory, 'nested-'));
    writeFileSync(path.join(parent, 'location-test.json'), Buffer.alloc(256 * 1024 + 1));
    expect(() => loadBranches(parent)).toThrow('256 KiB');
    writeFileSync(path.join(parent, 'location-test.json'), Buffer.from([0xff]));
    expect(() => loadBranches(parent)).toThrow('UTF-8');
  });
});
