"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertRecommendationSchema = exports.recommendations = exports.insertUsagePatternSchema = exports.usagePatterns = exports.insertBatteryHistorySchema = exports.batteryHistory = exports.insertBatterySchema = exports.batteries = exports.insertUserSchema = exports.users = exports.sessions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// Session storage table required for Replit Auth
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    sid: (0, pg_core_1.varchar)("sid").primaryKey(),
    sess: (0, pg_core_1.jsonb)("sess").notNull(),
    expire: (0, pg_core_1.timestamp)("expire").notNull(),
}, (table) => [(0, pg_core_1.index)("IDX_session_expire").on(table.expire)]);
// User schema matching the Supabase database structure
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().notNull(),
    username: (0, pg_core_1.varchar)("username").notNull(),
    password: (0, pg_core_1.varchar)("password").notNull(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users);
// Battery schema
exports.batteries = (0, pg_core_1.pgTable)("batteries", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    serialNumber: (0, pg_core_1.text)("serial_number").notNull().unique(),
    initialCapacity: (0, pg_core_1.integer)("initial_capacity").notNull(), // mAh
    currentCapacity: (0, pg_core_1.integer)("current_capacity").notNull(), // mAh
    healthPercentage: (0, pg_core_1.real)("health_percentage").notNull(), // %
    cycleCount: (0, pg_core_1.integer)("cycle_count").notNull(),
    expectedCycles: (0, pg_core_1.integer)("expected_cycles").notNull(),
    status: (0, pg_core_1.text)("status").notNull(), // "Excellent", "Good", "Fair", "Poor"
    initialDate: (0, pg_core_1.text)("initial_date").notNull(), // Store as ISO string for Supabase compatibility
    lastUpdated: (0, pg_core_1.text)("last_updated").notNull(), // Store as ISO string for Supabase compatibility
    degradationRate: (0, pg_core_1.real)("degradation_rate").notNull(), // % per month
    userId: (0, pg_core_1.text)("user_id"), // Changed to text for UUID compatibility with Supabase Auth
});
exports.insertBatterySchema = (0, drizzle_zod_1.createInsertSchema)(exports.batteries).omit({
    id: true,
});
// Battery historical data schema
exports.batteryHistory = (0, pg_core_1.pgTable)("battery_history", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    batteryId: (0, pg_core_1.integer)("battery_id").notNull(),
    date: (0, pg_core_1.text)("date").notNull(), // Store as ISO string for Supabase compatibility
    capacity: (0, pg_core_1.integer)("capacity").notNull(), // mAh
    healthPercentage: (0, pg_core_1.real)("health_percentage").notNull(), // %
    cycleCount: (0, pg_core_1.integer)("cycle_count").notNull(),
});
exports.insertBatteryHistorySchema = (0, drizzle_zod_1.createInsertSchema)(exports.batteryHistory).omit({
    id: true,
});
// Usage patterns schema
exports.usagePatterns = (0, pg_core_1.pgTable)("usage_patterns", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    batteryId: (0, pg_core_1.integer)("battery_id").notNull(),
    chargingFrequency: (0, pg_core_1.real)("charging_frequency").notNull(), // times per day
    dischargeDepth: (0, pg_core_1.real)("discharge_depth").notNull(), // %
    chargeDuration: (0, pg_core_1.integer)("charge_duration").notNull(), // minutes
    operatingTemperature: (0, pg_core_1.real)("operating_temperature").notNull(), // °C
    lastUpdated: (0, pg_core_1.text)("last_updated").notNull(), // Store as ISO string for Supabase compatibility
});
exports.insertUsagePatternSchema = (0, drizzle_zod_1.createInsertSchema)(exports.usagePatterns).omit({
    id: true,
});
// Recommendations schema
exports.recommendations = (0, pg_core_1.pgTable)("recommendations", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    batteryId: (0, pg_core_1.integer)("battery_id").notNull(),
    type: (0, pg_core_1.text)("type").notNull(), // "info", "warning", "error", "success"
    message: (0, pg_core_1.text)("message").notNull(),
    createdAt: (0, pg_core_1.text)("created_at").notNull(), // Store as ISO string for Supabase compatibility
    resolved: (0, pg_core_1.boolean)("resolved").notNull().default(false),
});
exports.insertRecommendationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.recommendations).omit({
    id: true,
});
