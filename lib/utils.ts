import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a number with thousands separators and adds a k/M suffix for large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toLocaleString();
  }
}

// Formats a date to a readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Gets the appropriate color for a battery status
export function getBatteryStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'excellent':
      return 'bg-gradient-to-r from-emerald-500 to-emerald-700';
    case 'good':
      return 'bg-gradient-to-r from-blue-500 to-blue-700';
    case 'fair':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-700';
    case 'poor':
      return 'bg-gradient-to-r from-red-500 to-red-700';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-700';
  }
}

// Gets a battery health status based on percentage
export function getBatteryHealthStatus(percentage: number): string {
  if (percentage >= 85) return 'Excellent';
  if (percentage >= 70) return 'Good';
  if (percentage >= 50) return 'Fair';
  return 'Poor';
}

// Gets a color class for the progress bar based on percentage
export function getProgressColorClass(percentage: number): string {
  if (percentage >= 85) return 'bg-gradient-to-r from-emerald-500 to-emerald-700';
  if (percentage >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-700';
  if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-700';
  return 'bg-gradient-to-r from-red-500 to-red-700';
}

// Gets an icon string for a trend
export function getTrendIcon(value: number): string {
  if (value > 0) return '↗︎';
  if (value < 0) return '↘︎';
  return '→';
}

// Gets a color class for a trend value (e.g., red for negative degradation)
export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  if (value === 0) return 'text-gray-500';
  
  // If positive numbers are good (e.g. improvement)
  if (isPositiveTrend) {
    return value > 0 ? 'text-emerald-500' : 'text-red-500';
  }
  // If negative numbers are good (e.g. reduced degradation)
  else {
    return value < 0 ? 'text-emerald-500' : 'text-red-500';
  }
}

// Calculates remaining cycles for a battery
export function calculateRemainingCycles(cycleCount: number, expectedCycles: number): number {
  return Math.max(0, expectedCycles - cycleCount);
}