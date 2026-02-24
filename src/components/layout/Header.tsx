'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import MobileMenu from './MobileMenu';
import { trackEvent } from '@/lib/analytics';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-primary leading-none">EV Shop</span>
              <span className="text-[10px] text-muted block leading-none mt-0.5">אביזרים לרכבים חשמליים</span>
            </div>
          </Link>

          <SearchBar className="flex-1 max-w-lg" />

          <nav className="hidden lg:flex items-center gap-4 text-sm">
            <Link href="/all-vehicles" className="text-text-secondary hover:text-primary font-medium transition-colors">
              מוצרים
            </Link>
            <Link href="/coupons" className="text-text-secondary hover:text-primary font-medium transition-colors">
              קופונים
            </Link>
            <Link href="/blog" className="text-text-secondary hover:text-primary font-medium transition-colors">
              מדריכים
            </Link>
            <button
              className="bg-cta text-primary-dark font-semibold px-4 py-1.5 rounded-lg text-sm hover:bg-cta-dark transition-colors cursor-pointer"
              onClick={() => {
                trackEvent('guide_download_click', { source: 'header_cta' });
                (window as any).__openLeadModal?.();
              }}
            >
              מדריך חינם
            </button>
          </nav>

          <button
            className="lg:hidden p-2 text-muted hover:text-primary cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
