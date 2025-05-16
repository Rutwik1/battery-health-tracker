'use client'

import { create } from 'zustand'
import { format, subDays, subMonths } from 'date-fns'

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

// Generate sample battery history data for a given battery
const generateHistoricalData = (battery: Battery): BatteryHistory[] => {
  const result: BatteryHistory[] = []
  const today = new Date()
  
  // Generate data for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(today, i)
    const healthDecreasePerMonth = battery.degradationRate // % per month
    const healthAtThisPoint = Math.min(100, battery.healthPercentage + (healthDecreasePerMonth * i))
    const capacityAtThisPoint = Math.round((healthAtThisPoint / 100) * battery.initialCapacity)
    const cycleCountAtThisPoint = Math.max(0, battery.cycleCount - Math.round(i * (battery.cycleCount / 12)))
    
    result.push({
      id: Date.now() + i, // Just for unique IDs
      batteryId: battery.id,
      date: format(date, 'yyyy-MM-dd'),
      capacity: capacityAtThisPoint,
      healthPercentage: healthAtThisPoint,
      cycleCount: cycleCountAtThisPoint
    })
  }
  
  return result
}

// Generate more detailed historical data for a specific time range (in days)
const generateDetailedHistory = (battery: Battery, days: number): BatteryHistory[] => {
  const result: BatteryHistory[] = []
  const today = new Date()
  
  // Calculate degradation per day
  const dailyDegradation = battery.degradationRate / 30
  
  // Generate data points for the specified number of days
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i)
    const healthDecreaseTotal = dailyDegradation * i
    const healthAtThisPoint = Math.min(100, battery.healthPercentage + healthDecreaseTotal)
    const capacityAtThisPoint = Math.round((healthAtThisPoint / 100) * battery.initialCapacity)
    
    // Cycle count decreases linearly over time
    const cyclesPerDay = battery.cycleCount / days
    const cycleCountAtThisPoint = Math.round(battery.cycleCount - (i * cyclesPerDay))
    
    result.push({
      id: Date.now() + i, // Just for unique IDs
      batteryId: battery.id,
      date: format(date, 'yyyy-MM-dd'),
      capacity: capacityAtThisPoint,
      healthPercentage: healthAtThisPoint,
      cycleCount: cycleCountAtThisPoint
    })
  }
  
  return result
}

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
  fetchBatteryHistory: (batteryId: number, days?: number) => Promise<BatteryHistory[]>;
  fetchUsagePattern: (batteryId: number) => Promise<UsagePattern | undefined>;
  fetchRecommendations: (batteryId: number) => Promise<Recommendation[]>;
  addBattery: (battery: Omit<Battery, 'id'>) => Promise<Battery>;
  updateBattery: (id: number, data: Partial<Battery>) => Promise<Battery>;
  deleteBattery: (id: number) => Promise<boolean>;
  
  // Simulated real-time data updates
  startRealtimeUpdates: () => void;
  stopRealtimeUpdates: () => void;
}

