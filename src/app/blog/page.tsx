import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מדריכים וכתבות | רכב חשמלי בישראל',
  description: 'מדריכים, השוואות וטיפים לבעלי רכבים חשמליים בישראל. טעינה ביתית, אביזרים מומלצים, ביקורות ועוד.',
};

const ARTICLES = [
  {
    slug: 'home-charging-guide-israel',
    title: 'מדריך טעינה ביתית לרכב חשמלי בישראל 2026',
    excerpt: 'כל מה שצריך לדעת על התקנת עמדת טעינה ביתית — סוגי מטענים, עלויות התקנה, רגולציה ומה ההבדל בין Type 2 ל-Type 1.',
    category: 'טעינה בבית',
  },
  {
    slug: 'monthly-charging-cost-israel',
    title: 'עלות טעינה חודשית לרכב חשמלי בישראל — מחשבון וטבלה',
    excerpt: 'כמה עולה לטעון רכב חשמלי בבית? השוואת עלויות חשמל, תעריפים לפי שעות וטיפים לחיסכון.',
    category: 'עלויות',
  },
  {
    slug: 'ev-insurance-israel',
    title: 'ביטוח לרכב חשמלי בישראל: מה משפיע על המחיר?',
    excerpt: 'מדריך מקיף לביטוח רכב חשמלי — מה המרכיבים, איך להוזיל, ומה ההבדלים מרכב רגיל.',
    category: 'עלויות',
  },
  {
    slug: 'battery-degradation-myths',
    title: 'ירידת קיבולת סוללה ברכב חשמלי: מה אמיתי ומה מיתוס?',
    excerpt: 'האם האקלים בישראל מזיק לסוללה? כמה קיבולת נאבדת אחרי 5 שנים? עובדות מול מיתוסים.',
    category: 'סוללה וירידת ערך',
  },
  {
    slug: 'shared-building-charging',
    title: 'טעינת רכב חשמלי בבניין משותף: ועד בית, אישורים ופתרונות',
    excerpt: 'מדריך מעשי להתקנת עמדת טעינה בחניון משותף — חוקים, אישורים מוועד הבית ופתרונות טכנולוגיים.',
    category: 'טעינה בבית',
  },
  {
    slug: 'public-charging-tips',
    title: 'טעינה ציבורית בישראל: טיפים, אפליקציות וטעויות נפוצות',
    excerpt: 'איך למצוא עמדות טעינה, באילו אפליקציות להשתמש, כמה זה עולה, ומה הטעויות שכולם עושים.',
    category: 'טעינה ציבורית',
  },
];

export default function BlogIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'מדריכים' }]} />
      <h1 className="text-3xl font-bold mb-2">מדריכים וכתבות</h1>
      <p className="text-muted mb-8">טיפים, מדריכים והשוואות לבעלי רכבים חשמליים בישראל</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="bg-white rounded-xl border border-border/40 p-6 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-xs text-accent font-medium mb-2">{article.category}</span>
            <h2 className="font-bold text-lg mb-2 leading-snug text-text">{article.title}</h2>
            <p className="text-sm text-muted flex-1">{article.excerpt}</p>
            <span className="text-sm text-accent font-medium mt-4 hover:underline">&larr; קראו עוד</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
