import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { brands, products, accessoryCategories, productOverrides } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import BrandGrid from '@/components/brand/BrandGrid';
import ProductGrid from '@/components/product/ProductGrid';
import TrustSignals from '@/components/TrustSignals';
import WhyBuyFromUs from '@/components/WhyBuyFromUs';
import Newsletter from '@/components/Newsletter';
import HeroCTAs from '@/components/HeroCTAs';
import LeadCaptureInline from '@/components/lead/LeadCaptureInline';
import type { ProductDisplay } from '@/types';

export const revalidate = 3600; // Revalidate every hour

const categoryIcons: Record<string, React.ReactNode> = {
  'floor-mats': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  'screen-protectors': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  ),
  'chargers': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  'trunk-organizers': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  'cleaning': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  'general-accessories': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1a2.003 2.003 0 01-.3-2.46l1.14-1.72a2 2 0 012.79-.49l.86.57a2 2 0 002.22 0l.86-.57a2 2 0 012.79.49l1.14 1.72a2.003 2.003 0 01-.3 2.46l-5.1 5.1a1.414 1.414 0 01-2 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.174 6.812a1 1 0 00-3.986-3.987L3.842 16.174a2 2 0 00-.5.83l-1.321 4.352a.5.5 0 00.623.622l4.353-1.32a2 2 0 00.83-.497z" />
    </svg>
  ),
  'hub-caps': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m0 0l4.5 7.795M12 12L5.106 6.215M12 12l6.894-5.785" />
    </svg>
  ),
  'seat-covers': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75l-5.571-3m11.142 0l4.179 2.25L12 17.25l-9.75-5.25 4.179-2.25m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
    </svg>
  ),
  'phone-holders': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  'interior-lighting': (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
};

const defaultIcon = (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
  </svg>
);

function safeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try { const parsed = JSON.parse(images); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

function mapToDisplay(row: any): ProductDisplay {
  return {
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
      <section className="relative overflow-hidden bg-primary py-14 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-l from-white/[0.03] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.15] tracking-tight">
                כל מה שצריך לרכב<br />החשמלי שלכם
              </h1>

              <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
                אביזרים נבחרים, מחירים שקופים, קופונים פעילים. נבחר ונבדק עבורכם — עם משלוח ישיר לישראל.
              </p>

              <HeroCTAs />

              <div className="flex items-center gap-4 mt-8 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {totalProducts}+ מוצרים
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {totalBrands} מותגים
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  משלוח לישראל
                </span>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                <Image
                  src="/images/hero-ev.jpg"
                  alt="טעינת רכב חשמלי"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <TrustSignals variant="horizontal" />
      </section>

      {/* Why Buy From Us */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">למה לקנות דרכנו?</h2>
          <div className="h-0.5 w-10 bg-accent rounded-full mt-3" />
        </div>
        <WhyBuyFromUs variant="full" />
      </section>

      {/* Brands */}
      <section className="bg-surface-alt py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">מותגים</h2>
              <div className="h-0.5 w-10 bg-accent rounded-full mt-3" />
            </div>
            <Link href="/all-vehicles" className="text-sm text-accent hover:underline font-medium">
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
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">קטגוריות אביזרים</h2>
            <div className="h-0.5 w-10 bg-accent rounded-full mt-3" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categoryListWithCounts.map((cat) => {
              const icon = categoryIcons[cat.slug] ?? defaultIcon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group bg-white rounded-xl border border-border/40 p-5 text-center hover:border-accent/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-accent/8 flex items-center justify-center text-accent group-hover:bg-accent/12 transition-colors">
                    {icon}
                  </div>
                  <span className="font-medium text-sm text-text group-hover:text-accent transition-colors block">{cat.nameHe}</span>
                  <span className="text-xs text-muted mt-1 block">{Number(cat.productCount)} מוצרים</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-surface-alt py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">מוצרים פופולריים</h2>
              <div className="h-0.5 w-10 bg-accent rounded-full mt-3" />
            </div>
            <Link href="/all-vehicles?sort=orders" className="text-sm text-accent hover:underline font-medium">
              ראו עוד &larr;
            </Link>
          </div>
          <ProductGrid products={popularDisplay} />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">חדשים באתר</h2>
            <div className="h-0.5 w-10 bg-accent rounded-full mt-3" />
          </div>
          <Link href="/all-vehicles?sort=newest" className="text-sm text-accent hover:underline font-medium">
            ראו עוד &larr;
          </Link>
        </div>
        <ProductGrid products={newDisplay} />
      </section>

      {/* Lead Capture */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <LeadCaptureInline source="homepage" />
      </section>

      {/* Popular Guides */}
      <section className="bg-surface-alt py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">מדריכים פופולריים</h2>
              <div className="h-0.5 w-10 bg-accent rounded-full mt-3" />
            </div>
            <Link href="/blog" className="text-sm text-accent hover:underline font-medium">
              כל המדריכים &larr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { slug: 'home-charging-guide-israel', title: 'מדריך טעינה ביתית לרכב חשמלי בישראל', category: 'טעינה בבית' },
              { slug: 'monthly-charging-cost-israel', title: 'עלות טעינה חודשית — מחשבון וטבלה', category: 'עלויות' },
              { slug: 'shared-building-charging', title: 'טעינה בבניין משותף: ועד בית ופתרונות', category: 'טעינה בבית' },
            ].map((guide) => (
              <Link
                key={guide.slug}
                href={`/blog/${guide.slug}`}
                className="bg-white rounded-xl border border-border/40 p-6 hover:border-accent/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
              >
                <span className="text-xs text-accent font-medium">{guide.category}</span>
                <h3 className="font-bold mt-1 leading-snug text-text">{guide.title}</h3>
                <span className="text-sm text-accent font-medium mt-3 block">קראו עוד &larr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <Newsletter />
      </section>
    </div>
  );
}
