'use client';

import { create } from 'zustand';
import { format, subDays } from 'date-fns';
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
  error: string | null;
  
  // Actions
  fetchBatteries: () => Promise<void>;
  fetchBatteryHistory: (batteryId: number) => Promise<BatteryHistory[]>;
  fetchUsagePattern: (batteryId: number) => Promise<UsagePattern | undefined>;
  fetchRecommendations: (batteryId: number) => Promise<Recommendation[]>;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, battery: Partial<Battery>) => Promise<Battery | undefined>;
  deleteBattery: (id: number) => Promise<boolean>;
  setSelectedBatteryId: (id: number | null) => void;
  clearError: () => void;
}

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  selectedBatteryId: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchBatteries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/batteries');
      if (!response.ok) {
        throw new Error(`Failed to fetch batteries: ${response.statusText}`);
      }
      const data = await response.json();
      set({ batteries: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching batteries:', error);
      set({ isLoading: false, error: error instanceof Error ? error.message : 'Unknown error' });
      // For demo purposes, generate demo data if API fails
      const demoBatteries = generateDemoBatteries();
      set({ batteries: demoBatteries });
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    try {
      const { batteryHistories } = get();
      if (batteryHistories.has(batteryId)) {
        return batteryHistories.get(batteryId) || [];
      }
      
      const response = await fetch(`/api/batteries/${batteryId}/history`);
      if (!response.ok) {
        throw new Error(`Failed to fetch battery history: ${response.statusText}`);
      }
      
      const data = await response.json();
      set(state => ({
        batteryHistories: new Map(state.batteryHistories).set(batteryId, data)
      }));
      return data;
    } catch (error) {
      console.error(`Error fetching history for battery ${batteryId}:`, error);
      // For demo purposes, generate demo data if API fails
      const demoHistory = generateBatteryHistory(batteryId);
      set(state => ({
        batteryHistories: new Map(state.batteryHistories).set(batteryId, demoHistory)
      }));
      return demoHistory;
    }
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    try {
      const { usagePatterns } = get();
      if (usagePatterns.has(batteryId)) {
        return usagePatterns.get(batteryId);
      }
      
      const response = await fetch(`/api/batteries/${batteryId}/usage`);
      if (!response.ok) {
        throw new Error(`Failed to fetch usage pattern: ${response.statusText}`);
      }
      
      const data = await response.json();
      set(state => ({
        usagePatterns: new Map(state.usagePatterns).set(batteryId, data)
      }));
      return data;
    } catch (error) {
      console.error(`Error fetching usage pattern for battery ${batteryId}:`, error);
      // For demo purposes, generate demo data if API fails
      const demoPattern = generateUsagePattern(batteryId);
      set(state => ({
        usagePatterns: new Map(state.usagePatterns).set(batteryId, demoPattern)
      }));
      return demoPattern;
    }
  },
  
  fetchRecommendations: async (batteryId: number) => {
    try {
      const { recommendations } = get();
      if (recommendations.has(batteryId)) {
        return recommendations.get(batteryId) || [];
      }
      
      const response = await fetch(`/api/batteries/${batteryId}/recommendations`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
      }
      
      const data = await response.json();
      set(state => ({
        recommendations: new Map(state.recommendations).set(batteryId, data)
      }));
      return data;
    } catch (error) {
      console.error(`Error fetching recommendations for battery ${batteryId}:`, error);
      // For demo purposes, generate demo data if API fails
      const demoRecommendations = generateRecommendations(batteryId);
      set(state => ({
        recommendations: new Map(state.recommendations).set(batteryId, demoRecommendations)
      }));
      return demoRecommendations;
    }
  },
  
  addBattery: async (batteryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/batteries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batteryData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to add battery: ${response.statusText}`);
      }
      
      const newBattery = await response.json();
      
      set(state => ({
        batteries: [...state.batteries, newBattery],
        isLoading: false
      }));
      
      return newBattery;
    } catch (error) {
      console.error('Error adding battery:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // For demo, create a mock response
      const newBattery: Battery = {
        id: Math.floor(Math.random() * 1000) + 5,
        ...batteryData,
        lastChecked: new Date().toISOString()
      };
      
      set(state => ({
        batteries: [...state.batteries, newBattery]
      }));
      
      return newBattery;
    }
  },
  
  updateBattery: async (id, batteryUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batteryUpdate),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update battery: ${response.statusText}`);
      }
      
      const updatedBattery = await response.json();
      
      set(state => ({
        batteries: state.batteries.map(battery => 
          battery.id === id ? { ...battery, ...updatedBattery } : battery
        ),
        isLoading: false
      }));
      
      return updatedBattery;
    } catch (error) {
      console.error(`Error updating battery ${id}:`, error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // For demo, create a mock response
      const battery = get().batteries.find(b => b.id === id);
      if (!battery) return undefined;
      
      const updatedBattery: Battery = {
        ...battery,
        ...batteryUpdate,
        lastChecked: new Date().toISOString()
      };
      
      set(state => ({
        batteries: state.batteries.map(b => 
          b.id === id ? updatedBattery : b
        )
      }));
      
      return updatedBattery;
    }
  },
  
  deleteBattery: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete battery: ${response.statusText}`);
      }
      
      set(state => ({
        batteries: state.batteries.filter(battery => battery.id !== id),
        isLoading: false,
        selectedBatteryId: state.selectedBatteryId === id ? null : state.selectedBatteryId
      }));
      
      return true;
    } catch (error) {
      console.error(`Error deleting battery ${id}:`, error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
      // For demo purposes, still remove from local state
      set(state => ({
        batteries: state.batteries.filter(battery => battery.id !== id),
        selectedBatteryId: state.selectedBatteryId === id ? null : state.selectedBatteryId
      }));
      
      return true;
    }
  },
  
  setSelectedBatteryId: (id) => {
    set({ selectedBatteryId: id });
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

// Demo data generators for development and testing
function generateDemoBatteries(): Battery[] {
  return [
    {
      id: 1,
      name: 'Tesla Powerwall',
      serialNumber: 'TPW-2023-001',
      model: 'Powerwall 2',
      manufacturer: 'Tesla',
      manufactureDate: '2023-01-15T00:00:00Z',
      capacity: 13500,
      voltage: 380.0,
      cycleCount: 124,
      health: 92,
      status: 'Charging',
      lastChecked: '2025-05-15T09:30:00Z'
    },
    {
      id: 2,
      name: 'LG Home Battery',
      serialNumber: 'LG-RESU-003',
      model: 'RESU 10H',
      manufacturer: 'LG Energy',
      manufactureDate: '2022-11-05T00:00:00Z',
      capacity: 9800,
      voltage: 400.0,
      cycleCount: 231,
      health: 87,
      status: 'Idle',
      lastChecked: '2025-05-15T10:15:00Z'
    },
    {
      id: 3,
      name: 'Sonnen Eco',
      serialNumber: 'ECO-2022-117',
      model: 'Eco 10',
      manufacturer: 'Sonnen',
      manufactureDate: '2022-08-22T00:00:00Z',
      capacity: 10000,
      voltage: 220.0,
      cycleCount: 356,
      health: 81,
      status: 'Discharging',
      lastChecked: '2025-05-15T11:45:00Z'
    },
    {
      id: 4,
      name: 'Old Battery Unit',
      serialNumber: 'PNS-2020-089',
      model: 'PowerStore 5',
      manufacturer: 'Panasonic',
      manufactureDate: '2020-03-10T00:00:00Z',
      capacity: 5000,
      voltage: 110.0,
      cycleCount: 912,
      health: 28,
      status: 'Critical',
      lastChecked: '2025-05-15T08:20:00Z'
    }
  ];
}

function generateBatteryHistory(batteryId: number): BatteryHistory[] {
  const history: BatteryHistory[] = [];
  const today = new Date();
  
  // Generate 30 days of history
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, 29 - i);
    
    // Base health that degrades over time, different starting points for different batteries
    // Batteries 1-3 are in good condition, battery 4 is degraded
    let baseHealth;
    if (batteryId === 4) {
      baseHealth = 45 - (i * 0.5); // Starts lower, degrades faster
    } else {
      baseHealth = 95 - (i * 0.2); // Starts higher, degrades slower
    }
    
    // Add some randomness
    const healthVariation = Math.random() * 4 - 2; // Between -2 and 2
    const health = Math.max(0, Math.min(100, baseHealth + healthVariation));
    
    // Voltage varies slightly
    const baseVoltage = batteryId === 1 ? 380 : batteryId === 2 ? 400 : batteryId === 3 ? 220 : 110;
    const voltage = baseVoltage + (Math.random() * 10 - 5);
    
    // Capacity decreases as health decreases
    const baseCapacity = batteryId === 1 ? 13500 : batteryId === 2 ? 9800 : batteryId === 3 ? 10000 : 5000;
    const capacityFactor = health / 100;
    const capacity = baseCapacity * capacityFactor;
    
    // Temperature varies by time, with some batteries running hotter
    const baseTemp = batteryId === 4 ? 40 : 25; // Old battery runs hotter
    const tempVariation = Math.random() * 8 - 4; // Between -4 and 4
    const temperature = baseTemp + tempVariation;
    
    // Cycle count increases over time
    const baseCycles = batteryId === 1 ? 124 : batteryId === 2 ? 231 : batteryId === 3 ? 356 : 912;
    const cycleCount = Math.floor(baseCycles + (i * 1.5));
    
    history.push({
      id: (batteryId * 100) + i,
      batteryId,
      date: format(date, 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\''),
      health,
      voltage,
      capacity,
      temperature,
      cycleCount
    });
  }
  
  return history;
}

function generateUsagePattern(batteryId: number): UsagePattern {
  // Different patterns based on battery
  switch (batteryId) {
    case 1: // Tesla - balanced usage
      return {
        id: 1,
        batteryId: 1,
        chargingFrequency: 1.2, // times per day
        averageDischargeRate: 0.8, // kW
        deepDischargeCount: 5,
        peakUsageTime: '18:00-22:00',
        environmentalConditions: 'Indoor climate controlled',
        usageType: 'Home backup and grid support'
      };
    case 2: // LG - heavy evening usage
      return {
        id: 2,
        batteryId: 2,
        chargingFrequency: 1.0, // times per day
        averageDischargeRate: 1.2, // kW
        deepDischargeCount: 12,
        peakUsageTime: '19:00-23:00',
        environmentalConditions: 'Garage installation, variable temperature',
        usageType: 'Peak shaving, evening consumption'
      };
    case 3: // Sonnen - solar optimized
      return {
        id: 3,
        batteryId: 3,
        chargingFrequency: 0.8, // times per day
        averageDischargeRate: 0.9, // kW
        deepDischargeCount: 8,
        peakUsageTime: '20:00-24:00',
        environmentalConditions: 'Basement installation, cool and dry',
        usageType: 'Solar storage, nighttime usage'
      };
    case 4: // Old battery - poor usage pattern
      return {
        id: 4,
        batteryId: 4,
        chargingFrequency: 1.8, // times per day (frequent)
        averageDischargeRate: 1.5, // kW (high)
        deepDischargeCount: 48, // many deep discharges
        peakUsageTime: '12:00-16:00',
        environmentalConditions: 'Outdoor installation, exposed to elements',
        usageType: 'Heavy load, frequent cycling'
      };
    default:
      return {
        id: batteryId,
        batteryId,
        chargingFrequency: 1.0,
        averageDischargeRate: 1.0,
        deepDischargeCount: 10,
        peakUsageTime: '18:00-22:00',
        environmentalConditions: 'Normal indoor conditions',
        usageType: 'Standard home usage'
      };
  }
}

function generateRecommendations(batteryId: number): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const now = new Date();
  
  // Common recommendation
  if (batteryId !== 4) { // Skip for battery 4 which is already critical
    recommendations.push({
      id: (batteryId * 100) + 1,
      batteryId,
      type: 'Optimization',
      description: 'Consider shifting heavy usage to midday hours to optimize solar charging efficiency.',
      priority: 'Medium',
      created: subDays(now, 10).toISOString(),
      resolved: false
    });
  }
  
  // Battery-specific recommendations
  switch (batteryId) {
    case 1: // Tesla - good condition
      recommendations.push({
        id: (batteryId * 100) + 2,
        batteryId,
        type: 'Maintenance',
        description: 'Schedule routine firmware update to improve performance and efficiency.',
        priority: 'Low',
        created: subDays(now, 5).toISOString(),
        resolved: false
      });
      break;
    case 2: // LG - slightly degraded
      recommendations.push({
        id: (batteryId * 100) + 2,
        batteryId,
        type: 'Warning',
        description: 'Battery temperature fluctuations detected. Consider relocating the battery to a more stable environment.',
        priority: 'Medium',
        created: subDays(now, 15).toISOString(),
        resolved: true
      });
      recommendations.push({
        id: (batteryId * 100) + 3,
        batteryId,
        type: 'Maintenance',
        description: 'High discharge rates detected during peak times. Consider spreading load to improve battery longevity.',
        priority: 'Medium',
        created: subDays(now, 3).toISOString(),
        resolved: false
      });
      break;
    case 3: // Sonnen - moderate degradation
      recommendations.push({
        id: (batteryId * 100) + 2,
        batteryId,
        type: 'Warning',
        description: 'Battery capacity declining faster than expected. Consider reducing depth of discharge to extend lifespan.',
        priority: 'Medium',
        created: subDays(now, 20).toISOString(),
        resolved: false
      });
      break;
    case 4: // Old battery - critical condition
      recommendations.push({
        id: (batteryId * 100) + 2,
        batteryId,
        type: 'Alert',
        description: 'Critical battery health detected. Replacement recommended within the next 30 days.',
        priority: 'High',
        created: subDays(now, 30).toISOString(),
        resolved: false
      });
      recommendations.push({
        id: (batteryId * 100) + 3,
        batteryId,
        type: 'Alert',
        description: 'Excessive temperature detected. Reduce load immediately to prevent potential safety issues.',
        priority: 'High',
        created: subDays(now, 2).toISOString(),
        resolved: false
      });
      recommendations.push({
        id: (batteryId * 100) + 4,
        batteryId,
        type: 'Maintenance',
        description: 'Consider recycling options for the battery when replacing. Contact our sustainability department for assistance.',
        priority: 'Medium',
        created: subDays(now, 1).toISOString(),
        resolved: false
      });
      break;
  }
  
  return recommendations;
}