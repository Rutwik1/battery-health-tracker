import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get appropriate text color based on battery status
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

// Get appropriate background color based on battery status
export function getBatteryStatusBgColor(status: string) {
  switch (status) {
    case 'Good':
      return 'bg-success/20';
    case 'Fair':
      return 'bg-warning/20';
    case 'Poor':
      return 'bg-destructive/20';
    case 'Critical':
      return 'bg-destructive/30';
    default:
      return 'bg-primary/20';
  }
}