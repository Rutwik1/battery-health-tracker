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
  
  // Actions for data fetching
  fetchBatteries: async () => {
    try {
      set({ isLoading: true });
      
      // For development purposes, we'll use simulated data
      // In production, this would be replaced with an API call
      // const response = await fetch('/api/batteries');
      // const data = await response.json();
      
      const data = generateDemoBatteries();
      
      set({ 
        batteries: data,
        isLoading: false,
        // Select the first battery by default if none is selected
        selectedBatteryId: get().selectedBatteryId || (data.length > 0 ? data[0].id : null)
      });
      
      return data;
    } catch (error) {
      console.error('Failed to fetch batteries:', error);
      set({ isLoading: false });
      return [];
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    try {
      // Check if we already have this battery's history
      if (get().batteryHistories.has(batteryId)) {
        return get().batteryHistories.get(batteryId) || [];
      }
      
      // For development, use simulated data
      // In production, this would be an API call
      // const response = await fetch(`/api/batteries/${batteryId}/history`);
      // const data = await response.json();
      
      const data = generateBatteryHistory(batteryId);
      
      // Update state with the new history data
      set((state) => ({
        batteryHistories: new Map(state.batteryHistories).set(batteryId, data)
      }));
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch history for battery ${batteryId}:`, error);
      return [];
    }
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    try {
      // Check if we already have this battery's usage pattern
      if (get().usagePatterns.has(batteryId)) {
        return get().usagePatterns.get(batteryId);
      }
      
      // For development, use simulated data
      // In production, this would be an API call
      // const response = await fetch(`/api/batteries/${batteryId}/usage`);
      // const data = await response.json();
      
      const data = generateUsagePattern(batteryId);
      
      // Update state with the new usage pattern
      set((state) => ({
        usagePatterns: new Map(state.usagePatterns).set(batteryId, data)
      }));
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch usage pattern for battery ${batteryId}:`, error);
      return undefined;
    }
  },
  
  fetchRecommendations: async (batteryId: number) => {
    try {
      // Check if we already have recommendations for this battery
      if (get().recommendations.has(batteryId)) {
        return get().recommendations.get(batteryId) || [];
      }
      
      // For development, use simulated data
      // In production, this would be an API call
      // const response = await fetch(`/api/batteries/${batteryId}/recommendations`);
      // const data = await response.json();
      
      const data = generateRecommendations(batteryId);
      
      // Update state with the new recommendations
      set((state) => ({
        recommendations: new Map(state.recommendations).set(batteryId, data)
      }));
      
      return data;
    } catch (error) {
      console.error(`Failed to fetch recommendations for battery ${batteryId}:`, error);
      return [];
    }
  },
  
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    try {
      // For development, use simulated data
      // In production, this would be an API call with real data
      // const response = await fetch('/api/batteries', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(batteryData)
      // });
      // const newBattery = await response.json();
      
      // Simulate adding a new battery with an auto-incremented ID
      const maxId = Math.max(0, ...get().batteries.map(b => b.id));
      const newBattery: Battery = {
        ...batteryData,
        id: maxId + 1,
        lastChecked: new Date().toISOString()
      };
      
      // Update state with the new battery
      set((state) => ({
        batteries: [...state.batteries, newBattery]
      }));
      
      return newBattery;
    } catch (error) {
      console.error('Failed to add battery:', error);
      throw error;
    }
  },
  
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    try {
      // For development, use simulated data
      // In production, this would be an API call
      // const response = await fetch(`/api/batteries/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(batteryUpdate)
      // });
      // const updatedBattery = await response.json();
      
      // Find the battery to update
      const batteryToUpdate = get().batteries.find(b => b.id === id);
      if (!batteryToUpdate) return undefined;
      
      // Create the updated battery
      const updatedBattery: Battery = {
        ...batteryToUpdate,
        ...batteryUpdate,
        lastChecked: new Date().toISOString()
      };
      
      // Update state with the modified battery
      set((state) => ({
        batteries: state.batteries.map(b => b.id === id ? updatedBattery : b)
      }));
      
      return updatedBattery;
    } catch (error) {
      console.error(`Failed to update battery ${id}:`, error);
      return undefined;
    }
  },
  
  deleteBattery: async (id: number) => {
    try {
      // For development, use simulated data
      // In production, this would be an API call
      // await fetch(`/api/batteries/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Update state by removing the battery
      set((state) => ({
        batteries: state.batteries.filter(b => b.id !== id),
        selectedBatteryId: state.selectedBatteryId === id ? null : state.selectedBatteryId
      }));
      
      return true;
    } catch (error) {
      console.error(`Failed to delete battery ${id}:`, error);
      return false;
    }
  },
  
  setSelectedBatteryId: (id: number | null) => {
    set({ selectedBatteryId: id });
  }
}));

