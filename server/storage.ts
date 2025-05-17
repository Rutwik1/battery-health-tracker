import {
  users, type User, type UpsertUser,
  batteries, type Battery, type InsertBattery, 
  batteryHistory, type BatteryHistory, type InsertBatteryHistory,
  usagePatterns, type UsagePattern, type InsertUsagePattern,
  recommendations, type Recommendation, type InsertRecommendation
} from "@shared/schema";

// Interface with CRUD methods
export interface IStorage {
  // User methods (from original template)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;

  // Battery methods
  getBatteries(): Promise<Battery[]>;
  getBattery(id: number): Promise<Battery | undefined>;
  createBattery(battery: InsertBattery): Promise<Battery>;
  updateBattery(id: number, battery: Partial<InsertBattery>): Promise<Battery | undefined>;
  deleteBattery(id: number): Promise<boolean>;

  // Battery history methods
  getBatteryHistory(batteryId: number): Promise<BatteryHistory[]>;
  getBatteryHistoryFiltered(batteryId: number, startDate: Date, endDate: Date): Promise<BatteryHistory[]>;
  createBatteryHistory(history: InsertBatteryHistory): Promise<BatteryHistory>;

  // Usage pattern methods
  getUsagePattern(batteryId: number): Promise<UsagePattern | undefined>;
  createUsagePattern(pattern: InsertUsagePattern): Promise<UsagePattern>;
  updateUsagePattern(id: number, pattern: Partial<InsertUsagePattern>): Promise<UsagePattern | undefined>;

  // Recommendation methods
  getRecommendations(batteryId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, resolved: boolean): Promise<Recommendation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private batteries: Map<number, Battery>;
  private batteryHistories: Map<number, BatteryHistory>;
  private usagePatterns: Map<number, UsagePattern>;
  private recommendations: Map<number, Recommendation>;
  
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
    
    this.batteryCurrentId = 1;
    this.historyCurrentId = 1;
    this.patternCurrentId = 1;
    this.recommendationCurrentId = 1;

