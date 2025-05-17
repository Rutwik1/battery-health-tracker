// User model
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
}

// Battery model
export interface Battery {
  id: number;
  name: string;
  serialNumber: string;
  initialCapacity: number; // mAh
  currentCapacity: number; // mAh
  healthPercentage: number; // %
  cycleCount: number;
  expectedCycles: number;
  status: string; // "Excellent", "Good", "Fair", "Poor"
  initialDate: Date;
  lastUpdated: Date;
  degradationRate: number; // % per month
  manufacturer?: string;
  model?: string;
  chemistry?: string;
  voltage?: number;
  installationLocation?: string;
}

// Battery History model
export interface BatteryHistory {
  id: number;
  batteryId: number;
  date: Date;
  capacity: number; // mAh
  healthPercentage: number; // %
  cycleCount: number;
}

// Usage Pattern model
export interface UsagePattern {
  id: number;
  batteryId: number;
  chargingFrequency: number; // Average charges per week
  dischargeDepth: number; // Average depth of discharge (%)
  temperatureExposure: number; // Average operating temperature (°C)
  usageType: string; // "Light", "Moderate", "Heavy"
  environmentalConditions: string; // "Indoor", "Outdoor", "Mixed"
  fastChargingPercentage: number; // % of charges using fast charging
}

// Recommendation model
export interface Recommendation {
  id: number;
  batteryId: number;
  type: string; // "Maintenance", "Replacement", "Usage"
  message: string;
  createdAt: Date;
  resolved: boolean;
}