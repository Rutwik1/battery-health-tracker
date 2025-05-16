import { create } from 'zustand';
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/types';
import { sub } from 'date-fns';

// Demo data similar to what we have in the current app
const demoData = {
  batteries: [
    {
      id: 1,
      name: "Battery #1",
      serialNumber: "BT00721",
      model: "Lithium-Ion Pro",
      manufacturer: "PowerTech",
      manufactureDate: "2023-07-15",
      capacity: 5000,
      voltage: 3.7,
      cycleCount: 120,
      health: 89,
      status: "Active",
      lastChecked: "2024-05-15T14:30:00Z"
    },
    {
      id: 2,
      name: "Battery #2",
      serialNumber: "BT00935",
      model: "LiPo Max",
      manufacturer: "EnergyCell",
      manufactureDate: "2023-09-01",
      capacity: 4500,
      voltage: 3.6,
      cycleCount: 95,
      health: 92,
      status: "Active",
      lastChecked: "2024-05-15T15:45:00Z"
    },
    {
      id: 3,
      name: "Battery #3",
      serialNumber: "BT01042",
      model: "PowerPack 3000",
      manufacturer: "VoltMaster",
      manufactureDate: "2022-12-10",
      capacity: 3000,
      voltage: 3.8,
      cycleCount: 245,
      health: 76,
      status: "Warning",
      lastChecked: "2024-05-15T13:15:00Z"
    },
    {
      id: 4,
      name: "Battery #4",
      serialNumber: "BT00389",
      model: "Ultra Lithium",
      manufacturer: "PowerTech",
      manufactureDate: "2022-05-22",
      capacity: 6000,
      voltage: 3.5,
      cycleCount: 320,
      health: 68,
      status: "Critical",
      lastChecked: "2024-05-15T11:00:00Z"
    }
  ] as Battery[],
  
  // Generate battery history data
  generateBatteryHistory(batteryId: number, initialHealth: number): BatteryHistory[] {
    const history: BatteryHistory[] = [];
    const today = new Date();
    
    // Create data points for past 6 months, monthly
    for (let i = 6; i >= 0; i--) {
      const date = sub(today, { months: i });
      const healthDegradation = (Math.random() * 1.2 + 0.3) * i; // Random degradation
      const health = Math.max(initialHealth - healthDegradation, 60);
      const cycleCount = 30 + (6 - i) * 20 + Math.floor(Math.random() * 10);
      
      history.push({
        id: batteryId * 100 + i,
        batteryId,
        date: date.toISOString(),
        health,
        voltage: 3.6 + Math.random() * 0.3,
        capacity: 5000 - 100 * i,
        temperature: 25 + Math.random() * 10,
        cycleCount
      });
    }
    
    return history;
  },
  
  // Usage patterns for each battery
  usagePatterns: [
    {
      id: 1,
      batteryId: 1,
      chargingFrequency: 1.2,
      averageDischargeRate: 0.8,
      deepDischargeCount: 5,
      peakUsageTime: "Morning",
      environmentalConditions: "Indoor, Climate Controlled",
      usageType: "Medium Load"
    },
    {
      id: 2,
      batteryId: 2,
      chargingFrequency: 0.9,
      averageDischargeRate: 0.6,
      deepDischargeCount: 2,
      peakUsageTime: "Evening",
      environmentalConditions: "Indoor, Climate Controlled",
      usageType: "Light Load"
    },
    {
      id: 3,
      batteryId: 3,
      chargingFrequency: 1.5,
      averageDischargeRate: 1.2,
      deepDischargeCount: 12,
      peakUsageTime: "Afternoon",
      environmentalConditions: "Mixed Indoor/Outdoor",
      usageType: "Heavy Load"
    },
    {
      id: 4,
      batteryId: 4,
      chargingFrequency: 2.1,
      averageDischargeRate: 1.8,
      deepDischargeCount: 25,
      peakUsageTime: "All Day",
      environmentalConditions: "Mostly Outdoor, Variable Temperature",
      usageType: "Heavy Load"
    }
  ] as UsagePattern[],
  
  // Recommendations for each battery
  recommendations: [
    {
      id: 1,
      batteryId: 1,
      type: "Maintenance",
      description: "Schedule a calibration to optimize charging cycles.",
      priority: "Low",
      created: "2024-05-01T09:00:00Z",
      resolved: false
    },
    {
      id: 2,
      batteryId: 2,
      type: "Optimization",
      description: "Consider adjusting charge schedule to evening hours for better efficiency.",
      priority: "Low",
      created: "2024-05-05T14:30:00Z",
      resolved: true
    },
    {
      id: 3,
      batteryId: 3,
      type: "Warning",
      description: "Battery health degrading faster than expected. Reduce deep discharge events.",
      priority: "Medium",
      created: "2024-04-28T11:15:00Z",
      resolved: false
    },
    {
      id: 4,
      batteryId: 4,
      type: "Critical",
      description: "Battery approaching end of useful life. Plan for replacement within 2 months.",
      priority: "High",
      created: "2024-04-15T10:00:00Z",
      resolved: false
    }
  ] as Recommendation[]
};