    // Initialize with demo data
    this.initializeDemoData();
  }

  // User methods (from original template)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(userData: UpsertUser): Promise<User> {
    // Store with the UUID from Supabase auth
    this.users.set(userData.id, userData as User);
    return userData as User;
  }

  // Battery methods
  async getBatteries(): Promise<Battery[]> {
    return Array.from(this.batteries.values());
  }

  async getBattery(id: number): Promise<Battery | undefined> {
    return this.batteries.get(id);
  }

  async createBattery(insertBattery: InsertBattery): Promise<Battery> {
    const id = this.batteryCurrentId++;
    const battery: Battery = { ...insertBattery, id };
    this.batteries.set(id, battery);
    return battery;
  }

  async updateBattery(id: number, batteryUpdate: Partial<InsertBattery>): Promise<Battery | undefined> {
    const existingBattery = this.batteries.get(id);
    if (!existingBattery) return undefined;

    const updatedBattery: Battery = { ...existingBattery, ...batteryUpdate };
    this.batteries.set(id, updatedBattery);
    return updatedBattery;
  }

  async deleteBattery(id: number): Promise<boolean> {
    return this.batteries.delete(id);
  }

  // Battery history methods
  async getBatteryHistory(batteryId: number): Promise<BatteryHistory[]> {
    return Array.from(this.batteryHistories.values())
      .filter(history => history.batteryId === batteryId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getBatteryHistoryFiltered(batteryId: number, startDate: Date, endDate: Date): Promise<BatteryHistory[]> {
    return Array.from(this.batteryHistories.values())
      .filter(history => 
        history.batteryId === batteryId && 
        new Date(history.date) >= startDate && 
        new Date(history.date) <= endDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createBatteryHistory(insertHistory: InsertBatteryHistory): Promise<BatteryHistory> {
    const id = this.historyCurrentId++;
    const history: BatteryHistory = { ...insertHistory, id };
    this.batteryHistories.set(id, history);
    return history;
  }

  // Usage pattern methods
  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    return Array.from(this.usagePatterns.values()).find(
      pattern => pattern.batteryId === batteryId
    );
  }

  async createUsagePattern(insertPattern: InsertUsagePattern): Promise<UsagePattern> {
    const id = this.patternCurrentId++;
    const pattern: UsagePattern = { ...insertPattern, id };
    this.usagePatterns.set(id, pattern);
    return pattern;
  }

  async updateUsagePattern(id: number, patternUpdate: Partial<InsertUsagePattern>): Promise<UsagePattern | undefined> {
    const existingPattern = this.usagePatterns.get(id);
    if (!existingPattern) return undefined;

    const updatedPattern: UsagePattern = { ...existingPattern, ...patternUpdate };
    this.usagePatterns.set(id, updatedPattern);
    return updatedPattern;
  }

  // Recommendation methods
  async getRecommendations(batteryId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(recommendation => recommendation.batteryId === batteryId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const id = this.recommendationCurrentId++;
    const recommendation: Recommendation = { ...insertRecommendation, id };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async updateRecommendation(id: number, resolved: boolean): Promise<Recommendation | undefined> {
    const existingRecommendation = this.recommendations.get(id);
    if (!existingRecommendation) return undefined;

    const updatedRecommendation: Recommendation = { ...existingRecommendation, resolved };
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }

  // Helper methods for demo data
  private initializeDemoData() {
    // Add demo batteries
    const battery1: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #1",
      serialNumber: "BAT-001",
      initialCapacity: 4000,
      currentCapacity: 3760,
      healthPercentage: 94,
      cycleCount: 156,
      expectedCycles: 1000,
      status: "Excellent",
      initialDate: new Date("2023-05-12"),
      lastUpdated: new Date(),
      degradationRate: 0.5
    };
    this.batteries.set(battery1.id, battery1);

    const battery2: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #2",
      serialNumber: "BAT-002",
      initialCapacity: 4000,
      currentCapacity: 3480,
      healthPercentage: 87,
      cycleCount: 203,
      expectedCycles: 1000,
      status: "Good",
      initialDate: new Date("2023-03-24"),
      lastUpdated: new Date(),
      degradationRate: 0.7
    };
    this.batteries.set(battery2.id, battery2);

    const battery3: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #3",
      serialNumber: "BAT-003",
      initialCapacity: 4000,
      currentCapacity: 2920,
      healthPercentage: 73,
      cycleCount: 412,
      expectedCycles: 1000,
      status: "Fair",
      initialDate: new Date("2022-10-18"),
      lastUpdated: new Date(),
      degradationRate: 1.3
    };
    this.batteries.set(battery3.id, battery3);

    const battery4: Battery = {
      id: this.batteryCurrentId++,
      name: "Battery #4",
      serialNumber: "BAT-004",
      initialCapacity: 4000,
      currentCapacity: 2320,
      healthPercentage: 58,
      cycleCount: 873,
      expectedCycles: 1000,
      status: "Poor",
      initialDate: new Date("2021-11-05"),
      lastUpdated: new Date(),
      degradationRate: 2.1
    };
    this.batteries.set(battery4.id, battery4);

    // Add historical data for each battery
    this.addBatteryHistoricalData(battery1.id, 100, 12);
    this.addBatteryHistoricalData(battery2.id, 100, 12);
    this.addBatteryHistoricalData(battery3.id, 100, 12);
    this.addBatteryHistoricalData(battery4.id, 100, 12);

    // Add usage patterns
    const pattern1: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery1.id,
      chargingFrequency: 1.4,
      dischargeDepth: 26,
      chargeDuration: 102, // 1 hour 42 minutes
      operatingTemperature: 28,
      lastUpdated: new Date()
    };
    this.usagePatterns.set(pattern1.id, pattern1);

    const pattern2: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery2.id,
      chargingFrequency: 1.2,
      dischargeDepth: 30,
      chargeDuration: 115,
      operatingTemperature: 26,
      lastUpdated: new Date()
    };
    this.usagePatterns.set(pattern2.id, pattern2);

    const pattern3: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery3.id,
      chargingFrequency: 1.8,
      dischargeDepth: 35,
      chargeDuration: 95,
      operatingTemperature: 30,
      lastUpdated: new Date()
    };
    this.usagePatterns.set(pattern3.id, pattern3);

    const pattern4: UsagePattern = {
      id: this.patternCurrentId++,
      batteryId: battery4.id,
      chargingFrequency: 2.1,
      dischargeDepth: 45,
      chargeDuration: 130,
      operatingTemperature: 33,
      lastUpdated: new Date()
    };
    this.usagePatterns.set(pattern4.id, pattern4);

    // Add recommendations
    const recommendation1: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery1.id,
      type: "success",
      message: "Avoid charging Battery #1 beyond 90% to extend lifespan.",
      createdAt: new Date(),
      resolved: false
    };
    this.recommendations.set(recommendation1.id, recommendation1);

    const recommendation2: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery4.id,
      type: "error",
      message: "Consider replacing Battery #4 within the next 2 months.",
      createdAt: new Date(),
      resolved: false
    };
    this.recommendations.set(recommendation2.id, recommendation2);

    const recommendation3: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: battery3.id,
      type: "warning",
      message: "Battery #3 is experiencing faster than normal degradation rate.",
      createdAt: new Date(),
      resolved: false
    };
    this.recommendations.set(recommendation3.id, recommendation3);

    const recommendation4: Recommendation = {
      id: this.recommendationCurrentId++,
      batteryId: 0, // General recommendation for all batteries
      type: "info",
      message: "Optimal charging practice: keep all batteries between 20% and 80%.",
      createdAt: new Date(),
      resolved: false
    };
    this.recommendations.set(recommendation4.id, recommendation4);
  }

  private addBatteryHistoricalData(batteryId: number, initialHealth: number, months: number) {
    const battery = this.batteries.get(batteryId);
    if (!battery) return;

    // Generate monthly historical data
    const currentDate = new Date();
    const monthlyData = [];

    // For each month, generate data point
    for (let i = 0; i < months; i++) {
      const historyDate = new Date(currentDate);
      historyDate.setMonth(currentDate.getMonth() - (months - 1 - i));
      
      // Calculate health percentage based on current health and degradation rate
      const monthsElapsed = months - 1 - i;
      const healthPercentage = Math.max(
        initialHealth - (battery.degradationRate * monthsElapsed),
        battery.healthPercentage
      );
      
      // Calculate capacity based on health percentage
      const capacity = Math.round((battery.initialCapacity * healthPercentage) / 100);
      
      // Calculate cycle count (simplified linear model)
      const cycleCount = Math.min(
        Math.round(battery.cycleCount * (i + 1) / months),
        battery.cycleCount
      );

      const historyEntry: BatteryHistory = {
        id: this.historyCurrentId++,
        batteryId: battery.id,
        date: historyDate,
        capacity: capacity,
        healthPercentage: healthPercentage,
        cycleCount: cycleCount
      };
      
      this.batteryHistories.set(historyEntry.id, historyEntry);
      monthlyData.push(historyEntry);
    }
    
    return monthlyData;
  }
}

// Import Supabase storage
import { SupabaseStorage } from './supabase-storage';

// Export Supabase storage instance
// Initialize storage with SupabaseStorage
// This connects to your Supabase database using the credentials in your environment variables
export const storage = new MemStorage();
