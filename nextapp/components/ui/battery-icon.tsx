'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  // Calculate the color based on battery health percentage
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500 shadow-green-500/40';
    if (percentage >= 60) return 'bg-amber-500 shadow-amber-500/40';
    return 'bg-red-500 shadow-red-500/40';
  };

  // Get visual animation based on battery status
  const getAnimation = () => {
    if (status === 'charging') return 'animate-pulse';
    if (status === 'discharging' && percentage < 20) return 'animate-pulse';
    return '';
  };

  // Change opacity based on health to give visual cue
  const getOpacity = () => {
    return `opacity-${Math.max(Math.floor(percentage / 10), 3) * 10}`;
  };

  const color = getColor();
  const animation = getAnimation();

  return (
    <div className={cn("relative", className)}>
      {/* Battery body */}
      <div className="w-full h-full rounded-md border-2 border-foreground/40 bg-muted/20 flex flex-col-reverse p-0.5 overflow-hidden">
        {/* Battery fill level */}
        <div 
          className={cn(
            "w-full rounded transition-all duration-300 shadow-inner", 
            color,
            animation
          )}
          style={{ 
            height: `${percentage}%`,
            boxShadow: '0 0 10px 1px currentColor'
          }}
        />

        {/* Battery indicator dots */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="grid grid-cols-1 gap-3 w-[30%]">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className={cn(
                  "h-1 w-1 rounded-full mx-auto bg-foreground/40",
                  percentage >= 25 * i && "bg-background"
                )}
              />
            ))}
          </div>
        </div>

        {/* Battery terminal */}
        <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-1/4 h-1.5 bg-foreground/40 rounded-t-sm" />

        {/* Charging indicator */}
        {status === 'charging' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-background text-xl font-bold">⚡</div>
          </div>
        )}
      </div>
    </div>
  );
}