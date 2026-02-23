import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { brands, accessoryCategories, searchQueries, products, productOverrides } from './schema';
import { BRANDS, ACCESSORY_CATEGORIES, generateSearchQueries } from '../constants';
import { generateProductSlug } from '../utils/slug';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

  console.log('Seeding database...');

  // 1. Seed brands
  console.log('Seeding brands...');
  const brandResults = [];
  for (const brand of BRANDS) {
    const [result] = await db
      .insert(brands)
      .values({
        slug: brand.slug,
        nameHe: brand.nameHe,
        nameEn: brand.nameEn,
        displayOrder: brand.order,
        enabled: true,
      })
      .onConflictDoNothing()
      .returning();
    if (result) brandResults.push(result);
  }
  console.log(`  Seeded ${brandResults.length} brands`);

  // 2. Seed accessory categories
  console.log('Seeding categories...');
  const catResults = [];
  for (const cat of ACCESSORY_CATEGORIES) {
    const [result] = await db
      .insert(accessoryCategories)
      .values({
        slug: cat.slug,
        nameHe: cat.nameHe,
        nameEn: cat.nameEn,
        keywords: cat.keywords as unknown as string[],
        displayOrder: cat.order,
        enabled: true,
      })
      .onConflictDoNothing()
      .returning();
    if (result) catResults.push(result);
  }
  console.log(`  Seeded ${catResults.length} categories`);

  // 3. Get brand and category ID maps
  const allBrands = await db.select().from(brands);
  const allCategories = await db.select().from(accessoryCategories);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b.id]));
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  // 4. Seed search queries (a subset - not all combinations)
  console.log('Seeding search queries...');
  const allQueries = generateSearchQueries();
  // Limit to general brand queries + first model + first category per brand
  const selectedQueries = allQueries.filter((q, i) => {
    // Keep every general brand query
    if (!q.categorySlug) return true;
    // Keep first 3 category-specific queries per brand
    const brandQueries = allQueries.filter(
      (oq) => oq.brandSlug === q.brandSlug && oq.categorySlug
    );
    return brandQueries.indexOf(q) < 3;
  });

  let queryCount = 0;
  for (const q of selectedQueries) {
    const brandId = brandMap.get(q.brandSlug);
    if (!brandId) continue;

    await db
      .insert(searchQueries)
      .values({
        brandId,
        categoryId: q.categorySlug ? categoryMap.get(q.categorySlug) ?? null : null,
        queryText: q.query,
        enabled: true,
      })
      .onConflictDoNothing();
    queryCount++;
  }
  console.log(`  Seeded ${queryCount} search queries`);

  // 5. Seed example products (2 full examples as required)
  console.log('Seeding example products...');

  const teslaId = brandMap.get('tesla');
  const bydId = brandMap.get('byd');
  const floorMatsId = categoryMap.get('floor-mats');
  const screenProtId = categoryMap.get('screen-protectors');

  if (teslaId && floorMatsId) {
    const slug1 = generateProductSlug('Tesla Model 3 Model Y Floor Mats All Weather TPE', 'DEMO0001');
    const [p1] = await db
      .insert(products)
      .values({
        aliexpressProductId: 'DEMO0001',
        slug: slug1,
        titleOriginal: 'Tesla Model 3 Model Y Floor Mats All Weather TPE Rubber 3D Molded',
        titleHe: 'שטיחים לטסלה מודל 3 / מודל Y - TPE כל מזג אוויר, תלת מימד',
        descriptionHe:
          'שטיחים איכותיים מ-TPE לטסלה מודל 3 ומודל Y. עמידים בכל תנאי מזג אוויר, קלים לניקוי, עם התאמה מושלמת לרכב. כוללים שטיח לתא מטען.',
        images: [
          'https://ae01.alicdn.com/kf/S1234example1.jpg',
          'https://ae01.alicdn.com/kf/S1234example2.jpg',
        ],
        price: 45.99,
        currency: 'USD',
        originalPrice: 69.99,
        rating: 4.7,
        totalOrders: 1250,
        shippingInfo: 'משלוח חינם, 15-25 ימים',
        originalUrl: 'https://www.aliexpress.com/item/DEMO0001.html',
        affiliateUrl: null,
        couponCode: 'EV5OFF',
        brandId: teslaId,
        categoryId: floorMatsId,
        brandHints: ['tesla'],
        categoryHints: ['floor-mats'],
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    if (p1) {
      console.log(`  Created example product 1: ${slug1}`);
    }
  }

  if (bydId && screenProtId) {
    const slug2 = generateProductSlug('BYD Atto 3 Navigation Screen Protector Tempered Glass', 'DEMO0002');
    const [p2] = await db
      .insert(products)
      .values({
        aliexpressProductId: 'DEMO0002',
        slug: slug2,
        titleOriginal: 'BYD Atto 3 12.8 Inch Navigation Screen Protector Tempered Glass HD',
        titleHe: 'מגן מסך לBYD Atto 3 - זכוכית מחוסמת 12.8 אינץ\', HD',
        descriptionHe:
          'מגן מסך מזכוכית מחוסמת לרכב BYD Atto 3. מתאים למסך הניווט 12.8 אינץ\'. שקוף, עמיד בשריטות, קל להתקנה. מגיע עם ערכת התקנה.',
        images: [
          'https://ae01.alicdn.com/kf/S5678example1.jpg',
          'https://ae01.alicdn.com/kf/S5678example2.jpg',
        ],
        price: 12.5,
        currency: 'USD',
        originalPrice: 18.99,
        rating: 4.5,
        totalOrders: 830,
        shippingInfo: 'משלוח חינם, 20-30 ימים',
        originalUrl: 'https://www.aliexpress.com/item/DEMO0002.html',
        affiliateUrl: null,
        couponCode: null,
        brandId: bydId,
        categoryId: screenProtId,
        brandHints: ['byd'],
        categoryHints: ['screen-protectors'],
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    if (p2) {
      // Add a manual coupon override for the second product
      await db
        .insert(productOverrides)
        .values({
          productId: p2.id,
          couponOverride: 'BYD10',
          isHidden: false,
        })
        .onConflictDoNothing();
      console.log(`  Created example product 2: ${slug2} (with coupon override)`);
    }
  }

  console.log('Seed completed!');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
