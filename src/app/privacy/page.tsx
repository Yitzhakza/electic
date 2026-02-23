import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות',
  description: 'מדיניות הפרטיות של אתר EV אביזרים.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'מדיניות פרטיות' }]} />

      <h1 className="text-3xl font-bold mb-6">מדיניות פרטיות</h1>

      <div className="prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>עדכון אחרון: פברואר 2026</p>

        <h2 className="text-xl font-bold mt-6">מידע שאנו אוספים</h2>
        <p>
          אנו אוספים מידע מינימלי הנדרש לתפעול האתר, כולל:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>נתוני גלישה אנונימיים (Google Analytics)</li>
          <li>כתובת IP לצורך אבטחה</li>
          <li>Cookies לשיפור חוויית הגלישה</li>
        </ul>

        <h2 className="text-xl font-bold mt-6">שימוש במידע</h2>
        <p>
          המידע שנאסף משמש אך ורק לשיפור חוויית הגלישה באתר ולצורך ניתוח סטטיסטי.
          אנו לא מוכרים ולא משתפים מידע אישי עם צדדים שלישיים.
        </p>

        <h2 className="text-xl font-bold mt-6">קישורים חיצוניים</h2>
        <p>
          אתר זה מכיל קישורים לאתרים חיצוניים, בעיקר ל-AliExpress. לאחר שתעברו
          לאתר חיצוני, מדיניות הפרטיות שלהם היא שחלה. אנו ממליצים לעיין במדיניות
          הפרטיות של כל אתר חיצוני.
        </p>

        <h2 className="text-xl font-bold mt-6">Cookies</h2>
        <p>
          אנו משתמשים ב-Cookies כדי לשפר את חוויית הגלישה. ניתן לנהל את הגדרות
          ה-Cookies דרך הגדרות הדפדפן שלכם.
        </p>

        <h2 className="text-xl font-bold mt-6">יצירת קשר</h2>
        <p>
          לשאלות בנוגע למדיניות הפרטיות, ניתן ליצור קשר דרך{' '}
          <a href="/contact" className="text-primary hover:underline">
            עמוד צור קשר
          </a>
          .
        </p>
      </div>
    </div>
  );
}
