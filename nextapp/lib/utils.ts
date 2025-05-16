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
  return num.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
}

/**
 * Returns tailwind class for battery health status color
 */
export function getHealthStatusColor(health: number): string {
  if (health >= 75) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  } else if (health >= 50) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
  } else if (health >= 30) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
  } else {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  }
}

/**
 * Returns descriptive text for battery health
 */
export function getHealthStatusText(health: number): string {
  if (health >= 75) {
    return "Excellent";
  } else if (health >= 50) {
    return "Good";
  } else if (health >= 30) {
    return "Fair";
  } else {
    return "Poor";
  }
}

/**
 * Calculates degradation percentage between initial and current health
 */
export function calculateDegradation(initialHealth: number, currentHealth: number): number {
  return (initialHealth - currentHealth) / initialHealth * 100;
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
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generate contrasting colors for charts
 */
export function generateChartColors(index: number): {
  stroke: string;
  fill: string;
} {
  const colorSets = [
    { stroke: '#4f46e5', fill: 'rgba(79, 70, 229, 0.2)' }, // Indigo
    { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.2)' }, // Cyan
    { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.2)' }, // Pink
    { stroke: '#16a34a', fill: 'rgba(22, 163, 74, 0.2)' }, // Green
    { stroke: '#ca8a04', fill: 'rgba(202, 138, 4, 0.2)' }, // Yellow
    { stroke: '#9333ea', fill: 'rgba(147, 51, 234, 0.2)' }, // Purple
    { stroke: '#dc2626', fill: 'rgba(220, 38, 38, 0.2)' }  // Red
  ];
  
  return colorSets[index % colorSets.length];
}