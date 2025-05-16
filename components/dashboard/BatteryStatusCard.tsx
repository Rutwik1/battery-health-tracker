'use client'

import React from 'react'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { 
  Battery as BatteryIcon, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import Link from 'next/link'

interface BatteryStatusCardProps {
  battery: Battery;
}

export default function BatteryStatusCard({ battery }: BatteryStatusCardProps) {
  const statusColor = getBatteryStatusColor(battery.status)
  
  const getStatusIcon = () => {
    switch (battery.status.toLowerCase()) {
      case 'optimal':
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case 'good':
        return <CheckCircle2 className="h-5 w-5 text-primary" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-danger" />
      default:
        return <BatteryIcon className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Link href={`/battery/${battery.id}`}>
      <Card className="backdrop-blur-md bg-card/30 border border-border/30 h-full relative overflow-hidden hover:border-primary/40 transition-colors">
        <div className={`absolute top-0 left-0 w-1 h-full ${statusColor.replace('text', 'bg')}`}></div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-medium">{battery.name}</div>
            {getStatusIcon()}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Health</div>
              <div className={`text-base font-medium ${statusColor}`}>{battery.healthPercentage}%</div>
            </div>
            
            <div className="w-full bg-muted/50 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${statusColor.replace('text', 'bg')}`}
                style={{ width: `${battery.healthPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="text-sm text-muted-foreground">Cycles</div>
              <div className="text-base font-medium">{battery.cycleCount} / {battery.expectedCycles}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Capacity</div>
              <div className="text-base font-medium">{battery.currentCapacity} mAh</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}