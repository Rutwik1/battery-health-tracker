import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date, formatStr: string = "MMM dd, yyyy") {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Get color based on battery health percentage
 */
export function getHealthColor(health: number) {
  if (health >= 90) return "text-success";
  if (health >= 80) return "text-success/90";
  if (health >= 70) return "text-warning";
  if (health >= 60) return "text-warning/90";
  return "text-danger";
}

/**
 * Get status badge color based on battery status
 */
export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "good":
      return "bg-success/20 text-success border-success/30";
    case "warning":
      return "bg-warning/20 text-warning border-warning/30";
    case "critical":
      return "bg-danger/20 text-danger border-danger/30";
    default:
      return "bg-muted/20 text-muted-foreground border-border/30";
  }
}

/**
 * Get the background gradient for battery cards based on status
 */
export function getBatteryCardGradient(status: string) {
  switch (status.toLowerCase()) {
    case "good":
      return "from-success/10 to-success/5";
    case "warning":
      return "from-warning/10 to-warning/5";
    case "critical":
      return "from-danger/10 to-danger/5";
    default:
      return "from-muted/10 to-muted/5";
  }
}

/**
 * Get color for recommendation types
 */
export function getRecommendationColor(type: string) {
  switch (type.toLowerCase()) {
    case "info":
      return "text-secondary";
    case "maintenance":
      return "text-primary";
    case "warning":
      return "text-warning";
    case "critical":
      return "text-danger";
    default:
      return "text-muted-foreground";
  }
}

/**
 * Get color for charts based on battery id (for consistent coloring)
 */
export function getChartColor(batteryId: number) {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--danger))",
  ];
  
  return colors[(batteryId - 1) % colors.length];
}