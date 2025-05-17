"use client";

import { getHealthColor } from "@/lib/utils";

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = "" }: BatteryIconProps) {
  // Get color based on health percentage
  const healthColor = status === 'good' ? 'hsl(var(--success))' :
                      status === 'warning' ? 'hsl(var(--warning))' :
                      'hsl(var(--danger))';
  
  // Calculate the fill level based on percentage
  const fillLevel = Math.max(0, Math.min(100, percentage)) / 100;
  
  return (
    <div className={`relative h-6 w-10 ${className}`}>
      <svg
        viewBox="0 0 24 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Battery outline */}
        <rect
          x="1"
          y="1"
          width="20"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="transparent"
        />
        
        {/* Battery nub */}
        <rect
          x="21"
          y="4"
          width="2"
          height="4"
          rx="1"
          fill="currentColor"
          fillOpacity="0.5"
        />
        
        {/* Battery fill based on percentage */}
        <rect
          x="2"
          y="2"
          width={18 * fillLevel}
          height="8"
          rx="1"
          fill={healthColor}
          className="transition-all duration-300 ease-in-out"
        />
        
        {/* Add a glow effect for better visual appeal */}
        <rect
          x="2"
          y="2"
          width={18 * fillLevel}
          height="8"
          rx="1"
          fill={healthColor}
          filter="blur(2px)"
          opacity="0.4"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
    </div>
  );
}