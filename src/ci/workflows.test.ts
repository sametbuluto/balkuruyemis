// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, it } from 'vitest';
const yaml = createRequire(import.meta.url)('js-yaml') as {
  load: (s: string) => unknown;
};
const load = (file: string) =>
  yaml.load(readFileSync(file, 'utf8')) as Record<string, unknown>;
const provenance = JSON.parse(readFileSync('scripts/ci/provenance.json', 'utf8')) as {
  actions: Record<string, { commit: string }>;
  image: { image: string };
  node: string;
};
it.each(['pr-diagnostics', 'trusted-candidate'])(
  '%s write/secrets/cache/attester yetkisi taşımayan pinned workflow',
  (name) => {
    const file = load(`.github/workflows/${name}.yml`);
    expect(file.permissions).toEqual({});
    const jobs = file.jobs as Record<
      string,
      { permissions: Record<string, string>; steps: Record<string, unknown>[] }
    >;
    for (const job of Object.values(jobs)) {
      expect(Object.values(job.permissions).every((v) => v === 'read')).toBe(true);
      for (const step of job.steps) {
        if (step.uses) {
          const [repo, hash] = String(step.uses).split('@');
          expect(hash).toMatch(/^[a-f0-9]{40}$/);
          expect(hash).toBe(provenance.actions[repo!]?.commit);
          const withs = step.with as Record<string, unknown>;
          expect(withs).not.toHaveProperty('cache');
          if (repo === 'actions/setup-node')
            expect(withs['package-manager-cache']).toBe(false);
          if (repo === 'actions/checkout')
            expect(withs['persist-credentials']).toBe(false);
        }
      }
    }
    const text = readFileSync(`.github/workflows/${name}.yml`, 'utf8');
    expect(text).not.toMatch(
      /secrets\.|checks:\s*write|contents:\s*write|id-token|pull_request_target|upload-artifact|download-artifact|actions\/cache/,
    );
  },
);
it('trusted controller default-main tetiklerini kullanır; PR head checkout yok', () => {
  const w = load('.github/workflows/trusted-candidate.yml');
  const on = w.on as Record<string, unknown>;
  expect(Object.keys(on).sort()).toEqual(['push', 'workflow_dispatch', 'workflow_run']);
  const text = readFileSync('.github/workflows/trusted-candidate.yml', 'utf8');
  expect(text).not.toContain('github.event.pull_request.head');
  expect(text).toContain('github.workflow_sha');
  expect(text).toContain('NOT an attested required check');
});
it('Docker base image verified digest ile sabit; local imaj/provenance authority değildir', () => {
  const docker = readFileSync('scripts/ci/Dockerfile', 'utf8');
  expect(docker).toContain('FROM ' + provenance.image.image);
  expect(provenance.image.image).toMatch(/@sha256:[a-f0-9]{64}$/);
  expect(provenance.node).toMatch(/^v24\./);
});

const { samePagesConfig, copyFields } = (await import(
  new URL('../../scripts/pages-config.mjs', import.meta.url).href
)) as {
  samePagesConfig: (left: unknown, right: unknown) => boolean;
  copyFields: (value: unknown) => unknown[];
};
const form = () => ({
  fields: [
    { name: 'title', type: 'string', label: 'Başlık', required: true },
    { name: 'description', type: 'text', label: 'Açıklama', required: true },
  ],
});
it('CMS canonical JSON key sırası farklı olsa da aynı alan sözleşmesi kabul edilir', () => {
  const original = form();
  const reordered = {
    fields: original.fields.toReversed().map(({ name, type, label, required }) => ({
      required,
      label,
      type,
      name,
    })),
  };
  expect(samePagesConfig(original, reordered)).toBe(true);
});
it.each(['type', 'label', 'required'])(
  'CMS form %s değişimi sıralama eşitliğiyle gizlenemez',
  (key) => {
    const changed = structuredClone(form());
    (changed.fields[0]! as Record<string, unknown>)[key] =
      key === 'required' ? false : 'invalid';
    expect(samePagesConfig(form(), changed)).toBe(false);
  },
);

it('opsiyonel iletişim alanının doldurulması CMS form zorunluluğunu değiştirmez', () => {
  const empty = { phone: null, email: null, instagram: { url: null } };
  const populated = {
    phone: 'TEST_ONLY_PHONE',
    email: 'test@example.invalid',
    instagram: { url: 'https://example.invalid/' },
  };
  expect(
    samePagesConfig({ fields: copyFields(empty) }, { fields: copyFields(populated) }),
  ).toBe(true);
});
