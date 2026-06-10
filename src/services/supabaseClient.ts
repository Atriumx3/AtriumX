import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

let supabaseInstance: SupabaseClient;

try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error(
    'Supabase failed to initialise. ' +
    'Check that VITE_SUPABASE_URL and ' +
    'VITE_SUPABASE_ANON_KEY are set in ' +
    'Cloudflare Pages environment variables.'
  );
  supabaseInstance = {} as SupabaseClient;
}

export const supabase = supabaseInstance;
