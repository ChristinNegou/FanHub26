import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const teamCode = searchParams.get('team');
  const city = searchParams.get('city');

  try {
    // Use admin client so teams table is always readable
    const admin = createAdminClient();

    let teamId: string | null = null;
    if (teamCode) {
      const { data: teamRow } = await admin
        .from('teams')
        .select('id')
        .eq('code', teamCode.toUpperCase())
        .single();
      teamId = teamRow?.id ?? null;
      if (!teamId) return NextResponse.json({ events: [] });
    }

    let query = admin
      .from('community_events')
      .select('id, title, description, city, address, event_date, max_attendees, current_attendees')
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    if (teamId) query = query.eq('team_id', teamId);
    if (city) query = query.ilike('city', `%${city}%`);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ events: data ?? [] });
  } catch {
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check uses user client (cookies)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, team_code, city, address, event_date, max_attendees } = body;

    if (!title?.trim() || !city?.trim() || !event_date || !team_code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (new Date(event_date) < new Date()) {
      return NextResponse.json({ error: 'Event date must be in the future' }, { status: 400 });
    }

    // Use admin client to resolve team_id — bypasses RLS on teams table
    const admin = createAdminClient();

    const { data: teamRow, error: teamErr } = await admin
      .from('teams')
      .select('id')
      .eq('code', team_code.toUpperCase())
      .single();

    if (teamErr || !teamRow) {
      return NextResponse.json({ error: 'Unknown team code' }, { status: 400 });
    }

    const { data, error } = await admin
      .from('community_events')
      .insert({
        organizer_id: user.id,
        team_id: teamRow.id,
        title: title.trim(),
        description: description?.trim() || null,
        city: city.trim(),
        address: address?.trim() || null,
        event_date,
        max_attendees: max_attendees ? Number(max_attendees) : null,
        current_attendees: 0,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
