import { create } from 'zustand';
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/types';

interface BatteryState {
  batteries: Battery[];
  selectedBatteryId: number | null;
  isLoading: boolean;
  isLiveUpdates: boolean;
  filters: {
    batteryName: string | null;
    status: string | null;
    healthBelow: number | null;
  };
  
  // Actions
  setBatteries: (batteries: Battery[]) => void;
  setSelectedBatteryId: (id: number | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsLiveUpdates: (isLiveUpdates: boolean) => void;
  addBattery: (battery: Battery) => void;
  updateBattery: (id: number, data: Partial<Battery>) => void;
  deleteBattery: (id: number) => void;
  setFilters: (filters: Partial<BatteryState['filters']>) => void;
  resetFilters: () => void;
}

export const useBatteryStore = create<BatteryState>((set) => ({
  batteries: [],
  selectedBatteryId: null,
  isLoading: false,
  isLiveUpdates: false,
  filters: {
    batteryName: null,
    status: null,
    healthBelow: null,
  },
  
  // Actions
  setBatteries: (batteries) => set({ batteries }),
  setSelectedBatteryId: (id) => set({ selectedBatteryId: id }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsLiveUpdates: (isLiveUpdates) => set({ isLiveUpdates }),
  addBattery: (battery) => set((state) => ({ 
    batteries: [...state.batteries, battery] 
  })),
  updateBattery: (id, data) => set((state) => ({
    batteries: state.batteries.map(battery => 
      battery.id === id ? { ...battery, ...data } : battery
    )
  })),
  deleteBattery: (id) => set((state) => ({
    batteries: state.batteries.filter(battery => battery.id !== id)
  })),
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  resetFilters: () => set({
    filters: {
      batteryName: null,
      status: null,
      healthBelow: null,
    }
  }),
}));