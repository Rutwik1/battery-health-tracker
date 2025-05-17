import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBatteryStatusColor(status: string) {
  switch (status) {
    case "Excellent":
      return "text-success";
    case "Good":
      return "text-primary";
    case "Fair":
      return "text-warning";
    case "Poor":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function calculateRemainingCycles(current: number, expected: number): number {
  return Math.max(0, expected - current);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

export function getBatteryHealthCategory(percentage: number): string {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Good";
  if (percentage >= 50) return "Fair";
  return "Poor";
}

export function getMonthsBetweenDates(startDate: Date, endDate: Date): number {
  return (
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth()
  );
}

// Generate colors from battery status with opacity
export function getStatusColorWithOpacity(status: string, opacity: number = 1): string {
  const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
  
  switch (status) {
    case "Excellent":
      return `#10b981${opacityHex}`; // Green
    case "Good":
      return `#6366f1${opacityHex}`; // Indigo
    case "Fair":
      return `#f59e0b${opacityHex}`; // Amber
    case "Poor":
      return `#ef4444${opacityHex}`; // Red
    default:
      return `#6b7280${opacityHex}`; // Gray
  }
}