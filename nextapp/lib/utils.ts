import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

/**
 * Combines Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with commas and specified precision
 */
export function formatNumber(num: number, precision = 0) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  })
}

/**
 * Returns tailwind class for battery health status color
 */
export function getHealthStatusColor(health: number) {
  if (health >= 90) return "text-green-500"
  if (health >= 80) return "text-emerald-400"
  if (health >= 70) return "text-amber-400"
  if (health >= 60) return "text-orange-500"
  return "text-red-500"
}

/**
 * Returns descriptive text for battery health
 */
export function getHealthStatusText(health: number) {
  if (health >= 90) return "Excellent"
  if (health >= 80) return "Good"
  if (health >= 70) return "Fair"
  if (health >= 60) return "Poor"
  return "Critical"
}

/**
 * Calculates degradation percentage between initial and current health
 */
export function calculateDegradation(initialHealth: number, currentHealth: number) {
  return ((initialHealth - currentHealth) / initialHealth) * 100
}

/**
 * Formats a date as 'Month Day' (e.g., Jan 15)
 */
export function formatDateToMonthDay(date: Date | string) {
  return format(new Date(date), 'MMM d')
}

/**
 * Formats a date with time (e.g., Jan 15, 2025 14:30)
 */
export function formatDateTime(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}