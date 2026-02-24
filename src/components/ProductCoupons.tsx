'use client';

import { useState } from 'react';
import type { PlatformCoupon } from '@/types';

interface ProductCouponsProps {
  couponCode: string | null;
  couponDiscount: string | null;
  couponMinSpend: string | null;
  couponExpiry: Date | string | null;
  platformCoupons: PlatformCoupon[];
}

export default function ProductCoupons({
  couponCode,
  couponDiscount,
  couponMinSpend,
  couponExpiry,
  platformCoupons,
}: ProductCouponsProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
  };

  const hasCoupons = couponCode || platformCoupons.length > 0;
  if (!hasCoupons) return null;

  return (
    <div className="space-y-3">
      {/* Product-specific coupon */}
      {couponCode && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-green-800 text-sm">קופון למוצר זה</span>
            {couponDiscount && (
              <span className="text-sm font-bold text-green-700">חיסכון: {couponDiscount}</span>
            )}
          </div>
          <button
            onClick={() => handleCopy(couponCode)}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-green-400 bg-white px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-mono tracking-wide">{couponCode}</span>
            {copiedCode === couponCode && <span className="text-xs text-green-600">הועתק!</span>}
          </button>
          <div className="flex gap-4 mt-2 text-xs text-green-600">
            {couponMinSpend && <span>מינימום: {couponMinSpend}</span>}
            {couponExpiry && <span>עד: {formatDate(couponExpiry)}</span>}
          </div>
        </div>
      )}

      {/* Platform coupons */}
      {platformCoupons.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="font-medium text-blue-800 text-sm mb-3">קופונים כלליים באליאקספרס</p>
          <div className="space-y-2">
            {platformCoupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between gap-2 bg-white rounded-lg p-2 border border-blue-100">
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
                    className="shrink-0 text-xs font-mono bg-blue-50 border border-blue-200 rounded px-2 py-1 text-blue-700 hover:bg-blue-100 cursor-pointer"
                  >
                    {copiedCode === coupon.couponCode ? 'הועתק!' : coupon.couponCode}
                  </button>
                ) : coupon.promotionUrl ? (
                  <a
                    href={coupon.promotionUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="shrink-0 text-xs bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
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
