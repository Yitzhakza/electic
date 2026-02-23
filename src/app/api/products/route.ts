import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { eq, and, sql, desc, asc } from 'drizzle-orm';
import type { ProductDisplay } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const brandSlug = searchParams.get('brand') ?? '';
  const categorySlug = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? '';

  const conditions = [eq(products.isActive, true)];

  if (brandSlug) {
    const brand = await db.select().from(brands).where(eq(brands.slug, brandSlug)).limit(1);
    if (brand[0]) conditions.push(eq(products.brandId, brand[0].id));
  }

  if (categorySlug) {
    const cat = await db.select().from(accessoryCategories).where(eq(accessoryCategories.slug, categorySlug)).limit(1);
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
  }

  let orderBy;
  switch (sort) {
    case 'price_asc': orderBy = asc(products.price); break;
    case 'price_desc': orderBy = desc(products.price); break;
    case 'orders': orderBy = desc(products.totalOrders); break;
    case 'rating': orderBy = desc(products.rating); break;
    default: orderBy = desc(products.totalOrders);
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .where(
      and(...conditions, sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`)
    );

  const rows = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(
      and(...conditions, sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`)
    )
    .orderBy(orderBy)
    .limit(limit)
    .offset((page - 1) * limit);

  const data: ProductDisplay[] = rows.map((row) => ({
    id: row.products.id,
    slug: row.products.slug,
    title: row.product_overrides?.titleHeOverride ?? row.products.titleHe ?? row.products.titleOriginal,
    description: row.product_overrides?.descriptionHeOverride ?? row.products.descriptionHe,
    images: row.products.images,
    price: row.products.price,
    currency: row.products.currency,
    originalPrice: row.products.originalPrice,
    rating: row.products.rating,
    totalOrders: row.products.totalOrders,
    shippingInfo: row.products.shippingInfo,
    affiliateUrl: row.products.affiliateUrl,
    couponCode: row.product_overrides?.couponOverride ?? row.products.couponCode,
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
