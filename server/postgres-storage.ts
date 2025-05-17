import { User, InsertUser, Battery, InsertBattery, BatteryHistory, InsertBatteryHistory, 
  UsagePattern, InsertUsagePattern, Recommendation, InsertRecommendation } from "@shared/schema";
import { db } from "./db";
import { users, batteries, batteryHistory, usagePatterns, recommendations } from "@shared/schema";
import { eq, and, between, desc } from "drizzle-orm";
import { IStorage } from "./storage";
import { sql } from "drizzle-orm";

// Implement PostgreSQL storage using Drizzle ORM
export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getBatteries(): Promise<Battery[]> {
    return await db.select().from(batteries);
  }

  async getBattery(id: number): Promise<Battery | undefined> {
    const result = await db.select().from(batteries).where(eq(batteries.id, id));
    return result[0];
  }

  async createBattery(battery: InsertBattery): Promise<Battery> {
    const result = await db.insert(batteries).values(battery).returning();
    return result[0];
  }

  async updateBattery(id: number, battery: Partial<InsertBattery>): Promise<Battery | undefined> {
    const result = await db
      .update(batteries)
      .set(battery)
      .where(eq(batteries.id, id))
      .returning();
    return result[0];
  }

  async deleteBattery(id: number): Promise<boolean> {
    // Delete all related data first (foreign key relationships)
    await db.delete(batteryHistory).where(eq(batteryHistory.batteryId, id));
    await db.delete(usagePatterns).where(eq(usagePatterns.batteryId, id));
    await db.delete(recommendations).where(eq(recommendations.batteryId, id));
    
    // Then delete the battery
    const result = await db.delete(batteries).where(eq(batteries.id, id)).returning();
    return result.length > 0;
  }

  async getBatteryHistory(batteryId: number): Promise<BatteryHistory[]> {
    return await db
      .select()
      .from(batteryHistory)
      .where(eq(batteryHistory.batteryId, batteryId))
      .orderBy(batteryHistory.date);
  }

  async getBatteryHistoryFiltered(
    batteryId: number,
    startDate: Date,
    endDate: Date
  ): Promise<BatteryHistory[]> {
    return await db
      .select()
      .from(batteryHistory)
      .where(
        and(
          eq(batteryHistory.batteryId, batteryId),
          between(batteryHistory.date, startDate, endDate)
        )
      )
      .orderBy(batteryHistory.date);
  }

  async createBatteryHistory(history: InsertBatteryHistory): Promise<BatteryHistory> {
    const result = await db.insert(batteryHistory).values(history).returning();
    return result[0];
  }

  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    const result = await db
      .select()
      .from(usagePatterns)
      .where(eq(usagePatterns.batteryId, batteryId));
    return result[0];
  }

  async createUsagePattern(pattern: InsertUsagePattern): Promise<UsagePattern> {
    const result = await db.insert(usagePatterns).values(pattern).returning();
    return result[0];
  }

  async updateUsagePattern(
    id: number,
    pattern: Partial<InsertUsagePattern>
  ): Promise<UsagePattern | undefined> {
    const result = await db
      .update(usagePatterns)
      .set(pattern)
      .where(eq(usagePatterns.id, id))
      .returning();
    return result[0];
  }

  async getRecommendations(batteryId: number): Promise<Recommendation[]> {
    return await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.batteryId, batteryId))
      .orderBy(desc(recommendations.createdAt));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const result = await db.insert(recommendations).values(recommendation).returning();
    return result[0];
  }

  async updateRecommendation(
    id: number,
    resolved: boolean
  ): Promise<Recommendation | undefined> {
    const result = await db
      .update(recommendations)
      .set({ resolved })
      .where(eq(recommendations.id, id))
      .returning();
    return result[0];
  }
}