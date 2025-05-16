'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Battery, BatteryHistory, UsagePattern, Recommendation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import CapacityChart from '@/components/dashboard/capacity-chart';
import { 
  ArrowLeft, 
  RefreshCw, 
  Calendar, 
  Activity, 
  Zap, 
  Thermometer,
  Settings,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { getBatteryStatusColor, getBatteryStatusBgColor } from '@/lib/utils';

export default function BatteryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const batteryId = parseInt(params.id as string);
  
  const [isLoading, setIsLoading] = useState(true);
  const [battery, setBattery] = useState<Battery | null>(null);
  const [history, setHistory] = useState<BatteryHistory[]>([]);
  const [usagePattern, setUsagePattern] = useState<UsagePattern | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  useEffect(() => {
    if (isNaN(batteryId)) {
      router.push('/dashboard');
      return;
    }
    
    const fetchBatteryData = async () => {
      setIsLoading(true);
      try {
        // Fetch battery details
        const batteryResponse = await fetch(`/api/batteries/${batteryId}`);
        if (!batteryResponse.ok) {
          throw new Error('Failed to fetch battery details');
        }
        const batteryData = await batteryResponse.json();
        setBattery(batteryData);
        
        // Fetch battery history
        const historyResponse = await fetch(`/api/batteries/${batteryId}/history`);
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData);
        }
        
        // Fetch usage pattern
        const usageResponse = await fetch(`/api/batteries/${batteryId}/usage`);
        if (usageResponse.ok) {
          const usageData = await usageResponse.json();
          setUsagePattern(usageData);
        }
        
        // Fetch recommendations
        const recommendationsResponse = await fetch(`/api/batteries/${batteryId}/recommendations`);
        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json();
          setRecommendations(recommendationsData);
        }
      } catch (error) {
        console.error('Error fetching battery data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBatteryData();
  }, [batteryId, router]);
  
  const refreshData = async () => {
    if (isNaN(batteryId)) return;
    
    setIsLoading(true);
    try {
      // Refresh all data
      const batteryResponse = await fetch(`/api/batteries/${batteryId}`);
      if (batteryResponse.ok) {
        const batteryData = await batteryResponse.json();
        setBattery(batteryData);
      }
      
      const historyResponse = await fetch(`/api/batteries/${batteryId}/history`);
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setHistory(historyData);
      }
      
      const usageResponse = await fetch(`/api/batteries/${batteryId}/usage`);
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsagePattern(usageData);
      }
      
      const recommendationsResponse = await fetch(`/api/batteries/${batteryId}/recommendations`);
      if (recommendationsResponse.ok) {
        const recommendationsData = await recommendationsResponse.json();
        setRecommendations(recommendationsData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-dark p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isLoading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                battery?.name || 'Battery Details'
              )}
            </h1>
          </div>
          <Button 
            onClick={refreshData} 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <BatteryStatusCard 
            battery={battery} 
            isLoading={isLoading} 
          />
          <Card className="col-span-2 backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Battery History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : battery ? (
                <CapacityChart 
                  batteries={[battery]} 
                  timeRange={90} 
                  isLoading={isLoading}
                  detailed
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Usage Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : usagePattern ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Charging Frequency</span>
                      </div>
                      <div className="px-4 py-3 bg-secondary/20 rounded-md">
                        {usagePattern.chargingFrequency}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Discharge Rate</span>
                      </div>
                      <div className="px-4 py-3 bg-secondary/20 rounded-md">
                        {usagePattern.dischargeRate.toFixed(1)}% per hour
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Temperature Exposure</span>
                      </div>
                      <div className="px-4 py-3 bg-secondary/20 rounded-md">
                        {usagePattern.temperatureExposure}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Typical Usage</span>
                      </div>
                      <div className="px-4 py-3 bg-secondary/20 rounded-md">
                        {usagePattern.typicalUsage}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/30">
                    <h3 className="text-sm font-medium mb-2">Usage Analysis</h3>
                    <p className="text-muted-foreground text-sm">
                      This battery has a {usagePattern.dischargeRate < 3 ? 'low' : usagePattern.dischargeRate < 5 ? 'moderate' : 'high'} discharge rate 
                      with {usagePattern.chargingFrequency.toLowerCase()} charging frequency. 
                      {usagePattern.temperatureExposure === 'High' ? 
                        ' High temperature exposure may accelerate degradation.' : 
                        usagePattern.temperatureExposure === 'Low' ? 
                        ' Low temperature exposure may affect discharge performance.' : 
                        ' Temperature exposure is within normal range.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No usage pattern data available
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      className={`p-4 rounded-md border ${
                        rec.type === 'Maintenance' ? 'border-primary/30 bg-primary/5' :
                        rec.type === 'Replacement' ? 'border-destructive/30 bg-destructive/5' :
                        'border-warning/30 bg-warning/5'
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <div className={`text-sm font-medium ${
                          rec.type === 'Maintenance' ? 'text-primary' :
                          rec.type === 'Replacement' ? 'text-destructive' :
                          'text-warning'
                        }`}>
                          {rec.type}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {rec.resolved ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-success" />
                              <span className="text-success">Resolved</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3 text-warning" />
                              <span className="text-warning">Open</span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{rec.message}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Created: {formatDate(rec.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No recommendations available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mb-12">
          <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Battery Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : history && history.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 h-full w-px bg-border"></div>
                  <div className="space-y-6 ml-10">
                    {battery && (
                      <div className="relative">
                        <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full border-2 border-primary bg-background"></div>
                        <div>
                          <h3 className="font-medium">Battery Added</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(battery.initialDate)}</p>
                          <p className="text-sm mt-1">Initial capacity: {battery.initialCapacity} mAh</p>
                        </div>
                      </div>
                    )}
                    
                    {[...history]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={item.id} className="relative">
                          <div className={`absolute -left-10 mt-1 h-4 w-4 rounded-full border-2 ${
                            item.healthPercentage > 80 ? 'border-success bg-success/20' :
                            item.healthPercentage > 50 ? 'border-warning bg-warning/20' :
                            'border-destructive bg-destructive/20'
                          }`}></div>
                          <div>
                            <h3 className="font-medium">Health Check</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(item.date)}</p>
                            <div className="grid grid-cols-3 gap-4 mt-1 text-sm">
                              <div>
                                <span className="text-muted-foreground">Health: </span>
                                <span className={
                                  item.healthPercentage > 80 ? 'text-success' :
                                  item.healthPercentage > 50 ? 'text-warning' :
                                  'text-destructive'
                                }>{item.healthPercentage.toFixed(1)}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Capacity: </span>
                                <span>{item.capacity} mAh</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cycles: </span>
                                <span>{Math.floor(item.cycleCount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    
                    {history.length > 5 && (
                      <div className="relative">
                        <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full border-2 border-border bg-background"></div>
                        <div>
                          <Button variant="link" className="text-sm -ml-4">
                            View More History
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No historical data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}