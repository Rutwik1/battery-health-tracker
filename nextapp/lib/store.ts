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
      // In a real implementation, this would fetch from the API
      // For demo purposes, we're using generated data
      const batteries = generateDemoBatteries();
      set({ batteries, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch batteries:', error);
      set({ isLoading: false });
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    const { batteryHistories } = get();
    
    if (batteryHistories.has(batteryId)) {
      return batteryHistories.get(batteryId) || [];
    }
    
    try {
      // Generate history data for this battery
      const history = generateBatteryHistory(batteryId);
      
      // Store in the map for future reference
      set(state => ({
        batteryHistories: new Map(state.batteryHistories).set(batteryId, history)
      }));
      
      return history;
    } catch (error) {
      console.error(`Failed to fetch history for battery ${batteryId}:`, error);
      return [];
    }
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    const { usagePatterns } = get();
    
    if (usagePatterns.has(batteryId)) {
      return usagePatterns.get(batteryId);
    }
    
    try {
      // Generate usage pattern data for this battery
      const pattern = generateUsagePattern(batteryId);
      
      // Store in the map for future reference
      set(state => ({
        usagePatterns: new Map(state.usagePatterns).set(batteryId, pattern)
      }));
      
      return pattern;
    } catch (error) {
      console.error(`Failed to fetch usage pattern for battery ${batteryId}:`, error);
      return undefined;
    }
  },
  
  fetchRecommendations: async (batteryId: number) => {
    const { recommendations } = get();
    
    if (recommendations.has(batteryId)) {
      return recommendations.get(batteryId) || [];
    }
    
    try {
      // Generate recommendations for this battery
      const recs = generateRecommendations(batteryId);
      
      // Store in the map for future reference
      set(state => ({
        recommendations: new Map(state.recommendations).set(batteryId, recs)
      }));
      
      return recs;
    } catch (error) {
      console.error(`Failed to fetch recommendations for battery ${batteryId}:`, error);
      return [];
    }
  },
  
  addBattery: async (batteryData) => {
    const { batteries } = get();
    
    // Generate a new ID (in a real app, this would be done on the server)
    const id = batteries.length > 0 
      ? Math.max(...batteries.map(b => b.id)) + 1 
      : 1;
    
    // Create new battery with generated ID
    const newBattery: Battery = {
      ...batteryData,
      id,
    };
    
    // Add to state
    set(state => ({
      batteries: [...state.batteries, newBattery]
    }));
    
    return newBattery;
  },
  
  updateBattery: async (id, batteryUpdate) => {
    const { batteries } = get();
    const batteryIndex = batteries.findIndex(b => b.id === id);
    
    if (batteryIndex === -1) {
      return undefined;
    }
    
    // Create updated battery
    const updatedBattery = {
      ...batteries[batteryIndex],
      ...batteryUpdate
    };
    
    // Update state
    set(state => {
      const newBatteries = [...state.batteries];
      newBatteries[batteryIndex] = updatedBattery;
      return { batteries: newBatteries };
    });
    
    return updatedBattery;
  },
  
  deleteBattery: async (id) => {
    const { batteries, batteryHistories, usagePatterns, recommendations } = get();
    
    // Check if battery exists
    if (!batteries.some(b => b.id === id)) {
      return false;
    }
    
    // Remove from state
    set(state => {
      // Filter out the battery
      const newBatteries = state.batteries.filter(b => b.id !== id);
      
      // Remove related data
      const newHistories = new Map(state.batteryHistories);
      newHistories.delete(id);
      
      const newPatterns = new Map(state.usagePatterns);
      newPatterns.delete(id);
      
      const newRecommendations = new Map(state.recommendations);
      newRecommendations.delete(id);
      
      // If the deleted battery was selected, clear selection
      const newSelectedId = state.selectedBatteryId === id ? null : state.selectedBatteryId;
      
      return {
        batteries: newBatteries,
        batteryHistories: newHistories,
        usagePatterns: newPatterns,
        recommendations: newRecommendations,
        selectedBatteryId: newSelectedId
      };
    });
    
    return true;
  },
  
  setSelectedBatteryId: (id) => {
    set({ selectedBatteryId: id });
  }
}));