// Demo data generation functions
function generateDemoBatteries(): Battery[] {
  return [
    {
      id: 1,
      name: "EV Battery Pack A",
      serialNumber: "BP-2025-001",
      model: "LithiumPro 90kWh",
      manufacturer: "ElectraTech",
      manufactureDate: "2024-01-15",
      capacity: 90000, // mAh
      voltage: 380.4, // V
      cycleCount: 124,
      health: 96, // percentage
      status: "active", // active, charging, idle, error
      lastChecked: "2025-05-15T08:30:00Z"
    },
    {
      id: 2,
      name: "Solar Storage B",
      serialNumber: "SS-2024-085",
      model: "SolarCell 50kWh",
      manufacturer: "PowerBank Inc",
      manufactureDate: "2024-03-22",
      capacity: 50000, // mAh
      voltage: 48.2, // V
      cycleCount: 58,
      health: 98, // percentage
      status: "charging", // active, charging, idle, error
      lastChecked: "2025-05-15T09:15:00Z"
    },
    {
      id: 3,
      name: "Industrial UPS C",
      serialNumber: "UPS-2023-442",
      model: "BackupMaster 30kWh",
      manufacturer: "GridSafe Technologies",
      manufactureDate: "2023-11-10",
      capacity: 30000, // mAh
      voltage: 220.0, // V
      cycleCount: 312,
      health: 78, // percentage
      status: "active", // active, charging, idle, error
      lastChecked: "2025-05-15T07:45:00Z"
    },
    {
      id: 4,
      name: "Mining Equipment D",
      serialNumber: "ME-2023-108",
      model: "HeavyDuty 120kWh",
      manufacturer: "IndustrialPower Co",
      manufactureDate: "2023-05-18",
      capacity: 120000, // mAh
      voltage: 510.5, // V
      cycleCount: 587,
      health: 62, // percentage
      status: "error", // active, charging, idle, error
      lastChecked: "2025-05-15T06:10:00Z"
    }
  ];
}

function generateBatteryHistory(batteryId: number): BatteryHistory[] {
  // Generate history data for the past 30 days
  const history: BatteryHistory[] = [];
  const now = new Date();
  
  // Set up initial values based on battery ID to make them unique
  let healthBase = batteryId === 1 ? 98 : 
                  batteryId === 2 ? 99 : 
                  batteryId === 3 ? 85 : 70;
  
  let voltageBase = batteryId === 1 ? 380 : 
                   batteryId === 2 ? 48 : 
                   batteryId === 3 ? 220 : 510;
  
  let capacityBase = batteryId === 1 ? 90000 : 
                    batteryId === 2 ? 50000 : 
                    batteryId === 3 ? 30000 : 120000;
  
  let cycleCountBase = batteryId === 1 ? 100 : 
                       batteryId === 2 ? 40 : 
                       batteryId === 3 ? 290 : 550;
  
  // Create entries with slight variations for the past 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Make values degrade slightly over time
    const dailyHealthChange = (Math.random() * 0.15) - 0.05; // Between -0.05 and 0.1
    const dailyVoltageChange = (Math.random() * 0.2) - 0.05; // Between -0.05 and 0.15
    const dailyCapacityChange = (Math.random() * 100) - 20; // Between -20 and 80
    
    healthBase = Math.max(0, Math.min(100, healthBase - dailyHealthChange));
    voltageBase = Math.max(1, voltageBase + dailyVoltageChange);
    capacityBase = Math.max(1, capacityBase - dailyCapacityChange);
    
    // Add entry with random fluctuations
    history.push({
      id: batteryId * 1000 + i,
      batteryId: batteryId,
      date: date.toISOString(),
      health: Math.round(healthBase * 10) / 10,
      voltage: Math.round(voltageBase * 10) / 10,
      capacity: Math.round(capacityBase),
      temperature: Math.round((20 + Math.random() * 15) * 10) / 10, // 20°C to 35°C
      cycleCount: cycleCountBase + (29 - i) // Cycles increase with time
    });
  }
  
  return history;
}