export const useBatteryStore = create<BatteryStore>((set, get) => ({
  batteries: [],
  batteryHistories: {},
  usagePatterns: [],
  recommendations: [],
  isLoading: true,
  nextId: 5, // Start after our demo batteries
  
  fetchBatteries: async () => {
    set({ isLoading: true })
    
    try {
      // In a real app, we'd fetch from an API here
      // For demo, we'll use sample data
      const batteries: Battery[] = [
        {
          id: 1,
          name: "Battery #1",
          serialNumber: "BAT-2023-0001",
          initialCapacity: 5000,
          currentCapacity: 4700,
          healthPercentage: 94,
          cycleCount: 120,
          expectedCycles: 1000,
          status: "Healthy",
          initialDate: new Date(2023, 5, 15).toISOString(),
          lastUpdated: new Date().toISOString(),
          degradationRate: 0.5,
        },
        {
          id: 2,
          name: "Battery #2",
          serialNumber: "BAT-2022-0542",
          initialCapacity: 4500,
          currentCapacity: 3825,
          healthPercentage: 85,
          cycleCount: 340,
          expectedCycles: 800,
          status: "Good",
          initialDate: new Date(2022, 2, 10).toISOString(),
          lastUpdated: new Date().toISOString(),
          degradationRate: 0.8,
        },
        {
          id: 3,
          name: "Battery #3",
          serialNumber: "BAT-2022-0128",
          initialCapacity: 3800,
          currentCapacity: 2850,
          healthPercentage: 75,
          cycleCount: 450,
          expectedCycles: 700,
          status: "Fair",
          initialDate: new Date(2022, 1, 5).toISOString(),
          lastUpdated: new Date().toISOString(),
          degradationRate: 1.2,
        },
        {
          id: 4,
          name: "Battery #4",
          serialNumber: "BAT-2021-0873",
          initialCapacity: 4200,
          currentCapacity: 2520,
          healthPercentage: 60,
          cycleCount: 690,
          expectedCycles: 750,
          status: "Poor",
          initialDate: new Date(2021, 8, 22).toISOString(),
          lastUpdated: new Date().toISOString(),
          degradationRate: 1.5,
        }
      ];
      
      // Generate usage patterns
      const usagePatterns: UsagePattern[] = [
        {
          id: 1,
          batteryId: 1,
          chargingFrequency: 1.2,
          dischargeCycles: 0.8,
          averageDischargeRate: 10,
          temperatureExposure: "Normal",
          usageType: "Regular",
        },
        {
          id: 2,
          batteryId: 2,
          chargingFrequency: 1.5,
          dischargeCycles: 1.2,
          averageDischargeRate: 15,
          temperatureExposure: "Normal",
          usageType: "Heavy",
        },
        {
          id: 3,
          batteryId: 3,
          chargingFrequency: 2.1,
          dischargeCycles: 1.8,
          averageDischargeRate: 20,
          temperatureExposure: "High",
          usageType: "Heavy",
        },
        {
          id: 4,
          batteryId: 4,
          chargingFrequency: 2.8,
          dischargeCycles: 2.5,
          averageDischargeRate: 25,
          temperatureExposure: "Very High",
          usageType: "Extreme",
        }
      ];
      
      // Generate recommendations
      const recommendations: Recommendation[] = [
        {
          id: 1,
          batteryId: 1,
          type: "Maintenance",
          message: "Consider calibrating your battery for optimal performance",
          createdAt: new Date(2023, 10, 5).toISOString(),
          resolved: false,
        },
        {
          id: 2,
          batteryId: 2,
          type: "Charging",
          message: "Reduce charge frequency to extend battery lifespan",
          createdAt: new Date(2023, 9, 20).toISOString(),
          resolved: true,
        },
        {
          id: 3,
          batteryId: 3,
          type: "Temperature",
          message: "Battery is regularly exposed to high temperatures. Consider cooling solutions.",
          createdAt: new Date(2023, 8, 15).toISOString(),
          resolved: false,
        },
        {
          id: 4,
          batteryId: 4,
          type: "Warning",
          message: "Battery health below 65%. Consider planning for replacement in the coming months.",
          createdAt: new Date(2023, 7, 30).toISOString(),
          resolved: false,
        }
      ];
      
      // Set the state
      set({ 
        batteries, 
        usagePatterns, 
        recommendations,
        isLoading: false 
      })
    } catch (error) {
      console.error("Error fetching batteries:", error)
      set({ isLoading: false })
    }
  },
  
  fetchBatteryHistory: async (batteryId: number, days?: number) => {
    const { batteries, batteryHistories } = get()
    const battery = batteries.find(b => b.id === batteryId)
    
    if (!battery) {
      return []
    }
    
    // Check if we already have history data for this battery in the store
    if (batteryHistories[batteryId]) {
      return batteryHistories[batteryId]
    }
    
    let historyData: BatteryHistory[]
    
    if (days) {
      // Generate detailed history for specific time range
      historyData = generateDetailedHistory(battery, days)
    } else {
      // Generate standard monthly history
      historyData = generateHistoricalData(battery)
    }
    
    // Update the state with the new history data
    set(state => ({
      batteryHistories: {
        ...state.batteryHistories,
        [batteryId]: historyData
      }
    }))
    
    return historyData
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    const { usagePatterns } = get()
    return usagePatterns.find(p => p.batteryId === batteryId)
  },
  
  fetchRecommendations: async (batteryId: number) => {
    const { recommendations } = get()
    return recommendations.filter(r => r.batteryId === batteryId)
  },
  
  addBattery: async (batteryData: Omit<Battery, 'id'>) => {
    const { nextId, batteries } = get()
    
    const newBattery: Battery = {
      ...batteryData,
      id: nextId,
    }
    
    set(state => ({ 
      batteries: [...state.batteries, newBattery],
      nextId: state.nextId + 1
    }))
    
    return newBattery
  },
  
  updateBattery: async (id: number, batteryUpdate: Partial<Battery>) => {
    const { batteries } = get()
    const batteryIndex = batteries.findIndex(b => b.id === id)
    
    if (batteryIndex === -1) {
      throw new Error(`Battery with id ${id} not found`)
    }
    
    const existingBattery = batteries[batteryIndex]
    const updatedBattery: Battery = { ...existingBattery, ...batteryUpdate }
    
    set(state => {
      const updatedBatteries = [...state.batteries]
      updatedBatteries[batteryIndex] = updatedBattery
      
      return { batteries: updatedBatteries }
    })
    
    return updatedBattery
  },
  
  deleteBattery: async (id: number) => {
    const { batteries } = get()
    
    if (!batteries.some(b => b.id === id)) {
      return false
    }
    
    set(state => ({
      batteries: state.batteries.filter(b => b.id !== id),
      batteryHistories: Object.fromEntries(
        Object.entries(state.batteryHistories).filter(([batteryId]) => Number(batteryId) !== id)
      ),
      usagePatterns: state.usagePatterns.filter(p => p.batteryId !== id),
      recommendations: state.recommendations.filter(r => r.batteryId !== id)
    }))
    
    return true
  },
  
  startRealtimeUpdates: () => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const { batteries } = get()
      
      // Update a random battery with small changes
      if (batteries.length > 0) {
        const randomIndex = Math.floor(Math.random() * batteries.length)
        const battery = batteries[randomIndex]
        
        // Simulate changes
        const cycleIncrease = Math.random() > 0.7 ? 1 : 0
        const healthDecrease = cycleIncrease ? Math.random() * 0.1 : 0
        
        // Update the battery
        if (cycleIncrease || healthDecrease) {
          const updatedBattery = {
            ...battery,
            cycleCount: battery.cycleCount + cycleIncrease,
            healthPercentage: Math.max(0, battery.healthPercentage - healthDecrease),
            currentCapacity: Math.round(battery.initialCapacity * (battery.healthPercentage - healthDecrease) / 100),
            lastUpdated: new Date().toISOString()
          }
          
          // Add a new data point to history
          const batteryHistories = get().batteryHistories
          const batteryHistory = batteryHistories[battery.id] || []
          
          if (cycleIncrease || healthDecrease) {
            const newHistoryEntry: BatteryHistory = {
              id: Date.now(),
              batteryId: battery.id,
              date: new Date().toISOString(),
              capacity: updatedBattery.currentCapacity,
              healthPercentage: updatedBattery.healthPercentage,
              cycleCount: updatedBattery.cycleCount
            }
            
            // Update the battery and history in the state
            set(state => ({
              batteries: state.batteries.map(b => 
                b.id === battery.id ? updatedBattery : b
              ),
              batteryHistories: {
                ...state.batteryHistories,
                [battery.id]: [...batteryHistory, newHistoryEntry]
              }
            }))
          }
        }
      }
    }, 60000) // Update every minute
    
    // Store the interval ID in window for cleanup
    window.__batteryUpdateInterval = interval
  },
  
  stopRealtimeUpdates: () => {
    if (window.__batteryUpdateInterval) {
      clearInterval(window.__batteryUpdateInterval)
      delete window.__batteryUpdateInterval
    }
  }
}))

// Add the interval ID to the Window interface
declare global {
  interface Window {
    __batteryUpdateInterval?: number;
  }
}