import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create a Neon client
const sql = neon(process.env.DATABASE_URL!);

// Create a Drizzle client
export const db = drizzle(sql, { schema });

// Memory storage for development (fallback if database is not available)
import {
  Battery,
  InsertBattery,
  BatteryHistory,
  InsertBatteryHistory,
  UsagePattern,
  InsertUsagePattern,
  Recommendation,
  InsertRecommendation,
  User,
  InsertUser
} from './schema';

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

    this.initializeDemoData();
  }

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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBatteries(): Promise<Battery[]> {
    return Array.from(this.batteries.values());
  }

  async getBattery(id: number): Promise<Battery | undefined> {
    return this.batteries.get(id);
  }

  async createBattery(insertBattery: InsertBattery): Promise<Battery> {
    const id = this.batteryCurrentId++;
    const battery = { ...insertBattery, id } as Battery;
    this.batteries.set(id, battery);
    return battery;
  }

  async updateBattery(id: number, batteryUpdate: Partial<InsertBattery>): Promise<Battery | undefined> {
    const existingBattery = this.batteries.get(id);
    if (!existingBattery) {
      return undefined;
    }
    const updatedBattery = { ...existingBattery, ...batteryUpdate } as Battery;
    this.batteries.set(id, updatedBattery);
    return updatedBattery;
  }

  async deleteBattery(id: number): Promise<boolean> {
    return this.batteries.delete(id);
  }

  async getBatteryHistory(batteryId: number): Promise<BatteryHistory[]> {
    const result: BatteryHistory[] = [];
    for (const history of this.batteryHistories.values()) {
      if (history.batteryId === batteryId) {
        result.push(history);
      }
    }
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getBatteryHistoryFiltered(batteryId: number, startDate: Date, endDate: Date): Promise<BatteryHistory[]> {
    const result: BatteryHistory[] = [];
    for (const history of this.batteryHistories.values()) {
      if (history.batteryId === batteryId) {
        const historyDate = new Date(history.date);
        if (historyDate >= startDate && historyDate <= endDate) {
          result.push(history);
        }
      }
    }
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createBatteryHistory(insertHistory: InsertBatteryHistory): Promise<BatteryHistory> {
    const id = this.historyCurrentId++;
    const history = { ...insertHistory, id } as BatteryHistory;
    this.batteryHistories.set(id, history);
    return history;
  }

  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    for (const pattern of this.usagePatterns.values()) {
      if (pattern.batteryId === batteryId) {
        return pattern;
      }
    }
    return undefined;
  }

  async createUsagePattern(insertPattern: InsertUsagePattern): Promise<UsagePattern> {
    const id = this.patternCurrentId++;
    const pattern = { ...insertPattern, id } as UsagePattern;
    this.usagePatterns.set(id, pattern);
    return pattern;
  }

  async updateUsagePattern(id: number, patternUpdate: Partial<InsertUsagePattern>): Promise<UsagePattern | undefined> {
    const existingPattern = this.usagePatterns.get(id);
    if (!existingPattern) {
      return undefined;
    }
    const updatedPattern = { ...existingPattern, ...patternUpdate } as UsagePattern;
    this.usagePatterns.set(id, updatedPattern);
    return updatedPattern;
  }

  async getRecommendations(batteryId: number): Promise<Recommendation[]> {
    const result: Recommendation[] = [];
    for (const recommendation of this.recommendations.values()) {
      if (recommendation.batteryId === batteryId) {
        result.push(recommendation);
      }
    }
    return result;
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationCurrentId++;
    const recommendation = { 
      ...insertRecommendation, 
      id, 
      createdAt: new Date(), 
      resolved: false 
    } as Recommendation;
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async updateRecommendation(id: number, resolved: boolean): Promise<Recommendation | undefined> {
    const existingRecommendation = this.recommendations.get(id);
    if (!existingRecommendation) {
      return undefined;
    }
    const updatedRecommendation = { ...existingRecommendation, resolved } as Recommendation;
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }

  private initializeDemoData() {
    // Example batteries
    const battery1: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #1",
      serialNumber: "BT-00123-XYZ",
      manufacturer: "Coulomb Industries",
      model: "LiPro 5000",
      type: "Lithium-Ion",
      capacity: 5000 as any,
      purchaseDate: new Date("2024-02-15") as any,
      currentHealth: 92 as any,
      status: "good",
      lastCharged: new Date("2024-05-10") as any,
      cycleCount: 25,
      voltageNominal: 3.7 as any,
      image: "/assets/battery-1.svg",
      location: "Server Room A"
    };

    const battery2: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #2",
      serialNumber: "BT-00456-ABC",
      manufacturer: "PowerCell",
      model: "MaxCharge 7000",
      type: "Lithium-Polymer",
      capacity: 7000 as any,
      purchaseDate: new Date("2023-09-05") as any,
      currentHealth: 78 as any,
      status: "warning",
      lastCharged: new Date("2024-05-12") as any,
      cycleCount: 120,
      voltageNominal: 3.85 as any,
      image: "/assets/battery-2.svg",
      location: "Main Control Panel"
    };

    const battery3: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #3",
      serialNumber: "BT-00789-DEF",
      manufacturer: "ElectraPower",
      model: "Long Life 4200",
      type: "LiFePO4",
      capacity: 4200 as any,
      purchaseDate: new Date("2023-12-20") as any,
      currentHealth: 95 as any,
      status: "good",
      lastCharged: new Date("2024-05-05") as any,
      cycleCount: 15,
      voltageNominal: 3.2 as any,
      image: "/assets/battery-3.svg",
      location: "Backup System"
    };

    const battery4: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #4",
      serialNumber: "BT-01010-GHI",
      manufacturer: "VoltaCore",
      model: "Industrial 9500",
      type: "Lithium-Ion",
      capacity: 9500 as any,
      purchaseDate: new Date("2023-06-10") as any,
      currentHealth: 65 as any,
      status: "critical",
      lastCharged: new Date("2024-05-15") as any,
      cycleCount: 210,
      voltageNominal: 3.7 as any,
      image: "/assets/battery-4.svg",
      location: "Mobile Unit #12"
    };

    this.batteries.set(battery1.id, battery1);
    this.batteries.set(battery2.id, battery2);
    this.batteries.set(battery3.id, battery3);
    this.batteries.set(battery4.id, battery4);

    // Add historical data for each battery
    this.addBatteryHistoricalData(1, 100, 12);
    this.addBatteryHistoricalData(2, 95, 9);
    this.addBatteryHistoricalData(3, 100, 6);
    this.addBatteryHistoricalData(4, 90, 12);

    // Example usage patterns
    const pattern1: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: 1,
      chargingFrequency: "Every 2-3 days",
      averageDischargeRate: 0.5 as any,
      deepDischargeFrequency: "Rare",
      usagePattern: "Regular",
      environmentalConditions: "Controlled",
      operatingTemperature: 22 as any
    };

    const pattern2: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: 2,
      chargingFrequency: "Daily",
      averageDischargeRate: 0.8 as any,
      deepDischargeFrequency: "Frequent",
      usagePattern: "Heavy",
      environmentalConditions: "Variable",
      operatingTemperature: 28 as any
    };

    const pattern3: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: 3,
      chargingFrequency: "Weekly",
      averageDischargeRate: 0.3 as any,
      deepDischargeFrequency: "Never",
      usagePattern: "Light",
      environmentalConditions: "Controlled",
      operatingTemperature: 20 as any
    };

    const pattern4: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: 4,
      chargingFrequency: "Every 1-2 days",
      averageDischargeRate: 0.9 as any,
      deepDischargeFrequency: "Very Frequent",
      usagePattern: "Heavy and Irregular",
      environmentalConditions: "Harsh",
      operatingTemperature: 35 as any
    };

    this.usagePatterns.set(pattern1.id, pattern1);
    this.usagePatterns.set(pattern2.id, pattern2);
    this.usagePatterns.set(pattern3.id, pattern3);
    this.usagePatterns.set(pattern4.id, pattern4);

    // Example recommendations
    const recommendation1: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: 1,
      type: "maintenance",
      message: "Consider recalibrating battery sensors for optimal performance",
      createdAt: new Date("2024-05-01") as any,
      resolved: false
    };

    const recommendation2: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: 2,
      type: "warning",
      message: "Reduce deep discharge frequency to extend battery life",
      createdAt: new Date("2024-04-15") as any,
      resolved: false
    };

    const recommendation3: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: 3,
      type: "info",
      message: "Current usage pattern is optimal for this battery type",
      createdAt: new Date("2024-05-10") as any,
      resolved: true
    };

    const recommendation4: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: 4,
      type: "critical",
      message: "Replace battery within 30 days - approaching end of useful life",
      createdAt: new Date("2024-04-20") as any,
      resolved: false
    };

    this.recommendations.set(recommendation1.id, recommendation1);
    this.recommendations.set(recommendation2.id, recommendation2);
    this.recommendations.set(recommendation3.id, recommendation3);
    this.recommendations.set(recommendation4.id, recommendation4);
  }

  private addBatteryHistoricalData(batteryId: number, initialHealth: number, months: number) {
    const today = new Date();
    let currentHealth = initialHealth;
    
    for (let i = 0; i < months; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - (months - i));
      
      // Randomly decrease health over time
      currentHealth -= Math.random() * 3;
      
      // Random values for the history entry
      const voltage = 3.2 + Math.random() * 1;
      const temperature = 20 + Math.random() * 15;
      const chargeLevel = 50 + Math.random() * 50;
      const cycleCount = i * 2;
      
      const historyEntry: BatteryHistory = {
        id: this.historyCurrentId++,
        batteryId,
        date: date as any,
        health: currentHealth as any,
        voltage: voltage as any,
        temperature: temperature as any,
        chargeLevel: chargeLevel as any,
        cycleCount
      };
      
      this.batteryHistories.set(historyEntry.id, historyEntry);
    }
  }
}

export const memStorage = new MemStorage();