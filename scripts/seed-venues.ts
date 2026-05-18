import { createAdminClient } from '../src/lib/supabase/admin';
import venues from '../src/data/venues.json';

async function seedVenues() {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('venues')
    .upsert(venues.venues, { onConflict: 'name' });

  if (error) {
    console.error('Error seeding venues:', error);
    process.exit(1);
  }

  console.log(`Seeded ${venues.venues.length} venues.`);
}

seedVenues();
