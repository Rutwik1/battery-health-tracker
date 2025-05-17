// Database migration script to create tables in PostgreSQL
import { db } from './dbconfig';
import { sql } from 'drizzle-orm';

async function migrateDatabase() {
  console.log('Starting database migration...');
  
  try {
    // Create the tables in the correct order to handle relationships
    console.log('Creating database tables...');
    
    // 1. Users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    console.log('Users table created');

    // 2. Batteries table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS batteries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        serial_number TEXT NOT NULL UNIQUE,
        initial_capacity INTEGER NOT NULL,
        current_capacity INTEGER NOT NULL,
        health_percentage REAL NOT NULL,
        cycle_count INTEGER NOT NULL,
        expected_cycles INTEGER NOT NULL,
        status TEXT NOT NULL,
        initial_date TIMESTAMP NOT NULL,
        last_updated TIMESTAMP NOT NULL,
        degradation_rate REAL NOT NULL
      );
    `);
    console.log('Batteries table created');

    // 3. Battery history table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS battery_history (
        id SERIAL PRIMARY KEY,
        battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL,
        capacity INTEGER NOT NULL,
        health_percentage REAL NOT NULL,
        cycle_count INTEGER NOT NULL
      );
    `);
    console.log('Battery history table created');

    // 4. Usage patterns table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS usage_patterns (
        id SERIAL PRIMARY KEY,
        battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
        charging_frequency REAL NOT NULL,
        discharge_depth REAL NOT NULL,
        charge_duration INTEGER NOT NULL,
        operating_temperature REAL NOT NULL,
        last_updated TIMESTAMP NOT NULL
      );
    `);
    console.log('Usage patterns table created');

    // 5. Recommendations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        resolved BOOLEAN NOT NULL DEFAULT FALSE
      );
    `);
    console.log('Recommendations table created');

    console.log('All database tables created successfully!');
    return true;
  } catch (error) {
    console.error('Error during database migration:', error);
    return false;
  }
}

// Export the migration function
export { migrateDatabase };

// Run migration immediately
migrateDatabase()
  .then(success => {
    if (success) {
      console.log('Migration completed successfully!');
    } else {
      console.error('Migration failed!');
    }
  })
  .catch(error => {
    console.error('Unexpected error during migration:', error);
  });