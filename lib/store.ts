import { 
  Battery, 
  BatteryHistory, 
  UsagePattern, 
  Recommendation,
  User
} from '@/app/types/schema';

class MemStorage {
  private users: Map<number, User>;
  private batteries: Map<number, Battery>;
  private batteryHistories: Map<number, BatteryHistory>;
  private usagePatterns: Map<number, UsagePattern>;
  private recommendations: Map<number, Recommendation>;

  private userCurrentId: number;
  private batteryCurrentId: number;
  private historyCurrentId: number;
  private patternCurrentId: number;
  private recommendationCurrentId: number;

  constructor() {
    this.users = new Map();
    this.batteries = new Map();
    this.batteryHistories = new Map();
    this.usagePatterns = new Map();
    this.recommendations = new Map();

    this.userCurrentId = 1;
    this.batteryCurrentId = 1;
    this.historyCurrentId = 1;
    this.patternCurrentId = 1;
    this.recommendationCurrentId = 1;

    // Initialize with some demo data
    this.initializeDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: Omit<User, 'id'>): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Battery methods
  async getBatteries(): Promise<Battery[]> {
    return Array.from(this.batteries.values());
  }

  async getBattery(id: number): Promise<Battery | undefined> {
    return this.batteries.get(id);
  }

  async createBattery(insertBattery: Omit<Battery, 'id'>): Promise<Battery> {
    const id = this.batteryCurrentId++;
    const battery: Battery = { ...insertBattery, id };
    this.batteries.set(id, battery);
    return battery;
  }

  async updateBattery(
    id: number,
    batteryUpdate: Partial<Omit<Battery, 'id'>>
  ): Promise<Battery | undefined> {
    const existingBattery = this.batteries.get(id);
    if (!existingBattery) {
      return undefined;
    }
    const updatedBattery: Battery = { ...existingBattery, ...batteryUpdate };
    this.batteries.set(id, updatedBattery);
    return updatedBattery;
  }

  async deleteBattery(id: number): Promise<boolean> {
    return this.batteries.delete(id);
  }

  // Battery history methods
  async getBatteryHistory(batteryId: number): Promise<BatteryHistory[]> {
    const histories: BatteryHistory[] = [];
    for (const history of this.batteryHistories.values()) {
      if (history.batteryId === batteryId) {
        histories.push(history);
      }
    }
    return histories.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getBatteryHistoryFiltered(
    batteryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<BatteryHistory[]> {
    const histories = await this.getBatteryHistory(batteryId);
    return histories.filter(history => {
      const historyDate = new Date(history.date);
      return historyDate >= startDate && historyDate <= endDate;
    });
  }

  async createBatteryHistory(
    insertHistory: Omit<BatteryHistory, 'id'>
  ): Promise<BatteryHistory> {
    const id = this.historyCurrentId++;
    const history: BatteryHistory = { ...insertHistory, id };
    this.batteryHistories.set(id, history);
    return history;
  }

  // Usage pattern methods
  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    for (const pattern of this.usagePatterns.values()) {
      if (pattern.batteryId === batteryId) {
        return pattern;
      }
    }
    return undefined;
  }

  async createUsagePattern(
    insertPattern: Omit<UsagePattern, 'id'>
  ): Promise<UsagePattern> {
    const id = this.patternCurrentId++;
    const pattern: UsagePattern = { ...insertPattern, id };
    this.usagePatterns.set(id, pattern);
    return pattern;
  }

  async updateUsagePattern(
    id: number,
    patternUpdate: Partial<Omit<UsagePattern, 'id'>>
  ): Promise<UsagePattern | undefined> {
    const existingPattern = this.usagePatterns.get(id);
    if (!existingPattern) {
      return undefined;
    }
    const updatedPattern: UsagePattern = { ...existingPattern, ...patternUpdate };
    this.usagePatterns.set(id, updatedPattern);
    return updatedPattern;
  }

  // Recommendation methods
  async getRecommendations(batteryId: number): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    for (const recommendation of this.recommendations.values()) {
      if (recommendation.batteryId === batteryId) {
        recommendations.push(recommendation);
      }
    }
    return recommendations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createRecommendation(
    insertRecommendation: Omit<Recommendation, 'id'>
  ): Promise<Recommendation> {
    const id = this.recommendationCurrentId++;
    const recommendation: Recommendation = { ...insertRecommendation, id };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async updateRecommendation(
    id: number,
    resolved: boolean
  ): Promise<Recommendation | undefined> {
    const existingRecommendation = this.recommendations.get(id);
    if (!existingRecommendation) {
      return undefined;
    }
    const updatedRecommendation: Recommendation = { 
      ...existingRecommendation, 
      resolved 
    };
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }

  private initializeDemoData() {
    // Create example batteries
    const battery1: Battery = {
      id: this.batteryCurrentId++,
      name: "Lithium Cell Pack A",
      serialNumber: "LCP-2023-001",
      initialCapacity: 5000,
      currentCapacity: 4750,
      healthPercentage: 95,
      cycleCount: 48,
      expectedCycles: 800,
      status: "Excellent",
      initialDate: new Date(2023, 1, 15),
      lastUpdated: new Date(2023, 4, 10),
      degradationRate: 0.5,
      manufacturer: "EnergyTech",
      model: "PowerCell X5",
      chemistry: "Lithium-ion",
      voltage: 3.7,
      installationLocation: "Server Room A"
    };

    const battery2: Battery = {
      id: this.batteryCurrentId++,
      name: "Backup Power Unit",
      serialNumber: "BPU-2022-153",
      initialCapacity: 10000,
      currentCapacity: 7500,
      healthPercentage: 75,
      cycleCount: 203,
      expectedCycles: 600,
      status: "Good",
      initialDate: new Date(2022, 6, 20),
      lastUpdated: new Date(2023, 3, 28),
      degradationRate: 1.2,
      manufacturer: "PowerSource Inc",
      model: "MaxBackup 100",
      chemistry: "Lithium Polymer",
      voltage: 7.4,
      installationLocation: "Control Room"
    };

    const battery3: Battery = {
      id: this.batteryCurrentId++,
      name: "Emergency Lighting System",
      serialNumber: "ELS-2021-078",
      initialCapacity: 3000,
      currentCapacity: 1650,
      healthPercentage: 55,
      cycleCount: 312,
      expectedCycles: 500,
      status: "Fair",
      initialDate: new Date(2021, 3, 10),
      lastUpdated: new Date(2023, 4, 5),
      degradationRate: 1.8,
      manufacturer: "SafeLight",
      model: "EmergencyCell",
      chemistry: "Nickel-Metal Hydride",
      voltage: 4.8,
      installationLocation: "East Wing Corridor"
    };

    const battery4: Battery = {
      id: this.batteryCurrentId++,
      name: "Mobile Data Terminal",
      serialNumber: "MDT-2020-426",
      initialCapacity: 4000,
      currentCapacity: 1800,
      healthPercentage: 45,
      cycleCount: 578,
      expectedCycles: 600,
      status: "Poor",
      initialDate: new Date(2020, 8, 5),
      lastUpdated: new Date(2023, 4, 8),
      degradationRate: 2.2,
      manufacturer: "MobileTech",
      model: "DataPower 4K",
      chemistry: "Lithium-ion",
      voltage: 3.6,
      installationLocation: "Vehicle #103"
    };

    this.batteries.set(battery1.id, battery1);
    this.batteries.set(battery2.id, battery2);
    this.batteries.set(battery3.id, battery3);
    this.batteries.set(battery4.id, battery4);

    // Create example usage patterns
    const pattern1: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery1.id,
      chargingFrequency: 2,
      dischargeDepth: 15,
      temperatureExposure: 22,
      usageType: "Light",
      environmentalConditions: "Indoor",
      fastChargingPercentage: 5
    };

    const pattern2: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery2.id,
      chargingFrequency: 4,
      dischargeDepth: 35,
      temperatureExposure: 24,
      usageType: "Moderate",
      environmentalConditions: "Indoor",
      fastChargingPercentage: 20
    };

    const pattern3: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery3.id,
      chargingFrequency: 3,
      dischargeDepth: 60,
      temperatureExposure: 25,
      usageType: "Heavy",
      environmentalConditions: "Mixed",
      fastChargingPercentage: 40
    };

