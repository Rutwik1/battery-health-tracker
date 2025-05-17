import { create } from 'zustand';
import { 
  Battery, 
  BatteryHistory, 
  UsagePattern, 
  Recommendation 
} from '../types/schema';

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

export const useBatteryStore = create<BatteryState>((set, get) => ({
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  isLoading: false,
  error: null,
  
  // Battery CRUD operations
  fetchBatteries: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/batteries');
      if (!response.ok) {
        throw new Error('Failed to fetch batteries');
      }
      const batteries = await response.json();
      set({ batteries, isLoading: false });
    } catch (error) {
      console.error('Error fetching batteries:', error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  getBattery: (id: number) => {
    return get().batteries.find(battery => battery.id === id);
  },
  
  addBattery: async (battery: Omit<Battery, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/batteries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battery),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add battery');
      }
      
      const newBattery: Battery = await response.json();
      set(state => ({
        batteries: [...state.batteries, newBattery],
        isLoading: false,
      }));
      
      return newBattery;
    } catch (error) {
      console.error('Error adding battery:', error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batteryUpdate),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update battery');
      }
      
      const updatedBattery: Battery = await response.json();
      set(state => ({
        batteries: state.batteries.map(b => b.id === id ? updatedBattery : b),
        isLoading: false,
      }));
      
      return updatedBattery;
    } catch (error) {
      console.error(`Error updating battery ${id}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  deleteBattery: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete battery');
      }
      
      set(state => ({
        batteries: state.batteries.filter(b => b.id !== id),
        isLoading: false,
      }));
      
      // Clean up related data
      get().batteryHistories.delete(id);
      get().usagePatterns.delete(id);
      get().recommendations.delete(id);
      
      return true;
    } catch (error) {
      console.error(`Error deleting battery ${id}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  // Battery history
  fetchBatteryHistory: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/history`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch battery history');
      }
      
      const history = await response.json();
      set(state => {
        const newHistories = new Map(state.batteryHistories);
        newHistories.set(batteryId, history);
        return { batteryHistories: newHistories, isLoading: false };
      });
      
      return history;
    } catch (error) {
      console.error(`Error fetching history for battery ${batteryId}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  fetchBatteryHistoryFiltered: async (batteryId: number, startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });
    try {
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      const response = await fetch(
        `/api/batteries/${batteryId}/history?startDate=${startDateStr}&endDate=${endDateStr}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch filtered battery history');
      }
      
      const history = await response.json();
      return history;
    } catch (error) {
      console.error(`Error fetching filtered history for battery ${batteryId}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  addBatteryHistory: async (history: Omit<BatteryHistory, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${history.batteryId}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(history),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add battery history entry');
      }
      
      const newHistory: BatteryHistory = await response.json();
      
      set(state => {
        const currentHistories = state.batteryHistories.get(history.batteryId) || [];
        const newHistories = new Map(state.batteryHistories);
        newHistories.set(history.batteryId, [newHistory, ...currentHistories]);
        
        // Update the battery's current values too
        const updatedBatteries = state.batteries.map(b => {
          if (b.id === history.batteryId) {
            return {
              ...b,
              currentCapacity: history.capacity,
              healthPercentage: history.healthPercentage,
              cycleCount: history.cycleCount,
              lastUpdated: new Date()
            };
          }
          return b;
        });
        
        return { 
          batteryHistories: newHistories, 
          batteries: updatedBatteries,
          isLoading: false 
        };
      });
      
      return newHistory;
    } catch (error) {
      console.error(`Error adding history for battery ${history.batteryId}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  // Usage pattern
  getUsagePattern: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      // Check if we already have the pattern in store
      const existingPattern = get().usagePatterns.get(batteryId);
      if (existingPattern) {
        set({ isLoading: false });
        return existingPattern;
      }
      
      const response = await fetch(`/api/batteries/${batteryId}/usage`);
      
      if (response.status === 404) {
        set({ isLoading: false });
        return undefined;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch usage pattern');
      }
      
      const pattern = await response.json();
      set(state => {
        const newPatterns = new Map(state.usagePatterns);
        newPatterns.set(batteryId, pattern);
        return { usagePatterns: newPatterns, isLoading: false };
      });
      
      return pattern;
    } catch (error) {
      console.error(`Error fetching usage pattern for battery ${batteryId}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  updateUsagePattern: async (batteryId: number, pattern: Partial<UsagePattern>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batteryId, ...pattern }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update usage pattern');
      }
      
      const updatedPattern: UsagePattern = await response.json();
      set(state => {
        const newPatterns = new Map(state.usagePatterns);
        newPatterns.set(batteryId, updatedPattern);
        return { usagePatterns: newPatterns, isLoading: false };
      });
      
      return updatedPattern;
    } catch (error) {
      console.error(`Error updating usage pattern for battery ${batteryId}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  // Recommendations
  getRecommendations: async (batteryId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/batteries/${batteryId}/recommendations`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const recommendations = await response.json();
      set(state => {
        const newRecommendations = new Map(state.recommendations);
        newRecommendations.set(batteryId, recommendations);
        return { recommendations: newRecommendations, isLoading: false };
      });
      
      return recommendations;
    } catch (error) {
      console.error(`Error fetching recommendations for battery ${batteryId}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },
  
  updateRecommendation: async (id: number, resolved: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update recommendation');
      }
      
      const updatedRecommendation: Recommendation = await response.json();
      
      set(state => {
        // Find which battery this recommendation belongs to
        let batteryId = updatedRecommendation.batteryId;
        
        // Update the recommendation in the map
        const newRecommendations = new Map(state.recommendations);
        for (const [bid, recs] of state.recommendations.entries()) {
          const updatedRecs = recs.map(r => 
            r.id === id ? updatedRecommendation : r
          );
          newRecommendations.set(bid, updatedRecs);
        }
        
        return { recommendations: newRecommendations, isLoading: false };
      });
      
      return updatedRecommendation;
    } catch (error) {
      console.error(`Error updating recommendation ${id}:`, error);
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));