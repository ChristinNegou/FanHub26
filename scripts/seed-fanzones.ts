import { createAdminClient } from '../src/lib/supabase/admin';
import fanzones from '../src/data/fanzones.json';

async function seedFanZones() {
  const supabase = createAdminClient();

  if (!fanzones.fanzones.length) {
    console.log('No fan zones to seed — populate src/data/fanzones.json first.');
    return;
  }

  const { error } = await supabase.from('fan_zones').insert(fanzones.fanzones);

  if (error) {
    console.error('Error seeding fan zones:', error);
    process.exit(1);
  }

  console.log(`Seeded ${fanzones.fanzones.length} fan zones.`);
}

seedFanZones();
