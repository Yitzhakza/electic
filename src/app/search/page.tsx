import { db } from '@/lib/db';
import { products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { and, sql, desc, eq, ilike } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGrid from '@/components/product/ProductGrid';
import SearchBar from '@/components/SearchBar';
import Pagination from '@/components/ui/Pagination';
import type { Metadata } from 'next';
import type { ProductDisplay } from '@/types';

const PAGE_SIZE = 24;

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.q ?? '';
  return {
    title: q ? `חיפוש: ${q}` : 'חיפוש',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim();
  const page = Math.max(1, parseInt(sp.page ?? '1', 10));

  let productList: ProductDisplay[] = [];
  let totalPages = 0;
  let count = 0;

  if (q) {
    // Search in title
    const searchPattern = `%${q}%`;

    const [countResult] = await db
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

    count = Number(countResult.count);
    totalPages = Math.ceil(count / PAGE_SIZE);

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
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    productList = rows.map((row) => ({
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
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'חיפוש' }]} />

      <h1 className="text-3xl font-bold mb-6">חיפוש</h1>

      <div className="max-w-xl mb-8">
        <SearchBar defaultValue={q} />
      </div>

      {q && (
        <p className="text-muted mb-6">
          {count > 0 ? `${count} תוצאות עבור "${q}"` : `לא נמצאו תוצאות עבור "${q}"`}
        </p>
      )}

      <ProductGrid products={productList} emptyMessage={q ? `לא נמצאו תוצאות עבור "${q}"` : 'הקלידו מילת חיפוש'} />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl="/search"
          searchParams={{ q }}
        />
      )}
    </div>
  );
}
