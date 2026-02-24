import { notFound } from 'next/navigation';
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

interface ModelPageData {
  brandSlug: string;
  model: string;
  titleHe: string;
  descriptionHe: string;
  introContent: string;
  howToChoose: string;
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; label: string }[];
}

const MODEL_PAGES: Record<string, ModelPageData> = {
  'byd-atto-3': {
    brandSlug: 'byd',
    model: 'Atto 3',
    titleHe: 'אביזרים ל-BYD Atto 3 | שטיחים, מגני מסך ומטענים',
    descriptionHe:
      'מגוון אביזרים תפורים ל-BYD Atto 3 — שטיחים, מגני מסך, מטענים, מארגני תא מטען ועוד. מחירים משתלמים עם משלוח לישראל.',
    introContent:
      'ה-BYD Atto 3 הוא אחד הרכבים החשמליים הפופולריים ביותר בישראל, ולא בכדי. עם טווח נסיעה של עד 420 ק"מ, עיצוב פנים מודרני וייחודי, ומחיר תחרותי — הוא הפך לבחירה המועדפת של אלפי ישראלים שעברו לחשמלי.\n\nכדי למקסם את חוויית הנהיגה ולשמור על הרכב במצב מושלם, כדאי להצטייד באביזרים מותאמים. שטיחי TPE תפורים מגנים על רצפת הרכב מלכלוך ומים, מגן מסך שומר על המסך המרכזי הגדול של ה-Atto 3 משריטות, ומארגן תא מטען מנצל את החלל בצורה אופטימלית.\n\nבעמוד זה ריכזנו עבורכם את האביזרים הנמכרים ביותר ל-BYD Atto 3, כולם נבדקו על ידי הצוות שלנו ונבחרו לפי דירוג, ביקורות משתמשים ותאימות מוכחת לדגם.',
    howToChoose:
      'כשבוחרים אביזרים ל-Atto 3, חשוב לשים לב להתאמה מדויקת לדגם ולשנת הייצור. ל-BYD Atto 3 יש עיצוב פנים ייחודי עם קונסולה מרכזית גיטרה-סטייל, ולכן אביזרים גנריים לא תמיד יתאימו. ודאו שהמוצר מציין במפורש תאימות ל-BYD Atto 3. בנוסף, שימו לב לחומרי הייצור — שטיחי TPE עדיפים על PVC כי הם עמידים יותר, קלים יותר לניקוי ואינם מפיצים ריח. למגני מסך, בחרו זכוכית מחוסמת (Tempered Glass) בעובי 9H שמגנה משריטות ומשמרת את מגע האצבעות.',
    faqs: [
      {
        question: 'אילו שטיחים מתאימים ל-BYD Atto 3?',
        answer:
          'שטיחים תפורים במיוחד ל-Atto 3 מבטיחים כיסוי מלא של רצפת הרכב. מומלץ לבחור שטיחים מ-TPE (גומי תרמופלסטי) שקלים לניקוי ועמידים בפני מים ולכלוך. שטיחים מ-TPE גם לא מפיצים ריח ושומרים על גמישותם בכל מזג אוויר.',
      },
      {
        question: 'האם מגן מסך ל-Atto 3 קל להתקנה?',
        answer:
          'כן, רוב מגני המסך ל-Atto 3 מגיעים עם ערכת התקנה פשוטה הכוללת מגבון ניקוי, מדבקת אבק ומגן מסך עם שכבת סיליקון דביקה. ההתקנה לוקחת כ-5 דקות ולא דורשת כלים מיוחדים. מומלץ לנקות את המסך היטב לפני ההתקנה ולעבוד בסביבה נקייה מאבק.',
      },
      {
        question: 'איזה מטען ביתי מומלץ ל-BYD Atto 3?',
        answer:
          'ה-Atto 3 תומך בטעינה בזרם חילופין עד 7 קילוואט דרך חיבור Type 2. מטען ביתי בהספק 7 קילוואט יטען את הרכב מ-20% ל-100% בכ-7-8 שעות, מה שמתאים בדיוק לטעינת לילה. אין צורך במטען חזק יותר כי הרכב ממילא לא תומך בהספק גבוה מ-7 קילוואט לטעינת AC.',
      },
      {
        question: 'מהם האביזרים החיוניים ביותר ל-BYD Atto 3?',
        answer:
          'האביזרים המומלצים ביותר הם: שטיחי TPE תפורים (כולל לתא המטען), מגן מסך מזכוכית מחוסמת למסך ה-12.8 אינץ\' המסתובב, מארגן לתא המטען שמנצל את החלל ביעילות, ומטען נייד כגיבוי לנסיעות ארוכות.',
      },
      {
        question: 'האם אביזרים מ-AliExpress מתאימים ל-BYD Atto 3?',
        answer:
          'כן, רוב האביזרים שאנחנו ממליצים עליהם מגיעים מחנויות מאומתות ב-AliExpress שמתמחות באביזרים ל-BYD. המוצרים נבדקו על ידי אלפי קונים ומדורגים גבוה. חשוב לבדוק שהמוכר מציין תאימות ספציפית לדגם ולשנה, ולקרוא ביקורות של קונים אחרים.',
      },
    ],
    relatedLinks: [
      { href: '/brand/byd', label: 'כל המוצרים ל-BYD' },
      { href: '/blog/home-charging-guide-israel', label: 'מדריך טעינה ביתית' },
      { href: '/compare/chargers', label: 'השוואת מטענים' },
    ],
  },
  'tesla-model-3': {
    brandSlug: 'tesla',
    model: 'Model 3',
    titleHe: 'אביזרים לטסלה Model 3 | שטיחים, מגני מסך ומטענים',
    descriptionHe:
      'אביזרים מומלצים לטסלה Model 3 — שטיחים תפורים, מגני מסך, מטענים וכבלים, אביזרי פנים ועוד.',
    introContent:
      'טסלה Model 3 הוא הרכב החשמלי הנמכר ביותר בעולם, ואחד הדגמים הנפוצים ביותר על כבישי ישראל. עם ביצועים מרשימים, טכנולוגיית אוטופיילוט מתקדמת ועיצוב מינימליסטי — הוא הרכב שהגדיר את עידן החשמלי.\n\nהעיצוב הייחודי של טסלה, עם מסך מרכזי של 15.4 אינץ\' ללא לוח מחוונים מסורתי, תא מטען קדמי (פראנק) וקונסולה מרכזית פתוחה, יוצר צורך באביזרים שתוכננו במיוחד לדגם. אביזרים גנריים כמעט תמיד לא מתאימים.\n\nבחרנו עבורכם את האביזרים הפופולריים ביותר ל-Model 3, מתוך אלפי מוצרים זמינים. כל מוצר נבחר לפי דירוג גבוה, מספר הזמנות ותאימות מאומתת לדגם.',
    howToChoose:
      'לטסלה Model 3 יש מגוון רחב של אביזרים זמינים, אבל חשוב לדעת מה באמת שווה את ההשקעה. האביזרים החיוניים הם שטיחי TPE (שמגנים על הרצפה מלכלוך ומים), מגן מסך (המסך ה-15 אינץ\' חשוף לשמש ולטביעות אצבע), ומארגן לקונסולה המרכזית (שבלי מארגן הופכת לבור שחור). אם יש לכם את דגם 2024 (Highland), שימו לב שהמידות שונות מדגמים קודמים — ודאו תאימות לגרסה המדויקת שלכם.',
    faqs: [
      {
        question: 'מה האביזרים החיוניים לטסלה Model 3?',
        answer:
          'האביזרים המומלצים ביותר הם שטיחים תפורים (TPE), מגן מסך זכוכית למסך ה-15.4 אינץ\', מארגן לתא מטען, מארגן לקונסולה המרכזית, ומגן שמש למושבים האחוריים. אלה המוצרים שמשפרים הכי הרבה את חוויית השימוש היומיומית.',
      },
      {
        question: 'האם צריך אביזרים ספציפיים לטסלה?',
        answer:
          'כן, בגלל העיצוב הייחודי של טסלה (מסך מרכזי גדול, תא מטען קדמי, קונסולה מרכזית ייחודית), מומלץ לרכוש אביזרים שתוכננו במיוחד לדגם. שטיחים גנריים לא יתאימו למידות, ומגן מסך צריך להיות בגודל המדויק של המסך.',
      },
      {
        question: 'מה ההבדל בין Model 3 הרגיל ל-Highland (2024)?',
        answer:
          'דגם Highland (2024) שודרג עם עיצוב פנים חדש, מסך מאחור, תאורת אווירה ושינויים במידות הפנים. אביזרים רבים (כמו שטיחים ומגני מסך) שונים בין הגרסאות. ודאו שאתם רוכשים אביזרים שמתאימים לגרסת הרכב שלכם.',
      },
      {
        question: 'איפה כדאי לקנות אביזרים לטסלה?',
        answer:
          'באתר שלנו תמצאו מגוון רחב של אביזרים מומלצים במחירים משתלמים. כל המוצרים נבחרו בקפידה לפי דירוג, ביקורות ואמינות המוכר. המחירים נמוכים משמעותית ממה שתמצאו בחנויות מקומיות בישראל.',
      },
      {
        question: 'כמה זמן לוקח המשלוח לישראל?',
        answer:
          'רוב המוצרים מגיעים תוך 2-4 שבועות. מוצרים רבים מציעים משלוח חינם לישראל. מומלץ לבדוק את מידע המשלוח בדף כל מוצר — שם תראו את זמן האספקה המשוער ועלות המשלוח.',
      },
    ],
    relatedLinks: [
      { href: '/brand/tesla', label: 'כל המוצרים לטסלה' },
      {
        href: '/blog/home-charging-guide-israel',
        label: 'מדריך טעינה ביתית',
      },
      { href: '/compare/chargers', label: 'השוואת מטענים' },
    ],
  },
  'tesla-model-y': {
    brandSlug: 'tesla',
    model: 'Model Y',
    titleHe: 'אביזרים לטסלה Model Y | שטיחים, מארגנים ומטענים',
    descriptionHe:
      'אביזרים מומלצים לטסלה Model Y — שטיחים, מארגני תא מטען, מגני מסך, אביזרי פנים ועוד.',
    introContent:
      'טסלה Model Y הוא ה-SUV החשמלי הפופולרי ביותר בעולם, ובישראל הוא ממשיך לתפוס נתח שוק גדול. עם תא מטען ענק (כ-2,158 ליטר עם המושבים מקופלים), שורה שלישית אופציונלית וטווח של עד 533 ק"מ — הוא הבחירה האידיאלית למשפחות ישראליות.\n\nבזכות תא המטען הגדול, ל-Model Y יש מגוון אביזרי אחסון ואירגון שפשוט לא רלוונטיים לרכבים קטנים יותר. מארגן דו-שכבתי לתא המטען, מחיצות מתקפלות, רשת אחסון, מארגן לתא המטען הקדמי (פראנק) — כל אלה הופכים את החלל לפונקציונלי יותר.\n\nבעמוד זה ריכזנו את האביזרים הנמכרים ביותר ל-Model Y, עם דגש על מוצרים שמנצלים את החלל הפנימי הגדול בצורה אופטימלית.',
    howToChoose:
      'ל-Model Y יש תא מטען גדול במיוחד, ולכן מארגן תא מטען הוא אחד האביזרים הכי משתלמים שתוכלו לרכוש. מומלץ לבחור מארגן דו-שכבתי שמנצל גם את החלל שמתחת לרצפת תא המטען. בנוסף, כיוון שה-Model Y גבוה יותר מ-Model 3, הוא חשוף יותר לשמש — מגן שמש (sunshade) לגג הפנורמי הוא השקעה שתגן על הנוסעים ותקטין את הצורך בשימוש במזגן. שימו לב שלמרות הדמיון ל-Model 3, המידות שונות ולכן חובה לרכוש אביזרים ספציפיים ל-Model Y.',
    faqs: [
      {
        question: 'מה ההבדל בין אביזרים ל-Model 3 ו-Model Y?',
        answer:
          'למרות שהדגמים חולקים פלטפורמה דומה, יש הבדלים משמעותיים במידות — במיוחד בתא המטען, בגג הפנורמי ובמושב האחורי. שטיחים, מארגני תא מטען ומגני שמש שונים בגודלם. חשוב לרכוש אביזרים ספציפיים ל-Model Y ולא להסתפק באביזרים של Model 3.',
      },
      {
        question: 'האם שטיחים ל-Model 3 מתאימים ל-Model Y?',
        answer:
          'לא. למרות הדמיון החיצוני, המידות הפנימיות שונות. שטיחים ל-Model Y גדולים יותר ומותאמים לרצפה הספציפית של הדגם. שימוש בשטיחים של Model 3 ישאיר אזורים חשופים ולא יספק הגנה מלאה.',
      },
      {
        question: 'מה מארגן תא מטען מומלץ ל-Model Y?',
        answer:
          'מומלץ לרכוש מארגן דו-שכבתי שמנצל את החלל שמתחת לרצפת תא המטען. יש גם מארגנים לתא המטען הקדמי (פראנק) שעוזרים לארגן את החפצים הקטנים. מארגן עם מחיצות מתכווננות מאפשר התאמה לגודל החפצים שאתם מובילים.',
      },
      {
        question: 'האם כדאי לקנות מגן שמש לגג ה-Model Y?',
        answer:
          'בהחלט. הגג הפנורמי של Model Y מכניס הרבה אור ושמש, במיוחד בקיץ הישראלי. מגן שמש (sunshade) מותקן מבפנים ומפחית את חדירת החום ב-40-60%, מגן על הנוסעים ומפחית את העומס על המזגן — מה שחוסך בטווח הנסיעה.',
      },
      {
        question: 'מה עלות משלוח אביזרים לישראל?',
        answer:
          'רוב האביזרים שאנו ממליצים עליהם מציעים משלוח חינם לישראל. זמן ההגעה הממוצע הוא 2-4 שבועות. במקרים מסוימים, ייתכן חיוב מכס על הזמנות מעל 75 דולר — כדאי לבדוק את הערך הכולל של ההזמנה.',
      },
    ],
    relatedLinks: [
      { href: '/brand/tesla', label: 'כל המוצרים לטסלה' },
      { href: '/by-model/tesla-model-3', label: 'אביזרים לטסלה Model 3' },
      {
        href: '/blog/home-charging-guide-israel',
        label: 'מדריך טעינה ביתית',
      },
    ],
  },
  'mg4': {
    brandSlug: 'mg',
    model: 'MG4',
    titleHe: 'אביזרים ל-MG4 | שטיחים, מגני מסך ואביזרי פנים',
    descriptionHe:
      'אביזרים מומלצים ל-MG4 החשמלית — שטיחים תפורים, מגני מסך, מארגנים ועוד.',
    introContent:
      'ה-MG4 היא האצ\'בק החשמלית שהפכה ללהיט בישראל בזכות מחיר כניסה אטרקטיבי, עיצוב ספורטיבי ומפרט עשיר. עם טווח של עד 450 ק"מ (גרסת Extended Range), הנעה אחורית שמספקת חוויית נהיגה מהנה ומערכת מולטימדיה עם מסך 10.25 אינץ\' — היא מציעה ערך מעולה לכסף.\n\nלמרות שה-MG4 היא רכב חדש יחסית בשוק, כבר קיים מגוון רחב של אביזרים מותאמים לדגם. שטיחי TPE תפורים, מגן מסך למסך המרכזי, מארגן לתא המטען ותאורת פנים LED — כל אלה ישדרגו את חוויית השימוש בצורה משמעותית.\n\nריכזנו עבורכם את האביזרים הנמכרים ביותר ל-MG4, כולם עם דירוגים גבוהים ותאימות מאומתת.',
    howToChoose:
      'בבחירת אביזרים ל-MG4, חשוב לשים לב לגרסה שלכם — Standard Range או Extended Range. למרות שרוב אביזרי הפנים זהים, ייתכנו הבדלים קטנים. תא המטען של ה-MG4 מציע 363 ליטר, ולכן מארגן תא מטען קומפקטי יעזור למקסם את השימוש בחלל הזמין. מגן מסך למסך ה-10.25 אינץ\' הוא השקעה קטנה ששומרת על המסך נקי ומוגן. אם אתם מחפשים שדרוג אסתטי, תאורת פנים LED בצבעים ניתנים לשינוי תוסיף אווירה נעימה לרכב.',
    faqs: [
      {
        question: 'אילו אביזרים זמינים ל-MG4?',
        answer:
          'ל-MG4 זמינים שטיחים תפורים מ-TPE, מגני מסך לנווטן ולמסך המרכזי, מארגני תא מטען, כיסויי מושבים, תאורת פנים LED, מגני סף דלתות, מחזיקי טלפון מותאמים ועוד. המגוון הולך וגדל ככל שהדגם נהיה פופולרי יותר.',
      },
      {
        question: 'האם ל-MG4 יש תא מטען קדמי?',
        answer:
          'לא, ל-MG4 אין תא מטען קדמי (פראנק). המנוע החשמלי ממוקם בציר האחורי, ותא המנוע הקדמי מכיל רכיבי חשמל ובקרה. תא המטען האחורי מציע 363 ליטר, וניתן להגדילו ל-1,177 ליטר עם קיפול המושבים האחוריים.',
      },
      {
        question: 'האם MG4 תומכת בטעינה מהירה?',
        answer:
          'כן, MG4 תומכת בטעינה מהירה DC בהספק עד 135 קילוואט (גרסת Extended Range), מה שמאפשר טעינה מ-10% ל-80% בכ-35 דקות. גרסת Standard Range תומכת בעד 117 קילוואט. לטעינה ביתית, הרכב תומך בטעינת AC עד 11 קילוואט בחיבור תלת-פאזי.',
      },
      {
        question: 'מגן מסך ל-MG4 — מה מומלץ?',
        answer:
          'מומלץ לרכוש מגן מסך מזכוכית מחוסמת (9H) בגודל מותאם למסך ה-10.25 אינץ\' של ה-MG4. מגן מסך טוב יגן מפני שריטות, יפחית השתקפויות שמש ויקל על ניקוי טביעות אצבע. ודאו שהמוצר ספציפי ל-MG4 ולא גנרי.',
      },
      {
        question: 'כמה עולים אביזרים ל-MG4?',
        answer:
          'המחירים משתנים: שטיחי TPE תפורים עולים בין 100-200 שקלים, מגן מסך 30-60 שקלים, מארגן תא מטען 80-150 שקלים, ותאורת פנים LED 50-120 שקלים. באתר שלנו תמצאו את המחירים המעודכנים — הם נמוכים משמעותית ממה שתמצאו בחנויות פיזיות בישראל.',
      },
    ],
    relatedLinks: [
      { href: '/brand/mg', label: 'כל המוצרים ל-MG' },
      {
        href: '/blog/home-charging-guide-israel',
        label: 'מדריך טעינה ביתית',
      },
      { href: '/compare/chargers', label: 'השוואת מטענים' },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(MODEL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const modelData = MODEL_PAGES[slug];
  if (!modelData) return {};

  return {
    title: modelData.titleHe,
    description: modelData.descriptionHe,
  };
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

export default async function ModelPage({ params }: PageProps) {
  const { slug } = await params;
  const modelData = MODEL_PAGES[slug];
  if (!modelData) notFound();

  const brand = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, modelData.brandSlug))
    .limit(1);

  const brandProducts = await db
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
        brand[0] ? eq(products.brandId, brand[0].id) : undefined
      )
    )
    .orderBy(desc(products.totalOrders))
    .limit(12);

  const productList: ProductDisplay[] = brandProducts.map(mapToDisplay);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `אביזרים ל-${modelData.model}`,
    numberOfItems: productList.length,
    itemListElement: productList.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${siteUrl}/p/${p.slug}`,
      name: p.title,
    })),
  };

  const brandNameHe = brand[0]?.nameHe ?? modelData.brandSlug;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: brandNameHe, href: `/brand/${modelData.brandSlug}` },
          { label: `אביזרים ל-${modelData.model}` },
        ]}
      />

      {/* H1 + Intro */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          אביזרים ל-{modelData.model}
        </h1>
        <div className="prose prose-sm max-w-3xl text-muted leading-relaxed space-y-4">
          {modelData.introContent.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* How to choose */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">
          איך לבחור אביזרים ל-{modelData.model}?
        </h2>
        <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
        <div className="bg-white rounded-xl border border-border/50 p-6 text-sm text-muted leading-relaxed max-w-3xl">
          <p>{modelData.howToChoose}</p>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="mb-8">
        <AffiliateDisclosure variant="banner" />
      </div>

      {/* Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">
          אביזרים מומלצים ל-{modelData.model}
        </h2>
        <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
        <ProductGrid
          products={productList}
          emptyMessage={`עדיין אין מוצרים ל-${modelData.model}`}
        />
      </section>

      {/* Lead Capture */}
      <LeadCaptureInline source={`by-model-${slug}`} />

      {/* FAQ */}
      <section className="mb-12">
        <FAQSection
          items={modelData.faqs}
          title={`שאלות נפוצות על אביזרים ל-${modelData.model}`}
        />
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">קישורים שימושיים</h2>
        <div className="h-1 w-12 bg-gradient-to-l from-blue-500 to-cyan-400 rounded-full mb-6" />
        <div className="flex flex-wrap gap-3">
          {modelData.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 bg-white rounded-xl border border-border/50 px-5 py-3 text-sm font-medium hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
