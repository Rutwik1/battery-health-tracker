'use client';

import { create } from 'zustand';

export type BatteryStatus = 'Good' | 'Fair' | 'Poor' | 'Critical';

export interface Battery {
  id: number;
  name: string;
  serialNumber: string;
  initialCapacity: number;
  currentCapacity: number;
  healthPercentage: number;
  cycleCount: number;
  expectedCycles: number;
  status: BatteryStatus;
  initialDate: Date;
  lastUpdated: Date;
  degradationRate: number;
  manufacturer?: string;
  model?: string;
  installationLocation?: string;
}

interface BatteryState {
  batteries: Battery[];
  updateInterval: number | null;
  initializeBatteries: () => void;
  updateBatteryHealth: (id: number, healthChange: number) => void;
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
}

// Mock battery data for simulation
const mockBatteries: Battery[] = [
  {
    id: 1,
    name: "Battery #1",
    serialNumber: "BT-2024-001",
    initialCapacity: 5000,
    currentCapacity: 4850,
    healthPercentage: 97,
    cycleCount: 124,
    expectedCycles: 800,
    status: "Good",
    initialDate: new Date(2024, 0, 15),
    lastUpdated: new Date(),
    degradationRate: 0.3,
    manufacturer: "Tesla",
    model: "PowerCell X1",
    installationLocation: "Building A"
  },
  {
    id: 2,
    name: "Battery #2",
    serialNumber: "BT-2024-002",
    initialCapacity: 7500,
    currentCapacity: 6750,
    healthPercentage: 90,
    cycleCount: 232,
    expectedCycles: 1000,
    status: "Good",
    initialDate: new Date(2023, 10, 5),
    lastUpdated: new Date(),
    degradationRate: 0.4,
    manufacturer: "LG",
    model: "Energy Plus 7000",
    installationLocation: "Building B"
  },
  {
    id: 3,
    name: "Battery #3",
    serialNumber: "BT-2023-015",
    initialCapacity: 4000,
    currentCapacity: 2800,
    healthPercentage: 70,
    cycleCount: 412,
    expectedCycles: 600,
    status: "Fair",
    initialDate: new Date(2023, 3, 20),
    lastUpdated: new Date(),
    degradationRate: 0.7,
    manufacturer: "Samsung",
    model: "PowerPack 400",
    installationLocation: "Building A"
  },
  {
    id: 4,
    name: "Battery #4",
    serialNumber: "BT-2023-008",
    initialCapacity: 3500,
    currentCapacity: 1750,
    healthPercentage: 50,
    cycleCount: 520,
    expectedCycles: 600,
    status: "Critical",
    initialDate: new Date(2023, 1, 10),
    lastUpdated: new Date(),
    degradationRate: 1.2,
    manufacturer: "Panasonic",
    model: "EnerCore 3500",
    installationLocation: "Building C"
  },
];

// Helper function to get status based on health percentage
const getBatteryStatus = (health: number): BatteryStatus => {
  if (health >= 85) return 'Good';
  if (health >= 70) return 'Fair';
  if (health >= 50) return 'Poor';
  return 'Critical';
};

// Random small fluctuation for simulation
const getRandomFluctuation = (range: number = 0.5): number => {
  return (Math.random() * range * 2) - range;
};

export const useBatteryStore = create<BatteryState>((set, get) => ({
  batteries: [],
  updateInterval: null,
  
  // Initialize battery data
  initializeBatteries: () => {
    set({ batteries: [...mockBatteries] });
  },
  
  // Update a single battery's health metrics
  updateBatteryHealth: (id, healthChange) => {
    set((state) => {
      const batteryIndex = state.batteries.findIndex(b => b.id === id);
      if (batteryIndex === -1) return state;
      
      const battery = state.batteries[batteryIndex];
      let newHealth = Math.max(0, Math.min(100, battery.healthPercentage + healthChange));
      let newCurrentCapacity = Math.round((battery.initialCapacity * newHealth) / 100);
      
      // Update the battery with new health metrics
      const updatedBattery = {
        ...battery,
        healthPercentage: newHealth,
        currentCapacity: newCurrentCapacity,
        lastUpdated: new Date(),
        status: getBatteryStatus(newHealth)
      };
      
      // Create new batteries array with the updated battery
      const newBatteries = [...state.batteries];
      newBatteries[batteryIndex] = updatedBattery;
      
      return { batteries: newBatteries };
    });
  },
  
  // Start simulated real-time updates
  startRealTimeUpdates: () => {
    // Check if updates are already running
    if (get().updateInterval !== null) return;
    
    // Set up an interval to simulate live data updates
    const interval = window.setInterval(() => {
      const { batteries } = get();
      
      // Update each battery independently with small random fluctuations
      batteries.forEach(battery => {
        // Batteries degrade faster as they get older and approach their cycle limit
        const cycleRatio = battery.cycleCount / battery.expectedCycles;
        const ageBasedDegradation = -0.05 * (1 + cycleRatio);
        
        // Random small fluctuation (-0.2 to +0.1) with more tendency toward degradation
        const randomChange = getRandomFluctuation(0.15) - 0.05;
        
        // Apply the health change
        get().updateBatteryHealth(battery.id, ageBasedDegradation + randomChange);
      });
    }, 5000); // Update every 5 seconds for simulation
    
    set({ updateInterval: interval });
  },
  
  // Stop real-time updates
  stopRealTimeUpdates: () => {
    const { updateInterval } = get();
    if (updateInterval !== null) {
      clearInterval(updateInterval);
      set({ updateInterval: null });
    }
  }
}));