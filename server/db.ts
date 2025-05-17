import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create Postgres client with database URL from environment
const connectionString = process.env.DATABASE_URL!;
// For Supabase, use the connection string from the Supabase dashboard

// Create SQL client
const client = postgres(connectionString);

// Create database connection with Drizzle
export const db = drizzle(client);