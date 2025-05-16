'use client';

import { useState, useEffect } from 'react';
import { Battery } from '@/types';
import { useBatteryStore } from '@/lib/store';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  // Get battery data from store
  const { 
    batteries, 
    selectedBatteryId, 
    setSelectedBatteryId, 
    isLoading, 
    fetchBatteries 
  } = useBatteryStore();
  
  // Load batteries on first render
  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);
  
  // Get selected battery
  const selectedBattery = batteries.find(b => b.id === selectedBatteryId) || null;
  
  // For summary metrics
  const batteryCount = batteries.length;
  const criticalBatteries = batteries.filter(b => b.health < 40).length;
  const warningBatteries = batteries.filter(b => b.health >= 40 && b.health < 70).length;
  const healthyBatteries = batteries.filter(b => b.health >= 70).length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9"
            onClick={() => fetchBatteries()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button 
            size="sm" 
            className="h-9"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Battery
          </Button>
        </div>
      </div>
      
      {/* Summary metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batteries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{batteryCount}</div>
            <p className="text-xs text-muted-foreground">Monitored devices</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{criticalBatteries}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{warningBatteries}</div>
            <p className="text-xs text-muted-foreground">Need monitoring</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{healthyBatteries}</div>
            <p className="text-xs text-muted-foreground">Operating normally</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Two main columns */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Battery Status Card */}
          <BatteryStatusCard battery={selectedBattery} isLoading={isLoading} />
          
          {/* Recommendations Panel */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedBattery ? (
                <p className="text-muted-foreground text-sm">Select a battery to view recommendations</p>
              ) : (
                <>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-md">
                    <p className="text-sm font-medium mb-1 text-amber-500">Regular Maintenance</p>
                    <p className="text-sm text-muted-foreground">Schedule a routine health check-up for optimal performance</p>
                  </div>
                  
                  {selectedBattery.health < 80 && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
                      <p className="text-sm font-medium mb-1 text-blue-500">Optimization</p>
                      <p className="text-sm text-muted-foreground">Adjust charging cycle to improve longevity</p>
                    </div>
                  )}
                  
                  {selectedBattery.health < 60 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                      <p className="text-sm font-medium mb-1 text-red-500">Warning</p>
                      <p className="text-sm text-muted-foreground">Battery capacity significantly reduced. Consider reducing deep discharge frequency.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Recommendations
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Battery Selection Panel */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Battery Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-muted-foreground">Loading batteries...</p>
                ) : batteries.length === 0 ? (
                  <p className="text-muted-foreground">No batteries found.</p>
                ) : (
                  batteries.map(battery => (
                    <div 
                      key={battery.id}
                      onClick={() => setSelectedBatteryId(battery.id)}
                      className={`
                        flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer
                        ${selectedBatteryId === battery.id 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'hover:bg-muted border border-transparent'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-3 h-3 rounded-full
                          ${battery.health >= 70 ? 'bg-green-500' : 
                            battery.health >= 40 ? 'bg-yellow-500' : 'bg-red-500'}
                        `} />
                        <span className={`font-medium ${selectedBatteryId === battery.id ? 'text-primary' : ''}`}>
                          {battery.name}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {battery.health}% Health
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Batteries
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Usage Patterns */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Usage Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedBattery ? (
                <p className="text-muted-foreground text-sm">Select a battery to view usage patterns</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Charging Frequency:</span>
                    <span className="text-sm font-medium">
                      {selectedBattery.id === 1 ? '2.5 times/day' : 
                       selectedBattery.id === 2 ? '3.8 times/day' :
                       selectedBattery.id === 3 ? '6.2 times/day' : '8.5 times/day'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Discharge Rate:</span>
                    <span className="text-sm font-medium">
                      {selectedBattery.id === 1 ? '0.3%/min' : 
                       selectedBattery.id === 2 ? '0.5%/min' :
                       selectedBattery.id === 3 ? '0.8%/min' : '1.2%/min'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Peak Usage:</span>
                    <span className="text-sm font-medium">
                      {selectedBattery.id === 1 ? 'Morning' : 
                       selectedBattery.id === 2 ? 'Evening' :
                       selectedBattery.id === 3 ? 'Afternoon' : 'Continuous'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Environment:</span>
                    <span className="text-sm font-medium">
                      {selectedBattery.id === 1 ? 'Indoor, Controlled' : 
                       selectedBattery.id === 2 ? 'Indoor, Variable' :
                       selectedBattery.id === 3 ? 'Mixed Indoor/Outdoor' : 'Outdoor, Extreme'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Usage Type:</span>
                    <span className="text-sm font-medium">
                      {selectedBattery.id === 1 ? 'Light' : 
                       selectedBattery.id === 2 ? 'Moderate' :
                       selectedBattery.id === 3 ? 'Heavy' : 'Industrial'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}