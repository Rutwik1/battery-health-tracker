'use client'

import React from 'react'
import Link from 'next/link'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber, formatDate, calculateRemainingLifespan } from '@/lib/utils'
import { 
  Battery as BatteryIcon, 
  ChevronRight,
  AlertTriangle, 
  Clock,
  Calendar,
  Zap 
} from 'lucide-react'

import { Card } from '@/components/ui/card'

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function BatteryHealthTable({ batteries, isLoading }: BatteryHealthTableProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-muted/30 rounded-md mb-4"></div>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-16 bg-muted/20 rounded-md mb-2"></div>
        ))}
      </div>
    )
  }
  
  if (batteries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No batteries found</p>
      </div>
    )
  }
  
  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-xs">
            <th className="text-left font-medium p-3 text-muted-foreground">Name</th>
            <th className="text-left font-medium p-3 text-muted-foreground">Status</th>
            <th className="text-left font-medium p-3 text-muted-foreground">Health</th>
            <th className="text-left font-medium p-3 text-muted-foreground hidden md:table-cell">Capacity</th>
            <th className="text-left font-medium p-3 text-muted-foreground hidden md:table-cell">Cycles</th>
            <th className="text-left font-medium p-3 text-muted-foreground hidden lg:table-cell">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Installation Date</span>
              </div>
            </th>
            <th className="text-left font-medium p-3 text-muted-foreground hidden lg:table-cell">Degradation</th>
            <th className="text-left font-medium p-3 text-muted-foreground hidden lg:table-cell">Estimated Life</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {batteries.map((battery) => {
            const statusColor = getBatteryStatusColor(battery.status)
            const remainingLifespan = calculateRemainingLifespan(battery.healthPercentage, battery.degradationRate)
            const cyclePercentage = Math.round((battery.cycleCount / battery.expectedCycles) * 100)
            const isRapidDeclining = battery.degradationRate > 1.0
            
            return (
              <tr key={battery.id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <BatteryIcon className={`h-4 w-4 ${statusColor}`} />
                    <div>
                      <p className="font-medium text-sm">{battery.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{battery.serialNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${statusColor.replace('text', 'bg')}/10 ${statusColor}`}>
                    {battery.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-full max-w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{battery.healthPercentage}%</span>
                      </div>
                      <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-2 ${statusColor.replace('text', 'bg')}`}
                          style={{ width: `${battery.healthPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {isRapidDeclining && (
                      <span className="text-warning" title="Rapid health decline">
                        <AlertTriangle className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div>
                    <p className="text-sm">{formatNumber(battery.currentCapacity)} mAh</p>
                    <p className="text-xs text-muted-foreground">of {formatNumber(battery.initialCapacity)} mAh</p>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div>
                    <div className="text-sm flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-primary" />
                      {formatNumber(battery.cycleCount)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {cyclePercentage}% of {formatNumber(battery.expectedCycles)}
                    </p>
                  </div>
                </td>
                <td className="p-3 hidden lg:table-cell text-sm">
                  {formatDate(battery.initialDate)}
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="flex items-center">
                    <span className={`text-sm ${battery.degradationRate > 1.0 ? 'text-warning' : ''}`}>
                      {battery.degradationRate}% / month
                    </span>
                  </div>
                </td>
                <td className="p-3 hidden lg:table-cell">
                  <div className="flex items-center text-sm gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {remainingLifespan > 0 
                        ? `~${remainingLifespan} months`
                        : "End of life"}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Link 
                    href={`/battery/${battery.id}`}
                    className="p-2 inline-flex hover:bg-muted/50 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}