import { create } from 'zustand';
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/app/types/schema';
import { generateDemoData } from '@/app/lib/demoData';

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
  // Initial state with demo data
  const demoData = generateDemoData();
  
  return {
    // State
    batteries: demoData.batteries,
    batteryHistories: demoData.batteryHistories,
    usagePatterns: demoData.usagePatterns,
    recommendations: demoData.recommendations,
    isLoading: false,
    error: null,
    
    // Battery operations
    fetchBatteries: async () => {
      set({ isLoading: true, error: null });
      try {
        // In a real app, we would fetch from an API
        // For now, we'll just use our demo data
        const data = generateDemoData();
        set({ 
          batteries: data.batteries,
          batteryHistories: data.batteryHistories,
          usagePatterns: data.usagePatterns,
          recommendations: data.recommendations,
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
        // Generate a new ID (in a real app, the backend would do this)
        const maxId = Math.max(0, ...get().batteries.map(b => b.id));
        const id = maxId + 1;
        
        const newBattery: Battery = {
          id,
          ...batteryData,
          lastUpdated: new Date()
        };
        
        // Add to state
        set(state => ({
          batteries: [...state.batteries, newBattery],
          isLoading: false
        }));
        
        return newBattery;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
      set({ isLoading: true, error: null });
      try {
        const batteries = get().batteries;
        const batteryIndex = batteries.findIndex(b => b.id === id);
        
        if (batteryIndex === -1) {
          set({ isLoading: false });
          return undefined;
        }
        
        const updatedBattery = {
          ...batteries[batteryIndex],
          ...batteryUpdate,
          lastUpdated: new Date()
        };
        
        const updatedBatteries = [...batteries];
        updatedBatteries[batteryIndex] = updatedBattery;
        
        set({ batteries: updatedBatteries, isLoading: false });
        return updatedBattery;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    deleteBattery: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const batteries = get().batteries;
        const updatedBatteries = batteries.filter(b => b.id !== id);
        
        // If the array length is the same, the battery wasn't found
        if (updatedBatteries.length === batteries.length) {
          set({ isLoading: false });
          return false;
        }
        
        set({ batteries: updatedBatteries, isLoading: false });
        return true;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    // Battery history operations
    fetchBatteryHistory: async (batteryId: number) => {
      set({ isLoading: true, error: null });
      try {
        const batteryHistories = get().batteryHistories;
        const history = batteryHistories.get(batteryId) || [];
        set({ isLoading: false });
        return history;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    fetchBatteryHistoryFiltered: async (batteryId: number, startDate: Date, endDate: Date) => {
      set({ isLoading: true, error: null });
      try {
        const batteryHistories = get().batteryHistories;
        const history = batteryHistories.get(batteryId) || [];
        
        const filteredHistory = history.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });
        
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
        const batteryHistories = get().batteryHistories;
        const batteryHistory = batteryHistories.get(historyData.batteryId) || [];
        
        // Generate a new ID
        const maxId = Math.max(0, ...batteryHistory.map(h => h.id));
        const id = maxId + 1;
        
        const newHistory: BatteryHistory = {
          id,
          ...historyData,
        };
        
        // Add to state
        const updatedHistory = [...batteryHistory, newHistory];
        const updatedHistories = new Map(batteryHistories);
        updatedHistories.set(historyData.batteryId, updatedHistory);
        
        set({ batteryHistories: updatedHistories, isLoading: false });
        return newHistory;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    // Usage pattern operations
    getUsagePattern: async (batteryId: number) => {
      set({ isLoading: true, error: null });
      try {
        const usagePatterns = get().usagePatterns;
        const pattern = usagePatterns.get(batteryId);
        set({ isLoading: false });
        return pattern;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    updateUsagePattern: async (id: number, patternUpdate: Partial<UsagePattern>) => {
      set({ isLoading: true, error: null });
      try {
        const usagePatterns = get().usagePatterns;
        const pattern = usagePatterns.get(id);
        
        if (!pattern) {
          set({ isLoading: false });
          return undefined;
        }
        
        const updatedPattern = {
          ...pattern,
          ...patternUpdate
        };
        
        const updatedPatterns = new Map(usagePatterns);
        updatedPatterns.set(id, updatedPattern);
        
        set({ usagePatterns: updatedPatterns, isLoading: false });
        return updatedPattern;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    // Recommendations operations
    getRecommendations: async (batteryId: number) => {
      set({ isLoading: true, error: null });
      try {
        const recommendations = get().recommendations;
        const batteryRecommendations = recommendations.get(batteryId) || [];
        set({ isLoading: false });
        return batteryRecommendations;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
    
    updateRecommendation: async (id: number, resolved: boolean) => {
      set({ isLoading: true, error: null });
      try {
        const recommendations = get().recommendations;
        
        // Find the recommendation in any of the batteries
        let foundRecommendation: Recommendation | undefined;
        let foundBatteryId: number | undefined;
        
        recommendations.forEach((batteryRecommendations, batteryId) => {
          const recommendation = batteryRecommendations.find(r => r.id === id);
          if (recommendation) {
            foundRecommendation = recommendation;
            foundBatteryId = batteryId;
          }
        });
        
        if (!foundRecommendation || foundBatteryId === undefined) {
          set({ isLoading: false });
          return undefined;
        }
        
        const updatedRecommendation = {
          ...foundRecommendation,
          resolved
        };
        
        // Update the recommendation in the state
        const batteryRecommendations = recommendations.get(foundBatteryId) || [];
        const updatedBatteryRecommendations = batteryRecommendations.map(r => 
          r.id === id ? updatedRecommendation : r
        );
        
        const updatedRecommendations = new Map(recommendations);
        updatedRecommendations.set(foundBatteryId, updatedBatteryRecommendations);
        
        set({ recommendations: updatedRecommendations, isLoading: false });
        return updatedRecommendation;
      } catch (error) {
        set({ error: (error as Error).message, isLoading: false });
        throw error;
      }
    },
  };
});