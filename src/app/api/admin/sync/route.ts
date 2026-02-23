import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { syncRuns, syncLogs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { runSync } from '@/lib/sync/engine';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

// Get sync history and logs
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const syncRunId = searchParams.get('runId');

    if (syncRunId) {
      // Get specific run with logs
      const run = await db.select().from(syncRuns).where(eq(syncRuns.id, parseInt(syncRunId, 10))).limit(1);
      const logs = await db
        .select()
        .from(syncLogs)
        .where(eq(syncLogs.syncRunId, parseInt(syncRunId, 10)))
        .orderBy(desc(syncLogs.createdAt));

      return NextResponse.json({ run: run[0] ?? null, logs });
    }

    // Get recent sync runs
    const runs = await db.select().from(syncRuns).orderBy(desc(syncRuns.startedAt)).limit(20);
    return NextResponse.json({ data: runs });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// Trigger manual sync
export async function POST() {
  try {
    await requireAdmin();

    const syncRunId = await runSync({ triggeredBy: 'manual' });
    return NextResponse.json({ success: true, syncRunId });
  } catch (error) {
    if ((error as Error).message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Sync failed', message: (error as Error).message },
      { status: 500 }
    );
  }
}
