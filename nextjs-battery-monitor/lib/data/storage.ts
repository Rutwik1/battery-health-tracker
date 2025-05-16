import { Battery, BatteryHistory, UsagePattern, Recommendation, User } from '@/types';
import { initialBatteries, generateInitialHistory, generateUsagePatterns, generateRecommendations } from './mock-data';

// In-memory storage
class MemStorage {
  private users: Map<string, User>;
  private batteries: Map<number, Battery>;
  private batteryHistories: Map<number, BatteryHistory[]>;
  private usagePatterns: Map<number, UsagePattern>;
  private recommendations: Map<number, Recommendation[]>;
  
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
  
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const id = `user-${Date.now()}`;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Battery methods
  async getBatteries(userId: string): Promise<Battery[]> {
    return Array.from(this.batteries.values())
      .filter(battery => battery.userId === userId);
  }
  
  async getBattery(id: number): Promise<Battery | undefined> {
    return this.batteries.get(id);
  }
  
  async createBattery(battery: Omit<Battery, 'id'>): Promise<Battery> {
    const id = this.batteryCurrentId++;
    const newBattery: Battery = { ...battery, id } as Battery;
    this.batteries.set(id, newBattery);
    return newBattery;
  }
  
  async updateBattery(id: number, batteryUpdate: Partial<Battery>): Promise<Battery | undefined> {
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
    return this.batteryHistories.get(batteryId) || [];
  }
  
  async createBatteryHistory(history: Omit<BatteryHistory, 'id'>): Promise<BatteryHistory> {
    const id = this.historyCurrentId++;
    const newHistory: BatteryHistory = { ...history, id } as BatteryHistory;
    
    const histories = this.batteryHistories.get(history.batteryId) || [];
    histories.push(newHistory);
    this.batteryHistories.set(history.batteryId, histories);
    
    return newHistory;
  }
  
  // Usage pattern methods
  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    return this.usagePatterns.get(batteryId);
  }
  
  async createUsagePattern(pattern: Omit<UsagePattern, 'id'>): Promise<UsagePattern> {
    const id = this.patternCurrentId++;
    const newPattern: UsagePattern = { ...pattern, id } as UsagePattern;
    this.usagePatterns.set(pattern.batteryId, newPattern);
    return newPattern;
  }
  
  async updateUsagePattern(id: number, patternUpdate: Partial<UsagePattern>): Promise<UsagePattern | undefined> {
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
    return this.recommendations.get(batteryId) || [];
  }
  
  async createRecommendation(recommendation: Omit<Recommendation, 'id'>): Promise<Recommendation> {
    const id = this.recommendationCurrentId++;
    const newRecommendation: Recommendation = { ...recommendation, id } as Recommendation;
    
    const recommendations = this.recommendations.get(recommendation.batteryId) || [];
    recommendations.push(newRecommendation);
    this.recommendations.set(recommendation.batteryId, recommendations);
    
    return newRecommendation;
  }
  
  async updateRecommendation(id: number, resolved: boolean): Promise<Recommendation | undefined> {
    for (const [batteryId, recs] of this.recommendations.entries()) {
      const index = recs.findIndex(r => r.id === id);
      if (index !== -1) {
        const existingRecommendation = recs[index];
        const updatedRecommendation: Recommendation = { ...existingRecommendation, resolved };
        recs[index] = updatedRecommendation;
        this.recommendations.set(batteryId, recs);
        return updatedRecommendation;
      }
    }
    return undefined;
  }
  
  // Initialize with demo data
  private initializeDemoData() {
    // Create a demo user
    const demoUser: User = {
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@coulomb.ai',
      image: 'https://ui-avatars.com/api/?name=Demo+User&background=6E44FF&color=fff'
    };
    this.users.set(demoUser.id, demoUser);
    
    // Add batteries
    initialBatteries.forEach(battery => {
      this.batteries.set(battery.id, battery);
    });
    this.batteryCurrentId = initialBatteries.length + 1;
    
    // Add historical data
    const history = generateInitialHistory();
    for (const [batteryId, histories] of Object.entries(history)) {
      this.batteryHistories.set(Number(batteryId), histories);
      this.historyCurrentId += histories.length;
    }
    
    // Add usage patterns
    const patterns = generateUsagePatterns();
    for (const [batteryId, pattern] of Object.entries(patterns)) {
      this.usagePatterns.set(Number(batteryId), pattern);
    }
    this.patternCurrentId = initialBatteries.length + 1;
    
    // Add recommendations
    const recommendations = generateRecommendations();
    for (const [batteryId, recs] of Object.entries(recommendations)) {
      this.recommendations.set(Number(batteryId), recs);
      this.recommendationCurrentId += recs.length;
    }
  }
  
  // Method to simulate real-time updates
  async simulateRealTimeUpdates(userId: string): Promise<Battery[]> {
    const userBatteries = Array.from(this.batteries.values())
      .filter(b => b.userId === userId);
    
    const updatedBatteries = userBatteries.map(battery => {
      // Random time elapsed to create variance
      const timeElapsed = Math.floor(Math.random() * 6) + 1; // 1-6 hours
      
      // Calculate health decrease based on degradation rate and time
      const hourlyDegradation = battery.degradationRate / (30 * 24); // Convert monthly rate to hourly
      const healthDecrease = hourlyDegradation * timeElapsed;
      
      // Calculate new health and capacity
      let newHealthPercentage = battery.healthPercentage - healthDecrease;
      newHealthPercentage = Math.max(0, newHealthPercentage);
      const newCurrentCapacity = Math.floor(battery.initialCapacity * (newHealthPercentage / 100));
      
      // Update cycle count
      const cycleIncrease = (timeElapsed / 24) * (Math.random() * 0.5 + 0.5);
      const newCycles = battery.cycleCount + cycleIncrease;
      
      // Determine new status
      let newStatus = battery.status;
      if (newHealthPercentage < 20) {
        newStatus = 'Critical';
      } else if (newHealthPercentage < 50) {
        newStatus = 'Poor';
      } else if (newHealthPercentage < 80) {
        newStatus = 'Fair';
      } else {
        newStatus = 'Good';
      }
      
      // Update battery
      const updatedBattery: Battery = {
        ...battery,
        healthPercentage: newHealthPercentage,
        currentCapacity: newCurrentCapacity,
        cycleCount: newCycles,
        status: newStatus,
        lastUpdated: new Date()
      };
      
      this.batteries.set(battery.id, updatedBattery);
      
      // Add history point with 20% probability
      if (Math.random() < 0.2) {
        const histories = this.batteryHistories.get(battery.id) || [];
        histories.push({
          id: this.historyCurrentId++,
          batteryId: battery.id,
          date: new Date(),
          capacity: updatedBattery.currentCapacity,
          healthPercentage: updatedBattery.healthPercentage,
          cycleCount: updatedBattery.cycleCount
        });
        this.batteryHistories.set(battery.id, histories);
      }
      
      return updatedBattery;
    });
    
    return updatedBatteries;
  }
}

export const storage = new MemStorage();