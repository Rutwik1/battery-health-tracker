export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface Battery {
  id: number;
  name: string;
  serialNumber: string;
  initialCapacity: number; // mAh
  currentCapacity: number; // mAh
  healthPercentage: number; // %
  cycleCount: number;
  expectedCycles: number;
  status: 'Good' | 'Fair' | 'Poor' | 'Critical';
  initialDate: Date;
  lastUpdated: Date;
  degradationRate: number; // % per month
  userId: string;
}

export interface BatteryHistory {
  id: number;
  batteryId: number;
  date: Date;
  capacity: number; // mAh
  healthPercentage: number; // %
  cycleCount: number;
}

export interface UsagePattern {
  id: number;
  batteryId: number;
  chargingFrequency: string; // "Daily", "Every few days", etc.
  dischargeRate: number; // % per hour
  temperatureExposure: string; // "Normal", "High", "Low"
  typicalUsage: string; // "Heavy", "Medium", "Light"
}

export interface Recommendation {
  id: number;
  batteryId: number;
  type: string; // "Maintenance", "Replacement", "Usage"
  message: string;
  createdAt: Date;
  resolved: boolean;
}