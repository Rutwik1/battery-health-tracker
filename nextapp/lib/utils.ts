import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas and specified precision
 */
export function formatNumber(num: number, precision = 0) {
  return num.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Returns tailwind class for battery health status color
 */
export function getHealthStatusColor(health: number) {
  if (health >= 80) return 'text-primary';
  if (health >= 50) return 'text-warning';
  return 'text-destructive';
}

/**
 * Returns descriptive text for battery health
 */
export function getHealthStatusText(health: number) {
  if (health >= 80) return 'Excellent';
  if (health >= 70) return 'Good';
  if (health >= 50) return 'Fair';
  if (health >= 30) return 'Poor';
  return 'Critical';
}

/**
 * Calculates degradation percentage between initial and current health
 */
export function calculateDegradation(initialHealth: number, currentHealth: number) {
  return ((initialHealth - currentHealth) / initialHealth) * 100;
}

/**
 * Formats a date as 'Month Day' (e.g., Jan 15)
 */
export function formatDateToMonthDay(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats a date with time (e.g., Jan 15, 2025 14:30)
 */
export function formatDateTime(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}