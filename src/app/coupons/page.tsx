import Link from 'next/link';
import { db } from '@/lib/db';
import { platformCoupons, products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CouponCard from '@/components/CouponCard';
import GeneralCouponsTable from '@/components/GeneralCouponsTable';
import ProductGrid from '@/components/product/ProductGrid';
import { getCurrentGeneralCoupons } from '@/lib/aliexpress/general-coupons';
import type { Metadata } from 'next';
import type { ProductDisplay } from '@/types';

function safeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images;
  if (typeof images === 'string') {
    try { const parsed = JSON.parse(images); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }
  return [];
}

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'קופונים והנחות לאליאקספרס | אביזרים לרכב חשמלי',
  description: 'כל הקופונים וההנחות הפעילות לאליאקספרס. קופונים כלליים לפי סכום הזמנה, מבצעים מיוחדים וקופונים למוצרים ספציפיים. מתעדכן אוטומטית.',
};

export default async function CouponsPage() {
  const generalCoupons = getCurrentGeneralCoupons();

  // Fetch active platform coupons
  const activePlatformCoupons = await db
    .select()
    .from(platformCoupons)
    .where(eq(platformCoupons.isActive, true))
    .orderBy(platformCoupons.createdAt);

  // Fetch products with coupons
  const productsWithCoupons = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(
      and(
        eq(products.isActive, true),
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`,
        sql`(COALESCE(${productOverrides.couponOverride}, ${products.couponCode}) IS NOT NULL)`
      )
    )
    .orderBy(desc(products.totalOrders))
    .limit(24);

  const couponProducts: ProductDisplay[] = productsWithCoupons.map((row) => ({
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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-orange-600 via-red-600 to-pink-700 py-16 md:py-20">
        <div className="absolute top-0 start-0 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 end-0 w-96 h-96 bg-orange-400/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-2 rounded-full mb-6 border border-white/20">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            הקופונים מתעדכנים אוטומטית כל חודש
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            קופונים והנחות{' '}
            <span className="bg-gradient-to-l from-yellow-300 to-orange-200 gradient-text">
              לאליאקספרס
            </span>
          </h1>

          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            העתיקו את הקופון המתאים והדביקו אותו בעמוד התשלום באליאקספרס.
            חוסכים בכל הזמנה!
          </p>

          <div className="flex justify-center gap-6 text-white/70 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              עדכון חודשי
            </div>
            <div className="w-px h-6 bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              קופונים רשמיים
            </div>
            <div className="w-px h-6 bg-white/30 hidden sm:block" />
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              לקונים מישראל
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'קופונים והנחות' }]} />

        {/* General Monthly Coupons */}
        <section className="mb-14 mt-4">
          <GeneralCouponsTable
            coupons={generalCoupons.coupons}
            monthNameHe={generalCoupons.monthNameHe}
            validUntil={generalCoupons.validUntil}
          />
        </section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent mb-14" />

        {/* Platform Coupons from API */}
        {activePlatformCoupons.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-2">מבצעים מיוחדים באליאקספרס</h2>
            <div className="h-1 w-12 bg-gradient-to-l from-green-500 to-emerald-400 rounded-full mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePlatformCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  promoNameHe={coupon.promoNameHe}
                  couponCode={coupon.couponCode}
                  discountValue={coupon.discountValue}
                  minSpend={coupon.minSpend}
                  endDate={coupon.endDate}
                  promotionUrl={coupon.promotionUrl}
                />
              ))}
            </div>
          </section>
        )}

        {/* Products with Coupons */}
        {couponProducts.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">מוצרים עם קופון פעיל</h2>
              <Link href="/all-vehicles" className="text-sm text-primary hover:underline font-medium">
                כל המוצרים &larr;
              </Link>
            </div>
            <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
            <ProductGrid products={couponProducts} />
          </section>
        )}

        {/* Savings Tips */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2">טיפים לחיסכון באליאקספרס</h2>
          <div className="h-1 w-12 bg-gradient-to-l from-purple-500 to-violet-400 rounded-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200/50">
              <div className="text-2xl mb-2">💵</div>
              <h3 className="font-bold text-sm mb-1">שלמו בדולרים</h3>
              <p className="text-sm text-muted">
                בחרו תשלום בדולרים כדי לחסוך עמלות המרה של חברות האשראי. ההפרש יכול להגיע ל-3%.
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5 border border-amber-200/50">
              <div className="text-2xl mb-2">🪙</div>
              <h3 className="font-bold text-sm mb-1">אספו מטבעות</h3>
              <p className="text-sm text-muted">
                באפליקציה של אליאקספרס אפשר לאסוף מטבעות כל יום ולהשתמש בהם כהנחה נוספת על ההזמנה.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 border border-green-200/50">
              <div className="text-2xl mb-2">🔔</div>
              <h3 className="font-bold text-sm mb-1">עקבו אחרי חנויות</h3>
              <p className="text-sm text-muted">
                לחצו &quot;עקוב&quot; על חנויות מועדפות — חלקן מציעות קופונים בלעדיים לעוקבים.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
