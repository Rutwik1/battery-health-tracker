import { Battery, BatteryHistory, UsagePattern, Recommendation } from "../types/schema";

export function generateDemoData() {
  const batteries: Battery[] = [
    {
      id: 1,
      name: "EV Battery Pack 1",
      serialNumber: "BP-2023-001",
      initialCapacity: 75000,
      currentCapacity: 72000,
      healthPercentage: 96,
      cycleCount: 124,
      expectedCycles: 2000,
      status: "Excellent",
      initialDate: new Date("2023-01-15"),
      lastUpdated: new Date("2025-05-15"),
      degradationRate: 0.21,
      manufacturer: "PowerTech",
      model: "EV-75-X",
      chemistry: "Lithium-Ion",
      voltage: 400,
      installationLocation: "Vehicle ID: EV-001"
    },
    {
      id: 2,
      name: "Solar Storage Unit",
      serialNumber: "SS-2022-045",
      initialCapacity: 100000,
      currentCapacity: 85000,
      healthPercentage: 85,
      cycleCount: 312,
      expectedCycles: 1500,
      status: "Good",
      initialDate: new Date("2022-06-20"),
      lastUpdated: new Date("2025-05-10"),
      degradationRate: 0.5,
      manufacturer: "SolarCell",
      model: "Home-100",
      chemistry: "LiFePO4",
      voltage: 48,
      installationLocation: "Residential Building A"
    },
    {
      id: 3,
      name: "Industrial UPS",
      serialNumber: "UPS-2021-178",
      initialCapacity: 200000,
      currentCapacity: 126000,
      healthPercentage: 63,
      cycleCount: 856,
      expectedCycles: 1200,
      status: "Fair",
      initialDate: new Date("2021-03-10"),
      lastUpdated: new Date("2025-05-12"),
      degradationRate: 1.15,
      manufacturer: "PowerGuard",
      model: "IND-UPS-200",
      chemistry: "Lithium-Ion",
      voltage: 220,
      installationLocation: "Data Center B"
    },
    {
      id: 4,
      name: "Portable Power Bank",
      serialNumber: "PPB-2024-321",
      initialCapacity: 10000,
      currentCapacity: 9800,
      healthPercentage: 98,
      cycleCount: 15,
      expectedCycles: 500,
      status: "Excellent",
      initialDate: new Date("2024-02-01"),
      lastUpdated: new Date("2025-05-14"),
      degradationRate: 0.12,
      manufacturer: "MobilePower",
      model: "Ultra-10K",
      chemistry: "Li-Polymer",
      voltage: 5,
      installationLocation: "Mobile Device Support"
    },
    {
      id: 5,
      name: "Telecom Backup Battery",
      serialNumber: "TBB-2020-112",
      initialCapacity: 150000,
      currentCapacity: 72000,
      healthPercentage: 48,
      cycleCount: 921,
      expectedCycles: 1000,
      status: "Poor",
      initialDate: new Date("2020-05-20"),
      lastUpdated: new Date("2025-05-13"),
      degradationRate: 1.55,
      manufacturer: "CommPower",
      model: "TB-150",
      chemistry: "Lead-Acid",
      voltage: 24,
      installationLocation: "Cell Tower #45"
    }
  ];

  // Generate history for each battery
  const batteryHistories = new Map<number, BatteryHistory[]>();
  
  batteries.forEach(battery => {
    const histories: BatteryHistory[] = [];
    const monthsSinceInstallation = monthDiff(battery.initialDate, new Date());
    
    for (let i = 0; i <= monthsSinceInstallation; i++) {
      const date = new Date(battery.initialDate);
      date.setMonth(date.getMonth() + i);
      
      // Calculate degradation based on the battery's degradation rate
      const healthPercentage = 100 - (battery.degradationRate * i);
      const capacity = battery.initialCapacity * (healthPercentage / 100);
      
      // Calculate cycles - assuming linear cycle usage
      const cycleCount = Math.floor((battery.cycleCount / monthsSinceInstallation) * i);
      
      histories.push({
        id: i + 1,
        batteryId: battery.id,
        date: date,
        capacity: Math.round(capacity),
        healthPercentage: Math.round(healthPercentage * 10) / 10,
        cycleCount: cycleCount
      });
    }
    
    batteryHistories.set(battery.id, histories);
  });

  // Generate usage patterns
  const usagePatterns = new Map<number, UsagePattern>();
  
  usagePatterns.set(1, {
    id: 1,
    batteryId: 1,
    chargingFrequency: 3,
    dischargeDepth: 60,
    temperatureExposure: 25,
    usageType: "Moderate",
    environmentalConditions: "Mixed",
    fastChargingPercentage: 20
  });
  
  usagePatterns.set(2, {
    id: 2,
    batteryId: 2,
    chargingFrequency: 7,
    dischargeDepth: 75,
    temperatureExposure: 22,
    usageType: "Heavy",
    environmentalConditions: "Indoor",
    fastChargingPercentage: 0
  });
  
  usagePatterns.set(3, {
    id: 3,
    batteryId: 3,
    chargingFrequency: 2,
    dischargeDepth: 40,
    temperatureExposure: 28,
    usageType: "Moderate",
    environmentalConditions: "Indoor",
    fastChargingPercentage: 0
  });
  
  usagePatterns.set(4, {
    id: 4,
    batteryId: 4,
    chargingFrequency: 5,
    dischargeDepth: 85,
    temperatureExposure: 23,
    usageType: "Light",
    environmentalConditions: "Mixed",
    fastChargingPercentage: 40
  });
  
  usagePatterns.set(5, {
    id: 5,
    batteryId: 5,
    chargingFrequency: 1,
    dischargeDepth: 30,
    temperatureExposure: 32,
    usageType: "Heavy",
    environmentalConditions: "Outdoor",
    fastChargingPercentage: 0
  });

  // Generate recommendations
  const recommendations = new Map<number, Recommendation[]>();
  
  recommendations.set(1, [
    {
      id: 1,
      batteryId: 1,
      type: "Maintenance",
      message: "Schedule routine inspection to verify thermal management system efficacy",
      createdAt: new Date("2025-04-20"),
      resolved: false
    }
  ]);
  
  recommendations.set(2, [
    {
      id: 2,
      batteryId: 2,
      type: "Usage",
      message: "Consider reducing discharge depth to extend lifespan",
      createdAt: new Date("2025-03-15"),
      resolved: true
    },
    {
      id: 3,
      batteryId: 2,
      type: "Maintenance",
      message: "Cell balancing recommended within next 2 months",
      createdAt: new Date("2025-05-01"),
      resolved: false
    }
  ]);
  
  recommendations.set(3, [
    {
      id: 4,
      batteryId: 3,
      type: "Replacement",
      message: "Battery approaching end of life, plan replacement within 3 months",
      createdAt: new Date("2025-04-10"),
      resolved: false
    },
    {
      id: 5,
      batteryId: 3,
      type: "Maintenance",
      message: "Check for unusual temperature variations across cells",
      createdAt: new Date("2025-01-25"),
      resolved: true
    }
  ]);
  
  recommendations.set(5, [
    {
      id: 6,
      batteryId: 5,
      type: "Replacement",
      message: "Immediate replacement required - battery health critical",
      createdAt: new Date("2025-05-05"),
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

// Helper function to calculate months difference between two dates
function monthDiff(dateFrom: Date, dateTo: Date) {
  return dateTo.getMonth() - dateFrom.getMonth() + 
    (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
}