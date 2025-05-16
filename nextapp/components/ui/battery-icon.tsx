import React from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  // Determine color based on status or percentage
  const getColor = () => {
    if (status === 'Critical') return 'text-danger';
    if (status === 'Warning') return 'text-warning';
    
    // If no specific status, base it on percentage
    if (percentage < 20) return 'text-danger';
    if (percentage < 50) return 'text-warning';
    return 'text-success';
  };

  // Calculate fill level
  const fillLevel = Math.max(0, Math.min(100, percentage));
  const fillHeight = `${fillLevel}%`;
  
  return (
    <div className={cn("relative w-8 h-12 flex items-end", getColor(), className)}>
      {/* Battery Body */}
      <div className="w-full h-11 border-2 rounded-md overflow-hidden flex flex-col justify-end">
        {/* Fill level */}
        <div 
          className={cn(
            "w-full transition-all duration-500 ease-out",
            status === 'Critical' ? 'bg-danger/80' : 
            status === 'Warning' ? 'bg-warning/80' : 
            'bg-success/80'
          )} 
          style={{ height: fillHeight }}
        />
      </div>
      
      {/* Battery tip */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-1 rounded-t-sm border-2 border-b-0" />
      
      {/* Glowing effect for active batteries */}
      {status === 'Active' && (
        <div className="absolute inset-0 opacity-50 blur-sm bg-success rounded-md -z-10" />
      )}
    </div>
  );
}