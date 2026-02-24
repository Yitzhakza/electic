'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import MobileMenu from './MobileMenu';
import { BRANDS, ACCESSORY_CATEGORIES } from '@/lib/constants';

const topBrands = BRANDS.slice(0, 8);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-bold text-primary hidden sm:block">EV אביזרים</span>
          </Link>

          <SearchBar className="flex-1 max-w-lg" />

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/all-vehicles" className="text-muted hover:text-primary transition-colors">
              כל הרכבים
            </Link>
            <div className="relative group">
              <span className="text-muted hover:text-primary transition-colors cursor-pointer">
                קטגוריות
              </span>
              <div className="absolute start-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-white rounded-xl shadow-lg border border-border p-2 min-w-48">
                  {ACCESSORY_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      {cat.nameHe}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/coupons" className="text-muted hover:text-primary transition-colors">
              קופונים
            </Link>
            <Link href="/about" className="text-muted hover:text-primary transition-colors">
              אודות
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-muted hover:text-primary cursor-pointer"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Brand nav */}
        <nav className="hidden md:flex items-center gap-1 h-10 overflow-x-auto text-sm">
          {topBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="px-3 py-1.5 rounded-lg text-muted hover:text-primary hover:bg-primary/5 transition-colors whitespace-nowrap"
            >
              {brand.nameHe}
            </Link>
          ))}
          <Link
            href="/all-vehicles"
            className="px-3 py-1.5 rounded-lg text-primary font-medium hover:bg-primary/5 transition-colors whitespace-nowrap"
          >
            עוד &larr;
          </Link>
        </nav>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
