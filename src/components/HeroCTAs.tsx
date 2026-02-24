'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

export default function HeroCTAs() {
  return (
    <div className="flex gap-4 flex-wrap">
      <button
        className="inline-flex items-center gap-2 bg-cta text-primary-dark px-8 py-4 rounded-lg font-semibold text-base hover:bg-cta-dark transition-all duration-200 shadow-lg shadow-cta/20 cursor-pointer"
        onClick={() => {
          trackEvent('guide_download_click', { source: 'hero' });
          (window as any).__openLeadModal?.();
        }}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        קבלו מדריך טעינה חינם
      </button>
      <Link
        href="/all-vehicles"
        className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-lg font-medium text-base hover:bg-white/15 transition-all duration-200"
      >
        לכל המוצרים
        <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
