import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/app/types/schema';

export function generateDemoData() {
  // Create batteries
  const batteries: Battery[] = [
    {
      id: 1,
      name: "Battery #1",
      serialNumber: "BAT-2024-0001",
      initialCapacity: 5000,
      currentCapacity: 4750,
      healthPercentage: 95,
      cycleCount: 120,
      expectedCycles: 500,
      status: "Good",
      initialDate: new Date("2024-01-01"),
      lastUpdated: new Date(),
      degradationRate: 0.5,
      manufacturer: "TeslaPower",
      model: "TP-5000",
      chemistry: "Lithium-ion",
      voltage: 3.7,
      installationLocation: "Building A, Room 101"
    },
    {
      id: 2,
      name: "Battery #2",
      serialNumber: "BAT-2024-0002",
      initialCapacity: 3500,
      currentCapacity: 2975,
      healthPercentage: 85,
      cycleCount: 210,
      expectedCycles: 500,
      status: "Fair",
      initialDate: new Date("2023-09-15"),
      lastUpdated: new Date(),
      degradationRate: 0.7,
      manufacturer: "PowerCell",
      model: "PC-3500",
      chemistry: "LiFePO4",
      voltage: 3.2,
      installationLocation: "Building B, Room 202"
    },
    {
      id: 3,
      name: "Battery #3",
      serialNumber: "BAT-2024-0003",
      initialCapacity: 6000,
      currentCapacity: 5820,
      healthPercentage: 97,
      cycleCount: 50,
      expectedCycles: 700,
      status: "Excellent",
      initialDate: new Date("2024-02-10"),
      lastUpdated: new Date(),
      degradationRate: 0.3,
      manufacturer: "EnergyMax",
      model: "EM-6000P",
      chemistry: "Lithium-ion",
      voltage: 3.85,
      installationLocation: "Building C, Room 305"
    },
    {
      id: 4,
      name: "Battery #4",
      serialNumber: "BAT-2024-0004",
      initialCapacity: 4000,
      currentCapacity: 2400,
      healthPercentage: 60,
      cycleCount: 350,
      expectedCycles: 500,
      status: "Poor",
      initialDate: new Date("2023-06-20"),
      lastUpdated: new Date(),
      degradationRate: 1.2,
      manufacturer: "PowerCell",
      model: "PC-4000",
      chemistry: "Lithium-ion",
      voltage: 3.7,
      installationLocation: "Building A, Room 110"
    }
  ];

  // Create battery histories
  const batteryHistories = new Map<number, BatteryHistory[]>();
  
  // Helper function to generate historical data
  const addBatteryHistoricalData = (batteryId: number, initialHealth: number, months: number) => {
    const history: BatteryHistory[] = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - months);
    
    const battery = batteries.find(b => b.id === batteryId);
    if (!battery) return [];
    
    // Generate data points with a slight downward trend
    const totalDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const healthDecreasePerDay = (initialHealth - battery.healthPercentage) / totalDays;
    const cycleIncreasePerDay = battery.cycleCount / totalDays;
    
    let historyId = (batteryId - 1) * 12 + 1; // Unique ID starting pattern
    
    for (let day = 0; day < totalDays; day += 10) { // One entry every 10 days
      const entryDate = new Date(startDate);
      entryDate.setDate(startDate.getDate() + day);
      
      const dayHealth = initialHealth - (healthDecreasePerDay * day);
      const dayCycles = Math.floor(cycleIncreasePerDay * day);
      const dayCapacity = Math.floor((battery.initialCapacity * dayHealth) / 100);
      
      history.push({
        id: historyId++,
        batteryId,
        date: entryDate,
        capacity: dayCapacity,
        healthPercentage: parseFloat(dayHealth.toFixed(2)),
        cycleCount: dayCycles
      });
    }
    
    return history;
  };
  
  // Generate history for each battery
  batteryHistories.set(1, addBatteryHistoricalData(1, 100, 6));
  batteryHistories.set(2, addBatteryHistoricalData(2, 100, 8));
  batteryHistories.set(3, addBatteryHistoricalData(3, 100, 4));
  batteryHistories.set(4, addBatteryHistoricalData(4, 100, 10));
  
  // Create usage patterns
  const usagePatterns = new Map<number, UsagePattern>();
  usagePatterns.set(1, {
    id: 1,
    batteryId: 1,
    chargingFrequency: 3.5,
    dischargeDepth: 25,
    temperatureExposure: 22,
    usageType: "Moderate",
    environmentalConditions: "Indoor",
    fastChargingPercentage: 15
  });
  
  usagePatterns.set(2, {
    id: 2,
    batteryId: 2,
    chargingFrequency: 5,
    dischargeDepth: 45,
    temperatureExposure: 26,
    usageType: "Heavy",
    environmentalConditions: "Mixed",
    fastChargingPercentage: 40
  });
  
  usagePatterns.set(3, {
    id: 3,
    batteryId: 3,
    chargingFrequency: 2,
    dischargeDepth: 20,
    temperatureExposure: 21,
    usageType: "Light",
    environmentalConditions: "Indoor",
    fastChargingPercentage: 5
  });
  
  usagePatterns.set(4, {
    id: 4,
    batteryId: 4,
    chargingFrequency: 7,
    dischargeDepth: 70,
    temperatureExposure: 32,
    usageType: "Heavy",
    environmentalConditions: "Outdoor",
    fastChargingPercentage: 85
  });
  
  // Create recommendations
  const recommendations = new Map<number, Recommendation[]>();
  
  recommendations.set(1, [
    {
      id: 1,
      batteryId: 1,
      type: "Maintenance",
      message: "Regular calibration recommended to maintain accuracy.",
      createdAt: new Date("2024-03-10"),
      resolved: false
    }
  ]);
  
  recommendations.set(2, [
    {
      id: 2,
      batteryId: 2,
      type: "Usage",
      message: "Reduce fast charging frequency to extend battery life.",
      createdAt: new Date("2024-03-05"),
      resolved: false
    },
    {
      id: 3,
      batteryId: 2,
      type: "Maintenance",
      message: "Inspect battery connectors for possible corrosion.",
      createdAt: new Date("2024-02-20"),
      resolved: true
    }
  ]);
  
  recommendations.set(3, []);
  
  recommendations.set(4, [
    {
      id: 4,
      batteryId: 4,
      type: "Replacement",
      message: "Battery health has degraded below recommended threshold. Consider replacement.",
      createdAt: new Date("2024-03-15"),
      resolved: false
    }
  ]);
  
  return {
    batteries,
    batteryHistories,
    usagePatterns,
    recommendations
  };
}