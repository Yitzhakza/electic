'use client';

import Link from 'next/link';
import { BRANDS, ACCESSORY_CATEGORIES } from '@/lib/constants';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 start-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-primary">EV Shop</span>
          </div>
          <button onClick={onClose} className="p-2 text-muted hover:text-primary cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CTA Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => {
              (window as any).__openLeadModal?.();
              onClose();
            }}
            className="w-full bg-cta text-primary-dark py-3 rounded-lg font-semibold text-sm cursor-pointer hover:bg-cta-dark transition-colors"
          >
            קבלו מדריך טעינה חינם
          </button>
        </div>

        <nav className="p-4">
          {/* Main nav links */}
          <div className="space-y-1 mb-6">
            <Link
              href="/all-vehicles"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors"
            >
              {/* Grid/squares icon */}
              <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              כל המוצרים
            </Link>
            <Link
              href="/coupons"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors"
            >
              {/* Tag/ticket icon */}
              <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              קופונים
            </Link>
            <Link
              href="/blog"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors"
            >
              {/* Book-open icon */}
              <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              מדריכים
            </Link>
            <Link
              href="/tools/charging-calculator"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors"
            >
              {/* Calculator icon */}
              <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
              </svg>
              מחשבון טעינה
            </Link>
            <Link
              href="/compare/chargers"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors"
            >
              {/* Scale/bars icon */}
              <svg className="h-5 w-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              השוואת מטענים
            </Link>
          </div>

          {/* Brands */}
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">מותגים</h3>
          <div className="grid grid-cols-2 gap-1 mb-6">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brand/${brand.slug}`}
                onClick={onClose}
                className="px-3 py-2 rounded-lg text-sm hover:bg-surface-alt transition-colors"
              >
                {brand.nameHe}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">קטגוריות</h3>
          <div className="space-y-1 mb-6">
            {ACCESSORY_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-surface-alt transition-colors"
              >
                {cat.nameHe}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-1">
            <Link href="/about" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-surface-alt transition-colors">
              אודות
            </Link>
            <Link href="/contact" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-surface-alt transition-colors">
              צור קשר
            </Link>
            <Link href="/disclosure" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-surface-alt transition-colors">
              גילוי נאות
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
