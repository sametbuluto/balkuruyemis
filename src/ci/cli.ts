import { readFile, appendFile, mkdir, writeFile } from 'node:fs/promises';
import {
  apiReader,
  observeController,
  observePr,
  sameObservation,
  number,
  type ControllerContext,
} from './github';
import { fetchObservation } from './git';
import { executeSandbox } from './sandbox';
import { observation, runInside } from './inside';
import { probeSandbox } from './probe';
async function main() {
  const mode = process.argv[2],
    read = apiReader(process.env.GITHUB_TOKEN);
  if (mode === 'probe') {
    console.log(JSON.stringify(await probeSandbox()));
    return;
  }
  if (mode === 'inside') {
    const kind = process.argv[3];
    if (kind !== 'content' && kind !== 'technical')
      throw new Error('Sandbox mode gerekli.');
    console.log(
      JSON.stringify(
        await runInside(
          observation(JSON.parse(process.argv[4] ?? 'null') as unknown),
          kind,
        ),
      ),
    );
    return;
  }
  if (mode === 'observe') {
    const context: ControllerContext = {
      eventName: process.env.GITHUB_EVENT_NAME ?? '',
      repository: process.env.GITHUB_REPOSITORY ?? '',
      ref: process.env.GITHUB_REF ?? '',
      workflowRef: process.env.GITHUB_WORKFLOW_REF ?? '',
      workflowSha: process.env.GITHUB_WORKFLOW_SHA ?? '',
      runId: Number(process.env.GITHUB_RUN_ID),
      runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT),
    };
    const event = JSON.parse(
      await readFile(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
    ) as unknown;
    const requested = process.env.INPUT_PR_NUMBER
      ? number(Number(process.env.INPUT_PR_NUMBER))
      : undefined;
    const items = await observeController(read, context, event, requested);
    if (!process.env.GITHUB_OUTPUT) throw new Error('GitHub output gerekli.');
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `matrix=${JSON.stringify({ include: items.map((v) => ({ pr: v.number })) })}\nhas_prs=${items.length > 0}\n`,
    );
    console.log(
      JSON.stringify({ observed: items, authoritative: false, attesterPresent: false }),
    );
    return;
  }
  if (mode === 'content' || mode === 'diagnostics' || mode === 'sandbox-probe') {
    const n = number(Number(process.argv[3])),
      before = await observePr(read, n);
    if (mode !== 'diagnostics') {
      const context: ControllerContext = {
        eventName: process.env.GITHUB_EVENT_NAME ?? '',
        repository: process.env.GITHUB_REPOSITORY ?? '',
        ref: process.env.GITHUB_REF ?? '',
        workflowRef: process.env.GITHUB_WORKFLOW_REF ?? '',
        workflowSha: process.env.GITHUB_WORKFLOW_SHA ?? '',
        runId: Number(process.env.GITHUB_RUN_ID),
        runAttempt: Number(process.env.GITHUB_RUN_ATTEMPT),
      };
      const event = JSON.parse(
        await readFile(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
      ) as unknown;
      const items = await observeController(
        read,
        context,
        event,
        process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' ? n : undefined,
      );
      if (!items.some((v) => v.number === n))
        throw new Error('PR trusted batch içinde değil.');
    }
    const repo = await fetchObservation(before);
    const result = await executeSandbox(
      repo,
      before,
      mode === 'diagnostics'
        ? 'technical'
        : mode === 'sandbox-probe'
          ? 'probe'
          : 'content',
    );
    sameObservation(before, await observePr(read, n));
    await mkdir('.generated/ci', { recursive: true });
    await writeFile(
      `.generated/ci/pr-${n}.json`,
      JSON.stringify({ ...before, ...result, realGitHubAcceptance: false }, null, 2) +
        '\n',
    );
    console.log(JSON.stringify({ ...before, ...result, requiredCheck: false }));
    return;
  }
  throw new Error('CI mode: observe | content | diagnostics | sandbox-probe');
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'CI doğrulaması başarısız.');
  process.exitCode = 1;
});
