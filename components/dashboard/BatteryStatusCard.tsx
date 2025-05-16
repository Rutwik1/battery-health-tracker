'use client'

import React from 'react'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Battery as BatteryIcon, BarChart, Zap } from 'lucide-react'

interface BatteryStatusCardProps {
  battery: Battery;
}

export default function BatteryStatusCard({ battery }: BatteryStatusCardProps) {
  const statusColor = getBatteryStatusColor(battery.status)
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-md">
          <span>{battery.name}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${statusColor} ${statusColor.replace('text', 'bg')}/10`}>
            {battery.status}
          </span>
        </CardTitle>
        <p className="text-xs text-muted-foreground font-mono">{battery.serialNumber}</p>
      </CardHeader>
      <CardContent>
        <div className="pt-2">
          {/* Health Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Health</span>
              <span className={`text-sm font-medium ${statusColor}`}>{battery.healthPercentage}%</span>
            </div>
            <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-2 rounded-full ${statusColor.replace('text', 'bg')}`}
                style={{ width: `${battery.healthPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-start">
              <div className={`p-2 rounded-md ${statusColor.replace('text', 'bg')}/10 mr-3`}>
                <BatteryIcon className={`h-4 w-4 ${statusColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium">
                  {formatNumber(battery.currentCapacity)} <span className="text-xs text-muted-foreground">mAh</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-2 rounded-md ${statusColor.replace('text', 'bg')}/10 mr-3`}>
                <BarChart className={`h-4 w-4 ${statusColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cycles</p>
                <p className="text-sm font-medium">
                  {battery.cycleCount} <span className="text-xs text-muted-foreground">/ {battery.expectedCycles}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-2 rounded-md ${statusColor.replace('text', 'bg')}/10 mr-3`}>
                <Zap className={`h-4 w-4 ${statusColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Degradation</p>
                <p className="text-sm font-medium">
                  {battery.degradationRate}% <span className="text-xs text-muted-foreground">/ month</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-2 rounded-md ${statusColor.replace('text', 'bg')}/10 mr-3`}>
                <Clock className={`h-4 w-4 ${statusColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Update</p>
                <p className="text-sm font-medium">
                  {new Date(battery.lastUpdated).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}