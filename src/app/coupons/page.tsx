import { db } from '@/lib/db';
import { platformCoupons, products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { eq, and, isNotNull, desc, sql } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CouponCard from '@/components/CouponCard';
import ProductGrid from '@/components/product/ProductGrid';
import type { Metadata } from 'next';
import type { ProductDisplay } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'קופונים והנחות | אביזרים לרכב חשמלי',
  description: 'כל הקופונים וההנחות הפעילות לאביזרי רכב חשמלי באליאקספרס. הקופונים מתעדכנים אוטומטית.',
};

export default async function CouponsPage() {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'קופונים והנחות' }]} />

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">קופונים והנחות</h1>
        <p className="text-muted max-w-2xl">
          כל הקופונים וההנחות מתעדכנים אוטומטית מאליאקספרס. חזרו לדף הזה לעיתים קרובות כדי לא לפספס דילים חדשים.
        </p>
      </div>

      {/* Platform Coupons */}
      {activePlatformCoupons.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-2">מבצעים כלליים באליאקספרס</h2>
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
      <section>
        <h2 className="text-2xl font-bold mb-2">מוצרים עם קופון פעיל</h2>
        <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
        {couponProducts.length > 0 ? (
          <ProductGrid products={couponProducts} />
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-border/50">
            <p className="text-muted text-lg mb-2">אין כרגע מוצרים עם קופון פעיל</p>
            <p className="text-sm text-muted">הקופונים מתעדכנים כל כמה שעות — חזרו בקרוב!</p>
          </div>
        )}
      </section>
    </div>
  );
}
