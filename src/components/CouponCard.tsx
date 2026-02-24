'use client';

import { useState } from 'react';

interface CouponCardProps {
  promoNameHe: string | null;
  couponCode: string | null;
  discountValue: string | null;
  minSpend: string | null;
  endDate: Date | string | null;
  promotionUrl: string | null;
}

export default function CouponCard({
  promoNameHe,
  couponCode,
  discountValue,
  minSpend,
  endDate,
  promotionUrl,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!couponCode) return;
    await navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = endDate
    ? new Date(endDate).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-success/30 p-5 hover:border-success/50 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-bold text-text">{promoNameHe || 'מבצע מיוחד'}</h3>
          {discountValue && (
            <span className="text-lg font-bold text-success">{discountValue}</span>
          )}
        </div>
        <div className="bg-success-light text-success text-xs font-medium px-2 py-1 rounded-full shrink-0">
          פעיל
        </div>
      </div>

      {minSpend && (
        <p className="text-sm text-muted mb-2">מינימום הזמנה: {minSpend}</p>
      )}
      {formattedDate && (
        <p className="text-sm text-muted mb-3">בתוקף עד: {formattedDate}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {couponCode && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-success/40 bg-success-light/50 px-4 py-2 text-sm font-medium text-success transition-colors hover:bg-success-light cursor-pointer"
            title="לחץ להעתקה"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="font-mono tracking-wide">{couponCode}</span>
            {copied && <span className="text-xs text-success">הועתק!</span>}
          </button>
        )}
        {promotionUrl && (
          <a
            href={promotionUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
          >
            לדף המבצע
            <svg className="h-3 w-3 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
