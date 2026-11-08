export const repository = {
  fullName: 'sametbuluto/balkuruyemis',
  id: 1439737232,
  ownerId: 219654036,
  url: 'https://github.com/sametbuluto/balkuruyemis.git',
  ruleId: 26805718,
} as const;
export const controllerPath = '.github/workflows/trusted-candidate.yml';
export const signalPath = '.github/workflows/pr-diagnostics.yml';
export type ReadApi = (path: string) => Promise<unknown>;
export function object(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== 'object' || Array.isArray(v))
    throw new Error('API nesnesi gerekli.');
  return v as Record<string, unknown>;
}
export function array(v: unknown): unknown[] {
  if (!Array.isArray(v)) throw new Error('API listesi gerekli.');
  return v;
}
export function sha(v: unknown): string {
  if (typeof v !== 'string' || !/^[a-f0-9]{40}$/.test(v))
    throw new Error('Tam SHA gerekli.');
  return v;
}
export function number(v: unknown): number {
  if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 1)
    throw new Error('Pozitif kimlik gerekli.');
  return v;
}
export function sourceBranch(v: unknown): string {
  if (
    typeof v !== 'string' ||
    v.length > 150 ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/.test(v) ||
    v.includes('..') ||
    v.includes('//') ||
    v
      .split('/')
      .some((p) => !p || p.endsWith('.') || p.endsWith('.lock') || p.startsWith('.')) ||
    v === 'main'
  )
    throw new Error('Kaynak dal adı reddedildi.');
  return v;
}
export function identity(v: unknown) {
  const r = object(v);
  if (
    r.id !== repository.id ||
    r.full_name !== repository.fullName ||
    object(r.owner).id !== repository.ownerId ||
    r.visibility !== 'public' ||
    r.default_branch !== 'main' ||
    r.archived !== false ||
    r.disabled !== false
  )
    throw new Error('Repository/owner kimliği reddedildi.');
}
export function apiReader(token?: string, request: typeof fetch = fetch): ReadApi {
  return async (suffix) => {
    if (
      (suffix !== '' && !/^\/[a-zA-Z0-9_/?=&%.-]+$/.test(suffix)) ||
      suffix.includes('..')
    )
      throw new Error('API yolu reddedildi.');
    const response = await request(
      `https://api.github.com/repos/${repository.fullName}${suffix}`,
      {
        method: 'GET',
        redirect: 'error',
        signal: AbortSignal.timeout(30_000),
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'bal-readonly-ci',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    if (!response.ok) throw new Error(`GitHub GET başarısız: ${response.status}`);
    if (response.headers.get('link')?.includes('rel="next"'))
      throw new Error('API sayfalama sınırı; kısmi veri kullanılmaz.');
    const text = await response.text();
    if (Buffer.byteLength(text) > 4 * 1024 * 1024) throw new Error('API yanıtı sınırı.');
    return JSON.parse(text) as unknown;
  };
}
async function mainSha(read: ReadApi) {
  return sha(object(object(await read('/git/ref/heads/main')).object).sha);
}
export interface Observation {
  number: number;
  mainSha: string;
  sourceSha: string;
  prHeadSha: string;
  sourceRef: string;
  repositoryId: number;
  bypassListVisible: boolean;
  authoritative: false;
}
export async function observePr(read: ReadApi, prNumber: number): Promise<Observation> {
  number(prNumber);
  identity(await read(''));
  const main = await mainSha(read);
  const policy = object(await read(`/rulesets/${repository.ruleId}`));
  const refs = object(object(policy.conditions).ref_name);
  if (
    policy.id !== repository.ruleId ||
    policy.enforcement !== 'active' ||
    policy.target !== 'branch' ||
    JSON.stringify(refs.include) !== '["refs/heads/main"]' ||
    JSON.stringify(refs.exclude) !== '[]'
  )
    throw new Error('Bootstrap policy değişti.');
  if (policy.bypass_actors !== undefined && array(policy.bypass_actors).length)
    throw new Error('Policy bypass aktörü var.');
  const ruleTypes = array(policy.rules)
    .map((r) => object(r).type)
    .sort();
  if (
    JSON.stringify(ruleTypes) !==
    JSON.stringify(['deletion', 'non_fast_forward', 'pull_request'])
  )
    throw new Error('Bootstrap kural seti değişti.');
  const rules = array(policy.rules).map(object);
  const prPolicy = object(rules.find((r) => r.type === 'pull_request')?.parameters);
  if (
    prPolicy.required_approving_review_count !== 0 ||
    prPolicy.require_code_owner_review !== false ||
    prPolicy.require_last_push_approval !== false
  )
    throw new Error('Bootstrap PR kuralı değişti.');
  const effective = array(await read('/rules/branches/main'));
  if (
    effective.length !== 3 ||
    effective.some((r) => object(r).ruleset_id !== repository.ruleId) ||
    JSON.stringify(effective.map((r) => object(r).type).sort()) !==
      JSON.stringify(ruleTypes)
  )
    throw new Error('Effective main policy eşleşmiyor.');
  const pr = object(await read(`/pulls/${prNumber}`)),
    head = object(pr.head),
    base = object(pr.base);
  if (
    pr.number !== prNumber ||
    pr.state !== 'open' ||
    pr.draft !== false ||
    base.ref !== 'main' ||
    object(base.repo).id !== repository.id ||
    object(head.repo).id !== repository.id ||
    sha(base.sha) !== main
  )
    throw new Error('PR kimliği/base/fork/draft reddedildi.');
  const branch = sourceBranch(head.ref),
    h = sha(head.sha);
  const ref = object(
    await read(`/git/ref/heads/${branch.split('/').map(encodeURIComponent).join('/')}`),
  );
  const c = sha(object(ref.object).sha);
  if (c !== h || (await mainSha(read)) !== main)
    throw new Error('Stale source/main SHA.');
  return {
    number: prNumber,
    mainSha: main,
    sourceSha: c,
    prHeadSha: h,
    sourceRef: branch,
    repositoryId: repository.id,
    bypassListVisible: Array.isArray(policy.bypass_actors),
    authoritative: false,
  };
}
export interface ControllerContext {
  eventName: string;
  repository: string;
  ref: string;
  workflowRef: string;
  workflowSha: string;
  runId: number;
  runAttempt: number;
}
export async function observeController(
  read: ReadApi,
  context: ControllerContext,
  event: unknown,
  requested?: number,
) {
  identity(await read(''));
  const main = await mainSha(read);
  const run = object(await read(`/actions/runs/${number(context.runId)}`));
  const workflow = object(await read(`/actions/workflows/trusted-candidate.yml`));
  if (
    context.repository !== repository.fullName ||
    context.ref !== 'refs/heads/main' ||
    context.workflowRef !== `${repository.fullName}/${controllerPath}@refs/heads/main` ||
    sha(context.workflowSha) !== main ||
    run.head_sha !== main ||
    run.head_branch !== 'main' ||
    number(run.id) !== context.runId ||
    number(run.workflow_id) !== number(workflow.id) ||
    workflow.state !== 'active' ||
    workflow.path !== controllerPath ||
    run.status !== 'in_progress' ||
    run.event !== context.eventName ||
    run.run_attempt !== number(context.runAttempt) ||
    object(run.repository).id !== repository.id ||
    !['workflow_run', 'workflow_dispatch', 'push'].includes(context.eventName)
  )
    throw new Error('Trusted workflow/run kimliği reddedildi.');
  const payload = object(event);
  if (object(payload.repository).id !== repository.id)
    throw new Error('Event repository kimliği farklı.');
  let numbers: number[];
  if (context.eventName === 'workflow_run') {
    const signalId = number(object(payload.workflow_run).id);
    const signal = object(await read(`/actions/runs/${signalId}`));
    const expectedWorkflow = object(await read('/actions/workflows/pr-diagnostics.yml'));
    if (
      number(signal.id) !== signalId ||
      number(signal.workflow_id) !== number(expectedWorkflow.id) ||
      expectedWorkflow.state !== 'active' ||
      expectedWorkflow.path !== signalPath ||
      signal.event !== 'pull_request' ||
      signal.status !== 'completed' ||
      object(signal.repository).id !== repository.id ||
      object(signal.head_repository).id !== repository.id
    )
      throw new Error('Başka workflow/run sinyali reddedildi.');
    const prs = array(signal.pull_requests);
    if (prs.length !== 1) throw new Error('Tek PR ilişkisi gerekli.');
    numbers = [number(object(prs[0]).number)];
    const pr = object(await read(`/pulls/${numbers[0]}`));
    if (sha(object(pr.head).sha) !== sha(signal.head_sha))
      throw new Error('Eski signal/head SHA.');
  } else if (context.eventName === 'workflow_dispatch' && requested !== undefined)
    numbers = [number(requested)];
  else {
    if (
      context.eventName === 'push' &&
      (payload.ref !== 'refs/heads/main' || payload.after !== main)
    )
      throw new Error('Push/main kimliği farklı.');
    const prs = array(await read('/pulls?state=open&base=main&per_page=11'));
    if (prs.length > 10) throw new Error('PR batch sınırı; kısmi başarı yok.');
    numbers = prs
      .filter((v) => object(v).draft === false)
      .map((v) => number(object(v).number));
  }
  const observations: Observation[] = [];
  for (const n of numbers) observations.push(await observePr(read, n));
  if ((await mainSha(read)) !== main)
    throw new Error('Controller sırasında main değişti.');
  return observations;
}
export function sameObservation(before: Observation, after: Observation) {
  if (
    before.number !== after.number ||
    before.mainSha !== after.mainSha ||
    before.sourceSha !== after.sourceSha ||
    before.prHeadSha !== after.prHeadSha ||
    before.sourceRef !== after.sourceRef ||
    before.repositoryId !== after.repositoryId
  )
    throw new Error('Validation sırasında stale source/main/PR.');
}
