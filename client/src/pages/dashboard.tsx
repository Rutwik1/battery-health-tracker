import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import BatteryStatusCard from "@/components/dashboard/battery-status-card";
import CapacityChart from "@/components/dashboard/capacity-chart";
import CycleChart from "@/components/dashboard/cycle-chart";
import BatteryHealthTable from "@/components/dashboard/battery-health-table";
import DegradationCard from "@/components/dashboard/degradation-card";
import UsagePatternCard from "@/components/dashboard/usage-pattern-card";
import RecommendationsCard from "@/components/dashboard/recommendations-card";
import { exportBatteryData } from "@/lib/utils/export";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Download, LineChart, BarChartBig, Calendar } from "lucide-react";
import type { Battery } from "@shared/schema";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30");

  const { data: batteries, isLoading, error } = useQuery<Battery[]>({
    queryKey: ["/api/batteries"],
  });

  const handleExport = () => {
    if (batteries) {
      exportBatteryData(batteries, timeRange);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-8 px-6 md:px-8 lg:px-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
              <div>
                <h1 className="text-3xl font-heading font-bold mb-2">
                  <span className="text-gradient">Battery Analytics</span> Dashboard
                </h1>
                <p className="text-muted-foreground">Real-time monitoring and insights for your battery fleet</p>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-3">
                {/* Time Range Filter */}
                <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg border border-border/50">
                  <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
                  <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] border-0 bg-transparent focus:ring-0">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card">
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                      <SelectItem value="180">Last 6 Months</SelectItem>
                      <SelectItem value="365">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Export Button */}
                <Button 
                  onClick={handleExport} 
                  disabled={isLoading || !batteries}
                  className="bg-gradient-primary hover:opacity-90 text-background shadow-md shadow-primary/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
            
            {/* Battery Status Overview */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[140px] bg-muted/50 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-danger/10 p-6 rounded-xl mb-8 border border-danger/20">
                <p className="text-danger font-medium">Failed to load battery data</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {batteries?.map((battery) => (
                  <BatteryStatusCard key={battery.id} battery={battery} />
                ))}
              </div>
            )}
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-card rounded-xl p-1 shadow-lg shadow-primary/5">
                <div className="flex items-center justify-between mb-4 px-5 pt-5">
                  <h2 className="text-lg font-heading font-semibold flex items-center">
                    <LineChart className="h-5 w-5 mr-2 text-primary" />
                    <span>Capacity Over Time</span>
                  </h2>
                </div>
                <div className="p-4">
                  <CapacityChart batteries={batteries || []} timeRange={parseInt(timeRange)} isLoading={isLoading} />
                </div>
              </div>
              
              <div className="bg-gradient-card rounded-xl p-1 shadow-lg shadow-primary/5">
                <div className="flex items-center justify-between mb-4 px-5 pt-5">
                  <h2 className="text-lg font-heading font-semibold flex items-center">
                    <BarChartBig className="h-5 w-5 mr-2 text-accent" />
                    <span>Charge Cycles by Battery</span>
                  </h2>
                </div>
                <div className="p-4">
                  <CycleChart batteries={batteries || []} isLoading={isLoading} />
                </div>
              </div>
            </div>
            
            {/* Battery Health Table */}
            <div className="grid grid-cols-1 gap-8 mb-8">
              <div className="bg-gradient-card rounded-xl p-1 shadow-lg shadow-primary/5 overflow-hidden">
                <BatteryHealthTable batteries={batteries || []} isLoading={isLoading} />
              </div>
            </div>
            
            {/* Additional Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="bg-gradient-card rounded-xl p-1 shadow-lg shadow-primary/5 overflow-hidden">
                <DegradationCard batteries={batteries || []} isLoading={isLoading} />
              </div>
              <div className="bg-gradient-card rounded-xl p-1 shadow-lg shadow-primary/5 overflow-hidden">
                <UsagePatternCard batteries={batteries || []} isLoading={isLoading} />
              </div>
              <div className="bg-gradient-card rounded-xl p-1 shadow-lg shadow-primary/5 overflow-hidden">
                <RecommendationsCard batteries={batteries || []} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
