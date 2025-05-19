/**
 * Battery data generator for realtime updates with DRAMATIC cycle count changes
 * This file contains functions to generate simulated battery data
 */

import { storage } from './storage';
import { InsertBattery, InsertBatteryHistory, InsertRecommendation } from '../shared/schema';

// Demo battery data for initial seeding
const demoBatteries = [
  {
    name: "Battery #1",
    serialNumber: "BAT-001",
    initialCapacity: 4000,
    currentCapacity: 3800,
    healthPercentage: 95,
    cycleCount: 8000,  // Start with high cycle counts
    expectedCycles: 1000,
    status: "Excellent",
    initialDate: "2023-05-12T00:00:00.000Z",
    lastUpdated: new Date().toISOString(),
    degradationRate: 0.5
  },
  {
    name: "Battery #2",
    serialNumber: "BAT-002",
    initialCapacity: 4000,
    currentCapacity: 3500,
    healthPercentage: 87,
    cycleCount: 8500, // Start with high cycle counts
    expectedCycles: 1000,
    status: "Good",
    initialDate: "2023-03-24T00:00:00.000Z",
    lastUpdated: new Date().toISOString(),
    degradationRate: 0.7
  },
  {
    name: "Battery #3",
    serialNumber: "BAT-003",
    initialCapacity: 4000,
    currentCapacity: 2900,
    healthPercentage: 72,
    cycleCount: 12000, // Start with high cycle counts
    expectedCycles: 1000,
    status: "Fair",
    initialDate: "2022-10-18T00:00:00.000Z",
    lastUpdated: new Date().toISOString(),
    degradationRate: 1.3
  },
  {
    name: "Battery #4",
    serialNumber: "BAT-004",
    initialCapacity: 4000,
    currentCapacity: 2300,
    healthPercentage: 57,
    cycleCount: 13000, // Start with high cycle counts
    expectedCycles: 1000,
    status: "Poor",
    initialDate: "2021-11-05T00:00:00.000Z",
    lastUpdated: new Date().toISOString(),
    degradationRate: 2.1
  }
];

// Smart recommendations templates
const recommendationTemplates = [
  {
    type: "success",
    message: "Battery {ID} is maintaining excellent health. Continue current usage patterns."
  },
  {
    type: "warning",
    message: "Battery {ID} discharge depth detected beyond optimal range. Consider shallower cycles."
  },
  {
    type: "warning",
    message: "High temperature detected during operation of Battery {ID}. Consider improved cooling."
  },
  {
    type: "error",
    message: "Battery {ID} nearing end of life with {HEALTH}% health. Plan for replacement."
  },
  {
    type: "info",
    message: "Scheduled maintenance due for Battery {ID} within 30 days."
  },
  {
    type: "info",
    message: "Battery {ID} performance optimized for current workload."
  }
];

/**
 * Create demo batteries if none exist
 */
