import { createAdminClient } from '../src/lib/supabase/admin';
import matchesData from '../src/data/matches.json';

async function seedMatches() {
  const supabase = createAdminClient();

  const { data: teams, error: teamsError } = await supabase.from('teams').select('id, code');
  if (teamsError) { console.error('Failed to load teams:', teamsError); process.exit(1); }
  const teamMap = Object.fromEntries((teams ?? []).map((t) => [t.code, t.id]));

  const { data: venues, error: venuesError } = await supabase.from('venues').select('id, name');
  if (venuesError) { console.error('Failed to load venues:', venuesError); process.exit(1); }
  const venueMap = Object.fromEntries((venues ?? []).map((v) => [v.name, v.id]));

  const rows = matchesData.matches.map((m) => {
    const venueId = venueMap[m.venue];
    if (!venueId) console.warn(`Venue not found: "${m.venue}" (match ${m.match_number})`);
    return {
      match_number: m.match_number,
      stage: m.stage,
      group_letter: m.group_letter ?? null,
      home_team_id: m.home_team_code ? (teamMap[m.home_team_code] ?? null) : null,
      away_team_id: m.away_team_code ? (teamMap[m.away_team_code] ?? null) : null,
      home_team_placeholder: (m as any).home_team_placeholder ?? null,
      away_team_placeholder: (m as any).away_team_placeholder ?? null,
      venue_id: venueId ?? null,
      kickoff_utc: m.kickoff_utc,
      status: 'scheduled',
    };
  });

  const { error } = await supabase
    .from('matches')
    .upsert(rows, { onConflict: 'match_number' });

  if (error) {
    console.error('Error seeding matches:', error);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} matches.`);
}

seedMatches();
