import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

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
  switch (status) {
    case 'Healthy':
      return 'text-success'
    case 'Good':
      return 'text-primary'
    case 'Fair':
      return 'text-warning'
    case 'Poor':
      return 'text-danger'
    default:
      return 'text-muted-foreground'
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Calculate remaining battery lifespan in months
 */
export function calculateRemainingLifespan(
  currentHealth: number,
  degradationRate: number,
  minimumHealth: number = 80
): number {
  // If degradation rate is zero or negative, return a very high number (essentially infinity)
  if (degradationRate <= 0) return 999

  // Calculate how much health percentage points are left until minimum
  const healthLeft = currentHealth - minimumHealth

  // If already below minimum, return 0
  if (healthLeft <= 0) return 0

  // Calculate how many months it will take to reach minimum health
  const monthsLeft = Math.ceil(healthLeft / degradationRate)

  return monthsLeft
}

/**
 * Format date to relative time (e.g., "2 days ago", "1 month ago")
 */
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
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
  const factor = Math.pow(10, decimals)
  return Math.round(percentage * factor) / factor
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}