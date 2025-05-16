'use client';

import { Battery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BatteryIcon from '@/components/ui/battery-icon';
import { getHealthStatusText, getHealthStatusColor } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Battery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Battery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-3 py-8">
            <div className="text-4xl text-muted-foreground opacity-40">
              <BatteryIcon percentage={0} status="unknown" className="h-16 w-16" />
            </div>
            <p className="text-center text-muted-foreground">
              Select a battery to view detailed status information
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const healthColor = getHealthStatusColor(battery.health);
  const healthText = getHealthStatusText(battery.health);

  return (
    <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Battery Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
          <div className="relative mb-4 sm:mb-0">
            <BatteryIcon 
              percentage={battery.health} 
              status={battery.status} 
              className="h-24 w-24" 
            />
            <div 
              className="absolute inset-0 rounded-full" 
              style={{
                background: `radial-gradient(circle at center, ${healthColor}20 0%, transparent 70%)`,
                animation: 'pulse 2s infinite'
              }}
            />
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold">{battery.name}</h3>
            <p className="text-sm text-muted-foreground">{battery.model} • {battery.manufacturer}</p>
            <div className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${healthColor}`}>
              {healthText}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: {formatDateTime(battery.lastChecked)}
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="text-sm font-medium text-muted-foreground">Capacity</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold">{battery.capacity}</div>
              <div className="ml-1 text-xs text-muted-foreground">mAh</div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="text-sm font-medium text-muted-foreground">Voltage</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold">{battery.voltage}</div>
              <div className="ml-1 text-xs text-muted-foreground">V</div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="text-sm font-medium text-muted-foreground">Cycle Count</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold">{battery.cycleCount}</div>
              <div className="ml-1 text-xs text-muted-foreground">cycles</div>
            </div>
          </div>
          
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="text-sm font-medium text-muted-foreground">Manufactured</div>
            <div className="mt-1 text-2xl font-semibold">
              {new Date(battery.manufactureDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short'
              })}
            </div>
          </div>
        </div>
        
        {/* Health bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs mb-1">
            <span>Health</span>
            <span>{battery.health}%</span>
          </div>
          <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ 
                width: `${battery.health}%`, 
                background: `linear-gradient(90deg, ${healthColor} 0%, ${healthColor}88 100%)` 
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}