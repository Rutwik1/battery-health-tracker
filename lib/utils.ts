import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns color based on battery status
 */
export function getBatteryStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'optimal':
      return 'text-success'
    case 'good':
      return 'text-primary'
    case 'warning':
      return 'text-warning'
    case 'critical':
      return 'text-danger'
    default:
      return 'text-muted-foreground'
  }
}