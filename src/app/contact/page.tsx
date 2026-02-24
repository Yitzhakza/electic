import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'צור קשר',
  description: 'צרו קשר עם צוות EV אביזרים.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'צור קשר' }]} />

      <h1 className="text-3xl font-bold mb-6">צור קשר</h1>

      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          נשמח לשמוע מכם! אם יש לכם שאלות, הצעות או בעיות, אל תהססו לפנות אלינו.
        </p>

        <div className="bg-white rounded-xl border border-border p-6 space-y-4">
          <div>
            <h2 className="font-medium mb-1">דוא&quot;ל</h2>
            <a
              href={`mailto:${process.env.ADMIN_EMAIL ?? 'contact@ev-shop.co.il'}`}
              className="text-primary hover:underline"
            >
              {process.env.ADMIN_EMAIL ?? 'contact@ev-shop.co.il'}
            </a>
          </div>

          <div>
            <h2 className="font-medium mb-1">זמני תגובה</h2>
            <p className="text-sm text-muted">אנו משתדלים להשיב לכל פנייה תוך 48 שעות.</p>
          </div>
        </div>

        <p className="text-sm text-muted mt-4">
          שימו לב: אנחנו לא מוכרים מוצרים ישירות. כל המוצרים נמכרים דרך AliExpress.
          לשאלות בנושא הזמנה, משלוח או החזרה, אנא פנו ישירות למוכר ב-AliExpress.
        </p>
      </div>
    </div>
  );
}
