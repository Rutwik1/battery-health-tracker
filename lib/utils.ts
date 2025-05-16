import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns color based on battery status
 */
export function getBatteryStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'healthy':
      return 'text-success'
    case 'good':
      return 'text-primary'
    case 'fair':
      return 'text-warning'
    case 'poor':
      return 'text-danger'
    default:
      return 'text-muted-foreground'
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Calculate remaining battery lifespan in months
 */
export function calculateRemainingLifespan(
  cycleCount: number, 
  expectedCycles: number,
  initialDate: string | Date
): number {
  const initialDateObj = new Date(initialDate)
  const now = new Date()
  
  // Calculate months elapsed
  const monthsElapsed = 
    (now.getFullYear() - initialDateObj.getFullYear()) * 12 + 
    (now.getMonth() - initialDateObj.getMonth())
  
  // If no months elapsed yet, return expected cycles directly
  if (monthsElapsed <= 0) return expectedCycles
  
  // Calculate average cycles per month
  const cyclesPerMonth = cycleCount / Math.max(1, monthsElapsed)
  
  // Calculate remaining cycles
  const remainingCycles = Math.max(0, expectedCycles - cycleCount)
  
  // Calculate remaining months
  return Math.max(0, Math.round(remainingCycles / cyclesPerMonth))
}

/**
 * Format date to relative time (e.g., "2 days ago", "1 month ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const pastDate = new Date(date)
  const diffMs = now.getTime() - pastDate.getTime()
  
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffMonths / 12)
  
  if (diffYears > 0) {
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`
  } else if (diffMonths > 0) {
    return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
  } else if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  } else if (diffMins > 0) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return 'just now'
  }
}