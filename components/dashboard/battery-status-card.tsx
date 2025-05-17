"use client"

import * as React from "react"
import { Battery, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn, formatNumber, formatDate, getBatteryStatusColor } from "@/lib/utils"
import { Battery as BatteryType } from "@/app/types/schema"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface BatteryStatusCardProps {
  battery: BatteryType | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 h-full w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Battery Status</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Battery className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted"></div>
              <div className="h-9 w-full animate-pulse rounded-md bg-muted"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-32 animate-pulse rounded-md bg-muted"></div>
              <div className="h-9 w-full animate-pulse rounded-md bg-muted"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-5 w-16 animate-pulse rounded-md bg-muted"></div>
                <div className="h-9 w-full animate-pulse rounded-md bg-muted"></div>
              </div>
              <div className="space-y-2">
                <div className="h-5 w-16 animate-pulse rounded-md bg-muted"></div>
                <div className="h-9 w-full animate-pulse rounded-md bg-muted"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!battery) {
    return (
      <Card className="col-span-1 h-full w-full overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Battery Status</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] flex-col items-center justify-center space-y-3 text-center">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-lg font-medium">No Battery Selected</p>
              <p className="text-sm text-muted-foreground">
                Select a battery from the table below to view its status
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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

  return (
    <Card className="col-span-1 h-full w-full overflow-hidden backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{battery.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant(battery.status)}>{battery.status}</Badge>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Battery className={cn("h-4 w-4", getBatteryStatusColor(battery.status))} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Health</span>
              <span className="text-sm font-medium">{battery.healthPercentage}%</span>
            </div>
            <Progress
              value={battery.healthPercentage}
              className="h-2.5"
              indicatorClassName={cn(
                battery.healthPercentage >= 85 ? "bg-green-500" :
                battery.healthPercentage >= 70 ? "bg-emerald-500" :
                battery.healthPercentage >= 50 ? "bg-amber-500" :
                "bg-red-500"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Capacity</span>
              <span className="text-sm font-medium">
                {formatNumber(battery.currentCapacity)} / {formatNumber(battery.initialCapacity)} mAh
              </span>
            </div>
            <Progress
              value={(battery.currentCapacity / battery.initialCapacity) * 100}
              className="h-2.5"
              indicatorClassName="bg-blue-600"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium leading-none">Cycle Count</p>
              <p className="mt-2 text-2xl font-bold">{battery.cycleCount}</p>
              <p className="text-xs text-muted-foreground">
                of {battery.expectedCycles} expected
              </p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Last Updated</p>
              <p className="mt-2 text-2xl font-bold">{formatDate(battery.lastUpdated)}</p>
              <p className="text-xs text-muted-foreground">
                Degradation: {battery.degradationRate.toFixed(2)}% / month
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium leading-none">Serial Number</p>
              <p className="mt-1 font-mono text-sm">{battery.serialNumber}</p>
            </div>
            {battery.manufacturer && (
              <div>
                <p className="text-sm font-medium leading-none">Manufacturer</p>
                <p className="mt-1 text-sm">{battery.manufacturer}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}