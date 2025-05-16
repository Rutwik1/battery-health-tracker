'use client';

import React from 'react';
import { Battery as BatteryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime, getHealthStatusText } from '@/lib/utils';
import BatteryIcon from '@/components/ui/battery-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { ClockIcon, BoltIcon, CalendarIcon, ChipIcon } from 'lucide-react';

interface BatteryStatusCardProps {
  battery: BatteryType | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  // If loading or no battery selected, show skeleton
  if (isLoading || !battery) {
    return (
      <Card className="h-full shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Battery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <Skeleton className="h-full w-2/3" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Get health color class
  const getHealthColorClass = () => {
    if (battery.health > 70) return 'text-green-600 dark:text-green-400';
    if (battery.health > 30) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  // Get progress bar color class
  const getProgressColorClass = () => {
    if (battery.health > 70) return 'progress-green';
    if (battery.health > 30) return 'progress-yellow';
    return 'progress-red';
  };
  
  return (
    <Card className="h-full shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Battery Information</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {battery.serialNumber}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Battery icon and name */}
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16">
            <BatteryIcon
              percentage={battery.health}
              status={battery.status}
              className="h-full w-full"
            />
          </div>
          <h3 className="text-lg font-semibold">{battery.name}</h3>
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{battery.manufacturer}</span>
            <span>•</span>
            <span>{battery.model}</span>
          </div>
        </div>
        
        {/* Health status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Health Status</span>
            <span className={`text-sm font-medium ${getHealthColorClass()}`}>
              {battery.health}% ({getHealthStatusText(battery.health)})
            </span>
          </div>
          <div className="progress-indicator">
            <div 
              className={`progress-bar ${getProgressColorClass()}`} 
              style={{ width: `${battery.health}%` }}
            />
          </div>
        </div>
        
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
              <BoltIcon className="h-3.5 w-3.5" />
              <span>Capacity</span>
            </div>
            <p className="text-sm font-medium">{(battery.capacity / 1000).toFixed(1)} kWh</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 3 12" />
                <polyline points="21 12 16.5 14.6 16.5 19.79" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <span>Voltage</span>
            </div>
            <p className="text-sm font-medium">{battery.voltage.toFixed(1)} V</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>Cycle Count</span>
            </div>
            <p className="text-sm font-medium">{battery.cycleCount} cycles</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Manufacture Date</span>
            </div>
            <p className="text-sm font-medium">{formatDateTime(battery.manufactureDate)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>Last Checked</span>
            </div>
            <p className="text-sm font-medium">{formatDateTime(battery.lastChecked)}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
              </svg>
              <span>Status</span>
            </div>
            <p className={`text-sm font-medium ${
              battery.status.toLowerCase() === 'charging' ? 'text-green-600 dark:text-green-400' : 
              battery.status.toLowerCase() === 'discharging' ? 'text-amber-600 dark:text-amber-400' :
              battery.status.toLowerCase() === 'critical' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {battery.status}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}