'use client';

import { Battery } from '@/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import { formatNumber, getHealthStatusColor, getHealthStatusText, formatDateTime } from '@/lib/utils';
import BatteryIcon from '@/components/ui/battery-icon';
import { Skeleton } from '@/components/ui/skeleton';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-5/6" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!battery) {
    return (
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Battery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No battery selected
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            {battery.name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <BatteryIcon 
              percentage={battery.health} 
              status={battery.status} 
              className="mb-3"
            />
            <p className="text-sm text-muted-foreground">{battery.status.charAt(0).toUpperCase() + battery.status.slice(1)}</p>
            <p className="text-sm text-muted-foreground">Last checked: {formatDateTime(battery.lastChecked)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Health:</span>
              <span className={`text-sm font-medium ${getHealthStatusColor(battery.health)}`}>
                {battery.health}% - {getHealthStatusText(battery.health)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Voltage:</span>
              <span className="text-sm font-medium">{battery.voltage}V</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <span className="text-sm font-medium">{formatNumber(battery.capacity)} mAh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cycles:</span>
              <span className="text-sm font-medium">{battery.cycleCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Model:</span>
              <span className="text-sm font-medium">{battery.model}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}