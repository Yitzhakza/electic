export interface Brand {
  id: number;
  slug: string;
  nameHe: string;
  nameEn: string;
  logoUrl: string | null;
  displayOrder: number;
  enabled: boolean;
}

export interface AccessoryCategory {
  id: number;
  slug: string;
  nameHe: string;
  nameEn: string;
  keywords: string[];
  displayOrder: number;
  enabled: boolean;
}

export interface SearchQuery {
  id: number;
  brandId: number;
  categoryId: number | null;
  queryText: string;
  enabled: boolean;
  lastSyncAt: Date | null;
}

export interface Product {
  id: number;
  aliexpressProductId: string;
  slug: string;
  titleOriginal: string;
  titleHe: string | null;
  descriptionHe: string | null;
  images: string[];
  price: number;
  currency: string;
  originalPrice: number | null;
  rating: number | null;
  totalOrders: number;
  shippingInfo: string | null;
  originalUrl: string;
  affiliateUrl: string | null;
  couponCode: string | null;
  brandId: number | null;
  categoryId: number | null;
  brandHints: string[];
  categoryHints: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductOverride {
  id: number;
  productId: number;
  titleHeOverride: string | null;
  descriptionHeOverride: string | null;
  couponOverride: string | null;
  tagsOverride: string[];
  isHidden: boolean;
  updatedAt: Date;
}

export interface SyncRun {
  id: number;
  startedAt: Date;
  completedAt: Date | null;
  status: 'running' | 'success' | 'failed';
  totalQueries: number;
  totalProducts: number;
  newProducts: number;
  updatedProducts: number;
  errors: string[];
  triggeredBy: 'cron' | 'manual';
}

export interface SyncLog {
  id: number;
  syncRunId: number;
  queryId: number | null;
  level: 'info' | 'warn' | 'error';
  message: string;
  data: Record<string, unknown> | null;
  createdAt: Date;
}

export interface ProductWithOverride extends Product {
  override?: ProductOverride | null;
}

export interface ProductDisplay {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  images: string[];
  price: number;
  currency: string;
  originalPrice: number | null;
  rating: number | null;
  totalOrders: number;
  shippingInfo: string | null;
  affiliateUrl: string | null;
  couponCode: string | null;
  brandSlug: string | null;
  brandName: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  createdAt?: string | Date;
}
