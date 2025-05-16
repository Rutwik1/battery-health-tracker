import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistance } from "date-fns"

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
    case 'good':
      return 'text-success'
    case 'normal':
      return 'text-primary'
    case 'warning':
      return 'text-warning'
    case 'critical':
      return 'text-destructive'
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
  currentCycles: number,
  expectedCycles: number,
  cyclesPerMonth: number
): number {
  const remainingCycles = Math.max(0, expectedCycles - currentCycles)
  return Math.round(remainingCycles / cyclesPerMonth)
}

/**
 * Format date to relative time (e.g., "2 days ago", "1 month ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

/**
 * Format date to specific format
 */
export function formatDate(date: string | Date, formatString: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatString)
}

/**
 * Calculate percentage with optional decimal precision
 */
export function calculatePercentage(value: number, total: number, decimals: number = 0): number {
  if (total === 0) return 0
  const percentage = (value / total) * 100
  return Number(percentage.toFixed(decimals))
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}