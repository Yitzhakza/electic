'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Override {
  titleHeOverride: string;
  descriptionHeOverride: string;
  couponOverride: string;
  tagsOverride: string[];
  isHidden: boolean;
}

export default function AdminProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [override, setOverride] = useState<Override>({
    titleHeOverride: '',
    descriptionHeOverride: '',
    couponOverride: '',
    tagsOverride: [],
    isHidden: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current product data
    fetch(`/api/admin/products?search=&page=1`)
      .then((r) => r.json())
      .then((data) => {
        const product = data.data?.find((p: { id: number }) => p.id === parseInt(id as string, 10));
        if (product) {
          setOverride({
            titleHeOverride: product.titleHeOverride ?? '',
            descriptionHeOverride: '',
            couponOverride: product.couponOverride ?? '',
            tagsOverride: [],
            isHidden: product.isHidden ?? false,
          });
        }
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    const res = await fetch(`/api/admin/products/${id}/override`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titleHeOverride: override.titleHeOverride || null,
        descriptionHeOverride: override.descriptionHeOverride || null,
        couponOverride: override.couponOverride || null,
        tagsOverride: override.tagsOverride,
        isHidden: override.isHidden,
      }),
    });

    if (res.ok) {
      setMessage('נשמר בהצלחה');
    } else {
      setMessage('שגיאה בשמירה');
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-muted hover:text-primary transition-colors cursor-pointer">
          &rarr; חזרה
        </button>
        <h1 className="text-2xl font-bold">עריכת מוצר #{id}</h1>
      </div>

      <Card className="p-6 space-y-4">
        <Input
          label="כותרת בעברית (Override)"
          value={override.titleHeOverride}
          onChange={(e) => setOverride({ ...override, titleHeOverride: e.target.value })}
          placeholder="השאר ריק לשימוש בכותרת המקורית"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תיאור בעברית (Override)</label>
          <textarea
            value={override.descriptionHeOverride}
            onChange={(e) => setOverride({ ...override, descriptionHeOverride: e.target.value })}
            placeholder="השאר ריק לשימוש בתיאור המקורי"
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none min-h-24"
          />
        </div>

        <Input
          label="קוד קופון (Override)"
          value={override.couponOverride}
          onChange={(e) => setOverride({ ...override, couponOverride: e.target.value })}
          placeholder="קוד קופון ידני"
          dir="ltr"
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={override.isHidden}
            onChange={(e) => setOverride({ ...override, isHidden: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">הסתר מוצר זה מהאתר</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'שומר...' : 'שמור שינויים'}
          </Button>
          {message && (
            <span className={`text-sm ${message.includes('שגיאה') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
