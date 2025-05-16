'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, Battery, GaugeCircle, Clock } from 'lucide-react';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import { useBatteryStore } from '@/lib/store';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="gradient" className="gap-2 w-full sm:w-auto">
          <PlusCircle className="h-4 w-4" />
          <span>Add Battery</span>
        </Button>
      </div>
      
      <DashboardClient />
    </div>
  );
}

function DashboardClient() {
  const { 
    batteries, 
    isLoading, 
    selectedBatteryId, 
    setSelectedBatteryId,
    fetchBatteries
  } = useBatteryStore();
  
  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);
  
  const selectedBattery = selectedBatteryId 
    ? batteries.find(b => b.id === selectedBatteryId) 
    : batteries[0] || null;
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Main status card */}
      <div className="md:col-span-2 lg:col-span-1">
        <BatteryStatusCard 
          battery={selectedBattery} 
          isLoading={isLoading} 
        />
      </div>
      
      {/* Overview metrics */}
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            <span className="bg-gradient-to-br from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Fleet Overview
            </span>
          </CardTitle>
          <CardDescription>
            Summary of all monitored batteries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
              <Battery className="h-8 w-8 mb-2 text-primary" strokeWidth={1.5} />
              <div className="text-3xl font-bold">{isLoading ? "-" : batteries.length}</div>
              <div className="text-xs text-muted-foreground">Total Batteries</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
              <GaugeCircle className="h-8 w-8 mb-2 text-amber-500" strokeWidth={1.5} />
              <div className="text-3xl font-bold">
                {isLoading ? "-" : Math.round(batteries.reduce((acc, b) => acc + b.health, 0) / batteries.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg. Health</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
              <BarChart3 className="h-8 w-8 mb-2 text-violet-500" strokeWidth={1.5} />
              <div className="text-3xl font-bold">
                {isLoading ? "-" : batteries.filter(b => b.health < 80).length}
              </div>
              <div className="text-xs text-muted-foreground">Need Attention</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 border border-border/50 rounded-md bg-card/50">
              <Clock className="h-8 w-8 mb-2 text-blue-500" strokeWidth={1.5} />
              <div className="text-3xl font-bold">
                {isLoading ? "-" : Math.round(batteries.reduce((acc, b) => acc + b.cycleCount, 0) / batteries.length)}
              </div>
              <div className="text-xs text-muted-foreground">Avg. Cycles</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Battery selection cards */}
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            <span className="bg-gradient-to-br from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Battery Fleet
            </span>
          </CardTitle>
          <CardDescription>
            Select a battery to view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-md bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {batteries.map((battery) => (
                <div
                  key={battery.id}
                  className={`relative overflow-hidden p-4 border rounded-md cursor-pointer transition-all ${
                    selectedBatteryId === battery.id
                      ? 'border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5 shadow-md'
                      : 'border-border/50 bg-card/50 hover:border-border'
                  }`}
                  onClick={() => setSelectedBatteryId(battery.id)}
                >
                  <div className="absolute top-0 right-0 w-8 h-8">
                    <div className={`w-16 h-16 -mt-8 -mr-8 rounded-full ${
                      battery.health >= 80 ? 'bg-green-500/10' :
                      battery.health >= 60 ? 'bg-amber-500/10' : 'bg-red-500/10'
                    }`} />
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 mt-1 rounded-full ${
                      battery.health >= 80 ? 'bg-green-500' :
                      battery.health >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    
                    <div>
                      <div className="font-medium">{battery.name}</div>
                      <div className="text-xs text-muted-foreground">{battery.model}</div>
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${
                          battery.health >= 80 ? 'text-green-500' :
                          battery.health >= 60 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {battery.health}%
                        </span>
                        <span className="text-muted-foreground"> · {battery.cycleCount} cycles</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}