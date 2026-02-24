import { db } from '@/lib/db';
import { products, platformCoupons } from '@/lib/db/schema';
import { getAliExpressClient } from '@/lib/aliexpress/client';
import { normalizeProduct } from '@/lib/aliexpress/mapper';
import { eq, isNotNull } from 'drizzle-orm';

const PROMO_NAME_HE: Record<string, string> = {
  'Super Deals': 'סופר דילים',
  'Hot Products': 'מוצרים חמים',
  'Hot Product': 'מוצרים חמים',
  'New User Deals': 'דילים למשתמשים חדשים',
  'Brand Sale': 'מבצעי מותגים',
  'Best Seller': 'רבי מכר',
  'Weekly Deals': 'דילים שבועיים',
  'weeklydeals': 'דילים שבועיים',
  'New Arrival': 'חדשים',
};

/**
 * Sync coupons from AliExpress.
 * 1. Fetches featured promotions → upserts into platform_coupons
 * 2. Refreshes coupon metadata for products that have coupons
 */
export async function syncCoupons(): Promise<{ promotions: number; productsUpdated: number }> {
  const client = getAliExpressClient();
  let promotionsCount = 0;
  let productsUpdated = 0;

  // Step 1: Fetch platform promotions
  try {
    const promos = await client.getFeaturedPromotions();

    // Deactivate all existing platform coupons before refreshing
    await db.update(platformCoupons).set({ isActive: false });

    for (const promo of promos) {
      // Upsert: try to find existing by promo_name, update or insert
      const existing = await db
        .select({ id: platformCoupons.id })
        .from(platformCoupons)
        .where(eq(platformCoupons.promoName, promo.promotionName))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(platformCoupons)
          .set({
            promoNameHe: PROMO_NAME_HE[promo.promotionName] ?? promo.promotionName,
            isActive: true,
            lastSyncAt: new Date(),
          })
          .where(eq(platformCoupons.id, existing[0].id));
      } else {
        await db.insert(platformCoupons).values({
          promoName: promo.promotionName,
          promoNameHe: PROMO_NAME_HE[promo.promotionName] ?? promo.promotionName,
          isActive: true,
          lastSyncAt: new Date(),
        });
      }
      promotionsCount++;
    }
    console.log(`[coupon-sync] Synced ${promotionsCount} promotions`);
  } catch (err) {
    console.error('[coupon-sync] Failed to fetch promotions:', err);
  }

  // Step 2: Refresh coupon metadata for products that already have coupons
  try {
    const productsWithCoupons = await db
      .select({
        id: products.id,
        aliexpressProductId: products.aliexpressProductId,
      })
      .from(products)
      .where(isNotNull(products.couponCode));

    console.log(`[coupon-sync] Refreshing coupons for ${productsWithCoupons.length} products`);

    for (const product of productsWithCoupons) {
      try {
        const raw = await client.getProductDetail(product.aliexpressProductId);
        if (!raw) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const normalized = normalizeProduct(raw as any);
        if (normalized?.promoCodeInfo?.code) {
          await db
            .update(products)
            .set({
              couponCode: normalized.promoCodeInfo.code,
              couponDiscount: normalized.promoCodeInfo.discount ?? null,
              couponMinSpend: normalized.promoCodeInfo.minSpend ?? null,
              couponExpiry: normalized.promoCodeInfo.endDate
                ? new Date(normalized.promoCodeInfo.endDate)
                : null,
              updatedAt: new Date(),
            })
            .where(eq(products.id, product.id));
          productsUpdated++;
        } else {
          // Coupon may have expired — clear it
          await db
            .update(products)
            .set({
              couponCode: null,
              couponDiscount: null,
              couponMinSpend: null,
              couponExpiry: null,
              updatedAt: new Date(),
            })
            .where(eq(products.id, product.id));
        }
      } catch {
        // Non-fatal, continue to next product
      }
    }
    console.log(`[coupon-sync] Updated ${productsUpdated} product coupons`);
  } catch (err) {
    console.error('[coupon-sync] Failed to refresh product coupons:', err);
  }

  return { promotions: promotionsCount, productsUpdated };
}
