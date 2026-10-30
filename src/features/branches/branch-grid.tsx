import { BranchCard } from '@/features/branches/branch-card';
import { getVisibleBranches } from '@/content/branches';
import type { BranchCardEntry } from '@/types/content';

export function BranchGrid({
  entries = getVisibleBranches(),
}: {
  entries?: readonly BranchCardEntry[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {entries.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
