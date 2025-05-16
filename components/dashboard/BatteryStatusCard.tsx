'use client'

import React from 'react'
import { useBatteryStore, Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber, formatRelativeTime } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Battery as BatteryIcon, AlertTriangle } from 'lucide-react'

interface BatteryStatusCardProps {
  battery: Battery;
}

export default function BatteryStatusCard({ battery }: BatteryStatusCardProps) {
  // Get the color for the battery status
  const statusColor = getBatteryStatusColor(battery.status)
  
  // Calculate cycle percentage
  const cyclePercentage = Math.round((battery.cycleCount / battery.expectedCycles) * 100)
  
  // Function to determine if the battery health is declining rapidly
  const isRapidDeclining = battery.degradationRate > 1.0
  
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-md ${statusColor.replace('text', 'bg')}/10`}>
          <BatteryIcon className={`h-5 w-5 ${statusColor}`} />
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{battery.name}</h4>
            {isRapidDeclining && (
              <span className="text-warning" title="Rapid health decline">
                <AlertTriangle className="h-3 w-3" />
              </span>
            )}
          </div>
          
          <div className="flex flex-col text-xs text-muted-foreground">
            <span className="font-mono">{battery.serialNumber}</span>
            <span>Last updated {formatRelativeTime(battery.lastUpdated)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="flex items-center gap-2 justify-end">
          <span className={`text-base font-semibold ${statusColor}`}>
            {battery.healthPercentage}%
          </span>
          <span className="text-xs text-muted-foreground">
            Health
          </span>
        </div>
        
        <div className="flex items-center gap-2 justify-end text-xs text-muted-foreground">
          <span>
            {formatNumber(battery.cycleCount)}/{formatNumber(battery.expectedCycles)} cycles
          </span>
          <span className="whitespace-nowrap">
            ({cyclePercentage}%)
          </span>
        </div>
      </div>
    </div>
  )
}