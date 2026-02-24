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
  title: 'טעינה ביתית לרכב חשמלי בישראל — המדריך המלא 2025',
  description:
    'כל מה שצריך לדעת על טעינה ביתית לרכב חשמלי בישראל — סוגי מטענים, עלויות התקנה, דרישות חשמל, אישורים וטיפים לבחירת המטען הנכון.',
};

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
    title:
      row.product_overrides?.titleHeOverride ??
      row.products.titleHe ??
      row.products.titleOriginal,
    description:
      row.product_overrides?.descriptionHeOverride ??
      row.products.descriptionHe,
    images: safeImages(row.products.images),
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

const tocSections = [
  { id: 'what-is', label: 'מה זה מטען ביתי ולמה צריך?' },
  { id: 'types', label: 'סוגי מטענים והספקים' },
  { id: 'costs', label: 'עלויות התקנה בישראל' },
  { id: 'electrical', label: 'דרישות חשמל ואישורים' },
  { id: 'tips', label: 'טיפים לבחירת מטען' },
];

const chargingFaqs = [
  {
    question: 'האם אפשר לטעון רכב חשמלי מהשקע בבית?',
    answer:
      'טכנית כן, אבל לא מומלץ לשימוש קבוע. שקע ביתי רגיל (16 אמפר) מספק הספק של כ-3.5 קילוואט, מה שאומר טעינה מלאה של 12-15 שעות. בנוסף, שימוש ממושך בעומס מלא עלול לגרום לחימום של השקע והכבלים. הפתרון המומלץ הוא התקנת מטען ייעודי (EVSE) עם חיבור ישיר ללוח החשמל.',
  },
  {
    question: 'כמה עולה חשמל לטעינה ביתית?',
    answer:
      'עלות הטעינה הביתית נמוכה משמעותית מתחנות טעינה ציבוריות. לפי תעריף חברת החשמל, טעינה מלאה של סוללה בגודל 60 קילוואט-שעה עולה כ-35-45 שקלים (תלוי בתעריף). אם תטענו בשעות הלילה (בתעריף נמוך), העלות יורדת עוד יותר. לשם השוואה, מילוי מכל דלק של רכב בנזין עולה 300-400 שקלים.',
  },
  {
    question: 'האם צריך חשמלאי מוסמך להתקנה?',
    answer:
      'כן, חובה. התקנת מטען לרכב חשמלי דורשת חשמלאי מוסמך עם רישיון בתוקף. ההתקנה כוללת חיבור ישיר ללוח החשמל, התקנת מפסק ייעודי, הנחת כבל מתאים ולעיתים שדרוג החיבור לחברת חשמל. עבודה על ידי גורם לא מוסמך עלולה לסכן את הבית ולבטל את הביטוח.',
  },
  {
    question: 'כמה זמן לוקחת טעינה מלאה בבית?',
    answer:
      'זמן הטעינה תלוי בהספק המטען ובגודל הסוללה. מטען 7 קילוואט יטען סוללה של 60 קילוואט-שעה (מ-20% ל-100%) בכ-7-8 שעות — בדיוק טעינת לילה. מטען 11 קילוואט יעשה את אותו העבודה בכ-5 שעות. מטען בסיסי (3.5 קילוואט) ייקח כ-14 שעות.',
  },
  {
    question: 'האם אפשר להתקין מטען בבניין משותף?',
    answer:
      'כן, אבל יש כמה דברים שצריך לסדר. ראשית, תצטרכו את אישור ועד הבית (בהתאם לחוק תיקון 33 לחוק המקרקעין, אי אפשר למנוע מדייר התקנת עמדת טעינה). שנית, תצטרכו פתרון למדידת החשמל — בדרך כלל מונה ייעודי או מטען עם מדידה מובנית. שלישית, ייתכן שתצטרכו למשוך כבל מהחניה ללוח החשמל של הדירה.',
  },
  {
    question: 'מה ההבדל בין טעינה חד-פאזית לתלת-פאזית?',
    answer:
      'חיבור חד-פאזי (שקיים ברוב הבתים בישראל) מאפשר מטען עד 7 קילוואט (32 אמפר). חיבור תלת-פאזי מאפשר מטענים חזקים יותר — 11 קילוואט (16 אמפר לפאזה) או 22 קילוואט (32 אמפר לפאזה). רוב הבתים הפרטיים בישראל יכולים לבקש שדרוג לתלת-פאזי מחברת החשמל, אך הדבר כרוך בעלות ובזמן המתנה.',
  },
];

