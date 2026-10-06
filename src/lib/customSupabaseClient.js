import { createClient } from '@supabase/supabase-js';
import { makeFetchWithTimeout } from '@/lib/fetchWithTimeout';

const supabaseUrl = 'https://txcsbtvcdaqmkjjbhbeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4Y3NidHZjZGFxbWtqamJoYmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMjgwODEsImV4cCI6MjA3ODkwNDA4MX0.2rBJMtOx8Lldf1eyQ4Yvf-Kl5kurP77Ky_M1VYXcGR8';

// Database, RPC and auth calls carry a time limit so a dead connection can
// never leave a page spinning (src/lib/fetchWithTimeout.js). fetch is looked
// up per call so any later wrapper of window.fetch still applies.
const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: makeFetchWithTimeout((...args) => fetch(...args)) },
});

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
