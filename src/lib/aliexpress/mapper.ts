import { AliProductSchema, type AliProduct } from './types';

/**
 * Normalize raw API response into our AliProduct type.
 * Handles the AliExpress Affiliate API response format.
 */
export function normalizeProduct(raw: Record<string, unknown>): AliProduct | null {
  try {
    const mapped = {
      productId: String(
        raw.product_id ?? raw.productId ?? raw.item_id ?? ''
      ),
      title: String(
        raw.product_title ?? raw.title ?? raw.product_name ?? ''
      ),
      productUrl: String(
        raw.product_detail_url ?? raw.product_url ?? raw.productUrl ?? ''
      ),
      imageUrl: String(
        raw.product_main_image_url ?? raw.imageUrl ?? raw.image_url ?? ''
      ),
      imageUrls: normalizeImageUrls(raw),
      salePrice: normalizePrice(raw.target_sale_price ?? raw.app_sale_price ?? raw.sale_price ?? raw.salePrice ?? 0),
      salePriceCurrency: String(
        raw.target_sale_price_currency ?? raw.sale_price_currency ?? raw.currency ?? 'USD'
      ),
      originalPrice: normalizePrice(
        raw.target_original_price ?? raw.original_price ?? raw.originalPrice ?? undefined
      ),
      discount: raw.discount ? String(raw.discount) : undefined,
      evaluateScore: raw.evaluate_rate ?? raw.evaluateScore ?? raw.evaluate_score
        ? String(raw.evaluate_rate ?? raw.evaluateScore ?? raw.evaluate_score)
        : undefined,
      orders: normalizeOrders(raw.lastest_volume ?? raw.orders ?? raw.total_orders ?? 0),
      shippingInfo: raw.ship_to_days
        ? `${raw.ship_to_days} days`
        : undefined,
      shopUrl: raw.shop_url ? String(raw.shop_url) : undefined,
      promotionLink: raw.promotion_link ? String(raw.promotion_link) : undefined,
      commissionRate: raw.commission_rate ? String(raw.commission_rate) : undefined,
      promoCodeInfo: normalizePromoCode(raw),
    };

    const result = AliProductSchema.safeParse(mapped);
    if (result.success) {
      return result.data;
    }

    console.warn('[mapper] Failed to parse product:', result.error.issues);
    return null;
  } catch (error) {
    console.error('[mapper] Error normalizing product:', error);
    return null;
  }
}

function normalizeImageUrls(raw: Record<string, unknown>): string[] {
  const urls = raw.product_small_image_urls ?? raw.imageUrls ?? raw.image_urls;
  if (Array.isArray(urls)) {
    return urls.map(String).filter((u) => u.startsWith('http'));
  }
  // AliExpress wraps arrays: { "string": ["url1", "url2"] }
  if (typeof urls === 'object' && urls !== null && 'string' in (urls as Record<string, unknown>)) {
    const inner = (urls as Record<string, unknown>).string;
    if (Array.isArray(inner)) return inner.map(String).filter((u) => u.startsWith('http'));
  }
  return [];
}

function normalizePrice(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function normalizeOrders(value: unknown): number {
  if (typeof value === 'number') return Math.floor(value);
  if (typeof value === 'string') {
    const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function normalizePromoCode(raw: Record<string, unknown>): { code?: string; discount?: string; minSpend?: string; startDate?: string; endDate?: string } | undefined {
  const info = raw.promo_code_info as Record<string, string> | undefined;
  if (!info) return undefined;
  const code = info.promo_code ?? info.code;
  if (!code) return undefined;
  return {
    code,
    discount: info.code_value ?? info.discount,
    minSpend: info.code_mini_spend,
    startDate: info.code_availabletime_start,
    endDate: info.code_availabletime_end,
  };
}
