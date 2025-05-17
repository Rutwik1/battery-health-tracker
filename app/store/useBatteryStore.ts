import { create } from 'zustand';
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '../types/schema';
import { generateDemoData } from '../lib/demoData';

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
  updateUsagePattern: (id: number, pattern: Partial<UsagePattern>) => Promise<UsagePattern | undefined>;
  
  // Recommendations
  getRecommendations: (batteryId: number) => Promise<Recommendation[]>;
  updateRecommendation: (id: number, resolved: boolean) => Promise<Recommendation | undefined>;
}

export const useBatteryStore = create<BatteryState>((set, get) => {
  // Load demo data
  const demoData = generateDemoData();
  
  return {
    batteries: demoData.batteries,
    batteryHistories: demoData.batteryHistories,
    usagePatterns: demoData.usagePatterns,
    recommendations: demoData.recommendations,
    isLoading: false,
    error: null,
    
    // Battery operations
    fetchBatteries: async () => {
      // Simulating API request
      set({ isLoading: true, error: null });
      
      try {
        // In a real app, we would make an API call here
        // For demo purposes, we'll just use the demo data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        set({ 
          batteries: demoData.batteries,
          isLoading: false
        });
      } catch (error) {
        set({ 
          error: "Failed to fetch batteries",
          isLoading: false
        });
      }
    },
    
    getBattery: (id: number) => {
      return get().batteries.find(battery => battery.id === id);
    },
    
    addBattery: async (batteryData: Omit<Battery, 'id'>) => {
      set({ isLoading: true, error: null });
      
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const nextId = Math.max(...get().batteries.map(b => b.id)) + 1;
        const newBattery: Battery = {
          ...batteryData,
          id: nextId,
          status: batteryData.status || 'Excellent',
          initialDate: batteryData.initialDate || new Date(),
          lastUpdated: new Date()
        };
        
        set(state => ({
          batteries: [...state.batteries, newBattery],
          isLoading: false
        }));
        
        return newBattery;
      } catch (error) {
        set({ 
          error: "Failed to add battery",
          isLoading: false
        });
        throw error;
      }
    },
    
    updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const batteryIndex = get().batteries.findIndex(b => b.id === id);
        if (batteryIndex === -1) {
          set({ isLoading: false });
          return undefined;
        }
        
        const updatedBattery = {
          ...get().batteries[batteryIndex],
          ...batteryUpdate,
          lastUpdated: new Date()
        };
        
        const updatedBatteries = [...get().batteries];
        updatedBatteries[batteryIndex] = updatedBattery;
        
        set({
          batteries: updatedBatteries,
          isLoading: false
        });
        
        return updatedBattery;
      } catch (error) {
        set({ 
          error: "Failed to update battery",
          isLoading: false
        });
        throw error;
      }
    },
    
    deleteBattery: async (id: number) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const batteryIndex = get().batteries.findIndex(b => b.id === id);
        if (batteryIndex === -1) {
          set({ isLoading: false });
          return false;
        }
        
        const updatedBatteries = get().batteries.filter(b => b.id !== id);
        
        set({
          batteries: updatedBatteries,
          isLoading: false
        });
        
        return true;
      } catch (error) {
        set({ 
          error: "Failed to delete battery",
          isLoading: false
        });
        throw error;
      }
    },
    
    // Battery history operations
    fetchBatteryHistory: async (batteryId: number) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const histories = get().batteryHistories.get(batteryId) || [];
        
        set({ isLoading: false });
        return histories;
      } catch (error) {
        set({ 
          error: "Failed to fetch battery history",
          isLoading: false
        });
        throw error;
      }
    },
    
    fetchBatteryHistoryFiltered: async (batteryId: number, startDate: Date, endDate: Date) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const histories = get().batteryHistories.get(batteryId) || [];
        const filteredHistories = histories.filter(
          h => h.date >= startDate && h.date <= endDate
        );
        
        set({ isLoading: false });
        return filteredHistories;
      } catch (error) {
        set({ 
          error: "Failed to fetch battery history with filter",
          isLoading: false
        });
        throw error;
      }
    },
    
    addBatteryHistory: async (historyData: Omit<BatteryHistory, 'id'>) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const histories = get().batteryHistories.get(historyData.batteryId) || [];
        const nextId = histories.length > 0 
          ? Math.max(...histories.map(h => h.id)) + 1 
          : 1;
          
        const newHistory: BatteryHistory = {
          ...historyData,
          id: nextId
        };
        
        const updatedHistories = new Map(get().batteryHistories);
        updatedHistories.set(
          historyData.batteryId, 
          [...histories, newHistory]
        );
        
        set({
          batteryHistories: updatedHistories,
          isLoading: false
        });
        
        return newHistory;
      } catch (error) {
        set({ 
          error: "Failed to add history entry",
          isLoading: false
        });
        throw error;
      }
    },
    
    // Usage pattern operations
    getUsagePattern: async (batteryId: number) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const pattern = get().usagePatterns.get(batteryId);
        
        set({ isLoading: false });
        return pattern;
      } catch (error) {
        set({ 
          error: "Failed to get usage pattern",
          isLoading: false
        });
        throw error;
      }
    },
    
    updateUsagePattern: async (id: number, patternUpdate: Partial<UsagePattern>) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const pattern = get().usagePatterns.get(id);
        if (!pattern) {
          set({ isLoading: false });
          return undefined;
        }
        
        const updatedPattern = {
          ...pattern,
          ...patternUpdate
        };
        
        const updatedPatterns = new Map(get().usagePatterns);
        updatedPatterns.set(id, updatedPattern);
        
        set({
          usagePatterns: updatedPatterns,
          isLoading: false
        });
        
        return updatedPattern;
      } catch (error) {
        set({ 
          error: "Failed to update usage pattern",
          isLoading: false
        });
        throw error;
      }
    },
    
    // Recommendation operations
    getRecommendations: async (batteryId: number) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const recs = get().recommendations.get(batteryId) || [];
        
        set({ isLoading: false });
        return recs;
      } catch (error) {
        set({ 
          error: "Failed to get recommendations",
          isLoading: false
        });
        throw error;
      }
    },
    
    updateRecommendation: async (id: number, resolved: boolean) => {
      set({ isLoading: true, error: null });
      
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find which battery has this recommendation
        let foundBatteryId: number | null = null;
        let foundRec: Recommendation | undefined;
        
        get().recommendations.forEach((recs, batteryId) => {
          const rec = recs.find(r => r.id === id);
          if (rec) {
            foundBatteryId = batteryId;
            foundRec = rec;
          }
        });
        
        if (!foundBatteryId || !foundRec) {
          set({ isLoading: false });
          return undefined;
        }
        
        const updatedRec = {
          ...foundRec,
          resolved
        };
        
        const batteryRecs = get().recommendations.get(foundBatteryId) || [];
        const updatedBatteryRecs = batteryRecs.map(r => 
          r.id === id ? updatedRec : r
        );
        
        const updatedRecommendations = new Map(get().recommendations);
        updatedRecommendations.set(foundBatteryId, updatedBatteryRecs);
        
        set({
          recommendations: updatedRecommendations,
          isLoading: false
        });
        
        return updatedRec;
      } catch (error) {
        set({ 
          error: "Failed to update recommendation",
          isLoading: false
        });
        throw error;
      }
    }
  };
});