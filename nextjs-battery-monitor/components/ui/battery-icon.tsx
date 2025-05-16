'use client';

import { getBatteryStatusColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  // Ensure percentage is between 0-100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Get the fill width based on percentage
  const fillWidth = `${safePercentage}%`;
  
  // Get the color class based on status
  const colorClass = getBatteryStatusColor(status);
  
  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Battery outline */}
      <svg
        viewBox="0 0 24 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Battery body */}
        <rect
          x="2"
          y="8"
          width="20"
          height="36"
          rx="3"
          strokeWidth="2"
          className="stroke-border"
        />
        
        {/* Battery terminal */}
        <rect
          x="8"
          y="4"
          width="8"
          height="4"
          rx="1"
          strokeWidth="2"
          className="stroke-border"
        />
        
        {/* Battery fill */}
        <rect
          x="4"
          y="10"
          width="16"
          height="32"
          rx="1.5"
          className={cn('opacity-20', colorClass)}
        />
        
        {/* Dynamic fill based on percentage */}
        <rect
          x="4"
          y={`${42 - (safePercentage * 32 / 100)}`}
          width="16"
          height={`${safePercentage * 32 / 100}`}
          rx="1.5"
          className={colorClass}
        />
      </svg>
      
      {/* Battery percentage label */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
        <span className="text-foreground">{Math.round(safePercentage)}%</span>
      </div>
    </div>
  );
}