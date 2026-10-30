/** Kalıcı kimlikler, sıralama ve yayın durumu ileride veritabanına taşınabilir. */
export type PublicationStatus = 'draft' | 'published';

export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: MediaAsset | null;
  sortOrder: number;
  status: PublicationStatus;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: ProductCategory['id'];
  name: string;
  description: string;
  images: readonly MediaAsset[];
  sortOrder: number;
  status: PublicationStatus;
}

export interface Branch {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  googleMapsUrl: string | null;
  whatsappUrl: string | null;
  images: readonly MediaAsset[];
  sortOrder: number;
  status: PublicationStatus;
  contentKind: 'verified' | 'example';
}

export interface BrandAssets {
  logo: MediaAsset | null;
  inverseLogo: MediaAsset | null;
}

export interface ContactChannel {
  id: 'instagram' | 'whatsapp';
  name: string;
  description: string;
  url: string | null;
}
