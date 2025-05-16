import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistance, format, parseISO } from 'date-fns'

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
      return 'text-destructive'
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
  healthPercentage: number,
  degradationRate: number
): number {
  // Calculate how many months until the battery reaches 60% health (considered end of life)
  // If the battery is already below 60%, return 0
  if (healthPercentage <= 60) return 0
  
  // Calculate remaining health percentage until 60%
  const remainingHealth = healthPercentage - 60
  
  // Calculate months based on degradation rate
  const monthsRemaining = Math.ceil(remainingHealth / degradationRate)
  
  return monthsRemaining
}

/**
 * Format date to relative time (e.g., "2 days ago", "1 month ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateToFormat = typeof date === 'string' ? parseISO(date) : date
    return formatDistance(dateToFormat, new Date(), { addSuffix: true })
  } catch (error) {
    console.error('Error formatting relative time:', error)
    return 'Invalid date'
  }
}

/**
 * Format date to specific format
 */
export function formatDate(date: string | Date, formatString: string = 'MMM dd, yyyy'): string {
  try {
    const dateToFormat = typeof date === 'string' ? parseISO(date) : date
    return format(dateToFormat, formatString)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
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
  return text.substring(0, maxLength) + '...'
}