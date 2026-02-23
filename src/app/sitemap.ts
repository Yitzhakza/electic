import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, brands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-accessories.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/all-vehicles`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${SITE_URL}/disclosure`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Brand pages
  const brandList = await db.select({ slug: brands.slug }).from(brands).where(eq(brands.enabled, true));
  const brandPages: MetadataRoute.Sitemap = brandList.map((b) => ({
    url: `${SITE_URL}/brand/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Product pages
  const productList = await db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products)
    .where(eq(products.isActive, true));

  const productPages: MetadataRoute.Sitemap = productList.map((p) => ({
    url: `${SITE_URL}/p/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...brandPages, ...productPages];
}
