import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, precision = 0) {
  return num.toFixed(precision);
}

export function getHealthStatusColor(health: number) {
  if (health >= 85) return "text-success";
  if (health >= 70) return "text-warning";
  return "text-danger";
}

export function getHealthStatusText(health: number) {
  if (health >= 85) return "Good";
  if (health >= 70) return "Fair";
  return "Poor";
}

export function calculateDegradation(initialHealth: number, currentHealth: number) {
  return Math.max(0, initialHealth - currentHealth).toFixed(1);
}

export function formatDateToMonthDay(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatDateTime(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}