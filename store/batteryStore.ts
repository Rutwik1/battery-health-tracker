import { create } from 'zustand';
import { format, subMonths } from 'date-fns';

// Define battery types based on the existing data model
export interface Battery {
  id: number;
  name: string;
  serialNumber: string;
  initialCapacity: number;
  currentCapacity: number;
  healthPercentage: number;
  cycleCount: number;
  expectedCycles: number;
  status: string;
  initialDate: Date | string;
  lastUpdated: Date | string;
  degradationRate: number;
}

export interface BatteryHistory {
  id: number;
  batteryId: number;
  date: Date | string;
  capacity: number;
  healthPercentage: number;
  cycleCount: number;
}

export interface UsagePattern {
  id: number;
  batteryId: number;
  chargingFrequency: number;
  dischargeCycles: number;
  averageDischargeRate: number;
  temperatureExposure: string;
  usageType: string;
}

export interface Recommendation {
  id: number;
  batteryId: number;
  type: string;
  message: string;
  createdAt: Date | string;
  resolved: boolean;
}

// Initialize with sample data
const initialBatteries: Battery[] = [
  {
    id: 1,
    name: "Battery #1",
    serialNumber: "BAT-2023-0001",
    initialCapacity: 5000,
    currentCapacity: 4750,
    healthPercentage: 95,
    cycleCount: 120,
    expectedCycles: 500,
    status: "Good",
    initialDate: new Date('2023-05-15'),
    lastUpdated: new Date(),
    degradationRate: 0.4,
  },
  {
    id: 2,
    name: "Battery #2",
    serialNumber: "BAT-2023-0002",
    initialCapacity: 3500,
    currentCapacity: 2800,
    healthPercentage: 80,
    cycleCount: 210,
    expectedCycles: 500,
    status: "Fair",
    initialDate: new Date('2023-03-20'),
    lastUpdated: new Date(),
    degradationRate: 0.7,
  },
  {
    id: 3,
    name: "Battery #3",
    serialNumber: "BAT-2023-0003",
    initialCapacity: 4000,
    currentCapacity: 2400,
    healthPercentage: 60,
    cycleCount: 340,
    expectedCycles: 500,
    status: "Poor",
    initialDate: new Date('2023-01-10'),
    lastUpdated: new Date(),
    degradationRate: 1.1,
  },
  {
    id: 4,
    name: "Battery #4",
    serialNumber: "BAT-2023-0004",
    initialCapacity: 6000,
    currentCapacity: 1800,
    healthPercentage: 30,
    cycleCount: 450,
    expectedCycles: 500,
    status: "Critical",
    initialDate: new Date('2022-11-05'),
    lastUpdated: new Date(),
    degradationRate: 1.8,
  },
];

// Generate historical data for each battery for past 6 months
const generateHistoricalData = (battery: Battery): BatteryHistory[] => {
  const history: BatteryHistory[] = [];
  const today = new Date();
  
  for (let i = 0; i < 6; i++) {
    const date = subMonths(today, i);
    const progressFactor = 1 - (i / 6); // Newer dates have higher health
    const historyHealth = Math.min(100, Math.round(battery.healthPercentage + ((100 - battery.healthPercentage) * progressFactor)));
    const historyCycles = Math.max(0, Math.round(battery.cycleCount - (battery.cycleCount * (i / 6))));
    const historyCapacity = Math.round((battery.initialCapacity * historyHealth) / 100);
    
    history.push({
      id: battery.id * 100 + i,
      batteryId: battery.id,
      date,
      capacity: historyCapacity,
      healthPercentage: historyHealth,
      cycleCount: historyCycles
    });
  }
  
  return history;
};

