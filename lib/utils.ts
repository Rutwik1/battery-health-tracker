import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export function getBatteryStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'excellent':
      return 'text-green-500'
    case 'good':
      return 'text-blue-500'
    case 'fair':
      return 'text-yellow-500'
    case 'poor':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getBatteryHealthStatus(percentage: number): string {
  if (percentage >= 90) return "Excellent"
  if (percentage >= 75) return "Good"
  if (percentage >= 60) return "Fair"
  return "Poor"
}

export function getProgressColorClass(percentage: number): string {
  if (percentage >= 90) return "bg-green-500"
  if (percentage >= 75) return "bg-blue-500"
  if (percentage >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export function getTrendIcon(value: number): string {
  if (value > 0) return "↗"
  if (value < 0) return "↘"
  return "→"
}

export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  if (isPositiveTrend) {
    // For metrics where higher is better (e.g., capacity)
    return value >= 0 ? "text-green-500" : "text-red-500"
  } else {
    // For metrics where lower is better (e.g., degradation)
    return value <= 0 ? "text-green-500" : "text-red-500"
  }
}

export function calculateRemainingCycles(cycleCount: number, expectedCycles: number): number {
  return Math.max(0, expectedCycles - cycleCount)
}