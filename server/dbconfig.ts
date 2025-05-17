// PostgreSQL Database Configuration
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Get database connection string from environment variable
const connectionString = process.env.DATABASE_URL!;

// Create a postgres connection
const client = postgres(connectionString, {
  max: 10, // Maximum number of connections 
  idle_timeout: 30, // Timeout in seconds
});

// Create a drizzle instance with the database schema
export const db = drizzle(client, { schema });

// Create a function to test the database connection
export async function testConnection() {
  try {
    // Try a simple query
    const result = await client`SELECT 1 as test`;
    console.log('Database connection successful!', result[0].test);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}