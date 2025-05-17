import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a color based on battery status
 */
export function getBatteryStatusColor(status: string) {
  const colors = {
    Excellent: "bg-success text-success-foreground",
    Good: "bg-primary text-primary-foreground",
    Fair: "bg-warning text-warning-foreground",
    Poor: "bg-destructive text-destructive-foreground",
  };
  return colors[status as keyof typeof colors] || "bg-muted text-muted-foreground";
}

/**
 * Formats a number with thousands separators
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Calculates remaining cycles based on current and expected cycles
 */
export function calculateRemainingCycles(current: number, expected: number): number {
  return Math.max(0, expected - current);
}

/**
 * Formats a date to a readable string 
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Calculates a percentage value 
 */
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Truncates text to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Returns a battery health category based on percentage
 */
export function getBatteryHealthCategory(percentage: number): string {
  if (percentage >= 80) return "Excellent";
  if (percentage >= 60) return "Good";
  if (percentage >= 40) return "Fair";
  return "Poor";
}

/**
 * Calculates months between two dates
 */
export function getMonthsBetweenDates(startDate: Date, endDate: Date): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth()
  );
}

/**
 * Returns color for battery status with opacity
 */
export function getStatusColorWithOpacity(status: string, opacity: number = 1): string {
  const colors = {
    Excellent: `rgba(22, 163, 74, ${opacity})`, // success/green
    Good: `rgba(59, 130, 246, ${opacity})`,     // primary/blue
    Fair: `rgba(245, 158, 11, ${opacity})`,     // warning/amber
    Poor: `rgba(220, 38, 38, ${opacity})`,      // destructive/red
  };
  return colors[status as keyof typeof colors] || `rgba(100, 116, 139, ${opacity})`;
}