'use client';

import { Battery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatteryIcon from '@/components/ui/battery-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, AlertTriangle, XCircle, Battery as BatteryIcon } from 'lucide-react';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Good':
        return <BadgeCheck className="h-5 w-5 text-success" />;
      case 'Fair':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'Poor':
      case 'Critical':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <BatteryIcon className="h-5 w-5" />;
    }
  };

  return (
    <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BatteryIcon className="h-5 w-5 text-primary" />
          Battery Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !battery ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 relative">
                <BatteryIcon 
                  percentage={battery.healthPercentage} 
                  status={battery.status}
                  className="w-full h-full" 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{battery.name}</h3>
                <p className="text-muted-foreground text-sm">{battery.serialNumber}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1 font-medium">
                  {getStatusIcon(battery.status)}
                  {battery.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Health</span>
                <span className="font-medium">{battery.healthPercentage.toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-medium">
                  {battery.currentCapacity} / {battery.initialCapacity} mAh
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cycle Count</span>
                <span className="font-medium">
                  {Math.floor(battery.cycleCount)} / {battery.expectedCycles}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(battery.lastUpdated), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}