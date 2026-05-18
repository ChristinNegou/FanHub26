import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { rating, comment, atmosphere_rating, sound_quality_rating } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const admin = createAdminClient();

    // Check bar exists
    const { data: bar } = await admin.from('bars').select('id').eq('id', params.id).single();
    if (!bar) return NextResponse.json({ error: 'Bar not found' }, { status: 404 });

    // Upsert — one review per user per bar
    const { data, error } = await admin
      .from('bar_reviews')
      .upsert({
        bar_id: params.id,
        user_id: user.id,
        rating: Number(rating),
        comment: comment?.trim() || null,
        atmosphere_rating: atmosphere_rating ? Number(atmosphere_rating) : null,
        sound_quality_rating: sound_quality_rating ? Number(sound_quality_rating) : null,
      }, { onConflict: 'bar_id,user_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ review: data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = createAdminClient();
  const { data } = await admin
    .from('bar_reviews')
    .select('rating, comment, atmosphere_rating, sound_quality_rating, created_at')
    .eq('bar_id', params.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({ reviews: data ?? [] });
}
