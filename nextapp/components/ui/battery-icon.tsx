'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Determine color based on battery health
  const getHealthColor = () => {
    if (safePercentage >= 75) return 'bg-green-500';
    if (safePercentage >= 50) return 'bg-lime-500';
    if (safePercentage >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  // Determine animation/styling based on status
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'charging':
        return {
          fillClass: `${getHealthColor()} relative overflow-hidden before:absolute before:inset-0 before:translate-x-[-100%] before:animate-pulse before:bg-white/30`,
          wrapperClass: 'animate-battery-pulse'
        };
      case 'error':
        return {
          fillClass: `bg-red-500 animate-pulse`,
          wrapperClass: 'animate-battery-error'
        };
      case 'active':
        return {
          fillClass: getHealthColor(),
          wrapperClass: ''
        };
      default:
        return {
          fillClass: `${getHealthColor()} opacity-70`,
          wrapperClass: ''
        };
    }
  };
  
  const { fillClass, wrapperClass } = getStatusStyles();
  
  return (
    <div className={cn('relative', wrapperClass, className)}>
      {/* Battery body */}
      <div className="h-8 w-14 rounded-sm border-2 border-gray-600 dark:border-gray-400 bg-gray-200 dark:bg-gray-800 overflow-hidden flex items-center">
        {/* Battery fill level */}
        <div 
          className={cn("h-full transition-all duration-700", fillClass)}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
      
      {/* Battery terminal */}
      <div className="absolute -right-1 top-1/2 h-3 w-1 -translate-y-1/2 rounded-r-sm bg-gray-600 dark:bg-gray-400" />
      
      {/* Percentage label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "text-xs font-semibold",
          safePercentage > 40 ? "text-gray-900 mix-blend-overlay" : "text-white"
        )}>
          {safePercentage}%
        </span>
      </div>
      
      {/* Status indicator for charging */}
      {status.toLowerCase() === 'charging' && (
        <div className="absolute -top-1 -right-1">
          <div className="h-4 w-4 flex items-center justify-center rounded-full bg-green-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Status indicator for error */}
      {status.toLowerCase() === 'error' && (
        <div className="absolute -top-1 -right-1">
          <div className="h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}