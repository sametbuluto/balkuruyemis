import { getPublishedAnnouncements } from '@/content/announcements';
import { getPageCopy } from '@/content/page-copy';
import { Container } from '@/components/ui/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { StaticImage } from '@/components/ui/static-image';

export function AnnouncementsSection() {
  const items = getPublishedAnnouncements();
  if (!items.length) return null;
  const copy = getPageCopy('home').announcements;
  return (
    <section
      className="section-space border-t border-line"
      aria-labelledby="announcements-heading"
    >
      <Container>
        <SectionHeading
          id="announcements-heading"
          eyebrow={copy.eyebrow}
          title={copy.title}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              id={`duyuru-${item.slug}`}
              className="min-w-0 border border-line p-6"
            >
              {item.image ? (
                <StaticImage
                  asset={item.image}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  loading="lazy"
                  className="mb-6 aspect-[4/3] h-auto w-full object-cover"
                />
              ) : null}
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