// Generate sample usage patterns for each battery
const generateUsagePatterns = (batteries: Battery[]): UsagePattern[] => {
  return batteries.map(battery => {
    const usageTypes = ["Heavy", "Moderate", "Light", "Intermittent"];
    const tempExposures = ["Normal", "High", "Variable", "Low"];
    
    return {
      id: battery.id,
      batteryId: battery.id,
      chargingFrequency: Math.round(Math.random() * 10) + 2, // 2-12 times per week
      dischargeCycles: Math.round(battery.cycleCount / 10),
      averageDischargeRate: Math.round((Math.random() * 20) + 10), // 10-30% per day
      temperatureExposure: tempExposures[battery.id % tempExposures.length],
      usageType: usageTypes[battery.id % usageTypes.length]
    };
  });
};

// Generate sample recommendations for each battery
const generateRecommendations = (batteries: Battery[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  batteries.forEach(battery => {
    if (battery.healthPercentage < 70) {
      recommendations.push({
        id: battery.id * 10 + 1,
        batteryId: battery.id,
        type: "Replacement",
        message: `Battery ${battery.name} health is ${battery.healthPercentage}%. Consider replacing soon.`,
        createdAt: new Date(),
        resolved: false
      });
    }
    
    if (battery.cycleCount > battery.expectedCycles * 0.8) {
      recommendations.push({
        id: battery.id * 10 + 2,
        batteryId: battery.id,
        type: "Maintenance",
        message: `Battery ${battery.name} has completed ${battery.cycleCount} cycles (${Math.round((battery.cycleCount/battery.expectedCycles) * 100)}% of expected).`,
        createdAt: new Date(),
        resolved: false
      });
    }
  });
  
  return recommendations;
};

// Initialize all sample data
const initialHistories: Record<number, BatteryHistory[]> = {};
initialBatteries.forEach(battery => {
  initialHistories[battery.id] = generateHistoricalData(battery);
});

const initialUsagePatterns = generateUsagePatterns(initialBatteries);
const initialRecommendations = generateRecommendations(initialBatteries);

// Create the Zustand store
interface BatteryStore {
  // State
  batteries: Battery[];
  batteryHistories: Record<number, BatteryHistory[]>;
  usagePatterns: UsagePattern[];
  recommendations: Recommendation[];
  isLoading: boolean;
  nextId: number;
  
  // Actions
  fetchBatteries: () => Promise<void>;
  fetchBatteryHistory: (batteryId: number) => Promise<BatteryHistory[]>;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, data: Partial<Battery>) => Promise<Battery>;
  deleteBattery: (id: number) => Promise<boolean>;
  
  // Simulated real-time data updates
  startRealtimeUpdates: () => void;
  stopRealtimeUpdates: () => void;
}

