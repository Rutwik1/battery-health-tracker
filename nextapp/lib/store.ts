'use client';

import { create } from 'zustand';
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/types';

/**
 * Battery store using Zustand for state management
 * This replaces the React Query implementation in the original app
 * with a more Next.js friendly approach using Zustand
 */
interface BatteryStore {
  // State
  batteries: Battery[];
  batteryHistories: Map<number, BatteryHistory[]>;
  usagePatterns: Map<number, UsagePattern>;
  recommendations: Map<number, Recommendation[]>;
  selectedBatteryId: number | null;
  isLoading: boolean;
  
  // Actions
  fetchBatteries: () => Promise<void>;
  fetchBatteryHistory: (batteryId: number) => Promise<BatteryHistory[]>;
  fetchUsagePattern: (batteryId: number) => Promise<UsagePattern | undefined>;
  fetchRecommendations: (batteryId: number) => Promise<Recommendation[]>;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, battery: Partial<Battery>) => Promise<Battery | undefined>;
  deleteBattery: (id: number) => Promise<boolean>;
  setSelectedBatteryId: (id: number | null) => void;
}

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  selectedBatteryId: null,
  isLoading: false,
  
  // Actions
  fetchBatteries: async () => {
    set({ isLoading: true });
    
    try {
      // In a real app, we would fetch from an API endpoint
      // const response = await fetch('/api/batteries');
      // const batteries = await response.json();
      
      // For demo purposes, generate some demo batteries
      const batteries = generateDemoBatteries();
      
      set({ 
        batteries, 
        isLoading: false,
        // If there's a selected battery ID but it's not in the data, reset it
        selectedBatteryId: batteries.some(b => b.id === get().selectedBatteryId) 
          ? get().selectedBatteryId 
          : (batteries.length > 0 ? batteries[0].id : null)
      });
    } catch (error) {
      console.error('Error fetching batteries:', error);
      set({ isLoading: false });
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    // Check if we already have history for this battery
    if (get().batteryHistories.has(batteryId)) {
      return get().batteryHistories.get(batteryId) || [];
    }
    
    // Otherwise generate and store it
    const history = generateBatteryHistory(batteryId);
    set(state => ({
      batteryHistories: new Map(state.batteryHistories).set(batteryId, history)
    }));
    
    return history;
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    // Check if we already have a usage pattern for this battery
    if (get().usagePatterns.has(batteryId)) {
      return get().usagePatterns.get(batteryId);
    }
    
    // Otherwise generate and store it
    const pattern = generateUsagePattern(batteryId);
    set(state => ({
      usagePatterns: new Map(state.usagePatterns).set(batteryId, pattern)
    }));
    
    return pattern;
  },
  
  fetchRecommendations: async (batteryId: number) => {
    // Check if we already have recommendations for this battery
    if (get().recommendations.has(batteryId)) {
      return get().recommendations.get(batteryId) || [];
    }
    
    // Otherwise generate and store them
    const recs = generateRecommendations(batteryId);
    set(state => ({
      recommendations: new Map(state.recommendations).set(batteryId, recs)
    }));
    
    return recs;
  },
  
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    // In a real app, we'd post to an API
    // const response = await fetch('/api/batteries', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(batteryData)
    // });
    // const newBattery = await response.json();
    
    // For demo purposes, create a new battery with an auto-increment ID
    const currentBatteries = get().batteries;
    const maxId = currentBatteries.length > 0 
      ? Math.max(...currentBatteries.map(b => b.id)) 
      : 0;
    
    const newBattery: Battery = {
      id: maxId + 1,
      ...batteryData
    };
    
    set(state => ({
      batteries: [...state.batteries, newBattery]
    }));
    
    return newBattery;
  },
  
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    const currentBatteries = get().batteries;
    const battery = currentBatteries.find(b => b.id === id);
    
    if (!battery) return undefined;
    
    // In a real app, we'd patch to an API
    // const response = await fetch(`/api/batteries/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(batteryUpdate)
    // });
    // const updatedBattery = await response.json();
    
    const updatedBattery = { ...battery, ...batteryUpdate };
    
    set(state => ({
      batteries: state.batteries.map(b => 
        b.id === id ? updatedBattery : b
      )
    }));
    
    return updatedBattery;
  },
  
  deleteBattery: async (id: number) => {
    // In a real app, we'd call delete on the API
    // await fetch(`/api/batteries/${id}`, {
    //   method: 'DELETE'
    // });
    
    set(state => ({
      batteries: state.batteries.filter(b => b.id !== id),
      // If the deleted battery was selected, clear the selection
      selectedBatteryId: state.selectedBatteryId === id ? null : state.selectedBatteryId
    }));
    
    return true;
  },
  
  setSelectedBatteryId: (id: number | null) => {
    set({ selectedBatteryId: id });
  }
}));

