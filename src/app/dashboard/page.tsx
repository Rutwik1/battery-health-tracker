"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Battery } from "@/lib/db/schema";
import { cn, getHealthColor, getStatusColor } from "@/lib/utils";
import BatteryIcon from "@/components/ui/battery-icon";

export default function DashboardPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [batteryHistories, setBatteryHistories] = useState<any>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(3); // months

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batteries
        const response = await fetch('/api/batteries');
        if (!response.ok) {
          throw new Error('Failed to fetch batteries');
        }
        const data = await response.json();
        setBatteries(data);
        
        // Fetch histories for each battery
        const histories: any = {};
        for (const battery of data) {
          const historyResponse = await fetch(`/api/batteries/${battery.id}/history`);
          if (historyResponse.ok) {
            const historyData = await historyResponse.json();
            histories[battery.id] = historyData;
          }
        }
        setBatteryHistories(histories);
        
        // Fetch recommendations
        const allRecommendations: any[] = [];
        for (const battery of data) {
          const recResponse = await fetch(`/api/batteries/${battery.id}/recommendations`);
          if (recResponse.ok) {
            const recData = await recResponse.json();
            allRecommendations.push(...recData);
          }
        }
        setRecommendations(allRecommendations);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate overview statistics
  const totalBatteries = batteries.length;
  const healthyBatteries = batteries.filter(b => b.status === 'good').length;
  const warningBatteries = batteries.filter(b => b.status === 'warning').length;
  const criticalBatteries = batteries.filter(b => b.status === 'critical').length;

  // Calculate average health
  const averageHealth = batteries.length > 0
    ? batteries.reduce((sum, b) => sum + Number(b.currentHealth), 0) / batteries.length
    : 0;

  // Get active recommendations (not resolved)
  const activeRecommendations = recommendations.filter(rec => !rec.resolved);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:items-center md:flex-row md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your battery health monitoring center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/batteries"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-9 px-4 py-2 bg-gradient-primary hover:opacity-90"
          >
            View All Batteries
          </Link>
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Batteries */}
        <div className="battery-card p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Total Batteries</p>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : totalBatteries}</div>
            </div>
          </div>
        </div>

        {/* Average Health */}
        <div className="battery-card p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Average Health</p>
            <div className="flex items-center">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className={`text-2xl font-bold ${getHealthColor(averageHealth)}`}>
                  {Math.round(averageHealth)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="battery-card p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-success"></div>
                  <span className="text-sm">{healthyBatteries}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-warning"></div>
                  <span className="text-sm">{warningBatteries}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-danger"></div>
                  <span className="text-sm">{criticalBatteries}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Required */}
        <div className="battery-card p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Action Required</p>
            <div className="flex items-center">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold text-danger">{criticalBatteries + warningBatteries}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Battery Grid */}
        <div className="md:col-span-2 lg:col-span-4">
          <div className="battery-card h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Battery Health</h2>
                <Link
                  href="/dashboard/batteries"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-36 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {batteries.slice(0, 4).map((battery) => (
                    <Link 
                      href={`/dashboard/batteries/${battery.id}`} 
                      key={battery.id}
                      className="block hover:scale-[1.02] transition-transform"
                    >
                      <div className="relative p-4 bg-gradient-dark backdrop-blur-md rounded-xl border border-border/50 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{battery.name}</h3>
                            <p className="text-xs text-muted-foreground">{battery.serialNumber}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(battery.status)}`}>
                            {battery.status.charAt(0).toUpperCase() + battery.status.slice(1)}
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Health</p>
                            <p className={`font-medium ${getHealthColor(Number(battery.currentHealth))}`}>
                              {battery.currentHealth}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="font-medium">{battery.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Cycles</p>
                            <p className="font-medium">{battery.cycleCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Last Charged</p>
                            <p className="font-medium">{new Date(battery.lastCharged).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-3 right-3">
                          <BatteryIcon 
                            percentage={Number(battery.currentHealth)} 
                            status={battery.status} 
                          />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="battery-card h-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <p>No recommendations at this time</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {activeRecommendations.slice(0, 3).map((rec) => (
                    <div 
                      key={rec.id} 
                      className="p-4 border rounded-xl flex items-start gap-3 bg-gradient-dark border-border/50"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {rec.type === 'info' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        ) : rec.type === 'warning' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        ) : rec.type === 'critical' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"></path>
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-medium ${
                            rec.type === 'info' ? 'text-secondary' :
                            rec.type === 'warning' ? 'text-warning' :
                            rec.type === 'critical' ? 'text-danger' :
                            'text-primary'
                          }`}>
                            {rec.type.toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <p className="mt-1">
                          {rec.message}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {activeRecommendations.length > 3 && (
                    <div className="text-center mt-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/recommendations">
                          View all ({activeRecommendations.length})
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="md:col-span-2 lg:col-span-7">
          <div className="battery-card h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Battery Health Trends</h2>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setTimeRange(1)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      timeRange === 1 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                    }`}
                    variant="ghost"
                    size="sm"
                  >
                    1M
                  </Button>
                  <Button
                    onClick={() => setTimeRange(3)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      timeRange === 3 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                    }`}
                    variant="ghost"
                    size="sm"
                  >
                    3M
                  </Button>
                  <Button
                    onClick={() => setTimeRange(6)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      timeRange === 6 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                    }`}
                    variant="ghost"
                    size="sm"
                  >
                    6M
                  </Button>
                  <Button
                    onClick={() => setTimeRange(12)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      timeRange === 12 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
                    }`}
                    variant="ghost"
                    size="sm"
                  >
                    12M
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <Skeleton className="w-full h-[300px] rounded-xl" />
              ) : Object.keys(batteryHistories).length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                  <p>No historical data available</p>
                </div>
              ) : (
                <div className="h-[300px] w-full relative">
                  <div className="text-center py-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                      {batteries.map((battery) => (
                        <div key={battery.id} className="flex items-center gap-2">
                          <div 
                            className="h-3 w-3 rounded-full" 
                            style={{ 
                              backgroundColor: getChartColor(battery.id)
                            }}
                          ></div>
                          <span className="text-sm">{battery.name}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-muted-foreground">
                      Use the Chart component in production to display battery health trends over time.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get chart colors
function getChartColor(batteryId: number) {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--danger))",
  ];
  
  return colors[(batteryId - 1) % colors.length];
}