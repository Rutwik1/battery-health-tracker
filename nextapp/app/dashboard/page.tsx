'use client';

import { useEffect } from 'react';
import { useBatteryStore } from '@/lib/store';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';

export default function Dashboard() {
  const { batteries, isLoading, selectedBatteryId, setSelectedBatteryId, fetchBatteryHistory } = useBatteryStore();
  
  const selectedBattery = batteries.find(b => b.id === selectedBatteryId) || (batteries.length > 0 ? batteries[0] : null);
  
  // Fetch battery history data for visualizations
  useEffect(() => {
    if (selectedBattery) {
      fetchBatteryHistory(selectedBattery.id);
    }
  }, [selectedBattery, fetchBatteryHistory]);
  
  // Calculate summary statistics
  const batteryCount = batteries.length;
  const activeCount = batteries.filter(b => b.status === 'active').length;
  const chargingCount = batteries.filter(b => b.status === 'charging').length;
  const criticalCount = batteries.filter(b => b.health < 30).length;
  
  const avgHealth = batteries.length > 0 
    ? Math.round(batteries.reduce((sum, battery) => sum + battery.health, 0) / batteries.length) 
    : 0;
  
  const totalCapacity = batteries.reduce((sum, battery) => sum + battery.capacity, 0) / 1000; // Convert to kWh
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Battery Health Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitor and optimize battery performance across your fleet
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center h-10 rounded-md bg-white dark:bg-gray-800 shadow-sm px-3 border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Batteries</p>
                <p className="text-3xl font-bold mt-1">{formatNumber(batteryCount)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                  <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
                  <line x1="7" y1="7" x2="17" y2="7" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="7" y1="17" x2="17" y2="17" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active Batteries</p>
                <p className="text-3xl font-bold mt-1">{formatNumber(activeCount)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Average Health</p>
                <p className="text-3xl font-bold mt-1">{avgHealth}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                  <path d="M22 12h-4" />
                  <path d="M6 12H2" />
                  <path d="M17 12a5 5 0 0 1-10 0" />
                  <path d="M7 12a5 5 0 0 0 10 0" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Critical Status</p>
                <p className="text-3xl font-bold mt-1">{formatNumber(criticalCount)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Battery */}
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-4">Selected Battery</h2>
          <BatteryStatusCard battery={selectedBattery} isLoading={isLoading} />
        </div>
        
        {/* Battery List */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Battery Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              // Skeleton cards
              Array(4).fill(null).map((_, i) => (
                <Card key={i} className="h-24 animate-pulse bg-gray-200 dark:bg-gray-800">
                  <CardContent className="p-4">
                    <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Actual battery cards
              batteries.map((battery) => (
                <Card 
                  key={battery.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBattery?.id === battery.id 
                      ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                  onClick={() => setSelectedBatteryId(battery.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{battery.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {battery.model} • Health: {battery.health}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Last updated: {new Date(battery.lastChecked).toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        battery.status === 'active' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                        battery.status === 'charging' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' :
                        battery.status === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {battery.status === 'active' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                        )}
                        {battery.status === 'charging' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                          </svg>
                        )}
                        {battery.status === 'error' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        )}
                        {battery.status === 'idle' && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                          </svg>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Coulomb.ai Logo */}
      <div className="flex justify-center pt-6 pb-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white overflow-hidden shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
                <line x1="7" y1="7" x2="17" y2="7" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="17" x2="17" y2="17" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Coulomb.ai
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Advanced Battery Intelligence</p>
        </div>
      </div>
    </div>
  );
}