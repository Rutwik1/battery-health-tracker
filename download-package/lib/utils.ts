import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get color based on battery status
export function getBatteryStatusColor(status: string) {
  switch (status) {
    case 'Good':
      return 'text-success';
    case 'Fair':
      return 'text-warning';
    case 'Poor':
      return 'text-destructive/80';
    case 'Critical':
      return 'text-destructive';
    default:
      return 'text-primary';
  }
}

// Utility function to get background color based on battery status
export function getBatteryStatusBgColor(status: string) {
  switch (status) {
    case 'Good':
      return 'bg-success/10';
    case 'Fair':
      return 'bg-warning/10';
    case 'Poor':
      return 'bg-destructive/10';
    case 'Critical':
      return 'bg-destructive/20';
    default:
      return 'bg-primary/10';
  }
}