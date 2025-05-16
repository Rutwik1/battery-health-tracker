'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  // Ensure percentage is within bounds
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Determine fill color based on health percentage and status
  const getFillColor = () => {
    if (status === 'error') return 'bg-red-500';
    if (safePercentage >= 90) return 'bg-green-500';
    if (safePercentage >= 70) return 'bg-emerald-400';
    if (safePercentage >= 50) return 'bg-yellow-400';
    if (safePercentage >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Create a pulsing effect for charging batteries
  const isCharging = status === 'charging';
  
  return (
    <div className={cn('relative', className)}>
      {/* Battery body */}
      <div className="relative w-12 h-6 rounded-md border-2 border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Battery fill level */}
        <div 
          className={cn(
            'absolute bottom-0 left-0 transition-all duration-300',
            getFillColor(),
            isCharging && 'animate-pulse'
          )}
          style={{ 
            width: '100%',
            height: `${safePercentage}%`,
          }}
        />
        
        {/* Battery percentage text */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white">
          {safePercentage}%
        </div>
      </div>
      
      {/* Battery tip */}
      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-3 bg-gray-700 rounded-r-sm" />
      
      {/* Charging indicator */}
      {isCharging && (
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" className="text-yellow-400" />
          </svg>
        </div>
      )}
      
      {/* Error indicator */}
      {status === 'error' && (
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 border border-white flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      )}
      
      {/* Glowing effect when charging or active */}
      {(isCharging || status === 'active') && (
        <div className={cn(
          'absolute inset-0 rounded-md filter blur-sm opacity-40', 
          isCharging ? 'bg-yellow-400' : 'bg-emerald-400'
        )} />
      )}
    </div>
  );
}