import React from 'react';
import { Battery as BatteryIcon } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BatteryIconComponent from '@/components/ui/battery-icon';
import { Battery } from '@/types';
import { 
  formatNumber, 
  getHealthStatusColor, 
  getHealthStatusText 
} from '@/lib/utils';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ 
  battery, 
  isLoading = false 
}: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-border/40">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="h-8 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="bg-gradient-card border-border/40">
        <CardHeader>
          <CardTitle>No Battery Selected</CardTitle>
          <CardDescription>Select a battery to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <BatteryIcon className="h-12 w-12 text-muted-foreground/50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card glow-soft relative overflow-hidden h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center space-x-2">
          <span>{battery.name}</span>
        </CardTitle>
        <CardDescription>
          SN: {battery.serialNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <BatteryIconComponent 
              percentage={battery.health} 
              status={battery.status} 
              className="mb-2"
            />
            <span className={`text-sm font-medium ${getHealthStatusColor(battery.health)}`}>
              {getHealthStatusText(battery.health)}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Health:</span>
              <span className={`text-sm font-semibold ${getHealthStatusColor(battery.health)}`}>
                {formatNumber(battery.health, 1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cycles:</span>
              <span className="text-sm font-semibold">
                {battery.cycleCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Voltage:</span>
              <span className="text-sm font-semibold">
                {formatNumber(battery.voltage, 1)}V
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <span className="text-sm font-semibold">
                {formatNumber(battery.capacity, 0)}mAh
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}