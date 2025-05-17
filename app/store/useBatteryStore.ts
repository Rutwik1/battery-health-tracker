"use client"

import { create } from "zustand"
import { Battery, BatteryHistory, UsagePattern, Recommendation } from "@/app/types/schema"

interface BatteryState {
  batteries: Battery[];
  batteryHistories: Map<number, BatteryHistory[]>;
  usagePatterns: Map<number, UsagePattern>;
  recommendations: Map<number, Recommendation[]>;
  isLoading: boolean;
  error: string | null;
  
  // Battery CRUD operations
  fetchBatteries: () => Promise<void>;
  getBattery: (id: number) => Battery | undefined;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, battery: Partial<Battery>) => Promise<Battery | undefined>;
  deleteBattery: (id: number) => Promise<boolean>;
  
  // Battery history
  fetchBatteryHistory: (batteryId: number) => Promise<BatteryHistory[]>;
  fetchBatteryHistoryFiltered: (batteryId: number, startDate: Date, endDate: Date) => Promise<BatteryHistory[]>;
  addBatteryHistory: (history: Omit<BatteryHistory, 'id'>) => Promise<BatteryHistory>;
  
  // Usage pattern
  getUsagePattern: (batteryId: number) => Promise<UsagePattern | undefined>;
  updateUsagePattern: (batteryId: number, pattern: Partial<UsagePattern>) => Promise<UsagePattern | undefined>;
  
  // Recommendations
  getRecommendations: (batteryId: number) => Promise<Recommendation[]>;
  updateRecommendation: (id: number, resolved: boolean) => Promise<Recommendation | undefined>;
}

// Sample battery data for demo purposes
const demoData = {
  batteries: [
    {
      id: 1,
      name: "Tesla Model S Battery Pack",
      serialNumber: "TSB-10045",
      initialCapacity: 100000,
      currentCapacity: 91200,
      healthPercentage: 91.2,
      cycleCount: 320,
      expectedCycles: 1500,
      status: "Excellent",
      initialDate: new Date(2022, 1, 15),
      lastUpdated: new Date(),
      degradationRate: 0.28,
      manufacturer: "Tesla",
      model: "S-85D",
      chemistry: "Lithium-ion",
      voltage: 375,
      installationLocation: "Vehicle Bay 3"
    },
    {
      id: 2,
      name: "Grid Energy Storage Unit 1",
      serialNumber: "GES-2204",
      initialCapacity: 250000,
      currentCapacity: 217500,
      healthPercentage: 87,
      cycleCount: 450,
      expectedCycles: 2000,
      status: "Good",
      initialDate: new Date(2021, 6, 10),
      lastUpdated: new Date(),
      degradationRate: 0.35,
      manufacturer: "LG Chem",
      model: "RESU-H",
      chemistry: "Lithium-ion",
      voltage: 400,
      installationLocation: "Grid Station Alpha"
    },
    {
      id: 3,
      name: "Solar Backup Battery",
      serialNumber: "SBB-3389",
      initialCapacity: 50000,
      currentCapacity: 38500,
      healthPercentage: 77,
      cycleCount: 612,
      expectedCycles: 1200,
      status: "Fair",
      initialDate: new Date(2020, 3, 22),
      lastUpdated: new Date(),
      degradationRate: 0.42,
      manufacturer: "Enphase",
      model: "IQ Battery",
      chemistry: "Lithium Iron Phosphate",
      voltage: 240,
      installationLocation: "Solar Array B"
    },
    {
      id: 4,
      name: "Emergency Backup Generator",
      serialNumber: "EBG-7710",
      initialCapacity: 30000,
      currentCapacity: 17400,
      healthPercentage: 58,
      cycleCount: 890,
      expectedCycles: 1000,
      status: "Poor",
      initialDate: new Date(2019, 8, 5),
      lastUpdated: new Date(),
      degradationRate: 0.65,
      manufacturer: "PowerWall",
      model: "PW-100",
      chemistry: "Lithium-ion",
      voltage: 120,
      installationLocation: "Server Room"
    }
  ] as Battery[],
  
  usagePatterns: [
    {
      id: 1,
      batteryId: 1,
      chargingFrequency: 3.5,
      dischargeDepth: 20,
      temperatureExposure: 22,
      usageType: "Light",
      environmentalConditions: "Indoor",
      fastChargingPercentage: 15
    },
    {
      id: 2,
      batteryId: 2,
      chargingFrequency: 7,
      dischargeDepth: 40,
      temperatureExposure: 25,
      usageType: "Moderate",
      environmentalConditions: "Mixed",
      fastChargingPercentage: 30
    },
    {
      id: 3,
      batteryId: 3,
      chargingFrequency: 4.2,
      dischargeDepth: 60,
      temperatureExposure: 30,
      usageType: "Heavy",
      environmentalConditions: "Outdoor",
      fastChargingPercentage: 45
    },
    {
      id: 4,
      batteryId: 4,
      chargingFrequency: 2,
      dischargeDepth: 80,
      temperatureExposure: 35,
      usageType: "Heavy",
      environmentalConditions: "Mixed",
      fastChargingPercentage: 75
    }
  ] as UsagePattern[],
  
  recommendations: [
    {
      id: 1,
      batteryId: 1,
      type: "Maintenance",
      message: "Schedule routine inspection to maintain optimal performance",
      createdAt: new Date(2023, 3, 15),
      resolved: false
    },
    {
      id: 2,
      batteryId: 2,
      type: "Usage",
      message: "Reduce fast charging frequency to improve longevity",
      createdAt: new Date(2023, 4, 10),
      resolved: true
    },
    {
      id: 3,
      batteryId: 3,
      type: "Maintenance",
      message: "Battery approaching 80% health threshold, consider maintenance",
      createdAt: new Date(2023, 5, 5),
      resolved: false
    },
    {
      id: 4,
      batteryId: 4,
      type: "Replacement",
      message: "Schedule replacement within next 3 months, health below 60%",
      createdAt: new Date(2023, 5, 20),
      resolved: false
    }
  ] as Recommendation[]
};

