import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

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
  if (health >= 80) return 'text-green-500';
  if (health >= 60) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Returns descriptive text for battery health
 */
export function getHealthStatusText(health: number) {
  if (health >= 90) return 'Excellent';
  if (health >= 80) return 'Good';
  if (health >= 60) return 'Fair';
  if (health >= 40) return 'Poor';
  return 'Critical';
}

/**
 * Calculates degradation percentage between initial and current health
 */
export function calculateDegradation(initialHealth: number, currentHealth: number) {
  return Math.round(((initialHealth - currentHealth) / initialHealth) * 100);
}

/**
 * Formats a date as 'Month Day' (e.g., Jan 15)
 */
export function formatDateToMonthDay(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d');
}

/**
 * Formats a date with time (e.g., Jan 15, 2025 14:30)
 */
export function formatDateTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy HH:mm');
}