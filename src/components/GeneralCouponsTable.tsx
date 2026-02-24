'use client';

import { useState } from 'react';
import type { GeneralCoupon } from '@/lib/aliexpress/general-coupons';

interface GeneralCouponsTableProps {
  coupons: GeneralCoupon[];
  monthNameHe: string;
  validUntil: string;
}

export default function GeneralCouponsTable({
  coupons,
  monthNameHe,
  validUntil,
}: GeneralCouponsTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            קופונים כלליים — {monthNameHe}
          </h2>
          <p className="text-sm text-muted mt-1">
            בתוקף עד {validUntil} או עד גמר המלאי
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          מתעדכן אוטומטית
        </div>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="group relative bg-white rounded-2xl border-2 border-dashed border-orange-200 hover:border-orange-400 transition-all duration-200 overflow-hidden"
          >
            {/* Discount banner */}
            <div className="bg-gradient-to-l from-orange-500 to-red-500 text-white px-4 py-2.5 flex items-center justify-between">
              <span className="text-lg font-bold">${coupon.discount} הנחה</span>
              <span className="text-xs opacity-80">
                מינימום ${coupon.minSpend}
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Min spend explanation */}
              <p className="text-sm text-muted mb-3">
                בהזמנה מעל <span className="font-semibold text-foreground">${coupon.minSpend}</span>
              </p>

              {/* Copy button */}
              <button
                onClick={() => handleCopy(coupon.code)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition-all hover:bg-orange-100 hover:border-orange-400 cursor-pointer active:scale-[0.98]"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-700">הועתק!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span className="font-mono tracking-widest text-base">{coupon.code}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          איך להשתמש בקופונים?
        </h3>
        <ol className="space-y-2 text-sm text-blue-700 list-decimal list-inside">
          <li>העתיקו את הקופון המתאים לסכום ההזמנה שלכם</li>
          <li>הוסיפו מוצרים לעגלה באליאקספרס</li>
          <li>בעמוד התשלום, הדביקו את הקופון בשדה &quot;הזן קוד קופון&quot;</li>
          <li>ההנחה תופחת אוטומטית מהסכום הסופי</li>
        </ol>
        <div className="mt-3 pt-3 border-t border-blue-200 text-xs text-blue-600 space-y-1">
          <p>* ניתן להשתמש בקופון אחד בלבד להזמנה</p>
          <p>* מומלץ לשלם בדולרים כדי לחסוך בעמלות המרה</p>
        </div>
      </div>
    </div>
  );
}
