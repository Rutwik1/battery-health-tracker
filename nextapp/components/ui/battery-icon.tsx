import React from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Get color based on percentage and status
  const getColor = () => {
    if (status === 'error') return 'text-red-500';
    if (safePercentage > 60) return 'text-green-500';
    if (safePercentage > 30) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Get glow effect based on status
  const getGlow = () => {
    if (status === 'charging') return 'animate-pulse';
    if (status === 'error') return 'animate-ping';
    return '';
  };
  
  return (
    <div className={cn('relative inline-flex items-center', className)}>
      {/* Battery body */}
      <div className="h-8 w-16 border-2 border-gray-400 dark:border-gray-600 rounded-md overflow-hidden flex items-center">
        {/* Battery fill based on percentage */}
        <div 
          className={cn("h-full transition-all duration-700 ease-in-out", getColor())}
          style={{ 
            width: `${safePercentage}%`, 
            backgroundColor: 'currentColor',
          }}
        />
      </div>
      
      {/* Battery tip */}
      <div className="h-4 w-1 bg-gray-400 dark:bg-gray-600 rounded-r-sm ml-[-1px]" />
      
      {/* Status indicator */}
      {status === 'charging' && (
        <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", getGlow())}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      )}
      
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        </div>
      )}
    </div>
  );
}