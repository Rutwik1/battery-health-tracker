// Storage utility functions for caching battery data

// Type definitions
import type { Battery } from "@shared/schema";

// Storage keys
const BATTERY_DATA_KEY = 'batteryData';
const BATTERY_HISTORY_PREFIX = 'batteryHistory_';

// Cache expiration time (5 minutes in milliseconds)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Interface for cached data with timestamp
interface CachedData<T> {
  timestamp: number;
  data: T;
}

/**
 * Save battery data to localStorage with timestamp
 */
export const saveBatteryData = (batteries: Battery[]): void => {
  const cachedData: CachedData<Battery[]> = {
    timestamp: Date.now(),
    data: batteries
  };
  try {
    localStorage.setItem(BATTERY_DATA_KEY, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Error saving battery data to localStorage:', error);
  }
};

/**
 * Load cached battery data from localStorage if available and recent
 */
export const loadCachedBatteryData = (): Battery[] | null => {
  try {
    const cached = localStorage.getItem(BATTERY_DATA_KEY);
    if (!cached) return null;
    
    const parsedData = JSON.parse(cached) as CachedData<Battery[]>;
    
    // Check if data is still fresh (less than CACHE_EXPIRY ms old)
    const isRecent = (Date.now() - parsedData.timestamp) < CACHE_EXPIRY;
    
    return isRecent ? parsedData.data : null;
  } catch (error) {
    console.error('Error loading battery data from localStorage:', error);
    return null;
  }
};

/**
 * Save battery history data for a specific battery
 */
export const saveBatteryHistoryData = (batteryId: number, historyData: any[]): void => {
  const cachedData: CachedData<any[]> = {
    timestamp: Date.now(),
    data: historyData
  };
  try {
    localStorage.setItem(`${BATTERY_HISTORY_PREFIX}${batteryId}`, JSON.stringify(cachedData));
  } catch (error) {
    console.error(`Error saving history data for battery ${batteryId} to localStorage:`, error);
  }
};

/**
 * Load cached history data for a specific battery
 */
export const loadCachedBatteryHistoryData = (batteryId: number): any[] | null => {
  try {
    const cached = localStorage.getItem(`${BATTERY_HISTORY_PREFIX}${batteryId}`);
    if (!cached) return null;
    
    const parsedData = JSON.parse(cached) as CachedData<any[]>;
    
    // Check if data is still fresh
    const isRecent = (Date.now() - parsedData.timestamp) < CACHE_EXPIRY;
    
    return isRecent ? parsedData.data : null;
  } catch (error) {
    console.error(`Error loading history data for battery ${batteryId} from localStorage:`, error);
    return null;
  }
};

/**
 * Clear all cached battery data
 */
export const clearCachedBatteryData = (): void => {
  try {
    localStorage.removeItem(BATTERY_DATA_KEY);
    // Also clear history data items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(BATTERY_HISTORY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing cached battery data:', error);
  }
};
