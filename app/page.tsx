'use client';

import React, { useEffect } from 'react';
import { useBatteryStore } from './store/useBatteryStore';
import { Card } from '@/components/ui/card';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import CapacityChart from '@/components/dashboard/capacity-chart';
import CycleChart from '@/components/dashboard/cycle-chart';
import BatteryHealthTable from '@/components/dashboard/battery-health-table';
import RecommendationsCard from '@/components/dashboard/recommendations-card';
import DegradationCard from '@/components/dashboard/degradation-card';
import UsagePatternCard from '@/components/dashboard/usage-pattern-card';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

export default function Dashboard() {
  const { batteries, fetchBatteries, isLoading } = useBatteryStore();
  
  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);
  
  // Get a specific battery for detail components
  const primaryBattery = batteries?.[0];
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1">
        <Topbar />
        
        <main className="p-6 md:p-8 pt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Battery Status */}
            <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <BatteryStatusCard battery={primaryBattery} isLoading={isLoading} />
              </div>
            </Card>

            {/* Capacity Chart */}
            <Card className="md:col-span-2 backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <CapacityChart batteries={batteries || []} timeRange={30} isLoading={isLoading} />
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cycle Chart */}
            <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <CycleChart batteries={batteries || []} isLoading={isLoading} />
              </div>
            </Card>
            
            {/* Degradation Card */}
            <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <DegradationCard batteries={batteries || []} isLoading={isLoading} />
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recommendations */}
            <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <RecommendationsCard batteries={batteries || []} isLoading={isLoading} />
              </div>
            </Card>
            
            {/* Usage Patterns */}
            <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <UsagePatternCard batteries={batteries || []} isLoading={isLoading} />
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mb-12">
            <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
              <div className="relative z-10">
                <BatteryHealthTable 
                  batteries={batteries || []} 
                  isLoading={isLoading}
                  refetch={fetchBatteries}
                />
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}