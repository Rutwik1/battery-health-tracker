import React from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Calculate fill level for the battery
  const fillWidth = `${safePercentage}%`;
  
  // Determine color based on battery health and status
  let fillColor = 'bg-success';
  if (safePercentage < 30) {
    fillColor = 'bg-destructive';
  } else if (safePercentage < 70) {
    fillColor = 'bg-warning';
  } else if (safePercentage < 90) {
    fillColor = 'bg-primary';
  }
  
  // Add animation if battery is charging
  const isCharging = status.toLowerCase().includes('charging');
  const fillAnimation = isCharging ? 'animate-pulse' : '';
  
  return (
    <div className={cn('relative w-12 h-20', className)}>
      {/* Battery outline */}
      <div className="absolute inset-0 border-2 border-muted-foreground/50 rounded-md">
        {/* Battery terminal */}
        <div className="absolute w-4 h-2 bg-muted-foreground/50 -top-2 left-1/2 transform -translate-x-1/2 rounded-t-sm" />
        
        {/* Battery fill */}
        <div 
          className={cn(
            'absolute bottom-0 left-0 right-0 transition-all duration-500 ease-in-out',
            fillColor,
            fillAnimation
          )}
          style={{ 
            height: fillWidth,
            borderTopLeftRadius: safePercentage < 95 ? '0.25rem' : '0',
            borderTopRightRadius: safePercentage < 95 ? '0.25rem' : '0',
          }}
        />
        
        {/* Battery percentage display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground/90">
            {Math.round(safePercentage)}%
          </span>
        </div>
        
        {/* Charging indicator */}
        {isCharging && (
          <div className="absolute top-1 right-1">
            <div className="text-warning text-xs">⚡</div>
          </div>
        )}
      </div>
    </div>
  );
}