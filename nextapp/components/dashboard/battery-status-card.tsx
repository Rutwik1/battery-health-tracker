'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BatteryIcon from '@/components/ui/battery-icon';
import { Battery } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime, getHealthStatusText, getHealthStatusColor } from '@/lib/utils';
import { Info, AlertTriangle, CheckCircle, Clock, BoltIcon, Thermometer, Zap } from 'lucide-react';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-medium">No Battery Selected</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Select a battery from the list to view detailed information
          </p>
        </div>
      </Card>
    );
  }

  // Status indicator component
  const StatusIndicator = () => {
    if (battery.health >= 80) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (battery.health >= 60) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const healthColor = getHealthStatusColor(battery.health);
  const healthText = getHealthStatusText(battery.health);

  return (
    <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-xl font-bold">
          <span className="bg-gradient-to-br from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            {battery.name}
          </span>
          <StatusIndicator />
        </CardTitle>
        <CardDescription>
          {battery.manufacturer} · {battery.model} · S/N: {battery.serialNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center gap-6">
          <div className="relative">
            <BatteryIcon 
              percentage={battery.health} 
              status={battery.status} 
              className="h-20 w-20" 
            />
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-background bg-green-500 flex items-center justify-center">
              <span className="text-[8px] font-bold text-background">{battery.status === 'charging' ? '+' : ''}</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-1">
              <div className={`text-3xl font-bold ${healthColor}`}>{battery.health}%</div>
              <div className="text-sm text-muted-foreground">health</div>
            </div>
            <div className="text-sm text-muted-foreground pt-1">
              <span className={healthColor}>{healthText}</span> · Last checked {formatDateTime(battery.lastChecked)}
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
            <BoltIcon className="h-5 w-5 mb-1 text-amber-500" strokeWidth={1.5} />
            <div className="text-lg font-bold">{battery.voltage}V</div>
            <div className="text-xs text-muted-foreground">Voltage</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
            <Zap className="h-5 w-5 mb-1 text-blue-500" strokeWidth={1.5} />
            <div className="text-lg font-bold">{battery.capacity}mAh</div>
            <div className="text-xs text-muted-foreground">Capacity</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
            <Clock className="h-5 w-5 mb-1 text-violet-500" strokeWidth={1.5} />
            <div className="text-lg font-bold">{battery.cycleCount}</div>
            <div className="text-xs text-muted-foreground">Cycles</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}