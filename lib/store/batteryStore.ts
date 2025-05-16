'use client'

import { create } from 'zustand'
import { format, subDays, subMonths } from 'date-fns'

export interface Battery {
  id: number;
  name: string;
  serialNumber: string;
  initialCapacity: number;
  currentCapacity: number;
  healthPercentage: number;
  cycleCount: number;
  expectedCycles: number;
  status: string;
  initialDate: Date | string;
  lastUpdated: Date | string;
  degradationRate: number;
}

export interface BatteryHistory {
  id: number;
  batteryId: number;
  date: Date | string;
  capacity: number;
  healthPercentage: number;
  cycleCount: number;
}

export interface UsagePattern {
  id: number;
  batteryId: number;
  chargingFrequency: number;
  dischargeCycles: number;
  averageDischargeRate: number;
  temperatureExposure: string;
  usageType: string;
}

export interface Recommendation {
  id: number;
  batteryId: number;
  type: string;
  message: string;
  createdAt: Date | string;
  resolved: boolean;
}

// Helper function to generate historical data for demo purposes
const generateHistoricalData = (battery: Battery): BatteryHistory[] => {
  const result: BatteryHistory[] = [];
  const today = new Date();
  const startDate = new Date(battery.initialDate);
  
  // Generate entry for each month
  for (let i = 0; i <= 11; i++) {
    const date = subMonths(today, 11 - i);
    if (date < startDate) continue;
    
    // Calculate declining health
    const monthsSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
    const degradation = battery.degradationRate * monthsSinceStart;
    const health = Math.max(60, 100 - degradation);
    const capacity = Math.floor((battery.initialCapacity * health) / 100);
    const cycles = Math.floor((battery.cycleCount / 12) * (i + 1));
    
    result.push({
      id: i + 1,
      batteryId: battery.id,
      date: format(date, 'yyyy-MM-dd'),
      capacity,
      healthPercentage: health,
      cycleCount: cycles
    });
  }
  
  return result;
};

interface BatteryStore {
  // State
  batteries: Battery[];
  batteryHistories: Record<number, BatteryHistory[]>;
  usagePatterns: UsagePattern[];
  recommendations: Recommendation[];
  isLoading: boolean;
  nextId: number;
  
