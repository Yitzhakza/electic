'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

interface Query {
  id: number;
  queryText: string;
  enabled: boolean;
  lastSyncAt: string | null;
  brandId: number;
  categoryId: number | null;
  brandName: string | null;
  categoryName: string | null;
}

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuery, setNewQuery] = useState('');
  const [newBrandId, setNewBrandId] = useState('');

  const fetchQueries = async () => {
    const res = await fetch('/api/admin/queries');
    const data = await res.json();
    setQueries(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleAdd = async () => {
    if (!newQuery.trim() || !newBrandId) return;
    await fetch('/api/admin/queries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queryText: newQuery.trim(), brandId: parseInt(newBrandId, 10) }),
    });
    setNewQuery('');
    setNewBrandId('');
    fetchQueries();
  };

  const handleToggle = async (id: number, enabled: boolean) => {
    await fetch('/api/admin/queries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, enabled: !enabled }),
    });
    fetchQueries();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('בטוח למחוק שאילתה זו?')) return;
    await fetch('/api/admin/queries', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchQueries();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ניהול שאילתות חיפוש</h1>

      {/* Add new */}
      <Card className="p-4 mb-6">
        <h2 className="font-medium mb-3">הוספת שאילתה חדשה</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="טקסט חיפוש (למשל: Tesla Model 3 floor mat)"
            className="flex-1"
            dir="ltr"
          />
          <Input
            type="number"
            value={newBrandId}
            onChange={(e) => setNewBrandId(e.target.value)}
            placeholder="Brand ID"
            className="w-32"
            dir="ltr"
          />
          <Button onClick={handleAdd} size="sm">
            הוסף
          </Button>
        </div>
      </Card>

      {/* List */}
      {loading ? (
        <p className="text-muted">טוען...</p>
      ) : (
        <div className="space-y-2">
          {queries.map((q) => (
            <Card key={q.id} className="p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono truncate" dir="ltr">
                  {q.queryText}
                </p>
                <p className="text-xs text-muted">
                  {q.brandName ?? `Brand #${q.brandId}`}
                  {q.categoryName && ` / ${q.categoryName}`}
                  {q.lastSyncAt && ` | סונכרן: ${new Date(q.lastSyncAt).toLocaleString('he-IL')}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(q.id, q.enabled)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    q.enabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {q.enabled ? 'פעיל' : 'מושבת'}
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="px-3 py-1 rounded text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  מחק
                </button>
              </div>
            </Card>
          ))}
          {queries.length === 0 && <p className="text-muted">אין שאילתות</p>}
        </div>
      )}
    </div>
  );
}
