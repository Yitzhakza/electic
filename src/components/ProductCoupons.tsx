'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { GeneralCoupon } from '@/lib/aliexpress/general-coupons';
import type { PlatformCoupon } from '@/types';

interface ProductCouponsProps {
  priceUsd: number;
  couponCode: string | null;
  couponDiscount: string | null;
  couponMinSpend: string | null;
  couponExpiry: Date | string | null;
  bestMatch: GeneralCoupon | null;
  nextTier: GeneralCoupon | null;
  allApplicable: GeneralCoupon[];
  platformCoupons: PlatformCoupon[];
  monthNameHe: string;
  validUntil: string;
}

export default function ProductCoupons({
  priceUsd,
  couponCode,
  couponDiscount,
  couponMinSpend,
  couponExpiry,
  bestMatch,
  nextTier,
  allApplicable,
  platformCoupons,
  monthNameHe,
  validUntil,
}: ProductCouponsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  const hasCoupons = couponCode || bestMatch || platformCoupons.length > 0 || priceUsd > 0;
  if (!hasCoupons) return null;

  const extraDiff = nextTier ? (nextTier.minSpend - priceUsd).toFixed(0) : null;

  return (
    <div className="space-y-3">
      {/* Product-specific coupon */}
      {couponCode && (
        <div className="bg-success-light/50 rounded-xl p-4 border border-success/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-success text-sm">קופון למוצר זה</span>
            {couponDiscount && (
              <span className="text-sm font-bold text-success">חיסכון: {couponDiscount}</span>
            )}
          </div>
          <button
            onClick={() => handleCopy(couponCode)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-success/40 bg-white px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success-light/50 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-mono tracking-wide">{couponCode}</span>
            {copiedCode === couponCode && <span className="text-xs text-success">הועתק!</span>}
          </button>
          <div className="flex gap-4 mt-2 text-xs text-success">
            {couponMinSpend && <span>מינימום: {couponMinSpend}</span>}
            {couponExpiry && <span>עד: {formatDate(couponExpiry)}</span>}
          </div>
        </div>
      )}

      {/* General coupons matched by price */}
      {bestMatch && (
        <div className="bg-surface-alt rounded-xl border border-border/60 overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
              קופון אליאקספרס — {monthNameHe}
            </div>
            <Link href="/coupons" className="text-white/80 text-xs hover:text-white transition-colors">
              כל הקופונים &larr;
            </Link>
          </div>

          <div className="p-4 space-y-3">
            {/* Best match coupon - highlighted */}
            <div className="flex items-center justify-between gap-3 bg-white rounded-xl p-3 border-2 border-dashed border-cta/40 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-cta/10 text-cta-dark text-xs font-bold px-2 py-0.5 rounded-full">מומלץ</span>
                  <span className="text-lg font-bold text-cta-dark">${bestMatch.discount} הנחה</span>
                </div>
                <p className="text-xs text-muted">
                  בהזמנה מעל ${bestMatch.minSpend}
                </p>
              </div>
              <button
                onClick={() => handleCopy(bestMatch.code)}
                className="shrink-0 flex items-center gap-2 bg-cta/5 border-2 border-dashed border-cta/40 rounded-lg px-3 py-2 text-sm font-bold text-cta-dark hover:bg-cta/10 transition-colors cursor-pointer active:scale-[0.98]"
              >
                {copiedCode === bestMatch.code ? (
                  <>
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-success">הועתק!</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span className="font-mono tracking-widest">{bestMatch.code}</span>
                  </>
                )}
              </button>
            </div>

            {/* Next tier suggestion */}
            {nextTier && extraDiff && (
              <div className="flex items-center gap-2 bg-cta/5 rounded-lg p-2.5 border border-cta/20 text-xs">
                <svg className="h-4 w-4 text-cta-dark shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-text-secondary">
                  הוסיפו עוד <strong>${extraDiff}</strong> לעגלה וקבלו <strong>${nextTier.discount} הנחה</strong> עם הקופון{' '}
                  <button
                    onClick={() => handleCopy(nextTier.code)}
                    className="font-mono font-bold text-cta-dark underline decoration-dashed cursor-pointer"
                  >
                    {copiedCode === nextTier.code ? 'הועתק!' : nextTier.code}
                  </button>
                </span>
              </div>
            )}

            {/* Show all applicable coupons */}
            {allApplicable.length > 1 && (
              <>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-cta-dark hover:text-primary font-medium cursor-pointer flex items-center gap-1"
                >
                  <svg className={`h-3 w-3 transition-transform ${showAll ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {showAll ? 'הסתר' : `עוד ${allApplicable.length - 1} קופונים מתאימים`}
                </button>

                {showAll && (
                  <div className="space-y-1.5">
                    {allApplicable
                      .filter((c) => c.code !== bestMatch.code)
                      .reverse()
                      .map((coupon) => (
                        <div
                          key={coupon.code}
                          className="flex items-center justify-between gap-2 bg-white rounded-lg p-2 border border-border/60 text-sm"
                        >
                          <span className="text-muted">
                            ${coupon.discount} הנחה (מעל ${coupon.minSpend})
                          </span>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="shrink-0 font-mono text-xs bg-cta/5 border border-cta/20 rounded px-2 py-1 text-cta-dark hover:bg-cta/10 cursor-pointer"
                          >
                            {copiedCode === coupon.code ? 'הועתק!' : coupon.code}
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}

            {/* Validity note */}
            <p className="text-[11px] text-muted/70 pt-1">
              בתוקף עד {validUntil} &middot; העתיקו והדביקו בעמוד התשלום
            </p>
          </div>
        </div>
      )}

      {/* Price below minimum - show first tier as suggestion */}
      {!bestMatch && priceUsd > 0 && (
        <div className="bg-cta/5 rounded-xl p-4 border border-cta/20">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 text-cta-dark shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-text-secondary">
              הזמינו מעל $15 וקבלו $2 הנחה!{' '}
              <Link href="/coupons" className="underline font-medium">
                לכל הקופונים
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* Platform coupons */}
      {platformCoupons.length > 0 && (
        <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
          <p className="font-medium text-primary text-sm mb-3">מבצעים נוספים באליאקספרס</p>
          <div className="space-y-2">
            {platformCoupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between gap-2 bg-white rounded-lg p-2 border border-accent/10">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{coupon.promoNameHe || coupon.promoName}</p>
                  <div className="flex gap-2 text-xs text-muted">
                    {coupon.discountValue && <span>{coupon.discountValue}</span>}
                    {coupon.minSpend && <span>מינימום: {coupon.minSpend}</span>}
                  </div>
                </div>
                {coupon.couponCode ? (
                  <button
                    onClick={() => handleCopy(coupon.couponCode!)}
                    className="shrink-0 text-xs font-mono bg-accent/5 border border-accent/20 rounded px-2 py-1 text-accent-dark hover:bg-accent/10 cursor-pointer"
                  >
                    {copiedCode === coupon.couponCode ? 'הועתק!' : coupon.couponCode}
                  </button>
                ) : coupon.promotionUrl ? (
                  <a
                    href={coupon.promotionUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="shrink-0 text-xs bg-accent text-white rounded px-3 py-1 hover:bg-accent-dark"
                  >
                    למבצע
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
