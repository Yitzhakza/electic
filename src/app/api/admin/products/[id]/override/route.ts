import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { productOverrides } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { z } from 'zod';

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

const overrideSchema = z.object({
  titleHeOverride: z.string().nullable().optional(),
  descriptionHeOverride: z.string().nullable().optional(),
  couponOverride: z.string().max(64).nullable().optional(),
  tagsOverride: z.array(z.string()).optional(),
  isHidden: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = await params;
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    const parsed = overrideSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.issues }, { status: 400 });
    }

    // Upsert override
    const existing = await db
      .select()
      .from(productOverrides)
      .where(eq(productOverrides.productId, productId))
      .limit(1);

    let result;
    if (existing[0]) {
      [result] = await db
        .update(productOverrides)
        .set({ ...parsed.data, updatedAt: new Date() })
        .where(eq(productOverrides.productId, productId))
        .returning();
    } else {
      [result] = await db
        .insert(productOverrides)
        .values({ productId, ...parsed.data })
        .returning();
    }

    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
