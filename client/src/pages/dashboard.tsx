import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
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
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Download, LineChart, BarChartBig, Calendar, Zap, BatteryIcon, Sparkles } from "lucide-react";
import { type Battery } from "@shared/schema";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("30");
  const queryClient = useQueryClient();
  const { lastMessage, status: wsStatus } = useWebSocket();

  // Handle realtime updates via WebSocket
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'batteries') {
        // Initial full data load
        queryClient.setQueryData(['/api/batteries'], lastMessage.data);
      } else if (lastMessage.type === 'battery_update') {
        // Update a single battery
        const updatedBattery = lastMessage.data.battery;

        queryClient.setQueryData(['/api/batteries'], (oldData: Battery[] | undefined) => {
          if (!oldData) return [updatedBattery];

          return oldData.map(battery =>
            battery.id === updatedBattery.id ? updatedBattery : battery
          );
        });

        // Update history data if we have it loaded
        if (lastMessage.data.history) {
          queryClient.setQueryData(
            ['/api/batteries', updatedBattery.id, 'history'],
            (oldData: any[] | undefined) => {
              if (!oldData) return [lastMessage.data.history];
              return [...oldData, lastMessage.data.history];
            }
          );
        }
      } else if (lastMessage.type === 'battery_added') {
        // Add new battery to the list
        const newBattery = lastMessage.data;
        console.log('New battery added via WebSocket:', newBattery);

        queryClient.setQueryData(['/api/batteries'], (oldData: Battery[] | undefined) => {
          if (!oldData) return [newBattery];

          // If battery already exists, don't add it again
          const exists = oldData.some(battery => battery.id === newBattery.id);
          if (exists) return oldData;

          // Otherwise add it to the list
          return [...oldData, newBattery];
        });
      }
    }
  }, [lastMessage, queryClient]);

  // Setup polling to regularly refresh battery data
  const { data: batteries, isLoading, error, refetch } = useQuery<Battery[]>({
    queryKey: ["/api/batteries"],
    // Poll every 3 seconds
    refetchInterval: 3000,
    // Continue polling even when tab is not focused
    refetchIntervalInBackground: true,
    // Always refetch to ensure we have the latest data
    staleTime: 0,
    gcTime: 3000,
    // Add retry logic to handle occasional network failures
    retry: 3,
    retryDelay: 1000,
    // If we encounter errors, fall back to the last successful data
    keepPreviousData: true
  });

  // Force refetch on mount and every 5 seconds as a backup
  useEffect(() => {
    const fetchData = () => {
      console.log('Manually refreshing battery data');
      refetch();
    };

    // Initial fetch
    fetchData();

    // Setup interval
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

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
          {/* Background effects */}
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-primary/5 via-accent/3 to-transparent -z-10"></div>
          <div className="absolute top-40 left-20 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] -z-10"></div>
          <div className="absolute top-80 right-20 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[100px] -z-10"></div>
          <div className="absolute bottom-40 left-1/2 w-[400px] h-[400px] rounded-full bg-success/5 blur-[80px] -z-10"></div>

          <div className="py-10 px-6 md:px-8 lg:px-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <div className="inline-flex items-center space-x-2 mb-3">
                  <div className="bg-primary/10 p-1.5 rounded-md backdrop-blur-md">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-primary">Coulomb.ai Analytics</span>
                </div>
                <h1 className="text-4xl font-heading font-bold mb-3">
                  <span className="text-gradient">Battery Performance</span> Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">Real-time monitoring and insights for your battery fleet</p>
              </div>

              <div className="mt-8 md:mt-0 flex flex-wrap items-center gap-4">
                {/* Time Range Filter */}
                <div className="flex items-center space-x-2 bg-muted/30 p-1.5 pl-3 rounded-lg border border-border/50 backdrop-blur-md">
                  <Calendar className="h-4 w-4 text-primary" />
                  <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px] border-0 bg-transparent focus:ring-0">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
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
                  className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:opacity-90 text-background shadow-md shadow-primary/20 group"
                >
                  <span className="absolute inset-0 bg-white/10 group-hover:opacity-0 transition-opacity"></span>
                  <Download className="h-4 w-4 mr-2" />
                  Export Battery Data
                </Button>
              </div>
            </div>

            {/* Animated divider */}
            <div className="w-full h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0 mb-12"></div>

            {/* Battery Status Overview */}
            <div className="mb-3 flex items-center">
              <BatteryIcon className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-xl font-heading font-medium">Battery Status Overview</h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-[140px] bg-muted/30 animate-pulse rounded-xl backdrop-blur-md"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-danger/10 p-6 rounded-xl mb-12 border border-danger/20 backdrop-blur-md">
                <p className="text-danger font-medium">Failed to load battery data</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {batteries?.map((battery) => (
                  <BatteryStatusCard key={battery.id} battery={battery} />
                ))}
              </div>
            )}

            {/* Charts */}
            <div className="mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-accent" />
              <h2 className="text-xl font-heading font-medium">Performance Metrics</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-60"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between p-5 border-b border-border/30">
                    <h2 className="text-lg font-heading font-semibold flex items-center">
                      <LineChart className="h-5 w-5 mr-2 text-primary" />
                      <span>Capacity Trends</span>
                    </h2>
                  </div>
                  <div className="p-5">
                    <CapacityChart batteries={batteries || []} timeRange={parseInt(timeRange)} isLoading={isLoading} />
                  </div>
                </div>
              </Card>

              <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-accent/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-60"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between p-5 border-b border-border/30">
                    <h2 className="text-lg font-heading font-semibold flex items-center">
                      <BarChartBig className="h-5 w-5 mr-2 text-accent" />
                      <span>Charge Cycle Analysis</span>
                    </h2>
                  </div>
                  <div className="p-5">
                    <CycleChart batteries={batteries || []} isLoading={isLoading} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Battery Health Table */}
            <div className="grid grid-cols-1 gap-8 mb-12">
              <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40"></div>
                <div className="relative z-10">
                  <BatteryHealthTable
                    batteries={batteries || []}
                    isLoading={isLoading}
                    refetch={refetch}
                  />
                </div>
              </Card>
            </div>

            {/* Additional Cards */}
            <div className="mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-success" />
              <h2 className="text-xl font-heading font-medium">Insights & Recommendations</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-danger/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-danger/10 via-transparent to-transparent opacity-40"></div>
                <div className="relative z-10">
                  <DegradationCard batteries={batteries || []} isLoading={isLoading} />
                </div>
              </Card>

              <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-success/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-transparent to-transparent opacity-40"></div>
                <div className="relative z-10">
                  <UsagePatternCard batteries={batteries || []} isLoading={isLoading} />
                </div>
              </Card>

              <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-accent/5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-40"></div>
                <div className="relative z-10">
                  <RecommendationsCard batteries={batteries || []} isLoading={isLoading} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
