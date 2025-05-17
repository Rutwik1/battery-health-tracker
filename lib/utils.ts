import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS using clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with commas for thousands
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/**
 * Formats a date to a human-readable string (e.g. Jan 15, 2023)
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns a CSS color class based on battery status
 */
export function getBatteryStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "excellent":
      return "text-emerald-500";
    case "good":
      return "text-green-500";
    case "fair":
      return "text-amber-500";
    case "poor":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Calculates the battery health status based on percentage
 */
export function getBatteryHealthStatus(percentage: number): string {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Good";
  if (percentage >= 50) return "Fair";
  return "Poor";
}

/**
 * Returns a CSS color class based on percentage value
 */
export function getProgressColorClass(percentage: number): string {
  if (percentage >= 90) return "bg-emerald-500";
  if (percentage >= 75) return "bg-green-500";
  if (percentage >= 50) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Returns an icon name based on trend direction
 */
export function getTrendIcon(value: number): string {
  if (value > 0) return "trending-up";
  if (value < 0) return "trending-down";
  return "minus";
}

/**
 * Returns a CSS color class based on trend direction and whether positive is good
 */
export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  if (value === 0) return "text-gray-500";
  
  // If positive numbers are good (e.g., capacity increase)
  if (isPositiveTrend) {
    return value > 0 ? "text-emerald-500" : "text-red-500";
  } 
  // If negative numbers are good (e.g., degradation rate decrease)
  else {
    return value < 0 ? "text-emerald-500" : "text-red-500";
  }
}

/**
 * Calculates remaining cycles for a battery
 */
export function calculateRemainingCycles(cycleCount: number, expectedCycles: number): number {
  return Math.max(0, expectedCycles - cycleCount);
}