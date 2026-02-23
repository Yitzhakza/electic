'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ACCESSORY_CATEGORIES } from '@/lib/constants';

interface FilterSidebarProps {
  basePath: string;
  brands?: Array<{ slug: string; nameHe: string }>;
}

export default function FilterSidebar({ basePath, brands }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') ?? '';
  const currentBrand = searchParams.get('brand') ?? '';
  const currentSort = searchParams.get('sort') ?? '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <aside className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-medium text-sm mb-2">מיון</h3>
        <select
          value={currentSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">מומלצים</option>
          <option value="price_asc">מחיר: מהנמוך לגבוה</option>
          <option value="price_desc">מחיר: מהגבוה לנמוך</option>
          <option value="orders">הכי נמכרים</option>
          <option value="rating">דירוג</option>
        </select>
      </div>

      {/* Category filter */}
      <div>
        <h3 className="font-medium text-sm mb-2">קטגוריה</h3>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`block w-full text-start px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
              !currentCategory ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'
            }`}
          >
            הכל
          </button>
          {ACCESSORY_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => updateParam('category', cat.slug)}
              className={`block w-full text-start px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                currentCategory === cat.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'
              }`}
            >
              {cat.nameHe}
            </button>
          ))}
        </div>
      </div>

      {/* Brand filter (when showing all vehicles) */}
      {brands && brands.length > 0 && (
        <div>
          <h3 className="font-medium text-sm mb-2">מותג</h3>
          <div className="space-y-1">
            <button
              onClick={() => updateParam('brand', '')}
              className={`block w-full text-start px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                !currentBrand ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'
              }`}
            >
              הכל
            </button>
            {brands.map((brand) => (
              <button
                key={brand.slug}
                onClick={() => updateParam('brand', brand.slug)}
                className={`block w-full text-start px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  currentBrand === brand.slug ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-50'
                }`}
              >
                {brand.nameHe}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
