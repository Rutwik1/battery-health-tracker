"use client"

import { create } from 'zustand'
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/app/types/schema'

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

// Helper function to simulate historical data
function generateHistoricalData(batteryId: number, startingHealth: number, startDate: Date): BatteryHistory[] {
  const result: BatteryHistory[] = [];
  const endDate = new Date();
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate data points for every 7 days
  for (let i = 0; i <= daysDiff; i += 7) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Calculate health degradation over time (linear approximation)
    const daysRatio = i / daysDiff;
    const healthPercentage = startingHealth - (startingHealth - (Math.random() * 20 + 60)) * daysRatio;
    
    // Calculate cycle count progression
    const cycleCount = Math.floor(i / 7 * (Math.random() * 5 + 10));
    
    result.push({
      id: i,
      batteryId,
      date,
      capacity: 5000 * (healthPercentage / 100), // Assuming 5000 mAh initial capacity
      healthPercentage,
      cycleCount,
    });
  }
  
  return result;
}

export const useBatteryStore = create<BatteryState>((set, get) => ({
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  isLoading: false,
  error: null,
  
  fetchBatteries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/batteries');
      if (!response.ok) throw new Error('Failed to fetch batteries');
      const batteries = await response.json();
      set({ batteries, isLoading: false });
    } catch (error) {
      console.error('Error fetching batteries:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false,
        // Demo mode with synthetic data when API fails
        batteries: [
          {
            id: 1,
            name: "EV Battery Pack #1",
            serialNumber: "BP-EV-2023-001",
            initialCapacity: 75000,
            currentCapacity: 69750,
            healthPercentage: 93,
            cycleCount: 127,
            expectedCycles: 1500,
            status: "Excellent",
            initialDate: new Date(2023, 0, 15),
            lastUpdated: new Date(2023, 9, 10),
            degradationRate: 0.25,
            manufacturer: "Tesla",
            model: "Model S Long Range",
            chemistry: "Lithium-ion NCA",
            voltage: 400,
            installationLocation: "Vehicle ID: TS-X9283"
          },
          {
            id: 2,
            name: "Energy Storage System #42",
            serialNumber: "ESS-2022-042",
            initialCapacity: 100000,
            currentCapacity: 86000,
            healthPercentage: 86,
            cycleCount: 312,
            expectedCycles: 2000,
            status: "Good",
            initialDate: new Date(2022, 3, 5),
            lastUpdated: new Date(2023, 9, 8),
            degradationRate: 0.42,
            manufacturer: "LG Chem",
            model: "RESU 10H",
            chemistry: "Lithium-ion NMC",
            voltage: 350,
            installationLocation: "Residential: 123 Green St"
          },
          {
            id: 3,
            name: "Industrial UPS #7",
            serialNumber: "UPS-IND-2021-007",
            initialCapacity: 50000,
            currentCapacity: 36000,
            healthPercentage: 72,
            cycleCount: 530,
            expectedCycles: 1000,
            status: "Fair",
            initialDate: new Date(2021, 1, 20),
            lastUpdated: new Date(2023, 9, 5),
            degradationRate: 0.65,
            manufacturer: "Schneider Electric",
            model: "Galaxy VS",
            chemistry: "Lithium Iron Phosphate",
            voltage: 480,
            installationLocation: "Data Center B, Rack 12"
          },
          {
            id: 4,
            name: "E-Bike Battery #19",
            serialNumber: "EB-2022-019",
            initialCapacity: 10000,
            currentCapacity: 4800,
            healthPercentage: 48,
            cycleCount: 290,
            expectedCycles: 500,
            status: "Poor",
            initialDate: new Date(2022, 5, 12),
            lastUpdated: new Date(2023, 9, 1),
            degradationRate: 1.25,
            manufacturer: "Bosch",
            model: "PowerPack 500",
            chemistry: "Lithium-ion",
            voltage: 36,
            installationLocation: "E-Bike ID: TR-800"
          }
        ]
      });
    }
  },
  
  getBattery: (id: number) => {
    return get().batteries.find(b => b.id === id);
  },
  
  addBattery: async (batteryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/batteries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batteryData)
      });
      
      if (!response.ok) throw new Error('Failed to add battery');
      
      const newBattery: Battery = await response.json();
      set(state => ({
        batteries: [...state.batteries, newBattery],
        isLoading: false
      }));
      
      return newBattery;
    } catch (error) {
      console.error('Error adding battery:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateBattery: async (id: number, batteryUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batteryUpdate)
      });
      
      if (!response.ok) throw new Error('Failed to update battery');
      
      const updatedBattery: Battery = await response.json();
      set(state => ({
        batteries: state.batteries.map(b => 
          b.id === id ? { ...b, ...updatedBattery } : b
        ),
        isLoading: false
      }));
      
      return updatedBattery;
    } catch (error) {
      console.error('Error updating battery:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      return undefined;
    }
  },
  
  deleteBattery: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete battery');
      
      set(state => ({
        batteries: state.batteries.filter(b => b.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error('Error deleting battery:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      return false;
    }
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/history`);
      
      if (!response.ok) throw new Error('Failed to fetch battery history');
      
      const history = await response.json();
      set(state => {
        const newHistories = new Map(state.batteryHistories);
        newHistories.set(batteryId, history);
        return {
          batteryHistories: newHistories,
          isLoading: false
        };
      });
      
      return history;
    } catch (error) {
      console.error('Error fetching battery history:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
      
      // Return synthetic data for demo purposes
      const battery = get().getBattery(batteryId);
      if (battery) {
        const history = generateHistoricalData(
          batteryId,
          100, // Starting at 100% health
          battery.initialDate
        );
        
        set(state => {
          const newHistories = new Map(state.batteryHistories);
          newHistories.set(batteryId, history);
          return {
            batteryHistories: newHistories
          };
        });
        
        return history;
      }
      
      return [];
    }
  },
  
  fetchBatteryHistoryFiltered: async (batteryId: number, startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }).toString();
      
      const response = await fetch(`/api/batteries/${batteryId}/history?${query}`);
      
      if (!response.ok) throw new Error('Failed to fetch filtered battery history');
      
      const history = await response.json();
      return history;
    } catch (error) {
      console.error('Error fetching filtered battery history:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      
      // Return filtered synthetic data
      const allHistory = get().batteryHistories.get(batteryId) || [];
      return allHistory.filter(h => 
        h.date >= startDate && h.date <= endDate
      );
    } finally {
      set({ isLoading: false });
    }
  },
  
  addBatteryHistory: async (historyData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${historyData.batteryId}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyData)
      });
      
      if (!response.ok) throw new Error('Failed to add battery history');
      
      const newHistory: BatteryHistory = await response.json();
      set(state => {
        const batteryHistories = new Map(state.batteryHistories);
        const currentHistory = batteryHistories.get(historyData.batteryId) || [];
        batteryHistories.set(historyData.batteryId, [...currentHistory, newHistory]);
        
        return {
          batteryHistories,
          isLoading: false
        };
      });
      
      return newHistory;
    } catch (error) {
      console.error('Error adding battery history:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      throw error;
    }
  },
  
  getUsagePattern: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/usage`);
      
      if (!response.ok) throw new Error('Failed to fetch usage pattern');
      
      const pattern = await response.json();
      set(state => {
        const newPatterns = new Map(state.usagePatterns);
        newPatterns.set(batteryId, pattern);
        return {
          usagePatterns: newPatterns,
          isLoading: false
        };
      });
      
      return pattern;
    } catch (error) {
      console.error('Error fetching usage pattern:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      
      // Demo usage patterns
      const demoPatterns: Record<number, UsagePattern> = {
        1: {
          id: 1,
          batteryId: 1,
          chargingFrequency: 3.2,
          dischargeDepth: 25,
          temperatureExposure: 23,
          usageType: "Light",
          environmentalConditions: "Indoor",
          fastChargingPercentage: 10
        },
        2: {
          id: 2,
          batteryId: 2,
          chargingFrequency: 7,
          dischargeDepth: 60,
          temperatureExposure: 27,
          usageType: "Moderate",
          environmentalConditions: "Mixed",
          fastChargingPercentage: 45
        },
        3: {
          id: 3,
          batteryId: 3,
          chargingFrequency: 14,
          dischargeDepth: 85,
          temperatureExposure: 32,
          usageType: "Heavy",
          environmentalConditions: "Mixed",
          fastChargingPercentage: 70
        },
        4: {
          id: 4,
          batteryId: 4,
          chargingFrequency: 5.5,
          dischargeDepth: 90,
          temperatureExposure: 35,
          usageType: "Heavy",
          environmentalConditions: "Outdoor",
          fastChargingPercentage: 85
        }
      };
      
      const pattern = demoPatterns[batteryId];
      if (pattern) {
        set(state => {
          const newPatterns = new Map(state.usagePatterns);
          newPatterns.set(batteryId, pattern);
          return {
            usagePatterns: newPatterns
          };
        });
        return pattern;
      }
      
      return undefined;
    }
  },
  
  updateUsagePattern: async (batteryId: number, patternUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patternUpdate)
      });
      
      if (!response.ok) throw new Error('Failed to update usage pattern');
      
      const updatedPattern: UsagePattern = await response.json();
      set(state => {
        const newPatterns = new Map(state.usagePatterns);
        const currentPattern = newPatterns.get(batteryId);
        
        if (currentPattern) {
          newPatterns.set(batteryId, { ...currentPattern, ...updatedPattern });
        } else {
          newPatterns.set(batteryId, updatedPattern);
        }
        
        return {
          usagePatterns: newPatterns,
          isLoading: false
        };
      });
      
      return updatedPattern;
    } catch (error) {
      console.error('Error updating usage pattern:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      return undefined;
    }
  },
  
  getRecommendations: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/recommendations`);
      
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const recommendations = await response.json();
      set(state => {
        const newRecommendations = new Map(state.recommendations);
        newRecommendations.set(batteryId, recommendations);
        return {
          recommendations: newRecommendations,
          isLoading: false
        };
      });
      
      return recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      
      // Demo recommendations
      const demoRecommendations: Record<number, Recommendation[]> = {
        1: [
          {
            id: 1,
            batteryId: 1,
            type: "Maintenance",
            message: "Schedule regular voltage checks to maintain peak performance",
            createdAt: new Date(2023, 8, 15),
            resolved: false
          }
        ],
        2: [
          {
            id: 2,
            batteryId: 2,
            type: "Usage",
            message: "Reduce fast charging frequency to extend overall battery lifespan",
            createdAt: new Date(2023, 7, 10),
            resolved: true
          },
          {
            id: 3,
            batteryId: 2,
            type: "Maintenance",
            message: "Conduct thermal assessment to optimize operating conditions",
            createdAt: new Date(2023, 8, 25),
            resolved: false
          }
        ],
        3: [
          {
            id: 4,
            batteryId: 3,
            type: "Replacement",
            message: "Plan for replacement within 3-4 months due to accelerating degradation",
            createdAt: new Date(2023, 8, 30),
            resolved: false
          },
          {
            id: 5,
            batteryId: 3,
            type: "Maintenance",
            message: "Verify cooling system efficiency to prevent thermal stress",
            createdAt: new Date(2023, 9, 5),
            resolved: false
          }
        ],
        4: [
          {
            id: 6,
            batteryId: 4,
            type: "Replacement",
            message: "Immediate replacement recommended - battery health below critical threshold",
            createdAt: new Date(2023, 8, 1),
            resolved: false
          },
          {
            id: 7,
            batteryId: 4,
            type: "Usage",
            message: "Review charging practices to prevent similar degradation in replacement battery",
            createdAt: new Date(2023, 8, 10),
            resolved: false
          }
        ]
      };
      
      const recommendations = demoRecommendations[batteryId] || [];
      if (recommendations.length > 0) {
        set(state => {
          const newRecommendations = new Map(state.recommendations);
          newRecommendations.set(batteryId, recommendations);
          return {
            recommendations: newRecommendations
          };
        });
      }
      
      return recommendations;
    }
  },
  
  updateRecommendation: async (id: number, resolved: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved })
      });
      
      if (!response.ok) throw new Error('Failed to update recommendation');
      
      const updatedRecommendation: Recommendation = await response.json();
      set(state => {
        const newRecommendations = new Map(state.recommendations);
        
        // Find which battery this recommendation belongs to
        for (const [batteryId, recommendations] of newRecommendations.entries()) {
          const index = recommendations.findIndex(r => r.id === id);
          if (index !== -1) {
            const updated = [...recommendations];
            updated[index] = { ...updated[index], resolved };
            newRecommendations.set(batteryId, updated);
            break;
          }
        }
        
        return {
          recommendations: newRecommendations,
          isLoading: false
        };
      });
      
      return updatedRecommendation;
    } catch (error) {
      console.error('Error updating recommendation:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false 
      });
      
      // Update in the demo data
      let updatedRecommendation: Recommendation | undefined;
      
      set(state => {
        const newRecommendations = new Map(state.recommendations);
        
        for (const [batteryId, recommendations] of newRecommendations.entries()) {
          const index = recommendations.findIndex(r => r.id === id);
          if (index !== -1) {
            updatedRecommendation = { ...recommendations[index], resolved };
            const updated = [...recommendations];
            updated[index] = updatedRecommendation;
            newRecommendations.set(batteryId, updated);
            break;
          }
        }
        
        return {
          recommendations: newRecommendations
        };
      });
      
      return updatedRecommendation;
    }
  }
}))