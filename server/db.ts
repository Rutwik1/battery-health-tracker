import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Create a PostgreSQL client with the connection string from Supabase
const connectionString = process.env.DATABASE_URL!;

// For better connection handling in different environments
const sql = postgres(connectionString, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Timeout in seconds
  connect_timeout: 10, // Connect timeout in seconds
});

// Create database connection with Drizzle ORM
export const db = drizzle(sql);