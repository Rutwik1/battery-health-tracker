// import { createClient } from '@supabase/supabase-js';
// import { Database } from '../../../shared/database.types';

// // Initialize the Supabase client
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

// if (!supabaseUrl || !supabaseKey) {
//   console.error('Missing Supabase environment variables');
// }

// export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// // Sign up a new user
// export async function signUp(email: string, password: string, username: string) {
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       data: {
//         username,
//       },
//       emailRedirectTo: `${window.location.origin}/verify`
//     }
//   });

//   if (error) throw error;

//   // For now, we'll bypass the custom users table and just use Supabase Auth
//   // This avoids the UUID conversion issues with our database schema
//   console.log("User registered successfully with Supabase Auth:", data.user?.id);

//   return data;
// }

// // Sign in an existing user
// export async function signIn(email: string, password: string) {
//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password
//   });

//   if (error) throw error;

//   // For now, we'll bypass the custom users table and just use Supabase Auth directly
//   if (data.user) {
//     console.log("User logged in successfully with Supabase Auth:", data.user.id);
//   }

//   return data;
// }

// // Sign out the current user
// export async function signOut() {
//   const { error } = await supabase.auth.signOut();
//   if (error) throw error;
// }

// // Get the current user
// export async function getCurrentUser() {
//   const { data: { user } } = await supabase.auth.getUser();

//   // If we have a user via social login (Google), just pass it through
//   if (user && user.app_metadata.provider === 'google') {
//     console.log("Google user authenticated:", user.id);
//   }

//   return user;
// }

// // Check if user is authenticated
// export async function isAuthenticated() {
//   const { data: { session } } = await supabase.auth.getSession();
//   return !!session;
// }






// -----------------new code updated 



import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../shared/database.types';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Sign up a new user
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${window.location.origin}/verify`
    }
  });

  if (error) throw error;

  // For now, we'll bypass the custom users table and just use Supabase Auth
  // This avoids the UUID conversion issues with our database schema
  console.log("User registered successfully with Supabase Auth:", data.user?.id);

  return data;
}

// Sign in an existing user
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // For now, we'll bypass the custom users table and just use Supabase Auth directly
  if (data.user) {
    console.log("User logged in successfully with Supabase Auth:", data.user.id);
  }

  return data;
}

// Sign in with Google - add this new function
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });

  if (error) throw error;
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

  // If we have a user via social login (Google), just pass it through
  if (user && user.app_metadata.provider === 'google') {
    console.log("Google user authenticated:", user.id);
  }

  return user;
}

// Check if user is authenticated
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}