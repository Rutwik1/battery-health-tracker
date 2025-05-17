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

// Initialize with demo data
const { batteries, batteryHistories, usagePatterns, recommendations } = generateDemoData();

export const useBatteryStore = create<BatteryState>((set, get) => ({
  batteries: batteries,
  batteryHistories: batteryHistories,
  usagePatterns: usagePatterns, 
  recommendations: recommendations,
  isLoading: false,
  error: null,
  
  // Fetch all batteries
  fetchBatteries: async () => {
    set({ isLoading: true, error: null });
    try {
      // Using in-memory data, so just return current state
      const batteries = get().batteries;
      set({ batteries, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch batteries', isLoading: false });
    }
  },
  
  // Get a single battery by ID
  getBattery: (id: number) => {
    return get().batteries.find(battery => battery.id === id);
  },
  
  // Add a new battery
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      // Generate a new ID (in a real app this would be done by the database)
      const newId = Math.max(0, ...get().batteries.map(b => b.id)) + 1;
      
      const newBattery: Battery = {
        id: newId,
        ...batteryData
      };
      
      set(state => ({
        batteries: [...state.batteries, newBattery],
        isLoading: false
      }));
      
      return newBattery;
    } catch (error) {
      set({ error: 'Failed to add battery', isLoading: false });
      throw error;
    }
  },
  
  // Update a battery
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    set({ isLoading: true, error: null });
    try {
      const existingBattery = get().batteries.find(b => b.id === id);
      
      if (!existingBattery) {
        set({ error: 'Battery not found', isLoading: false });
        return undefined;
      }
      
      const updatedBattery = { ...existingBattery, ...batteryUpdate };
      
      set(state => ({
        batteries: state.batteries.map(b => b.id === id ? updatedBattery : b),
        isLoading: false
      }));
      
      return updatedBattery;
    } catch (error) {
      set({ error: 'Failed to update battery', isLoading: false });
      throw error;
    }
  },
  
  // Delete a battery
  deleteBattery: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const batteryExists = get().batteries.some(b => b.id === id);
      
      if (!batteryExists) {
        set({ error: 'Battery not found', isLoading: false });
        return false;
      }
      
      set(state => ({
        batteries: state.batteries.filter(b => b.id !== id),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Failed to delete battery', isLoading: false });
      throw error;
    }
  },
  
  // Get battery history
  fetchBatteryHistory: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const batteryHistory = get().batteryHistories.get(batteryId) || [];
      set({ isLoading: false });
      return batteryHistory;
    } catch (error) {
      set({ error: 'Failed to fetch battery history', isLoading: false });
      throw error;
    }
  },
  
  // Get filtered battery history
  fetchBatteryHistoryFiltered: async (batteryId: number, startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });
    try {
      const batteryHistory = get().batteryHistories.get(batteryId) || [];
      const filteredHistory = batteryHistory.filter(history => {
        const historyDate = new Date(history.date);
        return historyDate >= startDate && historyDate <= endDate;
      });
      set({ isLoading: false });
      return filteredHistory;
    } catch (error) {
      set({ error: 'Failed to fetch filtered battery history', isLoading: false });
      throw error;
    }
  },
  
  // Add battery history entry
  addBatteryHistory: async (historyData: Omit<BatteryHistory, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const histories = get().batteryHistories.get(historyData.batteryId) || [];
      const newId = Math.max(0, ...histories.map(h => h.id)) + 1;
      
      const newHistory: BatteryHistory = {
        id: newId,
        ...historyData
      };
      
      const updatedHistories = [...histories, newHistory];
      
      set(state => {
        const newBatteryHistories = new Map(state.batteryHistories);
        newBatteryHistories.set(historyData.batteryId, updatedHistories);
        
        return {
          batteryHistories: newBatteryHistories,
          isLoading: false
        };
      });
      
      return newHistory;
    } catch (error) {
      set({ error: 'Failed to add battery history', isLoading: false });
      throw error;
    }
  },
  
  // Get usage pattern
  getUsagePattern: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const usagePattern = get().usagePatterns.get(batteryId);
      set({ isLoading: false });
      return usagePattern;
    } catch (error) {
      set({ error: 'Failed to get usage pattern', isLoading: false });
      throw error;
    }
  },
  
  // Update usage pattern
  updateUsagePattern: async (id: number, patternUpdate: Partial<UsagePattern>) => {
    set({ isLoading: true, error: null });
    try {
      const existingPattern = get().usagePatterns.get(id);
      
      if (!existingPattern) {
        set({ error: 'Usage pattern not found', isLoading: false });
        return undefined;
      }
      
      const updatedPattern = { ...existingPattern, ...patternUpdate };
      
      set(state => {
        const newUsagePatterns = new Map(state.usagePatterns);
        newUsagePatterns.set(id, updatedPattern);
        
        return {
          usagePatterns: newUsagePatterns,
          isLoading: false
        };
      });
      
      return updatedPattern;
    } catch (error) {
      set({ error: 'Failed to update usage pattern', isLoading: false });
      throw error;
    }
  },
  
  // Get recommendations
  getRecommendations: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const batteryRecommendations = get().recommendations.get(batteryId) || [];
      set({ isLoading: false });
      return batteryRecommendations;
    } catch (error) {
      set({ error: 'Failed to get recommendations', isLoading: false });
      throw error;
    }
  },
  
  // Update recommendation
  updateRecommendation: async (id: number, resolved: boolean) => {
    set({ isLoading: true, error: null });
    try {
      // Find the recommendation in the Map
      let foundRecommendation: Recommendation | undefined;
      let foundBatteryId: number | undefined;
      
      for (const [batteryId, recs] of get().recommendations.entries()) {
        const recommendation = recs.find(r => r.id === id);
        if (recommendation) {
          foundRecommendation = recommendation;
          foundBatteryId = batteryId;
          break;
        }
      }
      
      if (!foundRecommendation || !foundBatteryId) {
        set({ error: 'Recommendation not found', isLoading: false });
        return undefined;
      }
      
      const updatedRecommendation = { ...foundRecommendation, resolved };
      
      set(state => {
        const batteryRecommendations = state.recommendations.get(foundBatteryId!) || [];
        const updatedRecommendations = batteryRecommendations.map(r => 
          r.id === id ? updatedRecommendation : r
        );
        
        const newRecommendations = new Map(state.recommendations);
        newRecommendations.set(foundBatteryId!, updatedRecommendations);
        
        return {
          recommendations: newRecommendations,
          isLoading: false
        };
      });
      
      return updatedRecommendation;
    } catch (error) {
      set({ error: 'Failed to update recommendation', isLoading: false });
      throw error;
    }
  }
}));