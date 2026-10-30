import { LineIcon } from '@/components/ui/line-icon';

export function MediaPlaceholder({
  label,
  className = '',
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-48 flex-col items-center justify-center gap-4 overflow-hidden border border-line bg-surface px-5 py-8 text-center ${className}`}
    >
      <span aria-hidden="true" className="absolute top-0 left-0 h-1 w-12 bg-brand-red" />
      <LineIcon name="photo" className="text-brand-red" />
      <p className="text-xs leading-6 text-muted">{label}</p>
    </div>
  );
}
