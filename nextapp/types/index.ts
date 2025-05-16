export interface Battery {
  id: number;
  name: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  manufactureDate: string;
  capacity: number;
  voltage: number;
  cycleCount: number;
  health: number;
  status: string;
  lastChecked: string;
}

export interface BatteryHistory {
  id: number;
  batteryId: number;
  date: string;
  health: number;
  voltage: number;
  capacity: number;
  temperature: number;
  cycleCount: number;
}

export interface UsagePattern {
  id: number;
  batteryId: number;
  chargingFrequency: number;
  averageDischargeRate: number;
  deepDischargeCount: number;
  peakUsageTime: string;
  environmentalConditions: string;
  usageType: string;
}

export interface Recommendation {
  id: number;
  batteryId: number;
  type: string;
  description: string;
  priority: string;
  created: string;
  resolved: boolean;
}