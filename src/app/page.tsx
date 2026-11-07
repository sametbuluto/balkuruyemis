import { AnnouncementsSection } from '@/features/home/announcements-section';
import { Hero } from '@/features/home/hero';
import { Explore } from '@/features/home/explore';
import { BrandStory } from '@/features/home/brand-story';
import { BranchesSection } from '@/features/home/branches-section';
import { GallerySection } from '@/features/home/gallery-section';
import { SocialSection } from '@/features/home/social-section';
import { createPageMetadata } from '@/lib/metadata';
import { getPageCopy } from '@/content/page-copy';

const copy = getPageCopy('home');
export const metadata = createPageMetadata(copy.seo.title, copy.seo.description, '/');

export default function HomePage() {
  return (
    <>
      <Hero />
      <Explore />
      <BrandStory />
      <BranchesSection />
      <GallerySection />
      <SocialSection />
      <AnnouncementsSection />
    </>
  );
}
