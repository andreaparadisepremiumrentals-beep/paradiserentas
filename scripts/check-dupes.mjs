// Quick check: are there duplicates in other categories too?
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jhajqdyrbxwxztieihjz.supabase.co',
  'sb_publishable_HFhBhqIy7UusI12pG_iL9w_PdB7Wt_B'
);

async function main() {
  const { data, error } = await supabase
    .from('properties')
    .select('id, title, category')
    .order('category', { ascending: true })
    .order('title', { ascending: true });

  if (error) { console.error(error); return; }

  // Group by category + title
  const groups = {};
  for (const p of data) {
    const key = `${p.category}|||${p.title.trim().toLowerCase()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  }

  console.log(`Total properties: ${data.length}`);
  const dupes = Object.entries(groups).filter(([, v]) => v.length > 1);
  if (dupes.length === 0) {
    console.log('✅ No duplicates found in any category!');
  } else {
    console.log(`⚠️  Found ${dupes.length} duplicate groups:`);
    for (const [key, entries] of dupes) {
      console.log(`  "${entries[0].title}" (${entries[0].category}) x${entries.length}`);
    }
  }

  // Show count per category
  const cats = {};
  for (const p of data) {
    cats[p.category] = (cats[p.category] || 0) + 1;
  }
  console.log('\nProperties per category:', cats);
}

main().catch(console.error);
