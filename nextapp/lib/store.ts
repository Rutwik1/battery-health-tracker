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

const API_BASE = '';

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  selectedBatteryId: null,
  isLoading: true,
  
  // Fetch all batteries
  fetchBatteries: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_BASE}/api/batteries`);
      if (!response.ok) throw new Error('Failed to fetch batteries');
      
      const data = await response.json();
      set({ batteries: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching batteries:', error);
      set({ 
        batteries: generateDemoBatteries(), 
        isLoading: false 
      });
    }
  },
  
  // Fetch battery history for a specific battery
  fetchBatteryHistory: async (batteryId: number) => {
    try {
      const currentHistories = get().batteryHistories;
      
      // Return cached data if available
      if (currentHistories.has(batteryId)) {
        return currentHistories.get(batteryId)!;
      }
      
      const response = await fetch(`${API_BASE}/api/batteries/${batteryId}/history`);
      if (!response.ok) throw new Error(`Failed to fetch history for battery ${batteryId}`);
      
      const data = await response.json();
      const newHistories = new Map(currentHistories);
      newHistories.set(batteryId, data);
      
      set({ batteryHistories: newHistories });
      return data;
    } catch (error) {
      console.error(`Error fetching history for battery ${batteryId}:`, error);
      
      // Generate demo data on error
      const demoHistory = generateBatteryHistory(batteryId);
      const currentHistories = get().batteryHistories;
      const newHistories = new Map(currentHistories);
      newHistories.set(batteryId, demoHistory);
      
      set({ batteryHistories: newHistories });
      return demoHistory;
    }
  },
  
  // Fetch usage pattern for a specific battery
  fetchUsagePattern: async (batteryId: number) => {
    try {
      const currentPatterns = get().usagePatterns;
      
      // Return cached data if available
      if (currentPatterns.has(batteryId)) {
        return currentPatterns.get(batteryId);
      }
      
      const response = await fetch(`${API_BASE}/api/batteries/${batteryId}/usage`);
      if (!response.ok) throw new Error(`Failed to fetch usage pattern for battery ${batteryId}`);
      
      const data = await response.json();
      const newPatterns = new Map(currentPatterns);
      newPatterns.set(batteryId, data);
      
      set({ usagePatterns: newPatterns });
      return data;
    } catch (error) {
      console.error(`Error fetching usage pattern for battery ${batteryId}:`, error);
      
      // Generate demo data on error
      const demoPattern = generateUsagePattern(batteryId);
      const currentPatterns = get().usagePatterns;
      const newPatterns = new Map(currentPatterns);
      newPatterns.set(batteryId, demoPattern);
      
      set({ usagePatterns: newPatterns });
      return demoPattern;
    }
  },
  
  // Fetch recommendations for a specific battery
  fetchRecommendations: async (batteryId: number) => {
    try {
      const currentRecommendations = get().recommendations;
      
      // Return cached data if available
      if (currentRecommendations.has(batteryId)) {
        return currentRecommendations.get(batteryId)!;
      }
      
      const response = await fetch(`${API_BASE}/api/batteries/${batteryId}/recommendations`);
      if (!response.ok) throw new Error(`Failed to fetch recommendations for battery ${batteryId}`);
      
      const data = await response.json();
      const newRecommendations = new Map(currentRecommendations);
      newRecommendations.set(batteryId, data);
      
      set({ recommendations: newRecommendations });
      return data;
    } catch (error) {
      console.error(`Error fetching recommendations for battery ${batteryId}:`, error);
      
      // Generate demo data on error
      const demoRecommendations = generateRecommendations(batteryId);
      const currentRecommendations = get().recommendations;
      const newRecommendations = new Map(currentRecommendations);
      newRecommendations.set(batteryId, demoRecommendations);
      
      set({ recommendations: newRecommendations });
      return demoRecommendations;
    }
  },
  
  // Add a new battery
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE}/api/batteries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batteryData),
      });
      
      if (!response.ok) throw new Error('Failed to add battery');
      
      const newBattery = await response.json();
      set(state => ({
        batteries: [...state.batteries, newBattery]
      }));
      
      return newBattery;
    } catch (error) {
      console.error('Error adding battery:', error);
      
      // Create simulated response
      const nextId = Math.max(0, ...get().batteries.map(b => b.id)) + 1;
      const newBattery: Battery = {
        id: nextId,
        ...batteryData,
      };
      
      set(state => ({
        batteries: [...state.batteries, newBattery]
      }));
      
      return newBattery;
    }
  },
  
  // Update an existing battery
  updateBattery: async (id: number, batteryData: Partial<Battery>) => {
    try {
      const response = await fetch(`${API_BASE}/api/batteries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batteryData),
      });
      
      if (!response.ok) throw new Error(`Failed to update battery ${id}`);
      
      const updatedBattery = await response.json();
      set(state => ({
        batteries: state.batteries.map(b => 
          b.id === id ? { ...b, ...updatedBattery } : b
        )
      }));
      
      return updatedBattery;
    } catch (error) {
      console.error(`Error updating battery ${id}:`, error);
      
      // Update locally
      const battery = get().batteries.find(b => b.id === id);
      if (!battery) return undefined;
      
      const updatedBattery: Battery = {
        ...battery,
        ...batteryData,
      };
      
      set(state => ({
        batteries: state.batteries.map(b => 
          b.id === id ? updatedBattery : b
        )
      }));
      
      return updatedBattery;
    }
  },
  
  // Delete a battery
  deleteBattery: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/batteries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error(`Failed to delete battery ${id}`);
      
      set(state => ({
        batteries: state.batteries.filter(b => b.id !== id),
        selectedBatteryId: state.selectedBatteryId === id ? null : state.selectedBatteryId
      }));
      
      return true;
    } catch (error) {
      console.error(`Error deleting battery ${id}:`, error);
      
      // Delete locally
      set(state => ({
        batteries: state.batteries.filter(b => b.id !== id),
        selectedBatteryId: state.selectedBatteryId === id ? null : state.selectedBatteryId
      }));
      
      return true;
    }
  },
  
  // Set the selected battery ID
  setSelectedBatteryId: (id: number | null) => {
    set({ selectedBatteryId: id });
  }
}));

