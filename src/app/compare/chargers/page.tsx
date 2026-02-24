import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { products, productOverrides, brands, accessoryCategories } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGrid from '@/components/product/ProductGrid';
import FAQSection from '@/components/FAQSection';
import LeadCaptureInline from '@/components/lead/LeadCaptureInline';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import type { ProductDisplay } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'השוואת מטענים לרכב חשמלי | איזה מטען כדאי לקנות?',
  description:
    'השוואה מקיפה בין סוגי מטענים לרכב חשמלי בישראל — Type 2, נייד, קבוע, עוצמות שונות. טבלת השוואה והמלצות לפי רכב.',
};

function mapToDisplay(row: any): ProductDisplay {
  return {
    id: row.products.id,
    slug: row.products.slug,
    title:
      row.product_overrides?.titleHeOverride ??
      row.products.titleHe ??
      row.products.titleOriginal,
    description:
      row.product_overrides?.descriptionHeOverride ??
      row.products.descriptionHe,
    images: row.products.images,
    price: row.products.price,
    currency: row.products.currency,
    originalPrice: row.products.originalPrice,
    rating: row.products.rating,
    totalOrders: row.products.totalOrders,
    shippingInfo: row.products.shippingInfo,
    affiliateUrl: row.products.affiliateUrl,
    couponCode:
      row.product_overrides?.couponOverride ?? row.products.couponCode,
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

const chargerFaqs = [
  {
    question: 'מה ההבדל בין מטען נייד למטען קיר?',
    answer:
      'מטען נייד (Portable EVSE) מגיע עם תקע ביתי או תעשייתי ואפשר לקחת אותו לכל מקום. הוא מתאים למי שמשכיר דירה או צריך גמישות. מטען קיר (Wallbox) מותקן בצורה קבועה ובדרך כלל מספק הספק גבוה יותר, טעינה מהירה יותר וממשק חכם לניהול הטעינה. ההמלצה היא להתקין מטען קיר אם יש לכם חניה פרטית, ולשמור מטען נייד כגיבוי לנסיעות.',
  },
  {
    question: 'מה זה Type 2 ולמה זה חשוב?',
    answer:
      'Type 2 (או Mennekes) הוא תקן החיבור האירופי לטעינת רכבים חשמליים בזרם חילופין (AC). כל הרכבים החשמליים הנמכרים בישראל תומכים בחיבור Type 2. כשאתם רוכשים מטען ביתי, ודאו שהוא מגיע עם חיבור Type 2 כדי להבטיח תאימות מלאה לרכב שלכם.',
  },
  {
    question: 'כמה עולה להתקין מטען ביתי בישראל?',
    answer:
      'עלות ההתקנה תלויה במספר גורמים: מרחק לוח החשמל מהחניה, הצורך בשדרוג החיבור לחברת חשמל, והאם נדרש חפירה או הנחת כבל. בממוצע, עלות ההתקנה נעה בין 2,000 ל-6,000 שקלים, לא כולל המטען עצמו. חשוב לעבוד עם חשמלאי מוסמך שמכיר את התקנות הרלוונטיות.',
  },
  {
    question: 'האם מטען 7 קילוואט מספיק לטעינה ביתית?',
    answer:
      'בהחלט. מטען 7 קילוואט (32 אמפר, חד-פאזי) הוא הבחירה הנפוצה ביותר לטעינה ביתית בישראל. הוא מוסיף כ-40-50 ק"מ טווח לכל שעת טעינה, מה שאומר שטעינה של לילה שלם (כ-8 שעות) תוסיף 300-400 ק"מ — מספיק כדי למלא את רוב הסוללות מ-20% ל-100%. מטענים חזקים יותר (11 או 22 קילוואט) דורשים חיבור תלת-פאזי שלא תמיד זמין בבתים פרטיים.',
  },
  {
    question: 'איך יודעים איזה מטען מתאים לרכב שלי?',
    answer:
      'כל רכב חשמלי מגיע עם מפרט שמציין את ההספק המקסימלי לטעינת AC. למשל, טסלה Model 3 תומכת בעד 11 קילוואט, BYD Atto 3 בעד 7 קילוואט, ו-MG4 בעד 11 קילוואט (גרסת Extended Range). אין טעם לקנות מטען בהספק גבוה מהתמיכה של הרכב — המטען יעבוד, אבל הרכב יטען רק בהספק המקסימלי שהוא תומך בו. בדקו את המפרט של הרכב שלכם ובחרו מטען בהתאם.',
  },
];

export default async function ChargerComparisonPage() {
  const chargerCategory = await db
    .select()
    .from(accessoryCategories)
    .where(eq(accessoryCategories.slug, 'chargers'))
    .limit(1);

  const chargerRows = await db
    .select()
    .from(products)
    .leftJoin(productOverrides, eq(productOverrides.productId, products.id))
    .leftJoin(brands, eq(brands.id, products.brandId))
    .leftJoin(
      accessoryCategories,
      eq(accessoryCategories.id, products.categoryId)
    )
    .where(
      and(
        eq(products.isActive, true),
        sql`(${productOverrides.isHidden} IS NULL OR ${productOverrides.isHidden} = false)`,
        chargerCategory[0]
          ? eq(products.categoryId, chargerCategory[0].id)
          : undefined
      )
    )
    .orderBy(desc(products.totalOrders))
    .limit(12);

  const chargerProducts: ProductDisplay[] = chargerRows.map(mapToDisplay);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'השוואת מטענים לרכב חשמלי',
    numberOfItems: chargerProducts.length,
    itemListElement: chargerProducts.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/p/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: 'השוואת מטענים' },
        ]}
      />

      {/* H1 + Intro */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          השוואת מטענים לרכב חשמלי בישראל
        </h1>
        <p className="text-muted leading-relaxed max-w-3xl">
          בחירת מטען לרכב חשמלי היא אחת ההחלטות החשובות ביותר לאחר רכישת הרכב.
          מטען ביתי טוב יבטיח שהרכב שלכם יהיה מוכן כל בוקר עם סוללה מלאה,
          יחסוך לכם כסף לעומת תחנות טעינה ציבוריות, ויאפשר לכם ליהנות מנוחות
          הטעינה הביתית. בעמוד זה תמצאו השוואה מקיפה בין סוגי מטענים, הסבר על
          הספקים ועוצמות, וכמובן — מטענים מומלצים שנבחרו על ידי הצוות שלנו.
        </p>
      </div>

      {/* How to choose section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">
          איך לבחור מטען לרכב חשמלי?
        </h2>
        <div className="h-1 w-12 bg-gradient-to-l from-yellow-500 to-amber-400 rounded-full mb-6" />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Power levels */}
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">
              רמות הספק — מה מתאים לכם?
            </h3>
            <ul className="space-y-3 text-sm text-muted leading-relaxed">
              <li className="flex gap-3">
                <span className="font-medium text-gray-900 shrink-0">
                  3.5 קילוואט
                </span>
                <span>
                  — מטען בסיסי שמתחבר לשקע ביתי רגיל (16 אמפר). מוסיף כ-20
                  ק&quot;מ טווח לשעה. מתאים כפתרון זמני או גיבוי, אך איטי
                  לשימוש יומיומי.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-gray-900 shrink-0">
                  7 קילוואט
                </span>
                <span>
                  — הבחירה הנפוצה ביותר בישראל. חד-פאזי, 32 אמפר. מוסיף כ-40-50
                  ק&quot;מ לשעה ומאפשר טעינה מלאה בלילה אחד. מתאים לרוב הרכבים
                  והמשתמשים.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-gray-900 shrink-0">
                  11 קילוואט
                </span>
                <span>
                  — תלת-פאזי, 16 אמפר לכל פאזה. מוסיף כ-65 ק&quot;מ לשעה.
                  מתאים לרכבים שתומכים ב-11 קילוואט (כמו טסלה Model 3 ו-MG4)
                  ולמי שרוצה טעינה מהירה יותר.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-medium text-gray-900 shrink-0">
                  22 קילוואט
                </span>
                <span>
                  — תלת-פאזי, 32 אמפר לכל פאזה. הספק מקסימלי לטעינת AC. רלוונטי
                  בעיקר לעסקים ולרכבים שתומכים בהספק זה (כמו Renault Zoe).
                </span>
              </li>
            </ul>
          </div>

          {/* Portable vs wall-mounted */}
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">נייד לעומת קבוע</h3>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <div>
                <p className="font-medium text-gray-900 mb-1">מטען נייד (Portable EVSE)</p>
                <p>
                  מגיע בתיק נשיאה, מתחבר לשקע ביתי או תעשייתי. יתרון מרכזי —
                  גמישות מלאה: אפשר לקחת אותו לכל מקום, מתאים לשוכרי דירות או
                  למי שצריך לטעון במקומות שונים. החיסרון — בדרך כלל מוגבל להספק
                  נמוך יותר.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  מטען קיר (Wallbox)
                </p>
                <p>
                  מותקן על הקיר בצורה קבועה ומחובר ישירות ללוח החשמל. מספק הספק
                  גבוה יותר, כולל לרוב אפליקציה לניהול טעינה, תזמון טעינה
                  בשעות הלילה (כשהחשמל זול יותר), ומראה מקצועי. דורש התקנה על
                  ידי חשמלאי מוסמך.
                </p>
              </div>
            </div>
          </div>

          {/* Smart features */}
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">פיצ'רים חכמים</h3>
            <div className="text-sm text-muted leading-relaxed space-y-2">
              <p>
                מטענים חכמים מציעים יתרונות שמצדיקים את ההשקעה הנוספת. הנה
                הפיצ'רים הכי חשובים:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>תזמון טעינה</strong> — הגדירו טעינה בשעות הלילה כדי
                  ליהנות מתעריף חשמל מופחת
                </li>
                <li>
                  <strong>ניטור צריכה</strong> — עקבו אחרי צריכת החשמל ועלויות
                  הטעינה באפליקציה
                </li>
                <li>
                  <strong>חיבור Wi-Fi</strong> — עדכוני קושחה, שליטה מרחוק
                  והתראות
                </li>
                <li>
                  <strong>איזון עומסים</strong> — המטען מתאים את ההספק לעומס
                  הכולל בבית כדי למנוע ניתוק
                </li>
              </ul>
            </div>
          </div>

          {/* Compatibility */}
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">תאימות לרכב שלכם</h3>
            <div className="text-sm text-muted leading-relaxed space-y-2">
              <p>
                לפני רכישת מטען, בדקו את ההספק המקסימלי שהרכב שלכם תומך בו
                לטעינת AC. הנה כמה דוגמאות נפוצות:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>טסלה Model 3/Y</strong> — עד 11 קילוואט (תלת-פאזי)
                </li>
                <li>
                  <strong>BYD Atto 3</strong> — עד 7 קילוואט (חד-פאזי)
                </li>
                <li>
                  <strong>MG4</strong> — עד 11 קילוואט (גרסת Extended Range)
                </li>
                <li>
                  <strong>Hyundai Ioniq 5</strong> — עד 11 קילוואט (תלת-פאזי)
                </li>
              </ul>
              <p>
                חשוב: אין בעיה לחבר מטען חזק לרכב שתומך בפחות — הרכב פשוט
                יטען בהספק המקסימלי שלו.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="mb-8">
        <AffiliateDisclosure variant="banner" />
      </div>

      {/* Recommended Chargers */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">מטענים מומלצים</h2>
        <div className="h-1 w-12 bg-gradient-to-l from-yellow-500 to-amber-400 rounded-full mb-6" />
        <ProductGrid
          products={chargerProducts}
          emptyMessage="עדיין אין מטענים להציג"
        />
      </section>

      {/* Lead Capture */}
      <LeadCaptureInline source="charger-comparison" />

      {/* FAQ */}
      <section className="mb-12">
        <FAQSection items={chargerFaqs} title="שאלות נפוצות על מטענים לרכב חשמלי" />
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">קישורים שימושיים</h2>
        <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/charging/home-charging-israel"
            className="inline-flex items-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <svg
              className="h-4 w-4 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            מדריך טעינה ביתית בישראל
          </Link>
          <Link
            href="/category/chargers"
            className="inline-flex items-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            כל המטענים והכבלים
          </Link>
          <Link
            href="/blog/home-charging-guide-israel"
            className="inline-flex items-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            מאמר: מדריך טעינה ביתית
          </Link>
        </div>
      </section>
    </div>
  );
}
