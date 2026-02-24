import Link from 'next/link';
import { BRANDS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
              <svg className="h-6 w-6 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              EV Shop
            </h3>
            <p className="text-sm leading-relaxed">
              האתר המוביל בישראל לאביזרים לרכבים חשמליים.
              מוצרים נבחרים, מחירים משתלמים, משלוח לישראל.
            </p>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-white font-semibold mb-3">מותגים מובילים</h3>
            <ul className="space-y-1.5 text-sm">
              {BRANDS.slice(0, 7).map((brand) => (
                <li key={brand.slug}>
                  <Link href={`/brand/${brand.slug}`} className="hover:text-white transition-colors">
                    {brand.nameHe}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">קישורים</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/all-vehicles" className="hover:text-white transition-colors">
                  כל הרכבים
                </Link>
              </li>
              <li>
                <Link href="/coupons" className="hover:text-white transition-colors">
                  קופונים
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">מידע משפטי</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="hover:text-white transition-colors">
                  גילוי נאות אפילייט
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 mt-8 pt-8 mb-8 text-center">
          <h3 className="text-white font-bold mb-2">קבלו עדכונים על דילים חדשים</h3>
          <p className="text-gray-400 text-sm mb-4">הרשמו וקבלו הנחות בלעדיות ומוצרים חדשים ישירות למייל.</p>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} EV Shop. כל הזכויות שמורות.
          </p>
          <p className="mt-1">
            אתר זה מכיל קישורי אפילייט. לפרטים נוספים ראו את{' '}
            <Link href="/disclosure" className="underline hover:text-gray-300">
              עמוד הגילוי הנאות
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