// Generate some historical data for each battery
function generateHistoricalData(batteryId: number, startingHealth: number, startDate: Date): BatteryHistory[] {
  const history: BatteryHistory[] = [];
  const currentDate = new Date();
  const startTime = startDate.getTime();
  const endTime = currentDate.getTime();
  
  // We'll create data points roughly every 30 days (in milliseconds)
  const interval = 30 * 24 * 60 * 60 * 1000;
  let cycleCount = 0;
  
  // Get the battery to calculate its capacity
  const battery = demoData.batteries.find(b => b.id === batteryId);
  if (!battery) return [];
  
  // Calculate degradation rate per month
  const ageInMonths = Math.max(1, (endTime - startTime) / (30 * 24 * 60 * 60 * 1000));
  const totalHealthLoss = startingHealth - battery.healthPercentage;
  const degradationPerMonth = totalHealthLoss / ageInMonths;
  
  let healthPercentage = startingHealth;
  let capacity = battery.initialCapacity * (healthPercentage / 100);
  
  for (let time = startTime; time <= endTime; time += interval) {
    cycleCount += Math.floor(Math.random() * 15) + 5; // Add 5-20 cycles per month
    
    // Health decreases over time
    healthPercentage = Math.max(
      battery.healthPercentage, 
      startingHealth - ((time - startTime) / interval) * degradationPerMonth
    );
    
    // Capacity is directly related to health
    capacity = battery.initialCapacity * (healthPercentage / 100);
    
    // Add some randomness to make the data look more realistic
    const randomVariation = (Math.random() * 0.02) - 0.01; // -1% to +1%
    healthPercentage = Math.max(0, Math.min(100, healthPercentage * (1 + randomVariation)));
    capacity = Math.max(0, capacity * (1 + randomVariation));
    
    history.push({
      id: history.length + 1,
      batteryId,
      date: new Date(time),
      capacity: Math.round(capacity),
      healthPercentage: parseFloat(healthPercentage.toFixed(2)),
      cycleCount
    });
  }
  
  return history;
}

// Generate historical data for demo
let batteryHistories = new Map<number, BatteryHistory[]>();
demoData.batteries.forEach(battery => {
  batteryHistories.set(
    battery.id, 
    generateHistoricalData(battery.id, 100, battery.initialDate)
  );
});

// Convert to Map for usage patterns
let usagePatternsMap = new Map<number, UsagePattern>();
demoData.usagePatterns.forEach(pattern => {
  usagePatternsMap.set(pattern.batteryId, pattern);
});

// Convert to Map for recommendations
let recommendationsMap = new Map<number, Recommendation[]>();
demoData.batteries.forEach(battery => {
  const batteryRecommendations = demoData.recommendations.filter(r => r.batteryId === battery.id);
  recommendationsMap.set(battery.id, batteryRecommendations);
});

