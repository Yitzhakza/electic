'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    return `${baseUrl}?${params.toString()}`;
  };

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav dir="ltr" className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={getUrl(currentPage - 1)}
          className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-gray-50"
        >
          &laquo;
        </Link>
      )}
      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-2 text-muted">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={getUrl(page)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              page === currentPage
                ? 'bg-primary text-white border-primary'
                : 'border-border hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={getUrl(currentPage + 1)}
          className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-gray-50"
        >
          &raquo;
        </Link>
      )}
    </nav>
  );
}
