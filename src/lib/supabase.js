// --------------------------------------------------------
// Supabase Client — singleton, initialized from env vars
// --------------------------------------------------------
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

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
