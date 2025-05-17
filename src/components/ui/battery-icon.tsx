"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface BatteryIconProps {
  percentage: number
  status: string
  className?: string
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  // Calculate width based on percentage
  const fillWidth = `${Math.max(0, Math.min(percentage, 100))}%`
  
  // Determine color based on status
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'good': 
        return 'bg-success';
      case 'warning': 
        return 'bg-warning';
      case 'critical': 
        return 'bg-danger';
      default: 
        return 'bg-muted';
    }
  }
  
  // Get glow color based on status
  const getGlowColor = () => {
    switch (status.toLowerCase()) {
      case 'good': 
        return 'from-success/40 to-success/0';
      case 'warning': 
        return 'from-warning/40 to-warning/0';
      case 'critical': 
        return 'from-danger/40 to-danger/0';
      default: 
        return 'from-muted/40 to-muted/0';
    }
  }
  
  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Battery body */}
      <div className="relative w-14 h-7 border-2 border-foreground/60 rounded-md overflow-hidden">
        <div className="absolute inset-0 bg-muted/20"></div>
        
        {/* Fill level with animation */}
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-out", 
            getStatusColor()
          )}
          style={{ width: fillWidth }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer"></div>
        </div>
        
        {/* Glow effect */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-70",
            getGlowColor()
          )}
        ></div>
      </div>
      
      {/* Battery nub */}
      <div className="h-3 w-1 bg-foreground/60 rounded-r-sm"></div>
      
      {/* Percentage text */}
      <span className="ml-2 text-sm font-medium">{Math.round(percentage)}%</span>
    </div>
  )
}