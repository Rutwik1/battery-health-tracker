import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getBatteryStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "excellent":
      return "bg-success text-success-foreground";
    case "good":
      return "bg-primary text-primary-foreground";
    case "fair":
      return "bg-warning text-warning-foreground";
    case "poor":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

export function getBatteryHealthStatus(percentage: number): string {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 75) return "Good";
  if (percentage >= 60) return "Fair";
  return "Poor";
}

export function getProgressColorClass(percentage: number): string {
  if (percentage >= 90) return "battery-progress-excellent";
  if (percentage >= 75) return "battery-progress-good";
  if (percentage >= 60) return "battery-progress-fair";
  return "battery-progress-poor";
}

export function getTrendIcon(value: number): string {
  if (value > 0) return "↑";
  if (value < 0) return "↓";
  return "→";
}

export function getTrendColorClass(value: number, isPositiveTrend: boolean = true): string {
  // For metrics where positive changes are good (capacity, health)
  if (isPositiveTrend) {
    if (value > 0) return "text-success";
    if (value < 0) return "text-destructive";
    return "text-muted-foreground";
  } 
  // For metrics where negative changes are good (degradation rate)
  else {
    if (value < 0) return "text-success";
    if (value > 0) return "text-destructive";
    return "text-muted-foreground";
  }
}