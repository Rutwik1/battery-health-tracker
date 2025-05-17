"use client"

import * as React from 'react'
import { Battery as BatteryIcon, AlertTriangle, Calendar, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatNumber, getProgressColorClass } from '@/lib/utils'
import { Battery } from '@/app/types/schema'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Battery Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="animate-pulse h-24 bg-slate-800/50 rounded-md"></div>
          <div className="animate-pulse h-12 bg-slate-800/50 rounded-md"></div>
          <div className="animate-pulse h-12 bg-slate-800/50 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Battery Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px] gap-3 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 animate-pulse" />
          <h3 className="text-xl font-semibold">No Battery Selected</h3>
          <p className="text-muted-foreground">Please select a battery to view its status</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate days since installation
  const daysSinceInstall = Math.floor(
    (new Date().getTime() - new Date(battery.initialDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate estimated remaining days based on current degradation rate
  const avgDailyDegradation = battery.degradationRate / 30; // Convert monthly to daily
  const daysRemaining = Math.max(
    0,
    Math.floor((battery.healthPercentage - 50) / avgDailyDegradation)
  );

  const progressClass = getProgressColorClass(battery.healthPercentage);
  const badgeVariant = 
    battery.status === 'Excellent' ? 'success' :
    battery.status === 'Good' ? 'info' :
    battery.status === 'Fair' ? 'warning' : 'danger';

  return (
    <Card className="h-full glow-effect">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Battery Status</CardTitle>
          <Badge variant={badgeVariant}>{battery.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-end">
            <div className="text-sm text-muted-foreground">Health</div>
            <div className="text-2xl font-bold">{battery.healthPercentage}%</div>
          </div>
          <Progress 
            value={battery.healthPercentage} 
            max={100} 
            indicatorClassName={progressClass}
          />
          <div className="text-xs text-muted-foreground">
            Estimated {daysRemaining} days until maintenance needed
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glassmorphism rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <BatteryIcon className="h-4 w-4 text-indigo-400" /> 
              <span className="text-sm font-medium">Capacity</span>
            </div>
            <div className="text-lg font-semibold">
              {formatNumber(battery.currentCapacity)} mAh
            </div>
            <div className="text-xs text-muted-foreground">
              of {formatNumber(battery.initialCapacity)} mAh
            </div>
          </div>
          
          <div className="glassmorphism rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-indigo-400" /> 
              <span className="text-sm font-medium">Cycles</span>
            </div>
            <div className="text-lg font-semibold">
              {battery.cycleCount}
            </div>
            <div className="text-xs text-muted-foreground">
              of {battery.expectedCycles} expected
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-indigo-900/20">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Installed: {formatDate(new Date(battery.initialDate))}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {daysSinceInstall} days ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
}