import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { products, productOverrides, brands, accessoryCategories, platformCoupons } from '@/lib/db/schema';
import { eq, and, ne, desc, sql } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGallery from '@/components/product/ProductGallery';
import ProductSpecs from '@/components/product/ProductSpecs';
import ProductGrid from '@/components/product/ProductGrid';
import Badge from '@/components/ui/Badge';
import ShareButtons from '@/components/product/ShareButtons';
import WhyBuyFromUs from '@/components/WhyBuyFromUs';
import ProductCoupons from '@/components/ProductCoupons';
import { getRelevantCoupons, getCurrentGeneralCoupons } from '@/lib/aliexpress/general-coupons';
import { formatPriceDual, calcDiscount, usdToIls } from '@/lib/utils/price';
import type { Metadata } from 'next';
import type { ProductDisplay } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rows = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (!rows[0]) return {};

  const product = rows[0].products;
  const override = rows[0].product_overrides;
  const title = override?.titleHeOverride ?? product.titleHe ?? product.titleOriginal;

  return {
    title,
    description: override?.descriptionHeOverride ?? product.descriptionHe ?? `${title} - אביזר לרכב חשמלי. משלוח לישראל.`,
    openGraph: {
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const rows = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
    .where(eq(products.slug, slug))
    .limit(1);

  if (!rows[0]) notFound();

  const product = rows[0].products;
  const override = rows[0].product_overrides;
  const brand = rows[0].brands;
  const category = rows[0].accessory_categories;

  const title = override?.titleHeOverride ?? product.titleHe ?? product.titleOriginal;
  const description = override?.descriptionHeOverride ?? product.descriptionHe;
  const couponCode = override?.couponOverride ?? product.couponCode;
  const isHidden = override?.isHidden ?? false;

  if (isHidden) notFound();

  const { primary, secondary } = formatPriceDual(product.price, product.currency);
  const discount = product.originalPrice ? calcDiscount(product.originalPrice, product.price) : 0;

  // Specs
  const specs = [
    product.rating ? { label: 'דירוג', value: `${product.rating.toFixed(1)} / 5` } : null,
    product.totalOrders ? { label: 'הזמנות', value: product.totalOrders.toLocaleString() } : null,
    { label: 'מחיר', value: `${primary} (${secondary || `~₪${usdToIls(product.price).toFixed(0)}`})` },
    product.shippingInfo ? { label: 'משלוח', value: product.shippingInfo } : null,
    brand ? { label: 'מותג רכב', value: brand.nameHe } : null,
    category ? { label: 'קטגוריה', value: category.nameHe } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  // Related products (same brand or category)
  const relatedConditions = [];
  if (product.brandId) relatedConditions.push(eq(products.brandId, product.brandId));
  if (product.categoryId) relatedConditions.push(eq(products.categoryId, product.categoryId));

  let relatedProducts: ProductDisplay[] = [];
  if (relatedConditions.length > 0) {
    const relatedRows = await db
      .select()
      .from(products)
      .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
      .leftJoin(brands, eq(brands.id, products.brandId))
      .leftJoin(accessoryCategories, eq(accessoryCategories.id, products.categoryId))
      .where(
        and(
          eq(products.isActive, true),
          ne(products.id, product.id),
          sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`,
          relatedConditions.length === 2
            ? sql`(${products.brandId} = ${product.brandId} OR ${products.categoryId} = ${product.categoryId})`
            : relatedConditions[0]
        )
      )
      .orderBy(desc(products.totalOrders))
      .limit(4);

    relatedProducts = relatedRows.map((row) => ({
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
    }));
  }

  // Fetch active platform coupons
  const activePlatformCoupons = await db
    .select()
    .from(platformCoupons)
    .where(eq(platformCoupons.isActive, true))
    .orderBy(platformCoupons.endDate);

  // General coupons matched by product price
  const relevantCoupons = getRelevantCoupons(product.price);
  const generalCouponsData = getCurrentGeneralCoupons();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-accessories.co.il';

  // JSON-LD Product schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: product.images.filter((img: string) => img.startsWith('http')),
    description: description ?? title,
    ...(brand && { brand: { '@type': 'Brand', name: brand.nameEn } }),
    ...(category && { category: category.nameHe }),
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        bestRating: '5',
        ...(product.totalOrders > 0 && { reviewCount: product.totalOrders }),
      },
    }),
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      url: product.affiliateUrl ?? product.originalUrl,
      seller: { '@type': 'Organization', name: 'AliExpress' },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IL' },
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ראשי', item: siteUrl },
      ...(brand ? [{ '@type': 'ListItem', position: 2, name: brand.nameHe, item: `${siteUrl}/brand/${brand.slug}` }] : []),
      { '@type': 'ListItem', position: brand ? 3 : 2, name: title },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          ...(brand ? [{ label: brand.nameHe, href: `/brand/${brand.slug}` }] : []),
          { label: title },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Gallery */}
        <ProductGallery images={product.images} title={title} />

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {brand && <Badge variant="brand">{brand.nameHe}</Badge>}
            {category && <Badge variant="category">{category.nameHe}</Badge>}
            {discount > 0 && <Badge variant="sale">-{discount}% הנחה</Badge>}
            {product.totalOrders >= 100 && <Badge variant="bestseller">רב מכר</Badge>}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          <ShareButtons url={`/p/${product.slug}`} title={title} />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{primary}</span>
            {secondary && <span className="text-lg text-muted">{secondary}</span>}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-muted line-through">${product.originalPrice.toFixed(2)}</span>
          )}

          {/* Rating & Orders */}
          <div className="flex items-center gap-4 text-sm text-muted">
            {product.rating && (
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.totalOrders > 0 && <span>{product.totalOrders.toLocaleString()} הזמנות</span>}
            {product.shippingInfo && <span>משלוח: {product.shippingInfo}</span>}
          </div>

          {/* Description */}
          {description && (
            <div className="bg-gray-50 rounded-xl p-4 border border-border/50">
              <div className="text-sm leading-relaxed text-gray-700 space-y-3">
                {description.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {/* Coupons */}
          <ProductCoupons
            priceUsd={product.price}
            couponCode={couponCode}
            couponDiscount={product.couponDiscount}
            couponMinSpend={product.couponMinSpend}
            couponExpiry={product.couponExpiry}
            bestMatch={relevantCoupons.bestMatch}
            nextTier={relevantCoupons.nextTier}
            allApplicable={relevantCoupons.allApplicable}
            platformCoupons={activePlatformCoupons}
            monthNameHe={generalCouponsData.monthNameHe}
            validUntil={generalCouponsData.validUntil}
          />

          {/* CTA */}
          <a
            href={product.affiliateUrl ?? product.originalUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-4 inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-opacity"
          >
            לרכישה באליאקספרס
            <svg className="h-5 w-5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Why Buy From Us */}
          <WhyBuyFromUs variant="compact" />
        </div>
      </div>

      {/* Specs */}
      <div className="mb-12">
        <ProductSpecs specs={specs} />
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">מוצרים דומים</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
