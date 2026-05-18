import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const patchSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.string().min(5).max(200).optional(),
  city: z.string().min(2).max(50).optional(),
  province: z.enum(['QC', 'ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU']).optional(),
  postal_code: z.string().max(10).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  cover_image_url: z.string().max(500).optional().nullable(),
  logo_url: z.string().max(500).optional().nullable(),
});

async function getOwnedBar(supabase: ReturnType<typeof createClient>, barId: string, userId: string) {
  const { data } = await supabase
    .from('bars')
    .select('id, owner_id')
    .eq('id', barId)
    .single();
  return data?.owner_id === userId ? data : null;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const owned = await getOwnedBar(supabase, params.id, user.id);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { message: 'Validation error' } }, { status: 422 });
  }

  const { data: updated, error } = await supabase
    .from('bars')
    .update(parsed.data)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  return NextResponse.json({ bar: updated });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const owned = await getOwnedBar(supabase, params.id, user.id);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await supabase.from('bar_matches').delete().eq('bar_id', params.id);
  const { error } = await supabase.from('bars').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 });

  return NextResponse.json({ success: true });
}
