import { supabase } from './supabase';
import { MemStorage } from './storage';

/**
 * Create tables in Supabase using SQL
 */
async function createTables() {
  console.log('Creating tables in Supabase...');
  
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('exec', { 
      query: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );
      `
    });
    
    if (usersError) throw usersError;
    console.log('Users table created');
    
    // Create batteries table
    const { error: batteriesError } = await supabase.rpc('exec', { 
      query: `
        CREATE TABLE IF NOT EXISTS batteries (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          serial_number TEXT UNIQUE NOT NULL,
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
      `
    });
    
    if (batteriesError) throw batteriesError;
    console.log('Batteries table created');
    
    // Create battery_history table
    const { error: historyError } = await supabase.rpc('exec', { 
      query: `
        CREATE TABLE IF NOT EXISTS battery_history (
          id SERIAL PRIMARY KEY,
          battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
          date TIMESTAMP NOT NULL,
          capacity INTEGER NOT NULL,
          health_percentage REAL NOT NULL,
          cycle_count INTEGER NOT NULL
        );
      `
    });
    
    if (historyError) throw historyError;
    console.log('Battery history table created');
    
    // Create usage_patterns table
    const { error: patternsError } = await supabase.rpc('exec', { 
      query: `
        CREATE TABLE IF NOT EXISTS usage_patterns (
          id SERIAL PRIMARY KEY,
          battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
          charging_frequency REAL NOT NULL,
          discharge_depth REAL NOT NULL,
          charge_duration INTEGER NOT NULL,
          operating_temperature REAL NOT NULL,
          last_updated TIMESTAMP NOT NULL
        );
      `
    });
    
    if (patternsError) throw patternsError;
    console.log('Usage patterns table created');
    
    // Create recommendations table
    const { error: recommendationsError } = await supabase.rpc('exec', { 
      query: `
        CREATE TABLE IF NOT EXISTS recommendations (
          id SERIAL PRIMARY KEY,
          battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL,
          resolved BOOLEAN NOT NULL DEFAULT FALSE
        );
      `
    });
    
    if (recommendationsError) throw recommendationsError;
    console.log('Recommendations table created');
    
    console.log('All tables created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
}

/**
 * Check if we need to seed the database with demo data
 */
async function checkAndSeedData() {
  console.log('Checking if we need to seed the database...');
  
  try {
    // Check if batteries table has data
    const { data: batteries, error } = await supabase
      .from('batteries')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    
    if (batteries && batteries.length > 0) {
      console.log('Database already has data, skipping seed');
      return true;
    }
    
    console.log('No data found in database, seeding with demo data...');
    return await seedDemoData();
  } catch (error) {
    console.error('Error checking for existing data:', error);
    return false;
  }
}

/**
 * Seed the database with demo data from our in-memory storage
 */
async function seedDemoData() {
  console.log('Seeding database with demo data...');
  
  try {
    // Create a memory storage instance to get demo data
    const memStorage = new MemStorage();
    
    // Get all batteries
    const batteries = await memStorage.getBatteries();
    console.log(`Found ${batteries.length} batteries in demo data`);
    
    // Insert each battery and its related data
    for (const battery of batteries) {
      // 1. Insert battery
      const { data: newBattery, error: batteryError } = await supabase
        .from('batteries')
        .insert({
          name: battery.name,
          serial_number: battery.serialNumber,
          initial_capacity: battery.initialCapacity,
          current_capacity: battery.currentCapacity,
          health_percentage: battery.healthPercentage,
          cycle_count: battery.cycleCount,
          expected_cycles: battery.expectedCycles,
          status: battery.status,
          initial_date: battery.initialDate.toISOString(),
          last_updated: battery.lastUpdated.toISOString(),
          degradation_rate: battery.degradationRate
        })
        .select()
        .single();
      
      if (batteryError) throw batteryError;
      console.log(`Added battery: ${newBattery.name} (ID: ${newBattery.id})`);
      
      // 2. Insert battery history
      const historyItems = await memStorage.getBatteryHistory(battery.id);
      if (historyItems.length > 0) {
        const historyData = historyItems.map(item => ({
          battery_id: newBattery.id,
          date: item.date.toISOString(),
          capacity: item.capacity,
          health_percentage: item.healthPercentage,
          cycle_count: item.cycleCount
        }));
        
        const { error: historyError } = await supabase
          .from('battery_history')
          .insert(historyData);
        
        if (historyError) throw historyError;
        console.log(`Added ${historyItems.length} history records for battery ${newBattery.id}`);
      }
      
      // 3. Insert usage pattern
      const pattern = await memStorage.getUsagePattern(battery.id);
      if (pattern) {
        const { error: patternError } = await supabase
          .from('usage_patterns')
          .insert({
            battery_id: newBattery.id,
            charging_frequency: pattern.chargingFrequency,
            discharge_depth: pattern.dischargeDepth,
            charge_duration: pattern.chargeDuration,
            operating_temperature: pattern.operatingTemperature,
            last_updated: pattern.lastUpdated.toISOString()
          });
        
        if (patternError) throw patternError;
        console.log(`Added usage pattern for battery ${newBattery.id}`);
      }
      
      // 4. Insert recommendations
      const recommendations = await memStorage.getRecommendations(battery.id);
      if (recommendations.length > 0) {
        const recData = recommendations.map(rec => ({
          battery_id: newBattery.id,
          type: rec.type,
          message: rec.message,
          created_at: rec.createdAt.toISOString(),
          resolved: rec.resolved || false
        }));
        
        const { error: recError } = await supabase
          .from('recommendations')
          .insert(recData);
        
        if (recError) throw recError;
        console.log(`Added ${recommendations.length} recommendations for battery ${newBattery.id}`);
      }
    }
    
    console.log('Demo data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding demo data:', error);
    return false;
  }
}

/**
 * Main setup function - create tables and seed data if needed
 */
export async function setupSupabase() {
  console.log('Setting up Supabase database...');
  
  try {
    // First, enable RLS for all tables
    const tableNames = ['users', 'batteries', 'battery_history', 'usage_patterns', 'recommendations'];
    
    // First try to check if tables exist - if not, create them
    const { count, error } = await supabase
      .from('batteries')
      .select('id', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, let's create it
      console.log('Tables do not exist, creating them...');
      const tablesCreated = await createTables();
      if (!tablesCreated) {
        throw new Error('Failed to create tables');
      }
    } else if (error) {
      throw error;
    } else {
      console.log('Tables already exist');
    }
    
    // Check if we need to seed the database
    await checkAndSeedData();
    
    console.log('Supabase setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    return false;
  }
}

// Run the setup if this file is executed directly
if (import.meta.url === import.meta.resolve('./setup-supabase.ts')) {
  setupSupabase()
    .then(success => {
      if (success) {
        console.log('Supabase setup completed!');
      } else {
        console.error('Supabase setup failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error during Supabase setup:', error);
      process.exit(1);
    });
}