import { Hero } from '@/features/home/hero';
import { Explore } from '@/features/home/explore';
import { BrandStory } from '@/features/home/brand-story';
import { BranchesSection } from '@/features/home/branches-section';
import { GallerySection } from '@/features/home/gallery-section';
import { SocialSection } from '@/features/home/social-section';
import { createPageMetadata } from '@/lib/metadata';
import { site } from '@/config/site';

export const metadata = createPageMetadata(
  'Lezzetin Doğal Adresi',
  site.description,
  '/',
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Explore />
      <BrandStory />
      <BranchesSection />
      <GallerySection />
      <SocialSection />
    </>
  );
}
