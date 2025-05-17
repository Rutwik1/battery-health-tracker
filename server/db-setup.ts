import { db } from './db';
// import * as schema from '../shared/schema';
import * as schema from '../shared/schema';

import { MemStorage } from './storage';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

async function setup() {
  console.log('Setting up database...');

  try {
    // Run migrations (creates tables if they don't exist)
    console.log('Creating database tables...');

    // Push the schema to the database (this creates the tables)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS batteries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        "serialNumber" TEXT NOT NULL,
        "initialCapacity" INTEGER NOT NULL,
        "currentCapacity" INTEGER NOT NULL,
        "healthPercentage" REAL NOT NULL,
        "cycleCount" INTEGER NOT NULL,
        "expectedCycles" INTEGER NOT NULL,
        status TEXT NOT NULL,
        "initialDate" TIMESTAMP NOT NULL,
        "lastUpdated" TIMESTAMP NOT NULL,
        "degradationRate" REAL NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS battery_history (
        id SERIAL PRIMARY KEY,
        "batteryId" INTEGER NOT NULL REFERENCES batteries(id),
        date TIMESTAMP NOT NULL,
        "healthPercentage" REAL NOT NULL,
        "capacityLevel" REAL NOT NULL,
        "cycleCount" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS usage_patterns (
        id SERIAL PRIMARY KEY,
        "batteryId" INTEGER NOT NULL REFERENCES batteries(id),
        "chargingFrequency" TEXT NOT NULL,
        "dischargeRate" REAL NOT NULL,
        "temperatureExposure" TEXT NOT NULL,
        "deepDischargeFrequency" TEXT NOT NULL,
        "fastChargingUsage" TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        "batteryId" INTEGER NOT NULL REFERENCES batteries(id),
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        priority TEXT NOT NULL,
        resolved BOOLEAN NOT NULL,
        "createdAt" TIMESTAMP NOT NULL
      );
    `);

    console.log('Tables created successfully!');

    // Optionally seed with demo data
    console.log('Checking for existing data...');
    const existingBatteries = await db.select().from(schema.batteries);

    if (existingBatteries.length === 0) {
      console.log('No existing data found. Seeding demo data...');

      // Use the MemStorage's demo data to seed the database
      const memStorage = new MemStorage();

      // Get demo data from mem storage
      const batteries = await memStorage.getBatteries();

      // Insert batteries
      for (const battery of batteries) {
        // Insert battery
        const [newBattery] = await db.insert(schema.batteries).values({
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

        console.log(`Added battery: ${newBattery.name}`);

        // Get battery history
        const historyItems = await memStorage.getBatteryHistory(battery.id);

        // Insert history items
        for (const history of historyItems) {
          await db.insert(schema.batteryHistory).values({
            batteryId: newBattery.id,
            date: history.date,
            healthPercentage: history.healthPercentage,
            capacityLevel: history.capacityLevel,
            cycleCount: history.cycleCount
          });
        }

        console.log(`Added ${historyItems.length} history items for ${newBattery.name}`);

        // Get and insert usage pattern
        const pattern = await memStorage.getUsagePattern(battery.id);
        if (pattern) {
          await db.insert(schema.usagePatterns).values({
            batteryId: newBattery.id,
            chargingFrequency: pattern.chargingFrequency,
            dischargeRate: pattern.dischargeRate,
            temperatureExposure: pattern.temperatureExposure,
            deepDischargeFrequency: pattern.deepDischargeFrequency,
            fastChargingUsage: pattern.fastChargingUsage
          });

          console.log(`Added usage pattern for ${newBattery.name}`);
        }

        // Get and insert recommendations
        const recommendations = await memStorage.getRecommendations(battery.id);
        for (const recommendation of recommendations) {
          await db.insert(schema.recommendations).values({
            batteryId: newBattery.id,
            type: recommendation.type,
            description: recommendation.description,
            priority: recommendation.priority,
            resolved: recommendation.resolved,
            createdAt: recommendation.createdAt
          });
        }

        console.log(`Added ${recommendations.length} recommendations for ${newBattery.name}`);
      }

      console.log('Database seeded successfully!');
    } else {
      console.log(`Found ${existingBatteries.length} existing batteries. Skipping seed.`);
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Only run this if executed directly (not imported)
if (require.main === module) {
  setup().catch(console.error);
}

export { setup };