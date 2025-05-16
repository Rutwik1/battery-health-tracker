'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Bolt, History, PieChart, ThermometerSun } from 'lucide-react';
import { useBatteryStore } from '@/lib/store';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import { formatNumber } from '@/lib/utils';

export default function Dashboard() {
  const { 
    batteries, 
    fetchBatteries, 
    fetchBatteryHistory,
    fetchUsagePattern,
    fetchRecommendations,
    isLoading,
    setSelectedBatteryId,
    selectedBatteryId
  } = useBatteryStore();
  
  // Fetch data when the component mounts
  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);
  
  // After batteries are loaded, fetch the history for each
  useEffect(() => {
    if (batteries.length > 0 && !isLoading) {
      // Fetch histories for all batteries
      batteries.forEach(battery => {
        fetchBatteryHistory(battery.id);
      });
      
      // Set the first battery as selected if none is selected
      if (selectedBatteryId === null) {
        setSelectedBatteryId(batteries[0].id);
        fetchUsagePattern(batteries[0].id);
        fetchRecommendations(batteries[0].id);
      }
    }
  }, [batteries, isLoading, fetchBatteryHistory, selectedBatteryId, setSelectedBatteryId, fetchUsagePattern, fetchRecommendations]);
  
  // Get selected battery
  const selectedBattery = batteries.find(b => b.id === selectedBatteryId) || null;
  
  // Calculate totals and averages
  const totalBatteries = batteries.length;
  const totalCapacity = batteries.reduce((sum, battery) => sum + battery.capacity, 0);
  const avgHealth = batteries.length > 0 
    ? batteries.reduce((sum, battery) => sum + battery.health, 0) / batteries.length 
    : 0;
  const criticalBatteries = batteries.filter(battery => battery.health < 30).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Monitor and manage your battery health in real-time
        </p>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Batteries</CardTitle>
            <Battery className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '–' : totalBatteries}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {totalBatteries > 1 ? 'Batteries' : 'Battery'} monitored
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Bolt className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '–' : `${formatNumber(totalCapacity / 1000, 1)} kWh`}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Combined energy capacity
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Health</CardTitle>
            <PieChart className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${avgHealth > 70 ? 'text-green-600 dark:text-green-400' : 
              avgHealth > 30 ? 'text-amber-600 dark:text-amber-400' : 
              'text-red-600 dark:text-red-400'}`}>
              {isLoading ? '–' : `${Math.round(avgHealth)}%`}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Average battery health
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Status</CardTitle>
            <ThermometerSun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${criticalBatteries > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {isLoading ? '–' : criticalBatteries}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {criticalBatteries === 1 ? 'Battery' : 'Batteries'} in critical state
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Battery Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Selected Battery Status Card */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-3">Battery Status</h2>
          <BatteryStatusCard 
            battery={selectedBattery} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Battery List */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Battery Health</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {batteries.length} {batteries.length === 1 ? 'Battery' : 'Batteries'}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              // Loading state
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="h-20 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Battery cards
              batteries.map(battery => (
                <Card 
                  key={battery.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedBatteryId === battery.id ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
                  }`}
                  onClick={() => {
                    setSelectedBatteryId(battery.id);
                    fetchUsagePattern(battery.id);
                    fetchRecommendations(battery.id);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium truncate">{battery.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {battery.manufacturer} · {battery.model}
                        </p>
                      </div>
                      <div className={`h-12 w-12 flex items-center justify-center rounded-full font-bold
                        ${battery.health > 70 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 
                          battery.health > 30 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' :
                          'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'}`}
                      >
                        {battery.health}%
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Capacity</p>
                        <p className="font-medium">{formatNumber(battery.capacity / 1000, 1)} kWh</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Cycles</p>
                        <p className="font-medium">{battery.cycleCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}