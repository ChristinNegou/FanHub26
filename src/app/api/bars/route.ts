import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils/slugify';

const barSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(50),
  province: z.enum(['QC', 'ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU']),
  postal_code: z.string().regex(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i).optional().or(z.literal('')),
  phone: z.string().regex(/^\+?1?\d{10,11}$/).optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  instagram: z.string().max(60).optional().or(z.literal('')),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  has_sound: z.boolean().default(false),
  has_projector: z.boolean().default(false),
  has_outdoor: z.boolean().default(false),
  has_food: z.boolean().default(false),
  num_screens: z.number().int().min(1).max(50).default(1),
  capacity: z.number().int().min(10).max(5000).optional().nullable(),
  atmosphere: z.enum(['lively', 'chill', 'sports_bar', 'pub']).optional().nullable(),
  description_fr: z.string().max(1000).optional().or(z.literal('')),
  description_en: z.string().max(1000).optional().or(z.literal('')),
});

export async function GET(_request: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bars')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bars: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = barSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  // Generate a unique slug
  let slug = slugify(data.name);
  const { data: existing } = await supabase
    .from('bars')
    .select('slug')
    .like('slug', `${slug}%`);

  if (existing && existing.length > 0) {
    slug = `${slug}-${existing.length + 1}`;
  }

  const { data: bar, error: insertError } = await supabase
    .from('bars')
    .insert({
      owner_id: user.id,
      name: data.name,
      slug,
      address: data.address,
      city: data.city,
      province: data.province,
      postal_code: data.postal_code || null,
      country: 'CA',
      phone: data.phone || null,
      website: data.website || null,
      instagram: data.instagram || null,
      latitude: data.latitude,
      longitude: data.longitude,
      has_sound: data.has_sound,
      has_projector: data.has_projector,
      has_outdoor: data.has_outdoor,
      has_food: data.has_food,
      num_screens: data.num_screens,
      capacity: data.capacity ?? null,
      atmosphere: data.atmosphere ?? null,
      description_fr: data.description_fr || null,
      description_en: data.description_en || null,
      is_active: true,
      is_featured: false,
      is_verified: false,
    })
    .select()
    .single();

  if (insertError) {
    console.error('Bar insert error:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ bar }, { status: 201 });
}
