import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { brands, products, accessoryCategories, productOverrides } from '@/lib/db/schema';
import { eq, and, sql, desc, asc } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGrid from '@/components/product/ProductGrid';
import FilterSidebar from '@/components/filters/FilterSidebar';
import Pagination from '@/components/ui/Pagination';
import type { Metadata } from 'next';
import type { ProductDisplay } from '@/types';

function safeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try { const parsed = JSON.parse(images); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

const PAGE_SIZE = 20;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; category?: string; sort?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
  if (!brand[0]) return {};

  return {
    title: `אביזרים ל${brand[0].nameHe} - רכב חשמלי`,
    description: `כל האביזרים לרכב חשמלי ${brand[0].nameHe} (${brand[0].nameEn}). שטיחים, מגני מסך, מטענים ועוד - במחירים משתלמים עם משלוח לישראל.`,
  };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const brand = await db.select().from(brands).where(eq(brands.slug, slug)).limit(1);
  if (!brand[0]) notFound();

  const page = Math.max(1, parseInt(sp.page ?? '1', 10));
  const categorySlug = sp.category ?? '';
  const sort = sp.sort ?? '';

  // Build conditions
  const conditions = [eq(products.brandId, brand[0].id), eq(products.isActive, true)];

  if (categorySlug) {
    const cat = await db.select().from(accessoryCategories).where(eq(accessoryCategories.slug, categorySlug)).limit(1);
    if (cat[0]) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  // Count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .where(
      and(
        ...conditions,
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`
      )
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

  // Fetch products
  const rows = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(
      and(
        ...conditions,
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`
      )
    )
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const productList: ProductDisplay[] = rows.map((row) => ({
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
    createdAt: row.products.createdAt,
  }));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: `אביזרים ל${brand[0].nameHe}`, item: `${siteUrl}/brand/${slug}` },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `אביזרים ל${brand[0].nameHe} - רכב חשמלי`,
    description: `כל האביזרים לרכב חשמלי ${brand[0].nameHe} (${brand[0].nameEn}). שטיחים, מגני מסך, מטענים ועוד - במחירים משתלמים עם משלוח לישראל.`,
    url: `${siteUrl}/brand/${slug}`,
    inLanguage: 'he',
    numberOfItems: Number(count),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: brand[0].nameHe },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">אביזרים ל{brand[0].nameHe}</h1>
        <p className="text-muted">
          {Number(count)} מוצרים נמצאו לרכבי {brand[0].nameHe}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-56 flex-shrink-0">
          <FilterSidebar basePath={`/brand/${slug}`} />
        </div>

        <div className="flex-1">
          <ProductGrid products={productList} emptyMessage={`עדיין אין מוצרים ל${brand[0].nameHe}`} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/brand/${slug}`}
            searchParams={{ ...(categorySlug && { category: categorySlug }), ...(sort && { sort }) }}
          />
        </div>
      </div>
    </div>
  );
}
