import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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
  return num.toLocaleString(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/**
 * Returns tailwind class for battery health status color
 */
export function getHealthStatusColor(health: number): string {
  if (health > 70) return 'text-green-600 dark:text-green-400';
  if (health > 30) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

/**
 * Returns descriptive text for battery health
 */
export function getHealthStatusText(health: number): string {
  if (health > 90) return 'Excellent';
  if (health > 70) return 'Good';
  if (health > 50) return 'Fair';
  if (health > 30) return 'Poor';
  return 'Critical';
}

/**
 * Calculates degradation percentage between initial and current health
 */
export function calculateDegradation(initialHealth: number, currentHealth: number): number {
  if (initialHealth <= 0) return 0;
  const degradation = ((initialHealth - currentHealth) / initialHealth) * 100;
  return Math.max(0, Math.min(100, degradation));
}

/**
 * Formats a date as 'Month Day' (e.g., Jan 15)
 */
export function formatDateToMonthDay(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d');
}

/**
 * Formats a date with time (e.g., Jan 15, 2025 14:30)
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d, yyyy HH:mm');
}

/**
 * Create linear array of dates for history charting
 */
export function generateDateRange(startDate: Date, days: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate contrasting colors for charts
 */
export function generateChartColors(index: number): {
  strokeColor: string;
  fillColor: string;
} {
  // Array of color pairs (stroke, fill)
  const colorPairs = [
    { strokeColor: '#6366f1', fillColor: 'rgba(99, 102, 241, 0.2)' }, // Indigo
    { strokeColor: '#8b5cf6', fillColor: 'rgba(139, 92, 246, 0.2)' }, // Purple
    { strokeColor: '#ec4899', fillColor: 'rgba(236, 72, 153, 0.2)' }, // Pink
    { strokeColor: '#14b8a6', fillColor: 'rgba(20, 184, 166, 0.2)' }, // Teal
    { strokeColor: '#f97316', fillColor: 'rgba(249, 115, 22, 0.2)' }, // Orange
    { strokeColor: '#06b6d4', fillColor: 'rgba(6, 182, 212, 0.2)' }, // Cyan
    { strokeColor: '#22c55e', fillColor: 'rgba(34, 197, 94, 0.2)' }, // Green
  ];

  // Use modulo to cycle through colors
  const colorIndex = index % colorPairs.length;
  return colorPairs[colorIndex];
}