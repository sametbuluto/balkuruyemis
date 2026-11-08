// @vitest-environment node
import { expect, it } from 'vitest';
import {
  apiReader,
  observePr,
  observeController,
  sameObservation,
  sourceBranch,
  repository,
  type ReadApi,
  type ControllerContext,
} from './github';
const M = 'a'.repeat(40),
  C = 'b'.repeat(40);
function fixture() {
  const routes: Record<string, unknown> = {
    '': {
      id: repository.id,
      full_name: repository.fullName,
      owner: { id: repository.ownerId },
      visibility: 'public',
      default_branch: 'main',
      archived: false,
      disabled: false,
    },
    '/git/ref/heads/main': { object: { sha: M } },
    '/rulesets/26805718': {
      id: 26805718,
      target: 'branch',
      enforcement: 'active',
      conditions: { ref_name: { include: ['refs/heads/main'], exclude: [] } },
      bypass_actors: [],
      rules: [
        { type: 'deletion' },
        { type: 'non_fast_forward' },
        {
          type: 'pull_request',
          parameters: {
            required_approving_review_count: 0,
            require_code_owner_review: false,
            require_last_push_approval: false,
          },
        },
      ],
    },
    '/rules/branches/main': ['deletion', 'non_fast_forward', 'pull_request'].map(
      (type) => ({ type, ruleset_id: 26805718 }),
    ),
    '/pulls/7': {
      number: 7,
      state: 'open',
      draft: false,
      head: { ref: 'content-edit', sha: C, repo: { id: repository.id } },
      base: { ref: 'main', sha: M, repo: { id: repository.id } },
    },
    '/git/ref/heads/content-edit': { object: { sha: C } },
    '/actions/runs/10': {
      id: 10,
      workflow_id: 11,
      head_sha: M,
      head_branch: 'main',
      event: 'workflow_run',
      status: 'in_progress',
      run_attempt: 1,
      repository: { id: repository.id },
    },
    '/actions/workflows/trusted-candidate.yml': {
      id: 11,
      path: '.github/workflows/trusted-candidate.yml',
      state: 'active',
    },
    '/actions/runs/20': {
      id: 20,
      workflow_id: 21,
      event: 'pull_request',
      status: 'completed',
      conclusion: 'success',
      head_sha: C,
      repository: { id: repository.id },
      head_repository: { id: repository.id },
      pull_requests: [{ number: 7 }],
    },
    '/actions/workflows/pr-diagnostics.yml': {
      id: 21,
      path: '.github/workflows/pr-diagnostics.yml',
      state: 'active',
    },
    '/pulls?state=open&base=main&per_page=11': [{ number: 7, draft: false }],
  };
  const read: ReadApi = async (p) => {
    if (!(p in routes)) throw new Error('Unexpected API path ' + p);
    return structuredClone(routes[p]);
  };
  const context: ControllerContext = {
    repository: repository.fullName,
    eventName: 'workflow_run',
    ref: 'refs/heads/main',
    workflowRef:
      repository.fullName + '/.github/workflows/trusted-candidate.yml@refs/heads/main',
    workflowSha: M,
    runId: 10,
    runAttempt: 1,
  };
  const event = { repository: { id: repository.id }, workflow_run: { id: 20 } };
  return {
    routes,
    read,
    context,
    event,
    patch: (path: string, fn: (v: Record<string, unknown>) => void) =>
      fn(routes[path] as Record<string, unknown>),
  };
}
it('API üzerinden M/C/H ve policy doğrulanır; sonuç yetkili check değildir', async () => {
  const f = fixture(),
    o = await observePr(f.read, 7);
  expect(o).toMatchObject({
    mainSha: M,
    sourceSha: C,
    prHeadSha: C,
    authoritative: false,
    number: 7,
    bypassListVisible: true,
  });
  expect(await observeController(f.read, f.context, f.event)).toEqual([o]);
});
it.each([
  [
    'repo',
    (f: ReturnType<typeof fixture>) =>
      f.patch('', (v) => {
        v.id = 1;
      }),
  ],
  [
    'owner',
    (f: ReturnType<typeof fixture>) =>
      f.patch('', (v) => {
        v.owner = { id: 1 };
      }),
  ],
  [
    'private',
    (f: ReturnType<typeof fixture>) =>
      f.patch('', (v) => {
        v.visibility = 'private';
      }),
  ],
  [
    'main SHA',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/git/ref/heads/main', (v) => {
        v.object = { sha: 'fake' };
      }),
  ],
  [
    'source SHA',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/git/ref/heads/content-edit', (v) => {
        v.object = { sha: 'c'.repeat(40) };
      }),
  ],
  [
    'fork',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/pulls/7', (v) => {
        v.head = { ref: 'content-edit', sha: C, repo: { id: 1 } };
      }),
  ],
  [
    'draft',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/pulls/7', (v) => {
        v.draft = true;
      }),
  ],
  [
    'closed',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/pulls/7', (v) => {
        v.state = 'closed';
      }),
  ],
  [
    'base SHA',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/pulls/7', (v) => {
        v.base = { ref: 'main', sha: 'c'.repeat(40), repo: { id: repository.id } };
      }),
  ],
  [
    'disabled policy',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/rulesets/26805718', (v) => {
        v.enforcement = 'disabled';
      }),
  ],
  [
    'bypass',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/rulesets/26805718', (v) => {
        v.bypass_actors = [{ actor_id: 1 }];
      }),
  ],
  [
    'extra rule',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/rulesets/26805718', (v) => {
        (v.rules as unknown[]).push({ type: 'update' });
      }),
  ],
  [
    'wrong target',
    (f: ReturnType<typeof fixture>) =>
      f.patch('/rulesets/26805718', (v) => {
        v.conditions = { ref_name: { include: ['~ALL'], exclude: [] } };
      }),
  ],
  [
    'missing effective',
    (f: ReturnType<typeof fixture>) => {
      f.routes['/rules/branches/main'] = [];
    },
  ],
])('yanlış %s reddedilir', async (_name, mutate) => {
  const f = fixture();
  mutate(f);
  await expect(observePr(f.read, 7)).rejects.toThrow();
});
it('salt read token bypass listesini göremiyorsa bunu doğrulandı gibi sunmaz', async () => {
  const f = fixture();
  f.patch('/rulesets/26805718', (v) => {
    delete v.bypass_actors;
  });
  expect(await observePr(f.read, 7)).toMatchObject({
    bypassListVisible: false,
    authoritative: false,
  });
});
it.each([
  'eventName',
  'repository',
  'ref',
  'workflowRef',
  'workflowSha',
  'runId',
  'runAttempt',
] as const)('controller %s kimliğini payload ile sahteleştiremez', async (key) => {
  const f = fixture();
  const context = {
    ...f.context,
    [key]: typeof f.context[key] === 'number' ? 99 : 'wrong',
  } as ControllerContext;
  await expect(observeController(f.read, context, f.event)).rejects.toThrow();
});
it.each([
  'workflow_id',
  'head_sha',
  'head_branch',
  'event',
  'run_attempt',
  'id',
  'status',
])('GitHub run %s alanı uyumsuzsa reddeder', async (key) => {
  const f = fixture();
  f.patch('/actions/runs/10', (v) => {
    v[key] = 'wrong';
  });
  await expect(observeController(f.read, f.context, f.event)).rejects.toThrow();
});
it('aynı check/workflow adını kullanan başka workflow ID sinyali kabul edilmez', async () => {
  const f = fixture();
  f.patch('/actions/runs/20', (v) => {
    v.workflow_id = 999;
    v.name = 'PR diagnostics (non-authoritative)';
  });
  await expect(observeController(f.read, f.context, f.event)).rejects.toThrow();
});
it.each(['failure', 'neutral', 'skipped'])(
  'source run %s sonucu başarı kanıtı sayılmaz; trusted okuma bağımsızdır',
  async (conclusion) => {
    const f = fixture();
    f.patch('/actions/runs/20', (v) => {
      v.conclusion = conclusion;
    });
    const [o] = await observeController(f.read, f.context, f.event);
    expect(o?.authoritative).toBe(false);
  },
);
it('eski signal PR head reddedilir', async () => {
  const f = fixture();
  f.patch('/actions/runs/20', (v) => {
    v.head_sha = 'd'.repeat(40);
  });
  await expect(observeController(f.read, f.context, f.event)).rejects.toThrow('Eski');
});
it('belirsiz PR ilişkisi reddedilir', async () => {
  const f = fixture();
  f.patch('/actions/runs/20', (v) => {
    v.pull_requests = [];
  });
  await expect(observeController(f.read, f.context, f.event)).rejects.toThrow();
});
it('dispatch input yalnız PR numarasıdır; gerçek head API ile tekrar okunur', async () => {
  const f = fixture();
  f.context.eventName = 'workflow_dispatch';
  f.patch('/actions/runs/10', (v) => {
    v.event = 'workflow_dispatch';
  });
  expect(
    (
      await observeController(f.read, f.context, { repository: { id: repository.id } }, 7)
    )[0]?.prHeadSha,
  ).toBe(C);
});
it('push main açık PR batch okur; kısmi batch kabul etmez', async () => {
  const f = fixture();
  f.context.eventName = 'push';
  f.patch('/actions/runs/10', (v) => {
    v.event = 'push';
  });
  const event = { repository: { id: repository.id }, ref: 'refs/heads/main', after: M };
  expect((await observeController(f.read, f.context, event)).length).toBe(1);
  f.routes['/pulls?state=open&base=main&per_page=11'] = Array.from(
    { length: 11 },
    () => ({ number: 7, draft: false }),
  );
  await expect(observeController(f.read, f.context, event)).rejects.toThrow('sınırı');
});
it('API gözlemi sırasında main değişirse durur', async () => {
  const f = fixture();
  let calls = 0;
  const read: ReadApi = async (p) =>
    p === '/git/ref/heads/main' && ++calls > 1
      ? { object: { sha: 'e'.repeat(40) } }
      : f.read(p);
  await expect(observePr(read, 7)).rejects.toThrow('Stale');
});
it('işlem sonrası source/main/PR değişimi eski sonucu geçersiz kılar', async () => {
  const f = fixture(),
    before = await observePr(f.read, 7);
  for (const key of [
    'mainSha',
    'sourceSha',
    'prHeadSha',
    'sourceRef',
    'repositoryId',
    'number',
  ] as const)
    expect(() =>
      sameObservation(before, { ...before, [key]: 'changed' } as typeof before),
    ).toThrow();
});
it.each(['../main', '-x', 'a..b', 'a//b', '.hidden', 'a.lock', 'main', 'foo\nbar'])(
  'kaynak dal adı güvenliği: %s',
  (name) => expect(() => sourceBranch(name)).toThrow(),
);
it('API istemcisi yalnız sabit HTTPS hedefe GET yapar; redirect ve sayfalama güvenilmez', async () => {
  const calls: RequestInit[] = [];
  const request: typeof fetch = async (input, init) => {
    expect(
      String(input).startsWith('https://api.github.com/repos/sametbuluto/balkuruyemis/'),
    ).toBe(true);
    calls.push(init ?? {});
    return new Response('{}');
  };
  const read = apiReader('fixture-readonly', request);
  await read('/pulls/7');
  expect(calls[0]).toMatchObject({ method: 'GET', redirect: 'error' });
  await expect(read('/../other')).rejects.toThrow();
  await expect(
    apiReader(
      undefined,
      async () => new Response('[]', { headers: { link: '<x>; rel="next"' } }),
    )('/pulls'),
  ).rejects.toThrow('sayfalama');
  await expect(
    apiReader(undefined, async () => new Response('{}', { status: 403 }))('/pulls'),
  ).rejects.toThrow('403');
});
