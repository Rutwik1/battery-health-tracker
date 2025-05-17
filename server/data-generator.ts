/**
 * Battery data generator for realtime updates
 * This file contains functions to generate simulated battery data
 */

import { storage } from './storage';
import { InsertBattery, InsertBatteryHistory, InsertRecommendation } from '../shared/schema';

// Demo battery data for initial seeding
const demoBatteries = [
  {
    name: "EV Battery Pack A",
    serialNumber: "BT-2025-0001",
    initialCapacity: 75000,
    currentCapacity: 70500,
    healthPercentage: 94,
    cycleCount: 124,
    expectedCycles: 1500,
    status: "Excellent",
    initialDate: new Date(2024, 9, 15).toISOString(),
    lastUpdated: new Date().toISOString(),
    degradationRate: 0.5
  },
  {
    name: "Laptop Battery X1",
    serialNumber: "LT-2025-0042",
    initialCapacity: 6500,
    currentCapacity: 5850,
    healthPercentage: 90,
    cycleCount: 285,
    expectedCycles: 800,
    status: "Good",
    initialDate: new Date(2024, 6, 3).toISOString(),
    lastUpdated: new Date().toISOString(),
    degradationRate: 0.7
  },
  {
    name: "Industrial UPS Cell",
    serialNumber: "IND-2024-0187",
    initialCapacity: 150000,
    currentCapacity: 120000,
    healthPercentage: 80,
    cycleCount: 352,
    expectedCycles: 2000,
    status: "Fair",
    initialDate: new Date(2024, 1, 20).toISOString(),
    lastUpdated: new Date().toISOString(),
    degradationRate: 1.2
  },
  {
    name: "Smartphone Battery",
    serialNumber: "SP-2025-0298",
    initialCapacity: 4500,
    currentCapacity: 3150,
    healthPercentage: 70,
    cycleCount: 498,
    expectedCycles: 600,
    status: "Poor",
    initialDate: new Date(2024, 3, 10).toISOString(),
    lastUpdated: new Date().toISOString(),
    degradationRate: 2.1
  }
];

// Smart recommendations templates
const recommendationTemplates = [
  { 
    type: "info", 
    message: "Avoid charging Battery {ID} beyond 90% to extend lifespan." 
  },
  { 
    type: "warning", 
    message: "Battery {ID} discharge depth detected beyond optimal range. Consider shallower cycles." 
  },
  { 
    type: "success", 
    message: "Battery {ID} is maintaining excellent health. Continue current usage patterns."
  },
  { 
    type: "info", 
    message: "Optimal charging practice: keep all batteries between 20% and 80%."
  },
  { 
    type: "warning", 
    message: "High temperature detected during operation of Battery {ID}. Consider improved cooling."
  },
  { 
    type: "error", 
    message: "Battery {ID} nearing end of life with {HEALTH}% health. Plan for replacement."
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
    }
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
}

/**
 * Generate a simulated battery update
 * This is run periodically to update battery data
 */
export async function generateBatteryUpdate() {
  try {
    const batteries = await storage.getBatteries();
    if (batteries.length === 0) return;
    
    // Pick a random battery to update
    const batteryIndex = Math.floor(Math.random() * batteries.length);
    const battery = batteries[batteryIndex];
    
    // Generate a random change in health (small degradation)
    const healthChange = Math.random() * 0.5;
    let newHealth = battery.healthPercentage - healthChange;
    if (newHealth < 0) newHealth = 0;
    
    // Generate a random change in capacity (aligned with health change)
    const capacityChange = (battery.initialCapacity * healthChange) / 100;
    let newCapacity = battery.currentCapacity - capacityChange;
    if (newCapacity < 0) newCapacity = 0;
    
    // Increment cycle count
    const cycleIncrement = Math.floor(Math.random() * 3) + 1; // 1-3 cycles
    const newCycleCount = battery.cycleCount + cycleIncrement;
    
    // Update battery status based on health
    let newStatus = "Excellent";
    if (newHealth < 95) newStatus = "Good";
    if (newHealth < 80) newStatus = "Fair";
    if (newHealth < 70) newStatus = "Poor";
    
    // Update the battery
    const updatedBattery = await storage.updateBattery(battery.id, {
      currentCapacity: Math.round(newCapacity),
      healthPercentage: parseFloat(newHealth.toFixed(2)),
      cycleCount: newCycleCount,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    });
    
    // Add new history entry
    if (updatedBattery) {
      const historyEntry = await storage.createBatteryHistory({
        batteryId: battery.id,
        date: new Date().toISOString(),
        capacity: updatedBattery.currentCapacity,
        healthPercentage: updatedBattery.healthPercentage,
        cycleCount: updatedBattery.cycleCount
      } as InsertBatteryHistory);
      
      console.log(`Generated update for ${battery.name}: Health=${updatedBattery.healthPercentage}%, Cycles=${updatedBattery.cycleCount}`);
      
      // Broadcast the update to all connected WebSocket clients
      if ((global as any).broadcastBatteryUpdate) {
        (global as any).broadcastBatteryUpdate({
          battery: updatedBattery,
          history: historyEntry
        });
      }
      
      // Randomly generate a recommendation (10% chance)
      if (Math.random() < 0.1) {
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
    }
  } catch (error) {
    console.error('Error generating battery update:', error);
  }
}

/**
 * Start the data generation process
 * This runs periodically to simulate realtime data
 */
export function startDataGeneration() {
  // First ensure we have demo batteries
  ensureDemoBatteries().then(() => {
    // Then start generating updates periodically
    console.log('Starting periodic data generation...');
    
    // Generate data every 15 seconds
    setInterval(generateBatteryUpdate, 15000);
  });
}