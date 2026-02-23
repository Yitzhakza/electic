import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'אודות',
  description: 'אודות אתר EV אביזרים - האתר המוביל בישראל לאביזרים לרכבים חשמליים.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'אודות' }]} />

      <h1 className="text-3xl font-bold mb-6">אודות EV אביזרים</h1>

      <div className="prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed">
        <p>
          ברוכים הבאים ל-EV אביזרים - האתר המוביל בישראל לאביזרים לרכבים חשמליים.
        </p>
        <p>
          המהפכה החשמלית בישראל צוברת תאוצה, ואנחנו כאן כדי לעזור לכם למצוא את האביזרים
          המושלמים לרכב החשמלי שלכם. בין אם יש לכם טסלה, BYD, MG או כל רכב חשמלי אחר,
          תמצאו אצלנו מגוון רחב של אביזרים - משטיחים ומגני מסך ועד מטענים ומארגני תא מטען.
        </p>
        <p>
          אנחנו סורקים ומעדכנים את המוצרים שלנו באופן יומיומי כדי להבטיח שתמיד תקבלו
          את המחירים הטובים ביותר ואת המוצרים האיכותיים ביותר, עם משלוח ישיר לישראל.
        </p>

        <h2 className="text-xl font-bold mt-8">למה אנחנו?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>עדכון יומי של מוצרים ומחירים</li>
          <li>מיקוד ברכבים חשמליים בלבד</li>
          <li>מוצרים מותאמים לשוק הישראלי</li>
          <li>קופונים והנחות בלעדיות</li>
          <li>מיון לפי מותג ודגם רכב</li>
        </ul>
      </div>
    </div>
  );
}
