import { db } from '@/lib/db';
import { products, searchQueries, syncRuns, syncLogs, brands, accessoryCategories } from '@/lib/db/schema';
import { getAliExpressClient } from '@/lib/aliexpress/client';
import { normalizeProduct } from '@/lib/aliexpress/mapper';
import { classifyBrand, classifyCategory, extractBrandHints, extractCategoryHints } from './classifier';
import { generateProductSlug } from '@/lib/utils/slug';
import { eq, and } from 'drizzle-orm';

interface SyncOptions {
  triggeredBy: 'cron' | 'manual';
  queryIds?: number[];
}

/**
 * Main sync engine.
 * Runs all enabled search queries, fetches products from AliExpress,
 * classifies them, and upserts into the database.
 */
export async function runSync(options: SyncOptions): Promise<number> {
  const client = getAliExpressClient();

  const [syncRun] = await db
    .insert(syncRuns)
    .values({
      status: 'running',
      triggeredBy: options.triggeredBy,
    })
    .returning();

  let totalProducts = 0;
  let newProducts = 0;
  let updatedProducts = 0;
  const errors: string[] = [];

  try {
    const brandList = await db.select().from(brands);
    const categoryList = await db.select().from(accessoryCategories);
    const brandMap = new Map(brandList.map((b) => [b.slug, b.id]));
    const categoryMap = new Map(categoryList.map((c) => [c.slug, c.id]));

    let queries;
    if (options.queryIds?.length) {
      queries = await db
        .select()
        .from(searchQueries)
        .where(eq(searchQueries.enabled, true));
      queries = queries.filter((q) => options.queryIds!.includes(q.id));
    } else {
      queries = await db.select().from(searchQueries).where(eq(searchQueries.enabled, true));
    }

    await logSync(syncRun.id, null, 'info', `Starting sync with ${queries.length} queries`);

    for (const query of queries) {
      try {
        await logSync(syncRun.id, query.id, 'info', `Searching: "${query.queryText}"`);

        const rawProducts = await client.searchProducts({
          keywords: query.queryText,
          shipToCountry: 'IL',
          pageSize: 20,
        });

        for (const rawProduct of rawProducts) {
          try {
            const normalized = normalizeProduct(rawProduct as Record<string, unknown>);
            if (!normalized || !normalized.productId) continue;

            totalProducts++;

            const brandSlug = classifyBrand(normalized.title);
            const categorySlug = classifyCategory(normalized.title);
            const brandHints = extractBrandHints(normalized.title);
            const categoryHints = extractCategoryHints(normalized.title);

            const resolvedBrandId = brandMap.get(brandSlug ?? '') ?? query.brandId ?? null;
            const resolvedCategoryId =
              categoryMap.get(categorySlug ?? '') ?? query.categoryId ?? null;

            // Use promotion_link from search results if available, otherwise generate
            let affiliateUrl: string | null = normalized.promotionLink ?? null;
            if (!affiliateUrl) {
              try {
                const link = await client.generateAffiliateLink(normalized.productUrl);
                affiliateUrl = link?.promotionUrl ?? null;
              } catch {
                // Non-fatal
              }
            }

            let couponCode: string | null = normalized.promoCodeInfo?.code ?? null;
            if (!couponCode) {
              try {
                couponCode = await client.getProductCoupons(normalized.productId);
              } catch {
                // Non-fatal
              }
            }

            const slug = generateProductSlug(normalized.title, normalized.productId);
            const existingProduct = await db
              .select({ id: products.id })
              .from(products)
              .where(eq(products.aliexpressProductId, String(normalized.productId)))
              .limit(1);

            const imageList = [normalized.imageUrl, ...normalized.imageUrls].filter(
              (img): img is string => typeof img === 'string' && img.length > 0
            );

            const productData = {
              titleOriginal: String(normalized.title),
              images: imageList,
              price: Number(normalized.salePrice),
              currency: String(normalized.salePriceCurrency),
              originalPrice: normalized.originalPrice ? Number(normalized.originalPrice) : null,
              rating: normalized.evaluateScore ? parseFloat(normalized.evaluateScore) : null,
              totalOrders: Number(normalized.orders),
              shippingInfo: normalized.shippingInfo ? String(normalized.shippingInfo) : null,
              originalUrl: String(normalized.productUrl),
              affiliateUrl,
              couponCode,
              brandId: resolvedBrandId,
              categoryId: resolvedCategoryId,
              brandHints,
              categoryHints,
              isActive: true as const,
              updatedAt: new Date(),
            };

            if (existingProduct.length > 0) {
              await db
                .update(products)
                .set(productData)
                .where(eq(products.aliexpressProductId, String(normalized.productId)));
              updatedProducts++;
            } else {
              await db.insert(products).values({
                aliexpressProductId: String(normalized.productId),
                slug,
                ...productData,
              });
              newProducts++;
            }
          } catch (productError) {
            const msg = `Error processing product: ${(productError as Error).message}`;
            errors.push(msg);
            await logSync(syncRun.id, query.id, 'error', msg);
          }
        }

        await db.update(searchQueries).set({ lastSyncAt: new Date() }).where(eq(searchQueries.id, query.id));
      } catch (queryError) {
        const msg = `Error for query "${query.queryText}": ${(queryError as Error).message}`;
        errors.push(msg);
        await logSync(syncRun.id, query.id, 'error', msg);
      }
    }

    await db
      .update(syncRuns)
      .set({
        status: 'success',
        completedAt: new Date(),
        totalQueries: queries.length,
        totalProducts,
        newProducts,
        updatedProducts,
        errors,
      })
      .where(eq(syncRuns.id, syncRun.id));

    await logSync(
      syncRun.id,
      null,
      'info',
      `Sync completed: ${newProducts} new, ${updatedProducts} updated, ${errors.length} errors`
    );
  } catch (fatalError) {
    const msg = `Fatal sync error: ${(fatalError as Error).message}`;
    errors.push(msg);

    await db
      .update(syncRuns)
      .set({
        status: 'failed',
        completedAt: new Date(),
        totalQueries: 0,
        totalProducts,
        newProducts,
        updatedProducts,
        errors,
      })
      .where(eq(syncRuns.id, syncRun.id));

    await logSync(syncRun.id, null, 'error', msg);
  }

  return syncRun.id;
}

async function logSync(
  syncRunId: number,
  queryId: number | null,
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
) {
  try {
    await db.insert(syncLogs).values({
      syncRunId,
      queryId,
      level,
      message,
      data: data ?? null,
    });
  } catch (e) {
    console.error('[sync-log] Failed to write log:', e);
  }
}
