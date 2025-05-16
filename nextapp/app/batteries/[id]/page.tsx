'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Info, 
  History, 
  LineChart, 
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { useBatteryStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import CapacityChart from '@/components/dashboard/capacity-chart';
import RecommendationList from '@/components/dashboard/recommendation-list';
import { formatDateTime, formatNumber } from '@/lib/utils';

export default function BatteryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batteryId = Number(params.id);
  
  const { 
    batteries, 
    batteryHistories,
    usagePatterns,
    recommendations,
    fetchBatteries, 
    fetchBatteryHistory, 
    fetchUsagePattern, 
    fetchRecommendations,
    isLoading,
    updateBattery
  } = useBatteryStore();
  
  const [timeRange, setTimeRange] = React.useState<number>(30); // 30 days default
  
  // Fetch battery data on mount
  useEffect(() => {
    if (batteries.length === 0) {
      fetchBatteries();
    }
  }, [batteries.length, fetchBatteries]);
  
  // Fetch battery-specific data when batteries are loaded or if ID changes
  useEffect(() => {
    if (batteries.length > 0 && !isNaN(batteryId)) {
      fetchBatteryHistory(batteryId);
      fetchUsagePattern(batteryId);
      fetchRecommendations(batteryId);
    }
  }, [batteries.length, batteryId, fetchBatteryHistory, fetchUsagePattern, fetchRecommendations]);
  
  // Find the current battery
  const battery = batteries.find(b => b.id === batteryId) || null;
  
  // Get related data
  const batteryHistory = batteryHistories.get(batteryId) || [];
  const usagePattern = usagePatterns.get(batteryId);
  const batteryRecommendations = recommendations.get(batteryId) || [];
  
  // Handle going back
  const handleBack = () => {
    router.push('/dashboard');
  };
  
  // Handle marking a recommendation as resolved
  const handleResolveRecommendation = async (recommendationId: number) => {
    // Simulate API call to update recommendation
    // In a real app, this would be an API call
    
    // For now, just log it
    console.log(`Marking recommendation ${recommendationId} as resolved`);
    
    // In a real app you would then refetch recommendations
    // await fetchRecommendations(batteryId);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isLoading || !battery ? (
                <Skeleton className="h-8 w-48 inline-block" />
              ) : (
                battery.name
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isLoading || !battery ? (
                <Skeleton className="h-4 w-72 inline-block mt-1" />
              ) : (
                <>
                  {battery.manufacturer} · {battery.model} · S/N: {battery.serialNumber}
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-1" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Battery status & usage */}
        <div className="lg:col-span-1 space-y-6">
          {/* Battery Status Card */}
          <BatteryStatusCard 
            battery={battery} 
            isLoading={isLoading} 
          />
          
          {/* Usage Pattern Card */}
          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Usage Pattern</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading || !usagePattern ? (
                // Loading state
                <>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </>
              ) : (
                // Actual content
                <>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    This battery is primarily used for {usagePattern.usageType.toLowerCase()} in 
                    {usagePattern.environmentalConditions.toLowerCase()} conditions.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Charging Frequency
                      </div>
                      <div className="text-sm font-medium">
                        {usagePattern.chargingFrequency.toFixed(1)} times/day
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Avg. Discharge Rate
                      </div>
                      <div className="text-sm font-medium">
                        {usagePattern.averageDischargeRate.toFixed(1)} kW
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Deep Discharge Count
                      </div>
                      <div className="text-sm font-medium">
                        {usagePattern.deepDischargeCount} cycles
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Peak Usage Time
                      </div>
                      <div className="text-sm font-medium">
                        {usagePattern.peakUsageTime}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Based on analysis of the last {batteryHistory.length} days of operation
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Charts & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Capacity Chart */}
          <CapacityChart
            batteries={battery ? [battery] : []}
            batteryHistories={batteryHistories}
            timeRange={timeRange}
            isLoading={isLoading}
            detailed={true}
          />
          
          {/* Time Range Selector */}
          <div className="flex items-center justify-center space-x-2">
            <Button 
              variant={timeRange === 7 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange(7)}
            >
              7 Days
            </Button>
            <Button 
              variant={timeRange === 14 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange(14)}
            >
              14 Days
            </Button>
            <Button 
              variant={timeRange === 30 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange(30)}
            >
              30 Days
            </Button>
            <Button 
              variant={timeRange === 60 ? "default" : "outline"} 
              size="sm"
              onClick={() => setTimeRange(60)}
            >
              60 Days
            </Button>
          </div>
          
          {/* Battery History Log */}
          <Card className="shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">History Log</CardTitle>
              <Button variant="outline" size="sm">
                <History className="h-4 w-4 mr-1" />
                Full History
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                        Health
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                        Capacity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                        Voltage
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                        Temp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                        Cycles
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, index) => (
                        <tr key={`skeleton-${index}`} className="bg-white dark:bg-gray-950">
                          <td className="px-4 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-4 py-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-4 py-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-4 py-4">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-4 py-4">
                            <Skeleton className="h-4 w-12" />
                          </td>
                          <td className="px-4 py-4">
                            <Skeleton className="h-4 w-12" />
                          </td>
                        </tr>
                      ))
                    ) : batteryHistory.length === 0 ? (
                      // Empty state
                      <tr className="bg-white dark:bg-gray-950">
                        <td colSpan={6} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                          No history data available
                        </td>
                      </tr>
                    ) : (
                      // Actual data
                      batteryHistory
                        .slice()
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice(0, 5) // Only show last 5 entries
                        .map(entry => (
                          <tr key={entry.id} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900">
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {formatDateTime(entry.date)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`${
                                entry.health > 70 ? 'text-green-600 dark:text-green-400' : 
                                entry.health > 30 ? 'text-amber-600 dark:text-amber-400' :
                                'text-red-600 dark:text-red-400'
                              }`}>
                                {entry.health.toFixed(1)}%
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {formatNumber(entry.capacity / 1000, 1)} kWh
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {entry.voltage.toFixed(1)} V
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {entry.temperature.toFixed(1)}°C
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                              {entry.cycleCount}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Recommendations */}
          <RecommendationList
            battery={battery}
            recommendations={batteryRecommendations}
            isLoading={isLoading}
            onResolve={handleResolveRecommendation}
          />
        </div>
      </div>
    </div>
  );
}