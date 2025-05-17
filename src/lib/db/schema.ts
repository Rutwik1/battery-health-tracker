import { pgTable, serial, text, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
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

// Batteries table
export const batteries = pgTable("batteries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serialNumber: text("serial_number").notNull(),
  manufacturer: text("manufacturer").notNull(),
  model: text("model").notNull(),
  type: text("type").notNull(),
  capacity: decimal("capacity").notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  currentHealth: decimal("current_health").notNull(),
  status: text("status").notNull(),
  lastCharged: timestamp("last_charged").notNull(),
  cycleCount: integer("cycle_count").notNull(),
  voltageNominal: decimal("voltage_nominal").notNull(),
  image: text("image"),
  location: text("location"),
});

export const insertBatterySchema = createInsertSchema(batteries).omit({
  id: true,
});

export type InsertBattery = z.infer<typeof insertBatterySchema>;
export type Battery = typeof batteries.$inferSelect;

// Battery history table
export const batteryHistory = pgTable("battery_history", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull().references(() => batteries.id),
  date: timestamp("date").notNull(),
  health: decimal("health").notNull(),
  voltage: decimal("voltage").notNull(),
  temperature: decimal("temperature").notNull(),
  chargeLevel: decimal("charge_level").notNull(),
  cycleCount: integer("cycle_count").notNull(),
});

export const insertBatteryHistorySchema = createInsertSchema(batteryHistory).omit({
  id: true,
});

export type InsertBatteryHistory = z.infer<typeof insertBatteryHistorySchema>;
export type BatteryHistory = typeof batteryHistory.$inferSelect;

// Usage patterns table
export const usagePatterns = pgTable("usage_patterns", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull().references(() => batteries.id),
  chargingFrequency: text("charging_frequency").notNull(),
  averageDischargeRate: decimal("average_discharge_rate").notNull(),
  deepDischargeFrequency: text("deep_discharge_frequency").notNull(),
  usagePattern: text("usage_pattern").notNull(),
  environmentalConditions: text("environmental_conditions").notNull(),
  operatingTemperature: decimal("operating_temperature").notNull(),
});

export const insertUsagePatternSchema = createInsertSchema(usagePatterns).omit({
  id: true,
});

export type InsertUsagePattern = z.infer<typeof insertUsagePatternSchema>;
export type UsagePattern = typeof usagePatterns.$inferSelect;

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  batteryId: integer("battery_id").notNull().references(() => batteries.id),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resolved: boolean("resolved").notNull().default(false),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;