import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema from the original template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Battery schema
export const batteries = pgTable("batteries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  initialCapacity: integer("initial_capacity").notNull(), // mAh
  currentCapacity: integer("current_capacity").notNull(), // mAh
  healthPercentage: real("health_percentage").notNull(), // %
  cycleCount: integer("cycle_count").notNull(),
  expectedCycles: integer("expected_cycles").notNull(),
  status: text("status").notNull(), // "Excellent", "Good", "Fair", "Poor"
  initialDate: text("initial_date").notNull(), // Store as ISO string for Supabase compatibility
  lastUpdated: text("last_updated").notNull(), // Store as ISO string for Supabase compatibility
  degradationRate: real("degradation_rate").notNull(), // % per month
  userId: integer("user_id"),
});

export const insertBatterySchema = createInsertSchema(batteries).omit({
  id: true,
});

export type InsertBattery = z.infer<typeof insertBatterySchema>;
export type Battery = typeof batteries.$inferSelect;

// Battery historical data schema
export const batteryHistory = pgTable("battery_history", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull(),
  date: text("date").notNull(), // Store as ISO string for Supabase compatibility
  capacity: integer("capacity").notNull(), // mAh
  healthPercentage: real("health_percentage").notNull(), // %
  cycleCount: integer("cycle_count").notNull(),
});

export const insertBatteryHistorySchema = createInsertSchema(batteryHistory).omit({
  id: true,
});

export type InsertBatteryHistory = z.infer<typeof insertBatteryHistorySchema>;
export type BatteryHistory = typeof batteryHistory.$inferSelect;

// Usage patterns schema
export const usagePatterns = pgTable("usage_patterns", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull(),
  chargingFrequency: real("charging_frequency").notNull(), // times per day
  dischargeDepth: real("discharge_depth").notNull(), // %
  chargeDuration: integer("charge_duration").notNull(), // minutes
  operatingTemperature: real("operating_temperature").notNull(), // °C
  lastUpdated: text("last_updated").notNull(), // Store as ISO string for Supabase compatibility
});

export const insertUsagePatternSchema = createInsertSchema(usagePatterns).omit({
  id: true,
});

export type InsertUsagePattern = z.infer<typeof insertUsagePatternSchema>;
export type UsagePattern = typeof usagePatterns.$inferSelect;

// Recommendations schema
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull(),
  type: text("type").notNull(), // "info", "warning", "error", "success"
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(), // Store as ISO string for Supabase compatibility
  resolved: boolean("resolved").notNull().default(false),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;
