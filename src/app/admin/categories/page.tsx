'use client';

import { ACCESSORY_CATEGORIES, BRANDS } from '@/lib/constants';
import Card from '@/components/ui/Card';

export default function AdminCategoriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">קטגוריות ומותגים</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">קטגוריות אביזרים</h2>
          <div className="space-y-2">
            {ACCESSORY_CATEGORIES.map((cat) => (
              <Card key={cat.slug} className="p-3">
                <p className="font-medium text-sm">{cat.nameHe}</p>
                <p className="text-xs text-muted">{cat.nameEn} | slug: {cat.slug}</p>
                <p className="text-xs text-muted mt-1">
                  מילות מפתח: {(cat.keywords as unknown as string[]).join(', ')}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">מותגים</h2>
          <div className="space-y-2">
            {BRANDS.map((brand) => (
              <Card key={brand.slug} className="p-3">
                <p className="font-medium text-sm">{brand.nameHe} ({brand.nameEn})</p>
                <p className="text-xs text-muted">slug: {brand.slug}</p>
                <p className="text-xs text-muted mt-1">
                  דגמים: {brand.models.join(', ')}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
