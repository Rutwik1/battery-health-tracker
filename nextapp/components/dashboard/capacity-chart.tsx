'use client';

import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';
import { Battery, BatteryHistory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateToMonthDay, generateChartColors } from '@/lib/utils';

interface CapacityChartProps {
  batteries: Battery[];
  batteryHistories: Map<number, BatteryHistory[]>;
  timeRange: number; // Days
  isLoading: boolean;
  detailed?: boolean;
}

interface ChartData {
  date: string;
  originalDate: string;
  [key: string]: string | number;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center">
              <div 
                className="h-2 w-2 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs">{entry.name}: </span>
              <span className="text-xs font-medium ml-1">
                {typeof entry.value === 'number' 
                  ? `${(entry.value / 1000).toFixed(1)} kWh` 
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function CapacityChart({ 
  batteries, 
  batteryHistories, 
  timeRange, 
  isLoading, 
  detailed = false 
}: CapacityChartProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    if (isLoading || batteries.length === 0) {
      return [];
    }
    
    const data: ChartData[] = [];
    const dateMap = new Map<string, ChartData>();
    
    // Process each battery's history
    batteries.forEach((battery, batteryIndex) => {
      const history = batteryHistories.get(battery.id) || [];
      
      // Limit to timeRange days
      const limitedHistory = history.slice(-timeRange);
      
      limitedHistory.forEach(entry => {
        const date = new Date(entry.date);
        const formattedDate = formatDateToMonthDay(date);
        const originalDate = format(date, 'yyyy-MM-dd');
        
        // Add date to map if not present
        if (!dateMap.has(originalDate)) {
          dateMap.set(originalDate, { date: formattedDate, originalDate });
        }
        
        // Add capacity data for this battery
        const existingData = dateMap.get(originalDate);
        if (existingData) {
          existingData[`${battery.name}`] = entry.capacity;
        }
      });
    });
    
    // Convert map to array and sort by date
    const sortedData = Array.from(dateMap.values()).sort((a, b) => {
      return new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime();
    });
    
    return sortedData;
  }, [batteries, batteryHistories, isLoading, timeRange]);
  
  // Get colors for each battery
  const getBatteryColors = (index: number) => {
    return generateChartColors(index);
  };
  
  // Calculate y-axis domain
  const yAxisDomain = useMemo(() => {
    if (batteries.length === 0) return [0, 15000]; // Default domain
    
    // Find min and max capacity values
    let minValue = Number.MAX_SAFE_INTEGER;
    let maxValue = 0;
    
    batteries.forEach(battery => {
      const history = batteryHistories.get(battery.id) || [];
      history.forEach(entry => {
        minValue = Math.min(minValue, entry.capacity);
        maxValue = Math.max(maxValue, entry.capacity);
      });
    });
    
    // Add padding
    minValue = Math.max(0, minValue * 0.9);
    maxValue = maxValue * 1.1;
    
    return [minValue, maxValue];
  }, [batteries, batteryHistories]);
  
  // Calculate reference lines (average capacity)
  const referenceLines = useMemo(() => {
    return batteries.map(battery => {
      const history = batteryHistories.get(battery.id) || [];
      
      if (history.length === 0) return null;
      
      // Calculate average capacity
      const totalCapacity = history.reduce((sum, entry) => sum + entry.capacity, 0);
      const averageCapacity = totalCapacity / history.length;
      
      return {
        name: `Avg. ${battery.name}`,
        value: averageCapacity,
        color: getBatteryColors(batteries.indexOf(battery)).strokeColor
      };
    }).filter(Boolean);
  }, [batteries, batteryHistories]);
  
  if (isLoading) {
    return (
      <Card className="h-full shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Capacity Over Time</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Capacity Over Time</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                className="dark:text-gray-400 text-gray-600"
              />
              <YAxis 
                domain={yAxisDomain}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)} kWh`}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                className="dark:text-gray-400 text-gray-600"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Battery capacity lines */}
              {batteries.map((battery, index) => {
                const colors = getBatteryColors(index);
                return (
                  <Line
                    key={battery.id}
                    type="monotone"
                    dataKey={battery.name}
                    name={battery.name}
                    stroke={colors.strokeColor}
                    fill={colors.fillColor}
                    strokeWidth={2}
                    dot={detailed ? { r: 4 } : false}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
              
              {/* Reference lines for averages */}
              {detailed && referenceLines.map((line, index) => (
                line && (
                  <ReferenceLine
                    key={`ref-${index}`}
                    y={line.value}
                    stroke={line.color}
                    strokeDasharray="3 3"
                    label={{
                      position: 'right',
                      value: `Avg ${(line.value / 1000).toFixed(1)} kWh`,
                      fontSize: 11,
                      fill: line.color
                    }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart legend */}
        <div className="mt-4 flex flex-wrap gap-3">
          {batteries.map((battery, index) => {
            const colors = getBatteryColors(index);
            return (
              <div key={`legend-${battery.id}`} className="flex items-center text-xs">
                <div 
                  className="h-3 w-3 rounded-full mr-1" 
                  style={{ backgroundColor: colors.strokeColor }}
                />
                <span>{battery.name} ({(battery.capacity / 1000).toFixed(1)} kWh)</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}