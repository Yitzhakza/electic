import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { searchQueries, brands, accessoryCategories } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function GET() {
  try {
    await requireAdmin();

    const queries = await db
      .select({
        id: searchQueries.id,
        queryText: searchQueries.queryText,
        enabled: searchQueries.enabled,
        lastSyncAt: searchQueries.lastSyncAt,
        brandId: searchQueries.brandId,
        categoryId: searchQueries.categoryId,
        brandName: brands.nameHe,
        categoryName: accessoryCategories.nameHe,
      })
      .from(searchQueries)
      .leftJoin(brands, eq(brands.id, searchQueries.brandId))
      .leftJoin(accessoryCategories, eq(accessoryCategories.id, searchQueries.categoryId))
      .orderBy(searchQueries.id);

    return NextResponse.json({ data: queries });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

const createQuerySchema = z.object({
  brandId: z.number().int().positive(),
  categoryId: z.number().int().positive().optional(),
  queryText: z.string().min(2).max(200),
  enabled: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = createQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }

    const [created] = await db.insert(searchQueries).values(parsed.data).returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

const updateQuerySchema = z.object({
  id: z.number().int().positive(),
  queryText: z.string().min(2).max(200).optional(),
  enabled: z.boolean().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const parsed = updateQuerySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }

    const { id, ...updates } = parsed.data;
    const [updated] = await db.update(searchQueries).set(updates).where(eq(searchQueries.id, id)).returning();
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await db.delete(searchQueries).where(eq(searchQueries.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
