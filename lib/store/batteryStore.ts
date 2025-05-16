'use client'

import { create } from 'zustand'
import { addDays, subDays, subMonths, format } from 'date-fns'

// Battery Types
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

// Battery History Type
export interface BatteryHistory {
  id: number;
  batteryId: number;
  date: Date | string;
  capacity: number;
  healthPercentage: number;
  cycleCount: number;
}

// Usage Pattern Type
export interface UsagePattern {
  id: number;
  batteryId: number;
  chargingFrequency: number;
  dischargeCycles: number;
  averageDischargeRate: number;
  temperatureExposure: string;
  usageType: string;
}

// Recommendation Type
export interface Recommendation {
  id: number;
  batteryId: number;
  type: string;
  message: string;
  createdAt: Date | string;
  resolved: boolean;
}

// Generate historical data based on a battery's degradation rate and age
const generateHistoricalData = (battery: Battery): BatteryHistory[] => {
  const now = new Date()
  const initialDate = new Date(battery.initialDate)
  const monthsSinceInitial = Math.max(1, Math.round((now.getTime() - initialDate.getTime()) / (30 * 24 * 60 * 60 * 1000)))
  
  // Generate one data point per month, going back to the initial date
  const history: BatteryHistory[] = []
  let lastCycleCount = 0
  
  for (let i = 0; i < monthsSinceInitial; i++) {
    const date = subMonths(now, monthsSinceInitial - i - 1)
    const ageInMonths = i + 1
    
    // Calculate degradation based on age and degradation rate
    const capacityLoss = Math.min(
      (battery.degradationRate * ageInMonths),
      (100 - battery.healthPercentage)
    )
    const healthPercentage = 100 - capacityLoss
    const capacity = Math.round((battery.initialCapacity * healthPercentage) / 100)
    
    // Calculate cycle count based on age (assuming linear accumulation)
    const cycleRatio = ageInMonths / monthsSinceInitial
    const cycleCount = Math.round(battery.cycleCount * cycleRatio)
    
    // Add some randomness to make the data look realistic
    const jitter = Math.random() * 0.02 - 0.01 // +/- 1%
    const adjustedCapacity = Math.round(capacity * (1 + jitter))
    const adjustedHealth = Math.round(healthPercentage * (1 + jitter))
    
    history.push({
      id: i + 1,
      batteryId: battery.id,
      date: date.toISOString(),
      capacity: adjustedCapacity,
      healthPercentage: adjustedHealth,
      cycleCount: cycleCount > lastCycleCount ? cycleCount : lastCycleCount + Math.floor(Math.random() * 3) + 1
    })
    
    lastCycleCount = history[history.length - 1].cycleCount
  }
  
  // Ensure the last data point matches the current battery values
  if (history.length > 0) {
    history[history.length - 1] = {
      ...history[history.length - 1],
      capacity: battery.currentCapacity,
      healthPercentage: battery.healthPercentage,
      cycleCount: battery.cycleCount
    }
  }
  
  return history
}

// Generate detailed history for charts (last X days)
const generateDetailedHistory = (battery: Battery, days: number): BatteryHistory[] => {
  const now = new Date()
  const history: BatteryHistory[] = []
  let lastCycleCount = battery.cycleCount - Math.floor(days / 30 * (battery.cycleCount / 12))
  
  for (let i = 0; i < days; i += Math.ceil(days / 30)) {
    const date = subDays(now, days - i)
    const dayRatio = i / days
    
    // Interpolate between start value and current value
    const startHealth = battery.healthPercentage + (battery.degradationRate * (days / 30))
    const healthPercentage = startHealth - (dayRatio * (startHealth - battery.healthPercentage))
    const capacity = Math.round((battery.initialCapacity * healthPercentage) / 100)
    
    // Calculate cycle count with some randomness
    const cycleProgress = Math.floor(dayRatio * (battery.cycleCount - lastCycleCount))
    const cycleCount = lastCycleCount + cycleProgress
    
    // Add some randomness
    const jitter = Math.random() * 0.01 - 0.005 // +/- 0.5%
    const adjustedCapacity = Math.round(capacity * (1 + jitter))
    const adjustedHealth = Math.round(healthPercentage * (1 + jitter))
    
    history.push({
      id: 1000 + i,
      batteryId: battery.id,
      date: date.toISOString(),
      capacity: adjustedCapacity,
      healthPercentage: adjustedHealth,
      cycleCount: cycleCount
    })
  }
  
  // Ensure the last data point matches the current battery values
  if (history.length > 0) {
    history[history.length - 1] = {
      ...history[history.length - 1],
      capacity: battery.currentCapacity,
      healthPercentage: battery.healthPercentage,
      cycleCount: battery.cycleCount,
      date: now.toISOString()
    }
  }
  
  return history
}

