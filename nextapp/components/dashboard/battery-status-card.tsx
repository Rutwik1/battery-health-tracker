import React from 'react';
import { formatNumber, formatDateTime, getHealthStatusColor, getHealthStatusText } from '@/lib/utils';
import { Battery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BatteryIcon from '@/components/ui/battery-icon';

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>No Battery Selected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">
            Select a battery from the list to view detailed information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">{battery.name}</CardTitle>
          <BatteryIcon percentage={battery.health} status={battery.status} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {battery.manufacturer} · {battery.model}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Health</p>
            <div className="flex items-center gap-2 mt-1">
              <div className={`text-lg font-semibold ${battery.health > 50 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {battery.health}%
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getHealthStatusColor(battery.health)}`}>
                {getHealthStatusText(battery.health)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</p>
            <p className="text-lg font-semibold">{formatNumber(battery.capacity / 1000, 1)} kWh</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Voltage</p>
            <p className="text-lg font-semibold">{battery.voltage} V</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cycle Count</p>
            <p className="text-lg font-semibold">{battery.cycleCount}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Serial Number</p>
            <p className="text-sm font-mono">{battery.serialNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Manufacture Date</p>
            <p className="text-sm">{new Date(battery.manufactureDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Status: <span className="capitalize">{battery.status}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last checked: {formatDateTime(battery.lastChecked)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}