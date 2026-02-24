import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import type { ProductDisplay } from '@/types';

function safeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try { const parsed = JSON.parse(images); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = (searchParams.get('q') ?? '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));

  if (!q) {
    return NextResponse.json({ data: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } });
  }

  const searchPattern = `%${q}%`;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .where(
      and(
        eq(products.isActive, true),
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`,
        sql`(${products.titleOriginal} ILIKE ${searchPattern} OR ${products.titleHe} ILIKE ${searchPattern})`
      )
    );

  const rows = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(
      and(
        eq(products.isActive, true),
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`,
        sql`(${products.titleOriginal} ILIKE ${searchPattern} OR ${products.titleHe} ILIKE ${searchPattern})`
      )
    )
    .orderBy(desc(products.totalOrders))
    .limit(limit)
    .offset((page - 1) * limit);

  const data: ProductDisplay[] = rows.map((row) => ({
    id: row.products.id,
    slug: row.products.slug,
    title: row.product_overrides?.titleHeOverride ?? row.products.titleHe ?? row.products.titleOriginal,
    description: row.product_overrides?.descriptionHeOverride ?? row.products.descriptionHe,
    images: safeImages(row.products.images),
    price: row.products.price,
    currency: row.products.currency,
    originalPrice: row.products.originalPrice,
    rating: row.products.rating,
    totalOrders: row.products.totalOrders,
    shippingInfo: row.products.shippingInfo,
    affiliateUrl: row.products.affiliateUrl,
    couponCode: row.product_overrides?.couponOverride ?? row.products.couponCode,
    couponDiscount: row.products.couponDiscount,
    couponMinSpend: row.products.couponMinSpend,
    couponExpiry: row.products.couponExpiry,
    brandSlug: row.brands?.slug ?? null,
    brandName: row.brands?.nameHe ?? null,
    categorySlug: row.accessory_categories?.slug ?? null,
    categoryName: row.accessory_categories?.nameHe ?? null,
  }));

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / limit),
    },
  });
}
