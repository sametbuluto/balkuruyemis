import { BranchCard } from '@/features/branches/branch-card';
import { exampleBranches, getPublishedBranches } from '@/features/branches/data';

export function BranchGrid() {
  const published = getPublishedBranches();
  const displayed = published.length > 0 ? published : exampleBranches;
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {displayed.map((branch) => (
        <BranchCard key={branch.id} branch={branch} />
      ))}
    </div>
  );
}
