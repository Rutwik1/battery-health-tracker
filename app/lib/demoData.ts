import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/app/types/schema';

export function generateDemoData() {
  const batteries: Battery[] = [
    {
      id: 1,
      name: "Server Backup Battery",
      serialNumber: "SBB-2023-001",
      initialCapacity: 10000,
      currentCapacity: 9500,
      healthPercentage: 95,
      cycleCount: 120,
      expectedCycles: 1000,
      status: "Excellent",
      initialDate: new Date(2023, 0, 15),
      lastUpdated: new Date(),
      degradationRate: 0.4,
      manufacturer: "PowerTech",
      model: "PT-10K-LI",
      chemistry: "Lithium Ion",
      voltage: 12.8,
      installationLocation: "Server Room A"
    },
    {
      id: 2,
      name: "UPS Battery Pack",
      serialNumber: "UPS-2022-542",
      initialCapacity: 20000,
      currentCapacity: 17200,
      healthPercentage: 86,
      cycleCount: 310,
      expectedCycles: 800,
      status: "Good",
      initialDate: new Date(2022, 5, 3),
      lastUpdated: new Date(),
      degradationRate: 0.7,
      manufacturer: "BackupPower",
      model: "BP-20K-UPS",
      chemistry: "Lithium Iron Phosphate",
      voltage: 24.5,
      installationLocation: "Data Center B"
    },
    {
      id: 3,
      name: "Portable Power Station",
      serialNumber: "PPS-2023-789",
      initialCapacity: 5000,
      currentCapacity: 3500,
      healthPercentage: 70,
      cycleCount: 450,
      expectedCycles: 800,
      status: "Fair",
      initialDate: new Date(2021, 3, 22),
      lastUpdated: new Date(),
      degradationRate: 1.2,
      manufacturer: "MobilePower",
      model: "MP-5K-Portable",
      chemistry: "Lithium Polymer",
      voltage: 5.2,
      installationLocation: "Mobile Unit 3"
    },
    {
      id: 4,
      name: "Emergency Lighting Battery",
      serialNumber: "ELB-2021-456",
      initialCapacity: 3000,
      currentCapacity: 1380,
      healthPercentage: 46,
      cycleCount: 720,
      expectedCycles: 1000,
      status: "Poor",
      initialDate: new Date(2020, 8, 10),
      lastUpdated: new Date(),
      degradationRate: 1.8,
      manufacturer: "SafeLight",
      model: "SL-3K-Emergency",
      chemistry: "Sealed Lead Acid",
      voltage: 6,
      installationLocation: "Exit Hallway C"
    }
  ];

  const batteryHistories: Map<number, BatteryHistory[]> = new Map();
  const usagePatterns: Map<number, UsagePattern> = new Map();
  const recommendations: Map<number, Recommendation[]> = new Map();

  // Generate history data for each battery
  batteries.forEach(battery => {
    // Generate 30 data points for each battery, one for each day going back from today
    const batteryHistory: BatteryHistory[] = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Calculate a slightly decreasing capacity over time
      const daysPassed = Math.floor((new Date().getTime() - battery.initialDate.getTime()) / (1000 * 3600 * 24));
      const totalDegradation = daysPassed * (battery.degradationRate / 30); // convert monthly rate to daily
      const healthPercentage = Math.max(100 - totalDegradation, battery.healthPercentage);
      
      // Cycles increase by approximately 10-20 per month
      const cyclesPerDay = battery.cycleCount / daysPassed;
      const cycleCount = Math.round(cyclesPerDay * (daysPassed - i));
      
      // Calculate capacity based on health percentage
      const capacity = Math.round((battery.initialCapacity * healthPercentage) / 100);
      
      batteryHistory.push({
        id: i + 1,
        batteryId: battery.id,
        date,
        capacity,
        healthPercentage,
        cycleCount
      });
    }
    batteryHistories.set(battery.id, batteryHistory);
    
    // Generate usage pattern for each battery
    const usagePattern: UsagePattern = {
      id: battery.id,
      batteryId: battery.id,
      chargingFrequency: battery.id === 3 ? 14 : battery.id === 4 ? 2 : 7, // charges per week
      dischargeDepth: battery.id === 1 ? 20 : battery.id === 2 ? 30 : battery.id === 3 ? 80 : 50, // %
      temperatureExposure: battery.id === 1 ? 22 : battery.id === 2 ? 24 : battery.id === 3 ? 28 : 21, // °C
      usageType: battery.id === 1 ? "Light" : battery.id === 2 ? "Moderate" : battery.id === 3 ? "Heavy" : "Moderate",
      environmentalConditions: battery.id === 3 ? "Mixed" : "Indoor",
      fastChargingPercentage: battery.id === 3 ? 75 : battery.id === 4 ? 0 : 25 // %
    };
    usagePatterns.set(battery.id, usagePattern);
    
    // Generate recommendations for each battery
    const batteryRecommendations: Recommendation[] = [];
    
    if (battery.healthPercentage < 50) {
      batteryRecommendations.push({
        id: batteryRecommendations.length + 1,
        batteryId: battery.id,
        type: "Replacement",
        message: "Battery health below 50%. Schedule replacement within the next 30 days.",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        resolved: false
      });
    }
    
    if (battery.cycleCount > battery.expectedCycles * 0.7) {
      batteryRecommendations.push({
        id: batteryRecommendations.length + 1,
        batteryId: battery.id,
        type: "Maintenance",
        message: "Battery approaching end of cycle life. Consider testing under load to verify capacity.",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        resolved: battery.id !== 3
      });
    }
    
    if (
      usagePattern.dischargeDepth > 70 && 
      usagePattern.usageType === "Heavy" && 
      usagePattern.fastChargingPercentage > 50
    ) {
      batteryRecommendations.push({
        id: batteryRecommendations.length + 1,
        batteryId: battery.id,
        type: "Usage",
        message: "Heavy usage with deep discharge and frequent fast charging. Consider adjusting usage pattern to prolong battery life.",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
        resolved: false
      });
    }
    
    recommendations.set(battery.id, batteryRecommendations);
  });

  return { 
    batteries, 
    batteryHistories, 
    usagePatterns, 
    recommendations 
  };
}