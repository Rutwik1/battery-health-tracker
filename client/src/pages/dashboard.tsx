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
import { Download } from "lucide-react";
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-heading font-bold text-neutral">Battery Health Dashboard</h1>
                <p className="mt-1 text-sm text-neutral-lighter">Monitor and track your battery performance and health.</p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
                {/* Time Range Filter */}
                <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="180">Last 6 Months</SelectItem>
                    <SelectItem value="365">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Export Button */}
                <Button onClick={handleExport} disabled={isLoading || !batteries}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
            
            {/* Battery Status Overview */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[120px] bg-white animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md mb-8">
                <p className="text-red-800">Failed to load battery data</p>
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
              <CapacityChart batteries={batteries || []} timeRange={parseInt(timeRange)} isLoading={isLoading} />
              <CycleChart batteries={batteries || []} isLoading={isLoading} />
            </div>
            
            {/* Battery Health Table */}
            <div className="grid grid-cols-1 gap-8 mb-8">
              <BatteryHealthTable batteries={batteries || []} isLoading={isLoading} />
            </div>
            
            {/* Additional Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <DegradationCard batteries={batteries || []} isLoading={isLoading} />
              <UsagePatternCard batteries={batteries || []} isLoading={isLoading} />
              <RecommendationsCard batteries={batteries || []} isLoading={isLoading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
