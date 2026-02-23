'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface AdminProduct {
  id: number;
  aliexpressProductId: string;
  slug: string;
  titleOriginal: string;
  titleHe: string | null;
  price: number;
  totalOrders: number;
  isActive: boolean;
  brandName: string | null;
  categoryName: string | null;
  isHidden: boolean | null;
  titleHeOverride: string | null;
  couponOverride: string | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showHidden, setShowHidden] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (search) params.set('search', search);
    if (showHidden) params.set('hidden', 'true');

    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.data ?? []);
    setTotalPages(data.pagination?.totalPages ?? 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [page, showHidden]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleToggleHide = async (productId: number, currentHidden: boolean) => {
    await fetch(`/api/admin/products/${productId}/override`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHidden: !currentHidden }),
    });
    fetchProducts();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ניהול מוצרים</h1>

      {/* Search */}
      <Card className="p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם מוצר..."
            className="flex-1"
          />
          <Button type="submit" size="sm">חפש</Button>
        </form>
        <label className="flex items-center gap-2 mt-3 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={showHidden}
            onChange={(e) => setShowHidden(e.target.checked)}
            className="rounded"
          />
          הצג מוצרים מוסתרים
        </label>
      </Card>

      {/* Products table */}
      {loading ? (
        <p className="text-muted">טוען...</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <Card
              key={p.id}
              className={`p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
                p.isHidden ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {p.titleHeOverride ?? p.titleHe ?? p.titleOriginal}
                </p>
                <p className="text-xs text-muted">
                  ${p.price.toFixed(2)} | {p.totalOrders} הזמנות
                  {p.brandName && ` | ${p.brandName}`}
                  {p.categoryName && ` | ${p.categoryName}`}
                  {p.couponOverride && ` | קופון: ${p.couponOverride}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="px-3 py-1 rounded text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  ערוך
                </Link>
                <button
                  onClick={() => handleToggleHide(p.id, p.isHidden ?? false)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    p.isHidden
                      ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p.isHidden ? 'הצג' : 'הסתר'}
                </button>
                <Link
                  href={`/p/${p.slug}`}
                  target="_blank"
                  className="px-3 py-1 rounded text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  צפה
                </Link>
              </div>
            </Card>
          ))}
          {products.length === 0 && <p className="text-muted">לא נמצאו מוצרים</p>}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6" dir="ltr">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            &laquo;
          </Button>
          <span className="px-3 py-1.5 text-sm">
            {page} / {totalPages}
          </span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            &raquo;
          </Button>
        </div>
      )}
    </div>
  );
}
