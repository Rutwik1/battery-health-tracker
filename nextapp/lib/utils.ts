import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  if (health >= 90) return 'text-green-500';
  if (health >= 70) return 'text-emerald-400';
  if (health >= 50) return 'text-yellow-500';
  if (health >= 30) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Returns descriptive text for battery health
 */
export function getHealthStatusText(health: number): string {
  if (health >= 90) return 'Excellent';
  if (health >= 70) return 'Good';
  if (health >= 50) return 'Fair';
  if (health >= 30) return 'Poor';
  return 'Critical';
}

/**
 * Calculates degradation percentage between initial and current health
 */
export function calculateDegradation(initialHealth: number, currentHealth: number): number {
  return Math.max(0, ((initialHealth - currentHealth) / initialHealth) * 100);
}

/**
 * Formats a date as 'Month Day' (e.g., Jan 15)
 */
export function formatDateToMonthDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats a date with time (e.g., Jan 15, 2025 14:30)
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Create linear array of dates for history charting
 */
export function generateDateRange(startDate: Date, days: number): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
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
  stroke: string;
  fill: string;
} {
  // Array of vibrant colors for charts
  const colors = [
    { stroke: 'rgb(99, 102, 241)', fill: 'rgba(99, 102, 241, 0.1)' },   // Indigo
    { stroke: 'rgb(14, 165, 233)', fill: 'rgba(14, 165, 233, 0.1)' },   // Sky blue
    { stroke: 'rgb(249, 115, 22)', fill: 'rgba(249, 115, 22, 0.1)' },   // Orange
    { stroke: 'rgb(168, 85, 247)', fill: 'rgba(168, 85, 247, 0.1)' },   // Purple
    { stroke: 'rgb(236, 72, 153)', fill: 'rgba(236, 72, 153, 0.1)' },   // Pink
    { stroke: 'rgb(16, 185, 129)', fill: 'rgba(16, 185, 129, 0.1)' },   // Emerald
    { stroke: 'rgb(234, 179, 8)', fill: 'rgba(234, 179, 8, 0.1)' },     // Yellow
    { stroke: 'rgb(239, 68, 68)', fill: 'rgba(239, 68, 68, 0.1)' },     // Red
  ];
  
  return colors[index % colors.length];
}