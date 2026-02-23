import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = 30;
    const search = searchParams.get('search') ?? '';
    const showHidden = searchParams.get('hidden') === 'true';

    const conditions = [];
    if (search) {
      const pattern = `%${search}%`;
      conditions.push(sql`(${products.titleOriginal} ILIKE ${pattern} OR ${products.titleHe} ILIKE ${pattern})`);
    }
    if (!showHidden) {
      conditions.push(
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
      .where(whereClause);

    const rows = await db
      .select({
        id: products.id,
        aliexpressProductId: products.aliexpressProductId,
        slug: products.slug,
        titleOriginal: products.titleOriginal,
        titleHe: products.titleHe,
        price: products.price,
        totalOrders: products.totalOrders,
        isActive: products.isActive,
        brandName: brands.nameHe,
        categoryName: accessoryCategories.nameHe,
        isHidden: productOverrides.isHidden,
        titleHeOverride: productOverrides.titleHeOverride,
        couponOverride: productOverrides.couponOverride,
      })
      .from(products)
      .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
      .leftJoin(brands, eq(brands.id, products.brandId))
      .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
      .where(whereClause)
      .orderBy(desc(products.updatedAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      data: rows,
      pagination: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