    const pattern4: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery4.id,
      chargingFrequency: 7,
      dischargeDepth: 80,
      temperatureExposure: 28,
      usageType: "Heavy",
      environmentalConditions: "Mixed",
      fastChargingPercentage: 70
    };

    this.usagePatterns.set(pattern1.id, pattern1);
    this.usagePatterns.set(pattern2.id, pattern2);
    this.usagePatterns.set(pattern3.id, pattern3);
    this.usagePatterns.set(pattern4.id, pattern4);

    // Create example recommendations
    const recommendation1: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery1.id,
      type: "Maintenance",
      message: "Schedule routine calibration to maintain optimal performance.",
      createdAt: new Date(2023, 3, 15),
      resolved: false
    };

    const recommendation2: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery2.id,
      type: "Usage",
      message: "Consider reducing fast charging frequency to extend battery life.",
      createdAt: new Date(2023, 2, 20),
      resolved: true
    };

    const recommendation3: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery3.id,
      type: "Maintenance",
      message: "Battery should be reconditioned within the next 30 days.",
      createdAt: new Date(2023, 4, 1),
      resolved: false
    };

    const recommendation4: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery4.id,
      type: "Replacement",
      message: "Battery is nearing end of life. Schedule replacement within 60 days.",
      createdAt: new Date(2023, 3, 28),
      resolved: false
    };

    this.recommendations.set(recommendation1.id, recommendation1);
    this.recommendations.set(recommendation2.id, recommendation2);
    this.recommendations.set(recommendation3.id, recommendation3);
    this.recommendations.set(recommendation4.id, recommendation4);

    // Add battery historical data
    this.addBatteryHistoricalData(battery1.id, 100, 3);
    this.addBatteryHistoricalData(battery2.id, 95, 9);
    this.addBatteryHistoricalData(battery3.id, 90, 24);
    this.addBatteryHistoricalData(battery4.id, 92, 30);
  }

  private addBatteryHistoricalData(batteryId: number, initialHealth: number, months: number) {
    const battery = this.batteries.get(batteryId);
    if (!battery) return;

    const today = new Date();
    const initialDate = new Date(battery.initialDate);
    
    // Generate monthly data points
    for (let i = 0; i <= months; i++) {
      const date = new Date(initialDate);
      date.setMonth(initialDate.getMonth() + i);
      
      // Don't create data points in the future
      if (date > today) continue;
      
      // Calculate values with some randomness
      const healthPercentage = Math.max(45, initialHealth - (i * (battery.degradationRate + (Math.random() * 0.4 - 0.2))));
      const cycleCount = Math.floor(i * (battery.cycleCount / months));
      const capacity = Math.round(battery.initialCapacity * (healthPercentage / 100));
      
      const historyEntry: BatteryHistory = {
        id: this.historyCurrentId++,
        batteryId,
        date,
        healthPercentage,
        capacity,
        cycleCount
      };
      
      this.batteryHistories.set(historyEntry.id, historyEntry);
    }
  }
}

// Create a singleton instance
export const storage = new MemStorage();