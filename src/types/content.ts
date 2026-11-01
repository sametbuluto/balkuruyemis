/** Git üzerinden yönetilen statik içerik sözleşmeleri. */
export type PublicationStatus = 'draft' | 'published';

export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  /** Gömülü eski kayıtlar için varsayılan published ve dizi sırası korunur. */
  status?: PublicationStatus;
  sortOrder?: number;
  variants?: readonly {
    url: string;
    width: number;
    format: 'image/avif' | 'image/webp';
  }[];
}

export type GalleryUsage = 'home-hero' | 'brand-gallery' | 'branches-gallery';
export interface GalleryEntry extends MediaAsset {
  status: PublicationStatus;
  sortOrder: number;
  usages: readonly GalleryUsage[];
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
  coordinates?: Coordinates | null;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Konum gerçek; işletme adı/adres eşleşmesi henüz doğrulanmadı. Detay URL'si yok. */
export interface BranchLocation {
  id: string;
  slug: null;
  name: string;
  description: string;
  coordinates: Coordinates | null;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  googleMapsUrl: string | null;
  whatsappUrl: string | null;
  images: readonly MediaAsset[];
  sortOrder: number;
  status: PublicationStatus;
  contentKind: 'location';
}

export type BranchCardEntry = Branch | BranchLocation;

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
