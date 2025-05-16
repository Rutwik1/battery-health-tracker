'use client';

import { Battery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatteryIcon from '@/components/ui/battery-icon';
import { calculateDegradation, getHealthStatusText, getHealthStatusColor, formatDateTime } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Battery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <Skeleton className="h-10 w-20" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="pt-2 space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Battery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">No battery selected</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Select a battery to view detailed information
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate health degradation
  const degradation = calculateDegradation(100, battery.health);
  const healthStatus = getHealthStatusText(battery.health);
  const healthColor = getHealthStatusColor(battery.health);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          Battery Status
          <span className={`text-sm font-medium rounded-full px-2 py-1 ${healthColor}`}>
            {healthStatus}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <BatteryIcon 
            percentage={battery.health} 
            status={battery.status}
            className="scale-125 origin-left" 
          />
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Health</p>
            <p className="text-2xl font-bold">{battery.health}%</p>
            <p className="text-xs text-red-500">
              {degradation > 0 ? `-${degradation.toFixed(1)}%` : '0%'} degradation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="font-medium">{battery.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Serial Number</p>
              <p className="font-medium font-mono text-xs">{battery.serialNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
              <p className="font-medium">{battery.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manufacturer</p>
              <p className="font-medium">{battery.manufacturer}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Capacity</p>
              <p className="font-medium">{battery.capacity} mAh</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Voltage</p>
              <p className="font-medium">{battery.voltage}V</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Cycle Count</p>
              <p className="font-medium">{battery.cycleCount} cycles</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-medium capitalize">{battery.status}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Checked</p>
            <p className="font-medium">{formatDateTime(battery.lastChecked)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}