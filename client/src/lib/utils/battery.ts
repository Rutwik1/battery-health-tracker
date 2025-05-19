// Utility functions for battery-related operations


export function getBatteryStatusColor(status: string | undefined | null): string {
  if (!status) return 'text-neutral'; // Default color for undefined/null status

  switch (status.toLowerCase()) {
    case 'excellent':
      return 'text-success';
    case 'good':
      return 'text-success';
    case 'fair':
      return 'text-warning';
    case 'poor':
      return 'text-danger';
    default:
      return 'text-neutral';
  }
}

/**
 * Determine battery status based on health percentage
 */
export function getBatteryStatus(healthPercentage: number): string {
  if (healthPercentage >= 90) {
    return 'Excellent';
  } else if (healthPercentage >= 80) {
    return 'Good';
  } else if (healthPercentage >= 60) {
    return 'Fair';
  } else {
    return 'Poor';
  }
}

/**
 * Calculate estimated months remaining before battery reaches end-of-life
 */
export function calculateRemainingMonths(
  healthPercentage: number,
  degradationRate: number,
  minimumHealth: number = 60
): number {
  if (degradationRate <= 0) return 999; // Avoid division by zero
  if (healthPercentage <= minimumHealth) return 0;

  return Math.ceil((healthPercentage - minimumHealth) / degradationRate);
}

/**
 * Format a time duration (minutes) as a human-readable string
 */
export function formatChargeDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} minutes`;
  } else if (mins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }
}