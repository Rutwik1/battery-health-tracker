import { create } from 'zustand';
import { Battery } from '@/types';

interface BatteryState {
  // Battery data
  batteries: Battery[];
  selectedBatteryId: number | null;
  
  // UI states
  isLoading: boolean;
  isLiveUpdates: boolean;
  
  // Actions
  setBatteries: (batteries: Battery[]) => void;
  setSelectedBatteryId: (id: number | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLiveUpdates: (isLiveUpdates: boolean) => void;
  updateBattery: (id: number, data: Partial<Battery>) => void;
  removeBattery: (id: number) => void;
  setFilters: (filters: Partial<Filters>) => void;
}

interface Filters {
  status: string | null;
  healthBelow: number | null;
  searchTerm: string | null;
}

export const useBatteryStore = create<BatteryState>((set) => ({
  // Initial states
  batteries: [],
  selectedBatteryId: null,
  isLoading: true,
  isLiveUpdates: true,
  filters: {
    status: null,
    healthBelow: null,
    searchTerm: null,
  },
  
  // Actions
  setBatteries: (batteries) => set({ batteries }),
  setSelectedBatteryId: (id) => set({ selectedBatteryId: id }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLiveUpdates: (isLiveUpdates) => set({ isLiveUpdates }),
  
  updateBattery: (id, data) => set((state) => ({
    batteries: state.batteries.map(battery => 
      battery.id === id ? { ...battery, ...data } : battery
    )
  })),
  
  removeBattery: (id) => set((state) => ({
    batteries: state.batteries.filter(battery => battery.id !== id)
  })),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
}));