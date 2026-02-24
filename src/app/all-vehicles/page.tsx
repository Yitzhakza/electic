import { db } from '@/lib/db';
import { brands, products, accessoryCategories, productOverrides } from '@/lib/db/schema';
import { eq, and, sql, desc, asc } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/filters/FilterSidebar';
import Pagination from '@/components/ui/Pagination';
import type { Metadata } from 'next';
import type { ProductDisplay } from '@/types';

export const metadata: Metadata = {
  title: 'כל הרכבים - אביזרים לרכבים חשמליים',
  description: 'כל האביזרים לרכבים חשמליים בישראל. מיון לפי מותג, קטגוריה, מחיר ודירוג.',
};

const PAGE_SIZE = 24;

interface PageProps {
  searchParams: Promise<{ page?: string; category?: string; brand?: string; sort?: string }>;
}

export default async function AllVehiclesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const categorySlug = sp.category ?? '';
  const brandSlug = sp.brand ?? '';
  const sort = sp.sort ?? '';

  // Build conditions
  const conditions = [eq(products.isActive, true)];

  if (categorySlug) {
    const cat = await db.select().from(accessoryCategories).where(eq(accessoryCategories.slug, categorySlug)).limit(1);
    if (cat[0]) conditions.push(eq(products.categoryId, cat[0].id));
  }

  if (brandSlug) {
    const brand = await db.select().from(brands).where(eq(brands.slug, brandSlug)).limit(1);
    if (brand[0]) conditions.push(eq(products.brandId, brand[0].id));
  }

  // Count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .where(
      and(...conditions, sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`)
    );

  const totalPages = Math.ceil(Number(count) / PAGE_SIZE);

  // Sort
  let orderBy;
  switch (sort) {
    case 'price_asc': orderBy = asc(products.price); break;
    case 'price_desc': orderBy = desc(products.price); break;
    case 'orders': orderBy = desc(products.totalOrders); break;
    case 'rating': orderBy = desc(products.rating); break;
    case 'newest': orderBy = desc(products.createdAt); break;
    default: orderBy = desc(products.totalOrders);
  }

  // Fetch
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
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const productList: ProductDisplay[] = rows.map((row) => ({
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
    couponDiscount: row.products.couponDiscount,
    couponMinSpend: row.products.couponMinSpend,
    couponExpiry: row.products.couponExpiry,
    brandSlug: row.brands?.slug ?? null,
    brandName: row.brands?.nameHe ?? null,
    categorySlug: row.accessory_categories?.slug ?? null,
    categoryName: row.accessory_categories?.nameHe ?? null,
    createdAt: row.products.createdAt,
  }));

  // Brands for filter
  const brandList = await db
    .select({ slug: brands.slug, nameHe: brands.nameHe })
    .from(brands)
    .where(eq(brands.enabled, true))
    .orderBy(brands.displayOrder);

  const filterParams: Record<string, string> = {};
  if (categorySlug) filterParams.category = categorySlug;
  if (brandSlug) filterParams.brand = brandSlug;
  if (sort) filterParams.sort = sort;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'כל הרכבים' }]} />

      <h1 className="text-3xl font-bold mb-2">כל האביזרים לרכבים חשמליים</h1>
      <p className="text-muted mb-8">{Number(count)} מוצרים</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-56 flex-shrink-0">
          <FilterSidebar basePath="/all-vehicles" brands={brandList} />
        </div>

        <div className="flex-1">
          <ProductGrid products={productList} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/all-vehicles"
            searchParams={filterParams}
          />
        </div>
      </div>
    </div>
  );
}
