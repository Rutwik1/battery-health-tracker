'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  // Limit percentage between 0 and 100
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));
  
  // Get fill class based on percentage
  const getFillClass = () => {
    if (normalizedPercentage > 70) return 'fill-green-500 dark:fill-green-400';
    if (normalizedPercentage > 30) return 'fill-amber-500 dark:fill-amber-400';
    return 'fill-red-500 dark:fill-red-400';
  };
  
  // Get the pulse status class
  const getPulseStatusClass = () => {
    if (status.toLowerCase() === 'charging') return 'pulse pulse-green';
    if (status.toLowerCase() === 'discharging') return 'pulse pulse-yellow';
    if (status.toLowerCase() === 'critical') return 'pulse pulse-red';
    return '';
  };
  
  // Get stroke class based on status
  const getStrokeClass = () => {
    if (status.toLowerCase() === 'charging') return 'stroke-green-500 dark:stroke-green-400';
    if (status.toLowerCase() === 'discharging') return 'stroke-amber-500 dark:stroke-amber-400';
    if (status.toLowerCase() === 'critical') return 'stroke-red-500 dark:stroke-red-400';
    return 'stroke-gray-500 dark:stroke-gray-400';
  };
  
  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <div className={cn('relative', getPulseStatusClass())}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn('h-full w-full', getStrokeClass())}
          strokeWidth="1.5"
        >
          {/* Battery outline */}
          <rect x="2" y="6" width="18" height="12" rx="2" />
          {/* Battery tip */}
          <path d="M20 10H21.5C21.7761 10 22 10.2239 22 10.5V13.5C22 13.7761 21.7761 14 21.5 14H20V10Z" />
          {/* Battery fill based on percentage */}
          <rect
            x="4"
            y="8"
            width={normalizedPercentage * 0.14}
            height="8"
            rx="1"
            className={getFillClass()}
          />
          
          {/* Charging icon */}
          {status.toLowerCase() === 'charging' && (
            <path
              d="M12.9874 8L10 11.9908H14L11.0126 16"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-white dark:stroke-black"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
      
      {/* Display percentage */}
      <span 
        className={cn(
          'absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium',
          normalizedPercentage > 70 ? 'text-green-600 dark:text-green-400' : 
          normalizedPercentage > 30 ? 'text-amber-600 dark:text-amber-400' : 
          'text-red-600 dark:text-red-400'
        )}
      >
        {normalizedPercentage}%
      </span>
    </div>
  );
}