// Demo data generators
function generateDemoBatteries(): Battery[] {
  return [
    {
      id: 1,
      name: "Battery #1",
      serialNumber: "BT-100123",
      model: "Lithium-Ion X7",
      manufacturer: "EnergyTech",
      manufactureDate: "2024-01-15",
      capacity: 5000,
      voltage: 3.7,
      cycleCount: 102,
      health: 95,
      status: "idle",
      lastChecked: "2025-05-15T09:30:00.000Z"
    },
    {
      id: 2,
      name: "Battery #2",
      serialNumber: "BT-100456",
      model: "Lithium-Ion X5",
      manufacturer: "PowerCell",
      manufactureDate: "2024-02-03",
      capacity: 4800,
      voltage: 3.6,
      cycleCount: 187,
      health: 88,
      status: "charging",
      lastChecked: "2025-05-14T14:45:00.000Z"
    },
    {
      id: 3,
      name: "Battery #3",
      serialNumber: "BT-100789",
      model: "Lithium-Polymer Pro",
      manufacturer: "EnergyTech",
      manufactureDate: "2023-11-20",
      capacity: 6000,
      voltage: 3.85,
      cycleCount: 310,
      health: 76,
      status: "discharging",
      lastChecked: "2025-05-15T10:15:00.000Z"
    },
    {
      id: 4,
      name: "Battery #4",
      serialNumber: "BT-101012",
      model: "LFP Advanced",
      manufacturer: "GreenCell",
      manufactureDate: "2023-08-05",
      capacity: 5500,
      voltage: 3.2,
      cycleCount: 425,
      health: 58,
      status: "idle",
      lastChecked: "2025-05-14T08:20:00.000Z"
    }
  ];
}

