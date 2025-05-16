'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  // Calculate fill height based on percentage
  const fillHeight = Math.max(0, Math.min(100, percentage)) + '%';
  
  // Determine color based on percentage and status
  const getColor = () => {
    if (status.toLowerCase() === 'charging') return 'bg-blue-500';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-emerald-400';
    if (percentage >= 40) return 'bg-yellow-400';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Add glow effect for charging or critical status
  const getGlow = () => {
    if (status.toLowerCase() === 'charging') return 'animate-pulse shadow-lg shadow-blue-500/50';
    if (percentage <= 15) return 'animate-pulse shadow-lg shadow-red-500/50';
    return '';
  };

  return (
    <div className={cn("relative h-14 w-8 rounded-md border-2 border-gray-300 dark:border-gray-700 flex flex-col", className)}>
      {/* Battery tip */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-4 bg-gray-300 dark:bg-gray-700 rounded-t-sm" />
      
      {/* Battery fill container */}
      <div className="absolute bottom-0.5 left-0.5 right-0.5 top-0.5 bg-gray-100 dark:bg-gray-900 rounded-sm overflow-hidden">
        {/* Battery fill level */}
        <div 
          className={cn("absolute bottom-0 left-0 right-0 transition-all duration-500", getColor(), getGlow())}
          style={{ height: fillHeight }}
        />
        
        {/* Charging indicator */}
        {status.toLowerCase() === 'charging' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xs transform -rotate-90">⚡</div>
          </div>
        )}
        
        {/* Warning indicator */}
        {percentage <= 15 && status.toLowerCase() !== 'charging' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-xs">!</div>
          </div>
        )}
      </div>
    </div>
  );
}