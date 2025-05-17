import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Battery status color utility
export function getBatteryStatusColor(status: string) {
  switch (status) {
    case "Excellent":
      return "text-success";
    case "Good":
      return "text-primary";
    case "Fair":
      return "text-warning";
    case "Poor":
      return "text-danger";
    default:
      return "text-muted-foreground";
  }
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate remaining cycles
export function calculateRemainingCycles(current: number, expected: number): number {
  return Math.max(0, expected - current);
}

// Format date to display in a readable format
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(date).toLocaleDateString(undefined, options);
}

// Calculate percentage remaining
export function calculatePercentage(current: number, total: number): number {
  return Math.round((current / total) * 100);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}