function generateBatteryHistory(batteryId: number): BatteryHistory[] {
  const history: BatteryHistory[] = [];
  const today = new Date();
  
  // Generate data points for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Health degrades over time at different rates per battery
    let healthDecay: number;
    switch (batteryId) {
      case 1: healthDecay = 0.4; break; // Battery 1: slow degradation
      case 2: healthDecay = 0.8; break; // Battery 2: moderate degradation
      case 3: healthDecay = 1.8; break; // Battery 3: faster degradation
      case 4: healthDecay = 3.2; break; // Battery 4: rapid degradation
      default: healthDecay = 1.0;
    }
    
    // Add some random variation to health
    const baseHealth = 100 - (i * healthDecay);
    const health = Math.max(1, Math.min(100, baseHealth + (Math.random() * 2 - 1)));
    
    // Cycle count increases over time
    let cycleBase: number;
    switch (batteryId) {
      case 1: cycleBase = 8; break;  // Battery 1: low usage
      case 2: cycleBase = 15; break; // Battery 2: moderate usage
      case 3: cycleBase = 25; break; // Battery 3: heavy usage
      case 4: cycleBase = 35; break; // Battery 4: very heavy usage
      default: cycleBase = 20;
    }
    const cycles = cycleBase * (i + 1) + Math.floor(Math.random() * 5);
    
    history.push({
      id: (batteryId * 100) + i,
      batteryId,
      date: date.toISOString(),
      health: Math.round(health * 10) / 10,
      voltage: 3.7 - (i * 0.03 * Math.random()),
      capacity: 5000 - (i * 50 * Math.random()),
      temperature: 25 + (Math.random() * 10 - 5),
      cycleCount: cycles
    });
  }
  
  // Sort by date (newest first)
  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateUsagePattern(batteryId: number): UsagePattern {
  let pattern: Partial<UsagePattern>;
  
  switch (batteryId) {
    case 1:
      pattern = {
        chargingFrequency: 2.5,
        averageDischargeRate: 0.3,
        deepDischargeCount: 3,
        peakUsageTime: "Morning",
        environmentalConditions: "Indoor, Controlled Temperature",
        usageType: "Light"
      };
      break;
    case 2:
      pattern = {
        chargingFrequency: 3.8,
        averageDischargeRate: 0.5,
        deepDischargeCount: 12,
        peakUsageTime: "Evening",
        environmentalConditions: "Indoor, Variable Temperature",
        usageType: "Moderate"
      };
      break;
    case 3:
      pattern = {
        chargingFrequency: 6.2,
        averageDischargeRate: 0.8,
        deepDischargeCount: 45,
        peakUsageTime: "Afternoon",
        environmentalConditions: "Mixed Indoor/Outdoor",
        usageType: "Heavy"
      };
      break;
    case 4:
      pattern = {
        chargingFrequency: 8.5,
        averageDischargeRate: 1.2,
        deepDischargeCount: 87,
        peakUsageTime: "Continuous",
        environmentalConditions: "Outdoor, Extreme Temperatures",
        usageType: "Industrial"
      };
      break;
    default:
      pattern = {
        chargingFrequency: 4.0,
        averageDischargeRate: 0.6,
        deepDischargeCount: 20,
        peakUsageTime: "Varied",
        environmentalConditions: "Indoor",
        usageType: "Moderate"
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
  const today = new Date();
  
  // Common recommendation for all batteries
  recommendations.push({
    id: (batteryId * 10) + 1,
    batteryId,
    type: "Maintenance",
    description: "Schedule a routine health check-up for optimal performance",
    priority: "Low",
    created: new Date(today.setDate(today.getDate() - 7)).toISOString(),
    resolved: false
  });
  
  // Battery-specific recommendations
  switch (batteryId) {
    case 1:
      // Healthy battery - just routine maintenance
      break;
      
    case 2:
      // Moderate health - starting to show signs of wear
      recommendations.push({
        id: (batteryId * 10) + 2,
        batteryId,
        type: "Optimization",
        description: "Adjust charging cycle to improve longevity",
        priority: "Medium",
        created: new Date(today.setDate(today.getDate() - 14)).toISOString(),
        resolved: false
      });
      break;
      
    case 3:
      // Poor health - needs attention
      recommendations.push({
        id: (batteryId * 10) + 2,
        batteryId,
        type: "Warning",
        description: "Battery capacity significantly reduced. Consider reducing deep discharge frequency.",
        priority: "High",
        created: new Date(today.setDate(today.getDate() - 5)).toISOString(),
        resolved: false
      });
      recommendations.push({
        id: (batteryId * 10) + 3,
        batteryId,
        type: "Maintenance",
        description: "Schedule diagnostic test to assess cell balance",
        priority: "Medium",
        created: new Date(today.setDate(today.getDate() - 20)).toISOString(),
        resolved: true
      });
      break;
      
    case 4:
      // Critical health - needs replacement
      recommendations.push({
        id: (batteryId * 10) + 2,
        batteryId,
        type: "Critical",
        description: "Battery health critical. Replacement recommended within 30 days.",
        priority: "Urgent",
        created: new Date(today.setDate(today.getDate() - 3)).toISOString(),
        resolved: false
      });
      recommendations.push({
        id: (batteryId * 10) + 3,
        batteryId,
        type: "Warning",
        description: "Reduce usage in high-temperature environments to prevent further degradation",
        priority: "High",
        created: new Date(today.setDate(today.getDate() - 10)).toISOString(),
        resolved: false
      });
      recommendations.push({
        id: (batteryId * 10) + 4,
        batteryId,
        type: "Maintenance",
        description: "Calibrate battery management system",
        priority: "Medium",
        created: new Date(today.setDate(today.getDate() - 30)).toISOString(),
        resolved: true
      });
      break;
  }
  
  return recommendations.sort((a, b) => 
    new Date(b.created).getTime() - new Date(a.created).getTime()
  );
}