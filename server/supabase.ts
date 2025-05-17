import { createClient } from '@supabase/supabase-js';
import type { Database } from '../shared/database.types';

// Initialize the Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey
);

// Test the Supabase connection
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('batteries').select('count');
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    return false;
  }
}