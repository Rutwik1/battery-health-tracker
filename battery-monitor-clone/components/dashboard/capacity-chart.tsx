'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { LineChartIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getBatteryStatusColor } from '@/lib/utils';

interface CapacityChartProps {
  batteries: Battery[];
  timeRange: number;
  isLoading: boolean;
  detailed?: boolean;
}

export default function CapacityChart({ 
  batteries, 
  timeRange, 
  isLoading, 
  detailed = false 
}: CapacityChartProps) {
  const [selectedBatteries, setSelectedBatteries] = useState<number[]>([]);

  // Get color for a battery line based on its status
  const getLineColors = (battery: Battery) => {
    switch (battery.status) {
      case 'Good':
        return { stroke: 'hsl(var(--success))', fill: 'hsl(var(--success) / 0.2)' };
      case 'Fair':
        return { stroke: 'hsl(var(--warning))', fill: 'hsl(var(--warning) / 0.2)' };
      case 'Poor':
        return { stroke: 'hsl(var(--destructive) / 0.7)', fill: 'hsl(var(--destructive) / 0.1)' };
      case 'Critical':
        return { stroke: 'hsl(var(--destructive))', fill: 'hsl(var(--destructive) / 0.2)' };
      default:
        return { stroke: 'hsl(var(--primary))', fill: 'hsl(var(--primary) / 0.2)' };
    }
  };

  // Generate data points for the chart
  const chartData = useMemo(() => {
    // In a real app, you'd fetch history for each battery and process it
    const data: any[] = [];
    
    // Generate data points for the last timeRange days
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - timeRange);
    
    // Generate a data point for each day in the range
    for (let i = 0; i <= timeRange; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dataPoint: any = {
        date: format(date, 'MMM d'),
        timestamp: date.getTime(),
      };
      
      // Calculate health percentage for each battery at this date
      batteries.forEach(battery => {
        const percentageOfTimeRange = i / timeRange;
        const healthDifference = battery.initialCapacity - battery.currentCapacity;
        const capacityAtThisPoint = Math.round(
          battery.initialCapacity - (healthDifference * percentageOfTimeRange)
        );
        
        dataPoint[`battery-${battery.id}`] = capacityAtThisPoint;
      });
      
      data.push(dataPoint);
    }
    
    return data;
  }, [batteries, timeRange]);

  return (
    <Card className="bg-card/30 border border-border/30 rounded-xl shadow-xl shadow-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5 text-primary" />
            Battery Capacity Trend
          </span>
          <span className="text-xs text-muted-foreground">
            Last {timeRange} days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  {batteries.map(battery => {
                    const colors = getLineColors(battery);
                    return (
                      <linearGradient 
                        key={`gradient-${battery.id}`}
                        id={`gradient-${battery.id}`} 
                        x1="0" 
                        y1="0" 
                        x2="0" 
                        y2="1"
                      >
                        <stop 
                          offset="5%" 
                          stopColor={colors.stroke} 
                          stopOpacity={0.6}
                        />
                        <stop 
                          offset="95%" 
                          stopColor={colors.stroke} 
                          stopOpacity={0}
                        />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  unit=" mAh"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--popover-foreground))'
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                  formatter={(value: number, name: string) => {
                    const batteryId = parseInt(name.split('-')[1]);
                    const battery = batteries.find(b => b.id === batteryId);
                    return [`${value} mAh`, battery?.name || name];
                  }}
                />
                <Legend 
                  formatter={(value: string) => {
                    const batteryId = parseInt(value.split('-')[1]);
                    const battery = batteries.find(b => b.id === batteryId);
                    return battery?.name || value;
                  }}
                />
                {batteries.map(battery => {
                  const colors = getLineColors(battery);
                  return (
                    <Area
                      key={`battery-${battery.id}`}
                      type="monotone"
                      dataKey={`battery-${battery.id}`}
                      name={`battery-${battery.id}`}
                      stroke={colors.stroke}
                      fill={`url(#gradient-${battery.id})`}
                      activeDot={{ r: 6, stroke: colors.stroke, strokeWidth: 2 }}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}