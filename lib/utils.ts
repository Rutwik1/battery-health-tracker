import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 0
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getBatteryStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'excellent':
      return 'text-green-500'
    case 'good':
      return 'text-emerald-500'
    case 'fair':
      return 'text-amber-500'
    case 'poor':
      return 'text-red-500'
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
  if (percentage >= 85) return 'bg-green-500'
  if (percentage >= 70) return 'bg-emerald-500'
  if (percentage >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getTrendIcon(value: number): string {
  if (value > 0) return '↗'
  if (value < 0) return '↘'
  return '→'
}

export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  if (isPositiveTrend) {
    if (value > 0) return 'text-green-500'
    if (value < 0) return 'text-red-500'
  } else {
    if (value > 0) return 'text-red-500' 
    if (value < 0) return 'text-green-500'
  }
  return 'text-gray-500'
}

export function calculateRemainingCycles(cycleCount: number, expectedCycles: number): number {
  return Math.max(0, expectedCycles - cycleCount)
}