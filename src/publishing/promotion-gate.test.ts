// @vitest-environment node
import { expect, it } from 'vitest';
import { simulatePromotionGate, type PromotionEvidence } from './promotion-gate';
const M = 'a'.repeat(40),
  C = 'b'.repeat(40),
  P = 'c'.repeat(40);
function fixture(): PromotionEvidence {
  return {
    repository: 'sametbuluto/balkuruyemis',
    method: 'pull-request',
    baseRef: 'refs/heads/main',
    observed: { main: M, source: C, prHead: P },
    tested: {
      main: M,
      source: C,
      candidate: P,
      candidateParent: M,
      workflowSha: M,
      workflowRef:
        'sametbuluto/balkuruyemis/.github/workflows/trusted-candidate.yml@refs/heads/main',
      dataOnly: true,
      normalized: true,
    },
    protection: {
      verifiedFromApi: true,
      prRequired: true,
      strictChecks: true,
      enforced: true,
      adminsIncluded: true,
      bypassActors: 0,
      forcePush: false,
      deletion: false,
      expectedCheckAppId: 12345,
    },
    check: {
      name: 'content-candidate/trusted-validation',
      sha: P,
      appId: 12345,
      status: 'completed',
      conclusion: 'success',
      trustedRunVerified: true,
    },
    validator: {
      writeToken: false,
      secrets: false,
      sourceCodeExecuted: false,
      sourceArtifactTrusted: false,
    },
  };
}
it('yalnız yerel varsayımsal tam kanıt profili geçer; gerçek GitHub yetkisi oluşturmaz', () =>
  expect(simulatePromotionGate(fixture())).toEqual([]));
it('CMS veya botun doğrudan main yazmasını check yeşil olsa bile reddeder', () =>
  expect(simulatePromotionGate({ ...fixture(), method: 'direct' })).toContain(
    'main doğrudan yazma yasak',
  ));
it.each([
  'verifiedFromApi',
  'prRequired',
  'strictChecks',
  'enforced',
  'adminsIncluded',
] as const)('koruma kanıtı eksikse durur: %s', (key) => {
  const e = fixture();
  e.protection[key] = false;
  expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
});
it.each(['forcePush', 'deletion'] as const)('tehlikeli dal izni: %s', (key) => {
  const e = fixture();
  e.protection[key] = true;
  expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
});
it('App/admin bypass veya bilinmeyen required-check App kimliği reddi', () => {
  for (const changes of [
    { bypassActors: 1 },
    { expectedCheckAppId: null },
    { expectedCheckAppId: 0 },
  ]) {
    const e = fixture();
    Object.assign(e.protection, changes);
    expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
  }
});
it.each(['main', 'source', 'prHead'] as const)('eşzamanlı SHA değişimi: %s', (key) => {
  const e = fixture();
  e.observed[key] = 'd'.repeat(40);
  expect(simulatePromotionGate(e)).toContain('SHA drift/race');
});
it.each(['skipped', 'neutral', 'failure', 'cancelled', 'timed_out'])(
  'yeşil olmayan required check: %s',
  (conclusion) => {
    const e = fixture();
    e.check.conclusion = conclusion;
    expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
  },
);
it('doğru isimli sahte App/check veya eski candidate check reddedilir', () => {
  for (const change of [
    { appId: 6789 },
    { sha: C },
    { status: 'in_progress' },
    { trustedRunVerified: false },
    { name: 'tests' },
  ]) {
    const e = fixture();
    Object.assign(e.check, change);
    expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
  }
});
it.each(['workflowSha', 'workflowRef', 'candidateParent'] as const)(
  'güvenilmeyen workflow/base: %s',
  (key) => {
    const e = fixture();
    e.tested[key] = key === 'workflowRef' ? 'source-branch' : C;
    expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
  },
);
it.each(['dataOnly', 'normalized'] as const)('raw/kod candidate reddi: %s', (key) => {
  const e = fixture();
  e.tested[key] = false;
  expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
});
it.each([
  'writeToken',
  'secrets',
  'sourceCodeExecuted',
  'sourceArtifactTrusted',
] as const)('validator ayrıcalığı/güvenilmeyen artifact reddi: %s', (key) => {
  const e = fixture();
  e.validator[key] = true;
  expect(simulatePromotionGate(e).length).toBeGreaterThan(0);
});
it('yanlış hedef repo/ref reddedilir', () => {
  expect(
    simulatePromotionGate({ ...fixture(), repository: 'other/repo' }).length,
  ).toBeGreaterThan(0);
  expect(
    simulatePromotionGate({ ...fixture(), baseRef: 'refs/heads/content-edit' }).length,
  ).toBeGreaterThan(0);
});
