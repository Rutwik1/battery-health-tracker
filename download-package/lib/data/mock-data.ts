import { Battery, BatteryHistory, UsagePattern, Recommendation, User } from '@/types';

// Set up mock users
export const users: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@coulomb.ai',
    image: 'https://ui-avatars.com/api/?name=Demo+User&background=6E44FF&color=fff'
  }
};

// Set up initial batteries
export const initialBatteries: Battery[] = [
  {
    id: 1,
    name: 'Battery #1',
    serialNumber: 'BAT-2025-0001',
    initialCapacity: 5000,
    currentCapacity: 4750,
    healthPercentage: 95,
    cycleCount: 43,
    expectedCycles: 500,
    status: 'Good',
    initialDate: new Date('2024-01-15'),
    lastUpdated: new Date(),
    degradationRate: 0.5,
    userId: 'user-1'
  },
  {
    id: 2,
    name: 'Battery #2',
    serialNumber: 'BAT-2025-0002',
    initialCapacity: 4500,
    currentCapacity: 3825,
    healthPercentage: 85,
    cycleCount: 120,
    expectedCycles: 500,
    status: 'Fair',
    initialDate: new Date('2023-11-20'),
    lastUpdated: new Date(),
    degradationRate: 0.6,
    userId: 'user-1'
  },
  {
    id: 3,
    name: 'Battery #3',
    serialNumber: 'BAT-2025-0003',
    initialCapacity: 6000,
    currentCapacity: 3600,
    healthPercentage: 60,
    cycleCount: 240,
    expectedCycles: 450,
    status: 'Poor',
    initialDate: new Date('2023-07-05'),
    lastUpdated: new Date(),
    degradationRate: 0.8,
    userId: 'user-1'
  },
  {
    id: 4,
    name: 'Battery #4',
    serialNumber: 'BAT-2025-0004',
    initialCapacity: 7000,
    currentCapacity: 6860,
    healthPercentage: 98,
    cycleCount: 12,
    expectedCycles: 600,
    status: 'Good',
    initialDate: new Date('2024-03-01'),
    lastUpdated: new Date(),
    degradationRate: 0.4,
    userId: 'user-1'
  }
];

// Generate mock history data for each battery
export function generateInitialHistory(): Record<number, BatteryHistory[]> {
  const history: Record<number, BatteryHistory[]> = {};
  
  initialBatteries.forEach(battery => {
    const batteryHistory: BatteryHistory[] = [];
    
    // Create history going back 6 months
    const startDate = new Date(battery.initialDate);
    const endDate = new Date();
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate a data point every 7 days
    for (let i = 0; i <= daysDiff; i += 7) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Calculate health for this point
      const daysElapsed = i;
      const dailyDegradation = battery.degradationRate / 30; // Convert monthly rate to daily
      const healthDecrease = dailyDegradation * daysElapsed;
      const health = Math.max(100 - healthDecrease, battery.healthPercentage);
      
      // Calculate capacity
      const capacity = Math.round(battery.initialCapacity * (health / 100));
      
      // Calculate cycles
      const cyclesPerDay = battery.cycleCount / daysDiff;
      const cycles = Math.round(cyclesPerDay * i);
      
      batteryHistory.push({
        id: batteryHistory.length + 1,
        batteryId: battery.id,
        date,
        capacity,
        healthPercentage: health,
        cycleCount: cycles
      });
    }
    
    history[battery.id] = batteryHistory;
  });
  
  return history;
}

// Generate usage patterns
export function generateUsagePatterns(): Record<number, UsagePattern> {
  const patterns: Record<number, UsagePattern> = {};
  
  const frequencies = ['Daily', 'Every 2-3 days', 'Weekly', 'Occasional'];
  const temperatures = ['Normal', 'High', 'Low', 'Variable'];
  const usages = ['Heavy', 'Medium', 'Light', 'Variable'];
  
  initialBatteries.forEach(battery => {
    patterns[battery.id] = {
      id: battery.id,
      batteryId: battery.id,
      chargingFrequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      dischargeRate: Math.random() * 5 + 1, // 1-6% per hour
      temperatureExposure: temperatures[Math.floor(Math.random() * temperatures.length)],
      typicalUsage: usages[Math.floor(Math.random() * usages.length)]
    };
  });
  
  return patterns;
}

// Generate recommendations
export function generateRecommendations(): Record<number, Recommendation[]> {
  const recommendations: Record<number, Recommendation[]> = {};
  
  initialBatteries.forEach(battery => {
    const batteryRecs: Recommendation[] = [];
    
    // Add recommendations based on battery status
    if (battery.healthPercentage < 70) {
      batteryRecs.push({
        id: batteryRecs.length + 1,
        batteryId: battery.id,
        type: 'Replacement',
        message: 'Consider replacing this battery as health has dropped below 70%',
        createdAt: new Date(),
        resolved: false
      });
    }
    
    if (battery.cycleCount > battery.expectedCycles * 0.7) {
      batteryRecs.push({
        id: batteryRecs.length + 1,
        batteryId: battery.id,
        type: 'Usage',
        message: 'Battery approaching end of rated cycle life',
        createdAt: new Date(),
        resolved: false
      });
    }
    
    if (battery.degradationRate > 0.7) {
      batteryRecs.push({
        id: batteryRecs.length + 1,
        batteryId: battery.id,
        type: 'Maintenance',
        message: 'Battery degrading faster than expected. Check charging habits.',
        createdAt: new Date(),
        resolved: false
      });
    }
    
    recommendations[battery.id] = batteryRecs;
  });
  
  return recommendations;
}