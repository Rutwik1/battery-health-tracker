'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Start animation every 3 seconds if battery is charging
  useEffect(() => {
    if (status === 'charging') {
      const interval = setInterval(() => {
        setIsAnimating(true);
        const timeout = setTimeout(() => {
          setIsAnimating(false);
        }, 1500);
        
        return () => clearTimeout(timeout);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [status]);
  
  // Determine color based on percentage
  const getColor = (percentage: number) => {
    if (percentage >= 60) return 'bg-green-500';
    if (percentage >= 35) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get pulse animation class if charging
  const getPulseClass = () => {
    if (status === 'charging') {
      return isAnimating ? 'animate-pulse duration-1000' : '';
    }
    return '';
  };
  
  // Get glow effect for border
  const getGlowEffect = () => {
    if (percentage < 20) {
      return 'shadow-red-500/50 shadow-lg';
    }
    if (status === 'charging') {
      return 'shadow-green-500/30 shadow-lg';
    }
    return '';
  };
  
  return (
    <div className={cn('relative flex items-center', className)}>
      <div 
        className={cn(
          'relative w-12 h-6 bg-background border-2 border-foreground/70 rounded-sm overflow-hidden',
          getGlowEffect()
        )}
      >
        <div 
          className={cn(
            'absolute bottom-0 left-0 right-0 transition-all duration-700',
            getColor(percentage),
            getPulseClass()
          )}
          style={{ height: `${percentage}%` }}
        />
        
        {/* Battery level indicator text */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
          {percentage}%
        </div>
      </div>
      
      {/* Battery cap */}
      <div 
        className={cn(
          'h-4 w-1 bg-background border-2 border-l-0 border-foreground/70 rounded-r-sm',
          getGlowEffect()
        )}
      />
      
      {/* Charging indicator */}
      {status === 'charging' && (
        <div className="absolute -right-3 -top-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-green-500 animate-pulse"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
      )}
      
      {/* Discharging indicator */}
      {status === 'discharging' && (
        <div className="absolute -right-3 -top-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M18 20V6M6 4v16M18 12H4M10.5 7.5L6 4M10.5 16.5L6 20M13.5 7.5L18 4M13.5 16.5L18 20"/>
          </svg>
        </div>
      )}
    </div>
  );
}