export default async function HomeChargingGuidePage() {
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
    .limit(8);

  const chargerProducts: ProductDisplay[] = chargerRows.map(mapToDisplay);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'טעינה ביתית לרכב חשמלי בישראל — המדריך המלא',
    description:
      'כל מה שצריך לדעת על טעינה ביתית לרכב חשמלי בישראל — סוגי מטענים, עלויות התקנה, דרישות חשמל, אישורים וטיפים.',
    url: `${siteUrl}/charging/home-charging-israel`,
    inLanguage: 'he',
    publisher: {
      '@type': 'Organization',
      name: 'EV Shop',
      url: siteUrl,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: 'טעינה', href: '/category/chargers' },
          { label: 'טעינה ביתית בישראל' },
        ]}
      />

      {/* H1 */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          טעינה ביתית לרכב חשמלי בישראל — המדריך המלא
        </h1>
        <p className="text-muted leading-relaxed max-w-3xl">
          רכשתם רכב חשמלי או שאתם שוקלים לרכוש? טעינה ביתית היא אחד היתרונות
          הגדולים ביותר של רכב חשמלי — במקום לנסוע לתחנת דלק, הרכב שלכם נטען
          בזמן שאתם ישנים. במדריך הזה נסביר הכל: מה צריך כדי להתקין מטען בבית,
          כמה זה עולה, ואיזה מטען הכי מתאים לכם.
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="bg-white rounded-xl border border-border/50 p-6 mb-12 max-w-2xl">
        <h2 className="text-lg font-semibold mb-3">תוכן העניינים</h2>
        <ol className="space-y-2 list-decimal list-inside text-sm">
          {tocSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-primary hover:underline"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Section 1 — What is a home charger */}
      <article className="max-w-3xl">
        <section id="what-is" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">
            מה זה מטען ביתי ולמה צריך?
          </h2>
          <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              מטען ביתי לרכב חשמלי (נקרא גם EVSE — Electric Vehicle Supply
              Equipment) הוא מכשיר שמתחבר ללוח החשמל של הבית ומספק טעינה בטוחה
              ויעילה לרכב. בניגוד לחיבור ישיר לשקע, מטען ייעודי כולל מנגנוני
              בטיחות מובנים כמו הגנה מפני קצר, הגנה מפני זרם זליגה (RCD), ובקרת
              טמפרטורה.
            </p>
            <p>
              <strong>למה לא להסתפק בשקע רגיל?</strong> שקע ביתי רגיל מספק הספק
              של כ-3.5 קילוואט בלבד, מה שאומר שטעינה מלאה תיקח 12-15 שעות.
              בנוסף, שימוש ממושך בעומס מלא עלול לגרום לחימום מסוכן של השקע,
              הכבלים והתקע. מטען ייעודי מספק הספק גבוה יותר (7-22 קילוואט),
              טעינה מהירה יותר, ובטיחות מלאה.
            </p>
            <p>
              <strong>היתרונות של טעינה ביתית:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>נוחות מקסימלית</strong> — מחברים את הרכב כשמגיעים הביתה,
                ובבוקר הסוללה מלאה
              </li>
              <li>
                <strong>חיסכון כספי</strong> — עלות הטעינה הביתית נמוכה ב-30-50%
                מתחנות ציבוריות, ובלילה אפילו זול יותר
              </li>
              <li>
                <strong>שליטה מלאה</strong> — תזמנו טעינה בשעות הלילה, עקבו אחרי
                צריכת החשמל, והגדירו מגבלות טעינה
              </li>
              <li>
                <strong>אורך חיי סוללה</strong> — טעינה איטית וקבועה (AC) שומרת
                על בריאות הסוללה לאורך זמן, בניגוד לטעינה מהירה (DC)
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 — Types and power levels */}
        <section id="types" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">סוגי מטענים והספקים</h2>
          <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              מטענים ביתיים לרכבים חשמליים מתחלקים לשני סוגים עיקריים, ולכמה
              רמות הספק. הבנת ההבדלים תעזור לכם לבחור את המטען הנכון.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              מטען נייד (Portable EVSE)
            </h3>
            <p>
              מטען נייד מגיע בתיק נשיאה ומתחבר לשקע חשמלי — בין אם שקע ביתי
              רגיל (Schuko, 16A) או שקע תעשייתי (כמו CEE 16A או CEE 32A).
              היתרון המרכזי שלו הוא הגמישות: אפשר לקחת אותו לכל מקום, להשתמש
              בו בעבודה, בבית ההורים, או בצימר. מטענים ניידים בדרך כלל מוגבלים
              ל-3.5-7 קילוואט, תלוי בסוג השקע.
            </p>
            <p>
              <strong>מתאים ל:</strong> שוכרי דירות, מי שצריך גמישות, או כמטען
              גיבוי לנסיעות.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              מטען קיר (Wallbox)
            </h3>
            <p>
              מטען קיר מותקן בצורה קבועה על הקיר ומחובר ישירות ללוח החשמל.
              הוא מספק הספק גבוה יותר, כולל לרוב אפליקציה לניהול טעינה, ומציע
              פיצ&apos;רים חכמים כמו תזמון טעינה, מדידת צריכה ואיזון עומסים.
              המראה המקצועי שלו גם מוסיף לאסתטיקה של החניה.
            </p>
            <p>
              <strong>מתאים ל:</strong> בעלי בתים פרטיים או דירות עם חניה קבועה
              שרוצים את הפתרון הטוב ביותר.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              רמות הספק
            </h3>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-border/50 px-4 py-2 text-start font-medium">
                      הספק
                    </th>
                    <th className="border border-border/50 px-4 py-2 text-start font-medium">
                      סוג חיבור
                    </th>
                    <th className="border border-border/50 px-4 py-2 text-start font-medium">
                      טווח לשעה
                    </th>
                    <th className="border border-border/50 px-4 py-2 text-start font-medium">
                      זמן טעינה מלאה*
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border/50 px-4 py-2">
                      3.5 קילוואט
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      חד-פאזי, 16A
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      ~20 ק&quot;מ
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      14-17 שעות
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-border/50 px-4 py-2 font-medium">
                      7 קילוואט
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      חד-פאזי, 32A
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      ~40-50 ק&quot;מ
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      7-8 שעות
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-border/50 px-4 py-2">
                      11 קילוואט
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      תלת-פאזי, 16A
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      ~65 ק&quot;מ
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      4-5 שעות
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-border/50 px-4 py-2">
                      22 קילוואט
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      תלת-פאזי, 32A
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      ~120 ק&quot;מ
                    </td>
                    <td className="border border-border/50 px-4 py-2">
                      2-3 שעות
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-muted mt-2">
                * זמן טעינה משוער לסוללה של 60 קילוואט-שעה, מ-20% ל-100%
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 — Installation costs */}
        <section id="costs" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">עלויות התקנה בישראל</h2>
          <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              עלות ההתקנה של מטען ביתי בישראל תלויה בכמה גורמים. הנה פירוט של
              העלויות הנפוצות:
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              עלות המטען עצמו
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>מטען נייד בסיסי (3.5-7 קילוואט):</strong> 500-1,500
                שקלים
              </li>
              <li>
                <strong>מטען קיר (Wallbox) 7 קילוואט:</strong> 1,500-3,500
                שקלים
              </li>
              <li>
                <strong>מטען קיר חכם 11-22 קילוואט:</strong> 3,000-6,000 שקלים
              </li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              עלות עבודת חשמלאי
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>התקנה בסיסית</strong> (לוח חשמל קרוב, ללא חפירה):
                1,500-3,000 שקלים
              </li>
              <li>
                <strong>התקנה מורכבת</strong> (מרחק גדול, חפירה, הנחת כבל):
                3,000-6,000 שקלים
              </li>
              <li>
                <strong>שדרוג חיבור לחברת חשמל</strong> (אם נדרש): 1,000-3,000
                שקלים + זמן המתנה
              </li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              סיכום עלויות
            </h3>
            <p>
              בסך הכל, עלות מטען ביתי + התקנה נעה בין 3,000 ל-12,000 שקלים,
              תלוי ברמת המטען ומורכבות ההתקנה. הפתרון הנפוץ ביותר — מטען 7
              קילוואט עם התקנה בסיסית — עולה בדרך כלל 3,000-5,000 שקלים הכל
              כלול.
            </p>
            <p>
              <strong>חשוב לזכור:</strong> ההשקעה מחזירה את עצמה תוך 1-2 שנים
              בזכות החיסכון בעלויות טעינה לעומת תחנות ציבוריות. בממוצע, בעל רכב
              חשמלי חוסך כ-500-700 שקלים בחודש בהוצאות &quot;דלק&quot; לעומת רכב
              בנזין.
            </p>
          </div>
        </section>

        {/* Section 4 — Electrical requirements */}
        <section id="electrical" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">דרישות חשמל ואישורים</h2>
          <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              התקנת מטען ביתי דורשת עמידה בדרישות חשמל ספציפיות. הנה מה שצריך
              לדעת:
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              בדיקת לוח החשמל
            </h3>
            <p>
              לפני ההתקנה, חשמלאי צריך לבדוק את לוח החשמל הקיים ולוודא שיש
              מספיק קיבולת להוספת מעגל חדש. מטען 7 קילוואט דורש מפסק 32 אמפר
              ייעודי, ומטען 11 קילוואט דורש חיבור תלת-פאזי עם מפסק 16 אמפר
              לכל פאזה.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              סוג חיבור חשמל
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>חד-פאזי (רוב הבתים):</strong> מאפשר מטען עד 7 קילוואט.
                מספיק לרוב המשתמשים.
              </li>
              <li>
                <strong>תלת-פאזי:</strong> מאפשר מטענים של 11-22 קילוואט. נפוץ
                בבתים פרטיים חדשים ובמבנים מסחריים. אם אין לכם חיבור תלת-פאזי,
                ניתן לבקש שדרוג מחברת החשמל.
              </li>
            </ul>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              כבלים ומפסקים
            </h3>
            <p>
              הכבל מלוח החשמל למטען חייב להיות בחתך מתאים להספק. למטען 7
              קילוואט נדרש כבל 6 מ&quot;מ לפחות, ולמטען 11 קילוואט כבל 2.5
              מ&quot;מ לכל פאזה (5x2.5). בנוסף, נדרש מפסק פחת (RCD) מסוג A או
              Type B ייעודי למטען.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mt-6 mb-2">
              אישורים ותקנות
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                ההתקנה חייבת להיעשות על ידי חשמלאי בעל רישיון חשמלאי מוסמך
              </li>
              <li>
                המטען צריך לעמוד בתקן IEC 61851 (תקן בינלאומי למטעני רכב חשמלי)
              </li>
              <li>
                בבניין משותף — נדרש אישור ועד הבית (לפי חוק, אי אפשר למנוע
                התקנה)
              </li>
              <li>
                מומלץ לעדכן את ביטוח הדירה על התקנת המטען
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5 — Tips */}
        <section id="tips" className="mb-14 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-2">טיפים לבחירת מטען</h2>
          <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
          <div className="space-y-4 text-sm text-muted leading-relaxed">
            <p>
              אחרי שהבנתם את היסודות, הנה הטיפים שלנו לבחירת המטען הנכון:
            </p>

            <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  1. בדקו את הספק הטעינה של הרכב שלכם
                </p>
                <p>
                  אין טעם לקנות מטען 22 קילוואט אם הרכב שלכם תומך רק ב-7. בדקו
                  את מפרט הרכב ובחרו מטען שתואם את ההספק המקסימלי.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  2. חשבו על העתיד
                </p>
                <p>
                  אם אתם מתכננים להחליף רכב בעוד כמה שנים, שקלו מטען חזק יותר
                  שיתאים גם לרכב הבא. הפרש העלות בין מטען 7 ל-11 קילוואט קטן
                  יחסית.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  3. בחרו מטען עם תזמון טעינה
                </p>
                <p>
                  תזמון טעינה מאפשר לטעון בשעות הלילה, כשהחשמל זול יותר. גם אם
                  הרכב שלכם תומך בתזמון, מטען עם תזמון עצמאי נותן שכבת שליטה
                  נוספת.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  4. ודאו שהמטען מתאים למזג האוויר
                </p>
                <p>
                  אם המטען מותקן בחוץ (חניה פתוחה), ודאו שיש לו דירוג IP65 או
                  יותר — מה שאומר שהוא עמיד בפני מים ואבק.
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  5. אל תתפשרו על בטיחות
                </p>
                <p>
                  קנו מטען ממותג מוכר עם תקן בינלאומי מאושר. מטענים זולים ללא
                  תקן עלולים לסכן את הרכב ואת הבית. ודאו שההתקנה נעשית על ידי
                  חשמלאי מוסמך.
                </p>
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* Charger Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">מטענים מומלצים</h2>
        <div className="h-1 w-12 bg-gradient-to-l from-yellow-500 to-amber-400 rounded-full mb-6" />
        <ProductGrid
          products={chargerProducts}
          emptyMessage="עדיין אין מטענים להציג"
        />
      </section>

      {/* Lead Capture */}
      <LeadCaptureInline source="home-charging-guide" />

      {/* FAQ */}
      <section className="mb-12">
        <FAQSection
          items={chargingFaqs}
          title="שאלות נפוצות על טעינה ביתית"
        />
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">קישורים שימושיים</h2>
        <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/compare/chargers"
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
            השוואת מטענים
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
          <Link
            href="/by-model/tesla-model-3"
            className="inline-flex items-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            אביזרים לטסלה Model 3
          </Link>
          <Link
            href="/by-model/byd-atto-3"
            className="inline-flex items-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            אביזרים ל-BYD Atto 3
          </Link>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="mt-8">
        <AffiliateDisclosure variant="banner" />
      </div>
    </div>
  );
}
