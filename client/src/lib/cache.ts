// A simpler cache utility to avoid type errors

// Cache keys
const BATTERY_DATA_KEY = 'batteryHealthData';

// Cache expiration (5 minutes in milliseconds)
const CACHE_EXPIRY = 5 * 60 * 1000;

/**
 * Save data to localStorage with timestamp
 */
export function saveToCache(key: string, data: any): void {
  try {
    const cacheItem = {
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error(`Error saving data to cache (${key}):`, error);
  }
}

/**
 * Get data from localStorage if it's still fresh
 */
export function getFromCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { timestamp, data } = JSON.parse(cached);
    const isExpired = (Date.now() - timestamp) > CACHE_EXPIRY;
    
    return isExpired ? null : data;
  } catch (error) {
    console.error(`Error retrieving data from cache (${key}):`, error);
    return null;
  }
}

/**
 * Save battery data to cache
 */
export function saveBatteryData(data: any[]): void {
  saveToCache(BATTERY_DATA_KEY, data);
}

/**
 * Get battery data from cache
 */
export function getBatteryData<T>(): T | null {
  return getFromCache<T>(BATTERY_DATA_KEY);
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
