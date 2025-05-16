'use client';

import React from 'react';
import { Battery, BatteryCharging, BatteryWarning } from 'lucide-react';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  // Determine battery color based on percentage
  const getColor = () => {
    if (percentage >= 70) return 'text-primary';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };
  
  // Choose icon based on status
  const getBatteryIcon = () => {
    const color = getColor();
    const baseClasses = `h-10 w-10 ${color} ${className}`;
    
    if (status.toLowerCase().includes('charging')) {
      return <BatteryCharging className={baseClasses} />;
    } else if (status.toLowerCase().includes('warning') || status.toLowerCase().includes('critical')) {
      return <BatteryWarning className={baseClasses} />;
    } else {
      return <Battery className={baseClasses} />;
    }
  };
  
  return (
    <div className="relative flex items-center justify-center">
      {getBatteryIcon()}
      <div className="absolute mt-1 text-xs font-semibold">
        {percentage}%
      </div>
    </div>
  );
}