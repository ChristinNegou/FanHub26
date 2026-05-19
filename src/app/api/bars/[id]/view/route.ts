import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  await supabase.rpc('increment_bar_view', { bar_id: params.id });
  return NextResponse.json({ ok: true });
}