export async function ensureDemoBatteries() {
  try {
    // Check if batteries exist
    const batteries = await storage.getBatteries();
    if (batteries.length === 0) {
      console.log('No batteries found, creating demo data...');

      // Create demo batteries
      for (const batteryData of demoBatteries) {
        const battery = await storage.createBattery(batteryData as InsertBattery);

        // Create initial history entry
        await storage.createBatteryHistory({
          batteryId: battery.id,
          date: new Date().toISOString(),
          capacity: battery.currentCapacity,
          healthPercentage: battery.healthPercentage,
          cycleCount: battery.cycleCount
        } as InsertBatteryHistory);

        // Create initial recommendation
        const randomRec = recommendationTemplates[Math.floor(Math.random() * 3)];
        await storage.createRecommendation({
          batteryId: battery.id,
          type: randomRec.type,
          message: randomRec.message.replace('{ID}', battery.name).replace('{HEALTH}', battery.healthPercentage.toString()),
          createdAt: new Date().toISOString(),
          resolved: false
        } as InsertRecommendation);
      }

      // Add the general recommendation for all batteries
      await storage.createRecommendation({
        batteryId: 0, // 0 indicates a general recommendation for all batteries
        type: "info",
        message: "Optimal charging practice: keep all batteries between 20% and 80%.",
        createdAt: new Date().toISOString(),
        resolved: false
      } as InsertRecommendation);

      console.log('Demo data created successfully!');
    } else {
      console.log(`Found ${batteries.length} existing batteries, skipping demo data creation.`);

      // Force cycle updates for existing batteries
      for (const battery of batteries) {
        // Only force update if cycle count is below a threshold
        if (battery.cycleCount < 5000) {
          // Set high cycle counts for existing batteries
          await storage.updateBattery(battery.id, {
            cycleCount: Math.floor(Math.random() * 5000) + 8000, // 8000-13000 cycles
            lastUpdated: new Date().toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
}

/**
 * Make dramatic cycle count jumps (EXACTLY 2000-4000 range)
 */
async function makeDramaticCycleCountJump(battery) {
  // Force direction to alternate for more visible changes
  const randomValue = Math.random();
  const direction = randomValue > 0.5 ? 1 : -1;

  // Exact jump value between 2000-4000
  const jumpValue = Math.floor(Math.random() * 2001) + 2000; // 2000-4000 range exactly

  // Prevent negative cycle counts
  let newCycleCount;
  if (direction === -1 && battery.cycleCount < jumpValue) {
    // If we can't subtract, add instead to ensure dramatic change
    newCycleCount = battery.cycleCount + jumpValue;
  } else {
    newCycleCount = battery.cycleCount + (direction * jumpValue);
  }

  // Also make dramatic health change
  const healthDirection = Math.random() > 0.5 ? 1 : -1;
  const healthJump = Math.floor(Math.random() * 16) + 10; // 10-25% jump
  let newHealth = battery.healthPercentage + (healthDirection * healthJump);

  // Keep health within valid range
  if (newHealth > 100) newHealth = 100;
  if (newHealth < 0) newHealth = 0;

  // Set status based on health
  let newStatus = "Excellent";
  if (newHealth < 90) newStatus = "Good";
  if (newHealth < 80) newStatus = "Fair";
  if (newHealth < 70) newStatus = "Poor";

  // Calculate capacity based on health
  const newCapacity = Math.round((battery.initialCapacity * newHealth) / 100);

  // Log the dramatic jump (for verification)
  console.log(`DRAMATIC CYCLE JUMP for ${battery.name}: ${battery.cycleCount} → ${newCycleCount} (${direction > 0 ? '+' : '-'}${jumpValue} cycles)`);
  console.log(`DRAMATIC HEALTH JUMP for ${battery.name}: ${battery.healthPercentage}% → ${newHealth}% (${healthDirection > 0 ? '+' : '-'}${healthJump}%)`);

  // Apply the dramatic update
  return await storage.updateBattery(battery.id, {
    cycleCount: newCycleCount,
    healthPercentage: parseFloat(newHealth.toFixed(2)),
    currentCapacity: newCapacity,
    status: newStatus,
    lastUpdated: new Date().toISOString()
  });
}

/**
 * Generate a simulated battery update with dramatic changes
 */
export async function generateBatteryUpdate() {
  try {
    // Get all batteries
    const batteries = await storage.getBatteries();
    if (!batteries.length) return;

    // Pick a random battery
    const batteryIndex = Math.floor(Math.random() * batteries.length);
    const battery = batteries[batteryIndex];

    // Make dramatic cycle count jump with extreme changes
    const updatedBattery = await makeDramaticCycleCountJump(battery);

    // Log the update
    console.log(`Updated battery ${battery.id}: Health=${updatedBattery.healthPercentage}%, Cycles=${updatedBattery.cycleCount}`);

    // Create history record
    const historyEntry = await storage.createBatteryHistory({
      batteryId: battery.id,
      date: new Date().toISOString(),
      capacity: updatedBattery.currentCapacity,
      healthPercentage: updatedBattery.healthPercentage,
      cycleCount: updatedBattery.cycleCount
    } as InsertBatteryHistory);

    // Broadcast update if websocket is available
    if ((global as any).broadcastBatteryUpdate) {
      (global as any).broadcastBatteryUpdate({
        battery: updatedBattery,
        history: historyEntry
      });
    }

    // Occasionally generate recommendations (low probability)
    if (Math.random() < 0.05) {
      const randomRec = recommendationTemplates[Math.floor(Math.random() * recommendationTemplates.length)];
      await storage.createRecommendation({
        batteryId: battery.id,
        type: randomRec.type,
        message: randomRec.message.replace('{ID}', battery.name).replace('{HEALTH}', updatedBattery.healthPercentage.toString()),
        createdAt: new Date().toISOString(),
        resolved: false
      } as InsertRecommendation);
      console.log(`Generated recommendation for ${battery.name}`);
    }

    return updatedBattery;
  } catch (error) {
    console.error('Error generating dramatic battery update:', error);
    return null;
  }
}

/**
 * Force significant updates to all batteries simultaneously
 */
async function forceSignificantUpdates() {
  console.log("Forcing significant battery updates");

  try {
    const batteries = await storage.getBatteries();

    // Update all batteries with dramatic jumps
    for (const battery of batteries) {
      await makeDramaticCycleCountJump(battery);
    }
  } catch (error) {
    console.error("Error forcing significant updates:", error);
  }
}

/**
 * Start the data generation process
 */
export function startDataGeneration() {
  // First ensure we have demo batteries
  ensureDemoBatteries().then(() => {
    console.log('Starting data generation with DRAMATIC cycle count changes...');

    // Generate single battery updates every 2 seconds
    setInterval(generateBatteryUpdate, 2000);

    // Force updates to ALL batteries every 5 seconds for more dramatic effect
    setInterval(forceSignificantUpdates, 5000);
  });
}