"use client"

import * as React from "react"
import { Battery, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatDate, formatNumber, getBatteryStatusColor } from "@/lib/utils"
import { Battery as BatteryType } from "@/app/types/schema"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BatteryStatusCardProps {
  battery: BatteryType | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  const getStatusColorClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'bg-green-500'
      case 'good':
        return 'bg-blue-500'
      case 'fair':
        return 'bg-yellow-500'
      case 'poor':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'success'
      case 'good':
        return 'info'
      case 'fair':
        return 'warning'
      case 'poor':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const renderBatteryIndicator = (percentage: number) => {
    const segments = [
      { threshold: 25, className: "bg-red-500" },
      { threshold: 50, className: "bg-yellow-500" },
      { threshold: 75, className: "bg-blue-500" },
      { threshold: 100, className: "bg-green-500" },
    ]
    
    return (
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
        {segments.map((segment, i) => {
          const prevThreshold = i > 0 ? segments[i - 1].threshold : 0
          const width = Math.max(0, Math.min(percentage - prevThreshold, segment.threshold - prevThreshold))
          const segmentWidth = `${(width / (segment.threshold - prevThreshold)) * 25}%`
          
          return (
            <div
              key={i}
              className={cn(
                "absolute h-full transition-all duration-500",
                segment.className
              )}
              style={{
                left: `${i * 25}%`,
                width: percentage >= prevThreshold ? segmentWidth : '0%',
              }}
            />
          )
        })}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="h-7 w-40 rounded-md bg-muted"></CardTitle>
          <CardDescription className="h-5 w-28 rounded-md bg-muted"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full rounded-full bg-muted"></div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded-md bg-muted"></div>
            <div className="h-4 w-1/2 rounded-md bg-muted"></div>
            <div className="h-4 w-2/3 rounded-md bg-muted"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!battery) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Battery Status</CardTitle>
          <CardDescription>No battery selected</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Battery className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Select a battery to view its status
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{battery.name}</CardTitle>
            <CardDescription>
              S/N: {battery.serialNumber}
            </CardDescription>
          </div>
          <Badge variant={getBadgeVariant(battery.status) as any}>
            {battery.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Health</span>
            <span 
              className={cn(
                "text-sm font-medium", 
                getBatteryStatusColor(battery.status)
              )}
            >
              {battery.healthPercentage.toFixed(1)}%
            </span>
          </div>
          {renderBatteryIndicator(battery.healthPercentage)}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Capacity</p>
            <p className="text-lg font-semibold">
              {formatNumber(battery.currentCapacity)} <span className="text-xs">mAh</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Cycle Count</p>
            <p className="text-lg font-semibold">
              {battery.cycleCount} <span className="text-xs">cycles</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Degradation Rate</p>
            <p className="text-lg font-semibold">
              {battery.degradationRate.toFixed(2)} <span className="text-xs">%/mo</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
            <p className="text-lg font-semibold">
              {formatDate(battery.lastUpdated)}
            </p>
          </div>
        </div>
        
        <div className="pt-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Zap className="mr-1 h-3 w-3" />
            <span className="font-medium">Initial Capacity:</span>
            <span className="ml-1">{formatNumber(battery.initialCapacity)} mAh</span>
          </div>
          <div className="flex items-center mt-1">
            <Battery className="mr-1 h-3 w-3" />
            <span className="font-medium">Chemistry:</span>
            <span className="ml-1">{battery.chemistry || "Not specified"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}