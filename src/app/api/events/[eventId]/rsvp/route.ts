import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(
  _request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    // Check event and capacity
    const { data: event } = await admin
      .from('community_events')
      .select('id, max_attendees, current_attendees, is_active')
      .eq('id', params.eventId)
      .single();

    if (!event || !event.is_active) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if already RSVP'd
    const { data: existing } = await admin
      .from('event_rsvps')
      .select('id')
      .eq('event_id', params.eventId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Already registered' }, { status: 409 });
    }

    // Check capacity
    if (event.max_attendees && event.current_attendees >= event.max_attendees) {
      return NextResponse.json({ error: 'Event is full' }, { status: 409 });
    }

    // Insert RSVP
    const { error: rsvpErr } = await admin
      .from('event_rsvps')
      .insert({ event_id: params.eventId, user_id: user.id, status: 'going' });

    if (rsvpErr) throw rsvpErr;

    // Increment attendees count
    await admin
      .from('community_events')
      .update({ current_attendees: event.current_attendees + 1 })
      .eq('id', params.eventId);

    return NextResponse.json({ status: 'going' }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = createAdminClient();

    const { data: rsvp } = await admin
      .from('event_rsvps')
      .select('id')
      .eq('event_id', params.eventId)
      .eq('user_id', user.id)
      .single();

    if (!rsvp) return NextResponse.json({ error: 'RSVP not found' }, { status: 404 });

    await admin.from('event_rsvps').delete().eq('id', rsvp.id);

    // Decrement attendees
    const { data: event } = await admin
      .from('community_events')
      .select('current_attendees')
      .eq('id', params.eventId)
      .single();

    if (event) {
      await admin
        .from('community_events')
        .update({ current_attendees: Math.max(0, event.current_attendees - 1) })
        .eq('id', params.eventId);
    }

    return NextResponse.json({ status: 'removed' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Check if current user has RSVP'd
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ rsvped: false });

    const admin = createAdminClient();
    const { data } = await admin
      .from('event_rsvps')
      .select('id')
      .eq('event_id', params.eventId)
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({ rsvped: !!data });
  } catch {
    return NextResponse.json({ rsvped: false });
  }
}
