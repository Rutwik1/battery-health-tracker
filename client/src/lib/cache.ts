// Enhanced cache utility with offline support
import type { Battery } from "@shared/schema";

// Cache keys
const BATTERY_DATA_KEY = 'batteryHealthData';
const BATTERY_TIMESTAMP_KEY = 'batteryDataTimestamp';
const LAST_FETCH_SUCCESS_KEY = 'lastFetchSuccess';

// Cache expiration (15 minutes in milliseconds)
const CACHE_EXPIRY = 15 * 60 * 1000;

// Cache version - increment this when cache structure changes
const CACHE_VERSION = 'v1';

/**
 * Save data to localStorage with timestamp and versioning
 */
export function saveToCache(key: string, data: any): void {
  try {
    const cacheItem = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(`${key}_${CACHE_VERSION}`, JSON.stringify(cacheItem));
    localStorage.setItem(BATTERY_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error(`Error saving data to cache (${key}):`, error);
  }
}

/**
 * Get data from localStorage if it's still fresh
 */
export function getFromCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${key}_${CACHE_VERSION}`);
    if (!cached) return null;
    
    const { timestamp, data, version } = JSON.parse(cached);
    
    // Version check
    if (version !== CACHE_VERSION) return null;
    
    // Check if cache is expired
    const isExpired = (Date.now() - timestamp) > CACHE_EXPIRY;
    
    // If in Replit environment or similar, extend expiry time
    const isReplitEnv = typeof window !== 'undefined' && 
      window.location.hostname.includes('replit.dev');
    
    // Use longer expiry for replit environment to ensure data availability
    const shouldUseCache = isReplitEnv || !isExpired;
    
    return shouldUseCache ? data : null;
  } catch (error) {
    console.error(`Error retrieving data from cache (${key}):`, error);
    return null;
  }
}

/**
 * Mark last fetch as successful
 */
export function markFetchSuccess(): void {
  try {
    localStorage.setItem(LAST_FETCH_SUCCESS_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error marking fetch success:', error);
  }
}

/**
 * Check if recent fetch was successful
 */
export function wasRecentFetchSuccessful(): boolean {
  try {
    const lastSuccess = localStorage.getItem(LAST_FETCH_SUCCESS_KEY);
    if (!lastSuccess) return false;
    
    // Consider recent if within last 30 seconds
    return (Date.now() - parseInt(lastSuccess)) < 30000;
  } catch {
    return false;
  }
}

/**
 * Save battery data to cache
 */
export function saveBatteryData(data: Battery[]): void {
  if (!data || data.length === 0) return;
  
  saveToCache(BATTERY_DATA_KEY, data);
  markFetchSuccess();
  
  console.log(`Cached ${data.length} batteries to localStorage`);
}

/**
 * Get battery data from cache with improved offline support
 */
export function getBatteryData<T extends Battery[]>(): T | null {
  const data = getFromCache<T>(BATTERY_DATA_KEY);
  
  // Log cache status
  if (data) {
    console.log(`Using cached data with ${data.length} batteries from localStorage`);
  } else {
    console.log('No valid battery cache found');
  }
  
  return data;
}

/**
 * Check if cache is fresh enough for immediate display
 */
export function isCacheFreshEnough(): boolean {
  try {
    const timestamp = localStorage.getItem(BATTERY_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    // Cache is fresh if updated in the last 5 minutes
    return (Date.now() - parseInt(timestamp)) < (5 * 60 * 1000);
  } catch {
    return false;
  }
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  try {
    // Only clear our versioned cache keys
    Object.keys(localStorage).forEach(key => {
      if (key.includes(CACHE_VERSION) || 
          key === BATTERY_TIMESTAMP_KEY || 
          key === LAST_FETCH_SUCCESS_KEY) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
