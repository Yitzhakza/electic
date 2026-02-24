import { z } from 'zod';

// ── Normalized product from AliExpress API ──────────────────────────
export const AliProductSchema = z.object({
  productId: z.string(),
  title: z.string(),
  productUrl: z.string().url(),
  imageUrl: z.string().url(),
  imageUrls: z.array(z.string().url()).optional().default([]),
  salePrice: z.number().positive(),
  salePriceCurrency: z.string().default('USD'),
  originalPrice: z.number().positive().optional(),
  discount: z.string().optional(),
  evaluateScore: z.string().optional(), // rating as string e.g. "4.8"
  orders: z.number().int().nonnegative().default(0),
  shippingInfo: z.string().optional(),
  shopUrl: z.string().optional(),
  promotionLink: z.string().optional(),
  commissionRate: z.string().optional(),
  promoCodeInfo: z
    .object({
      code: z.string().optional(),
      discount: z.string().optional(),
      minSpend: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    })
    .optional(),
});

export type AliProduct = z.infer<typeof AliProductSchema>;

// ── Affiliate link response ─────────────────────────────────────────
export const AffiliateLinkSchema = z.object({
  promotionUrl: z.string().url(),
});

export type AffiliateLink = z.infer<typeof AffiliateLinkSchema>;

// ── API search params ───────────────────────────────────────────────
export interface SearchParams {
  keywords: string;
  categoryId?: string;
  pageNo?: number;
  pageSize?: number;
  sort?: 'SALE_PRICE_ASC' | 'SALE_PRICE_DESC' | 'LAST_VOLUME_ASC' | 'LAST_VOLUME_DESC';
  minPrice?: number;
  maxPrice?: number;
  shipToCountry?: string;
}

// ── Featured promotion ──────────────────────────────────────────────
export interface FeaturedPromotion {
  promotionName: string;
  promotionDesc: string;
  productCount: number;
}

// ── API error ───────────────────────────────────────────────────────
export class AliExpressApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'AliExpressApiError';
  }
}
