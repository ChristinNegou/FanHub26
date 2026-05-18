import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('upcoming_matches')
    .select('*')
    .order('kickoff_utc', { ascending: true })
    .limit(104);

  if (error) {
    console.error('matches fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ matches: data ?? [] });
}
