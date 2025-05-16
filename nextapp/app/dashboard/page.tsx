import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import { useBatteryStore } from '@/lib/store';

export default function Dashboard() {
  // This is a server component, but we need to add a Client Component wrapper
  // for state management. This will be handled by a client wrapper.
  return <DashboardClient />;
}

// Client component wrapper to use hooks and state
'use client';

function DashboardClient() {
  const { 
    batteries, 
    selectedBatteryId, 
    isLoading, 
    fetchBatteries, 
    setSelectedBatteryId 
  } = useBatteryStore();
  
  // Fetch batteries on component mount
  React.useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);
  
  // Get the selected battery
  const selectedBattery = React.useMemo(() => {
    if (!selectedBatteryId) return null;
    return batteries.find(b => b.id === selectedBatteryId) || null;
  }, [batteries, selectedBatteryId]);
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Battery Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Batteries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batteries.length}</div>
            <p className="text-xs text-muted-foreground">
              Active batteries in the monitoring system
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batteries.length > 0 
                ? (batteries.reduce((sum, b) => sum + b.health, 0) / batteries.length).toFixed(1) + '%'
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Overall battery fleet health
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requiring Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batteries.filter(b => b.health < 70).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Batteries with health below 70%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Battery List */}
        <Card className="md:col-span-2 bg-gradient-card">
          <CardHeader>
            <CardTitle>Battery Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className="h-12 bg-muted/50 animate-pulse rounded"
                    />
                  ))}
                </div>
              ) : (
                batteries.map(battery => (
                  <div 
                    key={battery.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedBatteryId === battery.id 
                        ? 'bg-primary/10 border-primary glow-soft-primary' 
                        : 'bg-card/50 border-border/40 hover:bg-primary/5'
                    }`}
                    onClick={() => setSelectedBatteryId(battery.id)}
                  >
                    <div className="font-medium mb-1">{battery.name}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{battery.model}</span>
                      <span 
                        className={`font-medium ${
                          battery.health >= 70 
                            ? 'text-primary' 
                            : battery.health >= 50 
                              ? 'text-warning' 
                              : 'text-destructive'
                        }`}
                      >
                        {battery.health}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Battery Details */}
        <div className="md:col-span-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <BatteryStatusCard 
              battery={selectedBattery} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="md:col-span-1">
            <Card className="h-full bg-gradient-card">
              <CardHeader>
                <CardTitle>Battery Specs</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBattery ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Model</div>
                        <div className="font-medium">{selectedBattery.model}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Manufacturer</div>
                        <div className="font-medium">{selectedBattery.manufacturer}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Manufacture Date</div>
                        <div className="font-medium">
                          {new Date(selectedBattery.manufactureDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Last Checked</div>
                        <div className="font-medium">
                          {new Date(selectedBattery.lastChecked).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-border/40">
                      <div className="font-medium mb-2">Status</div>
                      <div 
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          selectedBattery.status.toLowerCase().includes('normal') 
                            ? 'bg-primary/20 text-primary' 
                            : selectedBattery.status.toLowerCase().includes('charging') 
                              ? 'bg-warning/20 text-warning' 
                              : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {selectedBattery.status}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a battery to view details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}