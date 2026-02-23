'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface SyncRun {
  id: number;
  startedAt: string;
  completedAt: string | null;
  status: string;
  totalQueries: number;
  totalProducts: number;
  newProducts: number;
  updatedProducts: number;
  errors: string[];
  triggeredBy: string;
}

interface SyncLog {
  id: number;
  level: string;
  message: string;
  createdAt: string;
}

export default function AdminSyncPage() {
  const [runs, setRuns] = useState<SyncRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchRuns = async () => {
    const res = await fetch('/api/admin/sync');
    const data = await res.json();
    setRuns(data.data ?? []);
    setLoading(false);
  };

  const fetchLogs = async (runId: number) => {
    setSelectedRun(runId);
    const res = await fetch(`/api/admin/sync?runId=${runId}`);
    const data = await res.json();
    setLogs(data.logs ?? []);
  };

  const triggerSync = async () => {
    setSyncing(true);
    await fetch('/api/admin/sync', { method: 'POST' });
    setSyncing(false);
    fetchRuns();
  };

  useEffect(() => {
    fetchRuns();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">סנכרון</h1>
        <Button onClick={triggerSync} disabled={syncing}>
          {syncing ? 'מסנכרן...' : 'הפעל סנכרון ידני'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs list */}
        <div>
          <h2 className="font-semibold mb-3">היסטוריית סנכרון</h2>
          {loading ? (
            <p className="text-muted">טוען...</p>
          ) : (
            <div className="space-y-2">
              {runs.map((run) => (
                <Card
                  key={run.id}
                  hover
                  className={`p-3 cursor-pointer ${selectedRun === run.id ? 'ring-2 ring-primary' : ''}`}
                >
                  <button onClick={() => fetchLogs(run.id)} className="w-full text-start cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          run.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : run.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {run.status === 'success' ? 'הצלח' : run.status === 'failed' ? 'נכשל' : 'רץ'}
                      </span>
                      <span className="text-xs text-muted">
                        {run.triggeredBy === 'cron' ? 'אוטומטי' : 'ידני'}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {new Date(run.startedAt).toLocaleString('he-IL')}
                    </p>
                    <p className="text-xs mt-1">
                      {run.totalProducts} מוצרים | {run.newProducts} חדשים | {run.updatedProducts} עודכנו |{' '}
                      {run.errors.length} שגיאות
                    </p>
                  </button>
                </Card>
              ))}
              {runs.length === 0 && <p className="text-muted">אין ריצות סנכרון</p>}
            </div>
          )}
        </div>

        {/* Logs */}
        <div>
          <h2 className="font-semibold mb-3">
            לוגים {selectedRun ? `(ריצה #${selectedRun})` : ''}
          </h2>
          {selectedRun ? (
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`text-xs px-2 py-1.5 rounded font-mono ${
                    log.level === 'error'
                      ? 'bg-red-50 text-red-700'
                      : log.level === 'warn'
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="text-muted">[{new Date(log.createdAt).toLocaleTimeString('he-IL')}]</span>{' '}
                  {log.message}
                </div>
              ))}
              {logs.length === 0 && <p className="text-muted text-sm">אין לוגים</p>}
            </div>
          ) : (
            <p className="text-muted text-sm">בחר ריצת סנכרון לצפייה בלוגים</p>
          )}
        </div>
      </div>
    </div>
  );
}
