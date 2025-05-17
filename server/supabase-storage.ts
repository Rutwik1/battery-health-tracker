import {
  User, InsertUser,
  Battery, InsertBattery,
  BatteryHistory, InsertBatteryHistory,
  UsagePattern, InsertUsagePattern,
  Recommendation, InsertRecommendation
} from "@shared/schema";
import { supabase } from './supabase';
import { IStorage } from './storage';

/**
 * Implementation of the IStorage interface using Supabase
 */
export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      username: data.username,
      password: data.password
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      username: data.username,
      password: data.password
    };
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: user.username,
        password: user.password
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      username: data.username,
      password: data.password
    };
  }

  // Battery methods
  async getBatteries(): Promise<Battery[]> {
    const { data, error } = await supabase
      .from('batteries')
      .select('*');
    
    if (error) throw error;
    
    return data.map(battery => ({
      id: battery.id,
      name: battery.name,
      serialNumber: battery.serial_number,
      initialCapacity: battery.initial_capacity,
      currentCapacity: battery.current_capacity,
      healthPercentage: battery.health_percentage,
      cycleCount: battery.cycle_count,
      expectedCycles: battery.expected_cycles,
      status: battery.status,
      initialDate: new Date(battery.initial_date),
      lastUpdated: new Date(battery.last_updated),
      degradationRate: battery.degradation_rate
    }));
  }

  async getBattery(id: number): Promise<Battery | undefined> {
    const { data, error } = await supabase
      .from('batteries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      name: data.name,
      serialNumber: data.serial_number,
      initialCapacity: data.initial_capacity,
      currentCapacity: data.current_capacity,
      healthPercentage: data.health_percentage,
      cycleCount: data.cycle_count,
      expectedCycles: data.expected_cycles,
      status: data.status,
      initialDate: new Date(data.initial_date),
      lastUpdated: new Date(data.last_updated),
      degradationRate: data.degradation_rate
    };
  }

  async createBattery(battery: InsertBattery): Promise<Battery> {
    const { data, error } = await supabase
      .from('batteries')
      .insert({
        name: battery.name,
        serial_number: battery.serialNumber,
        initial_capacity: battery.initialCapacity,
        current_capacity: battery.currentCapacity,
        health_percentage: battery.healthPercentage,
        cycle_count: battery.cycleCount,
        expected_cycles: battery.expectedCycles,
        status: battery.status,
        initial_date: battery.initialDate.toISOString(),
        last_updated: battery.lastUpdated.toISOString(),
        degradation_rate: battery.degradationRate
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      serialNumber: data.serial_number,
      initialCapacity: data.initial_capacity,
      currentCapacity: data.current_capacity,
      healthPercentage: data.health_percentage,
      cycleCount: data.cycle_count,
      expectedCycles: data.expected_cycles,
      status: data.status,
      initialDate: new Date(data.initial_date),
      lastUpdated: new Date(data.last_updated),
      degradationRate: data.degradation_rate
    };
  }

  async updateBattery(id: number, battery: Partial<InsertBattery>): Promise<Battery | undefined> {
    // Prepare the update data with snake_case keys
    const updateData: any = {};
    
    if (battery.name !== undefined) updateData.name = battery.name;
    if (battery.serialNumber !== undefined) updateData.serial_number = battery.serialNumber;
    if (battery.initialCapacity !== undefined) updateData.initial_capacity = battery.initialCapacity;
    if (battery.currentCapacity !== undefined) updateData.current_capacity = battery.currentCapacity;
    if (battery.healthPercentage !== undefined) updateData.health_percentage = battery.healthPercentage;
    if (battery.cycleCount !== undefined) updateData.cycle_count = battery.cycleCount;
    if (battery.expectedCycles !== undefined) updateData.expected_cycles = battery.expectedCycles;
    if (battery.status !== undefined) updateData.status = battery.status;
    if (battery.initialDate !== undefined) updateData.initial_date = battery.initialDate.toISOString();
    if (battery.lastUpdated !== undefined) updateData.last_updated = battery.lastUpdated.toISOString();
    if (battery.degradationRate !== undefined) updateData.degradation_rate = battery.degradationRate;
    
    const { data, error } = await supabase
      .from('batteries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      name: data.name,
      serialNumber: data.serial_number,
      initialCapacity: data.initial_capacity,
      currentCapacity: data.current_capacity,
      healthPercentage: data.health_percentage,
      cycleCount: data.cycle_count,
      expectedCycles: data.expected_cycles,
      status: data.status,
      initialDate: new Date(data.initial_date),
      lastUpdated: new Date(data.last_updated),
      degradationRate: data.degradation_rate
    };
  }

  async deleteBattery(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('batteries')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Battery history methods
  async getBatteryHistory(batteryId: number): Promise<BatteryHistory[]> {
    const { data, error } = await supabase
      .from('battery_history')
      .select('*')
      .eq('battery_id', batteryId)
      .order('date');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      batteryId: item.battery_id,
      date: new Date(item.date),
      capacity: item.capacity,
      healthPercentage: item.health_percentage,
      cycleCount: item.cycle_count
    }));
  }

  async getBatteryHistoryFiltered(batteryId: number, startDate: Date, endDate: Date): Promise<BatteryHistory[]> {
    const { data, error } = await supabase
      .from('battery_history')
      .select('*')
      .eq('battery_id', batteryId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date');
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      batteryId: item.battery_id,
      date: new Date(item.date),
      capacity: item.capacity,
      healthPercentage: item.health_percentage,
      cycleCount: item.cycle_count
    }));
  }

  async createBatteryHistory(history: InsertBatteryHistory): Promise<BatteryHistory> {
    const { data, error } = await supabase
      .from('battery_history')
      .insert({
        battery_id: history.batteryId,
        date: history.date.toISOString(),
        capacity: history.capacity,
        health_percentage: history.healthPercentage,
        cycle_count: history.cycleCount
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      batteryId: data.battery_id,
      date: new Date(data.date),
      capacity: data.capacity,
      healthPercentage: data.health_percentage,
      cycleCount: data.cycle_count
    };
  }

  // Usage pattern methods
  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    const { data, error } = await supabase
      .from('usage_patterns')
      .select('*')
      .eq('battery_id', batteryId)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      batteryId: data.battery_id,
      chargingFrequency: data.charging_frequency,
      dischargeDepth: data.discharge_depth,
      chargeDuration: data.charge_duration,
      operatingTemperature: data.operating_temperature,
      lastUpdated: new Date(data.last_updated)
    };
  }

  async createUsagePattern(pattern: InsertUsagePattern): Promise<UsagePattern> {
    const { data, error } = await supabase
      .from('usage_patterns')
      .insert({
        battery_id: pattern.batteryId,
        charging_frequency: pattern.chargingFrequency,
        discharge_depth: pattern.dischargeDepth,
        charge_duration: pattern.chargeDuration,
        operating_temperature: pattern.operatingTemperature,
        last_updated: pattern.lastUpdated.toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      batteryId: data.battery_id,
      chargingFrequency: data.charging_frequency,
      dischargeDepth: data.discharge_depth,
      chargeDuration: data.charge_duration,
      operatingTemperature: data.operating_temperature,
      lastUpdated: new Date(data.last_updated)
    };
  }

  async updateUsagePattern(id: number, pattern: Partial<InsertUsagePattern>): Promise<UsagePattern | undefined> {
    // Prepare the update data with snake_case keys
    const updateData: any = {};
    
    if (pattern.batteryId !== undefined) updateData.battery_id = pattern.batteryId;
    if (pattern.chargingFrequency !== undefined) updateData.charging_frequency = pattern.chargingFrequency;
    if (pattern.dischargeDepth !== undefined) updateData.discharge_depth = pattern.dischargeDepth;
    if (pattern.chargeDuration !== undefined) updateData.charge_duration = pattern.chargeDuration;
    if (pattern.operatingTemperature !== undefined) updateData.operating_temperature = pattern.operatingTemperature;
    if (pattern.lastUpdated !== undefined) updateData.last_updated = pattern.lastUpdated.toISOString();
    
    const { data, error } = await supabase
      .from('usage_patterns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      batteryId: data.battery_id,
      chargingFrequency: data.charging_frequency,
      dischargeDepth: data.discharge_depth,
      chargeDuration: data.charge_duration,
      operatingTemperature: data.operating_temperature,
      lastUpdated: new Date(data.last_updated)
    };
  }

  // Recommendation methods
  async getRecommendations(batteryId: number): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('battery_id', batteryId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      batteryId: item.battery_id,
      type: item.type,
      message: item.message,
      createdAt: new Date(item.created_at),
      resolved: item.resolved
    }));
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        battery_id: recommendation.batteryId,
        type: recommendation.type,
        message: recommendation.message,
        created_at: recommendation.createdAt.toISOString(),
        resolved: recommendation.resolved || false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      batteryId: data.battery_id,
      type: data.type,
      message: data.message,
      createdAt: new Date(data.created_at),
      resolved: data.resolved
    };
  }

  async updateRecommendation(id: number, resolved: boolean): Promise<Recommendation | undefined> {
    const { data, error } = await supabase
      .from('recommendations')
      .update({ resolved })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      batteryId: data.battery_id,
      type: data.type,
      message: data.message,
      createdAt: new Date(data.created_at),
      resolved: data.resolved
    };
  }
}