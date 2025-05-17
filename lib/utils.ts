import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
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
      return 'text-emerald-500'
    case 'good':
      return 'text-blue-500'
    case 'fair':
      return 'text-amber-500'
    case 'poor':
      return 'text-rose-500'
    default:
      return 'text-gray-500'
  }
}

export function getBatteryHealthStatus(percentage: number): string {
  if (percentage >= 85) return 'Excellent'
  if (percentage >= 70) return 'Good'
  if (percentage >= 50) return 'Fair'
  return 'Poor'
}

export function getProgressColorClass(percentage: number): string {
  if (percentage >= 85) return 'bg-emerald-500'
  if (percentage >= 70) return 'bg-blue-500'
  if (percentage >= 50) return 'bg-amber-500'
  return 'bg-rose-500'
}

export function getTrendIcon(value: number): string {
  if (value > 0) return '↑'
  if (value < 0) return '↓'
  return '→'
}

export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  if (value === 0) return 'text-gray-500'
  
  if (isPositiveTrend) {
    return value > 0 ? 'text-emerald-500' : 'text-rose-500'
  } else {
    return value > 0 ? 'text-rose-500' : 'text-emerald-500'
  }
}

export function calculateRemainingCycles(cycleCount: number, expectedCycles: number): number {
  return Math.max(0, expectedCycles - cycleCount)
}