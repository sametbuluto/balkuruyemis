export interface PromotionEvidence {
  repository: string;
  method: 'pull-request' | 'direct';
  baseRef: string;
  observed: { main: string; source: string; prHead: string };
  tested: {
    main: string;
    source: string;
    candidate: string;
    candidateParent: string;
    workflowSha: string;
    workflowRef: string;
    dataOnly: boolean;
    normalized: boolean;
  };
  protection: {
    verifiedFromApi: boolean;
    prRequired: boolean;
    strictChecks: boolean;
    enforced: boolean;
    adminsIncluded: boolean;
    bypassActors: number;
    forcePush: boolean;
    deletion: boolean;
    expectedCheckAppId: number | null;
  };
  check: {
    name: string;
    sha: string;
    appId: number;
    status: string;
    conclusion: string;
    trustedRunVerified: boolean;
  };
  validator: {
    writeToken: boolean;
    secrets: boolean;
    sourceCodeExecuted: boolean;
    sourceArtifactTrusted: boolean;
  };
}
/** Yerel modeldir. Kanıt alanlarını gelecekte trusted API okuyucusu üretmeli; input yetki değildir. */
export function simulatePromotionGate(e: PromotionEvidence): readonly string[] {
  const errors: string[] = [];
  const sha = /^[a-f0-9]{40}$/;
  if (e.repository !== 'sametbuluto/balkuruyemis' || e.baseRef !== 'refs/heads/main')
    errors.push('hedef repo/ref');
  if (e.method !== 'pull-request') errors.push('main doğrudan yazma yasak');
  for (const value of [
    e.observed.main,
    e.observed.source,
    e.observed.prHead,
    ...[
      e.tested.main,
      e.tested.source,
      e.tested.candidate,
      e.tested.candidateParent,
      e.tested.workflowSha,
    ],
  ])
    if (!sha.test(value)) errors.push('geçersiz SHA');
  if (
    e.observed.main !== e.tested.main ||
    e.observed.source !== e.tested.source ||
    e.observed.prHead !== e.tested.candidate ||
    e.tested.candidateParent !== e.tested.main
  )
    errors.push('SHA drift/race');
  if (
    e.tested.workflowSha !== e.tested.main ||
    e.tested.workflowRef !==
      'sametbuluto/balkuruyemis/.github/workflows/trusted-candidate.yml@refs/heads/main'
  )
    errors.push('güvenilmeyen workflow');
  if (e.tested.dataOnly !== true || e.tested.normalized !== true)
    errors.push('raw/kod candidate yasak');
  const p = e.protection;
  if (
    p.verifiedFromApi !== true ||
    p.prRequired !== true ||
    p.strictChecks !== true ||
    p.enforced !== true ||
    p.adminsIncluded !== true ||
    p.bypassActors !== 0 ||
    p.forcePush !== false ||
    p.deletion !== false
  )
    errors.push('koruma doğrulanmadı/eksik');
  if (
    !Number.isSafeInteger(p.expectedCheckAppId) ||
    p.expectedCheckAppId === null ||
    p.expectedCheckAppId <= 0
  )
    errors.push('validator App doğrulanmadı');
  const c = e.check;
  if (
    c.name !== 'content-candidate/trusted-validation' ||
    c.sha !== e.tested.candidate ||
    c.appId !== p.expectedCheckAppId ||
    c.status !== 'completed' ||
    c.conclusion !== 'success' ||
    c.trustedRunVerified !== true
  )
    errors.push('required check kanıtı eksik/sahte');
  if (
    Object.keys(e.validator).length !== 4 ||
    [
      e.validator.writeToken,
      e.validator.secrets,
      e.validator.sourceCodeExecuted,
      e.validator.sourceArtifactTrusted,
    ].some((v) => v !== false)
  )
    errors.push('validator güven sınırı');
  return errors;
}
