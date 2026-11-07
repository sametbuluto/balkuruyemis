import { contactChannels } from '@/config/site';
import { LineIcon } from '@/components/ui/line-icon';
import { ArrowIcon } from '@/components/ui/arrow-icon';
import type { ContactChannel } from '@/types/content';

export function ContactChannels({
  channels = contactChannels,
}: {
  channels?: readonly ContactChannel[];
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {channels.map((channel) => (
        <article
          key={channel.id}
          className="flex min-w-0 flex-col border border-line border-t-2 border-t-brand-red bg-white p-7 sm:p-8"
        >
          <LineIcon name={channel.id} className="h-9 w-9 text-brand-red" />
          <h3 className="mt-7 font-display text-2xl font-bold tracking-tight">
            {channel.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted">{channel.description}</p>
          <div className="mt-auto pt-6">
            {channel.url ? (
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                {channel.actionLabel ?? `${channel.name}’a gidin`} <ArrowIcon />
                <span className="sr-only">(yeni sekmede açılır)</span>
              </a>
            ) : (
              <p className="flex items-center gap-2 text-xs leading-6 text-muted">
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-brand-gold"
                />
                Resmî bağlantı yakında paylaşılacak.
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