// Helper functions to generate demo data
function generateDemoBatteries(): Battery[] {
  return [
    {
      id: 1,
      name: "Tesla Model S Battery Pack",
      serialNumber: "TS-2025-XL-001",
      model: "2025-XL",
      manufacturer: "Tesla",
      manufactureDate: "2025-01-15",
      capacity: 85000,
      voltage: 375.5,
      cycleCount: 132,
      health: 92,
      status: "active",
      lastChecked: "2025-05-15T09:30:00Z"
    },
    {
      id: 2,
      name: "ePower 50kWh Battery",
      serialNumber: "EP-P50-087652",
      model: "PowerPack 50",
      manufacturer: "ePower",
      manufactureDate: "2024-11-05",
      capacity: 50000,
      voltage: 350.2,
      cycleCount: 87,
      health: 98,
      status: "charging",
      lastChecked: "2025-05-15T10:15:00Z"
    },
    {
      id: 3,
      name: "Backup Power Unit 3",
      serialNumber: "BPU-2024-003",
      model: "Backup Series 2024",
      manufacturer: "PowerSolutions",
      manufactureDate: "2024-08-20",
      capacity: 25000,
      voltage: 220.5,
      cycleCount: 245,
      health: 76,
      status: "active",
      lastChecked: "2025-05-14T16:45:00Z"
    },
    {
      id: 4,
      name: "Critical System Battery",
      serialNumber: "CS-X75-04592",
      model: "Critical X75",
      manufacturer: "SecurePower",
      manufactureDate: "2024-05-10",
      capacity: 15000,
      voltage: 120.0,
      cycleCount: 512,
      health: 28,
      status: "error",
      lastChecked: "2025-05-15T08:00:00Z"
    }
  ];
}

function generateBatteryHistory(batteryId: number): BatteryHistory[] {
  // Generate the last 30 days of history
  const history: BatteryHistory[] = [];
  const now = new Date();
  
  let health: number;
  let capacity: number;
  let voltage: number;
  let cycleCount: number;
  
  // Set different starting values based on battery ID
  switch (batteryId) {
    case 1:
      health = 100;
      capacity = 85000;
      voltage = 380;
      cycleCount = 100;
      break;
    case 2:
      health = 100;
      capacity = 50000;
      voltage = 355;
      cycleCount = 60;
      break;
    case 3:
      health = 90;
      capacity = 25000;
      voltage = 225;
      cycleCount = 200;
      break;
    case 4:
      health = 60;
      capacity = 15000;
      voltage = 125;
      cycleCount = 450;
      break;
    default:
      health = 100;
      capacity = 50000;
      voltage = 350;
      cycleCount = 0;
  }
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Slightly degrade values over time to simulate wear
    health -= (batteryId === 4) ? 1.1 : 0.3;
    capacity -= (batteryId === 4) ? 500 : 100;
    voltage -= 0.1;
    cycleCount += (batteryId === 3 || batteryId === 4) ? 2 : 1;
    
    // Add some randomness to make data look realistic
    const randomFactor = Math.random() * 0.02 - 0.01; // -1% to +1%
    
    history.push({
      id: (batteryId * 100) + (30 - i),
      batteryId,
      date: date.toISOString(),
      health: Math.max(0, Math.min(100, health * (1 + randomFactor))),
      capacity: Math.max(0, capacity * (1 + randomFactor)),
      voltage: Math.max(0, voltage * (1 + randomFactor)),
      temperature: 20 + Math.random() * 10,
      cycleCount: Math.floor(cycleCount)
    });
  }
  
  return history;
}

