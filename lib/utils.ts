import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getBatteryStatusColor(status: string) {
  const statusColors = {
    'Excellent': 'bg-green-500 text-green-50',
    'Good': 'bg-blue-500 text-blue-50',
    'Fair': 'bg-yellow-500 text-yellow-50',
    'Poor': 'bg-red-500 text-red-50',
    'Critical': 'bg-red-700 text-red-50',
  }
  
  return statusColors[status as keyof typeof statusColors] || 'bg-gray-500 text-gray-50'
}

export function getBatteryHealthStatus(percentage: number): string {
  if (percentage >= 85) return 'Excellent'
  if (percentage >= 70) return 'Good'
  if (percentage >= 50) return 'Fair'
  if (percentage >= 30) return 'Poor'
  return 'Critical'
}

export function getProgressColorClass(percentage: number): string {
  if (percentage >= 85) return 'bg-gradient-to-r from-green-500 to-green-400'
  if (percentage >= 70) return 'bg-gradient-to-r from-blue-500 to-blue-400'
  if (percentage >= 50) return 'bg-gradient-to-r from-yellow-500 to-yellow-400'
  if (percentage >= 30) return 'bg-gradient-to-r from-orange-500 to-orange-400'
  return 'bg-gradient-to-r from-red-500 to-red-400'
}

export function getTrendIcon(value: number): string {
  if (value > 0) return '↑'
  if (value < 0) return '↓'
  return '→'
}

export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  // For metrics like degradation rate, lower is better (isPositiveTrend = false)
  // For metrics like capacity, higher is better (isPositiveTrend = true)
  if ((value > 0 && isPositiveTrend) || (value < 0 && !isPositiveTrend)) {
    return 'text-green-500'
  }
  if ((value < 0 && isPositiveTrend) || (value > 0 && !isPositiveTrend)) {
    return 'text-red-500'
  }
  return 'text-blue-500'
}

export function calculateRemainingCycles(cycleCount: number, expectedCycles: number): number {
  return Math.max(0, expectedCycles - cycleCount)
}