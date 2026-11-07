import { prepareGitCandidate } from './candidate.server';
const [repo, main, source, output] = process.argv.slice(2);
if (!repo || !main || !source || !output || process.argv.length !== 6) {
  console.error(
    'Teknik yerel araç: publishing:simulate -- <repo> <mainSHA> <sourceSHA> <ayrı boş output>',
  );
  process.exitCode = 1;
} else
  prepareGitCandidate(repo, { mainSha: main, sourceSha: source }, output)
    .then((value) => console.log(JSON.stringify(value, null, 2)))
    .catch((error: unknown) => {
      console.error(
        error instanceof Error ? error.message : 'Candidate hazırlığı başarısız.',
      );
      process.exitCode = 1;
    });
