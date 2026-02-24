import Link from 'next/link';
import { BRANDS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-primary text-white/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <div className="h-9 w-9 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              EV Shop
            </h3>
            <p className="text-sm leading-relaxed">
              האתר המוביל בישראל לאביזרים לרכבים חשמליים.
              מוצרים נבחרים, מחירים משתלמים, משלוח לישראל.
            </p>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-white font-semibold mb-4">מותגים מובילים</h3>
            <ul className="space-y-1.5 text-sm">
              {BRANDS.slice(0, 7).map((brand) => (
                <li key={brand.slug}>
                  <Link href={`/brand/${brand.slug}`} className="text-white/50 hover:text-white transition-colors">
                    {brand.nameHe}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">קישורים</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/all-vehicles" className="text-white/50 hover:text-white transition-colors">
                  כל הרכבים
                </Link>
              </li>
              <li>
                <Link href="/coupons" className="text-white/50 hover:text-white transition-colors">
                  קופונים
                </Link>
              </li>
              <li>
                <Link href="/compare/chargers" className="text-white/50 hover:text-white transition-colors">
                  השוואת מטענים
                </Link>
              </li>
              <li>
                <Link href="/tools/charging-calculator" className="text-white/50 hover:text-white transition-colors">
                  מחשבון טעינה
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/50 hover:text-white transition-colors">
                  מדריכים
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/50 hover:text-white transition-colors">
                  אודות
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors">
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">מידע משפטי</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/privacy" className="text-white/50 hover:text-white transition-colors">
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link href="/disclosure" className="text-white/50 hover:text-white transition-colors">
                  גילוי נאות אפילייט
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 mt-12 pt-10 text-center">
          <h3 className="text-white font-bold mb-2">קבלו עדכונים על דילים חדשים</h3>
          <p className="text-white/50 text-sm mb-4">הרשמו וקבלו הנחות בלעדיות ומוצרים חדשים ישירות למייל.</p>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-white/30">
          <p>
            &copy; {new Date().getFullYear()} EV Shop. כל הזכויות שמורות.
          </p>
          <p className="mt-1">
            אתר זה מכיל קישורי אפילייט. לפרטים נוספים ראו את{' '}
            <Link href="/disclosure" className="underline hover:text-white/50">
              עמוד הגילוי הנאות
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
