import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://khdwurjtbxngotrjuclt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZHd1cmp0YnhuZ290cmp1Y2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxOTE3MzIsImV4cCI6MjA0OTc2NzczMn0.pzBusTkwLn2vRMc_ZHzONbqdoLsRdyUDkaz6NBnEUtA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});

// Add error logging for debugging
supabase.from('artifact').select('*').then(
  (response) => {
    if (response.error) {
      console.error('Supabase connection test failed:', response.error);
    } else {
      console.log('Supabase connection test successful');
    }
  }
);