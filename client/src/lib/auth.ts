import { createClient } from '@supabase/supabase-js';
import { Database } from '../../shared/database.types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Sign up a new user
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      }
    }
  });
  
  if (error) throw error;
  
  // Also create a record in our users table
  if (data.user) {
    // Create a user record in our users table with Supabase UUID
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        username: username,
        password: 'SUPABASE-AUTH' // We don't store actual passwords
      });
      
    if (userError) {
      console.error("Error creating user record:", userError);
      throw userError;
    }
  }
  
  return data;
}

// Sign in an existing user
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Create a user record if it doesn't exist yet
  if (data.user) {
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        username: data.user.user_metadata?.username || email.split('@')[0],
        password: 'SUPABASE-AUTH' // We don't store actual passwords
      });
      
    if (userError) {
      console.error("Error ensuring user record exists:", userError);
    }
  }
  
  return data;
}

// Sign out the current user
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get the current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  // If we have a user via social login (Google), ensure they have a record in our users table
  if (user && user.app_metadata.provider === 'google') {
    try {
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          username: user.user_metadata?.name || user.email?.split('@')[0] || 'Google User',
          password: 'GOOGLE-AUTH'
        });
        
      if (userError) {
        console.error("Error ensuring Google user record exists:", userError);
      }
    } catch (err) {
      console.error("Error processing Google user:", err);
    }
  }
  
  return user;
}

// Check if user is authenticated
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}