function generateUsagePattern(batteryId: number): UsagePattern {
  let pattern: Partial<UsagePattern>;
  
  switch (batteryId) {
    case 1:
      pattern = {
        chargingFrequency: 0.8,
        averageDischargeRate: 3.2,
        deepDischargeCount: 5,
        peakUsageTime: "14:00-18:00",
        environmentalConditions: "Temperature controlled",
        usageType: "Regular daily cycles"
      };
      break;
    case 2:
      pattern = {
        chargingFrequency: 0.5,
        averageDischargeRate: 2.1,
        deepDischargeCount: 1,
        peakUsageTime: "08:00-12:00",
        environmentalConditions: "Indoor moderate climate",
        usageType: "Intermittent backup"
      };
      break;
    case 3:
      pattern = {
        chargingFrequency: 0.3,
        averageDischargeRate: 4.5,
        deepDischargeCount: 12,
        peakUsageTime: "22:00-02:00",
        environmentalConditions: "Variable temperatures",
        usageType: "Emergency backup"
      };
      break;
    case 4:
      pattern = {
        chargingFrequency: 1.2,
        averageDischargeRate: 6.8,
        deepDischargeCount: 48,
        peakUsageTime: "All day",
        environmentalConditions: "High temperature environment",
        usageType: "Heavy continuous usage"
      };
      break;
    default:
      pattern = {
        chargingFrequency: 0.5,
        averageDischargeRate: 2.5,
        deepDischargeCount: 0,
        peakUsageTime: "N/A",
        environmentalConditions: "Unknown",
        usageType: "Standard"
      };
  }
  
  return {
    id: batteryId,
    batteryId,
    ...pattern
  } as UsagePattern;
}

function generateRecommendations(batteryId: number): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  switch (batteryId) {
    case 1:
      recommendations.push({
        id: 1,
        batteryId: 1,
        type: "optimization",
        description: "Consider charging to 80% instead of 100% to extend battery life",
        priority: "medium",
        created: "2025-05-10T14:30:00Z",
        resolved: false
      });
      recommendations.push({
        id: 2,
        batteryId: 1,
        type: "maintenance",
        description: "Schedule regular diagnostic check in next 30 days",
        priority: "low",
        created: "2025-05-12T09:15:00Z",
        resolved: false
      });
      break;
    case 2:
      recommendations.push({
        id: 3,
        batteryId: 2,
        type: "information",
        description: "Battery performing optimally - no action needed",
        priority: "low",
        created: "2025-05-14T11:20:00Z",
        resolved: true
      });
      break;
    case 3:
      recommendations.push({
        id: 4,
        batteryId: 3,
        type: "warning",
        description: "Discharge rate higher than recommended. Consider load balancing.",
        priority: "medium",
        created: "2025-05-08T16:45:00Z",
        resolved: false
      });
      recommendations.push({
        id: 5,
        batteryId: 3,
        type: "optimization",
        description: "Adjust environmental controls to maintain optimal temperature range",
        priority: "medium",
        created: "2025-05-13T10:30:00Z",
        resolved: false
      });
      break;
    case 4:
      recommendations.push({
        id: 6,
        batteryId: 4,
        type: "alert",
        description: "Critical health level detected - replacement required",
        priority: "high",
        created: "2025-05-14T08:15:00Z",
        resolved: false
      });
      recommendations.push({
        id: 7,
        batteryId: 4,
        type: "alert",
        description: "Abnormal voltage fluctuations detected - inspect connections",
        priority: "high",
        created: "2025-05-15T07:45:00Z",
        resolved: false
      });
      recommendations.push({
        id: 8,
        batteryId: 4,
        type: "warning",
        description: "High temperature operating environment is accelerating degradation",
        priority: "medium",
        created: "2025-05-10T14:20:00Z",
        resolved: false
      });
      break;
  }
  
  return recommendations;
}