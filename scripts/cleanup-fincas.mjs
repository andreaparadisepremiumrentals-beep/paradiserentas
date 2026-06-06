// ============================================================
// Script: Remove duplicate finca entries from Supabase
// Keeps only the OLDEST entry (by created_at) for each title.
// ============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jhajqdyrbxwxztieihjz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HFhBhqIy7UusI12pG_iL9w_PdB7Wt_B';
const PARTNER_SECRET = 'paradise-premium-secret-2024';

// Create an authorized client (with the partner-secret header for RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    headers: { 'x-partner-secret': PARTNER_SECRET }
  }
});

async function main() {
  // 1. Fetch ALL finca properties
  const { data: fincas, error } = await supabase
    .from('properties')
    .select('*')
    .eq('category', 'finca')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching fincas:', error.message);
    process.exit(1);
  }

  console.log(`📦 Total fincas in DB: ${fincas.length}`);

  // 2. Group by title (normalized)
  const groups = {};
  for (const f of fincas) {
    const key = f.title.trim().toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(f);
  }

  // 3. Find duplicate IDs to delete (keep the first / oldest of each group)
  const idsToDelete = [];
  const kept = [];

  for (const [title, entries] of Object.entries(groups)) {
    // Keep the first one (oldest, since ordered by created_at asc)
    kept.push({ id: entries[0].id, title: entries[0].title });
    for (let i = 1; i < entries.length; i++) {
      idsToDelete.push({ id: entries[i].id, title: entries[i].title });
    }
  }

  console.log(`\n✅ Unique fincas to KEEP (${kept.length}):`);
  kept.forEach((f, i) => console.log(`   ${i + 1}. "${f.title}" (${f.id})`));

  console.log(`\n🗑️  Duplicates to DELETE (${idsToDelete.length}):`);
  idsToDelete.forEach((f, i) => console.log(`   ${i + 1}. "${f.title}" (${f.id})`));

  if (idsToDelete.length === 0) {
    console.log('\n🎉 No duplicates found. Database is clean!');
    return;
  }

  // 4. Delete duplicates in batches
  console.log(`\n🔧 Deleting ${idsToDelete.length} duplicate rows...`);

  const deleteIds = idsToDelete.map(f => f.id);

  // Delete in batches of 20
  for (let i = 0; i < deleteIds.length; i += 20) {
    const batch = deleteIds.slice(i, i + 20);
    const { error: delErr } = await supabase
      .from('properties')
      .delete()
      .in('id', batch);

    if (delErr) {
      console.error(`❌ Error deleting batch starting at index ${i}:`, delErr.message);
    } else {
      console.log(`   ✅ Deleted batch ${Math.floor(i / 20) + 1} (${batch.length} rows)`);
    }
  }

  // 5. Verify final count
  const { data: remaining, error: verifyErr } = await supabase
    .from('properties')
    .select('id, title')
    .eq('category', 'finca');

  if (!verifyErr) {
    console.log(`\n🎉 Done! Fincas remaining: ${remaining.length}`);
    remaining.forEach((f, i) => console.log(`   ${i + 1}. "${f.title}"`));
  }
}

main().catch(console.error);