function generateUsagePattern(batteryId: number): UsagePattern {
  // Generate unique usage patterns based on battery ID
  switch (batteryId) {
    case 1:
      return {
        id: 1,
        batteryId: 1,
        chargingFrequency: 2.5, // times per day
        averageDischargeRate: 0.3, // percentage per minute
        deepDischargeCount: 12,
        peakUsageTime: "Morning",
        environmentalConditions: "Indoor, Controlled",
        usageType: "Light"
      };
    case 2:
      return {
        id: 2,
        batteryId: 2,
        chargingFrequency: 3.8,
        averageDischargeRate: 0.5,
        deepDischargeCount: 5,
        peakUsageTime: "Evening",
        environmentalConditions: "Indoor, Variable",
        usageType: "Moderate"
      };
    case 3:
      return {
        id: 3,
        batteryId: 3,
        chargingFrequency: 6.2,
        averageDischargeRate: 0.8,
        deepDischargeCount: 28,
        peakUsageTime: "Afternoon",
        environmentalConditions: "Mixed Indoor/Outdoor",
        usageType: "Heavy"
      };
    case 4:
    default:
      return {
        id: 4,
        batteryId: 4,
        chargingFrequency: 8.5,
        averageDischargeRate: 1.2,
        deepDischargeCount: 102,
        peakUsageTime: "Continuous",
        environmentalConditions: "Outdoor, Extreme",
        usageType: "Industrial"
      };
  }
}

function generateRecommendations(batteryId: number): Recommendation[] {
  // Base recommendations that apply to all batteries
  const baseRecommendations: Recommendation[] = [
    {
      id: batteryId * 10 + 1,
      batteryId: batteryId,
      type: "Maintenance",
      description: "Schedule routine health check-up for optimal performance",
      priority: "Medium",
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      resolved: false
    }
  ];
  
  // Add specific recommendations based on battery conditions
  const battery = generateDemoBatteries().find(b => b.id === batteryId);
  
  if (!battery) return baseRecommendations;
  
  // Array to collect all recommendations
  const recommendations: Recommendation[] = [...baseRecommendations];
  
  // Add recommendation based on health
  if (battery.health < 80) {
    recommendations.push({
      id: batteryId * 10 + 2,
      batteryId: batteryId,
      type: "Optimization",
      description: "Adjust charging cycle to improve longevity",
      priority: "Medium",
      created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      resolved: false
    });
  }
  
  // Add recommendation for batteries with low health
  if (battery.health < 70) {
    recommendations.push({
      id: batteryId * 10 + 3,
      batteryId: batteryId,
      type: "Warning",
      description: "Battery capacity significantly reduced. Consider reducing deep discharge frequency.",
      priority: "High",
      created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      resolved: false
    });
  }
  
  // Add critical recommendation for very low health
  if (battery.health < 50) {
    recommendations.push({
      id: batteryId * 10 + 4,
      batteryId: batteryId,
      type: "Critical",
      description: "Battery health critical. Schedule replacement within next 3 months.",
      priority: "Urgent",
      created: new Date().toISOString(), // Today
      resolved: false
    });
  }
  
  // Add recommendation based on cycle count
  if (battery.cycleCount > 300) {
    recommendations.push({
      id: batteryId * 10 + 5,
      batteryId: batteryId,
      type: "Alert",
      description: `High cycle count (${battery.cycleCount}). Monitor performance closely.`,
      priority: "Medium",
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      resolved: false
    });
  }
  
  return recommendations;
}