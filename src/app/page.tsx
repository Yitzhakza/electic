import Link from 'next/link';
import { db } from '@/lib/db';
import { brands, products, accessoryCategories, productOverrides } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import BrandGrid from '@/components/brand/BrandGrid';
import ProductGrid from '@/components/product/ProductGrid';
import TrustSignals from '@/components/TrustSignals';
import WhyBuyFromUs from '@/components/WhyBuyFromUs';
import Newsletter from '@/components/Newsletter';
import type { ProductDisplay } from '@/types';

export const revalidate = 3600; // Revalidate every hour

const categoryMeta: Record<string, { emoji: string; gradient: string }> = {
  'floor-mats': { emoji: '🏠', gradient: 'from-blue-500/10 to-blue-600/5' },
  'screen-protectors': { emoji: '📱', gradient: 'from-purple-500/10 to-purple-600/5' },
  'chargers': { emoji: '⚡', gradient: 'from-yellow-500/10 to-amber-500/5' },
  'phone-holders': { emoji: '📲', gradient: 'from-cyan-500/10 to-cyan-600/5' },
  'trunk-organizers': { emoji: '🧳', gradient: 'from-orange-500/10 to-orange-600/5' },
  'interior-lighting': { emoji: '💡', gradient: 'from-amber-500/10 to-amber-600/5' },
  'car-covers': { emoji: '🚗', gradient: 'from-slate-500/10 to-slate-600/5' },
  'seat-covers': { emoji: '💺', gradient: 'from-rose-500/10 to-rose-600/5' },
  'steering-wheel': { emoji: '🎯', gradient: 'from-indigo-500/10 to-indigo-600/5' },
  'dashboard': { emoji: '🎛️', gradient: 'from-teal-500/10 to-teal-600/5' },
  'general-accessories': { emoji: '🔧', gradient: 'from-gray-500/10 to-gray-600/5' },
};

function mapToDisplay(row: any): ProductDisplay {
  return {
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
  };
}

export default async function HomePage() {
  // Fetch brands with product counts
  const brandList = await db
    .select({
      slug: brands.slug,
      nameHe: brands.nameHe,
      nameEn: brands.nameEn,
      productCount: sql<number>`count(${products.id})`.as('product_count'),
    })
    .from(brands)
    .leftJoin(products, and(eq(products.brandId, brands.id), eq(products.isActive, true)))
    .where(eq(brands.enabled, true))
    .groupBy(brands.id)
    .orderBy(brands.displayOrder);

  const activeFilter = and(
    eq(products.isActive, true),
    sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`
  );

  // Fetch popular products (by orders)
  const popularProducts = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(activeFilter)
    .orderBy(desc(products.totalOrders))
    .limit(8);

  const popularDisplay: ProductDisplay[] = popularProducts.map(mapToDisplay);

  // Fetch new products (recently added)
  const newProducts = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(activeFilter)
    .orderBy(desc(products.createdAt))
    .limit(8);

  const newDisplay: ProductDisplay[] = newProducts.map(mapToDisplay);

  // Fetch categories with product counts
  const categoryListWithCounts = await db
    .select({
      id: accessoryCategories.id,
      slug: accessoryCategories.slug,
      nameHe: accessoryCategories.nameHe,
      nameEn: accessoryCategories.nameEn,
      displayOrder: accessoryCategories.displayOrder,
      enabled: accessoryCategories.enabled,
      productCount: sql<number>`count(${products.id})`.as('product_count'),
    })
    .from(accessoryCategories)
    .leftJoin(products, and(eq(products.categoryId, accessoryCategories.id), eq(products.isActive, true)))
    .where(eq(accessoryCategories.enabled, true))
    .groupBy(accessoryCategories.id)
    .orderBy(accessoryCategories.displayOrder);

  const totalProducts = brandList.reduce((sum, b) => sum + Number(b.productCount), 0);
  const totalBrands = brandList.filter(b => Number(b.productCount) > 0).length;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'מוצרים פופולריים לרכבים חשמליים',
    numberOfItems: popularDisplay.length,
    itemListElement: popularDisplay.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/p/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-slate-900 via-blue-950 to-slate-900 py-20 md:py-28">
        {/* Decorative floating circles */}
        <div className="absolute top-10 start-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 end-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm px-4 py-2 rounded-full mb-6 border border-white/10">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            האתר המוביל בישראל לאביזרי רכב חשמלי
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            אביזרים לרכבים{' '}
            <span className="bg-gradient-to-l from-blue-400 to-cyan-300 gradient-text">
              חשמליים
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            מצאו את האביזרים הטובים ביותר לרכב החשמלי שלכם — שטיחים, מגני מסך, מטענים ועוד.
            מחירים משתלמים עם משלוח ישיר לישראל.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/all-vehicles"
              className="inline-flex items-center gap-2 bg-gradient-to-l from-blue-600 to-blue-500 text-white px-8 py-3.5 rounded-xl font-medium hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              לכל המוצרים
              <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              חיפוש אביזרים
            </Link>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{totalBrands}</span>
              מותגים
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{totalProducts}+</span>
              מוצרים
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              משלוח לישראל
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <TrustSignals variant="horizontal" />
      </section>

      {/* Why Buy From Us */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">למה לקנות דרכנו?</h2>
          <div className="h-1 w-12 bg-gradient-to-l from-green-500 to-emerald-400 rounded-full mt-2" />
        </div>
        <WhyBuyFromUs variant="full" />
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">מותגים</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mt-2" />
          </div>
          <Link href="/all-vehicles" className="text-sm text-primary hover:underline font-medium">
            כל המותגים &larr;
          </Link>
        </div>
        <BrandGrid
          brands={brandList.map((b) => ({
            slug: b.slug,
            nameHe: b.nameHe,
            nameEn: b.nameEn,
            productCount: Number(b.productCount),
          }))}
        />
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* Categories */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">קטגוריות אביזרים</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-accent to-teal-400 rounded-full mt-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoryListWithCounts.map((cat) => {
              const meta = categoryMeta[cat.slug] ?? { emoji: '📦', gradient: 'from-gray-500/10 to-gray-600/5' };
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`group bg-gradient-to-br ${meta.gradient} rounded-2xl border border-border/50 p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  <span className="text-3xl block mb-2">{meta.emoji}</span>
                  <span className="font-medium text-sm group-hover:text-primary transition-colors block">{cat.nameHe}</span>
                  <span className="text-xs text-muted mt-1 block">{Number(cat.productCount)} מוצרים</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">מוצרים פופולריים</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mt-2" />
          </div>
          <Link href="/all-vehicles?sort=orders" className="text-sm text-primary hover:underline font-medium">
            ראו עוד &larr;
          </Link>
        </div>
        <ProductGrid products={popularDisplay} />
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">חדשים באתר</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-indigo-500 to-blue-400 rounded-full mt-2" />
          </div>
          <Link href="/all-vehicles?sort=newest" className="text-sm text-primary hover:underline font-medium">
            ראו עוד &larr;
          </Link>
        </div>
        <ProductGrid products={newDisplay} />
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <Newsletter />
      </section>
    </div>
  );
}
