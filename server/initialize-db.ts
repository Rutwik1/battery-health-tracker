import { db } from './db';
import { batteries, batteryHistory, usagePatterns, recommendations, users } from '../shared/schema';
import { MemStorage } from './storage';

async function initializeDatabase() {
  console.log('Initializing Supabase database...');
  
  try {
    // Check if tables exist by trying to query the batteries table
    console.log('Checking for existing tables...');
    let tablesExist = false;
    
    try {
      await db.select().from(batteries).limit(1);
      tablesExist = true;
      console.log('Database tables already exist.');
    } catch (error) {
      console.log('Tables do not exist yet, creating them...');
    }
    
    if (!tablesExist) {
      // Create tables with proper relationships
      console.log('Creating database tables...');
      
      // Users table
      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `);
      
      // Batteries table
      await db.execute(`
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
      
      // Battery history table with foreign key
      await db.execute(`
        CREATE TABLE IF NOT EXISTS battery_history (
          id SERIAL PRIMARY KEY,
          battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
          date TIMESTAMP NOT NULL,
          capacity INTEGER NOT NULL,
          health_percentage REAL NOT NULL,
          cycle_count INTEGER NOT NULL
        );
      `);
      
      // Usage patterns table with foreign key
      await db.execute(`
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
      
      // Recommendations table with foreign key
      await db.execute(`
        CREATE TABLE IF NOT EXISTS recommendations (
          id SERIAL PRIMARY KEY,
          battery_id INTEGER NOT NULL REFERENCES batteries(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL,
          resolved BOOLEAN NOT NULL DEFAULT FALSE
        );
      `);
      
      console.log('All tables created successfully!');
    }
    
    // Check if data needs to be seeded
    const existingBatteries = await db.select().from(batteries);
    
    if (existingBatteries.length === 0) {
      console.log('No batteries found in database. Seeding with demo data...');
      
      // Use MemStorage to get demo data
      const memStorage = new MemStorage();
      
      // Get all batteries from memory storage
      const demoData = await memStorage.getBatteries();
      console.log(`Retrieved ${demoData.length} batteries from demo data.`);
      
      // Insert batteries one by one
      for (const battery of demoData) {
        // First insert the battery
        const [insertedBattery] = await db.insert(batteries).values({
          name: battery.name,
          serialNumber: battery.serialNumber,
          initialCapacity: battery.initialCapacity,
          currentCapacity: battery.currentCapacity,
          healthPercentage: battery.healthPercentage,
          cycleCount: battery.cycleCount,
          expectedCycles: battery.expectedCycles,
          status: battery.status,
          initialDate: battery.initialDate,
          lastUpdated: battery.lastUpdated,
          degradationRate: battery.degradationRate
        }).returning();
        
        console.log(`Inserted battery: ${insertedBattery.name} (ID: ${insertedBattery.id})`);
        
        // Get battery history from memory storage
        const historyItems = await memStorage.getBatteryHistory(battery.id);
        
        if (historyItems.length > 0) {
          // Insert history records for the battery
          for (const historyItem of historyItems) {
            await db.insert(batteryHistory).values({
              batteryId: insertedBattery.id,
              date: historyItem.date,
              capacity: historyItem.capacity,
              healthPercentage: historyItem.healthPercentage,
              cycleCount: historyItem.cycleCount
            });
          }
          console.log(`Inserted ${historyItems.length} history records for battery ${insertedBattery.id}`);
        }
        
        // Get usage pattern from memory storage
        const usagePattern = await memStorage.getUsagePattern(battery.id);
        
        if (usagePattern) {
          await db.insert(usagePatterns).values({
            batteryId: insertedBattery.id,
            chargingFrequency: usagePattern.chargingFrequency,
            dischargeDepth: usagePattern.dischargeDepth,
            chargeDuration: usagePattern.chargeDuration,
            operatingTemperature: usagePattern.operatingTemperature,
            lastUpdated: usagePattern.lastUpdated
          });
          console.log(`Inserted usage pattern for battery ${insertedBattery.id}`);
        }
        
        // Get recommendations from memory storage
        const batteryRecommendations = await memStorage.getRecommendations(battery.id);
        
        if (batteryRecommendations.length > 0) {
          for (const recommendation of batteryRecommendations) {
            await db.insert(recommendations).values({
              batteryId: insertedBattery.id,
              type: recommendation.type,
              message: recommendation.message,
              createdAt: recommendation.createdAt,
              resolved: recommendation.resolved
            });
          }
          console.log(`Inserted ${batteryRecommendations.length} recommendations for battery ${insertedBattery.id}`);
        }
      }
      
      console.log('Database seeded successfully with demo data.');
    } else {
      console.log(`Database already contains ${existingBatteries.length} batteries. Skipping seed.`);
    }
    
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

export { initializeDatabase };