// Interval for simulated real-time updates
let updateInterval: NodeJS.Timeout | null = null;

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  batteries: initialBatteries,
  batteryHistories: initialHistories,
  usagePatterns: initialUsagePatterns,
  recommendations: initialRecommendations,
  isLoading: false,
  nextId: initialBatteries.length + 1,
  
  // Simulated API actions
  fetchBatteries: async () => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Just return the current state
    set({ isLoading: false });
  },
  
  fetchBatteryHistory: async (batteryId: number) => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const history = get().batteryHistories[batteryId] || [];
    set({ isLoading: false });
    
    return history;
  },
  
  addBattery: async (batteryData) => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const nextId = get().nextId;
    const newBattery: Battery = {
      id: nextId,
      ...batteryData,
      lastUpdated: new Date()
    };
    
    // Generate history for the new battery
    const history = generateHistoricalData(newBattery);
    
    set(state => ({
      batteries: [...state.batteries, newBattery],
      batteryHistories: {
        ...state.batteryHistories,
        [nextId]: history
      },
      nextId: state.nextId + 1,
      isLoading: false
    }));
    
    return newBattery;
  },
  
  updateBattery: async (id: number, data: Partial<Battery>) => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let updatedBattery: Battery | undefined;
    
    set(state => {
      const batteries = state.batteries.map(battery => {
        if (battery.id === id) {
          updatedBattery = {
            ...battery,
            ...data,
            lastUpdated: new Date()
          };
          return updatedBattery;
        }
        return battery;
      });
      
      return { batteries, isLoading: false };
    });
    
    if (!updatedBattery) {
      throw new Error(`Battery with id ${id} not found`);
    }
    
    return updatedBattery;
  },
  
  deleteBattery: async (id: number) => {
    set({ isLoading: true });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => {
      // Filter out the deleted battery
      const batteries = state.batteries.filter(battery => battery.id !== id);
      
      // Remove battery history
      const { [id]: _, ...batteryHistories } = state.batteryHistories;
      
      // Filter out recommendations and usage patterns for this battery
      const recommendations = state.recommendations.filter(rec => rec.batteryId !== id);
      const usagePatterns = state.usagePatterns.filter(pattern => pattern.batteryId !== id);
      
      return {
        batteries,
        batteryHistories,
        recommendations,
        usagePatterns,
        isLoading: false
      };
    });
    
    return true;
  },
  
  // Simulated real-time data updates
  startRealtimeUpdates: () => {
    if (updateInterval) return;
    
    updateInterval = setInterval(() => {
      set(state => {
        // Randomly select a battery to update
        const batteries = [...state.batteries];
        const batteryIndex = Math.floor(Math.random() * batteries.length);
        
        if (batteries[batteryIndex]) {
          const battery = batteries[batteryIndex];
          
          // Random fluctuation in health (small decrease)
          const healthChange = Math.random() < 0.7 
            ? -Math.random() * 0.2 // 70% chance of small decrease
            : Math.random() * 0.1;  // 30% chance of small increase (recovery)
            
          const newHealth = Math.max(0, Math.min(100, battery.healthPercentage + healthChange));
          
          // Occasionally increment cycle count
          const cycleDelta = Math.random() < 0.3 ? 1 : 0;
          
          // Update battery
          batteries[batteryIndex] = {
            ...battery,
            healthPercentage: Number(newHealth.toFixed(1)),
            currentCapacity: Math.round((battery.initialCapacity * newHealth) / 100),
            cycleCount: battery.cycleCount + cycleDelta,
            lastUpdated: new Date()
          };
          
          // Update status based on new health
          if (newHealth > 80) batteries[batteryIndex].status = "Good";
          else if (newHealth > 60) batteries[batteryIndex].status = "Fair";
          else if (newHealth > 40) batteries[batteryIndex].status = "Poor";
          else batteries[batteryIndex].status = "Critical";
          
          // Occasionally add new history entry (every ~5 minutes in real-time)
          const batteryHistories = { ...state.batteryHistories };
          if (Math.random() < 0.2) {
            const history = batteryHistories[battery.id] || [];
            const newHistoryEntry: BatteryHistory = {
              id: battery.id * 1000 + history.length,
              batteryId: battery.id,
              date: new Date(),
              capacity: batteries[batteryIndex].currentCapacity,
              healthPercentage: batteries[batteryIndex].healthPercentage,
              cycleCount: batteries[batteryIndex].cycleCount
            };
            
            batteryHistories[battery.id] = [newHistoryEntry, ...history].slice(0, 50); // Keep last 50 entries
          }
          
          // Check if we need to add a new recommendation
          let recommendations = [...state.recommendations];
          if (newHealth < 40 && !recommendations.some(r => 
              r.batteryId === battery.id && 
              r.type === "Critical" && 
              !r.resolved)) {
            recommendations.push({
              id: Date.now(),
              batteryId: battery.id,
              type: "Critical",
              message: `URGENT: Battery ${battery.name} health is critically low at ${newHealth.toFixed(1)}%.`,
              createdAt: new Date(),
              resolved: false
            });
          }
          
          return { batteries, batteryHistories, recommendations };
        }
        
        return state;
      });
    }, 5000); // Update every 5 seconds
  },
  
  stopRealtimeUpdates: () => {
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  }
}));

// Auto-start real-time updates when the store is first used
if (typeof window !== 'undefined') {
  // Only run in browser environment
  setTimeout(() => {
    useBatteryStore.getState().startRealtimeUpdates();
  }, 1000);
}