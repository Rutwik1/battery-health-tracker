import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';
import { MemStorage } from './storage';

/**
 * Create tables in Supabase using SQL
 */
async function createTables() {
  try {
    // Check if tables already exist
    const { data: tablesExist, error: checkError } = await supabase
      .from('batteries')
      .select('count');
    
    if (!checkError) {
      console.log('Tables already exist');
      return true;
    }
    
    // Tables don't exist, create them
    const sqlFilePath = path.join(process.cwd(), 'supabase-tables.sql');
    if (!fs.existsSync(sqlFilePath)) {
      console.error('SQL file not found at:', sqlFilePath);
      return false;
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute SQL statements
    const { error } = await supabase.rpc('exec_sql', { query: sqlContent });
    
    if (error) {
      console.error('Error creating tables:', error);
      return false;
    }
    
    console.log('Tables created successfully!');
    return true;
  } catch (error) {
    console.error('Error in createTables:', error);
    return false;
  }
}

/**
 * Check if we need to seed the database with demo data
 */
async function checkAndSeedData() {
  try {
    console.log('Checking if we need to seed the database...');
    
    // Check if there's already data in the batteries table
    const { data, error } = await supabase
      .from('batteries')
      .select('count');
      
    if (error) {
      console.error('Error checking for existing data:', error);
      return false;
    }
    
    // If there are no batteries, seed with demo data
    if (data[0].count === 0) {
      console.log('No data found, seeding with demo data...');
      return await seedDemoData();
    }
    
    console.log('Data already exists, no need to seed');
    return true;
  } catch (error) {
    console.error('Error in checkAndSeedData:', error);
    return false;
  }
}

/**
 * Seed the database with demo data from our in-memory storage
 */
async function seedDemoData() {
  try {
    // Use our in-memory storage to get demo data
    const memStorage = new MemStorage();
    
    // Get demo batteries
    const batteries = await memStorage.getBatteries();
    
    // Insert batteries into Supabase
    for (const battery of batteries) {
      const { error: batteryError } = await supabase
        .from('batteries')
        .insert({
          id: battery.id,
          name: battery.name,
          serial_number: battery.serialNumber,
          initial_capacity: battery.initialCapacity,
          current_capacity: battery.currentCapacity,
          health_percentage: battery.healthPercentage,
          cycle_count: battery.cycleCount,
          expected_cycles: battery.expectedCycles,
          status: battery.status,
          initial_date: battery.initialDate,
          last_updated: battery.lastUpdated,
          degradation_rate: battery.degradationRate
        });
      
      if (batteryError) {
        console.error(`Error seeding battery ${battery.id}:`, batteryError);
        continue;
      }
      
      // Get and insert battery history
      const history = await memStorage.getBatteryHistory(battery.id);
      for (const entry of history) {
        const { error: historyError } = await supabase
          .from('battery_history')
          .insert({
            battery_id: entry.batteryId,
            date: entry.date,
            capacity: entry.capacity,
            health_percentage: entry.healthPercentage,
            cycle_count: entry.cycleCount
          });
        
        if (historyError) {
          console.error(`Error seeding history for battery ${battery.id}:`, historyError);
        }
      }
      
      // Get and insert usage pattern
      const pattern = await memStorage.getUsagePattern(battery.id);
      if (pattern) {
        const { error: patternError } = await supabase
          .from('usage_patterns')
          .insert({
            battery_id: pattern.batteryId,
            charging_frequency: pattern.chargingFrequency,
            discharge_depth: pattern.dischargeDepth,
            charge_duration: pattern.chargeDuration,
            operating_temperature: pattern.operatingTemperature,
            last_updated: pattern.lastUpdated
          });
        
        if (patternError) {
          console.error(`Error seeding usage pattern for battery ${battery.id}:`, patternError);
        }
      }
      
      // Get and insert recommendations
      const recommendations = await memStorage.getRecommendations(battery.id);
      for (const rec of recommendations) {
        const { error: recError } = await supabase
          .from('recommendations')
          .insert({
            battery_id: rec.batteryId,
            type: rec.type,
            message: rec.message,
            created_at: rec.createdAt,
            resolved: rec.resolved
          });
        
        if (recError) {
          console.error(`Error seeding recommendation for battery ${battery.id}:`, recError);
        }
      }
    }
    
    console.log('Demo data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error in seedDemoData:', error);
    return false;
  }
}

/**
 * Main setup function - create tables and seed data if needed
 */
export async function setupSupabase() {
  try {
    // Create tables if they don't exist
    const tablesCreated = await createTables();
    if (!tablesCreated) {
      console.error('Failed to create tables');
      return false;
    }
    
    // Check and seed data if needed
    const dataSeedSuccessful = await checkAndSeedData();
    if (!dataSeedSuccessful) {
      console.warn('Warning: Failed to check or seed data');
      // Continue anyway since tables exist
    }
    
    console.log('Supabase setup completed!');
    return true;
  } catch (error) {
    console.error('Error in setupSupabase:', error);
    return false;
  }
}