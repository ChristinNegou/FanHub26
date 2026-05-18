import { createAdminClient } from '../src/lib/supabase/admin';
import teams from '../src/data/teams.json';

async function seedTeams() {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('teams')
    .upsert(teams.teams, { onConflict: 'code' });

  if (error) {
    console.error('Error seeding teams:', error);
    process.exit(1);
  }

  console.log(`Seeded ${teams.teams.length} teams.`);
}

seedTeams();