export const useBatteryStore = create<BatteryState>((set, get) => ({
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  isLoading: true,
  error: null,

  fetchBatteries: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use demo data
      set({ 
        batteries: demoData.batteries,
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  getBattery: (id: number) => {
    return get().batteries.find(battery => battery.id === id);
  },
  
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newId = Math.max(0, ...get().batteries.map(b => b.id)) + 1;
      
      const newBattery: Battery = {
        ...batteryData,
        id: newId,
        status: batteryData.healthPercentage >= 90 ? "Excellent" : 
                batteryData.healthPercentage >= 75 ? "Good" : 
                batteryData.healthPercentage >= 60 ? "Fair" : "Poor",
        lastUpdated: new Date()
      };
      
      const updatedBatteries = [...get().batteries, newBattery];
      
      set({ 
        batteries: updatedBatteries,
        isLoading: false 
      });
      
      return newBattery;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const battery = get().batteries.find(b => b.id === id);
      
      if (!battery) {
        set({ isLoading: false });
        return undefined;
      }
      
      // Update health status based on percentage if it was changed
      let status = battery.status;
      if ('healthPercentage' in batteryUpdate) {
        const healthPercentage = batteryUpdate.healthPercentage || battery.healthPercentage;
        status = healthPercentage >= 90 ? "Excellent" : 
                healthPercentage >= 75 ? "Good" : 
                healthPercentage >= 60 ? "Fair" : "Poor";
      }
      
      const updatedBattery: Battery = {
        ...battery,
        ...batteryUpdate,
        status,
        lastUpdated: new Date()
      };
      
      const updatedBatteries = get().batteries.map(b => 
        b.id === id ? updatedBattery : b
      );
      
      set({ 
        batteries: updatedBatteries,
        isLoading: false 
      });
      
      return updatedBattery;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  deleteBattery: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedBatteries = get().batteries.filter(b => b.id !== id);
      
      set({ 
        batteries: updatedBatteries,
        isLoading: false 
      });
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get history from demo data
      const history = batteryHistories.get(batteryId) || [];
      
      // Update the state
      const updatedHistories = new Map(get().batteryHistories);
      updatedHistories.set(batteryId, history);
      
      set({ 
        batteryHistories: updatedHistories,
        isLoading: false 
      });
      
      return history;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  fetchBatteryHistoryFiltered: async (batteryId: number, startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get history and filter by date range
      const allHistory = batteryHistories.get(batteryId) || [];
      
      const filteredHistory = allHistory.filter(item => 
        item.date >= startDate && item.date <= endDate
      );
      
      set({ isLoading: false });
      
      return filteredHistory;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  addBatteryHistory: async (historyData: Omit<BatteryHistory, 'id'>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const batteryId = historyData.batteryId;
      const history = batteryHistories.get(batteryId) || [];
      
      // Create new history entry
      const newId = history.length > 0 
        ? Math.max(...history.map(h => h.id)) + 1 
        : 1;
      
      const newHistory: BatteryHistory = {
        ...historyData,
        id: newId
      };
      
      // Update local history
      const updatedHistory = [...history, newHistory].sort((a, b) => 
        a.date.getTime() - b.date.getTime()
      );
      
      batteryHistories.set(batteryId, updatedHistory);
      
      // Update state
      const updatedHistories = new Map(get().batteryHistories);
      updatedHistories.set(batteryId, updatedHistory);
      
      set({ 
        batteryHistories: updatedHistories,
        isLoading: false 
      });
      
      // Also update the battery's current state
      const battery = get().batteries.find(b => b.id === batteryId);
      if (battery) {
        const { capacity, healthPercentage, cycleCount } = historyData;
        
        get().updateBattery(batteryId, {
          currentCapacity: capacity,
          healthPercentage,
          cycleCount,
          lastUpdated: historyData.date
        });
      }
      
      return newHistory;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  getUsagePattern: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get pattern from demo data
      const pattern = usagePatternsMap.get(batteryId);
      
      if (pattern) {
        // Update state
        const updatedPatterns = new Map(get().usagePatterns);
        updatedPatterns.set(batteryId, pattern);
        
        set({ 
          usagePatterns: updatedPatterns,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
      
      return pattern;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  updateUsagePattern: async (batteryId: number, patternData: Partial<UsagePattern>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const pattern = usagePatternsMap.get(batteryId);
      
      if (!pattern) {
        set({ isLoading: false });
        return undefined;
      }
      
      // Update pattern
      const updatedPattern: UsagePattern = {
        ...pattern,
        ...patternData
      };
      
      usagePatternsMap.set(batteryId, updatedPattern);
      
      // Update state
      const updatedPatterns = new Map(get().usagePatterns);
      updatedPatterns.set(batteryId, updatedPattern);
      
      set({ 
        usagePatterns: updatedPatterns,
        isLoading: false 
      });
      
      return updatedPattern;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  getRecommendations: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get recommendations from demo data
      const recommendations = recommendationsMap.get(batteryId) || [];
      
      // Update state
      const updatedRecommendations = new Map(get().recommendations);
      updatedRecommendations.set(batteryId, recommendations);
      
      set({ 
        recommendations: updatedRecommendations,
        isLoading: false 
      });
      
      return recommendations;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  updateRecommendation: async (id: number, resolved: boolean) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find the recommendation and its battery
      let foundRecommendation: Recommendation | undefined;
      let batteryId: number | undefined;
      
      for (const [bid, recs] of recommendationsMap.entries()) {
        const recommendation = recs.find(r => r.id === id);
        if (recommendation) {
          foundRecommendation = recommendation;
          batteryId = bid;
          break;
        }
      }
      
      if (!foundRecommendation || batteryId === undefined) {
        set({ isLoading: false });
        return undefined;
      }
      
      // Update recommendation
      const updatedRecommendation: Recommendation = {
        ...foundRecommendation,
        resolved
      };
      
      // Update in local data
      const recommendations = recommendationsMap.get(batteryId) || [];
      const updatedRecommendations = recommendations.map(r => 
        r.id === id ? updatedRecommendation : r
      );
      
      recommendationsMap.set(batteryId, updatedRecommendations);
      
      // Update state
      const stateRecommendations = new Map(get().recommendations);
      stateRecommendations.set(batteryId, updatedRecommendations);
      
      set({ 
        recommendations: stateRecommendations,
        isLoading: false 
      });
      
      return updatedRecommendation;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));