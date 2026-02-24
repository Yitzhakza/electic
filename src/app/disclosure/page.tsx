import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'גילוי נאות אפילייט',
  description: 'גילוי נאות על קישורי אפילייט באתר EV Shop.',
};

export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: 'ראשי', href: '/' }, { label: 'גילוי נאות' }]} />

      <h1 className="text-3xl font-bold mb-6">גילוי נאות - קישורי אפילייט</h1>

      <div className="prose prose-lg max-w-none space-y-4 text-gray-700 leading-relaxed">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <p className="font-medium text-blue-800">
            שקיפות מלאה: אתר זה מכיל קישורי אפילייט (שותפים). המשמעות היא שאם תרכשו
            מוצר דרך הקישורים שלנו, אנו עשויים לקבל עמלה קטנה מ-AliExpress - ללא
            עלות נוספת מצדכם.
          </p>
        </div>

        <h2 className="text-xl font-bold mt-6">מה זה קישור אפילייט?</h2>
        <p>
          קישור אפילייט הוא קישור מעקב ייחודי שמאפשר לנו לקבל עמלה כאשר אתם
          מבצעים רכישה דרכו. המחיר שתשלמו זהה לחלוטין למחיר שהייתם משלמים
          בכניסה ישירה לאתר.
        </p>

        <h2 className="text-xl font-bold mt-6">איך זה משפיע עליכם?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>המחיר לא משתנה</strong> - אתם משלמים את אותו מחיר בדיוק
          </li>
          <li>
            <strong>שקיפות מלאה</strong> - כל הקישורים שלנו הם קישורי אפילייט
          </li>
          <li>
            <strong>המלצות כנות</strong> - אנו מציגים מוצרים שאנו מאמינים שיתאימו לכם
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-6">למה אנו משתמשים בקישורי אפילייט?</h2>
        <p>
          העמלות שאנו מקבלים מאפשרות לנו לתחזק את האתר, לעדכן מוצרים באופן יומי,
          ולספק לכם שירות חינמי ואיכותי. ללא תמיכה זו, לא היינו יכולים להציע
          את השירות הזה.
        </p>

        <h2 className="text-xl font-bold mt-6">השותף שלנו</h2>
        <p>
          אנו שותפים (affiliate) של AliExpress. כל המוצרים המוצגים באתר
          נמכרים ב-AliExpress על ידי מוכרים שונים.
        </p>
      </div>
    </div>
  );
}
