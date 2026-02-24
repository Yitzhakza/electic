'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

export default function HeroCTAs() {
  return (
    <div className="flex justify-center gap-4 flex-wrap">
      <button
        className="inline-flex items-center gap-2 bg-gradient-to-l from-green-600 to-emerald-500 text-white px-8 py-3.5 rounded-xl font-medium hover:from-green-500 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 cursor-pointer"
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
        className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-all"
      >
        לכל המוצרים
        <svg className="h-4 w-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );
}