// Battery Store Interface
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

// Create the Zustand store
export const useBatteryStore = create<BatteryStore>((set, get) => ({
  // Initial state
  batteries: [],
  batteryHistories: {},
  usagePatterns: [],
  recommendations: [],
  isLoading: true,
  nextId: 5, // Start at 5 as we have 4 demo batteries
  
  // Methods to fetch and manipulate data
  fetchBatteries: async () => {
    set({ isLoading: true })
    
    // Simulate API loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Initial dummy data similar to the existing application
    const batteries: Battery[] = [
      {
        id: 1,
        name: "Battery #1",
        serialNumber: "B1234567890",
        initialCapacity: 5000,
        currentCapacity: 4700,
        healthPercentage: 94,
        cycleCount: 125,
        expectedCycles: 1000,
        status: "Healthy",
        initialDate: subMonths(new Date(), 6).toISOString(),
        lastUpdated: new Date().toISOString(),
        degradationRate: 1.0
      },
      {
        id: 2,
        name: "Battery #2",
        serialNumber: "B2345678901",
        initialCapacity: 6000,
        currentCapacity: 5100,
        healthPercentage: 85,
        cycleCount: 290,
        expectedCycles: 1200,
        status: "Good",
        initialDate: subMonths(new Date(), 12).toISOString(),
        lastUpdated: subDays(new Date(), 2).toISOString(),
        degradationRate: 1.25
      },
      {
        id: 3,
        name: "Battery #3",
        serialNumber: "B3456789012",
        initialCapacity: 4500,
        currentCapacity: 2970,
        healthPercentage: 66,
        cycleCount: 520,
        expectedCycles: 1000,
        status: "Fair",
        initialDate: subMonths(new Date(), 24).toISOString(),
        lastUpdated: subDays(new Date(), 5).toISOString(),
        degradationRate: 1.42
      },
      {
        id: 4,
        name: "Battery #4",
        serialNumber: "B4567890123",
        initialCapacity: 4000,
        currentCapacity: 1800,
        healthPercentage: 45,
        cycleCount: 780,
        expectedCycles: 900,
        status: "Poor",
        initialDate: subMonths(new Date(), 36).toISOString(),
        lastUpdated: subDays(new Date(), 1).toISOString(),
        degradationRate: 1.53
      }
    ]
    
    // Generate usage patterns for each battery
    const usagePatterns: UsagePattern[] = [
      {
        id: 1,
        batteryId: 1,
        chargingFrequency: 1.2,
        dischargeCycles: 0.9,
        averageDischargeRate: 12,
        temperatureExposure: "Normal",
        usageType: "Regular"
      },
      {
        id: 2,
        batteryId: 2,
        chargingFrequency: 1.5,
        dischargeCycles: 1.2,
        averageDischargeRate: 15,
        temperatureExposure: "Warm",
        usageType: "Heavy"
      },
      {
        id: 3,
        batteryId: 3,
        chargingFrequency: 0.8,
        dischargeCycles: 0.7,
        averageDischargeRate: 8,
        temperatureExposure: "Hot",
        usageType: "Intensive"
      },
      {
        id: 4,
        batteryId: 4,
        chargingFrequency: 2.0,
        dischargeCycles: 1.8,
        averageDischargeRate: 22,
        temperatureExposure: "Variable",
        usageType: "Erratic"
      }
    ]
    
    // Generate recommendations for each battery
    const recommendations: Recommendation[] = [
      {
        id: 1,
        batteryId: 1,
        type: "Optimization",
        message: "Consider charging to 80% instead of 100% to extend battery lifespan.",
        createdAt: subDays(new Date(), 14).toISOString(),
        resolved: false
      },
      {
        id: 2,
        batteryId: 2,
        type: "Warning",
        message: "Battery temperature frequently exceeds recommended range.",
        createdAt: subDays(new Date(), 7).toISOString(),
        resolved: true
      },
      {
        id: 3,
        batteryId: 3,
        type: "Critical",
        message: "Battery health declining faster than expected. Consider replacement within 6 months.",
        createdAt: subDays(new Date(), 30).toISOString(),
        resolved: false
      },
      {
        id: 4,
        batteryId: 4,
        type: "Critical",
        message: "Battery health critically low. Recommend immediate replacement.",
        createdAt: subDays(new Date(), 45).toISOString(),
        resolved: false
      }
    ]
    
    // Generate historical data for each battery
    const batteryHistories: Record<number, BatteryHistory[]> = {}
    batteries.forEach(battery => {
      batteryHistories[battery.id] = generateHistoricalData(battery)
    })
    
    set({ 
      batteries, 
      batteryHistories, 
      usagePatterns, 
      recommendations,
      isLoading: false 
    })
  },
  
  fetchBatteryHistory: async (batteryId: number, days?: number) => {
    const { batteries, batteryHistories } = get()
    const battery = batteries.find(b => b.id === batteryId)
    
    if (!battery) {
      return []
    }
    
    if (days) {
      // Generate detailed history for the specified time range
      return generateDetailedHistory(battery, days)
    }
    
    // Return cached history or generate new one
    if (!batteryHistories[batteryId]) {
      const history = generateHistoricalData(battery)
      set(state => ({
        batteryHistories: {
          ...state.batteryHistories,
          [batteryId]: history
        }
      }))
      return history
    }
    
    return batteryHistories[batteryId]
  },
  
  fetchUsagePattern: async (batteryId: number) => {
    const { usagePatterns } = get()
    return usagePatterns.find(p => p.batteryId === batteryId)
  },
  
  fetchRecommendations: async (batteryId: number) => {
    const { recommendations } = get()
    return recommendations.filter(r => r.batteryId === batteryId)
  },
  
  addBattery: async (batteryData) => {
    const { batteries, nextId } = get()
    const now = new Date()
    
    const newBattery: Battery = {
      id: nextId,
      name: batteryData.name,
      serialNumber: batteryData.serialNumber,
      initialCapacity: batteryData.initialCapacity,
      currentCapacity: batteryData.currentCapacity,
      healthPercentage: Math.round((batteryData.currentCapacity / batteryData.initialCapacity) * 100),
      cycleCount: batteryData.cycleCount || 0,
      expectedCycles: batteryData.expectedCycles,
      status: batteryData.status || "Healthy",
      initialDate: batteryData.initialDate || subMonths(now, 1).toISOString(),
      lastUpdated: now.toISOString(),
      degradationRate: batteryData.degradationRate || 1.0
    }
    
    // Generate history for the new battery
    const history = generateHistoricalData(newBattery)
    
    set(state => ({
      batteries: [...state.batteries, newBattery],
      batteryHistories: {
        ...state.batteryHistories,
        [nextId]: history
      },
      nextId: state.nextId + 1
    }))
    
    return newBattery
  },
  
  updateBattery: async (id, data) => {
    const { batteries } = get()
    const batteryIndex = batteries.findIndex(b => b.id === id)
    
    if (batteryIndex === -1) {
      throw new Error(`Battery with ID ${id} not found`)
    }
    
    // Calculate health percentage if capacity was updated
    let healthPercentage = batteries[batteryIndex].healthPercentage
    if (data.currentCapacity !== undefined && batteries[batteryIndex].initialCapacity) {
      healthPercentage = Math.round((data.currentCapacity / batteries[batteryIndex].initialCapacity) * 100)
    }
    
    // Determine status based on health percentage
    let status = batteries[batteryIndex].status
    if (data.healthPercentage !== undefined || healthPercentage !== batteries[batteryIndex].healthPercentage) {
      const health = data.healthPercentage !== undefined ? data.healthPercentage : healthPercentage
      if (health >= 90) status = "Healthy"
      else if (health >= 80) status = "Good"
      else if (health >= 60) status = "Fair"
      else status = "Poor"
    }
    
    // Update the battery
    const updatedBattery: Battery = {
      ...batteries[batteryIndex],
      ...data,
      healthPercentage,
      status,
      lastUpdated: new Date().toISOString()
    }
    
    // Update the state
    const updatedBatteries = [...batteries]
    updatedBatteries[batteryIndex] = updatedBattery
    
    set({ batteries: updatedBatteries })
    
    return updatedBattery
  },
  
  deleteBattery: async (id) => {
    const { batteries, batteryHistories, usagePatterns, recommendations } = get()
    
    // Filter out the battery and related data
    const updatedBatteries = batteries.filter(b => b.id !== id)
    const updatedHistories = { ...batteryHistories }
    delete updatedHistories[id]
    const updatedPatterns = usagePatterns.filter(p => p.batteryId !== id)
    const updatedRecommendations = recommendations.filter(r => r.batteryId !== id)
    
    set({
      batteries: updatedBatteries,
      batteryHistories: updatedHistories,
      usagePatterns: updatedPatterns,
      recommendations: updatedRecommendations
    })
    
    return true
  },
  
  // Simulate real-time data updates
  startRealtimeUpdates: () => {
    const intervalId = setInterval(() => {
      const { batteries } = get()
      
      if (batteries.length === 0) return
      
      // Randomly select a battery to update
      const randomIndex = Math.floor(Math.random() * batteries.length)
      const batteryToUpdate = batteries[randomIndex]
      
      // Simulate some real-time changes
      const smallCycleIncrease = Math.random() > 0.7 ? 1 : 0
      const smallHealthDecrease = Math.random() > 0.9 ? 0.1 : 0
      const capacityChange = smallHealthDecrease > 0 ? 
        Math.round(batteryToUpdate.initialCapacity * smallHealthDecrease / 100) : 0
      
      if (smallCycleIncrease > 0 || smallHealthDecrease > 0) {
        get().updateBattery(batteryToUpdate.id, {
          cycleCount: batteryToUpdate.cycleCount + smallCycleIncrease,
          healthPercentage: Math.max(1, batteryToUpdate.healthPercentage - smallHealthDecrease),
          currentCapacity: Math.max(1, batteryToUpdate.currentCapacity - capacityChange)
        })
        
        // Add new history entry occasionally
        if (Math.random() > 0.8) {
          const batteryHistories = get().batteryHistories
          const updatedBattery = get().batteries.find(b => b.id === batteryToUpdate.id)!
          
          if (batteryHistories[batteryToUpdate.id] && updatedBattery) {
            const lastHistory = batteryHistories[batteryToUpdate.id][batteryHistories[batteryToUpdate.id].length - 1]
            
            const newHistoryEntry: BatteryHistory = {
              id: lastHistory.id + 1,
              batteryId: batteryToUpdate.id,
              date: new Date().toISOString(),
              capacity: updatedBattery.currentCapacity,
              healthPercentage: updatedBattery.healthPercentage,
              cycleCount: updatedBattery.cycleCount
            }
            
            const updatedHistories = {
              ...batteryHistories,
              [batteryToUpdate.id]: [...batteryHistories[batteryToUpdate.id], newHistoryEntry]
            }
            
            set({ batteryHistories: updatedHistories })
          }
        }
      }
    }, 30000) // Update every 30 seconds
    
    // Store the interval ID in localStorage to track it
    if (typeof window !== 'undefined') {
      localStorage.setItem('batteryUpdateIntervalId', intervalId.toString())
    }
  },
  
  stopRealtimeUpdates: () => {
    if (typeof window !== 'undefined') {
      const intervalId = localStorage.getItem('batteryUpdateIntervalId')
      if (intervalId) {
        clearInterval(parseInt(intervalId))
        localStorage.removeItem('batteryUpdateIntervalId')
      }
    }
  }
}))

// Start real-time updates when the store is imported on the client-side
if (typeof window !== 'undefined') {
  // Wait for the DOM to be ready to avoid SSR issues
  if (document.readyState === 'complete') {
    useBatteryStore.getState().fetchBatteries().then(() => {
      useBatteryStore.getState().startRealtimeUpdates()
    })
  } else {
    window.addEventListener('load', () => {
      useBatteryStore.getState().fetchBatteries().then(() => {
        useBatteryStore.getState().startRealtimeUpdates()
      })
    })
  }
}