// Helper functions to generate demo data
function generateDemoBatteries(): Battery[] {
  return [
    {
      id: 1,
      name: "Battery #1",
      serialNumber: "BAT-123456",
      model: "Lithium-Ion 5000mAh",
      manufacturer: "PowerTech",
      manufactureDate: "2024-01-15",
      capacity: 5000,
      voltage: 3.7,
      cycleCount: 120,
      health: 92,
      status: "Normal",
      lastChecked: "2025-05-14T10:30:00"
    },
    {
      id: 2,
      name: "Battery #2",
      serialNumber: "BAT-789012",
      model: "Lithium-Polymer 4000mAh",
      manufacturer: "EnergyCell",
      manufactureDate: "2023-11-05",
      capacity: 4000,
      voltage: 3.8,
      cycleCount: 210,
      health: 86,
      status: "Normal",
      lastChecked: "2025-05-14T09:15:00"
    },
    {
      id: 3,
      name: "Battery #3",
      serialNumber: "BAT-345678",
      model: "Lithium-Ion 3500mAh",
      manufacturer: "PowerTech",
      manufactureDate: "2023-08-20",
      capacity: 3500,
      voltage: 3.6,
      cycleCount: 350,
      health: 78,
      status: "Warning",
      lastChecked: "2025-05-13T14:45:00"
    },
    {
      id: 4,
      name: "Battery #4",
      serialNumber: "BAT-901234",
      model: "Lithium-Polymer 6000mAh",
      manufacturer: "MegaCell",
      manufactureDate: "2024-02-10",
      capacity: 6000,
      voltage: 3.9,
      cycleCount: 85,
      health: 95,
      status: "Charging",
      lastChecked: "2025-05-14T12:00:00"
    }
  ];
}

function generateBatteryHistory(batteryId: number): BatteryHistory[] {
  const history: BatteryHistory[] = [];
  const battery = generateDemoBatteries().find(b => b.id === batteryId);
  
  if (!battery) return [];
  
  // Generate 12 months of history data with slight degradation
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);
  
  const initialHealth = Math.min(100, battery.health + 8); // Start with better health
  const initialCapacity = battery.capacity * (initialHealth / 100);
  const initialCycles = Math.max(0, battery.cycleCount - 120); // Start with fewer cycles
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    
    // Calculate degradation over time
    const healthDegradation = (i * 0.7);
    const health = initialHealth - healthDegradation;
    const capacity = initialCapacity - (initialCapacity * (healthDegradation / 100));
    const cycles = initialCycles + (i * 10);
    
    history.push({
      id: (batteryId * 100) + i,
      batteryId,
      date: date.toISOString(),
      health,
      voltage: battery.voltage - (i * 0.01),
      capacity,
      temperature: 25 + (Math.random() * 10 - 5), // Random temperature between 20-30°C
      cycleCount: cycles
    });
  }
  
  return history;
}

function generateUsagePattern(batteryId: number): UsagePattern {
  const usageTypes = ["Light", "Moderate", "Heavy", "Cyclic", "Standby"];
  const environments = ["Controlled", "Variable", "Extreme", "Optimal", "Indoor"];
  const peakTimes = ["Morning", "Afternoon", "Evening", "Night", "Continuous"];
  
  return {
    id: batteryId,
    batteryId,
    chargingFrequency: Math.floor(Math.random() * 4) + 1, // 1-5 times per day
    averageDischargeRate: Math.floor(Math.random() * 20) + 5, // 5-25% per hour
    deepDischargeCount: Math.floor(Math.random() * 50), // 0-50 deep discharges
    peakUsageTime: peakTimes[Math.floor(Math.random() * peakTimes.length)],
    environmentalConditions: environments[Math.floor(Math.random() * environments.length)],
    usageType: usageTypes[Math.floor(Math.random() * usageTypes.length)]
  };
}

function generateRecommendations(batteryId: number): Recommendation[] {
  const battery = generateDemoBatteries().find(b => b.id === batteryId);
  const recommendations: Recommendation[] = [];
  
  if (!battery) return recommendations;
  
  // Add recommendations based on battery health
  if (battery.health < 80) {
    recommendations.push({
      id: (batteryId * 10) + 1,
      batteryId,
      type: "Maintenance",
      description: "Consider replacing the battery in the next 3-6 months as capacity has degraded below 80%.",
      priority: "Medium",
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      resolved: false
    });
  }
  
  if (battery.cycleCount > 300) {
    recommendations.push({
      id: (batteryId * 10) + 2,
      batteryId,
      type: "Warning",
      description: "Battery has exceeded 300 charge cycles. Monitor performance closely.",
      priority: "High",
      created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      resolved: false
    });
  }
  
  // Always add some optimization recommendation
  recommendations.push({
    id: (batteryId * 10) + 3,
    batteryId,
    type: "Optimization",
    description: "For optimal battery life, avoid exposing the battery to extreme temperatures.",
    priority: "Low",
    created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    resolved: true
  });
  
  return recommendations;
}