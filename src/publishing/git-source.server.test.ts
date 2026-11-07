// @vitest-environment node
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  symlinkSync,
  existsSync,
  chmodSync,
} from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { inspectSource, gitRead, assertPins } from './git-source.server';
import { prepareGitCandidate } from './candidate.server';
import * as cms from '../cms/adapter.server';
let root: string, repo: string, base: string, source: string;
const project = process.cwd();
function git(...args: string[]) {
  return execFileSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], {
    cwd: repo,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
function commit() {
  git('add', '-A');
  git('commit', '-m', 'isolated test');
  return git('rev-parse', 'HEAD');
}
function read(file = 'pages/home.json') {
  return JSON.parse(readFileSync(path.join(repo, 'content', file), 'utf8')) as Record<
    string,
    unknown
  >;
}
function changeTitle(value: string, field = 'titleLead') {
  const home = read();
  home.hero = { ...(home.hero as object), [field]: value };
  writeFileSync(path.join(repo, 'content/pages/home.json'), JSON.stringify(home));
}
function pins() {
  return {
    mainSha: git('rev-parse', 'main'),
    sourceSha: git('rev-parse', 'content-edit'),
  };
}
beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), 'bal-publish-test-'));
  repo = path.join(root, 'repo');
  mkdirSync(repo);
  cpSync('content', path.join(repo, 'content'), { recursive: true });
  cpSync('public', path.join(repo, 'public'), { recursive: true });
  writeFileSync(path.join(repo, 'trusted-code.js'), '// only trusted main code');
  git('init', '-b', 'main');
  git('config', 'user.name', 'Isolated publication test');
  git('config', 'user.email', 'fixture@example.invalid');
  base = commit();
  git('checkout', '-b', 'content-edit');
  source = base;
});
afterEach(() => {
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});
describe('Gerçek yerel Git nesnelerinden data-only candidate', () => {
  it('aynı dosyadaki ayrı alanlar birleşir; HEAD/index/ref değişmez ve source script çalışmaz', async () => {
    changeTitle('CMS başlığı');
    source = commit();
    git('checkout', 'main');
    changeTitle('Main üst başlığı', 'eyebrow');
    const main = commit();
    const before = git('show-ref');
    const index = readFileSync(path.join(repo, '.git/index'));
    const output = path.join(root, 'candidate');
    const report = await prepareGitCandidate(
      repo,
      { mainSha: main, sourceSha: source },
      output,
    );
    const result = JSON.parse(
      readFileSync(path.join(output, 'content/pages/home.json'), 'utf8'),
    ) as { hero: { titleLead: string; eyebrow: string } };
    expect(result.hero).toMatchObject({
      titleLead: 'CMS başlığı',
      eyebrow: 'Main üst başlığı',
    });
    expect(report.baseSha).toBe(base);
    expect(report.sourceCodeExecuted).toBe(false);
    expect(report.gitRefWritten).toBe(false);
    expect(report.candidateCommitSha).toBeNull();
    expect(git('show-ref')).toBe(before);
    expect(git('rev-parse', 'HEAD')).toBe(main);
    expect(readFileSync(path.join(repo, '.git/index'))).toEqual(index);
  });
  it('aynı alandaki eşzamanlı değişiklik çatışması main verisini korur', async () => {
    changeTitle('CMS');
    commit();
    git('checkout', 'main');
    changeTitle('Main');
    const main = commit();
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow('merge çatışması');
    expect(git('rev-parse', 'main')).toBe(main);
    expect(existsSync(path.join(root, 'candidate'))).toBe(false);
  });
  it.each([
    'trusted-code.js',
    '.github/workflows/evil.yml',
    '.pages.yml',
    '.env.local',
    'content/home.json',
  ])('tek uygunsuz dosya bütün paketi durdurur: %s', async (file) => {
    changeTitle('İzinli metin');
    mkdirSync(path.dirname(path.join(repo, file)), { recursive: true });
    writeFileSync(path.join(repo, file), 'not executed');
    commit();
    git('checkout', 'main');
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow();
    expect(existsSync(path.join(root, 'candidate'))).toBe(false);
  });
  it.each(['delete', 'rename', 'executable', 'symlink', 'gitlink'])(
    'Git mode/işlem reddi: %s',
    (kind) => {
      const file = 'content/categories/category-kahve.json';
      if (kind === 'delete') rmSync(path.join(repo, file));
      if (kind === 'rename') git('mv', file, 'content/categories/category-moved.json');
      if (kind === 'executable') {
        chmodSync(path.join(repo, file), 0o755);
        git('update-index', '--chmod=+x', file);
        git('commit', '-m', 'mode change');
      }
      if (kind === 'symlink') {
        rmSync(path.join(repo, file));
        symlinkSync('category-aktar.json', path.join(repo, file));
      }
      if (kind === 'gitlink') {
        git(
          'update-index',
          '--add',
          '--cacheinfo',
          `160000,${base},content/products/module`,
        );
        git('commit', '-m', 'gitlink');
      }
      if (!['gitlink', 'executable'].includes(kind)) commit();
      git('checkout', 'main');
      expect(() => inspectSource(repo, pins())).toThrow('Git içerik kapısı');
    },
  );
  it('byte limiti payload beyanından değil Git blobundan ölçülür', () => {
    writeFileSync(
      path.join(repo, 'content/products/product-large.json'),
      ' '.repeat(256 * 1024 + 1),
    );
    commit();
    git('checkout', 'main');
    expect(() => inspectSource(repo, pins())).toThrow('JSON boyutu');
  });
  it('bozuk JSON onaylı dosya yolunda olsa bile candidate olmaz', async () => {
    writeFileSync(path.join(repo, 'content/pages/home.json'), '{');
    commit();
    git('checkout', 'main');
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow('bozuk JSON');
  });
  it('bozuk görsel candidate öncesi decode kapısına takılır', async () => {
    writeFileSync(path.join(repo, 'public/images/products/bad.png'), 'bad image');
    commit();
    git('checkout', 'main');
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow('Medya doğrulaması');
  });
  it('location kimliğini verified yapmak teknik onayı geçmez', async () => {
    const branch = read('branches/location-1.json');
    branch.contentKind = 'verified';
    writeFileSync(
      path.join(repo, 'content/branches/location-1.json'),
      JSON.stringify(branch),
    );
    commit();
    git('checkout', 'main');
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow('korunan');
  });
  it('yanlış sosyal URL reddedilir', async () => {
    const social = read('settings/social.json');
    social.instagram = {
      ...(social.instagram as object),
      url: 'https://evil.invalid/redirect',
    };
    writeFileSync(
      path.join(repo, 'content/settings/social.json'),
      JSON.stringify(social),
    );
    source = commit();
    git('checkout', 'main');
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow();
  });
  it('eşzamanlı main onayı CMS tarafından değiştirilen telefona taşınmaz', async () => {
    const initial = read('settings/site.json');
    initial.phone = '+90 555 000 00 00';
    writeFileSync(path.join(repo, 'content/settings/site.json'), JSON.stringify(initial));
    commit();
    git('checkout', 'main');
    git('merge', '--ff-only', 'content-edit');
    git('checkout', 'content-edit');
    writeFileSync(
      path.join(repo, 'content/settings/site.json'),
      JSON.stringify({ ...initial, phone: '+90 555 111 11 11' }),
    );
    commit();
    git('checkout', 'main');
    writeFileSync(
      path.join(repo, 'content/settings/site.json'),
      JSON.stringify({ ...initial, phoneVerified: true }),
    );
    commit();
    const output = path.join(root, 'candidate');
    await prepareGitCandidate(repo, pins(), output);
    const result = JSON.parse(
      readFileSync(path.join(output, 'content/settings/site.json'), 'utf8'),
    ) as { phone: string; phoneVerified: boolean };
    expect(result.phone).toBe('+90 555 111 11 11');
    expect(result.phoneVerified).toBe(false);
  });
  it('native ürün kaydı normalize edilir ve geçersiz kategori ref reddedilir', async () => {
    const key = '11111111-1111-4111-8111-111111111111';
    const file = path.join(repo, `content/products/product-${key}.json`);
    const product = {
      editorKey: key,
      name: 'Yalnız Git fixture',
      description: 'Gerçek ürün değildir.',
      categoryId: 'category-missing',
      images: [],
      sortOrder: 0,
      status: 'draft',
    };
    writeFileSync(file, JSON.stringify(product));
    commit();
    git('checkout', 'main');
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'bad')),
    ).rejects.toThrow('categoryId');
    git('checkout', 'content-edit');
    writeFileSync(file, JSON.stringify({ ...product, categoryId: 'category-kahve' }));
    commit();
    git('checkout', 'main');
    const output = path.join(root, 'candidate');
    await prepareGitCandidate(repo, pins(), output);
    const result = JSON.parse(
      readFileSync(path.join(output, `content/products/product-${key}.json`), 'utf8'),
    ) as { id: string; editorKey?: string; status: string };
    expect(result.id).toBe(`product-${key}`);
    expect(result.editorKey).toBeUndefined();
    expect(result.status).toBe('draft');
  });
  it('kaynak veya main pin değişince eski kanıt kullanılamaz', () => {
    changeTitle('CMS');
    commit();
    git('checkout', 'main');
    const old = pins();
    git('commit', '--allow-empty', '-m', 'concurrent');
    expect(() => assertPins(repo, old)).toThrow('SHA değişti');
  });
  it('normalizasyon sürerken main değişirse çıktı yazılmaz', async () => {
    changeTitle('CMS');
    commit();
    git('checkout', 'main');
    const original = cms.prepareCmsData;
    vi.spyOn(cms, 'prepareCmsData').mockImplementationOnce(async (...args) => {
      git('commit', '--allow-empty', '-m', 'race during validation');
      return original(...args);
    });
    await expect(
      prepareGitCandidate(repo, pins(), path.join(root, 'candidate')),
    ).rejects.toThrow('SHA değişti');
    expect(existsSync(path.join(root, 'candidate'))).toBe(false);
  });
  it('tam SHA olmayan input ve no-change kaynak reddedilir', () => {
    git('checkout', 'main');
    expect(() => inspectSource(repo, { mainSha: 'main', sourceSha: base })).toThrow(
      'Tam, geçerli',
    );
    expect(() => inspectSource(repo, pins())).toThrow('değişikliği gerekli');
  });
  it('history audit geçmişte silinen env/tokeni de bulur; değeri loglamaz', () => {
    const token = ['ghp_', 'a'.repeat(40)].join('');
    writeFileSync(path.join(repo, '.env.local'), token);
    commit();
    rmSync(path.join(repo, '.env.local'));
    commit();
    const result = spawnSync(
      process.execPath,
      [path.join(project, 'scripts/audit-git-history.mjs'), repo],
      { encoding: 'utf8' },
    );
    expect(result.status).toBe(1);
    const report = JSON.parse(result.stdout) as {
      forbiddenPaths: string[];
      secretPatternFindings: unknown[];
    };
    expect(report.forbiddenPaths).toContain('.env.local');
    expect(report.secretPatternFindings.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain(token);
  });
  it('Git okuma yardımcı katmanı update-ref/push gibi yazma komutlarını reddeder', () => {
    expect(() => gitRead(repo, ['update-ref', 'refs/heads/main', base])).toThrow(
      'salt okunur',
    );
    expect(() => gitRead(repo, ['push', 'origin', 'main'])).toThrow('salt okunur');
  });
  it('Git okuma katmanı source çalışma ağacındaki dosyayı değil pinned blobu okur', () => {
    changeTitle('Commit içeriği');
    source = commit();
    changeTitle('Commit edilmemiş farklı veri');
    const tree = gitRead(repo, ['show', `${source}:content/pages/home.json`]).toString();
    expect(tree).toContain('Commit içeriği');
    expect(tree).not.toContain('Commit edilmemiş');
  });
});
