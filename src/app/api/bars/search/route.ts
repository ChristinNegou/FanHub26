import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = parseFloat(searchParams.get('radius') ?? '10');
  const matchId = searchParams.get('matchId') || null;
  const sound = searchParams.get('sound');
  const projector = searchParams.get('projector');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const supabase = createClient();

  const { data, error } = await supabase.rpc('search_bars_nearby', {
    user_lat: parseFloat(lat),
    user_lng: parseFloat(lng),
    radius_km: radius,
    filter_match_id: matchId,
    filter_sound: sound === 'true' ? true : null,
    filter_projector: projector === 'true' ? true : null,
    filter_featured: null,
  });

  if (error) {
    console.error('search_bars_nearby error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bars = (data ?? []).map((b: any) => ({
    id: b.bar_id,
    name: b.name,
    slug: b.slug,
    address: b.address,
    city: b.city,
    latitude: b.latitude,
    longitude: b.longitude,
    distance_km: b.distance_km,
    has_sound: b.has_sound,
    has_projector: b.has_projector,
    has_outdoor: b.has_outdoor,
    has_food: b.has_food,
    num_screens: b.num_screens,
    capacity: b.capacity,
    atmosphere: b.atmosphere,
    is_featured: b.is_featured,
    is_verified: b.is_verified,
    logo_url: b.logo_url,
    cover_image_url: b.cover_image_url,
    avg_rating: b.avg_rating,
  }));

  return NextResponse.json({ bars });
}