  // Actions
  fetchBatteries: () => Promise<void>;
  fetchBatteryHistory: (batteryId: number) => Promise<BatteryHistory[]>;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, data: Partial<Battery>) => Promise<Battery>;
  deleteBattery: (id: number) => Promise<boolean>;
  
  // Simulated real-time data updates
  startRealtimeUpdates: () => void;
  stopRealtimeUpdates: () => void;
}

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  batteries: [],
  batteryHistories: {},
  usagePatterns: [],
  recommendations: [],
  isLoading: false,
  nextId: 5, // Start from 5 as we have 4 initial batteries

  fetchBatteries: async () => {
    set({ isLoading: true });
    try {
      // In a real app, this would be a fetch call to an API endpoint
      // Simulating API call with demo data
      setTimeout(() => {
        const demoBatteries: Battery[] = [
          {
            id: 1,
            name: "Battery #1",
            serialNumber: "BAT20240001",
            initialCapacity: 5000,
            currentCapacity: 4750,
            healthPercentage: 95,
            cycleCount: 32,
            expectedCycles: 500,
            status: "Optimal",
            initialDate: "2024-02-15",
            lastUpdated: new Date().toISOString(),
            degradationRate: 0.5
          },
          {
            id: 2,
            name: "Battery #2",
            serialNumber: "BAT20240002",
            initialCapacity: 4000,
            currentCapacity: 3600,
            healthPercentage: 90,
            cycleCount: 48,
            expectedCycles: 500,
            status: "Good",
            initialDate: "2024-01-05",
            lastUpdated: new Date().toISOString(),
            degradationRate: 0.8
          },
          {
            id: 3,
            name: "Battery #3",
            serialNumber: "BAT20240003",
            initialCapacity: 6000,
            currentCapacity: 4980,
            healthPercentage: 83,
            cycleCount: 87,
            expectedCycles: 500,
            status: "Warning",
            initialDate: "2023-11-20",
            lastUpdated: new Date().toISOString(),
            degradationRate: 1.2
          },
          {
            id: 4,
            name: "Battery #4",
            serialNumber: "BAT20240004",
            initialCapacity: 3000,
            currentCapacity: 2100,
            healthPercentage: 70,
            cycleCount: 125,
            expectedCycles: 500,
            status: "Critical",
            initialDate: "2023-09-10",
            lastUpdated: new Date().toISOString(),
            degradationRate: 1.8
          }
        ];

        // Initialize history data
        const historiesMap: Record<number, BatteryHistory[]> = {};
        demoBatteries.forEach(battery => {
          historiesMap[battery.id] = generateHistoricalData(battery);
        });

        // Initialize usage patterns
        const demoPatterns: UsagePattern[] = [
          {
            id: 1,
            batteryId: 1,
            chargingFrequency: 1.2,
            dischargeCycles: 28,
            averageDischargeRate: 12,
            temperatureExposure: "Normal",
            usageType: "Regular"
          },
          {
            id: 2,
            batteryId: 2,
            chargingFrequency: 1.5,
            dischargeCycles: 42,
            averageDischargeRate: 15,
            temperatureExposure: "Normal",
            usageType: "Regular"
          },
          {
            id: 3,
            batteryId: 3,
            chargingFrequency: 2.1,
            dischargeCycles: 76,
            averageDischargeRate: 18,
            temperatureExposure: "High",
            usageType: "Heavy"
          },
          {
            id: 4,
            batteryId: 4,
            chargingFrequency: 2.8,
            dischargeCycles: 110,
            averageDischargeRate: 22,
            temperatureExposure: "High",
            usageType: "Heavy"
          }
        ];

        // Initialize recommendations
        const demoRecommendations: Recommendation[] = [
          {
            id: 1,
            batteryId: 1,
            type: "Optimization",
            message: "Consider charging to 80% to extend battery lifespan.",
            createdAt: subDays(new Date(), 5).toISOString(),
            resolved: false
          },
          {
            id: 2,
            batteryId: 2,
            type: "Maintenance",
            message: "Battery is approaching 50 cycles. Consider calibration.",
            createdAt: subDays(new Date(), 3).toISOString(),
            resolved: true
          },
          {
            id: 3,
            batteryId: 3,
            type: "Warning",
            message: "High temperature exposure detected. Avoid using in hot environments.",
            createdAt: subDays(new Date(), 7).toISOString(),
            resolved: false
          },
          {
            id: 4,
            batteryId: 4,
            type: "Critical",
            message: "Battery health below 75%. Consider replacement within 2 months.",
            createdAt: subDays(new Date(), 10).toISOString(),
            resolved: false
          }
        ];

        set({ 
          batteries: demoBatteries, 
          batteryHistories: historiesMap,
          usagePatterns: demoPatterns,
          recommendations: demoRecommendations,
          isLoading: false 
        });
      }, 500);
    } catch (error) {
      console.error('Error fetching batteries:', error);
      set({ isLoading: false });
    }
  },

  fetchBatteryHistory: async (batteryId: number) => {
    const { batteryHistories } = get();
    return batteryHistories[batteryId] || [];
  },

  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    const { batteries, nextId } = get();
    
    const newBattery: Battery = {
      ...batteryData,
      id: nextId,
      initialDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    
    // Generate history for new battery
    const history = generateHistoricalData(newBattery);
    
    set({
      batteries: [...batteries, newBattery],
      batteryHistories: {
        ...get().batteryHistories,
        [newBattery.id]: history
      },
      nextId: nextId + 1
    });
    
    return newBattery;
  },

  updateBattery: async (id: number, data: Partial<Battery>) => {
    const { batteries } = get();
    const batteryIndex = batteries.findIndex(b => b.id === id);
    
    if (batteryIndex === -1) {
      throw new Error(`Battery with id ${id} not found`);
    }
    
    const updatedBattery = {
      ...batteries[batteryIndex],
      ...data,
      lastUpdated: new Date().toISOString()
    };
    
    const updatedBatteries = [...batteries];
    updatedBatteries[batteryIndex] = updatedBattery;
    
    set({ batteries: updatedBatteries });
    return updatedBattery;
  },

  deleteBattery: async (id: number) => {
    const { batteries, batteryHistories } = get();
    const updatedBatteries = batteries.filter(b => b.id !== id);
    
    // Remove from histories
    const updatedHistories = { ...batteryHistories };
    delete updatedHistories[id];
    
    set({ 
      batteries: updatedBatteries,
      batteryHistories: updatedHistories
    });
    
    return true;
  },

  startRealtimeUpdates: () => {
    // Simulate real-time updates every 5 minutes
    const interval = setInterval(() => {
      const { batteries } = get();
      
      // Apply minor random fluctuations to simulate real-time data
      const updatedBatteries = batteries.map(battery => {
        // Small random change in health (-0.1 to -0.01)
        const healthDelta = -(Math.random() * 0.09 + 0.01);
        const newHealth = Math.max(1, battery.healthPercentage + healthDelta);
        
        // Update capacity based on health
        const newCapacity = Math.floor((battery.initialCapacity * newHealth) / 100);
        
        // Small random change in cycle count (+0 to +0.5)
        const cycleDelta = Math.random() * 0.5;
        const newCycles = battery.cycleCount + cycleDelta;
        
        return {
          ...battery,
          healthPercentage: Number(newHealth.toFixed(1)),
          currentCapacity: newCapacity,
          cycleCount: Number(newCycles.toFixed(1)),
          lastUpdated: new Date().toISOString()
        };
      });
      
      set({ batteries: updatedBatteries });
    }, 300000); // 5 minutes
    
    // Store interval ID in localStorage to clear on unmount/refresh
    if (typeof window !== 'undefined') {
      localStorage.setItem('batteryUpdateInterval', interval.toString());
    }
  },

  stopRealtimeUpdates: () => {
    if (typeof window !== 'undefined') {
      const intervalId = localStorage.getItem('batteryUpdateInterval');
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        localStorage.removeItem('batteryUpdateInterval');
      }
    }
  }
}));