// Define our store state
interface BatteryStore {
  // State
  batteries: Battery[];
  batteryHistories: Map<number, BatteryHistory[]>;
  usagePatterns: Map<number, UsagePattern>;
  recommendations: Map<number, Recommendation[]>;
  selectedBatteryId: number | null;
  isLoading: boolean;
  
  // Actions
  fetchBatteries: () => Promise<void>;
  fetchBatteryHistory: (batteryId: number) => Promise<BatteryHistory[]>;
  fetchUsagePattern: (batteryId: number) => Promise<UsagePattern | undefined>;
  fetchRecommendations: (batteryId: number) => Promise<Recommendation[]>;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, battery: Partial<Battery>) => Promise<Battery | undefined>;
  deleteBattery: (id: number) => Promise<boolean>;
  setSelectedBatteryId: (id: number | null) => void;
}

// Create the store
export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  batteries: [],
  batteryHistories: new Map(),
  usagePatterns: new Map(),
  recommendations: new Map(),
  selectedBatteryId: null,
  isLoading: false,
  
  // Actions for simulating API calls with demo data
  fetchBatteries: async () => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ 
      batteries: demoData.batteries,
      isLoading: false 
    });
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    set({ isLoading: true });
    // Check if we already have this battery's history
    if (get().batteryHistories.has(batteryId)) {
      set({ isLoading: false });
      return get().batteryHistories.get(batteryId) || [];
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find the battery to get initial health
    const battery = demoData.batteries.find(b => b.id === batteryId);
    if (!battery) {
      set({ isLoading: false });
      return [];
    }
    
    // Generate history data
    const history = demoData.generateBatteryHistory(batteryId, battery.health + 5);
    
    // Update store
    const newHistories = new Map(get().batteryHistories);
    newHistories.set(batteryId, history);
    set({ 
      batteryHistories: newHistories,
      isLoading: false 
    });
    
    return history;
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    set({ isLoading: true });
    // Check if we already have this battery's usage pattern
    if (get().usagePatterns.has(batteryId)) {
      set({ isLoading: false });
      return get().usagePatterns.get(batteryId);
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the usage pattern
    const pattern = demoData.usagePatterns.find(p => p.batteryId === batteryId);
    if (!pattern) {
      set({ isLoading: false });
      return undefined;
    }
    
    // Update store
    const newPatterns = new Map(get().usagePatterns);
    newPatterns.set(batteryId, pattern);
    set({ 
      usagePatterns: newPatterns,
      isLoading: false 
    });
    
    return pattern;
  },
  
  fetchRecommendations: async (batteryId: number) => {
    set({ isLoading: true });
    // Check if we already have this battery's recommendations
    if (get().recommendations.has(batteryId)) {
      set({ isLoading: false });
      return get().recommendations.get(batteryId) || [];
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Find recommendations for this battery
    const recs = demoData.recommendations.filter(r => r.batteryId === batteryId);
    
    // Update store
    const newRecommendations = new Map(get().recommendations);
    newRecommendations.set(batteryId, recs);
    set({ 
      recommendations: newRecommendations,
      isLoading: false 
    });
    
    return recs;
  },
  
  addBattery: async (batteryData) => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new battery with generated ID
    const newId = Math.max(0, ...demoData.batteries.map(b => b.id)) + 1;
    const newBattery: Battery = {
      id: newId,
      ...batteryData,
      lastChecked: new Date().toISOString()
    };
    
    // Update both store and demo data
    demoData.batteries.push(newBattery);
    set(state => ({ 
      batteries: [...state.batteries, newBattery],
      isLoading: false 
    }));
    
    return newBattery;
  },
  
  updateBattery: async (id, batteryUpdate) => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find battery in demo data
    const batteryIndex = demoData.batteries.findIndex(b => b.id === id);
    if (batteryIndex === -1) {
      set({ isLoading: false });
      return undefined;
    }
    
    // Update battery in demo data
    const updatedBattery = {
      ...demoData.batteries[batteryIndex],
      ...batteryUpdate,
      lastChecked: new Date().toISOString()
    };
    demoData.batteries[batteryIndex] = updatedBattery;
    
    // Update store
    set(state => ({ 
      batteries: state.batteries.map(b => b.id === id ? updatedBattery : b),
      isLoading: false 
    }));
    
    return updatedBattery;
  },
  
  deleteBattery: async (id) => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    // Find battery in demo data
    const batteryIndex = demoData.batteries.findIndex(b => b.id === id);
    if (batteryIndex === -1) {
      set({ isLoading: false });
      return false;
    }
    
    // Remove battery from demo data
    demoData.batteries.splice(batteryIndex, 1);
    
    // Update store
    set(state => ({
      batteries: state.batteries.filter(b => b.id !== id),
      isLoading: false
    }));
    
    // If the selected battery is being deleted, clear selection
    if (get().selectedBatteryId === id) {
      set({ selectedBatteryId: null });
    }
    
    return true;
  },
  
  setSelectedBatteryId: (id) => {
    set({ selectedBatteryId: id });
  }
}));