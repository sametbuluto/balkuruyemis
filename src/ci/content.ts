import { inspectSource } from '../publishing/git-source.server';
import { prepareGitCandidate } from '../publishing/candidate.server';
import type { Observation } from './github';
export async function validateContent(repo: string, o: Observation, output: string) {
  inspectSource(repo, { mainSha: o.mainSha, sourceSha: o.sourceSha });
  return prepareGitCandidate(
    repo,
    { mainSha: o.mainSha, sourceSha: o.sourceSha },
    output,
  );
}
