import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ favorite_team_id: null });

    const admin = createAdminClient();
    const { data } = await admin
      .from('user_profiles')
      .select('favorite_team_id')
      .eq('id', user.id)
      .single();

    return NextResponse.json({ favorite_team_id: data?.favorite_team_id ?? null });
  } catch {
    return NextResponse.json({ favorite_team_id: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { team_id } = await request.json();
    const admin = createAdminClient();

    await admin
      .from('user_profiles')
      .upsert({ id: user.id, favorite_team_id: team_id ?? null }, { onConflict: 'id' });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
