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
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 start-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold text-primary">EV אביזרים</span>
          <button onClick={onClose} className="p-2 text-muted hover:text-primary cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">מותגים</h3>
          <div className="space-y-1 mb-6">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brand/${brand.slug}`}
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {brand.nameHe}
              </Link>
            ))}
          </div>

          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">קטגוריות</h3>
          <div className="space-y-1 mb-6">
            {ACCESSORY_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={onClose}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {cat.nameHe}
              </Link>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-1">
            <Link href="/all-vehicles" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              כל הרכבים
            </Link>
            <Link href="/coupons" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              קופונים
            </Link>
            <Link href="/about" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              אודות
            </Link>
            <Link href="/contact" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              צור קשר
            </Link>
            <Link href="/disclosure" onClick={onClose} className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
              גילוי נאות
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
