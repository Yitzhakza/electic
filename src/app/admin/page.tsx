'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';

interface SyncRun {
  id: number;
  startedAt: string;
  completedAt: string | null;
  status: string;
  totalProducts: number;
  newProducts: number;
  updatedProducts: number;
  errors: string[];
  triggeredBy: string;
}

export default function AdminDashboardPage() {
  const [lastSync, setLastSync] = useState<SyncRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/sync')
      .then((r) => r.json())
      .then((data) => {
        setLastSync(data.data?.[0] ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">לוח בקרה</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <h3 className="text-sm text-muted mb-1">סטטוס סנכרון אחרון</h3>
          {loading ? (
            <p className="text-lg font-medium">טוען...</p>
          ) : lastSync ? (
            <div>
              <p className={`text-lg font-bold ${lastSync.status === 'success' ? 'text-green-600' : lastSync.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
                {lastSync.status === 'success' ? 'הצליח' : lastSync.status === 'failed' ? 'נכשל' : 'רץ...'}
              </p>
              <p className="text-xs text-muted mt-1">
                {new Date(lastSync.startedAt).toLocaleString('he-IL')}
              </p>
            </div>
          ) : (
            <p className="text-lg text-muted">עדיין לא בוצע סנכרון</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-muted mb-1">מוצרים בסנכרון אחרון</h3>
          {lastSync ? (
            <div>
              <p className="text-lg font-bold">{lastSync.totalProducts}</p>
              <p className="text-xs text-muted">
                {lastSync.newProducts} חדשים, {lastSync.updatedProducts} עודכנו
              </p>
            </div>
          ) : (
            <p className="text-lg text-muted">-</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm text-muted mb-1">שגיאות</h3>
          {lastSync ? (
            <p className={`text-lg font-bold ${lastSync.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {lastSync.errors.length}
            </p>
          ) : (
            <p className="text-lg text-muted">-</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-medium mb-3">פעולות מהירות</h3>
          <div className="space-y-2">
            <a href="/admin/queries" className="block px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              ניהול שאילתות חיפוש
            </a>
            <a href="/admin/products" className="block px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              ניהול מוצרים
            </a>
            <a href="/admin/sync" className="block px-3 py-2 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors">
              הפעלת סנכרון ידני
            </a>
          </div>
        </Card>

        {lastSync && lastSync.errors.length > 0 && (
          <Card className="p-6">
            <h3 className="font-medium mb-3 text-red-600">שגיאות אחרונות</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {lastSync.errors.slice(0, 10).map((err, i) => (
                <p key={i} className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">
                  {err}
                </p>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
