import Link from 'next/link';
import { db } from '@/lib/db';
import { brands, products, accessoryCategories, productOverrides } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import BrandGrid from '@/components/brand/BrandGrid';
import ProductGrid from '@/components/product/ProductGrid';
import type { ProductDisplay } from '@/types';

export const revalidate = 3600; // Revalidate every hour

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

  // Fetch popular products (by orders)
  const popularProducts = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(
      and(
        eq(products.isActive, true),
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`
      )
    )
    .orderBy(desc(products.totalOrders))
    .limit(8);

  const popularDisplay: ProductDisplay[] = popularProducts.map((row) => ({
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

  // Fetch categories
  const categoryList = await db
    .select()
    .from(accessoryCategories)
    .where(eq(accessoryCategories.enabled, true))
    .orderBy(accessoryCategories.displayOrder);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-primary/10 via-white to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            אביזרים לרכבים חשמליים
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            מצאו את האביזרים הטובים ביותר לרכב החשמלי שלכם - שטיחים, מגני מסך, מטענים ועוד.
            מחירים משתלמים עם משלוח לישראל.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/all-vehicles"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              לכל המוצרים
              <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">מותגים</h2>
          <Link href="/all-vehicles" className="text-sm text-primary hover:underline">
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

      {/* Categories */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">קטגוריות אביזרים</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categoryList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/all-vehicles?category=${cat.slug}`}
                className="bg-white rounded-xl border border-border p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="font-medium text-sm">{cat.nameHe}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">מוצרים פופולריים</h2>
          <Link href="/all-vehicles?sort=orders" className="text-sm text-primary hover:underline">
            ראו עוד &larr;
          </Link>
        </div>
        <ProductGrid products={popularDisplay} />
      </section>
    </div>
  );
}
