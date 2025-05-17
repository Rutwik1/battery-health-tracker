import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These environment variables are expected to be set
// SUPABASE_URL: Your Supabase project URL
// SUPABASE_KEY: Your Supabase anon/service key

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Missing required environment variables for Supabase');
  console.error('Please set SUPABASE_URL and SUPABASE_KEY');
}

// Initialize the Supabase client
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Helper function to check if Supabase connection is working
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('batteries').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
}