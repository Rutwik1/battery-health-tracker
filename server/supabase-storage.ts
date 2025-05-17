import { supabase } from './supabase';
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
} from '../shared/schema';
import { IStorage } from './storage';

/**
 * Implementation of the IStorage interface using Supabase
 */
export class SupabaseStorage implements IStorage {
  /**
   * Get a user by ID
   */
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    
    return data as User;
  }

  /**
   * Get a user by username
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }
    
    return data as User;
  }

  /**
   * Create a new user
   */
  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    
    return data as User;
  }

  /**
   * Get all batteries
   */
  async getBatteries(): Promise<Battery[]> {
    const { data, error } = await supabase
      .from('batteries')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) {
      console.error('Error fetching batteries:', error);
      throw new Error(`Failed to fetch batteries: ${error.message}`);
    }
    
    // Convert snake_case to camelCase
    return data.map(battery => {
      return {
        id: battery.id,
        name: battery.name,
        serialNumber: battery.serial_number,
        initialCapacity: battery.initial_capacity,
        currentCapacity: battery.current_capacity,
        healthPercentage: battery.health_percentage,
        cycleCount: battery.cycle_count,
        expectedCycles: battery.expected_cycles,
        status: battery.status,
        initialDate: new Date(battery.initial_date).toISOString(),
        lastUpdated: new Date(battery.last_updated).toISOString(),
        degradationRate: battery.degradation_rate
      } as Battery;
    });
  }

  /**
   * Get a single battery by ID
   */
  async getBattery(id: number): Promise<Battery | undefined> {
    const { data, error } = await supabase
      .from('batteries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching battery with ID ${id}:`, error);
      return undefined;
    }
    
    // Convert snake_case to camelCase
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
      initialDate: new Date(data.initial_date).toISOString(),
      lastUpdated: new Date(data.last_updated).toISOString(),
      degradationRate: data.degradation_rate
    } as Battery;
  }

  /**
   * Create a new battery
   */
  async createBattery(battery: InsertBattery): Promise<Battery> {
    // Convert camelCase to snake_case for Supabase
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
        initial_date: battery.initialDate,
        last_updated: battery.lastUpdated,
        degradation_rate: battery.degradationRate
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating battery:', error);
      throw new Error(`Failed to create battery: ${error.message}`);
    }
    
    // Convert back to camelCase for our application
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
      initialDate: new Date(data.initial_date).toISOString(),
      lastUpdated: new Date(data.last_updated).toISOString(),
      degradationRate: data.degradation_rate
    } as Battery;
  }

  /**
   * Update a battery
   */
  async updateBattery(id: number, battery: Partial<InsertBattery>): Promise<Battery | undefined> {
    // Create an object with snake_case keys for Supabase
    const updateData: Record<string, any> = {};
    
    if (battery.name !== undefined) updateData.name = battery.name;
    if (battery.serialNumber !== undefined) updateData.serial_number = battery.serialNumber;
    if (battery.initialCapacity !== undefined) updateData.initial_capacity = battery.initialCapacity;
    if (battery.currentCapacity !== undefined) updateData.current_capacity = battery.currentCapacity;
    if (battery.healthPercentage !== undefined) updateData.health_percentage = battery.healthPercentage;
    if (battery.cycleCount !== undefined) updateData.cycle_count = battery.cycleCount;
    if (battery.expectedCycles !== undefined) updateData.expected_cycles = battery.expectedCycles;
    if (battery.status !== undefined) updateData.status = battery.status;
    if (battery.initialDate !== undefined) updateData.initial_date = battery.initialDate;
    if (battery.lastUpdated !== undefined) updateData.last_updated = battery.lastUpdated;
    if (battery.degradationRate !== undefined) updateData.degradation_rate = battery.degradationRate;
    
    const { data, error } = await supabase
      .from('batteries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating battery with ID ${id}:`, error);
      return undefined;
    }
    
    // Convert back to camelCase for our application
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
      initialDate: new Date(data.initial_date).toISOString(),
      lastUpdated: new Date(data.last_updated).toISOString(),
      degradationRate: data.degradation_rate
    } as Battery;
  }

  /**
   * Delete a battery
   */
  async deleteBattery(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('batteries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting battery with ID ${id}:`, error);
      return false;
    }
    
    return true;
  }

  /**
   * Get battery history for a specific battery
   */
  async getBatteryHistory(batteryId: number): Promise<BatteryHistory[]> {
    const { data, error } = await supabase
      .from('battery_history')
      .select('*')
      .eq('battery_id', batteryId)
      .order('date', { ascending: true });
    
    if (error) {
      console.error(`Error fetching history for battery ${batteryId}:`, error);
      throw new Error(`Failed to fetch battery history: ${error.message}`);
    }
    
    // Convert snake_case to camelCase
    return data.map(history => {
      return {
        id: history.id,
        batteryId: history.battery_id,
        date: new Date(history.date).toISOString(),
        capacity: history.capacity,
        healthPercentage: history.health_percentage,
        cycleCount: history.cycle_count
      } as BatteryHistory;
    });
  }

  /**
   * Get filtered battery history
   */
  async getBatteryHistoryFiltered(batteryId: number, startDate: Date, endDate: Date): Promise<BatteryHistory[]> {
    const { data, error } = await supabase
      .from('battery_history')
      .select('*')
      .eq('battery_id', batteryId)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: true });
    
    if (error) {
      console.error(`Error fetching filtered history for battery ${batteryId}:`, error);
      throw new Error(`Failed to fetch filtered battery history: ${error.message}`);
    }
    
    // Convert snake_case to camelCase
    return data.map(history => {
      return {
        id: history.id,
        batteryId: history.battery_id,
        date: new Date(history.date).toISOString(),
        capacity: history.capacity,
        healthPercentage: history.health_percentage,
        cycleCount: history.cycle_count
      } as BatteryHistory;
    });
  }

  /**
   * Create a new battery history entry
   */
  async createBatteryHistory(history: InsertBatteryHistory): Promise<BatteryHistory> {
    const { data, error } = await supabase
      .from('battery_history')
      .insert({
        battery_id: history.batteryId,
        date: history.date,
        capacity: history.capacity,
        health_percentage: history.healthPercentage,
        cycle_count: history.cycleCount
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating battery history entry:', error);
      throw new Error(`Failed to create battery history: ${error.message}`);
    }
    
    // Convert back to camelCase for our application
    return {
      id: data.id,
      batteryId: data.battery_id,
      date: new Date(data.date).toISOString(),
      capacity: data.capacity,
      healthPercentage: data.health_percentage,
      cycleCount: data.cycle_count
    } as BatteryHistory;
  }

  /**
   * Get usage pattern for a specific battery
   */
  async getUsagePattern(batteryId: number): Promise<UsagePattern | undefined> {
    const { data, error } = await supabase
      .from('usage_patterns')
      .select('*')
      .eq('battery_id', batteryId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Code for "no rows returned"
        return undefined;
      }
      console.error(`Error fetching usage pattern for battery ${batteryId}:`, error);
      return undefined;
    }
    
    // Convert snake_case to camelCase
    return {
      id: data.id,
      batteryId: data.battery_id,
      chargingFrequency: data.charging_frequency,
      dischargeDepth: data.discharge_depth,
      chargeDuration: data.charge_duration,
      operatingTemperature: data.operating_temperature,
      lastUpdated: new Date(data.last_updated).toISOString()
    } as UsagePattern;
  }

  /**
   * Create a new usage pattern
   */
  async createUsagePattern(pattern: InsertUsagePattern): Promise<UsagePattern> {
    const { data, error } = await supabase
      .from('usage_patterns')
      .insert({
        battery_id: pattern.batteryId,
        charging_frequency: pattern.chargingFrequency,
        discharge_depth: pattern.dischargeDepth,
        charge_duration: pattern.chargeDuration,
        operating_temperature: pattern.operatingTemperature,
        last_updated: pattern.lastUpdated
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating usage pattern:', error);
      throw new Error(`Failed to create usage pattern: ${error.message}`);
    }
    
    // Convert back to camelCase for our application
    return {
      id: data.id,
      batteryId: data.battery_id,
      chargingFrequency: data.charging_frequency,
      dischargeDepth: data.discharge_depth,
      chargeDuration: data.charge_duration,
      operatingTemperature: data.operating_temperature,
      lastUpdated: new Date(data.last_updated).toISOString()
    } as UsagePattern;
  }

  /**
   * Update a usage pattern
   */
  async updateUsagePattern(id: number, pattern: Partial<InsertUsagePattern>): Promise<UsagePattern | undefined> {
    // Create an object with snake_case keys for Supabase
    const updateData: Record<string, any> = {};
    
    if (pattern.batteryId !== undefined) updateData.battery_id = pattern.batteryId;
    if (pattern.chargingFrequency !== undefined) updateData.charging_frequency = pattern.chargingFrequency;
    if (pattern.dischargeDepth !== undefined) updateData.discharge_depth = pattern.dischargeDepth;
    if (pattern.chargeDuration !== undefined) updateData.charge_duration = pattern.chargeDuration;
    if (pattern.operatingTemperature !== undefined) updateData.operating_temperature = pattern.operatingTemperature;
    if (pattern.lastUpdated !== undefined) updateData.last_updated = pattern.lastUpdated;
    
    const { data, error } = await supabase
      .from('usage_patterns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating usage pattern with ID ${id}:`, error);
      return undefined;
    }
    
    // Convert back to camelCase for our application
    return {
      id: data.id,
      batteryId: data.battery_id,
      chargingFrequency: data.charging_frequency,
      dischargeDepth: data.discharge_depth,
      chargeDuration: data.charge_duration,
      operatingTemperature: data.operating_temperature,
      lastUpdated: new Date(data.last_updated).toISOString()
    } as UsagePattern;
  }

  /**
   * Get recommendations for a specific battery
   */
  async getRecommendations(batteryId: number): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('battery_id', batteryId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching recommendations for battery ${batteryId}:`, error);
      throw new Error(`Failed to fetch recommendations: ${error.message}`);
    }
    
    // Convert snake_case to camelCase
    return data.map(rec => {
      return {
        id: rec.id,
        batteryId: rec.battery_id,
        type: rec.type,
        message: rec.message,
        createdAt: new Date(rec.created_at).toISOString(),
        resolved: rec.resolved
      } as Recommendation;
    });
  }

  /**
   * Create a new recommendation
   */
  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        battery_id: recommendation.batteryId,
        type: recommendation.type,
        message: recommendation.message,
        created_at: recommendation.createdAt,
        resolved: recommendation.resolved || false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating recommendation:', error);
      throw new Error(`Failed to create recommendation: ${error.message}`);
    }
    
    // Convert back to camelCase for our application
    return {
      id: data.id,
      batteryId: data.battery_id,
      type: data.type,
      message: data.message,
      createdAt: new Date(data.created_at).toISOString(),
      resolved: data.resolved
    } as Recommendation;
  }

  /**
   * Update a recommendation (mark as resolved)
   */
  async updateRecommendation(id: number, resolved: boolean): Promise<Recommendation | undefined> {
    const { data, error } = await supabase
      .from('recommendations')
      .update({ resolved })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating recommendation with ID ${id}:`, error);
      return undefined;
    }
    
    // Convert back to camelCase for our application
    return {
      id: data.id,
      batteryId: data.battery_id,
      type: data.type,
      message: data.message,
      createdAt: new Date(data.created_at).toISOString(),
      resolved: data.resolved
    } as Recommendation;
  }
}