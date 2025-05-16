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
      // In production, this would be a real API call
      // For the next.js migration, we'll use demo data
      const demoData = generateDemoBatteries();
      set({ batteries: demoData, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch batteries:', error);
      set({ isLoading: false });
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    const { batteryHistories } = get();
    
    // Check if we already have the history for this battery
    if (batteryHistories.has(batteryId)) {
      return batteryHistories.get(batteryId)!;
    }
    
    set({ isLoading: true });
    try {
      // In production, this would be a real API call
      // For the next.js migration, we'll generate demo data
      const batteryHistory = generateBatteryHistory(batteryId);
      
      set(state => ({
        batteryHistories: new Map(state.batteryHistories).set(batteryId, batteryHistory),
        isLoading: false
      }));
      
      return batteryHistory;
    } catch (error) {
      console.error(`Failed to fetch battery history for ID ${batteryId}:`, error);
      set({ isLoading: false });
      return [];
    }
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    const { usagePatterns } = get();
    
    // Check if we already have the usage pattern for this battery
    if (usagePatterns.has(batteryId)) {
      return usagePatterns.get(batteryId);
    }
    
    set({ isLoading: true });
    try {
      // In production, this would be a real API call
      // For the next.js migration, we'll generate demo data
      const usagePattern = generateUsagePattern(batteryId);
      
      set(state => ({
        usagePatterns: new Map(state.usagePatterns).set(batteryId, usagePattern),
        isLoading: false
      }));
      
      return usagePattern;
    } catch (error) {
      console.error(`Failed to fetch usage pattern for battery ID ${batteryId}:`, error);
      set({ isLoading: false });
      return undefined;
    }
  },
  
  fetchRecommendations: async (batteryId: number) => {
    const { recommendations } = get();
    
    // Check if we already have recommendations for this battery
    if (recommendations.has(batteryId)) {
      return recommendations.get(batteryId)!;
    }
    
    set({ isLoading: true });
    try {
      // In production, this would be a real API call
      // For the next.js migration, we'll generate demo data
      const batRecs = generateRecommendations(batteryId);
      
      set(state => ({
        recommendations: new Map(state.recommendations).set(batteryId, batRecs),
        isLoading: false
      }));
      
      return batRecs;
    } catch (error) {
      console.error(`Failed to fetch recommendations for battery ID ${batteryId}:`, error);
      set({ isLoading: false });
      return [];
    }
  },
  
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    set({ isLoading: true });
    try {
      // In production, this would be a real API call
      // For the next.js migration, we'll simulate adding a battery
      const { batteries } = get();
      const maxId = batteries.reduce((max, b) => Math.max(max, b.id), 0);
      
      const newBattery: Battery = {
        ...batteryData,
        id: maxId + 1,
      };
      
      set(state => ({
        batteries: [...state.batteries, newBattery],
        isLoading: false
      }));
      
      return newBattery;
    } catch (error) {
      console.error('Failed to add battery:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    set({ isLoading: true });
    try {
      // In production, this would be a real API call
      // For the next.js migration, we'll simulate updating a battery
      const { batteries } = get();
      const batteryIndex = batteries.findIndex(b => b.id === id);
      
      if (batteryIndex === -1) {
        set({ isLoading: false });
        return undefined;
      }
      
      const updatedBattery = {
        ...batteries[batteryIndex],
        ...batteryUpdate
      };
      
      const updatedBatteries = [...batteries];
      updatedBatteries[batteryIndex] = updatedBattery;
      
      set({ batteries: updatedBatteries, isLoading: false });
      
      return updatedBattery;
    } catch (error) {
      console.error(`Failed to update battery ID ${id}:`, error);
      set({ isLoading: false });
      return undefined;
    }
  },
  
  deleteBattery: async (id: number) => {
    set({ isLoading: true });
    try {
      // In production, this would be a real API call
      // For the next.js migration, we'll simulate deleting a battery
      const { batteries, selectedBatteryId } = get();
      
      set({
        batteries: batteries.filter(b => b.id !== id),
        selectedBatteryId: selectedBatteryId === id ? null : selectedBatteryId,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to delete battery ID ${id}:`, error);
      set({ isLoading: false });
      return false;
    }
  },
  
  setSelectedBatteryId: (id: number | null) => {
    set({ selectedBatteryId: id });
  }
}));

// Helper functions to generate demo data for migration
function generateDemoBatteries(): Battery[] {
  return [
    {
      id: 1,
      name: "Battery #1",
      serialNumber: "BT-2025-001",
      model: "Li-Ion 5000mAh",
      manufacturer: "EnergyTech",
      manufactureDate: "2024-01-15",
      capacity: 5000,
      voltage: 3.7,
      cycleCount: 120,
      health: 92,
      status: "Normal",
      lastChecked: "2025-05-10"
    },
    {
      id: 2,
      name: "Battery #2",
      serialNumber: "BT-2025-002",
      model: "Li-Po 4000mAh",
      manufacturer: "PowerCell",
      manufactureDate: "2024-02-20",
      capacity: 4000,
      voltage: 3.85,
      cycleCount: 210,
      health: 85,
      status: "Normal",
      lastChecked: "2025-05-10"
    },
    {
      id: 3,
      name: "Battery #3",
      serialNumber: "BT-2025-003",
      model: "Li-Ion 3500mAh",
      manufacturer: "EnergyTech",
      manufactureDate: "2023-11-05",
      capacity: 3500,
      voltage: 3.6,
      cycleCount: 320,
      health: 72,
      status: "Degrading",
      lastChecked: "2025-05-10"
    },
    {
      id: 4,
      name: "Battery #4",
      serialNumber: "BT-2025-004",
      model: "Li-Po 6000mAh",
      manufacturer: "VoltMax",
      manufactureDate: "2024-03-12",
      capacity: 6000,
      voltage: 3.9,
      cycleCount: 50,
      health: 98,
      status: "Charging",
      lastChecked: "2025-05-10"
    }
  ];
}

function generateBatteryHistory(batteryId: number): BatteryHistory[] {
  // Generate 12 months of historical data
  const now = new Date();
  const history: BatteryHistory[] = [];
  
  // Get the battery to use its current values as the latest point
  const battery = generateDemoBatteries().find(b => b.id === batteryId);
  
  // Determine starting health based on current health and expected degradation
  let startingHealth = 100;
  if (battery) {
    // Estimate what the starting health might have been
    const avgMonthlyDegradation = (100 - battery.health) / 12;
    startingHealth = Math.min(100, battery.health + (avgMonthlyDegradation * 12));
  }
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - (11 - i));
    
    // Health decreases gradually
    const health = startingHealth - ((startingHealth - (battery?.health || 80)) * i / 11);
    
    // Voltage fluctuates slightly
    const baseVoltage = battery?.voltage || 3.7;
    const voltage = baseVoltage - (Math.random() * 0.2) + (Math.random() * 0.1);
    
    // Capacity decreases with health
    const baseCapacity = battery?.capacity || 5000;
    const capacity = baseCapacity * (health / 100);
    
    // Temperature fluctuates
    const temperature = 25 + (Math.random() * 10) - 5;
    
    // Cycle count increases over time
    const baseCycles = battery?.cycleCount || 100;
    const cycles = Math.max(0, Math.floor(baseCycles * (i / 11)));
    
    history.push({
      id: (batteryId * 100) + i,
      batteryId,
      date: date.toISOString().split('T')[0],
      health,
      voltage,
      capacity,
      temperature,
      cycleCount: cycles
    });
  }
  
  return history;
}

function generateUsagePattern(batteryId: number): UsagePattern {
  // Sample usage patterns based on battery ID
  const patterns = [
    {
      chargingFrequency: 1.2, // times per day
      averageDischargeRate: 8.5, // percent per hour
      deepDischargeCount: 12,
      peakUsageTime: "14:00-16:00",
      environmentalConditions: "Indoor, temperature controlled",
      usageType: "Regular"
    },
    {
      chargingFrequency: 0.8, // times per day
      averageDischargeRate: 12.3, // percent per hour
      deepDischargeCount: 25,
      peakUsageTime: "09:00-11:00",
      environmentalConditions: "Mixed indoor/outdoor use",
      usageType: "Heavy"
    },
    {
      chargingFrequency: 0.5, // times per day
      averageDischargeRate: 5.2, // percent per hour
      deepDischargeCount: 5,
      peakUsageTime: "19:00-21:00",
      environmentalConditions: "Indoor, cool environment",
      usageType: "Light"
    },
    {
      chargingFrequency: 1.5, // times per day
      averageDischargeRate: 15.7, // percent per hour
      deepDischargeCount: 35,
      peakUsageTime: "All day",
      environmentalConditions: "Outdoor, temperature fluctuations",
      usageType: "Extreme"
    }
  ];
  
  // Use modulo to cycle through patterns
  const patternIndex = (batteryId - 1) % patterns.length;
  
  return {
    id: batteryId,
    batteryId,
    ...patterns[patternIndex]
  };
}

function generateRecommendations(batteryId: number): Recommendation[] {
  // Base recommendations that might apply to any battery
  const baseRecommendations = [
    {
      type: "Charging",
      description: "Consider charging to 80% instead of 100% to extend battery life",
      priority: "Medium",
      resolved: false
    },
    {
      type: "Usage",
      description: "Avoid exposing battery to extreme temperatures",
      priority: "High",
      resolved: false
    },
    {
      type: "Maintenance",
      description: "Schedule a calibration cycle to improve accuracy of battery level reporting",
      priority: "Low",
      resolved: false
    }
  ];
  
  // Battery-specific recommendations based on patterns
  const specificRecommendations: Record<number, Recommendation[]> = {
    1: [
      {
        id: 100,
        batteryId: 1,
        type: "Optimization",
        description: "Battery is performing well, maintain current charging habits",
        priority: "Low",
        created: "2025-04-20",
        resolved: true
      }
    ],
    2: [
      {
        id: 200,
        batteryId: 2,
        type: "Warning",
        description: "Charging frequency is higher than optimal, consider reducing charge cycles",
        priority: "Medium",
        created: "2025-05-01",
        resolved: false
      }
    ],
    3: [
      {
        id: 300,
        batteryId: 3,
        type: "Alert",
        description: "Battery health degrading faster than expected, schedule a replacement within 3 months",
        priority: "High",
        created: "2025-04-15",
        resolved: false
      }
    ],
    4: [
      {
        id: 400,
        batteryId: 4,
        type: "Optimization",
        description: "New battery detected, follow break-in procedures for optimal performance",
        priority: "Medium",
        created: "2025-05-05",
        resolved: false
      }
    ]
  };
  
  // Get battery to determine what recommendations to show
  const battery = generateDemoBatteries().find(b => b.id === batteryId);
  const result: Recommendation[] = [];
  
  // Add base recommendations based on battery health
  if (battery) {
    if (battery.health < 80) {
      result.push({
        id: batteryId * 1000 + 1,
        batteryId,
        type: "Alert",
        description: "Battery health below 80%, consider replacement within 6 months",
        priority: "Medium",
        created: "2025-05-01",
        resolved: false
      });
    }
    
    if (battery.cycleCount > 300) {
      result.push({
        id: batteryId * 1000 + 2,
        batteryId,
        type: "Warning",
        description: "High cycle count detected, monitor battery performance closely",
        priority: "Medium",
        created: "2025-04-10",
        resolved: false
      });
    }
    
    // Add general recommendations
    baseRecommendations.forEach((rec, index) => {
      result.push({
        id: batteryId * 1000 + 10 + index,
        batteryId,
        ...rec,
        created: "2025-03-15"
      });
    });
  }
  
  // Add battery specific recommendations if they exist
  if (specificRecommendations[batteryId]) {
    result.push(...specificRecommendations[batteryId]);
  }
  
  return result;
}