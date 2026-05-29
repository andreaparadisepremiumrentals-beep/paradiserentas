// --------------------------------------------------------
// Supabase Client — singleton, initialized from env vars
// --------------------------------------------------------
import { createClient } from '@supabase/supabase-js';

let rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jhajqdyrbxwxztieihjz.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HFhBhqIy7UusI12pG_iL9w_PdB7Wt_B';

// Singleton instance
export let supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Updates the Supabase client with a partner secret header for RLS verification.
 */
export const authorizeSupabase = (secret = 'paradise-premium-secret-2024') => {
  supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: { 'x-partner-secret': secret }
    }
  });
};
