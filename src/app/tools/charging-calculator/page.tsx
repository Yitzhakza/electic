import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import FAQSection from '@/components/FAQSection';
import LeadCaptureInline from '@/components/lead/LeadCaptureInline';
import AffiliateDisclosure from '@/components/AffiliateDisclosure';
import ChargingCalculator from '@/components/tools/ChargingCalculator';

export const metadata: Metadata = {
  title: 'מחשבון עלות טעינה לרכב חשמלי',
  description:
    'חשבו כמה עולה לטעון רכב חשמלי בישראל — מחשבון אינטראקטיבי לפי דגם רכב, תעריף חשמל ונסיעה חודשית. השוואת עלויות מול דלק וחיסכון שנתי.',
};

const calculatorFaqs = [
  {
    question: 'איך מתבצע החישוב?',
    answer:
      'החישוב מבוסס על שלושה נתונים: צריכת האנרגיה של הרכב (קוט"ש/100 ק"מ), כמות הנסיעה החודשית (ק"מ), ותעריף החשמל (₪/קוט"ש). הנוסחה: (נסיעה חודשית × צריכת אנרגיה / 100) × תעריף חשמל = עלות חודשית. להשוואה מול דלק, אנחנו מניחים צריכת דלק ממוצעת של 8 ליטר/100 ק"מ לרכב בנזין.',
  },
  {
    question: 'מה תעריף החשמל הממוצע בישראל?',
    answer:
      'בישראל יש מספר תעריפי חשמל רלוונטיים לטעינת רכב חשמלי: תעריף ביתי רגיל — כ-0.65 ₪/קוט"ש, תעריף לילה (עידוד שימוש) — כ-0.35 ₪/קוט"ש (בשעות 23:00-07:00), ותעריף עמדות טעינה ציבוריות — בין 1.50 ל-3.00 ₪/קוט"ש בהתאם לרשת ולהספק. הטעינה הזולה ביותר היא בלילה בבית, ולכן רוב בעלי הרכבים החשמליים מתזמנים את הטעינה לשעות הלילה.',
  },
  {
    question: 'כמה עולה לטעון רכב חשמלי בחודש?',
    answer:
      'העלות תלויה בכמות הנסיעה ובתעריף החשמל. לנסיעה ממוצעת של כ-1,500 ק"מ בחודש בתעריף ביתי (0.65 ₪/קוט"ש), עלות הטעינה נעה בין 65 ל-100 ₪ בחודש, תלוי בדגם הרכב. בתעריף לילה (0.35 ₪/קוט"ש) העלות יורדת ל-35-55 ₪ בלבד. השתמשו במחשבון למעלה כדי לחשב את העלות המדויקת לרכב ולנסיעה שלכם.',
  },
  {
    question: 'האם באמת חוסכים עם רכב חשמלי לעומת דלק?',
    answer:
      'בהחלט. עלות הנסיעה ברכב חשמלי זולה ב-70% עד 80% לעומת רכב בנזין. לדוגמה: נסיעה של 1,500 ק"מ בחודש עולה כ-80 ₪ בחשמל לעומת כ-900 ₪ בדלק — חיסכון של מעל 800 ₪ בחודש, או כ-10,000 ₪ בשנה. החיסכון משמעותי עוד יותר כשטוענים בתעריף לילה.',
  },
];

export default function ChargingCalculatorPage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ev-shop.co.il';

  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'מחשבון עלות טעינה לרכב חשמלי',
    description:
      'מחשבון אינטראקטיבי לחישוב עלות טעינה חודשית ושנתית לרכב חשמלי בישראל, כולל השוואה מול דלק',
    url: `${siteUrl}/tools/charging-calculator`,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    inLanguage: 'he',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ILS',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: 'כלים' },
          { label: 'מחשבון עלות טעינה' },
        ]}
      />

      {/* H1 + Intro */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          מחשבון עלות טעינה לרכב חשמלי
        </h1>
        <p className="text-muted leading-relaxed max-w-3xl">
          כמה עולה לטעון רכב חשמלי בישראל? השתמשו במחשבון האינטראקטיבי שלנו כדי
          לחשב את עלות הטעינה החודשית והשנתית בהתאם לדגם הרכב שלכם, כמות
          הנסיעה ותעריף החשמל. גלו כמה תחסכו בהשוואה לדלק.
        </p>
      </div>

      {/* Calculator */}
      <section className="mb-12">
        <ChargingCalculator />
      </section>

      {/* Info Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2">
          על מה מבוסס החישוב?
        </h2>
        <div className="h-1 w-12 bg-gradient-to-l from-yellow-500 to-amber-400 rounded-full mb-6" />

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">צריכת אנרגיה</h3>
            <p className="text-sm text-muted leading-relaxed">
              כל רכב חשמלי צורך כמות אנרגיה שונה, הנמדדת בקוט&quot;ש/100
              ק&quot;מ. רכבים קומפקטיים כמו Tesla Model 3 צורכים כ-14.5
              קוט&quot;ש, בעוד רכבי שטח כמו Ioniq 5 צורכים כ-18 קוט&quot;ש.
              המחשבון כולל נתוני צריכה של הדגמים הנפוצים בישראל.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">תעריפי חשמל</h3>
            <p className="text-sm text-muted leading-relaxed">
              בישראל קיימים מספר תעריפי חשמל. התעריף הביתי הרגיל הוא כ-0.65
              &#8362;/קוט&quot;ש. תעריף עידוד שימוש בלילה (23:00-07:00) הוא
              כ-0.35 &#8362;/קוט&quot;ש בלבד. בעמדות ציבוריות המחיר גבוה
              משמעותית — כ-2.50 &#8362;/קוט&quot;ש.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-3">השוואה לדלק</h3>
            <p className="text-sm text-muted leading-relaxed">
              להשוואה הוגנת, אנחנו משתמשים בצריכת דלק ממוצעת של 8 ליטר/100
              ק&quot;מ — הערך הממוצע לרכב בנזין בישראל. מחיר הדלק ברירת המחדל
              הוא 7.50 &#8362; לליטר, ואפשר לעדכן אותו בהתאם למחיר העדכני.
            </p>
          </div>
        </div>
      </section>

      {/* Affiliate Disclosure */}
      <div className="mb-8">
        <AffiliateDisclosure variant="banner" />
      </div>

      {/* Lead Capture */}
      <LeadCaptureInline source="charging-calculator" />

      {/* FAQ */}
      <section className="mb-12">
        <FAQSection
          items={calculatorFaqs}
          title="שאלות נפוצות על עלות טעינה"
        />
      </section>
    </div>
  );
}
